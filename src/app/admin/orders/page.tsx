'use client';

import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import {
  Globe,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Bell,
  Settings,
  LogOut,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../../../lib/hooks/useAuth"
import PriceDisplay from '../../../components/PriceDisplay'

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  finalAmount: number;
  createdAt: string;
  paidAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  plan: {
    id: string;
    planName: string | null;
    locationName: string | null;
  };
}

const statusConfig = {
  COMPLETED: { color: "default", icon: CheckCircle, bgColor: "bg-green-50", textColor: "text-green-700" },
  PROCESSING: { color: "secondary", icon: Clock, bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
  PENDING: { color: "outline", icon: Clock, bgColor: "bg-blue-50", textColor: "text-blue-700" },
  FAILED: { color: "destructive", icon: XCircle, bgColor: "bg-red-50", textColor: "text-red-700" },
  CANCELLED: { color: "outline", icon: AlertTriangle, bgColor: "bg-gray-50", textColor: "text-gray-700" },
}

export default function AdminOrdersPage() {
  const { session, logout, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/orders');
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

  const approveRefund = async (refundId: string) => {
    try {
      const res = await fetch(`/api/admin/refunds/${refundId}/approve`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Approve refund failed');
      alert('Refund approved');
      await refreshOrders();
    } catch (e: any) {
      alert(e.message || 'Failed to approve refund');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPlan = planFilter === 'all' || 
      (order.plan.planName && order.plan.planName.toLowerCase().includes(planFilter.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalRevenue = orders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.finalAmount, 0);

  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
  const processingOrders = orders.filter(order => order.status === 'PROCESSING').length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
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
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">eSIM Global Admin</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>{session?.user?.name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarImage src={session?.user?.image || "/placeholder.svg?height=64&width=64"} />
                  <AvatarFallback className="text-lg">{session?.user?.name?.[0] || 'A'}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{session?.user?.name || 'Admin User'}</CardTitle>
                <CardDescription>System Administrator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin/plans">
                    <Package className="mr-2 h-4 w-4" />
                    eSIM Plans
                  </Link>
                </Button>
                <Button variant="default" className="w-full justify-start" asChild>
                  <Link href="/admin/orders">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin/analytics">
                    <PieChart className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <div className="pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={logout}
                    disabled={isLoading}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoading ? "Signing out..." : "Sign Out"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-balance">Orders Management</h1>
                <p className="text-muted-foreground">Track and manage customer orders and payments</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={refreshOrders} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 days
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Order Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <p className="text-xl lg:text-2xl font-bold">{orders.length}</p>
                    </div>
                    <ShoppingCart className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-xl lg:text-2xl font-bold text-green-600">{completedOrders}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Processing</p>
                      <p className="text-xl lg:text-2xl font-bold text-yellow-600">{processingOrders}</p>
                    </div>
                    <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                      <p className="text-xl lg:text-2xl font-bold"><PriceDisplay priceUSD={totalRevenue} /></p>
                    </div>
                    <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search orders, customers, or order IDs..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={planFilter} onValueChange={setPlanFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia Pacific</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="usa">USA & Canada</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' || planFilter !== 'all' 
                        ? 'No orders match your current filters.' 
                        : 'No orders have been placed yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => {
                      const config = statusConfig[order.status as keyof typeof statusConfig]
                      const StatusIcon = config.icon

                      return (
                        <div key={order.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={order.user.image || "/placeholder.svg"} />
                              <AvatarFallback>
                                {order.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-1">
                                <h3 className="font-semibold truncate">{order.user.name}</h3>
                                <Badge variant="outline" className="text-xs w-fit">
                                  {order.orderNumber}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{order.user.email}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-muted-foreground gap-1">
                                <span className="truncate">{order?.plan?.planName || order?.plan?.locationName || 'eSIM Plan'}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                            <div className="text-right space-y-1">
                              <p className="font-bold text-lg"><PriceDisplay priceUSD={Number(order.finalAmount)} /></p>
                              <p className="text-xs text-muted-foreground capitalize">{order.paymentStatus.toLowerCase()}</p>
                            </div>

                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.bgColor}`}>
                              <StatusIcon className={`w-4 h-4 ${config.textColor}`} />
                              <Badge variant={config.color as any} className="capitalize">
                                {order.status.toLowerCase()}
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {
                                const id = prompt('Enter refund request ID to approve');
                                if (id) approveRefund(id);
                              }}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}