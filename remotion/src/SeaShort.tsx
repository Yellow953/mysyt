// @ts-nocheck
// "Why can't we just drink seawater?" Short (9:16, 1080x1920): cut-out animation + 2 whole illustrated images.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, Easing} from 'remotion';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import tl from './seaTimeline.json';
import meta from './seaMeta.json';

export const SEA_TOTAL = tl.total;
const W = 1080, H = 1920;
const INK = '#141414';
const IMPACT = 'Impact, "Arial Black", sans-serif';
const TR = 0.4;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = (x: number) => Easing.out(Easing.cubic)(clamp(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(clamp(x));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const rnd = (i: number, k = 1) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
const SG = tl.segs;
const S0 = (s: number) => SG[s - 1].start;
const S1 = (s: number) => SG[s - 1].end;
const Wd = (s: number, i: number) => SG[s - 1].words[i].start;
const GR = 1450; // ground line for feet (beach / dusk shots)

// ---------- sprite ----------
const Sp: React.FC<any> = ({s, x, y, r, h, w, t, t0 = 0, t1 = 1e9, flip, enter, poses, rot = 0, sxs = 1, sys = 1, op = 1, shadow, filter, ox = 0, oy = 0, z}) => {
  if (t < t0 || t > t1) return null;
  let name = s, swapT = -9;
  if (poses) for (const [pt, pn] of poses) if (t >= pt) { name = pn; swapT = pt; }
  const m = meta[name];
  const isM = name.startsWith('m_') || name.startsWith('mr_');
  let sc = r ? r / m.head[2] : h ? h / m.h : w ? w / m.w : 1;
  const bw = m.w * sc, bh = m.h * sc;
  const fx = (isM ? m.feet[0] : m.w / 2) * sc;
  const lt = t - t0;
  let es = 1, ex = 0, ey = 0, sx = 1, sy = 1;
  if (enter === 'pop') { const u = clamp(lt / 0.35); es = u >= 1 ? 1 : u <= 0 ? 0 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9; }
  else if (enter === 'left') ex = -(1 - eo(lt / 0.6)) * (x + bw + 100);
  else if (enter === 'right') ex = (1 - eo(lt / 0.6)) * (W - x + bw + 100);
  else if (enter === 'drop') { ey = -(1 - eo(lt / 0.45)) * 1100; if (lt > 0.45) { const q = lt - 0.45; const k = Math.exp(-q * 9) * Math.cos(q * 24); sx = 1 + 0.16 * k; sy = 1 - 0.16 * k; } }
  const dt = t - swapT;
  const k = swapT > -9 && dt >= 0 && dt < 1 ? Math.exp(-dt * 8) * Math.cos(dt * 26) : 0;
  sx *= (1 - 0.12 * k); sy *= (1 + 0.12 * k);
  const idle = isM ? Math.sin(t * 2.2 + x * 0.01) * 3 : 0;
  const px = x + ex + ox, py = y + ey + oy + idle;
  return (
    <>
      {(shadow ?? isM) && es > 0.3 && <div style={{position: 'absolute', left: px - bw * 0.3, top: y - 14, width: bw * 0.6, height: 28, borderRadius: '50%', background: 'rgba(40,20,10,0.28)', opacity: op}} />}
      <div style={{position: 'absolute', left: px - fx, top: py - bh, width: bw, height: bh, opacity: op, transformOrigin: `${fx}px ${bh}px`, transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${sx * es * sxs},${sy * es * sys})`, filter}}>
        <Img src={staticFile(`sea/${name}.png`)} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};

const Txt: React.FC<any> = ({children, size = 110, color = '#fff', stroke = 14, style}) => (
  <span style={{fontFamily: IMPACT, fontSize: size, color, WebkitTextStroke: `${stroke}px ${INK}`, paintOrder: 'stroke fill', letterSpacing: 2, whiteSpace: 'nowrap', ...style}}>{children}</span>
);
const Pop: React.FC<any> = ({t, t0, children, x, y, rot = 0, dur = 0.3}) => {
  const lt = t - t0; if (lt < 0) return null;
  const u = clamp(lt / dur); const es = u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * 9) * 0.9;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${es})`}}>{children}</div>;
};

// ---------- backgrounds ----------
const Waves: React.FC<any> = ({t, y0, y1, c0 = '#19b6e8', c1 = '#0a6fb8', n = 7}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: y0, width: W, height: y1 - y0, background: `linear-gradient(${c0},${c1})`}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      {Array.from({length: n}, (_, i) => {
        const y = y0 + 30 + i * ((y1 - y0 - 40) / n) + 6;
        const ph = t * (0.8 + (i % 3) * 0.3) * (i % 2 ? 1 : -1) + i;
        let d = `M-40,${y}`;
        for (let x = -40; x <= W + 40; x += 40) d += ` L${x},${y + Math.sin(x * 0.02 + ph * 2) * (6 + i * 1.5)}`;
        return <path key={i} d={d} stroke="rgba(255,255,255,0.55)" strokeWidth={5} fill="none" strokeLinecap="round" />;
      })}
    </svg>
  </>
);
const SkyDay: React.FC<any> = ({y1 = 1000}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: y1 + 4, background: 'linear-gradient(#2ea8ff,#c9efff)'}} />
    <div style={{position: 'absolute', left: 120, top: 150, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(#fff6c8 0%, #ffe27a 35%, rgba(255,226,122,0) 70%)'}} />
  </>
);
const IslandBg: React.FC<any> = ({t}) => (
  <>
    <SkyDay y1={1000} />
    <Waves t={t} y0={1000} y1={H} />
    <div style={{position: 'absolute', left: 0, top: 997, width: W, height: 6, background: INK, opacity: 0.5}} />
  </>
);
const BeachBg: React.FC<any> = ({t}) => (
  <>
    <SkyDay y1={880} />
    <Waves t={t} y0={880} y1={1360} n={5} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      <path d={`M0,1370 Q270,1330 540,1368 T1080,1350 L1080,${H} L0,${H} Z`} fill="#f2c36b" stroke={INK} strokeWidth={6} />
      <path d={`M0,1362 Q270,1322 540,1360 T1080,1342`} fill="none" stroke="#fff" strokeWidth={14} opacity={0.85} strokeLinecap="round" />
    </svg>
  </>
);
const DuskBg: React.FC<any> = ({t}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1100, background: 'linear-gradient(#7a3fa0,#ff5c39 55%,#ffb36b)'}} />
    <div style={{position: 'absolute', left: 560, top: 640, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(#fff0b0 0%, #ff9a4a 40%, rgba(255,140,60,0) 70%)'}} />
    <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
      <rect x="0" y="1100" width="1080" height="320" fill="#e08a3c" /><path d="M0,1180 L0,1030 Q200,930 420,1010 T860,990 T1080,1010 L1080,1180 Z" fill="#c9743a" stroke={INK} strokeWidth={6} />
      <path d={`M0,1260 L0,1120 Q300,1040 600,1130 T1080,1110 L1080,1260 Z`} fill="#e08a3c" stroke={INK} strokeWidth={6} />
      <path d={`M0,1370 Q270,1330 540,1368 T1080,1350 L1080,${H} L0,${H} Z`} fill="#f0a64a" stroke={INK} strokeWidth={6} />
      {Array.from({length: 18}, (_, i) => { const x = 30 + i * 62 + (i * 37) % 23, y = 1420 + (i * 53) % 340, hh = 22 + (i * 29) % 16; return <path key={i} d={`M${x},${y} l-8,${-hh} M${x},${y} l1,${-hh - 8} M${x},${y} l9,${-hh}`} stroke="#a8561c" strokeWidth={6} strokeLinecap="round" fill="none" />; })}
    </svg>
  </>
);

// ---------- helpers ----------
const Bar: React.FC<any> = ({x, y, w, hFull, u, color, label, t, t0}) => {
  if (t < t0) return null;
  return (
    <>
      <div style={{position: 'absolute', left: x - w / 2, top: y - hFull * u, width: w, height: hFull * u, background: color, border: `8px solid ${INK}`, borderRadius: 14, boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: x - 150, top: y + 14, width: 300, textAlign: 'center'}}><Txt size={54} stroke={10}>{label}</Txt></div>
    </>
  );
};
const Steam: React.FC<any> = ({x, y, t, t0, t1, size = 200, delay = 0, rise = 320}) => {
  if (t < t0 || t > t1) return null;
  const lt = (t - t0 + delay) % 1.8; const u = lt / 1.8;
  return <div style={{position: 'absolute', left: x - size / 2, top: y - size - u * rise, width: size, height: size, opacity: Math.sin(u * Math.PI) * 0.95, transform: `scale(${0.5 + u * 0.9})`}}><Img src={staticFile('sea/steam.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></div>;
};
const Falling: React.FC<any> = ({x, y0, y1, t, t0, t1, size = 80, period = 0.9, delay = 0, name = 'drop'}) => {
  if (t < t0 || t > t1) return null;
  const lt = ((t - t0 + delay) % period) / period;
  return <Sp s={name} x={x} y={lerp(y0, y1, lt * lt)} h={size * (0.7 + 0.3 * Math.sin(lt * Math.PI))} t={t} op={Math.sin(clamp(lt) * Math.PI) ** 0.5} shadow={false} />;
};

// ---------- shots ----------
// Each shot: {bg, render(t), cam:{z0,z1,fy}, sfx:[[t,name,vol]]}
const Hook: React.FC<any> = ({t}) => {
  const IW = W, IH = H;
  const p1 = Wd(1, 5); // punch on "SEAWATER?"
  const dp = t - p1; const pk = dp >= 0 ? Math.exp(-dp * 7) : 0;
  const z = 1.0 + 0.06 * eio(t / 2.4) + 0.10 * pk;
  const shx = pk * Math.sin(t * 90) * 8;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img src={staticFile('sea/img_hook.png')} style={{position: 'absolute', left: shx, top: 0, width: IW, height: IH, transformOrigin: '50% 30%', transform: `scale(${z})`, filter: 'saturate(1.15)'}} />
    </AbsoluteFill>
  );
};

const MIDX = 905, ISL_Y = 1560;
const SHOTS: any[] = [
  null, // 0 placeholder
  {hook: true},
  { // 2: island, free refills
    bg: (t) => <IslandBg t={t} />, cam: {z0: 1.0, z1: 1.08, fy: 1100},
    render: (t) => {
      const a = S0(2), pw = Wd(2, 4);
      const bob = Math.sin(t * 1.6) * 6;
      return <>
        <Sp s="island" x={540} y={ISL_Y + bob} w={940} t={t} shadow={false} />
        <Sp s="mr_cup" x={MIDX} y={1330 + bob} r={100} t={t} t0={a - 0.5} poses={[[pw - 0.12, 'm_cheer']]} shadow={false} />
        <div style={{position: 'absolute', left: 0, top: ISL_Y - 30, width: W, height: 30, background: 'rgba(255,255,255,0.35)', borderRadius: 30}} />
        <Falling x={MIDX - 330} y0={1060} y1={1280} t={t} t0={pw - 0.1} t1={S1(2) + 0.2} size={90} period={1.1} />
      </>;
    },
    sfx: [[Wd(2, 4) - 0.1, 'pop', 0.7]],
  },
  { // 3: salt 3x blood
    bg: (t) => <BeachBg t={t} />, cam: {z0: 1.0, z1: 1.05, fy: 1100},
    render: (t) => {
      const a = S0(3), wSea = Wd(3, 1), w3 = Wd(3, 4), wBlood = Wd(3, 10);
      const uSea = eo((t - wSea) / 0.9) * 1.0;
      return <>
        <Bar x={620} y={1330} w={150} hFull={150} u={eo((t - a) / 0.5)} color="#e0314b" label="BLOOD" t={t} t0={a - 0.2} />
        <Bar x={860} y={1330} w={150} hFull={420} u={uSea} color="#1b9be8" label="SEA" t={t} t0={wSea - 0.01} />
        <Sp s="salt" x={860} y={940 + Math.sin(t * 14) * 5} h={250} t={t} t0={wSea - 0.2} enter="pop" rot={-12 + Math.sin(t * 14) * 6} shadow={false} />
        <Pop t={t} t0={w3} x={520} y={760} rot={-6}><Txt size={170} color="#ffd400" stroke={18}>3X</Txt></Pop>
        <Sp s="m_cough" x={250} y={GR} r={118} t={t} t0={a - 0.5} poses={[[wBlood - 0.2, 'm_cough']]} />
      </>;
    },
    sfx: [[Wd(3, 1), 'pop', 0.6], [Wd(3, 4), 'thud', 0.8], [Wd(3, 8), 'cough', 0.6]],
  },
  { // 4: kidneys
    bg: (t) => <BeachBg t={t} />, cam: {z0: 1.0, z1: 1.06, fy: 1000},
    render: (t) => {
      const a = S0(4), wS = Wd(4, 5), wSea = Wd(4, 8), wCost = Wd(4, 13);
      const fill = clamp((t - wS) / (wSea - wS + 0.2));
      const gaugeBot = 1160, gaugeTop = 740, lineY = 800;
      const level = lerp(gaugeBot, lineY + 4, eo(fill));
      const bump = t > wSea + 0.15 ? Math.exp(-(t - wSea - 0.15) * 7) * Math.sin((t - wSea - 0.15) * 30) * 8 : 0;
      return <>
        <div style={{position: 'absolute', left: 790, top: gaugeTop, width: 110, height: gaugeBot - gaugeTop, background: '#e8f4ff', border: `8px solid ${INK}`, borderRadius: 20, boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: 798, top: level + bump, width: 94, height: gaugeBot - level - 8, background: '#ff7a3d', borderRadius: '0 0 12px 12px'}} />
        <div style={{position: 'absolute', left: 740, top: lineY - 5, width: 210, height: 10, background: '#1b9be8', border: `3px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 740, top: lineY - 90, width: 210, textAlign: 'center'}}><Txt size={64} stroke={10} color="#9be0ff">SEA</Txt></div>
        <Sp s="kidney" x={450} y={1150} h={340} t={t} t0={a - 0.3} enter="pop" poses={[[wSea + 0.15, 'kidney']]} shadow={false} rot={Math.sin(t * 3) * 2 + (t > wSea + 0.15 ? Math.sin((t - wSea) * 25) * Math.exp(-(t - wSea) * 5) * 8 : 0)} />
        <Sp s="m_shrug" x={170} y={GR} r={105} t={t} t0={a - 0.5} poses={[[wSea + 0.2, 'm_shrug']]} />
        <Sp s="drop" x={500} y={1390} h={105} t={t} t0={wCost} enter="pop" shadow={false} />
        <Sp s="drop" x={700} y={1390} h={150} t={t} t0={wCost + 0.55} enter="pop" shadow={false} />
        <Sp s="drop" x={850} y={1390} h={150} t={t} t0={wCost + 0.8} enter="pop" shadow={false} />
        <Pop t={t} t0={wCost + 0.05} x={500} y={1235}><Txt size={44} stroke={8}>DRANK 1</Txt></Pop>
        <Pop t={t} t0={wCost + 0.55} x={790} y={1180}><Txt size={44} stroke={8} color="#ff7a7a">LOST 2</Txt></Pop>
      </>;
    },
    sfx: [[Wd(4, 5), 'rumble', 0.4], [Wd(4, 8) + 0.1, 'boing', 0.8], [Wd(4, 13), 'pop', 0.6], [Wd(4, 15) + 0.55, 'pop', 0.6], [Wd(4, 15) + 0.8, 'pop', 0.6]],
  },
  { // 5: thirstier raisin
    bg: (t) => <BeachBg t={t} />, cam: {z0: 1.0, z1: 1.1, fy: 1000},
    render: (t) => {
      const a = S0(5), wT = Wd(5, 2);
      const u = eio((t - a) / (wT - a + 0.4));
      return <>
        <Sp s="m_cough" x={540} y={GR} r={150} t={t} t0={a - 0.5} sxs={lerp(1, 0.72, u)} sys={lerp(1, 0.93, u)} filter={`sepia(${u * 0.7}) saturate(${1 + u * 0.3}) brightness(${1 - u * 0.15})`} />
        <Falling x={330} y0={1300} y1={900} t={t} t0={a} t1={S1(5) + 0.5} size={90} period={1.0} name="drop" />
        <Falling x={760} y0={1300} y1={880} t={t} t0={a} t1={S1(5) + 0.5} size={70} period={1.3} delay={0.5} name="drop" />
      </>;
    },
    sfx: [[Wd(5, 2) - 0.05, 'boing', 0.7], [Wd(5, 0), 'sizzle', 0.3]],
  },
  { // 6: Gulf whole image reveal
    gulf: true,
    sfx: [[Wd(6, 0) - 0.05, 'whoosh', 0.5], [Wd(6, 6) , 'pop', 0.5]],
  },
  { // 7: boil vs filter
    bg: (t) => <DuskBg t={t} />, cam: {z0: 1.0, z1: 1.05, fy: 1100},
    render: (t) => {
      const a = S0(7), wB = Wd(7, 8) - 0.2; // switch to filter
      const uB = eio((t - wB) / 0.6);
      const px = lerp(470, -520, uB), fxp = lerp(1500, 470, uB);
      return <>
        <div style={{position: 'absolute', left: px - 330, top: 640, width: 660, height: 22, background: '#b9c4cf', border: `6px solid ${INK}`, borderRadius: 10, opacity: t < wB + 0.7 ? 1 : 0}} />
        <Sp s="plant" x={px} y={1400} w={700} t={t} t0={a - 0.5} shadow={false} />
        {[0, 1, 2].map((i) => <Steam key={i} x={px - 200 + i * 130} y={900} t={t} t0={a + 0.8} t1={wB + 0.5} size={170} delay={i * 0.6} rise={250} />)}
        {[0, 1, 2].map((i) => <Falling key={'d' + i} x={px - 100 + i * 100} y0={670} y1={780} t={t} t0={Wd(7, 5)} t1={wB + 0.3} size={70} period={0.8} delay={i * 0.27} />)}
        {/* filter */}
        <div style={{position: 'absolute', left: fxp - 45, top: 760, width: 90, height: 620, background: '#8a95a3', border: `8px solid ${INK}`, borderRadius: 18, boxSizing: 'border-box'}}>
          {Array.from({length: 9}, (_, i) => <div key={i} style={{position: 'absolute', left: 30, top: 40 + i * 62, width: 14, height: 14, borderRadius: '50%', background: INK}} />)}
        </div>
        {[0, 1, 2].map((i) => {
          const per = 1.4, lt = ((t - wB - 0.6 + i * 0.47) % per) / per;
          if (t < wB + 0.6) return null;
          const bounce = lt < 0.5 ? lerp(-190, -40, lt / 0.5) : lerp(-40, -190, (lt - 0.5) / 0.5) * 1;
          return <Sp key={'s' + i} s="salt" x={fxp + bounce} y={900 + i * 150} h={100} t={t} shadow={false} rot={lt * 120} op={lt > 0.5 ? 1 - (lt - 0.5) * 1.4 : 1} />;
        })}
        {[0, 1, 2].map((i) => {
          const per = 1.2, lt = ((t - wB - 0.7 + i * 0.4) % per) / per;
          if (t < wB + 0.7) return null;
          return <Sp key={'w' + i} s="drop" x={fxp + 40 + lt * 190} y={950 + i * 140 + lt * 40} h={70} t={t} shadow={false} op={Math.sin(lt * Math.PI) ** 0.4} />;
        })}
        <Sp s="m_point" x={930} y={GR} r={100} t={t} t0={a - 0.5} flip />
      </>;
    },
    sfx: [[Wd(7, 2), 'sizzle', 0.5], [Wd(7, 8) - 0.2, 'whoosh', 0.6], [Wd(7, 12), 'pop', 0.5]],
  },
  { // 8: one million m3, pools
    bg: (t) => <DuskBg t={t} />, cam: {z0: 1.0, z1: 1.05, fy: 1000},
    render: (t) => {
      const a = S0(8), wM = Wd(8, 5), wP = Wd(8, 10), w4 = Wd(8, 11);
      const cnt = Math.round(1000000 * eo((t - wM) / 0.9));
      const pools: any[] = [];
      for (let i = 0; i < 12; i++) { const c = i % 4, r = Math.floor(i / 4); pools.push(<Sp key={i} s="pool" x={170 + c * 232} y={1060 + r * 170 + 170 * 0} w={215} t={t} t0={wP + i * 0.1} enter="pop" shadow={false} />); }
      return <>
        <Sp s="plant" x={300} y={880} w={560} t={t} t0={a - 0.5} shadow={false} />
        {[0, 1].map((i) => <Steam key={i} x={190 + i * 120} y={650} t={t} t0={a} t1={S1(8)} size={130} delay={i * 0.8} rise={180} />)}
        {t >= wM && <div style={{position: 'absolute', left: 540, top: 620, width: 500, textAlign: 'center', transform: 'translateX(0)'}}>
          <div><Txt size={90} color="#9be0ff" stroke={14}>{cnt.toLocaleString('en-US')}</Txt></div>
          <div><Txt size={54} stroke={10}>CUBIC M / DAY</Txt></div>
        </div>}
        {pools}
        <Pop t={t} t0={w4} x={540} y={960}><Txt size={96} color="#ffd400" stroke={16}>~400 POOLS</Txt></Pop>
        <Sp s="m_cheer" x={940} y={GR + 20} r={85} t={t} t0={wP + 1.2} enter="pop" />
      </>;
    },
    sfx: [[Wd(8, 5), 'thud', 0.8], [Wd(8, 11), 'thud', 0.7], [Wd(8, 10) + 0.1, 'pop', 0.4], [Wd(8, 10) + 0.5, 'pop', 0.4], [Wd(8, 10) + 0.9, 'pop', 0.4]],
  },
  { // 9: third + Kuwait glasses
    bg: (t) => <DuskBg t={t} />, cam: {z0: 1.0, z1: 1.05, fy: 1000},
    render: (t) => {
      const a = S0(9), wT = Wd(9, 4), wK = Wd(9, 10) - 0.15;
      const uK = eio((t - wK) / 0.6);
      const cx = lerp(540, -460, uK), cy = 960;
      const R = 250;
      const frac = eo((t - wT) / 0.8) * 0.333;
      const ang = frac * Math.PI * 2;
      const sx0 = cx, sy0 = cy - R, ex = cx + R * Math.sin(ang), ey = cy - R * Math.cos(ang);
      const big = frac > 0.5 ? 1 : 0;
      const glasses: any[] = [];
      for (let i = 0; i < 10; i++) { const c = i % 5, r = Math.floor(i / 5); glasses.push(<Sp key={i} s="glass" x={150 + c * 195} y={1080 + r * 270} h={215} t={t} t0={wK + 0.5 + i * 0.12} enter="pop" shadow={false} op={i === 9 ? 0.55 : 1} />); }
      return <>
        <div style={{position: 'absolute', left: cx - R - 8, top: cy - R - 8, width: 2 * R + 16, height: 2 * R + 16, borderRadius: '50%', background: '#1b9be8', border: `8px solid ${INK}`, boxSizing: 'border-box'}} />
        <svg style={{position: 'absolute', left: 0, top: 0}} width={W} height={H}>
          {frac > 0.001 && <path d={`M${cx},${cy} L${sx0},${sy0} A${R},${R} 0 ${big} 1 ${ex},${ey} Z`} fill="#ff7a3d" stroke={INK} strokeWidth={8} strokeLinejoin="round" transform={`translate(${Math.sin(ang / 2) * 28 * clamp(frac / 0.33)},${-Math.cos(ang / 2) * 28 * clamp(frac / 0.33)})`} />}
        </svg>
        <Pop t={t} t0={wT + 0.6} x={cx + 120} y={cy - 160}><Txt size={110} color="#ffd400" stroke={16}>GULF 1/3</Txt></Pop>
        <div style={{position: 'absolute', left: cx - 200, top: cy + R + 40, width: 400, textAlign: 'center', opacity: 1 - uK}}><Txt size={50} stroke={9}>WORLD CAPACITY</Txt></div>
        {t > wK && <div style={{position: 'absolute', left: 0, top: 690, width: W, textAlign: 'center'}}><Txt size={110} color="#ffd400" stroke={16}>KUWAIT</Txt></div>}
        {glasses}
        <Sp s="m_cheer" x={t > wK ? 960 : 930} y={GR + 20} r={85} t={t} t0={Wd(9, 14) - 0.1} enter="pop" />
      </>;
    },
    sfx: [[Wd(9, 4), 'pop', 0.6], [Wd(9, 4) + 0.7, 'thud', 0.6], [Wd(9, 10) - 0.15, 'whoosh', 0.6], [Wd(9, 10) + 0.5, 'pop', 0.4], [Wd(9, 11) + 0.2, 'pop', 0.4], [Wd(9, 13) + 0.1, 'pop', 0.4], [Wd(9, 14), 'pop', 0.5]],
  },
  { // 10: energy + brine
    bg: (t) => <DuskBg t={t} />, cam: {z0: 1.0, z1: 1.05, fy: 1000},
    render: (t) => {
      const a = S0(10), wE = Wd(10, 3), wB = Wd(10, 9) - 0.15;
      const uB = eio((t - wB) / 0.6);
      const pulse = 1 + Math.sin(t * 12) * 0.05;
      const fillE = eo((t - wE) / 0.9);
      const ax = lerp(430, -600, uB);
      const bx = lerp(1700, 470, uB);
      const bt = clamp((t - wB - 0.7) / 0.9);
      return <>
        <Sp s="bolt" x={ax} y={1060} h={520 * pulse} t={t} t0={wE - 0.2} enter="pop" shadow={false} rot={Math.sin(t * 9) * 4} />
        <div style={{position: 'absolute', left: ax - 300, top: 1100, width: 600, height: 80, background: '#1d1d1d', border: `8px solid ${INK}`, borderRadius: 40, boxSizing: 'border-box', opacity: t > wE - 0.2 ? 1 : 0}}>
          <div style={{position: 'absolute', left: 6, top: 6, width: 576 * fillE, height: 56, background: fillE > 0.9 ? '#ff3b30' : '#ff9a2a', borderRadius: 30}} />
        </div>
        <Sp s="plant" x={bx} y={1400} w={620} t={t} t0={a} shadow={false} />
        <div style={{position: 'absolute', left: bx + 270, top: 1330, width: 330, height: 40, background: '#8a95a3', border: `6px solid ${INK}`, boxSizing: 'border-box', opacity: uB > 0.9 ? 1 : 0}} />
        {uB > 0.5 && <>
          <div style={{position: 'absolute', left: 700, top: 1330, width: 380, height: 260, overflow: 'hidden', borderRadius: '140px 0 0 140px'}}><div style={{position: 'absolute', left: -700, top: -1330}}><Waves t={t} y0={1330} y1={1590} n={3} /></div></div>
          <Sp s="brine" x={800 + bt * 20} y={1330 + bt * 130} h={170 * (1 - bt * 0.3)} t={t} t0={wB + 0.7} enter="pop" shadow={false} op={1 - bt * 0.35} />
        </>}
        <Sp s="m_worry" x={t > wB ? 190 : 900} y={GR} r={95} t={t} t0={a - 0.5} />
      </>;
    },
    sfx: [[Wd(10, 3), 'rumble', 0.6], [Wd(10, 9) - 0.15, 'whoosh', 0.6], [Wd(10, 9) + 0.8, 'sizzle', 0.4]],
  },
  { // 11: finale
    bg: (t) => <DuskBg t={t} />, cam: {z0: 1.0, z1: 1.06, fy: 1000},
    render: (t) => {
      const a = S0(11), wD = Wd(11, 4), wV = Wd(11, 11);
      const gs = 0.7 + 0.35 * eo((t - wV) / 0.5);
      return <>
        <Sp s="plant" x={680} y={1360} w={980 * gs} t={t} t0={a - 0.5} shadow={false} />
        {[0, 1, 2].map((i) => <Steam key={i} x={470 + i * 190} y={1000 - (gs - 0.7) * 300} t={t} t0={wV} t1={SEA_TOTAL} size={210} delay={i * 0.6} rise={300} />)}
        <Sp s="mr_cup" x={260} y={GR} r={120} t={t} t0={a - 0.5} poses={[[wD - 0.1, 'm_cheer']]} />
      </>;
    },
    sfx: [[Wd(11, 4) - 0.05, 'pop', 0.6], [Wd(11, 11), 'thud', 0.9], [Wd(11, 12), 'rumble', 0.4]],
  },
];

// ---------- Gulf whole image ----------
const Gulf: React.FC<any> = ({t}) => {
  const a = S0(6), b = S1(6);
  const u = eio((t - a) / (b - a + 0.5));
  const z = lerp(1.3, 1.0, eio((t - a) / (b - a + 0.5)));
  const fy = lerp(80, 30, u); // focus % (top origin)
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img src={staticFile('sea/img_gulf.png')} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '50% 100%', transform: `scale(${z})`}} />
    </AbsoluteFill>
  );
};

// ---------- captions ----------
const CHUNKS: any[] = (() => {
  const out: any[] = [];
  SG.forEach((s, si) => {
    const ws = s.words; let cur: any[] = []; const flush = () => { if (cur.length) { out.push({words: cur, start: cur[0].start}); cur = []; } };
    ws.forEach((w, i) => {
      cur.push(w);
      const len = cur.map((q) => q.text).join(' ').length;
      const nextLen = i + 1 < ws.length ? len + 1 + ws[i + 1].text.length : 99;
      const brk = si === 0 ? false : (len >= 13 && nextLen > 17) || len >= 18 || /[.?!,]$/.test(w.text);
      if (brk) flush();
    });
    flush();
  });
  out.forEach((c, i) => { const nx = out[i + 1]; c.end = Math.min(nx ? nx.start : tl.total, c.words[c.words.length - 1].end + 0.55); if (nx && c.end > nx.start) c.end = nx.start; });
  return out;
})();
const Captions: React.FC<{t: number}> = ({t}) => {
  const c = CHUNKS.find((q) => t >= q.start && t < q.end);
  if (!c) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 170}}>
      <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 960, fontFamily: IMPACT, fontSize: 100, letterSpacing: 2, lineHeight: 1.05}}>
        {c.words.map((w: any, i: number) => (
          <span key={i} style={{color: t >= w.start && t < w.end ? '#ffd400' : '#fff', WebkitTextStroke: `13px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<any> = ({i, t, a, b}) => {
  const sh = SHOTS[i];
  if (sh.hook) return <Hook t={t} />;
  if (sh.gulf) return <Gulf t={t} />;
  const u = clamp((t - a) / (b - a));
  const z = lerp(sh.cam.z0, sh.cam.z1, eio(u));
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: 'saturate(1.25) contrast(1.04)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `50% ${sh.cam.fy ?? 1000}px`, transform: `scale(${z})`}}>
        {sh.bg(t)}
        {sh.render(t)}
      </div>
    </AbsoluteFill>
  );
};

export const SeaShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  const n = SG.length;
  const starts = SG.map((s) => s.start); const ends = SG.map((_, i) => (i + 1 < n ? SG[i + 1].start : SEA_TOTAL));
  const sfx: [number, string, number][] = [];
  for (let i = 1; i <= n; i++) {
    if (i > 1) sfx.push([starts[i - 1] - TR, 'whoosh', 0.35]);
    (SHOTS[i].sfx ?? []).forEach(([tt, nm, v]: any) => sfx.push([tt, nm, v ?? 0.6]));
  }
  sfx.push([Wd(1, 5), 'thud', 1.0]);
  sfx.push([SEA_TOTAL - TR - 0.1, 'whoosh', 0.4]);
  const loopU = eo((T - (SEA_TOTAL - TR - 0.05)) / TR);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SG.map((s, k) => {
        const i = k + 1;
        const from = k === 0 ? 0 : Math.max(0, starts[k] - TR);
        const slideU = k === 0 ? 1 : eo((T - from) / TR);
        return (
          <Sequence key={i} from={Math.round(from * fps)} durationInFrames={Math.round((ends[k] - from) * fps) + 3}>
            <AbsoluteFill style={{transform: `translateX(${(1 - slideU) * W}px)`, boxShadow: slideU < 1 ? '-20px 0 40px rgba(0,0,0,0.3)' : 'none'}}>
              <ShotView i={i} t={Math.max(T, 0)} a={starts[k]} b={ends[k]} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {loopU > 0 && (
        <AbsoluteFill style={{transform: `translateX(${(1 - loopU) * W}px)`}}>
          <Hook t={0} />
        </AbsoluteFill>
      )}
      {loopU < 0.001 || true ? <Captions t={loopU > 0.5 ? 0 : T} /> : null}
      <Audio src={staticFile('sea/voice.wav')} volume={1.0} />
      <Audio src={staticFile('sea/music.mp3')} volume={(f) => 0.22 * duck(f / fps) * Math.min(1, f / fps / 0.6) * Math.min(1, (SEA_TOTAL * fps - f) / (fps * 1.5))} />
      {sfx.map(([t0, name, vol], k) => (
        <Sequence key={k} from={Math.max(0, Math.round(t0 * fps))} durationInFrames={Math.round(2.6 * fps)}>
          <Audio src={staticFile(`sea/${name}.wav`)} volume={vol * 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// music ducks to 45% under speech
const duck = (t: number) => {
  for (const s of SG) if (t >= s.start - 0.1 && t <= s.end + 0.1) return 0.45;
  return 0.9;
};
