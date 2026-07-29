import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

function CustomButton({
  className,
  asChild = false,
  children,
  isLoading,
  isDanger,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  children: ReactNode;
  isLoading?: boolean;
  isDanger?: boolean;
}) {
  return (
    <Button
      asChild={asChild}
      className={cn("bg-main text-white", isDanger && "bg-red-600", className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}

export default CustomButton;
