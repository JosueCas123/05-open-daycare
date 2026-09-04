# SPEC 07 — Crear tabla daycares

> **Estado:** Completado
> **Fecha:** 2026-09-04
> **Objetivo:** Crear la tabla `daycares` en Supabase con RLS (solo el admin que la creó puede leer/escribir), guardar el archivo de migración localmente y insertar 4 guarderías de prueba (enfocado en "Guardería Sala Soles").

## Scope

**In:**

- Archivo de migración SQL en `supabase/migrations/` con la tabla `daycares`:
  - `id` uuid PK (default `gen_random_uuid()`)
  - `name` text NOT NULL
  - `created_by` uuid FK → auth.users (para vincular al admin que la creó)
  - `created_at` timestamptz (default `now()`)
- Habilitar RLS en `daycares`.
- Política RLS: solo el usuario autenticado cuyo `auth.uid()` = `created_by` puede CRUD.
- Aplicar la migración al proyecto remoto vía `supabase_apply_migration`.
- Seed de 4 guarderías: "Guardería Sala Soles" (principal), "Los Pequeñitos", "Estrellitas", "Mi Jardín".

**Out of scope (para specs futuras):**

- UI/Next.js para crear o listar guarderías
- Campos adicionales (dirección, teléfono, logo, etc.)
- Relaciones FK con otras tablas (rooms, users)
- Edge functions o triggers

## Data model

```sql
CREATE TABLE public.daycares (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.daycares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can CRUD their own daycares"
  ON public.daycares FOR ALL
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

INSERT INTO public.daycares (name) VALUES
  ('Guardería Sala Soles'),
  ('Guardería Los Pequeñitos'),
  ('Guardería Estrellitas'),
  ('Guardería Mi Jardín');
```

> El seed inserta sin `created_by` (NULL) — es data de prueba. En producción el admin crea su guardería vía UI.

## Implementation plan

1. Crear `supabase/migrations/` si no existe.
2. Guardar `supabase/migrations/20260904010000_create_daycares_table.sql` con el SQL completo.
3. Aplicar migración remota via `supabase_apply_migration`.
4. Verificar tabla con `supabase_list_tables` (verbose).
5. Verificar 4 filas con `SELECT * FROM public.daycares`.
6. `npm run build` + `npx tsc --noEmit`.

## Acceptance criteria

- [x] Archivo `supabase/migrations/20260904010000_create_daycares_table.sql` existe.
- [x] Tabla `daycares` con columnas `id`, `name`, `created_by`, `created_at`.
- [x] RLS habilitado con política solo-admin.
- [x] 4 filas en `daycares`.
- [x] `npm run build` sin errores.
- [x] `npx tsc --noEmit` sin errores.

## Decisions

- **Sí:** Campo `created_by` para RLS (no está en el esquema de referencia pero es necesario).
- **Sí:** Migración local + aplicación remota vía MCP.
- **Sí:** Seed en la misma migración.
- **No:** UI, campos adicionales, FK con otras tablas — specs futuras.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| `created_by` no está en el esquema de referencia | Se agrega como extensión necesaria para RLS; documentado como decisión. |
| Seed sin `created_by` podría interactuar con RLS | Verificar después de aplicar; ajustar política si es necesario. |

## What is **not** in this spec

- UI/Next.js para gestionar guarderías.
- Campos adicionales de daycares.
- Relaciones FK con otras tablas.
- Edge functions o triggers.

Cada una de esas, si llega, va en su propia spec.
