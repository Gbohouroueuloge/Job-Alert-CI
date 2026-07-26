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

export const howItWorksSeo = {
  title: "Comment ca marche | JobAlert CI",
  description:
    "Decouvrez comment JobAlert CI collecte, dedoublonne et filtre les offres d'emploi en Cote d'Ivoire avant de vous envoyer un recapitulatif gratuit a 8h00.",
  path: "/comment-ca-marche",
  image: "/screen.png",
  imageAlt: "Apercu de la page Comment ca marche de JobAlert CI",
  keywords:
    "comment ca marche JobAlert CI, fonctionnement alerte emploi, offres d'emploi Cote d'Ivoire, email emploi quotidien, dedoublonnage offres emploi",
  type: "article",
  locale: "fr_CI",
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/comment-ca-marche#webpage`,
        url: `${siteUrl}/comment-ca-marche`,
        name: "Comment ca marche | JobAlert CI",
        description:
          "Decouvrez comment JobAlert CI collecte, dedoublonne et filtre les offres d'emploi en Cote d'Ivoire avant de vous envoyer un recapitulatif gratuit a 8h00.",
        inLanguage: "fr-CI",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#service`,
        },
        primaryImageOfPage: absoluteUrl("/screen.png"),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/comment-ca-marche#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Comment ca marche",
            item: `${siteUrl}/comment-ca-marche`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/comment-ca-marche#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Pourquoi un email plutot qu'un tableau de bord ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Parce que le mode email pousse l'information vers vous chaque matin au lieu de vous demander de revenir consulter un site.",
            },
          },
          {
            "@type": "Question",
            name: "Comment une offre est-elle rattachee a une filiere ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Par analyse de mots-cles dans l'intitule du poste, puis validation dans la chaine de filtrage avant l'envoi du recapitulatif.",
            },
          },
          {
            "@type": "Question",
            name: "Que se passe-t-il si une source est en panne ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Les autres sources continuent de fonctionner et les erreurs sont journalisees sans interrompre le recapitulatif quotidien.",
            },
          },
        ],
      },
    ],
  },
}
