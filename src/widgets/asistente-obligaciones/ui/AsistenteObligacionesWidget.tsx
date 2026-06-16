import { useState } from 'react';
import { Box, IconButton, InputBase } from '@mui/material';
import { IconArrowUp, IconPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { AppShellMock } from '@/widgets/asistente-base/ui/AppShellMock';
import { ChatPanel } from '@/widgets/asistente-base/ui/ChatPanel';
import { HistorialDrawer } from '@/widgets/asistente-base/ui/HistorialDrawer';
import { CONVERSACIONES_DEMO, generarRespuesta } from '@/widgets/asistente-base/model/conversaciones';
import type { Mensaje } from '@/widgets/asistente-base/model/conversaciones';
import { overlayVariants } from '@/shared/ui/anim';
import { ObligacionesPanel } from './ObligacionesPanel';

type EstadoOb =
  | 'minimizado'
  | 'expandido'
  | 'chat'
  | 'nueva'
  | 'lateral'
  | 'historial'
  | 'historial-anclado'
  | 'historial-lateral'
  | 'historial-lateral-anclado';

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
        boxShadow: '0px 4px 16px rgba(47,67,208,0.1), 0px 1px 4px rgba(47,67,208,0.06)',
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

export function AsistenteObligacionesWidget() {
  const [estado, setEstado] = useState<EstadoOb>('minimizado');

  // Conversation state
  const [conversacionActivaId, setConversacionActivaId] = useState(1);
  const [mensajesPorConv, setMensajesPorConv] = useState<Record<number, Mensaje[]>>(() =>
    Object.fromEntries(CONVERSACIONES_DEMO.map((c) => [c.id, [...c.mensajes]]))
  );
  const [pensando, setPensando] = useState(false);

  const mensajesActivos = mensajesPorConv[conversacionActivaId] ?? [];
  const convActiva = CONVERSACIONES_DEMO.find((c) => c.id === conversacionActivaId);
  const nombreConvActiva = convActiva?.nombre ?? 'Conversación';

  function irA(siguiente: EstadoOb) {
    setEstado(siguiente);
  }

  function enviarMensaje(texto: string) {
    const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Mensaje = { id: Date.now(), autor: 'usuario', texto, hora };

    setMensajesPorConv((prev) => ({
      ...prev,
      [conversacionActivaId]: [...(prev[conversacionActivaId] ?? []), userMsg],
    }));
    setPensando(true);

    setTimeout(() => {
      const agentMsg: Mensaje = { id: Date.now() + 1, autor: 'agente', texto: generarRespuesta(texto) };
      setMensajesPorConv((prev) => ({
        ...prev,
        [conversacionActivaId]: [...(prev[conversacionActivaId] ?? []), agentMsg],
      }));
      setPensando(false);
    }, 1500);
  }

  function iniciarNuevaConversacion() {
    const nuevoId = Date.now();
    setConversacionActivaId(nuevoId);
    setMensajesPorConv((prev) => ({ ...prev, [nuevoId]: [] }));
    irA('nueva');
  }

  function seleccionarConversacion(id: number, modoDestino: 'chat' | 'lateral') {
    setConversacionActivaId(id);
    irA(modoDestino);
  }

  const O = overlayVariants;

  const chatProps = {
    mensajes: mensajesActivos,
    pensando,
    onEnviarMensaje: enviarMensaje,
    nombreChat: nombreConvActiva,
  };

  function drawerHistorial(onClose: () => void, anclado: boolean, onAnclar?: () => void, onDesanclar?: () => void) {
    return (
      <HistorialDrawer
        onClose={onClose}
        anclado={anclado}
        onAnclar={onAnclar}
        onDesanclar={onDesanclar}
        conversacionActivaId={conversacionActivaId}
        onSelectConversacion={(id) => seleccionarConversacion(id, 'chat')}
      />
    );
  }

  function drawerHistorialLateral(onClose: () => void, anclado: boolean, onAnclar?: () => void, onDesanclar?: () => void) {
    return (
      <HistorialDrawer
        onClose={onClose}
        anclado={anclado}
        onAnclar={onAnclar}
        onDesanclar={onDesanclar}
        conversacionActivaId={conversacionActivaId}
        onSelectConversacion={(id) => seleccionarConversacion(id, 'lateral')}
      />
    );
  }

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

  // ─── EXPANDIDO ───────────────────────────────────────────────────────────
  if (estado === 'expandido') {
    return (
      <AppShellMock
        overlay={
          <motion.div key="panel" variants={O} initial="initial" animate="animate" exit="exit">
            <ObligacionesPanel
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
              {...chatProps}
              onMinimizar={() => irA('minimizado')}
              onLateral={() => irA('lateral')}
              onNueva={iniciarNuevaConversacion}
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
              mensajes={mensajesActivos}
              pensando={pensando}
              onEnviarMensaje={enviarMensaje}
              nombreChat="Nueva conversación"
              onMinimizar={() => irA('minimizado')}
              onLateral={() => irA('lateral')}
              onNueva={iniciarNuevaConversacion}
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
            {...chatProps}
            onMinimizar={() => irA('minimizado')}
            onLateral={() => irA('chat')}
            onNueva={iniciarNuevaConversacion}
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
            {...chatProps}
            onMinimizar={() => irA('minimizado')}
            onLateral={() => irA('chat')}
            onNueva={iniciarNuevaConversacion}
            onHistorial={() => irA('historial-lateral')}
          />
        }
        drawerOverlay={drawerHistorialLateral(
          () => irA('lateral'),
          false,
          () => irA('historial-lateral-anclado'),
        )}
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
            {...chatProps}
            onMinimizar={() => irA('minimizado')}
            onLateral={() => irA('chat')}
            onNueva={iniciarNuevaConversacion}
            onHistorial={() => irA('historial-lateral')}
          />
        }
        drawerOverlay={drawerHistorialLateral(
          () => irA('lateral'),
          true,
          undefined,
          () => irA('historial-lateral'),
        )}
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
              {...chatProps}
              onMinimizar={() => irA('minimizado')}
              onLateral={() => irA('lateral')}
              onNueva={iniciarNuevaConversacion}
              onHistorial={() => irA('chat')}
            />
          </motion.div>
        }
        drawerOverlay={drawerHistorial(
          () => irA('chat'),
          false,
          () => irA('historial-anclado'),
        )}
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
              {...chatProps}
              onMinimizar={() => irA('minimizado')}
              onLateral={() => irA('lateral')}
              onNueva={iniciarNuevaConversacion}
              onHistorial={() => irA('chat')}
            />
          </motion.div>
        }
        drawerOverlay={drawerHistorial(
          () => irA('chat'),
          true,
          undefined,
          () => irA('historial'),
        )}
        drawerOverlayWidth={HISTORIAL_WIDTH}
      />
    );
  }

  return null;
}
