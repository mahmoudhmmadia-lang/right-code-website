import { myAxios } from "@/api/myAxios"

export function mediaUrl(value?: string | null) {
  if (!value || /^(https?:|data:|blob:)/i.test(value)) return value ?? ""
  if (typeof window === "undefined") return value
  const api = new URL(myAxios.defaults.baseURL ?? "/api", window.location.origin)
  return new URL(value, api.origin).toString()
}
