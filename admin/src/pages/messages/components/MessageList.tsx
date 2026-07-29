import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { messageStatusLabel, type MessagesCopyText } from "../messages-copy";
import type { Message } from "../types";

export function MessageList({ rows, selectedId, copy, locale, onSelect }: { rows: Message[]; selectedId?: string; copy: MessagesCopyText; locale: string; onSelect: (message: Message) => void }) {
  if (!rows.length) return <div className="grid min-h-96 place-items-center p-8 text-center text-sm text-muted-foreground">{copy.empty}</div>;
  return <div className="divide-y divide-alt/8 dark:divide-white/8">{rows.map((message) => <button key={message.id} type="button" onClick={() => onSelect(message)} className={cn("w-full p-4 text-start transition hover:bg-main/[.035] sm:p-5", selectedId === message.id && "bg-main/[.075]")}>
    <div className="flex items-start gap-3">
      <span className={cn("mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl text-sm font-black", message.status === "NEW" ? "bg-main text-white" : "bg-main/8 text-main")}>{message.fullName.charAt(0).toUpperCase()}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <strong className="truncate text-sm text-alt dark:text-white">{message.fullName}</strong>
          <time className="shrink-0 text-[10px] text-alt/35 dark:text-white/35">{new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(message.createdAt))}</time>
        </span>
        {message.organization ? <span className="mt-1 flex items-center gap-1 text-[11px] text-alt/40 dark:text-white/40"><Building2 className="size-3" />{message.organization}</span> : null}
        <span className="mt-2 line-clamp-2 text-xs leading-5 text-alt/55 dark:text-white/55">{message.message}</span>
        <Badge className="mt-3 bg-main/8 text-[10px] text-main">{messageStatusLabel(copy, message.status)}</Badge>
      </span>
    </div>
  </button>)}</div>;
}
