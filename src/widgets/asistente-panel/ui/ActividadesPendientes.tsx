import { motion } from 'framer-motion';
import { Box, Chip, IconButton, List, ListItem, ListItemIcon, Tooltip, Typography } from '@mui/material';
import { IconArrowUpRight, IconChevronRight, IconX } from '@tabler/icons-react';

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const MotionBox = motion(Box);

interface ActividadItem {
  texto: string;
  cantidad?: number;
}

interface ActividadesPendientesProps {
  titulo?: string;
  items: ActividadItem[];
  onCerrar: () => void;
  onItemClick?: (texto: string) => void;
}

function BadgeConteo({ cantidad }: { cantidad: number }) {
  return (
    <Chip
      label={cantidad}
      size="small"
      variant="filled"
      color="default"
      sx={{ flexShrink: 0, height: 16, borderRadius: '4px', fontSize: '0.6875rem' }}
    />
  );
}

export function ActividadesPendientes({
  titulo = 'Actividades pendientes',
  items,
  onCerrar,
  onItemClick,
}: ActividadesPendientesProps) {
  return (
    <MotionBox
      layout
      transition={{ duration: 0.28, ease: EASE }}
      sx={{
        bgcolor: 'grey.50',
        border: '1px solid rgba(47,67,208,0.4)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1.5,
        width: '100%',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
          {titulo}
        </Typography>
        <IconButton size="small" onClick={onCerrar} sx={{ p: '3px' }}>
          <IconX size={16} />
        </IconButton>
      </Box>

      {/* Lista + scrollbar mock */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        <List disablePadding sx={{ flex: '1 0 0', minWidth: 0 }}>
          {items.map((item, index) => (
            <ListItem key={index} disablePadding>
              <Box
                onClick={() => onItemClick?.(item.texto)}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'center',
                  px: 2,
                  py: '4px',
                  width: '100%',
                  cursor: onItemClick ? 'pointer' : 'default',
                  borderRadius: 1,
                  '&:hover': onItemClick ? { bgcolor: 'action.hover' } : {},
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, flexShrink: 0, color: 'text.secondary' }}>
                  <IconArrowUpRight size={16} />
                </ListItemIcon>
                <Tooltip title={item.texto} placement="top" arrow enterDelay={600}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ flex: 1, minWidth: 0, color: 'text.primary', py: '4px' }}
                  >
                    {item.texto}
                  </Typography>
                </Tooltip>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
                  {item.cantidad !== undefined && <BadgeConteo cantidad={item.cantidad} />}
                  <IconButton size="small" sx={{ p: '3px' }}>
                    <IconChevronRight size={14} />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Scrollbar decorativa */}
        {/* <Box
          sx={{
            bgcolor: 'grey.200',
            borderLeft: '1px solid',
            borderColor: 'divider',
            alignSelf: 'stretch',
            flexShrink: 0,
            width: '15px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'grey.400',
              height: '44px',
              width: '7px',
              borderRadius: '100px',
            }}
          />
        </Box> */}
      </Box>
    </MotionBox>
  );
}
