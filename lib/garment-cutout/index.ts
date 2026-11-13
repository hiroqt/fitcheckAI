"use client";

// Removes the background from an uploaded garment photo entirely in the browser, so the
// reference image sent to Decart is the garment alone, matching the built-in cutouts.
// Model: U-2-Netp (Apache-2.0), run on ONNX Runtime Web; see public/models/NOTICE.md.

import { MODEL_EDGE, alreadyCutOut, coverage, keepLargestRegion, opaqueBounds, toAlpha, toModelInput } from "./mask";

const MODEL_URL = "/models/u2netp.onnx";
const INPUT_NAME = "input.1";
const MAX_OUTPUT_EDGE = 1536;
const TRIM_PADDING = 0.02;
const MIN_COVERAGE = 0.005;
const MAX_COVERAGE = 0.985;

export class GarmentCutoutError extends Error {}

type Session = { run: (feeds: Record<string, unknown>) => Promise<Record<string, { data: Float32Array }>>; outputNames: readonly string[] };
let session: Promise<Session> | null = null;

async function load() {
  if (!session) {
    session = (async () => {
      const ort = await import("onnxruntime-web/wasm");
      ort.env.wasm.wasmPaths = "/ort/";
      ort.env.wasm.numThreads = 1;
      const created = await ort.InferenceSession.create(MODEL_URL, { executionProviders: ["wasm"], graphOptimizationLevel: "all" });
      return { session: created, Tensor: ort.Tensor };
    })().then(({ session: created, Tensor }) => ({
      outputNames: created.outputNames,
      run: (feeds: Record<string, unknown>) => created.run({ [INPUT_NAME]: new Tensor("float32", feeds[INPUT_NAME] as Float32Array, [1, 3, MODEL_EDGE, MODEL_EDGE]) }) as Promise<Record<string, { data: Float32Array }>>,
    })).catch((error) => {
      session = null;
      throw error;
    });
  }
  return session;
}

/** Starts fetching the runtime and weights before the person picks a file. Safe to call repeatedly. */
export function prepareGarmentCutout() {
  void load().catch(() => { /* The upload path reports the failure when it happens for real. */ });
}

function context(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const target = canvas.getContext("2d", { willReadFrequently: true });
  if (!target) throw new GarmentCutoutError("This browser cannot prepare garment images.");
  return target;
}

/**
 * Returns the garment on a transparent background as a PNG, trimmed to the garment.
 * `removed` is false when the upload already had a transparent background and was left alone.
 */
export async function removeGarmentBackground(file: File): Promise<{ file: File; removed: boolean }> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new GarmentCutoutError("This garment image could not be read. Try a JPG, PNG, or WebP.");
  });
  try {
    const scale = Math.min(1, MAX_OUTPUT_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const base = context(width, height);
    base.drawImage(bitmap, 0, 0, width, height);
    const image = base.getImageData(0, 0, width, height);
    if (alreadyCutOut(image.data)) return { file: await encode(base.canvas, image, width, height), removed: false };

    const square = context(MODEL_EDGE, MODEL_EDGE);
    square.fillStyle = "#ffffff";
    square.fillRect(0, 0, MODEL_EDGE, MODEL_EDGE);
    square.drawImage(bitmap, 0, 0, MODEL_EDGE, MODEL_EDGE);

    const model = await load().catch(() => {
      throw new GarmentCutoutError("Background removal could not load. Check your connection and try again.");
    });
    const output = await model.run({ [INPUT_NAME]: toModelInput(square.getImageData(0, 0, MODEL_EDGE, MODEL_EDGE).data) });
    const mask = keepLargestRegion(toAlpha(output[model.outputNames[0]].data), MODEL_EDGE, MODEL_EDGE);
    const found = coverage(mask);
    if (found < MIN_COVERAGE || found > MAX_COVERAGE) {
      throw new GarmentCutoutError("The garment could not be separated from its background. Try a photo of the garment on a plainer background.");
    }

    // Carry the 320px matte back to full size through canvas filtering, then multiply it in.
    const matte = context(MODEL_EDGE, MODEL_EDGE);
    const matteData = matte.createImageData(MODEL_EDGE, MODEL_EDGE);
    for (let pixel = 0; pixel < mask.length; pixel += 1) {
      matteData.data[pixel * 4] = 255;
      matteData.data[pixel * 4 + 1] = 255;
      matteData.data[pixel * 4 + 2] = 255;
      matteData.data[pixel * 4 + 3] = mask[pixel];
    }
    matte.putImageData(matteData, 0, 0);
    const scaled = context(width, height);
    scaled.imageSmoothingEnabled = true;
    scaled.imageSmoothingQuality = "high";
    scaled.drawImage(matte.canvas, 0, 0, width, height);
    const scaledMatte = scaled.getImageData(0, 0, width, height).data;

    const alpha = new Uint8ClampedArray(width * height);
    for (let pixel = 0; pixel < alpha.length; pixel += 1) {
      const value = Math.round((image.data[pixel * 4 + 3] * scaledMatte[pixel * 4 + 3]) / 255);
      image.data[pixel * 4 + 3] = value;
      alpha[pixel] = value;
    }
    return { file: await encode(base.canvas, image, width, height, opaqueBounds(alpha, width, height, TRIM_PADDING)), removed: true };
  } finally {
    bitmap.close();
  }
}

async function encode(canvas: HTMLCanvasElement, image: ImageData, width: number, height: number, bounds?: ReturnType<typeof opaqueBounds>) {
  const target = context(bounds?.width ?? width, bounds?.height ?? height);
  const source = context(width, height);
  source.putImageData(image, 0, 0);
  target.drawImage(source.canvas, bounds?.left ?? 0, bounds?.top ?? 0, target.canvas.width, target.canvas.height, 0, 0, target.canvas.width, target.canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => target.canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new GarmentCutoutError("This garment image could not be prepared.");
  canvas.width = 0;
  canvas.height = 0;
  return new File([blob], "garment.png", { type: "image/png" });
}
