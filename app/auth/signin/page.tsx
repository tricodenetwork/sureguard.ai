"use client"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to SureGuard</h1>
        <button
          className="w-full mb-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Sign in with Google
        </button>
        <button
          className="w-full mb-4 py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900"
          onClick={() => signIn("github", { callbackUrl })}
        >
          Sign in with GitHub
        </button>
        <button
          className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          onClick={() => signIn(undefined, { callbackUrl })}
        >
          Sign in with Credentials
        </button>
      </div>
    </div>
  )
}