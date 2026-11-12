// @ts-nocheck
// Funnel Short (9:16) for medieval-privacy: illustrated shots, blurred fill, word-synced captions.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import tl from './mpsTimeline.json';

export const SHORT_TOTAL = tl.total;
const W = 1080, H = 1920;
const INK = '#141414';
const IMG_H = 1400, IMG_W = IMG_H * 1344 / 752; // ~1894
const CY = 880;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

const Shot: React.FC<{img: string; f0: number; f1: number; t: number; t0: number; t1: number; punch?: boolean}> = ({img, f0, f1, t, t0, t1, punch}) => {
  const u = clamp((t - t0) / Math.max(0.1, t1 - t0));
  const fx = lerp(f0, f1, Easing.inOut(Easing.ease)(u));
  const z = lerp(1.0, 1.04, u) * (punch ? 1 + 0.05 * Math.exp(-(t - t0) * 9) : 1);
  const left = W / 2 - fx * IMG_W * z;
  const src = staticFile(`mp/img_${img}.png`);
  return (
    <AbsoluteFill>
      <Img src={src} style={{position: 'absolute', left: -300, top: -100, width: 1680 + 0, height: 2120, objectFit: 'cover', filter: 'blur(38px) brightness(0.75) saturate(1.2)'}} />
      <div style={{position: 'absolute', left: 0, top: CY - IMG_H / 2, width: W, height: IMG_H, overflow: 'hidden', boxShadow: '0 0 60px rgba(0,0,0,0.6)'}}>
        <Img src={src} style={{position: 'absolute', left, top: -(IMG_H * z - IMG_H) / 2, width: IMG_W * z, height: IMG_H * z, filter: 'saturate(1.25)'}} />
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC<{t: number}> = ({t}) => {
  const c = tl.chunks.find((c, i) => t >= c.start - 0.02 && t < Math.max(c.end + 0.25, c.start + 0.7) && !(tl.chunks[i + 1] && t >= tl.chunks[i + 1].start - 0.02));
  if (!c) return null;
  const n = c.words.length;
  const longest = c.words.reduce((a, w) => a + w.text.length, 0) + n;
  const fs = Math.min(104, Math.floor(920 / (longest * 0.5)));
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 1330, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'nowrap', fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: fs, letterSpacing: 2}}>
      {c.words.map((w, i) => (
        <span key={i} style={{color: t >= w.start && t < w.end + 0.02 ? '#ffd400' : '#fff', WebkitTextStroke: `14px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>
      ))}
    </div>
  );
};

export const MpShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  // active shot (image switch by split overrides)
  const idx = tl.shots.findIndex((s, i) => t >= s.t0 && (s.t1 === null || t < s.t1));
  const s = tl.shots[Math.max(0, idx)];
  let img = s.img, f0 = s.f0, f1 = s.f1, t0 = s.t0, t1 = s.t1 ?? tl.total;
  for (const sp of tl.splits) {
    if (sp.clip === s.clip) {
      if (t >= sp.t) { img = sp.img; f0 = sp.f0; f1 = sp.f1; t0 = sp.t; }
      else t1 = sp.t;
    }
  }
  const fadeIn = clamp(t / 0.001); // first frame fully visible
  const endStart = tl.total - 2.0;
  const card = clamp((t - endStart) / 0.5);
  const fade = t > tl.total - 0.4 ? clamp((tl.total - t) / 0.4) : 1;
  return (
    <AbsoluteFill style={{background: '#000', opacity: fade}}>
      <Shot img={img} f0={f0} f1={f1} t={t} t0={t0} t1={t1} punch={t0 > 0 && !(s.clip === 36)} />
      <AbsoluteFill style={{background: `rgba(0,0,0,${0.55 * card})`}} />
      {card < 1 && <div style={{opacity: 1 - card}}><Captions t={t} /></div>}
      {card > 0 && (
        <div style={{position: 'absolute', left: 60, right: 60, top: 1330, textAlign: 'center', opacity: card, fontFamily: 'Impact, "Arial Black", sans-serif', fontSize: 92, color: '#ffd400', WebkitTextStroke: `14px ${INK}`, paintOrder: 'stroke fill', letterSpacing: 2}}>FULL STORY ON THE CHANNEL</div>
      )}
    </AbsoluteFill>
  );
};
