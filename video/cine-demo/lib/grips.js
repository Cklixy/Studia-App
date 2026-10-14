/* Agarre de mano derecha: palma tras el teléfono, dedos rodeando el borde izquierdo, pulgar sobre la pantalla.
   Los ángulos se generan con tests/solve_grips.mjs (IK por búsqueda + penalización de penetración). */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  // Colocación de la mano en el marco del teléfono (muñeca abajo-derecha, dedos hacia arriba-izquierda, palma sobre el dorso)
  C.GRIP_PLACEMENT = { wrist: [7.0, -7.2, -1.62], basis: [[0.57358, 0.81915, 0], [-0.81915, 0.57358, 0], [0, 0, 1]] }; // mano girada 35° sobre el eje z del teléfono
  C.placeHand = function (THREE, handRoot) {
    const b = C.GRIP_PLACEMENT.basis, m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...b[0]), new THREE.Vector3(...b[1]), new THREE.Vector3(...b[2]));
    handRoot.quaternion.setFromRotationMatrix(m); handRoot.position.set(...C.GRIP_PLACEMENT.wrist);
  };
  C.GRIP = null; // se rellena abajo si existe el resultado del solver
})(typeof window !== "undefined" ? window : globalThis);
