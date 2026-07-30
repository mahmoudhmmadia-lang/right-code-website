import type { PublicProject } from "@/hooks/usePublicContent"
import LazyImage from "@/components/LazyImage"
import { mediaUrl } from "@/lib/media"
import { cn } from "@/lib/utils"

export function ProjectArtwork({ project, className, imageClassName, priority = false, cover = false }: { project: PublicProject; className?: string; imageClassName?: string; priority?: boolean; cover?: boolean }) {
  const accent = project.accentColor && /^#[0-9a-f]{6}$/i.test(project.accentColor) ? project.accentColor : "#006b70"
  return (
    <div className={cn("relative isolate overflow-hidden bg-[#0a1918]", className)} style={{ background: `linear-gradient(145deg, ${accent} 0%, #081817 68%)` }}>
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="absolute -top-24 -right-20 size-72 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 size-56 rounded-full bg-black/30 blur-3xl" />
      {project.coverImageUrl ? (
        <LazyImage src={mediaUrl(project.coverImageUrl)} alt="" width={1600} height={1000} priority={priority} className={cn(cover ? "absolute inset-0 z-10 size-full object-cover" : "relative z-10 max-h-28 max-w-[58%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,.32)]", imageClassName)} />
      ) : (
        <span className="relative z-10 text-[clamp(3.5rem,9vw,7rem)] leading-none font-black tracking-[-.1em] text-white/90">{(project.title ?? project.name).slice(0, 2).toUpperCase()}</span>
      )}
      <span className="absolute right-5 bottom-4 z-10 text-[9px] font-black tracking-[.18em] text-white/45 uppercase">{project.projectNumber}</span>
    </div>
  )
}
