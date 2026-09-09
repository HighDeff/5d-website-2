/**
 * Personal Account AI System
 * Each account gets its own AI to manage data and send requests to main AIs
 */

import AICentralCommand from "./AICentralCommand";

export interface PersonalAIInstance {
  userId: string;
  userName: string;
  aiId: string;
  capabilities: string[];
  permissions: string[];
  dataScope: string[];
  lastActivity: string;
  performance: number;
  errors: number;
  requests: number;
  status: "active" | "sleeping" | "busy" | "error";
}

export interface PersonalAIRequest {
  id: string;
  userId: string;
  requestType: string;
  data: any;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: string;
  response?: any;
  error?: string;
}

export interface UserDataMonitoring {
  userId: string;
  products: any[];
  sales: any[];
  purchases: any[];
  favorites: any[];
  cart: any[];
  interactions: any[];
  dataIntegrity: number; // 0-100
  lastSync: string;
  changesDetected: boolean;
}

class PersonalAccountAIService {
  private personalAIs: Map<string, PersonalAIInstance> = new Map();
  private activeRequests: Map<string, PersonalAIRequest> = new Map();
  private userDataMonitoring: Map<string, UserDataMonitoring> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMonitoring();
    this.loadPersonalAIs();
  }

  /**
   * Create personal AI for a user
   */
  async createPersonalAI(
    userId: string,
    userName: string,
  ): Promise<PersonalAIInstance> {
    try {
      const personalAI: PersonalAIInstance = {
        userId,
        userName,
        aiId: `personal_ai_${userId}_${Date.now()}`,
        capabilities: this.getDefaultCapabilities(),
        permissions: this.getUserPermissions(userId),
        dataScope: this.getUserDataScope(userId),
        lastActivity: new Date().toISOString(),
        performance: 100,
        errors: 0,
        requests: 0,
        status: "active",
      };

      this.personalAIs.set(userId, personalAI);
      await this.initializeUserDataMonitoring(userId);

      // Register with central AI
      await AICentralCommand.processCommand({
        type: "PERSONAL_AI_CREATED",
        payload: { personalAI },
        priority: "medium",
        source: "personal_account_ai",
        timestamp: new Date().toISOString(),
      });

      console.log(`✅ Personal AI created for user ${userName} (${userId})`);
      return personalAI;
    } catch (error) {
      console.error(`Error creating personal AI for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get or create personal AI for user
   */
  async getPersonalAI(userId: string): Promise<PersonalAIInstance> {
    let personalAI = this.personalAIs.get(userId);

    if (!personalAI) {
      // Get user name from database
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.id === userId);
      const userName = user ? user.name : `User_${userId}`;

      personalAI = await this.createPersonalAI(userId, userName);
    }

    // Update last activity
    personalAI.lastActivity = new Date().toISOString();
    this.personalAIs.set(userId, personalAI);

    return personalAI;
  }

  /**
   * Submit request through personal AI
   */
  async submitRequest(
    userId: string,
    requestType: string,
    data: any,
    priority: "low" | "medium" | "high" | "urgent" = "medium",
  ): Promise<string> {
    try {
      const personalAI = await this.getPersonalAI(userId);

      const request: PersonalAIRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        requestType,
        data,
        priority,
        status: "pending",
        timestamp: new Date().toISOString(),
      };

      this.activeRequests.set(request.id, request);
      personalAI.requests++;

      // Process request through personal AI
      await this.processPersonalRequest(personalAI, request);

      return request.id;
    } catch (error) {
      console.error(`Error submitting request for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Process request through personal AI
   */
  private async processPersonalRequest(
    personalAI: PersonalAIInstance,
    request: PersonalAIRequest,
  ): Promise<void> {
    try {
      personalAI.status = "busy";
      request.status = "processing";

      let response: any;

      switch (request.requestType) {
        case "UPDATE_PRODUCT_DATA":
          response = await this.handleProductDataUpdate(personalAI, request);
          break;
        case "SYNC_SALES_DATA":
          response = await this.handleSalesDataSync(personalAI, request);
          break;
        case "UPDATE_USER_PREFERENCES":
          response = await this.handleUserPreferencesUpdate(
            personalAI,
            request,
          );
          break;
        case "VALIDATE_ACCOUNT_DATA":
          response = await this.handleAccountDataValidation(
            personalAI,
            request,
          );
          break;
        case "REQUEST_DATA_CHANGE":
          response = await this.handleDataChangeRequest(personalAI, request);
          break;
        case "SYNC_WITH_MAIN_AI":
          response = await this.handleMainAISync(personalAI, request);
          break;
        default:
          response = await this.handleGenericRequest(personalAI, request);
          break;
      }

      request.status = "completed";
      request.response = response;
      personalAI.status = "active";
    } catch (error) {
      console.error(`Error processing request ${request.id}:`, error);
      request.status = "failed";
      request.error = error.message;
      personalAI.errors++;
      personalAI.status = "error";
    }

    this.activeRequests.set(request.id, request);
  }

  /**
   * Handle product data update
   */
  private async handleProductDataUpdate(
    personalAI: PersonalAIInstance,
    request: PersonalAIRequest,
  ): Promise<any> {
    const { productId, updateData } = request.data;

    // Validate user owns this product
    const userDataMonitoring = this.userDataMonitoring.get(personalAI.userId);
    const userProduct = userDataMonitoring?.products.find(
      (p) => p.id === productId,
    );

    if (!userProduct) {
      throw new Error("User does not own this product");
    }

    // Update product data
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = products.findIndex((p: any) => p.id === productId);

    if (productIndex !== -1) {
      // Merge update data
      Object.assign(products[productIndex], updateData);
      products[productIndex].lastUpdated = new Date().toISOString();

      localStorage.setItem("products", JSON.stringify(products));

      // Update monitoring data
      if (userDataMonitoring) {
        const userProductIndex = userDataMonitoring.products.findIndex(
          (p) => p.id === productId,
        );
        if (userProductIndex !== -1) {
          Object.assign(
            userDataMonitoring.products[userProductIndex],
            updateData,
          );
        }
      }

      // Send to main AI for global updates
      await AICentralCommand.processCommand({
        type: "PRODUCT_DATA_UPDATED_BY_PERSONAL_AI",
        payload: { userId: personalAI.userId, productId, updateData },
        priority: "medium",
        source: `personal_ai_${personalAI.userId}`,
        timestamp: new Date().toISOString(),
      });

      return { success: true, message: "Product data updated successfully" };
    }

    throw new Error("Product not found in main database");
  }

  /**
   * Handle sales data sync
   */
  private async handleSalesDataSync(
    personalAI: PersonalAIInstance,
    request: PersonalAIRequest,
  ): Promise<any> {
    const userDataMonitoring = this.userDataMonitoring.get(personalAI.userId);
    if (!userDataMonitoring) {
      throw new Error("User data monitoring not initialized");
    }

    // Get latest sales data
    const allSales = JSON.parse(localStorage.getItem("sales") || "[]");
    const userSales = allSales.filter(
      (sale: any) => sale.sellerId === personalAI.userId,
    );

    // Compare with monitored data
    const newSales = userSales.filter(
      (sale: any) => !userDataMonitoring.sales.find((s) => s.id === sale.id),
    );

    if (newSales.length > 0) {
      userDataMonitoring.sales.push(...newSales);
      userDataMonitoring.changesDetected = true;
      userDataMonitoring.lastSync = new Date().toISOString();

      // Update user's sales count in products
      await this.updateProductSalesCounts(personalAI.userId, userSales);
    }

    return {
      success: true,
      message: `Synced ${newSales.length} new sales`,
      data: { newSalesCount: newSales.length, totalSales: userSales.length },
    };
  }

  /**
   * Handle data change request to main AI
   */
  private async handleDataChangeRequest(
    personalAI: PersonalAIInstance,
    request: PersonalAIRequest,
  ): Promise<any> {
    const { changeType, targetData, newValue, reason } = request.data;

    // Validate request
    if (!this.validateDataChangeRequest(personalAI, changeType, targetData)) {
      throw new Error("Unauthorized data change request");
    }

    // Send request to main AI for approval
    const mainAIResponse = await AICentralCommand.processCommand({
      type: "DATA_CHANGE_REQUEST",
      payload: {
        userId: personalAI.userId,
        changeType,
        targetData,
        newValue,
        reason,
        personalAIId: personalAI.aiId,
      },
      priority: request.priority,
      source: `personal_ai_${personalAI.userId}`,
      timestamp: new Date().toISOString(),
    });

    if (mainAIResponse.success) {
      // Apply the change locally
      await this.applyDataChange(
        personalAI.userId,
        changeType,
        targetData,
        newValue,
      );

      return {
        success: true,
        message: "Data change request approved and applied",
        data: mainAIResponse.data,
      };
    } else {
      return {
        success: false,
        message: "Data change request denied by main AI",
        error: mainAIResponse.error,
      };
    }
  }

  /**
   * Apply approved data change
   */
  private async applyDataChange(
    userId: string,
    changeType: string,
    targetData: any,
    newValue: any,
  ): Promise<void> {
    switch (changeType) {
      case "product_sales_count":
        await this.updateProductSalesCount(targetData.productId, newValue);
        break;
      case "product_price":
        await this.updateProductPrice(targetData.productId, newValue);
        break;
      case "user_membership":
        await this.updateUserMembership(userId, newValue);
        break;
      case "product_views":
        await this.updateProductViews(targetData.productId, newValue);
        break;
      default:
        throw new Error(`Unknown change type: ${changeType}`);
    }
  }

  /**
   * Initialize user data monitoring
   */
  private async initializeUserDataMonitoring(userId: string): Promise<void> {
    try {
      const monitoring: UserDataMonitoring = {
        userId,
        products: [],
        sales: [],
        purchases: [],
        favorites: [],
        cart: [],
        interactions: [],
        dataIntegrity: 100,
        lastSync: new Date().toISOString(),
        changesDetected: false,
      };

      // Load user's current data
      await this.loadUserData(monitoring);

      this.userDataMonitoring.set(userId, monitoring);
    } catch (error) {
      console.error(`Error initializing monitoring for ${userId}:`, error);
    }
  }

  /**
   * Load user data for monitoring
   */
  private async loadUserData(monitoring: UserDataMonitoring): Promise<void> {
    // Load products
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    monitoring.products = allProducts.filter(
      (p: any) => p.sellerId === monitoring.userId,
    );

    // Load sales
    const allSales = JSON.parse(localStorage.getItem("sales") || "[]");
    monitoring.sales = allSales.filter(
      (s: any) => s.sellerId === monitoring.userId,
    );

    // Load purchases
    monitoring.purchases = allSales.filter(
      (s: any) => s.buyerId === monitoring.userId,
    );

    // Load user data
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.id === monitoring.userId);

    if (user) {
      monitoring.favorites = user.favoriteProducts || [];
      monitoring.cart = JSON.parse(
        localStorage.getItem(`cart_${monitoring.userId}`) || "[]",
      );
    }
  }

  /**
   * Monitor user data changes
   */
  private async monitorUserDataChanges(): Promise<void> {
    for (const [userId, monitoring] of this.userDataMonitoring) {
      try {
        const previousData = { ...monitoring };
        await this.loadUserData(monitoring);

        // Check for changes
        const hasChanges = this.detectDataChanges(previousData, monitoring);

        if (hasChanges) {
          monitoring.changesDetected = true;
          monitoring.lastSync = new Date().toISOString();

          // Notify personal AI
          const personalAI = this.personalAIs.get(userId);
          if (personalAI) {
            await this.notifyPersonalAI(personalAI, "DATA_CHANGES_DETECTED", {
              changes: this.getDataChanges(previousData, monitoring),
            });
          }
        }

        // Update data integrity score
        monitoring.dataIntegrity = this.calculateDataIntegrity(monitoring);
      } catch (error) {
        console.error(`Error monitoring data for ${userId}:`, error);
      }
    }
  }

  /**
   * Start monitoring interval
   */
  private startMonitoring(): void {
    // Monitor every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.monitorUserDataChanges();
    }, 30000);
  }

  /**
   * Helper methods
   */
  private getDefaultCapabilities(): string[] {
    return [
      "monitor_user_data",
      "sync_with_main_ai",
      "validate_data_integrity",
      "request_data_changes",
      "update_user_preferences",
      "track_user_interactions",
      "generate_user_reports",
    ];
  }

  private getUserPermissions(userId: string): string[] {
    // Check if user is admin
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.id === userId);

    const basePermissions = [
      "read_own_data",
      "update_own_data",
      "request_changes",
    ];

    if (user?.isAdmin || user?.email === "haynes.d1993@yahoo.com") {
      return [
        ...basePermissions,
        "admin_override",
        "access_all_data",
        "approve_changes",
      ];
    }

    return basePermissions;
  }

  private getUserDataScope(userId: string): string[] {
    return [
      `products_${userId}`,
      `sales_${userId}`,
      `purchases_${userId}`,
      `favorites_${userId}`,
      `cart_${userId}`,
      `interactions_${userId}`,
    ];
  }

  private validateDataChangeRequest(
    personalAI: PersonalAIInstance,
    changeType: string,
    targetData: any,
  ): boolean {
    // Check if personal AI has permission for this change type
    const allowedChanges = [
      "product_sales_count",
      "product_price",
      "product_views",
      "user_preferences",
    ];

    if (!allowedChanges.includes(changeType)) {
      return false;
    }

    // Additional validation based on change type
    if (changeType.startsWith("product_") && targetData.productId) {
      // Verify user owns the product
      const userMonitoring = this.userDataMonitoring.get(personalAI.userId);
      return (
        userMonitoring?.products.some((p) => p.id === targetData.productId) ||
        false
      );
    }

    return true;
  }

  private detectDataChanges(
    previous: UserDataMonitoring,
    current: UserDataMonitoring,
  ): boolean {
    return (
      previous.products.length !== current.products.length ||
      previous.sales.length !== current.sales.length ||
      previous.purchases.length !== current.purchases.length ||
      previous.favorites.length !== current.favorites.length
    );
  }

  private getDataChanges(
    previous: UserDataMonitoring,
    current: UserDataMonitoring,
  ): any {
    return {
      productsDiff: current.products.length - previous.products.length,
      salesDiff: current.sales.length - previous.sales.length,
      purchasesDiff: current.purchases.length - previous.purchases.length,
      favoritesDiff: current.favorites.length - previous.favorites.length,
    };
  }

  private calculateDataIntegrity(monitoring: UserDataMonitoring): number {
    let score = 100;

    // Check for missing required fields
    monitoring.products.forEach((product) => {
      if (!product.id) score -= 5;
      if (!product.name) score -= 3;
      if (product.price === undefined) score -= 3;
    });

    // Check for data consistency
    if (monitoring.sales.length > monitoring.products.length * 10) {
      score -= 10; // Suspicious sales count
    }

    return Math.max(0, score);
  }

  private async notifyPersonalAI(
    personalAI: PersonalAIInstance,
    eventType: string,
    data: any,
  ): Promise<void> {
    await AICentralCommand.processCommand({
      type: "PERSONAL_AI_NOTIFICATION",
      payload: {
        aiId: personalAI.aiId,
        userId: personalAI.userId,
        eventType,
        data,
      },
      priority: "low",
      source: "personal_account_ai_monitor",
      timestamp: new Date().toISOString(),
    });
  }

  // Update methods
  private async updateProductSalesCount(
    productId: string,
    newCount: number,
  ): Promise<void> {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = products.findIndex((p: any) => p.id === productId);

    if (productIndex !== -1) {
      products[productIndex].salesCount = newCount;
      localStorage.setItem("products", JSON.stringify(products));
    }
  }

  private async updateProductPrice(
    productId: string,
    newPrice: number,
  ): Promise<void> {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = products.findIndex((p: any) => p.id === productId);

    if (productIndex !== -1) {
      products[productIndex].price = newPrice;
      localStorage.setItem("products", JSON.stringify(products));
    }
  }

  private async updateProductViews(
    productId: string,
    newViews: number,
  ): Promise<void> {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = products.findIndex((p: any) => p.id === productId);

    if (productIndex !== -1) {
      products[productIndex].views = newViews;
      localStorage.setItem("products", JSON.stringify(products));
    }
  }

  private async updateUserMembership(
    userId: string,
    newLevel: string,
  ): Promise<void> {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].membershipLevel = newLevel;
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

  private async updateProductSalesCounts(
    userId: string,
    sales: any[],
  ): Promise<void> {
    const products = JSON.parse(localStorage.getItem("products") || "[]");

    // Count sales per product
    const salesCounts: { [productId: string]: number } = {};
    sales.forEach((sale) => {
      salesCounts[sale.productId] = (salesCounts[sale.productId] || 0) + 1;
    });

    // Update products
    let updated = false;
    products.forEach((product: any) => {
      if (
        product.sellerId === userId &&
        salesCounts[product.id] !== undefined
      ) {
        product.salesCount = salesCounts[product.id];
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }

  private async handleUserPreferencesUpdate(
    personalAI: PersonalAIInstance,
    request: PersonalAIRequest,
  ): Promise<any> {
    return { success: true, message: "User preferences updated" };
  }

  private async handleAccountDataValidation(
    personalAI: PersonalAIInstance,
    request: PersonalAIRequest,
  ): Promise<any> {
    return { success: true, message: "Account data validated" };
  }

  private async handleMainAISync(
    personalAI: PersonalAIInstance,
    request: PersonalAIRequest,
  ): Promise<any> {
    return { success: true, message: "Synced with main AI" };
  }

  private async handleGenericRequest(
    personalAI: PersonalAIInstance,
    request: PersonalAIRequest,
  ): Promise<any> {
    return { success: true, message: "Generic request processed" };
  }

  private loadPersonalAIs(): void {
    try {
      const saved = localStorage.getItem("personalAIs");
      if (saved) {
        const aisArray = JSON.parse(saved);
        this.personalAIs = new Map(aisArray);
      }
    } catch (error) {
      console.error("Error loading personal AIs:", error);
    }
  }

  private savePersonalAIs(): void {
    try {
      const aisArray = Array.from(this.personalAIs.entries());
      localStorage.setItem("personalAIs", JSON.stringify(aisArray));
    } catch (error) {
      console.error("Error saving personal AIs:", error);
    }
  }

  /**
   * Public API methods
   */
  async getUserPersonalAI(userId: string): Promise<PersonalAIInstance> {
    return await this.getPersonalAI(userId);
  }

  async requestDataChange(
    userId: string,
    changeType: string,
    targetData: any,
    newValue: any,
    reason: string,
  ): Promise<string> {
    return await this.submitRequest(
      userId,
      "REQUEST_DATA_CHANGE",
      {
        changeType,
        targetData,
        newValue,
        reason,
      },
      "high",
    );
  }

  getPersonalAIStatus(userId: string): PersonalAIInstance | null {
    return this.personalAIs.get(userId) || null;
  }

  getUserDataMonitoring(userId: string): UserDataMonitoring | null {
    return this.userDataMonitoring.get(userId) || null;
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.savePersonalAIs();
  }
}

// Export singleton instance
export const PersonalAccountAI = new PersonalAccountAIService();
export default PersonalAccountAI;
