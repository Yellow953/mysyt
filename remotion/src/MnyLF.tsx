// @ts-nocheck
// "What If Money Disappeared Overnight?" long-form (16:9), v4 (script v4, Joe's ChatGPT script): painted backgrounds + whole illustrations + cut-out cast.
// Visual only. Audio (voice, music, sfx) is mixed separately (scripts/long-form/mix_mnylf.py) and muxed afterwards.
// Captions are the ONLY on-screen text: icons are drawn as shapes, never letters or digits.
import React from 'react';
import {AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import tl from './mnylfTimeline.json';
import meta from './mnylfMeta.json';

export const MNYLF_TOTAL = tl.total;
const W = 1920, H = 1080;
const INK = '#141414';
const IMPACT = 'Impact, "Arial Black", sans-serif';
const TR = 0.42;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const SG = tl.segs;
const N = SG.length;
const S0 = (r: number) => SG[r - 1].start;
const S1 = (r: number) => SG[r - 1].end;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
const wd = (r: number, key: string, occ = 0) => {
  const k = norm(key); let c = 0;
  for (const w of SG[r - 1].words) if (norm(w.text).startsWith(k)) { if (c === occ) return w.start; c++; }
  console.warn(`word ${key} not in row ${r}`); return SG[r - 1].start + 0.5;
};
const BND = (i: number) => (i <= 0 ? 0 : i >= N ? tl.total : (SG[i - 1].end + SG[i].start) / 2);
const GR = 880; // feet line

// ---------- sprite ----------
const Sp: React.FC<any> = ({s, x, y, r, h, w, t, t0 = 0, t1 = 1e9, flip, enter, poses, rot = 0, sxs = 1, sys = 1, op = 1, shadow, filter, ox = 0, oy = 0, noidle, pivot}) => {
  if (t < t0 || t > t1) return null;
  let name = s, swapT = -9;
  if (poses) for (const [pt, pn] of poses) if (t >= pt) { name = pn; swapT = pt; }
  const m = meta[name];
  const isM = name.startsWith('m_') || name.startsWith('mr_');
  const sc = r ? r / m.head[2] : h ? h / m.h : w ? w / m.w : 1;
  const bw = m.w * sc, bh = m.h * sc;
  const fx = (isM ? m.feet[0] : m.w / 2) * sc;
  const lt = t - t0;
  let es = 1, ex = 0, ey = 0, sx = 1, sy = 1;
  if (enter === 'pop') { const u = clamp(lt / 0.35); es = u >= 1 ? 1 : u <= 0 ? 0 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9; }
  else if (enter === 'left') ex = -(1 - eo(lt / 0.6)) * (x + bw + 100);
  else if (enter === 'right') ex = (1 - eo(lt / 0.7)) * (W - x + bw + 100);
  else if (enter === 'drop') { ey = -(1 - eo(lt / 0.45)) * 1100; if (lt > 0.45) { const q = lt - 0.45; const k = Math.exp(-q * 9) * Math.cos(q * 24); sx = 1 + 0.16 * k; sy = 1 - 0.16 * k; } }
  else if (enter === 'rise') { ey = (1 - eo(lt / 0.7)) * (bh + 80); }
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  sx *= (1 - 0.12 * k); sy *= (1 + 0.12 * k);
  const idle = !noidle ? Math.sin(t * 2.2 + x * 0.01) * (isM ? 3 : 2) : 0;
  const px = x + ex + ox, py = y + ey + oy + idle;
  return (
    <>
      {(shadow ?? true) && es > 0.3 && <div style={{position: 'absolute', left: px - bw * 0.3, top: y - 14, width: bw * 0.6, height: 28, borderRadius: '50%', background: 'rgba(40,20,10,0.25)', opacity: op}} />}
      <div style={{position: 'absolute', left: px - fx, top: py - bh, width: bw, height: bh, opacity: op, transformOrigin: pivot !== undefined ? `${bw / 2}px ${bh * pivot}px` : `${fx}px ${bh}px`, transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx * es * sxs},${sy * es * sys})`, filter}}>
        <Img src={staticFile(`mnylf/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};
const anch = (name: string, x: number, y: number, r: number) => {
  const m = meta[name]; const sc = r / m.head[2];
  const left = x - m.feet[0] * sc, top = y - m.h * sc;
  return {hx: left + m.head[0] * sc, hy: top + m.head[1] * sc, ax: left + m.hand[0] * sc, ay: top + m.hand[1] * sc, top, left, sc};
};
const Pop: React.FC<any> = ({t, t0, t1 = 1e9, children, x, y, rot = 0, dur = 0.3, sc = 1}) => {
  const lt = t - t0; if (lt < 0 || t > t1) return null;
  const u = clamp(lt / dur); const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${es * sc})`}}>{children}</div>;
};

// ---------- icons (shapes only, no glyphs) ----------
const Svg: React.FC<any> = ({w, h, children}) => <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>{children}</svg>;
const XMark = ({s = 160, c = '#e53b2e'}) => <Svg w={s} h={s}><path d={`M${s * 0.15},${s * 0.15} L${s * 0.85},${s * 0.85} M${s * 0.85},${s * 0.15} L${s * 0.15},${s * 0.85}`} stroke={INK} strokeWidth={s * 0.24} strokeLinecap="round" /><path d={`M${s * 0.15},${s * 0.15} L${s * 0.85},${s * 0.85} M${s * 0.85},${s * 0.15} L${s * 0.15},${s * 0.85}`} stroke={c} strokeWidth={s * 0.15} strokeLinecap="round" /></Svg>;
const Check = ({s = 160, c = '#3fc06b'}) => <Svg w={s} h={s}><circle cx={s / 2} cy={s / 2} r={s * 0.46} fill={c} stroke={INK} strokeWidth={s * 0.06} /><path d={`M${s * 0.27},${s * 0.52} L${s * 0.44},${s * 0.68} L${s * 0.74},${s * 0.34}`} stroke="#fff" strokeWidth={s * 0.11} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>;
const House = ({s = 120}) => <Svg w={s} h={s}><path d={`M${s * 0.12},${s * 0.5} L${s * 0.5},${s * 0.14} L${s * 0.88},${s * 0.5} L${s * 0.78},${s * 0.5} L${s * 0.78},${s * 0.88} L${s * 0.22},${s * 0.88} L${s * 0.22},${s * 0.5} Z`} fill="#e0603a" stroke={INK} strokeWidth={s * 0.06} strokeLinejoin="round" /><rect x={s * 0.42} y={s * 0.62} width={s * 0.16} height={s * 0.26} fill="#5b3a20" /></Svg>;
const EmptyCircle = ({s = 120}) => <Svg w={s} h={s}><circle cx={s / 2} cy={s / 2} r={s * 0.36} fill="none" stroke="#fff" strokeWidth={s * 0.1} /></Svg>;
const UpdArrow = ({s = 120, a = 0}) => <div style={{transform: `rotate(${a}deg)`}}><Svg w={s} h={s}><path d={`M${s * 0.82},${s * 0.5} A${s * 0.32},${s * 0.32} 0 1 1 ${s * 0.6},${s * 0.2}`} stroke="#fff" strokeWidth={s * 0.1} fill="none" strokeLinecap="round" /><path d={`M${s * 0.5},${s * 0.08} L${s * 0.72},${s * 0.2} L${s * 0.52},${s * 0.34} Z`} fill="#fff" /></Svg></div>;
const Clock = ({s = 300, a = 0}) => (
  <Svg w={s} h={s}>
    <circle cx={s / 2} cy={s / 2} r={s * 0.46} fill="#fff8ee" stroke={INK} strokeWidth={s * 0.04} />
    {Array.from({length: 12}, (_, i) => { const q = i / 12 * Math.PI * 2; return <line key={i} x1={s / 2 + Math.cos(q) * s * 0.36} y1={s / 2 + Math.sin(q) * s * 0.36} x2={s / 2 + Math.cos(q) * s * 0.42} y2={s / 2 + Math.sin(q) * s * 0.42} stroke={INK} strokeWidth={s * 0.02} />; })}
    <line x1={s / 2} y1={s / 2} x2={s / 2 + Math.sin(a * Math.PI / 180) * s * 0.34} y2={s / 2 - Math.cos(a * Math.PI / 180) * s * 0.34} stroke={INK} strokeWidth={s * 0.035} strokeLinecap="round" />
    <line x1={s / 2} y1={s / 2} x2={s / 2 + Math.sin(a / 12 * Math.PI / 180) * s * 0.24} y2={s / 2 - Math.cos(a / 12 * Math.PI / 180) * s * 0.24} stroke={INK} strokeWidth={s * 0.05} strokeLinecap="round" />
    <circle cx={s / 2} cy={s / 2} r={s * 0.04} fill={INK} />
  </Svg>
);
const Arrow = ({s = 220, c = '#2e8fe0'}) => <Svg w={s} h={s * 0.6}><path d={`M0,${s * 0.18} L${s * 0.6},${s * 0.18} L${s * 0.6},0 L${s},${s * 0.3} L${s * 0.6},${s * 0.6} L${s * 0.6},${s * 0.42} L0,${s * 0.42} Z`} fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" /></Svg>;
const EggIcon = ({s = 40, c = '#f3e2c8'}) => <Svg w={s} h={s * 1.25}><ellipse cx={s / 2} cy={s * 0.66} rx={s * 0.42} ry={s * 0.56} fill={c} stroke={INK} strokeWidth={s * 0.08} /></Svg>;
const Dots = ({s = 120}) => <Svg w={s} h={s * 0.4}>{[0.2, 0.5, 0.8].map((q) => <circle key={q} cx={s * q} cy={s * 0.2} r={s * 0.09} fill={INK} />)}</Svg>;
const Bubble: React.FC<any> = ({x, y, w = 300, h = 220, t, t0, children, tail = 'left', tone = '#fff'}) => {
  if (t < t0) return null;
  const u = eo((t - t0) / 0.35);
  const tx = tail === 'left' ? -w * 0.42 : w * 0.42;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${u})`}}>
      <div style={{position: 'absolute', left: w / 2 + tx - 22, top: h - 6, width: 34, height: 34, borderRadius: '50%', background: tone, border: `6px solid ${INK}`}} />
      <div style={{position: 'absolute', left: w / 2 + tx * 1.25 - 12, top: h + 36, width: 20, height: 20, borderRadius: '50%', background: tone, border: `5px solid ${INK}`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: tone, border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>{children}</div>
    </div>
  );
};
const PumpIcon = ({s = 90, c = '#e53b2e'}) => <Svg w={s} h={s}><rect x={s * 0.18} y={s * 0.12} width={s * 0.42} height={s * 0.76} rx={s * 0.06} fill={c} stroke={INK} strokeWidth={s * 0.06} /><rect x={s * 0.26} y={s * 0.2} width={s * 0.26} height={s * 0.2} fill="#fff" /><path d={`M${s * 0.6},${s * 0.3} L${s * 0.78},${s * 0.42} L${s * 0.78},${s * 0.74}`} stroke={INK} strokeWidth={s * 0.06} fill="none" strokeLinecap="round" /></Svg>;
const Fly: React.FC<any> = ({cx, cy, t, rr = 60}) => {
  const a = t * 5; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a * 1.3) * rr * 0.6;
  return <div style={{position: 'absolute', left: x - 12, top: y - 10}}><Svg w={24} h={20}><ellipse cx={12} cy={13} rx={7} ry={5} fill={INK} /><ellipse cx={7} cy={6} rx={6} ry={4} fill="#cfe8ff" stroke={INK} strokeWidth={1.5} opacity={0.8 + 0.2 * Math.sin(t * 60)} /><ellipse cx={17} cy={6} rx={6} ry={4} fill="#cfe8ff" stroke={INK} strokeWidth={1.5} /></Svg></div>;
};
const Waves: React.FC<any> = ({x, y, t, t0, n = 3, c = INK}) => {
  if (t < t0) return null;
  return <svg style={{position: 'absolute', left: x - 200, top: y - 200}} width={400} height={400}>{Array.from({length: n}, (_, i) => { const ph = ((t - t0) * 1.2 + i / n) % 1; return <path key={i} d={`M${200 + 40 + ph * 120},${200 - 50 - ph * 60} A${80 + ph * 120},${80 + ph * 120} 0 0 1 ${200 + 40 + ph * 120},${200 + 50 + ph * 60}`} stroke={c} strokeWidth={8} fill="none" opacity={1 - ph} strokeLinecap="round" />; })}</svg>;
};
const Gauge: React.FC<any> = ({cx, cy, r, u}) => {
  const a = (q: number) => Math.PI * (1 - q);
  const pt = (q: number, rr: number) => `${cx + Math.cos(a(q)) * rr},${cy - Math.sin(a(q)) * rr}`;
  const arc = (q0: number, q1: number, col: string) => <path d={`M${pt(q0, r)} A${r},${r} 0 0 1 ${pt(q1, r)}`} stroke={col} strokeWidth={40} fill="none" />;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      <path d={`M${cx - r - 50},${cy + 30} A${r + 50},${r + 50} 0 0 1 ${cx + r + 50},${cy + 30} Z`} fill="#fff" stroke={INK} strokeWidth={10} />
      {arc(0, 0.25, '#e53b2e')}{arc(0.25, 1, '#3fc06b')}
      <line x1={cx} y1={cy} x2={cx + Math.cos(a(u)) * (r - 20)} y2={cy - Math.sin(a(u)) * (r - 20)} stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={24} fill={INK} />
      <g transform={`translate(${cx - 30},${cy - r * 0.62})`}><rect x={6} y={0} width={30} height={46} rx={4} fill={INK} /><path d="M36,12 L48,20 L48,40" stroke={INK} strokeWidth={6} fill="none" /></g>
    </svg>
  );
};


// ---------- shapes (no glyphs) ----------
const QMark = ({s = 160, c = '#e53b2e'}) => <Svg w={s} h={s}><path d={`M${s * 0.3},${s * 0.3} C${s * 0.3},${s * 0.05} ${s * 0.72},${s * 0.05} ${s * 0.72},${s * 0.32} C${s * 0.72},${s * 0.52} ${s * 0.5},${s * 0.52} ${s * 0.5},${s * 0.7}`} stroke={INK} strokeWidth={s * 0.24} fill="none" strokeLinecap="round" /><path d={`M${s * 0.3},${s * 0.3} C${s * 0.3},${s * 0.05} ${s * 0.72},${s * 0.05} ${s * 0.72},${s * 0.32} C${s * 0.72},${s * 0.52} ${s * 0.5},${s * 0.52} ${s * 0.5},${s * 0.7}`} stroke={c} strokeWidth={s * 0.14} fill="none" strokeLinecap="round" /><circle cx={s * 0.5} cy={s * 0.9} r={s * 0.11} fill={INK} /><circle cx={s * 0.5} cy={s * 0.9} r={s * 0.06} fill={c} /></Svg>;
const ZeroRing = ({s = 160, c = '#e53b2e'}) => <Svg w={s} h={s}><circle cx={s / 2} cy={s / 2} r={s * 0.36} fill="none" stroke={INK} strokeWidth={s * 0.26} /><circle cx={s / 2} cy={s / 2} r={s * 0.36} fill="none" stroke={c} strokeWidth={s * 0.15} /></Svg>;
const Equals = ({s = 200, c = '#2e8fe0', cross = false}) => <Svg w={s} h={s}><rect x={s * 0.12} y={s * 0.26} width={s * 0.76} height={s * 0.16} rx={s * 0.05} fill={c} stroke={INK} strokeWidth={s * 0.04} /><rect x={s * 0.12} y={s * 0.58} width={s * 0.76} height={s * 0.16} rx={s * 0.05} fill={c} stroke={INK} strokeWidth={s * 0.04} />{cross && <g><path d={`M${s * 0.1},${s * 0.9} L${s * 0.9},${s * 0.1}`} stroke={INK} strokeWidth={s * 0.18} strokeLinecap="round" /><path d={`M${s * 0.1},${s * 0.9} L${s * 0.9},${s * 0.1}`} stroke="#e53b2e" strokeWidth={s * 0.1} strokeLinecap="round" /></g>}</Svg>;
const Phone = ({w = 200, ring = true}) => { const h = w * 1.8; return <Svg w={w} h={h}><rect x={w * 0.05} y={w * 0.05} width={w * 0.9} height={h - w * 0.1} rx={w * 0.14} fill="#33363d" stroke={INK} strokeWidth={w * 0.05} /><rect x={w * 0.14} y={w * 0.2} width={w * 0.72} height={h - w * 0.4} rx={w * 0.06} fill="#5b7f95" />{ring && <circle cx={w / 2} cy={h / 2} r={w * 0.22} fill="none" stroke="#fff" strokeWidth={w * 0.09} />}</Svg>; };
const TVbox = ({w = 520, ring = true}) => { const h = w * 0.72; return <Svg w={w} h={h + 60}><rect x={w * 0.04} y={w * 0.04} width={w * 0.92} height={h - w * 0.06} rx={w * 0.05} fill="#3b3f48" stroke={INK} strokeWidth={w * 0.025} /><rect x={w * 0.1} y={w * 0.1} width={w * 0.8} height={h - w * 0.2} rx={w * 0.03} fill="#4f86a8" />{ring && <circle cx={w / 2} cy={h / 2} r={h * 0.22} fill="none" stroke="#e53b2e" strokeWidth={h * 0.1} />}<rect x={w * 0.38} y={h - w * 0.02} width={w * 0.24} height={50} fill="#3b3f48" stroke={INK} strokeWidth={6} /></Svg>; };
const TagIcon = ({s = 200}) => <Svg w={s} h={s * 0.7}><path d={`M${s * 0.05},${s * 0.35} L${s * 0.25},${s * 0.08} L${s * 0.95},${s * 0.08} L${s * 0.95},${s * 0.62} L${s * 0.25},${s * 0.62} Z`} fill="#f4ead2" stroke={INK} strokeWidth={s * 0.04} strokeLinejoin="round" /><circle cx={s * 0.22} cy={s * 0.35} r={s * 0.04} fill={INK} /><g transform={`translate(${s * 0.42},${s * 0.02}) scale(${s * 0.0035})`}><path d="M30,60 C30,10 110,10 110,60 C110,95 70,90 70,130" stroke={INK} strokeWidth={26} fill="none" strokeLinecap="round" /><circle cx={70} cy={165} r={14} fill={INK} /></g></Svg>;
const Drop = ({s = 100}) => <Svg w={s} h={s}><path d={`M${s / 2},${s * 0.08} C${s * 0.8},${s * 0.45} ${s * 0.85},${s * 0.9} ${s / 2},${s * 0.92} C${s * 0.15},${s * 0.9} ${s * 0.2},${s * 0.45} ${s / 2},${s * 0.08} Z`} fill="#2e8fe0" stroke={INK} strokeWidth={s * 0.06} /></Svg>;
const Bolt = ({s = 100}) => <Svg w={s} h={s}><path d={`M${s * 0.6},${s * 0.04} L${s * 0.2},${s * 0.56} L${s * 0.46},${s * 0.56} L${s * 0.36},${s * 0.96} L${s * 0.8},${s * 0.4} L${s * 0.54},${s * 0.4} Z`} fill="#ff8a2e" stroke={INK} strokeWidth={s * 0.05} strokeLinejoin="round" /></Svg>;
const Tools = ({s = 120}) => <Svg w={s} h={s}><path d={`M${s * 0.2},${s * 0.85} L${s * 0.65},${s * 0.35}`} stroke={INK} strokeWidth={s * 0.14} strokeLinecap="round" /><path d={`M${s * 0.2},${s * 0.85} L${s * 0.65},${s * 0.35}`} stroke="#9a6236" strokeWidth={s * 0.08} strokeLinecap="round" /><circle cx={s * 0.7} cy={s * 0.28} r={s * 0.2} fill="#9aa3ad" stroke={INK} strokeWidth={s * 0.05} /></Svg>;
const Home = ({x, y, w = 200, wall = '#e8d7b0', roof = '#c4462f', lit = true}) => <svg style={{position: 'absolute', left: x - w / 2, top: y - w}} width={w} height={w} viewBox="0 0 200 200"><rect x="30" y="85" width="140" height="115" fill={wall} stroke={INK} strokeWidth="6" /><path d="M16,92 L100,22 L184,92 Z" fill={roof} stroke={INK} strokeWidth="6" strokeLinejoin="round" /><rect x="78" y="120" width="44" height="80" fill="#6b3f22" stroke={INK} strokeWidth="5" /><rect x="40" y="108" width="28" height="28" fill={lit ? '#ffb347' : '#3b4252'} stroke={INK} strokeWidth="4" /><rect x="132" y="108" width="28" height="28" fill={lit ? '#ffb347' : '#3b4252'} stroke={INK} strokeWidth="4" /></svg>;
const Skyline = ({dark = false}) => <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>{[[80, 520, 190, '#8c9cb8'], [280, 400, 170, '#a9a0c8'], [470, 560, 150, '#7fb0a8'], [640, 340, 200, '#c8a07c'], [860, 480, 170, '#8c9cb8'], [1050, 380, 190, '#a9a0c8'], [1250, 560, 160, '#7fb0a8'], [1430, 430, 200, '#c8a07c'], [1640, 520, 190, '#8c9cb8']].map(([x, y, w, c], i) => <g key={i}><rect x={x} y={y} width={w} height={GR - y} fill={c} stroke={INK} strokeWidth={6} />{Array.from({length: 3}, (_, r) => Array.from({length: 2}, (_, q) => <rect key={r * 2 + q} x={x + 28 + q * (w / 2 - 14)} y={y + 40 + r * 70} width={36} height={40} fill={dark ? '#3b4252' : '#fff3d6'} stroke={INK} strokeWidth={4} />))}</g>)}</svg>;
const Chain: React.FC<any> = ({x0, x1, y, n = 5, brk = -1, bt = 1e9, t}) => {
  const step = (x1 - x0) / (n - 1);
  return <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>{Array.from({length: n}, (_, i) => { const x = x0 + i * step; const broken = i === brk && t > bt; const sh = broken ? Math.sin((t - bt) * 30) * 6 : 0; return <g key={i} transform={`translate(${x + sh},${y + (broken ? Math.min(60, (t - bt) * 80) : 0)})`}><ellipse cx={0} cy={0} rx={step * 0.42} ry={step * 0.28} fill="none" stroke={INK} strokeWidth={26} />{<ellipse cx={0} cy={0} rx={step * 0.42} ry={step * 0.28} fill="none" stroke={broken ? '#e53b2e' : '#9aa3ad'} strokeWidth={14} />}</g>; })}</svg>;
};

// ---------- whole-image shots ----------
const Ill: React.FC<any> = ({img, t, a, b, kb, punch = [], over}) => {
  const u = clamp((t - a) / (b - a));
  let z = kb[0][1], fx = kb[0][2], fy = kb[0][3];
  for (let i = 0; i < kb.length - 1; i++) {
    if (u >= kb[i][0] && u <= kb[i + 1][0]) { const q = eio((u - kb[i][0]) / (kb[i + 1][0] - kb[i][0])); z = lerp(kb[i][1], kb[i + 1][1], q); fx = lerp(kb[i][2], kb[i + 1][2], q); fy = lerp(kb[i][3], kb[i + 1][3], q); }
  }
  if (u > kb[kb.length - 1][0]) { const l = kb[kb.length - 1]; z = l[1]; fx = l[2]; fy = l[3]; }
  for (const [pt, amt] of punch) if (t >= pt) z *= 1 + amt * Math.exp(-(t - pt) * 7);
  const ox = (0.5 - fx) * (z - 1) * W, oy = (0.5 - fy) * (z - 1) * H;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 50%', transform: `translate(${ox}px,${oy}px) scale(${z * 1.02})`}}>
        <Img src={staticFile(`mnylf/img_${img}.png`)} style={{width: W, height: H, objectFit: 'cover'}} />
        {over && over(t)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- shots: SHOTS[row] = [[fromTime, shot], ...] ----------
const SHOTS: Record<number, any[]> = {};
const I = (img: string, kb: any, extra: any = {}) => ({ill: img, kb, ...extra});
const C = (bg: any, render: any, cam: any = {z0: 1, z1: 1.03, fy: 700}) => ({bg, render, cam});
const seq = (r: number, ...parts: any[]) => { SHOTS[r] = parts; };
const M = (s: string, x: number, t: number, extra: any = {}) => <Sp s={s} x={x} y={GR} r={80} t={t} {...extra} />;
const PP = (s: string, x: number, h: number, t: number, extra: any = {}) => <Sp s={s} x={x} y={GR} h={h} t={t} {...extra} />;


// ---------- new components (v4) ----------
const Bg: React.FC<any> = ({n, dark = 0, op = 1}) => <><Img src={staticFile(`mnylf/bg_${n}.png`)} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, objectFit: 'cover', opacity: op}} />{dark > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(8,10,30,${dark})`}} />}</>;
const fmt = (n: number) => Math.max(0, Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const PhoneBal: React.FC<any> = ({w = 380, val, shake = 0}) => {
  const h = w * 1.8; const zero = val <= 0;
  return (
    <div style={{position: 'relative', width: w, height: h, transform: `translate(${Math.sin(shake * 60) * 6 * (shake > 0 ? 1 : 0)}px,0)`}}>
      <Svg w={w} h={h}><rect x={w * 0.05} y={w * 0.05} width={w * 0.9} height={h - w * 0.1} rx={w * 0.14} fill="#23262c" stroke={INK} strokeWidth={w * 0.05} /><rect x={w * 0.14} y={w * 0.2} width={w * 0.72} height={h - w * 0.4} rx={w * 0.06} fill={zero ? '#3a1414' : '#0f2a22'} /></Svg>
      <div style={{position: 'absolute', left: w * 0.14, top: h / 2 - w * 0.2, width: w * 0.72, textAlign: 'center', fontFamily: IMPACT, fontSize: w * 0.15, color: zero ? '#ff3b30' : '#35e08a', letterSpacing: 1}}>{'$' + fmt(val)}</div>
    </div>
  );
};
const Piggy: React.FC<any> = ({s = 420, crack = 0, shake = 0}) => (
  <div style={{transform: `rotate(${Math.sin(shake * 55) * 6 * (shake > 0 ? 1 : 0)}deg)`}}>
    <Svg w={s} h={s * 0.8}>
      <path d={`M${s * 0.2},${s * 0.2} L${s * 0.28},${s * 0.02} L${s * 0.4},${s * 0.18} Z`} fill="#e8789a" stroke={INK} strokeWidth={s * 0.02} strokeLinejoin="round" />
      {[0.26, 0.68].map((q) => <rect key={q} x={s * q} y={s * 0.52} width={s * 0.09} height={s * 0.24} rx={s * 0.03} fill="#e8789a" stroke={INK} strokeWidth={s * 0.02} />)}
      <ellipse cx={s * 0.48} cy={s * 0.38} rx={s * 0.4} ry={s * 0.28} fill="#f59db8" stroke={INK} strokeWidth={s * 0.025} />
      <ellipse cx={s * 0.9} cy={s * 0.42} rx={s * 0.09} ry={s * 0.12} fill="#e8789a" stroke={INK} strokeWidth={s * 0.02} />
      <circle cx={s * 0.88} cy={s * 0.4} r={s * 0.012} fill={INK} /><circle cx={s * 0.92} cy={s * 0.44} r={s * 0.012} fill={INK} />
      <circle cx={s * 0.72} cy={s * 0.28} r={s * 0.02} fill={INK} />
      <path d={`M${s * 0.38},${s * 0.13} L${s * 0.56},${s * 0.13}`} stroke={INK} strokeWidth={s * 0.02} strokeLinecap="round" />
      {crack > 0 && <path d={`M${s * 0.5},${s * 0.12} L${s * 0.46},${s * 0.24} L${s * 0.54},${s * 0.32} L${s * 0.47},${s * 0.46} L${s * 0.52},${s * 0.62}`} stroke={INK} strokeWidth={s * 0.022} fill="none" strokeLinejoin="round" />}
    </Svg>
  </div>
);
const FirstAid = ({s = 130}) => <Svg w={s} h={s}><circle cx={s / 2} cy={s / 2} r={s * 0.45} fill="#fff" stroke={INK} strokeWidth={s * 0.06} /><path d={`M${s * 0.38},${s * 0.2} H${s * 0.62} V${s * 0.38} H${s * 0.8} V${s * 0.62} H${s * 0.62} V${s * 0.8} H${s * 0.38} V${s * 0.62} H${s * 0.2} V${s * 0.38} H${s * 0.38} Z`} fill="#e53b2e" stroke={INK} strokeWidth={s * 0.035} strokeLinejoin="round" /></Svg>;
const Toolbox = ({s = 260}) => <Svg w={s} h={s * 0.7}><path d={`M${s * 0.32},${s * 0.22} V${s * 0.1} H${s * 0.68} V${s * 0.22}`} fill="none" stroke={INK} strokeWidth={s * 0.05} /><rect x={s * 0.06} y={s * 0.22} width={s * 0.88} height={s * 0.44} rx={s * 0.04} fill="#d9442f" stroke={INK} strokeWidth={s * 0.035} /><rect x={s * 0.44} y={s * 0.3} width={s * 0.12} height={s * 0.1} fill="#9aa3ad" stroke={INK} strokeWidth={s * 0.02} /></Svg>;
const Vignette: React.FC<any> = ({t}) => { const ph = (t % 1.15) / 1.15; const pulse = Math.exp(-ph * 6) * 0.22 + 0.1; return <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${pulse + 0.12}) 100%)`, pointerEvents: 'none'}} />; };

// ---------- shots (v4: painted backgrounds + cut-out cast) ----------
const bgs = (n: string, _dark = 0) => () => <Bg n={n} dark={0} />;
const Fig = (s: string, x: number, h: number, t: number, extra: any = {}) => <Sp s={s} x={x} y={GR} h={h} t={t} {...extra} />;
const trn = (a: number, b: number, t: number) => eio((t - a) / (b - a));

// ===== HOOK (rows 1-5) =====
{ const r = 1; seq(r,
  [0, I('01', [[0, 1.0, 0.5, 0.5], [1, 1.2, 0.42, 0.45]], {punch: [[wd(r, 'disappeared'), 0.05]]})],
  [wd(r, 'discovering') - 0.1, I('01', [[0, 1.5, 0.28, 0.66], [1, 1.7, 0.27, 0.62]])]); }
{ const r = 2, zr = wd(r, 'Zero'), wl = wd(r, 'wallet'), sv = wd(r, 'savings'), gn = wd(r, 'Gone');
  seq(r,
  [0, C(bgs('night', 0.45), (t) => { const u = clamp((t - S0(r) - 0.2) / (zr - S0(r) - 0.2)); const v = 8472310 * Math.pow(1 - u, 2.2); return (<div style={{position: 'absolute', left: 960 - 230, top: 90}}><PhoneBal w={460} val={t >= zr ? 0 : v} shake={t >= zr ? t - zr < 0.5 ? t : 0 : 0} /></div>); }, {z0: 1.0, z1: 1.14, fy: 450})],
  [wl - 0.15, C(bgs('square'), (t) => (<>{M('m_wallet', 800, t, {r: 95})}<Pop t={t} t0={wd(r, 'Useless') - 0.1} x={1250} y={450}><XMark s={190} /></Pop></>), {z0: 1.0, z1: 1.08, fy: 600})],
  [sv - 0.15, C(bgs('square', 0.1), (t) => (<div style={{position: 'absolute', left: 960 - 230, top: 400}}><Piggy s={460} crack={t >= gn ? 1 : 0} shake={t >= gn ? t - gn < 0.6 ? t : 0 : 0} /></div>), {z0: 1.0, z1: 1.12, fy: 560})]); }
{ const r = 3, ab = wd(r, 'absolutely');
  const zb = (x: number, y: number, t0: number) => (t: number) => <Bubble key={x} x={x} y={y} w={210} h={160} t={t} t0={t0} tail="left"><ZeroRing s={110} c="#e53b2e" /></Bubble>;
  seq(r,
  [0, I('03', [[0, 1.0, 0.5, 0.5], [1, 1.15, 0.5, 0.45]], {over: (t: number) => <>{[[470, 150, 'millionaire'], [880, 165, 'billionaire'], [1300, 150, 'government']].map(([x, y, k]) => zb(x as number, y as number, wd(r, k as string))(t))}</>})],
  [ab - 0.3, I('03', [[0, 1.5, 0.5, 0.66], [1, 1.7, 0.5, 0.62]], {punch: [[ab, 0.03]]})]); }
{ const r = 4;
  seq(r,
  [0, I('04', [[0, 1.0, 0.5, 0.5], [1, 1.12, 0.45, 0.55]])],
  [wd(r, 'food') - 0.1, I('04', [[0, 1.45, 0.2, 0.72], [1, 1.6, 0.25, 0.7]])],
  [wd(r, 'houses') - 0.1, I('04', [[0, 1.5, 0.78, 0.62], [1, 1.65, 0.8, 0.6]])],
  [wd(r, 'cars') - 0.15, I('04', [[0, 1.5, 0.55, 0.3], [1, 1.65, 0.6, 0.3]])],
  [wd(r, 'electricity') - 0.3, I('04', [[0, 1.6, 0.78, 0.2], [1, 1.2, 0.6, 0.4]])]); }
{ const r = 5, cl = wd(r, 'collapse'), wo = wd(r, 'Would'), ev = wd(r, 'everyone'), lt = wd(r, "Let's"), fin = S1(r) - 1.05;
  seq(r,
  [0, C(bgs('storm'), (t) => (<>{M('m_worry', 640, t, {r: 105})}<Pop t={t} t0={cl - 0.2} x={1240} y={420} sc={1.8}><QMark s={200} /></Pop></>), {z0: 1.0, z1: 1.1, fy: 700})],
  [wd(r, 'more') - 0.2, C(bgs('square'), (t) => { const w = Math.sin((t - S0(r)) * 3) * 8; return (<>
    {Fig('nb_man', 560, 480, t)}{Fig('nb_woman', 1360, 470, t)}
    <Pop t={t} t0={wo} x={960} y={420} sc={1.7}><div style={{transform: `rotate(${w}deg)`}}><Equals s={220} /></div></Pop></>); }, {z0: 1.0, z1: 1.08, fy: 700})],
  [ev - 0.3, C(() => <div style={{position: 'absolute', inset: 0, background: '#050505'}} />, (t) => { const u = clamp((t - lt + 0.1) / (fin - lt + 0.1)); const v = 1e14 * Math.pow(1 - u, 3); const done = t >= fin; return (<>
    <div style={{position: 'absolute', left: 0, top: 380, width: W, textAlign: 'center', fontFamily: IMPACT, fontSize: 150, color: done ? '#ff3b30' : '#35e08a', transform: `translate(${Math.sin(t * 70) * (done ? 0 : 5 * u)}px,0) scale(${1 + 0.05 * u})`}}>{'$' + fmt(done ? 0 : v)}</div>
    {t >= fin + 0.35 && <div style={{position: 'absolute', inset: 0, background: '#000'}} />}</>); }, {z0: 1.0, z1: 1.2, fy: 500})]); }

// ===== CHAPTER 1 (rows 6-13) =====
{ const r = 6;
  seq(r,
  [0, I('06', [[0, 1.0, 0.5, 0.5], [1, 1.1, 0.52, 0.5]])],
  [wd(r, 'check') - 0.1, I('06', [[0, 1.55, 0.5, 0.42], [1, 1.7, 0.5, 0.45]])],
  [wd(r, 'banking') - 0.3, I('06', [[0, 1.2, 0.6, 0.5], [1, 1.0, 0.5, 0.5]], {punch: [[wd(r, 'banking'), 0.03]]})]); }
{ const r = 7, ev = wd(r, 'Every'), mo = wd(r, 'Money');
  seq(r,
  [0, C(bgs('night', 0.3), (t) => (<><div style={{position: 'absolute', left: 1020, top: 230}}><TVbox w={680} /></div>{M('m_deadpan', 520, t, {r: 95})}</>), {z0: 1.0, z1: 1.07, fy: 650})],
  [ev - 0.1, C(bgs('night', 0.3), (t) => (<><div style={{position: 'absolute', left: 1020, top: 230}}><TVbox w={680} /></div>{M('m_worry', 520, t, {r: 95})}{[0, 1, 2].map((i) => <Pop key={i} t={t} t0={ev + i * 0.35} x={1160 + i * 190} y={180}><House s={120} /></Pop>)}</>), {z0: 1.04, z1: 1.1, fy: 650})],
  [mo - 0.1, C(bgs('night', 0.3), (t) => { const u = clamp((t - mo) / 2.2); return (<><div style={{position: 'absolute', left: 1020, top: 230}}><TVbox w={680} /></div>{M('m_worry', 520, t, {r: 95})}<Sp s="banknote" x={lerp(1000, 1500, u)} y={lerp(640, 90, u)} h={150} t={t} op={1 - clamp((u - 0.5) * 2)} rot={u * 40} shadow={false} noidle /></>); }, {z0: 1.1, z1: 1.0, fy: 650})]); }
{ const r = 8;
  seq(r,
  [0, I('08', [[0, 1.0, 0.45, 0.5], [1, 1.12, 0.45, 0.5]])],
  [wd(r, 'checkout') - 0.2, I('08', [[0, 1.3, 0.35, 0.5], [1, 1.45, 0.4, 0.5]])],
  [wd(r, 'cashier') - 0.3, I('08', [[0, 1.5, 0.78, 0.4], [1, 1.7, 0.78, 0.38]], {punch: [[wd(r, 'refuses'), 0.03]]})]); }
{ const r = 9, ch = wd(r, 'charge');
  seq(r,
  [0, C(bgs('shop'), (t) => (<>{Fig('cashier', 1400, 500, t, {shadow: false})}{M('m_deadpan', 520, t, {r: 95})}</>), {z0: 1.0, z1: 1.07, fy: 700})],
  [wd(r, 'Because') - 0.1, C(bgs('shop'), (t) => (<>{Fig('cashier', 1400, 500, t, {shadow: false, rot: Math.sin((t - ch) * 7) * 2})}{M('m_shrug', 520, t, {r: 95})}<Pop t={t} t0={ch - 0.2} x={1000} y={330} sc={1.5}><TagIcon s={220} /></Pop></>), {z0: 1.07, z1: 1.14, fy: 700})]); }
{ const r = 10, ph = wd(r, 'phone'), wt = wd(r, 'watch'), ky = wd(r, 'car'), sm = wd(r, 'something');
  seq(r,
  [0, C(bgs('shop'), (t) => (<>{Fig('cashier', 1480, 500, t, {shadow: false})}{M('m_throw', 520, t, {r: 95})}
    <Sp s="phone" x={900} y={780} h={170} t={t} t0={ph - 0.1} enter="drop" shadow={false} noidle /><Sp s="watch2" x={1060} y={780} h={150} t={t} t0={wt - 0.1} enter="drop" shadow={false} noidle /><Sp s="keys" x={1210} y={780} h={130} t={t} t0={ky - 0.1} enter="drop" shadow={false} noidle /></>), {z0: 1.0, z1: 1.08, fy: 700})],
  [sm - 0.1, C(bgs('shop'), (t) => (<>{Fig('cashier', 1480, 500, t, {shadow: false})}{M('m_shrug', 520, t, {r: 95})}
    <Sp s="loaf" x={1130} y={620} h={150} t={t} t0={sm} enter="pop" shadow={false} /><Pop t={t} t0={wd(r, 'actually') - 0.2} x={800} y={430}><Check s={150} /></Pop></>), {z0: 1.08, z1: 1.15, fy: 700})]); }
{ const r = 11, mo = wd(r, 'Money'), nv = wd(r, 'never'), fd = wd(r, 'food'), wt = wd(r, 'water'), el = wd(r, 'electricity');
  seq(r,
  [0, C(bgs('meadow'), (t) => (<>{M('m_point', 420, t, {r: 95, poses: [[0, 'm_deadpan'], [mo - 0.1, 'm_point']]})}<Sp s="banknote" x={900} y={640} h={190} t={t} t0={mo - 0.15} enter="pop" shadow={false} noidle /><Pop t={t} t0={nv} x={900} y={480}><XMark s={170} /></Pop></>), {z0: 1.0, z1: 1.07, fy: 700})],
  [fd - 0.25, C(bgs('meadow'), (t) => (<>{M('m_shrug', 420, t, {r: 95})}<Sp s="crate_veg" x={1000} y={780} h={210} t={t} t0={fd - 0.1} enter="pop" /><Pop t={t} t0={wt - 0.1} x={1350} y={640}><Drop s={190} /></Pop><Pop t={t} t0={el - 0.1} x={1650} y={640}><Bolt s={190} /></Pop></>), {z0: 1.07, z1: 1.14, fy: 700})]); }
{ const r = 12, sy = wd(r, 'system'), ex = wd(r, 'exchange');
  seq(r, [0, C(bgs('meadow'), (t) => { const u = trn(ex, ex + 0.8, t); return (<>
    {Fig('nb_man', 520, 470, t)}{Fig('nb_woman', 1400, 460, t)}
    {t < sy ? <Sp s="banknote" x={960} y={560} h={170} t={t} t0={S0(r) + 0.2} enter="pop" shadow={false} /> : <Pop t={t} t0={sy} x={960} y={520} sc={1.4}><QMark s={190} /></Pop>}
    <Sp s="apple" x={lerp(640, 1280, u)} y={lerp(560, 540, u)} h={110} t={t} t0={ex - 0.5} enter="pop" shadow={false} noidle /><Sp s="loaf" x={lerp(1280, 640, u)} y={lerp(540, 560, u)} h={90} t={t} t0={ex - 0.5} enter="pop" shadow={false} noidle /></>); }, {z0: 1.0, z1: 1.08, fy: 700})]); }
{ const r = 13, di = wd(r, 'disaster');
  seq(r, [0, C((t) => <><Bg n="meadow" /><Bg n="storm" op={trn(S0(r) + 0.5, di + 0.5, t)} /></>, (t) => (<>{M('m_worry', 760, t, {r: 110})}</>), {z0: 1.0, z1: 1.15, fy: 600})]); }

// ===== CHAPTER 2 (rows 14-21) =====
{ const r = 14;
  seq(r,
  [0, I('14', [[0, 1.0, 0.5, 0.5], [1, 1.1, 0.5, 0.5]])],
  [wd(r, 'bartering') - 0.2, I('14', [[0, 1.5, 0.3, 0.45], [1, 1.65, 0.33, 0.45]])],
  [wd(r, 'Sounds') - 0.2, I('14', [[0, 1.4, 0.65, 0.5], [1, 1.2, 0.5, 0.5]])]); }
{ const r = 15, dc = wd(r, 'doctor'), md = wd(r, 'medicine'), wg = wd(r, 'willing');
  seq(r,
  [0, C(bgs('meadow'), (t) => (<>{Fig('farmer_sack', 700, 500, t)}<Pop t={t} t0={md - 0.2} x={1180} y={560}><FirstAid s={170} /></Pop></>), {z0: 1.0, z1: 1.08, fy: 700})],
  [dc - 0.2, C(bgs('meadow'), (t) => (<>{Fig('farmer_sack', 520, 480, t)}{Fig('doctor', 1380, 480, t, {t0: dc, enter: 'right'})}<Pop t={t} t0={wg} x={950} y={440}><Check s={150} /></Pop></>), {z0: 1.08, z1: 1.0, fy: 700})]); }
{ const r = 16, po = wd(r, 'potatoes'), sh = wd(r, 'shoes');
  seq(r,
  [0, C(bgs('meadow', 0.05), (t) => (<>{Fig('farmer_sack', 520, 480, t)}{Fig('doctor', 1380, 480, t, {rot: t > sh ? Math.sin((t - sh) * 9) * 3 : 0})}<Sp s="potatoes" x={950} y={640} h={190} t={t} t0={po - 0.1} enter="pop" /><Pop t={t} t0={po + 0.3} x={950} y={500}><XMark s={160} /></Pop></>), {z0: 1.0, z1: 1.08, fy: 700})],
  [sh - 0.2, C(bgs('meadow', 0.05), (t) => (<>{Fig('doctor', 960, 560, t)}<Sp s="shoes2" x={1400} y={700} h={160} t={t} t0={sh} enter="pop" /></>), {z0: 1.0, z1: 1.12, fy: 700})]); }
{ const r = 17, sm = wd(r, 'shoemaker'), gt = wd(r, 'get'), rt = wd(r, 'return');
  seq(r,
  [0, C(bgs('square'), (t) => (<>{Fig('farmer_sack', 380, 450, t)}{Fig('shoemaker2', 960, 450, t, {t0: sm - 0.1, enter: 'pop'})}<Pop t={t} t0={sm + 0.2} x={670} y={430}><Arrow s={200} /></Pop></>), {z0: 1.0, z1: 1.08, fy: 700})],
  [gt - 0.2, C(bgs('square'), (t) => (<>{Fig('farmer_sack', 380, 450, t)}{Fig('shoemaker2', 960, 450, t)}{Fig('doctor', 1540, 450, t, {t0: rt - 0.3, enter: 'right'})}<Sp s="shoes2" x={680} y={780} h={110} t={t} t0={gt} enter="pop" shadow={false} /><Pop t={t} t0={rt} x={1250} y={430}><Arrow s={200} /></Pop></>), {z0: 1.08, z1: 1.14, fy: 700})]); }
{ const r = 18, fu = wd(r, 'Fuel'), el = wd(r, 'Electricity'), cl = wd(r, 'Clothes'), fd = wd(r, 'Food');
  seq(r, [0, C(bgs('square', 0.1), (t) => (<>{M('m_strain', 330, t, {r: 95})}
    <Sp s="jerry" x={750} y={760} h={190} t={t} t0={fu - 0.1} enter="drop" /><Pop t={t} t0={el - 0.1} x={1010} y={620}><Bolt s={190} /></Pop><Sp s="shoes2" x={1300} y={760} h={130} t={t} t0={cl - 0.1} enter="drop" /><Sp s="crate_veg" x={1640} y={780} h={190} t={t} t0={fd - 0.1} enter="drop" />
    {[880, 1160, 1470].map((x, i) => <Pop key={x} t={t} t0={[el, cl, fd][i] - 0.2} x={x} y={470}><Arrow s={140} /></Pop>)}</>), {z0: 1.0, z1: 1.1, fy: 700})]); }
{ const r = 19, ez = wd(r, 'easier'), pr = wd(r, 'important');
  seq(r,
  [0, C(bgs('sunset', 0.2), (t) => { const u = trn(ez - 0.4, ez + 0.4, t); const tang = (q: number) => `M500,700 C${700 + q * 120},${380 + q * 60} ${1000 - q * 140},${900 - q * 80} 1450,${420 + q * 110}`; return (<>
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>{[0, 1, 2].map((q) => <path key={q} d={u < 1 ? tang(q) : 'M500,700 L1450,700'} stroke="#fff" strokeWidth={u < 1 ? 7 : 16} fill="none" opacity={u < 1 ? 1 - u * 0.3 : q === 0 ? 1 : 0} />)}</svg>
    {M('m_strain', 330, t, {r: 95, poses: [[0, 'm_strain'], [ez - 0.2, 'm_cheer']]})}
    <Sp s="token" x={960} y={650} h={190} t={t} t0={pr - 0.2} enter="pop" shadow={false} /></>); }, {z0: 1.0, z1: 1.1, fy: 700})],
  [ez - 0.3, C(bgs('sunset', 0.2), (t) => (<>{M('m_cheer', 330, t, {r: 95})}<svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}><path d="M500,700 L1450,700" stroke="#fff" strokeWidth={16} /></svg><Sp s="token" x={960} y={740} h={220} t={t} shadow={false} /><Sp s="loaf" x={1550} y={780} h={110} t={t} t0={ez} enter="pop" shadow={false} /></>), {z0: 1.1, z1: 1.18, fy: 700})]); }
{ const r = 20, va = wd(r, 'valuable');
  seq(r, [0, C(bgs('square'), (t) => (<>{M('m_shrug', 620, t, {r: 100})}{[['baker', 1250, 330], ['barber', 1500, 330], ['fuelman', 1750, 330]].map(([s, x, h]: any, i) => <Sp key={s} s={s} x={x} y={GR - 40} h={h} t={t} />)}<Sp s="loaf" x={1250} y={540} h={90} t={t} shadow={false} /><Sp s="apple" x={1500} y={540} h={80} t={t} shadow={false} /><Pop t={t} t0={va} x={620} y={330} sc={1.5}><QMark s={190} /></Pop></>), {z0: 1.0, z1: 1.1, fy: 700})]); }
{ const r = 21;
  seq(r,
  [0, I('21', [[0, 1.0, 0.5, 0.55], [1, 1.1, 0.5, 0.55]])],
  [wd(r, 'industries') - 0.2, I('21', [[0, 1.4, 0.4, 0.6], [1, 1.6, 0.5, 0.6]], {punch: [[wd(r, 'industries'), 0.03]]})]); }

// ===== CHAPTER 3 (rows 22-28) =====
{ const r = 22; seq(r, [0, I('22', [[0, 1.0, 0.4, 0.55], [1, 1.14, 0.55, 0.55]], {punch: [[wd(r, 'Why'), 0.04]]})]); }
{ const r = 23, ra = wd(r, 'raw'), el = wd(r, 'electricity'), tr = wd(r, 'transportation'), sp = wd(r, 'spare'), ag = wd(r, 'agreements');
  const icons = (t: number) => (<>
    <Sp s="crates" x={520} y={640} h={190} t={t} t0={ra - 0.1} enter="pop" shadow={false} noidle /><Pop t={t} t0={el - 0.1} x={760} y={330}><Bolt s={190} /></Pop><Sp s="truck2" x={1330} y={460} w={330} t={t} t0={tr - 0.1} enter="pop" shadow={false} noidle /><Pop t={t} t0={sp - 0.1} x={1500} y={680}><Tools s={170} /></Pop><Pop t={t} t0={ag - 0.1} x={960} y={190}><Equals s={160} c="#cfd8e3" /></Pop></>);
  seq(r,
  [0, C(bgs('yard'), (t) => (<>{Fig('mechanic', 960, 470, t)}{icons(t)}</>), {z0: 1.0, z1: 1.08, fy: 700})],
  [wd(r, 'thousands') - 0.2, C(bgs('yard'), (t) => (<>{Fig('mechanic', 960, 470, t)}{icons(t)}<svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>{[[520, 640], [760, 330], [1330, 460], [1500, 680], [960, 190]].map(([x, y]: any, i) => <line key={i} x1={960} y1={640} x2={x} y2={y} stroke="#fff" strokeWidth={6} strokeDasharray="14 12" opacity={clamp((t - wd(r, 'thousands') + 0.1) * 2)} />)}</svg></>), {z0: 1.1, z1: 1.0, fy: 700})]); }
{ const r = 24, s0 = S0(r);
  seq(r, [0, C(bgs('yard', 0.1), (t) => (<>{[420, 690, 960, 1230, 1500].map((x, i) => <Sp key={x} s="token" x={x} y={GR - 100 + (i % 2) * 20} h={200} t={t} t0={s0 + i * 0.12} enter="pop" shadow={false} noidle filter={`grayscale(${clamp((t - s0 - 0.5 - i * 0.3) / 0.4)}) brightness(${1 - 0.1 * clamp((t - s0 - 0.5 - i * 0.3) / 0.4)})`} />)}{M('m_worry', 960, t, {r: 90, y: 1030})}</>), {z0: 1.0, z1: 1.1, fy: 700})]); }
{ const r = 25, nt = wd(r, 'necessarily'), us = wd(r, 'useful');
  seq(r, [0, C(bgs('yard'), (t) => (<>{Fig('truck2', 1380, 0, t, {w: 640, shadow: true})}{Fig('driver', 560, 360, t)}<Pop t={t} t0={us} x={560} y={420}><XMark s={150} /></Pop></>), {z0: 1.0, z1: 1.1, fy: 700})]); }
{ const r = 26, hs = wd(r, 'hospital');
  seq(r,
  [0, I('26', [[0, 1.0, 0.6, 0.5], [1, 1.12, 0.6, 0.5]], {over: (t: number) => <div style={{position: 'absolute', inset: 0, background: '#000', opacity: Math.max(0, Math.sin(t * 17) * Math.sin(t * 5.3)) * 0.35}} />})],
  [hs - 0.2, I('26', [[0, 1.5, 0.8, 0.5], [1, 1.7, 0.82, 0.5]], {over: (t: number) => <div style={{position: 'absolute', inset: 0, background: '#000', opacity: Math.max(0, Math.sin(t * 17) * Math.sin(t * 5.3)) * 0.35}} />})]); }
{ const r = 27, ap = wd(r, 'apart'), sy = wd(r, 'systems');
  seq(r,
  [0, C(bgs('storm'), (t) => (<>{M('m_worry', 420, t, {r: 100})}<Chain x0={760} x1={1700} y={640} n={5} t={t} /></>), {z0: 1.0, z1: 1.08, fy: 700})],
  [sy - 0.1, C(bgs('storm'), (t) => (<>{M('m_worry', 420, t, {r: 100})}<Chain x0={760} x1={1700} y={640} n={5} brk={2} bt={ap - 0.15} t={t} /><Pop t={t} t0={ap} x={1230} y={440}><XMark s={150} /></Pop></>), {z0: 1.08, z1: 1.16, fy: 700})]); }
{ const r = 28, gt = wd(r, 'getting'), enough = wd(r, 'enough');
  const food = (t: number) => (<><Sp s="crate_veg" x={260} y={GR} h={250} t={t} t0={enough - 0.2} enter="pop" /><Sp s="crate_veg" x={470} y={GR} h={220} t={t} t0={enough - 0.1} enter="pop" /><Sp s="loaf" x={380} y={640} h={110} t={t} t0={enough} enter="pop" shadow={false} /></>);
  seq(r,
  [0, C(bgs('sunset'), (t) => (<>{food(t)}{M('m_shrug', 900, t, {r: 95})}</>), {z0: 1.0, z1: 1.08, fy: 700})],
  [gt - 0.2, C(bgs('sunset'), (t) => (<>{food(t)}<svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}><rect x={640} y={860} width={230} height={26} fill="#7a4a2a" stroke={INK} strokeWidth={5} transform="rotate(-4 755 873)" /><rect x={1000} y={860} width={230} height={26} fill="#7a4a2a" stroke={INK} strokeWidth={5} transform="rotate(4 1115 873)" /></svg>{[['nb_man', 1380], ['nb_woman', 1530], ['baker', 1680], ['fuelman', 1810]].map(([s, x]: any, i) => <Sp key={s} s={s} x={x} y={GR} h={340} t={t} t0={gt + i * 0.2} enter="right" />)}</>), {z0: 1.08, z1: 1.0, fy: 700})]); }

// ===== CHAPTER 4 (rows 29-36) =====
{ const r = 29, wl = wd(r, 'wealth'), sm = wd(r, 'something', 1);
  const towns = (t: number) => (<><div style={{position: 'absolute', left: 0, top: 0, width: 960, height: H, overflow: 'hidden'}}><Bg n="square" /></div><div style={{position: 'absolute', left: 960, top: 0, width: 960, height: H, overflow: 'hidden'}}><div style={{position: 'absolute', left: -960, top: 0}}><Bg n="night" dark={0.22} /></div></div><div style={{position: 'absolute', left: 954, top: 0, width: 12, height: H, background: INK}} /></>);
  seq(r,
  [0, C(() => <></>, (t) => (<>{towns(t)}{Fig('nb_man', 380, 440, t)}{Fig('nb_woman', 640, 430, t)}{M('m_worry', 1450, t, {r: 90})}</>), {z0: 1.0, z1: 1.08, fy: 700})],
  [wd(r, 'And') - 0.2, C(bgs('meadow'), (t) => (<>{M('m_shrug', 560, t, {r: 100})}<Sp s="banknote" x={1150} y={650} h={190} t={t} t0={wl - 0.3} enter="pop" shadow={false} noidle /><Pop t={t} t0={wl + 0.1} x={1150} y={480}><XMark s={190} /></Pop></>), {z0: 1.0, z1: 1.1, fy: 700})],
  [sm - 0.2, C(bgs('square', 0.05), (t) => (<>{M('m_point', 560, t, {r: 100})}<Pop t={t} t0={sm} x={1250} y={420} sc={1.6}><QMark s={190} /></Pop></>), {z0: 1.1, z1: 1.16, fy: 700})]); }
{ const r = 30; seq(r, [0, I('30', [[0, 1.0, 0.35, 0.55], [1, 1.14, 0.65, 0.55]])]); }
{ const r = 31, dc = wd(r, 'Doctors'), en = wd(r, 'Engineers'), vl = wd(r, 'valuable'), fm = wd(r, 'Farmers');
  const pod = (x: number, t: number, t0: number, c: string, s: string, h: number) => (<React.Fragment key={s}><div style={{position: 'absolute', left: x - 120, top: GR - 40 + (1 - eo((t - t0) / 0.4)) * 200, width: 240, height: 90, background: c, border: `6px solid ${INK}`, borderRadius: 8, opacity: t >= t0 ? 1 : 0}} /><Sp s={s} x={x} y={GR - 50} h={h} t={t} t0={t0} enter="rise" /></React.Fragment>);
  seq(r,
  [0, C(bgs('square'), (t) => (<>{pod(620, t, fm - 0.2, '#3fa06b', 'farmer2', 430)}{pod(1300, t, dc - 0.2, '#2e8fe0', 'doctor', 430)}</>), {z0: 1.0, z1: 1.08, fy: 700})],
  [en - 0.2, C(bgs('square'), (t) => (<>{pod(260, t, en - 0.1, '#e0603a', 'engineer', 380)}{pod(660, t, wd(r, 'mechanics') - 0.1, '#8a5ad0', 'mechanic', 380)}{pod(1060, t, wd(r, 'electricians') - 0.1, '#2e8fe0', 'electrician', 380)}{pod(1460, t, wd(r, 'builders') - 0.1, '#3fa06b', 'builder', 380)}</>), {z0: 1.0, z1: 1.08, fy: 700})],
  [vl - 0.4, C(bgs('square', 0.1), (t) => (<>{pod(210, t, 0, '#3fa06b', 'farmer2', 330)}{pod(500, t, 0, '#2e8fe0', 'doctor', 330)}{pod(790, t, 0, '#e0603a', 'engineer', 330)}{pod(1080, t, 0, '#8a5ad0', 'mechanic', 330)}{pod(1370, t, 0, '#2e8fe0', 'electrician', 330)}{pod(1660, t, 0, '#3fa06b', 'builder', 330)}</>), {z0: 1.12, z1: 1.0, fy: 700})]); }
{ const r = 32;
  seq(r,
  [0, I('32', [[0, 1.0, 0.45, 0.5], [1, 1.12, 0.5, 0.5]], {punch: [[wd(r, 'billions'), 0.03]]})],
  [wd(r, 'automatically') - 0.2, I('32', [[0, 1.5, 0.72, 0.5], [1, 1.7, 0.72, 0.5]])]); }
{ const r = 33; seq(r, [0, C(bgs('meadow'), (t) => (<>{Fig('farmer2', 640, 540, t, {enter: 'pop'})}<Sp s="crate_veg" x={1100} y={GR} h={260} t={t} t0={S0(r) + 0.5} enter="pop" /><Sp s="apple" x={1380} y={GR - 10} h={130} t={t} t0={S0(r) + 0.9} enter="pop" /><Pop t={t} t0={wd(r, 'fine') - 0.2} x={640} y={250}><Check s={150} /></Pop></>), {z0: 1.0, z1: 1.12, fy: 700})]); }
{ const r = 34, bt = wd(r, 'But'), gr = wd(r, 'greed');
  seq(r, [0, C((t) => <><Bg n="meadow" /><Bg n="storm" op={trn(bt, gr + 1, t)} /></>, (t) => (<>{M('m_cheer', 760, t, {r: 105, poses: [[0, 'm_cheer'], [bt - 0.05, 'm_deadpan']]})}</>), {z0: 1.0, z1: 1.12, fy: 600})]); }
{ const r = 35, wh = wd(r, 'whoever');
  seq(r,
  [0, C(bgs('yard'), (t) => (<>{Fig('nb_man', 480, 440, t)}{Fig('nb_woman', 1450, 430, t)}<Sp s="crate_veg" x={960} y={GR} h={280} t={t} /><Sp s="apple" x={760} y={GR - 20} h={110} t={t} t0={wd(r, 'land') - 0.1} enter="pop" /></>), {z0: 1.0, z1: 1.08, fy: 700})],
  [wh - 0.2, C(bgs('yard'), (t) => (<>{Fig('nb_man', 480, 420, t)}{Fig('nb_woman', 1450, 410, t)}<Sp s="crates" x={960} y={GR} h={300} t={t} /><Sp s="elite" x={960} y={GR - 285} h={330} t={t} t0={wh} enter="drop" shadow={false} /></>), {z0: 1.08, z1: 1.16, fy: 700})]); }
{ const r = 36; seq(r, [0, C(bgs('meadow'), (t) => { const jig = Math.sin(t * 9) * 12; return (<><div style={{position: 'absolute', left: 960 - 450 + jig, top: GR - 462}}><Img src={staticFile('mnylf/tug.png')} style={{width: 900}} /></div><Sp s="crate_veg" x={960} y={GR + 10} h={170} t={t} /></>); }, {z0: 1.0, z1: 1.1, fy: 700})]); }

// ===== CHAPTER 5 (rows 37-43) =====
{ const r = 37; seq(r, [0, I('37', [[0, 1.0, 0.4, 0.55], [1, 1.14, 0.6, 0.55]])]); }
{ const r = 38, ot = wd(r, 'Others');
  seq(r,
  [0, C(bgs('square'), (t) => (<>{Fig('nb_man', 560, 460, t)}{Fig('nb_woman', 1360, 450, t)}<div style={{position: 'absolute', left: 810, top: 700, width: 300, height: 30, background: '#7a4a2a', border: `6px solid ${INK}`}} /><Sp s="crate_veg" x={900} y={705} h={150} t={t} t0={S0(r) + 0.5} enter="pop" shadow={false} /><Sp s="loaf" x={1030} y={705} h={80} t={t} t0={S0(r) + 0.9} enter="pop" shadow={false} /></>), {z0: 1.0, z1: 1.08, fy: 700})],
  [ot - 0.2, C(bgs('square'), (t) => { const u = trn(ot + 1.2, ot + 2.0, t); return (<>{Fig('baker', 560, 450, t)}{Fig('barber', 1360, 450, t)}<Sp s="loaf" x={lerp(700, 1220, u)} y={560} h={90} t={t} shadow={false} noidle /><Sp s="apple" x={lerp(1220, 700, u)} y={560} h={90} t={t} shadow={false} noidle /><Pop t={t} t0={wd(r, 'favors') - 0.1} x={960} y={400}><Arrow s={180} /></Pop></>); }, {z0: 1.08, z1: 1.14, fy: 700})]); }
{ const r = 39;
  seq(r, [0, C(bgs('square', 0.05), (t) => (<>{[['nb_man', 300], ['nb_woman', 560], ['baker', 820], ['barber', 1080]].map(([s, x]: any, i) => <React.Fragment key={s}><Sp s={s} x={x} y={GR} h={400} t={t} /><Sp s="crate_veg" x={x + 100} y={GR + 5} h={90} t={t} t0={wd(r, 'rationing') + i * 0.35} enter="pop" shadow={false} /></React.Fragment>)}{Fig('elite', 1640, 460, t)}</>), {z0: 1.0, z1: 1.1, fy: 700})]); }
{ const r = 40, cr = wd(r, 'credits'), tk = wd(r, 'tokens'), un = wd(r, 'universal');
  const tokens = (t: number, n: number, t0: number) => (<>{Array.from({length: n}, (_, i) => <Sp key={i} s="token" x={300 + i * 330} y={360 + Math.sin(t * 2 + i) * 22} h={150} t={t} t0={t0 + i * 0.2} enter="pop" shadow={false} noidle />)}</>);
  seq(r,
  [0, C(bgs('square', 0.35), (t) => (<>{M('m_card', 560, t, {r: 100, poses: [[0, 'm_deadpan'], [cr - 0.1, 'm_card']]})}</>), {z0: 1.0, z1: 1.08, fy: 700})],
  [cr - 0.2, C(bgs('square', 0.35), (t) => (<>{M('m_card', 560, t, {r: 100})}{tokens(t, 2, cr)}</>), {z0: 1.08, z1: 1.14, fy: 700})],
  [un - 0.3, C(bgs('square', 0.35), (t) => (<>{M('m_cheer', 560, t, {r: 100})}{tokens(t, 5, un - 0.1)}</>), {z0: 1.14, z1: 1.0, fy: 700})]); }
{ const r = 41, sc = wd(r, 'screen'), pa = wd(r, 'paper');
  seq(r, [0, C(bgs('meadow'), (t) => (<><Sp s="banknote" x={620} y={680} h={260} t={t} t0={pa - 0.2} enter="pop" op={1 - clamp((t - sc + 0.2) / 1.2)} shadow={false} /><div style={{position: 'absolute', left: 1050, top: 330, opacity: t >= sc - 0.5 ? 1 - clamp((t - sc - 0.6) / 1.0) : 0}}><Phone w={200} /></div></>), {z0: 1.0, z1: 1.1, fy: 700})]); }
{ const r = 42; seq(r, [0, I('42', [[0, 1.0, 0.5, 0.6], [1, 1.14, 0.5, 0.65]])]); }
{ const r = 43, rm = wd(r, 'Remove'), bq = wd(r, 'biggest');
  seq(r,
  [0, C(bgs('sunset', 0.1), (t) => { const u = clamp((t - rm) / 0.5); return (<>{M('m_shrug', 620, t, {r: 100})}<Pop t={t} t0={rm} x={1350} y={lerp(100, 700, u * u)} rot={u * 120}><Tools s={200} /></Pop></>); }, {z0: 1.0, z1: 1.08, fy: 700})],
  [wd(r, 'build') - 0.3, C(bgs('sunset', 0.1), (t) => (<>{M('m_point', 620, t, {r: 100})}<Pop t={t} t0={wd(r, 'build') - 0.2} x={1250} y={700} sc={1.5}><Toolbox s={280} /></Pop><Pop t={t} t0={bq} x={1250} y={430} sc={1.4}><QMark s={190} /></Pop></>), {z0: 1.08, z1: 1.15, fy: 700})]); }

// ===== ENDING (rows 44-48) =====
{ const r = 44;
  seq(r,
  [0, I('44', [[0, 1.0, 0.3, 0.55], [1, 1.12, 0.35, 0.58]])],
  [wd(r, 'Maybe') - 0.2, I('44', [[0, 1.5, 0.65, 0.78], [1, 1.35, 0.55, 0.7]])]); }
{ const r = 45, co = wd(r, 'competing'), ne = wd(r, 'needing'), su = wd(r, 'suddenly');
  seq(r,
  [0, C(bgs('meadow'), (t) => (<><div style={{position: 'absolute', left: 960 - 190, top: 260}}><Equals s={380} cross={t > su + 0.3} /></div></>), {z0: 1.0, z1: 1.1, fy: 600})],
  [co - 0.3, C(bgs('meadow'), (t) => { const jig = Math.sin(t * 9) * 10; return (<div style={{position: 'absolute', left: 960 - 450 + jig, top: GR - 462}}><Img src={staticFile('mnylf/tug.png')} style={{width: 900}} /></div>); }, {z0: 1.0, z1: 1.1, fy: 700})],
  [ne - 0.3, C(bgs('meadow'), (t) => (<>{M('m_shrug', 620, t, {r: 100})}<Sp s="plate" x={1300} y={GR} w={440} t={t} t0={ne} enter="pop" /></>), {z0: 1.0, z1: 1.1, fy: 700})]); }
{ const r = 46, sy = wd(r, 'system');
  const village = (t: number) => (<>{[[1180, 760, 220], [1450, 750, 190], [1700, 765, 210]].map(([x, y, w]: any, i) => <Home key={i} x={x} y={y + 90} w={w} />)}{Fig('nb_man', 520, 430, t)}{Fig('nb_woman', 800, 420, t)}</>);
  seq(r,
  [0, C(bgs('sunset'), (t) => (<>{village(t)}<Sp s="banknote" x={960} y={500} h={260} t={t} t0={S0(r) + 0.2} enter="pop" shadow={false} noidle /></>), {z0: 1.0, z1: 1.08, fy: 700})],
  [sy - 0.3, C(bgs('sunset'), (t) => { const f = 1 - clamp((t - sy + 0.2) / 1.2); return (<>{village(t)}<Sp s="banknote" x={960} y={500} h={260} t={t} op={f} rot={(1 - f) * 25} shadow={false} noidle /></>); }, {z0: 1.08, z1: 1.16, fy: 700})]); }
{ const r = 47;
  seq(r,
  [0, I('47', [[0, 1.0, 0.5, 0.55], [1, 1.1, 0.5, 0.55]])],
  [wd(r, 'person') - 0.5, I('47', [[0, 1.5, 0.5, 0.55], [1, 1.7, 0.6, 0.55]], {punch: [[wd(r, 'person'), 0.03]]})]); }
{ const r = 48, wo = wd(r, 'would');
  seq(r, [0, C(bgs('sunset'), (t) => (<>{M('m_deadpan', 460, t, {r: 100})}<Sp s="banknote" x={800} y={700} h={110} t={t} shadow={false} noidle /><Sp s="farmer2" x={1250} y={GR} h={440} t={t} t0={wo - 0.2} enter="pop" /><Sp s="doctor" x={1560} y={GR} h={440} t={t} t0={wo + 0.2} enter="pop" /></>), {z0: 1.0, z1: 1.1, fy: 700})]); }


// ---------- captions ----------
const CHUNKS: any[] = (() => {
  const out: any[] = [];
  SG.forEach((s) => {
    const ws = s.words; let cur: any[] = [];
    const flush = () => { if (cur.length) { out.push({words: cur, start: cur[0].start}); cur = []; } };
    ws.forEach((w, i) => {
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


const ShotView: React.FC<any> = ({r, t}) => {
  const parts = SHOTS[r];
  const a = BND(r - 1), b = BND(r);
  let k = 0;
  parts.forEach((p, i) => { if (t >= p[0]) k = i; });
  const from = k === 0 ? a : parts[k][0];
  const to = k + 1 < parts.length ? parts[k + 1][0] : b;
  const sh = parts[k][1];
  const flash = 0; // Joe 2026-11-14: the white flash on shot cuts read as a blue glitch over sky; removed
  if (sh.ill) {
    return (
      <AbsoluteFill>
        <Ill img={sh.ill} t={t} a={from} b={to} kb={sh.kb} punch={sh.punch ?? []} over={sh.over} />
        <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      </AbsoluteFill>
    );
  }
  const u = clamp((t - from) / (to - from));
  const z = lerp(sh.cam.z0, sh.cam.z1, eio(u));
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: 'saturate(1.05)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `50% ${sh.cam.fy ?? 700}px`, transform: `scale(${z})`}}>
        {sh.bg(t)}
        {sh.render(t)}
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

export const MnyLF: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const fade = clamp((tl.total - T) / 1.6);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SG.map((s, k) => {
        const r = k + 1;
        const a = BND(r - 1), b = BND(r);
        const from = r === 1 ? 0 : a - TR / 2, to = r === N ? tl.total : b + TR / 2;
        if (T < from || T > to) return null;
        const inU = r === 1 ? 1 : eo((T - (a - TR / 2)) / TR);
        const outU = r === N ? 0 : eio((T - (b - TR / 2)) / TR);
        const tx = (1 - inU) * W - outU * W * 0.35;
        return (
          <AbsoluteFill key={r} style={{transform: `translateX(${tx}px)`, boxShadow: inU < 1 ? '-24px 0 48px rgba(0,0,0,0.3)' : 'none', filter: 'none'}}>
            <ShotView r={r} t={T} />
          </AbsoluteFill>
        );
      })}
      {T < S1(5) && <Vignette t={T} />}
      <Captions t={T} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fade, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
