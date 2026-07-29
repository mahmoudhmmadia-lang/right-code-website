import Home from "@/pages/home/Home";
import RouteContentPage from "@/pages/route-content/RouteContentPage";
import type { RoutePageKey } from "@/pages/route-content/route-content-config";
import { lang } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { cn } from "@/lib/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { BookOpenText, BriefcaseBusiness, Contact, FileText, HomeIcon, LayoutPanelTop, Sparkles, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const tabs = [
  { key: "home", label: "home", icon: HomeIcon },
  { key: "about", label: "aboutPage", icon: FileText },
  { key: "services", label: "servicesPage", icon: LayoutPanelTop },
  { key: "work", label: "workPage", icon: BriefcaseBusiness },
  { key: "team", label: "teamPage", icon: Users },
  { key: "contact", label: "contactPage", icon: Contact },
  { key: "blog", label: "blogPage", icon: BookOpenText },
  { key: "projectWizard", label: "projectPlanner", icon: Sparkles },
] as const;

type ContentPage = (typeof tabs)[number]["key"];

export default function ContentManager() {
  useSignals();
  const copy = ADMIN_TRANSLATOR[lang.value];
  const [params, setParams] = useSearchParams();
  const requested = params.get("page") as ContentPage | null;
  const active = tabs.some((tab) => tab.key === requested) ? requested! : "home";

  return <div>
    <div className="sticky top-[124px] z-20 border-b border-alt/8 bg-[#f2f6f5]/92 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-[#081514]/92 md:top-[65px] sm:px-6">
      <nav className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={copy.contentManager}>
        {tabs.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => { setParams({ page: key }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={cn("flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition", active === key ? "border-main/20 bg-main text-white shadow-lg shadow-main/20" : "border-alt/8 bg-white/75 text-alt/55 hover:border-main/20 hover:text-main dark:border-white/10 dark:bg-white/5 dark:text-white/55 dark:hover:text-main")}><Icon className="size-4" />{copy[label]}</button>)}
      </nav>
    </div>
    {active === "home" ? <Home key="home" /> : <RouteContentPage key={active} pageKey={active as RoutePageKey} />}
  </div>;
}
