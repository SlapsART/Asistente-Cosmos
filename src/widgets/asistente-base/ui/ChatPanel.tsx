import { useState } from 'react';
import { Box, Divider, IconButton, InputBase, Typography } from '@mui/material';
import {
  IconBookmark,
  IconCopy,
  IconDots,
  IconLayoutSidebarRight,
  IconMessageSearch,
  IconMinus,
  IconPencil,
  IconPlus,
  IconRefresh,
  IconUsers,
} from '@tabler/icons-react';
import { AsistenteInput } from '@/widgets/asistente-panel/ui/AsistenteInput';

const PRIMARY = '#2f43d0';

interface Mensaje {
  id: number;
  autor: 'usuario' | 'agente';
  texto: string;
  hora?: string;
  esContextoNuevo?: boolean;
}

const MENSAJES_DEMO: Mensaje[] = [
  { id: 1, autor: 'usuario', texto: 'Usuario ingresa su solicitud', hora: '10:24' },
  { id: 2, autor: 'agente', texto: 'La respuesta del agente luego de analizar la entrada del usuario' },
  { id: 3, autor: 'usuario', texto: 'Usuario ingresa su solicitud', hora: '10:25', esContextoNuevo: true },
  { id: 4, autor: 'agente', texto: 'La respuesta del agente luego de analizar la entrada del usuario' },
  { id: 5, autor: 'usuario', texto: 'Usuario ingresa su solicitud', hora: '10:26' },
  { id: 6, autor: 'agente', texto: 'La respuesta del agente luego de analizar la entrada del usuario' },
];

function UserMessage({ mensaje }: { mensaje: Mensaje }) {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', pl: 7 }}
    >
      <Box
        sx={{
          bgcolor: 'rgba(47,67,208,0.08)',
          borderRadius: '4px 4px 0 4px',
          px: 1,
          py: 0.5,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.8125rem' }}>
          {mensaje.texto}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
      >
        {mensaje.hora && (
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6875rem' }}>
            {mensaje.hora}
          </Typography>
        )}
        <IconButton size="small" sx={{ p: '2px' }}><IconRefresh size={13} /></IconButton>
        <IconButton size="small" sx={{ p: '2px' }}><IconPencil size={13} /></IconButton>
        <IconButton size="small" sx={{ p: '2px' }}><IconCopy size={13} /></IconButton>
      </Box>
    </Box>
  );
}

function AgenteMessage({ mensaje }: { mensaje: Mensaje }) {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', pr: 7 }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
        {mensaje.texto}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
      >
        <IconButton size="small" sx={{ p: '2px' }}><IconCopy size={13} /></IconButton>
        <IconButton size="small" sx={{ p: '2px' }}><IconRefresh size={13} /></IconButton>
        <IconButton size="small" sx={{ p: '2px' }}><IconDots size={13} /></IconButton>
      </Box>
    </Box>
  );
}

function ContextSeparator() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
      <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(16,24,64,0.1)' }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: 'rgba(47,67,208,0.06)',
          borderRadius: '10px',
          px: 1,
          py: '2px',
          flexShrink: 0,
        }}
      >
        <IconBookmark size={12} color={PRIMARY} />
        <Typography variant="caption" sx={{ color: PRIMARY, fontSize: '0.6875rem', fontWeight: 500 }}>
          Nuevo contexto
        </Typography>
      </Box>
      <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(16,24,64,0.1)' }} />
    </Box>
  );
}

interface ChatPanelProps {
  modo: 'flotante' | 'lateral';
  conMensajes?: boolean;
  onHistorial?: () => void;
  onLateral?: () => void;
  onMinimizar?: () => void;
  onNueva?: () => void;
  /** Nombre editable del chat */
  nombreChat?: string;
}

export function ChatPanel({
  modo,
  conMensajes = true,
  onHistorial,
  onLateral,
  onMinimizar,
  onNueva,
  nombreChat = '[Nombre del chat]',
}: ChatPanelProps) {
  const [chipActivo, setChipActivo] = useState('');
  const [nombre, setNombre] = useState(nombreChat);
  const isFlotante = modo === 'flotante';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isFlotante ? 'auto' : '100%',
        width: isFlotante ? 680 : '100%',
        bgcolor: 'background.paper',
        border: isFlotante ? '1px solid rgba(47,67,208,0.1)' : 'none',
        borderRadius: isFlotante ? '10px' : 0,
        boxShadow: isFlotante
          ? '0px 8px 32px rgba(47,67,208,0.12), 0px 2px 8px rgba(47,67,208,0.08)'
          : 'none',
        overflow: 'hidden',
      }}
    >
      {/* NameChat header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.75,
          gap: 1,
          flexShrink: 0,
          borderBottom: conMensajes ? '1px solid rgba(16,24,64,0.06)' : 'none',
        }}
      >
        {/* Chat name — editable text field style */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, minWidth: 0 }}>
          <IconUsers size={14} color={PRIMARY} style={{ flexShrink: 0 }} />
          <InputBase
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: PRIMARY,
              '& input': {
                padding: 0,
                cursor: 'text',
                color: PRIMARY,
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.15s',
                '&:hover': { borderBottomColor: 'rgba(47,67,208,0.3)' },
                '&:focus': { borderBottomColor: PRIMARY },
              },
            }}
          />
        </Box>

        {/* Right actions (Figma: bordered+ | message-search | | | layout-sidebar) */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexShrink: 0 }}>
          <Box
            component="button"
            onClick={onNueva}
            title="Nueva conversación"
            sx={{
              border: '1px solid rgba(47,67,208,0.5)',
              borderRadius: '4px',
              p: '4px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              bgcolor: 'transparent',
              transition: 'background-color 0.15s',
              '&:hover': { bgcolor: 'rgba(47,67,208,0.06)' },
            }}
          >
            <IconPlus size={14} color="rgba(47,67,208,0.7)" />
          </Box>
          <IconButton size="small" onClick={onHistorial} sx={{ p: '3px' }} title="Historial">
            <IconMessageSearch size={15} color="rgba(16,24,64,0.54)" />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.25, height: 12, alignSelf: 'center' }} />
          <IconButton size="small" onClick={onLateral} sx={{ p: '3px' }} title={isFlotante ? 'Modo lateral' : 'Modo flotante'}>
            <IconLayoutSidebarRight size={15} color="rgba(16,24,64,0.54)" />
          </IconButton>
          {isFlotante && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.25, height: 12, alignSelf: 'center' }} />
              <IconButton size="small" onClick={onMinimizar} sx={{ p: '3px' }} title="Minimizar">
                <IconMinus size={15} color="rgba(16,24,64,0.54)" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {/* Mensaje area */}
      {conMensajes && (
        <Box
          sx={{
            flex: isFlotante ? 'unset' : 1,
            px: 1.5,
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            // overflowY: isFlotante ? 'unset' : 'auto',
            position: 'relative',
          }}
        >
          {MENSAJES_DEMO.map((m) => (
            <Box key={m.id}>
              {m.esContextoNuevo && <ContextSeparator />}
              {m.autor === 'usuario' ? (
                <UserMessage mensaje={m} />
              ) : (
                <AgenteMessage mensaje={m} />
              )}
            </Box>
          ))}

          {/* Fade gradient at bottom */}
          {!isFlotante && (
            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                right: 0,
                height: 32,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
                pointerEvents: 'none',
                flexShrink: 0,
              }}
            />
          )}
        </Box>
      )}

      {!conMensajes && !isFlotante && <Box sx={{ flex: 1 }} />}

      {/* Input */}
      <AsistenteInput
        chipActivo={chipActivo}
        chipActivoTipo={null}
        inputTexto=""
        inputChips={[]}
        onChipClick={setChipActivo}
        onMinimizar={onMinimizar ?? (() => {})}
        onVerHistorial={onHistorial ?? (() => {})}
        onExpandir={onLateral ?? (() => {})}
        onVerMas={() => {}}
        showTopActions={false}
        variant="embedded"
      />
    </Box>
  );
}
