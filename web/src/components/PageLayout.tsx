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
  badgeText,
  titleText,
  subtitleText,
  cmsOnly,
}: {
  badge?: keyof typeof translator.en
  title?: keyof typeof translator.en
  subtitle?: keyof typeof translator.en
  children: React.ReactNode
  className?: string
  badgeText?: string
  titleText?: string
  subtitleText?: string
  cmsOnly?: boolean
}) {
  return (
    <Container className={cn("app-section py-20", className)}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionTitle badge={badge} title={title} subtitle={subtitle} badgeText={badgeText} titleText={titleText} subtitleText={subtitleText} cmsOnly={cmsOnly} />
      </motion.div>
      <ScrollReveal delay={0.2}>{children}</ScrollReveal>
    </Container>
  )
}

export default PageLayout
