// @ts-nocheck
// "What If Everyone's Salary Was Public?" long-form (16:9). Joe's script verbatim.
// 18 whole illustrations (several camera shots per row) + 26 CUT rows (painted background + moving cut-out sprites).
// Salary numbers are shown as floating orange-gold COIN STACKS (taller = higher pay, dotted empty circle = no pay): no digits anywhere.
// Captions are the ONLY on-screen text. No flash overlays, no dark overlays.
import React from 'react';
import {AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import tl from './salTimeline.json';
import meta from './salMeta.json';

export const SAL_TOTAL = tl.total;
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

const ILLROWS = [1,3,5,7,8,10,13,15,18,19,23,25,27,29,31,33,37,39];
const ILL: Record<number, string> = Object.fromEntries(ILLROWS.map((r) => [r, 'i' + String(r).padStart(2, '0')]));
// sprite: s name, x, c = coins (0 = empty dotted circle, undefined = none), c2/cT = coin count changes at fraction cT of the row
const m = (s: string, x: number, o: any = {}) => ({s, x, t0: 0, enter: 'pop', ...o});
const p = (s: string, x: number, c: number | undefined, o: any = {}) => ({s, x, c, t0: 0.15, enter: 'pop', ...o});
const CUT: Record<number, any> = {
  2: {bg: 'bgStreet', sp: [m('m_shock', 520), p('neighbor', 950, 3, {t0: 0.25}), p('driver', 1350, 1, {t0: 0.55})]},
  4: {bg: 'bgStreet', sp: [m('m_shrug', 480), p('cashier', 900, 2, {t0: 0.2}), p('businessman', 1250, 5, {t0: 0.4}), p('construction', 1600, 2, {t0: 0.6})], ic: [{i: 'q', x: 480, y: 420, t0: 0.7, sc: 1}]},
  6: {bg: 'bgStreet', sp: [{s: 'm_walk', x: 250, to: 950, t0: 0, enter: 'none'}, p('businessman', 1300, 5, {t0: 0.3}), p('driver', 1650, 1, {t0: 0.5})]},
  9: {bg: 'bgHome', sp: [m('m_point', 520), p('uncle', 1000, 2, {t0: 0.2}), p('nephew', 1450, 4, {t0: 0.4})], ic: [{i: 'heart', x: 1450, y: 330, t0: 0.75, sc: 1}]},
  11: {bg: 'bgStreet', sp: [m('m_shrug', 520, {poses: [[0.5, 'm_shock']]}), p('businessman', 1000, 1, {t0: 0.25}), p('construction', 1400, 7, {t0: 0.45}), p('nephew', 1750, 6, {t0: 0.6})]},
  12: {bg: 'bgOffice', sp: [m('m_shock', 520), p('cashier', 950, 2, {t0: 0.2}), p('cleaner', 1300, 1, {t0: 0.35}), p('construction', 1650, 2, {t0: 0.5})]},
  14: {bg: 'bgOffice', sp: [m('m_worry', 420), p('cleaner', 800, 1, {t0: 0.15}), p('boss', 1200, 7, {t0: 0.3}), p('construction', 1600, 2, {t0: 0.5})], ic: [{i: 'ex', x: 800, y: 330, t0: 0.7, sc: 0.9}]},
  16: {bg: 'bgOffice', sp: [m('m_cheer', 520, {poses: [[0.55, 'm_point']]}), p('boss', 1000, 6, {c2: 3, cT: 0.55}), p('businessman', 1400, 7, {c2: 4, cT: 0.65, t0: 0.3}), p('cleaner', 1750, 2, {t0: 0.5})]},
  17: {bg: 'bgOffice', sp: [p('boss', 900, 6, {t0: 0.05}), {s: 'cleaner', x: 1250, to: 1900, c: 2, t0: 0.4, enter: 'pop'}, {s: 'cashier', x: 1500, to: 1950, c: 3, t0: 0.55, enter: 'pop'}, m('m_shrug', 450)]},
  20: {bg: 'bgRestaurant', sp: [m('m_worry', 520), p('neighbor', 960, 1, {t0: 0.15}), p('uncle', 1420, 3, {t0: 0.45}), p('mother', 1740, 3, {t0: 0.55})], ic: [{i: 'heart', x: 1580, y: 300, t0: 0.6, sc: 1}, {i: 'ex', x: 960, y: 300, t0: 0.85, sc: 0.9}]},
  21: {bg: 'bgHome', sp: [p('uncle', 650, 2, {t0: 0.05}), p('mother', 980, 4, {t0: 0.15}), p('nephew', 1330, 4, {t0: 0.45}), p('cashier', 1680, 1, {t0: 0.55})], ic: [{i: 'ex', x: 1500, y: 340, t0: 0.7, sc: 0.9}]},
  22: {bg: 'bgHome', sp: [p('uncle', 620, 2, {t0: 0.05}), p('mother', 940, 2, {t0: 0.15}), p('nephew', 1330, 5, {t0: 0.35}), p('kid', 1680, 6, {t0: 0.5})], ic: [{i: 'heart', x: 780, y: 300, t0: 0.4, sc: 1}, {i: 'ex', x: 1500, y: 300, t0: 0.75, sc: 0.9}]},
  24: {bg: 'bgPark', sp: [m('m_worry', 520), p('nephew', 980, 5, {t0: 0.2}), p('neighbor', 1330, 2, {t0: 0.4}), p('driver', 1660, 1, {t0: 0.55})], ic: [{i: 'q', x: 520, y: 400, t0: 0.5, sc: 1}, {i: 'bill', x: 1160, y: 800, t0: 0.8, sc: 1.2}]},
  26: {bg: 'bgRestaurant', sp: [m('m_shock', 460), p('billionaire', 900, 9, {t0: 0.1}), p('neighbor', 1300, 1, {t0: 0.4}), p('construction', 1650, 2, {t0: 0.6})], ic: [{i: 'heart', x: 700, y: 330, t0: 0.35, sc: 0.9}, {i: 'bill', x: 1200, y: 720, t0: 0.55, sc: 0.9}, {i: 'ex', x: 1650, y: 330, t0: 0.8, sc: 0.9}]},
  28: {bg: 'bgRestaurant', sp: [m('m_cheer', 520), p('waiter', 980, 1, {t0: 0.15}), p('businessman', 1400, 5, {t0: 0.35})], ic: [{i: 'bills', x: 1050, y: 800, t0: 0.4, sc: 1}, {i: 'q', x: 1400, y: 330, t0: 0.8, sc: 1}]},
  30: {bg: 'bgRestaurant', sp: [m('m_worry', 420), p('cashier', 620, 1, {t0: 0.15}), p('billionaire', 1060, 9, {t0: 0.3}), p('businessman', 1380, 6, {t0: 0.45}), p('boss', 1670, 6, {t0: 0.6})], ic: [{i: 'rope', x: 740, y: 840, t0: 0.2, sc: 1.7}]},
  32: {bg: 'bgPark', sp: [m('m_deadpan', 420), p('teacher', 800, 2, {t0: 0.15}), p('nephew', 1200, 6, {t0: 0.35}), p('uncle', 1580, 3, {t0: 0.55})], ic: [{i: 'ex', x: 800, y: 330, t0: 0.6, sc: 0.9}]},
  34: {bg: 'bgPark', sp: [m('m_cheer', 520), p('baker', 920, 2, {t0: 0.15}), p('teacher', 1300, 2, {t0: 0.3}), p('uncle', 1650, 2, {t0: 0.45})], ic: [{i: 'heart', x: 920, y: 280, t0: 0.5, sc: 1}, {i: 'heart', x: 1300, y: 280, t0: 0.65, sc: 1}]},
  35: {bg: 'bgOffice', sp: [m('m_point', 480, {poses: [[0.4, 'm_cheer'], [0.75, 'm_worry']]}), p('boss', 950, 5, {c2: 4, cT: 0.35}), p('construction', 1330, 2, {c2: 4, cT: 0.45, t0: 0.25}), p('cleaner', 1700, 1, {c2: 3, cT: 0.55, t0: 0.3})], ic: [{i: 'bulb', x: 950, y: 270, t0: 0.12, sc: 1}, {i: 'ex', x: 1700, y: 340, t0: 0.8, sc: 0.9}]},
  36: {bg: 'bgStreet', sp: [m('m_worry', 520, {poses: [[0.55, 'm_shock']]}), p('neighbor', 980, 3, {t0: 0.2}), p('businessman', 1350, 6, {t0: 0.35}), p('driver', 1700, 1, {t0: 0.5})], ic: [{i: 'q', x: 520, y: 420, t0: 0.6, sc: 1}]},
  38: {bg: 'bgPark', sp: [m('m_shrug', 460), p('mother', 900, 0, {t0: 0.15}), p('kid', 1180, 0, {t0: 0.3}), p('grandfather', 1500, 0, {t0: 0.5})], ic: [{i: 'heart', x: 1180, y: 330, t0: 0.8, sc: 0.9}]},
  40: {bg: 'bgStreet', sp: [m('m_shrug', 700, {poses: [[0.5, 'm_deadpan']]}), p('neighbor', 1200, 3, {t0: 0.2}), p('driver', 1520, 1, {t0: 0.4})], ic: [{i: 'q', x: 700, y: 420, t0: 0.4, sc: 1}]},
  41: {bg: 'bgPark', sp: [m('m_shock', 460), p('nephew', 850, 5, {t0: 0.15}), p('neighbor', 1200, 2, {t0: 0.3}), p('driver', 1560, 1, {t0: 0.45})], ic: [{i: 'ex', x: 1030, y: 320, t0: 0.55, sc: 0.9}, {i: 'ex', x: 1380, y: 320, t0: 0.75, sc: 0.9}]},
  42: {bg: 'bgStreet', sp: [{s: 'm_walk', x: 250, to: 900, t0: 0, enter: 'none'}, p('businessman', 1300, 5, {t0: 0.3}), p('cashier', 1650, 2, {t0: 0.45})], ic: [{i: 'q', x: 900, y: 330, t0: 0.6, sc: 1}]},
  43: {bg: 'bgPark', sp: [m('m_cheer', 960), p('neighbor', 540, 3, {t0: 0.25}), p('driver', 1360, 1, {t0: 0.4}), p('boss', 1700, 6, {t0: 0.55})], ic: [{i: 'heart', x: 540, y: 250, t0: 0.5, sc: 0.9}, {i: 'heart', x: 1360, y: 250, t0: 0.65, sc: 0.9}, {i: 'heart', x: 1700, y: 190, t0: 0.8, sc: 0.9}]},
  44: {bg: 'bgStreet', sp: [m('m_cheer', 960), p('cashier', 560, 2, {t0: 0.3}), p('construction', 1360, 2, {t0: 0.4})], ic: [{i: 'heart', x: 660, y: 430, t0: 0.4, sc: 1}, {i: 'heart', x: 1260, y: 430, t0: 0.55, sc: 1}]},
};

const VARS = [
  {z0: 1.0, z1: 1.08, ox: 50, oy: 50},
  {z0: 1.18, z1: 1.24, ox: 28, oy: 22},
  {z0: 1.18, z1: 1.24, ox: 72, oy: 22},
  {z0: 1.2, z1: 1.04, ox: 50, oy: 25},
];
const CAMS = [{z: 1.0, ox: 50}, {z: 1.12, ox: 30}, {z: 1.12, ox: 72}, {z: 1.08, ox: 50}];
type Shot = {row: number; img: string; a: number; b: number; v: number; ra?: number; rb?: number; cut?: any};
const SHOTS: Shot[] = (() => {
  const out: Shot[] = [];
  for (let r = 1; r <= N; r++) {
    const a = BND(r - 1), b = BND(r);
    if (CUT[r]) {
      const n = Math.max(1, Math.round((b - a) / 6));
      for (let k = 0; k < n; k++) out.push({row: r, img: '', a: a + ((b - a) * k) / n, b: a + ((b - a) * (k + 1)) / n, v: k, ra: a, rb: b, cut: CUT[r]});
      continue;
    }
    const img = ILL[r];
    const n = Math.max(1, Math.round((b - a) / 3.6));
    for (let k = 0; k < n; k++) out.push({row: r, img, a: a + ((b - a) * k) / n, b: a + ((b - a) * (k + 1)) / n, v: k === 0 ? 0 : 1 + ((r + k) % 3)});
  }
  for (let i = 1; i < out.length; i++) if (out[i].img && out[i].img === out[i - 1].img && out[i].v === out[i - 1].v) out[i].v = (out[i].v + 1) % 4;
  return out;
})();

// ---------------- coin stacks (the salary display: no digits) ----------------
const GOLD = '#f2a233', GOLD2 = '#ffb94d', ORG = '#ff7a1a';
const Coins: React.FC<{n: number; lt: number}> = ({n, lt}) => {
  const u = clamp(lt / 0.4); const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  const cw = 96, ch = 30, step = 19;
  const hh = n > 0 ? (n - 1) * step + ch + 6 : 80;
  const bob = Math.sin(lt * 2.6) * 7;
  return (
    <div style={{position: 'absolute', left: -60, top: -(hh + 54) + bob, width: 120, height: hh + 54, transform: `scale(${es * 1.35})`, transformOrigin: '50% 100%'}}>
      <svg width={120} height={hh + 54} viewBox={`0 0 120 ${hh + 54}`} style={{overflow: 'visible'}}>
        {n === 0 ? <circle cx={60} cy={40} r={34} fill="rgba(255,255,255,0.7)" stroke={ORG} strokeWidth={9} strokeDasharray="12 10" strokeLinecap="round" /> : Array.from({length: n}).map((_, k) => {
          const y = hh - ch / 2 - 3 - k * step;
          return <g key={k}><rect x={60 - cw / 2} y={y - 2} width={cw} height={ch / 2 + 6} rx={6} fill={GOLD} stroke={INK} strokeWidth={4} /><ellipse cx={60} cy={y} rx={cw / 2} ry={ch / 2} fill={GOLD2} stroke={INK} strokeWidth={4} /><ellipse cx={60} cy={y} rx={cw / 3.4} ry={ch / 4.2} fill="none" stroke={GOLD} strokeWidth={3} /></g>;
        })}
        <path d={`M44,${hh + 12} L76,${hh + 12} L60,${hh + 38} Z`} fill={ORG} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ---------------- sprite ----------------
const Sp: React.FC<any> = ({d, ra, rb, t, first}) => {
  const lt0 = ra + d.t0 * (rb - ra);
  if (t < lt0) return null;
  let name = d.s;
  let swapT = -9;
  if (d.poses) for (const [f, n] of d.poses) { const pt = ra + f * (rb - ra); if (t >= pt) { name = n; swapT = pt; } }
  const mt = meta[name];
  const h = d.h ?? mt.h * (name.startsWith('m_') ? 1.42 : 1.32);
  const sc = h / mt.h;
  const bw = mt.w * sc, bh = mt.h * sc;
  const fx = mt.feet[0] * sc;
  const lt = t - lt0;
  const enter = first ? (d.enter ?? 'pop') : 'none';
  let es = 1, ex = 0;
  if (enter === 'pop') { const u = clamp(lt / 0.35); es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9; }
  else if (enter === 'right') ex = (1 - eo(lt / 0.8)) * (W - d.x + bw + 120);
  let x = d.x;
  if (d.to !== undefined) x = lerp(d.x, d.to, clamp((t - lt0) / Math.max(0.1, rb - lt0)));
  const walking = d.to !== undefined;
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const idle = walking ? Math.abs(Math.sin(t * 7)) * -16 : Math.sin(t * 2.2 + d.x * 0.01) * 3;
  const rot = walking ? Math.sin(t * 7) * 2.5 : 0;
  const px = x + ex, py = GR + idle;
  let cn = d.c;
  if (d.c2 !== undefined && t >= ra + d.cT * (rb - ra)) cn = d.c2;
  const cLt = d.c2 !== undefined && t >= ra + d.cT * (rb - ra) ? t - (ra + d.cT * (rb - ra)) + 0.1 : t - (lt0 + 0.5);
  const hx = px;
  return (
    <>
      <div style={{position: 'absolute', left: px - bw * 0.3, top: GR - 14, width: bw * 0.6, height: 28, borderRadius: '50%', background: 'rgba(40,20,10,0.2)', opacity: es > 0.3 ? 1 : 0}} />
      <div style={{position: 'absolute', left: px - fx, top: py - bh, width: bw, height: bh, transformOrigin: `${fx}px ${bh}px`, transform: `${d.flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${es * (1 - 0.1 * k)}, ${es * (1 + 0.1 * k)})`}}>
        <Img src={staticFile(`sal/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
      {cn !== undefined && cLt >= 0 ? <div style={{position: 'absolute', left: hx, top: py - bh - 8 + Math.sin(0) }}><Coins key={cn} n={cn} lt={cLt} /></div> : null}
    </>
  );
};
const Svg: React.FC<any> = ({w, h, children}) => <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>{children}</svg>;
const Icon: React.FC<any> = ({i, s}) => {
  if (i === 'heart') return <Svg w={s} h={s}><path d={`M${s / 2},${s * 0.9} C${s * 0.05},${s * 0.55} ${s * 0.1},${s * 0.1} ${s * 0.35},${s * 0.12} C${s * 0.45},${s * 0.13} ${s / 2},${s * 0.25} ${s / 2},${s * 0.3} C${s / 2},${s * 0.25} ${s * 0.55},${s * 0.13} ${s * 0.65},${s * 0.12} C${s * 0.9},${s * 0.1} ${s * 0.95},${s * 0.55} ${s / 2},${s * 0.9} Z`} fill="#ff4f7b" stroke={INK} strokeWidth={s * 0.06} strokeLinejoin="round" /></Svg>;
  if (i === 'q') return <Svg w={s} h={s}><path d={`M${s * 0.3},${s * 0.3} C${s * 0.3},${s * 0.05} ${s * 0.72},${s * 0.05} ${s * 0.72},${s * 0.32} C${s * 0.72},${s * 0.52} ${s * 0.5},${s * 0.52} ${s * 0.5},${s * 0.7}`} stroke={INK} strokeWidth={s * 0.24} fill="none" strokeLinecap="round" /><path d={`M${s * 0.3},${s * 0.3} C${s * 0.3},${s * 0.05} ${s * 0.72},${s * 0.05} ${s * 0.72},${s * 0.32} C${s * 0.72},${s * 0.52} ${s * 0.5},${s * 0.52} ${s * 0.5},${s * 0.7}`} stroke="#ff8a2e" strokeWidth={s * 0.13} fill="none" strokeLinecap="round" /><circle cx={s * 0.5} cy={s * 0.9} r={s * 0.09} fill="#ff8a2e" stroke={INK} strokeWidth={s * 0.04} /></Svg>;
  if (i === 'ex') return <Svg w={s} h={s}><rect x={s * 0.4} y={s * 0.05} width={s * 0.2} height={s * 0.6} rx={s * 0.08} fill="#e53b2e" stroke={INK} strokeWidth={s * 0.05} /><circle cx={s * 0.5} cy={s * 0.85} r={s * 0.1} fill="#e53b2e" stroke={INK} strokeWidth={s * 0.05} /></Svg>;
  if (i === 'moon') return <Svg w={s} h={s}><circle cx={s / 2} cy={s / 2} r={s * 0.42} fill="#fff6e0" stroke={INK} strokeWidth={s * 0.04} /><circle cx={s * 0.38} cy={s * 0.4} r={s * 0.07} fill="#e8dcc0" /><circle cx={s * 0.6} cy={s * 0.6} r={s * 0.1} fill="#e8dcc0" /></Svg>;
  if (i === 'bulb') return <Svg w={s} h={s}><circle cx={s / 2} cy={s * 0.4} r={s * 0.3} fill="#ffb347" stroke={INK} strokeWidth={s * 0.05} /><rect x={s * 0.4} y={s * 0.68} width={s * 0.2} height={s * 0.18} rx={s * 0.03} fill="#9aa3ad" stroke={INK} strokeWidth={s * 0.04} />{[-60, -30, 0, 30, 60].map((a) => <line key={a} x1={s / 2 + Math.sin(a * Math.PI / 180) * s * 0.4} y1={s * 0.4 - Math.cos(a * Math.PI / 180) * s * 0.4} x2={s / 2 + Math.sin(a * Math.PI / 180) * s * 0.5} y2={s * 0.4 - Math.cos(a * Math.PI / 180) * s * 0.5} stroke={INK} strokeWidth={s * 0.04} strokeLinecap="round" />)}</Svg>;
  if (i === 'bill') return <Svg w={s} h={s * 0.55}><rect x={s * 0.04} y={s * 0.04} width={s * 0.92} height={s * 0.47} rx={s * 0.05} fill="#6fcf7a" stroke={INK} strokeWidth={s * 0.04} /><circle cx={s / 2} cy={s * 0.275} r={s * 0.12} fill="#4aa85a" stroke={INK} strokeWidth={s * 0.03} /></Svg>;
  if (i === 'home') return <Svg w={s} h={s}><path d={`M${s * 0.1},${s * 0.5} L${s * 0.5},${s * 0.12} L${s * 0.9},${s * 0.5} L${s * 0.8},${s * 0.5} L${s * 0.8},${s * 0.88} L${s * 0.2},${s * 0.88} L${s * 0.2},${s * 0.5} Z`} fill="#e0603a" stroke={INK} strokeWidth={s * 0.04} strokeLinejoin="round" /><rect x={s * 0.43} y={s * 0.6} width={s * 0.14} height={s * 0.28} fill="#fff" stroke={INK} strokeWidth={s * 0.03} /></Svg>;
  if (i === 'rope') return <Svg w={s * 1.6} h={s}><rect x={s * 0.05} y={s * 0.1} width={s * 0.1} height={s * 0.85} rx={s * 0.04} fill="#b8bcc4" stroke={INK} strokeWidth={s * 0.04} /><rect x={s * 1.45} y={s * 0.1} width={s * 0.1} height={s * 0.85} rx={s * 0.04} fill="#b8bcc4" stroke={INK} strokeWidth={s * 0.04} /><path d={`M${s * 0.15},${s * 0.2} Q${s * 0.8},${s * 0.6} ${s * 1.45},${s * 0.2}`} stroke={INK} strokeWidth={s * 0.1} fill="none" /><path d={`M${s * 0.15},${s * 0.2} Q${s * 0.8},${s * 0.6} ${s * 1.45},${s * 0.2}`} stroke="#e53b2e" strokeWidth={s * 0.06} fill="none" /></Svg>;
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

const CutView: React.FC<{s: Shot; t: number}> = ({s, t}) => {
  const c = s.cut; const u = clamp((t - s.a) / (s.b - s.a));
  const cam = CAMS[s.v % 4];
  const z = cam.z + 0.04 * u;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transformOrigin: `${cam.ox}% 62%`, transform: `scale(${z})`}}>
        <Img src={staticFile(`sal/${c.bg}.png`)} style={{width: W, height: H, objectFit: 'cover'}} />
        {c.sp.map((d: any, i: number) => <Sp key={i} d={d} ra={s.ra} rb={s.rb} t={t} first={s.v === 0} />)}
        {(c.ic || []).map((d: any, i: number) => <Ic key={i} d={d} a={s.ra} b={s.rb} t={t} />)}
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
      <Img src={staticFile(`sal/img_${s.img}.png`)} style={{width: W, height: H, objectFit: 'cover', transformOrigin: `${V.ox}% ${V.oy}%`, transform: `translateX(${dx}px) scale(${z})`}} />
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

export const SalLF: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let k = 0;
  for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].a) k = i;
  const cur = SHOTS[k], prev = k > 0 ? SHOTS[k - 1] : null;
  const sameCut = prev && prev.cut && cur.cut && prev.row === cur.row;
  const fade = sameCut ? 1 : clamp((t - cur.a) / 0.14);
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
