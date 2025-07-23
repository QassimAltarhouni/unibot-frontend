'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createAppTheme from '@/Style/theme'
import { usePathname } from 'next/navigation'

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dashboardDarkMode, setDashboardDarkMode] = useState(false)
  const pathname = usePathname()

  // Only apply dark mode to dashboard pages
  const isDashboardPage = pathname?.startsWith('/dashboard')
  const shouldUseDarkMode = isDashboardPage && dashboardDarkMode

  useEffect(() => {
    // Load dashboard dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('dashboard-dark-mode')
    if (savedDarkMode) {
      setDashboardDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  const toggleDarkMode = () => {
    // Only allow toggling on dashboard pages
    if (isDashboardPage) {
      const newDarkMode = !dashboardDarkMode
      setDashboardDarkMode(newDarkMode)
      localStorage.setItem('dashboard-dark-mode', JSON.stringify(newDarkMode))
    }
  }

  // Create theme with proper isolation
  const theme = createAppTheme(
    shouldUseDarkMode ? 'dark' : 'light',
    isDashboardPage,
  )

  return (
    <ThemeContext.Provider
      value={{ darkMode: shouldUseDarkMode, toggleDarkMode }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within an AppThemeProvider')
  }
  return context
}
