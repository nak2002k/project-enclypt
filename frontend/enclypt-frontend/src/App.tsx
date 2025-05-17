// src/App.tsx
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Encrypt from "@/routes/Encrypt"
import Decrypt from "@/routes/Decrypt"
import Dashboard from "@/routes/Dashboard"
import Login from "@/routes/Login"
import Register from "@/routes/Register"
import { useAuth } from "@/context/AuthContext"

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Guest‐accessible pages */}
      <Route path="/" element={<Navigate to="/encrypt" replace />} />
      <Route path="/encrypt" element={<Encrypt />} />
      <Route path="/decrypt" element={<Decrypt />} />

      {/* Auth pages (only shown if not logged in) */}
      {!isAuthenticated && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}

      {/* Dashboard is protected */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated
            ? <Dashboard />
            : <Navigate to="/encrypt" replace />
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
