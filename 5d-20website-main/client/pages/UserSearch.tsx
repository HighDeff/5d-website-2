import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  Eye,
  Heart,
  Package,
  Users,
  Crown,
  MapPin,
  Calendar,
  TrendingUp,
  Gift,
  MessageSquare,
  User,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";

interface Member {
  id: string;
  name: string;
  username: string;
  avatar: string;
  membershipType: "member" | "premium" | "regular";
  rating: number;
  totalSales: number;
  totalProducts: number;
  followers: number;
  joinDate: string;
  location: string;
  specialties: string[];
  recentProducts: Product[];
  isVerified: boolean;
  description: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  likes: number;
  views: number;
  dateAdded: string;
}

export default function UserSearch() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Mock members data
  const members: Member[] = [
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      username: "sarahjstyle",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face",
      membershipType: "premium",
      rating: 4.9,
      totalSales: 25430,
      totalProducts: 156,
      followers: 2341,
      joinDate: "2023-03-15",
      location: "New York, NY",
      specialties: [
        "Vintage Jewelry",
        "Designer Handbags",
        "Luxury Accessories",
      ],
      isVerified: true,
      description:
        "Luxury fashion curator with 10+ years experience in vintage and contemporary pieces.",
      recentProducts: [
        {
          id: "vintage-ring-001",
          name: "Art Deco Diamond Ring",
          price: 1299,
          image:
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          category: "Jewelry",
          likes: 45,
          views: 234,
          dateAdded: "2024-01-20",
        },
        {
          id: "designer-bag-002",
          name: "Chanel Classic Flap",
          price: 2850,
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          category: "Accessories",
          likes: 67,
          views: 445,
          dateAdded: "2024-01-18",
        },
      ],
    },
    {
      id: "michael-chen",
      name: "Michael Chen",
      username: "mikesfinds",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      membershipType: "member",
      rating: 4.7,
      totalSales: 12650,
      totalProducts: 89,
      followers: 1256,
      joinDate: "2023-07-22",
      location: "Los Angeles, CA",
      specialties: ["Streetwear", "Sneakers", "Urban Fashion"],
      isVerified: true,
      description:
        "Streetwear enthusiast and sneaker collector with rare finds and exclusive drops.",
      recentProducts: [
        {
          id: "sneaker-001",
          name: "Jordan 1 Retro High",
          price: 450,
          image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          category: "Shoes",
          likes: 89,
          views: 567,
          dateAdded: "2024-01-19",
        },
      ],
    },
    {
      id: "emily-davis",
      name: "Emily Davis",
      username: "emilyvintage",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      membershipType: "regular",
      rating: 4.5,
      totalSales: 5670,
      totalProducts: 34,
      followers: 678,
      joinDate: "2023-11-10",
      location: "Austin, TX",
      specialties: ["Vintage Clothing", "Bohemian Style", "Handmade Jewelry"],
      isVerified: false,
      description:
        "Vintage clothing lover and bohemian style curator. All items carefully selected and authenticated.",
      recentProducts: [
        {
          id: "vintage-dress-001",
          name: "70s Bohemian Maxi Dress",
          price: 125,
          image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          category: "Clothing",
          likes: 23,
          views: 156,
          dateAdded: "2024-01-17",
        },
      ],
    },
    {
      id: "carlos-rodriguez",
      name: "Carlos Rodriguez",
      username: "carlosantiques",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      membershipType: "premium",
      rating: 4.8,
      totalSales: 34120,
      totalProducts: 201,
      followers: 3456,
      joinDate: "2022-08-05",
      location: "Miami, FL",
      specialties: ["Antique Jewelry", "Rare Collectibles", "Estate Pieces"],
      isVerified: true,
      description:
        "Third-generation antique dealer specializing in rare jewelry and collectible pieces with provenance.",
      recentProducts: [
        {
          id: "antique-watch-001",
          name: "1950s Rolex Submariner",
          price: 8500,
          image:
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          category: "Jewelry",
          likes: 156,
          views: 1234,
          dateAdded: "2024-01-15",
        },
      ],
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesFilter =
      filterType === "all" || member.membershipType === filterType;

    return matchesSearch && matchesFilter;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "sales":
        return b.totalSales - a.totalSales;
      case "products":
        return b.totalProducts - a.totalProducts;
      case "followers":
        return b.followers - a.followers;
      case "newest":
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default:
        return 0;
    }
  });

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
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
                  to="/membership"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  👑 Membership
                </Link>
                <span className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Members
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
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-purple-600 mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Browse Members
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Discover amazing sellers, their catalogs, and unique collections
            </p>
            <div className="text-gray-500">
              {sortedMembers.length} members found
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search members, usernames, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="premium">Premium Members</SelectItem>
                  <SelectItem value="member">Regular Members</SelectItem>
                  <SelectItem value="regular">Basic Users</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="sales">Most Sales</SelectItem>
                  <SelectItem value="products">Most Products</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                  <SelectItem value="newest">Newest Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMembers.map((member) => (
              <Card
                key={member.id}
                className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleViewMember(member)}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-20 h-20 rounded-full border-4 border-purple-200"
                      />
                      {member.isVerified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mt-3">
                      {member.name}
                    </h3>
                    <p className="text-purple-600 text-sm">
                      @{member.username}
                    </p>
                    <div className="flex items-center justify-center mt-2">
                      <Badge
                        variant={
                          member.membershipType === "premium"
                            ? "default"
                            : member.membershipType === "member"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          member.membershipType === "premium"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : ""
                        }
                      >
                        {member.membershipType === "premium" && (
                          <Crown className="w-3 h-3 mr-1" />
                        )}
                        {member.membershipType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center text-sm mb-4">
                    <div>
                      <div className="flex items-center justify-center text-yellow-600 mb-1">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span className="font-semibold">{member.rating}</span>
                      </div>
                      <div className="text-gray-600 text-xs">Rating</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-green-600 mb-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">
                          ${(member.totalSales / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="text-gray-600 text-xs">Sales</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-blue-600 mb-1">
                        <Package className="w-4 h-4 mr-1" />
                        <span className="font-semibold">
                          {member.totalProducts}
                        </span>
                      </div>
                      <div className="text-gray-600 text-xs">Products</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-purple-600 mb-1">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="font-semibold">
                          {(member.followers / 1000).toFixed(1)}k
                        </span>
                      </div>
                      <div className="text-gray-600 text-xs">Followers</div>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {member.location}
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {member.specialties
                        .slice(0, 2)
                        .map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      {member.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMember(member);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to member's shop
                        window.location.href = `/shop/${member.username}`;
                      }}
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Visit Shop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No members found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Member Profile Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMemberModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 m-4 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-purple-600">
                Member Profile
              </h3>
              <Button variant="ghost" onClick={() => setShowMemberModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-24 h-24 rounded-full border-4 border-purple-200"
                  />
                  {selectedMember.isVerified && (
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedMember.name}
                </h2>
                <p className="text-purple-600">@{selectedMember.username}</p>
                <Badge
                  variant={
                    selectedMember.membershipType === "premium"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    selectedMember.membershipType === "premium"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white mt-2"
                      : "mt-2"
                  }
                >
                  {selectedMember.membershipType === "premium" && (
                    <Crown className="w-3 h-3 mr-1" />
                  )}
                  {selectedMember.membershipType.toUpperCase()} MEMBER
                </Badge>
              </div>

              {/* Description */}
              <div className="text-center">
                <p className="text-gray-600">{selectedMember.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {selectedMember.rating}
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${(selectedMember.totalSales / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedMember.totalProducts}
                  </div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {(selectedMember.followers / 1000).toFixed(1)}k
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Specialties
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recent Products */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Recent Products
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedMember.recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                      <h5 className="font-medium text-gray-800 truncate">
                        {product.name}
                      </h5>
                      <div className="text-lg font-bold text-purple-600">
                        ${product.price}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {product.likes}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {product.views}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  onClick={() => {
                    window.location.href = `/shop/${selectedMember.username}`;
                  }}
                >
                  <Store className="w-4 h-4 mr-2" />
                  Visit Shop
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `/send-offers?user=${selectedMember.username}`;
                  }}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Send Offer
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
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
                  <Users className="w-4 h-4 mr-2" />
                  Browse Members
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
