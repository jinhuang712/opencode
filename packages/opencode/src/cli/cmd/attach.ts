import { errorMessage } from "@/util/error"
import { validateSession } from "../tui/validate-session"
import { cmd } from "@/cli/cmd/cmd"
export const AttachCommand = cmd({
  command: "attach",
  describe: "attach removed",
  builder: (y) => y,
  handler: async () => {
    console.error("attach tui removed")
  },
})
