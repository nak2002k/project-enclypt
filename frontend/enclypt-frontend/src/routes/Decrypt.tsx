// src/routes/Decrypt.tsx
import React, { FormEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/AuthContext"
import { postFile } from "@/utils/api"
import { Layout } from "@/components/Layout"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { Loader2 } from "lucide-react"

export default function Decrypt() {
  const { token } = useAuth()
  const [method, setMethod] = useState<"fernet" | "aes256" | "rsa">("fernet")
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const mutation = useMutation({
    mutationFn: (formData: FormData) => postFile("/decrypt", formData, token!),
    onMutate: () => toast.loading("Decrypting…"),
    onSuccess: (blob, form) => {
      toast.success("File decrypted! Download starting.")
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      const original = (form.get("file") as File)?.name || "file"
      a.href = url
      a.download = `decrypted_${original}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    },
    onError: (err: any) => {
      toast.error(`Decryption failed: ${err.message}`)
    },
  })

  // v5 mutation statuses: "idle" | "pending" | "error" | "success"
  const isPending = mutation.status === "pending"
  const isError = mutation.status === "error"

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    form.set("method", method) // include method in FormData
    mutation.mutate(form)
  }

  return (
    <Layout>
      <div className="flex items-center justify-center h-full px-4">
      <div className="w-full max-w-lg">
        <div
          className="
            bg-white/10 dark:bg-black/30 
            backdrop-blur-lg rounded-2xl 
            border border-white/20 dark:border-black/40 
            shadow-xl p-6"
        >
        <motion.h2
          className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔓 Decrypt a File
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">
                Upload Encrypted File & Choose Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Input */}
                <div>
                  <Label htmlFor="file" className="text-gray-700 dark:text-gray-300">
                    Encrypted File
                  </Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="*/*"
                    required
                    disabled={isPending}
                    className="mt-1 bg-white dark:bg-gray-700"
                  />
                </div>

                {/* Method Selector */}
                <div>
                  <Label htmlFor="method-trigger" className="text-gray-700 dark:text-gray-300">
                    Method
                  </Label>
                  {/* hidden input so FormData includes method */}
                  <input type="hidden" name="method" value={method} />
                  <Select value={method} onValueChange={(v) => setMethod(v as any)}>
                    <SelectTrigger
                      id="method-trigger"
                      className="w-full mt-1 bg-white dark:bg-gray-700"
                      disabled={isPending}
                    >
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="fernet">Fernet (AES-128)</SelectItem>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="rsa">RSA-OAEP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* RSA Key Input */}
                {method === "rsa" && (
                  <div>
                    <Label htmlFor="rsa_private_key" className="text-gray-700 dark:text-gray-300">
                      RSA Private Key
                    </Label>
                    <Input
                      id="rsa_private_key"
                      name="rsa_private_key"
                      placeholder="-----BEGIN PRIVATE KEY-----"
                      disabled={isPending}
                      className="mt-1 font-mono bg-white dark:bg-gray-700"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <AnimatedButton type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      Decrypting…
                    </>
                  ) : (
                    "Decrypt File"
                  )}
                </AnimatedButton>
              </form>
            </CardContent>

            {/* Inline Error */}
            {isError && (
              <CardFooter className="text-center text-sm text-red-600 dark:text-red-400">
                {(mutation.error as Error)?.message || "An unexpected error occurred."}
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
      </div>
      </div>
      
    </Layout>
  )
}
