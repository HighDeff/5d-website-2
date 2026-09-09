import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  MessageSquare,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Bot,
  Zap,
  Target,
  Users,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import OffersManager from "../components/OffersManager";
import OfferManagementService from "../services/OfferManagementService";
import LiveAIOfferMonitoring from "../services/LiveAIOfferMonitoring";
import AuthGuard from "../components/AuthGuard";

const LiveOffers: React.FC = () => {
  const { user, allProducts } = useUserAuth();
  const [activeTab, setActiveTab] = useState("manage");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [offerForm, setOfferForm] = useState({
    type: "buy_offer" as Offer["type"],
    offeredPrice: "",
    message: "",
    paymentMethod: "paypal" as "paypal" | "cashapp" | "crypto",
    urgency: "medium" as "low" | "medium" | "high",
    conditions: [] as string[],
  });
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [loading, setLoading] = useState(false);

  const [offerStats, setOfferStats] = useState<any>(null);

  useEffect(() => {
    // Load offer statistics
    if (user) {
      const stats = OfferManagementService.getOfferStats();
      setOfferStats(stats);
    }
  }, [user]);

  const filteredProducts = allProducts.filter(
    (product) =>
      product.status === "active" &&
      product.sellerId !== user?.id &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleCreateOffer = async () => {
    if (!user || !selectedProduct || !offerForm.offeredPrice) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const result = await OfferManagementService.sendOffer({
        itemId: selectedProduct.id,
        itemName: selectedProduct.name,
        itemImage: selectedProduct.images?.[0] || selectedProduct.image || "",
        originalPrice: selectedProduct.price,
        offeredPrice: parseFloat(offerForm.offeredPrice),
        sellerId: selectedProduct.sellerId,
        buyerId: user.id,
        message: offerForm.message,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create offer");
      }

      alert("Offer created successfully!");
      setShowCreateOffer(false);
      setSelectedProduct(null);
      setOfferForm({
        type: "buy_offer",
        offeredPrice: "",
        message: "",
        paymentMethod: "paypal",
        urgency: "medium",
        conditions: [],
      });
      setActiveTab("manage");
    } catch (error) {
      console.error("Failed to create offer:", error);
      alert(error instanceof Error ? error.message : "Failed to create offer");
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (originalPrice: number, offerPrice: number) => {
    const discount = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const getPriceValidation = (originalPrice: number, offerPrice: number) => {
    const discount = calculateDiscount(originalPrice, offerPrice);

    if (discount < 0) {
      return {
        type: "warning",
        message: "Offer is higher than asking price",
        color: "text-orange-600",
      };
    } else if (discount > 70) {
      return {
        type: "error",
        message: "Offer may be too low to be accepted",
        color: "text-red-600",
      };
    } else if (discount > 40) {
      return {
        type: "warning",
        message: "Significant discount - consider negotiation",
        color: "text-yellow-600",
      };
    } else if (discount > 10) {
      return {
        type: "success",
        message: "Good negotiation opportunity",
        color: "text-green-600",
      };
    } else {
      return {
        type: "info",
        message: "Close to asking price",
        color: "text-blue-600",
      };
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">
                  Live Offers
                </h1>
                <p className="text-sm text-gray-600">
                  Make offers, negotiate prices, and close deals with AI
                  assistance
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600">Real Database</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-600">AI Monitoring</span>
                  </div>
                  {user && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-purple-600">
                        Signed in: {user.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-purple-700">
                <Bot className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Button
                onClick={() => setActiveTab("create")}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Offer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="manage">
              <MessageSquare className="w-4 h-4 mr-2" />
              My Offers
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </TabsTrigger>
            <TabsTrigger value="browse">
              <Search className="w-4 h-4 mr-2" />
              Browse Products
            </TabsTrigger>
          </TabsList>

          {/* Offers Management */}
          <TabsContent value="manage">
            {offerStats && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {offerStats.total}
                    </div>
                    <div className="text-sm text-gray-600">Total Offers</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {offerStats.pending}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {offerStats.accepted}
                    </div>
                    <div className="text-sm text-gray-600">Accepted</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {offerStats.acceptanceRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Acceptance Rate</div>
                  </div>
                </Card>
              </div>
            )}
            <OffersManager />
          </TabsContent>

          {/* Create Offer */}
          <TabsContent value="create" className="space-y-6">
            {!selectedProduct ? (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Product</CardTitle>
                  <p className="text-gray-600">
                    Choose a product to make an offer on
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts.slice(0, 9).map((product) => (
                        <Card
                          key={product.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <CardContent className="p-4">
                            <img
                              src={product.images[0] || "/placeholder.jpg"}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <h4 className="font-semibold truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              by {product.sellerName}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-purple-600">
                                ${product.price}
                              </span>
                              <Badge variant="outline">
                                {product.category}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No products found</p>
                        <p className="text-sm">
                          Try adjusting your search terms
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Offer Creation Form */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <img
                        src={selectedProduct.images[0] || "/placeholder.jpg"}
                        alt={selectedProduct.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {selectedProduct.name}
                        </h3>
                        <p className="text-gray-600">
                          by {selectedProduct.sellerName}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-2xl font-bold text-purple-600">
                            ${selectedProduct.price}
                          </span>
                          <Badge variant="outline">
                            {selectedProduct.category}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedProduct(null)}
                        className="w-full"
                      >
                        Choose Different Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Offer Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create Your Offer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="offerType">Offer Type</Label>
                        <select
                          id="offerType"
                          value={offerForm.type}
                          onChange={(e) =>
                            setOfferForm({
                              ...offerForm,
                              type: e.target.value as Offer["type"],
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="buy_offer">Buy Offer</option>
                          <option value="bid">Bid</option>
                          <option value="trade_request">Trade Request</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="offeredPrice">
                          Your Offer Price{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="offeredPrice"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={offerForm.offeredPrice}
                            onChange={(e) =>
                              setOfferForm({
                                ...offerForm,
                                offeredPrice: e.target.value,
                              })
                            }
                            className="pl-10"
                          />
                        </div>
                        {offerForm.offeredPrice && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Discount:</span>
                              <span className="font-semibold">
                                {calculateDiscount(
                                  selectedProduct.price,
                                  parseFloat(offerForm.offeredPrice),
                                )}
                                %
                              </span>
                            </div>
                            {(() => {
                              const validation = getPriceValidation(
                                selectedProduct.price,
                                parseFloat(offerForm.offeredPrice),
                              );
                              return (
                                <div
                                  className={`flex items-center space-x-1 text-xs mt-1 ${validation.color}`}
                                >
                                  {validation.type === "error" ? (
                                    <AlertCircle className="h-3 w-3" />
                                  ) : validation.type === "success" ? (
                                    <CheckCircle className="h-3 w-3" />
                                  ) : (
                                    <Bot className="h-3 w-3" />
                                  )}
                                  <span>{validation.message}</span>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Add a message to your offer..."
                          rows={3}
                          value={offerForm.message}
                          onChange={(e) =>
                            setOfferForm({
                              ...offerForm,
                              message: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="paymentMethod">Payment Method</Label>
                          <select
                            id="paymentMethod"
                            value={offerForm.paymentMethod}
                            onChange={(e) =>
                              setOfferForm({
                                ...offerForm,
                                paymentMethod: e.target
                                  .value as typeof offerForm.paymentMethod,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="paypal">PayPal</option>
                            <option value="cashapp">Cash App</option>
                            <option value="crypto">Crypto</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="urgency">Urgency</Label>
                          <select
                            id="urgency"
                            value={offerForm.urgency}
                            onChange={(e) =>
                              setOfferForm({
                                ...offerForm,
                                urgency: e.target
                                  .value as typeof offerForm.urgency,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold flex items-center space-x-2 mb-2">
                          <Bot className="h-4 w-4" />
                          <span>AI Assistant</span>
                        </h4>
                        <p className="text-sm text-blue-800">
                          Your offer will be analyzed by AI for market
                          reasonableness, user reliability, and negotiation
                          potential. The system may automatically process
                          high-confidence offers or provide recommendations to
                          the seller.
                        </p>
                      </div>

                      <Button
                        onClick={handleCreateOffer}
                        disabled={loading || !offerForm.offeredPrice || !user}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Offer...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Create Offer
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Browse Products */}
          <TabsContent value="browse">
            <Card>
              <CardHeader>
                <CardTitle>Browse Products</CardTitle>
                <p className="text-gray-600">
                  Discover products you can make offers on
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products to make offers on..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-4">
                          <img
                            src={product.images[0] || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold truncate mb-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            by {product.sellerName}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-purple-600">
                              ${product.price}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedProduct(product);
                              setActiveTab("create");
                            }}
                          >
                            <Target className="w-3 h-3 mr-1" />
                            Make Offer
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No products available for offers</p>
                      <p className="text-sm">
                        Check back later or adjust your search
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ProtectedLiveOffers = () => {
  return (
    <AuthGuard>
      <LiveOffers />
    </AuthGuard>
  );
};

export default ProtectedLiveOffers;
