import { LANGS } from "@/constants/global"
import { lang } from "@/context/global"
import { AnimatePresence, motion } from "framer-motion"
import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useSignals } from "@preact/signals-react/runtime"

function LangSelect() {
  useSignals()
  return (
    <Select
      value={lang.value}
      onValueChange={(v) => {
        lang.value = v as "ar"
      }}
    >
      <SelectTrigger className="group relative w-[150px] gap-3 rounded-2xl border border-main bg-main/10 px-4 text-main shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 ease-out hover:bg-main/20 hover:shadow-2xl data-[state=open]:bg-main/10">
        <Globe className="h-4 w-4 text-main/60 transition-colors group-hover:text-white" />

        <SelectValue
          placeholder="Language"
          defaultValue={lang.value}
          className="text-main"
        ></SelectValue>
      </SelectTrigger>

      <SelectContent
        position="popper"
        className="z-50 overflow-hidden rounded-2xl border p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {LANGS.map((l, i) => (
              <SelectItem
                key={l.value}
                value={l.value}
                className="x relative flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm transition-colors outline-none hover:bg-white/5 focus:bg-white/10 data-[state=checked]:bg-white/10"
              >
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="flex w-full items-center justify-between gap-3"
                >
                  <span className="font-medium text-alt">{l.label}</span>
                </motion.div>
              </SelectItem>
            ))}
          </motion.div>
        </AnimatePresence>
      </SelectContent>
    </Select>
  )
}

export default LangSelect
