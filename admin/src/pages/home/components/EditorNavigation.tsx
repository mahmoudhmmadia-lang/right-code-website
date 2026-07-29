import { cn } from "@/lib/utils";
import { Blocks, Handshake, LayoutDashboard, MessageSquareQuote, Sparkles, TriangleAlert, type LucideIcon } from "lucide-react";
import type { HomeCopy } from "../home-copy";
import type { HomeEditorSection } from "../types";

const items: Array<{ key: HomeEditorSection; icon: LucideIcon; number: string }> = [
  { key: "general", icon: LayoutDashboard, number: "00" },
  { key: "hero", icon: Sparkles, number: "01" },
  { key: "partners", icon: Handshake, number: "02" },
  { key: "painPoints", icon: TriangleAlert, number: "03" },
  { key: "services", icon: Blocks, number: "04" },
  { key: "testimonials", icon: MessageSquareQuote, number: "05" },
];

export function EditorNavigation({ active, onChange, copy }: { active: HomeEditorSection; onChange: (section: HomeEditorSection) => void; copy: HomeCopy }) {
  return (
    <aside className="xl:sticky xl:top-6 xl:self-start">
      <div className="overflow-x-auto rounded-3xl border border-alt/8 bg-[#102725] p-2 shadow-[0_24px_70px_rgba(12,35,33,.14)] xl:p-3">
        <nav className="flex min-w-max gap-2 xl:min-w-0 xl:flex-col">
          {items.map(({ key, icon: Icon, number }) => {
            const selected = key === active;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                className={cn(
                  "group flex min-w-40 items-center gap-3 rounded-2xl px-3 py-3 text-start transition xl:min-w-0",
                  selected ? "bg-white text-[#122423] shadow-lg" : "text-white/55 hover:bg-white/[.06] hover:text-white",
                )}
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl transition", selected ? "bg-main text-white" : "bg-white/[.06] text-main group-hover:bg-white/10")}><Icon className="size-4.5" /></span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold">{copy[key]}</span>
                <span className={cn("text-[9px] font-black tracking-widest", selected ? "text-main/55" : "text-white/20")}>{number}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
