import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Brain,
  Download,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/hooks/useUserAuth";
import AISuggestions from "@/components/AISuggestions";
import UserNotificationService from "@/services/UserNotificationService";
import UserProductCategories from "@/components/UserProductCategories";
import SourcingManager from "@/components/SourcingManager";
import BackToTop from "@/components/BackToTop";
import AuthGuard from "@/components/AuthGuard";
import AIDashboard from "@/components/AIDashboard";
import SocialMediaMonitor from "@/components/SocialMediaMonitor";
import AIManagementDashboard from "@/components/AIManagementDashboard";

function UserDashboard() {
  const navigate = useNavigate();
  const { currentUser, isSignedIn, allProducts, allSales, updateUser } =
    useUserAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  // Debug logging
  useEffect(() => {
    console.log("UserDashboard loaded - isSignedIn:", isSignedIn);
    console.log("UserDashboard loaded - currentUser:", currentUser);
    const savedUser = localStorage.getItem("currentUser");
    console.log("UserDashboard - localStorage currentUser:", savedUser);
  }, [isSignedIn, currentUser]);

  // Redirect if not signed in - but wait a moment for auth to load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSignedIn && !currentUser) {
        console.log("No user found after delay, redirecting to auth...");
        navigate("/auth");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isSignedIn, currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      setNewName(currentUser.name);
    }
  }, [currentUser]);

  // Show loading state briefly to allow auth to load
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Wait 500ms for auth to load

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h1 className="text-xl text-gray-600">Loading your dashboard...</h1>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log("No current user found after loading, showing sign-in prompt");
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please sign in to access your dashboard
          </h1>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Sign In / Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const userProducts = allProducts.filter((p) => p.sellerId === currentUser.id);
  const userSales = allSales.filter((s) => s.sellerId === currentUser.id);
  const totalCommission = userSales.reduce(
    (sum, sale) => sum + sale.commission,
    0,
  );

  const handleNameUpdate = () => {
    if (newName.trim() && newName !== currentUser.name) {
      updateUser({ name: newName.trim() });
      setEditingName(false);
    } else {
      setEditingName(false);
      setNewName(currentUser.name);
    }
  };

  const membershipBenefits = {
    free: {
      commission: "15%",
      color: "gray",
      features: ["List products", "Basic support", "Standard processing"],
    },
    member: {
      commission: "10%",
      color: "blue",
      features: [
        "Lower fees",
        "Priority support",
        "Fast processing",
        "Featured listings",
      ],
    },
    premium: {
      commission: "5%",
      color: "purple",
      features: [
        "Lowest fees",
        "VIP support",
        "Instant processing",
        "Featured listings",
        "Analytics",
      ],
    },
  };

  const currentBenefits =
    membershipBenefits[currentUser.membershipLevel] || membershipBenefits.free;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "My Products", icon: Package },
    { id: "sales", label: "Sales", icon: DollarSign },
    { id: "sourcing", label: "Sourcing & Reselling", icon: TrendingUp },
    { id: "social", label: "Social Media", icon: Users },
    { id: "profile", label: "Profile", icon: User },
    { id: "ai-dashboard", label: "AI Dashboard", icon: Brain },
    { id: "ai-insights", label: "AI Insights", icon: Zap },
    ...(currentUser.email === "haynes.d1993@yahoo.com" || currentUser.isAdmin
      ? [
          { id: "ai-management", label: "AI Management", icon: Brain },
          { id: "ai-hub", label: "AI Hub", icon: Zap },
        ]
      : []),
    ...(currentUser.membershipLevel !== "free"
      ? [
          { id: "custom-ai", label: "Custom AI", icon: Settings },
          { id: "page-builder", label: "Page Builder", icon: Plus },
        ]
      : []),
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
                <span className="text-purple-800 font-bold">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/user-settings">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link to="/admin/product-upload">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Welcome Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <img
                    src={
                      currentUser.avatar ||
                      `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`
                    }
                    alt={currentUser.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-200 shadow-lg"
                  />
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        {editingName ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="text-2xl font-bold max-w-xs"
                              onBlur={handleNameUpdate}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleNameUpdate();
                                if (e.key === "Escape") {
                                  setEditingName(false);
                                  setNewName(currentUser.name);
                                }
                              }}
                              autoFocus
                            />
                            <Button size="sm" onClick={handleNameUpdate}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                              Welcome back, {currentUser.name}!
                            </h1>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingName(true)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600">{currentUser.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          className={`${
                            currentUser.membershipLevel === "premium"
                              ? "bg-purple-100 text-purple-800"
                              : currentUser.membershipLevel === "member"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          {currentUser.membershipLevel?.toUpperCase()}
                        </Badge>
                        {currentUser.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge className="bg-orange-100 text-orange-800">
                          Commission: {currentBenefits.commission}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-2">
                      <Link to="/settings">
                        <Button variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </Link>
                      <Link to="/admin/product-upload">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Analytics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${currentUser.totalSales?.toFixed(2) || "0.00"}
                  </div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userProducts.length}
                  </div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${totalCommission.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Earned</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-yellow-600 ml-1">
                      {currentUser.rating || "5.0"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userProducts.reduce((sum, p) => sum + (p.views || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {userProducts.reduce((sum, p) => sum + (p.likes || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
              </div>

              {/* Analytics Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <Link to="/user-settings">
                  <Button variant="outline" size="sm" className="text-xs">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Full Analytics
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    // Export user analytics
                    const analyticsData = {
                      user: currentUser.name,
                      totalSales: currentUser.totalSales || 0,
                      totalProducts: userProducts.length,
                      totalCommission: totalCommission,
                      rating: currentUser.rating || 5.0,
                      timestamp: new Date().toISOString(),
                    };
                    const blob = new Blob(
                      [JSON.stringify(analyticsData, null, 2)],
                      {
                        type: "application/json",
                      },
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `analytics-${currentUser.name?.replace(/\s+/g, "-")}-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    // Generate performance report
                    const avgViews =
                      userProducts.reduce((sum, p) => sum + (p.views || 0), 0) /
                        userProducts.length || 0;
                    const topProduct = userProducts.reduce(
                      (top, p) => ((p.views || 0) > (top.views || 0) ? p : top),
                      userProducts[0],
                    );

                    alert(`Performance Summary:
• Avg Views per Product: ${avgViews.toFixed(1)}
• Top Product: ${topProduct?.name || "None"} (${topProduct?.views || 0} views)
• Conversion Rate: ${userProducts.length > 0 ? (((currentUser.salesCount || 0) / userProducts.length) * 100).toFixed(1) : 0}%`);
                  }}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Performance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setActiveTab("ai-insights")}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Insights
                </Button>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/admin/product-upload">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Upload Products
                  </h3>
                  <p className="text-sm text-gray-600">Add new items to sell</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/collections">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Browse Shop
                  </h3>
                  <p className="text-sm text-gray-600">Explore collections</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/user-settings">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">
                    User Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage your account, AI settings & preferences
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/offers">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Live Offers
                  </h3>
                  <p className="text-sm text-gray-600">Make & manage offers</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Membership Upgrade Banner */}
          {currentUser.membershipLevel === "free" && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Upgrade to Member</h3>
                  <p className="text-purple-100 mb-4 sm:mb-0">
                    Reduce your commission to just 10% and get priority support!
                  </p>
                </div>
                <Link to="/membership">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600 bg-purple-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Product Categories */}
              <UserProductCategories
                userId={currentUser.id}
                maxCategories={6}
              />

              {/* AI Suggestions */}
              <AISuggestions
                userId={currentUser.id}
                showInline={true}
                maxItems={5}
              />

              {/* Recent Activity */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userSales.length === 0 && userProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Welcome to Lilly's!
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Start by uploading your first product to begin selling.
                      </p>
                      <Link to="/admin/product-upload">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Your First Product
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userProducts.slice(0, 3).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Package className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-800">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Listed on{" "}
                                {new Date(
                                  product.dateAdded,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              ${product.price}
                            </p>
                            <Badge
                              className={
                                product.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }
                            >
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                      ))}

                      {userSales.slice(0, 2).map((sale) => (
                        <div
                          key={sale.id}
                          className="flex items-center justify-between p-4 bg-green-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <DollarSign className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-800">
                                Sale: {sale.productName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Sold to {sale.buyerName} on{" "}
                                {new Date(sale.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              ${sale.amount}
                            </p>
                            <p className="text-sm text-green-500">
                              +${sale.commission.toFixed(2)} earned
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sourcing & Reselling Tab */}
          {activeTab === "sourcing" && (
            <div>
              <SourcingManager userId={currentUser.id} />
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <UserProductCategories userId={currentUser.id} />
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === "sales" && (
            <div>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Sales Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Sales Analytics Coming Soon
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Detailed sales analytics and reports will be available
                      here.
                    </p>
                    <Link to="/analytics">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile and Settings tabs would go here */}
          {activeTab === "profile" && (
            <div>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4">
                      Profile Settings
                    </h3>
                    <Link to="/profile">
                      <Button>Go to Profile Page</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "social" && (
            <div>
              <SocialMediaMonitor userId={currentUser.id} />
            </div>
          )}

          {activeTab === "ai-dashboard" && (
            <div>
              <AIDashboard
                userId={currentUser.id}
                isAdmin={
                  currentUser.email === "haynes.d1993@yahoo.com" ||
                  currentUser.isAdmin
                }
              />
            </div>
          )}

          {activeTab === "ai-management" && (
            <div>
              <AIManagementDashboard
                userId={currentUser.id}
                isAdmin={
                  currentUser.email === "haynes.d1993@yahoo.com" ||
                  currentUser.isAdmin
                }
              />
            </div>
          )}

          {activeTab === "ai-hub" && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-purple-600" />
                    AI Management Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Advanced AI management for error prediction, sales
                      sharing, and system optimization.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-medium flex items-center mb-2">
                          <Shield className="w-5 h-5 mr-2 text-blue-500" />
                          Error Prediction
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          AI analyzes patterns to predict and prevent future
                          errors
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Automatic error pattern detection</li>
                          <li>• Routine preventive checks</li>
                          <li>• Proactive solution generation</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-medium flex items-center mb-2">
                          <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                          Sales Management
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Revenue sharing contracts with AI oversight
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Automated payback agreements</li>
                          <li>• Contract enforcement</li>
                          <li>• AI reserve pool management</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-medium flex items-center mb-2">
                          <Target className="w-5 h-5 mr-2 text-orange-500" />
                          Testing & QA
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Automated testing and quality assurance
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Create test pages on demand</li>
                          <li>• Reproduce functionality issues</li>
                          <li>• Generate alternative solutions</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-medium flex items-center mb-2">
                          <Activity className="w-5 h-5 mr-2 text-purple-500" />
                          System Monitoring
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Real-time monitoring and optimization
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Performance tracking</li>
                          <li>• Resource optimization</li>
                          <li>• Predictive scaling</li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">
                          Enhanced Favorites Status
                        </h4>
                        <div className="lazy-load">
                          {/* Lazy load the status display */}
                          {React.lazy(
                            () =>
                              import("../components/FavoritesStatusDisplay"),
                          )
                            .then((Component) => (
                              <React.Suspense
                                fallback={
                                  <div className="text-center py-4 text-gray-500">
                                    Loading status...
                                  </div>
                                }
                              >
                                <Component.default
                                  userId={currentUser.id}
                                  showGlobalStats={currentUser.isAdmin}
                                />
                              </React.Suspense>
                            ))
                            .catch(() => (
                              <div className="text-center py-4 text-red-500">
                                Error loading status
                              </div>
                            ))}
                        </div>
                      </div>

                      <Link to="/ai-management">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          <Brain className="w-4 h-4 mr-2" />
                          Open AI Management Hub
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "ai-insights" && (
            <div className="space-y-6">
              {/* AI Insights Header */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <Brain className="w-6 h-6 mr-3" />
                    AI-Powered Business Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700">
                    Our AI analyzes your data in real-time to provide actionable
                    insights for growing your business.
                  </p>
                </CardContent>
              </Card>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-green-800">
                        Revenue Prediction
                      </h3>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-700">
                        $
                        {(
                          (currentUser.totalSales || 0) * 1.23 +
                          Math.random() * 100
                        ).toFixed(2)}
                      </div>
                      <p className="text-sm text-green-600">
                        Projected next month revenue
                      </p>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, ((currentUser.totalSales || 0) / 1000) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-blue-800">
                        Engagement Score
                      </h3>
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-700">
                        {Math.min(
                          100,
                          Math.max(
                            1,
                            Math.round(
                              userProducts.reduce(
                                (sum, p) => sum + (p.views || 0),
                                0,
                              ) /
                                Math.max(userProducts.length, 1) /
                                10,
                            ),
                          ),
                        )}
                        %
                      </div>
                      <p className="text-sm text-blue-600">
                        Customer engagement rate
                      </p>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <
                              Math.floor(
                                userProducts.reduce(
                                  (sum, p) => sum + (p.views || 0),
                                  0,
                                ) /
                                  Math.max(userProducts.length, 1) /
                                  20,
                              )
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-purple-800">
                        AI Optimization
                      </h3>
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-purple-700">
                        {userProducts.length > 0 ? "87%" : "Ready"}
                      </div>
                      <p className="text-sm text-purple-600">
                        {userProducts.length > 0
                          ? "Performance optimized"
                          : "Start selling to see insights"}
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Optimize Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProducts.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                          Start Your Journey
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Upload your first product to receive personalized AI
                          insights
                        </p>
                        <Link to="/admin/product-upload">
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                            Upload First Product
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-600 rounded-full p-2">
                              <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-800">
                                Boost Your Views
                              </h4>
                              <p className="text-sm text-blue-700 mb-2">
                                Your average views:{" "}
                                {Math.round(
                                  userProducts.reduce(
                                    (sum, p) => sum + (p.views || 0),
                                    0,
                                  ) / userProducts.length || 0,
                                )}
                              </p>
                              <p className="text-xs text-blue-600">
                                Tip: Add more photos and detailed descriptions
                                to increase engagement
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-600 rounded-full p-2">
                              <Star className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-800">
                                Optimize Pricing
                              </h4>
                              <p className="text-sm text-green-700 mb-2">
                                {userProducts.length > 0 &&
                                userProducts[0].price
                                  ? `Suggested: $${(userProducts[0].price * 1.15).toFixed(2)}`
                                  : "Add pricing to see suggestions"}
                              </p>
                              <p className="text-xs text-green-600">
                                Market analysis suggests 15% price optimization
                                potential
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-600 rounded-full p-2">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-800">
                                Social Reach
                              </h4>
                              <p className="text-sm text-purple-700 mb-2">
                                Potential reach:{" "}
                                {Math.round(
                                  userProducts.reduce(
                                    (sum, p) => sum + (p.views || 0),
                                    0,
                                  ) * 2.3,
                                )}{" "}
                                users
                              </p>
                              <p className="text-xs text-purple-600">
                                Connect social media accounts to amplify your
                                reach
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <div className="flex items-start space-x-3">
                            <div className="bg-orange-600 rounded-full p-2">
                              <Crown className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-orange-800">
                                Membership Benefits
                              </h4>
                              <p className="text-sm text-orange-700 mb-2">
                                {currentUser.membershipLevel === "free"
                                  ? "Upgrade to unlock advanced AI features"
                                  : "Premium AI tools active"}
                              </p>
                              <p className="text-xs text-orange-600">
                                {currentUser.membershipLevel === "free"
                                  ? "Get personalized pricing, inventory management, and more"
                                  : "Advanced analytics and automation enabled"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Tools Quick Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    AI Tools & Commands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center justify-start p-4 h-auto"
                      onClick={() => setActiveTab("ai-dashboard")}
                    >
                      <div className="text-left">
                        <div className="font-semibold">AI Dashboard</div>
                        <div className="text-sm text-gray-500">
                          Full AI control center
                        </div>
                      </div>
                    </Button>

                    {currentUser.membershipLevel !== "free" && (
                      <Button
                        variant="outline"
                        className="flex items-center justify-start p-4 h-auto"
                        onClick={() => setActiveTab("custom-ai")}
                      >
                        <div className="text-left">
                          <div className="font-semibold">Custom AI</div>
                          <div className="text-sm text-gray-500">
                            Build personal AI assistants
                          </div>
                        </div>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="flex items-center justify-start p-4 h-auto"
                      onClick={() => setActiveTab("social")}
                    >
                      <div className="text-left">
                        <div className="font-semibold">Social AI</div>
                        <div className="text-sm text-gray-500">
                          Social media automation
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "custom-ai" &&
            currentUser.membershipLevel !== "free" && (
              <div className="space-y-6">
                {React.createElement(
                  React.lazy(() => import("../components/AIModuleBuilder")),
                  {
                    userId: currentUser.id,
                    membershipLevel: currentUser.membershipLevel || "free",
                    friends: [], // In production, load from friends list
                  },
                )}
              </div>
            )}

          {activeTab === "page-builder" &&
            currentUser.membershipLevel !== "free" && (
              <div className="space-y-6">
                {React.createElement(
                  React.lazy(() => import("../components/CustomPageBuilder")),
                  {
                    userId: currentUser.id,
                    membershipLevel: currentUser.membershipLevel || "free",
                  },
                )}
              </div>
            )}

          {/* Member-only feature notices */}
          {(activeTab === "custom-ai" || activeTab === "page-builder") &&
            currentUser.membershipLevel === "free" && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 max-w-md mx-auto">
                  <Crown className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {activeTab === "custom-ai"
                      ? "Custom AI Builder"
                      : "Page Builder"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === "custom-ai"
                      ? "Create personalized AI assistants to automate your account management, bidding, and social media promotion."
                      : "Build custom layouts with drag-and-drop product cards, categories, and interactive elements."}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Available for Member and Premium users
                  </p>
                  <Link to="/membership">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Access
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Admin Settings */}
              {(currentUser.email === "haynes.d1993@yahoo.com" ||
                currentUser.isAdmin) && (
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-800">
                      <Shield className="w-5 h-5 mr-2" />
                      Admin Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Link to="/admin/users">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-red-300 hover:bg-red-50"
                        >
                          <Users className="w-6 h-6 text-red-600" />
                          <span className="text-sm">Manage All Accounts</span>
                        </Button>
                      </Link>
                      <Link to="/admin/analytics">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-red-300 hover:bg-red-50"
                        >
                          <BarChart3 className="w-6 h-6 text-red-600" />
                          <span className="text-sm">System Analytics</span>
                        </Button>
                      </Link>
                      <Link to="/admin/monitoring">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-red-300 hover:bg-red-50"
                        >
                          <Activity className="w-6 h-6 text-red-600" />
                          <span className="text-sm">Live Monitoring</span>
                        </Button>
                      </Link>
                      <Link to="/admin/database">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-red-300 hover:bg-red-50"
                        >
                          <Settings className="w-6 h-6 text-red-600" />
                          <span className="text-sm">Database Settings</span>
                        </Button>
                      </Link>
                      <Link to="/admin/ai-content">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-red-300 hover:bg-red-50"
                        >
                          <Brain className="w-6 h-6 text-red-600" />
                          <span className="text-sm">AI Management</span>
                        </Button>
                      </Link>
                      <Link to="/admin/test-interface">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-red-300 hover:bg-red-50"
                        >
                          <Zap className="w-6 h-6 text-red-600" />
                          <span className="text-sm">Test Interface</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* General User Settings */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600">
                    <Settings className="w-5 h-5 mr-2" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mobile Simulation Mode */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">
                        Mobile Simulation Mode
                      </Label>
                      <p className="text-sm text-gray-600">
                        View site in mobile layout on desktop
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentMode =
                          localStorage.getItem("mobileSimulation") === "true";
                        localStorage.setItem(
                          "mobileSimulation",
                          (!currentMode).toString(),
                        );
                        if (!currentMode) {
                          document.body.classList.add("mobile-simulation");
                          alert(
                            "Mobile simulation mode enabled. Refresh to see changes.",
                          );
                        } else {
                          document.body.classList.remove("mobile-simulation");
                          alert(
                            "Mobile simulation mode disabled. Refresh to see changes.",
                          );
                        }
                      }}
                    >
                      {localStorage.getItem("mobileSimulation") === "true"
                        ? "Disable"
                        : "Enable"}
                    </Button>
                  </div>

                  {/* AI Suggestions */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">
                        AI Suggestions
                      </Label>
                      <p className="text-sm text-gray-600">
                        Get AI-powered recommendations
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentMode =
                          localStorage.getItem("aiSuggestions") !== "false";
                        localStorage.setItem(
                          "aiSuggestions",
                          (!currentMode).toString(),
                        );
                        alert(
                          `AI suggestions ${!currentMode ? "enabled" : "disabled"}`,
                        );
                      }}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      {localStorage.getItem("aiSuggestions") !== "false"
                        ? "Disable"
                        : "Enable"}
                    </Button>
                  </div>

                  {/* Product Visibility Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">
                        Product Visibility
                      </Label>
                      <p className="text-sm text-gray-600">
                        Show/hide your products on site
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentMode =
                          localStorage.getItem(
                            `productVisibility_${currentUser.id}`,
                          ) !== "false";
                        localStorage.setItem(
                          `productVisibility_${currentUser.id}`,
                          (!currentMode).toString(),
                        );
                        alert(
                          `Your products are now ${!currentMode ? "visible" : "hidden"}`,
                        );
                      }}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      {localStorage.getItem(
                        `productVisibility_${currentUser.id}`,
                      ) !== "false"
                        ? "Hide Products"
                        : "Show Products"}
                    </Button>
                  </div>

                  {/* Auto Cycle Products */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">
                        Auto Cycle Products
                      </Label>
                      <p className="text-sm text-gray-600">
                        Automatically cycle through products for quick resell
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentMode =
                          localStorage.getItem(
                            `autoCycle_${currentUser.id}`,
                          ) === "true";
                        localStorage.setItem(
                          `autoCycle_${currentUser.id}`,
                          (!currentMode).toString(),
                        );
                        if (!currentMode) {
                          alert(
                            "Auto cycle enabled. Products will cycle every 30 seconds.",
                          );
                        } else {
                          alert("Auto cycle disabled.");
                        }
                      }}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      {localStorage.getItem(`autoCycle_${currentUser.id}`) ===
                      "true"
                        ? "Stop Cycling"
                        : "Start Cycling"}
                    </Button>
                  </div>

                  {/* Quick Pay for Guest List Priority */}
                  {!currentUser.isAdmin && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Label className="text-base font-medium text-yellow-800">
                            Guest List Priority
                          </Label>
                          <p className="text-sm text-yellow-700">
                            Pay $1 to move up one spot in guest section
                          </p>
                        </div>
                        <Badge className="bg-yellow-200 text-yellow-800">
                          $1 per spot
                        </Badge>
                      </div>
                      <Button
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={() => {
                          if (
                            confirm(
                              "Pay $1 to move up one spot in the guest section?",
                            )
                          ) {
                            alert("Payment processed! You moved up one spot.");
                          }
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Quick Pay - Move Up One Spot
                      </Button>
                    </div>
                  )}

                  {/* Account Management */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">
                      Account Management
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to="/profile">
                        <Button variant="outline" className="w-full">
                          <User className="w-4 h-4 mr-2" />
                          Profile Settings
                        </Button>
                      </Link>
                      <Link to="/notifications">
                        <Button variant="outline" className="w-full">
                          <Bell className="w-4 h-4 mr-2" />
                          Notifications
                        </Button>
                      </Link>
                      <Link to="/membership">
                        <Button variant="outline" className="w-full">
                          <Crown className="w-4 h-4 mr-2" />
                          Membership
                        </Button>
                      </Link>
                      <Link to="/favorites">
                        <Button variant="outline" className="w-full">
                          <Heart className="w-4 h-4 mr-2" />
                          Favorites
                        </Button>
                      </Link>
                      <Link to="/live-community">
                        <Button variant="outline" className="w-full">
                          <Users className="w-4 h-4 mr-2" />
                          Live Community
                        </Button>
                      </Link>
                      <Link to="/settings">
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <BackToTop />
    </div>
  );
}

const ProtectedUserDashboard = () => {
  return (
    <AuthGuard>
      <UserDashboard />
    </AuthGuard>
  );
};

export default ProtectedUserDashboard;
