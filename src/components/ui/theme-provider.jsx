"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
    theme: "dark",
    setTheme: () => null,
})

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark")

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("dark")

        if (theme === "dark") {
            root.classList.add("dark")
        }

        localStorage.setItem("theme", theme)
    }, [theme])

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
