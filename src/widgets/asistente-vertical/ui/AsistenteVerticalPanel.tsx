import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { IconAlertCircle, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { subPanelVariants } from '@/shared/ui/anim';
import { ActividadesPendientes } from '@/widgets/asistente-panel/ui/ActividadesPendientes';
import { PanelTareasPendientes } from '@/widgets/asistente-panel/ui/PanelTareasPendientes';
import { PanelVerMas } from '@/widgets/asistente-panel/ui/PanelVerMas';
import { AsistenteVerticalInput } from './AsistenteVerticalInput';
import sincoIoLogo from '@/assets/sinco-io-logo.svg';

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

interface AsistenteVerticalPanelProps {
  onMinimizar?: () => void;
  onVerHistorial?: () => void;
  onExpandir?: () => void;
  onEnviar?: () => void;
  onEnviarMensajeSistema?: (texto: string) => void;
  chipInicial?: string;
}

export function AsistenteVerticalPanel({
  onMinimizar,
  onVerHistorial,
  onExpandir,
  onEnviar,
  onEnviarMensajeSistema,
  chipInicial,
}: AsistenteVerticalPanelProps = {}) {
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

  function handleEnviar(_texto: string) {
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
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 5, width: 680, alignItems: 'center' }}>
      {/* Panel principal (actividades / reportes / periodos / reglas) */}
      <AnimatePresence>
        {panelConfig && (
          <motion.div
            key={panel}
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 5 }}
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

      {/* Panel Ver más */}
      <AnimatePresence>
        {panel === 'ver-mas' && (
          <motion.div
            key="ver-mas"
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 10 }}
          >
            <PanelVerMas moduloInicial="contabilidad" onCerrar={onCerrarPanel} onItemClick={onVerMasItemClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification bar — comentado temporalmente para el vertical */}
      {/* <AnimatePresence>
        {notifVisible && (
          <motion.div key="tarea-notif" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
            ...
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Logo */}
      <Box component="img" src={sincoIoLogo} alt="Sinco IO" sx={{ width: 153, height: 36, flexShrink: 0 }} />

      {/* Input section */}
      <Box sx={{ position: 'relative', width: '100%' }}>
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
        <AsistenteVerticalInput
          variant="embedded"
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
          onEnviar={onEnviar ? handleEnviar : undefined}
          onAbrirPanel={(chip) => {
            if (chip === 'ver-mas') { onToggleVerMas(); return; }
            const panelMap: Record<string, PanelTipo> = {
              'Actividades pendientes': 'actividades',
              'Reportes de gestión': 'reportes',
              'Periodos contables': 'periodos',
              'Reglas de derivación': 'reglas',
            };
            setEstado({ panel: panelMap[chip] ?? null, chipActivo: chip, inputTexto: '', inputChips: [], chipValues: {} });
          }}
        />
      </Box>
    </Box>
  );
}
