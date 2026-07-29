import { myAxios } from "@/api/myAxios"
import { lang } from "@/context/global"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { mediaUrl } from "@/lib/media"
import { useSignals } from "@preact/signals-react/runtime"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

type PageMeta = { slug: string; metaTitle?: string; metaDescription?: string; title?: string }
type Collection = { data: PageMeta[] }
type Envelope<T> = { materials: T }

const routeSlug = (pathname: string) => pathname === "/" ? "home" : pathname.startsWith("/create-project") ? "create-project" : pathname.split("/").filter(Boolean)[0] ?? "home"

function setMeta(name: string, content: string, property = false) {
  const attribute = property ? "property" : "name"
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
  if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, name); document.head.appendChild(element) }
  element.content = content
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`
  let element = document.head.querySelector<HTMLLinkElement>(selector)
  if (!element) { element = document.createElement("link"); element.rel = rel; if (hreflang) element.hreflang = hreflang; document.head.appendChild(element) }
  element.href = href
}

function setJsonLd(value: unknown) {
  let element = document.head.querySelector<HTMLScriptElement>("#rightcode-route-jsonld")
  if (!element) { element = document.createElement("script"); element.id = "rightcode-route-jsonld"; element.type = "application/ld+json"; document.head.appendChild(element) }
  element.textContent = JSON.stringify(value)
}

export default function SeoManager() {
  useSignals()
  const { pathname } = useLocation()
  const slug = routeSlug(pathname)
  const page = useCustomQuery<Collection>({
    queryKey: ["page-meta", slug, lang.value],
    isErrLog: false,
    staleTime: 15 * 60 * 1000,
    queryFn: async () => (await myAxios.get<Envelope<Collection>>("/pages", { params: { search: slug, limit: 1 } })).data.materials,
  }).data?.data[0]

  useEffect(() => {
    if (!page) return
    const title = page.metaTitle || page.title || "Right Code"
    const description = page.metaDescription || ""
    const pageUrl = `${window.location.origin}${pathname}`
    const imageUrl = mediaUrl("/assets/home/logo.png")
    document.title = `${title} | Right Code`
    setMeta("description", description)
    setMeta("robots", "index, follow, max-image-preview:large")
    setMeta("og:title", document.title, true); setMeta("og:description", description, true); setMeta("og:type", "website", true); setMeta("og:site_name", "Right Code", true); setMeta("og:url", pageUrl, true); setMeta("og:image", imageUrl, true)
    setMeta("twitter:card", "summary_large_image"); setMeta("twitter:title", document.title); setMeta("twitter:description", description); setMeta("twitter:image", imageUrl)
    setLink("canonical", pageUrl)
    ;(["en", "ar", "tr"] as const).forEach((language) => setLink("alternate", pageUrl, language)); setLink("alternate", pageUrl, "x-default")
    setJsonLd({ "@context": "https://schema.org", "@type": "WebPage", name: document.title, description, url: pageUrl, inLanguage: lang.value, isPartOf: { "@type": "WebSite", name: "Right Code", url: window.location.origin } })
  }, [page, pathname])
  return null
}
