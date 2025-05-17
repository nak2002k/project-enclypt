// src/routes/Decrypt.tsx
import React, { FormEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { motion } from "framer-motion"
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

  const mutation = useMutation({
    mutationFn: (formData: FormData) => postFile("/decrypt", formData, token!),
    onMutate: () => toast.loading("Decrypting…"),
    onSuccess: (blob, form) => {
      toast.success("File decrypted! Download starting.")
      // trigger download
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget as HTMLFormElement)
    mutation.mutate(form)
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.h2
          className="text-3xl font-semibold mb-6"
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
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Upload Encrypted File & Choose Method</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="file">Encrypted File</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="*/*"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="method">Method</Label>
                  <Select
                    id="method"
                    name="method"
                    value={method}
                    onValueChange={(v) => setMethod(v as any)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fernet">Fernet (AES-128)</SelectItem>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="rsa">RSA-OAEP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {method === "rsa" && (
                  <div>
                    <Label htmlFor="rsaKey">RSA Private Key</Label>
                    <Input
                      id="rsaKey"
                      name="rsa_private_key"
                      placeholder="-----BEGIN PRIVATE KEY-----"
                      className="mt-1 font-mono"
                      rows={4}
                    />
                  </div>
                )}

                <AnimatedButton
                  type="submit"
                  className="w-full"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? (
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

            {mutation.isError && (
              <CardFooter className="text-center text-sm text-red-600">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : "An unexpected error occurred."}
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}
