// User Shop Page - Individual user's shop with collections and products
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Package,
  Heart,
  Eye,
  ShoppingBag,
  Store,
  User,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";
import { CATEGORY_STRUCTURE } from "@/data/productDatabase";
import QuickOfferButton from "@/components/QuickOfferButton";

interface UserShopProps {}

const UserShop: React.FC<UserShopProps> = () => {
  const { username } = useParams<{ username: string }>();
  const { allUsers, allProducts, currentUser } = useUserAuth();

  const [shopOwner, setShopOwner] = useState<any>(null);
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("collections");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadShopData();
  }, [username, allUsers, allProducts]);

  const loadShopData = () => {
    if (!username) return;

    setLoading(true);
    try {
      // Find shop owner by username
      const owner = allUsers.find((user) => user.username === username);
      if (!owner) {
        setLoading(false);
        return;
      }

      setShopOwner(owner);

      // Get owner's products
      const products = allProducts.filter(
        (product) => product.sellerId === owner.id,
      );
      setShopProducts(products);

      // Group products by category to create collections
      const categoryGroups = products.reduce((groups: any, product) => {
        const category = product.category || "Other";
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(product);
        return groups;
      }, {});

      // Create collections from categories
      const shopCollections = Object.entries(categoryGroups).map(
        ([category, products]: [string, any]) => {
          const categoryData =
            CATEGORY_STRUCTURE[category as keyof typeof CATEGORY_STRUCTURE];
          return {
            id: category.toLowerCase().replace(/\s+/g, "-"),
            name: category,
            description: `${category} items from ${owner.name}'s collection`,
            itemCount: products.length,
            image:
              products[0]?.images[0] ||
              `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop`,
            products: products,
            subcategories: categoryData ? Object.keys(categoryData) : [],
          };
        },
      );

      setCollections(shopCollections);
    } catch (error) {
      console.error("Error loading shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    let products = selectedCollection
      ? collections.find((c) => c.id === selectedCollection)?.products || []
      : shopProducts;

    if (searchQuery) {
      products = products.filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      products = products.filter(
        (product: any) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    return products;
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shop...</p>
        </div>
      </div>
    );
  }

  if (!shopOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Shop Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The shop you're looking for doesn't exist.
          </p>
          <Link to="/users">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse All Sellers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/users">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sellers
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-purple-700">
                {shopProducts.length} Products
              </Badge>
              <Badge variant="secondary" className="text-blue-700">
                {collections.length} Collections
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={shopOwner.avatar || shopOwner.profileImage}
              alt={shopOwner.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{shopOwner.name}'s Shop</h1>
                {shopOwner.verified && (
                  <Badge className="bg-white/20 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge className="bg-white/20 text-white">
                  <Award className="w-3 h-3 mr-1" />
                  {shopOwner.membershipLevel}
                </Badge>
              </div>
              <p className="text-purple-100 mb-3">
                {shopOwner.bio ||
                  `Welcome to ${shopOwner.name}'s shop! Browse our collection of amazing products.`}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-purple-100">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {shopOwner.rating.toFixed(1)} rating
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {shopProducts.length} products
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {new Date(shopOwner.memberSince).getFullYear()}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {shopOwner.salesCount} sales
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <QuickOfferButton
                sellerId={shopOwner.id}
                sellerName={shopOwner.name}
                className="bg-white text-purple-600 hover:bg-gray-100"
              />
              {shopOwner.preferences?.publicProfile && (
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab("collections");
                setSelectedCollection(null);
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "collections"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Collections ({collections.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("products");
                setSelectedCollection(null);
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              All Products ({shopProducts.length})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "about"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              About
            </button>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Collections View */}
        {activeTab === "collections" && !selectedCollection && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Collections
              </h2>
              <p className="text-gray-600">
                Browse products organized by category
              </p>
            </div>

            {collections.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Collections Yet
                </h3>
                <p className="text-gray-500">
                  This seller hasn't added any products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <Card
                    key={collection.id}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                    onClick={() => setSelectedCollection(collection.id)}
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-medium">
                        {collection.itemCount} items
                      </div>
                      {collection.subcategories.length > 0 && (
                        <div className="absolute top-8 right-2 bg-purple-500 text-white rounded-full px-2 py-1 text-xs">
                          {collection.subcategories.length} categories
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-purple-600">
                          {collection.itemCount} products
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Collection View */}
        {activeTab === "collections" && selectedCollection && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCollection(null)}
                  className="mb-2"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Collections
                </Button>
                <h2 className="text-2xl font-bold text-gray-800">
                  {collections.find((c) => c.id === selectedCollection)?.name}{" "}
                  Collection
                </h2>
                <p className="text-gray-600">
                  {
                    collections.find((c) => c.id === selectedCollection)
                      ?.description
                  }
                </p>
              </div>
              <Badge variant="secondary" className="text-purple-700">
                {filteredProducts.length} products
              </Badge>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-medium text-green-600">
                        ${product.price}
                      </div>
                      <div className="absolute bottom-2 left-2 flex space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Eye className="w-3 h-3" />
                          <span>{product.views}</span>
                          <Heart className="w-3 h-3" />
                          <span>{product.favorites}</span>
                        </div>
                        <Badge
                          variant={
                            product.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {product.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Products View */}
        {activeTab === "products" && (
          <div>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Categories</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.name}>
                      {collection.name}
                    </option>
                  ))}
                </select>

                <div className="flex bg-gray-100 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {filteredProducts.length} results
                  </Badge>
                </div>
              </div>
            </div>

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id}>
                    <Card
                      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md ${
                        viewMode === "list" ? "flex flex-row" : ""
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list" ? "w-32 h-24" : "h-48"
                        } ${viewMode === "grid" ? "rounded-t-lg" : "rounded-l-lg"}`}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-medium text-green-600">
                          ${product.price}
                        </div>
                      </div>
                      <CardContent
                        className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
                      >
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>{product.views}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About {shopOwner.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Shop Stats
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Products:</span>
                      <span className="font-medium">{shopProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Sales:</span>
                      <span className="font-medium">
                        {shopOwner.salesCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {shopOwner.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Level:</span>
                      <Badge variant="secondary">
                        {shopOwner.membershipLevel}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Shop Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-medium">
                        {new Date(shopOwner.memberSince).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Active:</span>
                      <span className="font-medium">
                        {new Date(shopOwner.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Collections:</span>
                      <span className="font-medium">{collections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified:</span>
                      <span className="font-medium">
                        {shopOwner.verified ? "✅ Yes" : "❌ No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {shopOwner.bio && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">About</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {shopOwner.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserShop;
