// @ts-nocheck
// Long-form (16:9) cut-out animation for "The Time Australia Went to War With Emus".
// Data-driven: shots come from emuShots.json (timing from the real voice), visuals from SHOTS below.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from './emuMeta';
import shotTimes from './emuShots.json';
import caps from './emuCaps.json';

export const TOTAL = 324.4;
const W = 1920, H = 1080;
const HORIZON = 690;
const FEET = 880;
const INK = '#141414';
const TR = 0.5; // swipe transition length
const HAS_MUSIC = true; // flip to true once emu/music.mp3 (new YouTube Audio Library track) is in public/emu

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const rnd = (i: number, k = 1) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };

// ---------------- items ----------------
type Item = {
  s: string; x: number; y?: number; r?: number; h?: number; w?: number;
  t0?: number; t1?: number; flip?: boolean; enter?: string; walk?: boolean; dx?: number; dy?: number;
  poses?: [number, string][]; z?: number; rot?: number; fade?: number; sway?: number;
};

const isMr = (s: string) => s.startsWith('mr_');
const isEmu = (s: string) => s.startsWith('emu_');

const spriteBox = (s: string, it: Item) => {
  const m = meta[s];
  let sc: number;
  if (isMr(s)) sc = ((it.r ?? 78) * 1.2) / m.head[2];
  else if (it.h) sc = (it.h * (isEmu(s) ? 1.12 : 1)) / m.h;
  else if (it.w) sc = it.w / m.w;
  else sc = 1;
  return {m, sc};
};

const ItemView: React.FC<{it: Item; t: number}> = ({it, t}) => {
  const t0 = it.t0 ?? 0;
  if (t < t0 || (it.t1 !== undefined && t > it.t1)) return null;
  const lt = t - t0;
  // pose
  let name = it.s;
  let swapT = -9;
  if (it.poses) for (const [pt, pn] of it.poses) if (t >= pt) { name = pn; swapT = pt; }
  if (it.walk && isEmu(it.s)) name = Math.floor((lt + (it.x % 7) * 0.05) / 0.26) % 2 === 0 ? 'emu_walk_a' : 'emu_walk_b';
  const {m, sc} = spriteBox(name, it);
  const w = m.w * sc, h = m.h * sc;
  const fx = m.feet[0] * sc;
  // motion
  const dur = (it.t1 ?? 12) - t0;
  const dxp = it.dx ? it.dx * clamp(lt / Math.max(dur, 0.1)) : 0;
  const dyp = it.dy ? it.dy * clamp(lt / Math.max(dur, 0.1)) : 0;
  let bob = 0;
  if (it.walk) bob = -Math.abs(Math.sin(lt * (isEmu(it.s) ? 11 : 8))) * (isEmu(it.s) ? 14 : 10);
  else if (isMr(it.s) || isEmu(it.s)) bob = Math.sin(lt * 2.2 + it.x * 0.01) * 3;
  // enter
  let ex = 0, ey = 0, es = 1, eop = 1;
  const eu = clamp(lt / (it.enter === 'pop' ? 0.35 : 0.7));
  if (it.enter === 'pop') { es = eu <= 0 ? 0 : eu >= 1 ? 1 : 1 - Math.pow(1 - eu, 3) * Math.cos(eu * 9) * 0.9; eop = eu > 0 ? 1 : 0; }
  else if (it.enter === 'left') ex = -(1 - eo(eu)) * (it.x + w + 200);
  else if (it.enter === 'right') ex = (1 - eo(eu)) * (W - it.x + w + 200);
  else if (it.enter === 'drop') ey = -(1 - eo(eu)) * 700;
  else if (it.enter === 'fade') eop = eo(eu);
  if (it.t1 !== undefined && it.fade) eop *= clamp((it.t1 - t) / it.fade);
  // squash on pose swap
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const sx = (1 - 0.12 * k) * es, sy = (1 + 0.12 * k) * es;
  const x = it.x + dxp + ex, y = (it.y ?? FEET) + dyp + ey + bob;
  const rot = (it.rot ?? 0) + (it.sway ? Math.sin(lt * 3) * it.sway : 0);
  const showShadow = (isMr(it.s) || isEmu(it.s)) && eop > 0.5;
  return (
    <>
      {showShadow && <div style={{position: 'absolute', left: x - w * 0.28, top: (it.y ?? FEET) + dyp - 14, width: w * 0.56, height: 28, borderRadius: '50%', background: 'rgba(30,60,30,0.25)'}} />}
      <div style={{position: 'absolute', left: x - fx, top: y - h, width: w, height: h, opacity: eop, transformOrigin: `${fx}px ${h}px`, transform: `${it.flip ? 'scaleX(-1)' : ''} rotate(${rot}deg) scale(${sx},${sy})`.replace('scaleX(-1) rotate', it.flip ? 'translateX(0) scaleX(-1) rotate' : 'rotate')}}>
        <Img src={staticFile(`emu/${name}.png`)} style={{width: '100%', height: '100%', filter: isEmu(it.s) ? 'sepia(0.35) saturate(1.7) brightness(0.88) contrast(1.12)' : 'none'}} />
      </div>
    </>
  );
};

// ---------------- code-drawn paper pieces ----------------
const Paper: React.FC<{x: number; y: number; w?: number; lines?: number; t: number; t0: number; rot?: number; fillT?: number}> = ({x, y, w = 150, lines = 4, t, t0, rot = 0, fillT = 0}) => {
  const u = clamp((t - t0) / 0.3);
  if (u <= 0) return null;
  const h = w * 1.3;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, background: '#fffdf4', border: `6px solid ${INK}`, borderRadius: 6, transform: `rotate(${rot}deg) scale(${u})`, transformOrigin: '50% 100%'}}>
      {Array.from({length: lines}, (_, i) => {
        const show = fillT ? clamp((t - t0 - i * fillT) / fillT) : 1;
        return <div key={i} style={{position: 'absolute', left: w * 0.12, top: h * (0.16 + i * (0.7 / lines)), width: (w * 0.72) * show * (i === lines - 1 ? 0.6 : 1), height: 6, background: INK, borderRadius: 3}} />;
      })}
    </div>
  );
};

const Coin: React.FC<{x: number; y: number; t: number; t0: number; r?: number}> = ({x, y, t, t0, r = 46}) => {
  const lt = t - t0;
  if (lt < 0) return null;
  const hopY = -Math.abs(Math.sin(clamp(lt / 0.7) * Math.PI)) * 120 * (1 - clamp(lt / 0.7) * 0.0);
  return (
    <div style={{position: 'absolute', left: x - r, top: y - 2 * r + hopY, width: 2 * r, height: 2 * r, borderRadius: '50%', background: '#e8e8ee', border: `6px solid ${INK}`, boxShadow: 'inset 0 0 0 8px #c9c9d4'}} />
  );
};

const Tally: React.FC<{x: number; y: number; t: number; shake?: number}> = ({x, y, t, shake = 0}) => (
  <div style={{position: 'absolute', left: x - 170 + Math.sin(t * 40) * shake, top: y - 260, width: 340, height: 260, background: '#fffdf4', border: `6px solid ${INK}`, borderRadius: 8}}>
    <svg width={340} height={260} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: 4}, (_, r) => Array.from({length: 3}, (_, c) => {
        const bx = 36 + c * 100, by = 36 + r * 56;
        const j = shake ? Math.sin(t * 9 + r * 3 + c) * shake * 0.6 : 0;
        return <path key={r + '_' + c} d={`M${bx},${by + j} v34 M${bx + 14},${by - j} v34 M${bx + 28},${by + j} v34 M${bx + 42},${by - j} v34 M${bx - 6},${by + 28} L${bx + 50},${by + 4}`} stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />;
      }))}
    </svg>
  </div>
);

const Puff: React.FC<{x: number; y: number; t: number; t0: number}> = ({x, y, t, t0}) => {
  const u = (t - t0) / 1.2;
  if (u < 0 || u > 1) return null;
  return <>{[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: x - 22 + i * 18 + u * 30 * (i - 1), top: y - 30 - u * 90 - i * 10, width: 44 + u * 40, height: 44 + u * 40, borderRadius: '50%', background: '#d9d9d9', border: `5px solid ${INK}`, opacity: 1 - u}} />)}</>;
};

// ---------------- backgrounds ----------------
const BG: Record<string, any> = {
  day: {sky: ['#2ea8ff', '#c9efff'], hill: '#7fe05a', g1: '#58c93a', g2: '#3fae2e'},
  dry: {sky: ['#3da9f2', '#ffd9a0'], hill: '#f0b04a', g1: '#f0a640', g2: '#dc8a2e'},
  dusk: {sky: ['#ff5c39', '#ffb36b'], hill: '#c9743a', g1: '#b8602e', g2: '#8f4521'},
  indoor: {wall: '#f6cf94', floor: '#b5652e'},
};
const Bg: React.FC<{kind: string; dam?: boolean}> = ({kind, dam}) => {
  const b = BG[kind];
  if (kind === 'indoor') {
    return (
      <>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 760, background: b.wall}} />
        <div style={{position: 'absolute', left: 0, top: 760, width: W, height: 400, background: b.floor}} />
        <div style={{position: 'absolute', left: 0, top: 757, width: W, height: 6, background: INK}} />
        <div style={{position: 'absolute', left: 0, top: 690, width: W, height: 70, background: '#e0a866'}} />
      </>
    );
  }
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: HORIZON + 4, background: `linear-gradient(${b.sky[0]}, ${b.sky[1]})`}} />
      <svg style={{position: 'absolute', left: 0, top: HORIZON - 170, overflow: 'visible'}} width={W} height={175}>
        <path d={`M0,175 L0,110 Q260,40 520,100 T1050,80 T1560,95 T1920,70 L1920,175 Z`} fill={b.hill} stroke={INK} strokeWidth={5} />
      </svg>
      <div style={{position: 'absolute', left: 0, top: HORIZON, width: W, height: 150, background: b.g1}} />
      <div style={{position: 'absolute', left: 0, top: HORIZON + 150, width: W, height: 400, background: b.g2}} />
      <div style={{position: 'absolute', left: 0, top: HORIZON - 3, width: W, height: 6, background: INK}} />
      {dam && (
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
          <ellipse cx={1480} cy={800} rx={430} ry={90} fill="#5fb8e6" stroke={INK} strokeWidth={6} />
          <ellipse cx={1400} cy={790} rx={200} ry={26} fill="#8fd3f4" />
        </svg>
      )}
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        {Array.from({length: 34}, (_, i) => {
          const x = 30 + i * 58 + ((i * 37) % 23), y = HORIZON + 40 + ((i * 53) % 280), hh = 18 + ((i * 29) % 14);
          return <path key={i} d={`M${x},${y} l-8,${-hh} M${x},${y} l1,${-hh - 8} M${x},${y} l9,${-hh}`} stroke={kind === 'day' ? '#1f7a2a' : '#a8561c'} strokeWidth={5} strokeLinecap="round" fill="none" />;
        })}
      </svg>
    </>
  );
};

// ---------------- helpers to build items ----------------
const flock = (n: number, o: {x0: number; x1: number; dir?: number; y?: number; h?: number; t0?: number; t1?: number; spreadY?: number; dxv?: number; seed?: number; rows?: number}): Item[] => {
  const dir = o.dir ?? 1;
  const rows = o.rows ?? 3;
  const per = Math.ceil(n / rows);
  const out: Item[] = [];
  for (let i = 0; i < n; i++) {
    const row = i % rows, col = Math.floor(i / rows);
    const depth = rows > 1 ? row / (rows - 1) : 0; // 0 far .. 1 near
    const slot = (o.x1 - o.x0) / per;
    const x = o.x0 + (col + 0.5) * slot + ((row * 0.37) % 1 - 0.5) * slot * 0.6 + (rnd(i, (o.seed ?? 0) + 1) - 0.5) * slot * 0.15;
    const y = (o.y ?? 790) + depth * (o.spreadY ?? 110);
    const h = (o.h ?? 330) * (0.78 + depth * 0.36);
    out.push({s: 'emu_walk_a', walk: true, flip: dir < 0, x, y, h, dx: (o.dxv ?? 380) * dir * (0.92 + row * 0.05), t0: o.t0 ?? 0, t1: o.t1, z: y});
  }
  return out;
};
const beaks = (n: number, o: {x: number; y: number; w: number; t0: number; step: number; spread: number; rows?: number}): Item[] =>
  Array.from({length: n}, (_, i) => {
    const row = Math.floor(i / (o.rows ?? 9)), col = i % (o.rows ?? 9);
    return {s: 'beak', x: o.x + (col - (o.rows ?? 9) / 2) * o.spread + (row % 2) * o.spread * 0.5 + (rnd(i, 4) - 0.5) * 16, y: o.y - row * (o.w * 0.5) + (rnd(i, 5) - 0.5) * 8, w: o.w, t0: o.t0 + i * o.step, enter: 'pop', rot: (rnd(i, 6) - 0.5) * 36, z: 900 + i * 0.01};
  });

type ImgBeat = {src: string; t0?: number; t1?: number; z0?: number; z1?: number; px?: number};
type Shot = {img?: ImgBeat[]; bg: string; dam?: boolean; items: Item[]; z0?: number; z1?: number; extra?: (t: number) => React.ReactNode; sfx?: [number, string, number?][]};

const SHOTS: Shot[] = [
  /* 1 HOOK */ {bg: 'dry', items: [], img: [{src: 'hook_a', t0: 0, t1: 4.9, z0: 1.0, z1: 1.14}, {src: 'hook_b', t0: 4.9, z0: 1.12, z1: 1.0, px: -30}], sfx: [[0.05, 'rumble', 0.5], [0.1, 'mg_burst', 1.0], [2.5, 'mg_short', 0.9], [4.9, 'thud', 1.0], [4.9, 'whoosh', 0.7]]},
  /* 1 the jam */ {bg: 'dry', dam: true, z0: 1.0, z1: 1.05, items: [{s: 'mr_gun', x: 520, r: 82, enter: 'fade'}, ...flock(6, {x0: 820, x1: 1560, dir: 1, y: 770, h: 300, dxv: 260, rows: 2})], extra: (t) => <Puff x={560} y={560} t={t} t0={3.25} />, sfx: [[2.0, 'mg_burst', 1.0], [3.3, 'clink', 0.9]]},
  /* 3 pay for bullets + say there was a gunner */ {bg: 'dry', items: [{s: 'mr_shrug', x: 560, r: 82, poses: [[3.3, 'mr_point']]}, {s: 'sacks', x: 1180, h: 300, t0: 0.6, enter: 'pop', t1: 3.2, fade: 0.2}, {s: 'crate', x: 1480, h: 270, t0: 1.6, enter: 'pop', t1: 3.2, fade: 0.2}, {s: 'emu_tilt', x: 1450, h: 430, t0: 4.6, enter: 'right'}, {s: 'emu_stand', x: 420, h: 400, t0: 5.6, enter: 'left', flip: true}, ...flock(3, {x0: 300, x1: 1500, y: 740, h: 250, dxv: 160, seed: 3, t1: 3.3})], sfx: [[0.6, 'pop'], [1.6, 'pop'], [3.3, 'boing', 0.5], [4.6, 'whoosh', 0.5]]},
  /* 4 soldier-settler */ {bg: 'dry', items: [{s: 'mr_helmet', x: 650, r: 80, t1: 3.6, fade: 0.2}, {s: 'mr_hoe', x: 650, r: 80, t0: 3.6, enter: 'pop'}, {s: 'shack', x: 1400, h: 380, t0: 4.6, enter: 'pop'}], sfx: [[3.6, 'pop'], [4.6, 'pop']]},
  /* 5 verdict */ {bg: 'day', items: [{s: 'mr_deadpan', x: 960, r: 86, poses: [[3.6, 'mr_shrug']]}], sfx: [[3.6, 'boing', 0.5]]},
  /* 6 depression */ {bg: 'dry', items: [{s: 'mr_worry', x: 520, r: 82}, {s: 'sacks', x: 1050, h: 280, t0: 1.0, enter: 'pop'}, {s: 'sacks', x: 1350, h: 300, t0: 3.0, enter: 'pop'}, {s: 'sacks', x: 1650, h: 320, t0: 5.0, enter: 'pop'}], sfx: [[1, 'thud', 0.6], [3, 'thud', 0.6], [5, 'thud', 0.6]]},
  /* 7 drought pushes emus */ {bg: 'dry', items: [{s: 'mr_deadpan', x: 480, r: 80}, ...flock(5, {x0: 1000, x1: 2400, dir: -1, y: 760, h: 330, dxv: 520, seed: 7, rows: 2})]},
  /* 8 twenty thousand + deputation */ {bg: 'dry', items: [{s: 'mr_worry', x: 300, r: 62}, ...flock(14, {x0: 650, x1: 2300, dir: -1, y: 730, h: 300, dxv: 300, t1: 5.2, seed: 11, rows: 4}), {s: 'mr_walk', x: 300, r: 78, t0: 5.6, walk: true, dx: 600, enter: 'left'}, {s: 'mr_walk', x: 140, r: 78, t0: 5.9, walk: true, dx: 600, enter: 'left'}, {s: 'mr_helmet', x: 430, r: 78, t0: 6.2, enter: 'left', dx: 520}], sfx: [[5.6, 'whoosh', 0.5]]},
  /* 9 Pearce says yes, WA pays transport */ {bg: 'indoor', items: [{s: 'counter', x: 1350, h: 420, y: 800}, {s: 'mr_slip', x: 650, r: 80, enter: 'left'}, {s: 'truck', x: 400, h: 330, t0: 5.2, enter: 'left', dx: 1500, y: 840, z: 900}], sfx: [[5.2, 'whoosh', 0.6]]},
 /* 10 deal (image) */ {bg: 'day', items: [], img: [{src: 'deal', z0: 1.0, z1: 1.1, px: -40}], sfx: [[0.5, 'whoosh', 0.4], [6.2, 'boing', 0.5]]},
  /* 11 2 Nov Campion, Meredith, 2 guns, 10k rounds */ {bg: 'dry', items: [{s: 'truck', x: 200, h: 340, enter: 'left', dx: 520, t1: 11, y: 850}, {s: 'lewis_gun', x: 1150, w: 340, y: 870, t0: 5.0, enter: 'pop'}, {s: 'lewis_gun', x: 1480, w: 340, y: 870, t0: 5.7, enter: 'pop'}, {s: 'crate', x: 1760, h: 240, t0: 7.2, enter: 'pop'}], sfx: [[0.3, 'whoosh', 0.5], [5, 'pop'], [5.7, 'pop'], [7.2, 'pop']]},
  /* 12 day one */ {bg: 'dry', items: [{s: 'mr_gun', x: 500, r: 82, poses: [[5.3, 'mr_cheer']]}, ...flock(8, {x0: 850, x1: 2000, dir: 1, y: 760, h: 300, dxv: 240, seed: 21})], sfx: [[3.3, 'mg_short', 0.9], [5.3, 'boing', 0.5]]},
 /* 13 dam jam (image) */ {bg: 'dry', items: [], img: [{src: 'dam', z0: 1.0, z1: 1.12, px: -40}], sfx: [[1.7, 'mg_burst', 1.0], [3.15, 'clink', 0.9]]},
  /* 14 invulnerability of tanks */ {bg: 'dry', items: [{s: 'mr_worry', x: 380, r: 66}, {s: 'emu_stand', x: 1260, h: 640, t0: 0.6, enter: 'pop'}], sfx: [[0.6, 'pop']]},
 /* 15 parliament (image) */ {bg: 'day', items: [], img: [{src: 'parliament', z0: 1.0, z1: 1.1, px: 30}], sfx: [[4.2, 'boing', 0.5]]},
  /* 16 army out, then back */ {bg: 'dusk', items: [{s: 'truck', x: 500, h: 340, y: 850, t1: 5.6, dx: 1500, flip: false}, {s: 'mr_walk', x: 420, r: 76, walk: true, t1: 5.6, dx: 1400}, {s: 'emu_stand', x: 1500, h: 400, flip: true, t0: 0.5, enter: 'fade'}, {s: 'emu_tilt', x: 1750, h: 380, t0: 1.2, enter: 'fade'}, {s: 'truck', x: 1700, h: 340, y: 850, flip: true, t0: 6.2, dx: -900, enter: 'right'}, {s: 'lewis_gun', x: 500, w: 330, y: 870, t0: 8.2, enter: 'pop'}], sfx: [[6.2, 'whoosh', 0.6], [8.2, 'pop'], [8.5, 'mg_short', 0.8]]},
  /* 17 986 from 9860 rounds */ {bg: 'dry', items: [{s: 'crate', x: 360, h: 230, t0: 0.8, enter: 'pop'}, {s: 'crate', x: 560, h: 250, t0: 1.4, enter: 'pop'}, {s: 'crate', x: 760, h: 270, t0: 2.0, enter: 'pop'}, {s: 'mr_deadpan', x: 1330, r: 82, poses: [[4.6, 'mr_shrug']]}, ...flock(4, {x0: 900, x1: 1700, y: 735, h: 220, dxv: 140, seed: 31})], sfx: [[5.3, 'mg_burst', 0.9], [0.8, 'pop'], [1.4, 'pop'], [2, 'pop'], [4.6, 'boing', 0.5]]},
 /* 18 army leaves (image) */ {bg: 'day', items: [], img: [{src: 'leaves', z0: 1.0, z1: 1.12, px: 40}], sfx: [[0.3, 'whoosh', 0.5]]},
  /* 19 the law 1874: wrong answer */ {bg: 'day', items: [{s: 'fence', x: 960, w: 1300, y: 860, z: 850}, {s: 'emu_stand', x: 1300, h: 480, y: 810, z: 800}, {s: 'emu_tilt', x: 700, h: 460, y: 805, t0: 1.0, enter: 'fade', z: 799}, {s: 'mr_gun', x: 260, r: 76, poses: [[7.4, 'mr_shrug']]}], sfx: [[7.4, 'boing', 0.5]]},
  /* 20 1922 flipped: farmers complain */ {bg: 'indoor', items: [{s: 'counter', x: 1450, h: 430, y: 800}, {s: 'mr_hoe', x: 500, r: 76, enter: 'left', dx: 360}, {s: 'mr_worry', x: 250, r: 76, t0: 1.0, enter: 'left', dx: 360}], sfx: [[0.3, 'whoosh', 0.4]]},
  /* 21 vermin listing */ {bg: 'indoor', items: [{s: 'counter', x: 1350, h: 430, y: 800}, {s: 'mr_slip', x: 600, r: 80, walk: true, dx: 330, t0: 0.3}], extra: (t) => <>{Array.from({length: 7}, (_, i) => <Paper key={i} x={1050 + (i % 4) * 90} y={760 - Math.floor(i / 4) * 12} t={t} t0={4 + i * 0.7} lines={3} w={110} rot={(i - 3) * 8} />)}</>, sfx: [[4, 'pop', 0.5], [5.4, 'pop', 0.5], [6.8, 'pop', 0.5]]},
  /* 22 bounty tallied shire by shire */ {bg: 'indoor', items: [{s: 'counter', x: 1200, h: 440, y: 800}, {s: 'mr_slip', x: 620, r: 82}, {s: 'beak', x: 1200, w: 190, y: 560, t0: 2.2, enter: 'pop', z: 900}], sfx: [[2.2, 'pop']]},
 /* 23 beak proof + claim (image) */ {bg: 'day', items: [], img: [{src: 'queue', z0: 1.0, z1: 1.1, px: -40}], sfx: [[0, 'pop', 0.5]]},
 /* 24 57,034 (image) */ {bg: 'dry', items: [], img: [{src: 'mountain', z0: 1.12, z1: 1.0, px: 30}], sfx: [[0.3, 'whoosh', 0.4]]},
  /* 25 300 a day vs 26 */ {bg: 'dry', items: [{s: 'lewis_gun', x: 420, w: 300, y: 860}, ...beaks(3, {x: 700, y: 860, w: 110, t0: 1.0, step: 0.3, spread: 100, rows: 3}), ...beaks(48, {x: 1320, y: 860, w: 100, t0: 2.4, step: 0.08, spread: 62, rows: 10})], sfx: [[2.4, 'pop', 0.5]]},
  /* 26 July 1943 Chief Guardian wrote */ {bg: 'indoor', items: [{s: 'counter', x: 1450, h: 420, y: 800}, {s: 'mr_deadpan', x: 520, r: 80}], extra: (t) => <Paper x={1000} y={780} t={t} t0={1.0} w={300} lines={5} fillT={0.6} />, sfx: [[1, 'pop']]},
 /* 27 virtually lost control (image) */ {bg: 'day', items: [], img: [{src: 'letter', z0: 1.0, z1: 1.1, px: 20}], sfx: [[6.2, 'rumble', 0.4]]},
  /* 28 his paddock is one of those dots */ {bg: 'day', items: [{s: 'shack', x: 1500, h: 330, y: 800}, {s: 'mr_worry', x: 520, r: 80}, ...flock(5, {x0: 650, x1: 1450, y: 770, h: 260, dxv: 60, seed: 61})]},
  /* 29 1943 free ammo + motor vehicle hunts */ {bg: 'dry', items: [{s: 'crate', x: 420, h: 260, t0: 0.6, enter: 'pop'}, {s: 'crate', x: 700, h: 260, t0: 1.4, enter: 'pop'}, {s: 'crate', x: 980, h: 260, t0: 2.2, enter: 'pop'}, {s: 'truck', x: 1800, h: 330, y: 850, flip: true, t0: 4.8, enter: 'right', dx: -1600}], sfx: [[0.6, 'pop'], [1.4, 'pop'], [2.2, 'pop'], [4.8, 'whoosh', 0.6]]},
  /* 30 not the army; farmers asked again */ {bg: 'indoor', items: [{s: 'counter', x: 1400, h: 430, y: 800}, {s: 'mr_hoe', x: 700, r: 74}, {s: 'mr_worry', x: 480, r: 74, poses: [[5.2, 'mr_shrug']]}, {s: 'mr_deadpan', x: 260, r: 74, poses: [[5.6, 'mr_shrug']]}]},
  /* 31 refused; 1945-60 one shilling per beak */ {bg: 'indoor', items: [{s: 'counter', x: 1300, h: 440, y: 800}, {s: 'mr_slip', x: 620, r: 80, poses: [[3, 'mr_shrug']]}, {s: 'beak', x: 1300, w: 130, y: 600, t0: 5.4, enter: 'pop', z: 900}], extra: (t) => <Coin x={1450} y={700} t={t} t0={6.2} />, sfx: [[5.4, 'pop', 0.5], [6.2, 'clink', 0.7]]},
  /* 32 284,724 beaks */ {bg: 'dry', z0: 1.1, z1: 1.0, items: [{s: 'mr_deadpan', x: 280, r: 74}, ...beaks(66, {x: 1150, y: 870, w: 120, t0: 0.5, step: 0.1, spread: 74, rows: 11})]},
  /* 33 1947 protection; gaming */ {bg: 'day', items: [{s: 'fence', x: 900, w: 1400, y: 860, z: 850}, {s: 'emu_stand', x: 1250, h: 440, y: 800, t1: 5.5, fade: 0.3}, {s: 'emu_tilt', x: 1050, h: 420, y: 800, t0: 0.6, t1: 5.5, fade: 0.3}, {s: 'mr_walk', x: 250, r: 78, walk: true, t0: 6.0, dx: 900, y: 930, z: 950}, {s: 'beak', x: 300, w: 140, y: 640, t0: 6.0, dx: 900, enter: 'pop', z: 960}, {s: 'mr_slip', x: 1500, r: 80, t0: 10.2, enter: 'pop'}], sfx: [[6, 'pop', 0.5], [10.2, 'pop', 0.5]]},
  /* 34 cannot be relied upon */ {bg: 'indoor', items: [{s: 'mr_shrug', x: 540, r: 82}], extra: (t) => <Tally x={1250} y={800} t={t} shake={t > 1.0 ? 5 : 0} />, sfx: [[1, 'boing', 0.5]]},
 /* 35 gun never came back (image) */ {bg: 'dusk', items: [], img: [{src: 'finale', z0: 1.0, z1: 1.1, px: -30}], sfx: []},
  /* 36 reaches for the pencil */ {bg: 'dusk', items: [{s: 'lewis_gun', x: 280, w: 260, y: 860, rot: -8}, {s: 'mr_slip', x: 1000, r: 84}, ...flock(5, {x0: 1050, x1: 2350, dir: -1, y: 740, h: 250, dxv: 520, seed: 81})]},
  /* 37 kaiser + subscribe */ {bg: 'dusk', items: [{s: 'mr_point', x: 960, r: 86, poses: [[3.4, 'mr_cheer']]}, ...flock(6, {x0: 150, x1: 1850, dir: 1, y: 740, h: 230, dxv: 260, seed: 91})], sfx: [[3.4, 'pop']]},
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

// ---------------- shot ----------------
const ShotView: React.FC<{i: number; t: number; dur: number}> = ({i, t, dur}) => {
  const sh = SHOTS[i];
  const u = clamp(t / dur);
  const z = lerp(sh.z0 ?? 1.0, sh.z1 ?? 1.035, eio(u));
  const items = [...sh.items].sort((a, b) => (a.z ?? (a.y ?? FEET)) - (b.z ?? (b.y ?? FEET)));
  if (sh.img) {
    return (
      <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
        {sh.img.map((b, k) => {
          const a = b.t0 ?? 0, e = b.t1 ?? dur + 1;
          if (t < a || t >= e) return null;
          const uu = clamp((t - a) / Math.max(e - a, 0.1));
          const zz = lerp(b.z0 ?? 1.0, b.z1 ?? 1.09, uu);
          const punch = k > 0 ? Math.max(0, 1 - (t - a) / 0.35) * 0.06 : 0;
          const sh2 = k > 0 && t - a < 0.4 ? Math.sin((t - a) * 90) * 10 * (1 - (t - a) / 0.4) : 0;
          return <Img key={k} src={staticFile(`emu/img_${b.src}.png`)} style={{position: 'absolute', left: sh2, top: 0, width: W, height: H, objectFit: 'cover', transform: `translateX(${(b.px ?? 0) * uu}px) scale(${zz + punch})`, filter: 'saturate(1.12)'}} />;
        })}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: 'saturate(1.3) contrast(1.05)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 80%', transform: `scale(${z})`}}>
        <Bg kind={sh.bg} dam={sh.dam} />
        {items.map((it, k) => <ItemView key={k} it={it} t={t} />)}
        {sh.extra && sh.extra(t)}
      </div>
    </AbsoluteFill>
  );
};

export const EmuWar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const sfx: [number, string, number][] = [];
  shotTimes.forEach((s: any, i: number) => {
    sfx.push([s.start - 0.05, 'whoosh', 0.35]);
    (SHOTS[i].sfx ?? []).forEach(([dt, n, v]) => sfx.push([s.start + dt, n, v ?? 0.6]));
  });
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shotTimes.map((s: any, i: number) => {
        const from = Math.max(0, s.start - TR);
        const len = s.end - from + (i === shotTimes.length - 1 ? 0.8 : 0);
        const lt = T - s.start; // local time (can be negative during the slide-in)
        const slideU = i === 0 ? 1 : eo((T - from) / TR);
        return (
          <Sequence key={i} from={Math.round(from * fps)} durationInFrames={Math.round(len * fps) + 2}>
            <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`, boxShadow: slideU < 1 ? '-20px 0 40px rgba(0,0,0,0.25)' : 'none'}}>
              <ShotView i={i} t={Math.max(0, lt)} dur={s.end - s.start} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Captions t={T} />
      <AbsoluteFill style={{background: '#000', opacity: clamp((T - (TOTAL - 1.0)) / 1.0)}} />
      <Audio src={staticFile('emu/voice.wav')} volume={1.0} />
      {HAS_MUSIC && <Audio src={staticFile('emu/music.mp3')} volume={(f) => 0.09 * Math.min(1, f / fps / 2) * Math.min(1, (TOTAL * fps - f) / (fps * 2))} />}
      {sfx.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.max(0, Math.round(t0 * fps))} durationInFrames={Math.round(2.6 * fps)}>
          <Audio src={staticFile(`emu/${name}.wav`)} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
