import OfferManagementService from "./OfferManagementService";
import DatabaseManagementAI from "./DatabaseManagementAI";

interface OfferNotification {
  id: string;
  type:
    | "offer_received"
    | "offer_accepted"
    | "offer_declined"
    | "offer_countered"
    | "offer_expired";
  userId: string;
  message: string;
  data: any;
  timestamp: string;
  read: boolean;
}

interface AIOfferAnalysis {
  offerId: string;
  fairnessScore: number; // 0-100
  recommendedAction: "accept" | "decline" | "counter" | "wait";
  suggestedCounterOffer?: number;
  riskFactors: string[];
  insights: string[];
}

class LiveAIOfferMonitoring {
  private static instance: LiveAIOfferMonitoring;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private notifications: OfferNotification[] = [];
  private notificationCallbacks: Array<
    (notification: OfferNotification) => void
  > = [];

  static getInstance(): LiveAIOfferMonitoring {
    if (!LiveAIOfferMonitoring.instance) {
      LiveAIOfferMonitoring.instance = new LiveAIOfferMonitoring();
      LiveAIOfferMonitoring.instance.initialize();
    }
    return LiveAIOfferMonitoring.instance;
  }

  /**
   * Initialize the live monitoring system
   */
  private initialize(): void {
    this.loadNotifications();
    this.startMonitoring();
    console.log("Live AI Offer Monitoring initialized");
  }

  /**
   * Start monitoring offers in real-time
   */
  private startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Monitor every 5 seconds
    this.monitoringInterval = setInterval(() => {
      this.checkForOfferUpdates();
      this.processExpiredOffers();
      this.analyzeActiveOffers();
    }, 5000);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Check for new offer updates and notify users
   */
  private async checkForOfferUpdates(): Promise<void> {
    try {
      const lastCheck = localStorage.getItem("lastOfferCheck");
      const currentTime = new Date().toISOString();

      // Get all offers
      const offers = JSON.parse(localStorage.getItem("offers") || "[]");

      // Find offers that have been updated since last check
      const updatedOffers = offers.filter((offer: any) => {
        if (!lastCheck) return false;
        return (
          new Date(offer.updatedAt || offer.createdAt).getTime() >
          new Date(lastCheck).getTime()
        );
      });

      // Process updated offers
      for (const offer of updatedOffers) {
        await this.processOfferUpdate(offer);
      }

      localStorage.setItem("lastOfferCheck", currentTime);
    } catch (error) {
      console.error("Error checking offer updates:", error);
    }
  }

  /**
   * Process an individual offer update
   */
  private async processOfferUpdate(offer: any): Promise<void> {
    try {
      // Notify the seller
      if (offer.status === "pending" && !offer.notifiedSeller) {
        await this.notifyUser(offer.toUser.id, {
          type: "offer_received",
          message: `New offer of $${offer.offeredPrice} for ${offer.itemName}`,
          data: offer,
        });

        // Mark as notified
        offer.notifiedSeller = true;
        this.updateOfferInStorage(offer);
      }

      // Notify the buyer of status changes
      if (offer.status === "accepted" && !offer.notifiedBuyerAccept) {
        await this.notifyUser(offer.fromUser.id, {
          type: "offer_accepted",
          message: `Your offer of $${offer.offeredPrice} for ${offer.itemName} was accepted!`,
          data: offer,
        });

        offer.notifiedBuyerAccept = true;
        this.updateOfferInStorage(offer);

        // Update accounts and trigger database updates
        await this.processSaleFromOffer(offer);
      }

      if (offer.status === "declined" && !offer.notifiedBuyerDecline) {
        await this.notifyUser(offer.fromUser.id, {
          type: "offer_declined",
          message: `Your offer for ${offer.itemName} was declined`,
          data: offer,
        });

        offer.notifiedBuyerDecline = true;
        this.updateOfferInStorage(offer);
      }

      if (offer.status === "countered" && !offer.notifiedBuyerCounter) {
        await this.notifyUser(offer.fromUser.id, {
          type: "offer_countered",
          message: `Counter offer of $${offer.counterOffer?.price} received for ${offer.itemName}`,
          data: offer,
        });

        offer.notifiedBuyerCounter = true;
        this.updateOfferInStorage(offer);
      }
    } catch (error) {
      console.error("Error processing offer update:", error);
    }
  }

  /**
   * Process sale when offer is accepted
   */
  private async processSaleFromOffer(offer: any): Promise<void> {
    try {
      // Create sale record
      const sale = {
        id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        itemId: offer.itemId,
        itemName: offer.itemName,
        price: offer.offeredPrice,
        originalPrice: offer.originalPrice,
        discount: offer.originalPrice - offer.offeredPrice,
        buyerId: offer.fromUser.id,
        buyerName: offer.fromUser.name,
        sellerId: offer.toUser.id,
        sellerName: offer.toUser.name,
        saleType: "offer_accepted",
        offerId: offer.id,
        timestamp: new Date().toISOString(),
        status: "completed",
      };

      // Save sale
      const sales = JSON.parse(localStorage.getItem("sales") || "[]");
      sales.push(sale);
      localStorage.setItem("sales", JSON.stringify(sales));

      // Trigger global database update
      await DatabaseManagementAI.processGlobalUpdate({
        buyerId: offer.fromUser.id,
        sellerId: offer.toUser.id,
        itemId: offer.itemId,
        amount: offer.offeredPrice,
        type: "offer_accepted",
      });

      // Update user earnings and purchase history
      await this.updateUserAccounts(offer);

      console.log("Sale processed from accepted offer:", sale.id);
    } catch (error) {
      console.error("Error processing sale from offer:", error);
    }
  }

  /**
   * Update user accounts after sale
   */
  private async updateUserAccounts(offer: any): Promise<void> {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Update seller
      const sellerIndex = users.findIndex((u: any) => u.id === offer.toUser.id);
      if (sellerIndex !== -1) {
        users[sellerIndex].totalSales =
          (users[sellerIndex].totalSales || 0) + offer.offeredPrice;
        users[sellerIndex].salesCount =
          (users[sellerIndex].salesCount || 0) + 1;
        users[sellerIndex].lastSale = new Date().toISOString();
      }

      // Update buyer
      const buyerIndex = users.findIndex(
        (u: any) => u.id === offer.fromUser.id,
      );
      if (buyerIndex !== -1) {
        users[buyerIndex].totalPurchases =
          (users[buyerIndex].totalPurchases || 0) + offer.offeredPrice;
        users[buyerIndex].purchaseCount =
          (users[buyerIndex].purchaseCount || 0) + 1;
        users[buyerIndex].lastPurchase = new Date().toISOString();
      }

      localStorage.setItem("users", JSON.stringify(users));

      // Notify admin accounts of the sale
      await DatabaseManagementAI.updateAdminAccounts("offer_sale_completed", {
        offerId: offer.id,
        amount: offer.offeredPrice,
        buyer: offer.fromUser.name,
        seller: offer.toUser.name,
        item: offer.itemName,
      });
    } catch (error) {
      console.error("Error updating user accounts:", error);
    }
  }

  /**
   * Process expired offers
   */
  private processExpiredOffers(): void {
    try {
      const offers = JSON.parse(localStorage.getItem("offers") || "[]");
      const now = new Date().getTime();
      let updated = false;

      offers.forEach((offer: any) => {
        if (
          offer.status === "pending" &&
          new Date(offer.expiresAt).getTime() < now
        ) {
          offer.status = "expired";
          updated = true;

          // Notify both parties
          this.notifyUser(offer.fromUser.id, {
            type: "offer_expired",
            message: `Your offer for ${offer.itemName} has expired`,
            data: offer,
          });

          this.notifyUser(offer.toUser.id, {
            type: "offer_expired",
            message: `Offer from ${offer.fromUser.name} for ${offer.itemName} has expired`,
            data: offer,
          });
        }
      });

      if (updated) {
        localStorage.setItem("offers", JSON.stringify(offers));
      }
    } catch (error) {
      console.error("Error processing expired offers:", error);
    }
  }

  /**
   * AI analysis of active offers
   */
  private async analyzeActiveOffers(): Promise<void> {
    try {
      const offers = JSON.parse(localStorage.getItem("offers") || "[]");
      const activeOffers = offers.filter(
        (offer: any) => offer.status === "pending",
      );

      for (const offer of activeOffers) {
        const analysis = await this.performAIAnalysis(offer);

        // Store analysis results
        offer.aiAnalysis = analysis;

        // Auto-suggest to seller if AI strongly recommends action
        if (
          analysis.fairnessScore > 80 &&
          analysis.recommendedAction === "accept"
        ) {
          await this.notifyUser(offer.toUser.id, {
            type: "offer_received",
            message: `AI suggests accepting offer of $${offer.offeredPrice} for ${offer.itemName} (${analysis.fairnessScore}% fair)`,
            data: { ...offer, aiRecommendation: analysis },
          });
        }
      }

      // Update offers with AI analysis
      localStorage.setItem("offers", JSON.stringify(offers));
    } catch (error) {
      console.error("Error analyzing offers:", error);
    }
  }

  /**
   * Perform AI analysis on an offer
   */
  private async performAIAnalysis(offer: any): Promise<AIOfferAnalysis> {
    const analysis: AIOfferAnalysis = {
      offerId: offer.id,
      fairnessScore: 0,
      recommendedAction: "wait",
      riskFactors: [],
      insights: [],
    };

    try {
      // Calculate fairness score based on discount percentage
      const discountPercent =
        ((offer.originalPrice - offer.offeredPrice) / offer.originalPrice) *
        100;

      if (discountPercent <= 10) {
        analysis.fairnessScore = 95;
        analysis.recommendedAction = "accept";
        analysis.insights.push("Excellent offer - very close to asking price");
      } else if (discountPercent <= 20) {
        analysis.fairnessScore = 80;
        analysis.recommendedAction = "accept";
        analysis.insights.push("Good offer - reasonable discount");
      } else if (discountPercent <= 30) {
        analysis.fairnessScore = 65;
        analysis.recommendedAction = "counter";
        analysis.suggestedCounterOffer = offer.originalPrice * 0.85; // 15% discount
        analysis.insights.push("Consider counter offer");
      } else if (discountPercent <= 40) {
        analysis.fairnessScore = 40;
        analysis.recommendedAction = "counter";
        analysis.suggestedCounterOffer = offer.originalPrice * 0.75; // 25% discount
        analysis.insights.push("Significant discount requested");
      } else {
        analysis.fairnessScore = 20;
        analysis.recommendedAction = "decline";
        analysis.riskFactors.push("Extremely low offer");
        analysis.insights.push("Offer too low - consider declining");
      }

      // Check offer urgency
      if (offer.urgency === "high") {
        analysis.insights.push(
          "Buyer marked as urgent - may accept counter offers",
        );
      }

      // Check buyer history
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const buyer = users.find((u: any) => u.id === offer.fromUser.id);

      if (buyer) {
        if (buyer.purchaseCount > 5) {
          analysis.fairnessScore += 5;
          analysis.insights.push(
            "Experienced buyer with good purchase history",
          );
        }

        if (buyer.verified) {
          analysis.fairnessScore += 5;
          analysis.insights.push("Verified buyer account");
        }
      }

      // Market analysis (simplified)
      const similarOffers = JSON.parse(
        localStorage.getItem("offers") || "[]",
      ).filter(
        (o: any) =>
          o.originalPrice >= offer.originalPrice * 0.8 &&
          o.originalPrice <= offer.originalPrice * 1.2,
      );

      if (similarOffers.length > 0) {
        const avgOfferPrice =
          similarOffers.reduce(
            (sum: number, o: any) => sum + o.offeredPrice,
            0,
          ) / similarOffers.length;
        if (offer.offeredPrice > avgOfferPrice) {
          analysis.insights.push("Above average offer for similar items");
          analysis.fairnessScore += 10;
        }
      }

      // Cap fairness score at 100
      analysis.fairnessScore = Math.min(100, analysis.fairnessScore);
    } catch (error) {
      console.error("Error in AI analysis:", error);
      analysis.insights.push("AI analysis failed - manual review recommended");
    }

    return analysis;
  }

  /**
   * Notify user
   */
  private async notifyUser(
    userId: string,
    notificationData: {
      type: OfferNotification["type"];
      message: string;
      data: any;
    },
  ): Promise<void> {
    try {
      const notification: OfferNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: notificationData.type,
        userId: userId,
        message: notificationData.message,
        data: notificationData.data,
        timestamp: new Date().toISOString(),
        read: false,
      };

      this.notifications.push(notification);
      this.saveNotifications();

      // Trigger notification callbacks
      this.notificationCallbacks.forEach((callback) => callback(notification));

      console.log(`Notification sent to user ${userId}:`, notification.message);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  /**
   * Update offer in storage
   */
  private updateOfferInStorage(offer: any): void {
    try {
      const offers = JSON.parse(localStorage.getItem("offers") || "[]");
      const index = offers.findIndex((o: any) => o.id === offer.id);

      if (index !== -1) {
        offers[index] = { ...offer, updatedAt: new Date().toISOString() };
        localStorage.setItem("offers", JSON.stringify(offers));
      }
    } catch (error) {
      console.error("Error updating offer in storage:", error);
    }
  }

  /**
   * Get notifications for user
   */
  getUserNotifications(userId: string): OfferNotification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  /**
   * Subscribe to notifications
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

  /**
   * Process offer response (accept/decline/counter)
   */
  async processOfferResponse(
    offerId: string,
    response: "accept" | "decline" | "counter",
    userId: string,
    responseData?: { message?: string; counterPrice?: number },
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const offers = JSON.parse(localStorage.getItem("offers") || "[]");
      const offerIndex = offers.findIndex((o: any) => o.id === offerId);

      if (offerIndex === -1) {
        return { success: false, error: "Offer not found" };
      }

      const offer = offers[offerIndex];

      // Verify user has permission to respond
      if (offer.toUser.id !== userId) {
        return {
          success: false,
          error: "Unauthorized to respond to this offer",
        };
      }

      if (offer.status !== "pending") {
        return { success: false, error: "Offer is no longer pending" };
      }

      // Update offer status
      offer.status = response;
      offer.responseMessage = responseData?.message || "";
      offer.updatedAt = new Date().toISOString();

      if (response === "counter" && responseData?.counterPrice) {
        offer.counterOffer = {
          price: responseData.counterPrice,
          message: responseData.message || "",
          createdAt: new Date().toISOString(),
        };
      }

      // Save updated offer
      offers[offerIndex] = offer;
      localStorage.setItem("offers", JSON.stringify(offers));

      // Trigger processing of the update
      await this.processOfferUpdate(offer);

      return { success: true };
    } catch (error) {
      console.error("Error processing offer response:", error);
      return { success: false, error: "Failed to process response" };
    }
  }

  /**
   * Get offer statistics and insights
   */
  getOfferInsights(): any {
    try {
      const offers = JSON.parse(localStorage.getItem("offers") || "[]");

      const stats = {
        total: offers.length,
        pending: offers.filter((o: any) => o.status === "pending").length,
        accepted: offers.filter((o: any) => o.status === "accepted").length,
        declined: offers.filter((o: any) => o.status === "declined").length,
        countered: offers.filter((o: any) => o.status === "countered").length,
        expired: offers.filter((o: any) => o.status === "expired").length,
        avgResponseTime: 0,
        acceptanceRate: 0,
        avgDiscount: 0,
      };

      if (offers.length > 0) {
        const acceptedOffers = offers.filter(
          (o: any) => o.status === "accepted",
        );
        stats.acceptanceRate = (acceptedOffers.length / offers.length) * 100;

        const discounts = offers.map(
          (o: any) =>
            ((o.originalPrice - o.offeredPrice) / o.originalPrice) * 100,
        );
        stats.avgDiscount =
          discounts.reduce((sum, discount) => sum + discount, 0) /
          discounts.length;
      }

      return stats;
    } catch (error) {
      console.error("Error getting offer insights:", error);
      return {};
    }
  }

  // Private helper methods
  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem("offerNotifications");
      this.notifications = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading notifications:", error);
      this.notifications = [];
    }
  }

  private saveNotifications(): void {
    try {
      localStorage.setItem(
        "offerNotifications",
        JSON.stringify(this.notifications),
      );
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  }
}

export default LiveAIOfferMonitoring.getInstance();
