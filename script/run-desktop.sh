#!/usr/bin/env bash
set -euo pipefail

# 直接可运行的 Desktop App，无需 dmg
# 用法: ./script/run-desktop.sh        # 构建后直接跑 out/main
#      ./script/run-desktop.sh --dev   # 热重载开发模式

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DESKTOP="$ROOT/packages/desktop"

if [[ "${1:-}" == "--dev" ]]; then
  echo "▶ Starting Desktop in dev (electron-vite dev) ..."
  exec bun --cwd "$DESKTOP" run dev
fi

echo "▶ Building Desktop (electron-vite build, skip prebuild network) ..."
# 跳过 prebuild 的 models.dev 拉取，直接 vite 构建
(cd "$DESKTOP" && npx --yes electron-vite build)

echo "▶ Launching Desktop from out/main ..."
# out/main/index.js 为入口，electron 直接可跑，无需 dmg
exec npx --yes electron "$DESKTOP/out/main/index.js" "$@"
