"use client"

import type React from "react"
import {useState} from "react"
import {useAuth} from "@/lib/auth-context"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Checkbox} from "@/components/ui/checkbox"
import {BarChart3, Mail, Sparkles, User} from "lucide-react"
import {Link} from "react-router-dom";

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [magicLinkSent, setMagicLinkSent] = useState(false)

    const {signUp} = useAuth()
    const [error, setError] = useState("")

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (!acceptTerms) {
            setError("Please accept the Terms and Conditions to continue")
            setIsLoading(false)
            return
        }

        try {
            await signUp(email, name)
            setMagicLinkSent(true)
        } catch (error: any) {
            setError(error.message || "Failed to create account")
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
                            className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-center mb-3">
                                <div className="relative">
                                    <Mail className="w-12 h-12 text-green-600"/>
                                    <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1"/>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Welcome to ProgressWidget!</h3>
                            <p className="text-sm text-gray-600">
                                Click the link in your email to activate your account and start creating beautiful
                                progress widgets.
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
                                setName("")
                                setAcceptTerms(false)
                            }}
                            className="w-full"
                        >
                            Use different details
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

                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>Get started with beautiful progress widgets in seconds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Signup Form */}
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-12 pl-8"
                                icon={<User className="w-4 h-4"/>}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 pl-8"
                                icon={<Mail className="w-4 h-4"/>}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                    className="mt-1"
                                />
                                <div className="text-sm">
                                    <Label htmlFor="terms" className="cursor-pointer">
                                        I agree to the{" "}
                                        <a href="#" className="text-blue-600 hover:underline">
                                            Terms and Conditions
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-blue-600 hover:underline">
                                            Privacy Policy
                                        </a>
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12"
                            disabled={isLoading || !email || !name || !acceptTerms}
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4"/>
                                {isLoading ? "Creating account..." : "Create account"}
                            </div>
                        </Button>
                    </form>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5"/>
                            <div>
                                <h4 className="font-medium text-blue-900 text-sm">Passwordless sign-up</h4>
                                <p className="text-blue-700 text-xs mt-1">
                                    We'll send you a secure magic link to activate your account. No password required!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}