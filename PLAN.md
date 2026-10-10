# Reloj

## Qué es
Un reloj web con tres vistas: analógica, digital con milésimas y comparador de zonas horarias.
Es una pieza de portfolio personal: mínima, en blanco y negro, con un duotono opcional.

## Primera versión
Lo que tiene que funcionar para considerarla lista:
- [ ] Vista analógica: muestra la hora local (zona del navegador) en un reloj redondo con agujas.
- [ ] Vista digital: solo números, `HH:MM:SS.mmm`, con las milésimas en vivo.
- [ ] Vista comparador: elegir varias zonas horarias y verlas lado a lado, con su diferencia respecto de la hora local.
- [ ] Las zonas del comparador se guardan entre visitas.
- [ ] Pantalla completa en cualquier vista.
- [ ] Selector de color: convierte el blanco y negro en un duotono del color elegido.

## Fuera de alcance
- Alarmas, cronómetro y temporizador.
- Cuentas de usuario y backend.
- Una URL propia para cada vista.
- Geolocalización: la ubicación sale de la zona horaria del navegador.

## Etapas
Cada etapa termina en algo que se puede ver y probar.

### Etapa 1. Esqueleto navegable ✅
- [x] Proyecto Vite + TypeScript con el archivo de tokens.
- [x] Selector de las tres vistas, cada una con contenido de ejemplo.
- [x] Un único loop de tiempo (`requestAnimationFrame`) que alimenta las vistas.
Listo cuando: se cambia de vista en el teléfono y en el escritorio, y `pnpm build` genera un `dist/` estático que se puede subir.

### Etapa 2. Vista analógica ✅
- [x] Reloj en SVG: aro, marcas de las horas, agujas de horas, minutos y un segundero fino.
- [x] Nombre de la zona local debajo.
Listo cuando: marca la hora correcta, se mueve con fluidez y se ve nítido en cualquier tamaño.

### Etapa 3. Vista digital ✅
- [x] `HH:MM:SS.mmm` con cifras tabulares, sin saltos de ancho.
- [x] Tamaño fluido según el viewport.
Listo cuando: las milésimas corren sin que el texto tiemble, en el teléfono y en el escritorio.

### Etapa 4. Comparador
- [ ] Buscador de zonas (`Intl.supportedValuesOf('timeZone')`).
- [ ] Una fila por zona con la ciudad, la hora y la diferencia respecto de la hora local (por ejemplo `+5 h`), y un botón para quitarla.
- [ ] Persistencia en `localStorage`.
Listo cuando: agrego tres zonas, recargo la página y siguen ahí, con la hora correcta.

### Etapa 5. Duotono, pantalla completa y deploy
- [ ] Selector de color que recalcula `--color-ink` y `--color-paper` y se guarda.
- [ ] Botón de pantalla completa (Fullscreen API) y su atajo `F`.
- [ ] Deploy a wonki.
Listo cuando: el sitio está en línea en el dominio final, con el duotono y la pantalla completa funcionando.
