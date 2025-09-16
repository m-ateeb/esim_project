import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Globe, XCircle, ArrowLeft, CreditCard, MessageCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function CheckoutFailedPage() {
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
                <Link href="/cart">Back to Cart</Link>
              </Button>
              <Button asChild>
                <Link href="/plans">Browse Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Error Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">Payment Failed</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                We couldn't process your payment. Don't worry, no charges were made to your account.
              </p>
            </div>
          </div>

          {/* Error Details */}
          <Card className="shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle>What Happened?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Your payment was declined by your bank or card issuer. This could be due to insufficient funds,
                  security restrictions, or incorrect card details.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium">Common reasons for payment failure:</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <span>Incorrect card number, expiry date, or CVV</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <span>Insufficient funds in your account</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <span>Card blocked for international transactions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <span>Bank security measures triggered</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <span>Billing address doesn't match card details</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                <Link href="/cart">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/contact">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <CreditCard className="w-4 h-4 mr-2" />
                Try Different Card
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <Card className="shadow-lg border-0 mt-8">
            <CardHeader>
              <CardTitle>Need Immediate Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Live Chat Support</p>
                    <p className="text-sm text-muted-foreground">Available 24/7 for payment assistance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Alternative Payment Methods</p>
                    <p className="text-sm text-muted-foreground">PayPal and Apple Pay coming soon</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Your cart items are saved. You can return anytime to complete your purchase.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
