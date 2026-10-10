import { load, save } from '../storage'

// Duotone recipe from DISENO.md: same hue, light paper and dark ink (contrast well above AA).
const PAPER = { s: 70, l: 92 }
const INK = { s: 70, l: 14 }

function hexToHue(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b)
  const d = max - Math.min(r, g, b)
  if (d === 0) return 0
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return Math.round((h * 60 + 360) % 360)
}

function hslToHex(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(c * 255).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function apply(hue: number | null) {
  const root = document.documentElement.style
  if (hue === null) {
    root.removeProperty('--color-paper')
    root.removeProperty('--color-ink')
  } else {
    root.setProperty('--color-paper', `hsl(${hue} ${PAPER.s}% ${PAPER.l}%)`)
    root.setProperty('--color-ink', `hsl(${hue} ${INK.s}% ${INK.l}%)`)
  }
}

export function createColorControl(): HTMLElement {
  const el = document.createElement('div')
  el.className = 'controls__group'
  el.innerHTML = `
    <label class="color">
      <span class="visually-hidden">Color del duotono</span>
      <input type="color" class="color__input" />
    </label>
    <button type="button" class="label controls__button">B/N</button>
  `
  const input = el.querySelector<HTMLInputElement>('.color__input')!
  const reset = el.querySelector<HTMLButtonElement>('button')!

  function set(hue: number | null) {
    apply(hue)
    save('hue', hue)
    reset.setAttribute('aria-pressed', String(hue === null))
    input.value = hue === null ? '#000000' : hslToHex(hue, 100, 50)
  }

  input.addEventListener('input', () => set(hexToHue(input.value)))
  reset.addEventListener('click', () => set(null))

  const saved = load<unknown>('hue', null)
  set(typeof saved === 'number' ? saved : null)
  return el
}
