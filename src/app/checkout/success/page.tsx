"use client";
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Separator } from "../../../components/ui/separator"
import {
  Globe,
  CheckCircle,
  Download,
  Mail,
  Smartphone,
  ArrowRight,
  Calendar,
  MapPin,
  Wifi,
  Clock,
  Share2,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import PriceDisplay from '../../../components/PriceDisplay'

const orderDetails = {
  orderNumber: "ESM-2024-001234",
  orderDate: "March 15, 2024",
  email: "john@example.com",
  total: 48,
  items: [
    {
      id: 1,
      name: "Europe Multi-Country",
      data: "10GB",
      validity: "30 days",
      countries: 30,
      price: 29,
      flag: "🇪🇺",
      qrCode: "QR_CODE_URL_1",
    },
    {
      id: 2,
      name: "Asia Pacific",
      data: "5GB",
      validity: "15 days",
      countries: 15,
      price: 19,
      flag: "🌏",
      qrCode: "QR_CODE_URL_2",
    },
  ],
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  finalAmount: any
  billingEmail?: string | null
  esimQrCode?: string | null
  plan: {
    planName?: string | null
    locationName?: string | null
    gbs?: any
    days?: number | null
  } | null
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return
      try {
        setLoading(true)
        const res = await fetch(`/api/orders/${orderId}`)
        const json = await res.json()
        if (json.success) setOrder(json.data)
        else setError(json.error || 'Order not found')
      } catch (e) {
        setError('Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
          <p>Finalizing your order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <p className="mb-4">{error || 'Order not found'}</p>
          <Button asChild>
            <Link href="/plans">Browse Plans</Link>
          </Button>
        </div>
      </div>
    )
  }

  const planName = order.plan?.planName || order.plan?.locationName || 'eSIM Plan'
  const dataAmount = order.plan?.gbs ? `${order.plan?.gbs} GB` : '—'
  const validity = order.plan?.days ? `${order.plan?.days} days` : '—'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">eSIM Global</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/plans">Browse Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">Order Confirmed!</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Your eSIM is ready. We sent QR code and setup instructions to {order.billingEmail || 'your email'}.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Order #{order.orderNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Sent to {order.billingEmail || '—'}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* eSIM Plans */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5" />
                    <span>Your eSIM Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-lg">{planName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Wifi className="w-3 h-3" />
                              <span>{dataAmount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{validity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">Ready</Badge>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">QR Code {order.esimQrCode ? 'Ready' : 'Pending'}</p>
                        <p className="text-xs text-muted-foreground">Check your email for setup instructions</p>
                      </div>
                      <div className="flex space-x-2">
                        {order.esimQrCode && (
                          <a href={order.esimQrCode} download={`esim-${order.orderNumber}.png`} className="inline-flex">
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <Download className="w-4 h-4 mr-2" />
                              Download QR
                            </Button>
                          </a>
                        )}
                        <Button size="sm" asChild>
                          <Link href={`/setup`}>Setup Guide</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Check Your Email</p>
                        <p className="text-sm text-muted-foreground">
                          We've sent QR codes and detailed setup instructions to {order.billingEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Install Your eSIM</p>
                        <p className="text-sm text-muted-foreground">
                          Scan the QR code with your device camera or use manual installation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Activate When Ready</p>
                        <p className="text-sm text-muted-foreground">
                          Your eSIM will activate automatically when you arrive at your destination
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" asChild>
                      <Link href="/setup">
                        <Smartphone className="w-4 h-4 mr-2" />
                        View Setup Guide
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Actions */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order Number</span>
                      <span className="font-mono text-xs">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order Date</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Paid</span>
                      <span>${orderDetails.total}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Button className="w-full bg-transparent" variant="outline" /*className="bg-transparent"*/asChild>
                      <Link href="/dashboard">
                        View in Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline" /*className="bg-transparent"*/>
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/setup">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Setup Guide
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/contact">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Continue Shopping */}
              <Card className="shadow-lg border-0 bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-semibold">Planning Another Trip?</h3>
                  <p className="text-sm opacity-90">
                    Explore more destinations and get exclusive deals on additional eSIM plans.
                  </p>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href="/plans">Browse More Plans</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
