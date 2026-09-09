import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Send,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  User,
  Star,
  MessageSquare,
  X,
} from "lucide-react";
import { useUserAuth } from "../hooks/useUserAuth";
import OfferManagementService from "../services/OfferManagementService";

interface SendOfferButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    sellerId: string;
    sellerName: string;
  };
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
}

const SendOfferButton: React.FC<SendOfferButtonProps> = ({
  item,
  className = "",
  variant = "outline",
  size = "sm",
  showDiscount = true,
}) => {
  const { user, isSignedIn, allUsers } = useUserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [offerData, setOfferData] = useState({
    offeredPrice: "",
    message: "",
  });

  // Check if user can make an offer
  const canMakeOffer = () => {
    if (!isSignedIn || !user) {
      return { canOffer: false, reason: "Please sign in to make offers" };
    }

    if (user.id === item.sellerId) {
      return {
        canOffer: false,
        reason: "You cannot make offers on your own items",
      };
    }

    return OfferManagementService.canMakeOffer(item.id, user.id);
  };

  const eligibility = canMakeOffer();

  // Get seller information
  const seller = allUsers.find((u) => u.id === item.sellerId);

  // Calculate discount percentage
  const calculateDiscount = (offeredPrice: number): number => {
    return Math.round(((item.price - offeredPrice) / item.price) * 100);
  };

  const handleSubmit = async () => {
    if (!user || !isSignedIn) {
      setError("Please sign in to make offers");
      return;
    }

    const offeredPrice = parseFloat(offerData.offeredPrice);

    // Validation
    if (!offeredPrice || offeredPrice <= 0) {
      setError("Please enter a valid offer amount");
      return;
    }

    if (offeredPrice >= item.price) {
      setError("Offer must be less than the asking price");
      return;
    }

    if (offeredPrice < item.price * 0.5) {
      setError("Offer cannot be more than 50% below the asking price");
      return;
    }

    if (!offerData.message.trim()) {
      setError("Please include a message with your offer");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Get real seller data from database
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const seller = users.find((u: any) => u.id === item.sellerId);

      if (!seller) {
        setError("Seller not found");
        setIsSubmitting(false);
        return;
      }

      const result = await OfferManagementService.sendOffer({
        itemId: item.id,
        itemName: item.name,
        itemImage: item.image,
        originalPrice: item.price,
        offeredPrice: offeredPrice,
        sellerId: seller.id,
        buyerId: user.id,
        message: offerData.message,
      });

      if (result.success) {
        setSuccess(true);
        setOfferData({ offeredPrice: "", message: "" });

        // Show success message with offer details
        console.log("Offer sent successfully:", result.offer);

        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 3000);
      } else {
        setError(result.error || "Failed to send offer");
      }
    } catch (error) {
      console.error("Error sending offer:", error);
      setError("Failed to send offer. Please try again.");
    }

    setIsSubmitting(false);
  };

  const resetForm = () => {
    setOfferData({ offeredPrice: "", message: "" });
    setError("");
    setSuccess(false);
  };

  if (!eligibility.canOffer) {
    return (
      <div className="relative">
        <Button
          variant={variant}
          size={size}
          className={`${className} cursor-not-allowed opacity-50`}
          disabled
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Send Offer
        </Button>
        {eligibility.reason && (
          <div className="absolute bottom-full left-0 mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
            {eligibility.reason}
          </div>
        )}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Send Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>Make an Offer</span>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Offer Sent Successfully!
            </h3>
            <p className="text-green-600 text-sm">
              The seller will be notified and can accept, decline, or counter
              your offer.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Item Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&w=100&h=100&fit=crop";
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-lg font-bold text-gray-900">
                    ${item.price}
                  </p>
                  {seller && (
                    <div className="flex items-center space-x-1 mt-1">
                      <User className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {seller.name}
                      </span>
                      {seller.verified && (
                        <Star className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Offer Form */}
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="offeredPrice"
                  className="flex items-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Your Offer</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="offeredPrice"
                    type="number"
                    step="0.01"
                    min="1"
                    max={item.price - 0.01}
                    placeholder="Enter your offer"
                    value={offerData.offeredPrice}
                    onChange={(e) => {
                      setOfferData({
                        ...offerData,
                        offeredPrice: e.target.value,
                      });
                      setError("");
                    }}
                    className="pr-16"
                  />
                  {offerData.offeredPrice &&
                    parseFloat(offerData.offeredPrice) > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Badge
                          variant={
                            calculateDiscount(
                              parseFloat(offerData.offeredPrice),
                            ) <= 25
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {showDiscount && (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {calculateDiscount(
                            parseFloat(offerData.offeredPrice),
                          )}
                          % off
                        </Badge>
                      </div>
                    )}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Min: ${(item.price * 0.5).toFixed(2)}</span>
                  <span>Max: ${(item.price - 0.01).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message to Seller</span>
                </Label>
                <Textarea
                  id="message"
                  rows={3}
                  placeholder="Hi! I'm interested in your item. Would you consider my offer?"
                  value={offerData.message}
                  onChange={(e) => {
                    setOfferData({ ...offerData, message: e.target.value });
                    setError("");
                  }}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A friendly message increases your chances of acceptance
                </p>
              </div>
            </div>

            {/* Offer Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2 text-sm">
                💡 Offer Tips
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Offers 10-25% below asking price are most successful</li>
                <li>• Include a reason for your offer in your message</li>
                <li>• Be respectful - sellers can counter your offer</li>
                <li>• Offers expire in 7 days automatically</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !offerData.offeredPrice ||
                  !offerData.message.trim()
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Send className="w-4 h-4 mr-2 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Offer
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="px-4"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendOfferButton;
