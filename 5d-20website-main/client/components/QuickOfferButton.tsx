import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Target,
  Bot,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useUserAuth } from "../hooks/useUserAuth";
import OffersService, { Offer } from "../services/OffersService";

interface QuickOfferButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    sellerId: string;
    sellerName: string;
  };
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const QuickOfferButton: React.FC<QuickOfferButtonProps> = ({
  product,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const { user } = useUserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offerForm, setOfferForm] = useState({
    offeredPrice: "",
    message: "",
    type: "buy_offer" as Offer["type"],
    paymentMethod: "paypal" as "paypal" | "cashapp" | "crypto",
    urgency: "medium" as "low" | "medium" | "high",
  });

  const offersService = OffersService.getInstance();

  const handleCreateQuickOffer = async () => {
    if (!user) {
      alert("Please sign in to make offers");
      return;
    }

    if (!offerForm.offeredPrice) {
      alert("Please enter an offer price");
      return;
    }

    setLoading(true);

    try {
      const offerData = {
        type: offerForm.type,
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] || "",
        originalPrice: product.price,
        offeredPrice: parseFloat(offerForm.offeredPrice),
        fromUserId: user.id,
        toUserId: product.sellerId,
        message: offerForm.message,
        paymentMethod: offerForm.paymentMethod,
        urgency: offerForm.urgency,
      };

      await offersService.createOffer(offerData);

      alert("Offer sent successfully!");
      setIsOpen(false);
      setOfferForm({
        offeredPrice: "",
        message: "",
        type: "buy_offer",
        paymentMethod: "paypal",
        urgency: "medium",
      });
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
        message: "Higher than asking price",
        color: "text-orange-600",
        icon: <AlertCircle className="h-3 w-3" />,
      };
    } else if (discount > 70) {
      return {
        type: "error",
        message: "May be too low",
        color: "text-red-600",
        icon: <AlertCircle className="h-3 w-3" />,
      };
    } else if (discount > 10) {
      return {
        type: "success",
        message: "Good negotiation range",
        color: "text-green-600",
        icon: <CheckCircle className="h-3 w-3" />,
      };
    } else {
      return {
        type: "info",
        message: "Close to asking price",
        color: "text-blue-600",
        icon: <Bot className="h-3 w-3" />,
      };
    }
  };

  // Don't show if user owns the product
  if (user?.id === product.sellerId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Target className="w-4 h-4 mr-1" />
          Make Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Preview */}
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{product.name}</h4>
              <p className="text-sm text-gray-600">by {product.sellerName}</p>
              <p className="text-lg font-bold text-purple-600">
                ${product.price}
              </p>
            </div>
          </div>

          {/* Offer Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="quickOfferPrice">
                Your Offer <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="quickOfferPrice"
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
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      {calculateDiscount(
                        product.price,
                        parseFloat(offerForm.offeredPrice),
                      )}
                      %
                    </span>
                  </div>
                  {(() => {
                    const validation = getPriceValidation(
                      product.price,
                      parseFloat(offerForm.offeredPrice),
                    );
                    return (
                      <div
                        className={`flex items-center space-x-1 text-xs ${validation.color}`}
                      >
                        {validation.icon}
                        <span>{validation.message}</span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="quickOfferMessage">Message (Optional)</Label>
              <Textarea
                id="quickOfferMessage"
                placeholder="Add a message with your offer..."
                rows={3}
                value={offerForm.message}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, message: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="quickPaymentMethod">Payment</Label>
                <select
                  id="quickPaymentMethod"
                  value={offerForm.paymentMethod}
                  onChange={(e) =>
                    setOfferForm({
                      ...offerForm,
                      paymentMethod: e.target
                        .value as typeof offerForm.paymentMethod,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="paypal">PayPal</option>
                  <option value="cashapp">Cash App</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>

              <div>
                <Label htmlFor="quickUrgency">Urgency</Label>
                <select
                  id="quickUrgency"
                  value={offerForm.urgency}
                  onChange={(e) =>
                    setOfferForm({
                      ...offerForm,
                      urgency: e.target.value as typeof offerForm.urgency,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* AI Notice */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Bot className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">
                  AI-Powered Processing
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Your offer will be analyzed by AI and may be automatically
                processed if it meets certain criteria.
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateQuickOffer}
                disabled={loading || !offerForm.offeredPrice || !user}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-1" />
                    Send Offer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickOfferButton;
