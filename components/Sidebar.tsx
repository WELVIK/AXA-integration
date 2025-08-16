"use client"
import { useTheme } from "@/contexts/ThemeContext"

interface SidebarProps {
  currentModule: string
  onModuleChange: (module: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const modules = [
  { id: "dashboard", name: "Accueil", icon: "🏠", description: "Dashboard & statistiques" },
  { id: "dossiers", name: "Dossiers", icon: "📁", description: "Gestion des sinistres" },
  { id: "scripts", name: "Scripts", icon: "📞", description: "Scripts téléphoniques" },
  { id: "checklist", name: "Checklists", icon: "✅", description: "Suivi des procédures" },
  { id: "irsa", name: "Cas IRSA", icon: "⚖️", description: "Barèmes de responsabilité" },
  { id: "formation", name: "Formation", icon: "🎓", description: "Quiz & apprentissage" },
  { id: "jeux", name: "Jeux", icon: "🎮", description: "Formation ludique" },
  { id: "knowledge", name: "Base de connaissances", icon: "📚", description: "Glossaire & procédures" },
  { id: "faq", name: "FAQ", icon: "❓", description: "Questions fréquentes" },
  { id: "settings", name: "Paramètres", icon: "⚙️", description: "Configuration" },
]

export default function Sidebar({ currentModule, onModuleChange, collapsed, onToggleCollapse }: SidebarProps) {
  const { theme } = useTheme()

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : "expanded"}`} data-theme={theme}>
      <div className="sidebar-header">
        <div className="flex items-center gap-4">
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-primary">AXA Sinistres</h2>
              <p className="text-sm text-light">Assistant V2</p>
            </div>
          )}
        </div>
        <button onClick={onToggleCollapse} className="collapse-btn">
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            className={`nav-item ${currentModule === module.id ? "active" : ""}`}
            title={collapsed ? module.name : ""}
          >
            <span className="nav-icon">{module.icon}</span>
            {!collapsed && (
              <div className="nav-content">
                <span className="nav-name">{module.name}</span>
                <span className="nav-desc">{module.description}</span>
              </div>
            )}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="version-badge">
            <span className="text-sm font-medium">Version 2.0</span>
            <span className="text-xs text-light">Majorel Maroc</span>
          </div>
        </div>
      )}
    </div>
  )
}
