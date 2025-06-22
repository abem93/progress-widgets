"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function AuthCompletePage() {
  const { completeMagicLinkSignIn } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const email = window.localStorage.getItem("emailForSignIn")
        if (!email) {
          throw new Error("No email found. Please try signing in again.")
        }

        await completeMagicLinkSignIn(email)
        setStatus("success")

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 2000)
      } catch (error: any) {
        setStatus("error")
        setError(error.message || "Failed to complete sign in")
      }
    }

    completeSignIn()
  }, [completeMagicLinkSignIn])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">ProgressWidget</span>
          </div>
          {status === "loading" && (
            <>
              <CardTitle>Completing sign in...</CardTitle>
              <CardDescription>Please wait while we verify your email</CardDescription>
            </>
          )}
          {status === "success" && (
            <>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>You've been successfully signed in</CardDescription>
            </>
          )}
          {status === "error" && (
            <>
              <CardTitle>Sign in failed</CardTitle>
              <CardDescription>There was a problem completing your sign in</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <div className="py-8">
              <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin mb-4" />
              <p className="text-sm text-gray-600">Verifying your email...</p>
            </div>
          )}
          {status === "success" && (
            <div className="py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">Redirecting to your dashboard...</p>
            </div>
          )}
          {status === "error" && (
            <div className="py-8 space-y-4">
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <Link to="/login">
                <Button className="w-full">Try again</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
