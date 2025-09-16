// "use client"

// import { useState, useEffect } from "react"
// import { MessageCircle } from "lucide-react"
// import { Button } from "../components/ui/button"
// import { useTawkTo } from "./tawk-to-widget"

// export function LiveChatWidget() {
//   const [isInitialized, setIsInitialized] = useState(false)
//   const { toggleWidget } = useTawkTo()

//   useEffect(() => {
//     // Check if Tawk.to is loaded
//     const checkTawkTo = () => {
//       if (window.Tawk_API) {

"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { useTawkTo } from "../components/tawk-to-widget"
// ...existing code...
export function LiveChatWidget() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { toggleWidget } = useTawkTo()

  useEffect(() => {
    const checkTawkTo = () => {
      if (window.Tawk_API) {
        setIsInitialized(true)
      } else {
        setTimeout(checkTawkTo, 200)
      }
    }
    checkTawkTo()
  }, [])

  const handleChatClick = () => {
    if (isInitialized) {
// ...existing code...
      toggleWidget()
    }
  }

  return (
    <Button
      onClick={handleChatClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 flex items-center justify-center"
      size="lg"
      disabled={!isInitialized}
    >
      <MessageCircle className="h-6 w-6 text-white" />
      {!isInitialized && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></div>
      )}
    </Button>
  )
}
