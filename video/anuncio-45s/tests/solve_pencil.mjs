// Agarre de lápiz en trípode: el eje del lápiz se obtiene del contacto pulgar–índice (pinza) y el medio lo apoya.
import { THREE, load } from "./loader.mjs";
import { writeFileSync } from "node:fs";
const C = load("units.js", "phone.js", "hand.js", "grips.js");
const V = THREE.Vector3, rig = C.buildHand(THREE); const scene = new THREE.Scene(); scene.add(rig.root);
const PR = 0.42, TIP_S = 6.8, BACK_S = -9.5;
let seed = 99; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const pose = { f: [[40, 60, 30, 0], [50, 80, 40, 0], [70, 95, 55, 0], [75, 100, 55, 0]], t: { cmc: [0, 0, 0], mcp: 0, ip: 0 } };
const TL = C.SPEC.hand.thumb.L[2], TR = C.SPEC.hand.thumb.r[2];
const thumbPad = () => { rig.root.updateMatrixWorld(true); const p = new V(0, TL * 0.8, TR * 0.9); rig.thumb.t2.localToWorld(p); return p; };
let AX = { A: new V(), U: new V(0, 1, 0) };
const segDist = (p) => { const w = p.clone().sub(AX.A), s = C.clamp(w.dot(AX.U), BACK_S, TIP_S); return p.distanceTo(AX.A.clone().addScaledVector(AX.U, s)); };
const lim = [[0, 100], [0, 115], [0, 85], [-90, 90], [-90, 90], [-100, 100], [-15, 80], [-15, 80], [0, 100], [0, 115], [0, 85], [0, Math.PI]];
function apply(v) { pose.f[0] = [v[0], v[1], v[2], 0]; pose.t = { cmc: [v[3], v[4], v[5]], mcp: v[6], ip: v[7] }; pose.f[1] = [v[8], v[9], v[10], 0]; rig.setPose(pose); }
function axisFrom(v) { const pt = thumbPad(), pi = rig.pads().fingers[0], M = pt.clone().add(pi).multiplyScalar(0.5), s = pt.clone().sub(pi), sl = s.length(); if (sl < 1e-3) return null; s.normalize();
  // base ortonormal del plano perpendicular a s: e1 ~ eje y de la mano proyectado
  const e1 = new V(0, 1, 0).sub(s.clone().multiplyScalar(s.y)).normalize(), e2 = new V().crossVectors(s, e1).normalize(); const ph = v[11]; const U = e1.clone().multiplyScalar(Math.cos(ph)).addScaledVector(e2, Math.sin(ph)); return { A: M, U, sl }; }
function cost(v, W) { apply(v); const ax = axisFrom(v); if (!ax) return 1e9; AX = ax; let pen = 0; for (const q of rig.samples()) { if (q.tag.startsWith("f2") || q.tag.startsWith("f3")) continue; const d = segDist(q.p) - q.r - PR; if (d < -0.04) pen += (-0.04 - d) ** 2; }
  const pinch = ax.sl - 2 * PR - (TR * 0.0 + 0.0); const mid = segDist(rig.pads().fingers[1]) - PR; const dir = ax.U.y; const tilt = Math.max(0, 0.35 - dir);
  const ia = rig.pads().fingers[0].clone().sub(ax.A).dot(ax.U); // índice cerca de la punta (s>0)
  return 90 * pinch * pinch + 40 * mid * mid + W * pen + 6 * tilt * tilt + 0.05 * (ia - 1.5) ** 2 + 1e-5 * (v[0] ** 2 + v[1] ** 2 + v[2] ** 2); }
let all = []; for (let n = 0; n < 160000; n++) { const v = lim.map(([a, b]) => a + (b - a) * rnd()); all.push([cost(v, 4), v]); } all.sort((a, b) => a[0] - b[0]); let bv = null, bc = 1e9;
for (const [, v0] of all.slice(0, 14)) { let v = v0.slice(); for (const w of [4, 12, 40, 120]) { let c0 = cost(v, w), step = 8; for (let it = 0; it < 600; it++) { let imp = false; for (let k = 0; k < 12; k++) for (const sg of [-1, 1]) { const u = v.slice(); u[k] = Math.max(lim[k][0], Math.min(lim[k][1], u[k] + sg * step * (k === 11 ? 0.03 : 1))); const c = cost(u, w); if (c < c0) { c0 = c; v = u; imp = true; } } if (!imp) step *= 0.6; if (step < 0.04) break; } } const c = cost(v, 120); if (c < bc) { bc = c; bv = v; } }
apply(bv); const ax = axisFrom(bv); AX = ax;
for (const i of [2, 3]) { let best = { c: 1e9 }; for (let a = 30; a <= 100; a += 5) for (let b = 40; b <= 115; b += 5) for (let c = 20; c <= 80; c += 10) { pose.f[i] = [a, b, c, 0]; rig.setPose(pose); let pn = 0; for (const q of rig.samples()) if (q.tag.startsWith("f" + i)) { const d = segDist(q.p) - q.r - PR; if (d < -0.04) pn += (-0.04 - d) ** 2; } const cst = 200 * pn + 1e-4 * ((a - 70) ** 2 + (b - 90) ** 2); if (cst < best.c) best = { c: cst, a: [a, b, c, 0] }; } pose.f[i] = best.a; }
rig.setPose(pose); let minClear = 9; for (const q of rig.samples()) minClear = Math.min(minClear, segDist(q.p) - q.r - PR);
console.log("cost", bc.toFixed(4), "index", pose.f[0], "middle", pose.f[1], "ring", pose.f[2], "thumb", JSON.stringify(pose.t));
console.log("pinch gap", (ax.sl - 2 * PR).toFixed(2), "middle gap", (segDist(rig.pads().fingers[1]) - PR).toFixed(2), "min clearance", minClear.toFixed(3), "axis dir", ax.U.toArray().map((x) => +x.toFixed(2)), "A", ax.A.toArray().map((x) => +x.toFixed(2)));
writeFileSync(new URL("../lib/grips.pencil.js", import.meta.url), "/* generado por tests/solve_pencil.mjs */\n(function(g){const C=(g.Cine=g.Cine||{});C.GRIP_PENCIL=" + JSON.stringify({ pose, axisPoint: ax.A.toArray(), axisDir: ax.U.toArray(), tipS: TIP_S, backS: BACK_S, radius: PR }) + ";})(typeof window!=='undefined'?window:globalThis);\n");
