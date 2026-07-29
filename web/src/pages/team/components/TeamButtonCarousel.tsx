import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { mediaUrl } from "@/lib/media"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, ExternalLink, Maximize2, X } from "lucide-react"
import { Dialog } from "radix-ui"
import { useState } from "react"
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

function MemberPortrait({
  member,
  className,
  eager = false,
}: {
  member: TeamMember
  className?: string
  eager?: boolean
}) {
  return member.imageUrl ? (
    <img
      src={mediaUrl(member.imageUrl)}
      alt={member.fullName}
      width={1200}
      height={900}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  ) : (
    <div
      className={cn(
        "grid place-items-center bg-[linear-gradient(145deg,rgba(0,107,112,.3),rgba(255,184,77,.17))] text-7xl font-black tracking-[-.08em] text-main/75",
        className
      )}
      aria-label={member.fullName}
    >
      {initials(member.fullName)}
    </div>
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
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#081b1d] via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-[#081b1d]" />
          </div>
          <div className="flex max-h-[92svh] flex-col justify-center overflow-y-auto p-7 sm:p-10 lg:p-14">
            <p className="text-[10px] font-black tracking-[.22em] text-main uppercase">
              {content?.memberLabel}
            </p>
            <Dialog.Title className="mt-5 text-[clamp(2.4rem,5vw,5.25rem)] leading-[.92] font-black tracking-[-.07em]">
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
  const nextMember = members[(activeIndex + 1) % members.length]

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
    <div className="mx-auto mt-14 max-w-6xl">
      <div className="relative isolate overflow-hidden rounded-[2.25rem] border border-main/15 bg-[#071d1f] p-3 shadow-[0_34px_110px_rgba(5,30,31,.22)] sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(66,209,213,.18),transparent_28%),radial-gradient(circle_at_15%_88%,rgba(255,184,77,.11),transparent_24%)]" />

        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] sm:aspect-[16/10] lg:aspect-[16/8.7]">
          <div className="pointer-events-none absolute top-[8%] right-[-7%] z-0 hidden h-[84%] w-[28%] rotate-3 overflow-hidden rounded-[1.5rem] border border-white/10 opacity-30 lg:block">
            <MemberPortrait
              member={nextMember}
              className="h-full w-full object-cover grayscale"
            />
          </div>

          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.article
              key={activeMember.id}
              custom={direction}
              className="absolute inset-0 overflow-hidden rounded-[1.6rem] bg-[#0a2527] will-change-transform lg:right-[14%]"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * 72, scale: 0.975 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -52, scale: 0.98 }
              }
              transition={{
                duration: reduceMotion ? 0.12 : 0.46,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <MemberPortrait
                member={activeMember}
                eager
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#041415]/90 via-transparent to-black/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-white sm:p-9">
                <div>
                  <p className="text-[9px] font-black tracking-[.2em] text-main uppercase">
                    {activeMember.jobTitle?.title ?? (
                      content?.memberLabel
                    )}
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-.04em] sm:text-4xl">
                    {activeMember.fullName}
                  </h3>
                </div>
                <span className="hidden rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[9px] font-bold tracking-[.15em] text-white/65 uppercase backdrop-blur-md sm:block">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(members.length).padStart(2, "0")}
                </span>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="absolute inset-y-0 right-3 z-20 flex items-center sm:right-5">
            <div className="flex flex-col overflow-hidden rounded-full border border-white/15 bg-[#061718]/78 p-1.5 shadow-2xl backdrop-blur-xl">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label={content?.previousMemberLabel}
                className="grid size-11 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-main focus-visible:outline-2 focus-visible:outline-main"
              >
                <ArrowLeft className="size-4 rtl:rotate-180" />
              </button>
              <span className="mx-auto h-px w-6 bg-white/10" />
              <button
                type="button"
                onClick={() => move(1)}
                aria-label={content?.nextMemberLabel}
                className="grid size-11 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-main focus-visible:outline-2 focus-visible:outline-main"
              >
                <ArrowRight className="size-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {members.map((member, index) => {
            const active = index === activeIndex
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => select(index)}
                aria-pressed={active}
                className={cn(
                  "group flex min-w-fit items-center gap-3 rounded-full border py-2 ps-2 pe-4 text-start transition-all duration-300 focus-visible:outline-2 focus-visible:outline-main",
                  active
                    ? "border-main/35 bg-main/12 text-white"
                    : "border-white/[.08] bg-white/[.025] text-white/45 hover:border-white/15 hover:text-white/75"
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full text-[9px] font-black transition-colors",
                    active
                      ? "bg-main text-[#061718]"
                      : "bg-white/[.06] text-white/55 group-hover:bg-white/10"
                  )}
                >
                  {initials(member.fullName)}
                </span>
                <span className="max-w-36 truncate text-xs font-bold">
                  {member.fullName}
                </span>
              </button>
            )
          })}
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
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,4rem)] leading-[.95] font-black tracking-[-.06em] text-alt dark:text-foreground">
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
