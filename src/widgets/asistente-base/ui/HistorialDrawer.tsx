import { useState } from 'react';
import { Box, Divider, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography } from '@mui/material';
import {
  IconBookmark,
  IconBookmarkOff,
  IconDotsVertical,
  IconMessageSearch,
  IconPin,
  IconSearch,
  IconShare,
  IconTrash,
  IconX,
} from '@tabler/icons-react';

const PRIMARY = '#2f43d0';

interface Conversacion {
  id: number;
  nombre: string;
  tiempo: string;
  activa?: boolean;
  anclada?: boolean;
}

const ANCLADAS: Conversacion[] = [
  { id: 0, nombre: 'Generación OXP Mayo', tiempo: 'hace 2 semanas', anclada: true },
];

const RECIENTES: Conversacion[] = [
  { id: 1, nombre: 'Generación OXP Mayo', tiempo: 'ahora', activa: true },
  { id: 2, nombre: 'Generación OXP Mayo', tiempo: 'ayer' },
  { id: 3, nombre: 'Generación OXP Mayo', tiempo: 'hace 2 semanas' },
  { id: 4, nombre: 'Generación OXP Mayo', tiempo: 'hace 3 semanas' },
  { id: 5, nombre: 'Generación OXP Mayo', tiempo: 'hace 4 semanas' },
];

const OTRAS: Conversacion[] = [
  { id: 6, nombre: 'Generación OXP Mayo', tiempo: 'hace 5 semanas' },
  { id: 7, nombre: 'Generación OXP Mayo', tiempo: 'hace 5 semanas' },
  { id: 8, nombre: 'Generación OXP Mayo', tiempo: 'hace 5 semanas' },
  { id: 9, nombre: 'Generación OXP Mayo', tiempo: 'hace 5 semanas' },
  { id: 10, nombre: 'Generación OXP Mayo', tiempo: 'hace 5 semanas' },
];

interface ConversacionItemProps {
  conv: Conversacion;
  onAnclar?: () => void;
}

function ConversacionItem({ conv, onAnclar }: ConversacionItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: '4px',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'rgba(16,24,64,0.04)' },
        '&:hover .dots-btn': { opacity: 1 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
        {/* Bullet */}
        {conv.anclada ? (
          <IconBookmark size={13} color="rgba(16,24,64,0.45)" style={{ flexShrink: 0 }} />
        ) : (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: conv.activa ? PRIMARY : 'transparent',
              border: conv.activa ? 'none' : '1.5px solid rgba(16,24,64,0.28)',
            }}
          />
        )}
        <Typography
          variant="body2"
          noWrap
          sx={{
            fontSize: '0.8125rem',
            color: conv.activa ? PRIMARY : 'text.primary',
            fontWeight: conv.activa ? 500 : 400,
          }}
        >
          {conv.nombre}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, ml: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6875rem', whiteSpace: 'nowrap' }}>
          {conv.tiempo}
        </Typography>
        <IconButton
          className="dots-btn"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
          sx={{ p: '2px', opacity: 0, transition: 'opacity 0.15s' }}
        >
          <IconDotsVertical size={13} />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: { sx: { boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', borderRadius: '6px', minWidth: 160 } },
        }}
      >
        <MenuItem
          onClick={() => { setAnchorEl(null); onAnclar?.(); }}
          sx={{ gap: 1.5, fontSize: '0.8125rem', py: '6px' }}
        >
          {conv.anclada ? <IconBookmarkOff size={14} /> : <IconPin size={14} />}
          {conv.anclada ? 'Desanclar' : 'Anclar'}
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ gap: 1.5, fontSize: '0.8125rem', py: '6px' }}>
          <IconShare size={14} />
          Compartir
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => setAnchorEl(null)}
          sx={{ gap: 1.5, fontSize: '0.8125rem', py: '6px', color: 'error.main' }}
        >
          <IconTrash size={14} />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        display: 'block',
        px: 2,
        py: 0.5,
        color: 'rgba(16,24,64,0.6)',
        fontWeight: 400,
        fontSize: '0.6875rem',
        letterSpacing: '0.4px',
      }}
    >
      {children}
    </Typography>
  );
}

interface HistorialDrawerProps {
  onClose: () => void;
  anclado?: boolean;
  onAnclar?: () => void;
  onDesanclar?: () => void;
}

export function HistorialDrawer({ onClose, anclado = false, onAnclar, onDesanclar }: HistorialDrawerProps) {
  const [busqueda, setBusqueda] = useState('');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {/* DrawerHeader */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          flexShrink: 0,
          bgcolor: '#fbfbfb',
          borderBottom: '1px solid rgba(16,24,64,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconMessageSearch size={16} color={PRIMARY} style={{ flexShrink: 0 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.primary' }}>
            Historial de conversaciones
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ p: '3px' }}>
          <IconX size={16} color="rgba(16,24,64,0.54)" />
        </IconButton>
      </Box>

      {/* Search field */}
      <Box sx={{ px: 2, pt: 1.5, pb: 2, flexShrink: 0 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Busca una conversación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconSearch size={14} color="rgba(16,24,64,0.38)" />
              </InputAdornment>
            ),
            sx: { fontSize: '0.8125rem', bgcolor: '#fff' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
              '& fieldset': { borderColor: 'rgba(16,24,64,0.2)' },
            },
          }}
        />
      </Box>

      {/* Lista */}
      <Box sx={{ flex: 1 /*, overflowY: 'auto' */ }}>
        {/* Sección anclada */}
        {anclado && (
          <>
            <GroupLabel>Anclado</GroupLabel>
            {ANCLADAS.map((c) => (
              <ConversacionItem key={c.id} conv={c} onAnclar={onDesanclar} />
            ))}
          </>
        )}

        {/* Recientes */}
        <GroupLabel>Recientes</GroupLabel>
        {RECIENTES.map((c) => (
          <ConversacionItem key={c.id} conv={c} onAnclar={onAnclar} />
        ))}

        {/* Otras conversaciones */}
        <GroupLabel>Otras conversaciones</GroupLabel>
        {OTRAS.map((c) => (
          <ConversacionItem key={c.id} conv={c} onAnclar={onAnclar} />
        ))}

        {/* Mostrar más */}
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              '&:hover': { color: PRIMARY },
            }}
          >
            Mostrar 8 más...
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
