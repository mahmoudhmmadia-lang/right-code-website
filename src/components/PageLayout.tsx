import { cn } from "@/lib/utils"
import type { translator } from "@/translator"
import { motion } from "framer-motion"
import React from "react"
import Container from "./Container"
import { ScrollReveal } from "./ScrollReveal"
import SectionTitle from "./SectionTitle"

function PageLayout({
  badge,
  title,
  subtitle,
  children,
  className,
}: {
  badge: keyof typeof translator.en
  title: keyof typeof translator.en
  subtitle: keyof typeof translator.en
  children: React.ReactNode
  className?: string
}) {
  return (
    <Container className={cn("py-20", className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <SectionTitle badge={badge} title={title} subtitle={subtitle} />
      </motion.div>
      <ScrollReveal delay={0.2}>{children}</ScrollReveal>
    </Container>
  )
}

export default PageLayout
