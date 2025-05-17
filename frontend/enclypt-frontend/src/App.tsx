// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Login from "@/routes/Login";
import Register from "@/routes/Register";
import Encrypt from "@/routes/Encrypt";
import Decrypt from "@/routes/Decrypt";
import Dashboard from "@/routes/Dashboard";

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {token ? (
        <>
          <Route path="/encrypt" element={<Encrypt />} />
          <Route path="/decrypt" element={<Decrypt />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
