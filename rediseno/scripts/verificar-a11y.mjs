// Fase 6: verificación manual automatizada (teclado, reflow 320 px, zoom 200 %, daltonismo y movimiento reducido).
// Uso: node verificar-a11y.mjs <baseUrl> <salida>   · Solo lectura (no envía formularios).
import fs from "node:fs";
import { chromium } from "playwright-core";

const [base, salida] = process.argv.slice(2);
const REPO = "C:/Users/Juan/Documents/Studia-App";
const env = Object.fromEntries(fs.readFileSync(`${REPO}/.env.test.local`, "utf8").split(/\r?\n/).filter((l) => l.includes("="))
  .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
fs.mkdirSync(salida, { recursive: true });
const informe = {};
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

async function contexto(opts = {}) {
  const ctx = await browser.newContext({ locale: "es-CO", ...opts });
  await ctx.route(/\/api\/(ai\/|sesiones\/recomendacion)/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(base + "/login", { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', env.TEST_USER_EMAIL);
  await page.fill('input[name="password"]', env.TEST_USER_PASSWORD);
  await Promise.all([page.waitForURL(/\/(hoy|materias)/, { timeout: 30000 }), page.click("button[formaction]")]);
  return { ctx, page };
}
const RUTAS = ["/hoy", "/materias", "/sesion/nueva", "/evaluaciones", "/historial", "/logros", "/rutas/crear", "/ajustes"];

// 1) Teclado en /hoy: orden de foco, nombre, anillo visible y que no quede tapado por cabecera o dock
{
  const { ctx, page } = await contexto({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(base + "/hoy", { waitUntil: "networkidle" });
  const pasos = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const cab = document.querySelector("header")?.getBoundingClientRect();
      const dock = document.querySelector('nav[aria-label="Navegación principal"]')?.getBoundingClientRect();
      const tapado = (cab && r.bottom <= cab.bottom && r.top < cab.bottom && !el.closest("header")) || (dock && r.top >= dock.top && !el.closest("nav"));
      return { etiqueta: (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50), tag: el.tagName.toLowerCase(), anillo: cs.boxShadow !== "none" || cs.outlineStyle !== "none", tapado: Boolean(tapado), alto: Math.round(r.height) };
    });
    pasos.push(info);
    if (i === 1 || i === 3) await page.screenshot({ path: `${salida}/teclado-hoy-tab${i + 1}.jpg`, type: "jpeg", quality: 65 });
  }
  informe.teclado = pasos;
  await ctx.close();
}

// 2) Reflow a 320 px y 3) zoom 200 % (1280 px al 200 % = 640 px CSS): sin desplazamiento horizontal
for (const [nombre, w, h] of [["reflow-320", 320, 640], ["zoom200", 640, 400]]) {
  const { ctx, page } = await contexto({ viewport: { width: w, height: h } });
  informe[nombre] = {};
  for (const r of ["/", ...RUTAS]) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    informe[nombre][r] = desborde;
    if (["/hoy", "/evaluaciones", "/"].includes(r)) await page.screenshot({ path: `${salida}/${nombre}${r === "/" ? "-landing" : r.replace(/\//g, "-")}.jpg`, type: "jpeg", quality: 60, fullPage: true });
  }
  await ctx.close();
}

// 4) Daltonismo (simulación de Chrome) en las pantallas con color con significado
{
  const { ctx, page } = await contexto({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const cdp = await ctx.newCDPSession(page);
  for (const tipo of ["protanopia", "deuteranopia", "achromatopsia"]) {
    await cdp.send("Emulation.setEmulatedVisionDeficiency", { type: tipo });
    for (const r of ["/hoy", "/historial", "/evaluaciones"]) {
      await page.goto(base + r, { waitUntil: "networkidle" });
      await page.screenshot({ path: `${salida}/daltonismo-${tipo}${r.replace(/\//g, "-")}.jpg`, type: "jpeg", quality: 60, fullPage: true });
    }
  }
  await ctx.close();
}

// 5) Movimiento reducido: ninguna animación infinita en marcha
{
  const { ctx, page } = await contexto({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  informe.movimientoReducido = {};
  for (const r of ["/", "/hoy", "/sesion/nueva"]) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    informe.movimientoReducido[r] = await page.evaluate(() => document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations === Infinity && a.playState === "running").length);
  }
  await ctx.close();
}

fs.writeFileSync(`${salida}/informe.json`, JSON.stringify(informe, null, 1));
console.log(JSON.stringify(informe, null, 1));
await browser.close();
