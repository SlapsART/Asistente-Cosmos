import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import {
  IconArrowUpRight,
  IconBolt,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCoins,
  IconTable,
  IconUsers,
  IconX,
} from '@tabler/icons-react';

const PRIMARY = '#2f43d0';
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const MotionBox = motion(Box);
const BADGE_BG = '#eaebec';
const BADGE_TEXT = 'rgba(16,24,64,0.6)';
const SECTION_TITLE = 'rgba(16,24,64,0.6)';
const ITEM_TEXT = '#101840';
const ARROW_DEFAULT = 'rgba(16,24,64,0.35)';

interface SeccionData {
  titulo: string;
  cantidad: number;
  items: string[];
}

type ModuloKey = 'obligaciones' | 'contabilidad' | 'terceros' | 'impuestos';

interface ModuloConfig {
  label: string;
  Icon: React.ElementType;
  secciones: SeccionData[];
}

const MODULOS: Record<ModuloKey, ModuloConfig> = {
  obligaciones: {
    label: 'Obligaciones por pagar',
    Icon: IconTable,
    secciones: [
      {
        titulo: 'Registrar',
        cantidad: 4,
        items: [
          'Crear nuevo asiento de obligación',
          'Registrar pago de factura',
          'Registrar deuda por tarjeta de crédito',
          'Clasificar obligación por tercero',
        ],
      },
      {
        titulo: 'Gestión en espera',
        cantidad: 4,
        items: [
          'Obligaciones pendientes de aprobación',
          'Pagos en proceso de verificación',
          'Facturas retenidas por validar',
          'Solicitudes de devolución abiertas',
        ],
      },
      {
        titulo: 'Próximos vencimientos',
        cantidad: 4,
        items: [
          'Vence esta semana',
          'Vence este mes',
          'Obligaciones vencidas sin pagar',
          'Próximos vencimientos por tarjeta',
        ],
      },
      {
        titulo: 'Conciliaciones abiertas',
        cantidad: 3,
        items: [
          'Conciliaciones abiertas del período actual',
          'Diferencias sin resolver por tercero',
          'Conciliaciones pendientes de confirmar',
        ],
      },
    ],
  },
  contabilidad: {
    label: 'Contabilidad',
    Icon: IconBolt,
    secciones: [
      {
        titulo: 'Actividades pendientes',
        cantidad: 4,
        items: [
          'Borradores de asiento pendientes por revisar',
          'Borradores que fueron devueltos',
          'Borradores sin cuentas contables resueltas',
          'Periodos contables',
        ],
      },
      {
        titulo: 'Reportes de gestión',
        cantidad: 4,
        items: [
          'Asientos por período durante el año',
          '¿Cuántos asientos se enviaron este mes?',
          '¿Cuántos asientos se aceptaron por destino este mes?',
          '¿Cuánta actividad contable tuve en [período]?',
        ],
      },
      {
        titulo: 'Periodos contables',
        cantidad: 4,
        items: [
          'Periodos contables pendientes por cerrar',
          'Documentos pendientes por cerrar del periodo anterior',
          '¿En qué períodos puedo registrar asientos?',
          '¿Qué quedó sin procesar en el período [X]?',
        ],
      },
      {
        titulo: 'Reglas de derivación',
        cantidad: 3,
        items: [
          'Revisar y formalizar reglas sugeridas',
          'Reglas con cuenta contable inactiva',
          'Revisar reglas inactivas',
        ],
      },
    ],
  },
  terceros: {
    label: 'Terceros',
    Icon: IconUsers,
    secciones: [
      {
        titulo: 'Gestión de proveedores',
        cantidad: 5,
        items: [
          'Proveedores activos',
          'Proveedores por certificar',
          'RUT pendientes de actualización',
          'Validación DIAN',
          'Terceros con datos incompletos',
        ],
      },
      {
        titulo: 'Clientes',
        cantidad: 5,
        items: [
          'Clientes activos',
          'Clientes por certificar',
          'Saldos por cliente',
          'Cartera vencida',
          'Clientes nuevos del período',
        ],
      },
    ],
  },
  impuestos: {
    label: 'Impuestos',
    Icon: IconCoins,
    secciones: [
      {
        titulo: 'Obligaciones fiscales',
        cantidad: 5,
        items: [
          'IVA por período',
          'Retención en la fuente',
          'Declaraciones pendientes',
          'Información exógena',
          'Gravamen al movimiento financiero',
        ],
      },
      {
        titulo: 'Reportes tributarios',
        cantidad: 5,
        items: [
          'Resumen de IVA descontable',
          'Resumen de IVA generado',
          'Retenciones practicadas',
          'Retenciones recibidas',
          'Certificados de retención',
        ],
      },
    ],
  },
};

const MODULO_KEYS: ModuloKey[] = ['obligaciones', 'contabilidad', 'terceros', 'impuestos'];

function SeccionItem({ texto, onClick }: { texto: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        px: 2,
        py: '4px',
        cursor: 'pointer',
      }}
    >
      <IconArrowUpRight
        size={16}
        color={hover ? PRIMARY : ARROW_DEFAULT}
        style={{ flexShrink: 0, transition: 'color 0.15s' }}
      />
      <Tooltip title={texto} placement="top" arrow enterDelay={600}>
        <Typography
          variant="body2"
          noWrap
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: '0.8125rem',
            color: hover ? PRIMARY : ITEM_TEXT,
            transition: 'color 0.15s',
            lineHeight: '16px',
          }}
        >
          {texto}
        </Typography>
      </Tooltip>
    </Box>
  );
}

function SeccionPanel({
  seccion,
  abierta,
  onToggle,
  onItemClick,
}: {
  seccion: SeccionData;
  abierta: boolean;
  onToggle: () => void;
  onItemClick: (texto: string) => void;
}) {
  return (
    <Box>
      {/* Header */}
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(16,24,64,0.02)' },
        }}
      >
        <Box sx={{ flex: 1, py: '4px' }}>
          <Typography
            variant="subtitle2"
            sx={{ color: SECTION_TITLE, whiteSpace: 'nowrap' }}
          >
            {seccion.titulo}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: BADGE_BG,
            borderRadius: '100px',
            px: '5px',
            py: '2.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.6875rem',
              color: BADGE_TEXT,
              fontWeight: 500,
              lineHeight: '11px',
              letterSpacing: '0.14px',
            }}
          >
            {seccion.cantidad}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ p: '3px', flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          {abierta ? (
            <IconChevronUp size={14} color={BADGE_TEXT} />
          ) : (
            <IconChevronDown size={14} color={BADGE_TEXT} />
          )}
        </IconButton>
      </Box>

      {/* Items */}
      <AnimatePresence initial={false}>
        {abierta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <Box sx={{ pb: 1 }}>
              {seccion.items.map((item) => (
                <SeccionItem key={item} texto={item} onClick={() => onItemClick(item)} />
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

interface PanelVerMasProps {
  onCerrar: () => void;
  onItemClick: (texto: string) => void;
  moduloInicial?: ModuloKey;
  /** Tabs de módulos en una sola línea con scroll horizontal — para modo lateral */
  tabsScrollable?: boolean;
}

export function PanelVerMas({ onCerrar, onItemClick, moduloInicial = 'obligaciones', tabsScrollable = false }: PanelVerMasProps) {
  const [moduloActivo, setModuloActivo] = useState<ModuloKey>(moduloInicial);
  const [seccionAbierta, setSeccionAbierta] = useState<string>(MODULOS[moduloInicial].secciones[0].titulo);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [tabsCanScrollLeft, setTabsCanScrollLeft] = useState(false);
  const [tabsCanScrollRight, setTabsCanScrollRight] = useState(false);

  useEffect(() => {
    if (!tabsScrollable) return;
    const el = tabsScrollRef.current;
    if (!el) return;
    function check() {
      if (!el) return;
      setTabsCanScrollLeft(el.scrollLeft > 0);
      setTabsCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
    check();
    el.addEventListener('scroll', check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', check); ro.disconnect(); };
  }, [tabsScrollable]);

  function handleModuloChange(key: ModuloKey) {
    setModuloActivo(key);
    setSeccionAbierta(MODULOS[key].secciones[0].titulo);
  }

  function toggleSeccion(titulo: string) {
    setSeccionAbierta((prev) => (prev === titulo ? '' : titulo));
  }

  const modulo = MODULOS[moduloActivo];
  const ordenadoKeys: ModuloKey[] = [moduloInicial, ...MODULO_KEYS.filter((k) => k !== moduloInicial)];

  return (
    <MotionBox
      layout
      transition={{ duration: 0.28, ease: EASE }}
      sx={{
        bgcolor: '#fbfbfb',
        border: '1px solid rgba(47,67,208,0.4)',
        borderRadius: '8px',
        boxShadow: '0px 4px 24px rgba(0,0,0,0.1), 0px 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1.5,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Fila 1: Cerrar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton size="small" onClick={onCerrar} sx={{ p: '3px' }}>
          <IconX size={16} color="rgba(16,24,64,0.38)" />
        </IconButton>
      </Box>

      {/* Fila 2: Tabs de módulos */}
      {tabsScrollable ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => tabsScrollRef.current?.scrollBy({ left: -120, behavior: 'smooth' })}
            sx={{ p: '2px', flexShrink: 0, opacity: tabsCanScrollLeft ? 1 : 0.25, transition: 'opacity 0.2s' }}
          >
            <IconChevronLeft size={14} />
          </IconButton>
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            {tabsCanScrollLeft && (
              <Box sx={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, zIndex: 1, pointerEvents: 'none',
                background: 'linear-gradient(to right, #fbfbfb, transparent)',
              }} />
            )}
            <Box
              ref={tabsScrollRef}
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {ordenadoKeys.map((key) => {
                const m = MODULOS[key];
                const isActivo = key === moduloActivo;
                return (
                  <Chip
                    key={key}
                    label={m.label}
                    size="medium"
                    variant={isActivo ? 'filled' : 'outlined'}
                    color={isActivo ? 'primary' : 'default'}
                    onClick={() => handleModuloChange(key)}
                    sx={{ cursor: 'pointer', flexShrink: 0 }}
                  />
                );
              })}
            </Box>
            {tabsCanScrollRight && (
              <Box sx={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, zIndex: 1, pointerEvents: 'none',
                background: 'linear-gradient(to left, #fbfbfb, transparent)',
              }} />
            )}
          </Box>
          <IconButton
            size="small"
            onClick={() => tabsScrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' })}
            sx={{ p: '2px', flexShrink: 0, opacity: tabsCanScrollRight ? 1 : 0.25, transition: 'opacity 0.2s' }}
          >
            <IconChevronRight size={14} />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {ordenadoKeys.map((key) => {
            const m = MODULOS[key];
            const isActivo = key === moduloActivo;
            return (
              <Chip
                key={key}
                label={m.label}
                size="medium"
                variant={isActivo ? 'filled' : 'outlined'}
                color={isActivo ? 'primary' : 'default'}
                onClick={() => handleModuloChange(key)}
                sx={{ cursor: 'pointer', flexShrink: 0 }}
              />
            );
          })}
        </Box>
      )}

      {/* Fila 3: Contenido */}
      <Box>
        {modulo.secciones.map((seccion) => (
          <SeccionPanel
            key={seccion.titulo}
            seccion={seccion}
            abierta={seccionAbierta === seccion.titulo}
            onToggle={() => toggleSeccion(seccion.titulo)}
            onItemClick={onItemClick}
          />
        ))}
      </Box>
    </MotionBox>
  );
}
