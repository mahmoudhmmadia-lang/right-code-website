import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn("inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground", className)}
      {...props}
    />
  );
}

export { Badge };
