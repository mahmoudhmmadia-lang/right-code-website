import { myAxios } from "@/api/myAxios"
import { lang } from "@/context/global"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { useMemo } from "react"
import type { ApiCollection, ApiEnvelope, RoutePageContent, RouteSection } from "./types"

export function useRoutePage(pageId: string) {
  const locale = lang.value
  const query = useCustomQuery<ApiCollection<RouteSection>>({
    queryKey: ["route-sections", pageId, locale],
    staleTime: 5 * 60 * 1000,
    isErrLog: false,
    queryFn: async () =>
      (
        await myAxios.get<ApiEnvelope<ApiCollection<RouteSection>>>("/sections", {
          params: { pageId, limit: 50 },
        })
      ).data.materials,
  })

  const content = useMemo<RoutePageContent>(() => {
    const sections = (query.data?.data ?? []).filter((section) => section.content?.visible !== false)
    return {
      sections,
      chapters: sections.map((section) => ({
        id: section.anchor ?? section.key,
        labelText: section.body?.chapterLabel ?? section.body?.badge ?? section.body?.heading ?? section.key,
      })),
    }
  }, [query.data])

  return { ...content, query }
}
