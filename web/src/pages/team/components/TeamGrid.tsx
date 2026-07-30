import LangHandler from "@/components/LangHandler"
import LazyImage from "@/components/LazyImage"
import { Link as LinkIcon } from "lucide-react"
import { mediaUrl } from "@/lib/media"
import type { TeamMember } from "../useTeam"

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {members.map((member) => (
        <article
          key={member.id}
          className="app-card app-lift-card group overflow-hidden rounded-3xl p-3"
        >
          <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(145deg,rgba(0,107,112,.18),rgba(255,184,77,.12))]">
            {member.imageUrl ? (
              <LazyImage
                src={mediaUrl(member.imageUrl)}
                alt={member.fullName}
                width={640}
                height={720}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="grid h-full place-items-center text-6xl font-black tracking-[-0.08em] text-main/55">
                {initials(member.fullName)}
              </div>
            )}
            <span className="absolute start-4 top-4 rounded-full border border-white/30 bg-white/75 px-3 py-1 text-[10px] font-bold tracking-widest text-alt uppercase backdrop-blur-md">
              <LangHandler content="teamMemberLabel" />
            </span>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-alt dark:text-foreground">
                  {member.fullName}
                </h2>
                <p className="mt-1 text-sm font-semibold text-main">
                  {member.jobTitle?.title}
                </p>
              </div>
              {member.linkedInUrl ? (
                <a
                  href={member.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.fullName} LinkedIn`}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-main/15 text-main transition hover:bg-main hover:text-white"
                >
                  <LinkIcon className="size-4" />
                </a>
              ) : null}
            </div>
            {member.bio ? (
              <p className="mt-3 text-sm leading-6 text-alt/60 dark:text-foreground/60">
                {member.bio}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
