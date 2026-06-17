import { Box, Typography } from '@mui/material';
import { IconAlertCircle, IconFile, IconX } from '@tabler/icons-react';

export interface ArchivoAdjunto {
  nombre: string;
  tamaño: string;
  formato: string;
  estado: 'exito' | 'error';
  mensajeError?: string;
}

export function FileChip({ archivo, onRemover }: { archivo: ArchivoAdjunto; onRemover: () => void }) {
  const esError = archivo.estado === 'error';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        p: '4px',
        borderRadius: '14px',
        flexShrink: 0,
        background: esError
          ? 'linear-gradient(90deg, rgba(198,52,52,0.04), rgba(198,52,52,0.04)), #fff'
          : 'linear-gradient(90deg, rgba(47,67,208,0.08), rgba(47,67,208,0.08)), #fff',
      }}
    >
      <Box
        sx={{
          bgcolor: esError ? '#f9e8e8' : '#e1e6ff',
          borderRadius: '10px',
          width: 28,
          alignSelf: 'stretch',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {esError
          ? <IconAlertCircle size={16} color="#c63434" />
          : <IconFile size={20} color="#2f43d0" />
        }
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontSize: '11px', lineHeight: '14px', letterSpacing: '0.4px', color: 'text.primary', whiteSpace: 'nowrap' }}>
          {archivo.nombre}
        </Typography>
        {esError ? (
          <Typography sx={{ fontSize: '11px', lineHeight: '14px', letterSpacing: '0.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {archivo.mensajeError ?? 'Límite alcanzado máx 5mb'}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '11px', lineHeight: '14px', letterSpacing: '0.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {archivo.tamaño}
            </Typography>
            <Typography sx={{ fontSize: '11px', lineHeight: '14px', letterSpacing: '0.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>
              -
            </Typography>
            <Typography sx={{ fontSize: '11px', lineHeight: '14px', letterSpacing: '0.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {archivo.formato}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        component="button"
        onClick={onRemover}
        sx={{
          border: 'none',
          cursor: 'pointer',
          bgcolor: esError ? 'rgba(198,52,52,0.04)' : 'rgba(47,67,208,0.04)',
          borderRadius: '50%',
          p: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '&:hover': {
            bgcolor: esError ? 'rgba(198,52,52,0.12)' : 'rgba(47,67,208,0.12)',
          },
        }}
      >
        <IconX size={10} />
      </Box>
    </Box>
  );
}
