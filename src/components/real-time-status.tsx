"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, AlertCircle, Wifi, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"

interface StatusStep {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending" | "failed"
  timestamp?: Date
}

interface OrderStatus {
  orderId: string
  planName: string
  steps: StatusStep[]
  currentStep: number
  estimatedCompletion: Date
}

export function RealTimeOrderStatus({ orderId }: { orderId: string }) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({
    orderId: "ESM-2024-001",
    planName: "Japan 7-Day Unlimited",
    currentStep: 2,
    estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000),
    steps: [
      {
        id: "1",
        title: "Payment Confirmed",
        description: "Your payment has been processed successfully",
        status: "completed",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        id: "2",
        title: "eSIM Provisioning",
        description: "Your eSIM profile is being created and configured",
        status: "in-progress",
      },
      {
        id: "3",
        title: "Quality Check",
        description: "Verifying eSIM profile and network connectivity",
        status: "pending",
      },
      {
        id: "4",
        title: "Ready for Download",
        description: "Your eSIM is ready to be installed on your device",
        status: "pending",
      },
    ],
  })

  const [progress, setProgress] = useState(25)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOrderStatus((prev) => {
        const newStatus = { ...prev }

        // Simulate progress
        if (newStatus.currentStep < newStatus.steps.length - 1) {
          if (Math.random() > 0.7) {
            // 30% chance to progress
            newStatus.currentStep += 1
            newStatus.steps[newStatus.currentStep - 1].status = "completed"
            newStatus.steps[newStatus.currentStep - 1].timestamp = new Date()

            if (newStatus.currentStep < newStatus.steps.length) {
              newStatus.steps[newStatus.currentStep].status = "in-progress"
            }
          }
        }

        return newStatus
      })

      setProgress((prev) => Math.min(prev + 2, (orderStatus.currentStep / orderStatus.steps.length) * 100))
    }, 3000)

    return () => clearInterval(interval)
  }, [orderStatus.currentStep, orderStatus.steps.length])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            In Progress
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order Status</CardTitle>
            <p className="text-sm text-gray-600">Order #{orderStatus.orderId}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{orderStatus.planName}</p>
            <p className="text-sm text-gray-600">Est. completion: {formatTime(orderStatus.estimatedCompletion)}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {orderStatus.steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(step.status)}
                {index < orderStatus.steps.length - 1 && (
                  <div className={`w-px h-8 mt-2 ${step.status === "completed" ? "bg-green-200" : "bg-gray-200"}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{step.title}</h4>
                  {getStatusBadge(step.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                {step.timestamp && (
                  <p className="text-xs text-gray-400 mt-1">Completed at {formatTime(step.timestamp)}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {orderStatus.currentStep === orderStatus.steps.length && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <Download className="h-5 w-5" />
              <span className="font-medium">Your eSIM is ready!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              You can now download and install your eSIM profile on your device.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function NetworkStatusIndicator() {
  const [isConnected, setIsConnected] = useState(true)
  const [signalStrength, setSignalStrength] = useState(4)

  useEffect(() => {
    // Simulate network status changes
    const interval = setInterval(() => {
      setSignalStrength(Math.floor(Math.random() * 5))
      setIsConnected(Math.random() > 0.1) // 90% uptime
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <Wifi className={`h-4 w-4 ${isConnected ? "text-green-500" : "text-red-500"}`} />
      <span className={isConnected ? "text-green-600" : "text-red-600"}>
        {isConnected ? `Connected (${signalStrength}/4 bars)` : "Disconnected"}
      </span>
    </div>
  )
}
