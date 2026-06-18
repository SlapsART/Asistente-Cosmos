import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { IconAlertCircle, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { subPanelVariants } from '@/shared/ui/anim';
import { ActividadesPendientes } from './ActividadesPendientes';
import { AsistenteInput } from './AsistenteInput';
import { PanelTareasPendientes } from './PanelTareasPendientes';
import { PanelVerMas } from './PanelVerMas';

interface TareaNotif {
  titulo: string;
  cantidad: number;
  descripcion: string;
}

const TAREAS_NOTIF: TareaNotif[] = [
  { titulo: 'Revisar extractos devueltos', cantidad: 3, descripcion: 'El más antiguo lleva 3 días sin corregir' },
  { titulo: 'Corregir obligaciones devueltas', cantidad: 3, descripcion: 'La más antigua lleva 4 días sin corregir' },
  { titulo: 'Emitir DSE DIAN', cantidad: 3, descripcion: '"El soporte adjunto no corresponde al pe…"' },
];

type PanelTipo =
  | 'actividades'
  | 'reportes'
  | 'periodos'
  | 'reglas'
  | 'ver-mas'
  | null;

interface Estado {
  panel: PanelTipo;
  chipActivo: string;
  inputTexto: string;
  inputChips: string[];
  chipValues: Record<string, string>;
}

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

const ESTADO_INICIAL: Estado = {
  panel: null,
  chipActivo: '',
  inputTexto: '',
  inputChips: [],
  chipValues: {},
};

const CHIP_A_PANEL: Record<string, PanelTipo> = {
  'Actividades pendientes': 'actividades',
  'Reportes de gestión': 'reportes',
  'Periodos contables': 'periodos',
  'Reglas de derivación': 'reglas',
  'ver-mas': 'ver-mas',
};

const PRIMARY_PANELS: PanelTipo[] = ['actividades', 'reportes', 'periodos', 'reglas'];

interface AsistentePanelProps {
  onMinimizar?: () => void;
  onVerHistorial?: () => void;
  onExpandir?: () => void;
  onEnviar?: () => void;
  onEnviarConMensaje?: (texto: string) => void;
  onEnviarMensajeSistema?: (texto: string) => void;
  /** Chip pre-seleccionado al abrir el panel (viene del ChatPanel) */
  chipInicial?: string;
  /** Oculta la notificación gris de tarea pendiente (usada cuando el widget ya muestra su propio banner) */
  ocultarNotificacion?: boolean;
  /** Píxeles extra que se suman al bottom de los sub-paneles (útil cuando hay un banner encima del asistente) */
  subPanelExtraOffset?: number;
  /** Abre el panel de tareas pendientes desde fuera (p.ej. desde el TareaBanner) */
  abrirPanelTareas?: boolean;
  /** Callback para resetear abrirPanelTareas en el padre una vez abierto */
  onPanelTareasAbierto?: () => void;
  /** Callback cuando el panel de tareas pendientes se cierra */
  onPanelTareasCerrado?: () => void;
  /** Cuando hay conversación activa, clic en el input abre el chat directamente */
  onAbrirChat?: () => void;
}

export function AsistentePanel({ onMinimizar, onVerHistorial, onExpandir, onEnviar, onEnviarConMensaje, onEnviarMensajeSistema, chipInicial, ocultarNotificacion = false, subPanelExtraOffset = 0, abrirPanelTareas, onPanelTareasAbierto, onPanelTareasCerrado, onAbrirChat }: AsistentePanelProps = {}) {
  const [estado, setEstado] = useState<Estado>(() => {
    if (!chipInicial) return ESTADO_INICIAL;
    const panel = CHIP_A_PANEL[chipInicial] ?? null;
    return { panel, chipActivo: chipInicial !== 'ver-mas' ? chipInicial : '', inputTexto: '', inputChips: [], chipValues: {} };
  });
  const [pensando, setPensando] = useState(false);
  const pensandoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tareaIdx, setTareaIdx] = useState(0);
  const [notifVisible, setNotifVisible] = useState(false);
  const [panelTareasOpen, setPanelTareasOpen] = useState(false);
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    notifTimerRef.current = setTimeout(() => setNotifVisible(true), 4000);
    return () => { if (notifTimerRef.current) clearTimeout(notifTimerRef.current); };
  }, []);

  useEffect(() => {
    if (abrirPanelTareas) {
      setPanelTareasOpen(true);
      onPanelTareasAbierto?.();
    }
  }, [abrirPanelTareas]);

  function handleCerrarNotif() {
    setNotifVisible(false);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => {
      setTareaIdx((prev) => (prev + 1) % TAREAS_NOTIF.length);
      setNotifVisible(true);
    }, 8000);
  }

  function handleVerTodo() {
    setNotifVisible(false);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    setPanelTareasOpen(true);
  }

  function handleNotifClick() {
    setNotifVisible(false);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    onEnviarMensajeSistema?.('Dirigiendo a la tarea');
  }

  function handleCerrarPanelTareas() {
    setPanelTareasOpen(false);
    onPanelTareasCerrado?.();
  }

  const tareaActual = TAREAS_NOTIF[tareaIdx];

  const { panel, chipActivo, inputTexto, inputChips, chipValues } = estado;

  const chipActivoTipo: 'primario' | 'sub' | null =
    panel !== null && PRIMARY_PANELS.includes(panel) ? 'primario' : null;

  function onChipClick(chip: string) {
    const panelMap: Record<string, PanelTipo> = {
      'Actividades pendientes': 'actividades',
      'Reportes de gestión': 'reportes',
      'Periodos contables': 'periodos',
      'Reglas de derivación': 'reglas',
    };
    setEstado({ panel: panelMap[chip] ?? null, chipActivo: chip, inputTexto: '', inputChips: [], chipValues: {} });
  }

  function onCerrarPanel() {
    setEstado({ panel: null, chipActivo: '', inputTexto: '', inputChips: [], chipValues: {} });
  }

  function onContextoChipClick(_chip: string) {
    setEstado((prev) => ({ ...prev, panel: null }));
  }

  function onContextoChipSelect(chip: string, valor: string) {
    setEstado((prev) => ({
      ...prev,
      chipValues: { ...prev.chipValues, [chip]: valor },
    }));
  }

  function onToggleVerMas() {
    setEstado((prev) => {
      const abriendo = prev.panel !== 'ver-mas';
      return {
        ...prev,
        panel: abriendo ? 'ver-mas' : null,
        chipActivo: abriendo ? '' : prev.chipActivo,
        inputChips: abriendo ? [] : prev.inputChips,
        chipValues: abriendo ? {} : prev.chipValues,
      };
    });
  }

  function handleEnviar(texto: string) {
    if (onEnviarConMensaje) {
      onEnviarConMensaje(texto);
      return;
    }
    if (!onEnviar) return;
    setPensando(true);
    if (pensandoTimer.current) clearTimeout(pensandoTimer.current);
    pensandoTimer.current = setTimeout(() => {
      onEnviar();
    }, 600);
  }

  function onVerMasItemClick(texto: string) {
    setEstado({ panel: null, chipActivo: '', inputTexto: texto, inputChips: [], chipValues: {} });
  }

  function onActividadClick(texto: string) {
    if (texto === 'Periodos contables') {
      setEstado({
        panel: null,
        chipActivo: 'Actividades pendientes',
        inputTexto: 'Periodos contables',
        inputChips: ['Consulta', 'Asiento contable'],
        chipValues: {},
      });
      return;
    }
    setEstado({
      panel: null,
      chipActivo: 'Actividades pendientes',
      inputTexto: texto,
      inputChips: ['Asiento contable'],
      chipValues: {},
    });
  }

  function onPeriodoClick(texto: string) {
    if (texto === '¿En qué períodos puedo registrar asientos?') {
      setEstado({ panel: null, chipActivo: 'Periodos contables', inputTexto: texto, inputChips: [], chipValues: {} });
      return;
    }
    setEstado({
      panel: null,
      chipActivo: 'Periodos contables',
      inputTexto: texto,
      inputChips: texto === '¿Qué quedó sin procesar en el período [X]?' ? ['Período'] : ['Asiento contable'],
      chipValues: {},
    });
  }

  function onReporteOReglaClick(texto: string) {
    setEstado({
      panel: null,
      chipActivo,
      inputTexto: texto,
      inputChips: ['Asiento contable'],
      chipValues: {},
    });
  }

  const panelConfig: {
    titulo: string;
    items: { texto: string; cantidad?: number }[];
    onItemClick: (texto: string) => void;
  } | null = (() => {
    switch (panel) {
      case 'actividades':
        return { titulo: 'Actividades pendientes', items: ACTIVIDADES_ITEMS, onItemClick: onActividadClick };
      case 'reportes':
        return { titulo: 'Reportes de gestión', items: REPORTES_ITEMS, onItemClick: onReporteOReglaClick };
      case 'periodos':
        return { titulo: 'Periodos contables', items: PERIODOS_ITEMS, onItemClick: onPeriodoClick };
      case 'reglas':
        return { titulo: 'Reportes de gestión', items: REGLAS_ITEMS, onItemClick: onReporteOReglaClick };
      default:
        return null;
    }
  })();

  const SP = subPanelVariants;

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1, width: 680 }}>
      {/* Panel principal (actividades / reportes / periodos / reglas) */}
      <AnimatePresence>
        {panelConfig && (
          <motion.div
            key={panel}
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: `calc(100% + ${8 + subPanelExtraOffset}px)`, left: 0, right: 0, zIndex: 5 }}
          >
            <ActividadesPendientes
              titulo={panelConfig.titulo}
              items={panelConfig.items}
              onCerrar={onCerrarPanel}
              onItemClick={panelConfig.onItemClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Ver más — ancho completo, sobre el input */}
      <AnimatePresence>
        {panel === 'ver-mas' && (
          <motion.div
            key="ver-mas"
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: `calc(100% + ${8 + subPanelExtraOffset}px)`, left: 0, right: 0, zIndex: 10 }}
          >
            <PanelVerMas moduloInicial="contabilidad" onCerrar={onCerrarPanel} onItemClick={onVerMasItemClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification bar: tarea pendiente */}
      <AnimatePresence>
        {!ocultarNotificacion && notifVisible && (
          <motion.div
            key="tarea-notif"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <Typography
                component="span"
                onClick={(e) => { e.stopPropagation(); handleVerTodo(); }}
                sx={{
                  fontSize: '0.6875rem',
                  color: '#2f43d0',
                  letterSpacing: '0.4px',
                  lineHeight: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                Ver todas
              </Typography>
              <Box
                onClick={handleNotifClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: 'background.default',
                  borderRadius: '4px',
                  px: 1.5,
                  py: '6px',
                  gap: 1,
                  cursor: 'pointer',
                  width: '100%',
                  '&:hover': { bgcolor: 'rgba(47,67,208,0.04)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <IconAlertCircle size={14} color="rgba(16,24,64,0.6)" style={{ flexShrink: 0 }} />
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: 'text.primary',
                      lineHeight: '16px',
                      letterSpacing: '0.17px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {tareaActual.titulo}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: '#eaebec',
                      borderRadius: '100px',
                      px: '5px',
                      py: '2.5px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(16,24,64,0.6)', fontWeight: 500, lineHeight: '11px', letterSpacing: '0.14px' }}>
                      {tareaActual.cantidad}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: 'text.secondary',
                      lineHeight: '16px',
                      letterSpacing: '0.17px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {tareaActual.descripcion}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCerrarNotif(); }} sx={{ p: '3px' }}>
                  <IconX size={16} color="rgba(16,24,64,0.38)" />
                </IconButton>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input section with panel positioning */}
      <Box sx={{ position: 'relative' }}>
        <AnimatePresence>
          {panelTareasOpen && (
            <motion.div
              key="panel-tareas"
              variants={SP}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 10 }}
            >
              <PanelTareasPendientes onCerrar={handleCerrarPanelTareas} />
            </motion.div>
          )}
        </AnimatePresence>
        <AsistenteInput
          chipActivo={chipActivo}
          chipActivoTipo={chipActivoTipo}
          inputTexto={inputTexto}
          inputChips={inputChips}
          chipValues={chipValues}
          onChipClick={onChipClick}
          onContextoChipClick={onContextoChipClick}
          onContextoChipSelect={onContextoChipSelect}
          onMinimizar={onMinimizar ?? onCerrarPanel}
          onVerHistorial={onVerHistorial ?? (() => {})}
          onExpandir={onExpandir ?? (() => {})}
          onVerMas={onToggleVerMas}
          verMasActivo={panel === 'ver-mas'}
          pensando={pensando}
          onEnviar={onEnviar || onEnviarConMensaje ? handleEnviar : undefined}
          onInputFocus={onAbrirChat}
        />
      </Box>
    </Box>
  );
}
