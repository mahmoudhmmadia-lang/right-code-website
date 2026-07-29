import { cn } from "@/lib/utils"
import * as React from "react"

interface AnimatedHeaderProps {
  children: React.ReactNode
  className?: string
  forceVisible?: boolean
}

export function AnimatedHeader({
  children,
  className,
  forceVisible = false,
}: AnimatedHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(false)
  const scrolledRef = React.useRef(false)
  const hiddenRef = React.useRef(false)
  const lastDecisionY = React.useRef(0)
  const frame = React.useRef<number | null>(null)

  React.useEffect(() => {
    const update = () => {
      frame.current = null
      const current = Math.max(window.scrollY, 0)
      const shouldBeScrolled = current > 24
      if (shouldBeScrolled !== scrolledRef.current) {
        scrolledRef.current = shouldBeScrolled
        setIsScrolled(shouldBeScrolled)
      }

      const delta = current - lastDecisionY.current
      let shouldHide = hiddenRef.current
      if (current < 28 || forceVisible) shouldHide = false
      else if (current > 112 && delta > 36) shouldHide = true
      else if (delta < -14) shouldHide = false

      if (shouldHide !== hiddenRef.current) {
        hiddenRef.current = shouldHide
        setIsHidden(shouldHide)
        lastDecisionY.current = current
      } else if (Math.abs(delta) > 48) {
        lastDecisionY.current = current
      }
    }
    const onScroll = () => {
      if (frame.current === null)
        frame.current = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    }
  }, [forceVisible])

  const hidden = isHidden && !forceVisible
  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 flex items-center justify-center px-4 transition-[padding,transform,opacity] duration-300 ease-out will-change-transform",
        hidden
          ? "pointer-events-none -translate-y-[115%] opacity-95"
          : "pointer-events-auto translate-y-0 opacity-100",
        isScrolled ? "py-2" : "py-4",
        className
      )}
    >
      <div
        className={cn(
          "relative flex w-full max-w-7xl items-center justify-between overflow-visible rounded-full border px-4 transition-[background-color,border-color,box-shadow,padding] duration-300 sm:px-6",
          isScrolled
            ? "border-alt/10 bg-white/90 py-2.5 shadow-lg shadow-black/5 backdrop-blur-md dark:bg-[#0b2022]/90"
            : "border-transparent bg-transparent py-3 shadow-none"
        )}
      >
        {children}
      </div>
    </header>
  )
}
