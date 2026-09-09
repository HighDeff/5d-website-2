import { useState, useEffect } from "react";
// Navigation updated 2024-01-20
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
  Upload,
  TrendingUp,
  Users,
  User,
  DollarSign,
  Package,
  Eye,
  Heart,
  Star,
  Crown,
  Zap,
  Shield,
  Gift,
  Target,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Share2,
  Bell,
  Settings,
  Download,
  RefreshCw,
  Smartphone,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  Send,
  MessageSquare,
  LogIn,
  UserPlus,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { useUserAuth } from "@/hooks/useUserAuth";
import SignupModal from "@/components/SignupModal";
import BackToTop from "@/components/BackToTop";

interface Member {
  id: string;
  name: string;
  email: string;
  tier: "basic" | "premium" | "enterprise";
  joinDate: string;
  totalSales: number;
  totalProducts: number;
  followers: number;
  rating: number;
  avatar: string;
}

interface SalesData {
  id: string;
  productName: string;
  customerName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "shipped";
}

interface Customer {
  id: string;
  name: string;
  email: string;
  totalPurchases: number;
  lastPurchase: string;
  favoriteCategories: string[];
  viewedItems: string[];
  purchasedItems: string[];
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  products: {
    outgoing: number;
    pending: number;
    alternate: number;
  };
  rating: number;
  lastContact: string;
  status: "active" | "inactive" | "pending";
}

export default function Membership() {
  const { isSignedIn } = useUserAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [refreshData, setRefreshData] = useState(0);
  const [activityFilter, setActivityFilter] = useState("all");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Real-time data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshData((prev) => prev + 1);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Sales data - declare first since it's used in other calculations
  const salesData: SalesData[] = [
    {
      id: "1",
      productName: "Diamond Ring",
      customerName: "Emily Chen",
      amount: 299.99,
      date: "2024-01-20",
      status: "completed",
    },
    {
      id: "2",
      productName: "Silk Dress",
      customerName: "Maria Garcia",
      amount: 89.99,
      date: "2024-01-19",
      status: "shipped",
    },
    {
      id: "3",
      productName: "Leather Bag",
      customerName: "Jessica Smith",
      amount: 159.99,
      date: "2024-01-18",
      status: "pending",
    },
    {
      id: "4",
      productName: "Pearl Necklace",
      customerName: "Anna Wilson",
      amount: 199.99,
      date: "2024-01-17",
      status: "completed",
    },
    {
      id: "5",
      productName: "Designer Watch",
      customerName: "Lisa Brown",
      amount: 449.99,
      date: "2024-01-16",
      status: "completed",
    },
  ];

  // Dynamic data that updates with sales
  const getCurrentMonthSales = () => {
    const currentMonth = new Date().getMonth();
    return salesData
      .filter((sale) => new Date(sale.date).getMonth() === currentMonth)
      .reduce((sum, sale) => sum + sale.amount, 0);
  };

  const memberData: Member = {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    tier: "premium",
    joinDate: "2024-01-15",
    totalSales:
      salesData.reduce((sum, sale) => sum + sale.amount, 0) +
      refreshData * 127.5,
    totalProducts: 87 + Math.floor(refreshData / 2),
    followers: 1250 + refreshData * 3,
    rating: 4.8,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
  };

  const customers: Customer[] = [
    {
      id: "1",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      totalPurchases: 5,
      lastPurchase: "2024-01-20",
      favoriteCategories: ["Jewelry", "Accessories"],
      viewedItems: ["Diamond Ring", "Pearl Necklace", "Gold Bracelet"],
      purchasedItems: ["Diamond Ring", "Silver Earrings"],
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      totalPurchases: 3,
      lastPurchase: "2024-01-19",
      favoriteCategories: ["Clothing", "Beauty"],
      viewedItems: ["Silk Dress", "Evening Gown", "Lipstick Set"],
      purchasedItems: ["Silk Dress", "Foundation"],
    },
    {
      id: "3",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      totalPurchases: 8,
      lastPurchase: "2024-01-22",
      favoriteCategories: ["Home & Kitchen", "Beauty"],
      viewedItems: ["Ceramic Vase", "Kitchen Set", "Makeup Palette"],
      purchasedItems: ["Ceramic Vase", "Kitchen Set", "Lipstick", "Face Mask"],
    },
    {
      id: "4",
      name: "Jessica Park",
      email: "jessica.park@example.com",
      totalPurchases: 12,
      lastPurchase: "2024-01-21",
      favoriteCategories: ["Jewelry", "Clothing"],
      viewedItems: ["Gold Necklace", "Designer Dress", "Handbag"],
      purchasedItems: [
        "Gold Necklace",
        "Designer Dress",
        "Sunglasses",
        "Scarf",
      ],
    },
    {
      id: "5",
      name: "Amanda Liu",
      email: "amanda.liu@example.com",
      totalPurchases: 6,
      lastPurchase: "2024-01-18",
      favoriteCategories: ["Shoes", "Accessories"],
      viewedItems: ["High Heels", "Sneakers", "Leather Belt"],
      purchasedItems: ["High Heels", "Leather Belt", "Watch"],
    },
    {
      id: "6",
      name: "Rachel Davis",
      email: "rachel.davis@example.com",
      totalPurchases: 4,
      lastPurchase: "2024-01-17",
      favoriteCategories: ["Beauty", "Home & Kitchen"],
      viewedItems: ["Skincare Set", "Candles", "Bath Bombs"],
      purchasedItems: ["Skincare Set", "Candles"],
    },
  ];

  const suppliers: Supplier[] = [
    {
      id: "1",
      name: "Luxury Gems Co.",
      category: "Jewelry",
      products: { outgoing: 15, pending: 8, alternate: 3 },
      rating: 4.8,
      lastContact: "2024-01-18",
      status: "active",
    },
    {
      id: "2",
      name: "Fashion Forward Ltd.",
      category: "Clothing",
      products: { outgoing: 22, pending: 12, alternate: 7 },
      rating: 4.6,
      lastContact: "2024-01-17",
      status: "active",
    },
  ];

  const socialPlatforms = [
    {
      name: "Instagram",
      icon: Instagram,
      followers: "12.5K",
      color: "text-pink-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      followers: "8.3K",
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      followers: "5.2K",
      color: "text-blue-400",
    },
    {
      name: "YouTube",
      icon: Youtube,
      followers: "2.1K",
      color: "text-red-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      followers: "1.8K",
      color: "text-blue-700",
    },
  ];

  const membershipTiers = [
    {
      name: "Basic",
      price: "Free",
      color: "from-gray-500 to-gray-600",
      features: ["10 Products", "Basic Analytics", "Community Support"],
      popular: false,
    },
    {
      name: "Premium",
      price: "$29/month",
      color: "from-purple-500 to-pink-500",
      features: [
        "100 Products",
        "Advanced Analytics",
        "Priority Support",
        "Custom Branding",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99/month",
      color: "from-blue-500 to-indigo-500",
      features: [
        "Unlimited Products",
        "Full Analytics Suite",
        "Dedicated Support",
        "API Access",
      ],
      popular: false,
    },
  ];

  // Functions for quick actions
  const handleViewAnalytics = () => {
    setActiveTab("sales");
  };

  const handleSendOffers = () => {
    window.location.href = "/send-offers";
  };

  const handleNotifications = () => {
    window.location.href = "/notifications";
  };

  const handleViewUsers = () => {
    // Switch to customers tab to view users
    setActiveTab("customers");
  };

  const handleManageOffers = () => {
    // Navigate to offers management page
    window.location.href = "/send-offers";
  };

  const handleMessageCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowMessaging(true);
  };

  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowProfileModal(true);
  };

  const handleSendOffer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowOfferModal(true);
  };

  const sendMessage = (message: string) => {
    console.log(`Sending message to ${selectedCustomer?.name}: ${message}`);
    alert(`Message sent to ${selectedCustomer?.name}: "${message}"`);
    setShowMessaging(false);
  };

  const sendOffer = (offerData: any) => {
    console.log(`Sending offer to ${selectedCustomer?.name}:`, offerData);
    alert(`Offer sent to ${selectedCustomer?.name}!`);
    setShowOfferModal(false);
  };

  const handleSellItemsClick = () => {
    if (!isSignedIn) {
      setShowSignupModal(true);
    } else {
      window.location.href = "/my-items";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredSales = salesData.filter(
    (sale) =>
      sale.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "customers", label: "Customers", icon: Users },
    { id: "suppliers", label: "Suppliers", icon: Package },
    { id: "social", label: "Social", icon: Share2 },
    { id: "plans", label: "Plans", icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="fixed inset-0 opacity-5 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-12">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    L
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                  LILLY'S
                </h1>
              </Link>

              <div className="hidden lg:flex items-center space-x-8">
                <Link
                  to="/collections"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Collections
                </Link>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center space-x-1">
                    <span>Shop</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to="/shop/jewelry"
                      className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      💍 Jewelry
                    </Link>
                    <Link
                      to="/shop/clothing"
                      className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      👗 Clothing
                    </Link>
                    <Link
                      to="/shop/beauty"
                      className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      💄 Beauty
                    </Link>
                    <Link
                      to="/shop/shoes-accessories"
                      className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      👜 Accessories
                    </Link>
                  </div>
                </div>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/mobile-app"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center"
                >
                  📱 Mobile App
                </Link>
                <span className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">
                  👑 Membership
                </span>
                <Button
                  onClick={handleSellItemsClick}
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  {isSignedIn ? "My Items" : "Sign Up"}
                </Button>
                <Button
                  onClick={handleSellItemsClick}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm"
                >
                  💼 {isSignedIn ? "My Items" : "Sell Products"}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {!isSignedIn ? (
                <div className="flex items-center space-x-2">
                  <Link to="/auth">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Join Now</span>
                      <span className="sm:hidden">Join</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              )}

              <div className="hidden sm:block">
                <ShoppingCart
                  cartItems={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onCheckout={handleCheckout}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-20 sm:pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
            <Button
              variant="ghost"
              onClick={() => {
                console.log("Back to Home clicked");
                window.location.href = "/";
              }}
              className="mr-4 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>

          {/* Member Profile Header with Account Preview */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-6">
                <img
                  src={memberData.avatar}
                  alt={memberData.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-200 shadow-lg"
                />
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {memberData.name}
                    </h1>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Crown className="w-4 h-4 mr-1" />
                      {memberData.tier.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{memberData.email}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {memberData.rating}
                    </span>
                    <span className="flex items-center text-blue-600">
                      <Users className="w-4 h-4 mr-1" />
                      {memberData.followers.toLocaleString()} followers
                    </span>
                    <span className="text-gray-500">
                      Joined{" "}
                      {new Date(memberData.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${memberData.totalSales.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {memberData.totalProducts}
                  </div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">90%</div>
                  <div className="text-sm text-gray-600">Your Share</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setActiveTab("customers")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Button>
                <Button
                  onClick={() =>
                    (window.location.href = "/admin/product-upload")
                  }
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Add Items
                </Button>
                <Button
                  onClick={() => (window.location.href = "/sell-products")}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Sell
                </Button>
                <Button
                  onClick={() =>
                    (window.location.href = "/admin/product-upload")
                  }
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select
                    value={activityFilter}
                    onValueChange={setActivityFilter}
                  >
                    <SelectTrigger className="w-40 bg-white">
                      <SelectValue placeholder="Filter activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activity</SelectItem>
                      <SelectItem value="recent">Recent (24h)</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="sales">Sales Only</SelectItem>
                      <SelectItem value="uploads">Uploads Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Refresh data logic here
                    console.log("Refreshing activity data...");
                  }}
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
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
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-8">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sales Overview */}
                    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center text-purple-600">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Sales Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              This Month
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              $
                              {(
                                getCurrentMonthSales() +
                                refreshData * 127.5
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                              style={{ width: "68%" }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center text-purple-600">
                          <Zap className="w-5 h-5 mr-2" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          <Link to="/admin/products">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Product
                            </Button>
                          </Link>
                          <Button
                            onClick={handleViewAnalytics}
                            variant="outline"
                            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Analytics
                          </Button>
                          <Link to="/send-offers">
                            <Button
                              variant="outline"
                              className="w-full border-green-300 text-green-600 hover:bg-green-50"
                            >
                              <Gift className="w-4 h-4 mr-2" />
                              Send Offers
                            </Button>
                          </Link>
                          <Button
                            onClick={handleNotifications}
                            variant="outline"
                            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            Notifications
                          </Button>
                          <Button
                            onClick={handleViewUsers}
                            variant="outline"
                            className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Manage Users
                          </Button>
                          <Button
                            onClick={handleManageOffers}
                            variant="outline"
                            className="w-full border-teal-300 text-teal-600 hover:bg-teal-50"
                          >
                            <Tag className="w-4 h-4 mr-2" />
                            Offers Manager
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-600">
                        <Calendar className="w-5 h-5 mr-2" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {salesData.slice(0, 5).map((sale) => (
                          <div
                            key={sale.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full ${getStatusColor(sale.status)}`}
                              />
                              <div>
                                <div className="font-medium">
                                  {sale.productName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  to {sale.customerName}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                ${sale.amount}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(sale.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Sales Tab */}
              {activeTab === "sales" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Sales Management
                    </h2>
                    <div className="flex space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search sales..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-full sm:w-64"
                        />
                      </div>
                      <Select
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Total Sales
                            </p>
                            <p className="text-3xl font-bold text-green-600">
                              $
                              {salesData
                                .reduce((sum, sale) => sum + sale.amount, 0)
                                .toFixed(2)}
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Total Orders
                            </p>
                            <p className="text-3xl font-bold text-blue-700">
                              {salesData.length}
                            </p>
                          </div>
                          <Package className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Avg Order Value
                            </p>
                            <p className="text-3xl font-bold text-purple-700">
                              $
                              {(
                                salesData.reduce(
                                  (sum, sale) => sum + sale.amount,
                                  0,
                                ) / salesData.length
                              ).toFixed(2)}
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                    <CardHeader>
                      <CardTitle>Sales History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredSales.map((sale) => (
                          <div
                            key={sale.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <Badge
                                className={`${getStatusColor(sale.status)} text-white`}
                              >
                                {sale.status}
                              </Badge>
                              <div>
                                <div className="font-medium">
                                  {sale.productName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Customer: {sale.customerName}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                ${sale.amount}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(sale.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Customers Tab */}
              {activeTab === "customers" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Customer Management
                    </h2>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search customers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Customer
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCustomers.map((customer) => (
                      <Card
                        key={customer.id}
                        className="shadow-lg border-0 bg-white/90 backdrop-blur-sm"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {customer.name}
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                  {customer.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleMessageCustomer(customer)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {customer.totalPurchases}
                              </div>
                              <div className="text-sm text-gray-600">
                                Purchases
                              </div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-sm font-bold text-purple-600">
                                {new Date(
                                  customer.lastPurchase,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                Last Purchase
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Favorite Categories
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {customer.favoriteCategories.map(
                                  (category, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {category}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Recent Views
                              </Label>
                              <div className="text-sm text-gray-600 mt-1">
                                {customer.viewedItems.slice(0, 2).join(", ")}
                                {customer.viewedItems.length > 2 &&
                                  ` +${customer.viewedItems.length - 2} more`}
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleViewProfile(customer)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleSendOffer(customer)}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send Offer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredCustomers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No customers found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Suppliers Tab */}
              {activeTab === "suppliers" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Supplier Network
                    </h2>
                    <div className="flex space-x-3">
                      <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="jewelry">Jewelry</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="accessories">
                            Accessories
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Supplier
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {suppliers.map((supplier) => (
                      <Card
                        key={supplier.id}
                        className="shadow-lg border-0 bg-white/90 backdrop-blur-sm"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                {supplier.name}
                              </CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">
                                  {supplier.category}
                                </Badge>
                                <Badge
                                  className={`${getStatusColor(supplier.status)} text-white`}
                                >
                                  {supplier.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">
                                {supplier.rating}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-600">
                                {supplier.products.outgoing}
                              </div>
                              <div className="text-xs text-gray-600">
                                Outgoing
                              </div>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                              <div className="text-lg font-bold text-yellow-600">
                                {supplier.products.pending}
                              </div>
                              <div className="text-xs text-gray-600">
                                Pending
                              </div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">
                                {supplier.products.alternate}
                              </div>
                              <div className="text-xs text-gray-600">
                                Alternate
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Last Contact:
                              </span>
                              <span className="font-medium">
                                {new Date(
                                  supplier.lastContact,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Total Products:
                              </span>
                              <span className="font-medium">
                                {supplier.products.outgoing +
                                  supplier.products.pending +
                                  supplier.products.alternate}
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Package className="w-4 h-4 mr-2" />
                              Products
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Tab */}
              {activeTab === "social" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Social Media Hub
                    </h2>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Products
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {socialPlatforms.map((platform, index) => (
                      <Card
                        key={index}
                        className="shadow-lg border-0 bg-white/90 backdrop-blur-sm text-center"
                      >
                        <CardContent className="p-6">
                          <platform.icon
                            className={`w-12 h-12 mx-auto mb-4 ${platform.color}`}
                          />
                          <h3 className="font-semibold text-lg mb-2">
                            {platform.name}
                          </h3>
                          <div className="text-2xl font-bold text-gray-800 mb-1">
                            {platform.followers}
                          </div>
                          <div className="text-sm text-gray-600 mb-4">
                            Followers
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Post
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                          Engagement Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Reach</span>
                            <span className="font-bold text-green-600">
                              45.2K
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Engagement Rate
                            </span>
                            <span className="font-bold text-blue-600">
                              8.4%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Product Clicks
                            </span>
                            <span className="font-bold text-purple-600">
                              1.2K
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Sales from Social
                            </span>
                            <span className="font-bold text-orange-600">
                              $3,245
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                          Scheduled Posts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            {
                              platform: "Instagram",
                              time: "2:00 PM",
                              content: "New jewelry collection reveal",
                            },
                            {
                              platform: "Facebook",
                              time: "4:30 PM",
                              content: "Customer testimonial post",
                            },
                            {
                              platform: "Twitter",
                              time: "6:00 PM",
                              content: "Flash sale announcement",
                            },
                          ].map((post, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <div className="font-medium">
                                  {post.platform}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {post.content}
                                </div>
                              </div>
                              <div className="text-sm font-medium text-purple-600">
                                {post.time}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-4"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Schedule Post
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Plans Tab */}
              {activeTab === "plans" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Choose Your Plan
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      Scale your business with the right membership tier.
                      Upgrade or downgrade anytime.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {membershipTiers.map((tier, index) => (
                      <Card
                        key={index}
                        className={`shadow-xl border-2 relative ${
                          tier.popular
                            ? "border-purple-500 transform scale-105"
                            : "border-gray-200"
                        }`}
                      >
                        {tier.popular && (
                          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                            Most Popular
                          </Badge>
                        )}
                        <CardHeader className="text-center pb-2">
                          <div
                            className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center`}
                          >
                            <Crown className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold">
                            {tier.name}
                          </CardTitle>
                          <div className="text-4xl font-bold text-purple-600 mt-2">
                            {tier.price}
                          </div>
                          {tier.price !== "Free" && (
                            <div className="text-sm text-gray-500">
                              per month
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4 mb-8">
                            {tier.features.map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center"
                              >
                                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            className={`w-full ${
                              tier.popular
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                            size="lg"
                          >
                            {tier.name === "Premium" &&
                            memberData.tier === "premium"
                              ? "Current Plan"
                              : tier.popular
                                ? "Upgrade Now"
                                : "Choose Plan"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          Need a Custom Solution?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Contact our sales team for enterprise solutions and
                          volume discounts
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact Sales
                          </Button>
                          <Button variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Demo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl overflow-y-auto">
            <div className="p-6 min-h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <nav className="space-y-6">
                <Link
                  to="/"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/collections"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Collections
                </Link>
                <span className="block text-lg font-medium text-purple-600 border-b-2 border-purple-600 pb-1">
                  👑 Membership (Active)
                </span>

                {!isSignedIn && (
                  <Button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowSignupModal(true);
                    }}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 text-lg font-medium"
                  >
                    ✨ Sign Up & Start Earning
                  </Button>
                )}

                <div className="space-y-3 py-4 border border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                  <h3 className="font-bold text-purple-800 text-center mb-3">
                    🚀 Quick Actions
                  </h3>
                  <Button
                    onClick={() => {
                      setShowMobileMenu(false);
                      handleSellItemsClick();
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white mx-2"
                  >
                    💼 {isSignedIn ? "My Items" : "Start Selling"}
                  </Button>
                  <Link
                    to="/admin/products"
                    className="block text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-4 rounded-xl text-center shadow-lg mx-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    📦 Upload Products
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Customer Profile
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <p className="text-sm text-gray-500">
                    Customer since{" "}
                    {new Date(
                      selectedCustomer.lastPurchase,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {selectedCustomer.totalPurchases}
                  </div>
                  <div className="text-sm text-gray-600">Total Purchases</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    ${(selectedCustomer.totalPurchases * 25).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Favorite Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.favoriteCategories.map(
                    (category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-purple-50 text-purple-600"
                      >
                        {category}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {selectedCustomer.viewedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{item}</span>
                      <span className="text-xs text-gray-500">
                        Viewed recently
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => handleMessageCustomer(selectedCustomer)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  onClick={() => handleSendOffer(selectedCustomer)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Offer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {showOfferModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Send Offer</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOfferModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-600 mb-4">
                  Send a personalized offer to{" "}
                  <strong>{selectedCustomer.name}</strong>
                </p>
              </div>

              <div>
                <Label
                  htmlFor="offerTitle"
                  className="text-sm font-medium text-gray-700"
                >
                  Offer Title
                </Label>
                <Input
                  id="offerTitle"
                  placeholder="e.g., Special Discount Just for You!"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="offerDiscount"
                  className="text-sm font-medium text-gray-700"
                >
                  Discount Percentage
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select discount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10% Off</SelectItem>
                    <SelectItem value="15">15% Off</SelectItem>
                    <SelectItem value="20">20% Off</SelectItem>
                    <SelectItem value="25">25% Off</SelectItem>
                    <SelectItem value="30">30% Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="offerMessage"
                  className="text-sm font-medium text-gray-700"
                >
                  Personal Message
                </Label>
                <Textarea
                  id="offerMessage"
                  placeholder="Add a personal touch to your offer..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label
                  htmlFor="offerExpiry"
                  className="text-sm font-medium text-gray-700"
                >
                  Offer Expires
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select expiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="3d">3 Days</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="2w">2 Weeks</SelectItem>
                    <SelectItem value="1m">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => sendOffer({})}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Offer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messaging Modal */}
      {showMessaging && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Send Message
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMessaging(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-600 mb-4">
                  Send a message to <strong>{selectedCustomer.name}</strong>
                </p>
              </div>

              <div>
                <Label
                  htmlFor="messageSubject"
                  className="text-sm font-medium text-gray-700"
                >
                  Subject
                </Label>
                <Input
                  id="messageSubject"
                  placeholder="Enter message subject..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="messageContent"
                  className="text-sm font-medium text-gray-700"
                >
                  Message
                </Label>
                <Textarea
                  id="messageContent"
                  placeholder="Type your message here..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowMessaging(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => sendMessage("Message content here")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Component */}
      <BackToTop />
    </div>
  );
}
