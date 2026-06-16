import { useEffect, useRef, useState } from 'react';
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
import type { Mensaje } from '../model/conversaciones';

const PRIMARY = '#2f43d0';

function UserMessage({ mensaje }: { mensaje: Mensaje }) {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', pl: 7 }}
    >
      <Box sx={{ bgcolor: 'rgba(47,67,208,0.08)', borderRadius: '4px 4px 0 4px', px: 1, py: 0.5 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.primary', fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}
        >
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
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}
      >
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

function TypingIndicator() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', pr: 7 }}>
      <Box
        sx={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          py: 0.5,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'rgba(16,24,64,0.3)',
              animation: 'pulse 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
              '@keyframes pulse': {
                '0%, 60%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                '30%': { opacity: 1, transform: 'scale(1)' },
              },
            }}
          />
        ))}
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

export interface ChatPanelProps {
  modo: 'flotante' | 'lateral';
  mensajes?: Mensaje[];
  pensando?: boolean;
  onHistorial?: () => void;
  onLateral?: () => void;
  onMinimizar?: () => void;
  onNueva?: () => void;
  onEnviarMensaje?: (texto: string) => void;
  nombreChat?: string;
}

export function ChatPanel({
  modo,
  mensajes = [],
  pensando = false,
  onHistorial,
  onLateral,
  onMinimizar,
  onNueva,
  onEnviarMensaje,
  nombreChat = '[Nombre del chat]',
}: ChatPanelProps) {
  const [chipActivo, setChipActivo] = useState('');
  const [nombre, setNombre] = useState(nombreChat);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFlotante = modo === 'flotante';
  const tieneMensajes = mensajes.length > 0;

  useEffect(() => {
    setNombre(nombreChat);
  }, [nombreChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, pensando]);

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
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.75,
          gap: 1,
          flexShrink: 0,
          borderBottom: tieneMensajes ? '1px solid rgba(16,24,64,0.06)' : 'none',
        }}
      >
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
          <IconButton
            size="small"
            onClick={onLateral}
            sx={{ p: '3px' }}
            title={isFlotante ? 'Modo lateral' : 'Modo flotante'}
          >
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

      {/* Messages area */}
      {tieneMensajes && (
        <Box
          sx={{
            flex: isFlotante ? 'unset' : 1,
            maxHeight: isFlotante ? 320 : 'none',
            overflowY: 'auto',
            px: 1.5,
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            position: 'relative',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(16,24,64,0.15) transparent',
          }}
        >
          {mensajes.map((m) => (
            <Box key={m.id}>
              {m.esContextoNuevo && <ContextSeparator />}
              {m.autor === 'usuario' ? <UserMessage mensaje={m} /> : <AgenteMessage mensaje={m} />}
            </Box>
          ))}

          {pensando && <TypingIndicator />}

          <div ref={messagesEndRef} />

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

      {/* Spacer when no messages in lateral mode */}
      {!tieneMensajes && !isFlotante && <Box sx={{ flex: 1 }} />}

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
        onEnviar={onEnviarMensaje}
        showTopActions={false}
        variant="embedded"
      />
    </Box>
  );
}
