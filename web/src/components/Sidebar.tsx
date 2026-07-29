import { accountInfo, lang, sidebarOpen } from "@/context/global"
import { ADMIN_TRANSLATOR } from "@/lang/admin"
import { cn } from "@/lib/utils"
import { mediaUrl } from "@/lib/media"
import { useSignals } from "@preact/signals-react/runtime"
import {
  BookOpenText,
  BriefcaseBusiness,
  GraduationCap,
  Home,
  Inbox,
  LayoutPanelTop,
  LogOut,
  PanelsTopLeft,
  X,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import LanguageSelect from "./LanguageSelect"

const navItems = [
  { to: "/", key: "home", icon: Home, enabled: true },
  { to: "/pages", key: "pages", icon: PanelsTopLeft, enabled: false },
  { to: "/projects", key: "projects", icon: BriefcaseBusiness, enabled: false },
  { to: "/services", key: "services", icon: LayoutPanelTop, enabled: false },
  { to: "/inquiries", key: "inquiries", icon: Inbox, enabled: false },
  { to: "/training", key: "training", icon: GraduationCap, enabled: false },
  { to: "/blog", key: "blog", icon: BookOpenText, enabled: false },
] as const

function Sidebar() {
  useSignals()
  const copy = ADMIN_TRANSLATOR[lang.value]

  return (
    <>
      {sidebarOpen.value ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-alt/30 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => (sidebarOpen.value = false)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-white/10 shadow-2xl transition-transform duration-300 lg:translate-x-0 rtl:right-0 rtl:left-auto rtl:translate-x-full rtl:border-r-0 rtl:border-l rtl:lg:translate-x-0",
          sidebarOpen.value && "translate-x-0 rtl:translate-x-0"
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-main/10">
              <img
                src={mediaUrl("/assets/home/logo.png")}
                alt="RightCode"
                className="size-9 object-contain"
              />
            </div>
            <div>
              <div className="font-black tracking-wide">RIGHTCODE</div>
              <div className="text-[10px] tracking-[0.2em] uppercase">
                {copy.dashboard}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            onClick={() => (sidebarOpen.value = false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] uppercase">
            {copy.content}
          </div>
          <div className="space-y-1.5">
            {navItems.map(({ to, key, icon: Icon, enabled }) =>
              enabled ? (
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={() => (sidebarOpen.value = false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition hover:bg-gray-200",
                      isActive && "bg-gray-200 text-main"
                    )
                  }
                >
                  <Icon className="size-4" />
                  {copy[key]}
                </NavLink>
              ) : (
                <div
                  key={to}
                  className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold opacity-60"
                >
                  <Icon className="size-4.5" />
                  {copy[key]}
                </div>
              )
            )}
          </div>
        </nav>

        <div className="space-y-4 border-t border-white/10 p-4">
          <LanguageSelect />
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-main font-black">
              {(accountInfo.value?.fullName ?? accountInfo.value?.email ?? "A")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">
                {accountInfo.value?.fullName ?? "Administrator"}
              </div>
              <div className="truncate text-xs text-white/40">
                {accountInfo.value?.email}
              </div>
            </div>
            <button
              type="button"
              title={copy.logout}
              className="rounded-lg p-2 text-white/45 transition hover:bg-red-500/15 hover:text-red-300"
              onClick={() => (accountInfo.value = undefined)}
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
