import { cmd } from "@/cli/cmd/cmd"
import path from "path"
import { Filesystem } from "@/util/filesystem"
export function resolveThreadDirectory(project?: string, envPWD = process.env.PWD, cwd = process.cwd()): string {
  const root = Filesystem.resolve(envPWD ?? cwd)
  if (project) return Filesystem.resolve(path.isAbsolute(project) ? project : path.join(root, project))
  return Filesystem.resolve(cwd)
}
export const TuiThreadCommand = cmd({
  command: "$0 [project]",
  describe: "tui removed - use desktop or opencode serve",
  builder: (yargs) => yargs,
  handler: async () => {
    console.error("tui removed in desktop-focused build")
    process.exitCode = 1
  },
})
