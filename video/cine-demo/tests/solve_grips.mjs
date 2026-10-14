import { THREE, load } from "./loader.mjs";
import { writeFileSync } from "node:fs";
const C = load("units.js", "phone.js", "hand.js", "grips.js");
const rig = C.buildHand(THREE); const scene = new THREE.Scene(); scene.add(rig.root); C.placeHand(THREE, rig.root);
let seed = 12345; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const P = C.SPEC.phone, TOL = 0.05;
function penalty() { let s = 0; for (const q of rig.samples()) { const d = C.phoneSDF(q.p.x, q.p.y, q.p.z) - q.r; if (d < -TOL) s += (-TOL - d) * (-TOL - d); } return s; }
const pose0 = () => ({ f: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], t: { cmc: [0,0,0], mcp: 0, ip: 0 } });
const pose = pose0(); rig.setPose(pose);
// ---- dedos: búsqueda por dedo (rodear el borde izquierdo sin pasar a la zona de pantalla) ----
for (let i = 0; i < 4; i++) {
  let best = { c: 1e9 };
  for (const sp of [-12, -6, 0, 6, 12]) for (let a = 0; a <= 70; a += 5) for (let b = 0; b <= 115; b += 5) for (let c = 0; c <= 85; c += 5) {
    pose.f[i] = [a, b, c, sp]; rig.setPose(pose);
    const pd = rig.pads().fingers[i]; const h = C.phoneSDF(pd.x, pd.y, pd.z);
    let pen = 0; for (const q of rig.samples()) if (q.tag.startsWith("f" + i)) { const d = C.phoneSDFFwd(q.p.x, q.p.y, q.p.z) - q.r; if (d < -TOL) pen += (-TOL - d) ** 2; }
    const cost = 60 * h * h + 0.8 * (pd.x + P.W / 2) ** 2 + 0.4 * pd.z ** 2 + 80 * pen + 1e-5 * (a * a + b * b + c * c + sp * sp);
    if (cost < best.c) best = { c: cost, a: [a, b, c, sp], h, pen, at: pd.toArray().map((x) => +x.toFixed(2)) };
  }
  pose.f[i] = best.a; console.log("finger", i, best.a, "padSDF", best.h.toFixed(2), "pen", best.pen.toFixed(4), "pad", best.at);
}
// ---- pulgar: búsqueda aleatoria + descenso ----
let W = 60, XYW = 0.12;
const TL = C.SPEC.hand.thumb.L[2], TR = C.SPEC.hand.thumb.r[2];
function tipInfo() { rig.root.updateMatrixWorld(true); const tip = new THREE.Vector3(0, TL, 0); rig.thumb.t2.localToWorld(tip); const n = new THREE.Vector3(0, 0, 1).transformDirection(rig.thumb.t2.matrixWorld); return { tip, n }; }
function thumbCost(t, target) {
  pose.t = t; rig.setPose(pose); const ti = tipInfo(); const pd = ti.tip; let pen = 0;
  for (const q of rig.samples()) if (q.tag[0] === "t") { const d = C.phoneSDF(q.p.x, q.p.y, q.p.z) - q.r; if (d < -TOL) pen += (-TOL - d) ** 2; }
  const h = (pd.z - TR - P.D / 2) - target.h; const nz = Math.max(0, ti.n.z + 0.45); return 8 * nz * nz + 80 * h * h + XYW * ((pd.x - target.x) ** 2 + (pd.y - target.y) ** 2) + W * pen + 1e-5 * (t.mcp ** 2 + t.ip ** 2);
}
const lim = { cmc0: [-90, 90], cmc1: [-90, 90], cmc2: [-100, 100], mcp: [-15, 80], ip: [-15, 80] };
const toT = (v) => ({ cmc: [v[0], v[1], v[2]], mcp: v[3], ip: v[4] });
const keys = Object.values(lim);
function solveThumb(target) {
  let all = [];
  W = 4; for (let n = 0; n < 120000; n++) { const v = keys.map(([a, b]) => a + (b - a) * rnd()); all.push([thumbCost(toT(v), target), v]); }
  all.sort((a, b) => a[0] - b[0]); let bestV = null, bestC = 1e9;
  for (const [, v0] of all.slice(0, 12)) {
    let v = v0.slice(); let c0 = 1e9;
    for (const w of [4, 12, 40, 120]) { W = w; c0 = thumbCost(toT(v), target); let step = 10;
      for (let it = 0; it < 500; it++) { let imp = false; for (let k = 0; k < 5; k++) for (const sg of [-1, 1]) { const u = v.slice(); u[k] = Math.max(keys[k][0], Math.min(keys[k][1], u[k] + sg * step)); const c = thumbCost(toT(u), target); if (c < c0) { c0 = c; v = u; imp = true; } } if (!imp) step *= 0.6; if (step < 0.05) break; } }
    if (c0 < bestC) { bestC = c0; bestV = v; }
  }
  XYW = 0.12; W = 120; const t = toT(bestV.map((x) => +x.toFixed(2))); pose.t = t; rig.setPose(pose);
  let pen = 0; for (const q of rig.samples()) if (q.tag[0] === "t") { const d = C.phoneSDF(q.p.x, q.p.y, q.p.z) - q.r; if (d < -TOL) pen += (-TOL - d) ** 2; }
  const ti2 = tipInfo(), pd2 = ti2.tip; return { t, err: Math.hypot(pd2.x - target.x, pd2.y - target.y), h: pd2.z - TR - P.D / 2, nz: ti2.n.z, pen, at: [+pd2.x.toFixed(2), +pd2.y.toFixed(2)] };
}
function descend(v0, target) {
  XYW = 6; let v = v0.slice(), c0 = 1e9;
  for (const w of [4, 12, 40, 120]) { W = w; c0 = thumbCost(toT(v), target); let step = 2;
    for (let it = 0; it < 600; it++) { let imp = false; for (let k = 0; k < 5; k++) for (const sg of [-1, 1]) { const u = v.slice(); u[k] = Math.max(keys[k][0], Math.min(keys[k][1], u[k] + sg * step)); const c = thumbCost(toT(u), target); if (c < c0) { c0 = c; v = u; imp = true; } } if (!imp) step *= 0.6; if (step < 0.03) break; } }
  W = 120; const t = toT(v.map((x) => +x.toFixed(2))); pose.t = t; rig.setPose(pose);
  let pen = 0; for (const q of rig.samples()) if (q.tag[0] === "t") { const d = C.phoneSDF(q.p.x, q.p.y, q.p.z) - q.r; if (d < -TOL) pen += (-TOL - d) ** 2; }
  const ti2 = tipInfo(), pd2 = ti2.tip; return { v, t, err: Math.hypot(pd2.x - target.x, pd2.y - target.y), h: pd2.z - TR - P.D / 2, nz: ti2.n.z, pen, at: [+pd2.x.toFixed(2), +pd2.y.toFixed(2)] };
}
const out = { fingers: pose.f, thumb: {}, contact: {} };
const chain = [["hover", { x: 1.0, y: -3.8, h: 1.5 }, null], ["touchA", { x: 1.0, y: -3.8, h: 0 }, "hover"], ["hoverB", { x: 0.9, y: -2.4, h: 1.5 }, "hover"], ["touchB", { x: 0.9, y: -2.4, h: 0 }, "hoverB"], ["hoverBtn", { x: 0.7, y: -3.8, h: 1.4 }, "hover"], ["tapBtn", { x: 0.7, y: -3.8, h: 0 }, "hoverBtn"]];
const sol = {};
for (const [k, tg, from] of chain) {
  const r = from ? descend(sol[from].v, tg) : solveThumb(tg); if (!from) r.v = [...r.t.cmc, r.t.mcp, r.t.ip];
  sol[k] = r; out.thumb[k] = r.t; out.contact[k] = r.at; console.log("thumb", k, JSON.stringify(r.t), "xy-err", r.err.toFixed(2), "height", r.h.toFixed(2), "want", tg.h, "nz", (r.nz ?? 0).toFixed(2), "pen", r.pen.toFixed(4), "at", r.at);
}
writeFileSync(new URL("../lib/grips.data.js", import.meta.url), "/* generado por tests/solve_grips.mjs */\n(function(g){const C=(g.Cine=g.Cine||{});C.GRIP=" + JSON.stringify(out) + ";})(typeof window!=='undefined'?window:globalThis);\n");
