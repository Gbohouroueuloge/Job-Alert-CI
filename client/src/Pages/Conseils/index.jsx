import { useMemo, useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight, ArrowUpDown, ArrowUpRight, Bell, BookOpen, ChevronDown,
  ChevronLeft, ChevronRight, Clock, Flame, Lightbulb, MoveHorizontal, Newspaper,
  Search, SearchX, SlidersHorizontal, TrendingUp, X, Zap,
} from "lucide-react"
import { Link } from "react-router-dom"
import Seo from "@/components/seo/Seo"
import { cn } from "@/lib/utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { HUES } from "@/lib/hues"
import useCarrousel from "@/hooks/use-carrousel"
import {
  ChipFiltre, ChipsFiltres, CountUp, CtaLink, FilterGroup, ReassuranceList,
  SectionHeading, SegmentsProgression, StatusChip, StickyFilterBar,
} from "@/components/shared"
import {
  Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer"
import { ARTICLES, CATEGORIES, CONSEILS_QUOTIDIENS, SERIES, catOf, fmtVus } from "@/data/conseils"
import { dateLabel } from "@/lib/dates";
import { CarteArticle } from "@/components/shared"
import { useUrlFilters } from "@/hooks/use-url-filters"
import { conseilsSeo } from "@/lib/seo"

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

const SEUIL_SWIPE_PX = 56        // distance minimale pour valider un swipe
const SEUIL_SWIPE_VITESSE = 420  // px/s — un coup sec valide même sur courte distance

const useGlissement = ({ count, idx, setIdx, pause, reprendre }) => {
  const [direction, setDirection] = useState(1) // 1 → vers la gauche (suivant), -1 → vers la droite

  const suivant = () => { setDirection(1); setIdx((i) => (i + 1) % count) }
  const precedent = () => { setDirection(-1); setIdx((i) => (i - 1 + count) % count) }
  const onSelect = (i) => { if (i !== idx) { setDirection(i > idx ? 1 : -1); setIdx(i) } }

  /* Props à étaler sur un motion.div pour le rendre glissable */
  const propsGlissement = {
    drag: "x",
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 0.15,
    dragMomentum: false,
    dragTransition: { bounceStiffness: 600, bounceDamping: 28 },
    onDragStart: pause, // fige le minuteur pendant le geste
    onDragEnd: (e, info) => {
      reprendre()
      const { offset, velocity } = info
      if (offset.x < -SEUIL_SWIPE_PX || velocity.x < -SEUIL_SWIPE_VITESSE) suivant()
      else if (offset.x > SEUIL_SWIPE_PX || velocity.x > SEUIL_SWIPE_VITESSE) precedent()
    },
  }

  return { direction, onSelect, propsGlissement }
}

/* Variants directionnels — le contenu entre et sort dans le sens du swipe */
const variantsGlissement = {
  entrer: (dir) => ({ opacity: 0, x: 64 * dir }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  sortir: (dir) => ({ opacity: 0, x: -48 * dir, transition: { duration: 0.28, ease: "easeIn" } }),
}

const variantsGlissementDoux = {
  entrer: (dir) => ({ opacity: 0, x: 32 * dir }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  sortir: (dir) => ({ opacity: 0, x: -24 * dir, transition: { duration: 0.25, ease: "easeIn" } }),
}

/* ════════════════════════════════════════════════════════════════════
   HERO — l'article à la une, en carte navy signature
   ════════════════════════════════════════════════════════════════════ */

const A_LA_UNE = [
  "recruteurs-abidjan-repondent-48h",
  "negocier-salaire-abidjan-fourchettes-2026",
  "cv-7-erreurs-premiere-lecture",
].map((slug) => ARTICLES.find((x) => x.slug === slug))

const DUREE_UNE = 6500 // ms d'affichage par conseil

const CarteUne = () => {
  const { idx, setIdx, progression, pause, reprendre } = useCarrousel({
    count: A_LA_UNE.length,
    duree: DUREE_UNE,
  })
  const { direction, onSelect, propsGlissement } = useGlissement({
    count: A_LA_UNE.length, idx, setIdx, pause, reprendre,
  })

  const a = A_LA_UNE[idx]
  const cat = catOf(a.cat)
  const hue = HUES[cat.hue]
  const Icon = cat.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={pause}
      onMouseLeave={reprendre}
      className="relative mx-auto w-full max-w-md min-w-0 md:max-w-none"
    >
      {/* Halo — suit la teinte de la catégorie affichée */}
      <motion.div
        className="absolute -inset-8 rounded-full blur-3xl"
        animate={{ backgroundColor: `${hue.hex}30` }}
        transition={{ duration: 0.9 }}
        aria-hidden
      />

      {/* Badge « À la une » — permanent */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
        transition={{ delay: 0.9, opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute -top-4 left-5 z-20 inline-flex -rotate-3 items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg sm:-left-4"
      >
        <Newspaper className="size-3" />
        À la une
      </motion.span>

      {/* Badges dynamiques — se rafraîchissent à chaque rotation */}
      <motion.span
        key={`lecture-${a.slug}`}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.3, delay: 0.1 },
          scale: { duration: 0.3, delay: 0.1 },
          y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -top-3 right-6 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white px-3 py-1.5 text-[11px] font-bold text-brand-navy shadow-soft"
      >
        <Clock className="size-3 text-brand-orange" />
        {a.lecture} min de lecture
      </motion.span>

      <motion.span
        key={`vus-${a.slug}`}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.3, delay: 0.2 },
          scale: { duration: 0.3, delay: 0.2 },
          y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
        }}
        className="absolute -bottom-4 right-8 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white px-3.5 py-1.5 text-[11px] font-bold text-emerald-600 shadow-hover"
      >
        <TrendingUp className="size-3" />
        {fmtVus(a.vus)} lectures
      </motion.span>

      {/* Carte navy — glissable horizontalement (doigt ou souris) */}
      <motion.div
        {...propsGlissement}
        className="relative flex cursor-grab select-none flex-col overflow-hidden rounded-2xl bg-brand-navy text-white shadow-[0_24px_48px_-16px_rgba(15,45,77,0.35)] active:cursor-grabbing"
      >
        <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
        <motion.div
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full blur-3xl"
          animate={{ backgroundColor: `${hue.hex}3d` }}
          transition={{ duration: 0.9 }}
          aria-hidden
        />

        {/* Icône fantôme — fondue entre catégories */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={a.slug}
            initial={{ opacity: 0, scale: 0.92, rotate: 6 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -bottom-8 -right-4"
            aria-hidden
          >
            <Icon className="size-48 text-white/5" strokeWidth={1} />
          </motion.div>
        </AnimatePresence>

        {/* Segments de progression — cliquables, pause au survol */}
        <div className="relative px-6 pt-5">
          <SegmentsProgression
            count={A_LA_UNE.length}
            idx={idx}
            progression={progression}
            onSelect={onSelect}
            tone="dark"
            labels={A_LA_UNE.map((a) => a.titre)}
          />
        </div>

        {/* En-tête du brief */}
        <div className="relative flex items-center gap-3 border-b border-white/10 px-6 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-orange font-heading text-[11px] font-black text-white">JA</span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold">Le brief JobAlert CI</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={a.slug}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="truncate text-[11px] text-white/60"
              >
                À la une · {dateLabel(a.jours)} · {idx + 1}/{A_LA_UNE.length}
              </motion.p>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={a.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 text-[11px] font-semibold text-white/60"
            >
              {a.lecture} min
            </motion.span>
          </AnimatePresence>
          {/* Indice de glissement — écrans tactiles uniquement */}
          <MoveHorizontal className="pointer-coarse:block hidden size-3.5 shrink-0 text-white/40" aria-hidden />
        </div>

        {/* Corps — hauteur stabilisée, contenu en rotation directionnelle */}
        <div className="relative flex min-h-90 flex-1 flex-col sm:min-h-94">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={a.slug}
              custom={direction}
              variants={variantsGlissement}
              initial="entrer"
              animate="visible"
              exit="sortir"
              className="flex flex-1 flex-col px-6 py-6"
            >
              <span className={cn("inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white", hue.solid)}>
                <Icon className="size-3" />
                {cat.label}
              </span>
              <Link
                to={`/conseils/${a.slug}`}
                className="mt-4 line-clamp-3 font-heading text-2xl font-extrabold leading-snug transition-colors duration-300 hover:text-brand-orange sm:text-[1.7rem]"
              >
                {a.titre}
              </Link>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">{a.extrait}</p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-[10px] font-black ring-1 ring-white/20">RC</span>
                  <div>
                    <p className="text-xs font-bold">La rédaction</p>
                    <p className="text-[10px] text-white/50">Analystes marché · JobAlert CI</p>
                  </div>
                </div>
                <Link
                  to={`/conseils/${a.slug}`}
                  className="group inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                >
                  Lire l'article
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

const HeroConseils = () => {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="absolute inset-0 bg-pattern opacity-50" aria-hidden />
      <div className="absolute -top-32 right-[-10%] size-140 rounded-full bg-brand-orange/8 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 -left-40 size-120 rounded-full bg-brand-navy/5 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-8 md:px-12 md:pb-16 md:pt-10">
        {/* Fil d'Ariane */}
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          aria-label="Fil d'Ariane"
        >
          <Link to="/" className="transition-colors hover:text-brand-navy">Accueil</Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-brand-navy">Conseils & Analyses</span>
        </motion.nav>

        <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Colonne gauche */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-start gap-5">
            <motion.div variants={fadeUp}>
              <StatusChip tooltip="Un nouveau conseil publié chaque mardi à 6h02, en même temps que la collecte des 4 sources.">
                Nouveau conseil chaque mardi · 6h02
              </StatusChip>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl font-black leading-[1.06] tracking-tight text-brand-navy sm:text-5xl xl:text-6xl"
            >
              Le marché de l'emploi ivoirien,{" "}
              <span className="relative whitespace-nowrap text-brand-orange">
                décodé
                <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 9" fill="none" preserveAspectRatio="none" aria-hidden>
                  <motion.path
                    d="M2 6.5C60 2.5 140 2.5 198 6.5"
                    stroke="#F5A623"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.85 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
              </span>
              .
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl md:text-lg leading-relaxed text-on-surface-variant">
              CV, entretiens, salaires, tendances par filière : des conseils concrets, écrits à
              partir des <strong className="font-semibold text-brand-navy">47 offres collectées chaque matin</strong> sur
              nos 4 sources. Pas de théorie, du terrain.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-1 flex flex-col gap-3 sm:flex-row">
              <CtaLink to="/inscription" icon={Bell} animateIcon>Recevoir conseils + offres à 8h00</CtaLink>
              <CtaLink
                to="#bibliotheque"
                variant="secondary"
                iconRight={ChevronDown}
                iconRightClassName="group-hover:translate-x-0 group-hover:translate-y-0.5"
              >
                Explorer la bibliothèque
              </CtaLink>
            </motion.div>

            <motion.dl variants={fadeUp} className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                { valeur: ARTICLES.length, label: "conseils publiés" },
                { valeur: CATEGORIES.length, label: "thèmes couverts" },
                { valeur: 5, label: "min de lecture moyenne" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-heading text-3xl font-black text-brand-navy"><CountUp to={s.valeur} /></dd>
                  <dd className="text-xs font-medium text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Colonne droite */}
          <CarteUne />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
  CONSEIL DU JOUR — 7 conseils en rotation, pause au survol, swipe
════════════════════════════════════════════════════════════════════ */

const DUREE_CONSEIL = 5000 // ms par conseil

const ConseilDuJour = () => {
  const { idx, setIdx, progression, pause, reprendre } = useCarrousel({
    count: CONSEILS_QUOTIDIENS.length,
    duree: DUREE_CONSEIL,
  })
  const { direction, onSelect, propsGlissement } = useGlissement({
    count: CONSEILS_QUOTIDIENS.length, idx, setIdx, pause, reprendre,
  })

  const conseil = CONSEILS_QUOTIDIENS[idx]
  const cat = catOf(conseil.cat)
  const hue = HUES[cat.hue]

  return (
    <section
      onMouseEnter={pause}
      onMouseLeave={reprendre}
      className="border-y border-outline-variant/40 bg-surface-container-lowest"
    >
      <div className="mx-auto flex flex-col md:flex-row max-w-7xl items-stretch px-6 md:px-12">
        <div className="z-10 flex shrink-0 items-center gap-2.5 md:border-r border-outline-variant/40 py-4 pr-5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-orange" />
          </span>
          <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.16em] text-brand-navy">
            Conseil du jour
          </span>
        </div>

        {/* Zone glissable — doigt ou souris */}
        <motion.div
          {...propsGlissement}
          className="flex flex-1 cursor-grab select-none flex-col justify-center gap-3 py-4 pl-5 active:cursor-grabbing sm:flex-row sm:items-center sm:gap-5"
        >
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg transition-colors duration-500", hue.tile)}>
            <Lightbulb className="size-4.5" />
          </span>

          {/* Texte — hauteur réservée, glissement directionnel à chaque rotation */}
          <div className="min-h-12 flex-1 sm:min-h-10">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={idx}
                custom={direction}
                variants={variantsGlissementDoux}
                initial="entrer"
                animate="visible"
                exit="sortir"
              >
                <p className="text-[13px] font-medium leading-relaxed text-on-surface sm:text-sm">{conseil.t}</p>
                <p className={cn("mt-1 text-[10px] font-bold uppercase tracking-[0.14em]", hue.accent)}>{cat.label}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex shrink-0 items-center gap-3.5">
            <SegmentsProgression
              count={CONSEILS_QUOTIDIENS.length}
              idx={idx}
              progression={progression}
              onSelect={onSelect}
              tone="light"
              className="w-24 sm:w-28"
              labels={CONSEILS_QUOTIDIENS.map((c) => c.t)}
            />
            <span className="rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-bold text-on-surface-variant">
              n° {idx + 1} / {CONSEILS_QUOTIDIENS.length}
            </span>
            {/* Indice de glissement — écrans tactiles uniquement */}
            <MoveHorizontal className="pointer-coarse:block hidden size-3.5 text-muted-foreground/60" aria-hidden />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
  SIDEBAR — les plus lus (HoverCard), séries, alerte 8h00
════════════════════════════════════════════════════════════════════ */

const PlusLus = () => {
  const top = [...ARTICLES].sort((a, b) => b.vus - a.vus).slice(0, 5)

  return (
    <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-soft">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        <Flame className="size-3.5 text-brand-orange" />
        Les plus lus
      </p>
      <ol className="mt-4 space-y-1">
        {top.map((a, i) => {
          const cat = catOf(a.cat)
          const hue = HUES[cat.hue]
          return (
            <HoverCard key={a.slug} openDelay={200}>
              <HoverCardTrigger asChild>
                <li>
                  <Link to={`/conseils/${a.slug}`} className="group flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-container-low">
                    <span className="font-heading text-lg font-black leading-none text-brand-navy/15 transition-colors group-hover:text-brand-orange/40">
                      0{i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-on-surface transition-colors group-hover:text-brand-orange">
                        {a.titre}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                        <span className={cn("size-1.5 rounded-full", hue.dot)} />
                        {cat.label} · {fmtVus(a.vus)} lectures
                      </p>
                    </div>
                  </Link>
                </li>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-72">
                <p className="font-heading text-sm font-bold text-brand-navy">{a.titre}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.extrait}</p>
                <p className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                  <Clock className="size-3 text-brand-orange" />
                  {a.lecture} min · {dateLabel(a.jours)}
                </p>
              </HoverCardContent>
            </HoverCard>
          )
        })}
      </ol>
    </div>
  )
}

const Series = () => (
  <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-soft">
    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      <BookOpen className="size-3.5 text-brand-orange" />
      Séries à suivre
    </p>
    <div className="mt-4 space-y-2.5">
      {SERIES.map((s) => {
        const hue = HUES[s.hue]
        return (
          <Link
            key={s.titre}
            to="/conseils"
            className="group block rounded-lg border border-outline-variant/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-navy/30 hover:shadow-soft"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-bold text-brand-navy transition-colors group-hover:text-brand-orange">{s.titre}</p>
              <ArrowRight className="size-3.5 shrink-0 text-outline-variant transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-orange" />
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-container">
                <div className={cn("h-full rounded-full", hue.solid)} style={{ width: `${(s.lus / s.total) * 100}%` }} />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">{s.lus}/{s.total}</span>
            </div>
          </Link>
        )
      })}
    </div>
  </div>
)

const MiniAlerte = () => (
  <div className="relative hidden lg:flex overflow-hidden rounded-xl bg-brand-navy p-5 text-white">
    <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
    <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand-orange/20 blur-3xl" aria-hidden />
    <div className="relative">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">
        <Bell className="size-3" />
        Le brief quotidien
      </span>
      <p className="mt-3 font-heading text-lg font-extrabold leading-snug">
        1 conseil + vos offres, chaque matin à <span className="text-brand-orange">8h00</span>.
      </p>
      <CtaLink to="/inscription" size="md" icon={Bell} animateIcon className="mt-4 w-full">
        Créer mon alerte
      </CtaLink>
      <div className="mt-3.5 border-t border-white/10 pt-3.5">
        <ReassuranceList
          items={["Gratuit pour toujours", "1 email par jour", "Désinscription en 1 clic"]}
          tone="dark"
          className="gap-x-4 gap-y-1.5"
        />
      </div>
    </div>
  </div>
)

/* ════════════════════════════════════════════════════════════════════
  BIBLIOTHÈQUE — filtres par thème + recherche + tri + pagination
════════════════════════════════════════════════════════════════════ */

const CONFIG_FILTRES = {
  scalars: [
    { key: "cat", param: "cat", defaut: "tous" },
    { key: "sort", param: "tri", defaut: "recents" },
    { key: "query", param: "q", defaut: "" },
  ],
}

const PAR_PAGE = 9

/* Numéros de pages affichés, avec ellipses au-delà de 7 pages */
const pagesAvecEllipses = (page, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const ens = new Set([1, totalPages, page - 1, page, page + 1])
  if (page <= 3) [2, 3, 4].forEach((p) => ens.add(p))
  if (page >= totalPages - 2) [totalPages - 1, totalPages - 2, totalPages - 3].forEach((p) => ens.add(p))
  const liste = [...ens].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const avec = []
  let prec = 0
  for (const p of liste) {
    if (p - prec > 1) avec.push("…")
    avec.push(p)
    prec = p
  }
  return avec
}

const Pagination = ({ page, totalPages, depart, nbVisibles, total, onChange }) => {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination des conseils" className="mt-10 flex flex-col items-center gap-2.5">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Page précédente"
          className="grid size-9 place-items-center rounded-lg border border-outline-variant/60 bg-white text-on-surface-variant shadow-soft transition-all duration-200 enabled:hover:-translate-x-0.5 enabled:hover:border-brand-navy/40 enabled:hover:text-brand-navy enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        {pagesAvecEllipses(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`points-${i}`} aria-hidden className="px-0.5 text-sm font-bold text-muted-foreground/60">…</span>
          ) : (
            <button
              type="button"
              key={p}
              onClick={() => onChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "size-9 rounded-lg text-sm font-bold transition-all duration-200",
                p === page
                  ? "bg-brand-navy text-white shadow-hover"
                  : "border border-outline-variant/60 bg-white text-on-surface-variant shadow-soft hover:border-brand-navy/40 hover:text-brand-navy active:scale-95"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Page suivante"
          className="grid size-9 place-items-center rounded-lg border border-outline-variant/60 bg-white text-on-surface-variant shadow-soft transition-all duration-200 enabled:hover:translate-x-0.5 enabled:hover:border-brand-navy/40 enabled:hover:text-brand-navy enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Conseils <strong className="font-heading font-bold text-brand-navy">{depart + 1}–{depart + nbVisibles}</strong>{" "}
        sur <strong className="font-heading font-bold text-brand-navy">{total}</strong> · page {page}/{totalPages}
      </p>
    </nav>
  )
}

const GrilleArticles = () => {
  const { valeurs, setScalar, reset } = useUrlFilters(CONFIG_FILTRES)

  const cat = valeurs.cat === "tous" || CATEGORIES.some((c) => c.code === valeurs.cat)
    ? valeurs.cat
    : "tous"
  const sort = ["recents", "populaires", "courts"].includes(valeurs.sort) ? valeurs.sort : "recents"

  const setCat = (code) => setScalar("cat", code)
  const setSort = (k) => setScalar("sort", k)

  /* Recherche : champ local réactif → URL debouncée */
  const [queryLocale, setQueryLocale] = useState(valeurs.query)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setQueryLocale(valeurs.query) }, [valeurs.query])
  useEffect(() => {
    if (queryLocale === valeurs.query) return
    const t = setTimeout(() => setScalar("query", queryLocale), 350)
    return () => clearTimeout(t)
  }, [queryLocale, valeurs.query, setScalar])

  const activeCount = (cat !== "tous" ? 1 : 0) + (sort !== "recents" ? 1 : 0)
  const resetFilters = () => {
    reset() + setQueryLocale("")
  }

  const [drawerOpen, setDrawerOpen] = useState(false)

  const chipsDefs = useMemo(() => [
    { code: "tous", label: "Tous", icon: null, count: ARTICLES.length },
    ...CATEGORIES.map((c) => ({ ...c, count: ARTICLES.filter((a) => a.cat === c.code).length })),
  ], [])

  const filtered = useMemo(() => {
    const q = queryLocale.trim().toLowerCase()
    let list = ARTICLES.filter((a) =>
      (cat === "tous" || a.cat === cat) &&
      (!q || a.titre.toLowerCase().includes(q) || a.extrait.toLowerCase().includes(q))
    )
    if (sort === "recents") list = [...list].sort((a, b) => a.jours - b.jours)
    if (sort === "populaires") list = [...list].sort((a, b) => b.vus - a.vus)
    if (sort === "courts") list = [...list].sort((a, b) => a.lecture - b.lecture)
    return list
  }, [cat, queryLocale, sort])

  /* ── Pagination — retour page 1 dès qu'un filtre ou la recherche change ── */
  const [page, setPage] = useState(1)
  const grilleRef = useRef(null)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1) }, [cat, sort, queryLocale])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAR_PAGE))
  const pageCourante = Math.min(page, totalPages)
  const depart = (pageCourante - 1) * PAR_PAGE
  const visibles = filtered.slice(depart, depart + PAR_PAGE)

  const changerPage = (p) => {
    if (p < 1 || p > totalPages || p === pageCourante) return
    setPage(p)
    grilleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      {/* En-tête de la bibliothèque */}
      <section id="bibliotheque" className="scroll-mt-28 bg-background pt-16 md:pt-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="La bibliothèque"
            title={<>Des conseils <span className="text-brand-orange">actionnables</span>, pas de la théorie.</>}
            sub="Écrits par nos analystes à partir des offres réellement collectées. Lisez, appliquez, postulez."
          />
        </div>
      </section>

      {/* ═══════════ Barre de filtres sticky ═══════════ */}
      <StickyFilterBar>
        {/* Desktop */}
        <div className="hidden flex-col gap-3 lg:flex">
          {/* 9 chips > 7 → 6 visibles + popover « +3 autres » */}
          <ChipsFiltres chips={chipsDefs} actif={cat} onSelect={setCat} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={queryLocale}
                onChange={(e) => setQueryLocale(e.target.value)}
                placeholder="Rechercher un conseil…"
                aria-label="Rechercher un conseil"
                className="h-9 w-full rounded-lg border border-outline-variant/60 bg-white pl-9 pr-9 text-[13px] outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand-navy/50 focus:ring-2 focus:ring-brand-navy/10"
              />
              {queryLocale && (
                <button
                  onClick={() => setQueryLocale("")}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-brand-navy"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 sm:ml-auto">
              <span className="text-xs text-muted-foreground">
                <strong className="font-heading text-sm font-bold text-brand-navy">{filtered.length}</strong> conseil{filtered.length > 1 ? "s" : ""}
              </span>
              <div className="flex rounded-lg border border-outline-variant/60 bg-white p-0.5 shadow-soft">
                {[
                  { k: "recents", l: "Récents", I: Clock },
                  { k: "populaires", l: "Populaires", I: Flame },
                  { k: "courts", l: "Courts", I: Zap },
                ].map(({ k, l, I }) => (
                  <button
                    key={k}
                    onClick={() => setSort(k)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all duration-200",
                      sort === k ? "bg-brand-navy text-white shadow-soft" : "text-muted-foreground hover:text-brand-navy"
                    )}
                  >
                    <I className="size-3.5" />
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile — recherche + bouton drawer */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={queryLocale}
              onChange={(e) => setQueryLocale(e.target.value)}
              placeholder="Rechercher…"
              aria-label="Rechercher un conseil"
              className="h-10 w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest pl-9 pr-9 text-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand-navy/50 focus:ring-2 focus:ring-brand-navy/10"
            />
            {queryLocale && (
              <button
                onClick={() => setQueryLocale("")}
                aria-label="Effacer la recherche"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-brand-navy"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-sm font-bold transition-all",
              activeCount > 0
                ? "border-brand-navy bg-brand-navy text-white shadow-soft"
                : "border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant"
            )}
          >
            <SlidersHorizontal className="size-4" />
            Filtres
            {activeCount > 0 && (
              <span className="grid size-4.5 place-items-center rounded-full bg-brand-orange text-[10px] font-black text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </StickyFilterBar>

      {/* ═══════════ Drawer mobile ═══════════ */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[88vh]">
          <DrawerHeader className="border-b border-outline-variant/40 px-5 pb-4 pt-2">
            <DrawerTitle className="font-heading text-base font-bold text-brand-navy">Filtres</DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground">
              {filtered.length} conseil{filtered.length > 1 ? "s" : ""} correspondant{filtered.length > 1 ? "s" : ""}. Bibliothèque mise à jour chaque mardi
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterGroup title="Thème" icon={Lightbulb}>
              <div className="flex flex-wrap gap-2 px-1 pt-1">
                {chipsDefs.map((c) => (
                  <ChipFiltre key={c.code} {...c} actif={cat} onSelect={setCat} />
                ))}
              </div>
            </FilterGroup>

            <div className="mt-6 border-t border-outline-variant/40 pt-5">
              <FilterGroup title="Trier par" icon={ArrowUpDown}>
                <div className="grid grid-cols-2 gap-2 px-1">
                  {[
                    { k: "recents", l: "Plus récents" },
                    { k: "populaires", l: "Plus lus" },
                    { k: "courts", l: "Lecture courte" },
                  ].map((s) => (
                    <button
                      key={s.k}
                      onClick={() => setSort(s.k)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-xs font-bold transition-all",
                        sort === s.k
                          ? "border-brand-navy bg-brand-navy text-white shadow-soft"
                          : "border-outline-variant/60 bg-white text-on-surface-variant hover:border-brand-navy/40 hover:text-brand-navy"
                      )}
                    >
                      {s.l}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            </div>
          </div>

          <DrawerFooter className="border-t border-outline-variant/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="text-[13px] font-bold text-muted-foreground transition-colors hover:text-brand-navy"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-lg bg-brand-orange py-3 text-sm font-bold text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]"
              >
                Voir {filtered.length} conseil{filtered.length > 1 ? "s" : ""}
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ═══════════ Grille + sidebar ═══════════ */}
      <section ref={grilleRef} className="scroll-mt-28 bg-background py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-dashed border-outline-variant/60 bg-white p-12 text-center"
                >
                  <SearchX className="mx-auto size-10 text-muted-foreground/50" />
                  <h3 className="mt-4 font-heading text-lg font-bold text-brand-navy">Aucun conseil trouvé</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Essayez « CV », « entretien », « salaire »…</p>
                  <button
                    onClick={() => { setQueryLocale(""); setCat("tous") }}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand-navy/20 px-5 py-2.5 text-sm font-bold text-brand-navy transition-all hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                  >
                    Tout réafficher
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {visibles.map((a, i) => (
                        <CarteArticle
                          key={a.slug}
                          a={a}
                          index={i}
                          large={pageCourante === 1 && i === 0 && cat === "tous" && !queryLocale.trim()}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  <Pagination
                    page={pageCourante}
                    totalPages={totalPages}
                    depart={depart}
                    nbVisibles={visibles.length}
                    total={filtered.length}
                    onChange={changerPage}
                  />
                </>
              )}

              <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand-orange" />
                Nouveau conseil chaque mardi à 6h02 · écrit à partir des offres collectées la veille
              </p>
            </div>

            <aside className="flex flex-col gap-6 self-start lg:sticky lg:top-32">
              <PlusLus />
              <Series />
              <MiniAlerte />
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════
  BANDE DATA — les conseils naissent de la collecte
════════════════════════════════════════════════════════════════════ */

const BandeDonnees = () => (
  <section className="bg-surface-container-lowest pb-16 md:pb-20">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-xl bg-brand-navy px-6 py-10 sm:px-10 lg:py-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-24 size-105 rounded-full bg-brand-orange/15 blur-3xl" aria-hidden />
        <TrendingUp className="pointer-events-none absolute -bottom-10 -right-6 size-56 rotate-12 text-white/5" strokeWidth={1} aria-hidden />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              <TrendingUp className="size-3" />
              Nourri par la collecte
            </span>
            <h2 className="mt-4 font-heading text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
              Nos conseils ne sortent pas de nulle part.
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
              Chaque matin, nous analysons les offres collectées sur 4 sources : intitulés qui
              reviennent, compétences demandées, entreprises qui embauchent. C'est cette donnée
              qui nourrit nos conseils, pas l'inverse.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { v: 47, l: "offres analysées / jour" },
              { v: 4, l: "sources scannées" },
              { v: 13, l: "filières observées" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-white/10 bg-white/5 px-3 py-4 text-center">
                <p className="font-heading text-3xl font-black text-brand-orange"><CountUp to={s.v} /></p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">Curieux de voir la machine tourner ?</p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <CtaLink to="/comment-ca-marche" size="md" iconRight={ArrowRight}>Voir le fonctionnement</CtaLink>
            <CtaLink to="/inscription" size="md" icon={Bell} animateIcon>Recevoir le brief</CtaLink>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
  PAGE
════════════════════════════════════════════════════════════════════ */

const Conseils = () => (
  <>
    <Seo {...conseilsSeo({ total: ARTICLES.length, categories: CATEGORIES, featuredArticles: ARTICLES })} />
    <main>
      <HeroConseils />
      <ConseilDuJour />
      <GrilleArticles />
      <BandeDonnees />
    </main>
  </>
)

export default Conseils