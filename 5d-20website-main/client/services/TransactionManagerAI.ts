interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "purchase" | "refund" | "store_credit" | "adjustment";
  status: "pending" | "approved" | "rejected" | "completed";
  productId?: string;
  reason?: string;
  timestamp: Date;
  adminApproval?: {
    adminId: string;
    timestamp: Date;
    decision: "approved" | "rejected";
    notes?: string;
  };
}

interface RefundRequest {
  id: string;
  userId: string;
  transactionId: string;
  amount: number;
  reason: string;
  evidence?: string[];
  autoApproved: boolean;
  adminRequired: boolean;
  timestamp: Date;
  resolution?: {
    type: "refund" | "store_credit" | "replacement";
    amount: number;
    approved: boolean;
    processedAt: Date;
  };
}

interface StoreCredit {
  id: string;
  userId: string;
  amount: number;
  source: "refund" | "promotion" | "compensation" | "temporary";
  expirationDate?: Date;
  used: number;
  isTemporary: boolean;
  linkedToRefund?: string;
}

interface AdminNotification {
  id: string;
  type: "refund_request" | "suspicious_activity" | "high_value_transaction";
  priority: "low" | "medium" | "high" | "urgent";
  message: string;
  userId: string;
  transactionId?: string;
  requiresAction: boolean;
  timestamp: Date;
}

class TransactionManagerAI {
  private transactions: Map<string, Transaction> = new Map();
  private refundRequests: Map<string, RefundRequest> = new Map();
  private storeCredits: Map<string, StoreCredit[]> = new Map();
  private adminNotifications: AdminNotification[] = [];
  private autoApprovalThreshold: number = 50; // Auto-approve refunds under $50

  async processRefundRequest(
    userId: string,
    transactionId: string,
    amount: number,
    reason: string,
    evidence?: string[],
  ): Promise<RefundRequest> {
    const requestId = `refund-${Date.now()}`;

    // Analyze if auto-approval is possible
    const autoApproved = this.shouldAutoApprove(amount, reason, userId);
    const adminRequired = !autoApproved;

    const refundRequest: RefundRequest = {
      id: requestId,
      userId,
      transactionId,
      amount,
      reason,
      evidence,
      autoApproved,
      adminRequired,
      timestamp: new Date(),
    };

    this.refundRequests.set(requestId, refundRequest);

    if (autoApproved) {
      await this.processAutoApproval(refundRequest);
    } else {
      await this.notifyAdminForApproval(refundRequest);
    }

    return refundRequest;
  }

  private shouldAutoApprove(
    amount: number,
    reason: string,
    userId: string,
  ): boolean {
    // Auto-approve conditions
    if (amount <= this.autoApprovalThreshold) {
      const validReasons = ["defective", "wrong_item", "not_as_described"];
      if (
        validReasons.some((validReason) =>
          reason.toLowerCase().includes(validReason),
        )
      ) {
        // Check user history for abuse patterns
        const userRefunds = this.getUserRefundHistory(userId);
        const recentRefunds = userRefunds.filter(
          (refund) =>
            Date.now() - refund.timestamp.getTime() < 30 * 24 * 60 * 60 * 1000,
        );

        return recentRefunds.length < 3; // Less than 3 refunds in 30 days
      }
    }

    return false;
  }

  private async processAutoApproval(
    refundRequest: RefundRequest,
  ): Promise<void> {
    // Issue temporary store credit immediately
    await this.issueTemporaryStoreCredit(
      refundRequest.userId,
      refundRequest.amount,
      refundRequest.id,
    );

    refundRequest.resolution = {
      type: "store_credit",
      amount: refundRequest.amount,
      approved: true,
      processedAt: new Date(),
    };

    // Create notification for user
    await this.createUserNotification(
      refundRequest.userId,
      `Your refund of $${refundRequest.amount} has been processed as store credit.`,
      "success",
    );
  }

  private async notifyAdminForApproval(
    refundRequest: RefundRequest,
  ): Promise<void> {
    const notification: AdminNotification = {
      id: `admin-${Date.now()}`,
      type: "refund_request",
      priority: refundRequest.amount > 200 ? "high" : "medium",
      message: `Refund request for $${refundRequest.amount} requires approval. Reason: ${refundRequest.reason}`,
      userId: refundRequest.userId,
      transactionId: refundRequest.transactionId,
      requiresAction: true,
      timestamp: new Date(),
    };

    this.adminNotifications.push(notification);

    // Issue temporary store credit while waiting for approval
    await this.issueTemporaryStoreCredit(
      refundRequest.userId,
      refundRequest.amount,
      refundRequest.id,
    );
  }

  async issueTemporaryStoreCredit(
    userId: string,
    amount: number,
    linkedRefundId: string,
  ): Promise<StoreCredit> {
    const creditId = `temp-credit-${Date.now()}`;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 days to resolve

    const storeCredit: StoreCredit = {
      id: creditId,
      userId,
      amount,
      source: "refund",
      expirationDate,
      used: 0,
      isTemporary: true,
      linkedToRefund: linkedRefundId,
    };

    const userCredits = this.storeCredits.get(userId) || [];
    userCredits.push(storeCredit);
    this.storeCredits.set(userId, userCredits);

    return storeCredit;
  }

  async processAdminDecision(
    requestId: string,
    adminId: string,
    decision: "approved" | "rejected",
    notes?: string,
  ): Promise<void> {
    const refundRequest = this.refundRequests.get(requestId);
    if (!refundRequest) {
      throw new Error("Refund request not found");
    }

    refundRequest.adminApproval = {
      adminId,
      timestamp: new Date(),
      decision,
      notes,
    };

    const temporaryCredit = this.getTemporaryCredit(
      refundRequest.userId,
      requestId,
    );

    if (decision === "approved") {
      // Convert temporary credit to permanent
      if (temporaryCredit) {
        temporaryCredit.isTemporary = false;
        temporaryCredit.expirationDate = undefined;
      }

      refundRequest.resolution = {
        type: "store_credit",
        amount: refundRequest.amount,
        approved: true,
        processedAt: new Date(),
      };

      await this.createUserNotification(
        refundRequest.userId,
        `Your refund request has been approved. Store credit of $${refundRequest.amount} is now available.`,
        "success",
      );
    } else {
      // Remove temporary credit
      if (temporaryCredit) {
        await this.removeStoreCredit(refundRequest.userId, temporaryCredit.id);
      }

      refundRequest.resolution = {
        type: "refund",
        amount: 0,
        approved: false,
        processedAt: new Date(),
      };

      await this.createUserNotification(
        refundRequest.userId,
        `Your refund request has been rejected. ${notes || "Please contact customer service for more information."}`,
        "error",
      );
    }
  }

  private getTemporaryCredit(
    userId: string,
    linkedRefundId: string,
  ): StoreCredit | undefined {
    const userCredits = this.storeCredits.get(userId) || [];
    return userCredits.find(
      (credit) =>
        credit.isTemporary && credit.linkedToRefund === linkedRefundId,
    );
  }

  async applyStoreCredit(userId: string, amount: number): Promise<boolean> {
    const userCredits = this.storeCredits.get(userId) || [];
    const availableCredits = userCredits.filter(
      (credit) =>
        !credit.isTemporary &&
        credit.amount > credit.used &&
        (!credit.expirationDate || credit.expirationDate > new Date()),
    );

    let remainingAmount = amount;
    const appliedCredits: { creditId: string; amountUsed: number }[] = [];

    for (const credit of availableCredits) {
      if (remainingAmount <= 0) break;

      const availableAmount = credit.amount - credit.used;
      const useAmount = Math.min(remainingAmount, availableAmount);

      credit.used += useAmount;
      remainingAmount -= useAmount;

      appliedCredits.push({
        creditId: credit.id,
        amountUsed: useAmount,
      });
    }

    if (remainingAmount > 0) {
      // Rollback changes if insufficient credit
      appliedCredits.forEach(({ creditId, amountUsed }) => {
        const credit = userCredits.find((c) => c.id === creditId);
        if (credit) {
          credit.used -= amountUsed;
        }
      });
      return false;
    }

    return true;
  }

  async getUserStoreCredits(userId: string): Promise<StoreCredit[]> {
    return this.storeCredits.get(userId) || [];
  }

  async getAvailableStoreCredit(userId: string): Promise<number> {
    const userCredits = this.storeCredits.get(userId) || [];
    return userCredits
      .filter(
        (credit) =>
          !credit.isTemporary &&
          (!credit.expirationDate || credit.expirationDate > new Date()),
      )
      .reduce((total, credit) => total + (credit.amount - credit.used), 0);
  }

  private async removeStoreCredit(
    userId: string,
    creditId: string,
  ): Promise<void> {
    const userCredits = this.storeCredits.get(userId) || [];
    const filteredCredits = userCredits.filter(
      (credit) => credit.id !== creditId,
    );
    this.storeCredits.set(userId, filteredCredits);
  }

  private getUserRefundHistory(userId: string): RefundRequest[] {
    return Array.from(this.refundRequests.values()).filter(
      (request) => request.userId === userId,
    );
  }

  private async createUserNotification(
    userId: string,
    message: string,
    type: "success" | "error" | "info",
  ): Promise<void> {
    // In a real application, this would send notifications to the user
    console.log(`Notification for ${userId}: ${message} (${type})`);
  }

  async getAdminNotifications(adminId: string): Promise<AdminNotification[]> {
    return this.adminNotifications.filter(
      (notification) => notification.requiresAction,
    );
  }

  async markNotificationHandled(notificationId: string): Promise<void> {
    const notification = this.adminNotifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.requiresAction = false;
    }
  }

  async generateFinancialReport(): Promise<{
    totalRefunds: number;
    totalStoreCredits: number;
    pendingRequests: number;
    autoApprovalRate: number;
  }> {
    const allRefunds = Array.from(this.refundRequests.values());
    const allCredits = Array.from(this.storeCredits.values()).flat();

    const totalRefunds = allRefunds
      .filter((r) => r.resolution?.approved)
      .reduce((sum, r) => sum + r.amount, 0);

    const totalStoreCredits = allCredits.reduce((sum, c) => sum + c.amount, 0);

    const pendingRequests = allRefunds.filter((r) => !r.resolution).length;

    const autoApprovedCount = allRefunds.filter((r) => r.autoApproved).length;

    const autoApprovalRate =
      allRefunds.length > 0 ? (autoApprovedCount / allRefunds.length) * 100 : 0;

    return {
      totalRefunds,
      totalStoreCredits,
      pendingRequests,
      autoApprovalRate,
    };
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    const userRefunds = this.getUserRefundHistory(userId);
    const recentRefunds = userRefunds.filter(
      (refund) =>
        Date.now() - refund.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000,
    );

    // Flag if more than 5 refunds in a week
    if (recentRefunds.length > 5) {
      const notification: AdminNotification = {
        id: `suspicious-${Date.now()}`,
        type: "suspicious_activity",
        priority: "urgent",
        message: `User ${userId} has requested ${recentRefunds.length} refunds in the past week`,
        userId,
        requiresAction: true,
        timestamp: new Date(),
      };

      this.adminNotifications.push(notification);
      return true;
    }

    return false;
  }
}

export const transactionManagerAI = new TransactionManagerAI();
export type { Transaction, RefundRequest, StoreCredit, AdminNotification };
