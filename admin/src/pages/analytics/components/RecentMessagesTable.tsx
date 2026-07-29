import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Lang } from "@/context/global";
import { analyticsStatusLabel, type AnalyticsCopyText } from "../analytics-copy";
import type { RecentInquiry } from "../types";

export function RecentMessagesTable({ rows, copy, locale }: { rows: RecentInquiry[]; copy: AnalyticsCopyText; locale: Lang }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-alt/10 bg-white shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card dark:shadow-black/20">
      <header className="flex items-center justify-between gap-4 border-b border-alt/10 px-5 py-5 dark:border-white/10 sm:px-7">
        <h2 className="font-black text-alt dark:text-white">{copy.recentMessages}</h2>
        <Button asChild variant="outline" size="sm"><Link to="/messages">{copy.openInbox}<ArrowUpRight className="size-4 rtl:-scale-x-100" /></Link></Button>
      </header>
      {rows.length ? <div className="overflow-x-auto"><Table>
        <TableHeader><TableRow><TableHead>{copy.sender}</TableHead><TableHead>{copy.company}</TableHead><TableHead>{copy.status}</TableHead><TableHead>{copy.received}</TableHead></TableRow></TableHeader>
        <TableBody>{rows.map((row) => <TableRow key={row.id}>
          <TableCell><div className="font-bold text-alt dark:text-white">{row.fullName}</div><div className="text-xs text-muted-foreground">{row.email}</div></TableCell>
          <TableCell>{row.organization || "—"}</TableCell>
          <TableCell><Badge>{analyticsStatusLabel(locale, row.status)}</Badge></TableCell>
          <TableCell className="whitespace-nowrap">{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(row.createdAt))}</TableCell>
        </TableRow>)}</TableBody>
      </Table></div> : <p className="p-12 text-center text-sm text-muted-foreground">{copy.noData}</p>}
    </section>
  );
}
