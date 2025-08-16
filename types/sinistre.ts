export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Note {
  id: string
  timestamp: string
  content: string
  type: "system" | "user"
}

export interface Dossier {
  id: string
  customId?: string
  dateCreation: string
  dateModification: string
  typologie: string
  responsabilite: string
  garage: string
  kycStatus: "KYC_OK" | "KYC_DEM" | "KYC_REM"
  notes: Note[]
  checklist: ChecklistItem[]
  casIrsa?: number
  coordonnees?: {
    mobile?: string
    email?: string
  }
}

export const TYPOLOGIES = {
  accident_vehicule_vehicule: "Accident entre deux véhicules",
  accident_tiers_non_auto: "Accident avec un tiers non-auto (piéton, vélo...)",
  accident_tiers_identifie: "Accident avec un tiers identifié",
  bris_de_glace: "Bris de glace",
  collision_parking: "Collision parking",
  accident_parking: "Accident parking",
  vol_partiel: "Vol partiel",
  vol_total: "Vol total",
  vandalisme: "Vandalisme",
  incendie: "Incendie",
  grele: "Grêle",
  catastrophe_naturelle: "Catastrophe naturelle",
} as const

export const RESPONSABILITES = {
  "0": "0% (Non responsable)",
  "50": "50% (Responsabilité partagée)",
  "100": "100% (Responsable)",
} as const

export const GARAGES = {
  garage_partenaire: "Garage partenaire",
  garage_elexia: "Garage Elexia",
  garage_non_partenaire: "Garage non partenaire",
  gag_ia: "GAG-IA",
  gag_bcf: "GAG-BCF",
} as const

export const KYC_OPTIONS = {
  KYC_OK: "OK",
  KYC_DEM: "DEM (pièce demandée)",
  KYC_REM: "REM (en remédiation)",
} as const

export const CHECKLIST_ITEMS = [
  "appel_client_effectue",
  "objet_appel_enregistre",
  "enregistrement_ok",
  "empatie",
  "plan_entretien",
  "dommages_blesses",
  "franchise_informe",
  "expertise_reparation",
  "coordonnees_recues",
  "digitalisation_ok",
  "kyc",
  "ar_envoye",
  "documents_renommes",
  "reagendage_note",
  "acquittement_questions",
  "prise_conge",
] as const

export const CHECKLIST_LABELS = {
  appel_client_effectue: "Appel client effectué (présentation + disponibilité)",
  objet_appel_enregistre: "Objet de l'appel indiqué (date sinistre)",
  enregistrement_ok: "Enregistrement audio / mention (si applicable)",
  empatie: "Empathie / ton enregistré (CLI ADAPT)",
  plan_entretien: "Circonstances + statuer responsabilité + PEC",
  dommages_blesses: "Vérification autres dommages / blessés",
  franchise_informe: "Franchise expliquée",
  expertise_reparation: "Infos sur expertise & réparation",
  coordonnees_recues: "Coordonnées mobile / mail",
  digitalisation_ok: "Digitalisation (si on a un document)",
  kyc: "KYC (OK / DEM / REM)",
  ar_envoye: "AR envoyé",
  documents_renommes: "Documents renommés",
  reagendage_note: "Réagendage noté",
  acquittement_questions: "Acquittement / questions restantes",
  prise_conge: "Prise de congé (personnalisation x2)",
} as const

export const IRSA_CASES = [
  {
    cas: 10,
    titre: "même sens - heurt par l'arrière (cas 10)",
    responsabilite: "X 0% / Y 100%",
    note: "véhicule heurté par l'arrière - priorité / file",
  },
  {
    cas: 13,
    titre: "même sens - changement de file (cas 13)",
    responsabilite: "dépend du mouvement, souvent Y 100%",
    note: "manœuvre imprudente ou absence de contrôle",
  },
  {
    cas: 15,
    titre: "même sens - dépassement / changement (cas 15)",
    responsabilite: "variable",
    note: "exemple: X 0% Y 100%",
  },
  {
    cas: 17,
    titre: "même sens - autre variante (cas 17)",
    responsabilite: "variable",
    note: "voir barème IRSA",
  },
  {
    cas: 20,
    titre: "sens inverse - collision frontale (cas 20)",
    responsabilite: "souvent Y 100%",
    note: "souvent X 0% / Y 100% ou partagé selon freinage",
  },
  {
    cas: 21,
    titre: "sens inverse - variante (cas 21)",
    responsabilite: "variable",
    note: "voir règle IRSA",
  },
  {
    cas: 30,
    titre: "chaussées différentes - erreur de trajectoire (cas 30)",
    responsabilite: "voir description IRSA",
    note: "souvent partagé ou dépendant du positionnement",
  },
  {
    cas: 40,
    titre: "stationnement régulier (cas 40)",
    responsabilite: "X 0% / Y 100%",
    note: "le véhicule en stationnement n'est pas responsable",
  },
  {
    cas: 41,
    titre: "stationnement irrégulier (cas 41)",
    responsabilite: "souvent partagé selon irrégularité",
    note: "selon le barème (ex: 50/50 pour irrégulier)",
  },
  {
    cas: 50,
    titre: "non respect signalisation (cas 50 A/B/C/D)",
    responsabilite: "Y 100% généralement",
    note: "faute du véhicule qui a enfreint la signalisation",
  },
  {
    cas: 51,
    titre: "manœuvres interdites / marche arrière (cas 51A..D)",
    responsabilite: "Y 100% généralement",
    note: "généralement X 0% / Y 100%",
  },
] as const
