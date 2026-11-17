// @ts-nocheck
// "POV: stuck on a yacht with your crush" long-form (16:9). Joe's script verbatim.
// ~55% whole illustrations (several camera shots per row), ~45% CUT rows (painted background + moving cut-out sprites).
// Captions are the ONLY on-screen text. No flash overlays, no dark overlays (Joe 2026-11-14).
import React from 'react';
import {AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import tl from './yachtTimeline.json';
import meta from './yachtMeta.json';

export const YACHT_TOTAL = tl.total;
const W = 1920, H = 1080, GR = 960;
const INK = '#141414';
const IMPACT = 'Impact, "Arial Black", sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const SG: any[] = tl.segs as any[];
const N = SG.length;
const BND = (i: number) => (i <= 0 ? 0 : i >= N ? tl.total : (SG[i - 1].end + SG[i].start) / 2);

// ---------------- scene plan (rows -> scenes) ----------------
// ILL scene: whole illustration (several camera crops). CUT scene: painted bg + moving sprites [{s,x,h,t0,enter,flip,poses,to}] + icons.
const MH = 470, WH = 470;
const m = (s: string, x: number, o: any = {}) => ({s, x, h: MH, t0: 0, ...o});
const w = (s: string, x: number, o: any = {}) => ({s, x, h: WH, t0: 0, flip: 1, enter: 'pop', ...o});
const pr = (s: string, x: number, h: number, o: any = {}) => ({s, x, h, t0: 0, enter: 'pop', ...o});
type Scene = {rows: [number, number]; ill?: string; cut?: any};
const SCENES: Scene[] = [
  {rows: [1, 1], ill: 'i01'},
  {rows: [2, 2], ill: 'i02'},
  {rows: [3, 4], cut: {bg: 'bgDeck', sp: [m('m_awkward', 560), w('w_wave', 1250, {t0: 0.45})], ic: [{i: 'heart', x: 900, y: 400, t0: 0.6, sc: 1.2}]}},
  {rows: [5, 5], cut: {bg: 'bgDeck', sp: [m('m_shrug', 700, {poses: [[0.6, 'm_frozen']]})], ic: [{i: 'q', x: 1250, y: 520, t0: 0.15, sc: 1.8}, {i: 'ex', x: 700, y: 400, t0: 0.65, sc: 1}]}},
  {rows: [6, 6], cut: {bg: 'bgPool', sp: [m('m_awkward', 560), w('w_stand', 1300, {t0: 0.3})]}},
  {rows: [7, 7], ill: 'i07'},
  {rows: [8, 8], cut: {bg: 'bgDeck', sp: [m('m_awkward', 560, {poses: [[0.55, 'm_deadpan']]}), {s: 'w_walk', x: 800, to: 1750, h: WH, t0: 0.1, flip: 0, enter: 'none'}]}},
  {rows: [9, 9], cut: {bg: 'bgDeck', sp: [m('m_cheer', 560), pr('p_tray', 1000, 200, {t0: 0.25}), w('w_cheer', 1400, {t0: 0.4})]}},
  {rows: [10, 11], cut: {bg: 'bgPool', sp: [m('m_cheer', 600), w('w_cheer', 1150, {t0: 0.2})], ic: [{i: 'heart', x: 880, y: 420, t0: 0.5, sc: 1.2}]}},
  {rows: [12, 12], cut: {bg: 'bgDeck', sp: [{s: 'w_run', x: 100, to: 1300, h: 430, t0: 0, flip: 0, enter: 'none'}, {s: 'm_run', x: 400, to: 1600, h: 390, t0: 0.1, flip: 0, enter: 'none'}, pr('p_ring', 1700, 200, {t0: 0.4})]}},
  {rows: [13, 13], ill: 'i13'},
  {rows: [14, 15], cut: {bg: 'bgDeck', sp: [m('m_nod', 560, {poses: [[0.6, 'm_worry']]}), w('w_smile', 1150, {t0: 0.2, poses: [[0.6, 'w_stand']]})], ic: [{i: 'heart', x: 860, y: 400, t0: 0.12, sc: 1.2}, {i: 'ex', x: 860, y: 400, t0: 0.66, sc: 1}]}},
  {rows: [16, 16], cut: {bg: 'bgBridge', sp: [m('m_point', 560), pr('p_wheel', 1100, 300, {t0: 0.25}), w('w_stand', 1500, {t0: 0.4})]}},
  {rows: [17, 17], cut: {bg: 'bgBridge', sp: [m('m_worry', 560), pr('p_radio', 1050, 200, {t0: 0.2}), w('w_stand', 1500, {t0: 0.35})], ic: [{i: 'ex', x: 1050, y: 380, t0: 0.55, sc: 0.9}]}},
  {rows: [18, 18], cut: {bg: 'bgLounge', sp: [{s: 'm_walk', x: 500, to: 1250, h: MH, t0: 0, flip: 0, enter: 'none'}, {s: 'w_walk', x: 100, to: 800, h: WH, t0: 0.05, flip: 0, enter: 'none'}]}},
  {rows: [19, 19], cut: {bg: 'bgLounge', sp: [m('m_worry', 560), w('w_stand', 1250, {t0: 0.2})], ic: [{i: 'q', x: 900, y: 420, t0: 0.5, sc: 1.2}]}},
  {rows: [20, 20], ill: 'i20'},
  {rows: [21, 21], ill: 'i21'},
  {rows: [22, 23], ill: 'i22'},
  {rows: [24, 24], cut: {bg: 'bgLounge', sp: [m('m_blush', 700), w('w_smile', 1150, {t0: 0.2})], ic: [{i: 'heart', x: 925, y: 380, t0: 0.5, sc: 1.4}]}},
  {rows: [25, 26], ill: 'i25'},
  {rows: [27, 28], cut: {bg: 'bgStar', sp: [m('m_nod', 560), w('w_stand', 1150, {t0: 0.1, poses: [[0.55, 'w_smile']]})], ic: [{i: 'q', x: 1150, y: 360, t0: 0.12, sc: 1}]}},
  {rows: [29, 30], cut: {bg: 'bgStar', sp: [m('m_frozen', 700, {t0: 0.35}), w('w_wink', 1150, {t0: 0.05})], ic: [{i: 'heart', x: 925, y: 380, t0: 0.08, sc: 1.2}, {i: 'ex', x: 700, y: 400, t0: 0.6, sc: 1}]}},
  {rows: [31, 31], ill: 'i31'},
  {rows: [32, 32], cut: {bg: 'bgStar', sp: [m('m_cheer', 700), w('w_cheer', 1150, {t0: 0.2})], ic: [{i: 'heart', x: 925, y: 380, t0: 0.3, sc: 1.4}]}},
  {rows: [33, 33], ill: 'i33'},
  {rows: [34, 34], cut: {bg: 'bgBridge', sp: [m('m_point', 560), pr('p_radio', 1000, 200, {t0: 0.2}), w('w_cheer', 1450, {t0: 0.35})], ic: [{i: 'bulb', x: 1000, y: 380, t0: 0.5, sc: 1}]}},
  {rows: [35, 35], ill: 'i35'},
  {rows: [36, 36], ill: 'i36'},
  {rows: [37, 37], ill: 'i37'},
];

// ---------------- ILL shots (several crops per scene) ----------------
const VARS = [
  {z0: 1.0, z1: 1.1, ox: 50, oy: 50},
  {z0: 1.32, z1: 1.4, ox: 28, oy: 45},
  {z0: 1.32, z1: 1.4, ox: 72, oy: 45},
  {z0: 1.3, z1: 1.04, ox: 50, oy: 40},
];
type Shot = {row: number; img: string; a: number; b: number; v: number; cut?: any};
const SHOTS: Shot[] = (() => {
  const out: Shot[] = [];
  SCENES.forEach((sc, si) => {
    const a = BND(sc.rows[0] - 1), b = BND(sc.rows[1]);
    if (sc.cut) { out.push({row: sc.rows[0], img: '', a, b, v: 0, cut: sc.cut}); return; }
    const n = Math.max(1, Math.round((b - a) / 3.6));
    for (let k = 0; k < n; k++) out.push({row: sc.rows[0], img: sc.ill!, a: a + ((b - a) * k) / n, b: a + ((b - a) * (k + 1)) / n, v: k === 0 ? 0 : 1 + ((si + k) % 3)});
  });
  for (let i = 1; i < out.length; i++) if (out[i].img && out[i].img === out[i - 1].img && out[i].v === out[i - 1].v) out[i].v = (out[i].v + 1) % 4;
  return out;
})();

// ---------------- sprite / icons ----------------
const Sp: React.FC<any> = ({d, a, b, t}) => {
  const lt0 = a + d.t0 * (b - a);
  if (t < lt0) return null;
  let name = d.s;
  let swapT = -9;
  if (d.poses) for (const [f, n] of d.poses) { const pt = a + f * (b - a); if (t >= pt) { name = n; swapT = pt; } }
  const m = meta[name];
  const sc = d.h / m.h;
  const bw = m.w * sc, bh = m.h * sc;
  const fx = m.feet[0] * sc;
  const lt = t - lt0;
  const enter = d.enter ?? 'pop';
  let es = 1, ex = 0, ey = 0;
  if (enter === 'pop') { const u = clamp(lt / 0.35); es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9; }
  else if (enter === 'left') ex = -(1 - eo(lt / 0.7)) * (d.x + bw + 120);
  else if (enter === 'right') ex = (1 - eo(lt / 0.8)) * (W - d.x + bw + 120);
  let x = d.x;
  if (d.to !== undefined) x = lerp(d.x, d.to, clamp((t - lt0) / Math.max(0.1, b - lt0)));
  const walking = d.to !== undefined;
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const idle = walking ? Math.abs(Math.sin(t * 7)) * -16 : Math.sin(t * 2.2 + d.x * 0.01) * 3;
  const rot = walking ? Math.sin(t * 7) * 2.5 : 0;
  const px = x + ex, py = GR + ey + idle;
  return (
    <>
      <div style={{position: 'absolute', left: px - bw * 0.3, top: GR - 14, width: bw * 0.6, height: 28, borderRadius: '50%', background: 'rgba(40,20,10,0.22)', opacity: es > 0.3 ? 1 : 0}} />
      <div style={{position: 'absolute', left: px - fx, top: py - bh, width: bw, height: bh, transformOrigin: `${fx}px ${bh}px`, transform: `${d.flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${es * (1 - 0.1 * k)}, ${es * (1 + 0.1 * k)})`}}>
        <Img src={staticFile(`yacht/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};
const Svg: React.FC<any> = ({w, h, children}) => <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>{children}</svg>;
const Icon: React.FC<any> = ({i, s}) => {
  if (i === 'heart') return <Svg w={s} h={s}><path d={`M${s / 2},${s * 0.9} C${s * 0.05},${s * 0.55} ${s * 0.1},${s * 0.1} ${s * 0.35},${s * 0.12} C${s * 0.45},${s * 0.13} ${s / 2},${s * 0.25} ${s / 2},${s * 0.3} C${s / 2},${s * 0.25} ${s * 0.55},${s * 0.13} ${s * 0.65},${s * 0.12} C${s * 0.9},${s * 0.1} ${s * 0.95},${s * 0.55} ${s / 2},${s * 0.9} Z`} fill="#ff4f7b" stroke={INK} strokeWidth={s * 0.06} strokeLinejoin="round" /></Svg>;
  if (i === 'q') return <Svg w={s} h={s}><path d={`M${s * 0.3},${s * 0.3} C${s * 0.3},${s * 0.05} ${s * 0.72},${s * 0.05} ${s * 0.72},${s * 0.32} C${s * 0.72},${s * 0.52} ${s * 0.5},${s * 0.52} ${s * 0.5},${s * 0.7}`} stroke={INK} strokeWidth={s * 0.24} fill="none" strokeLinecap="round" /><path d={`M${s * 0.3},${s * 0.3} C${s * 0.3},${s * 0.05} ${s * 0.72},${s * 0.05} ${s * 0.72},${s * 0.32} C${s * 0.72},${s * 0.52} ${s * 0.5},${s * 0.52} ${s * 0.5},${s * 0.7}`} stroke="#ff8a2e" strokeWidth={s * 0.13} fill="none" strokeLinecap="round" /><circle cx={s * 0.5} cy={s * 0.9} r={s * 0.09} fill="#ff8a2e" stroke={INK} strokeWidth={s * 0.04} /></Svg>;
  if (i === 'ex') return <Svg w={s} h={s}><rect x={s * 0.4} y={s * 0.05} width={s * 0.2} height={s * 0.6} rx={s * 0.08} fill="#e53b2e" stroke={INK} strokeWidth={s * 0.05} /><circle cx={s * 0.5} cy={s * 0.85} r={s * 0.1} fill="#e53b2e" stroke={INK} strokeWidth={s * 0.05} /></Svg>;
  if (i === 'star') return <Svg w={s} h={s}><path d={`M${s/2},${s*0.05} L${s*0.62},${s*0.38} L${s*0.95},${s*0.38} L${s*0.68},${s*0.6} L${s*0.78},${s*0.93} L${s/2},${s*0.73} L${s*0.22},${s*0.93} L${s*0.32},${s*0.6} L${s*0.05},${s*0.38} L${s*0.38},${s*0.38} Z`} fill="#ffb347" stroke={INK} strokeWidth={s*0.04} strokeLinejoin="round" /></Svg>;
  if (i === 'moon') return <Svg w={s} h={s}><circle cx={s / 2} cy={s / 2} r={s * 0.42} fill="#fff6e0" stroke={INK} strokeWidth={s * 0.04} /><circle cx={s * 0.38} cy={s * 0.4} r={s * 0.07} fill="#e8dcc0" /><circle cx={s * 0.6} cy={s * 0.6} r={s * 0.1} fill="#e8dcc0" /></Svg>;
  if (i === 'bulb') return <Svg w={s} h={s}><circle cx={s / 2} cy={s * 0.4} r={s * 0.3} fill="#ffb347" stroke={INK} strokeWidth={s * 0.05} /><rect x={s * 0.4} y={s * 0.68} width={s * 0.2} height={s * 0.18} rx={s * 0.03} fill="#9aa3ad" stroke={INK} strokeWidth={s * 0.04} />{[-60, -30, 0, 30, 60].map((a) => <line key={a} x1={s / 2 + Math.sin(a * Math.PI / 180) * s * 0.4} y1={s * 0.4 - Math.cos(a * Math.PI / 180) * s * 0.4} x2={s / 2 + Math.sin(a * Math.PI / 180) * s * 0.5} y2={s * 0.4 - Math.cos(a * Math.PI / 180) * s * 0.5} stroke={INK} strokeWidth={s * 0.04} strokeLinecap="round" />)}</Svg>;
  if (i === 'bill') return <Svg w={s} h={s * 0.55}><rect x={s * 0.04} y={s * 0.04} width={s * 0.92} height={s * 0.47} rx={s * 0.05} fill="#6fcf7a" stroke={INK} strokeWidth={s * 0.04} /><circle cx={s / 2} cy={s * 0.275} r={s * 0.12} fill="#4aa85a" stroke={INK} strokeWidth={s * 0.03} /></Svg>;
  if (i === 'home') return <Svg w={s} h={s}><path d={`M${s * 0.1},${s * 0.5} L${s * 0.5},${s * 0.12} L${s * 0.9},${s * 0.5} L${s * 0.8},${s * 0.5} L${s * 0.8},${s * 0.88} L${s * 0.2},${s * 0.88} L${s * 0.2},${s * 0.5} Z`} fill="#e0603a" stroke={INK} strokeWidth={s * 0.04} strokeLinejoin="round" /><rect x={s * 0.43} y={s * 0.6} width={s * 0.14} height={s * 0.28} fill="#fff" stroke={INK} strokeWidth={s * 0.03} /></Svg>;
  return null;
};
const Ic: React.FC<any> = ({d, a, b, t}) => {
  const t0 = a + d.t0 * (b - a); const lt = t - t0; if (lt < 0) return null;
  const u = clamp(lt / 0.35); const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  const s = 150 * (d.sc ?? 1);
  if (d.i === 'bills') {
    return <>{[0, 1, 2, 3].map((q) => { const p = clamp((lt - q * 0.5) / 4); const x = d.x + q * 130 + Math.sin(p * 6 + q) * 40, y = d.y - p * 520 - q * 20; return <div key={q} style={{position: 'absolute', left: x - 80, top: y, opacity: p > 0 && p < 1 ? 1 : 0, transform: `rotate(${Math.sin(p * 5 + q) * 25}deg)`}}><Icon i="bill" s={160} /></div>; })}</>;
  }
  const bob = Math.sin(lt * 3) * 8;
  return <div style={{position: 'absolute', left: d.x - s / 2, top: d.y - s / 2 + bob, transform: `scale(${es})`}}><Icon i={d.i} s={s} /></div>;
};
const HomeBubble: React.FC<any> = () => null;

const CutView: React.FC<{s: Shot; t: number}> = ({s, t}) => {
  const c = s.cut; const u = clamp((t - s.a) / (s.b - s.a));
  const z = c.zoom ? 1 + 0.6 * eio((u - 0.45) / 0.55) : 1 + 0.04 * u;
  const orig = c.zoom ? '47% 62%' : '50% 60%';
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transformOrigin: orig, transform: `scale(${z})`}}>
        <Img src={staticFile(`yacht/${c.bg}.png`)} style={{width: W, height: H, objectFit: 'cover'}} />
        {c.sp.map((d: any, i: number) => <Sp key={i} d={d} a={s.a} b={s.b} t={t} />)}
        {(c.ic || []).map((d: any, i: number) => <Ic key={i} d={d} a={s.a} b={s.b} t={t} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const ShotView: React.FC<{s: Shot; t: number; op?: number}> = ({s, t, op = 1}) => {
  if (s.cut) return <AbsoluteFill style={{opacity: op}}><CutView s={s} t={t} /></AbsoluteFill>;
  const V = VARS[s.v];
  const u = clamp((t - s.a) / (s.b - s.a));
  const z = lerp(V.z0, V.z1, eio(u));
  const dx = (s.v === 1 ? 1 : s.v === 2 ? -1 : 0) * u * 30;
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: op}}>
      <Img src={staticFile(`yacht/img_${s.img}.png`)} style={{width: W, height: H, objectFit: 'cover', transformOrigin: `${V.ox}% ${V.oy}%`, transform: `translateX(${dx}px) scale(${z})`}} />
    </AbsoluteFill>
  );
};

// ---------------- captions ----------------
const CHUNKS: any[] = (() => {
  const out: any[] = [];
  SG.forEach((s) => {
    const ws = s.words; let cur: any[] = [];
    const flush = () => { if (cur.length) { out.push({words: cur, start: cur[0].start}); cur = []; } };
    ws.forEach((w: any, i: number) => {
      cur.push(w);
      const len = cur.map((q) => q.text).join(' ').length;
      const nextLen = i + 1 < ws.length ? len + 1 + ws[i + 1].text.length : 99;
      if ((len >= 20 && nextLen > 28) || len >= 30 || (/[.?!:]$/.test(w.text) && len >= 4)) flush();
    });
    flush();
  });
  out.forEach((c, i) => { const nx = out[i + 1]; c.end = Math.min(nx ? nx.start : tl.total, c.words[c.words.length - 1].end + 0.5); if (nx && c.end > nx.start) c.end = nx.start; });
  return out;
})();
const Captions: React.FC<{t: number}> = ({t}) => {
  const c = CHUNKS.find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 62}}>
      <div style={{display: 'flex', gap: 16, flexWrap: 'nowrap', justifyContent: 'center', maxWidth: 1760, fontFamily: IMPACT, fontSize: 70, letterSpacing: 2, lineHeight: 1.05}}>
        {c.words.map((w: any, i: number) => (
          <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text.toUpperCase()}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const YachtLF: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let k = 0;
  for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].a) k = i;
  const cur = SHOTS[k], prev = k > 0 ? SHOTS[k - 1] : null;
  const fade = clamp((t - cur.a) / 0.14);
  const edge = clamp(t / 0.6) * clamp((tl.total - t) / 1.2);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: edge}}>
        {prev && fade < 1 ? <ShotView s={prev} t={t} /> : null}
        <ShotView s={cur} t={t} op={prev ? fade : 1} />
      </AbsoluteFill>
      <Captions t={t} />
    </AbsoluteFill>
  );
};
