import { response } from "@/context/global"
import { useSignals } from "@preact/signals-react/runtime"
import { CircleAlert, CircleCheck, X } from "lucide-react"

function Response() {
  useSignals()
  const value = response.value
  if (!value) return null

  return (
    <div className="fixed top-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 text-alt shadow-2xl backdrop-blur-xl rtl:right-auto rtl:left-5">
      {value.type === "success" ? (
        <CircleCheck className="mt-0.5 size-5 text-emerald-600" />
      ) : (
        <CircleAlert className="mt-0.5 size-5 text-red-600" />
      )}
      <p className="flex-1 text-sm font-medium">{value.message}</p>
      <button
        type="button"
        aria-label="Close"
        onClick={() => (response.value = undefined)}
        className="text-alt/40 transition hover:text-alt"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

export default Response
