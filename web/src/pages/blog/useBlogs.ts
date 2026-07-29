import { myAxios } from "@/api/myAxios"
import { lang } from "@/context/global"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { useSignals } from "@preact/signals-react/runtime"

type Envelope<T> = { materials: T; message: string }
type Collection<T> = { data: T[]; pagesNumber: number; totalCount: number }

export type BlogPost = {
  id: string
  slug: string
  publishedAt: string
  coverImageUrl?: string | null
  authorName: string
  readMinutes: number
  tags?: string[]
  isFeatured: boolean
  title: string
  excerpt: string
  category?: string
  content?: string
}

export function useBlogs() {
  useSignals()
  const locale = lang.value

  return useCustomQuery<Collection<BlogPost>>({
    queryKey: ["blogs", locale],
    staleTime: 10 * 60 * 1000,
    queryFn: async () =>
      (
        await myAxios.get<Envelope<Collection<BlogPost>>>("/blogs", {
          params: { limit: 50 },
        })
      ).data.materials,
  })
}

export function useBlog(slug?: string) {
  useSignals()
  const locale = lang.value

  return useCustomQuery<BlogPost>({
    queryKey: ["blog", slug, locale],
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
    queryFn: async () =>
      (await myAxios.get<Envelope<BlogPost>>(`/blogs/${slug}`)).data.materials,
  })
}
