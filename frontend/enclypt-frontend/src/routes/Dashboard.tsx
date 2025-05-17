// src/routes/Dashboard.tsx
import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
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

  // show a toast when dashboard first loads successfully
  useEffect(() => {
    if (dashData) toast.success("Dashboard loaded")
  }, [dashData])

  // Responsive container + animations
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <motion.h2
          className="text-3xl font-semibold"
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
                baseColor="#e2e8f0"
                highlightColor="#f8fafc"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {dashError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-600"
          >
            { (dashErrorObj as Error)?.message || "Failed to load dashboard." }
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
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Account Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Email:</strong> {dashData.email}
                  </p>
                  <p>
                    <strong>Tier:</strong>{" "}
                    <span className="capitalize">{dashData.tier}</span>
                  </p>
                  <div className="flex items-center">
                    <strong>License Key:</strong>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowKey((v) => !v)}
                      className="ml-2"
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
                    <p className="mt-2 p-2 bg-gray-50 rounded font-mono break-all text-sm">
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
                variants={{ hidden: { scale: 0.95, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                className="text-center"
              >
                <Button
                  as="a"
                  href="/offline-unlocker/EnclyptUnlocker.exe"
                  target="_blank"
                  className="shadow-lg"
                >
                  Download Offline Unlocker
                </Button>
              </motion.div>
            )}

            {/* Files Table */}
            <motion.div
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            >
              <Card className="shadow-lg overflow-x-auto">
                <CardHeader>
                  <CardTitle>Your Files</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <DashboardTable
                    files={dashData.files}
                    onShowKey={() => setShowKey(true)}
                  />
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500">
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
