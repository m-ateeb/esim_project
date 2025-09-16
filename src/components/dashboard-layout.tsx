'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Globe, 
  Wifi, 
  CreditCard, 
  Settings, 
  LogOut, 
  Activity, 
  Shield, 
  Crown,
  Menu,
  X,
  Bell,
  User,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../lib/hooks/useAuth";
import { NotificationCenter } from "./notifications";
import { UserProfile } from "./user-profile";
import { NetworkStatusIndicator } from "./real-time-status";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
}

export function DashboardLayout({ 
  children, 
  title, 
  description, 
  showBackButton = false 
}: DashboardLayoutProps) {
  const { session, logout, isLoading, isUserAdmin, isUserModerator } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const { user } = session;
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : user.email?.[0]?.toUpperCase() || "U";

  const getRoleBadge = () => {
    if (isUserAdmin()) {
      return <Badge variant="destructive" className="ml-2"><Crown className="mr-1 h-3 w-3" />Admin</Badge>;
    } else if (isUserModerator()) {
      return <Badge variant="secondary" className="ml-2"><Shield className="mr-1 h-3 w-3" />Moderator</Badge>;
    }
    return null;
  };

  const getRoleDescription = () => {
    if (isUserAdmin()) {
      return "System Administrator - Full access to all features";
    } else if (isUserModerator()) {
      return "Moderator - Enhanced access to user management";
    }
    return "Standard user - Access to personal dashboard and plans";
  };

  const navigationItems = [
    { href: "/dashboard", icon: Activity, label: "Dashboard" },
    { href: "/dashboard/plans", icon: Wifi, label: "My Plans" },
    { href: "/dashboard/orders", icon: ShoppingCart, label: "My Orders" },
    { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link href="/" className="inline-flex items-center space-x-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">eSIM Global</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationCenter />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="inline-flex items-center space-x-2">
                <Globe className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">eSIM Global</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </div>
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* User Profile Section */}
            <div className="p-6 border-b">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{user.name || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {getRoleBadge()}
                  <p className="text-xs text-muted-foreground mt-2">{getRoleDescription()}</p>
                </div>
                <div className="mt-3">
                  <NetworkStatusIndicator />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
              
              {/* Admin/Moderator Links */}
              {(isUserAdmin() || isUserModerator()) && (
                <>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2 px-3">ADMIN ACCESS</p>
                  </div>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin" onClick={() => setSidebarOpen(false)}>
                      <Shield className="mr-3 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </Button>
                  {isUserAdmin() && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/admin/users" onClick={() => setSidebarOpen(false)}>
                        <Crown className="mr-3 h-4 w-4" />
                        User Management
                      </Link>
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Logout */}
            <div className="p-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={logout}
                disabled={isLoading}
              >
                <LogOut className="mr-3 h-4 w-4" />
                {isLoading ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Page Header */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {showBackButton && (
                    <Button variant="ghost" size="sm" asChild className="mb-2">
                      <Link href="/dashboard">← Back to Dashboard</Link>
                    </Button>
                  )}
                  <h1 className="text-2xl lg:text-3xl font-bold text-balance">{title}</h1>
                  {description && (
                    <p className="text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="space-y-6 lg:space-y-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
