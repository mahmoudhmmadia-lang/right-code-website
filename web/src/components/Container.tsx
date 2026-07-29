import { cn } from "@/lib/utils"
import React from "react"

type ContainerProps = React.ComponentProps<"div">

function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(`w-full px-4 sm:px-8 md:px-16 lg:px-32`, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container
