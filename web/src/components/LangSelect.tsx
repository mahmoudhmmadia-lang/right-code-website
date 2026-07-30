import { LANGS } from "@/constants/global"
import { changeLanguage, lang, langLoader, type Lang } from "@/context/global"
import { useSignals } from "@preact/signals-react/runtime"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, Languages, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function LanguageOptions({
  onSelect,
}: {
  onSelect?: () => void
}) {
  useSignals()

  const selectLanguage = (nextLanguage: Lang) => {
    changeLanguage(nextLanguage)
    onSelect?.()
  }

  return (
    <div className="grid gap-1.5">
      {LANGS.map((language) => {
        const selected = language.value === lang.value

        return (
          <button
            key={language.value}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => selectLanguage(language.value as Lang)}
            className={`group/item flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
              selected
                ? "border-main/25 bg-main/10 text-main shadow-sm"
                : "border-transparent text-alt/65 hover:border-main/15 hover:bg-main/5 hover:text-alt dark:text-foreground/68 dark:hover:text-foreground"
            }`}
          >
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-2xl text-xs font-black ${
                selected
                  ? "bg-main text-white"
                  : "bg-alt/5 text-alt/55 group-hover/item:bg-main/10 group-hover/item:text-main dark:bg-foreground/8 dark:text-foreground/55"
              }`}
            >
              {language.code}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black">
                {language.nativeLabel}
              </span>
              <span className="block truncate text-xs text-alt/42 dark:text-foreground/42">
                {language.label}
              </span>
            </span>
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full transition ${
                selected
                  ? "bg-main text-white"
                  : "bg-alt/5 text-transparent dark:bg-foreground/8"
              }`}
            >
              <Check className="size-3.5" />
            </span>
          </button>
        )
      })}
    </div>
  )
}

function LangSelect() {
  useSignals()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const activeLanguage =
    LANGS.find((language) => language.value === lang.value) ?? LANGS[0]

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={langLoader.value}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className="group relative flex h-11 min-w-28 items-center gap-2 overflow-hidden rounded-full border border-main/20 bg-background/72 px-2.5 pr-3 text-alt shadow-[0_16px_44px_rgba(18,36,35,0.09)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-main/35 hover:bg-main/10 hover:shadow-[0_18px_52px_rgba(0,107,112,0.14)] disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-main/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative grid size-8 place-items-center rounded-full bg-main text-[0.68rem] font-black text-white shadow-lg shadow-main/20">
          {activeLanguage.code}
        </span>
        <span className="relative hidden min-w-12 text-left sm:block">
          <span className="block text-[0.68rem] leading-3 font-black tracking-[0.14em] text-main uppercase">
            Language
          </span>
          <span className="block text-xs leading-4 font-bold">
            {activeLanguage.nativeLabel}
          </span>
        </span>
        <ChevronDown
          className={`relative size-4 text-main transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute top-[calc(100%+0.55rem)] right-0 z-50 w-60 overflow-hidden rounded-3xl border border-main/15 bg-background/92 p-2 shadow-2xl shadow-alt/15 backdrop-blur-2xl"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="listbox"
            aria-label="Available languages"
          >
            <div className="mb-1 flex items-center justify-between px-3 py-2">
              <span className="flex items-center gap-2 text-[0.68rem] font-black tracking-[0.18em] text-main uppercase">
                <Languages className="size-3.5" />
                Interface
              </span>
              <Sparkles className="size-3.5 text-[#ffb84d]" />
            </div>
            <LanguageOptions onSelect={() => setOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default LangSelect
