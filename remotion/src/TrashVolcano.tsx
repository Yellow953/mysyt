// @ts-nocheck
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, Easing} from 'remotion';
import meta from './meta';

export const DURATION = 34.7;
export const FPS = 60;
const GROUND = 1300; // horizon line
const MR_Y = GROUND + 150; // Mr stands on the lawn, well below the horizon
const R = 115; // head radius on screen for every pose
const INK = '#141414';

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const pop = (t: number, t0: number, d = 0.35) => {
  // overshoot pop-in 0 -> 1
  const u = (t - t0) / d;
  if (u <= 0) return 0;
  if (u >= 1) return 1 + 0.0;
  return 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9 + 0;
};
const hop = (t: number, t0: number, amp = 60, d = 0.45) => (t >= t0 && t <= t0 + d ? -amp * Math.sin((Math.PI * (t - t0)) / d) : 0);

// ---------- layout ----------
const VOL = {cx: 725, w: 700};
const sv = VOL.w / meta.volcano.w;
const SINK_V = 85; // volcano base sits on the lawn (visible), below the horizon
const volTop = GROUND + SINK_V - meta.volcano.h * sv;
const volLeft = VOL.cx - VOL.w / 2;
const CRATER = {x: volLeft + meta.volcano.crater[0] * sv, y: volTop + meta.volcano.crater[1] * sv};
const MR_X = 250;
const sHold = R / meta.hold.head[2];
const holdLeft = MR_X - meta.hold.feet[0] * sHold;
const holdTop = MR_Y - meta.hold.h * sHold;
const BAG0 = {x: holdLeft + meta.hold.bag[0] * sHold, y: holdTop + meta.hold.bag[1] * sHold};
const BAG_PX = meta.hold.bag[2] * sHold; // drawn bag width on screen
const bagScale = BAG_PX / (meta.bag.w - 16);

// ---------- pieces ----------
const Sky: React.FC<{dark?: number}> = ({dark = 0}) => (
  <>
    <div style={{position: 'absolute', left: -3000, top: -3000, width: 7000, height: 3000 + GROUND, background: 'linear-gradient(#7fcdfa 0%, #cfeeff 100%)'}} />
    {dark > 0 && <div style={{position: 'absolute', left: -3000, top: -3000, width: 7000, height: 3000 + GROUND, background: `rgba(70,55,85,${0.34 * dark})`}} />}
  </>
);

// Ground is drawn IN FRONT of set pieces so volcano/factory/bin bases sink into it.
const Ground: React.FC<{shadows?: [number, number, number][]}> = ({shadows = []}) => (
  <>
    <div style={{position: 'absolute', left: -3000, top: GROUND, width: 7000, height: 330, background: '#7ccf6e'}} />
    <div style={{position: 'absolute', left: -3000, top: GROUND + 330, width: 7000, height: 2400, background: '#5bb356'}} />
    <div style={{position: 'absolute', left: -3000, top: GROUND - 3, width: 7000, height: 6, background: INK}} />
    {shadows.map(([cx, rx, y], i) => <div key={i} style={{position: 'absolute', left: cx - rx, top: y - 22, width: rx * 2, height: 44, borderRadius: '50%', background: 'rgba(35,85,40,0.38)'}} />)}
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      {Array.from({length: 46}, (_, i) => {
        const x = -700 + i * 58 + ((i * 37) % 23), y = GROUND + 20 + ((i * 53) % 220), h = 20 + ((i * 29) % 14);
        return <path key={i} d={`M${x},${y} l-9,${-h} M${x},${y} l1,${-h - 8} M${x},${y} l10,${-h}`} stroke="#2f7a35" strokeWidth={6} strokeLinecap="round" fill="none" />;
      })}
    </svg>
  </>
);

const Cloud: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <svg style={{position: 'absolute', left: x + Math.sin(t * 0.25 + x) * 14, top: y, overflow: 'visible'}} width={1} height={1}>
    {[[0, 0, 70], [80, -20, 90], [170, 0, 75], [90, 25, 70]].map(([cx, cy, r], i) => (
      <circle key={'i' + i} cx={cx * s} cy={cy * s} r={r * s + 7} fill={INK} />
    ))}
    {[[0, 0, 70], [80, -20, 90], [170, 0, 75], [90, 25, 70]].map(([cx, cy, r], i) => (
      <circle key={'f' + i} cx={cx * s} cy={cy * s} r={r * s} fill="#ffffff" />
    ))}
  </svg>
);

type Puff = {x: number; y: number; r: number};
const Puffs: React.FC<{puffs: Puff[]; fill: string; hi?: string}> = ({puffs, fill, hi}) => (
  <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
    {puffs.map((p, i) => <circle key={'i' + i} cx={p.x} cy={p.y} r={p.r + 9} fill={INK} />)}
    {puffs.map((p, i) => <circle key={'f' + i} cx={p.x} cy={p.y} r={p.r} fill={fill} />)}
    {hi && puffs.map((p, i) => <circle key={'h' + i} cx={p.x - p.r * 0.25} cy={p.y - p.r * 0.25} r={p.r * 0.45} fill={hi} />)}
  </svg>
);

// generic puff emitter: a path function gives centre at u in [0,1]
const emit = (t: number, t0: number, t1: number, gap: number, life: number, path: (u: number, i: number) => {x: number; y: number}, r0: number, r1: number): Puff[] => {
  const out: Puff[] = [];
  for (let i = 0; t0 + i * gap < t1; i++) {
    const age = t - (t0 + i * gap);
    if (age < 0 || age > life) continue;
    const u = age / life;
    const p = path(u, i);
    let r = lerp(r0, r1, eo(u / 0.7));
    if (u > 0.75) r *= 1 - Math.pow((u - 0.75) / 0.25, 1.5);
    if (r > 2) out.push({x: p.x, y: p.y, r});
  }
  return out;
};

const SmokeSprites: React.FC<{t: number; t0: number; t1: number; gap: number; life: number; path: (u: number, i: number) => {x: number; y: number}; w0: number; w1: number; filter?: string}> = ({t, t0, t1, gap, life, path, w0, w1, filter}) => {
  const items: React.ReactNode[] = [];
  for (let i = 0; t0 + i * gap < t1; i++) {
    const age = t - (t0 + i * gap);
    if (age < 0 || age > life) continue;
    const u = age / life;
    const p = path(u, i);
    const kind = i % 3 === 1 ? 'smoke2' : 'smoke1';
    let w = lerp(w0, w1, eo(u / 0.7));
    if (u > 0.78) w *= 1 - Math.pow((u - 0.78) / 0.22, 1.5);
    if (w < 8) continue;
    const asp = meta[kind].h / meta[kind].w;
    items.push(
      <div key={i} style={{position: 'absolute', left: p.x - w / 2, top: p.y - (w * asp) / 2, width: w, height: w * asp, transform: `rotate(${((i * 47) % 40) - 20 + age * 8}deg)`, filter}}>
        <Img src={staticFile(`v/${kind}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    );
  }
  return <>{items}</>;
};

const LavaBubbles: React.FC<{t: number}> = ({t}) => {
  const cw = meta.volcano.crater[2] * sv * 0.4;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      {Array.from({length: 7}, (_, i) => {
        const ph = (t * 0.8 + i * 0.29) % 1;
        const r = 3 + 19 * Math.sin(Math.PI * ph);
        const x = CRATER.x + (((i * 0.37) % 1) - 0.5) * 2 * cw;
        const y = CRATER.y + (((i * 0.61) % 1) - 0.5) * 16 - 14 * ph;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#ff8a3c" stroke={INK} strokeWidth={3} />
            <circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.38} fill="#ffb86b" />
          </g>
        );
      })}
    </svg>
  );
};

const Burst: React.FC<{sprite: string; x: number; y: number; t: number; t0: number; dur?: number; w?: number; rise?: number; anchor?: number}> = ({sprite, x, y, t, t0, dur = 0.9, w = 420, rise = 0, anchor = 0.92}) => {
  const u = (t - t0) / dur;
  if (u < 0 || u > 1) return null;
  const m = meta[sprite];
  const asp = m.h / m.w;
  const sc = u < 0.3 ? eo(u / 0.3) : 1 - 0.22 * ((u - 0.3) / 0.7);
  const ww = w * sc;
  return (
    <div style={{position: 'absolute', left: x - ww / 2, top: y - ww * asp * anchor - rise * eo(u), width: ww, height: ww * asp, opacity: u > 0.82 ? 1 - (u - 0.82) / 0.18 : 1}}>
      <Img src={staticFile(`v/${sprite}.png`)} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

const Mr: React.FC<{pose: string; swapT: number; t: number; x: number; dx?: number; dy?: number; lean?: number}> = ({pose, swapT, t, x, dx = 0, dy = 0, lean = 0}) => {
  const m = meta[pose];
  const s = R / m.head[2];
  const dt = t - swapT;
  const k = dt >= 0 && dt < 1.2 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const pre = dt < 0 && dt > -0.14 ? clamp((dt + 0.14) / 0.14) : 0; // anticipation squash just before the swap
  const sx = (1 - 0.13 * k) * (1 + 0.05 * pre);
  const sy = (1 + 0.13 * k) * (1 - 0.07 * pre) * (1 + 0.009 * Math.sin(2 * Math.PI * 0.6 * t));
  return (
    <>
      <div style={{position: 'absolute', left: x + dx - 110, top: MR_Y - 12, width: 220, height: 26, borderRadius: '50%', background: 'rgba(40,60,40,0.22)'}} />
      <div
        style={{
          position: 'absolute', left: x + dx - m.feet[0] * s, top: MR_Y + dy - m.h * s, width: m.w * s, height: m.h * s,
          transformOrigin: `${m.feet[0] * s}px ${m.h * s}px`, transform: `rotate(${lean}deg) scale(${sx},${sy})`,
        }}
      >
        <Img src={staticFile(`v/${pose}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

const VolcanoSprite: React.FC<{cx: number; w: number; base: number; filter?: string; shake?: number; scaleIn?: number}> = ({cx, w, base, filter, shake = 0, scaleIn = 1}) => {
  const s = w / meta.volcano.w;
  const h = meta.volcano.h * s;
  return (
    <div style={{position: 'absolute', left: cx - w / 2 + shake, top: base - h, width: w, height: h, filter, transformOrigin: '50% 100%', transform: `scale(${scaleIn})`}}>
      <Img src={staticFile('v/volcano.png')} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

const Flash: React.FC<{x: number; y: number; t: number; t0: number; size?: number}> = ({x, y, t, t0, size = 130}) => {
  const u = (t - t0) / 0.45;
  if (u < 0 || u > 1) return null;
  const rnd = (i: number, k: number) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
  const sparks = Array.from({length: 11}, (_, i) => {
    const a = -Math.PI / 2 + (rnd(i, 1) - 0.5) * 2.2;
    const d = eo(u) * size * (0.8 + rnd(i, 2) * 1.5);
    return {x: x + Math.cos(a) * d, y: y + Math.sin(a) * d + 260 * u * u, r: (5 + rnd(i, 3) * 11) * (1 - u) + 2};
  });
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <circle cx={x} cy={y} r={eo(u) * size} fill="#ff6a2b" opacity={1 - u} />
      <circle cx={x} cy={y} r={eo(u) * size * 0.6} fill="#ffc867" opacity={1 - u} />
      {sparks.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#ff8a3c" stroke={INK} strokeWidth={3} />)}
    </svg>
  );
};

const Label: React.FC<{text: string; x: number; y: number; t: number; t0: number; rot?: number}> = ({text, x, y, t, t0, rot = 0}) => {
  const p = pop(t, t0, 0.3);
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y + Math.sin(t * 3 + x) * 6, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, background: '#fff', border: `8px solid ${INK}`, borderRadius: 26, padding: '6px 28px', fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 74, color: '#c0262d', letterSpacing: 2, whiteSpace: 'nowrap'}}>
      {text}
    </div>
  );
};

// ---------- worlds ----------
const World: React.FC<{cam: {x: number; y: number; s: number}; children: React.ReactNode}> = ({cam, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `translate(540px,960px) scale(${cam.s}) translate(${-cam.x}px,${-cam.y}px)`}}>{children}</div>
);

const poseAt = (t: number): [string, number] =>
  t < 1.62 ? ['hold', 0] : t < 3.68 ? ['throw', 1.62] : t < 11.36 ? ['cheer', 3.68] : t < 15.9 ? ['shrug', 11.36] : t < 17.52 ? ['deadpan', 15.9] : ['cough', 17.52];

const camAt = (t: number) => {
  const K = [
    [0, 540, 960, 1.0], [3.4, 560, 940, 1.05], [3.9, 540, 950, 1.0], [6.4, 520, 950, 1.0], [10.6, 500, 1000, 1.1],
    [11.3, 500, 1000, 1.1], [12.3, 640, 880, 0.56], [14.5, 640, 880, 0.56], [15.7, 540, 930, 1.0], [21.0, 540, 930, 1.0], [23.8, 570, 880, 0.9],
  ];
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, x0, y0, s0] = K[i], [t1, x1, y1, s1] = K[i + 1];
    if (t >= t0 && t <= t1) {
      const u = ease((t - t0) / (t1 - t0));
      return {x: lerp(x0, x1, u), y: lerp(y0, y1, u), s: Math.exp(lerp(Math.log(s0), Math.log(s1), u))};
    }
  }
  const L = K[K.length - 1];
  return {x: L[1], y: L[2], s: L[3]};
};

const VolcanoScene: React.FC<{t: number; frame0?: boolean}> = ({t, frame0}) => {
  const cam = frame0 ? {x: 540, y: 960, s: 1.0} : camAt(t);
  const [pose, swapT] = frame0 ? ['hold', 0] : poseAt(t);
  const lean = t < 0.9 ? 0 : t < 1.55 ? -7 * ease((t - 0.9) / 0.65) : t < 3 ? 6 * Math.exp(-(t - 1.62) * 2.5) : 0;
  let dy = hop(t, 3.7) + hop(t, 4.9) + hop(t, 9.3, 70) + hop(t, 9.85, 50);
  let dx = 0;
  let lean2 = lean;
  if (t > 17.52 && t < 23.6) { dx = 5 * Math.sin(t * 55); lean2 = 4 * Math.sin(t * 19); }
  if (t > 12.3 && t < 14.6) lean2 = 3 * Math.sin((t - 12.3) * 5);
  const shake = t > 2.7 && t < 3.6 ? 5 * Math.sin(t * 70) * (1 - prog(t, 2.7, 3.6)) : 0;

  // bag flight 1.62 -> 2.75
  const bu = prog(t, 1.62, 2.75);
  const showBag = t >= 1.62 && t < 2.76 && !frame0;
  const bx = lerp(BAG0.x, CRATER.x, bu);
  const by = lerp(BAG0.y, CRATER.y, bu) - 4 * 330 * bu * (1 - bu);
  const bs = bagScale * (bu > 0.88 ? 1 - (bu - 0.88) / 0.12 : 1);

  const heat = t > 3.6 && t < 11.1 ? 0.25 + 0.1 * Math.sin(t * 7) : 0;
  const smokeDark = prog(t, 16.2, 19) * (1 - prog(t, 22.6, 23.7));
  const smokePath = (u: number, i: number) => ({x: CRATER.x - (CRATER.x - MR_X - 20) * u + Math.sin(i * 2.1) * 30, y: CRATER.y - 260 * u + 330 * u * u});
  
  // small volcanoes during the "handful" shot
  const small = [
    {x: -300, w: 380, glow: false, t0: 12.0}, {x: -20, w: 320, glow: true, t0: 12.25}, {x: 1290, w: 420, glow: false, t0: 12.5},
    {x: 1520, w: 380, glow: true, t0: 12.75}, {x: 1760, w: 300, glow: false, t0: 13.0},
  ];
  const smallOn = t > 11.9 && t < 15.6;

  return (
    <World cam={cam}>
      <Sky dark={smokeDark} />
      <Ground shadows={[[VOL.cx, 330, GROUND + SINK_V]]} />
      <Cloud x={90} y={520} t={t} /><Cloud x={790} y={400} s={0.8} t={t} /><Cloud x={1500} y={560} s={1.1} t={t} /><Cloud x={-500} y={480} t={t} />
      {smallOn && small.map((v, i) => {
        const p = pop(t, v.t0, 0.35);
        if (p <= 0) return null;
        return (
          <React.Fragment key={i}>
            <VolcanoSprite cx={v.x} w={v.w} base={GROUND + 38} filter={v.glow ? undefined : 'grayscale(1) brightness(1.05)'} scaleIn={p} />
          </React.Fragment>
        );
      })}
      <VolcanoSprite cx={VOL.cx} w={VOL.w} base={GROUND + SINK_V} shake={shake} />
      {heat > 0 && <div style={{position: 'absolute', left: CRATER.x - 330, top: CRATER.y - 260, width: 660, height: 520, borderRadius: '50%', background: `radial-gradient(rgba(255,110,40,${heat}), rgba(255,110,40,0) 65%)`}} />}
      <LavaBubbles t={t} />
      <SmokeSprites t={t} t0={15.95} t1={23.6} gap={0.28} life={4.8} path={smokePath} w0={90} w1={400} />
      <Mr pose={pose} swapT={swapT} t={t} x={MR_X} dx={dx} dy={dy} lean={lean2} />
      {showBag && (
        <div style={{position: 'absolute', left: bx - (meta.bag.w * bagScale) / 2, top: by - (meta.bag.h * bagScale) / 2, width: meta.bag.w * bagScale, height: meta.bag.h * bagScale, transform: `rotate(${360 * 1.1 * bu}deg) scale(${bs / bagScale})`}}>
          <Img src={staticFile('v/bag.png')} style={{width: '100%', height: '100%'}} />
        </div>
      )}
      <Burst sprite="lava" x={CRATER.x} y={CRATER.y + 20} t={t} t0={2.72} dur={0.9} w={400} />
      <Burst sprite="fire" x={CRATER.x} y={CRATER.y - 20} t={t} t0={9.3} dur={1.0} w={360} rise={90} anchor={0.5} />
      <Burst sprite="lava" x={CRATER.x - 60} y={CRATER.y + 20} t={t} t0={9.55} dur={0.9} w={260} />
      <Label text="DIOXINS" x={410} y={610} t={t} t0={17.55} rot={-6} />
      <Label text="LEAD" x={730} y={480} t={t} t0={18.76} rot={5} />
      <Label text="MERCURY" x={560} y={730} t={t} t0={19.7} rot={-3} />
    </World>
  );
};

const FACT = {w: 640};
const sf = FACT.w / meta.factory.w;
const factLeft = 1080 - FACT.w - 4;
const factTop = GROUND + 105 - meta.factory.h * sf;
const fp = (x: number, y: number) => ({x: factLeft + x * sf, y: factTop + y * sf});

const FactoryScene: React.FC<{t: number}> = ({t}) => {
  const lt = t; // absolute time
  const s = 1 + 0.035 * prog(t, 23.3, 30.6);
  const roof = fp(330, 270), box = fp(770, 560), chim = fp(585, 10);
  const darkPath = (u: number) => ({x: lerp(roof.x, box.x, ease(u)), y: lerp(roof.y, box.y, ease(u)) - 120 * Math.sin(u * Math.PI)});
  const cleanPath = (u: number, i: number) => ({x: chim.x + 80 * u + Math.sin(u * 5 + i) * 16, y: chim.y - 300 * u});
  const volP = pop(t, 26.6, 0.4);
  const volX = 540, volW = 300;
  const signT = 29.46;
  const sUp = t - signT;
  const signFall = sUp > 0 ? {y: 330 * sUp * sUp * 1.7, r: 70 * sUp} : {y: 0, r: 0};
  const bounce = sUp > 0.38 ? -Math.abs(Math.sin((sUp - 0.38) * 9)) * 40 * Math.exp(-(sUp - 0.38) * 3) : 0;
  const vS = volW / meta.volcano.w;
  const vTop = GROUND + 125 - meta.volcano.h * vS;
  const vCrater = {x: volX - volW / 2 + meta.volcano.crater[0] * vS, y: vTop + meta.volcano.crater[1] * vS};
  return (
    <World cam={{x: 540 + 10 * prog(t, 23.3, 30.6), y: 960, s}}>
      <Sky />
      <Ground shadows={[[factLeft + FACT.w * 0.5, 300, GROUND + 105], [volX, 150, GROUND + 125]]} />
      <Cloud x={120} y={520} t={t} /><Cloud x={700} y={420} s={0.8} t={t} />
      <div style={{position: 'absolute', left: factLeft, top: factTop, width: FACT.w, height: meta.factory.h * sf}}>
        <Img src={staticFile('v/factory.png')} style={{width: '100%', height: '100%'}} />
      </div>
      {volP > 0 && <VolcanoSprite cx={volX} w={volW} base={GROUND + 125} scaleIn={volP} />}
      <SmokeSprites t={t} t0={23.9} t1={28.6} gap={0.3} life={2.2} path={darkPath} w0={60} w1={150} />
      <SmokeSprites t={t} t0={24.9} t1={30.3} gap={0.6} life={3.6} path={cleanPath} w0={50} w1={190} filter="grayscale(1) brightness(2.4) contrast(0.8)" />
      <Label text="FILTER" x={fp(770, 380).x - 70} y={fp(770, 380).y - 80} t={t} t0={25.0} rot={-4} />
      <Mr pose="deadpan" swapT={23.3} t={t} x={230} lean={0} />
      {t > 28.2 && (
        <div style={{position: 'absolute', left: vCrater.x - 70, top: vCrater.y - 30 + (t > signT ? signFall.y + bounce : 0), width: 140, height: 56, background: '#b98a56', border: `6px solid ${INK}`, borderRadius: 8, transform: `rotate(${t > signT ? signFall.r : 0}deg)`, fontFamily: 'Impact, sans-serif', fontSize: 34, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sUp > 1.2 ? 0 : 1}}>
          FILTER
        </div>
      )}
    </World>
  );
};

// ---------- captions ----------
const CAPS: [string, number, number][] = [
  ['Why don\'t we just', 0.0, 1.25], ['throw all our trash', 1.25, 2.2], ['into a volcano?', 2.2, 3.15],
  ['Honestly?', 3.68, 4.2], ['Sounds perfect.', 4.78, 5.62], ['Lava is over', 6.42, 7.4], ['a thousand degrees.', 7.4, 8.9], ['It burns anything.', 9.3, 10.85],
  ['But only a handful', 11.36, 13.25], ['of volcanoes keep', 13.42, 14.35], ['an open lava lake.', 14.35, 15.3],
  ['And the smoke?', 15.9, 16.7], ['Dioxins.', 17.52, 18.3], ['Lead.', 18.74, 19.15], ['Mercury.', 19.66, 20.35], ['Nothing to catch', 21.28, 22.45], ['any of it.', 22.56, 23.2],
  ['Incinerators', 23.78, 24.75], ['use filters.', 24.75, 25.8], ['A volcano is just', 26.6, 27.8], ['an incinerator...', 27.8, 28.8], ['without one.', 29.46, 30.2], ['So yeah.', 30.96, 31.6], ['Just recycle.', 32.54, 33.72],
];
const Captions: React.FC<{t: number}> = ({t}) => {
  const c = CAPS.find(([, a, b]) => t >= a && t <= b + 0.12);
  if (!c) return null;
  const p = clamp(pop(t, c[1], 0.18), 0, 1.06);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1545, textAlign: 'center', transform: `scale(${0.85 + 0.15 * p})`}}>
      <span style={{fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 100, whiteSpace: 'nowrap', color: '#ffd400', WebkitTextStroke: `14px ${INK}`, paintOrder: 'stroke fill', letterSpacing: 2, lineHeight: 1.05}}>{c[0]}</span>
    </div>
  );
};

const Thermometer: React.FC<{t: number}> = ({t}) => {
  const p = t < 10.8 ? pop(t, 6.42, 0.35) : Math.max(0, 1 - prog(t, 10.8, 11.1));
  if (p <= 0) return null;
  const lvl = ease(prog(t, 6.55, 7.5));
  return (
    <div style={{position: 'absolute', left: 20, top: 40, transform: `scale(${p})`, transformOrigin: '50% 100%', width: 260}}>
      <div style={{position: 'relative', width: 120, height: 420, margin: '0 auto'}}>
        <div style={{position: 'absolute', left: 28, top: 0, width: 64, height: 380, background: '#fff', border: `8px solid ${INK}`, borderRadius: 40}} />
        <div style={{position: 'absolute', left: 44, bottom: 70 + 0, width: 32, height: 310 * lvl, background: '#e0262d', borderRadius: 16}} />
        <div style={{position: 'absolute', left: 8, top: 330, width: 104, height: 104, borderRadius: '50%', background: '#e0262d', border: `8px solid ${INK}`}} />
      </div>
      <div style={{textAlign: 'center', fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 78, color: '#fff', WebkitTextStroke: `12px ${INK}`, paintOrder: 'stroke fill', marginTop: 14, whiteSpace: 'nowrap', marginLeft: -40, marginRight: -40}}>1,100°C+</div>
    </div>
  );
};

// ---------- ending scene: recycle ----------
const BIN = {cx: 790, w: 380};
const sb = BIN.w / meta.bin.w;
const binH = meta.bin.h * sb;
const binTop = GROUND + 145 - binH;
const BIN_MOUTH = {x: BIN.cx, y: binTop + 70};

const EndScene: React.FC<{t: number}> = ({t}) => {
  const swing = t < 32.1 ? 0 : t < 32.45 ? -7 * ease((t - 32.1) / 0.35) : 6 * Math.exp(-(t - 32.5) * 2.5);
  const [pose, swapT]: [string, number] = t < 30.9 ? ['deadpan', 23.3] : t < 32.5 ? ['hold', 30.9] : t < 33.1 ? ['throw', 32.5] : ['cheer', 33.1];
  const binP = pop(t, 30.45, 0.4);
  const land = 33.05;
  const bu = prog(t, 32.5, land);
  const showBag = t >= 32.5 && t < land + 0.02;
  const bx = lerp(BAG0.x, BIN_MOUTH.x, bu);
  const by = lerp(BAG0.y, BIN_MOUTH.y, bu) - 4 * 300 * bu * (1 - bu);
  const bs = bagScale * (bu > 0.86 ? 1 - ((bu - 0.86) / 0.14) * 0.85 : 1);
  const dl = t - land;
  const bk = dl >= 0 && dl < 1 ? Math.exp(-dl * 7) * Math.cos(dl * 24) : 0;
  const stars = dl >= 0 && dl < 0.7 ? Array.from({length: 6}, (_, i) => {
    const a = -Math.PI / 2 + (i - 2.5) * 0.42, d = eo(dl / 0.7) * 150;
    return {x: BIN_MOUTH.x + Math.cos(a) * d, y: BIN_MOUTH.y + Math.sin(a) * d, r: 14 * (1 - dl / 0.7) + 3};
  }) : [];
  const hop2 = hop(t, 33.15, 55);
  return (
    <World cam={{x: 540 + 8 * prog(t, 30.2, 34), y: 960, s: 1 + 0.03 * prog(t, 30.2, 34)}}>
      <Sky />
      <Ground shadows={[[BIN.cx, 190, GROUND + 145]]} />
      <Cloud x={120} y={520} t={t} /><Cloud x={820} y={400} s={0.8} t={t} />
      {binP > 0 && (
        <div style={{position: 'absolute', left: BIN.cx - BIN.w / 2, top: binTop, width: BIN.w, height: binH, transformOrigin: '50% 100%', transform: `scale(${binP * (1 + 0.1 * bk)}, ${binP * (1 - 0.1 * bk)})`}}>
          <Img src={staticFile('v/bin.png')} style={{width: '100%', height: '100%'}} />
        </div>
      )}
      <Mr pose={pose} swapT={swapT} t={t} x={MR_X} dy={hop2} lean={swing} />
      {showBag && (
        <div style={{position: 'absolute', left: bx - (meta.bag.w * bagScale) / 2, top: by - (meta.bag.h * bagScale) / 2, width: meta.bag.w * bagScale, height: meta.bag.h * bagScale, transform: `rotate(${330 * bu}deg) scale(${bs / bagScale})`}}>
          <Img src={staticFile('v/bag.png')} style={{width: '100%', height: '100%'}} />
        </div>
      )}
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        {stars.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#7fd6ff" stroke={INK} strokeWidth={3} />)}
      </svg>
    </World>
  );
};

// ---------- audio ----------
const SFX: [number, string, number][] = [
  [1.55, 'whoosh', 0.5], [2.4, 'rumble', 0.22], [2.74, 'pop', 0.7], [2.76, 'sizzle', 0.3], [3.68, 'boing', 0.3], [4.85, 'boing', 0.3],
  [6.45, 'pop', 0.6], [9.3, 'sizzle', 0.4], [9.3, 'pop', 0.5], [11.3, 'whoosh', 0.4], [12.0, 'pop', 0.4], [12.25, 'pop', 0.4], [12.5, 'pop', 0.4], [12.75, 'pop', 0.4], [13.0, 'pop', 0.4],
  [15.9, 'rumble', 0.35], [17.55, 'cough', 0.6], [17.55, 'pop', 0.4], [18.78, 'pop', 0.4], [19.1, 'cough', 0.5], [19.7, 'pop', 0.4], [20.45, 'cough', 0.6],
  [23.3, 'whoosh', 0.45], [25.0, 'pop', 0.4], [26.6, 'pop', 0.7], [29.5, 'clink', 0.7], [29.85, 'thud', 0.4],
  [30.2, 'whoosh', 0.45], [30.45, 'pop', 0.6], [30.9, 'boing', 0.3], [32.45, 'whoosh', 0.5], [33.05, 'clink', 0.6], [33.05, 'pop', 0.6], [33.15, 'boing', 0.3], [33.7, 'whoosh', 0.45],
];

const slide = (u: number) => ease(u);
const Layer: React.FC<{x: number; children: React.ReactNode}> = ({x, children}) => (
  <AbsoluteFill style={{overflow: 'hidden', transform: `translateX(${x}px)`}}>{children}</AbsoluteFill>
);

export const TrashVolcano: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // scene order: volcano -> (slide) factory -> (slide) recycle -> (slide) frame-0 volcano (loop)
  const W1 = [23.3, 23.8], W2 = [30.2, 30.65], W3 = [33.7, 34.15];
  const loopT = (t - W3[1]) * 0.5;
  let scene: React.ReactNode;
  if (t < W1[0]) scene = <VolcanoScene t={t} />;
  else if (t < W1[1]) { const u = slide(prog(t, W1[0], W1[1])); scene = <><Layer x={-1080 * u}><VolcanoScene t={t} /></Layer><Layer x={1080 * (1 - u)}><FactoryScene t={t} /></Layer></>; }
  else if (t < W2[0]) scene = <FactoryScene t={t} />;
  else if (t < W2[1]) { const u = slide(prog(t, W2[0], W2[1])); scene = <><Layer x={-1080 * u}><FactoryScene t={t} /></Layer><Layer x={1080 * (1 - u)}><EndScene t={t} /></Layer></>; }
  else if (t < W3[0]) scene = <EndScene t={t} />;
  else if (t < W3[1]) { const u = slide(prog(t, W3[0], W3[1])); scene = <><Layer x={-1080 * u}><EndScene t={t} /></Layer><Layer x={1080 * (1 - u)}><VolcanoScene t={0.2} frame0 /></Layer></>; }
  else scene = <VolcanoScene t={Math.max(0, loopT)} frame0 />;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>{scene}</AbsoluteFill>
      {t < 11.2 && <Thermometer t={t} />}
      <Captions t={t} />
      <Audio src={staticFile('v/voice.wav')} volume={1.0} />
      <Audio src={staticFile('v/music.mp3')} volume={(f) => 0.085 * Math.min(1, f / FPS) * Math.min(1, (DURATION * FPS - f) / FPS)} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.round(at * FPS)} layout="none">
          <Audio src={staticFile(`v/${name}.wav`)} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
