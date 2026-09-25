// Contraste WCAG 2.x de pares de color. Uso: node contraste.mjs <paletas.json> → tabla Markdown por stdout.
// JSON: { "<paleta>": { "colores": {nombre: "#hex"}, "pares": [[primerPlano, fondo, "texto"|"ui"|"grande"], ...] } }
import fs from "node:fs";

const hex = (h) => { h = h.replace("#", ""); if (h.length === 3) h = [...h].map((c) => c + c).join(""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const minimo = { texto: 4.5, ui: 3, grande: 3 };

const paletas = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
let fallos = 0;
for (const [nombre, { colores, pares }] of Object.entries(paletas)) {
  console.log(`\n#### ${nombre}\n\n| Primer plano | Fondo | Uso | Ratio | Mínimo | ✓ |\n|---|---|---|---|---|---|`);
  for (const [fg, bg, uso] of pares) {
    const r = ratio(colores[fg], colores[bg]);
    const ok = r >= minimo[uso];
    if (!ok) fallos++;
    console.log(`| \`${fg}\` ${colores[fg]} | \`${bg}\` ${colores[bg]} | ${uso} | ${r.toFixed(2)}:1 | ${minimo[uso]}:1 | ${ok ? "✅" : "❌"} |`);
  }
}
console.error(`fallos: ${fallos}`);
