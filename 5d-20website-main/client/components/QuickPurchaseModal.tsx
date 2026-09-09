import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  CreditCard,
  X,
} from "lucide-react";
import SimpleCheckout from "./SimpleCheckout";
import { useUserAuth } from "../hooks/useUserAuth";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  category?: string;
  condition?: string;
  sellerId: string;
  sellerName: string;
  status?: string;
}

interface QuickPurchaseModalProps {
  product: Product;
  trigger?: React.ReactNode;
  onSuccess?: (paymentDetails: any) => void;
  className?: string;
}

const QuickPurchaseModal: React.FC<QuickPurchaseModalProps> = ({
  product,
  trigger,
  onSuccess,
  className = "",
}) => {
  const { currentUser } = useUserAuth();

  // Safety check - return null if product is invalid
  if (!product || !product.id) {
    console.warn('QuickPurchaseModal: Invalid product provided');
    return null;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const handlePaymentSuccess = (paymentDetails: any) => {
    console.log("Purchase completed:", paymentDetails);
    setPurchaseComplete(true);

    // Close modal after 3 seconds
    setTimeout(() => {
      setIsOpen(false);
      setPurchaseComplete(false);
    }, 3000);

    if (onSuccess) {
      onSuccess(paymentDetails);
    }
  };

  const defaultTrigger = (
    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
      <ShoppingBag className="w-4 h-4 mr-2" />
      Buy Now
    </Button>
  );

  if (purchaseComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="max-w-md">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Purchase Complete! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Our AI is processing your order and
              the seller will contact you soon!
            </p>
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium">What happens next:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                <li>AI analyzes optimal shipping method</li>
                <li>Seller receives payment notification</li>
                <li>You'll get tracking info via email</li>
                <li>Automatic reward evaluation</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className={className}>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Quick Purchase</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Details */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images?.[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              {product.status === "sold" && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    SOLD
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-3xl font-bold text-purple-600 mb-3">
                ${product.price.toFixed(2)}
              </p>

              {product.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {product.description}
                </p>
              )}

              <div className="space-y-2 text-sm">
                {product.category && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                )}
                {product.condition && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Condition:</span>
                    <span className="font-medium capitalize">
                      {product.condition}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2">Seller</h4>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {product.sellerName?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {product.sellerName || 'Unknown Seller'}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>5.0 rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-medium text-green-800 mb-2">
                ✅ Purchase Benefits
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Secure PayPal payment protection</li>
                <li>• AI-optimized shipping</li>
                <li>• Automatic reward evaluation</li>
                <li>• 24/7 customer support</li>
                <li>• Return protection available</li>
              </ul>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            {product.status === "sold" ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Item Sold
                </h3>
                <p className="text-red-700">
                  This item has already been purchased by another buyer.
                </p>
              </div>
            ) : !currentUser ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Sign In Required
                </h3>
                <p className="text-blue-700 mb-4">
                  Please sign in to purchase this item.
                </p>
                <Button
                  onClick={() => (window.location.href = "/auth")}
                  className="bg-blue-600 text-white"
                >
                  Sign In / Sign Up
                </Button>
              </div>
            ) : currentUser.id === product.sellerId ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Your Item
                </h3>
                <p className="text-gray-700">
                  You cannot purchase your own item.
                </p>
              </div>
            ) : (
              <SimpleCheckout
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  sellerId: product.sellerId,
                  sellerName: product.sellerName,
                  description: product.description,
                }}
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                  console.error("Payment failed:", error);
                }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickPurchaseModal;
