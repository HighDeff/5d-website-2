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
  User,
  Package,
  DollarSign,
  Star,
  TrendingUp,
  Eye,
  Heart,
  Upload,
  Edit,
  Settings,
  ShoppingBag,
  Calendar,
  Activity,
  Award,
  Gift,
  Crown,
  Shield,
  Bell,
  MessageSquare,
  Plus,
  Camera,
  CreditCard,
  BarChart3,
  Users,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  Folder,
  Download,
  Trash2,
  RefreshCw,
  Lock,
  Mail,
  Phone,
  MapPin,
  Clock,
  PieChart,
  LineChart,
  Archive,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "@/services/AuthService";
import DatabaseService, {
  UserAccount,
  Sale,
  Item,
  Offer,
  FileRecord,
} from "@/services/DatabaseService";
import BackToTop from "@/components/BackToTop";

export default function UserPortfolio() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Portfolio data
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [itemsData, setItemsData] = useState<Item[]>([]);
  const [offersData, setOffersData] = useState<Offer[]>([]);
  const [filesData, setFilesData] = useState<FileRecord[]>([]);

  // UI states
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const authState = AuthService.getAuthState();

      if (!authState.isAuthenticated || !authState.user) {
        navigate("/auth");
        return;
      }

      setUser(authState.user);

      // Load portfolio data
      setSalesData(authState.user.portfolio.salesHistory);
      setItemsData([
        ...authState.user.portfolio.itemsActive,
        ...authState.user.portfolio.itemsInProgress,
        ...authState.user.portfolio.itemsCompleted,
        ...authState.user.portfolio.itemsReturned,
      ]);
      setOffersData([
        ...authState.user.portfolio.offersMade,
        ...authState.user.portfolio.offersReceived,
      ]);
      setFilesData([
        ...authState.user.files.uploads,
        ...authState.user.files.documents,
        ...authState.user.files.productImages,
      ]);
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      setIsLoading(true);
      const result = await DatabaseService.uploadFile(
        user.id,
        selectedFile,
        undefined,
        ["user-upload"],
      );

      if (result.success) {
        setSuccess("File uploaded successfully!");
        setSelectedFile(null);
        setShowUploadModal(false);
        await loadUserData(); // Refresh data
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (error) {
      setError("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      returned: "bg-red-100 text-red-800",
      accepted: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "sales", label: "Sales", icon: DollarSign },
    { id: "items", label: "My Items", icon: Package },
    { id: "offers", label: "Offers", icon: Gift },
    { id: "files", label: "Files", icon: FileText },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800">
            Loading your portfolio...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please sign in to access your portfolio
          </h1>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
                <span className="text-purple-800 font-bold">Portfolio</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => AuthService.signOut()}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-700 font-medium">{success}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuccess("")}
                className="ml-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError("")}
                className="ml-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Portfolio Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={
                        user.files.profilePicture?.url ||
                        `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`
                      }
                      alt={user.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-200 shadow-lg"
                    />
                    <Button
                      size="sm"
                      onClick={() => setShowUploadModal(true)}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {user.fullName}
                    </h1>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        className={`${
                          user.portfolio.membershipLevel === "premium"
                            ? "bg-purple-100 text-purple-800"
                            : user.portfolio.membershipLevel === "member"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        {user.portfolio.membershipLevel?.toUpperCase()}
                      </Badge>
                      {user.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge className="bg-orange-100 text-orange-800">
                        {user.portfolio.commissionRate}% Commission
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(user.portfolio.totalEarnings)}
                  </div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">
                      {user.portfolio.rating}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({user.portfolio.reviews.length} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.portfolio.salesCount}
                  </div>
                  <div className="text-sm text-gray-600">Sales Made</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      itemsData.filter((item) => item.status === "active")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Active Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      offersData.filter((offer) => offer.status === "pending")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Pending Offers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filesData.length}
                  </div>
                  <div className="text-sm text-gray-600">Files Stored</div>
                </div>
              </div>
            </div>
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
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Sales */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-green-600">
                          <DollarSign className="w-5 h-5 mr-2" />
                          Recent Sales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {salesData.slice(0, 5).length === 0 ? (
                          <div className="text-center py-8">
                            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No sales yet</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {salesData.slice(0, 5).map((sale) => (
                              <div
                                key={sale.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">
                                    {sale.productName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Sold to {sale.buyerName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(sale.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-green-600">
                                    {formatCurrency(sale.amount)}
                                  </p>
                                  <p className="text-sm text-green-500">
                                    +{formatCurrency(sale.netEarnings)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Active Items */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-blue-600">
                          <Package className="w-5 h-5 mr-2" />
                          Active Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {itemsData
                          .filter((item) => item.status === "active")
                          .slice(0, 5).length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No active items</p>
                            <Link to="/admin/product-upload">
                              <Button className="mt-2 bg-purple-600 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Item
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {itemsData
                              .filter((item) => item.status === "active")
                              .slice(0, 5)
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {item.category}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="flex items-center text-xs text-gray-500">
                                        <Eye className="w-3 h-3 mr-1" />
                                        {item.views}
                                      </span>
                                      <span className="flex items-center text-xs text-gray-500">
                                        <Heart className="w-3 h-3 mr-1" />
                                        {item.favorites}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-blue-600">
                                      {formatCurrency(item.price)}
                                    </p>
                                    <Badge
                                      className={getStatusColor(item.status)}
                                    >
                                      {item.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Account Security Status */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-600">
                        <Shield className="w-5 h-5 mr-2" />
                        Account Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Email Verification</p>
                            <p className="text-sm text-gray-600">
                              {user.emailVerified ? "Verified" : "Not verified"}
                            </p>
                          </div>
                          {user.emailVerified ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Two-Factor Auth</p>
                            <p className="text-sm text-gray-600">
                              {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                            </p>
                          </div>
                          {user.twoFactorEnabled ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Account Status</p>
                            <p className="text-sm text-gray-600">
                              {user.status}
                            </p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Sales Tab */}
              {activeTab === "sales" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Total Sales
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(user.portfolio.totalSales)}
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Net Earnings
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatCurrency(user.portfolio.totalEarnings)}
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Sales Count
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {user.portfolio.salesCount}
                            </p>
                          </div>
                          <BarChart3 className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sales History */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Sales History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {salesData.length === 0 ? (
                        <div className="text-center py-12">
                          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No sales yet
                          </h3>
                          <p className="text-gray-500">
                            Your sales history will appear here once you make
                            your first sale.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left p-4 font-semibold text-gray-700">
                                  Product
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                  Buyer
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                  Amount
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                  Earnings
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                  Status
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {salesData.map((sale) => (
                                <tr
                                  key={sale.id}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                  <td className="p-4">{sale.productName}</td>
                                  <td className="p-4">{sale.buyerName}</td>
                                  <td className="p-4 font-semibold text-green-600">
                                    {formatCurrency(sale.amount)}
                                  </td>
                                  <td className="p-4 font-semibold text-purple-600">
                                    {formatCurrency(sale.netEarnings)}
                                  </td>
                                  <td className="p-4">
                                    <Badge
                                      className={getStatusColor(sale.status)}
                                    >
                                      {sale.status}
                                    </Badge>
                                  </td>
                                  <td className="p-4 text-sm text-gray-600">
                                    {new Date(sale.date).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Files Tab */}
              {activeTab === "files" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                      File Manager
                    </h3>
                    <Button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>

                  {/* File Grid */}
                  {filesData.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No files uploaded
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Upload your first file to get started.
                      </p>
                      <Button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-purple-600 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filesData.map((file) => (
                        <Card key={file.id} className="border-0 shadow-lg">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center">
                                {file.type.startsWith("image/") ? (
                                  <img
                                    src={file.url}
                                    alt={file.originalName}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <FileText className="w-12 h-12 text-gray-400" />
                                )}
                                <div className="ml-3">
                                  <p className="font-medium text-sm truncate max-w-[150px]">
                                    {file.originalName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">
                                Uploaded:{" "}
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    Security Settings
                  </h3>

                  {/* Security Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>Account Security</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Email Verification</h4>
                            <p className="text-sm text-gray-600">
                              {user.emailVerified
                                ? "Your email is verified"
                                : "Email not verified"}
                            </p>
                          </div>
                          {user.emailVerified ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Button size="sm">Verify Now</Button>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">
                              Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-gray-600">
                              {user.twoFactorEnabled
                                ? "2FA is enabled"
                                : "Add extra security to your account"}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (user.twoFactorEnabled) {
                                AuthService.disableTwoFactor();
                              } else {
                                AuthService.enableTwoFactor();
                              }
                              loadUserData();
                            }}
                            variant={
                              user.twoFactorEnabled ? "outline" : "default"
                            }
                          >
                            {user.twoFactorEnabled ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>Account Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              Last Login:
                            </span>
                            <span className="text-sm text-gray-600">
                              {user.lastLoginAt
                                ? new Date(user.lastLoginAt).toLocaleString()
                                : "Never"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              Account Created:
                            </span>
                            <span className="text-sm text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              Last Updated:
                            </span>
                            <span className="text-sm text-gray-600">
                              {new Date(user.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Upload File</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="file-upload">Choose File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="mt-1"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: Images, PDF, DOC, TXT (Max 10MB)
                </p>
              </div>

              {selectedFile && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BackToTop />
    </div>
  );
}
