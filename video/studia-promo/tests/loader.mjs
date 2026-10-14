import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
export const THREE = require("three");
globalThis.THREE = THREE;
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../lib");
export function load(...files) { for (const f of files) vm.runInThisContext(readFileSync(path.join(dir, f), "utf8"), { filename: f }); return globalThis.Cine; }
