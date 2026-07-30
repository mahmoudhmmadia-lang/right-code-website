import { cn } from "@/lib/utils"
import { useState, type ImgHTMLAttributes, type SyntheticEvent } from "react"

type LazyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string
  alt: string
  priority?: boolean
}

/**
 * A zero-wrapper image primitive that keeps native image semantics while adding
 * a lightweight skeleton and blur-up reveal. Width/height or an aspect-ratio
 * container should always be supplied by the caller to prevent layout shift.
 */
export default function LazyImage({
  src,
  alt,
  className,
  priority = false,
  loading,
  decoding = "async",
  fetchPriority,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)
  const loaded = resolvedSrc === src

  const finishLoading = (event: SyntheticEvent<HTMLImageElement>) => {
    setResolvedSrc(src)
    onLoad?.(event)
  }

  const finishWithError = (event: SyntheticEvent<HTMLImageElement>) => {
    setResolvedSrc(src)
    onError?.(event)
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      loading={priority ? "eager" : loading ?? "lazy"}
      decoding={decoding}
      fetchPriority={priority ? "high" : fetchPriority ?? "auto"}
      onLoad={finishLoading}
      onError={finishWithError}
      data-loaded={loaded ? "true" : "false"}
      className={cn(
        "transition-[filter,opacity,transform,background-color] duration-700 ease-out motion-reduce:duration-0",
        loaded
          ? "bg-transparent blur-0 opacity-100 scale-100"
          : "animate-pulse bg-main/10 blur-xl opacity-55 scale-[1.025] motion-reduce:animate-none motion-reduce:blur-none motion-reduce:scale-100",
        className
      )}
    />
  )
}
