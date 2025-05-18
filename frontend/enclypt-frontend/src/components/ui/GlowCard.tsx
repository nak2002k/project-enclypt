// src/components/ui/GlowCard.tsx
import React from "react"
import { cn } from "@/utils/cn"

export function GlowCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-[0_0_40px_#6366f180] transition-all hover:shadow-[0_0_60px_#818cf8] p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
