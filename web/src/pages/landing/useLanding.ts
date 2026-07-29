import { useInView } from "@/hooks/useInView"

export function useLanding() {
  const { ref, hasEnteredView } = useInView<HTMLDivElement>()
  return { sectionRef: ref, hasEnteredView }
}
