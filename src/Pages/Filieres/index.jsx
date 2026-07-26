// src/pages/filieres/index.jsx
import { useEffect, useMemo, useState, useRef, Fragment } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, animate, motion, useInView } from "framer-motion"
import {
  ArrowDownAZ, ArrowDownWideNarrow, ArrowRight, ArrowUpRight, Bell, Building2,
  Calculator, CheckCircle2, ChevronRight, Clock, Code2, GraduationCap, Handshake,
  HardHat, LayoutGrid, Mail, Megaphone, MousePointerClick, Radar, Search, SearchX,
  ShieldCheck, Sprout, Stethoscope, Truck, Users, UtensilsCrossed, X,
} from "lucide-react"
import { FaLinkedin } from "react-icons/fa6"
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card"
import Seo from "@/components/seo/Seo"
import { cn } from "@/lib/utils"
import { getImgSource } from "@/utils/utilsSource"
import { filieresSeo } from "@/lib/seo"

/* ════════════════════════════════════════════════════════════════════
  DONNÉES — à brancher sur l'API (tables filieres + offres, v2.0)
════════════════════════════════════════════════════════════════════ */

const HUES = {
  sky: { dot: "bg-sky-500", tile: "bg-sky-500/10 text-sky-600", glow: "bg-sky-400/20", accent: "text-sky-600", hex: "#0ea5e9" },
  fuchsia: { dot: "bg-fuchsia-500", tile: "bg-fuchsia-500/10 text-fuchsia-600", glow: "bg-fuchsia-400/20", accent: "text-fuchsia-600", hex: "#d946ef" },
  orange: { dot: "bg-orange-500", tile: "bg-orange-500/10 text-orange-600", glow: "bg-orange-400/20", accent: "text-orange-600", hex: "#f97316" },
  emerald: { dot: "bg-emerald-500", tile: "bg-emerald-500/10 text-emerald-600", glow: "bg-emerald-400/20", accent: "text-emerald-600", hex: "#10b981" },
  violet: { dot: "bg-violet-500", tile: "bg-violet-500/10 text-violet-600", glow: "bg-violet-400/20", accent: "text-violet-600", hex: "#8b5cf6" },
  amber: { dot: "bg-amber-500", tile: "bg-amber-500/10 text-amber-600", glow: "bg-amber-400/20", accent: "text-amber-600", hex: "#f59e0b" },
  cyan: { dot: "bg-cyan-500", tile: "bg-cyan-500/10 text-cyan-600", glow: "bg-cyan-400/20", accent: "text-cyan-600", hex: "#06b6d4" },
  rose: { dot: "bg-rose-500", tile: "bg-rose-500/10 text-rose-600", glow: "bg-rose-400/20", accent: "text-rose-600", hex: "#f43f5e" },
  blue: { dot: "bg-blue-500", tile: "bg-blue-500/10 text-blue-600", glow: "bg-blue-400/20", accent: "text-blue-600", hex: "#3b82f6" },
  indigo: { dot: "bg-indigo-500", tile: "bg-indigo-500/10 text-indigo-600", glow: "bg-indigo-400/20", accent: "text-indigo-600", hex: "#6366f1" },
  teal: { dot: "bg-teal-500", tile: "bg-teal-500/10 text-teal-600", glow: "bg-teal-400/20", accent: "text-teal-600", hex: "#14b8a6" },
  lime: { dot: "bg-lime-500", tile: "bg-lime-500/10 text-lime-600", glow: "bg-lime-400/20", accent: "text-lime-600", hex: "#84cc16" },
  red: { dot: "bg-red-500", tile: "bg-red-500/10 text-red-600", glow: "bg-red-400/20", accent: "text-red-600", hex: "#ef4444" },
}

const FILIERES = [
  {
    code: "tech-dev", label: "Tech & Dev", icon: Code2, hue: "sky", actives: 34, nouvelles: 6, abonnes: 1840,
    tagline: "Développement, data, infra & produit digital", keywords: ["développeur", "full-stack", "data", "devops"]
  },
  {
    code: "marketing-com", label: "Marketing & Com", icon: Megaphone, hue: "fuchsia", actives: 21, nouvelles: 4, abonnes: 1120,
    tagline: "Marque, contenu, médias & growth", keywords: ["communication", "marketing", "brand"]
  },
  {
    code: "commercial-vente", label: "Commercial & Vente", icon: Handshake, hue: "orange", actives: 18, nouvelles: 3, abonnes: 960,
    tagline: "Vente, grands comptes & développement d'affaires", keywords: ["commercial", "vente", "business developer"]
  },
  {
    code: "comptabilite-finance", label: "Comptabilité & Finance", icon: Calculator, hue: "emerald", actives: 16, nouvelles: 3, abonnes: 1310,
    tagline: "Finance, audit, contrôle & gestion", keywords: ["comptable", "audit", "finance"]
  },
  {
    code: "ressources-humaines", label: "Ressources Humaines", icon: Users, hue: "violet", actives: 15, nouvelles: 2, abonnes: 890,
    tagline: "Recrutement, paie, formation & développement RH", keywords: ["recrutement", "paie", "formation"]
  },
  {
    code: "btp-genie-civil", label: "BTP & Génie Civil", icon: HardHat, hue: "amber", actives: 14, nouvelles: 2, abonnes: 720,
    tagline: "Chantiers, génie civil & infrastructures", keywords: ["chantier", "génie civil", "topographe"]
  },
  {
    code: "logistique-transport", label: "Logistique & Transport", icon: Truck, hue: "cyan", actives: 12, nouvelles: 2, abonnes: 640,
    tagline: "Transit, douane, supply chain & distribution", keywords: ["transit", "douane", "supply chain"]
  },
  {
    code: "sante-medical", label: "Santé & Médical", icon: Stethoscope, hue: "rose", actives: 11, nouvelles: 2, abonnes: 830,
    tagline: "Soins, pharma, labo & professions médicales", keywords: ["infirmier", "pharmacien", "laboratoire"]
  },
  {
    code: "administration", label: "Administration", icon: Building2, hue: "blue", actives: 10, nouvelles: 1, abonnes: 580,
    tagline: "Assistanat, gestion & services généraux", keywords: ["assistant", "office manager"]
  },
  {
    code: "education-formation", label: "Éducation & Formation", icon: GraduationCap, hue: "indigo", actives: 9, nouvelles: 1, abonnes: 510,
    tagline: "Enseignement, pédagogie & formation professionnelle", keywords: ["enseignant", "formateur"]
  },
  {
    code: "hotellerie-restauration", label: "Hôtellerie & Restauration", icon: UtensilsCrossed, hue: "teal", actives: 8, nouvelles: 1, abonnes: 450,
    tagline: "Cuisine, salle, hébergement & hospitalité", keywords: ["chef", "serveur", "hôtellerie"]
  },
  {
    code: "agriculture-agrobusiness", label: "Agriculture & Agrobusiness", icon: Sprout, hue: "lime", actives: 7, nouvelles: 1, abonnes: 390,
    tagline: "Du champ à l'usine : cacao, cajou & agro-industrie", keywords: ["agronome", "plantation"]
  },
  {
    code: "securite-gardiennage", label: "Sécurité & Gardiennage", icon: ShieldCheck, hue: "red", actives: 6, nouvelles: 1, abonnes: 310,
    tagline: "Sûreté, gardiennage & protection des sites", keywords: ["agent de sécurité", "gardiennage"]
  },
]

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
  OUTILS
════════════════════════════════════════════════════════════════════ */

const CountUp = ({ to, suffix = "" }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{value.toLocaleString("fr-FR")}{suffix}</span>
}

/* ════════════════════════════════════════════════════════════════════
  HERO — ouverture sur la collecte du jour (le cœur du produit)
════════════════════════════════════════════════════════════════════ */

const RunProgress = () => {
  const [progress, setProgress] = useState({
    percentage: 0,
    timeLeft: "Calcul...",
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();

      // On définit le début (start) et la fin (target) du cycle
      let start = new Date(now);
      start.setHours(8, 0, 0, 0); // 8h00 du matin

      let target = new Date(now);
      target.setHours(8, 0, 0, 0);

      // Logique pour savoir si on est avant ou après 8h aujourd'hui
      if (now.getHours() >= 8) {
        // Le prochain envoi est demain à 8h, le précédent était aujourd'hui à 8h
        target.setDate(target.getDate() + 1);
      } else {
        // Le prochain envoi est aujourd'hui à 8h, le précédent était hier à 8h
        start.setDate(start.getDate() - 1);
      }

      const totalDuration = target.getTime() - start.getTime(); // Durée totale d'un cycle (24h)
      const elapsed = now.getTime() - start.getTime(); // Temps écoulé depuis le dernier 8h00
      const remaining = target.getTime() - now.getTime(); // Temps avant le prochain 8h00

      // Calcul du pourcentage (borné entre 0 et 100)
      const rawPercentage = (elapsed / totalDuration) * 100;
      const percentage = Math.max(0, Math.min(100, rawPercentage));

      // Conversion du temps restant en heures et minutes
      const hoursLeft = Math.floor(remaining / (1000 * 60 * 60));
      const minutesLeft = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      setProgress({
        percentage,
        timeLeft: `${hoursLeft}h ${minutesLeft}m`,
      });
    };

    // 1. Calcul immédiat au montage du composant
    calculateTime();

    // 2. Mise à jour automatique toutes les minutes (60000 millisecondes)
    const interval = setInterval(calculateTime, 60000);

    // Nettoyage de l'intervalle si le composant est démonté
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-t border-outline-variant/40 bg-surface-container-low/40 px-5 py-4">
      <div className="flex items-baseline justify-between text-[11px] font-semibold">
        <span className="text-muted-foreground">Progression du prochain run</span>
        {/* Affichage dynamique du pourcentage arrondi */}
        <span className="font-heading text-brand-navy">
          {Math.round(progress.percentage)} %
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progress.percentage}%` }} // La largeur s'adapte à l'état
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-brand-orange"
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Mail className="size-3 text-brand-orange" />
          Rendez-vous à 8h00
        </p>
        {/* Affichage du temps restant */}
        <span className="font-medium text-brand-orange/80">
          Il reste {progress.timeLeft}
        </span>
      </div>
    </div>
  );
}

const CollectePanel = () => {
  const total = SOURCES_STATUS.reduce((s, x) => s + x.offres, 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md md:max-w-none"
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

        <RunProgress />
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
            className="max-w-xl text-lg leading-relaxed text-on-surface-variant"
          >
            JobAlert CI scanne chaque jour les 4 grandes plateformes d'emploi ivoiriennes et vous
            envoie le meilleur de vos filières sans recherche, sans doublon, sans connexion.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-1 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/inscription"
              className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-brand-orange px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_-8px_rgba(245,166,35,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
            >
              <Bell className="size-5 transition-transform duration-300 group-hover:rotate-12" />
              Créer mon alerte
            </Link>
            <Link
              to="/comment-ca-marche"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-brand-navy/15 bg-white/70 px-6 py-3.5 text-base font-semibold text-brand-navy backdrop-blur-sm transition-all duration-300 hover:border-brand-navy/35 hover:bg-white"
            >
              Comment ça marche
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
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

/* Ticker des offres collectées aujourd'hui */
const TickerCollecte = () => (
  <div className="flex flex-col md:flex-row overflow-x-hidden items-center border-y border-outline-variant/40 bg-surface-container-lowest">
    <div className="z-10 flex shrink-0 items-center gap-2.5 border-r border-outline-variant/40 bg-surface-container-lowest px-4 py-3.5 sm:px-6">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-70" />
        <span className="relative inline-flex size-2 rounded-full bg-brand-orange" />
      </span>
      <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.16em] text-brand-navy">
        Collecte du jour
      </span>
    </div>

    <div className="relative flex-1 overflow-hidden">
      <motion.div
        className="flex w-max gap-10 py-3.5 pl-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      >
        {[...TICKER, ...TICKER].map((t, i) => (
          <span key={i} className="flex items-center gap-2.5 whitespace-nowrap text-[13px]">
            <span className={cn("size-1.5 shrink-0 rounded-full", t.dot)} />
            <strong className="font-semibold text-brand-navy">{t.titre}</strong>
            <span className="text-muted-foreground">· {t.entreprise}</span>
            <span className="text-[11px] text-muted-foreground/70">via {t.source}</span>
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-surface-container-lowest to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-surface-container-lowest to-transparent" aria-hidden />
    </div>
  </div>
)

/* ════════════════════════════════════════════════════════════════════
  CARTES FILIÈRES — bento : 3 cartes riches + 10 compactes
════════════════════════════════════════════════════════════════════ */

const BadgeNouvelles = ({ n }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#B45309]">
    <span className="relative flex size-1.5">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-75" />
      <span className="relative inline-flex size-1.5 rounded-full bg-brand-orange" />
    </span>
    +{n} ce matin
  </span>
)

const FiliereLargeCard = ({ f, i }) => {
  const hue = HUES[f.hue]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="sm:col-span-2 lg:col-span-2"
    >
      <Link
        to={`/filieres/${f.code}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/50 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover"
        style={{ borderTop: `3px solid ${hue.hex}` }}
      >
        <div className={cn("pointer-events-none absolute -right-16 -top-16 size-44 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100", hue.glow)} aria-hidden />

        <div className="flex items-start gap-3">
          <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3", hue.tile)}>
            <f.icon className="size-6" strokeWidth={1.9} />
          </span>
          <div className="ml-auto flex items-center gap-2">
            {f.nouvelles > 0 && <BadgeNouvelles n={f.nouvelles} />}
            <ArrowUpRight className="size-4 text-outline-variant transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-orange" />
          </div>
        </div>

        <h3 className="mt-4 font-heading text-xl font-extrabold tracking-tight text-brand-navy transition-colors duration-300 group-hover:text-brand-orange">
          {f.label}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {f.keywords.slice(0, 3).map((kw) => (
            <Tooltip key={kw}>
              <TooltipTrigger asChild>
                <span className="cursor-help rounded-full border border-outline-variant/60 bg-surface-container-low/60 px-2.5 py-1 text-[11px] font-medium text-on-surface-variant transition-colors hover:border-brand-navy/40 hover:text-brand-navy">
                  {kw}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">Les offres contenant « {kw} » sont tagguées {f.label}.</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-6 border-t border-outline-variant/40 pt-4">
          <div>
            <p className="font-heading text-lg font-extrabold leading-none text-brand-navy">{f.actives}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">offres actives</p>
          </div>
          <div>
            <p className={cn("font-heading text-lg font-extrabold leading-none", hue.accent)}>{f.nouvelles}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">ce matin</p>
          </div>
          <div>
            <p className="font-heading text-lg font-extrabold leading-none text-brand-navy">{f.abonnes.toLocaleString("fr-FR")}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">abonnés</p>
          </div>
          <span className="ml-auto hidden items-center gap-1 text-xs font-bold text-brand-navy opacity-0 transition-all duration-300 group-hover:opacity-100 sm:inline-flex">
            Voir
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

const FiliereCompactCard = ({ f, i }) => {
  const hue = HUES[f.hue]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-3 overflow-x-hidden"
    >
      <Link
        to={`/filieres/${f.code}`}
        className="group flex items-center gap-4 rounded-xl border border-outline-variant/50 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
        style={{ borderLeft: `3px solid ${hue.hex}` }}
      >
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110", hue.tile)}>
          <f.icon className="size-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate-2 font-heading text-[15px] font-bold text-brand-navy transition-colors duration-300 group-hover:text-brand-orange">
            {f.label}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{f.tagline}</p>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="font-heading text-lg font-extrabold leading-none text-brand-navy">{f.actives}</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">offres</p>
        </div>
        {f.nouvelles > 0 && (
          <span className="shrink-0 rounded-full bg-brand-orange/15 px-2 py-0.5 text-[10px] font-bold text-[#B45309]">+{f.nouvelles}</span>
        )}
        <ArrowUpRight className="size-4 shrink-0 text-outline-variant transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-orange" />
      </Link>
    </motion.div>
  )
}

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

const Filieres = () => {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("volume")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
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
  }, [query, sort])

  const q = query.trim()
  const large = filtered.filter((f) => TOP3.includes(f.code) && !q)
  const compact = filtered.filter((f) => !large.includes(f))

  return (
    <>
      <Seo {...filieresSeo(FILIERES)} />
      <main>
        <HeroFilieres />
        <TickerCollecte />

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
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher une filière ou un métier…"
                  aria-label="Rechercher une filière"
                  className="h-10 w-full rounded-lg border border-outline-variant/60 bg-white pl-9 pr-9 text-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand-navy/50 focus:ring-2 focus:ring-brand-navy/10"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
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
                {large.map((f, i) => <FiliereLargeCard key={f.code} f={f} i={i} />)}
                {compact.map((f, i) => <FiliereCompactCard key={f.code} f={f} i={i} />)}
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
                  onClick={() => setQuery("")}
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
