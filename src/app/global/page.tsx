import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { AuthHeader } from "@/src/components/auth-header"
import {
  Globe,
  MapPin,
  Wifi,
  Star,
  Users,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle,
  Plane,
  Building,
  Smartphone,
} from "lucide-react"
import Link from "next/link"

export default function GlobalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">Global Coverage</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Stay connected in 200+ countries with our worldwide eSIM network
              </p>
            </div>
          </div>

          {/* Coverage Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">200+</h3>
                <p className="text-muted-foreground">Countries Covered</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">500+</h3>
                <p className="text-muted-foreground">Network Partners</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">1M+</h3>
                <p className="text-muted-foreground">Happy Customers</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">24/7</h3>
                <p className="text-muted-foreground">Customer Support</p>
              </CardContent>
            </Card>
          </div>

          {/* Regional Coverage */}
          <Tabs defaultValue="europe" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="europe">Europe</TabsTrigger>
              <TabsTrigger value="asia">Asia</TabsTrigger>
              <TabsTrigger value="americas">Americas</TabsTrigger>
              <TabsTrigger value="africa">Africa</TabsTrigger>
              <TabsTrigger value="oceania">Oceania</TabsTrigger>
            </TabsList>

            <TabsContent value="europe" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { country: "United Kingdom", cities: ["London", "Manchester", "Edinburgh"], coverage: "99%" },
                  { country: "France", cities: ["Paris", "Lyon", "Marseille"], coverage: "98%" },
                  { country: "Germany", cities: ["Berlin", "Munich", "Hamburg"], coverage: "97%" },
                  { country: "Italy", cities: ["Rome", "Milan", "Florence"], coverage: "96%" },
                  { country: "Spain", cities: ["Madrid", "Barcelona", "Valencia"], coverage: "95%" },
                  { country: "Netherlands", cities: ["Amsterdam", "Rotterdam", "The Hague"], coverage: "99%" },
                ].map((region) => (
                  <Card key={region.country} className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{region.country}</span>
                        <Badge variant="secondary">{region.coverage}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Major Cities:</p>
                        <div className="flex flex-wrap gap-1">
                          {region.cities.map((city) => (
                            <Badge key={city} variant="outline" className="text-xs">
                              {city}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="asia" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { country: "Japan", cities: ["Tokyo", "Osaka", "Kyoto"], coverage: "99%" },
                  { country: "South Korea", cities: ["Seoul", "Busan", "Incheon"], coverage: "98%" },
                  { country: "Singapore", cities: ["Singapore"], coverage: "100%" },
                  { country: "Thailand", cities: ["Bangkok", "Phuket", "Chiang Mai"], coverage: "95%" },
                  { country: "Vietnam", cities: ["Ho Chi Minh City", "Hanoi", "Da Nang"], coverage: "90%" },
                  { country: "Malaysia", cities: ["Kuala Lumpur", "Penang", "Malacca"], coverage: "92%" },
                ].map((region) => (
                  <Card key={region.country} className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{region.country}</span>
                        <Badge variant="secondary">{region.coverage}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Major Cities:</p>
                        <div className="flex flex-wrap gap-1">
                          {region.cities.map((city) => (
                            <Badge key={city} variant="outline" className="text-xs">
                              {city}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="americas" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { country: "United States", cities: ["New York", "Los Angeles", "Chicago"], coverage: "99%" },
                  { country: "Canada", cities: ["Toronto", "Vancouver", "Montreal"], coverage: "98%" },
                  { country: "Mexico", cities: ["Mexico City", "Guadalajara", "Monterrey"], coverage: "95%" },
                  { country: "Brazil", cities: ["São Paulo", "Rio de Janeiro", "Brasília"], coverage: "90%" },
                  { country: "Argentina", cities: ["Buenos Aires", "Córdoba", "Rosario"], coverage: "88%" },
                  { country: "Chile", cities: ["Santiago", "Valparaíso", "Concepción"], coverage: "85%" },
                ].map((region) => (
                  <Card key={region.country} className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{region.country}</span>
                        <Badge variant="secondary">{region.coverage}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Major Cities:</p>
                        <div className="flex flex-wrap gap-1">
                          {region.cities.map((city) => (
                            <Badge key={city} variant="outline" className="text-xs">
                              {city}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="africa" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { country: "South Africa", cities: ["Johannesburg", "Cape Town", "Durban"], coverage: "85%" },
                  { country: "Egypt", cities: ["Cairo", "Alexandria", "Giza"], coverage: "80%" },
                  { country: "Morocco", cities: ["Casablanca", "Rabat", "Marrakech"], coverage: "75%" },
                  { country: "Kenya", cities: ["Nairobi", "Mombasa", "Kisumu"], coverage: "70%" },
                  { country: "Nigeria", cities: ["Lagos", "Abuja", "Kano"], coverage: "65%" },
                  { country: "Ghana", cities: ["Accra", "Kumasi", "Tamale"], coverage: "60%" },
                ].map((region) => (
                  <Card key={region.country} className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{region.country}</span>
                        <Badge variant="secondary">{region.coverage}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Major Cities:</p>
                        <div className="flex flex-wrap gap-1">
                          {region.cities.map((city) => (
                            <Badge key={city} variant="outline" className="text-xs">
                              {city}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="oceania" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { country: "Australia", cities: ["Sydney", "Melbourne", "Brisbane"], coverage: "95%" },
                  { country: "New Zealand", cities: ["Auckland", "Wellington", "Christchurch"], coverage: "90%" },
                  { country: "Fiji", cities: ["Suva", "Nadi", "Lautoka"], coverage: "70%" },
                  { country: "Papua New Guinea", cities: ["Port Moresby", "Lae", "Mount Hagen"], coverage: "50%" },
                ].map((region) => (
                  <Card key={region.country} className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{region.country}</span>
                        <Badge variant="secondary">{region.coverage}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Major Cities:</p>
                        <div className="flex flex-wrap gap-1">
                          {region.cities.map((city) => (
                            <Badge key={city} variant="outline" className="text-xs">
                              {city}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="h-5 w-5 text-primary" />
                  <span>Travel Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "No roaming fees or hidden charges",
                    "Instant activation upon arrival",
                    "Local network speeds and coverage",
                    "Multiple plans for different trip lengths",
                    "24/7 customer support worldwide",
                    "Secure and encrypted connections",
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
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Network Quality</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Premium network partnerships",
                    "4G/LTE and 5G coverage where available",
                    "High-speed data connections",
                    "Reliable network infrastructure",
                    "Automatic network switching",
                    "Quality of service guarantees",
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
              <h2 className="text-2xl font-bold">Ready to Go Global?</h2>
              <p className="text-muted-foreground">
                Join millions of travelers who trust eSIM Global for their international connectivity needs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/plans">
                  Browse Global Plans
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
