// src/components/ui/AnimatedCard.tsx
import React from "react"
import { motion } from "framer-motion"
import { Card } from "./card"

type AnimatedCardProps = React.ComponentProps<typeof Card>

/**
 * Wraps the shadcn <Card> with a quick fade & scale animation.
 */
export function AnimatedCard(props: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{ display: "block" }}
    >
      <Card {...props} />
    </motion.div>
  )
}
