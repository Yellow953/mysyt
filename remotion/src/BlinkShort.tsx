// @ts-nocheck
// "What if you stopped blinking for a day?" vertical Short: whole illustrated hook image + cut-out animation.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from '../public/blink/sp/meta.json';
import caps from './blinkCaps.json';

export const BLINK_TOTAL = 41.3;
const W = 1080, H = 1920;
const GROUND = 1395; // feet line (~73%)
const INK = '#141414';
const TR = 0.45;
// segment starts of the voice (segments.json) = shot boundaries
const BOUNDS = [0, 3.604, 8.984, 15.417, 20.395, 27.295, 34.064, 38.359, BLINK_TOTAL];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const pop = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9);

// blink curve: 0 open -> 1 closed -> 0, one blink starting at b0 lasting d
const blinkAt = (t: number, b0: number, d = 0.2) => {
  const u = (t - b0) / d;
  return u < 0 || u > 1 ? 0 : Math.sin(u * Math.PI);
};

// ---------- mascot (cut-out pose with swap squash, bob and eyelids on the 'stare' pose) ----------
const EYE_DX = [-62, 58], EYE_DY = -2, EYE_R = 58; // in sprite px, relative to head centre (stare sprite)
const Mascot: React.FC<{t: number; x: number; hr: number; name: string; poses?: [number, string, number?][]; lid?: (t: number) => number; shake?: number; enter?: boolean; feetY?: number; tilt?: number}> = ({t, x, hr, name, poses, lid, shake = 0, enter, feetY = GROUND, tilt = 0}) => {
  let nm = name, swapT = -9, xo = x;
  if (poses) for (const [pt, pn, px] of poses) if (t >= pt) { nm = pn; swapT = pt; if (px !== undefined) xo = px; }
  const m = meta[nm];
  const sc = (nm === 'mr_shrug' && name === 'stare' ? hr * 0.78 : hr) / m.head[2];
  const w = m.w * sc, h = m.h * sc, fx = m.feet[0] * sc;
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const es = enter ? pop(t / 0.4) : 1;
  const sx = (1 - 0.12 * k) * es, sy = (1 + 0.12 * k) * es;
  const jx = shake ? Math.sin(t * 90) * shake : 0, jr = shake ? Math.sin(t * 70 + 1) * shake * 0.12 : 0;
  const bob = Math.sin(t * 2.4) * 3;
  const L = nm === 'stare' && lid ? lid(t) : 0;
  const hcx = m.head[0], hcy = m.head[1];
  return (
    <>
      <div style={{position: 'absolute', left: xo - w * 0.3, top: feetY - 18, width: w * 0.6, height: 32, borderRadius: '50%', background: 'rgba(30,60,30,0.28)'}} />
      <div style={{position: 'absolute', left: xo - fx + jx, top: feetY - h + bob, width: w, height: h, transformOrigin: `${fx}px ${h}px`, transform: `rotate(${tilt + jr}deg) scale(${sx},${sy})`}}>
        <Img src={staticFile(`blink/sp/${nm}.png`)} style={{width: '100%', height: '100%'}} />
        {L > 0.01 && EYE_DX.map((dx, i) => {
          const d = EYE_R * 2 * sc * 1.12;
          const cx = (hcx + dx) * sc, cy = (hcy + EYE_DY) * sc;
          return (
            <div key={i} style={{position: 'absolute', left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: '50%', overflow: 'hidden'}}>
              <div style={{width: '100%', height: `${L * 100}%`, background: '#fdfdfd', borderBottom: L > 0.85 ? `${Math.max(4, d * 0.07)}px solid ${INK}` : 'none', borderRadius: '0 0 50% 50% / 0 0 30% 30%'}} />
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------- generic sprite with enter/animation ----------
const Prop: React.FC<{name: string; cx: number; cy: number; w: number; t: number; t0?: number; t1?: number; rot?: number; dx?: number; dy?: number; spin?: number; op?: number; enter?: boolean}> = ({name, cx, cy, w, t, t0 = 0, t1, rot = 0, dx = 0, dy = 0, spin = 0, op = 1, enter = true}) => {
  if (t < t0 || (t1 !== undefined && t > t1)) return null;
  const m = meta[name];
  const s = (enter ? pop((t - t0) / 0.35) : 1);
  const h = w * (m.h / m.w);
  return <Img src={staticFile(`blink/sp/${name}.png`)} style={{position: 'absolute', left: cx - w / 2 + dx, top: cy - h / 2 + dy, width: w, height: h, opacity: op, transform: `rotate(${rot + spin * (t - t0)}deg) scale(${s})`}} />;
};

const Label: React.FC<{text: string; x: number; y: number; t: number; t0: number; t1?: number; size?: number; color?: string; rot?: number; stroke?: string}> = ({text, x, y, t, t0, t1, size = 120, color = '#ffd400', rot = 0}) => {
  const lt = t - t0;
  if (lt < 0 || (t1 !== undefined && t > t1)) return null;
  const s = pop(lt / 0.35);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: size, color, WebkitTextStroke: `${size * 0.13}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', letterSpacing: 2}}>{text}</div>;
};

const DayBg: React.FC<{tint?: string}> = ({tint}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: GROUND + 4, background: 'linear-gradient(#2ea8ff, #c9efff)'}} />
    <svg style={{position: 'absolute', left: 0, top: GROUND - 230}} width={W} height={235} viewBox="0 0 1920 175" preserveAspectRatio="none">
      <path d="M0,175 L0,110 Q260,40 520,100 T1050,80 T1560,95 T1920,70 L1920,175 Z" fill="#7fe05a" stroke={INK} strokeWidth={5} />
    </svg>
    <div style={{position: 'absolute', left: 0, top: GROUND, width: W, height: 200, background: '#58c93a'}} />
    <div style={{position: 'absolute', left: 0, top: GROUND + 200, width: W, height: H - GROUND - 200, background: '#3fae2e'}} />
    <div style={{position: 'absolute', left: 0, top: GROUND - 3, width: W, height: 6, background: INK}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      {Array.from({length: 22}, (_, i) => {
        const x = 30 + i * 49 + ((i * 37) % 23), y = GROUND + 60 + ((i * 53) % 420), hh = 22 + ((i * 29) % 16);
        return <path key={i} d={`M${x},${y} l-8,${-hh} M${x},${y} l1,${-hh - 8} M${x},${y} l9,${-hh}`} stroke="#1f7a2a" strokeWidth={6} strokeLinecap="round" fill="none" />;
      })}
    </svg>
    {/* soft clouds */}
    {[[160, 200, 1], [820, 330, 0.8]].map(([cx, cy, s], i) => (
      <svg key={i} style={{position: 'absolute', left: cx - 150 * s, top: cy - 60 * s}} width={300 * s} height={120 * s} viewBox="0 0 300 120">
        <path d="M40,100 Q10,100 15,75 Q20,50 55,55 Q65,15 110,25 Q140,0 175,30 Q225,15 240,60 Q290,60 280,95 Q275,105 255,100 Z" fill="#fff" stroke={INK} strokeWidth={4} />
      </svg>
    ))}
    {tint && <div style={{position: 'absolute', inset: 0, background: tint}} />}
  </>
);

// ---------- hook: WHOLE IMAGE ----------
const HookShot: React.FC<{t: number}> = ({t}) => {
  const u = eio(t / 3.4);
  let z = lerp(1.0, 1.07, u);
  const p = clamp((t - 2.6) / 0.45);
  z += (t >= 2.6 ? 0.09 * Math.sin(Math.min(1, p) * Math.PI) : 0) + (t >= 3.05 ? 0.03 * clamp((t - 3.05) / 0.5) : 0);
  const shake = t > 2.6 && t < 3.0 ? Math.sin(t * 120) * 6 * (1 - (t - 2.6) / 0.4) : 0;
  // stopwatch tremble overlay not needed; image already has sweat and veins
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#2ea8ff'}}>
      <Img src={staticFile('blink/whole_hook.png')} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 30%', transform: `translateX(${shake}px) scale(${z})`, filter: 'saturate(1.2)'}} />
    </AbsoluteFill>
  );
};

// ---------- shot 2: counter, he blinks without noticing ----------
const Shot2: React.FC<{t: number}> = ({t}) => {
  const n = Math.floor(clamp((t - 0.3) / 2.0) * 15);
  const bl = [0.6, 1.5, 2.5, 3.4, 4.3];
  const lid = (tt: number) => Math.max(...bl.map((b) => blinkAt(tt, b, 0.18)));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      <Label text={String(n)} x={540} y={250} t={t} t0={0.3} size={300} color="#fff" />
      <Label text="BLINKS A MINUTE" x={540} y={430} t={t} t0={2.3} size={85} />
      <Mascot t={t} x={540} hr={145} name="stare" lid={lid} poses={[[3.5, 'mr_shrug']]} />
    </AbsoluteFill>
  );
};

// ---------- shot 3: tears wipe, dust gets wiped off ----------
const Shot3: React.FC<{t: number}> = ({t}) => {
  const lid = (tt: number) => Math.max(blinkAt(tt, 1.6, 0.35), blinkAt(tt, 3.6, 0.3), blinkAt(tt, 5.0, 0.25));
  const dustX = [[250, 760], [830, 820], [330, 640]];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      {/* tears spread: drops drift down over the face region */}
      {[0, 1, 2].map((i) => {
        const t0 = 1.0 + i * 0.28;
        const u = clamp((t - t0) / 1.6);
        return <Prop key={i} name="tear" cx={[430, 540, 650][i]} cy={660 + u * 120} w={90} t={t} t0={t0} t1={t0 + 1.6} op={1 - u * u} />;
      })}
      <Label text="TEARS" x={540} y={300} t={t} t0={1.1} t1={3.4} size={170} color="#7fd0ff" />
      <Mascot t={t} x={540} hr={145} name="stare" lid={lid} />
      {dustX.map(([cx, cy], i) => {
        const t0 = 3.2 + i * 0.12;
        const fly = clamp((t - 4.95) / 0.7);
        const dir = cx < 540 ? -1 : 1;
        return <Prop key={i} name="dust" cx={cx} cy={cy} w={170} t={t} t0={t0} t1={5.75} dx={dir * 700 * eo(fly)} dy={-260 * eo(fly)} spin={fly > 0 ? dir * 400 : 0} op={1 - clamp((fly - 0.6) / 0.4)} />;
      })}
      <Label text="DUST" x={540} y={300} t={t} t0={3.5} t1={5.7} size={170} color="#e4e4e4" />
    </AbsoluteFill>
  );
};

// ---------- shot 4: timer 10 s ... 30 s, rigid, twitching ----------
const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, '0')}`;
const Shot4: React.FC<{t: number}> = ({t}) => {
  const secs = t < 2.4 ? lerp(0, 10, clamp((t - 0.2) / 2.2)) : lerp(10, 30, eio((t - 2.8) / 1.5));
  const lid = (tt: number) => Math.max(blinkAt(tt, 1.5, 0.1) * 0.3, blinkAt(tt, 2.9, 0.1) * 0.35, blinkAt(tt, 3.6, 0.1) * 0.45, blinkAt(tt, 4.1, 0.12) * 0.5);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      <Prop name="watch" cx={300} cy={420} w={330} t={t} t0={0.1} rot={Math.sin(t * 40) * 1.5} />
      <Label text={fmt(secs)} x={730} y={410} t={t} t0={0.2} size={190} color="#fff" />
      <Mascot t={t} x={540} hr={145} name="stare" lid={lid} shake={t > 1.2 ? 2 + t * 0.9 : 0} />
      {[0, 1, 2, 3].map((i) => {
        const t0 = 0.8 + i * 1.0;
        const u = clamp((t - t0) / 0.9);
        return <Prop key={i} name="tear" cx={i % 2 ? 690 : 400} cy={760 + u * 190} w={64} t={t} t0={t0} t1={t0 + 0.9} dx={(i % 2 ? 1 : -1) * u * 60} op={1 - u * u} />;
      })}
    </AbsoluteFill>
  );
};

// ---------- shot 5: sting, blur, give in ----------
const Shot5: React.FC<{t: number}> = ({t}) => {
  const blur = t < 2.0 ? 0 : t < 5.5 ? Math.min(16, (t - 2.0) * 9) : Math.max(0, 16 - (t - 5.5) * 40);
  const red = clamp((t - 0.3) / 0.5) * 0.38 * (t < 2.0 ? 1 : 0.7) * (t > 5.9 ? 0 : 1);
  const lid = (tt: number) => Math.max(blinkAt(tt, 0.5, 0.15) * 0.4, tt > 4.2 && tt < 5.7 ? 0.1 + 0.3 * Math.sin((tt - 4.2) * 3) ** 2 : 0, blinkAt(tt, 5.75, 0.4));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, filter: `blur(${blur}px)`}}>
        <DayBg />
        <Mascot t={t} x={540} hr={145} name="stare" lid={lid} shake={t < 5.7 ? 1.5 : 0} poses={[[6.0, 'mr_shrug']]} />
        {blur > 2 && <div style={{position: 'absolute', left: 540 - 220 + Math.sin(t * 3) * 25, top: GROUND - 640, width: 440, height: 640, opacity: 0.35}}><Img src={staticFile('blink/sp/stare.png')} style={{width: '100%', height: '100%'}} /></div>}
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255,40,20,0), rgba(255,30,10,0.95))', opacity: red}} />
      <Label text="THE STING" x={540} y={300} t={t} t0={0.35} t1={2.0} size={150} color="#ff4a2a" />
      <Label text="THE BLUR" x={540} y={300} t={t} t0={2.1} t1={3.7} size={150} color="#ffffff" />
      <Label text="I GIVE IN" x={540} y={300} t={t} t0={5.75} size={150} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ---------- shot 6: record ----------
const Shot6: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <DayBg />
    <Prop name="watch" cx={230} cy={420} w={290} t={t} t0={0.2} />
    <Label text="1 HR 17 MIN" x={730} y={470} t={t} t0={5.0} size={110} color="#ffffff" />
    <Label text="ON TV" x={730} y={330} t={t} t0={2.4} size={160} color="#ffffff" />
    <Label text="UNOFFICIAL" x={540} y={170} t={t} t0={0.9} size={140} color="#ff3b2a" rot={-8} />
    <Mascot t={t} x={540} hr={112} name="mr_shrug" enter />
  </AbsoluteFill>
);

// ---------- shot 7: 24 H dwarfs the record ----------
const Shot7: React.FC<{t: number}> = ({t}) => {
  const hgt = 1000 * eo((t - 0.25) / 1.0);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      <div style={{position: 'absolute', left: 640, top: GROUND - 80, width: 150, height: 80, background: '#ff8a1f', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
      <Label text="1:17" x={715} y={GROUND - 130} t={t} t0={0.3} size={70} color="#fff" />
      <div style={{position: 'absolute', left: 840, top: GROUND - hgt, width: 170, height: hgt, background: '#e8402a', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
      <Label text="24 H" x={925} y={GROUND - hgt - 70} t={t} t0={0.9} size={95} color="#fff" />
      <Label text="~19X" x={380} y={400} t={t} t0={2.0} size={260} color="#ffd400" />
      <Mascot t={t} x={300} hr={125} name="mr_deadpan" enter />
    </AbsoluteFill>
  );
};

// ---------- shot 8: you blinked ----------
const Shot8: React.FC<{t: number}> = ({t}) => {
  const lid = (tt: number) => blinkAt(tt, 0.3, 0.5);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DayBg />
      <Mascot t={t} x={540} hr={145} name="stare" lid={lid} poses={[[0.6, 'mr_cheer']]} />
      {[0, 1, 2, 3].map((i) => {
        const t0 = 0.7 + i * 0.1, u = clamp((t - t0) / 1.0);
        return <Prop key={i} name="tear" cx={540 + (i - 1.5) * 150} cy={620} w={56} t={t} t0={t0} t1={t0 + 1.0} dx={(i - 1.5) * 80 * u} dy={-90 * eo(u) + 110 * u * u} rot={(i - 1.5) * 20} op={1 - u * u} />;
      })}
      <Label text="WELCOME BACK" x={540} y={300} t={t} t0={1.5} size={130} color="#ffffff" />
    </AbsoluteFill>
  );
};

const Captions: React.FC<{t: number}> = ({t}) => {
  const c: any = (caps as any[]).find((q) => t >= q.start && t < q.end + 0.1);
  if (!c) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 190}}>
      <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 960, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 104, letterSpacing: 2, lineHeight: 1.05}}>
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
  if (i === 6) return <Shot7 t={t} />;
  return <Shot8 t={t} />;
};

// [time, sfx, volume]
const SFX: [number, string, number][] = [
  [2.6, 'thud', 1.0], [2.6, 'whoosh', 0.5],
  [3.15, 'whoosh', 0.5],
  // blinks in shot 2 (pop = tiny tick)
  [4.2, 'pop', 0.4], [5.1, 'pop', 0.4], [6.1, 'pop', 0.4], [7.0, 'pop', 0.4], [7.9, 'pop', 0.4], [7.1, 'boing', 0.4],
  [8.55, 'whoosh', 0.5],
  [10.6, 'pop', 0.5], [10.9, 'pop', 0.5], [11.2, 'pop', 0.5], [12.6, 'whoosh', 0.35], [12.9, 'pop', 0.4], [14.0, 'pop', 0.4], [14.4, 'pop', 0.4],
  [14.96, 'whoosh', 0.5],
  [16.4, 'pop', 0.4], [17.4, 'pop', 0.4], [18.3, 'pop', 0.4], [19.1, 'pop', 0.4], [19.6, 'pop', 0.4],
  [19.95, 'whoosh', 0.5],
  [20.75, 'sizzle', 0.6], [23.0, 'rumble', 0.4], [26.1, 'thud', 0.7],
  [26.85, 'whoosh', 0.5],
  [27.5, 'thud', 0.7], [27.5, 'clink', 0.3], [29.7, 'pop', 0.5], [32.3, 'pop', 0.5],
  [33.6, 'whoosh', 0.5],
  [34.3, 'pop', 0.5], [35.1, 'rumble', 0.4], [36.1, 'thud', 0.8],
  [37.9, 'whoosh', 0.5],
  [38.65, 'pop', 0.6], [38.95, 'boing', 0.6],
  [40.85, 'whoosh', 0.6],
];

export const BlinkShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const loopS = BLINK_TOTAL - TR;
  const loopU = eo((T - loopS) / TR);
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
      <Audio src={staticFile('blink/voice.wav')} volume={1.0} />
      <Audio src={staticFile('blink/music.mp3')} volume={(f) => {
        const t = f / fps;
        const voiced = caps.some((c: any) => t >= c.start - 0.1 && t < c.end);
        return 0.22 * (voiced ? 0.55 : 1) * Math.min(1, t / 0.5) * Math.min(1, (BLINK_TOTAL - t) / 1.2);
      }} />
      {SFX.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.round(t0 * fps)} durationInFrames={Math.round(2.6 * fps)}>
          <Audio src={staticFile(`blink/${name}.wav`)} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
