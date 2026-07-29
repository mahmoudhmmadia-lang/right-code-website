import Container from "@/components/Container"
import LangHandler from "@/components/LangHandler"
import Loader from "@/components/Loader"
import {
  AnimatedRoutePage,
  RouteChapter,
  type RouteChapterConfig,
} from "@/components/RouteScrollExperience"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { BlogVisual } from "./components/BlogCard"
import { useBlog } from "./useBlogs"
import { useRoutePage } from "@/pages/site/useRoutePage"
import { RouteCopyProvider } from "@/context/route-copy"

const chapters = [
  { id: "blog-article", label: "blogBadge" },
] as const satisfies RouteChapterConfig[]

export default function BlogDetailPage() {
  const { slug } = useParams()
  const query = useBlog(slug)
  const post = query.data
  const route = useRoutePage("blog")
  const section = route.sections[0]

  return (
    <RouteCopyProvider copy={section?.body?.copy}>
    <AnimatedRoutePage className="pt-16" chapters={chapters} variant="blog">
      <RouteChapter id={chapters[0].id} index={0}>
        <Container className="app-section py-16 sm:py-24">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.16em] text-alt/45 uppercase transition hover:text-main dark:text-foreground/45"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            <LangHandler content="blogBack" />
          </Link>

          {query.isLoading ? <Loader fullScreen={false} /> : null}
          {query.isError ? (
            <div className="mt-14 rounded-3xl border border-main/15 bg-card/60 p-10 text-center text-alt/55 dark:text-foreground/55">
              <LangHandler content="blogEmpty" />
            </div>
          ) : null}

          {post ? (
            <article className="mx-auto mt-12 max-w-6xl">
              <header className="mx-auto max-w-4xl text-center">
                <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-black tracking-[0.16em] uppercase">
                  <span className="text-main">
                    {post.category ?? <LangHandler content="blogDefaultCategory" />}
                  </span>
                  <span className="text-alt/25 dark:text-foreground/25">/</span>
                  <span className="text-alt/40 dark:text-foreground/40">
                    {post.readMinutes} <LangHandler content="blogReadTime" />
                  </span>
                </div>
                <h1 className="mt-7 text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.92] font-black tracking-[-0.075em] text-alt dark:text-foreground">
                  {post.title}
                </h1>
                <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-alt/58 dark:text-foreground/58">
                  {post.excerpt}
                </p>
                <p className="mt-5 text-[10px] font-bold tracking-[0.14em] text-alt/35 uppercase dark:text-foreground/35">
                  {post.authorName}
                </p>
              </header>

              <div className="mt-12 aspect-[16/8] overflow-hidden rounded-[2rem] border border-main/15">
                <BlogVisual post={post} />
              </div>

              <div className="mx-auto mt-14 max-w-3xl">
                {(post.content ?? "").split(/\n\s*\n/).map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mb-7 text-base leading-8 text-alt/72 sm:text-lg sm:leading-9 dark:text-foreground/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ) : null}
        </Container>
      </RouteChapter>
    </AnimatedRoutePage>
    </RouteCopyProvider>
  )
}
