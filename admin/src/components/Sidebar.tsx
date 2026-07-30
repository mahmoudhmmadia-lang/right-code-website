import { lang, sidebarCollapsed, sidebarOpen } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useSignals } from "@preact/signals-react/runtime";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  FileUser,
  Contact,
  LayoutPanelTop,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  PanelsTopLeft,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

const navigation = [
  {
    label: "overview" as const,
    items: [
      { to: "/analytics", key: "analytics" as const, icon: BarChart3 },
      { to: "/messages", key: "messages" as const, icon: Mail },
      { to: "/job-requests", key: "jobRequests" as const, icon: FileUser },
    ],
  },
  {
    label: "content" as const,
    items: [
      { to: "/content", key: "contentManager" as const, icon: PanelsTopLeft },
      { to: "/pages", key: "pages" as const, icon: LayoutPanelTop },
    ],
  },
  {
    label: "resources" as const,
    items: [
      { to: "/projects", key: "projects" as const, icon: BriefcaseBusiness },
      { to: "/services", key: "services" as const, icon: LayoutPanelTop },
      { to: "/team-members", key: "teamMembers" as const, icon: Users },
      { to: "/job-titles", key: "jobTitles" as const, icon: Contact },
      { to: "/blog", key: "blog" as const, icon: BookOpenText },
    ],
  },
];

export default function Sidebar() {
  useSignals();
  const copy = ADMIN_TRANSLATOR[lang.value];
  const collapsed = sidebarCollapsed.value && !sidebarOpen.value;

  return (
    <>
      {sidebarOpen.value ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#071312]/45 backdrop-blur-sm lg:hidden"
          aria-label={copy.close}
          onClick={() => (sidebarOpen.value = false)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex -translate-x-full flex-col border-r border-white/70 bg-white/82 p-3 text-alt shadow-[18px_0_70px_rgba(18,36,35,.1)] backdrop-blur-2xl transition-[width,transform] duration-300 dark:border-white/10 dark:bg-[#071312]/88 dark:text-white lg:translate-x-0 rtl:right-0 rtl:left-auto rtl:translate-x-full rtl:border-r-0 rtl:border-l rtl:lg:translate-x-0",
          collapsed ? "w-[84px]" : "w-[272px]",
          sidebarOpen.value && "translate-x-0 rtl:translate-x-0",
        )}
      >
        <header
          className={cn(
            "flex h-[68px] shrink-0 items-center rounded-3xl border border-alt/8 bg-[#f7fbfa] shadow-sm dark:border-white/10 dark:bg-white/[.045]",
            collapsed ? "justify-center px-2" : "px-4",
          )}
        >
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-main/10 bg-white shadow-[0_10px_26px_rgba(0,107,112,.08)] dark:border-main/20 dark:bg-[#092123]">
            <img
              src={mediaUrl("/assets/home/logo.png")}
              alt="RightCode"
              className="size-8 object-contain"
            />
          </div>
          {!collapsed ? (
            <div className="ms-3 min-w-0">
              <p className="truncate text-[13px] font-black tracking-[.08em]">
                RIGHTCODE
              </p>
              <p className="mt-0.5 text-[9px] font-bold tracking-[.16em] text-main uppercase">
                {copy.dashboard}
              </p>
            </div>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ms-auto text-alt/45 dark:text-white/45 lg:hidden"
            onClick={() => (sidebarOpen.value = false)}
            aria-label={copy.close}
          >
            <X className="size-4" />
          </Button>
        </header>

        <nav
          className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden rounded-3xl border border-alt/8 bg-[#f8fbfb]/70 px-2 py-3 dark:border-white/8 dark:bg-white/[.025]"
          aria-label={copy.menu}
        >
          {navigation.map((group) => (
            <section key={group.label} className="mb-3 last:mb-0">
              {!collapsed ? (
                <p className="mb-1.5 px-3 text-[9px] font-black tracking-[.16em] text-alt/30 uppercase dark:text-white/28">
                  {copy[group.label]}
                </p>
              ) : (
                <div className="mx-auto mb-2 size-1 rounded-full bg-alt/15 dark:bg-white/15" />
              )}
              <div className="grid gap-1">
                {group.items.map(({ to, key, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    title={collapsed ? copy[key] : undefined}
                    onClick={() => (sidebarOpen.value = false)}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex h-11 items-center rounded-2xl text-[13px] font-bold text-alt/54 transition dark:text-white/50",
                        collapsed ? "justify-center px-1" : "gap-3 px-2",
                        "hover:bg-white hover:text-alt hover:shadow-sm dark:hover:bg-white/[.06] dark:hover:text-white",
                        isActive &&
                          "bg-white text-main shadow-[0_10px_26px_rgba(18,36,35,.08)] hover:bg-white hover:text-main dark:bg-main/15 dark:text-[#66d9da] dark:hover:bg-main/20 dark:hover:text-[#66d9da]",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-xl border transition",
                            isActive
                              ? "border-main/15 bg-main text-white shadow-[0_8px_20px_rgba(0,107,112,.24)]"
                              : "border-alt/7 bg-white text-alt/42 group-hover:border-main/15 group-hover:text-main dark:border-white/8 dark:bg-white/[.035] dark:text-white/40",
                          )}
                        >
                          <Icon className="size-[15px]" />
                        </span>
                        {!collapsed ? (
                          <span className="min-w-0 flex-1 truncate">
                            {copy[key]}
                          </span>
                        ) : null}
                        {!collapsed && isActive ? (
                          <span className="size-1.5 rounded-full bg-main" />
                        ) : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <footer className="mt-3 flex shrink-0 justify-center rounded-3xl border border-alt/8 bg-[#f8fbfb]/70 p-2 dark:border-white/8 dark:bg-white/[.025]">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "hidden rounded-2xl text-alt/55 hover:border-main/25 hover:text-main dark:text-white/50 dark:hover:text-[#66d9da] lg:grid",
            )}
            onClick={() => (sidebarCollapsed.value = !sidebarCollapsed.value)}
            title={collapsed ? copy.expandSidebar : copy.collapseSidebar}
            aria-label={collapsed ? copy.expandSidebar : copy.collapseSidebar}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </footer>
      </aside>
    </>
  );
}
