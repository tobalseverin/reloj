import './styles/tokens.css'
import './styles/base.css'
import { load, save } from './storage'
import { createColorControl } from './ui/color'
import { createFullscreenControl } from './ui/fullscreen'
import { createAnalogView } from './views/analog'
import { createDigitalView } from './views/digital'
import { createZonesView } from './views/zones'
import type { View, ViewId } from './views/view'

const views: View[] = [createAnalogView(), createDigitalView(), createZonesView()]

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <nav class="switcher" aria-label="Vistas"></nav>
  <main class="stage"></main>
  <footer class="controls"></footer>
`
const nav = app.querySelector<HTMLElement>('.switcher')!
const stage = app.querySelector<HTMLElement>('.stage')!
const controls = app.querySelector<HTMLElement>('.controls')!

controls.append(createColorControl())
const fullscreen = createFullscreenControl()
if (fullscreen) controls.append(fullscreen)

const buttons = views.map((view) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'label switcher__item'
  button.textContent = view.label
  button.addEventListener('click', () => show(view.id))
  nav.append(button)
  return button
})

let current: View = views[0]

function show(id: ViewId) {
  current = views.find((view) => view.id === id) ?? views[0]
  stage.replaceChildren(current.el)
  buttons.forEach((button, i) => {
    button.setAttribute('aria-pressed', String(views[i] === current))
  })
  current.update(new Date())
  save('view', current.id)
}

show(load<ViewId>('view', 'analog'))

// Single time loop: only the visible view is updated.
function tick() {
  current.update(new Date())
  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
