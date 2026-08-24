import { type Accessor, Component, For, Show, createMemo } from "solid-js"
import { useLanguage } from "@/context/language"
import { useServerSync } from "@/context/server-sync"
import { SettingsListV2 } from "./parts/list"
import { SettingsRowV2 } from "./parts/row"
import "./settings-v2.css"

export const SettingsLspV2: Component<{ directory: Accessor<string | undefined> }> = (props) => {
  const language = useLanguage()
  const serverSync = useServerSync()
  const items = createMemo(() => {
    const dir = props.directory()
    if (!dir) return []
    const child = serverSync().peek(dir)
    return child?.[0].lsp ?? []
  })

  return (
    <>
      <div class="settings-v2-tab-header">
        <h2 class="settings-v2-tab-title">{language.t("settings.tab.lsp")}</h2>
      </div>
      <div class="settings-v2-tab-body">
        <div class="settings-v2-section">
          <Show
            when={items().length > 0}
            fallback={
              <SettingsListV2>
                <div class="settings-v2-provider-empty">{language.t("dialog.lsp.empty")}</div>
              </SettingsListV2>
            }
          >
            <SettingsListV2>
              <For each={items()}>
                {(item) => (
                  <SettingsRowV2
                    title={
                      <span class="flex items-center gap-2">
                        <span
                          classList={{
                            "size-1.5 rounded-full shrink-0": true,
                            "bg-icon-success-base": item.status === "connected",
                            "bg-icon-critical-base": item.status === "error",
                            "bg-border-weak-base": item.status !== "connected" && item.status !== "error",
                          }}
                        />
                        <span class="settings-v2-provider-name">{item.name || item.id}</span>
                      </span>
                    }
                    description={item.status}
                  >
                    <span class="text-12-regular text-text-weak">{item.status}</span>
                  </SettingsRowV2>
                )}
              </For>
            </SettingsListV2>
          </Show>
        </div>
      </div>
    </>
  )
}
