import { useState } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { subPanelVariants } from '@/shared/ui/anim';
import { ActividadesPendientes } from './ActividadesPendientes';
import { AsistenteInput } from './AsistenteInput';
import { PanelBuscador } from './PanelBuscador';
import { PanelCalendario } from './PanelCalendario';

type PanelTipo =
  | 'actividades'
  | 'reportes'
  | 'periodos'
  | 'reglas'
  | 'buscador-asiento'
  | 'buscador-consulta'
  | 'calendario'
  | null;

interface Estado {
  panel: PanelTipo;
  chipActivo: string;
  inputTexto: string;
  inputChips: string[];
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
};

const PRIMARY_PANELS: PanelTipo[] = ['actividades', 'reportes', 'periodos', 'reglas'];
const SUB_PANELS: PanelTipo[] = ['buscador-asiento', 'buscador-consulta', 'calendario'];

interface AsistentePanelProps {
  onMinimizar?: () => void;
  onVerHistorial?: () => void;
  onExpandir?: () => void;
  onEnviar?: () => void;
}

export function AsistentePanel({ onMinimizar, onVerHistorial, onExpandir, onEnviar }: AsistentePanelProps = {}) {
  const [estado, setEstado] = useState<Estado>(ESTADO_INICIAL);

  const { panel, chipActivo, inputTexto, inputChips } = estado;

  const chipActivoTipo: 'primario' | 'sub' | null =
    panel !== null && PRIMARY_PANELS.includes(panel)
      ? 'primario'
      : panel !== null && SUB_PANELS.includes(panel)
        ? 'sub'
        : null;

  function onChipClick(chip: string) {
    const panelMap: Record<string, PanelTipo> = {
      'Actividades pendientes': 'actividades',
      'Reportes de gestión': 'reportes',
      'Periodos contables': 'periodos',
      'Reglas de derivación': 'reglas',
    };
    setEstado({ panel: panelMap[chip] ?? null, chipActivo: chip, inputTexto: '', inputChips: [] });
  }

  function onCerrarPanel() {
    setEstado({ panel: null, chipActivo: '', inputTexto: '', inputChips: [] });
  }

  function onActividadClick(texto: string) {
    if (texto === 'Periodos contables') {
      setEstado({
        panel: 'buscador-consulta',
        chipActivo: 'Actividades pendientes',
        inputTexto: 'Periodos contables',
        inputChips: ['Consulta', 'Asiento contable'],
      });
      return;
    }
    setEstado({
      panel: 'buscador-asiento',
      chipActivo: 'Actividades pendientes',
      inputTexto: texto,
      inputChips: ['Asiento contable'],
    });
  }

  function onPeriodoClick(texto: string) {
    if (texto === '¿En qué períodos puedo registrar asientos?') {
      setEstado({ panel: null, chipActivo: 'Periodos contables', inputTexto: texto, inputChips: [] });
      return;
    }
    if (texto === '¿Qué quedó sin procesar en el período [X]?') {
      setEstado({
        panel: 'calendario',
        chipActivo: 'Periodos contables',
        inputTexto: texto,
        inputChips: ['Período'],
      });
      return;
    }
    setEstado({
      panel: 'buscador-asiento',
      chipActivo: 'Periodos contables',
      inputTexto: texto,
      inputChips: ['Asiento contable'],
    });
  }

  function onBuscadorItemClick(texto: string) {
    setEstado((prev) => ({ ...prev, panel: null, inputTexto: texto }));
  }

  function onReporteOReglaClick(texto: string) {
    setEstado({
      panel: 'buscador-asiento',
      chipActivo,
      inputTexto: texto,
      inputChips: ['Asiento contable'],
    });
  }

  const panelConfig: {
    titulo: string;
    items: { texto: string; cantidad?: number }[];
    onItemClick: (texto: string) => void;
  } | null = (() => {
    switch (panel) {
      case 'actividades':
        return {
          titulo: 'Actividades pendientes',
          items: ACTIVIDADES_ITEMS,
          onItemClick: onActividadClick,
        };
      case 'reportes':
        return {
          titulo: 'Reportes de gestión',
          items: REPORTES_ITEMS,
          onItemClick: onReporteOReglaClick,
        };
      case 'periodos':
        return {
          titulo: 'Periodos contables',
          items: PERIODOS_ITEMS,
          onItemClick: onPeriodoClick,
        };
      case 'reglas':
        return {
          titulo: 'Reportes de gestión',
          items: REGLAS_ITEMS,
          onItemClick: onReporteOReglaClick,
        };
      default:
        return null;
    }
  })();

  const SP = subPanelVariants;

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1, width: 680 }}>
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

      <AnimatePresence>
        {(panel === 'buscador-asiento' || panel === 'buscador-consulta') && (
          <motion.div
            key={panel}
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', right: 0, zIndex: 1200 }}
          >
            <PanelBuscador
              tipo={panel === 'buscador-asiento' ? 'asiento' : 'consulta'}
              onItemClick={onBuscadorItemClick}
            />
          </motion.div>
        )}
        {panel === 'calendario' && (
          <motion.div
            key="calendario"
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', right: 0, zIndex: 1200 }}
          >
            <PanelCalendario />
          </motion.div>
        )}
      </AnimatePresence>

      <AsistenteInput
        chipActivo={chipActivo}
        chipActivoTipo={chipActivoTipo}
        inputTexto={inputTexto}
        inputChips={inputChips}
        onChipClick={onChipClick}
        onMinimizar={onMinimizar ?? onCerrarPanel}
        onVerHistorial={onVerHistorial ?? (() => {})}
        onExpandir={onExpandir ?? (() => {})}
        onVerMas={() => {}}
        onEnviar={onEnviar}
      />
    </Box>
  );
}
