import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import {
  IconAlertTriangle,
  IconChevronLeft,
  IconChevronRight,
  IconLayoutList,
  IconX,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Tarea } from '../model/tareas';

interface TareaBannerProps {
  tareas: Tarea[];
  onOcultar: () => void;
  onVerTodas?: () => void;
  onClickTarea?: () => void;
}

const INTERVALO_MS = 4000;

export function TareaBanner({ tareas, onOcultar, onVerTodas, onClickTarea }: TareaBannerProps) {
  const [indice, setIndice] = useState(0);
  const [hover, setHover] = useState(false);
  const [dir, setDir] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibles = tareas;

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
        border: '1px solid',
        borderColor: 'grey.400',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        pt: '8px',
        pb: '28px',
        px: '8px',
        mb: '-30px',
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
              <Box component="span" sx={{ color: 'warning.main', display: 'flex' }}>
                <IconAlertTriangle size={14} color="currentColor" />
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary', whiteSpace: 'nowrap' }}>
                {tarea.titulo}
              </Typography>
              <Box
                sx={{
                  bgcolor: 'grey.300',
                  borderRadius: '100px',
                  px: '5px',
                  py: '2.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: 'text.secondary', lineHeight: '11px', letterSpacing: '0.14px' }}>
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

        <Tooltip title="Ver todas las tareas" placement="top" arrow enterDelay={400}>
          <IconButton size="small" onClick={onVerTodas} sx={{ p: '3px' }}>
            <IconLayoutList size={16} color="rgba(16,24,64,0.54)" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Ocultar tareas" placement="top" arrow enterDelay={400}>
          <IconButton size="small" onClick={onOcultar} sx={{ p: '3px' }}>
            <IconX size={16} color="rgba(16,24,64,0.54)" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
