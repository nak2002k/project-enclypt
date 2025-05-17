// src/routes/Register.tsx
import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { postJSON } from "@/utils/api"
import {
  AnimatedCard
} from "@/components/ui/AnimatedCard"
import {
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

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    toast.loading("Creating account…")
    try {
      await postJSON("/register", { email, password })
      toast.success("Account created! Please log in.")
      navigate("/login")
    } catch (err: any) {
      toast.error(err.message || "Registration failed")
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
        <AnimatedCard className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                Create your account
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Free account: 100 MB limit, AES-256 support
              </CardDescription>
            </div>
            <DarkModeToggle />
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email address
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
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 bg-white dark:bg-gray-700"
                />
              </div>
              <AnimatedButton
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Registering…" : "Create Account"}
              </AnimatedButton>
            </form>
          </CardContent>

          <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </AnimatedCard>
      </motion.div>
    </div>
  )
}
