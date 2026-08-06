
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowRight, BadgeCheck, Bell, Check, ChevronLeft, ChevronRight, Clock, Eye,
  Lightbulb, Link2, Quote, SearchX, Sparkles,
} from "lucide-react"
import { FaLinkedin } from "react-icons/fa6"
import { cn } from "@/lib/utils"
import Seo from "@/components/seo/Seo"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  BadgeNouveau, BarreProgression, CarteArticle, CountUp, CtaLink, SectionHeading,
  Sommaire, SommaireFlottant,
} from "@/components/shared"
import { HUES } from "@/lib/hues"
import { dateLabel } from "@/lib/dates"
import { ARTICLES, catOf, fmtVus, getContenu } from "@/data/conseils"
import { conseilSeo } from "@/lib/seo"

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

/* ════════════════════════════════════════════════════════════════════
EN-TÊTE — l'article s'ouvre sur son identité + le brief « à retenir »
════════════════════════════════════════════════════════════════════ */
const CarteBrief = ({ a, cat, hue, contenu }) => {
  const Icon = cat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md min-w-0 md:max-w-none"
    >
      <div className={cn("absolute -inset-8 rounded-full blur-3xl", hue.glow)} aria-hidden />

      {/* Badges flottants */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
        transition={{ delay: 0.9, opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute -top-4 left-5 z-20 inline-flex -rotate-3 items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg sm:-left-4"
      >
        <Clock className="size-3" />
        {a.lecture} min de lecture
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.05, duration: 0.4 }}
        className="absolute -top-3 right-6 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white px-3 py-1.5 text-[11px] font-bold text-brand-navy shadow-soft"
      >
        <Eye className="size-3 text-brand-orange" />
        {fmtVus(a.vus)} lectures
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ delay: 1.2, opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }}
        className="absolute -bottom-4 right-8 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white px-3.5 py-1.5 text-[11px] font-bold text-emerald-600 shadow-hover"
      >
        <Sparkles className="size-3" />
        Nourri par la collecte
      </motion.span>

      {/* Carte navy */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-brand-navy text-white shadow-[0_24px_48px_-16px_rgba(15,45,77,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
        <div className={cn("pointer-events-none absolute -right-24 -top-24 size-80 rounded-full blur-3xl", hue.glow)} aria-hidden />
        <Icon className="pointer-events-none absolute -bottom-8 -right-4 size-48 rotate-12 text-white/5" strokeWidth={1} aria-hidden />

        <div className="relative flex items-center gap-3 border-b border-white/10 px-6 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-orange font-heading text-[11px] font-black text-white">JA</span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold">Le brief JobAlert CI</p>
            <p className="truncate text-[11px] text-white/60">{cat.label} · {dateLabel(a.jours)}</p>
          </div>
          <Icon className="size-4 shrink-0 text-white/40" />
        </div>

        <div className="relative flex flex-1 flex-col px-6 py-6">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
            <Lightbulb className="size-3.5" />
            À retenir en 30 secondes
          </p>
          <ul className="mt-3.5 space-y-2.5">
            {contenu.aRetenir.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-white/80">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-orange/20">
                  <Check className="size-2.5 text-brand-orange" strokeWidth={3.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <CtaLink to="/inscription" size="md" icon={Bell} animateIcon className="w-full">
              Recevoir ce thème à 8h00
            </CtaLink>
            <p className="mt-3 text-center text-[10px] text-white/50">
              Gratuit · 1 email par jour · désinscription en 1 clic
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const EnTeteArticle = ({ a, cat, hue, contenu, copied, onCopy }) => {
  const Icon = cat.icon
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="absolute inset-0 bg-pattern opacity-50" aria-hidden />
      <div className={cn("absolute -top-32 right-[-10%] size-140 rounded-full blur-3xl", hue.glow)} aria-hidden />
      <div className="absolute -bottom-40 -left-40 size-120 rounded-full bg-brand-navy/5 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-8 md:px-12 md:pb-16 md:pt-10">
        {/* Fil d'Ariane */}
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground"
          aria-label="Fil d'Ariane"
        >
          <Link to="/" className="transition-colors hover:text-brand-navy">Accueil</Link>
          <ChevronRight className="size-3" />
          <Link to="/conseils" className="transition-colors hover:text-brand-navy">Conseils</Link>
          <ChevronRight className="size-3" />
          <Link to={`/conseils?cat=${cat.code}`} className={cn("text-white rounded-full px-2", hue.solid)}>{cat.label}</Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-brand-navy truncate">{a.titre}</span>
        </motion.nav>

        <div className="mt-8 grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Colonne gauche — l'article */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-start gap-5">
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/conseils"
                className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-200 hover:-translate-y-0.5", hue.tile)}
              >
                <Icon className="size-3.5" />
                {cat.label}
              </Link>
              {a.jours === 0 && <BadgeNouveau />}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold text-on-surface-variant">
                <Clock className="size-3 text-brand-orange" />
                {a.lecture} min de lecture
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-3xl font-black leading-[1.12] tracking-tight text-brand-navy sm:text-4xl xl:text-5xl"
            >
              {a.titre}
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-2xl md:text-lg leading-relaxed text-on-surface-variant">
              {a.extrait}
            </motion.p>

            {/* Auteur + méta */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-navy font-heading text-[11px] font-black text-white">RC</span>
                <div>
                  <p className="flex items-center gap-1.5 text-[13px] font-bold text-brand-navy">
                    La rédaction
                    <BadgeCheck className="size-3.5 text-brand-orange" />
                  </p>
                  <p className="text-[11px] text-muted-foreground">Analystes marché · JobAlert CI</p>
                </div>
              </div>
              <span className="hidden h-8 w-px bg-outline-variant/50 sm:block" aria-hidden />
              <span className="text-xs font-semibold text-muted-foreground">{dateLabel(a.jours)}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Clock className="size-3.5 text-brand-orange" />{a.lecture} min
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Eye className="size-3.5 text-brand-orange" />{fmtVus(a.vus)} lectures
              </span>
            </motion.div>

            {/* Actions */}
            <motion.div variants={fadeUp} className="mt-1 flex flex-wrap items-center gap-2.5">
              <button
                onClick={onCopy}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-bold transition-all duration-200",
                  copied
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700"
                    : "border-outline-variant/60 bg-white text-on-surface-variant hover:border-brand-navy/40 hover:text-brand-navy"
                )}
              >
                {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
                {copied ? "Lien copié" : "Copier le lien"}
              </button>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#0A66C2]/30 bg-[#0A66C2]/5 px-4 text-xs font-bold text-[#0A66C2] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0A66C2] hover:text-white"
              >
                <FaLinkedin className="size-3.5" />
                Partager
              </a>
              <CtaLink to="/inscription" size="md" icon={Bell} animateIcon className="h-10">
                Recevoir ce thème à 8h00
              </CtaLink>
            </motion.div>
          </motion.div>

          {/* Colonne droite — le brief */}
          <CarteBrief a={a} cat={cat} hue={hue} contenu={contenu} />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
CORPS — chiffres clés, sections, citation, à retenir, auteur
════════════════════════════════════════════════════════════════════ */
const ChiffresCles = ({ stats, hue }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="mt-8 grid grid-cols-3 gap-3"
  >
    {stats.map((s) => (
      <div
        key={s.l}
        className="rounded-xl border border-outline-variant/40 bg-white p-4 text-center shadow-soft"
        style={{ borderTop: `3px solid ${hue.hex}` }}
      >
        <p className="font-heading text-2xl font-black text-brand-navy sm:text-3xl">
          <CountUp to={s.v} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} />
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.l}</p>
      </div>
    ))}
  </motion.div>
)

const MemeTheme = ({ a, hue }) => {
  const voisins = ARTICLES.filter((x) => x.cat === a.cat && x.slug !== a.slug).slice(0, 3)
  if (!voisins.length) return null
  return (
    <div className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-soft">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        <Sparkles className="size-3.5 text-brand-orange" />
        Sur le même thème
      </p>
      <ul className="mt-4 space-y-1">
        {voisins.map((x) => (
          <HoverCard key={x.slug} openDelay={200}>
            <HoverCardTrigger asChild>
              <li>
                <Link to={`/conseils/${x.slug}`} className="group flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-surface-container-low">
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", hue.dot)} />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-on-surface transition-colors group-hover:text-brand-orange">
                      {x.titre}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                      {x.lecture} min · {fmtVus(x.vus)} lectures
                    </p>
                  </div>
                </Link>
              </li>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-72">
              <p className="text-xs leading-relaxed text-muted-foreground">{x.extrait}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </ul>
    </div>
  )
}

const MiniAlerte = ({ cat, hue }) => (
  <div className="relative overflow-hidden rounded-xl bg-brand-navy p-5 text-white">
    <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
    <div className={cn("pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-3xl", hue.glow)} aria-hidden />
    <div className="relative">
      <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]", hue.solid)}>
        <Bell className="size-3" />
        Alerte {cat.label}
      </span>
      <p className="mt-3 font-heading text-lg font-extrabold leading-snug">
        Ces conseils + vos offres, chaque matin à <span className="text-brand-orange">8h00</span>.
      </p>
      <CtaLink to="/inscription" size="md" icon={Bell} animateIcon className="mt-4 w-full">
        Créer mon alerte
      </CtaLink>
      <p className="mt-3 text-center text-[10px] text-white/50">Gratuit · 1 email par jour · 1 clic pour partir</p>
    </div>
  </div>
)

const CorpsArticle = ({ a, cat, hue, contenu }) => {
  const idx = ARTICLES.findIndex((x) => x.slug === a.slug)
  const precedent = idx > 0 ? ARTICLES[idx - 1] : null
  const suivant = idx < ARTICLES.length - 1 ? ARTICLES[idx + 1] : null

  return (
    <section className="border-b border-outline-variant/30 bg-background py-14 md:py-18">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ═══ L'article ═══ */}
        <article>
          {/* Intro avec lettrine */}
          <p className="text-lg leading-relaxed text-on-surface first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-black first-letter:leading-[0.85] first-letter:text-brand-orange">
            {contenu.intro}
          </p>

          <ChiffresCles stats={contenu.stats} hue={hue} />

          {/* Sections — ancrées pour le sommaire */}
          <div className="mt-12 space-y-11">
            {contenu.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="flex items-baseline gap-3 font-heading text-2xl font-extrabold tracking-tight text-brand-navy">
                  <span className="text-sm font-black text-brand-orange">0{i + 1}</span>
                  {s.titre}
                </h2>
                {s.paragraphes?.map((p) => (
                  <p key={p} className="mt-4 leading-relaxed text-on-surface-variant">{p}</p>
                ))}
                {s.points && (
                  <ul className="mt-4 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-on-surface-variant">
                        <span className="mt-1 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                          <Check className="size-2.5 text-brand-orange" strokeWidth={3.5} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Citation après la 2e section */}
                {i === 1 && contenu.citation && (
                  <blockquote className="relative mt-8 overflow-hidden rounded-xl bg-brand-navy p-6 text-white sm:p-7">
                    <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
                    <div className={cn("pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-3xl", hue.glow)} aria-hidden />
                    <Quote className="relative size-7 text-brand-orange" strokeWidth={1.5} aria-hidden />
                    <p className="relative mt-3 font-heading text-lg font-semibold leading-relaxed">
                      « {contenu.citation.texte} »
                    </p>
                    <footer className="relative mt-3 text-xs font-semibold text-white/60">
                      — {contenu.citation.auteur}
                    </footer>
                  </blockquote>
                )}
              </section>
            ))}
          </div>

          {/* À retenir */}
          <div className="mt-12 rounded-xl border-l-4 border-brand-orange bg-brand-orange/5 p-6">
            <p className="flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-brand-navy">
              <Lightbulb className="size-4 text-brand-orange" />
              À retenir
            </p>
            <ul className="mt-3.5 space-y-2.5">
              {contenu.aRetenir.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-on-surface-variant">
                  <span className="mt-1 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-brand-orange/15">
                    <Check className="size-2.5 text-brand-orange" strokeWidth={3.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Mots-clés */}
          <div className="mt-10 border-t border-outline-variant/40 pt-6">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="size-3.5 text-brand-orange" />
              Mots-clés associés
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {contenu.tags.map((t) => (
                <span key={t} className="rounded-full border border-outline-variant/60 bg-white px-3 py-1 text-xs font-medium text-on-surface-variant transition-colors hover:border-brand-navy/40 hover:text-brand-navy">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* L'auteur */}
          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-outline-variant/40 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-navy font-heading text-[13px] font-black text-white">RC</span>
            <div className="flex-1">
              <p className="flex items-center gap-1.5 font-heading text-sm font-bold text-brand-navy">
                La rédaction JobAlert CI
                <BadgeCheck className="size-4 text-brand-orange" />
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-on-surface-variant">
                Chaque conseil est écrit à partir des offres réellement collectées chaque matin
                sur nos 4 sources, jamais de théorie hors-sol.
              </p>
            </div>
            <CtaLink to="/inscription" size="md" icon={Bell} animateIcon className="shrink-0">
              Recevoir le brief
            </CtaLink>
          </div>

          {/* Conseil précédent / suivant */}
          <nav className="mt-10 grid gap-3 border-t border-outline-variant/40 pt-8 sm:grid-cols-2" aria-label="Navigation entre conseils">
            {precedent ? (
              <Link to={`/conseils/${precedent.slug}`} className="group rounded-xl border border-outline-variant/50 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/50 hover:shadow-hover">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <ChevronLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  Conseil précédent
                </span>
                <p className="mt-1.5 line-clamp-2 font-heading text-sm font-bold text-brand-navy transition-colors group-hover:text-brand-orange">
                  {precedent.titre}
                </p>
              </Link>
            ) : <span className="hidden sm:block" />}
            {suivant && (
              <Link to={`/conseils/${suivant.slug}`} className="group rounded-xl border border-outline-variant/50 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/50 hover:shadow-hover sm:text-right">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:justify-end">
                  Conseil suivant
                  <ChevronRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
                <p className="mt-1.5 line-clamp-2 font-heading text-sm font-bold text-brand-navy transition-colors group-hover:text-brand-orange">
                  {suivant.titre}
                </p>
              </Link>
            )}
          </nav>
        </article>

        {/* ═══ Sidebar sticky ═══ */}
        <aside className="flex flex-col gap-6 self-start lg:sticky lg:top-24">
          <Sommaire
            sections={contenu.sections.map((s) => ({ id: s.id, titre: s.titre }))}
            lecture={a.lecture}
            className="hidden lg:block"
          />
          <MemeTheme a={a} hue={hue} />
          <MiniAlerte cat={cat} hue={hue} />
        </aside>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
CONTINUER LA LECTURE — CarteArticle partagée avec la bibliothèque
════════════════════════════════════════════════════════════════════ */
const ContinuerLecture = ({ a, cat }) => {
  const lies = [
    ...ARTICLES.filter((x) => x.cat === a.cat && x.slug !== a.slug),
    ...ARTICLES.filter((x) => x.cat !== a.cat),
  ].slice(0, 3)
  return (
    <section className="bg-surface-container-lowest py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Continuer la lecture"
            title={<>D'autres conseils <span className="text-brand-orange">{cat.label}</span> vous attendent.</>}
          />
          <CtaLink to="/conseils" variant="outline" size="md" iconRight={ArrowRight} className="hidden md:inline-flex">
            Toute la bibliothèque
          </CtaLink>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lies.map((x, i) => <CarteArticle key={x.slug} a={x} index={i} />)}
        </div>
        <div className="mt-8 text-center md:hidden">
          <CtaLink to="/conseils" variant="outline" size="md" iconRight={ArrowRight}>
            Toute la bibliothèque
          </CtaLink>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
CONSEIL INTROUVABLE
════════════════════════════════════════════════════════════════════ */
const ConseilIntrouvable = ({ slug }) => (
  <section className="hero-gradient flex min-h-[60vh] items-center justify-center px-6 py-20">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-md text-center"
    >
      <span className="mx-auto flex size-16 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
        <SearchX className="size-8" strokeWidth={1.8} />
      </span>
      <h1 className="mt-5 font-heading text-3xl font-black tracking-tight text-brand-navy">
        Conseil introuvable
      </h1>
      <p className="mt-3 text-on-surface-variant">
        L'article « {slug} » n'existe pas ou a été archivé. La bibliothèque, elle, est bien à jour.
      </p>
      <div className="mt-6 flex justify-center">
        <CtaLink to="/conseils" iconRight={ArrowRight}>Voir tous les conseils</CtaLink>
      </div>
    </motion.div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
PAGE
════════════════════════════════════════════════════════════════════ */
const DetailsConseil = () => {
  const { slug } = useParams()
  const a = ARTICLES.find((x) => x.slug === slug)
  const seo = a
    ? conseilSeo({ article: a, cat: catOf(a.cat), contenu: getContenu(a) })
    : conseilSeo({ slug })

  const [copied, setCopied] = useState(false)
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href) } catch { /* contexte non sécurisé */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!a) {
    return (
      <>
        <Seo {...seo} />
        <ConseilIntrouvable slug={slug} />
      </>
    )
  }

  const cat = catOf(a.cat)
  const hue = HUES[cat.hue]
  const contenu = getContenu(a)

  return (
    <>
      <Seo {...seo} />
      <BarreProgression hex={hue.hex} />
      <main>
        <EnTeteArticle a={a} cat={cat} hue={hue} contenu={contenu} copied={copied} onCopy={copyLink} />
        <CorpsArticle a={a} cat={cat} hue={hue} contenu={contenu} />
        <ContinuerLecture a={a} cat={cat} />
        <SommaireFlottant
          sections={contenu.sections.map((s) => ({ id: s.id, titre: s.titre }))}
          lecture={a.lecture}
        />
      </main>
    </>
  )
}

export default DetailsConseil
