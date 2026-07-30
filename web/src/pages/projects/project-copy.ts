import type { Lang } from "@/context/global"
import type { RouteSectionBody } from "@/pages/site/types"

type ProjectCopy = NonNullable<RouteSectionBody["projectsShowcase"]>

const fallbacks: Record<Lang, Omit<ProjectCopy, "statusLabels">> = {
  en: {
    emptyMessage: "New project stories are being prepared.",
    detailsLabel: "View project",
    visitLabel: "Visit live project",
    featuredLabel: "Featured project",
    backLabel: "Back to all work",
    clientLabel: "Client / product",
    yearLabel: "Year",
    servicesLabel: "Services delivered",
    technologiesLabel: "Technology",
    nextProjectLabel: "Next project",
    allProjectsLabel: "View all projects",
    notFoundTitle: "Project not found",
    notFoundMessage: "This project is unavailable or is no longer public.",
    contextLabel: "Context",
    challengeLabel: "Challenge",
    solutionLabel: "Solution",
    capabilitiesLabel: "Core capabilities",
    impactLabel: "Impact",
  },
  ar: {
    emptyMessage: "نعمل على تجهيز قصص مشاريع جديدة.",
    detailsLabel: "عرض المشروع",
    visitLabel: "زيارة المشروع",
    featuredLabel: "مشروع مميز",
    backLabel: "العودة إلى جميع الأعمال",
    clientLabel: "العميل / المنتج",
    yearLabel: "السنة",
    servicesLabel: "الخدمات المقدمة",
    technologiesLabel: "التقنيات",
    nextProjectLabel: "المشروع التالي",
    allProjectsLabel: "عرض جميع المشاريع",
    notFoundTitle: "المشروع غير موجود",
    notFoundMessage: "هذا المشروع غير متاح أو لم يعد منشوراً للعامة.",
    contextLabel: "السياق",
    challengeLabel: "التحدي",
    solutionLabel: "الحل",
    capabilitiesLabel: "الإمكانات الأساسية",
    impactLabel: "الأثر",
  },
  tr: {
    emptyMessage: "Yeni proje hikâyeleri hazırlanıyor.",
    detailsLabel: "Projeyi görüntüle",
    visitLabel: "Canlı projeyi ziyaret et",
    featuredLabel: "Öne çıkan proje",
    backLabel: "Tüm çalışmalara dön",
    clientLabel: "Müşteri / ürün",
    yearLabel: "Yıl",
    servicesLabel: "Sunulan hizmetler",
    technologiesLabel: "Teknoloji",
    nextProjectLabel: "Sonraki proje",
    allProjectsLabel: "Tüm projeleri görüntüle",
    notFoundTitle: "Proje bulunamadı",
    notFoundMessage: "Bu proje kullanılamıyor veya artık herkese açık değil.",
    contextLabel: "Bağlam",
    challengeLabel: "Zorluk",
    solutionLabel: "Çözüm",
    capabilitiesLabel: "Temel yetenekler",
    impactLabel: "Etki",
  },
}

const statusFallbacks: Record<Lang, Record<string, string>> = {
  en: {
    PLANNING: "Planning",
    ACTIVE: "Active",
    ON_HOLD: "On hold",
    IN_REVIEW: "In review",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    ARCHIVED: "Archived",
  },
  ar: {
    PLANNING: "قيد التخطيط",
    ACTIVE: "نشط",
    ON_HOLD: "معلّق",
    IN_REVIEW: "قيد المراجعة",
    COMPLETED: "مكتمل",
    CANCELLED: "ملغى",
    ARCHIVED: "مؤرشف",
  },
  tr: {
    PLANNING: "Planlanıyor",
    ACTIVE: "Aktif",
    ON_HOLD: "Beklemede",
    IN_REVIEW: "İncelemede",
    COMPLETED: "Tamamlandı",
    CANCELLED: "İptal edildi",
    ARCHIVED: "Arşivlendi",
  },
}

export function projectCopy(locale: Lang, cms?: RouteSectionBody["projectsShowcase"]): ProjectCopy {
  return {
    ...fallbacks[locale],
    ...cms,
    statusLabels: cms?.statusLabels?.length
      ? cms.statusLabels
      : Object.entries(statusFallbacks[locale]).map(([value, label]) => ({ value, label })),
  }
}
