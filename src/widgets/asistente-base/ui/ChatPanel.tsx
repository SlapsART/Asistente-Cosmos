import { useEffect, useRef, useState } from 'react';
import { Box, Divider, IconButton, InputBase, Typography } from '@mui/material';
import {
  IconBookmark,
  IconCopy,
  IconDots,
  IconLayoutSidebarRight,
  IconMessage2,
  IconMessageSearch,
  IconMinus,
  IconPencil,
  IconPlus,
  IconRefresh,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { subPanelVariants } from '@/shared/ui/anim';
import { AsistenteInput } from '@/widgets/asistente-panel/ui/AsistenteInput';
import { ActividadesPendientes } from '@/widgets/asistente-panel/ui/ActividadesPendientes';
import { PanelVerMas } from '@/widgets/asistente-panel/ui/PanelVerMas';
import { CosmosLoader } from './CosmosLoader';
import type { Mensaje } from '../model/conversaciones';

const PRIMARY = '#2f43d0';

// ── Chip panel types & data ──────────────────────────────────────────────────

type ChipPanel = 'actividades' | 'reportes' | 'periodos' | 'reglas' | 'ver-mas' | null;

const CHIP_A_PANEL: Record<string, ChipPanel> = {
  'Actividades pendientes': 'actividades',
  'Reportes de gestión': 'reportes',
  'Periodos contables': 'periodos',
  'Reglas de derivación': 'reglas',
  'ver-mas': 'ver-mas',
};

const ACTIVIDADES_ITEMS = [
  { texto: 'Borradores de asiento pendientes por revisar', cantidad: 20 },
  { texto: 'Borradores que fueron devueltos', cantidad: 5 },
  { texto: 'Borradores sin cuentas contables resueltas', cantidad: 10 },
  { texto: 'Periodos contables', cantidad: 1 },
];
const REPORTES_ITEMS = [
  { texto: 'Asientos por período durante el año' },
  { texto: '¿Cuántos asientos se enviaron este mes?' },
  { texto: '¿Cuántos asientos se aceptaron por destino este mes?' },
  { texto: '¿Cuánta actividad contable tuve en [período]?' },
];
const PERIODOS_ITEMS = [
  { texto: 'Periodos contables pendientes por cerrar', cantidad: 20 },
  { texto: 'Documentos pendientes por cerrar del periodo anterior', cantidad: 5 },
  { texto: '¿En qué períodos puedo registrar asientos?', cantidad: 10 },
  { texto: '¿Qué quedó sin procesar en el período [X]?', cantidad: 1 },
];
const REGLAS_ITEMS = [
  { texto: 'Revisar y formalizar reglas sugeridas', cantidad: 20 },
  { texto: 'Reglas con cuenta contable inactiva', cantidad: 5 },
  { texto: 'Revisar reglas inactivas', cantidad: 10 },
];

// ── Message sub-components ───────────────────────────────────────────────────

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

// ── ChatPanel ────────────────────────────────────────────────────────────────

export interface ChatPanelProps {
  modo: 'flotante' | 'lateral';
  mensajes?: Mensaje[];
  pensando?: boolean;
  textoLoader?: string;
  onHistorial?: () => void;
  onLateral?: () => void;
  onMinimizar?: () => void;
  onNueva?: () => void;
  onEnviarMensaje?: (texto: string) => void;
  onDetenerRespuesta?: () => void;
  onRenombrar?: (nombre: string) => void;
  nombreChat?: string;
  /** En modo flotante con mensajes, los chips navegan al panel expandido en lugar de abrir sub-panel local */
  onAbrirPanel?: (chip: string) => void;
  autoFocusInput?: boolean;
}

export function ChatPanel({
  modo,
  mensajes = [],
  pensando = false,
  textoLoader,
  onHistorial,
  onLateral,
  onMinimizar,
  onNueva,
  onEnviarMensaje,
  onDetenerRespuesta,
  onRenombrar,
  nombreChat = '[Nombre del chat]',
  onAbrirPanel,
  autoFocusInput,
}: ChatPanelProps) {
  const [chipActivo, setChipActivo] = useState('');
  const [chipPanel, setChipPanel] = useState<ChipPanel>(null);
  const [inputTexto, setInputTexto] = useState('');
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

  function handleChipClick(chip: string) {
    // En modo flotante con mensajes, el padre maneja la navegación al panel expandido
    if (onAbrirPanel && tieneMensajes) {
      onAbrirPanel(chip);
      return;
    }
    const panel = CHIP_A_PANEL[chip] ?? null;
    if (chipActivo === chip && chipPanel !== null) {
      setChipActivo('');
      setChipPanel(null);
    } else {
      setChipActivo(chip);
      setChipPanel(panel);
    }
  }

  function handleVerMas() {
    if (chipPanel === 'ver-mas') {
      setChipActivo('');
      setChipPanel(null);
    } else {
      setChipActivo('');
      setChipPanel('ver-mas');
    }
  }

  function handleCerrarPanel() {
    setChipActivo('');
    setChipPanel(null);
  }

  function handleItemClick(texto: string) {
    setInputTexto(texto);
    setChipActivo('');
    setChipPanel(null);
  }

  const panelConfig: {
    titulo: string;
    items: { texto: string; cantidad?: number }[];
    onItemClick: (t: string) => void;
  } | null = (() => {
    switch (chipPanel) {
      case 'actividades': return { titulo: 'Actividades pendientes', items: ACTIVIDADES_ITEMS, onItemClick: handleItemClick };
      case 'reportes':    return { titulo: 'Reportes de gestión',    items: REPORTES_ITEMS,    onItemClick: handleItemClick };
      case 'periodos':    return { titulo: 'Periodos contables',      items: PERIODOS_ITEMS,    onItemClick: handleItemClick };
      case 'reglas':      return { titulo: 'Reglas de derivación',   items: REGLAS_ITEMS,      onItemClick: handleItemClick };
      default: return null;
    }
  })();

  const SP = subPanelVariants;

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
          <IconMessage2 size={14} color={PRIMARY} style={{ flexShrink: 0 }} />
          <InputBase
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => { if (nombre.trim()) onRenombrar?.(nombre.trim()); }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
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

          {pensando && <CosmosLoader texto={textoLoader} />}

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

      {/* Input section — sub-panels emerge above it */}
      <Box sx={{ position: 'relative' }}>
        {/* Chip sub-panels: actividades / reportes / periodos / reglas */}
        <AnimatePresence>
          {panelConfig && (
            <motion.div
              key={chipPanel}
              layout
              variants={SP}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 12, right: 12, zIndex: 5 }}
            >
              <ActividadesPendientes
                titulo={panelConfig.titulo}
                items={panelConfig.items}
                onCerrar={handleCerrarPanel}
                onItemClick={panelConfig.onItemClick}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel Ver más */}
        <AnimatePresence>
          {chipPanel === 'ver-mas' && (
            <motion.div
              key="ver-mas"
              layout
              variants={SP}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 12, right: 12, zIndex: 10 }}
            >
              <PanelVerMas moduloInicial="contabilidad" onCerrar={handleCerrarPanel} onItemClick={handleItemClick} tabsScrollable={!isFlotante} />
            </motion.div>
          )}
        </AnimatePresence>

        <AsistenteInput
          chipActivo={chipActivo}
          chipActivoTipo={null}
          inputTexto={inputTexto}
          inputChips={[]}
          onChipClick={handleChipClick}
          onMinimizar={onMinimizar ?? (() => {})}
          onVerHistorial={onHistorial ?? (() => {})}
          onExpandir={onLateral ?? (() => {})}
          onVerMas={handleVerMas}
          verMasActivo={chipPanel === 'ver-mas'}
          onEnviar={(texto) => { onEnviarMensaje?.(texto); setInputTexto(''); }}
          onDetener={onDetenerRespuesta}
          pensando={pensando}
          showTopActions={false}
          variant="embedded"
          verMasSoloIcono={!isFlotante}
          autoFocusInput={autoFocusInput}
        />
      </Box>
    </Box>
  );
}
