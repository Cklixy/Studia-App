/* Mundo: escritorio de estudio (casa) y aula, con luces por estado de ánimo. Unidades: cm. Desk top en y=0. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  C.buildWorld = function (THREE, renderer) {
    const V3 = THREE.Vector3, scene = new THREE.Scene(); scene.background = new THREE.Color(0x151a26);
    const M = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? 0.7 : r, metalness: m || 0 });
    const cast = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
    // entorno para reflejos
    const pm = new THREE.PMREMGenerator(renderer), envS = new THREE.Scene();
    envS.add(new THREE.Mesh(new THREE.BoxGeometry(260, 160, 260), new THREE.MeshBasicMaterial({ color: 0x5f6f8f, side: THREE.BackSide })));
    [[0, 70, -20, 120, 10, 0xffffff], [-90, 30, 20, 10, 90, 0xfff1d8], [90, 40, 0, 10, 70, 0xcfe0ff]].forEach(([x, y, z, w, h, c]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(5), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 20, 0); envS.add(m); });
    scene.environment = pm.fromScene(envS, 0.03).texture;
    // luces
    const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x70614f, 0.45); scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff2de, 1.5); key.position.set(-80, 150, 110); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -110, right: 110, top: 110, bottom: -110, near: 20, far: 420 }); key.shadow.bias = -0.0006; key.shadow.normalBias = 0.22; scene.add(key); scene.add(key.target);
    const fill = new THREE.DirectionalLight(0xcfe0ff, 0.5); fill.position.set(110, 60, -90); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xaec8ff, 0.8); rim.position.set(60, 90, -140); scene.add(rim);
    const lamp = new THREE.PointLight(0xffc27a, 0.0, 260, 1.6); lamp.position.set(-48, 42, -12); scene.add(lamp);
    // texturas
    const wood = (a, b) => { const c = mk(1024, 1024), x = c.getContext("2d"), gr = x.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, a); gr.addColorStop(1, b); x.fillStyle = gr; x.fillRect(0, 0, 1024, 1024); for (let i = 0; i < 80; i++) { x.strokeStyle = `rgba(90,55,25,${0.035 + (i % 5) * 0.012})`; x.lineWidth = 1.5 + (i % 4); x.beginPath(); const y = (i * 12.9) % 1024; x.moveTo(0, y); x.bezierCurveTo(300, y + ((i * 7) % 18) - 9, 700, y - ((i * 5) % 16) + 8, 1024, y + ((i * 3) % 12) - 6); x.stroke(); } const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
    // ---------- HOGAR ----------
    const home = new THREE.Group(); scene.add(home); const decor = new THREE.Group(); scene.add(decor);
    const dTex = wood("#e8d3b2", "#c9a87e"); dTex.repeat.set(1.4, 0.8);
    const desk = cast(new THREE.Mesh(new THREE.BoxGeometry(150, 4, 76), new THREE.MeshStandardMaterial({ map: dTex, roughness: 0.5 }))); desk.position.set(0, -2, -2); home.add(desk);
    [[-68, -34], [68, -34], [-68, 30], [68, 30]].forEach(([x, z]) => { const l = cast(new THREE.Mesh(new THREE.BoxGeometry(4.5, 73, 4.5), M(0x2a3042, 0.5, 0.3))); l.position.set(x, -40, z); home.add(l); });
    const fTex = wood("#9b7b58", "#7d5f40"); fTex.repeat.set(5, 5); const floor = cast(new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ map: fTex, roughness: 0.6 }))); floor.rotation.x = -Math.PI / 2; floor.position.y = -76; decor.add(floor);
    const wallM = new THREE.MeshStandardMaterial({ color: 0xe9edf5, roughness: 0.95 }); const wall = new THREE.Mesh(new THREE.PlaneGeometry(700, 360), wallM); wall.position.set(0, 90, -150); wall.receiveShadow = true; decor.add(wall);
    const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(700, 360), wallM); sideWall.position.set(-230, 90, 50); sideWall.rotation.y = Math.PI / 2; decor.add(sideWall);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(110, 140), new THREE.MeshBasicMaterial({ color: 0xcfe6ff })); win.position.set(-60, 70, -149); decor.add(win); const winG = [[-60, 70, 2.5, 140], [-60, 70, 110, 2.5], [-115, 70, 3, 144], [-5, 70, 3, 144], [-60, 140, 114, 3], [-60, 0, 114, 3]].map(([x, y, w, h]) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0xffffff })); b.position.set(x, y, -148.6); decor.add(b); return b; });
    const backH = new THREE.Mesh(new THREE.PlaneGeometry(700, 360), wallM); backH.position.set(0, 90, 175); backH.rotation.y = Math.PI; backH.receiveShadow = true; decor.add(backH);
    const poster = (x, y, w, h, c1, c2) => { const cv = mk(256, 256), cx = cv.getContext("2d"), gr = cx.createLinearGradient(0, 0, 256, 256); gr.addColorStop(0, c1); gr.addColorStop(1, c2); cx.fillStyle = gr; cx.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; const pm2 = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t })); pm2.position.set(x, y, 174.5); pm2.rotation.y = Math.PI; decor.add(pm2); const fr = new THREE.Mesh(new THREE.PlaneGeometry(w + 3, h + 3), new THREE.MeshBasicMaterial({ color: 0xffffff })); fr.position.set(x, y, 174.8); fr.rotation.y = Math.PI; decor.add(fr); };
    poster(-70, 105, 45, 60, "#cfe3ff", "#6a92e5"); poster(10, 110, 55, 40, "#ffd9df", "#c10a2b"); poster(90, 100, 40, 55, "#d9f2e6", "#2e8b67");
    // estantería
    const shelf = cast(new THREE.Mesh(new THREE.BoxGeometry(110, 3, 22), M(0xb89a74, 0.6))); shelf.position.set(70, 60, -138); decor.add(shelf); const cols = [0xc10a2b, 0x4f46e5, 0x0b7fb5, 0xe3a92b, 0x2e8b67, 0x7a4b9e, 0x0066cc]; let sx = 28; cols.forEach((c, i) => { const w = 3.2 + (i % 3) * 0.8, h = 18 + (i % 4) * 2.2; const b = cast(new THREE.Mesh(new THREE.BoxGeometry(w, h, 14), M(c, 0.6))); b.position.set(sx, 61.5 + h / 2, -138); decor.add(b); sx += w + 0.4; });
    // lámpara de escritorio
    const lampG = new THREE.Group(); const lb = cast(new THREE.Mesh(new THREE.CylinderGeometry(9, 10, 2.5, 28), M(0x2a3042, 0.4, 0.4))); lb.position.y = 1.3; lampG.add(lb); const la = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 42, 10), M(0x2a3042, 0.4, 0.4))); la.position.set(0, 22, 0); lampG.add(la); const lh = cast(new THREE.Mesh(new THREE.ConeGeometry(11, 11, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xf2b63c, roughness: 0.5, side: THREE.DoubleSide }))); lh.position.set(5, 44, 0); lh.rotation.z = -0.4; lampG.add(lh); const bulb = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff0c8 })); bulb.position.set(5.6, 42, 0); lampG.add(bulb); lampG.position.set(-50, 0, -14); decor.add(lampG);
    // reloj de pared (se anima desde fuera)
    const clk = new THREE.Group(); clk.position.set(30, 112, -148); decor.add(clk); const cf = new THREE.Mesh(new THREE.CircleGeometry(15, 48), new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.4 })); clk.add(cf); const cr = new THREE.Mesh(new THREE.TorusGeometry(15, 1.1, 12, 48), M(0x1b2030, 0.4, 0.4)); cr.position.z = 0.2; clk.add(cr);
    for (let i = 0; i < 12; i++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(0.7, i % 3 ? 1.4 : 2.4, 0.3), M(0x1b2030)); const a = (i / 12) * Math.PI * 2; tk.position.set(Math.sin(a) * 12.6, Math.cos(a) * 12.6, 0.3); tk.rotation.z = -a; clk.add(tk); }
    const mkHand = (len, w, col) => { const g2 = new THREE.Group(), m = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.5), M(col, 0.4)); m.position.y = len / 2 - 1.5; g2.add(m); g2.position.z = 0.5; clk.add(g2); return g2; };
    const clkH = mkHand(8.5, 1.1, 0x1b2030), clkM = mkHand(12, 0.8, 0x1b2030), clkS = mkHand(13, 0.35, 0xc10a2b);
    // varios
    const mug = cast(new THREE.Mesh(new THREE.CylinderGeometry(4.2, 3.7, 9.5, 32), M(0xf4f6fb, 0.35))); mug.position.set(46, 4.75, -20); decor.add(mug); const mh = cast(new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.7, 12, 24, Math.PI), M(0xf4f6fb, 0.35))); mh.position.set(50.2, 5, -20); mh.rotation.z = -Math.PI / 2; decor.add(mh); const cof = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 0.2, 32), M(0x5a3a28, 0.3)); cof.position.set(46, 9.3, -20); decor.add(cof);
    const book = (x, z, w, d, h, c, ry) => { const b = cast(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c, 0.7))); b.position.set(x, h / 2, z); b.rotation.y = ry; decor.add(b); return b; };
    book(-52, -28, 24, 17, 3.2, 0x0066cc, 0.25); book(-51, -28, 22, 15, 2.6, 0xe3a92b, 0.1); book(-50, -27.5, 20, 14, 2.0, 0xc10a2b, 0.35);
    const chair = new THREE.Group(); const seat = cast(new THREE.Mesh(new THREE.BoxGeometry(44, 5, 44), M(0x3a4260, 0.7))); seat.position.set(0, -30, 0); chair.add(seat); const back = cast(new THREE.Mesh(new THREE.BoxGeometry(42, 46, 4), M(0x3a4260, 0.7))); back.position.set(0, -5, 21); chair.add(back); [[-19, -19], [19, -19], [-19, 19], [19, 19]].forEach(([x, z]) => { const l = cast(new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 44, 10), M(0x1b2030, 0.4, 0.5))); l.position.set(x, -54, z); chair.add(l); }); chair.position.set(0, 0, 58); home.add(chair);
    // ---------- AULA ----------
    const cls = new THREE.Group(); cls.visible = false; scene.add(cls);
    const cwall = new THREE.Mesh(new THREE.PlaneGeometry(900, 400), new THREE.MeshStandardMaterial({ color: 0xe6ebf3, roughness: 0.95 })); cwall.position.set(0, 100, -200); cwall.receiveShadow = true; cls.add(cwall);
    const cfloor = cast(new THREE.Mesh(new THREE.PlaneGeometry(900, 900), M(0xb8b2a6, 0.8))); cfloor.rotation.x = -Math.PI / 2; cfloor.position.y = -76; cls.add(cfloor);
    const bc = mk(1600, 760), bx = bc.getContext("2d"); bx.fillStyle = "#f8faff"; bx.fillRect(0, 0, 1600, 760); bx.fillStyle = "#8f9bb8"; bx.font = "600 96px Geist, sans-serif"; bx.fillText("f(x) = x²      f′(x) = 2x", 80, 200); bx.fillText("lím  (f(x+h) − f(x)) / h", 80, 360); bx.fillText("h → 0", 80, 520); const bt = new THREE.CanvasTexture(bc); bt.encoding = THREE.sRGBEncoding;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(190, 90), new THREE.MeshBasicMaterial({ map: bt })); board.position.set(-30, 70, -198); cls.add(board); const bfr = cast(new THREE.Mesh(new THREE.BoxGeometry(196, 96, 3), M(0xc9d1e0, 0.5))); bfr.position.set(-30, 70, -199.8); cls.add(bfr);
    const cwin = new THREE.Mesh(new THREE.PlaneGeometry(80, 110), new THREE.MeshBasicMaterial({ color: 0xd8ecff })); cwin.position.set(130, 80, -199); cls.add(cwin);
    const backC = new THREE.Mesh(new THREE.PlaneGeometry(900, 400), new THREE.MeshStandardMaterial({ color: 0xe6ebf3, roughness: 0.95 })); backC.position.set(0, 100, 190); backC.rotation.y = Math.PI; cls.add(backC);
    [[-120, 90, 70, 120], [10, 90, 70, 120], [140, 90, 70, 120]].forEach(([x, y, w, h]) => { const w2 = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0xd8ecff })); w2.position.set(x, y, 189); w2.rotation.y = Math.PI; cls.add(w2); const fr = new THREE.Mesh(new THREE.PlaneGeometry(w + 5, h + 5), new THREE.MeshBasicMaterial({ color: 0xffffff })); fr.position.set(x, y, 189.4); fr.rotation.y = Math.PI; cls.add(fr); });
    for (let i = 0; i < 6; i++) { const d2 = cast(new THREE.Mesh(new THREE.BoxGeometry(60, 3, 45), M(0xd9c3a5, 0.6))); d2.position.set(-150 + (i % 3) * 110, -2, -120 - Math.floor(i / 3) * 80); cls.add(d2); const lg = cast(new THREE.Mesh(new THREE.BoxGeometry(4, 72, 4), M(0x2a3042, 0.5, 0.3))); lg.position.set(d2.position.x, -38, d2.position.z); cls.add(lg); }
    // ---------- ESTUDIO (cierre de marca) ----------
    const studio = new THREE.Group(); studio.visible = false; scene.add(studio);
    { const bgC = mk(64, 512), bgx = bgC.getContext("2d"), bgg = bgx.createLinearGradient(0, 0, 0, 512); bgg.addColorStop(0, "#f6f9ff"); bgg.addColorStop(0.55, "#e3ebf8"); bgg.addColorStop(1, "#cfdcf1"); bgx.fillStyle = bgg; bgx.fillRect(0, 0, 64, 512); const bt = new THREE.CanvasTexture(bgC); bt.encoding = THREE.sRGBEncoding; const bgm = new THREE.Mesh(new THREE.PlaneGeometry(900, 520), new THREE.MeshBasicMaterial({ map: bt })); bgm.position.set(0, 120, -260); studio.add(bgm);
      const fl = cast(new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.MeshStandardMaterial({ color: 0xf3f6fc, roughness: 0.22, metalness: 0.0 }))); fl.rotation.x = -Math.PI / 2; fl.position.y = 0; studio.add(fl); }
    // estado de ánimo (luces/ambiente)
    function setMood(m) {
      hemi.intensity = m.hemi; hemi.color.setHex(m.hemiC || 0xdfe8ff); key.intensity = m.key; key.color.setHex(m.keyC || 0xfff2de); fill.intensity = m.fill; rim.intensity = m.rim; rim.color.setHex(m.rimC || 0xaec8ff); lamp.intensity = m.lamp || 0; scene.background.setHex(m.bg || 0x151a26);
      if (m.keyPos) key.position.set(...m.keyPos); key.target.position.set(0, 10, 20); win.material.color.setHex(m.win || 0xcfe6ff); wallM.color.setHex(m.wall || 0xe9edf5);
    }
    function setPlace(p) { decor.visible = p === "home"; cls.visible = p === "class"; studio.visible = p === "studio"; home.visible = p !== "studio"; }
    function clock(t) { const s = t % 60; clkS.rotation.z = -s / 60 * Math.PI * 2; clkM.rotation.z = -(((t / 60) % 60) / 60 + 0.5) * Math.PI * 2 + 0.2; clkH.rotation.z = -(10 / 12) * Math.PI * 2 - (t / 3600) * 0.3; }
    return { scene, home, decor, cls, studio, setMood, setPlace, clock, key, lamp, clockObjs: { clk, clkH, clkM, clkS }, M, cast, lampG, bulb };
  };
})(typeof window !== "undefined" ? window : globalThis);
