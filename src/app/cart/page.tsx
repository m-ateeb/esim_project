import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Separator } from "../../components/ui/separator"
import { Globe, Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag } from "lucide-react"
import Link from "next/link"
import PriceDisplay from '../../components/PriceDisplay'

const cartItems = [
  {
    id: 1,
    name: "Europe Multi-Country",
    data: "10GB",
    validity: "30 days",
    countries: 30,
    price: 29,
    originalPrice: 39,
    quantity: 1,
    flag: "🇪🇺",
  },
  {
    id: 2,
    name: "Asia Pacific",
    data: "5GB",
    validity: "15 days",
    countries: 15,
    price: 19,
    originalPrice: 25,
    quantity: 1,
    flag: "🌏",
  },
]

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
  const total = subtotal

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
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">2</Badge>
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Shopping Cart</h1>
            <p className="text-muted-foreground">Review your selected eSIM plans before checkout</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart Items ({cartItems.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="text-3xl">{item.flag}</div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{item.data}</span>
                              <span>•</span>
                              <span>{item.validity}</span>
                              <span>•</span>
                              <span>{item.countries} countries</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium">{item.quantity}</span>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold"><PriceDisplay priceUSD={item.price} /></span>
                              {item.originalPrice > item.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  <PriceDisplay priceUSD={item.originalPrice} />
                                </span>
                              )}
                            </div>
                            {item.originalPrice > item.price && (
                              <Badge variant="destructive" className="text-xs">
                                Save <PriceDisplay priceUSD={item.originalPrice - item.price} />
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>Promo Code</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter promo code" className="flex-1" />
                    <Button variant="outline" className="bg-transparent">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Continue Shopping */}
              <div className="text-center">
                <Button variant="outline" asChild className="bg-transparent">
                  <Link href="/plans">Continue Shopping</Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span><PriceDisplay priceUSD={subtotal} /></span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Savings</span>
                      <span className="text-green-600">-<PriceDisplay priceUSD={savings} /></span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes</span>
                      <span><PriceDisplay priceUSD={0} /></span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span><PriceDisplay priceUSD={total} /></span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout?planId=1">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Secure checkout powered by industry-leading encryption
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium text-sm">What's included:</h4>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Instant eSIM delivery via email</li>
                      <li>• 24/7 customer support</li>
                      <li>• 30-day money-back guarantee</li>
                      <li>• Setup assistance included</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
