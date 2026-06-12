import { Box, Tab, Tabs, Typography } from '@mui/material';

export type VistaDemo =
  | 'cosmos'
  | 'base-minimizado'
  | 'base-expandido'
  | 'base-activo'
  | 'base-chat'
  | 'base-nueva'
  | 'base-lateral'
  | 'base-historial';

const TABS: { value: VistaDemo; label: string; grupo: string }[] = [
  { value: 'cosmos', label: 'Asistente Cosmos', grupo: 'A' },
  { value: 'base-minimizado', label: 'Inicial', grupo: 'B' },
  { value: 'base-expandido', label: 'Hover', grupo: 'B' },
  { value: 'base-activo', label: 'Activo', grupo: 'B' },
  { value: 'base-chat', label: 'Chat', grupo: 'B' },
  { value: 'base-nueva', label: 'Nueva conv.', grupo: 'B' },
  { value: 'base-lateral', label: 'Lateral', grupo: 'B' },
  { value: 'base-historial', label: 'Historial', grupo: 'B' },
];

interface DemoNavProps {
  vista: VistaDemo;
  onVista: (v: VistaDemo) => void;
}

export function DemoNav({ vista, onVista }: DemoNavProps) {
  return (
    <Box
      sx={{
        bgcolor: '#0f0f14',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 2,
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: 1, fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
        DEMOS
      </Typography>

      <Box sx={{ width: '1px', height: 20, bgcolor: 'rgba(255,255,255,0.1)' }} />

      <Tabs
        value={vista}
        onChange={(_, v) => onVista(v as VistaDemo)}
        sx={{
          minHeight: 40,
          '& .MuiTab-root': {
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.7rem',
            minHeight: 40,
            py: 0,
            px: 1.5,
            textTransform: 'none',
            fontWeight: 400,
          },
          '& .Mui-selected': { color: '#fff', fontWeight: 600 },
          '& .MuiTabs-indicator': { bgcolor: '#2f43d0', height: 2 },
        }}
      >
        {TABS.map((t, i) => {
          const showDivider = i > 0 && TABS[i - 1].grupo !== t.grupo;
          return (
            <Tab
              key={t.value}
              value={t.value}
              label={t.label}
              sx={showDivider ? { borderLeft: '1px solid rgba(255,255,255,0.1)', ml: 1 } : {}}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
