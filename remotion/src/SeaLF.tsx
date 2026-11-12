// @ts-nocheck
// "Why Can't We Just DRINK Seawater?" long-form (16:9, 1920x1080): cut-out animation mixed with whole illustrated images (style v4).
// Visual only. Audio (voice, music, sfx) is mixed separately with ffmpeg (scripts/long-form/mix_sealf.py) and muxed afterwards.
import React from 'react';
import {AbsoluteFill, Img, staticFile, Easing} from 'remotion';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import tl from './sealfTimeline.json';
import meta from './sealfMeta.json';

export const SEALF_TOTAL = tl.total;
const W = 1920, H = 1080;
const INK = '#141414';
const IMPACT = 'Impact, "Arial Black", sans-serif';
const TR = 0.42;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const SG = tl.segs;
const N = SG.length;
const S0 = (r: number) => SG[r - 1].start;
const S1 = (r: number) => SG[r - 1].end;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9%~]/g, '');
const wd = (r: number, key: string, occ = 0) => {
  const k = norm(key); let c = 0;
  for (const w of SG[r - 1].words) if (norm(w.text).startsWith(k)) { if (c === occ) return w.start; c++; }
  throw new Error(`word ${key} not in row ${r}`);
};
// shot window of row r: [B(r-1), B(r)] with boundaries in the middle of the voice gaps
const BND = (i: number) => (i <= 0 ? 0 : i >= N ? tl.total : (SG[i - 1].end + SG[i].start) / 2);
const GRI = 835; // feet line on the island
const GR = 860; // feet line on beach / dock / chart floor

// ---------- sprite ----------
const Sp: React.FC<any> = ({s, x, y, r, h, w, t, t0 = 0, t1 = 1e9, flip, enter, poses, rot = 0, sxs = 1, sys = 1, op = 1, shadow, filter, ox = 0, oy = 0, noidle, pivot}) => {
  if (t < t0 || t > t1) return null;
  let name = s, swapT = -9;
  if (poses) for (const [pt, pn] of poses) if (t >= pt) { name = pn; swapT = pt; }
  const m = meta[name];
  const isM = name.startsWith('m_') || name.startsWith('mr_');
  const sc = r ? r / m.head[2] : h ? h / m.h : w ? w / m.w : 1;
  const bw = m.w * sc, bh = m.h * sc;
  const fx = (isM ? m.feet[0] : m.w / 2) * sc;
  const lt = t - t0;
  let es = 1, ex = 0, ey = 0, sx = 1, sy = 1;
  if (enter === 'pop') { const u = clamp(lt / 0.35); es = u >= 1 ? 1 : u <= 0 ? 0 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9; }
  else if (enter === 'left') ex = -(1 - eo(lt / 0.6)) * (x + bw + 100);
  else if (enter === 'right') ex = (1 - eo(lt / 0.7)) * (W - x + bw + 100);
  else if (enter === 'drop') { ey = -(1 - eo(lt / 0.45)) * 1100; if (lt > 0.45) { const q = lt - 0.45; const k = Math.exp(-q * 9) * Math.cos(q * 24); sx = 1 + 0.16 * k; sy = 1 - 0.16 * k; } }
  else if (enter === 'rise') { ey = (1 - eo(lt / 0.9)) * (bh + 80); }
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  sx *= (1 - 0.12 * k); sy *= (1 + 0.12 * k);
  const idle = isM && !noidle ? Math.sin(t * 2.2 + x * 0.01) * 3 : 0;
  const px = x + ex + ox, py = y + ey + oy + idle;
  return (
    <>
      {(shadow ?? isM) && es > 0.3 && <div style={{position: 'absolute', left: px - bw * 0.3, top: y - 14, width: bw * 0.6, height: 28, borderRadius: '50%', background: 'rgba(40,20,10,0.28)', opacity: op}} />}
      <div style={{position: 'absolute', left: px - fx, top: py - bh, width: bw, height: bh, opacity: op, transformOrigin: pivot !== undefined ? `${bw / 2}px ${bh * pivot}px` : `${fx}px ${bh}px`, transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx * es * sxs},${sy * es * sys})`, filter}}>
        <Img src={staticFile(`sealf/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};
// where is the head centre / hand of a mascot sprite placed with Sp (same maths)
const anch = (name: string, x: number, y: number, r: number) => {
  const m = meta[name]; const sc = r / m.head[2];
  const left = x - m.feet[0] * sc, top = y - m.h * sc;
  return {hx: left + m.head[0] * sc, hy: top + m.head[1] * sc, ax: left + m.hand[0] * sc, ay: top + m.hand[1] * sc};
};

const Txt: React.FC<any> = ({children, size = 110, color = '#fff', stroke = 14, style}) => (
  <span style={{fontFamily: IMPACT, fontSize: size, color, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: 'stroke fill', letterSpacing: 2, whiteSpace: 'nowrap', ...style}}>{children}</span>
);
const Pop: React.FC<any> = ({t, t0, children, x, y, rot = 0, dur = 0.3}) => {
  const lt = t - t0; if (lt < 0) return null;
  const u = clamp(lt / dur); const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${es})`}}>{children}</div>;
};
const Num: React.FC<any> = ({t, t0, x, y, children, size = 190, color = '#fff', rot = -4}) => (
  <Pop t={t} t0={t0} x={x} y={y} rot={rot}><Txt size={size} stroke={22} color={color}>{children}</Txt></Pop>
);

// ---------- backgrounds ----------
const Waves: React.FC<any> = ({t, y0, y1, c0 = '#19b6e8', c1 = '#0a6fb8', n = 7, x0 = 0}) => (
  <>
    <div style={{position: 'absolute', left: x0, top: y0, width: W - x0, height: y1 - y0, background: `linear-gradient(${c0},${c1})`}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      {Array.from({length: n}, (_, i) => {
        const y = y0 + 24 + i * ((y1 - y0 - 30) / n) + 6;
        const ph = t * (0.8 + (i % 3) * 0.3) * (i % 2 ? 1 : -1) + i;
        let d = `M${x0 - 40},${y}`;
        for (let x = x0 - 40; x <= W + 40; x += 40) d += ` L${x},${y + Math.sin(x * 0.012 + ph * 2) * (5 + i * 1.5)}`;
        return <path key={i} d={d} stroke="rgba(255,255,255,0.5)" strokeWidth={5} fill="none" strokeLinecap="round" />;
      })}
    </svg>
  </>
);
const SkyDay: React.FC<any> = ({y1 = 600}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: y1 + 4, background: 'linear-gradient(#2ea8ff,#c9efff)'}} />
    <div style={{position: 'absolute', left: 140, top: 60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(#fff6c8 0%, #ffe27a 35%, rgba(255,226,122,0) 70%)'}} />
  </>
);
const SkyDusk: React.FC<any> = ({y1 = 600}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: y1 + 4, background: 'linear-gradient(#5b3a9a,#ff5c39 62%,#ffb36b)'}} />
    <div style={{position: 'absolute', left: 1180, top: y1 - 250, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(#fff0b0 0%, #ff9a4a 40%, rgba(255,140,60,0) 70%)'}} />
  </>
);
const BgIsland: React.FC<any> = ({t}) => (
  <>
    <SkyDay y1={600} />
    <Waves t={t} y0={600} y1={H} />
    <div style={{position: 'absolute', left: 0, top: 597, width: W, height: 6, background: INK, opacity: 0.4}} />
    <Sp s="island" x={1060} y={985} w={1120} t={t} shadow={false} />
  </>
);
const BgBeach: React.FC<any> = ({t, dusk}) => (
  <>
    {dusk ? <SkyDusk y1={620} /> : <SkyDay y1={620} />}
    <Waves t={t} y0={620} y1={780} n={4} c0={dusk ? '#2a8fd0' : '#19b6e8'} c1={dusk ? '#14507f' : '#0a6fb8'} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      <path d={`M0,790 Q480,745 960,788 T1920,770 L1920,${H} L0,${H} Z`} fill={dusk ? '#f0a64a' : '#f2c36b'} stroke={INK} strokeWidth={6} />
      <path d={`M0,782 Q480,737 960,780 T1920,762`} fill="none" stroke="#fff" strokeWidth={14} opacity={0.85} strokeLinecap="round" />
      {Array.from({length: 22}, (_, i) => { const x = 40 + i * 88 + (i * 37) % 31, y = 930 + (i * 53) % 120, hh = 22 + (i * 29) % 16; return <path key={i} d={`M${x},${y} l-8,${-hh} M${x},${y} l1,${-hh - 8} M${x},${y} l9,${-hh}`} stroke="#a8561c" strokeWidth={6} strokeLinecap="round" fill="none" />; })}
    </svg>
  </>
);
const BgDock: React.FC<any> = ({t}) => (
  <>
    <SkyDusk y1={560} />
    <Waves t={t} y0={560} y1={H} c0="#2a8fd0" c1="#14507f" />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      <rect x="640" y="790" width="1300" height="300" fill="#8a5a2b" stroke={INK} strokeWidth={6} />
      {Array.from({length: 14}, (_, i) => <line key={i} x1={640 + i * 100} y1="790" x2={640 + i * 100} y2={H} stroke={INK} strokeWidth={4} opacity={0.5} />)}
      <rect x="640" y="778" width="1300" height="24" fill="#a56a33" stroke={INK} strokeWidth={5} />
      {[660, 900, 1160].map((x) => <rect key={x} x={x} y="640" width="34" height="150" fill="#6b4220" stroke={INK} strokeWidth={5} rx="6" />)}
    </svg>
  </>
);
const BgChart: React.FC<any> = ({t}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: 'linear-gradient(#e3f1ff,#b9d6f2)'}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      {Array.from({length: 9}, (_, i) => <circle key={i} cx={150 + i * 230} cy={100 + (i % 3) * 60} r={90 + (i % 4) * 20} fill="#ffffff" opacity={0.35} />)}
      <rect x="0" y="858" width={W} height={H - 858} fill="#a5c3e3" /><rect x="0" y="854" width={W} height="8" fill={INK} opacity={0.5} />
    </svg>
  </>
);
const BgLab: React.FC<any> = ({t}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: 'linear-gradient(#e8d6b4,#cdb68c)'}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      <rect x="0" y="800" width={W} height={H - 800} fill="#8b6a45" /><rect x="0" y="796" width={W} height="8" fill={INK} opacity={0.6} />
      {Array.from({length: 12}, (_, i) => <line key={i} x1={i * 180} y1="800" x2={i * 180 - 60} y2={H} stroke={INK} strokeWidth={4} opacity={0.35} />)}
      <circle cx="1560" cy="260" r="130" fill="#fff" stroke={INK} strokeWidth={10} /><line x1="1560" y1="260" x2="1560" y2="170" stroke={INK} strokeWidth={9} strokeLinecap="round" /><line x1="1560" y1="260" x2="1620" y2="290" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    </svg>
  </>
);
const BgHome: React.FC<any> = ({t}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: 'linear-gradient(#cfe8e0,#a9cfc4)'}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      <rect x="0" y="860" width={W} height={H - 860} fill="#7f9c92" /><rect x="0" y="856" width={W} height="8" fill={INK} opacity={0.5} />
      <rect x="1040" y="300" width="70" height="560" fill="#9aa7ae" stroke={INK} strokeWidth={6} rx="10" />
    </svg>
  </>
);

// ---------- helpers ----------
const Bar: React.FC<any> = ({x, y, w, hFull, u, color, t, t0}) => {
  if (t < t0) return null;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - hFull * u, width: w, height: hFull * u, background: color, border: `8px solid ${INK}`, borderRadius: 14, boxSizing: 'border-box'}} />;
};
const Steam: React.FC<any> = ({x, y, t, t0, t1, size = 200, delay = 0, rise = 320, op = 0.95}) => {
  if (t < t0 || t > t1) return null;
  const lt = (t - t0 + delay) % 1.8; const u = lt / 1.8;
  return <div style={{position: 'absolute', left: x - size / 2, top: y - size - u * rise, width: size, height: size, opacity: Math.sin(u * Math.PI) * op, transform: `scale(${0.5 + u * 0.9})`}}><Img src={staticFile('sealf/steam.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></div>;
};
const Falling: React.FC<any> = ({x, y0, y1, t, t0, t1, size = 60, period = 0.9, delay = 0, name = 'drop'}) => {
  if (t < t0 || t > t1) return null;
  const lt = ((t - t0 + delay) % period) / period;
  return <Sp s={name} x={x} y={lerp(y0, y1, lt * lt)} h={size * (0.7 + 0.3 * Math.sin(lt * Math.PI))} t={t} op={Math.sin(clamp(lt) * Math.PI) ** 0.5} shadow={false} />;
};
// ballistic droplets from a point
const Spray: React.FC<any> = ({hx, hy, tau, n = 9, vmin = 380, vmax = 760, a0 = -65, a1 = -8, g = 1000, size = 46, dir = 1}) => {
  if (tau < 0) return null;
  return <>{Array.from({length: n}, (_, i) => {
    const a = (lerp(a0, a1, i / (n - 1))) * Math.PI / 180; const v = lerp(vmin, vmax, ((i * 7) % n) / n);
    const px = hx + dir * Math.cos(a) * v * tau, py = hy + Math.sin(a) * v * tau + 0.5 * g * tau * tau;
    return <Sp key={i} s="drop" x={px} y={py + size} h={size * (0.8 + ((i * 5) % 4) * 0.12)} t={0} shadow={false} op={clamp(1.4 - tau * 0.6)} />;
  })}</>;
};
const Gauge: React.FC<any> = ({cx, cy, r, u, redFrom = 0.72}) => {
  const a = (q: number) => Math.PI * (1 - q);
  const pt = (q: number, rr: number) => `${cx + Math.cos(a(q)) * rr},${cy - Math.sin(a(q)) * rr}`;
  const arc = (q0: number, q1: number, col: string) => <path d={`M${pt(q0, r)} A${r},${r} 0 0 1 ${pt(q1, r)}`} stroke={col} strokeWidth={46} fill="none" />;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      <circle cx={cx} cy={cy} r={r + 60} fill="#fff" stroke={INK} strokeWidth={10} />
      {arc(0, redFrom, '#3fc06b')}{arc(redFrom, 1, '#e53b2e')}
      <line x1={cx} y1={cy} x2={cx + Math.cos(a(u)) * (r - 20)} y2={cy - Math.sin(a(u)) * (r - 20)} stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={26} fill={INK} />
    </svg>
  );
};

// ---------- whole-image shots ----------
const Ill: React.FC<any> = ({img, t, a, b, kb, punch = []}) => {
  const u = clamp((t - a) / (b - a));
  let z = kb[0][1], fx = kb[0][2], fy = kb[0][3];
  for (let i = 0; i < kb.length - 1; i++) {
    if (u >= kb[i][0] && u <= kb[i + 1][0]) { const q = eio((u - kb[i][0]) / (kb[i + 1][0] - kb[i][0])); z = lerp(kb[i][1], kb[i + 1][1], q); fx = lerp(kb[i][2], kb[i + 1][2], q); fy = lerp(kb[i][3], kb[i + 1][3], q); }
  }
  if (u > kb[kb.length - 1][0]) { const l = kb[kb.length - 1]; z = l[1]; fx = l[2]; fy = l[3]; }
  for (const [pt, amt] of punch) if (t >= pt) z *= 1 + amt * Math.exp(-(t - pt) * 7);
  const ox = (0.5 - fx) * (z - 1) * W, oy = (0.5 - fy) * (z - 1) * H;
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: 'saturate(1.05)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 50%', transform: `translate(${ox}px,${oy}px) scale(${z})`}}>
        <Img src={staticFile(`sealf/img_${img}.png`)} style={{width: W, height: H, objectFit: 'cover'}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- shots ----------
// ILL: {ill: 'NN', kb: [[u,zoom,fx,fy],...], punch: [[t,amt]], over: (t)=>JSX}
// CUT: {bg(t), render(t), cam:{z0,z1,fy}}
const SHOTS: Record<number, any> = {};
const ill = (r: number, img: string, kb: any, extra: any = {}) => { SHOTS[r] = {ill: img, kb, ...extra}; };

ill(1, '01', [[0, 1.0, 0.5, 0.55], [1, 1.14, 0.46, 0.5]], {punch: [[wd(1, 'drink'), 0.07]]});
ill(6, '06', [[0, 1.0, 0.5, 0.5], [1, 1.2, 0.3, 0.72]]);
ill(7, '07', [[0, 1.05, 0.25, 0.5], [1, 1.16, 0.7, 0.5]]);
ill(9, '09', [[0, 1.0, 0.5, 0.5], [1, 1.14, 0.25, 0.55]]);
ill(10, '10', [[0, 1.12, 0.8, 0.5], [1, 1.0, 0.4, 0.5]]);
ill(11, '11', [[0, 1.0, 0.4, 0.55], [0.5, 1.12, 0.45, 0.5], [1, 1.18, 0.55, 0.5]]);
ill(14, '14', [[0, 1.0, 0.75, 0.5], [1, 1.14, 0.5, 0.5]]);
ill(20, '20', [[0, 1.0, 0.5, 0.5], [1, 1.16, 0.32, 0.78]], {over: (t) => <Num t={t} t0={wd(20, 'two-thirds')} x={1450} y={250} rot={-5}>~2/3</Num>});
ill(25, '25', [[0, 1.0, 0.3, 0.5], [1, 1.14, 0.62, 0.52]]);
ill(26, '26', [[0, 1.0, 0.5, 0.5], [0.5, 1.12, 0.2, 0.78], [1, 1.2, 0.3, 0.7]]);
ill(27, '27', [[0, 1.0, 0.5, 0.5], [1, 1.22, 0.74, 0.55]]);
ill(29, '29', [[0, 1.0, 0.8, 0.55], [1, 1.14, 0.5, 0.6]]);
ill(30, '30', [[0, 1.05, 0.65, 0.55], [1, 1.16, 0.4, 0.5]]);
ill(32, '32', [[0, 1.0, 0.2, 0.65], [1, 1.16, 0.4, 0.5]]);
ill(33, '33', [[0, 1.0, 0.5, 0.5], [1, 1.12, 0.42, 0.62]]);
ill(35, '35', [[0, 1.0, 0.3, 0.6], [1, 1.2, 0.82, 0.5]]);
ill(37, '37', [[0, 1.0, 0.5, 0.55], [1, 1.1, 0.45, 0.6]]);

// 2: island cut, then the whole close-up on "big mistake"
{
  const r = 2; const tB = wd(r, 'Big') - 0.15;
  SHOTS[r] = {cam: {z0: 1, z1: 1.05, fy: 700}, bg: (t) => <BgIsland t={t} />, render: (t) => (
    t >= tB ? <Ill img="02" t={t} a={tB} b={BND(r)} kb={[[0, 1.0, 0.5, 0.5], [1, 1.16, 0.4, 0.45]]} punch={[[tB, 0.12]]} /> : (
      <>
        <Sp s="mr_cup" x={760} y={GRI} r={80} t={t} />
        <Sp s="pot" x={1200} y={GRI + 5} h={190} t={t} t0={wd(r, 'dented') - 0.3} enter="drop" />
      </>)
  )};
}
// 3: bars + spit + replay
{
  const r = 3; const sp = wd(r, 'spit'), sl = wd(r, 'slow'), rp = wd(r, 'replay');
  SHOTS[r] = {cam: {z0: 1, z1: 1.04, fy: 700}, bg: (t) => <BgChart t={t} />, render: (t) => {
    const tau = t < sl ? t - sp : t < rp ? (sl - sp) + (t - sl) * 0.25 : (t - rp) * 0.45;
    const replay = t >= rp; const name = t >= sp ? 'm_cough' : 'm_shrug';
    const a = anch(name, 450, GR, 80);
    const uS = eo((t - wd(r, 'Seawater')) / 0.9), uB = eo((t - wd(r, 'blood')) / 0.6);
    return (
      <div style={{position: 'absolute', inset: 0, filter: replay ? 'sepia(0.7) contrast(1.1) brightness(0.92)' : 'none'}}>
        <Bar x={1050} y={GR} w={200} hFull={560} u={uS} color="#1fa7e8" t={t} t0={wd(r, 'Seawater')} />
        <Bar x={1400} y={GR} w={200} hFull={160} u={uB} color="#e0443a" t={t} t0={wd(r, 'blood')} />
        <Sp s="m_shrug" x={450} y={GR} r={80} t={t} poses={[[sp, 'm_cough']]} />
        {t >= sp && <Spray hx={a.hx + 40} hy={a.hy + 10} tau={tau} n={11} vmin={500} vmax={950} a0={-40} a1={-4} />}
        {replay && <><div style={{position: 'absolute', left: 0, top: 0, width: W, height: 90, background: INK}} /><div style={{position: 'absolute', left: 0, top: H - 90, width: W, height: 90, background: INK}} /></>}
      </div>
    );
  }};
}
// 4: kidney + salt gauge
{
  const r = 4; const g0 = wd(r, 'concentrate'), g1 = wd(r, 'seawater');
  SHOTS[r] = {cam: {z0: 1, z1: 1.05, fy: 600}, bg: (t) => <BgChart t={t} />, render: (t) => {
    let u = 0.72 * eo((t - g0) / (g1 - g0 + 0.2));
    if (t > g1 + 0.2) { const q = t - g1 - 0.2; u = 0.72 + 0.04 * Math.exp(-q * 5) * Math.cos(q * 24); }
    if (t > wd(r, 'flush')) u += 0.015 * Math.sin(t * 40);
    return (
      <>
        <Sp s="kidney" x={620} y={GR} h={430} t={t} enter="pop" t0={S0(r) + 0.2} shadow ox={0} rot={t > wd(r, 'flush') ? Math.sin(t * 30) * 3 : 0} />
        <Gauge cx={1280} cy={600} r={230} u={clamp(u)} />
        <Sp s="m_shrug" x={1720} y={GR} r={62} t={t} flip />
      </>
    );
  }};
}
// 5: net water loss
{
  const r = 5; const lose = wd(r, 'lose'), take = wd(r, 'take'), cg = wd(r, 'Congratulations'), th = wd(r, 'thirstier');
  SHOTS[r] = {cam: {z0: 1, z1: 1.05, fy: 650}, bg: (t) => <BgChart t={t} />, render: (t) => {
    const nm = t >= th ? 'm_worry' : t >= cg ? 'm_shrug' : 'm_deadpan';
    const a = anch('m_deadpan', 700, GR, 80);
    const tin = (t - take) / 0.8;
    return (
      <>
        <Sp s="m_deadpan" x={700} y={GR} r={80} t={t} poses={[[cg, 'm_shrug'], [th, 'm_worry']]} />
        {t >= take && tin < 1 && <Sp s="drop" x={lerp(150, a.hx - 10, eo(tin))} y={lerp(560, a.hy + 50, eo(tin))} h={80} t={t} shadow={false} />}
        {t >= lose && t < cg && <Spray hx={a.hx + 30} hy={a.hy + 260} tau={(t - lose) % 0.9} n={9} vmin={500} vmax={900} a0={-35} a1={-5} g={1400} />}
        {t >= lose + 0.5 && t < cg - 0.2 && <Spray hx={a.hx + 30} hy={a.hy + 260} tau={(t - lose - 0.45) % 0.9} n={7} vmin={450} vmax={800} a0={-30} a1={-5} g={1400} size={38} />}
        {t >= cg && t < cg + 1.4 && <Spray hx={a.hx + 30} hy={a.hy + 260} tau={(t - cg) % 1.2} n={3} vmin={250} vmax={400} a0={-20} a1={-8} g={1400} size={34} />}
        {t >= th && <Sp s="drop" x={1300} y={GR - 40} h={90} t={t} op={0.18} shadow={false} />}
      </>
    );
  }};
}
// 8: the 1943 volunteer
{
  const r = 8; const gn = wd(r, 'gain');
  SHOTS[r] = {cam: {z0: 1, z1: 1.07, fy: 650}, bg: (t) => <BgLab t={t} />, render: (t) => (
    <>
      <Sp s="m_cot" x={880} y={GR} r={100} t={t} />
      <div style={{position: 'absolute', left: 1340, top: GR - 420, width: 110, height: 420, border: `8px solid ${INK}`, borderRadius: 16, background: '#fff', boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: 1348, top: GR - 8 - 70 * eo((t - gn) / 0.6), width: 94, height: 70 * eo((t - gn) / 0.6), background: '#3fc06b', borderRadius: 8}} />
    </>
  )};
}
// 12: the dock, one coin
{
  const r = 12;
  SHOTS[r] = {cam: {z0: 1, z1: 1.08, fy: 700}, bg: (t) => <BgDock t={t} />, render: (t) => {
    const a = anch('m_throw', 900, GR, 80);
    const bob = Math.sin(t * 2) * 6;
    return (
      <>
        <Sp s="dhow" x={1560} y={760 + bob} w={620} t={t} t0={S0(r) - 0.3} enter="right" shadow={false} />
        <Sp s="m_throw" x={900} y={GR} r={80} t={t} />
        <Sp s="coin" x={a.ax - 10} y={a.ay + 30} h={70} t={t} t0={wd(r, 'coin') - 0.4} enter="pop" shadow={false} rot={Math.sin(t * 6) * 10} />
      </>
    );
  }};
}
// 13: the leaking jar
{
  const r = 13; const jr = wd(r, 'jar'), pay = wd(r, 'still'), wo = wd(r, 'Worst');
  SHOTS[r] = {cam: {z0: 1, z1: 1.06, fy: 700}, bg: (t) => <BgDock t={t} />, render: (t) => {
    const lk = clamp((t - jr - 0.6) / 3);
    const a = anch('m_throw', 800, GR, 80);
    const cu = clamp((t - pay) / 0.9);
    return (
      <>
        <Sp s="dhow" x={1620} y={765 + Math.sin(t * 2) * 6} w={560} t={t} shadow={false} />
        <Sp s="m_throw" x={800} y={GR} r={80} t={t} poses={[[wo, 'm_deadpan']]} />
        <Sp s="jar" x={lerp(1450, 1100, eo((t - jr) / 1.0))} y={GR - 30} h={lerp(250, 190, lk)} t={t} t0={jr - 0.1} enter="right" />
        {t > jr + 0.6 && <Falling x={1105} y0={GR - 60} y1={GR + 30} t={t} t0={jr + 0.6} t1={wo + 1.5} period={lerp(0.8, 0.3, lk)} size={44} />}
        {t > jr + 1.2 && <Falling x={1130} y0={GR - 70} y1={GR + 30} t={t} t0={jr + 1.2} t1={wo + 1.5} period={lerp(0.9, 0.35, lk)} size={36} delay={0.2} />}
        {t >= pay && cu < 1 && <Sp s="coin" x={lerp(a.ax, 1600, eo(cu))} y={lerp(a.ay, 700, eo(cu)) - Math.sin(cu * Math.PI) * 120} h={60} t={t} shadow={false} rot={cu * 540} />}
      </>
    );
  }};
}
// 15: two tricks
{
  const r = 15; const tw = wd(r, 'Two');
  SHOTS[r] = {cam: {z0: 1, z1: 1.06, fy: 700}, bg: (t) => <BgBeach t={t} />, render: (t) => (
    <>
      <Sp s="m_point" x={620} y={GR} r={80} t={t} />
      <Sp s="cauldron" x={1150} y={GR + 10} h={330} t={t} t0={tw} enter="pop" />
      <Sp s="membrane" x={1560} y={GR + 10} h={380} t={t} t0={wd(r, 'tricks') - 0.2} enter="pop" />
    </>
  )};
}
// 16: trick one, boiling
{
  const r = 16; const bo = wd(r, 'boil'), ca = wd(r, 'catch'), sa = wd(r, 'salt'), fu = wd(r, 'fuel');
  SHOTS[r] = {cam: {z0: 1, z1: 1.07, fy: 750}, bg: (t) => <BgBeach t={t} dusk />, render: (t) => {
    const pile = clamp((t - sa) / 2.0);
    const fire = t >= fu ? 1 + 0.9 * eo((t - fu) / 0.6) : 1;
    const plateU = eo((t - ca) / 0.6);
    return (
      <>
        <Sp s="m_worry" x={500} y={GR} r={78} t={t} poses={[[fu, 'm_shrug']]} rot={t >= fu ? Math.sin(t * 5) * 4 : 0} />
        <Sp s="cauldron" x={960} y={GR + 10} h={330} t={t} />
        {t >= fu && <Sp s="fire" x={960} y={GR + 10} w={400 * fire} h={220 * fire} t={t} shadow={false} op={0.95} />}
        <Steam x={930} y={560} t={t} t0={bo} t1={ca + 4} size={230} />
        <Steam x={1000} y={560} t={t} t0={bo + 0.4} t1={ca + 4} size={190} delay={0.9} />
        {t >= ca && <div style={{position: 'absolute', left: 760 + (1 - plateU) * 700, top: 360, width: 560, height: 40, borderRadius: 20, background: 'linear-gradient(#cfd8e0,#8fa0ae)', border: `6px solid ${INK}`, transform: 'rotate(5deg)'}} />}
        {t >= ca + 0.8 && <Falling x={1300} y0={410} y1={GR - 160} t={t} t0={ca + 0.8} t1={fu + 1} size={46} period={0.8} />}
        <Sp s="jar" x={1300} y={GR + 10} h={210} t={t} />
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
          <path d={`M${1060 - 40},${GR + 8} L${1060 + 40 * pile},${GR - 20 - 90 * pile} L${1060 + 110 + 20 * pile},${GR + 8} Z`} fill="#fff" stroke={INK} strokeWidth={5} opacity={pile > 0 ? 1 : 0} />
        </svg>
      </>
    );
  }};
}
// 17: trick two, membrane
{
  const r = 17; const sq = wd(r, 'Squeeze');
  SHOTS[r] = {cam: {z0: 1, z1: 1.06, fy: 650}, bg: (t) => <BgChart t={t} />, render: (t) => {
    const parts: any[] = [];
    if (t >= sq) for (let i = 0; i < 14; i++) {
      const per = 1.6, ph = ((t - sq) / per + i / 14) % 1; const lane = (i * 53) % 7; const y = GR - 90 - lane * 38;
      const isSalt = i % 3 === 0; const xm = 1040;
      if (isSalt) {
        const x = ph < 0.5 ? lerp(560, xm - 60, ph / 0.5) : lerp(xm - 60, 600, (ph - 0.5) / 0.5);
        parts.push(<div key={i} style={{position: 'absolute', left: x - 14, top: y - 14 - (ph > 0.5 ? Math.sin((ph - 0.5) * Math.PI) * 90 : 0), width: 28, height: 28, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`, boxSizing: 'border-box'}} />);
      } else {
        const x = lerp(560, 1500, ph);
        parts.push(<Sp key={i} s="drop" x={x} y={y + 30} h={ph < 0.5 ? 56 : 44} t={t} shadow={false} />);
      }
    }
    const shake = t >= sq ? Math.sin(t * 50) * 3 : 0;
    return (
      <>
        <Sp s="pump" x={420} y={GR + 6} h={250} t={t} ox={shake} />
        <Sp s="membrane" x={1040} y={GR + 6} h={430} t={t} />
        <Sp s="glass" x={1560} y={GR + 6} h={250} t={t} />
        {parts}
        <Sp s="m_point" x={1770} y={GR} r={62} t={t} flip />
      </>
    );
  }};
}
// 18: the pump wins, then the tap
{
  const r = 18; const wins = wd(r, 'wins'), tapT = wd(r, 'Your', 1) - 0.3;
  SHOTS[r] = {cam: {z0: 1, z1: 1.04, fy: 750}, bg: (t) => (t >= tapT ? <BgHome t={t} /> : <BgDock t={t} />), render: (t) => {
    if (t >= tapT) {
      const sp = wd(r, 'sputters'), qu = wd(r, 'quiet');
      return (
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - eo((t - tapT) / 0.35)) * W}px)`}}>
          <Sp s="tap" x={1200} y={760} h={560} t={t} shadow={false} flip />
          {t >= sp && t < qu + 0.3 && Array.from({length: 4}, (_, i) => <Steam key={i} x={960 - i * 30} y={800} t={t} t0={sp} t1={qu + 0.3} size={120} delay={i * 0.4} rise={160} op={0.7} />)}
          {t >= qu && <Sp s="drop" x={960} y={820} h={50} t={t} op={clamp(1 - (t - qu) * 1.3)} shadow={false} />}
        </div>
      );
    }
    const f = clamp((t - wins) / 1.15);
    const flying = t >= wins;
    const mx = flying ? lerp(840, -380, eo(f)) : 850;
    const my = flying ? GR - Math.sin(f * Math.PI) * 220 : GR;
    return (
      <>
        <Sp s="membrane" x={1130} y={GR + 6} h={470} t={t} />
        <Sp s="pump" x={1480} y={GR + 6} h={250} t={t} ox={flying && t < wins + 0.6 ? Math.sin(t * 60) * 5 : 0} />
        {!flying ? <Sp s="m_strain" x={850} y={GR} r={66} t={t} t0={wd(r, 'cup') - 0.4} poses={[[wd(r, 'cup') - 0.4, 'm_strain']]} /> : <Sp s="m_blast" x={mx} y={my - 150} r={70} t={t} t0={wins} rot={-f * 540} shadow={false} noidle pivot={0.5} />}
        {!flying && t < wd(r, 'cup') - 0.4 && <Sp s="mr_cup" x={760} y={GR} r={78} t={t} />}
        {flying && f > 0.9 && <Sp s="steam" x={-60} y={GR - 20} h={90} t={t} op={0.8} shadow={false} />}
      </>
    );
  }};
}
// 19: half of the capacity is membrane
{
  const r = 19; const rv = wd(r, 'reverse'), hf = wd(r, 'half');
  SHOTS[r] = {cam: {z0: 1, z1: 1.05, fy: 600}, bg: (t) => <BgChart t={t} />, render: (t) => {
    const u = eo((t - rv) / 1.1); const cx = 620, cy = 500, rr = 260; const ang = -Math.PI / 2 + Math.PI * u;
    const x1 = cx + Math.cos(ang) * rr, y1 = cy + Math.sin(ang) * rr;
    return (
      <>
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
          <circle cx={cx} cy={cy} r={rr} fill="#c0612b" stroke={INK} strokeWidth={12} />
          {u > 0 && <path d={`M${cx},${cy} L${cx},${cy - rr} A${rr},${rr} 0 0 1 ${x1},${y1} Z`} fill="#1fa7e8" stroke={INK} strokeWidth={12} strokeLinejoin="round" />}
          <circle cx={cx} cy={cy} r={rr} fill="none" stroke={INK} strokeWidth={12} />
        </svg>
        <Num t={t} t0={hf} x={1180} y={470} rot={-4}>~50%</Num>
        <Sp s="m_point" x={1700} y={GR} r={72} t={t} flip />
      </>
    );
  }};
}
// 21: Qatar 99
{
  const r = 21; const ninety = wd(r, '99');
  SHOTS[r] = {cam: {z0: 1, z1: 1.06, fy: 700}, bg: (t) => <BgBeach t={t} />, render: (t) => (
    <>
      <Sp s="plant" x={1420} y={GR + 30} w={760} t={t} t0={S0(r) - 0.3} enter="pop" />
      <Sp s="glass" x={900} y={GR + 10} h={420} t={t} t0={wd(r, 'desalination')} enter="pop" />
      <Sp s="m_cheer" x={560} y={GR} r={80} t={t} />
      <Num t={t} t0={ninety} x={900} y={250} rot={-4}>~99%</Num>
    </>
  )};
}
// 22: 3 percent of water, 5 percent of energy
{
  const r = 22; const th = wd(r, '3'), fv = wd(r, '5'), it = wd(r, 'took');
  SHOTS[r] = {cam: {z0: 1, z1: 1.05, fy: 650}, bg: (t) => <BgChart t={t} />, render: (t) => {
    let u = 0.12; if (t >= it) u = 0.12 + 0.88 * eo((t - it) / 0.7);
    if (t > it + 0.8) u = 0.97 + 0.03 * Math.sin(t * 40);
    return (
      <>
        <Gauge cx={1160} cy={640} r={240} u={u} redFrom={0.7} />
        <Num t={t} t0={th} x={600} y={330} rot={-5} color="#7fd4ff">3%</Num>
        <Num t={t} t0={fv} x={1160} y={250} rot={4} color="#ffb199">5%</Num>
        <Sp s="bolt" x={1720} y={GR - 30} h={380} t={t} t0={fv} enter="pop" shadow={false} rot={t > fv ? Math.sin(t * 25) * 6 : 0} />
        <Sp s="m_worry" x={340} y={GR} r={78} t={t} />
      </>
    );
  }};
}
// 23: the bike
{
  const r = 23; const st = wd(r, 'stalls');
  SHOTS[r] = {cam: {z0: 1, z1: 1.04, fy: 800}, bg: (t) => <BgBeach t={t} />, render: (t) => {
    const riding = t < st;
    const pedal = riding ? Math.sin(t * 12) * 5 : 0;
    const f = clamp((t - st) / 1.2);
    const bx = 700;
    const bsc = 80 / meta['m_bike'].head[2]; const bw = meta['m_bike'].w * bsc;
    return (
      <>
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
          {Array.from({length: 10}, (_, i) => { const sx = (((i * 260 - (riding ? t * 380 : (st) * 380 + (t - st) * 0)) % 2600) + 2600) % 2600 - 300; return <line key={i} x1={sx} y1={GR + 60} x2={sx + 90} y2={GR + 60} stroke="#a8561c" strokeWidth={8} strokeLinecap="round" opacity={0.7} />; })}
          <path d={`M${bx + 280},${GR - 100} Q${(bx + 1500) / 2},${GR + 10} 1470,${GR - 90}`} stroke={INK} strokeWidth={8} fill="none" />
        </svg>
        <Sp s="pump" x={1560} y={GR + 6} h={260} t={t} ox={riding ? Math.sin(t * 30) * 3 : (t < st + 0.5 ? Math.sin(t * 60) * 6 : 0)} />
        {riding ? <Sp s="m_bike" x={bx + bw * 0.45} y={GR + pedal * 0.4} r={80} t={t} noidle rot={Math.sin(t * 6) * 1.2} /> : <Sp s="bike" x={bx + bw * 0.45} y={GR} w={bw} t={t} />}
        {!riding && f < 1 && <Sp s="m_flip" x={lerp(bx + 300, 1180, eo(f))} y={GR - 100 - Math.sin(f * Math.PI) * 330} r={72} t={t} rot={-f * 540} shadow={false} noidle pivot={0.5} />}
        {!riding && f >= 1 && <Sp s="m_lie" x={1180} y={GR + 10} r={80} t={t} t0={st + 1.2} enter="drop" noidle />}
      </>
    );
  }};
}
// 24: real plants
{
  const r = 24; const rl = wd(r, 'Real');
  SHOTS[r] = {cam: {z0: 1, z1: 1.05, fy: 800}, bg: (t) => <BgBeach t={t} />, render: (t) => (
    <>
      <Sp s="plant" x={1300} y={GR + 30} w={820} t={t} t0={rl} enter="rise" />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}><path d={`M0,${GR + 20} L${W},${GR + 20} L${W},${H} L0,${H} Z`} fill="none" /></svg>
      <Sp s="m_lie" x={620} y={GR + 10} r={80} t={t} noidle />
      <Sp s="drop" x={740} y={GR - 300 + Math.min(40, (t - S0(r)) * 12)} h={64} t={t} shadow={false} op={0.9} />
      <Sp s="bolt" x={1000} y={GR - 120} h={200} t={t} t0={wd(r, 'power')} t1={wd(r, 'power') + 1.4} enter="pop" shadow={false} />
    </>
  )};
}
// 28: tap coughs
{
  const r = 28; const co = wd(r, 'coughs'), gu = wd(r, 'gurgle');
  SHOTS[r] = {cam: {z0: 1, z1: 1.05, fy: 700}, bg: (t) => <BgHome t={t} />, render: (t) => (
    <>
      <Sp s="tap" x={1100} y={560} h={400} t={t} shadow={false} ox={t >= co && t < co + 0.7 ? Math.sin(t * 60) * 5 : 0} flip />
      {Array.from({length: 4}, (_, i) => <Steam key={i} x={1010 - i * 20} y={600} t={t} t0={co} t1={co + 1.2} size={110} delay={i * 0.25} rise={140} op={0.7} />)}
      {t >= gu && Array.from({length: 3}, (_, i) => <Falling key={i} x={1000} y0={580} y1={640} t={t} t0={gu} t1={gu + 1.5} size={26} period={0.6} delay={i * 0.2} name="drop" />)}
      <Sp s="mr_cup" x={760} y={GR} r={80} t={t} poses={[[co, 'm_worry'], [gu + 0.6, 'm_deadpan']]} />
    </>
  )};
}
// 31: wrong end of the rope
{
  const r = 31; const wr = wd(r, 'wrong');
  SHOTS[r] = {cam: {z0: 1, z1: 1.06, fy: 700}, bg: (t) => <BgDock t={t} />, render: (t) => {
    const a = anch('m_rope', 900, GR, 80);
    const dr = clamp((t - S0(r) - 0.6) / 2.6);
    return (
      <>
        <Sp s="boom" x={lerp(1300, 1900, dr)} y={680 + Math.sin(t * 3) * 8} w={620} t={t} shadow={false} />
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}><path d={`M${a.ax},${a.ay} Q${(a.ax + lerp(1300, 1900, dr)) / 2},${a.ay + 160} ${lerp(1300, 1900, dr) - 280},690`} stroke="#8b5a2b" strokeWidth={12} fill="none" strokeLinecap="round" /></svg>
        <Sp s="m_rope" x={900} y={GR} r={80} t={t} poses={[[wr, 'm_deadpan']]} />
      </>
    );
  }};
}
// 34: the pot works
{
  const r = 34; const dr = wd(r, 'drip'), fo = wd(r, 'forehead'), sa = wd(r, 'salt');
  SHOTS[r] = {cam: {z0: 1, z1: 1.07, fy: 760}, bg: (t) => <BgIsland t={t} />, render: (t) => {
    const a = anch('mr_cup', 700, GRI, 80);
    const d1 = clamp((t - dr) / 0.6), d2 = clamp((t - fo + 0.2) / 0.5);
    const pile = clamp((t - sa) / 1.5);
    return (
      <>
        <Sp s="fire" x={1180} y={GRI + 6} w={330} h={170} t={t} shadow={false} />
        <Sp s="pot" x={1180} y={GRI - 30} h={190} t={t} />
        <Steam x={1170} y={600} t={t} t0={S0(r) + 0.3} t1={fo} size={170} rise={260} />
        {Array.from({length: 4}, (_, i) => t > S0(r) + 1 + i * 0.4 ? <div key={i} style={{position: 'absolute', left: 1080 + i * 32, top: 620 - Math.sin(i) * 8, width: 16, height: 22, borderRadius: '50%', background: '#7fd4ff', border: `3px solid ${INK}`}} /> : null)}
        <Sp s="mr_cup" x={700} y={GRI} r={80} t={t} poses={[[fo, 'm_worry']]} />
        {t >= dr && d1 < 1 && <Sp s="drop" x={a.hx + 110 + (1 - d1) * 30} y={lerp(120, a.hy + 20, d1 * d1)} h={50} t={t} shadow={false} />}
        {t >= dr + 0.65 && t < fo - 0.2 && <Sp s="drop" x={a.hx + 120} y={a.hy + 150} h={34} t={t} op={0.5} shadow={false} />}
        {t >= fo - 0.2 && d2 < 1 && <Sp s="drop" x={a.hx - 8} y={lerp(120, a.hy - 70, d2 * d2)} h={50} t={t} shadow={false} />}
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
          {pile > 0 && <path d={`M1100,${GRI - 6} L${1150 + 20 * pile},${GRI - 8 - 70 * pile} L1260,${GRI - 6} Z`} fill="#fff" stroke={INK} strokeWidth={5} />}
        </svg>
      </>
    );
  }};
}
// 36: best deal
{
  const r = 36; const be = wd(r, 'Best');
  SHOTS[r] = {cam: {z0: 1.0, z1: 1.14, fy: 600}, bg: (t) => <BgIsland t={t} />, render: (t) => {
    const a = anch('mr_cup', 720, GRI + 20, 100);
    const dd = clamp((t - be - 0.8) / 1.6);
    return (
      <>
        <Sp s="m_shrug" x={720} y={GRI + 20} r={100} t={t} poses={[[be, 'mr_cup']]} />
        {t >= be + 0.8 && <Sp s="drop" x={a.hx - 110 + dd * 20} y={lerp(a.hy + 60, a.hy + 190, dd)} h={34} t={t} op={clamp(1.6 - dd)} shadow={false} />}
      </>
    );
  }};
}

// ---------- captions ----------
const CHUNKS: any[] = (() => {
  const out: any[] = [];
  SG.forEach((s, si) => {
    const ws = s.words; let cur: any[] = [];
    const flush = () => { if (cur.length) { out.push({words: cur, start: cur[0].start}); cur = []; } };
    ws.forEach((w, i) => {
      cur.push(w);
      const len = cur.map((q) => q.text).join(' ').length;
      const nextLen = i + 1 < ws.length ? len + 1 + ws[i + 1].text.length : 99;
      if ((len >= 20 && nextLen > 28) || len >= 30 || (/[.?!:]$/.test(w.text) && len >= 12)) flush();
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
          <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<any> = ({r, t}) => {
  const sh = SHOTS[r];
  const a = BND(r - 1), b = BND(r);
  if (sh.ill) {
    return (
      <AbsoluteFill>
        <Ill img={sh.ill} t={t} a={a} b={b} kb={sh.kb} punch={sh.punch ?? []} />
        {sh.over && sh.over(t)}
      </AbsoluteFill>
    );
  }
  const u = clamp((t - a) / (b - a));
  const z = lerp(sh.cam.z0, sh.cam.z1, eio(u));
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: 'saturate(1.08) contrast(1.03)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `50% ${sh.cam.fy ?? 700}px`, transform: `scale(${z})`}}>
        {sh.bg(t)}
        {sh.render(t)}
      </div>
    </AbsoluteFill>
  );
};

export const SeaLF: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const fade = clamp((tl.total - T) / 1.6);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SG.map((s, k) => {
        const r = k + 1;
        const a = BND(r - 1), b = BND(r);
        const from = r === 1 ? 0 : a - TR / 2, to = r === N ? tl.total : b + TR / 2;
        if (T < from || T > to) return null;
        const inU = r === 1 ? 1 : eo((T - (a - TR / 2)) / TR);
        const outU = r === N ? 0 : eio((T - (b - TR / 2)) / TR);
        const tx = (1 - inU) * W - outU * W * 0.35;
        return (
          <AbsoluteFill key={r} style={{transform: `translateX(${tx}px)`, boxShadow: inU < 1 ? '-24px 0 48px rgba(0,0,0,0.3)' : 'none', filter: outU > 0 ? `brightness(${1 - 0.35 * outU})` : 'none'}}>
            <ShotView r={r} t={T} />
          </AbsoluteFill>
        );
      })}
      <Captions t={T} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fade, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
