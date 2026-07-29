import { lang, sidebarCollapsed, sidebarOpen } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { BarChart3, BookOpenText, BriefcaseBusiness, Contact, LayoutPanelTop, Mail, PanelLeftClose, PanelLeftOpen, PanelsTopLeft, Users, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

const groups = [
  { label: "overview" as const, items: [{ to: "/analytics", key: "analytics" as const, icon: BarChart3 }, { to: "/messages", key: "messages" as const, icon: Mail }] },
  { label: "content" as const, items: [{ to: "/content", key: "contentManager" as const, icon: PanelsTopLeft }, { to: "/pages", key: "pages" as const, icon: LayoutPanelTop }] },
  { label: "resources" as const, items: [{ to: "/projects", key: "projects" as const, icon: BriefcaseBusiness }, { to: "/services", key: "services" as const, icon: LayoutPanelTop }, { to: "/team-members", key: "teamMembers" as const, icon: Users }, { to: "/job-titles", key: "jobTitles" as const, icon: Contact }, { to: "/blog", key: "blog" as const, icon: BookOpenText }] },
];

export default function Sidebar() {
  useSignals();
  const copy = ADMIN_TRANSLATOR[lang.value];
  const collapsed = sidebarCollapsed.value && !sidebarOpen.value;
  return <>
    {sidebarOpen.value ? <button type="button" className="fixed inset-0 z-40 bg-alt/35 backdrop-blur-sm lg:hidden" aria-label={copy.close} onClick={() => (sidebarOpen.value = false)} /> : null}
    <aside className={cn("fixed inset-y-0 left-0 z-50 flex -translate-x-full flex-col border-r border-white/8 bg-[linear-gradient(180deg,#092321_0%,#061716_58%,#041211_100%)] text-white shadow-[24px_0_90px_rgba(3,18,17,.2)] transition-[width,transform] duration-300 lg:translate-x-0 rtl:right-0 rtl:left-auto rtl:translate-x-full rtl:border-r-0 rtl:border-l rtl:lg:translate-x-0", collapsed ? "w-20" : "w-64", sidebarOpen.value && "translate-x-0 rtl:translate-x-0")}>
      <div className={cn("relative flex h-24 items-center gap-3 overflow-hidden border-b border-white/8", collapsed ? "justify-center px-2" : "px-5")}><div className="absolute -top-14 -right-12 size-36 rounded-full bg-main/15 blur-2xl" /><div className="relative grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/7 shadow-lg shadow-black/10"><img src={mediaUrl("/assets/home/logo.png")} alt="RightCode" className="size-9 object-contain" /></div>{!collapsed ? <div className="relative min-w-0"><p className="truncate font-black tracking-[.04em]">RIGHTCODE</p><p className="text-[9px] font-bold tracking-[.22em] text-main uppercase">{copy.dashboard}</p></div> : null}<Button type="button" variant="ghost" size="icon" className="ms-auto text-white/60 lg:hidden" onClick={() => (sidebarOpen.value = false)}><X className="size-5" /></Button></div>
      <nav className="flex-1 overflow-y-auto px-3 py-5 [scrollbar-width:thin]">
        {groups.map((group) => <section key={group.label} className="mb-6">{!collapsed ? <p className="mb-2 px-3 text-[9px] font-black tracking-[.2em] text-white/28 uppercase">{copy[group.label]}</p> : <div className="mx-auto mb-3 h-px w-8 bg-white/10" />}<div className="grid gap-1">{group.items.map(({ to, key, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"} title={collapsed ? copy[key] : undefined} onClick={() => (sidebarOpen.value = false)} className={({ isActive }) => cn("group relative flex items-center rounded-2xl py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/7 hover:text-white", collapsed ? "justify-center px-2" : "gap-3 px-3", isActive && "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.07)] before:absolute before:start-0 before:h-6 before:w-1 before:rounded-full before:bg-main")}><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[.045] text-main transition group-hover:bg-main/15"><Icon className="size-4" /></span>{!collapsed ? <span className="truncate">{copy[key]}</span> : null}</NavLink>)}</div></section>)}
      </nav>
      <div className="border-t border-white/8 p-3">{!collapsed ? <div className="rounded-2xl border border-main/15 bg-main/8 p-4"><p className="text-[9px] font-black tracking-[.18em] text-main uppercase">RightCode CMS</p><p className="mt-2 text-xs leading-5 text-white/42">{copy.dashboardDescription}</p></div> : null}<Button type="button" variant="ghost" className={cn("mt-2 hidden w-full text-white/55 hover:bg-white/8 hover:text-white lg:flex", collapsed ? "px-0" : "justify-start")} onClick={() => (sidebarCollapsed.value = !sidebarCollapsed.value)} title={collapsed ? copy.expandSidebar : copy.collapseSidebar}>{collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}{!collapsed ? copy.collapseSidebar : null}</Button></div>
    </aside>
  </>;
}
