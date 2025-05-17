// src/App.tsx
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Encrypt from "@/routes/Encrypt"
import Decrypt from "@/routes/Decrypt"
import Dashboard from "@/routes/Dashboard"
import Login from "@/routes/Login"
import Register from "@/routes/Register"
import Landing from "@/routes/Landing"
import { useAuth } from "@/context/AuthContext"


export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* always available */}
      <Route path="/encrypt" element={<Encrypt />} />
      <Route path="/decrypt" element={<Decrypt />} />

      {!isAuthenticated && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
