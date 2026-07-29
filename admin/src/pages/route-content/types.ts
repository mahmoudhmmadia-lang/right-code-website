export const ROUTE_CONTENT_LOCALES = ["en", "ar", "tr"] as const;
export type RouteContentLocale = (typeof ROUTE_CONTENT_LOCALES)[number];
export type RouteContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type RouteSectionKey =
  | "general"
  | "about-why"
  | "about-terminal"
  | "services-detail"
  | "services-lifecycle"
  | "work-projects"
  | "work-case-studies"
  | "team-people"
  | "team-careers"
  | "contact-overview"
  | "blog-index"
  | "project-wizard";

export type RouteSectionConfig = {
  key: Exclude<RouteSectionKey, "general">;
  label: Record<RouteContentLocale, string>;
  component: string;
  sortOrder: number;
};

export type RoutePageConfig = {
  pageId: string;
  title: Record<RouteContentLocale, string>;
  description: Record<RouteContentLocale, string>;
  sections: RouteSectionConfig[];
};

export type TextItem = { text: string };
export type CopyEntry = { key: string; value: string };
export type AboutWhyFields = {
  quoteTitle: string;
  quoteText: string;
  hoverHint: string;
  reasons: Array<{ icon: string; title: string; description: string }>;
};
export type AboutTerminalFields = {
  lines: Array<{ command: string; response: string; tone: string }>;
};
export type ServicesDetailFields = {
  intro: string;
  activeLabel: string;
  audienceLabel: string;
  approachLabel: string;
  outcomeLabel: string;
  ctaText: string;
  ctaButton: string;
  ctaToast: string;
  services: Array<{
    id: string;
    icon: string;
    tabLabel: string;
    title: string;
    subtitle: string;
    audience: string;
    approach: string;
    listTitle: string;
    listItems: TextItem[];
    outcome: string;
  }>;
  workWaysTitle: string;
  workModels: Array<{ icon: string; title: string; description: string }>;
  bottomTitle: string;
  bottomDescription: string;
  bottomButton: string;
  bottomToast: string;
};
export type LifecycleFields = {
  workflowLabel: string;
  activePhaseLabel: string;
  steps: Array<{ number: string; icon: string; title: string; description: string }>;
};
export type ProjectsShowcaseFields = {
  emptyMessage: string;
  statusLabels: Array<{ value: string; label: string }>;
};
export type CaseStudiesFields = {
  activeLabel: string;
  contextLabel: string;
  challengesLabel: string;
  solutionLabel: string;
  elementsLabel: string;
  resultsLabel: string;
  commonTitle: string;
  commonItems: TextItem[];
  ctaText: string;
  primaryButton: string;
  primaryToast: string;
  secondaryButton: string;
  secondaryToast: string;
  cases: Array<{
    id: string;
    icon: string;
    tabLabel: string;
    title: string;
    subtitle: string;
    context: string;
    challenges: string;
    solution: string;
    elements: string;
    results: TextItem[];
  }>;
};
export type TeamPeopleFields = {
  memberLabel: string;
  openProfileLabel: string;
  backToTeamLabel: string;
  closeProfileLabel: string;
  linkedInLabel: string;
  previousMemberLabel: string;
  nextMemberLabel: string;
  emptyMessage: string;
};
export type TeamCareersFields = {
  privacy: string;
  successTitle: string;
  successBody: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  roleLabel: string;
  rolePlaceholder: string;
  linkedInLabel: string;
  linkedInPlaceholder: string;
  portfolioLabel: string;
  portfolioPlaceholder: string;
  noteLabel: string;
  cvLabel: string;
  cvHint: string;
  errorMessage: string;
  submittingLabel: string;
  submitLabel: string;
};
export type WizardFields = {
  questions: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    options: Array<{
      value: string;
      title: string;
      description: string;
      budget: number;
      weeks: number;
      multiplier?: number;
      weekMultiplier?: number;
    }>;
  }>;
};

export type RouteSectionFields = {
  badge: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  chapterLabel: string;
  errorMessage: string;
  copyEntries: CopyEntry[];
  copy?: Record<string, string>;
  aboutWhy?: AboutWhyFields;
  aboutTerminal?: AboutTerminalFields;
  servicesDetail?: ServicesDetailFields;
  lifecycle?: LifecycleFields;
  projectsShowcase?: ProjectsShowcaseFields;
  caseStudies?: CaseStudiesFields;
  teamPeople?: TeamPeopleFields;
  teamCareers?: TeamCareersFields;
  wizard?: WizardFields;
  contact?: ContactContentFields;
};

export type ContactContentFields = {
  namePlaceholder: string;
  organizationPlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  messagePlaceholder: string;
  formTitle: string;
  formSubtitle: string;
  privacy: string;
  successTitle: string;
  successMessage: string;
  errorMessage: string;
  chatLabel: string;
  chatStatus: string;
  chatTitle: string;
  chatIntro: string;
  botIntro: string;
  chatAction: string;
  chatScenarios: Array<{
    id: string;
    prompt: string;
    user: string;
    reply: string;
    impact: string;
    metric: string;
    metricLabel: string;
  }>;
  processTitle: string;
  processSteps: Array<{ number: string; title: string; description: string }>;
  methodsTitle: string;
  methods: Array<{ type: string; label: string; value: string; href: string; note?: string }>;
  officeTitle: string;
  officeAddress: string;
  officeNote: string;
  notice: string;
  companyLinks: Array<{ label: string; url: string }>;
};

export type RouteContentFormValues = {
  status: RouteContentStatus;
  visibility: Record<string, boolean>;
  translations: Record<RouteContentLocale, Record<string, RouteSectionFields>>;
};

export type RouteSectionRecord = {
  id: string;
  pageId: string;
  key: string;
  status: RouteContentStatus;
  sortOrder?: number;
  anchor?: string | null;
  content?: {
    component?: string;
    visible?: boolean;
  } | null;
  translations?: Partial<Record<RouteContentLocale, { body?: Partial<RouteSectionFields> }>>;
};

export type ApiEnvelope<T> = { materials: T; message: string };
export type ApiCollection<T> = { data: T[]; pagesNumber: number; totalCount: number };
