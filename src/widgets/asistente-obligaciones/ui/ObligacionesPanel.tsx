import { useState, useRef } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { subPanelVariants } from '@/shared/ui/anim';
import { ActividadesPendientes } from '@/widgets/asistente-panel/ui/ActividadesPendientes';
import { PanelCalendario } from '@/widgets/asistente-panel/ui/PanelCalendario';
import { PanelVerMas } from '@/widgets/asistente-panel/ui/PanelVerMas';
import { ObligacionesInput } from './ObligacionesInput';

type PanelOb =
  | 'registrar'
  | 'gestion'
  | 'vencimientos'
  | 'conciliaciones'
  | 'calendario'
  | 'ver-mas'
  | null;

interface Estado {
  panel: PanelOb;
  chipActivo: string;
  inputTexto: string;
  inputChips: string[];
  chipValues: Record<string, string>;
}

const ESTADO_INICIAL: Estado = {
  panel: null,
  chipActivo: '',
  inputTexto: '',
  inputChips: [],
  chipValues: {},
};

const REGISTRAR_ITEMS = [
  { texto: 'Crear nuevo asiento de obligación' },
  { texto: 'Registrar pago de factura' },
  { texto: 'Registrar deuda por tarjeta de crédito' },
  { texto: 'Clasificar obligación por tercero' },
];

const GESTION_ITEMS = [
  { texto: 'Obligaciones pendientes de aprobación', cantidad: 8 },
  { texto: 'Pagos en proceso de verificación', cantidad: 3 },
  { texto: 'Facturas retenidas por validar', cantidad: 5 },
  { texto: 'Solicitudes de devolución abiertas', cantidad: 2 },
];

const VENCIMIENTOS_ITEMS = [
  { texto: 'Vence esta semana', cantidad: 4 },
  { texto: 'Vence este mes', cantidad: 12 },
  { texto: 'Obligaciones vencidas sin pagar', cantidad: 3 },
  { texto: 'Próximos vencimientos por tarjeta', cantidad: 7 },
];

const CONCILIACIONES_ITEMS = [
  { texto: 'Conciliaciones abiertas del período actual', cantidad: 6 },
  { texto: 'Diferencias sin resolver por tercero', cantidad: 4 },
  { texto: 'Conciliaciones pendientes de confirmar', cantidad: 2 },
];

const SALDOS_CONTEXT_CHIPS = ['Tercero', 'Tarjeta', 'Fecha de corte'];

const CHIP_TO_PANEL: Record<string, PanelOb> = {
  Registrar: 'registrar',
  'Gestión en espera': 'gestion',
  'Próximos vencimientos': 'vencimientos',
  'Conciliaciones abiertas': 'conciliaciones',
};

const PANEL_CONTEXT_CHIPS: Record<string, string[]> = {
  registrar: ['Tercero', 'Período'],
  gestion: ['Tercero', 'Estado'],
  vencimientos: ['Período', 'Tercero'],
  conciliaciones: ['Período'],
};

interface ObligacionesPanelProps {
  onMinimizar?: () => void;
  onVerHistorial?: () => void;
  onExpandir?: () => void;
  onEnviar?: () => void;
  chipInicial?: string;
  onEnviarConMensaje?: (texto: string) => void;
  onAbrirChat?: () => void;
}

export function ObligacionesPanel({
  onMinimizar,
  onVerHistorial,
  onExpandir,
  onEnviar,
  chipInicial,
  onEnviarConMensaje,
  onAbrirChat,
}: ObligacionesPanelProps = {}) {
  const [estado, setEstado] = useState<Estado>(() => {
    if (!chipInicial) return ESTADO_INICIAL;
    if (chipInicial === 'ver-mas') return { ...ESTADO_INICIAL, panel: 'ver-mas' };
    if (chipInicial === 'Saldos y balances') {
      return { panel: null, chipActivo: chipInicial, inputTexto: '', inputChips: SALDOS_CONTEXT_CHIPS, chipValues: {} };
    }
    const panelOb = CHIP_TO_PANEL[chipInicial] ?? null;
    return { panel: panelOb, chipActivo: chipInicial, inputTexto: '', inputChips: [], chipValues: {} };
  });
  const [pensando, setPensando] = useState(false);
  const pensandoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { panel, chipActivo, inputTexto, inputChips, chipValues } = estado;

  const chipActivoTipo: 'primario' | 'sub' | null =
    chipActivo === 'Saldos y balances' && inputChips.length > 0
      ? 'sub'
      : chipActivo !== ''
        ? 'primario'
        : null;

  function onChipClick(chip: string) {
    if (chip === 'Saldos y balances') {
      setEstado({ panel: null, chipActivo: chip, inputTexto: '', inputChips: SALDOS_CONTEXT_CHIPS, chipValues: {} });
      return;
    }
    const panelOb = CHIP_TO_PANEL[chip] ?? null;
    setEstado({ panel: panelOb, chipActivo: chip, inputTexto: '', inputChips: [], chipValues: {} });
  }

  function onCerrarPanel() {
    setEstado(ESTADO_INICIAL);
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

  function onToggleVerMas() {
    setEstado((prev) => {
      const abriendo = prev.panel !== 'ver-mas';
      return {
        ...prev,
        panel: abriendo ? 'ver-mas' : null,
        chipActivo: abriendo ? '' : prev.chipActivo,
        inputChips: abriendo ? [] : prev.inputChips,
      };
    });
  }

  function onVerMasItemClick(texto: string) {
    setEstado({ panel: null, chipActivo: '', inputTexto: texto, inputChips: [], chipValues: {} });
  }

  function onItemClick(texto: string) {
    const contextChips = panel ? (PANEL_CONTEXT_CHIPS[panel] ?? []) : [];
    setEstado((prev) => ({
      ...prev,
      panel: null,
      inputTexto: texto,
      inputChips: contextChips,
      chipValues: {},
    }));
  }

  function onContextoChipClick(chip: string) {
    if (chip === 'Fecha de corte') {
      setEstado((prev) => ({ ...prev, panel: 'calendario' }));
    }
  }

  function onCalendarioSelect(fecha: string) {
    setEstado((prev) => ({
      ...prev,
      panel: null,
      chipValues: { ...prev.chipValues, 'Fecha de corte': fecha },
    }));
  }

  function onContextoChipSelect(chip: string, valor: string) {
    setEstado((prev) => ({
      ...prev,
      chipValues: { ...prev.chipValues, [chip]: valor },
    }));
  }

  const panelConfig: {
    titulo: string;
    items: { texto: string; cantidad?: number }[];
  } | null = (() => {
    switch (panel) {
      case 'registrar':
        return { titulo: 'Registrar', items: REGISTRAR_ITEMS };
      case 'gestion':
        return { titulo: 'Gestión en espera', items: GESTION_ITEMS };
      case 'vencimientos':
        return { titulo: 'Próximos vencimientos', items: VENCIMIENTOS_ITEMS };
      case 'conciliaciones':
        return { titulo: 'Conciliaciones abiertas', items: CONCILIACIONES_ITEMS };
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
              onItemClick={onItemClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panel === 'calendario' && (
          <motion.div
            key="calendario"
            variants={SP}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', right: 0, zIndex: 1200 }}
          >
            <PanelCalendario onSelect={onCalendarioSelect} />
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
            <PanelVerMas
              moduloInicial="obligaciones"
              onCerrar={onCerrarPanel}
              onItemClick={onVerMasItemClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ObligacionesInput
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
  );
}
