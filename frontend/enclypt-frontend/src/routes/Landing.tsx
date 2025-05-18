import { NavBar } from "@/components/Navbar"
import { IconLock, IconKey, IconFingerprint } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const features = [
  {
    title: "No Account Needed",
    desc: "Encrypt up to 25 MB instantly—no sign-up, no fuss. When you’re ready for more, unlock unlimited storage and stronger encryption by creating an account.",
    Icon: IconLock,
  },
  {
    title: "Zero-Knowledge. Zero Storage.",
    desc: "Your files never touch our servers. We only store minimal metadata. Your secrets are *always* yours. Even we can’t see them.",
    Icon: IconKey,
  },
  {
    title: "Offline Unlocker",
    desc: "Upgrade for a downloadable Windows app that decrypts files offline. Take privacy into your own hands—no internet required.",
    Icon: IconFingerprint,
  },
]

const methods = [
  {
    Icon: IconLock,
    title: "Fernet (AES-128)",
    desc: (
      <>
        <span className="block font-medium mb-1">
          <span className="text-indigo-600 dark:text-indigo-400">Everyone’s default.</span> Just set a password, encrypt, and decrypt anywhere. No keyfiles, no drama.
        </span>
        <span className="block text-xs text-gray-400">
          Tech: Symmetric encryption, HMAC-authenticated, AES-128, one password to lock/unlock.
        </span>
      </>
    ),
    side: "right",
  },
  {
    Icon: IconKey,
    title: "AES-256 (CBC Mode)",
    desc: (
      <>
        <span className="block font-medium mb-1">
          <span className="text-emerald-600 dark:text-emerald-400">Stronger for accounts.</span> Maximum security for power users and businesses. Account required.
        </span>
        <span className="block text-xs text-gray-400">
          Tech: AES-256, CBC, PKCS#7 padding, random IV.
        </span>
      </>
    ),
    side: "left",
  },
  {
    Icon: IconFingerprint,
    title: "RSA-OAEP",
    desc: (
      <>
        <span className="block font-medium mb-1">
          <span className="text-yellow-600 dark:text-yellow-400">Share securely, even with strangers.</span> Encrypt files for anyone if you have their public key. Only they can decrypt.
        </span>
        <span className="block text-xs text-gray-400">
          Tech: Asymmetric RSA-2048+, OAEP, SHA-256.
        </span>
      </>
    ),
    side: "right",
  },
]

const revealVariant = {
  hidden: { opacity: 0, y: 60 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, type: "spring", bounce: 0.22 },
  }),
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#10141a] text-gray-900 dark:text-gray-100 flex flex-col transition-colors">
      <NavBar />

      {/* HERO */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-24 text-center bg-white dark:bg-[#10141a] transition-colors">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          File Encryption<br className="hidden sm:inline" />
          <span className="text-indigo-600 dark:text-indigo-400">Reimagined</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-gray-500 dark:text-gray-300 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Enclypt protects your files with Fernet, AES-256 & RSA.<br />
          Guest usage is free, upgrades unlock offline and unlimited power.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <Button
            size="lg"
            className="mt-2 px-8 py-3 text-lg font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-xl"
            onClick={() => navigate("/encrypt")}
          >
            🔒 Encrypt now
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto w-full px-6 py-20">
        {features.map(({ title, desc, Icon }, i) => (
          <motion.div
            key={title}
            className={`flex flex-col-reverse md:flex-row ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center justify-between mb-16 gap-10`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={revealVariant}
            custom={i}
          >
            {/* Text */}
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">{desc}</p>
            </div>
            {/* Icon */}
            <div className="flex-shrink-0 md:w-1/3 flex justify-center mb-4 md:mb-0">
              <Icon className="w-16 h-16 text-indigo-400 dark:text-indigo-300 drop-shadow-lg" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Encryption Methods — side-by-side */}
      <section className="max-w-5xl mx-auto w-full px-6 pt-8 pb-24">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Encryption Methods Explained
        </h2>
        {methods.map(({ Icon, title, desc, side }, i) => (
          <motion.div
            key={title}
            className={`flex flex-col md:flex-row ${side === "right" ? "md:flex-row" : "md:flex-row-reverse"} items-center justify-between mb-16 gap-10`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealVariant}
            custom={i}
          >
            {/* Text */}
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <div className="text-gray-700 dark:text-gray-200 text-base">{desc}</div>
            </div>
            {/* Icon */}
            <div className="flex-shrink-0 md:w-1/3 flex justify-center mb-4 md:mb-0">
              <Icon className="w-14 h-14" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA Footer */}
      <footer className="py-14 flex flex-col items-center mt-12 bg-white dark:bg-[#10141a] transition-colors">
        <Button
          size="lg"
          className="px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-blue-700 hover:from-indigo-600 hover:to-blue-800 shadow-xl"
          onClick={() => navigate("/register")}
        >
          Create your free account &rarr;
        </Button>
        <span className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Enclypt. All rights reserved.
        </span>
      </footer>
    </div>
  )
}
