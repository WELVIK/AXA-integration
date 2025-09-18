

import type React from "react"

import { useState, useEffect } from "react"
import { useSinistres } from "@/contexts/SinistresContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Dossier, TYPOLOGIES, RESPONSABILITES, GARAGES } from "@/types/sinistre"
import { Save, ArrowLeft } from "lucide-react"

interface DossierFormProps {
  dossier?: Dossier | null
  onCancel: () => void
  onSuccess: () => void
}

export default function DossierForm({ dossier, onCancel, onSuccess }: DossierFormProps) {
  const { addDossier, updateDossier } = useSinistres()
  const { theme } = useTheme()

  const [formData, setFormData] = useState({
    customId: "",
    dateCreation: new Date().toISOString().split("T")[0],
    typologie: "",
    responsabilite: "",
    garage: "",
    kycStatus: "KYC_OK" as const,
    notes: "",
  })

  useEffect(() => {
    if (dossier) {
      setFormData({
        customId: dossier.id,
        dateCreation: dossier.dateCreation.split("T")[0],
        typologie: dossier.typologie,
        responsabilite: dossier.responsabilite,
        garage: dossier.garage,
        kycStatus: dossier.kycStatus,
        notes: dossier.notes?.map((n) => n.content).join("\n") || "",
      })
    }
  }, [dossier])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (dossier) {
      updateDossier(dossier.id, {
        typologie: formData.typologie,
        responsabilite: formData.responsabilite,
        garage: formData.garage,
        kycStatus: formData.kycStatus,
      })
    } else {
      addDossier({
        customId: formData.customId,
        typologie: formData.typologie,
        responsabilite: formData.responsabilite,
        garage: formData.garage,
        kycStatus: formData.kycStatus,
        notes: [],
      })
    }

    onSuccess()
  }

  const generateId = () => {
    const newId = `SIN-${Date.now().toString().slice(-6)}`
    setFormData((prev) => ({ ...prev, customId: newId }))
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: `2px solid ${theme === "dark" ? "#2436B1" : "#2436B1"}`,
    borderRadius: "8px",
    backgroundColor: theme === "dark" ? "#2436B1" : "white",
    color: theme === "dark" ? "white" : "#2436B1",
    fontSize: "0.875rem",
    transition: "all 0.18s ease-in-out",
  }

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: theme === "dark" ? "white" : "#2436B1",
    fontSize: "0.875rem",
  }

  return (
    <div style={{ maxWidth: "4xl", margin: "0 auto" }}>
      <Card className={theme === "dark" ? "bg-[#2436B1] border-[#2436B1] text-white" : "bg-white border-[#2436B1]"}>
        <CardHeader>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <CardTitle className={`text-xl mb-1 ${theme === "dark" ? "text-white" : "text-[#2436B1]"}`}>
                {dossier ? "Modifier le Dossier" : "Nouveau Dossier"}
              </CardTitle>
              <p className={`text-sm ${theme === "dark" ? "text-white/70" : "text-[#2436B1]/70"}`}>
                {dossier ? "Modifiez les informations du dossier" : "Créez un nouveau dossier sinistre"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onCancel}
              className={
                theme === "dark"
                  ? "border-white text-white hover:bg-white hover:text-[#2436B1]"
                  : "border-[#2436B1] text-[#2436B1] hover:bg-[#2436B1] hover:text-white"
              }
            >
              <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
              Retour
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
            >
              <div>
                <label style={labelStyle}>ID Dossier</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    style={inputStyle}
                    value={formData.customId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customId: e.target.value }))}
                    placeholder="Saisir ou générer automatiquement"
                    disabled={!!dossier}
                  />
                  {!dossier && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateId}
                      className={
                        theme === "dark"
                          ? "border-white text-white hover:bg-white hover:text-[#2436B1]"
                          : "border-[#2436B1] text-[#2436B1] hover:bg-[#2436B1] hover:text-white"
                      }
                    >
                      Générer
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Date de création</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.dateCreation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateCreation: e.target.value }))}
                  disabled={!!dossier}
                />
              </div>

              <div>
                <label style={labelStyle}>Typologie du sinistre</label>
                <select
                  style={inputStyle}
                  value={formData.typologie}
                  onChange={(e) => setFormData((prev) => ({ ...prev, typologie: e.target.value }))}
                  required
                >
                  <option value="">Sélectionner une typologie</option>
                  {Object.entries(TYPOLOGIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Responsabilité</label>
                <select
                  style={inputStyle}
                  value={formData.responsabilite}
                  onChange={(e) => setFormData((prev) => ({ ...prev, responsabilite: e.target.value }))}
                  required
                >
                  <option value="">Sélectionner la responsabilité</option>
                  {Object.entries(RESPONSABILITES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Type de garage</label>
                <select
                  style={inputStyle}
                  value={formData.garage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, garage: e.target.value }))}
                  required
                >
                  <option value="">Sélectionner le type de garage</option>
                  {Object.entries(GARAGES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Statut KYC</label>
                <select
                  style={inputStyle}
                  value={formData.kycStatus}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, kycStatus: e.target.value as "KYC_OK" | "KYC_DEM" | "KYC_REM" }))
                  }
                >
                  <option value="KYC_OK">OK</option>
                  <option value="KYC_DEM">DEM</option>
                  <option value="KYC_REM">REM</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem" }}>
              <Button
                type="submit"
                style={{ flex: 1 }}
                className={
                  theme === "dark"
                    ? "bg-white text-[#2436B1] hover:bg-white/90"
                    : "bg-[#2436B1] text-white hover:bg-[#2436B1]/90"
                }
              >
                <Save size={16} style={{ marginRight: "0.5rem" }} />
                {dossier ? "Mettre à jour" : "Créer le dossier"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                style={{ flex: 1 }}
                className={
                  theme === "dark"
                    ? "border-white text-white hover:bg-white hover:text-[#2436B1]"
                    : "border-[#2436B1] text-[#2436B1] hover:bg-[#2436B1] hover:text-white"
                }
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
