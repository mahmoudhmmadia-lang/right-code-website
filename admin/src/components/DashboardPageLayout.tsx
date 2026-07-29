import type { ReactNode } from "react"

function DashboardPageLayout({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_85%_0%,rgba(0,107,112,.08),transparent_28%)] p-4 transition-colors dark:bg-[radial-gradient(circle_at_85%_0%,rgba(53,174,177,.1),transparent_28%)] sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-7">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 px-6 py-7 shadow-[0_20px_60px_rgba(18,36,35,.07)] backdrop-blur-xl dark:border-white/10 dark:bg-card/80 dark:shadow-black/20 sm:px-8">
          <div className="absolute -top-20 -right-12 size-52 rounded-full border-[28px] border-main/[.045]" />
          <div className="relative">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-[0.22em] text-main uppercase">
              <span className="size-1.5 rounded-full bg-main shadow-[0_0_12px_rgba(0,107,112,.6)]" />RightCode CMS
            </p>
            <h1 className="text-3xl font-black tracking-[-.04em] text-alt dark:text-white sm:text-4xl">{title}</h1>
            {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-alt/50 dark:text-white/50">{description}</p> : null}
          </div>
        </header>
        {children}
      </div>
    </main>
  )
}

export default DashboardPageLayout
