// Fotografías de depuración desde cámaras arbitrarias: node tests/shoot.mjs out_dir "t,px,py,pz,tx,ty,tz,f" ...
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import path from "node:path"; import { fileURLToPath } from "node:url"; import { mkdirSync } from "node:fs";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2]; mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--allow-file-access-from-files"] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on("pageerror", (e) => console.log("pageerror", e.message)); p.on("console", (m) => { if (m.type() === "error") console.log("console", m.text()); });
await p.goto("file://" + dir + "/index.html"); await p.waitForFunction(() => window.__shoot); await p.evaluate(() => document.fonts.ready);
let i = 0;
for (const a of process.argv.slice(3)) { const v = a.split(",").map(Number); const o = v.length > 1 ? { pos: v.slice(1, 4), tgt: v.slice(4, 7), f: v[7] } : null;
  await p.evaluate(([t, o]) => window.__shoot(t, o), [v[0], o]); await p.locator("#gl").screenshot({ path: `${out}/s${String(i++).padStart(2, "0")}.png` }); }
await b.close();
