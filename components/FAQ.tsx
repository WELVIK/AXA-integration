

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: "Général" | "IRSA" | "Procédures" | "Technique"
  popularity: number
  helpful: number
  notHelpful: number
}

const faqItems: FAQItem[] = [
  {
    id: "irsa-cas-10",
    question: "Comment appliquer le cas IRSA 10 (heurt par l'arrière) ?",
    answer:
      "Le cas IRSA 10 s'applique quand un véhicule en heurte un autre par l'arrière. La responsabilité est généralement de 100% pour le véhicule heurtant (Y) et 0% pour le véhicule heurté (X). Exceptions possibles si le véhicule de devant a effectué une manœuvre dangereuse.",
    category: "IRSA",
    popularity: 95,
    helpful: 42,
    notHelpful: 3,
  },
  {
    id: "kyc-documents",
    question: "Quels documents sont nécessaires pour le KYC ?",
    answer:
      "Pour la vérification KYC, nous avons besoin : 1) Pièce d'identité en cours de validité (CNI, passeport, permis de conduire), 2) Justificatif de domicile de moins de 3 mois, 3) Attestation d'assurance si différent du déclarant.",
    category: "Procédures",
    popularity: 88,
    helpful: 38,
    notHelpful: 2,
  },
  {
    id: "franchise-calcul",
    question: "Comment calculer la franchise client ?",
    answer:
      "La franchise dépend du contrat client. Elle peut être fixe (ex: 150€) ou proportionnelle (ex: 10% des dommages). Vérifiez toujours dans le système avant d'annoncer le montant au client. En cas de non-responsabilité (0%), pas de franchise.",
    category: "Général",
    popularity: 82,
    helpful: 35,
    notHelpful: 5,
  },
  {
    id: "system-bug",
    question: "Que faire si le système ne répond pas ?",
    answer:
      "En cas de problème technique : 1) Rafraîchir la page (F5), 2) Vider le cache navigateur, 3) Contacter le support IT (poste 1234), 4) Utiliser le système de backup si disponible. Toujours informer le client du délai supplémentaire.",
    category: "Technique",
    popularity: 76,
    helpful: 28,
    notHelpful: 8,
  },
]

export default function FAQ() {
  const { theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const categories = ["Tous", "Général", "IRSA", "Procédures", "Technique"]

  const filteredItems = faqItems
    .filter((item) => {
      const matchesCategory = selectedCategory === "Tous" || item.category === selectedCategory
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => b.popularity - a.popularity)

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Général":
        return "💼"
      case "IRSA":
        return "⚖️"
      case "Procédures":
        return "📋"
      case "Technique":
        return "🔧"
      default:
        return "❓"
    }
  }

  return (
    <div className="dashboard" data-theme={theme}>
      <div className="dashboard-header">
        <h1 className="text-3xl font-bold text-primary mb-2">❓ FAQ - Questions Fréquentes</h1>
        <p className="text-light">Trouvez rapidement les réponses aux questions les plus courantes</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher une question..."
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
          <div className="stat-icon">❓</div>
          <div className="stat-content">
            <h3 className="stat-number">{faqItems.length}</h3>
            <p className="stat-label">Questions Total</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👍</div>
          <div className="stat-content">
            <h3 className="stat-number">
              {Math.round(
                (faqItems.reduce((acc, item) => acc + item.helpful, 0) /
                  faqItems.reduce((acc, item) => acc + item.helpful + item.notHelpful, 0)) *
                  100,
              )}
              %
            </h3>
            <p className="stat-label">Taux Satisfaction</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3 className="stat-number">{faqItems.filter((i) => i.popularity > 80).length}</h3>
            <p className="stat-label">Questions Populaires</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-number">
              {Math.round(faqItems.reduce((acc, item) => acc + item.popularity, 0) / faqItems.length)}
            </h3>
            <p className="stat-label">Score Moyen</p>
          </div>
        </div>
      </div>

      <div className="faq-list">
        {filteredItems.map((item) => (
          <div key={item.id} className="faq-item">
            <div className="faq-question" onClick={() => toggleExpanded(item.id)}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{getCategoryIcon(item.category)}</span>
                <div className="flex-1">
                  <h3 className="faq-question-text">{item.question}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="category-badge">{item.category}</span>
                    <span className="popularity-badge">🔥 {item.popularity}%</span>
                  </div>
                </div>
                <button className="expand-btn">{expandedItems.has(item.id) ? "−" : "+"}</button>
              </div>
            </div>

            {expandedItems.has(item.id) && (
              <div className="faq-answer">
                <p className="faq-answer-text">{item.answer}</p>

                <div className="faq-feedback">
                  <span className="text-sm text-light">Cette réponse vous a-t-elle aidé ?</span>
                  <div className="flex items-center gap-4">
                    <button className="feedback-btn helpful">👍 Oui ({item.helpful})</button>
                    <button className="feedback-btn not-helpful">👎 Non ({item.notHelpful})</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-primary mb-2">Aucune question trouvée</h3>
          <p className="text-light">Essayez avec d'autres mots-clés ou changez de catégorie</p>
        </div>
      )}
    </div>
  )
}
