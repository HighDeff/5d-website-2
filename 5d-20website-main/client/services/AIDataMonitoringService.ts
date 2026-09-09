// AI Data Monitoring Service - Watches all user accounts, sales, price changes, etc.
import { User, Sale, Product } from "@/hooks/useUserAuth";

export interface DataChangeEvent {
  id: string;
  type:
    | "user_update"
    | "sale_created"
    | "price_change"
    | "item_removal"
    | "product_upload"
    | "account_creation";
  timestamp: string;
  userId?: string;
  entityId: string;
  oldData?: any;
  newData?: any;
  changes: string[];
  severity: "low" | "medium" | "high" | "critical";
  aiAnalysis: {
    anomalyDetected: boolean;
    riskLevel: number; // 0-100
    recommendations: string[];
    requiredActions: string[];
  };
}

export interface AIAnalysisResult {
  accountConsistency: boolean;
  dataIntegrity: boolean;
  suspiciousActivity: boolean;
  recommendedActions: string[];
  autoFixApplied: boolean;
  errors: string[];
}

class AIDataMonitoringService {
  private monitoringActive = true;
  private dataChangeLog: DataChangeEvent[] = [];
  private lastSyncTimestamp = new Date().toISOString();
  private adminEmails = ["haynes.d1993@yahoo.com"];

  constructor() {
    this.initializeMonitoring();
    this.loadMonitoringData();
  }

  /**
   * Initialize real-time monitoring
   */
  private initializeMonitoring(): void {
    // Monitor localStorage changes
    window.addEventListener("storage", (e) => {
      if (
        e.key &&
        ["allUsers", "allProducts", "allSales", "currentUser"].includes(e.key)
      ) {
        this.handleDataChange(e.key, e.oldValue, e.newValue);
      }
    });

    // Monitor mutations in user data
    this.startPeriodicSync();
  }

  /**
   * Start periodic data synchronization and monitoring
   */
  private startPeriodicSync(): void {
    setInterval(() => {
      this.performFullDataAnalysis();
    }, 30000); // Every 30 seconds

    // Immediate analysis on page load
    setTimeout(() => {
      this.performFullDataAnalysis();
    }, 2000);
  }

  /**
   * Handle data changes and analyze them
   */
  private handleDataChange(
    key: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    try {
      const oldData = oldValue ? JSON.parse(oldValue) : null;
      const newData = newValue ? JSON.parse(newValue) : null;

      const changes = this.detectChanges(oldData, newData);
      const aiAnalysis = this.analyzeChanges(key, oldData, newData, changes);

      const event: DataChangeEvent = {
        id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: this.getChangeType(key, changes),
        timestamp: new Date().toISOString(),
        entityId: key,
        oldData,
        newData,
        changes,
        severity:
          aiAnalysis.riskLevel > 70
            ? "critical"
            : aiAnalysis.riskLevel > 50
              ? "high"
              : aiAnalysis.riskLevel > 30
                ? "medium"
                : "low",
        aiAnalysis,
      };

      this.dataChangeLog.push(event);
      this.processChangeEvent(event);
      this.saveMonitoringData();
    } catch (error) {
      console.error("Error handling data change:", error);
    }
  }

  /**
   * Perform comprehensive data analysis
   */
  public async performFullDataAnalysis(): Promise<AIAnalysisResult> {
    try {
      const allUsers = JSON.parse(
        localStorage.getItem("allUsers") || "[]",
      ) as User[];
      const allProducts = JSON.parse(
        localStorage.getItem("allProducts") || "[]",
      ) as Product[];
      const allSales = JSON.parse(
        localStorage.getItem("allSales") || "[]",
      ) as Sale[];

      const result: AIAnalysisResult = {
        accountConsistency: true,
        dataIntegrity: true,
        suspiciousActivity: false,
        recommendedActions: [],
        autoFixApplied: false,
        errors: [],
      };

      // 1. Check account consistency
      const accountChecks = this.checkAccountConsistency(
        allUsers,
        allSales,
        allProducts,
      );
      result.accountConsistency = accountChecks.consistent;
      if (!accountChecks.consistent) {
        result.errors.push(...accountChecks.errors);
        result.recommendedActions.push(...accountChecks.fixes);
      }

      // 2. Check data integrity
      const integrityChecks = this.checkDataIntegrity(
        allUsers,
        allProducts,
        allSales,
      );
      result.dataIntegrity = integrityChecks.valid;
      if (!integrityChecks.valid) {
        result.errors.push(...integrityChecks.errors);
        result.recommendedActions.push(...integrityChecks.fixes);
      }

      // 3. Detect suspicious activity
      const suspiciousActivity = this.detectSuspiciousActivity(
        allUsers,
        allSales,
        allProducts,
      );
      result.suspiciousActivity = suspiciousActivity.detected;
      if (suspiciousActivity.detected) {
        result.errors.push(...suspiciousActivity.issues);
        result.recommendedActions.push(...suspiciousActivity.actions);
      }

      // 4. Auto-fix critical issues
      if (result.errors.length > 0) {
        const autoFixed = await this.applyAutoFixes(
          allUsers,
          allProducts,
          allSales,
          result.errors,
        );
        result.autoFixApplied = autoFixed;
      }

      return result;
    } catch (error) {
      return {
        accountConsistency: false,
        dataIntegrity: false,
        suspiciousActivity: true,
        recommendedActions: ["Manual review required"],
        autoFixApplied: false,
        errors: [`Analysis failed: ${error.message}`],
      };
    }
  }

  /**
   * Check account consistency across all data
   */
  private checkAccountConsistency(
    users: User[],
    sales: Sale[],
    products: Product[],
  ): {
    consistent: boolean;
    errors: string[];
    fixes: string[];
  } {
    const errors: string[] = [];
    const fixes: string[] = [];

    users.forEach((user) => {
      // Check sales count matches actual sales
      const userSales = sales.filter((sale) => sale.sellerId === user.id);
      if (user.salesCount !== userSales.length) {
        errors.push(
          `User ${user.username} sales count mismatch: ${user.salesCount} vs ${userSales.length}`,
        );
        fixes.push(
          `Update ${user.username} sales count to ${userSales.length}`,
        );
      }

      // Check total sales amount
      const actualTotal = userSales.reduce((sum, sale) => sum + sale.amount, 0);
      if (Math.abs(user.totalSales - actualTotal) > 0.01) {
        errors.push(
          `User ${user.username} total sales mismatch: $${user.totalSales} vs $${actualTotal}`,
        );
        fixes.push(`Update ${user.username} total sales to $${actualTotal}`);
      }

      // Check product count
      const userProducts = products.filter(
        (product) => product.sellerId === user.id,
      );
      if (user.productCount !== userProducts.length) {
        errors.push(
          `User ${user.username} product count mismatch: ${user.productCount} vs ${userProducts.length}`,
        );
        fixes.push(
          `Update ${user.username} product count to ${userProducts.length}`,
        );
      }
    });

    return {
      consistent: errors.length === 0,
      errors,
      fixes,
    };
  }

  /**
   * Check data integrity
   */
  private checkDataIntegrity(
    users: User[],
    products: Product[],
    sales: Sale[],
  ): {
    valid: boolean;
    errors: string[];
    fixes: string[];
  } {
    const errors: string[] = [];
    const fixes: string[] = [];

    // Check for orphaned sales (sales without corresponding users)
    sales.forEach((sale) => {
      const seller = users.find((u) => u.id === sale.sellerId);
      const buyer = users.find((u) => u.id === sale.buyerId);

      if (!seller) {
        errors.push(
          `Orphaned sale ${sale.id}: seller ${sale.sellerId} not found`,
        );
        fixes.push(`Remove orphaned sale ${sale.id} or create seller account`);
      }

      if (!buyer && sale.buyerId !== "guest") {
        errors.push(
          `Orphaned sale ${sale.id}: buyer ${sale.buyerId} not found`,
        );
        fixes.push(`Remove orphaned sale ${sale.id} or create buyer account`);
      }
    });

    // Check for orphaned products
    products.forEach((product) => {
      const seller = users.find((u) => u.id === product.sellerId);
      if (!seller) {
        errors.push(
          `Orphaned product ${product.id}: seller ${product.sellerId} not found`,
        );
        fixes.push(
          `Remove orphaned product ${product.id} or create seller account`,
        );
      }
    });

    // Check for duplicate user emails
    const emailCounts = new Map<string, number>();
    users.forEach((user) => {
      const count = emailCounts.get(user.email) || 0;
      emailCounts.set(user.email, count + 1);
    });

    emailCounts.forEach((count, email) => {
      if (count > 1) {
        errors.push(
          `Duplicate email detected: ${email} used by ${count} accounts`,
        );
        fixes.push(`Merge or remove duplicate accounts for ${email}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      fixes,
    };
  }

  /**
   * Detect suspicious activity
   */
  private detectSuspiciousActivity(
    users: User[],
    sales: Sale[],
    products: Product[],
  ): {
    detected: boolean;
    issues: string[];
    actions: string[];
  } {
    const issues: string[] = [];
    const actions: string[] = [];

    // Check for unusual sales patterns
    const recentSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return saleDate > dayAgo;
    });

    // User with too many sales in one day
    const salesByUser = new Map<string, number>();
    recentSales.forEach((sale) => {
      const count = salesByUser.get(sale.sellerId) || 0;
      salesByUser.set(sale.sellerId, count + 1);
    });

    salesByUser.forEach((count, userId) => {
      if (count > 10) {
        const user = users.find((u) => u.id === userId);
        issues.push(
          `Suspicious activity: ${user?.username || userId} made ${count} sales in 24 hours`,
        );
        actions.push(
          `Review sales activity for user ${user?.username || userId}`,
        );
      }
    });

    // Check for admin account misuse
    users.forEach((user) => {
      if (this.adminEmails.includes(user.email) && user.salesCount > 0) {
        issues.push(`Admin account ${user.email} has sales activity`);
        actions.push(`Review admin account sales activity`);
      }
    });

    return {
      detected: issues.length > 0,
      issues,
      actions,
    };
  }

  /**
   * Apply automatic fixes for critical issues
   */
  private async applyAutoFixes(
    users: User[],
    products: Product[],
    sales: Sale[],
    errors: string[],
  ): Promise<boolean> {
    try {
      let fixesApplied = false;

      // Fix sales count mismatches
      users.forEach((user) => {
        const userSales = sales.filter((sale) => sale.sellerId === user.id);
        const userPurchases = sales.filter((sale) => sale.buyerId === user.id);

        if (user.salesCount !== userSales.length) {
          user.salesCount = userSales.length;
          fixesApplied = true;
        }

        if (user.purchaseCount !== userPurchases.length) {
          user.purchaseCount = userPurchases.length;
          fixesApplied = true;
        }

        const actualTotalSales = userSales.reduce(
          (sum, sale) => sum + sale.amount,
          0,
        );
        if (Math.abs(user.totalSales - actualTotalSales) > 0.01) {
          user.totalSales = actualTotalSales;
          fixesApplied = true;
        }

        const actualTotalPurchases = userPurchases.reduce(
          (sum, sale) => sum + sale.amount,
          0,
        );
        if (Math.abs(user.totalPurchases - actualTotalPurchases) > 0.01) {
          user.totalPurchases = actualTotalPurchases;
          fixesApplied = true;
        }

        const userProducts = products.filter(
          (product) => product.sellerId === user.id,
        );
        if (user.productCount !== userProducts.length) {
          user.productCount = userProducts.length;
          fixesApplied = true;
        }
      });

      if (fixesApplied) {
        localStorage.setItem("allUsers", JSON.stringify(users));
        this.logAutoFix("User data inconsistencies auto-fixed");
      }

      return fixesApplied;
    } catch (error) {
      console.error("Error applying auto-fixes:", error);
      return false;
    }
  }

  /**
   * Get monitoring analytics
   */
  public getMonitoringAnalytics() {
    const last24Hours = this.dataChangeLog.filter((event) => {
      const eventTime = new Date(event.timestamp);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return eventTime > dayAgo;
    });

    return {
      totalEvents: this.dataChangeLog.length,
      last24Hours: last24Hours.length,
      criticalEvents: this.dataChangeLog.filter(
        (e) => e.severity === "critical",
      ).length,
      highRiskEvents: this.dataChangeLog.filter((e) => e.severity === "high")
        .length,
      anomaliesDetected: this.dataChangeLog.filter(
        (e) => e.aiAnalysis.anomalyDetected,
      ).length,
      recentEvents: this.dataChangeLog.slice(-10),
      systemHealth:
        last24Hours.filter((e) => e.severity === "critical").length === 0
          ? "healthy"
          : "attention_required",
    };
  }

  /**
   * Detect specific changes in data
   */
  private detectChanges(oldData: any, newData: any): string[] {
    const changes: string[] = [];

    if (!oldData && newData) {
      changes.push("Data created");
      return changes;
    }

    if (oldData && !newData) {
      changes.push("Data deleted");
      return changes;
    }

    if (Array.isArray(oldData) && Array.isArray(newData)) {
      if (oldData.length !== newData.length) {
        changes.push(
          `Array length changed: ${oldData.length} -> ${newData.length}`,
        );
      }
    }

    return changes;
  }

  /**
   * Analyze changes using AI logic
   */
  private analyzeChanges(
    key: string,
    oldData: any,
    newData: any,
    changes: string[],
  ): any {
    let riskLevel = 0;
    const recommendations: string[] = [];
    const requiredActions: string[] = [];

    // Increase risk level based on change type
    if (key === "allUsers" && changes.some((c) => c.includes("length"))) {
      riskLevel += 20;
      recommendations.push("Monitor new user registrations");
    }

    if (key === "allSales" && changes.some((c) => c.includes("length"))) {
      riskLevel += 15;
      recommendations.push("Verify sale authenticity");
    }

    return {
      anomalyDetected: riskLevel > 50,
      riskLevel,
      recommendations,
      requiredActions,
    };
  }

  /**
   * Get change type based on key and changes
   */
  private getChangeType(
    key: string,
    changes: string[],
  ): DataChangeEvent["type"] {
    if (key === "allUsers") return "user_update";
    if (key === "allSales") return "sale_created";
    if (key === "allProducts") return "product_upload";
    return "user_update";
  }

  /**
   * Process change events
   */
  private processChangeEvent(event: DataChangeEvent): void {
    if (event.severity === "critical") {
      console.warn("CRITICAL DATA CHANGE DETECTED:", event);
    }

    if (event.aiAnalysis.anomalyDetected) {
      console.warn("ANOMALY DETECTED:", event);
    }
  }

  /**
   * Log auto-fix actions
   */
  private logAutoFix(message: string): void {
    const event: DataChangeEvent = {
      id: `autofix_${Date.now()}`,
      type: "user_update",
      timestamp: new Date().toISOString(),
      entityId: "system",
      changes: [message],
      severity: "medium",
      aiAnalysis: {
        anomalyDetected: false,
        riskLevel: 0,
        recommendations: [],
        requiredActions: [],
      },
    };

    this.dataChangeLog.push(event);
    this.saveMonitoringData();
  }

  /**
   * Load monitoring data from localStorage
   */
  private loadMonitoringData(): void {
    try {
      const saved = localStorage.getItem("aiMonitoringLog");
      if (saved) {
        this.dataChangeLog = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading monitoring data:", error);
    }
  }

  /**
   * Save monitoring data to localStorage
   */
  private saveMonitoringData(): void {
    try {
      // Keep only last 1000 events to prevent storage bloat
      if (this.dataChangeLog.length > 1000) {
        this.dataChangeLog = this.dataChangeLog.slice(-1000);
      }
      localStorage.setItem(
        "aiMonitoringLog",
        JSON.stringify(this.dataChangeLog),
      );
    } catch (error) {
      console.error("Error saving monitoring data:", error);
    }
  }
}

export default new AIDataMonitoringService();
