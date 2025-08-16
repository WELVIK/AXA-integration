"use client"

import { useState } from "react"
import { useSinistres } from "@/contexts/SinistresContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ScriptTelephonique from "./ScriptTelephonique"
import { TYPOLOGIES, RESPONSABILITES, GARAGES } from "@/types/sinistre"
import { ArrowLeft, Edit, Trash2, Phone, CheckSquare, Info } from "lucide-react"

interface DossierDetailProps {
  dossierId: string
  onBack: () => void
  onEdit: () => void
}

export default function DossierDetail({ dossierId, onBack, onEdit }: DossierDetailProps) {
  const { getDossier, updateChecklist, deleteDossier } = useSinistres()
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("script")

  // Récupère toujours les données fraîches du contexte
  const dossier = getDossier(dossierId)

  if (!dossier) {
    return <div>Dossier non trouvé</div>
  }

  const handleChecklistChange = (itemId: string, completed: boolean) => {
    const updatedChecklist = dossier.checklist.map((item) => (item.id === itemId ? { ...item, completed } : item))
    updateChecklist(dossier.id, updatedChecklist)
  }

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?")) {
      deleteDossier(dossier.id)
      onBack()
    }
  }

  const getKycBadgeStyle = (status: string) => {
    const baseStyle = {
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "500",
      border: "1px solid",
    }

    switch (status) {
      case "OK":
        return {
          ...baseStyle,
          backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(36, 54, 177, 0.1)",
          color: theme === "dark" ? "white" : "#2436B1",
          borderColor: theme === "dark" ? "white" : "#2436B1",
        }
      case "DEM":
        return {
          ...baseStyle,
          backgroundColor: theme === "dark" ? "rgba(224, 36, 36, 0.2)" : "rgba(224, 36, 36, 0.1)",
          color: "#E02424",
          borderColor: "#E02424",
        }
      case "REM":
        return {
          ...baseStyle,
          backgroundColor: theme === "dark" ? "rgba(224, 36, 36, 0.3)" : "rgba(224, 36, 36, 0.15)",
          color: "#E02424",
          borderColor: "#E02424",
        }
      default:
        return {
          ...baseStyle,
          backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(36, 54, 177, 0.05)",
          color: theme === "dark" ? "white" : "#2436B1",
          borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(36, 54, 177, 0.2)",
        }
    }
  }

  const completedTasks = dossier.checklist.filter((item) => item.completed).length
  const totalTasks = dossier.checklist.length
  const completionRate = Math.round((completedTasks / totalTasks) * 100)

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

  return (
    <div
      style={{
        maxWidth: "6xl",
        margin: "0 auto",
        padding: "1.5rem 0",
        backgroundColor: theme === "dark" ? "#2436B1" : "white",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          marginBottom: "1.5rem",
          backgroundColor: theme === "dark" ? "#2436B1" : "white",
          border: `1px solid ${theme === "dark" ? "#2436B1" : "#2436B1"}`,
          color: theme === "dark" ? "white" : "#2436B1",
        }}
      >
        <CardHeader>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Button
                variant="outline"
                onClick={onBack}
                style={{
                  backgroundColor: theme === "dark" ? "white" : "#2436B1",
                  color: theme === "dark" ? "#2436B1" : "white",
                  borderColor: theme === "dark" ? "white" : "#2436B1",
                }}
              >
                <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
                Retour
              </Button>
              <div>
                <CardTitle
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.25rem",
                    color: theme === "dark" ? "white" : "#2436B1",
                  }}
                >
                  {dossier.id}
                </CardTitle>
                <p
                  style={{
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(36, 54, 177, 0.7)",
                    fontSize: "0.875rem",
                  }}
                >
                  Créé le {new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <span style={getKycBadgeStyle(dossier.kycStatus)}>KYC: {dossier.kycStatus}</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variant="outline"
                onClick={onEdit}
                style={{
                  backgroundColor: theme === "dark" ? "white" : "#2436B1",
                  color: theme === "dark" ? "#2436B1" : "white",
                  borderColor: theme === "dark" ? "white" : "#2436B1",
                }}
              >
                <Edit size={16} style={{ marginRight: "0.5rem" }} />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                style={{
                  backgroundColor: "#E02424",
                  color: "white",
                  borderColor: "#E02424",
                }}
              >
                <Trash2 size={16} style={{ marginRight: "0.5rem" }} />
                Supprimer
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div
        style={{
          display: "flex",
          backgroundColor: theme === "dark" ? "white" : "rgba(36, 54, 177, 0.1)",
          borderRadius: "12px",
          padding: "0.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <button
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeTab === "script" ? (theme === "dark" ? "#2436B1" : "#2436B1") : "transparent",
            color: activeTab === "script" ? "white" : theme === "dark" ? "#2436B1" : "#2436B1",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontWeight: "500",
          }}
          onClick={() => setActiveTab("script")}
        >
          <Phone size={16} />
          Script Téléphonique
        </button>
        <button
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeTab === "checklist" ? (theme === "dark" ? "#2436B1" : "#2436B1") : "transparent",
            color: activeTab === "checklist" ? "white" : theme === "dark" ? "#2436B1" : "#2436B1",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontWeight: "500",
          }}
          onClick={() => setActiveTab("checklist")}
        >
          <CheckSquare size={16} />
          Checklist ({completedTasks}/{totalTasks})
        </button>
        <button
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeTab === "infos" ? (theme === "dark" ? "#2436B1" : "#2436B1") : "transparent",
            color: activeTab === "infos" ? "white" : theme === "dark" ? "#2436B1" : "#2436B1",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontWeight: "500",
          }}
          onClick={() => setActiveTab("infos")}
        >
          <Info size={16} />
          Informations
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "script" && <ScriptTelephonique dossier={dossier} />}

      {activeTab === "checklist" && (
        <Card
          style={{
            backgroundColor: theme === "dark" ? "#2436B1" : "white",
            border: `2px solid ${theme === "dark" ? "#E02424" : "#2436B1"}`,
            color: theme === "dark" ? "white" : "#2436B1",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: theme === "dark" ? "white" : "#2436B1" }}>Checklist de Suivi</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {dossier.checklist.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(36, 54, 177, 0.05)",
                    border: `1px solid ${theme === "dark" ? "#E02424" : "rgba(36, 54, 177, 0.1)"}`,
                    transition: "all 0.18s ease",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: theme === "dark" ? "white" : "#2436B1",
                    }}
                  />
                  <span style={{ fontSize: "1.2rem" }}>{getChecklistEmoji(item.id)}</span>
                  <span
                    style={{
                      textDecoration: item.completed ? "line-through" : "none",
                      color: item.completed
                        ? theme === "dark"
                          ? "rgba(255, 255, 255, 0.5)"
                          : "rgba(36, 54, 177, 0.5)"
                        : theme === "dark"
                          ? "white"
                          : "#2436B1",
                      flex: 1,
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "infos" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <Card
            style={{
              backgroundColor: theme === "dark" ? "#2436B1" : "white",
              border: `2px solid ${theme === "dark" ? "#E02424" : "#2436B1"}`,
              color: theme === "dark" ? "white" : "#2436B1",
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: theme === "dark" ? "white" : "#2436B1" }}>Informations du Dossier</CardTitle>
            </CardHeader>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(36, 54, 177, 0.7)",
                  }}
                >
                  ID Dossier
                </label>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    color: theme === "dark" ? "white" : "#2436B1",
                  }}
                >
                  {dossier.id}
                </p>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(36, 54, 177, 0.7)",
                  }}
                >
                  Typologie
                </label>
                <p style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                  {TYPOLOGIES[dossier.typologie as keyof typeof TYPOLOGIES]}
                </p>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(36, 54, 177, 0.7)",
                  }}
                >
                  Responsabilité
                </label>
                <p style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                  {RESPONSABILITES[dossier.responsabilite as keyof typeof RESPONSABILITES]}
                </p>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(36, 54, 177, 0.7)",
                  }}
                >
                  Garage
                </label>
                <p style={{ color: theme === "dark" ? "white" : "#2436B1" }}>
                  {GARAGES[dossier.garage as keyof typeof GARAGES]}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: theme === "dark" ? "#2436B1" : "white",
              border: `2px solid ${theme === "dark" ? "#E02424" : "#2436B1"}`,
              color: theme === "dark" ? "white" : "#2436B1",
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: theme === "dark" ? "white" : "#2436B1" }}>Suivi & Progression</CardTitle>
            </CardHeader>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(36, 54, 177, 0.7)",
                  }}
                >
                  Progression
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <div
                    style={{
                      flex: 1,
                      height: "0.5rem",
                      backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(36, 54, 177, 0.1)",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${completionRate}%`,
                        backgroundColor: theme === "dark" ? "white" : "#2436B1",
                        borderRadius: "9999px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: theme === "dark" ? "white" : "#2436B1",
                    }}
                  >
                    {completionRate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
