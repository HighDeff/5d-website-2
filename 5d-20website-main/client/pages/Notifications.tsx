import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  DollarSign,
  Package,
  Star,
  Users,
  Heart,
  MessageSquare,
  TrendingUp,
  Gift,
  AlertCircle,
  Info,
  X,
  Search,
  Filter,
  Archive,
  Trash2,
  Menu,
  Eye,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";

interface Notification {
  id: string;
  type:
    | "sale"
    | "offer"
    | "message"
    | "system"
    | "follow"
    | "review"
    | "milestone";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  data?: any;
}

export default function Notifications() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "unread" | "sales" | "offers" | "messages"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "sale",
      title: "New Sale! 💰",
      message: "Your Vintage Diamond Ring sold for $299.99 to Emily Chen",
      timestamp: "2024-01-20T10:30:00Z",
      read: false,
      actionable: true,
      data: {
        amount: 299.99,
        buyer: "Emily Chen",
        product: "Vintage Diamond Ring",
      },
    },
    {
      id: "2",
      type: "offer",
      title: "New Offer Received 📨",
      message:
        "Maria Garcia offered $120 for your Designer Silk Scarf (asking $150)",
      timestamp: "2024-01-20T09:15:00Z",
      read: false,
      actionable: true,
      data: {
        offer: 120,
        asking: 150,
        buyer: "Maria Garcia",
        product: "Designer Silk Scarf",
      },
    },
    {
      id: "3",
      type: "message",
      title: "New Message 💬",
      message:
        'Jessica Smith: "Could you send more photos of the leather bag?"',
      timestamp: "2024-01-20T08:45:00Z",
      read: true,
      actionable: true,
      data: { sender: "Jessica Smith", productInquiry: "Leather Bag" },
    },
    {
      id: "4",
      type: "follow",
      title: "New Follower! 👤",
      message: "Anna Wilson started following your store",
      timestamp: "2024-01-19T16:20:00Z",
      read: true,
      actionable: false,
    },
    {
      id: "5",
      type: "review",
      title: "New Review ⭐",
      message:
        'Lisa Brown left a 5-star review: "Beautiful watch, exactly as described!"',
      timestamp: "2024-01-19T14:30:00Z",
      read: true,
      actionable: false,
      data: {
        rating: 5,
        reviewer: "Lisa Brown",
        review: "Beautiful watch, exactly as described!",
      },
    },
    {
      id: "6",
      type: "milestone",
      title: "Milestone Achieved! 🎉",
      message: "Congratulations! You've reached $1,000 in total sales",
      timestamp: "2024-01-18T12:00:00Z",
      read: true,
      actionable: false,
    },
    {
      id: "7",
      type: "system",
      title: "Payment Processed 💳",
      message:
        "Your weekly earnings of $425.50 have been deposited to your account",
      timestamp: "2024-01-18T09:00:00Z",
      read: true,
      actionable: false,
      data: { amount: 425.5 },
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <DollarSign className="w-6 h-6 text-green-600" />;
      case "offer":
        return <Gift className="w-6 h-6 text-purple-600" />;
      case "message":
        return <MessageSquare className="w-6 h-6 text-blue-600" />;
      case "follow":
        return <Users className="w-6 h-6 text-indigo-600" />;
      case "review":
        return <Star className="w-6 h-6 text-yellow-600" />;
      case "milestone":
        return <TrendingUp className="w-6 h-6 text-orange-600" />;
      case "system":
        return <Bell className="w-6 h-6 text-gray-600" />;
      default:
        return <Info className="w-6 h-6 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "sale":
        return "from-green-50 to-green-100 border-green-200";
      case "offer":
        return "from-purple-50 to-purple-100 border-purple-200";
      case "message":
        return "from-blue-50 to-blue-100 border-blue-200";
      case "follow":
        return "from-indigo-50 to-indigo-100 border-indigo-200";
      case "review":
        return "from-yellow-50 to-yellow-100 border-yellow-200";
      case "milestone":
        return "from-orange-50 to-orange-100 border-orange-200";
      default:
        return "from-gray-50 to-gray-100 border-gray-200";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleAction = (notification: Notification) => {
    switch (notification.type) {
      case "sale":
        alert(
          `Sale details: ${notification.data.product} sold to ${notification.data.buyer} for $${notification.data.amount}`,
        );
        break;
      case "offer":
        alert(
          `Offer from ${notification.data.buyer}: $${notification.data.offer} for ${notification.data.product}`,
        );
        break;
      case "message":
        alert(
          `Message from ${notification.data.sender} about ${notification.data.productInquiry}`,
        );
        break;
    }
    markAsRead(notification.id);
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());

    switch (filter) {
      case "unread":
        return !notif.read && matchesSearch;
      case "sales":
        return notif.type === "sale" && matchesSearch;
      case "offers":
        return notif.type === "offer" && matchesSearch;
      case "messages":
        return notif.type === "message" && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 relative overflow-hidden">
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
                <Link
                  to="/membership"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  👑 Membership
                </Link>
                <span className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1 flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
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
          <div className="flex items-center mb-6 sm:mb-8">
            <Link to="/membership">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-purple-600" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-3 bg-red-500 text-white">
                    {unreadCount} new
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600">
                Stay updated with your latest activities and opportunities
              </p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {["all", "unread", "sales", "offers", "messages"].map(
                (filterOption) => (
                  <Button
                    key={filterOption}
                    variant={filter === filterOption ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterOption as any)}
                    className="capitalize"
                  >
                    {filterOption}
                    {filterOption === "unread" && unreadCount > 0 && (
                      <Badge className="ml-1 bg-red-500 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                ),
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "You're all caught up!"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`shadow-lg border bg-gradient-to-r ${getNotificationColor(notification.type)} ${
                    !notification.read ? "ring-2 ring-purple-200" : ""
                  } hover:shadow-xl transition-all duration-300`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-800">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.read && (
                              <span className="flex items-center text-green-600">
                                <Check className="w-4 h-4 mr-1" />
                                Read
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {notification.actionable && (
                          <Button
                            size="sm"
                            onClick={() => handleAction(notification)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-6">
                <Link
                  to="/"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/collections"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Collections
                </Link>
                <Link
                  to="/membership"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Membership
                </Link>
                <span className="block text-lg font-medium text-purple-600 font-semibold border-b-2 border-purple-600 pb-1 flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
