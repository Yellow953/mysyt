// @ts-nocheck
// "Locked inside IKEA during an ice storm for 30 days" long-form (16:9). Joe's script verbatim.
// ~55% whole illustrations (several camera shots per row), ~45% CUT rows (painted background + moving cut-out sprites).
// Captions are the ONLY on-screen text. No flash overlays, no dark overlays (Joe 2026-11-14).
import React from 'react';
import {AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import tl from './ikeaTimeline.json';
import meta from './ikeaMeta.json';

export const IKEA_TOTAL = tl.total;
const W = 1920, H = 1080, GR = 905;
const INK = '#141414';
const IMPACT = 'Impact, "Arial Black", sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const SG: any[] = tl.segs as any[];
const N = SG.length;
const BND = (i: number) => (i <= 0 ? 0 : i >= N ? tl.total : (SG[i - 1].end + SG[i].start) / 2);

// ---------------- scene plan (row -> scene) ----------------
// ill: whole illustration id. cut: bg + sprites [{s,x,h,t0,enter,flip,poses,to,y}] + icons [{i,x,y,t0,sc}]
const ILLROWS = [1,3,5,7,9,11,13,15,17,21,22,23,27,29,31,33,36,40,42,44,46,47,48,50,52];
const ILLIMG: Record<number, string> = {23: 'i22'};
const ILL: Record<number, string> = Object.fromEntries(ILLROWS.map((r) => [r, ILLIMG[r] ?? 'i' + String(r).padStart(2, '0')]));
const MH = 400;
const m = (s: string, x: number, o: any = {}) => ({s, x, h: MH, t0: 0, ...o});
const p = (s: string, x: number, h: number, o: any = {}) => ({s, x, h, t0: 0.2, enter: 'pop', ...o});
const MQ = 420;
const CUT: Record<number, any> = {
  2: {bg: 'bgShowroom', sp: [m('m_cheer', 520, {enter: 'pop'}), p('bed', 1000, 300, {t0: 0.15}), p('couch', 1400, 250, {t0: 0.3}), p('cart', 1760, 330, {t0: 0.5, enter: 'right'})]},
  4: {bg: 'bgOutside', sp: [m('m_worry', 520), p('car_snow', 1100, 300, {t0: 0.1}), p('debris', 1550, 230, {t0: 0.3})], ic: [{i: 'ex', x: 520, y: 440, t0: 0.5, sc: 1}]},
  6: {bg: 'bgShowroom', sp: [{s: 'm_walk', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, p('couch', 1450, 250, {t0: 0.3})], ic: [{i: 'flake', x: 1500, y: 300, t0: 0.4, sc: 1.2}, {i: 'flake', x: 1200, y: 220, t0: 0.6, sc: 0.9}]},
  8: {bg: 'bgEntrance', sp: [m('m_worry', 620), p('cart', 1500, 330, {t0: 0.3, enter: 'right'})], ic: [{i: 'ex', x: 1000, y: 560, t0: 0.4, sc: 1.2}]},
  10: {bg: 'bgShowroom', sp: [{s: 'm_walk', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, p('couch', 1500, 250, {t0: 0.2})]},
  12: {bg: 'bgBedroom', sp: [{s: 'm_carry', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, p('mattress', 1350, 190, {t0: 0.3})]},
  14: {bg: 'bgKitchen', sp: [m('m_carry', 560, {enter: 'pop'}), p('food_crate', 1000, 220), p('water_pack', 1380, 170, {t0: 0.45})]},
  16: {bg: 'bgWarehouse', sp: [{s: 'm_walk', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, p('boxes', 1500, 340, {t0: 0.2})]},
  18: {bg: 'bgWarehouse', sp: [m('m_carry', 560, {enter: 'pop'}), p('boxes', 1000, 340), p('mattress', 1400, 190, {t0: 0.4}), p('sleeping_bag', 1720, 200, {t0: 0.6})]},
  19: {bg: 'bgWarehouse', sp: [m('m_point', 500, {enter: 'pop'}), p('food_crate', 900, 220, {t0: 0.15}), p('sleeping_bag', 1200, 200, {t0: 0.3}), p('toolbox', 1480, 150, {t0: 0.45}), p('water_pack', 1730, 170, {t0: 0.6})], ic: [{i: 'heart', x: 1730, y: 560, t0: 0.65, sc: 0.9}]},
  20: {bg: 'bgWarehouse', sp: [m('m_cheer', 500, {enter: 'pop'}), p('tent', 1000, 300), p('flashlight', 1420, 150, {t0: 0.4}), p('sleeping_bag', 1720, 200, {t0: 0.55})]},
  24: {bg: 'bgWarehouse', sp: [m('m_deadpan', 560), p('sleeping_bag', 1000, 200, {t0: 0.15})], ic: [{i: 'flake', x: 1400, y: 300, t0: 0.3, sc: 1.2}, {i: 'flake', x: 1650, y: 450, t0: 0.5, sc: 0.9}]},
  25: {bg: 'bgKitchen', sp: [m('m_worry', 520), p('food_crate', 1000, 220), p('water_pack', 1380, 170, {t0: 0.4})], ic: [{i: 'q', x: 520, y: 440, t0: 0.6, sc: 1}]},
  26: {bg: 'bgWarehouse', sp: [m('m_cheer', 560, {enter: 'pop'}), p('toolbox', 1000, 150), p('flashlight', 1380, 150, {t0: 0.4})]},
  28: {bg: 'bgWarehouse', sp: [{s: 'm_walk', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, p('debris', 1500, 230, {t0: 0.2})], ic: [{i: 'ex', x: 1500, y: 560, t0: 0.4, sc: 1}]},
  30: {bg: 'bgWarehouse', sp: [{s: 'm_carry', x: 300, to: 1100, h: MH, t0: 0, enter: 'none'}, p('boxes', 1550, 340, {t0: 0.2})]},
  32: {bg: 'bgShowroom', sp: [m('m_point', 520, {enter: 'pop'}), p('bed', 980, 300, {t0: 0.15}), p('food_crate', 1350, 220, {t0: 0.3}), p('boxes', 1700, 340, {t0: 0.45})]},
  34: {bg: 'bgShowroom', sp: [m('m_worry', 560, {poses: [[0.5, 'm_deadpan']]}), p('couch', 1250, 250, {t0: 0.2})], ic: [{i: 'q', x: 560, y: 440, t0: 0.3, sc: 1}]},
  35: {bg: 'bgShowroom', sp: [m('m_cheer', 700, {enter: 'pop'}), {s: 'mannequin_a', x: 1100, h: MQ, t0: 0.2, enter: 'pop', flip: 1}, {s: 'mannequin_b', x: 1450, h: MQ, t0: 0.4, enter: 'pop', flip: 1}], ic: [{i: 'heart', x: 1280, y: 400, t0: 0.6, sc: 1}]},
  37: {bg: 'bgKitchen', sp: [m('m_deadpan', 560, {poses: [[0.5, 'm_worry']]}), p('water_pack', 1000, 170), p('food_crate', 1380, 220, {t0: 0.4})], ic: [{i: 'ex', x: 1190, y: 500, t0: 0.6, sc: 1}]},
  38: {bg: 'bgWarehouse', sp: [{s: 'm_walk', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, p('boxes', 1400, 340, {t0: 0.2}), p('food_crate', 1760, 220, {t0: 0.5})]},
  39: {bg: 'bgWarehouse', sp: [m('m_worry', 560), p('generator', 1100, 230), p('flashlight', 1480, 150, {t0: 0.5})], ic: [{i: 'bulb', x: 1100, y: 400, t0: 0.4, sc: 1}]},
  41: {bg: 'bgWarehouse', sp: [m('m_worry', 600), p('debris', 1400, 230, {t0: 0.3, enter: 'right'})], ic: [{i: 'ex', x: 600, y: 440, t0: 0.4, sc: 1}, {i: 'flake', x: 1500, y: 280, t0: 0.5, sc: 1.2}]},
  43: {bg: 'bgWarehouse', sp: [{s: 'm_walk', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, p('flashlight', 1300, 150, {t0: 0.3})], ic: [{i: 'ex', x: 1450, y: 500, t0: 0.5, sc: 1}]},
  45: {bg: 'bgWarehouse', sp: [{s: 'm_carry', x: 300, to: 900, h: MH, t0: 0, enter: 'none'}, p('boxes', 1250, 340, {t0: 0.2}), p('water_pack', 1600, 170, {t0: 0.4}), p('sleeping_bag', 1780, 200, {t0: 0.55})]},
  49: {bg: 'bgEntrance', sp: [{s: 'm_walk', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, p('debris', 1450, 260, {t0: 0.2})]},
  51: {bg: 'bgSunny', sp: [m('m_cheer', 700, {enter: 'pop'}), p('car_snow', 1300, 300, {t0: 0.3})], ic: [{i: 'heart', x: 1000, y: 430, t0: 0.5, sc: 1}]},
  53: {bg: 'bgShowroom', sp: [m('m_point', 520, {enter: 'pop'}), p('bed', 980, 300, {t0: 0.2}), p('food_crate', 1350, 220, {t0: 0.4}), p('boxes', 1700, 340, {t0: 0.6})], ic: [{i: 'q', x: 520, y: 440, t0: 0.7, sc: 1}]},
  54: {bg: 'bgShowroom', sp: [m('m_cheer', 960, {enter: 'pop'})], ic: [{i: 'heart', x: 660, y: 440, t0: 0.2, sc: 1}, {i: 'heart', x: 1260, y: 440, t0: 0.35, sc: 1}]},
};

// ---------------- ILL shots (several crops per row) ----------------
const VARS = [
  {z0: 1.0, z1: 1.1, ox: 50, oy: 50},
  {z0: 1.12, z1: 1.17, ox: 30, oy: 70},
  {z0: 1.12, z1: 1.17, ox: 70, oy: 70},
  {z0: 1.15, z1: 1.03, ox: 50, oy: 65},
];
type Shot = {row: number; img: string; a: number; b: number; v: number; cut?: any; sub?: number};
const SHOTS: Shot[] = (() => {
  const out: Shot[] = [];
  for (let r = 1; r <= N; r++) {
    const a = BND(r - 1), b = BND(r);
    if (CUT[r]) {
      const n = Math.max(1, Math.ceil((b - a) / 5.4));
      for (let k = 0; k < n; k++) out.push({row: r, img: '', a: a + ((b - a) * k) / n, b: a + ((b - a) * (k + 1)) / n, v: 0, cut: CUT[r], sub: k});
      continue;
    }
    const img = ILL[r];
    const n = Math.max(1, Math.round((b - a) / 3.6));
    for (let k = 0; k < n; k++) out.push({row: r, img, a: a + ((b - a) * k) / n, b: a + ((b - a) * (k + 1)) / n, v: k === 0 ? 0 : 1 + ((r + k) % 3)});
  }
  for (let i = 1; i < out.length; i++) if (out[i].img && out[i].img === out[i - 1].img && out[i].v === out[i - 1].v) out[i].v = (out[i].v + 1) % 4;
  return out;
})();

// ---------------- sprite / icons ----------------
const Sp: React.FC<any> = ({d, a, b, t}) => {
  const lt0 = d.sub ? a : a + d.t0 * (b - a);
  if (t < lt0) return null;
  let name = d.s;
  let swapT = -9;
  if (d.poses) for (const [f, n] of d.poses) { const pt = a + f * (b - a); if (t >= pt) { name = n; swapT = pt; } }
  const m = meta[name];
  const sc = (d.h * 1.1) / m.h;
  const bw = m.w * sc, bh = m.h * sc;
  const fx = m.feet[0] * sc;
  const lt = t - lt0;
  const enter = d.sub ? 'none' : (d.enter ?? 'pop');
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
        <Img src={staticFile(`ikea/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};
const Svg: React.FC<any> = ({w, h, children}) => <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>{children}</svg>;
const Icon: React.FC<any> = ({i, s}) => {
  if (i === 'heart') return <Svg w={s} h={s}><path d={`M${s / 2},${s * 0.9} C${s * 0.05},${s * 0.55} ${s * 0.1},${s * 0.1} ${s * 0.35},${s * 0.12} C${s * 0.45},${s * 0.13} ${s / 2},${s * 0.25} ${s / 2},${s * 0.3} C${s / 2},${s * 0.25} ${s * 0.55},${s * 0.13} ${s * 0.65},${s * 0.12} C${s * 0.9},${s * 0.1} ${s * 0.95},${s * 0.55} ${s / 2},${s * 0.9} Z`} fill="#ff4f7b" stroke={INK} strokeWidth={s * 0.06} strokeLinejoin="round" /></Svg>;
  if (i === 'q') return <Svg w={s} h={s}><path d={`M${s * 0.3},${s * 0.3} C${s * 0.3},${s * 0.05} ${s * 0.72},${s * 0.05} ${s * 0.72},${s * 0.32} C${s * 0.72},${s * 0.52} ${s * 0.5},${s * 0.52} ${s * 0.5},${s * 0.7}`} stroke={INK} strokeWidth={s * 0.24} fill="none" strokeLinecap="round" /><path d={`M${s * 0.3},${s * 0.3} C${s * 0.3},${s * 0.05} ${s * 0.72},${s * 0.05} ${s * 0.72},${s * 0.32} C${s * 0.72},${s * 0.52} ${s * 0.5},${s * 0.52} ${s * 0.5},${s * 0.7}`} stroke="#ff8a2e" strokeWidth={s * 0.13} fill="none" strokeLinecap="round" /><circle cx={s * 0.5} cy={s * 0.9} r={s * 0.09} fill="#ff8a2e" stroke={INK} strokeWidth={s * 0.04} /></Svg>;
  if (i === 'ex') return <Svg w={s} h={s}><rect x={s * 0.4} y={s * 0.05} width={s * 0.2} height={s * 0.6} rx={s * 0.08} fill="#e53b2e" stroke={INK} strokeWidth={s * 0.05} /><circle cx={s * 0.5} cy={s * 0.85} r={s * 0.1} fill="#e53b2e" stroke={INK} strokeWidth={s * 0.05} /></Svg>;
  if (i === 'flake') return <Svg w={s} h={s}><g stroke="#ffffff" strokeWidth={s * 0.12} strokeLinecap="round"><path d={`M${s / 2},${s * 0.08} L${s / 2},${s * 0.92} M${s * 0.1},${s * 0.29} L${s * 0.9},${s * 0.71} M${s * 0.1},${s * 0.71} L${s * 0.9},${s * 0.29}`} /></g><g stroke="#4a90d9" strokeWidth={s * 0.04} strokeLinecap="round"><path d={`M${s / 2},${s * 0.08} L${s / 2},${s * 0.92} M${s * 0.1},${s * 0.29} L${s * 0.9},${s * 0.71} M${s * 0.1},${s * 0.71} L${s * 0.9},${s * 0.29}`} /></g></Svg>;
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
  const sb = s.sub ?? 0;
  const z = sb % 2 === 1 ? 1.22 - 0.05 * u : 1 + 0.04 * u;
  const orig = sb % 2 === 1 ? ((sb % 4 === 1 ? 32 : 62) + '% 58%') : '50% 60%';
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transformOrigin: orig, transform: `scale(${z})`}}>
        <Img src={staticFile(`ikea/${c.bg}.png`)} style={{width: W, height: H, objectFit: 'cover'}} />
        {c.sp.map((d: any, i: number) => <Sp key={i} d={{...d, sub: s.sub, x: (s.sub && d.to !== undefined) ? d.to : d.x, to: (s.sub && d.to !== undefined) ? undefined : d.to}} a={s.a} b={s.b} t={t} />)}
        {(c.ic || []).map((d: any, i: number) => <Ic key={i} d={{...d, t0: s.sub ? 0 : d.t0}} a={s.a} b={s.b} t={t} />)}
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
      <Img src={staticFile(`ikea/img_${s.img}.png`)} style={{width: W, height: H, objectFit: 'cover', transformOrigin: `${V.ox}% ${V.oy}%`, transform: `translateX(${dx}px) scale(${z})`}} />
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

export const IkeaLF: React.FC = () => {
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
