// @ts-nocheck
import { Context, Effect, Layer } from "effect"
import { LayerNode } from "@opencode-ai/core/effect/layer-node"
import { makeRuntime } from "@opencode-ai/core/effect/runtime"
import { AppNodeBuilder } from "@opencode-ai/core/effect/app-node-builder"

export type Info = Record<string, unknown>
export type Resolved = Info & {
  plugin?: unknown[]
  attention?: unknown
  keybinds?: unknown
  leader_timeout?: number
  mouse?: boolean
}
export type HostMetadata = {
  plugin_origins?: unknown[]
}

export interface Interface {
  readonly get: () => Effect.Effect<Resolved>
  readonly pluginOrigins: () => Effect.Effect<unknown[]>
  readonly waitForDependencies: () => Effect.Effect<void>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/TuiConfig") {}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const get = () => Effect.succeed({} as Resolved)
    const pluginOrigins = () => Effect.succeed([] as unknown[])
    const waitForDependencies = () => Effect.void
    return Service.of({ get, pluginOrigins, waitForDependencies })
  }),
)

export const node = LayerNode.make({ service: Service, layer, deps: [] })

const { runPromise } = makeRuntime(Service, AppNodeBuilder.build(node))

export async function waitForDependencies() {
  await runPromise((svc) => svc.waitForDependencies())
}

export async function get(): Promise<Resolved> {
  return runPromise((svc) => svc.get())
}

export async function pluginOrigins(): Promise<unknown[]> {
  return runPromise((svc) => svc.pluginOrigins())
}

// stub TuiConfig namespace for callers that used `TuiConfig.Info` etc.
export const TuiConfig = {
  Info: {} as Info,
  resolve: (input: Info) => input as Resolved,
}
