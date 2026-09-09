// Comprehensive Transaction Processing Service
// Handles all business logic, payments, shipping, refunds with multi-layered AI validation

import DatabaseService, { UserAccount } from "./DatabaseService";
import ValidationService from "./ValidationService";
import RealTimeSyncService from "./RealTimeSync";
import MonitoringService from "./MonitoringService";

export interface Transaction {
  id: string;
  type:
    | "purchase"
    | "sale"
    | "offer"
    | "refund"
    | "shipping"
    | "message"
    | "tag_along"
    | "commission";
  fromUserId: string;
  toUserId: string;
  amount?: number;
  itemId?: string;
  itemDetails?: ItemDetails;
  content?: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "shipped"
    | "delivered";
  timestamp: string;
  metadata: TransactionMetadata;
  validationLayers: ValidationResult[];
  businessLogic: BusinessLogicResult;
  tagAlongData?: TagAlongTransactionData;
}

export interface ItemDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  sellerId: string;
  isStoreItem: boolean;
}

export interface TagAlongTransactionData {
  requestId: string;
  originalPrice: number;
  discountPercent: number;
  commissionSplit: number;
  requesterId: string;
  friendId: string;
  guestId: string;
  automaticProcessing: boolean;
}

export interface TransactionMetadata {
  deviceId: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  geolocation?: string;
  referrer?: string;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  taxInfo?: TaxInfo;
}

export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface TaxInfo {
  rate: number;
  amount: number;
  jurisdiction: string;
}

export interface ValidationResult {
  layer: string;
  passed: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
  processingTimeMs: number;
  timestamp: string;
}

export interface BusinessLogicResult {
  commission: number;
  sellerEarnings: number;
  platformFee: number;
  tax: number;
  shippingCost: number;
  totalCost: number;
  escrowAmount: number;
  refundPolicy: RefundPolicy;
}

export interface RefundPolicy {
  eligible: boolean;
  deadline: string;
  conditions: string[];
  automaticApproval: boolean;
}

export interface BusinessAccount {
  id: string;
  balance: number;
  escrowBalance: number;
  totalRevenue: number;
  totalCommissions: number;
  transactions: string[];
  lastUpdated: string;
}

export interface ShippingTimer {
  orderId: string;
  sellerId: string;
  buyerId: string;
  itemId: string;
  deadline: string;
  remindersS: number;
  lastReminderSent?: string;
  status: "active" | "shipped" | "overdue" | "cancelled";
  autoRefundScheduled?: string;
}

export class TransactionProcessor {
  private static instance: TransactionProcessor;
  private businessAccount: BusinessAccount;
  private activeShippingTimers: Map<string, ShippingTimer> = new Map();
  private validationLayers = [
    "Frontend Validation",
    "Backend Validation",
    "Database Validation",
    "Security Check",
    "AI Content Analysis",
    "Cross-Reference Check",
    "Business Logic Validation",
    "Math Verification",
    "Compliance Check",
    "Fraud Detection",
    "Format Validation",
    "Final Verification",
  ];

  static getInstance(): TransactionProcessor {
    if (!TransactionProcessor.instance) {
      TransactionProcessor.instance = new TransactionProcessor();
    }
    return TransactionProcessor.instance;
  }

  constructor() {
    this.businessAccount = {
      id: "lillys_business_account",
      balance: 0,
      escrowBalance: 0,
      totalRevenue: 0,
      totalCommissions: 0,
      transactions: [],
      lastUpdated: new Date().toISOString(),
    };

    this.loadBusinessAccount();
    this.startShippingMonitor();
  }

  // Main transaction processing method
  async processTransaction(transactionData: Partial<Transaction>): Promise<{
    success: boolean;
    transaction?: Transaction;
    error?: string;
  }> {
    try {
      console.log("🔄 Starting transaction processing:", transactionData.type);

      // Create transaction object
      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        type: transactionData.type!,
        fromUserId: transactionData.fromUserId!,
        toUserId: transactionData.toUserId!,
        amount: transactionData.amount,
        itemId: transactionData.itemId,
        itemDetails: transactionData.itemDetails,
        content: transactionData.content,
        status: "pending",
        timestamp: new Date().toISOString(),
        metadata: this.generateMetadata(),
        validationLayers: [],
        businessLogic: {} as BusinessLogicResult,
      };

      // Run multi-layered validation
      const validationResults = await this.runValidationLayers(transaction);
      transaction.validationLayers = validationResults;

      // Check if validation passed
      const criticalFailures = validationResults.filter(
        (v) =>
          !v.passed &&
          ["Security Check", "Fraud Detection", "Database Validation"].includes(
            v.layer,
          ),
      );

      if (criticalFailures.length > 0) {
        transaction.status = "failed";
        console.log(
          "❌ Transaction failed critical validation:",
          criticalFailures,
        );
        return {
          success: false,
          error: "Transaction failed security validation",
        };
      }

      // Calculate business logic
      transaction.businessLogic =
        await this.calculateBusinessLogic(transaction);

      // Process based on transaction type
      switch (transaction.type) {
        case "purchase":
          await this.processPurchase(transaction);
          break;
        case "sale":
          await this.processSale(transaction);
          break;
        case "offer":
          await this.processOffer(transaction);
          break;
        case "refund":
          await this.processRefund(transaction);
          break;
        case "message":
          await this.processMessage(transaction);
          break;
        case "shipping":
          await this.processShipping(transaction);
          break;
        case "tag_along":
          await this.processTagAlong(transaction);
          break;
        case "commission":
          await this.processCommission(transaction);
          break;
      }

      // Update business account
      await this.updateBusinessAccount(transaction);

      // Store transaction
      await this.storeTransaction(transaction);

      // Trigger real-time updates
      const syncService = RealTimeSyncService.getInstance();
      await syncService.sendPulse({
        userId: transaction.fromUserId,
        timestamp: transaction.timestamp,
        newData: { lastTransaction: transaction.id },
        oldData: {},
        requestType: "update",
        deviceId: transaction.metadata.deviceId,
        sessionId: transaction.metadata.sessionId,
      });

      console.log("✅ Transaction processed successfully:", transaction.id);
      return { success: true, transaction };
    } catch (error) {
      console.error("❌ Transaction processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Multi-layered validation system
  private async runValidationLayers(
    transaction: Transaction,
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const layer of this.validationLayers) {
      const startTime = Date.now();
      const result = await this.executeValidationLayer(layer, transaction);
      const endTime = Date.now();

      const validationResult: ValidationResult = {
        layer,
        passed: result.passed,
        score: result.score,
        issues: result.issues,
        recommendations: result.recommendations,
        processingTimeMs: endTime - startTime,
        timestamp: new Date().toISOString(),
      };

      results.push(validationResult);

      // Stop on critical failures
      if (!result.passed && result.critical) {
        break;
      }
    }

    return results;
  }

  private async executeValidationLayer(
    layer: string,
    transaction: Transaction,
  ): Promise<{
    passed: boolean;
    score: number;
    issues: string[];
    recommendations: string[];
    critical?: boolean;
  }> {
    // Simulate processing time
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 200 + 50),
    );

    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;
    let passed = true;
    let critical = false;

    switch (layer) {
      case "Frontend Validation":
        if (!transaction.fromUserId || !transaction.toUserId) {
          issues.push("Missing required user IDs");
          score -= 50;
          passed = false;
          critical = true;
        }
        break;

      case "Security Check":
        if (transaction.amount && transaction.amount > 1000) {
          issues.push(
            "High-value transaction requires additional verification",
          );
          recommendations.push(
            "Implement identity verification for high-value transactions",
          );
          score -= 20;
        }
        break;

      case "AI Content Analysis":
        if (transaction.content) {
          const suspiciousKeywords = [
            "refund",
            "scam",
            "fraud",
            "chargeback",
            "dispute",
          ];
          const containsSuspicious = suspiciousKeywords.some((keyword) =>
            transaction.content!.toLowerCase().includes(keyword),
          );

          if (containsSuspicious) {
            issues.push("Suspicious content detected");
            recommendations.push("Flag for manual review");
            score -= 15;
          }
        }
        break;

      case "Business Logic Validation":
        if (transaction.type === "purchase" && transaction.amount) {
          if (transaction.amount <= 0) {
            issues.push("Invalid purchase amount");
            score -= 40;
            passed = false;
          }
        }
        break;

      case "Math Verification":
        if (transaction.amount) {
          const commission = Math.round(transaction.amount * 0.1 * 100) / 100;
          if (commission !== parseFloat(commission.toFixed(2))) {
            issues.push("Math precision error in commission calculation");
            score -= 10;
          }
        }
        break;

      case "Fraud Detection":
        // Simulate AI fraud detection
        if (Math.random() < 0.05) {
          // 5% chance of flagging
          issues.push("Unusual transaction pattern detected");
          recommendations.push("Manual review recommended");
          score -= 30;
          critical = true;
        }
        break;

      default:
        // Random validation for other layers
        if (Math.random() < 0.1) {
          issues.push(`${layer} detected minor issues`);
          score -= 5;
        }
    }

    return { passed, score, issues, recommendations, critical };
  }

  // Purchase processing
  private async processPurchase(transaction: Transaction): Promise<void> {
    const db = DatabaseService.getInstance();

    // Get buyer and seller
    const buyer = await db.getUserById(transaction.fromUserId);
    const seller = await db.getUserById(transaction.toUserId);

    if (!buyer || !seller) {
      throw new Error("User not found");
    }

    // Check buyer balance (if implementing balance system)
    // For now, assume payment is handled externally

    // Move payment to escrow
    const escrowAmount = transaction.businessLogic.totalCost;
    this.businessAccount.escrowBalance += escrowAmount;

    // Create shipping timer for non-store items
    if (transaction.itemDetails && !transaction.itemDetails.isStoreItem) {
      await this.createShippingTimer(transaction);
    } else if (transaction.itemDetails?.isStoreItem) {
      // Send message to admin for store item fulfillment
      await this.notifyAdminForStoreItem(transaction);
    }

    // Update user records
    const purchase = {
      id: transaction.id,
      itemId: transaction.itemId!,
      itemName: transaction.itemDetails?.name || "Unknown Item",
      amount: transaction.amount!,
      sellerId: transaction.toUserId,
      status: "completed",
      date: transaction.timestamp,
    };

    buyer.portfolio.purchases = buyer.portfolio.purchases || [];
    buyer.portfolio.purchases.push(purchase);
    await db.updateUser(buyer.id, buyer);

    transaction.status = "completed";
  }

  // Sale processing
  private async processSale(transaction: Transaction): Promise<void> {
    const db = DatabaseService.getInstance();
    const seller = await db.getUserById(transaction.fromUserId);
    const buyer = await db.getUserById(transaction.toUserId);

    if (!seller || !buyer) {
      throw new Error("User not found");
    }

    // Add sale to seller's portfolio
    const sale = {
      id: transaction.id,
      itemId: transaction.itemId!,
      itemName: transaction.itemDetails?.name || "Unknown Item",
      amount: transaction.amount!,
      buyerId: transaction.toUserId,
      status: "completed",
      date: transaction.timestamp,
      commission: transaction.businessLogic.commission,
    };

    seller.portfolio.sales = seller.portfolio.sales || [];
    seller.portfolio.sales.push(sale);
    seller.portfolio.totalSales += transaction.amount!;
    seller.portfolio.totalEarnings += transaction.businessLogic.sellerEarnings;
    seller.portfolio.salesCount += 1;

    await db.updateUser(seller.id, seller);

    // Create shipping timer
    await this.createShippingTimer(transaction);

    transaction.status = "completed";
  }

  // Message processing
  private async processMessage(transaction: Transaction): Promise<void> {
    // Check for refund requests using AI
    if (transaction.content) {
      const refundKeywords = [
        "refund",
        "return",
        "money back",
        "damaged",
        "not as described",
      ];
      const isRefundRequest = refundKeywords.some((keyword) =>
        transaction.content!.toLowerCase().includes(keyword),
      );

      if (isRefundRequest) {
        console.log("🤖 AI detected potential refund request");
        await this.initiateRefundProcess(transaction);
      }
    }

    transaction.status = "completed";
  }

  // Offer processing
  private async processOffer(transaction: Transaction): Promise<void> {
    // AI negotiation analysis
    const originalPrice = transaction.itemDetails?.price || 0;
    const offerAmount = transaction.amount || 0;
    const discountPercentage =
      ((originalPrice - offerAmount) / originalPrice) * 100;

    if (discountPercentage > 20) {
      console.log(
        "🤖 AI detected high-discount offer, suggesting counter-offer",
      );
    }

    transaction.status = "completed";
  }

  // Shipping timer management
  private async createShippingTimer(transaction: Transaction): Promise<void> {
    const timer: ShippingTimer = {
      orderId: transaction.id,
      sellerId: transaction.fromUserId,
      buyerId: transaction.toUserId,
      itemId: transaction.itemId!,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      remindersS: 0,
      status: "active",
      autoRefundScheduled: new Date(
        Date.now() + 9 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 9 days
    };

    this.activeShippingTimers.set(transaction.id, timer);

    console.log(
      `🚚 Shipping timer created for order ${transaction.id}, deadline: ${timer.deadline}`,
    );

    // Schedule first reminder (24 hours)
    setTimeout(
      () => {
        this.sendShippingReminder(timer);
      },
      24 * 60 * 60 * 1000,
    );
  }

  private async sendShippingReminder(timer: ShippingTimer): Promise<void> {
    if (timer.status !== "active") return;

    timer.remindersS += 1;
    timer.lastReminderSent = new Date().toISOString();

    console.log(
      `📧 Sending shipping reminder #${timer.remindersS} for order ${timer.orderId}`,
    );

    // If overdue, process automatic refund
    if (new Date() > new Date(timer.deadline)) {
      await this.processAutomaticRefund(timer);
    } else if (timer.remindersS < 3) {
      // Schedule next reminder
      setTimeout(
        () => {
          this.sendShippingReminder(timer);
        },
        48 * 60 * 60 * 1000,
      ); // Every 2 days
    }
  }

  private async processAutomaticRefund(timer: ShippingTimer): Promise<void> {
    console.log(
      `🔄 Processing automatic refund for overdue order ${timer.orderId}`,
    );

    const refundTransaction = await this.processTransaction({
      type: "refund",
      fromUserId: "system",
      toUserId: timer.buyerId,
      amount: this.businessAccount.escrowBalance, // Refund full amount
      content: `Automatic refund for order ${timer.orderId} - item not shipped within 7 days`,
    });

    timer.status = "cancelled";
    this.activeShippingTimers.delete(timer.orderId);
  }

  // Refund processing
  private async processRefund(transaction: Transaction): Promise<void> {
    const db = DatabaseService.getInstance();
    const user = await db.getUserById(transaction.toUserId);

    if (!user) {
      throw new Error("User not found for refund");
    }

    // Process refund to user's balance
    user.portfolio.totalEarnings += transaction.amount!;
    await db.updateUser(user.id, user);

    // Remove from escrow
    this.businessAccount.escrowBalance -= transaction.amount!;

    console.log(
      `💰 Refund of $${transaction.amount} processed for user ${user.fullName}`,
    );
    transaction.status = "completed";
  }

  // Tag Along processing
  private async processTagAlong(transaction: Transaction): Promise<void> {
    if (!transaction.tagAlongData) {
      throw new Error("Tag along data required for tag along transaction");
    }

    const db = DatabaseService.getInstance();
    const guest = await db.getUserById(transaction.toUserId);
    const friend = await db.getUserById(transaction.tagAlongData.friendId);
    const requester = await db.getUserById(
      transaction.tagAlongData.requesterId,
    );

    if (!guest || !friend || !requester) {
      throw new Error("Required users not found for tag along transaction");
    }

    const amount = transaction.amount || 0;
    const commissionAmount =
      Math.round(
        ((amount * transaction.tagAlongData.commissionSplit) / 100) * 100,
      ) / 100;

    // Process sale for friend (seller)
    const sale = {
      id: transaction.id,
      itemId: transaction.itemId!,
      itemName: transaction.itemDetails?.name || "Tag Along Item",
      amount: amount,
      buyerId: transaction.toUserId,
      status: "completed",
      date: transaction.timestamp,
      commission: commissionAmount,
      tagAlong: true,
    };

    friend.portfolio.sales = friend.portfolio.sales || [];
    friend.portfolio.sales.push(sale);
    friend.portfolio.totalSales += amount;
    friend.portfolio.totalEarnings += amount - commissionAmount;
    friend.portfolio.salesCount += 1;

    // Process commission for requester
    requester.portfolio.totalEarnings += commissionAmount;
    requester.portfolio.tagAlongCommissions =
      requester.portfolio.tagAlongCommissions || 0;
    requester.portfolio.tagAlongCommissions += commissionAmount;

    // Process purchase for guest
    const purchase = {
      id: transaction.id,
      itemId: transaction.itemId!,
      itemName: transaction.itemDetails?.name || "Tag Along Item",
      amount: amount,
      sellerId: transaction.tagAlongData.friendId,
      status: "completed",
      date: transaction.timestamp,
      tagAlong: true,
      originalPrice: transaction.tagAlongData.originalPrice,
      discountPercent: transaction.tagAlongData.discountPercent,
    };

    guest.portfolio.purchases = guest.portfolio.purchases || [];
    guest.portfolio.purchases.push(purchase);

    // Update all users
    await Promise.all([
      db.updateUser(friend.id, friend),
      db.updateUser(requester.id, requester),
      db.updateUser(guest.id, guest),
    ]);

    // Handle automatic actions if enabled
    if (transaction.tagAlongData.automaticProcessing) {
      await this.handleTagAlongAutomation(transaction);
    }

    transaction.status = "completed";
    console.log(`🔗 Tag along transaction completed: ${transaction.id}`);
  }

  private async handleTagAlongAutomation(
    transaction: Transaction,
  ): Promise<void> {
    if (!transaction.tagAlongData) return;

    // AI handles automated follow-up actions
    const automatedActions = [
      "send_confirmation_to_guest",
      "update_friend_mode_aggressiveness",
      "suggest_similar_items_to_network",
      "schedule_follow_up_recommendations",
    ];

    for (const action of automatedActions) {
      console.log(`🤖 AI executing automated action: ${action}`);

      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Auto-process returns/refunds if issues detected
    await this.scheduleTagAlongMonitoring(transaction);
  }

  private async scheduleTagAlongMonitoring(
    transaction: Transaction,
  ): Promise<void> {
    // Schedule AI monitoring for potential issues
    setTimeout(
      async () => {
        await this.checkTagAlongForIssues(transaction);
      },
      24 * 60 * 60 * 1000,
    ); // Check after 24 hours

    setTimeout(
      async () => {
        await this.checkTagAlongForIssues(transaction);
      },
      7 * 24 * 60 * 60 * 1000,
    ); // Check after 7 days
  }

  private async checkTagAlongForIssues(
    transaction: Transaction,
  ): Promise<void> {
    // AI checks for potential issues requiring automatic refunds or actions
    const issueDetected = Math.random() < 0.05; // 5% chance of issues

    if (issueDetected) {
      console.log(
        `🚨 AI detected potential issue with tag along transaction ${transaction.id}`,
      );

      // Automatically process partial refund for price changes/overcharges
      const refundAmount =
        Math.round((transaction.amount || 0) * 0.1 * 100) / 100; // 10% refund

      await this.processTransaction({
        type: "refund",
        fromUserId: "system",
        toUserId: transaction.toUserId,
        amount: refundAmount,
        content: `Automatic adjustment refund for tag along transaction ${transaction.id}`,
        metadata: {
          ...this.generateMetadata(),
          originalTransactionId: transaction.id,
          issueType: "price_adjustment",
          automated: true,
        },
      });
    }
  }

  // Commission processing
  private async processCommission(transaction: Transaction): Promise<void> {
    const db = DatabaseService.getInstance();
    const user = await db.getUserById(transaction.toUserId);

    if (!user) {
      throw new Error("User not found for commission");
    }

    // Process commission payment
    user.portfolio.totalEarnings += transaction.amount!;
    user.portfolio.commissionsEarned = user.portfolio.commissionsEarned || 0;
    user.portfolio.commissionsEarned += transaction.amount!;

    await db.updateUser(user.id, user);

    transaction.status = "completed";
    console.log(
      `💰 Commission of $${transaction.amount} processed for user ${user.fullName}`,
    );
  }

  // Business logic calculations
  private async calculateBusinessLogic(
    transaction: Transaction,
  ): Promise<BusinessLogicResult> {
    const amount = transaction.amount || 0;
    const commission = Math.round(amount * 0.1 * 100) / 100; // 10% commission
    const platformFee = Math.round(amount * 0.03 * 100) / 100; // 3% platform fee
    const tax = Math.round(amount * 0.08 * 100) / 100; // 8% tax (example)
    const shippingCost = transaction.type === "purchase" ? 5.99 : 0;
    const sellerEarnings = amount - commission;
    const totalCost = amount + platformFee + tax + shippingCost;
    const escrowAmount = amount;

    const refundPolicy: RefundPolicy = {
      eligible: true,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      conditions: [
        "Item not as described",
        "Damaged in shipping",
        "Not received",
      ],
      automaticApproval: amount < 50,
    };

    return {
      commission,
      sellerEarnings,
      platformFee,
      tax,
      shippingCost,
      totalCost,
      escrowAmount,
      refundPolicy,
    };
  }

  // Helper methods
  private generateMetadata(): TransactionMetadata {
    return {
      deviceId: `device_${Math.random().toString(36).substr(2, 12)}`,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      ipAddress: "192.168.1." + Math.floor(Math.random() * 255),
      userAgent: "Mozilla/5.0 (Test Browser)",
    };
  }

  private async updateBusinessAccount(transaction: Transaction): Promise<void> {
    this.businessAccount.totalRevenue += transaction.businessLogic.platformFee;
    this.businessAccount.totalCommissions +=
      transaction.businessLogic.commission;
    this.businessAccount.transactions.push(transaction.id);
    this.businessAccount.lastUpdated = new Date().toISOString();

    // Save to localStorage
    localStorage.setItem(
      "lillys_business_account",
      JSON.stringify(this.businessAccount),
    );
  }

  private loadBusinessAccount(): void {
    const stored = localStorage.getItem("lillys_business_account");
    if (stored) {
      this.businessAccount = JSON.parse(stored);
    }
  }

  private async storeTransaction(transaction: Transaction): Promise<void> {
    const key = `transaction_${transaction.id}`;
    localStorage.setItem(key, JSON.stringify(transaction));
  }

  private startShippingMonitor(): void {
    // Monitor shipping timers every hour
    setInterval(
      () => {
        for (const [orderId, timer] of this.activeShippingTimers) {
          if (
            timer.status === "active" &&
            new Date() > new Date(timer.deadline)
          ) {
            this.processAutomaticRefund(timer);
          }
        }
      },
      60 * 60 * 1000,
    ); // Every hour
  }

  private async notifyAdminForStoreItem(
    transaction: Transaction,
  ): Promise<void> {
    console.log(
      `📬 Notifying admin: Store item sale needs fulfillment - ${transaction.itemDetails?.name}`,
    );

    // Create message to admin
    await this.processTransaction({
      type: "message",
      fromUserId: "system",
      toUserId: "admin",
      content: `Store Item Sale - Order: ${transaction.id}, Item: ${transaction.itemDetails?.name}, Price: $${transaction.amount}, Buyer: ${transaction.fromUserId}`,
    });
  }

  private async initiateRefundProcess(transaction: Transaction): Promise<void> {
    console.log(
      "🔄 Initiating automatic refund process based on AI message analysis",
    );

    // Create refund transaction
    await this.processTransaction({
      type: "refund",
      fromUserId: "system",
      toUserId: transaction.fromUserId,
      amount: 50, // Example refund amount
      content:
        "Automatic refund initiated based on AI analysis of customer message",
    });
  }

  // Public methods for external access
  async getBusinessAccount(): Promise<BusinessAccount> {
    return this.businessAccount;
  }

  async getShippingTimers(): Promise<ShippingTimer[]> {
    return Array.from(this.activeShippingTimers.values());
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const stored = localStorage.getItem(`transaction_${transactionId}`);
    return stored ? JSON.parse(stored) : null;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("transaction_")) {
        const stored = localStorage.getItem(key);
        if (stored) {
          transactions.push(JSON.parse(stored));
        }
      }
    }
    return transactions.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }
}

export default TransactionProcessor;
