// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Button }  from "@/components/ui/button";
import {
  IconLock,
  IconKey,
  IconUpload,
  IconDownload,
  IconLayoutDashboard,
} from "@tabler/icons-react";

const links = [
  { to: "/encrypt", label: "Encrypt", icon: <IconUpload /> },
  { to: "/decrypt", label: "Decrypt", icon: <IconDownload /> },
  { to: "/dashboard", label: "Dashboard", icon: <IconLayoutDashboard /> },
];

export function Sidebar() {
  return (
    <nav className="p-4 space-y-1">
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition
             ${isActive
               ? "bg-blue-100 text-blue-600"
               : "text-gray-700 hover:bg-gray-100"}
            `
          }
        >
          <span className="w-5 h-5 mr-3">{icon}</span>
          {label}
        </NavLink>
      ))}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <Button variant="outline" className="w-full">
          Logout
        </Button>
      </div>
    </nav>
  );
}
