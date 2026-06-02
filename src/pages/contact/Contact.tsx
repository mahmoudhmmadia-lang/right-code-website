import LangHandler from "@/components/LangHandler"
import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { useSignals } from "@preact/signals-react/runtime"
import { useState } from "react"

function ContactUs() {
  useSignals()
  const [formData, setFormData] = useState({
    fullName: "",
    organization: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
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
    }, 1500)
  }

  const steps = [
    {
      number: "01",
      titleKey: "contactStep1Title",
      descKey: "contactStep1Desc",
    },
    {
      number: "02",
      titleKey: "contactStep2Title",
      descKey: "contactStep2Desc",
    },
    {
      number: "03",
      titleKey: "contactStep3Title",
      descKey: "contactStep3Desc",
    },
    {
      number: "04",
      titleKey: "contactStep4Title",
      descKey: "contactStep4Desc",
    },
  ]

  return (
    <PageLayout
      title="contactTitle"
      subtitle="contactSubtitle"
      badge="contactBadge"
    >
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 h-96 w-96 rounded-full bg-main/5 blur-3xl transition-all duration-1000`}
        />
        <div
          className={`absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-alt/5 blur-3xl transition-all delay-300 duration-1000`}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#006b70_1px,transparent_1px),linear-gradient(0deg,#006b70_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] bg-[size:60px_60px]" />
        </div>
      </div>

      <div className={`} transition-all duration-700`}></div>

      {/* Main Contact Grid */}
      <div className="relative mx-auto mt-16 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div
            className={`rounded-3xl border border-main/10 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all delay-100 duration-700 md:p-8`}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-alt">
                <LangHandler content="contactFormTitle" />
              </h3>
              <p className="mt-2 text-alt/60">
                <LangHandler content="contactFormSubtitle" />
              </p>
            </div>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-main to-alt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="h-8 w-8"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-alt">
                  <LangHandler content="contactSuccessTitle" />
                </h4>
                <p className="mt-2 text-alt/60">
                  <LangHandler content="contactSuccessMessage" />
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1 block text-sm font-medium text-alt"
                  >
                    <LangHandler content="contactLabelName" />
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-main/20 bg-white/50 px-4 py-3 text-alt transition-all focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none"
                    placeholder="Ahmed Al-Rashid"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="mb-1 block text-sm font-medium text-alt"
                  >
                    <LangHandler content="contactLabelOrganization" />
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-main/20 bg-white/50 px-4 py-3 text-alt transition-all focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none"
                    placeholder="Company or Organization"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-alt"
                  >
                    <LangHandler content="contactLabelEmail" />
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-main/20 bg-white/50 px-4 py-3 text-alt transition-all focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none"
                    placeholder="ahmed@company.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium text-alt"
                  >
                    <LangHandler content="contactLabelPhone" />
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-main/20 bg-white/50 px-4 py-3 text-alt transition-all focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium text-alt"
                  >
                    <LangHandler content="contactLabelMessage" />
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full resize-none rounded-xl border border-main/20 bg-white/50 px-4 py-3 text-alt transition-all focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-main to-alt py-3 text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
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

                <p className="text-center text-xs text-alt/40">
                  <LangHandler content="contactPrivacy" />
                </p>
              </form>
            )}
          </div>

          {/* Right Column - Info & Process */}
          <div className={`space-y-8 transition-all delay-200 duration-700`}>
            {/* What happens after */}
            <div className="rounded-3xl border border-main/10 bg-white/50 p-6 backdrop-blur-sm md:p-8">
              <h3 className="mb-6 text-xl font-bold text-alt">
                <LangHandler content="contactWhatHappens" />
              </h3>
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="group flex gap-4 transition-all hover:translate-x-1"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-main/10 to-alt/10 font-bold text-main">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="font-semibold text-alt">
                        <LangHandler content={step.titleKey as any} />
                      </h4>
                      <p className="text-sm text-alt/50">
                        <LangHandler content={step.descKey as any} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact methods */}
            <div className="rounded-3xl border border-main/10 bg-white/50 p-6 backdrop-blur-sm md:p-8">
              <h3 className="mb-6 text-xl font-bold text-alt">
                <LangHandler content="contactPreferMethod" />
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl bg-white/50 p-4 transition-all hover:bg-white/80">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-main/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-6 w-6 text-main"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        strokeWidth="1.5"
                      />
                      <path d="M22 6l-10 7L2 6" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-alt/50">
                      <LangHandler content="contactEmailLabel" />
                    </p>
                    <a
                      href="mailto:info@rightcode.io"
                      className="font-medium text-main hover:underline"
                    >
                      info@rightcode.io
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-white/50 p-4 transition-all hover:bg-white/80">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-main/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-6 w-6 text-main"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-alt/50">
                      <LangHandler content="contactPhoneLabel" />
                    </p>
                    <a
                      href="tel:+963100476997"
                      className="font-medium text-main hover:underline"
                    >
                      +963 100 476 997
                    </a>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-alt/40">
                <LangHandler content="contactPhoneNote" />
              </p>
            </div>

            {/* Office info */}
            <div className="rounded-3xl border border-main/10 bg-white/50 p-6 backdrop-blur-sm md:p-8">
              <h3 className="mb-6 text-xl font-bold text-alt">
                <LangHandler content="contactOfficeTitle" />
              </h3>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-main/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-6 w-6 text-main"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="9" r="2.5" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-alt/70">
                    <LangHandler content="contactOfficeAddress" />
                  </p>
                  <p className="mt-2 text-xs text-alt/40">
                    <LangHandler content="contactOfficeNote" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div
          className={`mt-12 text-center transition-all delay-300 duration-700`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-main/10 bg-white/50 px-4 py-2 backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-4 w-4 text-main"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path d="M12 8v4M12 16h.01" strokeWidth="1.5" />
            </svg>
            <span className="text-xs text-alt/60">
              <LangHandler content="contactNotReady" />
            </span>
          </div>
        </div>
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

export default ContactUs
