export function titlecase(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}
export function time(input: number): string {
  return new Date(input).toLocaleTimeString()
}
export function datetime(input: number): string {
  return new Date(input).toLocaleString()
}
export function todayTimeOrDateTime(input: number): string {
  return time(input)
}
export function number(num: number): string {
  return String(num)
}
export function duration(input: number): string {
  return `${input}ms`
}
export function truncate(str: string, len: number): string {
  return str.length <= len ? str : str.slice(0, len - 1) + "…"
}
export function truncateLeft(str: string, len: number): string {
  return str.length <= len ? str : "…" + str.slice(-(len - 1))
}
export function truncateMiddle(str: string, maxLength = 35): string {
  return truncate(str, maxLength)
}
export const Locale = {
  titlecase,
  time,
  datetime,
  todayTimeOrDateTime,
  number,
  duration,
  truncate,
  truncateLeft,
  truncateMiddle,
}
