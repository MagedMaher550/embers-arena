"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"

export interface Theme {
  id: string
  name: string
  palette: {
    bg: string
    panel: string
    accent: string
    muted: string
    text: string
    textMuted: string
  }
}

export const themes: Record<string, Theme> = {
  "pixel-dark-fantasy": {
    id: "pixel-dark-fantasy",
    name: "Dark Fantasy",
    palette: {
      bg: "#0b0b0d",
      panel: "#111014",
      accent: "#ff7a33",
      muted: "#6b5560",
      text: "#f5f5f0",
      textMuted: "#9a8a90",
    },
  },
  frost: {
    id: "frost",
    name: "Frost",
    palette: {
      bg: "#0d1117",
      panel: "#161b22",
      accent: "#58a6ff",
      muted: "#484f58",
      text: "#e6edf3",
      textMuted: "#7d8590",
    },
  },
  infernal: {
    id: "infernal",
    name: "Infernal",
    palette: {
      bg: "#1a0a0a",
      panel: "#2a1515",
      accent: "#ff3333",
      muted: "#5a3535",
      text: "#ffdddd",
      textMuted: "#aa8888",
    },
  },
}

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes["pixel-dark-fantasy"],
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth()
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes["pixel-dark-fantasy"])

  useEffect(() => {
    if (userProfile?.equippedTheme) {
      const theme = themes[userProfile.equippedTheme] || themes["pixel-dark-fantasy"]
      setCurrentTheme(theme)
      applyTheme(theme)
    }
  }, [userProfile])

  const setTheme = (themeId: string) => {
    const theme = themes[themeId] || themes["pixel-dark-fantasy"]
    setCurrentTheme(theme)
    applyTheme(theme)
  }

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    root.style.setProperty("--theme-bg", theme.palette.bg)
    root.style.setProperty("--theme-panel", theme.palette.panel)
    root.style.setProperty("--theme-accent", theme.palette.accent)
    root.style.setProperty("--theme-muted", theme.palette.muted)
    root.style.setProperty("--theme-text", theme.palette.text)
    root.style.setProperty("--theme-text-muted", theme.palette.textMuted)
  }

  return <ThemeContext.Provider value={{ currentTheme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
