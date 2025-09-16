import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { AuthHeader } from "@/src/components/auth-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import {
  Globe,
  Smartphone,
  QrCode,
  Settings,
  Wifi,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  ArrowRight,
  Camera,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">eSIM Setup Guide</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Get connected in minutes with our step-by-step installation guide
              </p>
            </div>
          </div>

          {/* Device Compatibility Check */}
          <Card className="shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Check Device Compatibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Make sure your device supports eSIM before proceeding with the setup.
                </AlertDescription>
              </Alert>

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

          {/* Setup Instructions */}
          <Tabs defaultValue="qr-code" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr-code">QR Code Setup</TabsTrigger>
              <TabsTrigger value="manual">Manual Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="qr-code" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>QR Code Installation (Recommended)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Open Camera App</h4>
                        <p className="text-sm text-muted-foreground">
                          Open your device's camera app and point it at the QR code you received via email.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Camera className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Make sure your camera can scan QR codes</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Tap the Notification</h4>
                        <p className="text-sm text-muted-foreground">
                          When the QR code is detected, tap the notification that appears to add the eSIM.
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          "Cellular Plan Detected"
                        </Badge>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Add Cellular Plan</h4>
                        <p className="text-sm text-muted-foreground">
                          Follow the on-screen prompts to add the cellular plan to your device.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Plus className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Tap "Add Cellular Plan"</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Label Your Plan</h4>
                        <p className="text-sm text-muted-foreground">
                          Give your eSIM a recognizable name like "Europe Travel" or "Business Trip".
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Optional but recommended
                        </Badge>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        ✓
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Ready to Use</h4>
                        <p className="text-sm text-muted-foreground">
                          Your eSIM is now installed and will activate automatically when you reach your destination.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Wifi className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600">Installation complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Manual Installation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Manual setup requires the SM-DP+ address and activation code from your email.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    {/* iOS Manual Steps */}
                    <div className="space-y-4">
                      <h4 className="font-medium">For iOS Devices:</h4>
                      <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">1. Go to Settings → Cellular</p>
                          <p className="text-xs text-muted-foreground">Open Settings app and tap on Cellular</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">2. Tap "Add Cellular Plan"</p>
                          <p className="text-xs text-muted-foreground">Select the option to add a new plan</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">3. Choose "Enter Details Manually"</p>
                          <p className="text-xs text-muted-foreground">Skip QR code scanning</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">4. Enter SM-DP+ Address and Activation Code</p>
                          <p className="text-xs text-muted-foreground">Copy from your email confirmation</p>
                        </div>
                      </div>
                    </div>

                    {/* Android Manual Steps */}
                    <div className="space-y-4">
                      <h4 className="font-medium">For Android Devices:</h4>
                      <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">1. Go to Settings → Network & Internet</p>
                          <p className="text-xs text-muted-foreground">Access network settings</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">2. Tap "Mobile Network" → "Add Carrier"</p>
                          <p className="text-xs text-muted-foreground">Add new mobile network</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">3. Select "Don't have a SIM card?"</p>
                          <p className="text-xs text-muted-foreground">Choose eSIM option</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">4. Enter activation details manually</p>
                          <p className="text-xs text-muted-foreground">Input SM-DP+ address and code</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Troubleshooting */}
          <Card className="shadow-lg border-0 mt-8">
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">QR Code Not Scanning?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-4">
                    <li>• Ensure good lighting and steady hands</li>
                    <li>• Try manual installation instead</li>
                    <li>• Check if your camera app supports QR codes</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">eSIM Not Activating?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-4">
                    <li>• Make sure you're in the coverage area</li>
                    <li>• Check if data roaming is enabled</li>
                    <li>• Restart your device and try again</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">No Internet Connection?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-4">
                    <li>• Verify the eSIM is selected for data</li>
                    <li>• Check APN settings if required</li>
                    <li>• Contact support for assistance</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1" asChild>
                    <Link href="/contact">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href="/plans">
                      Browse Plans
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
