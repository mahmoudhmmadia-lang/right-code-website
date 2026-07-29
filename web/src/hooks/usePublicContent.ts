import { myAxios } from "@/api/myAxios"
import { lang } from "@/context/global"
import { useCustomQuery } from "./useCustomQuery"

type Collection<T> = { data: T[]; pagesNumber: number; totalCount: number }
type Envelope<T> = { materials: T; message: string }

export type PublicService = {
  id: string
  slug: string
  icon?: string
  title?: string
  subtitle?: string
  description?: string
  audience?: string
  approach?: string
  outcome?: string
  isFeatured: boolean
}

export type PublicProject = {
  id: string
  projectNumber: string
  name: string
  slug?: string
  type: string
  status: string
  progressPercent: number
  technologies?: string[]
  title?: string
  subtitle?: string
  summary?: string
  context?: string
  challenges?: string
  solution?: string
  keyElements?: string[]
  results?: string[]
  isFeatured: boolean
}

function useCollection<T>(endpoint: string, key: string) {
  const locale = lang.value
  return useCustomQuery<Collection<T>>({
    queryKey: [key, locale],
    staleTime: 5 * 60 * 1000,
    queryFn: async () =>
      (
        await myAxios.get<Envelope<Collection<T>>>(endpoint, {
          params: { limit: 100 },
        })
      ).data.materials,
  })
}

export function useServices() {
  return useCollection<PublicService>("/services", "public-services")
}

export function useProjects() {
  return useCollection<PublicProject>("/projects", "public-projects")
}
