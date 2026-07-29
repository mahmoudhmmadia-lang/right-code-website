import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-alt/10 flex h-11 w-full min-w-0 rounded-xl border bg-white px-4 py-2.5 text-base shadow-sm transition-[border-color,box-shadow,background-color] outline-none file:mr-3 file:inline-flex file:h-7 file:rounded-lg file:border-0 file:bg-main/8 file:px-3 file:text-sm file:font-semibold file:text-main hover:border-main/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-alt/[.025] disabled:opacity-50 dark:border-white/10 dark:bg-white/[.045] dark:text-white dark:hover:border-main/45 md:text-sm",
        "focus-visible:border-main/45 focus-visible:ring-main/12 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
