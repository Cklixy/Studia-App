/* Unidades y escala: 1 unidad de mundo = 1 cm. Todas las dimensiones salen de aquí. */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  C.SPEC = {
    // Teléfono GENÉRICO de 6,7" (no replica un modelo comercial concreto; ver CINE.md).
    phone: { W: 7.1, H: 14.7, D: 0.8, R: 1.0, bezel: 0.14, edge: 0.4,
      cam: { size: 3.1, x: 1.7, yFromTop: 1.9, bump: 0.14, lens: 0.95 } },
    // Mano adulta: muñeca→punta del dedo medio ≈ 19 cm, ancho de palma ≈ 8,2 cm.
    hand: {
      palmW: 8.2, palmL: 9.0, palmT: 2.4,
      fingers: [ // x en el borde de nudillos (+x = lado del pulgar), falanges y radio
        { name: "index",  x: 3.0,  L: [4.0, 2.4, 2.0], r: 0.90 },
        { name: "middle", x: 1.0,  L: [4.4, 2.7, 2.1], r: 0.92 },
        { name: "ring",   x: -1.0, L: [4.1, 2.5, 2.0], r: 0.88 },
        { name: "pinky",  x: -3.0, L: [3.2, 1.8, 1.8], r: 0.78 } ],
      thumb: { base: [3.9, 1.6, 2.6], L: [4.4, 3.2, 2.6], r: [1.05, 0.98, 0.9] },
      forearm: { len: 22, rWrist: 2.8, rElbow: 4.1 },
      sleeve: { from: 7, len: 24, r0: 4.5, r1: 5.2 }
    },
    desk: { size: 140 },
    // rangos físicamente creíbles para las comprobaciones automáticas
    ranges: { phoneW: [6.4, 8.1], phoneH: [13.5, 16.8], phoneD: [0.6, 1.0], aspect: [0.42, 0.52],
      handLen: [16.5, 21.5], palmW: [7.2, 9.5], screenAspectTol: 0.002 }
  };
  C.focalToFov = (f, sensorH) => (2 * Math.atan((sensorH || 36) / (2 * f)) * 180) / Math.PI; // vertical, formato vertical 24x36
  C.ease = {
    inOutCubic: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
    outQuint: (u) => 1 - Math.pow(1 - u, 5),
    inOutSine: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
    inQuad: (u) => u * u,
    outCubic: (u) => 1 - Math.pow(1 - u, 3),
    lin: (u) => u
  };
  C.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  C.lerp = (a, b, u) => a + (b - a) * u;
  C.deg = (d) => (d * Math.PI) / 180;
})(typeof window !== "undefined" ? window : globalThis);
