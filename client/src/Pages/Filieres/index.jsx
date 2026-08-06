import { useEffect, useMemo, useState, Fragment } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowDownAZ, ArrowDownWideNarrow, ArrowRight, Bell,
  CheckCircle2, ChevronRight, Clock,
  LayoutGrid, Mail, MousePointerClick, Radar, Search, SearchX,
  ShieldCheck, X,
} from "lucide-react"
import { FaLinkedin } from "react-icons/fa6"
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card"
import Seo from "@/components/seo/Seo"
import { cn } from "@/lib/utils"
import { getImgSource } from "@/utils/utilsSource"
import { filieresSeo } from "@/lib/seo"
import { CountUp, CountdownEnvoi, Ticker, FiliereCard, CtaLink } from "@/components/shared"
import { FILIERES_META as FILIERES } from "@/lib/referentiels"
import { useUrlFilters } from "@/hooks/use-url-filters"

/* ════════════════════════════════════════════════════════════════════
  DONNÉES — à brancher sur l'API (tables filieres + offres, v2.0)
════════════════════════════════════════════════════════════════════ */
const TOP3 = ["tech-dev", "marketing-com", "commercial-vente"]

const SOURCES_STATUS = [
  { nom: "EmploiDakar CI", short: "ED", bg: "#0F2D4D", offres: 9, fin: "06:02", duree: "38 s" },
  { nom: "GoAfrica", short: "GA", bg: "#0F766E", offres: 7, fin: "06:03", duree: "24 s" },
  { nom: "Novojob", short: "NJ", bg: "#B45309", offres: 8, fin: "06:04", duree: "31 s" },
  { nom: "LinkedIn", short: "in", bg: "#0A66C2", offres: 5, fin: "06:06", duree: "1 min 42", linkedin: true },
]

const TICKER = [
  { titre: "Développeur Full-Stack React/Node", entreprise: "Orange CI", source: "LinkedIn", dot: "bg-sky-500" },
  { titre: "Chargé de Communication Digitale", entreprise: "CFAO Retail", source: "LinkedIn", dot: "bg-fuchsia-500" },
  { titre: "Comptable Senior", entreprise: "NSIA Banque", source: "Novojob", dot: "bg-emerald-500" },
  { titre: "Agent de Transit", entreprise: "AGL CI", source: "Novojob", dot: "bg-cyan-500" },
  { titre: "Infirmier(ère) Diplômé(e) d'État", entreprise: "CHU de Cocody", source: "EmploiDakar CI", dot: "bg-rose-500" },
  { titre: "Conducteur de Travaux", entreprise: "SARI", source: "GoAfrica", dot: "bg-amber-500" },
  { titre: "Business Developer", entreprise: "SAMA Money", source: "GoAfrica", dot: "bg-orange-500" },
  { titre: "Chargé de Recrutement", entreprise: "KPMG CI", source: "LinkedIn", dot: "bg-violet-500" },
]

/* ════════════════════════════════════════════════════════════════════
  HERO — ouverture sur la collecte du jour (le cœur du produit)
════════════════════════════════════════════════════════════════════ */
const CollectePanel = () => {
  const total = SOURCES_STATUS.reduce((s, x) => s + x.offres, 0)
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
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ delay: 1, opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute -top-4 right-6 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white px-3.5 py-1.5 text-[11px] font-bold text-emerald-600 shadow-hover"
      >
        <ShieldCheck className="size-3" />
        0 doublon
      </motion.span>

      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/40 bg-white shadow-[0_24px_48px_-16px_rgba(15,45,77,0.22)]">
        <div className="flex items-center gap-3 border-b border-outline-variant/40 bg-surface-container-low/60 px-5 py-4">
          <span className="relative flex size-2.5 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-sm font-bold text-brand-navy">Collecte terminée</p>
            <p className="text-[11px] text-muted-foreground">Aujourd'hui · 06:02 · 4 sources scannées</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-navy px-2.5 py-1 text-[10px] font-bold text-white">
            <Clock className="size-3" />
            {total} offres
          </span>
        </div>

        <ul className="divide-y divide-outline-variant/30 px-3">
          {SOURCES_STATUS.map((s, i) => (
            <HoverCard key={s.nom} openDelay={150}>
              <HoverCardTrigger asChild>
                <motion.li
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.12, ease: "easeOut" }}
                  className="flex cursor-default items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface-container-low/60"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md font-heading text-[10px] font-extrabold text-white">
                    {s.linkedin
                      ? <FaLinkedin className="size-3.5" style={{ background: s.bg }} />
                      : <img src={getImgSource(s.nom)} alt={s.nom} className="h-full size-8 object-contain" />
                    }
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-on-surface">{s.nom}</p>
                    <p className="text-[11px] text-muted-foreground">Passage à {s.fin} · {s.duree}</p>
                  </div>
                  <span className="shrink-0 font-heading text-sm font-extrabold text-brand-navy">+{s.offres}</span>
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                </motion.li>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-60">
                <p className="font-heading text-sm font-semibold">{s.nom}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.offres} offres extraites ce matin en {s.duree}. Structure HTML surveillée chaque jour.
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  Source opérationnelle
                </p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </ul>

        <CountdownEnvoi className="border-t border-outline-variant/40 bg-surface-container-low/40 px-5 py-4" />
      </div>
    </motion.div>
  )
}

const HeroFilieres = () => (
  <section className="relative overflow-hidden hero-gradient">
    <div className="absolute inset-0 bg-pattern opacity-50" aria-hidden />
    <div className="absolute -top-32 right-[-10%] size-140 rounded-full bg-brand-orange/8 blur-3xl" aria-hidden />
    <div className="absolute -bottom-40 -left-40 size-120 rounded-full bg-brand-navy/5 blur-3xl" aria-hidden />

    <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-10 md:px-12 md:pb-16 md:pt-14">
      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
        aria-label="Fil d'Ariane"
      >
        <Link to="/" className="transition-colors hover:text-brand-navy">Accueil</Link>
        <ChevronRight className="size-3" />
        <span className="font-semibold text-brand-navy">Filières</span>
      </motion.nav>

      <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="flex flex-col items-start gap-5"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="flex flex-wrap items-center gap-2.5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-on-surface-variant backdrop-blur-sm">
              <LayoutGrid className="size-3 text-brand-orange" />
              13 filières couvertes
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-bold text-emerald-700">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              Collecte 06:02 terminée
            </span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="font-heading text-4xl font-black leading-[1.04] tracking-tight text-brand-navy sm:text-5xl xl:text-6xl"
          >
            13 filières. Un récap.
            <span className="mt-2 block text-brand-orange">Chaque matin à 8h00.</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="max-w-xl md:text-lg leading-relaxed text-on-surface-variant"
          >
            JobAlert CI scanne chaque jour les 4 grandes plateformes d'emploi ivoiriennes et vous
            envoie le meilleur de vos filières sans recherche, sans doublon, sans connexion.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-1 flex flex-col gap-3 sm:flex-row"
          >
            <CtaLink to="/inscription" icon={Bell} animateIcon>
              Créer mon alerte 8h00
            </CtaLink>
            <CtaLink to="/comment-ca-marche" variant="secondary" iconRight={ArrowRight}>
              Comment ça marche
            </CtaLink>
          </motion.div>

          <motion.dl
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            {[
              { valeur: 47, label: "nouvelles ce matin" },
              { valeur: 181, label: "offres actives" },
              { valeur: 10550, label: "abonnés servis" },
            ].map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-3xl font-black text-brand-navy">
                  <CountUp to={s.valeur} />
                </dd>
                <dd className="text-xs font-medium text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <CollectePanel />
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
  LA MÉCANIQUE — flux en 3 étapes (lien vers HowItWorks)
════════════════════════════════════════════════════════════════════ */

const ETAPES = [
  { icon: MousePointerClick, titre: "Je choisis 1 à 3 filières", texte: "À l'inscription, en 2 minutes. Aucun mot de passe requis." },
  { icon: Radar, titre: "On scanne 4 sources chaque nuit", texte: "EmploiDakar CI, GoAfrica, Novojob et LinkedIn, dédoublonnées par hash." },
  { icon: Mail, titre: "Je reçois mon récap à 8h00", texte: "Les offres de mes filières, rien que ça. Désinscription en 1 clic." },
]

const BandeMechanique = () => (
  <section className="border-y border-outline-variant/30 bg-surface-container-low/60 py-12 md:py-14">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex max-w-7xl flex-col mb-12 px-6 md:px-12"
    >
      <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
        <span className="h-px w-6 bg-brand-orange" aria-hidden />
        La mécanique
      </p>
      <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-brand-navy">
        Réglée comme une horloge.
      </h2>
    </motion.div>

    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 md:px-12 items-center">
      <ol className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-3">
        {ETAPES.map((e, i) => (
          <Fragment key={e.titre}>
            {i > 0 && (
              <ChevronRight className="hidden size-5 shrink-0 self-center text-outline-variant sm:block" aria-hidden />
            )}
            <motion.li
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 items-start gap-3.5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-brand-orange/40 bg-white font-heading text-sm font-extrabold text-brand-orange shadow-soft">
                0{i + 1}
              </span>
              <div>
                <p className="flex items-center gap-2 font-heading text-sm font-bold text-brand-navy">
                  <e.icon className="size-4 text-brand-orange" />
                  {e.titre}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{e.texte}</p>
              </div>
            </motion.li>
          </Fragment>
        ))}
      </ol>

      <Link
        to="/comment-ca-marche"
        className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-brand-navy/20 bg-white px-5 py-2.5 text-sm font-bold text-brand-navy shadow-soft transition-all duration-300 hover:border-brand-navy hover:bg-brand-navy hover:text-white lg:self-auto"
      >
        Voir le détail
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
  PAGE
════════════════════════════════════════════════════════════════════ */

const CONFIG_FILTRES = {
  scalars: [
    { key: "sort", param: "tri", defaut: "volume" },
    { key: "query", param: "q", defaut: "" },
  ],
}

const Filieres = () => {
  const { valeurs, setScalar } = useUrlFilters(CONFIG_FILTRES)
  const sort = ["volume", "az"].includes(valeurs.sort) ? valeurs.sort : "volume"
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

  const filtered = useMemo(() => {
    const q = queryLocale.trim().toLowerCase()
    let list = FILIERES.filter(
      (f) =>
        !q ||
        f.label.toLowerCase().includes(q) ||
        f.tagline.toLowerCase().includes(q) ||
        f.keywords.some((k) => k.includes(q))
    )
    if (sort === "volume") list = [...list].sort((a, b) => b.actives - a.actives)
    else list = [...list].sort((a, b) => a.label.localeCompare(b.label, "fr"))
    return list
  }, [queryLocale, sort])

  const q = queryLocale.trim()
  const large = filtered.filter((f) => TOP3.includes(f.code) && !q)
  const compact = filtered.filter((f) => !large.includes(f))

  return (
    <>
      <Seo {...filieresSeo(FILIERES)} />
      <main>
        <HeroFilieres />
        <Ticker
          variant="light"
          duration={48}
          items={TICKER.map((t, i) => ({ key: `t-${i}`, ...t }))}
        />

        {/* ═══════════ Le référentiel ═══════════ */}
        <section className="bg-background py-14 md:py-18">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                  <span className="h-px w-6 bg-brand-orange" aria-hidden />
                  Référentiel métier
                </p>
                <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
                  Choisissez votre <span className="text-brand-orange">terrain de chasse</span>.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  1 à 3 filières à l'inscription, le matching des offres est automatique,
                  alimenté chaque matin par les mots-clés gérés depuis l'administration.
                </p>
              </motion.div>
            </div>

            {/* Barre de recherche + tri */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={queryLocale}
                  onChange={(e) => setQueryLocale(e.target.value)}
                  placeholder="Rechercher une filière ou un métier…"
                  aria-label="Rechercher une filière"
                  className="h-10 w-full rounded-lg border border-outline-variant/60 bg-white pl-9 pr-9 text-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand-navy/50 focus:ring-2 focus:ring-brand-navy/10"
                />
                {queryLocale && (
                  <button
                    onClick={() => setQueryLocale("")}
                    aria-label="Effacer la recherche"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-brand-navy"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 sm:ml-auto">
                <span className="text-xs text-muted-foreground">
                  <strong className="font-heading text-sm font-bold text-brand-navy">{filtered.length}</strong> filière{filtered.length > 1 ? "s" : ""}
                </span>
                <div className="flex rounded-lg border border-outline-variant/60 bg-white p-0.5 shadow-soft">
                  {[
                    { k: "volume", l: "Volume", I: ArrowDownWideNarrow },
                    { k: "az", l: "A → Z", I: ArrowDownAZ },
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
            </motion.div>

            {/* Grille bento */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <AnimatePresence mode="popLayout">
                {large.map((f, i) => <FiliereCard key={f.code} f={f} index={i} variant="large" />)}
                {compact.map((f, i) => <FiliereCard key={f.code} f={f} index={i} variant="compact" />)}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-xl border border-dashed border-outline-variant/60 bg-white p-12 text-center"
              >
                <SearchX className="mx-auto size-10 text-muted-foreground/50" />
                <h3 className="mt-4 font-heading text-lg font-bold text-brand-navy">Aucune filière trouvée</h3>
                <p className="mt-1 text-sm text-muted-foreground">Essayez « tech », « santé », « transit »…</p>
                <button
                  onClick={() => setQueryLocale("")}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand-navy/20 px-5 py-2.5 text-sm font-bold text-brand-navy transition-all hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                >
                  Effacer la recherche
                </button>
              </motion.div>
            )}
          </div>
        </section>

        <BandeMechanique />
      </main>
    </>
  )
}

export default Filieres
