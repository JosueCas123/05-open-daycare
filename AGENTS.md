<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

- **Next.js 16.3.4** (App Router, `app/` directory) — APIs differ from older versions
- **React 19.2.8** — `LayoutProps<"/">` is the typed layout children prop (not `React.ReactNode`)
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss` plugin, uses `@import "tailwindcss"` + `@theme inline` in CSS (no `tailwind.config.*` file)
- **TypeScript** strict mode, `@/*` path alias maps to repo root
- **Supabase** — Backend-as-a-Service (PostgreSQL, Auth, Edge Functions, Realtime, Storage)

## Commands

```bash
npm run dev        # next dev — local dev server
npm run build      # next build
npm run lint       # eslint (core-web-vitals + typescript rules)
npm run start      # next start
```

No test, typecheck, or formatter scripts exist. Run `npx tsc --noEmit` for type checking if needed.

## Project structure

- `app/` — Next.js App Router pages and layouts (entry: `app/page.tsx`, `app/layout.tsx`)
- `public/` — static assets served at `/`
- `references/pantallas/` — HTML design templates for screens (`.dc.html` files using `<x-dc>` custom elements with a `dc-runtime` system)
- `references/screenshots/` — reference PNG images of target screens
- `.playwright-mcp/` — Playwright MCP output (screenshots, console logs); gitignored

## Design reference workflow

The `references/pantallas/` directory contains HTML prototypes built with a custom `dc-runtime` system (`support.js`). These are design-time artifacts, not runtime code. Use them as visual/structural reference when building actual Next.js pages.

## MCPs

- **Playwright MCP**: Use Playwright tools for screenshots and browser interaction. Save all Playwright output to `.playwright-mcp/`.
- **Context7 MCP**: Use for fetching framework documentation (Next.js, Tailwind, etc.).
- **Supabase MCP**: Use for database operations, auth, edge functions, realtime, storage, and project management. Tools include `list_tables`, `apply_migration`, `execute_sql`, `get_logs`, `get_advisors`, etc. **Always use `apply_migration` for schema changes.**

## Spec Drive Develoment

- /spec Usaremos esta habilidad para crear las especificaciones 
- /spec-impl Usaremos esta skill para hacer las implementaciones.
- /spec-verify Usaremos este agente (`.opencode/agents/spec-verify.md`) para verificar los criterios de aceptación de una spec contra la app implementada y marcar los checkboxes.

## Skills

- **spec** (`.agents/skills/spec/`) — Diseña y desarrolla specs siguiendo el método spec-driven, preguntando preguntas de clarificación antes de proponer la estructura.
- **spec-impl** (`.agents/skills/spec-impl/`) — Implementa una spec aprobada: valida que el estado sea "Approved", crea una rama git con el nombre de la spec y la implementa paso a paso.
- **supabase** (`.agents/skills/supabase/`) — Guía para trabajar con cualquier producto de Supabase: Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues, clientes SSR (supabase-js, @supabase/ssr), migraciones, RLS, debugging de errores y logs.
- **supabase-postgres-best-practices** (`.agents/skills/supabase-postgres-best-practices/`) — Cargar ANTES de escribir o modificar cualquier cosa en Postgres: creación/alteración de tablas y columnas, tipos de columnas, diseño de esquemas, migraciones, políticas RLS y sus tests, índices, triggers, funciones de BD, colas/jobs programados, pgvector y restauración de dumps. También para diagnosticar queries lentas, alta CPU, timeouts, planes EXPLAIN, etc.

## Reglas de codigo

- Usar codigo limpio, nombres, funciones,variables, etc. en ingles
- Antes de hacer cambios de esquema o escribir SQL en Supabase, cargar la skill `supabase-postgres-best-practices`.

## Base de Datos

- **Siempre usar migraciones** para cualquier cambio en la base de datos (creación/alteración de tablas, columnas, índices, políticas RLS, etc.).
- Usar `supabase_apply_migration` para aplicar cambios al proyecto remoto.
- Guardar archivos de migración en `supabase/migrations/` con formato `YYYYMMDDHHMMSS_descripcion.sql`.
- Nunca hacer cambios directos en la base de datos sin migración.