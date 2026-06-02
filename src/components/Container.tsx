import { cn } from "@/lib/utils"
import React from "react"

interface ContainerProps {
  children: React.ReactNode
  className?: string
}
function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn(`w-full px-4 sm:px-8 md:px-16 lg:px-32`, className)}>
      {children}
    </div>
  )
}

export default Container
