// "POV: Your Boss Laughed at Your Idea" long-form (16:9), v3: Joe's ChatGPT script word for word.
// Whole bright illustrations (one per row), several camera shots per row from crops/pushes of the SAME image,
// short crossfades (NO white/colour flash, Joe 2026-11-14), captions are the only on-screen text.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import tl from './boss2Timeline.json';
import rows from './boss2Rows.json';

export const BOSS2_TOTAL = tl.total;
const W = 1920, H = 1080;
const INK = '#141414';
const IMPACT = 'Impact, "Arial Black", sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const eio = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
const SG: any[] = tl.segs as any[];
const N = SG.length;
const BND = (i: number) => (i <= 0 ? 0 : i >= N ? tl.total : (SG[i - 1].end + SG[i].start) / 2);

// ---- shots: every row split into ~3.6 s shots; variant cycles wide-push, left crop, right crop, centre crop pull-out
type Shot = {row: number; img: string; a: number; b: number; v: number};
const VARS = [
  {z0: 1.0, z1: 1.1, ox: 50, oy: 50},     // wide, slow push
  {z0: 1.32, z1: 1.4, ox: 28, oy: 45},    // closer on the left
  {z0: 1.32, z1: 1.4, ox: 72, oy: 45},    // closer on the right
  {z0: 1.3, z1: 1.04, ox: 50, oy: 40},    // pull out from the centre
];
const SHOTS: Shot[] = (() => {
  const out: Shot[] = [];
  rows.forEach((img: string, i: number) => {
    const a = BND(i), b = BND(i + 1), n = Math.max(1, Math.round((b - a) / 3.6));
    for (let k = 0; k < n; k++) out.push({row: i + 1, img, a: a + ((b - a) * k) / n, b: a + ((b - a) * (k + 1)) / n, v: k === 0 ? 0 : 1 + ((i + k) % 3)});
  });
  // a shot must never reuse the exact same variant as the previous shot of the same image
  for (let i = 1; i < out.length; i++) if (out[i].img === out[i - 1].img && out[i].v === out[i - 1].v) out[i].v = (out[i].v + 1) % 4;
  return out;
})();

const ShotView: React.FC<{s: Shot; t: number; op?: number}> = ({s, t, op = 1}) => {
  const V = VARS[s.v];
  const u = clamp((t - s.a) / (s.b - s.a));
  const z = lerp(V.z0, V.z1, eio(u));
  const dx = (s.v === 1 ? 1 : s.v === 2 ? -1 : 0) * u * 30;
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: op}}>
      <Img src={staticFile(`boss2/img_${s.img}.png`)} style={{width: W, height: H, objectFit: 'cover', transformOrigin: `${V.ox}% ${V.oy}%`, transform: `translateX(${dx}px) scale(${z})`}} />
    </AbsoluteFill>
  );
};

// ---------- captions (same style as the money video) ----------
const CHUNKS: any[] = (() => {
  const out: any[] = [];
  SG.forEach((s) => {
    const ws = s.words; let cur: any[] = [];
    const flush = () => { if (cur.length) { out.push({words: cur, start: cur[0].start}); cur = []; } };
    ws.forEach((w: any, i: number) => {
      cur.push(w);
      const len = cur.map((q) => q.text).join(' ').length;
      const nextLen = i + 1 < ws.length ? len + 1 + ws[i + 1].text.length : 99;
      if ((len >= 20 && nextLen > 28) || len >= 30 || (/[.?!:]$/.test(w.text) && len >= 4)) flush();
    });
    flush();
  });
  out.forEach((c, i) => { const nx = out[i + 1]; c.end = Math.min(nx ? nx.start : tl.total, c.words[c.words.length - 1].end + 0.5); if (nx && c.end > nx.start) c.end = nx.start; });
  return out;
})();
const Captions: React.FC<{t: number}> = ({t}) => {
  const c = CHUNKS.find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 62}}>
      <div style={{display: 'flex', gap: 16, flexWrap: 'nowrap', justifyContent: 'center', maxWidth: 1760, fontFamily: IMPACT, fontSize: 70, letterSpacing: 2, lineHeight: 1.05}}>
        {c.words.map((w: any, i: number) => (
          <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text.toUpperCase()}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Boss2LF: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let k = 0;
  for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].a) k = i;
  const cur = SHOTS[k], prev = k > 0 ? SHOTS[k - 1] : null;
  const fade = clamp((t - cur.a) / 0.14);
  // fade the whole picture in from black at the very start and out at the very end
  const edge = clamp(t / 0.6) * clamp((tl.total - t) / 1.2);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: edge}}>
        {prev && fade < 1 ? <ShotView s={prev} t={t} /> : null}
        <ShotView s={cur} t={t} op={prev ? fade : 1} />
      </AbsoluteFill>
      <Captions t={t} />
    </AbsoluteFill>
  );
};
