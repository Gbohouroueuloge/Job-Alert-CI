// src/pages/details-filiere/index.jsx
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AnimatePresence, animate, motion, useInView } from "framer-motion"
import {
  ArrowRight, ArrowUpRight, ArrowUpDown, Bell, Bookmark, BookmarkCheck,
  Briefcase, Building2, CalendarDays, Check, ChevronDown, ChevronLeft,
  ChevronRight, Clock, Code2, Filter as FilterIcon,
  GraduationCap, Handshake, HardHat, LayoutGrid, Layers, List, Mail, MapPin,
  Megaphone, Radar, Search, SearchX, Send, ShieldCheck, SlidersHorizontal,
  Sparkles, Sprout, Stethoscope, Truck, Users, UtensilsCrossed, X, Zap,
  Calculator,
} from "lucide-react"
import { FaLinkedin } from "react-icons/fa6"
import { cn } from "@/lib/utils"
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer"
import Seo from "@/components/seo/Seo"
import { getImgSource } from "@/utils/utilsSource"
import { filiereSeo } from "@/lib/seo"

/* ════════════════════════════════════════════════════════════════════
  DONNÉES
════════════════════════════════════════════════════════════════════ */

/* Palette par teinte — mêmes couleurs que le mega-menu du header */
const HUES = {
  sky: { dot: "bg-sky-500", tile: "bg-sky-500/10 text-sky-600", solid: "bg-sky-600", glow: "bg-sky-400/20", accent: "text-sky-600", hex: "#0ea5e9" },
  fuchsia: { dot: "bg-fuchsia-500", tile: "bg-fuchsia-500/10 text-fuchsia-600", solid: "bg-fuchsia-600", glow: "bg-fuchsia-400/20", accent: "text-fuchsia-600", hex: "#d946ef" },
  orange: { dot: "bg-orange-500", tile: "bg-orange-500/10 text-orange-600", solid: "bg-orange-600", glow: "bg-orange-400/20", accent: "text-orange-600", hex: "#f97316" },
  emerald: { dot: "bg-emerald-500", tile: "bg-emerald-500/10 text-emerald-600", solid: "bg-emerald-600", glow: "bg-emerald-400/20", accent: "text-emerald-600", hex: "#10b981" },
  violet: { dot: "bg-violet-500", tile: "bg-violet-500/10 text-violet-600", solid: "bg-violet-600", glow: "bg-violet-400/20", accent: "text-violet-600", hex: "#8b5cf6" },
  amber: { dot: "bg-amber-500", tile: "bg-amber-500/10 text-amber-600", solid: "bg-amber-600", glow: "bg-amber-400/20", accent: "text-amber-600", hex: "#f59e0b" },
  cyan: { dot: "bg-cyan-500", tile: "bg-cyan-500/10 text-cyan-600", solid: "bg-cyan-600", glow: "bg-cyan-400/20", accent: "text-cyan-600", hex: "#06b6d4" },
  rose: { dot: "bg-rose-500", tile: "bg-rose-500/10 text-rose-600", solid: "bg-rose-600", glow: "bg-rose-400/20", accent: "text-rose-600", hex: "#f43f5e" },
  blue: { dot: "bg-blue-500", tile: "bg-blue-500/10 text-blue-600", solid: "bg-blue-600", glow: "bg-blue-400/20", accent: "text-blue-600", hex: "#3b82f6" },
  indigo: { dot: "bg-indigo-500", tile: "bg-indigo-500/10 text-indigo-600", solid: "bg-indigo-600", glow: "bg-indigo-400/20", accent: "text-indigo-600", hex: "#6366f1" },
  teal: { dot: "bg-teal-500", tile: "bg-teal-500/10 text-teal-600", solid: "bg-teal-600", glow: "bg-teal-400/20", accent: "text-teal-600", hex: "#14b8a6" },
  lime: { dot: "bg-lime-500", tile: "bg-lime-500/10 text-lime-600", solid: "bg-lime-600", glow: "bg-lime-400/20", accent: "text-lime-600", hex: "#84cc16" },
  red: { dot: "bg-red-500", tile: "bg-red-500/10 text-red-600", solid: "bg-red-600", glow: "bg-red-400/20", accent: "text-red-600", hex: "#ef4444" },
}

const FILIERES_META = [
  {
    code: "tech-dev", label: "Tech & Dev", icon: Code2, hue: "sky", actives: 34, abonnes: 1840,
    tagline: "Développement, data, infra & produit digital",
    desc: "Du full-stack à la data, en passant par le mobile et le cloud : la filière la plus dynamique du marché ivoirien.",
    keywords: ["développeur", "ingénieur logiciel", "full-stack", "devops", "data", "mobile"],
    specialites: ["Développement web", "Data & IA", "Cloud & Infra", "Mobile"]
  },
  {
    code: "marketing-com", label: "Marketing & Com", icon: Megaphone, hue: "fuchsia", actives: 21, abonnes: 1120,
    tagline: "Marque, contenu, médias & growth",
    desc: "Communication, brand et création : les métiers qui donnent une voix aux entreprises de Côte d'Ivoire.",
    keywords: ["communication", "community", "marketing", "graphiste", "brand"],
    specialites: ["Communication", "Marketing digital", "Création & Design", "Médias"]
  },
  {
    code: "commercial-vente", label: "Commercial & Vente", icon: Handshake, hue: "orange", actives: 18, abonnes: 960,
    tagline: "Vente, grands comptes & développement d'affaires",
    desc: "Terrain, négociation et grands comptes : le moteur de la croissance des entreprises ivoiriennes.",
    keywords: ["commercial", "vente", "business developer", "grands comptes"],
    specialites: ["Vente terrain", "B2B & Grands comptes", "Retail", "Téléconseil"]
  },
  {
    code: "comptabilite-finance", label: "Comptabilité & Finance", icon: Calculator, hue: "emerald", actives: 16, abonnes: 1310,
    tagline: "Finance, audit, contrôle & gestion",
    desc: "Banques, cabinets et grands groupes : la place financière d'Abidjan embauche.",
    keywords: ["comptable", "audit", "contrôle de gestion", "finance"],
    specialites: ["Comptabilité", "Audit", "Contrôle de gestion", "Banque"]
  },
  {
    code: "ressources-humaines", label: "Ressources Humaines", icon: Users, hue: "violet", actives: 15, abonnes: 890,
    tagline: "Recrutement, paie, formation & développement RH",
    desc: "Recrutement, paie et formation : celles et ceux qui font grandir les équipes.",
    keywords: ["recrutement", "rh", "paie", "formation", "ressources humaines"],
    specialites: ["Recrutement", "Paie & ADP", "Formation", "Gestion RH"]
  },
  {
    code: "btp-genie-civil", label: "BTP & Génie Civil", icon: HardHat, hue: "amber", actives: 14, abonnes: 720,
    tagline: "Chantiers, génie civil & infrastructures",
    desc: "Des chantiers d'Abidjan aux routes de l'intérieur : les métiers qui construisent la Côte d'Ivoire.",
    keywords: ["chantier", "génie civil", "conducteur de travaux", "topographe"],
    specialites: ["Conduite de travaux", "Études & ingénierie", "Chantier", "Topographie"]
  },
  {
    code: "logistique-transport", label: "Logistique & Transport", icon: Truck, hue: "cyan", actives: 12, abonnes: 640,
    tagline: "Transit, douane, supply chain & distribution",
    desc: "Transit, douane et supply chain : la colonne vertébrale du premier hub portuaire d'Afrique de l'Ouest.",
    keywords: ["logistique", "transit", "douane", "supply chain", "magasinier"],
    specialites: ["Transit & Douane", "Supply chain", "Transport", "Magasinage"]
  },
  {
    code: "sante-medical", label: "Santé & Médical", icon: Stethoscope, hue: "rose", actives: 11, abonnes: 830,
    tagline: "Soins, pharma, labo & professions médicales",
    desc: "Soignants, pharmaciens et techniciens : les métiers au service de la santé des Ivoiriens.",
    keywords: ["infirmier", "médecin", "pharmacien", "laboratoire", "sage-femme"],
    specialites: ["Soins infirmiers", "Médecine", "Pharmacie", "Laboratoire"]
  },
  {
    code: "administration", label: "Administration", icon: Building2, hue: "blue", actives: 10, abonnes: 580,
    tagline: "Assistanat, gestion & services généraux",
    desc: "Le socle de toute organisation : assistanat, office management et services généraux.",
    keywords: ["assistant", "office manager", "secrétaire", "services généraux"],
    specialites: ["Assistanat de direction", "Office management", "Secrétariat", "Services généraux"]
  },
  {
    code: "education-formation", label: "Éducation & Formation", icon: GraduationCap, hue: "indigo", actives: 9, abonnes: 510,
    tagline: "Enseignement, pédagogie & formation professionnelle",
    desc: "Écoles, ONG et instituts : transmettre et former, un secteur qui se réinvente.",
    keywords: ["enseignant", "formateur", "pédagogie", "professeur"],
    specialites: ["Enseignement", "Formation professionnelle", "Pédagogie", "Éducation spécialisée"]
  },
  {
    code: "hotellerie-restauration", label: "Hôtellerie & Restauration", icon: UtensilsCrossed, hue: "teal", actives: 8, abonnes: 450,
    tagline: "Cuisine, salle, hébergement & hospitalité",
    desc: "Hôtels, restaurants et traiteurs : l'hospitalité ivoirienne en plein essor.",
    keywords: ["chef", "serveur", "hôtellerie", "restauration", "barman"],
    specialites: ["Cuisine", "Salle & Bar", "Hébergement", "Traiteur"]
  },
  {
    code: "agriculture-agrobusiness", label: "Agriculture & Agrobusiness", icon: Sprout, hue: "lime", actives: 7, abonnes: 390,
    tagline: "Du champ à l'usine : cacao, cajou & agro-industrie",
    desc: "La filière cacao-cajou et l'agro-industrie embauchent, du champ à l'usine.",
    keywords: ["agronome", "agricole", "plantation", "agro-industrie"],
    specialites: ["Agronomie", "Production", "Transformation", "Plantation"]
  },
  {
    code: "securite-gardiennage", label: "Sécurité & Gardiennage", icon: ShieldCheck, hue: "red", actives: 6, abonnes: 310,
    tagline: "Sûreté, gardiennage & protection des sites",
    desc: "Entreprises et sites sensibles : des métiers de confiance, en CDI comme en mission.",
    keywords: ["agent de sécurité", "gardiennage", "sûreté", "cynophile"],
    specialites: ["Gardiennage", "Sûreté aéroportuaire", "Cynophile", "Supervision"]
  },
]

const SOURCES = [
  { code: "EmploiDakar CI", bg: "#0F2D4D", short: "ED" },
  { code: "GoAfrica", bg: "#0F766E", short: "GA" },
  { code: "Novojob", bg: "#B45309", short: "NJ" },
  { code: "LinkedIn", bg: "#0A66C2", short: "in", linkedin: true },
]

const CONTRATS = ["CDI", "CDD", "Stage", "Mission", "Alternance"]
const EXPERIENCES = ["Débutant", "1-3 ans", "3-5 ans", "5 ans+"]
const NIVEAUX = ["Bac", "Bac+2", "Bac+3", "Bac+5", "Bac+8"]

const SORTS = [
  { k: "recent", l: "Plus récentes" },
  { k: "old", l: "Plus anciennes" },
  { k: "az", l: "Titre A → Z" },
  { k: "ent", l: "Entreprise A → Z" },
]

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
  OUTILS
════════════════════════════════════════════════════════════════════ */

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
const sameDay = (a, b) => !!a && !!b &&
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const fmtDay = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })

const publieLabel = (jours) =>
  jours === 0 ? "Aujourd'hui" : jours === 1 ? "Hier" : `Il y a ${jours} j`

const useClickOutside = (ref, onOutside) => {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [ref, onOutside])
}

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
  return (
    <span ref={ref}>
      {value.toLocaleString("fr-FR")}{suffix}
    </span>
  )
}

/* ════════════════════════════════════════════════════════════════════
  ATOMES
════════════════════════════════════════════════════════════════════ */

const SourceLogo = ({ code, className = "size-4 text-[9px]" }) => {
  const s = SOURCES.find((x) => x.code === code)
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded font-heading font-extrabold text-white", className)}

    >
      {s.linkedin ? <FaLinkedin className="size-2.5" style={{ background: s.bg }} /> : <img src={getImgSource(code)} alt={code} className="h-full size-5 object-contain" />}
    </span>
  )
}

const ChipSource = ({ source }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-outline-variant/50 bg-surface-container-low/60 px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant">
        {source === "LinkedIn"
          ? <FaLinkedin className="size-3 text-[#0A66C2]" />
          : <img src={getImgSource(source)} alt={source} className="h-full size-5 object-contain" />}
        {source}
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">Collectée sur {source} ce matin</TooltipContent>
  </Tooltip>
)

const CheckRow = ({ checked, onToggle, label, count, lead }) => (
  <button
    onClick={onToggle}
    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-container-low"
  >
    <span
      className={cn(
        "grid size-4.5 shrink-0 place-items-center rounded-[5px] border transition-all duration-200",
        checked ? "border-brand-navy bg-brand-navy" : "border-outline-variant bg-white"
      )}
    >
      <AnimatePresence>
        {checked && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
            <Check className="size-3 text-white" strokeWidth={3.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
    {lead}
    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-on-surface">{label}</span>
    {count != null && <span className="text-[11px] font-semibold text-muted-foreground">{count}</span>}
  </button>
)

const FilterPopover = ({ label, icon: Icon, count = 0, open, onToggle, onClose, align = "left", panelClassName, children }) => {
  const ref = useRef(null)
  useClickOutside(ref, onClose)
  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-all duration-200",
          count > 0 || open
            ? "border-brand-navy bg-brand-navy text-white shadow-soft"
            : "border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-brand-navy/40 hover:text-brand-navy"
        )}
      >
        {Icon && <Icon className="size-3.5" />}
        {label}
        {count > 0 && (
          <span className={cn(
            "grid size-4 place-items-center rounded-full text-[10px] font-black",
            open ? "bg-white text-brand-navy" : "bg-brand-orange text-white"
          )}>
            {count}
          </span>
        )}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute top-full z-50 mt-2 w-60 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-2.5 shadow-hover",
              align === "right" ? "right-0" : "left-0",
              panelClassName
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Mini-calendrier de période */
const MOIS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
const JOURS_FR = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]

const MiniCalendar = ({ range, onChange, hue }) => {
  const today = startOfDay(new Date())
  const [view, setView] = useState(() => new Date((range.end || range.start || today).getFullYear(), (range.end || range.start || today).getMonth(), 1))
  const year = view.getFullYear()
  const month = view.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  const { start, end } = range
  const inRange = (d) => start && end && d > start && d < end
  const atBound = (d) => sameDay(d, start) || sameDay(d, end)
  const monthStart = new Date(year, month, 1)
  const canPrev = monthStart <= addDays(today, -today.getDate() + 1) && !sameDay(monthStart, new Date(today.getFullYear(), today.getMonth(), 1))
  const canNext = monthStart < new Date(today.getFullYear(), today.getMonth(), 1)

  const pick = (d) => {
    if (!start || (start && end)) return onChange({ start: d, end: null })
    if (d < start) return onChange({ start: d, end: start })
    onChange({ start, end: d })
  }

  const presets = [
    { l: "Aujourd'hui", r: { start: today, end: today } },
    { l: "3 jours", r: { start: addDays(today, -2), end: today } },
    { l: "7 jours", r: { start: addDays(today, -6), end: today } },
    { l: "30 jours", r: { start: addDays(today, -29), end: today } },
  ]

  return (
    <div>
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => setView(new Date(year, month - 1, 1))}
          disabled={!canPrev}
          aria-label="Mois précédent"
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-container-low hover:text-brand-navy disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-heading text-[13px] font-bold text-brand-navy">
          {MOIS_FR[month]} <span className="font-medium text-muted-foreground">{year}</span>
        </p>
        <button
          onClick={() => setView(new Date(year, month + 1, 1))}
          disabled={!canNext}
          aria-label="Mois suivant"
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-container-low hover:text-brand-navy disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-0.5 text-center">
        {JOURS_FR.map((d) => (
          <span key={d} className="py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{d}</span>
        ))}
        {cells.map((d, i) =>
          !d ? (
            <span key={`e${i}`} />
          ) : (
            <button
              key={d.toISOString()}
              onClick={() => pick(d)}
              disabled={d > today}
              className={cn(
                "relative mx-auto grid size-8 place-items-center rounded-full text-xs font-semibold transition-all duration-150",
                atBound(d)
                  ? cn("text-white shadow-sm", hue.solid)
                  : inRange(d)
                    ? "bg-surface-container-high text-brand-navy"
                    : "text-on-surface hover:bg-surface-container-low",
                d > today && "pointer-events-none opacity-25",
                sameDay(d, today) && !atBound(d) && "ring-1 ring-brand-orange"
              )}
            >
              {d.getDate()}
            </button>
          )
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-outline-variant/40 pt-3">
        {presets.map((p) => (
          <button
            key={p.l}
            onClick={() => onChange(p.r)}
            className="rounded-full border border-outline-variant/60 px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant transition-colors hover:border-brand-navy hover:text-brand-navy"
          >
            {p.l}
          </button>
        ))}
        {(start || end) && (
          <button
            onClick={() => onChange({ start: null, end: null })}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-brand-orange transition-colors hover:bg-brand-orange/10"
          >
            <X className="size-3" /> Effacer
          </button>
        )}
      </div>

      <p className="mt-2.5 rounded-lg bg-surface-container-low px-3 py-2 text-[11px] font-semibold text-on-surface-variant">
        <CalendarDays className="mr-1.5 inline size-3.5 -translate-y-px text-brand-orange" />
        {start && end
          ? `Du ${fmtDay(start)} au ${fmtDay(end)}`
          : start
            ? `À partir du ${fmtDay(start)} — choisissez une fin`
            : "Toutes les dates"}
      </p>
    </div>
  )
}

const ViewToggle = ({ view, onChange }) => (
  <div className="flex shrink-0 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-0.5">
    {[{ k: "list", I: List }, { k: "grid", I: LayoutGrid }].map(({ k, I }) => (
      <button
        key={k}
        onClick={() => onChange(k)}
        aria-label={k === "list" ? "Vue liste" : "Vue grille"}
        className={cn(
          "rounded-md p-1.5 transition-all duration-200",
          view === k ? "bg-brand-navy text-white shadow-soft" : "text-muted-foreground hover:text-brand-navy"
        )}
      >
        <I className="size-4" />
      </button>
    ))}
  </div>
)

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
      className="relative mx-auto w-full max-w-md md:max-w-none"
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
              <p className="mt-2 max-w-xl text-lg leading-relaxed text-on-surface-variant">
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
              <Link
                to="/filieres"
                className="group inline-flex items-center justify-center gap-2 rounded-lg border border-brand-navy/15 bg-white/70 px-6 py-3.5 text-base font-semibold text-brand-navy backdrop-blur-sm transition-all duration-300 hover:border-brand-navy/35 hover:bg-white"
              >
                <LayoutGrid className="size-4" />
                Toutes les filieres
              </Link>
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
  Card OFFRE
════════════════════════════════════════════════════════════════════ */

const CompanyHover = ({ offre }) => (
  <HoverCard openDelay={200}>
    <HoverCardTrigger asChild>
      <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <Building2 className="size-3.5" />
        <span className="font-medium">{offre.entreprise}</span>
      </button>
    </HoverCardTrigger>
    <HoverCardContent align="start" className="w-64">
      <div className="flex gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-navy font-heading text-xs font-extrabold text-white">
          {offre.entreprise.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </span>
        <div>
          <p className="font-heading text-sm font-semibold">{offre.entreprise}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Recrute via {offre.source}</p>
          <p className="text-xs text-muted-foreground">
            {Object.values(OFFRES).flat().filter((x) => x.entreprise === offre.entreprise).length} offre(s) active(s) sur JobAlert CI
          </p>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
)

const OfferCard = ({ offre, index, view, hue, filiere, saved, onToggleSave }) => {
  const isNew = offre.jours === 0

  const bookmark = (
    <motion.button
      whileTap={{ scale: 0.75 }}
      onClick={() => onToggleSave(offre.id)}
      aria-label="Enregistrer l'offre"
      className="shrink-0 rounded-lg border border-outline-variant/50 bg-white p-2 text-muted-foreground transition-colors hover:border-brand-orange/50 hover:text-brand-orange"
    >
      {saved ? <BookmarkCheck className="size-4 text-brand-orange" /> : <Bookmark className="size-4" />}
    </motion.button>
  )

  const newBadge = isNew && (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-orange/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#B45309]">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-brand-orange" />
      </span>
      Nouveau
    </span>
  )

  const metaChips = (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-md bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
        <GraduationCap className="size-3" />
        {offre.niveau}
      </span>
      <span className="inline-flex items-center gap-1 rounded-md bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
        <Briefcase className="size-3" />
        {offre.experience}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
        <span className={cn("size-1.5 rounded-full", hue.dot)} />
        {offre.specialite}
      </span>
    </div>
  )

  if (view === "grid") {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.45, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="group flex flex-col rounded-xl border border-outline-variant/40 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
        style={{ borderTop: `3px solid ${hue.hex}` }}
      >
        <div className="flex items-center justify-between gap-2">
          <ChipSource source={offre.source} />
          <div className="flex items-center gap-2">{newBadge}{bookmark}</div>
        </div>
        <Link
          to={`/filiere/${filiere}/${offre.id}`}
          className="mt-3 font-heading text-base font-bold leading-snug text-brand-navy transition-colors hover:text-brand-orange"
        >
          {offre.titre}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Building2 className="size-3.5" />
          <span className="font-medium">{offre.entreprise}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-md bg-surface-container-low px-2 py-0.5">
            <MapPin className="size-3" />
            {offre.ville}
          </span>
          <span className="rounded-md bg-surface-container-low px-2 py-0.5 font-semibold">{offre.contrat}</span>
        </div>
        <div className="mt-3">{metaChips}</div>
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/40 pt-3 text-xs text-muted-foreground">
          <span className={cn("font-semibold", isNew && "text-brand-orange")}>{publieLabel(offre.jours)}</span>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/filieres/${filiere}/${offre.id}`}
              className={cn("inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]", hue.solid)}
            >
              Voir l'offre
            </Link>

            <a
              href="#offre"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-1 font-heading font-bold text-[#B45309] transition-colors hover:underline"
            >
              Postuler
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </motion.article>
    )
  }

  const d = addDays(new Date(), -offre.jours)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-xl border border-outline-variant/40 bg-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover"
      style={{ borderLeft: `3px solid ${hue.hex}` }}
    >
      <div className="flex gap-4 p-4 sm:p-5">
        {/* Rail date */}
        <div className="hidden w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-low/70 sm:flex">
          {isNew ? (
            <>
              <span className="font-heading text-sm font-extrabold text-brand-orange">AUJ</span>
              <Clock className="mt-1 size-3.5 text-brand-orange" />
            </>
          ) : (
            <>
              <span className="font-heading text-xl font-extrabold leading-none text-brand-navy">{d.getDate()}</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")}
              </span>
            </>
          )}
        </div>

        {/* Contenu */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/filiere/${filiere}/${offre.id}`}
                  className="font-heading text-base font-bold leading-snug text-brand-navy transition-colors hover:text-brand-orange sm:text-lg"
                >
                  {offre.titre}
                </Link>
                {newBadge}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <CompanyHover offre={offre} />
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {offre.ville}
                </span>
                <span className="rounded-md border border-outline-variant/60 px-2 py-0.5 text-xs font-semibold text-on-surface-variant">
                  {offre.contrat}
                </span>
              </div>
            </div>
            {bookmark}
          </div>

          <div className="mt-3">{metaChips}</div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ChipSource source={offre.source} />
              <span className={cn("text-xs font-semibold", isNew ? "text-brand-orange" : "text-muted-foreground")}>
                {publieLabel(offre.jours)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                to={`/filieres/${filiere}/${offre.id}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-3.5 text-xs font-bold text-white bg-secondary-container shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
              >
                Voir l'offre
              </Link>

              <a
                href="#offre"
                onClick={(e) => e.preventDefault()}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-3.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]",
                  hue.solid
                )}
              >
                Postuler
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

/* ════════════════════════════════════════════════════════════════════
  FILTRES — groupes partagés desktop (popovers) / mobile (drawer)
════════════════════════════════════════════════════════════════════ */

const FilterGroup = ({ title, icon: Icon, children, action }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between px-1">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {Icon && <Icon className="size-3.5 text-brand-orange" />}
        {title}
      </p>
      {action}
    </div>
    {children}
  </div>
)

const FilterGroups = ({ meta, hue, filters, toggle, counts, onPeriod }) => (
  <div className="flex flex-col gap-5">
    <FilterGroup title="Source" icon={Layers}>
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
    </FilterGroup>

    <FilterGroup title="Spécialité" icon={Sparkles}>
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
    </FilterGroup>

    <FilterGroup title="Type d'emploi" icon={Briefcase}>
      {CONTRATS.map((c) => (
        <CheckRow
          key={c}
          checked={filters.contrats.has(c)}
          onToggle={() => toggle("contrats", c)}
          label={c}
          count={counts.contrats[c] || 0}
        />
      ))}
    </FilterGroup>

    <FilterGroup title="Expérience" icon={Zap}>
      {EXPERIENCES.map((x) => (
        <CheckRow
          key={x}
          checked={filters.experiences.has(x)}
          onToggle={() => toggle("experiences", x)}
          label={x}
          count={counts.experiences[x] || 0}
        />
      ))}
    </FilterGroup>

    <FilterGroup title="Niveau d'études" icon={GraduationCap}>
      {NIVEAUX.map((n) => (
        <CheckRow
          key={n}
          checked={filters.niveaux.has(n)}
          onToggle={() => toggle("niveaux", n)}
          label={n}
          count={counts.niveaux[n] || 0}
        />
      ))}
    </FilterGroup>

    <FilterGroup
      title="Date de publication"
      icon={CalendarDays}
      action={
        (filters.period.start || filters.period.end) && (
          <button
            onClick={() => onPeriod({ start: null, end: null })}
            className="text-[11px] font-bold text-brand-orange hover:underline"
          >
            Effacer
          </button>
        )
      }
    >
      <MiniCalendar range={filters.period} onChange={onPeriod} hue={hue} />
    </FilterGroup>
  </div>
)

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

const DetailsFiliere = () => {
  const { filiere } = useParams()
  const meta = FILIERES_META.find((f) => f.code === filiere)

  const offres = useMemo(() => (meta ? OFFRES[meta.code] || [] : []), [meta])
  const seo = filiereSeo({ meta, filiere, offres })

  const [filters, setFilters] = useState({
    query: "",
    sources: new Set(),
    contrats: new Set(),
    experiences: new Set(),
    niveaux: new Set(),
    specialites: new Set(),
    period: { start: null, end: null },
  })
  const [sort, setSort] = useState("recent")
  const [view, setView] = useState("list")
  const [saved, setSaved] = useState(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openPop, setOpenPop] = useState(null)
  const sortRef = useRef(null)

  useClickOutside(sortRef, () => setOpenPop((p) => (p === "sort" ? null : p)))

  const toggle = (key, value) =>
    setFilters((prev) => {
      const next = new Set(prev[key])
      next.has(value) ? next.delete(value) : next.add(value)
      return { ...prev, [key]: next }
    })

  const setPeriod = (period) => setFilters((prev) => ({ ...prev, period }))

  const resetFilters = () => {
    setFilters({
      query: "",
      sources: new Set(),
      contrats: new Set(),
      experiences: new Set(),
      niveaux: new Set(),
      specialites: new Set(),
      period: { start: null, end: null },
    })
    setSort("recent")
  }

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
    const q = filters.query.trim().toLowerCase()
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
  }, [offres, filters, sort])

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
  }, [filters])

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
                value={filters.query}
                onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
                placeholder="Rechercher un poste, une entreprise…"
                aria-label="Rechercher"
                className="h-9 w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest pl-9 pr-8 text-[13px] outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand-navy/50 focus:ring-2 focus:ring-brand-navy/10"
              />
              {filters.query && (
                <button
                  onClick={() => setFilters((p) => ({ ...p, query: "" }))}
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
                value={filters.query}
                onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
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
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[88vh]">
          <DrawerHeader className="border-b border-outline-variant/40 px-5 pb-4 pt-2">
            <DrawerTitle className="font-heading text-base font-bold text-brand-navy">
              Filtres · {meta.label}
            </DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground">
              {filtered.length} offre{filtered.length > 1 ? "s" : ""} correspondante{filtered.length > 1 ? "s" : ""} — mise à jour en direct
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterGroups
              meta={meta}
              hue={hue}
              filters={filters}
              toggle={toggle}
              counts={counts}
              onPeriod={setPeriod}
            />

            <div className="mt-6 border-t border-outline-variant/40 pt-5">
              <FilterGroup title="Trier par" icon={ArrowUpDown}>
                <div className="grid grid-cols-2 gap-2 px-1">
                  {SORTS.map((s) => (
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
                className={cn(
                  "flex-1 rounded-lg py-3 text-sm font-bold text-white shadow-soft transition-all hover:brightness-110 active:scale-[0.98]",
                  hue.solid
                )}
              >
                Voir {filtered.length} offre{filtered.length > 1 ? "s" : ""}
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
                    onClick={resetFilters}
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
                  onClick={resetFilters}
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
                    meta={meta}
                    filiere={filiere}
                    saved={saved.has(o.id)}
                    onToggleSave={toggleSave}
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
                    view="grid"
                    hue={hue}
                    meta={meta}
                    filiere={filiere}
                    saved={saved.has(o.id)}
                    onToggleSave={toggleSave}
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
