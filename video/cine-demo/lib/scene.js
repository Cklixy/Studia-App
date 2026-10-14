(function (g) {
  const C = (g.Cine = g.Cine || {});
  // ---- plan de tomas (registro de decisiones: ver CINE.md) ----
  C.SHOTS = [
    { id: "A", name: "Rasante con elemento de primer plano", t0: 0, t1: 3.8, why: "Revelar el espesor, el metal y los botones antes que la pantalla; el lápiz de primer plano cruza el encuadre y descubre el celular.", ease: "inOutCubic",
      keys: [ { pos: [-27, 1.0, 11.5], tgt: [-6, 0.7, 1], f: 50 }, { pos: [-14, 1.3, 10], tgt: [-2, 0.6, 0.5], f: 50 }, { pos: [-1, 2.3, 9.5], tgt: [0, 0.5, 0], f: 50 }, { pos: [11, 7.5, 11.5], tgt: [0, 0.4, 0], f: 50, roll: 3 } ] },
    { id: "B", name: "Contrapicado en arco hacia la acción", t0: 3.8, t1: 7.4, why: "Corte en la acción de agarrar: la cámara baja y sube en arco para que la mano entre en escala con el teléfono.", ease: "outQuint",
      orbit: { c: [1.2, 14.2, 3.5], r: [36, 32], az: [-46, -14], el: [-12, 3], f: [35, 42], roll: -2 } },
    { id: "C", name: "Órbita parcial con descenso de altura", t0: 7.4, t1: 11.2, why: "Mostrar el agarre desde varios ángulos: delante (pulgar) hasta detrás (palma y dedos); comprueba el contacto.", ease: "inOutSine",
      orbit: { c: [1.5, 13.6, 2.5], r: [36, 34], az: [16, 150], el: [18, -4], f: [42, 50], roll: 0 } },
    { id: "D", name: "Macro sobre el hombro izquierdo: el pulgar toca", t0: 11.2, t1: 14.4, why: "El instante clave: contacto pulgar-pantalla sincronizado con la respuesta de la interfaz. La cámara entra por el lado contrario al pulgar para no atravesarlo.", ease: "inOutSine",
      keys: [ { pos: [-9, 21.5, 21], tgt: [1.2, 12.4, 5.2], f: 60 }, { pos: [-6.5, 18.6, 16.5], tgt: [1.3, 11.9, 5.8], f: 70 }, { pos: [-4.5, 16.8, 14], tgt: [1.4, 11.7, 6.0], f: 75 } ] },
    { id: "E", name: "Retirada a través del primer plano", t0: 14.4, t1: 18.0, why: "Cerrar con escala: de un detalle sobre el cristal a un gran angular asimétrico con espacio negativo, atravesando el primer plano vegetal.", ease: "inOutCubic",
      keys: [ { pos: [-4.5, 16.8, 14], tgt: [1.4, 11.7, 6.0], f: 75 }, { pos: [8, 19, 26], tgt: [1, 13.5, 3], f: 50 }, { pos: [21, 17, 24], tgt: [-1, 14, 2], f: 36 }, { pos: [32, 26, 50], tgt: [-9, 13, 0], f: 26, roll: 2 } ] }
  ];
  C.THUMB_KEYS = [
    [0, "hover"], [3.8, "hover"], [5.5, "hoverB"], [7.3, "hover"], [9.3, "hoverB"], [11.1, "hover"],
    [11.2, "hover"], [11.9, "hoverBtn"], [12.35, "tapBtn"], [12.6, "tapBtn"], [12.95, "hoverBtn"], [14.3, "hover"], [18, "hover"]
  ];
  C.TAP = { t: 12.4, release: 12.62 };

  C.shotAt = (t) => { for (const s of C.SHOTS) if (t >= s.t0 && t < s.t1) return s; return C.SHOTS[C.SHOTS.length - 1]; };
  C.thumbPose = function (t) {
    const K = C.THUMB_KEYS; let i = 0; while (i < K.length - 2 && t >= K[i + 1][0]) i++;
    const [ta, na] = K[i], [tb, nb] = K[i + 1], u = C.ease.inOutSine(C.clamp((t - ta) / Math.max(tb - ta, 1e-6), 0, 1)), A = C.GRIP.thumb[na], B = C.GRIP.thumb[nb], L = C.lerp;
    return { cmc: A.cmc.map((x, k) => L(x, B.cmc[k], u)), mcp: L(A.mcp, B.mcp, u), ip: L(A.ip, B.ip, u) };
  };
  C.uiState = function (t) {
    const tap = C.TAP, press = t < tap.t - 0.06 ? 0 : t < tap.t + 0.08 ? (t - (tap.t - 0.06)) / 0.14 : t < tap.release ? 1 : C.clamp(1 - (t - tap.release) / 0.2, 0, 1);
    const c = C.GRIP.contact.tapBtn, px = C.screenCmToPx(c[0], c[1]);
    return { intro: (t - 0.2) / 1.3, fill: (t - 1.0) / 2.2, press, ripple: t >= tap.t ? (t - tap.t) / 0.7 : -1, rx: px[0], ry: px[1] };
  };
  // transformación del teléfono (reposo sobre la mesa en A; en la mano en B–E). Escala SIEMPRE 1.
  C.phoneXform = function (THREE, t) {
    const sh = C.shotAt(t);
    if (sh.id === "A") { const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)); return { held: false, pos: [0, C.SPEC.phone.D / 2 + 0.02, 0], quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.24).multiply(q0) }; }
    const b = Math.sin(t * 1.6) * 0.1;
    return { held: true, pos: [1.2, 15 + b, 4 + Math.sin(t * 1.1) * 0.08], quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.32 + Math.sin(t * 1.3) * 0.006, -0.1, 0, "XYZ")) };
  };
  C.cameraAt = function (t) {
    const sh = C.shotAt(t), u = (t - sh.t0) / (sh.t1 - sh.t0); let cp;
    if (sh.orbit) { const o = sh.orbit; cp = C.orbit(o.c, o.r[0], o.r[1], o.az[0], o.az[1], o.el[0], o.el[1], o.f[0], o.f[1], u, sh.ease, o.roll); } else cp = C.camPath(sh.keys, u, sh.ease);
    const d = C.drift(t, sh.id === "D" ? 0.05 : 0.02); cp.pos = [cp.pos[0] + d[0], cp.pos[1] + d[1], cp.pos[2] + d[2]]; return cp;
  };
  C.createScene = function (THREE, renderer, canvas2d) {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xdfe5f0); scene.fog = new THREE.Fog(0xdfe5f0, 90, 220);
    const cam = new THREE.PerspectiveCamera(40, 1080 / 1920, 0.4, 400);
    // entorno para reflejos (cajas de luz suaves)
    const pm = new THREE.PMREMGenerator(renderer), envS = new THREE.Scene();
    envS.add(new THREE.Mesh(new THREE.BoxGeometry(80, 50, 80), new THREE.MeshBasicMaterial({ color: 0x6f7f9e, side: THREE.BackSide })));
    [[0, 24, -10, 40, 3, 0xffffff], [-30, 10, 10, 3, 30, 0xfff1d8], [30, 12, 0, 3, 24, 0xcfe0ff]].forEach(([x, y, z, w, h, c]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(6), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 8, 0); envS.add(m); });
    scene.environment = pm.fromScene(envS, 0.03).texture;
    // luces
    scene.add(new THREE.HemisphereLight(0xeaf1ff, 0x8a7a68, 0.55));
    const key = new THREE.DirectionalLight(0xfff4e2, 1.5); key.position.set(-26, 46, 30); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -38, right: 38, top: 38, bottom: -38, near: 5, far: 140 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.05; scene.add(key);
    const rim = new THREE.DirectionalLight(0xbcd2ff, 0.7); rim.position.set(30, 22, -30); scene.add(rim);
    // escritorio (madera procedural), pared con ventana
    const dc = document.createElement("canvas"); dc.width = 1024; dc.height = 1024; const dx = dc.getContext("2d");
    const gr = dx.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, "#e5cfae"); gr.addColorStop(1, "#c9a87e"); dx.fillStyle = gr; dx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 70; i++) { dx.strokeStyle = `rgba(120,80,40,${0.04 + (i % 5) * 0.012})`; dx.lineWidth = 2 + (i % 4); dx.beginPath(); const y = (i * 14.7) % 1024; dx.moveTo(0, y); dx.bezierCurveTo(300, y + ((i * 7) % 18) - 9, 700, y - ((i * 5) % 16) + 8, 1024, y + ((i * 3) % 12) - 6); dx.stroke(); }
    const dtex = new THREE.CanvasTexture(dc); dtex.encoding = THREE.sRGBEncoding; dtex.wrapS = dtex.wrapT = THREE.RepeatWrapping; dtex.repeat.set(3, 3); dtex.anisotropy = 4;
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(C.SPEC.desk.size, C.SPEC.desk.size), new THREE.MeshStandardMaterial({ map: dtex, roughness: 0.55, metalness: 0 })); desk.rotation.x = -Math.PI / 2; desk.receiveShadow = true; scene.add(desk);
    const wc = document.createElement("canvas"); wc.width = 512; wc.height = 512; const wx = wc.getContext("2d"); const wg = wx.createLinearGradient(0, 0, 0, 512); wg.addColorStop(0, "#f3f5fa"); wg.addColorStop(1, "#d3dbea"); wx.fillStyle = wg; wx.fillRect(0, 0, 512, 512);
    const wtex = new THREE.CanvasTexture(wc); wtex.encoding = THREE.sRGBEncoding;
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(220, 120), new THREE.MeshBasicMaterial({ map: wtex })); wall.position.set(0, 40, -60); scene.add(wall);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(36, 44), new THREE.MeshBasicMaterial({ color: 0xcfe6ff })); win.position.set(-30, 32, -59.8); scene.add(win);
    [[-30, 32, 0.8, 44], [-30, 32, 36, 0.8]].forEach(([x, y, w, h]) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0xffffff })); b.position.set(x, y, -59.7); scene.add(b); });
    // objetos de contexto: cuaderno, lápiz (primer plano), taza, planta
    const nbk = new THREE.Mesh(new THREE.BoxGeometry(14, 0.9, 19), new THREE.MeshStandardMaterial({ color: 0xf7f8fc, roughness: 0.8 })); nbk.position.set(-14, 0.45, -4); nbk.rotation.y = 0.35; nbk.castShadow = nbk.receiveShadow = true; scene.add(nbk);
    const cover = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.3, 19.4), new THREE.MeshStandardMaterial({ color: 0x0066cc, roughness: 0.6 })); cover.position.set(-14, 0.15, -4); cover.rotation.y = 0.35; cover.castShadow = true; scene.add(cover);
    const pencil = new THREE.Group(); const pb = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 17, 6), new THREE.MeshStandardMaterial({ color: 0xf2b63c, roughness: 0.5 })); pb.rotation.z = Math.PI / 2; pencil.add(pb);
    const pt = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.4, 6), new THREE.MeshStandardMaterial({ color: 0xe8c9a0 })); pt.rotation.z = Math.PI / 2; pt.position.x = 9.2; pencil.add(pt);
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 1.2, 6), new THREE.MeshStandardMaterial({ color: 0xc10a2b })); pe.rotation.z = Math.PI / 2; pe.position.x = -9; pencil.add(pe);
    pencil.position.set(-12, 0.45, 8.2); pencil.rotation.y = 0.18; pencil.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(pencil);
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 2.8, 7.5, 32), new THREE.MeshStandardMaterial({ color: 0xf4f6fb, roughness: 0.35 })); mug.position.set(16, 3.75, -12); mug.castShadow = true; scene.add(mug);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.5, 12, 24, Math.PI), new THREE.MeshStandardMaterial({ color: 0xf4f6fb, roughness: 0.35 })); handle.position.set(19, 3.9, -12); handle.rotation.z = -Math.PI / 2; scene.add(handle);
    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 0.2, 32), new THREE.MeshStandardMaterial({ color: 0x5a3a28, roughness: 0.3 })); coffee.position.set(16, 7.2, -12); scene.add(coffee);
    const plant = new THREE.Group(); const leafMat = new THREE.MeshStandardMaterial({ color: 0x3e9b6b, roughness: 0.5, side: THREE.DoubleSide });
    for (let i = 0; i < 7; i++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), leafMat); lf.scale.set(0.9, 7, 2.4); lf.position.set(Math.sin(i * 0.9) * 1.6, 9.5, Math.cos(i * 0.9) * 1.2); lf.rotation.set(0.35 * Math.cos(i * 1.7), i * 0.9, 0.55 * Math.sin(i * 1.3)); lf.castShadow = true; plant.add(lf); }
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 3.2, 6.2, 28), new THREE.MeshStandardMaterial({ color: 0xe9e4da, roughness: 0.8 })); pot.position.y = 3.1; pot.castShadow = true; plant.add(pot);
    plant.position.set(23, 0, 11); scene.add(plant);
    // teléfono + textura de pantalla + mano
    const tex = new THREE.CanvasTexture(canvas2d); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8; tex.minFilter = THREE.LinearMipmapLinearFilter;
    const phone = C.buildPhone(THREE, { texture: tex }); scene.add(phone.group);
    const hand = C.buildHand(THREE); phone.group.add(hand.root); C.placeHand(THREE, hand.root); hand.arm.rotation.z = -0.32;
    const sctx = canvas2d.getContext("2d");
    const _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _m = new THREE.Matrix4();

    const thumbPose = C.thumbPose, uiState = C.uiState;
    function setState(t) {
      const sh = C.shotAt(t), u = (t - sh.t0) / (sh.t1 - sh.t0);
      C.drawScreen(sctx, uiState(t)); tex.needsUpdate = true;
      const X = C.phoneXform(THREE, t);
      phone.group.position.set(...X.pos); phone.group.quaternion.copy(X.quat);
      hand.root.visible = X.held;
      if (X.held) hand.setPose({ f: C.GRIP.fingers, t: thumbPose(t) });
      const cp = C.cameraAt(t);
      cam.position.set(...cp.pos); cam.up.set(0, 1, 0); cam.lookAt(cp.tgt[0], cp.tgt[1], cp.tgt[2]);
      if (cp.roll) cam.rotateZ(C.deg(cp.roll));
      cam.fov = C.focalToFov(cp.f); cam.updateProjectionMatrix();
      return { shot: sh.id, u, focal: cp.f };
    }
    return { scene, cam, phone, hand, setState, thumbPose, uiState };
  };
})(typeof window !== "undefined" ? window : globalThis);
