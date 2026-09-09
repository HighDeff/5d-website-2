/**
 * Advanced Engagement Calculator
 * Calculates likes and views based on actual database clicks with probability validation
 * Uses coin flip mechanism with 0*probability extraction and AI weight factoring
 */

import AICentralCommand from "./AICentralCommand";

export interface ClickHistoryEntry {
  id: string;
  userId: string;
  productId: string;
  collectionId: string;
  actionType: "like" | "unlike" | "view" | "remove" | "re-click";
  timestamp: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  probability: number;
  coinFlipResult: "heads" | "tails";
  aiWeightFactor: number;
  validationStatus: "confirmed" | "disputed" | "pending" | "error";
}

export interface AccountEngagementFolder {
  accountId: string;
  clickHistory: ClickHistoryEntry[];
  totalLikes: number;
  totalViews: number;
  totalRemoves: number;
  totalReClicks: number;
  probabilityScore: number;
  lastValidated: string;
  centralHubStatus: "synced" | "out_of_sync" | "error";
}

export interface EngagementCalculationResult {
  productId: string;
  calculatedLikes: number;
  calculatedViews: number;
  probabilityConfidence: number;
  validationErrors: string[];
  coinFlipResults: Array<{
    flip: "heads" | "tails";
    probability: number;
    extracted: number;
    aiWeight: number;
  }>;
  databaseConsistency: boolean;
  centralHubVerified: boolean;
}

class AdvancedEngagementCalculatorService {
  private accountFolders: Map<string, AccountEngagementFolder> = new Map();
  private centralHubData: Map<string, any> = new Map();
  private validationInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadAccountFolders();
    this.startCentralHubValidation();
  }

  /**
   * Calculate engagement with coin flip probability mechanism
   */
  async calculateEngagement(
    productId: string,
    collectionId: string,
  ): Promise<EngagementCalculationResult> {
    try {
      const result: EngagementCalculationResult = {
        productId,
        calculatedLikes: 0,
        calculatedViews: 0,
        probabilityConfidence: 0,
        validationErrors: [],
        coinFlipResults: [],
        databaseConsistency: true,
        centralHubVerified: false,
      };

      // Get all account folders for this product
      const relevantAccounts = this.getAccountsForProduct(productId);

      if (relevantAccounts.length === 0) {
        result.validationErrors.push("No account interaction data found");
        return result;
      }

      // Cross-reference click history across all accounts
      const crossReferencedClicks = await this.crossReferenceClickHistory(
        productId,
        relevantAccounts,
      );

      // Apply coin flip mechanism with probability extraction
      const coinFlipResults = await this.applyCoinFlipMechanism(
        crossReferencedClicks,
      );
      result.coinFlipResults = coinFlipResults;

      // Calculate engagement based on coin flip results and AI weights
      const { likes, views, confidence } = this.calculateFinalEngagement(
        coinFlipResults,
        crossReferencedClicks,
      );

      result.calculatedLikes = likes;
      result.calculatedViews = views;
      result.probabilityConfidence = confidence;

      // Validate against central hub
      const centralHubValidation = await this.validateAgainstCentralHub(
        productId,
        result,
      );
      result.centralHubVerified = centralHubValidation.verified;
      result.databaseConsistency = centralHubValidation.consistent;

      if (!centralHubValidation.verified) {
        result.validationErrors.push(...centralHubValidation.errors);
      }

      // Handle non-zero/zero probability function
      const shouldChangeValue = this.evaluateChangeNecessity(
        productId,
        result,
        crossReferencedClicks,
      );

      if (!shouldChangeValue) {
        // Return existing database values
        const existingValues = this.getExistingDatabaseValues(productId);
        if (existingValues) {
          result.calculatedLikes = existingValues.likes;
          result.calculatedViews = existingValues.views;
        }
      }

      // Store calculation result
      await this.storeFinalResult(productId, result);

      return result;
    } catch (error) {
      console.error("Error calculating engagement:", error);
      return {
        productId,
        calculatedLikes: 0,
        calculatedViews: 0,
        probabilityConfidence: 0,
        validationErrors: [`Calculation error: ${error.message}`],
        coinFlipResults: [],
        databaseConsistency: false,
        centralHubVerified: false,
      };
    }
  }

  /**
   * Track click interaction and store in account folder
   */
  async trackClickInteraction(
    userId: string,
    productId: string,
    collectionId: string,
    actionType: "like" | "unlike" | "view" | "remove" | "re-click",
  ): Promise<void> {
    try {
      const clickEntry: ClickHistoryEntry = {
        id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        productId,
        collectionId,
        actionType,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent,
        probability: Math.random(),
        coinFlipResult: Math.random() > 0.5 ? "heads" : "tails",
        aiWeightFactor: await this.calculateAIWeightFactor(userId, actionType),
        validationStatus: "pending",
      };

      // Get or create account folder
      let accountFolder = this.accountFolders.get(userId);
      if (!accountFolder) {
        accountFolder = {
          accountId: userId,
          clickHistory: [],
          totalLikes: 0,
          totalViews: 0,
          totalRemoves: 0,
          totalReClicks: 0,
          probabilityScore: 0,
          lastValidated: new Date().toISOString(),
          centralHubStatus: "out_of_sync",
        };
        this.accountFolders.set(userId, accountFolder);
      }

      // Add click to history
      accountFolder.clickHistory.push(clickEntry);

      // Update counters
      switch (actionType) {
        case "like":
          accountFolder.totalLikes++;
          break;
        case "view":
          accountFolder.totalViews++;
          break;
        case "remove":
          accountFolder.totalRemoves++;
          break;
        case "re-click":
          accountFolder.totalReClicks++;
          break;
      }

      // Update probability score
      accountFolder.probabilityScore =
        this.calculateProbabilityScore(accountFolder);
      accountFolder.centralHubStatus = "out_of_sync";

      // Save account folder
      this.saveAccountFolder(userId, accountFolder);

      // Send to AI central command for validation
      await AICentralCommand.processCommand({
        type: "ENGAGEMENT_CLICK_TRACKED",
        payload: { userId, clickEntry, accountFolder },
        priority: "medium",
        source: "engagement_calculator",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error tracking click interaction:", error);
    }
  }

  /**
   * Get accounts that have interacted with a product
   */
  private getAccountsForProduct(productId: string): AccountEngagementFolder[] {
    const accounts: AccountEngagementFolder[] = [];

    this.accountFolders.forEach((folder) => {
      const hasInteractions = folder.clickHistory.some(
        (click) => click.productId === productId,
      );
      if (hasInteractions) {
        accounts.push(folder);
      }
    });

    return accounts;
  }

  /**
   * Cross-reference click history across accounts
   */
  private async crossReferenceClickHistory(
    productId: string,
    accounts: AccountEngagementFolder[],
  ): Promise<ClickHistoryEntry[]> {
    const allClicks: ClickHistoryEntry[] = [];

    accounts.forEach((account) => {
      const productClicks = account.clickHistory.filter(
        (click) => click.productId === productId,
      );
      allClicks.push(...productClicks);
    });

    // Sort by timestamp
    allClicks.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    // Cross-reference for patterns and anomalies
    const crossReferenced = this.detectClickPatterns(allClicks);

    return crossReferenced;
  }

  /**
   * Apply coin flip mechanism with probability extraction
   */
  private async applyCoinFlipMechanism(clicks: ClickHistoryEntry[]): Promise<
    Array<{
      flip: "heads" | "tails";
      probability: number;
      extracted: number;
      aiWeight: number;
    }>
  > {
    const coinFlipResults: Array<{
      flip: "heads" | "tails";
      probability: number;
      extracted: number;
      aiWeight: number;
    }> = [];

    for (const click of clicks) {
      // Flip a coin
      const coinFlip: "heads" | "tails" =
        Math.random() > 0.5 ? "heads" : "tails";

      // Extract result using 0 * probability (as specified)
      // This creates a mechanism where the result exists between definite clicks
      const extractedValue = 0 * click.probability; // Always 0, but establishes the mechanism

      // Weight against all AI factoring
      const aiWeight = await this.calculateAIWeightAgainstFactoring(click);

      // Bounce back events to ensure central hub returns true values
      const bounceBackResult = await this.bounceBackToCentralHub(
        click,
        coinFlip,
        extractedValue,
        aiWeight,
      );

      coinFlipResults.push({
        flip: coinFlip,
        probability: click.probability,
        extracted: bounceBackResult.finalValue,
        aiWeight: bounceBackResult.adjustedWeight,
      });
    }

    return coinFlipResults;
  }

  /**
   * Calculate final engagement based on coin flip results and AI weights
   */
  private calculateFinalEngagement(
    coinFlipResults: Array<{
      flip: "heads" | "tails";
      probability: number;
      extracted: number;
      aiWeight: number;
    }>,
    clicks: ClickHistoryEntry[],
  ): { likes: number; views: number; confidence: number } {
    let likes = 0;
    let views = 0;
    let totalWeight = 0;

    // Count actual interactions
    const likeClicks = clicks.filter((c) => c.actionType === "like");
    const viewClicks = clicks.filter((c) => c.actionType === "view");
    const removeClicks = clicks.filter((c) => c.actionType === "remove");

    // Calculate base engagement from actual clicks
    const baseLikes = Math.max(0, likeClicks.length - removeClicks.length);
    const baseViews = viewClicks.length;

    // Apply coin flip probability adjustments
    coinFlipResults.forEach((result) => {
      const weight = result.aiWeight;
      totalWeight += weight;

      if (result.flip === "heads") {
        // Positive engagement
        likes += weight * 0.1; // Small boost for heads
        views += weight * 0.05;
      } else {
        // Tails - maintain stability
        likes += weight * 0.01;
        views += weight * 0.01;
      }
    });

    // Combine base clicks with probability adjustments
    const finalLikes = Math.round(baseLikes + likes);
    const finalViews = Math.round(baseViews + views);

    // Calculate confidence based on data consistency
    const confidence =
      totalWeight > 0
        ? Math.min(100, (totalWeight / coinFlipResults.length) * 100)
        : 0;

    return {
      likes: finalLikes,
      views: finalViews,
      confidence,
    };
  }

  /**
   * Validate against central hub and handle not found errors
   */
  private async validateAgainstCentralHub(
    productId: string,
    result: EngagementCalculationResult,
  ): Promise<{
    verified: boolean;
    consistent: boolean;
    errors: string[];
  }> {
    try {
      // Direct search in central hub
      const directSearch = this.centralHubData.get(productId);

      // Indirect search through related data
      const indirectSearch = await this.performIndirectSearch(productId);

      const errors: string[] = [];
      let verified = true;
      let consistent = true;

      if (!directSearch && !indirectSearch) {
        errors.push(
          "Product not found in central hub (direct and indirect search failed)",
        );
        verified = false;
      }

      if (directSearch) {
        // Compare calculated values with central hub
        const hubLikes = directSearch.likes || 0;
        const hubViews = directSearch.views || 0;

        const likesDiff = Math.abs(result.calculatedLikes - hubLikes);
        const viewsDiff = Math.abs(result.calculatedViews - hubViews);

        if (likesDiff > hubLikes * 0.3) {
          // More than 30% difference
          errors.push(
            `Likes inconsistency: calculated=${result.calculatedLikes}, hub=${hubLikes}`,
          );
          consistent = false;
        }

        if (viewsDiff > hubViews * 0.3) {
          errors.push(
            `Views inconsistency: calculated=${result.calculatedViews}, hub=${hubViews}`,
          );
          consistent = false;
        }
      }

      // Update central hub with validated data
      if (verified && consistent) {
        this.centralHubData.set(productId, {
          likes: result.calculatedLikes,
          views: result.calculatedViews,
          lastValidated: new Date().toISOString(),
          confidence: result.probabilityConfidence,
        });
      }

      return { verified, consistent, errors };
    } catch (error) {
      return {
        verified: false,
        consistent: false,
        errors: [`Central hub validation error: ${error.message}`],
      };
    }
  }

  /**
   * Evaluate if item should change its value (non-zero/zero probability function)
   */
  private evaluateChangeNecessity(
    productId: string,
    result: EngagementCalculationResult,
    clicks: ClickHistoryEntry[],
  ): boolean {
    // If item isn't affected by new interactions, shouldn't change unless instructed
    const recentClicks = clicks.filter(
      (click) =>
        Date.now() - new Date(click.timestamp).getTime() < 24 * 60 * 60 * 1000, // Last 24 hours
    );

    if (recentClicks.length === 0) {
      // No recent activity, maintain existing values
      return false;
    }

    // Check if database entry already exists
    const existingEntry = this.getExistingDatabaseValues(productId);
    if (!existingEntry) {
      // No existing entry, create new values
      return true;
    }

    // Apply non-zero/zero probability function
    const changeThreshold = 0.1; // 10% change threshold
    const probabilitySum = recentClicks.reduce(
      (sum, click) => sum + click.probability,
      0,
    );

    // Non-zero probability indicates change is warranted
    if (probabilitySum > changeThreshold) {
      return true;
    }

    // Zero or near-zero probability - maintain existing values
    return false;
  }

  /**
   * Helper methods
   */
  private detectClickPatterns(
    clicks: ClickHistoryEntry[],
  ): ClickHistoryEntry[] {
    // Detect suspicious patterns (bot behavior, spam, etc.)
    const userActivityMap = new Map<string, ClickHistoryEntry[]>();

    clicks.forEach((click) => {
      if (!userActivityMap.has(click.userId)) {
        userActivityMap.set(click.userId, []);
      }
      userActivityMap.get(click.userId)!.push(click);
    });

    // Mark suspicious activity
    userActivityMap.forEach((userClicks, userId) => {
      const rapidClicks = userClicks.filter(
        (click, index) =>
          index > 0 &&
          new Date(click.timestamp).getTime() -
            new Date(userClicks[index - 1].timestamp).getTime() <
            1000, // Less than 1 second apart
      );

      if (rapidClicks.length > 3) {
        rapidClicks.forEach((click) => {
          click.validationStatus = "disputed";
        });
      }
    });

    return clicks;
  }

  private async calculateAIWeightFactor(
    userId: string,
    actionType: string,
  ): Promise<number> {
    // Calculate AI weight based on user history and action type
    const baseWeight = 1.0;
    const userFolder = this.accountFolders.get(userId);

    if (!userFolder) return baseWeight;

    // Factor in user's historical accuracy
    const totalActions = userFolder.clickHistory.length;
    const validActions = userFolder.clickHistory.filter(
      (click) => click.validationStatus === "confirmed",
    ).length;

    const accuracyRatio = totalActions > 0 ? validActions / totalActions : 1;

    return baseWeight * accuracyRatio;
  }

  private async calculateAIWeightAgainstFactoring(
    click: ClickHistoryEntry,
  ): Promise<number> {
    // Weight against all AI factoring to bounce back events
    let weight = click.aiWeightFactor;

    // Adjust based on validation status
    switch (click.validationStatus) {
      case "confirmed":
        weight *= 1.2;
        break;
      case "disputed":
        weight *= 0.5;
        break;
      case "error":
        weight *= 0.1;
        break;
      default:
        weight *= 1.0;
    }

    return weight;
  }

  private async bounceBackToCentralHub(
    click: ClickHistoryEntry,
    coinFlip: "heads" | "tails",
    extractedValue: number,
    aiWeight: number,
  ): Promise<{ finalValue: number; adjustedWeight: number }> {
    // Bounce back to central hub to ensure true values
    try {
      const hubResponse = await AICentralCommand.processCommand({
        type: "VALIDATE_ENGAGEMENT_VALUE",
        payload: { click, coinFlip, extractedValue, aiWeight },
        priority: "high",
        source: "engagement_calculator",
        timestamp: new Date().toISOString(),
      });

      if (hubResponse.success) {
        return {
          finalValue: hubResponse.data?.validatedValue || extractedValue,
          adjustedWeight: hubResponse.data?.adjustedWeight || aiWeight,
        };
      }
    } catch (error) {
      console.error("Central hub bounce back error:", error);
    }

    // Fallback to original values
    return { finalValue: extractedValue, adjustedWeight: aiWeight };
  }

  private calculateProbabilityScore(folder: AccountEngagementFolder): number {
    const totalActions = folder.clickHistory.length;
    if (totalActions === 0) return 0;

    const validActions = folder.clickHistory.filter(
      (click) => click.validationStatus === "confirmed",
    ).length;

    return (validActions / totalActions) * 100;
  }

  private async performIndirectSearch(productId: string): Promise<any> {
    // Search through related collections, user accounts, etc.
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const product = products.find((p: any) => p.id === productId);

    if (product) {
      return {
        likes: product.likes || 0,
        views: product.views || 0,
        source: "indirect_product_search",
      };
    }

    return null;
  }

  private getExistingDatabaseValues(productId: string): any {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const product = products.find((p: any) => p.id === productId);

    if (product) {
      return {
        likes: product.likes || 0,
        views: product.views || 0,
      };
    }

    return null;
  }

  private async storeFinalResult(
    productId: string,
    result: EngagementCalculationResult,
  ): Promise<void> {
    // Store the calculated result in database
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = products.findIndex((p: any) => p.id === productId);

    if (productIndex !== -1) {
      products[productIndex].likes = result.calculatedLikes;
      products[productIndex].views = result.calculatedViews;
      products[productIndex].lastEngagementUpdate = new Date().toISOString();
      products[productIndex].engagementConfidence =
        result.probabilityConfidence;

      localStorage.setItem("products", JSON.stringify(products));
    }

    // Store calculation details
    const calculationHistory = JSON.parse(
      localStorage.getItem("engagementCalculations") || "[]",
    );
    calculationHistory.push({
      productId,
      result,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 1000 calculations
    if (calculationHistory.length > 1000) {
      calculationHistory.splice(0, calculationHistory.length - 1000);
    }

    localStorage.setItem(
      "engagementCalculations",
      JSON.stringify(calculationHistory),
    );
  }

  private startCentralHubValidation(): void {
    // Validate central hub every 30 seconds
    this.validationInterval = setInterval(() => {
      this.validateCentralHubConsistency();
    }, 30000);
  }

  private async validateCentralHubConsistency(): Promise<void> {
    // Ensure central hub data consistency
    this.accountFolders.forEach(async (folder, accountId) => {
      if (folder.centralHubStatus === "out_of_sync") {
        try {
          await this.syncWithCentralHub(accountId, folder);
          folder.centralHubStatus = "synced";
          folder.lastValidated = new Date().toISOString();
        } catch (error) {
          folder.centralHubStatus = "error";
          console.error(`Central hub sync error for ${accountId}:`, error);
        }
      }
    });
  }

  private async syncWithCentralHub(
    accountId: string,
    folder: AccountEngagementFolder,
  ): Promise<void> {
    // Sync account folder with central hub
    await AICentralCommand.processCommand({
      type: "SYNC_ACCOUNT_ENGAGEMENT_FOLDER",
      payload: { accountId, folder },
      priority: "medium",
      source: "engagement_calculator",
      timestamp: new Date().toISOString(),
    });
  }

  private saveAccountFolder(
    userId: string,
    folder: AccountEngagementFolder,
  ): void {
    this.accountFolders.set(userId, folder);
    this.saveAccountFolders();
  }

  private loadAccountFolders(): void {
    try {
      const saved = localStorage.getItem("accountEngagementFolders");
      if (saved) {
        const foldersArray = JSON.parse(saved);
        this.accountFolders = new Map(foldersArray);
      }
    } catch (error) {
      console.error("Error loading account folders:", error);
    }
  }

  private saveAccountFolders(): void {
    try {
      const foldersArray = Array.from(this.accountFolders.entries());
      localStorage.setItem(
        "accountEngagementFolders",
        JSON.stringify(foldersArray),
      );
    } catch (error) {
      console.error("Error saving account folders:", error);
    }
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

  private getClientIP(): string {
    return "127.0.0.1"; // In real implementation, get actual IP
  }

  /**
   * Public API methods
   */
  async getProductEngagement(
    productId: string,
    collectionId: string,
  ): Promise<{ likes: number; views: number; confidence: number }> {
    const result = await this.calculateEngagement(productId, collectionId);
    return {
      likes: result.calculatedLikes,
      views: result.calculatedViews,
      confidence: result.probabilityConfidence,
    };
  }

  async trackLike(
    userId: string,
    productId: string,
    collectionId: string,
  ): Promise<void> {
    await this.trackClickInteraction(userId, productId, collectionId, "like");
  }

  async trackView(
    userId: string,
    productId: string,
    collectionId: string,
  ): Promise<void> {
    await this.trackClickInteraction(userId, productId, collectionId, "view");
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.validationInterval) {
      clearInterval(this.validationInterval);
    }
    this.saveAccountFolders();
  }
}

// Export singleton instance
export const AdvancedEngagementCalculator =
  new AdvancedEngagementCalculatorService();
export default AdvancedEngagementCalculator;
