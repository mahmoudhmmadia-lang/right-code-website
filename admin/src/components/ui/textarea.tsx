import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-alt/10 placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 min-h-28 w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm leading-6 shadow-sm outline-none transition-[border-color,box-shadow,background-color] hover:border-main/20 focus-visible:border-main/45 focus-visible:ring-[3px] focus-visible:ring-main/12 disabled:cursor-not-allowed disabled:bg-alt/[.025] disabled:opacity-50 dark:border-white/10 dark:bg-white/[.045] dark:text-white dark:hover:border-main/45",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
