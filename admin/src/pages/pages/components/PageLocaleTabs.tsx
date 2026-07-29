import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import type { PagesCopyText } from "../pages-copy";
import { PAGE_LOCALES, type PageLocale } from "../types";

export function PageLocaleTabs({ value, copy, onChange }: { value: PageLocale; copy: PagesCopyText; onChange: (locale: PageLocale) => void }) {
  return <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2 text-xs font-semibold text-alt/50"><Languages className="size-4 text-main" />{copy.languageHint}</div>
    <div className="flex shrink-0 gap-1 rounded-xl bg-alt/[.055] p-1 dark:bg-white/[.055]" dir="ltr">
      {PAGE_LOCALES.map((locale) => <Button key={locale} type="button" size="sm" variant="ghost" className={cn("min-w-20", value === locale ? "bg-white text-main shadow-sm hover:bg-white dark:bg-[#23403d] dark:text-[#69d1d3] dark:hover:bg-[#294946]" : "text-alt/45")} onClick={() => onChange(locale)}>{copy[locale]}</Button>)}
    </div>
  </div>;
}
