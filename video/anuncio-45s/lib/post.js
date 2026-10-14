/* Postproceso propio (sin dependencias): MSAA + profundidad de campo con bokeh por lente real +
   corrección de color cinematográfica + viñeta + grano determinista.  */
(function (g) {
  const C = (g.Cine = g.Cine || {});
  C.createPost = function (THREE, renderer, W, H) {
    const colorRT = new THREE.WebGLRenderTarget(W, H, { samples: 4, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true });
    const depthRT = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
    const hw = Math.ceil(W / 2), hh = Math.ceil(H / 2);
    const blurRT = new THREE.WebGLRenderTarget(hw, hh, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    const depthMat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), qs = new THREE.Scene(), qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); qs.add(quad);
    const common = `
      #include <packing>
      uniform sampler2D tColor; uniform sampler2D tDepth; uniform vec2 uSize; uniform float uNear; uniform float uFar; uniform float uFocus; uniform float uA; uniform float uMaxR;
      varying vec2 vUv;
      float distAt(vec2 uv){ float d = unpackRGBAToDepth(texture2D(tDepth, uv)); float vz = perspectiveDepthToViewZ(d, uNear, uFar); return -vz; }
      float cocAt(vec2 uv){ float z = max(distAt(uv), 1.0); return min(uA * abs(1.0/uFocus - 1.0/z), uMaxR); }`;
    const vs = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const U = () => ({ tColor: { value: colorRT.texture }, tDepth: { value: depthRT.texture }, uSize: { value: new THREE.Vector2(W, H) }, uNear: { value: 0.4 }, uFar: { value: 500 }, uFocus: { value: 60 }, uA: { value: 3000 }, uMaxR: { value: 22 } });
    const blurMat = new THREE.ShaderMaterial({ uniforms: U(), vertexShader: vs, depthTest: false, depthWrite: false, fragmentShader: common + `
      void main(){
        float R = cocAt(vUv); vec4 acc = texture2D(tColor, vUv); float wsum = 1.0;
        if (R > 0.6) {
          for (int i = 1; i <= 28; i++) {
            float fi = float(i); float a = fi * 2.39996323; float r = sqrt(fi / 28.0) * R;
            vec2 off = vec2(cos(a), sin(a)) * r / uSize; vec2 uv = vUv + off;
            float tc = cocAt(uv); float w = clamp(tc / max(r, 0.8), 0.0, 1.0);
            acc += texture2D(tColor, uv) * w; wsum += w;
          }
        }
        gl_FragColor = vec4(acc.rgb / wsum, 1.0);
      }` });
    const compMat = new THREE.ShaderMaterial({ uniforms: Object.assign(U(), { tBlur: { value: blurRT.texture }, uExposure: { value: 1.0 }, uContrast: { value: 1.08 }, uSat: { value: 1.05 }, uVig: { value: 0.28 }, uGrain: { value: 0.012 }, uSeed: { value: 0 }, uTint: { value: new THREE.Vector3(1, 1, 1) }, uLift: { value: new THREE.Vector3(0, 0, 0) } }), vertexShader: vs, depthTest: false, depthWrite: false, fragmentShader: common + `
      uniform sampler2D tBlur; uniform float uExposure; uniform float uContrast; uniform float uSat; uniform float uVig; uniform float uGrain; uniform float uSeed; uniform vec3 uTint; uniform vec3 uLift;
      vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uSeed*7.13) * 43758.5453); }
      void main(){
        vec3 sharp = texture2D(tColor, vUv).rgb; vec3 blur = texture2D(tBlur, vUv).rgb; float c = cocAt(vUv);
        vec3 col = mix(sharp, blur, smoothstep(0.4, 3.5, c));
        col *= uExposure * uTint; col += uLift;
        col = mix(col, aces(col), 0.55);
        float l = dot(col, vec3(0.2126,0.7152,0.0722)); col = mix(vec3(l), col, uSat);
        col = (col - 0.5) * uContrast + 0.5;
        vec2 q = vUv - 0.5; float v = 1.0 - uVig * smoothstep(0.25, 0.95, length(q * vec2(1.15, 1.0)) * 1.5); col *= v;
        col += (hash(vUv * uSize) - 0.5) * uGrain;
        col = pow(clamp(col, 0.0, 1.0), vec3(1.0/2.2));
        gl_FragColor = vec4(col, 1.0);
      }` });
    const flagged = [];
    function render(scene, cam, o) {
      o = o || {};
      const N = o.fstop || 2.8, f = o.focal || 50, A = (f * f / N) * 4.5 * (o.dofScale == null ? 1 : o.dofScale); // px·cm
      const focus = Math.max(o.focus || 60, 5);
      for (const m of [blurMat, compMat]) { const u = m.uniforms; u.uNear.value = cam.near; u.uFar.value = cam.far; u.uFocus.value = focus; u.uA.value = A; u.uMaxR.value = o.maxR || 22; }
      const u = compMat.uniforms; u.uExposure.value = o.exposure == null ? 1 : o.exposure; u.uContrast.value = o.contrast == null ? 1.08 : o.contrast; u.uSat.value = o.sat == null ? 1.05 : o.sat; u.uVig.value = o.vig == null ? 0.28 : o.vig; u.uGrain.value = o.grain == null ? 0.012 : o.grain; u.uSeed.value = (o.seed || 0) % 1000;
      if (o.tint) u.uTint.value.set(...o.tint); else u.uTint.value.set(1, 1, 1); if (o.lift) u.uLift.value.set(...o.lift); else u.uLift.value.set(0, 0, 0);
      // 1) color (MSAA)
      renderer.setRenderTarget(colorRT); renderer.setClearColor(scene.background || 0x000000, 1); renderer.clear(); renderer.render(scene, cam);
      // 2) profundidad empaquetada (sin transparentes ni etiquetas noDepth)
      flagged.length = 0; scene.traverse((m) => { if (m.userData && m.userData.noDepth && m.visible) { m.visible = false; flagged.push(m); } });
      const bg = scene.background; scene.background = null; scene.overrideMaterial = depthMat; renderer.setRenderTarget(depthRT); renderer.setClearColor(0xffffff, 1); renderer.clear(); renderer.render(scene, cam);
      scene.overrideMaterial = null; scene.background = bg; flagged.forEach((m) => (m.visible = true));
      // 3) bokeh a media resolución y 4) composición final
      quad.material = blurMat; renderer.setRenderTarget(blurRT); renderer.render(qs, qc);
      quad.material = compMat; renderer.setRenderTarget(null); renderer.render(qs, qc);
    }
    return { render, colorRT, depthRT };
  };
})(typeof window !== "undefined" ? window : globalThis);
