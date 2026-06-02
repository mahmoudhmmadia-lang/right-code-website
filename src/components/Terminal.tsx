import Container from "./Container"
import { AnimatedSpan, Terminal, TypingAnimation } from "./ui/terminal"

export function TerminalAbout() {
  return (
    <Container className="py-20">
      <Terminal
        loop
        loopDelay={4000}
        className="min-h-[300px] w-full max-w-full"
        startOnView
      >
        <TypingAnimation delay={0}>$ whoami</TypingAnimation>
        <AnimatedSpan delay={600} className="text-green-400">
          rightcode — custom software for serious organizations
        </AnimatedSpan>

        <TypingAnimation delay={1400}>$ cat mission.txt</TypingAnimation>
        <AnimatedSpan delay={2200} className="text-blue-400">
          We design and build secure, tailor-made digital systems so your
          operations run smoother, faster, and with real-time visibility.
        </AnimatedSpan>

        <TypingAnimation delay={3800}>$ ls services/</TypingAnimation>
        <AnimatedSpan delay={4600} className="text-yellow-400">
          custom-platforms/ dashboards/ integrations/ secure-hosting/
          workflow-automation/
        </AnimatedSpan>

        <TypingAnimation delay={6200}>$ contact --book-call</TypingAnimation>
        <AnimatedSpan delay={7000} className="text-blue-400">
          30-minute call. no sales pressure. → hello@rightcode.io
        </AnimatedSpan>
      </Terminal>
    </Container>
  )
}
