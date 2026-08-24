// tui removed shim - provides dummy exports for desktop-focused build
export const openEditor: any = async () => undefined
export const registerOpencodeKeymap: any = () => () => {}
export const OpencodeKeymapProvider: any = (props: any) => props?.children ?? null
export const OPENCODE_BASE_MODE: any = "base"
export const useBindings: any = () => ({})
export const formatKeyBindings: any = () => ""
export const formatKeySequence: any = () => ""
export const useKeymapSelector: any = () => null
export const OpenTuiKeymap: any = {}
export const registerOpencodeSpinner: any = () => {}
export const SPINNER_FRAMES: any = []
export const createColors: any = () => ({})
export const createFrames: any = () => []
export const normalizePromptContent: any = (v: any) => v
export const display: any = () => null
export const displayCharAt: any = () => ""
export const displaySlice: any = () => ""
export const mentionTriggerIndex: any = () => undefined
export const TuiConfig: any = { Info: {}, Resolved: {}, resolve: (x: any) => x }
export const hasTheme: any = () => false
export const upsertTheme: any = () => {}
export const generateSyntax: any = () => ({})
export const generateSubtleSyntax: any = () => ({})
export const isRecord: any = (v: any) => !!v && typeof v === "object" && !Array.isArray(v)
export const errorMessage: any = (e: any) => String(e)
export const logo: any = () => "opencode"
export const go: any = () => ""
export const createTuiAttention: any = () => ({})
export const parsersConfig: any = {}
export default {} as any
