"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Server Error',
          message: 'There is a problem with the server configuration. Please contact support if this problem persists.',
          action: 'Contact Support'
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to sign in. Please contact support if you believe this is an error.',
          action: 'Contact Support'
        }
      case 'Verification':
        return {
          title: 'Verification Error',
          message: 'The verification token has expired or has already been used. Please try signing in again.',
          action: 'Try Again'
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Already Exists',
          message: 'An account with this email already exists. Please sign in with your password or contact support to link your accounts.',
          action: 'Sign In'
        }
      case 'OAuthCallback':
        return {
          title: 'OAuth Error',
          message: 'There was an error during the authentication process. Please try again.',
          action: 'Try Again'
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred during authentication. Please try again.',
          action: 'Try Again'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  const handleAction = () => {
    if (error === 'OAuthAccountNotLinked') {
      router.push('/login')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-red-600">
                {errorInfo.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {errorInfo.message}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleAction}
              className="w-full"
              size="lg"
            >
              {errorInfo.action}
            </Button>
            
            <div className="text-center">
              <Link 
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
