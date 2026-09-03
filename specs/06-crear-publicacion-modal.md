# SPEC 06 — Modal de crear publicación

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-03
> **Objetivo:** Al presionar "Nueva publicación" en el sidebar, abrir un modal superpuesto que replica el formulario de `references/pantallas/crear-publicacion.dc.html`, con selector de audiencia (niños + "Toda la sala"), tipo de publicación, descripción y fotos, validación básica y botón "Publicar" muerto.

## Scope

**In:**

- En `components/sidebar.tsx`, reemplazar el enlace `<a href="#">…Nueva publicación…</a>` por un botón que abra un modal superpuesto sobre el feed.
- Nuevo componente cliente `components/create-post-modal.tsx` que encapsula el disparador y el modal.
- Recrear el formulario del modal siguiendo `references/pantallas/crear-publicacion.dc.html`: header ("Cancelar" a la izquierda, "Nueva publicación" centrado, "Publicar" a la derecha), sección PARA (pills por cada niño de `lib/ninos-data.ts` + "Toda la sala"), sección TIPO (pills: Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio), sección DESCRIPCIÓN (textarea), sección FOTOS (grid con placeholder existente + botón "Agregar").
- Fondo superpuesto semitransparente (tinte oscuro) sobre el feed.
- Toggles funcionales PARA e TIPO con estado visual activo/inactivo al hacer click.
- Validación de bloqueo: "Publicar" deshabilitado si faltan tipo, niño seleccionado o descripción.
- "Cancelar" y "Publicar" cierran el modal.
- "Publicar" es un botón muerto (`href="#"`), no agrega la publicación al feed.

**Out of scope (para specs futuras):**

- Persistir / crear realmente la publicación (base de datos, backend).
- Agregar la publicación al array `posts` de `lib/feed-data.ts`.
- Subida real de fotos (cámara, galería, drag & drop).
- Selección múltiple de niños (por ahora solo uno a la vez o "Toda la sala").
- Preview de fotos antes de publicar.
- Adaptación responsive/móvil.
- Accesibilidad completa del modal.

## Data model

No se introducen estructuras de datos nuevas. El formulario es puramente visual; los valores capturados no se persisten. Reutiliza la paleta de tokens de `globals.css` y la paleta del template.

Estado local del componente cliente (`components/create-post-modal.tsx`), con `useState`:

```ts
type PostFormState = {
  selectedKids: string[];   // ids de niños seleccionados, vacío = "Toda la sala"
  type: PostType | null;    // tipo seleccionado
  description: string;      // contenido del textarea
};
```

Tipos reutilizados de `lib/feed-data.ts` (`PostType`) y `lib/ninos-data.ts` (`kids`, `Kid`).

## Implementation plan

1. **`components/create-post-modal.tsx` (componente cliente).** Con "use client". Contiene el estado del formulario (`useState`), el estado `open: boolean`, el overlay semitransparente y el modal con los campos y el header. Recibe `trigger` como prop (el botón que abre el modal, para encapsular disparador + modal).
2. **Sección PARA.** Mapear `kids` de `lib/ninos-data.ts` a pills con avatar (letter, bg, color) y nombre. "Toda la sala" como último pill. Selección: click en un niño lo selecciona/deselecciona; click en "Toda la sala" selecciona todos y deselecciona individuos (y viceversa). Estado visual: pill activo con fondo `#3F362E` / texto blanco / borde `#3F362E`; inactivo con fondo `#FFFDF9` / borde `#ECE0D0` / texto `#6E6359`.
3. **Sección TIPO.** 7 pills por tipo con colores del template: Comida (`#9A7B1E`), Siesta (`#E7DCF6`/`#7B5FC0`), Actividad (`#2E89A6`), Logro (`#CFEBD8`/`#3E9B6C`), Ánimo (`#F9D2DE`/`#C56486`), Foto (`#FBD8CC`/`#D9684A`), Anuncio (`#CCD8F4`/`#4E72C8`). Selección: solo uno a la vez (radio behavior). Click en el seleccionado lo deselecciona.
4. **Sección DESCRIPCIÓN.** Textarea con placeholder "Contá cómo le fue hoy…", min-height 120px, fondo `#fff`, borde `#EADFD0`.
5. **Sección FOTOS.** Grid flex con gap 12px: un div cuadrado 96×96 con borde sólido `#ECE0D0` y fondo `#F4ECE1` (foto placeholder existente con ícono de imagen), y un div cuadrado 96×96 con borde dashed `#DBCDBA` y fondo `#F4ECE1` (botón "Agregar" con ícono + de color `#C5503A`). Ambos son solo visuales.
6. **Validación.** `const canPublish = type !== null && selectedKids.length > 0 && description.trim() !== ""`. "Publicar" se renderiza con `disabled={!canPublish}` (estilo apagado) y `href="#"`.
7. **`components/sidebar.tsx`.** Importar `<CreatePostModal />`. Reemplazar el `<a href="#">…Nueva publicación…</a>` por el componente modal, pasándole el botón disparador con el mismo estilo coral gradient actual.
8. **Estilos del overlay y modal.** Overlay fijo con fondo `rgba(63,54,46,.4)`; tarjeta centrada max-w 580 con fondo `#FBF4EC`, borde `#ECE0D0`, `rounded-24` y `box-shadow: 0 20px 50px -24px rgba(63,54,46,.35)`, replicando la estética del template.
9. **Verificación.** `npm run build` y `npx tsc --noEmit`. Visual con Playwright: capturar `/` abriendo el modal y comparar contra `references/pantallas/crear-publicacion.dc.html` (guardar captura en `.playwright-mcp/`).

## Acceptance criteria

- [x] `npm run build` termina sin errores y `npx tsc --noEmit` no reporta errores.
- [x] En `/`, al pulsar "Nueva publicación" en el sidebar se abre un modal superpuesto (overlay oscuro) sobre el feed, sin cambiar de ruta.
- [x] El modal replica el formulario de `crear-publicacion.dc.html`: header con "Cancelar" / "Nueva publicación" / "Publicar", sección PARA con pills por niño + "Toda la sala", sección TIPO con 7 pills de categoría, sección DESCRIPCIÓN (textarea), sección FOTOS (foto placeholder + botón "Agregar").
- [x] Los pills de PARA muestran el avatar (letter + color de fondo) y nombre de cada niño de `lib/ninos-data.ts`.
- [x] Click en un pill de PARA selecciona/deselecciona el niño con estado visual (fondo oscuro/texto blanco cuando activo, fondo claro/borde cuando inactivo).
- [x] Click en "Toda la sala" selecciona todos los niños; click en un niño individual deselecciona "Toda la sala".
- [x] Los pills de TIPO muestran los colores del template y funcionan como radio (solo uno seleccionado a la vez).
- [x] Click en el tipo ya seleccionado lo deselecciona.
- [x] "Publicar" está deshabilitado si faltan tipo, niño seleccionado o descripción.
- [x] Al completar tipo, niño y descripción, "Publicar" se habilita y apunta a `#` (botón muerto, no agrega la publicación).
- [x] "Cancelar" cierra el modal y el feed permanece sin cambios.
- [x] No hay errores en consola al abrir/cerrar el modal.
- [x] La página `/` sigue viéndose idéntica a la de SPEC 01 con el modal cerrado.

## Decisions

- **Sí:** Modal superpuesto sobre el feed (no una ruta separada), coherente con SPEC 04/05.
- **Sí:** `components/create-post-modal.tsx` como componente cliente que encapsula disparador + modal, manteniendo `components/sidebar.tsx` como server component (el botón trigger se pasa como prop).
- **Sí:** "Publicar" como botón muerto `#` (visual only), coherente con SPEC 02/04/05.
- **Sí:** Selección de PARA con toggles funcionales (click selecciona/deselecciona), "Toda la sala" como opción especial.
- **Sí:** Selección de TIPO con radio behavior (solo uno a la vez), con deselección al click en el ya seleccionado.
- **Sí:** Validación de bloqueo: Publicar deshabilitado si falta tipo, niño o descripción.
- **Sí:** Niños reutilizados de `lib/ninos-data.ts` (8 kids) con sus avatares existentes.
- **No:** Selección múltiple de niños (solo uno o "Toda la sala"), subida real de fotos, persistencia, responsive, accesibilidad completa. Specs futuras.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| Pérdida de fidelidad visual al traducir el template a un modal | Comparación con el template `.dc.html` vía Playwright en `.playwright-mcp/`; ajustar valores hasta el match. |
| El template es una página, no un modal: no hay plantilla de fondo/overlay | Seguir la estética de tokens existente (`--color-*`, tarjeta `#FBF4EC`, borde `#ECE0D0`) para overlay y tarjeta. |
| El botón "Nueva publicación" del sidebar es un `<a href="#">` estático | Reemplazar por componente con `onClick` que setea `open=true`, manteniendo el mismo estilo visual. |

## What is **not** in this spec

- Persistir ni crear realmente la publicación.
- Agregar la publicación al feed.
- Subida real de fotos.
- Selección múltiple de niños.
- Preview de fotos.
- Responsive/móvil.
- Accesibilidad completa del modal.

Cada una de esas, si llega, va en su propia spec.
