/* Pantallas de studia+ para el celular. Los bloques son capturas reales de los componentes de la app
   (landing/Mockups.tsx renderizados con su CSS); la composición (cabecera, barra, navegación) es mía.
   Lienzo 1100x2326 = aspecto físico de la pantalla. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  const F = "Geist, ui-sans-serif, system-ui, sans-serif";
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const IMG = {}; const img = (n) => IMG[n] || (IMG[n] = document.getElementById("ui-" + n));
  const BG = "#F4F6FB";
  function status(c, time) { c.fillStyle = "#14213D"; c.font = `650 46px ${F}`; c.textBaseline = "alphabetic"; c.textAlign = "left"; c.fillText(time || "9:41", 92, 112); c.fillStyle = "#0b0d14"; rr(c, 410, 52, 280, 84, 42); c.fill(); c.fillStyle = "#14213D"; c.globalAlpha = 0.9; rr(c, 900, 76, 86, 40, 12); c.fill(); c.globalAlpha = 1; }
  function nav(c, active) { c.fillStyle = "rgba(255,255,255,0.92)"; c.fillRect(0, 2140, 1100, 186); c.fillStyle = "rgba(20,33,61,0.07)"; c.fillRect(0, 2140, 1100, 2); const ic = ["Inicio", "Materias", "Sesión", "Logros"]; ic.forEach((t, i) => { const x = 137 + i * 275; const on = i === active; c.fillStyle = on ? "#0066CC" : "#8A93A6"; rr(c, x - 34, 2170, 68, 68, 20); c.globalAlpha = on ? 0.14 : 0.0; c.fill(); c.globalAlpha = 1; c.beginPath(); c.arc(x, 2204, 16, 0, 7); c.fill(); c.font = `600 34px ${F}`; c.textAlign = "center"; c.fillText(t, x, 2282); }); c.textAlign = "left"; c.fillStyle = "#14213D"; c.globalAlpha = 0.5; rr(c, 400, 2300, 300, 12, 6); c.fill(); c.globalAlpha = 1; }
  function card(c, im, x, y, w, crop) { const I = img(im); if (!I || !I.naturalWidth) return 0; const sw = I.naturalWidth, sh = crop ? crop : I.naturalHeight, h = sh * (w / sw); c.save(); c.shadowColor = "rgba(20,33,61,0.10)"; c.shadowBlur = 40; c.shadowOffsetY = 14; c.drawImage(I, 0, 0, sw, sh, x, y, w, h); c.restore(); return h; }
  const SCREENS = {
    home(c, s) { c.fillStyle = BG; c.fillRect(0, 0, 1100, 2326); status(c); c.fillStyle = "#636366"; c.font = `600 44px ${F}`; c.fillText("Buenas noches", 64, 250); c.fillStyle = "#14213D"; c.font = `700 84px ${F}`; c.fillText("Hola, Daniel", 64, 340);
      card(c, "habitos", 45, 400, 1010, 470); card(c, "parahoy", 45, 1180, 1010); nav(c, 0); },
    materias(c, s) { c.fillStyle = BG; c.fillRect(0, 0, 1100, 2326); status(c); c.fillStyle = "#14213D"; c.font = `700 84px ${F}`; c.fillText("Mis materias", 64, 300); c.fillStyle = "#636366"; c.font = `500 46px ${F}`; c.fillText("Elige con cuál quieres empezar", 64, 372);
      [["Química orgánica", "7 temas", "#C10A2B", 1040], ["Física II", "9 temas", "#4F46E5", 1290], ["Cálculo I", "8 temas · Parcial en 6 días", "#0066CC", 1776 - 110]].forEach(([n, d, col, y], i) => { const sel = i === 2 && s.press > 0.5; c.save(); c.shadowColor = "rgba(20,33,61,0.12)"; c.shadowBlur = 40; c.shadowOffsetY = 14; c.fillStyle = sel ? "#EAF3FF" : "#FFFFFF"; rr(c, 52, y, 996, 220, 64); c.fill(); c.restore(); if (sel) { c.strokeStyle = "#0066CC"; c.lineWidth = 6; rr(c, 52, y, 996, 220, 64); c.stroke(); } c.fillStyle = col; rr(c, 100, y + 56, 108, 108, 34); c.fill(); c.fillStyle = "#14213D"; c.font = `700 62px ${F}`; c.fillText(n, 246, y + 108); c.fillStyle = "#636366"; c.font = `500 44px ${F}`; c.fillText(d, 246, y + 168); });
      nav(c, 1); },
    ruta(c, s) { c.fillStyle = BG; c.fillRect(0, 0, 1100, 2326); status(c); c.fillStyle = "#636366"; c.font = `600 44px ${F}`; c.fillText("Cálculo I", 64, 250); c.fillStyle = "#14213D"; c.font = `700 84px ${F}`; c.fillText("Elige un tema", 64, 340);
      const h = card(c, "ruta", 45, 1100, 1010); if (s.press > 0.5) { c.save(); c.fillStyle = "rgba(0,102,204,0.10)"; rr(c, 60, 1650, 980, 190, 40); c.fill(); c.restore(); } nav(c, 1); },
    foco(c, s) { c.fillStyle = BG; c.fillRect(0, 0, 1100, 2326); status(c); card(c, "enfoque", 45, 380, 1010); nav(c, 2); },
    metodo(c, s) { c.fillStyle = BG; c.fillRect(0, 0, 1100, 2326); status(c); c.fillStyle = "#14213D"; c.font = `700 84px ${F}`; c.fillText("Tu método", 64, 320); card(c, "metodo", 45, 1280, 1010); nav(c, 2); },
    tutor(c, s) { c.fillStyle = BG; c.fillRect(0, 0, 1100, 2326); status(c); c.fillStyle = "#14213D"; c.font = `700 84px ${F}`; c.fillText("Tutor IA", 64, 320); card(c, "tutor", 45, 1230, 1010); nav(c, 2); },
    notas(c, s) { c.fillStyle = BG; c.fillRect(0, 0, 1100, 2326); status(c); c.fillStyle = "#14213D"; c.font = `700 84px ${F}`; c.fillText("Tus notas", 64, 320); card(c, "notas", 45, 1300, 1010); card(c, "habitos", 45, 380, 1010, 470); nav(c, 3); },
    habitos(c, s) { c.fillStyle = BG; c.fillRect(0, 0, 1100, 2326); status(c); c.fillStyle = "#14213D"; c.font = `700 84px ${F}`; c.fillText("Tu progreso", 64, 320); card(c, "habitos", 45, 760, 1010); nav(c, 3); }
  };
  C.drawPhoneScreen = function (c, s) {
    // s: { screen, from, k (0..1 transición), press }
    const k = C.clamp(s.k == null ? 1 : s.k, 0, 1), e = C.ease.inOutCubic(k);
    if (s.from && k < 1) { c.save(); c.translate(-1100 * e, 0); SCREENS[s.from](c, { press: 0 }); c.restore(); c.save(); c.translate(1100 * (1 - e), 0); SCREENS[s.screen](c, s); c.restore(); }
    else SCREENS[s.screen](c, s);
    if (s.ripple != null && s.ripple >= 0 && s.ripple < 1) { c.save(); c.fillStyle = `rgba(0,102,204,${0.22 * (1 - s.ripple)})`; c.beginPath(); c.arc(s.rx, s.ry, 30 + 260 * s.ripple, 0, 7); c.fill(); c.restore(); }
  };
})(typeof window !== "undefined" ? window : globalThis);
