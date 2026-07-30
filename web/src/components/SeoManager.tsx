import { myAxios } from "@/api/myAxios"
import { lang } from "@/context/global"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { mediaUrl } from "@/lib/media"
import { useBlog } from "@/pages/blog/useBlogs"
import { useProject } from "@/hooks/usePublicContent"
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
  const segments = pathname.split("/").filter(Boolean)
  const projectSlug = segments[0] === "work" ? segments[1] : undefined
  const blogSlug = segments[0] === "blog" ? segments[1] : undefined
  const project = useProject(projectSlug).data
  const blog = useBlog(blogSlug).data
  const page = useCustomQuery<Collection>({
    queryKey: ["page-meta", slug, lang.value],
    isErrLog: false,
    staleTime: 15 * 60 * 1000,
    queryFn: async () => (await myAxios.get<Envelope<Collection>>("/pages", { params: { search: slug, limit: 1 } })).data.materials,
  }).data?.data[0]

  useEffect(() => {
    const defaultDescription = "RightCode designs secure custom software, business platforms, mobile apps, integrations, dashboards, and infrastructure."
    const title = project
      ? project.metaTitle || project.title || project.name
      : blog?.title || page?.metaTitle || page?.title || "Right Code"
    const description = project
      ? project.metaDescription || project.summary || project.solution || defaultDescription
      : blog?.excerpt || page?.metaDescription || defaultDescription
    const pageUrl = `${window.location.origin}${pathname}`
    const imageUrl = mediaUrl(project?.coverImageUrl || blog?.coverImageUrl || "/assets/home/logo.png")
    const documentTitle = title === "Right Code" || title.endsWith("| Right Code") ? title : `${title} | Right Code`
    const contentType = blog ? "article" : "website"
    document.title = documentTitle
    setMeta("description", description)
    setMeta("robots", "index, follow, max-image-preview:large")
    setMeta("og:title", documentTitle, true); setMeta("og:description", description, true); setMeta("og:type", contentType, true); setMeta("og:site_name", "Right Code", true); setMeta("og:url", pageUrl, true); setMeta("og:image", imageUrl, true); setMeta("og:image:alt", title, true); setMeta("og:locale", lang.value === "ar" ? "ar_SY" : lang.value === "tr" ? "tr_TR" : "en_US", true)
    setMeta("twitter:card", "summary_large_image"); setMeta("twitter:title", document.title); setMeta("twitter:description", description); setMeta("twitter:image", imageUrl)
    setLink("canonical", pageUrl)
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove())
    setJsonLd(blog ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blog.title,
      description,
      image: imageUrl,
      datePublished: blog.publishedAt,
      author: { "@type": "Person", name: blog.authorName },
      mainEntityOfPage: pageUrl,
      inLanguage: lang.value,
    } : project ? {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: title,
      description,
      image: imageUrl,
      url: pageUrl,
      inLanguage: lang.value,
      creator: { "@type": "Organization", name: "Right Code", url: window.location.origin },
    } : {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: documentTitle,
      description,
      url: pageUrl,
      inLanguage: lang.value,
      isPartOf: { "@type": "WebSite", name: "Right Code", url: window.location.origin },
    })
  }, [blog, page, pathname, project])
  return null
}
