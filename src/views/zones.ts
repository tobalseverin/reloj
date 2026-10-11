import { load, save } from '../storage'
import { allZones, formatDiff, localZone, zoneCity, zoneOffset } from '../time'
import type { View } from './view'

interface Row {
  zone: string
  el: HTMLLIElement
  time: HTMLElement
  diff: HTMLElement
  format: Intl.DateTimeFormat
  dayFormat: Intl.DateTimeFormat
}

const zoneSet = new Set(allZones)

function loadZones(): string[] {
  const saved = load<unknown>('zones', [])
  if (!Array.isArray(saved)) return []
  return saved.filter((z): z is string => typeof z === 'string' && zoneSet.has(z) && z !== localZone)
}

export function createZonesView(): View {
  const el = document.createElement('section')
  el.className = 'view zones'
  el.innerHTML = `
    <form class="zones__add">
      <label class="label" for="zones-input">Agregar zona</label>
      <input id="zones-input" class="zones__input" list="zones-list" autocomplete="off"
        placeholder="Tokyo, Madrid, New York…" />
      <datalist id="zones-list">
        ${allZones.map((z) => `<option value="${z}">${zoneCity(z)}</option>`).join('')}
      </datalist>
    </form>
    <ul class="zones__list"></ul>
  `
  const form = el.querySelector<HTMLFormElement>('.zones__add')!
  const input = el.querySelector<HTMLInputElement>('.zones__input')!
  const list = el.querySelector<HTMLUListElement>('.zones__list')!

  const localDay = new Intl.DateTimeFormat('en-CA', { timeZone: localZone, dateStyle: 'short' })
  let zones = loadZones()
  let rows: Row[] = []
  let lastSecond = -1

  function createRow(zone: string, isLocal: boolean): Row {
    const li = document.createElement('li')
    li.className = 'zones__row'
    li.innerHTML = `
      <span class="zones__place">
        <span class="zones__city"></span>
        <span class="label zones__meta"></span>
      </span>
      <span class="label zones__diff"></span>
      <span class="zones__time"></span>
      ${isLocal ? '<span class="zones__remove" aria-hidden="true"></span>' : '<button type="button" class="zones__remove">×</button>'}
    `
    li.querySelector('.zones__city')!.textContent = zoneCity(zone)
    li.querySelector('.zones__meta')!.textContent = isLocal ? 'Local' : zone.split('/')[0].replaceAll('_', ' ')
    const button = li.querySelector('button')
    if (button) {
      button.setAttribute('aria-label', `Quitar ${zoneCity(zone)}`)
      button.addEventListener('click', () => removeZone(zone))
    }
    return {
      zone,
      el: li,
      time: li.querySelector('.zones__time')!,
      diff: li.querySelector('.zones__diff')!,
      format: new Intl.DateTimeFormat('es', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }),
      dayFormat: new Intl.DateTimeFormat('en-CA', { timeZone: zone, dateStyle: 'short' }),
    }
  }

  function render() {
    rows = [createRow(localZone, true), ...zones.map((z) => createRow(z, false))]
    list.replaceChildren(...rows.map((row) => row.el))
    lastSecond = -1
    update(new Date())
  }

  function addZone(zone: string) {
    if (!zoneSet.has(zone) || zone === localZone || zones.includes(zone)) return
    zones = [...zones, zone]
    save('zones', zones)
    render()
  }

  function removeZone(zone: string) {
    zones = zones.filter((z) => z !== zone)
    save('zones', zones)
    render()
  }

  // Accept the exact IANA id or a unique city name typed by hand.
  function resolve(value: string): string | undefined {
    const query = value.trim().toLowerCase()
    if (!query) return undefined
    const exact = allZones.find((z) => z.toLowerCase() === query)
    if (exact) return exact
    const byCity = allZones.filter((z) => zoneCity(z).toLowerCase() === query)
    return byCity.length === 1 ? byCity[0] : undefined
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const zone = resolve(input.value)
    if (zone) {
      addZone(zone)
      input.value = ''
    }
  })
  // Picking an option from the datalist fires `input` with the full zone id.
  input.addEventListener('input', () => {
    if (zoneSet.has(input.value)) {
      addZone(input.value)
      input.value = ''
    }
  })

  function update(now: Date) {
    const second = Math.floor(now.getTime() / 1000)
    if (second === lastSecond) return
    lastSecond = second

    const localOffset = zoneOffset(localZone, now)
    const today = localDay.format(now)
    for (const row of rows) {
      const day = row.dayFormat.format(now)
      const dayMark = day === today ? '' : day > today ? ' · mañana' : ' · ayer'
      row.time.textContent = row.format.format(now)
      if (row.zone !== localZone) {
        row.diff.textContent = formatDiff(zoneOffset(row.zone, now) - localOffset) + dayMark
      }
    }
  }

  render()

  return { id: 'zones', label: 'Zonas', el, update }
}
