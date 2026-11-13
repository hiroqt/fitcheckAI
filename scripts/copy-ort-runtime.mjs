// Serves the ONNX Runtime Web WASM binary from our own origin so the in-browser garment
// cutout needs no third-party CDN. Copied from node_modules at build time rather than
// committed, so it always matches the installed onnxruntime-web version.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const target = join(process.cwd(), "public", "ort");
mkdirSync(target, { recursive: true });
for (const file of ["ort-wasm-simd-threaded.wasm", "ort-wasm-simd-threaded.mjs"]) {
  copyFileSync(require.resolve(`onnxruntime-web/${file}`), join(target, file));
}
