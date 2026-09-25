// axe-core (WCAG 2.2 A/AA + buenas prácticas) sobre rutas, en 390 y 1440 px, claro y oscuro.
// Uso: node axe.mjs <baseUrl> <salida.json> <rutas separadas por coma>   (rutas privadas con prefijo "!")
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const [base, salida, rutasArg] = process.argv.slice(2);
const REPO = "C:/Users/Juan/Documents/Studia-App";
const AXE = fs.readFileSync(path.resolve("node_modules/axe-core/axe.min.js"), "utf8");
const env = Object.fromEntries(fs.readFileSync(`${REPO}/.env.test.local`, "utf8").split(/\r?\n/).filter((l) => l.includes("="))
  .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const rutas = rutasArg.split(",");
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const resultado = [];
for (const [w, h, movil] of [[390, 844, true], [1440, 900, false]]) {
  for (const esquema of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: movil, hasTouch: movil, locale: "es-CO", colorScheme: esquema });
    await ctx.addInitScript(() => { try { localStorage.setItem("studia_onboarding_v1_done", "true"); } catch {} });
    const page = await ctx.newPage();
    let sesion = false;
    for (const r of rutas) {
      const privada = r.startsWith("!");
      const ruta = privada ? r.slice(1) : r;
      if (privada && !sesion) {
        await page.goto(base + "/login", { waitUntil: "networkidle" });
        await page.fill('input[name="email"]', env.TEST_USER_EMAIL);
        await page.fill('input[name="password"]', env.TEST_USER_PASSWORD);
        await Promise.all([page.waitForURL(/\/(hoy|materias)/, { timeout: 30000 }), page.click('button[type="submit"], button[formaction], form button:not([type="button"])')]);
        sesion = true;
      }
      await page.goto(base + ruta, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await page.addScriptTag({ content: AXE });
      const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }));
      const v = res.violations.map((x) => ({ id: x.id, impacto: x.impact, nodos: x.nodes.length, ejemplo: x.nodes[0]?.target.join(" "), resumen: (x.nodes[0]?.failureSummary || "").slice(0, 200) }));
      resultado.push({ ruta, vp: w, esquema, violaciones: v });
      console.log(`${ruta} ${w} ${esquema}: ${v.length ? v.map((x) => `${x.id}(${x.nodos})`).join(", ") : "0 violaciones"}`);
    }
    await ctx.close();
  }
}
fs.writeFileSync(salida, JSON.stringify(resultado, null, 1));
await browser.close();
