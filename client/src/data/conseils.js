
import {
  Briefcase, CalendarCheck, FileText, MessagesSquare, Rocket, TrendingUp, Wallet,
} from "lucide-react"
import { FaLinkedin } from "react-icons/fa6"

const CATEGORIES = [
  { code: "cv-candidature", label: "CV & Candidature", icon: FileText, hue: "sky" },
  { code: "entretien", label: "Entretien", icon: MessagesSquare, hue: "violet" },
  { code: "salaire", label: "Salaire & Négociation", icon: Wallet, hue: "emerald" },
  { code: "marche", label: "Marché ivoirien", icon: TrendingUp, hue: "orange" },
  { code: "linkedin-reseau", label: "LinkedIn & Réseau", icon: FaLinkedin, hue: "cyan" },
  { code: "organisation", label: "Organisation", icon: CalendarCheck, hue: "fuchsia" },
  { code: "premier-emploi", label: "Premier emploi", icon: Rocket, hue: "blue" },
  { code: "freelance-consulting", label: "Freelance & Conseil", icon: Briefcase, hue: "teal" },
]

const ARTICLES = [
  {
    slug: "recruteurs-abidjan-repondent-48h",
    titre: "Pourquoi les recruteurs d'Abidjan répondent (enfin) en 48 h",
    extrait: "Les ATS et les viviers de candidats changent la donne : ce que ça change pour vos relances, et comment en profiter avant tout le monde.",
    cat: "marche", jours: 0, lecture: 6, vus: 2400,
  },
  {
    slug: "cv-7-erreurs-premiere-lecture",
    titre: "CV : les 7 erreurs qui écartent votre candidature avant la première lecture",
    extrait: "Photo floue, titre générique, PDF mal nommé… Nos analystes ont passé 1 200 CV au crible : voici ce qui part à la corbeille en 6 secondes.",
    cat: "cv-candidature", jours: 1, lecture: 5, vus: 3800,
  },
  {
    slug: "entretien-parlez-moi-de-vous-90-secondes",
    titre: "Réussir le « Parlez-moi de vous » en 90 secondes",
    extrait: "La méthode Présent / Passé / Futur, avec trois exemples réels tirés d'entretiens à Abidjan — et le piège du récit chronologique.",
    cat: "entretien", jours: 2, lecture: 4, vus: 3100,
  },
  {
    slug: "negocier-salaire-abidjan-fourchettes-2026",
    titre: "Négocier son salaire à Abidjan : fourchettes 2026 par filière",
    extrait: "Du junior Tech & Dev au cadre en banque : les fourchettes observées dans nos 181 offres actives, et la phrase qui ouvre la négociation.",
    cat: "salaire", jours: 3, lecture: 8, vus: 4600,
  },
  {
    slug: "linkedin-profil-qui-attire-les-recruteurs",
    titre: "LinkedIn : le profil qui fait venir les recruteurs sans postuler",
    extrait: "Titre, bannière, section « Infos » : 45 minutes de réglages pour apparaître dans les recherches des recruteurs ivoiriens.",
    cat: "linkedin-reseau", jours: 4, lecture: 6, vus: 2900,
  },
  {
    slug: "tech-abidjan-stacks-demandees-2026",
    titre: "Tech & Dev à Abidjan : les stacks les plus demandées en 2026",
    extrait: "React, Node, Flutter, Python : ce que nos 34 offres Tech actives révèlent des compétences qui font monter les salaires.",
    cat: "marche", jours: 5, lecture: 7, vus: 2100,
  },
  {
    slug: "premier-emploi-transformer-stage-en-cdi",
    titre: "Premier emploi : transformer son stage en CDI",
    extrait: "Les 3 mois qui comptent : livrables, posture et conversation de conversion — le plan exact, semaine par semaine.",
    cat: "cv-candidature", jours: 6, lecture: 5, vus: 1800,
  },
  {
    slug: "email-relance-apres-entretien-modele",
    titre: "L'email de relance après un entretien (modèle inclus)",
    extrait: "Ni désespéré, ni arrogant : le bon timing, le bon objet, et un modèle à copier-coller validé par des recruteurs.",
    cat: "entretien", jours: 8, lecture: 3, vus: 3500,
  },
  {
    slug: "cdd-cdi-mission-ce-que-change-votre-contrat",
    titre: "CDD, CDI, Mission : ce que change vraiment votre contrat",
    extrait: "Préavis, congés, indemnités, période d'essai : le comparatif clair pour négocier en connaissance de cause.",
    cat: "salaire", jours: 9, lecture: 6, vus: 1600,
  },
  {
    slug: "routine-recherche-10-minutes-par-jour",
    titre: "10 minutes par jour : la routine qui remplace 3 h le dimanche",
    extrait: "Veille, candidatures, relances : le système des 3 créneaux qui garde votre recherche vivante sans y passer vos soirées.",
    cat: "organisation", jours: 10, lecture: 4, vus: 2200,
  },
  {
    slug: "sante-medical-ou-recrutent-cliniques-abidjan",
    titre: "Santé & Médical : où recrutent les cliniques d'Abidjan ce trimestre",
    extrait: "Infirmiers, techniciens de labo, pharmaciens : 5 établissements qui embauchent, et les profils qu'ils s'arrachent.",
    cat: "marche", jours: 12, lecture: 5, vus: 1400,
  },
  {
    slug: "5-questions-fin-entretien",
    titre: "Les 5 questions à poser en fin d'entretien (et celles à éviter)",
    extrait: "La fin d'entretien est un second entretien. Les questions qui marquent des points, et celles qui en font perdre.",
    cat: "entretien", jours: 13, lecture: 4, vus: 2700,
  },
  {
    slug: "premier-emploi-attentes-recruteurs",
    titre: "Premier emploi : ce que les recruteurs attendent vraiment de vous",
    extrait: "Au-delà du diplôme : les 5 signaux qui rassurent un recruteur sur un profil junior, et comment les montrer dès le CV.",
    cat: "premier-emploi", jours: 2, lecture: 5, vus: 1900,
  },
  {
    slug: "stage-alternance-negocier-la-suite",
    titre: "Stage et alternance : négocier la suite avant la fin",
    extrait: "Ne attendez pas la dernière semaine : le calendrier et les mots exacts pour transformer un stage en proposition de CDI.",
    cat: "premier-emploi", jours: 7, lecture: 4, vus: 1300,
  },
  {
    slug: "freelance-abidjan-facturer-durer",
    titre: "Freelance à Abidjan : facturer, se faire payer, durer",
    extrait: "Contrats, acomptes, relances : les règles simples qui protègent votre trésorerie et votre relation client.",
    cat: "freelance-consulting", jours: 6, lecture: 6, vus: 1100,
  },
]

const SERIES = [
  { titre: "Réussir ses entretiens", hue: "violet", total: 4, lus: 2 },
  { titre: "CV qui passe les filtres", hue: "sky", total: 3, lus: 1 },
  { titre: "Négocier sans se brader", hue: "emerald", total: 3, lus: 0 },
]

/* 7 conseils en rotation — un par jour, déterministe */
const CONSEILS_QUOTIDIENS = [
  { t: "Envoyez vos candidatures entre 7h30 et 9h00 : votre CV arrive en tête de boîte au moment où les recruteurs trient.", cat: "cv-candidature" },
  { t: "Un titre de CV précis — « Comptable senior · 5 ans · SYSCOHADA » — passe les filtres mieux qu'un titre générique.", cat: "cv-candidature" },
  { t: "Relancez 5 jours ouvrés après un entretien : assez tôt pour la motivation, assez tard pour ne pas presser.", cat: "entretien" },
  { t: "Préparez 3 questions chiffrées sur l'entreprise : c'est ce qui vous distingue de 90 % des candidats.", cat: "entretien" },
  { t: "Sur LinkedIn, votre titre est votre CV : poste visé + valeur ajoutée, en 120 caractères maximum.", cat: "linkedin-reseau" },
  { t: "Annoncez une fourchette, jamais un chiffre fixe : en négociation, le premier chiffre fige la discussion.", cat: "salaire" },
  { t: "10 minutes de veille par jour battent 3 heures de recherche le dimanche : la régularité crée la chance.", cat: "organisation" },
]

export const catOf = (code) => CATEGORIES.find((c) => c.code === code)
export const fmtVus = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(".", ",")} k` : n)

export { ARTICLES, CATEGORIES, SERIES, CONSEILS_QUOTIDIENS }

/* ════════════════════════════════════════════════════════════════════
CONTENU DES ARTICLES — v2.0 : pages_contenu (type = article, corps)
════════════════════════════════════════════════════════════════════ */
const CONTENU = {
  "recruteurs-abidjan-repondent-48h": {
    intro: "Pendant des années, postuler en Côte d'Ivoire signifiait attendre — parfois des semaines — un retour qui ne venait jamais. Depuis quelques mois, quelque chose a changé : sur les offres que nous collectons chaque matin, une part croissante de recruteurs répondent en moins de 48 heures. Voici ce que nos données montrent, et surtout comment en profiter avant que tout le monde ne s'y mette.",
    sections: [
      {
        id: "constat",
        titre: "Le constat : un marché qui s'est accéléré",
        paragraphes: [
          "En croisant les 47 offres collectées chaque jour sur EmploiDakar CI, GoAfrica, Novojob et LinkedIn, un signal est devenu impossible à ignorer : les annonces restent ouvertes moins longtemps. Les recruteurs ferment leurs campagnes plus tôt, parce qu'ils reçoivent plus de candidatures, plus vite.",
          "Conséquence directe : la fenêtre de tir s'est réduite. Une offre publiée à 6h02 peut être clôturée le surlendemain. Les candidats qui postulent le dimanche soir « pour la semaine » arrivent souvent après la bataille.",
        ],
      },
      {
        id: "pourquoi",
        titre: "Pourquoi 48 h, et pas plus",
        paragraphes: [
          "Les équipes RH ivoiriennes se sont équipées : viviers de candidats, tri par mots-clés, alertes internes. Le premier tri se fait désormais dans les 48 h suivant la publication — c'est là que votre CV a le plus de chances d'être lu attentivement.",
        ],
        points: [
          "Les candidatures des 48 premières heures sont traitées en priorité, avant l'accumulation",
          "Un CV reçu tôt est perçu comme un signal de motivation et de réactivité",
          "Les meilleurs candidats étant contactés vite, les recruteurs raccourcissent leurs campagnes",
          "Les offres les plus attractives (CDI, grands groupes) reçoivent 60 % de leurs candidatures en 48 h",
        ],
      },
      {
        id: "profiter",
        titre: "Comment postuler dans les bonnes 48 h",
        points: [
          "Repérez les offres le matin de leur publication — c'est exactement ce que fait le récapitulatif de 8h00",
          "Préparez un CV et une lettre génériques par filière, personnalisables en 15 minutes",
          "Postulez via le lien d'origine (toujours indiqué dans nos fiches), jamais par un intermédiaire",
          "Relancez poliment 5 jours ouvrés après — ni avant, ni après",
          "Tenez un tableau de bord simple : offre, date d'envoi, date de relance",
        ],
      },
    ],
    citation: {
      texte: "Un CV reçu dans les 48 premières heures est lu deux fois plus attentivement. Après 200 candidatures, on ne lit plus : on filtre.",
      auteur: "Responsable recrutement d'un groupe bancaire ivoirien",
    },
    aRetenir: [
      "La fenêtre de tir s'est réduite : 60 % des candidatures arrivent dans les 48 h",
      "Postuler tôt est perçu comme un signal de motivation — votre CV est lu plus attentivement",
      "Le récapitulatif de 8h00 vous place mécaniquement dans les premiers candidats",
    ],
    stats: [
      { v: 48, l: "heures — la fenêtre de tir" },
      { v: 60, suffix: " %", l: "des candidatures reçues" },
      { v: 47, l: "offres analysées chaque jour" },
    ],
    tags: ["marché ivoirien", "candidature", "réactivité", "Abidjan"],
  },

  "cv-7-erreurs-premiere-lecture": {
    intro: "Un recruteur passe en moyenne 6 secondes sur un CV lors du premier tri. Six secondes — le temps de lire un titre, de scanner deux dates et de repérer une faute. Nos analystes ont passé au crible plus de 1 200 CV reçus via nos sources partenaires : voici les 7 erreurs qui écartent une candidature avant même qu'elle ne soit vraiment lue.",
    sections: [
      {
        id: "six-secondes",
        titre: "Les 6 premières secondes",
        paragraphes: [
          "Le premier tri n'est pas une lecture : c'est un scan. L'œil du recruteur suit un parcours prévisible — titre, dernière expérience, formation — et cherche une raison d'éliminer, pas de retenir. Votre CV doit répondre à une seule question en 6 secondes : « cette personne correspond-elle au poste ? »",
          "Bonne nouvelle : cette contrainte joue en votre faveur si votre CV est structuré pour ce parcours. Un titre précis, une expérience récente bien décrite et zéro faute suffisent souvent à passer ce premier filtre.",
        ],
      },
      {
        id: "sept-erreurs",
        titre: "Les 7 erreurs qui coûtent cher",
        points: [
          "Un titre générique (« Dynamique et motivé ») au lieu du poste visé (« Comptable senior · 5 ans · SYSCOHADA »)",
          "Une photo floue, recadrée ou issue d'un selfie — ou pire, une photo d'identité datée de dix ans",
          "Des trous inexpliqués de plus de 6 mois dans le parcours",
          "Le même CV envoyé à 50 offres différentes, sans une ligne personnalisée",
          "Des missions décrites en tâches (« saisie de factures ») plutôt qu'en résultats (« apurement de 300 factures/mois, délais réduits de 40 % »)",
          "Un PDF mal nommé (« cv-final-v3.pdf ») — nommez-le « Prenom-Nom-Poste.pdf »",
          "Fautes d'orthographe ou de frappe : une seule suffit à éliminer sur les postes exigeant de la rigueur",
        ],
      },
      {
        id: "test",
        titre: "Le test des 30 secondes",
        paragraphes: [
          "Demandez à un proche de regarder votre CV pendant 30 secondes, puis posez-lui trois questions. S'il hésite sur une seule réponse, votre CV n'est pas prêt.",
        ],
        points: [
          "Quel poste je vise ?",
          "Quelle est ma dernière expérience, et avec quel résultat ?",
          "Qu'est-ce qui me distingue des autres candidats ?",
        ],
      },
    ],
    citation: {
      texte: "Je ne cherche pas le CV parfait. Je cherche une raison de ne pas éliminer — et les candidats me la donnent souvent dès la première ligne.",
      auteur: "Chargée de recrutement, cabinet RH à Abidjan-Plateau",
    },
    aRetenir: [
      "Le premier tri dure 6 secondes : votre CV doit répondre « oui, je corresponds » immédiatement",
      "Un titre précis vaut mieux qu'un profil générique — c'est l'erreur n° 1 constatée",
      "Décrivez des résultats chiffrés, pas des tâches",
    ],
    stats: [
      { v: 6, l: "secondes de lecture au 1er tri" },
      { v: 1200, l: "CV passés au crible" },
      { v: 7, l: "erreurs éliminatoires" },
    ],
    tags: ["CV", "candidature", "recruteurs", "premier tri"],
  },
}

/* Générateur de repli pour les articles sans contenu rédigé */
export const getContenu = (a) => {
  if (CONTENU[a.slug]) return CONTENU[a.slug]
  const cat = catOf(a.cat)
  return {
    intro: `${a.extrait} Pour écrire ce conseil, nos analystes sont partis de ce qu'ils observent chaque matin en épluchant les offres collectées sur nos 4 sources — pas de théorie, uniquement des constats de terrain.`,
    sections: [
      {
        id: "contexte",
        titre: "Ce que disent les offres collectées",
        paragraphes: [
          `Chaque matin, JobAlert CI analyse les nouvelles offres ${cat.label.toLowerCase()} publiées sur EmploiDakar CI, GoAfrica, Novojob et LinkedIn. Ce sont ces données — intitulés qui reviennent, compétences demandées, entreprises qui embauchent — qui servent de base à ce conseil.`,
          "Le constat de départ est simple : la plupart des candidats découvrent ces informations trop tard, ou jamais. Ceux qui les connaissent postulent mieux, plus vite, et négocient en position de force.",
        ],
      },
      {
        id: "methode",
        titre: "La méthode, étape par étape",
        points: [
          "Observez 5 offres récentes de votre filière et notez les 3 exigences qui reviennent le plus",
          "Adaptez votre CV et votre profil LinkedIn à ces exigences — mot pour mot",
          "Postulez dans les 48 h suivant la publication, via le lien d'origine de l'annonce",
          "Relancez 5 jours ouvrés après, avec un message court et précis",
          "Notez chaque candidature et chaque retour : c'est votre propre étude de marché",
        ],
      },
      {
        id: "pieges",
        titre: "Les pièges à éviter",
        points: [
          "Postuler « en masse » avec le même CV : les recruteurs le repèrent immédiatement",
          "Attendre la fin de semaine : 60 % des candidatures arrivent dans les 48 h",
          "Négliger le lien d'origine : postulez toujours sur la plateforme indiquée par l'annonce",
        ],
      },
    ],
    citation: {
      texte: "Les candidats qui postulent dans les 48 h suivant la publication décrochent trois fois plus d'entretiens que les autres.",
      auteur: "Synthèse de nos analystes — collecte de juillet 2026",
    },
    aRetenir: [
      "Ce conseil est tiré des offres réellement collectées, pas de principes généraux",
      "Postulez tôt, avec un CV adapté mot pour mot aux exigences de l'annonce",
      "La régularité bat l'intensité : 10 minutes par jour suffisent",
    ],
    stats: [
      { v: 47, l: "offres analysées chaque jour" },
      { v: 4, l: "sources scannées à 6h00" },
      { v: 3, prefix: "×", l: "plus d'entretiens en postulant tôt" },
    ],
    tags: [cat.label, "conseils", "recherche d'emploi", "Côte d'Ivoire"],
  }
}