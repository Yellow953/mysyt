// @ts-nocheck
// Funnel Short (9:16) for "POV: You wake up on an island where only women live". Joe's script verbatim.
// Whole illustrations (camera pans across the 16:9 art) + 2 cut-out animation shots. Captions at 73% height.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import tl from './islandShortTimeline.json';
import meta from './islandMeta.json';

export const ISHORT_TOTAL = tl.total;
const W = 1080, H = 1920, INK = '#141414';
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const S: any[] = tl.segs as any[];
const TR = 0.35;

// shot: seg index (0-based) range + fraction of that seg; img, focus x pan, zoom, optional punch time (s into shot)
type Shot = {a: number; b: number; img?: string; fx0?: number; fx1?: number; z0?: number; z1?: number; fy?: number; punch?: number; cut?: any};
const segT = (i: number) => (i >= S.length ? tl.total : S[i].start);
const SHOTS: Shot[] = [
  {a: segT(0), b: segT(1), img: 'i01', fx0: 0.62, fx1: 0.5, z0: 1.0, z1: 1.12, fy: 0.55},
  {a: segT(1), b: segT(2), img: 'i03', fx0: 0.2, fx1: 0.62, z0: 1.05, z1: 1.05},
  {a: segT(2), b: segT(3), img: 'i02', fx0: 0.24, fx1: 0.6, z0: 1.0, z1: 1.0, punch: 0.45},
  {a: segT(3), b: segT(4), cut: {bg: 'bgBeach', sp: [{s: 'm_cheer', x: 230, h: 520, t0: 0, poses: [[0.6, 'm_worry']]}, {s: 'w_wink', x: 620, h: 720, t0: 0.15}, {s: 'w_cross', x: 900, h: 720, t0: 0.3}], ic: [{i: 'heart', x: 300, y: 1000, t0: 0.25, sc: 1.3}, {i: 'heart', x: 460, y: 920, t0: 0.45, sc: 0.9}]}},
  {a: segT(4), b: (segT(4) + segT(5)) / 2, img: 'i08', fx0: 0.3, fx1: 0.72, z0: 1.0, z1: 1.0},
  {a: (segT(4) + segT(5)) / 2, b: segT(5), img: 'i10', fx0: 0.34, fx1: 0.58, z0: 1.05, z1: 1.12},
  {a: segT(5), b: (segT(5) + segT(6)) / 2, img: 'i07', fx0: 0.4, fx1: 0.5, z0: 1.05, z1: 1.15, fy: 0.4},
  {a: (segT(5) + segT(6)) / 2, b: segT(6), img: 'i09', fx0: 0.2, fx1: 0.75, z0: 1.0, z1: 1.0},
  {a: segT(6), b: segT(7), cut: {bg: 'bgCity', sp: [{s: 'm_cheer', x: 230, h: 520, t0: 0}, {s: 'w_wink', x: 620, h: 720, t0: 0.2}, {s: 'w_laugh', x: 900, h: 720, t0: 0.4}], ic: [{i: 'heart', x: 620, y: 960, t0: 0.5, sc: 1.2}]}},
  {a: segT(7), b: segT(8), img: 'i12', fx0: 0.12, fx1: 0.74, z0: 1.0, z1: 1.0},
  {a: segT(8), b: (segT(8) + segT(9)) / 2 + 0.6, img: 'i14', fx0: 0.12, fx1: 0.55, z0: 1.1, z1: 1.1},
  {a: (segT(8) + segT(9)) / 2 + 0.6, b: segT(9), img: 'i14', fx0: 0.55, fx1: 0.86, z0: 1.15, z1: 1.15},
  {a: segT(9), b: segT(10), img: 'i15', fx0: 0.46, fx1: 0.5, z0: 1.0, z1: 1.2, fy: 0.4},
  {a: segT(10), b: segT(11) - 1.2, img: 'i20', fx0: 0.22, fx1: 0.68, z0: 1.0, z1: 1.1},
  {a: segT(11) - 1.2, b: segT(11), img: 'i15', fx0: 0.45, fx1: 0.45, z0: 1.2, z1: 1.35, fy: 0.35},
  {a: segT(11), b: tl.total, img: 'i21', fx0: 0.2, fx1: 0.38, z0: 1.0, z1: 1.2},
];

const Ill: React.FC<{s: Shot; t: number}> = ({s, t}) => {
  const u = eio((t - s.a) / Math.max(0.1, s.b - s.a));
  let z = lerp(s.z0, s.z1, u);
  let shake = 0;
  if (s.punch !== undefined) { const p = clamp((t - s.a - s.punch) / 0.45); if (t - s.a >= s.punch) z += 0.12 * Math.sin(p * Math.PI); if (t - s.a > s.punch && t - s.a < s.punch + 0.3) shake = Math.sin(t * 90) * 8 * (1 - (t - s.a - s.punch) / 0.3); }
  const imgW = H * (16 / 9);
  const fx = lerp(s.fx0, s.fx1, u);
  const left = W / 2 - fx * imgW * z;
  const fy = s.fy ?? 0.5;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#2aa8e0'}}>
    <Img src={staticFile(`island/img_${s.img}.png`)} style={{position: 'absolute', left: left + shake, top: -(z - 1) * H * fy, width: imgW * z, height: H * z, filter: 'saturate(1.1)'}} />
  </AbsoluteFill>;
};

const GROUND = 1680;
const Sp: React.FC<any> = ({d, a, b, t}) => {
  const lt0 = a + d.t0 * (b - a); if (t < lt0) return null;
  let name = d.s, swapT = -9;
  if (d.poses) for (const [f, n] of d.poses) { const pt = a + f * (b - a); if (t >= pt) { name = n; swapT = pt; } }
  const m = (meta as any)[name]; const sc = d.h / m.h; const bw = m.w * sc, bh = m.h * sc, fx = m.feet[0] * sc;
  const lt = t - lt0; const u = clamp(lt / 0.35); const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  const dt = t - swapT; const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const idle = Math.sin(t * 2.2 + d.x * 0.01) * 4;
  return <>
    <div style={{position: 'absolute', left: d.x - bw * 0.3, top: GROUND - 16, width: bw * 0.6, height: 32, borderRadius: '50%', background: 'rgba(40,20,10,0.22)'}} />
    <div style={{position: 'absolute', left: d.x - fx, top: GROUND + idle - bh, width: bw, height: bh, transformOrigin: `${fx}px ${bh}px`, transform: `${d.s.startsWith('w_') || d.s.startsWith('q_') ? 'scaleX(-1) ' : ''}scale(${es * (1 - 0.1 * k)}, ${es * (1 + 0.1 * k)})`}}>
      <Img src={staticFile(`island/${name}.png`)} style={{width: '100%', height: '100%'}} />
    </div>
  </>;
};
const Heart: React.FC<any> = ({x, y, s, t0, t}) => {
  const lt = t - t0; if (lt < 0) return null;
  const u = clamp(lt / 0.35); const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  const z = s * 150, fl = -lt * 40;
  return <div style={{position: 'absolute', left: x - z / 2, top: y - z / 2 + fl, transform: `scale(${es})`}}><svg width={z} height={z} viewBox="0 0 100 100"><path d="M50,90 C5,55 10,10 35,12 C45,13 50,25 50,30 C50,25 55,13 65,12 C90,10 95,55 50,90 Z" fill="#ff4f7b" stroke={INK} strokeWidth={6} strokeLinejoin="round" /></svg></div>;
};
const Cut: React.FC<{s: Shot; t: number}> = ({s, t}) => {
  const c = s.cut; const bgW = 2160 * (16 / 9);
  return <AbsoluteFill style={{overflow: 'hidden', background: '#7fd0f0'}}>
    <Img src={staticFile(`island/${c.bg}.png`)} style={{position: 'absolute', left: W / 2 - bgW * 0.45, top: -240, width: bgW, height: 2160}} />
    {c.sp.map((d: any, i: number) => <Sp key={i} d={d} a={s.a} b={s.b} t={t} />)}
    {(c.ic || []).map((d: any, i: number) => <Heart key={i} x={d.x} y={d.y} s={d.sc} t0={s.a + d.t0 * (s.b - s.a)} t={t} />)}
  </AbsoluteFill>;
};

const Captions: React.FC<{t: number}> = ({t}) => {
  const c: any = (tl.caps as any[]).find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 1340, height: 140, bottom: undefined}}>
    <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 960, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 104, letterSpacing: 2, lineHeight: 1.05}}>
      {c.words.map((w: any, i: number) => <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `13px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>)}
    </div>
  </AbsoluteFill>;
};

export const IslandShort: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const T = frame / fps;
  const loopU = eo((T - (ISHORT_TOTAL - TR)) / TR);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((s, i) => {
        const from = Math.max(0, s.a - TR); const slideU = i === 0 ? 1 : eo((T - from) / TR);
        if (T < from || T > s.b + 0.05) return null;
        return <AbsoluteFill key={i} style={{transform: `translateX(${(1 - slideU) * W}px)`}}>{s.cut ? <Cut s={s} t={T} /> : <Ill s={s} t={T} />}</AbsoluteFill>;
      })}
      {loopU > 0 && <AbsoluteFill style={{transform: `translateX(${(1 - loopU) * W}px)`}}><Ill s={{...SHOTS[0], a: 0, b: 2.4}} t={0} /></AbsoluteFill>}
      <Captions t={T} />
      <Audio src={staticFile('islandshort/mix.wav')} />
    </AbsoluteFill>
  );
};
export {SHOTS};
