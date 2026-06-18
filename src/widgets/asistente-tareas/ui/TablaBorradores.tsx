import { useState } from 'react';
import { Box, Divider, IconButton, InputBase, Tab, Tabs, Typography } from '@mui/material';
import {
  IconArrowBackUp,
  IconEraser,
  IconHistory,
  IconPencil,
  IconPlus,
  IconSearch,
  IconSend,
} from '@tabler/icons-react';

type Estado = 'pendiente' | 'devuelto';

interface Borrador {
  id: string;
  ref: string;
  modulo: string;
  transaccion: string;
  fecha: string;
  valor: string;
  estado: Estado;
}

const FILAS: Borrador[] = [
  { id: 'BRD-76373', ref: 'OXP-COM-00000324', modulo: 'Tesorería', transaccion: 'Causación gasto', fecha: '22/06/2027', valor: '$500,00 USD', estado: 'pendiente' },
  { id: 'BRD-76372', ref: 'OXP-COM-00000324', modulo: 'Nómina', transaccion: 'Causación honorarios', fecha: '18/05/2026', valor: '$500,00 USD', estado: 'pendiente' },
  { id: 'BRD-76371', ref: 'OXP-COM-00000324', modulo: 'Obligaciones por pagar', transaccion: 'Causación ingreso', fecha: '03/01/2028', valor: '$500,00 USD', estado: 'devuelto' },
  { id: 'BRD-76375', ref: 'OXP-COM-00000324', modulo: 'Compras', transaccion: 'Anticipo proveedor', fecha: '12/08/2027', valor: '$500,00 USD', estado: 'devuelto' },
  { id: 'BRD-76370', ref: 'OXP-COM-00000324', modulo: 'Compras', transaccion: 'Anticipo proveedor', fecha: '10/04/2026', valor: '$500,00 USD', estado: 'pendiente' },
  { id: 'BRD-76377', ref: 'OXP-COM-00000324', modulo: 'Nómina', transaccion: 'Causación honorarios', fecha: '08/10/2027', valor: '$500,00 USD', estado: 'pendiente' },
  { id: 'BRD-76376', ref: 'OXP-COM-00000324', modulo: 'Obligaciones por pagar', transaccion: 'Anticipo proveedor', fecha: '25/09/2026', valor: '$500,00 USD', estado: 'pendiente' },
  { id: 'BRD-76374', ref: 'OXP-COM-00000324', modulo: 'Cuentas por pagar', transaccion: 'Legalización gastos', fecha: '05/07/2026', valor: '$500,00 USD', estado: 'pendiente' },
  { id: 'BRD-76369', ref: 'OXP-COM-00000324', modulo: 'Manual', transaccion: 'Legalización gastos', fecha: '28/02/2027', valor: '$500,00 USD', estado: 'devuelto' },
  { id: 'BRD-76368', ref: 'OXP-COM-00000324', modulo: 'Tesorería', transaccion: 'Causación gasto', fecha: '15/03/2026', valor: '$500,00 USD', estado: 'pendiente' },
  { id: 'BRD-76367', ref: 'OXP-COM-00000324', modulo: 'Nómina', transaccion: 'Causación gasto', fecha: '—', valor: '$500,00 USD', estado: 'pendiente' },
];

const PRIMARY = '#2f43d0';
const TEXT_SECONDARY = 'rgba(16,24,64,0.6)';
const BORDER = 'rgba(16,24,64,0.08)';

type Filtro = 'todos' | 'pendiente' | 'devuelto';

function EstadoChip({ estado }: { estado: Estado }) {
  const isPendiente = estado === 'pendiente';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        bgcolor: isPendiente ? '#e1e6ff' : '#fce4c0',
        borderRadius: '4px',
        px: '4px',
        py: '3px',
      }}
    >
      {!isPendiente && <IconArrowBackUp size={14} color="#bf360c" />}
      {isPendiente && (
        <Box sx={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconEraser size={12} color={PRIMARY} />
        </Box>
      )}
      <Typography sx={{ fontSize: '0.6875rem', color: isPendiente ? PRIMARY : '#bf360c', lineHeight: '14px', letterSpacing: '0.16px', whiteSpace: 'nowrap' }}>
        {isPendiente ? 'Pendiente' : 'Devuelto'}
      </Typography>
    </Box>
  );
}

function FilaTabla({ fila }: { fila: Borrador }) {
  const [hover, setHover] = useState(false);
  const isDevuelto = fila.estado === 'devuelto';

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pl: '16px',
        pr: '8px',
        py: '6px',
        borderBottom: `0.5px solid #eaebec`,
        bgcolor: isDevuelto && hover ? 'rgba(47,67,208,0.06)' : isDevuelto ? 'rgba(47,67,208,0.04)' : hover ? 'rgba(16,24,64,0.02)' : 'transparent',
        transition: 'background-color 0.15s',
        minWidth: 0,
      }}
    >
      {/* Referencia */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: 'text.primary', lineHeight: '16px', letterSpacing: '0.1px', whiteSpace: 'nowrap' }}>
          {fila.id}
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: PRIMARY, lineHeight: '14px', letterSpacing: '0.4px', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          {fila.ref}
        </Typography>
      </Box>

      {/* Módulo */}
      <Box sx={{ width: 160, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary', lineHeight: '16px', letterSpacing: '0.17px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fila.modulo}
        </Typography>
      </Box>

      {/* Transacción */}
      <Box sx={{ width: 140, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fila.transaccion}
        </Typography>
      </Box>

      {/* Fecha */}
      <Box sx={{ width: 90, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px', whiteSpace: 'nowrap' }}>
          {fila.fecha}
        </Typography>
      </Box>

      {/* Valor */}
      <Box sx={{ width: 140, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px', whiteSpace: 'nowrap' }}>
          {fila.valor}
        </Typography>
      </Box>

      {/* Estado */}
      <Box sx={{ width: 120, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <EstadoChip estado={fila.estado} />
      </Box>

      {/* Acciones */}
      <Box sx={{ width: 48, flexShrink: 0, display: 'flex', gap: '4px', justifyContent: 'flex-end', opacity: hover ? 1 : 0, transition: 'opacity 0.15s' }}>
        <IconButton size="small" sx={{ p: '3px' }}>
          <IconPencil size={15} color={TEXT_SECONDARY} />
        </IconButton>
        <IconButton size="small" sx={{ p: '3px' }}>
          <IconHistory size={15} color={TEXT_SECONDARY} />
        </IconButton>
      </Box>
    </Box>
  );
}

export function TablaBorradores() {
  const [tab, setTab] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [busqueda, setBusqueda] = useState('');

  const totalPendiente = FILAS.filter((f) => f.estado === 'pendiente').length;
  const totalDevuelto = FILAS.filter((f) => f.estado === 'devuelto').length;

  const filasFiltradas = FILAS.filter((f) => {
    const pasaFiltro = filtro === 'todos' || f.estado === filtro;
    const pasaBusqueda = busqueda === '' || f.id.toLowerCase().includes(busqueda.toLowerCase()) || f.ref.toLowerCase().includes(busqueda.toLowerCase());
    return pasaFiltro && pasaBusqueda;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>

      {/* Header tabs + acción */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `0.5px solid #eaebec`, pr: '16px', pt: '2px', flexShrink: 0 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': { minHeight: 40, py: 0, px: '16px', fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '0.4px', textTransform: 'none', gap: '8px' },
            '& .Mui-selected': { color: PRIMARY },
            '& .MuiTabs-indicator': { bgcolor: PRIMARY, height: 2 },
          }}
        >
          <Tab
            value={0}
            label="Borradores (45)"
            icon={<IconEraser size={16} />}
            iconPosition="start"
            sx={{ color: tab === 0 ? PRIMARY : TEXT_SECONDARY }}
          />
          <Tab
            value={1}
            label="Enviados (20)"
            icon={<IconSend size={16} />}
            iconPosition="start"
            sx={{ color: tab === 1 ? PRIMARY : TEXT_SECONDARY }}
          />
        </Tabs>

        <Box
          component="button"
          sx={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: `1px solid rgba(47,67,208,0.5)`, borderRadius: '4px',
            px: '10px', py: '4px',
            bgcolor: 'transparent', cursor: 'pointer',
            transition: 'background-color 0.15s',
            '&:hover': { bgcolor: 'rgba(47,67,208,0.04)' },
          }}
        >
          <IconPlus size={16} color={PRIMARY} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: PRIMARY, lineHeight: '18px', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>
            Crear asiento
          </Typography>
        </Box>
      </Box>

      {/* Filtros + búsqueda */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '16px', py: '10px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Chip Todos */}
          {(['todos', 'pendiente', 'devuelto'] as Filtro[]).map((f) => {
            const isActive = filtro === f;
            const label = f === 'todos' ? 'Todos' : f === 'pendiente' ? 'Pendientes' : 'Devueltos';
            const count = f === 'todos' ? FILAS.length : f === 'pendiente' ? totalPendiente : totalDevuelto;
            return (
              <Box
                key={f}
                component="button"
                onClick={() => setFiltro(f)}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  height: 20,
                  bgcolor: isActive ? '#e1e6ff' : 'transparent',
                  border: isActive ? 'none' : `1px solid #eaebec`,
                  borderRadius: '4px', px: '4px', py: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: isActive ? '#d4dcff' : 'rgba(16,24,64,0.04)' },
                }}
              >
                <Typography sx={{ fontSize: '0.6875rem', color: isActive ? PRIMARY : 'text.primary', lineHeight: '14px', letterSpacing: '0.16px', whiteSpace: 'nowrap', px: '2px' }}>
                  {label}
                </Typography>
                <Box sx={{ bgcolor: isActive ? PRIMARY : '#eaebec', borderRadius: '100px', px: '5px', py: '2.5px', display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: isActive ? '#fff' : TEXT_SECONDARY, lineHeight: '11px', letterSpacing: '0.14px' }}>
                    {count}
                  </Typography>
                </Box>
              </Box>
            );
          })}

          <Divider orientation="vertical" flexItem sx={{ height: 12, alignSelf: 'center', mx: 0.5 }} />

          {/* Módulo dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px', whiteSpace: 'nowrap' }}>
              Módulo:
            </Typography>
            <Box
              component="button"
              sx={{ display: 'flex', alignItems: 'center', gap: '8px', bgcolor: 'transparent', border: 'none', borderRadius: '4px', px: '10px', py: '4px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(16,24,64,0.04)' } }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.primary', lineHeight: '18px', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>
                Todos
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Search */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center',
            border: `1px solid ${BORDER}`,
            borderRadius: '4px', px: '12px', height: 32, width: 280,
            '&:focus-within': { borderColor: 'rgba(47,67,208,0.5)' },
            transition: 'border-color 0.15s',
          }}
        >
          <InputBase
            placeholder="Buscar borrador"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ flex: 1, fontSize: '0.8125rem', '& input': { padding: 0, '&::placeholder': { color: TEXT_SECONDARY, opacity: 1 } } }}
          />
          <IconSearch size={16} color={TEXT_SECONDARY} />
        </Box>
      </Box>

      {/* Tabla */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,24,64,0.15) transparent' }}>
        <Box sx={{ minWidth: 860 }}>
          {/* Encabezado */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: '8px',
              bgcolor: '#f5f5f6', borderRadius: '4px',
              pl: '16px', pr: '8px', py: '4px', mx: '16px',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px' }}>Referencia</Typography>
            </Box>
            <Box sx={{ width: 160, flexShrink: 0 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px' }}>Módulo</Typography>
            </Box>
            <Box sx={{ width: 140, flexShrink: 0 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px' }}>Transacción</Typography>
            </Box>
            <Box sx={{ width: 90, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px' }}>Fecha</Typography>
            </Box>
            <Box sx={{ width: 140, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px' }}>Valor</Typography>
            </Box>
            <Box sx={{ width: 120, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: TEXT_SECONDARY, lineHeight: '16px', letterSpacing: '0.17px' }}>Estado</Typography>
            </Box>
            <Box sx={{ width: 48, flexShrink: 0 }} />
          </Box>

          {/* Filas */}
          <Box sx={{ px: '16px' }}>
            {filasFiltradas.map((fila) => (
              <FilaTabla key={fila.id} fila={fila} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
