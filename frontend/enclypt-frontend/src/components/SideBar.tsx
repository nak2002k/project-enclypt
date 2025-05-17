// src/components/Sidebar.tsx
import React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { IconUpload, IconDownload, IconLayoutDashboard } from "@tabler/icons-react"
import { cn } from "@/utils/cn"
import { useAuth } from "@/context/AuthContext"
import { DarkModeToggle } from "./DarkModeToggle"

const links = [
  { to: "/encrypt", label: "Encrypt", icon: <IconUpload className="w-5 h-5" /> },
  { to: "/decrypt", label: "Decrypt", icon: <IconDownload className="w-5 h-5" /> },
  { to: "/dashboard", label: "Dashboard", icon: <IconLayoutDashboard className="w-5 h-5" /> },
]

export function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success("Logged out")
    navigate("/login")
  }

  return (
    <div className="flex flex-col h-full justify-between bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div>
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Enclypt</h1>
        </div>
        <nav className="px-2 space-y-1">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2 my-1 rounded-md text-sm font-medium transition",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )
              }
            >
              <motion.span
                className="mr-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {icon}
              </motion.span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center px-4 py-2 rounded-md text-sm font-medium transition",
            "text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Logout
        </motion.button>

        <div className="mt-6 px-4">
          <DarkModeToggle />
        </div>
      </div>
    </div>
  )
}
