// src/components/Layout.tsx
import React, { ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"
import { Sidebar } from "@/components/SideBar"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { DarkModeToggle } from "@/components/DarkModeToggle"

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Enclypt
                </h1>
                <AnimatedButton
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="md:hidden text-gray-700 dark:text-gray-300"
                >
                  <IconX className="w-5 h-5" />
                </AnimatedButton>
              </div>
              <Sidebar />
            </motion.aside>
            <motion.div
              className="fixed inset-0 z-10 bg-black bg-opacity-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header
          className={cn(
            "flex items-center justify-between px-4 h-16",
            "bg-white dark:bg-gray-800",
            "border-b border-gray-200 dark:border-gray-700",
            "shadow-sm"
          )}
        >
          <AnimatedButton
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            <IconMenu2 className="w-5 h-5" />
          </AnimatedButton>
          <div className="flex-1 text-center">
            {/* You can inject page titles here via context or props */}
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            {/* user avatar/menu could go here */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
