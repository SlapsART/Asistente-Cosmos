import { useState, useEffect } from 'react';
import { Box, Chip, Divider, IconButton, InputBase, Typography } from '@mui/material';
import {
  IconArrowUp,
  IconBoxAlignRight,
  IconLayoutDashboard,
  IconMessageSearch,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react';

// Color primario del diseño Figma (distinto de primary.main del tema)
const FIGMA_PRIMARY = '#2f43d0';

const QUICK_ACTIONS = [
  'Actividades pendientes',
  'Reportes de gestión',
  'Periodos contables',
  'Reglas de derivación',
];

interface AsistenteInputProps {
  chipActivo: string;
  chipActivoTipo: 'primario' | 'sub' | null;
  inputTexto?: string;
  inputChips?: string[];
  onChipClick: (chip: string) => void;
  onMinimizar: () => void;
  onVerHistorial: () => void;
  onExpandir: () => void;
  onVerMas: () => void;
  onEnviar?: (texto: string) => void;
  showTopActions?: boolean;
  /** embedded: sin card propio (integrado dentro de otro contenedor) */
  variant?: 'card' | 'embedded';
}

export function AsistenteInput({
  chipActivo,
  chipActivoTipo,
  inputTexto,
  inputChips = [],
  onChipClick,
  onMinimizar,
  onVerHistorial,
  onExpandir,
  onVerMas,
  onEnviar,
  showTopActions = true,
  variant = 'card',
}: AsistenteInputProps) {
  const [localTexto, setLocalTexto] = useState(inputTexto ?? '');

  useEffect(() => {
    setLocalTexto(inputTexto ?? '');
  }, [inputTexto]);

  const tieneTexto = Boolean(localTexto);
  const isCard = variant === 'card';

  return (
    <Box
      sx={{
        ...(isCard
          ? {
              bgcolor: '#f5f5f6',
              border: '1px solid rgba(47,67,208,0.12)',
              borderRadius: '8px',
              boxShadow:
                '0px 3px 14px 2px rgba(47,67,208,0.09), 2px 4px 6px 1px rgba(182,192,255,0.14), 2px 4px 4px -3px rgba(182,192,255,0.2)',
            }
          : {}),
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
        overflow: 'hidden',
        px: 1.5,
        py: 1,
        width: '100%',
      }}
    >
      {/* Acciones superiores — solo expandir y minimizar (Figma proto-01 estado 17) */}
      {showTopActions && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <IconButton size="small" onClick={onExpandir} sx={{ p: '3px' }}>
              <IconBoxAlignRight size={16} />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: '12px', alignSelf: 'center' }} />
            <IconButton size="small" onClick={onMinimizar} sx={{ p: '3px' }}>
              <IconMinus size={16} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Fila principal: columna (pill + chips) + historial a la derecha */}
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', width: '100%' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          {/* Campo de entrada */}
          <Box
            sx={{
              bgcolor: 'grey.100',
              border: '1px solid rgba(47,67,208,0.4)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: 1,
              pr: 0.75,
              py: 0.75,
            }}
          >
            <IconButton size="small" sx={{ p: '3px', flexShrink: 0 }}>
              <IconPlus size={14} />
            </IconButton>

            <Box
              sx={{ display: 'flex', flex: '1 0 0', gap: '8px', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}
            >
              <InputBase
                value={localTexto}
                onChange={(e) => setLocalTexto(e.target.value)}
                placeholder="Describe lo que necesitas..."
                inputProps={inputChips.length > 0 ? { size: Math.max(localTexto.length + 1, 2) } : undefined}
                sx={{
                  flex: inputChips.length > 0 ? '0 0 auto' : '1 0 0',
                  minWidth: 0,
                  fontSize: '0.8125rem',
                  color: 'text.primary',
                  '& input': {
                    padding: 0,
                    '&::placeholder': { color: 'text.secondary', opacity: 1 },
                  },
                }}
              />

              {/* Chips de contexto en el input */}
              {inputChips.map((chip, i) => (
                <Chip
                  key={i}
                  label={chip}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{
                    flexShrink: 0,
                    '&&': {
                      border: '1px solid rgba(47,67,208,0.5)',
                      color: 'text.secondary',
                    },
                  }}
                />
              ))}
            </Box>

            {/* Botón submit */}
            <Box
              sx={{
                bgcolor: tieneTexto ? FIGMA_PRIMARY : 'rgba(47,67,208,0.3)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background-color 0.2s',
              }}
            >
              <IconButton
                size="small"
                disabled={!tieneTexto}
                onClick={tieneTexto ? () => { onEnviar?.(localTexto); setLocalTexto(''); } : undefined}
                sx={{
                  p: '4px',
                  color: tieneTexto ? '#fff !important' : 'rgba(47,67,208,0.3) !important',
                }}
              >
                <IconArrowUp size={20} />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flex: '1 0 0',
                gap: 1,
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {QUICK_ACTIONS.map((accion) => {
                const isActive = accion === chipActivo;
                const esPrimario = isActive && chipActivoTipo === 'primario';
                const esSub = isActive && chipActivoTipo === 'sub';

                return (
                  <Chip
                    key={accion}
                    label={accion}
                    size="medium"
                    variant="filled"
                    color={esPrimario ? 'primary' : 'default'}
                    onClick={() => onChipClick(accion)}
                    sx={{
                      flexShrink: 0,
                      cursor: 'pointer',
                      ...(esSub ? { '&&': { color: FIGMA_PRIMARY } } : {}),
                    }}
                  />
                );
              })}

              {/* Fade overflow */}
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '32px',
                  background: isCard
                    ? 'linear-gradient(to right, rgba(245,245,246,0), #f5f5f6)'
                    : 'linear-gradient(to right, rgba(255,255,255,0), white)',
                  pointerEvents: 'none',
                }}
              />
            </Box>

            <Chip
              label="Ver más"
              size="medium"
              variant="outlined"
              icon={<IconLayoutDashboard size={14} />}
              onClick={onVerMas}
              sx={{ flexShrink: 0 }}
            />
          </Box>
        </Box>

        {/* Historial — a la derecha del bloque pill+chips, centrado (Figma proto-01 estado 17) */}
        {showTopActions && (
          <IconButton size="small" onClick={onVerHistorial} sx={{ p: '3px', flexShrink: 0 }}>
            <IconMessageSearch size={16} />
          </IconButton>
        )}
      </Box>

      {/* Footer disclaimer */}
      <Typography
        variant="caption"
        sx={{ color: 'text.disabled', textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: '0.4px' }}
      >
        El contenido generado por IA puede ser incorrecto.
      </Typography>
    </Box>
  );
}
