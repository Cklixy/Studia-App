/* Mano articulada: palma + 4 dedos (MCP/PIP/DIP independientes) + pulgar (CMC 3 ejes, MCP, IP).
   Marco local de la mano: +y hacia los dedos, +x hacia el pulgar, +z hacia la cara interna de la palma. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  C.buildHand = function (THREE, opt) {
    const H = C.SPEC.hand, o = opt || {};
    const skin = new THREE.MeshStandardMaterial({ color: 0xe9bc9d, roughness: 0.62, metalness: 0 });
    const skinDark = new THREE.MeshStandardMaterial({ color: 0xdba886, roughness: 0.7 });
    const nailMat = new THREE.MeshPhysicalMaterial({ color: 0xf6ddd2, roughness: 0.25, clearcoat: 0.8 });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x8e9bb8, roughness: 0.9 });
    const root = new THREE.Group();
    const cap = (r, L, mat) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, L, 8, 20), mat || skin); m.castShadow = true; m.receiveShadow = true; return m; };
    const nail = (r, L) => { const n = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), nailMat); n.scale.set(r * 0.62, r * 0.5, r * 0.16); n.position.set(0, L + r * 0.18, -r * 0.55); n.rotation.x = 0.35; return n; };
    // palma
    const palmShape = new THREE.Shape(), w = H.palmW, l = H.palmL, rr = 1.7;
    palmShape.moveTo(-w / 2 + rr, 0); palmShape.lineTo(w / 2 - rr, 0); palmShape.absarc(w / 2 - rr, rr, rr, -Math.PI / 2, 0);
    palmShape.lineTo(w / 2, l - rr); palmShape.absarc(w / 2 - rr, l - rr, rr, 0, Math.PI / 2);
    palmShape.lineTo(-w / 2 + rr, l); palmShape.absarc(-w / 2 + rr, l - rr, rr, Math.PI / 2, Math.PI);
    palmShape.lineTo(-w / 2, rr); palmShape.absarc(-w / 2 + rr, rr, rr, Math.PI, Math.PI * 1.5);
    const bev = 0.55;
    const pg = new THREE.ExtrudeGeometry(palmShape, { depth: H.palmT - 2 * bev, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 6, curveSegments: 14 });
    pg.translate(0, 0, -(H.palmT - 2 * bev) / 2);
    const palm = new THREE.Mesh(pg, skin); palm.castShadow = true; palm.receiveShadow = true; root.add(palm);
    const thenar = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), skin); thenar.scale.set(1.9, 2.8, 1.9); thenar.position.set(2.7, 3.2, 1.3); thenar.castShadow = true; root.add(thenar);
    const hypo = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), skin); hypo.scale.set(1.5, 3.0, 1.1); hypo.position.set(-3.0, 3.8, 0); root.add(hypo);
    // muñeca, antebrazo y manga
    const fa = H.forearm, sl = H.sleeve;
    const arm = new THREE.Group(); root.add(arm);
    const fore = new THREE.Mesh(new THREE.CylinderGeometry(fa.rWrist, fa.rElbow, fa.len, 28, 1), skin); fore.position.set(0, -fa.len / 2 + 0.6, 0); fore.scale.set(1.18, 1, 0.8); fore.castShadow = true; arm.add(fore);
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(sl.r0, sl.r1, sl.len, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x8e9bb8, roughness: 0.92, side: THREE.DoubleSide }));
    sleeve.position.set(0, -sl.from - sl.len / 2, 0); sleeve.scale.set(1.0, 1, 0.9); sleeve.castShadow = true; arm.add(sleeve);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(sl.r0, 0.45, 12, 40), cloth); cuff.rotation.x = Math.PI / 2; cuff.position.set(0, -sl.from, 0); cuff.scale.set(1.0, 0.9, 1); arm.add(cuff);
    // dedos
    const fingers = [];
    H.fingers.forEach((f) => {
      const p0 = new THREE.Group(); p0.position.set(f.x, H.palmL - 0.2, 0); root.add(p0);
      const m1 = cap(f.r, f.L[0], skin); m1.position.y = f.L[0] / 2; p0.add(m1);
      const p1 = new THREE.Group(); p1.position.y = f.L[0]; p0.add(p1);
      const r2 = f.r * 0.93, m2 = cap(r2, f.L[1], skin); m2.position.y = f.L[1] / 2; p1.add(m2);
      const p2 = new THREE.Group(); p2.position.y = f.L[1]; p1.add(p2);
      const r3 = f.r * 0.86, m3 = cap(r3, f.L[2], skin); m3.position.y = f.L[2] / 2; p2.add(m3); p2.add(nail(r3, f.L[2]));
      fingers.push({ def: f, p0, p1, p2, r: [f.r, r2, r3] });
    });
    // pulgar
    const T = H.thumb, tb = new THREE.Group(); tb.position.set(T.base[0], T.base[1], T.base[2]); tb.rotation.order = "ZYX"; root.add(tb);
    const tm0 = cap(T.r[0], T.L[0], skin); tm0.position.y = T.L[0] / 2; tb.add(tm0);
    const t1 = new THREE.Group(); t1.position.y = T.L[0]; tb.add(t1);
    const tm1 = cap(T.r[1], T.L[1], skin); tm1.position.y = T.L[1] / 2; t1.add(tm1);
    const t2 = new THREE.Group(); t2.position.y = T.L[1]; t1.add(t2);
    const tm2 = cap(T.r[2], T.L[2], skin); tm2.position.y = T.L[2] / 2; t2.add(tm2); t2.add(nail(T.r[2], T.L[2]));
    const thumb = { tb, t1, t2, r: T.r, L: T.L };
    const deg = C.deg;
    function setPose(pose) {
      pose.f.forEach((a, i) => { const f = fingers[i]; f.p0.rotation.set(deg(a[0]), 0, deg(a[3] || 0)); f.p1.rotation.set(deg(a[1]), 0, 0); f.p2.rotation.set(deg(a[2]), 0, 0); });
      const t = pose.t; thumb.tb.rotation.set(deg(t.cmc[0]), deg(t.cmc[1]), deg(t.cmc[2])); thumb.t1.rotation.set(deg(t.mcp), 0, 0); thumb.t2.rotation.set(deg(t.ip), 0, 0);
    }
    // puntos de muestreo (posición mundial + radio) para comprobar contacto/penetración
    const tmp = new THREE.Vector3();
    function samples(target) {
      root.updateMatrixWorld(true); const out = [];
      const seg = (grp, L, r, tag) => { for (let k = 0; k <= 4; k++) { tmp.set(0, (L * k) / 4, 0); grp.localToWorld(tmp); out.push({ p: tmp.clone(), r, tag }); } };
      fingers.forEach((f, i) => { seg(f.p0, f.def.L[0], f.r[0], "f" + i + "a"); seg(f.p1, f.def.L[1], f.r[1], "f" + i + "b"); seg(f.p2, f.def.L[2], f.r[2], "f" + i + "c"); });
      seg(thumb.tb, T.L[0], T.r[0], "t0"); seg(thumb.t1, T.L[1], T.r[1], "t1"); seg(thumb.t2, T.L[2], T.r[2], "t2");
      return out;
    }
    // punto de la yema (superficie, lado de flexión +z del último segmento)
    function pad(grp, L, r) { tmp.set(0, L * 0.78, r * 0.95); grp.localToWorld(tmp); return tmp.clone(); }
    const pads = () => { root.updateMatrixWorld(true); return { fingers: fingers.map((f) => pad(f.p2, f.def.L[2], f.r[2])), thumb: pad(thumb.t2, T.L[2], T.r[2]) }; };
    function length() { const f = H.fingers[1]; return H.palmL + f.L[0] + f.L[1] + f.L[2] + f.r * 0.86; }
    return { root, arm, fingers, thumb, setPose, samples, pads, length };
  };
})(typeof window !== "undefined" ? window : globalThis);
