# SPEC 02 — Pantallas de niños: lista y perfil

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-02
> **Objetivo:** Recrear las pantallas `ninos.dc.html` (lista) y `perfil-nino.dc.html` (perfil) como las rutas `/kids` y `/kids/[id]` de la app Next.js, con estética idéntica y datos 100% estáticos.

## Scope

**In:**

- Reconstruir la lista de niños en `app/kids/page.tsx` siguiendo `references/pantallas/ninos.dc.html`: header de sección (eyebrow "GESTIÓN" + h1 "Niños"), botón "Agregar niño" con gradiente coral, buscador, divisor "SALA SOLES · 8 niños" y grid de 2 columnas con las 8 cards de niño.
- Reconstruir el perfil de niño en `app/kids/[id]/page.tsx` siguiendo `references/pantallas/perfil-nino.dc.html`: enlace "Volver a Niños", avatar con inicial, nombre + edad/sala, botón "Editar", tarjeta "Alergias y notas", tabla de datos (fecha de nacimiento, sala, ingreso), botón "Resumen del día", y card "Padres vinculados" (2 padres con badges ACTIVA/PENDIENTE y enlace "Vincular otro padre").
- Reutilizar la `Sidebar` existente en ambas vistas con la prop `active` para destacar "Niños".
- Nuevo módulo `lib/ninos-data.ts` con los tipos (`Kid`, `ParentLink`, `Room`) y el array estático con los 8 niños del template.
- Componentes `components/kid-card.tsx` y `components/kid-profile.tsx` para mapear los datos a las vistas.
- Conectar el nav "Niños" de la sidebar a `/kids`.

**Out of scope (para specs futuras):**

- Autenticación / login.
- Base de datos y CRUD real de niños.
- Pantallas `agregar-nino`, `editar-nino`, `vincular-padre`, `resumen-dia`: sus enlaces son muertos (`#`).
- Búsqueda funcional: el input "Buscar niño…" es estático.
- Acciones en "Agregar niño", "Editar", "Resumen del día", badges de padres, "Vincular otro padre": no hay lógica.
- Adaptación responsive/móvil.

## Data model

No hay persistencia. Nuevo módulo `lib/ninos-data.ts`:

```ts
export type RoomId = "soles";

export interface ParentLink {
  id: string;
  name: string;
  relation: string;   // "Mamá" | "Papá"
  status: "activa" | "pendiente"; // derives badge label/color
}

export interface Kid {
  id: string;            // slug/uid, ej. "mateo-fernandez"
  name: string;
  ageInYears: number;
  room: RoomId;
  avatar: { letter: string; bg: string; color: string };
  allergy?: string;      // badge colorido, ej. "MANÍ"
  parentCount: string;   // "2 padres vinculados"
  parents: ParentLink[];
  birthDate: string;     // "12 mar 2022"
  enrollment: string;    // "feb 2025"
  notes: { title: string; body: string };
}

export const roomName: Record<RoomId, string> = { soles: "Sala Soles" };
export const kids: Kid[] = [/* los 8 niños del template */];
```

Reutiliza la paleta de tokens ya definida en `globals.css` (spec 01), más los colores de avatar/badges por niño según el template (#A9D9E8, #F4B8CC, #B9DEC4, #F4DC8E, #C9B6E8…).

## Implementation plan

1. **`lib/ninos-data.ts`.** Tipos + `kids` con los 8 niños (nombres, edades, badges, contadores de padres, notas, fechas). Sin consumir → el build sigue.
2. **Sidebar con estado activo.** En `components/sidebar.tsx`: prop `active?: "feed" | "ninos"`, cambiar enlace "Niños" de `#` a `/kids`. Verificación: `/` muestra "Feed" activo.
3. **`components/kid-card.tsx`.** Mapear `Kid` a la card del grid: avatar circular, nombre (Fredoka), línea secundaria, badge condicional (MANÍ/LACTOSA/VINCULAR) o chevron `→`. `<Link href={`/kids/${id}`}>`.
4. **`app/kids/page.tsx`.** Layout (Sidebar `active="ninos"` + main max-w 880): header, botón "Agregar niño", buscador estático, divisor, y grid `grid-cols-2` con `kids.map(KidCard)`.
5. **`components/kid-profile.tsx`.** Mapear un `Kid` al detalle completo (encabezado, alergias, tabla, resumen del día, padres vinculados).
6. **`app/kids/[id]/page.tsx`.** Enlace "Volver a Niños", resolver `Kid` por `id`; si no existe, estado "no encontrado". Renderizar `<KidProfile kid={kid} />` con `Sidebar active="ninos"`.
7. **Verificación.** `npm run build`, `npx tsc --noEmit`, y comparación visual con Playwright de `/kids` y `/kids/mateo-fernandez` contra los screenshots de referencia (capturas en `.playwright-mcp/`).

## Acceptance criteria

- [x] `npm run build` termina sin errores y `npx tsc --noEmit` no reporta errores.
- [x] En ~1280×900, `/kids` se ve idéntico a la lista de referencia: header, botón "Agregar niño", buscador, divisor "SALA SOLES · 8 niños" y grid de 2 columnas con 8 cards.
- [x] En `/kids` y `/kids/[id]` la sidebar marca "Niños" activo; en `/` sigue activa "Feed".
- [x] El nav "Niños" de la sidebar conduce a `/kids`.
- [x] Cada card de niño conduce a `/kids/<id>`.
- [x] En `/kids/mateo-fernandez` se ve el perfil de referencia (avatar "M", nombre, alergias al maní, tabla, resumen del día, padres Lucía ACTIVA / Diego PENDIENTE + "Vincular otro padre").
- [x] Un id inexistente muestra estado "no encontrado" sin errores en consola.
- [x] Botones "Agregar niño", "Editar", "Resumen del día" y "Vincular otro padre" apuntan a `#`.
- [x] No hay errores en consola al cargar `/kids` y `/kids/mateo-fernandez`.

## Decisions

- **Sí:** Rutas en inglés `/kids` y `/kids/[id]`, `id` como slug legible. Patrón REST, coherente con el idioma del código.
- **Sí:** Datos en `lib/ninos-data.ts` tipados, separados de la vista (igual que `feed-data.ts`).
- **Sí:** Reusar `components/sidebar.tsx` con prop `active` (evita duplicación y `usePathname`).
- **Sí:** Búsqueda y acciones estáticas. Maquetado visual, igual que SPEC 01.
- **No:** Autenticación, base de datos/CRUD, búsqueda funcional, responsive. Specs futuras.

## Risks

| Riesgo | Mitigación |
| ------ | ---------- |
| Pérdida de fidelidad visual al traducir CSS a Tailwind | Comparación con screenshots vía Playwright en `.playwright-mcp/`. |
| Cards deformadas con nombres largos / badges | `min-width:0` + `flex:none` en badges, como el template; revisar en la comparación. |

## What is **not** in this spec

- Autenticación y login.
- Base de datos ni CRUD real.
- Pantallas de agregar/editar niño, vincular padre y resumen del día.
- Búsqueda funcional.
- Adaptación móvil/responsive.

Cada una de esas, si llega, va en su propia spec.
