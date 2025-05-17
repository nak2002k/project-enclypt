// src/routes/Login.tsx
import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { postJSON } from "@/utils/api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { DarkModeToggle } from "@/components/DarkModeToggle"
import { Loader2 } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await postJSON("/token", { username: email, password })
      login(data.access_token)
      toast.success("Welcome back!")
      navigate("/dashboard")
    } catch (err: any) {
      toast.error(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                Sign in to Enclypt
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Secure file encryption SaaS
              </CardDescription>
            </div>
            <DarkModeToggle />
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 bg-white dark:bg-gray-700"
                />
              </div>

              <AnimatedButton
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </AnimatedButton>
            </form>
          </CardContent>

          <CardFooter className="px-6 py-4 text-center bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
