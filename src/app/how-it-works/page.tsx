import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Globe,
  Smartphone,
  CreditCard,
  QrCode,
  Wifi,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  Shield,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">eSIM Global</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/plans" className="text-foreground hover:text-primary transition-colors">
                Plans
              </Link>
              <Link href="/how-it-works" className="text-primary font-medium">
                How It Works
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">How eSIM Works</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Get connected in minutes with our simple 3-step process
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-8 mb-12">
            {/* Step 1 */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">1</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Choose Your Plan</h3>
                      <p className="text-muted-foreground">
                        Browse our global eSIM plans and select the perfect option for your destination and data needs.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">200+ Countries</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm">Instant Activation</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm">Secure & Reliable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Purchase & Receive</h3>
                      <p className="text-muted-foreground">
                        Complete your purchase securely and receive your eSIM profile instantly via email.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span className="text-sm">Secure Payment</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <QrCode className="w-4 h-4 text-primary" />
                        <span className="text-sm">QR Code Included</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm">Instant Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">3</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Install & Connect</h3>
                      <p className="text-muted-foreground">
                        Scan the QR code with your device and start using your eSIM immediately.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Smartphone className="w-4 h-4 text-primary" />
                        <span className="text-sm">Easy Setup</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Wifi className="w-4 h-4 text-primary" />
                        <span className="text-sm">Instant Connection</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-sm">Global Coverage</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Compatibility */}
          <Card className="shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Device Compatibility</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ios" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ios">iOS</TabsTrigger>
                  <TabsTrigger value="android">Android</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>

                <TabsContent value="ios" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Compatible iPhone Models:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        "iPhone 15 series",
                        "iPhone 14 series",
                        "iPhone 13 series",
                        "iPhone 12 series",
                        "iPhone 11 series",
                        "iPhone XS, XS Max, XR",
                        "iPhone SE (2nd & 3rd gen)",
                      ].map((model) => (
                        <div key={model} className="flex items-center space-x-2 p-2 rounded bg-muted/50">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{model}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="android" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Compatible Android Models:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        "Google Pixel 3 and newer",
                        "Samsung Galaxy S20 and newer",
                        "Samsung Galaxy Note 20 and newer",
                        "Samsung Galaxy Z series",
                        "Motorola Razr (2019) and newer",
                        "Oppo Find X3 Pro and newer",
                      ].map((model) => (
                        <div key={model} className="flex items-center space-x-2 p-2 rounded bg-muted/50">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{model}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="other" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Other Compatible Devices:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {["iPad Pro (2018) and newer", "iPad Air (2019) and newer", "iPad mini (2019) and newer"].map(
                        (model) => (
                          <div key={model} className="flex items-center space-x-2 p-2 rounded bg-muted/50">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{model}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>Why Choose eSIM?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "No physical SIM card needed",
                    "Instant activation worldwide",
                    "Multiple plans on one device",
                    "No roaming fees",
                    "Secure and encrypted",
                    "Environmentally friendly",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Global Coverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "200+ countries covered",
                    "Local network partners",
                    "High-speed 4G/5G networks",
                    "24/7 customer support",
                    "Flexible data plans",
                    "No hidden fees",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
              <p className="text-muted-foreground">
                Join thousands of travelers who trust eSIM Global for their connectivity needs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/plans">
                  Browse Plans
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/setup">Setup Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
