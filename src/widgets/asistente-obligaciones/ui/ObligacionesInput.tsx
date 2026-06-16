import { useState, useEffect } from 'react';
import { Box, Chip, Divider, IconButton, InputBase, Menu, MenuItem, Typography } from '@mui/material';
import {
  IconArrowUp,
  IconBoxAlignRight,
  IconLayoutDashboard,
  IconMessageSearch,
  IconMinus,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';

const FIGMA_PRIMARY = '#2f43d0';

const QUICK_ACTIONS = [
  'Registrar',
  'Gestión en espera',
  'Saldos y balances',
  'Próximos vencimientos',
  'Conciliaciones abiertas',
];

const CHIP_MENU_OPTIONS: Record<string, string[]> = {
  Tercero: ['Uber transporte', 'Marriot Hotels', 'American Airlines S.A.S.'],
  Tarjeta: ['TC **** 4588 MC', 'TC **** 1547 VISA', 'TC **** 2234 MC'],
  Estado: ['Pendiente', 'En revisión', 'Aprobado'],
  Período: ['01/10/26 → 31/12/26', '01/07/26 → 30/09/26', '01/04/26 → 30/06/26'],
};

interface ObligacionesInputProps {
  chipActivo: string;
  chipActivoTipo: 'primario' | 'sub' | null;
  inputTexto?: string;
  inputChips?: string[];
  onChipClick: (chip: string) => void;
  onContextoChipClick?: (chip: string) => void;
  onContextoChipSelect?: (chip: string, valor: string) => void;
  onMinimizar: () => void;
  onVerHistorial: () => void;
  onExpandir: () => void;
  onVerMas: () => void;
  onEnviar?: () => void;
  showTopActions?: boolean;
  variant?: 'card' | 'embedded';
}

export function ObligacionesInput({
  chipActivo,
  chipActivoTipo,
  inputTexto,
  inputChips = [],
  onChipClick,
  onContextoChipClick,
  onContextoChipSelect,
  onMinimizar,
  onVerHistorial,
  onExpandir,
  onVerMas,
  onEnviar,
  showTopActions = true,
  variant = 'card',
}: ObligacionesInputProps) {
  const [localTexto, setLocalTexto] = useState(inputTexto ?? '');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuChip, setMenuChip] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    setLocalTexto(inputTexto ?? '');
  }, [inputTexto]);

  const tieneTexto = Boolean(localTexto);
  const isCard = variant === 'card';

  function handleContextChipClick(chip: string, e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    if (chip in CHIP_MENU_OPTIONS) {
      setMenuAnchor(e.currentTarget);
      setMenuChip(chip);
      setBusqueda('');
    } else {
      onContextoChipClick?.(chip);
    }
  }

  function handleMenuSelect(valor: string) {
    onContextoChipSelect?.(menuChip, valor);
    setMenuAnchor(null);
    setMenuChip('');
    setBusqueda('');
  }

  function handleMenuClose() {
    setMenuAnchor(null);
    setMenuChip('');
    setBusqueda('');
  }

  const filteredOptions =
    menuChip && CHIP_MENU_OPTIONS[menuChip]
      ? CHIP_MENU_OPTIONS[menuChip].filter((o) =>
          o.toLowerCase().includes(busqueda.toLowerCase())
        )
      : [];

  return (
    <Box
      sx={{
        ...(isCard
          ? {
              bgcolor: 'background.paper',
              border: '1px solid rgba(47,67,208,0.12)',
              borderRadius: '8px',
              boxShadow:
                '0px 3px 14px 2px rgba(47,67,208,0.09), 2px 4px 6px 1px rgba(182,192,255,0.14), 2px 4px 4px -3px rgba(182,192,255,0.2)',
            }
          : { borderTop: '1px solid rgba(16,24,64,0.08)' }),
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
        overflow: 'hidden',
        px: 1.5,
        py: 1,
        width: '100%',
      }}
    >
      {/* Acciones superiores */}
      {showTopActions && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <IconButton size="small" onClick={onVerHistorial} sx={{ p: '3px' }}>
              <IconMessageSearch size={16} />
            </IconButton>
            <IconButton size="small" onClick={onExpandir} sx={{ p: '3px' }}>
              <IconBoxAlignRight size={16} />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: '12px', alignSelf: 'center' }} />
            <IconButton size="small" onClick={onMinimizar} sx={{ p: '3px' }}>
              <IconMinus size={16} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Campo de entrada */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          border: '1px solid rgba(47,67,208,0.4)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pl: 1,
          pr: 0.75,
          py: 0.75,
          width: '100%',
        }}
      >
        <IconButton size="small" sx={{ p: '3px', flexShrink: 0 }}>
          <IconPlus size={14} />
        </IconButton>

        <Box
          sx={{ display: 'flex', flex: '1 0 0', gap: '8px', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}
        >
          <InputBase
            value={localTexto}
            onChange={(e) => setLocalTexto(e.target.value)}
            placeholder="Describe lo que necesitas..."
            inputProps={inputChips.length > 0 ? { size: Math.max(localTexto.length + 1, 2) } : undefined}
            sx={{
              flex: inputChips.length > 0 ? '0 0 auto' : '1 0 0',
              minWidth: 0,
              fontSize: '0.8125rem',
              color: 'text.primary',
              '& input': {
                padding: 0,
                '&::placeholder': { color: 'text.secondary', opacity: 1 },
              },
            }}
          />

          {/* Chips de contexto — clickeables, abren menús */}
          {inputChips.map((chip, i) => (
            <Chip
              key={i}
              label={chip}
              size="small"
              variant="outlined"
              color="primary"
              onClick={(e) => handleContextChipClick(chip, e)}
              sx={{
                flexShrink: 0,
                cursor: 'pointer',
                '&&': {
                  border: '1px solid rgba(47,67,208,0.5)',
                  color: 'text.secondary',
                },
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            bgcolor: tieneTexto ? FIGMA_PRIMARY : 'rgba(47,67,208,0.3)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background-color 0.2s',
          }}
        >
          <IconButton
            size="small"
            disabled={!tieneTexto}
            onClick={tieneTexto ? onEnviar : undefined}
            sx={{
              p: '4px',
              color: tieneTexto ? '#fff !important' : 'rgba(47,67,208,0.3) !important',
            }}
          >
            <IconArrowUp size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flex: '1 0 0',
            gap: 1,
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {QUICK_ACTIONS.map((accion) => {
            const isActive = accion === chipActivo;
            const esPrimario = isActive && chipActivoTipo === 'primario';
            const esSub = isActive && chipActivoTipo === 'sub';

            return (
              <Chip
                key={accion}
                label={accion}
                size="medium"
                variant="filled"
                color={esPrimario ? 'primary' : 'default'}
                onClick={() => onChipClick(accion)}
                sx={{
                  flexShrink: 0,
                  cursor: 'pointer',
                  ...(esSub ? { '&&': { color: FIGMA_PRIMARY } } : {}),
                }}
              />
            );
          })}

          {/* Fade a la derecha */}
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '32px',
              background: 'linear-gradient(to right, rgba(255,255,255,0), white)',
              pointerEvents: 'none',
            }}
          />
        </Box>

        <Chip
          label="Ver más"
          size="medium"
          variant="outlined"
          icon={<IconLayoutDashboard size={14} />}
          onClick={onVerMas}
          sx={{ flexShrink: 0 }}
        />
      </Box>

      {/* Footer disclaimer */}
      <Typography
        variant="caption"
        sx={{ color: 'text.disabled', textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: '0.4px' }}
      >
        El contenido generado por IA puede ser incorrecto.
      </Typography>

      {/* Dropdown menus para context chips */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 220,
              boxShadow:
                '0px 3px 14px 2px rgba(93,109,126,0.09), 0px 8px 10px 1px rgba(93,109,126,0.14), 0px 5px 5px -3px rgba(93,109,126,0.18)',
              borderRadius: '4px',
              mb: 1,
            },
          },
        }}
      >
        {/* Campo de búsqueda dentro del menú */}
        <MenuItem
          disableRipple
          onClick={(e) => e.stopPropagation()}
          sx={{ px: 2, py: 1, '&:hover': { bgcolor: 'transparent' } }}
        >
          <Box
            sx={{
              border: '1px solid rgba(16,24,64,0.2)',
              borderRadius: '4px',
              height: 32,
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              gap: 1,
              width: '100%',
            }}
          >
            <InputBase
              placeholder={`Buscar ${menuChip}`}
              value={busqueda}
              onChange={(e) => {
                e.stopPropagation();
                setBusqueda(e.target.value);
              }}
              autoFocus
              sx={{ flex: 1, fontSize: '0.8125rem' }}
            />
            <IconSearch size={14} color="rgba(16,24,64,0.38)" style={{ flexShrink: 0 }} />
          </Box>
        </MenuItem>

        {filteredOptions.map((opt) => (
          <MenuItem
            key={opt}
            onClick={() => handleMenuSelect(opt)}
            dense
            sx={{ fontSize: '0.875rem', py: '4px' }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
