import LangHandler from "@/components/LangHandler"
import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/context/site-content"
import type { ContactContent, RouteSectionBody } from "@/pages/site/types"
import type { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"
import { motion } from "framer-motion"
import {
  BarChart3,
  Bot,
  CheckCircle2,
  Code2,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  SendHorizontal,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { myAxios } from "@/api/myAxios"

type TranslationKey = keyof typeof translator.en

type LiveChatScenario = {
  id: string
  Icon: LucideIcon
  prompt: string
  user: string
  reply: string
  impact: string
  metric: string
  metricLabel: string
}

type LiveChatScenarioSeed = {
  id: string
  Icon: LucideIcon
  promptKey: TranslationKey
  userKey: TranslationKey
  replyKey: TranslationKey
  impactKey: TranslationKey
  metric: string
  metricKey: TranslationKey
}

const liveChatScenarioSeeds: LiveChatScenarioSeed[] = [
  {
    id: "platform",
    Icon: Workflow,
    promptKey: "contactLivePromptPlatform",
    userKey: "contactLiveUserPlatform",
    replyKey: "contactLiveReplyPlatform",
    impactKey: "contactLiveImpactPlatform",
    metric: "12+",
    metricKey: "contactLiveMetricPlatform",
  },
  {
    id: "mobile",
    Icon: Rocket,
    promptKey: "contactLivePromptMobile",
    userKey: "contactLiveUserMobile",
    replyKey: "contactLiveReplyMobile",
    impactKey: "contactLiveImpactMobile",
    metric: "8wk",
    metricKey: "contactLiveMetricMobile",
  },
  {
    id: "data",
    Icon: BarChart3,
    promptKey: "contactLivePromptData",
    userKey: "contactLiveUserData",
    replyKey: "contactLiveReplyData",
    impactKey: "contactLiveImpactData",
    metric: "24/7",
    metricKey: "contactLiveMetricData",
  },
]

function ContactUs({ content }: { content?: RouteSectionBody }) {
  useSignals()
  const cms = content?.contact
  const siteCopy = useSiteContent()
  const text = (key: TranslationKey) => siteCopy[key] ?? ""
  const [formData, setFormData] = useState({
    fullName: "",
    organization: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      await myAxios.post("/inquiries", formData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        fullName: "",
        organization: "",
        email: "",
        phone: "",
        message: "",
      })
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch {
      setIsSubmitting(false)
      setSubmitError(cms?.errorMessage ?? "")
    }
  }

  const defaultSteps: Array<{ number: string; title: string; description: string }> = [
    {
      number: "01",
      title: text("contactStep1Title"),
      description: text("contactStep1Desc"),
    },
    {
      number: "02",
      title: text("contactStep2Title"),
      description: text("contactStep2Desc"),
    },
    {
      number: "03",
      title: text("contactStep3Title"),
      description: text("contactStep3Desc"),
    },
    {
      number: "04",
      title: text("contactStep4Title"),
      description: text("contactStep4Desc"),
    },
  ]
  const steps = cms?.processSteps?.length ? cms.processSteps : defaultSteps
  const methods = cms?.methods?.length
    ? cms.methods
    : [
        { type: "email", label: text("contactEmailLabel"), value: "info@rightcode.io", href: "mailto:info@rightcode.io" },
        { type: "phone", label: text("contactPhoneLabel"), value: "+963 100 476 997", href: "tel:+963100476997", note: text("contactPhoneNote") },
      ]
  const scenarios = buildLiveChatScenarios(cms, text)

  return (
    <PageLayout
      title="contactTitle"
      subtitle="contactSubtitle"
      badge="contactBadge"
      badgeText={content?.badge}
      titleText={content?.heading}
      subtitleText={content?.subheading}
    >
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 h-96 w-96 rounded-full bg-main/5 blur-3xl transition-all duration-1000`}
        />
        <div
          className={`absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-alt/5 blur-3xl transition-all delay-300 duration-1000`}
        />
        <div className="absolute top-24 left-[8%] h-24 w-24 rotate-12 rounded-[1.75rem] border border-main/15 bg-main/[.025]" />
        <div className="absolute right-[10%] bottom-20 h-28 w-28 rounded-full border border-alt/10 bg-main/5" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#006b70_1px,transparent_1px),linear-gradient(0deg,#006b70_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] bg-[size:60px_60px]" />
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-7xl space-y-8">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            <LiveProjectChat content={cms} scenarios={scenarios} />
          </motion.div>

          <motion.div
            id="contact-form"
            className="relative self-start overflow-hidden rounded-3xl border border-alt/10 bg-card/82 p-6 shadow-[0_26px_80px_rgba(18,36,35,0.12)] backdrop-blur-md md:p-8 lg:col-span-7 dark:border-foreground/10 dark:bg-[#0a2022]/92 dark:shadow-[0_26px_80px_rgba(0,0,0,.2)]"
            initial={{ opacity: 0, y: 36, rotateX: 5 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-main/35 to-transparent" />
            <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-[2.5rem] border border-main/10" />
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-alt dark:text-foreground">
                {cms?.formTitle ?? <LangHandler content="contactFormTitle" />}
              </h3>
              <p className="mt-2 text-alt/60 dark:text-foreground/55">
                {cms?.formSubtitle ?? <LangHandler content="contactFormSubtitle" />}
              </p>
            </div>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-main to-alt">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-alt dark:text-foreground">
                  {cms?.successTitle ?? <LangHandler content="contactSuccessTitle" />}
                </h4>
                <p className="mt-2 text-alt/60 dark:text-foreground/55">
                  {cms?.successMessage ?? <LangHandler content="contactSuccessMessage" />}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1 block text-sm font-medium text-alt dark:text-foreground/75"
                  >
                    <LangHandler content="contactLabelName" />
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-main/20 bg-white/55 px-4 py-3 text-alt transition-all placeholder:text-alt/30 focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none dark:border-foreground/12 dark:bg-white/[.055] dark:text-foreground dark:placeholder:text-foreground/28"
                    placeholder={cms?.namePlaceholder}
                  />
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="mb-1 block text-sm font-medium text-alt dark:text-foreground/75"
                  >
                    <LangHandler content="contactLabelOrganization" />
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-main/20 bg-white/55 px-4 py-3 text-alt transition-all placeholder:text-alt/30 focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none dark:border-foreground/12 dark:bg-white/[.055] dark:text-foreground dark:placeholder:text-foreground/28"
                    placeholder={cms?.organizationPlaceholder}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-alt dark:text-foreground/75"
                  >
                    <LangHandler content="contactLabelEmail" />
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-main/20 bg-white/55 px-4 py-3 text-alt transition-all placeholder:text-alt/30 focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none dark:border-foreground/12 dark:bg-white/[.055] dark:text-foreground dark:placeholder:text-foreground/28"
                    placeholder={cms?.emailPlaceholder}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium text-alt dark:text-foreground/75"
                  >
                    <LangHandler content="contactLabelPhone" />
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-main/20 bg-white/55 px-4 py-3 text-alt transition-all placeholder:text-alt/30 focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none dark:border-foreground/12 dark:bg-white/[.055] dark:text-foreground dark:placeholder:text-foreground/28"
                    placeholder={cms?.phonePlaceholder}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium text-alt dark:text-foreground/75"
                  >
                    <LangHandler content="contactLabelMessage" />
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full resize-none rounded-xl border border-main/20 bg-white/55 px-4 py-3 text-alt transition-all placeholder:text-alt/30 focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none dark:border-foreground/12 dark:bg-white/[.055] dark:text-foreground dark:placeholder:text-foreground/28"
                    placeholder={cms?.messagePlaceholder}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-linear-to-r from-main to-alt py-3 text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 sm:col-span-2 dark:from-main dark:to-[#09868a] dark:text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <LangHandler content="contactSending" />
                    </div>
                  ) : (
                    <LangHandler content="contactSubmit" />
                  )}
                </Button>

                {submitError ? (
                  <p
                    role="alert"
                    className="rounded-xl bg-destructive/10 px-4 py-3 text-center text-sm text-destructive sm:col-span-2"
                  >
                    {submitError}
                  </p>
                ) : null}

                <p className="text-center text-xs text-alt/40 sm:col-span-2 dark:text-foreground/38">
                  {cms?.privacy ?? <LangHandler content="contactPrivacy" />}
                </p>
              </form>
            )}
          </motion.div>
        </div>

        <motion.section
          id="contact-process"
          className="scroll-mt-28 rounded-3xl border border-alt/10 bg-card/72 p-6 shadow-[0_18px_52px_rgba(18,36,35,0.08)] backdrop-blur-md md:p-8 dark:border-foreground/10 dark:bg-[#0a2022]/82"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-xl font-bold text-alt dark:text-foreground">
              {cms?.processTitle ?? <LangHandler content="contactWhatHappens" />}
            </h3>
            <div className="h-px min-w-28 flex-1 bg-gradient-to-r from-main/25 to-transparent" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <motion.article
                key={step.number}
                className="group relative min-h-44 overflow-hidden rounded-2xl border border-alt/10 bg-white/55 p-5 transition-all hover:border-main/20 hover:bg-white/85 dark:border-foreground/10 dark:bg-white/[.045] dark:hover:border-main/25 dark:hover:bg-white/[.075]"
                whileHover={{ y: -5 }}
              >
                <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-[1.75rem] border border-main/10 transition duration-500 group-hover:rotate-45 group-hover:bg-main/5" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-main/10 to-alt/10 font-bold text-main shadow-sm ring-1 ring-main/10 transition group-hover:bg-main group-hover:text-white">
                  {step.number}
                </div>
                <h4 className="mt-5 font-semibold text-alt dark:text-foreground/85">
                  {step.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-alt/50 dark:text-foreground/48">
                  {step.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-12">
          <motion.section
            id="contact-methods"
            className="scroll-mt-28 rounded-3xl border border-alt/10 bg-card/72 p-6 shadow-[0_18px_52px_rgba(18,36,35,0.08)] backdrop-blur-md md:p-8 lg:col-span-7 dark:border-foreground/10 dark:bg-[#0a2022]/82"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            <h3 className="mb-6 text-xl font-bold text-alt dark:text-foreground">
              {cms?.methodsTitle ?? <LangHandler content="contactPreferMethod" />}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {methods.map((method) => (
              <motion.a
                key={`${method.type}-${method.href}`}
                href={method.href}
                className="flex min-h-36 flex-col justify-between rounded-2xl border border-transparent bg-white/55 p-5 transition-all hover:border-main/15 hover:bg-white/85 dark:bg-white/[.045] dark:hover:border-main/25 dark:hover:bg-white/[.075]"
                whileHover={{ y: -4 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-main/10">
                  {method.type === "phone" ? <Phone className="h-6 w-6 text-main" /> : <Mail className="h-6 w-6 text-main" />}
                </div>
                <div className="mt-5">
                  <p className="text-sm text-alt/50 dark:text-foreground/45">
                    {method.label}
                  </p>
                  <p className="mt-1 font-medium text-main">{method.value}</p>
                </div>
              </motion.a>
              ))}
            </div>

            <p className="mt-4 text-xs text-alt/40 dark:text-foreground/38">
              {methods.find((method) => method.note)?.note ?? <LangHandler content="contactPhoneNote" />}
            </p>
          </motion.section>

          <motion.section
            className="rounded-3xl border border-alt/10 bg-card/72 p-6 shadow-[0_18px_52px_rgba(18,36,35,0.08)] backdrop-blur-md md:p-8 lg:col-span-5 dark:border-foreground/10 dark:bg-[#0a2022]/82"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-main/10">
                <MapPin className="h-6 w-6 text-main" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-alt dark:text-foreground">
                  {cms?.officeTitle ?? <LangHandler content="contactOfficeTitle" />}
                </h3>
                <p className="mt-4 text-alt/70 dark:text-foreground/68">
                  {cms?.officeAddress ?? <LangHandler content="contactOfficeAddress" />}
                </p>
                <p className="mt-2 text-xs text-alt/40 dark:text-foreground/38">
                  {cms?.officeNote ?? <LangHandler content="contactOfficeNote" />}
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="text-center transition-all delay-300 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-main/10 bg-card/60 px-4 py-2 backdrop-blur-sm dark:border-foreground/10 dark:bg-white/[.04]">
            <Info className="h-4 w-4 text-main" />
            <span className="text-xs text-alt/60 dark:text-foreground/55">
              {cms?.notice ?? <LangHandler content="contactNotReady" />}
            </span>
          </div>
        </div>
        {cms?.companyLinks?.length ? (
          <div className="flex flex-wrap justify-center gap-3">
            {cms.companyLinks.map((link) => (
              <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className="rounded-full border border-main/10 bg-card/60 px-4 py-2 text-xs font-bold text-main transition hover:border-main/30 hover:bg-main/10">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </PageLayout>
  )
}

function buildLiveChatScenarios(content: ContactContent | undefined, text: (key: TranslationKey) => string): LiveChatScenario[] {
  const icons = [Workflow, Rocket, BarChart3]
  if (content?.chatScenarios?.length) {
    return content.chatScenarios.map((scenario, index) => ({
      ...scenario,
      Icon: icons[index % icons.length],
    }))
  }
  return liveChatScenarioSeeds.map((scenario) => ({
    id: scenario.id,
    Icon: scenario.Icon,
    prompt: text(scenario.promptKey),
    user: text(scenario.userKey),
    reply: text(scenario.replyKey),
    impact: text(scenario.impactKey),
    metric: scenario.metric,
    metricLabel: text(scenario.metricKey),
  }))
}

function LiveProjectChat({ content, scenarios }: { content?: ContactContent; scenarios: LiveChatScenario[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeScenario = scenarios[activeIndex] ?? scenarios[0]
  const ActiveIcon = activeScenario.Icon

  return (
    <div className="relative overflow-hidden rounded-3xl border border-alt/10 bg-card/78 p-5 shadow-[0_20px_62px_rgba(18,36,35,0.1)] backdrop-blur-xl md:p-6 dark:border-foreground/10 dark:bg-[#0a2022]/88">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ffb84d]/60 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-main text-white shadow-lg shadow-main/20">
            <MessageCircle className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold tracking-[0.16em] text-main uppercase">
              {content?.chatLabel ?? <LangHandler content="contactLiveChatLabel" />}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[0.68rem] font-bold text-emerald-700 dark:text-emerald-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                {content?.chatStatus ?? <LangHandler content="contactLiveChatStatus" />}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-alt dark:text-foreground">
              {content?.chatTitle ?? <LangHandler content="contactLiveChatTitle" />}
            </h3>
            <p className="mt-2 text-sm leading-6 text-alt/55 dark:text-foreground/50">
              {content?.chatIntro ?? <LangHandler content="contactLiveChatIntro" />}
            </p>
          </div>
        </div>
        <Sparkles className="mt-1 size-5 shrink-0 text-[#ffb84d]" />
      </div>

      <div className="mt-5 space-y-4 rounded-2xl border border-alt/10 bg-alt/[0.035] p-4 dark:border-foreground/10 dark:bg-black/10">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-main shadow-sm ring-1 ring-main/10 dark:bg-white/10">
            <Bot className="size-4" />
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-6 text-alt/70 shadow-sm dark:bg-white/[.075] dark:text-foreground/70">
            {content?.botIntro ?? <LangHandler content="contactLiveBotIntro" />}
          </div>
        </div>

        <motion.div
          key={`${activeScenario.id}-user`}
          className="flex justify-end"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-main px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-main/15">
            {activeScenario.user}
          </div>
        </motion.div>

        <motion.div
          key={`${activeScenario.id}-reply`}
          className="flex items-start gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-main shadow-sm ring-1 ring-main/10 dark:bg-white/10">
            <ActiveIcon className="size-4" />
          </div>
          <div className="max-w-[85%] space-y-2 rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-6 text-alt/70 shadow-sm dark:bg-white/[.075] dark:text-foreground/70">
            <p>
              {activeScenario.reply}
            </p>
            <p className="rounded-xl bg-[#ffb84d]/12 px-3 py-2 text-xs font-semibold text-alt/70 dark:text-foreground/72">
              {activeScenario.impact}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {scenarios.map((scenario, index) => {
          const PromptIcon = scenario.Icon
          const isActive = index === activeIndex

          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex min-h-16 items-center gap-2 rounded-2xl border px-3 py-3 text-start text-xs font-bold transition-all ${
                isActive
                  ? "border-main/30 bg-main/10 text-main shadow-sm"
                  : "border-alt/10 bg-white/55 text-alt/55 hover:border-main/20 hover:bg-white dark:border-foreground/10 dark:bg-white/[.045] dark:text-foreground/50 dark:hover:border-main/30 dark:hover:bg-white/[.075]"
              }`}
            >
              <PromptIcon className="size-4 shrink-0" />
              <span className="leading-4">
                {scenario.prompt}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-2xl border border-alt/10 bg-white/60 dark:border-foreground/10 dark:bg-white/[.045]">
        <div className="p-3">
          <p className="text-lg font-black text-main">
            {activeScenario.metric}
          </p>
          <p className="mt-1 text-[0.68rem] leading-4 text-alt/45 dark:text-foreground/42">
            {activeScenario.metricLabel}
          </p>
        </div>
        <div className="border-x border-alt/10 p-3">
          <p className="text-lg font-black text-alt dark:text-foreground">
            <LangHandler content="stat1Number" />
          </p>
          <p className="mt-1 text-[0.68rem] leading-4 text-alt/45 dark:text-foreground/42">
            <LangHandler content="stat1Label" />
          </p>
        </div>
        <div className="p-3">
          <p className="text-lg font-black text-alt dark:text-foreground">
            <LangHandler content="stat2Number" />
          </p>
          <p className="mt-1 text-[0.68rem] leading-4 text-alt/45 dark:text-foreground/42">
            <LangHandler content="stat2Label" />
          </p>
        </div>
      </div>

      <Button
        asChild
        className="mt-4 w-full rounded-xl bg-alt py-3 text-white hover:bg-main dark:bg-foreground dark:text-[#071112] dark:hover:bg-main dark:hover:text-white"
      >
        <a href="#contact-form">
          <Code2 className="size-4" />
          {content?.chatAction ?? <LangHandler content="contactLiveChatAction" />}
          <SendHorizontal className="size-4" />
        </a>
      </Button>
    </div>
  )
}

export default ContactUs
