import { Button } from "@/components/ui/button"
import type { RouteSectionBody } from "@/pages/site/types"
import { CheckCircle2, FileText, Send } from "lucide-react"
import type { ReturnTypeOfUseTeam } from "./types"

const fieldClass =
  "mt-2 w-full rounded-xl border border-alt/10 bg-card/70 px-4 py-3 text-sm text-alt outline-none transition placeholder:text-alt/35 focus:border-main/50 focus:ring-4 focus:ring-main/10 dark:text-foreground"

export function CareerForm({ team, content }: { team: ReturnTypeOfUseTeam; content?: NonNullable<RouteSectionBody["teamCareers"]> }) {
  if (team.submitted) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-3xl border border-main/20 bg-main/[0.06] p-8 text-center">
        <div>
          <CheckCircle2 className="mx-auto size-14 text-main" />
          <h2 className="mt-5 text-2xl font-black text-alt dark:text-foreground">
            {content?.successTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-md leading-7 text-alt/60 dark:text-foreground/60">
            {content?.successBody}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={team.submit}
      className="grid gap-5"
      encType="multipart/form-data"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-alt dark:text-foreground">
          {content?.nameLabel}
          <input
            className={fieldClass}
            name="fullName"
            value={team.form.fullName}
            onChange={team.updateField}
            required
            autoComplete="name"
          />
        </label>
        <label className="text-sm font-bold text-alt dark:text-foreground">
          {content?.emailLabel}
          <input
            className={fieldClass}
            name="email"
            value={team.form.email}
            onChange={team.updateField}
            required
            type="email"
            autoComplete="email"
          />
        </label>
        <label className="text-sm font-bold text-alt dark:text-foreground">
          {content?.phoneLabel}
          <input
            className={fieldClass}
            name="phone"
            value={team.form.phone}
            onChange={team.updateField}
            type="tel"
            autoComplete="tel"
          />
        </label>
        <label className="text-sm font-bold text-alt dark:text-foreground">
          {content?.roleLabel}
          <input
            className={fieldClass}
            name="jobTitle"
            value={team.form.jobTitle}
            onChange={team.updateJobTitle}
            required
            minLength={2}
            maxLength={120}
            list="rightcode-job-titles"
            placeholder={content?.rolePlaceholder}
            autoComplete="organization-title"
          />
          <datalist id="rightcode-job-titles">
            {team.jobTitles.map((title) => (
              <option key={title.id} value={title.title} />
            ))}
          </datalist>
        </label>
        <label className="text-sm font-bold text-alt dark:text-foreground">
          {content?.linkedInLabel}
          <input
            className={fieldClass}
            name="linkedInUrl"
            value={team.form.linkedInUrl}
            onChange={team.updateField}
            type="url"
            inputMode="url"
            placeholder={content?.linkedInPlaceholder}
          />
        </label>
        <label className="text-sm font-bold text-alt dark:text-foreground">
          {content?.portfolioLabel}
          <input
            className={fieldClass}
            name="portfolioUrl"
            value={team.form.portfolioUrl}
            onChange={team.updateField}
            type="url"
            inputMode="url"
            placeholder={content?.portfolioPlaceholder}
          />
        </label>
      </div>
      <label className="text-sm font-bold text-alt dark:text-foreground">
        {content?.noteLabel}
        <textarea
          className={`${fieldClass} min-h-28 resize-y`}
          name="coverNote"
          value={team.form.coverNote}
          onChange={team.updateField}
          maxLength={3000}
        />
      </label>
      <label className="group cursor-pointer rounded-2xl border border-dashed border-main/35 bg-main/[0.04] p-5 transition hover:border-main hover:bg-main/[0.08]">
        <span className="flex items-center gap-4">
          <span className="grid size-11 place-items-center rounded-xl bg-main/10 text-main">
            <FileText className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-black text-alt dark:text-foreground">
              {team.cv?.name ?? content?.cvLabel}
            </span>
            <span className="mt-1 block text-xs text-alt/50 dark:text-foreground/50">
              {content?.cvHint}
            </span>
          </span>
        </span>
        <input
          className="sr-only"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={team.updateCv}
          required
        />
      </label>
      {team.formError ? (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {content?.errorMessage}
        </p>
      ) : null}
      <Button
        disabled={team.isSubmitting}
        className="h-12 rounded-xl bg-main font-black text-white hover:bg-main/90"
      >
        {team.isSubmitting ? (
          content?.submittingLabel
        ) : (
          <>
            {content?.submitLabel}
            <Send className="ms-2 size-4 rtl:rotate-180" />
          </>
        )}
      </Button>
      <p className="text-center text-xs text-alt/45 dark:text-foreground/45">
        {content?.privacy}
      </p>
    </form>
  )
}
