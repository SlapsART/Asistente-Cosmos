import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import {
  IconAlertTriangle,
  IconChevronLeft,
  IconChevronRight,
  IconEyeOff,
  IconLayoutList,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Tarea } from '../model/tareas';

interface TareaBannerProps {
  tareas: Tarea[];
  onOcultar: () => void;
  onVerTodas?: () => void;
  onClickTarea?: () => void;
}

const WARNING_BORDER = '#fcaa4d';
const WARNING_BADGE = '#f96800';
const INTERVALO_MS = 4000;
// Constantes usadas por la VERSIÓN INTEGRADA (descomentar al activarla)
// const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
// const CHIPS_WIDTH = 192;
// const EYE_WIDTH = 22;

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        bgcolor: '#eaebec',
        border: 'none',
        borderRadius: '4px',
        px: '6px',
        py: '4px',
        fontSize: '0.6875rem',
        color: 'text.primary',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        lineHeight: '14px',
        letterSpacing: '0.16px',
        transition: 'background-color 0.15s',
        '&:hover': { bgcolor: '#d5d7d9' },
      }}
    >
      {children}
    </Box>
  );
}

export function TareaBanner({ tareas, onOcultar, onVerTodas, onClickTarea }: TareaBannerProps) {
  const [indice, setIndice] = useState(0);
  const [descartadas, setDescartadas] = useState<Set<number>>(new Set());
  const [hover, setHover] = useState(false);
  const [ocultarHover, setOcultarHover] = useState(false);
  const [dir, setDir] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibles = tareas.filter((t) => !descartadas.has(t.id));

  // Auto-carrusel: avanza cada INTERVALO_MS cuando no hay hover
  useEffect(() => {
    if (visibles.length <= 1 || hover) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setDir(1);
      setIndice((prev) => (prev + 1) % visibles.length);
    }, INTERVALO_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [visibles.length, hover]);

  if (visibles.length === 0) return null;

  const indiceReal = indice % visibles.length;
  const tarea = visibles[indiceReal];

  function descartar() {
    setDescartadas((prev) => new Set(prev).add(tarea.id));
    setDir(1);
    setIndice((prev) => {
      const nextVisibles = visibles.filter((t) => t.id !== tarea.id);
      if (nextVisibles.length === 0) return 0;
      return prev % nextVisibles.length;
    });
    setOcultarHover(false);
  }

  function anterior() {
    setDir(-1);
    setIndice((prev) => (prev - 1 + visibles.length) % visibles.length);
  }

  function siguiente() {
    setDir(1);
    setIndice((prev) => (prev + 1) % visibles.length);
  }

  const hayVarias = visibles.length > 1;

  const slideVariants = {
    enter: (d: number) => ({ x: d * 18, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -18, opacity: 0 }),
  };

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClickTarea}
      sx={{
        bgcolor: '#fbfbfb',
        border: `1px solid ${WARNING_BORDER}`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        pt: '8px',
        pb: '28px',
        px: '8px',
        mb: '-25px',
        width: '100%',
        position: 'relative',
        zIndex: 0,
        cursor: onClickTarea ? 'pointer' : 'default',
      }}
    >
      {/* Contenido con animación de carrusel */}
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', position: 'relative', height: 20 }}>
        <AnimatePresence custom={dir} mode="wait" initial={false}>
          <motion.div
            key={tarea.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <IconAlertTriangle size={14} color={WARNING_BADGE} />
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary', whiteSpace: 'nowrap' }}>
                {tarea.titulo}
              </Typography>
              <Box
                sx={{
                  bgcolor: WARNING_BADGE,
                  borderRadius: '100px',
                  px: '5px',
                  py: '2.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#fff', lineHeight: '11px', letterSpacing: '0.14px' }}>
                  {tarea.conteo}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', flexShrink: 0 }}>-</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tarea.descripcion}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Acciones de navegación — visibles en hover del banner */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          flexShrink: 0,
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: hover ? 'auto' : 'none',
        }}
      >
        {hayVarias && (
          <>
            <Tooltip title="Anterior" placement="top" arrow enterDelay={400}>
              <IconButton size="small" onClick={anterior} sx={{ p: '3px' }}>
                <IconChevronLeft size={14} color="rgba(16,24,64,0.54)" />
              </IconButton>
            </Tooltip>
            <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', minWidth: 28, textAlign: 'center' }}>
              {indiceReal + 1}/{visibles.length}
            </Typography>
            <Tooltip title="Siguiente" placement="top" arrow enterDelay={400}>
              <IconButton size="small" onClick={siguiente} sx={{ p: '3px' }}>
                <IconChevronRight size={14} color="rgba(16,24,64,0.54)" />
              </IconButton>
            </Tooltip>
          </>
        )}

        {/* Opción B: icon button "Ver todas" — independiente, visible en hover del banner */}
        <Tooltip title="Ver todas las tareas" placement="top" arrow enterDelay={400}>
          <IconButton size="small" onClick={onVerTodas} sx={{ p: '3px' }}>
            <IconLayoutList size={16} color="rgba(16,24,64,0.54)" />
          </IconButton>
        </Tooltip>

        {/* ── VERSIÓN FLOTANTE (activa) ─────────────────────────────────────────
             Chips aparecen flotando encima del banner al hacer hover en el ojo.
             Para activar: descomentar este bloque y comentar VERSIÓN INTEGRADA. */}
        <Box
          onMouseEnter={() => setOcultarHover(true)}
          onMouseLeave={() => setOcultarHover(false)}
          sx={{ position: 'relative' }}
        >
          <AnimatePresence>
            {ocultarHover && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{ position: 'absolute', bottom: 'calc(100% + 6px)', right: 0, display: 'flex', gap: 6, zIndex: 20 }}
              >
                <Chip onClick={descartar}>Quitar esta tarea</Chip>
                <Chip onClick={onOcultar}>Ocultar todas</Chip>
              </motion.div>
            )}
          </AnimatePresence>
          <IconButton size="small" sx={{ p: '3px' }}>
            <IconEyeOff size={16} color="rgba(16,24,64,0.54)" />
          </IconButton>
        </Box>
        {/* ── FIN VERSIÓN FLOTANTE ── */}

        {/* ── VERSIÓN INTEGRADA (comentada) ────────────────────────────────────
             Contenedor anima entre EYE_WIDTH y CHIPS_WIDTH (valores fijos, sin auto).
             Ojo y chips se superponen con position:absolute y cross-fade de opacity.
             Para activar: descomentar este bloque y comentar VERSIÓN FLOTANTE.
        <motion.div
          onMouseEnter={() => setOcultarHover(true)}
          onClick={(e) => e.stopPropagation()}
          animate={{ width: ocultarHover ? CHIPS_WIDTH : EYE_WIDTH }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{ position: 'relative', height: 22, overflow: 'hidden', flexShrink: 0 }}
        >
          <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', opacity: ocultarHover ? 0 : 1, pointerEvents: ocultarHover ? 'none' : 'auto', transition: 'opacity 0.15s ease' }}>
            <IconButton size="small" sx={{ p: '3px' }}>
              <IconEyeOff size={16} color="rgba(16,24,64,0.54)" />
            </IconButton>
          </Box>
          <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: '6px', opacity: ocultarHover ? 1 : 0, pointerEvents: ocultarHover ? 'auto' : 'none', transition: 'opacity 0.15s ease 0.08s' }}>
            <Chip onClick={descartar}>Quitar esta tarea</Chip>
            <Chip onClick={onOcultar}>Ocultar todas</Chip>
          </Box>
        </motion.div>
        ── FIN VERSIÓN INTEGRADA ── */}
      </Box>
    </Box>
  );
}
