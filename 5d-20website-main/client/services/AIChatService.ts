// AI Chat Service with Different Access Levels
// Handles guest AI, member AI, admin AI, and message filtering

import DatabaseService from "./DatabaseService";
import TransactionProcessor from "./TransactionProcessor";

export interface ChatMessage {
  id: string;
  userId: string;
  userRole: "guest" | "member" | "admin";
  content: string;
  aiResponse: string;
  timestamp: string;
  category: "general" | "sales" | "dispute" | "technical" | "business";
  flagged: boolean;
  flagReason?: string;
  resolved: boolean;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface ChatSession {
  id: string;
  userId: string;
  userRole: "guest" | "member" | "admin";
  messages: ChatMessage[];
  startedAt: string;
  lastActivity: string;
  status: "active" | "closed" | "flagged";
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  actions?: ChatAction[];
  escalate?: boolean;
  escalationReason?: string;
  category: string;
  confidence: number;
}

export interface ChatAction {
  type: "link" | "button" | "form" | "escalate";
  label: string;
  action: string;
  data?: any;
}

export interface FilteredMessage {
  originalMessage: ChatMessage;
  importance: "low" | "medium" | "high" | "critical";
  categories: string[];
  adminSummary: string;
  suggestedActions: string[];
  userInfo: {
    userId: string;
    name: string;
    email: string;
    membershipLevel: string;
    accountStatus: string;
    recentActivity: string[];
  };
}

export class AIChatService {
  private static instance: AIChatService;
  private activeSessions: Map<string, ChatSession> = new Map();
  private filteredMessages: FilteredMessage[] = [];

  // Knowledge base for different user types
  private guestKnowledge = {
    business: {
      "what is lilly's thrift":
        "Lilly's Thrift is a premier online marketplace for buying and selling pre-owned fashion, home goods, and unique finds. We focus on quality, sustainability, and community.",
      "how does it work":
        "Simply browse our collections, make offers on items you love, or create an account to start selling your own pre-owned items.",
      shipping:
        "We offer secure shipping with tracking. Sellers have 7 days to ship items after purchase.",
      returns:
        "Items can be returned within 30 days if not as described or damaged during shipping.",
      membership:
        "We offer Free, Member ($9.99/month), and Premium ($19.99/month) plans with different commission rates and features.",
    },
    categories: {
      jewelry:
        "We have a curated selection of vintage and contemporary jewelry including rings, necklaces, earrings, and watches.",
      clothing:
        "Our clothing collection features designer pieces, vintage finds, and everyday essentials for all styles.",
      "home & kitchen":
        "From vintage decor to modern kitchen gadgets, find unique items to make your house a home.",
      "shoes & accessories":
        "Complete your look with our selection of shoes, bags, scarves, and other accessories.",
      beauty:
        "Discover new and gently used beauty products, skincare, and wellness items.",
    },
  };

  private memberKnowledge = {
    ...this.guestKnowledge,
    sales: {
      "how to sell":
        "Upload photos, write descriptions, set prices. Our AI helps optimize your listings for better visibility.",
      "commission rates":
        "Free: 15%, Member: 10%, Premium: 5% commission on sales.",
      payment:
        "Earnings are available for withdrawal 24 hours after buyer confirms receipt.",
      "shipping labels": "We provide prepaid shipping labels for easy sending.",
      "pricing tips":
        "Research similar items, consider condition, and price competitively for quick sales.",
    },
    account: {
      "track earnings":
        "View detailed earnings, pending sales, and transaction history in your dashboard.",
      "payment methods":
        "Add PayPal, CashApp, or bank account for easy payouts.",
      "boost listings":
        "Premium members get featured listings and priority in search results.",
      analytics:
        "See view counts, favorites, and performance metrics for your items.",
    },
  };

  private adminKnowledge = {
    ...this.memberKnowledge,
    system: {
      "user management":
        "Full access to user accounts, transactions, and system settings.",
      "dispute resolution":
        "Handle refunds, returns, and user conflicts with AI assistance.",
      analytics:
        "Access comprehensive platform analytics and financial reports.",
      moderation:
        "AI-powered content moderation with manual override capabilities.",
      "system health":
        "Monitor real-time system performance and user activity.",
    },
  };

  static getInstance(): AIChatService {
    if (!AIChatService.instance) {
      AIChatService.instance = new AIChatService();
    }
    return AIChatService.instance;
  }

  constructor() {
    this.startMessageFiltering();
  }

  // Start a chat session
  async startChatSession(
    userId: string,
    userRole: "guest" | "member" | "admin",
  ): Promise<ChatSession> {
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

    const session: ChatSession = {
      id: sessionId,
      userId,
      userRole,
      messages: [],
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: "active",
    };

    this.activeSessions.set(sessionId, session);

    // Send welcome message
    const welcomeMessage = await this.generateWelcomeMessage(userRole);
    await this.addMessageToSession(sessionId, {
      userId: "ai",
      userRole,
      content: welcomeMessage.content,
      aiResponse: "",
      category: "general",
      flagged: false,
      resolved: true,
      priority: "low",
    });

    return session;
  }

  // Send message and get AI response
  async sendMessage(
    sessionId: string,
    userId: string,
    content: string,
  ): Promise<ChatMessage> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error("Chat session not found");
    }

    // Create user message
    const userMessage: Partial<ChatMessage> = {
      userId,
      userRole: session.userRole,
      content,
      aiResponse: "",
      category: this.categorizeMessage(content),
      flagged: false,
      resolved: false,
      priority: this.calculatePriority(content, session.userRole),
    };

    // Generate AI response
    const aiResponse = await this.generateAIResponse(
      content,
      session.userRole,
      userId,
    );
    userMessage.aiResponse = aiResponse.content;

    // Check if message should be escalated
    if (aiResponse.escalate) {
      userMessage.flagged = true;
      userMessage.priority = "urgent";
      await this.escalateToAdmin(
        userMessage as ChatMessage,
        aiResponse.escalationReason!,
      );
    }

    // Add to session
    const message = await this.addMessageToSession(sessionId, userMessage);

    // Update session activity
    session.lastActivity = new Date().toISOString();

    // Filter for admin if important
    if (this.shouldFilterForAdmin(message)) {
      await this.filterMessageForAdmin(message);
    }

    return message;
  }

  // Generate AI response based on user role
  private async generateAIResponse(
    content: string,
    userRole: "guest" | "member" | "admin",
    userId: string,
  ): Promise<AIResponse> {
    const lowerContent = content.toLowerCase();
    let response = "";
    let category = "general";
    let escalate = false;
    let escalationReason = "";
    let confidence = 0.8;
    const suggestions: string[] = [];
    const actions: ChatAction[] = [];

    // Check for dispute/problem keywords
    const disputeKeywords = [
      "dispute",
      "problem",
      "issue",
      "complaint",
      "refund",
      "damaged",
      "wrong item",
      "not received",
      "scam",
      "fraud",
    ];
    const isDispute = disputeKeywords.some((keyword) =>
      lowerContent.includes(keyword),
    );

    if (isDispute) {
      category = "dispute";
      if (userRole === "guest") {
        response =
          "I understand you're having an issue. For account-specific problems, please create an account so I can better assist you with your order details.";
        actions.push({
          type: "link",
          label: "Create Account",
          action: "/auth",
        });
      } else {
        response =
          "I'm sorry to hear about this issue. Let me help you resolve this. Can you provide your order number or more details about the problem?";
        escalate = true;
        escalationReason =
          "User reporting dispute/problem - needs human attention";
      }
      return {
        content: response,
        category,
        escalate,
        escalationReason,
        confidence,
        suggestions,
        actions,
      };
    }

    // Role-specific responses
    switch (userRole) {
      case "guest":
        response = await this.generateGuestResponse(lowerContent);
        break;
      case "member":
        response = await this.generateMemberResponse(lowerContent, userId);
        break;
      case "admin":
        response = await this.generateAdminResponse(lowerContent, userId);
        break;
    }

    // Add suggestions based on content
    if (lowerContent.includes("sell")) {
      suggestions.push(
        "How to price items",
        "Photography tips",
        "Shipping guidelines",
      );
    } else if (lowerContent.includes("buy")) {
      suggestions.push(
        "How to make offers",
        "Return policy",
        "Payment methods",
      );
    }

    return { content: response, category, confidence, suggestions, actions };
  }

  private async generateGuestResponse(content: string): Promise<string> {
    // Check business knowledge
    for (const [key, value] of Object.entries(this.guestKnowledge.business)) {
      if (content.includes(key.replace(/'/g, ""))) {
        return value;
      }
    }

    // Check category knowledge
    for (const [category, description] of Object.entries(
      this.guestKnowledge.categories,
    )) {
      if (content.includes(category)) {
        return description;
      }
    }

    // General responses
    if (content.includes("account") || content.includes("sign up")) {
      return "Creating an account is free and gives you access to selling features, order tracking, and personalized recommendations. You can start with our Free plan or upgrade to Member/Premium for better rates.";
    }

    if (content.includes("price") || content.includes("cost")) {
      return "Prices vary by item and seller. You can make offers on most items! Our commission rates are: Free members 15%, Members 10%, Premium 5%.";
    }

    if (content.includes("safe") || content.includes("secure")) {
      return "We prioritize safety with secure payments, buyer protection, verified sellers, and AI-powered fraud detection. All transactions are monitored for your security.";
    }

    return "I'm here to help with questions about Lilly's Thrift! I can tell you about our marketplace, how buying and selling works, our policies, and help you get started. What would you like to know?";
  }

  private async generateMemberResponse(
    content: string,
    userId: string,
  ): Promise<string> {
    // Get user data for personalized responses
    const db = DatabaseService.getInstance();
    const user = await db.getUserById(userId);

    // Check sales-specific knowledge
    for (const [key, value] of Object.entries(this.memberKnowledge.sales)) {
      if (content.includes(key.replace(/'/g, ""))) {
        return value;
      }
    }

    // Personalized responses
    if (content.includes("earnings") || content.includes("money")) {
      const earnings = user?.portfolio.totalEarnings || 0;
      const salesCount = user?.portfolio.salesCount || 0;
      return `You've earned $${earnings.toFixed(2)} from ${salesCount} sales! ${salesCount < 5 ? "Keep listing items to build your seller reputation." : "Great work! Consider upgrading to Premium for lower commission rates."}`;
    }

    if (content.includes("boost") || content.includes("more sales")) {
      return "To boost sales: 1) Use high-quality photos, 2) Write detailed descriptions, 3) Price competitively, 4) Respond quickly to offers, 5) Consider Premium membership for featured listings.";
    }

    if (content.includes("shipping")) {
      const pendingShipments =
        user?.portfolio.sales.filter(
          (s) => s.status === "completed" && !s.shippedAt,
        ).length || 0;
      if (pendingShipments > 0) {
        return `You have ${pendingShipments} items waiting to ship. Remember to ship within 7 days to maintain your seller rating. Need shipping labels? I can help with that!`;
      }
      return "Ship items within 7 days of sale using our prepaid labels. Track shipments to keep buyers informed and maintain your seller rating.";
    }

    return (
      this.generateGuestResponse(content) +
      " As a member, you have access to detailed analytics, lower commission rates, and priority support. Need help with selling or managing your account?"
    );
  }

  private async generateAdminResponse(
    content: string,
    userId: string,
  ): Promise<string> {
    // Admin has access to everything
    if (content.includes("user") && content.includes("stats")) {
      const db = DatabaseService.getInstance();
      const users = await db.getAllUsers();
      const activeUsers = users.filter((u) => u.status === "active").length;
      const totalSales = users.reduce(
        (sum, u) => sum + u.portfolio.totalSales,
        0,
      );
      return `System Stats: ${users.length} total users, ${activeUsers} active, $${totalSales.toFixed(2)} total sales volume. ${this.filteredMessages.length} filtered messages awaiting review.`;
    }

    if (content.includes("dispute") || content.includes("flag")) {
      const urgentMessages = this.filteredMessages.filter(
        (m) => m.importance === "critical",
      ).length;
      const highPriorityMessages = this.filteredMessages.filter(
        (m) => m.importance === "high",
      ).length;
      return `${urgentMessages} critical disputes, ${highPriorityMessages} high-priority issues. Use the admin dashboard to review filtered messages and take action.`;
    }

    if (content.includes("system") || content.includes("health")) {
      return "System running normally. AI monitoring active, transaction processing operational, real-time sync enabled. Check the monitoring dashboard for detailed metrics.";
    }

    return (
      this.generateMemberResponse(content, userId) +
      " You have full admin access to user management, dispute resolution, system analytics, and all platform features."
    );
  }

  private generateWelcomeMessage(
    userRole: "guest" | "member" | "admin",
  ): AIResponse {
    let content = "";
    const suggestions: string[] = [];

    switch (userRole) {
      case "guest":
        content =
          "👋 Welcome to Lilly's Thrift! I'm your AI assistant. I can help you learn about our marketplace, how to buy and sell items, and answer questions about our policies. What would you like to know?";
        suggestions.push(
          "How does Lilly's work?",
          "What can I buy here?",
          "How to create an account?",
        );
        break;
      case "member":
        content =
          "🌟 Hello! I'm your AI assistant with access to member features. I can help with selling tips, earnings tracking, shipping questions, and account management. How can I assist you today?";
        suggestions.push(
          "Check my earnings",
          "Shipping help",
          "Boost my sales",
        );
        break;
      case "admin":
        content =
          "🔧 Admin AI Assistant ready. I have full system access and can help with user management, dispute resolution, system monitoring, and analytics. What do you need help with?";
        suggestions.push("System stats", "Review disputes", "User analytics");
        break;
    }

    return {
      content,
      suggestions,
      category: "general",
      confidence: 1.0,
    };
  }

  // Message categorization
  private categorizeMessage(content: string): string {
    const lowerContent = content.toLowerCase();

    if (
      ["dispute", "problem", "issue", "complaint", "refund", "damaged"].some(
        (word) => lowerContent.includes(word),
      )
    ) {
      return "dispute";
    }
    if (
      ["sell", "earnings", "commission", "shipping", "list"].some((word) =>
        lowerContent.includes(word),
      )
    ) {
      return "sales";
    }
    if (
      ["technical", "bug", "error", "not working", "broken"].some((word) =>
        lowerContent.includes(word),
      )
    ) {
      return "technical";
    }
    if (
      ["business", "company", "about", "how it works"].some((word) =>
        lowerContent.includes(word),
      )
    ) {
      return "business";
    }
    return "general";
  }

  private calculatePriority(
    content: string,
    userRole: string,
  ): "low" | "medium" | "high" | "urgent" {
    const lowerContent = content.toLowerCase();

    // Urgent keywords
    if (
      ["scam", "fraud", "stolen", "emergency", "urgent", "hack"].some((word) =>
        lowerContent.includes(word),
      )
    ) {
      return "urgent";
    }

    // High priority
    if (
      ["dispute", "refund", "not received", "wrong item", "damaged"].some(
        (word) => lowerContent.includes(word),
      )
    ) {
      return "high";
    }

    // Medium priority for members
    if (
      userRole !== "guest" &&
      ["shipping", "payment", "earnings", "account"].some((word) =>
        lowerContent.includes(word),
      )
    ) {
      return "medium";
    }

    return "low";
  }

  // Admin message filtering
  private shouldFilterForAdmin(message: ChatMessage): boolean {
    return (
      message.priority === "urgent" ||
      message.priority === "high" ||
      message.category === "dispute" ||
      message.flagged
    );
  }

  private async filterMessageForAdmin(message: ChatMessage): Promise<void> {
    const db = DatabaseService.getInstance();
    const user = await db.getUserById(message.userId);

    if (!user) return;

    const filteredMessage: FilteredMessage = {
      originalMessage: message,
      importance:
        message.priority === "urgent"
          ? "critical"
          : message.priority === "high"
            ? "high"
            : "medium",
      categories: [message.category],
      adminSummary: this.generateAdminSummary(message, user),
      suggestedActions: this.generateSuggestedActions(message),
      userInfo: {
        userId: user.id,
        name: user.fullName,
        email: user.email,
        membershipLevel: user.portfolio.membershipLevel,
        accountStatus: user.status,
        recentActivity: this.getUserRecentActivity(user),
      },
    };

    this.filteredMessages.unshift(filteredMessage);

    // Keep only last 100 filtered messages
    if (this.filteredMessages.length > 100) {
      this.filteredMessages = this.filteredMessages.slice(0, 100);
    }

    // Store for persistence
    localStorage.setItem(
      "ai_filtered_messages",
      JSON.stringify(this.filteredMessages),
    );

    console.log(
      `🔍 Filtered message for admin review: ${message.category} - ${message.priority}`,
    );
  }

  private generateAdminSummary(message: ChatMessage, user: any): string {
    const userSummary = `${user.fullName} (${user.portfolio.membershipLevel}) - ${user.portfolio.salesCount} sales, $${user.portfolio.totalEarnings.toFixed(2)} earned`;
    const messageSummary = `${message.category.toUpperCase()}: ${message.content.substring(0, 100)}${message.content.length > 100 ? "..." : ""}`;
    return `${userSummary} | ${messageSummary}`;
  }

  private generateSuggestedActions(message: ChatMessage): string[] {
    const actions: string[] = [];

    switch (message.category) {
      case "dispute":
        actions.push(
          "Review transaction history",
          "Contact involved parties",
          "Process refund if applicable",
        );
        break;
      case "technical":
        actions.push(
          "Check system logs",
          "Test functionality",
          "Update user on fix timeline",
        );
        break;
      case "sales":
        actions.push(
          "Review seller account",
          "Check listing compliance",
          "Provide selling guidance",
        );
        break;
    }

    if (message.priority === "urgent") {
      actions.unshift("Immediate response required");
    }

    return actions;
  }

  private getUserRecentActivity(user: any): string[] {
    const activity: string[] = [];

    if (user.portfolio.sales.length > 0) {
      const recentSale = user.portfolio.sales[user.portfolio.sales.length - 1];
      activity.push(
        `Last sale: ${new Date(recentSale.date).toLocaleDateString()}`,
      );
    }

    if (user.lastLoginAt) {
      activity.push(
        `Last login: ${new Date(user.lastLoginAt).toLocaleDateString()}`,
      );
    }

    activity.push(
      `Member since: ${new Date(user.createdAt).toLocaleDateString()}`,
    );

    return activity;
  }

  private async escalateToAdmin(
    message: ChatMessage,
    reason: string,
  ): Promise<void> {
    console.log(`🚨 Escalating message to admin: ${reason}`);
    await this.filterMessageForAdmin(message);
  }

  private async addMessageToSession(
    sessionId: string,
    messageData: Partial<ChatMessage>,
  ): Promise<ChatMessage> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Generate unique ID with session and message count to prevent duplicates
    const messageCount = session.messages.length;
    const uniqueId = `msg_${sessionId}_${Date.now()}_${messageCount}_${Math.random().toString(36).substr(2, 8)}`;

    const message: ChatMessage = {
      id: uniqueId,
      userId: messageData.userId!,
      userRole: messageData.userRole!,
      content: messageData.content!,
      aiResponse: messageData.aiResponse!,
      timestamp: new Date().toISOString(),
      category: messageData.category!,
      flagged: messageData.flagged!,
      resolved: messageData.resolved!,
      priority: messageData.priority!,
    };

    // Check if this message already exists to prevent duplicates
    const existingMessage = session.messages.find(
      (m) =>
        m.content === message.content &&
        m.userId === message.userId &&
        Math.abs(
          new Date(m.timestamp).getTime() -
            new Date(message.timestamp).getTime(),
        ) < 1000,
    );

    if (!existingMessage) {
      session.messages.push(message);
    }

    return existingMessage || message;
  }

  private startMessageFiltering(): void {
    // Load existing filtered messages
    const stored = localStorage.getItem("ai_filtered_messages");
    if (stored) {
      this.filteredMessages = JSON.parse(stored);
    }
  }

  // Public methods for external access
  async getSession(sessionId: string): Promise<ChatSession | null> {
    return this.activeSessions.get(sessionId) || null;
  }

  async getFilteredMessages(): Promise<FilteredMessage[]> {
    return this.filteredMessages;
  }

  async markMessageResolved(messageId: string): Promise<void> {
    this.filteredMessages = this.filteredMessages.filter(
      (m) => m.originalMessage.id !== messageId,
    );
    localStorage.setItem(
      "ai_filtered_messages",
      JSON.stringify(this.filteredMessages),
    );
  }

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    return Array.from(this.activeSessions.values()).filter(
      (s) => s.userId === userId,
    );
  }
}

export default AIChatService;
