import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Package,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Star,
  Heart,
  MessageSquare,
  Gift,
  Ban,
  Unlock,
  UserPlus,
  Save,
  Calendar,
  Clock,
  Target,
  Zap,
  Award,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "@/hooks/useUserAuth";
import BackToTop from "@/components/BackToTop";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentInfo?: {
    cardNumber?: string;
    expiryDate?: string;
    paypalEmail?: string;
    cashAppTag?: string;
  };
  membershipLevel: "free" | "member" | "premium";
  joinDate: string;
  lastActive: string;
  totalSales: number;
  totalPurchases: number;
  salesCount: number;
  purchaseCount: number;
  rating: number;
  status: "active" | "suspended" | "banned";
  verified: boolean;
  avatar: string;
  preferences: {
    notifications: boolean;
    marketing: boolean;
    publicProfile: boolean;
  };
}

interface Sale {
  id: string;
  userId: string;
  productName: string;
  amount: number;
  commission: number;
  date: string;
  status: "completed" | "pending" | "refunded" | "disputed";
  buyerName: string;
  refundRequested?: boolean;
}

interface Offer {
  id: string;
  fromUserId: string;
  toUserId: string;
  productName: string;
  originalPrice: number;
  offerAmount: number;
  message: string;
  status: "pending" | "accepted" | "declined" | "expired";
  date: string;
}

interface Refund {
  id: string;
  saleId: string;
  userId: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "denied" | "processed";
  requestDate: string;
  processedDate?: string;
}

export default function UserManagement() {
  const {
    user: currentUser,
    allUsers: realUsers,
    allSales: realSales,
  } = useUserAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSales: 0,
    totalCommission: 0,
    pendingRefunds: 0,
    pendingOffers: 0,
  });

  // Initialize data - combine real users with some mock data for demo
  useEffect(() => {
    // Add some mock users if no real users exist
    const mockUsers: User[] =
      realUsers.length > 0
        ? []
        : [
            {
              id: "user-001",
              name: "Sarah Johnson",
              email: "sarah@example.com",
              phone: "+1 (555) 123-4567",
              address: "123 Main St, New York, NY 10001",
              paymentInfo: {
                paypalEmail: "sarah@paypal.com",
                cashAppTag: "$SarahJ123",
              },
              membershipLevel: "member",
              joinDate: "2024-01-15",
              lastActive: "2024-01-25",
              totalSales: 1250.0,
              totalPurchases: 890.5,
              salesCount: 8,
              purchaseCount: 15,
              rating: 4.8,
              status: "active",
              verified: true,
              avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face",
              preferences: {
                notifications: true,
                marketing: true,
                publicProfile: true,
              },
            },
            {
              id: "user-002",
              name: "Michael Chen",
              email: "michael@example.com",
              phone: "+1 (555) 987-6543",
              address: "456 Oak Ave, Los Angeles, CA 90210",
              paymentInfo: {
                cardNumber: "**** **** **** 1234",
                expiryDate: "12/26",
              },
              membershipLevel: "premium",
              joinDate: "2023-11-20",
              lastActive: "2024-01-24",
              totalSales: 2340.75,
              totalPurchases: 1560.25,
              salesCount: 15,
              purchaseCount: 22,
              rating: 4.9,
              status: "active",
              verified: true,
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              preferences: {
                notifications: true,
                marketing: false,
                publicProfile: true,
              },
            },
            {
              id: "user-003",
              name: "Emily Rodriguez",
              email: "emily@example.com",
              membershipLevel: "free",
              joinDate: "2024-01-20",
              lastActive: "2024-01-23",
              totalSales: 125.0,
              totalPurchases: 67.99,
              salesCount: 2,
              purchaseCount: 3,
              rating: 4.5,
              status: "active",
              verified: false,
              avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
              preferences: {
                notifications: true,
                marketing: true,
                publicProfile: false,
              },
            },
          ];

    const mockSales: Sale[] = [
      {
        id: "sale-001",
        userId: "user-001",
        productName: "Fashion Accessories Item 4668",
        amount: 89.99,
        commission: 8.1,
        date: "2024-01-24",
        status: "completed",
        buyerName: "John Smith",
      },
      {
        id: "sale-002",
        userId: "user-002",
        productName: "Pearl Earrings",
        amount: 45.5,
        commission: 4.55,
        date: "2024-01-23",
        status: "pending",
        buyerName: "Lisa Wang",
      },
      {
        id: "sale-003",
        userId: "user-001",
        productName: "Heart Powder Puff",
        amount: 15.99,
        commission: 1.44,
        date: "2024-01-22",
        status: "refunded",
        buyerName: "Maria Garcia",
        refundRequested: true,
      },
    ];

    const mockOffers: Offer[] = [
      {
        id: "offer-001",
        fromUserId: "user-003",
        toUserId: "user-001",
        productName: "Classic Black Suit",
        originalPrice: 199.99,
        offerAmount: 150.0,
        message: "Would you consider $150? I'm really interested in this item.",
        status: "pending",
        date: "2024-01-24",
      },
      {
        id: "offer-002",
        fromUserId: "user-002",
        toUserId: "user-003",
        productName: "Cotton Bikini Underwear",
        originalPrice: 25.99,
        offerAmount: 20.0,
        message: "Can you do $20?",
        status: "accepted",
        date: "2024-01-23",
      },
    ];

    const mockRefunds: Refund[] = [
      {
        id: "refund-001",
        saleId: "sale-003",
        userId: "user-001",
        amount: 15.99,
        reason: "Item not as described",
        status: "pending",
        requestDate: "2024-01-23",
      },
    ];

    // Combine real users with mock users
    const allUsers = [...realUsers, ...mockUsers];
    const allSalesData = [
      ...realSales.map((sale) => ({
        id: sale.id,
        userId: sale.sellerId,
        productName: sale.productName,
        amount: sale.amount,
        commission: sale.commission,
        date: sale.date,
        status: sale.status as
          | "completed"
          | "pending"
          | "refunded"
          | "disputed",
        buyerName: sale.buyerName,
      })),
      ...mockSales,
    ];

    setUsers(allUsers);
    setSales(allSalesData);
    setOffers(mockOffers);
    setRefunds(mockRefunds);

    // Calculate stats
    setStats({
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u) => u.status === "active").length,
      totalSales: allSalesData.reduce((sum, sale) => sum + sale.amount, 0),
      totalCommission: allSalesData.reduce(
        (sum, sale) => sum + sale.commission,
        0,
      ),
      pendingRefunds: mockRefunds.filter((r) => r.status === "pending").length,
      pendingOffers: mockOffers.filter((o) => o.status === "pending").length,
    });
  }, [realUsers, realSales]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle user actions
  const handleSuspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "suspended" ? "active" : "suspended",
            }
          : user,
      ),
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const handleVerifyUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, verified: !user.verified } : user,
      ),
    );
  };

  const handleRefundAction = (refundId: string, action: "approve" | "deny") => {
    setRefunds((prev) =>
      prev.map((refund) =>
        refund.id === refundId
          ? {
              ...refund,
              status: action === "approve" ? "approved" : "denied",
              processedDate: new Date().toISOString().split("T")[0],
            }
          : refund,
      ),
    );
  };

  const handleOfferAction = (offerId: string, action: "accept" | "decline") => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId
          ? { ...offer, status: action === "accept" ? "accepted" : "declined" }
          : offer,
      ),
    );
  };

  const tabs = [
    { id: "users", label: "Users", icon: Users, count: users.length },
    { id: "sales", label: "Sales", icon: DollarSign, count: sales.length },
    {
      id: "offers",
      label: "Offers",
      icon: Gift,
      count: offers.filter((o) => o.status === "pending").length,
    },
    {
      id: "refunds",
      label: "Refunds",
      icon: RefreshCw,
      count: refunds.filter((r) => r.status === "pending").length,
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100">
      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                  LILLY'S
                </h1>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-purple-600 mx-2">/</span>
                <span className="text-purple-600 font-semibold">
                  Admin Panel
                </span>
                <span className="text-purple-600 mx-2">/</span>
                <span className="text-purple-800 font-bold">
                  User Management
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin/product-upload">
                <Button variant="outline" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Products
                </Button>
              </Link>
              <Link to="/membership">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage user accounts, sales, offers, and refunds
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.activeUsers}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Sales
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${stats.totalSales.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Commission
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      ${stats.totalCommission.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pending Refunds
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.pendingRefunds}
                    </p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pending Offers
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pendingOffers}
                    </p>
                  </div>
                  <Gift className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className={`${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                      {tab.count !== undefined && (
                        <Badge className="ml-2" variant="secondary">
                          {tab.count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-full sm:w-64"
                        />
                      </div>
                      <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                      >
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => setShowAddUser(true)}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>

                  {/* Users Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                      <Card
                        key={user.id}
                        className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full border-2 border-purple-200"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {user.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge
                                className={`${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : user.status === "suspended"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status}
                              </Badge>
                              {user.verified && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Membership:</span>
                              <Badge
                                variant="outline"
                                className={`${
                                  user.membershipLevel === "premium"
                                    ? "border-purple-300 text-purple-700"
                                    : user.membershipLevel === "member"
                                      ? "border-blue-300 text-blue-700"
                                      : "border-gray-300 text-gray-700"
                                }`}
                              >
                                {user.membershipLevel}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Total Sales:
                              </span>
                              <span className="font-medium text-green-600">
                                ${user.totalSales.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Rating:</span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 font-medium">
                                  {user.rating}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Joined:</span>
                              <span className="font-medium">
                                {new Date(user.joinDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUser(user);
                                setShowUserModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuspendUser(user.id)}
                              className={
                                user.status === "suspended"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }
                            >
                              {user.status === "suspended" ? (
                                <Unlock className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Sales Tab */}
              {activeTab === "sales" && (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Sale ID
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Seller
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Product
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Amount
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Commission
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.map((sale) => {
                          const seller = users.find(
                            (u) => u.id === sale.userId,
                          );
                          return (
                            <tr
                              key={sale.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="p-4 text-sm font-mono">
                                {sale.id}
                              </td>
                              <td className="p-4">
                                {seller?.name || "Unknown"}
                              </td>
                              <td className="p-4">{sale.productName}</td>
                              <td className="p-4 font-medium text-green-600">
                                ${sale.amount.toFixed(2)}
                              </td>
                              <td className="p-4 font-medium text-purple-600">
                                ${sale.commission.toFixed(2)}
                              </td>
                              <td className="p-4">
                                <Badge
                                  className={`${
                                    sale.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : sale.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : sale.status === "refunded"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {sale.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Offers Tab */}
              {activeTab === "offers" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {offers.map((offer) => {
                      const fromUser = users.find(
                        (u) => u.id === offer.fromUserId,
                      );
                      const toUser = users.find((u) => u.id === offer.toUserId);
                      return (
                        <Card key={offer.id} className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {offer.productName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  From: {fromUser?.name} → To: {toUser?.name}
                                </p>
                              </div>
                              <Badge
                                className={`${
                                  offer.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : offer.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {offer.status}
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Original Price:
                                </span>
                                <span className="font-medium">
                                  ${offer.originalPrice.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Offer Amount:
                                </span>
                                <span className="font-bold text-green-600">
                                  ${offer.offerAmount.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Discount:</span>
                                <span className="font-medium text-orange-600">
                                  {(
                                    ((offer.originalPrice - offer.offerAmount) /
                                      offer.originalPrice) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-gray-700 italic">
                                "{offer.message}"
                              </p>
                            </div>

                            {offer.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleOfferAction(offer.id, "accept")
                                  }
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleOfferAction(offer.id, "decline")
                                  }
                                  variant="outline"
                                  className="flex-1 text-red-600 border-red-200"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Refunds Tab */}
              {activeTab === "refunds" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {refunds.map((refund) => {
                      const user = users.find((u) => u.id === refund.userId);
                      const sale = sales.find((s) => s.id === refund.saleId);
                      return (
                        <Card key={refund.id} className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  Refund Request
                                </h3>
                                <p className="text-sm text-gray-600">
                                  User: {user?.name} • Sale: {refund.saleId}
                                </p>
                              </div>
                              <Badge
                                className={`${
                                  refund.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : refund.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {refund.status}
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-bold text-red-600">
                                  ${refund.amount.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Requested:
                                </span>
                                <span className="font-medium">
                                  {new Date(
                                    refund.requestDate,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              {refund.processedDate && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Processed:
                                  </span>
                                  <span className="font-medium">
                                    {new Date(
                                      refund.processedDate,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mb-4">
                              <Label className="text-sm font-medium text-gray-700">
                                Reason:
                              </Label>
                              <p className="text-sm text-gray-700 mt-1">
                                "{refund.reason}"
                              </p>
                            </div>

                            {refund.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleRefundAction(refund.id, "approve")
                                  }
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleRefundAction(refund.id, "deny")
                                  }
                                  variant="outline"
                                  className="flex-1 text-red-600 border-red-200"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Deny
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>Platform Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Commission Rate (Free Users)</Label>
                          <Input
                            type="number"
                            defaultValue="15"
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Percentage taken from sales
                          </p>
                        </div>
                        <div>
                          <Label>Commission Rate (Members)</Label>
                          <Input
                            type="number"
                            defaultValue="10"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Minimum Payout Amount</Label>
                          <Input
                            type="number"
                            defaultValue="10"
                            className="mt-1"
                          />
                        </div>
                        <Button className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          Save Settings
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>Email Notifications</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>New User Registration</span>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="toggle"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>New Sale Notifications</span>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="toggle"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Refund Requests</span>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="toggle"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Dispute Alerts</span>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="toggle"
                          />
                        </div>
                        <Button className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          Update Notifications
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* User Detail/Edit Modal */}
      {showUserModal && (selectedUser || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingUser ? "Edit User" : "User Details"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                    setEditingUser(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {editingUser ? (
                // Edit form
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input defaultValue={editingUser.name} className="mt-1" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        defaultValue={editingUser.email}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        defaultValue={editingUser.phone || ""}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Membership Level</Label>
                      <Select defaultValue={editingUser.membershipLevel}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Textarea
                      defaultValue={editingUser.address || ""}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Payment Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <Input
                        placeholder="PayPal Email"
                        defaultValue={
                          editingUser.paymentInfo?.paypalEmail || ""
                        }
                      />
                      <Input
                        placeholder="CashApp Tag"
                        defaultValue={editingUser.paymentInfo?.cashAppTag || ""}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUserModal(false);
                        setEditingUser(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View details
                selectedUser && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-20 h-20 rounded-full border-4 border-purple-200"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {selectedUser.name}
                        </h3>
                        <p className="text-gray-600">{selectedUser.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            className={`${
                              selectedUser.membershipLevel === "premium"
                                ? "bg-purple-100 text-purple-800"
                                : selectedUser.membershipLevel === "member"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {selectedUser.membershipLevel}
                          </Badge>
                          {selectedUser.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Contact Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {selectedUser.email}
                            </span>
                          </div>
                          {selectedUser.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">
                                {selectedUser.phone}
                              </span>
                            </div>
                          )}
                          {selectedUser.address && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">
                                {selectedUser.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Account Stats
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Sales:</span>
                            <span className="font-medium text-green-600">
                              ${selectedUser.totalSales.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Purchases:
                            </span>
                            <span className="font-medium">
                              ${selectedUser.totalPurchases.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="ml-1 font-medium">
                                {selectedUser.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Joined:</span>
                            <span className="font-medium">
                              {new Date(
                                selectedUser.joinDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedUser.paymentInfo && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Payment Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUser.paymentInfo.paypalEmail && (
                            <div className="flex items-center space-x-2">
                              <CreditCard className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">
                                PayPal: {selectedUser.paymentInfo.paypalEmail}
                              </span>
                            </div>
                          )}
                          {selectedUser.paymentInfo.cashAppTag && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">
                                CashApp: {selectedUser.paymentInfo.cashAppTag}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4 pt-4 border-t">
                      <Button
                        onClick={() => {
                          setEditingUser(selectedUser);
                          setSelectedUser(null);
                        }}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit User
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleVerifyUser(selectedUser.id)}
                        className="flex-1"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        {selectedUser.verified ? "Unverify" : "Verify"}
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <BackToTop />
    </div>
  );
}
