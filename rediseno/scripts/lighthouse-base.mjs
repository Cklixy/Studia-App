// Rediseño · Fase 0: Lighthouse de páginas públicas de producción (móvil y escritorio), 3 ejecuciones → mediana.
import fs from "node:fs";
import puppeteer from "puppeteer-core";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const BASE = "https://studia-app-one.vercel.app";
const OUT = "C:/Users/Juan/Documents/Studia-App/rediseno/antes/lighthouse";
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox"] });
const port = new URL(browser.wsEndpoint()).port;
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const filas = [];
for (const ruta of ["/", "/login"]) {
  for (const modo of ["movil", "escritorio"]) {
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const r = await lighthouse(BASE + ruta, { port, output: "json", logLevel: "error" }, modo === "escritorio" ? desktopConfig : undefined);
      const lhr = r.lhr;
      const js = lhr.audits["network-requests"].details.items.filter((x) => x.resourceType === "Script").reduce((s, x) => s + (x.transferSize || 0), 0);
      const fuentes = lhr.audits["network-requests"].details.items.filter((x) => x.resourceType === "Font").reduce((s, x) => s + (x.transferSize || 0), 0);
      runs.push({ perf: lhr.categories.performance.score * 100, a11y: lhr.categories.accessibility.score * 100, bp: lhr.categories["best-practices"].score * 100, seo: lhr.categories.seo.score * 100,
        lcp: lhr.audits["largest-contentful-paint"].numericValue, cls: lhr.audits["cumulative-layout-shift"].numericValue, tbt: lhr.audits["total-blocking-time"].numericValue,
        fcp: lhr.audits["first-contentful-paint"].numericValue, jsKB: js / 1024, fuentesKB: fuentes / 1024, totalKB: lhr.audits["total-byte-weight"].numericValue / 1024 });
      if (i === 0) fs.writeFileSync(`${OUT}/${ruta === "/" ? "landing" : "login"}-${modo}.json`, JSON.stringify(lhr));
    }
    const f = { ruta, modo };
    for (const k of Object.keys(runs[0])) f[k] = Math.round(med(runs.map((r) => r[k])) * (k === "cls" ? 1000 : 1)) / (k === "cls" ? 1000 : 1);
    filas.push(f); console.log(JSON.stringify(f));
  }
}
fs.writeFileSync(`${OUT}/resumen.json`, JSON.stringify(filas, null, 1));
await browser.close();
