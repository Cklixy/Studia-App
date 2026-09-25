// RediseÃ±o Â· Fase 0: capturas "antes" de producciÃ³n en 390x844 y 1440x900, claro y oscuro.
// Solo lectura: login con la cuenta de prueba (credenciales desde .env.test.local, nunca se imprimen).
import fs from "node:fs";
import { chromium } from "playwright-core";

const BASE = "https://studia-app-one.vercel.app";
const REPO = "C:/Users/Juan/Documents/Studia-App";
const OUT = `${REPO}/rediseno/antes`;
fs.mkdirSync(OUT, { recursive: true });
const env = Object.fromEntries(fs.readFileSync(`${REPO}/.env.test.local`, "utf8").split(/\r?\n/).filter((l) => l.includes("="))
  .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));

const VPS = [["390x844", 390, 844, true], ["1440x900", 1440, 900, false]];
const ESQUEMAS = ["light", "dark"];
const publicas = [["landing", "/"], ["login", "/login"], ["registro", "/registro"], ["recuperar", "/recuperar"], ["404", "/ruta-que-no-existe"]];
const privadas = [["inicio", "/materias"], ["sesion-nueva", "/sesion/nueva"], ["sesion-activa", "/sesion/activa"], ["parciales", "/evaluaciones"],
  ["progreso-historial", "/historial"], ["progreso-logros", "/logros"], ["rutas", "/rutas"], ["rutas-crear", "/rutas/crear"], ["ajustes", "/ajustes"]];

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const resumen = [];

for (const [vpN, w, h, movil] of VPS) {
  for (const esquema of ESQUEMAS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: movil, hasTouch: movil, locale: "es-CO", colorScheme: esquema,
      userAgent: movil ? "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36" : undefined,
    });
    // El tour de bienvenida taparÃ­a todas las pantallas: se marca como visto (solo localStorage del navegador de prueba)
    await ctx.addInitScript(() => { try { for (const k of ["studia_onboarding_v1_done"]) localStorage.setItem(k, "true"); } catch {} });
    const page = await ctx.newPage();
    const shot = async (nombre, ruta) => {
      await page.goto(BASE + ruta, { waitUntil: "networkidle" });
      await page.waitForTimeout(900);
      const f = `${nombre}__${vpN}__${esquema === "light" ? "claro" : "oscuro"}.jpg`;
      await page.screenshot({ path: `${OUT}/${f}`, fullPage: true, type: "jpeg", quality: 60 });
      const h1 = await page.locator("h1").count();
      const alto = await page.evaluate(() => document.documentElement.scrollHeight);
      resumen.push({ f, url: page.url().replace(BASE, ""), h1, alto });
      console.log(f, page.url().replace(BASE, ""), "h1:", h1, "alto:", alto);
    };
    for (const [n, r] of publicas) await shot(n, r);
    await page.goto(BASE + "/login", { waitUntil: "networkidle" });
    await page.fill('input[name="email"]', env.TEST_USER_EMAIL);
    await page.fill('input[name="password"]', env.TEST_USER_PASSWORD);
    await Promise.all([page.waitForURL(/\/materias/, { timeout: 30000 }), page.click("button[formaction]")]);
    for (const [n, r] of privadas) await shot(n, r);
    await ctx.close();
  }
}
fs.writeFileSync(`${OUT}/_indice.json`, JSON.stringify(resumen, null, 1));
await browser.close();

