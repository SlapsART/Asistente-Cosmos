Argumentos recibidos: $ARGUMENTS

El primer argumento es la ruta al archivo `definitions/figma-pages/*.md` con los links de referencia del diseño.
Si hay texto adicional después de la ruta del archivo, son **instrucciones específicas de corrección** a priorizar.

Ejemplo de invocación:
- `/revisar-implementacion definitions/figma-pages/tributo.md` → revisión general completa
- `/revisar-implementacion definitions/figma-pages/tributo.md El icono de naturaleza no alinea correctamente y el chip de estado Inactivo tiene el color equivocado` → correcciones puntuales priorizadas

---

## Proceso de revisión

### Paso 1 — Leer el archivo de referencia y el workflow
1. Lee linea por linea archivo figma-pages referenciado para identificar todos los diseños implementados.
2. Lee `definitions/figma-to-code-workflow.md`, especialmente las **"Lecciones Aprendidas"**.

### Paso 2 — Identificar correcciones prioritarias
Si hay instrucciones puntuales en los argumentos, listarlas y abordarlas primero. Si no hay instrucciones específicas, hacer una revisión completa.

### Paso 3 — Revisión visual por elemento

Para la **Página principal** y cada **Elemento complementario** implementado:

1. **Capturar ambas fuentes en paralelo:**
   ```
   # Figma
   get_screenshot → [URL del diseño]

   # Implementación (si Playwright MCP está disponible)
   browser_navigate → localhost:3001/[ruta]
   browser_take_screenshot
   ```

2. **Comparar** verificando:
   - Layout: posiciones, distribuciones, alineación
   - Colores: fondos, textos, bordes, iconos
   - Tipografía: tamaño, peso, family, line-height
   - Spacing: márgenes, paddings, gaps
   - Componentes: bordes, sombras, border-radius, estados visuales

3. **Verificación programática** para diferencias sutiles:
   ```javascript
   // Ejemplo con browser_evaluate
   const el = document.querySelector('.MuiDataGrid-columnHeaders');
   return { bg: getComputedStyle(el).backgroundColor, height: el.getBoundingClientRect().height };
   ```

### Paso 4 — Aplicar correcciones

Para cada diferencia detectada, corregir siguiendo:

> Utiliza @definitions/figma-to-code-workflow.md
> Desarrollalo con /Feature-sliced-Design

Prioridad de correcciones:
1. Correcciones puntuales indicadas en los argumentos
2. Diferencias de color o tokens del tema
3. Diferencias de layout y spacing
4. Diferencias de tipografía

### Paso 5 — Verificar y limpiar
```bash
bun run build
```
Si compila sin errores, eliminar todos los archivos temporales del Playwright MCP:
```bash
rm -f .playwright-mcp/*.png .playwright-mcp/*.jpeg .playwright-mcp/*.yml .playwright-mcp/*.log
```

---

## Reglas de corrección

- Si una diferencia es un **token del tema** (color, tipografía, spacing): actualizar `src/app/styles/cosmosTheme.ts` con el valor del Figma Handoff, no adaptar el código al theme viejo.
- Si la diferencia es un **error de implementación**: corregir el código y re-verificar con Playwright.
- Si la diferencia es **intencional**: documentar la justificación como comentario.
- El Figma Handoff siempre tiene prioridad sobre los valores actuales del theme.
