import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  CreditCard,
  Package,
  TrendingUp,
  Star,
  Eye,
  Heart,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import GuestSalesService, {
  GuestSale,
  GuestPurchase,
} from "@/services/GuestSalesService";
import QuickPurchaseModal from "@/components/QuickPurchaseModal";

// Mock guest products for demonstration
const GUEST_PRODUCTS = [
  {
    id: "guest-item-1",
    name: "Vintage Leather Jacket",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
    category: "Clothing",
    description: "Beautiful vintage leather jacket in excellent condition",
    seller: "guestuser@example.com",
    rating: 4.8,
    views: 245,
    likes: 23,
  },
  {
    id: "guest-item-2",
    name: "Handmade Ceramic Vase",
    price: 34.5,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    category: "Home & Kitchen",
    description: "Unique handmade ceramic vase perfect for any room",
    seller: "artist.ceramics@email.com",
    rating: 5.0,
    views: 167,
    likes: 31,
  },
  {
    id: "guest-item-3",
    name: "Sterling Silver Bracelet",
    price: 125.0,
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=300&fit=crop",
    category: "Jewelry",
    description: "Elegant sterling silver bracelet with intricate design",
    seller: "jewelry.maker@gmail.com",
    rating: 4.9,
    views: 398,
    likes: 56,
  },
  {
    id: "guest-item-4",
    name: "Organic Face Cream",
    price: 28.75,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop",
    category: "Beauty",
    description: "Natural organic face cream with anti-aging properties",
    seller: "natural.beauty@shop.com",
    rating: 4.7,
    views: 289,
    likes: 42,
  },
];

function GuestSalesSection() {
  const { addToCart } = useShoppingCart();
  const [guestSales, setGuestSales] = useState<GuestSale[]>([]);
  const [guestPurchases, setGuestPurchases] = useState<GuestPurchase[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    // Load guest sales and purchases
    setGuestSales(GuestSalesService.getGuestSales());
    setGuestPurchases(GuestSalesService.getGuestPurchases());
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  const handleBuyNow = (product: any) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const handlePurchaseComplete = (purchaseData: any) => {
    // Record guest purchase
    GuestSalesService.recordGuestPurchase({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      sellerId: "guest_seller",
      sellerName: selectedProduct.seller,
      amount: selectedProduct.price,
      paymentMethod: purchaseData.paymentMethod,
    });

    // Refresh guest purchases
    setGuestPurchases(GuestSalesService.getGuestPurchases());
    setShowPurchaseModal(false);
    setSelectedProduct(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const analytics = GuestSalesService.getGuestAnalytics();

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Guest Marketplace
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Shop amazing products from guest sellers. No account required -
            purchase instantly!
          </p>

          {/* Guest Analytics */}
          {(analytics.salesCount > 0 || analytics.purchaseCount > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <Card className="bg-white/60 backdrop-blur border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Your Guest Sales</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ${analytics.totalSales.toFixed(2)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Items Sold</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {analytics.salesCount}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Items Bought</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {analytics.purchaseCount}
                      </p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur rounded-xl p-6 max-w-2xl mx-auto border border-orange-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <User className="w-6 h-6 text-orange-600" />
              <span className="text-lg font-semibold text-gray-800">
                Shopping as Guest
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Create an account to keep track of your purchases and sales
              permanently
            </p>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-orange-600 to-amber-600">
                Sign Up / Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Guest Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GUEST_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur border border-orange-200"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 text-xs bg-orange-500 text-white">
                    Guest Seller
                  </Badge>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-medium">
                    ${product.price}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center mb-2">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.views} views)
                    </span>
                  </div>

                  <Badge variant="outline" className="text-xs mb-3">
                    {product.category}
                  </Badge>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Heart className="w-3 h-3 mr-1" />
                      {product.likes}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Mail className="w-3 h-3 mr-1" />
                      {product.seller.split("@")[0]}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 text-xs"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 text-xs bg-gradient-to-r from-orange-600 to-amber-600"
                    >
                      <CreditCard className="w-3 h-3 mr-1" />
                      Buy Now
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    by {product.seller}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Want to sell as a guest?
            </h3>
            <p className="text-orange-100 mb-6">
              Upload your items and start selling immediately. No account setup
              required!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/guest-upload">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-orange-600 hover:bg-orange-50"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Sell as Guest
                </Button>
              </Link>
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <User className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <QuickPurchaseModal
          product={selectedProduct}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </section>
  );
}

export default GuestSalesSection;
