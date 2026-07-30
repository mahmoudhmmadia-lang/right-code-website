import Container from "@/components/Container"
import LangHandler from "@/components/LangHandler"
import Loader from "@/components/Loader"
import SectionTitle from "@/components/SectionTitle"
import {
  AnimatedRoutePage,
  RouteChapter,
} from "@/components/RouteScrollExperience"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { BlogCard, BlogVisual } from "./components/BlogCard"
import { useBlogs } from "./useBlogs"
import { useRoutePage } from "@/pages/site/useRoutePage"

export default function BlogPage() {
  const query = useBlogs()
  const route = useRoutePage("blog")
  const section = route.sections[0]
  const posts = query.data?.data ?? []
  const featured = posts.find((post) => post.isFeatured) ?? posts[0]
  const remaining = featured
    ? posts.filter((post) => post.id !== featured.id)
    : posts

  return (
    <AnimatedRoutePage className="pt-16" chapters={route.chapters} variant="blog">
      <RouteChapter id={section?.anchor ?? section?.key ?? "blog-index"} index={0}>
        <Container className="app-section py-20 sm:py-24">
          <SectionTitle
            badge="blogBadge"
            title="blogTitle"
            subtitle="blogSubtitle"
            badgeText={section?.body?.badge}
            titleText={section?.body?.heading}
            subtitleText={section?.body?.subheading}
          />

          {query.isLoading ? <Loader fullScreen={false} /> : null}
          {!query.isLoading && !posts.length ? (
            <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-main/15 bg-card/60 p-10 text-center text-alt/55 backdrop-blur-md dark:text-foreground/55">
              <LangHandler content="blogEmpty" />
            </div>
          ) : null}

          {featured ? (
            <motion.article
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="group mt-16 overflow-hidden rounded-[2rem] border border-main/15 bg-card/65 shadow-[0_28px_90px_rgba(0,107,112,.1)] backdrop-blur-md lg:grid lg:grid-cols-[1.12fr_.88fr]"
            >
              <div className="min-h-80 overflow-hidden lg:min-h-[470px]">
                <BlogVisual post={featured} />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <p className="text-[10px] font-black tracking-[0.2em] text-main uppercase">
                  <LangHandler content="blogFeatured" />
                </p>
                <h2 className="mt-5 text-[clamp(2rem,4vw,3.8rem)] leading-[0.98] font-black tracking-[-0.06em] text-alt dark:text-foreground">
                  {featured.title}
                </h2>
                <p className="mt-6 text-sm leading-7 text-alt/58 dark:text-foreground/58">
                  {featured.excerpt}
                </p>
                <Link
                  to={`/blog/${featured.slug}`}
                  className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-alt px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-main dark:bg-foreground dark:text-[#071112] dark:hover:bg-main dark:hover:text-white"
                >
                  <LangHandler content="blogReadMore" />
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </div>
            </motion.article>
          ) : null}

          {remaining.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : null}
        </Container>
      </RouteChapter>
    </AnimatedRoutePage>
  )
}
