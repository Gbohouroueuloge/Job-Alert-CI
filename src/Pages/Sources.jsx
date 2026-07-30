// src/pages/sources/index.jsx
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Activity, ArrowRight, ArrowUpRight, Bell, Check, ChevronRight, Clock, Crown,
  Fingerprint, Radar, ShieldAlert, ShieldCheck, X, Zap,
} from "lucide-react"
import { FaLinkedin } from "react-icons/fa"
import { cn } from "@/lib/utils"
import Seo from "@/components/seo/Seo"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CountUp, CtaLink, SectionHeading, Ticker } from "@/components/shared"
import { HUES } from "@/lib/hues"
import { getImgSource } from "@/utils/utilsSource"
import { ALL_OFFRES } from "@/data/offres"
import { sourcesSeo } from "@/lib/seo"

/* ════════════════════════════════════════════════════════════════════
DONNÉES — v2.0 : table sources (code, nom, url_base, anti_scraping, actif)
════════════════════════════════════════════════════════════════════ */
const SOURCES_DETAIL = [
  {
    code: "EmploiDakar CI",
    type: "Site emploi · source principale",
    hue: "blue",
    hex: "#0F2D4D",
    url: "https://www.emploidakar.com",
    passage: "06h02",
    duree: "38 s",
    principal: true,
    description:
      "La plus grosse plateforme d'emploi d'Afrique de l'Ouest. C'est notre source la plus généreuse : plusieurs dizaines d'offres ivoiriennes y tombent chaque jour, tous secteurs confondus, avec un fort volume de CDI et de CDD.",
    note: "Structure HTML surveillée en priorité. C'est elle qui alimente le plus votre récap.",
    tags: ["Afrique de l'Ouest", "Multi-secteurs", "CDI · CDD"],
  },
  {
    code: "GoAfrica",
    type: "Site emploi · couverture panafricaine",
    hue: "teal",
    hex: "#0F766E",
    url: "https://www.goafricaonline.com",
    passage: "06h03",
    duree: "24 s",
    description:
      "Un portail panafricain qui couvre la Côte d'Ivoire et ses voisins. Idéal pour capter les offres des groupes régionaux et les postes ouverts à la mobilité, avant qu'ils ne saturent.",
    note: "Couverture régionale, bon complément aux sources purement ivoiriennes.",
    tags: ["Panafricain", "Grands groupes", "Mobilité"],
  },
  {
    code: "Novojob",
    type: "Site emploi · local ivoirien",
    hue: "amber",
    hex: "#B45309",
    url: "https://www.novojob.com/cote-d-ivoire/",
    passage: "06h04",
    duree: "31 s",
    description:
      "Le site d'emploi ivoirien de référence. Beaucoup de PME et d'ETI locales y publient en exclusivité, ainsi que des offres qu'on ne retrouve nulle part ailleurs, souvent pourvues en quelques jours.",
    note: "Site local, la meilleure source pour les offres 100 % ivoiriennes.",
    tags: ["100 % Côte d'Ivoire", "PME · ETI", "Exclusivités"],
  },
  {
    code: "LinkedIn",
    type: "Réseau professionnel",
    hue: "sky",
    hex: "#0A66C2",
    url: "https://www.linkedin.com/jobs",
    passage: "06h06",
    duree: "1 min 42",
    linkedin: true,
    prudent: true,
    description:
      "Le réseau professionnel n°1. On y lit les offres publiées par les recruteurs ivoiriens les plus actifs, notamment dans la tech, la finance et le marketing, là où la concurrence est la plus rapide.",
    note: "Anti-scraping fort, délais renforcés entre requêtes et plan de repli prévu.",
    tags: ["Tech & Finance", "Recruteurs directs", "Temps réel"],
  },
]

const PRINCIPES = [
  {
    icon: Radar,
    titre: "Un scraper par source, isolé",
    texte:
      "Chaque source a son propre scraper. Si l'une tombe en panne ou change de structure, les trois autres continuent de tourner normalement. Chaque échec est journalisé avec horodatage.",
  },
  {
    icon: ShieldCheck,
    titre: "Lecture respectueuse",
    texte:
      "Délais entre les requêtes, respect des conditions d'utilisation. LinkedIn, la source la plus protégée, bénéficie de délais renforcés et d'un plan de repli si l'accès venait à être bloqué.",
  },
  {
    icon: Fingerprint,
    titre: "Dédoublonnage par empreinte",
    texte:
      "Chaque offre reçoit un hash unique calculé depuis son lien. La même annonce repérée sur deux sources ? Une seule version est conservée — vous ne la recevez jamais deux fois.",
  },
  {
    icon: Activity,
    titre: "Structure surveillée chaque jour",
    texte:
      "Si un site change de mise en page, une alerte part immédiatement et un correctif est appliqué. Votre flux ne s'arrête jamais, même quand les sites évoluent.",
  },
]

/* ════════════════════════════════════════════════════════════════════
OUTILS
════════════════════════════════════════════════════════════════════ */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const dotOf = (code) =>
  HUES[SOURCES_DETAIL.find((s) => s.code === code)?.hue ?? "blue"].dot

const LogoSource = ({ s, tile = "size-14", inner = "size-8" }) => (
  <span
    className={cn(
      "grid shrink-0 place-items-center rounded-xl border border-outline-variant/40 bg-white shadow-soft",
      tile
    )}
  >
    {s.linkedin ? (
      <FaLinkedin className={inner} style={{ color: s.hex }} />
    ) : (
      <img src={getImgSource(s.code)} alt={s.code} className={cn(inner, "object-contain")} />
    )}
  </span>
)

/* Compte à rebours vers le prochain scan de 6h00 */
const CompteReboursScan = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const target = new Date(now)
  target.setHours(6, 0, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  const diff = Math.max(0, target - now)
  const unites = [
    { v: Math.floor(diff / 3.6e6), l: "h" },
    { v: Math.floor((diff % 3.6e6) / 6e4), l: "min" },
    { v: Math.floor((diff % 6e4) / 1e3), l: "s" },
  ]
  return (
    <div className="flex items-center gap-1.5">
      {unites.map((u, i) => (
        <span key={u.l} className="flex items-center gap-1.5">
          {i > 0 && <span className="font-heading text-base font-black text-white/30">:</span>}
          <span className="grid min-w-9 place-items-center rounded-md bg-white/10 px-1.5 py-0.5 font-heading text-base font-extrabold tabular-nums">
            {String(u.v).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold uppercase text-white/50">{u.l}</span>
        </span>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
CONSOLE RADAR — le cœur vivant de la page
════════════════════════════════════════════════════════════════════ */
const BLIPS = [
  { code: "EmploiDakar CI", x: 68, y: 18, delay: 0 },
  { code: "GoAfrica", x: 82, y: 55, delay: 0.8 },
  { code: "Novojob", x: 24, y: 76, delay: 1.6 },
  { code: "LinkedIn", x: 16, y: 30, delay: 2.4 },
]

const ConsoleScan = ({ parSource }) => {
  const dateFr = (() => {
    const d = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    return d.charAt(0).toUpperCase() + d.slice(1)
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md min-w-0 md:max-w-none"
    >
      <div className="absolute -inset-8 rounded-full bg-brand-orange/10 blur-3xl" aria-hidden />
      <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-2 overflow-hidden rounded-2xl bg-brand-navy" aria-hidden>
        <div className="absolute inset-0 bg-pattern opacity-20" />
      </div>

      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
        transition={{ delay: 0.9, opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute -top-4 left-5 z-20 inline-flex -rotate-3 items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg sm:-left-4"
      >
        <Radar className="size-3" />
        4/4 sources actives
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.05, duration: 0.4 }}
        className="absolute -top-3 right-6 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-600 shadow-soft"
      >
        <ShieldCheck className="size-3" />
        0 doublon
      </motion.span>

      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/40 bg-white shadow-[0_24px_48px_-16px_rgba(15,45,77,0.22)]">
        {/* En-tête console */}
        <div className="flex items-center gap-3 border-b border-outline-variant/40 bg-surface-container-low/60 px-5 py-4">
          <span className="relative flex size-2.5 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-sm font-bold text-brand-navy">Radar de collecte</p>
            <p className="text-[11px] text-muted-foreground">{dateFr} · dernier passage 06h02</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-navy px-2.5 py-1 text-[10px] font-bold text-white">
            <Zap className="size-3 text-brand-orange" />
            100 % auto
          </span>
        </div>

        {/* Panneau radar */}
        <div className="relative overflow-hidden bg-brand-navy px-5 py-6">
          <div className="pointer-events-none absolute inset-0 bg-pattern opacity-15" aria-hidden />
          <div className="relative mx-auto aspect-square w-full max-w-65">
            {/* Anneaux + croix */}
            <div className="absolute inset-0 rounded-full border border-white/12" />
            <div className="absolute inset-[17%] rounded-full border border-white/10" />
            <div className="absolute inset-[34%] rounded-full border border-white/8" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-white/6" aria-hidden />
            <div className="absolute top-1/2 left-0 h-px w-full bg-white/6" aria-hidden />
            {/* Faisceau rotatif */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "conic-gradient(from 0deg, rgba(245,166,35,0.45) 0deg, rgba(245,166,35,0.08) 45deg, transparent 75deg)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              aria-hidden
            />
            {/* Blips des 4 sources */}
            {BLIPS.map((b) => {
              const src = SOURCES_DETAIL.find((s) => s.code === b.code)
              const offres = parSource.find((p) => p.code === b.code)
              return (
                <Tooltip key={b.code}>
                  <TooltipTrigger asChild>
                    <span
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-default"
                      style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    >
                      <span className="relative flex size-3">
                        <motion.span
                          className="absolute inline-flex size-full rounded-full opacity-60"
                          style={{ backgroundColor: src.hex }}
                          animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2.4, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
                        />
                        <span
                          className="relative inline-flex size-3 rounded-full border-2 border-white/80"
                          style={{ backgroundColor: src.hex }}
                        />
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-center">
                    {b.code} · +{offres?.nouveaux ?? 0} offres ce matin
                  </TooltipContent>
                </Tooltip>
              )
            })}
            {/* Centre */}
            <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange shadow-[0_0_12px_rgba(245,166,35,0.8)]" />
          </div>
        </div>

        {/* Les 4 sources */}
        <ul className="divide-y divide-outline-variant/30 px-3">
          {parSource.map((s, i) => (
            <HoverCard key={s.code} openDelay={150}>
              <HoverCardTrigger asChild>
                <motion.li
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.12, ease: "easeOut" }}
                  className="flex cursor-default items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface-container-low/60"
                >
                  <LogoSource s={s} tile="size-9 rounded-lg" inner="size-5" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-on-surface">{s.code}</p>
                    <p className="text-[11px] text-muted-foreground">Passage à {s.passage} · {s.duree}</p>
                  </div>
                  <span className="shrink-0 font-heading text-sm font-extrabold text-brand-navy">+{s.nouveaux}</span>
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                    <Check className="size-3" strokeWidth={4} />
                  </span>
                </motion.li>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-60">
                <p className="font-heading text-sm font-semibold">{s.code}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.nouveaux} offres extraites ce matin en {s.duree}. {s.total} offres actives au total.
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <ShieldCheck className="size-3.5" />
                  Source opérationnelle
                </p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </ul>

        {/* Pied : prochain scan */}
        <div className="flex items-center justify-between gap-3 border-t border-outline-variant/40 bg-brand-navy px-5 py-3.5 text-white">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
            <Clock className="size-3.5 text-brand-orange" />
            Prochain scan dans
          </p>
          <CompteReboursScan />
        </div>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════
HERO
════════════════════════════════════════════════════════════════════ */
const HeroSources = ({ parSource, totalNouveaux }) => (
  <section className="relative overflow-hidden hero-gradient">
    <div className="absolute inset-0 bg-pattern opacity-50" aria-hidden />
    <div className="absolute -top-32 right-[-10%] size-140 rounded-full bg-brand-orange/8 blur-3xl" aria-hidden />
    <div className="absolute -bottom-40 -left-40 size-120 rounded-full bg-brand-navy/5 blur-3xl" aria-hidden />

    <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-8 md:px-12 md:pb-16 md:pt-10">
      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
        aria-label="Fil d'Ariane"
      >
        <Link to="/" className="transition-colors hover:text-brand-navy">Accueil</Link>
        <ChevronRight className="size-3" />
        <span className="font-semibold text-brand-navy">Sources partenaires</span>
      </motion.nav>

      <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-start gap-5">
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-bold text-emerald-700">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              Collecte terminée · 4/4 sources · 06h02
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold text-on-surface-variant">
              <ShieldCheck className="size-3 text-brand-orange" />
              Lecture respectueuse, zéro doublon
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl font-black leading-[1.04] tracking-tight text-brand-navy sm:text-5xl xl:text-6xl"
          >
            4 sources scannées.
            <br />
            <span className="relative whitespace-nowrap text-brand-orange">
              1 récapitulatif.
              <svg
                className="absolute -bottom-1.5 left-0 w-full"
                viewBox="0 0 200 9"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M2 6.5C60 2.5 140 2.5 198 6.5"
                  stroke="#F5A623"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.85 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.94, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
            </span>
            <span className="mt-1 block">0 doublon.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-xl md:text-lg leading-relaxed text-on-surface-variant">
            Chaque matin à <strong className="font-semibold text-brand-navy">6h00</strong>, nos scrapers
            parcourent les 4 grandes plateformes d'emploi d'Afrique de l'Ouest pour n'en garder que
            l'essentiel : <strong className="font-semibold text-brand-navy">vos offres</strong>. Voici qui
            elles sont, et comment on les lit.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-1 flex flex-col gap-3 sm:flex-row">
            <CtaLink to="/inscription" icon={Bell} animateIcon>Créer mon alerte 8h00</CtaLink>
            <CtaLink to="/offres" variant="secondary" iconRight={ArrowRight}>Voir les offres du jour</CtaLink>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">
            {[
              { valeur: 4, label: "sources scannées" },
              { valeur: totalNouveaux, label: "offres ce matin" },
              { valeur: 0, label: "doublon envoyé" },
              { valeur: 100, suffix: " %", label: "automatique" },
            ].map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-3xl font-black text-brand-navy">
                  <CountUp to={s.valeur} suffix={s.suffix ?? ""} />
                </dd>
                <dd className="text-xs font-medium text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <ConsoleScan parSource={parSource} />
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
LES 4 PARTENAIRES — carte vedette + 3 profils
════════════════════════════════════════════════════════════════════ */
const StatsSource = ({ s, total, nouveaux }) => (
  <div className="grid grid-cols-2 gap-3">
    {[
      { v: total, l: "offres actives" },
      { v: nouveaux, l: "ce matin" },
    ].map((x) => (
      <div key={x.l} className="rounded-lg border border-outline-variant/40 bg-surface-container-low/50 px-3.5 py-3">
        <p className="font-heading text-2xl font-black text-brand-navy">
          <CountUp to={x.v} />
        </p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{x.l}</p>
      </div>
    ))}
    <div className="col-span-2 flex items-center justify-between rounded-lg border border-outline-variant/40 bg-surface-container-low/50 px-3.5 py-3">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant">
        <Clock className="size-3.5 text-brand-orange" />
        Passage à {s.passage}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">{s.duree}</span>
    </div>
  </div>
)

const CarteSource = ({ s, index, total, nouveaux, featured = false, className }) => {
  const hue = HUES[s.hue]
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-outline-variant/40 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover",
        className
      )}
      style={{ borderTop: `3px solid ${s.hex}` }}
    >
      {/* Ligne de scan animée */}
      <div className="relative h-1 overflow-hidden bg-surface-container" aria-hidden>
        <motion.span
          className="absolute inset-y-0 w-1/3 rounded-full"
          style={{ backgroundColor: s.hex }}
          animate={{ left: ["-35%", "105%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
        />
      </div>

      {featured ? (
        <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <LogoSource s={s} tile="size-16" inner="size-9" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-xl font-extrabold tracking-tight text-brand-navy">{s.code}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#B45309]">
                    <Crown className="size-3" />
                    Source principale
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{s.type}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{s.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span key={t} className="rounded-full border border-outline-variant/60 bg-surface-container-low/60 px-2.5 py-1 text-[11px] font-medium text-on-surface-variant">
                  {t}
                </span>
              ))}
            </div>
            <p className={cn("mt-4 flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-[12px] font-medium", hue.tile)}>
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
              {s.note}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <StatsSource s={s} total={total} nouveaux={nouveaux} />
            <div className="mt-auto flex flex-wrap items-center gap-2.5">
              <Link
                to={`/offres?src=${encodeURIComponent(s.code)}`}
                className={cn("inline-flex h-9 items-center gap-1.5 rounded-md px-4 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110", hue.solid)}
              >
                Voir les offres
              </Link>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-outline-variant/60 px-4 text-xs font-bold text-on-surface-variant transition-all duration-200 hover:border-brand-navy/40 hover:text-brand-navy"
              >
                Visiter le site
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center gap-3">
            <LogoSource s={s} />
            <div className="min-w-0">
              <h3 className="truncate font-heading text-lg font-extrabold tracking-tight text-brand-navy">{s.code}</h3>
              <p className="text-[11px] font-semibold text-muted-foreground">{s.type}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{s.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {s.tags.map((t) => (
              <span key={t} className="rounded-full border border-outline-variant/60 bg-surface-container-low/60 px-2.5 py-1 text-[11px] font-medium text-on-surface-variant">
                {t}
              </span>
            ))}
          </div>
          <p className={cn(
            "mt-4 flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-[12px] font-medium",
            s.prudent ? "bg-amber-500/10 text-amber-700" : hue.tile
          )}>
            {s.prudent ? <ShieldAlert className="mt-0.5 size-3.5 shrink-0" /> : <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />}
            {s.note}
          </p>
          <div className="mt-5">
            <StatsSource s={s} total={total} nouveaux={nouveaux} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-outline-variant/40 pt-4">
            <Link
              to={`/offres?src=${encodeURIComponent(s.code)}`}
              className={cn("inline-flex h-9 items-center gap-1.5 rounded-md px-4 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110", hue.solid)}
            >
              Voir les offres
            </Link>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-outline-variant/60 px-4 text-xs font-bold text-on-surface-variant transition-all duration-200 hover:border-brand-navy/40 hover:text-brand-navy"
            >
              Visiter le site
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </motion.article>
  )
}

const SectionSources = ({ stats }) => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Les partenaires"
          title={<>Ils publient, <span className="text-brand-orange">on collecte</span>.</>}
          sub="Quatre plateformes, quatre personnalités. Chacune alimente votre récapitulatif à sa manière et aucune n'est laissée de côté."
        />
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-6">
        {stats.map((s, i) => (
          <CarteSource
            key={s.code}
            s={s}
            index={i}
            total={s.total}
            nouveaux={s.nouveaux}
            featured={s.principal}
            className={s.principal ? "md:col-span-6" : "md:col-span-2"}
          />
        ))}
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
MÉTHODE — lecture respectueuse
════════════════════════════════════════════════════════════════════ */
const SectionMethode = () => (
  <section className="border-y border-outline-variant/30 bg-surface-container-lowest py-16 md:py-20">
    <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="self-start lg:sticky lg:top-28">
        <SectionHeading
          eyebrow="Notre méthode"
          title={<>On lit, <span className="text-brand-orange">on ne force pas</span>.</>}
          sub="Le scraping n'est pas une aspiration sauvage. C'est une lecture méthodique, polie et surveillée, pour que les sources restent saines et votre flux fiable."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-md rounded-xl border border-outline-variant/50 bg-white p-6 shadow-soft"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
            <Radar className="size-5" strokeWidth={2} />
          </span>
          <h3 className="mt-4 font-heading text-base font-bold text-brand-navy">
            Envie de voir la chaîne complète ?
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
            De la collecte à l'envoi de 8h00, on vous montre chaque étape en détail.
          </p>
          <Link
            to="/comment-ca-marche"
            className="group mt-4 inline-flex items-center gap-2 rounded-md bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-navy/90"
          >
            Comment ça marche
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute bottom-6 left-6 top-6 w-px bg-outline-variant/50" aria-hidden />
        <div className="space-y-8">
          {PRINCIPES.map((p, i) => (
            <motion.div
              key={p.titre}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-5 pl-0"
            >
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-brand-orange/40 bg-white font-heading text-sm font-extrabold text-brand-orange shadow-soft">
                0{i + 1}
              </span>
              <div className="flex-1 rounded-xl border border-outline-variant/40 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover">
                <h3 className="flex items-center gap-2.5 font-heading text-base font-bold text-brand-navy">
                  <p.icon className="size-4.5 text-brand-orange" strokeWidth={2} />
                  {p.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{p.texte}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
GARANTIE 0 DOUBLON — le hash en action
════════════════════════════════════════════════════════════════════ */
const BandeauDedup = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-xl bg-brand-navy"
      >
        <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-24 size-105 rounded-full bg-brand-orange/15 blur-3xl" aria-hidden />
        <Fingerprint className="pointer-events-none absolute -bottom-10 -right-6 size-56 rotate-12 text-white/5" strokeWidth={1} aria-hidden />

        <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              <Fingerprint className="size-3" />
              Dédoublonnage par hash
            </span>
            <h2 className="mt-4 font-heading text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              La même offre ne passe jamais deux fois.
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
              Chaque annonce reçoit une empreinte unique calculée depuis son lien. Si elle est
              repérée sur deux sources, une seule version entre en base. Résultat : votre boîte
              mail reste propre, et chaque offre n'apparaît qu'une fois.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {[
                { v: 0, l: "doublon envoyé" },
                { v: 1, l: "hash unique par offre" },
                { v: 4, l: "sources croisées" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-heading text-2xl font-black text-brand-orange"><CountUp to={s.v} /></p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visualisation concrète */}
          <div className="rounded-xl bg-white p-5 shadow-hover min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Même annonce, deux sources
            </p>
            <div className="mt-3.5 space-y-2.5">
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-50/40 p-3"
              >
                <LogoSource s={SOURCES_DETAIL[0]} tile="size-9 rounded-lg" inner="size-5" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-brand-navy">Comptable senior</p>
                  <p className="text-[11px] text-muted-foreground">Groupe SIFCA · via EmploiDakar CI</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <Check className="size-3" strokeWidth={4} />
                  Insérée
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="relative flex items-center gap-3 rounded-lg border border-outline-variant/50 bg-surface-container-low/50 p-3 opacity-80"
              >
                <motion.span
                  initial={{ scale: 1.7, opacity: 0, rotate: 16 }}
                  whileInView={{ scale: 1, opacity: 1, rotate: 6 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.75, duration: 0.3, ease: "backOut" }}
                  className="absolute right-2.5 top-2.5 rounded border-2 border-red-500/70 bg-white/80 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-red-600"
                >
                  Doublon
                </motion.span>
                <LogoSource s={SOURCES_DETAIL[1]} tile="size-9 rounded-lg" inner="size-5" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-on-surface-variant line-through decoration-red-400/70">Comptable senior</p>
                  <p className="text-[11px] text-muted-foreground">Groupe SIFCA · via GoAfrica</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">
                  <X className="size-3" strokeWidth={4} />
                  Écartée
                </span>
              </motion.div>
            </div>
            <p className="mt-3.5 rounded-lg bg-surface-container px-3.5 py-2.5 font-mono text-[11px] text-on-surface-variant">
              hash_unique : <span className="font-bold text-brand-navy">a3f8…9c2</span>
              <span className="ml-2 text-emerald-600">✓ contrainte UNIQUE</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
CTA FINAL
════════════════════════════════════════════════════════════════════ */
const CtaFinal = () => (
  <section className="bg-surface-container-lowest pb-16 md:pb-20 mt-8">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-xl border border-outline-variant/50 bg-white px-6 py-10 shadow-soft sm:px-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-brand-orange/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-heading text-2xl font-black tracking-tight text-brand-navy sm:text-3xl">
              Le meilleur de ces 4 sources, <span className="text-brand-orange">dans votre boîte mail</span>.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-on-surface-variant">
              Un seul récapitulatif à 8h00, filtré sur vos filières. Vous n'ouvrez plus jamais
              un site d'emploi. C'est lui qui vient à vous.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {["Gratuit pour toujours", "1 email par jour", "Désinscription en 1 clic"].map((r) => (
                <span key={r} className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                  <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check className="size-2.5 text-emerald-600" strokeWidth={3} />
                  </span>
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <CtaLink to="/inscription" icon={Bell} animateIcon>Créer mon alerte 8h00</CtaLink>
            <CtaLink to="/offres" variant="outline" iconRight={ArrowRight}>Voir les offres</CtaLink>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
PAGE
════════════════════════════════════════════════════════════════════ */
const Sources = () => {
  const stats = useMemo(
    () =>
      SOURCES_DETAIL.map((s) => ({
        ...s,
        total: ALL_OFFRES.filter((o) => o.source === s.code).length,
        nouveaux: ALL_OFFRES.filter((o) => o.source === s.code && o.jours === 0).length,
      })),
    []
  )
  const totalNouveaux = stats.reduce((sum, s) => sum + s.nouveaux, 0)

  return (
    <>
      <Seo {...sourcesSeo({ total: SOURCES_DETAIL.length })} />
      <main>
        <HeroSources parSource={stats} totalNouveaux={totalNouveaux} />
        <Ticker
          variant="dark"
          label="En direct"
          duration={220}
          items={ALL_OFFRES.map((o) => ({
            key: o.uid,
            dot: dotOf(o.source),
            titre: o.titre,
            entreprise: o.entreprise,
            source: o.source,
          }))}
        />
        <SectionSources stats={stats} />
        <SectionMethode />
        <BandeauDedup />
        <CtaFinal />
      </main>
    </>
  )
}

export default Sources
