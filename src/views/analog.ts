import { localZone, zoneCity } from '../time'
import type { View } from './view'

// Geometry in viewBox units (viewBox is 200×200, centered on 0,0).
const RING_RADIUS = 96
const PIE_RADIUS = 90
const TICK_OUTER = 88
const TICK_INNER = 78
const HOUR_HAND = 48
const MINUTE_HAND = 74

const PIE_CIRCUMFERENCE = 2 * Math.PI * (PIE_RADIUS / 2)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const ticks = Array.from({ length: 12 }, (_, i) => {
  const isQuarter = i % 3 === 0
  return `<line class="${isQuarter ? 'analog__tick analog__tick--quarter' : 'analog__tick'}"
    x1="0" y1="${-TICK_OUTER}" x2="0" y2="${-TICK_INNER}" transform="rotate(${i * 30})" />`
}).join('')

export function createAnalogView(): View {
  const el = document.createElement('section')
  el.className = 'view'
  el.innerHTML = `
    <svg class="analog" viewBox="-100 -100 200 200" role="img">
      <defs>
        <g id="analog-face">
          ${ticks}
          <line class="analog__hand analog__hand--hour" x1="0" y1="0" x2="0" y2="${-HOUR_HAND}" />
          <line class="analog__hand analog__hand--minute" x1="0" y1="0" x2="0" y2="${-MINUTE_HAND}" />
        </g>
        <mask id="analog-pie-mask">
          <circle class="analog__pie-shape" r="${PIE_RADIUS / 2}" stroke="white" />
        </mask>
      </defs>
      <circle class="analog__ring" r="${RING_RADIUS}" />
      <use href="#analog-face" class="analog__face" />
      <circle class="analog__pie analog__pie-shape" r="${PIE_RADIUS / 2}" />
      <use href="#analog-face" class="analog__face analog__face--inverse" mask="url(#analog-pie-mask)" />
      <circle class="analog__pivot" r="2.5" />
    </svg>
    <p class="label">${zoneCity(localZone)}</p>
  `

  const svg = el.querySelector<SVGSVGElement>('svg')!
  const hourHand = el.querySelector<SVGLineElement>('.analog__hand--hour')!
  const minuteHand = el.querySelector<SVGLineElement>('.analog__hand--minute')!
  const pieShapes = el.querySelectorAll<SVGCircleElement>('.analog__pie-shape')

  for (const shape of pieShapes) {
    shape.setAttribute('stroke-dasharray', `0 ${PIE_CIRCUMFERENCE}`)
  }

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

      const filled = (seconds / 60) * PIE_CIRCUMFERENCE
      const dash = `${filled} ${PIE_CIRCUMFERENCE}`
      for (const shape of pieShapes) shape.setAttribute('stroke-dasharray', dash)

      const label = now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
      if (label !== lastLabel) {
        svg.setAttribute('aria-label', `Son las ${label}`)
        lastLabel = label
      }
    },
  }
}
