export interface Tarea {
  id: number;
  titulo: string;
  conteo: number;
  descripcion: string;
}

export const TAREAS_DEMO: Tarea[] = [
  {
    id: 1,
    titulo: 'Revisar extractos devueltos',
    conteo: 3,
    descripcion: 'El más antiguo lleva 3 días sin corregir',
  },
  {
    id: 2,
    titulo: 'Liquidar nómina mayo',
    conteo: 1,
    descripcion: 'Vence en 2 días',
  },
  {
    id: 3,
    titulo: 'Aprobar órdenes de compra',
    conteo: 5,
    descripcion: '2 requieren aprobación urgente',
  },
  {
    id: 4,
    titulo: 'Reconciliar cuentas bancarias',
    conteo: 2,
    descripcion: 'Pendiente del período anterior',
  },
];
