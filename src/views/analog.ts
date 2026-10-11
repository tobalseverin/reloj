import { formatHMS, localZone, zoneCity } from '../time'
import type { View } from './view'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

export function createAnalogView(): View {
  // Geometry comes from the --clock-* tokens in tokens.css (viewBox units).
  // SVG line coordinates can't read CSS variables, so they're read once here.
  const tokens = getComputedStyle(document.documentElement)
  const token = (name: string) => Number(tokens.getPropertyValue(`--clock-${name}`))

  const TICK_OUTER = token('tick-outer')
  const TICK_INNER = token('tick-inner')
  const HOUR_HAND = token('hand-hour')
  const MINUTE_HAND = token('hand-minute')
  const SECOND_HAND = token('hand-second')
  const SECOND_TAIL = token('hand-second-tail')
  const PIVOT = token('pivot')

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const isQuarter = i % 3 === 0
    return `<line class="${isQuarter ? 'analog__tick analog__tick--quarter' : 'analog__tick'}"
      x1="0" y1="${-TICK_OUTER}" x2="0" y2="${-TICK_INNER}" transform="rotate(${i * 30})" />`
  }).join('')

  const el = document.createElement('section')
  el.className = 'view'
  el.innerHTML = `
    <svg class="analog" viewBox="-100 -100 200 200" role="img">
      ${ticks}
      <line class="analog__hand analog__hand--hour" x1="0" y1="0" x2="0" y2="${-HOUR_HAND}" />
      <line class="analog__hand analog__hand--minute" x1="0" y1="0" x2="0" y2="${-MINUTE_HAND}" />
      <line class="analog__hand analog__hand--second" x1="0" y1="${SECOND_TAIL}" x2="0" y2="${-SECOND_HAND}" />
      <circle class="analog__pivot" r="${PIVOT}" />
    </svg>
    <div class="analog__caption">
      <p class="analog__digital" aria-hidden="true"></p>
      <p class="label">${zoneCity(localZone)}</p>
    </div>
  `

  const svg = el.querySelector<SVGSVGElement>('svg')!
  const hourHand = el.querySelector<SVGLineElement>('.analog__hand--hour')!
  const minuteHand = el.querySelector<SVGLineElement>('.analog__hand--minute')!
  const secondHand = el.querySelector<SVGLineElement>('.analog__hand--second')!
  const digital = el.querySelector<HTMLParagraphElement>('.analog__digital')!

  let lastLabel = ''

  return {
    id: 'analog',
    label: 'Analógico',
    el,
    update(now) {
      const fraction = reducedMotion.matches ? 0 : now.getMilliseconds() / 1000
      const seconds = now.getSeconds() + fraction
      const minutes = now.getMinutes() + seconds / 60
      const hours = (now.getHours() % 12) + minutes / 60

      hourHand.setAttribute('transform', `rotate(${hours * 30})`)
      minuteHand.setAttribute('transform', `rotate(${minutes * 6})`)
      secondHand.setAttribute('transform', `rotate(${seconds * 6})`)

      const hms = formatHMS(now)
      if (digital.textContent !== hms) digital.textContent = hms

      const label = now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
      if (label !== lastLabel) {
        svg.setAttribute('aria-label', `Son las ${label}`)
        lastLabel = label
      }
    },
  }
}
