import type { RouteChapterConfig } from "@/components/RouteScrollExperience"

export type RouteSectionBody = {
  badge?: string
  eyebrow?: string
  heading?: string
  subheading?: string
  chapterLabel?: string
  errorMessage?: string
  aboutWhy?: {
    quoteTitle: string
    quoteText: string
    hoverHint: string
    reasons: Array<{ icon: string; title: string; description: string }>
  }
  aboutTerminal?: {
    lines: Array<{ command: string; response: string; tone: string }>
  }
  servicesDetail?: {
    intro: string
    activeLabel: string
    audienceLabel: string
    approachLabel: string
    outcomeLabel: string
    ctaText: string
    ctaButton: string
    ctaToast: string
    services: Array<{
      id: string
      icon: string
      tabLabel: string
      title: string
      subtitle: string
      audience: string
      approach: string
      listTitle: string
      listItems: Array<{ text: string }>
      outcome: string
    }>
    workWaysTitle: string
    workModels: Array<{ icon: string; title: string; description: string }>
    bottomTitle: string
    bottomDescription: string
    bottomButton: string
    bottomToast: string
  }
  lifecycle?: {
    workflowLabel: string
    activePhaseLabel: string
    steps: Array<{ number: string; icon: string; title: string; description: string }>
  }
  projectsShowcase?: {
    emptyMessage: string
    detailsLabel: string
    visitLabel: string
    featuredLabel: string
    backLabel: string
    clientLabel: string
    yearLabel: string
    servicesLabel: string
    technologiesLabel: string
    nextProjectLabel: string
    allProjectsLabel: string
    notFoundTitle: string
    notFoundMessage: string
    contextLabel: string
    challengeLabel: string
    solutionLabel: string
    capabilitiesLabel: string
    impactLabel: string
    statusLabels: Array<{ value: string; label: string }>
  }
  caseStudies?: {
    activeLabel: string
    contextLabel: string
    challengesLabel: string
    solutionLabel: string
    elementsLabel: string
    resultsLabel: string
    commonTitle: string
    commonItems: Array<{ text: string }>
    ctaText: string
    primaryButton: string
    primaryToast: string
    secondaryButton: string
    secondaryToast: string
    cases: Array<{
      id: string
      icon: string
      tabLabel: string
      title: string
      subtitle: string
      context: string
      challenges: string
      solution: string
      elements: string
      results: Array<{ text: string }>
    }>
  }
  teamPeople?: {
    memberLabel: string
    openProfileLabel: string
    backToTeamLabel: string
    closeProfileLabel: string
    linkedInLabel: string
    previousMemberLabel: string
    nextMemberLabel: string
    emptyMessage: string
  }
  teamCareers?: {
    privacy: string
    successTitle: string
    successBody: string
    nameLabel: string
    emailLabel: string
    phoneLabel: string
    roleLabel: string
    rolePlaceholder: string
    linkedInLabel: string
    linkedInPlaceholder: string
    portfolioLabel: string
    portfolioPlaceholder: string
    noteLabel: string
    cvLabel: string
    cvHint: string
    errorMessage: string
    submittingLabel: string
    submitLabel: string
  }
  wizard?: {
    questions?: Array<{
      id: string
      title: string
      description: string
      icon?: "blocks" | "clock" | "gauge" | "layers" | "monitor" | "wrench"
      options: Array<{
        value: string
        title: string
        description: string
        budget: number
        weeks: number
        multiplier?: number
        weekMultiplier?: number
      }>
    }>
  }
  contact?: ContactContent
}

export type ContactContent = {
  namePlaceholder?: string
  organizationPlaceholder?: string
  emailPlaceholder?: string
  phonePlaceholder?: string
  messagePlaceholder?: string
  formTitle?: string
  formSubtitle?: string
  privacy?: string
  successTitle?: string
  successMessage?: string
  errorMessage?: string
  chatLabel?: string
  chatStatus?: string
  chatTitle?: string
  chatIntro?: string
  botIntro?: string
  chatAction?: string
  chatScenarios?: Array<{
    id: string
    prompt: string
    user: string
    reply: string
    impact: string
    metric: string
    metricLabel: string
  }>
  processTitle?: string
  processSteps?: Array<{ number: string; title: string; description: string }>
  methodsTitle?: string
  methods?: Array<{ type: string; label: string; value: string; href: string; note?: string }>
  officeTitle?: string
  officeAddress?: string
  officeNote?: string
  notice?: string
  companyLinks?: Array<{ label: string; url: string }>
}

export type RouteSectionComponent =
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
  | "project-wizard"

export type RouteSection = {
  id: string
  pageId: string
  key: string
  status?: string
  sortOrder?: number
  anchor?: string | null
  content?: {
    component?: RouteSectionComponent
    visible?: boolean
  } | null
  body?: RouteSectionBody
}

export type RoutePageContent = {
  sections: RouteSection[]
  chapters: RouteChapterConfig[]
}

export type ApiEnvelope<T> = { materials: T; message: string }
export type ApiCollection<T> = { data: T[]; pagesNumber: number; totalCount: number }
