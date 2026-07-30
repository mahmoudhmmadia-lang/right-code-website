import DashboardPageLayout from "@/components/DashboardPageLayout";
import FilterBar from "@/components/FilterBar";
import { PaginationLayout, type CollectionViewMode } from "@/components/PaginationLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { lang } from "@/context/global";
import { cn } from "@/lib/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { Building2, CalendarDays, CheckCircle2, CircleDot, Mail, Phone, Send, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { MessageDetail } from "./components/MessageDetail";
import { messageStatusLabel, MESSAGES_COPY, type MessagesCopyText } from "./messages-copy";
import { MESSAGE_STATUSES, type Message, type MessageForm, type MessageStatus } from "./types";
import { useMessages } from "./useMessages";

const respondedStatuses = new Set<MessageStatus>(["CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON"]);

function isResponded(message: Message) {
  return respondedStatuses.has(message.status);
}

function statusClassName(status: MessageStatus) {
  if (status === "NEW") return "bg-main text-white";
  if (respondedStatuses.has(status)) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (status === "LOST" || status === "SPAM" || status === "ARCHIVED") return "bg-alt/8 text-alt/55 dark:bg-white/8 dark:text-white/55";
  return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

function RespondedBadge({ message, copy }: { message: Message; copy: MessagesCopyText }) {
  const responded = isResponded(message);
  return <Badge className={cn("gap-1.5 text-[10px]", responded ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300")}>{responded ? <CheckCircle2 className="size-3" /> : <CircleDot className="size-3" />}{responded ? copy.responded : copy.notResponded}</Badge>;
}

function RespondedButton({ message, copy, disabled, onToggle }: { message: Message; copy: MessagesCopyText; disabled: boolean; onToggle: (message: Message) => void }) {
  const responded = isResponded(message);
  return <Button type="button" variant={responded ? "outline" : "default"} size="sm" disabled={disabled} onClick={() => onToggle(message)}>{responded ? <CircleDot className="size-4" /> : <CheckCircle2 className="size-4" />}{responded ? copy.markNotResponded : copy.markResponded}</Button>;
}

function MessageCard({ message, copy, locale, saving, onReview, onToggleResponded }: { message: Message; copy: MessagesCopyText; locale: string; saving: boolean; onReview: (message: Message) => void; onToggleResponded: (message: Message) => void }) {
  return <article className="group flex min-h-[340px] flex-col overflow-hidden rounded-3xl border border-alt/10 bg-white p-5 shadow-[0_16px_50px_rgba(18,36,35,.06)] transition hover:-translate-y-1 hover:border-main/25 hover:shadow-[0_22px_65px_rgba(18,36,35,.1)] dark:border-white/10 dark:bg-card dark:shadow-black/20">
    <div className="flex items-start justify-between gap-3">
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-base font-black", message.status === "NEW" ? "bg-main text-white" : "bg-main/8 text-main")}>{message.fullName.charAt(0).toUpperCase()}</span>
      <div className="flex flex-col items-end gap-2">
        <RespondedBadge message={message} copy={copy} />
        <Badge className={cn("text-[10px]", statusClassName(message.status))}>{messageStatusLabel(copy, message.status)}</Badge>
      </div>
    </div>
    <div className="mt-5 min-w-0 flex-1">
      <h2 className="truncate text-xl font-black text-alt dark:text-white">{message.fullName}</h2>
      {message.organization ? <p className="mt-1 flex items-center gap-2 truncate text-xs font-bold text-main"><Building2 className="size-3.5 shrink-0" />{message.organization}</p> : null}
      <div className="mt-5 grid gap-3 text-sm text-alt/65 dark:text-white/65">
        <a href={`mailto:${message.email}`} className="flex min-w-0 items-center gap-2 hover:text-main"><Mail className="size-4 shrink-0 text-main" /><span className="truncate">{message.email}</span></a>
        <a href={message.phone ? `tel:${message.phone}` : undefined} className="flex min-w-0 items-center gap-2 hover:text-main"><Phone className="size-4 shrink-0 text-main" /><span className="truncate">{message.phone || "—"}</span></a>
        <p className="flex min-w-0 items-center gap-2"><CalendarDays className="size-4 shrink-0 text-main" /><span className="truncate">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.createdAt))}</span></p>
      </div>
      <p className="mt-5 line-clamp-4 rounded-2xl bg-main/[.045] p-4 text-sm leading-6 text-alt/60 dark:text-white/60">{message.message}</p>
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-alt/8 pt-4 dark:border-white/8">
      <RespondedButton message={message} copy={copy} disabled={saving} onToggle={onToggleResponded} />
      <div className="flex gap-2">
        <Button asChild size="icon" variant="outline" aria-label={copy.reply}><a href={`mailto:${message.email}`}><Send className="size-4" /></a></Button>
        <Button type="button" onClick={() => onReview(message)}><UserRound className="size-4" />{copy.review}</Button>
      </div>
    </div>
  </article>;
}

function MessageListRows({ rows, copy, locale, saving, onReview, onToggleResponded }: { rows: Message[]; copy: MessagesCopyText; locale: string; saving: boolean; onReview: (message: Message) => void; onToggleResponded: (message: Message) => void }) {
  return <div className="divide-y divide-alt/8 dark:divide-white/8">
    {rows.map((message) => <article key={message.id} className="grid gap-4 p-5 transition hover:bg-main/[.025] xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.6fr)_auto] xl:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-black", message.status === "NEW" ? "bg-main text-white" : "bg-main/8 text-main")}>{message.fullName.charAt(0).toUpperCase()}</span>
        <div className="min-w-0">
          <h2 className="truncate font-black text-alt dark:text-white">{message.fullName}</h2>
          <a href={`mailto:${message.email}`} className="mt-1 block truncate text-xs text-muted-foreground hover:text-main">{message.email}</a>
          {message.organization ? <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-alt/40 dark:text-white/40"><Building2 className="size-3" />{message.organization}</p> : null}
        </div>
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm leading-6 text-alt/60 dark:text-white/60">{message.message}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <RespondedBadge message={message} copy={copy} />
          <Badge className={cn("text-[10px]", statusClassName(message.status))}>{messageStatusLabel(copy, message.status)}</Badge>
          <time className="text-[11px] font-semibold text-alt/35 dark:text-white/35">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.createdAt))}</time>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 rtl:justify-start">
        <RespondedButton message={message} copy={copy} disabled={saving} onToggle={onToggleResponded} />
        <Button asChild size="icon" variant="outline" aria-label={copy.reply}><a href={`mailto:${message.email}`}><Send className="size-4" /></a></Button>
        <Button type="button" onClick={() => onReview(message)}><UserRound className="size-4" />{copy.review}</Button>
      </div>
    </article>)}
  </div>;
}

export default function Messages() {
  useSignals();
  const copy = MESSAGES_COPY[lang.value];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Message>();
  const [viewMode, setViewMode] = useState<CollectionViewMode>("grid");
  const { list, update } = useMessages({ page, search, status });
  const rows = list.data?.data ?? [];

  useEffect(() => {
    const nextRows = list.data?.data;
    if (!nextRows?.length) return setSelected(undefined);
    setSelected((current) => current ? nextRows.find((item) => item.id === current.id) : undefined);
  }, [list.data]);

  function updateMessage(message: Message, values: MessageForm) { update.mutate({ id: message.id, values }); }
  function toggleResponded(message: Message) {
    updateMessage(message, {
      status: isResponded(message) ? "NEW" : "CONTACTED",
      internalNotes: message.internalNotes ?? "",
    });
  }

  return <DashboardPageLayout title={copy.title} description={copy.description}>
    <FilterBar
      search={search}
      searchPlaceholder={copy.search}
      totalLabel={`${list.data?.totalCount ?? 0} ${(list.data?.totalCount ?? 0) === 1 ? copy.result : copy.results}`}
      selects={[{ name: "status", value: status, allLabel: copy.allStatuses, options: MESSAGE_STATUSES.map((item) => ({ value: item, label: messageStatusLabel(copy, item) })) }]}
      onApply={({ search, filters }) => { setSearch(search); setStatus(filters.status ?? ""); setPage(1); }}
    />
    <PaginationLayout
      title={copy.inbox}
      count={list.data?.totalCount ?? 0}
      isLoading={list.isLoading}
      hasRows={Boolean(rows.length)}
      empty={<div className="grid min-h-96 place-items-center p-8 text-center text-sm text-muted-foreground">{copy.empty}</div>}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      grid={<div className="grid gap-5 p-5 md:grid-cols-2 2xl:grid-cols-3">{rows.map((message) => <MessageCard key={message.id} message={message} copy={copy} locale={lang.value} saving={update.isPending} onReview={setSelected} onToggleResponded={toggleResponded} />)}</div>}
      list={<MessageListRows rows={rows} copy={copy} locale={lang.value} saving={update.isPending} onReview={setSelected} onToggleResponded={toggleResponded} />}
      currentPage={page}
      pagesNumber={list.data?.pagesNumber ?? 0}
      onPageChange={setPage}
    />
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(undefined); }}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto p-0 sm:max-w-5xl">
        <MessageDetail message={selected} copy={copy} locale={lang.value} saving={update.isPending} onSave={(values) => selected && updateMessage(selected, values)} />
      </DialogContent>
    </Dialog>
  </DashboardPageLayout>;
}
