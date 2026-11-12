// @ts-nocheck
// "When your crush catches you staring": hook whole image + cut-out hallway animation + peak whole image + abrupt twist.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from '../public/crush/meta.json';
import caps from './crushCaps.json';

export const CRUSH_TOTAL = 36.95;
const W = 1080, H = 1920;
const FEET = 1250;
const INK = '#141414';
const TR = 0.4;
const T_PEAK = 31.15, T_TWIST = 33.14;
const BOUNDS = [0, 3.9, 7.75, 14.6, 23.95, T_PEAK]; // slide shots; peak and twist are hard cuts

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

type Item = {s: string; x: number; y?: number; r?: number; h?: number; t0?: number; t1?: number; poses?: [number, string, number?][]; rot?: number; enter?: string; flip?: boolean; dx?: number; dy?: number; sc0?: number; sc1?: number; shake?: number; nobob?: boolean; tremble?: [number, number]};

const Sprite: React.FC<{it: Item; t: number}> = ({it, t}) => {
  const t0 = it.t0 ?? 0;
  if (t < t0 || (it.t1 !== undefined && t > it.t1)) return null;
  const lt = t - t0;
  let name = it.s, swapT = -9, xo = it.x;
  if (it.poses) for (const [pt, pn, px] of it.poses) if (t >= pt) { name = pn; swapT = pt; if (px !== undefined) xo = px; }
  const m = meta[name];
  const sc0 = it.r ? (it.r * 1.2) / m.head[2] : it.h ? it.h / m.h : 1;
  const w = m.w * sc0, h = m.h * sc0, fx = m.feet[0] * sc0;
  const dur = (it.t1 ?? t0 + 3) - t0;
  const dxp = (it.dx ?? 0) * eio(lt / dur), dyp = (it.dy ?? 0) * clamp(lt / dur);
  let ex = 0, ey = 0, es = 1;
  const eu = clamp(lt / (it.enter === 'pop' ? 0.35 : 0.6));
  if (it.enter === 'pop') es = eu <= 0 ? 0 : eu >= 1 ? 1 : 1 - Math.pow(1 - eu, 3) * Math.cos(eu * 9) * 0.9;
  else if (it.enter === 'left') ex = -(1 - eo(eu)) * (it.x + w + 100);
  else if (it.enter === 'right') ex = (1 - eo(eu)) * (W - it.x + w + 100);
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const scl = lerp(it.sc0 ?? 1, it.sc1 ?? it.sc0 ?? 1, clamp(lt / dur));
  const sx = (1 - 0.12 * k) * es * scl, sy = (1 + 0.12 * k) * es * scl;
  const bob = it.r && !it.nobob ? Math.sin(lt * 2.4) * 3 : 0;
  const trem = it.tremble ? (it.tremble[0] + (it.tremble[1] - it.tremble[0]) * clamp(lt / dur)) : 0;
  const shx = trem * Math.sin(t * 90), shy = trem * 0.6 * Math.cos(t * 77);
  const x = xo + dxp + ex + shx, y = (it.y ?? FEET) + dyp + ey + bob + shy;
  const rot = (it.rot ?? 0);
  return (
    <>
      {it.r && <div style={{position: 'absolute', left: x - w * 0.3, top: (it.y ?? FEET) - 16, width: w * 0.6, height: 30, borderRadius: '50%', background: 'rgba(30,30,60,0.22)'}} />}
      <div style={{position: 'absolute', left: x - fx, top: y - h, width: w, height: h, transformOrigin: `${fx}px ${h}px`, transform: `${it.flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx},${sy})`}}>
        <Img src={staticFile(`crush/sp/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

const Label: React.FC<{text: string; x: number; y: number; t: number; t0: number; t1?: number; size?: number; color?: string; rot?: number}> = ({text, x, y, t, t0, t1, size = 110, color = '#ffffff', rot = 0}) => {
  const lt = t - t0;
  if (lt < 0 || (t1 !== undefined && t > t1)) return null;
  const u = clamp(lt / 0.35);
  const s = 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: size, color, WebkitTextStroke: `${size * 0.13}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', letterSpacing: 2}}>{text}</div>;
};

const Sweat: React.FC<{x: number; y: number; t: number; t0: number; size?: number; period?: number}> = ({x, y, t, t0, size = 46, period = 1.1}) => {
  if (t < t0) return null;
  const u = ((t - t0) % period) / period;
  const s = size * (0.5 + 0.5 * clamp(u / 0.3));
  return <svg style={{position: 'absolute', left: x - s / 2, top: y + u * 90, opacity: 1 - Math.pow(u, 3)}} width={s} height={s * 1.4} viewBox="0 0 40 56"><path d="M20,3 C20,3 4,26 4,38 A16,16 0 0 0 36,38 C36,26 20,3 20,3 Z" fill="#6fd0ff" stroke={INK} strokeWidth={4} /></svg>;
};

const Sparkle: React.FC<{x: number; y: number; t: number; t0: number; size?: number}> = ({x, y, t, t0, size = 70}) => {
  const lt = t - t0; if (lt < 0) return null;
  const s = size * (0.7 + 0.3 * Math.sin(lt * 9)) * eo(lt / 0.3);
  return <svg style={{position: 'absolute', left: x - s / 2, top: y - s / 2}} width={s} height={s} viewBox="-50 -50 100 100"><path d="M0,-48 Q4,-4 48,0 Q4,4 0,48 Q-4,4 -48,0 Q-4,-4 0,-48 Z" fill="#fff" stroke={INK} strokeWidth={5} /></svg>;
};

// ------- hallway (code-drawn school hallway, matches the hook art) -------
const Hallway: React.FC<{tint?: number}> = ({tint = 0}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 560, background: 'linear-gradient(#d9f2f0, #a8e0d6)'}} />
    {[120, 560].map((x, i) => <div key={i} style={{position: 'absolute', left: x, top: 40, width: 260, height: 70, background: '#fff', border: `6px solid ${INK}`, borderRadius: 10, boxShadow: '0 0 60px #fff'}} />)}
    <div style={{position: 'absolute', left: 860, top: 40, width: 260, height: 70, background: '#fff', border: `6px solid ${INK}`, borderRadius: 10}} />
    {/* lockers */}
    <div style={{position: 'absolute', left: 0, top: 560, width: W, height: FEET - 560, background: '#2f63cf'}} />
    {Array.from({length: 9}, (_, i) => (
      <div key={i} style={{position: 'absolute', left: i * 132 - 20, top: 590, width: 128, height: FEET - 640, background: i % 2 ? '#3a73e0' : '#2f63cf', border: `6px solid ${INK}`, borderRadius: 8}}>
        {[0, 1, 2, 3].map((j) => <div key={j} style={{position: 'absolute', left: 30, top: 24 + j * 14, width: 68, height: 6, background: INK, opacity: 0.55, borderRadius: 3}} />)}
        <div style={{position: 'absolute', right: 18, top: 380, width: 10, height: 60, background: '#c9d3e6', border: `3px solid ${INK}`, borderRadius: 5}} />
      </div>
    ))}
    <div style={{position: 'absolute', left: 0, top: FEET - 16, width: W, height: 20, background: '#7b5a3a', borderTop: `6px solid ${INK}`}} />
    {/* floor */}
    <div style={{position: 'absolute', left: 0, top: FEET, width: W, height: H - FEET, background: 'linear-gradient(#e8d9c2, #cdb99a)'}} />
    <svg style={{position: 'absolute', left: 0, top: FEET}} width={W} height={H - FEET}>
      {Array.from({length: 7}, (_, i) => <line key={i} x1={0} x2={W} y1={40 + i * i * 14 + i * 20} y2={40 + i * i * 14 + i * 20} stroke="#a58d68" strokeWidth={4} />)}
      {Array.from({length: 9}, (_, i) => <line key={'v' + i} x1={i * 135} x2={540 + (i - 4) * 260} y1={0} y2={H - FEET} stroke="#a58d68" strokeWidth={4} />)}
    </svg>
    {tint > 0 && <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 55%, rgba(255,60,0,0), rgba(255,40,0,0.85))', opacity: tint}} />}
  </>
);

// ------- whole images with focus crop (objectViewBox, never a big scaled element) -------
const Whole: React.FC<{src: string; z: number; fx: number; fy: number; shake?: number; t?: number}> = ({src, z, fx, fy, shake = 0, t = 0}) => {
  const vw = 1 / z, vh = 1 / z;
  let l = clamp(fx - vw / 2, 0, 1 - vw), tp = clamp(fy - vh / 2, 0, 1 - vh);
  const pc = (v: number) => `${(v * 100).toFixed(4)}%`;
  return <Img src={staticFile(src)} style={{position: 'absolute', left: shake * Math.sin(t * 110), top: shake * 0.7 * Math.cos(t * 95), width: W, height: H, objectViewBox: `inset(${pc(tp)} ${pc(1 - l - vw)} ${pc(1 - tp - vh)} ${pc(l)})`}} />;
};

const HookShot: React.FC<{t: number}> = ({t}) => {
  const z = lerp(1.0, 1.1, eio(t / 3.9));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#123'}}>
      <Whole src="crush/whole_hook.png" z={z} fx={0.5} fy={0.5 - 0.02 * eio(t / 3.9)} />
      <Label text="YOU" x={HOOK.youX} y={HOOK.youY} t={t} t0={0} size={115} color="#ffffff" rot={-4} />
      <Label text="CRUSH" x={HOOK.crX} y={HOOK.crY} t={t} t0={0.12} size={115} color="#ff5aa8" rot={4} />
    </AbsoluteFill>
  );
};
const HOOK = {youX: 300, youY: 215, crX: 800, crY: 120};

const ShotB: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Hallway />
    <Sprite it={{s: 'mr_deadpan', x: 540, r: 105, t0: 0, enter: 'pop', tremble: [1, 5], t1: 9}} t={t} />
    {[0.8, 1.5, 2.2].map((t0, i) => <Sweat key={i} x={[355, 725, 365][i]} y={FEET - 780} t={t} t0={t0} />)}
    <Label text="!!!" x={820} y={FEET - 900} t={t} t0={1.0} size={150} color="#ff3b3b" rot={8} />
  </AbsoluteFill>
);

const ShotC: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Hallway />
    <Sprite it={{s: 'mr_deadpan', x: 520, r: 105, t0: 0, poses: [[1.2, 'mr_shrug', 520]], flip: false, nobob: false, dx: 150, t1: 6.8}} t={t} />
    <Label text="STEP 1" x={W / 2} y={330} t={t} t0={0.2} size={140} color="#ffffff" />
    <Sweat x={350} y={FEET - 780} t={t} t0={2.5} />
  </AbsoluteFill>
);

const ShotD: React.FC<{t: number}> = ({t}) => {
  const pulse = t > 8.2 ? 1 + 0.08 * Math.sin(clamp((t - 8.2) / 0.5) * Math.PI) : 1; // "extinguisher"
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Hallway />
      <div style={{position: 'absolute', left: 740 - 24, top: FEET - 650, width: 48, height: 90, background: '#555', border: `5px solid ${INK}`, borderRadius: 8}} />
      <div style={{transform: `scale(${pulse})`, transformOrigin: `770px ${FEET}px`, position: 'absolute', inset: 0}}>
        <Sprite it={{s: 'ext', x: 770, h: 640, t0: 0.4, enter: 'pop'}} t={t} />
      </div>
      <Sprite it={{s: 'mr_shrug', x: 330, r: 105, t0: 0, flip: true, t1: 9.3}} t={t} />
      <Label text="STEP 2" x={W / 2} y={330} t={t} t0={0.2} size={140} />
      <Label text="THE WALL" x={800} y={500} t={t} t0={3.6} t1={4.9} size={95} rot={-5} />
      <Label text="THE CEILING" x={620} y={190} t={t} t0={5.0} t1={6.4} size={95} rot={4} />
      {[[6.9, 770 - 190, FEET - 520], [7.2, 770 + 190, FEET - 360], [7.5, 770 + 130, FEET - 620], [8.3, 770 - 150, FEET - 200]].map(([t0, x, y], i) => <Sparkle key={i} x={x} y={y} t={t} t0={t0} />)}
    </AbsoluteFill>
  );
};

const ShotE: React.FC<{t: number}> = ({t}) => {
  const heat = clamp((t - 5.75) / 1.4) * 0.55; // "And your brain does"
  const crushX = lerp(1250, 760, eio((t - 0.2) / 5.6));
  const sc = lerp(0.8, 1.1, clamp(t / 6));
  const walkBob = Math.abs(Math.sin(t * 7)) * 14;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Hallway tint={heat} />
      <Sprite it={{s: 'mr_cough', x: 300, r: 105, t0: 0, tremble: [3, 12], t1: 7.3}} t={t} />
      {[0.4, 1.1, 1.8].map((t0, i) => <Sweat key={i} x={[130, 470, 140][i]} y={FEET - 760} t={t} t0={t0} size={50 + i * 6} period={0.9} />)}
      <Sprite it={{s: 'crush', x: crushX, h: 860, y: FEET - walkBob, t0: 0, sc0: sc, sc1: sc, rot: Math.sin(t * 7) * 2}} t={t} />
      <Label text="STEP 3" x={W / 2} y={330} t={t} t0={0.2} size={140} />
      <Label text="SHE'S COMING" x={780} y={200} t={t} t0={2.4} t1={4.6} size={80} color="#ff5aa8" rot={5} />
    </AbsoluteFill>
  );
};

const PeakShot: React.FC<{t: number}> = ({t}) => {
  const p = clamp(t / 0.28);
  const z = 1 + 0.35 * Math.pow(1 - p, 2) + 0.025 * clamp(t / 2);
  const flash = t < 0.12 ? 1 - t / 0.12 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#400'}}>
      <Whole src="crush/whole_peak.png" z={z} fx={0.4} fy={0.42} shake={t < 0.8 ? 14 * (1 - t / 0.8) : 3} t={t} />
      <AbsoluteFill style={{background: '#fff', opacity: flash * 0.8}} />
    </AbsoluteFill>
  );
};

const ShotG: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Hallway />
    <Sprite it={{s: 'ext', x: 690, h: 640, t0: 0}} t={t} />
    <Sprite it={{s: 'mr_deadpan', x: 690, r: 105, t0: 0, nobob: true}} t={t} />
    <Sprite it={{s: 'crush', x: 270, h: 900, t0: 0}} t={t} />
    <Sweat x={540} y={FEET - 780} t={t} t0={0.4} period={1.6} />
  </AbsoluteFill>
);

const Captions: React.FC<{t: number}> = ({t}) => {
  let c: any = null;
  for (const q of caps as any[]) if (t >= q.start && t < q.end) c = q;
  if (!c) return null;
  const lt = t - c.start;
  const u = clamp(lt / 0.12);
  const s = 0.75 + 0.25 * u + 0.12 * Math.sin(u * Math.PI);
  const big = t >= 29.7 && t < T_TWIST;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 420}}>
      <div style={{transform: `scale(${s})`, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: big ? 190 : 150, letterSpacing: 2, color: t >= 30.9 && t < T_TWIST ? '#ff3b1f' : '#ffd400', WebkitTextStroke: `16px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', textTransform: 'uppercase'}}>{c.text.replace(/[.,:]$/, '')}</div>
    </AbsoluteFill>
  );
};

const SFX: [number, string, number][] = [
  [0.0, 'pop', 0.5], [3.55, 'whoosh', 0.6], [3.95, 'pop', 0.6], [4.8, 'boing', 0.4],
  [7.4, 'whoosh', 0.6], [8.0, 'pop', 0.5], [14.25, 'whoosh', 0.6], [15.0, 'pop', 0.5], [20.7, 'pop', 0.4], [21.5, 'pop', 0.4], [22.9, 'clink', 0.6],
  [23.6, 'whoosh', 0.6], [24.3, 'pop', 0.5], [26.4, 'pop', 0.5], [29.7, 'rumble', 0.6],
  [T_PEAK, 'thud', 1.0], [T_PEAK, 'boing', 0.6], [T_PEAK, 'whoosh', 0.5], [T_TWIST, 'pop', 0.7], [T_TWIST + 0.05, 'cough', 0.4],
];

export const CrushShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {T < T_PEAK && BOUNDS.slice(0, -1).map((b, i) => {
        const end = BOUNDS[i + 1];
        const from = Math.max(0, b - TR);
        const slideU = i === 0 ? 1 : eo((T - from) / TR);
        const View = [HookShot, ShotB, ShotC, ShotD, ShotE][i];
        return (
          <Sequence key={i} from={Math.round(from * fps)} durationInFrames={Math.round((end - from) * fps) + 2}>
            <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`}}>
              <View t={Math.max(0, T - b)} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {T >= T_PEAK && T < T_TWIST && <PeakShot t={T - T_PEAK} />}
      {T >= T_TWIST && <ShotG t={T - T_TWIST} />}
      <Captions t={T} />
    </AbsoluteFill>
  );
};
