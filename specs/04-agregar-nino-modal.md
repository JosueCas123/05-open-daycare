# SPEC 04 — Modal de agregar niño

> **Estado:** Implementado
> **Depende de:** SPEC 02
> **Fecha:** 2026-09-03
> **Objetivo:** Al presionar el botón "Agregar niño" en `/kids`, abrir un modal superpuesto que replica el formulario de `references/pantallas/agregar-nino.dc.html`, con los campos nombre, fecha de nacimiento y sala como obligatorios (validación que bloquea Guardar) y alergias y notas médicas opcionales.

## Scope

**In:**

- En `app/kids/page.tsx`, reemplazar el enlace "Agregar niño" (actualmente `<a href="#">`) por un botón que abra un modal superpuesto sobre la página de niños.
- Nuevo componente cliente `components/add-kid-modal.tsx` que contiene el botón disparador y el modal.
- Recrear el formulario del modal siguiendo `references/pantallas/agregar-nino.dc.html`: header ("Cancelar" a la izquierda, título "Agregar niño" centrado, "Guardar" a la derecha), campos NOMBRE COMPLETO, FECHA DE NACIMIENTO (`dd/mm/aaaa`), SALA (dropdown), ALERGIAS (ETIQUETAS) y NOTAS MÉDICAS (textarea).
- Fondo superpuesto semitransparente (tinte oscuro) sobre la página de niños.
- Campo SALA: dropdown no interactivo con único valor "Soles", preseleccionado por defecto (coherente con `RoomId` que solo soporta `soles`).
- Validación de bloqueo: "Guardar" queda deshabilitado mientras falten NOMBRE COMPLETO, FECHA DE NACIMIENTO o SALA; se marca visualmente qué campos son obligatorios (asterisco o similar).
- "Cancelar" cierra el modal y vuelve a la lista de niños sin cambios.
- "Guardar", una vez habilitado, es un botón muerto (apunta a `#`) y no agrega el niño a la lista (sin persistencia, coherente con SPEC 02/03).

**Out of scope (para specs futuras):**

- Persistir / agregar realmente el niño a la lista (base de datos, backend, localStorage).
- Acción real al guardar (redirección al perfil, etc.).
- Edición de salas / otras salas además de "Soles".
- Validación de formato de la fecha de nacimiento (solo se exige que esté completada).
- "Vincular padre" u otras acciones del perfil.
- Adaptación responsive/móvil.
- Accesibilidad completa (foco trampa, cierre por Esc, ARIA) — se limita al cierre básico.

## Data model

No se introducen estructuras de datos nuevas ni se modifica el modelo existente. El formulario es puramente visual; los valores capturados no se persisten ni se agregan al array `kids` de `lib/ninos-data.ts`. Reutiliza la paleta de tokens de `globals.css` definida en SPEC 01/02 (colores `--color-*` para líneas, fondo de card, texto, placeholder, botón coral).

Estado local del componente cliente (`components/add-kid-modal.tsx`), con `useState`:

```ts
type KidFormState = {
  name: string;
  birthDate: string;
  room: RoomId; // siempre "soles"
  allergies: string;
  notes: string;
};
```

## Implementation plan

1. **`components/add-kid-modal.tsx` (componente cliente).** Con "use client". Contiene el estado del formulario (`useState`), el botón disparador "Agregar niño" con el gradiente coral actual, el estado `open: boolean`, el overlay semitransparente y el modal con los 5 campos y el header (Cancelar / Agregar niño / Guardar).
2. **`app/kids/page.tsx`.** Importar `<AddKidModal />` y reemplazar el bloque `<a href="#">…Agregar niño…</a>` por el componente. La sección header queda igual en lo demás (eyebrow "GESTIÓN", h1 "Niños").
3. **Estilos del overlay y modal.** Overlay fijo con fondo `rgba(63,54,46,.4)`; tarjeta centrada max-w 520 con fondo `#FBF4EC`, borde `#ECE0D0`, `rounded-24` y `box-shadow` suave, replicando la estética del template.
4. **Validación.** `const canSave = name.trim() !== "" && birthDate.trim() !== "" && room !== ""`. "Guardar" se renderiza con `disabled={!canSave}` (estilo apagado) y `href="#"`.
5. **Verificación.** `npm run build` y `npx tsc --noEmit`. Visual con Playwright: capturar `/kids` abriendo el modal y comparar contra `references/pantallas/agregar-nino.dc.html` (guardar captura en `.playwright-mcp/`).

## Acceptance criteria

- [x] `npm run build` termina sin errores y `npx tsc --noEmit` no reporta errores.
- [x] En `/kids`, al pulsar "Agregar niño" se abre un modal superpuesto (overlay oscuro) sobre la lista, sin cambiar de ruta.
- [x] El modal replica el formulario de `agregar-nino.dc.html`: header con "Cancelar" / "Agregar niño" / "Guardar", campos NOMBRE COMPLETO, FECHA DE NACIMIENTO (`dd/mm/aaaa`), SALA, ALERGIAS (ETIQUETAS) y NOTAS MÉDICAS (textarea).
- [x] El campo SALA muestra "Soles" preseleccionado por defecto y es la única opción.
- [x] "Guardar" está deshabilitado mientras falten NOMBRE COMPLETO, FECHA DE NACIMIENTO o SALA.
- [x] Al completar los tres campos obligatorios, "Guardar" se habilita y apunta a `#` (botón muerto, no agrega el niño).
- [x] "Cancelar" cierra el modal y la lista de niños permanece sin cambios.
- [x] Los campos ALERGIAS y NOTAS MÉDICAS son opcionales: dejar vacíos no afecta la habilitación de "Guardar".
- [x] No hay errores en consola al abrir/cerrar el modal.
- [x] La página `/kids` sigue viéndose idéntica a la de SPEC 02 con el modal cerrado.

## Decisions

- **Sí:** Modal superpuesto sobre `/kids` (no una ruta separada ni reemplazo de pantalla), según lo pedido.
- **Sí:** `components/add-kid-modal.tsx` como componente cliente que encapsula disparador + modal, manteniendo `app/kids/page.tsx` como server component.
- **Sí:** "Guardar" como botón muerto `#` (visual only), coherente con SPEC 02/03 donde las acciones eran estáticas. El niño no se agrega a la lista.
- **Sí:** Validación de bloqueo para los campos obligatorios (nombre, fecha de nacimiento, sala), con botón deshabilitado hasta completarlos.
- **Sí:** Sala único valor "Soles" preseleccionado, reflejando que `RoomId` solo soporta `soles`.
- **No:** Persistencia / agregar el niño realmente, validación de formato de fecha, otras salas, responsive, accesibilidad completa. Specs futuras.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| Pérdida de fidelidad visual al traducir el template a un modal | Comparación con el template `.dc.html` vía Playwright en `.playwright-mcp/`; ajustar valores sueltos hasta el match. |
| El template es una página, no un modal: no hay plantilla de fondo/overlay | Seguir la estética de tokens existente (`--color-*`, tarjeta `#FBF4EC`, borde `#ECE0D0`) para el overlay y la tarjeta. |

## What is **not** in this spec

- Persistencia ni agregar realmente el niño a la lista.
- Acción real de guardado (redirección, perfil).
- Otras salas además de "Soles".
- Validación de formato de la fecha de nacimiento.
- Responsive/móvil.
- Accesibilidad completa del modal.

Cada una de esas, si llega, va en su propia spec.
