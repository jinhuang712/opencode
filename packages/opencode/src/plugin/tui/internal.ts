export type InternalTuiPlugin = { id: string; enabled?: boolean }

export function internalTuiPlugins(_flags: unknown): InternalTuiPlugin[] {
  return []
}
