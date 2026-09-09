import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Shield,
  Truck,
  RotateCcw,
  Check,
} from "lucide-react";
import { useShoppingCart } from "@/hooks/useShoppingCart";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  description: string;
  features?: string[];
  inStock: boolean;
  badge?: string;
}

interface ProductPopoutProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductPopout({
  product,
  isOpen,
  onClose,
}: ProductPopoutProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { addToCart } = useShoppingCart();

  if (!product) return null;

  const totalPrice = product.price * quantity;
  const savings = product.originalPrice
    ? (product.originalPrice - product.price) * quantity
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    setShowPayment(true);
  };

  const handlePayment = async (method: string) => {
    setSelectedPayment(method);
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      setTimeout(() => {
        setIsCompleted(false);
        setShowPayment(false);
        setSelectedPayment(null);
        onClose();
      }, 3000);
    }, 2000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const PaymentMethods = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-center mb-6">
        Choose Payment Method
      </h3>

      {isCompleted ? (
        <div className="text-center py-8">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600">
            Your order is being processed. You'll receive a confirmation email
            shortly.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* PayPal */}
          <Button
            onClick={() => handlePayment("paypal")}
            disabled={isProcessing}
            className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-3"
          >
            {isProcessing && selectedPayment === "paypal" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.85A.641.641 0 0 1 5.568 2.5h8.44c1.57 0 2.85.527 3.717 1.48.78.858 1.176 2.02 1.176 3.46 0 3.358-1.742 5.616-4.34 5.616h-2.65a.641.641 0 0 0-.633.74l-.7 4.438a.641.641 0 0 1-.633.556l.001.001z" />
                </svg>
                <span className="font-semibold">Pay with PayPal</span>
              </>
            )}
          </Button>

          {/* Cash App */}
          <Button
            onClick={() => handlePayment("cashapp")}
            disabled={isProcessing}
            className="h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-3"
          >
            {isProcessing && selectedPayment === "cashapp" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <Smartphone className="w-6 h-6" />
                <span className="font-semibold">Pay with Cash App</span>
              </>
            )}
          </Button>

          {/* Credit/Debit Card */}
          <Button
            onClick={() => handlePayment("card")}
            disabled={isProcessing}
            className="h-16 bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center space-x-3"
          >
            {isProcessing && selectedPayment === "card" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                <span className="font-semibold">Pay with Card</span>
              </>
            )}
          </Button>

          {/* Order Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span>
                Subtotal ({quantity} item{quantity > 1 ? "s" : ""})
              </span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>Savings</span>
                <span>-${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-2">
              <span>Tax</span>
              <span>${(totalPrice * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${(totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Product Details
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {showPayment ? (
          <PaymentMethods />
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  style={{
                    filter: "brightness(0.75) contrast(1.5) saturate(1.3)",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                />
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-black text-white">
                    ✨ {product.badge}
                  </Badge>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4 h-10 w-10 p-0"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Product Features */}
              {product.features && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Product Features</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                {product.rating && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-gray-600">
                      ({product.reviews || 0} reviews)
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                      <Badge className="bg-red-100 text-red-800">
                        Save ${product.originalPrice - product.price}
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.category === "Clothing" && (
                <div>
                  <h4 className="font-semibold mb-3">Size</h4>
                  <div className="flex space-x-2">
                    {["XS", "S", "M", "L", "XL"].map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h4 className="font-semibold mb-3">Quantity</h4>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-lg w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg">
                    Total ({quantity} item{quantity > 1 ? "s" : ""})
                  </span>
                  <span className="text-2xl font-bold text-pink-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between items-center text-green-600 mt-1">
                    <span>You save</span>
                    <span className="font-semibold">${savings.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 text-lg"
                  disabled={!product.inStock}
                >
                  Buy Now - ${(totalPrice * 1.08).toFixed(2)}
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full py-3 text-lg"
                  disabled={!product.inStock}
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>

              {/* Product Guarantees */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders over $200</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Authentic guarantee</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <RotateCcw className="w-4 h-4" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
