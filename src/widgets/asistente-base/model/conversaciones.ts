export interface Mensaje {
  id: number;
  autor: 'usuario' | 'agente';
  texto: string;
  hora?: string;
  esContextoNuevo?: boolean;
}

export interface ConversacionData {
  id: number;
  nombre: string;
  tiempo: string;
  grupo: 'anclada' | 'reciente' | 'otra';
  mensajes: Mensaje[];
}

let _id = 200;
const nm = (autor: 'usuario' | 'agente', texto: string, extras?: Partial<Mensaje>): Mensaje => ({
  id: _id++,
  autor,
  texto,
  ...extras,
});

export const CONVERSACIONES_DEMO: ConversacionData[] = [
  {
    id: 0,
    nombre: 'Generación OXP Mayo',
    tiempo: 'hace 2 semanas',
    grupo: 'anclada',
    mensajes: [
      nm('usuario', 'Genera las obligaciones por pagar de mayo', { hora: '11:00' }),
      nm('agente', 'Procesando la generación de OXP para mayo... Se encontraron 47 obligaciones por un total de $234.500.000.\n\n¿Confirmas la generación?'),
      nm('usuario', 'Confirmar', { hora: '11:02' }),
      nm('agente', 'Las 47 obligaciones por pagar de mayo han sido generadas exitosamente. Puedes consultarlas en el módulo de Obligaciones por Pagar.'),
    ],
  },
  {
    id: 1,
    nombre: 'Actividades pendientes Q2',
    tiempo: 'ahora',
    grupo: 'reciente',
    mensajes: [
      nm('usuario', '¿Cuáles son las actividades pendientes para este período?', { hora: '10:24' }),
      nm('agente', 'Encontré 3 actividades pendientes para el período actual:\n\n1. Borradores de asiento pendientes por revisar — 20 registros\n2. Borradores que fueron devueltos — 5 registros\n3. Borradores sin cuentas contables resueltas — 10 registros\n\n¿Deseas revisar alguno de estos en detalle?'),
      nm('usuario', '¿Puedes mostrarme los borradores devueltos?', { hora: '10:25', esContextoNuevo: true }),
      nm('agente', 'Aquí están los 5 borradores que fueron devueltos:\n\n• BRD-00856 | Construcciones Almo S.A. — $4.000.000\n• BRD-093975 | Sura — $3.500.000\n• BRD-028383 | Éxito — $2.750.000\n• BRD-00223 | Bancolombia — $5.200.000\n• BRD-00112 | EPM — $1.800.000\n\nTotal devuelto: $17.250.000'),
    ],
  },
  {
    id: 2,
    nombre: 'Reportes de gestión mayo',
    tiempo: 'ayer',
    grupo: 'reciente',
    mensajes: [
      nm('usuario', 'Genera el reporte de gestión de mayo', { hora: '09:15' }),
      nm('agente', 'El reporte de gestión de mayo está listo:\n\n• Ingresos totales: $125.340.000\n• Egresos totales: $98.210.000\n• Utilidad neta: $27.130.000\n• Margen neto: 21.6%\n\n¿Deseas enviarlo al área contable?'),
      nm('usuario', 'Sí, envíalo al área contable', { hora: '09:18' }),
      nm('agente', 'El reporte ha sido enviado a contabilidad@empresa.com.co incluyendo los anexos de cuentas por cobrar y por pagar.'),
    ],
  },
  {
    id: 3,
    nombre: 'Períodos contables 2025',
    tiempo: 'hace 2 semanas',
    grupo: 'reciente',
    mensajes: [
      nm('usuario', '¿Qué períodos contables están abiertos?', { hora: '14:30' }),
      nm('agente', 'Actualmente hay 1 período contable abierto:\n\n• Mayo 2025 (01/05/2025 – 31/05/2025)\n\nLos períodos enero, febrero, marzo y abril ya están cerrados. ¿Deseas cerrar mayo o abrir junio?'),
    ],
  },
  {
    id: 4,
    nombre: 'Reglas de derivación activas',
    tiempo: 'hace 3 semanas',
    grupo: 'reciente',
    mensajes: [
      nm('usuario', 'Muéstrame las reglas de derivación activas', { hora: '16:00' }),
      nm('agente', 'Hay 12 reglas de derivación activas:\n\n1. Ingresos operacionales → Cuenta 41\n2. Gastos de personal → Cuenta 51\n3. Proveedores nacionales → Cuenta 22\n4. Proveedores del exterior → Cuenta 221\n\n¿Deseas ver el detalle de alguna regla?'),
    ],
  },
  { id: 5, nombre: 'Generación OXP Abril', tiempo: 'hace 4 semanas', grupo: 'reciente', mensajes: [] },
  { id: 6, nombre: 'Plan de cuentas', tiempo: 'hace 5 semanas', grupo: 'otra', mensajes: [] },
  { id: 7, nombre: 'Conciliación bancaria', tiempo: 'hace 5 semanas', grupo: 'otra', mensajes: [] },
  { id: 8, nombre: 'Nómina mayo', tiempo: 'hace 5 semanas', grupo: 'otra', mensajes: [] },
  { id: 9, nombre: 'IVA bimestral', tiempo: 'hace 5 semanas', grupo: 'otra', mensajes: [] },
  { id: 10, nombre: 'Retención en la fuente', tiempo: 'hace 5 semanas', grupo: 'otra', mensajes: [] },
];

const RESPUESTAS = [
  'Entendido. He procesado tu solicitud y actualizado los registros correspondientes en el sistema.\n\n¿Hay algo más en lo que pueda ayudarte?',
  'He analizado la información disponible. Los registros del período actual están en orden y no presentan inconsistencias.\n\n¿Deseas que genere un reporte detallado?',
  'La operación ha sido registrada correctamente. Puedes verificar el resultado en el módulo correspondiente.\n\nSi necesitas realizar ajustes, dímelo y lo gestiono de inmediato.',
  'Revisé los datos del sistema. Todo parece estar dentro de los parámetros normales para este período contable.\n\n¿Necesitas que profundice en algún aspecto en particular?',
];

let _respIdx = 0;

export function generarRespuesta(_texto: string): string {
  const resp = RESPUESTAS[_respIdx % RESPUESTAS.length];
  _respIdx++;
  return resp;
}
