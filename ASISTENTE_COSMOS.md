# Asistente Cosmos — Guía visual y funcional

Este documento describe cómo se ve, cómo funciona y cómo se mueve el Asistente Cosmos. Está escrito para que cualquier persona pueda entenderlo, sin necesidad de conocimientos técnicos.

---

## ¿Qué es el Asistente Cosmos?

Es un asistente flotante que vive en la esquina inferior derecha de la pantalla. Puede abrirse, minimizarse, expandirse y convertirse en un panel lateral. Sirve como punto de acceso a funciones del módulo activo (contabilidad, obligaciones, etc.) y mantiene el historial de conversaciones.

---

## Los cuatro estados principales

### 1. Minimizado (Mini)
El asistente está colapsado y no ocupa espacio visible salvo un pequeño botón flotante. Desde aquí el usuario puede abrirlo y pasar al estado Intermedio.

### 2. Intermedio (Expandido)
Un panel compacto que flota sobre la pantalla. Muestra:
- El campo de escritura con chips de acceso rápido (Actividades pendientes, Reportes, Periodos, Reglas de derivación).
- Un botón "Ver más" para explorar todas las opciones disponibles.
- Íconos de historial, expansión y minimización.

Este es el único estado donde aparece la **notificación de tarea pendiente** (ver sección de notificaciones).

Al escribir y enviar un mensaje, el asistente pasa automáticamente al estado Chat.

### 3. Chat flotante
Ventana flotante que aparece sobre la pantalla. Tiene:
- **Cabecera** con el nombre editable de la conversación, botón de nueva conversación, acceso al historial y botón para cambiar a modo lateral.
- **Área de mensajes** con scroll: los mensajes del usuario aparecen alineados a la derecha en burbujas ligeramente azules; las respuestas del asistente aparecen a la izquierda en texto plano.
- Al hacer hover sobre cualquier mensaje aparecen acciones rápidas (copiar, regenerar, editar).
- Los chips del campo de escritura, en este modo, abren paneles de contexto en lugar de actuar localmente.
- No tiene notificaciones de tareas pendientes.

### 4. Chat lateral
Exactamente igual al chat flotante pero ocupa todo el panel derecho de la pantalla en lugar de flotar. El usuario puede alternar entre flotante y lateral con el mismo botón de la cabecera.

---

## Historial de conversaciones

Disponible desde el ícono de búsqueda en la cabecera de cualquier estado. Abre un cajón lateral que muestra:
- **Buscador** para filtrar conversaciones por nombre.
- **Grupos**: Ancladas, Recientes, Otras conversaciones.
- Cada conversación tiene un punto de color que indica si está activa, y un menú contextual (⋯) que aparece al hacer hover para anclar, compartir o eliminar.
- Las conversaciones ancladas muestran un ícono de marcador en lugar del punto.
- El historial puede estar en modo flotante (panel a la derecha del chat) o anclado (siempre visible al lado del chat lateral).

---

## Los paneles deslizables

Al hacer clic en ciertos chips o botones, aparece un panel adicional que sube desde el input. Todos estos paneles tienen la misma animación de entrada.

### Panel de Actividades pendientes / Reportes / Periodos / Reglas
Un bloque compacto que lista ítems relacionados con esa categoría. Tiene título y botón de cierre. Al hacer clic en un ítem, se cierra el panel y el texto del ítem se copia al campo de escritura con los chips de contexto correspondientes.

### Panel "Ver más"
Panel más grande que muestra categorías de consultas organizadas por módulo. Tiene pestañas por módulo (contabilidad, obligaciones, etc.) y una lista de preguntas frecuentes o acciones. Al hacer clic en cualquier ítem, se cierra y se escribe en el input.

### Panel de Tareas pendientes (completo)
Panel amplio con:
- Chips de módulo en la parte superior (Obligaciones, Contabilidad, Terceros, Impuestos) que filtran la lista.
- Lista de tareas del módulo seleccionado.
- Cada tarea muestra: ícono de alerta (rojo) o advertencia (naranja), nombre de la tarea, badge con cantidad y descripción resumida.
- Al hacer hover, el nombre de la tarea se pone azul.
- Sin sombras: los ítems son planos como los de un menú.

---

## La notificación de tarea pendiente

Aparece **solo en el estado Intermedio**, por encima del campo de escritura. Cicla automáticamente entre 3 tareas pendientes representativas.

**Cómo funciona el ciclo:**
- A los **4 segundos** de abrir el panel Intermedio, aparece la primera notificación.
- Si el usuario la cierra con la X, a los **8 segundos** aparece la siguiente tarea (rotando en orden).
- Si el usuario abre el chat o minimiza, el temporizador se detiene.

**Acciones posibles al ver la notificación:**
- **Clic en el cuerpo de la notificación** → el asistente envía automáticamente el mensaje "Ir a la tarea", pasa al estado Chat y muestra el loader con el texto "Dirigiendo a la tarea".
- **"Ver todo"** → cierra la notificación y abre el Panel de Tareas pendientes completo.
- **X** → cierra la notificación y programa la siguiente.

**Contenido de la notificación:** nombre de la tarea, cantidad de ítems pendientes y una frase de contexto.

---

## El loader de "pensando"

Cuando el asistente está procesando una respuesta, aparece un indicador animado en el área de mensajes:
- Un conjunto de puntos o partículas con una animación de canvas suave.
- Un texto rotativo debajo: "Analizando...", "Consultando información...", etc.
- Si la acción vino de un clic especial (como la notificación de tarea), el texto es fijo: **"Dirigiendo a la tarea"** en lugar del texto rotativo.
- Mientras el loader está activo, la tarjeta del asistente tiene un **borde animado** que gira en degradado azul/violeta (efecto beam), indicando que está pensando.

---

## Animaciones y transiciones

### Entrada y salida del asistente
El widget flota: entra suavemente desde abajo con un ligero movimiento vertical y fade-in. Sale con el mismo movimiento en reversa.

### Paneles deslizables
Todos los paneles (Ver más, Actividades, Tareas pendientes) entran desde abajo con un pequeño salto hacia arriba (`y: 8 → 0`) y opacidad (`0 → 1`). La duración es de 0.22 segundos con una curva suavizada. La salida es el movimiento inverso.

### Notificación de tarea
Entrada muy sutil: apenas 3 píxeles de movimiento vertical con fade-in. Duración de 0.45 segundos, curva `easeOut`. El objetivo es que aparezca de forma natural sin sobresaltar al usuario.

### Hover en ítems
Los ítems de cualquier lista (tareas, actividades, conversaciones) cambian de fondo levemente al hacer hover. El título de una tarea pendiente cambia de color a azul en 0.15 segundos.

### Hover en mensajes
Las acciones (copiar, regenerar) aparecen sobre los mensajes al hacer hover con una transición de opacidad de 0.15 segundos.

### Borde beam (pensando)
Cuando el asistente procesa, aparece un borde giratorio en la tarjeta del input. Es un degradado cónico que rota continuamente, dando la sensación de energía activa. Desaparece cuando termina de pensar.

---

## El Asistente de Obligaciones por pagar

Una variante del asistente diseñada específicamente para el módulo de Obligaciones. Tiene:
- El mismo input con chips de contexto específicos del módulo.
- Un **panel de Saldos y Balances** con chips de filtro como "Empresa", "Comprobante", "Fecha de corte", "Naturaleza" y "Tercero".
- Al hacer clic en el chip **"Fecha de corte"**, se abre un **calendario interactivo** encima del input. El usuario puede navegar entre meses y seleccionar un día. Al seleccionar, el chip se actualiza con la fecha (por ejemplo, "15/06/2026") y el calendario se cierra.
- El resto del comportamiento (paneles, loader, historial) es igual al asistente base.

---

## Diagrama de estados simplificado

```
[Minimizado] ──abrir──→ [Intermedio]
                              │
                   escribir y enviar
                              │
                              ↓
                        [Chat flotante] ←──→ [Chat lateral]
                              │
                     abrir historial
                              ↓
                     [Historial flotante] ←──→ [Historial anclado]
```

Desde cualquier estado de chat se puede volver al Intermedio (botón minimizar) o al Minimizado.

---

## Colores principales

| Elemento | Color |
|---|---|
| Azul primario (chips activos, nombre de chat) | `#2f43d0` |
| Morado del tema (botones, bordes de foco) | `#5323de` |
| Ícono de alerta | Rojo `#d32f2f` |
| Ícono de advertencia | Naranja `#ed6c02` |
| Badge de cantidad | Fondo gris claro `#eaebec`, texto `rgba(16,24,64,0.6)` |
| Burbuja de mensaje usuario | `rgba(47,67,208,0.08)` (azul muy suave) |
| Fondo del panel | `#fbfbfb` |
| Borde del panel | `rgba(47,67,208,0.4)` (azul con transparencia) |
