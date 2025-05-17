// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react"
import { useNavigate } from "react-router-dom"

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

/** Decode a JWT without external deps */
function decodeJwt(token: string): JwtPayload {
  try {
    const payload = token.split(".")[1]
    // base64url → base64
    let b64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    // pad to multiple of 4
    while (b64.length % 4) b64 += "="
    const json = atob(b64)
    return JSON.parse(json)
  } catch {
    return {}
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null
  )

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem("token")
    navigate("/login", { replace: true })
  }, [navigate])

  const login = useCallback(
    (tok: string) => {
      const { exp } = decodeJwt(tok)
      if (exp && Date.now() >= exp * 1000) {
        console.error("Token expired on login")
        return
      }
      localStorage.setItem("token", tok)
      setToken(tok)
      navigate("/dashboard", { replace: true })
    },
    [navigate]
  )

  // Auto-logout when JWT expires
  useEffect(() => {
    if (!token) return
    const { exp } = decodeJwt(token)
    if (!exp) return

    const ms = exp * 1000 - Date.now()
    if (ms <= 0) {
      logout()
    } else {
      const timer = setTimeout(logout, ms)
      return () => clearTimeout(timer)
    }
  }, [token, logout])

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
