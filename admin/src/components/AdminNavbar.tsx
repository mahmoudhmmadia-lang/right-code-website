import { accountInfo, lang, sidebarOpen } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { mediaUrl } from "@/lib/media";
import { useSignals } from "@preact/signals-react/runtime";
import { LogOut, Menu } from "lucide-react";
import LanguageSelect from "./LanguageSelect";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

export default function AdminNavbar() {
  useSignals();
  const copy = ADMIN_TRANSLATOR[lang.value];
  const account = accountInfo.value;
  const name = account?.fullName || account?.email || "Administrator";
  return <header className="sticky top-0 z-30 border-b border-alt/8 bg-[#f2f6f5]/88 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-[#081514]/88 sm:px-6">
    <div className="mx-auto flex max-w-[1600px] items-center gap-3">
      <Button type="button" variant="outline" size="icon" className="shrink-0 lg:hidden" aria-label={copy.menu} onClick={() => (sidebarOpen.value = true)}><Menu className="size-5" /></Button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-alt dark:text-white">{copy.welcomeBack}, {name}</p>
        <p className="hidden truncate text-xs text-alt/45 dark:text-white/45 sm:block">{copy.dashboardDescription}</p>
      </div>
      <div className="hidden items-center gap-2 md:flex"><ThemeToggle /><LanguageSelect /></div>
      <div className="flex items-center gap-2 rounded-2xl border border-alt/8 bg-white/75 p-1.5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-main text-sm font-black text-white">{account?.avatarUrl ? <img src={mediaUrl(account.avatarUrl)} alt="" className="size-full object-cover" /> : name.charAt(0).toUpperCase()}</div>
        <div className="hidden min-w-0 lg:block"><p className="max-w-36 truncate text-xs font-bold text-alt dark:text-white">{name}</p><p className="max-w-36 truncate text-[10px] text-alt/40 dark:text-white/40">{account?.email}</p></div>
        <Button type="button" variant="ghost" size="icon" className="size-9 text-alt/45 hover:text-destructive dark:text-white/45" title={copy.logout} onClick={() => (accountInfo.value = undefined)}><LogOut className="size-4" /></Button>
      </div>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2 md:hidden"><ThemeToggle /><LanguageSelect /></div>
  </header>;
}
