import { myAxios } from "@/api/myAxios"
import { deleteCookie, getCookie, setCookie } from "@/lib/cookies"
import { effect, signal } from "@preact/signals-react"

export type Lang = "en" | "ar" | "tr"

export type AccountInfo = {
  id: string
  email?: string
  fullName?: string
  avatarUrl?: string
  locale?: string
  role: number
  token: string
}

function storedAccount(): AccountInfo | undefined {
  const value = getCookie("rightcode-admin-account")
  if (!value) return undefined
  try {
    return JSON.parse(decodeURIComponent(value)) as AccountInfo
  } catch {
    deleteCookie("rightcode-admin-account")
    return undefined
  }
}
export const accountInfo = signal<AccountInfo | undefined>(storedAccount())

export const lang = signal<Lang>((getCookie("rightCode-lang") as Lang) ?? "en")
export const langLoader = signal(false)
export const page = signal(1)
export const sidebarOpen = signal(false)
export const response = signal<
  { type: "success" | "error" | "warning"; message: string } | undefined
>()

let languageTimer: number | undefined

export function changeLanguage(next: Lang) {
  if (next === lang.value || langLoader.value) return
  langLoader.value = true
  window.clearTimeout(languageTimer)
  languageTimer = window.setTimeout(() => {
    lang.value = next
    document.documentElement.lang = next
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr"
    languageTimer = window.setTimeout(() => {
      langLoader.value = false
    }, 320)
  }, 220)
}

effect(() => {
  myAxios.defaults.headers.common["Accept-Language"] = lang.value
  setCookie("rightCode-lang", lang.value)
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang.value
    document.documentElement.dir = lang.value === "ar" ? "rtl" : "ltr"
  }
})

effect(() => {
  const account = accountInfo.value
  if (account?.token) {
    myAxios.defaults.headers.common.Authorization = `Bearer ${account.token}`
    setCookie(
      "rightcode-admin-account",
      encodeURIComponent(JSON.stringify(account))
    )
  } else {
    delete myAxios.defaults.headers.common.Authorization
    deleteCookie("rightcode-admin-account")
  }
})
