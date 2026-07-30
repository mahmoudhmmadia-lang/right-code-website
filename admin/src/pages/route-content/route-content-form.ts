import type {
  ContactContentFields,
  RouteContentFormValues,
  RouteContentLocale,
  RoutePageConfig,
  RouteSectionConfig,
  RouteSectionFields,
  RouteSectionRecord,
} from "./types";
import { ROUTE_CONTENT_LOCALES } from "./types";

const emptyFields = (): RouteSectionFields => ({
  badge: "",
  eyebrow: "",
  heading: "",
  subheading: "",
  chapterLabel: "",
  errorMessage: "",
});

const emptyAboutWhy = () => ({ quoteTitle: "", quoteText: "", hoverHint: "", reasons: [{ icon: "link", title: "", description: "" }] });
const emptyAboutTerminal = () => ({ lines: [{ command: "", response: "", tone: "green" }] });
const emptyServicesDetail = () => ({
  intro: "", activeLabel: "", audienceLabel: "", approachLabel: "", outcomeLabel: "", ctaText: "", ctaButton: "", ctaToast: "",
  services: [{ id: "service", icon: "search", tabLabel: "", title: "", subtitle: "", audience: "", approach: "", listTitle: "", listItems: [{ text: "" }], outcome: "" }],
  workWaysTitle: "", workModels: [{ icon: "compass", title: "", description: "" }], bottomTitle: "", bottomDescription: "", bottomButton: "", bottomToast: "",
});
const emptyLifecycle = () => ({ workflowLabel: "", activePhaseLabel: "", steps: [{ number: "01", icon: "compass", title: "", description: "" }] });
const emptyProjectsShowcase = () => ({
  emptyMessage: "",
  detailsLabel: "",
  visitLabel: "",
  featuredLabel: "",
  backLabel: "",
  clientLabel: "",
  yearLabel: "",
  servicesLabel: "",
  technologiesLabel: "",
  nextProjectLabel: "",
  allProjectsLabel: "",
  notFoundTitle: "",
  notFoundMessage: "",
  contextLabel: "",
  challengeLabel: "",
  solutionLabel: "",
  capabilitiesLabel: "",
  impactLabel: "",
  statusLabels: [{ value: "PLANNING", label: "" }],
});
const emptyCaseStudies = () => ({
  activeLabel: "", contextLabel: "", challengesLabel: "", solutionLabel: "", elementsLabel: "", resultsLabel: "", commonTitle: "",
  commonItems: [{ text: "" }], ctaText: "", primaryButton: "", primaryToast: "", secondaryButton: "", secondaryToast: "",
  cases: [{ id: "case", icon: "public", tabLabel: "", title: "", subtitle: "", context: "", challenges: "", solution: "", elements: "", results: [{ text: "" }] }],
});
const emptyTeamPeople = () => ({ memberLabel: "", openProfileLabel: "", backToTeamLabel: "", closeProfileLabel: "", linkedInLabel: "", previousMemberLabel: "", nextMemberLabel: "", emptyMessage: "" });
const emptyTeamCareers = () => ({ privacy: "", successTitle: "", successBody: "", nameLabel: "", emailLabel: "", phoneLabel: "", roleLabel: "", rolePlaceholder: "", linkedInLabel: "", linkedInPlaceholder: "", portfolioLabel: "", portfolioPlaceholder: "", noteLabel: "", cvLabel: "", cvHint: "", errorMessage: "", submittingLabel: "", submitLabel: "" });
const emptyWizard = () => ({ questions: [{ id: "question", icon: "layers", title: "", description: "", options: [{ value: "option", title: "", description: "", budget: 0, weeks: 0, multiplier: 1, weekMultiplier: 1 }] }] });

export const emptyContactContent = (): ContactContentFields => ({
  namePlaceholder: "",
  organizationPlaceholder: "",
  emailPlaceholder: "",
  phonePlaceholder: "",
  messagePlaceholder: "",
  formTitle: "",
  formSubtitle: "",
  privacy: "",
  successTitle: "",
  successMessage: "",
  errorMessage: "",
  chatLabel: "",
  chatStatus: "",
  chatTitle: "",
  chatIntro: "",
  botIntro: "",
  chatAction: "",
  chatScenarios: [{ id: "", prompt: "", user: "", reply: "", impact: "", metric: "", metricLabel: "" }],
  processTitle: "",
  processSteps: [{ number: "01", title: "", description: "" }],
  methodsTitle: "",
  methods: [{ type: "email", label: "", value: "", href: "", note: "" }],
  officeTitle: "",
  officeAddress: "",
  officeNote: "",
  notice: "",
  companyLinks: [{ label: "", url: "" }],
});

function fieldsFrom(section?: RouteSectionRecord, locale?: RouteContentLocale): RouteSectionFields {
  const body = locale ? section?.translations?.[locale]?.body : undefined;
  return {
    ...emptyFields(),
    ...body,
    aboutWhy: body?.aboutWhy ? { ...emptyAboutWhy(), ...body.aboutWhy } : undefined,
    aboutTerminal: body?.aboutTerminal ? { ...emptyAboutTerminal(), ...body.aboutTerminal } : undefined,
    servicesDetail: body?.servicesDetail ? { ...emptyServicesDetail(), ...body.servicesDetail } : undefined,
    lifecycle: body?.lifecycle ? { ...emptyLifecycle(), ...body.lifecycle } : undefined,
    projectsShowcase: body?.projectsShowcase ? { ...emptyProjectsShowcase(), ...body.projectsShowcase } : undefined,
    caseStudies: body?.caseStudies ? { ...emptyCaseStudies(), ...body.caseStudies } : undefined,
    teamPeople: body?.teamPeople ? { ...emptyTeamPeople(), ...body.teamPeople } : undefined,
    teamCareers: body?.teamCareers ? { ...emptyTeamCareers(), ...body.teamCareers } : undefined,
    wizard: body?.wizard ? { ...emptyWizard(), ...body.wizard } : undefined,
    contact: body?.contact ? { ...emptyContactContent(), ...body.contact } : undefined,
  };
}

function sectionFields(sectionConfig: RouteSectionConfig, section?: RouteSectionRecord, locale?: RouteContentLocale): RouteSectionFields {
  const fields = fieldsFrom(section, locale);
  if (sectionConfig.key === "contact-overview" && !fields.contact) {
    fields.contact = emptyContactContent();
  }
  if (sectionConfig.key === "about-why" && !fields.aboutWhy) fields.aboutWhy = emptyAboutWhy();
  if (sectionConfig.key === "about-terminal" && !fields.aboutTerminal) fields.aboutTerminal = emptyAboutTerminal();
  if (sectionConfig.key === "services-detail" && !fields.servicesDetail) fields.servicesDetail = emptyServicesDetail();
  if (sectionConfig.key === "services-lifecycle" && !fields.lifecycle) fields.lifecycle = emptyLifecycle();
  if (sectionConfig.key === "work-projects" && !fields.projectsShowcase) fields.projectsShowcase = emptyProjectsShowcase();
  if (sectionConfig.key === "work-case-studies" && !fields.caseStudies) fields.caseStudies = emptyCaseStudies();
  if (sectionConfig.key === "team-people" && !fields.teamPeople) fields.teamPeople = emptyTeamPeople();
  if (sectionConfig.key === "team-careers" && !fields.teamCareers) fields.teamCareers = emptyTeamCareers();
  if (sectionConfig.key === "project-wizard" && !fields.wizard) fields.wizard = emptyWizard();
  return fields;
}

export function routeContentDefaults(config: RoutePageConfig, records: RouteSectionRecord[] = []): RouteContentFormValues {
  const byKey = new Map(records.map((record) => [record.key, record]));
  const status = (records.find((record) => record.status)?.status ?? "PUBLISHED") as RouteContentFormValues["status"];

  return {
    status,
    visibility: Object.fromEntries(
      config.sections.map((section) => [section.key, byKey.get(section.key)?.content?.visible !== false]),
    ),
    translations: Object.fromEntries(
      ROUTE_CONTENT_LOCALES.map((locale) => [
        locale,
        Object.fromEntries(
          config.sections.map((section) => [section.key, sectionFields(section, byKey.get(section.key), locale)]),
        ),
      ]),
    ) as RouteContentFormValues["translations"],
  };
}

function cleanFields(fields: RouteSectionFields): RouteSectionFields {
  const generatedId = (prefix: string, value: string | undefined, index: number) =>
    value?.trim() || `${prefix}-${index + 1}`;
  const cleaned: RouteSectionFields = {
    badge: fields.badge.trim(),
    eyebrow: fields.eyebrow.trim(),
    heading: fields.heading.trim(),
    subheading: fields.subheading.trim(),
    chapterLabel: fields.chapterLabel.trim(),
    errorMessage: fields.errorMessage.trim(),
  };
  if (fields.aboutWhy) cleaned.aboutWhy = fields.aboutWhy;
  if (fields.aboutTerminal) cleaned.aboutTerminal = fields.aboutTerminal;
  if (fields.servicesDetail) {
    cleaned.servicesDetail = {
      ...fields.servicesDetail,
      services: fields.servicesDetail.services.map((item, index) => ({
        ...item,
        id: generatedId("service", item.id, index),
      })),
    };
  }
  if (fields.lifecycle) cleaned.lifecycle = fields.lifecycle;
  if (fields.projectsShowcase) {
    cleaned.projectsShowcase = {
      ...fields.projectsShowcase,
      statusLabels: fields.projectsShowcase.statusLabels.map((item, index) => ({
        ...item,
        value: generatedId("status", item.value, index).toUpperCase().replaceAll("-", "_"),
      })),
    };
  }
  if (fields.caseStudies) {
    cleaned.caseStudies = {
      ...fields.caseStudies,
      cases: fields.caseStudies.cases.map((item, index) => ({
        ...item,
        id: generatedId("case", item.id, index),
      })),
    };
  }
  if (fields.teamPeople) cleaned.teamPeople = fields.teamPeople;
  if (fields.teamCareers) cleaned.teamCareers = fields.teamCareers;
  if (fields.wizard) {
    cleaned.wizard = {
      ...fields.wizard,
      questions: fields.wizard.questions.map((question, questionIndex) => ({
        ...question,
        id: generatedId("question", question.id, questionIndex),
        options: question.options.map((option, optionIndex) => ({
          ...option,
          value: generatedId("option", option.value, optionIndex),
        })),
      })),
    };
  }
  if (fields.contact) {
    cleaned.contact = {
      ...fields.contact,
      formTitle: fields.contact.formTitle.trim(),
      formSubtitle: fields.contact.formSubtitle.trim(),
      privacy: fields.contact.privacy.trim(),
      successTitle: fields.contact.successTitle.trim(),
      successMessage: fields.contact.successMessage.trim(),
      errorMessage: fields.contact.errorMessage.trim(),
      chatLabel: fields.contact.chatLabel.trim(),
      chatStatus: fields.contact.chatStatus.trim(),
      chatTitle: fields.contact.chatTitle.trim(),
      chatIntro: fields.contact.chatIntro.trim(),
      botIntro: fields.contact.botIntro.trim(),
      chatAction: fields.contact.chatAction.trim(),
      processTitle: fields.contact.processTitle.trim(),
      methodsTitle: fields.contact.methodsTitle.trim(),
      officeTitle: fields.contact.officeTitle.trim(),
      officeAddress: fields.contact.officeAddress.trim(),
      officeNote: fields.contact.officeNote.trim(),
      notice: fields.contact.notice.trim(),
      chatScenarios: fields.contact.chatScenarios.map((item, index) => ({
        id: generatedId("scenario", item.id, index),
        prompt: item.prompt.trim(),
        user: item.user.trim(),
        reply: item.reply.trim(),
        impact: item.impact.trim(),
        metric: item.metric.trim(),
        metricLabel: item.metricLabel.trim(),
      })),
      processSteps: fields.contact.processSteps.map((item) => ({
        number: item.number.trim(),
        title: item.title.trim(),
        description: item.description.trim(),
      })),
      methods: fields.contact.methods.map((item) => ({
        type: item.type.trim(),
        label: item.label.trim(),
        value: item.value.trim(),
        href: item.href.trim(),
        note: item.note?.trim(),
      })),
      companyLinks: fields.contact.companyLinks.map((item) => ({
        label: item.label.trim(),
        url: item.url.trim(),
      })),
    };
  }
  return cleaned;
}

export function routeSectionPayload({
  pageId,
  section,
  values,
}: {
  pageId: string;
  section: RouteSectionConfig;
  values: RouteContentFormValues;
}) {
  return {
    pageId,
    key: section.key,
    type: "ROUTE_SECTION",
    status: values.status,
    sortOrder: section.sortOrder,
    anchor: section.key,
    content: {
      component: section.component,
      visible: values.visibility[section.key] !== false,
    },
    translations: Object.fromEntries(
      ROUTE_CONTENT_LOCALES.map((locale) => [
        locale,
        { body: cleanFields(values.translations[locale][section.key]) },
      ]),
    ),
  };
}
