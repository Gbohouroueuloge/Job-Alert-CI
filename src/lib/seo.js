export const SITE_NAME = "JobAlert CI"
export const DEFAULT_SITE_URL = "https://job-alert-ci.vercel.app/"

export const siteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "")

export const absoluteUrl = (path = "/") => {
  if (/^https?:\/\//i.test(path)) return path
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

const description =
  "JobAlert CI collecte les offres d'emploi en Cote d'Ivoire chaque matin et vous envoie a 8h00 un recapitulatif gratuit, filtre par metier, sans doublons."

export const homeSeo = {
  title: "JobAlert CI | Offres d'emploi en Cote d'Ivoire chaque matin",
  description,
  path: "/",
  image: "/screen.png",
  imageAlt: "Apercu de JobAlert CI et de son recapitulatif d'offres d'emploi",
  keywords:
    "emploi Cote d'Ivoire, offres d'emploi Abidjan, alerte emploi CI, recrutement Cote d'Ivoire, jobs Abidjan, JobAlert CI",
  type: "website",
  locale: "fr_CI",
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: `${siteUrl}/`,
        logo: absoluteUrl("/logo2.svg"),
        email: "bonjour@jobalert.ci",
        areaServed: {
          "@type": "Country",
          name: "Cote d'Ivoire",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: SITE_NAME,
        url: `${siteUrl}/`,
        inLanguage: "fr-CI",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/#service`,
        name: "Alertes emploi quotidiennes en Cote d'Ivoire",
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
        serviceType: "Alerte emploi par email",
        areaServed: {
          "@type": "Country",
          name: "Cote d'Ivoire",
        },
        audience: {
          "@type": "Audience",
          audienceType: "Candidats et chercheurs d'emploi",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "XOF",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Est-ce vraiment gratuit ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, JobAlert CI est gratuit. Aucune carte bancaire n'est demandee pour recevoir les alertes emploi.",
            },
          },
          {
            "@type": "Question",
            name: "A quelle heure arrive le recapitulatif ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Le recapitulatif arrive chaque jour a 8h00 par email, apres la collecte et le filtrage des offres.",
            },
          },
          {
            "@type": "Question",
            name: "D'ou viennent les offres ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Les offres sont collectees depuis plusieurs sources emploi, notamment EmploiDakar CI, GoAfrica, Novojob et LinkedIn.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: `${siteUrl}/`,
          },
        ],
      },
    ],
  },
}
