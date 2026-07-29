import { cn } from "@/lib/utils";
import { FileText, SearchCheck, Settings2, type LucideIcon } from "lucide-react";
import type { PagesCopyText } from "../pages-copy";
import type { PageSection } from "../types";

const items: Array<{ key: PageSection; icon: LucideIcon; number: string; hint: "generalHint" | "contentHint" | "seoHint" }> = [
  { key: "general", icon: Settings2, number: "01", hint: "generalHint" },
  { key: "content", icon: FileText, number: "02", hint: "contentHint" },
  { key: "seo", icon: SearchCheck, number: "03", hint: "seoHint" },
];

export function PageEditorNavigation({ active, copy, onChange }: { active: PageSection; copy: PagesCopyText; onChange: (section: PageSection) => void }) {
  return <aside className="xl:sticky xl:top-6 xl:self-start">
    <nav className="flex min-w-max gap-2 overflow-x-auto rounded-3xl border border-white/8 bg-[#102725] p-2 shadow-[0_24px_70px_rgba(12,35,33,.14)] xl:min-w-0 xl:flex-col xl:overflow-visible xl:p-3">
      {items.map(({ key, icon: Icon, number, hint }) => {
        const selected = key === active;
        return <button key={key} type="button" onClick={() => onChange(key)} className={cn("group flex min-w-52 items-center gap-3 rounded-2xl px-3 py-3 text-start transition xl:min-w-0", selected ? "bg-white text-[#122423] shadow-lg" : "text-white/60 hover:bg-white/[.06] hover:text-white")}>
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", selected ? "bg-main text-white" : "bg-white/[.06] text-[#55c4c7]")}><Icon className="size-4.5" /></span>
          <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{copy[key]}</strong><small className={cn("mt-0.5 block truncate text-[10px]", selected ? "text-[#122423]/45" : "text-white/30")}>{copy[hint]}</small></span>
          <span className={cn("text-[9px] font-black tracking-widest", selected ? "text-main/55" : "text-white/20")}>{number}</span>
        </button>;
      })}
    </nav>
  </aside>;
}
