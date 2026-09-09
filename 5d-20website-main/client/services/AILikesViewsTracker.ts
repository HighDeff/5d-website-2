/**
 * AI-Driven Likes and Views Tracking System
 * Handles real-time likes/views with AI database updates and cross-platform synchronization
 */

import AICentralCommand from "./AICentralCommand";
import { AIClickLogger } from "./AIClickLogger";

export interface ProductInteraction {
  productId: string;
  productName: string;
  sellerId: string;
  userId?: string;
  action: "like" | "unlike" | "view";
  timestamp: string;
  category: string;
  price: number;
  sessionId: string;
  userAgent: string;
  location?: {
    page: string;
    section: string;
    position: number;
  };
}

export interface ProductStats {
  productId: string;
  productName: string;
  totalLikes: number;
  totalViews: number;
  uniqueViews: number;
  likeRate: number;
  viewRate: number;
  lastUpdated: string;
  trending: boolean;
  categoryRank: number;
}

class AILikesViewsTracker {
  private interactions: ProductInteraction[] = [];
  private productStats: Map<string, ProductStats> = new Map();
  private aiUpdateInterval: NodeJS.Timeout | null = null;
  private priceMonitorInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadInteractions();
    this.loadProductStats();
    this.startAIMonitoring();
    this.startPriceMonitoring();
  }

  /**
   * Track a like action with AI database updates
   */
  async trackLike(productId: string, userId?: string): Promise<boolean> {
    try {
      const product = this.getProductDetails(productId);
      if (!product) {
        console.error("Product not found for like tracking:", productId);
        return false;
      }

      const interaction: ProductInteraction = {
        productId,
        productName: product.name,
        sellerId: product.sellerId,
        userId,
        action: "like",
        timestamp: new Date().toISOString(),
        category: product.category,
        price: product.price,
        sessionId: this.getSessionId(),
        userAgent: navigator.userAgent,
        location: this.getCurrentLocation(),
      };

      // Log the click for AI analysis
      AIClickLogger.logInteraction("like_button", {
        productId,
        userId,
        expected: "increment_like_count",
        actual: "pending",
      });

      // Add interaction
      this.interactions.push(interaction);

      // Update local stats immediately
      this.updateProductStats(productId, "like");

      // Tell AI to update database across all instances
      await this.notifyAIForUpdate(interaction);

      // Update products of same name in user profile
      if (userId) {
        await this.updateSimilarProductsInProfile(userId, product.name, "like");
      }

      // Save to localStorage
      this.saveInteractions();
      this.saveProductStats();

      return true;
    } catch (error) {
      console.error("Error tracking like:", error);
      const central = AICentralCommand.getInstance();
      central
        .initialize()
        .then(() => {
          central.logToDatabase({
            type: "error",
            agentId: "likes_views_tracker",
            data: {
              action: "like_tracking_failed",
              productId,
              userId,
              error: error.message,
            },
            metadata: {
              page: window.location.pathname,
              severity: "medium",
            },
          });
        })
        .catch(console.error);
      return false;
    }
  }

  /**
   * Track an unlike action
   */
  async trackUnlike(productId: string, userId?: string): Promise<boolean> {
    try {
      const product = this.getProductDetails(productId);
      if (!product) return false;

      const interaction: ProductInteraction = {
        productId,
        productName: product.name,
        sellerId: product.sellerId,
        userId,
        action: "unlike",
        timestamp: new Date().toISOString(),
        category: product.category,
        price: product.price,
        sessionId: this.getSessionId(),
        userAgent: navigator.userAgent,
        location: this.getCurrentLocation(),
      };

      AIClickLogger.logInteraction("unlike_button", {
        productId,
        userId,
        expected: "decrement_like_count",
        actual: "pending",
      });

      this.interactions.push(interaction);
      this.updateProductStats(productId, "unlike");

      await this.notifyAIForUpdate(interaction);

      if (userId) {
        await this.updateSimilarProductsInProfile(
          userId,
          product.name,
          "unlike",
        );
      }

      this.saveInteractions();
      this.saveProductStats();

      return true;
    } catch (error) {
      console.error("Error tracking unlike:", error);
      return false;
    }
  }

  /**
   * Track a view action
   */
  async trackView(productId: string, userId?: string): Promise<boolean> {
    try {
      const product = this.getProductDetails(productId);
      if (!product) return false;

      const interaction: ProductInteraction = {
        productId,
        productName: product.name,
        sellerId: product.sellerId,
        userId,
        action: "view",
        timestamp: new Date().toISOString(),
        category: product.category,
        price: product.price,
        sessionId: this.getSessionId(),
        userAgent: navigator.userAgent,
        location: this.getCurrentLocation(),
      };

      AIClickLogger.logInteraction("product_view", {
        productId,
        userId,
        expected: "increment_view_count",
        actual: "pending",
      });

      this.interactions.push(interaction);
      this.updateProductStats(productId, "view");

      await this.notifyAIForUpdate(interaction);

      this.saveInteractions();
      this.saveProductStats();

      return true;
    } catch (error) {
      console.error("Error tracking view:", error);
      return false;
    }
  }

  /**
   * Get current product stats
   */
  getProductStats(productId: string): ProductStats | null {
    return this.productStats.get(productId) || null;
  }

  /**
   * Get category stats
   */
  getCategoryStats(category: string): ProductStats[] {
    return Array.from(this.productStats.values())
      .filter((stats) => {
        const product = this.getProductDetails(stats.productId);
        return product?.category === category;
      })
      .sort((a, b) => b.totalLikes - a.totalLikes);
  }

  /**
   * Get trending products
   */
  getTrendingProducts(): ProductStats[] {
    return Array.from(this.productStats.values())
      .filter((stats) => stats.trending)
      .sort((a, b) => b.likeRate - a.likeRate);
  }

  /**
   * Update product stats locally
   */
  private updateProductStats(
    productId: string,
    action: "like" | "unlike" | "view",
  ): void {
    let stats = this.productStats.get(productId);

    if (!stats) {
      const product = this.getProductDetails(productId);
      if (!product) return;

      stats = {
        productId,
        productName: product.name,
        totalLikes: 0,
        totalViews: 0,
        uniqueViews: 0,
        likeRate: 0,
        viewRate: 0,
        lastUpdated: new Date().toISOString(),
        trending: false,
        categoryRank: 0,
      };
    }

    // Update stats based on action
    switch (action) {
      case "like":
        stats.totalLikes++;
        break;
      case "unlike":
        stats.totalLikes = Math.max(0, stats.totalLikes - 1);
        break;
      case "view":
        stats.totalViews++;
        // Count unique views by session
        const uniqueViewsForProduct = new Set(
          this.interactions
            .filter((i) => i.productId === productId && i.action === "view")
            .map((i) => i.sessionId),
        ).size;
        stats.uniqueViews = uniqueViewsForProduct;
        break;
    }

    // Calculate rates
    stats.likeRate =
      stats.totalViews > 0 ? stats.totalLikes / stats.totalViews : 0;
    stats.viewRate = this.calculateViewRate(productId);
    stats.lastUpdated = new Date().toISOString();

    // Determine if trending
    stats.trending = this.isTrending(stats);

    this.productStats.set(productId, stats);
  }

  /**
   * Notify AI system for database updates
   */
  private async notifyAIForUpdate(
    interaction: ProductInteraction,
  ): Promise<void> {
    try {
      // Get Central Command instance
      const central = AICentralCommand.getInstance();
      await central.initialize();

      // Send to central AI command system via instance
      await central.logToDatabase({
        type: "communication",
        agentId: "likes_views_tracker",
        data: {
          action: "update_product_stats",
          interaction,
          priority: "high",
        },
        metadata: {
          page: window.location.pathname,
        },
      });

      // Also update across all similar products
      await central.logToDatabase({
        type: "communication",
        agentId: "likes_views_tracker",
        data: {
          action: "update_similar_products",
          productName: interaction.productName,
          actionType: interaction.action,
          userId: interaction.userId,
          priority: "medium",
        },
        metadata: {
          page: window.location.pathname,
        },
      });
    } catch (error) {
      console.error("Error notifying AI for update:", error);
    }
  }

  /**
   * Update similar products in user profile
   */
  private async updateSimilarProductsInProfile(
    userId: string,
    productName: string,
    action: string,
  ): Promise<void> {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userProducts = JSON.parse(localStorage.getItem("products") || "[]");

      // Find user's products with similar names
      const similarProducts = userProducts.filter(
        (product: any) =>
          product.sellerId === userId &&
          product.name.toLowerCase().includes(productName.toLowerCase()),
      );

      // Update each similar product
      for (const product of similarProducts) {
        await this.notifyAIForUpdate({
          productId: product.id,
          productName: product.name,
          sellerId: product.sellerId,
          userId,
          action: action as any,
          timestamp: new Date().toISOString(),
          category: product.category,
          price: product.price,
          sessionId: this.getSessionId(),
          userAgent: navigator.userAgent,
          location: this.getCurrentLocation(),
        });
      }
    } catch (error) {
      console.error("Error updating similar products:", error);
    }
  }

  /**
   * Start AI monitoring for automatic updates
   */
  private startAIMonitoring(): void {
    // Monitor every 10 seconds
    this.aiUpdateInterval = setInterval(async () => {
      try {
        await this.performAIHealthCheck();
        await this.syncWithBackupAIs();
      } catch (error) {
        console.error("Error in AI monitoring cycle:", error);
      }
    }, 10000);
  }

  /**
   * Start price monitoring
   */
  private startPriceMonitoring(): void {
    // Monitor prices every 30 seconds
    this.priceMonitorInterval = setInterval(() => {
      this.monitorPriceChanges();
    }, 30000);
  }

  /**
   * Monitor price changes across all products
   */
  private async monitorPriceChanges(): Promise<void> {
    try {
      const products = JSON.parse(localStorage.getItem("products") || "[]");

      for (const product of products) {
        const lastKnownPrice = this.getLastKnownPrice(product.id);

        if (lastKnownPrice !== null && lastKnownPrice !== product.price) {
          // Price changed - notify AI system
          const central = AICentralCommand.getInstance();
          await central.initialize();

          await central.logToDatabase({
            type: "detection",
            agentId: "likes_views_tracker",
            data: {
              action: "price_change_detected",
              productId: product.id,
              productName: product.name,
              oldPrice: lastKnownPrice,
              newPrice: product.price,
              changePercentage:
                ((product.price - lastKnownPrice) / lastKnownPrice) * 100,
            },
            priority: "high",
            source: "price_monitor",
            timestamp: new Date().toISOString(),
          });

          // Update price in our tracking
          this.updateLastKnownPrice(product.id, product.price);
        }
      }
    } catch (error) {
      console.error("Error monitoring price changes:", error);
    }
  }

  /**
   * Perform AI health check
   */
  private async performAIHealthCheck(): Promise<void> {
    const healthData = {
      totalInteractions: this.interactions.length,
      totalProducts: this.productStats.size,
      lastUpdate: new Date().toISOString(),
      systemStatus: "active",
    };

    try {
      const central = AICentralCommand.getInstance();
      await central.initialize();

      await central.logToDatabase({
        type: "communication",
        agentId: "likes_views_tracker",
        data: {
          action: "health_report",
          health: healthData,
        },
        metadata: {
          page: window.location.pathname,
        },
      });
    } catch (error) {
      console.error("Error reporting health status:", error);
    }
  }

  /**
   * Sync with backup AIs
   */
  private async syncWithBackupAIs(): Promise<void> {
    try {
      // Send our current state to backup AI systems
      const central = AICentralCommand.getInstance();
      await central.initialize();

      await central.logToDatabase({
        type: "communication",
        agentId: "likes_views_tracker",
        data: {
          action: "sync_backup_ais",
          interactions: this.interactions.slice(-100), // Last 100 interactions
          productStats: Array.from(this.productStats.entries()),
          timestamp: new Date().toISOString(),
          priority: "low",
        },
        metadata: {
          page: window.location.pathname,
        },
      });
    } catch (error) {
      console.error("Error syncing with backup AIs:", error);
    }
  }

  /**
   * Helper methods
   */
  private getProductDetails(productId: string): any {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    return products.find((p: any) => p.id === productId);
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId =
        "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }

  private getCurrentLocation(): any {
    return {
      page: window.location.pathname,
      section: document.title,
      position: window.scrollY,
    };
  }

  private calculateViewRate(productId: string): number {
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
    const recentViews = this.interactions.filter(
      (i) =>
        i.productId === productId &&
        i.action === "view" &&
        new Date(i.timestamp).getTime() > last24Hours,
    ).length;

    return recentViews;
  }

  private isTrending(stats: ProductStats): boolean {
    return stats.likeRate > 0.1 && stats.viewRate > 10 && stats.totalViews > 50;
  }

  private getLastKnownPrice(productId: string): number | null {
    const priceHistory = JSON.parse(
      localStorage.getItem("priceHistory") || "{}",
    );
    return priceHistory[productId] || null;
  }

  private updateLastKnownPrice(productId: string, price: number): void {
    const priceHistory = JSON.parse(
      localStorage.getItem("priceHistory") || "{}",
    );
    priceHistory[productId] = price;
    localStorage.setItem("priceHistory", JSON.stringify(priceHistory));
  }

  private loadInteractions(): void {
    try {
      const saved = localStorage.getItem("aiInteractions");
      if (saved) {
        this.interactions = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading interactions:", error);
      this.interactions = [];
    }
  }

  private saveInteractions(): void {
    try {
      // Keep only last 1000 interactions to prevent storage bloat
      const recentInteractions = this.interactions.slice(-1000);
      localStorage.setItem(
        "aiInteractions",
        JSON.stringify(recentInteractions),
      );
      this.interactions = recentInteractions;
    } catch (error) {
      console.error("Error saving interactions:", error);
    }
  }

  private loadProductStats(): void {
    try {
      const saved = localStorage.getItem("aiProductStats");
      if (saved) {
        const statsArray = JSON.parse(saved);
        this.productStats = new Map(statsArray);
      }
    } catch (error) {
      console.error("Error loading product stats:", error);
      this.productStats = new Map();
    }
  }

  private saveProductStats(): void {
    try {
      const statsArray = Array.from(this.productStats.entries());
      localStorage.setItem("aiProductStats", JSON.stringify(statsArray));
    } catch (error) {
      console.error("Error saving product stats:", error);
    }
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.aiUpdateInterval) {
      clearInterval(this.aiUpdateInterval);
    }
    if (this.priceMonitorInterval) {
      clearInterval(this.priceMonitorInterval);
    }
    this.saveInteractions();
    this.saveProductStats();
  }
}

// Export singleton instance
export const aiLikesViewsTracker = new AILikesViewsTracker();
export default aiLikesViewsTracker;
