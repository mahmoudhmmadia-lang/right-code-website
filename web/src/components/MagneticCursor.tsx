import { useEffect, useRef, useState } from "react"

type Point = { x: number; y: number }

type Particle = Point & {
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

const interactiveSelector =
  "a, button, [data-magnetic], input, textarea, select, [role='button']"

export default function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (!finePointer || reduceMotion) return

    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    let disposed = false
    let cleanupRuntime: (() => void) | undefined
    const idleId = window.requestIdleCallback?.(start, { timeout: 180 })
    const fallbackId = idleId == null ? window.setTimeout(start, 100) : undefined

    function start() {
      if (disposed || !canvas || !context) return
      document.documentElement.classList.add("magnetic-cursor-active")

      const pointer: Point = { x: -100, y: -100 }
      const dot: Point = { x: -100, y: -100 }
      const ring: Point = { x: -100, y: -100 }
      const particles: Particle[] = []
      const colors = ["#42d1d5", "#006b70", "#ffb84d"]
      let frame = 0
      let lastParticleAt = 0
      let canvasWidth = window.innerWidth
      let canvasHeight = window.innerHeight

      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        canvasWidth = window.innerWidth
        canvasHeight = window.innerHeight
        canvas.width = Math.round(canvasWidth * ratio)
        canvas.height = Math.round(canvasHeight * ratio)
        canvas.style.width = `${canvasWidth}px`
        canvas.style.height = `${canvasHeight}px`
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
      }

      const addParticle = (x: number, y: number) => {
        if (particles.length >= 18) particles.shift()
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9,
          size: 1.2 + Math.random() * 2.6,
          life: 0,
          maxLife: 22 + Math.random() * 14,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      const onPointerMove = (event: PointerEvent) => {
        setVisible(true)
        const target =
          event.target instanceof HTMLElement
            ? event.target.closest<HTMLElement>(interactiveSelector)
            : null
        const isInteractive = Boolean(target)
        setHovered((current) =>
          current === isInteractive ? current : isInteractive
        )

        let nextX = event.clientX
        let nextY = event.clientY
        if (target) {
          const bounds = target.getBoundingClientRect()
          const centerX = bounds.left + bounds.width / 2
          const centerY = bounds.top + bounds.height / 2
          const distance = Math.hypot(centerX - nextX, centerY - nextY)
          const range = Math.max(120, Math.min(bounds.width, bounds.height) * 1.4)
          const strength = Math.max(0, 1 - distance / range)
          const pull = target.hasAttribute("data-magnetic") ? 0.24 : 0.12
          nextX += (centerX - nextX) * strength * pull
          nextY += (centerY - nextY) * strength * pull
        }
        pointer.x = nextX
        pointer.y = nextY

        if (event.timeStamp - lastParticleAt > 24) {
          addParticle(event.clientX, event.clientY)
          lastParticleAt = event.timeStamp
        }
      }

      const onPointerOut = (event: PointerEvent) => {
        if (!event.relatedTarget) setVisible(false)
      }
      const onPointerDown = () => setClicking(true)
      const onPointerUp = () => setClicking(false)

      const render = () => {
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        dot.x += (pointer.x - dot.x) * 0.34
        dot.y += (pointer.y - dot.y) * 0.34
        ring.x += (pointer.x - ring.x) * 0.17
        ring.y += (pointer.y - ring.y) * 0.17

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${dot.x}px,${dot.y}px,0)`
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ring.x}px,${ring.y}px,0)`
        }

        for (let index = particles.length - 1; index >= 0; index -= 1) {
          const particle = particles[index]
          particle.life += 1
          particle.x += particle.vx
          particle.y += particle.vy
          if (particle.life >= particle.maxLife) {
            particles.splice(index, 1)
            continue
          }
          const progress = particle.life / particle.maxLife
          context.save()
          context.globalAlpha = (1 - progress) * 0.62
          context.shadowBlur = 8
          context.shadowColor = particle.color
          context.fillStyle = particle.color
          context.beginPath()
          context.arc(
            particle.x,
            particle.y,
            Math.max(0.2, particle.size * (1 - progress)),
            0,
            Math.PI * 2
          )
          context.fill()
          context.restore()
        }
        frame = requestAnimationFrame(render)
      }

      resize()
      window.addEventListener("resize", resize)
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      window.addEventListener("pointerout", onPointerOut)
      window.addEventListener("pointerdown", onPointerDown)
      window.addEventListener("pointerup", onPointerUp)
      frame = requestAnimationFrame(render)

      cleanupRuntime = () => {
        window.removeEventListener("resize", resize)
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerout", onPointerOut)
        window.removeEventListener("pointerdown", onPointerDown)
        window.removeEventListener("pointerup", onPointerUp)
        cancelAnimationFrame(frame)
      }
    }

    return () => {
      disposed = true
      if (idleId != null) window.cancelIdleCallback?.(idleId)
      if (fallbackId != null) window.clearTimeout(fallbackId)
      cleanupRuntime?.()
      document.documentElement.classList.remove("magnetic-cursor-active")
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        data-magnetic-cursor-layer
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[9998] transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={dotRef}
        data-magnetic-cursor-layer
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -mt-1.5 -ml-1.5 size-3 rounded-full bg-main shadow-[0_0_16px_rgba(66,209,213,.9)] transition-[scale,opacity] duration-150"
        style={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.55 : hovered ? 1.55 : 1,
        }}
      />
      <div
        ref={ringRef}
        data-magnetic-cursor-layer
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -mt-5 -ml-5 size-10 rounded-full border transition-[scale,opacity,background-color,border-color] duration-200"
        style={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.78 : hovered ? 1.48 : 1,
          backgroundColor: hovered ? "rgba(66,209,213,.12)" : "transparent",
          borderColor: hovered ? "#ffb84d" : "rgba(66,209,213,.62)",
        }}
      />
    </>
  )
}
