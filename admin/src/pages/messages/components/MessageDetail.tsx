import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CalendarDays, Mail, Phone, Send } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { messageStatusLabel, type MessagesCopyText } from "../messages-copy";
import { MESSAGE_STATUSES, type Message, type MessageForm } from "../types";

export function MessageDetail({ message, copy, locale, saving, onSave }: { message?: Message; copy: MessagesCopyText; locale: string; saving: boolean; onSave: (values: MessageForm) => void }) {
  const form = useForm<MessageForm>({ defaultValues: { status: "NEW", internalNotes: "" } });
  useEffect(() => { if (message) form.reset({ status: message.status, internalNotes: message.internalNotes ?? "" }); }, [message, form]);

  if (!message) return <section className="grid min-h-[620px] place-items-center rounded-3xl border border-alt/10 bg-white p-10 text-center text-sm text-muted-foreground shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card dark:shadow-black/20">{copy.choose}</section>;

  return <section className="overflow-hidden rounded-3xl border border-alt/10 bg-white shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card dark:shadow-black/20">
    <header className="border-b border-alt/10 bg-linear-to-r from-main/[.075] to-transparent p-5 dark:border-white/10 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-[10px] font-black tracking-[.2em] text-main uppercase">{copy.message}</p><h2 className="mt-2 text-2xl font-black text-alt dark:text-white">{message.fullName}</h2><p className="mt-1 text-sm text-alt/45 dark:text-white/45">{message.organization || message.email}</p></div>
        <Button asChild><a href={`mailto:${message.email}`}><Send className="size-4" />{copy.reply}</a></Button>
      </div>
    </header>
    <div className="grid gap-6 p-5 sm:p-7">
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`mailto:${message.email}`} className="flex items-center gap-3 rounded-2xl bg-main/[.045] p-4 text-sm text-alt dark:text-white"><Mail className="size-4 text-main" /><span><small className="block text-[10px] font-bold text-muted-foreground">{copy.email}</small>{message.email}</span></a>
        <a href={message.phone ? `tel:${message.phone}` : undefined} className="flex items-center gap-3 rounded-2xl bg-main/[.045] p-4 text-sm text-alt dark:text-white"><Phone className="size-4 text-main" /><span><small className="block text-[10px] font-bold text-muted-foreground">{copy.phone}</small>{message.phone || "—"}</span></a>
        <div className="flex items-center gap-3 rounded-2xl bg-main/[.045] p-4 text-sm text-alt dark:text-white"><Building2 className="size-4 text-main" /><span><small className="block text-[10px] font-bold text-muted-foreground">{copy.company}</small>{message.organization || "—"}</span></div>
        <div className="flex items-center gap-3 rounded-2xl bg-main/[.045] p-4 text-sm text-alt dark:text-white"><CalendarDays className="size-4 text-main" /><span><small className="block text-[10px] font-bold text-muted-foreground">{copy.received}</small>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.createdAt))}</span></div>
      </div>
      <div><h3 className="mb-3 text-xs font-black text-alt dark:text-white">{copy.message}</h3><p className="rounded-2xl border border-alt/8 bg-alt/[.025] p-5 text-sm leading-7 text-alt/70 dark:border-white/8 dark:bg-white/[.025] dark:text-white/70">{message.message}</p></div>
      <form onSubmit={form.handleSubmit(onSave)} className="grid gap-5 border-t border-alt/10 pt-6 dark:border-white/10">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid content-start gap-2"><Label>{copy.status}</Label><Controller control={form.control} name="status" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MESSAGE_STATUSES.map((item) => <SelectItem key={item} value={item}>{messageStatusLabel(copy, item)}</SelectItem>)}</SelectContent></Select>} /></div>
          <div className="grid gap-2"><Label htmlFor="internalNotes">{copy.notes}</Label><Textarea id="internalNotes" placeholder={copy.notesHint} {...form.register("internalNotes")} /></div>
        </div>
        <Button type="submit" disabled={saving} className="justify-self-end"><Mail className="size-4" />{saving ? copy.saving : copy.save}</Button>
      </form>
    </div>
  </section>;
}
