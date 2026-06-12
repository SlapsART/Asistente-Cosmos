import { Routes, Route } from 'react-router-dom';
import { AsistenteContabilidadPage } from '@/pages/asistente';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AsistenteContabilidadPage />} />
    </Routes>
  );
}
