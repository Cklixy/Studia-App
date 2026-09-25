// Codemod de la Fase 2: sustituye clases del tema «Frost» y colores sueltos de Tailwind por los roles
// del sistema «Cuaderno». Uso: node codemod-tokens.mjs <dir-src> [--seco]
import fs from "node:fs";
import path from "node:path";

const [dir, modo] = process.argv.slice(2);
const seco = modo === "--seco";

// Orden importa: patrones más específicos primero.
const reglas = [
  // Clases de componente
  [/\bbtn-(action|apple-primary)\b/g, "btn-primario"],
  [/\bbtn-apple-secondary\b/g, "btn-secundario"],
  [/\bbtn-apple-ghost\b/g, "btn-fantasma"],
  [/\bbtn-apple-destructive\b/g, "btn-peligro"],
  [/\bapple-card\b/g, "tarjeta"],
  [/\bapple-tactile\b/g, "tactil"],
  [/\bapple-glass-ultra\b/g, "barra-superior"],
  [/\bapple-glass\b/g, "tarjeta"],
  [/\bapple-segmented\b/g, "segmentado"],
  [/\bapple-shimmer\b/g, "esqueleto"],
  [/\bapple-large-title\b/g, "titulo-1"],
  [/\bapple-title-2\b/g, "titulo-2"],
  [/\bapple-title-3\b/g, "titulo-3"],
  [/\bapple-headline\b/g, "encabezado"],
  [/\bapple-body\b/g, "cuerpo"],
  [/\bapple-subhead\b/g, "subtitulo"],
  [/\bapple-caption\b/g, "antetitulo"],
  [/\bfluid-h1\b/g, "titulo-1"],
  [/\bfluid-h2\b/g, "titulo-2"],
  // Sombras
  [/\bshadow-apple-(sm)\b/g, "shadow-1"],
  [/\bshadow-apple-(md|glow|glow-blue)\b/g, "shadow-2"],
  [/\bshadow-apple-lg\b/g, "shadow-3"],
  [/\bshadow-sm\b/g, "shadow-1"],
  [/\bshadow-\[[^\]\s"]+\]/g, "shadow-2"],
  // Colores con nombre del tema anterior
  [/-arctic-slate\b/g, "-tinta"],
  [/-arctic-secondary\b/g, "-tinta-2"],
  [/-arctic-tertiary\b/g, "-tinta-3"],
  [/-arctic-borde\b/g, "-linea-fuerte"],
  [/-(glacier-blue|apple-blue|polar-cyan|ice-mint|apple-teal|cool-iris|apple-purple)\b/g, "-acento"],
  [/-(cool-berry|apple-red)\b/g, "-error"],
  [/-(cool-amber|apple-orange)\b/g, "-aviso"],
  [/-apple-green\b/g, "-exito"],
  [/-frost-base\b/g, "-fondo"],
  [/-(frost-card|frost-surface|frost-elevated)\b/g, "-superficie"],
  [/-(frost-border-light|frost-border)\b/g, "-linea"],
  // Grises por opacidad → roles
  [/\b(border|divide|ring)-black\/20\b/g, "$1-linea-fuerte"],
  [/\b(border|divide|ring|stroke)-black\/(\[[0-9.]+\]|10)/g, "$1-linea"],
  [/\bbg-black\/(\[0\.(1|14|24)\]|10|20)/g, "bg-linea"],
  [/\bbg-black\/\[[0-9.]+\]/g, "bg-hundido"],
  [/\b(bg|from|via|to|border)-white\/(\[[0-9.]+\]|\d+)/g, "$1-superficie"],
  [/\b(bg|from|via|to|border)-white\b/g, "$1-superficie"],
  [/\btext-white\b/g, "text-sobre-acento"],
  [/\bbg-\[#E9E9EB\]/gi, "bg-hundido"],
  // Paleta de Tailwind fuera de tokens → roles
  [/\b(bg|text|border|ring|from|to|fill|stroke)-(emerald|green)-\d{2,3}/g, "$1-exito"],
  [/\b(bg|text|border|ring|from|to|fill|stroke)-(red|rose)-\d{2,3}/g, "$1-error"],
  [/\b(bg|text|border|ring|from|to|fill|stroke)-(amber|orange|yellow)-\d{2,3}/g, "$1-aviso"],
  [/\b(bg|text|border|ring|from|to|fill|stroke)-(sky|blue|cyan|indigo|violet|purple|teal)-\d{2,3}/g, "$1-acento"],
  [/\b(bg|text|border|ring)-(slate|gray|zinc|neutral)-(1|2)00\b/g, "$1-linea"],
];

const archivos = [];
(function recorrer(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) recorrer(p);
    else if (/\.(tsx|ts)$/.test(e.name)) archivos.push(p);
  }
})(dir);

let total = 0;
for (const f of archivos) {
  const antes = fs.readFileSync(f, "utf8");
  let txt = antes;
  let n = 0;
  for (const [re, rep] of reglas) txt = txt.replace(re, (...m) => { n++; return m[0].replace(new RegExp(re.source), rep); });
  if (txt !== antes) {
    total += n;
    console.log(`${n}\t${path.relative(dir, f)}`);
    if (!seco) fs.writeFileSync(f, txt);
  }
}
console.log(`total sustituciones: ${total}`);
