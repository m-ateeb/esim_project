import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { AuthHeader } from "@/src/components/auth-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Globe,
  Building,
  Users,
  Shield,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Headphones,
  Zap,
  Lock,
  Smartphone,
  Wifi,
} from "lucide-react"
import Link from "next/link"

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">Business Solutions</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Enterprise-grade eSIM solutions for teams and organizations worldwide
              </p>
            </div>
          </div>

          {/* Business Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">10,000+</h3>
                <p className="text-muted-foreground">Businesses Served</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">500K+</h3>
                <p className="text-muted-foreground">Team Members</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">200+</h3>
                <p className="text-muted-foreground">Countries Covered</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">99.9%</h3>
                <p className="text-muted-foreground">Uptime SLA</p>
              </CardContent>
            </Card>
          </div>

          {/* Business Solutions */}
          <Tabs defaultValue="teams" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              <TabsTrigger value="startups">Startups</TabsTrigger>
            </TabsList>

            <TabsContent value="teams" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Team Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        "Centralized account management",
                        "Bulk eSIM provisioning",
                        "Usage monitoring and analytics",
                        "Team member permissions",
                        "Automated billing and invoicing",
                        "24/7 dedicated support",
                      ].map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>Analytics & Reporting</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        "Real-time usage tracking",
                        "Cost optimization insights",
                        "Travel pattern analysis",
                        "Custom reporting dashboards",
                        "Data export capabilities",
                        "ROI measurement tools",
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
            </TabsContent>

            <TabsContent value="enterprise" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Enterprise Security</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        "Advanced security protocols",
                        "Compliance certifications (SOC 2, ISO 27001)",
                        "Data encryption at rest and in transit",
                        "Multi-factor authentication",
                        "Audit trails and logging",
                        "Custom security policies",
                      ].map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-primary" />
                      <span>Integration & APIs</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        "RESTful APIs for automation",
                        "SSO integration (SAML, OAuth)",
                        "HR system integration",
                        "Expense management tools",
                        "Custom webhook support",
                        "White-label solutions",
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
            </TabsContent>

            <TabsContent value="startups" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span>Startup Benefits</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        "Flexible scaling options",
                        "Pay-as-you-grow pricing",
                        "Quick setup and onboarding",
                        "Dedicated startup support",
                        "Free consultation sessions",
                        "Special startup discounts",
                      ].map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span>Cost Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        "Volume-based pricing",
                        "No setup or hidden fees",
                        "Predictable monthly costs",
                        "Unused data rollover",
                        "Team sharing features",
                        "Budget control tools",
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
            </TabsContent>
          </Tabs>

          {/* Use Cases */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Sales Teams</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Keep your sales team connected globally with reliable data coverage for client meetings, 
                  demos, and travel.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">International travel support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Real-time communication</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Expense tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Remote Teams</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Enable seamless connectivity for distributed teams working from different locations 
                  around the world.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Global coverage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Team collaboration tools</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Centralized management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  <span>IoT & Devices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect IoT devices, tablets, and other mobile equipment with reliable global 
                  data connectivity.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Device management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Automated provisioning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Usage monitoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans */}
          <Card className="shadow-lg border-0 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Business Pricing Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-center">Starter</CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold">$9</span>
                      <span className="text-muted-foreground">/user/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Up to 50 users</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Basic analytics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Email support</span>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/contact">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="text-center">Professional</CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold">$19</span>
                      <span className="text-muted-foreground">/user/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Up to 500 users</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Advanced analytics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Priority support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">API access</span>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/contact">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-center">Enterprise</CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold">Custom</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Unlimited users</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Custom integrations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Dedicated support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">SLA guarantees</span>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Ready to Transform Your Business?</h2>
              <p className="text-muted-foreground">
                Join thousands of businesses that trust eSIM Global for their connectivity needs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/contact">
                  Contact Sales
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/help">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
