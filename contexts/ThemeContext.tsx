

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const COLORS = {
  light: {
    background: "#F8F5EF", // Beige-blanc (soft bg)
    card: "#FFFFFF", // Blanc pur
    primary: "#2436B1", // Bleu roi (accent lumineux)
    secondary: "#0F1724", // Bleu nuit (accent)
    accent: "#2B4BE6", // Bleu roi alternatif
    text: "#0B0B0D", // Noir (textes)
    textSecondary: "#64748B", // Gris pour textes secondaires
    border: "#E7E5DC", // Bordures subtiles
    success: "#16A34A",
    warning: "#D97706",
    error: "#E02424", // Touche rouge (alerte)
    hover: "#F0EDE6", // Hover state
  },
  dark: {
    background: "#0B0B0D", // Noir (bg dark)
    card: "#0F1724", // Bleu nuit (surfaces)
    primary: "#2B4BE6", // Bleu roi lumineux
    secondary: "#2436B1", // Bleu roi
    accent: "#0F1724", // Bleu nuit
    text: "#FFFFFF", // Blanc (texte clair)
    textSecondary: "#94A3B8", // Gris clair pour textes secondaires
    border: "#1E293B", // Bordures sombres
    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#F87171", // Rouge plus doux en dark
    hover: "#1E293B", // Hover state
  },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("axa-theme") as Theme
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme)
      document.body.style.backgroundColor = COLORS[theme].background
      document.body.style.color = COLORS[theme].text
      localStorage.setItem("axa-theme", theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
