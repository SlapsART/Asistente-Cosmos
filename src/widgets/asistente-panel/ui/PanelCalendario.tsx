import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { IconChevronLeft, IconChevronRight, IconChevronDown } from '@tabler/icons-react';

const DIAS_SEMANA = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getSemanas(año: number, mes: number): (number | null)[][] {
  const primerDia = new Date(año, mes, 1).getDay();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const semanas: (number | null)[][] = [];
  let dia = 1;
  let semana: (number | null)[] = Array(primerDia).fill(null);

  while (dia <= diasEnMes) {
    semana.push(dia);
    if (semana.length === 7) {
      semanas.push(semana);
      semana = [];
    }
    dia++;
  }
  if (semana.length > 0) {
    while (semana.length < 7) semana.push(null);
    semanas.push(semana);
  }
  return semanas;
}

interface DiaCeldaProps {
  dia: number | null;
  seleccionado: boolean;
  onClick: (dia: number) => void;
}

function DiaCelda({ dia, seleccionado, onClick }: DiaCeldaProps) {
  if (dia === null) return <Box sx={{ width: 36, height: 36 }} />;

  return (
    <Box
      onClick={() => onClick(dia)}
      sx={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        cursor: 'pointer',
        bgcolor: seleccionado ? 'primary.main' : 'transparent',
        '&:hover': { bgcolor: seleccionado ? 'primary.dark' : 'action.hover' },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: seleccionado ? '#fff' : 'text.primary',
          fontWeight: seleccionado ? 500 : 400,
        }}
      >
        {dia}
      </Typography>
    </Box>
  );
}

interface PanelCalendarioProps {
  onSelect?: (fecha: string) => void;
}

export function PanelCalendario({ onSelect }: PanelCalendarioProps = {}) {
  const hoy = new Date();
  const [año, setAño] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);

  const semanas = getSemanas(año, mes);

  function irMesAnterior() {
    if (mes === 0) { setAño((a) => a - 1); setMes(11); }
    else setMes((m) => m - 1);
    setDiaSeleccionado(null);
  }

  function irMesSiguiente() {
    if (mes === 11) { setAño((a) => a + 1); setMes(0); }
    else setMes((m) => m + 1);
    setDiaSeleccionado(null);
  }

  function handleDiaClick(dia: number) {
    setDiaSeleccionado(dia);
    const fecha = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${año}`;
    onSelect?.(fecha);
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid rgba(47,67,208,0.12)',
        borderRadius: '8px',
        boxShadow:
          '0px 3px 14px 2px rgba(47,67,208,0.09), 2px 4px 6px 1px rgba(182,192,255,0.14), 2px 4px 4px -3px rgba(182,192,255,0.2)',
        width: 320,
        p: 2,
      }}
    >
      {/* Header mes */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
            {MESES[mes]} {año}
          </Typography>
          <IconChevronDown size={16} style={{ color: 'rgba(16,24,64,0.54)' }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={irMesAnterior} sx={{ p: '4px' }}>
            <IconChevronLeft size={16} />
          </IconButton>
          <IconButton size="small" onClick={irMesSiguiente} sx={{ p: '4px' }}>
            <IconChevronRight size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Cabecera días de semana */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: '2px', mb: 0.5 }}>
        {DIAS_SEMANA.map((d, i) => (
          <Box key={i} sx={{ width: 36, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Grid de días */}
      {semanas.map((semana, si) => (
        <Box key={si} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: '2px' }}>
          {semana.map((dia, di) => (
            <DiaCelda
              key={di}
              dia={dia}
              seleccionado={dia === diaSeleccionado}
              onClick={handleDiaClick}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
