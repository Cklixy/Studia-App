// Recorre Hoy → preparar sesión → sesión activa → resumen, y abre el tutor. Bloquea las rutas de IA
// (se usan las reglas de respaldo): 0 llamadas a Gemini. Crea una sesión en la cuenta de prueba (se borra al final).
// Uso: node flujo-sesion.mjs <baseUrl> <salida> <materiaId> [claro|oscuro]
import fs from "node:fs";
import { chromium } from "playwright-core";

const [base, salida, materiaId, tema = "claro"] = process.argv.slice(2);
const REPO = "C:/Users/Juan/Documents/Studia-App";
const env = Object.fromEntries(fs.readFileSync(`${REPO}/.env.test.local`, "utf8").split(/\r?\n/).filter((l) => l.includes("="))
  .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
fs.mkdirSync(salida, { recursive: true });

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "es-CO", colorScheme: tema === "oscuro" ? "dark" : "light" });
await ctx.route(/\/api\/(ai\/|sesiones\/recomendacion)/, (r) => r.abort());
const page = await ctx.newPage();
page.on("dialog", (d) => d.accept());
const foto = async (n) => { await page.waitForTimeout(600); await page.screenshot({ path: `${salida}/${n}__${tema}.jpg`, type: "jpeg", quality: 65 }); console.log(n); };

await page.goto(base + "/login", { waitUntil: "networkidle" });
await page.fill('input[name="email"]', env.TEST_USER_EMAIL);
await page.fill('input[name="password"]', env.TEST_USER_PASSWORD);
await Promise.all([page.waitForURL(/\/(hoy|materias)/, { timeout: 30000 }), page.click("button[formaction]")]);

await page.goto(base + "/hoy", { waitUntil: "networkidle" });
await page.getByRole("link", { name: /Empezar sesión|Continuar sesión/ }).first().click();
await page.waitForURL(/\/sesion\//);
await page.waitForLoadState("networkidle");
if (page.url().includes("/sesion/nueva")) {
  await foto("s1-que-necesitas");
  await page.getByRole("radio", { name: "Repasar" }).click();
  await page.getByText("Tu plan para esta sesión").waitFor();
  await foto("s2-plan");
  await page.locator("label", { hasText: "15 min" }).click();
  await page.getByRole("button", { name: /Empezar sesión de/ }).click();
  await page.waitForURL(/\/sesion\/activa\//);
}
await page.waitForLoadState("networkidle");
await foto("s3-activa");
await page.getByRole("button", { name: "Pausar" }).click();
await foto("s4-pausa");
await page.getByRole("button", { name: /Terminar ahora/ }).click();
await page.waitForURL(/\/sesion\/resumen\//);
await page.waitForLoadState("networkidle");
await page.screenshot({ path: `${salida}/s5-resumen__${tema}.jpg`, type: "jpeg", quality: 65, fullPage: true });
console.log("s5-resumen");

await page.goto(`${base}/materias/${materiaId}`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Preguntar al tutor/ }).first().click();
await page.getByRole("dialog").waitFor();
await foto("s6-tutor");
await browser.close();
