import type { Lang } from "@/context/global";

const en = {
  title: "Analytics",
  description: "A reliable snapshot of content, projects, and incoming opportunities.",
  last7: "Last 7 days",
  last30: "Last 30 days",
  last90: "Last 90 days",
  publishedPages: "Published pages",
  activeServices: "Active services",
  publicProjects: "Public projects",
  newMessages: "New messages",
  publishedPosts: "Published posts",
  averageProgress: "Average progress",
  activity: "Message activity",
  activityHint: "New inquiries received during the selected period.",
  messageStatus: "Message status",
  projectStatus: "Project status",
  recentMessages: "Recent messages",
  sender: "Sender",
  company: "Company",
  status: "Status",
  received: "Received",
  noData: "No data in this period.",
  openInbox: "Open inbox",
  freshness: "Live database snapshot",
  source: "Source: RightCode CMS records",
} as const;

type AnalyticsCopy = Record<keyof typeof en, string>;

export const ANALYTICS_COPY: Record<Lang, AnalyticsCopy> = {
  en,
  ar: {
    title: "التحليلات",
    description: "ملخص موثوق للمحتوى والمشاريع والفرص الواردة.",
    last7: "آخر 7 أيام",
    last30: "آخر 30 يوماً",
    last90: "آخر 90 يوماً",
    publishedPages: "الصفحات المنشورة",
    activeServices: "الخدمات النشطة",
    publicProjects: "المشاريع العامة",
    newMessages: "الرسائل الجديدة",
    publishedPosts: "المقالات المنشورة",
    averageProgress: "متوسط التقدم",
    activity: "نشاط الرسائل",
    activityHint: "الطلبات الجديدة خلال الفترة المحددة.",
    messageStatus: "حالة الرسائل",
    projectStatus: "حالة المشاريع",
    recentMessages: "أحدث الرسائل",
    sender: "المرسل",
    company: "الشركة",
    status: "الحالة",
    received: "تاريخ الاستلام",
    noData: "لا توجد بيانات خلال هذه الفترة.",
    openInbox: "فتح صندوق الوارد",
    freshness: "لقطة مباشرة من قاعدة البيانات",
    source: "المصدر: سجلات نظام RightCode",
  },
  tr: {
    title: "Analizler",
    description: "İçerik, projeler ve gelen fırsatların güvenilir özeti.",
    last7: "Son 7 gün",
    last30: "Son 30 gün",
    last90: "Son 90 gün",
    publishedPages: "Yayınlanan sayfalar",
    activeServices: "Aktif hizmetler",
    publicProjects: "Herkese açık projeler",
    newMessages: "Yeni mesajlar",
    publishedPosts: "Yayınlanan yazılar",
    averageProgress: "Ortalama ilerleme",
    activity: "Mesaj etkinliği",
    activityHint: "Seçilen dönemde alınan yeni talepler.",
    messageStatus: "Mesaj durumu",
    projectStatus: "Proje durumu",
    recentMessages: "Son mesajlar",
    sender: "Gönderen",
    company: "Şirket",
    status: "Durum",
    received: "Alındı",
    noData: "Bu dönemde veri yok.",
    openInbox: "Gelen kutusunu aç",
    freshness: "Canlı veritabanı özeti",
    source: "Kaynak: RightCode CMS kayıtları",
  },
};

const STATUS_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    NEW: "New", REVIEWING: "Reviewing", CONTACTED: "Contacted", QUALIFIED: "Qualified", PROPOSAL_SENT: "Proposal sent", WON: "Won", LOST: "Lost", SPAM: "Spam", ARCHIVED: "Archived",
    PLANNING: "Planning", ACTIVE: "Active", ON_HOLD: "On hold", IN_REVIEW: "In review", COMPLETED: "Completed", CANCELLED: "Cancelled",
  },
  ar: {
    NEW: "جديدة", REVIEWING: "قيد المراجعة", CONTACTED: "تم التواصل", QUALIFIED: "مؤهلة", PROPOSAL_SENT: "تم إرسال العرض", WON: "ناجحة", LOST: "غير ناجحة", SPAM: "مزعجة", ARCHIVED: "مؤرشفة",
    PLANNING: "قيد التخطيط", ACTIVE: "نشط", ON_HOLD: "معلّق", IN_REVIEW: "قيد المراجعة", COMPLETED: "مكتمل", CANCELLED: "ملغى",
  },
  tr: {
    NEW: "Yeni", REVIEWING: "İnceleniyor", CONTACTED: "İletişime geçildi", QUALIFIED: "Uygun", PROPOSAL_SENT: "Teklif gönderildi", WON: "Kazanıldı", LOST: "Kaybedildi", SPAM: "Spam", ARCHIVED: "Arşivlendi",
    PLANNING: "Planlanıyor", ACTIVE: "Aktif", ON_HOLD: "Beklemede", IN_REVIEW: "İncelemede", COMPLETED: "Tamamlandı", CANCELLED: "İptal edildi",
  },
};

export function analyticsStatusLabel(locale: Lang, status: string) {
  return STATUS_LABELS[locale][status] ?? status.replaceAll("_", " ");
}

export type AnalyticsCopyText = AnalyticsCopy;
