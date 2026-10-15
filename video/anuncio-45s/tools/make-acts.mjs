// Genera una composición HyperFrames por acto (act-A.html … act-H.html) a partir de la plantilla y de story/captions.json
import { readFileSync, writeFileSync } from "node:fs";
const FPS = 30, ACTS = [["A", 0, 90], ["B", 90, 240], ["C", 240, 420], ["D", 420, 690], ["E", 690, 900], ["F", 900, 1110], ["G", 1110, 1230], ["H", 1230, 1350]];
const caps = JSON.parse(readFileSync(new URL("../story/captions.json", import.meta.url), "utf8"));
const IMGS = ["habitos", "parahoy", "ruta", "metodo", "tutor", "enfoque", "notas"].map((n) => `<img id="ui-${n}" src="assets/ui/${n}.png" style="display:none">`).join("") + '<img id="ui-logo" src="assets/icono.svg" style="display:none">';
const SCRIPTS = ["units", "phone", "hand", "grips", "grips.data", "grips.sheet", "grips.pencil", "screen", "cameras", "post", "actor", "world", "screens", "holo", "story", "acts", "acts2"].map((n) => `<script src="lib/${n}.js"></script>`).join("");
for (const [id, f0, f1] of ACTS) {
  const t0 = f0 / FPS, dur = (f1 - f0) / FPS, mine = caps.filter((c) => c.act === id);
  const capHtml = mine.map((c, i) => `<div id="cap${i}" class="cap${c.big ? " big" : ""}${c.small ? " small" : ""}${c.cta ? " cta" : ""}"><span>${c.text}</span></div>`).join("\n    ");
  const capJs = mine.map((c, i) => `cap("#cap${i}", ${(c.t0 - t0).toFixed(3)}, ${(c.t1 - t0).toFixed(3)});`).join("\n");
  const html = `<!doctype html>
<html lang="es" data-resolution="portrait">
<head>
<meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<script src="vendor/gsap.min.js"></script><script src="vendor/three.min.js"></script>
<style>
@font-face { font-family: "Geist"; src: url("assets/fonts/Geist-Variable.woff2") format("woff2"); font-weight: 100 900; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; overflow: hidden; background: #0d1220; font-family: "Geist", ui-sans-serif, system-ui, sans-serif; }
.clip { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; overflow: hidden; }
canvas#gl { position: absolute; left: 0; top: 0; }
.fontwarm { position: absolute; left: -9999px; font-family: Geist; }
/* zona segura: texto entre y=1090 y y=1400 y con 90 px de margen lateral (derecha 150 px) */
.cap { position: absolute; left: 90px; width: 840px; top: 1330px; text-align: center; opacity: 0; }
.cap span { display: inline-block; font-size: 66px; font-weight: 700; line-height: 1.12; letter-spacing: -1px; color: #FFFFFF; background: rgba(13,18,32,0.78); padding: 22px 40px; border-radius: 44px; }
.cap span b { color: #7FD0FF; font-weight: 800; }
.cap.big span { font-size: 96px; padding: 28px 54px; border-radius: 56px; }
.cap.small span { font-size: 54px; font-weight: 600; }
.cap.cta span { background: #0066CC; font-size: 78px; padding: 30px 70px; box-shadow: 0 24px 60px rgba(0,102,204,0.45); }
.disc { position: absolute; left: 90px; width: 840px; top: 1470px; text-align: center; font-size: 30px; font-weight: 500; color: rgba(20,33,61,0.7); opacity: 0; }
</style></head>
<body>
<div id="root" data-composition-id="act${id}" data-start="0" data-duration="${dur}" data-width="1080" data-height="1920" data-fps="30">
  <p class="fontwarm"><span style="font-weight:500">a</span><span style="font-weight:600">a</span><span style="font-weight:700">a</span><span style="font-weight:800">a</span></p>
  ${IMGS}
  <section id="gl3d" class="clip" data-start="0" data-duration="${dur}" data-track-index="0"><canvas id="gl" width="1080" height="1920"></canvas></section>
  <section id="caps" class="clip" data-start="0" data-duration="${dur}" data-track-index="5" style="pointer-events:none">
    ${capHtml}
    ${id === "H" ? '<div id="disc" class="disc">Los resultados dependen de cada estudiante. studia+ no garantiza una nota.</div>' : ""}
  </section>
</div>
${SCRIPTS}
<script>
window.__timelines = window.__timelines || {};
if (THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gl"), antialias: false, preserveDrawingBuffer: true });
renderer.setSize(1080, 1920, false); renderer.setPixelRatio(1); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const Story = Cine.buildStory(THREE, renderer); window.__story = Story;
const T0 = ${t0.toFixed(4)}, DUR = ${dur};
const S = { _t: 0 };
Object.defineProperty(S, "t", { get() { return this._t; }, set(v) { this._t = v; const tg = T0 + Math.min(v, DUR - 1e-4); Cine.ACT_FN["${id}"](Story, tg); Story.render(tg); } });
const tl = gsap.timeline({ paused: true });
tl.fromTo(S, { t: 0 }, { t: DUR, duration: DUR, ease: "none" }, 0);
const cap = (sel, a, b) => { tl.fromTo(sel, { opacity: 0, y: 26, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }, a); tl.to(sel, { opacity: 0, y: -10, duration: 0.26, ease: "power1.in" }, b - 0.26); };
${capJs}
${id === "H" ? 'tl.fromTo("#disc", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 3.2);' : ""}
window.__timelines["act${id}"] = tl; tl.seek(0);
</script>
</body></html>`;
  writeFileSync(new URL(`../act-${id}.html`, import.meta.url), html);
}
console.log("ok", ACTS.length);
