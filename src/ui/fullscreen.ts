export function createFullscreenControl(): HTMLElement | null {
  if (!document.fullscreenEnabled) return null // e.g. Safari on iPhone

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'label controls__button'

  const sync = () => {
    const active = document.fullscreenElement !== null
    button.textContent = active ? 'Salir' : 'Pantalla completa'
    button.setAttribute('aria-pressed', String(active))
  }

  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen()
  }

  button.addEventListener('click', toggle)
  document.addEventListener('fullscreenchange', sync)
  document.addEventListener('keydown', (event) => {
    const typing = event.target instanceof HTMLInputElement
    if (event.key.toLowerCase() === 'f' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) toggle()
  })

  button.setAttribute('aria-keyshortcuts', 'F')
  sync()
  return button
}
