/* Anuncio studia+ sobre el motor 3D. Todo es función pura del tiempo t (determinista). */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  const seg = (t, a, b) => C.clamp((t - a) / (b - a), 0, 1);
  C.AD = {
    scenes: [
      { id: "S1", t0: 0, t1: 4.4 }, { id: "S1b", t0: 4.4, t1: 8.9 }, { id: "S2", t0: 8.9, t1: 11.6 }, { id: "LOGO", t0: 11.6, t1: 16.5 },
      { id: "S3", t0: 16.5, t1: 21.7 }, { id: "S4", t0: 21.7, t1: 26.7 }, { id: "S5", t0: 26.7, t1: 31.7 }, { id: "S6", t0: 31.7, t1: 35.9 },
      { id: "S7", t0: 35.9, t1: 40.4 }, { id: "END", t0: 40.4, t1: 43 }],
    total: 43,
    TAP_HOY: 20.35, TAP_TUTOR: 27.95, POP: 11.0
  };
  const sceneAt = (t) => { for (const s of C.AD.scenes) if (t >= s.t0 && t < s.t1) return s; return C.AD.scenes[C.AD.scenes.length - 1]; };
  C.adScene = sceneAt;
  // ---- pulgar: claves por escena [t, pose] ----
  C.AD.THUMB = [
    [0, "hover"], [0.3, "hover"], [0.55, "touchA"], [0.85, "touchB"], [1.05, "hover"], [1.6, "hover"], [1.85, "touchA"], [2.15, "touchB"], [2.35, "hover"], [2.9, "hover"], [3.15, "touchA"], [3.45, "touchB"], [3.65, "hover"],
    [8.9, "hover"], [16.5, "hover"], [19.3, "hoverBtn"], [20.2, "hoverBtn"], [20.35, "tapBtn"], [20.6, "tapBtn"], [20.95, "hoverBtn"], [21.7, "hover"],
    [26.7, "hover"], [27.5, "hoverBtn"], [27.9, "tapBtn"], [28.15, "tapBtn"], [28.5, "hoverBtn"], [29.5, "hover"], [31.7, "hover"]
  ];
  C.adThumbPose = function (t) {
    const K = C.AD.THUMB; let i = 0; while (i < K.length - 2 && t >= K[i + 1][0]) i++;
    const [ta, na] = K[i], [tb, nb] = K[i + 1], u = C.ease.inOutSine(C.clamp((t - ta) / Math.max(tb - ta, 1e-6), 0, 1)), A = C.GRIP.thumb[na], B = C.GRIP.thumb[nb], L = C.lerp;
    return { cmc: A.cmc.map((x, k) => L(x, B.cmc[k], u)), mcp: L(A.mcp, B.mcp, u), ip: L(A.ip, B.ip, u) };
  };
  // ---- teléfono ----
  C.adPhoneXform = function (THREE, t) {
    const s = sceneAt(t).id, E = (x, y, z) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, "XYZ"));
    if (s === "S4" || s === "S6") return { vis: true, held: false, pos: [0, 7.15, 0.5], quat: E(-0.3, 0, 0) };
    if (s === "S7" || s === "LOGO" || s === "END") return { vis: false, held: false, pos: [0, 15, 4], quat: E(0, 0, 0) };
    const sh = s === "S2" ? 0.28 * seg(t, 9.6, 11.0) : 0, b = Math.sin(t * 1.6) * 0.1;
    return { vis: true, held: true, pos: [1.2 + Math.sin(t * 71) * sh, 15 + b + Math.sin(t * 83 + 1) * sh, 4 + Math.sin(t * 1.1) * 0.08], quat: E(-0.32 + Math.sin(t * 1.3) * 0.006, -0.1, Math.sin(t * 61) * sh * 0.03) };
  };
  // ---- cámara por escena ----
  C.adCamera = function (t) {
    const sc = sceneAt(t), u = (t - sc.t0) / (sc.t1 - sc.t0); let cp;
    const P = (keys, ease) => C.camPath(keys, u, ease);
    switch (sc.id) {
      case "S1": cp = P([{ pos: [10, 23, 37], tgt: [1.2, 14.6, 4], f: 50 }, { pos: [7, 21, 33], tgt: [1.2, 14.6, 4], f: 50 }, { pos: [4.5, 19.5, 30], tgt: [1.2, 14.8, 4], f: 50, roll: 1 }], "inOutSine"); break;
      case "S1b": cp = P([{ pos: [4.5, 19.5, 30], tgt: [1.2, 14.8, 4.2], f: 50, roll: 1 }, { pos: [2.5, 18.2, 25], tgt: [1.1, 15.4, 4.3], f: 55 }, { pos: [0.5, 17.6, 21.5], tgt: [1.0, 16.0, 4.4], f: 62, roll: -2 }], "inOutCubic"); break;
      case "S2": cp = P([{ pos: [-20, 11, -28], tgt: [1, 19, 14], f: 35 }, { pos: [-14, 15, -33], tgt: [1, 19.5, 14], f: 35 }, { pos: [-8, 19, -44], tgt: [1, 20, 14], f: 35, roll: 2 }], "outQuint"); break;
      case "S3": cp = P([{ pos: [-15, 21, 22], tgt: [1.4, 12.4, 5.6], f: 55 }, { pos: [-10, 18.6, 19], tgt: [1.4, 12.1, 5.7], f: 62 }, { pos: [-7, 17.2, 17.5], tgt: [1.4, 11.9, 5.9], f: 66 }], "inOutSine"); break;
      case "S4": { const o = C.orbit([0, 9.5, 0.5], 40, 33, -46, -16, 6, 16, 50, 55, u, "inOutSine", 0); cp = o; break; }
      case "S5": cp = C.orbit([1.2, 14.5, 4], 36, 29, 38, -8, 22, 12, 50, 52, u, "inOutSine", 0); break;
      case "S6": cp = P([{ pos: [-22, 6, 26], tgt: [0, 9, 0.5], f: 35 }, { pos: [-6, 9, 31], tgt: [0.5, 10, -2], f: 40 }, { pos: [12, 14, 27], tgt: [1, 11.5, -5], f: 45, roll: 1.5 }], "inOutCubic"); break;
      case "S7": cp = P([{ pos: [0, 31, 72], tgt: [0, 38, -10], f: 50 }, { pos: [0, 31, 66], tgt: [0, 38, -10], f: 50 }, { pos: [0, 31.5, 57], tgt: [0, 37, -10], f: 50, roll: 0 }], "inOutSine"); break;
      default: cp = { pos: [0, 31, 72], tgt: [0, 38, -10], f: 50, roll: 0 };
    }
    const d = C.drift(t, sc.id === "S3" ? 0.05 : 0.02); cp.pos = [cp.pos[0] + d[0], cp.pos[1] + d[1], cp.pos[2] + d[2]]; return cp;
  };
  // ---- hoja del examen (pose del conjunto hoja+manos) ----
  C.adSheetPose = function (t) {
    const hold = 37.5, lower = 39.0, give = C.ease.inOutSine(seg(t, 35.95, hold)), low = C.ease.inOutSine(seg(t, lower, lower + 0.6));
    const tr = t > 38.4 && t < lower ? Math.sin(t * 22) * 0.012 : 0;
    return { y: 32 + (1 - give) * 16 - low * 17, z: -42 * (1 - give), rotZ: tr + (1 - give) * 0.12, handsY: -26 * (1 - C.ease.outCubic(seg(t, 36.6, hold))), holding: t >= hold - 0.1 };
  };
  // ---- estado de la pantalla ----
  C.adPage = function (t) {
    const sc = sceneAt(t).id; const TAPS = C.AD.TAP_HOY;
    if (sc === "S1" || sc === "S1b" || sc === "S2") {
      const sw = (a, b, d) => d * C.ease.outCubic(seg(t, a, b));
      const scroll = sw(0.55, 1.15, 560) + sw(1.85, 2.45, 560) + sw(3.15, 3.75, 700);
      const n = [0, 1, 2, 3, 4].map((i) => seg(t, 4.6 + i * 0.55, 5.1 + i * 0.55)); const cnt = [0, 1, 2, 3, 4].filter((i) => t >= 4.6 + i * 0.55).length;
      const gone = seg(t, 9.0, 9.4);
      return { page: "feed", scroll, dim: seg(t, 4.2, 4.7), notif: n.map((x) => x * (1 - gone)), badge: gone > 0.5 ? 0 : cnt, badgePop: seg(t, 4.6 + (Math.max(cnt, 1) - 1) * 0.55, 4.6 + (Math.max(cnt, 1) - 1) * 0.55 + 0.3) };
    }
    if (sc === "S3") { const press = t < TAPS - 0.06 ? 0 : t < TAPS + 0.08 ? (t - (TAPS - 0.06)) / 0.14 : t < TAPS + 0.3 ? 1 : C.clamp(1 - (t - TAPS - 0.3) / 0.2, 0, 1); const px = C.screenCmToPx(C.GRIP.contact.tapBtn[0], C.GRIP.contact.tapBtn[1]);
      return { page: "hoy", intro: (t - 16.7) / 1.3, fill: (t - 18.2) / 1.6, press, ripple: t >= TAPS ? (t - TAPS) / 0.7 : -1, rx: px[0], ry: px[1] }; }
    if (sc === "S4") return { page: "sesion", arc: seg(t, 22.4, 26.4), t2: t > 24.6, card: seg(t, 22.6, 23.2), pill: t > 25.2 ? 1 : 0 };
    if (sc === "S5") { const T = C.AD.TAP_TUTOR; return { page: "tutor", bu: seg(t, T, T + 0.4), typing: seg(t, 28.8, 29.1) * (t < 30.1 ? 1 : 0), dots: t - 29, bm: seg(t, 30.1, 30.7), send: t > T - 0.05 && t < T + 0.25 ? 1 : 0, chip: seg(t, 27.1, 27.5) * (1 - seg(t, T, T + 0.15)) }; }
    return { page: "racha", pop: t < 33.8 ? 1 : seg(t, 33.8, 34.25), seven: t >= 33.8, as: seg(t, 34.3, 34.8) };
  };
})(typeof window !== "undefined" ? window : globalThis);
