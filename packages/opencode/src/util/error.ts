import { isRecord } from "./record"

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message || error.name
  if (isRecord(error) && typeof error.message === "string") return error.message
  if (isRecord(error) && isRecord(error.data) && typeof error.data.message === "string") return error.data.message
  const t = String(error)
  return t && t !== "[object Object]" ? t : "unknown error"
}

export function errorData(error: unknown): Record<string, unknown> {
  if (error instanceof Error) return { type: error.name, message: errorMessage(error), stack: error.stack }
  if (isRecord(error)) return error
  return { type: typeof error, message: errorMessage(error) }
}

export function errorFormat(error: unknown): string {
  if (error instanceof Error) return error.stack ?? `${error.name}: ${error.message}`
  try {
    return JSON.stringify(error, null, 2)
  } catch {
    return String(error)
  }
}

export function cliErrorMessage(input: unknown): string | undefined {
  if (input instanceof Error) return input.message
  if (isRecord(input) && typeof input.message === "string") return input.message
  return undefined
}
