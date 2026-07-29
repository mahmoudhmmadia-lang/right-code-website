import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export default function PageTransition({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <main className={cn("site-page relative z-10 min-h-screen", className)}>
      {children}
    </main>
  )
}
