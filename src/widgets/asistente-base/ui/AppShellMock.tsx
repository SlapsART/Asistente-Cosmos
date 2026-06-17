import { Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import {
  IconBolt,
  IconChevronRight,
  IconLayoutSidebar,
  IconList,
  IconRefresh,
  IconSettings,
  IconTable,
  IconLayoutAlignBottom,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDemoContext } from '@/shared/ui/DemoContext';
import type { VistaDemo } from '@/shared/ui/DemoContext';
import { drawerVariants } from '@/shared/ui/anim';

interface AppShellMockProps {
  children?: React.ReactNode;
  rightPanel?: React.ReactNode;
  /** Ancho del panel lateral — necesario para animar la entrada sin jump */
  rightPanelWidth?: number;
  overlay?: React.ReactNode;
  /** Centra el overlay vertical y horizontalmente en lugar de anclarlo al bottom */
  overlayCentered?: boolean;
  /** Overlay absoluto en el lado derecho — no empuja el contenido (historial) */
  drawerOverlay?: React.ReactNode;
  drawerOverlayWidth?: number;
  /** Callback para cerrar el drawer al hacer clic fuera */
  onCloseDrawer?: () => void;
}

const SIDEBAR_NAV: { vista: VistaDemo; Icon: React.ElementType; label: string }[] = [
  { vista: 'base', Icon: IconList, label: 'Asistente Base' },
  { vista: 'obligaciones', Icon: IconTable, label: 'Asistente Obligaciones' },
  { vista: 'contabilidad', Icon: IconBolt, label: 'Asistente Contabilidad' },
  { vista: 'vertical', Icon: IconLayoutAlignBottom, label: 'Asistente Vertical' },
];

const PAGE_TITLE: Record<VistaDemo, string> = {
  base: 'Asistente Base',
  obligaciones: 'Asistente Obligaciones por Pagar',
  contabilidad: 'Asistente Contabilidad',
  vertical: 'Asistente Vertical',
};

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const EASE_IN: [number, number, number, number] = [0.55, 0.06, 0.68, 0.19];

export function AppShellMock({
  children,
  rightPanel,
  rightPanelWidth = 336,
  overlay,
  overlayCentered = false,
  drawerOverlay,
  drawerOverlayWidth = 380,
  onCloseDrawer,
}: AppShellMockProps) {
  const { vista, setVista } = useDemoContext();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f5f6f7', position: 'relative' }}>
      {/* Navbar */}
      <Box
        sx={{
          height: 40,
          bgcolor: '#fff',
          borderBottom: '1px solid rgba(16,24,64,0.08)',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
          <IconLayoutSidebar size={18} color="rgba(16,24,64,0.38)" style={{ flexShrink: 0 }} />
          <Divider orientation="vertical" flexItem sx={{ height: 14, alignSelf: 'center', mx: 0.5 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
            Inicio
          </Typography>
          <IconChevronRight size={14} color="rgba(16,24,64,0.38)" />
          <Typography variant="body2" sx={{ color: '#2f43d0', fontWeight: 500, fontSize: '0.8125rem' }}>
            Reglas de derivación
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
            Empresa de insumos S.A.S
          </Typography>
          <IconButton size="small" sx={{ p: '3px' }}>
            <IconRefresh size={15} color="rgba(16,24,64,0.38)" />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 14, alignSelf: 'center' }} />
          <IconButton size="small" sx={{ p: '3px' }}>
            <IconSettings size={15} color="rgba(16,24,64,0.38)" />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 14, alignSelf: 'center' }} />
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: '#2f43d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.6rem' }}>HD</Typography>
          </Box>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left sidebar */}
        <Box
          sx={{
            width: 48,
            bgcolor: '#fff',
            borderRight: '1px solid rgba(16,24,64,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 1.5,
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          {SIDEBAR_NAV.map(({ vista: v, Icon, label }) => (
            <Tooltip key={v} title={label} placement="right" arrow>
              <IconButton
                size="small"
                onClick={() => setVista(v)}
                sx={{
                  p: '6px',
                  borderRadius: '6px',
                  transition: 'background-color 0.15s, color 0.15s',
                  color: vista === v ? '#2f43d0' : 'rgba(16,24,64,0.35)',
                  bgcolor: vista === v ? 'rgba(47,67,208,0.08)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(47,67,208,0.06)', color: '#2f43d0' },
                }}
              >
                <Icon size={18} />
              </IconButton>
            </Tooltip>
          ))}
        </Box>

        {/* Main content column — título arriba, luego fila contenido+panel */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            px: 2,
            pt: 1,
            pb: 2,
            gap: 1,
          }}
        >
          {/* Título de página — abarca todo el ancho (contenido + panel lateral) */}
          <Box sx={{ flexShrink: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {PAGE_TITLE[vista]}
            </Typography>
          </Box>

          {/* Fila principal: área de contenido + panel derecho */}
          <Box sx={{ flex: 1, display: 'flex', gap: 2, overflow: 'hidden', position: 'relative' }}>
            {/* Área de contenido de la página */}
            <Box
              sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
            >
              <Box
                sx={{
                  height: 28,
                  bgcolor: 'rgba(47,67,208,0.05)',
                  borderRadius: '4px 4px 0 0',
                  flexShrink: 0,
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  bgcolor: '#fff',
                  borderRadius: '0 0 4px 4px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {children}
              </Box>

              {/* Overlay flotante (mini input / panel expandido / chat) */}
              <Box
                sx={{
                  position: 'absolute',
                  ...(overlayCentered
                    ? { top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center' }
                    : { bottom: 12, left: 0, right: 0, alignItems: 'flex-end' }),
                  zIndex: 10,
                  pointerEvents: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  '& > *': { pointerEvents: 'auto' },
                }}
              >
                <AnimatePresence mode="wait">
                  {overlay}
                </AnimatePresence>
              </Box>
            </Box>

            {/* Panel derecho — card con borde y radio (Figma: w:336px, border, rounded-8px) */}
            <AnimatePresence>
              {rightPanel && (
                <motion.div
                  key="right-panel"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: rightPanelWidth,
                    opacity: 1,
                    transition: {
                      width: { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 },
                      opacity: { duration: 0.18, ease: EASE },
                    },
                  }}
                  exit={{
                    width: 0,
                    opacity: 0,
                    transition: { duration: 0.22, ease: EASE_IN },
                  }}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(47,67,208,0.12)',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                  }}
                >
                  {rightPanel}
                </motion.div>
              )}
            </AnimatePresence>

          </Box>
        </Box>

        {/* Drawer overlay — pegado al lado derecho del body, de arriba a abajo */}
        <AnimatePresence>
          {drawerOverlay && (
            <>
              {/* Invisible backdrop to close drawer */}
              <motion.div
                key="drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onCloseDrawer}
                style={{
                  position: 'absolute',
                  right: drawerOverlayWidth,
                  top: 0,
                  bottom: 0,
                  left: 0,
                  zIndex: 19,
                  backgroundColor: 'transparent',
                }}
              />
              <motion.div
                key="drawer"
                variants={drawerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: drawerOverlayWidth,
                  zIndex: 20,
                  backgroundColor: '#fff',
                  boxShadow: '-4px 0 24px rgba(16,24,64,0.12)',
                }}
              >
                {drawerOverlay}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
