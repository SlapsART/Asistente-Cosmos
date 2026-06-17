import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

const LABELS = [
  'Analizando contexto...',
  'Interpretando datos...',
  'Aplicando reglas...',
  'Creando respuesta...',
];

const SATS = [
  { tiltX: 0.38, rotZ: 0.44,  orR: 15,   spd: 2.2,  off: 0,             r: 3.8, color: '#2F43D0' },
  { tiltX: 0.38, rotZ: 0.44,  orR: 15,   spd: 1.55, off: Math.PI,       r: 2.4, color: '#5567D9' },
  { tiltX: 0.13, rotZ: 1.62,  orR: 14.5, spd: 1.8,  off: 0.6,           r: 2.0, color: '#7B93E8' },
  { tiltX: 0.13, rotZ: 1.62,  orR: 14.5, spd: 2.6,  off: Math.PI + 0.6, r: 3.2, color: '#3D51CC' },
];

const SEQ = [
  { name: 'orbit',     dur: 1800 },
  { name: 'converge',  dur: 1200 },
  { name: 'pulse',     dur: 1400 },
  { name: 'xfade-in',  dur: 700  },
  { name: 'hold',      dur: 800  },
  { name: 'xfade-out', dur: 900  },
];
export const COSMOS_CYCLE_MS = SEQ.reduce((s, p) => s + p.dur, 0);

const W = 36, H = 36, CX = 18, CY = 18, NUC_R = 10;

function easeIn(t: number) { return t * t * t; }
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

function getPhase(elapsed: number) {
  const t = elapsed % COSMOS_CYCLE_MS;
  let acc = 0;
  for (let i = 0; i < SEQ.length; i++) {
    if (t < acc + SEQ[i].dur) return { i, p: (t - acc) / SEQ[i].dur, name: SEQ[i].name };
    acc += SEQ[i].dur;
  }
  return { i: SEQ.length - 1, p: 1, name: SEQ[SEQ.length - 1].name };
}

const SVG_LOGO_STR = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#2F43D0" d="M23.8506 10.1045C23.9489 10.7216 24 11.3538 24 11.998C24 12.4526 23.975 12.9028 23.9258 13.3438L15.9668 16.8047C15.4021 17.0506 15.0645 17.6034 15.0645 18.1816H15.0664C15.0664 18.3816 15.1065 18.5835 15.1895 18.7783C15.5202 19.5381 16.4043 19.8881 17.1641 19.5557L22.8779 17.0713C20.9683 21.1635 16.8127 24 11.998 24C8.15193 23.9999 4.72647 22.1893 2.53027 19.376L23.8506 10.1045Z"/><path fill="#2F43D0" d="M12.002 0C13.284 1.96775e-05 14.5205 0.202111 15.6787 0.575195L8.42969 3.72754C7.86523 3.97351 7.52838 4.52468 7.52832 5.10449C7.52832 5.30444 7.56841 5.5063 7.65137 5.70117C7.98207 6.46094 8.8662 6.80922 9.62598 6.47852L19.1279 2.3457C20.8102 3.59046 22.155 5.26408 23.0029 7.2041L0.988281 16.7764C0.788163 16.3185 0.6183 15.8464 0.477539 15.3613L13.998 9.4834C14.5626 9.23748 14.9003 8.68654 14.9004 8.1084C14.9004 7.90828 14.8595 7.70577 14.7764 7.51074C14.4456 6.7512 13.5614 6.40176 12.8018 6.73242L0.00488281 12.2969C0.00149489 12.1986 0 12.1003 0 12.002C3.02398e-06 5.3743 5.3743 0 12.002 0Z"/></svg>`;

const CSS = `
@keyframes cl-top-in  {from{transform:translate(-8px,4.5px);opacity:0}to{transform:translate(0,0);opacity:1}}
@keyframes cl-bot-in  {from{transform:translate(8px,-4.5px);opacity:0}to{transform:translate(0,0);opacity:1}}
@keyframes cl-top-out {from{transform:translate(0,0);opacity:1}to{transform:translate(8px,-4.5px);opacity:0}}
@keyframes cl-bot-out {from{transform:translate(0,0);opacity:1}to{transform:translate(-8px,4.5px);opacity:0}}
.cl-top-in  {animation:cl-top-in  .5s cubic-bezier(.55,0,1,1) forwards}
.cl-bot-in  {animation:cl-bot-in  .5s cubic-bezier(.55,0,1,1) forwards}
.cl-top-out {animation:cl-top-out .4s cubic-bezier(0,0,.45,1) forwards}
.cl-bot-out {animation:cl-bot-out .4s cubic-bezier(0,0,.45,1) forwards}
`;

let _cssInjected = false;
function ensureCss() {
  if (_cssInjected) return;
  _cssInjected = true;
  const s = document.createElement('style');
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function CosmosLoader({ texto }: { texto?: string } = {}) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const t0Ref      = useRef<number | null>(null);
  const logoRef    = useRef<HTMLImageElement | null>(null);
  const svgVisible = useRef(false);
  const lastPh     = useRef(-1);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const pTopRef    = useRef<SVGPathElement>(null);
  const pBotRef    = useRef<SVGPathElement>(null);

  const [labelIdx,   setLabelIdx]   = useState(0);
  const [labelPhase, setLabelPhase] = useState<'visible' | 'exit' | 'enter'>('visible');

  useEffect(() => { ensureCss(); }, []);

  // Cycle labels every 1800ms
  useEffect(() => {
    const id = setInterval(() => {
      setLabelPhase('exit');
      setTimeout(() => {
        setLabelIdx(p => (p + 1) % LABELS.length);
        setLabelPhase('enter');
        requestAnimationFrame(() => requestAnimationFrame(() => setLabelPhase('visible')));
      }, 300);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Canvas RAF
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function satPos(s: typeof SATS[0], t: number, g: number) {
      const pull = 1 - g * 0.9, ang = t * s.spd + s.off, cr = s.orR * pull;
      const cZ = Math.cos(s.rotZ), sZ = Math.sin(s.rotZ);
      const ex = cr * Math.cos(ang), ey = cr * Math.sin(ang) * s.tiltX;
      return { x: CX + ex * cZ - ey * sZ, y: CY + ex * sZ + ey * cZ, depth: Math.sin(ang) };
    }

    function nucleus(a: number) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      const g = ctx.createLinearGradient(CX - NUC_R, CY - NUC_R, CX + NUC_R, CY + NUC_R);
      g.addColorStop(0, '#7B93E8'); g.addColorStop(1, '#2F43D0');
      ctx.beginPath(); ctx.arc(CX, CY, NUC_R, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill(); ctx.restore();
    }

    function drawSat(pos: { x: number; y: number; depth: number }, s: typeof SATS[0], ma: number) {
      if (ma <= 0) return;
      ctx.save(); ctx.globalAlpha = ma * (0.3 + 0.7 * ((pos.depth + 1) / 2));
      ctx.beginPath(); ctx.arc(pos.x, pos.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color; ctx.fill(); ctx.restore();
    }

    function orbit(t: number, gather: number, nucA: number, satA: number) {
      const pos = SATS.map(s => satPos(s, t, gather));
      pos.forEach((p, i) => { if (p.depth <= 0) drawSat(p, SATS[i], satA); });
      nucleus(nucA);
      pos.forEach((p, i) => { if (p.depth > 0) drawSat(p, SATS[i], satA); });
    }

    function rings(t: number, a: number) {
      if (a <= 0) return;
      [
        { freq: 2.2, ph: 0,            maxR: NUC_R * 1.65, base: 0.14 },
        { freq: 3.1, ph: Math.PI * 0.6, maxR: NUC_R * 1.3,  base: 0.26 },
        { freq: 1.8, ph: Math.PI * 1.2, maxR: NUC_R * 1.05, base: 0.46 },
      ].forEach(r => {
        const pulse = 0.82 + Math.sin(t * r.freq + r.ph) * 0.18;
        ctx.beginPath(); ctx.arc(CX, CY, r.maxR * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(47,67,208,${r.base * a})`; ctx.fill();
      });
    }

    function slideIn() {
      const wrap = svgWrapRef.current, top = pTopRef.current, bot = pBotRef.current;
      if (!wrap || !top || !bot) return;
      wrap.style.opacity = '1';
      top.style.transition = bot.style.transition = 'none';
      top.style.transform = 'translate(-8px,4.5px)'; bot.style.transform = 'translate(8px,-4.5px)';
      top.style.opacity = bot.style.opacity = '0';
      void top.getBoundingClientRect();
      top.classList.add('cl-top-in'); bot.classList.add('cl-bot-in');
    }

    function slideOut() {
      const wrap = svgWrapRef.current, top = pTopRef.current, bot = pBotRef.current;
      if (!wrap || !top || !bot) return;
      top.classList.remove('cl-top-in'); bot.classList.remove('cl-bot-in');
      top.classList.add('cl-top-out'); bot.classList.add('cl-bot-out');
      setTimeout(() => {
        if (!wrap) return;
        wrap.style.opacity = '0';
        top.classList.remove('cl-top-out'); bot.classList.remove('cl-bot-out');
        top.style.opacity = bot.style.opacity = '0';
      }, 420);
    }

    function frame(ts: number) {
      if (!t0Ref.current) t0Ref.current = ts;
      const elapsed = ts - t0Ref.current, t = elapsed / 1000;
      const { i: ph, p: prog, name } = getPhase(elapsed);

      if (ph === 0 && lastPh.current === SEQ.length - 1) svgVisible.current = false;
      lastPh.current = ph;
      ctx.clearRect(0, 0, W, H);

      if (name === 'orbit') {
        orbit(t, 0, 1, 1);
      } else if (name === 'converge') {
        orbit(t, easeIn(prog), 1, 1 - easeIn(prog));
      } else if (name === 'pulse') {
        rings(t, 1); nucleus(1);
      } else if (name === 'xfade-in') {
        const e = easeOut(prog);
        rings(t, 1 - e); nucleus(1 - e);
        if (logoRef.current) { ctx.globalAlpha = e; ctx.drawImage(logoRef.current, 8, 8, 20, 20); ctx.globalAlpha = 1; }
        if (prog > 0.6 && !svgVisible.current) {
          svgVisible.current = true; slideIn();
          setTimeout(() => ctx.clearRect(0, 0, W, H), 100);
        }
      } else if (name === 'xfade-out') {
        if (svgVisible.current && prog < 0.06) { svgVisible.current = false; slideOut(); }
        const a = easeOut(prog);
        orbit(t, 0, a, a);
      }
      // 'hold': canvas is clear, SVG is visible

      rafRef.current = requestAnimationFrame(frame);
    }

    const blob = new Blob([SVG_LOGO_STR], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      logoRef.current = img;
      URL.revokeObjectURL(url);
      rafRef.current = requestAnimationFrame(frame);
    };
    img.src = url;

    return () => {
      cancelAnimationFrame(rafRef.current);
      t0Ref.current = null;
      svgVisible.current = false;
      lastPh.current = -1;
    };
  }, []);

  const labelStyle: React.CSSProperties =
    labelPhase === 'visible'
      ? { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', opacity: 1, transition: 'opacity .3s ease, transform .3s ease', fontSize: 13, fontWeight: 400, letterSpacing: '.01em', whiteSpace: 'nowrap', color: 'rgba(16,24,64,0.6)' }
      : labelPhase === 'exit'
      ? { position: 'absolute', left: 0, top: '50%', transform: 'translateY(calc(-50% - 6px))', opacity: 0, transition: 'opacity .3s ease, transform .3s ease', fontSize: 13, fontWeight: 400, letterSpacing: '.01em', whiteSpace: 'nowrap', color: 'rgba(16,24,64,0.6)' }
      : { position: 'absolute', left: 0, top: '50%', transform: 'translateY(calc(-50% + 6px))', opacity: 0, transition: 'none', fontSize: 13, fontWeight: 400, letterSpacing: '.01em', whiteSpace: 'nowrap', color: 'rgba(16,24,64,0.6)' };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Spinner */}
      <Box sx={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
        <canvas ref={canvasRef} width={36} height={36} style={{ display: 'block', width: 36, height: 36 }} />
        {/* SVG logo overlay */}
        <Box ref={svgWrapRef} sx={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', opacity: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="cl-gr" x1="0" y1="14" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2F43D0" />
                <stop offset="100%" stopColor="#2F43D0" />
              </linearGradient>
            </defs>
            <path ref={pTopRef} fill="url(#cl-gr)" style={{ opacity: 0 }}
              d="M23.8506 10.1045C23.9489 10.7216 24 11.3538 24 11.998C24 12.4526 23.975 12.9028 23.9258 13.3438L15.9668 16.8047C15.4021 17.0506 15.0645 17.6034 15.0645 18.1816H15.0664C15.0664 18.3816 15.1065 18.5835 15.1895 18.7783C15.5202 19.5381 16.4043 19.8881 17.1641 19.5557L22.8779 17.0713C20.9683 21.1635 16.8127 24 11.998 24C8.15193 23.9999 4.72647 22.1893 2.53027 19.376L23.8506 10.1045Z"
            />
            <path ref={pBotRef} fill="url(#cl-gr)" style={{ opacity: 0 }}
              d="M12.002 0C13.284 1.96775e-05 14.5205 0.202111 15.6787 0.575195L8.42969 3.72754C7.86523 3.97351 7.52838 4.52468 7.52832 5.10449C7.52832 5.30444 7.56841 5.5063 7.65137 5.70117C7.98207 6.46094 8.8662 6.80922 9.62598 6.47852L19.1279 2.3457C20.8102 3.59046 22.155 5.26408 23.0029 7.2041L0.988281 16.7764C0.788163 16.3185 0.6183 15.8464 0.477539 15.3613L13.998 9.4834C14.5626 9.23748 14.9003 8.68654 14.9004 8.1084C14.9004 7.90828 14.8595 7.70577 14.7764 7.51074C14.4456 6.7512 13.5614 6.40176 12.8018 6.73242L0.00488281 12.2969C0.00149489 12.1986 0 12.1003 0 12.002C3.02398e-06 5.3743 5.3743 0 12.002 0Z"
            />
          </svg>
        </Box>
      </Box>

      {/* Label */}
      <Box sx={{ position: 'relative', height: '18px', overflow: 'hidden', minWidth: '160px' }}>
        {texto ? (
          <span style={{ fontSize: 13, fontWeight: 400, letterSpacing: '.01em', whiteSpace: 'nowrap', color: 'rgba(16,24,64,0.6)', lineHeight: '18px', display: 'block' }}>{texto}</span>
        ) : (
          <span style={labelStyle}>{LABELS[labelIdx]}</span>
        )}
      </Box>
    </Box>
  );
}
