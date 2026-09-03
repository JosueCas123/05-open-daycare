# SPEC 05 — Modal de vincular padre

> **Estado:** Implementado
> **Depende de:** SPEC 02
> **Fecha:** 2026-09-03
> **Objetivo:** Al presionar "Vincular otro padre" en el perfil de un niño, abrir un modal superpuesto que replica el formulario de `references/pantallas/vincular-padre.dc.html`, con campos nombre, email y parentesco, validación de formato de email, y código de invitación estático.

## Scope

**In:**

- En `components/kid-profile.tsx`, reemplazar el enlace "Vincular otro padre" (actualmente `<a href="#">`) por un botón que abra un modal superpuesto.
- Nuevo componente cliente `components/link-parent-modal.tsx` que encapsula el disparador y el modal.
- Recrear el formulario del modal siguiendo `references/pantallas/vincular-padre.dc.html`: header ("Vincular padre" + subtítulo "a {kid.name}" + botón cerrar), cuadro informativo azul, campos NOMBRE DEL PADRE/MADRE, EMAIL, PARENTESCO (3 botones toggle: Mamá / Papá / Tutor/a), recuadro amarillo del CÓDIGO DE INVITACIÓN y botón "Enviar invitación".
- Fondo superpuesto semitransparente (tinte oscuro) sobre el perfil.
- Validación de bloqueo: "Enviar invitación" deshabilitado mientras falten NOMBRE DEL PADRE/MADRE, EMAIL o PARENTESCO; validación de formato de email (expresión simple regex); mostrar indicador de error visual si el email no tiene formato válido.
- Parentesco: "Mamá" seleccionado por defecto al abrir el modal.
- Código de invitación: valor estático hardcodeado `7K4P9` con texto "Vence en 7 días".
- "Enviar invitación" es un botón muerto (`href="#"`), no agrega el padre a la lista.
- El botón cerrar (X) y "Enviar invitación" cierran el modal.

**Out of scope (para specs futuras):**

- Generar códigos de invitación dinámicos.
- Persistir / enviar realmente la invitación (correo, backend, base de datos).
- Agregar el padre a la lista de padres vinculados.
- Validación de nombre duplicado entre padres existentes.
- Adaptación responsive/móvil.
- Accesibilidad completa del modal.

## Data model

No se introducen estructuras de datos nuevas. El formulario es puramente visual; los valores capturados no se persisten. Reutiliza la paleta de tokens de `globals.css` y la paleta del template (azul informativo `#E3ECFB` / `#4E72C8`, amarillo código `#FBF1D6` / `#E6D08A`, coral botón `#F4977E` / `#EE8164`).

Estado local del componente cliente (`components/link-parent-modal.tsx`), con `useState`:

```ts
type ParentFormState = {
  parentName: string;
  email: string;
  relation: "Mamá" | "Papá" | "Tutor/a";
};
```

## Implementation plan

1. **`components/link-parent-modal.tsx` (componente cliente).** Con "use client". Contiene el estado del formulario (`useState`), el botón disparador "Vincular otro padre" (reemplaza el `<a href="#">` actual), el estado `open: boolean`, el overlay semitransparente y el modal con los campos y el header. El botón disparador recibe `kidName` como prop para mostrar "a {kidName}" en el header del modal.
2. **Validación.** `canSend` requiere `parentName.trim() !== ""` + `email.trim() !== ""` + regex de email (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Mostrar texto de error en rojo bajo el campo EMAIL si el email tiene contenido pero no pasa la regex (mientras `email.length > 0 && !regex.test(email)`). "Enviar invitación" se renderiza con `disabled={!canSend}` (estilo apagado) y `href="#"`.
3. **`components/kid-profile.tsx`.** Importar `<LinkParentModal kidName={kid.name} />` y reemplazar el bloque `<a href="#">…Vincular otro padre…</a>` por el componente.
4. **Estilos del overlay y modal.** Overlay fijo con fondo `rgba(63,54,46,.4)`; tarjeta centrada max-w 480 con fondo `#FBF4EC`, borde `#ECE0D0`, `rounded-24` y `box-shadow` suave, replicando la estética del template. Parentesco: 3 botones con estilo pill (rounded-full, border, fondo), el activo con fondo `#CCD8F4` / borde `#9FB8EC` / texto `#4E72C8`.
5. **Verificación.** `npm run build` y `npx tsc --noEmit`. Visual con Playwright: capturar el perfil de Mateo abriendo el modal y comparar contra `references/pantallas/vincular-padre.dc.html` (guardar captura en `.playwright-mcp/`).

## Acceptance criteria

- [x] `npm run build` termina sin errores y `npx tsc --noEmit` no reporta errores.
- [x] En `/kids/mateo-fernandez`, al pulsar "Vincular otro padre" se abre un modal superpuesto (overlay oscuro) sobre el perfil, sin cambiar de ruta.
- [x] El modal replica el formulario de `vincular-padre.dc.html`: header con "Vincular padre" / "a Mateo Fernández" / botón X, cuadro informativo azul, campos NOMBRE DEL PADRE/MADRE, EMAIL, PARENTESCO (Mamá / Papá / Tutor/a), recuadro amarillo con código `7K4P9` y "Vence en 7 días", botón "Enviar invitación".
- [x] "Enviar invitación" está deshabilitado mientras falten NOMBRE DEL PADRE/MADRE, EMAIL o PARENTESCO.
- [x] Al completar los 3 campos, "Enviar invitación" se habilita y apunta a `#` (botón muerto, no agrega el padre).
- [x] Si el campo EMAIL tiene contenido pero no tiene formato válido de email, se muestra un indicador de error visual y "Enviar invitación" permanece deshabilitado.
- [x] El parentesco "Mamá" viene seleccionado por defecto al abrir el modal.
- [x] El código de invitación es `7K4P9` con texto "Vence en 7 días".
- [x] El nombre del niño en el header del modal se muestra dinámicamente (ej. "a Mateo Fernández").
- [x] "Cancelar" (botón X) cierra el modal y el perfil permanece sin cambios.
- [x] No hay errores en consola al abrir/cerrar el modal.
- [x] La página `/kids/mateo-fernandez` sigue viéndose idéntica con el modal cerrado.

## Decisions

- **Sí:** Modal superpuesto sobre el perfil (no una ruta separada), según lo pedido.
- **Sí:** `components/link-parent-modal.tsx` como componente cliente que encapsula disparador + modal, manteniendo `kid-profile.tsx` como server component.
- **Sí:** "Enviar invitación" como botón muerto `#` (visual only), coherente con SPEC 02/04 donde las acciones eran estáticas. El padre no se agrega a la lista.
- **Sí:** Validación de formato de email con regex simple (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), mostrando error visual cuando el email tiene contenido pero formato inválido.
- **Sí:** Parentesco con "Mamá" seleccionado por defecto al abrir el modal.
- **Sí:** Código de invitación estático hardcodeado `7K4P9`.
- **No:** Generación dinámica de códigos, persistencia, envío real de invitaciones, responsive, accesibilidad completa. Specs futuras.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| Pérdida de fidelidad visual al traducir el template a un modal | Comparación con el template `.dc.html` vía Playwright en `.playwright-mcp/`; ajustar valores hasta el match. |
| El template es una página, no un modal: no hay plantilla de fondo/overlay | Seguir la estética de tokens existente (`--color-*`, tarjeta `#FBF4EC`, borde `#ECE0D0`) para overlay y tarjeta. |

## What is **not** in this spec

- Generación dinámica de códigos de invitación.
- Persistencia ni envío real de invitaciones (correo, backend).
- Agregar el padre a la lista de padres vinculados.
- Validación de nombre duplicado.
- Responsive/móvil.
- Accesibilidad completa del modal.

Cada una de esas, si llega, va en su propia spec.
