import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { DemoProvider, useDemoContext } from '@/shared/ui/DemoContext';
import { pageVariants } from '@/shared/ui/anim';
import { AsistenteContabilidadPage } from '@/pages/asistente';
import { AsistenteBasePage } from '@/pages/asistente-base';
import { AsistenteObligacionesPage } from '@/pages/asistente-obligaciones';
import { AsistenteVerticalPage } from '@/pages/asistente-vertical';
import { AsistenteTareasPage } from '@/pages/asistente-tareas';

function AppViews() {
  const { vista } = useDemoContext();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={vista}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ height: '100%' }}
      >
        {vista === 'contabilidad' && <AsistenteContabilidadPage />}
        {vista === 'base' && <AsistenteBasePage />}
        {vista === 'obligaciones' && <AsistenteObligacionesPage />}
        {vista === 'vertical' && <AsistenteVerticalPage />}
        {vista === 'tareas' && <AsistenteTareasPage />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <Box sx={{ height: '100vh' }}>
        <AppViews />
      </Box>
    </DemoProvider>
  );
}
