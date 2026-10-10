export type ViewId = 'analog' | 'digital' | 'zones'

export interface View {
  id: ViewId
  label: string
  el: HTMLElement
  update(now: Date): void
}

/** Placeholder view used until each view is built in its own stage. */
export function placeholderView(id: ViewId, label: string, note: string, format: (now: Date) => string): View {
  const el = document.createElement('section')
  el.className = 'view'
  el.innerHTML = `
    <p class="view__sample"></p>
    <p class="label view__note">${note}</p>
  `
  const sample = el.querySelector<HTMLParagraphElement>('.view__sample')!
  return {
    id,
    label,
    el,
    update(now) {
      sample.textContent = format(now)
    },
  }
}
