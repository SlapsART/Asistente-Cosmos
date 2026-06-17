import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type VistaDemo = 'contabilidad' | 'base' | 'obligaciones' | 'vertical';

interface DemoContextValue {
  vista: VistaDemo;
  setVista: (v: VistaDemo) => void;
}

const DemoContext = createContext<DemoContextValue>({
  vista: 'contabilidad',
  setVista: () => {},
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [vista, setVista] = useState<VistaDemo>('contabilidad');
  return (
    <DemoContext.Provider value={{ vista, setVista }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  return useContext(DemoContext);
}
