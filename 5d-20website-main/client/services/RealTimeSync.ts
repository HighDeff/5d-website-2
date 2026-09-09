// Real-Time Account Synchronization Service
// Handles account activation, real-time updates, AI cross-validation, and message filtering

import DatabaseService, { UserAccount } from "./DatabaseService";
import ValidationService from "./ValidationService";
import MonitoringService from "./MonitoringService";

export interface AccountPulse {
  userId: string;
  timestamp: string;
  newData: Partial<UserAccount>;
  oldData: Partial<UserAccount>;
  requestType: "update" | "sync" | "validation" | "activation";
  deviceId: string;
  sessionId: string;
}

export interface CrossValidationResult {
  isValid: boolean;
  suspiciousActivity: string[];
  inconsistencies: string[];
  recommendations: string[];
  riskScore: number;
  blockedReasons?: string[];
}

export interface MessageFilter {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isBlocked: boolean;
  blockReason?: string;
  aiConfidence: number;
  timestamp: string;
}

export interface TransactionEvent {
  type: "sale" | "purchase" | "refund" | "cancellation";
  userId: string;
  targetUserId?: string;
  amount: number;
  itemId: string;
  timestamp: string;
  status: "pending" | "processing" | "completed" | "failed";
  autoProcessed: boolean;
}

export class RealTimeSyncService {
  private static instance: RealTimeSyncService;
  private syncInterval?: NodeJS.Timeout;
  private pulseInterval?: NodeJS.Timeout;
  private isActive = false;
  private pendingUpdates: Map<string, AccountPulse> = new Map();
  private messageFilters: MessageFilter[] = [];
  private readonly SYNC_INTERVAL = 1000; // 1 second
  private readonly PULSE_INTERVAL = 500; // 0.5 seconds for pulses

  static getInstance(): RealTimeSyncService {
    if (!RealTimeSyncService.instance) {
      RealTimeSyncService.instance = new RealTimeSyncService();
    }
    return RealTimeSyncService.instance;
  }

  // Start real-time synchronization
  startSync(): void {
    if (this.isActive) return;

    this.isActive = true;
    console.log("🔄 Starting real-time account synchronization...");

    // Main sync loop - every 1 second
    this.syncInterval = setInterval(async () => {
      await this.processSyncCycle();
    }, this.SYNC_INTERVAL);

    // Pulse loop - every 0.5 seconds
    this.pulseInterval = setInterval(async () => {
      await this.sendAccountPulses();
    }, this.PULSE_INTERVAL);

    console.log("✅ Real-time sync activated");
  }

  // Stop synchronization
  stopSync(): void {
    if (!this.isActive) return;

    this.isActive = false;

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }

    if (this.pulseInterval) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = undefined;
    }

    console.log("⏹️ Real-time sync stopped");
  }

  // Activate user account - clear all example data
  async activateAccount(userId: string): Promise<{
    success: boolean;
    message: string;
    activatedUser?: UserAccount;
  }> {
    try {
      console.log("🚀 Activating account:", userId);

      const db = DatabaseService; // DatabaseService is already an instance
      const user = await db.getUserById(userId);

      if (!user) {
        return { success: false, message: "User not found" };
      }

      // Clear all example/mock data and reset to clean state
      const activatedUser: UserAccount = {
        ...user,
        status: "active",
        verified: true,
        emailVerified: true,

        // Reset portfolio to clean state
        portfolio: {
          totalSales: 0,
          totalEarnings: 0,
          salesCount: 0,
          sales: [], // Clear all example sales
          purchases: [], // Clear all example purchases
          itemsSold: 0,
          itemsInProgress: [],
          itemsActive: [],
          itemsCompleted: [],
          itemsReturned: [],
          offersMade: [],
          offersReceived: [],
          rating: 5.0,
          reviews: [], // Clear example reviews
          commissionRate: user.portfolio.commissionRate,
          membershipLevel: user.portfolio.membershipLevel,
          payoutMethods: user.portfolio.payoutMethods, // Keep payment methods
        },

        // Clear example files but keep profile structure
        files: {
          profilePicture: undefined, // User will upload their own
          documents: [],
          productImages: [],
          uploads: [],
          folders: [],
        },

        // Reset settings to defaults
        settings: {
          ...user.settings,
          profileVisible: true,
          showEmail: false,
          showPhone: false,
          allowOffers: true,
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          marketingEmails: false,
        },

        // Update timestamps
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };

      // Save activated account
      await db.updateUser(userId, activatedUser);

      // Send activation pulse
      await this.sendPulse({
        userId,
        timestamp: new Date().toISOString(),
        newData: activatedUser,
        oldData: user,
        requestType: "activation",
        deviceId: this.generateDeviceId(),
        sessionId: this.generateSessionId(),
      });

      console.log("✅ Account activated successfully:", activatedUser.fullName);

      return {
        success: true,
        message:
          "Account activated! All example data cleared. You can now start selling.",
        activatedUser,
      };
    } catch (error) {
      console.error("❌ Account activation failed:", error);
      return {
        success: false,
        message: "Failed to activate account. Please try again.",
      };
    }
  }

  // Send account pulse with current data
  async sendPulse(pulse: AccountPulse): Promise<void> {
    // Store pulse for processing
    this.pendingUpdates.set(pulse.userId, pulse);

    // Log pulse activity
    console.log(`📡 Pulse sent for user ${pulse.userId}:`, {
      type: pulse.requestType,
      timestamp: pulse.timestamp,
    });
  }

  // Main synchronization cycle
  private async processSyncCycle(): Promise<void> {
    if (this.pendingUpdates.size === 0) return;

    console.log(`🔄 Processing ${this.pendingUpdates.size} pending updates...`);

    for (const [userId, pulse] of this.pendingUpdates) {
      try {
        await this.processUserPulse(pulse);

        // Remove processed pulse
        this.pendingUpdates.delete(userId);
      } catch (error) {
        console.error(`❌ Error processing pulse for user ${userId}:`, error);
      }
    }
  }

  // Process individual user pulse
  private async processUserPulse(pulse: AccountPulse): Promise<void> {
    const db = DatabaseService; // DatabaseService is already an instance
    const validationService = ValidationService.getInstance();

    // Get current user data
    const currentUser = await db.getUserById(pulse.userId);
    if (!currentUser) return;

    // Perform AI cross-validation
    const crossValidation = await this.performCrossValidation(
      pulse.userId,
      pulse.newData,
      currentUser,
    );

    // Check for suspicious activity
    if (crossValidation.riskScore > 75) {
      console.log(`⚠️ High risk activity detected for user ${pulse.userId}`);
      await this.handleSuspiciousActivity(pulse.userId, crossValidation);
      return;
    }

    // Validate data integrity
    const dataValidation = await validationService.restoreUserInfo(
      pulse.userId,
    );

    if (!dataValidation.isValid) {
      console.log(
        `🔧 Data integrity issues found for user ${pulse.userId}, auto-fixing...`,
      );
      await this.autoFixDataIssues(pulse.userId, dataValidation);
    }

    // Update user data if validation passes
    if (pulse.requestType === "update" && pulse.newData) {
      const updatedUser = { ...currentUser, ...pulse.newData };
      updatedUser.updatedAt = new Date().toISOString();
      updatedUser.lastActivityAt = new Date().toISOString();

      await db.updateUser(pulse.userId, updatedUser);
      console.log(`✅ User data updated: ${pulse.userId}`);
    }

    // Process any pending transactions
    await this.processTransactionEvents(pulse.userId);

    // Check for new messages and apply filters
    await this.processMessageFiltering(pulse.userId);
  }

  // Send periodic account pulses
  private async sendAccountPulses(): Promise<void> {
    const db = DatabaseService; // DatabaseService is already an instance
    const allUsers = await db.getAllUsers();

    for (const user of allUsers) {
      if (user.status === "active") {
        // Send pulse with current user state
        await this.sendPulse({
          userId: user.id,
          timestamp: new Date().toISOString(),
          newData: {},
          oldData: user,
          requestType: "sync",
          deviceId: this.generateDeviceId(),
          sessionId: this.generateSessionId(),
        });
      }
    }
  }

  // Cross-validate user data with other accounts and AI
  private async performCrossValidation(
    userId: string,
    newData: Partial<UserAccount>,
    currentUser: UserAccount,
  ): Promise<CrossValidationResult> {
    const db = DatabaseService; // DatabaseService is already an instance
    const allUsers = await db.getAllUsers();

    const suspiciousActivity: string[] = [];
    const inconsistencies: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // Check for duplicate email/phone across accounts
    if (newData.email) {
      const duplicateEmail = allUsers.find(
        (u) => u.id !== userId && u.email === newData.email,
      );
      if (duplicateEmail) {
        suspiciousActivity.push(
          "Email address already in use by another account",
        );
        riskScore += 30;
      }
    }

    // Check for unusual sales patterns
    if (newData.portfolio?.sales) {
      const salesCount = newData.portfolio.sales.length;
      const avgSalesPerUser =
        allUsers.reduce((sum, u) => sum + u.portfolio.salesCount, 0) /
        allUsers.length;

      if (salesCount > avgSalesPerUser * 3) {
        suspiciousActivity.push(
          "Unusually high sales volume compared to other users",
        );
        riskScore += 20;
      }
    }

    // Check for rapid account changes
    const timeSinceLastUpdate =
      new Date().getTime() - new Date(currentUser.updatedAt).getTime();
    if (timeSinceLastUpdate < 30000) {
      // Less than 30 seconds
      suspiciousActivity.push("Rapid account modifications detected");
      riskScore += 15;
    }

    // Validate financial consistency
    if (newData.portfolio?.totalEarnings) {
      const calculatedEarnings =
        (newData.portfolio.sales || currentUser.portfolio.sales).reduce(
          (sum, sale) => sum + sale.amount,
          0,
        ) * 0.9; // After 10% commission

      if (Math.abs(newData.portfolio.totalEarnings - calculatedEarnings) > 5) {
        inconsistencies.push("Total earnings don't match calculated sales");
        riskScore += 25;
      }
    }

    // Generate recommendations
    if (riskScore > 50) {
      recommendations.push("Manual review recommended");
    }
    if (suspiciousActivity.length > 0) {
      recommendations.push("Implement additional verification steps");
    }
    if (inconsistencies.length > 0) {
      recommendations.push("Auto-correct financial discrepancies");
    }

    return {
      isValid: riskScore < 50,
      suspiciousActivity,
      inconsistencies,
      recommendations,
      riskScore,
    };
  }

  // Handle suspicious activity detection
  private async handleSuspiciousActivity(
    userId: string,
    validation: CrossValidationResult,
  ): Promise<void> {
    const db = DatabaseService; // DatabaseService is already an instance
    const user = await db.getUserById(userId);

    if (!user) return;

    console.log(
      `🚨 Suspicious activity for user ${userId}:`,
      validation.suspiciousActivity,
    );

    // Temporarily suspend account for review
    if (validation.riskScore > 90) {
      await db.updateUser(userId, {
        ...user,
        status: "suspended",
        updatedAt: new Date().toISOString(),
      });

      console.log(`🔒 Account suspended for security review: ${userId}`);
    }

    // Log incident for admin review
    this.logSecurityIncident(userId, validation);
  }

  // Auto-fix data integrity issues
  private async autoFixDataIssues(
    userId: string,
    validation: any,
  ): Promise<void> {
    const db = DatabaseService; // DatabaseService is already an instance
    const user = await db.getUserById(userId);

    if (!user) return;

    let fixedUser = { ...user };
    let fixesApplied = 0;

    // Fix financial discrepancies
    const totalSales = user.portfolio.sales.reduce(
      (sum, sale) => sum + sale.amount,
      0,
    );
    const expectedEarnings =
      totalSales * (1 - user.portfolio.commissionRate / 100);

    if (Math.abs(user.portfolio.totalEarnings - expectedEarnings) > 0.01) {
      fixedUser.portfolio.totalEarnings = expectedEarnings;
      fixesApplied++;
      console.log(`💰 Fixed earnings calculation for user ${userId}`);
    }

    // Fix sales count
    if (user.portfolio.salesCount !== user.portfolio.sales.length) {
      fixedUser.portfolio.salesCount = user.portfolio.sales.length;
      fixesApplied++;
      console.log(`📊 Fixed sales count for user ${userId}`);
    }

    // Apply fixes if any were made
    if (fixesApplied > 0) {
      fixedUser.updatedAt = new Date().toISOString();
      await db.updateUser(userId, fixedUser);
      console.log(`🔧 Applied ${fixesApplied} auto-fixes for user ${userId}`);
    }
  }

  // Process transaction events (sales, purchases, refunds, cancellations)
  private async processTransactionEvents(userId: string): Promise<void> {
    const db = DatabaseService; // DatabaseService is already an instance
    const user = await db.getUserById(userId);

    if (!user) return;

    // Check for pending transactions that need processing
    const pendingTransactions = this.getPendingTransactions(userId);

    for (const transaction of pendingTransactions) {
      await this.processTransaction(transaction);
    }
  }

  // Process individual transaction
  private async processTransaction(
    transaction: TransactionEvent,
  ): Promise<void> {
    const db = DatabaseService; // DatabaseService is already an instance

    console.log(
      `💳 Processing ${transaction.type} for user ${transaction.userId}`,
    );

    switch (transaction.type) {
      case "sale":
        await this.processSale(transaction);
        break;
      case "purchase":
        await this.processPurchase(transaction);
        break;
      case "refund":
        await this.processRefund(transaction);
        break;
      case "cancellation":
        await this.processCancellation(transaction);
        break;
    }
  }

  // Process message filtering and blocking
  private async processMessageFiltering(userId: string): Promise<void> {
    // Get recent messages for this user
    const recentMessages = this.getRecentMessages(userId);

    for (const message of recentMessages) {
      const filterResult = await this.applyMessageFilter(message);

      if (filterResult.isBlocked) {
        console.log(`🚫 Message blocked: ${filterResult.blockReason}`);
        await this.blockMessage(message.id, filterResult.blockReason!);
      }
    }
  }

  // Apply AI-powered message filtering
  private async applyMessageFilter(message: any): Promise<MessageFilter> {
    const suspiciousKeywords = [
      "refund",
      "scam",
      "fake",
      "stolen",
      "illegal",
      "drugs",
      "weapons",
      "money laundering",
      "fraud",
      "chargeback",
      "dispute",
    ];

    const inappropriateContent = [
      "offensive language",
      "harassment",
      "spam",
      "solicitation",
    ];

    let isBlocked = false;
    let blockReason = "";
    let aiConfidence = 0;

    // Check for suspicious keywords
    const content = message.content.toLowerCase();
    for (const keyword of suspiciousKeywords) {
      if (content.includes(keyword)) {
        isBlocked = true;
        blockReason = `Suspicious keyword detected: ${keyword}`;
        aiConfidence = 85;
        break;
      }
    }

    // Check for inappropriate content
    if (!isBlocked) {
      for (const term of inappropriateContent) {
        if (content.includes(term.split(" ")[0])) {
          isBlocked = true;
          blockReason = `Inappropriate content detected`;
          aiConfidence = 75;
          break;
        }
      }
    }

    // Check message frequency (spam detection)
    const recentMessages = this.getRecentMessagesFromSender(message.senderId);
    if (recentMessages.length > 10) {
      isBlocked = true;
      blockReason = "Spam detected - too many messages";
      aiConfidence = 90;
    }

    return {
      messageId: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      isBlocked,
      blockReason,
      aiConfidence,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper methods
  private generateDeviceId(): string {
    return `device_${Math.random().toString(36).substr(2, 12)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private getPendingTransactions(userId: string): TransactionEvent[] {
    // Mock implementation - would fetch from database
    return [];
  }

  private getRecentMessages(userId: string): any[] {
    // Mock implementation - would fetch from database
    return [];
  }

  private getRecentMessagesFromSender(senderId: string): any[] {
    // Mock implementation - would fetch from database
    return [];
  }

  private async processSale(transaction: TransactionEvent): Promise<void> {
    console.log(`📦 Processing sale: ${transaction.itemId}`);
    // Implementation for sale processing
  }

  private async processPurchase(transaction: TransactionEvent): Promise<void> {
    console.log(`🛒 Processing purchase: ${transaction.itemId}`);
    // Implementation for purchase processing
  }

  private async processRefund(transaction: TransactionEvent): Promise<void> {
    console.log(`💸 Processing refund: ${transaction.amount}`);
    // Implementation for refund processing
  }

  private async processCancellation(
    transaction: TransactionEvent,
  ): Promise<void> {
    console.log(`❌ Processing cancellation: ${transaction.itemId}`);
    // Implementation for cancellation processing
  }

  private async blockMessage(messageId: string, reason: string): Promise<void> {
    console.log(`🚫 Blocking message ${messageId}: ${reason}`);
    // Implementation for message blocking
  }

  private logSecurityIncident(
    userId: string,
    validation: CrossValidationResult,
  ): void {
    const incident = {
      userId,
      timestamp: new Date().toISOString(),
      riskScore: validation.riskScore,
      issues: validation.suspiciousActivity,
      recommendations: validation.recommendations,
    };

    // Store in security log
    const key = `security_incident_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(incident));

    console.log("🚨 Security incident logged:", incident);
  }

  // Public methods for external access
  async getSystemStats(): Promise<{
    activePulses: number;
    pendingUpdates: number;
    messagesFiltered: number;
    securityIncidents: number;
    syncStatus: string;
  }> {
    const securityIncidents = Object.keys(localStorage).filter((key) =>
      key.startsWith("security_incident_"),
    ).length;

    return {
      activePulses: this.pendingUpdates.size,
      pendingUpdates: this.pendingUpdates.size,
      messagesFiltered: this.messageFilters.length,
      securityIncidents,
      syncStatus: this.isActive ? "active" : "inactive",
    };
  }
}

export default RealTimeSyncService;
