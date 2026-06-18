import { Box, Tab, Tabs, Typography } from '@mui/material';

export type VistaDemo = 'contabilidad' | 'base' | 'obligaciones' | 'vertical' | 'tareas';

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
      <Typography
        variant="caption"
        sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: 1, fontSize: '0.65rem', whiteSpace: 'nowrap' }}
      >
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
        <Tab value="contabilidad" label="Asistente Contabilidad" />
        <Tab value="base" label="Asistente Base" />
        <Tab value="obligaciones" label="Asistente Obligaciones" />
        <Tab value="tareas" label="Tareas" />
      </Tabs>
    </Box>
  );
}
