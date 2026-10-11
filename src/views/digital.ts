import { formatHMS, pad } from '../time'
import type { View } from './view'

export function createDigitalView(): View {
  const el = document.createElement('section')
  el.className = 'view'
  el.innerHTML = `
    <p class="digital" role="img">
      <span class="digital__hms" aria-hidden="true"></span><span class="digital__ms" aria-hidden="true"></span>
    </p>
  `
  const root = el.querySelector<HTMLParagraphElement>('.digital')!
  const hms = el.querySelector<HTMLSpanElement>('.digital__hms')!
  const ms = el.querySelector<HTMLSpanElement>('.digital__ms')!

  let lastHms = ''

  return {
    id: 'digital',
    label: 'Digital',
    el,
    update(now) {
      const nextHms = formatHMS(now)
      if (nextHms !== lastHms) {
        hms.textContent = nextHms
        root.setAttribute('aria-label', nextHms.slice(0, 5))
        lastHms = nextHms
      }
      ms.textContent = `.${pad(now.getMilliseconds(), 3)}`
    },
  }
}
