import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {isDark ? "Dark" : "Light"}
      </span>
      <Switch
        checked={isDark}
        onCheckedChange={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle dark mode"
      />
    </div>
  )
}
