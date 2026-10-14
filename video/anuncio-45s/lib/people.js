/* Personas estilizadas (arcilla): cabeza, torso, cara con expresión controlable. Sin rasgos identificables. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  C.buildPerson = function (THREE, o) {
    const skin = new THREE.MeshStandardMaterial({ color: o.skin || 0xe9bc9d, roughness: 0.62 }), M = (c, r) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? 0.7 : r });
    const grp = new THREE.Group(), head = new THREE.Group(); grp.add(head); head.position.y = 29;
    const sph = (r, mat, sx, sy, sz) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), mat); m.scale.set(sx || 1, sy || 1, sz || 1); m.castShadow = true; return m; };
    const skull = sph(9.2, skin, 0.88, 1.0, 0.95); head.add(skull);
    [-1, 1].forEach((s) => { const ear = sph(1.7, skin, 0.6, 1, 0.9); ear.position.set(s * 8.1, 0, -0.5); head.add(ear); });
    const nose = sph(1.1, skin); nose.position.set(0, -1.0, 9.0); head.add(nose);
    // pelo (casquete)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(9.7, 32, 24, 0, Math.PI * 2, 0, o.bald ? 1.15 : 1.62), M(o.hair || 0x4a3a2e, 0.8)); hair.scale.set(0.9, 1.02, 0.99); hair.rotation.x = -0.5; hair.castShadow = true; head.add(hair);
    // cara
    const eyes = [], brows = [];
    [-1, 1].forEach((s) => { const w = sph(1.45, M(0xffffff, 0.3)); w.position.set(s * 3.3, 1.2, 8.0); head.add(w); const p = sph(0.75, M(0x1b1410, 0.2)); p.position.set(s * 3.3, 1.1, 9.3); head.add(p); eyes.push(p);
      const b = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 0.7), M(o.brow || 0x3a2a22)); b.position.set(s * 3.3, 3.9, 8.7); head.add(b); brows.push(b); });
    const mouthMat = M(0x8c3b45, 0.5); const mouth = new THREE.Mesh(new THREE.BufferGeometry(), mouthMat); head.add(mouth);
    if (o.glasses) [-1, 1].forEach((s) => { const r = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.28, 10, 28), M(0x2a3652, 0.4)); r.position.set(s * 3.3, 1.2, 9.0); head.add(r); }), (() => { const br = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.3), M(0x2a3652)); br.position.set(0, 1.3, 9.2); head.add(br); })();
    const sweat = []; [-1, 1].forEach((s) => { const d = sph(0.9, new THREE.MeshStandardMaterial({ color: 0x7fc8f0, roughness: 0.2, transparent: true, opacity: 0.9 }), 0.8, 1.3, 0.8); d.position.set(s * 8.5, 4, 5.5); d.visible = false; head.add(d); sweat.push(d); });
    // cuello y torso
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 9, 24), skin); neck.position.y = 19; neck.castShadow = true; grp.add(neck);
    const cloth = M(o.cloth || 0x8e9bb8, 0.9); const torso = sph(1, cloth, 12, 19, 8); torso.position.set(0, 4.5, 0); grp.add(torso);
    const shoulders = sph(1, cloth, 15, 5.5, 7.5); shoulders.position.set(0, 16.5, 0); grp.add(shoulders);
    if (o.longBody) { const lb = sph(1, cloth, 12, 46, 8); lb.position.set(0, -30, 0); grp.add(lb); }
    if (o.tie) { const t = new THREE.Mesh(new THREE.BoxGeometry(1.6, 9, 0.5), M(0xc10a2b, 0.5)); t.position.set(0, 12, 7.6); grp.add(t); const sh = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, 0.5), M(0xffffff, 0.6)); sh.position.set(0, 16.2, 7.0); sh.rotation.z = 0; grp.add(sh); }
    function setFace(f) {
      const mc = f.mouth || "calm"; let pts;
      if (mc === "wavy") pts = [-3.2, 0, 3.2].flatMap((x, i) => [new THREE.Vector3(x, -4.4 + (i % 2 ? 0.45 : -0.15), 9.0)]);
      if (mc === "wavy") pts = [-4, -2, 0, 2, 4].map((x, i) => new THREE.Vector3(x, -4.4 + (i % 2 ? 0.55 : -0.2), 8.9 - Math.abs(x) * 0.12));
      else if (mc === "smile") pts = [-3.6, -1.8, 0, 1.8, 3.6].map((x, i) => new THREE.Vector3(x, -4.2 - (2.2 - Math.abs(x) * 0.6) * 0.5 + 1.0, 8.9 - Math.abs(x) * 0.15));
      else pts = [-3, -1.5, 0, 1.5, 3].map((x) => new THREE.Vector3(x, -4.4 - 0.0 - (1 - Math.abs(x) / 3) * 0.5, 9.0 - Math.abs(x) * 0.15));
      mouth.geometry.dispose(); mouth.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, mc === "smile" ? 0.45 : 0.38, 8, false);
      brows.forEach((b, i) => { const s = i === 0 ? -1 : 1; b.rotation.z = (f.browAngle || 0) * s * -1; b.position.y = 3.9 + (f.browLift || 0); });
      eyes.forEach((e, i) => { e.position.x = (i === 0 ? -3.3 : 3.3) + (f.look || 0); });
    }
    setFace({ mouth: "calm" });
    return { group: grp, head, setFace, sweat, hair };
  };
})(typeof window !== "undefined" ? window : globalThis);
