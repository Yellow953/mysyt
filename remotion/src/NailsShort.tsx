// @ts-nocheck
// "What if you never cut your fingernails?" vertical Short: whole illustrated hook image + cut-out animation.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from '../public/nails/meta.json';
import caps from './nailsCaps.json';

export const NAILS_TOTAL = 40.9;
const W = 1080, H = 1920;
const HORIZON = 1300;
const FEET = 1420;
const INK = '#141414';
const TR = 0.4;
const BOUNDS = [0, 4.65, 10.7, 18.1, 23.7, 29.95, 35.55, NAILS_TOTAL];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

type Item = {s: string; x: number; y?: number; r?: number; h?: number; w?: number; t0?: number; t1?: number; poses?: [number, string, number?][]; rot?: number; enter?: string; flip?: boolean; dx?: number; dy?: number; sway?: number; sc0?: number; sc1?: number; shake?: [number, number, number]; shadow?: boolean};

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
  const dxp = (it.dx ?? 0) * eio(lt / dur), dyp = (it.dy ?? 0) * eio(lt / dur);
  let ex = 0, ey = 0, es = 1;
  const eu = clamp(lt / (it.enter === 'pop' ? 0.35 : 0.6));
  if (it.enter === 'pop') { es = eu <= 0 ? 0 : eu >= 1 ? 1 : 1 - Math.pow(1 - eu, 3) * Math.cos(eu * 9) * 0.9; }
  else if (it.enter === 'left') ex = -(1 - eo(eu)) * (it.x + w + 100);
  else if (it.enter === 'right') ex = (1 - eo(eu)) * (W - it.x + w + 100);
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const g = lerp(it.sc0 ?? 1, it.sc1 ?? it.sc0 ?? 1, eio(lt / dur));
  const sx = (1 - 0.12 * k) * es * g, sy = (1 + 0.12 * k) * es * g;
  const isChar = !!it.r;
  const bob = isChar ? Math.sin(lt * 2.4) * 3 : 0;
  let shx = 0;
  if (it.shake && t >= it.shake[0] && t < it.shake[1]) shx = Math.sin(t * 90) * it.shake[2];
  const x = xo + dxp + ex + shx, y = (it.y ?? FEET) + dyp + ey + bob;
  const rot = (it.rot ?? 0) + (it.sway ? Math.sin(lt * 3) * it.sway : 0);
  return (
    <>
      {(isChar || it.shadow) && es > 0.5 && <div style={{position: 'absolute', left: x - w * 0.3, top: (it.y ?? FEET) - 16, width: w * 0.6, height: 30, borderRadius: '50%', background: 'rgba(30,60,30,0.28)'}} />}
      <div style={{position: 'absolute', left: x - fx, top: y - h, width: w, height: h, transformOrigin: `${fx}px ${h}px`, transform: `${it.flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx},${sy})`}}>
        <Img src={staticFile(`nails/sp/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

const Label: React.FC<{text: string; x: number; y: number; t: number; t0: number; t1?: number; size?: number; color?: string; rot?: number}> = ({text, x, y, t, t0, t1, size = 110, color = '#ffd400', rot = 0}) => {
  const lt = t - t0;
  if (lt < 0 || (t1 !== undefined && t > t1)) return null;
  const u = clamp(lt / 0.35);
  const s = 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: size, color, WebkitTextStroke: `${size * 0.13}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', letterSpacing: 2, textAlign: 'center', lineHeight: 1.05}}>{text}</div>;
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

const NightBg: React.FC<{city?: boolean}> = ({city}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: HORIZON + 4, background: 'linear-gradient(#14224d, #3b3f8f)'}} />
    {city ? (
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        {[[0, 760, 200, '#2b2f66'], [190, 620, 220, '#35397a'], [400, 840, 180, '#2b2f66'], [570, 560, 240, '#3a3f86'], [800, 780, 290, '#2b2f66']].map(([x, y, w, c], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={HORIZON - y} fill={c} stroke={INK} strokeWidth={5} />
            {Array.from({length: 18}, (_, k) => <rect key={k} x={x + 16 + (k % 3) * (w / 3.4)} y={y + 24 + Math.floor(k / 3) * 70} width={w / 6} height={34} fill={(k * 7 + i) % 3 === 0 ? '#ffb347' : '#5d63b8'} />)}
          </g>
        ))}
        <rect x={600} y={400} width={300} height={170} rx={10} fill="#ff4d6d" stroke={INK} strokeWidth={6} />
        <rect x={140} y={470} width={260} height={150} rx={10} fill="#33d1ff" stroke={INK} strokeWidth={6} />
      </svg>
    ) : (
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        <circle cx={220} cy={330} r={90} fill="#f3f3ff" stroke={INK} strokeWidth={6} />
        <circle cx={250} cy={310} r={80} fill="#25306c" />
        {[[500, 220], [700, 340], [900, 200], [400, 560], [960, 520], [140, 700]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#fff" />)}
      </svg>
    )}
    <div style={{position: 'absolute', left: 0, top: HORIZON, width: W, height: H - HORIZON, background: city ? '#3b3b55' : '#6b3f26'}} />
    <div style={{position: 'absolute', left: 0, top: HORIZON - 3, width: W, height: 6, background: INK}} />
  </>
);

// ---------- whole image hook ----------
const HookShot: React.FC<{t: number}> = ({t}) => {
  const u = eio(t / 2.5);
  let z = lerp(1.9, 1.0, u);
  const p = clamp((t - 2.9) / 0.45);
  if (t > 2.9) z *= 1 + 0.09 * Math.sin(Math.min(p, 1) * Math.PI) + 0.03 * clamp((t - 3.3) / 1.2);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#2ea8ff'}}>
      <Img src={staticFile('nails/img_hook.png')} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, objectFit: 'cover', transformOrigin: '45% 35%', transform: `scale(${z})`, filter: 'saturate(1.12)'}} />
      <Label text="66 YEARS" x={W / 2} y={H * 0.17} t={t} t0={2.9} size={190} color="#ffffff" rot={-4} />
    </AbsoluteFill>
  );
};

// ---------- S2: 3 mm a month, then snap ----------
const Calendar: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => {
  const page = Math.min(3, Math.floor(Math.max(0, t - 0.7) / 0.8));
  const fu = clamp(((t - 0.7) % 0.8) / 0.25);
  const months = ['JAN', 'FEB', 'MAR', 'APR'];
  return (
    <div style={{position: 'absolute', left: x - 170, top: y - 190, width: 340, height: 380}}>
      <div style={{position: 'absolute', inset: 0, background: '#fffdf4', border: `7px solid ${INK}`, borderRadius: 14}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 340, height: 90, background: '#ff4d4d', border: `7px solid ${INK}`, borderRadius: '14px 14px 0 0'}} />
      <div key={page} style={{position: 'absolute', left: 0, top: 110, width: 340, textAlign: 'center', fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 130, color: INK, transform: `scaleY(${t > 0.7 && page < 4 ? (fu < 1 ? 0.3 + 0.7 * fu : 1) : 1})`}}>{months[page]}</div>
    </div>
  );
};
const Shot2: React.FC<{t: number}> = ({t}) => {
  const growth = 0.9 + 0.1 * clamp(t / 3.4);
  const snapped = t >= 3.5;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      <Calendar t={t} x={760} y={340} />
      <Label text="3 MM / MONTH" x={700} y={700} t={t} t0={0.9} size={96} color="#ffffff" />
      <Sprite it={{s: 'hand', x: 790, w: 620 * growth, y: FEET, shadow: true, shake: [3.5, 3.9, 8]}} t={t} />
      {snapped && <Sprite it={{s: 'curl', x: 1000, w: 130, y: 1000, t0: 3.5, t1: 5.8, dx: 140, dy: 420, rot: 540, enter: 'pop'}} t={t} />}
      <Label text="SNAP" x={820} y={880} t={t} t0={3.5} t1={5.0} size={150} color="#ff3b1f" rot={8} />
      <Sprite it={{s: 'mr_deadpan', x: 240, r: 112, t0: 0, enter: 'pop', poses: [[3.7, 'mr_shrug']]}} t={t} />
    </AbsoluteFill>
  );
};

// ---------- S3: the teacher ----------
const Shot3: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <DayBg />
    <Label text="1952" x={W / 2} y={250} t={t} t0={0.3} size={150} color="#ffffff" />
    <Label text="AGE 14" x={W / 2} y={420} t={t} t0={2.4} size={150} color="#ffd400" />
    <Sprite it={{s: 'teacher', x: 760, h: 900, t0: 0, enter: 'right', shake: [5.4, 6.2, 5], shadow: true}} t={t} />
    <Sprite it={{s: 'mr_deadpan', x: 210, r: 108, t0: 0, enter: 'left', poses: [[2.4, 'mr_point']]}} t={t} />
  </AbsoluteFill>
);

// ---------- S4: growth to 30 ft ----------
const Shot4: React.FC<{t: number}> = ({t}) => {
  const grow = eio((t - 0.3) / 3.3);
  const hw = lerp(260, 900, grow);
  const year = Math.round(lerp(1952, 2018, clamp((t - 0.2) / 1.0)));
  const rulerW = (W - 80) * eio((t - 0.6) / 3.0);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      <Label text={String(year)} x={W / 2} y={230} t={t} t0={0.1} size={170} color="#ffffff" />
      <Label text="ABOUT 30 FT" x={W / 2} y={400} t={t} t0={1.5} size={150} />
      <Label text="WORLD RECORD" x={W / 2} y={520} t={t} t0={3.6} size={100} color="#ffffff" />
      <Label text="ONE HAND" x={W / 2} y={620} t={t} t0={3.7} size={100} color="#ffffff" />
      <Sprite it={{s: 'hand', x: -80 + hw * 0.41, w: hw, y: 1385 + 0, t0: 0}} t={t} />
      <div style={{position: 'absolute', left: 40, top: 1470, width: rulerW, height: 56, background: '#ffe7a8', border: `6px solid ${INK}`, borderRadius: 6, overflow: 'hidden'}}>
        <svg width={W} height={56}>{Array.from({length: 40}, (_, i) => <path key={i} d={`M${i * 26},0 v${i % 5 === 0 ? 34 : 20}`} stroke={INK} strokeWidth={4} />)}</svg>
      </div>
      <Sprite it={{s: 'mr_deadpan', x: 900, r: 100, t0: 0, t1: 1.5}} t={t} />
      <Sprite it={{s: 'mr_walk', x: 900, r: 100, t0: 1.5, t1: 3.9, dx: 420}} t={t} />
    </AbsoluteFill>
  );
};

// ---------- S5: the cost (sleep) ----------
const Clock: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => {
  const ang = 360 * eio((t - 3.0) / 1.4);
  return (
    <svg style={{position: 'absolute', left: x - 120, top: y - 120}} width={240} height={240} viewBox="-120 -120 240 240">
      <circle r={104} fill="#fffdf4" stroke={INK} strokeWidth={9} />
      <line x1={0} y1={0} x2={0} y2={-60} stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${ang / 12})`} />
      <line x1={0} y1={0} x2={0} y2={-84} stroke="#ff3b1f" strokeWidth={7} strokeLinecap="round" transform={`rotate(${ang})`} />
      <circle r={9} fill={INK} />
    </svg>
  );
};
const Shot5: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <NightBg />
    <Sprite it={{s: 'bed', x: 700, w: 720, y: FEET, t0: 0, enter: 'pop'}} t={t} />
    <Clock t={t} x={850} y={460} />
    <Label text="30 MIN" x={850} y={680} t={t} t0={3.2} size={110} color="#ffffff" />
    <Sprite it={{s: 'mr_deadpan', x: 170, r: 100, t0: 0, poses: [[2.6, 'mr_worry']]}} t={t} />
  </AbsoluteFill>
);

// ---------- S6: the saw ----------
const Shot6: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <NightBg city />
    <Label text="JULY 2018" x={W / 2} y={240} t={t} t0={0.3} size={140} color="#ffffff" />
    <Label text="TIMES SQUARE" x={W / 2} y={380} t={t} t0={1.4} size={120} />
    {/* display stand */}
    <div style={{position: 'absolute', left: 800, top: 1130, width: 230, height: 290, background: '#e8e8f4', border: `7px solid ${INK}`, borderRadius: 6}} />
    <div style={{position: 'absolute', left: 780, top: 1110, width: 270, height: 40, background: '#c9c9de', border: `7px solid ${INK}`, borderRadius: 6}} />
    <Sprite it={{s: 'curl', x: 915, w: 200, y: 1108, t0: 4.2, enter: 'pop'}} t={t} />
    {t >= 3.3 && t < 4.4 && <Sprite it={{s: 'curl', x: 600, w: 110, y: 1000, t0: 3.5, t1: 4.4, dx: 230, dy: 120, rot: 300}} t={t} />}
    <Sprite it={{s: 'saw', x: 520, w: 440, y: 1290, t0: 0, enter: 'left', shake: [3.0, 4.8, 5], dx: 60, t1: 5.2}} t={t} />
    <Sprite it={{s: 'mr_worry', x: 160, r: 80, t0: 0.2, enter: 'left'}} t={t} />
  </AbsoluteFill>
);

// ---------- S7: the ending ----------
const Shot7: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <DayBg />
    <Sprite it={{s: 'mr_deadpan', x: 500, r: 125, t0: 0, poses: [[3.3, 'mr_shrug']]}} t={t} />
    {t < 2.1 && <Sprite it={{s: 'curl', x: 800, w: 110, y: FEET - 10, t0: 0.3, enter: 'pop', shadow: true}} t={t} />}
    {t >= 2.0 && t < 2.9 && <Sprite it={{s: 'curl', x: 800, w: 110, y: FEET - 10, t0: 2.0, t1: 2.9, dx: 150, dy: -460, rot: 360}} t={t} />}
    <Label text="CLICK" x={800} y={FEET - 330} t={t} t0={2.0} t1={3.2} size={110} color="#ffffff" rot={-6} />
  </AbsoluteFill>
);

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
  if (i === 2) return <Shot3 t={t} />;
  if (i === 3) return <Shot4 t={t} />;
  if (i === 4) return <Shot5 t={t} />;
  if (i === 5) return <Shot6 t={t} />;
  return <Shot7 t={t} />;
};

const B = BOUNDS;
const SFX: [number, string, number][] = [
  [0.1, 'rumble', 0.4], [2.9, 'thud', 1.0], [2.9, 'whoosh', 0.6],
  [B[1] - 0.35, 'whoosh', 0.5], [B[1] + 0.2, 'pop', 0.6], [B[1] + 0.9, 'tick', 0.6], [B[1] + 1.7, 'tick', 0.6], [B[1] + 2.5, 'tick', 0.6], [B[1] + 3.5, 'crack', 1.0], [B[1] + 3.7, 'boing', 0.5],
  [B[2] - 0.35, 'whoosh', 0.5], [B[2] + 0.3, 'pop', 0.6], [B[2] + 2.4, 'pop', 0.7], [B[2] + 5.4, 'boing', 0.5],
  [B[3] - 0.35, 'whoosh', 0.5], [B[3] + 0.2, 'tick', 0.5], [B[3] + 0.5, 'tick', 0.5], [B[3] + 0.8, 'tick', 0.5], [B[3] + 1.5, 'thud', 0.9], [B[3] + 3.6, 'pop', 0.7],
  [B[4] - 0.35, 'whoosh', 0.5], [B[4] + 0.3, 'pop', 0.5], [B[4] + 2.6, 'boing', 0.4], [B[4] + 3.2, 'ting', 0.7], [B[4] + 3.9, 'ting', 0.7],
  [B[5] - 0.35, 'whoosh', 0.5], [B[5] + 0.3, 'pop', 0.6], [B[5] + 1.4, 'thud', 0.8], [B[5] + 3.0, 'saw', 0.8], [B[5] + 4.2, 'pop', 0.6],
  [B[6] - 0.35, 'whoosh', 0.5], [B[6] + 0.3, 'pop', 0.4], [B[6] + 2.0, 'tick', 1.0], [B[6] + 3.3, 'boing', 0.4],
  [NAILS_TOTAL - 0.5, 'whoosh', 0.5],
];

export const NailsShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const loopU = eo((T - (NAILS_TOTAL - 0.5)) / 0.5);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {BOUNDS.slice(0, -1).map((b, i) => {
        const end = BOUNDS[i + 1];
        const from = Math.max(0, b - TR);
        const slideU = i === 0 ? 1 : eo((T - from) / TR);
        return (
          <Sequence key={i} from={Math.round(from * fps)} durationInFrames={Math.round((end - from) * fps) + 2}>
            <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`}}>
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
      <Audio src={staticFile('nails/voice.wav')} volume={1.0} />
      <Audio src={staticFile('nails/music.mp3')} volume={(f) => {
        const t = f / fps;
        const voiced = caps.some((c: any) => t >= c.start - 0.1 && t < c.end);
        return 0.22 * (voiced ? 0.55 : 1) * Math.min(1, t / 0.5) * Math.min(1, (NAILS_TOTAL - t) / 1.2);
      }} />
      {SFX.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.round(t0 * fps)} durationInFrames={Math.round(2.6 * fps)}>
          <Audio src={staticFile(`nails/${name}.wav`)} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
