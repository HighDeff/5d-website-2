// Database AI Update Service - Automatically updates all pages and accounts on purchases
import { User, Sale, Product } from "@/hooks/useUserAuth";
import AIDataMonitoringService from "./AIDataMonitoringService";

export interface PurchaseUpdate {
  id: string;
  timestamp: string;
  purchaseData: {
    buyerId: string;
    sellerId: string;
    productId: string;
    amount: number;
    commission: number;
  };
  updatesApplied: {
    buyerUpdates: string[];
    sellerUpdates: string[];
    productUpdates: string[];
    systemUpdates: string[];
  };
  pagesAffected: string[];
  success: boolean;
  errors: string[];
}

class DatabaseAIUpdateService {
  private updateQueue: PurchaseUpdate[] = [];
  private isProcessing = false;
  private updateCallbacks: Array<(update: PurchaseUpdate) => void> = [];

  /**
   * Process a purchase and update all affected accounts and pages
   */
  async processPurchaseUpdate(
    purchaseData: {
      buyerId: string;
      sellerId: string;
      productId: string;
      productName: string;
      amount: number;
      commission: number;
      isGuest: boolean;
    },
    allUsers: User[],
    allProducts: Product[],
    allSales: Sale[],
  ): Promise<PurchaseUpdate> {
    const update: PurchaseUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      purchaseData: {
        buyerId: purchaseData.buyerId,
        sellerId: purchaseData.sellerId,
        productId: purchaseData.productId,
        amount: purchaseData.amount,
        commission: purchaseData.commission,
      },
      updatesApplied: {
        buyerUpdates: [],
        sellerUpdates: [],
        productUpdates: [],
        systemUpdates: [],
      },
      pagesAffected: [],
      success: false,
      errors: [],
    };

    try {
      // Update seller account
      await this.updateSellerAccount(
        purchaseData.sellerId,
        purchaseData,
        allUsers,
        update,
      );

      // Update buyer account (if not guest)
      if (!purchaseData.isGuest) {
        await this.updateBuyerAccount(
          purchaseData.buyerId,
          purchaseData,
          allUsers,
          update,
        );
      }

      // Update product information
      await this.updateProductInfo(purchaseData.productId, allProducts, update);

      // Update system-wide statistics
      await this.updateSystemStatistics(purchaseData, update);

      // Trigger page updates
      await this.triggerPageUpdates(update);

      // Save to localStorage
      this.saveUpdatedData(allUsers, allProducts, allSales, update);

      update.success = true;
    } catch (error) {
      update.errors.push(`Purchase update failed: ${error.message}`);
      update.success = false;
    }

    // Add to queue and notify callbacks
    this.updateQueue.push(update);
    this.notifyCallbacks(update);

    // Run AI monitoring check
    AIDataMonitoringService.performFullDataAnalysis();

    return update;
  }

  /**
   * Update seller account information
   */
  private async updateSellerAccount(
    sellerId: string,
    purchaseData: any,
    allUsers: User[],
    update: PurchaseUpdate,
  ): Promise<void> {
    const seller = allUsers.find((user) => user.id === sellerId);

    if (!seller) {
      update.errors.push(`Seller not found: ${sellerId}`);
      return;
    }

    // Calculate net amount (after commission)
    const netAmount = purchaseData.amount - purchaseData.commission;

    // Update seller statistics
    seller.totalSales += netAmount;
    seller.salesCount += 1;
    seller.lastActive = new Date().toISOString();

    // Update seller rating based on successful sale
    seller.rating = Math.min(5.0, seller.rating + 0.01);

    update.updatesApplied.sellerUpdates.push(
      `Added $${netAmount.toFixed(2)} to seller total sales`,
      `Incremented sales count to ${seller.salesCount}`,
      `Updated last active timestamp`,
      `Improved rating to ${seller.rating.toFixed(2)}`,
    );

    update.pagesAffected.push(
      `/shop/${seller.username}`,
      "/dashboard",
      "/analytics",
    );
  }

  /**
   * Update buyer account information
   */
  private async updateBuyerAccount(
    buyerId: string,
    purchaseData: any,
    allUsers: User[],
    update: PurchaseUpdate,
  ): Promise<void> {
    const buyer = allUsers.find((user) => user.id === buyerId);

    if (!buyer) {
      update.errors.push(`Buyer not found: ${buyerId}`);
      return;
    }

    // Update buyer statistics
    buyer.totalPurchases += purchaseData.amount;
    buyer.purchaseCount += 1;
    buyer.lastActive = new Date().toISOString();

    update.updatesApplied.buyerUpdates.push(
      `Added $${purchaseData.amount.toFixed(2)} to buyer total purchases`,
      `Incremented purchase count to ${buyer.purchaseCount}`,
      `Updated last active timestamp`,
    );

    update.pagesAffected.push("/dashboard", "/profile");
  }

  /**
   * Update product information
   */
  private async updateProductInfo(
    productId: string,
    allProducts: Product[],
    update: PurchaseUpdate,
  ): Promise<void> {
    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
      update.errors.push(`Product not found: ${productId}`);
      return;
    }

    // Update product statistics
    product.views += 1; // Increment views for purchase
    product.status = "sold";

    update.updatesApplied.productUpdates.push(
      `Marked product as sold`,
      `Incremented product views`,
    );

    update.pagesAffected.push(`/product/${productId}`, "/collections", "/shop");
  }

  /**
   * Update system-wide statistics
   */
  private async updateSystemStatistics(
    purchaseData: any,
    update: PurchaseUpdate,
  ): Promise<void> {
    try {
      // Update platform revenue
      const systemStats = JSON.parse(
        localStorage.getItem("systemStats") ||
          '{"totalRevenue": 0, "totalSales": 0, "totalCommissions": 0}',
      );

      systemStats.totalRevenue += purchaseData.amount;
      systemStats.totalSales += 1;
      systemStats.totalCommissions += purchaseData.commission;
      systemStats.lastUpdated = new Date().toISOString();

      localStorage.setItem("systemStats", JSON.stringify(systemStats));

      update.updatesApplied.systemUpdates.push(
        `Updated system revenue by $${purchaseData.amount.toFixed(2)}`,
        `Incremented total sales count`,
        `Added commission of $${purchaseData.commission.toFixed(2)}`,
      );

      update.pagesAffected.push("/admin/analytics", "/analytics");
    } catch (error) {
      update.errors.push(
        `Failed to update system statistics: ${error.message}`,
      );
    }
  }

  /**
   * Trigger updates to all affected pages
   */
  private async triggerPageUpdates(update: PurchaseUpdate): Promise<void> {
    try {
      // Trigger React state updates by dispatching custom events
      const affectedPages = [...new Set(update.pagesAffected)];

      affectedPages.forEach((page) => {
        window.dispatchEvent(
          new CustomEvent("databaseUpdate", {
            detail: {
              page,
              updateId: update.id,
              timestamp: update.timestamp,
            },
          }),
        );
      });

      // Force localStorage events to trigger re-renders
      window.dispatchEvent(new Event("storage"));

      update.updatesApplied.systemUpdates.push(
        `Triggered updates for ${affectedPages.length} pages`,
      );
    } catch (error) {
      update.errors.push(`Failed to trigger page updates: ${error.message}`);
    }
  }

  /**
   * Save updated data to localStorage
   */
  private saveUpdatedData(
    allUsers: User[],
    allProducts: Product[],
    allSales: Sale[],
    update: PurchaseUpdate,
  ): void {
    try {
      localStorage.setItem("allUsers", JSON.stringify(allUsers));
      localStorage.setItem("allProducts", JSON.stringify(allProducts));
      localStorage.setItem("allSales", JSON.stringify(allSales));

      update.updatesApplied.systemUpdates.push(
        "Saved updated data to localStorage",
      );
    } catch (error) {
      update.errors.push(`Failed to save updated data: ${error.message}`);
    }
  }

  /**
   * Subscribe to purchase updates
   */
  onPurchaseUpdate(callback: (update: PurchaseUpdate) => void): () => void {
    this.updateCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all callbacks of updates
   */
  private notifyCallbacks(update: PurchaseUpdate): void {
    this.updateCallbacks.forEach((callback) => {
      try {
        callback(update);
      } catch (error) {
        console.error("Error in purchase update callback:", error);
      }
    });
  }

  /**
   * Process queued updates
   */
  async processUpdateQueue(): Promise<void> {
    if (this.isProcessing || this.updateQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process any failed updates
      const failedUpdates = this.updateQueue.filter(
        (update) => !update.success,
      );

      for (const update of failedUpdates) {
        console.log(`Retrying failed update: ${update.id}`);
        // Could implement retry logic here
      }
    } catch (error) {
      console.error("Error processing update queue:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Get update analytics
   */
  getUpdateAnalytics() {
    const totalUpdates = this.updateQueue.length;
    const successfulUpdates = this.updateQueue.filter((u) => u.success).length;
    const recentUpdates = this.updateQueue.slice(-10);

    const pageUpdateCounts = new Map<string, number>();
    this.updateQueue.forEach((update) => {
      update.pagesAffected.forEach((page) => {
        pageUpdateCounts.set(page, (pageUpdateCounts.get(page) || 0) + 1);
      });
    });

    return {
      totalUpdates,
      successfulUpdates,
      successRate:
        totalUpdates > 0 ? (successfulUpdates / totalUpdates) * 100 : 0,
      recentUpdates,
      mostUpdatedPages: Array.from(pageUpdateCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
      averageUpdatesPerPurchase:
        totalUpdates > 0
          ? this.updateQueue.reduce(
              (sum, update) =>
                sum +
                update.updatesApplied.buyerUpdates.length +
                update.updatesApplied.sellerUpdates.length +
                update.updatesApplied.productUpdates.length +
                update.updatesApplied.systemUpdates.length,
              0,
            ) / totalUpdates
          : 0,
    };
  }

  /**
   * Validate data consistency after updates
   */
  async validateDataConsistency(
    allUsers: User[],
    allProducts: Product[],
    allSales: Sale[],
  ): Promise<{
    isConsistent: boolean;
    issues: string[];
    fixes: string[];
  }> {
    const issues: string[] = [];
    const fixes: string[] = [];

    try {
      // Check user totals match sales data
      allUsers.forEach((user) => {
        const userSales = allSales.filter((sale) => sale.sellerId === user.id);
        const actualSalesTotal = userSales.reduce(
          (sum, sale) => sum + (sale.amount - sale.commission),
          0,
        );

        if (Math.abs(user.totalSales - actualSalesTotal) > 0.01) {
          issues.push(
            `User ${user.name} sales total mismatch: ${user.totalSales} vs ${actualSalesTotal}`,
          );
          fixes.push(`Update ${user.name} total sales to ${actualSalesTotal}`);
        }

        const userPurchases = allSales.filter(
          (sale) => sale.buyerId === user.id,
        );
        const actualPurchasesTotal = userPurchases.reduce(
          (sum, sale) => sum + sale.amount,
          0,
        );

        if (Math.abs(user.totalPurchases - actualPurchasesTotal) > 0.01) {
          issues.push(
            `User ${user.name} purchases total mismatch: ${user.totalPurchases} vs ${actualPurchasesTotal}`,
          );
          fixes.push(
            `Update ${user.name} total purchases to ${actualPurchasesTotal}`,
          );
        }
      });

      // Check for orphaned sales
      allSales.forEach((sale) => {
        const seller = allUsers.find((u) => u.id === sale.sellerId);
        const buyer = allUsers.find((u) => u.id === sale.buyerId);

        if (!seller) {
          issues.push(
            `Sale ${sale.id} has orphaned seller ID: ${sale.sellerId}`,
          );
          fixes.push(
            `Remove orphaned sale ${sale.id} or create seller account`,
          );
        }

        if (!buyer && sale.buyerId !== "guest") {
          issues.push(`Sale ${sale.id} has orphaned buyer ID: ${sale.buyerId}`);
          fixes.push(`Remove orphaned sale ${sale.id} or create buyer account`);
        }
      });

      // Check product consistency
      allProducts.forEach((product) => {
        const seller = allUsers.find((u) => u.id === product.sellerId);
        if (!seller) {
          issues.push(
            `Product ${product.name} has orphaned seller ID: ${product.sellerId}`,
          );
          fixes.push(
            `Remove orphaned product ${product.id} or create seller account`,
          );
        }
      });
    } catch (error) {
      issues.push(`Data validation failed: ${error.message}`);
    }

    return {
      isConsistent: issues.length === 0,
      issues,
      fixes,
    };
  }

  /**
   * Get recent update history
   */
  getRecentUpdates(limit: number = 20): PurchaseUpdate[] {
    return this.updateQueue.slice(-limit);
  }

  /**
   * Clear update history (for maintenance)
   */
  clearUpdateHistory(): void {
    this.updateQueue = [];
  }
}

export default new DatabaseAIUpdateService();
