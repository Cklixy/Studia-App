/* Biblioteca de movimiento de cámara. Cada plano = claves (posición, objetivo, focal) interpoladas con
   Catmull-Rom (trayectorias curvas, no lineales) y una curva de velocidad propia. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  function cr(p0, p1, p2, p3, u) { const u2 = u * u, u3 = u2 * u; return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); }
  function seg(keys, u, get) { // u 0..1 sobre claves equiespaciadas
    const n = keys.length - 1, x = C.clamp(u, 0, 1) * n, i = Math.min(Math.floor(x), n - 1), f = x - i;
    const k = (j) => keys[C.clamp(j, 0, n)];
    return get(k(i - 1), k(i), k(i + 1), k(i + 2), f);
  }
  C.camPath = function (keys, u, easeName) {
    const e = (C.ease[easeName] || C.ease.inOutSine)(C.clamp(u, 0, 1));
    const v3 = (key) => (a, b, c, d, f) => b[key].map((_, ax) => cr(a[key][ax], b[key][ax], c[key][ax], d[key][ax], f));
    return { pos: seg(keys, e, v3("pos")), tgt: seg(keys, e, v3("tgt")), f: seg(keys, e, (a, b, c, d, f) => cr(a.f, b.f, c.f, d.f, f)), roll: seg(keys, e, (a, b, c, d, f) => cr(a.roll || 0, b.roll || 0, c.roll || 0, d.roll || 0, f)) };
  };
  // órbita parcial con cambio de altura: centro, radio, azimut, elevación (grados)
  C.orbit = function (centre, r0, r1, az0, az1, el0, el1, f0, f1, u, easeName, rollDeg) {
    const e = (C.ease[easeName] || C.ease.inOutSine)(C.clamp(u, 0, 1)), L = C.lerp, d = C.deg;
    const r = L(r0, r1, e), az = d(L(az0, az1, e)), el = d(L(el0, el1, e));
    return { pos: [centre[0] + r * Math.sin(az) * Math.cos(el), centre[1] + r * Math.sin(el), centre[2] + r * Math.cos(az) * Math.cos(el)], tgt: centre.slice(), f: L(f0, f1, e), roll: (rollDeg || 0) * e };
  };
  // ligera deriva de cámara en mano, determinista (sin Math.random)
  C.drift = (t, a) => [Math.sin(t * 1.3) * a, Math.sin(t * 1.9 + 1) * a * 0.7, Math.sin(t * 1.1 + 2) * a * 0.5];
})(typeof window !== "undefined" ? window : globalThis);
