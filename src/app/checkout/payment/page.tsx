'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Globe, CreditCard, Shield, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import PriceDisplay from '../../../components/PriceDisplay';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface Order {
  id: string;
  orderNumber: string;
  finalAmount: any;
  plan: {
    name: string;
    dataAmount: string;
    duration: number;
  };
}

function CheckoutForm({ clientSecret, returnUrl }: { clientSecret: string; returnUrl: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'always'
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      window.location.href = returnUrl;
      return;
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <div className="p-2 text-sm text-red-600 border border-red-200 rounded">{errorMessage}</div>
      )}
      <Button onClick={handleSubmit} disabled={processing || !stripe} className="w-full" size="lg">
        {processing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay now
          </>
        )}
      </Button>
    </div>
  );
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
    if (pk) setStripePromise(loadStripe(pk));
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      fetchClientSecret();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientSecret = async () => {
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const json = await res.json();
      if (json.success) setClientSecret(json.data.clientSecret);
      else setError(json.error || 'Failed to initialize payment');
    } catch (e) {
      setError('Failed to initialize payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading payment...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Payment Error</h3>
          <p className="text-muted-foreground mb-4">{error || 'Order not found'}</p>
          <Button asChild>
            <Link href="/plans">Back to Plans</Link>
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-balance mb-2">Complete Payment</h1>
            <p className="text-muted-foreground">Secure payment for your eSIM plan</p>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Order #{order.orderNumber}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{order.plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.plan.dataAmount} • {order.plan.duration} days
                    </p>
                  </div>
                  <Badge variant="secondary">eSIM Plan</Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span><PriceDisplay priceUSD={Number(order.finalAmount || 0)} /></span>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Method</span>
                </CardTitle>
                <CardDescription>Secure payment powered by Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                {stripePromise && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm clientSecret={clientSecret} returnUrl={`${origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?orderId=${order.id}`} />
                  </Elements>
                ) : (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Initializing payment...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Secure Payment</span>
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
                  <span>No card data stored</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
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
                  Pay <PriceDisplay priceUSD={order.finalAmount} />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By completing payment, you agree to our{' '}
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
  );
}
