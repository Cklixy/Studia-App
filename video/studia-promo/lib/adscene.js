(function (g) {
  const C = (g.Cine = g.Cine || {});
  const seg = (t, a, b) => C.clamp((t - a) / (b - a), 0, 1);
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  C.buildAd = function (THREE, renderer) {
    const V3 = THREE.Vector3, scene = new THREE.Scene(); scene.background = new THREE.Color(0xdfe5f0); scene.fog = new THREE.Fog(0xdfe5f0, 110, 260);
    const cam = new THREE.PerspectiveCamera(40, 1080 / 1920, 0.4, 500);
    const M = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? 0.6 : r, metalness: m || 0 });
    // --- entorno de reflejos y luces ---
    const pm = new THREE.PMREMGenerator(renderer), envS = new THREE.Scene();
    envS.add(new THREE.Mesh(new THREE.BoxGeometry(80, 50, 80), new THREE.MeshBasicMaterial({ color: 0x6f7f9e, side: THREE.BackSide })));
    [[0, 24, -10, 40, 3, 0xffffff], [-30, 10, 10, 3, 30, 0xfff1d8], [30, 12, 0, 3, 24, 0xcfe0ff]].forEach(([x, y, z, w, h, c]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(6), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 8, 0); envS.add(m); });
    scene.environment = pm.fromScene(envS, 0.03).texture;
    scene.add(new THREE.HemisphereLight(0xeaf1ff, 0x8a7a68, 0.55));
    const key = new THREE.DirectionalLight(0xfff4e2, 1.5); key.position.set(-26, 46, 30); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -42, right: 42, top: 42, bottom: -42, near: 5, far: 160 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.05; scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff0e0, 0.0); fill.position.set(-18, 30, -50); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xbcd2ff, 0.7); rim.position.set(30, 22, -30); scene.add(rim);
    // --- escritorio y pared ---
    const dc = mk(1024, 1024), dx = dc.getContext("2d"), gr = dx.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, "#e5cfae"); gr.addColorStop(1, "#c9a87e"); dx.fillStyle = gr; dx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 70; i++) { dx.strokeStyle = `rgba(120,80,40,${0.04 + (i % 5) * 0.012})`; dx.lineWidth = 2 + (i % 4); dx.beginPath(); const y = (i * 14.7) % 1024; dx.moveTo(0, y); dx.bezierCurveTo(300, y + ((i * 7) % 18) - 9, 700, y - ((i * 5) % 16) + 8, 1024, y + ((i * 3) % 12) - 6); dx.stroke(); }
    const dtex = new THREE.CanvasTexture(dc); dtex.encoding = THREE.sRGBEncoding; dtex.wrapS = dtex.wrapT = THREE.RepeatWrapping; dtex.repeat.set(3, 3); dtex.anisotropy = 4;
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(C.SPEC.desk.size, C.SPEC.desk.size), new THREE.MeshStandardMaterial({ map: dtex, roughness: 0.55 })); desk.rotation.x = -Math.PI / 2; desk.receiveShadow = true; scene.add(desk);
    const home = new THREE.Group(); scene.add(home);
    const wc = mk(512, 512), wx = wc.getContext("2d"), wg = wx.createLinearGradient(0, 0, 0, 512); wg.addColorStop(0, "#f3f5fa"); wg.addColorStop(1, "#d3dbea"); wx.fillStyle = wg; wx.fillRect(0, 0, 512, 512);
    const wtex = new THREE.CanvasTexture(wc); wtex.encoding = THREE.sRGBEncoding;
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(240, 130), new THREE.MeshBasicMaterial({ map: wtex })); wall.position.set(0, 40, -60); home.add(wall);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(36, 44), new THREE.MeshBasicMaterial({ color: 0xcfe6ff })); win.position.set(-30, 32, -59.8); home.add(win);
    [[-30, 32, 0.8, 44], [-30, 32, 36, 0.8]].forEach(([x, y, w, h]) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0xffffff })); b.position.set(x, y, -59.7); home.add(b); });
    const nbk = new THREE.Mesh(new THREE.BoxGeometry(14, 0.9, 19), M(0xf7f8fc, 0.8)); nbk.position.set(-14, 0.45, -4); nbk.rotation.y = 0.35; nbk.castShadow = nbk.receiveShadow = true; home.add(nbk);
    const cover = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.3, 19.4), M(0x0066cc, 0.6)); cover.position.set(-14, 0.15, -4); cover.rotation.y = 0.35; cover.castShadow = true; home.add(cover);
    const pencil = new THREE.Group(); const pb = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 17, 6), M(0xf2b63c, 0.5)); pb.rotation.z = Math.PI / 2; pencil.add(pb);
    const pt = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.4, 6), M(0xe8c9a0)); pt.rotation.z = Math.PI / 2; pt.position.x = 9.2; pencil.add(pt);
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 1.2, 6), M(0xc10a2b)); pe.rotation.z = Math.PI / 2; pe.position.x = -9; pencil.add(pe);
    pencil.position.set(-12, 0.45, 8.2); pencil.rotation.y = 0.18; pencil.traverse((m) => { if (m.isMesh) m.castShadow = true; }); home.add(pencil);
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 2.8, 7.5, 32), M(0xf4f6fb, 0.35)); mug.position.set(16, 3.75, -12); mug.castShadow = true; home.add(mug);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.5, 12, 24, Math.PI), M(0xf4f6fb, 0.35)); handle.position.set(19, 3.9, -12); handle.rotation.z = -Math.PI / 2; home.add(handle);
    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 0.2, 32), M(0x5a3a28, 0.3)); coffee.position.set(16, 7.2, -12); home.add(coffee);
    const plant = new THREE.Group(), leafMat = new THREE.MeshStandardMaterial({ color: 0x3e9b6b, roughness: 0.5, side: THREE.DoubleSide });
    for (let i = 0; i < 7; i++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), leafMat); lf.scale.set(0.9, 7, 2.4); lf.position.set(Math.sin(i * 0.9) * 1.6, 9.5, Math.cos(i * 0.9) * 1.2); lf.rotation.set(0.35 * Math.cos(i * 1.7), i * 0.9, 0.55 * Math.sin(i * 1.3)); lf.castShadow = true; plant.add(lf); }
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 3.2, 6.2, 28), M(0xe9e4da, 0.8)); pot.position.y = 3.1; pot.castShadow = true; plant.add(pot); plant.position.set(23, 0, 11); home.add(plant);
    // audífonos y soporte (escenas de escritorio)
    const hp = new THREE.Group(), hpM = M(0x1b2030, 0.4, 0.3);
    const band = new THREE.Mesh(new THREE.TorusGeometry(7.4, 0.6, 14, 40, Math.PI), hpM); hp.add(band);
    [-1, 1].forEach((s) => { const cup = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 2.6, 28), hpM); cup.rotation.z = Math.PI / 2; cup.position.set(s * 7.4, 0, 0); hp.add(cup); const cs = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.5, 28), M(0x4f46e5, 0.6)); cs.rotation.z = Math.PI / 2; cs.position.set(s * 8.8, 0, 0); hp.add(cs); });
    hp.rotation.x = -Math.PI / 2 + 0.2; hp.position.set(19, 3.6, 7); hp.rotation.z = 0.5; hp.traverse((m) => { if (m.isMesh) m.castShadow = true; }); hp.visible = false; scene.add(hp);
    const stand = new THREE.Mesh(new THREE.BoxGeometry(5, 4.2, 2.2), M(0xcfd6e4, 0.6)); stand.position.set(0, 2.1, -1.6); stand.rotation.x = -0.1; stand.castShadow = true; stand.visible = false; scene.add(stand);
    // calendario de pared (textura dinámica)
    const calC = mk(780, 660), calT = new THREE.CanvasTexture(calC); calT.encoding = THREE.sRGBEncoding;
    const cal = new THREE.Mesh(new THREE.PlaneGeometry(26, 22), new THREE.MeshBasicMaterial({ map: calT })); cal.position.set(-2, 23, -59.5); cal.visible = false; scene.add(cal);
    function drawCal(k) {
      const c = calC.getContext("2d"); c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 780, 660); c.fillStyle = "#C10A2B"; c.fillRect(0, 0, 780, 130); c.fillStyle = "#FFF"; c.font = "700 64px Geist, sans-serif"; c.textAlign = "center"; c.fillText("OCTUBRE", 390, 90);
      c.fillStyle = "#5B6678"; c.font = "600 34px Geist, sans-serif"; ["L", "M", "M", "J", "V", "S", "D"].forEach((l, i) => c.fillText(l, 70 + i * 106, 180));
      for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { const n = r * 7 + i + 1; if (n > 31) continue; const x = 70 + i * 106, y = 260 + r * 100; c.fillStyle = "#14213D"; c.font = "500 40px Geist, sans-serif"; c.fillText(String(n), x, y);
        const idx = n - 9; if (idx >= 0 && idx < 7 + 1) { const on = idx < 6 ? 1 : k; if (on > 0) { c.strokeStyle = "#C10A2B"; c.lineWidth = 9; c.globalAlpha = on; c.beginPath(); c.arc(x, y - 14, 38, 0, 7); c.stroke(); c.globalAlpha = 1; } } }
      calT.needsUpdate = true;
    }
    // --- aula (examen) ---
    const cls = new THREE.Group(); cls.visible = false; scene.add(cls);
    const bc = mk(1400, 700), bx = bc.getContext("2d"); bx.fillStyle = "#FFFFFF"; bx.fillRect(0, 0, 1400, 700); bx.fillStyle = "#9AA6C0"; bx.font = "600 90px Geist, sans-serif"; bx.fillText("f(x) = x²     f′(x) = 2x", 70, 190); bx.fillText("∫ 2x dx = x² + C", 70, 330); bx.fillText("lím (f(x+h) − f(x)) / h", 70, 470);
    const bt = new THREE.CanvasTexture(bc); bt.encoding = THREE.sRGBEncoding; const board = new THREE.Mesh(new THREE.PlaneGeometry(110, 55), new THREE.MeshBasicMaterial({ map: bt })); board.position.set(-8, 42, -76); cls.add(board);
    const bfr = new THREE.Mesh(new THREE.BoxGeometry(113, 58, 1), M(0xc9d1e0, 0.5)); bfr.position.set(-8, 42, -76.8); cls.add(bfr);
    const cwin = new THREE.Mesh(new THREE.PlaneGeometry(36, 46), new THREE.MeshBasicMaterial({ color: 0xcfe6ff })); cwin.position.set(66, 40, -75.5); cls.add(cwin);
    const prof = C.buildPerson(THREE, { hair: 0x9a9aa8, glasses: true, cloth: 0x3b4a6b, tie: true, brow: 0x7a7a88, longBody: true }); prof.group.position.set(0, 37, -45); prof.group.scale.setScalar(1.0); cls.add(prof.group); prof.setFace({ mouth: "smile", browLift: 0.2 });
    const profArm = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 1, 18), M(0x3b4a6b, 0.8)); profArm.castShadow = true; cls.add(profArm);
    const profHand = new THREE.Mesh(new THREE.SphereGeometry(2.4, 20, 14), M(0xe9bc9d, 0.6)); cls.add(profHand);
    const tu = new THREE.Group(); const fist = new THREE.Mesh(new THREE.SphereGeometry(3.0, 20, 14), M(0xe9bc9d, 0.6)); tu.add(fist); const thb = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 3.0, 6, 12), M(0xe9bc9d, 0.6)); thb.position.set(0.2, 4.2, 0.4); tu.add(thb);
    const tuArm = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 18, 18), M(0x3b4a6b, 0.8)); tuArm.position.set(0, -10, 0); tu.add(tuArm); tu.position.set(12, 46, -33); tu.visible = false; cls.add(tu);
    // hoja A4 con las dos manos
    const shC = mk(1000, 1414), shT = new THREE.CanvasTexture(shC); shT.encoding = THREE.sRGBEncoding; shT.anisotropy = 8;
    function drawSheet(s) {
      const c = shC.getContext("2d"), F = "Geist, ui-sans-serif, sans-serif"; c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 1000, 1414);
      c.fillStyle = "#4A5568"; c.font = `700 58px ${F}`; c.fillText("Parcial · Cálculo diferencial", 70, 120); c.fillStyle = "#D3D9E5"; c.fillRect(70, 170, 420, 22); c.fillStyle = "#E4E8F0"; c.fillRect(70, 214, 300, 18);
      [330, 500, 670, 840].forEach((y, i) => { c.fillStyle = "#D3D9E5"; c.fillRect(70, y, 640 - i * 40, 24); c.fillStyle = "#E4E8F0"; c.fillRect(70, y + 46, 480 - i * 30, 18); });
      c.strokeStyle = "#C10A2B"; c.lineWidth = 12; c.lineCap = "round"; c.lineJoin = "round"; [330, 500, 670].forEach((y, i) => { const k = seg(s.ticks, i * 0.3, i * 0.3 + 0.4); if (k > 0) { c.globalAlpha = k; c.beginPath(); c.moveTo(800, y - 10); c.lineTo(840, y + 35); c.lineTo(910, y - 50); c.stroke(); c.globalAlpha = 1; } });
      if (s.grade > 0) { const k = C.ease.outCubic(s.grade), sc = 1 + (1 - k) * 1.2; c.save(); c.translate(500, 1090); c.scale(sc, sc); c.globalAlpha = Math.min(1, s.grade * 2); c.strokeStyle = "#C10A2B"; c.lineWidth = 20; c.beginPath(); c.arc(0, 0, 190, 0, 7); c.stroke(); c.fillStyle = "#C10A2B"; c.font = `700 210px ${F}`; c.textAlign = "center"; c.fillText("5.0", 0, 70); c.restore(); c.globalAlpha = 1; }
      if (s.exc > 0) { c.globalAlpha = s.exc; c.fillStyle = "#C10A2B"; c.font = `italic 700 96px ${F}`; c.textAlign = "center"; c.fillText("¡Excelente!", 500, 1370); c.globalAlpha = 1; c.textAlign = "left"; }
      shT.needsUpdate = true;
    }
    const sheetG = new THREE.Group(); cls.add(sheetG);
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(C.SHEET.W, C.SHEET.H, C.SHEET.D), [M(0xf3f4f8, 0.9), M(0xf3f4f8, 0.9), M(0xf3f4f8, 0.9), M(0xf3f4f8, 0.9), new THREE.MeshStandardMaterial({ map: shT, roughness: 0.85 }), M(0xffffff, 0.9)]); sheet.castShadow = true; sheet.receiveShadow = true; sheetG.add(sheet);
    const handsG = new THREE.Group(); sheetG.add(handsG);
    const hR = C.buildHand(THREE), hL = C.buildHand(THREE); C.placeHandSheet(THREE, hR.root); C.placeHandSheet(THREE, hL.root);
    const mir = new THREE.Group(); mir.scale.x = -1; handsG.add(hR.root); handsG.add(mir); mir.add(hL.root);
    // --- teléfono + mano de agarre + persona del estrés ---
    const sc2 = mk(C.SCREEN_PX.w, C.SCREEN_PX.h), sctx = sc2.getContext("2d"), stex = new THREE.CanvasTexture(sc2); stex.encoding = THREE.sRGBEncoding; stex.anisotropy = 8; stex.minFilter = THREE.LinearMipmapLinearFilter;
    const phone = C.buildPhone(THREE, { texture: stex }); scene.add(phone.group);
    const hand = C.buildHand(THREE); phone.group.add(hand.root); C.placeHand(THREE, hand.root); hand.arm.rotation.z = -0.32;
    const person = C.buildPerson(THREE, { hair: 0x4a3a2e, cloth: 0x8e9bb8 }); person.group.position.set(0, 0, 34); person.group.rotation.y = Math.PI; person.group.visible = false; scene.add(person.group);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.4, 1, 20), M(0x8e9bb8, 0.9)); upper.castShadow = true; upper.visible = false; scene.add(upper);
    // --- burbuja 3D (transparente, borde rojo) ---
    const bubM = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix*mv; }",
      fragmentShader: "varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2); vec3 col = mix(vec3(1.0,0.80,0.86), vec3(0.78,0.04,0.17), smoothstep(0.30,1.0,f)); float a = mix(0.10, 0.88, f); gl_FragColor = vec4(col, a); }" });
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), bubM); bubble.visible = false; bubble.renderOrder = 5; scene.add(bubble);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false })); shine.scale.set(0.34, 0.16, 0.06); bubble.add(shine); shine.position.set(-0.5, 0.62, 0.55); shine.lookAt(-1, 1.2, 1.1);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 12, 64), new THREE.MeshBasicMaterial({ color: 0xffd9df, transparent: true, depthWrite: false })); ring.visible = false; scene.add(ring);
    const drops = []; const dcol = [0xe0314f, 0xff8a9b, 0xc10a2b, 0xffc4cd];
    for (let i = 0; i < 40; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), new THREE.MeshBasicMaterial({ color: dcol[i % 4] })); m.visible = false; scene.add(m); const a = (i / 40) * Math.PI * 2 * 3.7, b = Math.acos(1 - 2 * ((i * 0.618) % 1)); drops.push({ m, dir: new V3(Math.sin(b) * Math.cos(a), Math.sin(b) * Math.sin(a), Math.cos(b)), sp: 14 + (i % 5) * 5, r: 0.5 + (i % 4) * 0.35 }); }
    // foco (tutor), notas (sesión), destellos (racha)
    const bulb = new THREE.Group(); const bl = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffc93c })); bulb.add(bl);
    const bb = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.0, 1.6, 16), M(0x8a8a94, 0.4)); bb.position.y = -2.7; bulb.add(bb);
    for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.4), new THREE.MeshBasicMaterial({ color: 0xffb020 })); const a = (i / 6) * Math.PI * 2; r.position.set(Math.cos(a) * 4.0, Math.sin(a) * 4.0 + 0.2, 0); r.rotation.z = a - Math.PI / 2; bulb.add(r); }
    bulb.visible = false; scene.add(bulb);
    const notes = []; for (let i = 0; i < 6; i++) { const n = new THREE.Group(); const hd = new THREE.Mesh(new THREE.SphereGeometry(0.9, 14, 10), new THREE.MeshBasicMaterial({ color: 0x4f46e5 })); hd.scale.set(1.2, 0.85, 0.6); const st = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.2, 0.28), new THREE.MeshBasicMaterial({ color: 0x4f46e5 })); st.position.set(0.9, 1.5, 0); n.add(hd, st); n.visible = false; scene.add(n); notes.push(n); }
    const sparks = []; for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.7), new THREE.MeshBasicMaterial({ color: 0xffb020 })); s.visible = false; scene.add(s); sparks.push(s); }
    const handR = hand;
    // utilidades
    const between = (m, a, b) => { const d = b.clone().sub(a), L = d.length(); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); m.scale.set(1, L, 1); };
    const _v = new V3(), _q = new THREE.Quaternion();
    function setArmTo(handRig, phoneGrp, elbow) { // apunta el antebrazo hacia un codo dado (mundo)
      phoneGrp.updateMatrixWorld(true); handRig.root.updateMatrixWorld(true); const W = new V3(); handRig.root.getWorldPosition(W);
      const dir = elbow.clone().sub(W).normalize(), wq = new THREE.Quaternion(); handRig.root.getWorldQuaternion(wq); const loc = dir.clone().applyQuaternion(wq.clone().invert());
      handRig.arm.quaternion.setFromUnitVectors(new V3(0, -1, 0), loc); return W.clone().addScaledVector(dir, 22);
    }
    const state = { page: null };
    function setState(t) {
      const sc = C.adScene(t).id, X = C.adPhoneXform(THREE, t); fill.intensity = sc === "S2" ? 1.4 : 0; desk.position.y = sc === "S7" ? -45 : 0;
      // pantalla
      if (X.vis) { const st = C.adPage(t); C.drawPage(sctx, st); stex.needsUpdate = true; }
      phone.group.visible = X.vis; phone.group.position.set(...X.pos); phone.group.quaternion.copy(X.quat);
      hand.root.visible = X.vis && X.held; if (X.held) hand.setPose({ f: C.GRIP.fingers, t: C.adThumbPose(t) });
      home.visible = sc !== "S7"; cls.visible = sc === "S7"; hp.visible = sc === "S4" || sc === "S6"; stand.visible = sc === "S4" || sc === "S6"; cal.visible = sc === "S6";
      hand.arm.rotation.set(0, 0, -0.32); hand.arm.quaternion.setFromEuler(hand.arm.rotation);
      person.group.visible = sc === "S2"; upper.visible = sc === "S2"; bubble.visible = false; ring.visible = false; drops.forEach((d) => (d.m.visible = false));
      bulb.visible = false; notes.forEach((n) => (n.visible = false)); sparks.forEach((s) => (s.visible = false));
      if (sc === "S2") {
        const k = t - 8.9, stress = seg(t, 9.3, 10.6);
        person.setFace({ mouth: "wavy", browAngle: 0.32 * stress, browLift: 0.3 * stress, look: 0 });
        person.head.rotation.z = Math.sin(t * 38) * 0.05 * stress; person.head.rotation.y = Math.sin(t * 29) * 0.06 * stress;
        person.sweat.forEach((d, i) => { d.visible = t > 9.8 + i * 0.35 && t < 11.0; d.position.y = 4 - ((t - 9.8 - i * 0.35) % 0.9) * 5; });
        const E = new V3(15, 3, 21), Wp = setArmTo(hand, phone.group, E), S = new V3(14, 17, 32); between(upper, Wp, S);
        const R = C.clamp(1.2 + 16 * C.ease.outCubic(seg(t, 9.45, 10.55)), 0.01, 20) * (t < C.AD.POP ? 1 + 0.035 * Math.sin((t - 10.5) * 22) * seg(t, 10.5, 11.0) : 1);
        if (t >= 9.45 && t < C.AD.POP + 0.1) { bubble.visible = true; bubble.position.set(1.2, 20, 12 + 0 * R); bubble.scale.setScalar(t < C.AD.POP ? R : R * (1 + 4 * seg(t, C.AD.POP, C.AD.POP + 0.1))); }
        if (t >= C.AD.POP) { const tp = t - C.AD.POP; ring.visible = tp < 0.7; ring.position.set(1.2, 20, 12); ring.scale.setScalar(16 + 70 * C.ease.outCubic(seg(t, C.AD.POP, C.AD.POP + 0.7))); ring.material.opacity = 1 - seg(t, C.AD.POP, C.AD.POP + 0.7); ring.lookAt(cam.position);
          drops.forEach((d) => { d.m.visible = tp < 0.8; d.m.position.set(1.2, 20, 12).addScaledVector(d.dir, 16 + d.sp * C.ease.outCubic(seg(t, C.AD.POP, C.AD.POP + 0.8)) * 1.3); d.m.scale.setScalar(d.r * (1 - 0.7 * seg(t, C.AD.POP, C.AD.POP + 0.8))); }); }
      }
      if (sc === "S5") { const k = seg(t, 30.9, 31.2) * (1 - seg(t, 31.4, 31.7)); bulb.visible = k > 0; bulb.position.set(8, 27, 4); bulb.scale.setScalar(0.3 + 0.7 * C.ease.outCubic(seg(t, 30.9, 31.3))); bulb.lookAt(cam.position); }
      if (sc === "S4") { notes.forEach((n, i) => { const tt = (t - 22.9 - i * 0.7); const kk = tt >= 0 && tt < 2.4 ? tt / 2.4 : -1; n.visible = kk >= 0; if (kk >= 0) { n.position.set(-10 + i * 4 - kk * 2, 13 + kk * 12, -6 + Math.sin(i) * 2); n.scale.setScalar(0.6 * Math.min(1, kk * 4) * (1 - Math.max(0, kk - 0.75) * 4)); n.lookAt(cam.position); } }); }
      if (sc === "S6") { drawCal(seg(t, 33.8, 34.3)); sparks.forEach((s, i) => { const kk = seg(t, 34.3 + i * 0.05, 35.2); s.visible = kk > 0 && kk < 1; const a = (i / 8) * Math.PI * 2; s.position.set(0 + Math.cos(a) * (9 + kk * 7), 13 + Math.sin(a) * (9 + kk * 7), 2); s.scale.setScalar(1 - kk); s.rotation.set(t * 3, t * 2, 0); }); }
      if (sc === "S7") {
        const hold = 37.5, grade = 38.3, SP = C.adSheetPose(t);
        sheetG.position.set(0, SP.y, SP.z); sheetG.rotation.set(0, 0, SP.rotZ); handsG.position.y = SP.handsY;
        const holdK = seg(t, hold - 0.2, hold + 0.1); hR.setPose({ f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb[holdK > 0.5 ? "hold" : "hover"] }); hL.setPose({ f: C.GRIP_SHEET.fingers, t: C.GRIP_SHEET.thumb[holdK > 0.5 ? "hold" : "hover"] });
        handsG.visible = t > 36.5; drawSheet({ ticks: seg(t, 37.6, 38.4), grade: seg(t, grade, grade + 0.5), exc: seg(t, 38.8, 39.2) });
        const shoulder = new V3(13, 53.5, -45), top = new V3(0, sheetG.position.y + 14.8, sheetG.position.z - 0.5); const ext = 1 - seg(t, hold, hold + 0.5);
        const hp0 = top.clone().lerp(new V3(14, 46, -45), 1 - ext); between(profArm, shoulder, hp0); profHand.position.copy(hp0); profArm.visible = profHand.visible = ext > 0.001 || t < hold + 0.55;
        tu.visible = t > 39.5; tu.scale.setScalar(C.ease.outBack ? 1 : 1);
        prof.setFace({ mouth: "smile", browLift: 0.25 * seg(t, 38.5, 39.5) });
      }
      // cámara
      const cp = C.adCamera(t); cam.position.set(...cp.pos); cam.up.set(0, 1, 0); cam.lookAt(cp.tgt[0], cp.tgt[1], cp.tgt[2]); if (cp.roll) cam.rotateZ(C.deg(cp.roll)); cam.fov = C.focalToFov(cp.f); cam.updateProjectionMatrix();
      return { scene: sc, show: !(sc === "LOGO" || sc === "END") };
    }
    return { scene, cam, setState, phone, hand, hR, hL, handsG, sheetG, person };
  };
})(typeof window !== "undefined" ? window : globalThis);
