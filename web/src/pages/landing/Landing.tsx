import Container from "@/components/Container"
import { PixelDriftText } from "@/components/PixelDriftText"
import { Button } from "@/components/ui/button"
import { useSignals } from "@preact/signals-react/runtime"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  ArrowDown,
  ArrowRight,
  Code2,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useEffect, useMemo, useRef, type ElementType } from "react"
import { useLanding } from "./useLanding"
import type { HomeHeroContent, HomeMedia } from "../home/types"
import { mediaUrl } from "@/lib/media"
import LazyImage from "@/components/LazyImage"

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 38 },
  visible: { opacity: 1, y: 0 },
}

const heroTags = [
  Layers3,
  ShieldCheck,
  Code2,
] as ElementType[]

type Point3D = [number, number, number]

const phi = (1 + Math.sqrt(5)) / 2
const shapeVertices: Point3D[] = [
  [-1, phi, 0],
  [1, phi, 0],
  [-1, -phi, 0],
  [1, -phi, 0],
  [0, -1, phi],
  [0, 1, phi],
  [0, -1, -phi],
  [0, 1, -phi],
  [phi, 0, -1],
  [phi, 0, 1],
  [-phi, 0, -1],
  [-phi, 0, 1],
]

const shapeEdges = shapeVertices.flatMap((point, index) =>
  shapeVertices.slice(index + 1).flatMap((otherPoint, offset) => {
    const distance = Math.hypot(
      point[0] - otherPoint[0],
      point[1] - otherPoint[1],
      point[2] - otherPoint[2]
    )

    return distance < 2.05 ? [[index, index + offset + 1] as const] : []
  })
)

function rotatePoint(
  [x, y, z]: Point3D,
  rotationX: number,
  rotationY: number,
  rotationZ: number
): Point3D {
  const cosX = Math.cos(rotationX)
  const sinX = Math.sin(rotationX)
  const cosY = Math.cos(rotationY)
  const sinY = Math.sin(rotationY)
  const cosZ = Math.cos(rotationZ)
  const sinZ = Math.sin(rotationZ)
  const yX = y * cosX - z * sinX
  const zX = y * sinX + z * cosX
  const xY = x * cosY + zX * sinY
  const zY = -x * sinY + zX * cosY

  return [xY * cosZ - yX * sinZ, xY * sinZ + yX * cosZ, zY]
}

function InteractiveScene({
  imageUrl,
  primaryLabel,
  secondaryLabel,
}: {
  imageUrl?: string
  primaryLabel?: string
  secondaryLabel?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = sceneRef.current

    if (!canvas || !scene) return

    const context = canvas.getContext("2d")
    if (!context) return

    let width = 0
    let height = 0
    let frame = 0
    let lastTime = performance.now()
    let targetPointerX = 0
    let targetPointerY = 0
    let pointerX = 0
    let pointerY = 0
    let scrollVelocity = 0
    let rotationFromScroll = 0
    let isPointerInside = false
    let isVisible = true

    const resize = () => {
      const bounds = scene.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(bounds.width, 1)
      height = Math.max(bounds.height, 1)
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const onPointerMove = (event: PointerEvent) => {
      const bounds = scene.getBoundingClientRect()
      targetPointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      targetPointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
      isPointerInside = true
    }

    const onPointerLeave = () => {
      targetPointerX = 0
      targetPointerY = 0
      isPointerInside = false
    }

    const onWheel = (event: WheelEvent) => {
      scrollVelocity += Math.max(-90, Math.min(90, event.deltaY)) * 0.0008
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(scene)
    scene.addEventListener("pointermove", onPointerMove)
    scene.addEventListener("pointerleave", onPointerLeave)
    window.addEventListener("wheel", onWheel, { passive: true })
    resize()

    const draw = (time: number) => {
      frame = 0
      if (!isVisible) return

      const delta = Math.min((time - lastTime) / 16.67, 2)
      lastTime = time
      pointerX += (targetPointerX - pointerX) * 0.065 * delta
      pointerY += (targetPointerY - pointerY) * 0.065 * delta
      scrollVelocity *= Math.pow(0.9, delta)
      rotationFromScroll += scrollVelocity * delta

      context.clearRect(0, 0, width, height)

      const centerX = width * (0.5 + pointerX * 0.045)
      const centerY = height * (0.5 + pointerY * 0.045)
      const size = Math.min(width, height) * 0.22
      const elapsed = reduceMotion ? 0.6 : time * 0.00025
      const rotationX = elapsed * 0.72 - pointerY * 0.48 + rotationFromScroll
      const rotationY = elapsed + pointerX * 0.62 + rotationFromScroll * 0.7
      const rotationZ = elapsed * 0.32 + pointerX * 0.12

      const glow = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        size * 2.4
      )
      glow.addColorStop(0, "rgba(66, 209, 213, 0.17)")
      glow.addColorStop(0.44, "rgba(0, 107, 112, 0.07)")
      glow.addColorStop(1, "rgba(0, 107, 112, 0)")
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      const projected = shapeVertices.map((point) => {
        const rotated = rotatePoint(point, rotationX, rotationY, rotationZ)
        const perspective = 3.7 / (4.2 - rotated[2] * 0.48)

        return {
          x: centerX + rotated[0] * size * perspective,
          y: centerY + rotated[1] * size * perspective,
          z: rotated[2],
          scale: perspective,
        }
      })

      context.save()
      context.globalCompositeOperation = "screen"
      shapeEdges
        .map(([from, to]) => ({
          from: projected[from],
          to: projected[to],
          depth: (projected[from].z + projected[to].z) / 2,
        }))
        .sort((a, b) => a.depth - b.depth)
        .forEach(({ from, to, depth }) => {
          const alpha = Math.max(0.14, Math.min(0.9, 0.36 + depth * 0.18))
          const lineGradient = context.createLinearGradient(
            from.x,
            from.y,
            to.x,
            to.y
          )
          lineGradient.addColorStop(0, `rgba(66, 209, 213, ${alpha})`)
          lineGradient.addColorStop(1, `rgba(255, 184, 77, ${alpha * 0.78})`)
          context.beginPath()
          context.moveTo(from.x, from.y)
          context.lineTo(to.x, to.y)
          context.lineWidth = 0.65 + Math.max(0, depth) * 0.34
          context.strokeStyle = lineGradient
          context.shadowColor = "rgba(66, 209, 213, 0.45)"
          context.shadowBlur = depth > 0 ? 12 : 0
          context.stroke()
        })

      projected.forEach((point) => {
        const radius = Math.max(1.3, 2.5 * point.scale)
        context.beginPath()
        context.arc(point.x, point.y, radius, 0, Math.PI * 2)
        context.fillStyle =
          point.z > 0
            ? "rgba(255, 210, 135, 0.92)"
            : "rgba(101, 229, 226, 0.48)"
        context.shadowColor = "rgba(66, 209, 213, 0.75)"
        context.shadowBlur = point.z > 0 ? 18 : 7
        context.fill()
      })
      context.restore()

      for (let ringIndex = 0; ringIndex < 3; ringIndex += 1) {
        const orbit = elapsed * (ringIndex % 2 ? -1.2 : 1) + ringIndex * 2.1
        const orbitRadius = size * (1.35 + ringIndex * 0.28)
        const squash = 0.28 + ringIndex * 0.06
        const orbitX = centerX + Math.cos(orbit) * orbitRadius
        const orbitY = centerY + Math.sin(orbit) * orbitRadius * squash
        const radius = 4 + ringIndex * 2

        context.beginPath()
        context.arc(orbitX, orbitY, radius, 0, Math.PI * 2)
        context.fillStyle =
          ringIndex === 1
            ? "rgba(255, 184, 77, 0.9)"
            : "rgba(66, 209, 213, 0.88)"
        context.shadowColor = context.fillStyle
        context.shadowBlur = 18
        context.fill()
      }

      if (isPointerInside && !reduceMotion) {
        const cursorX = width * (0.5 + targetPointerX * 0.5)
        const cursorY = height * (0.5 + targetPointerY * 0.5)
        const pulse = 14 + Math.sin(time * 0.004) * 3

        context.beginPath()
        context.arc(cursorX, cursorY, pulse, 0, Math.PI * 2)
        context.strokeStyle = "rgba(159, 245, 243, 0.52)"
        context.lineWidth = 1
        context.stroke()
        context.beginPath()
        context.moveTo(cursorX, cursorY)
        context.lineTo(centerX, centerY)
        context.setLineDash([3, 8])
        context.strokeStyle = "rgba(66, 209, 213, 0.2)"
        context.stroke()
        context.setLineDash([])
      }

      frame = requestAnimationFrame(draw)
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting
        const shouldRestart = nextVisible && !isVisible
        isVisible = nextVisible

        if (shouldRestart && !frame) {
          lastTime = performance.now()
          frame = requestAnimationFrame(draw)
        }
      },
      { rootMargin: "160px 0px" }
    )
    intersectionObserver.observe(scene)
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      scene.removeEventListener("pointermove", onPointerMove)
      scene.removeEventListener("pointerleave", onPointerLeave)
      window.removeEventListener("wheel", onWheel)
    }
  }, [reduceMotion])

  return (
    <div
      ref={sceneRef}
      className="relative aspect-square w-full max-w-[620px] cursor-crosshair select-none"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-[16%] [transform:rotateX(67deg)] rounded-full border border-main/15 dark:border-main/20" />
      <div className="pointer-events-none absolute inset-[9%] [transform:rotateY(72deg)] rounded-full border border-dashed border-main/15 dark:border-main/20" />

      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] border border-white/50 bg-white/45 shadow-[0_28px_100px_rgba(0,107,112,0.22)] backdrop-blur-xl sm:size-28 dark:border-main/25 dark:bg-[#0b2022]/48"
        animate={reduceMotion ? undefined : { rotate: [0, 4, 0, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <LazyImage
          src={imageUrl || mediaUrl("/assets/home/logo.png")}
          alt="Right Code"
          width={80}
          height={80}
          priority
          className="w-16 drop-shadow-[0_12px_24px_rgba(0,0,0,0.2)] sm:w-20"
        />
      </motion.div>

      {primaryLabel ? (
        <div className="pointer-events-none absolute top-[17%] right-[5%] rounded-full border border-main/20 bg-card/55 px-3 py-1.5 text-[9px] font-bold tracking-[0.22em] text-main uppercase shadow-xl backdrop-blur-md dark:bg-[#081719]/60">
          {primaryLabel}
        </div>
      ) : null}
      {secondaryLabel ? (
        <div className="pointer-events-none absolute bottom-[15%] left-[3%] flex items-center gap-2 rounded-full border border-main/20 bg-card/55 px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] text-alt/60 uppercase shadow-xl backdrop-blur-md dark:bg-[#081719]/60 dark:text-foreground/60">
          <span className="size-1.5 rounded-full bg-[#ffb84d] shadow-[0_0_12px_#ffb84d]" />
          {secondaryLabel}
        </div>
      ) : null}
    </div>
  )
}

function InfiniteRail({ items, ariaLabel }: { items: string[]; ariaLabel?: string }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || reduceMotion) return

    let frame = 0
    let lastTime = performance.now()
    let offset = 0
    let wheelVelocity = 0
    let loopWidth = track.scrollWidth / 2
    let isVisible = true

    const updateWidth = () => {
      loopWidth = track.scrollWidth / 2
    }

    const onWheel = (event: WheelEvent) => {
      if (!isVisible) return
      wheelVelocity += Math.max(-70, Math.min(70, event.deltaY)) * 0.022
    }

    const animate = (time: number) => {
      frame = 0
      if (!isVisible) return

      const delta = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      wheelVelocity *= Math.pow(0.92, delta * 60)
      offset -= (34 + wheelVelocity * 28) * delta

      if (loopWidth > 0) {
        offset = ((offset % loopWidth) + loopWidth) % loopWidth
        offset -= loopWidth
      }

      track.style.transform = `translate3d(${offset}px, 0, 0)`
      frame = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(updateWidth)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting
        const shouldRestart = nextVisible && !isVisible
        isVisible = nextVisible

        if (shouldRestart && !frame) {
          lastTime = performance.now()
          frame = requestAnimationFrame(animate)
        }
      },
      { rootMargin: "120px 0px" }
    )
    resizeObserver.observe(track)
    intersectionObserver.observe(viewport)
    window.addEventListener("wheel", onWheel, { passive: true })
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener("wheel", onWheel)
    }
  }, [reduceMotion])

  const repeatedItems = [...items, ...items]

  return (
    <div
      ref={viewportRef}
      className="relative overflow-hidden border-y border-alt/[0.08] bg-white/25 py-4 backdrop-blur-sm dark:border-foreground/[0.08] dark:bg-white/[0.015]"
      dir="ltr"
      aria-label={ariaLabel}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background to-transparent sm:w-40" />
      <div
        ref={trackRef}
        className="flex w-max will-change-transform"
        style={
          reduceMotion ? undefined : { transform: "translate3d(-50%,0,0)" }
        }
      >
        {repeatedItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-5 px-5 text-[11px] font-black tracking-[0.24em] text-alt/55 uppercase dark:text-foreground/50"
          >
            <span>{item}</span>
            <Sparkles className="size-3 text-main" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Landing({ content, media }: { content?: HomeHeroContent; media?: HomeMedia["hero"] }) {
  useSignals()
  const { sectionRef } = useLanding()
  const heroRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  })
  const contentY = useTransform(smoothProgress, [0, 1], [0, 90])
  const visualY = useTransform(smoothProgress, [0, 1], [0, -105])
  const contentOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0.12])
  const tags = content?.tags
  const statItems = content?.stats
  const visualLabels = useMemo(
    () =>
      media?.visualLabels?.slice(0, 3) ?? [],
    [media]
  )
  const railItems = useMemo(
    () => [...visualLabels, ...(tags ?? [])],
    [tags, visualLabels]
  )

  return (
    <Container
      ref={sectionRef}
      className="app-section relative isolate overflow-hidden px-0 pt-0 pb-0 text-alt dark:text-foreground"
    >
      <div
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pt-[118px] sm:px-8 md:px-16 lg:px-24 xl:px-32"
      >
        {media?.backgroundImageUrl ? (
          <motion.img
            src={mediaUrl(media.backgroundImageUrl)}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.08] grayscale dark:opacity-[0.06]"
            initial={{ scale: 1.04 }}
            animate={reduceMotion ? undefined : { scale: 1.1 }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_76%_43%,rgba(66,209,213,0.16),transparent_28%),radial-gradient(circle_at_20%_18%,rgba(255,184,77,0.08),transparent_22%)] dark:bg-[radial-gradient(circle_at_76%_43%,rgba(66,209,213,0.14),transparent_29%),radial-gradient(circle_at_18%_18%,rgba(255,184,77,0.06),transparent_25%)]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-20 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-main/[0.07]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-20 h-[48vw] w-[48vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-main/[0.08]" />

        <motion.div
          className="mx-auto grid w-full max-w-[1500px] flex-1 items-center gap-4 pb-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-0"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            className="relative z-10 text-center lg:text-start"
            style={
              reduceMotion
                ? undefined
                : { y: contentY, opacity: contentOpacity }
            }
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.72, ease }}
              className="mb-6 inline-flex items-center gap-3 text-[10px] font-black tracking-[0.25em] text-main uppercase"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-main opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-main shadow-[0_0_18px_rgba(66,209,213,0.8)]" />
              </span>
              {content?.badge}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.85, ease }}
              className="mx-auto max-w-[780px] text-balance lg:mx-0"
            >
              <PixelDriftText className="gradient-text bg-clip-text text-[clamp(2.9rem,6.25vw,6.25rem)] leading-[0.91] font-black tracking-[-0.07em] text-transparent dark:bg-[linear-gradient(130deg,#f4fffe_0%,#9ff5f3_48%,#ffb84d_105%)]">
                {content?.heading}
              </PixelDriftText>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.78, ease }}
              className="mx-auto mt-7 max-w-[620px] text-sm leading-[1.8] text-alt/60 sm:text-base lg:mx-0 dark:text-foreground/60"
            >
              {content?.subheading}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.78, ease }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start"
            >
              {heroTags.map((Icon, index) => (
                <motion.div
                  key={index}
                  className="group inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.13em] text-alt/55 uppercase dark:text-foreground/55"
                  whileHover={{ x: 4, color: "var(--color-main)" }}
                >
                  <Icon className="size-3.5 text-main transition-transform group-hover:rotate-6" />
                  {tags?.[index]}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.78, ease }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              {content?.primaryCta?.href ? <Button
                asChild
                className="group h-13 min-w-[205px] overflow-hidden rounded-full border-0 bg-alt px-7 font-bold text-white shadow-[0_18px_50px_rgba(18,36,35,0.18)] transition hover:-translate-y-1 hover:bg-main dark:bg-foreground dark:text-[#071112] dark:hover:bg-main dark:hover:text-white"
              >
                  <a href={content.primaryCta.href}>
                    {content.primaryCta.label}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </a>
              </Button> : null}

              {content?.secondaryCta?.href ? <Button
                asChild
                variant="ghost"
                className="group h-13 min-w-[170px] rounded-full border border-alt/15 bg-transparent px-7 font-bold text-alt transition hover:-translate-y-1 hover:border-main/50 hover:bg-main/5 hover:text-main dark:border-foreground/15 dark:text-foreground dark:hover:border-main/50 dark:hover:bg-main/5 dark:hover:text-main"
              >
                  <a href={content.secondaryCta.href}>
                    {content.secondaryCta.label}
                  </a>
              </Button> : null}
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 1, ease }}
            className="relative z-0 mx-auto flex w-full items-center justify-center lg:-me-[6vw]"
            style={reduceMotion ? undefined : { y: visualY }}
          >
            <InteractiveScene
              imageUrl={mediaUrl(media?.imageUrl)}
              primaryLabel={content?.scenePrimaryLabel}
              secondaryLabel={content?.sceneSecondaryLabel}
            />
          </motion.div>
        </motion.div>

        <motion.a
          href="#landing-stats"
          className="absolute bottom-20 left-4 hidden items-center gap-3 text-[9px] font-black tracking-[0.22em] text-alt/45 uppercase sm:left-8 md:left-16 md:flex lg:left-24 xl:left-32 dark:text-foreground/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span className="grid size-8 place-items-center rounded-full border border-alt/15 dark:border-foreground/15">
            <motion.span
              animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown className="size-3" />
            </motion.span>
          </span>
        </motion.a>
      </div>

      <InfiniteRail items={railItems} ariaLabel={content?.capabilitiesLabel} />

      <motion.div
        id="landing-stats"
        className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-px border-x border-b border-alt/[0.08] bg-alt/[0.08] sm:grid-cols-3 dark:border-foreground/[0.08] dark:bg-foreground/[0.08]"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
      >
        {(statItems ?? []).map((stat, index) => (
          <motion.div
            key={index}
            className="group relative overflow-hidden bg-background/70 px-7 py-9 text-center backdrop-blur-xl sm:text-start"
            whileHover={{ backgroundColor: "rgba(66, 209, 213, 0.06)" }}
          >
            <span className="absolute top-5 right-6 text-[9px] font-bold tracking-[0.2em] text-main/50">
              0{index + 1}
            </span>
            <div className="text-4xl font-black tracking-[-0.06em] text-alt transition-transform duration-500 group-hover:translate-x-1 group-hover:text-main sm:text-5xl dark:text-foreground">
              {stat.value}
            </div>
            <div className="mt-3 text-[10px] font-bold tracking-[0.18em] text-alt/45 uppercase dark:text-foreground/45">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  )
}

export default Landing
