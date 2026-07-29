import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-[background-color,color,border-color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 focus-visible:border-main/45 focus-visible:ring-main/12 focus-visible:ring-[3px] outline-none active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-main text-white shadow-sm shadow-main/15 hover:bg-main/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-alt/10 bg-white text-alt shadow-sm hover:border-main/25 hover:bg-main/[.04] hover:text-main dark:border-white/10 dark:bg-white/[.045] dark:text-white dark:hover:border-main/40 dark:hover:bg-main/10 dark:hover:text-[#5dc9cb]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-11 rounded-xl px-4 py-2.5",
        lg: "h-12 rounded-xl px-6 py-3",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// shadcn exposes the variants for composition with links and other controls.
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
