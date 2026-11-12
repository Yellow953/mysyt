// @ts-nocheck
// Long-form (16:9) cut-out animation for "The Time Australia Went to War With Emus".
// Data-driven: shots come from emuShots.json (timing from the real voice), visuals from SHOTS below.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from './emuMeta';
import shotTimes from './shortShots.json';
import caps from './shortCaps.json';

export const SHORT_TOTAL = 48.6;
const W = 1080, H = 1920;
const HORIZON = 1280;
const FEET = 1560;
const INK = '#141414';
const TR = 0.5; // swipe transition length
const HAS_MUSIC = true;

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

// ---------------- backgrounds (vertical) ----------------
const BG: Record<string, any> = {
  day: {sky: ['#2ea8ff', '#c9efff'], hill: '#7fe05a', g1: '#58c93a', g2: '#3fae2e'},
  dry: {sky: ['#3da9f2', '#ffd9a0'], hill: '#f0b04a', g1: '#f0a640', g2: '#dc8a2e'},
  dusk: {sky: ['#ff5c39', '#ffb36b'], hill: '#c9743a', g1: '#b8602e', g2: '#8f4521'},
  indoor: {wall: '#f6cf94', floor: '#b5652e'},
};
const Bg: React.FC<{kind: string}> = ({kind}) => {
  const b = BG[kind];
  if (kind === 'indoor') {
    return (
      <>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1380, background: b.wall}} />
        <div style={{position: 'absolute', left: 0, top: 1380, width: W, height: H - 1380, background: b.floor}} />
        <div style={{position: 'absolute', left: 0, top: 1377, width: W, height: 6, background: INK}} />
        <div style={{position: 'absolute', left: 0, top: 1300, width: W, height: 80, background: '#e0a866'}} />
      </>
    );
  }
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: HORIZON + 4, background: `linear-gradient(${b.sky[0]}, ${b.sky[1]})`}} />
      <svg style={{position: 'absolute', left: 0, top: HORIZON - 230}} width={W} height={235} viewBox="0 0 1920 175" preserveAspectRatio="none">
        <path d="M0,175 L0,110 Q260,40 520,100 T1050,80 T1560,95 T1920,70 L1920,175 Z" fill={b.hill} stroke={INK} strokeWidth={5} />
      </svg>
      <div style={{position: 'absolute', left: 0, top: HORIZON, width: W, height: 200, background: b.g1}} />
      <div style={{position: 'absolute', left: 0, top: HORIZON + 200, width: W, height: H - HORIZON - 200, background: b.g2}} />
      <div style={{position: 'absolute', left: 0, top: HORIZON - 3, width: W, height: 6, background: INK}} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        {Array.from({length: 26}, (_, i) => {
          const x = 30 + i * 42 + ((i * 37) % 23), y = HORIZON + 60 + ((i * 53) % 480), hh = 22 + ((i * 29) % 16);
          return <path key={i} d={`M${x},${y} l-8,${-hh} M${x},${y} l1,${-hh - 8} M${x},${y} l9,${-hh}`} stroke={kind === 'day' ? '#1f7a2a' : '#a8561c'} strokeWidth={6} strokeLinecap="round" fill="none" />;
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

type ImgBeat = {src: string; t0?: number; t1?: number; z0?: number; z1?: number; fx0?: number; fx1?: number};
type Shot = {img?: ImgBeat[]; bg: string; items: Item[]; z0?: number; z1?: number; extra?: (t: number) => React.ReactNode; sfx?: [number, string, number?][]};

const SHOTS: Shot[] = [
  /* 1 hook A */ {bg: 'dry', items: [], img: [{src: 'hook_a', z0: 1.0, z1: 1.15, fx0: 0.19, fx1: 0.62}], sfx: [[0.05, 'rumble', 0.5], [0.1, 'mg_burst', 1.0]]},
  /* 2 hook B: giant emu face, Soldiers. Machine guns. Ten thousand bullets. */ {bg: 'dry', items: [], img: [{src: 'hook_b', z0: 1.12, z1: 1.0, fx0: 0.80, fx1: 0.42}], sfx: [[0, 'thud', 1.0], [0, 'whoosh', 0.7], [2.0, 'mg_short', 0.9]]},
  /* 3 farmers paid */ {bg: 'dry', items: [{s: 'crate', x: 780, h: 330, t0: 0.6, enter: 'pop'}, {s: 'sacks', x: 300, h: 380, t0: 1.6, enter: 'pop'}, {s: 'mr_shrug', x: 540, r: 96, y: 1560, t0: 0, z: 1600}, ...flock(3, {x0: 150, x1: 950, dir: 1, y: 1330, h: 230, dxv: 150, rows: 1, seed: 5})], sfx: [[0.6, 'pop'], [1.6, 'pop'], [3.3, 'boing', 0.5]]},
  /* 4 gun jammed + medals */ {bg: 'dry', items: [{s: 'mr_gun', x: 420, r: 98, poses: [[1.0, 'mr_worry']]}, {s: 'emu_medal', x: 860, h: 700, t0: 3.7, enter: 'right'}], extra: (t) => <Puff x={470} y={1080} t={t} t0={0.9} />, sfx: [[0.1, 'mg_short', 0.9], [0.95, 'clink', 0.9], [3.7, 'whoosh', 0.6]]},
  /* 5 army leaves (illustrated) */ {bg: 'dusk', items: [], img: [{src: 'leaves', z0: 1.0, z1: 1.12, fx0: 0.62, fx1: 0.3}], sfx: [[0.2, 'whoosh', 0.5]]},
  /* 6 queue (illustrated) */ {bg: 'indoor', items: [], img: [{src: 'queue', z0: 1.0, z1: 1.1, fx0: 0.30, fx1: 0.72}], sfx: [[0.1, 'pop', 0.5]]},
  /* 7 57,034 beaks */ {bg: 'dry', z0: 1.0, z1: 1.04, items: [{s: 'mr_deadpan', x: 240, r: 80}, ...beaks(45, {x: 700, y: 1560, w: 150, t0: 0.5, step: 0.12, spread: 84, rows: 7})], sfx: [[0.5, 'pop', 0.4]]},
  /* 8 army under a thousand */ {bg: 'dry', items: [{s: 'lewis_gun', x: 190, w: 280, y: 1560}, ...beaks(3, {x: 190, y: 1500, w: 90, t0: 0.4, step: 0.25, spread: 70, rows: 3}), ...beaks(30, {x: 740, y: 1560, w: 120, t0: 0.8, step: 0.06, spread: 70, rows: 6})], sfx: [[0.8, 'pop', 0.4]]},
  /* 9 final payment per beak + loop */ {bg: 'dusk', items: [{s: 'lewis_gun', x: 170, w: 260, y: 1560, rot: -8}, {s: 'mr_slip', x: 620, r: 100, poses: [[3.2, 'mr_cheer']]}, ...flock(4, {x0: 100, x1: 1000, dir: -1, y: 1340, h: 230, dxv: 380, rows: 2, seed: 9})], sfx: [[3.2, 'pop', 0.6]]},
];

// ---------------- captions ----------------
const Captions: React.FC<{t: number}> = ({t}) => {
  const c: any = (caps as any[]).find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 170}}>
      <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 102, letterSpacing: 2, lineHeight: 1.05}}>
        {c.words.map((w: any, i: number) => (
          <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `13px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{i: number; t: number; dur: number}> = ({i, t, dur}) => {
  const sh = SHOTS[i];
  const u = clamp(t / dur);
  const z = lerp(sh.z0 ?? 1.0, sh.z1 ?? 1.03, eio(u));
  const items = [...sh.items].sort((a, b) => (a.z ?? (a.y ?? FEET)) - (b.z ?? (b.y ?? FEET)));
  if (sh.img) {
    const IW = H * (1344 / 752);
    return (
      <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
        {sh.img.map((b, k) => {
          const a = b.t0 ?? 0, e = b.t1 ?? dur + 1;
          if (t < a || t >= e) return null;
          const uu = clamp((t - a) / Math.max(e - a, 0.1));
          const zz = lerp(b.z0 ?? 1.0, b.z1 ?? 1.1, uu);
          const fx = lerp(b.fx0 ?? 0.5, b.fx1 ?? 0.5, eio(uu));
          return <Img key={k} src={staticFile(`emu/img_${b.src}.png`)} style={{position: 'absolute', left: -(fx * IW - W / 2), top: 0, width: IW, height: H, transformOrigin: `${fx * IW}px 50%`, transform: `scale(${zz})`, filter: 'saturate(1.12)'}} />;
        })}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: 'saturate(1.3) contrast(1.05)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 80%', transform: `scale(${z})`}}>
        <Bg kind={sh.bg} />
        {items.map((it, k) => <ItemView key={k} it={it} t={t} />)}
        {sh.extra && sh.extra(t)}
      </div>
    </AbsoluteFill>
  );
};

export const EmuShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const sfx: [number, string, number][] = [];
  shotTimes.forEach((s: any, i: number) => {
    if (i > 0) sfx.push([s.start - 0.05, 'whoosh', 0.3]);
    (SHOTS[i].sfx ?? []).forEach(([dt, n, v]) => sfx.push([s.start + dt, n, v ?? 0.6]));
  });
  const loopU = clamp((T - (SHORT_TOTAL - 0.6)) / 0.5); // last 0.5 s: dissolve back into frame 0
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shotTimes.map((s: any, i: number) => {
        const from = Math.max(0, s.start - TR);
        const len = s.end - from;
        const lt = T - s.start;
        const slideU = i === 0 ? 1 : eo((T - from) / TR);
        return (
          <Sequence key={i} from={Math.round(from * fps)} durationInFrames={Math.round(len * fps) + 2}>
            <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`, boxShadow: slideU < 1 ? '-20px 0 40px rgba(0,0,0,0.25)' : 'none'}}>
              <ShotView i={i} t={Math.max(0, lt)} dur={s.end - s.start} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {loopU > 0 && (
        <AbsoluteFill style={{opacity: loopU}}>
          <ShotView i={0} t={0} dur={3.9} />
        </AbsoluteFill>
      )}
      <Captions t={T} />
      <Audio src={staticFile('emu/short_voice.wav')} volume={1.0} />
      {HAS_MUSIC && <Audio src={staticFile('emu/short_music.mp3')} volume={(f) => 0.10 * Math.min(1, f / fps / 0.5) * Math.min(1, (SHORT_TOTAL * fps - f) / (fps * 1.5))} />}
      {sfx.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.max(0, Math.round(t0 * fps))} durationInFrames={Math.round(2.6 * fps)}>
          <Audio src={staticFile(`emu/${name}.wav`)} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
