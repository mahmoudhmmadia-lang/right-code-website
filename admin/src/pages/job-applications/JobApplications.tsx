import DashboardPageLayout from "@/components/DashboardPageLayout";
import FilterBar from "@/components/FilterBar";
import { PaginationLayout, type CollectionViewMode } from "@/components/PaginationLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { lang } from "@/context/global";
import { cn } from "@/lib/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { BriefcaseBusiness, CalendarDays, Download, ExternalLink, FileText, Linkedin, Mail, Phone, Send, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { applicationStatusLabel, JOB_APPLICATIONS_COPY, type JobApplicationsCopyText } from "./job-applications-copy";
import { APPLICATION_STATUSES, applicationTitle, type ApplicationForm, type JobApplication } from "./types";
import { useJobApplications } from "./useJobApplications";

function statusClassName(status: JobApplication["status"]) {
  if (status === "NEW") return "bg-main text-white";
  if (status === "HIRED" || status === "OFFERED") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (status === "REJECTED" || status === "ARCHIVED") return "bg-alt/8 text-alt/55 dark:bg-white/8 dark:text-white/55";
  if (status === "INTERVIEW" || status === "SHORTLISTED") return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
  return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

function ApplicationCard({ application, copy, locale, downloading, onReview, onDownload }: { application: JobApplication; copy: JobApplicationsCopyText; locale: string; downloading: boolean; onReview: () => void; onDownload: () => void }) {
  const role = applicationTitle(application);
  return <article className="group flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-alt/10 bg-white p-5 shadow-[0_16px_50px_rgba(18,36,35,.06)] transition hover:-translate-y-1 hover:border-main/25 hover:shadow-[0_22px_65px_rgba(18,36,35,.1)] dark:border-white/10 dark:bg-card dark:shadow-black/20">
    <div className="flex items-start justify-between gap-4">
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-base font-black", application.status === "NEW" ? "bg-main text-white" : "bg-main/8 text-main")}>{application.fullName.charAt(0).toUpperCase()}</span>
      <Badge className={cn("shrink-0 text-[10px]", statusClassName(application.status))}>{applicationStatusLabel(copy, application.status)}</Badge>
    </div>
    <div className="mt-5 min-w-0 flex-1">
      <h2 className="truncate text-xl font-black text-alt dark:text-white">{application.fullName}</h2>
      <p className="mt-1 flex items-center gap-2 truncate text-xs font-bold text-main"><BriefcaseBusiness className="size-3.5 shrink-0" />{role}</p>
      <div className="mt-5 grid gap-3 text-sm text-alt/65 dark:text-white/65">
        <a href={`mailto:${application.email}`} className="flex min-w-0 items-center gap-2 hover:text-main"><Mail className="size-4 shrink-0 text-main" /><span className="truncate">{application.email}</span></a>
        <a href={application.phone ? `tel:${application.phone}` : undefined} className="flex min-w-0 items-center gap-2 hover:text-main"><Phone className="size-4 shrink-0 text-main" /><span className="truncate">{application.phone || "—"}</span></a>
        <p className="flex min-w-0 items-center gap-2"><CalendarDays className="size-4 shrink-0 text-main" /><span className="truncate">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(application.createdAt))}</span></p>
      </div>
      {application.coverNote ? <p className="mt-5 line-clamp-3 rounded-2xl bg-main/[.045] p-4 text-sm leading-6 text-alt/60 dark:text-white/60">{application.coverNote}</p> : null}
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-alt/8 pt-4 dark:border-white/8">
      <div className="flex gap-2">
        <Button size="icon" variant="outline" onClick={onDownload} disabled={downloading} aria-label={copy.downloadCv}><Download className="size-4" /></Button>
        <Button asChild size="icon" variant="outline" aria-label={copy.reply}><a href={`mailto:${application.email}`}><Send className="size-4" /></a></Button>
      </div>
      <Button onClick={onReview}><UserRound className="size-4" />{copy.review}</Button>
    </div>
  </article>;
}

function ApplicationsTable({ rows, copy, locale, downloadingId, onReview, onDownload }: { rows: JobApplication[]; copy: JobApplicationsCopyText; locale: string; downloadingId?: string; onReview: (application: JobApplication) => void; onDownload: (application: JobApplication) => void }) {
  return <Table className="min-w-[980px]">
    <TableHeader>
      <TableRow>
        <TableHead>{copy.email}</TableHead>
        <TableHead>{copy.role}</TableHead>
        <TableHead>{copy.phone}</TableHead>
        <TableHead>{copy.status}</TableHead>
        <TableHead>{copy.received}</TableHead>
        <TableHead className="text-right rtl:text-left">{copy.review}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((application) => (
        <TableRow key={application.id}>
          <TableCell>
            <div className="font-black text-alt dark:text-white">{application.fullName}</div>
            <a href={`mailto:${application.email}`} className="mt-1 block text-xs text-muted-foreground hover:text-main">{application.email}</a>
          </TableCell>
          <TableCell className="font-semibold text-alt/65 dark:text-white/65">{applicationTitle(application)}</TableCell>
          <TableCell className="whitespace-nowrap text-alt/60 dark:text-white/60">{application.phone || "—"}</TableCell>
          <TableCell><Badge className={cn("text-[10px]", statusClassName(application.status))}>{applicationStatusLabel(copy, application.status)}</Badge></TableCell>
          <TableCell className="whitespace-nowrap text-alt/60 dark:text-white/60">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(application.createdAt))}</TableCell>
          <TableCell>
            <div className="flex justify-end gap-2 rtl:justify-start">
              <Button size="icon" variant="outline" onClick={() => onDownload(application)} disabled={downloadingId === application.id} aria-label={copy.downloadCv}><Download className="size-4" /></Button>
              <Button asChild size="icon" variant="outline" aria-label={copy.reply}><a href={`mailto:${application.email}`}><Send className="size-4" /></a></Button>
              <Button size="sm" onClick={() => onReview(application)}><UserRound className="size-4" />{copy.review}</Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>;
}

function ApplicationDetail({ application, copy, locale, saving, downloading, onSave, onDownload }: { application?: JobApplication; copy: JobApplicationsCopyText; locale: string; saving: boolean; downloading: boolean; onSave: (values: ApplicationForm) => void; onDownload: () => void }) {
  const form = useForm<ApplicationForm>({ defaultValues: { status: "NEW", internalNotes: "" } });
  useEffect(() => { if (application) form.reset({ status: application.status, internalNotes: application.internalNotes ?? "" }); }, [application, form]);
  if (!application) return <section className="grid min-h-[420px] place-items-center rounded-3xl border border-alt/10 bg-white p-10 text-center text-sm text-muted-foreground dark:border-white/10 dark:bg-card">{copy.choose}</section>;

  const role = applicationTitle(application);
  return <section className="overflow-hidden rounded-3xl border border-alt/10 bg-white shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card">
    <header className="border-b border-alt/10 bg-linear-to-r from-main/[.075] to-transparent p-5 dark:border-white/10 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-[10px] font-black tracking-[.2em] text-main uppercase">{role}</p><h2 className="mt-2 text-2xl font-black text-alt dark:text-white">{application.fullName}</h2><p className="mt-1 text-sm text-alt/45 dark:text-white/45">{application.email}</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={onDownload} disabled={downloading}><Download className="size-4" />{downloading ? copy.downloading : copy.downloadCv}</Button><Button asChild><a href={`mailto:${application.email}`}><Send className="size-4" />{copy.reply}</a></Button></div>
      </div>
    </header>
    <div className="grid gap-6 p-5 sm:p-7">
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`mailto:${application.email}`} className="flex items-center gap-3 rounded-2xl bg-main/[.045] p-4 text-sm text-alt dark:text-white"><Mail className="size-4 text-main" /><span className="min-w-0"><small className="block text-[10px] font-bold text-muted-foreground">{copy.email}</small><span className="break-all">{application.email}</span></span></a>
        <a href={application.phone ? `tel:${application.phone}` : undefined} className="flex items-center gap-3 rounded-2xl bg-main/[.045] p-4 text-sm text-alt dark:text-white"><Phone className="size-4 text-main" /><span><small className="block text-[10px] font-bold text-muted-foreground">{copy.phone}</small>{application.phone || "—"}</span></a>
        <div className="flex items-center gap-3 rounded-2xl bg-main/[.045] p-4 text-sm text-alt dark:text-white"><BriefcaseBusiness className="size-4 text-main" /><span><small className="block text-[10px] font-bold text-muted-foreground">{copy.role}</small>{role}</span></div>
        <div className="flex items-center gap-3 rounded-2xl bg-main/[.045] p-4 text-sm text-alt dark:text-white"><CalendarDays className="size-4 text-main" /><span><small className="block text-[10px] font-bold text-muted-foreground">{copy.received}</small>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(application.createdAt))}</span></div>
      </div>
      {(application.linkedInUrl || application.portfolioUrl) ? <div><h3 className="mb-3 text-xs font-black text-alt dark:text-white">{copy.links}</h3><div className="flex flex-wrap gap-2">{application.linkedInUrl ? <Button asChild variant="outline" size="sm"><a href={application.linkedInUrl} target="_blank" rel="noreferrer"><Linkedin className="size-4" />{copy.linkedIn}<ExternalLink className="size-3" /></a></Button> : null}{application.portfolioUrl ? <Button asChild variant="outline" size="sm"><a href={application.portfolioUrl} target="_blank" rel="noreferrer"><FileText className="size-4" />{copy.portfolio}<ExternalLink className="size-3" /></a></Button> : null}</div></div> : null}
      <div><h3 className="mb-3 text-xs font-black text-alt dark:text-white">{copy.coverNote}</h3><p className="whitespace-pre-wrap rounded-2xl border border-alt/8 bg-alt/[.025] p-5 text-sm leading-7 text-alt/70 dark:border-white/8 dark:bg-white/[.025] dark:text-white/70">{application.coverNote || copy.noCoverNote}</p></div>
      <form onSubmit={form.handleSubmit(onSave)} className="grid gap-5 border-t border-alt/10 pt-6 dark:border-white/10">
        <div className="grid gap-5 sm:grid-cols-2"><div className="grid content-start gap-2"><Label>{copy.status}</Label><Controller control={form.control} name="status" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{APPLICATION_STATUSES.map((item) => <SelectItem key={item} value={item}>{applicationStatusLabel(copy, item)}</SelectItem>)}</SelectContent></Select>} /></div><div className="grid gap-2"><Label htmlFor="applicationNotes">{copy.notes}</Label><Textarea id="applicationNotes" maxLength={5000} placeholder={copy.notesHint} {...form.register("internalNotes")} /></div></div>
        <Button type="submit" disabled={saving} className="justify-self-end"><BriefcaseBusiness className="size-4" />{saving ? copy.saving : copy.save}</Button>
      </form>
    </div>
  </section>;
}

export default function JobApplications() {
  useSignals();
  const copy = JOB_APPLICATIONS_COPY[lang.value];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<JobApplication>();
  const [viewMode, setViewMode] = useState<CollectionViewMode>("grid");
  const { list, update, downloadCv, downloadingId } = useJobApplications({ page, search, status });
  useEffect(() => { const rows = list.data?.data; if (!rows?.length) return setSelected(undefined); setSelected((current) => current ? rows.find((item) => item.id === current.id) : undefined); }, [list.data]);
  const rows = list.data?.data ?? [];

  return <DashboardPageLayout title={copy.title} description={copy.description}>
    <FilterBar
      search={search}
      searchPlaceholder={copy.search}
      totalLabel={`${list.data?.totalCount ?? 0} ${(list.data?.totalCount ?? 0) === 1 ? copy.result : copy.results}`}
      selects={[{ name: "status", value: status, allLabel: copy.allStatuses, options: APPLICATION_STATUSES.map((item) => ({ value: item, label: applicationStatusLabel(copy, item) })) }]}
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
      grid={<div className="grid gap-5 p-5 sm:grid-cols-2 2xl:grid-cols-3">{rows.map((application) => <ApplicationCard key={application.id} application={application} copy={copy} locale={lang.value} downloading={downloadingId === application.id} onReview={() => setSelected(application)} onDownload={() => void downloadCv(application)} />)}</div>}
      table={<ApplicationsTable rows={rows} copy={copy} locale={lang.value} downloadingId={downloadingId} onReview={setSelected} onDownload={(application) => void downloadCv(application)} />}
      currentPage={page}
      pagesNumber={list.data?.pagesNumber ?? 0}
      onPageChange={setPage}
    />
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(undefined); }}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto p-0 sm:max-w-5xl">
        <ApplicationDetail application={selected} copy={copy} locale={lang.value} saving={update.isPending} downloading={downloadingId === selected?.id} onSave={(values) => selected && update.mutate({ id: selected.id, values })} onDownload={() => selected && void downloadCv(selected)} />
      </DialogContent>
    </Dialog>
  </DashboardPageLayout>;
}
