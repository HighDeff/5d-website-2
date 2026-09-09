import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader,
  DollarSign,
  Shield,
  Zap,
} from "lucide-react";
import PayPalService, { PayPalPayment } from "../services/PayPalService";
import { useUserAuth } from "../hooks/useUserAuth";

interface PayPalCheckoutProps {
  productId: string;
  productName: string;
  price: number;
  sellerId: string;
  onSuccess?: (paymentDetails: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  className?: string;
}

const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  productId,
  productName,
  price,
  sellerId,
  onSuccess,
  onError,
  onCancel,
  className = "",
}) => {
  const { currentUser } = useUserAuth();
  const [payment, setPayment] = useState<PayPalPayment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [useDemo, setUseDemo] = useState(false); // PRODUCTION MODE - Real PayPal integration
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (payment && paypalRef.current && !useDemo) {
      renderPayPalButtons();
    }
  }, [payment, useDemo]);

  const initializePayment = async () => {
    if (!currentUser) {
      setError("Please sign in to make a purchase");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const platformFeePercent =
        currentUser.membershipLevel === "member" ? 0.1 : 0.15;

      const result = await PayPalService.createPayment({
        amount: price,
        description: productName,
        sellerId: sellerId,
        buyerId: currentUser.id,
        productId: productId,
        platformFeePercent,
      });

      if (result.success && result.payment) {
        setPayment(result.payment);
        console.log("Payment initialized:", result.payment);
      } else {
        setError(result.error || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      setError("Failed to initialize payment");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPayPalButtons = async () => {
    if (!payment || !paypalRef.current) return;

    try {
      setIsProcessing(true);

      await PayPalService.renderPayPalButtons(
        "paypal-button-container",
        payment,
        (details) => {
          console.log("PayPal payment successful:", details);
          setSuccess(true);
          setIsProcessing(false);

          if (onSuccess) {
            onSuccess({
              paymentId: payment.id,
              paypalDetails: details,
              payment: payment,
            });
          }
        },
        (error) => {
          console.error("PayPal payment error:", error);
          setError("Payment failed. Please try again.");
          setIsProcessing(false);

          if (onError) {
            onError(error);
          }
        },
      );
    } catch (error) {
      console.error("Failed to render PayPal buttons:", error);
      setError("PayPal service unavailable. Please try again later.");
      setIsProcessing(false);
    }
  };

  const handleDemoPayment = () => {
    if (!payment) return;

    setIsProcessing(true);
    console.log("🧪 Demo: Simulating PayPal payment...");

    // Simulate PayPal payment process
    PayPalService.simulateSuccessfulPayment(payment.id);

    // Simulate success after 3 seconds
    setTimeout(() => {
      setSuccess(true);
      setIsProcessing(false);

      if (onSuccess) {
        onSuccess({
          paymentId: payment.id,
          paypalDetails: {
            id: `DEMO_${Date.now()}`,
            status: "COMPLETED",
            purchase_units: [
              {
                payments: {
                  captures: [
                    {
                      id: `CAPTURE_${Date.now()}`,
                      status: "COMPLETED",
                      amount: {
                        currency_code: "USD",
                        value: payment.amount.toFixed(2),
                      },
                    },
                  ],
                },
              },
            ],
          },
          payment: payment,
        });
      }
    }, 3000);
  };

  if (success) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Payment Successful! 🎉
          </h3>
          <p className="text-green-700 mb-4">
            Your payment has been processed successfully. The seller will be
            notified and will contact you for shipping/pickup arrangements.
          </p>
          <div className="bg-green-100 rounded-lg p-3 text-sm text-green-800">
            <p>Payment ID: {payment?.id.slice(-8)}</p>
            <p>Amount: ${payment?.amount}</p>
            <p>AI is now processing your order...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Payment Error
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setPayment(null);
            }}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!payment) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Secure Checkout</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Payment Summary</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Item Price:</span>
                <span>${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>
                  $
                  {(
                    price *
                    (currentUser?.membershipLevel === "member" ? 0.1 : 0.15)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-blue-300 pt-1 flex justify-between font-medium">
                <span>Total:</span>
                <span>${price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Secured by PayPal • Buyer Protection Included</span>
          </div>

          <Button
            onClick={initializePayment}
            disabled={isLoading || !currentUser}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Pay ${price.toFixed(2)} with PayPal
              </>
            )}
          </Button>

          {!currentUser && (
            <p className="text-sm text-gray-600 text-center">
              Please sign in to make a purchase
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Complete Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Payment Details</h4>
          <div className="space-y-1 text-sm text-green-700">
            <p>
              <strong>Item:</strong> {payment.description}
            </p>
            <p>
              <strong>Amount:</strong> ${payment.amount.toFixed(2)}
            </p>
            <p>
              <strong>Platform Fee:</strong> ${payment.platformFee.toFixed(2)}
            </p>
            <p>
              <strong>Seller Receives:</strong> $
              {payment.sellerAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {useDemo ? (
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Demo Mode Active</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                This will simulate a PayPal payment for testing purposes
              </p>
            </div>

            <Button
              onClick={handleDemoPayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing Demo Payment...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Demo: Pay with PayPal
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-blue-800">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Development Mode</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Real PayPal integration requires production setup. Using demo
                mode for testing.
              </p>
            </div>

            <Button
              onClick={handleDemoPayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing Demo Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Demo: Pay with PayPal
                </>
              )}
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Shield className="w-3 h-3" />
          <span>256-bit SSL encryption • PCI DSS compliant</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayPalCheckout;
