import { useState } from 'react';
import { Box, IconButton, InputBase } from '@mui/material';
import { IconArrowUp, IconPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { AsistentePanel } from '@/widgets/asistente-panel';
import { overlayVariants } from '@/shared/ui/anim';
import { AppShellMock } from './AppShellMock';
import { ChatPanel } from './ChatPanel';
import { HistorialDrawer } from './HistorialDrawer';

type EstadoBase =
  | 'minimizado'
  | 'expandido'
  | 'chat'
  | 'nueva'
  | 'lateral'
  | 'historial'
  | 'historial-anclado'
  | 'historial-lateral'
  | 'historial-lateral-anclado';

// Figma: panel lateral 336px, drawer historial 380px
const LATERAL_WIDTH = 336;
const HISTORIAL_WIDTH = 380;

function MiniInput({ onClick }: { onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid rgba(47,67,208,0.08)',
        borderRadius: '10px',
        boxShadow:
          '0px 4px 16px rgba(47,67,208,0.1), 0px 1px 4px rgba(47,67,208,0.06)',
        p: 1,
        width: 260,
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          bgcolor: '#f5f5f5',
          border: '1px solid rgba(16,24,64,0.1)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pl: 1,
          pr: 0.75,
          py: 0.75,
          width: '100%',
        }}
      >
        <IconButton size="small" sx={{ p: '3px', flexShrink: 0, pointerEvents: 'none' }}>
          <IconPlus size={14} color="rgba(16,24,64,0.54)" />
        </IconButton>
        <InputBase
          placeholder="Describe lo que necesitas..."
          readOnly
          sx={{
            flex: '1 0 0',
            fontSize: '0.8125rem',
            pointerEvents: 'none',
            '& input': {
              padding: 0,
              cursor: 'pointer',
              '&::placeholder': { color: 'text.secondary', opacity: 1 },
            },
          }}
        />
        <Box
          sx={{
            bgcolor: 'rgba(47,67,208,0.25)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            pointerEvents: 'none',
          }}
        >
          <IconButton size="small" disabled sx={{ p: '4px' }}>
            <IconArrowUp size={18} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export function AsistenteBaseWidget() {
  const [estado, setEstado] = useState<EstadoBase>('minimizado');

  function irA(siguiente: EstadoBase) {
    setEstado(siguiente);
  }

  const O = overlayVariants;

  // ─── MINIMIZADO ──────────────────────────────────────────────────────────
  if (estado === 'minimizado') {
    return (
      <AppShellMock
        overlay={
          <motion.div key="mini" variants={O} initial="initial" animate="animate" exit="exit">
            <MiniInput onClick={() => irA('expandido')} />
          </motion.div>
        }
      />
    );
  }

  // ─── EXPANDIDO (modo activo — input con chips) ───────────────────────────
  if (estado === 'expandido') {
    return (
      <AppShellMock
        overlay={
          <motion.div key="panel" variants={O} initial="initial" animate="animate" exit="exit">
            <AsistentePanel
              onMinimizar={() => irA('minimizado')}
              onVerHistorial={() => irA('historial')}
              onExpandir={() => irA('lateral')}
              onEnviar={() => irA('chat')}
            />
          </motion.div>
        }
      />
    );
  }

  // ─── CHAT FLOTANTE ────────────────────────────────────────────────────────
  if (estado === 'chat') {
    return (
      <AppShellMock
        overlay={
          <motion.div key="chat" variants={O} initial="initial" animate="animate" exit="exit">
            <ChatPanel
              modo="flotante"
              conMensajes
              onMinimizar={() => irA('minimizado')}
              onLateral={() => irA('lateral')}
              onNueva={() => irA('nueva')}
              onHistorial={() => irA('historial')}
            />
          </motion.div>
        }
      />
    );
  }

  // ─── NUEVA CONVERSACIÓN ───────────────────────────────────────────────────
  if (estado === 'nueva') {
    return (
      <AppShellMock
        overlay={
          <motion.div key="nueva" variants={O} initial="initial" animate="animate" exit="exit">
            <ChatPanel
              modo="flotante"
              conMensajes={false}
              nombreChat="Nueva conversación"
              onMinimizar={() => irA('minimizado')}
              onLateral={() => irA('lateral')}
              onNueva={() => irA('nueva')}
              onHistorial={() => irA('historial')}
            />
          </motion.div>
        }
      />
    );
  }

  // ─── LATERAL ──────────────────────────────────────────────────────────────
  if (estado === 'lateral') {
    return (
      <AppShellMock
        rightPanelWidth={LATERAL_WIDTH}
        rightPanel={
          <ChatPanel
            modo="lateral"
            conMensajes
            onMinimizar={() => irA('minimizado')}
            onLateral={() => irA('chat')}
            onNueva={() => irA('nueva')}
            onHistorial={() => irA('historial-lateral')}
          />
        }
      />
    );
  }

  // ─── HISTORIAL DESDE LATERAL ──────────────────────────────────────────────
  if (estado === 'historial-lateral') {
    return (
      <AppShellMock
        rightPanelWidth={LATERAL_WIDTH}
        rightPanel={
          <ChatPanel
            modo="lateral"
            conMensajes
            onMinimizar={() => irA('minimizado')}
            onLateral={() => irA('chat')}
            onNueva={() => irA('nueva')}
            onHistorial={() => irA('historial-lateral')}
          />
        }
        drawerOverlay={
          <HistorialDrawer
            onClose={() => irA('lateral')}
            anclado={false}
            onAnclar={() => irA('historial-lateral-anclado')}
          />
        }
        drawerOverlayWidth={HISTORIAL_WIDTH}
      />
    );
  }

  // ─── HISTORIAL ANCLADO DESDE LATERAL ─────────────────────────────────────
  if (estado === 'historial-lateral-anclado') {
    return (
      <AppShellMock
        rightPanelWidth={LATERAL_WIDTH}
        rightPanel={
          <ChatPanel
            modo="lateral"
            conMensajes
            onMinimizar={() => irA('minimizado')}
            onLateral={() => irA('chat')}
            onNueva={() => irA('nueva')}
            onHistorial={() => irA('historial-lateral')}
          />
        }
        drawerOverlay={
          <HistorialDrawer
            onClose={() => irA('lateral')}
            anclado
            onDesanclar={() => irA('historial-lateral')}
          />
        }
        drawerOverlayWidth={HISTORIAL_WIDTH}
      />
    );
  }

  // ─── HISTORIAL ────────────────────────────────────────────────────────────
  if (estado === 'historial') {
    return (
      <AppShellMock
        overlay={
          <motion.div key="chat" variants={O} initial="initial" animate="animate" exit="exit">
            <ChatPanel
              modo="flotante"
              conMensajes
              onMinimizar={() => irA('minimizado')}
              onLateral={() => irA('lateral')}
              onNueva={() => irA('nueva')}
              onHistorial={() => irA('chat')}
            />
          </motion.div>
        }
        drawerOverlay={
          <HistorialDrawer
            onClose={() => irA('chat')}
            anclado={false}
            onAnclar={() => irA('historial-anclado')}
          />
        }
        drawerOverlayWidth={HISTORIAL_WIDTH}
      />
    );
  }

  // ─── HISTORIAL ANCLADO ────────────────────────────────────────────────────
  if (estado === 'historial-anclado') {
    return (
      <AppShellMock
        overlay={
          <motion.div key="chat" variants={O} initial="initial" animate="animate" exit="exit">
            <ChatPanel
              modo="flotante"
              conMensajes
              onMinimizar={() => irA('minimizado')}
              onLateral={() => irA('lateral')}
              onNueva={() => irA('nueva')}
              onHistorial={() => irA('chat')}
            />
          </motion.div>
        }
        drawerOverlay={
          <HistorialDrawer
            onClose={() => irA('chat')}
            anclado
            onDesanclar={() => irA('historial')}
          />
        }
        drawerOverlayWidth={HISTORIAL_WIDTH}
      />
    );
  }

  return null;
}
