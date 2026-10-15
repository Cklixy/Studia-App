// Sintetiza los SFX (determinista) y mezcla con música CC0 (HoliznaCC0) con ffmpeg.
import { writeFileSync } from "node:fs"; import { execSync } from "node:child_process";
const SR = 44100, D = 45, N = SR * D, L = new Float32Array(N), R = new Float32Array(N);
let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const add = (t, f, pan = 0) => { const i0 = Math.floor(t * SR); for (let i = 0; ; i++) { const j = i0 + i; if (j >= N) break; const v = f(i / SR); if (v === null) break; L[j] += v * (1 - Math.max(0, pan)); R[j] += v * (1 + Math.min(0, pan)); } };
const env = (x, a, d) => (x < a ? x / a : Math.exp(-(x - a) / d));
const tick = (t, g = 0.5) => add(t, (x) => (x > 0.08 ? null : (rnd() * 0.6 + Math.sin(2 * Math.PI * 2400 * x)) * env(x, 0.0008, 0.012) * g));
const tap = (t, g = 0.5, f = 900) => add(t, (x) => (x > 0.15 ? null : Math.sin(2 * Math.PI * f * x * (1 - x * 2)) * env(x, 0.002, 0.03) * g));
const pencil = (t, g = 0.25) => add(t, (x) => (x > 0.09 ? null : rnd() * env(x, 0.001, 0.02) * g * Math.sin(Math.PI * Math.min(1, x / 0.09))));
const whoosh = (t, dur = 0.6, g = 0.5, up = true) => { let lp = 0; add(t, (x) => { if (x > dur) return null; const u = x / dur, e = Math.sin(Math.PI * u) ** 2, fc = up ? 0.02 + 0.5 * u : 0.5 - 0.48 * u; lp += fc * (rnd() - lp); return lp * e * g * 4; }); };
const chime = (t, notes, g = 0.3) => notes.forEach((f, k) => add(t + k * 0.09, (x) => (x > 1.6 ? null : (Math.sin(2 * Math.PI * f * x) + 0.4 * Math.sin(2 * Math.PI * f * 2.01 * x)) * env(x, 0.004, 0.35) * g)));
const thump = (t, g = 0.7) => add(t, (x) => (x > 0.6 ? null : Math.sin(2 * Math.PI * (55 + 80 * Math.exp(-x * 14)) * x * 1) * env(x, 0.003, 0.14) * g));
const pop = (t, g = 0.5) => add(t, (x) => (x > 0.3 ? null : Math.sin(2 * Math.PI * (300 + 500 * Math.exp(-x * 30)) * x) * env(x, 0.002, 0.05) * g));
const riser = (t, dur, g = 0.25) => { let lp = 0; add(t, (x) => { if (x > dur) return null; const u = x / dur; lp += (0.03 + 0.4 * u * u) * (rnd() - lp); return lp * u * u * g * 4; }); };
// Gancho
thump(0.0, 0.8); chime(0.35, [784, 1175, 1568], 0.22); whoosh(1.05, 0.5, 0.3, false);
// Conflicto: reloj de escritorio (1 tic/s) y golpecitos de lápiz
for (let s = 3.2; s < 8; s += 1) tick(s, 0.55);
for (let s = 3.3; s < 6; s += 0.9) { pencil(s, 0.3); pencil(s + 0.18, 0.25); }
whoosh(8.7, 0.5, 0.45);
// Descubrimiento: toques en la UI
tap(9.4, 0.5); tap(10.6, 0.5, 1100); tap(12.0, 0.45, 1300); chime(12.3, [880, 1318], 0.18); whoosh(13.9, 0.5, 0.4);
// Demostración
chime(15.2, [523, 784], 0.14); tap(16.0, 0.3, 1500); chime(18.5, [659, 880, 1175, 1568], 0.3); pop(14.35, 0.3); pop(17.75, 0.3); pop(20.95, 0.3); whoosh(22.9, 0.5, 0.4);
// Transformación: practicar (lápiz + ticks de progreso)
for (let s = 23.4; s < 29; s += 0.7) pencil(s, 0.22);
for (let s = 24; s < 29; s += 1.4) tap(s, 0.2, 1400); whoosh(29.7, 0.5, 0.4);
// Expectación: tensión y silencio antes de la revelación
riser(31.0, 6.0, 0.3); for (let s = 33; s < 37; s += 1) tick(s, 0.35); whoosh(34.2, 0.5, 0.25); thump(36.95, 0.5);
// Recompensa
thump(38.7, 0.9); chime(38.75, [784, 988, 1175, 1568, 1976], 0.35); whoosh(38.5, 0.3, 0.4);
// Cierre
pop(41.35, 0.5); chime(41.4, [659, 988, 1318], 0.25); pop(43.55, 0.4);
let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i])); const k = 0.9 / (pk || 1);
const buf = Buffer.alloc(44 + N * 4); buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * k)) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * k)) * 32767), 46 + i * 4); }
writeFileSync("audio/sfx.wav", buf);
const M = "../../public/audio/lofi/tokyo-sunset.m4a";
// música: más baja en la expectación (30–37 s), fade in/out
const vol = "volume='if(between(t,30,37.5),0.10,if(between(t,37.5,38.6),0.10+0.2*(t-37.5)/1.1,0.30))':eval=frame";
execSync(`ffmpeg -v error -y -i ${M} -i audio/sfx.wav -filter_complex "[0:a]atrim=0:45,asetpts=PTS-STARTPTS,${vol},afade=t=in:d=1.2,afade=t=out:st=43:d=2[m];[1:a]volume=0.9[s];[m][s]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95,atrim=0:45[o]" -map "[o]" -ar 44100 -c:a pcm_s16le audio/mix.wav`);
console.log("ok");
