import { lang, type Lang } from "@/context/global"
import { ADMIN_TRANSLATOR } from "@/lang/admin"
import { useSignals } from "@preact/signals-react/runtime"
import { Globe2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select"

function LanguageSelect() {
  useSignals()
  return (
    <label className="flex items-center gap-2 rounded-xl border border-alt/10 bg-white/80 px-3 py-2 text-sm text-alt shadow-sm backdrop-blur-md">
      <Globe2 className="size-4 text-main" />
      <span className="sr-only">{ADMIN_TRANSLATOR[lang.value].language}</span>
      <Select
        value={lang.value}
        onValueChange={(value) => (lang.value = value as Lang)}
      >
        <SelectTrigger></SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ar">العربية</SelectItem>
          <SelectItem value="tr">Türkçe</SelectItem>
        </SelectContent>
      </Select>
    </label>
  )
}

export default LanguageSelect
