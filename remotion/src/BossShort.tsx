// @ts-nocheck
// "When your boss says 'Can we talk?'" vertical Short: whole illustrated hook/peak/end images + cut-out animation.
import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import words from './bossWords.json';

export const BOSS_TOTAL = 28.75;
const W = 1080, H = 1920;
const INK = '#141414';
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const pop = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9);

// shot bounds (voice): hook 0-9.0, emails 9.0-14.8, sit 14.8-22.6, peak 22.6-25.7, end 25.7-TOTAL
const B = [0, 9.0, 14.8, 22.6, 25.7, BOSS_TOTAL];
const PEAK_T = 23.55; // "soul"
const DOOR = [3.7, 4.55, 6.4, 7.95]; // slam on "door", then Closes / The / Door

const Label: React.FC<{text: string; x: number; y: number; t: number; t0: number; size?: number; color?: string; rot?: number}> = ({text, x, y, t, t0, size = 96, color = '#ffd400', rot = 0}) => {
  const lt = t - t0;
  if (lt < 0) return null;
  const s = pop(lt / 0.35);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: size, color, WebkitTextStroke: `${size * 0.14}px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap', letterSpacing: 2}}>{text}</div>;
};

const Whole: React.FC<{src: string; z: number; cx: number; cy: number; shake?: number; t?: number}> = ({src, z, cx, cy, shake = 0, t = 0}) => {
  // crop with objectViewBox (never scale a huge element); cx,cy = focus in image fractions, shown at screen centre
  const vw = 1 / z, vh = 1 / z;
  const l = clamp(cx - vw / 2, 0, 1 - vw), tp = clamp(cy - vh / 2, 0, 1 - vh);
  const pc = (v: number) => `${(v * 100).toFixed(4)}%`;
  const sx = shake ? Math.sin(t * 90) * shake : 0, sy = shake ? Math.cos(t * 70) * shake : 0;
  return <Img src={staticFile(src)} style={{position: 'absolute', left: sx, top: sy, width: W, height: H, objectViewBox: `inset(${pc(tp)} ${pc(1 - l - vw)} ${pc(1 - tp - vh)} ${pc(l)})`}} />;
};
// image fraction -> screen for the same crop
const toScr = (px: number, py: number, z: number, cx: number, cy: number) => {
  const vw = 1 / z, l = clamp(cx - vw / 2, 0, 1 - vw), tp = clamp(cy - vw / 2, 0, 1 - vw);
  return [(px - l) * z * W, (py - tp) * z * H];
};

const Hook: React.FC<{t: number}> = ({t}) => {
  let z = lerp(1.28, 1.2, eio(t / 3.4));
  let cx = 0.5, cy = lerp(0.27, 0.3, eio(t / 3.4));
  if (t > 3.4) { z = lerp(1.2, 1.42, eio((t - 3.4) / 5.6)); cy = lerp(0.3, 0.27, eio((t - 3.4) / 5.6)); }
  // slam punches on the door
  let kick = 0;
  for (const d of DOOR) { const u = t - d; if (u >= 0 && u < 0.4) kick = Math.max(kick, Math.exp(-u * 9) * 0.10); }
  z *= 1 + kick;
  const [mx, my] = toScr(0.33, 0.255, z, cx, cy);
  const [bx, by] = toScr(0.66, 0.08, z, cx, cy);
  const shk = kick > 0.02 ? 6 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#222'}}>
      <Whole src="boss/whole_hook.png" z={z} cx={cx} cy={cy} shake={shk} t={t} />
      <Label text="YOU" x={mx} y={my - 150 * z / 1.3} t={t} t0={0} size={100} color="#ffffff" />
      <Label text="BOSS" x={Math.min(bx, W - 200)} y={Math.max(by - 40, 200)} t={t} t0={0.15} size={100} color="#ff4a3a" />
    </AbsoluteFill>
  );
};

const Office: React.FC = () => (
  <>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#cfe7ff, #e9f3ff 60%)'}} />
    <div style={{position: 'absolute', left: 120, top: 180, width: 840, height: 560, background: 'linear-gradient(#5db8ff,#b9e6ff)', border: `10px solid ${INK}`, borderRadius: 8}} />
    <div style={{position: 'absolute', left: 536, top: 180, width: 10, height: 560, background: INK}} />
    <div style={{position: 'absolute', left: 0, top: 1210, width: W, height: H - 1210, background: '#7d6a58'}} />
    <div style={{position: 'absolute', left: 0, top: 1206, width: W, height: 8, background: INK}} />
  </>
);

const Emails: React.FC<{t: number}> = ({t}) => {
  const N = 34;
  const mails = Array.from({length: N}, (_, i) => {
    const t0 = 0.2 + i * 0.12, u = (t - t0) / 1.4;
    const col = i % 6; const x = 90 + col * 180 + ((i * 53) % 60);
    if (u < 0) return null;
    const restY = 1100 + ((i * 37) % 120) - Math.floor(i / 6) * 26; // pile on floor
    const y = Math.min(restY, -200 + u * u * 1800 + u * 200);
    const falling = y < restY;
    return <Img key={i} src={staticFile('boss/sp/email.png')} style={{position: 'absolute', left: x - 100, top: y, width: 200, transform: `rotate(${((i * 47) % 50) - 25 + (falling ? u * 40 : 0)}deg)`}} />;
  });
  return <>{mails}</>;
};

const EmailShot: React.FC<{t: number}> = ({t}) => {
  const k = t < 0.5 ? Math.exp(-t * 8) * Math.cos(t * 26) : 0;
  const cnt = Math.min(9999, Math.round(Math.pow(clamp(t / 4.5), 2) * 9999));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Office />
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: 'rgba(20,20,60,0.25)'}} />
      <Emails t={t} />
      <div style={{position: 'absolute', left: W / 2 - 195 * (1 - 0.12 * k), top: 1230 - 800 * (1 + 0.12 * k), width: 390 * (1 - 0.12 * k), height: 800 * (1 + 0.12 * k), transformOrigin: 'bottom'}}>
        <Img src={staticFile('boss/sp/mr_worry.png')} style={{width: '100%', height: '100%'}} />
      </div>
      <Label text={`${cnt.toLocaleString('en-US')} UNREAD`} x={W / 2} y={210} t={t} t0={0.3} size={92} color="#ff4a3a" />
    </AbsoluteFill>
  );
};

const SitShot: React.FC<{t: number}> = ({t}) => {
  const hh = 880;
  const bm = 'boss/sp/bosssit.png', mm = 'boss/sp/mrsit.png';
  const bw = 589 / 1070 * hh, mw = 468 / 1033 * hh;
  const floor = 1235;
  const enterB = 1 - eo(t / 0.7), enterM = 1 - eo((t - 1.0) / 0.7);
  const bobB = t > 3.9 ? Math.sin((t - 3.9) * 5) * 4 : 0;
  const sigh = t > 3.9 ? 1 : 0;
  const flick = t > 1.5 ? (Math.sin(t * 40) > 0.5 || Math.sin(t * 13) > 0.85 ? 0.35 : 1) : 1;
  const zoom = lerp(1, 1.12, eio((t - 4.3) / 3));
  const shake = t > 4.3 ? Math.sin(t * 60) * 2 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom}) translateX(${shake}px)`, transformOrigin: '65% 60%'}}>
        <Office />
        {/* desk + lamp */}
        <div style={{position: 'absolute', left: 400, top: 1040, width: 290, height: 190, background: '#5a3b24', border: `6px solid ${INK}`, borderRadius: 6}} />
        <div style={{position: 'absolute', left: 520, top: 790, width: 14, height: 250, background: INK, transform: 'rotate(-8deg)', transformOrigin: 'bottom'}} />
        <div style={{position: 'absolute', left: 470, top: 740, width: 120, height: 70, background: '#ff6a2a', border: `6px solid ${INK}`, borderRadius: '60px 60px 10px 10px', transform: 'rotate(-12deg)'}} />
        <div style={{position: 'absolute', left: 330, top: 800, width: 330, height: 280, background: `radial-gradient(ellipse at 50% 0%, rgba(255,200,120,${0.5 * flick}), rgba(255,200,120,0))`}} />
        <div style={{position: 'absolute', left: 290 - bw / 2 - enterB * 600, top: floor - hh + bobB, width: bw, height: hh}}>
          <Img src={staticFile(bm)} style={{width: '100%', height: '100%'}} />
        </div>
        <div style={{position: 'absolute', left: 800 - mw / 2 + enterM * 600, top: floor - hh, width: mw, height: hh}}>
          <Img src={staticFile(mm)} style={{width: '100%', height: '100%'}} />
        </div>
        <Label text="BOSS" x={290} y={floor - hh - 30} t={t} t0={0.8} size={90} color="#ff4a3a" />
        <Label text="YOU" x={800} y={floor - hh - 20} t={t} t0={1.5} size={90} color="#ffffff" />
      </div>
    </AbsoluteFill>
  );
};

const PeakShot: React.FC<{t: number; abs: number}> = ({t, abs}) => {
  const u = abs - PEAK_T;
  let z = lerp(1.02, 1.1, clamp(t / 3));
  let flash = 0, shk = 0;
  if (u >= 0) { z = 1.1 + 0.28 * Math.exp(-u * 3) + 0.04 * clamp(u / 2); flash = Math.exp(-u * 14); shk = u < 0.9 ? 9 : 3; }
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Whole src="boss/whole_peak.png" z={z} cx={0.5} cy={u >= 0 ? 0.45 : 0.55} shake={shk} t={abs} />
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash * 0.8}} />
    </AbsoluteFill>
  );
};

const EndShot: React.FC<{t: number}> = ({t}) => {
  const z = lerp(1.0, 1.08, clamp(t / 3));
  const [mx, my] = toScr(0.73, 0.40, z, 0.5, 0.5);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Whole src="boss/whole_end.png" z={z} cx={0.5} cy={0.5} />
      <Label text="BOSS" x={W * 0.27} y={250} t={t} t0={0.15} size={90} color="#ff4a3a" />
      <Label text="YOU" x={W * 0.78} y={520} t={t} t0={0.3} size={90} color="#ffffff" />
    </AbsoluteFill>
  );
};

const CAPY: number[] = [0.62, 0.72, 0.70, 0.40, 0.62];
const Captions: React.FC<{t: number}> = ({t}) => {
  // chunks of <=3 words, broken after punctuation
  const chunks: any[] = [];
  for (const s of words as any[]) {
    let cur: any[] = [];
    s.words.forEach((w: any, i: number) => {
      cur.push(w);
      if (cur.length >= 3 || /[.?,]["”]?$/.test(w.text) || i === s.words.length - 1) { chunks.push({start: cur[0].start, end: Math.max(cur[cur.length - 1].end, cur[0].start + 0.5), words: cur}); cur = []; }
    });
  }
  // hold each chunk until the next starts (max 0.8 s past its end)
  chunks.forEach((c, i) => { const n = chunks[i + 1]; c.end = n ? Math.min(Math.max(c.end, c.start + 0.5) + 0.8, n.start) : c.end + 0.2; });
  const c = chunks.find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  const si = B.findIndex((b, i) => t >= b && t < B[i + 1]);
  const yy = CAPY[Math.max(0, si)] * H;
  return (
    <div style={{position: 'absolute', left: 40, width: W - 80, top: yy, transform: 'translateY(-50%)', display: 'flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center', fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 100, letterSpacing: 2, lineHeight: 1.05}}>
      {c.words.map((w: any, i: number) => {
        const shown = t >= w.start - 0.02;
        const s = shown ? Math.max(0.0, pop((t - w.start) / 0.25)) : 0;
        return <span key={i} style={{display: 'inline-block', transform: `scale(${shown ? Math.max(s, 0.01) : 0})`, color: t >= w.start && t < w.end + 0.05 ? '#ffd400' : '#fff', WebkitTextStroke: `14px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>;
      })}
    </div>
  );
};

const ShotView: React.FC<{i: number; t: number; abs: number}> = ({i, t, abs}) => {
  if (i === 0) return <Hook t={t} />;
  if (i === 1) return <EmailShot t={t} />;
  if (i === 2) return <SitShot t={t} />;
  if (i === 3) return <PeakShot t={t} abs={abs} />;
  return <EndShot t={t} />;
};

export const BossShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const si = B.slice(0, -1).findIndex((b, i) => T >= b && T < B[i + 1]);
  const i = Math.max(0, si);
  // hard cuts everywhere (cringe format); the email shot enters on a whip
  const t = T - B[i];
  const whip = i === 1 && t < 0.25 ? (1 - eo(t / 0.25)) * W : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `translateX(${whip}px)`}}><ShotView i={i} t={t} abs={T} /></AbsoluteFill>
      <Captions t={T} />
    </AbsoluteFill>
  );
};
