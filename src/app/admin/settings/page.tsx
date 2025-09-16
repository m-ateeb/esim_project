'use client';

import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Switch } from "../../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
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
  Save,
  Shield,
  Mail,
  Database,
  Key,
  Server,
  Wifi,
  CreditCard,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../../../lib/hooks/useAuth"

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    timezone: string;
    currency: string;
    language: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    orderAlerts: boolean;
    userAlerts: boolean;
    systemAlerts: boolean;
  };
  integrations: {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    esimAccessEnabled: boolean;
    mailchimpEnabled: boolean;
    twilioEnabled: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    loginAttempts: number;
    ipWhitelist: string[];
  };
}

export default function AdminSettingsPage() {
  const { session, logout, isLoading } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'eSIM Global',
      siteDescription: 'Global eSIM connectivity solutions',
      supportEmail: 'support@esimglobal.com',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderAlerts: true,
      userAlerts: true,
      systemAlerts: true
    },
    integrations: {
      stripeEnabled: true,
      paypalEnabled: false,
      esimAccessEnabled: true,
      mailchimpEnabled: false,
      twilioEnabled: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 24,
      passwordMinLength: 8,
      loginAttempts: 5,
      ipWhitelist: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showApiKeys, setShowApiKeys] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        setError(data.error || 'Failed to fetch settings');
      }
    } catch (err) {
      setError('Failed to fetch settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
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
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin/analytics">
                    <PieChart className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </Button>
                <Button variant="default" className="w-full justify-start" asChild>
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
                <h1 className="text-2xl lg:text-3xl font-bold text-balance">System Settings</h1>
                <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={fetchSettings} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={saveSettings} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <span>General Settings</span>
                    </CardTitle>
                    <CardDescription>Basic site configuration and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                          id="siteName"
                          value={settings.general.siteName}
                          onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input
                          id="supportEmail"
                          type="email"
                          value={settings.general.supportEmail}
                          onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        value={settings.general.siteDescription}
                        onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={settings.general.timezone} onValueChange={(value) => updateSetting('general', 'timezone', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">Eastern Time</SelectItem>
                            <SelectItem value="PST">Pacific Time</SelectItem>
                            <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={settings.general.currency} onValueChange={(value) => updateSetting('general', 'currency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={settings.general.language} onValueChange={(value) => updateSetting('general', 'language', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <span>Notification Settings</span>
                    </CardTitle>
                    <CardDescription>Configure notification preferences and alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications via email</p>
                        </div>
                        <Switch
                          checked={settings.notifications.emailNotifications}
                          onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                        </div>
                        <Switch
                          checked={settings.notifications.smsNotifications}
                          onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                        </div>
                        <Switch
                          checked={settings.notifications.pushNotifications}
                          onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                        />
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-4">Alert Types</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Order Alerts</Label>
                            <p className="text-sm text-muted-foreground">Notify on new orders and status changes</p>
                          </div>
                          <Switch
                            checked={settings.notifications.orderAlerts}
                            onCheckedChange={(checked) => updateSetting('notifications', 'orderAlerts', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>User Alerts</Label>
                            <p className="text-sm text-muted-foreground">Notify on user registrations and activities</p>
                          </div>
                          <Switch
                            checked={settings.notifications.userAlerts}
                            onCheckedChange={(checked) => updateSetting('notifications', 'userAlerts', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>System Alerts</Label>
                            <p className="text-sm text-muted-foreground">Notify on system errors and maintenance</p>
                          </div>
                          <Switch
                            checked={settings.notifications.systemAlerts}
                            onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integrations Settings */}
              <TabsContent value="integrations" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-primary" />
                      <span>Third-Party Integrations</span>
                    </CardTitle>
                    <CardDescription>Configure external service integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Stripe Payment</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">Enable Stripe payment processing</p>
                        </div>
                        <Switch
                          checked={settings.integrations.stripeEnabled}
                          onCheckedChange={(checked) => updateSetting('integrations', 'stripeEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span>PayPal Payment</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">Enable PayPal payment processing</p>
                        </div>
                        <Switch
                          checked={settings.integrations.paypalEnabled}
                          onCheckedChange={(checked) => updateSetting('integrations', 'paypalEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center space-x-2">
                            <Wifi className="h-4 w-4" />
                            <span>eSIM Access API</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">Enable eSIM Access integration</p>
                        </div>
                        <Switch
                          checked={settings.integrations.esimAccessEnabled}
                          onCheckedChange={(checked) => updateSetting('integrations', 'esimAccessEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Mailchimp</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">Enable Mailchimp email marketing</p>
                        </div>
                        <Switch
                          checked={settings.integrations.mailchimpEnabled}
                          onCheckedChange={(checked) => updateSetting('integrations', 'mailchimpEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center space-x-2">
                            <Bell className="h-4 w-4" />
                            <span>Twilio SMS</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">Enable Twilio SMS notifications</p>
                        </div>
                        <Switch
                          checked={settings.integrations.twilioEnabled}
                          onCheckedChange={(checked) => updateSetting('integrations', 'twilioEnabled', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* API Keys Section */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Key className="h-5 w-5 text-primary" />
                      <span>API Keys & Secrets</span>
                    </CardTitle>
                    <CardDescription>Manage API keys and authentication tokens</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Show API Keys</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKeys(!showApiKeys)}
                      >
                        {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {showApiKeys && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Stripe Secret Key</Label>
                          <Input
                            type="password"
                            placeholder="sk_test_..."
                            value="••••••••••••••••••••••••••••••••"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>eSIM Access API Key</Label>
                          <Input
                            type="password"
                            placeholder="esim_access_..."
                            value="••••••••••••••••••••••••••••••••"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Mailchimp API Key</Label>
                          <Input
                            type="password"
                            placeholder="mailchimp_..."
                            value="••••••••••••••••••••••••••••••••"
                            disabled
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Security Settings</span>
                    </CardTitle>
                    <CardDescription>Configure security policies and authentication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                        </div>
                        <Switch
                          checked={settings.security.twoFactorAuth}
                          onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                          <Input
                            id="sessionTimeout"
                            type="number"
                            min="1"
                            max="168"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                          <Input
                            id="passwordMinLength"
                            type="number"
                            min="6"
                            max="32"
                            value={settings.security.passwordMinLength}
                            onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                        <Input
                          id="loginAttempts"
                          type="number"
                          min="3"
                          max="10"
                          value={settings.security.loginAttempts}
                          onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}