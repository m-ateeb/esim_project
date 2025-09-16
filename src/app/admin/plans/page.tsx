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
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  MapPin,
  Wifi,
  Clock,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  PieChart,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import PriceDisplay from '../../../components/PriceDisplay'

interface Plan {
  id: string;
  planName: string | null;
  planCategory: string | null;
  locationName: string | null;
  price: number;
  gbs: number | null;
  days: number | null;
  countryCodes: string | null;
  slug: string | null;
  planId: string | null;
  isPopular: boolean;
  features: string[];
  maxSpeed: string | null;
  status: string;
  stockQuantity: number | null;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  _count?: {
    orders: number;
    userPlans: number;
  };
}

interface PlansResponse {
  success: boolean;
  data: {
    plans: Plan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    stats: {
      totalPlans: number;
      activePlans: number;
      totalSales: number;
      totalRevenue: number;
    };
  };
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    region: 'all'
  });

  useEffect(() => {
    fetchPlans();
  }, [filters]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
     
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value);
      });

      const response = await fetch(`/api/admin/plans?${params.toString()}`);
      const data: PlansResponse = await response.json();

      if (data.success) {
        setPlans(data.data.plans);
        setStats(data.data.stats);
      } else {
        setError('Failed to fetch plans');
      }
    } catch (err) {
      setError('Failed to fetch plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCountryFlag = (country: string) => {
    const flagMap: Record<string, string> = {
      'United States': '🇺🇸',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Australia': '🇦🇺',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'South Africa': '🇿🇦',
      'Egypt': '🇪🇬',
      'UAE': '🇦🇪',
      'Saudi Arabia': '🇸🇦',
      'Turkey': '🇹🇷'
    };
    return flagMap[country] || '🌍';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchPlans}>Try Again</Button>
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
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AD</AvatarFallback>
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
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="text-lg">AD</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">Admin User</CardTitle>
                <CardDescription>System Administrator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="default" className="w-full justify-start" asChild>
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
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-balance">eSIM Plans Management</h1>
                <p className="text-muted-foreground">Create, edit, and manage your eSIM plan offerings</p>
              </div>
              <Button asChild>
                <Link href="/admin/plans/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Plan
                </Link>
              </Button>
            </div>

            {/* Filters and Search */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search plans..." 
                        className="pl-10"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.region} onValueChange={(value) => setFilters({ ...filters, region: value })}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="americas">Americas</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plans Table */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>All Plans ({plans.length})</CardTitle>
                <CardDescription>Manage your eSIM plan inventory and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{getCountryFlag(plan.locationName || '')}</div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{plan.planName || 'eSIM Plan'}</h3>
                            {getStatusBadge(plan.status)}
                            {plan.stockQuantity && plan.stockQuantity < 50 && plan.status === 'ACTIVE' && (
                              <Badge variant="destructive" className="text-xs">
                                Low Stock
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {plan.locationName ? `Stay connected in ${plan.locationName}` : 'Global coverage'}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Wifi className="w-3 h-3" />
                              <span>{plan.gbs ? `${plan.gbs}GB` : 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{plan.days ? `${plan.days} days` : 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{plan.locationName || 'Global'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold"><PriceDisplay priceUSD={Number(plan.price)} /></span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{plan._count?.orders || 0} orders</span>
                            <span>{plan._count?.userPlans || 0} active</span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">Stock: {plan.stockQuantity || 'Unlimited'}</p>
                          <p className="text-xs text-muted-foreground">Updated {new Date(plan.updatedAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/plans/${plan.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/plans/${plan.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                      <p className="text-2xl font-bold">{stats.totalPlans}</p>
                    </div>
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                      <p className="text-2xl font-bold">{stats.activePlans}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                      <p className="text-2xl font-bold">{stats.totalSales}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">
                        <PriceDisplay priceUSD={Number(stats.totalRevenue)} />
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
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