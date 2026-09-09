import PayPalService, { PayPalPayment } from "./PayPalService";

interface SoldItem {
  id: string;
  productId: string;
  productName: string;
  sellerId: string;
  buyerId: string;
  salePrice: number;
  platformFee: number;
  sellerAmount: number;
  paymentId: string;
  soldAt: string;
  shippingStatus: "pending" | "processing" | "shipped" | "delivered";
  aiReviewStatus: "pending" | "reviewed" | "rewarded";
  backlogStatus: "pending" | "processed";
}

interface ShippingInfo {
  id: string;
  saleId: string;
  method: "pickup" | "shipping" | "delivery";
  trackingNumber?: string;
  estimatedDelivery?: string;
  cost: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  aiRecommendations: string[];
}

interface RewardEvaluation {
  saleId: string;
  eligible: boolean;
  rewardType?: "discount" | "refund" | "bonus" | "loyalty_points";
  amount?: number;
  reason: string;
  applied: boolean;
  appliedAt?: string;
}

class AIManagementService {
  private static readonly SOLD_ITEMS_KEY = "soldItems";
  private static readonly SHIPPING_KEY = "shippingInfo";
  private static readonly REWARDS_KEY = "rewardEvaluations";

  static async processPaymentCompletion(paymentId: string): Promise<void> {
    console.log("🤖 AI: Processing payment completion for:", paymentId);

    try {
      const payment = PayPalService.getPaymentById(paymentId);
      if (!payment || payment.status !== "completed") {
        console.error("Payment not found or not completed:", paymentId);
        return;
      }

      // 1. Mark item as sold and update all site information
      await this.markItemAsSold(payment);

      // 2. Stop all other bids for this item
      await this.stopOtherBids(payment.productId);

      // 3. Update user accounts and features
      await this.updateUserAccounts(payment);

      // 4. Initialize AI shipping process
      await this.initializeShipping(payment);

      // 5. Add to sold items backlog for rewards evaluation
      await this.addToSoldItemsBacklog(payment);

      console.log("✅ AI: Payment processing completed for:", paymentId);
    } catch (error) {
      console.error("❌ AI: Failed to process payment completion:", error);
    }
  }

  private static async markItemAsSold(payment: PayPalPayment): Promise<void> {
    console.log("🤖 AI: Marking item as sold...");

    const soldItem: SoldItem = {
      id: `sold_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: payment.productId,
      productName: payment.description,
      sellerId: payment.sellerId,
      buyerId: payment.buyerId,
      salePrice: payment.amount,
      platformFee: payment.platformFee,
      sellerAmount: payment.sellerAmount,
      paymentId: payment.id,
      soldAt: new Date().toISOString(),
      shippingStatus: "pending",
      aiReviewStatus: "pending",
      backlogStatus: "pending",
    };

    // Save to sold items
    const existingSoldItems = this.getSoldItems();
    const updatedSoldItems = [...existingSoldItems, soldItem];
    localStorage.setItem(this.SOLD_ITEMS_KEY, JSON.stringify(updatedSoldItems));

    // Update product status in main products list
    const allProducts = JSON.parse(localStorage.getItem("allProducts") || "[]");
    const updatedProducts = allProducts.map((product: any) =>
      product.id === payment.productId
        ? { ...product, status: "sold", soldAt: new Date().toISOString() }
        : product,
    );
    localStorage.setItem("allProducts", JSON.stringify(updatedProducts));

    // Update guest uploads if it's a guest sale
    const guestUploads = JSON.parse(
      localStorage.getItem("guestUploads") || "[]",
    );
    const updatedGuestUploads = guestUploads.map((upload: any) =>
      upload.id === payment.productId
        ? { ...upload, status: "sold", soldAt: new Date().toISOString() }
        : upload,
    );
    localStorage.setItem("guestUploads", JSON.stringify(updatedGuestUploads));

    console.log("✅ AI: Item marked as sold:", soldItem);
  }

  private static async stopOtherBids(productId: string): Promise<void> {
    console.log("🤖 AI: Stopping other bids for product:", productId);

    // Get all offers and mark conflicting ones as expired
    const allOffers = JSON.parse(localStorage.getItem("offers") || "[]");
    const updatedOffers = allOffers.map((offer: any) =>
      offer.productId === productId && offer.status === "pending"
        ? {
            ...offer,
            status: "expired",
            expirationReason: "Item sold to another buyer",
            expiredAt: new Date().toISOString(),
          }
        : offer,
    );
    localStorage.setItem("offers", JSON.stringify(updatedOffers));

    console.log("✅ AI: Other bids stopped for product:", productId);
  }

  private static async updateUserAccounts(
    payment: PayPalPayment,
  ): Promise<void> {
    console.log("🤖 AI: Updating user accounts...");

    // Update seller's account
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const updatedUsers = allUsers.map((user: any) => {
      if (user.id === payment.sellerId) {
        return {
          ...user,
          totalSales: (user.totalSales || 0) + payment.sellerAmount,
          salesCount: (user.salesCount || 0) + 1,
          lastActive: new Date().toISOString(),
        };
      }
      if (user.id === payment.buyerId) {
        return {
          ...user,
          totalPurchases: (user.totalPurchases || 0) + payment.amount,
          purchaseCount: (user.purchaseCount || 0) + 1,
          lastActive: new Date().toISOString(),
        };
      }
      return user;
    });
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));

    // Update current user if they're involved
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (
      currentUser &&
      (currentUser.id === payment.sellerId ||
        currentUser.id === payment.buyerId)
    ) {
      const updatedCurrentUser = updatedUsers.find(
        (u: any) => u.id === currentUser.id,
      );
      if (updatedCurrentUser) {
        localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
      }
    }

    console.log("✅ AI: User accounts updated");
  }

  private static async initializeShipping(
    payment: PayPalPayment,
  ): Promise<void> {
    console.log("🤖 AI: Initializing shipping process...");

    // AI analyzes the item and recommends shipping method
    const aiRecommendations = this.generateShippingRecommendations(payment);

    const shippingInfo: ShippingInfo = {
      id: `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      saleId: payment.id,
      method: "shipping", // AI default recommendation
      cost: this.calculateShippingCost(payment),
      status: "pending",
      aiRecommendations,
    };

    const existingShipping = this.getShippingInfo();
    const updatedShipping = [...existingShipping, shippingInfo];
    localStorage.setItem(this.SHIPPING_KEY, JSON.stringify(updatedShipping));

    console.log("✅ AI: Shipping initialized:", shippingInfo);
  }

  private static generateShippingRecommendations(
    payment: PayPalPayment,
  ): string[] {
    const recommendations = [
      "Package securely with bubble wrap for fragile items",
      "Include tracking number for orders over $25",
      "Use eco-friendly packaging when possible",
      "Add personal thank you note for premium customers",
    ];

    // AI analysis based on item type, value, etc.
    if (payment.amount > 100) {
      recommendations.push(
        "Consider signature required delivery for high-value items",
      );
      recommendations.push("Include insurance for items over $100");
    }

    if (payment.description.toLowerCase().includes("vintage")) {
      recommendations.push("Extra protection recommended for vintage items");
    }

    return recommendations;
  }

  private static calculateShippingCost(payment: PayPalPayment): number {
    // AI calculates optimal shipping cost based on item characteristics
    let baseCost = 5.99;

    if (payment.amount > 50) baseCost += 2.0; // Higher value items
    if (payment.description.toLowerCase().includes("large")) baseCost += 3.0;

    return baseCost;
  }

  private static async addToSoldItemsBacklog(
    payment: PayPalPayment,
  ): Promise<void> {
    console.log(
      "🤖 AI: Adding to sold items backlog for rewards evaluation...",
    );

    // AI evaluates if this sale qualifies for rewards/discounts
    const rewardEvaluation: RewardEvaluation =
      await this.evaluateForRewards(payment);

    const existingRewards = this.getRewardEvaluations();
    const updatedRewards = [...existingRewards, rewardEvaluation];
    localStorage.setItem(this.REWARDS_KEY, JSON.stringify(updatedRewards));

    // If eligible, apply rewards automatically
    if (rewardEvaluation.eligible && rewardEvaluation.amount) {
      await this.applyReward(rewardEvaluation);
    }

    console.log("✅ AI: Backlog processing completed:", rewardEvaluation);
  }

  private static async evaluateForRewards(
    payment: PayPalPayment,
  ): Promise<RewardEvaluation> {
    // AI analysis for reward eligibility
    let eligible = false;
    let rewardType: RewardEvaluation["rewardType"];
    let amount = 0;
    let reason = "No rewards applicable";

    // Check if buyer is a repeat customer
    const buyerPayments = PayPalService.getPaymentsByUser(payment.buyerId);
    const completedPurchases = buyerPayments.filter(
      (p) => p.status === "completed",
    ).length;

    if (completedPurchases >= 5) {
      eligible = true;
      rewardType = "discount";
      amount = payment.amount * 0.05; // 5% loyalty discount
      reason = "Loyalty reward for repeat customer (5+ purchases)";
    } else if (payment.amount > 200) {
      eligible = true;
      rewardType = "bonus";
      amount = 10; // $10 bonus for large purchase
      reason = "Bonus reward for large purchase over $200";
    } else if (Math.random() > 0.9) {
      // 10% chance random reward
      eligible = true;
      rewardType = "loyalty_points";
      amount = Math.floor(payment.amount * 0.01); // 1% in points
      reason = "Random loyalty points reward";
    }

    return {
      saleId: payment.id,
      eligible,
      rewardType,
      amount,
      reason,
      applied: false,
    };
  }

  private static async applyReward(
    rewardEvaluation: RewardEvaluation,
  ): Promise<void> {
    if (!rewardEvaluation.eligible || !rewardEvaluation.amount) return;

    console.log("🤖 AI: Applying reward:", rewardEvaluation);

    // Update reward as applied
    const rewards = this.getRewardEvaluations();
    const updatedRewards = rewards.map((reward) =>
      reward.saleId === rewardEvaluation.saleId
        ? { ...reward, applied: true, appliedAt: new Date().toISOString() }
        : reward,
    );
    localStorage.setItem(this.REWARDS_KEY, JSON.stringify(updatedRewards));

    // Apply the actual reward (would integrate with payment system in production)
    console.log(
      `✅ AI: ${rewardEvaluation.rewardType} of $${rewardEvaluation.amount} applied for sale ${rewardEvaluation.saleId}`,
    );
  }

  // Getter methods
  static getSoldItems(): SoldItem[] {
    try {
      const items = localStorage.getItem(this.SOLD_ITEMS_KEY);
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  }

  static getShippingInfo(): ShippingInfo[] {
    try {
      const shipping = localStorage.getItem(this.SHIPPING_KEY);
      return shipping ? JSON.parse(shipping) : [];
    } catch {
      return [];
    }
  }

  static getRewardEvaluations(): RewardEvaluation[] {
    try {
      const rewards = localStorage.getItem(this.REWARDS_KEY);
      return rewards ? JSON.parse(rewards) : [];
    } catch {
      return [];
    }
  }

  // Dashboard methods for viewing AI-managed data
  static getDashboardStats(): {
    totalSoldItems: number;
    totalRevenue: number;
    pendingShipments: number;
    rewardsApplied: number;
    averageShippingCost: number;
  } {
    const soldItems = this.getSoldItems();
    const shippingInfo = this.getShippingInfo();
    const rewards = this.getRewardEvaluations();

    return {
      totalSoldItems: soldItems.length,
      totalRevenue: soldItems.reduce((sum, item) => sum + item.salePrice, 0),
      pendingShipments: shippingInfo.filter((s) => s.status === "pending")
        .length,
      rewardsApplied: rewards.filter((r) => r.applied).length,
      averageShippingCost:
        shippingInfo.length > 0
          ? shippingInfo.reduce((sum, s) => sum + s.cost, 0) /
            shippingInfo.length
          : 0,
    };
  }
}

export default AIManagementService;
export type { SoldItem, ShippingInfo, RewardEvaluation };
