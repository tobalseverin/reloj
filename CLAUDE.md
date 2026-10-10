# Reloj — reglas del proyecto

Leé primero `PLAN.md`, `DISENO.md` y `ARQUITECTURA.md`. Son la fuente de verdad.

## Comandos
- `pnpm install`
- `pnpm dev`: servidor local en http://localhost:5173
- `pnpm build`: chequeo de tipos más el build estático en `dist/`
- `pnpm typecheck`
- No hay tests ni linter todavía.

## Reglas propias
- Solo existen dos colores: `--color-ink` y `--color-paper`. No se agrega ningún otro.
- Todo valor visual sale de `src/styles/tokens.css`.
- No hay framework: DOM y SVG directos, en TypeScript estricto.
- Un único loop `requestAnimationFrame` en `main.ts`. Las vistas reciben `now` y no crean timers propios.
- Lo que se guarda va en `localStorage` con el prefijo `reloj.` y pasa por `src/storage.ts`.
- Se respeta `prefers-reduced-motion`.
- No hay backend, dependencias de runtime ni fuentes externas.
- Deploy: estático a wonki, usuario de Vesta `cs`, dominio `reloj.wrdo.art`. El dominio todavía no existe en Vesta: crearlo requiere la confirmación del usuario.
