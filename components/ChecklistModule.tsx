

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useSinistres } from "@/contexts/SinistresContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CHECKLIST_LABELS } from "@/types/sinistre"
import { CheckSquare, Clock, TrendingUp, Users, Award, Target, BarChart3 } from "lucide-react"

export default function ChecklistModule() {
  const { theme } = useTheme()
  const { dossiers } = useSinistres()
  const [selectedDossier, setSelectedDossier] = useState<string | null>(null)

  const getChecklistEmoji = (itemId: string) => {
    const emojiMap: { [key: string]: string } = {
      appel_client_effectue: "📞",
      objet_appel_enregistre: "📝",
      enregistrement_ok: "🎙️",
      empatie: "💙",
      plan_entretien: "📋",
      dommages_blesses: "🩹",
      franchise_informe: "💰",
      expertise_reparation: "🔧",
      coordonnees_recues: "📱",
      digitalisation_ok: "📄",
      kyc: "🆔",
      ar_envoye: "📧",
      documents_renommes: "📁",
      reagendage_note: "📅",
      acquittement_questions: "✅",
      prise_conge: "👋",
    }
    return emojiMap[itemId] || "📌"
  }

  // Calculs statistiques
  const totalChecklists = dossiers.length * Object.keys(CHECKLIST_LABELS).length
  const completedItems = dossiers.reduce(
    (total, dossier) => total + dossier.checklist.filter((item) => item.completed).length,
    0,
  )
  const completionRate = totalChecklists > 0 ? Math.round((completedItems / totalChecklists) * 100) : 0

  // Analyse par étape
  const stepAnalysis = Object.keys(CHECKLIST_LABELS)
    .map((stepId) => {
      const totalForStep = dossiers.length
      const completedForStep = dossiers.filter(
        (dossier) => dossier.checklist.find((item) => item.id === stepId)?.completed,
      ).length
      const stepRate = totalForStep > 0 ? Math.round((completedForStep / totalForStep) * 100) : 0

      return {
        id: stepId,
        label: CHECKLIST_LABELS[stepId as keyof typeof CHECKLIST_LABELS],
        emoji: getChecklistEmoji(stepId),
        completed: completedForStep,
        total: totalForStep,
        rate: stepRate,
      }
    })
    .sort((a, b) => b.rate - a.rate)

  // Dossiers avec progression
  const dossiersWithProgress = dossiers
    .map((dossier) => {
      const completed = dossier.checklist.filter((item) => item.completed).length
      const total = dossier.checklist.length
      const progress = Math.round((completed / total) * 100)
      return { ...dossier, completed, total, progress }
    })
    .sort((a, b) => b.progress - a.progress)

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
            <CheckSquare className="w-8 h-8" />
            Gestion des Checklists
          </h1>
          <p
            className="text-lg mt-2"
            style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
          >
            Suivi et analyse des procédures de traitement
          </p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          style={{
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
            borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
            border: "2px solid",
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
                >
                  Taux Global
                </p>
                <p className="text-2xl font-bold" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                  {completionRate}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8" style={{ color: "#E02424" }} />
            </div>
          </CardContent>
        </Card>

        <Card
          style={{
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
            borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
            border: "2px solid",
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
                >
                  Étapes Complétées
                </p>
                <p className="text-2xl font-bold" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                  {completedItems}
                </p>
              </div>
              <Target className="w-8 h-8" style={{ color: "#E02424" }} />
            </div>
          </CardContent>
        </Card>

        <Card
          style={{
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
            borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
            border: "2px solid",
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
                >
                  Dossiers Actifs
                </p>
                <p className="text-2xl font-bold" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                  {dossiers.length}
                </p>
              </div>
              <Users className="w-8 h-8" style={{ color: "#E02424" }} />
            </div>
          </CardContent>
        </Card>

        <Card
          style={{
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
            borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
            border: "2px solid",
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(36,54,177,0.7)" }}
                >
                  Étapes Totales
                </p>
                <p className="text-2xl font-bold" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                  {Object.keys(CHECKLIST_LABELS).length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8" style={{ color: "#E02424" }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyse par étape */}
      <Card
        style={{
          backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
          borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
          border: "2px solid",
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
            <Award className="w-5 h-5" />
            Performance par Étape
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stepAnalysis.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(36,54,177,0.05)",
                  border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(36,54,177,0.1)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{step.emoji}</span>
                  <div>
                    <p className="font-medium" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                      {step.label}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(36,54,177,0.6)" }}
                    >
                      {step.completed}/{step.total} dossiers
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="w-32 h-2 rounded-full"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(36,54,177,0.2)",
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${step.rate}%`,
                        backgroundColor: step.rate >= 80 ? "#E02424" : theme === "dark" ? "white" : "#2436B1",
                      }}
                    />
                  </div>
                  <span
                    className="font-bold text-lg w-12 text-right"
                    style={{
                      color: step.rate >= 80 ? "#E02424" : theme === "dark" ? "white" : "#2436B1",
                    }}
                  >
                    {step.rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progression par dossier */}
      <Card
        style={{
          backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "white",
          borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "#2436B1",
          border: "2px solid",
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
            <Clock className="w-5 h-5" />
            Progression par Dossier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dossiersWithProgress.map((dossier) => (
              <div
                key={dossier.id}
                className="flex items-center justify-between p-3 rounded-lg hover:shadow-md transition-all duration-200"
                style={{
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(36,54,177,0.05)",
                  border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(36,54,177,0.1)"}`,
                }}
              >
                <div>
                  <p className="font-medium" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                    {dossier.id}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(36,54,177,0.6)" }}
                  >
                    {new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium" style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                      {dossier.completed}/{dossier.total}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(36,54,177,0.6)" }}
                    >
                      étapes
                    </p>
                  </div>
                  <div
                    className="w-24 h-2 rounded-full"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(36,54,177,0.2)",
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${dossier.progress}%`,
                        backgroundColor: dossier.progress === 100 ? "#E02424" : theme === "dark" ? "white" : "#2436B1",
                      }}
                    />
                  </div>
                  <span
                    className="font-bold w-12 text-right"
                    style={{
                      color: dossier.progress === 100 ? "#E02424" : theme === "dark" ? "white" : "#2436B1",
                    }}
                  >
                    {dossier.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
