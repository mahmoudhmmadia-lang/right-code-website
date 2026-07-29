import { lang } from "@/context/global";
import { useSignals } from "@preact/signals-react/runtime";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const labels = {
  en: { title: "Theme", light: "Light", dark: "Dark", system: "System" },
  ar: { title: "المظهر", light: "فاتح", dark: "داكن", system: "النظام" },
  tr: { title: "Tema", light: "Açık", dark: "Koyu", system: "Sistem" },
} as const;

export default function ThemeToggle() {
  useSignals();
  const { theme, setTheme } = useTheme();
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const copy = labels[lang.value];
  return <div className="min-w-0 md:w-36">
    <span className="sr-only">{copy.title}</span>
    <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
      <SelectTrigger aria-label={copy.title} className="font-bold">
        <Icon className="size-4 text-main" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">{copy.light}</SelectItem>
        <SelectItem value="dark">{copy.dark}</SelectItem>
        <SelectItem value="system">{copy.system}</SelectItem>
      </SelectContent>
    </Select>
  </div>;
}
