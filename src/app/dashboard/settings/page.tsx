"use client"

import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"
import {
  Globe,
  User,
  Shield,
  Bell,
  Mail,
  Phone,
  Lock,
  Settings,
  Save,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Loader2,
  RefreshCw,
  XCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../../../lib/hooks/useAuth"
import { DashboardLayout } from "../../../components/dashboard-layout"

export default function DashboardSettingsPage() {
  const { session, logout, isLoading } = useAuth()
  const user = session?.user
  const fullName = user?.name || ""
  const [firstName, ...rest] = fullName.split(" ")
  const lastName = rest.join(" ")
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: user?.email || "",
    phone: "",
    country: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    billing: true,
    security: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: 30,
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: firstName || "",
        lastName: lastName || "",
        email: user.email || "",
      }))
    }
  }, [user, firstName, lastName])

  const handleSave = async (section: string) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(`${section} settings updated successfully!`)
    } catch (err) {
      setError(`Failed to update ${section} settings`)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: string, value: boolean | number) => {
    setSecurity(prev => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout 
      title="Account Settings" 
      description="Manage your account preferences and security settings"
      showBackButton
    >
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{success}</p>
            </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="United States"
                />
                  </div>
                  
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => handleSave('Profile')}
                  disabled={saving}
                  className="flex-1 sm:flex-none"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                    Save Changes
                  </Button>
              </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => handleSecurityChange('twoFactor', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Login Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                  </div>
                  <Switch 
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => handleSecurityChange('loginAlerts', checked)}
                  />
                </div>
              </div>
              
                    <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                    <Input 
                      id="newPassword" 
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                    </div>
                  </div>
                  
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => handleSave('Security')}
                  disabled={saving}
                  className="flex-1 sm:flex-none"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Key className="w-4 h-4 mr-2" />
                  )}
                  Update Password
                        </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                        </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                    <h3 className="font-medium">Billing Notifications</h3>
                    <p className="text-sm text-muted-foreground">Get notified about billing and payments</p>
                  </div>
                  <Switch 
                    checked={notifications.billing}
                    onCheckedChange={(checked) => handleNotificationChange('billing', checked)}
                  />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                    <h3 className="font-medium">Security Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get notified about security events</p>
                        </div>
                  <Switch 
                    checked={notifications.security}
                    onCheckedChange={(checked) => handleNotificationChange('security', checked)}
                  />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                    <h3 className="font-medium">Marketing Communications</h3>
                    <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                  />
                </div>
                  </div>
                  
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => handleSave('Notifications')}
                  disabled={saving}
                  className="flex-1 sm:flex-none"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Bell className="w-4 h-4 mr-2" />
                  )}
                    Save Preferences
                  </Button>
              </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                <span>App Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                  </div>
                  <Switch />
                  </div>
                  
                      <div className="flex items-center justify-between">
                        <div>
                    <h3 className="font-medium">Auto-refresh Data</h3>
                    <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                    <h3 className="font-medium">Show Usage Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get alerts when approaching data limits</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                  </div>
                  
                    <div className="space-y-4">
                <h3 className="font-medium">Session Timeout</h3>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout Duration (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number" 
                    value={security.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                    min="5"
                    max="120"
                  />
                    </div>
                  </div>
                  
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => handleSave('Preferences')}
                  disabled={saving}
                  className="flex-1 sm:flex-none"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4 mr-2" />
                  )}
                    Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Danger Zone */}
          <Card className="shadow-lg border-0 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </DashboardLayout>
  )
}