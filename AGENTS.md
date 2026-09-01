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

## Spec Drive Develoment

- /spec Usaremos esta habilidad para crear las especificaciones 
- /spec-impl Usaremos esta skill para hacer las implementaciones.

## Reglas de codigo

- Usar codigo limpio, nombres, funciones,variables, etc. en ingles