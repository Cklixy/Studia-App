// Captura de maquetas HTML locales. Uso: node maquetas.mjs [--ancho=900] <html...>
import { chromium } from "playwright-core";
const args = process.argv.slice(2);
const ancho = Number((args.find((a) => a.startsWith("--ancho=")) || "--ancho=900").split("=")[1]);
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const p = await b.newPage({ viewport: { width: ancho, height: 900 } });
for (const f of args.filter((a) => !a.startsWith("--"))) {
  await p.goto("file:///" + f.split("\\").join("/"), { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  await p.screenshot({ path: f.replace(/\.html$/, ".png"), fullPage: true });
  console.log("ok", f);
}
await b.close();
