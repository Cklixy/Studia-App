/* Actor estilizado con esqueleto (FK) + brazos con cinemática inversa de 2 huesos + cara expresiva.
   Unidades en cm. Marco local del actor: +y arriba, +z hacia donde mira (el torso).  */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  C.ACTOR = { spine: 32, shoulderY: 54, shoulderX: 19, neckY: 60, headY: 78, upper: 30, fore: 27 };
  C.buildActor = function (THREE, cfg) {
    const V3 = THREE.Vector3, Q = THREE.Quaternion, A = C.ACTOR, deg = C.deg;
    const skinC = cfg.skin || 0xe9bc9d;
    const skin = new THREE.MeshStandardMaterial({ color: skinC, roughness: 0.58, emissive: 0x3a160c, emissiveIntensity: 0.1 });
    const M = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? 0.75 : r, metalness: m || 0 });
    const clothM = M(cfg.cloth, 0.88), clothD = M(cfg.clothDark || cfg.cloth, 0.9), pants = M(cfg.pants || 0x2a3042, 0.85), shoe = M(0x1b2030, 0.6);
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body);     // body: pelvis + torso (rotable)
    const sph = (r, mat, sx, sy, sz, seg) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg || 28, 20), mat); m.scale.set(sx || 1, sy || 1, sz || 1); m.castShadow = true; return m; };
    // ---------- torso ----------
    const chest = sph(1, clothM, 16.0, 23.5, 10.4); chest.position.set(0, 33, 0); body.add(chest);
    const belly = sph(1, clothM, 16.2, 16, 10.0); belly.position.set(0, 14, 0); body.add(belly);
    const sh = sph(1, clothM, 18.6, 5.6, 8.4); sh.position.set(0, 52.5, 0); body.add(sh);
    if (cfg.blazer) { // saco: torso torneado (cintura → pecho → hombros), sin "bolas" apiladas
      chest.visible = belly.visible = sh.visible = false;
      const pr = [[-9, 11.5], [-6, 13.2], [0, 13.6], [8, 13.8], [18, 14.2], [28, 15.6], [38, 17.2], [46, 18.0], [51, 16.2], [54, 11], [55.5, 5.5], [56, 0.01]].map(([y, r]) => new THREE.Vector2(r, y));
      const jk = new THREE.Mesh(new THREE.LatheGeometry(pr, 40), clothM); jk.scale.set(1.02, 1, 0.6); jk.castShadow = true; body.add(jk);
    }
    const hip = sph(1, pants, 18, 11, 12); hip.position.set(0, 0, 0); body.add(hip); if (cfg.blazer) hip.scale.set(14.5, 9, 9);
    if (cfg.hoodie) { const hood = sph(1, clothD, 9.5, 5.5, 6.5); hood.position.set(0, 57, -4.5); body.add(hood); [-1, 1].forEach((s) => { const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 12, 8), M(0xf4f6fb, 0.7)); cd.position.set(s * 3.4, 42, 10.4); body.add(cd); }); }
    if (cfg.blazer) { const lap = (s) => { const l = new THREE.Mesh(new THREE.BoxGeometry(6, 30, 1.4), M(0x3b4a73, 0.8)); l.position.set(s * 7.5, 38, 11.4); l.rotation.z = s * 0.22; body.add(l); }; lap(-1); lap(1);
      const shirt = new THREE.Mesh(new THREE.BoxGeometry(9.5, 26, 0.8), M(0xf4f6fb, 0.6)); shirt.position.set(0, 40, 11.2); body.add(shirt); const tie = new THREE.Mesh(new THREE.BoxGeometry(2.4, 24, 0.9), M(0xc10a2b, 0.5)); tie.position.set(0, 39, 11.9); body.add(tie); }
    // ---------- piernas (sentado o de pie) ----------
    const legs = new THREE.Group(); root.add(legs); const legParts = [];
    [-1, 1].forEach((s) => { const th = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 6.2, 1, 16), pants), sh2 = new THREE.Mesh(new THREE.CylinderGeometry(5.8, 4.6, 1, 16), pants), ft = sph(1, shoe, 5.2, 4, 12); th.castShadow = sh2.castShadow = true; if (cfg.blazer) { th.userData.kx = 1.2; sh2.userData.kx = 1.2; } legs.add(th, sh2, ft); legParts.push({ th, sh2, ft, s }); });
    // ---------- cuello y cabeza ----------
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 5.0, 9, 20), skin); neck.castShadow = true; body.add(neck); neck.position.set(0, A.neckY - 1, 0.4);
    const headG = new THREE.Group(); body.add(headG); headG.position.set(0, A.neckY, 1.2);
    const head = new THREE.Group(); head.position.set(0, 12.5, 0); headG.add(head);         // origen = centro del cráneo
    const skull = sph(1, skin, 7.6, 9.8, 9.0); head.add(skull);
    const jaw = sph(1, skin, 6.4, 5.8, 7.2); jaw.position.set(0, -5.8, 1.6); head.add(jaw);
    const chin = sph(1, skin, 3.0, 2.3, 2.6); chin.position.set(0, -9.7, 5.2); head.add(chin);
    [-1, 1].forEach((s) => { const ch = sph(1, skin, 2.4, 2.4, 1.5); ch.position.set(s * 4.8, -3.6, 5.5); head.add(ch); const ear = sph(1, skin, 1.1, 2.2, 1.6); ear.position.set(s * 7.6, -0.4, -0.3); head.add(ear); });
    const nose = sph(1, skin, 1.15, 1.6, 1.4); nose.position.set(0, -1.8, 8.9); head.add(nose);
    // pelo: casquete liso + mechones planos barridos (sin "burbujas")
    const hairM = M(cfg.hair || 0x4a3426, 0.5); const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 24, 0, Math.PI * 2, 0, 1.72), hairM); hairCap.scale.set(8.4, 10.4, 10.0); hairCap.position.set(0, 0.5, -1.4); hairCap.rotation.x = -0.62; hairCap.castShadow = true; head.add(hairCap);
    const lock = (x, y, z, sx, sy, sz, rx, ry, rz) => { const lk = sph(1, hairM, sx, sy, sz); lk.position.set(x, y, z); lk.rotation.set(rx || 0, ry || 0, rz || 0); head.add(lk); };
    (cfg.fringe || [[-3.4, 7.6, 6.6, 3.3, 1.4, 2.4, 0.75, 0, 0.35], [0.5, 8.2, 6.9, 3.6, 1.4, 2.6, 0.8, 0, -0.1], [4.0, 7.4, 6.3, 3.3, 1.4, 2.3, 0.7, 0, -0.4], [-7.2, 3.2, 3.4, 1.7, 3.6, 3.6, 0, 0, 0.1], [7.2, 3.4, 3.2, 1.7, 3.6, 3.6, 0, 0, -0.1]]).forEach((a) => lock(...a));
    if (cfg.hairBack) { const hb = sph(1, hairM, 8.4, 9.0, 5.6); hb.position.set(0, -1.0, -6.4); head.add(hb); }
    // ojos + párpados
    const eyes = [], lids = [], irides = [];
    [-1, 1].forEach((s) => { const eg = new THREE.Group(); eg.position.set(s * 3.2, 0.9, 7.6); head.add(eg);
      const w = sph(1, M(0xfdfdfd, 0.25), 1.5, 1.3, 1.15); eg.add(w);
      const ir = sph(1, M(cfg.iris || 0x5a3a28, 0.3), 0.92, 0.92, 0.3); ir.position.z = 1.0; eg.add(ir); const pu = sph(1, M(0x0e0a08, 0.2), 0.48, 0.48, 0.2); pu.position.z = 1.2; eg.add(pu); const hl = sph(1, new THREE.MeshBasicMaterial({ color: 0xffffff }), 0.22, 0.22, 0.12); hl.position.set(0.32, 0.36, 1.28); eg.add(hl);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(1.62, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), skin); lid.scale.set(1, 0.9, 0.85); eg.add(lid); const lid2 = lid;
      eyes.push(eg); lids.push({ lid, lid2 }); irides.push(ir); });
    // cejas
    const browM = M(cfg.brow || cfg.hair || 0x3a2a22, 0.6), brows = [-1, 1].map((s) => { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 2.9, 6, 10), browM); b.rotation.z = Math.PI / 2; const grp = new THREE.Group(); grp.add(b); grp.position.set(s * 3.3, 3.9, 8.1); head.add(grp); return grp; });
    // boca (forma dinámica)
    const mouthIn = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: 0x4a1218, roughness: 0.6, side: THREE.DoubleSide })), lipMat = M(0xc96a68, 0.5);
    const lipU = new THREE.Mesh(new THREE.BufferGeometry(), lipMat), lipL = new THREE.Mesh(new THREE.BufferGeometry(), lipMat), teeth = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: 0xf6f2ea, roughness: 0.3, side: THREE.DoubleSide }));
    head.add(mouthIn, lipU, lipL, teeth);
    if (cfg.glasses) [-1, 1].forEach((s) => { const r = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.26, 10, 28), M(0x1b2030, 0.35, 0.3)); r.position.set(s * 3.6, 0.7, 9.6); head.add(r); }), (() => { const b = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.26, 0.26), M(0x1b2030)); b.position.set(0, 1.0, 9.9); head.add(b); [-1, 1].forEach((s) => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 8.5), M(0x1b2030)); t.position.set(s * 6.55, 0.8, 5.5); head.add(t); }); })();
    if (cfg.mustache) { [-1, 1].forEach((s) => { const mu = sph(1, hairM, 2.3, 0.75, 1.0); mu.position.set(s * 2.0, -3.3, 8.55); mu.rotation.z = s * -0.22; head.add(mu); }); }
    const sweat = [-1, 1].map((s) => { const d = sph(1, new THREE.MeshStandardMaterial({ color: 0x9fd6f5, roughness: 0.15, transparent: true, opacity: 0.85 }), 0.7, 1.1, 0.7); d.visible = false; d.position.set(s * 7.4, 3, 6); head.add(d); d.userData.noDepth = true; return d; });
    // ---------- brazos ----------
    const sleeveMat = clothM, mkArm = () => { const up = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 3.4, 1, 18), sleeveMat), fo = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 2.7, 1, 18), sleeveMat), el = sph(1, sleeveMat, 3.5, 3.5, 3.5), wr = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.9, 1, 16), skin), cuff = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 1.6, 20), clothD); [up, fo, el, wr, cuff].forEach((m) => (m.castShadow = true)); const gp = new THREE.Group(); gp.add(up, fo, el, wr, cuff); root.add(gp); return { up, fo, el, wr, cuff }; };
    const arms = { L: mkArm(), R: mkArm() };
    const hands = { R: C.buildHand(THREE), L: C.buildHand(THREE) }; hands.R.arm.visible = false; hands.L.arm.visible = false;
    const holderR = new THREE.Group(), holderL = new THREE.Group(); holderR.add(hands.R.root); holderL.add(hands.L.root); holderL.scale.x = -1; scene_add(root, holderR, holderL);
    function scene_add(r, a, b) { r.add(a); r.add(b); }
    // hacer que la piel de la mano y la del actor sean iguales
    [hands.R, hands.L].forEach((h) => h.root.traverse((m) => { if (m.isMesh && m.material && m.material.color && m.material.color.getHex() === 0xe9bc9d) m.material = skin; }));
    // ---------- utilidades ----------
    const _a = new V3(), _b = new V3(), _c = new V3(), _q = new Q(), _m = new THREE.Matrix4();
    const between = (m, p0, p1) => { _a.copy(p1).sub(p0); const L = _a.length(); m.position.copy(p0).addScaledVector(_a, 0.5); m.quaternion.setFromUnitVectors(_b.set(0, 1, 0), _a.normalize()); const kx = (m.userData && m.userData.kx) || 1; m.scale.set(kx, L, kx); return L; };
    function ik(shoulderW, wristW, hint, side) { // 2 huesos: devuelve codo
      const a = A.upper, b = A.fore, d = wristW.clone().sub(shoulderW); let L = d.length(); const maxL = a + b - 0.5, minL = Math.abs(a - b) + 1.5; if (L > maxL) { d.multiplyScalar(maxL / L); L = maxL; } if (L < minL) { d.setLength(minL); L = minL; }
      const dir = d.clone().normalize(), x = (a * a - b * b + L * L) / (2 * L), h = Math.sqrt(Math.max(a * a - x * x, 0));
      const hv = hint.clone().sub(dir.clone().multiplyScalar(hint.dot(dir))); if (hv.lengthSq() < 1e-6) hv.set(0, -1, 0); hv.normalize();
      return shoulderW.clone().addScaledVector(dir, x).addScaledVector(hv, h);
    }
    function frameQuat(fingerDir, palmNormal) { const y = fingerDir.clone().normalize(), z = palmNormal.clone().sub(y.clone().multiplyScalar(palmNormal.dot(y))).normalize(), x = new V3().crossVectors(y, z); return new Q().setFromRotationMatrix(_m.makeBasis(x, y, z)); }
    // ---------- cara ----------
    function lipGeo(pts, th) { const N = pts.length; const pos = new Float32Array(N * 2 * 3), idx = []; for (let i = 0; i < N; i++) { const p = pts[i]; pos.set([p.x, p.y + th, p.z, p.x, p.y - th, p.z], i * 6); if (i < N - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); } const gm = new THREE.BufferGeometry(); gm.setAttribute("position", new THREE.BufferAttribute(pos, 3)); gm.setIndex(idx); gm.computeVertexNormals(); return gm; }
    function setFace(e) {
      const sm = e.smile || 0, op = e.open || 0, N = 14, w = 3.5 + sm * 0.8 + op * 0.2, up = [], lo = []; const baseY = -5.3;
      for (let i = 0; i < N; i++) { const u = (i / (N - 1)) * 2 - 1, x = u * w, cy = baseY + (1 - u * u) * (-0.25 + sm * 0.1) + u * u * sm * 1.9 - (e.frown || 0) * u * u * 0.9 + (e.wave ? Math.sin(u * 9.0 + (e.wavePh || 0)) * 0.34 : 0); const z = 8.45 + (1 - u * u) * 0.55 - u * u * 0.5;
        up.push(new V3(x, cy, z)); lo.push(new V3(x, cy - op * 3.4 * (1 - u * u) - (1 - u * u) * 0.12, z - 0.05)); }
      lipU.geometry.dispose(); lipL.geometry.dispose(); mouthIn.geometry.dispose(); teeth.geometry.dispose();
      lipU.geometry = lipGeo(up, 0.28); lipL.geometry = lipGeo(lo, 0.42);
      mouthIn.visible = teeth.visible = op > 0.04; if (op > 0.04) { const pos = [], ix = [], tp = [], ti = []; for (let i = 0; i < N; i++) { pos.push(up[i].x, up[i].y, up[i].z - 0.1, lo[i].x, lo[i].y, lo[i].z - 0.1); tp.push(up[i].x, up[i].y - 0.05, up[i].z - 0.06, up[i].x, up[i].y - Math.min(op * 3.4 * 0.4 * (1 - Math.pow((i / (N - 1)) * 2 - 1, 2)), 1.0), up[i].z - 0.06); if (i < N - 1) { ix.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); ti.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); } } const g1 = new THREE.BufferGeometry(); g1.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g1.setIndex(ix); g1.computeVertexNormals(); mouthIn.geometry = g1; const g2 = new THREE.BufferGeometry(); g2.setAttribute("position", new THREE.Float32BufferAttribute(tp, 3)); g2.setIndex(ti); g2.computeVertexNormals(); teeth.geometry = g2; teeth.visible = (e.teeth !== false) && sm > 0.3; }
      // cejas: lift (cm), ángulo interior (rad, + = preocupado/triste), enfado (rad, + = fruncido)
      brows.forEach((b, i) => { const s = i === 0 ? -1 : 1; b.position.y = 3.9 + (e.browLift || 0); b.rotation.z = s * (-(e.browAngle || 0)) - s * (e.angry || 0) * 1.0; b.position.x = s * (3.3 - (e.angry || 0) * 0.8); });
      // párpados: 0 abiertos .. 1 cerrados; blink automático lo añade el llamador
      const o = C.clamp(e.eyeOpen == null ? 1 : e.eyeOpen, 0, 1); eyes.forEach((eg) => { eg.scale.y = 0.12 + 0.88 * o; }); lids.forEach(({ lid }) => { lid.visible = false; });
      sweat.forEach((d, i) => { d.visible = !!e.sweat && (e.sweat > 0.01); const ph = ((e.sweatT || 0) + i * 0.45) % 1; d.position.y = 3.5 - ph * 7; d.scale.set(0.7, 1.1 * (1 - 0.3 * ph), 0.7); });
    }
    // ---------- pose ----------
    const target = new V3(), sh0 = { L: new V3(), R: new V3() };
    function look(headWorld) { // orienta cabeza y ojos hacia un punto del mundo (suavizado por el llamador)
      root.updateMatrixWorld(true); const hp = new V3(); head.getWorldPosition(hp); const inv = new THREE.Matrix4().copy(headG.parent.matrixWorld).invert(); const lp = headWorld.clone().applyMatrix4(inv).sub(headG.position); const yaw = Math.atan2(lp.x, lp.z), pitch = -Math.atan2(lp.y - 12.5, Math.hypot(lp.x, lp.z));
      return { yaw: C.clamp(yaw, -1.1, 1.1), pitch: C.clamp(pitch, -0.7, 0.7) };
    }
    function setPose(p) {
      root.position.set(...(p.pos || [0, 0, 0])); root.rotation.set(0, p.yaw || 0, 0);
      body.position.set(0, 0, 0); body.rotation.set(p.lean || 0, p.twist || 0, p.tilt || 0);
      const breath = Math.sin((p.t || 0) * 1.9) * 0.35; chest.scale.set(16.0, 23.5 + breath * 0.5, 10.6 + breath * 0.4); sh.position.y = 52.5 + breath * 0.3;
      // cabeza
      let hy = p.headYaw || 0, hp2 = p.headPitch || 0; if (p.lookAt) { const L = look(new V3(...p.lookAt)); hy = L.yaw; hp2 = L.pitch; }
      headG.rotation.set(hp2 * 0.62 + (p.headLean || 0), hy * 0.62, p.headTilt || 0); const er = Math.min(1, Math.abs(hy) > 0.65 ? 0.38 : 0.55); eyes.forEach((e) => e.lookAt && 0); const ey = hy * 0.38, ep = hp2 * 0.38; eyes.forEach((e, i) => { e.rotation.set(ep, ey + (p.eyeYaw || 0), 0); });
      const ex = Object.assign({}, p.expr || {}); const bl = p.blink != null ? p.blink : autoBlink(p.t || 0); ex.eyeOpen = Math.min(ex.eyeOpen == null ? 1 : ex.eyeOpen, 1 - bl); setFace(ex);
      root.updateMatrixWorld(true);
      // piernas
      legs.visible = p.legs !== false; if (legs.visible) { const sit = p.sit !== false, wk = p.walk == null ? null : p.walk; legParts.forEach(({ th, sh2, ft, s }) => { const hipW = new V3(s * 9, 0, 0); let kneeW, ankW; if (sit) { kneeW = new V3(s * 9.5, 1.5, 44); ankW = new V3(s * 9.5, -42, 44); } else if (wk == null) { kneeW = new V3(s * 9.5, -46, 2); ankW = new V3(s * 9.5, -92, 0); } else { const ph = wk * Math.PI * 2 + (s > 0 ? 0 : Math.PI), th2 = 0.55 * Math.sin(ph), bend = Math.max(0, -Math.sin(ph + 0.6)) * 0.9; kneeW = new V3(s * 9.5, -46 * Math.cos(th2), 46 * Math.sin(th2)); const a2 = th2 - bend; ankW = kneeW.clone().add(new V3(0, -46 * Math.cos(a2), 46 * Math.sin(a2))); } between(th, hipW, kneeW); between(sh2, kneeW, ankW); ft.position.set(s * 9.5, ankW.y - 3, ankW.z + 4); }); }
      // brazos
      ["L", "R"].forEach((sd) => {
        const t = p["wrist" + sd]; const arm = arms[sd], holder = sd === "L" ? holderL : holderR, hand = hands[sd]; const s = sd === "L" ? 1 : -1;
        const shoulderW = new V3(s * A.shoulderX, A.shoulderY, 0).applyMatrix4(body.matrixWorld);
        arm.up.parent.visible = !!t; holder.visible = !!t; if (!t) return;
        const wristW = new V3(...t.pos), hint = new V3(...(t.hint || [s * 0.6, -1, -0.2]));
        const elbow = ik(shoulderW, wristW, hint, sd); const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
        const sL = shoulderW.clone().applyMatrix4(inv), eL = elbow.clone().applyMatrix4(inv), wL = wristW.clone().applyMatrix4(inv);
        between(arm.up, sL, eL); between(arm.fo, eL, wL.clone().lerp(eL, 0.12)); arm.el.position.copy(eL); const cuffP = wL.clone().lerp(eL, 0.12), dir = wL.clone().sub(eL).normalize();
        arm.cuff.position.copy(cuffP); arm.cuff.quaternion.setFromUnitVectors(_b.set(0, 1, 0), dir); arm.wr.position.copy(wL.clone().addScaledVector(dir, -1.2)); arm.wr.quaternion.copy(arm.cuff.quaternion); arm.wr.scale.set(1, 3.4, 1);
        const q = t.quat ? new Q(...t.quat) : frameQuat(new V3(...(t.fingers || [0, 1, 0])), new V3(...(t.palm || [0, 0, 1])));
        const rq = new Q(); root.getWorldQuaternion(rq); holder.position.copy(wL); holder.quaternion.copy(rq.invert().multiply(q)); holder.scale.set(sd === "L" ? -1 : 1, 1, 1);
        hand.setPose(t.pose || C.HAND_POSES.relaxed);
      });
      root.updateMatrixWorld(true);
    }
    function autoBlink(t) { const ph = (t * 0.33 + (cfg.blinkSeed || 0)) % 1; return ph > 0.965 ? Math.sin((ph - 0.965) / 0.035 * Math.PI) : 0; }
    return { root, body, headG, head, setPose, setFace, hands, arms, frameQuat, lookWorld: (v) => v };
  };
  // ---- poses de mano genéricas (ángulos en grados: dedos [mcp,pip,dip,spread], pulgar {cmc,mcp,ip}) ----
  C.HAND_POSES = {
    relaxed: { f: [[14, 24, 12, 3], [18, 30, 14, 0], [22, 34, 16, -3], [26, 36, 16, -6]], t: { cmc: [10, -20, 10], mcp: 14, ip: 10 } },
    fist: { f: [[80, 95, 55, 0], [84, 98, 58, 0], [86, 100, 60, 0], [86, 100, 60, 0]], t: { cmc: [20, -40, 30], mcp: 40, ip: 30 } },
    flat: { f: [[2, 4, 2, 2], [2, 4, 2, 0], [2, 4, 2, -2], [2, 4, 2, -4]], t: { cmc: [10, -10, 0], mcp: 6, ip: 4 } },
    point: { f: [[4, 6, 4, 0], [86, 100, 60, 0], [88, 100, 60, 0], [88, 100, 60, 0]], t: { cmc: [20, -40, 30], mcp: 30, ip: 20 } },
    thumbsUp: { f: [[84, 96, 58, 0], [86, 98, 60, 0], [88, 100, 60, 0], [88, 100, 60, 0]], t: { cmc: [-30, -20, 60], mcp: -4, ip: -4 } }
  };
})(typeof window !== "undefined" ? window : globalThis);
