import { lang } from "@/context/global"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { myAxios } from "@/api/myAxios"
import { useSignals } from "@preact/signals-react/runtime"
import { useMemo, useState } from "react"
import {
  calculateEstimate,
  normalizeWizardQuestions,
  type WizardQuestionContent,
  type WizardAnswers,
} from "./wizard-data"
import type { RouteSectionBody } from "@/pages/site/types"

type WizardSectionContent = {
  questions?: WizardQuestionContent[]
}

type WizardSection = {
  id?: string
  key?: string
  anchor?: string
  body?: RouteSectionBody & { wizard?: WizardSectionContent }
  content?: WizardSectionContent
}

type WizardCollection = {
  data: WizardSection[]
}

type Envelope<T> = {
  materials: T
  message: string
}

export function useProjectWizard() {
  useSignals()
  const locale = lang.value
  const query = useCustomQuery<WizardCollection>({
    queryKey: ["project-wizard", locale],
    isErrLog: false,
    staleTime: 15 * 60 * 1000,
    queryFn: async () =>
      (
        await myAxios.get<Envelope<WizardCollection>>("/sections", {
          params: { pageId: "project-wizard", search: "project-wizard", limit: 1 },
        })
      ).data.materials,
  })
  const questions = useMemo(
    () => normalizeWizardQuestions(query.data?.data[0]?.body?.wizard?.questions ?? query.data?.data[0]?.content?.questions),
    [query.data]
  )
  const section = query.data?.data[0]
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<WizardAnswers>({})
  const [complete, setComplete] = useState(false)
  const safeStep = Math.min(step, Math.max(0, questions.length - 1))
  const question = questions[safeStep]
  const selected = question ? answers[question.id] : undefined
  const estimate = useMemo(
    () => calculateEstimate(questions, answers),
    [questions, answers]
  )

  function select(value: string) {
    if (!question) return
    setAnswers((current) => ({ ...current, [question.id]: value }))
  }
  function next() {
    if (!selected || !questions.length) return
    if (safeStep === questions.length - 1) setComplete(true)
    else setStep(safeStep + 1)
  }
  function back() {
    if (safeStep > 0) setStep(safeStep - 1)
  }
  function restart() {
    setAnswers({})
    setStep(0)
    setComplete(false)
  }

  return {
    questions,
    section,
    question,
    isLoading: query.isLoading,
    isError: query.isError,
    step: safeStep,
    selected,
    answers,
    complete,
    estimate,
    select,
    next,
    back,
    restart,
  }
}
