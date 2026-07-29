import LangHandler from "@/components/LangHandler"
import { motion } from "framer-motion"
import { ArrowUpRight, Braces } from "lucide-react"
import { Link } from "react-router-dom"
import { mediaUrl } from "@/lib/media"
import type { BlogPost } from "../useBlogs"

export function BlogVisual({ post }: { post: BlogPost }) {
  return (
    <div className="relative h-full min-h-64 overflow-hidden bg-[radial-gradient(circle_at_72%_24%,rgba(66,209,213,.25),transparent_28%),linear-gradient(145deg,#092728,#061819)]">
      {post.coverImageUrl ? (
        <img
          src={mediaUrl(post.coverImageUrl)}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-[14%] [transform:rotateX(68deg)] rounded-full border border-main/20" />
          <div className="absolute inset-[24%] rotate-45 rounded-[24%] border border-[#ffb84d]/20" />
          <Braces className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-main/65" />
          <div className="absolute inset-x-8 bottom-8 flex gap-2">
            {(post.tags ?? []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[8px] font-bold tracking-[0.12em] text-white/55 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.58, delay: Math.min(index * 0.06, 0.24) }}
      className="group overflow-hidden rounded-[1.75rem] border border-alt/10 bg-card/62 shadow-[0_20px_65px_rgba(18,36,35,.08)] backdrop-blur-md dark:border-foreground/10"
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <motion.div
            className="h-full"
            whileHover={{ scale: 1.035 }}
            transition={{ duration: 0.45 }}
          >
            <BlogVisual post={post} />
          </motion.div>
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4 text-[9px] font-black tracking-[0.16em] uppercase">
            <span className="text-main">{post.category ?? <LangHandler content="blogDefaultCategory" />}</span>
            <span className="text-alt/35 dark:text-foreground/35">
              {post.readMinutes} <LangHandler content="blogReadTime" />
            </span>
          </div>
          <h2 className="mt-4 text-xl leading-tight font-black tracking-[-0.035em] text-alt transition-colors group-hover:text-main sm:text-2xl dark:text-foreground">
            {post.title}
          </h2>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-alt/55 dark:text-foreground/55">
            {post.excerpt}
          </p>
          <div className="mt-6 flex items-center justify-between border-t border-alt/10 pt-5 text-[10px] font-black tracking-[0.13em] text-alt/45 uppercase dark:border-foreground/10 dark:text-foreground/45">
            <LangHandler content="blogReadMore" />
            <ArrowUpRight className="size-4 text-main transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
