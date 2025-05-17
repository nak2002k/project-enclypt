// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react"
import { useNavigate } from "react-router-dom"
import jwtDecode from "jwt-decode"

interface JwtPayload {
  exp?: number
  [key: string]: any
}

interface AuthContextType {
  token: string | null
  login: (tok: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => {
    // load from storage on init
    return localStorage.getItem("token")
  })

  // helper to clear state + storage + redirect
  const logout = () => {
    setToken(null)
    localStorage.removeItem("token")
    navigate("/login", { replace: true })
  }

  const login = (tok: string) => {
    // decode & check expiration before storing
    try {
      const { exp } = jwtDecode<JwtPayload>(tok)
      if (exp && Date.now() >= exp * 1000) {
        throw new Error("Token already expired")
      }
    } catch (err) {
      console.error("Invalid token:", err)
      return
    }
    localStorage.setItem("token", tok)
    setToken(tok)
    navigate("/dashboard", { replace: true })
  }

  // auto‐logout if token expires during session
  useEffect(() => {
    if (!token) return
    let timer: ReturnType<typeof setTimeout>
    try {
      const { exp } = jwtDecode<JwtPayload>(token)
      if (exp) {
        const ms = exp * 1000 - Date.now()
        if (ms <= 0) {
          logout()
        } else {
          timer = setTimeout(logout, ms)
        }
      }
    } catch {
      logout()
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [token])

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}
