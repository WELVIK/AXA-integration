"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type Dossier, type ChecklistItem, type Note, CHECKLIST_ITEMS, CHECKLIST_LABELS } from "@/types/sinistre"

interface SinistresContextType {
  dossiers: Dossier[]
  addDossier: (dossier: Omit<Dossier, "id" | "dateCreation" | "dateModification">) => void
  updateDossier: (id: string, updates: Partial<Dossier>) => void
  deleteDossier: (id: string) => void
  getDossier: (id: string) => Dossier | undefined
  updateChecklist: (dossierId: string, checklist: ChecklistItem[]) => void
  addNote: (dossierId: string, content: string, type?: "system" | "user") => void
  exportData: () => string
  importData: (jsonData: string) => boolean
}

const SinistresContext = createContext<SinistresContextType | undefined>(undefined)

const DEFAULT_CHECKLIST: ChecklistItem[] = CHECKLIST_ITEMS.map((item) => ({
  id: item,
  text: CHECKLIST_LABELS[item],
  completed: false,
}))

export function SinistresProvider({ children }: { children: React.ReactNode }) {
  const [dossiers, setDossiers] = useState<Dossier[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("axa-dossiers-sinistres")
      if (saved) {
        try {
          setDossiers(JSON.parse(saved))
        } catch (error) {
          console.error("Error loading saved data:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("axa-dossiers-sinistres", JSON.stringify(dossiers))
    }
  }, [dossiers])

  const generateId = () => `DOSSIER-${String(dossiers.length + 1).padStart(3, "0")}`

  const addDossier = (dossierData: Omit<Dossier, "id" | "dateCreation" | "dateModification">) => {
    const newDossier: Dossier = {
      ...dossierData,
      id: dossierData.customId || generateId(),
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      checklist: [...DEFAULT_CHECKLIST],
      notes: [],
    }
    setDossiers((prev) => [...prev, newDossier])
  }

  const updateDossier = (id: string, updates: Partial<Dossier>) => {
    setDossiers((prev) =>
      prev.map((dossier) =>
        dossier.id === id ? { ...dossier, ...updates, dateModification: new Date().toISOString() } : dossier,
      ),
    )
  }

  const deleteDossier = (id: string) => {
    setDossiers((prev) => prev.filter((dossier) => dossier.id !== id))
  }

  const getDossier = (id: string) => {
    return dossiers.find((dossier) => dossier.id === id)
  }

  const updateChecklist = (dossierId: string, checklist: ChecklistItem[]) => {
    updateDossier(dossierId, { checklist })
  }

  const addNote = (dossierId: string, content: string, type: "system" | "user" = "user") => {
    const dossier = getDossier(dossierId)
    if (dossier) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString(),
        content,
        type,
      }
      const updatedNotes = [...dossier.notes, newNote]
      updateDossier(dossierId, { notes: updatedNotes })
    }
  }

  const exportData = () => {
    return JSON.stringify(dossiers, null, 2)
  }

  const importData = (jsonData: string) => {
    try {
      const importedDossiers = JSON.parse(jsonData)
      if (Array.isArray(importedDossiers)) {
        setDossiers(importedDossiers)
        return true
      }
      return false
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }

  return (
    <SinistresContext.Provider
      value={{
        dossiers,
        addDossier,
        updateDossier,
        deleteDossier,
        getDossier,
        updateChecklist,
        addNote,
        exportData,
        importData,
      }}
    >
      {children}
    </SinistresContext.Provider>
  )
}

export function useSinistres() {
  const context = useContext(SinistresContext)
  if (context === undefined) {
    throw new Error("useSinistres must be used within a SinistresProvider")
  }
  return context
}
