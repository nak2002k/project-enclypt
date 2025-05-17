// src/routes/Dashboard.tsx
import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import Skeleton from "react-loading-skeleton"
import { toast } from "sonner"
import { Layout } from "@/components/Layout"
import { DashboardTable } from "@/components/DashboardTable"
import { getDashboard, getLicenseKey } from "@/utils/api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const [showKey, setShowKey] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const {
    data: dashData,
    isLoading: dashLoading,
    isError: dashError,
    error: dashErrorObj,
  } = useQuery(["dashboard"], getDashboard, {
    onError: (err: any) =>
      toast.error(`Failed to load dashboard: ${err.message}`),
  })

  const {
    data: keyData,
    isLoading: keyLoading,
    isError: keyError,
  } = useQuery(["licenseKey"], getLicenseKey, {
    enabled: showKey,
    onError: (err: any) =>
      toast.error(`Failed to fetch key: ${err.message}`),
  })

  useEffect(() => {
    if (dashData) toast.success("Dashboard loaded")
  }, [dashData])

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <motion.h2
          className="text-3xl font-semibold text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📁 Your Dashboard
        </motion.h2>

        {/* Loading Skeleton */}
        {dashLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                height={60}
                borderRadius={8}
                baseColor={isDark ? "#2d2d2d" : "#e2e8f0"}
                highlightColor={isDark ? "#4a4a4a" : "#f8fafc"}
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {dashError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-600 dark:text-red-400"
          >
            {(dashErrorObj as Error)?.message || "Failed to load dashboard."}
          </motion.div>
        )}

        {/* Main Content */}
        {!dashLoading && !dashError && dashData && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="space-y-8"
          >
            {/* Account Info */}
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <Card className="shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Account Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-800 dark:text-gray-100">
                    <strong>Email:</strong> {dashData.email}
                  </p>
                  <p className="text-gray-800 dark:text-gray-100">
                    <strong>Tier:</strong>{" "}
                    <span className="capitalize">{dashData.tier}</span>
                  </p>
                  <div className="flex items-center">
                    <strong className="text-gray-800 dark:text-gray-100">
                      License Key:
                    </strong>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowKey((v) => !v)}
                      className="ml-2 text-gray-700 dark:text-gray-300"
                      aria-label={showKey ? "Hide key" : "Show key"}
                    >
                      {showKey ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "👁️"
                      )}
                    </Button>
                  </div>
                  {showKey && (
                    <p className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono break-all text-sm text-gray-800 dark:text-gray-100">
                      {keyLoading
                        ? "Fetching key…"
                        : keyError
                        ? "Failed to load key"
                        : keyData?.license_key}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Offline Decryptor for Paid */}
            {dashData.tier === "paid" && (
              <motion.div
                variants={{
                  hidden: { scale: 0.95, opacity: 0 },
                  visible: { scale: 1, opacity: 1 },
                }}
                className="text-center"
              >
                <Button
                  as="a"
                  href="/offline-unlocker/EnclyptUnlocker.exe"
                  target="_blank"
                  className="shadow-lg text-gray-900 dark:text-gray-100"
                >
                  Download Offline Unlocker
                </Button>
              </motion.div>
            )}

            {/* Files Table */}
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <Card className="shadow-lg bg-white dark:bg-gray-800 overflow-x-auto">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Your Files
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <DashboardTable
                    files={dashData.files}
                    onShowKey={() => setShowKey(true)}
                  />
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Showing {dashData.files.length} items
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
