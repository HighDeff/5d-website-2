// Live Offers Service - Manages real-time offers, bidding, and AI analysis
// Handles offer creation, validation, negotiation, and automatic processing

import DatabaseService from "./DatabaseService";
import TransactionProcessor from "./TransactionProcessor";
import ValidationService from "./ValidationService";
import EnhancedAIService from "./EnhancedAIService";

export interface Offer {
  id: string;
  type: "buy_offer" | "sell_offer" | "counter_offer" | "bid" | "trade_request";
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  offeredPrice: number;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  status:
    | "pending"
    | "accepted"
    | "declined"
    | "counter_offered"
    | "expired"
    | "processing"
    | "completed"
    | "ai_analyzing";
  message?: string;
  conditions: string[];
  expiresAt: string;
  aiAnalysis: OfferAIAnalysis;
  timeline: OfferEvent[];
  metadata: OfferMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface OfferAIAnalysis {
  priceReasonable: boolean;
  priceScore: number; // 0-100, higher = better deal
  marketComparison: {
    averagePrice: number;
    percentageDifference: number;
    verdict: "excellent" | "good" | "fair" | "poor" | "unreasonable";
  };
  userAnalysis: {
    buyerReliability: number;
    sellerReputation: number;
    transactionHistory: number;
  };
  recommendation: {
    action: "accept" | "counter" | "decline" | "negotiate";
    suggestedPrice?: number;
    reasoning: string;
    confidence: number;
  };
  riskFactors: string[];
  opportunities: string[];
  autoProcessing: boolean;
  processingReason?: string;
}

export interface OfferEvent {
  id: string;
  type:
    | "created"
    | "viewed"
    | "accepted"
    | "declined"
    | "countered"
    | "expired"
    | "ai_processed";
  description: string;
  timestamp: string;
  userId?: string;
  automated: boolean;
  metadata?: any;
}

export interface OfferMetadata {
  deviceId: string;
  sessionId: string;
  ipAddress?: string;
  originalOffer?: string; // Reference to original offer if this is a counter
  bidSequence?: number;
  paymentMethod?: "paypal" | "cashapp" | "crypto";
  shippingPreference?: string;
  urgency: "low" | "medium" | "high";
  tags: string[];
}

export interface OfferStats {
  totalOffers: number;
  activeOffers: number;
  completedOffers: number;
  averageResponseTime: number;
  acceptanceRate: number;
  averageDiscount: number;
  totalSavings: number;
  aiProcessedOffers: number;
}

class OffersService {
  private static instance: OffersService;
  private offers: Map<string, Offer> = new Map();
  private userOffers: Map<string, string[]> = new Map(); // userId -> offerIds
  private productOffers: Map<string, string[]> = new Map(); // productId -> offerIds
  private aiService: EnhancedAIService;
  private transactionProcessor: TransactionProcessor;
  private validationService: ValidationService;
  private autoProcessingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.aiService = EnhancedAIService.getInstance();
    this.transactionProcessor = TransactionProcessor.getInstance();
    this.validationService = ValidationService.getInstance();
    this.startAutoProcessing();
    this.loadOffersFromStorage();
  }

  static getInstance(): OffersService {
    if (!OffersService.instance) {
      OffersService.instance = new OffersService();
    }
    return OffersService.instance;
  }

  async createOffer(offerData: {
    type: Offer["type"];
    productId: string;
    productName: string;
    productImage: string;
    originalPrice: number;
    offeredPrice: number;
    fromUserId: string;
    toUserId: string;
    message?: string;
    conditions?: string[];
    paymentMethod?: "paypal" | "cashapp" | "crypto";
    shippingPreference?: string;
    urgency?: "low" | "medium" | "high";
  }): Promise<Offer> {
    const offerId = `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get user information
    const db = DatabaseService.getInstance();
    const fromUser = await db.getUserById(offerData.fromUserId);
    const toUser = await db.getUserById(offerData.toUserId);

    if (!fromUser || !toUser) {
      throw new Error("Invalid user IDs");
    }

    // Validate price
    const priceValidation = this.validateOfferPrice(
      offerData.originalPrice,
      offerData.offeredPrice,
      offerData.type,
    );

    if (!priceValidation.valid) {
      throw new Error(`Invalid offer price: ${priceValidation.reason}`);
    }

    const offer: Offer = {
      id: offerId,
      type: offerData.type,
      productId: offerData.productId,
      productName: offerData.productName,
      productImage: offerData.productImage,
      originalPrice: offerData.originalPrice,
      offeredPrice: offerData.offeredPrice,
      fromUserId: offerData.fromUserId,
      fromUserName: fromUser.name,
      toUserId: offerData.toUserId,
      toUserName: toUser.name,
      status: "ai_analyzing",
      message: offerData.message,
      conditions: offerData.conditions || [],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      aiAnalysis: {} as OfferAIAnalysis, // Will be populated by AI
      timeline: [
        {
          id: `event_${Date.now()}`,
          type: "created",
          description: `Offer created by ${fromUser.name}`,
          timestamp: new Date().toISOString(),
          userId: offerData.fromUserId,
          automated: false,
        },
      ],
      metadata: {
        deviceId: `device_${Math.random().toString(36).substr(2, 12)}`,
        sessionId: `session_${Date.now()}`,
        paymentMethod: offerData.paymentMethod,
        shippingPreference: offerData.shippingPreference,
        urgency: offerData.urgency || "medium",
        tags: [offerData.type, "new"],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Perform AI analysis
    offer.aiAnalysis = await this.performAIAnalysis(offer);

    // Update status based on AI analysis
    if (offer.aiAnalysis.autoProcessing) {
      offer.status = "processing";
      await this.autoProcessOffer(offer);
    } else {
      offer.status = "pending";
    }

    // Store offer
    this.offers.set(offerId, offer);
    this.indexOffer(offer);
    this.saveOffersToStorage();

    // Add timeline event for AI analysis
    offer.timeline.push({
      id: `event_${Date.now()}`,
      type: "ai_processed",
      description: `AI Analysis: ${offer.aiAnalysis.recommendation.action} - ${offer.aiAnalysis.recommendation.reasoning}`,
      timestamp: new Date().toISOString(),
      automated: true,
      metadata: { confidence: offer.aiAnalysis.recommendation.confidence },
    });

    return offer;
  }

  private validateOfferPrice(
    originalPrice: number,
    offeredPrice: number,
    type: Offer["type"],
  ): { valid: boolean; reason?: string } {
    if (offeredPrice <= 0) {
      return { valid: false, reason: "Offer price must be greater than zero" };
    }

    if (type === "buy_offer" || type === "bid") {
      // For buy offers, ensure it's not unreasonably low
      const minOffer = originalPrice * 0.1; // Minimum 10% of original price
      if (offeredPrice < minOffer) {
        return {
          valid: false,
          reason: "Offer too low - minimum 10% of asking price",
        };
      }
    }

    if (type === "sell_offer") {
      // For sell offers, ensure it's reasonable
      const maxOffer = originalPrice * 3; // Maximum 3x original price
      if (offeredPrice > maxOffer) {
        return {
          valid: false,
          reason: "Offer too high - maximum 300% of reference price",
        };
      }
    }

    return { valid: true };
  }

  private async performAIAnalysis(offer: Offer): Promise<OfferAIAnalysis> {
    // Simulate AI analysis with realistic data
    const priceRatio = offer.offeredPrice / offer.originalPrice;
    let priceScore = 50;
    let verdict: OfferAIAnalysis["marketComparison"]["verdict"] = "fair";
    let priceReasonable = true;

    // Price analysis
    if (offer.type === "buy_offer" || offer.type === "bid") {
      if (priceRatio >= 0.9) {
        priceScore = 95;
        verdict = "excellent";
      } else if (priceRatio >= 0.7) {
        priceScore = 80;
        verdict = "good";
      } else if (priceRatio >= 0.5) {
        priceScore = 60;
        verdict = "fair";
      } else if (priceRatio >= 0.3) {
        priceScore = 30;
        verdict = "poor";
      } else {
        priceScore = 10;
        verdict = "unreasonable";
        priceReasonable = false;
      }
    }

    // User analysis (simulate based on random data)
    const buyerReliability = Math.random() * 30 + 70; // 70-100%
    const sellerReputation = Math.random() * 20 + 80; // 80-100%
    const transactionHistory = Math.random() * 40 + 60; // 60-100%

    // Recommendation logic
    let action: OfferAIAnalysis["recommendation"]["action"] = "negotiate";
    let suggestedPrice: number | undefined;
    let reasoning = "";
    let confidence = 0;

    if (priceScore >= 80 && buyerReliability >= 80) {
      action = "accept";
      reasoning = "Excellent offer from reliable buyer with good price";
      confidence = 90;
    } else if (priceScore >= 60) {
      action = "counter";
      suggestedPrice = Math.round(offer.originalPrice * 0.85 * 100) / 100;
      reasoning = "Fair offer, suggest counter at 85% of asking price";
      confidence = 75;
    } else if (priceScore < 30) {
      action = "decline";
      reasoning = "Offer too low to be reasonable";
      confidence = 95;
    } else {
      action = "negotiate";
      suggestedPrice = Math.round(offer.originalPrice * 0.75 * 100) / 100;
      reasoning = "Opportunity for negotiation, suggest starting at 75%";
      confidence = 60;
    }

    // Risk factors
    const riskFactors: string[] = [];
    if (buyerReliability < 70) riskFactors.push("Low buyer reliability score");
    if (priceScore < 50) riskFactors.push("Significantly below market price");
    if (offer.urgency === "high")
      riskFactors.push("High urgency may indicate desperation");

    // Opportunities
    const opportunities: string[] = [];
    if (priceScore >= 70) opportunities.push("Good price potential");
    if (buyerReliability >= 85)
      opportunities.push("Reliable buyer with good history");
    if (offer.conditions.length === 0)
      opportunities.push("No special conditions");

    // Auto-processing decision
    const autoProcessing =
      confidence >= 85 && action === "accept" && riskFactors.length === 0;

    return {
      priceReasonable,
      priceScore,
      marketComparison: {
        averagePrice: offer.originalPrice * (0.8 + Math.random() * 0.4), // Simulate market data
        percentageDifference: Math.round((priceRatio - 1) * 100),
        verdict,
      },
      userAnalysis: {
        buyerReliability,
        sellerReputation,
        transactionHistory,
      },
      recommendation: {
        action,
        suggestedPrice,
        reasoning,
        confidence,
      },
      riskFactors,
      opportunities,
      autoProcessing,
      processingReason: autoProcessing
        ? "High confidence, low risk, excellent offer"
        : undefined,
    };
  }

  private async autoProcessOffer(offer: Offer): Promise<void> {
    if (offer.aiAnalysis.recommendation.action === "accept") {
      await this.acceptOffer(offer.id, offer.toUserId, true);
    } else if (
      offer.aiAnalysis.recommendation.action === "counter" &&
      offer.aiAnalysis.recommendation.suggestedPrice
    ) {
      await this.createCounterOffer(
        offer.id,
        offer.toUserId,
        offer.aiAnalysis.recommendation.suggestedPrice,
        "AI suggested counter-offer based on market analysis",
        true,
      );
    }
  }

  async acceptOffer(
    offerId: string,
    accepterId: string,
    automated = false,
  ): Promise<void> {
    const offer = this.offers.get(offerId);
    if (!offer) throw new Error("Offer not found");

    if (offer.status !== "pending") {
      throw new Error("Offer is not in pending status");
    }

    offer.status = "accepted";
    offer.updatedAt = new Date().toISOString();

    // Add timeline event
    offer.timeline.push({
      id: `event_${Date.now()}`,
      type: "accepted",
      description: automated
        ? "Auto-accepted by AI"
        : `Accepted by ${offer.toUserName}`,
      timestamp: new Date().toISOString(),
      userId: automated ? undefined : accepterId,
      automated,
    });

    // Process transaction
    await this.processOfferTransaction(offer);

    this.offers.set(offerId, offer);
    this.saveOffersToStorage();
  }

  async declineOffer(
    offerId: string,
    declinerId: string,
    reason?: string,
    automated = false,
  ): Promise<void> {
    const offer = this.offers.get(offerId);
    if (!offer) throw new Error("Offer not found");

    offer.status = "declined";
    offer.updatedAt = new Date().toISOString();

    // Add timeline event
    offer.timeline.push({
      id: `event_${Date.now()}`,
      type: "declined",
      description: automated
        ? `Auto-declined by AI: ${reason}`
        : `Declined by ${offer.toUserName}${reason ? `: ${reason}` : ""}`,
      timestamp: new Date().toISOString(),
      userId: automated ? undefined : declinerId,
      automated,
      metadata: { reason },
    });

    this.offers.set(offerId, offer);
    this.saveOffersToStorage();
  }

  async createCounterOffer(
    originalOfferId: string,
    counterId: string,
    counterPrice: number,
    message?: string,
    automated = false,
  ): Promise<Offer> {
    const originalOffer = this.offers.get(originalOfferId);
    if (!originalOffer) throw new Error("Original offer not found");

    // Update original offer status
    originalOffer.status = "counter_offered";
    originalOffer.updatedAt = new Date().toISOString();

    // Create counter offer
    const counterOffer = await this.createOffer({
      type: "counter_offer",
      productId: originalOffer.productId,
      productName: originalOffer.productName,
      productImage: originalOffer.productImage,
      originalPrice: originalOffer.originalPrice,
      offeredPrice: counterPrice,
      fromUserId: originalOffer.toUserId,
      toUserId: originalOffer.fromUserId,
      message: message || "Counter offer",
      conditions: originalOffer.conditions,
      paymentMethod: originalOffer.metadata.paymentMethod,
      urgency: originalOffer.metadata.urgency,
    });

    // Link to original offer
    counterOffer.metadata.originalOffer = originalOfferId;
    counterOffer.metadata.bidSequence =
      (originalOffer.metadata.bidSequence || 0) + 1;

    // Add timeline events
    originalOffer.timeline.push({
      id: `event_${Date.now()}`,
      type: "countered",
      description: automated
        ? `AI generated counter-offer: $${counterPrice}`
        : `Counter offer created: $${counterPrice}`,
      timestamp: new Date().toISOString(),
      userId: automated ? undefined : counterId,
      automated,
      metadata: { counterOfferId: counterOffer.id, counterPrice },
    });

    this.offers.set(originalOfferId, originalOffer);
    this.saveOffersToStorage();

    return counterOffer;
  }

  private async processOfferTransaction(offer: Offer): Promise<void> {
    // Process the transaction through TransactionProcessor
    const transactionData = {
      type: "offer" as const,
      fromUserId: offer.fromUserId,
      toUserId: offer.toUserId,
      amount: offer.offeredPrice,
      itemId: offer.productId,
      itemDetails: {
        id: offer.productId,
        name: offer.productName,
        description: `Offer transaction for ${offer.productName}`,
        price: offer.offeredPrice,
        images: [offer.productImage],
        category: "offer",
        condition: "negotiated",
        sellerId: offer.toUserId,
        isStoreItem: false,
      },
      content: `Offer accepted: ${offer.productName} for $${offer.offeredPrice}`,
      timestamp: new Date().toISOString(),
      metadata: {
        deviceId: offer.metadata.deviceId,
        sessionId: offer.metadata.sessionId,
        offerId: offer.id,
        originalPrice: offer.originalPrice,
        discountAmount: offer.originalPrice - offer.offeredPrice,
        discountPercent: Math.round(
          ((offer.originalPrice - offer.offeredPrice) / offer.originalPrice) *
            100,
        ),
      },
    };

    const result =
      await this.transactionProcessor.processTransaction(transactionData);

    if (result.success) {
      offer.status = "completed";
      offer.timeline.push({
        id: `event_${Date.now()}`,
        type: "ai_processed",
        description: `Transaction processed successfully: ${result.transaction?.id}`,
        timestamp: new Date().toISOString(),
        automated: true,
        metadata: { transactionId: result.transaction?.id },
      });
    } else {
      offer.status = "declined";
      offer.timeline.push({
        id: `event_${Date.now()}`,
        type: "ai_processed",
        description: `Transaction failed: ${result.error}`,
        timestamp: new Date().toISOString(),
        automated: true,
        metadata: { error: result.error },
      });
    }

    this.offers.set(offer.id, offer);
    this.saveOffersToStorage();
  }

  async getUserOffers(
    userId: string,
    type?: "sent" | "received",
  ): Promise<Offer[]> {
    const userOfferIds = this.userOffers.get(userId) || [];
    const offers = userOfferIds
      .map((id) => this.offers.get(id))
      .filter(Boolean) as Offer[];

    if (type === "sent") {
      return offers.filter((offer) => offer.fromUserId === userId);
    } else if (type === "received") {
      return offers.filter((offer) => offer.toUserId === userId);
    }

    return offers;
  }

  async getProductOffers(productId: string): Promise<Offer[]> {
    const productOfferIds = this.productOffers.get(productId) || [];
    return productOfferIds
      .map((id) => this.offers.get(id))
      .filter(Boolean) as Offer[];
  }

  async getUserOfferStats(userId: string): Promise<OfferStats> {
    const userOffers = await this.getUserOffers(userId);
    const sentOffers = userOffers.filter(
      (offer) => offer.fromUserId === userId,
    );
    const receivedOffers = userOffers.filter(
      (offer) => offer.toUserId === userId,
    );
    const completedOffers = userOffers.filter(
      (offer) => offer.status === "completed",
    );
    const activeOffers = userOffers.filter((offer) =>
      ["pending", "ai_analyzing", "processing"].includes(offer.status),
    );

    const aiProcessedOffers = userOffers.filter(
      (offer) =>
        offer.aiAnalysis?.autoProcessing ||
        offer.timeline.some((event) => event.automated),
    );

    const totalSavings = completedOffers.reduce((sum, offer) => {
      if (offer.fromUserId === userId) {
        return sum + (offer.originalPrice - offer.offeredPrice);
      }
      return sum;
    }, 0);

    const acceptedOffers = sentOffers.filter(
      (offer) => offer.status === "completed",
    );
    const acceptanceRate =
      sentOffers.length > 0 ? acceptedOffers.length / sentOffers.length : 0;

    const averageResponseTime =
      this.calculateAverageResponseTime(receivedOffers);
    const averageDiscount =
      completedOffers.length > 0
        ? completedOffers.reduce(
            (sum, offer) =>
              sum +
              (offer.originalPrice - offer.offeredPrice) / offer.originalPrice,
            0,
          ) / completedOffers.length
        : 0;

    return {
      totalOffers: userOffers.length,
      activeOffers: activeOffers.length,
      completedOffers: completedOffers.length,
      averageResponseTime,
      acceptanceRate,
      averageDiscount,
      totalSavings,
      aiProcessedOffers: aiProcessedOffers.length,
    };
  }

  private calculateAverageResponseTime(offers: Offer[]): number {
    const responseTimes = offers
      .filter((offer) => offer.timeline.length > 1)
      .map((offer) => {
        const created = new Date(offer.timeline[0].timestamp).getTime();
        const responded = new Date(offer.timeline[1].timestamp).getTime();
        return (responded - created) / (1000 * 60 * 60); // hours
      });

    return responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) /
          responseTimes.length
      : 0;
  }

  private indexOffer(offer: Offer): void {
    // Index by users
    [offer.fromUserId, offer.toUserId].forEach((userId) => {
      const userOffers = this.userOffers.get(userId) || [];
      userOffers.push(offer.id);
      this.userOffers.set(userId, userOffers);
    });

    // Index by product
    const productOffers = this.productOffers.get(offer.productId) || [];
    productOffers.push(offer.id);
    this.productOffers.set(offer.productId, productOffers);
  }

  private startAutoProcessing(): void {
    // Auto-process offers every minute
    this.autoProcessingInterval = setInterval(async () => {
      await this.processExpiredOffers();
      await this.processHighConfidenceOffers();
    }, 60000);
  }

  private async processExpiredOffers(): Promise<void> {
    const now = new Date().getTime();

    for (const [id, offer] of this.offers.entries()) {
      if (
        new Date(offer.expiresAt).getTime() < now &&
        offer.status === "pending"
      ) {
        await this.declineOffer(id, "system", "Offer expired", true);
      }
    }
  }

  private async processHighConfidenceOffers(): Promise<void> {
    for (const [id, offer] of this.offers.entries()) {
      if (
        offer.status === "pending" &&
        offer.aiAnalysis?.recommendation?.confidence >= 90 &&
        !offer.aiAnalysis.autoProcessing
      ) {
        // Process high-confidence offers that weren't auto-processed initially
        offer.aiAnalysis.autoProcessing = true;
        await this.autoProcessOffer(offer);
      }
    }
  }

  private saveOffersToStorage(): void {
    try {
      localStorage.setItem(
        "offers_data",
        JSON.stringify({
          offers: Object.fromEntries(this.offers),
          userOffers: Object.fromEntries(this.userOffers),
          productOffers: Object.fromEntries(this.productOffers),
        }),
      );
    } catch (error) {
      console.error("Failed to save offers to storage:", error);
    }
  }

  private loadOffersFromStorage(): void {
    try {
      const data = localStorage.getItem("offers_data");
      if (data) {
        const parsed = JSON.parse(data);
        this.offers = new Map(Object.entries(parsed.offers || {}));
        this.userOffers = new Map(Object.entries(parsed.userOffers || {}));
        this.productOffers = new Map(
          Object.entries(parsed.productOffers || {}),
        );
      }
    } catch (error) {
      console.error("Failed to load offers from storage:", error);
    }
  }

  async getOffer(offerId: string): Promise<Offer | undefined> {
    return this.offers.get(offerId);
  }

  async getAllOffers(): Promise<Offer[]> {
    return Array.from(this.offers.values());
  }

  destroy(): void {
    if (this.autoProcessingInterval) {
      clearInterval(this.autoProcessingInterval);
      this.autoProcessingInterval = null;
    }
  }
}

export default OffersService;
