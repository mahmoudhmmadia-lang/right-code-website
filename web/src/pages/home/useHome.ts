import { myAxios } from "@/api/myAxios"
import { lang } from "@/context/global"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { useReducedMotion, useScroll, useSpring } from "framer-motion"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { HOME_CHAPTERS } from "./constants"
import type { ApiEnvelope, HomeExperience } from "./types"

function useInertialWheel(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    let target = window.scrollY
    let current = window.scrollY

    const animate = () => {
      const distance = target - current
      current += distance * 0.105
      window.scrollTo({ top: current, behavior: "instant" })
      if (Math.abs(distance) < 0.35) return
      frame = requestAnimationFrame(animate)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      current = window.scrollY
      target = current
    }
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      event.preventDefault()
      cancelAnimationFrame(frame)
      target = Math.max(
        0,
        Math.min(
          document.documentElement.scrollHeight - window.innerHeight,
          target + Math.max(-180, Math.min(180, event.deltaY)) * 1.08,
        ),
      )
      frame = requestAnimationFrame(animate)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("pointerdown", stop, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("pointerdown", stop)
    }
  }, [enabled])
}

export function useHome() {
  const homeRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const locale = lang.value
  const experience = useCustomQuery<HomeExperience | null>({
    queryKey: ["home-experience", locale],
    staleTime: 5 * 60 * 1000,
    isErrLog: false,
    queryFn: async () =>
      (await myAxios.get<ApiEnvelope<HomeExperience | null>>("/sections/home-experience"))
        .data.materials,
  })
  const chapters = useMemo(
    () =>
      HOME_CHAPTERS.filter(
        (chapter) => experience.data?.content?.visibility?.[chapter.key] !== false,
      ).map((chapter) => ({
        ...chapter,
        label: experience.data?.[chapter.key]?.badge ?? experience.data?.[chapter.key]?.heading ?? "",
      })),
    [experience.data],
  )
  const { scrollYProgress } = useScroll({
    target: homeRef,
    offset: ["start start", "end end"],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 26,
    mass: 0.42,
  })

  useInertialWheel(
    !reduceMotion &&
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  )

  useEffect(() => {
    const root = homeRef.current
    if (!root) return
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-home-chapter]"))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveIndex(Number((visible.target as HTMLElement).dataset.homeChapter))
      },
      { rootMargin: "-30% 0px -46% 0px", threshold: [0, 0.2, 0.5] },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [chapters.length])

  const selectChapter = useCallback(
    (id: string) =>
      document.getElementById(id)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      }),
    [reduceMotion],
  )

  return { homeRef, activeIndex, chapters, progress, selectChapter, experience }
}
