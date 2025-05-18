// src/routes/Landing.tsx

import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { IconLock, IconKey, IconFingerprint } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const features = [
  {
    icon: IconLock,
    title: "Absolute Privacy—Every Time",
    desc: `Your files, your business. Enclypt uses modern cryptography (Fernet, AES-256, RSA-OAEP) so only *you* can access your files. No ads, no backdoors, no shady logging. Even if we get hacked, your data is just math.`,
    story: "Worried about Google, Microsoft, or hackers snooping? Don’t be. With Enclypt, the power stays in your hands.",
  },
  {
    icon: IconKey,
    title: "Share Without Anxiety",
    desc: `Need to email sensitive stuff? Medical records? Secret startup docs? Our “Share Mode” lets you create one-time links or encrypted downloads—so you never worry about leaks or accidental forwards.`,
    story: "Send files to anyone, anywhere. You decide who gets access and for how long. Zero trust required.",
  },
  {
    icon: IconFingerprint,
    title: "No Vendor Lock-In, No Bullshit",
    desc: `Our unlocker works offline. Your keys stay with you, period. We publish our unlockers and specs—meaning if you don’t trust us, you can verify it yourself (or hire a nerd who does).`,
    story: "Enclypt is the security tool you recommend to your friends *and* your boss. Transparent, open, and simple.",
  },
  {
    icon: IconLock,
    title: "Zero-Risk Backups",
    desc: `Worried about ransomware or a stolen laptop? Encrypt your cloud backups—so even if someone gets your Dropbox or Google Drive, they get nothing but gibberish. Restore with your key, anytime.`,
    story: "Every file is a vault. Sleep easy, even if you lose your device or get phished.",
  },
]

const encryptions = [
  {
    icon: IconLock,
    title: "Fernet (AES-128)",
    desc: "Perfect for quick protection—just pick a password, encrypt, done. Simpler than zipping with a password, and safer too.",
  },
  {
    icon: IconKey,
    title: "AES-256 (CBC)",
    desc: "Industry-standard for banks and governments. Use this for your most critical files—never worry about brute force.",
  },
  {
    icon: IconFingerprint,
    title: "RSA-OAEP",
    desc: "Public-key encryption for ultra-secure sharing. Only your recipient’s private key can unlock the file—so you can finally trust email again.",
  },
]

const blockAnim = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
}

export default function Landing() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Index for which feature is active
  const [idx, setIdx] = useState(0)
  const lock = useRef(false)

  // Scroll wheel and up/down arrows to move through features
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (lock.current) return
      if (e.deltaY > 20 && idx < features.length - 1) {
        setIdx((i) => Math.min(features.length - 1, i + 1))
        lock.current = true
        setTimeout(() => (lock.current = false), 600)
      } else if (e.deltaY < -20 && idx > 0) {
        setIdx((i) => Math.max(0, i - 1))
        lock.current = true
        setTimeout(() => (lock.current = false), 600)
      }
    }
    window.addEventListener("wheel", onWheel)
    return () => window.removeEventListener("wheel", onWheel)
  }, [idx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && idx < features.length - 1) setIdx(idx + 1)
      if (e.key === "ArrowUp" && idx > 0) setIdx(idx - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [idx])

  // Gradient background per theme
  const bgPattern = isDark
    ? "bg-gradient-to-br from-indigo-950 via-black to-gray-900"
    : "bg-gradient-to-br from-blue-100 via-white to-blue-50"

  return (
    <div className={`min-h-screen w-full transition-colors ${bgPattern}`}>
      <Navbar />
      {/* HERO */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-24 text-center relative z-10">
        <motion.h1
          className="text-6xl md:text-7xl font-black mb-8 tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="block text-indigo-700 dark:text-indigo-300 mb-2">File encryption,</span>
          <span className="text-gray-900 dark:text-gray-100">for people who actually care.</span>
        </motion.h1>
        <motion.p
          className="text-2xl md:text-3xl max-w-3xl mx-auto mb-8 text-gray-500 dark:text-gray-300 font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <b>Enclypt</b> keeps your files private, even from us.<br />
          Free for everyone. Strong enough for hackers.<br />
          Built for normal humans, not just “cyber experts”.
        </motion.p>
        <Button
          size="lg"
          className="px-10 py-4 text-xl font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-xl"
          onClick={() => navigate("/encrypt")}
        >
          🔒 Encrypt now
        </Button>
      </section>

      {/* Features one-by-one carousel (LEFT desc, RIGHT icon) */}
      <section className="flex flex-col items-center min-h-[50vh] w-full px-6 py-12 transition-colors">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            className="max-w-4xl w-full mx-auto flex flex-col md:flex-row items-center gap-10"
            {...blockAnim}
            style={{ minHeight: 290 }}
          >
            {/* LEFT: desc */}
            <div className="md:w-3/5 text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-indigo-700 dark:text-indigo-300">
                {features[idx].title}
              </h2>
              <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 mb-2">
                {features[idx].desc}
              </p>
              <span className="text-md text-gray-400 dark:text-gray-400 italic">
                {features[idx].story}
              </span>
            </div>
            {/* RIGHT: icon */}
            <div className="md:w-2/5 flex justify-center">
              {React.createElement(
                features[idx].icon,
                { className: "w-24 h-24 text-indigo-400 dark:text-indigo-300 drop-shadow-xl" }
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Manual nav */}
        <div className="flex items-center gap-8 mt-8">
          <Button
            variant="outline"
            disabled={idx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
          >
            ← Prev
          </Button>
          <Button
            variant="outline"
            disabled={idx === features.length - 1}
            onClick={() => setIdx((i) => Math.min(features.length - 1, i + 1))}
          >
            Next →
          </Button>
        </div>
      </section>

      {/* Encryption Methods (alternate L/R icon + desc) */}
      <section className="flex flex-col items-center min-h-[50vh] w-full px-6 py-12">
        <h2 className="text-4xl font-bold mb-14 text-center tracking-tight">
          Encryption methods: Choose your weapon
        </h2>
        <div className="flex flex-col gap-16 w-full max-w-4xl mx-auto">
          {encryptions.map((enc, i) => (
            <motion.div
              key={enc.title}
              className={`flex flex-col md:flex-row ${i % 2 === 0 ? "" : "md:flex-row-reverse"} items-center md:gap-20 gap-10`}
              initial="hidden"
              whileInView="animate"
              viewport={{ once: true, amount: 0.25 }}
              variants={{
                hidden: { opacity: 0, x: i % 2 === 0 ? -100 : 100 },
                animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
              }}
            >
              <div className="md:w-3/5 text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-indigo-700 dark:text-indigo-300">
                  {enc.title}
                </h3>
                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 mb-2">
                  {enc.desc}
                </p>
              </div>
              <div className="md:w-2/5 flex justify-center">
                {React.createElement(
                  enc.icon,
                  { className: "w-20 h-20 text-indigo-400 dark:text-indigo-300 drop-shadow-xl" }
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sticky CTA */}
      <Button
        size="lg"
        className="fixed bottom-8 right-8 px-8 py-3 text-lg font-semibold rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-2xl z-50"
        onClick={() => navigate("/encrypt")}
      >
        Try Enclypt Now
      </Button>

      <Footer />
    </div>
  )
}
