import { Box, Chip, InputBase, Typography } from '@mui/material';
import { IconArrowUpRight, IconSearch } from '@tabler/icons-react';

const BRD_ITEMS = [
  { codigo: 'BRD-00856', empresa: 'Construcciones Almo S.A.', monto: '$ 4.000.000,00' },
  { codigo: 'BRD-093975', empresa: 'Sura', monto: '$ 3.500.000,00' },
  { codigo: 'BRD-028383', empresa: 'Éxito', monto: '$ 2.750.000,00' },
  { codigo: 'BRD-00223', empresa: 'Bancolombia', monto: '$ 5.200.000,00' },
];

const CONSULTA_ITEMS = [
  '¿El período del próximo mes ya está creado?',
  '¿Cuándo hay que abrir/cerrar [mes]?',
  '¿Cuáles documentos contables están abiertos actualmente?',
  'Balance del período contable actual',
];

interface PanelBuscadorProps {
  tipo: 'asiento' | 'consulta';
  onItemClick?: (texto: string) => void;
}

export function PanelBuscador({ tipo, onItemClick }: PanelBuscadorProps) {
  const placeholder = tipo === 'asiento' ? 'Buscar asiento contable' : 'Buscar la consulta';
  const width = tipo === 'asiento' ? 337 : 443;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '4px',
        boxShadow:
          '0px 3px 14px 2px rgba(93,109,126,0.09), 0px 8px 10px 1px rgba(93,109,126,0.14), 0px 5px 5px -3px rgba(93,109,126,0.18)',
        width,
        overflow: 'hidden',
        py: 1,
      }}
    >
        {/* Buscador */}
        <Box sx={{ px: 2, py: '4px', width: '100%' }}>
          <Box
            sx={{
              border: '1px solid rgba(16,24,64,0.2)',
              borderRadius: '4px',
              height: 32,
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              gap: 1,
            }}
          >
            <InputBase
              placeholder={placeholder}
              fullWidth
              sx={{
                fontSize: '0.8125rem',
                '& input': { color: 'text.secondary', padding: 0 },
                '& input::placeholder': { color: 'text.secondary', opacity: 1 },
              }}
            />
            <IconSearch size={16} style={{ flexShrink: 0, color: 'rgba(16,24,64,0.54)' }} />
          </Box>
        </Box>

        {/* Items */}
        {tipo === 'asiento'
          ? BRD_ITEMS.map((item, i) => (
              <Box
                key={i}
                onClick={() => onItemClick?.(item.codigo)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  px: 2,
                  py: '4px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
                  >
                    {item.codigo}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', whiteSpace: 'nowrap' }}
                  >
                    {item.empresa}
                  </Typography>
                </Box>
                <Chip
                  label={item.monto}
                  size="small"
                  variant="filled"
                  color="default"
                  sx={{ flexShrink: 0, height: 16, borderRadius: '4px', fontSize: '0.6875rem' }}
                />
              </Box>
            ))
          : CONSULTA_ITEMS.map((item, i) => (
              <Box
                key={i}
                onClick={() => onItemClick?.(item)}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'center',
                  px: 2,
                  py: '4px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ flexShrink: 0, color: 'text.secondary', display: 'flex' }}>
                  <IconArrowUpRight size={16} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.primary', py: '4px' }}>
                  {item}
                </Typography>
              </Box>
            ))}
    </Box>
  );
}
