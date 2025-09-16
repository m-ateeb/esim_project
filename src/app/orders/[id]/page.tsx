import { RealTimeOrderStatus } from "../../../components/real-time-status"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ArrowLeft, Download, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order Tracking</h1>
              <p className="text-muted-foreground">Track your eSIM order in real-time</p>
            </div>
          </div>

          {/* Real-time Order Status */}
          <div className="mb-8">
            <RealTimeOrderStatus orderId={params.id} />
          </div>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you're experiencing any issues with your order or need assistance with eSIM installation, our support
                team is here to help.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link href="/setup">
                    <Download className="h-4 w-4 mr-2" />
                    Installation Guide
                  </Link>
                </Button>
                <Button variant="outline">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
