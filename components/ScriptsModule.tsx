"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useSinistres } from "@/contexts/SinistresContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TYPOLOGIES, RESPONSABILITES, GARAGES } from "@/types/sinistre"
import { Phone, Copy, Search, BookOpen, Users, Star } from "lucide-react"

export default function ScriptsModule() {
  const { theme } = useTheme()
  const { dossiers } = useSinistres()
  const [selectedScript, setSelectedScript] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const scriptTemplates = [
    {
      id: "presentation",
      title: "Présentation Standard",
      category: "Ouverture",
      content: "Bonjour, [Prénom agent] du Service sinistre AXA Auto à l'appareil.",
      usage: 95,
      rating: 4.8,
    },
    {
      id: "disponibilite",
      title: "Vérification Disponibilité",
      category: "Ouverture",
      content: "Êtes-vous disponible pour échanger quelques minutes sur votre dossier ?",
      usage: 92,
      rating: 4.7,
    },
    {
      id: "empathie_accident",
      title: "Empathie - Accident",
      category: "Empathie",
      content:
        "Je comprends que cette situation puisse être stressante pour vous. Nous allons faire le maximum pour vous accompagner dans cette épreuve.",
      usage: 88,
      rating: 4.9,
    },
    {
      id: "responsabilite_0",
      title: "Annonce Responsabilité 0%",
      category: "Responsabilité",
      content:
        "Excellente nouvelle, vous n'êtes pas responsable de ce sinistre. Votre franchise ne sera donc pas appliquée.",
      usage: 76,
      rating: 4.6,
    },
    {
      id: "garage_partenaire",
      title: "Proposition Garage Partenaire",
      category: "Réparation",
      content:
        "Nous pouvons orienter votre véhicule vers un garage de notre réseau partenaire pour accélérer la prise en charge.",
      usage: 84,
      rating: 4.5,
    },
    {
      id: "cloture_standard",
      title: "Clôture Standard",
      category: "Clôture",
      content:
        "Très bien [Prénom client], je vous remercie pour ces échanges. N'hésitez pas à me recontacter si vous avez des questions.",
      usage: 98,
      rating: 4.8,
    },
  ]

  const categories = ["all", "Ouverture", "Empathie", "Responsabilité", "Réparation", "Clôture"]

  const filteredScripts = scriptTemplates.filter((script) => {
    const matchesSearch =
      script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || script.category === filterType
    return matchesSearch && matchesFilter
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Vous pourriez ajouter une notification toast ici
  }

  const generateDynamicScript = (typologie: string, responsabilite: string, garage: string) => {
    let script = "Script personnalisé :\n\n"

    script += "1. Présentation\n"
    script += "Bonjour, [Prénom agent] du Service sinistre AXA Auto à l'appareil.\n\n"

    script += "2. Objet de l'appel\n"
    script += `Je vous appelle concernant votre sinistre de type "${TYPOLOGIES[typologie as keyof typeof TYPOLOGIES]}".\n\n`

    script += "3. Développement spécifique\n"
    if (responsabilite === "0") {
      script +=
        "Excellente nouvelle, vous n'êtes pas responsable de ce sinistre. Votre franchise ne sera donc pas appliquée.\n"
    } else if (responsabilite === "50") {
      script += "La responsabilité est partagée à 50/50. Votre franchise sera réduite de moitié.\n"
    } else {
      script += "Vous êtes responsable de ce sinistre. Votre franchise contractuelle s'appliquera.\n"
    }

    script += "\n4. Garage\n"
    if (garage === "garage_partenaire") {
      script +=
        "Nous pouvons orienter votre véhicule vers un garage de notre réseau partenaire pour un règlement direct.\n"
    } else {
      script += "Vous avez choisi un garage hors réseau. Vous devrez faire l'avance des frais.\n"
    }

    return script
  }

  return (
    <div
      className="space-y-6 p-6"
      style={{
        backgroundColor: theme === "dark" ? "#2436B1" : "white",
        minHeight: "100vh",
        color: theme === "dark" ? "white" : "#2436B1",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: theme === "dark" ? "white" : "#2436B1" }}
          >
            <Phone className="w-8 h-8" />
            Scripts Téléphoniques
          </h1>
          <p
            className="text-lg mt-2"
            style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
          >
            Bibliothèque complète de scripts pour tous vos appels
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
              {scriptTemplates.length}
            </div>
            <div
              className="text-sm"
              style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
            >
              Scripts
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
              {dossiers.length}
            </div>
            <div
              className="text-sm"
              style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
            >
              Dossiers
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(36,54,177,0.5)" }}
          />
          <input
            type="text"
            placeholder="Rechercher un script..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border"
            style={{
              backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
              borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
              color: theme === "dark" ? "white" : "#2436B1",
            }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
            borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
            color: theme === "dark" ? "white" : "#2436B1",
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} style={{ backgroundColor: theme === "dark" ? "#2436B1" : "white" }}>
              {cat === "all" ? "Toutes catégories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Scripts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScripts.map((script) => (
          <Card
            key={script.id}
            className="hover:shadow-lg transition-all duration-200"
            style={{
              backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
              borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
              border: "2px solid",
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                    {script.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(36,54,177,0.1)",
                        color: theme === "dark" ? "white" : "#2436B1",
                      }}
                    >
                      {script.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" style={{ color: "#E02424" }} />
                  <span className="text-sm font-medium" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                    {script.rating}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p
                className="text-sm mb-4"
                style={{ color: theme === "dark" ? "rgba(255,255,255,0.8)" : "rgba(36,54,177,0.8)" }}
              >
                {script.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users
                    className="w-4 h-4"
                    style={{ color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(36,54,177,0.6)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(36,54,177,0.6)" }}
                  >
                    {script.usage}% d'usage
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(script.content)}
                  style={{
                    backgroundColor: theme === "dark" ? "white" : "#2436B1",
                    color: theme === "dark" ? "#2436B1" : "white",
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Générateur de script dynamique */}
      <Card
        style={{
          backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
          borderColor: "#E02424",
          border: "2px solid",
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
            <BookOpen className="w-5 h-5" />
            Générateur de Script Personnalisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              className="px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
                borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
                color: theme === "dark" ? "white" : "#2436B1",
              }}
            >
              <option value="">Sélectionner typologie</option>
              {Object.entries(TYPOLOGIES).map(([key, value]) => (
                <option key={key} value={key} style={{ backgroundColor: theme === "dark" ? "#2436B1" : "white" }}>
                  {value}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
                borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
                color: theme === "dark" ? "white" : "#2436B1",
              }}
            >
              <option value="">Sélectionner responsabilité</option>
              {Object.entries(RESPONSABILITES).map(([key, value]) => (
                <option key={key} value={key} style={{ backgroundColor: theme === "dark" ? "#2436B1" : "white" }}>
                  {value}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
                borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
                color: theme === "dark" ? "white" : "#2436B1",
              }}
            >
              <option value="">Sélectionner garage</option>
              {Object.entries(GARAGES).map(([key, value]) => (
                <option key={key} value={key} style={{ backgroundColor: theme === "dark" ? "#2436B1" : "white" }}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <Button
            style={{
              backgroundColor: theme === "dark" ? "white" : "#2436B1",
              color: theme === "dark" ? "#2436B1" : "white",
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            Générer Script Personnalisé
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
