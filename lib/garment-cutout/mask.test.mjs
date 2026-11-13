import assert from "node:assert/strict";
import { test } from "node:test";

const { MODEL_EDGE, alreadyCutOut, coverage, keepLargestRegion, opaqueBounds, toAlpha, toModelInput } = await import("./mask.ts");

test("normalises RGBA pixels into the model's NCHW input", () => {
  const rgba = new Uint8ClampedArray(MODEL_EDGE * MODEL_EDGE * 4).fill(255);
  const input = toModelInput(rgba);
  const pixels = MODEL_EDGE * MODEL_EDGE;
  assert.equal(input.length, pixels * 3);
  // White stays white: (1 - mean) / std, per channel, alpha ignored.
  assert.ok(Math.abs(input[0] - (1 - 0.485) / 0.229) < 1e-5);
  assert.ok(Math.abs(input[pixels] - (1 - 0.456) / 0.224) < 1e-5);
  assert.ok(Math.abs(input[pixels * 2] - (1 - 0.406) / 0.225) < 1e-5);
  assert.throws(() => toModelInput(new Uint8ClampedArray(8)), /Expected/);
});

test("eases scores into a matte that clears haze and keeps the subject", () => {
  const alpha = toAlpha(Float32Array.from([0, 0.05, 0.5, 1]));
  assert.equal(alpha[0], 0, "the weakest score becomes fully transparent");
  assert.equal(alpha[3], 255, "the strongest score becomes fully opaque");
  assert.ok(alpha[1] < 32, "near-background haze is cleared");
  assert.ok(alpha[2] > alpha[1] && alpha[2] < 255, "mid scores stay soft");
  assert.deepEqual(Array.from(toAlpha(Float32Array.from([0.4, 0.4]))), [0, 0], "a flat mask finds nothing");
});

test("measures coverage so empty and whole-frame masks can be rejected", () => {
  assert.equal(coverage(Uint8ClampedArray.from([0, 0, 0, 0])), 0);
  assert.equal(coverage(Uint8ClampedArray.from([255, 255, 0, 0])), 0.5);
  assert.equal(coverage(Uint8ClampedArray.from([127, 128])), 0.5, "128 counts as opaque");
});

test("keeps only the largest region, dropping stray background blobs", () => {
  // 5x5: a 3x3 garment block top-left, plus one stray speck bottom-right.
  const width = 5;
  const height = 5;
  const alpha = new Uint8ClampedArray(width * height);
  for (let y = 0; y < 3; y += 1) for (let x = 0; x < 3; x += 1) alpha[y * width + x] = 255;
  alpha[4 * width + 4] = 255;
  keepLargestRegion(alpha, width, height);
  assert.equal(alpha[4 * width + 4], 0, "the speck is removed");
  assert.equal(coverage(alpha), 9 / 25, "the garment block survives intact");
});

test("finds the garment's box and pads it without leaving the frame", () => {
  const width = 10;
  const height = 10;
  const alpha = new Uint8ClampedArray(width * height);
  for (let y = 4; y <= 6; y += 1) for (let x = 3; x <= 5; x += 1) alpha[y * width + x] = 255;
  assert.deepEqual(opaqueBounds(alpha, width, height), { left: 3, top: 4, width: 3, height: 3 });
  assert.deepEqual(opaqueBounds(alpha, width, height, 0.2), { left: 1, top: 2, width: 7, height: 7 });
  const edge = new Uint8ClampedArray(width * height);
  edge[0] = 255;
  assert.deepEqual(opaqueBounds(edge, width, height, 0.5), { left: 0, top: 0, width: 6, height: 6 }, "padding is clipped to the frame");
  assert.equal(opaqueBounds(new Uint8ClampedArray(width * height), width, height), null, "an empty matte has no box");
});

test("detects uploads that are already cutouts", () => {
  const opaque = new Uint8ClampedArray(100 * 4);
  for (let pixel = 0; pixel < 100; pixel += 1) opaque[pixel * 4 + 3] = 255;
  assert.equal(alreadyCutOut(opaque), false);
  const cutout = opaque.slice();
  for (let pixel = 0; pixel < 20; pixel += 1) cutout[pixel * 4 + 3] = 0;
  assert.equal(alreadyCutOut(cutout), true);
  const speck = opaque.slice();
  speck[3] = 0;
  assert.equal(alreadyCutOut(speck), false, "a few stray transparent pixels are not a cutout");
});
