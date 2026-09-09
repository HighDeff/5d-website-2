import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  ArrowRight,
  Star,
  Sparkles,
  Users,
  Award,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import SocialMediaPopup from "@/components/SocialMediaPopup";
import MobileApp from "@/components/MobileApp";
import { useShoppingCart } from "@/hooks/useShoppingCart";

export default function Index() {
  // Updated mobile navigation - v2024
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSocialPopup, setShowSocialPopup] = useState(false);
  const [showMobileApp, setShowMobileApp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [addedToCartItem, setAddedToCartItem] = useState<string | null>(null);

  const { cartItems, addToCart, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  const handleAddToCart = (productData: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  }) => {
    addToCart(productData);
    setAddedToCartItem(productData.name);
    setTimeout(() => setAddedToCartItem(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Falling Flowers Animation */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="lily-fall lily-1">🌹</div>
        <div className="lily-fall lily-2">🌺</div>
        <div className="lily-fall lily-3">🌻</div>
        <div className="lily-fall lily-4">🌷</div>
        <div className="lily-fall lily-5">🌹</div>
        <div className="lily-fall lily-6">🌸</div>
        <div className="lily-fall lily-7">🌺</div>
        <div className="lily-fall lily-8">🌻</div>
      </div>

      {/* Realistic Flower Decorations at Top */}
      <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
        <div className="relative h-20 overflow-hidden">
          {/* Left side - Pink roses isolated */}
          <div className="absolute top-2 left-4 opacity-70">
            <img
              src="https://images.pexels.com/photos/7291705/pexels-photo-7291705.jpeg"
              alt="Pink roses isolated"
              className="w-28 h-20 object-contain animate-pulse drop-shadow-lg flower-decoration"
            />
          </div>

          {/* Center - Pink lilies isolated */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 opacity-75">
            <img
              src="https://images.pexels.com/photos/132466/pexels-photo-132466.jpeg"
              alt="Pink lilies isolated"
              className="w-24 h-28 object-contain animate-bounce drop-shadow-lg flower-decoration"
              style={{
                animationDelay: "1s",
              }}
            />
          </div>

          {/* Right side - Orange flowers isolated */}
          <div className="absolute top-2 right-4 opacity-70">
            <img
              src="https://images.pexels.com/photos/65589/flower-orange-bright-garden-flower-65589.jpeg"
              alt="Orange flowers isolated"
              className="w-28 h-20 object-contain animate-pulse drop-shadow-lg flower-decoration"
              style={{
                animationDelay: "2s",
              }}
            />
          </div>

          {/* Additional smaller decorative flowers */}
          <div className="absolute top-6 left-1/4 opacity-50">
            <img
              src="https://images.pexels.com/photos/7291705/pexels-photo-7291705.jpeg"
              alt="Pink roses accent"
              className="w-20 h-14 object-contain animate-bounce drop-shadow-md flower-decoration"
              style={{
                animationDelay: "0.5s",
              }}
            />
          </div>
          <div className="absolute top-4 right-1/4 opacity-55">
            <img
              src="https://images.pexels.com/photos/132466/pexels-photo-132466.jpeg"
              alt="Pink lilies accent"
              className="w-18 h-22 object-contain animate-pulse drop-shadow-md flower-decoration"
              style={{
                animationDelay: "1.5s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/10 bg-white/20 backdrop-blur-md supports-[backdrop-filter]:bg-white/15 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                LILLY'S
              </h1>
              <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
                <Link
                  to="/collections"
                  className="hover:text-primary transition-colors"
                >
                  COLLECTIONS
                </Link>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  ABOUT
                </Link>
                <a
                  href="#atelier"
                  className="hover:text-primary transition-colors"
                >
                  ATELIER
                </a>
                <a
                  href="#contact"
                  className="hover:text-primary transition-colors"
                >
                  CONTACT
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="ml-1 hidden lg:inline">Filter</span>
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
                className="xl:hidden flex"
                onClick={() => setShowMobileMenu(true)}
                title="Open Menu"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="xl:hidden flex items-center space-x-1"
                onClick={() => setShowMobileApp(true)}
                title="Open Mobile App"
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Mobile</span>
              </Button>
              <Button size="sm" className="hidden lg:inline-flex">
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Featured Products Header */}
      <section className="py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            <div className="flex justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F9f9f5e0484a343fe810daef579fa8ac1?format=webp&width=800"
                alt="Luxury burgundy handbag"
                className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{
                  filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                  mixBlendMode: "multiply",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <div className="flex justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F98c9162090064a05a85343bf31be8930?format=webp&width=800"
                alt="Blue evil eye protective bracelet"
                className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{
                  filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                  mixBlendMode: "multiply",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <div className="flex justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fad71e3b8a0b74bd7bdf9c6564286c0b8?format=webp&width=800"
                alt="Pink luxury lingerie"
                className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{
                  filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                  mixBlendMode: "multiply",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <div className="flex justify-center hidden md:block">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F58b088204c5941629cce86cf5b2878f9?format=webp&width=800"
                alt="White gold clover necklace"
                className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{
                  filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                  mixBlendMode: "multiply",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <div className="flex justify-center hidden lg:block">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Ff3a40d7520804d348e817d35756fc207?format=webp&width=800"
                alt="Designer blue patterned leggings"
                className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{
                  filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                  mixBlendMode: "multiply",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <div className="flex justify-center hidden lg:block">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F30c05568e663495381159e3834a93778?format=webp&width=800"
                alt="Gold and teal jewelry bracelet"
                className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{
                  filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                  mixBlendMode: "multiply",
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-8 text-sm font-medium border-primary/30 bg-white/80 backdrop-blur"
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              HAUTE COUTURE COLLECTION 2024
            </Badge>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight leading-none">
              <span className="block text-gray-800">LILLY'S</span>
              <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
                COUTURE
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Where floral elegance meets exquisite jewelry. Experience bespoke
              fashion adorned with nature's beauty and luxurious details.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/collections">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg"
                >
                  Explore Collections
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-primary/30 hover:bg-primary/10 bg-white/80 backdrop-blur"
              >
                Book Private Fitting
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Flower Elements */}
        <div className="absolute top-20 left-10 hidden xl:block opacity-30">
          <img
            src="https://images.pexels.com/photos/32745902/pexels-photo-32745902.jpeg"
            alt="Pink roses floating"
            className="w-20 h-14 object-contain animate-pulse rounded-full shadow-lg"
            style={{
              filter: "brightness(1.3) contrast(1.4) saturate(1.2)",
              mixBlendMode: "multiply",
              backgroundColor: "transparent",
            }}
          />
        </div>
        <div className="absolute top-1/3 right-16 hidden xl:block opacity-25">
          <img
            src="https://images.pexels.com/photos/12924123/pexels-photo-12924123.jpeg"
            alt="White lilies floating"
            className="w-16 h-20 object-contain animate-bounce shadow-lg rounded-lg"
            style={{
              animationDelay: "0.5s",
              filter: "brightness(1.3) contrast(1.4) saturate(1.2)",
              mixBlendMode: "multiply",
              backgroundColor: "transparent",
            }}
          />
        </div>
        <div className="absolute bottom-32 left-1/4 hidden xl:block opacity-20">
          <img
            src="https://images.pexels.com/photos/32731193/pexels-photo-32731193.jpeg"
            alt="Orange tulips floating"
            className="w-18 h-12 object-contain animate-pulse rounded-full shadow-lg"
            style={{
              animationDelay: "1s",
              filter: "brightness(1.3) contrast(1.4) saturate(1.2)",
              mixBlendMode: "multiply",
              backgroundColor: "transparent",
            }}
          />
        </div>
        <div className="absolute bottom-20 right-1/3 hidden xl:block opacity-18">
          <img
            src="https://images.pexels.com/photos/32745902/pexels-photo-32745902.jpeg"
            alt="Pink roses accent"
            className="w-14 h-10 object-contain animate-bounce rounded-full shadow-lg"
            style={{
              animationDelay: "1.5s",
              filter: "brightness(1.3) contrast(1.4) saturate(1.2)",
              mixBlendMode: "multiply",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-gradient-to-br from-white via-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-purple-800 bg-clip-text text-transparent">
              Exceptional Craftsmanship
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Every piece tells a story of meticulous attention to detail,
              adorned with nature's beauty and luxurious accents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative w-20 h-20 mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl opacity-20"></div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F9f9f5e0484a343fe810daef579fa8ac1?format=webp&width=800"
                  alt="Luxury handbag collection"
                  className="w-full h-full rounded-2xl object-contain border-2 border-pink-200 p-2"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Luxury Handbags
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Exquisite handbags crafted with premium materials, featuring
                unique textures and sophisticated designs for the modern woman
              </p>
            </div>

            <div className="text-center group">
              <div className="relative w-20 h-20 mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl opacity-20"></div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F58b088204c5941629cce86cf5b2878f9?format=webp&width=800"
                  alt="White gold clover jewelry"
                  className="w-full h-full rounded-2xl object-contain border-2 border-purple-200 p-2"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Fine Jewelry
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Stunning jewelry pieces featuring precious metals and elegant
                designs, crafted to complement your couture wardrobe with
                timeless sophistication
              </p>
            </div>

            <div className="text-center group">
              <div className="relative w-20 h-20 mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl opacity-20"></div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fad71e3b8a0b74bd7bdf9c6564286c0b8?format=webp&width=800"
                  alt="Luxury lingerie collection"
                  className="w-full h-full rounded-2xl object-contain border-2 border-pink-200 p-2"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Intimate Collection
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Luxurious intimate apparel crafted from the finest materials,
                designed for comfort, elegance, and feminine confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products from Each Category */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover our handpicked selection from each category, featuring
              the latest designs and premium quality craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {/* Black Elegant Dress - Clothing */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-50 to-slate-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800"
                  alt="Black Elegant Dress"
                  className="w-full h-64 md:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500 p-2 md:p-4 lg:p-6"
                  style={{
                    filter: "brightness(0.75) contrast(1.5) saturate(1.3)",
                    mixBlendMode: "normal",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black text-white">✨ New Arrival</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3 md:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                  <h3 className="text-lg md:text-xl font-bold mb-1 sm:mb-0">
                    Black Elegance Dress
                  </h3>
                  <span className="text-lg md:text-xl font-bold text-gray-800">
                    $285
                  </span>
                </div>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 mobile-text">
                  Sophisticated black dress with premium fabric and elegant
                  silhouette
                </p>
                <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                  <Badge variant="outline" className="text-xs md:text-sm">
                    Clothing
                  </Badge>
                  <Badge variant="outline" className="text-xs md:text-sm">
                    Premium
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
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
                  <Link to="/product/black-elegance-dress">
                    <Button variant="outline" className="px-6 py-3">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Blue Tie-Dye Dress - Clothing */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-cyan-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800"
                  alt="Blue Tie-Dye Dress"
                  className="w-full h-96 object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500 text-white">🎨 Artistic</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Ocean Dreams Dress</h3>
                  <span className="text-xl font-bold text-blue-600">$320</span>
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
                  <Link to="/product/ocean-dreams-dress">
                    <Button variant="outline" className="px-6 py-3">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Rainbow Tie-Dye Scarf - Accessories */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-yellow-50 to-orange-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800"
                  alt="Rainbow Tie-Dye Scarf"
                  className="w-full h-96 object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-rainbow bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 text-white">
                    🌈 Rainbow
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
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
                    Accessories
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    Colorful
                  </Badge>
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
                  <Link to="/product/rainbow-burst-scarf">
                    <Button variant="outline" className="px-6 py-3">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Blue Patterned Top - Clothing */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-teal-50 to-blue-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800"
                  alt="Blue Patterned Top"
                  className="w-full h-96 object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-teal-500 text-white">🌊 Pattern</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Azure Pattern Top</h3>
                  <span className="text-xl font-bold text-teal-600">$245</span>
                </div>
                <p className="text-gray-600 text-base mb-4">
                  Intricate blue pattern design with comfortable fit and elegant
                  style
                </p>
                <div className="flex space-x-2 mb-4">
                  <Badge variant="outline" className="text-sm">
                    Clothing
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    Patterned
                  </Badge>
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
                  <Link to="/product/azure-pattern-top">
                    <Button variant="outline" className="px-6 py-3">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Red Plaid Robe - Home & Kitchen */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-red-50 to-rose-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800"
                  alt="Red Plaid Robe"
                  className="w-full h-96 object-contain group-hover:scale-105 transition-transform duration-500 p-6"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white">🏠 Comfort</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Classic Plaid Robe</h3>
                  <span className="text-xl font-bold text-red-600">$165</span>
                </div>
                <p className="text-gray-600 text-base mb-4">
                  Cozy red plaid robe perfect for relaxing at home with premium
                  comfort
                </p>
                <div className="flex space-x-2 mb-4">
                  <Badge variant="outline" className="text-sm">
                    Home & Kitchen
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    Comfort
                  </Badge>
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
                  <Link to="/product/classic-plaid-robe">
                    <Button variant="outline" className="px-6 py-3">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              New Additions
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Fresh arrivals from our latest collections, featuring innovative
              designs and seasonal favorites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Repeat the same products with "New" badges and different styling */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3?format=webp&width=800"
                  alt="Ocean Dreams Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
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
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800"
                  alt="Rainbow Burst Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
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
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c?format=webp&width=800"
                  alt="Azure Pattern Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white text-sm">
                    ✨ Just Added
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
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605?format=webp&width=800"
                  alt="Classic Comfort Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
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
                  Timeless plaid for cozy moments
                </p>
                <span className="text-lg font-bold text-primary">$165</span>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800"
                  alt="Black Elegance Collection"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
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
                  Sophisticated black pieces for any occasion
                </p>
                <span className="text-lg font-bold text-primary">$285</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Signature Collections
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover our curated selection of floral-inspired pieces, luxury
              accessories, and timeless elegance that captures nature's beauty
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Jewelry */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-violet-100 relative">
              <div className="p-8 h-96 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F58b088204c5941629cce86cf5b2878f9?format=webp&width=800"
                    alt="Gold clover necklace"
                    className="w-24 h-24 object-contain rounded-lg"
                    style={{
                      filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                      mixBlendMode: "multiply",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-purple-500 text-white border-none text-base px-4 py-2">
                    ✨ Jewelry
                  </Badge>
                  <h3 className="text-3xl font-bold mb-4 text-gray-800">
                    Fine Jewelry
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Exquisite jewelry featuring protective designs and spiritual
                    motifs.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-purple-600">
                    From $650
                  </span>
                  <Link to="/shop/jewelry">
                    <Button
                      variant="outline"
                      className="group-hover:bg-purple-500 group-hover:text-white transition-colors border-purple-300 text-lg px-6 py-3"
                    >
                      Shop
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Home & Kitchen */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-green-50 to-emerald-100 relative">
              <div className="p-8 h-96 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F9f9f5e0484a343fe810daef579fa8ac1?format=webp&width=800"
                    alt="Home & Kitchen essentials"
                    className="w-24 h-24 object-contain rounded-lg"
                    style={{
                      filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                      mixBlendMode: "multiply",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-green-500 text-white border-none text-base px-4 py-2">
                    🏠 Home & Kitchen
                  </Badge>
                  <h3 className="text-3xl font-bold mb-4 text-gray-800">
                    Home Essentials
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Elegant home and kitchen items that bring luxury to daily
                    life.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">
                    From $145
                  </span>
                  <Link to="/shop/home-kitchen">
                    <Button
                      variant="outline"
                      className="group-hover:bg-green-500 group-hover:text-white transition-colors border-green-300 text-lg px-6 py-3"
                    >
                      Shop
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Clothing - Made Darker for Intimate Collections */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-800 to-slate-900 relative">
              <div className="p-8 h-96 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-80">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fad71e3b8a0b74bd7bdf9c6564286c0b8?format=webp&width=800"
                    alt="Luxury intimate clothing"
                    className="w-24 h-24 object-contain rounded-lg"
                    style={{
                      filter: "brightness(1.3) contrast(1.4) saturate(1.2)",
                      mixBlendMode: "multiply",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-gray-900 text-white border-none text-base px-4 py-2">
                    👗 Intimate Collection
                  </Badge>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Fashion Collection
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Luxurious clothing and intimate apparel for elegant
                    confidence.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-pink-400">
                    From $125
                  </span>
                  <Link to="/shop/clothing">
                    <Button
                      variant="outline"
                      className="group-hover:bg-pink-500 group-hover:text-white transition-colors border-pink-400 text-white text-lg px-6 py-3"
                    >
                      Shop
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Shoes & Accessories */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-amber-50 to-orange-100 relative">
              <div className="p-8 h-96 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F9f9f5e0484a343fe810daef579fa8ac1?format=webp&width=800"
                    alt="Luxury handbag"
                    className="w-24 h-24 object-contain rounded-lg"
                    style={{
                      filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                      mixBlendMode: "multiply",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-amber-500 text-white border-none text-base px-4 py-2">
                    👠 Shoes & Accessories
                  </Badge>
                  <h3 className="text-3xl font-bold mb-4 text-gray-800">
                    Luxury Accessories
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Complete your look with premium shoes and sophisticated
                    accessories.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-600">
                    From $380
                  </span>
                  <Link to="/shop/shoes-accessories">
                    <Button
                      variant="outline"
                      className="group-hover:bg-amber-500 group-hover:text-white transition-colors border-amber-300 text-lg px-6 py-3"
                    >
                      Shop
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Beauty */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-teal-50 to-cyan-100 relative">
              <div className="p-8 h-96 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-60">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F30c05568e663495381159e3834a93778?format=webp&width=800"
                    alt="Beauty products"
                    className="w-24 h-24 object-contain rounded-lg"
                    style={{
                      filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                      mixBlendMode: "multiply",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-teal-500 text-white border-none text-base px-4 py-2">
                    💄 Beauty
                  </Badge>
                  <h3 className="text-3xl font-bold mb-4 text-gray-800">
                    Beauty Collection Beauty Collection
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Premium skincare, elegant fragrances, and makeup essentials.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-teal-600">
                    From $95
                  </span>
                  <Link to="/shop/beauty">
                    <Button
                      variant="outline"
                      className="group-hover:bg-teal-500 group-hover:text-white transition-colors border-teal-300 text-lg px-6 py-3"
                    >
                      Shop
                    </Button>
                  </Link>
                </div>
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* Blue Daisy Dress - Clothing */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fc15060186fc94e5586b70291e8647e98?format=webp&width=800"
                  alt="Blue Daisy Summer Dress"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
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
                <div className="flex space-x-2 mt-3">
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
                  <Link to="/product/blue-daisy-dress">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Silver Metallic Dress - Clothing */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-50 to-slate-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Ff8c285ee3c4c4d97ac1282d61ad30f7d?format=webp&width=800"
                  alt="Silver Metallic Dress"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
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
                  className="w-full mt-3 bg-gray-700 hover:bg-gray-800"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>

            {/* Navy Floral Shorts - Clothing */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-navy-50 to-blue-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F3369878a736a4948877a7c9df2752887?format=webp&width=800"
                  alt="Navy Floral Shorts"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-navy-600 text-white text-sm">
                    🌸 Navy Floral
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Navy Floral Shorts</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Comfortable shorts with delicate floral print
                </p>
                <span className="text-lg font-bold text-navy-600">$145</span>
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
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>

            {/* AXE Ice Chill Deodorant - Beauty */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-cyan-50 to-blue-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb48aaef84c5d4e5fa9960bc14ba3849e?format=webp&width=800"
                  alt="AXE Ice Chill Deodorant"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
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
                  className="w-full mt-3 bg-cyan-500 hover:bg-cyan-600"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>

            {/* Blue Geometric Tie - Accessories */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fec6faad76e0a4127a1b1793b6e79281f?format=webp&width=800"
                  alt="Blue Geometric Tie"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
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
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>

            {/* Hand Soap - Beauty */}
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-pink-50 to-purple-100 relative cursor-move">
              <div className="relative overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb63f0de2c2464a0d8288e436d1dcbc11?format=webp&width=800"
                  alt="Premium Hand Soap"
                  className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  style={{
                    filter: "brightness(1.2) contrast(1.3) saturate(1.1)",
                    mixBlendMode: "multiply",
                    backgroundColor: "transparent",
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-pink-500 text-white text-sm">
                    🧼 Care
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Premium Hand Soap</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Gentle cleansing with moisturizing formula
                </p>
                <span className="text-lg font-bold text-pink-600">$8</span>
                <Button
                  onClick={() =>
                    handleAddToCart({
                      id: "premium-hand-soap",
                      name: "Premium Hand Soap",
                      price: 8,
                      image:
                        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb63f0de2c2464a0d8288e436d1dcbc11?format=webp&width=800",
                      category: "Beauty",
                    })
                  }
                  className="w-full mt-3 bg-pink-500 hover:bg-pink-600"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Experience the difference that true craftsmanship makes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  "The attention to detail and quality of craftsmanship is
                  unparalleled. Every piece feels like a work of art."
                </p>
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-sm opacity-75">Executive Director</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  "Lilly's team understood my vision perfectly. The bespoke
                  service exceeded all my expectations."
                </p>
                <div>
                  <p className="font-semibold">Maria Rodriguez</p>
                  <p className="text-sm opacity-75">Fashion Designer</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  "Timeless elegance meets modern sophistication. I've never
                  felt more confident in my wardrobe."
                </p>
                <div>
                  <p className="font-semibold">James Mitchell</p>
                  <p className="text-sm opacity-75">CEO</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Ready to Bloom in Style?
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Schedule a private consultation with our expert stylists and
            discover the art of floral couture, luxury jewelry, and bespoke
            fashion.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg"
            >
              <Heart className="mr-3 w-5 h-5" />
              Book Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-purple-300 hover:bg-purple-50 bg-white/80 backdrop-blur"
            >
              View Lookbook
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
                LILLY'S FASHION COUTURE
              </h3>
              <p className="text-lg opacity-90 mb-6 max-w-md">
                Creating timeless elegance through floral-inspired fashion,
                luxury jewelry, and exceptional craftsmanship since 1985.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-pink-300/30 text-pink-200 hover:bg-pink-200 hover:text-purple-900"
                  onClick={() => setShowSocialPopup(true)}
                >
                  Follow Us
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-pink-200">
                Collections
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/shop/jewelry"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Jewelry
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/home-kitchen"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Home & Kitchen
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/clothing"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Clothing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/shoes-accessories"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Shoes & Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/beauty"
                    className="opacity-75 hover:opacity-100 hover:text-pink-200 transition-all"
                  >
                    Beauty
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-purple-200">
                Contact
              </h4>
              <ul className="space-y-3 opacity-75">
                <li>123 Blossom Boulevard</li>
                <li>New York, NY 10001</li>
                <li>+1 (555) 123-ROSE</li>
                <li>bloom@lillysfashion.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center opacity-75">
            <p>
              &copy; 2024 Lilly's Fashion Couture. Where elegance blooms. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Traditional Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  LILLY'S
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                >
                  ✕
                </Button>
              </div>

              <nav className="space-y-6">
                <div>
                  <Link
                    to="/"
                    className="block text-lg font-medium text-gray-800 hover:text-pink-600 transition-colors py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    HOME
                  </Link>
                </div>

                <div>
                  <Link
                    to="/collections"
                    className="block text-lg font-medium text-gray-800 hover:text-pink-600 transition-colors py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    COLLECTIONS
                  </Link>

                  <div className="ml-4 mt-2 space-y-2">
                    <Link
                      to="/shop/jewelry"
                      className="block text-gray-600 hover:text-pink-600 transition-colors py-1"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      💎 Jewelry
                    </Link>
                    <Link
                      to="/shop/home-kitchen"
                      className="block text-gray-600 hover:text-pink-600 transition-colors py-1"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      🏠 Home & Kitchen
                    </Link>
                    <Link
                      to="/shop/clothing"
                      className="block text-gray-600 hover:text-pink-600 transition-colors py-1"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👗 Clothing
                    </Link>
                    <Link
                      to="/shop/shoes-accessories"
                      className="block text-gray-600 hover:text-pink-600 transition-colors py-1"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👠 Shoes & Accessories
                    </Link>
                    <Link
                      to="/shop/beauty"
                      className="block text-gray-600 hover:text-pink-600 transition-colors py-1"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      💄 Beauty
                    </Link>
                  </div>
                </div>

                <div>
                  <Link
                    to="/about"
                    className="block text-lg font-medium text-gray-800 hover:text-pink-600 transition-colors py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    ABOUT US
                  </Link>
                </div>

                <div>
                  <a
                    href="#atelier"
                    className="block text-lg font-medium text-gray-800 hover:text-pink-600 transition-colors py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    ATELIER
                  </a>
                </div>

                <div>
                  <a
                    href="#contact"
                    className="block text-lg font-medium text-gray-800 hover:text-pink-600 transition-colors py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    CONTACT
                  </a>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    className="w-full mb-4"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Book Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowSocialPopup(true);
                    }}
                  >
                    Follow Us
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Mobile App */}
      <MobileApp
        isOpen={showMobileApp}
        onClose={() => setShowMobileApp(false)}
      />

      {/* Add to Cart Confirmation */}
      {addedToCartItem && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          ✅ "{addedToCartItem}" added to cart!
        </div>
      )}

      {/* Social Media Popup */}
      <SocialMediaPopup
        isOpen={showSocialPopup}
        onClose={() => setShowSocialPopup(false)}
      />
    </div>
  );
}
