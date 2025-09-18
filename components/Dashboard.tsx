

import { useSinistres } from "@/contexts/SinistresContext"
import { useTheme } from "@/contexts/ThemeContext"

export default function Dashboard() {
  const { dossiers } = useSinistres()
  const { theme } = useTheme()

  const handleActionClick = (action: string) => {
    const event = new CustomEvent("navigate-to-module", {
      detail: { module: action },
    })
    window.dispatchEvent(event)
  }

  const stats = {
    totalDossiers: dossiers.length,
    dossiersOuverts: dossiers.filter((d) => d.progression < 100).length,
    dossiersTermines: dossiers.filter((d) => d.progression === 100).length,
    progressionMoyenne:
      dossiers.length > 0 ? Math.round(dossiers.reduce((acc, d) => acc + d.progression, 0) / dossiers.length) : 0,
  }

  const badges = [
    { name: "Expert IRSA", icon: "⚖️", earned: stats.totalDossiers >= 5 },
    { name: "Maître des Scripts", icon: "📞", earned: stats.dossiersTermines >= 3 },
    { name: "Checklist Pro", icon: "✅", earned: stats.progressionMoyenne >= 80 },
    { name: "Formation Complète", icon: "🎓", earned: stats.totalDossiers >= 10 },
  ]

  return (
    <div className="dashboard" data-theme={theme}>
      <div className="dashboard-header">
        <h1 className="text-3xl font-bold text-primary mb-2">Tableau de Bord</h1>
        <p className="text-light">Bienvenue dans votre espace de travail AXA Sinistres</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalDossiers}</h3>
            <p className="stat-label">Dossiers Total</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.dossiersOuverts}</h3>
            <p className="stat-label">En Cours</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.dossiersTermines}</h3>
            <p className="stat-label">Terminés</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.progressionMoyenne}%</h3>
            <p className="stat-label">Progression Moyenne</p>
          </div>
        </div>
      </div>

      <div className="badges-section">
        <h2 className="text-2xl font-semibold text-primary mb-4">Vos Badges & Réalisations</h2>
        <div className="badges-grid">
          {badges.map((badge, index) => (
            <div key={index} className={`badge-card ${badge.earned ? "earned" : "locked"}`}>
              <div className="badge-icon">{badge.icon}</div>
              <h3 className="badge-name">{badge.name}</h3>
              <div className={`badge-status ${badge.earned ? "earned" : "locked"}`}>
                {badge.earned ? "🏆 Obtenu" : "🔒 Verrouillé"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2 className="text-2xl font-semibold text-primary mb-4">Actions Rapides</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => handleActionClick("dossiers")}>
            <div className="action-icon">📁</div>
            <h3>Nouveau Dossier</h3>
            <p>Créer un nouveau sinistre</p>
          </button>

          <button className="action-card" onClick={() => handleActionClick("scripts")}>
            <div className="action-icon">📞</div>
            <h3>Script Rapide</h3>
            <p>Générer un script d'appel</p>
          </button>

          <button className="action-card" onClick={() => handleActionClick("formation")}>
            <div className="action-icon">🎓</div>
            <h3>Quiz du Jour</h3>
            <p>Tester vos connaissances</p>
          </button>

          <button className="action-card" onClick={() => handleActionClick("irsa")}>
            <div className="action-icon">📚</div>
            <h3>Consulter IRSA</h3>
            <p>Vérifier un cas de responsabilité</p>
          </button>
        </div>
      </div>
    </div>
  )
}
