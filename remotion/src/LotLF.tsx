// @ts-nocheck
// "Your Life at Every Level of Winning the Lottery" long-form (16:9). Script verbatim.
// ~55% whole illustrations (several camera shots per row), ~45% CUT rows (painted background + moving cut-out sprites).
// Captions are the ONLY on-screen text. No flash overlays, no dark overlays (Joe 2026-11-14).
import React from 'react';
import {AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import tl from './lotTimeline.json';
import meta from './lotMeta.json';

export const LOT_TOTAL = tl.total;
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

// ---------------- scene plan (row -> scene) ----------------
// ILL: row -> whole illustration ids (a row with 2 ids is split in two). CUT: row -> part or [parts]; part = bg + sprites + icons.
const ILL: Record<number, string[]> = {1:['i01'],2:['i01'],3:['i03'],4:['i04'],5:['i05'],8:['i08'],9:['i09'],14:['i14a','i14b'],16:['i16'],17:['i17'],20:['i20'],22:['i22'],25:['i25'],27:['i27a','i27b'],28:['i28a','i28b'],30:['i30'],31:['i31'],33:['i33'],34:['i34a','i34b'],35:['i35'],37:['i37'],39:['i39'],43:['i43'],45:['i45'],47:['i47'],48:['i48'],50:['i50'],53:['i53']};
const MH = 470, PPL = 480, DOG = 250, HOUSE = 560, CASH = 200, PHONE = 290, BOAT = 330;
const m = (s: string, x: number, o: any = {}) => ({s, x, h: MH, t0: 0, ...o});
const p = (s: string, x: number, o: any = {}) => ({s, x, h: PPL, t0: 0.2, flip: 1, enter: 'pop', ...o});
const dog = (x: number, o: any = {}) => ({s: 'dog', x, h: DOG, t0: 0.25, flip: 1, enter: 'pop', ...o});
const tk = (s: string, x: number, h: number, lift: number, o: any = {}) => ({s, x, h, lift, t0: 0.3, enter: 'pop', ...o});
const cash = (x: number, o: any = {}) => ({s: 'cash_stack', x, h: CASH, t0: 0.3, enter: 'pop', ...o});
const ph = (x: number, o: any = {}) => ({s: 'phone_ring', x, h: PHONE, t0: 0.3, enter: 'pop', ...o});
const CUT: Record<number, any> = {
  6: {bg: 'bgKitchen', sp: [m('m_worry', 520), tk('ticket', 1100, 221, 300)], ic: [{i: 'q', x: 520, y: 430, t0: 0.5, sc: 1}]},
  7: [{bg: 'bgKitchen', sp: [m('m_point', 520), tk('ticket', 1050, 234, 320)]}, {bg: 'bgKitchen', sp: [m('m_ticket', 520), tk('ticket_bag', 1150, 299, 200)], ic: [{i: 'ex', x: 1550, y: 500, t0: 0.5, sc: 1}]}],
  10: {bg: 'bgLawn', sp: [m('m_cheer', 560), p('friend', 1150), p('stranger', 1450, {t0: 0.4})], ic: [{i: 'heart', x: 560, y: 380, t0: 0.5, sc: 1}]},
  11: {bg: 'bgKitchen', sp: [m('m_deadpan', 560), dog(1150)], ic: [{i: 'q', x: 1150, y: 600, t0: 0.5, sc: 1}]},
  12: [{bg: 'bgOffice', sp: [{s: 'm_walk', x: 300, to: 1000, h: MH, t0: 0, enter: 'none'}, tk('ticket_bag', 1450, 273, 40, {t0: 0.2})]}, {bg: 'bgOffice', sp: [m('m_shrug', 700), tk('ticket_bag', 1300, 273, 40)], ic: [{i: 'q', x: 700, y: 430, t0: 0.4, sc: 1}]}],
  13: {bg: 'bgOffice', sp: [m('m_ticket', 560), p('clerk', 1250)]},
  15: {bg: 'bgStreet', sp: [m('m_cheer', 700), cash(1250)], ic: [{i: 'bills', x: 1000, y: 800, t0: 0.4, sc: 1}]},
  18: {bg: 'bgStreet', sp: [m('m_phone', 700), ph(1250)], ic: [{i: 'ex', x: 1250, y: 330, t0: 0.4, sc: 1}]},
  19: {bg: 'bgLawn', sp: [m('m_phone', 560), p('cousin', 1250)]},
  21: [{bg: 'bgLawn', sp: [m('m_phone', 520), p('friend', 1100), p('stranger', 1450, {t0: 0.4})]}, {bg: 'bgLawn', sp: [m('m_worry', 520), p('friend', 950), p('stranger', 1250, {t0: 0.15}), p('cousin', 1600, {t0: 0.3})], ic: [{i: 'q', x: 1250, y: 390, t0: 0.5, sc: 1}]}],
  23: {bg: 'bgKitchen', sp: [m('m_worry', 560), ph(1200)], ic: [{i: 'heart', x: 1200, y: 330, t0: 0.5, sc: 1}]},
  24: {bg: 'bgKitchen', sp: [m('m_deadpan', 560), ph(1200)], ic: [{i: 'ex', x: 1200, y: 330, t0: 0.5, sc: 1}]},
  26: {bg: 'bgLawn', sp: [m('m_cheer', 700), cash(1150), cash(1450, {t0: 0.5})]},
  29: [{bg: 'bgRest', sp: [m('m_cheer', 520), p('waiter', 1100, {enter: 'right'})]}, {bg: 'bgRest', sp: [m('m_point', 520), p('friend', 1000), p('stranger', 1300, {t0: 0.35}), p('cousin', 1600, {t0: 0.5})]}],
  32: {bg: 'bgKitchen', sp: [m('m_shrug', 700, {poses: [[0.55, 'm_worry']]})], ic: [{i: 'q', x: 1150, y: 400, t0: 0.2, sc: 1.2}, {i: 'ex', x: 1450, y: 450, t0: 0.55, sc: 1}]},
  36: {bg: 'bgStreet', sp: [m('m_worry', 560), cash(1150)], ic: [{i: 'q', x: 1500, y: 450, t0: 0.4, sc: 1}]},
  38: {bg: 'bgOffice', sp: [m('m_worry', 560), p('advisor', 1200, {enter: 'right'})], ic: [{i: 'bills', x: 1450, y: 850, t0: 0.4, sc: 1}]},
  40: {bg: 'bgKitchen', sp: [m('m_deadpan', 960, {enter: 'pop'})], ic: [{i: 'q', x: 1250, y: 450, t0: 0.4, sc: 1}]},
  41: [{bg: 'bgKitchen', sp: [m('m_deadpan', 560), p('planner', 1300)]}, {bg: 'bgKitchen', sp: [m('m_point', 560), p('planner', 1300, {t0: 0.05})], ic: [{i: 'q', x: 960, y: 450, t0: 0.4, sc: 1}]}],
  42: {bg: 'bgKitchen', sp: [m('m_shrug', 560), p('planner', 1300)], ic: [{i: 'q', x: 960, y: 430, t0: 0.4, sc: 1}]},
  44: [{bg: 'bgLawn', sp: [m('m_deadpan', 560), {s: 'house_big', x: 1450, h: HOUSE, t0: 0.2, enter: 'right'}], ic: [{i: 'ex', x: 960, y: 450, t0: 0.5, sc: 1}]}, {bg: 'bgLawn', sp: [m('m_cheer', 560), p('planner', 1150), p('friend', 1450, {t0: 0.4})], ic: [{i: 'heart', x: 1300, y: 330, t0: 0.55, sc: 1}]}],
  46: [{bg: 'bgKitchen', sp: [m('m_deadpan', 560), cash(1250)], ic: [{i: 'q', x: 560, y: 430, t0: 0.4, sc: 1}]}, {bg: 'bgKitchen', sp: [m('m_worry', 560, {poses: [[0.5, 'm_shrug']]}), cash(1250, {s: 'cash_stack'})]}, {bg: 'bgKitchen', sp: [m('m_ticket', 700), tk('ticket', 1300, 247, 320)], ic: [{i: 'heart', x: 1000, y: 330, t0: 0.5, sc: 1}]}],
  49: [{bg: 'bgHouse', sp: [m('m_deadpan', 560), dog(1050)]}, {bg: 'bgHouse', sp: [m('m_cheer', 700, {enter: 'pop'}), dog(1150)], ic: [{i: 'home', x: 1550, y: 330, t0: 0.4, sc: 1.2}]}],
  51: {bg: 'bgKitchen', sp: [m('m_shrug', 560, {poses: [[0.55, 'm_cheer']]}), tk('ticket_frame', 1250, 429, 370, {enter: 'pop'})]},
  52: [{bg: 'bgHouse', sp: [m('m_cheer', 600), dog(1000)]}, {bg: 'bgHouse', sp: [m('m_shrug', 700)], ic: [{i: 'heart', x: 1100, y: 430, t0: 0.4, sc: 1}]}],
  54: [{bg: 'bgKitchen', sp: [m('m_point', 560), dog(1100), tk('ticket_frame', 1550, 364, 370)]}, {bg: 'bgKitchen', sp: [m('m_cheer', 960, {enter: 'pop'}), tk('ticket_frame', 1550, 364, 370, {t0: 0})], ic: [{i: 'heart', x: 660, y: 440, t0: 0.2, sc: 1}, {i: 'heart', x: 1260, y: 440, t0: 0.35, sc: 1}]}],
};

// ---------------- ILL shots (several crops per row) ----------------
const VARS = [
  {z0: 1.0, z1: 1.06, ox: 50, oy: 50},
  {z0: 1.14, z1: 1.2, ox: 28, oy: 45},
  {z0: 1.14, z1: 1.2, ox: 72, oy: 45},
  {z0: 1.16, z1: 1.04, ox: 50, oy: 45},
];
type Shot = {row: number; img: string; a: number; b: number; v: number; cut?: any};
const SHOTS: Shot[] = (() => {
  const out: Shot[] = [];
  for (let r = 1; r <= N; r++) {
    const a = BND(r - 1), b = BND(r);
    if (CUT[r]) {
      const parts = Array.isArray(CUT[r]) ? CUT[r] : [CUT[r]];
      parts.forEach((c: any, k: number) => out.push({row: r, img: '', a: a + ((b - a) * k) / parts.length, b: a + ((b - a) * (k + 1)) / parts.length, v: 0, cut: c}));
      continue;
    }
    const imgs = ILL[r];
    imgs.forEach((img, ii) => {
      const a2 = a + ((b - a) * ii) / imgs.length, b2 = a + ((b - a) * (ii + 1)) / imgs.length;
      const n = Math.max(1, Math.round((b2 - a2) / 3.6));
      for (let k = 0; k < n; k++) out.push({row: r, img, a: a2 + ((b2 - a2) * k) / n, b: a2 + ((b2 - a2) * (k + 1)) / n, v: k === 0 ? 0 : 1 + ((r + k) % 3)});
    });
  }
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
  const lift = d.lift ?? 0;
  const px = x + ex, py = GR + ey + idle - lift;
  return (
    <>
      <div style={{position: 'absolute', left: px - bw * 0.3, top: GR - 14, width: bw * 0.6, height: 28, borderRadius: '50%', background: 'rgba(40,20,10,0.22)', opacity: es > 0.3 && !lift ? 1 : 0}} />
      <div style={{position: 'absolute', left: px - fx, top: py - bh, width: bw, height: bh, transformOrigin: `${fx}px ${bh}px`, transform: `${d.flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${es * (1 - 0.1 * k)}, ${es * (1 + 0.1 * k)})`}}>
        <Img src={staticFile(`lot/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
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
        <Img src={staticFile(`lot/${c.bg}.png`)} style={{width: W, height: H, objectFit: 'cover'}} />
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
      <Img src={staticFile(`lot/img_${s.img}.png`)} style={{width: W, height: H, objectFit: 'cover', transformOrigin: `${V.ox}% ${V.oy}%`, transform: `translateX(${dx}px) scale(${z})`}} />
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

export const LotLF: React.FC = () => {
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
