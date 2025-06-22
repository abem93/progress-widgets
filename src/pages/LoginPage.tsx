"use client"

import type React from "react"
import {useState} from "react"
import {useAuth} from "@/lib/auth-context"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {BarChart3, Mail, Sparkles} from "lucide-react"
import {Link} from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [magicLinkSent, setMagicLinkSent] = useState(false)
    const [error, setError] = useState("")
    const {sendMagicLink} = useAuth()

    const handleMagicLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await sendMagicLink(email)
            setMagicLinkSent(true)
        } catch (error: any) {
            setError(error.message || "Failed to send magic link")
        } finally {
            setIsLoading(false)
        }
    }

    if (magicLinkSent) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Link to="/" className="flex items-center justify-center gap-2 mb-4 group">
                            <BarChart3 className="w-8 h-8 text-blue-600 group-hover:text-blue-300 transition-colors"/>
                            <span className="text-xl font-bold group-hover:text-blue-300 transition-colors">
    Progress Widget
  </span>
                        </Link>
                        <CardTitle>Check your email</CardTitle>
                        <CardDescription>We've sent a magic link to {email}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div
                            className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-center mb-3">
                                <div className="relative">
                                    <Mail className="w-12 h-12 text-blue-600"/>
                                    <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1"/>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Magic link sent!</h3>
                            <p className="text-sm text-gray-600">
                                Click the link in your email to sign in instantly. The link will expire in 1 hour.
                            </p>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Didn't receive the email? Check your spam folder.</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setMagicLinkSent(false)
                                setEmail("")
                            }}
                            className="w-full"
                        >
                            Use a different email
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link to="/" className="flex items-center justify-center gap-2 mb-4 group">
                        <BarChart3 className="w-8 h-8 text-blue-600 group-hover:text-blue-300 transition-colors"/>
                        <span className="text-xl font-bold group-hover:text-blue-300 transition-colors">
    Progress Widget
  </span>
                    </Link>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Enter your email to receive a magic link for instant sign-in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Magic Link Form */}
                    <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>
                        <Button type="submit" className="w-full h-12" disabled={isLoading || !email}>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4"/>
                                {isLoading ? "Sending magic link..." : "Send magic link"}
                            </div>
                        </Button>
                    </form>

                    {error && <div
                        className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

                    {/* Info Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5"/>
                            <div>
                                <h4 className="font-medium text-blue-900 text-sm">How it works</h4>
                                <p className="text-blue-700 text-xs mt-1">
                                    We'll send you a secure link via email. Click it to sign in instantly - no password
                                    required!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-xs text-gray-500">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                        <div className="mt-2">
                            Don’t have an account?{" "}
                            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
