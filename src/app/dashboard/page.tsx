"use client"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Globe, Wifi, Download, MapPin, Plus, Activity, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { RealTimeOrderStatus } from "../../components/real-time-status"
import { useAuth } from "../../../lib/hooks/useAuth"
import { DashboardLayout } from "../../components/dashboard-layout"
import PriceDisplay from '../../components/PriceDisplay'

interface UserPlan {
  id: string;
  status: string;
  activationDate: Date;
  expiryDate: Date;
  dataUsed: string;
  dataRemaining: string | null;
  isActive: boolean;
  plan: {
    id: string;
    planName: string | null;
    locationName: string | null;
    gbs: number | null;
    days: number | null;
    price: number;
  };
}

interface DashboardStats {
  activePlans: number;
  dataUsed: string;
  countriesVisited: number;
  totalSpent: number;
}

export default function DashboardPage() {
  const { session } = useAuth()
  const [userPlans, setUserPlans] = useState<UserPlan[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activePlans: 0,
    dataUsed: '0MB',
    countriesVisited: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/dashboard/user-plans')
      const data = await response.json()
      
      if (data.success) {
        setUserPlans(data.data.userPlans)
        setStats(data.data.stats)
      } else {
        setError(data.error || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      setError('Failed to fetch dashboard data')
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" description="Welcome to your eSIM dashboard">
        <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard" description="Welcome to your eSIM dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Button onClick={fetchDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { user } = session

  return (
    <DashboardLayout 
      title={`Welcome back, ${user.name?.split(" ")[0] || "User"}!`}
      description="Manage your eSIM plans and stay connected worldwide"
    >
            {/* Welcome Section */}
            <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
                  {user.referralCode && (
              <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium">Your Referral Code: <span className="font-mono text-primary">{user.referralCode}</span></p>
                      <p className="text-xs text-muted-foreground">Share this code with friends to earn rewards!</p>
                    </div>
                  )}
                </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={refreshData} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
                <Button asChild>
                  <Link href="/plans">
                    <Plus className="mr-2 h-4 w-4" />
                    Buy New Plan
                  </Link>
                </Button>
          </div>
              </div>
            </div>

            <RealTimeOrderStatus orderId="ESM-2024-001" />

            {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activePlans}</div>
                  <p className="text-xs text-muted-foreground">
                    {userPlans.filter(p => new Date(p.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length} expiring this month
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Used</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.dataUsed}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

        <Card className="shadow-lg border-0 col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Countries Visited</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.countriesVisited}</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Plans */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Active eSIM Plans</CardTitle>
                <CardDescription>Your currently active and upcoming plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {userPlans.length > 0 ? (
                    userPlans.map((userPlan) => {
                      const isExpiringSoon = new Date(userPlan.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      const isUpcoming = new Date(userPlan.activationDate) > new Date()
                      const isActive = userPlan.isActive && !isUpcoming
                      
                      // Calculate data usage percentage
                      const dataUsedMB = parseFloat(userPlan.dataUsed.replace('MB', '').replace('GB', '')) * (userPlan.dataUsed.includes('GB') ? 1024 : 1)
                      const totalDataMB = (userPlan.plan.gbs || 0) * 1024
                      const usagePercentage = totalDataMB > 0 ? (dataUsedMB / totalDataMB) * 100 : 0
                      
                      return (
                  <div key={userPlan.id} className={`flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-4 ${isUpcoming ? 'opacity-60' : ''}`}>
                          <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${isUpcoming ? 'bg-muted' : 'bg-primary/10'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <MapPin className={`w-6 h-6 ${isUpcoming ? 'text-muted-foreground' : 'text-primary'}`} />
                            </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="font-semibold truncate">{userPlan.plan.planName || 'eSIM Plan'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {userPlan.plan.gbs ? `${userPlan.plan.gbs}GB` : 'N/A'} • {userPlan.plan.locationName || 'Global'} • 
                                {isUpcoming ? ` Starts ${new Date(userPlan.activationDate).toLocaleDateString()}` : 
                                 ` Expires in ${Math.ceil((new Date(userPlan.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
                              </p>
                              {!isUpcoming && (
                                <div className="flex items-center space-x-2">
                            <Progress value={usagePercentage} className="w-24 lg:w-32 h-2" />
                                  <span className="text-xs text-muted-foreground">{userPlan.dataUsed} used</span>
                                </div>
                              )}
                            </div>
                          </div>
                    <div className="flex-shrink-0">
                          <Badge variant={
                            isUpcoming ? "outline" : 
                            isExpiringSoon ? "destructive" : 
                            isActive ? "secondary" : "outline"
                          }>
                            {isUpcoming ? "Upcoming" : 
                             isExpiringSoon ? "Expiring Soon" : 
                             isActive ? "Active" : "Inactive"}
                          </Badge>
                    </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No active plans</h3>
                      <p className="text-muted-foreground mb-4">You don't have any active eSIM plans yet.</p>
                      <Button asChild>
                        <Link href="/plans">Browse Plans</Link>
                      </Button>
                    </div>
                  )}
                </div>

                {userPlans.length > 0 && (
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/dashboard/plans">View All Plans</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Your latest eSIM usage and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Download className="w-4 h-4 text-green-600" />
                    </div>
              <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Data usage in France</p>
                      <p className="text-xs text-muted-foreground">2 hours ago • 150MB</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Wifi className="w-4 h-4 text-blue-600" />
                    </div>
              <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">eSIM activated</p>
                      <p className="text-xs text-muted-foreground">1 day ago • Europe Multi-Country</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-4 h-4 text-purple-600" />
                    </div>
              <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Payment processed</p>
                      <p className="text-xs text-muted-foreground">3 days ago • <PriceDisplay priceUSD={29} /></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
    </DashboardLayout>
  )
}
