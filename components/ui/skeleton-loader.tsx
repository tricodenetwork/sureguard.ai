"use client"

import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
  className?: string
  variant?: "card" | "text" | "avatar" | "button"
  lines?: number
}

export function SkeletonLoader({ className, variant = "card", lines = 3 }: SkeletonLoaderProps) {
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={cn("h-4 bg-gray-200 rounded animate-pulse", i === lines - 1 ? "w-3/4" : "w-full")} />
        ))}
      </div>
    )
  }

  if (variant === "avatar") {
    return <div className={cn("h-10 w-10 bg-gray-200 rounded-full animate-pulse", className)} />
  }

  if (variant === "button") {
    return <div className={cn("h-10 w-24 bg-gray-200 rounded animate-pulse", className)} />
  }

  return (
    <div className={cn("p-4 border rounded-lg space-y-3", className)}>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
      </div>
    </div>
  )
}
