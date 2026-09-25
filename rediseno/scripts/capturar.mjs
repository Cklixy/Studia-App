// Capturas del rediseño contra un servidor (local o Preview), claro y oscuro.
// Uso: node capturar.mjs <baseUrl> <carpetaSalida> <viewports: 390,1440> <rutas separadas por coma | "todas"> [--vista]
// --vista: solo la primera pantalla (sin fullPage), útil para ver qué queda sobre el pliegue y bajo el dock.
// Credenciales de la cuenta de prueba desde .env.test.local (nunca se imprimen).
import fs from "node:fs";
import { chromium } from "playwright-core";

const [base, salida, vpArg = "390,1440", rutasArg = "todas", ...flags] = process.argv.slice(2);
const soloVista = flags.includes("--vista");
const REPO = "C:/Users/Juan/Documents/Studia-App";
const env = Object.fromEntries(fs.readFileSync(`${REPO}/.env.test.local`, "utf8").split(/\r?\n/).filter((l) => l.includes("="))
  .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
fs.mkdirSync(salida, { recursive: true });

const publicas = { landing: "/", login: "/login", registro: "/registro", recuperar: "/recuperar", "404": "/ruta-que-no-existe" };
const privadas = { hoy: "/hoy", materias: "/materias", "sesion-nueva": "/sesion/nueva", parciales: "/evaluaciones", "progreso-historial": "/historial",
  "progreso-logros": "/logros", "rutas-crear": "/rutas/crear", ajustes: "/ajustes" };
const extra = JSON.parse(process.env.RUTAS_EXTRA || "{}"); // {"materia": "/materias/<id>"}
const todas = { ...publicas, ...privadas, ...extra };
const elegidas = rutasArg === "todas" ? Object.keys(todas) : rutasArg.split(",");
const VPS = { 390: [390, 844, true], 1440: [1440, 900, false], 360: [360, 640, true], 768: [768, 1024, true] };

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
for (const vp of vpArg.split(",")) {
  const [w, h, movil] = VPS[vp];
  for (const esquema of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: movil, hasTouch: movil, locale: "es-CO", colorScheme: esquema });
    await ctx.addInitScript(() => { try { localStorage.setItem("studia_onboarding_v1_done", "true"); } catch {} });
    const page = await ctx.newPage();
    let conSesion = false;
    for (const nombre of elegidas) {
      const ruta = todas[nombre];
      if (!ruta) { console.log("ruta desconocida", nombre); continue; }
      const privada = !(nombre in publicas);
      if (privada && !conSesion) {
        await page.goto(base + "/login", { waitUntil: "networkidle" });
        await page.fill('input[name="email"]', env.TEST_USER_EMAIL);
        await page.fill('input[name="password"]', env.TEST_USER_PASSWORD);
        await Promise.all([page.waitForURL(/\/(hoy|materias)/, { timeout: 30000 }), page.click("button[formaction]")]);
        conSesion = true;
      }
      await page.goto(base + ruta, { waitUntil: "networkidle" });
      await page.waitForTimeout(700);
      const f = `${salida}/${nombre}__${vp}__${esquema === "light" ? "claro" : "oscuro"}${soloVista ? "__vista" : ""}.jpg`;
      await page.screenshot({ path: f, fullPage: !soloVista, type: "jpeg", quality: 65 });
      console.log(f.split("/").pop());
    }
    await ctx.close();
  }
}
await browser.close();
