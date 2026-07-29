import { lang, type Lang } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { useSignals } from "@preact/signals-react/runtime";
import { Globe2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function LanguageSelect() {
  useSignals();
  const copy = ADMIN_TRANSLATOR[lang.value];
  return <div className="min-w-0 md:w-36">
    <span className="sr-only">{copy.language}</span>
    <Select value={lang.value} onValueChange={(value) => (lang.value = value as Lang)}>
      <SelectTrigger aria-label={copy.language} className="font-bold">
        <Globe2 className="size-4 text-main" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
        <SelectItem value="tr">Türkçe</SelectItem>
      </SelectContent>
    </Select>
  </div>;
}
