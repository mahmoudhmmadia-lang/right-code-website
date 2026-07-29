import type { RouteSectionBody } from "@/pages/site/types"
import { Fragment } from "react"
import Container from "./Container"
import { AnimatedSpan, Terminal, TypingAnimation } from "./ui/terminal"

const tones: Record<string, string> = { green: "text-green-400", blue: "text-blue-400", yellow: "text-yellow-400", white: "text-white" }

export function TerminalAbout({ content }: { content?: RouteSectionBody }) {
  const lines = content?.aboutTerminal?.lines ?? []
  return <Container className="py-20"><Terminal loop loopDelay={4000} className="min-h-[300px] w-full max-w-full" startOnView>{lines.map((line, index) => <Fragment key={`${line.command}-${index}`}><TypingAnimation delay={index * 2000}>{line.command}</TypingAnimation><AnimatedSpan delay={index * 2000 + 700} className={tones[line.tone] ?? tones.white}>{line.response}</AnimatedSpan></Fragment>)}</Terminal></Container>
}
