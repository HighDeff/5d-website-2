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
  Send,
  DollarSign,
  Package,
  Star,
  Users,
  Gift,
  TrendingUp,
  Filter,
  Search,
  Menu,
  X,
  Eye,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Crown,
  Target,
  Plus,
  MessageSquare,
  Calendar,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  seller: string;
  sellerType: "member" | "regular";
  sellerRating: number;
  dateAdded: string;
  views: number;
  likes: number;
  allowOffers: boolean;
  minimumOfferPercentage: number;
}

interface Offer {
  id: string;
  productId: string;
  productName: string;
  sellerName: string;
  offerAmount: number;
  originalPrice: number;
  message: string;
  status: "pending" | "accepted" | "declined" | "countered";
  timestamp: string;
  expiresAt: string;
}

export default function SendOffers() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [filter, setFilter] = useState<
    "all" | "jewelry" | "clothing" | "accessories"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [userType, setUserType] = useState<"member" | "regular">("member"); // Mock user type
  const [sentOffers, setSentOffers] = useState<Offer[]>([]);

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Mock products available for offers
  const products: Product[] = [
    {
      id: "1",
      name: "Vintage Diamond Ring",
      price: 599.99,
      originalPrice: 799.99,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1f6c37f90fc2472898c26d3667a06f9a?format=webp&width=800",
      category: "jewelry",
      seller: "Sarah Johnson",
      sellerType: "member",
      sellerRating: 4.9,
      dateAdded: "2024-01-15",
      views: 156,
      likes: 23,
      allowOffers: true,
      minimumOfferPercentage: 15,
    },
    {
      id: "2",
      name: "Designer Silk Scarf",
      price: 89.99,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800",
      category: "accessories",
      seller: "Emma Davis",
      sellerType: "regular",
      sellerRating: 4.7,
      dateAdded: "2024-01-18",
      views: 89,
      likes: 12,
      allowOffers: true,
      minimumOfferPercentage: 20,
    },
    {
      id: "3",
      name: "Luxury Handbag",
      price: 249.99,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0f43091f365e460b91e2b579d5eaf844?format=webp&width=800",
      category: "accessories",
      seller: "Maria Garcia",
      sellerType: "member",
      sellerRating: 4.8,
      dateAdded: "2024-01-20",
      views: 134,
      likes: 18,
      allowOffers: true,
      minimumOfferPercentage: 10,
    },
    {
      id: "4",
      name: "Evening Dress",
      price: 159.99,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800",
      category: "clothing",
      seller: "Lisa Brown",
      sellerType: "regular",
      sellerRating: 4.6,
      dateAdded: "2024-01-17",
      views: 78,
      likes: 15,
      allowOffers: false,
      minimumOfferPercentage: 15,
    },
  ];

  // Mock sent offers
  const mockSentOffers: Offer[] = [
    {
      id: "1",
      productId: "1",
      productName: "Vintage Diamond Ring",
      sellerName: "Sarah Johnson",
      offerAmount: 450,
      originalPrice: 599.99,
      message: "Beautiful piece! Would you consider this offer?",
      status: "pending",
      timestamp: "2024-01-20T10:30:00Z",
      expiresAt: "2024-01-23T10:30:00Z",
    },
    {
      id: "2",
      productId: "2",
      productName: "Designer Silk Scarf",
      sellerName: "Emma Davis",
      offerAmount: 75,
      originalPrice: 89.99,
      message: "I love this scarf! This is my best offer.",
      status: "accepted",
      timestamp: "2024-01-19T14:20:00Z",
      expiresAt: "2024-01-22T14:20:00Z",
    },
  ];

  const getMaxOfferAmount = (product: Product) => {
    if (userType === "member") {
      return product.price; // Members can offer any amount
    } else {
      // Regular users limited to 15% of listing price
      return Math.min(product.price * 0.15, product.price);
    }
  };

  const getMinOfferAmount = (product: Product) => {
    return (product.price * product.minimumOfferPercentage) / 100;
  };

  const calculateOfferPercentage = (offer: number, price: number) => {
    return ((offer / price) * 100).toFixed(1);
  };

  const isValidOffer = (product: Product, amount: number) => {
    const min = getMinOfferAmount(product);
    const max = getMaxOfferAmount(product);
    return amount >= min && amount <= max;
  };

  const handleSendOffer = () => {
    if (!selectedProduct) return;

    const amount = parseFloat(offerAmount);
    if (!isValidOffer(selectedProduct, amount)) {
      alert("Invalid offer amount. Please check the limits.");
      return;
    }

    const newOffer: Offer = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sellerName: selectedProduct.seller,
      offerAmount: amount,
      originalPrice: selectedProduct.price,
      message: offerMessage,
      status: "pending",
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    };

    setSentOffers([newOffer, ...sentOffers]);
    setShowOfferForm(false);
    setSelectedProduct(null);
    setOfferAmount("");
    setOfferMessage("");

    alert(
      `Offer sent successfully! ${selectedProduct.seller} will receive your offer of $${amount}.`,
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || product.category === filter;
    return matchesSearch && matchesFilter && product.allowOffers;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "declined":
        return "bg-red-500";
      case "countered":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffInHours = Math.floor(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours <= 0) return "Expired";
    if (diffInHours < 24) return `${diffInHours}h remaining`;
    const days = Math.floor(diffInHours / 24);
    return `${days}d remaining`;
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
                <Link
                  to="/users"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Browse Members
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
                  <Gift className="w-4 h-4 mr-2" />
                  Send Offers
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge
                variant={userType === "member" ? "default" : "secondary"}
                className="hidden sm:flex"
              >
                {userType === "member" ? (
                  <Crown className="w-3 h-3 mr-1" />
                ) : null}
                {userType === "member" ? "Member" : "Regular"}
              </Badge>

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
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-12 h-12 text-purple-600 mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Send Offers
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Make offers on products you love and negotiate the best deals
            </p>

            {/* User Type Info */}
            <div
              className={`inline-flex items-center px-6 py-3 rounded-lg ${
                userType === "member"
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              {userType === "member" ? (
                <Crown className="w-5 h-5 text-purple-600 mr-2" />
              ) : (
                <Users className="w-5 h-5 text-gray-600 mr-2" />
              )}
              <span
                className={`font-medium ${userType === "member" ? "text-purple-700" : "text-gray-700"}`}
              >
                {userType === "member"
                  ? "As a member, you can make offers of any amount"
                  : "Regular users can make offers up to 15% of listing price"}
              </span>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products or sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Available Products
              </h2>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-800 truncate">
                              {product.name}
                            </h3>
                            <div className="text-right">
                              <div className="text-xl font-bold text-purple-600">
                                ${product.price}
                              </div>
                              {product.originalPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  ${product.originalPrice}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-600">
                                {product.seller}
                              </span>
                              <Badge
                                variant={
                                  product.sellerType === "member"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {product.sellerType === "member"
                                  ? "Member"
                                  : "Regular"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">
                                {product.sellerRating}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {product.category}
                            </Badge>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {product.views}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {product.likes}
                              </span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-4">
                            <div>
                              Min offer: $
                              {getMinOfferAmount(product).toFixed(2)} (
                              {product.minimumOfferPercentage}%)
                            </div>
                            <div>
                              {userType === "member"
                                ? "Max offer: Any amount"
                                : `Max offer: $${getMaxOfferAmount(product).toFixed(2)} (15% limit)`}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Link to={`/products/${product.id}`}>
                              <Button
                                variant="outline"
                                className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                            <Button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowOfferForm(true);
                              }}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Make Offer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sent Offers */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Offers
              </h2>
              <div className="space-y-4">
                {sentOffers.concat(mockSentOffers).map((offer) => (
                  <Card
                    key={offer.id}
                    className="shadow-lg border-0 bg-white/90 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {offer.productName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            To: {offer.sellerName}
                          </p>
                        </div>
                        <Badge
                          className={`${getStatusColor(offer.status)} text-white`}
                        >
                          {offer.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            ${offer.offerAmount}
                          </div>
                          <div className="text-xs text-gray-600">
                            Your Offer
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-600">
                            ${offer.originalPrice}
                          </div>
                          <div className="text-xs text-gray-600">
                            Listed Price
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex justify-between">
                          <span>Offer %:</span>
                          <span className="font-medium">
                            {calculateOfferPercentage(
                              offer.offerAmount,
                              offer.originalPrice,
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span className="font-medium">
                            {formatTimeRemaining(offer.expiresAt)}
                          </span>
                        </div>
                      </div>

                      {offer.message && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-3">
                          "{offer.message}"
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${offer.productId}`}
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        {offer.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {sentOffers.length === 0 && mockSentOffers.length === 0 && (
                  <div className="text-center py-8">
                    <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No offers sent yet
                    </h3>
                    <p className="text-gray-500">
                      Start making offers on products you love!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Form Modal */}
      {showOfferForm && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOfferForm(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 m-4 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-purple-600">
                Make an Offer
              </h3>
              <Button variant="ghost" onClick={() => setShowOfferForm(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-lg">
                  {selectedProduct.name}
                </h4>
                <p className="text-gray-600">
                  Listed at ${selectedProduct.price}
                </p>
                <p className="text-sm text-gray-500">
                  by {selectedProduct.seller}
                </p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Amount *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Enter your offer"
                    className="pl-10"
                    min={getMinOfferAmount(selectedProduct)}
                    max={getMaxOfferAmount(selectedProduct)}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Range: ${getMinOfferAmount(selectedProduct).toFixed(2)} - $
                  {getMaxOfferAmount(selectedProduct).toFixed(2)}
                  {offerAmount && (
                    <span className="ml-2 font-medium">
                      (
                      {calculateOfferPercentage(
                        parseFloat(offerAmount),
                        selectedProduct.price,
                      )}
                      % of listed price)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </Label>
                <Textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Add a personal message to the seller..."
                  rows={3}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {offerMessage.length}/500 characters
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Offer Guidelines:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Offers expire in 3 days</li>
                      <li>• Be respectful in your messages</li>
                      <li>• Consider the item's condition and rarity</li>
                      {userType === "regular" && (
                        <li>• Regular users limited to 15% of listing price</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowOfferForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendOffer}
                disabled={
                  !offerAmount ||
                  !isValidOffer(selectedProduct, parseFloat(offerAmount))
                }
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Offer
              </Button>
            </div>
          </div>
        </div>
      )}

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
                  <Gift className="w-4 h-4 mr-2" />
                  Send Offers
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
