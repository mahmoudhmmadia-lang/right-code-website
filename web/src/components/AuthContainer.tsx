import type { ReactNode } from "react"
import LanguageSelect from "./LanguageSelect"
import { HexagonPattern } from "./ui/hexagon-pattern"

function AuthContainer({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-cloudy p-4">
      <HexagonPattern strokeDasharray="2" />
      <div className="absolute top-5 right-5 z-20 rtl:right-auto rtl:left-5">
        <LanguageSelect />
      </div>
      <div className="absolute top-[12%] left-[8%] h-44 w-44 rounded-full bg-main/10 blur-3xl" />
      <div className="absolute right-[8%] bottom-[10%] h-56 w-56 rounded-full bg-alt/10 blur-3xl" />
      <section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-[0_30px_90px_rgba(18,36,35,0.16)] backdrop-blur-xl sm:p-9">
        {children}
      </section>
    </main>
  )
}

export default AuthContainer
