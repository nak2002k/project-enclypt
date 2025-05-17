// src/components/Layout.tsx
import React, { ReactNode, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button }  from "@/components/ui/button";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { DarkModeToggle } from "@/components/DarkModeToggle"
// … inside your header JSX …
<header className="flex items-center justify-between px-4 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
  {/* menu toggle, title, etc. */}
  <DarkModeToggle />
</header>

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transition-transform bg-white border-r border-gray-200 shadow-sm
          ${open ? "translate-x-0" : "-translate-x-full"}`
        }
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <h1 className="text-lg font-semibold">Enclypt</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <IconX className="w-5 h-5" />
          </Button>
        </div>
        <Sidebar />
      </aside>

      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <header className="flex items-center justify-between px-4 h-16 bg-white border-b border-gray-200 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className="md:hidden"
          >
            <IconMenu2 className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            {/* optional page title */}
          </div>
          <div>
            {/* user menu / avatar */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
