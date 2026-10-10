export const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone

/** "America/Argentina/Buenos_Aires" → "Buenos Aires" */
export function zoneCity(zone: string): string {
  return (zone.split('/').pop() ?? zone).replaceAll('_', ' ')
}

const pad = (n: number, width = 2) => String(n).padStart(width, '0')

export function formatHMS(now: Date): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}
