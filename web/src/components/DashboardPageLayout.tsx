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
    <main className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-7">
        <header>
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-main uppercase">
            RightCode CMS
          </p>
          <h1 className="text-3xl font-black tracking-tight text-alt sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-alt/55">
              {description}
            </p>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  )
}

export default DashboardPageLayout
