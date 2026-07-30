
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight, ArrowUpRight, ArrowUpDown, Bell,
  Briefcase, CalendarDays, Check, ChevronDown,
  ChevronRight, Clock, Filter as FilterIcon,
  GraduationCap, LayoutGrid, Layers, Mail,
  Radar, Search, SearchX, Send, ShieldCheck, SlidersHorizontal,
  Sparkles, X, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip"
import Seo from "@/components/seo/Seo"
import { filiereSeo } from "@/lib/seo"
import {
  CountUp, OfferCard, ChipSource, SourceLogo,
  CheckRow, FilterPopover, MiniCalendar, ViewToggle, FiltersDrawer, OfferFilterGroups,
  CtaLink,
} from "@/components/shared"
import { HUES } from "@/lib/hues"
import { FILIERES_META, SOURCES, CONTRATS, EXPERIENCES, NIVEAUX, SORTS } from "@/lib/referentiels"
import { startOfDay, addDays, sameDay, fmtDay } from "@/lib/dates"
import useClickOutside from "@/hooks/use-click-outside"
import { useUrlFilters } from "@/hooks/use-url-filters"


/* ════════════════════════════════════════════════════════════════════
  DONNÉES
════════════════════════════════════════════════════════════════════ */

let oid = 0
const O = (titre, entreprise, ville, contrat, source, jours, niveau, experience, specialite) =>
  ({ id: ++oid, titre, entreprise, ville, contrat, source, jours, niveau, experience, specialite })

const OFFRES = {
  "tech-dev": [
    O("Développeur Full-Stack React / Node", "Orange Côte d'Ivoire", "Abidjan · Plateau", "CDI", "LinkedIn", 0, "Bac+5", "3-5 ans", "Développement web"),
    O("Ingénieur Logiciel Java / Spring", "Société Générale CI", "Abidjan · Cocody", "CDI", "Novojob", 0, "Bac+5", "1-3 ans", "Développement web"),
    O("Data Analyst", "Wave", "Abidjan · Cocody", "CDI", "LinkedIn", 1, "Bac+5", "1-3 ans", "Data & IA"),
    O("Développeur Mobile Flutter", "Djamo", "Abidjan · Marcory", "CDI", "GoAfrica", 1, "Bac+3", "1-3 ans", "Mobile"),
    O("Administrateur Systèmes & Réseaux", "MTN Côte d'Ivoire", "Abidjan · Cocody", "CDD", "EmploiDakar CI", 2, "Bac+3", "3-5 ans", "Cloud & Infra"),
    O("Ingénieur DevOps Cloud", "Inova Tech", "Abidjan · Riviera", "CDI", "GoAfrica", 4, "Bac+5", "5 ans+", "Cloud & Infra"),
  ],
  "marketing-com": [
    O("Chargé de Communication Digitale", "CFAO Retail CI", "Abidjan · Treichville", "CDI", "LinkedIn", 0, "Bac+3", "1-3 ans", "Communication"),
    O("Community Manager", "Yango Côte d'Ivoire", "Abidjan · Cocody", "CDD", "Novojob", 0, "Bac+2", "Débutant", "Marketing digital"),
    O("Chef de Marque", "Nestlé Côte d'Ivoire", "Abidjan · Plateau", "CDI", "LinkedIn", 1, "Bac+5", "3-5 ans", "Marketing digital"),
    O("Graphiste / DA Junior", "Agence Voodoo", "Abidjan · Marcory", "Stage", "GoAfrica", 2, "Bac+3", "Débutant", "Création & Design"),
    O("Attaché de Presse", "Fraternité Matin", "Abidjan · Adjamé", "CDI", "EmploiDakar CI", 3, "Bac+3", "1-3 ans", "Médias"),
  ],
  "commercial-vente": [
    O("Commercial B2B", "Jumia Côte d'Ivoire", "Abidjan · Cocody", "CDI", "Novojob", 0, "Bac+3", "1-3 ans", "B2B & Grands comptes"),
    O("Responsable Grands Comptes", "Ecobank CI", "Abidjan · Plateau", "CDI", "LinkedIn", 0, "Bac+5", "5 ans+", "B2B & Grands comptes"),
    O("Business Developer", "SAMA Money", "Abidjan · Yopougon", "CDI", "GoAfrica", 1, "Bac+3", "3-5 ans", "Vente terrain"),
    O("Téléconseiller (H/F)", "CI Telecom", "Abidjan · Plateau", "CDD", "EmploiDakar CI", 2, "Bac+2", "Débutant", "Téléconseil"),
    O("Commercial Terrain", "Agro Distribution", "San Pédro", "Mission", "GoAfrica", 3, "Bac", "1-3 ans", "Vente terrain"),
  ],
  "comptabilite-finance": [
    O("Comptable Senior", "NSIA Banque", "Abidjan · Plateau", "CDI", "Novojob", 0, "Bac+3", "5 ans+", "Comptabilité"),
    O("Contrôleur de Gestion", "AGL Côte d'Ivoire", "Abidjan · Treichville", "CDI", "LinkedIn", 1, "Bac+5", "3-5 ans", "Contrôle de gestion"),
    O("Auditeur Interne", "Deloitte Côte d'Ivoire", "Abidjan · Cocody", "CDI", "LinkedIn", 1, "Bac+5", "1-3 ans", "Audit"),
    O("Aide-Comptable", "Prosuma", "Abidjan · Koumassi", "CDD", "EmploiDakar CI", 2, "Bac+2", "Débutant", "Comptabilité"),
    O("Trésorier", "BNI", "Abidjan · Plateau", "CDI", "EmploiDakar CI", 4, "Bac+5", "3-5 ans", "Banque"),
  ],
  "ressources-humaines": [
    O("Chargé de Recrutement", "KPMG Côte d'Ivoire", "Abidjan · Cocody", "CDI", "LinkedIn", 0, "Bac+5", "1-3 ans", "Recrutement"),
    O("Gestionnaire Paie & ADP", "SODECI", "Abidjan · Treichville", "CDI", "Novojob", 1, "Bac+3", "3-5 ans", "Paie & ADP"),
    O("Responsable Formation", "INPHB", "Yamoussoukro", "CDI", "GoAfrica", 2, "Bac+5", "5 ans+", "Formation"),
    O("Assistant RH", "Uniwax", "Abidjan · Yopougon", "CDD", "EmploiDakar CI", 2, "Bac+2", "Débutant", "Gestion RH"),
    O("Responsable RH", "Orange Côte d'Ivoire", "Abidjan · Cocody", "CDI", "LinkedIn", 3, "Bac+5", "5 ans+", "Gestion RH"),
  ],
  "btp-genie-civil": [
    O("Conducteur de Travaux", "SARI", "Abidjan · Cocody", "CDI", "GoAfrica", 0, "Bac+5", "3-5 ans", "Conduite de travaux"),
    O("Ingénieur Génie Civil", "BNETD", "Abidjan · Plateau", "CDI", "Novojob", 0, "Bac+5", "1-3 ans", "Études & ingénierie"),
    O("Chef de Chantier", "PFO Africa", "Abidjan · Abobo", "CDI", "EmploiDakar CI", 1, "Bac+2", "5 ans+", "Chantier"),
    O("Métreur-Vérificateur", "Bâtir Afrique", "Abidjan · Koumassi", "CDD", "LinkedIn", 2, "Bac+3", "1-3 ans", "Études & ingénierie"),
    O("Topographe", "AGEROUTE", "Bouaké", "CDI", "EmploiDakar CI", 4, "Bac+2", "3-5 ans", "Topographie"),
  ],
  "logistique-transport": [
    O("Agent de Transit", "AGL Côte d'Ivoire", "Abidjan · Treichville", "CDI", "Novojob", 0, "Bac+2", "1-3 ans", "Transit & Douane"),
    O("Déclarant en Douane", "Cargill Côte d'Ivoire", "San Pedro", "CDI", "LinkedIn", 0, "Bac+2", "3-5 ans", "Transit & Douane"),
    O("Responsable Logistique", "Air Côte d'Ivoire", "Abidjan · Port-Bouët", "CDI", "LinkedIn", 1, "Bac+5", "5 ans+", "Supply chain"),
    O("Magasinier", "Bernabé CI", "Abidjan · Yopougon", "CDD", "EmploiDakar CI", 2, "Bac", "Débutant", "Magasinage"),
    O("Supply Chain Analyst", "Olam Côte d'Ivoire", "Abidjan · Plateau", "CDI", "GoAfrica", 3, "Bac+5", "1-3 ans", "Supply chain"),
  ],
  "sante-medical": [
    O("Infirmier(ère) Diplômé(e) d'État", "CHU de Cocody", "Abidjan · Cocody", "CDI", "EmploiDakar CI", 0, "Bac+3", "Débutant", "Soins infirmiers"),
    O("Médecin Généraliste", "Polyclinique des Deux Plateaux", "Abidjan · Cocody", "CDI", "Novojob", 0, "Bac+8", "3-5 ans", "Médecine"),
    O("Pharmacien Adjoint", "Pharmacie de la Riviera", "Abidjan · Cocody", "CDI", "GoAfrica", 1, "Bac+8", "1-3 ans", "Pharmacie"),
    O("Technicien de Laboratoire", "Institut Pasteur de CI", "Abidjan · Cocody", "CDD", "LinkedIn", 2, "Bac+2", "1-3 ans", "Laboratoire"),
    O("Sage-femme", "CHR de Bouaké", "Bouaké", "CDI", "EmploiDakar CI", 3, "Bac+3", "3-5 ans", "Soins infirmiers"),
  ],
  "administration": [
    O("Assistant(e) de Direction", "Groupe SIFCA", "Abidjan · Treichville", "CDI", "Novojob", 0, "Bac+3", "3-5 ans", "Assistanat de direction"),
    O("Office Manager", "Deloitte CI", "Abidjan · Cocody", "CDI", "LinkedIn", 1, "Bac+5", "5 ans+", "Office management"),
    O("Agent Administratif", "Mairie de Cocody", "Abidjan · Cocody", "CDD", "GoAfrica", 2, "Bac+2", "Débutant", "Services généraux"),
    O("Secrétaire Comptable", "Cabinet Fiduciaire Ivoire", "Abidjan · Plateau", "CDI", "EmploiDakar CI", 3, "Bac+2", "1-3 ans", "Secrétariat"),
    O("Assistant(e) Services Généraux", "Bolloré CI", "Abidjan · Treichville", "Alternance", "GoAfrica", 4, "Bac+2", "Débutant", "Services généraux"),
  ],
  "education-formation": [
    O("Enseignant de Mathématiques", "Groupe Scolaire Excellence", "Abidjan · Cocody", "CDI", "EmploiDakar CI", 0, "Bac+5", "1-3 ans", "Enseignement"),
    O("Formateur Professionnel", "INJS", "Abidjan · Marcory", "CDD", "GoAfrica", 1, "Bac+3", "3-5 ans", "Formation professionnelle"),
    O("Conseiller Pédagogique", "UNICEF CI", "Abidjan · Cocody", "Mission", "LinkedIn", 2, "Bac+5", "5 ans+", "Pédagogie"),
    O("Professeur d'Anglais", "Institut Ivoire Langues", "Abidjan · Plateau", "CDD", "Novojob", 3, "Bac+3", "1-3 ans", "Enseignement"),
    O("Éducateur Spécialisé", "ONG Espoir Enfance", "Abidjan · Yopougon", "CDI", "EmploiDakar CI", 4, "Bac+3", "3-5 ans", "Éducation spécialisée"),
  ],
  "hotellerie-restauration": [
    O("Chef de Partie", "Hôtel Ivoire", "Abidjan · Cocody", "CDI", "Novojob", 0, "Bac+2", "3-5 ans", "Cuisine"),
    O("Serveur(se)", "Restaurant La Case", "Abidjan · Plateau", "CDD", "GoAfrica", 1, "Bac", "Débutant", "Salle & Bar"),
    O("Gouvernante", "Radisson Blu", "Abidjan · Port-Bouët", "CDI", "LinkedIn", 2, "Bac+2", "5 ans+", "Hébergement"),
    O("Barman", "Hôtel Tiama", "Abidjan · Plateau", "Mission", "EmploiDakar CI", 3, "Bac", "1-3 ans", "Salle & Bar"),
    O("Chef Pâtissier", "Traiteur Prestige", "Abidjan · Marcory", "CDI", "GoAfrica", 4, "Bac+2", "3-5 ans", "Cuisine"),
  ],
  "agriculture-agrobusiness": [
    O("Ingénieur Agronome", "ANADER", "Bouaké", "CDI", "EmploiDakar CI", 0, "Bac+5", "1-3 ans", "Agronomie"),
    O("Technicien Agricole", "SUCRIVOIRE", "Korhogo", "CDD", "GoAfrica", 1, "Bac+2", "Débutant", "Production"),
    O("Responsable Plantation", "Groupe SIFCA", "Dabou", "CDI", "LinkedIn", 2, "Bac+5", "5 ans+", "Plantation"),
    O("Agent de Production", "Cargill CI", "San Pédro", "Mission", "Novojob", 3, "Bac", "Débutant", "Transformation"),
    O("Technicien Qualité Agro", "Ivoire Cacao", "Abidjan · Treichville", "CDI", "EmploiDakar CI", 4, "Bac+3", "1-3 ans", "Transformation"),
  ],
  "securite-gardiennage": [
    O("Agent de Sécurité", "G4S CI", "Abidjan · Cocody", "CDI", "GoAfrica", 0, "Bac", "Débutant", "Gardiennage"),
    O("Superviseur Sécurité", "Aéroport FHB", "Abidjan · Port-Bouët", "CDI", "Novojob", 1, "Bac+2", "5 ans+", "Sûreté aéroportuaire"),
    O("Gardien de Nuit", "Société Bancaire", "Abidjan · Plateau", "CDD", "EmploiDakar CI", 2, "Bac", "1-3 ans", "Gardiennage"),
    O("Agent Cynophile", "Sécuritas CI", "Abidjan · Yopougon", "CDI", "LinkedIn", 3, "Bac", "3-5 ans", "Cynophile"),
    O("Agent de Sûreté", "Port Autonome d'Abidjan", "Abidjan · Treichville", "CDI", "GoAfrica", 4, "Bac+2", "1-3 ans", "Supervision"),
  ],
}

const AVATARS = [
  { init: "AK", cls: "bg-sky-600" },
  { init: "MC", cls: "bg-emerald-600" },
  { init: "SD", cls: "bg-fuchsia-600" },
  { init: "YK", cls: "bg-amber-600" },
]

/* ════════════════════════════════════════════════════════════════════
  HERO — identité de la filière + récap du jour
════════════════════════════════════════════════════════════════════ */

const RecapCard = ({ meta, hue, offres }) => {
  const preview = [...offres].sort((a, b) => a.jours - b.jours).slice(0, 3)
  const nouveaux = offres.filter((o) => o.jours === 0).length
  const restants = Math.max(meta.actives - preview.length, 0)

  const pipeline = [
    { icon: Radar, t: "06h02", l: "Collecte" },
    { icon: FilterIcon, t: "07h15", l: "Filtrage" },
    { icon: Send, t: "08h00", l: "Envoi" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md min-w-0 md:max-w-none"
    >
      <div className={cn("absolute -inset-8 rounded-full blur-3xl", hue.glow)} aria-hidden />

      <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-2 overflow-hidden rounded-2xl bg-brand-navy" aria-hidden>
        <div className="absolute inset-0 bg-pattern opacity-20" />
      </div>

      {/* Badges flottants */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
        transition={{ delay: 0.9, opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" } }}
        className={cn(
          "absolute -top-4 left-5 z-20 inline-flex -rotate-3 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg sm:-left-4",
          hue.solid
        )}
      >
        <Zap className="size-3" />
        +{nouveaux} offres ce matin
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

      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ delay: 1.2, opacity: { duration: 0.4 }, scale: { duration: 0.4 }, y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }}
        className="absolute -bottom-4 right-8 z-20 inline-flex rotate-2 items-center gap-1.5 rounded-full border border-outline-variant/50 bg-white px-3.5 py-1.5 text-[11px] font-bold text-on-surface shadow-hover"
      >
        <Mail className="size-3 text-brand-orange" />
        Envoyé à {meta.abonnes.toLocaleString("fr-FR")} abonnés
      </motion.span>

      {/* Carte principale */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/40 bg-white shadow-[0_24px_48px_-16px_rgba(15,45,77,0.22)]">
        <div className="flex items-center gap-3 border-b border-outline-variant/40 bg-surface-container-low/60 px-5 py-4">
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", hue.tile)}>
            <meta.icon className="size-4.5" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-bold text-brand-navy">Récap du jour · {meta.label}</p>
            <p className="text-[11px] text-muted-foreground">Filtré, dédoublonné, prêt à postuler</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Clock className="size-3" />
            08:00
          </span>
        </div>

        {/* Pipeline du matin */}
        <div className="border-b border-outline-variant/40 bg-surface-container-low/40 px-5 py-3">
          <div className="flex items-center">
            {pipeline.map((s, i) => (
              <Fragment key={s.t}>
                {i > 0 && (
                  <span className="relative mx-2 h-px flex-1 overflow-hidden bg-outline-variant/60">
                    <motion.span
                      className="absolute inset-y-0 w-3 rounded-full bg-brand-orange/80"
                      animate={{ left: ["-15%", "110%"] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    />
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <span className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full border bg-white",
                    i === 2 ? "border-brand-orange/50 text-brand-orange" : "border-outline-variant/60 text-muted-foreground"
                  )}>
                    <s.icon className="size-3.5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[10px] font-black text-brand-navy">{s.t}</span>
                    <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{s.l}</span>
                  </span>
                </span>
              </Fragment>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-outline-variant/30 px-3">
          {preview.map((o, i) => (
            <motion.li
              key={o.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.14, ease: "easeOut" }}
              className="group flex items-center gap-3 rounded-lg px-2 py-3.5 transition-colors hover:bg-surface-container-low/60"
            >
              <span className={cn("size-2 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-150", hue.dot)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-on-surface">{o.titre}</p>
                <p className="truncate text-[11px] text-muted-foreground">{o.entreprise} · {o.ville}</p>
              </div>
              {o.jours === 0 && (
                <span className="hidden shrink-0 rounded-full bg-brand-orange/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#B45309] sm:inline">
                  Nouveau
                </span>
              )}
              <ChipSource source={o.source} />
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-outline-variant/40 bg-surface-container-low/40 px-5 py-3.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            + {restants} autres offres dans l'email
          </span>
          <span className="shrink-0 rounded-md bg-brand-navy px-3 py-1.5 text-[11px] font-bold text-white">
            Ouvrir le récap'
          </span>
        </div>

        <div className="flex items-center gap-3 border-t border-outline-variant/40 px-5 py-3">
          <div className="flex -space-x-2">
            {AVATARS.map((a) => (
              <span key={a.init} className={cn("grid size-6 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white", a.cls)}>
                {a.init}
              </span>
            ))}
          </div>
          <p className="text-[11px] font-medium text-muted-foreground">
            <strong className="font-bold text-brand-navy">{meta.abonnes.toLocaleString("fr-FR")} abonnés</strong> reçoivent ce récap chaque matin
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const HeroFiliere = ({ meta, hue, offres }) => {
  const nouvelles = offres.filter((o) => o.jours === 0).length
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="absolute inset-0 bg-pattern opacity-50" aria-hidden />
      <div className={cn("absolute -top-32 right-[-10%] size-140 rounded-full blur-3xl", hue.glow)} aria-hidden />
      <div className="absolute -bottom-40 -left-40 size-120 rounded-full bg-brand-navy/4 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-12 md:pb-20 lg:pt-10">
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
          <Link to="/filieres" className="transition-colors hover:text-brand-navy">Filières</Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-brand-navy">{meta.label}</span>
        </motion.nav>

        <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Colonne gauche */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            className="flex flex-col items-start gap-5"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex items-center gap-3.5"
            >
              <span className={cn("flex size-16 items-center justify-center rounded-xl shadow-soft", hue.tile)}>
                <meta.icon className="size-8" strokeWidth={1.8} />
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-on-surface-variant backdrop-blur-sm">
                <span className={cn("size-1.5 rounded-full", hue.dot)} />
                Filière métier
              </span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              className="font-heading text-4xl font-black leading-[1.05] tracking-tight text-brand-navy sm:text-5xl xl:text-6xl"
            >
              {meta.label}
              <span className="mt-2 block text-xl font-bold leading-snug text-on-surface-variant sm:text-2xl">
                en Côte d'Ivoire.
              </span>
            </motion.h1>

            {/* Tagline + description (test2) */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            >
              <p className={cn("font-heading text-base font-bold sm:text-lg", hue.accent)}>{meta.tagline}</p>
              <p className="mt-2 max-w-xl md:text-lg leading-relaxed text-on-surface-variant">
                {meta.desc} Recevez les nouveautés de la filière chaque matin à 8h00 directement dans votre boîte mail des abonnés, sans recherche, sans doublon.
              </p>
            </motion.div>

            {/* Mots-clés de matching automatique (test2) */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            >
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                <Sparkles className="size-3.5 text-brand-orange" />
                Mots-clés de matching automatique
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {meta.keywords.map((kw) => (
                  <Tooltip key={kw}>
                    <TooltipTrigger asChild>
                      <span className="cursor-help rounded-full border border-outline-variant/60 bg-white/80 px-3 py-1 text-xs font-medium text-on-surface-variant backdrop-blur-sm transition-colors hover:border-brand-navy/40 hover:text-brand-navy">
                        {kw}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-56 text-center">
                      Les offres contenant « {kw} » sont automatiquement tagguées {meta.label}.
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </motion.div>

            {/* CTA (test1) */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              className="mt-1 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to={`/inscription?filieres=${meta.code}`}
                className={cn(
                  "group inline-flex items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_-8px_rgba(15,45,77,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]",
                  hue.solid
                )}
              >
                <Bell className="size-5 transition-transform duration-300 group-hover:rotate-12" />
                Créer une alerte {meta.label}
              </Link>

              <CtaLink to="/filieres" variant="secondary" icon={LayoutGrid}>
                Toutes les filieres
              </CtaLink>
            </motion.div>

            {/* Stats vivantes (test1) */}
            <motion.dl
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              {[
                { valeur: meta.actives, label: "offres actives" },
                { valeur: nouvelles, label: "nouvelles ce matin" },
                { valeur: meta.abonnes, label: "abonnés à l'alerte" },
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

          {/* Colonne droite */}
          <RecapCard meta={meta} hue={hue} offres={offres} />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
  PAGE
════════════════════════════════════════════════════════════════════ */

const FiliereIntrouvable = ({ code }) => (
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
        Filière « {code} » introuvable
      </h1>
      <p className="mt-3 text-on-surface-variant">
        Cette filière n'existe pas ou a été renommée. Découvrez les 13 filières couvertes par JobAlert CI.
      </p>
      <Link
        to="/filieres"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
      >
        <LayoutGrid className="size-4" />
        Voir les 13 filières
      </Link>
    </motion.div>
  </section>
)

/* Bandeau d'alerte */
const BandeauAlerte = ({ meta, hue }) => {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    navigate(`/inscription?filieres=${meta.code}&email=${encodeURIComponent(email.trim())}`)
  }
  return (
    <section className="bg-surface-container-lowest py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-xl bg-brand-navy"
        >
          <div className="pointer-events-none absolute inset-0 bg-pattern opacity-20" aria-hidden />
          <div className={cn("pointer-events-none absolute -right-24 -top-24 size-105 rounded-full blur-3xl", hue.glow)} aria-hidden />
          <meta.icon
            className="pointer-events-none absolute -bottom-10 -right-6 size-56 rotate-12 text-white/5"
            strokeWidth={1}
            aria-hidden
          />
          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">
            <div>
              <span className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white", hue.solid)}>
                <Bell className="size-3" />
                Alerte {meta.label}
              </span>
              <h2 className="mt-4 font-heading text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Soyez le premier à postuler.
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
                Les offres {meta.label.toLowerCase()} partent vite : les abonnés les reçoivent à 8h00, avant
                qu'elles n'apparaissent partout ailleurs. Votre premier récapitulatif arrive demain matin.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    aria-label="Votre adresse email"
                    className="h-12 w-full rounded-md border border-white/15 bg-white/10 pl-10 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-brand-orange focus:bg-white/[0.14] focus:ring-2 focus:ring-brand-orange/30"
                  />
                </div>
                <button
                  type="submit"
                  className={cn(
                    "group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 active:scale-[0.98]",
                    hue.solid
                  )}
                >
                  <Bell className="size-4 transition-transform duration-300 group-hover:rotate-12" />
                  Créer l'alerte
                </button>
              </form>
              <p className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/50">
                {["Gratuit pour toujours", "1 email par jour à 8h00", "Désinscription en 1 clic"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-400" />
                    {t}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* Autres filières — mélange test1 (header + chips) / test2 (cartes) */
const AutresFilieres = ({ codeActuel }) => (
  <section className="bg-surface-container-lowest pb-20">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between gap-4 border-t border-outline-variant/40 pt-10"
      >
        <h2 className="font-heading text-lg font-bold text-brand-navy sm:text-xl">Explorer les autres filières</h2>
        <Link
          to="/filieres"
          className="group inline-flex items-center gap-1 text-sm font-bold text-brand-navy transition-colors hover:text-brand-orange"
        >
          Tout voir
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FILIERES_META.filter((f) => f.code !== codeActuel).map((f, i) => {
          const h = HUES[f.hue]
          return (
            <motion.div
              key={f.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/filieres/${f.code}`}
                className="group flex items-center gap-3.5 rounded-xl border border-outline-variant/50 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-navy/25 hover:shadow-hover"
              >
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105", h.tile)}>
                  <f.icon className="size-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-heading text-sm font-bold text-brand-navy">
                    {f.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {f.actives} offres actives · {f.abonnes.toLocaleString("fr-FR")} abonnés
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-outline-variant transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-orange" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  </section>
)

/* ──────────────────────────────────────────────────────────────────── */

/* ═══ Filtres ↔ URL : /filieres/tech-dev?spec=Data+%26+IA&tri=az ═══ */
const CONFIG_FILTRES = {
  sets: [
    { key: "sources", param: "src" },
    { key: "contrats", param: "ct" },
    { key: "experiences", param: "exp" },
    { key: "niveaux", param: "niv" },
    { key: "specialites", param: "spec" },
  ],
  scalars: [
    { key: "sort", param: "tri", defaut: "recent" },
    { key: "view", param: "vue", defaut: "list" },
    { key: "query", param: "q", defaut: "" },
  ],
  period: { debut: "du", fin: "au" },
}

const DetailsFiliere = () => {
  const { filiere } = useParams()
  const meta = FILIERES_META.find((f) => f.code === filiere)

  const offres = useMemo(() => (meta ? OFFRES[meta.code] || [] : []), [meta])
  const seo = filiereSeo({ meta, filiere, offres })

  const { filters, valeurs, toggle, setScalar, setPeriod, reset } = useUrlFilters(CONFIG_FILTRES)
  const sort = SORTS.some((s) => s.k === valeurs.sort) ? valeurs.sort : "recent"
  const view = valeurs.view === "grid" ? "grid" : "list"
  const setSort = (k) => setScalar("sort", k)
  const setView = (v) => setScalar("view", v)

  const [queryLocale, setQueryLocale] = useState(valeurs.query)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setQueryLocale(valeurs.query) }, [valeurs.query])
  useEffect(() => {
    if (queryLocale === valeurs.query) return
    const t = setTimeout(() => setScalar("query", queryLocale), 350)
    return () => clearTimeout(t)
  }, [queryLocale, valeurs.query, setScalar])
  
  const [saved, setSaved] = useState(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openPop, setOpenPop] = useState(null)
  const sortRef = useRef(null)

  useClickOutside(sortRef, () => setOpenPop((p) => (p === "sort" ? null : p)))


  /* Compteurs par option (dans la filière) */
  const counts = useMemo(() => {
    const c = { sources: {}, contrats: {}, experiences: {}, niveaux: {}, specialites: {} }
    offres.forEach((o) => {
      c.sources[o.source] = (c.sources[o.source] || 0) + 1
      c.contrats[o.contrat] = (c.contrats[o.contrat] || 0) + 1
      c.experiences[o.experience] = (c.experiences[o.experience] || 0) + 1
      c.niveaux[o.niveau] = (c.niveaux[o.niveau] || 0) + 1
      c.specialites[o.specialite] = (c.specialites[o.specialite] || 0) + 1
    })
    return c
  }, [offres])

  /* Filtrage + tri */
  const filtered = useMemo(() => {
    const q = queryLocale.trim().toLowerCase()
    const today = startOfDay(new Date())
    let list = offres.filter((o) => {
      if (q && !(o.titre.toLowerCase().includes(q) || o.entreprise.toLowerCase().includes(q))) return false
      if (filters.sources.size && !filters.sources.has(o.source)) return false
      if (filters.contrats.size && !filters.contrats.has(o.contrat)) return false
      if (filters.experiences.size && !filters.experiences.has(o.experience)) return false
      if (filters.niveaux.size && !filters.niveaux.has(o.niveau)) return false
      if (filters.specialites.size && !filters.specialites.has(o.specialite)) return false
      if (filters.period.start || filters.period.end) {
        const d = addDays(today, -o.jours)
        if (filters.period.start && d < filters.period.start) return false
        if (filters.period.end && d > filters.period.end) return false
      }
      return true
    })
    if (sort === "recent") list = [...list].sort((a, b) => a.jours - b.jours)
    if (sort === "old") list = [...list].sort((a, b) => b.jours - a.jours)
    if (sort === "az") list = [...list].sort((a, b) => a.titre.localeCompare(b.titre, "fr"))
    if (sort === "ent") list = [...list].sort((a, b) => a.entreprise.localeCompare(b.entreprise, "fr"))
    return list
  }, [offres, filters, sort, queryLocale])

  /* Filtres actifs (chips) */
  const activeChips = useMemo(() => {
    const chips = []
    filters.sources.forEach((v) => chips.push({ key: `s-${v}`, label: v, rm: () => toggle("sources", v) }))
    filters.specialites.forEach((v) => chips.push({ key: `sp-${v}`, label: v, rm: () => toggle("specialites", v) }))
    filters.contrats.forEach((v) => chips.push({ key: `c-${v}`, label: v, rm: () => toggle("contrats", v) }))
    filters.experiences.forEach((v) => chips.push({ key: `e-${v}`, label: v, rm: () => toggle("experiences", v) }))
    filters.niveaux.forEach((v) => chips.push({ key: `n-${v}`, label: v, rm: () => toggle("niveaux", v) }))
    const { start, end } = filters.period
    if (start && end) {
      chips.push({
        key: "p",
        label: sameDay(start, end) ? fmtDay(start) : `${fmtDay(start)} → ${fmtDay(end)}`,
        rm: () => setPeriod({ start: null, end: null }),
      })
    } else if (start) {
      chips.push({ key: "p", label: `Depuis le ${fmtDay(start)}`, rm: () => setPeriod({ start: null, end: null }) })
    }
    return chips
  }, [filters.contrats, filters.experiences, filters.niveaux, filters.period, filters.sources, filters.specialites, setPeriod, toggle])

  const activeCount =
    filters.sources.size + filters.contrats.size + filters.experiences.size +
    filters.niveaux.size + filters.specialites.size +
    (filters.period.start || filters.period.end ? 1 : 0)

  const toggleSave = (id) =>
    setSaved((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  if (!meta) {
    return (
      <>
        <Seo {...seo} />
        <FiliereIntrouvable code={filiere} />
      </>
    )
  }

  const hue = HUES[meta.hue]
  const pop = (k) => ({ open: openPop === k, onToggle: () => setOpenPop((p) => (p === k ? null : k)), onClose: () => setOpenPop((p) => (p === k ? null : p)) })
  const periodLabel =
    filters.period.start && filters.period.end
      ? sameDay(filters.period.start, filters.period.end)
        ? fmtDay(filters.period.start)
        : `${fmtDay(filters.period.start)} → ${fmtDay(filters.period.end)}`
      : filters.period.start
        ? `Depuis le ${fmtDay(filters.period.start)}`
        : "Période"

  return (
    <>
      <Seo {...seo} />
      <main>
        <HeroFiliere meta={meta} hue={hue} offres={offres} />

        {/* ═══════════ Barre de filtres sticky ═══════════ */}
        <div className="sticky top-1/10 z-40 border-b border-outline-variant/40 bg-background/85 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-3 md:px-12">
            {/* Desktop */}
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              <div className="relative w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={queryLocale}
                  onChange={(e) => setQueryLocale(e.target.value)}
                  placeholder="Rechercher un poste, une entreprise…"
                  aria-label="Rechercher"
                  className="h-9 w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest pl-9 pr-8 text-[13px] outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand-navy/50 focus:ring-2 focus:ring-brand-navy/10"
                />
                {filters.query && (
                  <button
                    onClick={() => setQueryLocale("")}
                    aria-label="Effacer la recherche"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-navy"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <FilterPopover label="Sources" icon={Layers} count={filters.sources.size} {...pop("sources")}>
                {SOURCES.map((s) => (
                  <CheckRow
                    key={s.code}
                    checked={filters.sources.has(s.code)}
                    onToggle={() => toggle("sources", s.code)}
                    label={s.code}
                    count={counts.sources[s.code] || 0}
                    lead={<SourceLogo code={s.code} className="size-5 rounded text-[8px]" />}
                  />
                ))}
              </FilterPopover>

              <FilterPopover label="Spécialité" icon={Sparkles} count={filters.specialites.size} {...pop("spec")}>
                {meta.specialites.map((sp) => (
                  <CheckRow
                    key={sp}
                    checked={filters.specialites.has(sp)}
                    onToggle={() => toggle("specialites", sp)}
                    label={sp}
                    count={counts.specialites[sp] || 0}
                    lead={<span className={cn("size-2 shrink-0 rounded-full", hue.dot)} />}
                  />
                ))}
              </FilterPopover>

              <FilterPopover label="Contrat" icon={Briefcase} count={filters.contrats.size} {...pop("contrat")}>
                {CONTRATS.map((c) => (
                  <CheckRow key={c} checked={filters.contrats.has(c)} onToggle={() => toggle("contrats", c)} label={c} count={counts.contrats[c] || 0} />
                ))}
              </FilterPopover>

              <FilterPopover label="Expérience" icon={Zap} count={filters.experiences.size} {...pop("exp")}>
                {EXPERIENCES.map((x) => (
                  <CheckRow key={x} checked={filters.experiences.has(x)} onToggle={() => toggle("experiences", x)} label={x} count={counts.experiences[x] || 0} />
                ))}
              </FilterPopover>

              <FilterPopover label="Niveau" icon={GraduationCap} count={filters.niveaux.size} {...pop("niveau")}>
                {NIVEAUX.map((n) => (
                  <CheckRow key={n} checked={filters.niveaux.has(n)} onToggle={() => toggle("niveaux", n)} label={n} count={counts.niveaux[n] || 0} />
                ))}
              </FilterPopover>

              <FilterPopover
                label={periodLabel}
                icon={CalendarDays}
                count={filters.period.start || filters.period.end ? 1 : 0}
                align="right"
                panelClassName="w-[19.5rem] p-3"
                {...pop("period")}
              >
                <MiniCalendar range={filters.period} onChange={setPeriod} hue={hue} />
              </FilterPopover>

              <div className="ml-auto flex items-center gap-2.5">
                <span className="hidden text-xs text-muted-foreground xl:inline">
                  <strong className="font-heading text-sm font-bold text-brand-navy">{filtered.length}</strong> offre{filtered.length > 1 ? "s" : ""}
                </span>

                {/* Tri */}
                <div ref={sortRef} className="relative">
                  <button
                    onClick={() => setOpenPop((p) => (p === "sort" ? null : "sort"))}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-all duration-200",
                      openPop === "sort"
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-brand-navy/40 hover:text-brand-navy"
                    )}
                  >
                    <ArrowUpDown className="size-3.5" />
                    {SORTS.find((s) => s.k === sort).l}
                    <ChevronDown className={cn("size-3.5 transition-transform duration-200", openPop === "sort" && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {openPop === "sort" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-1.5 shadow-hover"
                      >
                        {SORTS.map((s) => (
                          <button
                            key={s.k}
                            onClick={() => { setSort(s.k); setOpenPop(null) }}
                            className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors hover:bg-surface-container-low"
                          >
                            {s.l}
                            {sort === s.k && <Check className="size-3.5 text-brand-orange" strokeWidth={3} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <ViewToggle view={view} onChange={setView} />
              </div>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={queryLocale}
                  onChange={(e) => setQueryLocale(e.target.value)}
                  placeholder="Rechercher…"
                  aria-label="Rechercher"
                  className="h-10 w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand-navy/50 focus:ring-2 focus:ring-brand-navy/10"
                />
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-bold transition-all",
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
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>
        </div>

        {/* ═══════════ Drawer mobile ═══════════ */}
        <FiltersDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title={`Filtres · ${meta.label}`}
          resultCount={filtered.length}
          sort={sort}
          onSort={setSort}
          onReset={() => reset() + setQueryLocale("")}
          ctaClassName={hue.solid}
        >
          <OfferFilterGroups
            groups={["sources", "specialites", "contrats", "experiences", "niveaux", "period"]}
            meta={meta}
            hue={hue}
            filters={filters}
            toggle={toggle}
            counts={counts}
            onPeriod={setPeriod}
          />
        </FiltersDrawer>

        {/* ═══════════ Liste des offres ═══════════ */}
        <section className="border-b border-outline-variant/30 bg-background py-12 md:py-16">
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
                  Collecte du jour
                </p>
                <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
                  Les offres <span className="text-brand-orange">{meta.label}</span> du moment
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="font-heading font-bold text-brand-navy">{filtered.length}</strong> offre{filtered.length > 1 ? "s" : ""}
                  {activeCount > 0 ? ` · ${activeCount} filtre${activeCount > 1 ? "s" : ""} actif${activeCount > 1 ? "s" : ""}` : ""} — triées par « {SORTS.find((s) => s.k === sort).l.toLowerCase()} »
                </p>
              </motion.div>
            </div>

            {/* Chips de filtres actifs */}
            <AnimatePresence>
              {activeChips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {activeChips.map((c) => (
                      <button
                        key={c.key}
                        onClick={c.rm}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-brand-navy/20 bg-brand-navy/5 px-3 py-1.5 text-xs font-semibold text-brand-navy transition-all hover:border-brand-orange/50 hover:bg-brand-orange/10"
                      >
                        {c.label}
                        <X className="size-3 text-muted-foreground transition-colors group-hover:text-brand-orange" />
                      </button>
                    ))}
                    <button
                      onClick={() => reset() + setQueryLocale("")}
                      className="text-xs font-bold text-brand-orange transition-colors hover:underline"
                    >
                      Tout effacer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feed */}
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 rounded-xl border border-dashed border-outline-variant/60 bg-white p-12 text-center"
                >
                  <SearchX className="mx-auto size-10 text-muted-foreground/50" />
                  <h3 className="mt-4 font-heading text-lg font-bold text-brand-navy">Aucune offre trouvée</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Essayez d'élargir vos filtres ou de modifier votre recherche.
                  </p>
                  <button
                    onClick={() => reset() + setQueryLocale("")}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand-navy/20 px-5 py-2.5 text-sm font-bold text-brand-navy transition-all hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                  >
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              ) : view === "list" ? (
                <motion.ul layout className="mt-8 flex flex-col gap-3">
                  {filtered.map((o, i) => (
                    <OfferCard
                      key={o.id}
                      offre={o}
                      index={i}
                      view="list"
                      hue={hue}
                      showFiliereChip={false}
                      showSpecialite
                      saved={saved.has(o.id)}
                      onToggleSave={toggleSave}
                      getDetailLink={(of) => `/offres/${of.id}`}
                      entrepriseTotal={Object.values(OFFRES).flat().filter((x) => x.entreprise === o.entreprise).length}
                    />
                  ))}
                </motion.ul>
              ) : (
                <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((o, i) => (
                    <OfferCard
                      key={o.id}
                      offre={o}
                      index={i}
                      view="list"
                      hue={hue}
                      showFiliereChip={false}
                      showSpecialite
                      saved={saved.has(o.id)}
                      onToggleSave={toggleSave}
                      getDetailLink={(of) => `/offres/${of.id}`}
                      entrepriseTotal={Object.values(OFFRES).flat().filter((x) => x.entreprise === o.entreprise).length}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              <span className={cn("size-1.5 rounded-full", hue.dot)} />
              Mises à jour chaque matin à 6h02 · lien direct vers l'annonce d'origine
            </p>
          </div>
        </section>

        <BandeauAlerte meta={meta} hue={hue} />
        <AutresFilieres codeActuel={filiere} />
      </main>
    </>
  )
}

export default DetailsFiliere
