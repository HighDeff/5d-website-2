// Enhanced AI Service with Multi-User Conversations, Sale Management, and Item Recommendations
// Handles user-to-user conversations, sale progress, item matching, and networking features

import DatabaseService from "./DatabaseService";
import AIChatService from "./AIChatService";
import TransactionProcessor from "./TransactionProcessor";
import TagAlongService from "./TagAlongService";
import FileShareService from "./FileShareService";

export interface SaleProgress {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  itemId: string;
  itemName: string;
  amount: number;
  status:
    | "auto_shipped"
    | "please_ship"
    | "shipping_in_progress"
    | "completed"
    | "waiting_for_refund"
    | "canceled"
    | "settled"
    | "reversed"
    | "dismissed"
    | "illegal";
  timeline: SaleProgressEvent[];
  estimatedDelivery?: string;
  trackingNumber?: string;
  autoActions: AutoAction[];
  createdAt: string;
  updatedAt: string;
}

export interface SaleProgressEvent {
  id: string;
  status: string;
  message: string;
  timestamp: string;
  automated: boolean;
  userId?: string;
  metadata?: any;
}

export interface AutoAction {
  type: "remind" | "escalate" | "refund" | "cancel" | "ship";
  scheduledAt: string;
  executed: boolean;
  executedAt?: string;
  result?: string;
}

export interface MultiUserConversation {
  id: string;
  participants: string[];
  aiModerator: boolean;
  purpose:
    | "sale_discussion"
    | "item_inquiry"
    | "general_chat"
    | "dispute_resolution";
  itemId?: string;
  saleId?: string;
  messages: ConversationMessage[];
  status: "active" | "completed" | "escalated";
  createdAt: string;
  lastActivity: string;
  metadata: ConversationMetadata;
}

export interface ConversationMessage {
  id: string;
  senderId: string;
  content: string;
  type: "text" | "offer" | "discount" | "item_share" | "ai_suggestion";
  timestamp: string;
  aiEnhanced?: boolean;
  suggestions?: string[];
  metadata?: any;
}

export interface ConversationMetadata {
  itemDiscussed?: string;
  discountOffered?: number;
  offerAmount?: number;
  urgency: "low" | "medium" | "high";
  tags: string[];
}

export interface ItemRecommendation {
  itemId: string;
  itemName: string;
  itemImage: string;
  price: number;
  sellerId: string;
  sellerName: string;
  matchReason: string;
  confidence: number;
  similarityScore: number;
}

export interface UserMatch {
  userId: string;
  userName: string;
  matchType:
    | "looking_for_similar"
    | "has_similar_item"
    | "potential_buyer"
    | "potential_seller";
  itemId: string;
  matchReason: string;
  confidence: number;
  suggested_action: string;
}

export interface FriendModeSettings {
  enabled: boolean;
  aggressiveness: "passive" | "moderate" | "aggressive";
  autoSuggestItems: boolean;
  autoOfferDiscounts: boolean;
  maxDiscountPercent: number;
  notifyOnSimilarItems: boolean;
}

export class EnhancedAIService {
  private static instance: EnhancedAIService;
  private activeConversations: Map<string, MultiUserConversation> = new Map();
  private saleProgresses: Map<string, SaleProgress> = new Map();
  private userMatches: Map<string, UserMatch[]> = new Map();
  private friendModeSettings: Map<string, FriendModeSettings> = new Map();

  static getInstance(): EnhancedAIService {
    if (!EnhancedAIService.instance) {
      EnhancedAIService.instance = new EnhancedAIService();
    }
    return EnhancedAIService.instance;
  }

  constructor() {
    this.loadData();
    this.startItemMatching();
    this.startSaleMonitoring();
  }

  // Sale Progress Management
  async createSaleProgress(saleData: {
    orderId: string;
    buyerId: string;
    sellerId: string;
    itemId: string;
    itemName: string;
    amount: number;
  }): Promise<SaleProgress> {
    const progress: SaleProgress = {
      id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      ...saleData,
      status: "please_ship",
      timeline: [
        {
          id: `event_${Date.now()}`,
          status: "order_created",
          message: "Order created successfully",
          timestamp: new Date().toISOString(),
          automated: true,
        },
      ],
      autoActions: [
        {
          type: "remind",
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          executed: false,
        },
        {
          type: "escalate",
          scheduledAt: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 5 days
          executed: false,
        },
        {
          type: "refund",
          scheduledAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 7 days
          executed: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saleProgresses.set(progress.id, progress);
    await this.saveSaleProgress(progress);

    // Start AI monitoring
    await this.startAIMonitoring(progress);

    return progress;
  }

  async updateSaleProgress(
    progressId: string,
    newStatus: SaleProgress["status"],
    message?: string,
  ): Promise<void> {
    const progress = this.saleProgresses.get(progressId);
    if (!progress) return;

    progress.status = newStatus;
    progress.updatedAt = new Date().toISOString();

    // Add timeline event
    progress.timeline.push({
      id: `event_${Date.now()}`,
      status: newStatus,
      message: message || `Status updated to ${newStatus}`,
      timestamp: new Date().toISOString(),
      automated: false,
    });

    // Handle status-specific actions
    switch (newStatus) {
      case "shipping_in_progress":
        progress.estimatedDelivery = new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000,
        ).toISOString();
        await this.notifyParticipants(
          progress,
          "🚚 Your item is now shipping! Estimated delivery in 3 days.",
        );
        break;
      case "completed":
        await this.notifyParticipants(
          progress,
          "✅ Order completed successfully! Thank you for using Lilly's Thrift.",
        );
        break;
      case "waiting_for_refund":
        await this.initiateRefundProcess(progress);
        break;
    }

    await this.saveSaleProgress(progress);
  }

  // Multi-User Conversations
  async createConversation(
    participants: string[],
    purpose: MultiUserConversation["purpose"],
    metadata?: Partial<ConversationMetadata>,
  ): Promise<MultiUserConversation> {
    const conversation: MultiUserConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      participants,
      aiModerator: true,
      purpose,
      messages: [],
      status: "active",
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      metadata: {
        urgency: "medium",
        tags: [],
        ...metadata,
      },
    };

    this.activeConversations.set(conversation.id, conversation);

    // Add AI welcome message
    await this.addAIMessage(
      conversation.id,
      this.generateWelcomeMessage(purpose, participants.length),
    );

    return conversation;
  }

  async addMessageToConversation(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<ConversationMessage> {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const message: ConversationMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      senderId,
      content,
      type: "text",
      timestamp: new Date().toISOString(),
      aiEnhanced: false,
    };

    conversation.messages.push(message);
    conversation.lastActivity = new Date().toISOString();

    // AI analysis and enhancement
    const aiResponse = await this.processMessageWithAI(message, conversation);
    if (aiResponse) {
      conversation.messages.push(aiResponse);
    }

    // Check for automatic actions
    await this.checkForAutoActions(conversation, message);

    return message;
  }

  private async processMessageWithAI(
    message: ConversationMessage,
    conversation: MultiUserConversation,
  ): Promise<ConversationMessage | null> {
    const content = message.content.toLowerCase();

    // Detect intent
    if (
      content.includes("price") ||
      content.includes("offer") ||
      content.includes("discount")
    ) {
      return await this.handlePricingDiscussion(message, conversation);
    }

    if (content.includes("shipping") || content.includes("delivery")) {
      return await this.handleShippingInquiry(message, conversation);
    }

    if (
      content.includes("similar") ||
      content.includes("recommend") ||
      content.includes("like this")
    ) {
      return await this.handleItemRecommendation(message, conversation);
    }

    if (
      content.includes("problem") ||
      content.includes("issue") ||
      content.includes("help")
    ) {
      return await this.handleSupportRequest(message, conversation);
    }

    // General AI response for conversation flow
    return await this.generateContextualResponse(message, conversation);
  }

  // Item Recommendations and Matching
  async getItemRecommendations(
    userId: string,
    query: string,
  ): Promise<ItemRecommendation[]> {
    const db = DatabaseService.getInstance();
    const allUsers = await db.getAllUsers();
    const recommendations: ItemRecommendation[] = [];

    // Find items matching the query
    for (const user of allUsers) {
      if (user.id === userId) continue; // Skip own items

      const userItems = user.portfolio.itemsActive || [];
      for (const item of userItems) {
        const matchScore = this.calculateItemMatch(query, item);
        if (matchScore > 0.3) {
          // 30% similarity threshold
          recommendations.push({
            itemId: item.id,
            itemName: item.name,
            itemImage: item.image || "default.jpg",
            price: item.price,
            sellerId: user.id,
            sellerName: user.fullName,
            matchReason: this.generateMatchReason(query, item),
            confidence: matchScore,
            similarityScore: matchScore,
          });
        }
      }
    }

    // Sort by confidence and return top 10
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }

  async findUserMatches(userId: string): Promise<UserMatch[]> {
    const cached = this.userMatches.get(userId);
    if (cached) return cached;

    const db = DatabaseService.getInstance();
    const user = await db.getUserById(userId);
    if (!user) return [];

    const allUsers = await db.getAllUsers();
    const matches: UserMatch[] = [];

    for (const otherUser of allUsers) {
      if (otherUser.id === userId) continue;

      // Find matches based on user interests, recent searches, etc.
      const match = await this.analyzeUserCompatibility(user, otherUser);
      if (match) {
        matches.push(match);
      }
    }

    this.userMatches.set(userId, matches);
    return matches;
  }

  // Friend Mode Features
  async enableFriendMode(
    userId: string,
    settings: Partial<FriendModeSettings>,
  ): Promise<void> {
    const defaultSettings: FriendModeSettings = {
      enabled: true,
      aggressiveness: "moderate",
      autoSuggestItems: true,
      autoOfferDiscounts: false,
      maxDiscountPercent: 10,
      notifyOnSimilarItems: true,
    };

    this.friendModeSettings.set(userId, { ...defaultSettings, ...settings });
    await this.saveFriendModeSettings(userId);

    if (settings.enabled) {
      await this.startFriendModeMonitoring(userId);
    }
  }

  private async startFriendModeMonitoring(userId: string): Promise<void> {
    const settings = this.friendModeSettings.get(userId);
    if (!settings?.enabled) return;

    // Monitor for similar item searches
    setInterval(async () => {
      const matches = await this.findUserMatches(userId);
      for (const match of matches) {
        if (
          match.matchType === "looking_for_similar" &&
          settings.notifyOnSimilarItems
        ) {
          await this.notifyUserAboutMatch(userId, match);
        }
      }
    }, 60000); // Check every minute
  }

  // AI-Enhanced Sale Handling
  async handleSaleWithAI(
    saleData: any,
  ): Promise<{ handled: boolean; action: string; details?: any }> {
    const aiDecision = await this.makeAISaleDecision(saleData);

    switch (aiDecision.action) {
      case "auto_ship":
        await this.processAutoShipping(saleData);
        return { handled: true, action: "auto_shipped", details: aiDecision };

      case "forward_to_user":
        await this.forwardSaleToUser(saleData, aiDecision.targetUserId);
        return { handled: true, action: "forwarded", details: aiDecision };

      case "request_verification":
        await this.requestSaleVerification(saleData);
        return {
          handled: false,
          action: "verification_needed",
          details: aiDecision,
        };

      default:
        return { handled: false, action: "manual_review", details: aiDecision };
    }
  }

  // Conversation Management with Turn-Taking
  async manageTurnTaking(conversationId: string): Promise<void> {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) return;

    const lastMessages = conversation.messages.slice(-3);
    const speakerCounts = new Map<string, number>();

    // Count recent messages per participant
    lastMessages.forEach((msg) => {
      const count = speakerCounts.get(msg.senderId) || 0;
      speakerCounts.set(msg.senderId, count + 1);
    });

    // Find participants who haven't spoken recently
    const quietParticipants = conversation.participants.filter(
      (id) => !speakerCounts.has(id) || speakerCounts.get(id)! < 1,
    );

    // Encourage participation from quiet users
    if (quietParticipants.length > 0) {
      const encouragementMessage = await this.generateEncouragementMessage(
        conversation,
        quietParticipants,
      );
      await this.addAIMessage(conversationId, encouragementMessage);
    }
  }

  // Helper Methods
  private async startAIMonitoring(progress: SaleProgress): Promise<void> {
    console.log(`🤖 Starting AI monitoring for sale ${progress.id}`);
    // Set up automated monitoring and actions
  }

  private async notifyParticipants(
    progress: SaleProgress,
    message: string,
  ): Promise<void> {
    console.log(`📧 Notifying participants: ${message}`);
    // Send notifications to buyer and seller
  }

  private async initiateRefundProcess(progress: SaleProgress): Promise<void> {
    console.log(`💰 Initiating refund process for ${progress.id}`);
    // Start automated refund process
  }

  private generateWelcomeMessage(
    purpose: string,
    participantCount: number,
  ): string {
    switch (purpose) {
      case "sale_discussion":
        return `👋 Welcome! I'm here to help facilitate this sale discussion between ${participantCount} participants. I can help with pricing, shipping details, and any questions you might have.`;
      case "item_inquiry":
        return `🔍 Hi! I'll help you discuss this item. Feel free to ask about condition, measurements, shipping, or anything else. I can also suggest similar items if needed.`;
      case "dispute_resolution":
        return `⚖️ I'm here to help resolve this dispute fairly. Let's work together to find a solution that works for everyone.`;
      default:
        return `💬 Welcome to the conversation! I'm here to help facilitate the discussion and provide assistance as needed.`;
    }
  }

  private calculateItemMatch(query: string, item: any): number {
    const queryWords = query.toLowerCase().split(" ");
    const itemText =
      `${item.name} ${item.description} ${item.category}`.toLowerCase();

    let matches = 0;
    for (const word of queryWords) {
      if (itemText.includes(word)) {
        matches++;
      }
    }

    return matches / queryWords.length;
  }

  private generateMatchReason(query: string, item: any): string {
    const queryWords = query.toLowerCase().split(" ");
    const matchingWords = queryWords.filter(
      (word) =>
        item.name.toLowerCase().includes(word) ||
        item.description?.toLowerCase().includes(word),
    );

    return `Matches "${matchingWords.join(", ")}" from your search`;
  }

  private async analyzeUserCompatibility(
    user1: any,
    user2: any,
  ): Promise<UserMatch | null> {
    // Analyze user profiles, recent activity, preferences
    // Return match if compatibility found
    return null; // Placeholder
  }

  private async makeAISaleDecision(
    saleData: any,
  ): Promise<{ action: string; confidence: number; targetUserId?: string }> {
    // AI decision-making logic for sale handling
    return { action: "manual_review", confidence: 0.5 };
  }

  private async handlePricingDiscussion(
    message: ConversationMessage,
    conversation: MultiUserConversation,
  ): Promise<ConversationMessage> {
    const aiMessage: ConversationMessage = {
      id: `ai_${Date.now()}`,
      senderId: "ai",
      content:
        "I can help with pricing! Would you like me to suggest a fair price based on similar items, or help negotiate between the current offers?",
      type: "ai_suggestion",
      timestamp: new Date().toISOString(),
      aiEnhanced: true,
      suggestions: [
        "Show similar prices",
        "Suggest counter-offer",
        "Calculate shipping costs",
      ],
    };

    return aiMessage;
  }

  private async handleShippingInquiry(
    message: ConversationMessage,
    conversation: MultiUserConversation,
  ): Promise<ConversationMessage> {
    const aiMessage: ConversationMessage = {
      id: `ai_${Date.now()}`,
      senderId: "ai",
      content:
        "I can help with shipping information! Standard shipping takes 3-5 business days. Would you like me to calculate exact shipping costs or suggest faster delivery options?",
      type: "ai_suggestion",
      timestamp: new Date().toISOString(),
      aiEnhanced: true,
      suggestions: [
        "Calculate shipping",
        "Express delivery options",
        "Shipping insurance",
      ],
    };

    return aiMessage;
  }

  private async handleItemRecommendation(
    message: ConversationMessage,
    conversation: MultiUserConversation,
  ): Promise<ConversationMessage> {
    const aiMessage: ConversationMessage = {
      id: `ai_${Date.now()}`,
      senderId: "ai",
      content:
        "I found some similar items you might like! Let me show you the top recommendations based on your interests.",
      type: "item_share",
      timestamp: new Date().toISOString(),
      aiEnhanced: true,
      suggestions: [
        "Show similar items",
        "Filter by price",
        "Save to favorites",
      ],
    };

    return aiMessage;
  }

  private async handleSupportRequest(
    message: ConversationMessage,
    conversation: MultiUserConversation,
  ): Promise<ConversationMessage> {
    const aiMessage: ConversationMessage = {
      id: `ai_${Date.now()}`,
      senderId: "ai",
      content:
        "I'm here to help! What specific issue are you experiencing? I can assist with order tracking, returns, payments, or connect you with human support if needed.",
      type: "ai_suggestion",
      timestamp: new Date().toISOString(),
      aiEnhanced: true,
      suggestions: [
        "Order tracking",
        "Return request",
        "Payment help",
        "Contact support",
      ],
    };

    return aiMessage;
  }

  private async generateContextualResponse(
    message: ConversationMessage,
    conversation: MultiUserConversation,
  ): Promise<ConversationMessage | null> {
    // Generate contextual AI response based on conversation flow
    if (Math.random() > 0.7) {
      // 30% chance of AI intervention
      return {
        id: `ai_${Date.now()}`,
        senderId: "ai",
        content:
          "Is there anything I can help clarify or any additional information you need?",
        type: "ai_suggestion",
        timestamp: new Date().toISOString(),
        aiEnhanced: true,
      };
    }
    return null;
  }

  private async generateEncouragementMessage(
    conversation: MultiUserConversation,
    quietUsers: string[],
  ): Promise<string> {
    const db = DatabaseService.getInstance();
    const userNames = await Promise.all(
      quietUsers.map(async (id) => {
        const user = await db.getUserById(id);
        return user?.firstName || "User";
      }),
    );

    return `👋 ${userNames.join(" and ")}, would you like to share your thoughts or ask any questions about this ${conversation.purpose.replace("_", " ")}?`;
  }

  private async addAIMessage(
    conversationId: string,
    content: string,
  ): Promise<void> {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) return;

    conversation.messages.push({
      id: `ai_${Date.now()}`,
      senderId: "ai",
      content,
      type: "ai_suggestion",
      timestamp: new Date().toISOString(),
      aiEnhanced: true,
    });
  }

  private async checkForAutoActions(
    conversation: MultiUserConversation,
    message: ConversationMessage,
  ): Promise<void> {
    const content = message.content.toLowerCase();

    // Auto-offer discounts for interested buyers
    if (content.includes("interested") || content.includes("want to buy")) {
      const settings = this.friendModeSettings.get(message.senderId);
      if (settings?.autoOfferDiscounts) {
        await this.offerAutoDiscount(conversation, message.senderId);
      }
    }
  }

  private async offerAutoDiscount(
    conversation: MultiUserConversation,
    buyerId: string,
  ): Promise<void> {
    const discountMessage: ConversationMessage = {
      id: `discount_${Date.now()}`,
      senderId: "ai",
      content:
        "🎉 Great news! The seller is offering a 5% discount for serious buyers. Would you like to apply this discount to your purchase?",
      type: "discount",
      timestamp: new Date().toISOString(),
      aiEnhanced: true,
      metadata: { discountPercent: 5, buyerId },
    };

    conversation.messages.push(discountMessage);
  }

  private async notifyUserAboutMatch(
    userId: string,
    match: UserMatch,
  ): Promise<void> {
    console.log(
      `🔔 Notifying user ${userId} about match: ${match.matchReason}`,
    );
    // Send notification about potential match
  }

  // Data persistence methods
  private async saveSaleProgress(progress: SaleProgress): Promise<void> {
    localStorage.setItem(
      `sale_progress_${progress.id}`,
      JSON.stringify(progress),
    );
  }

  private async saveFriendModeSettings(userId: string): Promise<void> {
    const settings = this.friendModeSettings.get(userId);
    if (settings) {
      localStorage.setItem(`friend_mode_${userId}`, JSON.stringify(settings));
    }
  }

  private loadData(): void {
    // Load sale progresses
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("sale_progress_")) {
        const data = localStorage.getItem(key);
        if (data) {
          const progress = JSON.parse(data);
          this.saleProgresses.set(progress.id, progress);
        }
      }
    }
  }

  private startItemMatching(): void {
    // Start background item matching service
    setInterval(
      () => {
        this.processItemMatching();
      },
      5 * 60 * 1000,
    ); // Every 5 minutes
  }

  private startSaleMonitoring(): void {
    // Monitor sale progresses for automated actions
    setInterval(() => {
      this.processSaleActions();
    }, 60 * 1000); // Every minute
  }

  private async processItemMatching(): Promise<void> {
    // Background item matching logic
  }

  private async processSaleActions(): Promise<void> {
    // Process automated sale actions
    for (const [id, progress] of this.saleProgresses) {
      for (const action of progress.autoActions) {
        if (!action.executed && new Date() >= new Date(action.scheduledAt)) {
          await this.executeAutoAction(progress, action);
        }
      }
    }
  }

  private async executeAutoAction(
    progress: SaleProgress,
    action: AutoAction,
  ): Promise<void> {
    console.log(`🤖 Executing auto action: ${action.type} for ${progress.id}`);
    action.executed = true;
    action.executedAt = new Date().toISOString();
    await this.saveSaleProgress(progress);
  }

  // Tag Along Request Management
  async createTagAlongRequest(requestData: {
    requesterId: string;
    friendId: string;
    guestId: string;
    itemRequested: string;
    description: string;
    maxPrice?: number;
    promotionType: "discount" | "free" | "commission_share";
    files?: File[];
  }): Promise<any> {
    // Create the tag along request through the service
    const tagAlongService = TagAlongService.getInstance();
    const request = await tagAlongService.createTagAlongRequest(requestData);

    // AI analysis and automatic friend recommendations
    await this.analyzeTagAlongForFriendMode(request);

    return request;
  }

  private async analyzeTagAlongForFriendMode(request: any): Promise<void> {
    // AI analyzes the tag along request and suggests to friends
    const friendSettings = this.friendModeSettings.get(request.friendId);

    if (friendSettings?.enabled && friendSettings.autoSuggestItems) {
      const suggestions = await this.generateItemSuggestions(
        request.itemRequested,
      );

      // Auto-suggest similar items to the friend's network
      await this.autoSuggestToNetwork(
        request.friendId,
        suggestions,
        friendSettings.aggressiveness,
      );
    }

    // Update friend mode behavior based on tag along patterns
    this.updateFriendModeBasedOnActivity(
      request.friendId,
      request.promotionType,
    );
  }

  private async generateItemSuggestions(
    itemRequested: string,
  ): Promise<string[]> {
    // AI generates similar item suggestions
    const suggestions = [
      `${itemRequested} - Premium Edition`,
      `${itemRequested} - Budget Version`,
      `${itemRequested} - Similar Style`,
      `${itemRequested} - Complete Set`,
      `Alternatives to ${itemRequested}`,
    ];

    return suggestions.slice(0, 3); // Top 3 suggestions
  }

  private async autoSuggestToNetwork(
    userId: string,
    suggestions: string[],
    aggressiveness: "passive" | "moderate" | "aggressive",
  ): Promise<void> {
    // Auto-suggest items based on friend mode aggressiveness
    const matches = this.userMatches.get(userId) || [];
    const targetCount =
      aggressiveness === "aggressive"
        ? 5
        : aggressiveness === "moderate"
          ? 3
          : 1;

    for (let i = 0; i < Math.min(targetCount, matches.length); i++) {
      const match = matches[i];
      const discount = this.calculateAutoDiscount(aggressiveness);

      await this.sendAutoSuggestion(
        match.userId,
        suggestions[i % suggestions.length],
        discount,
      );
    }
  }

  private calculateAutoDiscount(
    aggressiveness: "passive" | "moderate" | "aggressive",
  ): number {
    switch (aggressiveness) {
      case "aggressive":
        return Math.floor(Math.random() * 10 + 15); // 15-25%
      case "moderate":
        return Math.floor(Math.random() * 8 + 8); // 8-16%
      case "passive":
        return Math.floor(Math.random() * 5 + 3); // 3-8%
      default:
        return 5;
    }
  }

  private async sendAutoSuggestion(
    userId: string,
    item: string,
    discount: number,
  ): Promise<void> {
    console.log(
      `🤖 Auto-suggesting to user ${userId}: ${item} with ${discount}% discount`,
    );

    // In a real implementation, this would send a notification or message to the user
    // For now, we'll just log the action
  }

  private updateFriendModeBasedOnActivity(
    userId: string,
    promotionType: string,
  ): void {
    const settings = this.friendModeSettings.get(userId);
    if (!settings) return;

    // AI adjusts friend mode settings based on activity patterns
    if (promotionType === "free" && settings.aggressiveness === "passive") {
      settings.aggressiveness = "moderate";
      console.log(
        `🤖 Updated ${userId} friend mode to moderate due to generous promotion activity`,
      );
    } else if (
      promotionType === "commission_share" &&
      settings.aggressiveness === "moderate"
    ) {
      settings.aggressiveness = "aggressive";
      console.log(
        `🤖 Updated ${userId} friend mode to aggressive due to commission sharing activity`,
      );
    }

    this.friendModeSettings.set(userId, settings);
    this.saveFriendModeSettings(userId);
  }

  // File sharing with AI recommendations
  async shareFileWithTagAlong(
    userId: string,
    file: File,
    tagAlongRequestId: string,
    description?: string,
  ): Promise<any> {
    const fileShareService = FileShareService.getInstance();

    const sharedFile = await fileShareService.uploadFile(userId, file, {
      contextId: tagAlongRequestId,
      description,
      category: "reference",
      expiresInHours: 168, // 7 days
    });

    // AI analyzes the shared file for item recommendations
    await this.analyzeSharedFileForRecommendations(sharedFile, userId);

    return sharedFile;
  }

  private async analyzeSharedFileForRecommendations(
    sharedFile: any,
    userId: string,
  ): Promise<void> {
    if (!sharedFile.aiValidation) return;

    // AI analyzes file content and makes recommendations
    if (
      sharedFile.aiValidation.contentType === "image" &&
      sharedFile.aiValidation.imageAnalysis?.isProductImage
    ) {
      const recommendations = await this.getItemRecommendations(
        userId,
        `similar to ${sharedFile.aiValidation.imageAnalysis.objectsDetected.join(" ")}`,
      );

      // Auto-notify interested friends about the shared product image
      const friendSettings = this.friendModeSettings.get(userId);
      if (friendSettings?.enabled && friendSettings.notifyOnSimilarItems) {
        await this.notifyFriendsAboutSharedFile(
          userId,
          sharedFile,
          recommendations,
        );
      }
    }
  }

  private async notifyFriendsAboutSharedFile(
    userId: string,
    sharedFile: any,
    recommendations: any[],
  ): Promise<void> {
    const matches = this.userMatches.get(userId) || [];

    for (const match of matches.slice(0, 3)) {
      // Notify top 3 matches
      if (match.matchType === "looking_for_similar") {
        console.log(
          `🔔 Notifying ${match.userId} about shared file from ${userId}: ${sharedFile.name}`,
        );

        // In real implementation, send notification to user
        await this.sendAutoSuggestion(
          match.userId,
          `Check out ${sharedFile.name} shared by a friend`,
          this.calculateAutoDiscount("moderate"),
        );
      }
    }
  }

  // Public API methods
  async getSaleProgress(progressId: string): Promise<SaleProgress | null> {
    return this.saleProgresses.get(progressId) || null;
  }

  async getConversation(
    conversationId: string,
  ): Promise<MultiUserConversation | null> {
    return this.activeConversations.get(conversationId) || null;
  }

  async getAllSaleProgresses(): Promise<SaleProgress[]> {
    return Array.from(this.saleProgresses.values());
  }

  async getActiveConversations(
    userId: string,
  ): Promise<MultiUserConversation[]> {
    return Array.from(this.activeConversations.values()).filter((conv) =>
      conv.participants.includes(userId),
    );
  }

  // Error analysis for console monitoring
  async analyzeError(
    logEntry: any,
  ): Promise<{ analysis: string; suggestions: any[] } | null> {
    try {
      const message = logEntry.message || "";
      const level = logEntry.level || "info";

      // Basic analysis for common errors
      if (message.includes("DatabaseService.getInstance is not a function")) {
        return {
          analysis:
            "DatabaseService import error detected. The service is exported as default but being used as a static method.",
          suggestions: [
            {
              id: `fix_${Date.now()}`,
              logId: logEntry.id,
              title: "Fix DatabaseService Import",
              description: "Update import to use default export",
              solution:
                'Change import to: import DatabaseService from "./DatabaseService"',
              confidence: 0.95,
              automated: true,
              testable: true,
            },
          ],
        };
      }

      if (message.includes("is not a function") && level === "error") {
        const methodMatch = message.match(/(\w+) is not a function/);
        const method = methodMatch ? methodMatch[1] : "unknown";

        return {
          analysis: `Method "${method}" is undefined. This could indicate a missing method, incorrect binding, or import issue.`,
          suggestions: [
            {
              id: `fix_${Date.now()}`,
              logId: logEntry.id,
              title: `Fix Missing Method: ${method}`,
              description: "Add the missing method or check method binding",
              solution: `Implement the ${method} method or verify it exists`,
              confidence: 0.8,
              automated: false,
              testable: true,
            },
          ],
        };
      }

      // Generic analysis
      return {
        analysis: `${level.toUpperCase()} detected: ${message.slice(0, 100)}...`,
        suggestions: [
          {
            id: `fix_${Date.now()}`,
            logId: logEntry.id,
            title: "General Debug",
            description: "Review error details and context",
            solution: "Check console for full error details and stack trace",
            confidence: 0.5,
            automated: false,
            testable: false,
          },
        ],
      };
    } catch (error) {
      console.error("Error in AI analysis:", error);
      return null;
    }
  }
}

export default EnhancedAIService;
