Lee el archivo: $ARGUMENTS

El archivo tiene secciones. Sigue este orden para implementar:

## 1. Lee el workflow antes de empezar
Lee linea por linea `definitions/figma-to-code-workflow.md` completo, especialmente "Lecciones Aprendidas". Aplica cada lección relevante durante toda la implementación.

## 2. Implementa en este orden según las secciones del archivo

### Sección "Página principal"
Implementa con exactamente esta instrucción por cada link:

> Utiliza @definitions\figma-to-code-workflow.md de este link de figma [URL]
> Desarrollalo con /Feature-sliced-Design

### Sección "Vistas del flujo principal" / "Pantallas de estado" (si existe)
Son variantes o estados de la misma página. Úsalas como contexto adicional con `get_screenshot` y `get_design_context` para entender el flujo completo. Si representan un componente o estado distinto que aún no fue implementado, implementa con la misma instrucción.

### Sección "Elementos complementarios"
Cada sub-sección es un grupo (ej: "Drawers — Nuevo", "Dialogs", "Popovers"). Si un grupo tiene varios links, son **variantes del mismo componente**: analiza todos con `get_screenshot` para entender los estados completos, luego implementa el componente una sola vez usando la misma instrucción con el link más representativo del grupo.

> Utiliza @definitions\figma-to-code-workflow.md de este link de figma [URL principal del grupo]
> Desarrollalo con /Feature-sliced-Design

### Sección "Pantallas de contexto"
Son frames completos que muestran la página con un overlay ya abierto. Úsalos solo como referencia visual si necesitas entender el layout. **No implementes nada de esta sección por separado.**

## 3. Verifica después de cada implementación
```bash
bun run build
```
Corrige cualquier error TypeScript antes de continuar con el siguiente elemento.

## 4. Al terminar todo
Elimina todos los archivos temporales del Playwright MCP:
```bash
rm -f .playwright-mcp/*.png .playwright-mcp/*.jpeg .playwright-mcp/*.yml .playwright-mcp/*.log
```
