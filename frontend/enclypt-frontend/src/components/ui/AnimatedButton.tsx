// src/components/ui/AnimatedButton.tsx
import React from "react"
import { motion } from "framer-motion"
import { Button } from "./button"

// Pull the props off Button itself
type ButtonProps = React.ComponentProps<typeof Button>

/**
 * Wraps the shadcn <Button> with subtle hover/tap animations.
 */
export function AnimatedButton(props: ButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ display: "inline-block" }}
    >
      <Button {...props} />
    </motion.div>
  )
}
