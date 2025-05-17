import React, { ReactNode, useState } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { Sidebar } from "@/components/SideBar"
import { DarkModeToggle } from "@/components/DarkModeToggle"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/utils/cn"

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // derive a title from the path
  const title = {
    "/encrypt": "🔒 Encrypt",
    "/decrypt": "🔓 Decrypt",
    "/dashboard": "📁 Dashboard",
  }[pathname] || ""

  return (
    
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Enclypt
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setOpen(false)}
          >
            <IconX className="w-5 h-5" />
          </Button>
        </div>
        <Sidebar />
      </aside>

      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setOpen(true)}
            >
              <IconMenu2 className="w-5 h-5" />
            </Button>
            {title && (
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Sign Up
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
