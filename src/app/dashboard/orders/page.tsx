'use client';

import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { 
  Package, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "../../../components/dashboard-layout";
import PriceDisplay from '../../../components/PriceDisplay';

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  finalAmount: number;
  createdAt: string;
  paidAt?: string;
  plan: {
    id: string;
    planName: string | null;
    locationName: string | null;
    gbs: number | null;
    days: number | null;
  };
}

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.orders);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Cancel failed');
      await refreshOrders();
      alert('Order cancelled');
    } catch (e: any) {
      alert(e.message || 'Failed to cancel order');
    }
  };

  const requestRefund = async (orderId: string) => {
    const reason = prompt('Please provide a reason for refund request');
    if (!reason) return;
    try {
      const res = await fetch('/api/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Refund request failed');
      alert('Refund request submitted. You will receive an email confirmation.');
    } catch (e: any) {
      alert(e.message || 'Failed to request refund');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'PROCESSING':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case 'FAILED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingOrders = orders.filter(order => order.status === 'PENDING' || order.status === 'PROCESSING');
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED' || order.status === 'FAILED');

  if (loading) {
    return (
      <DashboardLayout title="My Orders" description="View and manage your eSIM orders">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="My Orders" description="View and manage your eSIM orders">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Orders</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchOrders}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="My Orders" 
      description="View and manage your eSIM orders"
      showBackButton
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl lg:text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl lg:text-2xl font-bold">{completedOrders.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl lg:text-2xl font-bold">{pendingOrders.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl lg:text-2xl font-bold">
                  <PriceDisplay priceUSD={Number(orders.reduce((sum, order) => sum + order.finalAmount, 0))} />
                  ${orders.reduce((sum, order) => sum + Number(order.finalAmount || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshOrders}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          {orders.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Button asChild>
                  <Link href="/plans">Browse Plans</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-lg border-0">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {order.plan.planName || 'eSIM Plan'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Order #{order.orderNumber}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{order.plan.locationName || 'Global'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Data</p>
                            <p className="font-medium">{order.plan.gbs ? `${order.plan.gbs}GB` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{order.plan.days ? `${order.plan.days} days` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-medium"><PriceDisplay priceUSD={order.finalAmount} /></p>
                            <p className="font-medium">${Number(order.finalAmount || 0).toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Ordered: {formatDate(order.createdAt)}</p>
                          {order.paidAt && (
                            <p>Paid: {formatDate(order.paidAt)}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        {order.status === 'COMPLETED' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Receipt
                          </Button>
                        )}
                        {order.paymentStatus === 'PENDING' && (
                          <Button size="sm" variant="destructive" onClick={() => cancelOrder(order.id)}>
                            Cancel Order
                          </Button>
                        )}
                        {order.paymentStatus === 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <Button size="sm" variant="outline" onClick={() => requestRefund(order.id)}>
                            Request Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingOrders.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Orders</h3>
                <p className="text-muted-foreground">All your orders are completed or cancelled.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <Card key={order.id} className="shadow-lg border-0">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {order.plan.planName || 'eSIM Plan'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Order #{order.orderNumber}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Ordered: {formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Completed Orders</h3>
                <p className="text-muted-foreground">Your completed orders will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <Card key={order.id} className="shadow-lg border-0">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {order.plan.planName || 'eSIM Plan'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Order #{order.orderNumber}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{order.plan.locationName || 'Global'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Data</p>
                            <p className="font-medium">{order.plan.gbs ? `${order.plan.gbs}GB` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{order.plan.days ? `${order.plan.days} days` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-medium">${order.finalAmount.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Completed: {order.paidAt ? formatDate(order.paidAt) : formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
