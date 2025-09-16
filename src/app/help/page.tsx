import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { AuthHeader } from "@/src/components/auth-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion"
import {
  Globe,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Search,
  BookOpen,
  Settings,
  Smartphone,
  Wifi,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">Help Center</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Find answers to common questions and get the support you need
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Setup Guide</h3>
                    <p className="text-sm text-muted-foreground">Step-by-step installation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Troubleshooting</h3>
                    <p className="text-sm text-muted-foreground">Common issues & solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact Support</h3>
                    <p className="text-sm text-muted-foreground">Get personalized help</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Sections */}
          <Tabs defaultValue="general" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-esim">
                  <AccordionTrigger>What is an eSIM?</AccordionTrigger>
                  <AccordionContent>
                    An eSIM (embedded SIM) is a digital SIM card that allows you to activate a cellular plan without needing a physical SIM card. It's built into your device and can be programmed with different carrier information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="device-compatibility">
                  <AccordionTrigger>Which devices support eSIM?</AccordionTrigger>
                  <AccordionContent>
                    Most modern smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer, and many other Android devices. Check our compatibility guide for a complete list.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="coverage">
                  <AccordionTrigger>What countries do you cover?</AccordionTrigger>
                  <AccordionContent>
                    We provide coverage in over 200 countries worldwide, including popular travel destinations in Europe, Asia, North America, South America, Africa, and Oceania.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="data-plans">
                  <AccordionTrigger>What data plans do you offer?</AccordionTrigger>
                  <AccordionContent>
                    We offer flexible data plans ranging from 1GB to unlimited data, with validity periods from 1 day to 30 days. Plans are available for single countries, regions, or global coverage.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="setup" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="how-to-install">
                  <AccordionTrigger>How do I install my eSIM?</AccordionTrigger>
                  <AccordionContent>
                    After purchase, you'll receive a QR code via email. Open your device's camera, scan the QR code, and follow the prompts to add the cellular plan. For detailed instructions, see our setup guide.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="qr-code-not-working">
                  <AccordionTrigger>My QR code isn't working</AccordionTrigger>
                  <AccordionContent>
                    Make sure you have good lighting and a steady hand. If the QR code still doesn't scan, you can manually enter the activation details provided in your email.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="activation-time">
                  <AccordionTrigger>How long does activation take?</AccordionTrigger>
                  <AccordionContent>
                    eSIM activation is typically instant. However, it may take a few minutes in some cases. Make sure you're in the coverage area and have data roaming enabled.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="multiple-esims">
                  <AccordionTrigger>Can I have multiple eSIMs?</AccordionTrigger>
                  <AccordionContent>
                    Yes, most devices support multiple eSIM profiles. You can store several eSIMs and switch between them as needed, though only one can be active at a time.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payment-methods">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All payments are processed securely.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="refunds">
                  <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                  <AccordionContent>
                    We offer a 30-day money-back guarantee for unused eSIMs. Once activated, eSIMs are non-refundable. Contact our support team for assistance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="billing-cycles">
                  <AccordionTrigger>How do billing cycles work?</AccordionTrigger>
                  <AccordionContent>
                    eSIM plans are prepaid and valid for the specified duration from activation. There are no recurring charges or hidden fees.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="receipts">
                  <AccordionTrigger>How do I get a receipt?</AccordionTrigger>
                  <AccordionContent>
                    Receipts are automatically sent to your email address after purchase. You can also access your order history in your account dashboard.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="no-connection">
                  <AccordionTrigger>I can't connect to the internet</AccordionTrigger>
                  <AccordionContent>
                    Check that your eSIM is selected for data, enable data roaming, and ensure you're in the coverage area. If issues persist, try restarting your device.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="slow-speed">
                  <AccordionTrigger>My connection is slow</AccordionTrigger>
                  <AccordionContent>
                    Connection speed depends on local network conditions. Try moving to a different location or contact support if the issue persists.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="esim-disappeared">
                  <AccordionTrigger>My eSIM disappeared from my device</AccordionTrigger>
                  <AccordionContent>
                    This can happen after a software update or reset. You can reinstall the eSIM using the original QR code or activation details from your email.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="apn-settings">
                  <AccordionTrigger>Do I need to configure APN settings?</AccordionTrigger>
                  <AccordionContent>
                    Most eSIMs configure automatically. If you're having connection issues, contact support for specific APN settings for your destination.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>

          {/* Contact Support */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Get instant help from our support team</p>
                  <Button size="sm" asChild>
                    <Link href="/contact">Start Chat</Link>
                  </Button>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-muted-foreground">Send us a detailed message</p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="mailto:support@esimglobal.com">Send Email</Link>
                  </Button>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Response Time</h3>
                  <p className="text-sm text-muted-foreground">We typically respond within 2 hours</p>
                  <Badge variant="secondary">24/7 Support</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
