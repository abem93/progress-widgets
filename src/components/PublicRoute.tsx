"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { Navigate } from "react-router-dom"

export function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // If user is already logged in, redirect them away
    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}
