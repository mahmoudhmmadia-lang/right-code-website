import { useSiteContent } from "@/context/site-content"
import { mediaUrl } from "@/lib/media"
import { useSignals } from "@preact/signals-react/runtime"

export default function LanguageLoader() {
  useSignals()
  const copy = useSiteContent()
  return (
    <div className="fixed inset-0 z-[100] grid min-h-screen place-items-center bg-background/95 px-6 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative mx-auto grid size-20 place-items-center rounded-3xl border border-main/20 bg-main/5">
          <span className="absolute inset-0 animate-ping rounded-3xl border border-main/20" />
          <img
            src={mediaUrl("/assets/home/logo.png")}
            alt=""
            width={52}
            height={52}
            className="relative size-12 object-contain"
          />
        </div>
        <p className="mt-6 text-sm font-black tracking-wide text-alt dark:text-foreground">
          {copy.languageLoading ?? ""}
        </p>
        <div className="mx-auto mt-4 h-1 w-32 overflow-hidden rounded-full bg-main/10">
          <span className="block h-full w-1/2 animate-[language-progress_.65s_ease-in-out_infinite_alternate] rounded-full bg-main" />
        </div>
      </div>
    </div>
  )
}
