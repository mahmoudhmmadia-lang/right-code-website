import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import type { RouteContentCopyText } from "../route-content-copy";
import { ROUTE_CONTENT_LOCALES, type RouteContentLocale } from "../types";

export function RouteLocaleTabs({ value, onChange, copy }: { value: RouteContentLocale; onChange: (locale: RouteContentLocale) => void; copy: RouteContentCopyText }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs font-semibold text-alt/50"><Languages className="size-4 text-main" />{copy.languageHint}</div>
      <div className="flex shrink-0 gap-1 rounded-xl bg-alt/[.045] p-1" dir="ltr">
        {ROUTE_CONTENT_LOCALES.map((locale) => <Button key={locale} type="button" size="sm" variant="ghost" className={cn("min-w-14 rounded-xl uppercase", value === locale ? "bg-white text-main shadow-sm hover:bg-white dark:bg-[#23403d] dark:text-[#69d1d3] dark:hover:bg-[#294946]" : "text-alt/45")} onClick={() => onChange(locale)}>{locale}</Button>)}
      </div>
    </div>
  );
}
