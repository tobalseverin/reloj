export const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone

const pad = (n: number, width = 2) => String(n).padStart(width, '0')

export function formatHMS(now: Date): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}
