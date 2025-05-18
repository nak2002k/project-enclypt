import React, { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/AuthContext"
import { postFile } from "@/utils/api"
import { Loader2, FileImage, FileText, Lock, Key, Fingerprint } from "lucide-react"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const encryptionOptions = [
  {
    value: "fernet",
    label: "Fernet (AES-128)",
    icon: Lock,
    desc: "Easy, authenticated, for everyday files. Password-based.",
    minTier: "guest",
  },
  {
    value: "aes256",
    label: "AES-256 (CBC)",
    icon: Key,
    desc: "Stronger. Industry standard. For paid and registered users.",
    minTier: "user",
  },
  {
    value: "rsa",
    label: "RSA-OAEP",
    icon: Fingerprint,
    desc: "Public key encryption. For ultra-secure sharing. Paid only.",
    minTier: "paid",
  },
]

// Util: check if user tier allows an option
function tierAllowed(userTier: string, minTier: string) {
  const tiers = ["guest", "user", "paid"]
  return tiers.indexOf(userTier) >= tiers.indexOf(minTier)
}

export default function Encrypt() {
  const { token } = useAuth()
  // For demo: figure out user's tier (replace with your real logic)
  const userTier = token ? "paid" : "guest" // "user" for registered but not paid
  const [method, setMethod] = useState<"fernet" | "aes256" | "rsa">(
    tierAllowed(userTier, "fernet") ? "fernet" : "aes256"
  )
  const [file, setFile] = useState<File | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const mutation = useMutation({
    mutationFn: (formData: FormData) => postFile("/encrypt", formData, token || undefined),
    onMutate: () => toast.loading("Encrypting…"),
    onSuccess: (blob, form) => {
      toast.success("File encrypted! Download starting.")
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      const original = (form.get("file") as File)?.name || "file"
      a.href = url
      a.download = `encrypted_${original}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setFile(null)
      if (fileInput.current) fileInput.current.value = ""
    },
    onError: (err: any) => {
      toast.error(`Encryption failed: ${err.message}`)
    },
  })

  function filePreview(file: File | null) {
    if (!file) return null
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      return <img src={url} alt="Preview" className="max-h-36 rounded-xl border mb-3 mx-auto shadow" onLoad={() => URL.revokeObjectURL(url)} />
    }
    return (
      <div className="flex flex-col items-center mb-3">
        <FileText className="w-12 h-12 text-indigo-400" />
        <span className="text-xs mt-1">{file.type || "Unknown type"}</span>
      </div>
    )
  }

  const options = encryptionOptions.map(opt => ({
    ...opt,
    disabled: !tierAllowed(userTier, opt.minTier),
    reason:
      !tierAllowed(userTier, opt.minTier)
        ? opt.minTier === "user"
          ? "Register to unlock"
          : "Upgrade to paid"
        : undefined,
  }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return toast.error("Select a file first!")
    const fd = new FormData()
    fd.append("file", file)
    fd.append("method", method)
    mutation.mutate(fd)
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${
      isDark
        ? "from-black via-gray-900 to-indigo-950"
        : "from-blue-50 via-white to-indigo-100"
    } transition-colors`}>
      <Navbar />
      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Feature blurb */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-indigo-700 dark:text-indigo-300 mb-3">Encrypt anything, <span className="text-gray-900 dark:text-white">safely.</span></h2>
            <p className="text-lg text-gray-500 dark:text-gray-300 font-medium max-w-xl mx-auto">
              Drag and drop any file—choose your encryption method. <span className="text-indigo-700 dark:text-indigo-300 font-semibold">Fernet</span> for quick stuff, <span className="font-semibold">AES-256</span> for banks-level, <span className="font-semibold">RSA</span> for true paranoia.  
              <br />We never see your keys. Your data, your rules.
            </p>
          </div>
          {/* Card */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/90 dark:bg-black/60 backdrop-blur-2xl border border-white/10 dark:border-gray-900/40 rounded-3xl shadow-2xl px-8 py-10 space-y-6"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            {/* Encryption Method Picker */}
            <div>
              <label className="block text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Encryption method</label>
              <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => !opt.disabled && setMethod(opt.value as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition
                      font-bold text-base border-2 shadow-sm
                      ${method === opt.value
                        ? "border-indigo-600 bg-indigo-600/10 dark:bg-indigo-400/20 text-indigo-900 dark:text-indigo-100"
                        : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                      }
                      ${opt.disabled && "opacity-60 pointer-events-none"}
                    `}
                  >
                    <opt.icon className="w-5 h-5" />
                    {opt.label}
                    {opt.disabled && (
                      <span className="ml-2 text-xs font-medium text-red-500">{opt.reason}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                File to encrypt
              </label>
              <div
                className={`flex items-center gap-4 rounded-xl px-4 py-3 border-2 border-dashed
                ${file
                    ? "border-indigo-400 bg-indigo-50/70 dark:bg-indigo-900/40"
                    : "border-gray-300 bg-gray-100/60 dark:bg-gray-800/40"
                  }
                `}
              >
                <input
                  ref={fileInput}
                  type="file"
                  name="file"
                  className="flex-1 outline-none text-base file:bg-indigo-600 file:text-white file:font-semibold file:px-3 file:py-1.5 file:rounded-lg file:border-0"
                  onChange={handleFileChange}
                  accept="*/*"
                  required
                />
                <AnimatedButton
                  type="submit"
                  className="ml-2"
                  disabled={!file || mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      Encrypting…
                    </>
                  ) : (
                    "Encrypt"
                  )}
                </AnimatedButton>
              </div>
              {file &&
                <div className="mt-4 flex flex-col items-center">
                  {filePreview(file)}
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    <b>{file.name}</b> ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              }
            </div>

            {/* Info blurb */}
            <div className="text-center text-gray-500 dark:text-gray-300 text-sm pt-2">
              <span className="block">We never store your files. All encryption happens in-memory, and your keys are never sent to our servers.</span>
              <span className="block mt-1">Lost your password or private key? We can’t recover it. <b>Keep it safe.</b></span>
            </div>

            {/* Error/success state */}
            {mutation.isError && (
              <motion.p
                className="text-center text-red-600 dark:text-red-400 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {(mutation.error as Error)?.message || "Something went wrong."}
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
