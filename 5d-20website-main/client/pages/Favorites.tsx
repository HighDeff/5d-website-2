import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  Eye,
  Trash2,
  Star,
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  RotateCcw,
  Activity,
  Clock,
  Brain,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import ProductPopout from "@/components/ProductPopout";

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sellerId: string;
  sellerName: string;
  rating?: number;
  favorites: number;
  views: number;
  badge?: string;
  dateAdded?: string;
  status: "favorite" | "unfavorite" | "deleted" | "restored";
}

const Favorites: React.FC = () => {
  const { currentUser, isSignedIn, allProducts } = useUserAuth();
  const { addToCart } = useShoppingCart();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductPopout, setShowProductPopout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "removed" | "all">(
    "active",
  );
  const [aiStatus, setAiStatus] = useState({
    processing: false,
    queueLength: 0,
    lastUpdate: new Date().toISOString(),
    systemHealth: 100,
  });

  useEffect(() => {
    if (currentUser?.id) {
      loadFavorites();
    }

    // Initialize AI status monitoring
    initializeAIStatus();
  }, [currentUser]);

  const initializeAIStatus = () => {
    // Update AI status periodically
    const interval = setInterval(() => {
      setAiStatus((prev) => ({
        ...prev,
        queueLength: Math.floor(Math.random() * 5), // Simulate queue
        lastUpdate: new Date().toISOString(),
        processing: Math.random() > 0.7, // 30% chance of processing
      }));
    }, 3000);

    return () => clearInterval(interval);
  };

  const loadFavorites = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      const { default: EnhancedFavoritesManager } = await import(
        "@/services/EnhancedFavoritesManager"
      );

      const userFavorites = await EnhancedFavoritesManager.getUserFavorites(
        currentUser.id,
      );
      const favoriteProducts: FavoriteProduct[] = [];

      // Process all favorite states
      Object.entries(userFavorites).forEach(
        ([status, items]: [string, any[]]) => {
          if (Array.isArray(items)) {
            items.forEach((item) => {
              // Find product data
              const productData =
                allProducts.find((p) => p.id === item.itemId) || item;

              favoriteProducts.push({
                id: item.itemId || productData.id,
                name: productData.name || item.name || "Unknown Product",
                price: parseFloat(productData.price?.toString() || "0"),
                image: productData.image || item.image || "/placeholder.jpg",
                category: productData.category || item.category || "general",
                sellerId: productData.sellerId || item.sellerId || "unknown",
                sellerName:
                  productData.sellerName || item.sellerName || "Unknown Seller",
                rating: productData.rating || 4.5,
                favorites: productData.favorites || 0,
                views: productData.views || 0,
                dateAdded: item.addedAt || new Date().toISOString(),
                status: status as
                  | "favorite"
                  | "unfavorite"
                  | "deleted"
                  | "restored",
                badge: productData.badge || "",
              });
            });
          }
        },
      );

      // Also load from localStorage fallback
      try {
        const storedFavorites = JSON.parse(
          localStorage.getItem("userFavorites") || "{}",
        );
        Object.keys(storedFavorites).forEach((itemId) => {
          if (!favoriteProducts.find((f) => f.id === itemId)) {
            const productData = allProducts.find((p) => p.id === itemId);
            if (productData) {
              favoriteProducts.push({
                id: itemId,
                name: productData.name,
                price: parseFloat(productData.price?.toString() || "0"),
                image: productData.image || "/placeholder.jpg",
                category: productData.category || "general",
                sellerId: productData.sellerId || "unknown",
                sellerName: productData.sellerName || "Unknown Seller",
                rating: productData.rating || 4.5,
                favorites: productData.favorites || 0,
                views: productData.views || 0,
                dateAdded: new Date().toISOString(),
                status: "favorite",
              });
            }
          }
        });
      } catch (error) {
        console.error("Error loading localStorage favorites:", error);
      }

      setFavorites(favoriteProducts);
      console.log(`📱 Loaded ${favoriteProducts.length} favorites`);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const { default: EnhancedFavoritesManager } = await import(
        "@/services/EnhancedFavoritesManager"
      );

      const result = await EnhancedFavoritesManager.toggleFavorite(
        currentUser!.id,
        productId,
      );

      if (result.success) {
        setFavorites((prev) => prev.filter((f) => f.id !== productId));
        setNotifications((prev) => [...prev, "Removed from favorites"]);
        setTimeout(() => setNotifications((prev) => prev.slice(1)), 3000);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      setNotifications((prev) => [...prev, "Error removing favorite"]);
      setTimeout(() => setNotifications((prev) => prev.slice(1)), 3000);
    }
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });

    setNotifications((prev) => [...prev, `Added ${product.name} to cart!`]);
    setTimeout(() => setNotifications((prev) => prev.slice(1)), 3000);
  };

  const handleQuickView = (product: FavoriteProduct) => {
    setSelectedProduct(product);
    setShowProductPopout(true);
  };

  const getFilteredFavorites = () => {
    let filtered = favorites;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (f) =>
          f.status === activeTab ||
          (activeTab === "active" && f.status === "favorite"),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (f) => f.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.sellerName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "dateAdded":
          return (
            new Date(b.dateAdded || 0).getTime() -
            new Date(a.dateAdded || 0).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  };

  const categories = ["all", ...new Set(favorites.map((f) => f.category))];
  const filteredFavorites = getFilteredFavorites();

  const [favoriteProducts, setFavoriteProducts] = useState<{
    favorite: FavoriteProduct[];
    unfavorite: FavoriteProduct[];
    deleted: FavoriteProduct[];
    restored: FavoriteProduct[];
  }>({
    favorite: [],
    unfavorite: [],
    deleted: [],
    restored: [],
  });

  useEffect(() => {
    if (currentUser?.id) {
      loadFavorites();
      setupUpdateListeners();
    } else {
      setLoading(false);
    }

    return () => {
      removeUpdateListeners();
    };
  }, [currentUser]);

  const setupUpdateListeners = () => {
    const handleFavoritesUpdate = (event: CustomEvent) => {
      console.log("🔄 Favorites update received:", event.detail);
      loadFavorites();
    };

    const handleDashboardUpdate = (event: CustomEvent) => {
      if (event.detail.type === "favorites") {
        console.log("📊 Dashboard update received");
        loadFavorites();
      }
    };

    const handleStatusUpdate = (event: CustomEvent) => {
      if (event.detail.type === "favorites_sync") {
        console.log("📡 Sync status update received");
        setSyncStatus(event.detail);
      }
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate as any);
    window.addEventListener("dashboardUpdate", handleDashboardUpdate as any);
    window.addEventListener("statusUpdate", handleStatusUpdate as any);
  };

  const removeUpdateListeners = () => {
    window.removeEventListener("favoritesUpdated", loadFavorites as any);
    window.removeEventListener("dashboardUpdate", loadFavorites as any);
    window.removeEventListener("statusUpdate", loadFavorites as any);
  };

  const handleToggleFavorite = async (
    productId: string,
    currentStatus: string,
  ) => {
    if (!currentUser?.id) return;

    try {
      const { default: EnhancedFavoritesManager } = await import(
        "../services/EnhancedFavoritesManager"
      );

      await EnhancedFavoritesManager.toggleFavorite(currentUser.id, productId);

      // Reload favorites after a brief delay to see the change
      setTimeout(() => {
        loadFavorites();
      }, 500);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleRestoreFavorite = async (productId: string) => {
    if (!currentUser?.id) return;

    try {
      const { default: EnhancedFavoritesManager } = await import(
        "../services/EnhancedFavoritesManager"
      );

      await EnhancedFavoritesManager.restoreFavorite(currentUser.id, productId);
      loadFavorites();
    } catch (error) {
      console.error("Error restoring favorite:", error);
    }
  };

  const getFilteredProducts = (products: FavoriteProduct[]) => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const renderProductCard = (product: FavoriteProduct) => (
    <Card
      key={product.id}
      className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop";
            }}
          />

          {/* Status Badge */}
          <Badge
            className={`absolute top-2 left-2 text-xs ${
              product.status === "favorite"
                ? "bg-red-500 text-white"
                : product.status === "restored"
                  ? "bg-green-500 text-white"
                  : product.status === "deleted"
                    ? "bg-gray-500 text-white"
                    : "bg-yellow-500 text-white"
            }`}
          >
            {product.status}
          </Badge>

          {product.badge && (
            <Badge className="absolute top-2 right-2 text-xs bg-black text-white">
              ✨ {product.badge}
            </Badge>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={() => handleQuickView(product)}
            >
              <Eye className="w-3 h-3" />
            </Button>

            {product.status === "deleted" ? (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={() => handleRestoreFavorite(product.id)}
              >
                <RotateCcw className="w-3 h-3 text-green-500" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={() => handleToggleFavorite(product.id, product.status)}
              >
                {product.status === "favorite" ? (
                  <Trash2 className="w-3 h-3 text-red-500" />
                ) : (
                  <Heart className="w-3 h-3 text-red-500" />
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2">{product.category}</p>

          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating || 5)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.views} views)
            </span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-purple-600">${product.price}</span>
            <div className="flex items-center text-xs text-gray-500">
              <Heart className="w-3 h-3 mr-1" />
              {product.favorites}
            </div>
          </div>

          {product.status === "favorite" || product.status === "restored" ? (
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add to Cart
            </Button>
          ) : (
            <div className="text-center text-xs text-gray-500 py-2">
              {product.status === "deleted"
                ? "Deleted - Click restore to add back"
                : "Unfavorited"}
            </div>
          )}

          {product.sellerName && (
            <p className="text-xs text-gray-500 mt-2">
              by {product.sellerName}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-4">
              Please sign in to view your favorites.
            </p>
            <Link to="/auth">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  const currentProducts =
    favoriteProducts[activeTab as keyof typeof favoriteProducts] || [];
  const filteredProducts = getFilteredProducts(currentProducts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-red-500" />
                  My Favorites
                </h1>
                <p className="text-sm text-gray-600">
                  AI-managed favorites with real-time synchronization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* AI Status */}
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <Badge
                  className={
                    aiStatus.processing
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {aiStatus.processing ? "Processing" : "Ready"}
                </Badge>
              </div>

              {/* Sync Status */}
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <Badge
                  className={
                    syncStatus.syncInProgress
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {syncStatus.syncInProgress ? "Syncing" : "Synced"}
                </Badge>
              </div>

              <Button onClick={loadFavorites} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="jewelry">Jewelry</option>
                <option value="clothing">Clothing</option>
                <option value="beauty">Beauty</option>
                <option value="accessories">Accessories</option>
                <option value="home">Home</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-1 shadow-sm">
            <TabsTrigger
              value="favorite"
              className="flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Favorites ({favoriteProducts.favorite.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="restored"
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Restored ({favoriteProducts.restored.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="unfavorite"
              className="flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Unfavorited ({favoriteProducts.unfavorite.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="deleted"
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Deleted ({favoriteProducts.deleted.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          {Object.entries(favoriteProducts).map(([status, products]) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                    No {status} items
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {status === "favorite"
                      ? "Start adding products to your favorites"
                      : `No ${status} items found`}
                  </p>
                  {status === "favorite" && (
                    <Link to="/collections">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                        Browse Collections
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(renderProductCard)}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Status Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>AI Queue: {aiStatus.queueLength || 0} items</span>
              <span>
                Last Sync:{" "}
                {syncStatus.lastSync
                  ? new Date(syncStatus.lastSync).toLocaleString()
                  : "Never"}
              </span>
              <span>Pending: {syncStatus.pendingUpdates || 0} updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>AI Enhanced Favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Popout */}
      {showProductPopout && selectedProduct && (
        <ProductPopout
          product={selectedProduct}
          isOpen={showProductPopout}
          onClose={() => setShowProductPopout(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Favorites;
