'use client';

import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import {
  Globe,
  ArrowLeft,
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
  TrendingUp,
  TrendingDown,
  Activity,
  Wifi,
  MapPin,
  Download,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../../../lib/hooks/useAuth"
import PriceDisplay from '../../../components/PriceDisplay'

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    activePlans: number;
    userGrowth: number;
    orderGrowth: number;
    revenueGrowth: number;
    planGrowth: number;
  };
  topPlans: Array<{
    id: string;
    planName: string;
    locationName: string;
    orders: number;
    revenue: number;
  }>;
  topCountries: Array<{
    country: string;
    orders: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'order' | 'user' | 'plan';
    description: string;
    timestamp: string;
    amount?: number;
  }>;
  monthlyStats: Array<{
    month: string;
    users: number;
    orders: number;
    revenue: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const { session, logout, isLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
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
                <Button variant="default" className="w-full justify-start" asChild>
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
                <h1 className="text-2xl lg:text-3xl font-bold text-balance">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Track performance metrics and business insights</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={refreshAnalytics} disabled={refreshing}>
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

            {analytics && (
              <>
                {/* Overview Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <Card className="shadow-lg border-0">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                          <p className="text-xl lg:text-2xl font-bold">{analytics.overview.totalUsers.toLocaleString()}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getGrowthIcon(analytics.overview.userGrowth)}
                            <span className={`text-xs ${getGrowthColor(analytics.overview.userGrowth)}`}>
                              {Math.abs(analytics.overview.userGrowth)}%
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
                          <p className="text-xl lg:text-2xl font-bold">{analytics.overview.totalOrders.toLocaleString()}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getGrowthIcon(analytics.overview.orderGrowth)}
                            <span className={`text-xs ${getGrowthColor(analytics.overview.orderGrowth)}`}>
                              {Math.abs(analytics.overview.orderGrowth)}%
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
                          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                          <p className="text-xl lg:text-2xl font-bold"><PriceDisplay priceUSD={analytics.overview.totalRevenue} /></p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getGrowthIcon(analytics.overview.revenueGrowth)}
                            <span className={`text-xs ${getGrowthColor(analytics.overview.revenueGrowth)}`}>
                              {Math.abs(analytics.overview.revenueGrowth)}%
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
                          <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                          <p className="text-xl lg:text-2xl font-bold">{analytics.overview.activePlans.toLocaleString()}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getGrowthIcon(analytics.overview.planGrowth)}
                            <span className={`text-xs ${getGrowthColor(analytics.overview.planGrowth)}`}>
                              {Math.abs(analytics.overview.planGrowth)}%
                            </span>
                          </div>
                        </div>
                        <Wifi className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Plans */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span>Top Performing Plans</span>
                      </CardTitle>
                      <CardDescription>Most popular eSIM plans by orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.topPlans.slice(0, 5).map((plan, index) => (
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

                  {/* Top Countries */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Top Countries</span>
                      </CardTitle>
                      <CardDescription>Countries with most orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.topCountries.slice(0, 5).map((country, index) => (
                          <div key={country.country} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{country.country}</p>
                                <p className="text-sm text-muted-foreground">{country.orders} orders</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium"><PriceDisplay priceUSD={country.revenue} /></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Recent Activity</span>
                    </CardTitle>
                    <CardDescription>Latest system activities and events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.type === 'order' ? 'bg-green-100' :
                              activity.type === 'user' ? 'bg-blue-100' : 'bg-purple-100'
                            }`}>
                              {activity.type === 'order' ? (
                                <ShoppingCart className="w-4 h-4 text-green-600" />
                              ) : activity.type === 'user' ? (
                                <Users className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Package className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{activity.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {activity.amount && (
                            <div className="text-right">
                              <p className="font-medium"><PriceDisplay priceUSD={activity.amount} /></p>
                            </div>
                          )}
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
