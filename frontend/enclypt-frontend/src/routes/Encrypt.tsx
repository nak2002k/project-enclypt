import React from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/AuthContext"
import { postFile } from "@/utils/api"
import { Layout } from "@/components/Layout"
import { FileForm } from "@/components/FileForm"
import { AnimatedCard } from "@/components/ui/AnimatedCard"
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { Loader2 } from "lucide-react"

export default function Encrypt() {
  const { token } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const mutation = useMutation({
    mutationFn: (formData: FormData) => postFile("/encrypt", formData, token!),
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
      <div className={`flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 transition-colors
        ${isDark 
          ? "bg-gradient-to-br from-gray-950 via-black to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100"
        }
      `}>
        <motion.div
          className="relative w-full max-w-xl"
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <AnimatedCard className="shadow-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/60 rounded-3xl px-6 py-8">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="text-4xl font-black mb-2 text-indigo-700 dark:text-indigo-300 flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin-slow text-indigo-500 dark:text-indigo-400 opacity-50" />
                Encrypt a File
              </CardTitle>
              <div className="text-md text-gray-500 dark:text-gray-400 font-medium mb-1">
                Secure any file in seconds. Choose your method, drop your file, done.
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <FileForm action="encrypt" onSubmit={handleSubmit} />
            </CardContent>
            <CardFooter className="flex justify-end mt-2">
              <AnimatedButton
                variant="outline"
                onClick={() => mutation.reset()}
                disabled={!mutation.isError}
              >
                Reset
              </AnimatedButton>
            </CardFooter>
            {mutation.isPending && (
              <motion.div
                className="flex items-center justify-center space-x-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="animate-spin w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-600 dark:text-blue-400 text-lg">Encrypting…</span>
              </motion.div>
            )}
            {mutation.isError && (
              <motion.p
                className="text-center text-red-600 dark:text-red-400 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {(mutation.error as Error)?.message || "Something went wrong."}
              </motion.p>
            )}
          </AnimatedCard>
        </motion.div>
      </div>
    </Layout>
  )
}
