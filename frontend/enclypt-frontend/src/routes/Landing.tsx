// src/routes/Landing.tsx
import React from "react"
import { useNavigate } from "react-router-dom"
import Tilt from "react-parallax-tilt"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { IconLock } from "@tabler/icons-react"

export default function Landing() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* 3D Tilt Lock Icon */}
      <Tilt
        tiltMaxAngleX={25}
        tiltMaxAngleY={25}
        glareEnable
        glareMaxOpacity={0.3}
        className="w-48 h-48 mb-8"
        style={{ perspective: 1000 }}
      >
        <div
          className="w-full h-full flex items-center justify-center bg-gradient-to-br 
                     from-blue-500 to-purple-600 rounded-2xl shadow-2xl"
        >
          <IconLock className="w-24 h-24 text-white" />
        </div>
      </Tilt>

      {/* Hero Text */}
      <motion.h1
        className="text-5xl font-extrabold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🛡️ Project Enclypt
      </motion.h1>
      <motion.p
        className="text-lg max-w-2xl text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Secure, modular file encryption SaaS. Pick from Fernet, AES-256, or RSA-OAEP.
        Guests get 25 MB free—upgrade for unlimited power and offline unlockers.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Button size="lg" onClick={() => navigate("/encrypt")}>
          🔒 Encrypt a File
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate("/decrypt")}>
          🔓 Decrypt a File
        </Button>
      </motion.div>
    </div>
  )
}
