import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  DollarSign,
  Package,
  TrendingUp,
  Search,
  Filter,
  Grid,
  List,
  Menu,
  X,
  Upload,
  Folder,
  Crown,
  Info,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";

interface UserProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  status: "active" | "draft" | "sold" | "pending";
  views: number;
  likes: number;
  dateAdded: string;
  lastUpdated: string;
  collectionId?: string;
}

interface UserCollection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  productCount: number;
  dateCreated: string;
  isPublic: boolean;
}

export default function MyItems() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<"products" | "collections">(
    "products",
  );
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [isUserMember, setIsUserMember] = useState(true); // Mock user as member
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Mock user products data
  const userProducts: UserProduct[] = [
    {
      id: "1",
      name: "Vintage Diamond Ring",
      price: 599.99,
      originalPrice: 799.99,
      images: [
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1f6c37f90fc2472898c26d3667a06f9a?format=webp&width=800",
      ],
      category: "Jewelry",
      status: "active",
      views: 156,
      likes: 23,
      dateAdded: "2024-01-15",
      lastUpdated: "2024-01-20",
    },
    {
      id: "2",
      name: "Designer Silk Scarf",
      price: 89.99,
      images: [
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145?format=webp&width=800",
      ],
      category: "Accessories",
      status: "active",
      views: 89,
      likes: 12,
      dateAdded: "2024-01-18",
      lastUpdated: "2024-01-19",
    },
    {
      id: "3",
      name: "Luxury Handbag",
      price: 249.99,
      images: [
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0f43091f365e460b91e2b579d5eaf844?format=webp&width=800",
      ],
      category: "Accessories",
      status: "draft",
      views: 45,
      likes: 8,
      dateAdded: "2024-01-20",
      lastUpdated: "2024-01-20",
    },
    {
      id: "4",
      name: "Black Evening Dress",
      price: 159.99,
      images: [
        "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933?format=webp&width=800",
      ],
      category: "Clothing",
      status: "sold",
      views: 203,
      likes: 34,
      dateAdded: "2024-01-10",
      lastUpdated: "2024-01-22",
    },
  ];

  // Mock user collections data (only for members)
  const userCollections: UserCollection[] = isUserMember
    ? [
        {
          id: "1",
          name: "Vintage Jewelry Collection",
          description: "Curated vintage and antique jewelry pieces",
          coverImage:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1f6c37f90fc2472898c26d3667a06f9a?format=webp&width=800",
          productCount: 5,
          dateCreated: "2024-01-10",
          isPublic: true,
        },
        {
          id: "2",
          name: "Designer Accessories",
          description: "Premium designer bags, scarves, and accessories",
          coverImage:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0f43091f365e460b91e2b579d5eaf844?format=webp&width=800",
          productCount: 3,
          dateCreated: "2024-01-15",
          isPublic: false,
        },
      ]
    : [];

  const createCollection = () => {
    if (newCollection.name.trim()) {
      // Mock creation - in real app would call API
      alert(`Collection "${newCollection.name}" created successfully!`);
      setNewCollection({ name: "", description: "", isPublic: true });
      setShowCreateCollection(false);
    }
  };

  const filteredProducts = userProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      case "sold":
        return "bg-blue-500";
      case "pending":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "draft":
        return "Draft";
      case "sold":
        return "Sold";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const totalEarnings = userProducts
    .filter((product) => product.status === "sold")
    .reduce((sum, product) => sum + product.price * 0.9, 0); // 90% after commission

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
                <span className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">
                  📦 My Items
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
            <Link to="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              My Items
            </h1>
            <p className="text-gray-600 mb-6">
              Manage your products and track your sales
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Items
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        {userProducts.length}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Listings
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {
                          userProducts.filter((p) => p.status === "active")
                            .length
                        }
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Items Sold
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {userProducts.filter((p) => p.status === "sold").length}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Earnings
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        ${totalEarnings.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs for Products and Collections */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === "products" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("products")}
                className="rounded-md"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </Button>
              {isUserMember && (
                <Button
                  variant={activeTab === "collections" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("collections")}
                  className="rounded-md"
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Collections
                  <Badge className="ml-2 bg-purple-600 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Member
                  </Badge>
                </Button>
              )}
            </div>

            {activeTab === "collections" && isUserMember && (
              <Button
                onClick={() => setShowCreateCollection(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search your items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Link to="/admin/products">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </Link>
            </div>
          </div>

          {/* Products View */}
          {activeTab === "products" && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Start by adding your first product"}
                  </p>
                  <Link to="/admin/products">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First Item
                    </Button>
                  </Link>
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
                    <Card
                      key={product.id}
                      className="shadow-xl bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300"
                    >
                      {viewMode === "grid" ? (
                        <div>
                          <div className="relative">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge
                                className={`${getStatusColor(product.status)} text-white`}
                              >
                                {getStatusText(product.status)}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-lg font-bold text-green-600">
                                  ${product.price}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {product.views}
                                </span>
                                <span className="flex items-center">
                                  <Star className="w-4 h-4 mr-1" />
                                  {product.likes}
                                </span>
                              </div>
                              <span>
                                {new Date(
                                  product.dateAdded,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      ) : (
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-800">
                                  {product.name}
                                </h3>
                                <Badge
                                  className={`${getStatusColor(product.status)} text-white`}
                                >
                                  {getStatusText(product.status)}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-lg font-bold text-green-600">
                                    ${product.price}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-4">
                                    {product.category}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {product.views}
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="w-4 h-4 mr-1" />
                                    {product.likes}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Collections View */}
          {activeTab === "collections" && isUserMember && (
            <div className="space-y-6">
              {userCollections.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No collections yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create your first collection to organize your products
                  </p>
                  <Button
                    onClick={() => setShowCreateCollection(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Collection
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCollections.map((collection) => (
                    <Card
                      key={collection.id}
                      className="shadow-xl bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="relative">
                        {collection.coverImage && (
                          <img
                            src={collection.coverImage}
                            alt={collection.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={
                              collection.isPublic ? "default" : "secondary"
                            }
                          >
                            {collection.isPublic ? "Public" : "Private"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2">
                          {collection.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>{collection.productCount} items</span>
                          <span>
                            Created{" "}
                            {new Date(
                              collection.dateCreated,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Non-member message for collections */}
          {activeTab === "collections" && !isUserMember && (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Collections are for Members Only
              </h3>
              <p className="text-gray-500 mb-6">
                Upgrade to membership to create and manage collections
              </p>
              <div className="space-x-4">
                <Link to="/membership">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Member
                  </Button>
                </Link>
                <Link to="/learn-more">
                  <Button variant="outline">
                    <Info className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Create Collection Modal */}
      {showCreateCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateCollection(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 m-4 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-purple-600">
                Create Collection
              </h3>
              <Button
                variant="ghost"
                onClick={() => setShowCreateCollection(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Name *
                </label>
                <Input
                  value={newCollection.name}
                  onChange={(e) =>
                    setNewCollection((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Vintage Jewelry"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) =>
                    setNewCollection((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your collection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newCollection.isPublic}
                  onChange={(e) =>
                    setNewCollection((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium text-gray-700"
                >
                  Make collection public (others can view)
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateCollection(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={createCollection}
                disabled={!newCollection.name.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Create Collection
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
                  📦 My Items (Active)
                </span>
                <Link
                  to="/membership"
                  className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  👑 Membership
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
