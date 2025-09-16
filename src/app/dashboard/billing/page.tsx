'use client';
import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  Globe,
  CreditCard,
  Download,
  Receipt,
  Plus,
  Settings,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "../../../components/dashboard-layout"
import PriceDisplay from '../../../components/PriceDisplay'

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  amount: any;
  createdAt: string;
  paidAt?: string;
  plan: {
    planName: string | null;
  };
}

interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export default function DashboardBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch invoices and payment methods
      const [invoicesResponse, paymentMethodsResponse] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/users/payment-methods')
      ]);
      
      const invoicesData = await invoicesResponse.json();
      const paymentMethodsData = await paymentMethodsResponse.json();
      
      if (invoicesData.success) {
        setInvoices(invoicesData.data.orders.map((order: any) => ({
          id: order.id,
          invoiceNumber: order.orderNumber,
          status: order.paymentStatus === 'COMPLETED' ? 'PAID' : order.paymentStatus === 'PENDING' ? 'PENDING' : 'FAILED',
          amount: Number(order.finalAmount || 0),
          createdAt: order.createdAt,
          paidAt: order.paidAt,
          plan: { planName: order.plan.planName }
        })));
      }
      
      if (paymentMethodsData.success) {
        setPaymentMethods(paymentMethodsData.data.paymentMethods);
      }
    } catch (err) {
      setError('Failed to fetch billing data');
      console.error('Error fetching billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchBillingData();
    setRefreshing(false);
  };

  if (loading) {
  return (
      <DashboardLayout title="Billing & Payments" description="Manage your payment methods and view billing history" showBackButton>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading billing data...</p>
          </div>
            </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Billing & Payments" description="Manage your payment methods and view billing history" showBackButton>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Billing Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchBillingData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
              </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalSpent = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const thisMonthSpent = invoices
    .filter(inv => inv.status === 'PAID' && new Date(inv.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  return (
    <DashboardLayout 
      title="Billing & Payments" 
      description="Manage your payment methods and view billing history"
      showBackButton
    >
          {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Billing & Payments</h1>
              <p className="text-muted-foreground">Manage your payment methods and view billing history</p>
            </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
            <Button asChild>
              <Link href="/plans">
                <Plus className="w-4 h-4 mr-2" />
                Buy New Plan
              </Link>
            </Button>
        </div>
          </div>

          {/* Billing Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl lg:text-2xl font-bold"><PriceDisplay priceUSD={thisMonthSpent} /></p>
                  </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl lg:text-2xl font-bold"><PriceDisplay priceUSD={totalSpent} /></p>
                  </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl lg:text-2xl font-bold">{invoices.length}</p>
                  </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Methods</p>
                <p className="text-xl lg:text-2xl font-bold">{paymentMethods.length}</p>
                  </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Tabs */}
          <Tabs defaultValue="invoices" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Invoices Yet</h3>
                  <p className="text-muted-foreground mb-4">Your invoices will appear here after making purchases.</p>
                  <Button asChild>
                    <Link href="/plans">Browse Plans</Link>
                        </Button>
                      </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          invoice.status === 'PAID' ? 'bg-green-100' : 
                          invoice.status === 'PENDING' ? 'bg-orange-100' : 'bg-red-100'
                        }`}>
                          {invoice.status === 'PAID' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : invoice.status === 'PENDING' ? (
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{invoice.plan.planName || 'eSIM Plan'}</p>
                          <p className="text-sm text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* <p className="font-medium">${invoice.amount.toFixed(2)}</p> */}
                      <div className="text-right">
                          <p className="font-medium"><PriceDisplay priceUSD={Number(invoice.amount ?? 0)} /></p>
                          <p className="font-medium">${Number(invoice.amount || 0).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={
                            invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {invoice.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment-methods" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Payment Methods</CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
              {paymentMethods.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
                  <p className="text-muted-foreground mb-4">Add a payment method to make purchases easier.</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              ) : (
                  <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{method.brand} ending in {method.last4}</p>
                          <p className="text-sm text-muted-foreground">Expires {method.expiryMonth}/{method.expiryYear}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Primary
                        </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                        </div>
              )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Subscriptions</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active subscriptions. All plans are one-time purchases.
                </p>
                <Button asChild>
                  <Link href="/plans">Browse Plans</Link>
                        </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Billing Settings */}
      <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
            </CardHeader>
            <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Auto-Renewal</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable auto-renewal</span>
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically renew your plans before they expire
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Billing Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifications</span>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications about billing and payments
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
    </DashboardLayout>
  )
}
