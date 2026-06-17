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
import { CONVERSACIONES_DEMO } from '../model/conversaciones';
import type { ConversacionData } from '../model/conversaciones';

const PRIMARY = '#2f43d0';

interface ConversacionItemProps {
  conv: ConversacionData;
  activa: boolean;
  onSelect: () => void;
  onAnclar?: () => void;
}

function ConversacionItem({ conv, activa, onSelect, onAnclar }: ConversacionItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box
      onClick={onSelect}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: '4px',
        cursor: 'pointer',
        bgcolor: activa ? 'rgba(47,67,208,0.06)' : 'transparent',
        '&:hover': { bgcolor: activa ? 'rgba(47,67,208,0.08)' : 'rgba(16,24,64,0.04)' },
        '&:hover .dots-btn': { opacity: 1 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
        {conv.grupo === 'anclada' ? (
          <IconBookmark size={13} color="rgba(16,24,64,0.45)" style={{ flexShrink: 0 }} />
        ) : (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: activa ? PRIMARY : 'transparent',
              border: activa ? 'none' : '1.5px solid rgba(16,24,64,0.28)',
            }}
          />
        )}
        <Typography
          variant="body2"
          noWrap
          sx={{
            fontSize: '0.8125rem',
            color: activa ? PRIMARY : 'text.primary',
            fontWeight: activa ? 500 : 400,
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
          onClick={(e) => { e.stopPropagation(); setAnchorEl(null); onAnclar?.(); }}
          sx={{ gap: 1.5, fontSize: '0.8125rem', py: '6px' }}
        >
          {conv.grupo === 'anclada' ? <IconBookmarkOff size={14} /> : <IconPin size={14} />}
          {conv.grupo === 'anclada' ? 'Desanclar' : 'Anclar'}
        </MenuItem>
        <MenuItem
          onClick={(e) => { e.stopPropagation(); setAnchorEl(null); }}
          sx={{ gap: 1.5, fontSize: '0.8125rem', py: '6px' }}
        >
          <IconShare size={14} />
          Compartir
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={(e) => { e.stopPropagation(); setAnchorEl(null); }}
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
  conversacionActivaId?: number;
  onSelectConversacion?: (id: number) => void;
  conversaciones?: ConversacionData[];
}

export function HistorialDrawer({
  onClose,
  anclado = false,
  onAnclar,
  onDesanclar,
  conversacionActivaId,
  onSelectConversacion,
  conversaciones,
}: HistorialDrawerProps) {
  const [busqueda, setBusqueda] = useState('');

  const lista = conversaciones ?? CONVERSACIONES_DEMO;

  const filtradas = busqueda.trim()
    ? lista.filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : null;

  const ancladas = (filtradas ?? lista).filter((c) => c.grupo === 'anclada');
  const recientes = (filtradas ?? lista).filter((c) => c.grupo === 'reciente');
  const otras = (filtradas ?? lista).filter((c) => c.grupo === 'otra');

  function handleSelect(id: number) {
    onSelectConversacion?.(id);
    onClose();
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
      {/* Header */}
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

      {/* Search */}
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
      <Box sx={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,24,64,0.15) transparent' }}>
        {anclado && ancladas.length > 0 && (
          <>
            <GroupLabel>Anclado</GroupLabel>
            {ancladas.map((c) => (
              <ConversacionItem
                key={c.id}
                conv={c}
                activa={c.id === conversacionActivaId}
                onSelect={() => handleSelect(c.id)}
                onAnclar={onDesanclar}
              />
            ))}
          </>
        )}

        {recientes.length > 0 && (
          <>
            <GroupLabel>Recientes</GroupLabel>
            {recientes.map((c) => (
              <ConversacionItem
                key={c.id}
                conv={c}
                activa={c.id === conversacionActivaId}
                onSelect={() => handleSelect(c.id)}
                onAnclar={onAnclar}
              />
            ))}
          </>
        )}

        {otras.length > 0 && (
          <>
            <GroupLabel>Otras conversaciones</GroupLabel>
            {otras.map((c) => (
              <ConversacionItem
                key={c.id}
                conv={c}
                activa={c.id === conversacionActivaId}
                onSelect={() => handleSelect(c.id)}
                onAnclar={onAnclar}
              />
            ))}
          </>
        )}

        {filtradas !== null && filtradas.length === 0 && (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: '0.8125rem' }}>
              Sin resultados para "{busqueda}"
            </Typography>
          </Box>
        )}

        {otras.length > 0 && !busqueda && (
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontSize: '0.8125rem', cursor: 'pointer', '&:hover': { color: PRIMARY } }}
            >
              Mostrar 8 más...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
