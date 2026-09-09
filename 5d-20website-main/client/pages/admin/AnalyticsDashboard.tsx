// Analytics Dashboard - Comprehensive analytics for users, admins, and site performance
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Crown,
  Shield,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  RefreshCw,
  Target,
  Award,
  Star,
  Heart,
  ShoppingBag,
  Calendar,
  ArrowLeft,
  ArrowRight,
  PieChart,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "@/hooks/useUserAuth";
import AnalyticsService from "@/services/AnalyticsService";
import TaxManagementService from "@/services/TaxManagementService";
import SocialFeaturesService from "@/services/SocialFeaturesService";
import UserAnalyticsTab from "@/components/admin/UserAnalyticsTab";

const AnalyticsDashboard: React.FC = () => {
  const { user, isSignedIn } = useUserAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [siteAnalytics, setSiteAnalytics] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [searchAnalytics, setSearchAnalytics] = useState<any>(null);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [selectedMemberType, setSelectedMemberType] = useState<
    "all" | "members" | "guests"
  >("all");
  const [profitHidden, setProfitHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30days");

  useEffect(() => {
    loadAnalytics();
  }, [user?.id, selectedMemberType]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load site analytics
      const siteData = AnalyticsService.getSiteAnalytics();
      setSiteAnalytics(siteData);

      // Load user analytics if user is signed in
      if (user?.id) {
        const userData = AnalyticsService.getUserAnalytics(user.id);
        setUserAnalytics(userData);
      }

      // Load search analytics
      const searchData = AnalyticsService.getSearchAnalytics();
      setSearchAnalytics(searchData);

      // Load best sellers
      const sellers = AnalyticsService.getBestSellers(selectedMemberType, 20);
      setBestSellers(sellers);

      // Check profit visibility
      setProfitHidden(AnalyticsService.isProfitHidden());
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProfitVisibility = () => {
    const newState = !profitHidden;
    AnalyticsService.toggleProfitVisibility(newState);
    setProfitHidden(newState);
    loadAnalytics(); // Refresh data
  };

  const exportAnalytics = () => {
    const exportData = {
      siteAnalytics,
      userAnalytics,
      searchAnalytics,
      bestSellers,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.name || "Anonymous",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={user?.membershipLevel === "premium" ? "/admin" : "/"}>
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  <span>Analytics Dashboard</span>
                </h1>
                <p className="text-gray-600">
                  Comprehensive insights and performance metrics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={exportAnalytics}
                variant="outline"
                size="sm"
                disabled={!siteAnalytics}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={loadAnalytics} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {user?.membershipLevel === "premium" && (
                <Button
                  onClick={toggleProfitVisibility}
                  variant="outline"
                  size="sm"
                  className={profitHidden ? "bg-gray-100 text-gray-600" : ""}
                >
                  {profitHidden ? (
                    <EyeOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {profitHidden ? "Show" : "Hide"} Profits
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "sales", label: "Sales", icon: DollarSign },
              { id: "products", label: "Products", icon: Package },
              { id: "users", label: "Users", icon: Users },
              { id: "useranalytics", label: "User Analytics", icon: Users },
              { id: "search", label: "Search", icon: Search },
              { id: "social", label: "Social", icon: Heart },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && siteAnalytics && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Users
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {siteAnalytics.totalUsers}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-gray-500">
                      {siteAnalytics.memberAnalytics.members} members
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Products
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {siteAnalytics.totalProducts}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Sales
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {siteAnalytics.totalSales}
                      </p>
                    </div>
                    <ShoppingBag className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Revenue
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        ${siteAnalytics.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profit Information */}
            {!profitHidden && user?.membershipLevel === "premium" && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <TrendingUp className="w-5 h-5" />
                    <span>Site Profit Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        $
                        {siteAnalytics.profitBreakdown.commissionEarned.toFixed(
                          2,
                        )}
                      </div>
                      <div className="text-sm text-green-700">
                        Commission Earned
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        $
                        {siteAnalytics.profitBreakdown.taxesCollected.toFixed(
                          2,
                        )}
                      </div>
                      <div className="text-sm text-blue-700">
                        Taxes Collected
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ${siteAnalytics.profitBreakdown.netProfit.toFixed(2)}
                      </div>
                      <div className="text-sm text-purple-700">Net Profit</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Member Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Member Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {siteAnalytics.memberAnalytics.premiumMembers}
                    </div>
                    <div className="text-sm text-yellow-700 flex items-center justify-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Premium Members
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {siteAnalytics.memberAnalytics.members}
                    </div>
                    <div className="text-sm text-blue-700 flex items-center justify-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Regular Members
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {siteAnalytics.memberAnalytics.guests}
                    </div>
                    <div className="text-sm text-gray-700">Guest Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Best Sellers Tab */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Best Sellers</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMemberType}
                  onChange={(e) =>
                    setSelectedMemberType(
                      e.target.value as "all" | "members" | "guests",
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Users</option>
                  <option value="members">Members Only</option>
                  <option value="guests">Guests Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSellers.map((item, index) => (
                <Card key={item.productId} className="relative">
                  {index < 3 && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : "bg-amber-600 text-white"
                        }
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          item.product?.images?.[0] ||
                          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop"
                        }
                        alt={item.product?.name || "Product"}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 line-clamp-2">
                          {item.product?.name || "Unknown Product"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {item.seller?.name || "Unknown Seller"}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-lg font-bold text-green-600">
                            ${item.revenue.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.salesCount} sales
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* User Analytics Tab */}
        {activeTab === "users" && userAnalytics && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Your Performance ({user?.name})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Your Products
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {userAnalytics.totalProducts}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Sales
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {userAnalytics.totalSales}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Revenue
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        ${userAnalytics.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Profit
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        ${userAnalytics.profits.toFixed(2)}
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Your Product Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userAnalytics.categoryBreakdown.map((cat: any) => (
                    <div
                      key={cat.category}
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-purple-600">
                        {cat.count}
                      </div>
                      <div className="text-sm text-gray-700">
                        {cat.category}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Analytics Tab */}
        {activeTab === "search" && searchAnalytics && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Search Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Search Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchAnalytics.topSearchTerms
                      .slice(0, 10)
                      .map((term: string, index: number) => (
                        <div
                          key={term}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm font-medium">
                            #{index + 1} {term}
                          </span>
                          <Search className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchAnalytics.popularCategories.map(
                      (category: string, index: number) => (
                        <div
                          key={category}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm font-medium">
                            #{index + 1} {category}
                          </span>
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* User Analytics Tab */}
        {activeTab === "useranalytics" && <UserAnalyticsTab />}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
