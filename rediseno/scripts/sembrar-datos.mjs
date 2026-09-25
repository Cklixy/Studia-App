// Crea datos de ejemplo en la CUENTA DE PRUEBA a través de la API de la app (misma validación que un usuario).
// Uso: node sembrar-datos.mjs <baseUrl> [--sesion]   (--sesion: además finaliza una sesión de ~1 min; tarda 70 s)
// Borrado: limpiar-datos (auditoria/scripts/ux/limpiar-datos.mjs) o por MCP. Credenciales desde .env.test.local.
import fs from "node:fs";
import { chromium } from "playwright-core";

const [base, flag] = process.argv.slice(2);
const REPO = "C:/Users/Juan/Documents/Studia-App";
const env = Object.fromEntries(fs.readFileSync(`${REPO}/.env.test.local`, "utf8").split(/\r?\n/).filter((l) => l.includes("="))
  .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));

const enDias = (n) => { const d = new Date(Date.now() + n * 86400000); return d.toISOString().slice(0, 10); };
const MATERIAS = [
  { nombre: "Cálculo I", fecha_parcial: enDias(6), temas: ["Límites y continuidad", "Límites laterales", "Límites al infinito", "Derivada por definición", "Reglas de derivación", "Regla de la cadena", "Derivación implícita"], hechos: 3,
    evaluaciones: [{ nombre: "Quiz 1", porcentaje: 15, nota_obtenida: 4.2 }, { nombre: "Primer parcial", porcentaje: 30 }] },
  { nombre: "Física mecánica", fecha_parcial: enDias(20), temas: ["Cinemática en una dimensión", "Movimiento parabólico", "Leyes de Newton", "Trabajo y energía", "Cantidad de movimiento"], hechos: 1,
    evaluaciones: [{ nombre: "Laboratorio 1", porcentaje: 10, nota_obtenida: 3.8 }] },
  { nombre: "Programación orientada a objetos", fecha_parcial: null, temas: ["Clases y objetos", "Herencia", "Polimorfismo"], hechos: 0, evaluaciones: [] },
];

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage();
await page.goto(base + "/login", { waitUntil: "networkidle" });
await page.fill('input[name="email"]', env.TEST_USER_EMAIL);
await page.fill('input[name="password"]', env.TEST_USER_PASSWORD);
await Promise.all([page.waitForURL(/\/materias/, { timeout: 30000 }), page.click("button[formaction]")]);
const api = async (metodo, ruta, datos) => {
  const r = await page.request.fetch(base + ruta, { method: metodo, data: datos, headers: { "content-type": "application/json", origin: base } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok()) throw new Error(`${metodo} ${ruta} → ${r.status()} ${JSON.stringify(j).slice(0, 200)}`);
  return j;
};

const creados = { materias: [] };
for (const m of MATERIAS) {
  const mat = await api("POST", "/api/materias", { nombre: m.nombre, fecha_parcial: m.fecha_parcial });
  const materia = mat.data || mat.materia || mat;
  creados.materias.push(materia.id);
  let i = 0;
  for (const nombre of m.temas) {
    const t = await api("POST", `/api/materias/${materia.id}/temas`, { nombre, tipo_contenido: "Lectura" });
    const tema = t.data || t.tema || t;
    if (i++ < m.hechos) await api("PATCH", `/api/temas/${tema.id}`, { completed: true });
  }
  for (const e of m.evaluaciones) await api("POST", `/api/materias/${materia.id}/evaluaciones`, e);
  console.log("materia", m.nombre, materia.id);
}

if (flag === "--sesion") {
  const s = await api("POST", "/api/sesiones", {
    nivel_educativo: "Universidad", materia_id: creados.materias[0], tema_id: null, tema_nombre: "Límites laterales",
    contexto: "Repasar", metodo_recomendado: "Active Recall", metodo_utilizado: "Active Recall", objetivo: "Resolver 5 ejercicios", duracion_planificada_minutos: 25,
  });
  const sesion = s.data || s.sesion || s;
  console.log("sesión", sesion.id, "— esperando 70 s para que cuente 1 minuto");
  await page.waitForTimeout(70000);
  await api("PATCH", `/api/sesiones/${sesion.id}`, { tiempo_efectivo_segundos: 65, pausas_count: 0, resultado_logro: "Si", calificacion_utilidad: "Si", calificacion_productividad: 4 });
}
fs.writeFileSync(new URL("./creados.json", import.meta.url), JSON.stringify(creados, null, 1));
console.log("listo");
await browser.close();
