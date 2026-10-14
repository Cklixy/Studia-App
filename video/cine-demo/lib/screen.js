/* Contenido de pantalla: se dibuja en un canvas 1100x2326 (misma relación de aspecto que la pantalla física)
   y se aplica como textura con UV 0..1. Función pura de un estado => sin parpadeos. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  C.SCREEN_PX = { w: 1100, h: 2326 };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  C.drawScreen = function (c, s) {
    const W = 1100, H = 2326, F = "Geist, ui-sans-serif, system-ui, sans-serif";
    c.clearRect(0, 0, W, H); c.fillStyle = "#F1F3F8"; c.fillRect(0, 0, W, H);
    // barra de estado + isla dinámica (dentro del área de pantalla)
    c.fillStyle = "#14213D"; c.font = `650 46px ${F}`; c.textBaseline = "alphabetic"; c.fillText("7:30", 92, 112);
    c.fillStyle = "#0b0d14"; rr(c, 410, 52, 280, 84, 42); c.fill();
    c.fillStyle = "#14213D"; rr(c, 900, 76, 86, 40, 12); c.globalAlpha = 0.9; c.fill(); c.globalAlpha = 1;
    // encabezado
    const k = C.ease.outCubic(C.clamp(s.intro, 0, 1));
    c.globalAlpha = k; c.fillStyle = "#0066CC"; c.font = `700 36px ${F}`; c.fillText("HOY", 72, 250 + (1 - k) * 30);
    c.fillStyle = "#14213D"; c.font = `700 84px ${F}`; c.fillText("Buenas noches", 72, 340 + (1 - k) * 30); c.globalAlpha = 1;
    // tarjeta principal
    const cy = 420 + (1 - k) * 70; c.globalAlpha = k;
    c.save(); c.shadowColor = "rgba(20,33,61,0.16)"; c.shadowBlur = 60; c.shadowOffsetY = 20; c.fillStyle = "#FFFFFF"; rr(c, 52, cy, 996, 1040, 64); c.fill(); c.restore();
    c.fillStyle = "#0066CC"; c.font = `700 34px ${F}`; c.fillText("PARA HOY", 112, cy + 108);
    c.fillStyle = "#14213D"; c.font = `700 88px ${F}`;
    ["Derivadas e", "interpretación", "geométrica"].forEach((t, i) => c.fillText(t, 112, cy + 224 + i * 100));
    c.fillStyle = "#636366"; c.font = `500 46px ${F}`; c.fillText("Cálculo diferencial", 112, cy + 560);
    c.fillStyle = "#14213D"; c.font = `600 52px ${F}`; c.fillText("Faltan 5 días para tu parcial", 112, cy + 650);
    c.fillStyle = "#636366"; c.font = `500 38px ${F}`; c.fillText("4 de 12 temas", 112, cy + 790);
    c.textAlign = "right"; c.fillStyle = "#14213D"; c.font = `650 38px ${F}`; c.fillText("33 %", 988, cy + 790); c.textAlign = "left";
    c.fillStyle = "rgba(20,33,61,0.08)"; rr(c, 112, cy + 830, 876, 24, 12); c.fill();
    c.fillStyle = "#0066CC"; rr(c, 112, cy + 830, Math.max(24, 292 * C.clamp(s.fill, 0, 1) + 24), 24, 12); c.fill();
    c.fillStyle = "#4F46E5"; c.font = `700 32px ${F}`; c.fillText("MÉTODO SUGERIDO POR IA", 112, cy + 920);
    c.fillStyle = "#14213D"; c.font = `650 48px ${F}`; c.fillText("Active Recall + Práctica Espaciada", 112, cy + 985); c.globalAlpha = 1;
    // racha
    c.fillStyle = "#FFFFFF"; c.globalAlpha = 0.9 * k; rr(c, 52, 1490, 996, 140, 48); c.fill(); c.globalAlpha = k;
    c.fillStyle = "#C10A2B"; c.beginPath(); c.arc(150, 1560, 34, 0, 7); c.globalAlpha = 0.12 * k; c.fill(); c.globalAlpha = k;
    c.fillStyle = "#C10A2B"; c.font = `700 56px ${F}`; c.fillText("6", 270, 1577); c.fillStyle = "#4A5568"; c.font = `500 44px ${F}`; c.fillText("días de racha", 330, 1575); c.globalAlpha = 1;
    // botón inferior (zona alcanzable por el pulgar): centro donde alcanza el pulgar (y=-3.8 cm → v≈0.236)
    const press = C.clamp(s.press, 0, 1), bw = 904 - press * 24, bh = 188 - press * 14, bx = 550 - bw / 2, by = 1776 - bh / 2;
    c.save(); c.shadowColor = "rgba(0,102,204,0.40)"; c.shadowBlur = 50 * (1 - press * 0.5); c.shadowOffsetY = 22 * (1 - press); c.fillStyle = press > 0.5 ? "#005BB8" : "#0066CC"; rr(c, bx, by, bw, bh, 94); c.fill(); c.restore();
    c.fillStyle = "#FFFFFF"; c.font = `650 62px ${F}`; c.textAlign = "center"; c.fillText("Estudiar ahora", 550, 1796); c.textAlign = "left";
    if (s.ripple > 0 && s.ripple < 1) { c.save(); rr(c, bx, by, bw, bh, 94); c.clip(); c.fillStyle = `rgba(255,255,255,${0.5 * (1 - s.ripple)})`; c.beginPath(); c.arc(s.rx, s.ry, 40 + 360 * s.ripple, 0, 7); c.fill(); c.restore(); }
    // indicador de inicio
    c.fillStyle = "#14213D"; c.globalAlpha = 0.5; rr(c, 400, 2272, 300, 12, 6); c.fill(); c.globalAlpha = 1;
  };
  // conversión coordenada física (cm, local del teléfono) -> píxel de la textura
  C.screenCmToPx = function (x, y) { const P = C.SPEC.phone, sw = P.W - 2 * P.bezel, sh = P.H - 2 * P.bezel; return [((x + sw / 2) / sw) * 1100, (1 - (y + sh / 2) / sh) * 2326]; };
})(typeof window !== "undefined" ? window : globalThis);
