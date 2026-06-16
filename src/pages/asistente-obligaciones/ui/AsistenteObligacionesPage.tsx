import { Box } from '@mui/material';
import { AsistenteObligacionesWidget } from '@/widgets/asistente-obligaciones';

export function AsistenteObligacionesPage() {
  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <AsistenteObligacionesWidget />
    </Box>
  );
}
