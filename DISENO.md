# Diseño

> PROPUESTA: sistema nuevo y propio de este proyecto. Hay que validarlo.

## Carácter
- **Mínimo:** solo lo que da la hora. No hay decoración, sombras ni degradados.
- **Sobrio:** dos colores, tinta y papel. Nada más.
- **Preciso:** cifras tabulares, líneas finas y alineación exacta.
- **Silencioso:** la interfaz (el selector de vista, el color y la pantalla completa) queda en segundo plano, chica y en los bordes.

## Tokens
Color (los dos únicos colores del sistema):
- `--color-paper: #ffffff` es el fondo.
- `--color-ink: #000000` se usa en las líneas y el texto.
- Tema oscuro (`data-theme="dark"`): se invierten, `--color-paper: #000000` y `--color-ink: #ffffff`. Por defecto sigue al sistema (`prefers-color-scheme`); el switch guarda la elección.
- Duotono: a partir de un tono elegido (H), en tema claro `--color-paper` pasa a `hsl(H 70% 92%)` y `--color-ink` a `hsl(H 70% 14%)`. En tema oscuro se invierten. Se verifica que el contraste sea AA o mayor.

Tipografía (del sistema, sin fuentes externas):
- `--font-sans: system-ui, -apple-system, "Helvetica Neue", sans-serif`
- `--font-mono: ui-monospace, "SF Mono", Menlo, monospace`
- `--text-ui: 0.75rem` para la interfaz, en mayúsculas y con `--tracking-ui: 0.08em`.
- `--tracking-display: -0.02em` para la vista digital.
- `--text-body: 1rem`
- `--text-display: clamp(3rem, 14vw, 12rem)` para la vista digital.
- Todos los números llevan `font-variant-numeric: tabular-nums`.

Espaciado: `--space-1: 4px` · `--space-2: 8px` · `--space-3: 16px` · `--space-4: 32px` · `--space-5: 64px`

Líneas: `--stroke-thin: 1px` · `--stroke-bold: 2px`

Radios: `--radius: 0`. No hay esquinas redondeadas. Excepción: los controles circulares (switch de tema y color) usan `--radius-round: 50%`. El reloj no tiene aro: lo definen las marcas.

Reloj (en unidades del viewBox de 200 × 200, se escalan con el reloj):
- Largos: `--clock-tick-outer: 88` · `--clock-tick-inner: 78` · `--clock-hand-hour: 48` · `--clock-hand-minute: 74` · `--clock-hand-second: 84` · `--clock-hand-second-tail: 14` · `--clock-pivot: 2.5`
- Grosores: `--clock-stroke-tick: 1` · `--clock-stroke-tick-quarter: 3` · `--clock-stroke-hour: 4` · `--clock-stroke-minute: 2` · `--clock-stroke-second: 0.75` · `--clock-stroke-pivot: 1`
- En Penpot son `clock.*`; los grosores de cada tablero se derivan con `clock.<ancho>.stroke.*` = token base × `clock.scale.<ancho>` (tamaño del reloj / 200).

Controles: `--control-size: 24px`, borde `--stroke-bold`. El switch de tema y el color comparten tamaño y borde.

## Componentes base
- `ViewSwitcher`: tres etiquetas de texto (ANALÓGICO / DIGITAL / ZONAS). La activa va subrayada.
- `AnalogClock`: un SVG sin aro, con 12 marcas, las agujas de horas y minutos, y un segundero fino. Debajo, la hora en números (`HH:MM:SS`) y la ciudad.
- `DigitalClock`: un bloque de texto en monoespaciada.
- `ZoneRow`: la ciudad, la hora, la diferencia y el botón ×.
- `ZonePicker`: un input con autocompletado.
- `ThemeSwitch`: un ícono de círculo medio lleno, a la izquierda del color.
- `ColorPicker`: un `input type="color"` nativo dentro de un círculo de 24 px con borde de 2 px, igual al switch.
- `FullscreenButton`

## Reglas
- Siempre: solo `--color-ink` y `--color-paper`. Las opacidades valen para los estados, nunca para un color nuevo.
- Siempre: mobile primero, foco visible con un contorno de 1px de tinta y todo navegable con el teclado.
- Siempre: las animaciones respetan `prefers-reduced-motion`; en ese caso, los segundos avanzan a saltos.
- Nunca: sombras, degradados, íconos decorativos ni fuentes externas.
- Nunca: valores sueltos en los componentes. Todo sale de `tokens.css`.

## Referencias
- Dieter Rams y Braun (relojes ET66 y AB1)
- Reloj de estación de los ferrocarriles suizos, por su claridad
- Impresión en duotono y risografía, para el modo de color
