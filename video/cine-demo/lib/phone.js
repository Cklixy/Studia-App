/* Celular genérico con geometría explícita, materiales distintos y pantalla con UV 0..1 */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  function rrShape(THREE, w, h, r) {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return s;
  }
  function planeUV(THREE, shape, w, h, curveSegs) {
    const geo = new THREE.ShapeGeometry(shape, curveSegs || 10);
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
    uv.needsUpdate = true; return geo;
  }
  C.buildPhone = function (THREE, opt) {
    const P = C.SPEC.phone, o = opt || {};
    const grp = new THREE.Group(), body = new THREE.Group(); grp.add(body);
    // marco metálico (extrusión con bisel => espesor real D)
    const bev = P.edge * 0.45;
    const eg = new THREE.ExtrudeGeometry(rrShape(THREE, P.W - 2 * bev, P.H - 2 * bev, P.R - bev), {
      depth: P.D - 2 * bev, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 5, curveSegments: 14 });
    eg.translate(0, 0, -(P.D - 2 * bev) / 2);
    const metal = new THREE.MeshPhysicalMaterial({ color: 0x5b6378, metalness: 0.9, roughness: 0.32, clearcoat: 0.2 });
    const frame = new THREE.Mesh(eg, metal); frame.castShadow = true; frame.receiveShadow = true; body.add(frame);
    // cristal trasero (mate) y cara frontal negra
    const backMat = new THREE.MeshPhysicalMaterial({ color: 0x2b3250, metalness: 0.1, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.35 });
    const back = new THREE.Mesh(planeUV(THREE, rrShape(THREE, P.W - 0.1, P.H - 0.1, P.R - 0.05), P.W - 0.1, P.H - 0.1), backMat);
    back.rotation.y = Math.PI; back.position.z = -P.D / 2 - 0.002; body.add(back);
    const sw = P.W - 2 * P.bezel, sh = P.H - 2 * P.bezel, sr = P.R - P.bezel;
    const glassBlack = new THREE.Mesh(planeUV(THREE, rrShape(THREE, P.W - 0.1, P.H - 0.1, P.R - 0.05), P.W - 0.1, P.H - 0.1),
      new THREE.MeshStandardMaterial({ color: 0x07080d, roughness: 0.25, metalness: 0.2 }));
    glassBlack.position.z = P.D / 2 + 0.002; body.add(glassBlack);
    // pantalla: superficie con UV 0..1 de la relación de aspecto real
    const scr = new THREE.Mesh(planeUV(THREE, rrShape(THREE, sw, sh, sr), sw, sh),
      new THREE.MeshBasicMaterial({ map: o.texture || null, color: o.texture ? 0xffffff : 0x20263b, toneMapped: false }));
    scr.position.z = P.D / 2 + 0.004; scr.name = "screen"; body.add(scr);
    // reflejo controlado del vidrio (no tapa el contenido)
    const gl = new THREE.Mesh(planeUV(THREE, rrShape(THREE, sw, sh, sr), sw, sh),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, roughness: 0.04, metalness: 0, clearcoat: 1, envMapIntensity: 0.9, depthWrite: false }));
    gl.position.z = P.D / 2 + 0.006; body.add(gl);
    // módulo de cámaras (placa elevada + 3 lentes + flash)
    const cm = P.cam, cx = cm.x, cy = P.H / 2 - cm.yFromTop;
    const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(THREE, cm.size, cm.size, 0.7), { depth: cm.bump, bevelEnabled: false, curveSegments: 10 }),
      new THREE.MeshPhysicalMaterial({ color: 0x3a4262, metalness: 0.5, roughness: 0.25, clearcoat: 0.6 }));
    plate.rotation.y = Math.PI; plate.position.set(cx, cy, -P.D / 2 - 0.004); plate.castShadow = true; body.add(plate);
    const lensPos = [[0.8, 0.8], [-0.8, 0.8], [0, -0.85]];
    lensPos.forEach(([lx, ly]) => {
      const zb = -P.D / 2 - cm.bump - 0.006;
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(cm.lens / 2 + 0.12, cm.lens / 2 + 0.12, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0x8d96b0, metalness: 1, roughness: 0.22 }));
      ring.rotation.x = Math.PI / 2; ring.position.set(cx + lx * 0.95, cy + ly * 0.95, zb + 0.05); body.add(ring);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(cm.lens / 2, cm.lens / 2, 0.14, 32), new THREE.MeshPhysicalMaterial({ color: 0x0b0e1a, metalness: 0.2, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.5 }));
      lens.rotation.x = Math.PI / 2; lens.position.set(cx + lx * 0.95, cy + ly * 0.95, zb - 0.01); body.add(lens);
    });
    const flash = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 20), new THREE.MeshStandardMaterial({ color: 0xf2e9c8, roughness: 0.4 }));
    flash.rotation.x = Math.PI / 2; flash.position.set(cx - 1.0, cy - 0.95, -P.D / 2 - cm.bump - 0.01); body.add(flash);
    // botones laterales, puerto y altavoces
    const btn = (x, y, len) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.1, len, 0.34), metal); b.position.set(x, y, 0.05); body.add(b); };
    btn(P.W / 2 + 0.02, 1.6, 2.2);            // encendido (lado derecho)
    btn(-P.W / 2 - 0.02, 3.4, 1.2);           // acción
    btn(-P.W / 2 - 0.02, 1.5, 1.7); btn(-P.W / 2 - 0.02, -0.7, 1.7); // volumen
    const port = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.26), new THREE.MeshStandardMaterial({ color: 0x050608 }));
    port.position.set(0, -P.H / 2 - 0.01, 0); body.add(port);
    [-2.2, -1.8, -1.4, 1.4, 1.8, 2.2].forEach((x) => { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 10), new THREE.MeshStandardMaterial({ color: 0x050608 })); h.position.set(x, -P.H / 2 - 0.01, 0); body.add(h); });
    return { group: grp, body, screenMesh: scr, screen: { w: sw, h: sh, r: sr } };
  };
  // igual, pero el teléfono se prolonga hacia delante (zona de pantalla): los dedos que rodean el borde no pueden quedar sobre la pantalla
  C.phoneSDFFwd = function (px, py, pz) { return C.phoneSDF(px, py, Math.min(pz, C.SPEC.phone.D / 2 - 0.0)); };
  // distancia con signo al volumen del teléfono (coords locales del teléfono)
  C.phoneSDF = function (px, py, pz) {
    const P = C.SPEC.phone, hx = P.W / 2 - P.R, hy = P.H / 2 - P.R;
    const qx = Math.abs(px) - hx, qy = Math.abs(py) - hy;
    const d2 = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - P.R;
    const dz = Math.abs(pz) - P.D / 2;
    return Math.hypot(Math.max(d2, 0), Math.max(dz, 0)) + Math.min(Math.max(d2, dz), 0);
  };
})(typeof window !== "undefined" ? window : globalThis);
