// src/components/DashboardTable.tsx
import React from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { cn } from "@/utils/cn"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { IconEye } from "@tabler/icons-react"

export function DashboardTable({
  files,
  onShowKey,
}: {
  files: {
    filename: string
    size: number
    method: string
    timestamp: string
  }[]
  onShowKey: () => void
}) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  if (files.length === 0) {
    return (
      <p className="p-6 text-center text-gray-600 dark:text-gray-400">
        No files encrypted or decrypted yet.
      </p>
    )
  }

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg shadow-lg",
        "bg-white dark:bg-gray-800"
      )}
    >
      <Table>
        <TableHeader>
          <TableRow
            className={cn(
              "bg-gray-100 dark:bg-gray-700",
              "text-gray-700 dark:text-gray-200"
            )}
          >
            <TableHead>Filename</TableHead>
            <TableHead>Size (KB)</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>When</TableHead>
            <TableHead className="text-center">Key</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((f, idx) => (
            <motion.tr
              key={idx}
              className={cn(
                "transition-colors hover:bg-gray-50 dark:hover:bg-gray-700",
                "cursor-default"
              )}
              whileHover={{ scale: 1.002 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <TableCell className="text-gray-800 dark:text-gray-100">
                {f.filename}
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {(f.size / 1024).toFixed(1)}
              </TableCell>
              <TableCell className="capitalize text-gray-800 dark:text-gray-100">
                {f.method}
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {new Date(f.timestamp).toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <AnimatedButton
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onShowKey()
                    toast("License key revealed", { icon: "🔑" })
                  }}
                  aria-label="Show license key"
                  className="text-gray-700 dark:text-gray-300"
                >
                  <IconEye className="w-5 h-5" />
                </AnimatedButton>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
