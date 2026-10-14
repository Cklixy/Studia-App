// Agarre en pinza de una hoja A4: dedos detrás (yemas apoyadas en el dorso) y pulgar por delante.
import { THREE, load } from "./loader.mjs";
import { writeFileSync } from "node:fs";
const C = load("units.js", "phone.js", "hand.js", "grips.js");
const rig = C.buildHand(THREE); const scene = new THREE.Scene(); scene.add(rig.root); C.placeHandSheet(THREE, rig.root);
const S = C.SHEET, TOL = 0.05, TL = C.SPEC.hand.thumb.L[2], TR = C.SPEC.hand.thumb.r[2];
let seed = 777; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const pose = { f: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], t: { cmc: [0,0,0], mcp: 0, ip: 0 } }; rig.setPose(pose);
const pen = (filter) => { let s = 0; for (const q of rig.samples()) if (filter(q.tag)) { const d = C.sheetSDF(q.p.x, q.p.y, q.p.z) - q.r; if (d < -TOL) s += (-TOL - d) ** 2; } return s; };
for (let i = 0; i < 4; i++) {
  let best = { c: 1e9 };
  for (const sp of [-8, -4, 0, 4, 8]) for (let a = 0; a <= 40; a += 4) for (let b = 0; b <= 50; b += 5) for (let c = 0; c <= 40; c += 5) {
    pose.f[i] = [a, b, c, sp]; rig.setPose(pose); const pd = rig.pads().fingers[i], h = C.sheetSDF(pd.x, pd.y, pd.z);
    const cost = 60 * h * h + 3 * (pd.z + S.D / 2) ** 2 + 80 * pen((t) => t.startsWith("f" + i)) + 2e-4 * (a * a + b * b + c * c + 4 * sp * sp);
    if (cost < best.c) best = { c: cost, a: [a, b, c, sp], h, at: pd.toArray().map((x) => +x.toFixed(2)) };
  }
  pose.f[i] = best.a; console.log("finger", i, best.a, "padSDF", best.h.toFixed(2), "pad", best.at);
}
function tipInfo() { rig.root.updateMatrixWorld(true); const tip = new THREE.Vector3(0, TL, 0); rig.thumb.t2.localToWorld(tip); const n = new THREE.Vector3(0, 0, 1).transformDirection(rig.thumb.t2.matrixWorld); return { tip, n }; }
const lim = [[-90, 90], [-90, 90], [-100, 100], [-15, 80], [-15, 80]]; const toT = (v) => ({ cmc: [v[0], v[1], v[2]], mcp: v[3], ip: v[4] });
let W = 4, XYW = 0.15;
function cost(v, tg) { pose.t = toT(v); rig.setPose(pose); const ti = tipInfo(); const h = ti.tip.z - TR - S.D / 2 - tg.h; const nz = Math.max(0, ti.n.z + 0.4);
  return 8 * nz * nz + 80 * h * h + XYW * ((ti.tip.x - tg.x) ** 2 + (ti.tip.y - tg.y) ** 2) + W * pen((t) => t[0] === "t") + 1e-5 * (v[3] ** 2 + v[4] ** 2); }
function descend(v0, tg, ws) { let v = v0.slice(); for (const w of ws) { W = w; let c0 = cost(v, tg), step = 6; for (let it = 0; it < 600; it++) { let imp = false; for (let k = 0; k < 5; k++) for (const sg of [-1, 1]) { const u = v.slice(); u[k] = Math.max(lim[k][0], Math.min(lim[k][1], u[k] + sg * step)); const c = cost(u, tg); if (c < c0) { c0 = c; v = u; imp = true; } } if (!imp) step *= 0.6; if (step < 0.03) break; } } return v; }
function global(tg) { W = 4; const all = []; for (let n = 0; n < 80000; n++) { const v = lim.map(([a, b]) => a + (b - a) * rnd()); all.push([cost(v, tg), v]); } all.sort((a, b) => a[0] - b[0]); let bv = null, bc = 1e9; for (const [, v0] of all.slice(0, 10)) { const v = descend(v0, tg, [4, 12, 40, 120]); W = 120; const c = cost(v, tg); if (c < bc) { bc = c; bv = v; } } return bv; }
const targets = { hover: { x: 8.2, y: -11.0, h: 1.6 }, hold: { x: 8.2, y: -11.0, h: -0.3 } };
const out = { fingers: pose.f, thumb: {}, contact: {} };
let vh = global(targets.hover); XYW = 6; const vHold = descend(vh, targets.hold, [12, 60, 120]);
for (const [k, v, tg] of [["hover", vh, targets.hover], ["hold", vHold, targets.hold]]) { pose.t = toT(v.map((x) => +x.toFixed(2))); rig.setPose(pose); const ti = tipInfo(); out.thumb[k] = pose.t; out.contact[k] = [+ti.tip.x.toFixed(2), +ti.tip.y.toFixed(2)];
  console.log("thumb", k, JSON.stringify(pose.t), "tip", out.contact[k], "height", (ti.tip.z - TR - S.D / 2).toFixed(2), "nz", ti.n.z.toFixed(2), "pen", pen((t) => t[0] === "t").toFixed(4)); }
writeFileSync(new URL("../lib/grips.sheet.js", import.meta.url), "/* generado por tests/solve_sheet.mjs */\n(function(g){const C=(g.Cine=g.Cine||{});C.GRIP_SHEET=" + JSON.stringify(out) + ";})(typeof window!=='undefined'?window:globalThis);\n");
