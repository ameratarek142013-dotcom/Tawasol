import { createContext, useContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexora-theme') || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    const isDarkTheme = theme === 'dark'

    root.classList.toggle('dark', isDarkTheme)
    root.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light')
    root.style.colorScheme = isDarkTheme ? 'dark' : 'light'
    localStorage.setItem('nexora-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
