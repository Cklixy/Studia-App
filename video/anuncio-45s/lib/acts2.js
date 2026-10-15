(function (g) {
  const C = (g.Cine = g.Cine || {}), A = C.ACT_FN;
  const FR = (o) => Object.assign({ smile: 0, open: 0, browLift: 0, browAngle: 0, angry: 0, frown: 0, eyeOpen: 1 }, o);
  const lerpArr = (a, b, u) => a.map((x, i) => x + (b[i] - x) * u);
  C.GRIP.thumb.rest = { cmc: [90, -40, -97], mcp: 75, ip: 70 };
  const thumbKeyed = (keys, t, grip) => { grip = grip || C.GRIP.thumb; let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++; const [ta, na] = keys[i], [tb, nb] = keys[i + 1], u = C.ease.inOutSine(C.clamp((t - ta) / Math.max(tb - ta, 1e-6), 0, 1)), a = grip[na], b = grip[nb], L = C.lerp; return { cmc: a.cmc.map((x, k) => L(x, b.cmc[k], u)), mcp: L(a.mcp, b.mcp, u), ip: L(a.ip, b.ip, u) }; };
  const orbit = (cn, r, az, el) => { const a = C.deg(az), e = C.deg(el); return [cn[0] + r * Math.sin(a) * Math.cos(e), cn[1] + r * Math.sin(e), cn[2] + r * Math.cos(a) * Math.cos(e)]; };
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  const REST_L = { pos: [-17, 3, 33], fingers: [0, 0, -1], palm: [0, -1, 0], pose: C.HAND_POSES.relaxed, hint: [-0.5, -1, 0] };
  const REST_R = { pos: [17, 3, 33], fingers: [0, 0, -1], palm: [0, -1, 0], pose: C.HAND_POSES.relaxed, hint: [0.5, -1, 0] };
  // apoya el teléfono en la mano derecha (agarre resuelto) y devuelve el wrist
  function heldPhone(c, pos, eul, thumbPose) { const { THREE, phone } = c; phone.group.visible = true; phone.group.position.set(...pos); phone.group.quaternion.setFromEuler(new THREE.Euler(eul[0], eul[1], eul[2], "XYZ")); phone.group.updateMatrixWorld(true); const w = c.wristForPhone(); return Object.assign(w, { pose: { f: C.GRIP.fingers, t: thumbPose }, hint: [0.6, -1, 0.2] }); }
  // ---------- ACTO C: DESCUBRIMIENTO (8–14 s) ----------
  A.C = function (c, t) {
    const { Wd, student, phone, seg, E } = c; Wd.setPlace("home"); c.hideAll();
    const lift = E.inOutCubic(seg(t, 8.0, 8.55)); const pos = lerpArr([6, 12, 34], [1, 21, 25], lift);
    const TK = [[8, "rest"], [9.5, "rest"], [10.2, "hoverBtn"], [10.5, "tapBtn"], [10.75, "tapBtn"], [11.1, "rest"], [12.2, "hoverBtn"], [12.7, "tapBtn"], [12.95, "tapBtn"], [13.3, "rest"], [14.1, "rest"]];
    const w = heldPhone(c, pos, [-0.34, -0.08, 0], thumbKeyed(TK, t));
    const tapC = (tt) => ({ press: t >= tt - 0.05 && t < tt + 0.3 ? 1 : 0, ripple: t >= tt ? (t - tt) / 0.7 : -1 }); const px = C.screenCmToPx(C.GRIP.contact.tapBtn[0], C.GRIP.contact.tapBtn[1]);
    let st; if (t < 9.3) st = { screen: "home" }; else if (t < 10.9) st = Object.assign({ screen: "materias", from: t < 9.8 ? "home" : null, k: seg(t, 9.3, 9.85) }, tapC(10.5)); else if (t < 13.1) st = Object.assign({ screen: "ruta", from: t < 11.45 ? "materias" : null, k: seg(t, 10.9, 11.45) }, tapC(12.7)); else st = { screen: "foco", from: "ruta", k: seg(t, 13.1, 13.65) };
    st.rx = px[0]; st.ry = px[1]; C.phoneScreenAt(c, st);
    const curious = E.inOutSine(seg(t, 8.5, 11)); const glow = seg(t, 13.2, 14);
    student.setPose(c.seated({ t, lean: 0.1, lookAt: pos, expr: FR({ smile: 0.15 + 0.25 * curious + 0.3 * glow, browLift: 0.6 * curious, eyeOpen: 1 }), wristR: w, wristL: REST_L }));
    const k = E.inOutSine(seg(t, 8, 14)), cn = [pos[0], pos[1] + 1, pos[2]]; const P = orbit(cn, 26 - 3 * k, 18 - 52 * k, 10 + 10 * k); c.shot = { pos: P, tgt: [pos[0] - 1 * k, pos[1] - 1 - 0 * k, pos[2] - 1 * k], f: 52 + 6 * k, focus: dist(P, cn), fstop: 3.2, dof: 0.35, roll: 2 * (0.5 - k), mood: "neutral", vig: 0.32 };
  };
  // ---------- ACTO D: DEMOSTRACIÓN (14–23 s) ----------
  A.D = function (c, t) {
    const { THREE, Wd, student, phone, holo, panels, seg, E } = c; Wd.setPlace("home"); c.hideAll();
    phone.group.visible = true; phone.group.position.set(-26, 7.1, 18); phone.group.quaternion.setFromEuler(new THREE.Euler(-0.3, 0.45, 0, "XYZ")); phone.group.updateMatrixWorld(true);
    C.phoneScreenAt(c, { screen: "foco" }); const HP = [-4, 1.2, -12]; holo.group.position.set(...HP);
    const show = E.outCubic(seg(t, 14.3, 15.4)), h = t < 14.8 ? 1.6 : 1.6 * Math.exp(-5.2 * seg(t, 14.8, 18.0)) + 0.015, tan = seg(t, 18.0, 18.5), deriv = E.outCubic(seg(t, 19.0, 20.2));
    const fadeOut = 1 - seg(t, 22.5, 23.0);
    const camP = (c.shot && c.shot.pos) ? new THREE.Vector3(...c.shot.pos) : null;
    c.holoParams = { show: show * fadeOut, h, tangent: tan, deriv: deriv * fadeOut };
    // paneles auténticos: practicar (método) y recordar (racha)
    panels.forEach((p) => (p.mesh.visible = false)); const pr = seg(t, 17.6, 18.4) * (1 - seg(t, 20.4, 21.0)), rc = seg(t, 21.0, 21.8);
    panels[0].mesh.visible = pr > 0.01; panels[0].mesh.position.set(10, 3 + 2 * E.outCubic(pr), 10); panels[0].mesh.rotation.y = -0.38; panels[0].mesh.scale.setScalar(0.45 + 0.3 * E.outCubic(pr)); panels[0].mat.opacity = pr;
    panels[1].mesh.visible = rc > 0.01; panels[1].mesh.position.set(9, 4 + 2 * E.outCubic(rc), 10); panels[1].mesh.rotation.y = -0.3; panels[1].mesh.scale.setScalar(0.45 + 0.3 * E.outCubic(rc)); panels[1].mat.opacity = rc;
    // estudiante: curiosidad -> comprensión (aha ~18.3) -> confianza
    const aha = E.outCubic(seg(t, 18.0, 18.6)), conf = seg(t, 20, 22);
    const point = seg(t, 15.4, 16.0) * (1 - seg(t, 18.0, 18.6));
    const wristR = point > 0.01 ? { pos: lerpArr([17, 3, 33], [9, 24, 38], E.inOutCubic(point)), fingers: [-0.3, 0.2, -1], palm: [-1, 0, 0], pose: C.HAND_POSES.point, hint: [0.6, -1, 0.2] } : REST_R;
    student.setPose(c.seated({ t, lean: 0.14 - 0.12 * conf, lookAt: [HP[0] + 4, 24, HP[2]], headTilt: 0.07 * (1 - aha), expr: FR({ smile: 0.1 + 0.9 * aha * (0.7 + 0.3 * conf), open: 0.5 * aha * (1 - conf), browLift: 0.6 * (1 - aha) + 0.8 * aha, eyeOpen: 1 }), wristR, wristL: REST_L }));
    // cámaras: D1 (14–17.6) órbita frontal al gráfico; D2 (17.6–19.2) reacción; D3 (19.2–23) órbita amplia + retirada
    const cn = [HP[0] + 4, 22, HP[2]];
    if (t < 17.6) { const k = E.inOutSine(seg(t, 14, 17.6)); const P = orbit(cn, 60 - 6 * k, 8 + 26 * k, 8 + 6 * k); c.shot = { pos: P, tgt: [HP[0] + 6, 21, HP[2]], f: 34, focus: dist(P, [HP[0] + 6, 20, HP[2]]), fstop: 4, dof: 0.28, roll: 2 - 3 * k, mood: "clarity", vig: 0.34 }; }
    else if (t < 19.2) { const k = E.inOutSine(seg(t, 17.6, 19.2)), hp = c.headPos(); const P = lerpArr([-18, hp.y + 4, -40], [-8, hp.y + 2, -28], k); c.shot = { pos: P, tgt: [0, hp.y - 3, hp.z], f: 80, focus: dist(P, [hp.x, hp.y, hp.z]) - 2, fstop: 2.4, dof: 0.42, roll: -1 + 2 * k, mood: "clarity", vig: 0.38 }; }
    else { const k = E.inOutSine(seg(t, 19.2, 23)); const P = orbit(cn, 56 + 16 * k, 36 - 62 * k, 12 + 10 * k); c.shot = { pos: P, tgt: [HP[0] + 8 * (1 - k) + 6, 22, HP[2]], f: 32, focus: dist(P, cn) - 4 * (1 - k), fstop: 4, dof: 0.3, roll: 1 - 2 * k, mood: "clarity", vig: 0.34 }; }
  };
  // ---------- ACTO E: TRANSFORMACIÓN (23–30 s) ----------
  function writeTip(w) { const lines = [[70, 480, 560, 470], [70, 560, 700, 548], [70, 640, 420, 636], [70, 720, 640, 714]]; const n = w * 4, i = Math.min(3, Math.floor(n)), u = n - i, l = lines[i]; const cx = l[0] + (l[2] - l[0]) * u, cy = l[1] + (l[3] - l[1]) * u; return [(cx - 500) * 0.021, 0.45 + 0.18 * Math.sin(u * 30), 22 + (cy - 707) * 0.021]; }
  A.E = function (c, t) {
    const { THREE, V3, Wd, student, sheet, pencil, dClock, stack, seg, E } = c; Wd.setPlace("home"); c.hideAll();
    const lampK = E.inOutSine(seg(t, 26.2, 29.2));
    if (t < 24.8) { // E1: escritura
      const w = seg(t, 23, 24.8) * 0.9 + 0.08; sheet.position.set(0, 0.12, 22); sheet.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0.06)); sheet.visible = true; sheet.updateMatrixWorld(true); c.drawSheet({ work: w });
      const tip = new V3(...writeTip(w)), wr = c.wristForPencil(tip, new V3(0.1, -0.55, -0.82), 0.9); c.placePencilInHand(wr);
      student.setPose(c.seated({ t, lean: 0.1, lookAt: [tip.x, 0, tip.z], expr: FR({ smile: 0.1, eyeOpen: 0.85 }), wristR: { pos: wr.pos, quat: wr.quat, pose: C.GRIP_PENCIL.pose, hint: [0.4, -1, 0.2] }, wristL: { pos: [-14, 3, 24], fingers: [0.1, 0, -1], palm: [0, -1, 0], pose: C.HAND_POSES.flat, hint: [-0.5, -1, 0] } }));
      const k = E.inOutSine(seg(t, 23, 24.8)); const P = lerpArr([-26, 13, 8], [6, 11, 6], k), T = [tip.x, 0, tip.z]; c.shot = { pos: P, tgt: T, f: 70, focus: dist(P, T), fstop: 2.8, dof: 0.6, roll: 2 - 3 * k, mood: { a: "neutral", b: "warm", k: lampK * 0.3 }, vig: 0.38 };
    } else if (t < 26.5) { // E2: práctica en el teléfono
      const pos = [1, 21, 25], TK = [[24.8, "rest"], [25.3, "hoverBtn"], [25.6, "tapBtn"], [25.85, "tapBtn"], [26.2, "rest"], [26.5, "rest"]]; const w = heldPhone(c, pos, [-0.34, -0.08, 0], thumbKeyed(TK, t));
      C.phoneScreenAt(c, { screen: t < 25.6 ? "tutor" : "metodo", from: t < 25.9 && t >= 25.6 ? "tutor" : null, k: seg(t, 25.6, 26.1), press: 0 });
      student.setPose(c.seated({ t, lean: 0.06, lookAt: pos, expr: FR({ smile: 0.35, eyeOpen: 1 }), wristR: w, wristL: REST_L }));
      const k = E.inOutSine(seg(t, 24.8, 26.5)), cn = [1, 22, 25]; const P = orbit(cn, 21, -30 + 55 * k, 16); c.shot = { pos: P, tgt: cn, f: 55, focus: dist(P, cn), fstop: 3.2, dof: 0.35, roll: -1 + 2 * k, mood: { a: "neutral", b: "warm", k: lampK * 0.5 }, vig: 0.32 };
    } else if (t < 28.2) { // E3: plano medio de confianza
      const k = E.inOutSine(seg(t, 26.5, 28.2)); student.setPose(c.seated({ t, lean: -0.12 * k, lookAt: [0, 52, -30], headTilt: -0.04, expr: FR({ smile: 0.55 + 0.3 * k, open: 0.1, browLift: 0.2, eyeOpen: 1 }), wristR: REST_R, wristL: { pos: [-12, 58, 54], fingers: [0.2, 1, -0.1], palm: [1, 0, 0], pose: C.HAND_POSES.relaxed, hint: [-1, -0.2, -0.3] } }));
      const hp = c.headPos(), P = lerpArr([-18, hp.y - 4, -22], [-6, hp.y - 1, -4], k); c.shot = { pos: P, tgt: [0, hp.y - 4, hp.z], f: 55, focus: dist(P, [hp.x, hp.y, hp.z]) - 2, fstop: 2.4, dof: 0.42, roll: -2 + 3 * k, mood: { a: "neutral", b: "warm", k: 0.5 + 0.5 * k }, vig: 0.32 };
    } else { // E4: plano abierto cenital, tiempo transcurre
      const k = E.inOutSine(seg(t, 28.2, 30)); const tt = (t - 28.2) * 220; const T0 = 18 * 3600 + 20 * 60 + tt;
      dClock.userData.s.rotation.z = -(T0 % 60) / 60 * Math.PI * 2; dClock.userData.m.rotation.z = -((T0 / 60) % 60) / 60 * Math.PI * 2; dClock.userData.h.rotation.z = -((T0 / 3600) % 12) / 12 * Math.PI * 2;
      stack.children.forEach((p, i) => (p.visible = i <= Math.floor(k * 5.99))); sheet.visible = false;
      student.setPose(c.seated({ t, lean: 0.05, lookAt: [0, 0, 22], expr: FR({ smile: 0.6, eyeOpen: 1 }), wristR: REST_R, wristL: REST_L }));
      const P = lerpArr([70, 130, 120], [20, 100, 70], k), T = [0, 10, 25]; c.shot = { pos: P, tgt: T, f: 35, focus: dist(P, T), fstop: 5.6, dof: 0.25, roll: 4 - 8 * k, mood: "warm", vig: 0.3 };
    }
  };
  // ---------- ACTO F: EXPECTACIÓN (30–37 s) ----------
  A.F = function (c, t) {
    const { THREE, V3, Q, Wd, student, prof, sheet, pencil, seg, E } = c; Wd.setPlace("class"); c.hideAll(); prof.root.visible = true; c.stack.visible = false;
    c.dClock.visible = false;
    if (t < 32.2) { // F1: última línea y alivio
      const w = 0.7 + 0.3 * seg(t, 30, 31.4); sheet.position.set(0, 0.12, 22); sheet.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0.06)); sheet.visible = true; sheet.updateMatrixWorld(true); c.drawSheet({ work: w });
      const lift = seg(t, 31.4, 31.9), tip = new V3(...writeTip(Math.min(w, 0.999))); tip.y += 4 * lift; const wr = c.wristForPencil(tip, new V3(0.1, -0.55, -0.82), 0.9); c.placePencilInHand(wr);
      const relief = E.inOutSine(seg(t, 31.5, 32.2));
      student.setPose(c.seated({ t, lean: 0.1 - 0.16 * relief, lookAt: relief > 0.3 ? [0, 50, -30] : [tip.x, 0, tip.z], expr: FR({ smile: 0.4 * relief, open: 0.5 * Math.sin(relief * Math.PI), eyeOpen: 1 - 0.3 * Math.sin(relief * Math.PI) }), wristR: { pos: wr.pos, quat: wr.quat, pose: C.GRIP_PENCIL.pose, hint: [0.4, -1, 0.2] }, wristL: { pos: [-14, 3, 24], fingers: [0.1, 0, -1], palm: [0, -1, 0], pose: C.HAND_POSES.flat, hint: [-0.5, -1, 0] } }));
      prof.setPose({ pos: [-140, 16, -40], yaw: 0, sit: false, legs: false, t });
      if (t < 31.4) { const k = E.inOutSine(seg(t, 30, 31.4)); const P = lerpArr([-26, 13, 8], [6, 11, 6], k), T = [tip.x, 0, tip.z]; c.shot = { pos: P, tgt: T, f: 75, focus: dist(P, T), fstop: 2.8, dof: 0.6, roll: 1 - 2 * k, mood: "class", vig: 0.38 }; }
      else { const k = E.inOutSine(seg(t, 31.4, 32.2)), hp = c.headPos(); const P = lerpArr([-14, hp.y + 4, -8], [-8, hp.y + 2, 4], k); c.shot = { pos: P, tgt: [0, hp.y - 3, hp.z], f: 60, focus: dist(P, [hp.x, hp.y, hp.z]) - 2, fstop: 2.4, dof: 0.42, roll: -1, mood: "class", vig: 0.36 }; }
    } else if (t < 34.5) { // F2: el profesor se acerca (seguimiento lateral)
      const k = E.inOutSine(seg(t, 32.2, 34.5)), px = -120 + 92 * k, pz = -40; const ph = (t - 32.2) * 1.15; sheet.visible = false;
      const sw = Math.sin(ph * Math.PI * 2), armH = (s) => ({ pos: [px + 9 * sw * s, 20, pz + s * 19], fingers: [0.15, -1, 0], palm: [s, 0, 0], pose: C.HAND_POSES.relaxed, hint: [0, -0.3, s] });
      prof.setPose({ pos: [px, 16, pz], yaw: Math.PI * 0.5, sit: false, walk: ph, t, lookAt: [0, 52, 62], expr: FR({ smile: 0.2, browLift: 0.1 }), wristR: armH(-1), wristL: armH(1) });
      student.setPose(c.seated({ t, lean: -0.05, lookAt: [px, 55, pz], expr: FR({ smile: 0.0, browLift: 0.5, eyeOpen: 1 }), wristR: REST_R, wristL: REST_L }));
      const P = [px * 0.5 - 10, 40, -182], T = [px * 0.6, 42, pz]; c.shot = { pos: P, tgt: T, f: 26, focus: dist(P, [px, 60, pz]), fstop: 4, dof: 0.3, roll: 2 * (0.5 - k), mood: "class", vig: 0.36 };
    } else { // F3: pausa y entrega (la hoja se acerca al estudiante)
      const give = E.inOutCubic(seg(t, 34.7, 36.4)), px = -26 + 22 * give * 0, pz = -10;
            const sP = lerpArr([-26, 40, 16], [0, 36, 24], give); c.setSheetHeld(new V3(...sP), new Q().setFromAxisAngle(new V3(0, 1, 0), Math.PI)); c.drawSheet({ work: 1, mark: 1, grade: 0 });
      const prW = c.wristForSheet("R"), plW = c.wristForSheet("L");
      prof.setPose({ pos: [-28, 16, 2], yaw: Math.PI * 0.82, sit: false, t, lookAt: [0, 52, 62], expr: FR({ smile: 0.15 + 0.1 * give, browLift: 0.15 }), wristR: Object.assign(prW, { pose: { f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb.hold }, hint: [-0.5, -1, 0.3] }), wristL: Object.assign(plW, { pose: { f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb.hold }, hint: [0.5, -1, 0.3] }) });
      const reach = seg(t, 35.4, 36.6);
      student.setPose(c.seated({ t, lean: -0.02 + 0.08 * reach, lookAt: sP, expr: FR({ smile: 0.0, browLift: 0.7 * seg(t, 34.6, 35.6), eyeOpen: 1, open: 0.12 * Math.sin(t * 2.2) ** 2 }), wristR: { pos: lerpArr([17, 3, 33], [9, 34, 30], E.inOutCubic(reach)), fingers: [-0.2, 0.3, -1], palm: [-1, 0, 0.2], pose: C.HAND_POSES.flat, hint: [0.6, -1, 0.2] }, wristL: { pos: lerpArr([-17, 3, 33], [-9, 34, 30], E.inOutCubic(reach)), fingers: [0.2, 0.3, -1], palm: [1, 0, 0.2], pose: C.HAND_POSES.flat, hint: [-0.6, -1, 0.2] } }));
      if (t < 36.2) { const kk = E.inOutSine(seg(t, 34.5, 36.2)); const P = lerpArr([118, 72, -118], [100, 66, -96], kk), T = [-12, 52, 14]; c.shot = { pos: P, tgt: T, f: 32, focus: dist(P, [-12, 52, 14]), fstop: 5.6, dof: 0.22, roll: 1 - 2 * kk, mood: "class", vig: 0.34, exposure: 0.98 }; return; }
      const hp = c.headPos(); const k = E.inOutSine(seg(t, 34.5, 37)); const P = lerpArr([8, hp.y + 1, -26], [3, hp.y, -12], k); c.shot = { pos: P, tgt: [0, hp.y - 2, hp.z], f: 60, focus: dist(P, [hp.x, hp.y, hp.z]) - 2, fstop: 2.4, dof: 0.45, roll: 0, mood: "class", vig: 0.4, exposure: 0.94 };
    }
  };
  // ---------- ACTO G: RECOMPENSA (37–41 s) ----------
  A.G = function (c, t) {
    const { THREE, V3, Q, Wd, student, prof, sheet, seg, E } = c; Wd.setPlace("class"); c.hideAll(); prof.root.visible = true; c.stack.visible = false; c.dClock.visible = false;
    const lowered = E.inOutCubic(seg(t, 38.7, 39.3)), sy = 36 - 17 * lowered, sz = 28 + 6 * lowered; c.setSheetHeld(new V3(0, sy, sz), new Q().setFromAxisAngle(new V3(0, 1, 0), Math.PI)); c.drawSheet({ work: 1, mark: seg(t, 37.0, 37.9), grade: seg(t, 37.5, 38.2), exc: seg(t, 38.1, 38.5) });
    const joy = E.outCubic(seg(t, 38.2, 38.9)), laugh = Math.max(0, Math.sin(t * 12)) * 0.25 * seg(t, 38.9, 41);
    student.setPose(c.seated({ t, lean: -0.05 - 0.05 * joy, lookAt: lowered > 0.5 ? [-28, 54, 8] : [0, sy + 4, sz], headTilt: 0.08 * joy + Math.sin(t * 7) * 0.02 * joy, expr: FR({ smile: 0.2 + 0.8 * joy, open: 0.6 * joy + laugh, browLift: 0.9 * joy, eyeOpen: 1 - 0.15 * joy }), blink: 0,
      wristR: Object.assign(c.wristForSheet("R"), { pose: { f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb.hold }, hint: [-0.5, -1, 0.3] }), wristL: Object.assign(c.wristForSheet("L"), { pose: { f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb.hold }, hint: [0.5, -1, 0.3] }) }));
    const nod = Math.sin(t * 3.2) * 0.1 * seg(t, 39.3, 41);
    prof.setPose({ pos: [-36, 16, 12], yaw: Math.atan2(36, 50), sit: false, t, lookAt: [0, 74, 50], headPitch: nod, expr: FR({ smile: 0.3 + 0.7 * seg(t, 38.8, 39.8), open: 0.15 * seg(t, 39.4, 40), browLift: 0.4 * seg(t, 38.8, 40) }), wristR: { pos: lerpArr([-44, 20, 6], [-26, 44, -2], E.inOutCubic(seg(t, 40.1, 40.6))), fingers: [0, 1, 0], palm: [0.3, 0, -1], pose: seg(t, 40.1, 40.6) > 0.5 ? C.HAND_POSES.thumbsUp : C.HAND_POSES.relaxed, hint: [-0.6, -0.4, 0.4] }, wristL: null });
    if (t < 38.8) { const k = seg(t, 37, 38.8); const P = [-10 + 6 * k, 42 - 2 * k, -34 + 10 * k], T = [0, 33, 36]; c.shot = { pos: P, tgt: T, f: 60, focus: dist(P, T), fstop: 2.4, dof: 0.5, roll: 2 - 3 * k, mood: "warm", vig: 0.4, exposure: 0.92 }; }
    else if (t < 40.2) { const k = E.inOutSine(seg(t, 38.8, 40.2)), hp = c.headPos(); const P = lerpArr([-16, hp.y + 5, -26], [-6, hp.y + 3, -4], k); c.shot = { pos: P, tgt: [0, hp.y - 3, hp.z], f: 58, focus: dist(P, [hp.x, hp.y, hp.z]) - 2, fstop: 2.4, dof: 0.42, roll: -2 + 3 * k, mood: "warm", vig: 0.34 }; }
    else { const k = E.inOutSine(seg(t, 40.2, 41)); const hx = prof.head; const hp = new V3(); prof.head.getWorldPosition(hp); const P = lerpArr([hp.x + 74, hp.y + 2, hp.z + 40], [hp.x + 62, hp.y + 1, hp.z + 33], k); c.shot = { pos: P, tgt: [hp.x, hp.y - 3, hp.z], f: 50, focus: dist(P, [hp.x, hp.y, hp.z]) - 2, fstop: 2.4, dof: 0.42, roll: 1, mood: "warm", vig: 0.34 }; }
  };
  // ---------- ACTO H: CIERRE (41–45 s) ----------
  A.H = function (c, t) {
    const { THREE, V3, Wd, phone, logo, seg, E } = c; Wd.setPlace("studio"); c.hideAll(); c.stack.visible = false; c.dClock.visible = false;
    c.student.root.visible = false; phone.group.visible = true; phone.group.position.set(0, 7.15 + 0.12 * Math.sin(t * 1.4), 0); phone.group.quaternion.setFromEuler(new THREE.Euler(-0.28, -0.24 + 0.06 * Math.sin(t * 0.9), 0, "XYZ")); C.phoneScreenAt(c, { screen: "home" });
    const lk = E.outCubic(seg(t, 41.2, 42.4)); logo.visible = lk > 0.01; logo.position.set(0, 23 + 1 * Math.sin(t * 1.6) + 3 * (1 - lk), -2); logo.scale.setScalar(0.17 + 0.05 * lk); logo.material.opacity = lk; c.logoFace = true;
    const k = E.inOutSine(seg(t, 41, 45)); const cn = [0, 20, 0]; const P = orbit(cn, 40 - 6 * k, 10 - 20 * k, 8 + 3 * k); c.shot = { pos: P, tgt: [0, 13 + 2 * k, 0], f: 50, focus: dist(P, [0, 14, 0]), fstop: 3.5, dof: 0.35, roll: 1 - 2 * k, mood: "studio", vig: 0.2, exposure: 1.05, contrast: 1.04 };
  };
})(typeof window !== "undefined" ? window : globalThis);
