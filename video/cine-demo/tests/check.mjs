// Comprobaciones automáticas objetivas: escala, proporciones, penetración, contacto, sincronía y cámara.
// Uso: node tests/check.mjs    (código de salida 1 si hay defectos críticos)
import { THREE, load } from "./loader.mjs";
const C = load("units.js", "phone.js", "hand.js", "grips.js", "grips.data.js", "screen.js", "cameras.js", "scene.js");
const R = C.SPEC.ranges, P = C.SPEC.phone; let crit = 0, warn = 0;
const row = (ok, level, name, detail) => { if (!ok) { if (level === "crit") crit++; else warn++; } console.log(`${ok ? "PASS" : level === "crit" ? "FAIL" : "WARN"}  ${name}${detail ? "  — " + detail : ""}`); };
const inR = (v, [a, b]) => v >= a && v <= b;

// 1. dimensiones del teléfono y de la mano
const ph = C.buildPhone(THREE); const bb = new THREE.Box3().setFromObject(ph.group), sz = bb.getSize(new THREE.Vector3());
row(inR(sz.x, R.phoneW) && inR(sz.y, R.phoneH) && inR(sz.z, [R.phoneD[0], R.phoneD[1] + 0.35]), "crit", "Dimensiones del teléfono", `${sz.x.toFixed(2)} x ${sz.y.toFixed(2)} x ${sz.z.toFixed(2)} cm (cuerpo ${P.W}x${P.H}x${P.D}, + módulo de cámara y botones)`);
row(inR(P.W / P.H, R.aspect), "crit", "Relación de aspecto del cuerpo", (P.W / P.H).toFixed(3));
const sw = P.W - 2 * P.bezel, sh = P.H - 2 * P.bezel, ta = C.SCREEN_PX.w / C.SCREEN_PX.h;
row(Math.abs(sw / sh - ta) < R.screenAspectTol, "crit", "Textura de pantalla = aspecto físico de la pantalla", `pantalla ${(sw / sh).toFixed(4)} vs textura ${ta.toFixed(4)}`);
const uv = ph.screenMesh.geometry.attributes.uv; let umin = 9, umax = -9, vmin = 9, vmax = -9; for (let i = 0; i < uv.count; i++) { umin = Math.min(umin, uv.getX(i)); umax = Math.max(umax, uv.getX(i)); vmin = Math.min(vmin, uv.getY(i)); vmax = Math.max(vmax, uv.getY(i)); }
row(umin > -1e-6 && umax < 1 + 1e-6 && vmin > -1e-6 && vmax < 1 + 1e-6, "crit", "UV de la pantalla dentro de 0..1", `u[${umin.toFixed(3)},${umax.toFixed(3)}] v[${vmin.toFixed(3)},${vmax.toFixed(3)}]`);
const rig = C.buildHand(THREE); const hl = rig.length();
row(inR(hl, R.handLen) && inR(C.SPEC.hand.palmW, R.palmW), "crit", "Escala de la mano", `muñeca→dedo medio ${hl.toFixed(1)} cm, palma ${C.SPEC.hand.palmW} cm`);
row(Math.abs(hl / P.H - 1.3) < 0.25, "warn", "Relación mano/teléfono (~1,3 × alto)", `${(hl / P.H).toFixed(2)}`);

// 2. escena de comprobación en marco mundial
const grp = new THREE.Group(); const hnd = C.buildHand(THREE); grp.add(hnd.root); C.placeHand(THREE, hnd.root); hnd.arm.rotation.z = -0.32;
const world = new THREE.Matrix4(), inv = new THREE.Matrix4(); const v = new THREE.Vector3();
let minPen = 9, minTag = "", sizeVar = 0, firstSize = null, tipContactBad = 0, tipMinH = 9;
const cam = new THREE.PerspectiveCamera(40, 1080 / 1920, 0.4, 400);
let camMinClear = 9, camWhen = 0, camTag = "", cropBad = [];
const corners = []; for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz2 of [-1, 1]) corners.push(new THREE.Vector3(sx * P.W / 2, sy * P.H / 2, sz2 * P.D / 2));
const appar = {}; const STEP = 0.1;
for (let t = 0; t <= 18 + 1e-9; t += STEP) {
  const X = C.phoneXform(THREE, t); grp.position.set(...X.pos); grp.quaternion.copy(X.quat); grp.updateMatrixWorld(true);
  world.copy(grp.matrixWorld); inv.copy(world).invert();
  const size = new THREE.Box3().setFromObject(ph.body).getSize(new THREE.Vector3()).length(); // invariancia de tamaño del cuerpo base
  if (firstSize === null) firstSize = size; sizeVar = Math.max(sizeVar, Math.abs(grp.scale.x - 1));
  const cp = C.cameraAt(t); cam.position.set(...cp.pos); cam.up.set(0, 1, 0); cam.lookAt(...cp.tgt); if (cp.roll) cam.rotateZ(C.deg(cp.roll)); cam.fov = C.focalToFov(cp.f); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  const camLocal = cam.position.clone().applyMatrix4(inv);
  const phoneClear = C.phoneSDF(camLocal.x, camLocal.y, camLocal.z); let handClear = 99, handTag = "";
  if (X.held) {
    hnd.setPose({ f: C.GRIP.fingers, t: C.thumbPose(t) }); hnd.root.updateMatrixWorld(true);
    for (const q of hnd.samples()) { const l = q.p.clone().applyMatrix4(inv); const d = C.phoneSDF(l.x, l.y, l.z) - q.r; if (d < minPen) { minPen = d; minTag = `${q.tag}@t=${t.toFixed(1)}`; } const dc = cam.position.distanceTo(q.p) - q.r; if (dc < handClear) { handClear = dc; handTag = q.tag; } }
    const tip = new THREE.Vector3(0, C.SPEC.hand.thumb.L[2], 0); hnd.thumb.t2.localToWorld(tip); tip.applyMatrix4(inv); const hgt = tip.z - C.SPEC.hand.thumb.r[2] - P.D / 2;
    if (t >= C.TAP.t && t <= C.TAP.release) { tipMinH = Math.min(tipMinH, hgt); if (hgt > 0.15) tipContactBad++; }
  }
  const clear = Math.min(phoneClear, handClear); if (clear < camMinClear) { camMinClear = clear; camWhen = t; camTag = handClear < phoneClear ? "mano:" + handTag : "teléfono"; }
  if (cp.pos[1] < 0.6) { row(false, "crit", "Cámara bajo la mesa", `t=${t}`); }
  // tamaño aparente del teléfono (altura en fracción del encuadre) y recorte
  const sh2 = C.shotAt(t).id; let ymin = 9, ymax = -9, out = 0;
  for (const c of corners) { const w = c.clone().applyMatrix4(world); w.project(cam); ymin = Math.min(ymin, w.y); ymax = Math.max(ymax, w.y); if (Math.abs(w.x) > 1.0 || Math.abs(w.y) > 1.0) out++; }
  const shd = C.shotAt(t); (appar[sh2] = appar[sh2] || []).push({ t, u: (t - shd.t0) / (shd.t1 - shd.t0), h: (ymax - ymin) / 2, out });
}
row(minPen > -0.1, "crit", "Sin penetración mano↔teléfono (tolerancia 0,1 cm)", `mínimo ${minPen.toFixed(3)} cm en ${minTag}`);
row(sizeVar === 0, "crit", "Escala del teléfono constante (=1) en todo el vídeo", `desviación ${sizeVar}`);
row(tipContactBad === 0, "crit", "Pulgar en contacto con la pantalla durante el toque", `altura mínima de la yema ${tipMinH.toFixed(2)} cm, fotogramas fuera de contacto: ${tipContactBad}`);
const ui = (t) => C.uiState(t).press; row(ui(C.TAP.t + 0.1) === 1 && ui(C.TAP.t - 0.2) === 0, "crit", "Respuesta de la interfaz sincronizada con el contacto", `presión UI ${ui(C.TAP.t - 0.2)} → ${ui(C.TAP.t + 0.1)}`);
row(camMinClear >= 2.0, "crit", "Cámara nunca dentro/pegada a la geometría (≥ 2 cm)", `mínimo ${camMinClear.toFixed(2)} cm con ${camTag} en t=${camWhen.toFixed(1)}`);
// encuadre: B, C y E deben mostrar el teléfono completo en casi todos los fotogramas; A y D son planos de detalle
for (const id of ["B", "C", "E"]) { const a = appar[id].filter((x) => id !== "E" || x.u >= 0.6), cropped = a.filter((x) => x.out > 0).length; row(cropped / a.length <= 0.15, "warn", `Plano ${id}: teléfono completo en encuadre${id === "E" ? " (tramo final)" : ""}`, `${cropped}/${a.length} muestras recortadas; altura aparente ${Math.min(...a.map((x) => x.h)).toFixed(2)}–${Math.max(...a.map((x) => x.h)).toFixed(2)} del encuadre`); }
for (const id of Object.keys(appar)) { const hs = appar[id].map((x) => x.h); row(Math.max(...hs) < 6, "warn", `Plano ${id}: escala aparente sin exageración involuntaria`, `máx ${Math.max(...hs).toFixed(2)}× el encuadre`); }
// focales
const fs = []; for (let t = 0; t <= 18; t += 0.1) fs.push(C.cameraAt(t).f); row(Math.min(...fs) >= 24 && Math.max(...fs) <= 90, "crit", "Focales en rango 24–90 mm", `${Math.min(...fs).toFixed(0)}–${Math.max(...fs).toFixed(0)} mm`);
// continuidad entre cortes (información)
for (let i = 1; i < C.SHOTS.length; i++) { const a = C.cameraAt(C.SHOTS[i].t0 - 1e-3), b = C.cameraAt(C.SHOTS[i].t0 + 1e-3); const d = Math.hypot(...a.pos.map((x, k) => x - b.pos[k])); console.log(`INFO  corte ${C.SHOTS[i - 1].id}→${C.SHOTS[i].id}: salto de cámara ${d.toFixed(1)} cm, focal ${a.f.toFixed(0)}→${b.f.toFixed(0)} mm`); }
console.log(`\nResumen: ${crit} defectos críticos, ${warn} avisos`); process.exit(crit ? 1 : 0);
