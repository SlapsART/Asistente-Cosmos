import { Box } from '@mui/material';
import { AsistentePanel } from '@/widgets/asistente-panel';

export function AsistenteContabilidadPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pb: 4,
      }}
    >
      <AsistentePanel />
    </Box>
  );
}
