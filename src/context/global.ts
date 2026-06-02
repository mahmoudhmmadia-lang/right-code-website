import { getCookie, setCookie } from "@/lib/cookies"
import { effect, signal } from "@preact/signals"

export const lang = signal<"ar" | "en" | "tr">(
  (getCookie("rightCode-lang") as "ar") || "en"
)

export const langLoader = signal(true)

effect(() => {
  if (lang.value) {
    setCookie("rightCode-lang", lang.value)
    langLoader.value = true
  }
})

effect(() => {
  if (langLoader.value)
    setTimeout(() => {
      langLoader.value = false
    }, 3000)
})
