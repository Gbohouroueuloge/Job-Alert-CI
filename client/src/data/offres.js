let oid = 0
const O = (titre, entreprise, ville, contrat, source, jours, niveau, experience) =>
  ({ id: ++oid, titre, entreprise, ville, contrat, source, jours, niveau, experience })

const OFFRES = {
  "tech-dev": [
    O("Développeur Full-Stack React / Node", "Orange Côte d'Ivoire", "Abidjan · Plateau", "CDI", "LinkedIn", 0, "Bac+5", "3-5 ans"),
    O("Ingénieur Logiciel Java / Spring", "Société Générale CI", "Abidjan · Cocody", "CDI", "Novojob", 0, "Bac+5", "1-3 ans"),
    O("Data Analyst", "Wave", "Abidjan · Cocody", "CDI", "LinkedIn", 1, "Bac+5", "1-3 ans"),
    O("Développeur Mobile Flutter", "Djamo", "Abidjan · Marcory", "CDI", "GoAfrica", 1, "Bac+3", "1-3 ans"),
    O("Administrateur Systèmes & Réseaux", "MTN Côte d'Ivoire", "Abidjan · Cocody", "CDD", "EmploiDakar CI", 2, "Bac+3", "3-5 ans"),
    O("Ingénieur DevOps Cloud", "Inova Tech", "Abidjan · Riviera", "CDI", "GoAfrica", 4, "Bac+5", "5 ans+"),
  ],
  "marketing-com": [
    O("Chargé de Communication Digitale", "CFAO Retail CI", "Abidjan · Treichville", "CDI", "LinkedIn", 0, "Bac+3", "1-3 ans"),
    O("Community Manager", "Yango Côte d'Ivoire", "Abidjan · Cocody", "CDD", "Novojob", 0, "Bac+2", "Débutant"),
    O("Chef de Marque", "Nestlé Côte d'Ivoire", "Abidjan · Plateau", "CDI", "LinkedIn", 1, "Bac+5", "3-5 ans"),
    O("Graphiste / DA Junior", "Agence Voodoo", "Abidjan · Marcory", "Stage", "GoAfrica", 2, "Bac+3", "Débutant"),
    O("Attaché de Presse", "Fraternité Matin", "Abidjan · Adjamé", "CDI", "EmploiDakar CI", 3, "Bac+3", "1-3 ans"),
  ],
  "commercial-vente": [
    O("Commercial B2B", "Jumia Côte d'Ivoire", "Abidjan · Cocody", "CDI", "Novojob", 0, "Bac+3", "1-3 ans"),
    O("Responsable Grands Comptes", "Ecobank CI", "Abidjan · Plateau", "CDI", "LinkedIn", 0, "Bac+5", "5 ans+"),
    O("Business Developer", "SAMA Money", "Abidjan · Yopougon", "CDI", "GoAfrica", 1, "Bac+3", "3-5 ans"),
    O("Téléconseiller (H/F)", "CI Telecom", "Abidjan · Plateau", "CDD", "EmploiDakar CI", 2, "Bac+2", "Débutant"),
    O("Commercial Terrain", "Agro Distribution", "San Pédro", "Mission", "GoAfrica", 3, "Bac", "1-3 ans"),
  ],
  "comptabilite-finance": [
    O("Comptable Senior", "NSIA Banque", "Abidjan · Plateau", "CDI", "Novojob", 0, "Bac+3", "5 ans+"),
    O("Contrôleur de Gestion", "AGL Côte d'Ivoire", "Abidjan · Treichville", "CDI", "LinkedIn", 1, "Bac+5", "3-5 ans"),
    O("Auditeur Interne", "Deloitte Côte d'Ivoire", "Abidjan · Cocody", "CDI", "LinkedIn", 1, "Bac+5", "1-3 ans"),
    O("Aide-Comptable", "Prosuma", "Abidjan · Koumassi", "CDD", "EmploiDakar CI", 2, "Bac+2", "Débutant"),
    O("Trésorier", "BNI", "Abidjan · Plateau", "CDI", "EmploiDakar CI", 4, "Bac+5", "3-5 ans"),
  ],
  "ressources-humaines": [
    O("Chargé de Recrutement", "KPMG Côte d'Ivoire", "Abidjan · Cocody", "CDI", "LinkedIn", 0, "Bac+5", "1-3 ans"),
    O("Gestionnaire Paie & ADP", "SODECI", "Abidjan · Treichville", "CDI", "Novojob", 1, "Bac+3", "3-5 ans"),
    O("Responsable Formation", "INPHB", "Yamoussoukro", "CDI", "GoAfrica", 2, "Bac+5", "5 ans+"),
    O("Assistant RH", "Uniwax", "Abidjan · Yopougon", "CDD", "EmploiDakar CI", 2, "Bac+2", "Débutant"),
    O("Responsable RH", "Orange Côte d'Ivoire", "Abidjan · Cocody", "CDI", "LinkedIn", 3, "Bac+5", "5 ans+"),
  ],
  "btp-genie-civil": [
    O("Conducteur de Travaux", "SARI", "Abidjan · Cocody", "CDI", "GoAfrica", 0, "Bac+5", "3-5 ans"),
    O("Ingénieur Génie Civil", "BNETD", "Abidjan · Plateau", "CDI", "Novojob", 0, "Bac+5", "1-3 ans"),
    O("Chef de Chantier", "PFO Africa", "Abidjan · Abobo", "CDI", "EmploiDakar CI", 1, "Bac+2", "5 ans+"),
    O("Métreur-Vérificateur", "Bâtir Afrique", "Abidjan · Koumassi", "CDD", "LinkedIn", 2, "Bac+3", "1-3 ans"),
    O("Topographe", "AGEROUTE", "Bouaké", "CDI", "EmploiDakar CI", 4, "Bac+2", "3-5 ans"),
  ],
  "logistique-transport": [
    O("Agent de Transit", "AGL Côte d'Ivoire", "Abidjan · Treichville", "CDI", "Novojob", 0, "Bac+2", "1-3 ans"),
    O("Déclarant en Douane", "Cargill Côte d'Ivoire", "San Pedro", "CDI", "LinkedIn", 0, "Bac+2", "3-5 ans"),
    O("Responsable Logistique", "Air Côte d'Ivoire", "Abidjan · Port-Bouët", "CDI", "LinkedIn", 1, "Bac+5", "5 ans+"),
    O("Magasinier", "Bernabé CI", "Abidjan · Yopougon", "CDD", "EmploiDakar CI", 2, "Bac", "Débutant"),
    O("Supply Chain Analyst", "Olam Côte d'Ivoire", "Abidjan · Plateau", "CDI", "GoAfrica", 3, "Bac+5", "1-3 ans"),
  ],
  "sante-medical": [
    O("Infirmier(ère) Diplômé(e) d'État", "CHU de Cocody", "Abidjan · Cocody", "CDI", "EmploiDakar CI", 0, "Bac+3", "Débutant"),
    O("Médecin Généraliste", "Polyclinique des Deux Plateaux", "Abidjan · Cocody", "CDI", "Novojob", 0, "Bac+8", "3-5 ans"),
    O("Pharmacien Adjoint", "Pharmacie de la Riviera", "Abidjan · Cocody", "CDI", "GoAfrica", 1, "Bac+8", "1-3 ans"),
    O("Technicien de Laboratoire", "Institut Pasteur de CI", "Abidjan · Cocody", "CDD", "LinkedIn", 2, "Bac+2", "1-3 ans"),
    O("Sage-femme", "CHR de Bouaké", "Bouaké", "CDI", "EmploiDakar CI", 3, "Bac+3", "3-5 ans"),
  ],
  "administration": [
    O("Assistant(e) de Direction", "Groupe SIFCA", "Abidjan · Treichville", "CDI", "Novojob", 0, "Bac+3", "3-5 ans"),
    O("Office Manager", "Deloitte CI", "Abidjan · Cocody", "CDI", "LinkedIn", 1, "Bac+5", "5 ans+"),
    O("Agent Administratif", "Mairie de Cocody", "Abidjan · Cocody", "CDD", "GoAfrica", 2, "Bac+2", "Débutant"),
    O("Secrétaire Comptable", "Cabinet Fiduciaire Ivoire", "Abidjan · Plateau", "CDI", "EmploiDakar CI", 3, "Bac+2", "1-3 ans"),
    O("Assistant(e) Services Généraux", "Bolloré CI", "Abidjan · Treichville", "Alternance", "GoAfrica", 4, "Bac+2", "Débutant"),
  ],
  "education-formation": [
    O("Enseignant de Mathématiques", "Groupe Scolaire Excellence", "Abidjan · Cocody", "CDI", "EmploiDakar CI", 0, "Bac+5", "1-3 ans"),
    O("Formateur Professionnel", "INJS", "Abidjan · Marcory", "CDD", "GoAfrica", 1, "Bac+3", "3-5 ans"),
    O("Conseiller Pédagogique", "UNICEF CI", "Abidjan · Cocody", "Mission", "LinkedIn", 2, "Bac+5", "5 ans+"),
    O("Professeur d'Anglais", "Institut Ivoire Langues", "Abidjan · Plateau", "CDD", "Novojob", 3, "Bac+3", "1-3 ans"),
    O("Éducateur Spécialisé", "ONG Espoir Enfance", "Abidjan · Yopougon", "CDI", "EmploiDakar CI", 4, "Bac+3", "3-5 ans"),
  ],
  "hotellerie-restauration": [
    O("Chef de Partie", "Hôtel Ivoire", "Abidjan · Cocody", "CDI", "Novojob", 0, "Bac+2", "3-5 ans"),
    O("Serveur(se)", "Restaurant La Case", "Abidjan · Plateau", "CDD", "GoAfrica", 1, "Bac", "Débutant"),
    O("Gouvernante", "Radisson Blu", "Abidjan · Port-Bouët", "CDI", "LinkedIn", 2, "Bac+2", "5 ans+"),
    O("Barman", "Hôtel Tiama", "Abidjan · Plateau", "Mission", "EmploiDakar CI", 3, "Bac", "1-3 ans"),
    O("Chef Pâtissier", "Traiteur Prestige", "Abidjan · Marcory", "CDI", "GoAfrica", 4, "Bac+2", "3-5 ans"),
  ],
  "agriculture-agrobusiness": [
    O("Ingénieur Agronome", "ANADER", "Bouaké", "CDI", "EmploiDakar CI", 0, "Bac+5", "1-3 ans"),
    O("Technicien Agricole", "SUCRIVOIRE", "Korhogo", "CDD", "GoAfrica", 1, "Bac+2", "Débutant"),
    O("Responsable Plantation", "Groupe SIFCA", "Dabou", "CDI", "LinkedIn", 2, "Bac+5", "5 ans+"),
    O("Agent de Production", "Cargill CI", "San Pédro", "Mission", "Novojob", 3, "Bac", "Débutant"),
    O("Technicien Qualité Agro", "Ivoire Cacao", "Abidjan · Treichville", "CDI", "EmploiDakar CI", 4, "Bac+3", "1-3 ans"),
  ],
  "securite-gardiennage": [
    O("Agent de Sécurité", "G4S CI", "Abidjan · Cocody", "CDI", "GoAfrica", 0, "Bac", "Débutant"),
    O("Superviseur Sécurité", "Aéroport FHB", "Abidjan · Port-Bouët", "CDI", "Novojob", 1, "Bac+2", "5 ans+"),
    O("Gardien de Nuit", "Société Bancaire", "Abidjan · Plateau", "CDD", "EmploiDakar CI", 2, "Bac", "1-3 ans"),
    O("Agent Cynophile", "Sécuritas CI", "Abidjan · Yopougon", "CDI", "LinkedIn", 3, "Bac", "3-5 ans"),
    O("Agent de Sûreté", "Port Autonome d'Abidjan", "Abidjan · Treichville", "CDI", "GoAfrica", 4, "Bac+2", "1-3 ans"),
  ],
}

const ALL_OFFRES = Object.entries(OFFRES).flatMap(([filiere, list]) =>
  list.map((o) => ({ ...o, filiere, uid: `${filiere}-${o.id}` }))
)

export { OFFRES, ALL_OFFRES }

/* ════════════════════════════════════════════════════════════════════
DÉTAILS ÉDITORIAUX — v2.0 : table offres.description + ajout manuel
════════════════════════════════════════════════════════════════════ */
const DETAILS = {
  /* Développeur Full-Stack — Orange CI (tech-dev) */
  1: {
    intro: "Au sein de la DSI d'Orange Côte d'Ivoire, vous rejoindrez une squad produit de 8 personnes (4 devs, PO, QA, DevOps) en charge des parcours clients digitaux. Fort trafic, stack moderne, et un impact direct : des millions d'utilisateurs au quotidien.",
    missions: [
      "Développer les nouvelles fonctionnalités du portail client en React / Node.js",
      "Concevoir et exposer des API REST consommées par le web et le mobile",
      "Écrire des tests unitaires et d'intégration (Jest, Supertest)",
      "Participer aux revues de code et faire monter l'équipe en compétence",
      "Contribuer à l'observabilité : logs, métriques, alerting",
    ],
    profil: [
      "Bac+5 en informatique, 3 à 5 ans d'expérience en développement full-stack",
      "Maîtrise de React (hooks, state management) et de Node.js (Express ou NestJS)",
      "Bases solides en SQL (PostgreSQL) et culture DevOps (CI/CD, Docker)",
      "Esprit produit : l'utilisateur final compte autant que le code",
    ],
    avantages: ["13e mois", "Assurance santé famille", "Télétravail 2 j/sem", "Formation certifiante"],
  },
  /* Chargé de Communication Digitale — CFAO Retail (marketing-com) */
  7: {
    intro: "Rattaché(e) à la Direction Marketing de CFAO Retail CI, vous piloterez la présence digitale des enseignes du groupe : réseaux sociaux, site, campagnes d'influence, sur un marché retail en pleine expansion.",
    missions: [
      "Élaborer et déployer le calendrier éditorial multi-canal",
      "Piloter les campagnes social ads (Meta, TikTok) et le reporting associé",
      "Coordonner les agences et les influenceurs partenaires",
      "Assurer une veille concurrentielle et tendances social media",
    ],
    profil: [
      "Bac+3 communication ou marketing digital, 1 à 3 ans d'expérience",
      "Excellente plume en français, culture de l'image et du format court",
      "Maîtrise de Meta Business Suite, Canva, Google Analytics",
    ],
    avantages: ["13e mois", "Tickets restaurant", "Remises personnel"],
  },
  /* Commercial B2B — Jumia CI (commercial-vente) */
  12: {
    intro: "Au sein de l'équipe commerciale de Jumia Côte d'Ivoire, vous développerez le portefeuille vendeurs B2B sur Abidjan : prospection, négociation et pilotage de la performance de vos comptes.",
    missions: [
      "Prospecter et onboarder de nouveaux vendeurs professionnels",
      "Négocier les conditions commerciales et animer votre portefeuille",
      "Suivre les KPIs de vos comptes et proposer des plans d'action",
      "Représenter Jumia sur les salons et événements professionnels",
    ],
    profil: [
      "Bac+3 commerce ou équivalent, 1 à 3 ans d'expérience en vente B2B",
      "Tempérament chasseur, goût du terrain et de l'atteinte d'objectifs",
      "Aisance relationnelle et sens aigu de la négociation",
    ],
    avantages: ["Variable non plafonné", "Véhicule de fonction", "Téléphone + forfait"],
  },
  /* Comptable Senior — NSIA Banque (comptabilite-finance) */
  17: {
    intro: "Intégré(e) à la Direction Financière de NSIA Banque, vous prendrez en charge la comptabilité générale d'un périmètre bancaire exigeant, dans un environnement réglementaire BCEAO.",
    missions: [
      "Assurer la tenue de la comptabilité générale et les arrêtés mensuels",
      "Préparer les états financiers et les déclarations réglementaires",
      "Participer aux audits internes et externes",
      "Améliorer les procédures comptables et l'automatisation des saisies",
    ],
    profil: [
      "Bac+3 à Bac+5 en comptabilité (DSCG apprécié), 5 ans d'expérience minimum",
      "Maîtrise des normes SYSCOHADA et de l'environnement bancaire",
      "Rigueur, discrétion et capacité à tenir les délais d'arrêté",
    ],
    avantages: ["13e mois", "Prime de bilan", "Assurance santé famille"],
  },
}

/* Générateur de repli pour les offres sans détail rédigé */
export const getDetail = (offre, meta) => {
  const d = DETAILS[offre.id]
  if (d) return { tags: meta.keywords, ...d }
  const sp = meta.specialites
  return {
    intro: `${offre.entreprise} recrute un(e) ${offre.titre} en ${offre.contrat} à ${offre.ville}. Vous interviendrez sur des projets structurants du marché ivoirien, au sein d'une équipe qui valorise l'impact concret et la montée en compétence.`,
    missions: [
      `Piloter les sujets ${sp[0].toLowerCase()} de bout en bout, du cadrage à la livraison`,
      `Travailler main dans la main avec les équipes ${sp[1].toLowerCase()}`,
      `Contribuer aux projets ${sp[2].toLowerCase()} du groupe`,
      "Produire des livrables de qualité et documenter vos travaux",
      "Participer à l'amélioration continue des pratiques de l'équipe",
    ],
    profil: [
      `Formation ${offre.niveau}, ${offre.experience === "Débutant" ? "avec un premier stage significatif" : `avec ${offre.experience} d'expérience`} en ${meta.label.toLowerCase()}`,
      `Solides bases en ${meta.keywords[0]}${meta.keywords[1] ? ` et ${meta.keywords[1]}` : ""}`,
      "Autonomie, rigueur et sens du résultat",
      "Bonne communication en français ; l'anglais est un plus",
    ],
    avantages: [`Contrat ${offre.contrat}`, "Assurance santé", "Formation continue"],
    tags: meta.keywords,
  }
}