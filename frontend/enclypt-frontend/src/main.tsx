import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/context/AuthContext"
import App from "./App"
import "./index.css"
import { Toaster } from "sonner"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster richColors />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ThemeProvider>
)
