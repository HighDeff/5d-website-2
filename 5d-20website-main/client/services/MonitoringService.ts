// Comprehensive Monitoring Service for Shipments, Emails, and System Integrity
// Handles shipping reminders, email verification, balance checks, and purchase validation

import DatabaseService, {
  UserAccount,
  Sale,
  Purchase,
} from "./DatabaseService";

export interface ShippingReminder {
  saleId: string;
  sellerId: string;
  buyerId: string;
  itemName: string;
  daysSinceOrder: number;
  remindersSent: number;
  lastReminderSent?: string;
  status: "pending" | "shipped" | "delivered" | "cancelled" | "overdue";
  deadline: string;
}

export interface EmailVerification {
  userId: string;
  email: string;
  type: "welcome" | "verification" | "shipping" | "purchase_confirmation";
  sent: boolean;
  sentAt?: string;
  opened?: boolean;
  openedAt?: string;
  attempts: number;
  lastAttempt?: string;
}

export interface BalanceAudit {
  userId: string;
  expectedBalance: number;
  actualBalance: number;
  discrepancy: number;
  lastPurchaseId?: string;
  lastSaleId?: string;
  status:
    | "correct"
    | "minor_discrepancy"
    | "major_discrepancy"
    | "critical_error";
  auditDate: string;
}

export interface SystemMonitoringReport {
  timestamp: string;
  overdueShipments: ShippingReminder[];
  pendingEmails: EmailVerification[];
  balanceDiscrepancies: BalanceAudit[];
  systemHealth: "healthy" | "warning" | "critical";
  recommendations: string[];
}

export class MonitoringService {
  private static instance: MonitoringService;
  private readonly SHIPPING_DEADLINE_DAYS = 7;
  private readonly MAX_REMINDERS = 3;
  private readonly BALANCE_TOLERANCE = 0.01; // $0.01 tolerance
  private monitoringInterval?: NodeJS.Timeout;

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  constructor() {
    this.startMonitoring();
  }

  // Start continuous monitoring
  startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Run monitoring every hour
    this.monitoringInterval = setInterval(
      async () => {
        await this.runFullSystemCheck();
      },
      60 * 60 * 1000,
    );

    // Run initial check
    this.runFullSystemCheck();
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  // Run comprehensive system check
  async runFullSystemCheck(): Promise<SystemMonitoringReport> {
    const timestamp = new Date().toISOString();

    // Check for overdue shipments
    const overdueShipments = await this.checkOverdueShipments();

    // Verify pending emails
    const pendingEmails = await this.checkPendingEmails();

    // Audit balances
    const balanceDiscrepancies = await this.auditUserBalances();

    // Determine system health
    const systemHealth = this.assessSystemHealth(
      overdueShipments,
      pendingEmails,
      balanceDiscrepancies,
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      overdueShipments,
      pendingEmails,
      balanceDiscrepancies,
    );

    const report: SystemMonitoringReport = {
      timestamp,
      overdueShipments,
      pendingEmails,
      balanceDiscrepancies,
      systemHealth,
      recommendations,
    };

    // Store report for admin review
    await this.storeMonitoringReport(report);

    // Take automatic actions for critical issues
    await this.handleCriticalIssues(report);

    return report;
  }

  // Check for overdue shipments and send reminders
  async checkOverdueShipments(): Promise<ShippingReminder[]> {
    const db = DatabaseService.getInstance();
    const allUsers = await db.getAllUsers();
    const overdueShipments: ShippingReminder[] = [];
    const now = new Date();

    for (const user of allUsers) {
      for (const sale of user.portfolio.sales) {
        if (sale.status === "completed" && !sale.shippedAt) {
          const orderDate = new Date(sale.date);
          const daysSinceOrder = Math.floor(
            (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          const deadline = new Date(
            orderDate.getTime() +
              this.SHIPPING_DEADLINE_DAYS * 24 * 60 * 60 * 1000,
          );

          if (daysSinceOrder >= 1) {
            // Start reminders after 1 day
            const reminderData = await this.getShippingReminderData(sale.id);

            const reminder: ShippingReminder = {
              saleId: sale.id,
              sellerId: user.id,
              buyerId: sale.buyerId,
              itemName: sale.itemName,
              daysSinceOrder,
              remindersSent: reminderData.remindersSent,
              lastReminderSent: reminderData.lastReminderSent,
              status:
                daysSinceOrder >= this.SHIPPING_DEADLINE_DAYS
                  ? "overdue"
                  : "pending",
              deadline: deadline.toISOString(),
            };

            // Send reminder if needed
            if (this.shouldSendReminder(reminder)) {
              await this.sendShippingReminder(reminder);
            }

            // Cancel order if severely overdue
            if (daysSinceOrder > this.SHIPPING_DEADLINE_DAYS + 2) {
              await this.handleOverdueOrder(reminder);
            }

            overdueShipments.push(reminder);
          }
        }
      }
    }

    return overdueShipments;
  }

  // Check for pending email verifications
  async checkPendingEmails(): Promise<EmailVerification[]> {
    const db = DatabaseService.getInstance();
    const allUsers = await db.getAllUsers();
    const pendingEmails: EmailVerification[] = [];

    for (const user of allUsers) {
      // Check welcome email
      const welcomeEmail = await this.getEmailVerification(user.id, "welcome");
      if (!welcomeEmail.sent && user.status === "active") {
        await this.sendWelcomeEmail(user);
        pendingEmails.push(welcomeEmail);
      }

      // Check email verification
      if (!user.emailVerified) {
        const verificationEmail = await this.getEmailVerification(
          user.id,
          "verification",
        );
        if (!verificationEmail.sent || verificationEmail.attempts < 3) {
          await this.sendVerificationEmail(user);
          pendingEmails.push(verificationEmail);
        }
      }

      // Check for recent purchases that need confirmation emails
      for (const purchase of user.portfolio.purchases) {
        const purchaseDate = new Date(purchase.date);
        const hoursSincePurchase =
          (Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60);

        if (hoursSincePurchase < 1) {
          // Check purchases within last hour
          const confirmationEmail = await this.getEmailVerification(
            user.id,
            "purchase_confirmation",
          );
          if (!confirmationEmail.sent) {
            await this.sendPurchaseConfirmationEmail(user, purchase);
            pendingEmails.push(confirmationEmail);
          }
        }
      }
    }

    return pendingEmails;
  }

  // Audit user balances and detect discrepancies
  async auditUserBalances(): Promise<BalanceAudit[]> {
    const db = DatabaseService.getInstance();
    const allUsers = await db.getAllUsers();
    const balanceDiscrepancies: BalanceAudit[] = [];

    for (const user of allUsers) {
      const audit = await this.auditUserBalance(user);
      if (audit.status !== "correct") {
        balanceDiscrepancies.push(audit);

        // Auto-fix minor discrepancies
        if (audit.status === "minor_discrepancy") {
          await this.fixBalanceDiscrepancy(audit);
        }
      }
    }

    return balanceDiscrepancies;
  }

  // Audit individual user balance
  private async auditUserBalance(user: UserAccount): Promise<BalanceAudit> {
    // Calculate expected balance from transactions
    const totalSales = user.portfolio.sales
      .filter((sale) => sale.status === "completed")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const totalPurchases = user.portfolio.purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0,
    );

    const commission = totalSales * 0.1; // 10% commission
    const expectedBalance = totalSales - commission - totalPurchases;
    const actualBalance = user.portfolio.totalEarnings;
    const discrepancy = Math.abs(expectedBalance - actualBalance);

    let status: BalanceAudit["status"] = "correct";
    if (discrepancy > this.BALANCE_TOLERANCE) {
      if (discrepancy < 1.0) {
        status = "minor_discrepancy";
      } else if (discrepancy < 10.0) {
        status = "major_discrepancy";
      } else {
        status = "critical_error";
      }
    }

    return {
      userId: user.id,
      expectedBalance,
      actualBalance,
      discrepancy,
      lastPurchaseId:
        user.portfolio.purchases[user.portfolio.purchases.length - 1]?.id,
      lastSaleId: user.portfolio.sales[user.portfolio.sales.length - 1]?.id,
      status,
      auditDate: new Date().toISOString(),
    };
  }

  // Send shipping reminder to seller
  private async sendShippingReminder(
    reminder: ShippingReminder,
  ): Promise<void> {
    const db = DatabaseService.getInstance();
    const seller = await db.getUserById(reminder.sellerId);
    const buyer = await db.getUserById(reminder.buyerId);

    if (!seller || !buyer) return;

    console.log(
      `📦 Sending shipping reminder to ${seller.email} for order ${reminder.saleId}`,
    );
    console.log(
      `📅 Order placed ${reminder.daysSinceOrder} days ago, deadline: ${reminder.deadline}`,
    );

    // In a real implementation, this would send an actual email
    const emailContent = this.generateShippingReminderEmail(
      reminder,
      seller,
      buyer,
    );

    // Update reminder data
    await this.updateShippingReminderData(reminder.saleId, {
      remindersSent: reminder.remindersSent + 1,
      lastReminderSent: new Date().toISOString(),
    });

    // Send notification to buyer about reminder
    if (reminder.daysSinceOrder >= 3) {
      console.log(`📧 Notifying buyer ${buyer.email} about shipping delay`);
    }
  }

  // Handle severely overdue orders
  private async handleOverdueOrder(reminder: ShippingReminder): Promise<void> {
    const db = DatabaseService.getInstance();

    console.log(
      `🚨 Handling overdue order ${reminder.saleId} - ${reminder.daysSinceOrder} days overdue`,
    );

    // Cancel the order and refund buyer
    await this.cancelOrderAndRefund(reminder);

    // Notify both parties
    await this.notifyOrderCancellation(reminder);

    // Update seller's reputation
    await this.updateSellerReputation(reminder.sellerId, "shipping_violation");
  }

  // Send welcome email to new user
  private async sendWelcomeEmail(user: UserAccount): Promise<void> {
    console.log(`👋 Sending welcome email to ${user.email}`);

    const emailContent = `
      Welcome to Lilly's Thrift, ${user.firstName}!
      
      Your account has been successfully created. Here's what you can do:
      - Start browsing items for sale
      - Upload your own items to sell
      - Manage your profile and settings
      
      If you haven't verified your email yet, please check your inbox for a verification link.
      
      Happy thrifting!
      The Lilly's Thrift Team
    `;

    // Update email verification record
    await this.updateEmailVerification(user.id, "welcome", {
      sent: true,
      sentAt: new Date().toISOString(),
      attempts: 1,
    });
  }

  // Send email verification
  private async sendVerificationEmail(user: UserAccount): Promise<void> {
    console.log(`✉️ Sending verification email to ${user.email}`);

    const verificationCode = Math.random()
      .toString(36)
      .substr(2, 8)
      .toUpperCase();

    // Store verification code in database
    const db = DatabaseService.getInstance();
    await db.updateUser(user.id, {
      securityToken: verificationCode,
      lastSecurityTokenGenerated: new Date().toISOString(),
    });

    // Update email verification record
    const currentRecord = await this.getEmailVerification(
      user.id,
      "verification",
    );
    await this.updateEmailVerification(user.id, "verification", {
      sent: true,
      sentAt: new Date().toISOString(),
      attempts: currentRecord.attempts + 1,
    });
  }

  // Send purchase confirmation email
  private async sendPurchaseConfirmationEmail(
    user: UserAccount,
    purchase: Purchase,
  ): Promise<void> {
    console.log(
      `🛒 Sending purchase confirmation to ${user.email} for ${purchase.itemName}`,
    );

    const emailContent = `
      Purchase Confirmation - Order #${purchase.id}
      
      Dear ${user.firstName},
      
      Thank you for your purchase! Here are the details:
      
      Item: ${purchase.itemName}
      Amount: $${purchase.amount.toFixed(2)}
      Date: ${new Date(purchase.date).toLocaleDateString()}
      
      Your item will be shipped within 7 days.
      
      Track your order in your dashboard.
      
      Thanks for shopping with Lilly's Thrift!
    `;

    await this.updateEmailVerification(user.id, "purchase_confirmation", {
      sent: true,
      sentAt: new Date().toISOString(),
      attempts: 1,
    });
  }

  // Helper methods for email verification tracking
  private async getEmailVerification(
    userId: string,
    type: EmailVerification["type"],
  ): Promise<EmailVerification> {
    const key = `email_verification_${userId}_${type}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      return JSON.parse(stored);
    }

    const db = DatabaseService.getInstance();
    const user = await db.getUserById(userId);

    return {
      userId,
      email: user?.email || "",
      type,
      sent: false,
      attempts: 0,
    };
  }

  private async updateEmailVerification(
    userId: string,
    type: EmailVerification["type"],
    updates: Partial<EmailVerification>,
  ): Promise<void> {
    const key = `email_verification_${userId}_${type}`;
    const current = await this.getEmailVerification(userId, type);
    const updated = { ...current, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
  }

  // Helper methods for shipping reminder tracking
  private async getShippingReminderData(
    saleId: string,
  ): Promise<{ remindersSent: number; lastReminderSent?: string }> {
    const key = `shipping_reminder_${saleId}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      return JSON.parse(stored);
    }

    return { remindersSent: 0 };
  }

  private async updateShippingReminderData(
    saleId: string,
    data: { remindersSent: number; lastReminderSent: string },
  ): Promise<void> {
    const key = `shipping_reminder_${saleId}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Determine if a shipping reminder should be sent
  private shouldSendReminder(reminder: ShippingReminder): boolean {
    if (reminder.remindersSent >= this.MAX_REMINDERS) {
      return false;
    }

    // Send first reminder after 1 day
    if (reminder.remindersSent === 0 && reminder.daysSinceOrder >= 1) {
      return true;
    }

    // Send subsequent reminders every 2 days
    if (reminder.lastReminderSent) {
      const lastReminder = new Date(reminder.lastReminderSent);
      const daysSinceLastReminder =
        (Date.now() - lastReminder.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLastReminder >= 2;
    }

    return false;
  }

  // Generate shipping reminder email content
  private generateShippingReminderEmail(
    reminder: ShippingReminder,
    seller: UserAccount,
    buyer: UserAccount,
  ): string {
    return `
      🚨 Shipping Reminder - Order #${reminder.saleId}
      
      Dear ${seller.firstName},
      
      This is reminder #${reminder.remindersSent + 1} that you have an order that needs to be shipped:
      
      Item: ${reminder.itemName}
      Buyer: ${buyer.firstName} ${buyer.lastName}
      Order Date: ${reminder.daysSinceOrder} days ago
      Deadline: ${new Date(reminder.deadline).toLocaleDateString()}
      
      Please ship this item as soon as possible to maintain your seller rating.
      If you cannot fulfill this order, please contact the buyer immediately.
      
      Orders not shipped within 7 days will be automatically cancelled and refunded.
      
      Thank you,
      Lilly's Thrift Team
    `;
  }

  // Fix minor balance discrepancies
  private async fixBalanceDiscrepancy(audit: BalanceAudit): Promise<void> {
    const db = DatabaseService.getInstance();
    const user = await db.getUserById(audit.userId);

    if (!user) return;

    console.log(
      `💰 Auto-fixing balance discrepancy for user ${audit.userId}: $${audit.discrepancy.toFixed(2)}`,
    );

    // Update user's balance to the expected amount
    await db.updateUser(audit.userId, {
      portfolio: {
        ...user.portfolio,
        totalEarnings: audit.expectedBalance,
      },
    });
  }

  // Cancel order and process refund
  private async cancelOrderAndRefund(
    reminder: ShippingReminder,
  ): Promise<void> {
    const db = DatabaseService.getInstance();

    // Update sale status to cancelled
    const seller = await db.getUserById(reminder.sellerId);
    if (seller) {
      const updatedSales = seller.portfolio.sales.map((sale) =>
        sale.id === reminder.saleId
          ? {
              ...sale,
              status: "cancelled" as const,
              cancelledAt: new Date().toISOString(),
            }
          : sale,
      );

      await db.updateUser(reminder.sellerId, {
        portfolio: {
          ...seller.portfolio,
          sales: updatedSales,
          totalSales:
            seller.portfolio.totalSales -
            seller.portfolio.sales.find((s) => s.id === reminder.saleId)!
              .amount,
          salesCount: seller.portfolio.salesCount - 1,
        },
      });
    }

    // Process refund for buyer
    const buyer = await db.getUserById(reminder.buyerId);
    if (buyer) {
      const refundAmount =
        buyer.portfolio.purchases.find((p) => p.id === reminder.saleId)
          ?.amount || 0;

      await db.updateUser(reminder.buyerId, {
        portfolio: {
          ...buyer.portfolio,
          totalEarnings: buyer.portfolio.totalEarnings + refundAmount,
        },
      });
    }
  }

  // Notify parties about order cancellation
  private async notifyOrderCancellation(
    reminder: ShippingReminder,
  ): Promise<void> {
    console.log(
      `📧 Notifying seller and buyer about order cancellation: ${reminder.saleId}`,
    );
  }

  // Update seller reputation for violations
  private async updateSellerReputation(
    sellerId: string,
    violation: string,
  ): Promise<void> {
    console.log(`⚠️ Recording violation for seller ${sellerId}: ${violation}`);
    // Implementation would update seller's reputation/rating
  }

  // Store monitoring report for admin review
  private async storeMonitoringReport(
    report: SystemMonitoringReport,
  ): Promise<void> {
    const key = `monitoring_report_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(report));

    // Keep only last 30 reports
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("monitoring_report_"),
    );
    if (allKeys.length > 30) {
      allKeys
        .sort()
        .slice(0, -30)
        .forEach((key) => localStorage.removeItem(key));
    }
  }

  // Handle critical issues automatically
  private async handleCriticalIssues(
    report: SystemMonitoringReport,
  ): Promise<void> {
    if (report.systemHealth === "critical") {
      console.log(
        "🚨 CRITICAL SYSTEM ISSUES DETECTED - Taking automatic actions",
      );

      // Send alert to admins
      await this.sendAdminAlert(report);

      // Disable new orders temporarily if too many balance discrepancies
      const criticalBalanceIssues = report.balanceDiscrepancies.filter(
        (b) => b.status === "critical_error",
      );
      if (criticalBalanceIssues.length > 5) {
        console.log(
          "🛑 Temporarily disabling new orders due to balance issues",
        );
      }
    }
  }

  // Send alert to administrators
  private async sendAdminAlert(report: SystemMonitoringReport): Promise<void> {
    console.log("📧 Sending critical alert to administrators");
    console.log("Issues:", {
      overdueShipments: report.overdueShipments.length,
      pendingEmails: report.pendingEmails.length,
      balanceDiscrepancies: report.balanceDiscrepancies.length,
    });
  }

  // Assess overall system health
  private assessSystemHealth(
    overdueShipments: ShippingReminder[],
    pendingEmails: EmailVerification[],
    balanceDiscrepancies: BalanceAudit[],
  ): SystemMonitoringReport["systemHealth"] {
    const severelyOverdue = overdueShipments.filter(
      (s) => s.daysSinceOrder > this.SHIPPING_DEADLINE_DAYS,
    ).length;
    const criticalBalanceIssues = balanceDiscrepancies.filter(
      (b) => b.status === "critical_error",
    ).length;
    const majorBalanceIssues = balanceDiscrepancies.filter(
      (b) => b.status === "major_discrepancy",
    ).length;

    if (severelyOverdue > 10 || criticalBalanceIssues > 0) {
      return "critical";
    }

    if (
      severelyOverdue > 5 ||
      majorBalanceIssues > 5 ||
      pendingEmails.length > 20
    ) {
      return "warning";
    }

    return "healthy";
  }

  // Generate actionable recommendations
  private generateRecommendations(
    overdueShipments: ShippingReminder[],
    pendingEmails: EmailVerification[],
    balanceDiscrepancies: BalanceAudit[],
  ): string[] {
    const recommendations: string[] = [];

    if (overdueShipments.length > 0) {
      recommendations.push(
        `Contact ${overdueShipments.length} sellers about overdue shipments`,
      );
    }

    if (pendingEmails.length > 10) {
      recommendations.push(
        "Review email delivery system - high number of pending emails",
      );
    }

    if (balanceDiscrepancies.length > 0) {
      recommendations.push(
        `Investigate ${balanceDiscrepancies.length} balance discrepancies`,
      );
    }

    const criticalIssues = balanceDiscrepancies.filter(
      (b) => b.status === "critical_error",
    );
    if (criticalIssues.length > 0) {
      recommendations.push(
        "URGENT: Critical balance errors detected - immediate review required",
      );
    }

    return recommendations;
  }

  // Get latest monitoring report
  async getLatestReport(): Promise<SystemMonitoringReport | null> {
    const allKeys = Object.keys(localStorage)
      .filter((k) => k.startsWith("monitoring_report_"))
      .sort()
      .reverse();

    if (allKeys.length === 0) return null;

    const latestKey = allKeys[0];
    const stored = localStorage.getItem(latestKey);

    return stored ? JSON.parse(stored) : null;
  }

  // Get monitoring history
  async getMonitoringHistory(
    limit: number = 10,
  ): Promise<SystemMonitoringReport[]> {
    const allKeys = Object.keys(localStorage)
      .filter((k) => k.startsWith("monitoring_report_"))
      .sort()
      .reverse()
      .slice(0, limit);

    const reports: SystemMonitoringReport[] = [];

    for (const key of allKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        reports.push(JSON.parse(stored));
      }
    }

    return reports;
  }
}

export default MonitoringService;
