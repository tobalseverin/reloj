export const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone

/** "America/Argentina/Buenos_Aires" → "Buenos Aires" */
export function zoneCity(zone: string): string {
  return (zone.split('/').pop() ?? zone).replaceAll('_', ' ')
}

export const pad = (n: number, width = 2) => String(n).padStart(width, '0')

export const allZones: string[] = Intl.supportedValuesOf('timeZone')

/** Offset from UTC in minutes for a zone at a given instant. */
export function zoneOffset(zone: string, now: Date): number {
  const name = new Intl.DateTimeFormat('en', { timeZone: zone, timeZoneName: 'longOffset' })
    .formatToParts(now)
    .find((part) => part.type === 'timeZoneName')?.value
  const match = name?.match(/GMT([+-])(\d{2}):(\d{2})/)
  if (!match) return 0
  const sign = match[1] === '-' ? -1 : 1
  return sign * (Number(match[2]) * 60 + Number(match[3]))
}

/** Difference in minutes as "+5 h", "−3 h 30", or "=". */
export function formatDiff(minutes: number): string {
  if (minutes === 0) return '='
  const sign = minutes > 0 ? '+' : '−'
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return m === 0 ? `${sign}${h} h` : `${sign}${h} h ${pad(m)}`
}

export function formatHMS(now: Date): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}
