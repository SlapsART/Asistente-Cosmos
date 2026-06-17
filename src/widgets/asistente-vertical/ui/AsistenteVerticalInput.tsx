import { useState, useEffect, useRef } from 'react';
import { Box, Chip, IconButton, InputBase, Menu, MenuItem, Typography } from '@mui/material';
import {
  IconArrowUp,
  IconMessageSearch,
  IconPlus,
  IconSearch,
  IconSquare,
} from '@tabler/icons-react';
import { ArchivoAdjunto, FileChip } from '@/shared/ui/FileChip';

const FIGMA_PRIMARY = '#2f43d0';

let beamInjected = false;
if (!beamInjected) {
  const s = document.createElement('style');
  s.textContent = '@keyframes border-beam{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}';
  document.head.appendChild(s);
  beamInjected = true;
}

const CHIP_MENU_OPTIONS: Record<string, string[]> = {
  'Asiento contable': ['AST-001 Compra equipos', 'AST-002 Pago nómina', 'AST-003 Cierre mes octubre', 'AST-004 Ajuste IVA'],
  Consulta: ['Por fecha', 'Por cuenta contable', 'Por tercero', 'Por estado'],
  Período: ['01/10/26 → 31/12/26', '01/07/26 → 30/09/26', '01/04/26 → 30/06/26', '01/01/26 → 31/03/26'],
};

interface AsistenteVerticalInputProps {
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
  onEnviar?: (texto: string) => void;
  onDetener?: () => void;
  showTopActions?: boolean;
  variant?: 'card' | 'embedded';
  onAbrirPanel?: (chip: string) => void;
}

export function AsistenteVerticalInput({
  chipActivo: _chipActivo,
  chipActivoTipo: _chipActivoTipo,
  inputTexto,
  inputChips = [],
  chipValues = {},
  onChipClick: _onChipClick,
  onContextoChipClick,
  onContextoChipSelect,
  onMinimizar: _onMinimizar,
  onVerHistorial,
  onExpandir: _onExpandir,
  onVerMas: _onVerMas,
  verMasActivo: _verMasActivo,
  pensando = false,
  onEnviar,
  onDetener,
  showTopActions: _showTopActions,
  variant = 'card',
  onAbrirPanel: _onAbrirPanel,
}: AsistenteVerticalInputProps) {
  const [localTexto, setLocalTexto] = useState(inputTexto ?? '');
  const [focused, setFocused] = useState(false);
  const [archivos, setArchivos] = useState<ArchivoAdjunto[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuChip, setMenuChip] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalTexto(inputTexto ?? '');
  }, [inputTexto]);

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
      onContextoChipClick?.(chip);
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
      ? CHIP_MENU_OPTIONS[menuChip].filter((o) => o.toLowerCase().includes(busqueda.toLowerCase()))
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
          : {}),
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
        overflow: 'hidden',
        px: isCard ? 1.5 : 0,
        py: isCard ? 1 : 0,
        width: '100%',
      }}
    >
      {/* Pill vertical con beam */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '22px',
          overflow: 'hidden',
          p: '2px',
          bgcolor: 'grey.100',
          width: '100%',
          transition: 'box-shadow 0.2s',
          boxShadow: pensando
            ? 'inset 0 0 0 1px rgba(47,67,208,0.5)'
            : focused
            ? 'inset 0 0 0 1px transparent'
            : 'inset 0 0 0 1px rgba(16,24,64,0.2)',
          '&:hover': {
            boxShadow: pensando || focused
              ? 'inset 0 0 0 1px transparent'
              : 'inset 0 0 0 1px rgba(47,67,208,0.5)',
          },
        }}
      >
        {/* Beam — estático en sx para que emotion no regenere la clase */}
        <Box
          sx={{
            position: 'absolute',
            width: '400%',
            aspectRatio: '1 / 1',
            top: '50%',
            left: '50%',
            background:
              'conic-gradient(transparent 0deg 250deg, rgba(47,67,208,0.01) 250deg 300deg, rgba(47,67,208,0.06) 300deg 338deg, rgba(47,67,208,0.22) 338deg 354deg, rgba(55,82,228,0.45) 354deg 360deg)',
            animation: 'border-beam 3s linear infinite',
            pointerEvents: 'none',
          }}
          style={{
            opacity: focused && !pensando ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Inner pill */}
        <Box
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
          }}
          sx={{
            bgcolor: 'grey.100',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 1.5,
            position: 'relative',
            zIndex: 1,
            width: '100%',
          }}
        >
          {/* Archivos adjuntos */}
          {archivos.length > 0 && (
            <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {archivos.map((archivo, i) => (
                <FileChip key={i} archivo={archivo} onRemover={() => removerArchivo(i)} />
              ))}
            </Box>
          )}

          {/* Input chips inline */}
          {inputChips.length > 0 && (
            <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
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
          )}

          {/* Área de texto */}
          <InputBase
            value={localTexto}
            onChange={(e) => setLocalTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && tieneTexto) {
                e.preventDefault();
                onEnviar?.(localTexto);
                setLocalTexto('');
              }
            }}
            placeholder="Describe lo que necesitas..."
            multiline
            minRows={2}
            maxRows={5}
            sx={{
              width: '100%',
              fontSize: '0.8125rem',
              color: 'text.primary',
              alignItems: 'flex-start',
              '& textarea': {
                padding: 0,
                resize: 'none',
                '&::placeholder': { color: 'text.secondary', opacity: 1 },
              },
            }}
          />

          {/* Fila inferior */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Izquierda: + y buscar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconButton size="small" onClick={handleAgregarArchivo} sx={{ p: '3px' }}>
                <IconPlus size={16} />
              </IconButton>
              <IconButton size="small" onClick={onVerHistorial} sx={{ p: '3px' }}>
                <IconMessageSearch size={16} />
              </IconButton>
            </Box>

            {/* Derecha: botón enviar / detener */}
            {pensando ? (
              <IconButton
                size="small"
                onClick={onDetener}
                sx={{
                  p: '4px',
                  borderRadius: '20px',
                  flexShrink: 0,
                  transition: 'background-color 0.2s, opacity 0.2s',
                  '&&': { bgcolor: FIGMA_PRIMARY, color: '#fff' },
                  '&&:hover': { bgcolor: FIGMA_PRIMARY, color: '#fff', opacity: 0.85 },
                }}
              >
                <IconSquare size={20} />
              </IconButton>
            ) : (
              <IconButton
                size="small"
                onClick={tieneTexto ? () => { onEnviar?.(localTexto); setLocalTexto(''); } : undefined}
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
            )}
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
