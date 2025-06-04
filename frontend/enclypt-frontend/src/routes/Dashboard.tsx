// src/routes/Dashboard.tsx
import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import Skeleton from "react-loading-skeleton"
import { toast } from "sonner"
import { Layout } from "@/components/Layout"
import { DashboardTable } from "@/components/DashboardTable"
import {
  getDashboard,
  getDashboardJson,
  getLicenseKey,
  type DashboardData,
  type DashboardFile,
} from "@/utils/api"
import { useAuth } from "@/context/AuthContext"
import { AnimatedCard } from "@/components/ui/AnimatedCard"
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const { token } = useAuth()
  const [showKey, setShowKey] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // 1) Main dashboard query
  const dashboardQuery = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const jsonQuery = useQuery<{ files: DashboardFile[] }>({
    queryKey: ["dashboard-json"],
    queryFn: () => getDashboardJson(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  // 2) License key query
  const keyQuery = useQuery<{ license_key: string }>({
    queryKey: ["licenseKey"],
    queryFn: () => getLicenseKey(token!),
    enabled: showKey && !!token,
    retry: false,
  })

  // 3) Side-effects: dashboard loaded or error
  useEffect(() => {
    if (dashboardQuery.isError) {
      toast.error(`Failed to load dashboard: ${dashboardQuery.error?.message}`)
    }
  }, [dashboardQuery.isError])

  useEffect(() => {
    if (jsonQuery.isError) {
      toast.error(`Failed to load file list: ${jsonQuery.error?.message}`)
    }
  }, [jsonQuery.isError])

  useEffect(() => {
    if (dashboardQuery.data) {
      toast.success("Dashboard loaded")
    }
  }, [dashboardQuery.data])

  useEffect(() => {
    if (jsonQuery.data) {
      toast.success("File list updated")
    }
  }, [jsonQuery.data])

  // 4) Side-effects: license key errors
  useEffect(() => {
    if (keyQuery.isError) {
      toast.error(`Failed to fetch key: ${keyQuery.error?.message}`)
    }
  }, [keyQuery.isError])

  const dashData = dashboardQuery.data
  const jsonFiles = jsonQuery.data?.files

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
        <AnimatePresence>
          {dashboardQuery.isLoading && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  height={60}
                  borderRadius={8}
                  baseColor={isDark ? "#2d2d2d" : "#e2e8f0"}
                  highlightColor={isDark ? "#4a4a4a" : "#f8fafc"}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {dashboardQuery.isError && (
            <motion.div
              className="text-center text-red-600 dark:text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {dashboardQuery.error?.message || "Failed to load dashboard."}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {dashData && !dashboardQuery.isLoading && !dashboardQuery.isError && (
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
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            >
              <AnimatedCard className="shadow-lg bg-white dark:bg-gray-800">
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
                    <AnimatedButton
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowKey((v) => !v)}
                      className="ml-2 text-gray-700 dark:text-gray-300"
                      aria-label={showKey ? "Hide key" : "Show key"}
                    >
                      {showKey ? <Loader2 className="w-4 h-4 animate-spin" /> : "👁️"}
                    </AnimatedButton>
                  </div>
                  <AnimatePresence>
                    {showKey && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono break-all text-sm text-gray-800 dark:text-gray-100 flex items-center"
                      >
                        <span className="flex-1">
                          {keyQuery.isLoading
                            ? "Fetching key…"
                            : keyQuery.isError
                            ? "Failed to load key"
                            : keyQuery.data!.license_key}
                        </span>
                        {!keyQuery.isLoading && !keyQuery.isError && (
                          <AnimatedButton
                            variant="ghost"
                            size="icon"
                            aria-label="Copy license key"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                keyQuery.data!.license_key
                              )
                            }
                            className="ml-2 text-gray-700 dark:text-gray-300"
                          >
                            📋
                          </AnimatedButton>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            {/* Offline Unlocker for Paid */}
            {dashData.tier === "paid" && (
              <motion.div
                variants={{ hidden: { scale: 0.95, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                className="text-center"
              >
                <AnimatedButton asChild className="shadow-lg">
                  <a
                    href="/offline-unlocker/EnclyptUnlocker.exe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Download Offline Unlocker
                  </a>
                </AnimatedButton>
              </motion.div>
            )}

            {/* Files Table */}
            <motion.div
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            >
              <AnimatedCard className="shadow-lg bg-white dark:bg-gray-800 overflow-x-auto">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Your Files
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <DashboardTable
                    files={jsonFiles ?? dashData.files}
                    onShowKey={() => setShowKey(true)}
                  />
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Showing {(jsonFiles ?? dashData.files).length} items
                </CardFooter>
              </AnimatedCard>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
