import { useState } from 'react';
import { Box, Chip, Collapse, IconButton, Typography } from '@mui/material';
import {
  IconArrowUpRight,
  IconBolt,
  IconChevronDown,
  IconChevronUp,
  IconCoins,
  IconTable,
  IconUsers,
  IconX,
} from '@tabler/icons-react';

const PRIMARY = '#2f43d0';
const CHIP_ACTIVE_BG = '#e1e6ff';
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
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.8125rem',
          color: hover ? PRIMARY : ITEM_TEXT,
          transition: 'color 0.15s',
          lineHeight: '16px',
        }}
      >
        {texto}
      </Typography>
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
      <Collapse in={abierta}>
        <Box sx={{ pb: 1 }}>
          {seccion.items.map((item) => (
            <SeccionItem key={item} texto={item} onClick={() => onItemClick(item)} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

interface PanelVerMasProps {
  onCerrar: () => void;
  onItemClick: (texto: string) => void;
  moduloInicial?: ModuloKey;
}

export function PanelVerMas({ onCerrar, onItemClick, moduloInicial = 'obligaciones' }: PanelVerMasProps) {
  const [moduloActivo, setModuloActivo] = useState<ModuloKey>(moduloInicial);
  const [seccionAbierta, setSeccionAbierta] = useState<string>(MODULOS[moduloInicial].secciones[0].titulo);

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
    <Box
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
        width: 656,
        mx: 'auto',
      }}
    >
      {/* Fila 1: Cerrar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton size="small" onClick={onCerrar} sx={{ p: '3px' }}>
          <IconX size={16} color="rgba(16,24,64,0.38)" />
        </IconButton>
      </Box>

      {/* Fila 2: Tabs de módulos */}
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
    </Box>
  );
}
