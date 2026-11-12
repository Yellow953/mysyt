// @ts-nocheck
// "When you wave back at the wrong person" vertical Short: whole illustrated hook + peak images, cut-out street animation.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from '../public/wave/meta.json';
import caps from './waveCaps.json';

export const WAVE_TOTAL = 33.2;
const W = 1080, H = 1920;
const HORIZON = 1180;
const FEET = 1520;
const INK = '#141414';
const TR = 0.5;
const BOUNDS = [0, 2.9, 7.45, 12.95, 19.6, 28.75, WAVE_TOTAL];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const pop = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9);

type Item = {s: string; x: number; y?: number; r?: number; t0?: number; t1?: number; poses?: [number, string, number?][]; rot?: number; enter?: string; flip?: boolean; sway?: number; swayF?: number; bob?: number; trem?: number; vx?: number; flipAt?: number};

const geom = (it: Item, name: string) => {
  const m = meta[name];
  const sc = ((it.r ?? 100) * 1.2) / m.head[2];
  return {m, sc, w: m.w * sc, h: m.h * sc, fx: m.feet[0] * sc};
};

const Sprite: React.FC<{it: Item; t: number}> = ({it, t}) => {
  const t0 = it.t0 ?? 0;
  if (t < t0 || (it.t1 !== undefined && t > it.t1)) return null;
  const lt = t - t0;
  let name = it.s, swapT = -9, xo = it.x;
  if (it.poses) for (const [pt, pn, px] of it.poses) if (t >= pt) { name = pn; swapT = pt; if (px !== undefined) xo = px; }
  const {sc, w, h, fx} = geom(it, name);
  let es = 1, ex = 0;
  const eu = clamp(lt / 0.4);
  if (it.enter === 'pop') es = pop(eu);
  else if (it.enter === 'right') ex = (1 - eo(clamp(lt / 0.6))) * (W - xo + w + 100);
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const sx = (1 - 0.14 * k) * es, sy = (1 + 0.14 * k) * es;
  const walk = it.bob ? Math.abs(Math.sin(lt * it.bob)) * 26 : 0;
  const x = xo + ex + (it.vx ?? 0) * lt, y = (it.y ?? FEET) - walk;
  const rot = (it.rot ?? 0) + (it.sway ? Math.sin(lt * (it.swayF ?? 9)) * it.sway : 0) + (it.trem ? Math.sin(lt * 55) * it.trem : 0) + (it.bob ? Math.sin(lt * it.bob) * 2.5 : 0);
  const flip = it.flipAt !== undefined ? t >= it.flipAt : it.flip;
  return (
    <>
      <div style={{position: 'absolute', left: x - w * 0.3, top: (it.y ?? FEET) - 14 * (sc / 0.9), width: w * 0.6, height: 28 * (sc / 0.9), borderRadius: '50%', background: 'rgba(30,30,40,0.25)'}} />
      <div style={{position: 'absolute', left: x - fx, top: y - h, width: w, height: h, transformOrigin: `${fx}px ${h}px`, transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx},${sy})`}}>
        <Img src={staticFile(`wave/sp/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

const handPos = (it: Item, name: string, sway: number, t: number) => {
  const {m, sc, fx, h} = geom(it, name);
  return [it.x - fx + m.hand[0] * sc, (it.y ?? FEET) - h + m.hand[1] * sc];
};

const Star: React.FC<{x: number; y: number; t: number; t0: number; size?: number; color?: string}> = ({x, y, t, t0, size = 70, color = '#fff'}) => {
  const u = ((t - t0) % 0.9) / 0.9;
  if (t < t0) return null;
  const s = Math.sin(u * Math.PI) * size;
  return <svg style={{position: 'absolute', left: x - size, top: y - size}} width={size * 2} height={size * 2} viewBox="-1 -1 2 2"><path d="M0,-1 L0.22,-0.22 L1,0 L0.22,0.22 L0,1 L-0.22,0.22 L-1,0 L-0.22,-0.22 Z" fill={color} stroke="#ff9a2a" strokeWidth={0.08} transform={`scale(${s / size}) rotate(${u * 90})`} /></svg>;
};

const Label: React.FC<{text: string; x: number; y: number; t: number; t0: number; size?: number; color?: string; rot?: number}> = ({text, x, y, t, t0, size = 110, color = '#fff', rot = 0}) => {
  const lt = t - t0;
  if (lt < 0) return null;
  const s = pop(clamp(lt / 0.35));
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: size, color, WebkitTextStroke: `${size * 0.13}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', letterSpacing: 2}}>{text}</div>;
};

// ---------- street background (cut-out shots) ----------
const BLD = Array.from({length: 9}, (_, i) => ({x: i * 130 - 20, w: 125 + ((i * 37) % 40), h: 330 + ((i * 97) % 300), c: ['#c4634a', '#8aa4c8', '#d9cdbf', '#9b6f8e', '#6fa7a0'][i % 5]}));
const StreetBg: React.FC<{sx?: number}> = ({sx = 0}) => {
  const off = -(sx % W);
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: HORIZON + 4, background: 'linear-gradient(#2ea8ff, #cdeeff)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: W * 2, height: HORIZON, transform: `translateX(${off}px)`}}>
        {[0, W].map((o) => BLD.map((b, i) => (
          <div key={o + '_' + i} style={{position: 'absolute', left: o + b.x, top: HORIZON - b.h, width: b.w, height: b.h, background: b.c, border: `5px solid ${INK}`, boxSizing: 'border-box'}}>
            {Array.from({length: 6}, (_, j) => <div key={j} style={{position: 'absolute', left: 14 + (j % 2) * (b.w / 2 - 10), top: 24 + Math.floor(j / 2) * 70, width: b.w / 2 - 30, height: 46, background: '#bfe6ff', border: `3px solid ${INK}`}} />)}
          </div>
        )))}
      </div>
      <div style={{position: 'absolute', left: 0, top: HORIZON, width: W, height: 150, background: '#7d8a8f', borderTop: `6px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 0, top: HORIZON + 150, width: W, height: H - HORIZON - 150, background: 'linear-gradient(#cfc8c0, #b3ada5)'}} />
      <svg style={{position: 'absolute', left: 0, top: HORIZON + 150}} width={W} height={H - HORIZON - 150}>
        {Array.from({length: 14}, (_, i) => {
          const x = ((i * 190 + off * 1.0) % (W + 380) + W + 380) % (W + 380) - 100;
          return <path key={i} d={`M${x},0 L${x - 80},600`} stroke="#9c968e" strokeWidth={5} />;
        })}
        <path d="M0,170 L1080,170" stroke="#9c968e" strokeWidth={5} />
      </svg>
      <div style={{position: 'absolute', left: 0, top: HORIZON + 146, width: W, height: 8, background: INK}} />
    </>
  );
};

// ---------- whole image with crop-zoom ----------
const ZImg: React.FC<{src: string; z: number; fx: number; fy: number; shake?: number}> = ({src, z, fx, fy, shake = 0}) => {
  const v = 1 / z;
  const l = clamp(fx - v / 2, 0, 1 - v), tp = clamp(fy - v / 2, 0, 1 - v);
  const pc = (q: number) => `${(Math.max(0, q) * 100).toFixed(4)}%`;
  return <Img src={staticFile(src)} style={{position: 'absolute', left: shake, top: 0, width: W, height: H, objectViewBox: `inset(${pc(tp)} ${pc(1 - l - v)} ${pc(1 - tp - v)} ${pc(l)})`}} />;
};
const toScr = (px: number, py: number, z: number, fx: number, fy: number) => {
  const v = 1 / z; const l = clamp(fx - v / 2, 0, 1 - v), tp = clamp(fy - v / 2, 0, 1 - v);
  return [(px - l) * z * W, (py - tp) * z * H];
};

const HookShot: React.FC<{t: number}> = ({t}) => {
  const base = lerp(1.0, 1.1, eio(t / 2.9));
  const bump = t > 1.95 ? 0.06 * Math.sin(clamp((t - 1.95) / 0.5) * Math.PI) : 0;
  const z = base + bump, fx = 0.5, fy = 0.5;
  const [yx, yy] = toScr(0.5, 0.275, z, fx, fy), [tx, ty] = toScr(0.17, 0.285, z, fx, fy);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <ZImg src="wave/hook.png" z={z} fx={fx} fy={fy} />
      <Label text="YOU" x={yx} y={yy} t={t} t0={-1} size={120} color="#ffffff" rot={-4} />
      <Label text="THEM" x={tx} y={ty} t={t} t0={-1} size={92} color="#ff5a3a" rot={3} />
    </AbsoluteFill>
  );
};

const Shot1: React.FC<{t: number}> = ({t}) => {
  const it: Item = {s: 'wave', x: 540, r: 128, t0: 0, enter: 'pop', sway: 5, swayF: 9, poses: []};
  const conf = t > 3.3 ? 0.07 * Math.sin(clamp((t - 3.3) / 0.45) * Math.PI) : 0; // 'confidence' pump at ~6.16-2.9
  const [hx, hy] = handPos(it, 'wave', 0, t);
  const z = 1 + (t > 3.2 ? 0.08 * Math.sin(clamp((t - 3.2) / 0.5) * Math.PI) : 0);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: '540px 900px', transform: `scale(${z})`}}>
        <StreetBg />
        <Sprite it={{s: 'stranger', x: 170, r: 62, y: 1340, t0: 0.2, enter: 'pop', sway: 6, swayF: 8}} t={t} />
        <Sprite it={it} t={t} />
        {[0, 0.3, 0.6].map((d, i) => <Star key={i} x={hx + 30 + i * 18 - 30} y={hy - 20 - i * 40 + 20} t={t} t0={0.5 + d} size={55 + i * 8} color="#ffffff" />)}
      </div>
    </AbsoluteFill>
  );
};

const Shot2: React.FC<{t: number}> = ({t}) => {
  const z = 1 + (t > 0.95 ? 0.07 * Math.sin(clamp((t - 0.95) / 0.5) * Math.PI) : 0);
  const arcU = clamp((t - 2.7) / 0.7);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: '540px 900px', transform: `scale(${z})`}}>
        <StreetBg />
        <Sprite it={{s: 'stranger', x: 150, r: 62, y: 1340, t0: 0, sway: 6, swayF: 8}} t={t} />
        <Sprite it={{s: 'guy', x: 880, r: 62, y: 1340, t0: 0.1, enter: 'right', sway: 6, swayF: 8.5, poses: []}} t={t} />
        <Sprite it={{s: 'wave', x: 500, r: 128, t0: 0, sway: 5, swayF: 9, poses: [[0.98, 'worry']]}} t={t} />
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
          <path d="M190,800 Q520,330 850,800" stroke="#ff2a2a" strokeWidth={14} strokeLinecap="round" fill="none" strokeDasharray="34 24" style={{strokeDashoffset: 0}} pathLength={1000} strokeDashoffset={0} opacity={arcU} />
          {arcU > 0.95 && <path d="M850,800 l-52,-18 M850,800 l-14,-56" stroke="#ff2a2a" strokeWidth={14} strokeLinecap="round" />}
        </svg>
        <Label text="NOT YOU" x={760} y={620} t={t} t0={3.0} size={104} color="#ff3b1f" rot={5} />
      </div>
    </AbsoluteFill>
  );
};

const Drop: React.FC<{x: number; y: number; t: number; t0: number}> = ({x, y, t, t0}) => {
  const u = ((t - t0) % 1.1) / 1.1;
  if (t < t0) return null;
  return <svg style={{position: 'absolute', left: x - 22, top: y + u * 150}} width={44} height={64} viewBox="0 0 44 64" opacity={1 - u * u}><path d="M22,2 C22,2 4,30 4,42 a18,18 0 0 0 36,0 C40,30 22,2 22,2 Z" fill="#6ac7ff" stroke={INK} strokeWidth={4} /></svg>;
};

const Shot3: React.FC<{t: number}> = ({t}) => {
  const z = lerp(1.0, 1.12, eio(t / 6.6));
  const watchers = [[120, 'stranger', 1.35], [300, 'guy', 1.9], [770, 'stranger', 2.45], [940, 'guy', 3.0], [620, 'guy', 3.55], [450, 'stranger', 4.1]];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: '540px 800px', transform: `scale(${z})`}}>
        <StreetBg />
        {watchers.map(([x, s, t0], i) => <Sprite key={i} it={{s, x, r: 34 + (i % 3) * 4, y: 1300 + (i % 2) * 22, t0, enter: 'pop', flip: i % 2 === 0, sway: 2, swayF: 3}} t={t} />)}
        <Sprite it={{s: 'stuck', x: 540, r: 128, t0: 0, enter: 'pop', trem: 0.9}} t={t} />
        {[0, 0.4, 0.8].map((d, i) => <Drop key={i} x={600 + i * 24} y={640 + i * 10} t={t} t0={0.6 + d} />)}
      </div>
    </AbsoluteFill>
  );
};

const Shot4: React.FC<{t: number}> = ({t}) => {
  // t local from 19.6; punch on 'lighthouse' (26.86 => 7.26)
  const P = 7.26;
  const u = eio(t / 7.2);
  let z = lerp(1.5, 1.0, u), fx = lerp(0.46, 0.5, u), fy = lerp(0.24, 0.5, u);
  const pu = clamp((t - P) / 0.18);
  if (t >= P) { z = 1.0 + 0.2 * eo(pu) + 0.03 * clamp((t - P) / 1.4); fx = 0.5; fy = 0.38; }
  const shake = t >= P && t < P + 0.5 ? Math.sin(t * 90) * 12 * (1 - (t - P) / 0.5) : 0;
  const flash = t >= P && t < P + 0.3 ? 0.9 * (1 - (t - P) / 0.3) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <ZImg src="wave/peak.png" z={z} fx={fx} fy={fy} shake={shake} />
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

const BLOCK_T0 = 28.75;
const Shot5: React.FC<{t: number}> = ({t}) => {
  const sx = t * 260;
  const block = Math.min(10, 1 + Math.floor(t / 0.42));
  const peds = [[1300, 'stranger'], [1750, 'guy'], [2150, 'stranger'], [2600, 'guy']];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <StreetBg sx={sx} />
      {peds.map(([x0, s], i) => {
        const x = x0 - t * 330 - 0;
        return <Sprite key={i} it={{s, x: x + (i % 2 ? 0 : 0), r: 60, y: 1380 + (i % 2) * 40, flip: x < 540}} t={t} />;
      })}
      <Sprite it={{s: 'stuck', x: 540, r: 128, t0: 0, bob: 11}} t={t} />
      <Label text={`BLOCK ${block}`} x={540} y={400} t={t} t0={0} size={96} color="#ffffff" />
    </AbsoluteFill>
  );
};

const Captions: React.FC<{t: number}> = ({t}) => {
  const c: any = (caps as any[]).find((q) => t >= q.start && t < q.end + 0.02);
  if (!c) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1190}}>
      <div style={{display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 112, letterSpacing: 2, lineHeight: 1.05}}>
        {c.words.map((w: any, i: number) => {
          const on = t >= w.start && t < w.end;
          const lt = t - w.start;
          const s = lt < 0 ? 0.001 : pop(clamp(lt / 0.22));
          const sc = lt < 0 ? 1 : on ? 0.8 + 0.2 * s + 0.12 * Math.max(0, 1 - lt / 0.2) : 1;
          return <span key={i} style={{display: 'inline-block', transform: `scale(${sc})`, color: on ? '#ffd400' : '#fff', opacity: lt < 0 ? 0.0 : 1, WebkitTextStroke: `14px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text.replace(/[.,!?]/g, '')}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{i: number; t: number}> = ({i, t}) => {
  if (i === 0) return <HookShot t={t} />;
  if (i === 1) return <Shot1 t={t} />;
  if (i === 2) return <Shot2 t={t} />;
  if (i === 3) return <Shot3 t={t} />;
  if (i === 4) return <Shot4 t={t} />;
  return <Shot5 t={t} />;
};

export const SFX: [number, string, number][] = [
  [0.1, 'pop', 0.6], [0.35, 'pop', 0.5], [1.95, 'pop', 0.5],
  [2.42, 'whoosh', 0.5], [3.0, 'boing', 0.5], [3.4, 'pop', 0.4], [6.16, 'pop', 0.6],
  [6.95, 'whoosh', 0.5], [8.4, 'thud', 0.9], [8.42, 'boing', 0.6], [10.45, 'pop', 0.7],
  [12.45, 'whoosh', 0.5], [14.25, 'pop', 0.5], [14.85, 'pop', 0.5], [15.4, 'pop', 0.5], [15.95, 'pop', 0.5], [16.5, 'pop', 0.5], [17.05, 'pop', 0.5],
  [19.1, 'whoosh', 0.5], [22.0, 'pop', 0.4], [23.5, 'boing', 0.5], [26.86, 'thud', 1.0], [26.86, 'whoosh', 0.7], [26.9, 'pop', 0.8],
  [28.2, 'whoosh', 0.5],
];
for (let k = 1; k < 10; k++) SFX.push([BLOCK_T0 + k * 0.42, 'pop', 0.22]);

export const WaveShort: React.FC<{muted?: boolean}> = ({muted}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {BOUNDS.slice(0, -1).map((b, i) => {
        const end = BOUNDS[i + 1];
        const from = Math.max(0, b - TR);
        const slideU = i === 0 ? 1 : eo((T - from) / TR);
        return (
          <Sequence key={i} from={Math.round(from * fps)} durationInFrames={Math.round((end - from) * fps) + 2}>
            <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`}}>
              <ShotView i={i} t={Math.max(0, T - b)} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Captions t={T} />
    </AbsoluteFill>
  );
};
