# SPEC 08 — Crear tabla users y enumeraciones

> **Estado:** Aprobado
> **Depende de:** SPEC 07
> **Fecha:** 2026-09-04
> **Objetivo:** Crear la tabla `users` en Supabase con los enums `user_role` y `user_status`, RLS con acceso por daycare, y un usuario staff de prueba (josue@google.com).

## Scope

**In:**

- Crear enum `user_role` con valores: `staff`, `parent`, `admin`.
- Crear enum `user_status` con valores: `pending`, `active`.
- Archivo de migración SQL en `supabase/migrations/` con la tabla `users`:
  - `id` uuid PK → FK `auth.users(id)` ON DELETE CASCADE
  - `daycare_id` uuid FK → `daycares(id)` nullable
  - `role` user_role NOT NULL
  - `status` user_status NOT NULL DEFAULT 'active'
  - `full_name` text NOT NULL
  - `avatar_url` text nullable
  - `created_at` / `updated_at` timestamptz
- Habilitar RLS en `users`.
- Políticas RLS:
  - SELECT: usuario autenticado puede leer su propia fila O filas de usuarios del mismo `daycare_id`.
  - INSERT: usuario autenticado puede insertar su propia fila (self-signup) O filas en su mismo `daycare_id` (staff agrega padres).
  - UPDATE: usuario autenticado puede actualizar solo su propia fila.
  - DELETE: usuario autenticado puede eliminar solo su propia fila.
- Aplicar migración vía `supabase_apply_migration`.
- Crear usuario staff de prueba: `josue@google.com` / `Abc123` en `auth.users` + fila en `public.users` con role `staff`, status `active`.
- Verificar: tabla, enums, RLS, usuario de prueba.

**Out of scope (para specs futuras):**

- Trigger `AFTER INSERT` en `auth.users` para auto-crear fila en `public.users`.
- Campos `notify_on_post` y `daily_summary_enabled`.
- UI/Next.js para gestión de usuarios.
- Invite flow / onboarding de padres.
- Relaciones FK desde otras tablas hacia `users` (posts, comments, etc.).

## Data model

```sql
-- Enums
CREATE TYPE public.user_role AS ENUM ('staff', 'parent', 'admin');
CREATE TYPE public.user_status AS ENUM ('pending', 'active');

-- Tabla users
CREATE TABLE public.users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daycare_id uuid REFERENCES public.daycares(id),
  role       public.user_role NOT NULL,
  status     public.user_status NOT NULL DEFAULT 'active',
  full_name  text NOT NULL,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- SELECT: propio row o mismo daycare
CREATE POLICY "Users can read own profile or same daycare"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR daycare_id IN (
    SELECT daycare_id FROM public.users WHERE id = auth.uid()
  ));

-- INSERT: self-signup o mismo daycare
CREATE POLICY "Users can insert own profile or same daycare"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id OR daycare_id IN (
    SELECT daycare_id FROM public.users WHERE id = auth.uid()
  ));

-- UPDATE: solo propio row
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- DELETE: solo propio row
CREATE POLICY "Users can delete own profile"
  ON public.users FOR DELETE
  USING (auth.uid() = id);
```

> El usuario de prueba se inserta directamente en `auth.users` (con pass hashed) y `public.users` para desbloquear el desarrollo. No hay trigger automático aún.

## Implementation plan

1. Crear `supabase/migrations/` si no existe.
2. Guardar `supabase/migrations/20260904020000_create_users_table.sql` con enums + tabla + RLS.
3. Aplicar migración vía `supabase_apply_migration`.
4. Verificar enums con `\dT` o query directa.
5. Verificar tabla `users` con `supabase_list_tables` (verbose).
6. Crear usuario staff en `auth.users` (josue@google.com / Abc123) via `execute_sql` con password hash.
7. Insertar fila en `public.users` con role `staff`, status `active`.
8. Verificar usuario de prueba con `SELECT * FROM public.users`.
9. Verificar RLS: intentar select sin auth (debe fallar o retornar vacío).
10. `npm run build` + `npx tsc --noEmit`.

## Acceptance criteria

- [ ] Enums `user_role` y `user_status` existen en la base de datos.
- [ ] Tabla `users` con columnas: `id`, `daycare_id`, `role`, `status`, `full_name`, `avatar_url`, `created_at`, `updated_at`.
- [ ] RLS habilitado con 4 políticas (SELECT, INSERT, UPDATE, DELETE).
- [ ] Usuario staff `josue@google.com` existe en `auth.users` y `public.users` con role `staff`.
- [ ] `npm run build` sin errores.
- [ ] `npx tsc --noEmit` sin errores.

## Decisions

- **Sí:** Enums como tipos Postgres (no text con check) — más robusto y con autocompletado en herramientas.
- **Sí:** `id` es FK directa a `auth.users(id)` ON DELETE CASCADE — un usuario solo existe si existe en Auth.
- **Sí:** RLS con SELECT amplio (propio row + mismo daycare) — necesario para que el staff vea la lista de padres.
- **Sí:** INSERT permite self-signup (`auth.uid() = id`) y staff agrega padres (mismo daycare).
- **Sí:** Usuario staff creado directamente (no via UI/trigger) — desbloquea desarrollo inmediato.
- **No:** Trigger automático, campos de notificaciones, UI — specs futuras.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| INSERT policy con subquery puede ser lenta en tablas grandes | Por ahora pocas filas; optimizar con `daycare_id = NEW.daycare_id` si hay problemas de performance. |
| Usuario staff insertado manualmente podría tener problemas con RLS si `daycare_id` es NULL | Insertar con `daycare_id` apuntando a una de las guarderías de prueba de SPEC 07. |

## What is **not** in this spec

- Trigger automático de creación de usuario.
- Campos de notificaciones.
- UI/Next.js para gestión de usuarios.
- Invite flow / onboarding de padres.
- FK desde otras tablas hacia `users`.

Cada una de esas, si llega, va en su propia spec.
