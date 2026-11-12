// @ts-nocheck
// "Why don't we dig a hole through the Earth?" vertical Short: whole illustrated Earth cutaway + cut-out animation.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from '../public/dig/meta.json';
import caps from './digCaps.json';

export const DIG_TOTAL = 23.4;
const W = 1080, H = 1920;
const HORIZON = 1300;
const FEET = 1480;
const INK = '#141414';
const TR = 0.5;
// shot boundaries (voice segments: 0-3.15, 3.7-6.77, 7.27-10.65, 11.1-14.3, 14.8-18.65, 19.45-22.5)
const BOUNDS = [0, 3.65, 7.2, 14.6, 19.2, DIG_TOTAL];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

type Item = {s: string; x: number; y?: number; r?: number; h?: number; w?: number; t0?: number; t1?: number; poses?: [number, string, number?][]; rot?: number; enter?: string; flip?: boolean; dx?: number; dy?: number; sway?: number; sc0?: number; sc1?: number; z?: number};

const Sprite: React.FC<{it: Item; t: number}> = ({it, t}) => {
  const t0 = it.t0 ?? 0;
  if (t < t0 || (it.t1 !== undefined && t > it.t1)) return null;
  const lt = t - t0;
  let name = it.s, swapT = -9, xo = it.x;
  if (it.poses) for (const [pt, pn, px] of it.poses) if (t >= pt) { name = pn; swapT = pt; if (px !== undefined) xo = px; }
  const m = meta[name];
  const sc0 = it.r ? (it.r * 1.2) / m.head[2] : it.h ? it.h / m.h : it.w ? it.w / m.w : 1;
  const w = m.w * sc0, h = m.h * sc0, fx = m.feet[0] * sc0;
  const dur = (it.t1 ?? t0 + 3) - t0;
  const dxp = (it.dx ?? 0) * clamp(lt / dur), dyp = (it.dy ?? 0) * clamp(lt / dur);
  let ex = 0, ey = 0, es = 1, eop = 1;
  const eu = clamp(lt / (it.enter === 'pop' ? 0.35 : 0.6));
  if (it.enter === 'pop') { es = eu <= 0 ? 0 : eu >= 1 ? 1 : 1 - Math.pow(1 - eu, 3) * Math.cos(eu * 9) * 0.9; }
  else if (it.enter === 'left') ex = -(1 - eo(eu)) * (it.x + w + 100);
  else if (it.enter === 'right') ex = (1 - eo(eu)) * (W - it.x + w + 100);
  else if (it.enter === 'drop') ey = -(1 - eo(eu)) * 900;
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const sx = (1 - 0.12 * k) * es * lerp(it.sc0 ?? 1, it.sc1 ?? it.sc0 ?? 1, clamp(lt / dur));
  const sy = (1 + 0.12 * k) * es * lerp(it.sc0 ?? 1, it.sc1 ?? it.sc0 ?? 1, clamp(lt / dur));
  const isChar = !!it.r;
  const bob = isChar ? Math.sin(lt * 2.4) * 3 : 0;
  const x = xo + dxp + ex, y = (it.y ?? FEET) + dyp + ey + bob;
  const rot = (it.rot ?? 0) + (it.sway ? Math.sin(lt * 3) * it.sway : 0);
  return (
    <>
      {isChar && <div style={{position: 'absolute', left: x - w * 0.3, top: (it.y ?? FEET) - 16, width: w * 0.6, height: 30, borderRadius: '50%', background: 'rgba(30,60,30,0.28)'}} />}
      <div style={{position: 'absolute', left: x - fx, top: y - h, width: w, height: h, opacity: eop, transformOrigin: `${fx}px ${h}px`, transform: `${it.flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx},${sy})`}}>
        <Img src={staticFile(`dig/sp/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

// flying dirt clump along a parabola
const Dirt: React.FC<{t: number; t0: number; x0: number; y0: number; x1: number; y1: number; peak?: number; size?: number}> = ({t, t0, x0, y0, x1, y1, peak = 380, size = 90}) => {
  const u = (t - t0) / 0.75;
  if (u < 0 || u > 1) return null;
  const x = lerp(x0, x1, u), y = lerp(y0, y1, u) - Math.sin(u * Math.PI) * peak;
  return <Img src={staticFile('dig/sp/clump.png')} style={{position: 'absolute', left: x - size / 2, top: y - size * 0.35, width: size, transform: `rotate(${u * 540}deg)`}} />;
};

const Label: React.FC<{text: string; x: number; y: number; t: number; t0: number; size?: number; color?: string; rot?: number}> = ({text, x, y, t, t0, size = 110, color = '#ffd400', rot = 0}) => {
  const lt = t - t0;
  if (lt < 0) return null;
  const u = clamp(lt / 0.35);
  const s = 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: size, color, WebkitTextStroke: `${size * 0.13}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', letterSpacing: 2}}>{text}</div>;
};

const DayBg: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: HORIZON + 4, background: 'linear-gradient(#2ea8ff, #c9efff)'}} />
    <svg style={{position: 'absolute', left: 0, top: HORIZON - 230}} width={W} height={235} viewBox="0 0 1920 175" preserveAspectRatio="none">
      <path d="M0,175 L0,110 Q260,40 520,100 T1050,80 T1560,95 T1920,70 L1920,175 Z" fill="#7fe05a" stroke={INK} strokeWidth={5} />
    </svg>
    <div style={{position: 'absolute', left: 0, top: HORIZON, width: W, height: 200, background: '#58c93a'}} />
    <div style={{position: 'absolute', left: 0, top: HORIZON + 200, width: W, height: H - HORIZON - 200, background: '#3fae2e'}} />
    <div style={{position: 'absolute', left: 0, top: HORIZON - 3, width: W, height: 6, background: INK}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      {Array.from({length: 22}, (_, i) => {
        const x = 30 + i * 49 + ((i * 37) % 23), y = HORIZON + 60 + ((i * 53) % 420), hh = 22 + ((i * 29) % 16);
        return <path key={i} d={`M${x},${y} l-8,${-hh} M${x},${y} l1,${-hh - 8} M${x},${y} l9,${-hh}`} stroke="#1f7a2a" strokeWidth={6} strokeLinecap="round" fill="none" />;
      })}
    </svg>
  </>
);

// ---------- whole image ----------
const IMGH = H * 1.0, IMGW = IMGH * (752 / 1344);
const FOC = {mx: 0.484, my: 0.365, hx: 0.50, hy: 0.468};
const EarthImg: React.FC<{z: number; fx: number; fy: number}> = ({z, fx, fy}) => {
  // image drawn at full width (W) and height 1.0*H*(W/IMGW) ; focus (fx,fy) in image fractions is moved toward screen centre
  const sc = W / IMGW; const iw = W, ih = IMGH * sc;
  const ox = fx * iw, oy = fy * ih;
  // translate so focus point sits at (W/2, H*0.42) when zoomed
  const tx = Math.min(0, Math.max(W - iw * z, W / 2 - ox * z)), ty = Math.min(0, Math.max(H - ih * z, H * 0.42 - oy * z));
  const l = -tx / (iw * z), r = 1 - (W - tx) / (iw * z), tp = -ty / (ih * z), bt = 1 - (H - ty) / (ih * z);
  const pc = (v: number) => `${(Math.max(0, v) * 100).toFixed(4)}%`;
  return <Img src={staticFile('dig/img_earth.png')} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, objectViewBox: `inset(${pc(tp)} ${pc(r)} ${pc(bt)} ${pc(l)})`, }} />;
};
// map image fraction to screen for overlays
const toScreen = (px: number, py: number, z: number, fx: number, fy: number) => {
  const sc = W / IMGW; const iw = W, ih = IMGH * sc;
  const tx = Math.min(0, Math.max(W - iw * z, W / 2 - fx * iw * z)), ty = Math.min(0, Math.max(H - ih * z, H * 0.42 - fy * ih * z));
  return [tx + px * iw * z, ty + py * ih * z];
};

const HookShot: React.FC<{t: number}> = ({t}) => {
  // frame 0: close on mascot+hole (readable), pull out to show the huge core, punch on "Earth" (~2.6 s)
  const u = eio(t / 2.5);
  let z = lerp(2.2, 1.0, u);
  const p = clamp((t - 2.6) / 0.5);
  z *= 1 + 0.1 * Math.sin(p * Math.PI) * (t > 2.6 ? 1 : 0) + (t > 3.1 ? 0.04 * clamp((t - 3.1) / 0.55) : 0);
  const fx = lerp(0.52, 0.5, u), fy = lerp(0.40, 0.55, u);
  return <AbsoluteFill style={{overflow: 'hidden', background: '#0a2a66'}}><EarthImg z={z} fx={fx} fy={fy} /></AbsoluteFill>;
};

// shots 3+4: zoom on the hole, 12 KM pin, then pull out to show Earth is huge
const DeepShot: React.FC<{t: number}> = ({t}) => {
  // 7.2..14.6 local t 0..7.4
  const u1 = eio(t / 1.2);
  const u2 = eio((t - 3.9) / 2.2);
  let z = t < 3.9 ? lerp(1.15, 2.6, u1) : lerp(2.6, 1.0, u2);
  const fx = t < 3.9 ? lerp(0.5, 0.62, u1) : lerp(0.62, 0.5, u2), fy = t < 3.9 ? lerp(0.55, 0.49, u1) : lerp(0.49, 0.55, u2);
  const [hx, hy] = toScreen(FOC.hx, FOC.hy + 0.004, z, fx, fy);
  const pinU = eo((t - 1.6) / 1.0);
  const pinLen = 70 * z / 2.6 * pinU;
  const [lx, ly] = toScreen(0.62, 0.62, 1.0, 0.5, 0.55);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0a2a66'}}>
      <EarthImg z={z} fx={fx} fy={fy} />
      {/* thin pin-line for 12 km */}
      {t > 1.6 && t < 6.2 && <div style={{position: 'absolute', left: hx - 5, top: hy, width: 10, height: pinLen * (z > 2 ? 3 : 1.2), background: '#ff2a2a', border: `3px solid ${INK}`, borderRadius: 4}} />}
      {t < 5.2 && <Label text="12 KM" x={Math.min(W - 230, hx + 260)} y={hy + 130} t={t} t0={2.9} size={120} color="#ffffff" />}
      {t > 4.4 && <>
        <Label text="12,742 KM" x={W / 2} y={H * 0.56} t={t} t0={4.9} size={118} />
        {/* diameter arrow across the planet */}
        <div style={{position: 'absolute', left: W * 0.06, top: H * 0.62, width: W * 0.88 * clamp((t - 5.4) / 0.6), height: 12, background: '#fff', border: `3px solid ${INK}`, borderRadius: 6, opacity: t < 6.4 ? 1 : 0.9}} />
        <Label text="0.1%" x={W / 2} y={H * 0.12} t={t} t0={6.6} size={100} color="#ff5a3a" />
      </>}
    </AbsoluteFill>
  );
};

const Shot2: React.FC<{t: number}> = ({t}) => {
  const items: Item[] = [
    {s: 'stand', x: 575, r: 112, t0: 0, enter: 'pop', poses: [[1.25, 'dig', 755]]},
  ];
  const holeW = 190;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      {/* the hole */}
      <div style={{position: 'absolute', left: 800 - holeW / 2, top: FEET - 22, width: holeW, height: 54, borderRadius: '50%', background: '#4a2a12', border: `6px solid ${INK}`}} />
      {/* growing pile */}
      <Img src={staticFile('dig/sp/clump.png')} style={{position: 'absolute', left: 940 - 80 * (0.7 + 0.5 * clamp((t - 2) / 1.2)), top: FEET - 120 * (0.7 + 0.5 * clamp((t - 2) / 1.2)) + 36, width: 160 * (0.7 + 0.5 * clamp((t - 2) / 1.2))}} />
      {items.map((it, i) => <Sprite key={i} it={it} t={t} />)}
      {[1.6, 2.1, 2.6].map((t0, i) => <Dirt key={i} t={t} t0={t0} x0={800} y0={FEET - 120} x1={950} y1={FEET} peak={360} size={80} />)}
    </AbsoluteFill>
  );
};

const Shot5: React.FC<{t: number}> = ({t}) => {
  const heat = clamp(t / 1.5) * 0.35;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0}}>
        <DayBg />
        <Sprite it={{s: 'thermo', x: 840, h: 640, t0: 0.5, enter: 'pop', y: FEET}} t={t} />
        <Sprite it={{s: 'mr_worry', x: 360, r: 112, t0: 0, poses: [[2.3, 'mr_cough']]}} t={t} />
        {/* smoke puffs from the shovel */}
        {[0, 1, 2].map((i) => {
          const u = ((t - 1.2 - i * 0.55) % 1.6) / 1.6;
          if (t < 1.2 + i * 0.55 || u < 0) return null;
          return <Img key={i} src={staticFile('dig/sp/smoke1.png')} style={{position: 'absolute', left: 800 + i * 20 + u * 30, top: 760 - u * 260, width: 90 + u * 70, opacity: 1 - u, transform: `rotate(${u * 40}deg)`}} />;
        })}
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 70%, rgba(255,60,0,0.0), rgba(255,40,0,0.9))', opacity: heat}} />
      <Label text="180 C" x={840} y={H * 0.3} t={t} t0={0.9} size={130} color="#ff3b1f" />
    </AbsoluteFill>
  );
};

const Shot6: React.FC<{t: number}> = ({t}) => {
  const holeW = 190;
  const shrink = 1 - 0.8 * clamp((t - 1.2) / 2.4);
  const poseSwap = [[1.0, 'dig', 755], [3.3, 'mr_cheer', 520]];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      <div style={{position: 'absolute', left: 800 - holeW / 2, top: FEET - 22, width: holeW, height: 54, borderRadius: '50%', background: '#4a2a12', border: `6px solid ${INK}`, opacity: clamp(shrink + 0.2)}} />
      <Img src={staticFile('dig/sp/clump.png')} style={{position: 'absolute', left: 940 - 100 * (0.2 + 0.8 * shrink), top: FEET - 150 * (0.2 + 0.8 * shrink) + 36, width: 200 * (0.2 + 0.8 * shrink)}} />
      <Sprite it={{s: 'mr_shrug', x: 520, r: 112, t0: 0, poses: poseSwap}} t={t} />
      {[1.6, 2.1, 2.6, 3.0].map((t0, i) => <Dirt key={i} t={t} t0={t0} x0={940} y0={FEET - 140} x1={800} y1={FEET - 10} peak={330} size={80} />)}
    </AbsoluteFill>
  );
};

const Captions: React.FC<{t: number}> = ({t}) => {
  const c: any = (caps as any[]).find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 170}}>
      <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 104, letterSpacing: 2, lineHeight: 1.05}}>
        {c.words.map((w: any, i: number) => (
          <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `13px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{i: number; t: number}> = ({i, t}) => {
  if (i === 0) return <HookShot t={t} />;
  if (i === 1) return <Shot2 t={t} />;
  if (i === 2) return <DeepShot t={t} />;
  if (i === 3) return <Shot5 t={t} />;
  return <Shot6 t={t} />;
};

const SFX: [number, string, number][] = [
  [0.1, 'rumble', 0.5], [2.6, 'thud', 1.0], [2.6, 'whoosh', 0.6],
  [3.65, 'whoosh', 0.5], [3.75, 'pop', 0.6], [4.9, 'pop', 0.5], [5.3, 'thud', 0.5], [5.8, 'thud', 0.5], [6.3, 'thud', 0.5], [6.7, 'boing', 0.5],
  [7.2, 'whoosh', 0.5], [8.9, 'clink', 0.7], [10.1, 'pop', 0.6],
  [12.1, 'whoosh', 0.5], [12.1, 'pop', 0.6], [13.8, 'pop', 0.6],
  [14.6, 'whoosh', 0.5], [15.1, 'pop', 0.6], [15.5, 'pop', 0.6], [16.4, 'sizzle', 0.8], [17.7, 'cough', 0.6],
  [19.2, 'whoosh', 0.5], [20.2, 'pop', 0.5], [20.8, 'thud', 0.5], [21.3, 'thud', 0.5], [21.8, 'thud', 0.5], [22.5, 'pop', 0.5],
  [22.9, 'whoosh', 0.6],
];

export const DigShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const loopS = DIG_TOTAL - TR;
  const loopU = eo((T - loopS) / TR);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {BOUNDS.slice(0, -1).map((b, i) => {
        const end = BOUNDS[i + 1];
        const from = Math.max(0, b - TR);
        const slideU = i === 0 ? 1 : eo((T - from) / TR);
        return (
          <Sequence key={i} from={Math.round(from * fps)} durationInFrames={Math.round((end - from) * fps) + 2}>
            <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`, }}>
              <ShotView i={i} t={Math.max(0, T - b)} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {loopU > 0 && (
        <AbsoluteFill style={{transform: `translateX(${(1 - loopU) * W}px)`}}>
          <ShotView i={0} t={0} />
        </AbsoluteFill>
      )}
      <Captions t={T} />
      <Audio src={staticFile('dig/voice.wav')} volume={1.0} />
      <Audio src={staticFile('dig/music.mp3')} volume={(f) => {
        const t = f / fps;
        const voiced = caps.some((c: any) => t >= c.start - 0.1 && t < c.end);
        return 0.22 * (voiced ? 0.55 : 1) * Math.min(1, t / 0.5) * Math.min(1, (DIG_TOTAL - t) / 1.2);
      }} />
      {SFX.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.round(t0 * fps)} durationInFrames={Math.round(2.6 * fps)}>
          <Audio src={staticFile(`dig/${name}.wav`)} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
