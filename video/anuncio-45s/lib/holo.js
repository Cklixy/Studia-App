/* Visualización 3D de la derivada: y = x², recta secante entre x0=1 y x0+h que converge a la tangente (m = 2 + h → 2). */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  C.buildHolo = function (THREE) {
    const V3 = THREE.Vector3, S = 6.0, grp = new THREE.Group(), mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
    const B = (c, o) => new THREE.MeshBasicMaterial(Object.assign({ color: c, transparent: true, depthWrite: false }, o || {}));
    const bar = (a, b, r, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), mat); const d = new V3().subVectors(b, a), L = d.length(); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); m.scale.set(1, L, 1); return m; };
    const grid = new THREE.Group(); grp.add(grid); const gm = B(0x6fa8ff, { opacity: 0.28 });
    for (let x = -1; x <= 3; x++) grid.add(bar(new V3(x * S, 0, 0), new V3(x * S, 7 * S, 0), 0.07, gm)); for (let y = 0; y <= 7; y++) grid.add(bar(new V3(-1.8 * S, y * S, 0), new V3(3.2 * S, y * S, 0), 0.07, gm));
    const axM = B(0xcfe0ff, { opacity: 0.9 }); grid.add(bar(new V3(-1.8 * S, 0, 0), new V3(3.4 * S, 0, 0), 0.22, axM)); grid.add(bar(new V3(0, -0.2 * S, 0), new V3(0, 7.2 * S, 0), 0.22, axM));
    const base = new THREE.Mesh(new THREE.CircleGeometry(20, 64), B(0x3a7bff, { opacity: 0.16 })); base.rotation.x = -Math.PI / 2; base.position.set(0.7 * S, -0.1, 0); grp.add(base); const ring = new THREE.Mesh(new THREE.RingGeometry(19.2, 20, 64), B(0x9ec3ff, { opacity: 0.6 })); ring.rotation.x = -Math.PI / 2; ring.position.copy(base.position); ring.position.y = 0; grp.add(ring);
    const pts = []; for (let i = 0; i <= 80; i++) { const x = -1.6 + (i / 80) * 4.2; pts.push(new V3(x * S, x * x * S, 0)); }
    const curve = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.5, 12), new THREE.MeshBasicMaterial({ color: 0x00e5ff })); grp.add(curve);
    const P = new THREE.Mesh(new THREE.SphereGeometry(1.05, 20, 14), new THREE.MeshBasicMaterial({ color: 0x0071e3 })), Q = new THREE.Mesh(new THREE.SphereGeometry(0.95, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffb020 })); grp.add(P, Q);
    const secM = new THREE.MeshBasicMaterial({ color: 0xffb020 }), sec = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1, 10), secM); grp.add(sec);
    const tanM = new THREE.MeshBasicMaterial({ color: 0x41e0a3 }), tan = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 1, 10), tanM); grp.add(tan);
    const legM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }), legH = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1, 8), legM), legV = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1, 8), legM); grp.add(legH, legV);
    const dPlot = bar(new V3(-1 * S, -2 * S, 0), new V3(3 * S, 6 * S, 0), 0.0, B(0x000000, { opacity: 0 })); // placeholder
    const df = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 1, 10), new THREE.MeshBasicMaterial({ color: 0xc8ff4a })); grp.add(df); const dpt = new THREE.Mesh(new THREE.SphereGeometry(0.95, 18, 12), new THREE.MeshBasicMaterial({ color: 0xc8ff4a })); grp.add(dpt); const link = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1, 8), new THREE.MeshBasicMaterial({ color: 0xc8ff4a, transparent: true, opacity: 0.55 })); grp.add(link);
    // etiquetas
    const lab = (w, h, sc) => { const cv = mk(w, h), tx = new THREE.CanvasTexture(cv); tx.encoding = THREE.sRGBEncoding; const m = new THREE.Mesh(new THREE.PlaneGeometry(sc, sc * h / w), new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false })); m.renderOrder = 10; grp.add(m); return { m, cv, tx }; };
    const L1 = lab(768, 220, 22), L2 = lab(768, 160, 20), L3 = lab(640, 150, 18);
    function drawLab(L, lines, col) { const c = L.cv.getContext("2d"); c.clearRect(0, 0, L.cv.width, L.cv.height); c.fillStyle = "rgba(14,20,38,0.82)"; const r = 38, w = L.cv.width, h = L.cv.height; c.beginPath(); c.moveTo(r, 0); c.arcTo(w, 0, w, h, r); c.arcTo(w, h, 0, h, r); c.arcTo(0, h, 0, 0, r); c.arcTo(0, 0, w, 0, r); c.fill(); c.strokeStyle = col; c.lineWidth = 6; c.stroke(); c.fillStyle = "#FFFFFF"; c.textAlign = "left"; lines.forEach((l, i) => { c.font = `${l.w || 600} ${l.s || 64}px Geist, sans-serif`; c.fillStyle = l.c || "#FFFFFF"; c.fillText(l.t, 40, (l.y || (84 + i * 80))); }); L.tx.needsUpdate = true; }
    function set(p, camPos) { // p: {show, h, tangent, deriv}
      const sh = C.clamp(p.show, 0, 1); grp.visible = sh > 0.001; grp.scale.set(1, 0.001 + sh, 1); const e = C.ease.outCubic(sh);
      const x0 = 1, y0 = 1, h = Math.max(p.h, 0.0005), x1 = x0 + h, y1 = x1 * x1, m = (y1 - y0) / h;
      const Pw = new V3(x0 * S, y0 * S, 0), Qw = new V3(x1 * S, y1 * S, 0); P.position.copy(Pw); Q.position.copy(Qw); Q.visible = p.tangent < 0.5;
      // secante extendida
      const dirS = new V3(1, m, 0).normalize(), a = Pw.clone().addScaledVector(dirS, -9), b = Pw.clone().addScaledVector(dirS, 22); const t0 = sec; { const d = b.clone().sub(a), L = d.length(); t0.position.copy(a).addScaledVector(d, 0.5); t0.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); t0.scale.set(1, L, 1); } sec.visible = p.tangent < 0.5;
      // tangente exacta m=2
      const dirT = new V3(1, 2, 0).normalize(), ta = Pw.clone().addScaledVector(dirT, -10), tb = Pw.clone().addScaledVector(dirT, 22); { const d = tb.clone().sub(ta), L = d.length(); tan.position.copy(ta).addScaledVector(d, 0.5); tan.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); tan.scale.set(1, L, 1); } tan.visible = p.tangent > 0.01; tan.material.opacity = 1;
      // catetos
      const corner = new V3(x1 * S, y0 * S, 0); [[legH, Pw, corner], [legV, corner, Qw]].forEach(([mm, u, v]) => { const d = v.clone().sub(u), L = Math.max(d.length(), 0.01); mm.position.copy(u).addScaledVector(d, 0.5); mm.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.clone().normalize()); mm.scale.set(1, L, 1); mm.visible = p.tangent < 0.5 && h > 0.04; });
      // derivada f'(x)=2x como altura de pendiente
      const dv = C.clamp(p.deriv, 0, 1); df.visible = dpt.visible = link.visible = dv > 0.01; { const a2 = new V3(-1.2 * S, -2.4 * S - 6, 0), b2 = new V3(3 * S, 6 * S - 6, 0); /* y=2x desplazada por debajo de la curva */ const aa = new V3(-1.2 * S, 2 * -1.2 * S * 0.5 + 0.2, 0); }
      const dA = new V3(-1.2 * S, (2 * -1.2) * S * 0.5 - 1.0, 0), dB = new V3(3.0 * S, (2 * 3.0) * S * 0.5 - 1.0, 0); { const vv = dB.clone().sub(dA), L = vv.length(); df.position.copy(dA).addScaledVector(vv, 0.5); df.quaternion.setFromUnitVectors(new V3(0, 1, 0), vv.normalize()); df.scale.set(1, L * dv, 1); df.position.copy(dA).addScaledVector(new V3(dB.x - dA.x, dB.y - dA.y, 0).normalize(), L * dv * 0.5); }
      const dp = new V3(x0 * S, (2 * x0) * S * 0.5 - 1.0, 0); dpt.position.copy(dp); { const d = Pw.clone().sub(dp), L = d.length(); link.position.copy(dp).addScaledVector(d, 0.5); link.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); link.scale.set(1, L, 1); }
      // etiquetas (miran a la cámara)
      const face = (m, pos) => { m.position.copy(pos); if (camPos) m.lookAt(camPos); };
      if (p.tangent < 0.5) { drawLab(L1, [{ t: "h = " + h.toFixed(2), s: 66, w: 700, c: "#ffd27a", y: 90 }, { t: "m = " + m.toFixed(3), s: 66, w: 700, c: "#ffffff", y: 170 }], "#ffb020"); L1.m.visible = true; face(L1.m, new V3(1.9 * S, 4.6 * S, 4)); } else { drawLab(L1, [{ t: "m = 2", s: 72, w: 700, c: "#41e0a3", y: 96 }, { t: "f′(1) = 2", s: 58, w: 600, c: "#ffffff", y: 172 }], "#41e0a3"); L1.m.visible = true; face(L1.m, new V3(1.9 * S, 4.6 * S, 4)); }
      drawLab(L2, [{ t: "f(x) = x²", s: 64, w: 700, c: "#7fe9ff", y: 100 }], "#00e5ff"); face(L2.m, new V3(1.5 * S, 6.3 * S, 4));
      L3.m.visible = dv > 0.05; if (dv > 0.05) { drawLab(L3, [{ t: "f′(x) = 2x", s: 60, w: 700, c: "#c8ff4a", y: 96 }], "#c8ff4a"); face(L3.m, new V3(3.1 * S, 2.4 * S, 4)); }
      return { h, m };
    }
    return { group: grp, set };
  };
})(typeof window !== "undefined" ? window : globalThis);
