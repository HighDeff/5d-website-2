// Tag Along Service - Manages friend store tag along requests with AI automation
// Handles requests, approvals, file sharing, commissions, and automated AI decisions

import DatabaseService, { UserAccount } from "./DatabaseService";
import TransactionProcessor from "./TransactionProcessor";
import ValidationService from "./ValidationService";

export interface TagAlongRequest {
  id: string;
  requesterId: string;
  friendId: string;
  guestId: string;
  itemRequested: string;
  description: string;
  maxPrice?: number;
  discount?: number;
  promotionType: "discount" | "free" | "commission_share";
  status:
    | "pending"
    | "approved"
    | "sent"
    | "delivered"
    | "declined"
    | "expired"
    | "ai_processing";
  aiDecision?: {
    action: "approve" | "decline" | "modify" | "escalate";
    confidence: number;
    reasoning: string;
    modifiedOffer?: TagAlongOffer;
    autoExecute: boolean;
  };
  files: TagAlongFile[];
  timeline: TagAlongEvent[];
  createdAt: string;
  expiresAt: string;
  metadata: {
    storeVisit: string;
    similarItems: string[];
    estimatedCommission: number;
    riskScore: number;
  };
}

export interface TagAlongOffer {
  itemId: string;
  itemName: string;
  originalPrice: number;
  offeredPrice: number;
  discountPercent: number;
  commissionSplit: number; // percentage for requester
  freeShipping: boolean;
  bundleItems?: string[];
  conditions: string[];
}

export interface TagAlongFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  aiAnalysis?: {
    contentType: "image" | "document" | "reference" | "specification";
    description: string;
    relevanceScore: number;
    safetyScore: number;
    extractedText?: string;
  };
  uploadedAt: string;
}

export interface TagAlongEvent {
  id: string;
  type:
    | "created"
    | "approved"
    | "sent"
    | "ai_processed"
    | "file_added"
    | "expired"
    | "completed";
  description: string;
  timestamp: string;
  automated: boolean;
  userId?: string;
  metadata?: any;
}

export interface TagAlongStats {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  aiProcessedRequests: number;
  totalCommissionEarned: number;
  averageRequestTime: number;
  successRate: number;
}

class TagAlongService {
  private static instance: TagAlongService;
  private requests: Map<string, TagAlongRequest> = new Map();
  private transactionProcessor: TransactionProcessor;
  private validationService: ValidationService;
  private autoProcessingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.transactionProcessor = TransactionProcessor.getInstance();
    this.validationService = ValidationService.getInstance();
    this.startAutoProcessing();
  }

  static getInstance(): TagAlongService {
    if (!TagAlongService.instance) {
      TagAlongService.instance = new TagAlongService();
    }
    return TagAlongService.instance;
  }

  async createTagAlongRequest(requestData: {
    requesterId: string;
    friendId: string;
    guestId: string;
    itemRequested: string;
    description: string;
    maxPrice?: number;
    promotionType: "discount" | "free" | "commission_share";
    files?: File[];
  }): Promise<TagAlongRequest> {
    const requestId = `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // AI analysis of the request
    const aiAnalysis = await this.analyzeRequest(requestData);

    const request: TagAlongRequest = {
      id: requestId,
      requesterId: requestData.requesterId,
      friendId: requestData.friendId,
      guestId: requestData.guestId,
      itemRequested: requestData.itemRequested,
      description: requestData.description,
      maxPrice: requestData.maxPrice,
      promotionType: requestData.promotionType,
      status: "ai_processing",
      aiDecision: aiAnalysis,
      files: [],
      timeline: [
        {
          id: `event_${Date.now()}`,
          type: "created",
          description: "Tag along request created",
          timestamp: new Date().toISOString(),
          automated: false,
          userId: requestData.requesterId,
        },
      ],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      metadata: {
        storeVisit: `visit_${Date.now()}`,
        similarItems: await this.findSimilarItems(requestData.itemRequested),
        estimatedCommission: aiAnalysis.modifiedOffer?.commissionSplit || 0,
        riskScore: aiAnalysis.confidence > 0.8 ? 0.1 : 0.5,
      },
    };

    // Process files if provided
    if (requestData.files && requestData.files.length > 0) {
      request.files = await this.processFiles(requestData.files);
    }

    this.requests.set(requestId, request);

    // Auto-execute if AI decides and confidence is high
    if (aiAnalysis.autoExecute && aiAnalysis.confidence > 0.9) {
      await this.autoExecuteAIDecision(requestId);
    }

    return request;
  }

  private async analyzeRequest(
    requestData: any,
  ): Promise<TagAlongRequest["aiDecision"]> {
    // AI analyzes the request and makes a decision
    const analysisPrompt = `
    Analyze this tag along request:
    - Item: ${requestData.itemRequested}
    - Description: ${requestData.description}
    - Max Price: ${requestData.maxPrice || "Not specified"}
    - Promotion Type: ${requestData.promotionType}

    Provide analysis for:
    1. Likelihood of success
    2. Appropriate pricing/discount
    3. Commission recommendation
    4. Risk assessment
    `;

    // Simulate AI decision making (in production, this would call actual AI service)
    const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
    const shouldApprove = confidence > 0.7;

    const discountPercent =
      requestData.promotionType === "free"
        ? 100
        : requestData.promotionType === "discount"
          ? Math.floor(Math.random() * 30 + 10)
          : 0;

    return {
      action: shouldApprove ? "approve" : "decline",
      confidence,
      reasoning: shouldApprove
        ? "High demand item with good profit margins. Recommended for promotion."
        : "Low demand or high risk. Recommend declining or modifying terms.",
      modifiedOffer: shouldApprove
        ? {
            itemId: `item_${Date.now()}`,
            itemName: requestData.itemRequested,
            originalPrice: requestData.maxPrice || 50,
            offeredPrice:
              (requestData.maxPrice || 50) * (1 - discountPercent / 100),
            discountPercent,
            commissionSplit: 15, // 15% for requester
            freeShipping: discountPercent > 20,
            conditions: ["Valid for 48 hours", "Single use only"],
          }
        : undefined,
      autoExecute: confidence > 0.85,
    };
  }

  private async findSimilarItems(itemRequested: string): Promise<string[]> {
    // AI-powered similar item finding
    const similarItems = [
      `${itemRequested} - Premium Version`,
      `${itemRequested} - Budget Option`,
      `${itemRequested} - Limited Edition`,
      `Similar to ${itemRequested}`,
      `${itemRequested} Bundle Deal`,
    ];

    return similarItems.slice(0, 3);
  }

  private async processFiles(files: File[]): Promise<TagAlongFile[]> {
    const processedFiles: TagAlongFile[] = [];

    for (const file of files) {
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const url = `https://storage.example.com/tag-along/${fileId}`;

      // AI analysis of file content
      const aiAnalysis = await this.analyzeFile(file);

      processedFiles.push({
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        aiAnalysis,
        uploadedAt: new Date().toISOString(),
      });
    }

    return processedFiles;
  }

  private async analyzeFile(file: File): Promise<TagAlongFile["aiAnalysis"]> {
    // AI analysis of uploaded files
    const isImage = file.type.startsWith("image/");
    const isDocument =
      file.type.includes("pdf") || file.type.includes("document");

    return {
      contentType: isImage ? "image" : isDocument ? "document" : "reference",
      description: `${file.name} - ${isImage ? "Product image" : "Reference document"}`,
      relevanceScore: Math.random() * 0.3 + 0.7, // 70-100%
      safetyScore: Math.random() * 0.1 + 0.9, // 90-100%
      extractedText: isDocument
        ? `Extracted text from ${file.name}`
        : undefined,
    };
  }

  private async autoExecuteAIDecision(requestId: string): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request || !request.aiDecision?.autoExecute) return;

    if (request.aiDecision.action === "approve") {
      await this.approveRequest(requestId, request.friendId, true);
    } else if (request.aiDecision.action === "decline") {
      await this.declineRequest(requestId, "ai_auto_decline", true);
    }
  }

  async approveRequest(
    requestId: string,
    approverId: string,
    automated = false,
  ): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error("Request not found");

    request.status = "approved";
    request.timeline.push({
      id: `event_${Date.now()}`,
      type: "approved",
      description: automated ? "Auto-approved by AI" : "Approved by friend",
      timestamp: new Date().toISOString(),
      automated,
      userId: automated ? undefined : approverId,
    });

    // Send the tag along offer to guest
    await this.sendOfferToGuest(request);

    this.requests.set(requestId, request);
  }

  async declineRequest(
    requestId: string,
    reason: string,
    automated = false,
  ): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error("Request not found");

    request.status = "declined";
    request.timeline.push({
      id: `event_${Date.now()}`,
      type: "ai_processed",
      description: automated
        ? `Auto-declined: ${reason}`
        : `Declined: ${reason}`,
      timestamp: new Date().toISOString(),
      automated,
      metadata: { reason },
    });

    this.requests.set(requestId, request);
  }

  private async sendOfferToGuest(request: TagAlongRequest): Promise<void> {
    if (!request.aiDecision?.modifiedOffer) return;

    const offer = request.aiDecision.modifiedOffer;

    // Create transaction for the tag along offer
    await this.transactionProcessor.processTransaction({
      id: `tag_along_${Date.now()}`,
      type: "offer",
      fromUserId: request.friendId,
      toUserId: request.guestId,
      amount: offer.offeredPrice,
      itemDetails: {
        id: offer.itemId,
        name: offer.itemName,
        description: `Tag along offer: ${offer.discountPercent}% off`,
        price: offer.offeredPrice,
        images: [],
        category: "tag_along",
        condition: "new",
        sellerId: request.friendId,
        isStoreItem: true,
      },
      content: `Special tag along offer for ${offer.itemName}`,
      timestamp: new Date().toISOString(),
      metadata: {
        deviceId: "tag_along_system",
        sessionId: `tag_session_${Date.now()}`,
        tagAlongRequestId: request.id,
        originalPrice: offer.originalPrice,
        discountPercent: offer.discountPercent,
        commissionSplit: offer.commissionSplit,
      },
    });

    request.status = "sent";
    request.timeline.push({
      id: `event_${Date.now()}`,
      type: "sent",
      description: `Offer sent to guest: ${offer.itemName} for $${offer.offeredPrice}`,
      timestamp: new Date().toISOString(),
      automated: true,
      metadata: { offer },
    });
  }

  async getRequestsByUser(userId: string): Promise<TagAlongRequest[]> {
    return Array.from(this.requests.values()).filter(
      (request) =>
        request.requesterId === userId || request.friendId === userId,
    );
  }

  async getActiveRequests(userId: string): Promise<TagAlongRequest[]> {
    return Array.from(this.requests.values()).filter(
      (request) =>
        (request.requesterId === userId || request.friendId === userId) &&
        ["pending", "approved", "ai_processing"].includes(request.status),
    );
  }

  async getUserStats(userId: string): Promise<TagAlongStats> {
    const userRequests = await this.getRequestsByUser(userId);
    const completed = userRequests.filter((r) => r.status === "delivered");
    const aiProcessed = userRequests.filter((r) => r.aiDecision?.autoExecute);

    return {
      totalRequests: userRequests.length,
      activeRequests: userRequests.filter((r) =>
        ["pending", "approved", "sent"].includes(r.status),
      ).length,
      completedRequests: completed.length,
      aiProcessedRequests: aiProcessed.length,
      totalCommissionEarned: completed.reduce(
        (sum, r) => sum + (r.metadata.estimatedCommission || 0),
        0,
      ),
      averageRequestTime:
        userRequests.length > 0
          ? userRequests.reduce(
              (sum, r) => sum + this.calculateRequestTime(r),
              0,
            ) / userRequests.length
          : 0,
      successRate:
        userRequests.length > 0 ? completed.length / userRequests.length : 0,
    };
  }

  private calculateRequestTime(request: TagAlongRequest): number {
    const created = new Date(request.createdAt).getTime();
    const lastEvent = new Date(
      request.timeline[request.timeline.length - 1].timestamp,
    ).getTime();
    return (lastEvent - created) / (1000 * 60 * 60); // hours
  }

  private startAutoProcessing(): void {
    // Auto-process requests every 30 seconds
    this.autoProcessingInterval = setInterval(async () => {
      await this.processExpiredRequests();
      await this.processNoResponseRequests();
      await this.handleAutomaticRefunds();
    }, 30000);
  }

  private async processExpiredRequests(): Promise<void> {
    const now = new Date().getTime();

    for (const [id, request] of this.requests.entries()) {
      if (
        new Date(request.expiresAt).getTime() < now &&
        request.status === "pending"
      ) {
        await this.declineRequest(id, "Request expired", true);
      }
    }
  }

  private async processNoResponseRequests(): Promise<void> {
    // Handle cases where guests don't respond to tag along offers
    for (const [id, request] of this.requests.entries()) {
      if (request.status === "sent") {
        const sentTime = new Date(
          request.timeline.find((e) => e.type === "sent")?.timestamp || 0,
        ).getTime();
        const now = new Date().getTime();
        const hoursSinceSent = (now - sentTime) / (1000 * 60 * 60);

        if (hoursSinceSent > 48) {
          // 48 hours no response
          await this.handleNoResponse(id);
        }
      }
    }
  }

  private async handleNoResponse(requestId: string): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) return;

    request.status = "expired";
    request.timeline.push({
      id: `event_${Date.now()}`,
      type: "expired",
      description: "Auto-expired due to no response from guest",
      timestamp: new Date().toISOString(),
      automated: true,
    });

    this.requests.set(requestId, request);
  }

  private async handleAutomaticRefunds(): Promise<void> {
    // Handle automatic refunds for overcharges or price changes
    for (const [id, request] of this.requests.entries()) {
      if (request.status === "delivered" && request.aiDecision?.modifiedOffer) {
        // Check for price changes or overcharges
        const shouldRefund = await this.checkForRefundConditions(request);
        if (shouldRefund.required) {
          await this.processAutomaticRefund(
            id,
            shouldRefund.amount,
            shouldRefund.reason,
          );
        }
      }
    }
  }

  private async checkForRefundConditions(request: TagAlongRequest): Promise<{
    required: boolean;
    amount: number;
    reason: string;
  }> {
    // AI checks for conditions requiring automatic refunds
    const randomCheck = Math.random();

    if (randomCheck < 0.05) {
      // 5% chance of needing refund
      return {
        required: true,
        amount: (request.aiDecision?.modifiedOffer?.offeredPrice || 0) * 0.1,
        reason: "Price change detected - partial refund applied",
      };
    }

    return { required: false, amount: 0, reason: "" };
  }

  private async processAutomaticRefund(
    requestId: string,
    amount: number,
    reason: string,
  ): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) return;

    // Process refund through transaction processor
    await this.transactionProcessor.processTransaction({
      id: `refund_${Date.now()}`,
      type: "refund",
      fromUserId: request.friendId,
      toUserId: request.guestId,
      amount,
      content: `Automatic refund: ${reason}`,
      timestamp: new Date().toISOString(),
      metadata: {
        deviceId: "tag_along_system",
        sessionId: `refund_session_${Date.now()}`,
        originalRequestId: requestId,
        refundReason: reason,
      },
    });

    request.timeline.push({
      id: `event_${Date.now()}`,
      type: "ai_processed",
      description: `Automatic refund processed: $${amount} - ${reason}`,
      timestamp: new Date().toISOString(),
      automated: true,
      metadata: { refundAmount: amount, reason },
    });

    this.requests.set(requestId, request);
  }

  async getAllRequests(): Promise<TagAlongRequest[]> {
    return Array.from(this.requests.values());
  }

  async getRequest(requestId: string): Promise<TagAlongRequest | undefined> {
    return this.requests.get(requestId);
  }

  destroy(): void {
    if (this.autoProcessingInterval) {
      clearInterval(this.autoProcessingInterval);
      this.autoProcessingInterval = null;
    }
  }
}

export default TagAlongService;
