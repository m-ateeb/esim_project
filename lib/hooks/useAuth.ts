"use client"

import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { isAdmin, isModerator } from "../utils"

export function useAuth() {
    
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok) {
        // Redirect based on role
        if (session?.user?.role && isAdmin(session.user.role)) {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, referredBy?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, referredBy }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Auto-login after successful registration
      await login(email, password)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false })
      router.push("/")
      router.refresh()
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Role-based helper functions
  const isUserAdmin = () => session?.user?.role && isAdmin(session.user.role)
  const isUserModerator = () => session?.user?.role && isModerator(session.user.role)
  const isUserRegular = () => session?.user?.role === "USER"
  const hasRole = (role: string) => session?.user?.role === role

  return {
    session,
    status,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated: !!session,
    // Role-based helpers
    isUserAdmin,
    isUserModerator,
    isUserRegular,
    hasRole,
    // User info
    user: session?.user,
    role: session?.user?.role,
  }
}
