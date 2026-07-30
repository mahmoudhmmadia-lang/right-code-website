import { myAxios } from "@/api/myAxios"
import { lang } from "@/context/global"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { useSignals } from "@preact/signals-react/runtime"
import { useState, type ChangeEvent, type FormEvent } from "react"

type Envelope<T> = { materials: T; message: string }

export type JobTitle = { id: string; key: string; title: string }
export type TeamMember = {
  id: string
  slug: string
  fullName: string
  imageUrl?: string | null
  linkedInUrl?: string | null
  bio?: string
  jobTitle?: JobTitle | null
}

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  jobTitle: "",
  linkedInUrl: "",
  portfolioUrl: "",
  coverNote: "",
}

export function useTeam() {
  useSignals()
  const locale = lang.value
  const [form, setForm] = useState(emptyForm)
  const [cv, setCv] = useState<File>()
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState("")

  const membersQuery = useCustomQuery<TeamMember[]>({
    queryKey: ["team-members", locale],
    staleTime: 10 * 60 * 1000,
    queryFn: async () =>
      (await myAxios.get<Envelope<TeamMember[]>>("/careers/team")).data
        .materials,
  })
  const jobsQuery = useCustomQuery<JobTitle[]>({
    queryKey: ["job-titles", locale],
    staleTime: 10 * 60 * 1000,
    queryFn: async () =>
      (await myAxios.get<Envelope<JobTitle[]>>("/careers/job-titles")).data
        .materials,
  })

  const application = useCustomMutation<{ id: string }, FormData>({
    isErrLog: false,
    mutationFn: (payload) => myAxios.post("/careers/applications", payload),
    onSuccess: () => {
      setForm(emptyForm)
      setCv(undefined)
      setSubmitted(true)
    },
    onError: () => setFormError("submit"),
  })

  function updateField(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setSubmitted(false)
    setFormError("")
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  function updateCv(event: ChangeEvent<HTMLInputElement>) {
    setSubmitted(false)
    setFormError("")
    const file = event.target.files?.[0]
    if (file && file.size > 8 * 1024 * 1024) {
      setCv(undefined)
      setFormError("size")
      return
    }
    setCv(file)
  }

  function updateJobTitle(event: ChangeEvent<HTMLInputElement>) {
    setSubmitted(false)
    setFormError("")
    setForm((current) => ({ ...current, jobTitle: event.target.value }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const enteredTitle = form.jobTitle.trim()
    if (!cv || enteredTitle.length < 2) {
      setFormError("required")
      return
    }
    const payload = new FormData()
    Object.entries(form).forEach(
      ([key, value]) => key !== "jobTitle" && value && payload.append(key, value)
    )
    const selectedTitle = jobsQuery.data?.find(
      (title) => title.title.localeCompare(enteredTitle, locale, { sensitivity: "base" }) === 0,
    )
    if (selectedTitle) payload.append("jobTitleId", selectedTitle.id)
    else payload.append("customJobTitle", enteredTitle)
    payload.append("cv", cv)
    application.mutate(payload)
  }

  return {
    members: membersQuery.data ?? [],
    jobTitles: jobsQuery.data ?? [],
    isLoading: membersQuery.isLoading || jobsQuery.isLoading,
    form,
    cv,
    submitted,
    formError,
    isSubmitting: application.isPending,
    updateField,
    updateJobTitle,
    updateCv,
    submit,
  }
}
