import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Check,
  X,
  MessageSquare,
  Clock,
  TrendingDown,
  User,
  Star,
  AlertCircle,
  CheckCircle,
  Bot,
  Eye,
  Package,
  Send,
} from "lucide-react";
import { useUserAuth } from "../hooks/useUserAuth";
import OfferManagementService from "../services/OfferManagementService";
import LiveAIOfferMonitoring from "../services/LiveAIOfferMonitoring";

interface Offer {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  originalPrice: number;
  offeredPrice: number;
  fromUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    verified: boolean;
  };
  toUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    verified: boolean;
  };
  message: string;
  status: "pending" | "accepted" | "declined" | "countered" | "expired";
  createdAt: string;
  expiresAt: string;
  responseMessage?: string;
  counterOffer?: {
    price: number;
    message: string;
    createdAt: string;
  };
  aiAnalysis?: {
    fairnessScore: number;
    recommendedAction: string;
    suggestedCounterOffer?: number;
    insights: string[];
  };
}

const OffersManager: React.FC = () => {
  const { user } = useUserAuth();
  const [sentOffers, setSentOffers] = useState<Offer[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseData, setResponseData] = useState({
    action: "" as "accept" | "decline" | "counter",
    message: "",
    counterPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadOffers();
      loadNotifications();

      // Subscribe to live notifications
      const unsubscribe = LiveAIOfferMonitoring.onNotification(
        (notification) => {
          if (notification.userId === user.id) {
            setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
            // Reload offers when new notifications come in
            loadOffers();
          }
        },
      );

      return unsubscribe;
    }
  }, [user]);

  const loadOffers = () => {
    if (!user) return;

    const sentOffers = OfferManagementService.getUserOffers(user.id, "sent");
    const receivedOffers = OfferManagementService.getUserOffers(
      user.id,
      "received",
    );

    setSentOffers(sentOffers);
    setReceivedOffers(receivedOffers);
  };

  const loadNotifications = () => {
    if (!user) return;

    const userNotifications = LiveAIOfferMonitoring.getUserNotifications(
      user.id,
    );
    setNotifications(userNotifications.slice(0, 10)); // Show last 10
  };

  const handleOfferResponse = async () => {
    if (!selectedOffer || !user) return;

    setLoading(true);

    try {
      let responsePayload: any = {
        message: responseData.message,
      };

      if (responseData.action === "counter" && responseData.counterPrice) {
        responsePayload.counterPrice = parseFloat(responseData.counterPrice);
      }

      const result = await OfferManagementService.respondToOffer(
        selectedOffer.id,
        responseData.action,
        user.id,
        responsePayload,
      );

      if (result.success) {
        // Show success message
        alert(`Offer ${responseData.action}ed successfully!`);

        // Reload offers
        loadOffers();

        // Close dialog
        setShowResponseDialog(false);
        setSelectedOffer(null);
        setResponseData({ action: "", message: "", counterPrice: "" });

        // Reload notifications
        setTimeout(() => {
          loadNotifications();
        }, 1000);
      } else {
        alert(`Failed to ${responseData.action} offer: ${result.error}`);
      }
    } catch (error) {
      console.error("Error responding to offer:", error);
      alert("An error occurred while processing the response");
    }

    setLoading(false);
  };

  const openResponseDialog = (
    offer: Offer,
    action: "accept" | "decline" | "counter",
  ) => {
    setSelectedOffer(offer);
    setResponseData({ action, message: "", counterPrice: "" });
    setShowResponseDialog(true);
  };

  const calculateDiscount = (
    originalPrice: number,
    offeredPrice: number,
  ): number => {
    return Math.round(((originalPrice - offeredPrice) / originalPrice) * 100);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "countered":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderOffer = (offer: Offer, type: "sent" | "received") => (
    <Card key={offer.id} className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={offer.itemImage}
            alt={offer.itemName}
            className="w-20 h-20 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&w=100&h=100&fit=crop";
            }}
          />

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{offer.itemName}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {type === "sent"
                      ? `To: ${offer.toUser.name}`
                      : `From: ${offer.fromUser.name}`}
                  </span>
                  {(type === "sent"
                    ? offer.toUser.verified
                    : offer.fromUser.verified) && (
                    <Star className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(offer.status)}>
                {offer.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-600">Original Price</p>
                <p className="font-semibold">${offer.originalPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Offered Price</p>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-green-600">
                    ${offer.offeredPrice}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {calculateDiscount(offer.originalPrice, offer.offeredPrice)}
                    % off
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Message:</p>
              <p className="text-sm bg-gray-50 p-2 rounded">{offer.message}</p>
            </div>

            {offer.aiAnalysis && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    AI Analysis
                  </span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {offer.aiAnalysis.fairnessScore}% Fair
                  </Badge>
                </div>
                <p className="text-xs text-blue-700">
                  {offer.aiAnalysis.insights[0] || "AI analysis available"}
                </p>
                {offer.aiAnalysis.suggestedCounterOffer && (
                  <p className="text-xs text-blue-600 mt-1">
                    Suggested counter: ${offer.aiAnalysis.suggestedCounterOffer}
                  </p>
                )}
              </div>
            )}

            {offer.counterOffer && (
              <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-800">
                  Counter Offer
                </p>
                <p className="text-sm text-orange-700">
                  ${offer.counterOffer.price} - {offer.counterOffer.message}
                </p>
              </div>
            )}

            {offer.responseMessage && (
              <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-800">Response</p>
                <p className="text-sm text-gray-700">{offer.responseMessage}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <div>Created: {new Date(offer.createdAt).toLocaleString()}</div>
                <div>Expires: {new Date(offer.expiresAt).toLocaleString()}</div>
              </div>

              {type === "received" && offer.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => openResponseDialog(offer, "accept")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openResponseDialog(offer, "counter")}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Counter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openResponseDialog(offer, "decline")}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                </div>
              )}

              {type === "sent" && offer.status === "countered" && (
                <Button
                  size="sm"
                  onClick={() => openResponseDialog(offer, "accept")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept Counter
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Sign In Required
          </h3>
          <p className="text-gray-500">
            Please sign in to view and manage your offers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg text-sm ${
                    notification.read
                      ? "bg-gray-100"
                      : "bg-white border border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{notification.message}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers Tabs */}
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Received ({receivedOffers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Sent ({sentOffers.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          {receivedOffers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Offers Received
                </h3>
                <p className="text-gray-500">
                  You haven't received any offers yet. Keep listing great
                  products!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {receivedOffers.map((offer) => renderOffer(offer, "received"))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {sentOffers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Offers Sent
                </h3>
                <p className="text-gray-500">
                  You haven't sent any offers yet. Browse products and make your
                  first offer!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>{sentOffers.map((offer) => renderOffer(offer, "sent"))}</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {responseData.action === "accept" && "Accept Offer"}
              {responseData.action === "decline" && "Decline Offer"}
              {responseData.action === "counter" && "Counter Offer"}
            </DialogTitle>
          </DialogHeader>

          {selectedOffer && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">{selectedOffer.itemName}</h4>
                <p className="text-sm text-gray-600">
                  Original offer: ${selectedOffer.offeredPrice}
                </p>
              </div>

              {responseData.action === "counter" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Counter Offer Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter counter offer amount"
                    value={responseData.counterPrice}
                    onChange={(e) =>
                      setResponseData({
                        ...responseData,
                        counterPrice: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message (optional)
                </label>
                <Textarea
                  placeholder="Add a message..."
                  rows={3}
                  value={responseData.message}
                  onChange={(e) =>
                    setResponseData({
                      ...responseData,
                      message: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleOfferResponse}
                  disabled={
                    loading ||
                    (responseData.action === "counter" &&
                      !responseData.counterPrice)
                  }
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {responseData.action === "accept" && (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      {responseData.action === "decline" && (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      {responseData.action === "counter" && (
                        <MessageSquare className="w-4 h-4 mr-2" />
                      )}
                      {responseData.action === "accept" && "Accept Offer"}
                      {responseData.action === "decline" && "Decline Offer"}
                      {responseData.action === "counter" && "Send Counter"}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowResponseDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OffersManager;
