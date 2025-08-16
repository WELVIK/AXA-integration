"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import Header from "./Header"
import DossiersList from "./DossiersList"
import DossierForm from "./DossierForm"
import DossierDetail from "./DossierDetail"
import FormationModule from "./FormationModule"
import JeuxModule from "./JeuxModule"
import KnowledgeBase from "./KnowledgeBase"
import FAQ from "./FAQ"
import Settings from "./Settings"
import ScriptsModule from "./ScriptsModule"
import ChecklistModule from "./ChecklistModule"
import IRSAModule from "./IRSAModule"
import type { Dossier } from "@/types/sinistre"

type View = "list" | "form" | "detail"
type Module =
  | "dashboard"
  | "dossiers"
  | "scripts"
  | "checklist"
  | "irsa"
  | "formation"
  | "jeux"
  | "knowledge"
  | "faq"
  | "settings"

export default function MainApp() {
  const [currentModule, setCurrentModule] = useState<Module>("dashboard")
  const [currentView, setCurrentView] = useState<View>("list")
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null)
  const [editingDossier, setEditingDossier] = useState<Dossier | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { module } = event.detail
      if (module === "dossiers") {
        setCurrentModule("dossiers")
        showForm()
      } else {
        setCurrentModule(module)
      }
    }

    window.addEventListener("navigate-to-module", handleNavigate as EventListener)
    return () => window.removeEventListener("navigate-to-module", handleNavigate as EventListener)
  }, [])

  const showList = () => {
    setCurrentView("list")
    setSelectedDossierId(null)
    setEditingDossier(null)
  }

  const showForm = (dossier?: Dossier) => {
    setCurrentView("form")
    setEditingDossier(dossier || null)
  }

  const showDetail = (dossier: Dossier) => {
    setCurrentView("detail")
    setSelectedDossierId(dossier.id)
  }

  const handleModuleChange = (module: Module) => {
    setCurrentModule(module)
    if (module === "dossiers") {
      showList()
    }
  }

  const renderModuleContent = () => {
    switch (currentModule) {
      case "dashboard":
        return <Dashboard />
      case "dossiers":
        return (
          <div className="animate-fade-in">
            {currentView === "list" && <DossiersList onSelectDossier={showDetail} onEditDossier={showForm} />}
            {currentView === "form" && (
              <DossierForm dossier={editingDossier} onCancel={showList} onSuccess={showList} />
            )}
            {currentView === "detail" && selectedDossierId && (
              <DossierDetail
                dossierId={selectedDossierId}
                onBack={showList}
                onEdit={() => {
                  if (typeof window !== "undefined") {
                    const dossier = selectedDossierId
                      ? JSON.parse(localStorage.getItem("axa-dossiers-sinistres") || "[]").find(
                          (d: any) => d.id === selectedDossierId,
                        )
                      : null
                    showForm(dossier)
                  }
                }}
              />
            )}
          </div>
        )
      case "scripts":
        return <ScriptsModule />
      case "checklist":
        return <ChecklistModule />
      case "irsa":
        return <IRSAModule />
      case "formation":
        return <FormationModule />
      case "jeux":
        return <JeuxModule />
      case "knowledge":
        return <KnowledgeBase />
      case "faq":
        return <FAQ />
      case "settings":
        return <Settings />
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-primary mb-4">Module en développement</h2>
              <p className="text-light">Ce module sera bientôt disponible.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background text-main transition-all duration-300">
      <Sidebar
        currentModule={currentModule}
        onModuleChange={handleModuleChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {currentModule === "dossiers" && <Header onNewDossier={() => showForm()} currentView={currentView} />}

      <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>{renderModuleContent()}</main>
    </div>
  )
}
