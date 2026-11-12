// @ts-nocheck
// "What happens if you swallow gum?" vertical Short: whole illustrated hook image + cut-out animation.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import meta from '../public/gum/meta.json';
import caps from './gumCaps.json';

export const GUM_TOTAL = 42.0;
const W = 1080, H = 1920;
const GROUND = 1400;
const FEET = 1480;
const INK = '#141414';
const TR = 0.5;
// voice: 0-4.37 | 4.87-9.41 | 9.86-14.64 | 15.19-21.19 | 21.74-29.33 | 29.83-35.03 | 35.73-41.08
const BOUNDS = [0, 4.87, 9.86, 15.19, 21.74, 29.83, 35.73, GUM_TOTAL];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

type Item = {s: string; x: number; y?: number; r?: number; h?: number; w?: number; t0?: number; t1?: number; poses?: [number, string, number?][]; rot?: number; enter?: string; flip?: boolean; dx?: number; dy?: number; sway?: number; z?: number};

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
  const dxp = (it.dx ?? 0) * clamp(lt / dur), dyp = (it.dy ?? 0) * clamp(lt / dur);
  let ex = 0, ey = 0, es = 1;
  const eu = clamp(lt / (it.enter === 'pop' ? 0.35 : 0.6));
  if (it.enter === 'pop') { es = eu <= 0 ? 0 : eu >= 1 ? 1 : 1 - Math.pow(1 - eu, 3) * Math.cos(eu * 9) * 0.9; }
  else if (it.enter === 'left') ex = -(1 - eo(eu)) * (it.x + w + 100);
  else if (it.enter === 'right') ex = (1 - eo(eu)) * (W - it.x + w + 100);
  else if (it.enter === 'drop') ey = -(1 - eo(eu)) * 900;
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  const sx = (1 - 0.12 * k) * es, sy = (1 + 0.12 * k) * es;
  const isChar = !!it.r;
  const bob = isChar ? Math.sin(lt * 2.4) * 3 : 0;
  const x = xo + dxp + ex, y = (it.y ?? FEET) + dyp + ey + bob;
  const rot = (it.rot ?? 0) + (it.sway ? Math.sin(lt * 3) * it.sway : 0);
  return (
    <>
      {isChar && <div style={{position: 'absolute', left: x - w * 0.3, top: (it.y ?? FEET) - 16, width: w * 0.6, height: 30, borderRadius: '50%', background: 'rgba(60,30,10,0.25)'}} />}
      <div style={{position: 'absolute', left: x - fx, top: y - h, width: w, height: h, transformOrigin: `${fx}px ${h}px`, transform: `${it.flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx},${sy})`}}>
        <Img src={staticFile(`gum/sp/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

// free-floating prop at an explicit centre with rotation/scale (for flying things)
const Prop: React.FC<{s: string; x: number; y: number; w: number; rot?: number; sc?: number; op?: number; clip?: string}> = ({s, x, y, w, rot = 0, sc = 1, op = 1, clip}) => {
  const m = meta[s]; const h = (m.h / m.w) * w;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: op, transform: `rotate(${rot}deg) scale(${sc})`, clipPath: clip}}><Img src={staticFile(`gum/sp/${s}.png`)} style={{width: '100%', height: '100%'}} /></div>;
};

const Label: React.FC<{text: string; x: number; y: number; t: number; t0: number; size?: number; color?: string; rot?: number; t1?: number}> = ({text, x, y, t, t0, size = 110, color = '#ffd400', rot = 0, t1}) => {
  const lt = t - t0;
  if (lt < 0 || (t1 !== undefined && t > t1)) return null;
  const u = clamp(lt / 0.35);
  const s = 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: size, color, WebkitTextStroke: `${size * 0.13}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', letterSpacing: 2}}>{text}</div>;
};

const Room: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: GROUND + 4, background: 'linear-gradient(#59b9ff, #cdeeff)'}} />
    <div style={{position: 'absolute', left: 0, top: 1060, width: W, height: GROUND - 1060, background: '#a6e0ff'}} />
    <div style={{position: 'absolute', left: 0, top: GROUND - 3, width: W, height: 6, background: INK}} />
    <div style={{position: 'absolute', left: 0, top: GROUND, width: W, height: H - GROUND, background: '#d97b3a'}} />
    <div style={{position: 'absolute', left: 0, top: GROUND + 150, width: W, height: H - GROUND - 150, background: '#c4682c'}} />
  </>
);

// ---------- hook (whole image) ----------
const IW = H * (752 / 1344) * (W / (H * (752 / 1344)));
const HookShot: React.FC<{t: number}> = ({t}) => {
  const u = eio(t / 4.4);
  let z = lerp(1.0, 1.09, u);
  const p = clamp((t - 3.0) / 0.5);
  const punch = t >= 3.0 ? 0.09 * Math.sin(Math.min(1, p) * Math.PI) : 0;
  z += punch;
  const fx = 0.45, fy = 0.12;
  const shake = t > 3.0 && t < 3.4 ? Math.sin(t * 90) * 8 * (1 - (t - 3.0) / 0.4) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#d55a10'}}>
      <Img src={staticFile('gum/img_hook.png')} style={{position: 'absolute', left: shake, top: 0, width: W, height: H, transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${z})`, filter: 'saturate(1.12)'}} />
      <Label text="7 YEARS" x={W / 2} y={1230} t={t} t0={0.15} size={190} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ---------- shot 2: circle the calendar and wait ----------
const Shot2: React.FC<{t: number}> = ({t}) => {
  const circU = clamp((t - 2.1) / 0.7);
  const sitT = 3.6;
  const webU = clamp((t - 4.0) / 0.9);
  const calW = 470, calX = 780, calY = 1010;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Room />
      <Sprite it={{s: 'cal', x: calX, y: calY + 230, w: calW, enter: 'pop', t0: 0.3}} t={t} />
      {/* hand-drawn red circle around day one */}
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
        <circle cx={calX - calW / 2 + calW * 0.2} cy={calY + 20} r={46} fill="none" stroke="#e02020" strokeWidth={12} strokeLinecap="round" strokeDasharray={290} strokeDashoffset={290 * (1 - eo(circU))} transform={`rotate(-90 ${calX - calW / 2 + calW * 0.2} ${calY + 20})`} />
      </svg>
      <Sprite it={{s: 'mr_point', x: 300, r: 112, t0: 0, enter: 'left', t1: sitT}} t={t} />
      <Sprite it={{s: 'sit', x: 300, r: 112, t0: sitT, enter: 'pop'}} t={t} />
      {webU > 0 && <Prop s="web" x={calX + calW / 2 - 60} y={calY - 40} w={190 * (0.3 + 0.7 * eo(webU))} rot={10} />}
      {webU > 0 && <Prop s="web" x={90} y={1150} w={150 * eo(webU)} rot={-15} />}
      <Label text="DAY 1" x={calX} y={calY - 400} t={t} t0={2.9} size={90} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ---------- shot 3: scissors cannot cut gum ----------
const Shot3: React.FC<{t: number}> = ({t}) => {
  // gum hops in from left, bounces off scissors at 1.9, scissors snap at 2.5, white flag at 3.8
  const gu = clamp((t - 0.3) / 1.6);
  let gx = lerp(150, 640, gu), gy = GROUND - 100 - Math.abs(Math.sin(gu * Math.PI * 2)) * 150 * (1 - gu * 0.3);
  let grot = gu * 400;
  if (t > 1.9) { const b = clamp((t - 1.9) / 1.0); gx = 640 - 250 * b; gy = GROUND - 100 - Math.sin(b * Math.PI) * 340; grot = 400 - b * 500; if (b >= 1) { gy = GROUND - 100; } }
  const snap = t > 2.5 ? clamp((t - 2.5) / 0.7) : 0;
  const scW = 330, scX = 800, scY = GROUND - 250;
  const jolt = t > 1.9 && t < 2.3 ? Math.sin(t * 70) * 10 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Room />
      <Sprite it={{s: 'mr_shrug', x: 220, r: 100, t0: 0, enter: 'left', poses: [[2.4, 'mr_worry']]}} t={t} />
      {snap === 0 && <Prop s="scissors" x={scX + jolt} y={scY} w={scW} rot={-6} />}
      {snap > 0 && <>
        <Prop s="scissors" x={scX - 70 * snap} y={scY + 40 * snap} w={scW} rot={-6 - 38 * snap} clip="polygon(0 0, 50% 0, 50% 100%, 0 100%)" />
        <Prop s="scissors" x={scX + 70 * snap} y={scY + 40 * snap} w={scW} rot={-6 + 38 * snap} clip="polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" />
      </>}
      <Prop s="gum" x={gx} y={gy} w={190} rot={grot} sc={t > 1.9 && t < 2.1 ? 0.82 : 1} />
      {t > 3.8 && <Sprite it={{s: 'flag', x: 860, h: 320, y: GROUND + 60, t0: 3.8, enter: 'pop', sway: 5}} t={t} />}
      <Label text="NOPE" x={760} y={GROUND - 640} t={t} t0={2.0} size={130} color="#ff4a2a" rot={-8} t1={3.6} />
    </AbsoluteFill>
  );
};

// ---------- shot 4: conveyor, gum rides with the corn ----------
const Belt: React.FC<{t: number}> = ({t}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: GROUND - 60, width: 820, height: 86, background: '#4a4f5a', border: `6px solid ${INK}`, borderRadius: 12, overflow: 'hidden'}}>
      {Array.from({length: 16}, (_, i) => <div key={i} style={{position: 'absolute', left: ((i * 60 + t * 140) % 960) - 60, top: 0, width: 14, height: 86, background: 'rgba(255,255,255,0.22)'}} />)}
    </div>
    <div style={{position: 'absolute', left: 806, top: GROUND - 46, width: 70, height: 70, borderRadius: '50%', background: '#8b909c', border: `6px solid ${INK}`, transform: `rotate(${t * 300}deg)`}}><div style={{width: 6, height: 52, background: INK, margin: '6px auto'}} /></div>
  </>
);
const Shot4: React.FC<{t: number}> = ({t}) => {
  // x positions travel along the belt then fall off the end at x=830
  const item = (s: string, w: number, t0: number, speed: number, rotv: number) => {
    const lt = t - t0; if (lt < 0) return null;
    let x = -80 + lt * speed, y = GROUND - 60 - w * 0.3 - Math.abs(Math.sin(lt * 5)) * 6, rot = lt * 20 * rotv;
    if (x > 830) { const f = (x - 830) / speed; x = 830 + f * speed * 0.8; y += 0.5 * 2600 * f * f; rot += f * 300; }
    if (y > H + 100) return null;
    return <Prop s={s} x={x} y={y} w={w} rot={rot} />;
  };
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Room />
      <Belt t={t} />
      {item('gum', 150, 0.5, 190, 1)}
      {item('corn', 100, 1.6, 190, 1)}
      {item('popcorn', 140, 2.7, 190, 1)}
      <Sprite it={{s: 'mr_deadpan', x: 920, r: 100, t0: 0, enter: 'right', poses: [[4.6, 'mr_cheer']]}} t={t} />
      <Label text="BYE" x={640} y={GROUND - 640} t={t} t0={4.7} size={120} color="#ffffff" rot={6} />
    </AbsoluteFill>
  );
};

// ---------- shot 5: day 3, doctor, gone ----------
const Shot5: React.FC<{t: number}> = ({t}) => {
  const day = t < 0.7 ? 1 : t < 1.4 ? 2 : 3;
  const flip = (t0: number) => clamp((t - t0) / 0.3);
  const bubbleU = clamp((t - 3.1) / 0.5);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Room />
      <Sprite it={{s: 'cal', x: 830, y: 700, w: 330, enter: 'pop', t0: 0.0}} t={t} />
      <Label text={`DAY ${day}`} x={830} y={530} t={t} t0={0.0} size={80} color="#ffffff" />
      <Label text="GONE" x={400} y={500} t={t} t0={1.8} t1={3.1} size={210} color="#ffffff" rot={-4} />
      <Sprite it={{s: 'mr_deadpan', x: 270, r: 100, t0: 0, enter: 'left', poses: [[5.2, 'mr_shrug']]}} t={t} />
      {bubbleU > 0 && (
        <div style={{position: 'absolute', left: 400 - 170 * bubbleU, top: 560 - 170 * bubbleU, width: 340 * bubbleU, height: 340 * bubbleU, borderRadius: '50%', background: '#ffd3d3', border: `10px solid ${INK}`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: '18%', top: '24%', width: '64%', height: '52%', borderRadius: '50% 45% 55% 50%', background: '#ff9aa8', border: `8px solid ${INK}`}} />
        </div>
      )}
      <Sprite it={{s: 'doc', x: 830, h: 700, t0: 2.7, enter: 'right'}} t={t} />
      {t > 5.0 && <Label text="?" x={640} y={700} t={t} t0={5.0} size={170} color="#ffffff" />}
    </AbsoluteFill>
  );
};

// ---------- shot 6: kids + lots of gum vs one piece ----------
const Shot6: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Room />
    <Sprite it={{s: 'kid', x: 400, h: 680, t0: 1.2, enter: 'left'}} t={t} />
    {/* warning sign */}
    {t > 0.6 && (
      <div style={{position: 'absolute', left: 570, top: 300, width: 300, transform: `scale(${1 - Math.pow(1 - clamp((t - 0.6) / 0.4), 3) * Math.cos(clamp((t - 0.6) / 0.4) * 9) * 0.9})`}}>
        <div style={{margin: '0 auto', width: 20, height: 830, background: '#6b4a2a', border: `5px solid ${INK}`, position: 'absolute', left: 140, top: 250}} />
        <div style={{position: 'relative', width: 300, padding: '22px 10px', background: '#ff4a2a', border: `10px solid ${INK}`, borderRadius: 16, textAlign: 'center', fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 74, lineHeight: 1.0, color: '#fff', WebkitTextStroke: `7px ${INK}`, paintOrder: 'stroke fill'}}>LOTS,<br />OVER<br />TIME</div>
      </div>
    )}
    <Sprite it={{s: 'mr_point', x: 930, r: 96, t0: 2.2, enter: 'right', poses: [[3.2, 'mr_shrug']]}} t={t} />
    {t > 2.9 && <Prop s="gum" x={800} y={GROUND + 55} w={90} rot={-10} sc={1 - Math.pow(1 - clamp((t - 2.9) / 0.35), 3) * Math.cos(clamp((t - 2.9) / 0.35) * 9) * 0.9} />}
    {t > 3.3 && <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}><path d={`M745,${GROUND - 90} l36,40 l70,-80`} stroke="#22c55e" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" style={{filter: `drop-shadow(0 0 0 ${INK})`}} strokeDasharray={200} strokeDashoffset={200 * (1 - eo((t - 3.3) / 0.4))} /></svg>}
  </AbsoluteFill>
);

// ---------- shot 7: tear calendar, new piece, loop ----------
const Shot7: React.FC<{t: number}> = ({t}) => {
  const tear = clamp((t - 2.2) / 0.8);
  const gu = clamp((t - 4.3) / 0.7);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Room />
      {t < 3.0 && <Sprite it={{s: 'cal', x: 800, y: 1250, w: 470, t0: 0, sway: 0}} t={t} />}
      {t >= 2.2 && tear < 1 && <Prop s="cal" x={800 + tear * -300} y={1020 + tear * 700} w={470} rot={-tear * 140} op={1 - tear * 0.6} />}
      <Sprite it={{s: 'mr_shrug', x: 330, r: 112, t0: 0, enter: 'pop', poses: [[2.0, 'mr_point'], [4.9, 'mr_cheer']]}} t={t} />
      {t > 4.3 && gu < 1 && <Prop s="gum" x={lerp(700, 330, gu)} y={lerp(1330, 1060, gu) - Math.sin(gu * Math.PI) * 300} w={110} rot={gu * 540} />}
    </AbsoluteFill>
  );
};

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

const SFX: [number, string, number][] = [
  [0.05, 'boing', 0.5], [1.0, 'pop', 0.5], [3.0, 'thud', 1.0], [3.0, 'whoosh', 0.6],
  [4.87, 'whoosh', 0.5], [5.2, 'pop', 0.5], [6.95, 'pop', 0.5], [8.5, 'thud', 0.5],
  [9.86, 'whoosh', 0.5], [11.8, 'thud', 0.9], [12.5, 'clink', 0.9], [13.7, 'pop', 0.6],
  [15.19, 'whoosh', 0.5], [16.7, 'pop', 0.4], [17.8, 'pop', 0.4], [18.9, 'pop', 0.4], [19.6, 'boing', 0.5], [19.9, 'pop', 0.5],
  [21.74, 'whoosh', 0.5], [22.4, 'pop', 0.4], [23.1, 'pop', 0.4], [23.5, 'thud', 0.8], [24.5, 'whoosh', 0.4], [25.3, 'pop', 0.5], [27.8, 'boing', 0.4],
  [29.83, 'whoosh', 0.5], [30.4, 'pop', 0.5], [31.0, 'thud', 0.5], [32.9, 'pop', 0.6], [33.4, 'clink', 0.6],
  [35.73, 'whoosh', 0.5], [37.9, 'whoosh', 0.6], [38.4, 'thud', 0.5], [40.3, 'pop', 0.7], [41.2, 'boing', 0.4],
  [41.45, 'whoosh', 0.6],
];

export const GumShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const loopS = GUM_TOTAL - TR;
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
      <Audio src={staticFile('gum/voice.wav')} volume={1.0} />
      <Audio src={staticFile('gum/music.mp3')} volume={(f) => {
        const t = f / fps;
        const voiced = caps.some((c: any) => t >= c.start - 0.1 && t < c.end);
        return 0.22 * (voiced ? 0.55 : 1) * Math.min(1, t / 0.5) * Math.min(1, (GUM_TOTAL - t) / 1.2);
      }} />
      {SFX.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.round(t0 * fps)} durationInFrames={Math.round(2.6 * fps)}>
          <Audio src={staticFile(`gum/${name}.wav`)} volume={vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
