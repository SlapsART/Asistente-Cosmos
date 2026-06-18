import { useState, useRef } from 'react';
import { Box, IconButton, InputBase } from '@mui/material';
import { IconArrowUp, IconPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { AsistentePanel } from '@/widgets/asistente-panel';
import { overlayVariants } from '@/shared/ui/anim';
import { CONVERSACIONES_DEMO, generarRespuesta } from '../model/conversaciones';
import type { Mensaje } from '../model/conversaciones';
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
  | 'historial-lateral-anclado'
  | 'expandido-desde-chat';

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
        <IconButton
          size="small"
          disabled
          sx={{
            p: '4px',
            borderRadius: '20px',
            flexShrink: 0,
            pointerEvents: 'none',
            '&&': { bgcolor: 'rgba(16,24,64,0.1)', color: 'rgba(16,24,64,0.38)' },
          }}
        >
          <IconArrowUp size={18} />
        </IconButton>
      </Box>
    </Box>
  );
}

export function AsistenteBaseWidget() {
  const [estado, setEstado] = useState<EstadoBase>('minimizado');
  const [chipDesdeChat, setChipDesdeChat] = useState<string | undefined>(undefined);

  // Conversation state
  const [conversacionActivaId, setConversacionActivaId] = useState(-1);
  const [conversaciones, setConversaciones] = useState(() => [...CONVERSACIONES_DEMO]);
  const [mensajesPorConv, setMensajesPorConv] = useState<Record<number, Mensaje[]>>(() =>
    Object.fromEntries(CONVERSACIONES_DEMO.map((c) => [c.id, [...c.mensajes]]))
  );
  const [pensando, setPensando] = useState(false);
  const [loaderTexto, setLoaderTexto] = useState<string | undefined>(undefined);
  const respuestaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mensajesActivos = mensajesPorConv[conversacionActivaId] ?? [];
  const convActiva = conversaciones.find((c) => c.id === conversacionActivaId);
  const nombreConvActiva = convActiva?.nombre ?? 'Conversación';
  const tieneConversacion = mensajesActivos.length > 0;

  function irA(siguiente: EstadoBase) {
    setEstado(siguiente);
  }

  function enviarMensaje(texto: string) {
    const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Mensaje = { id: Date.now(), autor: 'usuario', texto, hora };
    if (!conversaciones.find((c) => c.id === conversacionActivaId)) {
      const nombre = texto.length > 40 ? texto.slice(0, 40).trimEnd() + '…' : texto;
      const nueva = { id: conversacionActivaId, nombre, tiempo: 'ahora', grupo: 'reciente' as const, mensajes: [] };
      setConversaciones((prev) => {
        const idx = prev.findIndex((c) => c.grupo !== 'anclada');
        const result = [...prev];
        idx === -1 ? result.push(nueva) : result.splice(idx, 0, nueva);
        return result;
      });
    }
    setMensajesPorConv((prev) => ({
      ...prev,
      [conversacionActivaId]: [...(prev[conversacionActivaId] ?? []), userMsg],
    }));
    setPensando(true);

    if (respuestaTimer.current) clearTimeout(respuestaTimer.current);
    respuestaTimer.current = setTimeout(() => {
      const agentMsg: Mensaje = { id: Date.now() + 1, autor: 'agente', texto: generarRespuesta(texto) };
      setMensajesPorConv((prev) => ({
        ...prev,
        [conversacionActivaId]: [...(prev[conversacionActivaId] ?? []), agentMsg],
      }));
      setPensando(false);
    }, 7000);
  }

  function detenerRespuesta() {
    if (respuestaTimer.current) {
      clearTimeout(respuestaTimer.current);
      respuestaTimer.current = null;
    }
    setPensando(false);
  }

  function enviarMensajeSistema(_texto: string) {
    const userMsg: Mensaje = { id: Date.now(), autor: 'usuario', texto: 'Ir a la tarea' };
    setMensajesPorConv((prev) => ({
      ...prev,
      [conversacionActivaId]: [...(prev[conversacionActivaId] ?? []), userMsg],
    }));
    setPensando(true);
    setLoaderTexto('Dirigiendo a la tarea');
    irA('chat');
    if (respuestaTimer.current) clearTimeout(respuestaTimer.current);
    respuestaTimer.current = setTimeout(() => {
      setPensando(false);
      setLoaderTexto(undefined);
    }, 3000);
  }

  function iniciarNuevaConversacion() {
    const nuevoId = Date.now();
    setConversacionActivaId(nuevoId);
    setMensajesPorConv((prev) => ({ ...prev, [nuevoId]: [] }));
    irA('nueva');
  }

  function renombrarConversacion(id: number, nombre: string) {
    if (!nombre.trim()) return;
    setConversaciones(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const updated = { ...prev[idx], nombre: nombre.trim(), tiempo: 'ahora', grupo: 'reciente' as const };
      const rest = prev.filter(c => c.id !== id);
      const firstNonAnclada = rest.findIndex(c => c.grupo !== 'anclada');
      const result = [...rest];
      firstNonAnclada === -1 ? result.push(updated) : result.splice(firstNonAnclada, 0, updated);
      return result;
    });
  }

  function anclarConversacion(id: number) {
    setConversaciones(prev => {
      const conv = prev.find(c => c.id === id);
      if (!conv) return prev;
      const isAnclada = conv.grupo === 'anclada';
      const nuevoGrupo = isAnclada ? 'reciente' : 'anclada';
      const updated = { ...conv, grupo: nuevoGrupo as 'anclada' | 'reciente' };
      const rest = prev.filter(c => c.id !== id);
      
      if (isAnclada) {
        // Desanclar: mover a recientes
        const firstNonAnclada = rest.findIndex(c => c.grupo !== 'anclada');
        const result = [...rest];
        firstNonAnclada === -1 ? result.push(updated) : result.splice(firstNonAnclada, 0, updated);
        return result;
      } else {
        // Anclar: mover al inicio
        return [updated, ...rest];
      }
    });
  }

  function seleccionarConversacion(id: number, modoDestino: 'chat' | 'lateral') {
    setConversacionActivaId(id);
    setConversaciones(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const updated = { ...prev[idx], tiempo: 'ahora', grupo: 'reciente' as const };
      const rest = prev.filter(c => c.id !== id);
      const firstNonAnclada = rest.findIndex(c => c.grupo !== 'anclada');
      const result = [...rest];
      firstNonAnclada === -1 ? result.push(updated) : result.splice(firstNonAnclada, 0, updated);
      return result;
    });
    irA(modoDestino);
  }

  const O = overlayVariants;

  // Shared ChatPanel props for active conversation
  const chatProps = {
    mensajes: mensajesActivos,
    pensando,
    textoLoader: loaderTexto,
    onEnviarMensaje: enviarMensaje,
    onDetenerRespuesta: detenerRespuesta,
    nombreChat: nombreConvActiva,
    onRenombrar: (nombre: string) => renombrarConversacion(conversacionActivaId, nombre),
  };

  // Shared HistorialDrawer for flotante modes
  function drawerHistorial(onClose: () => void, anclado: boolean, onAnclar?: () => void, onDesanclar?: () => void) {
    return (
      <HistorialDrawer
        onClose={onClose}
        anclado={anclado}
        onAnclar={() => { anclarConversacion(conversacionActivaId); onAnclar?.(); }}
        onDesanclar={() => { anclarConversacion(conversacionActivaId); onDesanclar?.(); }}
        conversacionActivaId={conversacionActivaId}
        onSelectConversacion={(id) => seleccionarConversacion(id, 'chat')}
        conversaciones={conversaciones}
      />
    );
  }

  function drawerHistorialLateral(onClose: () => void, anclado: boolean, onAnclar?: () => void, onDesanclar?: () => void) {
    return (
      <HistorialDrawer
        onClose={onClose}
        anclado={anclado}
        onAnclar={() => { anclarConversacion(conversacionActivaId); onAnclar?.(); }}
        onDesanclar={() => { anclarConversacion(conversacionActivaId); onDesanclar?.(); }}
        conversacionActivaId={conversacionActivaId}
        onSelectConversacion={(id) => seleccionarConversacion(id, 'lateral')}
        conversaciones={conversaciones}
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
            <AsistentePanel
              onMinimizar={() => irA('minimizado')}
              onVerHistorial={() => irA('historial')}
              onExpandir={() => irA('lateral')}
              onEnviarConMensaje={(texto) => { enviarMensaje(texto); irA('chat'); }}
              onAbrirChat={tieneConversacion ? () => irA('chat') : undefined}
              onEnviarMensajeSistema={enviarMensajeSistema}
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
              onAbrirPanel={(chip) => { setChipDesdeChat(chip); irA('expandido-desde-chat'); }}
              autoFocusInput
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
              onAbrirPanel={(chip) => { setChipDesdeChat(chip); irA('expandido-desde-chat'); }}
            />
          </motion.div>
        }
      />
    );
  }

  // ─── PANEL DESDE CHAT (chip click con mensajes activos) ───────────────────
  if (estado === 'expandido-desde-chat') {
    return (
      <AppShellMock
        overlay={
          <motion.div key="expandido-desde-chat" variants={O} initial="initial" animate="animate" exit="exit">
            <AsistentePanel
              onMinimizar={() => irA('minimizado')}
              onVerHistorial={() => irA('historial')}
              onExpandir={() => irA('lateral')}
              onEnviarConMensaje={(texto) => { enviarMensaje(texto); irA('chat'); }}
              onAbrirChat={tieneConversacion ? () => irA('chat') : undefined}
              onEnviarMensajeSistema={enviarMensajeSistema}
              chipInicial={chipDesdeChat}
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
        onCloseDrawer={() => irA('lateral')}
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
        onCloseDrawer={() => irA('lateral')}
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
        onCloseDrawer={() => irA('chat')}
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
        onCloseDrawer={() => irA('chat')}
        drawerOverlayWidth={HISTORIAL_WIDTH}
      />
    );
  }

  return null;
}
