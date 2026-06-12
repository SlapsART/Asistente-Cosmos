import { Box, IconButton, Typography } from '@mui/material';
import { IconChevronLeft, IconChevronRight, IconChevronDown } from '@tabler/icons-react';

const DIAS_SEMANA = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Diciembre 2023: empieza en viernes (col 5, 0-indexed Sunday=0)
const SEMANAS = [
  [null, null, null, null, null, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29, 30],
  [31, null, null, null, null, null, null],
];

const HOY = 5;
const SELECCIONADO = 14;

function DiaCelda({ dia }: { dia: number | null }) {
  if (dia === null) return <Box sx={{ width: 36, height: 36 }} />;

  const esHoy = dia === HOY;
  const esSeleccionado = dia === SELECCIONADO;

  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        cursor: 'pointer',
        position: 'relative',
        bgcolor: esSeleccionado ? 'primary.main' : 'transparent',
        border: esHoy && !esSeleccionado ? '1px solid' : 'none',
        borderColor: esHoy ? 'primary.main' : 'transparent',
        '&:hover': {
          bgcolor: esSeleccionado ? 'primary.dark' : 'action.hover',
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: esSeleccionado ? '#fff' : esHoy ? 'primary.main' : 'text.primary',
          fontWeight: esHoy || esSeleccionado ? 500 : 400,
        }}
      >
        {dia}
      </Typography>
    </Box>
  );
}

export function PanelCalendario() {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid rgba(47,67,208,0.12)',
        borderRadius: '8px',
        boxShadow:
          '0px 3px 14px 2px rgba(47,67,208,0.09), 2px 4px 6px 1px rgba(182,192,255,0.14), 2px 4px 4px -3px rgba(182,192,255,0.2)',
        width: 320,
        p: 2,
      }}
    >
        {/* Header mes */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              December 2023
            </Typography>
            <IconChevronDown size={16} style={{ color: 'rgba(16,24,64,0.54)' }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ p: '4px' }}>
              <IconChevronLeft size={16} />
            </IconButton>
            <IconButton size="small" sx={{ p: '4px' }}>
              <IconChevronRight size={16} />
            </IconButton>
          </Box>
        </Box>

        {/* Cabecera días de semana */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: '2px', mb: 0.5 }}>
          {DIAS_SEMANA.map((d, i) => (
            <Box key={i} sx={{ width: 36, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {d}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Grid de días */}
        {SEMANAS.map((semana, si) => (
          <Box key={si} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: '2px' }}>
            {semana.map((dia, di) => (
              <DiaCelda key={di} dia={dia} />
            ))}
          </Box>
        ))}
    </Box>
  );
}
