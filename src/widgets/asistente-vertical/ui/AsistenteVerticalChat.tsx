import { useEffect, useRef, useState } from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import {
  IconCopy,
  IconDots,
  IconLayoutDashboard,
  IconPencil,
  IconRefresh,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { subPanelVariants } from '@/shared/ui/anim';
import { CosmosLoader } from '@/widgets/asistente-base/ui/CosmosLoader';
import { PanelVerMas, MODULOS, MODULO_KEYS, type ModuloKey } from '@/widgets/asistente-panel/ui/PanelVerMas';
import type { Mensaje } from '@/widgets/asistente-base/model/conversaciones';
import { AsistenteVerticalInput } from './AsistenteVerticalInput';

// ── Datos de sub-paneles ─────────────────────────────────────────────────────

type PanelTipo = ModuloKey | 'ver-mas' | null;

// ── Mensajes ─────────────────────────────────────────────────────────────────

function UserMessage({ mensaje }: { mensaje: Mensaje }) {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}
    >
      <Box sx={{ bgcolor: 'rgba(47,67,208,0.08)', borderRadius: '4px 4px 0 4px', px: 1, py: 0.5, maxWidth: '70%' }}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
          {mensaje.texto}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: hover ? 1 : 0, transition: 'opacity 0.15s' }}>
        {mensaje.hora && (
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6875rem' }}>
            {mensaje.hora}
          </Typography>
        )}
        <IconButton size="small" sx={{ p: '2px' }}><IconRefresh size={13} color="rgba(16,24,64,0.54)" /></IconButton>
        <IconButton size="small" sx={{ p: '2px' }}><IconPencil size={13} color="rgba(16,24,64,0.54)" /></IconButton>
        <IconButton size="small" sx={{ p: '2px' }}><IconCopy size={13} color="rgba(16,24,64,0.54)" /></IconButton>
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
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', pr: '20%' }}
    >
      <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
        {mensaje.texto}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: hover ? 1 : 0, transition: 'opacity 0.15s' }}>
        <IconButton size="small" sx={{ p: '2px' }}><IconCopy size={13} color="rgba(16,24,64,0.54)" /></IconButton>
        <IconButton size="small" sx={{ p: '2px' }}><IconRefresh size={13} color="rgba(16,24,64,0.54)" /></IconButton>
        <IconButton size="small" sx={{ p: '2px' }}><IconDots size={13} color="rgba(16,24,64,0.54)" /></IconButton>
      </Box>
    </Box>
  );
}

// ── Sección de input: pill vertical + chips debajo + disclaimer ───────────────

interface ChatInputSectionProps {
  onEnviar: (texto: string) => void;
  pensando: boolean;
  onDetener?: () => void;
}

function ChatInputSection({ onEnviar, pensando, onDetener }: ChatInputSectionProps) {
  const [chipActivo, setChipActivo] = useState<ModuloKey | ''>('');
  const [chipPanel, setChipPanel] = useState<PanelTipo>(null);
  const [inputTexto, setInputTexto] = useState('');
  const [inputChips, setInputChips] = useState<string[]>([]);
  const [chipValues, setChipValues] = useState<Record<string, string>>({});

  const chipActivoTipo: 'primario' | 'sub' | null =
    chipPanel !== null && chipPanel !== 'ver-mas' ? 'primario' : null;

  function handleChipClick(key: string) {
    const moduloKey = key as ModuloKey;
    if (chipActivo === moduloKey && chipPanel !== null) {
      setChipActivo('');
      setChipPanel(null);
    } else {
      setChipActivo(moduloKey);
      setChipPanel(moduloKey);
      setInputTexto('');
      setInputChips([]);
      setChipValues({});
    }
  }

  function handleToggleVerMas() {
    setChipPanel((prev) => (prev === 'ver-mas' ? null : 'ver-mas'));
    if (chipPanel !== 'ver-mas') setChipActivo('');
  }

  function handleCerrarPanel() {
    setChipActivo('');
    setChipPanel(null);
  }

  function handleItemClick(texto: string) {
    setInputTexto(texto);
    setChipPanel(null);
  }

  function handleEnviar(texto: string) {
    onEnviar(texto);
    setInputTexto('');
    setChipActivo('');
    setChipPanel(null);
    setInputChips([]);
    setChipValues({});
  }

  const moduloPanel = chipPanel !== null && chipPanel !== 'ver-mas' ? chipPanel : null;

  const SP = subPanelVariants;

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      {/* Panel de módulo seleccionado (solo intenciones de ese módulo) */}
      <AnimatePresence>
        {moduloPanel && (
          <motion.div
            key={moduloPanel}
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 5 }}
          >
            <PanelVerMas
              moduloInicial={moduloPanel}
              hideTabs
              onCerrar={handleCerrarPanel}
              onItemClick={handleItemClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chipPanel === 'ver-mas' && (
          <motion.div
            key="ver-mas"
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 10 }}
          >
            <PanelVerMas moduloInicial="contabilidad" onCerrar={handleCerrarPanel} onItemClick={handleItemClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Input pill (mismo estilo que el panel inicial) */}
      <AsistenteVerticalInput
        chipActivo={chipActivo}
        chipActivoTipo={chipActivoTipo}
        inputTexto={inputTexto}
        inputChips={inputChips}
        chipValues={chipValues}
        onChipClick={handleChipClick}
        onContextoChipClick={() => setChipPanel(null)}
        onContextoChipSelect={(chip, valor) => setChipValues((prev) => ({ ...prev, [chip]: valor }))}
        onMinimizar={() => {}}
        onVerHistorial={() => {}}
        onExpandir={() => {}}
        onVerMas={handleToggleVerMas}
        verMasActivo={chipPanel === 'ver-mas'}
        pensando={pensando}
        onEnviar={handleEnviar}
        onDetener={onDetener}
        variant="embedded"
        hideDisclaimer
      />

      {/* 2. Chips de intenciones — debajo del input */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {MODULO_KEYS.map((key) => {
          const isActive = key === chipActivo;
          return (
            <Chip
              key={key}
              label={MODULOS[key].label}
              size="medium"
              variant={isActive ? 'filled' : 'outlined'}
              color={isActive ? 'primary' : 'default'}
              onClick={() => handleChipClick(key)}
              sx={{ flexShrink: 0, cursor: 'pointer' }}
            />
          );
        })}
        <Chip
          label="Ver más"
          size="medium"
          variant={chipPanel === 'ver-mas' ? 'filled' : 'outlined'}
          color={chipPanel === 'ver-mas' ? 'primary' : 'default'}
          icon={<IconLayoutDashboard size={14} />}
          onClick={handleToggleVerMas}
          sx={{ flexShrink: 0, cursor: 'pointer' }}
        />
      </Box>

      {/* 3. Disclaimer — al final, igual que en los demás asistentes */}
      <Typography
        variant="caption"
        sx={{ color: 'text.disabled', textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: '0.4px', display: 'block' }}
      >
        El contenido generado por IA puede ser incorrecto.
      </Typography>
    </Box>
  );
}

// ── AsistenteVerticalChat ─────────────────────────────────────────────────────

export interface AsistenteVerticalChatProps {
  mensajes: Mensaje[];
  pensando?: boolean;
  textoLoader?: string;
  onEnviarMensaje: (texto: string) => void;
  onDetenerRespuesta?: () => void;
}

export function AsistenteVerticalChat({
  mensajes,
  pensando = false,
  textoLoader,
  onEnviarMensaje,
  onDetenerRespuesta,
}: AsistenteVerticalChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, pensando]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', overflow: 'hidden' }}>
      {/* Área de mensajes — spacer empuja los mensajes hacia abajo cuando hay pocos */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(16,24,64,0.15) transparent',
        }}
      >
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            px: 2,
            py: 2,
            mx: 'auto',
            width: '100%',
            maxWidth: 680,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {mensajes.map((m) => (
            <Box key={m.id}>
              {m.autor === 'usuario' ? <UserMessage mensaje={m} /> : <AgenteMessage mensaje={m} />}
            </Box>
          ))}
          {pensando && <CosmosLoader texto={textoLoader} />}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input + chips + disclaimer — fijo en la parte inferior, centrado */}
      <Box sx={{ flexShrink: 0, px: 2, pb: 2, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 680 }}>
          <ChatInputSection
            onEnviar={onEnviarMensaje}
            pensando={pensando}
            onDetener={onDetenerRespuesta}
          />
        </Box>
      </Box>
    </Box>
  );
}
