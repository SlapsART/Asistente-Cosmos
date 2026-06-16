import { Box } from '@mui/material';
import { AsistenteContabilidadWidget } from '@/widgets/asistente-contabilidad';

export function AsistenteContabilidadPage() {
  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <AsistenteContabilidadWidget />
    </Box>
  );
}
