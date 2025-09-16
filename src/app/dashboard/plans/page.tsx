'use client';
import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  Globe,
  Wifi,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Download,
  RefreshCw,
  Settings,
  ArrowRight,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "../../../components/dashboard-layout"
import PriceDisplay from '../../../components/PriceDisplay'

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

export default function DashboardPlansPage() {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPlans();
  }, []);

  const fetchUserPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard/user-plans');
      const data = await response.json();
      
      if (data.success) {
        setUserPlans(data.data.userPlans);
      } else {
        setError(data.error || 'Failed to fetch plans');
      }
    } catch (err) {
      setError('Failed to fetch plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPlans = async () => {
    setRefreshing(true);
    await fetchUserPlans();
    setRefreshing(false);
  };

  const activePlans = userPlans.filter(plan => plan.isActive);
  const expiredPlans = userPlans.filter(plan => new Date(plan.expiryDate) < new Date());
  const upcomingPlans = userPlans.filter(plan => new Date(plan.activationDate) > new Date());

  if (loading) {
  return (
      <DashboardLayout title="My Plans" description="Manage your eSIM plans and data usage" showBackButton>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading plans...</p>
          </div>
            </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="My Plans" description="Manage your eSIM plans and data usage" showBackButton>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Plans</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchUserPlans}>
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
      title="My Plans" 
      description="Manage your eSIM plans and data usage"
      showBackButton
    >
          {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Plans</h1>
              <p className="text-muted-foreground">Manage your eSIM plans and data usage</p>
            </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={refreshPlans} disabled={refreshing}>
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

          {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-xl lg:text-2xl font-bold">{activePlans.length}</p>
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
                <p className="text-sm text-muted-foreground">Total Plans</p>
                <p className="text-xl lg:text-2xl font-bold">{userPlans.length}</p>
                  </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
          <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-xl lg:text-2xl font-bold">{expiredPlans.length}</p>
                  </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
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
                  <PriceDisplay priceUSD={Number(userPlans.reduce((sum, plan) => sum + plan.plan.price, 0))} />
                </p>
                  </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Plans</TabsTrigger>
              <TabsTrigger value="expired">Expired Plans</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
          {activePlans.length === 0 ? (
                <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Plans</h3>
                <p className="text-muted-foreground mb-4">You don't have any active plans at the moment.</p>
                <Button asChild>
                  <Link href="/plans">Browse Plans</Link>
                      </Button>
                  </CardContent>
                </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {activePlans.map((userPlan) => {
                const isExpiringSoon = new Date(userPlan.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                const dataUsedMB = parseFloat(userPlan.dataUsed.replace('MB', '').replace('GB', '')) * (userPlan.dataUsed.includes('GB') ? 1024 : 1);
                const totalDataMB = (userPlan.plan.gbs || 0) * 1024;
                const usagePercentage = totalDataMB > 0 ? (dataUsedMB / totalDataMB) * 100 : 0;
                
                return (
                  <Card key={userPlan.id} className="shadow-lg border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg truncate">{userPlan.plan.planName || 'eSIM Plan'}</CardTitle>
                        <Badge variant={isExpiringSoon ? "destructive" : "secondary"} className={isExpiringSoon ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
                          {isExpiringSoon ? "Expiring Soon" : "Active"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Data Used:</span>
                          <span>{userPlan.dataUsed} / {userPlan.plan.gbs ? `${userPlan.plan.gbs}GB` : 'N/A'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isExpiringSoon ? 'bg-orange-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          ></div>
                        </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{userPlan.plan.locationName || 'Global'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valid Until:</span>
                          <span>{new Date(userPlan.expiryDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                          <span><PriceDisplay priceUSD={userPlan.plan.price} /></span>
                        </div>
                    </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        QR Code
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Renew
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
                    </div>
          )}
            </TabsContent>

            <TabsContent value="expired" className="space-y-6">
          {expiredPlans.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Expired Plans</h3>
                <p className="text-muted-foreground">All your plans are still active or upcoming.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {expiredPlans.map((userPlan) => (
                <Card key={userPlan.id} className="shadow-lg border-0 opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">{userPlan.plan.planName || 'eSIM Plan'}</CardTitle>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        Expired
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Used:</span>
                        <span>{userPlan.dataUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expired:</span>
                        <span>{new Date(userPlan.expiryDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span><PriceDisplay priceUSD={userPlan.plan.price} /></span>
                      </div>
                    </div>

                    <Button size="sm" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Renew Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
              </div>
          )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
          {upcomingPlans.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Upcoming Plans</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any upcoming plans scheduled.
                </p>
                <Button asChild>
                  <Link href="/plans">
                    Browse Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {upcomingPlans.map((userPlan) => (
                <Card key={userPlan.id} className="shadow-lg border-0 opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">{userPlan.plan.planName || 'eSIM Plan'}</CardTitle>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{userPlan.plan.locationName || 'Global'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Starts:</span>
                        <span>{new Date(userPlan.activationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span><PriceDisplay priceUSD={userPlan.plan.price} /></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
          )}
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
      <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link href="/plans">
                  <Plus className="w-6 h-6" />
                  <span>Buy New Plan</span>
              </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Download className="w-6 h-6" />
                  <span>Download All QR Codes</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Settings className="w-6 h-6" />
                  <span>Manage Auto-Renewal</span>
                </Button>
              </div>
            </CardContent>
          </Card>
    </DashboardLayout>
  )
}
