"use client"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Mail,
  Phone,
  Globe,
  Calendar,
  ShoppingCart,
  Wifi,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  ArrowLeft,
  Bell,
  BarChart3,
  Package,
  PieChart,
  Settings,
  LogOut,
  Loader2,
  RefreshCw
} from "lucide-react"
import { useAuth } from "../../../../lib/hooks/useAuth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatCurrency } from "../../../../lib/utils"

interface User {
  image: string
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN" | "MODERATOR"
  isActive: boolean
  referralCode: string
  createdAt: string
  phone?: string
  country?: string
  profile?: {
    lastLoginAt?: string
    loginCount: number
  }
  _count: {
    orders: number
    userPlans: number
  }
}

export default function AdminUsersPage() {
  const { session, isUserAdmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as const,
    phone: "",
    country: ""
  })

  // Redirect if not admin
  useEffect(() => {
    if (session && !isUserAdmin()) {
      router.push("/dashboard")
    }
  }, [session, isUserAdmin, router])

  // Fetch users
  useEffect(() => {
    if (isUserAdmin()) {
      fetchUsers()
    }
  }, [currentPage, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && roleFilter !== "all" && { role: roleFilter }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm)
      })

      if (response.ok) {
        setShowCreateDialog(false)
        setCreateForm({ name: "", email: "", password: "", role: "USER", phone: "", country: "" })
        fetchUsers()
      }
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates })
      })

      if (response.ok) {
        setShowEditDialog(false)
        setSelectedUser(null)
        fetchUsers()
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4 text-red-600" />
      case "MODERATOR":
        return <ShieldCheck className="h-4 w-4 text-orange-600" />
      default:
        return <ShieldX className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="destructive">Admin</Badge>
      case "MODERATOR":
        return <Badge variant="secondary">Moderator</Badge>
      default:
        return <Badge variant="outline">User</Badge>
    }
  }

  if (!isUserAdmin()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShieldX className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
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
                <Button variant="default" className="w-full justify-start" asChild>
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
                    onClick={() => router.push('/api/auth/signout')}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
              </div>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* Filters */}
            <Card className="shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter || "all"} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="MODERATOR">Moderator</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchUsers}>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
            <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                          {!user.isActive && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center">
                              <Phone className="mr-1 h-3 w-3" />
                              {user.phone}
                            </span>
                          )}
                          {user.country && (
                            <span className="flex items-center">
                              <Globe className="mr-1 h-3 w-3" />
                              {user.country}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <ShoppingCart className="mr-1 h-3 w-3" />
                            {user._count.orders} orders
                          </span>
                          <span className="flex items-center">
                            <Wifi className="mr-1 h-3 w-3" />
                            {user._count.userPlans} plans
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system with appropriate role and permissions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={createForm.role} onValueChange={(value: any) => setCreateForm({ ...createForm, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country (Optional)</Label>
                <Input
                  id="country"
                  value={createForm.country}
                  onChange={(e) => setCreateForm({ ...createForm, country: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user role and status.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={selectedUser.name || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={selectedUser.email || ""} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(value: any) => setSelectedUser({ ...selectedUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="MODERATOR">Moderator</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedUser.isActive ? "active" : "inactive"} 
                    onValueChange={(value: string) => setSelectedUser({ ...selectedUser, isActive: value === "active" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedUser && handleUpdateUser(selectedUser.id, {
                role: selectedUser.role,
                isActive: selectedUser.isActive
              })}
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </div>
 
  )
}
