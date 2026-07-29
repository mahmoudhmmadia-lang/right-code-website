import {
  Blocks,
  Clock3,
  Gauge,
  Layers3,
  MonitorSmartphone,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export type WizardAnswers = Record<string, string>
export type WizardIconKey =
  | "blocks"
  | "clock"
  | "gauge"
  | "layers"
  | "monitor"
  | "wrench"

export type WizardOption = {
  value: string
  title: string
  description: string
  budget: number
  weeks: number
  multiplier?: number
  weekMultiplier?: number
}

export type WizardQuestionContent = {
  id: string
  title: string
  description: string
  icon?: WizardIconKey
  options: WizardOption[]
}

export type WizardQuestion = Omit<WizardQuestionContent, "icon"> & {
  icon: LucideIcon
  iconKey?: WizardIconKey
}

const icons = {
  blocks: Blocks,
  clock: Clock3,
  gauge: Gauge,
  layers: Layers3,
  monitor: MonitorSmartphone,
  wrench: Wrench,
} satisfies Record<WizardIconKey, LucideIcon>

export function normalizeWizardQuestions(
  questions: WizardQuestionContent[] = []
): WizardQuestion[] {
  return questions.map((question) => ({
    id: question.id,
    title: question.title,
    description: question.description,
    iconKey: question.icon,
    icon: icons[question.icon ?? "layers"] ?? Layers3,
    options: Array.isArray(question.options) ? question.options : [],
  }))
}

export function calculateEstimate(
  questions: WizardQuestion[],
  answers: WizardAnswers
) {
  let budget = 0
  let weeks = 0
  let multiplier = 1
  let weekMultiplier = 1

  questions.forEach((question) => {
    const option = question.options.find(
      (item) => item.value === answers[question.id]
    )
    if (!option) return
    budget += Number(option.budget) || 0
    weeks += Number(option.weeks) || 0
    multiplier *= Number(option.multiplier) || 1
    weekMultiplier *= Number(option.weekMultiplier) || 1
  })

  const midpoint = Math.max(4000, Math.round((budget * multiplier) / 500) * 500)
  const minBudget = Math.round((midpoint * 0.85) / 500) * 500
  const maxBudget = Math.round((midpoint * 1.2) / 500) * 500
  const baseWeeks = Math.max(3, Math.ceil(weeks * weekMultiplier))

  return {
    minBudget,
    maxBudget,
    minWeeks: Math.max(3, baseWeeks - 1),
    maxWeeks: baseWeeks + 2,
  }
}
