
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, animate, motion, useInView } from "framer-motion"
import {
  ArrowRight, Bell, CheckCircle2, ChevronRight, Clock, Fingerprint, LayoutGrid,
  Mail, Radar, ShieldCheck, Sparkles, Zap,
} from "lucide-react"
import { SiGoogle } from "@icons-pack/react-simple-icons"
import { FaLinkedin } from "react-icons/fa6"
import { cn } from "@/lib/utils"

/* ─────────────────────────── Données ─────────────────────────── */

const SOURCES = [
  { nom: "EmploiDakar CI", short: "ED", bg: "#0F2D4D" },
  { nom: "GoAfrica",       short: "GA", bg: "#0F766E" },
  { nom: "Novojob",        short: "NJ", bg: "#B45309" },
  { nom: "LinkedIn",       short: "in", bg: "#0A66C2", linkedin: true },
]

const MATCHS = [
  { kw: "développeur full-stack", filiere: "Tech & Dev", dot: "bg-sky-400" },
  { kw: "comptable senior", filiere: "Comptabilité & Finance", dot: "bg-emerald-400" },
  { kw: "infirmier diplômé d'État", filiere: "Santé & Médical", dot: "bg-rose-400" },
  { kw: "agent de transit", filiere: "Logistique & Transport", dot: "bg-cyan-400" },
]

const LOGS = [
  "06:02:14 · scraper/emploidakar_ci · 9 offres · OK",
  "06:03:02 · scraper/goafrica · 7 offres · OK",
  "06:04:47 · scraper/novojob · 8 offres · OK",
  "06:06:19 · scraper/linkedin · 5 offres · OK · délais respectés",
  "06:07:33 · dedup · hash_unique · 29 offres · 0 doublon",
  "07:15:08 · matching · 10 550 utilisateurs · filtres appliqués",
  "08:00:00 · smtp · 10 550 emails · 100 % délivrés",
]

/* ─────────────────────────── Outils ─────────────────────────── */

const CountUp = ({ to }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.3, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{value.toLocaleString("fr-FR")}</span>
}

/* Compte à rebours réel jusqu'au prochain envoi de 8h00 */
const CountdownEnvoi = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const target = new Date(now)
  target.setHours(8, 0, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  const diff = Math.max(0, target - now)
  const unites = [
    { v: Math.floor(diff / 3.6e6), l: "h" },
    { v: Math.floor((diff % 3.6e6) / 6e4), l: "min" },
    { v: Math.floor((diff % 6e4) / 1e3), l: "s" },
  ]
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-orange/15">
        <Clock className="size-5 text-brand-orange" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Prochain envoi dans</p>
        <div className="mt-1 flex items-center gap-1.5">
          {unites.map((u, i) => (
            <span key={u.l} className="flex items-center gap-1.5">
              {i > 0 && <span className="font-heading text-lg font-black text-white/30">:</span>}
              <span className="grid min-w-11 place-items-center rounded-md bg-white/10 px-2 py-1 font-heading text-xl font-extrabold tabular-nums text-white">
                {String(u.v).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-bold uppercase text-white/40">{u.l}</span>
            </span>
          ))}
        </div>
      </div>
      <span className="ml-auto hidden shrink-0 text-[11px] font-semibold text-white/40 sm:block">
        8h00 précises,<br />chaque jour
      </span>
    </div>
  )
}

/* Exemple de matching mot-clé → filière, en rotation */
const MatchCycler = () => {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MATCHS.length), 2600)
    return () => clearInterval(t)
  }, [])
  const m = MATCHS[i]
  return (
    <div className="relative h-9 overflow-hidden rounded-lg border border-white/10 bg-white/5 px-3">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-9 items-center gap-2 text-xs"
        >
          <span className="truncate font-mono text-white/60">« {m.kw} »</span>
          <ArrowRight className="size-3 shrink-0 text-brand-orange" />
          <span className="flex shrink-0 items-center gap-1.5 font-semibold text-white">
            <span className={cn("size-1.5 rounded-full", m.dot)} />
            {m.filiere}
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* Terminal : journalise le run ligne par ligne */
const TypewriterLog = () => {
  const [lineIdx, setLineIdx] = useState(0)
  const [chars, setChars] = useState(0)
  useEffect(() => {
    const line = LOGS[lineIdx]
    if (chars < line.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 16)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { setLineIdx((i) => (i + 1) % LOGS.length); setChars(0) }, 1500)
    return () => clearTimeout(t)
  }, [chars, lineIdx])
  const prev = LOGS[(lineIdx + LOGS.length - 1) % LOGS.length]
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="size-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
        <span className="size-2.5 rounded-full bg-[#28C840]" aria-hidden />
        <span className="ml-2 font-mono text-[10px] text-white/40">jobalert-ci — run du jour</span>
      </div>
      <div className="px-4 py-3.5 font-mono text-[11px] leading-relaxed">
        <p className="text-white/30">$ jobalert run --daily</p>
        <p className="mt-1 truncate text-white/35">{prev}</p>
        <p className="truncate text-emerald-300/90">
          {LOGS[lineIdx].slice(0, chars)}
          <span className="animate-pulse text-emerald-300">▍</span>
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────── La machine du matin ─────────────────────────── */

const SourcesBody = () => (
  <div>
    <ul className="grid grid-cols-2 gap-2">
      {SOURCES.map((s, i) => (
        <motion.li
          key={s.nom}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 + i * 0.12, duration: 0.35 }}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded font-heading text-[9px] font-extrabold text-white" style={{ background: s.bg }}>
            {s.linkedin ? <FaLinkedin className="size-3" /> : s.short}
          </span>
          <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-white/80">{s.nom}</span>
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
        </motion.li>
      ))}
    </ul>
    <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
      <Zap className="size-3 shrink-0 text-brand-orange" />
      <CountUp to={29} />&nbsp;offres aspirées · scrapers isolés, aucune panne en cascade
    </p>
  </div>
)

const FiltrageBody = () => (
  <div className="flex flex-col gap-2.5">
    <MatchCycler />
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/60">
        <Fingerprint className="size-3 text-brand-orange" />
        hash_unique · 7f3a…c9
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
        <ShieldCheck className="size-3" />
        0 doublon renvoyé
      </span>
    </div>
  </div>
)

const EnvoiBody = () => (
  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
    <span className="relative grid size-10 shrink-0 place-items-center rounded-lg bg-brand-orange/15">
      <SiGoogle className="size-5 text-brand-orange" />
      <motion.span
        className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-emerald-400"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <CheckCircle2 className="size-3 text-brand-navy" />
      </motion.span>
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-bold text-white">Récap du jour · 5 offres pour vous</p>
      <p className="truncate text-[11px] text-white/50">À Aminata, Konan, Fatou… et 10 547 autres abonnés</p>
    </div>
    <span className="shrink-0 font-heading text-sm font-extrabold text-brand-orange">08:00</span>
  </div>
)

const STATIONS = [
  { time: "06:02", icon: Radar, title: "Collecte", sub: "4 scrapers aspirent les dernières offres publiées.", Body: SourcesBody },
  { time: "07:15", icon: Fingerprint, title: "Filtrage & dédoublonnage", sub: "Hash unique par offre, tag de filière par mots-clés.", Body: FiltrageBody },
  { time: "08:00", icon: Mail, title: "Envoi", sub: "Un récap par abonné via SMTP — 3 tentatives en cas de panne.", Body: EnvoiBody },
]

/* Le run se rejoue en boucle : les stations s'activent l'une après l'autre */
const Pipeline = () => {
  const [step, setStep] = useState(0) // 0 → 2 : stations, 3 : run terminé
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 2800)
    return () => clearInterval(t)
  }, [])

  const progress = step === 0 ? 0.14 : step === 1 ? 0.52 : step === 2 ? 0.9 : 1

  return (
    <div className="relative">
      <AnimatePresence>
        {step === 3 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-400 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-brand-navy shadow-lg"
          >
            <CheckCircle2 className="size-3" />
            Run terminé · 100 % délivré
          </motion.span>
        )}
      </AnimatePresence>

      {/* Rail + progression */}
      <span className="absolute bottom-10 left-[25px] top-10 w-px bg-white/15" aria-hidden>
        <motion.span
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-brand-orange via-brand-orange to-emerald-400"
          animate={{ height: `${progress * 100}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>

      <ol className="flex flex-col gap-5">
        {STATIONS.map((s, i) => {
          const active = step === i
          const done = step === 3 || i < step
          return (
            <motion.li
              key={s.time}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.35 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-16"
            >
              <span className={cn(
                "absolute left-0 top-3 grid size-[52px] place-items-center rounded-xl border transition-all duration-500",
                active
                  ? "border-brand-orange bg-brand-orange text-white shadow-[0_0_24px_rgba(245,166,35,0.45)]"
                  : done
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : "border-white/15 bg-white/[0.07] text-white/60"
              )}>
                <s.icon className="size-5" />
                {active && (
                  <span className="absolute inset-0 animate-ping rounded-xl border border-brand-orange/60" aria-hidden />
                )}
              </span>

              <div className={cn(
                "rounded-xl border p-4.5 transition-all duration-500",
                active
                  ? "border-brand-orange/60 bg-brand-orange/[0.08] shadow-[0_0_32px_rgba(245,166,35,0.12)]"
                  : done
                    ? "border-emerald-400/25 bg-white/[0.07]"
                    : "border-white/10 bg-white/[0.05]"
              )}>
                <div className="flex items-center gap-2.5">
                  <span className={cn(
                    "font-heading text-sm font-extrabold transition-colors duration-500",
                    active ? "text-brand-orange" : done ? "text-emerald-300" : "text-white/50"
                  )}>
                    {s.time}
                  </span>
                  <span className="h-px flex-1 bg-white/10" aria-hidden />
                  <span className="flex items-center gap-2 font-heading text-sm font-bold text-white">
                    {s.title}
                    {done && !active && <CheckCircle2 className="size-3.5 text-emerald-400" />}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{s.sub}</p>
                <div className="mt-3.5"><s.Body /></div>
              </div>
            </motion.li>
          )
        })}
      </ol>

      <div className="mt-5"><TypewriterLog /></div>
    </div>
  )
}

/* ─────────────────────────── Hero ─────────────────────────── */

const HowItWorksHero = () => (
  <section className="relative overflow-hidden bg-brand-navy text-white">
    <div
      className="absolute inset-0 opacity-[0.35]"
      style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
      aria-hidden
    />
    <div className="absolute -top-40 right-[-12%] size-[560px] rounded-full bg-brand-orange/[0.13] blur-3xl" aria-hidden />
    <div className="absolute -bottom-48 -left-32 size-[480px] rounded-full bg-[#2ECC71]/[0.07] blur-3xl" aria-hidden />
    <Radar className="pointer-events-none absolute -right-16 top-1/2 hidden size-[420px] -translate-y-1/2 rotate-12 text-white/[0.04] xl:block" strokeWidth={1} aria-hidden />

    <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10 md:px-12 md:pb-20 md:pt-14">
      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1.5 text-xs font-medium text-white/55"
        aria-label="Fil d'Ariane"
      >
        <Link to="/" className="transition-colors hover:text-white">Accueil</Link>
        <ChevronRight className="size-3" />
        <span className="font-semibold text-white">Comment ça marche</span>
      </motion.nav>

      <div className="mt-8 grid items-start gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Colonne identité */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="flex flex-col items-start"
        >
          <motion.span
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            Chaîne en production · dernier run 06:02
          </motion.span>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-5 font-heading text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl xl:text-6xl"
          >
            L'emploi vient
            <span className="block text-brand-orange">à vous.</span>
            <span className="mt-2 block text-xl font-bold leading-snug text-white/60 sm:text-2xl">Pas l'inverse.</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            JobAlert CI n'est pas un job board de plus. C'est une chaîne automatique qui collecte
            les offres de 4 plateformes ivoiriennes, les déduplique par hash, les filtre selon vos
            filières — et vous les sert à 8h00 précises, avant même que vous n'ouvriez votre navigateur.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/inscription"
              className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-brand-orange px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_-8px_rgba(245,166,35,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
            >
              <Bell className="size-5 transition-transform duration-300 group-hover:rotate-12" />
              Créer mon alerte gratuite
            </Link>
            <Link
              to="/filieres"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              <LayoutGrid className="size-4" />
              Voir les 13 filières
            </Link>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-8 w-full max-w-md"
          >
            <CountdownEnvoi />
          </motion.div>

          <motion.dl
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-8 flex flex-wrap gap-y-5 divide-x divide-white/10"
          >
            {[
              { v: 4, l: "sources scannées" },
              { v: 29, l: "offres ce matin" },
              { v: 10550, l: "abonnés servis" },
              { v: 0, l: "doublon envoyé" },
            ].map((s, i) => (
              <div key={s.l} className={cn("pr-6 sm:pr-8", i > 0 && "pl-6 sm:pl-8")}>
                <dd className="font-heading text-3xl font-black"><CountUp to={s.v} /></dd>
                <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{s.l}</dt>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* La machine du matin */}
        <div className="relative">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ delay: 1.1, opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            className="absolute -top-4 right-4 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg"
          >
            <Sparkles className="size-3" />
            100 % automatique
          </motion.span>
          <Pipeline />
        </div>
      </div>
    </div>
  </section>
)

export default HowItWorksHero