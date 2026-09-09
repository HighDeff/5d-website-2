import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Star,
  Smartphone,
  ShoppingBag,
  Heart,
  Bell,
  Zap,
  Shield,
  Users,
  Award,
  Menu,
  ChevronDown,
  X,
  Play,
  CheckCircle,
  Camera,
  CreditCard,
  Search,
  Plus,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import BackToTop from "@/components/BackToTop";

export default function MobileApp() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDemo, setShowMobileDemo] = useState(false);

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  // Scroll to top on page load and detect mobile
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Mobile detection
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const features = [
    {
      icon: ShoppingBag,
      title: "One-Tap Shopping",
      description: "Browse and buy with lightning-fast checkout",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Get alerts for new arrivals and exclusive deals",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Heart,
      title: "Wishlist Sync",
      description: "Save favorites across all your devices",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Camera,
      title: "AR Try-On",
      description: "See how products look before you buy",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Multiple payment options with top security",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      avatar: "👩‍💼",
      rating: 5,
      text: "The app is so much faster than the website! Love the one-tap checkout.",
    },
    {
      name: "Mike Rodriguez",
      avatar: "👨‍💻",
      rating: 5,
      text: "Push notifications keep me updated on sales. Saved $200 last month!",
    },
    {
      name: "Emily Johnson",
      avatar: "👩‍🎨",
      rating: 5,
      text: "AR try-on feature is amazing! No more wrong size purchases.",
    },
  ];

  const stats = [
    { number: "500K+", label: "App Downloads", icon: "📱" },
    { number: "4.9", label: "App Store Rating", icon: "⭐" },
    { number: "99%", label: "User Satisfaction", icon: "💯" },
    { number: "50%", label: "Faster Checkout", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="fixed inset-0 opacity-3 z-0"
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
        <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-4">
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
                  className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
                >
                  📱 Mobile App
                </Link>
                <Link
                  to="/membership"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  👑 Membership
                </Link>
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

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 lg:pt-32 pb-16 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center mb-6 sm:mb-8">
            <Link to="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-lg">
                📱 Download Now
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                Lilly's Mobile App
              </h1>
              <p className="text-xl text-purple-600 mb-8 leading-relaxed">
                Experience luxury shopping like never before. Our mobile app
                offers exclusive features, faster checkout, and early access to
                sales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl"
                  onClick={() =>
                    window.open(
                      "https://apps.apple.com/app/lillys-fashion",
                      "_blank",
                    )
                  }
                >
                  <Download className="mr-3 w-5 h-5" />
                  Download for iOS
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl"
                  onClick={() =>
                    window.open(
                      "https://play.google.com/store/apps/details?id=com.lillys.fashion",
                      "_blank",
                    )
                  }
                >
                  <Play className="mr-3 w-5 h-5" />
                  Get on Android
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {stats.slice(0, 2).map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm"
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {stat.number}
                    </div>
                    <div className="text-purple-500 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-[3rem] p-4 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Mobile App Header */}
                  <div className="h-16 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">
                          L
                        </span>
                      </div>
                      <span className="text-white font-bold text-lg">
                        LILLY'S
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Mock App Content */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-purple-600">Featured</h3>
                      <span className="text-xs text-purple-400">View all</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 text-xs">💍</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-purple-300 rounded w-1/2 mb-1"></div>
                          <div className="h-2 bg-purple-200 rounded w-2/3"></div>
                        </div>
                        <div className="text-purple-600 text-xs font-bold">
                          $299
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                        <div className="w-10 h-10 bg-pink-200 rounded-lg flex items-center justify-center">
                          <span className="text-pink-600 text-xs">👗</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-pink-300 rounded w-1/2 mb-1"></div>
                          <div className="h-2 bg-pink-200 rounded w-2/3"></div>
                        </div>
                        <div className="text-pink-600 text-xs font-bold">
                          $159
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
                    <div className="flex justify-around">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center mb-1">
                          <span className="text-purple-600 text-xs">🏠</span>
                        </div>
                        <span className="text-xs text-purple-600 font-medium">
                          Home
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mb-1">
                          <span className="text-gray-400 text-xs">🔍</span>
                        </div>
                        <span className="text-xs text-gray-400">Search</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mb-1">
                          <span className="text-gray-400 text-xs">❤️</span>
                        </div>
                        <span className="text-xs text-gray-400">Saved</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mb-1">
                          <span className="text-gray-400 text-xs">👤</span>
                        </div>
                        <span className="text-xs text-gray-400">Profile</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                  🔔
                </div>
              </div>

              {/* Interactive Demo Buttons */}
              <div className="mt-8 text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg shadow-lg order-2 sm:order-1"
                    onClick={() => {
                      // Check if mobile device
                      const isMobile =
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                          navigator.userAgent,
                        );

                      if (isMobile) {
                        // For mobile: navigate to mobile simulation with params
                        window.location.href = "/?mobile=true&simulation=true";
                      } else {
                        // For desktop: open mobile simulation in new tab
                        window.open("/?mobile=true&simulation=true", "_blank");
                      }
                    }}
                  >
                    <Play className="mr-2 w-4 h-4" />
                    Try Live Demo
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg order-1 sm:order-2"
                    onClick={() => setShowMobileDemo(true)}
                  >
                    <Smartphone className="mr-2 w-4 h-4" />
                    Mobile View
                  </Button>
                </div>
                <p className="text-sm text-purple-600">
                  Experience the full mobile-optimized shopping experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose Our App?
            </h2>
            <p className="text-xl text-purple-600 max-w-3xl mx-auto">
              Packed with features designed to make your shopping experience
              seamless and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`p-8 text-center hover:shadow-xl transition-all duration-500 border-0 cursor-pointer transform hover:-translate-y-2 bg-gradient-to-br ${feature.color} text-white`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="opacity-90">{feature.description}</p>
                {activeFeature === index && (
                  <div className="mt-4 p-4 bg-white/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm opacity-90">Available Now!</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/70 rounded-2xl backdrop-blur-sm shadow-lg"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-purple-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What Users Say
            </h2>
            <p className="text-xl text-purple-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who love shopping with our
              mobile app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-600">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Specific Features */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mobile-Only Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-purple-600 mb-2">
                Push Notifications
              </h4>
              <p className="text-purple-500 text-sm">
                Get instant alerts for sales, new arrivals, and order updates
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-purple-600 mb-2">Photo Search</h4>
              <p className="text-purple-500 text-sm">
                Take a photo to find similar products instantly
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-purple-600 mb-2">
                Mobile Payments
              </h4>
              <p className="text-purple-500 text-sm">
                Apple Pay, Google Pay, and biometric authentication
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-purple-600 mb-2">Offline Mode</h4>
              <p className="text-purple-500 text-sm">
                Browse saved products even without internet
              </p>
            </div>
          </div>

          {/* Mobile Demo Section */}
          {isMobile && (
            <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-purple-600 mb-4">
                  You're on Mobile! 📱
                </h3>
                <p className="text-purple-600 mb-6">
                  You're already experiencing our mobile-optimized site! Try
                  these mobile features:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => {
                      // Simulate photo search
                      alert(
                        "📷 Photo search would open your camera to find similar products!",
                      );
                    }}
                  >
                    <Camera className="mr-2 w-4 h-4" />
                    Try Photo Search
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    onClick={() => {
                      // Add to home screen prompt simulation
                      alert(
                        "📱 Add to Home Screen: Tap your browser menu → Add to Home Screen",
                      );
                    }}
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    Add to Home Screen
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Demo Buttons */}
          {!isMobile && (
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">
                Test Mobile Experience
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4"
                  onClick={() => {
                    // Open in mobile simulator
                    const mobileUrl = window.location.origin;
                    window.open(
                      mobileUrl,
                      "mobile-demo",
                      "width=375,height=812,toolbar=no,menubar=no,scrollbars=yes,resizable=yes",
                    );
                  }}
                >
                  <Smartphone className="mr-2 w-5 h-5" />
                  Open Mobile Simulator
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4"
                  onClick={() => {
                    // Check if we're on mobile device
                    const isMobile =
                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent,
                      );

                    if (isMobile) {
                      // On mobile: navigate to mobile simulation
                      window.location.href =
                        "/?mobile=true&device=mobile&simulation=true";
                    } else {
                      // On desktop: navigate to mobile simulation in new tab
                      window.open(
                        "/?mobile=true&device=mobile&simulation=true",
                        "_blank",
                      );
                    }
                  }}
                >
                  <Eye className="mr-2 w-5 h-5" />
                  Switch to Mobile View
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Download CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Shopping?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Download Lilly's Fashion Couture app now and experience luxury
              shopping like never before. Available for iOS and Android.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-transform hover:scale-105"
                onClick={() =>
                  window.open(
                    "https://apps.apple.com/app/lillys-fashion",
                    "_blank",
                  )
                }
              >
                <Download className="mr-3 w-6 h-6" />
                Download for iOS
              </Button>
              <Button
                className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-transform hover:scale-105"
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.lillys.fashion",
                    "_blank",
                  )
                }
              >
                <Play className="mr-3 w-6 h-6" />
                Get on Android
              </Button>
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
                  👑 Membership
                </Link>
                <span className="block text-lg font-medium text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">
                  📱 Mobile App
                </span>
                <div className="pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mb-4"
                    onClick={() => {
                      setShowMobileMenu(false);
                      window.open(
                        "https://apps.apple.com/app/lillys-fashion",
                        "_blank",
                      );
                    }}
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download App
                  </Button>
                  <ShoppingCart
                    cartItems={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    onCheckout={handleCheckout}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Demo Popout */}
      {showMobileDemo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileDemo(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Phone Frame */}
            <div
              className="mx-auto"
              style={{ width: "300px", height: "600px" }}
            >
              <div className="relative w-full h-full bg-black rounded-[2.5rem] p-2 shadow-2xl">
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="bg-gray-100 h-8 flex items-center justify-between px-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <span className="ml-2 font-semibold">Lilly's</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>100%</span>
                      <div className="w-6 h-3 border border-black rounded-sm">
                        <div className="w-full h-full bg-green-500 rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* App Content */}
                  <iframe
                    src="/"
                    className="w-full h-full border-0"
                    style={{
                      height: "calc(100% - 32px)",
                      transform: "scale(0.85)",
                      transformOrigin: "top left",
                      width: "118%",
                    }}
                  />
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-1 bg-white rounded-full opacity-60"></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 text-center">
              <h3 className="text-white text-lg font-semibold mb-2">
                Mobile Preview
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Experience the mobile-optimized interface
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    const iframe = document.querySelector("iframe");
                    if (iframe) {
                      iframe.src = "/collections";
                    }
                  }}
                >
                  Collections
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    const iframe = document.querySelector("iframe");
                    if (iframe) {
                      iframe.src = "/shop/jewelry";
                    }
                  }}
                >
                  Shop
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    setShowMobileDemo(false);
                    // Check if mobile device
                    const isMobile =
                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent,
                      );

                    if (isMobile) {
                      // For mobile: open in new tab
                      window.open("/", "_blank");
                    } else {
                      // For desktop: navigate current window
                      window.location.href = "/";
                    }
                  }}
                >
                  Open Full Site
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
