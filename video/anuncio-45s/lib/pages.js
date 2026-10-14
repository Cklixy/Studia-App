/* Páginas de la app dibujadas en canvas 1100x2326: feed, notificaciones, sesión, tutor y racha.
   Cada una es una función pura del estado => determinista. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  const F = "Geist, ui-sans-serif, system-ui, sans-serif";
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const bar = (c, time) => { c.fillStyle = "#14213D"; c.font = `650 46px ${F}`; c.textBaseline = "alphabetic"; c.fillText(time || "23:41", 92, 112); c.fillStyle = "#0b0d14"; rr(c, 410, 52, 280, 84, 42); c.fill(); c.fillStyle = "#14213D"; c.globalAlpha = 0.9; rr(c, 900, 76, 86, 40, 12); c.fill(); c.globalAlpha = 1; };
  const FLAME = (c, x, y, s, col) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col || "#C10A2B"; c.beginPath(); c.moveTo(0, -60); c.bezierCurveTo(30, -30, 52, -4, 52, 22); c.bezierCurveTo(52, 48, 28, 66, 0, 66); c.bezierCurveTo(-28, 66, -52, 48, -52, 22); c.bezierCurveTo(-52, 6, -40, -8, -30, -14); c.bezierCurveTo(-26, 2, -14, 10, -6, 6); c.bezierCurveTo(-18, -14, -14, -40, 0, -60); c.fill(); c.restore(); };
  const PAL = ["#FFD9DF", "#D9F2E6", "#FFE9C7", "#E3DCFF", "#CFE3FF", "#D2EEF7"];
  const NOTIF = [["C", "#0066CC", "Taller de cálculo", "Entrega hoy · 11:59 p. m."], ["H", "#4F46E5", "Ensayo de historia", "Entrega mañana"], ["F", "#0B7FB5", "Quiz de física", "En 2 días"], ["E", "#C10A2B", "Parcial de estadística", "En 5 días"], ["Q", "#B45309", "Informe de química", "Pendiente"]];

  C.drawFeed = function (c, s) {
    c.fillStyle = "#F1F3F8"; c.fillRect(0, 0, 1100, 2326);
    c.save(); c.beginPath(); c.rect(0, 170, 1100, 2156); c.clip(); c.translate(0, -s.scroll);
    for (let i = 0; i < 12; i++) { const y = 200 + i * 700; c.fillStyle = "#FFFFFF"; rr(c, 52, y, 996, 660, 64); c.fill(); c.fillStyle = "#D3D9E5"; c.beginPath(); c.arc(130, y + 90, 46, 0, 7); c.fill(); rr(c, 200, y + 56, 340, 28, 14); c.fill(); c.fillStyle = "#E4E8F0"; rr(c, 200, y + 104, 220, 22, 11); c.fill();
      const gr = c.createLinearGradient(80, y + 170, 1020, y + 480); gr.addColorStop(0, PAL[i % 6]); gr.addColorStop(1, "#FFFFFF"); c.fillStyle = gr; rr(c, 80, y + 170, 940, 340, 44); c.fill(); c.fillStyle = "#D3D9E5"; rr(c, 80, y + 550, 700, 28, 14); c.fill(); c.fillStyle = "#E4E8F0"; rr(c, 80, y + 596, 480, 22, 11); c.fill(); }
    c.restore();
    c.fillStyle = "#F1F3F8"; c.fillRect(0, 0, 1100, 170); bar(c, "23:41");
    if (s.dim > 0) { c.fillStyle = `rgba(30,38,56,${0.42 * s.dim})`; c.fillRect(0, 0, 1100, 2326); }
    NOTIF.forEach(([l, col, t, sub], i) => { const k = C.clamp(s.notif[i] || 0, 0, 1); if (k <= 0) return; const e = C.ease.outCubic(k), y = 230 + i * 250 - (1 - e) * 360;
      c.globalAlpha = Math.min(1, k * 2); c.save(); c.shadowColor = "rgba(20,33,61,0.25)"; c.shadowBlur = 50; c.shadowOffsetY = 18; c.fillStyle = "rgba(255,255,255,0.98)"; rr(c, 52, y, 996, 220, 70); c.fill(); c.restore();
      c.fillStyle = col; rr(c, 90, y + 40, 140, 140, 40); c.fill(); c.fillStyle = "#FFF"; c.font = `700 72px ${F}`; c.textAlign = "center"; c.fillText(l, 160, y + 130); c.textAlign = "left";
      c.fillStyle = "#14213D"; c.font = `650 58px ${F}`; c.fillText(t, 266, y + 105); c.fillStyle = "#5B6678"; c.font = `500 48px ${F}`; c.fillText(sub, 266, y + 170); c.globalAlpha = 1; });
    if (s.badge > 0) { const k = 1 + 0.18 * (1 - C.clamp(s.badgePop, 0, 1)); c.save(); c.translate(550, 1700); c.scale(k, k); c.shadowColor = "rgba(193,10,43,0.45)"; c.shadowBlur = 40; c.shadowOffsetY = 16; c.fillStyle = "#C10A2B"; rr(c, -300, -80, 600, 160, 80); c.fill(); c.restore(); c.fillStyle = "#FFF"; c.font = `700 72px ${F}`; c.textAlign = "center"; c.fillText(s.badge === 1 ? "1 pendiente" : s.badge + " pendientes", 550, 1724); c.textAlign = "left"; }
  };

  C.drawSesion = function (c, s) {
    c.fillStyle = "#F1F3F8"; c.fillRect(0, 0, 1100, 2326); bar(c, "7:30");
    c.fillStyle = "#636366"; c.font = `700 44px ${F}`; c.textAlign = "center"; c.fillText("Sesión de enfoque", 550, 300);
    c.save(); c.translate(550, 780); c.rotate(-Math.PI / 2); c.lineWidth = 56; c.lineCap = "round"; c.strokeStyle = "rgba(20,33,61,0.08)"; c.beginPath(); c.arc(0, 0, 300, 0, Math.PI * 2); c.stroke(); c.strokeStyle = "#0066CC"; c.beginPath(); c.arc(0, 0, 300, 0, Math.PI * 2 * (0.06 + 0.5 * C.clamp(s.arc, 0, 1))); c.stroke(); c.restore();
    c.fillStyle = "#14213D"; c.font = `700 170px ${F}`; c.fillText(s.t2 ? "18:38" : "18:42", 550, 820); c.fillStyle = "#636366"; c.font = `600 50px ${F}`; c.fillText("Enfocado", 550, 910); c.textAlign = "left";
    const k = C.ease.outCubic(C.clamp(s.card, 0, 1)); c.globalAlpha = k; const y = 1250 + (1 - k) * 80;
    c.save(); c.shadowColor = "rgba(20,33,61,0.16)"; c.shadowBlur = 60; c.shadowOffsetY = 20; c.fillStyle = "#FFF"; rr(c, 52, y, 996, 900, 64); c.fill(); c.restore();
    c.fillStyle = "#4F46E5"; c.font = `700 38px ${F}`; c.fillText("MÉTODO SUGERIDO POR IA", 112, y + 110); c.fillStyle = "#14213D"; c.font = `700 80px ${F}`; c.fillText("Active Recall +", 112, y + 220); c.fillText("Práctica Espaciada", 112, y + 310);
    c.fillStyle = "#4A5568"; c.font = `500 46px ${F}`; ["1. Examen de prueba sin apuntes", "2. Detecta tus lagunas", "3. Repasa y vuelve a evaluarte"].forEach((t, i) => c.fillText(t, 112, y + 420 + i * 70));
    [["Lluvia", 112, 230], ["Lo-fi", 366, 210], ["Spotify", 596, 260]].forEach(([t, x, w], i) => { const sel = i === 1 && s.pill > 0.5; c.fillStyle = sel ? "#0066CC" : "rgba(20,33,61,0.06)"; rr(c, x, y + 700, w, 110, 55); c.fill(); c.fillStyle = sel ? "#FFF" : "#4A5568"; c.font = `600 48px ${F}`; c.textAlign = "center"; c.fillText(t, x + w / 2, y + 772); c.textAlign = "left"; });
    c.globalAlpha = 1;
  };

  C.drawTutor = function (c, s) {
    c.fillStyle = "#F1F3F8"; c.fillRect(0, 0, 1100, 2326); bar(c, "7:30");
    c.fillStyle = "#FFF"; c.fillRect(0, 170, 1100, 200); c.fillStyle = "rgba(0,102,204,0.12)"; rr(c, 52, 210, 110, 110, 34); c.fill(); c.fillStyle = "#14213D"; c.font = `700 62px ${F}`; c.fillText("Tutor IA", 196, 270); c.fillStyle = "#636366"; c.font = `500 44px ${F}`; c.fillText("Derivadas", 196, 330);
    const bub = (txt, x, y, w, lines, mine, k) => { if (k <= 0) return; c.globalAlpha = C.clamp(k * 2, 0, 1); const dy = (1 - C.ease.outCubic(C.clamp(k, 0, 1))) * 30, h = 70 + lines.length * 64; c.fillStyle = mine ? "#0066CC" : "#E9E9EB"; rr(c, x, y + dy, w, h, 56); c.fill(); c.fillStyle = mine ? "#FFF" : "#14213D"; c.font = `500 54px ${F}`; lines.forEach((l, i) => c.fillText(l, x + 48, y + dy + 80 + i * 64)); c.globalAlpha = 1; };
    bub("", 250, 460, 800, ["¿Por qué la derivada es", "la pendiente de la", "tangente?"], true, s.bu);
    if (s.typing > 0 && s.bm <= 0) { c.globalAlpha = s.typing; c.fillStyle = "#E9E9EB"; rr(c, 52, 920, 260, 130, 60); c.fill(); for (let i = 0; i < 3; i++) { c.fillStyle = "#8A8A8E"; c.beginPath(); c.arc(116 + i * 54, 985 - Math.sin(s.dots * 6 + i * 0.8) * 8, 17, 0, 7); c.fill(); } c.globalAlpha = 1; }
    bub("", 52, 900, 900, ["La derivada mide cuánto cambia", "f cuando x cambia un poco. Eso es", "justo la inclinación de la recta", "tangente."], false, s.bm);
    if (s.chip > 0) { c.globalAlpha = s.chip; const pr = s.send > 0.5 ? 0.97 : 1; c.save(); c.translate(550, 1776); c.scale(pr, pr); c.fillStyle = "#FFF"; c.strokeStyle = s.send > 0.5 ? "#005BB8" : "#0066CC"; c.lineWidth = 8; rr(c, -452, -95, 904, 190, 95); c.fill(); c.stroke(); c.fillStyle = "#0066CC"; c.font = `600 50px ${F}`; c.textAlign = "center"; c.fillText("¿Por qué la derivada es la", 0, -10); c.fillText("pendiente de la tangente?", 0, 54); c.textAlign = "left"; c.restore(); c.globalAlpha = 1; }
    c.fillStyle = "rgba(20,33,61,0.06)"; rr(c, 52, 1960, 996, 160, 80); c.fill(); c.fillStyle = "#6E6E73"; c.font = `500 52px ${F}`; c.fillText("Pregunta lo que sea…", 110, 2058);
  };

  C.drawRacha = function (c, s) {
    c.fillStyle = "#F1F3F8"; c.fillRect(0, 0, 1100, 2326); bar(c, "7:30");
    c.fillStyle = "#636366"; c.font = `700 44px ${F}`; c.textAlign = "center"; c.fillText("Tu racha", 550, 300);
    FLAME(c, 550, 640, 2.4 * (1 + 0.16 * (1 - C.clamp(s.pop, 0, 1))), "#C10A2B");
    c.fillStyle = "#C10A2B"; c.font = `700 380px ${F}`; c.globalAlpha = s.seven ? C.clamp(s.pop * 1.5, 0.2, 1) : 1; c.fillText(s.seven ? "7" : "6", 550, 1230); c.globalAlpha = 1;
    c.fillStyle = "#4A5568"; c.font = `500 62px ${F}`; c.fillText("días de racha", 550, 1340);
    ["L", "M", "M", "J", "V", "S", "D"].forEach((l, i) => { const x = 110 + i * 130; c.fillStyle = "#5B6678"; c.font = `600 44px ${F}`; c.fillText(l, x + 40, 1500); const done = i < 6 || (s.seven && i === 6);
      c.fillStyle = done ? "rgba(193,10,43,0.10)" : "#FFF"; c.strokeStyle = done ? "rgba(193,10,43,0.28)" : "#0066CC"; c.lineWidth = done ? 4 : 10; c.beginPath(); c.arc(x + 40, 1590, 52, 0, 7); c.fill(); c.stroke(); if (done) FLAME(c, x + 40, 1590, 0.5 * (i === 6 ? C.clamp(s.pop, 0.1, 1) * 1.1 : 1), "#C10A2B"); });
    if (s.as > 0) { c.globalAlpha = C.clamp(s.as, 0, 1); c.fillStyle = "#047857"; c.font = `600 64px ${F}`; c.fillText("¡Racha asegurada por hoy!", 550, 1820); c.globalAlpha = 1; }
    c.textAlign = "left";
  };
  C.drawPage = function (c, s) { ({ feed: C.drawFeed, hoy: C.drawScreen, sesion: C.drawSesion, tutor: C.drawTutor, racha: C.drawRacha })[s.page](c, s); };
})(typeof window !== "undefined" ? window : globalThis);
