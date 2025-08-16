"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { useSinistres } from "@/contexts/SinistresContext"
import { Moon, Sun, Plus, FileText } from "lucide-react"

interface HeaderProps {
  onNewDossier: () => void
  currentView: string
}

export default function Header({ onNewDossier, currentView }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { dossiers } = useSinistres()

  return (
    <header
      className={`sticky top-0 z-50 mb-6 rounded-lg border transition-all duration-300 ${
        theme === "dark" ? "bg-[#2436B1] border-[#2436B1] text-white" : "bg-white border-[#2436B1] text-[#2436B1]"
      }`}
    >
      <div className="flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow transition-colors ${
                theme === "dark" ? "bg-white" : "bg-[#2436B1]"
              }`}
            >
              <FileText size={24} className={theme === "dark" ? "text-[#2436B1]" : "text-white"} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#E02424] rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1
              className={`text-2xl font-bold mb-0 transition-colors ${
                theme === "dark" ? "text-white" : "text-[#2436B1]"
              }`}
            >
              AXA Sinistres
            </h1>
            <p className={`text-sm transition-colors ${theme === "dark" ? "text-white/70" : "text-[#2436B1]/70"}`}>
              Gestion professionnelle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#E02424] rounded-full shadow">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white font-semibold text-sm">
              {dossiers.length} dossier{dossiers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {currentView === "list" && (
            <button
              onClick={onNewDossier}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                theme === "dark"
                  ? "bg-white text-[#2436B1] hover:bg-white/90"
                  : "bg-[#2436B1] text-white hover:bg-[#2436B1]/90"
              }`}
            >
              <Plus size={16} />
              Nouveau Dossier
            </button>
          )}

          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              theme === "dark"
                ? "bg-white text-[#2436B1] hover:bg-white/90"
                : "bg-[#2436B1] text-white hover:bg-[#2436B1]/90"
            }`}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}
