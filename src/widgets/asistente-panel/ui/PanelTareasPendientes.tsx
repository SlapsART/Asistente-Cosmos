import { useState } from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { IconAlertCircle, IconAlertTriangle, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

type Modulo = 'obligaciones' | 'contabilidad' | 'terceros' | 'impuestos';

interface TareaItem {
  id: string;
  titulo: string;
  cantidad: number;
  descripcion: string;
  tipo: 'alerta' | 'advertencia';
}

const TAREAS: Record<Modulo, { label: string; items: TareaItem[] }> = {
  obligaciones: {
    label: 'Obligaciones por pagar',
    items: [
      { id: '1', titulo: 'Revisar extractos devueltos', cantidad: 3, descripcion: 'El más antiguo lleva 3 días sin corregir', tipo: 'alerta' },
      { id: '2', titulo: 'Corregir obligaciones devueltas', cantidad: 3, descripcion: 'La más antigua lleva 4 días sin corregir', tipo: 'alerta' },
      { id: '3', titulo: 'Emitir DSE DIAN', cantidad: 3, descripcion: '"El soporte adjunto no corresponde al pe…" · Laura González Castil…', tipo: 'advertencia' },
      { id: '4', titulo: 'Resolver duplicados detectados', cantidad: 3, descripcion: 'Detectados hace 2 días', tipo: 'advertencia' },
      { id: '5', titulo: 'Validar pagos en tránsito', cantidad: 5, descripcion: 'Pendientes de confirmación bancaria', tipo: 'advertencia' },
    ],
  },
  contabilidad: {
    label: 'Contabilidad',
    items: [
      { id: '6', titulo: 'Borradores pendientes por revisar', cantidad: 20, descripcion: 'El más antiguo lleva 5 días sin revisar', tipo: 'alerta' },
      { id: '7', titulo: 'Borradores devueltos sin corregir', cantidad: 5, descripcion: 'El más antiguo lleva 3 días devuelto', tipo: 'alerta' },
      { id: '8', titulo: 'Periodos por cerrar', cantidad: 2, descripcion: 'Período anterior pendiente de cierre', tipo: 'advertencia' },
    ],
  },
  terceros: {
    label: 'Terceros',
    items: [
      { id: '9', titulo: 'RUT pendientes de actualización', cantidad: 8, descripcion: 'Vencen en los próximos 7 días', tipo: 'advertencia' },
      { id: '10', titulo: 'Validación DIAN pendiente', cantidad: 4, descripcion: 'Terceros sin verificar', tipo: 'alerta' },
    ],
  },
  impuestos: {
    label: 'Impuestos',
    items: [
      { id: '11', titulo: 'Declaraciones próximas a vencer', cantidad: 3, descripcion: 'Vencen esta semana', tipo: 'alerta' },
      { id: '12', titulo: 'Retenciones pendientes de reporte', cantidad: 6, descripcion: 'Período actual', tipo: 'advertencia' },
    ],
  },
};

const MODULO_KEYS: Modulo[] = ['obligaciones', 'contabilidad', 'terceros', 'impuestos'];
const BADGE_BG = '#eaebec';
const BADGE_TEXT = 'rgba(16,24,64,0.6)';
const PRIMARY = '#2f43d0';
const ALERTA_COLOR = '#d32f2f';
const ADVERTENCIA_COLOR = '#ed6c02';

function TareaRow({ tarea }: { tarea: TareaItem }) {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        px: 2,
        py: '6px',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'rgba(16,24,64,0.02)' },
      }}
    >
      {tarea.tipo === 'alerta' ? (
        <IconAlertCircle size={14} color={ALERTA_COLOR} style={{ flexShrink: 0, marginTop: 1 }} />
      ) : (
        <IconAlertTriangle size={14} color={ADVERTENCIA_COLOR} style={{ flexShrink: 0, marginTop: 1 }} />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: hover ? PRIMARY : 'text.primary',
              lineHeight: '16px',
              letterSpacing: '0.17px',
              transition: 'color 0.15s',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {tarea.titulo}
          </Typography>
          <Box
            sx={{
              bgcolor: BADGE_BG,
              borderRadius: '100px',
              px: '5px',
              py: '2.5px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.6875rem',
                color: BADGE_TEXT,
                fontWeight: 500,
                lineHeight: '11px',
                letterSpacing: '0.14px',
              }}
            >
              {tarea.cantidad}
            </Typography>
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: '0.8125rem',
            color: 'text.secondary',
            lineHeight: '16px',
            letterSpacing: '0.17px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mt: '2px',
          }}
        >
          {tarea.descripcion}
        </Typography>
      </Box>
    </Box>
  );
}

interface PanelTareasPendientesProps {
  onCerrar: () => void;
}

export function PanelTareasPendientes({ onCerrar }: PanelTareasPendientesProps) {
  const [moduloActivo, setModuloActivo] = useState<Modulo>('obligaciones');

  return (
    // layout anima el cambio de altura del panel cuando el módulo cambia
    <motion.div
      layout
      transition={{ duration: 0.22, ease: EASE }}
      style={{
        background: '#fbfbfb',
        border: '1px solid rgba(47,67,208,0.4)',
        borderRadius: '8px',
        boxShadow: '0px 4px 24px rgba(0,0,0,0.1), 0px 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        overflow: 'hidden',
        width: 656,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'text.primary',
            lineHeight: '16px',
            letterSpacing: '0.1px',
          }}
        >
          Tareas pendientes
        </Typography>
        <IconButton size="small" onClick={onCerrar} sx={{ p: '3px' }}>
          <IconX size={16} color="rgba(16,24,64,0.38)" />
        </IconButton>
      </Box>

      {/* Module filter chips */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {MODULO_KEYS.map((key) => {
          const isActivo = key === moduloActivo;
          return (
            <Chip
              key={key}
              label={TAREAS[key].label}
              size="medium"
              variant={isActivo ? 'filled' : 'outlined'}
              color={isActivo ? 'primary' : 'default'}
              onClick={() => setModuloActivo(key)}
              sx={{ cursor: 'pointer', flexShrink: 0 }}
            />
          );
        })}
      </Box>

      {/* Task list — fade entre módulos, layout anima el cambio de altura */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={moduloActivo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14, ease: EASE }}
          style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollbarWidth: 'thin' }}
        >
          {TAREAS[moduloActivo].items.map((tarea) => (
            <TareaRow key={tarea.id} tarea={tarea} />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
