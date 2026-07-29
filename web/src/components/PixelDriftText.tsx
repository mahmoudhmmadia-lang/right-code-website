import type { ElementType, ReactNode } from "react"

export function PixelDriftText({ as: Tag = "span", className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return <Tag className={`whitespace-pre-line ${className ?? ""}`}>{children}</Tag>
}
