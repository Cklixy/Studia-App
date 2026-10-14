/* Historia: construye el mundo, los actores y los props una sola vez; cada acto es una función pura del tiempo global. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  const seg = (t, a, b) => C.clamp((t - a) / (b - a), 0, 1), E = C.ease;
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  C.FPS = 30; C.W = 1080; C.H = 1920;
  C.ACTS = [{ id: "A", f0: 0, f1: 90 }, { id: "B", f0: 90, f1: 240 }, { id: "C", f0: 240, f1: 420 }, { id: "D", f0: 420, f1: 690 }, { id: "E", f0: 690, f1: 900 }, { id: "F", f0: 900, f1: 1110 }, { id: "G", f0: 1110, f1: 1230 }, { id: "H", f0: 1230, f1: 1350 }];
  C.actAt = (t) => { const f = Math.round(t * C.FPS); for (const a of C.ACTS) if (f >= a.f0 && f < a.f1) return a; return C.ACTS[C.ACTS.length - 1]; };

  C.buildStory = function (THREE, renderer) {
    const V3 = THREE.Vector3, Q = THREE.Quaternion, Wd = C.buildWorld(THREE, renderer), scene = Wd.scene, cam = new THREE.PerspectiveCamera(40, C.W / C.H, 0.5, 900);
    const post = C.createPost(THREE, renderer, C.W, C.H);
    const M = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? 0.7 : r, metalness: m || 0 });
    // ---------- actores ----------
    const student = C.buildActor(THREE, { cloth: 0x5b63d6, clothDark: 0x474fb8, hoodie: true, hair: 0x4a3426, hairBack: true, pants: 0x2a3042, blinkSeed: 0.1 });
    const prof = C.buildActor(THREE, { cloth: 0x2f3b5a, clothDark: 0x262f48, blazer: true, hair: 0x9a9aa8, brow: 0x8a8a98, glasses: true, mustache: true, pants: 0x1f2538, blinkSeed: 0.55, skin: 0xe2b595 });
    scene.add(student.root); scene.add(prof.root);
    // ---------- props ----------
    const SHEET = C.SHEET; const shC = mk(1000, 1414), shT = new THREE.CanvasTexture(shC); shT.encoding = THREE.sRGBEncoding; shT.anisotropy = 8;
    const sheetMats = [M(0xf3f4f8, 0.9), M(0xf3f4f8, 0.9), M(0xf3f4f8, 0.9), M(0xf3f4f8, 0.9), new THREE.MeshStandardMaterial({ map: shT, roughness: 0.85 }), M(0xffffff, 0.9)];
    const sheet = new THREE.Group(); const sheetMesh = new THREE.Mesh(new THREE.BoxGeometry(SHEET.W, SHEET.H, SHEET.D), sheetMats); sheetMesh.castShadow = sheetMesh.receiveShadow = true; sheet.add(sheetMesh); scene.add(sheet);
    function drawSheet(s) {
      const c = shC.getContext("2d"), F = "Geist, ui-sans-serif, sans-serif"; c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 1000, 1414);
      c.fillStyle = "#4A5568"; c.font = `700 56px ${F}`; c.fillText("Parcial · Cálculo diferencial", 70, 120); c.fillStyle = "#D3D9E5"; c.fillRect(70, 170, 420, 22); c.fillStyle = "#E4E8F0"; c.fillRect(70, 214, 300, 18);
      c.fillStyle = "#14213D"; c.font = `600 60px ${F}`; c.fillText("1.  lím  (x² − 4) / (x − 2)", 70, 340); c.fillStyle = "#636366"; c.font = `500 40px ${F}`; c.fillText("x → 2", 70, 392);
      if (s.work > 0) { c.strokeStyle = "#2c3a5c"; c.lineWidth = 7; c.lineCap = "round"; c.lineJoin = "round"; const lines = [[70, 480, 560, 470], [70, 560, 700, 548], [70, 640, 420, 636], [70, 720, 640, 714]]; const n = s.work * lines.length; lines.forEach((l, i) => { const k = C.clamp(n - i, 0, 1); if (k > 0) { c.beginPath(); c.moveTo(l[0], l[1]); for (let j = 1; j <= 14; j++) { const u = (j / 14) * k; c.lineTo(l[0] + (l[2] - l[0]) * u, l[1] + (l[3] - l[1]) * u + Math.sin(j * 1.7 + i) * 5); } c.stroke(); } }); }
      if (s.scribble > 0) { c.strokeStyle = "rgba(60,70,100,0.55)"; c.lineWidth = 6; for (let i = 0; i < 6 * s.scribble; i++) { c.beginPath(); c.moveTo(80 + i * 8, 470 + (i % 2) * 30); c.lineTo(620 - i * 20, 520 + i * 36); c.stroke(); } c.strokeStyle = "#C10A2B"; c.lineWidth = 9; c.beginPath(); c.moveTo(600, 300); c.lineTo(720, 380); c.moveTo(720, 300); c.lineTo(600, 380); c.stroke(); }
      if (s.mark > 0) { c.strokeStyle = "#C10A2B"; c.lineWidth = 12; c.lineCap = "round"; c.lineJoin = "round"; [[330, 0], [500, 1], [670, 2]].forEach(([y, i]) => { const k = seg(s.mark, i * 0.28, i * 0.28 + 0.4); if (k > 0) { c.globalAlpha = k; c.beginPath(); c.moveTo(800, y - 10); c.lineTo(840, y + 35); c.lineTo(910, y - 50); c.stroke(); c.globalAlpha = 1; } }); }
      if (s.grade > 0) { const k = E.outCubic(s.grade), sc = 1 + (1 - k) * 1.2; c.save(); c.translate(500, 1090); c.scale(sc, sc); c.globalAlpha = Math.min(1, s.grade * 2); c.strokeStyle = "#C10A2B"; c.lineWidth = 22; c.beginPath(); c.arc(0, 0, 200, 0, 7); c.stroke(); c.fillStyle = "#C10A2B"; c.font = `700 230px ${F}`; c.textAlign = "center"; c.fillText("5.0", 0, 78); c.restore(); c.globalAlpha = 1; }
      if (s.exc > 0) { c.globalAlpha = s.exc; c.fillStyle = "#C10A2B"; c.font = `italic 700 92px ${F}`; c.textAlign = "center"; c.fillText("¡Excelente!", 500, 1370); c.globalAlpha = 1; c.textAlign = "left"; }
      shT.needsUpdate = true;
    }
    // lápiz (eje +Y, punta en +Y)
    const pencil = new THREE.Group(); { const pb = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 14.5, 6), M(0xf2b63c, 0.45)); pb.position.y = -1.0; pencil.add(pb); const wd = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.5, 6), M(0xe8c9a0, 0.6)); wd.position.y = 7.0; pencil.add(wd); const pt = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.5, 6), M(0x2b2f3a, 0.4)); pt.position.y = 7.9; pencil.add(pt); const fe = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.9, 12), M(0xb8bcc8, 0.3, 0.8)); fe.position.y = -8.7; pencil.add(fe); const er = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 1.2, 12), M(0xc10a2b, 0.7)); er.position.y = -9.6; pencil.add(er); pencil.traverse((m) => { if (m.isMesh) m.castShadow = true; }); }
    pencil.userData.tipY = 8.1; scene.add(pencil);
    // celular
    const sCan = mk(C.SCREEN_PX.w, C.SCREEN_PX.h), sCtx = sCan.getContext("2d"), sTex = new THREE.CanvasTexture(sCan); sTex.encoding = THREE.sRGBEncoding; sTex.anisotropy = 8; sTex.minFilter = THREE.LinearMipmapLinearFilter;
    const phone = C.buildPhone(THREE, { texture: sTex }); scene.add(phone.group);
    // reloj de escritorio
    const dClock = new THREE.Group(); { const body = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 3.2, 40), M(0x2a3042, 0.4, 0.4)); body.rotation.x = Math.PI / 2; body.castShadow = true; dClock.add(body); const face = new THREE.Mesh(new THREE.CircleGeometry(4.5, 40), M(0xfafafa, 0.4)); face.position.z = 1.65; dClock.add(face); for (let i = 0; i < 12; i++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(0.2, i % 3 ? 0.5 : 0.9, 0.1), M(0x1b2030)); const a = (i / 12) * Math.PI * 2; tk.position.set(Math.sin(a) * 3.8, Math.cos(a) * 3.8, 1.7); tk.rotation.z = -a; dClock.add(tk); } const hh = (len, w, col) => { const g2 = new THREE.Group(), m = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.15), M(col, 0.4)); m.position.y = len / 2 - 0.4; g2.add(m); g2.position.z = 1.8; dClock.add(g2); return g2; }; dClock.userData = { h: hh(2.4, 0.38, 0x1b2030), m: hh(3.5, 0.28, 0x1b2030), s: hh(3.9, 0.12, 0xc10a2b) }; const leg = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 0.6), M(0x2a3042, 0.4, 0.4)); leg.position.set(0, -4.2, -1.2); dClock.add(leg); }
    dClock.position.set(-40, 5.2, -6); dClock.rotation.y = 0.0; scene.add(dClock);
    // libretas extra y pila de hojas
    const stack = new THREE.Group(); for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(21, 0.12, 29.7), M(0xf6f7fb, 0.9)); p.position.set(0, 0.06 + i * 0.13, 0); p.rotation.y = (i % 3 - 1) * 0.05; p.castShadow = p.receiveShadow = true; stack.add(p); } stack.position.set(52, 0, 4); scene.add(stack);
    const deskPaper = new THREE.Group(); scene.add(deskPaper);   // la hoja del escritorio es la misma `sheet` colocada sobre la mesa
    // ---------- utilidades ----------
    const tmpM = new THREE.Matrix4(), tmpQ = new Q(), tmpV = new V3();
    const basisQ = (b) => new Q().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new V3(...b[0]), new V3(...b[1]), new V3(...b[2])));
    const worldOf = (obj, local) => new V3(...local).applyMatrix4(obj.matrixWorld);
    const thumbAt = (name) => C.GRIP.thumb[name];
    const STU_POS = [0, -26, 62];
    function seated(extra) { return Object.assign({ pos: STU_POS, yaw: Math.PI, lean: -0.04 }, extra); }
    const state = { shot: "-" };
    const MOODS = {
      tense: { hemi: 0.26, key: 0.9, keyC: 0xbcd2ff, fill: 0.18, rim: 0.6, rimC: 0x7a9cff, lamp: 0.0, bg: 0x0d1220, win: 0x5c6f96, wall: 0x8b93a8, keyPos: [-80, 150, 110] },
      neutral: { hemi: 0.5, key: 1.4, fill: 0.45, rim: 0.8, lamp: 0.2, bg: 0x151a26, win: 0xcfe6ff, wall: 0xe9edf5 },
      clarity: { hemi: 0.62, key: 1.7, keyC: 0xffffff, fill: 0.6, rim: 1.0, rimC: 0x9ec3ff, lamp: 0.3, bg: 0x182036, win: 0xdff0ff, wall: 0xf0f3fa },
      warm: { hemi: 0.58, key: 1.7, keyC: 0xffe9c8, fill: 0.5, rim: 0.9, rimC: 0xffd8a8, lamp: 0.9, bg: 0x1a1b24, win: 0xffe9c8, wall: 0xf3e8d8, keyPos: [-90, 140, 100] },
      studio: { hemi: 0.85, hemiC: 0xffffff, key: 1.5, keyC: 0xffffff, fill: 0.7, rim: 0.7, rimC: 0xcfe0ff, lamp: 0, bg: 0xeef3fb, win: 0xffffff, wall: 0xffffff, keyPos: [-60, 150, 120] },
      class: { hemi: 0.62, key: 1.45, keyC: 0xfff6ea, fill: 0.55, rim: 0.6, lamp: 0, bg: 0x1b2030, win: 0xe6f3ff, wall: 0xeef1f6 }
    };
    // holograma, paneles auténticos y logotipo
    const holo = C.buildHolo(THREE); scene.add(holo.group); holo.group.visible = false;
    const panels = ["metodo", "habitos"].map((n) => { const cv = mk(1074, n === "habitos" ? 888 : 678), tx = new THREE.CanvasTexture(cv); tx.encoding = THREE.sRGBEncoding; const mat = new THREE.MeshBasicMaterial({ map: tx, transparent: true, opacity: 0 }); const w = 26, h = w * cv.height / cv.width; const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); mesh.visible = false; mesh.renderOrder = 8; scene.add(mesh); return { mesh, mat, cv, tx, name: n, drawn: false }; });
    const logoCv = mk(512, 512), logoTx = new THREE.CanvasTexture(logoCv); logoTx.encoding = THREE.sRGBEncoding; const logo = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshBasicMaterial({ map: logoTx, transparent: true, opacity: 0 })); logo.visible = false; logo.renderOrder = 9; scene.add(logo);
    function prepImages() { panels.forEach((p) => { if (p.drawn) return; const im = document.getElementById("ui-" + p.name); if (im && im.naturalWidth) { const c2 = p.cv.getContext("2d"); c2.clearRect(0, 0, p.cv.width, p.cv.height); c2.drawImage(im, 0, 0, p.cv.width, p.cv.height); p.tx.needsUpdate = true; p.drawn = true; } }); if (!logo.userData.ok) { const im = document.getElementById("ui-logo"); if (im && im.naturalWidth) { const c2 = logoCv.getContext("2d"); c2.clearRect(0, 0, 512, 512); c2.drawImage(im, 0, 0, 512, 512); logoTx.needsUpdate = true; logo.userData.ok = true; } } }
    const ctx = { THREE, holo, panels, logo, prepImages, V3, Q, Wd, scene, cam, post, student, prof, sheet, drawSheet, pencil, phone, sCtx, sTex, dClock, stack, MOODS, seg, E, basisQ, worldOf, STU_POS, seated, state };
    // ---------- render ----------
    const mixMood = (a, b, k) => { const o = {}; Object.keys(a).forEach((key) => { const x = a[key], y = b[key]; if (key === "keyPos") { o[key] = x && y ? x.map((v, i) => v + (y[i] - v) * k) : (y || x); return; } if (typeof x !== "number") return; const isC = key.endsWith("C") || key === "bg" || key === "win" || key === "wall"; if (isC) { const cx = new THREE.Color(x), cy = new THREE.Color(y == null ? x : y); o[key] = cx.lerp(cy, k).getHex(); } else o[key] = x + ((y == null ? x : y) - x) * k; }); return o; };
    ctx.shot = { pos: [0, 40, 100], tgt: [0, 40, 0], f: 50, focus: 100, fstop: 4, dof: 0.35, roll: 0, mood: "neutral" };
    ctx.headPos = () => { const v = new V3(); student.head.getWorldPosition(v); return v; };
    ctx.hideAll = () => { student.root.visible = true; ctx.logoFace = false; sheet.visible = false; pencil.visible = false; phone.group.visible = false; prof.root.visible = false; stack.visible = true; stack.children.forEach((p) => (p.visible = true)); dClock.visible = true; holo.group.visible = false; ctx.holoParams = null; panels.forEach((p) => (p.mesh.visible = false)); logo.visible = false; prepImages(); };
    ctx.setSheetHeld = (pos, quat) => { sheet.position.copy(pos); sheet.quaternion.copy(quat); sheet.visible = true; sheet.updateMatrixWorld(true); };
    ctx.wristForSheet = (side) => { const P = C.SHEET_PLACEMENT, s = side === "L" ? -1 : 1; const q = basisQ(P.basis); const pos = new V3(s * P.wrist[0], P.wrist[1], P.wrist[2]).applyMatrix4(sheet.matrixWorld); const quat = sheet.quaternion.clone().multiply(q); return { pos: pos.toArray(), quat: quat.toArray() }; };
    ctx.wristForPhone = () => { phone.group.updateMatrixWorld(true); const P = C.GRIP_PLACEMENT, q = basisQ(P.basis); const pos = new V3(...P.wrist).applyMatrix4(phone.group.matrixWorld); const quat = phone.group.quaternion.clone().multiply(q); return { pos: pos.toArray(), quat: quat.toArray() }; };
    ctx.wristForPencil = (tipWorld, dirWorld, roll) => { // devuelve muñeca/orientación de mano para que la punta esté en tipWorld con el eje en dirWorld
      const G = C.GRIP_PENCIL, U = new V3(...G.axisDir), A = new V3(...G.axisPoint); const qa = new Q().setFromUnitVectors(U, dirWorld.clone().normalize()); const qr = new Q().setFromAxisAngle(dirWorld.clone().normalize(), roll || 0); const q = qr.multiply(qa);
      const tipLocal = A.clone().addScaledVector(U, G.tipS); const pos = tipWorld.clone().sub(tipLocal.applyQuaternion(q)); return { pos: pos.toArray(), quat: q.toArray(), q, A, U };
    };
    ctx.placePencilInHand = (wr) => { const G = C.GRIP_PENCIL, q = wr.q, U = new V3(...G.axisDir), A = new V3(...G.axisPoint); const origin = new V3(...wr.pos); const center = A.clone().addScaledVector(U, G.tipS - C.PENCIL_TIP_Y); const pw = center.applyQuaternion(q).add(origin); pencil.position.copy(pw); pencil.quaternion.copy(q.clone().multiply(new Q().setFromUnitVectors(new V3(0, 1, 0), U))); pencil.visible = true; };
    C.PENCIL_TIP_Y = 8.1;
    ctx.render = (t) => {
      const sh = ctx.shot; cam.position.set(...sh.pos); cam.up.set(0, 1, 0); cam.lookAt(...sh.tgt); if (sh.roll) cam.rotateZ(C.deg(sh.roll)); cam.fov = C.focalToFov(sh.f); cam.updateProjectionMatrix();
      Wd.setMood(typeof sh.mood === "object" ? mixMood(MOODS[sh.mood.a], MOODS[sh.mood.b], sh.mood.k) : MOODS[sh.mood || "neutral"]); if (ctx.holoParams) holo.set(ctx.holoParams, cam.position); if (ctx.logoFace) logo.lookAt(cam.position);
      post.render(scene, cam, { focus: sh.focus, fstop: sh.fstop, focal: sh.f, dofScale: sh.dof, exposure: sh.exposure || 1.0, contrast: sh.contrast || 1.08, sat: sh.sat || 1.05, vig: sh.vig == null ? 0.3 : sh.vig, seed: Math.floor(t * 30), tint: sh.tint, lift: sh.lift });
    };
    return ctx;
  };
})(typeof window !== "undefined" ? window : globalThis);
