// User Settings Page
// Comprehensive user settings with analytics and account management

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Settings,
  Bell,
  Shield,
  CreditCard,
  Eye,
  EyeOff,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Crown,
  TrendingUp,
  DollarSign,
  Package,
  Heart,
  Star,
  Users,
  Activity,
  BarChart3,
  Download,
  Upload,
  Trash2,
  Lock,
  Unlock,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import UserDataService from "../services/UserDataService";
import LiveAIMonitoringService from "../services/LiveAIMonitoringService";

const UserSettings: React.FC = () => {
  const { user, updateUser, allProducts, allSales } = useUserAuth();
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "account"
    | "privacy"
    | "notifications"
    | "analytics"
    | "preferences"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paypalEmail: "",
    cashAppTag: "",
  });
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      allowOffers: true,
      dataTracking: true,
    },
    display: {
      theme: "light",
      language: "en",
      currency: "USD",
      timezone: "auto",
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      soundEffects: true,
    },
  });
  const [analytics, setAnalytics] = useState<any>({});
  const [userMetrics, setUserMetrics] = useState<any>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        paypalEmail: user.paymentInfo?.paypalEmail || "",
        cashAppTag: user.paymentInfo?.cashAppTag || "",
      });

      // Load user preferences
      if (user.preferences) {
        setPreferences({ ...preferences, ...user.preferences });
      }

      // Generate analytics
      generateUserAnalytics();
    }
  }, [user]);

  const generateUserAnalytics = () => {
    if (!user) return;

    // Get user's products and sales
    const userProducts = allProducts.filter((p) => p.sellerId === user.id);
    const userSales = allSales.filter((s) => s.sellerId === user.id);

    // Calculate metrics
    const totalViews = userProducts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = userProducts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const avgPrice =
      userProducts.reduce((sum, p) => sum + (p.price || 0), 0) /
      userProducts.length;

    // Monthly sales data (mock data for visualization)
    const monthlySales = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      sales: Math.floor(Math.random() * 1000) + 100,
      revenue: Math.floor(Math.random() * 5000) + 500,
    }));

    // Category breakdown
    const categoryBreakdown = userProducts.reduce((acc, product) => {
      const category = product.category || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as any);

    setAnalytics({
      totalProducts: userProducts.length,
      totalSales: userSales.length,
      totalRevenue: userSales.reduce((sum, s) => sum + (s.amount || 0), 0),
      totalViews,
      totalLikes,
      avgPrice: avgPrice || 0,
      monthlySales,
      categoryBreakdown,
      conversionRate:
        userProducts.length > 0
          ? (userSales.length / userProducts.length) * 100
          : 0,
    });

    // Live monitoring metrics
    if (LiveAIMonitoringService.isActive()) {
      const liveMetrics = LiveAIMonitoringService.getMetrics();
      const recentEvents = LiveAIMonitoringService.getRecentEvents(100);

      setUserMetrics({
        ...liveMetrics,
        userEvents: recentEvents.filter((e) => e.userId === user.id).length,
        lastActivity: new Date().toISOString(),
        sessionScore: 100 - (liveMetrics.errorsCount || 0) * 10,
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedUser = {
        ...user,
        ...formData,
        preferences,
        paymentInfo: {
          ...user.paymentInfo,
          paypalEmail: formData.paypalEmail,
          cashAppTag: formData.cashAppTag,
        },
      };

      await updateUser(updatedUser);

      // Save to UserDataService for persistence
      await UserDataService.saveUserData(user.id, "profile", updatedUser);
      await UserDataService.saveUserData(user.id, "preferences", preferences);

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const exportUserData = () => {
    const exportData = {
      user: formData,
      preferences,
      analytics,
      userMetrics,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-data-${user?.name?.replace(/\s+/g, "-")}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-4">
              You need to be signed in to access your settings.
            </p>
            <Link to="/auth">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-purple-600" />
                  User Settings
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your account, preferences, and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                {user.membershipLevel || "free"}
              </Badge>
              {isEditing && (
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: "profile", label: "Profile", icon: User },
                    { id: "account", label: "Account", icon: Shield },
                    { id: "privacy", label: "Privacy", icon: Lock },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "analytics", label: "Analytics", icon: BarChart3 },
                    { id: "preferences", label: "Preferences", icon: Settings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Profile Information</span>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          <EyeOff className="w-4 h-4 mr-2" />
                        ) : (
                          <Eye className="w-4 h-4 mr-2" />
                        )}
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <img
                          src={
                            user.avatar ||
                            `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face`
                          }
                          alt={user.name}
                          className="w-24 h-24 rounded-full border-4 border-gray-200"
                        />
                        {isEditing && (
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            {user.verified ? "Verified" : "Unverified"}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            Member since{" "}
                            {new Date(
                              user.joinDate || Date.now(),
                            ).getFullYear()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Package className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Total Products
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {analytics.totalProducts || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${analytics.totalRevenue?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-8 h-8 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Conversion Rate
                          </p>
                          <p className="text-2xl font-bold text-purple-600">
                            {analytics.conversionRate?.toFixed(1) || "0.0"}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-8 h-8 text-orange-500" />
                        <div>
                          <p className="text-sm text-gray-600">Total Views</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {analytics.totalViews || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Live Metrics */}
                {LiveAIMonitoringService.isActive() && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Monitor className="w-5 h-5 mr-2" />
                        Live Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Session Score</p>
                          <p className="text-3xl font-bold text-green-600">
                            {userMetrics.sessionScore || 100}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">User Events</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {userMetrics.userEvents || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Errors</p>
                          <p className="text-3xl font-bold text-red-600">
                            {userMetrics.errorsCount || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analytics.categoryBreakdown || {}).map(
                        ([category, count]: [string, any]) => (
                          <div
                            key={category}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium">{category}</span>
                            <div className="flex items-center space-x-3">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{
                                    width: `${(count / analytics.totalProducts) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {count}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Export Data */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={exportUserData} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="paypalEmail">PayPal Email</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={formData.paypalEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paypalEmail: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        placeholder="your-paypal@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cashAppTag">CashApp Tag</Label>
                      <Input
                        id="cashAppTag"
                        value={formData.cashAppTag}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cashAppTag: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        placeholder="$YourCashAppTag"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Two-Factor Authentication
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-gray-600">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <Switch
                        checked={preferences.privacy.profileVisible}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            privacy: {
                              ...preferences.privacy,
                              profileVisible: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Email</Label>
                        <p className="text-sm text-gray-600">
                          Display your email on your public profile
                        </p>
                      </div>
                      <Switch
                        checked={preferences.privacy.showEmail}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            privacy: {
                              ...preferences.privacy,
                              showEmail: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Tracking</Label>
                        <p className="text-sm text-gray-600">
                          Allow AI monitoring for improved experience
                        </p>
                      </div>
                      <Switch
                        checked={preferences.privacy.dataTracking}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            privacy: {
                              ...preferences.privacy,
                              dataTracking: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={preferences.notifications.email}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              email: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive push notifications in browser
                        </p>
                      </div>
                      <Switch
                        checked={preferences.notifications.push}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              push: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Marketing Communications</Label>
                        <p className="text-sm text-gray-600">
                          Receive marketing emails and promotions
                        </p>
                      </div>
                      <Switch
                        checked={preferences.notifications.marketing}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              marketing: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Theme</Label>
                      <Select
                        value={preferences.display.theme}
                        onValueChange={(value) =>
                          setPreferences({
                            ...preferences,
                            display: { ...preferences.display, theme: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Language</Label>
                      <Select
                        value={preferences.display.language}
                        onValueChange={(value) =>
                          setPreferences({
                            ...preferences,
                            display: {
                              ...preferences.display,
                              language: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sound Effects</Label>
                        <p className="text-sm text-gray-600">
                          Play sounds for notifications and interactions
                        </p>
                      </div>
                      <Switch
                        checked={preferences.accessibility.soundEffects}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            accessibility: {
                              ...preferences.accessibility,
                              soundEffects: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
