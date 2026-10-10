# Arquitectura

## Stack
- Vite + TypeScript estricto, sin framework (DOM y SVG directos).
- Estilos: CSS plano con los tokens en `src/styles/tokens.css`.
- pnpm.

## Estructura de carpetas
```
src/
  main.ts            # arranque, switcher, loop rAF
  time.ts            # utilidades de hora/zonas (Intl)
  views/
    analog.ts
    digital.ts
    zones.ts
  ui/
    color.ts         # duotono
    fullscreen.ts
  storage.ts         # localStorage tipado
  styles/
    tokens.css
    base.css
index.html
```

## Datos
No hay backend. La hora sale de `Date` en el navegador y las zonas de `Intl.supportedValuesOf('timeZone')`.
En `localStorage` se guardan tres claves:
- `reloj.zones`: `string[]` con las zonas IANA del comparador.
- `reloj.hue`: `number | null`. Si es `null`, la pieza va en blanco y negro.
- `reloj.view`: la última vista abierta.

## Auth y permisos
No hay.

## Variables de entorno
No hay.

## Deploy
- Destino: servidor propio **wonki** (`ssh cs@wonki.p113.io`), usuario de Vesta **cs**.
- Dominio: **reloj.wrdowrdo.art** (A CONFIRMAR, junto con si ya existe en Vesta).
- Es un sitio estático, así que no hace falta PM2. Se sube `dist/` con rsync a `/home/cs/web/reloj.wrdowrdo.art/public_html/`.
- Antes del primer deploy se revisan las convenciones de los proyectos que ya existen bajo `cs` en wonki.
- Para verificar: el `curl -I` devuelve 200, el sitio carga en el navegador y los archivos quedan a nombre de `cs`.

## Decisiones
- **Vite sin framework:** son tres vistas y un loop. React o Astro suman peso y no aportan nada acá.
- **Un solo loop rAF:** todas las vistas leen el mismo `now`, así no hay desfases ni varios timers.
- **SVG para el analógico:** es nítido en cualquier tamaño y se puede estilar con los tokens. Canvas habría sido más fácil de animar, pero no aprovecha el CSS.
- **localStorage para guardar:** no hay usuarios, así que un backend sobra. La contra es que las zonas no se sincronizan entre dispositivos.
- **Una sola URL:** el usuario no pidió una ruta por vista. Se recuerda la última vista abierta.
