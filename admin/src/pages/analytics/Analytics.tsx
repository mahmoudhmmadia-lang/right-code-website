import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lang } from "@/context/global";
import { useSignals } from "@preact/signals-react/runtime";
import { BriefcaseBusiness, FileText, Gauge, Inbox, LayoutPanelTop, Newspaper } from "lucide-react";
import { useState } from "react";
import { ANALYTICS_COPY, analyticsStatusLabel } from "./analytics-copy";
import { ActivityChart } from "./components/ActivityChart";
import { MetricCard } from "./components/MetricCard";
import { RecentMessagesTable } from "./components/RecentMessagesTable";
import { StatusBreakdown } from "./components/StatusBreakdown";
import { useAnalytics } from "./useAnalytics";

export default function Analytics() {
  useSignals();
  const [days, setDays] = useState(30);
  const copy = ANALYTICS_COPY[lang.value];
  const analytics = useAnalytics(days);

  return <DashboardPageLayout title={copy.title} description={copy.description}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-alt/45 dark:text-white/45">
        <p className="font-bold text-main">{copy.freshness}</p>
        {analytics.data ? <p>{new Intl.DateTimeFormat(lang.value, { dateStyle: "medium", timeStyle: "short" }).format(new Date(analytics.data.generatedAt))} · {copy.source}</p> : null}
      </div>
      <Select value={String(days)} onValueChange={(value) => setDays(Number(value))}>
        <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="7">{copy.last7}</SelectItem><SelectItem value="30">{copy.last30}</SelectItem><SelectItem value="90">{copy.last90}</SelectItem></SelectContent>
      </Select>
    </div>

    {analytics.isLoading ? <Loader fullScreen={false} /> : analytics.data ? <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard label={copy.newMessages} value={analytics.data.summary.newInquiries} icon={Inbox} accent />
        <MetricCard label={copy.publishedPages} value={analytics.data.summary.publishedPages} icon={FileText} />
        <MetricCard label={copy.activeServices} value={analytics.data.summary.activeServices} icon={LayoutPanelTop} />
        <MetricCard label={copy.publicProjects} value={analytics.data.summary.publicProjects} icon={BriefcaseBusiness} />
        <MetricCard label={copy.publishedPosts} value={analytics.data.summary.publishedPosts} icon={Newspaper} />
        <MetricCard label={copy.averageProgress} value={`${analytics.data.summary.averageProgress}%`} icon={Gauge} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,.7fr)]">
        <ActivityChart data={analytics.data.inquiryActivity} copy={copy} locale={lang.value} />
        <StatusBreakdown title={copy.messageStatus} rows={analytics.data.inquiryStatuses} empty={copy.noData} getLabel={(status) => analyticsStatusLabel(lang.value, status)} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(280px,.7fr)_minmax(0,1.6fr)]">
        <StatusBreakdown title={copy.projectStatus} rows={analytics.data.projectStatuses} empty={copy.noData} getLabel={(status) => analyticsStatusLabel(lang.value, status)} />
        <RecentMessagesTable rows={analytics.data.recentInquiries} copy={copy} locale={lang.value} />
      </div>
    </> : null}
  </DashboardPageLayout>;
}
