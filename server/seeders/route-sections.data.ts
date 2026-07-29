import { translator } from "./cms-translator.data";

const locales = ["en", "ar", "tr"] as const;
type Locale = (typeof locales)[number];
type CopyKey = keyof typeof translator.en;

type RouteSectionSeed = {
  pageId: string;
  key: string;
  type: string;
  status: string;
  sortOrder: number;
  anchor: string;
  content: {
    component: string;
    visible: boolean;
  };
  translations: Record<Locale, { body: Record<string, unknown> & { badge: string; heading: string; subheading: string; chapterLabel: string } }>;
};

const text = (locale: Locale, key: CopyKey) => translator[locale][key] ?? translator.en[key] ?? String(key);

const contactErrorMessages: Record<Locale, string> = {
  en: "We couldn't send your request. Please try again.",
  ar: "لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى.",
  tr: "Talebinizi gönderemedik. Lütfen tekrar deneyin.",
};

const projectErrorMessages: Record<Locale, string> = {
  en: "Project data is temporarily unavailable. Please try again shortly.",
  ar: "بيانات المشاريع غير متاحة مؤقتاً. يرجى المحاولة بعد قليل.",
  tr: "Proje verileri geçici olarak kullanılamıyor. Lütfen kısa süre sonra tekrar deneyin.",
};

const teamCareersEyebrows: Record<Locale, string> = {
  en: "Right Code / People behind the work",
  ar: "Right Code / الأشخاص خلف العمل",
  tr: "Right Code / İşin arkasındaki insanlar",
};

const projectEmptyMessages: Record<Locale, string> = {
  en: "No public projects are available yet.",
  ar: "لا توجد مشاريع عامة متاحة حالياً.",
  tr: "Henüz herkese açık proje bulunmuyor.",
};
const teamEmptyMessages: Record<Locale, string> = {
  en: "Team profiles will be available soon.",
  ar: "ستتوفر ملفات أعضاء الفريق قريباً.",
  tr: "Ekip profilleri yakında yayınlanacak.",
};
const projectStatusLabels: Record<Locale, Record<string, string>> = {
  en: { PLANNING: "Planning", ACTIVE: "Active", ON_HOLD: "On hold", IN_REVIEW: "In review", COMPLETED: "Completed", CANCELLED: "Cancelled", ARCHIVED: "Archived" },
  ar: { PLANNING: "قيد التخطيط", ACTIVE: "نشط", ON_HOLD: "متوقف مؤقتاً", IN_REVIEW: "قيد المراجعة", COMPLETED: "مكتمل", CANCELLED: "ملغى", ARCHIVED: "مؤرشف" },
  tr: { PLANNING: "Planlanıyor", ACTIVE: "Aktif", ON_HOLD: "Beklemede", IN_REVIEW: "İncelemede", COMPLETED: "Tamamlandı", CANCELLED: "İptal edildi", ARCHIVED: "Arşivlendi" },
};

function contactContent(locale: Locale) {
  const placeholders = {
    en: { name: "Ahmed Al-Rashid", organization: "Company or organization", email: "ahmed@company.com", phone: "+963 ...", message: "Tell us about your project..." },
    ar: { name: "أحمد الراشد", organization: "الشركة أو المؤسسة", email: "ahmed@company.com", phone: "+963 ...", message: "حدثنا عن مشروعك..." },
    tr: { name: "Ahmet Yılmaz", organization: "Şirket veya kuruluş", email: "ahmet@company.com", phone: "+90 ...", message: "Bize projenizden bahsedin..." },
  }[locale];
  return {
    namePlaceholder: placeholders.name,
    organizationPlaceholder: placeholders.organization,
    emailPlaceholder: placeholders.email,
    phonePlaceholder: placeholders.phone,
    messagePlaceholder: placeholders.message,
    formTitle: text(locale, "contactFormTitle"),
    formSubtitle: text(locale, "contactFormSubtitle"),
    privacy: text(locale, "contactPrivacy"),
    successTitle: text(locale, "contactSuccessTitle"),
    successMessage: text(locale, "contactSuccessMessage"),
    errorMessage: contactErrorMessages[locale],
    chatLabel: text(locale, "contactLiveChatLabel"),
    chatStatus: text(locale, "contactLiveChatStatus"),
    chatTitle: text(locale, "contactLiveChatTitle"),
    chatIntro: text(locale, "contactLiveChatIntro"),
    botIntro: text(locale, "contactLiveBotIntro"),
    chatAction: text(locale, "contactLiveChatAction"),
    chatScenarios: [
      {
        id: "platform",
        prompt: text(locale, "contactLivePromptPlatform"),
        user: text(locale, "contactLiveUserPlatform"),
        reply: text(locale, "contactLiveReplyPlatform"),
        impact: text(locale, "contactLiveImpactPlatform"),
        metric: "12+",
        metricLabel: text(locale, "contactLiveMetricPlatform"),
      },
      {
        id: "mobile",
        prompt: text(locale, "contactLivePromptMobile"),
        user: text(locale, "contactLiveUserMobile"),
        reply: text(locale, "contactLiveReplyMobile"),
        impact: text(locale, "contactLiveImpactMobile"),
        metric: "8wk",
        metricLabel: text(locale, "contactLiveMetricMobile"),
      },
      {
        id: "data",
        prompt: text(locale, "contactLivePromptData"),
        user: text(locale, "contactLiveUserData"),
        reply: text(locale, "contactLiveReplyData"),
        impact: text(locale, "contactLiveImpactData"),
        metric: "24/7",
        metricLabel: text(locale, "contactLiveMetricData"),
      },
    ],
    processTitle: text(locale, "contactWhatHappens"),
    processSteps: [1, 2, 3, 4].map((number) => ({
      number: String(number).padStart(2, "0"),
      title: text(locale, `contactStep${number}Title` as CopyKey),
      description: text(locale, `contactStep${number}Desc` as CopyKey),
    })),
    methodsTitle: text(locale, "contactPreferMethod"),
    methods: [
      {
        type: "email",
        label: text(locale, "contactEmailLabel"),
        value: "info@rightcode.io",
        href: "mailto:info@rightcode.io",
      },
      {
        type: "phone",
        label: text(locale, "contactPhoneLabel"),
        value: "+963 100 476 997",
        href: "tel:+963100476997",
        note: text(locale, "contactPhoneNote"),
      },
    ],
    officeTitle: text(locale, "contactOfficeTitle"),
    officeAddress: text(locale, "contactOfficeAddress"),
    officeNote: text(locale, "contactOfficeNote"),
    notice: text(locale, "contactNotReady"),
    companyLinks: [
      { label: "Facebook", url: "https://facebook.com/rightcode" },
      { label: "LinkedIn", url: "https://linkedin.com/company/rightcode" },
      { label: "Instagram", url: "https://instagram.com/rightcode" },
    ],
  };
}

function section({
  pageId,
  key,
  sortOrder,
  component,
  badge,
  heading,
  subheading,
  chapterLabel = badge,
}: {
  pageId: string;
  key: string;
  sortOrder: number;
  component: string;
  badge: CopyKey;
  heading: CopyKey;
  subheading: CopyKey;
  chapterLabel?: CopyKey;
}): RouteSectionSeed {
  return {
    pageId,
    key,
    type: "ROUTE_SECTION",
    status: "PUBLISHED",
    sortOrder,
    anchor: key,
    content: { component, visible: true },
    translations: Object.fromEntries(
      locales.map((locale) => [
        locale,
        {
          body: {
            badge: text(locale, badge),
            heading: text(locale, heading),
            subheading: text(locale, subheading),
            chapterLabel: text(locale, chapterLabel),
          },
        },
      ]),
    ) as RouteSectionSeed["translations"],
  };
}

export const routeSections = [
  section({
    pageId: "about",
    key: "about-why",
    sortOrder: 10,
    component: "about-why",
    badge: "whyUsBadge",
    heading: "whyUsTitle",
    subheading: "whyUsSubtitle",
  }),
  section({
    pageId: "about",
    key: "about-terminal",
    sortOrder: 20,
    component: "about-terminal",
    badge: "nav_about",
    heading: "nav_about",
    subheading: "whyUsQuoteText",
    chapterLabel: "nav_about",
  }),
  section({
    pageId: "services",
    key: "services-detail",
    sortOrder: 10,
    component: "services-detail",
    badge: "servicesBadge",
    heading: "servicesTitle",
    subheading: "servicesSubtitle",
  }),
  section({
    pageId: "services",
    key: "services-lifecycle",
    sortOrder: 20,
    component: "services-lifecycle",
    badge: "lifecycleBadge",
    heading: "lifecycleTitle",
    subheading: "lifecycleSubtitle",
  }),
  section({
    pageId: "work",
    key: "work-projects",
    sortOrder: 10,
    component: "work-projects",
    badge: "caseBadge",
    heading: "caseTitle",
    subheading: "caseSubtitle",
  }),
  section({
    pageId: "work",
    key: "work-case-studies",
    sortOrder: 20,
    component: "work-case-studies",
    badge: "caseStudiesBadge",
    heading: "caseStudiesTitle",
    subheading: "caseStudiesSubtitle",
  }),
  section({
    pageId: "team",
    key: "team-people",
    sortOrder: 10,
    component: "team-people",
    badge: "teamBadge",
    heading: "teamTitle",
    subheading: "teamSubtitle",
  }),
  section({
    pageId: "team",
    key: "team-careers",
    sortOrder: 20,
    component: "team-careers",
    badge: "teamBadge",
    heading: "teamOpenTitle",
    subheading: "teamOpenSubtitle",
    chapterLabel: "teamOpenTitle",
  }),
  section({
    pageId: "contact",
    key: "contact-overview",
    sortOrder: 10,
    component: "contact-overview",
    badge: "contactBadge",
    heading: "contactTitle",
    subheading: "contactSubtitle",
  }),
  section({
    pageId: "blog",
    key: "blog-index",
    sortOrder: 10,
    component: "blog-index",
    badge: "blogBadge",
    heading: "blogTitle",
    subheading: "blogSubtitle",
  }),
];

const copyPrefixes: Record<string, string[]> = {
  "about-why": ["whyUs"],
  "services-detail": ["service", "services", "workWays", "workDiscovery", "workEndToEnd", "workOngoing"],
  "services-lifecycle": ["lifecycle"],
  "work-projects": ["caseBadge", "caseTitle", "caseSubtitle"],
  "work-case-studies": ["case", "tabPublic", "tabNGO", "tabPrivate", "tabCross"],
  "team-people": ["team"],
  "team-careers": ["team", "career"],
  "contact-overview": ["contact", "stat1", "stat2"],
  "blog-index": ["blog"],
};

const terminalCopy: Record<Locale, Record<string, string>> = {
  en: {
    terminalWhoCommand: "$ whoami",
    terminalWhoAnswer: "rightcode — custom software for serious organizations",
    terminalMissionCommand: "$ cat mission.txt",
    terminalMissionAnswer: "We design and build secure, tailor-made digital systems so your operations run smoother, faster, and with real-time visibility.",
    terminalServicesCommand: "$ ls services/",
    terminalServicesAnswer: "custom-platforms/ dashboards/ integrations/ secure-hosting/ workflow-automation/",
    terminalContactCommand: "$ contact --book-call",
    terminalContactAnswer: "30-minute call. no sales pressure. → hello@rightcode.io",
  },
  ar: {
    terminalWhoCommand: "$ whoami",
    terminalWhoAnswer: "رايت كود — برمجيات مخصصة للمؤسسات الجادة",
    terminalMissionCommand: "$ cat mission.txt",
    terminalMissionAnswer: "نصمم ونبني أنظمة رقمية آمنة ومخصصة لتعمل عملياتك بسلاسة وسرعة ووضوح لحظي.",
    terminalServicesCommand: "$ ls services/",
    terminalServicesAnswer: "منصات-مخصصة/ لوحات-بيانات/ تكاملات/ استضافة-آمنة/ أتمتة-العمل/",
    terminalContactCommand: "$ contact --book-call",
    terminalContactAnswer: "مكالمة لمدة 30 دقيقة، دون ضغط مبيعات. ← hello@rightcode.io",
  },
  tr: {
    terminalWhoCommand: "$ whoami",
    terminalWhoAnswer: "rightcode — ciddi kuruluşlar için özel yazılım",
    terminalMissionCommand: "$ cat mission.txt",
    terminalMissionAnswer: "Operasyonlarınızın daha akıcı, hızlı ve gerçek zamanlı görünürlükle çalışması için güvenli, özel dijital sistemler tasarlayıp geliştiriyoruz.",
    terminalServicesCommand: "$ ls services/",
    terminalServicesAnswer: "özel-platformlar/ panolar/ entegrasyonlar/ güvenli-barındırma/ iş-akışı-otomasyonu/",
    terminalContactCommand: "$ contact --book-call",
    terminalContactAnswer: "30 dakikalık görüşme. satış baskısı yok. → hello@rightcode.io",
  },
};

const extraCopy: Record<Locale, Record<string, Record<string, string>>> = {
  en: {
    "services-detail": { servicesProjectToast: "Let's talk about your project", servicesNeedsToast: "Talk to us about your needs" },
    "work-case-studies": { caseActiveLabel: "Active case study", caseDiscussToast: "Let's discuss your challenge", caseExploreToast: "Explore our services" },
    "team-people": { teamPreviousMember: "Previous team member", teamNextMember: "Next team member" },
    "blog-index": { blogDefaultCategory: "Insight" },
  },
  ar: {
    "services-detail": { servicesProjectToast: "لنتحدث عن مشروعك", servicesNeedsToast: "تحدث معنا عن احتياجاتك" },
    "work-case-studies": { caseActiveLabel: "دراسة الحالة الحالية", caseDiscussToast: "لنتحدث عن تحديك", caseExploreToast: "استكشف خدماتنا" },
    "team-people": { teamPreviousMember: "عضو الفريق السابق", teamNextMember: "عضو الفريق التالي" },
    "blog-index": { blogDefaultCategory: "رؤية" },
  },
  tr: {
    "services-detail": { servicesProjectToast: "Projenizi konuşalım", servicesNeedsToast: "İhtiyaçlarınızı bizimle konuşun" },
    "work-case-studies": { caseActiveLabel: "Aktif vaka çalışması", caseDiscussToast: "Zorluğunuzu konuşalım", caseExploreToast: "Hizmetlerimizi keşfedin" },
    "team-people": { teamPreviousMember: "Önceki ekip üyesi", teamNextMember: "Sonraki ekip üyesi" },
    "blog-index": { blogDefaultCategory: "İçgörü" },
  },
};

for (const routeSection of routeSections) {
  for (const locale of locales) {
    const body = routeSection.translations[locale].body;
    const prefixes = copyPrefixes[routeSection.key] ?? [];
    body.copy = Object.fromEntries(
      Object.entries(translator[locale]).filter(([key]) => prefixes.some((prefix) => key.startsWith(prefix))),
    );
    if (routeSection.key === "about-terminal") body.copy = terminalCopy[locale];
    Object.assign(body.copy as Record<string, string>, extraCopy[locale][routeSection.key] ?? {});

    if (routeSection.key === "about-why") {
      body.aboutWhy = {
        quoteTitle: text(locale, "whyUsQuote"),
        quoteText: text(locale, "whyUsQuoteText"),
        hoverHint: text(locale, "whyUsHoverHint"),
        reasons: ["link", "shield", "clock", "globe", "star"].map((icon, index) => ({
          icon,
          title: text(locale, `whyUsReason${index + 1}Title` as CopyKey),
          description: text(locale, `whyUsReason${index + 1}Desc` as CopyKey),
        })),
      };
    }

    if (routeSection.key === "about-terminal") {
      const copy = terminalCopy[locale];
      body.aboutTerminal = {
        lines: [
          { command: copy.terminalWhoCommand, response: copy.terminalWhoAnswer, tone: "green" },
          { command: copy.terminalMissionCommand, response: copy.terminalMissionAnswer, tone: "blue" },
          { command: copy.terminalServicesCommand, response: copy.terminalServicesAnswer, tone: "yellow" },
          { command: copy.terminalContactCommand, response: copy.terminalContactAnswer, tone: "blue" },
        ],
      };
    }

    if (routeSection.key === "services-detail") {
      const serviceDefinitions = [
        { id: "discovery", icon: "search", tab: "serviceTabDiscovery", prefix: "serviceDiscovery" },
        { id: "platforms", icon: "monitor", tab: "serviceTabPlatforms", prefix: "servicePlatforms" },
        { id: "dashboards", icon: "chart", tab: "serviceTabDashboards", prefix: "serviceDashboards" },
        { id: "integration", icon: "blocks", tab: "serviceTabIntegration", prefix: "serviceIntegration" },
        { id: "hosting", icon: "shield", tab: "serviceTabHosting", prefix: "serviceHosting" },
        { id: "training", icon: "training", tab: "serviceTabTraining", prefix: "serviceTraining" },
      ] as const;
      body.servicesDetail = {
        intro: text(locale, "servicesIntro"),
        activeLabel: text(locale, "serviceActiveLabel"),
        audienceLabel: text(locale, "serviceForLabel"),
        approachLabel: text(locale, "serviceDoLabel"),
        outcomeLabel: text(locale, "serviceOutcomeLabel"),
        ctaText: text(locale, "servicesCTAText"),
        ctaButton: text(locale, "servicesCTAButton"),
        ctaToast: extraCopy[locale]["services-detail"].servicesProjectToast,
        services: serviceDefinitions.map(({ id, icon, tab, prefix }) => ({
          id,
          icon,
          tabLabel: text(locale, tab),
          title: text(locale, `${prefix}Title` as CopyKey),
          subtitle: text(locale, `${prefix}Subtitle` as CopyKey),
          audience: text(locale, `${prefix}ForText` as CopyKey),
          approach: text(locale, `${prefix}DoText` as CopyKey),
          listTitle: text(locale, `${prefix}ListTitle` as CopyKey),
          listItems: [1, 2, 3, 4, 5].map((number) => ({ text: text(locale, `${prefix}List${number}` as CopyKey) })),
          outcome: text(locale, `${prefix}OutcomeText` as CopyKey),
        })),
        workWaysTitle: text(locale, "workWaysTitle"),
        workModels: [
          { icon: "compass", title: text(locale, "workDiscoveryTitle"), description: text(locale, "workDiscoveryDesc") },
          { icon: "delivery", title: text(locale, "workEndToEndTitle"), description: text(locale, "workEndToEndDesc") },
          { icon: "ongoing", title: text(locale, "workOngoingTitle"), description: text(locale, "workOngoingDesc") },
        ],
        bottomTitle: text(locale, "servicesBottomCTATitle"),
        bottomDescription: text(locale, "servicesBottomCTADesc"),
        bottomButton: text(locale, "servicesBottomCTAButton"),
        bottomToast: extraCopy[locale]["services-detail"].servicesNeedsToast,
      };
    }

    if (routeSection.key === "services-lifecycle") {
      const icons = ["compass", "waypoints", "code", "rocket", "refresh"];
      body.lifecycle = {
        workflowLabel: text(locale, "lifecycleWorkflow"),
        activePhaseLabel: text(locale, "lifecycleActivePhase"),
        steps: icons.map((icon, index) => ({
          number: String(index + 1).padStart(2, "0"),
          icon,
          title: text(locale, `lifecycleStep${index + 1}Title` as CopyKey),
          description: text(locale, `lifecycleStep${index + 1}Desc` as CopyKey),
        })),
      };
    }

    if (routeSection.key === "work-projects") {
      body.projectsShowcase = {
        emptyMessage: projectEmptyMessages[locale],
        statusLabels: Object.entries(projectStatusLabels[locale]).map(([value, label]) => ({ value, label })),
      };
    }

    if (routeSection.key === "work-case-studies") {
      const definitions = [
        { id: "public", icon: "public", tab: "tabPublic", prefix: "casePublic" },
        { id: "ngo", icon: "ngo", tab: "tabNGO", prefix: "caseNgo" },
        { id: "private", icon: "private", tab: "tabPrivate", prefix: "casePrivate" },
        { id: "cross", icon: "cross", tab: "tabCross", prefix: "caseCross" },
      ] as const;
      body.caseStudies = {
        activeLabel: extraCopy[locale]["work-case-studies"].caseActiveLabel,
        contextLabel: text(locale, "caseContextLabel"),
        challengesLabel: text(locale, "caseChallengesLabel"),
        solutionLabel: text(locale, "caseSolutionLabel"),
        elementsLabel: text(locale, "caseElementsLabel"),
        resultsLabel: text(locale, "caseResultsLabel"),
        commonTitle: text(locale, "caseCommonTitle"),
        commonItems: [1, 2, 3].map((number) => ({ text: text(locale, `caseCommon${number}` as CopyKey) })),
        ctaText: text(locale, "caseCTAText"),
        primaryButton: text(locale, "caseCTAPrimary"),
        primaryToast: extraCopy[locale]["work-case-studies"].caseDiscussToast,
        secondaryButton: text(locale, "caseCTASecondary"),
        secondaryToast: extraCopy[locale]["work-case-studies"].caseExploreToast,
        cases: definitions.map(({ id, icon, tab, prefix }) => ({
          id,
          icon,
          tabLabel: text(locale, tab),
          title: text(locale, `${prefix}Title` as CopyKey),
          subtitle: text(locale, `${prefix}Subtitle` as CopyKey),
          context: text(locale, `${prefix}Context` as CopyKey),
          challenges: text(locale, `${prefix}Challenges` as CopyKey),
          solution: text(locale, `${prefix}Solution` as CopyKey),
          elements: text(locale, `${prefix}Elements` as CopyKey),
          results: [1, 2, 3, 4].map((number) => ({ text: text(locale, `${prefix}Result${number}` as CopyKey) })),
        })),
      };
    }

    if (routeSection.key === "team-people") {
      body.teamPeople = {
        memberLabel: text(locale, "teamMemberLabel"),
        openProfileLabel: text(locale, "teamOpenProfile"),
        backToTeamLabel: text(locale, "teamBackToTeam"),
        closeProfileLabel: text(locale, "teamCloseProfile"),
        linkedInLabel: text(locale, "careerLinkedIn"),
        previousMemberLabel: extraCopy[locale]["team-people"].teamPreviousMember,
        nextMemberLabel: extraCopy[locale]["team-people"].teamNextMember,
        emptyMessage: teamEmptyMessages[locale],
      };
    }

    if (routeSection.key === "team-careers") {
      body.teamCareers = {
        privacy: text(locale, "careerPrivacy"),
        successTitle: text(locale, "careerSuccessTitle"),
        successBody: text(locale, "careerSuccessBody"),
        nameLabel: text(locale, "careerName"),
        emailLabel: text(locale, "careerEmail"),
        phoneLabel: text(locale, "careerPhone"),
        roleLabel: text(locale, "careerRole"),
        rolePlaceholder: text(locale, "careerRolePlaceholder"),
        linkedInLabel: text(locale, "careerLinkedIn"),
        linkedInPlaceholder: "https://linkedin.com/in/...",
        portfolioLabel: text(locale, "careerPortfolio"),
        portfolioPlaceholder: "https://",
        noteLabel: text(locale, "careerNote"),
        cvLabel: text(locale, "careerCv"),
        cvHint: text(locale, "careerCvHint"),
        errorMessage: text(locale, "careerError"),
        submittingLabel: text(locale, "careerSubmitting"),
        submitLabel: text(locale, "careerSubmit"),
      };
    }
  }
}

const workProjectsSection = routeSections.find((section) => section.key === "work-projects");
if (workProjectsSection) {
  workProjectsSection.translations = Object.fromEntries(
    locales.map((locale) => [
      locale,
      {
        body: {
          ...workProjectsSection.translations[locale].body,
          errorMessage: projectErrorMessages[locale],
        },
      },
    ]),
  ) as RouteSectionSeed["translations"];
}

const teamCareersSection = routeSections.find((section) => section.key === "team-careers");
if (teamCareersSection) {
  teamCareersSection.translations = Object.fromEntries(
    locales.map((locale) => [
      locale,
      {
        body: {
          ...teamCareersSection.translations[locale].body,
          eyebrow: teamCareersEyebrows[locale],
        },
      },
    ]),
  ) as RouteSectionSeed["translations"];
}

const contactSection = routeSections.find((section) => section.key === "contact-overview");
if (contactSection) {
  contactSection.translations = Object.fromEntries(
    locales.map((locale) => [
      locale,
      {
        body: {
          ...contactSection.translations[locale].body,
          contact: contactContent(locale),
        },
      },
    ]),
  ) as RouteSectionSeed["translations"];
}
