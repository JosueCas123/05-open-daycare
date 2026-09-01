# SPEC 01 — Clonar la plantilla `feed.dc.html` como home `/`

> **Estado:** Aprobado
> **Depende de:** —
> **Fecha:** 2026-09-01
> **Objetivo:** Recrear la pantalla del template `references/pantallas/feed.dc.html` como la home `/` de la app Next.js, con estética idéntica y datos 100% estáticos.

## Scope

**In:**

- Reconstruir `app/page.tsx` como el feed siguiendo el template `feed.dc.html` (colores, tipografías, spacings, bordes, sombras e íconos idénticos).
- Sidebar (248px, sticky, full-height) en `components/sidebar.tsx`: brand OpenDayCare/Sala Soles, botón "Nueva publicación", nav Feed/Niños/Avisos/Mi cuenta (con "Feed" activo) y footer del usuario "Caro Giménez · Maestra · Soles".
- Las 3 tarjetas de post del template (LOGRO, ACTIVIDAD con placeholder de foto, ANUNCIO) con textos, contadores y badges exactos.
- Datos estáticos tipados en `lib/feed-data.ts`.
- Fuentes Fredoka y Nunito cargadas con `next/font/google`.

**Out of scope (para specs futuras):**

- Autenticación / login.
- Base de datos y CRUD real.
- Las demás vistas (`ninos`, `avisos`, `mi-cuenta`, `crear-publicacion`, `detalle-publicacion`, `foto`): sus enlaces son muertos (`#`).
- Adaptación responsive/móvil.
- Interactividad: likes, comentarios y "Editar" son estáticos.

## Data model

No hay persistencia. Nuevo módulo `lib/feed-data.ts`:

```ts
export type PostType = "logro" | "actividad" | "anuncio";

export type Avatar =
  | { kind: "letter"; letter: string; bg: string; color: string }
  | { kind: "icon"; bg: string; color: string };

export interface Post {
  id: string;
  type: PostType;
  authorName: string;
  avatar: Avatar;
  publishedAt: string; // "14:20 · publicado por vos"
  audience: string;    // "Para: familia de Mateo"
  text: string;
  photo?: { label: string };
  likes: number;
  comments: number;
}

export const currentUser = { name: "Caro Giménez", role: "Maestra · Soles", avatar: "C" };
export const sala = {
  nursery: "GUARDERÍA · SALA SOLES",
  greeting: "Buenas, Caro",
  summary: "12 niños · martes 17 jun",
  brand: { name: "OpenDayCare", room: "Sala Soles" },
};
export const posts: Post[] = [/* los 3 posts del template */];
```

Paleta del template como tokens de Tailwind v4 (`@theme inline` en `globals.css`): fondo `#F6ECDF`, tarjeta `#FFFDF9`, línea `#ECE0D0`, corales `#F2937A`/`#EE8164`/`#E0654A`/`#D9583C`/`#C5503A`/`#FBE3D8`, verde logro `#CFEBD8`/`#3E9B6C`, azul actividad `#C7E7F1`/`#2E89A6`/`#A9D9E8`/`#1F7A93`, índigo anuncio `#CCD8F4`/`#4E72C8`, y textos `#3F362E` a `#B0A290`.

## Implementation plan

1. **Fuentes y tema.** En `app/layout.tsx`: cargar `Fredoka` y `Nunito` con `next/font/google`, `lang="es"`, metadata "Feed · OpenDayCare". En `app/globals.css`: paleta en `@theme inline` (colores + variables de fuente) y estilos base (`body` con fondo `#F6ECDF`, color `#3F362E`, Nunito; scrollbar del template). Verificación: `npm run dev` renderiza y el fondo/fuente cambian.
2. **`lib/feed-data.ts`.** Crear tipos (`Post`, `PostType`, `Avatar`, `SalaInfo`) y constantes `currentUser`, `sala`, `posts` con los textos, badges, likes/comentarios y timestamps exactos del template (3/1, 5/2, 8/0). Módulo aún sin consumir → el build sigue funcionando.
3. **`components/sidebar.tsx`.** Renderizar el `<aside>` (248px, sticky, `#FFFDF9`, borde `#ECE0D0`): brand, botón "Nueva publicación" con gradiente coral, nav con íconos SVG inline y "Feed" activo (fondo `#FBE3D8`, texto `#D9583C`), footer usuario con enlace de logout. Todos los enlaces apuntan a `#`. Se alimenta de `currentUser`/`sala`.
4. **`components/post-card.tsx`.** Mapear `Post` a la tarjeta: avatar, nombre + `publishedAt`, badge de tipo con colores por variante, `audience`, texto, placeholder de foto (dashed `#DBCDBA`, fondo `#F4ECE1`) si `photo`, y fila likes/comentarios/"Editar".
5. **`app/page.tsx`.** Layout flex `min-h-screen`: `Sidebar` + `main` (max-w 760, padding del template) con header "GUARDERÍA · SALA SOLES" + h1 "Buenas, Caro" + "12 niños · martes 17 jun", card "Compartí un momento…", divider "PUBLICADO HOY", y `posts.map(PostCard)`.
6. **Verificación.** `npm run build`, `npx tsc --noEmit`, y comparación visual con Playwright de `/` contra `references/screenshots/feed.png` (captura en `.playwright-mcp/`).

## Acceptance criteria

- [ ] `npm run build` termina sin errores y `npx tsc --noEmit` no reporta errores.
- [ ] En ~1280×900, `/` se ve idéntico a `references/screenshots/feed.png`: sidebar 248px, header, 3 post cards, badges y contadores.
- [ ] Fredoka y Nunito se sirven vía `next/font` (no hay `<link>` a `fonts.googleapis.com` en el HTML renderizado).
- [ ] La sidebar muestra brand "OpenDayCare / Sala Soles", botón "Nueva publicación" con gradiente coral, nav con "Feed" destacado, y footer "Caro Giménez · Maestra · Soles" con enlace de logout.
- [ ] El feed muestra exactamente 3 posts en orden: logro "¡Usó el orinal solito…" (3 likes, 1 comentario), actividad "Pintamos con témperas…" con placeholder de foto (5 likes, 2 comentarios), anuncio "El viernes salimos al parque…" (8 likes, 0 comentarios).
- [ ] Todos los enlaces de la sidebar, cards y botones apuntan a `#`.
- [ ] No hay errores en la consola del navegador al cargar `/`.

## Decisions

- **Sí:** Tailwind utilities con los valores exactos del template en lugar de copiar inline styles. Idiomático del stack y mantenible.
- **Sí:** `next/font/google` para Fredoka y Nunito. Auto-alojadas y optimizadas, mismo aspecto.
- **Sí:** Datos en `lib/feed-data.ts` separado de la vista. Se reutiliza cuando llegue la base de datos.
- **Sí:** `Sidebar` como componente reutilizable. Lo usarán las futuras vistas.
- **Sí:** Enlaces muertos `#`. Las demás pantallas son specs futuras.
- **No:** Auth ni base de datos. El alcance es solo maquetado estático.
- **No:** Interactividad en likes/comentarios/editar. Estáticos por ahora.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| Pérdida de fidelidad visual al traducir CSS a Tailwind | Comparación con `feed.png` via Playwright en `.playwright-mcp/`; ajustar valores sueltos hasta el match. |
| Las fuentes no aplican igual en Windows (fallback) | `font-family` fallback `system-ui, sans-serif` como el template. |

## What is **not** in this spec

- Autenticación y login.
- Base de datos ni creación real de publicaciones.
- Vistas Niños, Avisos, Mi cuenta, detalle de publicación y foto.
- Adaptación móvil/responsive.

Cada una de esas, si llega, va en su propia spec.