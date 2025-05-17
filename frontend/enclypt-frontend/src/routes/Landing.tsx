// src/routes/Landing.tsx
import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { Button } from "@/components/ui/button"
import { IconLock, IconKey, IconFingerprint } from "@tabler/icons-react"

export default function Landing() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const particlesInit = useCallback(async (main) => {
    await loadFull(main)
  }, [])

  const btnAnim = { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-indigo-900 via-black to-gray-900"
          : "bg-gradient-to-br from-blue-200 via-white to-blue-100"
      }`}
    >
      {/* Particle background */}
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 60 },
            size: { value: 3, random: true },
            move: { speed: 0.4 },
            opacity: { value: 0.5, random: true },
            links: {
              enable: true,
              distance: 120,
              color: isDark ? "#888" : "#555",
              opacity: 0.2,
              width: 1,
            },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" } },
            modes: { repulse: { distance: 100 } },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Gradient overlay for readability */}
      <div
        className={`absolute inset-0 z-10 ${
          isDark ? "bg-black/60" : "bg-white/60"
        }`}
      />

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="p-8 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/10"
        >
          <IconLock
            className={`mx-auto mb-4 w-16 h-16 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            } transition-transform hover:scale-105`}
          />
          <h1
            className={`text-5xl sm:text-6xl font-extrabold leading-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Project Enclypt
          </h1>
          <p
            className={`mt-4 max-w-xl text-lg sm:text-xl ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Next-gen file encryption SaaS—Fernet, AES-256 & RSA-OAEP.
            Guests get 25 MB free; upgrade for unlimited power and offline unlockers.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.div {...btnAnim}>
            <Button size="lg" onClick={() => navigate("/encrypt")}>
              🔒 Encrypt
            </Button>
          </motion.div>
          <motion.div {...btnAnim}>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/decrypt")}
            >
              🔓 Decrypt
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            {
              Icon: IconLock,
              title: "Fernet (AES-128)",
              desc: "Symmetric Authenticated Encryption with HMAC.",
            },
            {
              Icon: IconKey,
              title: "AES-256 CBC",
              desc: "Secure IV + PKCS#7 padding.",
            },
            {
              Icon: IconFingerprint,
              title: "RSA-OAEP",
              desc: "Public-key encryption with SHA-256.",
            },
          ].map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center space-y-2"
            >
              <Icon className="w-8 h-8 mb-1 text-indigo-400" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
