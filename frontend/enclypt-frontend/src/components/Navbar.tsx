// src/components/Navbar.tsx
import { Link } from "react-router-dom"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { IconLock, IconMoon, IconSun } from "@tabler/icons-react"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit px-8 py-3 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-700
      ${isDark ? "bg-gray-900/90" : "bg-white/90"}`}>
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-wide">
          <IconLock className={`w-6 h-6 ${isDark ? "text-indigo-400" : "text-indigo-700"}`} />
          Enclypt
        </Link>
        <div className="flex gap-3">
          <Link to="/encrypt" className="font-medium hover:underline">Encrypt</Link>
          <Link to="/decrypt" className="font-medium hover:underline">Decrypt</Link>
          <Link to="/dashboard" className="font-medium hover:underline">Dashboard</Link>
        </div>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="ml-4"
        >
          {isDark ? <IconSun className="w-6 h-6" /> : <IconMoon className="w-6 h-6" />}
        </Button>
      </div>
    </nav>
  )
}
