import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { lang } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { useSignals } from "@preact/signals-react/runtime";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...props}
      dir={lang.value == "ar" ? "rtl" : "ltr"}
    />
  );
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...props}
      dir={lang.value == "ar" ? "rtl" : "ltr"}
    />
  );
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  useSignals();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-1.5rem)] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-hidden rounded-3xl border border-white/50 p-6 shadow-2xl shadow-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-white/10 sm:max-w-lg",
          className,
        )}
        {...props}
        dir={lang.value == "ar" ? "rtl" : "ltr"}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full border bg-background/90 text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4.5" />
          <span className="sr-only">{ADMIN_TRANSLATOR[lang.value].close}</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
};
