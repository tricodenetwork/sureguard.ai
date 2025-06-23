"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  return session ? (
    <Button onClick={() => signOut()}>Sign out</Button>
  ) : (
    <Button onClick={() => signIn()}>Sign in</Button>
  )
}