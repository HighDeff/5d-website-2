import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Shield,
  Star,
  Eye,
  Heart,
  ShoppingCart,
  Mail,
  Phone,
  Calendar,
  Activity,
} from "lucide-react";
import { useUserAuth, User, Sale } from "@/hooks/useUserAuth";
import AIDataMonitoringService from "@/services/AIDataMonitoringService";

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  topSellers: User[];
  topBuyers: User[];
  suspiciousAccounts: User[];
  userGrowth: { month: string; count: number }[];
  membershipDistribution: { level: string; count: number }[];
  userActivities: {
    userId: string;
    username: string;
    activity: string;
    timestamp: string;
    type: "sale" | "purchase" | "login" | "signup" | "product_upload";
  }[];
}

function UserAnalyticsTab() {
  const { allUsers, allSales, allProducts } = useUserAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "suspicious" | "top_sellers" | "new_users"
  >("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [aiMonitoring, setAiMonitoring] = useState<any>(null);

  useEffect(() => {
    generateAnalytics();
    loadAIMonitoring();
  }, [allUsers, allSales, allProducts]);

  const generateAnalytics = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate user metrics
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((user) => {
      const lastActive = new Date(user.lastActive);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return lastActive > sevenDaysAgo;
    }).length;

    const newUsersThisMonth = allUsers.filter((user) => {
      const joinDate = new Date(user.joinDate);
      return joinDate > oneMonthAgo;
    }).length;

    // Top sellers by total sales
    const topSellers = [...allUsers]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);

    // Top buyers by total purchases
    const topBuyers = [...allUsers]
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, 10);

    // Suspicious accounts (high sales in short time, etc.)
    const suspiciousAccounts = allUsers.filter((user) => {
      const userSales = allSales.filter((sale) => sale.sellerId === user.id);
      const recentSales = userSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return saleDate > dayAgo;
      });
      return recentSales.length > 10 || user.totalSales > 10000;
    });

    // User growth by month
    const userGrowth = generateUserGrowthData();

    // Membership distribution
    const membershipDistribution = [
      {
        level: "Free",
        count: allUsers.filter((u) => u.membershipLevel === "free").length,
      },
      {
        level: "Member",
        count: allUsers.filter((u) => u.membershipLevel === "member").length,
      },
      {
        level: "Premium",
        count: allUsers.filter((u) => u.membershipLevel === "premium").length,
      },
    ];

    // Recent user activities
    const userActivities = generateUserActivities();

    setAnalytics({
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      topSellers,
      topBuyers,
      suspiciousAccounts,
      userGrowth,
      membershipDistribution,
      userActivities,
    });
  };

  const generateUserGrowthData = () => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = allUsers.filter((user) => {
        const joinDate = new Date(user.joinDate);
        return joinDate >= date && joinDate <= monthEnd;
      }).length;

      months.push({
        month: date.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        }),
        count,
      });
    }

    return months;
  };

  const generateUserActivities = () => {
    const activities: any[] = [];

    // Recent sales
    allSales
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20)
      .forEach((sale) => {
        const seller = allUsers.find((u) => u.id === sale.sellerId);
        const buyer = allUsers.find((u) => u.id === sale.buyerId);

        if (seller) {
          activities.push({
            userId: seller.id,
            username: seller.username,
            activity: `Sold ${sale.productName} for $${sale.amount}`,
            timestamp: sale.date,
            type: "sale" as const,
          });
        }

        if (buyer) {
          activities.push({
            userId: buyer.id,
            username: buyer.username,
            activity: `Purchased ${sale.productName} for $${sale.amount}`,
            timestamp: sale.date,
            type: "purchase" as const,
          });
        }
      });

    // Recent signups
    allUsers
      .sort(
        (a, b) =>
          new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime(),
      )
      .slice(0, 10)
      .forEach((user) => {
        activities.push({
          userId: user.id,
          username: user.username,
          activity: `Joined the platform`,
          timestamp: user.joinDate,
          type: "signup" as const,
        });
      });

    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 50);
  };

  const loadAIMonitoring = async () => {
    const monitoring = AIDataMonitoringService.getMonitoringAnalytics();
    setAiMonitoring(monitoring);
  };

  const getFilteredUsers = () => {
    if (!analytics) return [];

    let users = allUsers;

    switch (selectedFilter) {
      case "active":
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        users = users.filter(
          (user) => new Date(user.lastActive) > sevenDaysAgo,
        );
        break;
      case "suspicious":
        users = analytics.suspiciousAccounts;
        break;
      case "top_sellers":
        users = analytics.topSellers;
        break;
      case "new_users":
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        users = users.filter((user) => new Date(user.joinDate) > oneMonthAgo);
        break;
    }

    if (searchQuery) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return users;
  };

  const exportUserData = () => {
    const data = getFilteredUsers().map((user) => ({
      Name: user.name,
      Email: user.email,
      Username: user.username,
      Membership: user.membershipLevel,
      "Total Sales": user.totalSales,
      "Total Purchases": user.totalPurchases,
      "Join Date": new Date(user.joinDate).toLocaleDateString(),
      "Last Active": new Date(user.lastActive).toLocaleDateString(),
      Status: user.status,
      Verified: user.verified ? "Yes" : "No",
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_analytics_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getUserStatusBadge = (user: User) => {
    if (user.status === "suspended") {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    if (user.status === "banned") {
      return <Badge variant="destructive">Banned</Badge>;
    }
    if (!user.verified) {
      return <Badge variant="secondary">Unverified</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getMembershipBadge = (level: string) => {
    const colors = {
      free: "bg-gray-100 text-gray-800",
      member: "bg-blue-100 text-blue-800",
      premium: "bg-purple-100 text-purple-800",
    };
    return (
      <Badge className={colors[level as keyof typeof colors]}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading user analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {analytics.activeUsers}
                </p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Users</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics.newUsersThisMonth}
                </p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Suspicious Accounts
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {analytics.suspiciousAccounts.length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Monitoring Status */}
      {aiMonitoring && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              AI Monitoring Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {aiMonitoring.totalEvents}
                </p>
                <p className="text-sm text-gray-600">Total Events Monitored</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {aiMonitoring.anomaliesDetected}
                </p>
                <p className="text-sm text-gray-600">Anomalies Detected</p>
              </div>
              <div className="text-center">
                <Badge
                  className={
                    aiMonitoring.systemHealth === "healthy"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {aiMonitoring.systemHealth === "healthy"
                    ? "System Healthy"
                    : "Attention Required"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="new_users">New Users</option>
                <option value="top_sellers">Top Sellers</option>
                <option value="suspicious">Suspicious</option>
              </select>
              <Button onClick={exportUserData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredUsers().map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar || user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      {getUserStatusBadge(user)}
                      {getMembershipBadge(user.membershipLevel)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />@{user.username}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-green-600">
                        ${user.totalSales.toFixed(2)}
                      </p>
                      <p className="text-gray-500">Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-blue-600">
                        {user.productCount}
                      </p>
                      <p className="text-gray-500">Products</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-purple-600">
                        {user.rating.toFixed(1)}
                      </p>
                      <p className="text-gray-500">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">User Details</h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedUser.avatar || selectedUser.profileImage}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-600">@{selectedUser.username}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getUserStatusBadge(selectedUser)}
                    {getMembershipBadge(selectedUser.membershipLevel)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-gray-900">
                    {selectedUser.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Member Since
                  </p>
                  <p className="text-gray-900">
                    {new Date(selectedUser.memberSince).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Last Active
                  </p>
                  <p className="text-gray-900">
                    {new Date(selectedUser.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 mx-auto text-green-500 mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedUser.totalSales.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Total Sales</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Package className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedUser.productCount}
                    </p>
                    <p className="text-sm text-gray-600">Products Listed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">
                      {selectedUser.rating.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">User Rating</p>
                  </CardContent>
                </Card>
              </div>

              {selectedUser.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Bio</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedUser.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAnalyticsTab;
