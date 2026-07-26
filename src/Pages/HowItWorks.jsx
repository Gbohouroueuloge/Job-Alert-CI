import { useState, useEffect, useRef } from "react"
import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  ChevronDown,
  Clock,
  Database,
  Fingerprint,
  Mail,
  Radar,
  RefreshCw,
  Send,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react"
import { FaLinkedin } from "react-icons/fa"
import { cn } from "@/lib/utils"
import Seo from "@/components/seo/Seo"
import { howItWorksSeo } from "@/lib/seo"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getImgSource, getUrlSource } from "@/utils/utilsSource"

/* ════════════════════════════════════════════════════════════════════
  DONNÉES
════════════════════════════════════════════════════════════════════ */

const ETAPES_HERO = [
  {
    time: "06h00", icon: Radar, title: "Collecte",
    desc: "4 scrapers parcourent EmploiDakar CI, GoAfrica, Novojob et LinkedIn.", status: "ok"
  },
  {
    time: "06h15", icon: Fingerprint, title: "Dédoublonnage",
    desc: "Chaque offre reçoit une empreinte unique — jamais renvoyée deux fois.", status: "ok"
  },
  {
    time: "07h00", icon: SlidersHorizontal, title: "Filtrage",
    desc: "Les nouveautés sont croisées avec vos 1 à 3 filières métiers.", status: "live"
  },
  {
    time: "08h00", icon: Send, title: "Envoi",
    desc: "Votre récapitulatif personnalisé part vers votre boîte mail.", status: "todo"
  },
]

const REASSURANCES_HERO = ["Gratuit pour toujours", "Sans mot de passe", "Désinscription en 1 clic"]

const SOURCES_RUN = [
  { nom: "EmploiDakar CI", heure: "6h01" },
  { nom: "GoAfrica", heure: "6h02" },
  { nom: "Novojob", heure: "6h02" },
  { nom: "LinkedIn", heure: "6h04", linkedin: true },
]

const OFFRES_FILTREES = [
  { titre: "Responsable RH", entreprise: "Orange Côte d'Ivoire", ok: true },
  { titre: "Comptable senior", entreprise: "Groupe SIFCA", ok: true },
  { titre: "Développeur Full-Stack", entreprise: "Tech Solutions CI", ok: false },
]

const QUESTIONS = [
  {
    id: "q1", question: "Pourquoi un email plutôt qu'un tableau de bord ?",
    reponse: "Parce que c'est plus rapide. Le mode « push » vous évite de penser à vérifier : l'information vient à vous chaque matin, au lieu d'ajouter un site de plus à consulter. C'est aussi le meilleur moyen de ne rien manquer."
  },
  {
    id: "q2", question: "Comment une offre est-elle rattachée à une filière ?",
    reponse: "Par analyse de mots-clés dans l'intitulé du poste : « développeur » ou « ingénieur logiciel » → Tech & Dev, « conducteur de travaux » → BTP & Génie Civil… Les listes de mots-clés sont maintenues et affinées en continu."
  },
  {
    id: "q3", question: "Que se passe-t-il si une source est en panne ?",
    reponse: "Rien de visible pour vous : chaque scraper est isolé, l'erreur est journalisée avec horodatage, et les trois autres sources continuent d'alimenter votre récapitulatif normalement."
  },
  {
    id: "q4", question: "Et si aucune offre ne correspond à mes filières aujourd'hui ?",
    reponse: "Vous ne recevez rien. Pas d'email vide, pas de remplissage : votre boîte mail reste propre, et la chaîne reprend le lendemain matin."
  },
  {
    id: "q5", question: "Pourquoi 8h00 précisément ?",
    reponse: "Pour que votre récapitulatif soit là au moment où vous commencez votre journée — avant que les meilleures offres ne reçoivent leurs premières candidatures."
  },
  {
    id: "q6", question: "Puis-je changer de filières après mon inscription ?",
    reponse: "Oui. Chaque email contient un lien pour gérer vos filières ou vous désinscrire en un clic — sans mot de passe ni formulaire."
  },
]

/* ════════════════════════════════════════════════════════════════════
  ANIMATIONS
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
  HERO — le pipeline vivant (inchangé)
════════════════════════════════════════════════════════════════════ */

const StatusChip = ({ status }) => {
  if (status === "ok")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
        <Check className="size-2.5" strokeWidth={3.5} />
        Terminé
      </span>
    )
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold text-orange-700">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-brand-orange" />
        </span>
        En cours
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
      <Clock className="size-2.5" />
      Programmé
    </span>
  )
}

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
        timeLeft: `${hoursLeft}h ${minutesLeft}m restantes`,
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
        <span className="text-muted-foreground">Progression du run</span>
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

const PipelineCard = () => {
  const dateFr = (() => {
    const d = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    return d.charAt(0).toUpperCase() + d.slice(1)
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md md:max-w-none"
    >
      <div className="absolute -inset-8 rounded-full bg-brand-orange/10 blur-3xl" aria-hidden />
      <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-2 overflow-hidden rounded-2xl bg-brand-navy" aria-hidden>
        <div className="absolute inset-0 bg-pattern opacity-20" />
      </div>

      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
        transition={{
          delay: 1, opacity: { duration: 0.4 }, scale: { duration: 0.4 },
          y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute -top-4 left-5 z-20 inline-flex -rotate-3 items-center gap-1.5 rounded-full bg-brand-navy px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg sm:-left-5"
      >
        <Radar className="size-3 text-brand-orange" />
        4 sources scannées
      </motion.span>

      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          delay: 1.2, opacity: { duration: 0.4 }, scale: { duration: 0.4 },
          y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
        }}
        className="absolute -bottom-4 right-8 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white px-3.5 py-1.5 text-[11px] font-bold text-on-surface shadow-hover"
      >
        <BadgeCheck className="size-3.5 text-emerald-500" />
        0 doublon envoyé
      </motion.span>

      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/40 bg-white shadow-[0_24px_48px_-16px_rgba(15,45,77,0.22)]">
        <div className="flex items-center justify-between gap-3 border-b border-outline-variant/40 bg-surface-container-low/60 px-5 py-4">
          <div>
            <p className="font-heading text-sm font-bold text-brand-navy">La chaîne du jour</p>
            <p className="text-[11px] text-muted-foreground">{dateFr}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand-orange" />
            </span>
            Run en cours
          </span>
        </div>

        <div className="relative px-5 py-6">
          <div className="absolute bottom-10 left-10.25 top-10 w-0.5 bg-outline-variant/40" aria-hidden />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.6, delay: 0.8, ease: "easeInOut" }}
            className="absolute bottom-10 left-10.25 top-10 w-0.5 origin-top bg-brand-orange"
            aria-hidden
          />
          <ol>
            {ETAPES_HERO.map((e, i) => (
              <motion.li
                key={e.time}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.6 + i * 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-4"
              >
                <span
                  className={cn(
                    "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                    e.status === "ok" && "border-emerald-500/40 text-emerald-600",
                    e.status === "live" && "border-brand-orange bg-brand-orange text-white shadow-[0_0_0_6px_rgba(245,166,35,0.15)]",
                    e.status === "todo" && "border-dashed border-outline-variant text-muted-foreground"
                  )}
                >
                  <e.icon className="size-5" strokeWidth={2} />
                  {e.status === "live" && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full border-2 border-white bg-emerald-500" />
                    </span>
                  )}
                </span>
                <div className={cn("min-w-0 flex-1", i < ETAPES_HERO.length - 1 && "pb-6")}>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-heading text-lg font-black tracking-tight text-brand-navy">{e.time}</span>
                    <StatusChip status={e.status} />
                  </div>
                  <h3 className="mt-0.5 font-heading text-[15px] font-bold text-brand-navy">{e.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-on-surface-variant">{e.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <RunProgress />
      </div>
    </motion.div>
  )
}

const HeroHowItWorks = () => (
  <section className="relative overflow-hidden hero-gradient">
    <div className="absolute inset-0 bg-pattern opacity-50" aria-hidden />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,166,35,0.10),transparent_50%)]" aria-hidden />
    <div className="absolute -bottom-40 -left-40 size-120 rounded-full bg-brand-navy/4 blur-3xl" aria-hidden />

    <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-13 md:px-12 md:pb-20 lg:pt-18">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-start gap-5">
          <motion.div variants={fadeUp}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex cursor-default items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 py-1.5 pl-2.5 pr-4 text-xs font-semibold text-emerald-700">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Chaîne quotidienne active · dernier run à 6h02
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-62.5 text-center">
                Scraping à 6h00, dédoublonnage à 6h15, filtrage à 7h00, envoi à 8h00 — chaque jour, week-end compris.
              </TooltipContent>
            </Tooltip>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl font-black leading-[1.06] tracking-tight text-brand-navy sm:text-5xl xl:text-6xl"
          >
            4 étapes. 2 heures.{" "}
            <span className="relative whitespace-nowrap text-brand-orange">
              Zéro effort
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
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
            Chaque matin entre <strong className="font-semibold text-brand-navy">6h00 et 8h00</strong>, JobAlert CI
            déroule seul toute la chaîne : collecte des 4 sources, dédoublonnage, filtrage par filière, puis envoi de
            votre récapitulatif. Voici exactement ce qui se passe.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-1 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/inscription"
              className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-brand-orange px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_-6px_rgba(245,166,35,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_36px_-6px_rgba(245,166,35,0.55)] active:scale-[0.98]"
            >
              <Bell className="size-5 transition-transform duration-300 group-hover:rotate-12" />
              Créer mon alerte gratuite
            </Link>
            <a
              href="#chaine"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-brand-navy/15 bg-white/70 px-6 py-3.5 text-base font-semibold text-brand-navy backdrop-blur-sm transition-all duration-300 hover:border-brand-navy/35 hover:bg-white"
            >
              Voir les 4 étapes
              <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>

          <motion.ul variants={fadeUp} className="flex flex-wrap gap-x-5 gap-y-2">
            {REASSURANCES_HERO.map((r) => (
              <li key={r} className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/10">
                  <Check className="size-2.5 text-emerald-600" strokeWidth={3} />
                </span>
                {r}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <PipelineCard />
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
  LES 4 ÉTAPES EN DÉTAIL — visualisations du fonctionnement réel
════════════════════════════════════════════════════════════════════ */

/* ═══ Trace serpentine — version ruban XL ════════════════════════════ */

const TRACE_VB = { w: 1000, h: 2400 }

/* Tracé difforme qui louvoie vers le visuel de chaque étape
   (droite, gauche, droite, gauche) — déborde du cadre en haut/bas. */
const TRACE_PATH =
  "M 520 -120 " +
  "C 700 60, 848 150, 836 320 " +
  "C 824 490, 606 428, 452 528 " +
  "C 268 645, 146 748, 184 932 " +
  "C 218 1098, 432 1012, 622 1120 " +
  "C 818 1230, 874 1338, 824 1508 " +
  "C 772 1690, 542 1612, 390 1728 " +
  "C 212 1862, 140 1970, 210 2110 " +
  "C 292 2272, 512 2330, 498 2520"

const SerpentineTrace = ({ progress }) => {
  const pathRef = useRef(null)

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${TRACE_VB.w} ${TRACE_VB.h}`}
        preserveAspectRatio="none"
      >
        {/* Fantôme du tracé complet — ruban navy large */}
        <path
          ref={pathRef}
          d={TRACE_PATH}
          fill="none"
          stroke="var(--color-brand-navy)"
          strokeOpacity="0.06"
          strokeWidth="80"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Halo extérieur — nappe orange très diffuse */}
        <motion.path
          d={TRACE_PATH}
          fill="none"
          stroke="var(--color-brand-orange)"
          strokeOpacity="0.05"
          strokeWidth="104"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progress }}
        />
        {/* Halo intérieur — glow plus dense */}
        <motion.path
          d={TRACE_PATH}
          fill="none"
          stroke="var(--color-brand-orange)"
          strokeOpacity="0.10"
          strokeWidth="89"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progress }}
        />
        {/* Ligne dessinée — trait épais */}
        <motion.path
          d={TRACE_PATH}
          fill="none"
          stroke="var(--color-brand-orange)"
          strokeOpacity="0.5"
          strokeWidth="78"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progress }}
        />
      </svg>
    </div>
  )
}

/* Cadre commun des visuels : horaire fantôme + décalage navy */
const CadreVisuel = ({ time, children }) => (
  <div className="relative">
    <span
      className="pointer-events-none absolute -top-9 right-0 select-none font-heading text-7xl font-black leading-none text-brand-navy/6 sm:text-8xl"
      aria-hidden
    >
      {time}
    </span>
    <div className="absolute inset-0 translate-x-3 translate-y-4 rotate-1 rounded-xl bg-brand-navy/6" aria-hidden />
    <div className="relative rounded-xl border border-outline-variant/40 bg-white p-5 shadow-[0_20px_40px_-16px_rgba(15,45,77,0.18)]">
      {children}
    </div>
  </div>
)

/* Bloc texte d'une étape (numéro fantôme + horaire + points clés) */
const BlocEtape = ({ num, time, icon: Icon, title, intro, points, reverse, children }) => (
  <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
    <motion.div
      initial={{ opacity: 0, x: reverse ? 28 : -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(reverse && "lg:order-2")}
    >
      <div className="flex items-center gap-3">
        <span className="font-heading text-5xl font-black leading-none text-brand-navy/10">{num}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1 font-heading text-sm font-black tracking-tight text-brand-orange">
          <Clock className="size-3.5" />
          {time}
        </span>
      </div>
      <h3 className="mt-4 flex items-center gap-3 font-heading text-2xl font-extrabold tracking-tight text-brand-navy sm:text-[1.7rem]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-brand-orange">
          <Icon className="size-5" strokeWidth={2} />
        </span>
        {title}
      </h3>
      <p className="mt-4 leading-relaxed text-on-surface-variant">{intro}</p>
      <ul className="mt-5 space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
              <Check className="size-2.5 text-brand-orange" strokeWidth={3.5} />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: reverse ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={cn(reverse && "lg:order-1")}
    >
      {children}
    </motion.div>
  </div>
)

/* ── Visuel 1 : statut des scrapers ─────────────────────────────────── */
const VisualCollecte = () => (
  <CadreVisuel time="06h00">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Scrapers · statut du jour</p>
      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">4/4 actifs</span>
    </div>

    <ul className="mt-3.5 space-y-2">
      {SOURCES_RUN.map((s, i) => (
        <motion.li
          key={s.nom}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.12, ease: "easeOut" }}
          className="flex items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3.5 py-2.5"
        >
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="flex-1 truncate text-[13px] font-semibold text-on-surface">{s.nom}</span>
          {s.linkedin ? <FaLinkedin className="size-3.5 shrink-0 text-[#0A66C2]" /> : <img src={getImgSource(s.nom)} alt={s.nom} className="size-7" />}
          <span className="text-[11px] font-medium text-muted-foreground">{s.heure}</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">OK</span>
        </motion.li>
      ))}
    </ul>

    {/* Flux vers la base */}
    <div className="flex justify-center py-2.5" aria-hidden>
      <div className="flex flex-col items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1 animate-pulse rounded-full bg-brand-orange" style={{ animationDelay: `${i * 200}ms` }} />
        ))}
      </div>
    </div>

    <div className="flex items-center gap-3 rounded-lg bg-brand-navy px-4 py-3 text-white">
      <Database className="size-4 shrink-0 text-brand-orange" />
      <p className="text-[13px] font-semibold">Base offres</p>
      <p className="ml-auto text-[11px] text-white/60">
        <strong className="font-heading text-brand-orange">+47</strong> aujourd'hui
      </p>
    </div>

    <p className="mt-3.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <ShieldAlert className="size-3.5 shrink-0 text-brand-orange" />
      Scraper LinkedIn : délais renforcés — la source la plus protégée.
    </p>
  </CadreVisuel>
)

/* ── Visuel 2 : le tampon "doublon" ─────────────────────────────────── */
const VisualDedup = () => (
  <CadreVisuel time="06h15">
    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">6h15 — même annonce, deux sources</p>

    <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-lg border border-emerald-500/30 bg-emerald-50/40 p-3.5"
      >
        <div className="flex items-center justify-between gap-2">
          <Fingerprint className="size-4 text-emerald-600" />
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">✓ Insérée</span>
        </div>
        <p className="mt-2.5 text-[13px] font-bold text-brand-navy">Comptable senior</p>
        <p className="text-[11px] text-muted-foreground">Groupe SIFCA · via Novojob</p>
        <p className="mt-2 rounded bg-surface-container-low px-2 py-1 font-mono text-[10px] text-on-surface-variant">hash: a3f8…9c2</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="relative rounded-lg border border-outline-variant/50 bg-surface-container-low/50 p-3.5 opacity-80"
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
        <Fingerprint className="size-4 text-muted-foreground" />
        <p className="mt-2.5 text-[13px] font-bold text-on-surface-variant line-through decoration-red-400/70">Comptable senior</p>
        <p className="text-[11px] text-muted-foreground">Groupe SIFCA · via GoAfrica</p>
        <p className="mt-2 rounded bg-surface-container px-2 py-1 font-mono text-[10px] text-muted-foreground">hash: a3f8…9c2</p>
        <p className="mt-1.5 text-[10px] font-semibold text-red-600/80">Écartée — déjà en base</p>
      </motion.div>
    </div>

    <p className="mt-3.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <Fingerprint className="size-3.5 shrink-0 text-brand-orange" />
      Empreinte calculée depuis le lien de l'annonce — contrainte UNIQUE en base.
    </p>
  </CadreVisuel>
)

/* ── Visuel 3 : le matching par filière ─────────────────────────────── */
const VisualFiltrage = () => (
  <CadreVisuel time="07h00">
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[11px] font-black text-white">AD</span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-brand-navy">
          Awa D. <span className="font-medium text-muted-foreground">· abonnée depuis le 12/07</span>
        </p>
        <div className="mt-1 flex gap-1.5">
          <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-700">RH</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Comptabilité</span>
        </div>
      </div>
    </div>

    <div className="my-4 flex items-center gap-3">
      <span className="h-px flex-1 bg-outline-variant/50" aria-hidden />
      <span className="whitespace-nowrap rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-bold text-on-surface-variant">
        47 offres du jour → 2 pour Awa
      </span>
      <span className="h-px flex-1 bg-outline-variant/50" aria-hidden />
    </div>

    <ul className="space-y-2">
      {OFFRES_FILTREES.map((o, i) => (
        <motion.li
          key={o.titre}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.15, ease: "easeOut" }}
          className={cn(
            "flex items-center gap-3 rounded-lg border px-3.5 py-2.5",
            o.ok ? "border-brand-orange/40 border-l-2 border-l-brand-orange bg-orange-50/60" : "border-outline-variant/40 opacity-55"
          )}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-on-surface">{o.titre}</p>
            <p className="truncate text-[11px] text-muted-foreground">{o.entreprise}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
              o.ok ? "bg-brand-orange/10 text-orange-700" : "bg-surface-container text-muted-foreground"
            )}
          >
            {o.ok ? "→ Dans son récap" : "Hors filières"}
          </span>
        </motion.li>
      ))}
    </ul>

    <p className="mt-3.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <SlidersHorizontal className="size-3.5 shrink-0 text-brand-orange" />
      Chaque abonné reçoit une liste différente — la sienne, et rien d'autre.
    </p>
  </CadreVisuel>
)

/* ── Visuel 4 : le récapitulatif de 8h00 ────────────────────────────── */
const VisualEnvoi = () => (
  <CadreVisuel time="08h00">
    <span className="absolute -right-3 -top-3 z-10 inline-flex rotate-2 items-center gap-1.5 rounded-full bg-brand-navy px-3 py-1.5 text-[10px] font-bold text-white shadow-lg">
      <RefreshCw className="size-3 text-brand-orange" />
      3 tentatives si échec
    </span>

    <div className="overflow-hidden rounded-lg border border-outline-variant/40">
      <div className="flex items-center gap-2.5 border-b border-outline-variant/40 bg-surface-container-low/60 px-4 py-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-navy font-heading text-[9px] font-black text-white">JA</span>
        <p className="flex-1 truncate text-[12px] font-bold text-brand-navy">
          JobAlert CI <span className="font-medium text-muted-foreground">· Votre récapitulatif</span>
        </p>
        <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">08:00</span>
      </div>

      <div className="px-4 py-3.5">
        <p className="text-[12px] text-on-surface-variant">Bonjour Awa 👋</p>
        <p className="mt-0.5 text-[12px] text-on-surface-variant">
          <strong className="font-semibold text-on-surface">2 offres</strong> correspondent à vos filières :
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {OFFRES_FILTREES.filter((o) => o.ok).map((o, i) => (
            <motion.li
              key={o.titre}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.4 + i * 0.15 }}
              className="flex items-center gap-2.5 rounded-md border border-outline-variant/40 px-3 py-2"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-brand-orange" />
              <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-on-surface">{o.titre}</p>
              <span className="hidden shrink-0 text-[10px] text-muted-foreground sm:block">{o.entreprise}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 border-t border-outline-variant/40 bg-surface-container-low/40 px-4 py-2 text-[10px] font-medium text-muted-foreground">
        <span>Gérer mes filières</span>
        <span aria-hidden>·</span>
        <span>Me désinscrire en 1 clic</span>
      </div>
    </div>

    <p className="mt-3.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <BadgeCheck className="size-3.5 shrink-0 text-emerald-500" />
      Chaque envoi est journalisé : statut, horodatage, nombre d'offres.
    </p>
  </CadreVisuel>
)

/* ── Section assemblée ──────────────────────────────────────────────── */
const EtapesDetail = () => {
  const stepsRef = useRef(null)

  /* Progression de la trace : liée au scroll à travers les 4 étapes */
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start 0.8", "end 0.55"],
  })
  const traceProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  return (
    <section id="chaine" className="scroll-mt-24 overflow-hidden bg-surface-container-lowest py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
            <span className="h-px w-6 bg-brand-orange" aria-hidden />
            Sous le capot
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Deux heures de mécanique, <span className="text-brand-orange">zéro intervention</span>.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-on-surface-variant sm:text-lg">
            La chaîne s'exécute seule chaque matin, sans action humaine. Voici exactement ce que fait
            chaque maillon — et ce qu'il ne fait pas.
          </p>
        </motion.div>

        {/* Les étapes, avec la serpentine en fond */}
        <div ref={stepsRef} className="relative mt-16">
          <SerpentineTrace progress={traceProgress} />

          <div className="relative z-10 space-y-20 lg:space-y-24">
            <BlocEtape
              num="01" time="06h00" icon={Radar} title="Collecte & centralisation"
              intro="À 6h00 tapantes, quatre scrapers se lancent en parallèle. Chacun parcourt la page « dernières offres » de sa source, extrait titre, entreprise, lien et date de publication, puis nettoie le tout : accents, casse, espaces superflus."
              points={[
                "Un scraper isolé par source : une panne ne bloque jamais les trois autres",
                "Chaque offre reçoit un tag de filière par mots-clés (« ingénieur logiciel » → Tech & Dev)",
                "Délais renforcés sur LinkedIn, la source la plus protégée",
                "Chaque échec est journalisé avec horodatage",
              ]}
            >
              <VisualCollecte />
            </BlocEtape>

            <BlocEtape
              num="02" time="06h15" icon={Fingerprint} title="Dédoublonnage" reverse
              intro="Avant d'entrer en base, chaque offre reçoit une empreinte unique calculée depuis son lien d'annonce ou à défaut du couple titre + entreprise. Si l'empreinte existe déjà, l'offre est ignorée. Définitivement."
              points={[
                "Contrainte UNIQUE en base : une annonce ne peut physiquement pas être insérée deux fois",
                "Même offre repérée sur deux sources ? Une seule version est conservée",
                "Résultat : vous ne recevez jamais deux fois la même offre",
              ]}
            >
              <VisualDedup />
            </BlocEtape>

            <BlocEtape
              num="03" time="07h00" icon={SlidersHorizontal} title="Filtrage par filière"
              intro="Une fois le scraping terminé, le système croise les nouvelles offres du jour avec les filières de chaque abonné actif. Chacun reçoit une liste différente, la sienne, construite à partir de ses 1 à 3 filières choisies à l'inscription."
              points={[
                "Vos filières sont modifiables à tout moment via le lien en bas de chaque email",
                "Une offre n'entre dans votre email que si elle correspond à l'une de vos filières",
                "Aucune offre pertinente un jour donné ? Aucun email vide n'est envoyé",
              ]}
            >
              <VisualFiltrage />
            </BlocEtape>

            <BlocEtape
              num="04" time="08h00" icon={Send} title="Envoi du récapitulatif" reverse
              intro="À 8h00 précises, chaque abonné concerné reçoit son récapitulatif personnalisé : les offres filtrées, avec titre, entreprise, lien direct vers l'annonce d'origine et date de publication. Prêt à postuler avant tout le monde."
              points={[
                "Jusqu'à 3 tentatives espacées en cas d'échec d'envoi",
                "Chaque tentative (succès ou échec) est journalisée avec horodatage",
                "Lien de désinscription en bas de chaque email : un clic, zéro justification",
              ]}
            >
              <VisualEnvoi />
            </BlocEtape>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
  BANDEAU SOURCES
════════════════════════════════════════════════════════════════════ */

const SourcesBand = () => (
  <section className="relative overflow-hidden bg-brand-navy py-10">
    <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
    <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 md:px-12">
      <div>
        <p className="font-heading text-lg font-bold text-white">Elles alimentent votre récapitulatif</p>
        <p className="mt-0.5 text-sm text-white/60">Scannées chaque matin à 6h00, dans cet ordre.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {SOURCES_RUN.map((s) => (
          <a
            href={getUrlSource(s.nom)}
            target="_blank"
            key={s.nom}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white"
          >
            {s.linkedin ? <FaLinkedin className="size-3.5 text-[#7BB8F0]" /> : <img src={getImgSource(s.nom)} alt={s.nom} className="size-5" />}
            {s.nom}
          </a>
        ))}
        <Link
          to="/sources"
          className="group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-bold text-brand-orange transition-colors hover:text-white"
        >
          Notre méthode de collecte
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
  FAQ FONCTIONNEMENT
════════════════════════════════════════════════════════════════════ */

const FaqFonctionnement = () => (
  <section className="bg-background py-20 md:py-24">
    <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="self-start lg:sticky lg:top-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
            <span className="h-px w-6 bg-brand-orange" aria-hidden />
            Questions de mécanique
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Ce qu'on nous demande <span className="text-brand-orange">le plus souvent</span>.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Le fonctionnement de la chaîne, expliqué sans jargon.
          </p>
        </motion.div>

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
            Curieux de voir d'où viennent les offres ?
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
            La page Sources détaille les 4 plateformes scannées et notre méthode de collecte, source par source.
          </p>
          <Link
            to="/sources"
            className="group mt-4 inline-flex items-center gap-2 rounded-md bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-navy/90"
          >
            Explorer les sources
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Accordion type="single" collapsible defaultValue="q1" className="w-full border-none">
          {QUESTIONS.map((q) => (
            <AccordionItem key={q.id} value={q.id} className="border-outline-variant/40 group">
              <AccordionTrigger className="py-5 hover:no-underline group-data-open:text-brand-orange text-left font-heading text-[15px] font-bold text-brand-navy transition-colors duration-200 hover:text-brand-orange">
                {q.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-on-surface-variant">
                {q.reponse}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
)

/* ════════════════════════════════════════════════════════════════════
  PAGE
═════════════════════════════════════════════════════════════════════ */

const HowItWorks = () => (
  <TooltipProvider delayDuration={150}>
    <>
      <Seo {...howItWorksSeo} />
      <main>
        <HeroHowItWorks />
        <EtapesDetail />
        <SourcesBand />
        <FaqFonctionnement />
      </main>
    </>
  </TooltipProvider>
)

export default HowItWorks
