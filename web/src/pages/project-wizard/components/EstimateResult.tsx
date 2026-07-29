import LangHandler from "@/components/LangHandler"
import { Button } from "@/components/ui/button"
import {
  CalendarRange,
  CircleDollarSign,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"
import type { ReturnTypeOfWizard } from "./types"

export function EstimateResult({ wizard }: { wizard: ReturnTypeOfWizard }) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-main/20 bg-[#0b2526] p-6 text-white shadow-[0_35px_100px_rgba(0,80,84,.25)] sm:p-10">
      <div className="flex items-center gap-2 text-xs font-black tracking-[.16em] text-main uppercase">
        <Sparkles className="size-4" />
        <LangHandler content="wizardResultBadge" />
      </div>
      <h2 className="mt-5 max-w-2xl text-3xl font-black sm:text-5xl">
        <LangHandler content="wizardResultTitle" />
      </h2>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
          <CircleDollarSign className="size-7 text-main" />
          <p className="mt-6 text-sm font-bold text-white/55">
            <LangHandler content="wizardBudget" />
          </p>
          <p className="mt-2 text-2xl font-black sm:text-3xl">
            {currency.format(wizard.estimate.minBudget)} –{" "}
            {currency.format(wizard.estimate.maxBudget)}
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
          <CalendarRange className="size-7 text-[#ffb84d]" />
          <p className="mt-6 text-sm font-bold text-white/55">
            <LangHandler content="wizardDeadline" />
          </p>
          <p className="mt-2 text-2xl font-black sm:text-3xl">
            {wizard.estimate.minWeeks}–{wizard.estimate.maxWeeks}{" "}
            <LangHandler content="wizardWeeks" />
          </p>
        </div>
      </div>
      <p className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-white/55">
        <LangHandler content="wizardAssumption" />
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          asChild
          className="h-12 rounded-xl bg-main px-6 font-black text-white"
        >
          <Link to="/contact">
            <LangHandler content="wizardTalk" />
          </Link>
        </Button>
        <Button
          type="button"
          onClick={wizard.restart}
          className="h-12 rounded-xl border border-white/15 bg-white/5 px-6 text-white hover:bg-white/10"
        >
          <RotateCcw className="me-2 size-4" />
          <LangHandler content="wizardRestart" />
        </Button>
      </div>
    </div>
  )
}
