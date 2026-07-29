/* eslint-disable react-refresh/only-export-components */
import { myAxios } from "@/api/myAxios"
import { lang } from "@/context/global"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { useSignals } from "@preact/signals-react/runtime"
import { createContext, useContext, useMemo, type ReactNode } from "react"

type SiteCopy = Record<string, string>
type CopySection = { content?: SiteCopy }
type Collection = { data: CopySection[] }
type Envelope<T> = { materials: T; message: string }

const SiteContentContext = createContext<SiteCopy>({})

export function SiteContentProvider({ children }: { children: ReactNode }) {
  useSignals()
  const locale = lang.value
  const query = useCustomQuery<Collection>({
    queryKey: ["site-copy", locale],
    isErrLog: false,
    staleTime: 15 * 60 * 1000,
    queryFn: async () =>
      (
        await myAxios.get<Envelope<Collection>>("/sections", {
          params: { search: "site-copy", limit: 1 },
        })
      ).data.materials,
  })
  const copy = useMemo(() => query.data?.data[0]?.content ?? {}, [query.data])

  return (
    <SiteContentContext.Provider value={copy}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
