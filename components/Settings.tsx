"use client"

import { useTheme } from "@/contexts/ThemeContext"

export default function Settings() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="dashboard" data-theme={theme}>
      <div className="dashboard-header">
        <h1 className="text-3xl font-bold text-primary mb-2">⚙️ Paramètres</h1>
        <p className="text-light">Personnalisez votre expérience utilisateur</p>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h2 className="text-2xl font-semibold text-primary mb-4">Apparence</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-title">Mode Sombre</h3>
                <p className="setting-description">Basculer entre le mode clair et sombre</p>
              </div>
              <button onClick={toggleTheme} className={`theme-toggle ${theme === "dark" ? "active" : ""}`}>
                <div className="toggle-slider">{theme === "dark" ? "🌙" : "☀️"}</div>
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="text-2xl font-semibold text-primary mb-4">Données</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-title">Export des Données</h3>
                <p className="setting-description">Télécharger vos dossiers en format JSON</p>
              </div>
              <button className="btn-secondary">📥 Exporter</button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-title">Import des Données</h3>
                <p className="setting-description">Importer des dossiers depuis un fichier JSON</p>
              </div>
              <button className="btn-secondary">📤 Importer</button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-title">Réinitialiser</h3>
                <p className="setting-description">Supprimer toutes les données locales</p>
              </div>
              <button className="btn-danger">🗑️ Réinitialiser</button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="text-2xl font-semibold text-primary mb-4">À Propos</h2>
          <div className="settings-card">
            <div className="about-info">
              <h3 className="text-lg font-semibold text-primary mb-2">AXA Sinistres Assistant V2</h3>
              <p className="text-light mb-4">
                Application interne développée pour Majorel Maroc
                <br />
                Version 2.0 - Janvier 2024
              </p>

              <div className="version-details">
                <div className="detail-item">
                  <span className="detail-label">Développé par:</span>
                  <span className="detail-value">Équipe IT AXA</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dernière mise à jour:</span>
                  <span className="detail-value">15 Janvier 2024</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Support:</span>
                  <span className="detail-value">support-it@axa.ma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
