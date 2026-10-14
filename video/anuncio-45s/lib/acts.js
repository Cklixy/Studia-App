(function (g) {
  const C = (g.Cine = g.Cine || {});
  const A = (C.ACT_FN = {});
  const FR = (o) => Object.assign({ smile: 0, open: 0, browLift: 0, browAngle: 0, angry: 0, frown: 0, eyeOpen: 1 }, o);
  const lerpArr = (a, b, u) => a.map((x, i) => x + (b[i] - x) * u);
  const sstep = (u) => u * u * (3 - 2 * u);
  function setScreen(c, st) { C.drawPhoneScreen(c.sCtx, st); c.sTex.needsUpdate = true; }
  C.phoneScreenAt = setScreen;
  // ---------- ACTO A: GANCHO (0–3 s) ----------
  A.A = function (c, t) {
    const { V3, Q, Wd, student, sheet, seg, E } = c; Wd.setPlace("class"); const u = t / 3.0;
    c.hideAll(); const lowered = E.inOutCubic(seg(t, 1.05, 1.5));
    const sy = 36 - 17 * lowered, sz = 30 + 6 * lowered; c.setSheetHeld(new V3(0, sy, sz), new Q().setFromAxisAngle(new V3(0, 1, 0), Math.PI)); c.drawSheet({ grade: 1, exc: seg(t, 0.3, 0.7), mark: 1, work: 1 });
    const joy = E.outCubic(seg(t, 1.25, 1.7)); const wob = Math.sin(t * 9) * 0.03 * seg(t, 1.5, 3);
    const look = [0, sy + 4, sz];
    student.setPose(c.seated({ t, lean: -0.06 - 0.04 * joy, lookAt: lowered > 0.5 ? [0, 52, -40] : look, headTilt: wob + 0.08 * joy, expr: FR({ smile: 0.3 + 0.7 * joy, open: 0.7 * joy, browLift: 0.9 * joy, eyeOpen: 1 }), blink: 0,
      wristR: Object.assign(c.wristForSheet("R"), { pose: Object.assign({}, C.GRIP_SHEET.fingers && { f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb.hold }), hint: [-0.5, -1, 0.3] }), wristL: Object.assign(c.wristForSheet("L"), { pose: { f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb.hold }, hint: [0.5, -1, 0.3] }) }));
    if (t < 1.3) { const k = t / 1.3; const P = [-8 + 6 * k, 40 - 2 * k, -28 + 8 * k], T = [0, 33, 36]; c.shot = { pos: P, tgt: T, f: 65, focus: Math.hypot(P[0] - T[0], P[1] - T[1], P[2] - T[2]), fstop: 4, dof: 0.35, roll: 2 - 3 * k, mood: "clarity", vig: 0.4, exposure: 0.92 }; }
    else { const k = E.inOutSine(seg(t, 1.3, 3.0)), hp = c.headPos(); const P = lerpArr([-16, hp.y + 6, -30], [-5, hp.y + 3, -6], k), T = [0, hp.y - 1, hp.z]; c.shot = { pos: P, tgt: T, f: 60, focus: Math.hypot(P[0] - hp.x, P[1] - hp.y, P[2] - hp.z) - 2, fstop: 2.4, dof: 0.45, roll: -2 + 3 * k, mood: "clarity", vig: 0.34 }; }
  };
  // ---------- ACTO B: CONFLICTO (3–8 s) ----------
  A.B = function (c, t) {
    const { V3, Q, THREE, Wd, student, sheet, pencil, dClock, seg, E } = c; Wd.setPlace("home"); c.hideAll(); const u = t - 3;
    // hoja sobre el escritorio
    sheet.position.set(0, 0.12, 22); sheet.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0.06)); sheet.visible = true; sheet.updateMatrixWorld(true); c.drawSheet({ scribble: seg(t, 3.2, 4.4), work: 0.35 });
    // reloj de escritorio
    const T = 11 * 3600 + 57 * 60 + t; dClock.userData.s.rotation.z = -(T % 60) / 60 * Math.PI * 2; dClock.userData.m.rotation.z = -((T / 60) % 60) / 60 * Math.PI * 2; dClock.userData.h.rotation.z = -((T / 3600) % 12) / 12 * Math.PI * 2;
    // lápiz: golpecitos nerviosos
    const tapP = Math.max(0, Math.sin(u * 7.0)) ** 2, tipP = new V3(-6 + Math.sin(u * 0.8) * 1.2, 0.4 + 3.0 * (1 - tapP), 20 - u * 0.2);
    const dirW = new V3(0.12, -0.55, -0.82).normalize(), wr = c.wristForPencil(tipP, dirW, 0.9); c.placePencilInHand(wr);
    const frust = E.inOutSine(seg(t, 3.0, 5.5)), faceT = seg(t, 5.7, 6.4);
    const expr = FR({ smile: -0.55 * frust, frown: 1.0 * frust, angry: 0.55 * frust, browAngle: 0.0, eyeOpen: 0.8, sweat: seg(t, 6.4, 6.8), sweatT: t * 0.7 });
    const glance = t < 5.7 ? [0, 0.5, 20] : (Math.sin(t * 2.1) > 0.4 ? [0, 30, 4] : [0, 0.5, 18]);
    const tempAt = new V3(-7.5, 52, 56);
    student.setPose(c.seated({ t, lean: 0.08 + 0.03 * Math.sin(t * 1.3), headPitch: 0, lookAt: glance, headTilt: -0.05 * frust, expr,
      wristR: { pos: wr.pos, quat: wr.quat, pose: C.GRIP_PENCIL.pose, hint: [0.4, -1, 0.2] },
      wristL: faceT > 0 ? { pos: lerpArr([-18, 4, 34], [-13, 49, 50], E.inOutCubic(faceT)), fingers: [-0.1, 1, -0.2], palm: [1, 0, 0.1], pose: C.HAND_POSES.relaxed, hint: [-1, -0.5, -0.3] } : { pos: [-16, 3, 34], fingers: [0, 0, -1], palm: [0, -1, 0], pose: C.HAND_POSES.relaxed, hint: [-0.5, -1, 0] } }));
    // cámara
    if (t < 4.7) { const k = E.inOutSine(seg(t, 3, 4.7)); const P = lerpArr([-26, 13, 6], [6, 11, 5], k), T = lerpArr([-12, 0, 21], [-2, 0, 21], k); c.shot = { pos: P, tgt: T, f: 70, focus: Math.hypot(P[0] - T[0], P[1] - T[1], P[2] - T[2]), fstop: 3.2, dof: 0.5, roll: 3 - 5 * k, mood: "tense", vig: 0.42, exposure: 0.8 }; }
    else if (t < 5.7) { const k = seg(t, 4.7, 5.7); const P = lerpArr([-18, 14, 24], [-26, 12, 20], k), T = [-40, 6, -6]; c.shot = { pos: P, tgt: T, f: 70, focus: Math.hypot(P[0] - T[0], P[1] - T[1], P[2] - T[2]), fstop: 2.8, dof: 0.6, roll: -2, mood: "tense", vig: 0.44, exposure: 0.85 }; }
    else { const k = E.inOutSine(seg(t, 5.7, 8.0)), hp = c.headPos(); const P = lerpArr([-14, hp.y + 5, -8], [-6, hp.y + 2, 8], k), T = [0, hp.y - 3, hp.z]; c.shot = { pos: P, tgt: T, f: 60, focus: Math.hypot(P[0] - hp.x, P[1] - hp.y, P[2] - hp.z) - 2, fstop: 2.4, dof: 0.45, roll: 1 - 3 * k, mood: "tense", vig: 0.4 }; }
  };
})(typeof window !== "undefined" ? window : globalThis);
