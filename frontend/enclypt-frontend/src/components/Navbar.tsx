// src/components/NavBar.tsx
import { useTheme } from "next-themes"
import { IconSun, IconMoon } from "@tabler/icons-react"

export function NavBar() {
  const { theme, setTheme } = useTheme()
  return (
    <nav className="sticky top-0 z-40 w-full bg-[#14181e] border-b border-gray-800/80 flex items-center justify-between px-8 py-4">
      <span className="font-bold text-2xl tracking-tight text-white select-none">Enclypt</span>
      <button
        aria-label="Toggle dark mode"
        className="rounded-full p-2 bg-gray-800 hover:bg-indigo-600 transition-colors"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark"
          ? <IconSun className="w-6 h-6 text-yellow-300" />
          : <IconMoon className="w-6 h-6 text-indigo-400" />}
      </button>
    </nav>
  )
}
