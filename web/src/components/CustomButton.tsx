import { cn } from "@/lib/utils"
import { LoaderCircle } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "./ui/button"

function CustomButton({
  children,
  isLoading,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  children: ReactNode
  isLoading?: boolean
}) {
  return (
    <Button
      className={cn("bg-main text-white shadow-sm hover:bg-main/90", className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <LoaderCircle className="animate-spin" /> : children}
    </Button>
  )
}

export default CustomButton
