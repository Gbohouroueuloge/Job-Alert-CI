
import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Bell, BookOpen, Building2, Calculator,
  ChevronDown, Clock, Code2, GraduationCap, Handshake, HardHat, LayoutGrid,
  Megaphone, Menu, Radar, ShieldCheck, Sparkles, Sprout, Stethoscope, Truck,
  Users, UtensilsCrossed, X, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "@/components/ui/logo"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HUES } from "@/lib/hues"
import { ARTICLES, catOf, fmtVus } from "@/data/conseils"

/* ------------------------------------------------------------------ */
/*  Données                                                            */
/* ------------------------------------------------------------------ */

const FILIERES = [
  {
    label: "Tech & Dev", to: "/filieres/tech-dev", icon: Code2, count: 34, unit: "offres",
    tile: "bg-sky-500/10 text-sky-600", tileHover: "group-hover:bg-sky-600 group-hover:text-white",
    itemHover: "hover:bg-sky-50 hover:border-sky-200"
  },
  {
    label: "Marketing & Com", to: "/filieres/marketing-com", icon: Megaphone, count: 21, unit: "offres",
    tile: "bg-fuchsia-500/10 text-fuchsia-600", tileHover: "group-hover:bg-fuchsia-600 group-hover:text-white",
    itemHover: "hover:bg-fuchsia-50 hover:border-fuchsia-200"
  },
  {
    label: "Commercial & Vente", to: "/filieres/commercial-vente", icon: Handshake, count: 18, unit: "offres",
    tile: "bg-orange-500/10 text-orange-600", tileHover: "group-hover:bg-orange-600 group-hover:text-white",
    itemHover: "hover:bg-orange-50 hover:border-orange-200"
  },
  {
    label: "Comptabilité & Finance", to: "/filieres/comptabilite-finance", icon: Calculator, count: 16, unit: "offres",
    tile: "bg-emerald-500/10 text-emerald-600", tileHover: "group-hover:bg-emerald-600 group-hover:text-white",
    itemHover: "hover:bg-emerald-50 hover:border-emerald-200"
  },
  {
    label: "Ressources Humaines", to: "/filieres/ressources-humaines", icon: Users, count: 15, unit: "offres",
    tile: "bg-violet-500/10 text-violet-600", tileHover: "group-hover:bg-violet-600 group-hover:text-white",
    itemHover: "hover:bg-violet-50 hover:border-violet-200"
  },
  {
    label: "BTP & Génie Civil", to: "/filieres/btp-genie-civil", icon: HardHat, count: 14, unit: "offres",
    tile: "bg-amber-500/10 text-amber-600", tileHover: "group-hover:bg-amber-600 group-hover:text-white",
    itemHover: "hover:bg-amber-50 hover:border-amber-200"
  },
  {
    label: "Logistique & Transport", to: "/filieres/logistique-transport", icon: Truck, count: 12, unit: "offres",
    tile: "bg-cyan-500/10 text-cyan-600", tileHover: "group-hover:bg-cyan-600 group-hover:text-white",
    itemHover: "hover:bg-cyan-50 hover:border-cyan-200"
  },
  {
    label: "Santé & Médical", to: "/filieres/sante-medical", icon: Stethoscope, count: 11, unit: "offres",
    tile: "bg-rose-500/10 text-rose-600", tileHover: "group-hover:bg-rose-600 group-hover:text-white",
    itemHover: "hover:bg-rose-50 hover:border-rose-200"
  },
  {
    label: "Administration", to: "/filieres/administration", icon: Building2, count: 10, unit: "offres",
    tile: "bg-blue-500/10 text-blue-600", tileHover: "group-hover:bg-blue-600 group-hover:text-white",
    itemHover: "hover:bg-blue-50 hover:border-blue-200"
  },
  {
    label: "Éducation & Formation", to: "/filieres/education-formation", icon: GraduationCap, count: 9, unit: "offres",
    tile: "bg-indigo-500/10 text-indigo-600", tileHover: "group-hover:bg-indigo-600 group-hover:text-white",
    itemHover: "hover:bg-indigo-50 hover:border-indigo-200"
  },
  {
    label: "Hôtellerie & Restauration", to: "/filieres/hotellerie-restauration", icon: UtensilsCrossed, count: 8, unit: "offres",
    tile: "bg-teal-500/10 text-teal-600", tileHover: "group-hover:bg-teal-600 group-hover:text-white",
    itemHover: "hover:bg-teal-50 hover:border-teal-200"
  },
  {
    label: "Agriculture & Agrobusiness", to: "/filieres/agriculture-agrobusiness", icon: Sprout, count: 7, unit: "offres",
    tile: "bg-lime-500/10 text-lime-600", tileHover: "group-hover:bg-lime-600 group-hover:text-white",
    itemHover: "hover:bg-lime-50 hover:border-lime-200"
  },
  {
    label: "Sécurité & Gardiennage", to: "/filieres/securite-gardiennage", icon: ShieldCheck, count: 6, unit: "offres",
    tile: "bg-red-500/10 text-red-600", tileHover: "group-hover:bg-red-600 group-hover:text-white",
    itemHover: "hover:bg-red-50 hover:border-red-200"
  },
]

/* Top 8 des conseils les plus lus — alimente le mega-menu */
const TOP_CONSEILS = [...ARTICLES].sort((a, b) => b.vus - a.vus).slice(0, 9)

const TOTAL_OFFRES = FILIERES.reduce((sum, f) => sum + f.count, 0)

const NAV_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Comment ça marche", to: "/comment-ca-marche" },
]

const NAV_LINKS_AFTER = [
  { label: "Sources", to: "/sources" },
]

/* ------------------------------------------------------------------ */
/*  Animations                                                         */
/* ------------------------------------------------------------------ */

const panelVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16 } },
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025, delayChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
}

/* ------------------------------------------------------------------ */
/*  Sous-composants partagés                                           */
/* ------------------------------------------------------------------ */

const NavItem = ({ to, label }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200",
        active
          ? "bg-surface-container text-brand-navy"
          : "text-on-surface-variant hover:bg-surface-container-low hover:text-brand-navy"
      )}
    >
      {label}
    </Link>
  )
}

/* Coquille commune aux deux mega-menus desktop */
const MegaPanel = ({ children, onEnter, onLeave }) => (
  <motion.div
    variants={panelVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    className="absolute inset-x-0 top-full border-b border-outline-variant/40 bg-white shadow-[0_28px_48px_-16px_rgba(15,45,77,0.22)]"
  >
    {children}
  </motion.div>
)

/* Tuile catégorie (filière ou conseil) */
const MenuTile = ({ item }) => (
  <motion.div variants={itemVariants}>
    <Link
      to={item.to}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-transparent p-2.5",
        "transition-all duration-200 hover:-translate-y-0.5",
        item.itemHover
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-md transition-colors duration-200",
          item.tile,
          item.tileHover
        )}
      >
        <item.icon className="size-5" strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="block truncate-2 md:truncate text-[11px] md:text-[13px] font-semibold leading-tight text-on-surface">
          {item.label}
        </span>
        <span
          className={cn(
            "block text-[9px] md:text-[11px]",
            item.fresh ? "font-semibold text-orange-600" : "font-medium text-muted-foreground"
          )}
        >
          {item.fresh ? "Nouveau · " : ""}
          {item.count} {item.unit}
        </span>
      </span>
    </Link>
  </motion.div>
)

/* Tuile "Tout voir" en pointillés */
const AllTile = ({ to, icon: Icon, label, count, unit }) => (
  <motion.div variants={itemVariants}>
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-lg border border-dashed border-outline-variant/70 p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange hover:bg-orange-50/70"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-orange/10 text-brand-orange transition-colors duration-200 group-hover:bg-brand-orange group-hover:text-white">
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold leading-tight text-on-surface">{label}</span>
        <span className="block text-[11px] font-medium text-muted-foreground">
          {count} {unit}
        </span>
      </span>
      <ArrowUpRight className="ml-auto size-3.5 shrink-0 -translate-x-1 text-brand-orange opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  </motion.div>
)

/* Tuile conseil — article du top 8, avec badge de rang */
const ConseilTile = ({ a, rank }) => {
  const cat = catOf(a.cat)
  const hue = HUES[cat.hue]
  const Icon = cat.icon
  return (
    <motion.div variants={itemVariants}>
      <Link
        to={`/conseils/${a.slug}`}
        className="group flex items-start gap-3 rounded-lg border border-transparent p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-outline-variant/50 hover:bg-surface-container-low/60 hover:shadow-soft"
      >
        <span className={cn(
          "relative flex size-10 shrink-0 items-center justify-center rounded-md transition-colors duration-200",
          hue.tile,
          hue.tileHover
        )}>
          <Icon className="size-5" strokeWidth={2} />
          <span className="absolute -left-1.5 -top-1.5 grid size-4.5 place-items-center rounded-full bg-brand-navy font-heading text-[9px] font-black text-white ring-2 ring-white">
            {rank}
          </span>
        </span>
        <span className="min-w-0">
          <span className="block truncate-2 text-[13px] font-semibold leading-tight text-on-surface transition-colors duration-200 group-hover:text-brand-orange">
            {a.titre}
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span className={cn("size-1.5 shrink-0 rounded-full", hue.dot)} />
            <span className="truncate">{cat.label}</span>
            <span aria-hidden>·</span>
            <Clock className="size-3 shrink-0" />
            {a.lecture} min
          </span>
        </span>
      </Link>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

const Header = () => {
  const [openMenu, setOpenMenu] = useState(null) // "offres" | "conseils" | null
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef(null)
  const headerRef = useRef(null)
  const location = useLocation()

  const openMega = (name) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpenMenu(name)
  }

  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 150)
  }

  /* Scroll : compacte le header + replie le bandeau d'état */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Ferme tout au changement de route */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenMenu(null)
    setMobileOpen(false)
  }, [location.pathname])

  /* Clic hors du header → ferme le menu mobile (le header reste exclu,
   seul le bouton X le referme de l'intérieur) */
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setMobileOpen(false)
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [mobileOpen])

  /* Touche Échap */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [])

  const dateFr = (() => {
    const d = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    return d.charAt(0).toUpperCase() + d.slice(1)
  })()

  /* Déclencheur de mega-menu desktop (Offres, Conseils) */
  const renderMegaTrigger = (name, to, label) => (
    <Link
      key={name}
      to={to}
      onMouseEnter={() => openMega(name)}
      onMouseLeave={scheduleClose}
      aria-expanded={openMenu === name}
      className={cn(
        "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200",
        openMenu === name
          ? "bg-surface-container text-brand-navy"
          : "text-on-surface-variant hover:bg-surface-container-low hover:text-brand-navy"
      )}
    >
      {label}
      <ChevronDown
        className={cn(
          "size-3.5 transition-transform duration-300",
          openMenu === name ? "rotate-180 text-brand-orange" : "text-muted-foreground"
        )}
      />
    </Link>
  )

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full">
      {/* ── Bandeau d'état du scraping ─────────────────────────────── */}
      <AnimatePresence initial={false}>
        {!scrolled && (
          <motion.div
            key="status-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-brand-navy text-white"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-1.5 text-[11px] font-medium md:px-8 lg:px-12">
              <p className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-white/90">
                  Collecte terminée — <strong className="font-semibold text-white">47 nouvelles offres</strong> à 6h02
                </span>
              </p>
              <p className="hidden items-center gap-2 text-white/60 md:flex">
                {dateFr}
                <span className="text-white/30">·</span>
                <Clock className="size-3" />
                Prochain envoi à 8h00
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Barre principale ───────────────────────────────────────── */}
      <div
        className={cn(
          "relative border-b border-outline-variant/30 bg-white/85 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_8px_24px_-8px_rgba(15,45,77,0.12)]"
        )}
      >
        {/* Voile qui assombrit la page quand un mega-menu est ouvert */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-brand-navy/25 backdrop-blur-[2px]"
              onClick={() => setOpenMenu(null)}
            />
          )}
        </AnimatePresence>

        <div className="relative z-50">
          <div
            className={cn(
              "flex items-center justify-between gap-4 px-4 transition-all duration-300 md:px-8 lg:px-12",
              scrolled ? "py-3" : "py-4"
            )}
          >
            <Logo />

            {/* Navigation desktop */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((l) => (
                <NavItem key={l.to} {...l} />
              ))}

              {renderMegaTrigger("offres", "/offres", "Offres")}
              {renderMegaTrigger("conseils", "/conseils", "Conseils")}

              {NAV_LINKS_AFTER.map((l) => (
                <NavItem key={l.to} {...l} />
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                to="/admin/connexion"
                className="hidden rounded-md px-3 py-2 text-sm font-semibold text-brand-navy transition-colors duration-300 hover:bg-brand-navy hover:text-white lg:inline-flex"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="group inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:brightness-110 hover:shadow-md active:scale-[0.98]"
              >
                <Bell className="size-4 transition-transform duration-300 group-hover:rotate-12" />
                <span className="hidden sm:inline">Créer une alerte</span>
                <span className="sm:hidden">Alerte</span>
              </Link>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Ouvrir le menu"
                className="inline-flex size-10 items-center justify-center rounded-md text-brand-navy transition-colors hover:bg-surface-container lg:hidden"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {/* ── Mega-menus desktop — pleine largeur ──────────────────── */}
          <AnimatePresence>
            {/* -------- MEGA-MENU OFFRES -------- */}
            {openMenu === "offres" && (
              <MegaPanel key="mega-offres" onEnter={() => openMega("offres")} onLeave={scheduleClose}>
                <div className="grid gap-8 px-5 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-12">
                  <div>
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-heading text-sm font-bold uppercase tracking-wider text-brand-navy">
                        Explorer par filière métier
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {TOTAL_OFFRES} offres actives · mises à jour chaque matin à 6h00
                      </p>
                    </div>

                    <motion.div
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 gap-1.5 md:grid-cols-3 xl:grid-cols-4"
                    >
                      {FILIERES.map((f) => (
                        <MenuTile key={f.to} item={f} />
                      ))}
                      <AllTile to="/offres" icon={LayoutGrid} label="Toutes les offres" count={TOTAL_OFFRES} unit="offres" />
                    </motion.div>
                  </div>

                  {/* Carte "collecte du jour" */}
                  <aside className="relative hidden flex-col overflow-hidden rounded-xl bg-brand-navy p-6 text-white lg:flex">
                    <div className="pointer-events-none absolute inset-0 bg-pattern opacity-30" aria-hidden />
                    <div className="relative flex flex-1 flex-col">
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90">
                        <Zap className="size-3 text-brand-orange" />
                        Collecte du jour
                      </span>
                      <p className="mt-5 font-heading text-5xl font-extrabold leading-none">47</p>
                      <p className="mt-1.5 text-sm text-white/70">
                        nouvelles offres collectées ce matin sur nos 4 sources
                      </p>
                      <ul className="mb-6 mt-5 space-y-2.5 text-[13px] text-white/80">
                        <li className="flex items-start gap-2.5">
                          <Radar className="mt-0.5 size-4 shrink-0 text-brand-orange" />
                          EmploiDakar CI, GoAfrica, Novojob & LinkedIn scannées
                        </li>
                        <li className="flex items-start gap-2.5">
                          <Clock className="mt-0.5 size-4 shrink-0 text-brand-orange" />
                          Récapitulatif envoyé chaque matin à 8h00
                        </li>
                        <li className="flex items-start gap-2.5">
                          <BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand-orange" />
                          Dédoublonnage automatique : zéro doublon envoyé
                        </li>
                      </ul>
                      <Link
                        to="/offres"
                        className="group mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110"
                      >
                        Voir toutes les offres
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </aside>
                </div>

                {/* Bandeau bas */}
                <div className="flex flex-col items-start justify-between gap-3 border-t border-outline-variant/40 bg-surface-container-low/60 px-5 py-4 sm:flex-row sm:items-center md:px-8 lg:px-12">
                  <p className="flex items-center gap-2 text-[13px] text-on-surface-variant">
                    <Bell className="size-4 shrink-0 text-brand-orange" />
                    Recevez uniquement les offres de vos filières, chaque matin à 8h00 dans votre boîte mail.
                  </p>
                  <Link
                    to="/inscription"
                    className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-navy transition-colors hover:text-brand-orange"
                  >
                    Créer mon alerte gratuite
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </MegaPanel>
            )}

            {/* -------- MEGA-MENU CONSEILS — top 8 des plus lus -------- */}
            {openMenu === "conseils" && (
              <MegaPanel key="mega-conseils" onEnter={() => openMega("conseils")} onLeave={scheduleClose}>
                <div className="grid gap-8 px-5 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-12">
                  <div>
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-heading text-sm font-bold uppercase tracking-wider text-brand-navy">
                        Les conseils les plus lus
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Top 9 · classés par nombre de lectures
                      </p>
                    </div>
                    <motion.div
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 gap-1.5 md:grid-cols-2"
                    >
                      {TOP_CONSEILS.map((a, i) => (
                        <ConseilTile key={a.slug} a={a} rank={i + 1} />
                      ))}
                      <AllTile to="/conseils" icon={BookOpen} label="Tous les conseils" count={ARTICLES.length} unit="articles" />
                    </motion.div>
                  </div>
                  {/* Carte "conseil n°1" — alimentée par le vrai classement */}
                  <aside className="relative hidden flex-col overflow-hidden rounded-xl bg-brand-navy p-6 text-white lg:flex">
                    <div className="pointer-events-none absolute inset-0 bg-pattern opacity-30" aria-hidden />
                    <div className="relative flex flex-1 flex-col">
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90">
                        <Sparkles className="size-3 text-brand-orange" />
                        Conseil n°1 cette semaine
                      </span>
                      <p className="mt-5 font-heading text-[21px] font-bold leading-snug">
                        {TOP_CONSEILS[0].titre}
                      </p>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
                        {TOP_CONSEILS[0].extrait}
                      </p>
                      <p className="mt-4 flex items-center gap-2 text-xs font-medium text-white/60">
                        <Clock className="size-3.5 shrink-0 text-brand-orange" />
                        {TOP_CONSEILS[0].lecture} min de lecture · {catOf(TOP_CONSEILS[0].cat).label}
                      </p>
                      <div className="mt-5 flex items-center gap-5 border-t border-white/10 pt-4 text-[11px] text-white/60">
                        <span>
                          <strong className="font-heading text-sm font-bold text-white">{ARTICLES.length}</strong> conseils publiés
                        </span>
                        <span>
                          <strong className="font-heading text-sm font-bold text-white">{fmtVus(TOP_CONSEILS[0].vus)}</strong> lectures
                        </span>
                      </div>
                      <Link
                        to={`/conseils/${TOP_CONSEILS[0].slug}`}
                        className="group mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110"
                      >
                        Lire l'article
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </aside>
                </div>
                {/* Bandeau bas */}
                <div className="flex flex-col items-start justify-between gap-3 border-t border-outline-variant/40 bg-surface-container-low/60 px-5 py-4 sm:flex-row sm:items-center md:px-8 lg:px-12">
                  <p className="flex items-center gap-2 text-[13px] text-on-surface-variant">
                    <BookOpen className="size-4 shrink-0 text-brand-orange" />
                    Un conseil pratique glissé dans chaque récapitulatif quotidien, envoyé à 8h00.
                  </p>
                  <Link
                    to="/inscription"
                    className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-navy transition-colors hover:text-brand-orange"
                  >
                    Créer mon alerte gratuite
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </MegaPanel>
            )}
          </AnimatePresence>
        </div>

        {/* ── Menu mobile (mega-menus en accordéons) ─────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-outline-variant/30 bg-white lg:hidden"
            >
              <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 py-5 md:px-8">
                {/* Liens principaux */}
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="rounded-md px-3 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-brand-navy"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>

                {/* Offres & Conseils en accordéons */}
                <div className="mt-3">
                  <Accordion type="single" collapsible className="w-full border-none">
                    {/* ---- Accordéon Offres ---- */}
                    <AccordionItem value="offres" className="border-none mb-1">
                      <AccordionTrigger className="rounded-md px-3 py-2.5 data-[state=open]:bg-surface-container-low/80 hover:bg-surface-container-low/80 hover:no-underline">
                        <span className="text-sm font-semibold text-on-surface-variant">Offres d'emploi</span>
                      </AccordionTrigger>

                      <AccordionContent className="px-2 pb-3 pt-1 [&_a]:no-underline">
                        <Link
                          to="/offres"
                          className="mb-2 flex items-center justify-between rounded-md bg-brand-navy px-3 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-orange hover:text-white!"
                        >
                          Voir toutes les offres
                          <ArrowRight className="size-4" />
                        </Link>
                        <p className="mb-1.5 mt-2 px-1 font-heading text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Filières métiers
                        </p>
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-2 gap-1.5 md:grid-cols-3 xl:grid-cols-4"
                        >
                          {FILIERES.map((f) => (
                            <MenuTile key={f.to} item={f} />
                          ))}
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Liens secondaires */}
                <nav className="mt-3 flex flex-col gap-1">
                  <Link
                    to="/conseils"
                    className="rounded-md px-3 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-brand-navy"
                  >
                    Conseils & Analyses
                  </Link>

                  {NAV_LINKS_AFTER.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="rounded-md px-3 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-brand-navy"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>

                {/* Actions */}
                <div className="mt-4 flex flex-col md:flex-row gap-2 border-t border-outline-variant/30 pt-4">
                  <Link
                    to="/admin/connexion"
                    className="inline-flex items-center justify-center rounded-md border border-outline-variant/60 px-4 py-2.5 w-full text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white duration-400"
                  >
                    Connexion
                  </Link>

                  <Link
                    to="/inscription"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-orange px-4 py-2.5 text-sm font-semibold  w-full text-white transition-all hover:brightness-110"
                  >
                    <Bell className="size-4" />
                    Créer une alerte
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header