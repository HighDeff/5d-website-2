import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle,
  Loader,
  DollarSign,
  Shield,
  User,
  Mail,
  MapPin,
} from "lucide-react";
import { useUserAuth } from "../hooks/useUserAuth";
import AIManagementService from "../services/AIManagementService";

interface Product {
  id: string;
  name: string;
  price: number;
  sellerId: string;
  sellerName: string;
  description?: string;
}

interface SimpleCheckoutProps {
  product: Product;
  onSuccess?: (orderDetails: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

const SimpleCheckout: React.FC<SimpleCheckoutProps> = ({
  product,
  onSuccess,
  onError,
  className = "",
}) => {
  const { currentUser } = useUserAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const [paymentData, setPaymentData] = useState({
    method: "paypal",
    paypalEmail: "",
    cashappTag: "",
    contactInfo: {
      firstName: currentUser?.name?.split(" ")[0] || "",
      lastName: currentUser?.name?.split(" ")[1] || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const platformFee =
    product.price * (currentUser?.membershipLevel === "member" ? 0.1 : 0.15);
  const totalAmount = product.price;
  const sellerAmount = product.price - platformFee;

  const handlePurchase = async () => {
    if (!currentUser) {
      alert("Please sign in to make a purchase");
      return;
    }

    // Validate payment info
    if (paymentData.method === "paypal" && !paymentData.paypalEmail) {
      alert("Please enter your PayPal email");
      return;
    }

    if (paymentData.method === "cashapp" && !paymentData.cashappTag) {
      alert("Please enter your CashApp tag");
      return;
    }

    if (!paymentData.contactInfo.firstName || !paymentData.contactInfo.email) {
      alert("Please fill in your contact information");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        productName: product.name,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        amount: totalAmount,
        platformFee,
        sellerAmount,
        paymentMethod: paymentData.method,
        paymentInfo:
          paymentData.method === "paypal"
            ? { paypalEmail: paymentData.paypalEmail }
            : { cashappTag: paymentData.cashappTag },
        contactInfo: paymentData.contactInfo,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Save order
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedOrders = [...existingOrders, order];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      // Simulate payment processing
      console.log("🛒 Processing order:", order);

      // Simulate payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mark order as completed
      const completedOrder = {
        ...order,
        status: "completed",
        completedAt: new Date().toISOString(),
      };
      const finalOrders = updatedOrders.map((o) =>
        o.id === order.id ? completedOrder : o,
      );
      localStorage.setItem("orders", JSON.stringify(finalOrders));

      // Trigger AI processing (simulating PayPal completion)
      const paymentForAI = {
        id: order.id,
        productId: product.id,
        description: product.name,
        amount: totalAmount,
        sellerId: product.sellerId,
        buyerId: currentUser.id,
        platformFee,
        sellerAmount,
        status: "completed" as const,
      };

      // Process with AI system
      await AIManagementService.processPaymentCompletion(order.id);

      setOrderDetails(completedOrder);
      setSuccess(true);

      if (onSuccess) {
        onSuccess(completedOrder);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      if (onError) {
        onError(error);
      }
      alert("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success && orderDetails) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Order Confirmed! 🎉
          </h3>
          <p className="text-green-700 mb-4">
            Your order has been processed successfully. You'll receive payment
            instructions via email.
          </p>
          <div className="bg-green-100 rounded-lg p-4 text-sm text-green-800 space-y-2">
            <p>
              <strong>Order ID:</strong> {orderDetails.id.slice(-8)}
            </p>
            <p>
              <strong>Total:</strong> ${orderDetails.amount.toFixed(2)}
            </p>
            <p>
              <strong>Payment Method:</strong> {orderDetails.paymentMethod}
            </p>
            <div className="border-t border-green-300 pt-2 mt-2">
              <p className="font-medium">Next Steps:</p>
              <ul className="text-left list-disc list-inside space-y-1 mt-1">
                <li>Check your email for payment instructions</li>
                <li>Complete payment to secure your item</li>
                <li>Seller will contact you for delivery</li>
                <li>AI will optimize shipping and rewards</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Complete Purchase</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Order Summary</h4>
          <div className="space-y-1 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>Item Price:</span>
              <span>${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                Platform Fee ({((platformFee / product.price) * 100).toFixed(0)}
                %):
              </span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-blue-300 pt-1 flex justify-between font-medium">
              <span>Total to Pay:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="text-xs text-blue-600 mt-2">
              Seller receives: ${sellerAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Payment Method</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={paymentData.method === "paypal" ? "default" : "outline"}
              onClick={() =>
                setPaymentData({ ...paymentData, method: "paypal" })
              }
              className="h-12"
            >
              PayPal
            </Button>
            <Button
              variant={paymentData.method === "cashapp" ? "default" : "outline"}
              onClick={() =>
                setPaymentData({ ...paymentData, method: "cashapp" })
              }
              className="h-12"
            >
              CashApp
            </Button>
          </div>

          {paymentData.method === "paypal" && (
            <div className="space-y-2">
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input
                id="paypalEmail"
                type="email"
                placeholder="your.paypal@email.com"
                value={paymentData.paypalEmail}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    paypalEmail: e.target.value,
                  })
                }
              />
            </div>
          )}

          {paymentData.method === "cashapp" && (
            <div className="space-y-2">
              <Label htmlFor="cashappTag">CashApp Tag</Label>
              <Input
                id="cashappTag"
                placeholder="$YourCashApp"
                value={paymentData.cashappTag}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, cashappTag: e.target.value })
                }
              />
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Contact Information</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={paymentData.contactInfo.firstName}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    contactInfo: {
                      ...paymentData.contactInfo,
                      firstName: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={paymentData.contactInfo.lastName}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    contactInfo: {
                      ...paymentData.contactInfo,
                      lastName: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={paymentData.contactInfo.email}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  contactInfo: {
                    ...paymentData.contactInfo,
                    email: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={paymentData.contactInfo.phone}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  contactInfo: {
                    ...paymentData.contactInfo,
                    phone: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          disabled={isProcessing || !currentUser}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3"
        >
          {isProcessing ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Processing Order...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Complete Purchase - ${totalAmount.toFixed(2)}
            </>
          )}
        </Button>

        {!currentUser && (
          <p className="text-sm text-gray-600 text-center">
            Please sign in to make a purchase
          </p>
        )}

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Shield className="w-3 h-3" />
          <span>Secure processing • AI-optimized experience</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleCheckout;
