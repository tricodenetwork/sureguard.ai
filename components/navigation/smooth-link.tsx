"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface SmoothLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  loadingText?: string
}

export function SmoothLink({ href, children, className, loadingText }: SmoothLinkProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsNavigating(true)

    // Add a small delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 150))

    router.push(href)
    setIsNavigating(false)
  }

  if (isNavigating) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <LoadingSpinner size="sm" text={loadingText} />
      </div>
    )
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
