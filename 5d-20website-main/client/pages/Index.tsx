import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
// Cache bust: Updated navigation 2024-01-20
import {
  ArrowRight,
  Star,
  Sparkles,
  Users,
  User,
  Award,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Smartphone,
  X,
  Play,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Plus,
  Eye,
  CreditCard,
  DollarSign,
  Package,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import SignupModal from "@/components/SignupModal";
import SocialMediaPopup from "@/components/SocialMediaPopup";
import MobileApp from "@/components/MobileApp";
import ProductPopout from "@/components/ProductPopout";
import ProductFilter from "@/components/ProductFilter";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { useUserAuth } from "@/hooks/useUserAuth";
import BackToTop from "@/components/BackToTop";
import AIChat from "@/components/AIChat";
import AuthSection from "@/components/AuthSection";
import QuickOfferButton from "@/components/QuickOfferButton";
import QuickPurchaseModal from "@/components/QuickPurchaseModal";
import NotificationBell from "@/components/NotificationBell";
import FavoritesService from "@/services/FavoritesService";
import GuestSalesSection from "@/components/GuestSalesSection";
import EnhancedShoppingCartService from "@/services/EnhancedShoppingCartService";
import CartNotification from "@/components/CartNotification";
import { aiLikesViewsTracker } from "@/services/AILikesViewsTracker";
import { AIClickLogger } from "@/services/AIClickLogger";
import AIControlPanel from "@/components/AIControlPanel";

function Index() {
  // COMPLETE SITE WITH ALL PRODUCTS - v2024.1209.2
  const DEPLOYMENT_ID = "COMPLETE_PRODUCTS_SITE_v2024.1209.2";
  const { user, isSignedIn, currentUser, signOut, favoriteProduct } =
    useUserAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSocialPopup, setShowSocialPopup] = useState(false);
  const [showMobileApp, setShowMobileApp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showProductPopout, setShowProductPopout] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {},
  );

  const { cartItems, addToCart, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Initialize favorites state and AI systems
  useEffect(() => {
    const initializeFavorites = () => {
      const userId = currentUser?.id;
      const favorites = FavoritesService.getFavorites(userId);
      const favStates: Record<string, boolean> = {};
      favorites.forEach((productId) => {
        favStates[productId] = true;
      });
      setFavoriteStates(favStates);
    };

    // Initialize AI systems
    AIClickLogger.initialize();

    initializeFavorites();
  }, [currentUser]);

  const handleAddToCart = (productData: any) => {
    // Use enhanced cart service
    EnhancedShoppingCartService.addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      category: productData.category,
      sellerId: productData.sellerId || "unknown",
      sellerName: productData.sellerName || "Unknown Seller",
    });

    // Also add to legacy cart for compatibility
    addToCart(productData);
  };

  const handleProductView = (product: any) => {
    // Track view with AI system
    aiLikesViewsTracker.trackView(product.id, currentUser?.id);

    setSelectedProduct(product);
    setShowProductPopout(true);
  };

  const handleBuyNow = (product: any) => {
    // Add to cart using enhanced service
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || "general",
      sellerId: product.sellerId || "shop",
      sellerName: product.sellerName || "Shop",
    };

    handleAddToCart(productData);

    // Navigate to checkout
    setTimeout(() => {
      window.location.href = "/cart";
    }, 500);
  };

  const handleToggleFavorite = (productId: string, sellerId?: string) => {
    if (!currentUser) {
      alert("Please sign in to add favorites");
      return;
    }

    const userId = currentUser?.id;
    const isCurrentlyFavorited = favoriteStates[productId];

    // Track with AI system first
    if (isCurrentlyFavorited) {
      aiLikesViewsTracker.trackUnlike(productId, userId);
    } else {
      aiLikesViewsTracker.trackLike(productId, userId);
    }

    // Use both the auth system and local favorites service
    favoriteProduct(productId);

    const isNowFavorited = FavoritesService.toggleFavorite(
      productId,
      userId,
      sellerId,
    );

    setFavoriteStates((prev) => ({
      ...prev,
      [productId]: isNowFavorited,
    }));
  };

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

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="lily-fall lily-1">🌹</div>
        <div className="lily-fall lily-2">🌺</div>
        <div className="lily-fall lily-3">🌻</div>
        <div className="lily-fall lily-4">🌷</div>
        <div className="lily-fall lily-5">🌸</div>
        <div className="lily-fall lily-6">🌼</div>
        <div className="lily-fall lily-7">🌺</div>
        <div className="lily-fall lily-8">🌻</div>
      </div>

      {/* Cart Notifications */}
      <CartNotification position="top-right" showCartSummary={false} />

      {/* Floating Mobile App Button */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto lg:hidden">
        <Link to="/mobile-app">
          <Button className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* Modern Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm lg:text-lg">
                    L
                  </span>
                </div>
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                  LILLY'S
                </h1>
              </Link>

              <div className="hidden lg:flex items-center space-x-6">
                <Link
                  to="/collections"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm lg:text-base"
                >
                  Collections
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-red-500 font-medium transition-colors flex items-center space-x-1 text-sm lg:text-base"
                >
                  <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </Link>
                <Link
                  to="/users"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm lg:text-base"
                >
                  Users
                </Link>
                {isSignedIn && (
                  <Link
                    to="/offers"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  >
                    Offers
                  </Link>
                )}
                {isSignedIn ? (
                  <Link
                    to="/upload"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm lg:text-base bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100"
                  >
                    Upload Products
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      // Scroll to auth section for guests
                      const authSection =
                        document.getElementById("auth-section");
                      if (authSection) {
                        authSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm lg:text-base"
                  >
                    Sell Products
                  </button>
                )}
                {isSignedIn && (
                  <Link
                    to="/dashboard"
                    className="text-purple-700 hover:text-purple-800 font-medium transition-all text-sm lg:text-base bg-purple-100 px-4 py-2 rounded-lg hover:bg-purple-200 border border-purple-200 hover:border-purple-300 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Welcome Back</span>
                    <span className="sm:hidden">Dashboard</span>
                  </Link>
                )}
                {currentUser?.isAdmin && (
                  <div className="hidden xl:flex items-center space-x-2">
                    <Link
                      to="/ai-management"
                      className="text-blue-700 hover:text-blue-800 font-medium transition-all text-xs bg-blue-100 px-2 py-1 rounded border border-blue-200 hover:border-blue-300"
                    >
                      🧠 AI Hub
                    </Link>
                    <Link
                      to="/admin/monitoring"
                      className="text-green-700 hover:text-green-800 font-medium transition-all text-xs bg-green-100 px-2 py-1 rounded border border-green-200 hover:border-green-300"
                    >
                      📊 Monitor
                    </Link>
                  </div>
                )}
                {isSignedIn && (
                  <button
                    onClick={() => {
                      signOut();
                      window.location.href = "/";
                    }}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors text-sm lg:text-base bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100"
                  >
                    Sign Out
                  </button>
                )}
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
                  to={isSignedIn ? "/dashboard" : "/membership"}
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center"
                >
                  👑 {isSignedIn ? "Dashboard" : "Membership"}
                </Link>
                {!isSignedIn && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                      onClick={() => {
                        document
                          .getElementById("auth-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      onClick={() => {
                        document
                          .getElementById("auth-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (isSignedIn) {
                      window.location.href = "/upload-items";
                    } else {
                      window.location.href = "/auth";
                    }
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
                >
                  💼 {isSignedIn ? "Upload Product" : "Start Selling"}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/mobile-app">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-purple-100 flex items-center space-x-2"
                  title="Mobile App"
                >
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span className="hidden sm:inline text-purple-600 font-medium">
                    App
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="hover:bg-purple-100"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* AI Notification Bell */}
              {isSignedIn && (
                <NotificationBell className="hover:bg-purple-100 rounded-lg" />
              )}

              <Button
                onClick={() =>
                  window.open(
                    "https://lillys-fashion-couture.myshopify.com",
                    "_blank",
                  )
                }
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
              >
                🛒 Shopify
              </Button>

              <ShoppingCart
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
              />

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

      {/* Search Overlay */}
      {showSearchInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Search Products
              </h3>
              <Button variant="ghost" onClick={() => setShowSearchInput(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-500"
                autoFocus
              />
            </div>
            {searchQuery && (
              <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                <p className="text-purple-700">
                  Searching for "{searchQuery}"...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seller Promotion Banner */}
      <section className="pt-32 pb-4">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-2xl p-4 sm:p-6 text-center text-white shadow-2xl mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">��</span>
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-bold">
                    Ready to Start Selling?
                  </h3>
                  <p className="text-sm opacity-90">
                    Join thousands of successful sellers
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 relative z-50">
                <Link to="/learn-more">
                  <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-lg shadow-lg border border-green-200 w-full sm:w-auto cursor-pointer">
                    Learn More
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    console.log("Upload Now clicked");
                    if (isSignedIn) {
                      window.location.href = "/upload-items";
                    } else {
                      window.location.href = "/auth";
                    }
                  }}
                  className="bg-purple-600 text-white hover:bg-purple-700 font-semibold px-6 py-2 rounded-lg shadow-lg w-full sm:w-auto cursor-pointer"
                >
                  Upload Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative pb-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-20">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-lg">
              ✨ Haute Couture Collection 2024
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent leading-tight">
              LILLY'S
            </h1>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-700">
              Where Elegance Meets Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Discover our exclusive collection of luxury fashion, exquisite
              jewelry, and premium lifestyle products crafted for the modern
              connoisseur.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/collections">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                  Explore Collections <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setShowMobileApp(true)}
                className="border-2 border-purple-300 hover:bg-purple-50 px-8 py-4 rounded-xl text-lg font-semibold"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lilly's Showcase Slideshow */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
              Discover Lilly's World
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in our curated collection of luxury fashion and
              lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&w=600&h=400&fit=crop"
                  alt="Lilly's Fashion Showcase"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-3xl shadow-xl animate-pulse">
                  ✨
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                    👗
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">
                      Premium Fashion
                    </h3>
                    <p className="text-purple-600">Curated luxury pieces</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Explore our handpicked collection of designer clothing,
                  accessories, and jewelry that defines modern elegance.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    💍
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-pink-800">
                      Exquisite Jewelry
                    </h3>
                    <p className="text-pink-600">Timeless elegance</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Discover stunning jewelry pieces that add sophistication and
                  glamour to every occasion.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                    🏠
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">
                      Lifestyle & Home
                    </h3>
                    <p className="text-purple-600">Elevate your space</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Transform your living space with our carefully selected home
                  decor and lifestyle products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked items from our premium collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Black Elegance Dress */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-50 to-slate-100 relative cursor-move h-[600px] flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800"
                  alt="Black Elegant Dress"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black text-white">✨ New Arrival</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                    onClick={() => handleToggleFavorite("black-elegance-dress")}
                  >
                    <Heart
                      className={`w-5 h-5 ${favoriteStates["black-elegance-dress"] ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">Black Elegance Dress</h3>
                    <span className="text-xl font-bold text-gray-800">
                      $285
                    </span>
                  </div>
                  <p className="text-gray-600 text-base mb-4">
                    Sophisticated black dress with premium fabric and elegant
                    silhouette
                  </p>
                  <div className="flex space-x-2 mb-4">
                    <Badge variant="outline" className="text-sm">
                      Clothing
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Premium
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "black-elegance-dress",
                        name: "Black Elegance Dress",
                        price: 285,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 text-lg py-3 bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3"
                    onClick={() =>
                      handleProductView({
                        id: "black-elegance-dress",
                        name: "Black Elegance Dress",
                        price: 285,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800",
                        category: "Clothing",
                        badge: "New Arrival",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    handleBuyNow({
                      id: "black-elegance-dress",
                      name: "Black Elegance Dress",
                      price: 285,
                      image:
                        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800",
                      category: "Clothing",
                    })
                  }
                  className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <CreditCard className="mr-2 w-4 h-4" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            {/* Ocean Dreams Dress */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-cyan-100 relative cursor-move h-[600px] flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800"
                  alt="Ocean Dreams Dress"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500 text-white">🎨 Artistic</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                    onClick={() => handleToggleFavorite("ocean-dreams-dress")}
                  >
                    <Heart
                      className={`w-5 h-5 ${favoriteStates["ocean-dreams-dress"] ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">Ocean Dreams Dress</h3>
                    <span className="text-xl font-bold text-blue-600">
                      $320
                    </span>
                  </div>
                  <p className="text-gray-600 text-base mb-4">
                    Stunning blue tie-dye pattern with flowing design and
                    comfortable fit
                  </p>
                  <div className="flex space-x-2 mb-4">
                    <Badge variant="outline" className="text-sm">
                      Clothing
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Artistic
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "ocean-dreams-dress",
                        name: "Ocean Dreams Dress",
                        price: 320,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 text-lg py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3"
                    onClick={() =>
                      handleProductView({
                        id: "ocean-dreams-dress",
                        name: "Ocean Dreams Dress",
                        price: 320,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800",
                        category: "Clothing",
                        badge: "Artistic",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    handleBuyNow({
                      id: "ocean-dreams-dress",
                      name: "Ocean Dreams Dress",
                      price: 320,
                      image:
                        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800",
                      category: "Clothing",
                    })
                  }
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <CreditCard className="mr-2 w-4 h-4" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            {/* Rainbow Burst Scarf */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-yellow-50 to-orange-100 relative cursor-move h-[600px] flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800"
                  alt="Rainbow Burst Scarf"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 text-white">
                    🌈 Rainbow
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                    onClick={() => handleToggleFavorite("rainbow-burst-scarf")}
                  >
                    <Heart
                      className={`w-5 h-5 ${favoriteStates["rainbow-burst-scarf"] ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">Rainbow Burst Scarf</h3>
                    <span className="text-xl font-bold text-orange-600">
                      $185
                    </span>
                  </div>
                  <p className="text-gray-600 text-base mb-4">
                    Vibrant rainbow tie-dye scarf with soft fabric and stunning
                    color blend
                  </p>
                  <div className="flex space-x-2 mb-4">
                    <Badge variant="outline" className="text-sm">
                      Shoes & Accessories
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Colorful
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "rainbow-burst-scarf",
                        name: "Rainbow Burst Scarf",
                        price: 185,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800",
                        category: "Shoes & Accessories",
                      })
                    }
                    className="flex-1 text-lg py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3"
                    onClick={() =>
                      handleProductView({
                        id: "rainbow-burst-scarf",
                        name: "Rainbow Burst Scarf",
                        price: 185,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800",
                        category: "Shoes & Accessories",
                        badge: "Rainbow",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    handleBuyNow({
                      id: "rainbow-burst-scarf",
                      name: "Rainbow Burst Scarf",
                      price: 185,
                      image:
                        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800",
                      category: "Shoes & Accessories",
                    })
                  }
                  className="w-full mt-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <CreditCard className="mr-2 w-4 h-4" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            {/* Azure Pattern Top */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-teal-50 to-blue-100 relative cursor-move h-[600px] flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800"
                  alt="Azure Pattern Top"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-teal-500 text-white">🌊 Pattern</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                    onClick={() =>
                      handleToggleFavorite("silver-elegance-watch")
                    }
                  >
                    <Heart
                      className={`w-5 h-5 ${favoriteStates["silver-elegance-watch"] ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">Azure Pattern Top</h3>
                    <span className="text-xl font-bold text-teal-600">
                      $245
                    </span>
                  </div>
                  <p className="text-gray-600 text-base mb-4">
                    Intricate blue pattern design with comfortable fit and
                    elegant style
                  </p>
                  <div className="flex space-x-2 mb-4">
                    <Badge variant="outline" className="text-sm">
                      Clothing
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Patterned
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "azure-pattern-top",
                        name: "Azure Pattern Top",
                        price: 245,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 text-lg py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3"
                    onClick={() =>
                      handleProductView({
                        id: "azure-pattern-top",
                        name: "Azure Pattern Top",
                        price: 245,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800",
                        category: "Clothing",
                        badge: "Pattern",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
                <div className="flex space-x-2 mt-2">
                  <QuickOfferButton
                    product={{
                      id: "azure-pattern-top",
                      name: "Azure Pattern Top",
                      price: 245,
                      images: [
                        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800",
                      ],
                      sellerId: "demo_seller_1",
                      sellerName: "Fashion Designer",
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  />
                </div>
                <Button
                  onClick={() =>
                    handleBuyNow({
                      id: "azure-pattern-top",
                      name: "Azure Pattern Top",
                      price: 245,
                      image:
                        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800",
                      category: "Clothing",
                    })
                  }
                  className="w-full mt-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                >
                  <CreditCard className="mr-2 w-4 h-4" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            {/* Classic Plaid Robe */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-red-50 to-rose-100 relative cursor-move h-[600px] flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800"
                  alt="Classic Plaid Robe"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white">🏠 Comfort</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                    onClick={() => handleToggleFavorite("classic-plaid-robe")}
                  >
                    <Heart
                      className={`w-5 h-5 ${favoriteStates["classic-plaid-robe"] ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">Classic Plaid Robe</h3>
                    <span className="text-xl font-bold text-red-600">$165</span>
                  </div>
                  <p className="text-gray-600 text-base mb-4">
                    Cozy red plaid robe perfect for relaxing at home with
                    premium comfort
                  </p>
                  <div className="flex space-x-2 mb-4">
                    <Badge variant="outline" className="text-sm">
                      Home & Kitchen
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Comfort
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "classic-plaid-robe",
                        name: "Classic Plaid Robe",
                        price: 165,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800",
                        category: "Home & Kitchen",
                      })
                    }
                    className="flex-1 text-lg py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-3"
                    onClick={() =>
                      handleProductView({
                        id: "classic-plaid-robe",
                        name: "Classic Plaid Robe",
                        price: 165,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800",
                        category: "Home & Kitchen",
                        badge: "Comfort",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    handleBuyNow({
                      id: "classic-plaid-robe",
                      name: "Classic Plaid Robe",
                      price: 165,
                      image:
                        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800",
                      category: "Home & Kitchen",
                    })
                  }
                  className="w-full mt-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                >
                  <CreditCard className="mr-2 w-4 h-4" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guest Sales Section */}
      <GuestSalesSection />

      {/* New Arrivals Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              New Arrivals
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Fresh arrivals from our latest collections, featuring innovative
              designs and seasonal favorites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Ocean Dreams Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-pink-50/50 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800"
                  alt="Ocean Dreams Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white text-sm">
                    ✨ Just Added
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">
                  Ocean Dreams Collection
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Flowing designs inspired by ocean waves
                </p>
                <span className="text-lg font-bold text-primary">$320</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "ocean-dreams-collection",
                        name: "Ocean Dreams Collection",
                        price: 320,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "ocean-dreams-collection",
                        name: "Ocean Dreams Collection",
                        price: 320,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800",
                        category: "Clothing",
                        badge: "Just Added",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rainbow Burst Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-pink-50/50 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800"
                  alt="Rainbow Burst Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white text-sm">
                    ✨ Just Added
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">
                  Rainbow Burst Collection
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Vibrant colors that celebrate life
                </p>
                <span className="text-lg font-bold text-primary">$185</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "rainbow-burst-collection",
                        name: "Rainbow Burst Collection",
                        price: 185,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "rainbow-burst-collection",
                        name: "Rainbow Burst Collection",
                        price: 185,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800",
                        category: "Clothing",
                        badge: "Just Added",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Azure Pattern Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-pink-50/50 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800"
                  alt="Azure Pattern Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white text-sm">
                    �� Just Added
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">
                  Azure Pattern Collection
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Intricate patterns with modern appeal
                </p>
                <span className="text-lg font-bold text-primary">$245</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "azure-pattern-collection",
                        name: "Azure Pattern Collection",
                        price: 245,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "azure-pattern-collection",
                        name: "Azure Pattern Collection",
                        price: 245,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800",
                        category: "Clothing",
                        badge: "Just Added",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Classic Comfort Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-pink-50/50 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800"
                  alt="Classic Comfort Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white text-sm">
                    ✨ Just Added
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">
                  Classic Comfort Collection
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Timeless comfort for everyday wear
                </p>
                <span className="text-lg font-bold text-primary">$165</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "classic-comfort-collection",
                        name: "Classic Comfort Collection",
                        price: 165,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800",
                        category: "Home & Kitchen",
                      })
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "classic-comfort-collection",
                        name: "Classic Comfort Collection",
                        price: 165,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800",
                        category: "Home & Kitchen",
                        badge: "Just Added",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Black Elegance Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-pink-50/50 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800"
                  alt="Black Elegance Collection"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white text-sm">
                    ✨ Just Added
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">
                  Black Elegance Collection
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Sophisticated and timeless elegance
                </p>
                <span className="text-lg font-bold text-primary">$285</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "black-elegance-collection",
                        name: "Black Elegance Collection",
                        price: 285,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 bg-gray-700 hover:bg-gray-800"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "black-elegance-collection",
                        name: "Black Elegance Collection",
                        price: 285,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800",
                        category: "Clothing",
                        badge: "Just Added",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Showcase Section */}
      <section className="py-24 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">
              Premium Showcase
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover our most exclusive pieces featuring the latest designs
              and premium materials from top collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Blue Daisy Dress */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fc15060186fc94e5586b70291e8647e98?format=webp&width=800"
                  alt="Blue Daisy Summer Dress"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-500 text-white text-sm">
                    🌼 Floral
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Blue Daisy Dress</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Summer elegance with daisy embellishments
                </p>
                <span className="text-lg font-bold text-blue-600">$295</span>
                <div className="space-y-2 mt-3">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        handleAddToCart({
                          id: "blue-daisy-dress",
                          name: "Blue Daisy Dress",
                          price: 295,
                          image:
                            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fc15060186fc94e5586b70291e8647e98?format=webp&width=800",
                          category: "Clothing",
                        })
                      }
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleProductView({
                          id: "blue-daisy-dress",
                          name: "Blue Daisy Dress",
                          price: 295,
                          image:
                            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fc15060186fc94e5586b70291e8647e98?format=webp&width=800",
                          category: "Clothing",
                          badge: "New Addition",
                        })
                      }
                    >
                      Quick View
                    </Button>
                  </div>
                  <QuickPurchaseModal
                    product={{
                      id: "blue-daisy-dress",
                      name: "Blue Daisy Dress",
                      price: 295,
                      images: [
                        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fc15060186fc94e5586b70291e8647e98?format=webp&width=800",
                      ],
                      description: "Summer elegance with daisy embellishments",
                      category: "Clothing",
                      condition: "new",
                      sellerId: "seller_1",
                      sellerName: "Fashion Boutique",
                    }}
                    onSuccess={(paymentDetails) => {
                      console.log("Purchase successful!", paymentDetails);
                      // Refresh page to show updated product status
                      window.location.reload();
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Silver Metallic Dress */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-50 to-slate-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Ff8c285ee3c4c4d97ac1282d61ad30f7d?format=webp&width=800"
                  alt="Silver Metallic Dress"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-gray-700 text-white text-sm">
                    ✨ Metallic
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">
                  Silver Metallic Dress
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Stunning metallic finish for special occasions
                </p>
                <span className="text-lg font-bold text-gray-700">$385</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "silver-metallic-dress",
                        name: "Silver Metallic Dress",
                        price: 385,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Ff8c285ee3c4c4d97ac1282d61ad30f7d?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 bg-gray-700 hover:bg-gray-800"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "silver-metallic-dress",
                        name: "Silver Metallic Dress",
                        price: 385,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Ff8c285ee3c4c4d97ac1282d61ad30f7d?format=webp&width=800",
                        category: "Clothing",
                        badge: "Metallic",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Navy Floral Shorts */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-blue-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F3369878a736a4948877a7c9df2752887?format=webp&width=800"
                  alt="Navy Floral Shorts"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-700 text-white text-sm">
                    🌸 Navy Floral
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Navy Floral Shorts</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Comfortable shorts with delicate floral print
                </p>
                <span className="text-lg font-bold text-blue-700">$145</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "navy-floral-shorts",
                        name: "Navy Floral Shorts",
                        price: 145,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F3369878a736a4948877a7c9df2752887?format=webp&width=800",
                        category: "Clothing",
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "navy-floral-shorts",
                        name: "Navy Floral Shorts",
                        price: 145,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F3369878a736a4948877a7c9df2752887?format=webp&width=800",
                        category: "Clothing",
                        badge: "Navy Floral",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ice Chill Deodorant */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-cyan-50 to-blue-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb48aaef84c5d4e5fa9960bc14ba3849e?format=webp&width=800"
                  alt="AXE Ice Chill Deodorant"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-cyan-500 text-white text-sm">
                    ❄️ Fresh
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Ice Chill Deodorant</h3>
                <p className="text-gray-600 text-sm mb-3">
                  48hr non-stop freshness with cooling effect
                </p>
                <span className="text-lg font-bold text-cyan-600">$12</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "ice-chill-deodorant",
                        name: "Ice Chill Deodorant",
                        price: 12,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb48aaef84c5d4e5fa9960bc14ba3849e?format=webp&width=800",
                        category: "Beauty",
                      })
                    }
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "ice-chill-deodorant",
                        name: "Ice Chill Deodorant",
                        price: 12,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb48aaef84c5d4e5fa9960bc14ba3849e?format=webp&width=800",
                        category: "Beauty",
                        badge: "Fresh",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blue Geometric Tie */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fec6faad76e0a4127a1b1793b6e79281f?format=webp&width=800"
                  alt="Blue Geometric Tie"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-600 text-white text-sm">
                    👔 Formal
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Blue Geometric Tie</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Professional geometric pattern tie
                </p>
                <span className="text-lg font-bold text-blue-600">$65</span>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: "blue-geometric-tie",
                        name: "Blue Geometric Tie",
                        price: 65,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fec6faad76e0a4127a1b1793b6e79281f?format=webp&width=800",
                        category: "Shoes & Accessories",
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleProductView({
                        id: "blue-geometric-tie",
                        name: "Blue Geometric Tie",
                        price: 65,
                        image:
                          "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fec6faad76e0a4127a1b1793b6e79281f?format=webp&width=800",
                        category: "Shoes & Accessories",
                        badge: "Formal",
                      })
                    }
                  >
                    Quick View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Signature Collections */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Signature Collections
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore our curated collections that define style and elegance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-10">
            {/* Jewelry Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-indigo-100 relative h-[420px]">
              <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1f6c37f90fc2472898c26d3667a06f9a?format=webp&width=800"
                    alt="Rose gold leaf ring"
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-purple-500 text-white border-none text-base px-4 py-2">
                    💍 Jewelry
                  </Badge>
                  <h3 className="text-2xl xl:text-3xl font-bold mb-4 text-gray-800">
                    Timeless Elegance
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Exquisite jewelry pieces that capture the essence of luxury
                    and sophistication.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-purple-600">
                    From $49
                  </span>
                  <Link to="/shop/jewelry">
                    <Button className="bg-purple-500 text-white hover:bg-white hover:text-purple-500 transition-colors border border-purple-300 text-lg px-6 py-3">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Home Essentials Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-green-50 to-emerald-100 relative h-[420px]">
              <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0f43091f365e460b91e2b579d5eaf844?format=webp&width=800"
                    alt="Copper patterned handbag"
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-green-500 text-white border-none text-base px-4 py-2">
                    🧴 Home Essentials
                  </Badge>
                  <h3 className="text-2xl xl:text-3xl font-bold mb-4 text-gray-800">
                    Daily Essentials
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Premium home care products and essentials for everyday
                    comfort and cleanliness.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-600">
                    From $15
                  </span>
                  <Link to="/shop/home-kitchen">
                    <Button className="bg-green-500 text-white hover:bg-white hover:text-green-500 transition-colors border border-green-300 text-lg px-6 py-3">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Clothing Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-pink-50 to-rose-100 relative h-[420px]">
              <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800"
                    alt="Black elegance dress"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-pink-500 text-white border-none text-base px-4 py-2">
                    �� Clothing
                  </Badge>
                  <h3 className="text-2xl xl:text-3xl font-bold mb-4 text-gray-800">
                    Fashion Forward
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Contemporary clothing that blends comfort with cutting-edge
                    style.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-pink-600">
                    From $89
                  </span>
                  <Link to="/shop/clothing">
                    <Button className="bg-pink-500 text-white hover:bg-white hover:text-pink-500 transition-colors border border-pink-300 text-lg px-6 py-3">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Shoes & Accessories Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-amber-50 to-orange-100 relative h-[420px]">
              <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1a0cb14df57a4bb2931b570136ea5010?format=webp&width=800"
                    alt="Red luxury handbag"
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-amber-500 text-white border-none text-base px-4 py-2">
                    👜 Accessories
                  </Badge>
                  <h3 className="text-2xl xl:text-3xl font-bold mb-4 text-gray-800">
                    Perfect Finish
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Complete your look with our curated selection of shoes and
                    accessories.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-amber-600">
                    From $35
                  </span>
                  <Link to="/shop/shoes-accessories">
                    <Button className="bg-amber-500 text-white hover:bg-white hover:text-amber-500 transition-colors border border-amber-300 text-lg px-6 py-3">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Beauty Collection */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-teal-50 to-cyan-100 relative h-[420px]">
              <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb48aaef84c5d4e5fa9960bc14ba3849e?format=webp&width=800"
                    alt="Ice chill deodorant"
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-teal-500 text-white border-none text-base px-4 py-2">
                    💄 Beauty
                  </Badge>
                  <h3 className="text-2xl xl:text-3xl font-bold mb-4 text-gray-800">
                    Beauty Essentials
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Premium beauty products to enhance your natural radiance and
                    confidence.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-teal-600">
                    From $12
                  </span>
                  <Link to="/shop/beauty">
                    <Button className="bg-teal-500 text-white hover:bg-white hover:text-teal-500 transition-colors border border-teal-300 text-lg px-6 py-3">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover your perfect
            style today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Browse All Collections clicked");
                window.location.assign("/collections");
              }}
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transition-colors duration-200 cursor-pointer z-10 relative"
            >
              Browse All Collections
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Sell Your Products clicked");
                window.location.assign("/sell-products");
              }}
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200 cursor-pointer z-10 relative"
            >
              Sell Your Products
            </button>
          </div>
        </div>
      </section>

      {/* Collection Showcase Cards */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
              Explore Our Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover curated collections tailored to your unique style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Jewelry Collection */}
            <Link to="/shop/jewelry" className="group">
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&w=500&h=300&fit=crop"
                    alt="Jewelry Collection"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">💍 Jewelry</h3>
                    <p className="text-sm opacity-90">
                      Exquisite precious pieces
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-600 text-white">Premium</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Discover our stunning collection of handcrafted jewelry,
                    from elegant necklaces to sparkling rings.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-600 font-semibold">
                      View Collection
                    </span>
                    <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Clothing Collection */}
            <Link to="/shop/clothing" className="group">
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&w=500&h=300&fit=crop"
                    alt="Clothing Collection"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">👗 Clothing</h3>
                    <p className="text-sm opacity-90">
                      Fashion-forward designs
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-pink-600 text-white">Trending</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Explore contemporary fashion pieces that blend comfort with
                    cutting-edge style and elegance.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-pink-600 font-semibold">
                      View Collection
                    </span>
                    <ArrowRight className="w-5 h-5 text-pink-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Beauty Collection */}
            <Link to="/shop/beauty" className="group">
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&w=500&h=300&fit=crop"
                    alt="Beauty Collection"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">💄 Beauty</h3>
                    <p className="text-sm opacity-90">Luxury cosmetics</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-red-600 text-white">New</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Premium beauty products and cosmetics to enhance your
                    natural radiance and confidence.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-semibold">
                      View Collection
                    </span>
                    <ArrowRight className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Accessories Collection */}
            <Link to="/shop/shoes-accessories" className="group">
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500&h=300&fit=crop"
                    alt="Accessories Collection"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">👜 Accessories</h3>
                    <p className="text-sm opacity-90">Style essentials</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-orange-600 text-white">Hot</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Complete your look with our curated selection of bags,
                    shoes, and fashion accessories.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600 font-semibold">
                      View Collection
                    </span>
                    <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Home & Kitchen Collection */}
            <Link to="/shop/home-kitchen" className="group">
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&w=500&h=300&fit=crop"
                    alt="Home & Kitchen Collection"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      🏠 Home & Kitchen
                    </h3>
                    <p className="text-sm opacity-90">Lifestyle essentials</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white">Eco</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Transform your living space with our premium home decor and
                    kitchen essentials.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">
                      View Collection
                    </span>
                    <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Start Selling Card */}
            <Link to="/sell-products" className="group">
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-green-100 to-emerald-100">
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">💼</div>
                      <h3 className="text-2xl font-bold">Start Selling</h3>
                      <p className="text-sm opacity-90">Join our marketplace</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-600 text-white">Featured</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Ready to turn your passion into profit? Join thousands of
                    successful sellers on our platform.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">
                      Get Started
                    </span>
                    <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-12">
            <div
              onClick={() => {
                console.log("View All Collections clicked");
                window.location.href = "/collections";
              }}
              className="inline-block cursor-pointer"
              style={{ zIndex: 100 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                View All Collections
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sign In/Sign Up Section */}
      <AuthSection />

      {/* OLD AUTH SECTION - TO BE REMOVED */}
      <section id="auth-section-old" className="hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
                Join Our Community
              </h2>
              <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                Sign in to your account or create a new one to start buying,
                selling, and earning
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sign In Form */}
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <User className="w-6 h-6 mr-2" />
                    Sign In
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signInEmail" className="text-pink-100">
                      Email or Phone
                    </Label>
                    <Input
                      id="signInEmail"
                      type="text"
                      placeholder="Enter your email or phone number"
                      className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signInPassword" className="text-pink-100">
                      Password
                    </Label>
                    <Input
                      id="signInPassword"
                      type="password"
                      placeholder="Enter your password"
                      className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3"
                    onClick={() => {
                      const email = (
                        document.getElementById(
                          "signInEmail",
                        ) as HTMLInputElement
                      )?.value;
                      const password = (
                        document.getElementById(
                          "signInPassword",
                        ) as HTMLInputElement
                      )?.value;

                      if (email && password) {
                        // Get the auth functions from the hook
                        window.location.href = `/auth?email=${encodeURIComponent(email)}&action=signin`;
                      } else {
                        alert("Please enter both email and password");
                      }
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <div className="text-center">
                    <Link
                      to="/auth"
                      className="text-pink-200 hover:text-white text-sm"
                    >
                      Forgot password? Reset here
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Sign Up Form */}
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Star className="w-6 h-6 mr-2" />
                    Create Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="w-5 h-5 text-green-300 mr-1" />
                      <span className="text-green-200 font-semibold">
                        Keep 90% of Your Sales!
                      </span>
                    </div>
                    <p className="text-green-100 text-sm text-center">
                      Only 10% platform fee • Fast withdrawals
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="signUpFirstName"
                        className="text-pink-100"
                      >
                        First Name
                      </Label>
                      <Input
                        id="signUpFirstName"
                        placeholder="John"
                        className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signUpLastName" className="text-pink-100">
                        Last Name
                      </Label>
                      <Input
                        id="signUpLastName"
                        placeholder="Doe"
                        className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signUpEmail" className="text-pink-100">
                      Email
                    </Label>
                    <Input
                      id="signUpEmail"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signUpPassword" className="text-pink-100">
                      Password
                    </Label>
                    <Input
                      id="signUpPassword"
                      type="password"
                      placeholder="Create a secure password"
                      className="bg-white/20 border-white/30 text-white placeholder-pink-200"
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3"
                    onClick={() => {
                      const firstName = (
                        document.getElementById(
                          "signUpFirstName",
                        ) as HTMLInputElement
                      )?.value;
                      const lastName = (
                        document.getElementById(
                          "signUpLastName",
                        ) as HTMLInputElement
                      )?.value;
                      const email = (
                        document.getElementById(
                          "signUpEmail",
                        ) as HTMLInputElement
                      )?.value;
                      const password = (
                        document.getElementById(
                          "signUpPassword",
                        ) as HTMLInputElement
                      )?.value;

                      if (firstName && lastName && email && password) {
                        window.location.href = `/auth?name=${encodeURIComponent(firstName + " " + lastName)}&email=${encodeURIComponent(email)}&action=signup`;
                      } else {
                        alert("Please fill in all fields");
                      }
                    }}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Create Account & Start Selling
                  </Button>

                  <div className="text-center text-pink-200 text-xs">
                    By signing up, you agree to our{" "}
                    <Link
                      to="/terms"
                      className="text-pink-100 hover:text-white underline"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
                <Package className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Start Selling Today
                </h3>
                <p className="text-pink-100 text-sm">
                  List unlimited products and reach thousands of customers
                </p>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
                <DollarSign className="w-12 h-12 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Keep More Earnings
                </h3>
                <p className="text-pink-100 text-sm">
                  Only 10% platform fee - you keep 90% of every sale
                </p>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
                <Users className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Join Community
                </h3>
                <p className="text-pink-100 text-sm">
                  Connect with buyers and sellers in our growing marketplace
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl">💍</div>
          <div className="absolute top-20 right-20 text-4xl">💎</div>
          <div className="absolute bottom-20 left-20 text-5xl">🌺</div>
          <div className="absolute bottom-10 right-10 text-3xl">✨</div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LILLY'S
                </h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Where elegance blooms eternal. Premium fashion and luxury
                lifestyle products curated for the sophisticated modern woman.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-300"
                  onClick={() =>
                    window.open(
                      "https://facebook.com/lillysfashioncouture",
                      "_blank",
                    )
                  }
                  title="Follow us on Facebook"
                >
                  📘
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all duration-300"
                  onClick={() =>
                    window.open(
                      "https://instagram.com/lillysfashioncouture",
                      "_blank",
                    )
                  }
                  title="Follow us on Instagram"
                >
                  💫
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                  onClick={() =>
                    window.open("https://twitter.com/lillysfashion", "_blank")
                  }
                  title="Follow us on Twitter"
                >
                  🐦
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-purple-300">
                Navigation
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      ✨
                    </span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      💬
                    </span>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      ��
                    </span>
                    Collections
                  </Link>
                </li>
                <li>
                  <Link
                    to="/favorites"
                    className="text-gray-300 hover:text-red-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      ❤️
                    </span>
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link
                    to="/membership"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      👑
                    </span>
                    Membership
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sell-products"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      💼
                    </span>
                    Sell Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Collections */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-pink-300">
                Collections
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/shop/jewelry"
                    className="text-gray-300 hover:text-pink-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      💎
                    </span>
                    Celestial Diamonds
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/clothing"
                    className="text-gray-300 hover:text-pink-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      🌸
                    </span>
                    Ethereal Elegance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/beauty"
                    className="text-gray-300 hover:text-pink-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      💄
                    </span>
                    Radiant Goddess
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/shoes-accessories"
                    className="text-gray-300 hover:text-pink-400 transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      👜
                    </span>
                    Golden Aura
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-amber-300">
                Get in Touch
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 group">
                  <MapPin className="w-5 h-5 text-purple-400 mt-1 group-hover:text-purple-300 transition-colors" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">
                      Visit Us
                    </p>
                    <span className="text-gray-400 text-sm">
                      123 Fashion Ave, New York, NY 10001
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3 group">
                  <Phone className="w-5 h-5 text-purple-400 mt-1 group-hover:text-purple-300 transition-colors" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Call Us</p>
                    <a
                      href="tel:+15551234567"
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                    >
                      (555) 123-4567
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3 group">
                  <Mail className="w-5 h-5 text-purple-400 mt-1 group-hover:text-purple-300 transition-colors" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">
                      Email Us
                    </p>
                    <a
                      href="mailto:hello@lillys.com"
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                    >
                      hello@lillys.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="border-t border-gray-700/50 pt-8 mb-8">
            <div className="text-center max-w-md mx-auto">
              <h4 className="text-lg font-semibold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Stay in the Loop
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe for exclusive offers and new collection updates
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700/50 pt-8 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-6 text-sm">
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Support
                </Link>
                <Link
                  to="/mobile-app"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Mobile App
                </Link>
              </div>
              <div className="text-gray-400 text-sm">
                &copy; 2024 Lilly's Fashion Couture. All rights reserved.
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-purple-400 text-sm font-medium">
                ✨ Where elegance blooms eternal ✨
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Payment Options
              </h3>
              <Button
                variant="ghost"
                onClick={() => setShowPaymentModal(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => {
                  handleCheckout("paypal");
                  setShowPaymentModal(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                <CreditCard className="mr-2 w-5 h-5" />
                Pay with PayPal
              </Button>
              <Button
                onClick={() => {
                  handleCheckout("cashapp");
                  setShowPaymentModal(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                <Smartphone className="mr-2 w-5 h-5" />
                Pay with Cash App
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    "https://lillys-fashion-couture.myshopify.com",
                    "_blank",
                  )
                }
                className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3"
              >
                🛒 Continue on Shopify
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-20 z-30 flex flex-col space-y-3 hidden sm:flex">
        {/* Sell Products Button */}
        <Link
          to="/sell-products"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl rounded-full h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center group hover:scale-110 transition-all duration-300"
          title="Start Selling"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">
            💼
          </span>
        </Link>

        {/* Quick Upload Button */}
        <button
          onClick={() => {
            // Check if user is signed in before redirecting
            const currentUser = localStorage.getItem("currentUser");
            if (currentUser) {
              window.location.href = "/upload";
            } else {
              // Scroll to auth section
              const authSection = document.getElementById("auth-section");
              if (authSection) {
                authSection.scrollIntoView({ behavior: "smooth" });
              }
            }
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl rounded-full h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center group hover:scale-110 transition-all duration-300"
          title="Upload Products"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">
            📦
          </span>
        </button>
      </div>

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
                  to="/collections"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Collections
                </Link>
                <Link
                  to="/canvas-control"
                  className="block text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  🎨 Canvas Control
                </Link>
                <Link
                  to="/ai-notifications"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  🔔 AI Notifications
                </Link>
                <Link
                  to="/popups-modals"
                  className="block text-lg font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  📱 Popups & Modals
                </Link>
                <Link
                  to="/quantumpass-model"
                  className="block text-lg font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  🤖 QuantumPass AI
                </Link>
                <Link
                  to="/favorites"
                  className="block text-lg font-medium text-gray-800 hover:text-red-500 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  ❤️ Favorites
                </Link>
                <Link
                  to="/users"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  👥 Users
                </Link>
                {isSignedIn && (
                  <Link
                    to="/offers"
                    className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    🎯 Offers
                  </Link>
                )}
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    // Check if user is signed in before redirecting
                    const currentUser = localStorage.getItem("currentUser");
                    if (currentUser) {
                      window.location.href = "/upload";
                    } else {
                      // Scroll to auth section
                      const authSection =
                        document.getElementById("auth-section");
                      if (authSection) {
                        authSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors text-left"
                >
                  💼 Sell Products
                </button>
                {isSignedIn && (
                  <Link
                    to="/dashboard"
                    className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    📊 Dashboard
                  </Link>
                )}
                {currentUser?.isAdmin && (
                  <>
                    <Link
                      to="/ai-management"
                      className="block text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      🧠 AI Management Hub
                    </Link>
                    <Link
                      to="/admin/monitoring"
                      className="block text-lg font-medium text-green-600 hover:text-green-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      📊 Live Monitoring
                    </Link>
                    <Link
                      to="/admin/live-monitoring"
                      className="block text-lg font-medium text-orange-600 hover:text-orange-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      🔴 Advanced Monitoring
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      📈 System Analytics
                    </Link>
                  </>
                )}
                <Link
                  to="/about"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/membership"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  👑 Membership
                </Link>
                <Link
                  to="/mobile-app"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  📱 Mobile App
                </Link>
                <Button
                  onClick={() => {
                    setShowMobileMenu(false);
                    document
                      .getElementById("auth-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 text-lg font-medium"
                >
                  ✨ Sign Up & Start Earning
                </Button>
                <div className="space-y-3 py-4 border border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                  <h3 className="font-bold text-purple-800 text-center mb-3">
                    🚀 Start Your Business
                  </h3>
                  <Link
                    to="/sell-products"
                    className="block text-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-4 rounded-xl text-center shadow-lg mx-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    💼 Start Selling
                  </Link>
                  <Link
                    to="/admin/products"
                    className="block text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-4 rounded-xl text-center shadow-lg mx-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    📦 Upload Products
                  </Link>
                </div>
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Shop Categories
                  </h3>
                  <div className="space-y-3">
                    <Link
                      to="/shop/jewelry"
                      className="block text-gray-600 hover:text-purple-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      💍 Jewelry
                    </Link>
                    <Link
                      to="/shop/clothing"
                      className="block text-gray-600 hover:text-purple-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👗 Clothing
                    </Link>
                    <Link
                      to="/shop/beauty"
                      className="block text-gray-600 hover:text-purple-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      💄 Beauty
                    </Link>
                    <Link
                      to="/shop/shoes-accessories"
                      className="block text-gray-600 hover:text-purple-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👜 Accessories
                    </Link>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <Button
                    onClick={() => {
                      setShowMobileMenu(false);
                      window.open(
                        "https://lillys-fashion-couture.myshopify.com",
                        "_blank",
                      );
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mb-4"
                  >
                    🛒 Shopify Store
                  </Button>
                  <Link
                    to="/admin/products"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      ⬆️ Upload Products
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Components */}
      {showSocialPopup && (
        <SocialMediaPopup onClose={() => setShowSocialPopup(false)} />
      )}
      {showMobileApp && <MobileApp onClose={() => setShowMobileApp(false)} />}
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
        />
      )}
      {showProductPopout && selectedProduct && (
        <ProductPopout
          product={selectedProduct}
          isOpen={showProductPopout}
          onClose={() => setShowProductPopout(false)}
        />
      )}
      {showFilter && (
        <ProductFilter
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          filters={{}}
          onFiltersChange={() => {}}
        />
      )}

      {/* Admin Panel */}
      {currentUser?.isAdmin && (
        <div className="fixed top-20 right-4 z-40 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm">
          <div className="text-center mb-3">
            <h3 className="font-bold text-gray-900 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Admin Panel
            </h3>
            <p className="text-xs text-gray-600">Quick access to admin tools</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="w-full text-xs">
                📊 Dashboard
              </Button>
            </Link>
            <Link to="/ai-management">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-blue-50 border-blue-200 text-blue-700"
              >
                🧠 AI Hub
              </Button>
            </Link>
            <Link to="/admin/monitoring">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-green-50 border-green-200 text-green-700"
              >
                📊 Monitor
              </Button>
            </Link>
            <Link to="/admin/live-monitoring">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-orange-50 border-orange-200 text-orange-700"
              >
                🔴 Live
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-purple-50 border-purple-200 text-purple-700"
              >
                📈 Analytics
              </Button>
            </Link>
            <Link to="/admin/database">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-gray-50 border-gray-200 text-gray-700"
              >
                🗄️ Database
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Organization Notice */}
      <div className="fixed top-24 right-4 z-40 max-w-sm">
        <Card className="bg-blue-900/95 border-blue-600 backdrop-blur-md">
          <CardContent className="p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              🎯 Organized Layout
            </h3>
            <div className="text-xs text-blue-100 space-y-1">
              <p>• Canvas tools → <Link to="/canvas-control" className="text-blue-300 hover:underline">Canvas Control</Link></p>
              <p>• AI alerts → <Link to="/ai-notifications" className="text-blue-300 hover:underline">AI Notifications</Link></p>
              <p>• Popups → <Link to="/popups-modals" className="text-blue-300 hover:underline">Popups & Modals</Link></p>
              <p>• AI Model → <Link to="/quantumpass-model" className="text-yellow-300 hover:underline">QuantumPass AI</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Control Panel - Quick Access Only */}
      <AIControlPanel />

      {/* Back to Top Component */}
      <BackToTop />
      <AIChat position="bottom-right" />
    </div>
  );
}

export default Index;
