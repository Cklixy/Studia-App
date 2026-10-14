import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import path from "node:path"; import { fileURLToPath } from "node:url"; import { mkdirSync } from "node:fs";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const page0 = process.argv[4] || "test_actor.html";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--allow-file-access-from-files"] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on("pageerror", (e) => console.log("pageerror", e.message)); p.on("console", (m) => { if (["error", "warning"].includes(m.type())) console.log("console", m.text().slice(0, 300)); });
await p.goto("file://" + dir + "/" + page0); await p.waitForFunction(() => window.__t); await p.evaluate(() => document.fonts.ready);
mkdirSync(process.argv[2], { recursive: true }); const cases = JSON.parse(process.argv[3]); const t0 = Date.now();
for (let i = 0; i < cases.length; i++) { await p.evaluate((o) => window.__t(o), cases[i]); await p.locator("#gl").screenshot({ path: `${process.argv[2]}/a${i}.png` }); }
console.log("ms/frame", ((Date.now() - t0) / cases.length).toFixed(0)); await b.close();
