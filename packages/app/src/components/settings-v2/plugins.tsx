import { type Accessor, Component, For, Show, createMemo } from "solid-js"
import { useLanguage } from "@/context/language"
import { useServerSync } from "@/context/server-sync"
import { SettingsListV2 } from "./parts/list"
import { SettingsRowV2 } from "./parts/row"
import "./settings-v2.css"

export const SettingsPluginsV2: Component<{ directory: Accessor<string | undefined> }> = (props) => {
  const language = useLanguage()
  const serverSync = useServerSync()
  const plugins = createMemo(() => {
    const dir = props.directory()
    const config = dir ? (serverSync().peek(dir)?.[0].config ?? serverSync().data.config) : serverSync().data.config
    return (config.plugin ?? []).map((item) => (typeof item === "string" ? item : item[0]))
  })

  return (
    <>
      <div class="settings-v2-tab-header">
        <h2 class="settings-v2-tab-title">{language.t("settings.tab.plugins")}</h2>
      </div>
      <div class="settings-v2-tab-body">
        <div class="settings-v2-section">
          <Show
            when={plugins().length > 0}
            fallback={
              <SettingsListV2>
                <div class="settings-v2-provider-empty">{language.t("dialog.plugins.empty")}</div>
              </SettingsListV2>
            }
          >
            <SettingsListV2>
              <For each={plugins()}>
                {(plugin) => (
                  <SettingsRowV2
                    title={
                      <span class="flex items-center gap-2">
                        <span class="size-1.5 rounded-full shrink-0 bg-icon-success-base" />
                        <span class="settings-v2-provider-name">{plugin}</span>
                      </span>
                    }
                    description=""
                  >
                    <span />
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
