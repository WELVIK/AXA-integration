

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

interface KnowledgeItem {
  id: string
  title: string
  category: "Glossaire" | "Procédures" | "Scripts" | "Réglementation"
  content: string
  tags: string[]
  lastUpdated: string
}

const knowledgeItems: KnowledgeItem[] = [
  {
    id: "franchise",
    title: "Franchise",
    category: "Glossaire",
    content:
      "Somme qui reste à la charge de l'assuré en cas de sinistre. Elle peut être fixe ou proportionnelle au montant des dommages.",
    tags: ["assurance", "indemnisation", "client"],
    lastUpdated: "2024-01-15",
  },
  {
    id: "irsa-definition",
    title: "Convention IRSA",
    category: "Réglementation",
    content:
      "Convention d'Indemnisation et de Recours des Sinistres Automobiles. Elle définit les règles de partage des responsabilités entre assureurs.",
    tags: ["IRSA", "responsabilité", "convention"],
    lastUpdated: "2024-01-10",
  },
  {
    id: "kyc-procedure",
    title: "Procédure KYC",
    category: "Procédures",
    content:
      "Know Your Customer - Vérification de l'identité du client. Obligatoire pour tous les dossiers. Documents requis : pièce d'identité, justificatif de domicile.",
    tags: ["KYC", "vérification", "documents"],
    lastUpdated: "2024-01-20",
  },
  {
    id: "script-presentation",
    title: "Script de Présentation",
    category: "Scripts",
    content:
      "Bonjour M./Mme [NOM], je suis [PRÉNOM] du Service Sinistre  Auto. Je vous appelle au sujet du sinistre déclaré le [DATE]. Êtes-vous disponible quelques instants ?",
    tags: ["script", "appel", "présentation"],
    lastUpdated: "2024-01-18",
  },
]

export default function KnowledgeBase() {
  const { theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = ["Tous", "Glossaire", "Procédures", "Scripts", "Réglementation"]

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesCategory = selectedCategory === "Tous" || item.category === selectedCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Glossaire":
        return "📖"
      case "Procédures":
        return "📋"
      case "Scripts":
        return "📞"
      case "Réglementation":
        return "⚖️"
      default:
        return "📚"
    }
  }

  return (
    <div className="dashboard" data-theme={theme}>
      <div className="dashboard-header">
        <h1 className="text-3xl font-bold text-primary mb-2">📚 Base de Connaissances</h1>
        <p className="text-light">Consultez notre bibliothèque de ressources et procédures</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher dans la base de connaissances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3 className="stat-number">{knowledgeItems.filter((i) => i.category === "Glossaire").length}</h3>
            <p className="stat-label">Termes Glossaire</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3 className="stat-number">{knowledgeItems.filter((i) => i.category === "Procédures").length}</h3>
            <p className="stat-label">Procédures</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-content">
            <h3 className="stat-number">{knowledgeItems.filter((i) => i.category === "Scripts").length}</h3>
            <p className="stat-label">Scripts Types</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <h3 className="stat-number">{knowledgeItems.filter((i) => i.category === "Réglementation").length}</h3>
            <p className="stat-label">Réglementations</p>
          </div>
        </div>
      </div>

      <div className="knowledge-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="knowledge-card">
            <div className="knowledge-header">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                <span className="category-badge">{item.category}</span>
              </div>
              <h3 className="knowledge-title">{item.title}</h3>
            </div>

            <div className="knowledge-content">
              <p className="knowledge-text">{item.content}</p>

              <div className="knowledge-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="knowledge-footer">
                <span className="text-sm text-light">
                  Mis à jour le {new Date(item.lastUpdated).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-primary mb-2">Aucun résultat trouvé</h3>
          <p className="text-light">Essayez avec d'autres mots-clés ou changez de catégorie</p>
        </div>
      )}
    </div>
  )
}
