// @ts-nocheck
// Medieval privacy Short v2 (9:16, 1080x1920): cut-out animation, standalone story, 12 lines. Timing from mp2Timeline.json (real Grady voice).
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import tl from './mp2Timeline.json';
import meta from './mp2Meta.json';

export const TOTAL2 = tl.total;
const W = 1080, H = 1920;
const INK = '#141414';
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const ei = (x: number) => Easing.in(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const rnd = (i: number, k = 1) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
const T = tl.segs;
const Wd = (s: number, i: number, o = 0) => T[s - 1].words[i].start + o;
const S0 = (s: number) => T[s - 1].start;
const S1 = (s: number) => T[s - 1].end;
const IMPACT = 'Impact, "Arial Black", sans-serif';

// shots: [start, end, camera z0, z1, focus y, shakes[[t, amp]]]
const SHOT_T = [0, ...Array.from({length: 11}, (_, i) => S0(i + 2) - 0.04), TOTAL2];
const CAMS = [
  {z0: 1.0, z1: 1.1, fy: 1000, sh: []},
  {z0: 1.0, z1: 1.14, fy: 900, sh: [[Wd(2, 2), 10]]},
  {z0: 1.0, z1: 1.06, fy: 1000, sh: [[Wd(3, 0), 16]]},
  {z0: 1.04, z1: 1.0, fy: 1000, sh: [[10.0, 14], [Wd(4, 7), 8]]},
  {z0: 1.0, z1: 1.12, fy: 1000, sh: [[Wd(5, 0), 16]]},
  {z0: 1.06, z1: 1.3, fy: 1020, sh: [[Wd(6, 4) - 0.05, 24]]},
  {z0: 1.0, z1: 1.08, fy: 1000, sh: [[Wd(7, 0), 16], [Wd(7, 6), 18]]},
  {z0: 1.0, z1: 1.06, fy: 1000, sh: [[Wd(8, 2), 8], [Wd(8, 6) + 0.2, 14], [S1(8) + 0.0, 26]]},
  {z0: 1.0, z1: 1.08, fy: 1000, sh: [[Wd(9, 0), 16], [Wd(9, 5) + 0.05, 16]]},
  {z0: 1.0, z1: 1.12, fy: 1000, sh: [[Wd(10, 0) + 0.15, 12]]},
  {z0: 1.0, z1: 1.1, fy: 1000, sh: [[Wd(11, 11) + 0.1, 16]]},
  {z0: 1.0, z1: 1.3, fy: 1000, sh: []},
];

// ---------------- sprites ----------------
const Sp: React.FC<any> = ({s, x, y, h, t, t0 = 0, t1 = 1e9, flip, enter, anim, glow, noShadow, fadeOut}) => {
  if (t < t0 || t > t1) return null;
  const m = meta[s];
  const sc = h / m.h, w = m.w * sc, fx = m.feet[0] * sc;
  const lt = t - t0;
  let es = 1, ex = 0, ey = 0, op = 1, sx = 1, sy = 1;
  if (enter === 'pop') { const u = clamp(lt / 0.35); es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9; }
  else if (enter === 'left') ex = -(1 - eo(lt / 0.6)) * (x + w + 100);
  else if (enter === 'right') ex = (1 - eo(lt / 0.6)) * (W - x + w + 100);
  else if (enter === 'drop') { ey = -(1 - eo(lt / 0.45)) * 1000; if (lt > 0.45) { const q = lt - 0.45; const k = Math.exp(-q * 9) * Math.cos(q * 24); sx = 1 + 0.18 * k; sy = 1 - 0.18 * k; } }
  else if (enter === 'squash') { const k = Math.exp(-lt * 8) * Math.cos(lt * 22); sx = 1 + 0.22 * k; sy = 1 - 0.22 * k; }
  if (fadeOut && t1 < 1e8) op = clamp((t1 - t) / fadeOut);
  const a = anim ? anim(lt, t) : {};
  const px = x + ex + (a.dx || 0), py = y + ey + (a.dy || 0);
  const gl = glow ? (0.8 + Math.sin(t * 11 + x) * 0.12 + Math.sin(t * 7.3) * 0.08) : 0;
  return (
    <>
      {!noShadow && es > 0.3 && <div style={{position: 'absolute', left: px - w * 0.3, top: y - 14 + (a.dy && a.dy < 0 ? 0 : 0), width: w * 0.6, height: 28, borderRadius: '50%', background: 'rgba(15,10,6,0.35)', opacity: op}} />}
      <div style={{position: 'absolute', left: px - fx, top: py - h, width: w, height: h, opacity: op, transformOrigin: `${fx}px ${h}px`, transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${a.rot || 0}deg) scale(${sx * es * (a.sx || 1)},${sy * es * (a.sy || 1)})`}}>
        <Img src={staticFile(`mp2/${s}.png`)} style={{width: '100%', height: '100%'}} />
        {glow && <div style={{position: 'absolute', left: glow[0] * w - glow[2], top: glow[1] * h - glow[2], width: glow[2] * 2, height: glow[2] * 2, borderRadius: '50%', background: 'radial-gradient(rgba(255,170,60,0.85), rgba(255,140,40,0) 70%)', opacity: gl}} />}
      </div>
    </>
  );
};

const Dust: React.FC<any> = ({x, y, t, t0, n = 8, spread = 130}) => {
  const lt = t - t0;
  if (lt < 0 || lt > 1.0) return null;
  return <>{Array.from({length: n}, (_, i) => <div key={i} style={{position: 'absolute', left: x + (rnd(i, 3) - 0.5) * spread + lt * (rnd(i, 4) - 0.5) * 220, top: y - 20 - lt * (80 + rnd(i, 5) * 160) + lt * lt * 260, width: 18, height: 12, borderRadius: 4, background: '#c9a063', border: `3px solid ${INK}`, opacity: 1 - lt, transform: `rotate(${lt * 400 * (rnd(i, 6) - 0.5)}deg)`}} />)}</>;
};

const Pop: React.FC<any> = ({t, t0, children, dur = 0.3}) => {
  const lt = t - t0; if (lt < 0) return null;
  const u = clamp(lt / dur); const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return <div style={{transform: `scale(${es})`}}>{children}</div>;
};

const Txt: React.FC<any> = ({children, size = 120, color = '#fff', stroke = 14, style}) => (
  <span style={{fontFamily: IMPACT, fontSize: size, color, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: 'stroke fill', letterSpacing: 2, whiteSpace: 'nowrap', ...style}}>{children}</span>
);

// ---------------- backgrounds ----------------
const Room: React.FC<any> = ({t, dim}) => {
  const flick = 0.5 + Math.sin(t * 9) * 0.04 + Math.sin(t * 5.3) * 0.04;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1300, background: dim ? 'linear-gradient(#4d3a2c,#3b2b21)' : 'linear-gradient(#8a6140,#6a4a33)'}} />
      {Array.from({length: 8}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 150 + 6, top: 0, width: 5, height: 1300, background: 'rgba(40,24,12,0.28)'}} />)}
      <div style={{position: 'absolute', left: 0, top: 1300, width: W, height: 700, background: dim ? '#2c2018' : '#4a3424'}} />
      <div style={{position: 'absolute', left: 0, top: 1296, width: W, height: 8, background: INK}} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        <rect x={760} y={300} width={230} height={260} fill="#3f5675" stroke={INK} strokeWidth={9} />
        <path d="M875,300 V560 M760,430 H990" stroke={INK} strokeWidth={8} />
        <rect x={766} y={306} width={104} height={118} fill="#6a86a8" opacity={0.55} />
        <path d="M60,420 q50,-60 100,0 v140 h-100 z" fill="#5a3b26" stroke={INK} strokeWidth={7} />
      </svg>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: `radial-gradient(ellipse 800px 700px at 120px 1200px, rgba(255,150,60,${flick}), rgba(255,150,60,0) 70%)`}} />
    </>
  );
};

const scrollPos = (t: number) => {
  const a = 6.83, b = 10.0, v = 420;
  if (t < a) return 0; if (t < b) return v * (t - a);
  const d = 0.3, q = clamp((t - b) / d); return v * (b - a) + v * d * (q - q * q / 2);
};
const Night: React.FC<any> = ({t}) => {
  const sc = scrollPos(t);
  const tufts = Array.from({length: 22}, (_, i) => {
    const row = i % 3, sp = 1 + row * 0.35;
    const x = (((i * 137) % 1500) - sc * sp + 3000 * 3) % 1500 - 200;
    const y = 1090 + row * 120 + (i % 5) * 18, hh = 40 + row * 22;
    return <path key={i} d={`M${x},${y} l-14,${-hh} M${x},${y} l2,${-hh - 14} M${x},${y} l16,${-hh}`} stroke="#2f4425" strokeWidth={8} strokeLinecap="round" fill="none" />;
  });
  const hills = [0, 1].map((k) => {
    const off = -((sc * 0.25) % 1200) + k * 1200;
    return <path key={k} d={`M${off},1060 L${off},880 Q${off + 300},780 ${off + 600},860 T${off + 1200},870 L${off + 1200},1060 Z`} fill="#3d5a52" stroke={INK} strokeWidth={6} />;
  });
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1100, background: 'linear-gradient(#1b2d48,#4a6a8c)'}} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        <circle cx={800} cy={330} r={95} fill="#efe6c6" stroke={INK} strokeWidth={7} />
        {Array.from({length: 14}, (_, i) => <circle key={i} cx={rnd(i, 1) * W} cy={60 + rnd(i, 2) * 520} r={3 + rnd(i, 3) * 3} fill="#fff" opacity={0.5 + 0.4 * Math.sin(t * 3 + i)} />)}
        {hills}
      </svg>
      <div style={{position: 'absolute', left: 0, top: 1050, width: W, height: 150, background: '#55703f'}} />
      <div style={{position: 'absolute', left: 0, top: 1200, width: W, height: 800, background: '#445a33'}} />
      <div style={{position: 'absolute', left: 0, top: 1046, width: W, height: 8, background: INK}} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>{tufts}</svg>
    </>
  );
};

const Hall: React.FC<any> = () => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1300, background: 'linear-gradient(#69707e,#4d5462)'}} />
    {Array.from({length: 13}, (_, r) => Array.from({length: 7}, (_, c) => <div key={r + '_' + c} style={{position: 'absolute', left: c * 180 - (r % 2) * 90, top: r * 100, width: 180, height: 100, border: '3px solid rgba(20,20,30,0.35)', boxSizing: 'border-box'}} />))}
    <div style={{position: 'absolute', left: 0, top: 1300, width: W, height: 700, background: '#403830'}} />
    <div style={{position: 'absolute', left: 0, top: 1296, width: W, height: 8, background: INK}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse 800px 700px at 700px 800px, rgba(255,190,100,0.3), rgba(255,190,100,0) 70%)'}} />
  </>
);

const Stairs: React.FC<any> = () => (
  <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
    {Array.from({length: 9}, (_, i) => {
      const x = 60 + i * 100, y = 1590 - i * 62;
      return <path key={i} d={`M${x},${y} h100 v${1750 - y} h-100 z`} fill={i % 2 ? '#6b6258' : '#7a7066'} stroke={INK} strokeWidth={6} />;
    })}
    <path d="M960,1032 H1100 V1750 H960 z" fill="#7a7066" stroke={INK} strokeWidth={6} />
    <path d="M60,1590 L960,1032" stroke={INK} strokeWidth={4} opacity={0.0} />
  </svg>
);

const DoorLeft: React.FC<any> = ({t, tClose}) => {
  const u = t < tClose ? 0.04 : 0.04 + 0.96 * ei((t - tClose) / 0.14);
  const x = 30, y = 640, w = 330, h = 660;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#14213a', border: `9px solid ${INK}`, borderRadius: '150px 150px 0 0', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 90, top: 80, width: 70, height: 70, borderRadius: '50%', background: '#efe6c6'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: w * u, height: h, background: '#8a5a34', borderRight: `8px solid ${INK}`, transformOrigin: 'left'}}>
        {u > 0.5 && <div style={{position: 'absolute', right: 26, top: h * 0.55, width: 26, height: 26, borderRadius: '50%', background: '#d9a441', border: `5px solid ${INK}`}} />}
      </div>
    </div>
  );
};

// box bed: open: 0 closed .. 1 wide open. door hinged left
const BoxBed: React.FC<any> = ({cx, base, bw = 640, bh = 560, open, glow = 1, roof = 0, t, part = 'all'}) => {
  const x = cx - bw / 2, y = base - bh;
  const dw = bw * 0.92;
  const flick = 0.85 + Math.sin(t * 12) * 0.08 + Math.sin(t * 7) * 0.05;
  const doorScale = lerp(1, 0.18, open);
  const seam = Math.max(6, bw * 0.92 * (1 - doorScale));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: bw, height: bh}}>
      {part !== 'door' && roof > 0 && (
        <svg style={{position: 'absolute', left: -60, top: -230, overflow: 'visible', transform: `scale(${roof})`, transformOrigin: `${bw / 2 + 60}px 230px`}} width={bw + 120} height={240}>
          <path d={`M0,230 L${(bw + 120) / 2},10 L${bw + 120},230 Z`} fill="#a4422e" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <rect x={bw * 0.78} y={40} width={50} height={90} fill="#7a7066" stroke={INK} strokeWidth={8} />
        </svg>
      )}
      {part !== 'door' && <div style={{position: 'absolute', left: 0, top: 0, width: bw, height: bh, background: '#6b4426', border: `10px solid ${INK}`, borderRadius: 18, boxSizing: 'border-box', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 18, top: 18, width: bw - 56, height: bh - 56, background: `radial-gradient(ellipse at 50% 70%, rgba(255,${150 + 30 * flick | 0},60,${glow}), rgba(190,80,20,${glow}) 80%)`, border: `6px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 18 + 6, top: bh - 56 - 40, width: bw - 56 - 12, height: 60, background: '#a4422e', border: `6px solid ${INK}`, borderRadius: 14}} />
        <div style={{position: 'absolute', left: bw * 0.04, top: bh * 0.08, width: 120, height: 70, background: '#e9dcc0', border: `6px solid ${INK}`, borderRadius: 30}} />
      </div>}
      {part !== 'back' && <div style={{position: 'absolute', left: bw * 0.04 + 6, top: 18, width: dw * doorScale, height: bh - 36, background: 'linear-gradient(90deg,#8a5a34,#9a6a3e)', border: `8px solid ${INK}`, boxSizing: 'border-box', transformOrigin: 'left'}}>
        <div style={{position: 'absolute', right: 20, top: '50%', width: 30, height: 30, borderRadius: '50%', background: '#d9a441', border: `5px solid ${INK}`}} />
        {Array.from({length: 3}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 120 + i * 140, height: 5, background: 'rgba(40,20,8,0.35)'}} />)}
      </div>}
    </div>
  );
};

const hopAt = (tt: number, ts: number[]) => ts.reduce((a, q) => (tt >= q && tt < q + 0.4 ? Math.max(a, Math.sin((tt - q) / 0.4 * Math.PI) * 60) : a), 0);
// ---------------- shots ----------------
const FEET_R = 1290;
const fam = (t: number) => (
  <>
    <Sp s="father" x={640} y={1170} h={610} t={t} t0={-0.22} enter="pop" anim={(lt: number) => ({rot: Math.sin(lt * 3) * 1})} />
    <Sp s="mother" x={800} y={1170} h={590} t={t} t0={-0.14} enter="pop" anim={(lt: number) => ({rot: Math.sin(lt * 3.3) * 1})} />
    <Sp s="gran" x={970} y={1170} h={570} t={t} t0={-0.08} enter="pop" anim={(lt: number) => ({rot: Math.sin(lt * 2.5) * 1.2})} />
    <Sp s="m_finger" x={230} y={FEET_R} h={700} t={t} t0={-0.3} enter="pop" anim={(lt: number) => ({rot: Math.sin(lt * 3) * 1.2})} />
    <Sp s="w_brow" x={480} y={FEET_R} h={690} t={t} t0={-0.26} enter="pop" anim={(lt: number) => ({rot: Math.sin(lt * 3.4 + 1) * 1.2})} />
    <Sp s="brothers" x={830} y={FEET_R + 10} h={340} t={t} t0={0.0} enter="pop" anim={(lt: number) => ({dy: -Math.abs(Math.sin(lt * 4)) * 6})} />
  </>
);
// head tops for the 1..8 counter (x, y)
const HEADS = [[250, 690], [490, 700], [640, 630], [800, 660], [970, 690], [690, 1080], [820, 1030], [945, 1000]];

const Shot: React.FC<any> = ({i, t}) => {
  const lt = t - SHOT_T[i - 1];
  switch (i) {
    case 1:
      return (<>
        <Room t={t} />
        {fam(t)}
        {HEADS.map(([hx, hy], k) => { const tk = Wd(1, 5) + 0.12 * k; return t >= tk && t < tk + 1.3 ? <div key={k} style={{position: 'absolute', left: hx - 42, top: hy - 100 - Math.min(1, (t - tk) * 8) * 0}}><Pop t={t} t0={tk} dur={0.25}><div style={{width: 84, height: 84, borderRadius: '50%', background: '#ffd400', border: `7px solid ${INK}`, textAlign: 'center', lineHeight: '76px'}}><Txt size={58} color={INK} stroke={0}>{k + 1}</Txt></div></Pop></div> : null; })}
      </>);
    case 2:
      return (<>
        <Room t={t} />
        <Sp s="m_five" x={300} y={FEET_R} h={820} t={t} t0={S0(2) - 0.1} enter="pop" anim={(lt: number, tt: number) => ({rot: tt > Wd(2, 2) ? Math.sin((tt - Wd(2, 2)) * 22) * 3 * Math.exp(-(tt - Wd(2, 2)) * 1.5) : 0})} />
        <Sp s="w_brow" x={800} y={FEET_R} h={780} t={t} t0={Wd(2, 4)} enter="pop" anim={(lt: number, tt: number) => ({rot: Math.sin(tt * 3) * 1.5, dy: -Math.max(0, Math.sin((tt - Wd(2, 7)) * 14)) * (tt > Wd(2, 7) && tt < Wd(2, 7) + 0.22 ? 40 : 0)})} />
      </>);
    case 3:
      return (<>
        <Night t={t} />
        <Sp s="couple_run" x={470} y={1290} h={680} t={t} t0={Wd(3, 1) + 0.2} t1={10.0} enter="left" noShadow anim={(lt: number, tt: number) => ({dy: -Math.abs(Math.sin(tt * 13)) * 38, rot: Math.sin(tt * 13) * 2.5, sx: 1 + Math.sin(tt * 26) * 0.012})} />
      </>);
    case 4: {
      const BUSH = [[600, 1000, 230, 1], [830, 1000, 240, 0], [1010, 1005, 230, 1], [700, 1150, 300, 0], [960, 1165, 300, 1], [560, 1180, 220, 0]];
      return (<>
        <Night t={t} />
        <Sp s="couple_run" x={470} y={1290} h={680} t={t} t0={S0(4) - 0.04} t1={10.0} noShadow anim={(lt: number, tt: number) => ({dy: -Math.abs(Math.sin(tt * 13)) * 38, rot: Math.sin(tt * 13) * 2.5})} />
        <Sp s="couple_cold" x={270} y={1290} h={640} t={t} t0={10.0} enter="squash" anim={(lt: number, tt: number) => ({dx: Math.sin(tt * 50) * 4, rot: Math.sin(tt * 40) * 1})} />
        {t >= 10.1 && <div style={{position: 'absolute', left: 330, top: 560, transform: `scale(${Math.min(1, (t - 10.1) * 6)}) rotate(-8deg)`}}><Txt size={190} color="#e03b2e" stroke={16}>!</Txt></div>}
        {BUSH.map(([bx, by, bh, fl], k) => <Sp key={k} s="couple_bush" x={bx} y={by} h={bh} t={t} t0={Wd(4, 1) + k * 0.26} enter="pop" flip={!!fl} glow={[0.12, 0.56, 70]} anim={(lt: number, tt: number) => ({rot: Math.sin(tt * 3 + k) * 1.5})} />)}
      </>);
    }
    case 5: {
      const zs = Array.from({length: 5}, (_, k) => { const tk = Wd(5, 2) + 0.35 + k * 0.42, q = (t - tk) / 1.6; return q >= 0 && q < 1 ? <div key={k} style={{position: 'absolute', left: 520 + k * 22 + Math.sin(q * 6 + k) * 20, top: 940 - q * 360, opacity: Math.sin(q * Math.PI), transform: `scale(${0.6 + q * 0.8}) rotate(${-10 + k * 6}deg)`}}><Txt size={110} color="#cfe3ff" stroke={12}>Z</Txt></div> : null; });
      return (<>
        <ImgBg t={t} /><GranPatch t={t} />
        <Sp s="m_finger" x={230} y={1420} h={620} t={t} t0={S0(5) + 0.5} enter="pop" anim={(lt: number, tt: number) => ({rot: Math.sin(tt * 2.5) * 1.5})} />
        <Sp s="w_hush" x={850} y={1420} h={650} t={t} t0={S0(5) + 0.8} enter="pop" anim={(lt: number, tt: number) => ({rot: Math.sin(tt * 2.8) * 1.5})} />
        {zs}
      </>);
    }
    case 6: {
      const tr = Wd(6, 4) - 0.05;
      const look = t >= tr - 0.15;
      return (<>
        <ImgBg t={t} /><GranPatch t={t} />
        <Sp s="m_finger" x={230} y={1420} h={620} t={t} flip={look} anim={(lt: number, tt: number) => ({rot: Math.sin(tt * 2.5) * 1.5, sy: look ? 1 + 0.07 * Math.exp(-(tt - tr + 0.15) * 8) * Math.cos((tt - tr) * 30) : 1})} />
        <Sp s="w_hush" x={850} y={1420} h={650} t={t} flip={look} anim={(lt: number, tt: number) => ({rot: Math.sin(tt * 2.8) * 1.5})} />
        {t >= tr && t < tr + 0.5 && <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: `rgba(255,240,200,${0.35 * (1 - (t - tr) / 0.5)})`}} />}
      </>);
    }
    case 7: {
      const a = Wd(7, 1) + 0.3, b = Wd(7, 6) - 0.05;
      const u = clamp((t - a) / (b - a)); const e = eio(u);
      const mx = lerp(210, 640, e), my = lerp(1520, 1190, e);
      const hop = (tt: number) => (u > 0 && u < 1 ? -Math.abs(Math.sin(tt * 9)) * 22 : 0);
      return (<>
        <Hall /><Stairs />
        <Sp s="w_brow" x={mx - 150} y={my + 90} h={560 - 90 * e} t={t} noShadow anim={(lt: number, tt: number) => ({dy: hop(tt + 0.3), rot: Math.sin(tt * 9) * 2})} />
        <Sp s="m_point" x={mx} y={my} h={600 - 100 * e} t={t} noShadow anim={(lt: number, tt: number) => ({dy: hop(tt), rot: Math.sin(tt * 9) * 2.5})} />
        <Sp s="steward" x={860} y={1040} h={820} t={t} t0={Wd(7, 6) - 0.05} enter="drop" anim={(lt: number, tt: number) => ({rot: Math.sin(tt * 6) * 1.2})} />
        {t >= b + 0.1 && <div style={{position: 'absolute', left: 560, top: 780, transform: `scale(${Math.min(1, (t - b - 0.1) * 6)}) rotate(-8deg)`}}><Txt size={190} color="#e03b2e" stroke={16}>!</Txt></div>}
      </>);
    }
    case 8: {
      const tg = Wd(8, 2) , tc = Wd(8, 6) - 0.02;
      const lunge = t > tg ? eo((t - tg) / 0.25) : 0;
      return (<>
        <Hall /><DoorLeft t={t} tClose={S1(8) - 0.18} />
        <Sp s="m_point" x={300} y={FEET_R} h={720} t={t} t0={S0(8) - 0.04} t1={tc} enter="pop" anim={(lt: number, tt: number) => ({dx: tt > tg ? Math.sin(tt * 60) * 5 : 0, rot: tt > tg ? Math.sin(tt * 40) * 3 : 0})} />
        <Sp s="w_brow" x={540} y={FEET_R} h={700} t={t} t0={S0(8) - 0.02} t1={tc} enter="pop" anim={(lt: number, tt: number) => ({dx: tt > tg ? Math.sin(tt * 55) * 4 : 0})} />
        <Sp s="steward" x={960 - lunge * 130} y={FEET_R} h={900} t={t} t0={S0(8) - 0.1} enter="pop" anim={(lt: number, tt: number) => ({sx: 1 + lunge * 0.06, sy: 1 + lunge * 0.06})} />
        <Sp s="tossed" x={lerp(420, -300, eo((t - tc) / 0.55))} y={lerp(1200, 1000, 0) - Math.sin(clamp((t - tc) / 0.55) * Math.PI) * 260} h={400} t={t} t0={tc} noShadow anim={(lt: number) => ({rot: -lt * 1000})} />
        <Dust x={150} y={1290} t={t} t0={S1(8) - 0.04} />
      </>);
    }
    case 9: {
      const tsnap = Wd(9, 5) + 0.05;
      const sawing = t > Wd(9, 1) + 0.3 && t < tsnap;
      const snapped = t >= tsnap;
      const k = Math.max(0, t - tsnap);
      const plank = (rot: number, dx: number, dy: number, left: boolean) => (
        <div style={{position: 'absolute', left: 580 + dx + (left ? 0 : 200), top: 960 + dy, width: 200, height: 70, background: '#b98a54', border: `7px solid ${INK}`, boxSizing: 'border-box', transform: `rotate(${rot}deg)`, transformOrigin: left ? 'right center' : 'left center'}}>
          <div style={{position: 'absolute', left: 14, right: 14, top: 22, height: 4, background: 'rgba(80,45,15,0.4)'}} />
        </div>);
      return (<>
        <Room t={t} />
        <Sp s="m_saw" x={540} y={FEET_R} h={640} t={t} t0={Wd(9, 1) - 0.1} enter="pop" anim={(lt: number, tt: number) => ({dx: sawing ? Math.sin(tt * 18) * 26 : 0, rot: sawing ? Math.sin(tt * 18) * 3 : 0})} />
        <Sp s="w_brow" x={960} y={FEET_R} h={820} t={t} t0={Wd(9, 2) - 0.1} enter="pop" anim={(lt: number, tt: number) => ({rot: Math.sin(tt * 3) * 2 + (snapped ? Math.sin(k * 14) * 5 : 0), dy: snapped ? -Math.abs(Math.sin(k * 10)) * 20 * Math.exp(-k * 2) : 0})} />
        {t >= Wd(9, 2) && !snapped && plank(sawing ? Math.sin(t * 18) * 0.8 : 0, 0, 0, true)}
        {t >= Wd(9, 2) && !snapped && plank(0, 0, 0, false)}
        {snapped && plank(-70 * eo(k / 0.6), -30 * k, 400 * k * k, true)}
        {snapped && plank(80 * eo(k / 0.6), 50 * k, 500 * k * k, false)}
        {sawing && <Dust x={690} y={1050} t={t} t0={Math.floor(t * 5) / 5} n={5} spread={50} />}
        <Dust x={680} y={1020} t={t} t0={tsnap} n={14} spread={200} />
      </>);
    }
    case 10: {
      const t0 = S0(10) + 0.1;
      const bu = clamp((t - t0) / 0.5);
      const openAmt = t < Wd(10, 10) - 0.2 ? 0.45 + 0.12 * Math.sin(t * 2.2) : 1;
      const sc = bu >= 1 ? 1 : 1 - Math.pow(1 - bu, 3) * Math.cos(bu * 9) * 0.9;
      const wallPulse = t >= Wd(10, 7) && t < Wd(10, 7) + 0.6 ? 1 - (t - Wd(10, 7)) / 0.6 : 0;
      const tr = Wd(10, 12);
      const ru = clamp((t - tr) / 0.4), rs = ru >= 1 ? 1 : 1 - Math.pow(1 - ru, 3) * Math.cos(ru * 9) * 0.9;
      return (<>
        <Room t={t} />
        {t >= t0 && <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `translateY(${(1 - sc) * -0}px) scale(${1}) `, transformOrigin: '540px 1200px'}}>
          <div style={{transform: `scale(${sc * (1 + (t > Wd(10, 12) ? 0.015 * Math.sin((t - Wd(10, 12)) * 7) : 0))}) rotate(${t > Wd(10, 12) ? Math.sin((t - Wd(10, 12)) * 6) * 0.8 : 0}deg)`, transformOrigin: '540px 1250px', filter: wallPulse > 0 ? `drop-shadow(0 0 ${40 * wallPulse}px #ffd400)` : 'none'}}>
            <BoxBed cx={540} base={1180} bw={720} bh={600} open={Math.min(1, openAmt)} roof={t >= tr ? rs : 0} t={t} />
          </div>
        </div>}
        <Sp s="m_point" x={190} y={1340} h={700} t={t} t0={S0(10) + 0.3} enter="pop" anim={(lt: number, tt: number) => ({dy: -hopAt(tt, [Wd(10, 3), Wd(10, 7), Wd(10, 10), Wd(10, 12), Wd(10, 14), Wd(10, 16)])})} />
        <Sp s="w_brow" x={900} y={1340} h={690} t={t} t0={S0(10) + 0.5} enter="pop" flip anim={(lt: number, tt: number) => ({dy: -hopAt(tt, [Wd(10, 3) + 0.05, Wd(10, 7) + 0.05, Wd(10, 10) + 0.05, Wd(10, 12) + 0.05, Wd(10, 14) + 0.05, Wd(10, 16) + 0.05])})} />
        {t >= tr && Array.from({length: 6}, (_, k) => <div key={k} style={{position: 'absolute', left: 300 + k * 90, top: 470 - Math.sin(clamp((t - tr) * 1.5 + k * 0.1) * Math.PI) * 60, opacity: clamp(1 - (t - tr - 0.4) / 0.6)}}><Txt size={60} color="#ffd400" stroke={8}>*</Txt></div>)}
      </>);
    }
    case 11: {
      const tm = Wd(11, 1), tw = Wd(11, 4) - 0.1, tdoor = Wd(11, 8);
      const open = t < tdoor ? 1 : 1 - eio((t - tdoor) / 0.7);
      const arc = (t0: number, fromX: number, toX: number, toY: number, tt: number) => { const u = clamp((tt - t0) / 0.55); return {dx: lerp(fromX, toX, eo(u)), dy: -Math.sin(u * Math.PI) * 260 + lerp(0, 0, u)}; };
      const BX = 540, BASE = 1260, BW = 760, BH = 640;
      const inBox = (name: string, t0: number, h: number, fx: number, tx: number) => {
        const u = clamp((t - t0) / 0.6);
        const x = lerp(fx, tx, eo(u)), y = BASE - 40 - Math.sin(u * Math.PI) * 300 + (u >= 1 ? 0 : 0);
        return <Sp s={name} x={x} y={y + 0} h={h} t={t} t0={t0 - 0.3} noShadow enter="pop" anim={(lt: number, tt: number) => ({rot: u < 1 ? Math.sin(tt * 14) * 6 : (name === 'w_brow' && tt > Wd(11, 5) ? Math.sin(tt * 24) * 3 : 0), sy: u >= 1 ? 1 + Math.sin(tt * 3) * 0.01 : 1})} />;
      };
      return (<>
        <Room t={t} />
        <BoxBed cx={BX} base={BASE} bw={BW} bh={BH} open={open} t={t} glow={1} part="back" />
        {inBox('m_finger', tm, 520, 120, BX - 130)}
        {inBox('w_brow', tw, 500, 1000, BX + 120)}
        <div style={{position: 'absolute', left: BX - BW / 2, top: BASE - 120, width: BW, height: 120, background: '#6b4426', border: `10px solid ${INK}`, borderRadius: 12, boxSizing: 'border-box'}} />
        <BoxBed cx={BX} base={BASE} bw={BW} bh={BH} open={open} t={t} glow={1} part="door" />
        {t >= tdoor + 0.7 && t < tdoor + 1.3 && <Dust x={BX} y={BASE} t={t} t0={tdoor + 0.7} n={8} spread={500} />}
      </>);
    }
    default: {
      const z = 1;
      return (<>
        <ImgBg t={t} door />
        {Array.from({length: 18}, (_, k) => { const q = ((t * 0.12 + rnd(k, 1)) % 1); return <div key={k} style={{position: 'absolute', left: 120 + rnd(k, 2) * 840 + Math.sin(t + k) * 20, top: 1500 - q * 1000, width: 8, height: 8, borderRadius: '50%', background: '#ffcf7a', opacity: Math.sin(q * Math.PI) * 0.7}} />; })}
      </>);
    }
  }
};

const ImgBg: React.FC<any> = ({t, door}) => {
  if (door) return <Img src={staticFile('mp2/i34.png')} style={{position: 'absolute', left: -1140, top: 0, width: 3432, height: 1920, filter: `brightness(${0.95 + Math.sin(t * 8) * 0.04}) saturate(1.2)`}} />;
  return <Img src={staticFile('mp2/i19.png')} style={{position: 'absolute', left: -1250, top: 0, width: 3432, height: 1920, filter: 'brightness(1.5) saturate(1.2)'}} />;
};
const GranPatch: React.FC<any> = ({t}) => {
  const tr = Wd(6, 4) - 0.05;
  const lt = t - tr;
  const gone = lt > 0.3;
  if (t > tr + 0.7) return null;
  const q = clamp(lt / 0.3);
  return <div style={{position: 'absolute', left: 511 - 125 + (lt > 0 ? -q * 140 : 0), top: 1020 - 118 + (lt > 0 ? q * 160 : 0), width: 250, height: 236, borderRadius: '50%', background: 'radial-gradient(ellipse at 40% 35%, #7a5a3e 40%, #5a4029)', border: `6px solid ${INK}`, opacity: 1 - q, transform: `rotate(${q * -40}deg)`}} />;
};

// ---------------- HUD: plan cards, captions, end card ----------------
const PlanCard: React.FC<any> = ({n, t, t0, t1}) => {
  const lt = t - t0; if (lt < 0 || t > t1) return null;
  const u = clamp(lt / 0.2);
  const sc = u >= 1 ? 1 + 0.05 * Math.exp(-(lt - 0.2) * 9) * Math.cos((lt - 0.2) * 30) : lerp(3.2, 1, eo(u));
  const outQ = clamp((t - (t1 - 0.2)) / 0.2);
  return (
    <div style={{position: 'absolute', left: 130, top: 190, width: 820, height: 330, opacity: 1 - outQ, transform: `rotate(-3deg) scale(${sc * (1 - 0.3 * outQ)})`, background: '#e8d3a2', border: `12px solid ${INK}`, borderRadius: 18, boxShadow: '0 16px 0 rgba(0,0,0,0.35)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30}}>
      <Txt size={210} color={INK} stroke={0}>PLAN</Txt>
      <Txt size={290} color="#c0261c" stroke={0}>{n}</Txt>
    </div>
  );
};

const chunksOf = () => {
  const out: any[] = [];
  T.forEach((sg: any, si: number) => {
    let cur: any[] = [];
    sg.words.forEach((w: any, k: number) => {
      cur.push(w);
      if (cur.length >= 3 || /[.?!]$|\.\.\.$/.test(w.text) || /,$/.test(w.text)) { out.push({words: cur, seg: si}); cur = []; }
    });
    if (cur.length) out.push({words: cur, seg: si});
  });
  return out.map((c, i) => ({...c, start: c.words[0].start, end: c.words[c.words.length - 1].end}));
};
const CH = chunksOf();
const Captions: React.FC<any> = ({t}) => {
  const idx = CH.findIndex((c, i) => t >= c.start - 0.03 && t < Math.max(c.end + 0.3, c.start + 0.6) && !(CH[i + 1] && t >= CH[i + 1].start - 0.03));
  if (idx < 0) return null;
  const c = CH[idx];
  const len = c.words.reduce((a: number, w: any) => a + w.text.length, 0) + c.words.length;
  const fs = Math.min(128, Math.floor(900 / (len * 0.5)));
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1480, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, flexWrap: 'nowrap'}}>
      {c.words.map((w: any, i: number) => <Txt key={i} size={fs} stroke={16} color={t >= w.start && t < w.end + 0.03 ? '#ffd400' : '#fff'}>{w.text}</Txt>)}
    </div>
  );
};

export const Mp2Short: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let i = 1;
  for (let k = 1; k <= 12; k++) if (t >= SHOT_T[k - 1]) i = k;
  const cam = CAMS[i - 1];
  const u = clamp((t - SHOT_T[i - 1]) / (SHOT_T[i] - SHOT_T[i - 1]));
  const z = lerp(cam.z0, cam.z1, eio(u)) * (1 + (i > 1 ? 0.045 * Math.exp(-(t - SHOT_T[i - 1]) * 11) : 0));
  let sx = 0, sy = 0;
  for (const [ts, amp] of cam.sh) { const d = t - ts; if (d >= 0 && d < 0.8) { const e = Math.exp(-d * 7) * amp; sx += Math.sin(d * 70) * e; sy += Math.cos(d * 83) * e; } }
  const endStart = TOTAL2 - 2.0;
  const card = clamp((t - endStart) / 0.4);
  const fade = t > TOTAL2 - 0.25 ? clamp((TOTAL2 - t) / 0.25) : 1;
  const titleOut = clamp((t - (S1(1) + 0.05)) / 0.2);
  const tp = 1 + 0.12 * Math.exp(-Math.max(0, t - Wd(1, 5)) * 8) * (t >= Wd(1, 5) ? 1 : 0) + 0.06 * Math.exp(-Math.max(0, t - Wd(1, 3)) * 8) * (t >= Wd(1, 3) ? 1 : 0);
  const fiveQ = clamp((t - Wd(2, 2)) / 0.16);
  const fiveOut = t > S1(2) + 0.1 ? clamp(1 - (t - S1(2) - 0.1) / 0.2) : 1;
  return (
    <AbsoluteFill style={{background: '#000', opacity: fade}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `540px ${cam.fy}px`, transform: `translate(${sx}px,${sy}px) scale(${z})`}}>
          <Shot i={i} t={t} />
        </div>
      </AbsoluteFill>
      {t < S1(1) + 0.3 && <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', lineHeight: '140px', opacity: 1 - titleOut, transform: `scale(${tp * (1 - 0.3 * titleOut)})`}}>
        <div><Txt size={150} stroke={16}>ONE ROOM.</Txt></div>
        <div><Txt size={130} stroke={16} color="#ffd400">EIGHT PEOPLE.</Txt></div>
      </div>}
      <PlanCard n={1} t={t} t0={Wd(3, 0)} t1={Wd(3, 3) + 0.7} />
      <PlanCard n={2} t={t} t0={Wd(5, 0)} t1={Wd(5, 3) + 0.7} />
      <PlanCard n={3} t={t} t0={Wd(7, 0)} t1={Wd(7, 3) + 0.6} />
      <PlanCard n={4} t={t} t0={Wd(9, 0)} t1={Wd(9, 3) + 0.7} />
      {t >= Wd(2, 2) && t < S1(2) + 0.3 && <div style={{position: 'absolute', left: 0, right: 0, top: 60, lineHeight: '300px', textAlign: 'center', opacity: fiveOut, transform: `scale(${lerp(2.6, 1, eo(fiveQ))}) rotate(-3deg)`}}>
        <Txt size={300} color="#ffd400" stroke={20}>5</Txt><Txt size={125} stroke={16} style={{marginLeft: 20}}>MINUTES</Txt>
      </div>}
      {card < 1 && <div style={{opacity: 1 - card}}><Captions t={t} /></div>}
      <AbsoluteFill style={{background: `rgba(0,0,0,${0.5 * card})`}} />
      {card > 0 && <div style={{position: 'absolute', left: 50, right: 50, top: 820, textAlign: 'center', opacity: card, transform: `scale(${lerp(1.4, 1, eo(card))})`, lineHeight: '130px'}}>
        <div><Txt size={120} color="#ffd400" stroke={16}>FULL STORY</Txt></div><div><Txt size={120} color="#ffd400" stroke={16}>ON THE CHANNEL</Txt></div>
      </div>}
    </AbsoluteFill>
  );
};
