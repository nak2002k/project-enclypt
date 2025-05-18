// src/components/Footer.tsx
import { IconBrandGithub, IconBrandLinkedin, IconShieldLock } from "@tabler/icons-react"
import { useTheme } from "next-themes"

export default function Footer() {
  const { theme } = useTheme()
  return (
    <footer className={`fixed left-1/2 bottom-7 z-50 -translate-x-1/2 px-10 py-3 rounded-full shadow-2xl flex gap-7 items-center justify-center
      ${theme === "dark"
        ? "bg-[#181c29]/90 text-gray-100 border border-white/10"
        : "bg-white/95 text-gray-700 border border-gray-300"}
      transition-all`}>
      <IconShieldLock className="w-6 h-6 text-indigo-500" />
      <a href="https://github.com/your-link" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition">
        <IconBrandGithub className="w-6 h-6" />
      </a>
      <a href="https://linkedin.com/in/your-link" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition">
        <IconBrandLinkedin className="w-6 h-6" />
      </a>
      <a href="/privacy-policy" className="ml-4 text-xs hover:underline">Privacy Policy</a>
      <span className="ml-5 text-xs opacity-50">© 2025 Enclypt</span>
    </footer>
  )
}
