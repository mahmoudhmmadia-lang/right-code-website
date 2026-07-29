import { useEffect, useRef, useState } from "react"

type UseInViewOptions = {
  rootMargin?: string
  threshold?: number
}

/**
 * Becomes true once the element is close to the viewport and stays true.
 * Keeping it true avoids disabling an already-started query when the user
 * scrolls past the section.
 */
export function useInView<TElement extends HTMLElement>({
  rootMargin = "300px 0px",
  threshold = 0,
}: UseInViewOptions = {}) {
  const ref = useRef<TElement>(null)
  const [hasEnteredView, setHasEnteredView] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window)
  )

  useEffect(() => {
    const element = ref.current
    if (!element || hasEnteredView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setHasEnteredView(true)
        observer.disconnect()
      },
      { rootMargin, threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasEnteredView, rootMargin, threshold])

  return { ref, hasEnteredView }
}
