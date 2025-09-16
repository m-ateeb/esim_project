"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NewsletterSignupProps {
  title?: string
  description?: string
  variant?: "default" | "compact" | "hero"
  className?: string
}

export function NewsletterSignup({ 
  title = "Stay Connected",
  description = "Get the latest travel tips, exclusive offers, and eSIM updates delivered to your inbox.",
  variant = "default",
  className = ""
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToMarketing, setAgreedToMarketing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    if (!agreedToMarketing) {
      toast.error("Please agree to receive marketing emails")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          tags: ["website-signup"],
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        setEmail("")
        setFirstName("")
        setLastName("")
        setAgreedToMarketing(false)
      } else {
        // Handle specific error cases
        if (response.status === 503) {
          toast.error("Newsletter service is temporarily unavailable. Please try again later.")
        } else {
          toast.error(data.message || "Failed to subscribe. Please try again.")
        }
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "compact") {
    return (
      <div className={`bg-muted/50 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-4">
          <Mail className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      </div>
    )
  }

  if (variant === "hero") {
    return (
      <div className={`bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-8 ${className}`}>
        <div className="text-center space-y-4">
          <Mail className="h-12 w-12 mx-auto" />
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-primary-foreground/90 max-w-md mx-auto">{description}</p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              required
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                checked={agreedToMarketing}
                onCheckedChange={(checked) => setAgreedToMarketing(checked as boolean)}
                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-primary"
              />
              <Label htmlFor="marketing" className="text-sm text-white/90">
                I agree to receive marketing emails
              </Label>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-primary hover:bg-white/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Subscribe Now
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <Card className={`shadow-lg border-0 ${className}`}>
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketing"
              checked={agreedToMarketing}
              onCheckedChange={(checked) => setAgreedToMarketing(checked as boolean)}
            />
            <Label htmlFor="marketing" className="text-sm text-muted-foreground">
              I agree to receive marketing emails with travel tips, exclusive offers, and product updates
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Subscribe to Newsletter
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}