// @ts-nocheck
// Long-form (16:9) for "How Did Medieval Couples Get Any Privacy?" (slug medieval-privacy).
// Method copied from EmuWar.tsx: data-driven shots (mpShots.json), cues from the real voice (mpCues.json),
// illustrated shots (Ken Burns) + cut-out animation shots. Style v3 "mid color" (saturate ~1.05).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from './mpMeta';
import shotTimes from './mpShots.json';
import caps from './mpCaps.json';
import cues from './mpCues.json';
import segs from './mpSegs.json';

export const TOTAL = 267.67;
const W = 1920, H = 1080;
const FEET = 830;
const INK = '#141414';
const TR = 0.5;
const HAS_MUSIC = true;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const rnd = (i: number, k = 1) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };

type Item = {
  s: string; x: number; y?: number; r?: number; h?: number; w?: number;
  t0?: number; t1?: number; flip?: boolean; enter?: string; dx?: number; dy?: number;
  poses?: [number, string][]; z?: number; rot?: number; fade?: number; sway?: number; swayF?: number;
  shiver?: number; pulse?: number; arc?: [number, number, number]; jit?: [number, number, number];
};
const isMr = (s: string) => s.startsWith('m_');

const spriteBox = (s: string, it: Item) => {
  const m = meta[s];
  let sc: number;
  if (isMr(s) && it.r) sc = (it.r * 1.2) / m.head[2];
  else if (it.h) sc = it.h / m.h;
  else if (it.w) sc = it.w / m.w;
  else sc = 1;
  return {m, sc};
};

const ItemView: React.FC<{it: Item; t: number}> = ({it, t}) => {
  const t0 = it.t0 ?? 0;
  if (t < t0 || (it.t1 !== undefined && t > it.t1)) return null;
  const lt = t - t0;
  let name = it.s;
  let swapT = -9;
  if (it.poses) for (const [pt, pn] of it.poses) if (t >= pt) { name = pn; swapT = pt; }
  const {m, sc} = spriteBox(name, it);
  const w = m.w * sc, h = m.h * sc;
  const fx = m.feet[0] * sc;
  const dur = (it.t1 ?? 12) - t0;
  const dxp = it.dx ? it.dx * eio(lt / Math.max(dur, 0.1)) : 0;
  const dyp = it.dy ? it.dy * eio(lt / Math.max(dur, 0.1)) : 0;
  const bob = it.arc ? 0 : Math.sin(lt * 2.0 + it.x * 0.01) * 3;
  let ex = 0, ey = 0, es = 1, eop = 1;
  const eu = clamp(lt / (it.enter === 'pop' ? 0.35 : 0.7));
  if (it.enter === 'pop') { es = eu <= 0 ? 0 : eu >= 1 ? 1 : 1 - Math.pow(1 - eu, 3) * Math.cos(eu * 9) * 0.9; eop = eu > 0 ? 1 : 0; }
  else if (it.enter === 'left') ex = -(1 - eo(eu)) * (it.x + w + 200);
  else if (it.enter === 'right') ex = (1 - eo(eu)) * (W - it.x + w + 200);
  else if (it.enter === 'drop') ey = -(1 - eo(eu)) * 700;
  else if (it.enter === 'fade') eop = eo(eu);
  if (it.t1 !== undefined && it.fade) eop *= clamp((it.t1 - t) / it.fade);
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  let sx = (1 - 0.12 * k) * es, sy = (1 + 0.12 * k) * es;
  if (it.pulse) { const p = 1 + Math.sin(lt * 2.2) * it.pulse; sx *= p; sy *= p; }
  let x = it.x + dxp + ex, y = (it.y ?? FEET) + dyp + ey + bob;
  let rot = (it.rot ?? 0) + (it.sway ? Math.sin(lt * (it.swayF ?? 3)) * it.sway : 0);
  if (it.shiver) x += Math.sin(lt * 46) * it.shiver;
  if (it.jit && t >= it.jit[0] && t <= it.jit[1]) { x += Math.sin(t * 90) * it.jit[2]; }
  if (it.arc) { // [dur, fromX offset, height]: thrown in an arc from x+offset to x, thud on landing
    const u = clamp(lt / it.arc[0]);
    x = it.x + it.arc[1] * (1 - eo(u));
    y = (it.y ?? FEET) - Math.sin(u * Math.PI) * it.arc[2];
    rot = (1 - u) * -540 * (it.arc[1] > 0 ? 1 : -1) * 0.25;
    if (u >= 1) { const q = clamp((lt - it.arc[0]) / 0.5); sy *= 1 - 0.12 * Math.exp(-q * 8) * Math.cos(q * 20); }
  }
  const showShadow = eop > 0.5;
  return (
    <>
      {showShadow && <div style={{position: 'absolute', left: x - w * 0.3, top: (it.y ?? FEET) + dyp - 14, width: w * 0.6, height: 28, borderRadius: '50%', background: 'rgba(20,12,6,0.32)', opacity: it.arc ? clamp((lt - it.arc[0]) / 0.1) : 1}} />}
      <div style={{position: 'absolute', left: x - fx, top: y - h, width: w, height: h, opacity: eop, transformOrigin: `${fx}px ${h}px`, transform: `${it.flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx},${sy})`}}>
        <Img src={staticFile(`mp/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

// ---------------- code-drawn extras ----------------
const Curtain: React.FC<{x: number; y: number; w: number; h: number; t: number; t0: number}> = ({x, y, w, h, t, t0}) => {
  const u = eo((t - t0) / 0.5);
  if (u <= 0) return null;
  const hw = w * 0.5;
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', opacity: u}} width={w} height={h}>
      <rect x={-10} y={-14} width={w + 20} height={14} fill="#4a3220" stroke={INK} strokeWidth={5} />
      <path d={`M0,0 L${hw - 18},0 Q${hw - 50},${h * 0.5} ${hw - 8},${h} L0,${h} Z`} fill="#a4422e" stroke={INK} strokeWidth={5} />
      <path d={`M${w},0 L${hw + 18},0 Q${hw + 50},${h * 0.5} ${hw + 8},${h} L${w},${h} Z`} fill="#a4422e" stroke={INK} strokeWidth={5} />
      <path d={`M${hw * 0.5},0 Q${hw * 0.45},${h * 0.5} ${hw * 0.5},${h} M${w - hw * 0.5},0 Q${w - hw * 0.45},${h * 0.5} ${w - hw * 0.5},${h}`} stroke="#7a2c1e" strokeWidth={5} fill="none" />
    </svg>
  );
};

const Door: React.FC<{x: number; y: number; w: number; h: number; t: number; t0: number}> = ({x, y, w, h, t, t0}) => {
  const u = eo((t - t0) / 0.18);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#241a14', border: `7px solid ${INK}`, borderRadius: '14px 14px 0 0', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w * u, height: h, background: '#8a5a34', borderRight: `6px solid ${INK}`}}>
        {u > 0.5 && <div style={{position: 'absolute', right: 18, top: h * 0.5, width: 16, height: 16, borderRadius: '50%', background: '#d9a441', border: `4px solid ${INK}`}} />}
      </div>
    </div>
  );
};

const Dust: React.FC<{x: number; y: number; t: number; t0: number; n?: number}> = ({x, y, t, t0, n = 7}) => {
  const lt = t - t0;
  if (lt < 0 || lt > 1.1) return null;
  return <>{Array.from({length: n}, (_, i) => <div key={i} style={{position: 'absolute', left: x + (rnd(i, 3) - 0.5) * 120 + lt * (rnd(i, 4) - 0.5) * 80, top: y - 10 + lt * (60 + rnd(i, 5) * 60), width: 12, height: 8, borderRadius: 3, background: '#c9a063', border: `3px solid ${INK}`, opacity: 1 - lt / 1.1, transform: `rotate(${lt * 200 * (rnd(i, 6) - 0.5)}deg)`}} />)}</>;
};

const Mounds: React.FC<{x0: number; n: number}> = ({x0, n}) => (
  <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
    {Array.from({length: n}, (_, i) => <path key={i} d={`M${x0 + i * 190},830 q40,-90 130,-20 q30,10 40,20 z`} fill={['#7a5a3a', '#5a6a4a', '#8a4a32', '#4f6470'][i % 4]} stroke={INK} strokeWidth={5} />)}
  </svg>
);

// ---------------- backgrounds (style v3 mid color) ----------------
const Bg: React.FC<{kind: string; t: number}> = ({kind, t}) => {
  if (kind === 'room' || kind === 'dim') {
    const dim = kind === 'dim';
    const flick = 0.45 + Math.sin(t * 9) * 0.03 + Math.sin(t * 5.3) * 0.03;
    return (
      <>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 760, background: dim ? 'linear-gradient(#4d3a2c,#3b2b21)' : 'linear-gradient(#8a6140,#6a4a33)'}} />
        {Array.from({length: 10}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 200 + 6, top: 0, width: 4, height: 760, background: 'rgba(40,24,12,0.25)'}} />)}
        <div style={{position: 'absolute', left: 0, top: 760, width: W, height: 400, background: dim ? '#2c2018' : '#4a3424'}} />
        <div style={{position: 'absolute', left: 0, top: 757, width: W, height: 6, background: INK}} />
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
          <rect x={1480} y={170} width={230} height={250} fill="#3f5675" stroke={INK} strokeWidth={8} />
          <path d="M1595,170 V420 M1480,295 H1710" stroke={INK} strokeWidth={7} />
          <rect x={1485} y={175} width={105} height={115} fill="#6a86a8" opacity={0.55} />
        </svg>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: `radial-gradient(ellipse 760px 560px at 260px 700px, rgba(255,150,60,${flick}), rgba(255,150,60,0) 70%)`}} />
      </>
    );
  }
  if (kind === 'hall') {
    return (
      <>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 760, background: 'linear-gradient(#69707e,#4d5462)'}} />
        {Array.from({length: 7}, (_, r) => Array.from({length: 11}, (_, c) => <div key={r + '_' + c} style={{position: 'absolute', left: c * 180 - (r % 2) * 90, top: r * 110, width: 180, height: 110, border: '3px solid rgba(20,20,30,0.35)', boxSizing: 'border-box'}} />))}
        <div style={{position: 'absolute', left: 0, top: 760, width: W, height: 400, background: '#403830'}} />
        <div style={{position: 'absolute', left: 0, top: 757, width: W, height: 6, background: INK}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse 900px 600px at 960px 420px, rgba(255,190,100,0.28), rgba(255,190,100,0) 70%)'}} />
      </>
    );
  }
  // night field
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 700, background: 'linear-gradient(#1f3350,#4a6a8c)'}} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        <circle cx={1560} cy={170} r={80} fill="#efe6c6" stroke={INK} strokeWidth={6} />
        <path d="M0,700 L0,560 Q300,480 600,550 T1200,520 T1920,540 L1920,700 Z" fill="#3d5a52" stroke={INK} strokeWidth={5} />
      </svg>
      <div style={{position: 'absolute', left: 0, top: 690, width: W, height: 150, background: '#55703f'}} />
      <div style={{position: 'absolute', left: 0, top: 840, width: W, height: 300, background: '#445a33'}} />
      <div style={{position: 'absolute', left: 0, top: 687, width: W, height: 6, background: INK}} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        {Array.from({length: 34}, (_, i) => {
          const x = 30 + i * 58 + ((i * 37) % 23), y = 730 + ((i * 53) % 250), hh = 18 + ((i * 29) % 14);
          return <path key={i} d={`M${x},${y} l-8,${-hh} M${x},${y} l1,${-hh - 8} M${x},${y} l9,${-hh}`} stroke="#2f4425" strokeWidth={5} strokeLinecap="round" fill="none" />;
        })}
      </svg>
    </>
  );
};

// ---------------- shots ----------------
type ImgBeat = {src: string; t0?: number; t1?: number; z0?: number; z1?: number; px?: number; py?: number};
type Shot = {img?: ImgBeat[]; bg?: string; items?: Item[]; z0?: number; z1?: number; extra?: (t: number) => React.ReactNode; sfx?: [number, string, number?][]};
type C = (sc: number, word: string, n?: number) => number;

const MR = 84; // mascot head radius param

const SHOTS: ((c: C, ss: (sc: number) => number) => Shot)[] = [
  /* 1 hook */ (c) => ({img: [{src: 'i01', z0: 1.0, z1: 1.1, px: -20}], sfx: [[0.1, 'pluck', 0.6], [2.8, 'pulse', 0.5]]}),
  /* 2 family pops */ (c) => ({bg: 'room', z0: 1.0, z1: 1.05, items: [
    {s: 'w_brow', x: 400, h: 720},
    {s: 'mother', x: 720, h: 700, t0: c(2, 'mother') - 0.15, enter: 'pop'},
    {s: 'father', x: 1010, h: 690, t0: c(2, 'father') - 0.15, enter: 'pop'},
    {s: 'brothers', x: 1360, h: 430, t0: c(2, 'brothers') - 0.15, enter: 'pop'},
    {s: 'gran', x: 1680, h: 650, t0: c(2, 'grandmother') - 0.15, enter: 'pop', pulse: 0.012},
  ], sfx: [[c(2, 'mother') - 0.15, 'pop'], [c(2, 'father') - 0.15, 'pop'], [c(2, 'brothers') - 0.15, 'pop'], [c(2, 'grandmother') - 0.15, 'pop', 0.9], [c(2, 'slept'), 'pluck', 0.5]]}),
  /* 3 one room */ (c) => ({img: [{src: 'i03', z0: 1.0, z1: 1.08, px: 25}], sfx: [[0.3, 'pluck', 0.7]]}),
  /* 4 plan */ (c) => ({bg: 'room', items: [
    {s: 'm_finger', x: 620, r: MR, t0: 0.2, enter: 'pop'},
    {s: 'w_brow', x: 1240, h: 720, t0: c(4, 'bad') - 0.2, enter: 'pop', sway: 1.2, swayF: 2},
  ], sfx: [[0.2, 'pop'], [c(4, 'bad'), 'pluck', 0.7], [c(4, 'bad') - 0.2, 'pop'], [c(4, 'plan', 2), 'pluck', 0.6]]}),
  /* 5 Plan A */ (c) => ({img: [{src: 'i05', z0: 1.0, z1: 1.09, px: -25}], sfx: [[0.2, 'murmur', 0.6], [c(5, 'songs'), 'ting', 0.4]]}),
  /* 6 wink */ (c) => ({bg: 'room', items: [
    {s: 'guest', x: 520, h: 760, t0: c(6, 'winks') - 0.35, t1: c(6, 'never') + 0.1, fade: 0.25, enter: 'pop'},
    {s: 'm_fist', x: 1150, r: MR, t0: c(6, 'never') - 0.1, enter: 'pop', shiver: 2},
    {s: 'w_brow', x: 1620, h: 700, t0: c(6, 'hurt') - 0.2, enter: 'right', dx: -140, sway: 1.5, swayF: 6},
  ], sfx: [[c(6, 'winks'), 'ting', 0.7], [c(6, 'never') - 0.1, 'pop'], [c(6, 'hurt') - 0.2, 'whoosh', 0.3]]}),
  /* 7+8 firelight, mother clears throat, Plan A dead */ (c, ss) => ({img: [{src: 'i07', z0: 1.0, z1: 1.1, px: 20}], sfx: [[0.3, 'pulse', 0.5], [c(7, 'clears') - 0.1, 'cough', 0.7], [c(8, 'dead') + 0.1, 'thud', 0.9]]}),
  /* 9 slip out */ (c) => ({img: [{src: 'i09', z0: 1.0, z1: 1.1, px: -30}], sfx: [[0.1, 'wind', 0.5]]}),
  /* 10 lanterns */ (c) => ({img: [{src: 'i10', z0: 1.0, z1: 1.1, px: 25}], sfx: [[c(10, 'lantern'), 'pluck', 0.7], [c(10, 'another'), 'pluck', 0.7], [c(10, 'six'), 'pluck', 0.8]]}),
  /* 11+12 cousin waves, freezing */ (c) => ({bg: 'night', items: [
    {s: 'cousins', x: 800, h: 560, t0: c(11, 'cousin') - 0.5, t1: c(12, 'plan') - 0.05, fade: 0.15, enter: 'pop'},
    {s: 'couple_cold', x: 1000, h: 780, t0: c(12, 'plan') - 0.15, enter: 'left', shiver: 3},
  ], sfx: [[c(11, 'cousin') - 0.5, 'pop'], [c(11, 'waves') + 0.2, 'wah', 0.8], [c(12, 'plan') - 0.15, 'whoosh', 0.4], [c(12, 'freezing') - 0.5, 'wind', 0.6]]}),
  /* 13 manor */ (c) => ({img: [{src: 'i13', z0: 1.0, z1: 1.1, px: -20}], sfx: [[0.2, 'pluck', 0.5], [1.2, 'pluck', 0.5], [2.4, 'pluck', 0.5]]}),
  /* 14 stairs and steward */ (c) => ({img: [{src: 'i14', z0: 1.0, z1: 1.12, px: 20}], sfx: [[c(14, 'tiptoe'), 'creak', 0.5], [c(14, 'man') - 0.1, 'thud', 0.8]]}),
  /* 15 curtains */ (c) => ({bg: 'hall', items: [
    {s: 'steward', x: 380, h: 730, t0: 0, pulse: 0.01},
    {s: 'm_point', x: 880, r: MR, t0: c(15, 'looking') - 0.2, enter: 'pop'},
    {s: 'w_brow', x: 1700, h: 720, t0: c(15, 'nods') - 0.3, enter: 'pop', sway: 3, swayF: 6},
  ], extra: (t) => <Curtain x={1250} y={170} w={330} h={560} t={t} t0={c(15, 'curtains') - 0.3} />, sfx: [[c(15, 'looking') - 0.2, 'pop'], [c(15, 'curtains'), 'pluck', 0.6], [c(15, 'nods') - 0.3, 'pop']]}),
  /* 16+17 removed by the collar */ (c) => ({bg: 'hall', items: [
    {s: 'steward', x: 1500, h: 730, t0: 0},
    {s: 'm_point', x: 780, r: MR, t0: 0, t1: c(16, 'collar') - 0.1},
    {s: 'w_brow', x: 1040, h: 720, t0: 0, t1: c(16, 'collar') - 0.1},
    {s: 'tossed', x: 700, h: 470, t0: c(16, 'collar') - 0.1, arc: [0.8, 650, 260]},
  ], extra: (t) => <Door x={1330} y={190} w={260} h={570} t={t} t0={c(16, 'collar') + 0.9} />, sfx: [[c(16, 'collar') - 0.1, 'whoosh', 0.6], [c(16, 'collar') + 0.7, 'thud', 0.9], [c(16, 'collar') + 0.9, 'slam', 0.9]]}),
  /* 18 wait */ (c) => ({bg: 'dim', z0: 1.0, z1: 1.05, items: [
    {s: 'm_sit', x: 520, r: 80, t0: 0.1, enter: 'fade'},
    {s: 'w_hush', x: 900, h: 700, t0: 0.5, enter: 'pop'},
  ], extra: () => <Mounds x0={1100} n={4} />, sfx: [[0.2, 'tick', 0.6], [2.2, 'tick', 0.6], [0.5, 'pop', 0.4]]}),
  /* 19 grandmother eyes */ (c) => ({img: [{src: 'i19', z0: 1.0, z1: 1.1, px: -20}], sfx: [[0.4, 'snore', 0.6], [c(19, 'glint') - 0.2, 'creak', 0.4]]}),
  /* 20 calendar */ (c) => ({img: [{src: 'i20', z0: 1.0, z1: 1.09, px: 20}], sfx: [[c(20, 'tell') + 0.3, 'pulse', 0.6]]}),
  /* 21 church tradition */ (c) => ({bg: 'room', items: [
    {s: 'calendar', x: 1180, y: 760, h: 640, t0: c(21, 'church') - 0.2, enter: 'pop'},
    {s: 'gran', x: 560, h: 720, t0: c(21, 'grandmother') - 0.2, enter: 'pop', pulse: 0.01, sway: 1.2, swayF: 1.5},
    {s: 'w_brow', x: 1680, h: 640, t0: c(21, 'strictly') - 0.3, enter: 'pop'},
  ], sfx: [[c(21, 'church') - 0.2, 'bell', 0.7], [c(21, 'church') - 0.2, 'pop', 0.5], [c(21, 'grandmother') - 0.2, 'pop', 0.8], [c(21, 'strictly'), 'tick', 0.6]]}),
  /* 22 guest in own marriage */ (c) => ({bg: 'room', items: [
    {s: 'm_sit', x: 760, r: 82, t0: 0.1},
    {s: 'w_brow', x: 1180, h: 700, t0: 0.4, enter: 'right', dx: -60, sway: 1.5, swayF: 5},
  ], sfx: [[0.3, 'sigh', 0.7], [c(22, 'guest') , 'thud', 0.3]]}),
  /* 23 stop looking for a room */ (c) => ({img: [{src: 'i23', z0: 1.0, z1: 1.1, px: 15}], sfx: [[0.3, 'pluck', 0.5], [c(23, 'then') - 0.1, 'ting', 0.6]]}),
  /* 24+25 build one */ (c) => ({bg: 'room', items: [
    {s: 'm_saw', x: 780, r: 90, t0: c(24, 'build') - 0.2, enter: 'pop', sway: 2.5, swayF: 11},
    {s: 'w_brow', x: 1480, h: 720, t0: c(25, 'wife') - 0.2, enter: 'pop'},
  ], extra: (t) => <><Dust x={1080} y={800} t={t} t0={c(25, 'saw') + 0.1} /><Dust x={1080} y={800} t={t} t0={c(25, 'saw') + 1.1} /><Dust x={1000} y={800} t={t} t0={c(25, 'wrong') - 0.2} n={10} /></>, sfx: [[c(24, 'build') - 0.2, 'pop'], [c(24, 'build') + 0.1, 'pluck', 0.6], [c(25, 'saw'), 'saw', 0.7], [c(25, 'wife') - 0.2, 'pop', 0.5], [c(25, 'wrong') - 0.2, 'crack', 0.8], [c(25, 'bed'), 'knock', 0.7]]}),
  /* 26 box beds */ (c) => ({img: [{src: 'i26', z0: 1.0, z1: 1.1, px: -20}], sfx: [[c(26, 'box'), 'knock', 0.8], [c(26, 'beds'), 'bell', 0.5]]}),
  /* 27 climb in */ (c) => ({img: [{src: 'i27', z0: 1.0, z1: 1.09, px: 20}], sfx: [[0.3, 'creak', 0.4], [c(27, 'laughing'), 'hush', 0.4]]}),
  /* 28 small in there */ (c) => ({img: [{src: 'i28', z0: 1.0, z1: 1.1, px: -15}], sfx: [[0.3, 'pulse', 0.6]]}),
  /* 29 cough */ (c) => ({bg: 'dim', z0: 1.0, z1: 1.04, items: [
    {s: 'box_section', x: 960, h: 800, t0: 0.1, enter: 'pop', jit: [c(29, 'coughs'), c(29, 'coughs') + 0.45, 3]},
  ], sfx: [[0.1, 'pop', 0.5], [c(29, 'coughs'), 'cough', 0.8], [c(29, 'turns'), 'creak', 0.6]]}),
  /* 30 quiet is a skill */ (c) => ({bg: 'room', items: [
    {s: 'm_finger', x: 620, r: MR, t0: c(30, 'rule') - 0.4, enter: 'pop'},
    {s: 'w_hush', x: 1260, h: 800, t0: c(30, 'quiet') - 0.6, enter: 'pop'},
  ], sfx: [[c(30, 'rule') - 0.4, 'pop', 0.5], [c(30, 'quiet') - 0.6, 'pop', 0.5], [c(30, 'quiet'), 'hush', 0.8]]}),
  /* 31 hands */ (c) => ({img: [{src: 'i31', z0: 1.0, z1: 1.1, px: 15}], sfx: [[0.3, 'pulse', 0.7], [2.4, 'pulse', 0.7]]}),
  /* 32 door shuts */ (c) => ({img: [{src: 'i32', z0: 1.0, z1: 1.1, px: -15}], sfx: [[c(32, 'sticks') - 0.2, 'creak', 0.6], [c(32, 'shuts') - 0.1, 'thud', 0.9]]}),
  /* 33 lanterns out */ (c) => ({img: [{src: 'i33', z0: 1.0, z1: 1.1, px: 15}], sfx: [[0.5, 'fizz', 0.6], [2.1, 'fizz', 0.6], [3.6, 'fizz', 0.6]]}),
  /* 34-36 closing */ (c, ss) => ({img: [{src: 'i34', t0: 0, t1: ss(35) - 0.05, z0: 1.0, z1: 1.08}, {src: 'i35', t0: ss(35) - 0.05, z0: 1.12, z1: 1.0, px: 12}], sfx: [[0.3, 'pulse', 0.5], [ss(35) - 0.05, 'creak', 0.5], [ss(36) + 1.2, 'wind', 0.25]]}),
];

// ---------------- captions ----------------
const Captions: React.FC<{t: number}> = ({t}) => {
  const c: any = (caps as any[]).find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 64}}>
      <div style={{display: 'flex', gap: 22, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 96, letterSpacing: 2}}>
        {c.words.map((w: any, i: number) => (
          <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `13px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{i: number; t: number; dur: number; start: number}> = ({i, t, dur, start}) => {
  const c: C = (sc, word, n = 0) => {
    const arr = (cues as any)[String(sc)]?.[word];
    if (!arr) { console.warn('missing cue', sc, word); return 0.5; }
    return (arr[Math.min(n, arr.length - 1)] ?? arr[0]) - start;
  };
  const ss = (sc: number) => (cues as any)[String(sc)]._start[0] - start;
  const sh = SHOTS[i](c, ss);
  const u = clamp(t / dur);
  if (sh.img) {
    return (
      <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
        {sh.img.map((b, k) => {
          const a = b.t0 ?? 0, e = b.t1 ?? dur + 1;
          if (t < a || t >= e) return null;
          const uu = clamp((t - a) / Math.max(Math.min(e, dur) - a, 0.1));
          const zz = lerp(b.z0 ?? 1.0, b.z1 ?? 1.09, uu);
          const punch = k > 0 ? Math.max(0, 1 - (t - a) / 0.35) * 0.05 : 0;
          return <Img key={k} src={staticFile(`mp/img_${b.src}.png`)} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, objectFit: 'cover', transform: `translate(${(b.px ?? 0) * uu}px, ${(b.py ?? 0) * uu}px) scale(${zz + punch})`, filter: 'saturate(1.05)'}} />;
        })}
      </AbsoluteFill>
    );
  }
  const z = lerp(sh.z0 ?? 1.0, sh.z1 ?? 1.035, eio(u));
  const items = [...(sh.items ?? [])].sort((a, b) => (a.z ?? (a.y ?? FEET)) - (b.z ?? (b.y ?? FEET)));
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: 'saturate(1.05) contrast(1.03)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 75%', transform: `scale(${z})`}}>
        <Bg kind={sh.bg ?? 'room'} t={t} />
        {items.map((it, k) => <ItemView key={k} it={it} t={t} />)}
        {sh.extra && sh.extra(t)}
      </div>
    </AbsoluteFill>
  );
};

const musicVol = (T: number) => {
  // duck under the voice: 0.07 while a phrase plays, 0.17 in pauses, 0.25 s ramps; 2 s fade in / out
  let inSpeech = 0;
  for (const s of segs as any[]) {
    const a = clamp((T - (s.start - 0.25)) / 0.25), b = clamp(((s.end + 0.1) - T) / 0.25);
    inSpeech = Math.max(inSpeech, Math.min(a, b));
  }
  return lerp(0.17, 0.07, inSpeech) * clamp(T / 2) * clamp((TOTAL - T) / 2.5);
};

export const MedievalPrivacy: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const sfx: [number, string, number][] = [];
  shotTimes.forEach((s: any, k: number) => {
    sfx.push([s.start - 0.05, 'whoosh', 0.3]);
    const cc: C = (sc, word, n = 0) => { const arr = (cues as any)[String(sc)]?.[word]; return arr ? (arr[Math.min(n, arr.length - 1)] ?? arr[0]) - s.start : 0.5; };
    const ss = (sc: number) => (cues as any)[String(sc)]._start[0] - s.start;
    (SHOTS[k](cc, ss).sfx ?? []).forEach(([dt, n, v]) => sfx.push([s.start + dt, n, v ?? 0.6]));
  });
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shotTimes.map((s: any, i: number) => {
        const from = Math.max(0, s.start - TR);
        const len = s.end - from + (i === shotTimes.length - 1 ? 0.8 : 0);
        const lt = T - s.start;
        const slideU = i === 0 ? 1 : eo((T - from) / TR);
        return (
          <Sequence key={i} from={Math.round(from * fps)} durationInFrames={Math.round(len * fps) + 2}>
            <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`, boxShadow: slideU < 1 ? '-20px 0 40px rgba(0,0,0,0.25)' : 'none'}}>
              <ShotView i={i} t={Math.max(0, lt)} dur={s.end - s.start} start={s.start} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Captions t={T} />
      <AbsoluteFill style={{background: '#000', opacity: clamp((T - (TOTAL - 1.2)) / 1.2)}} />
      <Audio src={staticFile('mp/voice.wav')} volume={1.0} />
      {HAS_MUSIC && <Audio src={staticFile('mp/music.mp3')} volume={(f) => musicVol(f / fps)} />}
      {sfx.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.max(0, Math.round(t0 * fps))} durationInFrames={Math.round(2.8 * fps)}>
          <Audio src={staticFile(`mp/${name}.wav`)} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
