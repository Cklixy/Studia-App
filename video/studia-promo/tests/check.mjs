// Comprobaciones automáticas del anuncio 3D: escala, penetración, contacto, sincronía y cámara.
import { THREE, load } from "./loader.mjs";
const C = load("units.js", "phone.js", "hand.js", "grips.js", "grips.data.js", "grips.sheet.js", "screen.js", "cameras.js", "ad.js");
const R = C.SPEC.ranges, P = C.SPEC.phone, V = THREE.Vector3; let crit = 0, warn = 0;
const row = (ok, level, name, detail) => { if (!ok) level === "crit" ? crit++ : warn++; console.log(`${ok ? "PASS" : level === "crit" ? "FAIL" : "WARN"}  ${name}${detail ? "  — " + detail : ""}`); };
const inR = (v, [a, b]) => v >= a && v <= b;
// 1. dimensiones
const ph = C.buildPhone(THREE), sz = new THREE.Box3().setFromObject(ph.group).getSize(new V());
row(inR(sz.x, R.phoneW) && inR(sz.y, R.phoneH) && inR(sz.z, [R.phoneD[0], R.phoneD[1] + 0.35]), "crit", "Dimensiones del teléfono", `${sz.x.toFixed(2)}×${sz.y.toFixed(2)}×${sz.z.toFixed(2)} cm`);
const sw = P.W - 2 * P.bezel, sh = P.H - 2 * P.bezel;
row(Math.abs(sw / sh - C.SCREEN_PX.w / C.SCREEN_PX.h) < R.screenAspectTol, "crit", "Textura de pantalla = aspecto físico", `${(sw / sh).toFixed(4)} vs ${(C.SCREEN_PX.w / C.SCREEN_PX.h).toFixed(4)}`);
const rig0 = C.buildHand(THREE); row(inR(rig0.length(), R.handLen), "crit", "Escala de la mano", `${rig0.length().toFixed(1)} cm`);
row(Math.abs(C.SHEET.W / C.SHEET.H - 210 / 297) < 0.002, "crit", "Hoja A4 (210×297)", `${C.SHEET.W}×${C.SHEET.H} cm`);
// 2. barrido temporal
const grp = new THREE.Group(), hnd = C.buildHand(THREE); grp.add(hnd.root); C.placeHand(THREE, hnd.root);
const sheetG = new THREE.Group(), hR = C.buildHand(THREE), hL = C.buildHand(THREE), mir = new THREE.Group(); mir.scale.x = -1; sheetG.add(hR.root); sheetG.add(mir); mir.add(hL.root); C.placeHandSheet(THREE, hR.root); C.placeHandSheet(THREE, hL.root);
const cam = new THREE.PerspectiveCamera(40, 1080 / 1920, 0.4, 500);
let minPen = 9, minPenTag = "", minPenSheet = 9, sheetTag = "", camClear = 99, camT = 0, camTag = "", sizeVar = 0;
const inv = new THREE.Matrix4(), sinv = new THREE.Matrix4(); const STEP = 0.1; const tipH = { hoy: 9, tutor: 9 };
const L3 = C.SPEC.hand.thumb.L[2], TR3 = C.SPEC.hand.thumb.r[2];
for (let t = 0; t <= 43 + 1e-9; t += STEP) {
  const sc = C.adScene(t).id, X = C.adPhoneXform(THREE, t); grp.position.set(...X.pos); grp.quaternion.copy(X.quat); grp.updateMatrixWorld(true); inv.copy(grp.matrixWorld).invert(); sizeVar = Math.max(sizeVar, Math.abs(grp.scale.x - 1));
  const cp = C.adCamera(t); cam.position.set(...cp.pos); const cpos = cam.position;
  if (cp.pos[1] < 0.6 && sc !== "S7") row(false, "crit", "Cámara bajo la mesa", `t=${t.toFixed(1)}`);
  let clear = 99, tag = "";
  const upd = (d, name) => { if (d < clear) { clear = d; tag = name; } };
  if (X.vis) { const l = cpos.clone().applyMatrix4(inv); upd(C.phoneSDF(l.x, l.y, l.z), "teléfono"); }
  if (X.vis && X.held) {
    hnd.setPose({ f: C.GRIP.fingers, t: C.adThumbPose(t) }); hnd.root.updateMatrixWorld(true);
    for (const q of hnd.samples()) { const l = q.p.clone().applyMatrix4(inv), d = C.phoneSDF(l.x, l.y, l.z) - q.r; if (d < minPen) { minPen = d; minPenTag = `${q.tag}@${t.toFixed(1)}`; } upd(cpos.distanceTo(q.p) - q.r, "mano:" + q.tag); }
    const tip = new V(0, L3, 0); hnd.thumb.t2.localToWorld(tip); const lt = tip.applyMatrix4(inv), h = lt.z - TR3 - P.D / 2;
    if (t >= C.AD.TAP_HOY && t <= C.AD.TAP_HOY + 0.25) tipH.hoy = Math.min(tipH.hoy, h); if (t >= C.AD.TAP_TUTOR && t <= C.AD.TAP_TUTOR + 0.2) tipH.tutor = Math.min(tipH.tutor, h);
  }
  if (sc === "S7") {
    const SP = C.adSheetPose(t); sheetG.position.set(0, SP.y, SP.z); sheetG.rotation.set(0, 0, SP.rotZ); sheetG.updateMatrixWorld(true); sinv.copy(sheetG.matrixWorld).invert();
    const hp = SP.holding ? "hold" : "hover"; hR.setPose({ f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb[hp] }); hL.setPose({ f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb[hp] });
    sheetG.updateMatrixWorld(true); hR.root.position.y = C.SHEET_PLACEMENT.wrist[1] + SP.handsY; hL.root.position.y = C.SHEET_PLACEMENT.wrist[1] + SP.handsY; sheetG.updateMatrixWorld(true);
    if (SP.holding) for (const rig of [hR, hL]) for (const q of rig.samples()) { const l = q.p.clone().applyMatrix4(sinv); const d = C.sheetSDF(l.x, l.y, l.z) - q.r; if (d < minPenSheet) { minPenSheet = d; sheetTag = `${q.tag}@${t.toFixed(1)}`; } }
    const sp = new V(0, SP.y, SP.z), lsp = cpos.clone().sub(sp); upd(Math.hypot(Math.max(Math.abs(lsp.x) - C.SHEET.W / 2, 0), Math.max(Math.abs(lsp.y) - C.SHEET.H / 2, 0), Math.abs(lsp.z))  , "hoja");
    upd(cpos.distanceTo(new V(0, 66, -45)) - 10, "cabeza profesor");
  }
  if (sc === "S2") upd(cpos.distanceTo(new V(0, 29, 34)) - 10, "cabeza persona");
  if (clear < camClear) { camClear = clear; camT = t; camTag = tag; }
}
row(minPen > -0.12, "crit", "Sin penetración mano↔teléfono (≥ −0,12 cm)", `mínimo ${minPen.toFixed(3)} cm en ${minPenTag}`);
row(minPenSheet > -0.15, "crit", "Sin penetración manos↔hoja (≥ −0,15 cm)", `mínimo ${minPenSheet.toFixed(3)} cm en ${sheetTag}`);
row(sizeVar === 0, "crit", "Escala del teléfono constante (=1)", `${sizeVar}`);
row(tipH.hoy <= 0.15, "crit", "Pulgar toca \"Estudiar ahora\"", `altura mínima de la yema ${tipH.hoy.toFixed(2)} cm`);
row(tipH.tutor <= 0.15, "crit", "Pulgar toca la pregunta sugerida (tutor)", `altura mínima de la yema ${tipH.tutor.toFixed(2)} cm`);
row(camClear >= 2.0, "crit", "Cámara nunca pegada a la geometría (≥ 2 cm)", `mínimo ${camClear.toFixed(2)} cm con ${camTag} en t=${camT.toFixed(1)}`);
const fs = []; for (let t = 0; t < 43; t += 0.1) fs.push(C.adCamera(t).f); row(Math.min(...fs) >= 24 && Math.max(...fs) <= 90, "crit", "Focales 24–90 mm", `${Math.min(...fs).toFixed(0)}–${Math.max(...fs).toFixed(0)} mm`);
for (let i = 1; i < C.AD.scenes.length; i++) { const a = C.adCamera(C.AD.scenes[i].t0 - 1e-3), b = C.adCamera(C.AD.scenes[i].t0 + 1e-3); console.log(`INFO  corte ${C.AD.scenes[i - 1].id}→${C.AD.scenes[i].id}: salto ${Math.hypot(...a.pos.map((x, k) => x - b.pos[k])).toFixed(0)} cm, focal ${a.f.toFixed(0)}→${b.f.toFixed(0)}`); }
console.log(`\nResumen: ${crit} críticos, ${warn} avisos`); process.exit(crit ? 1 : 0);
