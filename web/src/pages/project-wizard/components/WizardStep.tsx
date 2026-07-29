import LangHandler from "@/components/LangHandler"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import type { ReturnTypeOfWizard } from "./types"

export function WizardStep({ wizard }: { wizard: ReturnTypeOfWizard }) {
  const { question } = wizard
  if (!question) return null
  const Icon = question.icon
  const progress = ((wizard.step + 1) / wizard.questions.length) * 100
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between gap-5">
        <div className="flex items-center gap-3 text-sm font-bold text-alt/55 dark:text-foreground/55">
          <span>
            <LangHandler content="wizardStep" /> {wizard.step + 1}{" "}
            <LangHandler content="wizardOf" /> {wizard.questions.length}
          </span>
        </div>
        <div className="h-1.5 w-44 overflow-hidden rounded-full bg-main/10 sm:w-72">
          <div
            className="h-full rounded-full bg-main transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="app-card rounded-[2rem] p-6 sm:p-9">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-main/10 text-main">
            <Icon className="size-5" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-alt sm:text-3xl dark:text-foreground">
              {question.title}
            </h2>
            <p className="mt-2 text-alt/55 dark:text-foreground/55">
              {question.description}
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {question.options.map((option) => {
            const active = wizard.selected === option.value
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => wizard.select(option.value)}
                className={`relative min-h-44 cursor-pointer rounded-2xl border p-5 text-start transition-all ${active ? "border-main bg-main/[0.09] shadow-[0_16px_40px_rgba(0,107,112,.12)]" : "border-alt/10 bg-card/45 hover:-translate-y-1 hover:border-main/35"}`}
              >
                <span
                  className={`grid size-7 place-items-center rounded-full border ${active ? "border-main bg-main text-white" : "border-alt/15 text-transparent"}`}
                >
                  <Check className="size-4" />
                </span>
                <strong className="mt-5 block text-base text-alt dark:text-foreground">
                  {option.title}
                </strong>
                <span className="mt-2 block text-sm leading-6 text-alt/55 dark:text-foreground/55">
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-alt/10 pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={wizard.step === 0}
            onClick={wizard.back}
            className="h-11 rounded-xl px-5"
          >
            <ArrowLeft className="me-2 size-4 rtl:rotate-180" />
            <LangHandler content="wizardBack" />
          </Button>
          <Button
            type="button"
            disabled={!wizard.selected}
            onClick={wizard.next}
            className="h-11 rounded-xl bg-main px-6 font-black text-white hover:bg-main/90"
          >
            <LangHandler
              content={
                wizard.step === wizard.questions.length - 1
                  ? "wizardSeeEstimate"
                  : "wizardNext"
              }
            />
            <ArrowRight className="ms-2 size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
