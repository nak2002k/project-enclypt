// src/routes/Encrypt.tsx
import React from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { postFile } from "@/utils/api"
import { Layout } from "@/components/Layout"
import { FileForm } from "@/components/FileForm"
import { AnimatedCard } from "@/components/ui/AnimatedCard"
import { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { Loader2 } from "lucide-react"

export default function Encrypt() {
  const { token } = useAuth()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => postFile("/encrypt", formData, token!),
    onMutate: () => toast.loading("Encrypting…"),
    onSuccess: (blob, form) => {
      toast.success("File encrypted! Your download will start shortly.")
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      const original = (form.get("file") as File)?.name || "file"
      a.href = url
      a.download = `encrypted_${original}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    },
    onError: (err: any) => {
      toast.error(`Encryption failed: ${err.message}`)
    },
  })

  const handleSubmit = (form: FormData) => {
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
          🔒 Encrypt a File
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatedCard className="shadow-lg">
            <CardHeader>
              <CardTitle>Choose Your File & Method</CardTitle>
            </CardHeader>
            <CardContent>
              <FileForm action="encrypt" onSubmit={handleSubmit} />
            </CardContent>
            <CardFooter className="flex justify-end">
              <AnimatedButton
                variant="outline"
                onClick={() => mutation.reset()}
                disabled={!mutation.isError}
              >
                Reset
              </AnimatedButton>
            </CardFooter>
          </AnimatedCard>
        </motion.div>

        {/* Loading State */}
        {mutation.isLoading && (
          <motion.div
            className="flex items-center justify-center space-x-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="animate-spin w-5 h-5 text-blue-600" />
            <span className="text-blue-600">Encrypting…</span>
          </motion.div>
        )}

        {/* Inline Error */}
        {mutation.isError && (
          <motion.p
            className="text-center text-red-600 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {(mutation.error as Error).message || "Something went wrong."}
          </motion.p>
        )}
      </div>
    </Layout>
  )
}
