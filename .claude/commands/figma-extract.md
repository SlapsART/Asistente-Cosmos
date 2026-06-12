Extrae la estructura de un archivo Figma y genera un archivo `.md` por cada página/sección encontrada en `definitions/figma-pages/`.

**Argumentos recibidos:** `$ARGUMENTS`
El primer argumento es el token de Figma (`figd_...`). El segundo es la URL del archivo Figma o directamente el fileKey.

---

## Paso 1 — Parsear argumentos

Separa `$ARGUMENTS` por espacio:
- `FIGMA_TOKEN` = primer argumento
- `INPUT` = segundo argumento

Si `INPUT` contiene `figma.com`, extrae el fileKey: es el segmento que sigue a `/design/` (o `/file/`) antes del siguiente `/`. Ejemplo: `figma.com/design/KCZP4y7YrW0tqkFqjVijzl/...` → fileKey = `KCZP4y7YrW0tqkFqjVijzl`.

Si `INPUT` no contiene `figma.com`, úsalo directamente como fileKey.

---

## Paso 2 — Obtener páginas del archivo

```bash
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY?depth=1"
```

Extrae los hijos del `document` (son las páginas del archivo Figma). Para cada página anota su `name` e `id`.

---

## Paso 3 — Explorar el contenido de cada página

Para cada página obtenida:

```bash
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=PAGE_ID&depth=2"
```

Analiza los hijos directos del nodo de página:

- Si los hijos son mayoritariamente de tipo `SECTION`, cada sección es una "página de diseño". Filtra las que tengan nombre `Componentes`, `Components` o similar (ignorarlas).
- Si los hijos son directamente `FRAME`, cada frame es una "página de diseño".
- Si hay mezcla, prioriza las `SECTION` con nombre significativo.

Para cada sección/frame identificado, anota su `name` e `id`.

---

## Paso 4 — Obtener el detalle de cada sección

Para las secciones que quedaron (puedes agrupar hasta 5 IDs en una sola llamada):

```bash
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=ID1,ID2,ID3"
```

Para cada sección, recorre sus hijos directos y clasifícalos:

### Clasificación de nodos hijos

| Tipo de nodo | Clasificación |
|---|---|
| `FRAME` cuyo nombre NO contiene indicios de overlay (`Overlay`, `<Dialog>`, `Drawer`) | **Frame principal** — candidato a página base |
| `INSTANCE` o `FRAME` con nombre que empiece o contenga `<Dialog>` | **Dialog** |
| `INSTANCE` o `FRAME` con nombre que empiece o contenga `<Popover>` | **Popover** |
| `INSTANCE` o `FRAME` con nombre que empiece o contenga `Drawer` o `<Drawer>` | **Drawer** |
| `INSTANCE` o `FRAME` con nombre que empiece o contenga `<Menu>` | **Menu contextual** |
| `INSTANCE` o `FRAME` con nombre que empiece o contenga `<Snackbar>` | **Snackbar / notificación** |
| `FRAME` que contiene hijos del tipo Dialog/Drawer/Popover dentro | **Pantalla de contexto** (frame completo con overlay abierto) |
| `SECTION` dentro de la sección principal cuyo nombre contenga `Componente` | Ignorar |
| `VECTOR`, `TEXT`, `RECTANGLE`, `ELLIPSE`, `GROUP` sueltos | Ignorar |

Cuando un `FRAME` contiene un `Drawer`, `<Dialog>` o `<Popover>` como hijo directo, ese frame es una **pantalla de contexto** y sus hijos son **elementos complementarios**.

Para leer el nombre/propósito de los drawers/dialogs (distinguir "nuevo" vs "editar"), inspecciona el texto del `DrawerHeader` o el primer `TEXT` hijo del componente con una llamada adicional al nodo si es necesario.

---

## Paso 5 — Generar los archivos `.md`

Crea el directorio si no existe:
```bash
mkdir -p definitions/figma-pages
```

Por cada sección/página detectada, genera un archivo `.md` en `definitions/figma-pages/` con el nombre derivado del nombre de la sección: minúsculas, espacios reemplazados por guiones, sin caracteres especiales ni emojis. Ejemplo: `Catálogo Tributario` → `catalogo-tributario.md`, `Perfil tributario` → `perfil-tributario.md`.

**Sobreescribe el archivo si ya existe.**

### Formato del archivo `.md`

```markdown
# {Nombre de la sección}

**Sección Figma:** `{Nombre}` (node `{ID de la sección}`)

---

## Página principal

| Estado | Link |
|--------|------|
| Vista base — {descripción breve} | {URL} |

---

## Vistas alternativas / estados  ← omitir si no hay

| Estado | Link |
|--------|------|
| {descripción} | {URL} |

---

## Elementos complementarios  ← omitir si no hay

### Dialogs  ← una subsección por tipo de elemento

| Descripción | Link |
|-------------|------|
| {descripción del dialog} | {URL} |

### Drawers — {Nuevo / Editar / etc.}

| Descripción | Link |
|-------------|------|
| {descripción} | {URL} |

### Popovers

| Descripción | Link |
|-------------|------|
| {descripción} | {URL} |

### Menus contextuales

| Descripción | Link |
|-------------|------|
| {descripción} | {URL} |

---

## Pantallas de contexto (frames completos con overlay abierto)  ← omitir si no hay

| Estado | Link |
|--------|------|
| {descripción} | {URL} |
```

### Formato de los links

```
https://www.figma.com/design/{fileKey}/{nombre-del-archivo}?node-id={NODE-ID}&t=ueeHONt3V6GFTCCt-4
```

- `{nombre-del-archivo}`: tómalo del campo `name` de la respuesta de `/v1/files/:fileKey` (en formato slug URL-encoded si es necesario, aunque puedes omitirlo — Figma lo resuelve igual con solo el `node-id`)
- `{NODE-ID}`: el `id` del nodo con `:` reemplazado por `-`. Ejemplo: `149:66070` → `149-66070`
- El parámetro `t=` puede omitirse si no se tiene; los links funcionan igual

---

## Paso 6 — Confirmar resultado

Al terminar, lista los archivos generados:
```bash
ls definitions/figma-pages/
```

Informa al usuario cuántos archivos se generaron y cuáles secciones se encontraron.
