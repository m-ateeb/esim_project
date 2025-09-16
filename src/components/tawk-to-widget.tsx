"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}

interface TawkToWidgetProps {
  propertyId: string
  widgetId: string
  userEmail?: string
  userName?: string
}

export function TawkToWidget({ 
  propertyId, 
  widgetId, 
  userEmail, 
  userName 
}: TawkToWidgetProps) {
  useEffect(() => {
    // Load Tawk.to script
    const script = document.createElement("script")
    script.async = true
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
    script.charset = "UTF-8"
    script.setAttribute("crossorigin", "*")

    const head = document.head || document.getElementsByTagName("head")[0]
    head.appendChild(script)

    // Initialize Tawk.to API
    script.onload = () => {
      if (window.Tawk_API) {
        if (userEmail || userName) {
          window.Tawk_API.visitor = {
            email: userEmail,
            name: userName,
          }
        }
        // Hide widget by default (we’ll toggle with our custom button)
        window.Tawk_API.hideWidget()
      }
    }

    return () => {
      if (head.contains(script)) {
        head.removeChild(script)
      }
    }
  }, [propertyId, widgetId, userEmail, userName])

  return null
}

// Hook to control Tawk.to widget
export function useTawkTo() {
  const showWidget = () => window.Tawk_API?.showWidget()
  const hideWidget = () => window.Tawk_API?.hideWidget()
  const toggleWidget = () => window.Tawk_API?.toggle()
  const maximizeWidget = () => window.Tawk_API?.maximize()
  const minimizeWidget = () => window.Tawk_API?.minimize()
  const toggleVisibility = () => window.Tawk_API?.toggleVisibility()

  return {
    showWidget,
    hideWidget,
    toggleWidget,
    maximizeWidget,
    minimizeWidget,
    toggleVisibility,
  }
}
