import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"       // ← import this
import { AuthProvider } from "@/context/AuthContext"
import App from "./App"
import "./index.css"
import { Toaster } from "sonner"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster richColors />     
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
)
