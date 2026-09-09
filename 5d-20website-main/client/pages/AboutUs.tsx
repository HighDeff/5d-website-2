import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  Award,
  Heart,
  Sparkles,
  Target,
  Globe,
  Star,
  ChevronRight,
  Menu,
  ChevronDown,
  X,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";

export default function AboutUs() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const stats = [
    { number: "10,000+", label: "Happy Customers", icon: "👥" },
    { number: "5,000+", label: "Products Sold", icon: "📦" },
    { number: "50+", label: "Countries Served", icon: "🌍" },
    { number: "4.9", label: "Average Rating", icon: "⭐" },
  ];

  const team = [
    {
      name: "Lilly Chen",
      role: "Founder & Creative Director",
      image: "👩‍💼",
      bio: "Visionary leader with 15+ years in luxury fashion",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Design",
      image: "👨‍🎨",
      bio: "Award-winning designer specializing in contemporary elegance",
    },
    {
      name: "Sarah Kim",
      role: "Customer Experience Director",
      image: "👩‍💻",
      bio: "Dedicated to creating exceptional customer journeys",
    },
    {
      name: "David Thompson",
      role: "Quality Assurance Manager",
      image: "👨‍🔬",
      bio: "Ensuring every product meets our premium standards",
    },
  ];

  const values = [
    {
      icon: "✨",
      title: "Quality First",
      description:
        "Every product is carefully selected and quality-tested to meet our premium standards.",
    },
    {
      icon: "💎",
      title: "Authentic Luxury",
      description:
        "We source only genuine, high-quality items from trusted suppliers and designers.",
    },
    {
      icon: "🤝",
      title: "Customer Centric",
      description:
        "Your satisfaction is our priority. We're here to help you find your perfect style.",
    },
    {
      icon: "🌱",
      title: "Sustainable Practices",
      description:
        "Committed to ethical sourcing and environmentally responsible business practices.",
    },
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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
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
                      �� Clothing
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
                  className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-8">
            <Link to="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-lg">
              ✨ Our Story
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
              About Lilly's
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Founded with a passion for bringing luxury and elegance to
              everyday life, Lilly's has become a trusted destination for
              discerning customers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-gray-800">
                Our Journey
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  What started as a small boutique in 2020 has grown into a
                  globally recognized brand, known for our commitment to quality
                  and customer satisfaction.
                </p>
                <p>
                  Our founder, Lilly Chen, had a vision to create a shopping
                  experience that combines luxury with accessibility, bringing
                  the finest products from around the world to our customers.
                </p>
                <p>
                  Today, we continue to uphold these values while embracing
                  innovation and expanding our reach to serve customers in over
                  50 countries worldwide.
                </p>
              </div>
              <div className="mt-8">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg">
                  Learn More <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl">
                <div className="h-full bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-6">✨</div>
                    <h3 className="text-2xl font-bold mb-4">Since 2020</h3>
                    <p className="text-purple-200">
                      Crafting excellence in luxury fashion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind the Lilly's experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                <div className="p-8">
                  <div className="text-6xl mb-6">{member.image}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-2xl mb-8 leading-relaxed opacity-90">
              "To democratize luxury by making premium fashion and lifestyle
              products accessible to everyone, while maintaining the highest
              standards of quality and customer service."
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => (window.location.href = "/collections")}
                className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold"
              >
                Explore Collections
              </Button>
              <Button
                onClick={() => (window.location.href = "/contact")}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3 rounded-lg font-semibold"
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Journey
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="flex items-center space-x-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2020
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Founded</h3>
                  <p className="text-gray-600">
                    Lilly's was born from a passion for luxury fashion and a
                    vision to make it accessible.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2021
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">First 1,000 Orders</h3>
                  <p className="text-gray-600">
                    Reached our first milestone with customers from 10
                    countries.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2022
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Global Expansion</h3>
                  <p className="text-gray-600">
                    Expanded to serve customers in over 30 countries worldwide.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2023
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Award Recognition</h3>
                  <p className="text-gray-600">
                    Received multiple awards for customer service excellence and
                    product quality.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2024
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Innovation Hub</h3>
                  <p className="text-gray-600">
                    Launched our innovation platform, enabling customers to sell
                    their own products.
                  </p>
                </div>
              </div>
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
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Menu
                </h2>
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
                <Link
                  to="/about"
                  className="block text-lg font-medium text-purple-600 border-b-2 border-purple-600 pb-1"
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
                  to="/mobile-app"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  📱 Mobile App
                </Link>
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Shop</h3>
                  <div className="space-y-3 ml-4">
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
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white mt-6"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open(
                      "https://lillys-fashion-couture.myshopify.com",
                      "_blank",
                    );
                  }}
                >
                  🛒 Shopify Store
                </Button>
                <div className="flex items-center justify-center pt-4">
                  <span className="text-gray-600">
                    Cart (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
