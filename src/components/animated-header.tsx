"use client"

import { cn } from "@/lib/utils"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import * as React from "react"

interface AnimatedHeaderProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedHeader({ children, className }: AnimatedHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(false)
  const { scrollY } = useScroll()
  const lastScrollY = React.useRef(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current
    const diff = latest - previous

    setIsScrolled(latest > 50)

    if (latest > 100 && latest > previous && diff > 10) {
      setIsHidden(true)
    } else if (diff < -5 || latest < 100) {
      setIsHidden(false)
    }

    lastScrollY.current = latest
  })

  return (
    <motion.header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 flex items-center justify-center px-4 transition-colors",
        isScrolled ? "py-2" : "py-4",
        className
      )}
      initial={{ y: 0 }}
      animate={{ y: isHidden ? -100 : 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className={cn(
          "relative flex w-full max-w-7xl items-center justify-between rounded-full border px-6 transition-all",
          isScrolled
            ? "border-[#122423]/10 bg-white/80 py-3 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "border-transparent bg-transparent py-3"
        )}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </motion.header>
  )
}
