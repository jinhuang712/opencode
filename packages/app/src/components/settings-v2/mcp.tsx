import { Component, For, Show, createMemo } from "solid-js"
import { Switch } from "@opencode-ai/ui/v2/switch-v2"
import { useLanguage } from "@/context/language"
import { useMcpToggle } from "@/context/mcp"
import { useSync } from "@/context/sync"
import { SettingsListV2 } from "./parts/list"
import { SettingsRowV2 } from "./parts/row"
import "./settings-v2.css"

export const SettingsMcpV2: Component = () => {
  const language = useLanguage()
  const sync = useSync()
  const toggle = useMcpToggle()

  const names = createMemo(() => Object.keys(sync().data.mcp ?? {}).sort((a, b) => a.localeCompare(b)))
  const status = (name: string) => sync().data.mcp?.[name]?.status
  const error = (name: string) => {
    const item = sync().data.mcp?.[name]
    if (item?.status === "failed" || item?.status === "needs_client_registration") return item.error
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
