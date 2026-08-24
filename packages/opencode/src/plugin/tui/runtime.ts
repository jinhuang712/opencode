// @ts-nocheck
export async function init(_input: unknown): Promise<void> {}
export function list(): unknown[] {
  return []
}
export async function activatePlugin(_id: string): Promise<boolean> {
  return false
}
export async function deactivatePlugin(_id: string): Promise<boolean> {
  return false
}
export async function addPlugin(_spec: string): Promise<boolean> {
  return false
}
export async function installPlugin(_spec: string, _options?: unknown): Promise<unknown> {
  return { ok: false, message: "tui removed" }
}
export async function dispose(): Promise<void> {}
export function createLegacyTuiPluginHost(): unknown {
  return { start: init, dispose }
}
export * as TuiPluginRuntime from "./runtime"
