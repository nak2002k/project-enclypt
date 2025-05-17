// src/components/FileForm.tsx
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { cn } from "@/utils/cn"
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

export function FileForm({
  action,
  onSubmit,
  isLoading = false,
}: {
  action: "encrypt" | "decrypt"
  onSubmit: (formData: FormData) => void
  isLoading?: boolean
}) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [method, setMethod] = useState<"fernet" | "aes256" | "rsa">("fernet")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget as HTMLFormElement)
    const file = form.get("file") as File | null
    if (!file || file.size === 0) {
      toast.error("Please select a file")
      return
    }
    if (method === "rsa") {
      const key = (form.get("rsa_public_key") as string || "").trim()
      if (!key) {
        toast.error("RSA public key is required")
        return
      }
    }
    // inject the method value into FormData since <Select> isn't named
    form.set("method", method)
    onSubmit(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto space-y-6"
      noValidate
    >
      {/* File Input */}
      <div>
        <Label htmlFor="file" className="text-gray-700 dark:text-gray-300">
          File
        </Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept="*/*"
          required
          disabled={isLoading}
          className={cn(
            "mt-1 w-full bg-white",
            isDark && "dark:bg-gray-700"
          )}
        />
      </div>

      {/* Method Selector */}
      <div>
        <Label htmlFor="method-trigger" className="text-gray-700 dark:text-gray-300">
          Method
        </Label>
        {/* Hidden field so FormData.get("method") works */}
        <input type="hidden" name="method" value={method} />
        <Select
          value={method}
          onValueChange={(v) => setMethod(v as any)}
        >
          <SelectTrigger
            id="method-trigger"
            className={cn(
              "w-full mt-1 bg-white",
              isDark && "dark:bg-gray-700"
            )}
          >
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              isDark && "dark:bg-gray-700 dark:border-gray-600"
            )}
          >
            <SelectItem value="fernet">Fernet (AES-128)</SelectItem>
            <SelectItem value="aes256">AES-256</SelectItem>
            <SelectItem value="rsa">RSA-OAEP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* RSA Key Input */}
      <AnimatePresence initial={false}>
        {method === "rsa" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Label
              htmlFor="rsa_public_key"
              className="text-gray-700 dark:text-gray-300"
            >
              RSA Public Key
            </Label>
            <Input
              id="rsa_public_key"
              name="rsa_public_key"
              placeholder="-----BEGIN PUBLIC KEY-----"
              disabled={isLoading}
              className={cn(
                "mt-1 w-full font-mono bg-white",
                isDark && "dark:bg-gray-700"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <AnimatedButton
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading
          ? `${action === "encrypt" ? "Encrypting" : "Decrypting"}…`
          : action === "encrypt"
          ? "Encrypt File"
          : "Decrypt File"}
      </AnimatedButton>
    </form>
  )
}
