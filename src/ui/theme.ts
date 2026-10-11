import { load, save } from '../storage'

export type Theme = 'light' | 'dark'

const system = window.matchMedia('(prefers-color-scheme: dark)')

/** Saved choice wins; otherwise follow the operating system. */
export function currentTheme(): Theme {
  const saved = load<unknown>('theme', null)
  if (saved === 'light' || saved === 'dark') return saved
  return system.matches ? 'dark' : 'light'
}

function apply() {
  document.documentElement.dataset.theme = currentTheme()
  document.dispatchEvent(new Event('themechange'))
}

export function createThemeControl(): HTMLElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'theme'
  button.innerHTML = `
    <svg class="theme__icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" />
      <path d="M12 1a11 11 0 0 1 0 22z" />
    </svg>
  `

  const sync = () => {
    const theme = currentTheme()
    button.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro')
  }

  button.addEventListener('click', () => {
    save('theme', currentTheme() === 'dark' ? 'light' : 'dark')
    apply()
  })
  system.addEventListener('change', apply)
  document.addEventListener('themechange', sync)

  apply()
  return button
}
