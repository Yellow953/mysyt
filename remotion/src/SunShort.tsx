// @ts-nocheck
// "Why don't we fill a rocket with our trash and dump it in the Sun?" Short (9:16, 1080x1920, 60 fps).
// Mix: one whole illustrated hook image (Ken Burns + punch) + cut-out animation. Timing from sunTimeline.json (real Grady voice).
// Audio is mixed outside Remotion (scripts in the video folder); render with --muted.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import tl from './sunTimeline.json';
import meta from './sunMeta.json';

export const SUN_TOTAL = tl.total;
const W = 1080, H = 1920;
const GROUND = 1400;
const FEET = 1460;
const INK = '#141414';
const IMPACT = 'Impact, "Arial Black", sans-serif';
const TR = 0.45;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const ei = (x: number) => Easing.in(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const rnd = (i: number, k = 1) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
const seg = tl.segs;
const S = (n: number) => seg[n - 1].start; // clip start
const E = (n: number) => seg[n - 1].end;

// shot start times (the slide-in finishes at these)
const SHOT_START = [0, S(2), S(3), 17.57, S(6), 31.3, 36.8];
// 0 hook, 1 launch, 2 space, 3 brake/55x, 4 bag rain, 5 rocket row, 6 recycle

// ---------------- sprites ----------------
const sprH = (s: string, it: any) => (it.r && s.startsWith('mr') || it.r && (s === 'hold' || s === 'throw')) ? meta[s].h * it.r / meta[s].head[2] : it.h;
const Sp: React.FC<any> = (it) => {
  const {s, x, y, t, t0 = 0, t1 = 1e9, flip, enter, anim, shadow, poses, c, spin} = it;
  if (t < t0 || t > t1) return null;
  let name = s, swapT = -9, nextSwap = 1e9;
  if (poses) for (const [pt, pn] of poses) { if (t >= pt) { name = pn; swapT = pt; } else if (pt < nextSwap) nextSwap = pt; }
  const m = meta[name];
  const h = sprH(name, it), sc = h / m.h, w = m.w * sc;
  const fx = c ? w / 2 : m.feet[0] * sc;
  const lt = t - t0;
  let es = 1, ex = 0, ey = 0, sx = 1, sy = 1, op = 1;
  if (enter === 'pop') { const u = clamp(lt / 0.35); es = u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9; }
  else if (enter === 'drop') { const D = it.dropH ?? 1100; ey = -(1 - ei(lt / 0.42)) * D; if (lt > 0.42) { const q = lt - 0.42; const k = Math.exp(-q * 10) * Math.cos(q * 26); sx = 1 + 0.2 * k; sy = 1 - 0.2 * k; } }
  else if (enter === 'fade') op = clamp(lt / 0.3);
  // pose swap: anticipation squash then stretch
  const dtn = nextSwap - t;
  if (dtn > 0 && dtn < 0.1) { const a = 1 - dtn / 0.1; sx *= 1 + 0.09 * a; sy *= 1 - 0.1 * a; }
  const ds = t - swapT;
  if (swapT > -9 && ds >= 0 && ds < 1) { const k = Math.exp(-ds * 9) * Math.cos(ds * 24) * 0.14; sx *= 1 - k; sy *= 1 + k; }
  if (it.fadeT && t1 < 1e8) op *= clamp((t1 - t) / it.fadeT);
  const a = anim ? anim(lt, t) : {};
  if (a.op !== undefined) op *= a.op;
  const px = x + ex + (a.dx || 0), py = y + ey + (a.dy || 0);
  const origin = c ? `${w / 2}px ${h / 2}px` : `${fx}px ${h}px`;
  const left = px - fx, top = c ? py - h / 2 : py - h;
  return (
    <>
      {shadow && es > 0.3 && <div style={{position: 'absolute', left: px - w * 0.3, top: y - 14, width: w * 0.6, height: 28, borderRadius: '50%', background: 'rgba(20,50,20,0.3)', opacity: op}} />}
      <div style={{position: 'absolute', left, top, width: w, height: h, opacity: op, transformOrigin: origin, transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${(a.rot || 0) + (spin ? spin * t : 0)}deg) scale(${sx * es * (a.sx || 1) * (a.sc || 1)},${sy * es * (a.sy || 1) * (a.sc || 1)})`}}>
        <Img src={staticFile(`sun/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

// ---------------- scenery ----------------
const Cloud: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <svg style={{position: 'absolute', left: x + Math.sin(t * 0.3 + x) * 10, top: y}} width={300 * s} height={130 * s} viewBox="0 0 300 130">
    <path d="M30,120 Q0,120 5,92 Q10,66 40,70 Q42,30 85,28 Q115,5 150,28 Q190,0 225,32 Q262,28 270,66 Q300,70 296,98 Q292,120 262,120 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);
const DaySky: React.FC<{t: number}> = ({t}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: GROUND + 4, background: 'linear-gradient(#1f8fff, #b8e8ff)'}} />
    <Cloud x={80} y={200} t={t} s={1.0} />
    <Cloud x={700} y={470} t={t + 3} s={0.8} />
  </>
);
const Ground: React.FC<{}> = () => (
  <>
    <div style={{position: 'absolute', left: 0, top: GROUND, width: W, height: H - GROUND, background: 'linear-gradient(#5bd23d, #3aa32a)'}} />
    <div style={{position: 'absolute', left: 0, top: GROUND - 3, width: W, height: 6, background: INK}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      {Array.from({length: 24}, (_, i) => { const x = 20 + i * 46 + ((i * 37) % 23), y = GROUND + 40 + ((i * 53) % 420), hh = 22 + ((i * 29) % 16);
        return <path key={i} d={`M${x},${y} l-8,${-hh} M${x},${y} l1,${-hh - 8} M${x},${y} l9,${-hh}`} stroke="#1f7a2a" strokeWidth={6} strokeLinecap="round" fill="none" />; })}
    </svg>
  </>
);
const Space: React.FC<{t: number; speed?: number}> = ({t, speed = 1}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: 'linear-gradient(#0e1b57, #2a55c9 55%, #6fb4ff)'}} />
    {Array.from({length: 40}, (_, i) => {
      const sp = 40 + rnd(i, 3) * 160 * speed;
      const x = (((rnd(i, 1) * W - t * sp) % W) + W) % W, y = rnd(i, 2) * 1250, r = 2 + rnd(i, 4) * 4;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: '50%', background: '#fff', opacity: 0.5 + rnd(i, 5) * 0.5}} />;
    })}
  </>
);
const Label: React.FC<any> = ({x, y, text, size = 110, t, t0, t1 = 1e9, color = '#ffd400', sub, stroke = 14, rot = 0}) => {
  if (t < t0 || t > t1) return null;
  const lt = t - t0; const u = clamp(lt / 0.35);
  const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return (
    <div style={{position: 'absolute', left: x - 520, top: y - size * 0.6, width: 1040, textAlign: 'center', fontFamily: IMPACT, fontSize: size, lineHeight: 1.05, letterSpacing: 2, color, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: 'stroke fill', transform: `rotate(${rot}deg) scale(${es})`, whiteSpace: 'nowrap'}}>
      {text}
      {sub && <div style={{fontSize: size * 0.5, color: '#fff', WebkitTextStroke: `${stroke * 0.6}px ${INK}`, marginTop: 4}}>{sub}</div>}
    </div>
  );
};
const Arrow: React.FC<any> = ({x, y, w, h = 150, dir = 1, color, text, op = 1, sc = 1}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: op, transform: `scale(${sc})`}}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', transform: dir < 0 ? 'scaleX(-1)' : 'none'}}>
      <path d={`M10,${h * 0.28} L${w - h * 0.55},${h * 0.28} L${w - h * 0.55},8 L${w - 8},${h / 2} L${w - h * 0.55},${h - 8} L${w - h * 0.55},${h * 0.72} L10,${h * 0.72} Z`} fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    </svg>
    <div style={{position: 'absolute', left: 0, top: 0, width: w - h * 0.2, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: IMPACT, fontSize: h * 0.42, color: '#fff', WebkitTextStroke: `7px ${INK}`, paintOrder: 'stroke fill', transform: dir < 0 ? 'translateX(' + (h * 0.2) + 'px)' : 'none'}}>{text}</div>
  </div>
);

// small helpers for thrusters
const Thrust: React.FC<any> = ({x, y, w, t, rot = 0, on = true}) => {
  if (!on) return null;
  const f = 1 + Math.sin(t * 40) * 0.12 + Math.sin(t * 27) * 0.08;
  const m = meta.fire; const h = w * m.h / m.w;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h * 0.22, width: w, height: h, transformOrigin: `${w / 2}px ${h * 0.22}px`, transform: `rotate(${rot}deg) scale(${0.9},${f * 1.25})`}}>
      <Img src={staticFile('sun/fire.png')} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

// ---------------- shots ----------------
// each returns scene content for local time t (seconds since the shot's START) and absolute time T
const smooth = (u: number) => { u = clamp(u); return u * u * (3 - 2 * u); };

const ShotHook: React.FC<{T: number}> = ({T}) => {
  const PT = 3.38; // "Sun?" lands
  let z = lerp(1.0, 1.06, clamp(T / PT));
  const dp = T - PT;
  if (dp >= 0) z = 1.06 + 0.05 * Math.exp(-dp * 4.5) + dp * 0.006;
  const sh = dp >= 0 && dp < 0.6 ? Math.exp(-dp * 8) * 14 : 0;
  const glow = 0.5 + 0.5 * Math.sin(T * 5);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0a3a8a'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 30%', transform: `translate(${Math.sin(T * 90) * sh}px,${Math.cos(T * 77) * sh}px) scale(${z})`}}>
        <Img src={staticFile('sun/img_hook.png')} style={{position: 'absolute', left: 0, top: -5, width: W, height: W * 1344 / 752, filter: 'saturate(1.2)'}} />
        <div style={{position: 'absolute', left: 140, top: 100, width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,230,120,0.30), rgba(255,160,40,0) 65%)', opacity: 0.45 + glow * 0.35}} />
      </div>
      {dp >= 0 && dp < 0.18 && <AbsoluteFill style={{background: '#fff', opacity: 0.35 * (1 - dp / 0.18)}} />}
    </AbsoluteFill>
  );
};

const ShotLaunch: React.FC<{T: number}> = ({T}) => {
  const t = T;
  const lift = clamp((t - 5.25) / 2.35); const p = lift * lift;
  const rx = lerp(700, 545, p), ry = lerp(GROUND - 26, 600, p), rs = lerp(1, 0.2, Math.pow(lift, 0.7));
  const rh = 720 * rs;
  const shk = t > 4.75 && t < 5.3 ? Math.sin(t * 90) * 4 : 0;
  const hit = t > 7.55;
  const sunPulse = hit ? 1 + Math.exp(-(t - 7.55) * 6) * Math.cos((t - 7.55) * 26) * 0.07 : 1 + Math.sin(t * 2) * 0.015;
  return (
    <>
      <DaySky t={t} />
      <Sp s="sun" c x={540} y={470} h={900} t={t} anim={(lt, tt) => ({sc: sunPulse, rot: Math.sin(tt * 0.6) * 3})} />
      <div style={{position: 'absolute', left: 700 - 190, top: GROUND - 34, width: 380, height: 40, background: '#8b95a6', border: `6px solid ${INK}`, borderRadius: 6}} />
      <Sp s="rocket" x={rx + shk} y={ry} h={rh} t={t} anim={(lt, tt) => ({rot: (1 - 0) * Math.sin(tt * 30) * (lift > 0 ? 1.2 : 0)})} />
      {t > 5.1 && lift < 1 && <Thrust x={rx} y={ry - 4 * rs} w={260 * rs + 20} t={t} rot={0} />}
      {/* smoke at the pad */}
      {[0, 1, 2, 3].map((i) => { const u = clamp((t - (5.1 + i * 0.12)) / 1.6); if (u <= 0 || u >= 1) return null; const dir = i % 2 ? 1 : -1;
        return <Img key={i} src={staticFile(`sun/smoke${i % 2 + 1}.png`)} style={{position: 'absolute', left: 700 + dir * (60 + u * 230) - 130 * (0.4 + u * 0.8), top: GROUND - 150 * (0.4 + u * 0.8) - u * 60, width: 260 * (0.4 + u * 0.8), opacity: 0.95 * (1 - u)}} />; })}
      <Ground />
      <Sp s="mr_deadpan" r={115} x={230} y={FEET} t={t} shadow poses={[[5.2, 'mr_salute']]} anim={(lt, tt) => ({dy: Math.sin(tt * 2.2) * 3})} />
      {/* rocket hits the Sun: sparks */}
      {hit && <Sp s="fire" c x={545} y={560} h={340 * clamp((t - 7.55) / 0.15) * (1 - clamp((t - 7.65) / 0.45))} t={t} />}
    </>
  );
};

const ShotSpace: React.FC<{T: number}> = ({T}) => {
  const t = T;
  const sx = lerp(560, 450, smooth((t - 8.29) / 6.1));
  const SUNY = 430;
  const lp = clamp((t - 11.9) / 2.6); // launch progress
  const ease = smooth(lp);
  const ox = 450, oy = SUNY, orx = 350, ory = 280;
  let rx, ry, rot = 0, on = false;
  const sunX = sx;
  const tOrbit0 = 14.5, tOrbit1 = 17.75;
  const orb = (a) => [sunX + orx * Math.cos(a), oy + ory * Math.sin(a)];
  const orbRot = (a) => Math.atan2(orx * Math.sin(a), ory * Math.cos(a)) * 180 / Math.PI;
  const rs = lerp(0.62, 0.34, lp);
  const rh = 700 * (t < tOrbit0 ? rs : 0.34);
  if (t < 11.9) { rx = 540; ry = 990 - rh / 2 + 14; }
  else if (t < tOrbit0) { rx = lerp(540, sunX + orx, ease); ry = lerp(990 - 700 * 0.62 / 2 + 14, SUNY, lp); on = true; }
  else { const a = -2 * Math.PI * smooth((t - tOrbit0) / (tOrbit1 - tOrbit0)); const [x, y] = orb(a); rx = x; ry = y; rot = orbRot(a); on = true; }
  // trail dots
  const trail = [];
  if (t > tOrbit0) for (let k = 1; k <= 22; k++) { const tt = t - k * 0.07; if (tt < tOrbit0) break; const a = -2 * Math.PI * smooth((tt - tOrbit0) / (tOrbit1 - tOrbit0)); const [x, y] = orb(a); trail.push(<div key={k} style={{position: 'absolute', left: x - 9 + 0, top: y - 9, width: 18, height: 18, borderRadius: '50%', background: '#fff', border: `3px solid ${INK}`, opacity: 1 - k / 24}} />); }
  const streakOp = clamp((t - 8.7) / 0.5) * (1 - clamp((t - 14.4) / 0.6));
  return (
    <>
      <Space t={t} speed={t > 8.5 ? 3 : 1} />
      <Sp s="sun" c x={sunX} y={SUNY} h={900} t={t} anim={(lt, tt) => ({rot: Math.sin(tt * 0.9) * 3, sc: 1 + Math.sin(tt * 2) * 0.015})} />
      {trail}
      {/* speed lines */}
      {streakOp > 0 && Array.from({length: 16}, (_, i) => { const L = 220 + rnd(i, 7) * 360; const sp = 1900 + rnd(i, 8) * 900; const x = W - ((((t * sp + rnd(i, 9) * 3000) % (W + L + 200))) - L); const y = 930 + rnd(i, 10) * 600;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: L, height: 9, borderRadius: 5, background: '#fff', opacity: 0.8 * streakOp}} />; })}
      <Sp s="earth" c x={540} y={1390} h={780} t={t} anim={(lt, tt) => ({rot: tt * 5})} />
      {/* rocket */}
      {on && (() => { const rr = rot * Math.PI / 180; return <Thrust x={rx - Math.sin(rr) * rh * 0.5} y={ry + Math.cos(rr) * rh * 0.5 - 6} w={t < tOrbit0 ? 120 : 110} t={t} rot={rot} />; })()}
      <Sp s="rocket" c x={rx} y={ry} h={rh} t={t} anim={() => ({rot})} />
      <Label x={330} y={985} text="30 km/s" size={96} t={t} t0={8.9} t1={14.4} sub={'SIDEWAYS'} color="#ffd400" />
      <Label x={760} y={190} text="MISSED" size={120} t={t} t0={14.7} t1={17.4} color="#ff3b30" rot={-6} />
    </>
  );
};

const ShotBrake: React.FC<{T: number}> = ({T}) => {
  const t = T;
  const a1 = clamp((t - 17.7) / 0.35);
  const col = t > 20.55;
  const a2x = lerp(1250, 790, eo((t - 19.55) / 0.9));
  const gone = t > 20.85;
  const cnt = clamp((t - 22.7) / 0.3);
  return (
    <>
      <DaySky t={t} />
      {!gone && a1 > 0 && <Arrow x={330 + (col ? -20 : 0)} y={430} w={560} dir={1} color="#ffb300" text="30 km/s" sc={a1 < 1 ? 1 - Math.pow(1 - a1, 3) * Math.cos(a1 * 9) * 0.9 : 1} />}
      {!gone && t > 19.55 && <Arrow x={a2x} y={430} w={520} dir={-1} color="#ff3b30" text="CANCEL" />}
      {t > 20.55 && t < 21.4 && <Sp s="smoke1" c x={560} y={430} h={320 * eo((t - 20.55) / 0.3) * (1 - clamp((t - 21.0) / 0.4))} t={t} />}
      <Ground />
      <Sp s="mr_worry" r={115} x={220} y={FEET} t={t} shadow poses={[[22.7, 'mr_cough'], [26.0, 'mr_shrug']]} anim={(lt, tt) => ({dy: Math.sin(tt * 2.2) * 3})} />
      {/* small Mars rocket vs the huge Sun rocket */}
      <Sp s="rocket" x={470} y={GROUND + 18} h={200} t={t} t0={22.05} enter="pop" shadow />
      <Label x={470} y={1160} text="MARS" size={64} t={t} t0={22.3} color="#ff9a3c" stroke={10} />
      <Sp s="rocket" x={830} y={GROUND + 18} h={760} t={t} t0={22.1} enter="pop" shadow anim={(lt, tt) => ({dx: t > 22.7 ? Math.sin(tt * 60) * 3 : 0})} />
      {t > 22.7 && <Thrust x={830} y={GROUND + 10} w={280} t={t} />}
      <Label x={830} y={575} text="SUN" size={104} t={t} t0={22.35} color="#ffd400" />
      <Label x={540} y={250} text="55x" size={210} t={t} t0={22.7} sub="MORE ENERGY" color="#ffd400" />
    </>
  );
};

const bagPile = (xs: number[], rows: {y: number; xs: number[]}[], tStart: number, step: number, h: number, t: number) => {
  const out = [];
  let i = 0;
  rows.forEach((r) => r.xs.forEach((x) => {
    const t0 = tStart + i * step;
    out.push({x, y: r.y, t0, rot: (rnd(i, 3) - 0.5) * 24, h: h * (0.92 + rnd(i, 4) * 0.16), i});
    i++;
  }));
  return out;
};

const ShotBags: React.FC<{T: number}> = ({T}) => {
  const t = T;
  const bags = bagPile([], [
    {y: 1432, xs: [600, 700, 800, 900]}, {y: 1292, xs: [650, 750, 850]}, {y: 1152, xs: [700, 800]}, {y: 1012, xs: [750]},
  ], 27.1, 0.3, 190, t);
  return (
    <>
      <DaySky t={t} />
      <Ground />
      <Sp s="mr_deadpan" r={115} x={210} y={FEET} t={t} shadow poses={[[30.0, 'mr_shrug']]} anim={(lt, tt) => ({dy: Math.sin(tt * 2.2) * 3})} />
      {bags.map((b) => <Sp key={b.i} s="bag" x={b.x} y={b.y} h={b.h} t={t} t0={b.t0} enter="drop" dropH={b.y - 520} anim={() => ({rot: b.rot})} />)}
      <Label x={540} y={300} text="2+ BILLION" size={150} t={t} t0={27.82} sub="TONNES OF TRASH A YEAR" color="#ffd400" />
    </>
  );
};

const ShotRockets: React.FC<{T: number}> = ({T}) => {
  const t = T;
  const rk = Array.from({length: 9}, (_, i) => { const k = Math.pow(0.78, i); return {x: 100 + 740 * k, y: 1300 + 115 * k, h: 760 * k, t0: 31.5 + i * 0.17, i}; });
  const cnt = clamp((t - 31.86) / 1.5);
  const val = Math.round(80000000 * eo(cnt));
  const bagsB = bagPile([], [
    {y: 1440, xs: [90, 180, 270, 360]}, {y: 1295, xs: [130, 225, 320]}, {y: 1150, xs: [90, 180, 270]}, {y: 1005, xs: [140, 230]},
  ], 34.32, 0.11, 210, t);
  return (
    <>
      <DaySky t={t} />
      <Ground />
      {rk.map((r) => <Sp key={r.i} s="rocket" x={r.x} y={r.y} h={r.h} t={t} t0={r.t0} enter="pop" shadow />)}
      <Sp s="mr_shrug" r={115} x={210} y={FEET} t={t} t1={36.0} shadow anim={(lt, tt) => ({dy: Math.sin(tt * 2.2) * 3})} />
      {bagsB.map((b) => <Sp key={b.i} s="bag" x={b.x} y={b.y} h={b.h} t={t} t0={b.t0} enter="drop" dropH={b.y - 520} anim={() => ({rot: b.rot})} />)}
      <Label x={540} y={270} text={val.toLocaleString('en-US')} size={150} t={t} t0={31.6} sub="ROCKETS A YEAR" color="#ffd400" />
    </>
  );
};

const ShotBin: React.FC<{T: number}> = ({T}) => {
  const t = T;
  const TH = 37.5, LAND = 38.1;
  const u = clamp((t - TH) / (LAND - TH));
  const X0 = 260 + 403, Y0 = FEET - 520;
  const bx = lerp(X0, 868, u), by = lerp(Y0, 1010, u) - Math.sin(u * Math.PI) * 170;
  const landed = t >= LAND;
  const bump = landed ? Math.exp(-(t - LAND) * 7) * Math.cos((t - LAND) * 24) * 0.12 : 0;
  const glow = landed ? clamp(1 - (t - LAND) / 0.9) : 0;
  return (
    <>
      <DaySky t={t} />
      <Ground />
      <Sp s="bin" x={868} y={GROUND + 18} h={480} t={t} shadow anim={() => ({sx: 1 - bump, sy: 1 + bump})} />
      {glow > 0 && [0, 1, 2, 3, 4].map((i) => { const a = i * 1.26 + 0.4; const rr = 90 + (1 - glow) * 140; return <div key={i} style={{position: 'absolute', left: 868 + Math.cos(a) * rr * 1.2 - 14, top: 1010 - 150 + Math.sin(a) * rr - 14, width: 28, height: 28, background: '#fff', border: `4px solid ${INK}`, transform: 'rotate(45deg)', opacity: glow}} />; })}
      <Sp s="hold" r={115} x={260} y={FEET} t={t} shadow poses={[[TH, 'throw'], [LAND + 0.15, 'mr_cheer']]} anim={(lt, tt) => ({dy: Math.sin(tt * 2.2) * 3})} />
      {t >= TH && t < LAND && <Sp s="bag" c x={bx} y={by} h={150} t={t} anim={(lt, tt) => ({rot: tt * 500})} />}
    </>
  );
};

const SHOTS = [ShotHook, ShotLaunch, ShotSpace, ShotBrake, ShotBags, ShotRockets, ShotBin];
// camera shakes [time, amplitude]
const SHAKES: [number, number][] = [[3.38, 0], [5.2, 10], [7.55, 22], [14.6, 14], [20.55, 24], [22.7, 14], [35.45, 26], [38.1, 12]];
const ZOOMS = [[1, 1], [1.0, 1.05], [1.0, 1.04], [1.0, 1.05], [1.0, 1.04], [1.0, 1.05], [1.0, 1.06]];

// ---------------- captions ----------------
const Captions: React.FC<{t: number}> = ({t}) => {
  const c: any = (tl.caps as any[]).find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  const txt = c.words.map((w: any) => w.text).join(' ');
  const fs = txt.length > 20 ? 96 : 108;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: t < 4.0 ? 1100 : 170}}>
      <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 920, fontFamily: IMPACT, fontSize: fs, letterSpacing: 2, lineHeight: 1.05}}>
        {c.words.map((w: any, i: number) => (
          <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `13px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{i: number; T: number}> = ({i, T}) => {
  const C = SHOTS[i];
  const [z0, z1] = ZOOMS[i];
  const st = SHOT_START[i], en = i + 1 < SHOT_START.length ? SHOT_START[i + 1] : tl.total;
  const z = i === 0 ? 1 : lerp(z0, z1, clamp((T - st) / (en - st)));
  let sh = 0;
  SHAKES.forEach(([ts, a]) => { const d = T - ts; if (d >= 0 && d < 0.6) sh += Math.exp(-d * 7) * a; });
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 72%', transform: `translate(${i === 0 ? 0 : Math.sin(T * 80) * sh}px,${i === 0 ? 0 : Math.cos(T * 67) * sh}px) scale(${z})`}}>
        <C T={T} />
      </div>
    </AbsoluteFill>
  );
};

export const SunShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const loopU = clamp((T - (tl.total - 0.5)) / 0.5);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOT_START.map((st, i) => {
        const en = i + 1 < SHOT_START.length ? SHOT_START[i + 1] : tl.total + 1;
        if (T < st - TR || T > en + 0.05) return null;
        const slideU = i === 0 ? 1 : eo((T - (st - TR)) / TR);
        return (
          <AbsoluteFill key={i} style={{clipPath: slideU < 1 ? `inset(0px 0px 0px ${Math.round((1 - slideU) * W)}px)` : 'none'}}>
            <Shot i={i} T={T} />
          </AbsoluteFill>
        );
      })}
      {loopU > 0 && <AbsoluteFill style={{opacity: loopU}}><ShotHook T={0} /></AbsoluteFill>}
      <Captions t={T} />
    </AbsoluteFill>
  );
};
