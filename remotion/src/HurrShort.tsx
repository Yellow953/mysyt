// @ts-nocheck
// "Why don't we just nuke a hurricane?" cut-out Short: whole illustrated hook image + animated beach world.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from './hurrMeta.json';
import tl from './hurrTimeline.json';

export const HURR_TOTAL = Math.round((tl.total + 0.05) * 100) / 100;
const W = 1080, H = 1920;
const INK = '#141414';
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const C = tl.clips;
const WORLD_IN = C[1].start;            // world slides in just before line 2
const LOOP_AT = HURR_TOTAL - 0.55;
const nukeWord = C[0].words.find((w: any) => w[0].startsWith('nuke'))[1];

// ---------- timings (absolute seconds) ----------
const T_LAUNCH = C[1].end + 0.05;       // missile leaves in the pause after line 2
const T_HIT = T_LAUNCH + 0.75;
const T_ZOOMOUT = T_HIT + 0.2;
const BOMBS = Array.from({length: 6}, (_, i) => C[2].start + 1.15 + i * 1.15);
const T_WORRY = C[2].start + 2.6;
const T_SPARK = C[3].words.find((w: any) => w[0] === 'tiny')[1];
const T_SHRUG = C[3].start + 2.7;
const T_FALL = C[4].start;
const T_PACK = C[5].start - 0.1;
const T_WALK = C[5].start + 1.0;

// ---------- sprite ----------
const MR_X = 250, FEET_Y = 1470, HEAD_R = 115;
const Sprite: React.FC<any> = ({name, x, y, w, r, rot = 0, flip = false, op = 1, sx = 1, sy = 1, filter = 'none', origin}) => {
  const m = (meta as any)[name];
  const sc = r ? r / m.head[2] : w / m.w;
  const ww = m.w * sc, hh = m.h * sc, fx = m.feet[0] * sc;
  const ox = origin ? origin[0] * ww : fx, oy = origin ? origin[1] * hh : hh;
  return (
    <div style={{position: 'absolute', left: x - ox, top: y - oy, width: ww, height: hh, opacity: op, transformOrigin: `${ox}px ${oy}px`, transform: `rotate(${rot}deg) scale(${flip ? -sx : sx},${sy})`, filter}}>
      <Img src={staticFile(`hurr/${name}.png`)} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

const posesAt = (t: number, list: [number, string][]) => {
  let name = list[0][1], sw = -9;
  for (const [pt, pn] of list) if (t >= pt) { name = pn; sw = pt; }
  const dt = t - sw;
  const k = sw > -9 && sw > 0 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  return {name, sx: 1 - 0.13 * k, sy: 1 + 0.13 * k};
};

// ---------- camera ----------
const CAM: [number, number, number, number][] = [
  // t, scale, cx, cy
  [0, 1.0, 540, 960],
  [T_LAUNCH, 1.0, 540, 960],
  [T_ZOOMOUT + 1.1, 0.8, 600, 900],
  [C[3].start - 0.1, 0.8, 600, 900],
  [T_SPARK + 0.4, 1.15, 520, 700],
  [C[3].end - 0.3, 1.15, 520, 700],
  [T_FALL + 0.6, 0.9, 680, 900],
  [C[5].start - 0.3, 0.9, 680, 920],
  [T_WALK + 1.8, 1.0, 540, 960],
];
const cam = (t: number) => {
  let a = CAM[0], b = CAM[CAM.length - 1];
  for (let i = 0; i < CAM.length - 1; i++) if (t >= CAM[i][0] && t < CAM[i + 1][0]) { a = CAM[i]; b = CAM[i + 1]; break; }
  if (t >= CAM[CAM.length - 1][0]) return {s: b[1], cx: b[2], cy: b[3]};
  const u = eio((t - a[0]) / Math.max(0.01, b[0] - a[0]));
  return {s: lerp(a[1], b[1], u), cx: lerp(a[2], b[2], u), cy: lerp(a[3], b[3], u)};
};

// ---------- world ----------
const EYE = {x: 700, y: 600};
const HUR_W = 780;
const Bg: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: -600, top: -900, width: W + 1200, height: 1900, background: 'linear-gradient(#1c2650 0%, #3c5aa0 45%, #86b5e6 80%, #ffb783 100%)'}} />
    <div style={{position: 'absolute', left: -600, top: 1000, width: W + 1200, height: 300, background: 'linear-gradient(#1b86b8, #0e5f93)'}} />
    <svg style={{position: 'absolute', left: -600, top: 1000}} width={W + 1200} height={300}>
      {Array.from({length: 18}, (_, i) => {
        const x = (i * 131) % (W + 1100) + 30, y = 40 + ((i * 71) % 230);
        return <path key={i} d={`M${x},${y} q30,-22 60,0 q30,22 60,0`} stroke="#bfe9ff" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.75} />;
      })}
    </svg>
    <div style={{position: 'absolute', left: -600, top: 996, width: W + 1200, height: 8, background: INK}} />
    {/* far coast on the right */}
    <svg style={{position: 'absolute', left: 700, top: 910}} width={420} height={95} viewBox="0 0 420 95">
      <path d="M0,95 Q90,10 210,40 T420,30 L420,95 Z" fill="#5dc85a" stroke={INK} strokeWidth={5} />
      <g stroke={INK} strokeWidth={4}>
        <rect x={150} y={40} width={36} height={28} fill="#ff7a59" /><path d="M146,40 L168,20 L190,40 Z" fill="#c43b2d" />
        <rect x={215} y={44} width={30} height={24} fill="#7ec8ff" /><path d="M211,44 L230,26 L249,44 Z" fill="#c43b2d" />
        <rect x={275} y={42} width={34} height={26} fill="#ff9ecb" /><path d="M271,42 L292,23 L313,42 Z" fill="#c43b2d" />
      </g>
    </svg>
    {/* sand */}
    <div style={{position: 'absolute', left: -600, top: 1290, width: W + 1200, height: 1100, background: '#f2b983'}} />
    <div style={{position: 'absolute', left: -600, top: 1282, width: W + 1200, height: 14, background: '#fff'}} />
    <div style={{position: 'absolute', left: -600, top: 1294, width: W + 1200, height: 6, background: INK}} />
    <svg style={{position: 'absolute', left: -600, top: 1300}} width={W + 1200} height={700}>
      {Array.from({length: 22}, (_, i) => {
        const x = (i * 97) % (W + 1100) + 30, y = 60 + ((i * 53) % 560);
        return <path key={i} d={`M${x},${y} q25,-14 50,0`} stroke="#d99560" strokeWidth={6} strokeLinecap="round" fill="none" />;
      })}
    </svg>
  </>
);

const World: React.FC<{t: number}> = ({t}) => {
  const c = cam(t);
  // hurricane
  const green = clamp((t - T_FALL) / 1.2);
  const wob = 1 + Math.sin(t * 2.4) * 0.012;
  const hurRot = Math.sin(t * 1.3) * 2.5;
  const greenFx = green > 0 ? `hue-rotate(${-105 * green}deg) saturate(${1 + 0.8 * green}) drop-shadow(0 0 ${40 * green}px rgba(80,255,80,${0.9 * green}))` : 'none';
  // mascot
  const poses: [number, string][] = [[0, 'mr_deadpan'], [T_HIT + 0.05, 'mr_cheer'], [T_WORRY, 'mr_worry'], [T_SHRUG, 'mr_shrug'], [T_FALL + 0.4, 'mr_worry'], [T_PACK + 0.5, 'mr_deadpan'], [T_WALK, 'mr_walk']];
  const p = posesAt(t, poses);
  const walkU = clamp((t - T_WALK) / 2.0);
  const walking = t >= T_WALK;
  const mx = walking ? lerp(MR_X, -260, walkU * walkU) : MR_X;
  const bob = walking ? -Math.abs(Math.sin((t - T_WALK) * 9)) * 14 : Math.sin(t * 2.2) * 3;
  // entry from whip: mascot idle
  const holdingMissile = t < T_LAUNCH;
  const raise = t > C[1].words[3][1] - 0.2 ? eio((t - (C[1].words[3][1] - 0.2)) / 0.4) : 0; // "Big storm, bigger bomb": lifts the missile
  const mxHand = mx + 105, myHand = FEET_Y - 300 - raise * 40;
  // missile flight
  const fu = clamp((t - T_LAUNCH) / (T_HIT - T_LAUNCH));
  const mxF = lerp(mxHand, EYE.x, eio(fu)), myF = lerp(myHand, EYE.y + 20, eio(fu)) - Math.sin(fu * Math.PI) * 120;
  const ang = Math.atan2(EYE.y - myHand, EYE.x - mxHand) * 180 / Math.PI; // direction (deg, screen)
  const flightRot = ang + 35; // sprite points ~35deg up-right
  // burst at the eye
  const bu = clamp((t - T_HIT) / 0.5);
  const sparkU = clamp((t - T_SPARK) / 0.9);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${W / 2 - c.cx * c.s}px, ${H / 2 - c.cy * c.s}px) scale(${c.s})`}}>
      <Bg />
      {/* hurricane */}
      <Sprite name="hurricane" x={EYE.x} y={EYE.y} w={HUR_W * wob} rot={hurRot} filter={greenFx} origin={[0.502, 0.502]} />
      {/* bombs popping out of the storm */}
      {BOMBS.map((b, i) => {
        const u = (t - b) / 1.5;
        if (u < 0 || u > 1) return null;
        const dir = i % 2 === 0 ? 1 : -1;
        const x = EYE.x + dir * (60 + 330 * eo(u)) * (0.8 + (i % 3) * 0.15);
        const y = EYE.y - 40 - Math.sin(clamp(u * 1.0) * Math.PI * 0.9) * 230 + u * u * 330;
        const s = u < 0.18 ? 1 - Math.pow(1 - u / 0.18, 3) * Math.cos(u / 0.18 * 9) * 0.9 : 1;
        return <Sprite key={i} name="bomb" x={x} y={y + 60} w={130} rot={dir * u * 260} op={clamp((1 - u) * 4)} sx={s} sy={s} origin={[0.5, 0.5]} />;
      })}
      {/* hit flash (big, then the same bomb is tiny) */}
      {bu > 0 && bu < 1 && <Sprite name="burst" x={EYE.x} y={EYE.y} w={lerp(70, 150, eo(bu))} op={1 - bu * bu} origin={[0.5, 0.5]} rot={bu * 40} />}
      {/* sparkler fizzle: tiny burst flickers inside the storm */}
      {sparkU > 0 && sparkU < 1 && Array.from({length: 5}, (_, i) => {
        const f = 0.5 + 0.5 * Math.sin(t * 38 + i * 2.1);
        return <Sprite key={i} name="burst" x={EYE.x + (i - 2) * 9} y={EYE.y + (i % 2) * 8 - 4} w={34 + f * 30} op={(1 - sparkU) * (0.4 + 0.6 * f)} origin={[0.5, 0.5]} rot={i * 40 + t * 200} />;
      })}
      {/* fallout drifting to the coast */}
      {[0, 1, 2, 3].map((i) => {
        const u = (t - (T_FALL + 0.1 + i * 0.45)) / 2.6;
        if (u < 0) return null;
        const uu = clamp(u);
        const x = lerp(EYE.x + 20, 880 + i * 60, eo(uu)), y = lerp(EYE.y + 140, 930 + (i % 2) * 40, eio(uu));
        return <Sprite key={i} name="fallout" x={x} y={y} w={lerp(120, 300 - i * 20, uu)} op={clamp(u * 5) * (u > 1 ? 1 : 1)} origin={[0.5, 0.5]} sx={1 + Math.sin(t * 3 + i) * 0.04} sy={1 + Math.sin(t * 3 + i) * 0.04} />;
      })}
      {/* ground shadow */}
      <div style={{position: 'absolute', left: mx - 70, top: FEET_Y - 12, width: 150, height: 26, borderRadius: '50%', background: 'rgba(120,70,30,0.35)'}} />
      {/* suitcase */}
      {t >= T_PACK && (() => {
        const u = clamp((t - T_PACK) / 0.35);
        const s = u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
        const sx0 = walking ? mx + 135 : MR_X + 190;
        return <Sprite name="suitcase" x={sx0} y={FEET_Y + 4 + (walking ? bob * 0.3 : 0)} w={190} sx={s} sy={s} />;
      })()}
      {/* mascot */}
      <Sprite name={p.name} x={mx} y={FEET_Y + bob} r={HEAD_R} sx={p.sx} sy={p.sy} flip={walking} />
      {/* held missile */}
      {holdingMissile && <Sprite name="missile" x={mxHand} y={myHand} w={150} rot={-50 - raise * 0} origin={[0.5, 0.5]} />}
      {t >= T_LAUNCH && t < T_HIT && <Sprite name="missile" x={mxF} y={myF} w={150} rot={flightRot} origin={[0.5, 0.5]} />}
    </div>
  );
};

// ---------- hook image ----------
const Hook: React.FC<{t: number}> = ({t}) => {
  const u = clamp(t / 3.4);
  const punch = t >= nukeWord ? Math.exp(-(t - nukeWord) * 7) * 0.09 * Math.cos((t - nukeWord) * 10) : 0;
  const s = lerp(1.0, 1.1, eio(u)) + punch;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img src={staticFile('hurr/img_hook_sat.png')} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 92%', transform: `scale(${s})`}} />
    </AbsoluteFill>
  );
};

// ---------- captions ----------
const chunks = (() => {
  const out: any[] = [];
  C.forEach((c: any) => {
    const ws = c.words;
    let cur: any[] = [];
    const flush = () => { if (cur.length) { out.push({start: cur[0][1], end: cur[cur.length - 1][2], words: cur}); cur = []; } };
    ws.forEach((w: any) => {
      cur.push(w);
      const len = cur.map((x) => x[0]).join(' ').length;
      if (cur.length >= 3 || len > 17 || /[.?]$/.test(w[0])) flush();
    });
    flush();
  });
  out.forEach((c, i) => { c.end = Math.max(c.end, Math.min(c.start + 0.7, out[i + 1] ? out[i + 1].start : 99)); if (out[i + 1] && c.end > out[i + 1].start) c.end = out[i + 1].start; });
  return out;
})();
const Captions: React.FC<{t: number}> = ({t}) => {
  const c = chunks.find((q) => t >= q.start - 0.05 && t < q.end + 0.15 && !(q.start > t + 0.05));
  const cc = chunks.find((q) => t >= q.start - 0.02 && t < q.end);
  const cur = cc ?? (c ?? null);
  if (!cur) return null;
  const txt = cur.words.map((w: any) => w[0].replace(/[.,?]$/, '')).join(' ');
  const fs = Math.min(108, 960 / (txt.length * 0.5));
  const hook = t < WORLD_IN - 0.3 || t > LOOP_AT;
  return (
    <AbsoluteFill style={{justifyContent: hook ? 'flex-start' : 'flex-end', alignItems: 'center', paddingTop: hook ? 330 : 0, paddingBottom: hook ? 0 : 300}}>
      <div style={{display: 'flex', gap: 16, flexWrap: 'nowrap', justifyContent: 'center', fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: fs, letterSpacing: 2, lineHeight: 1.05}}>
        {cur.words.map((w: any, i: number) => (
          <span key={i} style={{color: t >= w[1] && t < w[2] ? '#ffd400' : '#fff', WebkitTextStroke: `14px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w[0].replace(/[.,?]$/, '').toUpperCase()}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- clock label ----------
const Label: React.FC<{t: number}> = ({t}) => {
  const a = C[2].start + 0.9, b = C[2].end + 0.2;
  if (t < a || t > b) return null;
  const inU = eo((t - a) / 0.3), outU = clamp((b - t) / 0.3);
  let pulse = 0;
  BOMBS.forEach((x) => { const d = t - x; if (d >= 0 && d < 0.35) pulse = Math.max(pulse, 1 - d / 0.35); });
  return (
    <div style={{position: 'absolute', left: 0, top: 232, width: W, display: 'flex', justifyContent: 'center', opacity: inU * outU, transform: `scale(${(0.8 + 0.2 * inU) * (1 + pulse * 0.1)})`}}>
      <div style={{fontFamily: 'Impact, "Arial Black", sans-serif', textAlign: 'center', lineHeight: 1.0, color: '#fff', WebkitTextStroke: `12px ${INK}`, paintOrder: 'stroke fill', fontSize: 76, letterSpacing: 2}}>
        <div>10-MEGATON BOMB</div>
        <div style={{color: '#ff5a4a', fontSize: 104}}>EVERY 20 MIN</div>
      </div>
    </div>
  );
};

// ---------- audio cues ----------
const SFX: [number, string, number][] = [
  [nukeWord, 'thud', 1.0],
  [nukeWord, 'rumble', 0.5],
  [WORLD_IN - 0.4, 'whoosh', 0.6],
  [C[1].words[3][1], 'pop', 0.4],
  [T_LAUNCH, 'whoosh', 0.8],
  [T_HIT, 'thud', 0.8],
  [T_HIT + 0.05, 'pop', 0.7],
  [T_HIT + 0.45, 'boing', 0.5],
  ...BOMBS.map((b): [number, string, number] => [b, 'pop', 0.55]),
  [T_ZOOMOUT, 'whoosh', 0.4],
  [T_WORRY, 'boing', 0.3],
  [T_SPARK, 'sizzle', 0.9],
  [T_FALL, 'rumble', 0.9],
  [T_PACK, 'pop', 0.7],
  [T_WALK, 'whoosh', 0.3],
  [LOOP_AT, 'whoosh', 0.5],
];

export const HurrShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const slideU = eo((T - (WORLD_IN - 0.5)) / 0.5);          // world slides in from the right
  const loopU = eo((T - LOOP_AT) / 0.5);                    // hook slides back over (loop)
  const musicVol = (f: number) => {
    const t = f / fps;
    const inVoice = C.some((c: any) => t > c.start - 0.15 && t < c.end + 0.1);
    return 0.22 * (inVoice ? 0.5 : 1) * Math.min(1, t / 0.4) * Math.min(1, (HURR_TOTAL - t) / 1.0);
  };
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Hook t={Math.min(T, WORLD_IN + 0.5)} />
      {T > WORLD_IN - 0.55 && (
        <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`, overflow: 'hidden'}}>
          <World t={T} />
        </AbsoluteFill>
      )}
      {loopU > 0 && (
        <AbsoluteFill style={{transform: `translateX(${(1 - loopU) * W}px)`, overflow: 'hidden'}}>
          <Hook t={0.0} />
        </AbsoluteFill>
      )}
      <Label t={T} />
      <Captions t={T} />
      <Audio src={staticFile('hurr/voice.wav')} volume={1.0} />
      <Audio src={staticFile('hurr/music.mp3')} volume={musicVol} />
      {SFX.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.max(0, Math.round(t0 * fps))} durationInFrames={Math.round(2.6 * fps)}>
          <Audio src={staticFile(`hurr/${name}.wav`)} volume={vol * 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
