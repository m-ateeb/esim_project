'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import PriceDisplay from '../../components/PriceDisplay';
import { Globe, MapPin, Wifi, Clock, CreditCard, Shield, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Plan } from "../../types/plan";

interface CheckoutForm {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  promoCode: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const { data: session, status } = useSession();
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    promoCode: ''
  });
  const [processing, setProcessing] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  // Pre-fill form with user data when session is available
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }));
    }
  }, [session]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/plans?planId=${planId}`);
      const data = await response.json();

      if (data.success && data.data.plans.length > 0) {
        setPlan(data.data.plans[0]);
      } else {
        setError('Plan not found');
      }
    } catch (err) {
      setError('Failed to fetch plan');
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'email', 'address', 'city', 'country', 'postalCode'];
    for (const field of required) {
      if (!formData[field as keyof CheckoutForm]) {
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm() || !plan) return;

    try {
      setProcessing(true);
      
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          quantity: 1,
          promoCode: formData.promoCode || undefined,
          billingDetails: {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode,
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to payment page or handle payment
        window.location.href = `/checkout/payment?orderId=${data.data.order.id}`;
      } else {
        setError(data.error || 'Failed to create order');
      }
    } catch (err) {
      setError('Failed to process checkout');
      console.error('Error during checkout:', err);
    } finally {
      setProcessing(false);
    }
  };

  // Show loading while checking authentication or fetching plan
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Please sign in to continue with checkout</p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Plan not found'}</p>
          <Button asChild>
            <Link href="/plans">Back to Plans</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Derive safe display values to handle schema differences/nulls
  const planName = (plan as any).name || plan.planName || 'eSIM Plan';
  const planDescription = (plan as any).description || (plan.locationName ? `Stay connected in ${plan.locationName}` : '');
  const countries: string[] = (plan as any).countries || [];
  const features: string[] = Array.isArray(plan.features) ? plan.features : [];
  const dataAmount = (plan as any).dataAmount || (plan.gbs != null ? `${plan.gbs}GB` : null);
  const duration = (plan as any).duration || (plan.days != null ? plan.days : null);
  const price = plan.price != null ? Number(plan.price) : 0;
  const originalPrice = (plan as any).originalPrice != null ? Number((plan as any).originalPrice) : null;
  const finalPrice = originalPrice && originalPrice > price 
    ? originalPrice - price 
    : 0;

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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/plans">Back to Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-balance mb-2">Complete Your Order</h1>
            <p className="text-muted-foreground">Review your plan and enter billing information</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Plan Details */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{planName}</h3>
                        {planDescription && (
                          <p className="text-sm text-muted-foreground">{planDescription}</p>
                        )}
                      </div>
                      {plan.category && (
                        <Badge variant="secondary">{plan.category.name}</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4 text-muted-foreground" />
                        <span>{dataAmount ?? 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{duration != null ? `${duration} days` : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{countries.length} countries included</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {countries.slice(0, 5).map((country, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                        {countries.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{countries.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {features.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Plan Price:</span>
                      <span><PriceDisplay priceUSD={price} /></span>
                    </div>
                    {originalPrice && originalPrice > price && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-<PriceDisplay priceUSD={finalPrice} /></span>
                      </div>
                    )}
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Code:</span>
                        <span>-<PriceDisplay priceUSD={promoDiscount} /></span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span><PriceDisplay priceUSD={price - promoDiscount} /></span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Secure Checkout</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Instant eSIM delivery</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Enter your details to complete the order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main St"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="United States"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                    <Input
                      id="promoCode"
                      value={formData.promoCode}
                      onChange={(e) => handleInputChange('promoCode', e.target.value)}
                      placeholder="SAVE20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                  <CardDescription>We'll redirect you to our secure payment processor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Powered by Stripe - Secure payment processing</span>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={!validateForm() || processing}
                className="w-full"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By completing your order, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
