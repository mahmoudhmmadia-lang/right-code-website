import { lang, sidebarOpen } from "@/context/global"
import { ADMIN_TRANSLATOR } from "@/lang/admin"
import { useSignals } from "@preact/signals-react/runtime"
import { Menu } from "lucide-react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

function DashboardLayout() {
  useSignals()
  const copy = ADMIN_TRANSLATOR[lang.value]

  return (
    <div className="min-h-screen w-full bg-[#f4f7f6] text-alt">
      <Sidebar />
      <div className="min-h-screen lg:ml-72 rtl:lg:mr-72 rtl:lg:ml-0">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-alt/8 bg-white/85 px-4 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            className="rounded-xl border border-alt/10 bg-white p-2.5 text-alt shadow-sm"
            aria-label={copy.menu}
            onClick={() => (sidebarOpen.value = true)}
          >
            <Menu className="size-5" />
          </button>
          <span className="mx-3 font-black">{copy.dashboard}</span>
        </header>
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
