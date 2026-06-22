import { useState, useRef } from 'react';
import { Box, IconButton, InputBase } from '@mui/material';
import { IconArrowUp, IconMessageSearch, IconPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { overlayVariants } from '@/shared/ui/anim';
import { CONVERSACIONES_DEMO, generarRespuesta } from '@/widgets/asistente-base/model/conversaciones';
import type { Mensaje } from '@/widgets/asistente-base/model/conversaciones';
import { AppShellMock } from '@/widgets/asistente-base/ui/AppShellMock';
import { ChatPanel } from '@/widgets/asistente-base/ui/ChatPanel';
import { HistorialDrawer } from '@/widgets/asistente-base/ui/HistorialDrawer';
import { AsistenteVerticalPanel } from './AsistenteVerticalPanel';
import { AsistenteVerticalChat } from './AsistenteVerticalChat';

type EstadoBase =
  | 'minimizado'
  | 'expandido'
  | 'expandido-historial'
  | 'expandido-historial-anclado'
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
        bgcolor: '#f5f5f5',
        border: '1px solid rgba(16,24,64,0.1)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        p: 1.5,
        width: 680,
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
    >
      <InputBase
        placeholder="Describe lo que necesitas..."
        readOnly
        multiline
        minRows={2}
        sx={{
          fontSize: '0.8125rem',
          width: '100%',
          pointerEvents: 'none',
          '& textarea': {
            padding: 0,
            resize: 'none',
            cursor: 'pointer',
            '&::placeholder': { color: 'text.secondary', opacity: 1 },
          },
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <IconButton size="small" sx={{ p: '3px' }}>
            <IconPlus size={14} color="rgba(16,24,64,0.54)" />
          </IconButton>
          <IconButton size="small" sx={{ p: '3px' }}>
            <IconMessageSearch size={14} color="rgba(16,24,64,0.54)" />
          </IconButton>
        </Box>
        <IconButton
          size="small"
          sx={{ p: '4px', borderRadius: '20px', '&&': { bgcolor: 'rgba(16,24,64,0.1)', color: 'rgba(16,24,64,0.38)' } }}
        >
          <IconArrowUp size={20} />
        </IconButton>
      </Box>
    </Box>
  );
}

export function AsistenteVerticalWidget() {
  const [estado, setEstado] = useState<EstadoBase>('expandido');
  const [chipDesdeChat, setChipDesdeChat] = useState<string | undefined>(undefined);

  const [conversacionActivaId, setConversacionActivaId] = useState(1);
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

  function irA(siguiente: EstadoBase) {
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
    setConversaciones((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const updated = { ...prev[idx], nombre: nombre.trim(), tiempo: 'ahora', grupo: 'reciente' as const };
      const rest = prev.filter((c) => c.id !== id);
      const firstNonAnclada = rest.findIndex((c) => c.grupo !== 'anclada');
      const result = [...rest];
      firstNonAnclada === -1 ? result.push(updated) : result.splice(firstNonAnclada, 0, updated);
      return result;
    });
  }

  function anclarConversacion(id: number) {
    setConversaciones((prev) => {
      const conv = prev.find((c) => c.id === id);
      if (!conv) return prev;
      const isAnclada = conv.grupo === 'anclada';
      const nuevoGrupo = isAnclada ? 'reciente' : 'anclada';
      const updated = { ...conv, grupo: nuevoGrupo as 'anclada' | 'reciente' };
      const rest = prev.filter((c) => c.id !== id);
      if (isAnclada) {
        const firstNonAnclada = rest.findIndex((c) => c.grupo !== 'anclada');
        const result = [...rest];
        firstNonAnclada === -1 ? result.push(updated) : result.splice(firstNonAnclada, 0, updated);
        return result;
      } else {
        return [updated, ...rest];
      }
    });
  }

  function seleccionarConversacion(id: number, modoDestino: 'chat' | 'lateral') {
    setConversacionActivaId(id);
    setConversaciones((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const updated = { ...prev[idx], tiempo: 'ahora', grupo: 'reciente' as const };
      const rest = prev.filter((c) => c.id !== id);
      const firstNonAnclada = rest.findIndex((c) => c.grupo !== 'anclada');
      const result = [...rest];
      firstNonAnclada === -1 ? result.push(updated) : result.splice(firstNonAnclada, 0, updated);
      return result;
    });
    irA(modoDestino);
  }

  const O = overlayVariants;

  const chatProps = {
    mensajes: mensajesActivos,
    pensando,
    textoLoader: loaderTexto,
    onEnviarMensaje: enviarMensaje,
    onDetenerRespuesta: detenerRespuesta,
    nombreChat: nombreConvActiva,
    onRenombrar: (nombre: string) => renombrarConversacion(conversacionActivaId, nombre),
  };

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
        overlayCentered
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
        overlayCentered
        overlay={
          <AsistenteVerticalPanel
            onMinimizar={() => irA('minimizado')}
            onVerHistorial={() => irA('expandido-historial')}
            onExpandir={() => irA('lateral')}
            onEnviar={(texto) => { enviarMensaje(texto); irA('chat'); }}
            onEnviarMensajeSistema={enviarMensajeSistema}
          />
        }
      />
    );
  }

  // ─── EXPANDIDO + HISTORIAL ────────────────────────────────────────────────
  if (estado === 'expandido-historial') {
    return (
      <AppShellMock
        overlayCentered
        overlay={
          <AsistenteVerticalPanel
            onMinimizar={() => irA('minimizado')}
            onVerHistorial={() => irA('expandido')}
            onExpandir={() => irA('lateral')}
            onEnviar={(texto) => { enviarMensaje(texto); irA('chat'); }}
            onEnviarMensajeSistema={enviarMensajeSistema}
          />
        }
        drawerOverlay={drawerHistorial(
          () => irA('expandido'),
          false,
          () => irA('expandido-historial-anclado'),
        )}
        onCloseDrawer={() => irA('expandido')}
        drawerOverlayWidth={HISTORIAL_WIDTH}
      />
    );
  }

  // ─── EXPANDIDO + HISTORIAL ANCLADO ────────────────────────────────────────
  if (estado === 'expandido-historial-anclado') {
    return (
      <AppShellMock
        overlayCentered
        overlay={
          <AsistenteVerticalPanel
            onMinimizar={() => irA('minimizado')}
            onVerHistorial={() => irA('expandido')}
            onExpandir={() => irA('lateral')}
            onEnviar={(texto) => { enviarMensaje(texto); irA('chat'); }}
            onEnviarMensajeSistema={enviarMensajeSistema}
          />
        }
        drawerOverlay={drawerHistorial(
          () => irA('expandido'),
          true,
          undefined,
          () => irA('expandido-historial'),
        )}
        onCloseDrawer={() => irA('expandido')}
        drawerOverlayWidth={HISTORIAL_WIDTH}
      />
    );
  }

  // ─── CHAT VERTICAL (pantalla completa) ───────────────────────────────────
  if (estado === 'chat') {
    return (
      <AppShellMock>
        <AsistenteVerticalChat
          mensajes={mensajesActivos}
          pensando={pensando}
          textoLoader={loaderTexto}
          onEnviarMensaje={enviarMensaje}
          onDetenerRespuesta={detenerRespuesta}
        />
      </AppShellMock>
    );
  }

  // ─── NUEVA CONVERSACIÓN ───────────────────────────────────────────────────
  if (estado === 'nueva') {
    return (
      <AppShellMock
        overlayCentered
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

  // ─── PANEL DESDE CHAT ─────────────────────────────────────────────────────
  if (estado === 'expandido-desde-chat') {
    return (
      <AppShellMock
        overlayCentered
        overlay={
          <motion.div key="expandido-desde-chat" variants={O} initial="initial" animate="animate" exit="exit">
            <AsistenteVerticalPanel
              onMinimizar={() => irA('minimizado')}
              onVerHistorial={() => irA('historial')}
              onExpandir={() => irA('lateral')}
              onEnviar={(texto) => { enviarMensaje(texto); irA('chat'); }}
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
        overlayCentered
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
        overlayCentered
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
