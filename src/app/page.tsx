import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Globe, Wifi, Shield, Clock, Star, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AuthHeader } from "../components/auth-header"
import { prisma } from "../../lib/prisma"
import PriceDisplay from '../components/PriceDisplay'
import { NewsletterSignup } from "../components/newsletter-signup"

async function getPopularPlans() {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        status: 'ACTIVE',
        isPopular: true,
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
    return plans;
  } catch (error) {
    console.error('Error fetching popular plans:', error);
    return [];
  }
}

export default async function HomePage() {
  const popularPlans = await getPopularPlans();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Wifi className="w-4 h-4 mr-2" />
                  Global Connectivity
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                  Stay Connected
                  <span className="text-primary block">Anywhere</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                  Get instant mobile data in 200+ countries with our premium eSIM plans. No roaming fees, no physical
                  SIM cards, just seamless connectivity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/plans">Browse Plans</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="/setup">How It Works</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-accent border-2 border-white"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">50k+ travelers trust us</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/modern-smartphone-with-world-map-and-connectivity-.png"
                  alt="Global connectivity illustration"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl -rotate-6 scale-105"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Why Choose eSIM Global?</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Experience the future of mobile connectivity with our cutting-edge eSIM technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Instant Activation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get connected in seconds. No waiting for physical SIM delivery or store visits.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Global Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stay connected in 200+ countries with our extensive network partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enterprise-grade security with 99.9% uptime guarantee for peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">High-Speed Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enjoy 4G/5G speeds with unlimited data options for seamless browsing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Plans Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Popular eSIM Plans</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Choose from our most popular destinations and stay connected wherever you go
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularPlans.length > 0 ? (
              popularPlans.map((plan, index) => (
                <Card key={plan.id} className="relative overflow-hidden hover:shadow-xl transition-shadow">
                  {index === 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl">{plan.planName || 'eSIM Plan'}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {plan.locationName ? `Stay connected in ${plan.locationName}` : 'Global connectivity'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data</span>
                        <span className="font-medium">{plan.gbs ? `${plan.gbs}GB` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validity</span>
                        <span className="font-medium">{plan.days ? `${plan.days} days` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{plan.locationName || 'Global'}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold"><PriceDisplay priceUSD={Number(plan.price)} /></span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/plans/${plan.id}`}>
                        Buy Now
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // Fallback static plans if no data
              <>
                <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">Most Popular</Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl">Europe Multi-Country</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Perfect for European adventures across 30+ countries
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data</span>
                        <span className="font-medium">10GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validity</span>
                        <span className="font-medium">30 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Countries</span>
                        <span className="font-medium">30+</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold"><PriceDisplay priceUSD={29} /></span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/plans">Buy Now</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl">Asia Pacific</CardTitle>
                    </div>
                    <CardDescription className="text-base">Explore Asia with high-speed connectivity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data</span>
                        <span className="font-medium">5GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validity</span>
                        <span className="font-medium">15 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Countries</span>
                        <span className="font-medium">15+</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold"><PriceDisplay priceUSD={19} /></span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-transparent" size="lg" variant="outline" asChild>
                      <Link href="/plans">Buy Now</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl">Global Plan</CardTitle>
                    </div>
                    <CardDescription className="text-base">Ultimate connectivity for world travelers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data</span>
                        <span className="font-medium">20GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validity</span>
                        <span className="font-medium">60 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Countries</span>
                        <span className="font-medium">200+</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold"><PriceDisplay priceUSD={79} /></span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-transparent" size="lg" variant="outline" asChild>
                      <Link href="/plans">Buy Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/plans">View All Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <NewsletterSignup
              variant="hero"
              title="Join our newsletter"
              description="Get travel tips, exclusive offers, and eSIM updates delivered to your inbox."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Ready to Stay Connected Worldwide?</h2>
            <p className="text-xl opacity-90 text-pretty">
              Join thousands of travelers who trust eSIM Global for their connectivity needs. Get started in minutes and
              never worry about roaming charges again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">eSIM Global</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your trusted partner for global connectivity. Stay connected anywhere with our premium eSIM solutions.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/plans" className="hover:text-foreground transition-colors">
                    eSIM Plans
                  </Link>
                </li>
                <li>
                  <Link href="/global" className="hover:text-foreground transition-colors">
                    Global Coverage
                  </Link>
                </li>
                <li>
                  <Link href="/business" className="hover:text-foreground transition-colors">
                    Business Solutions
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/setup" className="hover:text-foreground transition-colors">
                    Setup Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 eSIM Global. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
