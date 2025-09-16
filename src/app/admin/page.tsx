'use client';

import { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Progress } from "../../components/ui/progress"
import {
  Globe,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  Shield,
  ArrowLeft,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../../lib/hooks/useAuth"
import { useRouter } from "next/navigation"
import PriceDisplay from '../../components/PriceDisplay'

interface DashboardStats {
  overview: {
    totalRevenue: number;
    totalUsers: number;
    totalOrders: number;
    activePlans: number;
    revenueGrowth: number;
    userGrowth: number;
    orderGrowth: number;
    planGrowth: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    user: { name: string; email: string };
    plan: { planName: string; locationName: string };
    finalAmount: number;
    status: string;
    createdAt: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
    role: string;
  }>;
  topPlans: Array<{
    id: string;
    planName: string;
    locationName: string;
    orders: number;
    revenue: number;
  }>;
}

export default function AdminDashboardPage() {
  const { session, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PROCESSING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
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
                <Button variant="default" className="w-full justify-start" asChild>
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
                <Button variant="ghost" className="w-full justify-start" asChild>
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
                <h1 className="text-2xl lg:text-3xl font-bold text-balance">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's what's happening with your eSIM business.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={refreshData} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
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

            {stats && (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <Card className="shadow-lg border-0">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                          <p className="text-xl lg:text-2xl font-bold"><PriceDisplay priceUSD={stats.overview.totalRevenue} /></p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getTrendIcon(stats.overview.revenueGrowth)}
                            <span className={`text-xs ${getTrendColor(stats.overview.revenueGrowth)}`}>
                              {Math.abs(stats.overview.revenueGrowth)}%
                            </span>
                          </div>
                        </div>
                        <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                          <p className="text-xl lg:text-2xl font-bold">{stats.overview.totalUsers.toLocaleString()}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getTrendIcon(stats.overview.userGrowth)}
                            <span className={`text-xs ${getTrendColor(stats.overview.userGrowth)}`}>
                              {Math.abs(stats.overview.userGrowth)}%
                            </span>
                          </div>
                        </div>
                        <Users className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                          <p className="text-xl lg:text-2xl font-bold">{stats.overview.totalOrders.toLocaleString()}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getTrendIcon(stats.overview.orderGrowth)}
                            <span className={`text-xs ${getTrendColor(stats.overview.orderGrowth)}`}>
                              {Math.abs(stats.overview.orderGrowth)}%
                            </span>
                          </div>
                        </div>
                        <ShoppingCart className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                          <p className="text-xl lg:text-2xl font-bold">{stats.overview.activePlans.toLocaleString()}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getTrendIcon(stats.overview.planGrowth)}
                            <span className={`text-xs ${getTrendColor(stats.overview.planGrowth)}`}>
                              {Math.abs(stats.overview.planGrowth)}%
                            </span>
                          </div>
                        </div>
                        <Package className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        <span>Recent Orders</span>
                      </CardTitle>
                      <CardDescription>Latest customer orders and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.recentOrders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(order.status)}
                              <div>
                                <p className="font-medium">{order.user.name}</p>
                                <p className="text-sm text-muted-foreground">{order.plan?.planName || order.plan?.locationName || 'No plan name'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium"><PriceDisplay priceUSD={Number(order.finalAmount)} /></p>
                              <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Plans */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span>Top Plans</span>
                      </CardTitle>
                      <CardDescription>Most popular eSIM plans by orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.topPlans.slice(0, 5).map((plan, index) => (
                          <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{plan.planName || plan.locationName}</p>
                                <p className="text-sm text-muted-foreground">{plan.orders} orders</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium"><PriceDisplay priceUSD={plan.revenue} /></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Users */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Recent Users</span>
                    </CardTitle>
                    <CardDescription>Latest user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentUsers.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}