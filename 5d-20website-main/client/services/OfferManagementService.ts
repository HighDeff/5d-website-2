import LiveAIOfferMonitoring from "./LiveAIOfferMonitoring";

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
  negotiationHistory: Array<{
    type: "offer" | "counter" | "message";
    price?: number;
    message: string;
    fromUserId: string;
    timestamp: string;
  }>;
}

interface OfferNotification {
  id: string;
  type:
    | "offer_received"
    | "offer_accepted"
    | "offer_declined"
    | "offer_countered";
  offerId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface SendOfferData {
  itemId: string;
  itemName: string;
  itemImage: string;
  originalPrice: number;
  offeredPrice: number;
  sellerId: string;
  buyerId: string;
  message: string;
}

interface OfferResult {
  success: boolean;
  offer?: Offer;
  error?: string;
}

class OfferManagementService {
  private static instance: OfferManagementService;
  private notificationCallbacks: Array<
    (notification: OfferNotification) => void
  > = [];

  static getInstance(): OfferManagementService {
    if (!OfferManagementService.instance) {
      OfferManagementService.instance = new OfferManagementService();
    }
    return OfferManagementService.instance;
  }

  /**
   * Send an offer for an item
   */
  async sendOffer(offerData: SendOfferData): Promise<OfferResult> {
    try {
      // Validation
      const validation = this.validateOffer(offerData);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.issues.join(", "),
        };
      }

      // Get user information
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const buyer = users.find((u: any) => u.id === offerData.buyerId);
      const seller = users.find((u: any) => u.id === offerData.sellerId);

      if (!buyer || !seller) {
        return {
          success: false,
          error: "Buyer or seller not found",
        };
      }

      // Check for existing pending offers
      const existingOffer = this.getExistingOffer(
        offerData.itemId,
        offerData.buyerId,
      );
      if (existingOffer && existingOffer.status === "pending") {
        return {
          success: false,
          error: "You already have a pending offer for this item",
        };
      }

      // Create the offer
      const offer: Offer = {
        id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        itemId: offerData.itemId,
        itemName: offerData.itemName,
        itemImage: offerData.itemImage,
        originalPrice: offerData.originalPrice,
        offeredPrice: offerData.offeredPrice,
        fromUser: {
          id: buyer.id,
          name: buyer.name,
          email: buyer.email,
          avatar: buyer.avatar,
          verified: buyer.verified || false,
        },
        toUser: {
          id: seller.id,
          name: seller.name,
          email: seller.email,
          avatar: seller.avatar,
          verified: seller.verified || false,
        },
        message: offerData.message,
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        negotiationHistory: [
          {
            type: "offer",
            price: offerData.offeredPrice,
            message: offerData.message,
            fromUserId: buyer.id,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      // Save offer
      this.saveOffer(offer);

      // Trigger live AI monitoring
      setTimeout(() => {
        // This will be picked up by the live monitoring system
        console.log("New offer created, AI monitoring will process it");
      }, 100);

      // Log offer activity
      this.logOfferActivity("offer_sent", offer);

      return {
        success: true,
        offer: offer,
      };
    } catch (error) {
      console.error("Error sending offer:", error);
      return {
        success: false,
        error: "Failed to send offer",
      };
    }
  }

  /**
   * Respond to an offer using Live AI monitoring
   */
  async respondToOffer(
    offerId: string,
    response: "accept" | "decline" | "counter",
    userId: string,
    responseData?: {
      message?: string;
      counterPrice?: number;
    },
  ): Promise<OfferResult> {
    try {
      // Use live AI monitoring for processing
      const result = await LiveAIOfferMonitoring.processOfferResponse(
        offerId,
        response,
        userId,
        responseData,
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      // Get updated offer
      const offers = this.getOffers();
      const offer = offers.find((o: Offer) => o.id === offerId);

      return {
        success: true,
        offer: offer,
      };
    } catch (error) {
      console.error("Error responding to offer:", error);
      return {
        success: false,
        error: "Failed to respond to offer",
      };
    }
  }

  /**
   * Get offers for a user (sent or received)
   */
  getUserOffers(
    userId: string,
    type: "sent" | "received" | "all" = "all",
  ): Offer[] {
    try {
      const offers = this.getOffers();

      switch (type) {
        case "sent":
          return offers.filter((offer: Offer) => offer.fromUser.id === userId);
        case "received":
          return offers.filter((offer: Offer) => offer.toUser.id === userId);
        default:
          return offers.filter(
            (offer: Offer) =>
              offer.fromUser.id === userId || offer.toUser.id === userId,
          );
      }
    } catch (error) {
      console.error("Error getting user offers:", error);
      return [];
    }
  }

  /**
   * Get offers for a specific item
   */
  getItemOffers(itemId: string): Offer[] {
    try {
      const offers = this.getOffers();
      return offers.filter((offer: Offer) => offer.itemId === itemId);
    } catch (error) {
      console.error("Error getting item offers:", error);
      return [];
    }
  }

  /**
   * Check if user can make an offer on an item
   */
  canMakeOffer(
    itemId: string,
    userId: string,
  ): {
    canOffer: boolean;
    reason?: string;
  } {
    try {
      // Check if user is the seller
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const item = products.find((p: any) => p.id === itemId);

      if (!item) {
        return { canOffer: false, reason: "Item not found" };
      }

      if (item.sellerId === userId) {
        return {
          canOffer: false,
          reason: "You cannot make offers on your own items",
        };
      }

      // Check for existing pending offers
      const existingOffer = this.getExistingOffer(itemId, userId);
      if (existingOffer && existingOffer.status === "pending") {
        return {
          canOffer: false,
          reason: "You already have a pending offer for this item",
        };
      }

      return { canOffer: true };
    } catch (error) {
      console.error("Error checking offer eligibility:", error);
      return { canOffer: false, reason: "Error checking eligibility" };
    }
  }

  /**
   * Get offer statistics
   */
  getOfferStats(): any {
    try {
      const offers = this.getOffers();

      const stats = {
        total: offers.length,
        pending: offers.filter((o: Offer) => o.status === "pending").length,
        accepted: offers.filter((o: Offer) => o.status === "accepted").length,
        declined: offers.filter((o: Offer) => o.status === "declined").length,
        countered: offers.filter((o: Offer) => o.status === "countered").length,
        expired: offers.filter((o: Offer) => o.status === "expired").length,
        averageOffer: 0,
        averageDiscount: 0,
        acceptanceRate: 0,
      };

      if (offers.length > 0) {
        stats.averageOffer =
          offers.reduce(
            (sum: number, offer: Offer) => sum + offer.offeredPrice,
            0,
          ) / offers.length;

        const discounts = offers.map(
          (offer: Offer) =>
            ((offer.originalPrice - offer.offeredPrice) / offer.originalPrice) *
            100,
        );
        stats.averageDiscount =
          discounts.reduce((sum, discount) => sum + discount, 0) /
          discounts.length;

        stats.acceptanceRate =
          offers.length > 0 ? (stats.accepted / offers.length) * 100 : 0;
      }

      return stats;
    } catch (error) {
      console.error("Error getting offer stats:", error);
      return {
        total: 0,
        pending: 0,
        accepted: 0,
        declined: 0,
        countered: 0,
        expired: 0,
        averageOffer: 0,
        averageDiscount: 0,
        acceptanceRate: 0,
      };
    }
  }

  /**
   * Subscribe to offer notifications
   */
  onNotification(
    callback: (notification: OfferNotification) => void,
  ): () => void {
    this.notificationCallbacks.push(callback);

    return () => {
      const index = this.notificationCallbacks.indexOf(callback);
      if (index > -1) {
        this.notificationCallbacks.splice(index, 1);
      }
    };
  }

  // Private helper methods

  private getOffers(): Offer[] {
    try {
      return JSON.parse(localStorage.getItem("offers") || "[]");
    } catch (error) {
      console.error("Error loading offers:", error);
      return [];
    }
  }

  private saveOffer(offer: Offer): void {
    try {
      const offers = this.getOffers();
      offers.push(offer);
      localStorage.setItem("offers", JSON.stringify(offers));
    } catch (error) {
      console.error("Error saving offer:", error);
      throw error;
    }
  }

  private getExistingOffer(itemId: string, buyerId: string): Offer | null {
    const offers = this.getOffers();
    return (
      offers.find(
        (offer: Offer) =>
          offer.itemId === itemId &&
          offer.fromUser.id === buyerId &&
          offer.status === "pending",
      ) || null
    );
  }

  private validateOffer(offerData: SendOfferData): {
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (!offerData.itemId) {
      issues.push("Item ID is required");
    }

    if (!offerData.buyerId || !offerData.sellerId) {
      issues.push("Buyer and seller IDs are required");
    }

    if (offerData.buyerId === offerData.sellerId) {
      issues.push("Buyer and seller cannot be the same");
    }

    if (offerData.offeredPrice <= 0) {
      issues.push("Offer price must be greater than 0");
    }

    if (offerData.offeredPrice >= offerData.originalPrice) {
      issues.push("Offer price must be less than the original price");
    }

    const discountPercentage =
      ((offerData.originalPrice - offerData.offeredPrice) /
        offerData.originalPrice) *
      100;
    if (discountPercentage > 50) {
      issues.push("Offer cannot be more than 50% below the original price");
    }

    return {
      valid: issues.length === 0,
      issues: issues,
    };
  }

  private logOfferActivity(activity: string, offer: Offer): void {
    try {
      const logs = JSON.parse(
        localStorage.getItem("offerActivityLogs") || "[]",
      );

      const log = {
        id: `log_${Date.now()}`,
        activity: activity,
        offerId: offer.id,
        itemId: offer.itemId,
        fromUserId: offer.fromUser.id,
        toUserId: offer.toUser.id,
        price: offer.offeredPrice,
        originalPrice: offer.originalPrice,
        timestamp: new Date().toISOString(),
      };

      logs.push(log);

      // Keep only last 500 logs
      if (logs.length > 500) {
        logs.splice(0, logs.length - 500);
      }

      localStorage.setItem("offerActivityLogs", JSON.stringify(logs));
    } catch (error) {
      console.error("Error logging offer activity:", error);
    }
  }
}

export default OfferManagementService.getInstance();
