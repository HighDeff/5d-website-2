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
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Settings,
  Save,
  Edit,
  Eye,
  EyeOff,
  Bell,
  Lock,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload,
  DollarSign,
  Star,
  Award,
  Gift,
  Package,
  TrendingUp,
  Activity,
  Calendar,
  Globe,
  Smartphone,
  X,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/hooks/useUserAuth";
import AccountActivation from "../components/AccountActivation";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import MemberIcon from "../components/MemberIcon";
import AIChat from "../components/AIChat";
import BackToTop from "@/components/BackToTop";
import UserProductCategories from "@/components/UserProductCategories";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, updateUser, isSignedIn } = useUserAuth();
  const [activeTab, setActiveTab] = useState("activation");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paypalEmail: "",
    cashAppTag: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    password: "",
    confirmPassword: "",
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
    },
  });

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        paypalEmail: user.paymentInfo?.paypalEmail || "",
        cashAppTag: user.paymentInfo?.cashAppTag || "",
        cardNumber: user.paymentInfo?.cardNumber || "",
        expiryDate: user.paymentInfo?.expiryDate || "",
      }));
    }
  }, [user]);

  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      navigate("/auth");
    }
  }, [isSignedIn, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim()) {
        alert("Name and email are required fields.");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Validate passwords match if changing password
      if (formData.password && formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      // Update user data
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address:
          `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`.trim(),
        paymentInfo: {
          paypalEmail: formData.paypalEmail,
          cashAppTag: formData.cashAppTag,
          cardNumber: formData.cardNumber
            ? `**** **** **** ${formData.cardNumber.slice(-4)}`
            : "",
          expiryDate: formData.expiryDate,
        },
        preferences: {
          notifications: formData.notifications.email,
          marketing: formData.notifications.marketing,
          publicProfile: formData.privacy.profileVisible,
        },
      };

      await updateUser(updatedUser);
      setSaveSuccess(true);
      setIsEditing(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Error saving profile. Please try again.");
      console.error("Profile save error:", error);
    }
  };

  const tabs = [
    { id: "activation", label: "Account Status", icon: Activity },
    { id: "profile", label: "Profile", icon: User },
    { id: "categories", label: "Product Categories", icon: Package },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please sign in to access your profile
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
                <span className="text-purple-800 font-bold">User Profile</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/my-items">
                <Button variant="outline" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  My Items
                </Button>
              </Link>
              <Link to="/">
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
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-700 font-medium">
                Profile updated successfully!
              </p>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
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
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {user.name}
                      </h1>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <MemberIcon
                          membershipLevel={user.membershipLevel || "free"}
                          showLabel
                          size="md"
                        />
                        {user.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Link to={`/shop/${user.username}`}>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          <Store className="w-4 h-4 mr-2" />
                          Visit My Shop
                        </Button>
                      </Link>
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`w-full sm:w-auto ${
                          isEditing
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        } text-white`}
                      >
                        {isEditing ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${user.totalSales?.toFixed(2) || "0.00"}
                  </div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.salesCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Items Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.purchaseCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Purchases</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-yellow-600 ml-1">
                      {user.rating || "5.0"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
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
              {/* Account Activation Tab */}
              {activeTab === "activation" && <AccountActivation />}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Profile Picture
                    </h3>
                    <ProfilePictureUpload
                      currentImage={user.files?.profilePicture || user.avatar}
                      onUploadSuccess={(imageUrl) => {
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      }}
                      onUploadError={(error) => {
                        alert(`Upload failed: ${error}`);
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label>Email Address *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleInputChange("country", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Street Address</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label>State/Province</Label>
                      <Input
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <Label>ZIP/Postal Code</Label>
                      <Input
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Product Categories Tab */}
              {activeTab === "categories" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Your Product Categories
                    </h3>
                    <p className="text-gray-600 mb-6">
                      View and manage your products organized by category. Each
                      category shows your product count, views, and performance.
                    </p>
                  </div>

                  <UserProductCategories userId={user.id} />

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-800 mb-2">
                          Share Your Shop
                        </h4>
                        <p className="text-purple-700 text-sm mb-3">
                          Your shop showcases all your categories and products
                          in a beautiful storefront.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link to={`/shop/${user.username}`}>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                              <Store className="w-4 h-4 mr-2" />
                              Visit Your Shop
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="border-purple-300 text-purple-600 hover:bg-purple-50"
                            onClick={() => {
                              const shopUrl = `${window.location.origin}/shop/${user.username}`;
                              navigator.clipboard.writeText(shopUrl);
                              alert("Shop link copied to clipboard!");
                            }}
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Copy Shop Link
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Payment Methods
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="font-semibold text-gray-800 mb-2">
                              PayPal Account
                            </h4>
                            <Input
                              type="email"
                              value={formData.paypalEmail}
                              onChange={(e) =>
                                handleInputChange("paypalEmail", e.target.value)
                              }
                              disabled={!isEditing}
                              placeholder="paypal@example.com"
                              className="mb-4"
                            />
                            <Badge
                              className={
                                formData.paypalEmail
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }
                            >
                              {formData.paypalEmail ? "Connected" : "Not Set"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="font-semibold text-gray-800 mb-2">
                              CashApp
                            </h4>
                            <Input
                              value={formData.cashAppTag}
                              onChange={(e) =>
                                handleInputChange("cashAppTag", e.target.value)
                              }
                              disabled={!isEditing}
                              placeholder="$YourCashTag"
                              className="mb-4"
                            />
                            <Badge
                              className={
                                formData.cashAppTag
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }
                            >
                              {formData.cashAppTag ? "Connected" : "Not Set"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Credit/Debit Card
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Card Number</Label>
                        <Input
                          value={formData.cardNumber}
                          onChange={(e) =>
                            handleInputChange("cardNumber", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="1234 5678 9012 3456"
                          type="text"
                        />
                      </div>
                      <div>
                        <Label>Expiry Date</Label>
                        <Input
                          value={formData.expiryDate}
                          onChange={(e) =>
                            handleInputChange("expiryDate", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="MM/YY"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Payment Info
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>New Password</Label>
                        <div className="relative mt-1">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            disabled={!isEditing}
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Confirm Password</Label>
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-gray-600">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Login Alerts
                          </h4>
                          <p className="text-sm text-gray-600">
                            Get notified when someone logs into your account
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isEditing && formData.password && (
                    <div className="flex space-x-4 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData((prev) => ({
                            ...prev,
                            password: "",
                            confirmPassword: "",
                          }));
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Email Notifications
                          </h4>
                          <p className="text-sm text-gray-600">
                            Receive notifications via email
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications.email}
                          onChange={(e) =>
                            handleNestedChange(
                              "notifications",
                              "email",
                              e.target.checked,
                            )
                          }
                          disabled={!isEditing}
                          className="toggle"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            SMS Notifications
                          </h4>
                          <p className="text-sm text-gray-600">
                            Receive notifications via SMS
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications.sms}
                          onChange={(e) =>
                            handleNestedChange(
                              "notifications",
                              "sms",
                              e.target.checked,
                            )
                          }
                          disabled={!isEditing}
                          className="toggle"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Push Notifications
                          </h4>
                          <p className="text-sm text-gray-600">
                            Receive push notifications in your browser
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications.push}
                          onChange={(e) =>
                            handleNestedChange(
                              "notifications",
                              "push",
                              e.target.checked,
                            )
                          }
                          disabled={!isEditing}
                          className="toggle"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Marketing Emails
                          </h4>
                          <p className="text-sm text-gray-600">
                            Receive promotional emails and offers
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications.marketing}
                          onChange={(e) =>
                            handleNestedChange(
                              "notifications",
                              "marketing",
                              e.target.checked,
                            )
                          }
                          disabled={!isEditing}
                          className="toggle"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Privacy Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Public Profile
                          </h4>
                          <p className="text-sm text-gray-600">
                            Make your profile visible to other users
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.privacy.profileVisible}
                          onChange={(e) =>
                            handleNestedChange(
                              "privacy",
                              "profileVisible",
                              e.target.checked,
                            )
                          }
                          disabled={!isEditing}
                          className="toggle"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Show Email
                          </h4>
                          <p className="text-sm text-gray-600">
                            Display your email address on your public profile
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.privacy.showEmail}
                          onChange={(e) =>
                            handleNestedChange(
                              "privacy",
                              "showEmail",
                              e.target.checked,
                            )
                          }
                          disabled={!isEditing}
                          className="toggle"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Allow Offers
                          </h4>
                          <p className="text-sm text-gray-600">
                            Allow other users to send you offers on your items
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.privacy.allowOffers}
                          onChange={(e) =>
                            handleNestedChange(
                              "privacy",
                              "allowOffers",
                              e.target.checked,
                            )
                          }
                          disabled={!isEditing}
                          className="toggle"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Data Management
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Download Data
                          </h4>
                          <p className="text-sm text-gray-600">
                            Download a copy of all your data
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Request
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <h4 className="font-medium text-red-800">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-600">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Privacy Settings
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BackToTop />
      <AIChat position="bottom-right" />
    </div>
  );
}
