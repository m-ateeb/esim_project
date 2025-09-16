import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import {
  Globe,
  MapPin,
  Wifi,
  Clock,
  Star,
  Shield,
  Smartphone,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react"
import Link from "next/link"
import PriceDisplay from '../../../components/PriceDisplay'

// Mock data for the plan
const plan = {
  id: 1,
  name: "Europe Multi-Country",
  description: "Perfect for European adventures across 30+ countries with high-speed connectivity",
  countries: [
    "France",
    "Germany",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Austria",
    "Switzerland",
    "Portugal",
    "Greece",
    "Poland",
    "Czech Republic",
    "Hungary",
    "Croatia",
    "Denmark",
    "Sweden",
    "Norway",
    "Finland",
    "Ireland",
    "Luxembourg",
    "Slovenia",
    "Slovakia",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Malta",
    "Cyprus",
    "Bulgaria",
    "Romania",
    "Iceland",
  ],
  countryCount: 30,
  data: "10GB",
  validity: "30 days",
  price: 29,
  originalPrice: 39,
  rating: 4.9,
  reviews: 1234,
  popular: true,
  features: [
    "4G/5G High-Speed Data",
    "Instant Activation",
    "24/7 Customer Support",
    "No Roaming Charges",
    "Hotspot Enabled",
    "Multi-device Support",
  ],
  flag: "🇪🇺",
  coverage: "99.5%",
  networkPartners: ["Vodafone", "Orange", "T-Mobile", "Telefonica"],
  compatibility: ["iPhone XS and newer", "Google Pixel 3 and newer", "Samsung Galaxy S20 and newer"],
  activationSteps: [
    "Purchase your eSIM plan",
    "Receive QR code via email",
    "Scan QR code on your device",
    "Activate and start using",
  ],
}

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2 days ago",
    country: "France",
    comment: "Worked perfectly throughout my 2-week European trip. Fast speeds and easy setup!",
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "1 week ago",
    country: "Germany",
    comment: "Great coverage in all the countries I visited. Customer support was very helpful.",
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "2 weeks ago",
    country: "Italy",
    comment: "Good value for money. Had some connectivity issues in rural areas but overall satisfied.",
  },
]

export default function PlanDetailsPage() {
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
              <Link href="/plans" className="text-primary font-medium">
                Plans
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-4 w-4" />
              </Button>
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/plans" className="hover:text-primary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Plans
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Plan Header */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{plan.flag}</div>
                    <div>
                      <h1 className="text-3xl font-bold text-balance">{plan.name}</h1>
                      <p className="text-lg text-muted-foreground text-pretty">{plan.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{plan.rating}</span>
                      <span className="text-muted-foreground">({plan.reviews} reviews)</span>
                    </div>
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      {plan.reviews}+ travelers
                    </Badge>
                    {plan.popular && <Badge className="bg-primary">Most Popular</Badge>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center border-0 shadow-lg">
                  <CardContent className="p-4">
                    <Wifi className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-bold text-lg">{plan.data}</p>
                    <p className="text-xs text-muted-foreground">High-Speed Data</p>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg">
                  <CardContent className="p-4">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-bold text-lg">{plan.validity}</p>
                    <p className="text-xs text-muted-foreground">Validity Period</p>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg">
                  <CardContent className="p-4">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-bold text-lg">{plan.countryCount}+</p>
                    <p className="text-xs text-muted-foreground">Countries</p>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg">
                  <CardContent className="p-4">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-bold text-lg">{plan.coverage}</p>
                    <p className="text-xs text-muted-foreground">Coverage</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="coverage" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="coverage">Coverage</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="coverage" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Country Coverage</CardTitle>
                    <CardDescription>This plan works in the following {plan.countryCount} countries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {plan.countries.map((country) => (
                        <div key={country} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{country}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Network Partners</CardTitle>
                    <CardDescription>Premium network partnerships for reliable connectivity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {plan.networkPartners.map((partner) => (
                        <div key={partner} className="text-center p-4 rounded-lg bg-muted/50">
                          <p className="font-medium">{partner}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Plan Features</CardTitle>
                    <CardDescription>Everything included with your eSIM plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Device Compatibility</CardTitle>
                    <CardDescription>Compatible devices for this eSIM plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {plan.compatibility.map((device) => (
                        <div key={device} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                          <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{device}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="setup" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Easy Setup Process</CardTitle>
                    <CardDescription>Get connected in just 4 simple steps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {plan.activationSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{step}</p>
                            {index === 0 && (
                              <p className="text-sm text-muted-foreground">
                                Complete your purchase and receive instant confirmation
                              </p>
                            )}
                            {index === 1 && (
                              <p className="text-sm text-muted-foreground">
                                QR code delivered to your email within minutes
                              </p>
                            )}
                            {index === 2 && (
                              <p className="text-sm text-muted-foreground">
                                Use your device camera to scan the QR code
                              </p>
                            )}
                            {index === 3 && (
                              <p className="text-sm text-muted-foreground">
                                Your eSIM activates automatically when you arrive
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>What travelers are saying about this plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="space-y-3 pb-6 border-b last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {review.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.name}</p>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">• {review.date}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{review.country}</Badge>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold"><PriceDisplay priceUSD={plan.price} /></span>
                      {plan.originalPrice > plan.price && (
                        <span className="text-lg text-muted-foreground line-through"><PriceDisplay priceUSD={plan.originalPrice} /></span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                  {plan.originalPrice > plan.price && (
                    <Badge variant="destructive">Save <PriceDisplay priceUSD={plan.originalPrice - plan.price} /></Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium">{plan.data}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Validity</span>
                    <span className="font-medium">{plan.validity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Countries</span>
                    <span className="font-medium">{plan.countryCount}+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Activation</span>
                    <span className="font-medium">Instant</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/checkout?planId=${plan.id}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/checkout?planId=${plan.id}`}>
                      Add to Cart
                    </Link>
                  </Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Instant delivery via email</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="shadow-lg border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/help">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Setup Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/contact">
                      <Users className="w-4 h-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
