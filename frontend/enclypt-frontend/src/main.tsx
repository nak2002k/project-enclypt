// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import App from "./App";

// Sonner
import { Toaster } from "sonner";
import "sonner/dist/sonner.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster richColors />  {/* this mounts the toast viewport */}
    </AuthProvider>
  </BrowserRouter>
);
