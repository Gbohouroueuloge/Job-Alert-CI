import { useEffect } from "react"
import { SITE_NAME, absoluteUrl } from "@/lib/seo"

const managedAttribute = "data-seo-managed"

const setMeta = (attribute, value, content) => {
  if (!content) return

  let element = document.head.querySelector(`meta[${attribute}="${value}"]`)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attribute, value)
    element.setAttribute(managedAttribute, "true")
    document.head.appendChild(element)
  }
  element.setAttribute("content", content)
}

const setLink = (rel, href) => {
  if (!href) return

  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement("link")
    element.setAttribute("rel", rel)
    element.setAttribute(managedAttribute, "true")
    document.head.appendChild(element)
  }
  element.setAttribute("href", href)
}

const setStructuredData = (data) => {
  if (!data) return

  let element = document.getElementById("structured-data")
  if (!element) {
    element = document.createElement("script")
    element.id = "structured-data"
    element.type = "application/ld+json"
    element.setAttribute(managedAttribute, "true")
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

export default function Seo({
  title,
  description,
  path = "/",
  image = "/screen.png",
  imageAlt,
  keywords,
  type = "website",
  locale = "fr_CI",
  structuredData,
  noindex = false,
}) {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(path)
    const imageUrl = absoluteUrl(image)
    const robots = noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"

    document.documentElement.lang = "fr"
    document.title = title

    setMeta("name", "description", description)
    setMeta("name", "keywords", keywords)
    setMeta("name", "robots", robots)
    setMeta("name", "googlebot", robots)
    setMeta("name", "application-name", SITE_NAME)
    setMeta("name", "apple-mobile-web-app-title", SITE_NAME)

    setMeta("property", "og:site_name", SITE_NAME)
    setMeta("property", "og:type", type)
    setMeta("property", "og:locale", locale)
    setMeta("property", "og:url", canonicalUrl)
    setMeta("property", "og:title", title)
    setMeta("property", "og:description", description)
    setMeta("property", "og:image", imageUrl)
    setMeta("property", "og:image:secure_url", imageUrl)
    setMeta("property", "og:image:alt", imageAlt)

    setMeta("name", "twitter:card", "summary_large_image")
    setMeta("name", "twitter:title", title)
    setMeta("name", "twitter:description", description)
    setMeta("name", "twitter:image", imageUrl)
    setMeta("name", "twitter:image:alt", imageAlt)

    setLink("canonical", canonicalUrl)
    setStructuredData(structuredData)
  }, [description, image, imageAlt, keywords, locale, noindex, path, structuredData, title, type])

  return null
}
