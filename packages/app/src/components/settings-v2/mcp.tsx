import { type Accessor, Component, For, Show, createMemo } from "solid-js"
import { Switch } from "@opencode-ai/ui/v2/switch-v2"
import { useLanguage } from "@/context/language"
import { useServerSync } from "@/context/server-sync"
import { SettingsListV2 } from "./parts/list"
import { SettingsRowV2 } from "./parts/row"
import "./settings-v2.css"

export const SettingsMcpV2: Component<{ directory: Accessor<string | undefined> }> = (props) => {
  const language = useLanguage()
  const serverSync = useServerSync()
  const mcpData = createMemo(() => {
    const dir = props.directory()
    if (!dir) return {}
    const child = serverSync().peek(dir)
    return child?.[0].mcp ?? {}
  })

  const toggle = {
    get isPending() {
      return false
    },
    variables: undefined as string | undefined,
    mutate: (name: string) => {
      const dir = props.directory()
      if (!dir) return
      void serverSync().mcp.toggle(dir, name)
    },
  }

  const names = createMemo(() => Object.keys(mcpData()).sort((a, b) => a.localeCompare(b)))
  const status = (name: string) => mcpData()?.[name]?.status
  const error = (name: string) => {
    const item = mcpData()?.[name]
    if (item?.status === "failed" || item?.status === "needs_client_registration") return (item as { error?: string }).error
    return undefined
  }

  return (
    <>
      <div class="settings-v2-tab-header">
        <h2 class="settings-v2-tab-title">{language.t("settings.tab.mcp")}</h2>
      </div>
      <div class="settings-v2-tab-body">
        <div class="settings-v2-section">
          <Show
            when={names().length > 0}
            fallback={
              <SettingsListV2>
                <div class="settings-v2-provider-empty">{language.t("dialog.mcp.empty")}</div>
              </SettingsListV2>
            }
          >
            <SettingsListV2>
              <For each={names()}>
                {(name) => {
                  const enabled = () => status(name) === "connected"
                  const dot = () => status(name)
                  return (
                    <SettingsRowV2
                      title={
                        <span class="flex items-center gap-2">
                          <span
                            classList={{
                              "size-1.5 rounded-full shrink-0": true,
                              "bg-icon-success-base": dot() === "connected",
                              "bg-icon-critical-base": dot() === "failed",
                              "bg-border-weak-base": dot() === "disabled",
                              "bg-icon-warning-base": dot() === "needs_auth" || dot() === "needs_client_registration",
                            }}
                          />
                          <span class="settings-v2-provider-name">{name}</span>
                        </span>
                      }
                      description={
                        <Show when={error(name)} fallback={language.t(`mcp.status.${dot() as "connected"}` as never) ?? dot()}>
                          {(msg) => <span>{msg()}</span>}
                        </Show>
                      }
                    >
                      <Switch
                        checked={enabled()}
                        disabled={toggle.isPending && toggle.variables === name}
                        onChange={() => {
                          if (toggle.isPending) return
                          toggle.mutate(name)
                        }}
                      />
                    </SettingsRowV2>
                  )
                }}
              </For>
            </SettingsListV2>
          </Show>
        </div>
      </div>
    </>
  )
}
