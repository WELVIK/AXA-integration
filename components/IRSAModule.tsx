"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IRSA_CASES } from "@/types/sinistre"
import { Scale, Search, AlertTriangle, CheckCircle, Info, Calculator } from "lucide-react"

export default function IRSAModule() {
  const { theme } = useTheme()
  const [selectedCase, setSelectedCase] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterResponsability, setFilterResponsability] = useState("all")

  const filteredCases = IRSA_CASES.filter((caseItem) => {
    const matchesSearch =
      caseItem.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.note.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterResponsability === "all" ||
      (filterResponsability === "0" && caseItem.responsabilite.includes("X 0%")) ||
      (filterResponsability === "100" && caseItem.responsabilite.includes("Y 100%")) ||
      (filterResponsability === "variable" && caseItem.responsabilite.includes("variable"))
    return matchesSearch && matchesFilter
  })

  const getResponsabilityColor = (responsabilite: string) => {
    if (responsabilite.includes("X 0%")) return "#E02424" // Rouge pour favorable
    if (responsabilite.includes("Y 100%")) return "#E02424" // Rouge pour défavorable
    return theme === "dark" ? "white" : "#2436B1" // Bleu pour variable
  }

  const getResponsabilityIcon = (responsabilite: string) => {
    if (responsabilite.includes("X 0%")) return <CheckCircle className="w-5 h-5" />
    if (responsabilite.includes("Y 100%")) return <AlertTriangle className="w-5 h-5" />
    return <Info className="w-5 h-5" />
  }

  const caseCategories = [
    { id: "circulation", name: "Circulation", cases: [10, 13, 15, 17, 20, 21] },
    { id: "stationnement", name: "Stationnement", cases: [40, 41] },
    { id: "signalisation", name: "Signalisation", cases: [50, 51] },
    { id: "chaussees", name: "Chaussées différentes", cases: [30] },
  ]

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
            <Scale className="w-8 h-8" />
            Cas IRSA - Barème de Responsabilité
          </h1>
          <p
            className="text-lg mt-2"
            style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
          >
            Référentiel complet pour la détermination des responsabilités
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
              {IRSA_CASES.length}
            </div>
            <div
              className="text-sm"
              style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
            >
              Cas IRSA
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
            placeholder="Rechercher un cas IRSA..."
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
          value={filterResponsability}
          onChange={(e) => setFilterResponsability(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
            borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
            color: theme === "dark" ? "white" : "#2436B1",
          }}
        >
          <option value="all">Toutes responsabilités</option>
          <option value="0">Non responsable (0%)</option>
          <option value="100">Responsable (100%)</option>
          <option value="variable">Variable</option>
        </select>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {caseCategories.map((category) => (
          <Card
            key={category.id}
            style={{
              backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
              borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
              border: "2px solid",
            }}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-1">
                {category.cases.map((caseNum) => (
                  <span
                    key={caseNum}
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(36,54,177,0.1)",
                      color: theme === "dark" ? "white" : "#2436B1",
                    }}
                  >
                    {caseNum}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCases.map((caseItem) => (
          <Card
            key={caseItem.cas}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedCase(selectedCase === caseItem.cas ? null : caseItem.cas)}
            style={{
              backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
              borderColor:
                selectedCase === caseItem.cas ? "#E02424" : theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
              border: "2px solid",
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(36,54,177,0.1)",
                      color: theme === "dark" ? "white" : "#2436B1",
                    }}
                  >
                    {caseItem.cas}
                  </div>
                  <div>
                    <CardTitle className="text-lg" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                      Cas {caseItem.cas}
                    </CardTitle>
                    <p
                      className="text-sm"
                      style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
                    >
                      {caseItem.titre}
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  style={{ color: getResponsabilityColor(caseItem.responsabilite) }}
                >
                  {getResponsabilityIcon(caseItem.responsabilite)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
                  >
                    Responsabilité:
                  </p>
                  <p className="font-semibold" style={{ color: getResponsabilityColor(caseItem.responsabilite) }}>
                    {caseItem.responsabilite}
                  </p>
                </div>

                {selectedCase === caseItem.cas && (
                  <div
                    className="mt-4 p-4 rounded-lg"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(36,54,177,0.05)",
                      border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(36,54,177,0.1)"}`,
                    }}
                  >
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
                    >
                      Détails:
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: theme === "dark" ? "rgba(255,255,255,0.8)" : "rgba(36,54,177,0.8)" }}
                    >
                      {caseItem.note}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calculateur de responsabilité */}
      <Card
        style={{
          backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
          borderColor: "#E02424",
          border: "2px solid",
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
            <Calculator className="w-5 h-5" />
            Aide à la Détermination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(36,54,177,0.05)",
                border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(36,54,177,0.1)"}`,
              }}
            >
              <CheckCircle className="w-8 h-8 mb-2" style={{ color: "#E02424" }} />
              <h4 className="font-semibold mb-1" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                Non Responsable (0%)
              </h4>
              <p
                className="text-sm"
                style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
              >
                Cas 10, 40, 50, 51 - Situations claires
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(36,54,177,0.05)",
                border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(36,54,177,0.1)"}`,
              }}
            >
              <Info className="w-8 h-8 mb-2" style={{ color: theme === "dark" ? "white" : "#2436B1" }} />
              <h4 className="font-semibold mb-1" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                Variable
              </h4>
              <p
                className="text-sm"
                style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
              >
                Cas 13, 15, 17, 21, 30 - Analyse contextuelle
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(36,54,177,0.05)",
                border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(36,54,177,0.1)"}`,
              }}
            >
              <AlertTriangle className="w-8 h-8 mb-2" style={{ color: "#E02424" }} />
              <h4 className="font-semibold mb-1" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                Responsable (100%)
              </h4>
              <p
                className="text-sm"
                style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
              >
                Fautes caractérisées - Franchise applicable
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
