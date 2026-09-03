# SPEC 03 — Pantallas de login y activar cuenta

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-02
> **Objetivo:** Recrear las pantallas `login.dc.html` e `activar-cuenta.dc.html` como las rutas `/auth/login` y `/auth/activar-cuenta` de la app Next.js, con estética idéntica, datos estáticos y sin el toggle "Personal / Familia".

## Scope

**In:**

- Reconstruir la pantalla de login en `app/auth/login/page.tsx` siguiendo `references/pantallas/login.dc.html` **sin** el bloque selector "INGRESO COMO" (Personal/Familia): panel decorativo izquierdo con gradiente coral + brand y slogan, y panel derecho con el formulario (EMAIL, CONTRASEÑA, "¿Olvidaste tu contraseña?", botón "Iniciar sesión").
- Reconstruir la pantalla de activar cuenta en `app/auth/activar-cuenta/page.tsx` siguiendo `references/pantallas/activar-cuenta.dc.html`: columna centrada con logo, h1 "Bienvenida a OpenDayCare", tarjeta de invitación (Mateo · Sala Soles), inputs CÓDIGO DE INVITACIÓN / EMAIL / CREAR CONTRASEÑA, checkbox de autorización de fotos, botón "Activar mi cuenta".
- Ambas pantallas **sin sidebar**: son pantallas de auth standalone de ancho completo/centradas.
- Enlace cruzado entre pantallas: "Activá tu cuenta" del login conduce a `/auth/activar-cuenta`; "Iniciar sesión" de activar cuenta conduce a `/auth/login`.
- Botones primarios ("Iniciar sesión", "Activar mi cuenta") y enlaces secundarios ("¿Olvidaste tu contraseña?") apuntan a `#`.
- Extensiones de tipografías y paleta: agregar en `globals.css` los tokens que no existan aún.

**Out of scope (para specs futuras):**

- Lógica de autenticación real (verificar credenciales, sesión, logout funcional).
- Persistencia / base de datos / backend.
- Validación de formularios ni estados de error.
- Envío de invitaciones ni gestión de códigos.
- Redirección tras login/activación (el feed no se alcanza desde aquí).
- Adaptación responsive/móvil.

## Data model

Esta feature no introduce estructuras de datos nuevas. Reutiliza los datos estáticos ya existentes en `lib/feed-data.ts` (`sala.brand`) para el brand "OpenDayCare / Sala Soles" del login y la tarjeta de invitación. El resto (email, código, textos) son literales en el JSX.

Nuevos tokens de color en `globals.css` (paleta del login/activar, no cubiertos por SPEC 01):

```
--color-login-bg: #fbf4ec          // fondo base
--color-login-input-bg: #ffffff    // input
--color-login-input-border: #eadfd0
--color-login-placeholder: #b6a99b
--color-login-label: #94887b
--color-login-subtext: #94887b
--color-checkbox-bg: #fbf1d6       // fondo checkbox
--color-checkbox-text: #8a7234
--color-checkbox-check: #5fb97e
--color-invite-avatar-bg: #a9d9e8  // ya existe como --color-actividad-avatar-bg
```

## Implementation plan

1. **Tokens de tema.** En `app/globals.css`: añadir los tokens de la sección Data model (fondo login, bordes de input, placeholder, label, checkbox). Verificación: `npm run dev` sigue compilando.
2. **`app/auth/login/page.tsx`.** Pantalla standalone sin sidebar: `<div>` en grid `grid-cols-[1.05fr_1fr]` con min-height 100vh y fondo `--color-login-bg`. Panel izquierdo (gradiente 155deg `#F6A98E→#EC7E62`, décors circulares, brand "OpenDayCare", h1 "El día de cada niño, compartido con su familia.", párrafo y footer "🌿 Guardería Sala Soles"). Panel derecho centrado (max-w 392): h2 "Iniciar sesión", sub "Ingresá para ver el día de hoy.", campos EMAIL y CONTRASEÑA, "¿Olvidaste tu contraseña?" (`#`), botón "Iniciar sesión" con gradiente coral (`#`), y "¿Te invitó la guardería? [Activá tu cuenta](/auth/activar-cuenta)".
3. **`app/auth/activar-cuenta/page.tsx`.** Pantalla standalone centrada vertical/horizontal (max-w 440): logo, h1 "Bienvenida a OpenDayCare", párrafo, tarjeta de invitación (avatar "M" `#A9D9E8` + "Te invitaron a seguir a / Mateo · Sala Soles"), inputs CÓDIGO DE INVITACIÓN (prefill "7K4P9", fuente Fredoka, letter-spacing), EMAIL (prefill), CREAR CONTRASEÑA, label checkbox "Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.", botón "Activar mi cuenta" (`#`), y "¿Ya tenés cuenta? [Iniciar sesión](/auth/login)".
4. **Verificación.** `npm run build` y `npx tsc --noEmit`. Comparación visual con Playwright de `/auth/login` y `/auth/activar-cuenta` contra los templates (no hay PNG de referencia; se valida contra `references/pantallas/login.dc.html` y `activar-cuenta.dc.html`, captura en `.playwright-mcp/`).

## Acceptance criteria

- [x] `npm run build` termina sin errores y `npx tsc --noEmit` no reporta errores.
- [x] `/auth/login` no muestra el bloque "INGRESO COMO" ni los botones "Personal"/"Familia".
- [x] `/auth/login` se ve idéntico al template sin el selector de rol: panel izquierdo gradiente con brand "OpenDayCare", h1 "El día de cada niño, compartido con su familia.", footer "🌿 Guardería Sala Soles"; panel derecho con EMAIL, CONTRASEÑA, "¿Olvidaste tu contraseña?", botón "Iniciar sesión" y enlace "Activá tu cuenta".
- [x] `/auth/activar-cuenta` se ve idéntico al template: logo, "Bienvenida a OpenDayCare", tarjeta de invitación "Mateo · Sala Soles", inputs CÓDIGO DE INVITACIÓN/EMAIL/CREAR CONTRASEÑA, checkbox de autorización, botón "Activar mi cuenta" y enlace "Iniciar sesión".
- [x] En `/auth/login`, el enlace "Activá tu cuenta" conduce a `/auth/activar-cuenta`.
- [x] En `/auth/activar-cuenta`, el enlace "Iniciar sesión" conduce a `/auth/login`.
- [x] En ambas pantallas, botones primarios ("Iniciar sesión", "Activar mi cuenta") y "¿Olvidaste tu contraseña?" apuntan a `#`, y ninguna muestra la `Sidebar`.
- [x] No hay errores en consola al cargar `/auth/login` y `/auth/activar-cuenta`.
- [x] La home `/` (SPEC 01) y las vistas `/kids` (SPEC 02) no se ven afectadas.

## Decisions

- **Sí:** Rutas bajo `/auth` (`/auth/login`, `/auth/activar-cuenta`). Agrupa las pantallas de autenticación por si luego hay más.
- **Sí:** Sin sidebar en ambas. Los templates son pantallas de auth standalone; la sidebar es de las vistas autenticadas.
- **Sí:** Eliminar el toggle "Personal / Familia" del login, según lo pedido por el usuario.
- **Sí:** Datos estáticos inline en el JSX (sin módulo `lib/` nuevo). No hay estructura reutilizable más allá de la paleta.
- **Sí:** Enlace cruzado funcional entre login y activar cuenta; botones primarios muertos `#`. No hay lógica de auth todavía.
- **No:** Autenticación real, sesión, validación, backend, redirección al feed. Specs futuras.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| Pérdida de fidelidad visual al traducir CSS a Tailwind | Comparación con los templates `.dc.html` vía Playwright en `.playwright-mcp/`; ajustar valores sueltos hasta el match. |
| El panel izquierdo del login se corta en ventanas bajas | `min-height:100vh` + `overflow:hidden` en el panel, como el template. |

## What is **not** in this spec

- Autenticación real (verificar credenciales, sesión, logout funcional).
- Base de datos, backend ni envío de invitaciones.
- Validación de formularios y estados de error.
- Redirección al feed tras login/activación.
- Adaptación móvil/responsive.

Cada una de esas, si llega, va en su propia spec.