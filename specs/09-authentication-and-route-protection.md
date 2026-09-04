# SPEC 09 — Autenticación con Supabase y protección de rutas

> **Estado:** Aprobado
> **Depende de:** SPEC 03, SPEC 08
> **Fecha:** 2026-09-04
> **Objetivo:** Implementar autenticación real de email y contraseña contra Supabase en `/auth/login`, con logout desde la sidebar y protección de las rutas autenticadas mediante `proxy.ts` y verificación en Server Components.

## Scope

**In:**

- Login real en `app/auth/login/page.tsx`: formulario con email y contraseña (vacíos, sin prefill), `signInWithPassword` contra Supabase, botón deshabilitado mientras envía y mensaje "Email o contraseña incorrectos" ante credenciales inválidas.
- Al autenticarse, redirigir a `/`. Si un usuario ya autenticado visita `/auth/login`, redirigir a `/`.
- Logout funcional: el icono "Cerrar sesión" de la `Sidebar` (hoy `#`) firma out vía server action y redirige a `/auth/login`.
- Protección de rutas en `proxy.ts` (Next.js 16 renombró `middleware.ts` a `proxy.ts`, ya existente): refresca la sesión con `getUser()`, redirige a `/auth/login` las rutas protegidas sin sesión y redirige a `/` desde `/auth/login` con sesión. Rutas públicas: `/auth/login` y `/auth/activar-cuenta`.
- Verificación adicional en cada Server Component de ruta protegida con `getUser()` y redirección a `/auth/login` si no hay sesión (doble capa: `proxy.ts` + cada página).
- Leer el perfil propio desde `public.users` (RLS de SPEC 08 permite leer solo la propia fila) y mostrarlo en la `Sidebar` (nombre completo, rol, inicial) y en el saludo del feed (`Buenas, José`).
- Helper de perfil en `utils/supabase/profiles.ts` y server action de logout en `app/auth/actions.ts`.

**Out of scope (para specs futuras):**

- "¿Olvidaste tu contraseña?" (reset de contraseña): sigue apuntando a `#`.
- Activación de cuenta / flujo de invitaciones (`/auth/activar-cuenta`): sigue estático con botón muerto.
- Página "Mi cuenta": sigue en `#`.
- Bloqueo de login por `status = pending` ni permisología por rol más allá de mostrarlo en la UI.
- Registro/self-signup desde la app y verificación de email (confirmación) vía UI.

## Data model

No hay cambios de esquema. Se introduce un helper de solo-servidor y una server action:

```ts
// utils/supabase/profiles.ts  (server only)
type Profile = { full_name: string; role: "staff" | "parent" | "admin"; avatar_url: string | null };

getCurrentUserProfile(): Promise<{ user: User | null; profile: Profile | null }> // getUser() + fila propia en public.users
requireUser(): Promise<Profile>  // redirect("/auth/login") si no hay sesión ni perfil

// app/auth/actions.ts  (server)
logoutAction(): Promise<void>    // supabase.auth.signOut() + redirect("/auth/login")
```

`requireUser()` redirige a `/auth/login` cuando no hay usuario. La `Sidebar` recibe `{ fullName, role, avatarLetter }` como props (avatarLetter = inicial del primer nombre en mayúscula). El rol se traduce solo en la UI: `{ staff: "Staff", parent: "Familiar", admin: "Admin" }` (valores en inglés en la DB → etiquetas en español, convención del esquema de referencia). Si el usuario no tiene fila en `public.users`, el fallback es la parte local del email como nombre y sin rol.

## Implementation plan

1. **`utils/supabase/middleware.ts` + `proxy.ts`.** Adaptar el helper para que además de la respuesta exponga el cliente Supabase; en `proxy.ts` llamar `getUser()`: sin sesión en ruta protegida → redirect `/auth/login`; con sesión en `/auth/login` → redirect `/`. Públicas: `["/auth/login", "/auth/activar-cuenta"]`. Verificación: sin sesión, `/` cae en `/auth/login`.
2. **`utils/supabase/profiles.ts` y `app/auth/actions.ts`.** Crear `getCurrentUserProfile()`, `requireUser()` y `logoutAction()`. Aún sin consumir → el build sigue pasando.
3. **Login funcional.** `components/login-form.tsx` (cliente): campos EMAIL y CONTRASEÑA vacíos, `signInWithPassword` con el browser client, estado submitting, mensaje de error y `router.push("/")` + `router.refresh()` al éxito. En `app/auth/login/page.tsx`, si hay sesión → `redirect("/")`. Verificación: login manual `josue@google.com` / `Abc123` termina en `/`.
4. **Logout en la sidebar.** `components/sidebar.tsx`: props de usuario (`fullName`, `role`, `avatarLetter`) y reemplazar el `<a href="#">` de cerrar sesión por `<form action={logoutAction}>` con el botón del icono. Verificación: tras logout vuelve a `/auth/login`.
5. **Perfil en las rutas protegidas.** `app/page.tsx`, `app/kids/page.tsx` y `app/kids/[id]/page.tsx`: usar `requireUser()` y pasar el perfil a la `Sidebar`; saludo del feed = `Buenas, {primerNombre}`. La sidebar deja de importar `currentUser` de `lib/feed-data`. `/todos` queda protegido por `proxy.ts` sin cambios.
6. **Verificación.** `npm run build` y `npx tsc --noEmit`. Flujo con Playwright en `.playwright-mcp/`: `/` sin sesión → login; login válido → `/` con sidebar "José Staff · Staff" y saludo "Buenas, José"; credenciales inválidas → error sin redirigir; logout → `/auth/login`.

## Acceptance criteria

- [x] `npm run build` termina sin errores y `npx tsc --noEmit` no reporta errores.
- [x] Sin sesión, visitar `/`, `/kids` y `/kids/[id]` redirige a `/auth/login`.
- [x] Sin sesión, `/auth/login` y `/auth/activar-cuenta` se renderizan normalmente.
- [x] Con sesión, visitar `/auth/login` redirige a `/`.
- [x] Ingresar `josue@google.com` / `Abc123` en `/auth/login` termina en `/` con sesión activa.
- [x] Con credenciales inválidas se muestra "Email o contraseña incorrectos" y no se redirige.
- [x] El botón "Iniciar sesión" se deshabilita mientras la petición está en vuelo y los campos ya no vienen precargados.
- [x] La `Sidebar` muestra "José Staff · Staff" con la inicial "J" como avatar.
- [x] El saludo del feed muestra "Buenas, José" en lugar del estático "Buenas, Caro".
- [x] El icono de cerrar sesión firma out y redirige a `/auth/login`.
- [x] "¿Olvidaste tu contraseña?" y `/auth/activar-cuenta` siguen apuntando a `#` (sin lógica).
- [x] No hay errores en consola en el flujo login → feed → logout.
- [x] `/` y `/kids` mantienen su estética (SPEC 01/02) sin regresiones visuales.

## Decisions

- **Sí:** Doble capa de protección: `proxy.ts` refresca sesión y redirige, y cada Server Component verifica con `getUser()`. Práctica recomendada de Supabase; solo proxy no es confiable como capa única.
- **Sí:** `proxy.ts` (no `middleware.ts`). Next.js 16 renombró el archivo, y ya existe en el repo sin lógica de auth.
- **Sí:** `auth.getUser()` (no `getSession()`) para verificar. Valida el JWT contra Supabase y evita spoofing con cookies falsas.
- **Sí:** Login con el browser client en un formulario cliente (`signInWithPassword`): loading y error inline sin recargar.
- **Sí:** Logout vía server action desde la `Sidebar`, que sigue siendo server component.
- **Sí:** Perfil real desde `public.users` en la UI. SPEC 08 ya habilitó la RLS de lectura de la propia fila.
- **Sí:** Traducción de rol solo en la UI (staff → "Staff", parent → "Familiar", admin → "Admin"), siguiendo la convención DB en inglés / UI en español.
- **No:** Reset de contraseña, activación de cuenta/invitaciones, "Mi cuenta", bloqueo por `status`, self-signup, verificación de email por UI. Specs futuras.
- **No:** Refactor a route group `(app)` con layout compartido. Las 3 páginas protegidas llaman al helper directamente; se mantiene el diff mínimo.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| Usuario de prueba sin confirmar falla con "Email not confirmed" | `josue@google.com` ya tiene `confirmed_at` (verificado 2026-09-04); login manual en la verificación. |
| Usuario autenticado sin fila en `public.users` rompe la UI | Fallback: nombre = parte local del email, sin rol. |
| `getUser()` en `proxy.ts` dispara una llamada de red por request | Aceptable para este tamaño de app; patrón oficial de Supabase. |
| La RLS de SPEC 08 solo permite leer la propia fila | El helper consulta con `eq('id', user.id)`; leer otros users (staff) va en una spec futura. |

## What is **not** in this spec

- Reset de contraseña ("¿Olvidaste tu contraseña?").
- Activación de cuenta y flujo de invitaciones.
- Página "Mi cuenta".
- Registro/self-signup y verificación de email vía UI.
- Listado de usuarios por daycare (staff) y permisología por rol.
- Refactor a un layout compartido de rutas autenticadas.

Cada una de esas, si llega, va en su propia spec.