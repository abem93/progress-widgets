"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  signOut,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  sendMagicLink: (email: string) => Promise<void>
  completeMagicLinkSignIn: (email: string) => Promise<void>
  signUp: (email: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
   return onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

  }, [])

  // Check for magic link sign-in on app load
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn")
      if (email) {
        completeMagicLinkSignIn(email)
      }
    }
  }, [])

  const sendMagicLink = async (email: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/complete`,
      handleCodeInApp: true,
    }

    await sendSignInLinkToEmail(auth, email, actionCodeSettings)

    // Save email to localStorage for completing sign-in
    window.localStorage.setItem("emailForSignIn", email)
  }

  const completeMagicLinkSignIn = async (email: string) => {
    const result = await signInWithEmailLink(auth, email, window.location.href)
    const user = result.user

    // Create or update user profile in Firestore
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: email.split("@")[0],
        email: user.email,
        provider: "email_link",
        createdAt: new Date().toISOString(),
      })
    }

    // Clear email from localStorage
    window.localStorage.removeItem("emailForSignIn")

    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const logout = async () => {
    await signOut(auth)
  }

  const signUp = async (email: string, name: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/complete`,
      handleCodeInApp: true,
    }

    // create a temporary user profile with name
    const tempUserRef = doc(db, "signup_profiles", email)
    await setDoc(tempUserRef, {
      name,
      email,
      createdAt: new Date().toISOString(),
    })

    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    window.localStorage.setItem("emailForSignIn", email)
  }

  const value = {
    user,
    loading,
    sendMagicLink,
    completeMagicLinkSignIn,
    logout,
    signUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
