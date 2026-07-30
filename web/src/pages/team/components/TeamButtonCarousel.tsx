import { Button } from "@/components/ui/button"
import LazyImage from "@/components/LazyImage"
import { cn } from "@/lib/utils"
import { mediaUrl } from "@/lib/media"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, ExternalLink, Maximize2, X } from "lucide-react"
import { Dialog } from "radix-ui"
import { useState } from "react"
import type { CSSProperties, PointerEvent } from "react"
import type { TeamMember } from "../useTeam"
import type { RouteSectionBody } from "@/pages/site/types"

type TeamContent = NonNullable<RouteSectionBody["teamPeople"]>

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

function ImageSpotlight({
  children,
  className,
  alwaysOn = false,
}: {
  children: React.ReactNode
  className?: string
  alwaysOn?: boolean
}) {
  const updateSpotlight = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty(
      "--spotlight-x",
      `${event.clientX - bounds.left}px`
    )
    event.currentTarget.style.setProperty(
      "--spotlight-y",
      `${event.clientY - bounds.top}px`
    )
  }

  return (
    <div
      onPointerMove={updateSpotlight}
      style={
        {
          "--spotlight-x": "50%",
          "--spotlight-y": "40%",
        } as CSSProperties
      }
      className={cn(
        "group/spotlight relative h-full w-full overflow-hidden bg-[#092225]",
        className
      )}
    >
      {children}
      <div className={cn("pointer-events-none absolute inset-0 transition-opacity duration-300", alwaysOn ? "opacity-100" : "opacity-0 group-hover/spotlight:opacity-100 group-focus-within/spotlight:opacity-100")}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_260px_at_var(--spotlight-x)_var(--spotlight-y),rgba(255,255,255,.14),rgba(255,255,255,.035)_38%,transparent_68%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_230px_at_var(--spotlight-x)_var(--spotlight-y),transparent_32%,rgba(0,0,0,.2)_82%)]" />
      </div>
    </div>
  )
}

function MemberPortrait({
  member,
  className,
  eager = false,
  spotlightAlwaysOn = false,
}: {
  member: TeamMember
  className?: string
  eager?: boolean
  spotlightAlwaysOn?: boolean
}) {
  return (
    <ImageSpotlight className={className} alwaysOn={spotlightAlwaysOn}>
      {member.imageUrl ? (
        <>
          <LazyImage
            src={mediaUrl(member.imageUrl)}
            alt={member.fullName}
            width={1200}
            height={900}
            priority={eager}
            className={cn(
              "h-full w-full object-cover saturate-[.92] transition duration-500 group-hover/spotlight:scale-[1.025]",
              spotlightAlwaysOn
                ? "opacity-[.58] brightness-[.7]"
                : "opacity-[.76] brightness-[.78]"
            )}
          />
          <img
            src={mediaUrl(member.imageUrl)}
            alt=""
            aria-hidden="true"
            width={1200}
            height={900}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle 270px at var(--spotlight-x) var(--spotlight-y), black 0%, rgba(0,0,0,.96) 38%, transparent 72%)",
              maskImage:
                "radial-gradient(circle 270px at var(--spotlight-x) var(--spotlight-y), black 0%, rgba(0,0,0,.96) 38%, transparent 72%)",
            }}
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full object-cover saturate-[1.06] transition duration-500 group-hover/spotlight:scale-[1.025]",
              spotlightAlwaysOn
                ? "opacity-100"
                : "opacity-0 group-hover/spotlight:opacity-100 group-focus-within/spotlight:opacity-100"
            )}
          />
        </>
      ) : (
        <div
          className="grid h-full w-full place-items-center bg-[linear-gradient(145deg,rgba(0,107,112,.3),rgba(255,184,77,.17))] text-7xl font-black text-main/75"
          aria-label={member.fullName}
        >
          {initials(member.fullName)}
        </div>
      )}
    </ImageSpotlight>
  )
}

function MemberDialog({
  member,
  open,
  onOpenChange,
  content,
}: {
  member: TeamMember
  open: boolean
  onOpenChange: (open: boolean) => void
  content?: TeamContent
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[#031112]/80 backdrop-blur-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[71] grid max-h-[92svh] w-[min(1180px,94vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/15 bg-[#081b1d] text-white shadow-[0_45px_160px_rgba(0,0,0,.55)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 md:grid-cols-[.88fr_1.12fr]">
          <div className="relative min-h-72 overflow-hidden md:min-h-[620px]">
            <MemberPortrait
              member={member}
              className="absolute inset-0 h-full w-full"
              eager
              spotlightAlwaysOn
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#081b1d]/78 via-[#081b1d]/8 to-transparent md:bg-linear-to-r md:from-transparent md:via-[#081b1d]/5 md:to-[#081b1d]/86" />
          </div>
          <div className="flex max-h-[92svh] flex-col justify-center overflow-y-auto p-7 sm:p-10 lg:p-14">
            <p className="text-[10px] font-black tracking-[.22em] text-main uppercase">
              {content?.memberLabel}
            </p>
            <Dialog.Title className="mt-5 text-[clamp(2.4rem,5vw,5.25rem)] leading-[.92] font-black">
              {member.fullName}
            </Dialog.Title>
            <p className="mt-5 text-sm font-black tracking-[.15em] text-[#ffbd5a] uppercase">
              {member.jobTitle?.title}
            </p>
            <Dialog.Description className="mt-8 max-w-xl text-base leading-8 text-white/62 sm:text-lg">
              {member.bio}
            </Dialog.Description>
            <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
              {member.linkedInUrl ? (
                <Button
                  asChild
                  className="rounded-full bg-main px-6 text-white"
                >
                  <a href={member.linkedInUrl} target="_blank" rel="noreferrer">
                    {content?.linkedInLabel}
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              ) : null}
              <Dialog.Close asChild>
                <Button
                  variant="outline"
                  className="rounded-full border-white/15 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
                >
                  {content?.backToTeamLabel}
                </Button>
              </Dialog.Close>
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-5 right-5 grid size-11 place-items-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md transition hover:rotate-90 hover:border-main/50 hover:text-main"
            >
              <span className="sr-only">{content?.closeProfileLabel}</span>
              <X className="size-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function TeamButtonCarousel({ members, content }: { members: TeamMember[]; content?: TeamContent }) {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!members.length) return content?.emptyMessage ? <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-main/15 bg-main/5 p-5 text-center text-sm text-alt/60">{content.emptyMessage}</p> : null

  const activeMember = members[activeIndex]

  const select = (nextIndex: number) => {
    if (nextIndex === activeIndex) return
    setDirection(nextIndex > activeIndex ? 1 : -1)
    setActiveIndex(nextIndex)
  }

  const move = (nextDirection: 1 | -1) => {
    setDirection(nextDirection)
    setActiveIndex(
      (current) => (current + nextDirection + members.length) % members.length
    )
  }

  return (
    <div className="mx-auto mt-14 max-w-7xl">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-main/15 bg-[#071d1f] px-4 py-6 shadow-[0_34px_110px_rgba(5,30,31,.22)] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(66,209,213,.17),transparent_32%),linear-gradient(115deg,rgba(255,184,77,.1),transparent_28%,rgba(0,107,112,.12))]" />

        <div className="relative min-h-[500px] overflow-hidden rounded-[1.5rem] sm:min-h-[560px] lg:min-h-[620px]">
          <div className="absolute inset-x-0 top-1/2 h-[430px] -translate-y-1/2 [perspective:1500px] sm:h-[500px] lg:h-[560px]">
            {members.map((member, index) => {
              const rawOffset = index - activeIndex
              const offset =
                rawOffset > members.length / 2
                  ? rawOffset - members.length
                  : rawOffset < -members.length / 2
                    ? rawOffset + members.length
                    : rawOffset
              const absOffset = Math.abs(offset)
              const active = index === activeIndex
              const visible = absOffset <= 2
              const xPosition = `calc(-50% + ${offset * (reduceMotion ? 56 : 260)}px)`

              return (
                <motion.button
                  key={member.id}
                  type="button"
                  onClick={() => (active ? setDialogOpen(true) : select(index))}
                  aria-pressed={active}
                  aria-label={`${content?.openProfileLabel ?? "Open profile"}: ${member.fullName}`}
                  className={cn(
                    "absolute top-1/2 left-1/2 h-[380px] w-[min(74vw,290px)] overflow-hidden rounded-[1.45rem] border bg-[#092225] text-start shadow-[0_30px_90px_rgba(0,0,0,.32)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-main sm:h-[450px] sm:w-[330px] lg:h-[500px] lg:w-[360px]",
                    active
                      ? "border-main/45"
                      : "border-white/10 hover:border-main/30"
                  )}
                  style={{
                    zIndex: 20 - absOffset,
                    pointerEvents: visible ? "auto" : "none",
                  }}
                  animate={
                    reduceMotion
                      ? {
                          x: xPosition,
                          y: "-50%",
                          opacity: visible ? 1 : 0,
                          scale: active ? 1 : 0.92,
                        }
                      : {
                          x: xPosition,
                          y: "-50%",
                          rotateY: offset * -28,
                          rotateZ: offset * 2,
                          opacity: visible ? (active ? 1 : 0.56) : 0,
                          scale: active ? 1 : 0.82,
                        }
                  }
                  transition={{
                    type: reduceMotion ? "tween" : "spring",
                    stiffness: 150,
                    damping: 26,
                    duration: reduceMotion ? 0.18 : undefined,
                  }}
                >
                  <MemberPortrait
                    member={member}
                    eager={active}
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#041415]/95 via-black/10 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                    <p className="text-[9px] font-black tracking-[.2em] text-main uppercase">
                      {member.jobTitle?.title ?? content?.memberLabel}
                    </p>
                    <h3 className="mt-2 text-2xl leading-tight font-black sm:text-3xl">
                      {member.fullName}
                    </h3>
                  </div>
                  <span className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[10px] font-bold tracking-[.14em] text-white/70 backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </motion.button>
              )
            })}
          </div>

          <div className="absolute inset-x-0 bottom-4 z-40 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label={content?.previousMemberLabel}
              className="grid size-12 place-items-center rounded-full border border-white/15 bg-[#061718]/80 text-white/75 shadow-2xl backdrop-blur-xl transition hover:bg-white/10 hover:text-main focus-visible:outline-2 focus-visible:outline-main"
            >
              <ArrowLeft className="size-4 rtl:rotate-180" />
            </button>
            <span className="rounded-full border border-white/12 bg-[#061718]/75 px-4 py-2 text-[10px] font-black tracking-[.16em] text-white/60 backdrop-blur-xl">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(members.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label={content?.nextMemberLabel}
              className="grid size-12 place-items-center rounded-full border border-white/15 bg-[#061718]/80 text-white/75 shadow-2xl backdrop-blur-xl transition hover:bg-white/10 hover:text-main focus-visible:outline-2 focus-visible:outline-main"
            >
              <ArrowRight className="size-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={activeMember.id}
          custom={direction}
          className="mt-6 grid gap-7 rounded-[2rem] border border-main/12 bg-card/65 p-6 shadow-[0_24px_80px_rgba(0,107,112,.08)] backdrop-blur-md sm:p-8 lg:grid-cols-[.72fr_1.28fr] lg:p-10"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 22, x: direction * 18 }
          }
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -12, x: direction * -14 }
          }
          transition={{ duration: reduceMotion ? 0.12 : 0.38 }}
        >
          <div>
            <p className="text-[9px] font-black tracking-[.2em] text-main uppercase">
              {activeMember.jobTitle?.title ?? (
                content?.memberLabel
              )}
            </p>
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,4rem)] leading-[.95] font-black text-alt dark:text-foreground">
              {activeMember.fullName}
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-8 text-alt/60 dark:text-foreground/60">
              {activeMember.bio}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                onClick={() => setDialogOpen(true)}
                className="h-12 rounded-full bg-alt px-6 text-white hover:bg-main dark:bg-foreground dark:text-[#071112] dark:hover:bg-main dark:hover:text-white"
              >
                {content?.openProfileLabel}
                <Maximize2 className="size-4" />
              </Button>
              {activeMember.linkedInUrl ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-main/25 bg-transparent px-6 text-main hover:bg-main/8 hover:text-main dark:border-main/30 dark:text-main"
                >
                  <a
                    href={activeMember.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content?.linkedInLabel}
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <MemberDialog
        member={activeMember}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        content={content}
      />
    </div>
  )
}
