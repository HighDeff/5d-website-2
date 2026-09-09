import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  X,
  Home,
  Grid3X3,
  ShoppingBag,
  Search,
  Heart,
  User,
  Star,
  Plus,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { useUserAuth } from "@/hooks/useUserAuth";
import FavoritesService from "@/services/FavoritesService";

interface MobileAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileApp({ isOpen, onClose }: MobileAppProps) {
  const [currentPage, setCurrentPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {},
  );
  const { cartItems, addToCart } = useShoppingCart();
  const { currentUser } = useUserAuth();

  const allProducts = [
    // Featured Products Section
    {
      id: "black-elegance-dress",
      name: "Black Elegance Dress",
      price: 285,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933",
      category: "Clothing",
      rating: 4.8,
      badge: "New Arrival",
    },
    {
      id: "ocean-dreams-dress",
      name: "Ocean Dreams Dress",
      price: 320,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3",
      category: "Clothing",
      rating: 4.6,
      badge: "Artistic",
    },
    {
      id: "rainbow-burst-scarf",
      name: "Rainbow Burst Scarf",
      price: 185,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145",
      category: "Shoes & Accessories",
      rating: 4.9,
      badge: "Colorful",
    },
    {
      id: "azure-pattern-top",
      name: "Azure Pattern Top",
      price: 245,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c",
      category: "Clothing",
      rating: 4.7,
      badge: "Patterned",
    },
    {
      id: "classic-plaid-robe",
      name: "Classic Plaid Robe",
      price: 165,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605",
      category: "Home & Kitchen",
      rating: 4.5,
      badge: "Comfort",
    },
    // Premium Showcase Section
    {
      id: "blue-daisy-dress",
      name: "Blue Daisy Dress",
      price: 295,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fc15060186fc94e5586b70291e8647e98",
      category: "Clothing",
      rating: 4.8,
      badge: "Floral",
    },
    {
      id: "silver-metallic-dress",
      name: "Silver Metallic Dress",
      price: 385,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Ff8c285ee3c4c4d97ac1282d61ad30f7d",
      category: "Clothing",
      rating: 4.9,
      badge: "Metallic",
    },
    {
      id: "navy-floral-shorts",
      name: "Navy Floral Shorts",
      price: 145,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F3369878a736a4948877a7c9df2752887",
      category: "Clothing",
      rating: 4.6,
      badge: "Navy Floral",
    },
    {
      id: "axe-ice-chill-deodorant",
      name: "AXE Ice Chill Deodorant",
      price: 12,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb48aaef84c5d4e5fa9960bc14ba3849e",
      category: "Beauty",
      rating: 4.4,
      badge: "Men's Care",
    },
    {
      id: "blue-geometric-tie",
      name: "Blue Geometric Tie",
      price: 75,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fec6faad76e0a4127a1b1793b6e79281f",
      category: "Shoes & Accessories",
      rating: 4.7,
      badge: "Professional",
    },
    {
      id: "premium-hand-soap",
      name: "Premium Hand Soap",
      price: 8,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb63f0de2c2464a0d8288e436d1dcbc11",
      category: "Beauty",
      rating: 4.3,
      badge: "Premium",
    },
  ];

  const categories = [
    { id: "jewelry", name: "Jewelry", icon: "💎", link: "/shop/jewelry" },
    { id: "clothing", name: "Clothing", icon: "👗", link: "/shop/clothing" },
    {
      id: "home",
      name: "Home & Kitchen",
      icon: "🏠",
      link: "/shop/home-kitchen",
    },
    {
      id: "shoes",
      name: "Shoes & Accessories",
      icon: "👠",
      link: "/shop/shoes-accessories",
    },
    { id: "beauty", name: "Beauty", icon: "💄", link: "/shop/beauty" },
  ];

  // Initialize favorites state
  useEffect(() => {
    const userId = currentUser?.id;
    const favorites = FavoritesService.getFavorites(userId);
    const favStates: Record<string, boolean> = {};
    favorites.forEach((productId) => {
      favStates[productId] = true;
    });
    setFavoriteStates(favStates);
  }, [currentUser]);

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleToggleFavorite = (productId: string, sellerId?: string) => {
    const userId = currentUser?.id;
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const HomePage = () => (
    <div className="space-y-6 pb-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome to Lilly's</h2>
        <p className="text-pink-100">
          Discover luxury fashion at your fingertips
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setCurrentPage("categories")}
          className="h-16 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 flex-col shadow-md"
        >
          <Grid3X3 className="w-6 h-6 mb-1" />
          <span className="text-sm">Shop All</span>
        </Button>
        <Button
          onClick={() => setCurrentPage("search")}
          className="h-16 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 flex-col shadow-md"
        >
          <Search className="w-6 h-6 mb-1" />
          <span className="text-sm">Search</span>
        </Button>
      </div>

      {/* Featured Products - Desktop Style Cards */}
      <div>
        <h3 className="text-lg font-bold mb-4">Featured Products</h3>
        <div className="grid grid-cols-2 gap-4">
          {allProducts.slice(0, 6).map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-slate-100"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-36 object-cover hover:scale-105 transition-transform duration-500"
                    style={{
                      filter: "brightness(0.75) contrast(1.5) saturate(1.3)",
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Badge className="absolute top-2 left-2 text-xs bg-black text-white">
                    ✨ {product.badge}
                  </Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => handleToggleFavorite(product.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${favoriteStates[product.id] ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {product.category}
                  </p>
                  <div className="flex mb-2">{renderStars(product.rating)}</div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-pink-600 text-sm">
                      ${product.price}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-xs"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div>
        <h3 className="text-lg font-bold mb-4">New Arrivals</h3>
        <div className="space-y-3">
          {allProducts.slice(6, 9).map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden shadow-lg bg-white"
            >
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover"
                      style={{
                        filter: "brightness(0.75) contrast(1.5) saturate(1.3)",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Badge className="absolute top-1 left-1 text-xs bg-green-600 text-white">
                      NEW
                    </Badge>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm">{product.name}</h4>
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                        <Heart className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {product.category}
                    </p>
                    <div className="flex mb-2">
                      {renderStars(product.rating)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-pink-600 text-sm">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-pink-500 hover:bg-pink-600 px-3 py-1 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Premium Collection */}
      <div>
        <h3 className="text-lg font-bold mb-4">Premium Collection</h3>
        <div className="grid grid-cols-1 gap-4">
          {allProducts.slice(9).map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden shadow-xl bg-gradient-to-r from-purple-50 to-pink-50"
            >
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-28 h-28 object-cover"
                      style={{
                        filter: "brightness(0.75) contrast(1.5) saturate(1.3)",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Badge className="absolute top-2 left-2 text-xs bg-purple-600 text-white">
                      PREMIUM
                    </Badge>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-base mb-1">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.category}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex mb-3">
                      {renderStars(product.rating)}
                      <span className="ml-2 text-xs text-gray-500">
                        ({product.rating})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-purple-600 text-lg">
                        ${product.price}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-800">Shopping Cart</h4>
              <p className="text-sm text-gray-600">{cartItems.length} items</p>
            </div>
            <Button
              size="sm"
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CategoriesPage = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Shop Categories</h2>
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.link}
            onClick={onClose}
            className="block"
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-semibold">{category.name}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );

  const SearchPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Search Products</h2>
        <Input
          type="text"
          placeholder="What are you looking for?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
      </div>

      {!searchQuery && (
        <div>
          <h3 className="font-semibold mb-3">All Products</h3>
          <div className="space-y-3">
            {allProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-3">
                  <div className="flex space-x-3">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        style={{
                          filter:
                            "brightness(0.75) contrast(1.5) saturate(1.3)",
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0">
                        {product.badge}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">
                        {product.category}
                      </p>
                      <div className="flex mb-2">
                        {renderStars(product.rating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-pink-600">
                          ${product.price}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="bg-pink-500 hover:bg-pink-600"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchQuery && (
        <div>
          <h3 className="font-semibold mb-3">
            Search Results ({" "}
            {
              allProducts.filter(
                (product) =>
                  product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  product.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  product.badge
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              ).length
            }{" "}
            found)
          </h3>
          <div className="space-y-3">
            {allProducts
              .filter(
                (product) =>
                  product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  product.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  product.badge
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              )
              .map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-3">
                    <div className="flex space-x-3">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                          style={{
                            filter:
                              "brightness(0.75) contrast(1.5) saturate(1.3)",
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0">
                          {product.badge}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {product.category}
                        </p>
                        <div className="flex mb-2">
                          {renderStars(product.rating)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-pink-600">
                            ${product.price}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  const ProductsPage = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">All Products</h2>

      {/* Product Categories Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {["All", ...categories.map((cat) => cat.name.split(" ")[0])].map(
          (filter) => (
            <Button
              key={filter}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              {filter}
            </Button>
          ),
        )}
      </div>

      {/* All Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {allProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                  style={{
                    filter: "brightness(0.75) contrast(1.5) saturate(1.3)",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Badge className="absolute top-2 left-2 text-xs">
                  {product.badge}
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleToggleFavorite(product.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${favoriteStates[product.id] ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-sm mb-1 truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                <div className="flex mb-2">{renderStars(product.rating)}</div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-pink-600 text-sm">
                    ${product.price}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-xs"
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Contact Us</h2>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-pink-600" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-sm text-gray-600">+1 (555) 123-ROSE</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-pink-600" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-gray-600">bloom@lillysfashion.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-pink-600" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-sm text-gray-600">
                123 Blossom Boulevard
                <br />
                New York, NY 10001
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full bg-pink-500 hover:bg-pink-600">Call Now</Button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Mobile App Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
        <h1 className="text-lg font-bold">LILLY'S Mobile</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content Area */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24"
        style={{ height: "calc(100vh - 140px)" }}
      >
        {currentPage === "home" && <HomePage />}
        {currentPage === "categories" && <CategoriesPage />}
        {currentPage === "products" && <ProductsPage />}
        {currentPage === "search" && <SearchPage />}
        {currentPage === "contact" && <ContactPage />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="grid grid-cols-5 gap-1">
          <Button
            variant={currentPage === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentPage("home")}
            className="flex-col h-12"
          >
            <Home className="w-4 h-4 mb-1" />
            <span className="text-xs">Home</span>
          </Button>

          <Button
            variant={currentPage === "categories" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentPage("categories")}
            className="flex-col h-12"
          >
            <Grid3X3 className="w-4 h-4 mb-1" />
            <span className="text-xs">Shop</span>
          </Button>

          <Button
            variant={currentPage === "products" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentPage("products")}
            className="flex-col h-12"
          >
            <ShoppingBag className="w-4 h-4 mb-1" />
            <span className="text-xs">Products</span>
          </Button>

          <Button
            variant={currentPage === "search" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentPage("search")}
            className="flex-col h-12"
          >
            <Search className="w-4 h-4 mb-1" />
            <span className="text-xs">Search</span>
          </Button>

          <Button
            variant={currentPage === "contact" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentPage("contact")}
            className="flex-col h-12"
          >
            <Phone className="w-4 h-4 mb-1" />
            <span className="text-xs">Contact</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
