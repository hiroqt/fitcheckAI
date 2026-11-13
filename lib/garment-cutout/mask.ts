// Pure pixel math for the in-browser garment cutout. Kept free of DOM and model
// APIs so it can be unit tested in Node; the canvas and ONNX glue lives in ./index.ts.

export const MODEL_EDGE = 320;
const MEAN = [0.485, 0.456, 0.406] as const;
const STD = [0.229, 0.224, 0.225] as const;
const ALPHA_LOW = 0.1;
const ALPHA_HIGH = 0.65;
const OPAQUE = 128;

export type Bounds = { left: number; top: number; width: number; height: number };

/** RGBA pixels of a MODEL_EDGE square to the model's normalised NCHW input. */
export function toModelInput(rgba: Uint8ClampedArray | Uint8Array, edge = MODEL_EDGE) {
  const pixels = edge * edge;
  if (rgba.length !== pixels * 4) throw new Error(`Expected ${pixels * 4} RGBA bytes, received ${rgba.length}.`);
  const input = new Float32Array(pixels * 3);
  for (let pixel = 0; pixel < pixels; pixel += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      input[channel * pixels + pixel] = (rgba[pixel * 4 + channel] / 255 - MEAN[channel]) / STD[channel];
    }
  }
  return input;
}

/**
 * Saliency scores to an 8-bit alpha matte: rescaled to the mask's own range, then
 * eased so background haze clears to fully transparent while garment edges stay soft.
 */
export function toAlpha(mask: Float32Array, low = ALPHA_LOW, high = ALPHA_HIGH) {
  let min = Infinity;
  let max = -Infinity;
  for (const score of mask) {
    if (score < min) min = score;
    if (score > max) max = score;
  }
  const span = max - min;
  const alpha = new Uint8ClampedArray(mask.length);
  for (let index = 0; index < mask.length; index += 1) {
    const scaled = span > 1e-6 ? (mask[index] - min) / span : 0;
    const eased = Math.min(1, Math.max(0, (scaled - low) / (high - low)));
    alpha[index] = Math.round(255 * eased * eased * (3 - 2 * eased));
  }
  return alpha;
}

/** Share of the matte the garment covers, used to reject a mask that found nothing or everything. */
export function coverage(alpha: Uint8ClampedArray | Uint8Array) {
  let opaque = 0;
  for (const value of alpha) if (value >= OPAQUE) opaque += 1;
  return alpha.length ? opaque / alpha.length : 0;
}

/** Tightest box holding the garment, grown by `padding` (a share of the longest edge). */
export function opaqueBounds(alpha: Uint8ClampedArray | Uint8Array, width: number, height: number, padding = 0): Bounds | null {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (alpha[y * width + x] < OPAQUE) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < 0) return null;
  const margin = Math.round(Math.max(width, height) * padding);
  left = Math.max(0, left - margin);
  top = Math.max(0, top - margin);
  right = Math.min(width - 1, right + margin);
  bottom = Math.min(height - 1, bottom + margin);
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/** True when the upload is already a cutout, so running segmentation would only degrade it. */
export function alreadyCutOut(rgba: Uint8ClampedArray | Uint8Array) {
  let transparent = 0;
  const pixels = rgba.length / 4;
  for (let pixel = 0; pixel < pixels; pixel += 1) if (rgba[pixel * 4 + 3] < 16) transparent += 1;
  return pixels > 0 && transparent / pixels > 0.05;
}

/**
 * Drops every matte region except the largest, clearing stray background blobs the
 * model scored weakly. Garments are a single subject, so the biggest region is it.
 */
export function keepLargestRegion(alpha: Uint8ClampedArray, width: number, height: number) {
  const labels = new Int32Array(width * height).fill(-1);
  const queue = new Int32Array(width * height);
  let bestLabel = -1;
  let bestSize = 0;
  let label = 0;
  for (let start = 0; start < labels.length; start += 1) {
    if (labels[start] !== -1 || alpha[start] < OPAQUE) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    labels[start] = label;
    while (head < tail) {
      const index = queue[head++];
      const x = index % width;
      const y = (index - x) / width;
      if (x > 0) { const next = index - 1; if (labels[next] === -1 && alpha[next] >= OPAQUE) { labels[next] = label; queue[tail++] = next; } }
      if (x < width - 1) { const next = index + 1; if (labels[next] === -1 && alpha[next] >= OPAQUE) { labels[next] = label; queue[tail++] = next; } }
      if (y > 0) { const next = index - width; if (labels[next] === -1 && alpha[next] >= OPAQUE) { labels[next] = label; queue[tail++] = next; } }
      if (y < height - 1) { const next = index + width; if (labels[next] === -1 && alpha[next] >= OPAQUE) { labels[next] = label; queue[tail++] = next; } }
    }
    if (tail > bestSize) { bestSize = tail; bestLabel = label; }
    label += 1;
  }
  if (bestLabel === -1) return alpha;
  for (let index = 0; index < alpha.length; index += 1) if (labels[index] !== bestLabel) alpha[index] = 0;
  return alpha;
}
