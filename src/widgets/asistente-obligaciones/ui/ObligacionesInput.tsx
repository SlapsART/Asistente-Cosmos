import { useState, useEffect, useRef } from 'react';
import { Box, Chip, Divider, IconButton, InputBase, Menu, MenuItem, Typography } from '@mui/material';
import {
  IconArrowUp,
  IconBoxAlignRight,
  IconChevronLeft,
  IconChevronRight,
  IconLayoutDashboard,
  IconMessageSearch,
  IconMinus,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { ArchivoAdjunto, FileChip } from '@/shared/ui/FileChip';

const FIGMA_PRIMARY = '#2f43d0';

{
  const s = document.createElement('style');
  s.textContent = '@keyframes border-beam{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}';
  document.head.appendChild(s);
}

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
  chipValues?: Record<string, string>;
  onChipClick: (chip: string) => void;
  onContextoChipClick?: (chip: string) => void;
  onContextoChipSelect?: (chip: string, valor: string) => void;
  onMinimizar: () => void;
  onVerHistorial: () => void;
  onExpandir: () => void;
  onVerMas: () => void;
  verMasActivo?: boolean;
  pensando?: boolean;
  onEnviar?: () => void;
  showTopActions?: boolean;
  variant?: 'card' | 'embedded';
}

export function ObligacionesInput({
  chipActivo,
  chipActivoTipo,
  inputTexto,
  inputChips = [],
  chipValues = {},
  onChipClick,
  onContextoChipClick,
  onContextoChipSelect,
  onMinimizar,
  onVerHistorial,
  onExpandir,
  onVerMas,
  verMasActivo = false,
  pensando = false,
  onEnviar,
  showTopActions = true,
  variant = 'card',
}: ObligacionesInputProps) {
  const [localTexto, setLocalTexto] = useState(inputTexto ?? '');
  const [focused, setFocused] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuChip, setMenuChip] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [archivos, setArchivos] = useState<ArchivoAdjunto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chipsScrollRef = useRef<HTMLDivElement>(null);
  const [chipsOverflow, setChipsOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    setLocalTexto(inputTexto ?? '');
  }, [inputTexto]);

  useEffect(() => {
    const el = chipsScrollRef.current;
    if (!el) return;
    function check() {
      if (!el) return;
      const overflow = el.scrollWidth > el.clientWidth + 1;
      setChipsOverflow(overflow);
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    el.addEventListener('scroll', check, { passive: true });
    return () => { ro.disconnect(); el.removeEventListener('scroll', check); };
  }, []);

  function scrollChipsLeft() {
    chipsScrollRef.current?.scrollBy({ left: -120, behavior: 'smooth' });
  }
  function scrollChipsRight() {
    chipsScrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' });
  }

  const tieneTexto = Boolean(localTexto);
  const isCard = variant === 'card';

  function handleAgregarArchivo() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const MAX = 5 * 1024 * 1024;
    const nuevos: ArchivoAdjunto[] = Array.from(e.target.files ?? []).map((file) => {
      const partes = file.name.split('.');
      const formato = partes.length > 1 ? partes.pop()!.toUpperCase() : 'FILE';
      const nombre = partes.join('.') || file.name;
      const tamaño =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(0)}KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)}MB`;
      return file.size > MAX
        ? { nombre, tamaño, formato, estado: 'error' as const, mensajeError: 'Límite alcanzado máx 5mb' }
        : { nombre, tamaño, formato, estado: 'exito' as const };
    });
    setArchivos((prev) => [...prev, ...nuevos]);
    e.target.value = '';
  }

  function removerArchivo(index: number) {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  }

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
          position: 'relative',
          borderRadius: focused && !pensando ? '22px' : '20px',
          overflow: 'hidden',
          p: focused && !pensando ? '2px' : 0,
          width: '100%',
        }}
      >
        {/* Beam — static sx so the class never changes and animation never restarts */}
        <Box
          sx={{
            position: 'absolute',
            width: '400%',
            aspectRatio: '1 / 1',
            top: '50%',
            left: '50%',
            background: 'conic-gradient(transparent 0deg 250deg, rgba(47,67,208,0.01) 250deg 300deg, rgba(47,67,208,0.06) 300deg 338deg, rgba(47,67,208,0.22) 338deg 354deg, rgba(55,82,228,0.45) 354deg 360deg)',
            animation: 'border-beam 3s linear infinite',
            pointerEvents: 'none',
          }}
          style={{
            opacity: focused && !pensando ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
        <Box
          onFocus={() => setFocused(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}
          sx={{
            bgcolor: 'grey.100',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pl: 1,
            pr: 0.75,
            py: 0.75,
            position: 'relative',
            zIndex: 1,
            transition: 'border-color 0.2s',
            ...(pensando
              ? { border: '1px solid rgba(47,67,208,0.5)' }
              : focused
              ? {}
              : {
                  border: '1px solid rgba(16,24,64,0.2)',
                  '&:hover': { borderColor: 'rgba(47,67,208,0.5)' },
                }),
          }}
        >
          {/* Archivos adjuntos */}
          {archivos.length > 0 && (
            <Box sx={{ display: 'flex', gap: '4px', overflow: 'hidden' }}>
              {archivos.map((archivo, i) => (
                <FileChip key={i} archivo={archivo} onRemover={() => removerArchivo(i)} />
              ))}
            </Box>
          )}

          {/* Input row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={handleAgregarArchivo} sx={{ p: '3px', flexShrink: 0 }}>
              <IconPlus size={14} />
            </IconButton>

            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden', flex: '1 0 0' }}
            >
              <InputBase
                value={localTexto}
                onChange={(e) => setLocalTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && tieneTexto) {
                    e.preventDefault();
                    onEnviar?.();
                  }
                }}
                placeholder="Describe lo que necesitas..."
                sx={{
                  flex: inputChips.length > 0 ? '0 0 auto' : '1 0 0',
                  minWidth: 0,
                  fontSize: '0.8125rem',
                  color: 'text.primary',
                  '& input': {
                    padding: 0,
                    fieldSizing: 'content',
                    minWidth: '4ch',
                    '&::placeholder': { color: 'text.secondary', opacity: 1 },
                  },
                }}
              />

              {inputChips.map((chip, i) => {
                const valorSeleccionado = chipValues[chip];
                return (
                  <Chip
                    key={i}
                    label={valorSeleccionado ?? chip}
                    size="small"
                    variant={valorSeleccionado ? 'filled' : 'outlined'}
                    color="primary"
                    onClick={(e) => handleContextChipClick(chip, e)}
                    sx={{
                      flexShrink: 0,
                      cursor: 'pointer',
                      ...(!valorSeleccionado && {
                        '&&': { border: '1px solid rgba(47,67,208,0.5)', color: 'text.secondary', bgcolor: 'transparent' },
                      }),
                    }}
                  />
                );
              })}
            </Box>

            <IconButton
              size="small"
              onClick={tieneTexto ? onEnviar : undefined}
              sx={{
                p: '4px',
                borderRadius: '20px',
                flexShrink: 0,
                transition: 'background-color 0.2s, color 0.2s',
                '&&': {
                  bgcolor: tieneTexto ? FIGMA_PRIMARY : 'rgba(16,24,64,0.1)',
                  color: tieneTexto ? '#fff' : 'rgba(16,24,64,0.38)',
                },
                '&&:hover': {
                  bgcolor: tieneTexto ? FIGMA_PRIMARY : 'rgba(47,67,208,0.1)',
                  color: tieneTexto ? '#fff' : 'rgba(47,67,208,0.6)',
                },
              }}
            >
              <IconArrowUp size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
        {chipsOverflow && (
          <IconButton
            size="small"
            onClick={scrollChipsLeft}
            sx={{ p: '2px', flexShrink: 0, opacity: canScrollLeft ? 1 : 0.25, transition: 'opacity 0.2s' }}
          >
            <IconChevronLeft size={14} />
          </IconButton>
        )}

        <Box sx={{ position: 'relative', flex: '1 0 0', overflow: 'hidden' }}>
          {chipsOverflow && canScrollLeft && (
            <Box sx={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, zIndex: 1, pointerEvents: 'none',
              background: isCard
                ? 'linear-gradient(to right, white, transparent)'
                : 'linear-gradient(to right, #f5f5f6, transparent)',
            }} />
          )}

          <Box
            ref={chipsScrollRef}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {QUICK_ACTIONS.map((accion) => {
              const isActive = accion === chipActivo;
              return (
                <Chip
                  key={accion}
                  label={accion}
                  size="medium"
                  variant={isActive ? 'filled' : 'outlined'}
                  color={isActive ? 'primary' : 'default'}
                  onClick={() => onChipClick(accion)}
                  sx={{ flexShrink: 0, cursor: 'pointer' }}
                />
              );
            })}

            {!chipsOverflow && (
              <Chip
                label="Ver más"
                size="medium"
                variant={verMasActivo ? 'filled' : 'outlined'}
                color={verMasActivo ? 'primary' : 'default'}
                icon={<IconLayoutDashboard size={14} />}
                onClick={onVerMas}
                sx={{ flexShrink: 0, cursor: 'pointer' }}
              />
            )}
          </Box>

          {chipsOverflow && canScrollRight && (
            <Box sx={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, zIndex: 1, pointerEvents: 'none',
              background: isCard
                ? 'linear-gradient(to left, white, transparent)'
                : 'linear-gradient(to left, #f5f5f6, transparent)',
            }} />
          )}
        </Box>

        {chipsOverflow && (
          <>
            <IconButton
              size="small"
              onClick={scrollChipsRight}
              sx={{ p: '2px', flexShrink: 0, opacity: canScrollRight ? 1 : 0.25, transition: 'opacity 0.2s' }}
            >
              <IconChevronRight size={14} />
            </IconButton>
            <Chip
              label="Ver más"
              size="medium"
              variant={verMasActivo ? 'filled' : 'outlined'}
              color={verMasActivo ? 'primary' : 'default'}
              icon={<IconLayoutDashboard size={14} />}
              onClick={onVerMas}
              sx={{ flexShrink: 0, cursor: 'pointer' }}
            />
          </>
        )}
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
        anchorOrigin={{ vertical: -4, horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 220,
              boxShadow:
                '0px 3px 14px 2px rgba(93,109,126,0.09), 0px 8px 10px 1px rgba(93,109,126,0.14), 0px 5px 5px -3px rgba(93,109,126,0.18)',
              borderRadius: '4px',
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
