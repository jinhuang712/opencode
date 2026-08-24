import { Component } from "solid-js"
import { Switch } from "@opencode-ai/ui/v2/switch-v2"
import { useLanguage } from "@/context/language"
import { SettingsListV2 } from "./parts/list"
import { SettingsRowV2 } from "./parts/row"
import { createPermissionScopeController, type PermissionScopeController } from "./general-controllers"
import "./settings-v2.css"

const PermissionScopeSetting: Component<{ controller: PermissionScopeController }> = (props) => {
  const language = useLanguage()
  return (
    <SettingsRowV2
      title={language.t("command.permissions.autoaccept.enable")}
      description={language.t("toast.permissions.autoaccept.on.description")}
    >
      <div data-action="settings-auto-accept-permissions">
        <Switch
          checked={props.controller.accepting()}
          disabled={!props.controller.enabled()}
          onChange={props.controller.set}
        />
      </div>
    </SettingsRowV2>
  )
}

export const SettingsPermissionsV2: Component<{ sessionID?: string }> = (props) => {
  const language = useLanguage()
  const permissionScope = createPermissionScopeController(() => props.sessionID)

  return (
    <>
      <div class="settings-v2-tab-header">
        <h2 class="settings-v2-tab-title">{language.t("settings.tab.permissions")}</h2>
      </div>
      <div class="settings-v2-tab-body">
        <div class="settings-v2-section">
          <SettingsListV2>
            <PermissionScopeSetting controller={permissionScope} />
          </SettingsListV2>
        </div>
      </div>
    </>
  )
}
