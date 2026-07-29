import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function FormField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <Label className={cn("grid gap-2 text-sm font-semibold text-alt/70", className)}>{label}{children}</Label>;
}
