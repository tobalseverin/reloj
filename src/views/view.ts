export type ViewId = 'analog' | 'digital' | 'zones'

export interface View {
  id: ViewId
  label: string
  el: HTMLElement
  update(now: Date): void
}
