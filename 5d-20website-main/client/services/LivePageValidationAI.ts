/**
 * Live Page Validation AI
 * Reads cards on the page and validates data against database in real-time
 * Detects wrong likes/views and corrects them automatically
 */

import AICentralCommand from "./AICentralCommand";
import { AdvancedEngagementCalculator } from "./AdvancedEngagementCalculator";

export interface PageValidationResult {
  pageUrl: string;
  totalCards: number;
  validCards: number;
  invalidCards: number;
  errors: Array<{
    cardId: string;
    cardTitle: string;
    errorType: string;
    expected: any;
    actual: any;
    severity: "low" | "medium" | "high" | "critical";
  }>;
  corrections: Array<{
    cardId: string;
    field: string;
    oldValue: any;
    newValue: any;
    corrected: boolean;
  }>;
  databaseMismatches: Array<{
    productId: string;
    field: string;
    pageValue: any;
    databaseValue: any;
  }>;
  timestamp: string;
}

export interface CardValidationData {
  cardId: string;
  title: string;
  likes: number;
  views: number;
  itemCount: number;
  category: string;
  productIds: string[];
  domElement?: HTMLElement;
  dataSource: "page_dom" | "database" | "computed";
}

class LivePageValidationAIService {
  private validationInterval: NodeJS.Timeout | null = null;
  private pageObserver: MutationObserver | null = null;
  private validationResults: Map<string, PageValidationResult> = new Map();
  private isValidating = false;
  private correctionQueue: Array<{
    cardId: string;
    corrections: any;
    timestamp: string;
  }> = [];

  constructor() {
    this.startLiveValidation();
    this.setupPageObserver();
  }

  /**
   * Start live validation system that runs every 10 seconds
   */
  private startLiveValidation(): void {
    // Validate page every 10 seconds
    this.validationInterval = setInterval(() => {
      this.validateCurrentPage();
    }, 10000);

    // Also validate on page load
    setTimeout(() => {
      this.validateCurrentPage();
    }, 2000);
  }

  /**
   * Setup mutation observer to detect DOM changes
   */
  private setupPageObserver(): void {
    if (typeof window === "undefined" || !document || !document.body) return;

    this.pageObserver = new MutationObserver((mutations) => {
      try {
        const hasRelevantChanges = mutations.some((mutation) => {
          return Array.from(mutation.addedNodes).some((node) => {
            // Only check Element nodes, not Text or Comment nodes
            if (node.nodeType !== Node.ELEMENT_NODE) {
              return false;
            }

            const element = node as Element;
            // Ensure element has necessary methods before calling them
            if (!element.classList || !element.querySelector) {
              return false;
            }

            return (
              element.classList.contains("card") ||
              element.classList.contains("collection-card") ||
              element.querySelector(".card") !== null ||
              element.querySelector(".collection-card") !== null
            );
          });
        });

        if (hasRelevantChanges) {
          // Delay validation to allow DOM to settle
          setTimeout(() => {
            this.validateCurrentPage().catch(console.error);
          }, 1500);
        }
      } catch (error) {
        console.error("Error in page observer:", error);
      }
    });

    this.pageObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-likes", "data-views", "data-count"],
    });
  }

  /**
   * Validate the current page by reading all cards
   */
  async validateCurrentPage(): Promise<PageValidationResult> {
    if (this.isValidating) {
      return (
        this.validationResults.get(window.location.pathname) ||
        this.createEmptyResult()
      );
    }

    this.isValidating = true;

    try {
      const pageUrl = window.location.pathname;
      console.log(`🔍 Live Page AI: Validating ${pageUrl}`);

      // Read all cards from the DOM
      const cardsData = this.readCardsFromDOM();

      // Validate against database
      const validationResult = await this.validateCardsAgainstDatabase(
        cardsData,
        pageUrl,
      );

      // Apply corrections if needed
      await this.applyCorrections(validationResult);

      // Store results
      this.validationResults.set(pageUrl, validationResult);

      // Report to central AI
      await this.reportValidationResults(validationResult);

      console.log(
        `✅ Live Page AI: Validation complete - ${validationResult.validCards}/${validationResult.totalCards} cards valid`,
      );

      return validationResult;
    } catch (error) {
      console.error("Live Page Validation Error:", error);
      return this.createEmptyResult();
    } finally {
      this.isValidating = false;
    }
  }

  /**
   * Read all collection/product cards from the DOM
   */
  private readCardsFromDOM(): CardValidationData[] {
    const cards: CardValidationData[] = [];

    try {
      // Ensure document is available
      if (!document || typeof document.querySelectorAll !== "function") {
        console.warn("Document not available for reading cards");
        return cards;
      }

      // Find collection cards
      const cardElements = document.querySelectorAll(
        '[data-collection-id], .collection-card, [class*="card"]',
      );

      cardElements.forEach((element, index) => {
        try {
          const cardData = this.extractCardData(element as HTMLElement, index);
          if (cardData) {
            cards.push(cardData);
          }
        } catch (error) {
          console.error(`Error reading card ${index}:`, error);
        }
      });

      // Also check for beauty collection specifically
      if (window.location.pathname.includes("beauty")) {
        const beautyCards = this.extractBeautyCollectionData();
        cards.push(...beautyCards);
      }
    } catch (error) {
      console.error("Error reading cards from DOM:", error);
    }

    return cards;
  }

  /**
   * Extract data from a card element
   */
  private extractCardData(
    element: HTMLElement,
    index: number,
  ): CardValidationData | null {
    try {
      // Get card title
      const titleElement = element.querySelector(
        "h3, h2, .card-title, [data-title]",
      );
      const title = titleElement?.textContent?.trim() || `Card ${index + 1}`;

      // Get likes
      const likesElement = element.querySelector("[data-likes], .likes-count");
      const likesText = likesElement?.textContent || "0";
      const likes = this.extractNumber(likesText);

      // Get views
      const viewsElement = element.querySelector("[data-views], .views-count");
      const viewsText = viewsElement?.textContent || "0";
      const views = this.extractNumber(viewsText);

      // Get item count
      const itemCountElement = element.querySelector(
        "[data-count], .item-count, .items",
      );
      const itemCountText = itemCountElement?.textContent || "0";
      const itemCount = this.extractNumber(itemCountText);

      // Get category
      const categoryElement = element.querySelector(
        "[data-category], .category",
      );
      const category =
        categoryElement?.textContent?.trim() ||
        this.inferCategoryFromTitle(title);

      // Generate card ID
      const cardId =
        element.id ||
        `card_${title.replace(/\s+/g, "_").toLowerCase()}_${index}`;

      return {
        cardId,
        title,
        likes,
        views,
        itemCount,
        category,
        productIds: [], // Will be populated from database
        domElement: element,
        dataSource: "page_dom",
      };
    } catch (error) {
      console.error("Error extracting card data:", error);
      return null;
    }
  }

  /**
   * Extract beauty collection specific data
   */
  private extractBeautyCollectionData(): CardValidationData[] {
    const beautyCards: CardValidationData[] = [];

    // Look for beauty-specific elements
    const beautyElements = document.querySelectorAll(
      '[data-category="beauty"], [class*="beauty"]',
    );

    beautyElements.forEach((element, index) => {
      const cardData = this.extractCardData(element as HTMLElement, index);
      if (cardData) {
        cardData.category = "beauty";
        beautyCards.push(cardData);
      }
    });

    return beautyCards;
  }

  /**
   * Validate cards against database
   */
  private async validateCardsAgainstDatabase(
    cards: CardValidationData[],
    pageUrl: string,
  ): Promise<PageValidationResult> {
    const result: PageValidationResult = {
      pageUrl,
      totalCards: cards.length,
      validCards: 0,
      invalidCards: 0,
      errors: [],
      corrections: [],
      databaseMismatches: [],
      timestamp: new Date().toISOString(),
    };

    for (const card of cards) {
      try {
        // Get database data for this card/collection
        const databaseData = await this.getDatabaseDataForCard(card);

        // Validate likes and views
        await this.validateEngagementData(card, databaseData, result);

        // Validate item counts
        await this.validateItemCounts(card, databaseData, result);

        // Validate category data
        await this.validateCategoryData(card, databaseData, result);

        // Check for required features
        await this.validateRequiredFeatures(card, databaseData, result);
      } catch (error) {
        result.errors.push({
          cardId: card.cardId,
          cardTitle: card.title,
          errorType: "validation_error",
          expected: "successful_validation",
          actual: error.message,
          severity: "high",
        });
        result.invalidCards++;
      }
    }

    result.validCards = result.totalCards - result.invalidCards;
    return result;
  }

  /**
   * Get database data for a card with enhanced AI integration
   */
  private async getDatabaseDataForCard(card: CardValidationData): Promise<any> {
    try {
      // Get products database
      const products = JSON.parse(localStorage.getItem("products") || "[]");

      // Get collections database
      const collections = JSON.parse(
        localStorage.getItem("defaultCollections") || "[]",
      );

      // Get guest uploads
      const guestUploads = JSON.parse(
        localStorage.getItem("guestUploads") || "[]",
      );

      // Enhanced matching for collections
      let matchingCollection = collections.find(
        (col: any) =>
          col.name.toLowerCase().includes(card.category.toLowerCase()) ||
          col.name.toLowerCase().includes(card.title.toLowerCase()) ||
          card.title.toLowerCase().includes(col.name.toLowerCase()),
      );

      // Special handling for specific collections
      if (!matchingCollection) {
        if (
          card.title.toLowerCase().includes("beauty") ||
          card.category.toLowerCase().includes("beauty")
        ) {
          matchingCollection = {
            id: "beauty-collection",
            name: "Beauty Collection",
            category: "beauty",
          };
        } else if (card.title.toLowerCase().includes("jewelry")) {
          matchingCollection = {
            id: "jewelry-collection",
            name: "Jewelry Collection",
            category: "jewelry",
          };
        }
      }

      // Enhanced product filtering for better accuracy
      const categoryKeywords = this.getCategoryKeywords(
        card.category,
        card.title,
      );
      const categoryProducts = products.filter((product: any) => {
        return categoryKeywords.some(
          (keyword) =>
            product.category?.toLowerCase().includes(keyword) ||
            product.name?.toLowerCase().includes(keyword),
        );
      });

      // Include guest uploads
      const guestCategoryProducts = guestUploads.filter((upload: any) => {
        return categoryKeywords.some(
          (keyword) =>
            upload.category?.toLowerCase().includes(keyword) ||
            upload.productName?.toLowerCase().includes(keyword),
        );
      });

      // Calculate actual engagement using Advanced Engagement Calculator
      let totalLikes = 0;
      let totalViews = 0;

      // Get engagement from all products
      const allProducts = [...categoryProducts, ...guestCategoryProducts];
      for (const product of allProducts) {
        try {
          const engagement =
            await AdvancedEngagementCalculator.getProductEngagement(
              product.id,
              matchingCollection?.id || "unknown",
            );
          totalLikes += engagement.likes;
          totalViews += engagement.views;
        } catch (error) {
          // Fallback to stored likes/views
          totalLikes += product.likes || 0;
          totalViews += product.views || 0;
        }
      }

      // Use AI-enhanced item counting
      const { CollectionItemCounter } = await import("./CollectionItemCounter");
      const accurateItemCount =
        await CollectionItemCounter.getRealTimeCollectionCount(
          matchingCollection?.name || card.title,
        );

      return {
        collection: matchingCollection,
        products: allProducts,
        actualLikes: totalLikes,
        actualViews: totalViews,
        actualItemCount: Math.max(accurateItemCount, allProducts.length),
        hasRequiredFeatures: this.checkRequiredFeatures(allProducts),
        aiEnhanced: true,
      };
    } catch (error) {
      console.error("Error getting database data:", error);
      return {
        collection: null,
        products: [],
        actualLikes: 0,
        actualViews: 0,
        actualItemCount: 0,
        hasRequiredFeatures: false,
        aiEnhanced: false,
      };
    }
  }

  /**
   * Get category keywords for better matching
   */
  private getCategoryKeywords(category: string, title: string): string[] {
    const baseKeywords = [category.toLowerCase(), title.toLowerCase()];

    // Add specific keywords based on category
    const categoryMap: Record<string, string[]> = {
      beauty: [
        "beauty",
        "makeup",
        "cosmetic",
        "skincare",
        "fragrance",
        "perfume",
      ],
      jewelry: ["jewelry", "ring", "necklace", "bracelet", "earring", "watch"],
      clothing: ["clothing", "dress", "shirt", "pants", "top", "bottom"],
      accessories: ["accessory", "bag", "purse", "belt", "scarf", "hat"],
      home: ["home", "decor", "furniture", "kitchen", "bedroom", "living"],
      vintage: ["vintage", "antique", "retro", "classic", "old"],
    };

    Object.entries(categoryMap).forEach(([key, keywords]) => {
      if (
        category.toLowerCase().includes(key) ||
        title.toLowerCase().includes(key)
      ) {
        baseKeywords.push(...keywords);
      }
    });

    return [...new Set(baseKeywords)]; // Remove duplicates
  }

  /**
   * Validate engagement data (likes/views)
   */
  private async validateEngagementData(
    card: CardValidationData,
    databaseData: any,
    result: PageValidationResult,
  ): Promise<void> {
    // Check likes
    if (card.likes !== databaseData.actualLikes) {
      result.databaseMismatches.push({
        productId: card.cardId,
        field: "likes",
        pageValue: card.likes,
        databaseValue: databaseData.actualLikes,
      });

      // If page shows likes but database shows 0, it's an error
      if (card.likes > 0 && databaseData.actualLikes === 0) {
        result.errors.push({
          cardId: card.cardId,
          cardTitle: card.title,
          errorType: "false_likes",
          expected: 0,
          actual: card.likes,
          severity: "high",
        });

        // Queue correction
        result.corrections.push({
          cardId: card.cardId,
          field: "likes",
          oldValue: card.likes,
          newValue: databaseData.actualLikes,
          corrected: false,
        });
      }
    }

    // Check views
    if (card.views !== databaseData.actualViews) {
      result.databaseMismatches.push({
        productId: card.cardId,
        field: "views",
        pageValue: card.views,
        databaseValue: databaseData.actualViews,
      });

      // If page shows views but database shows 0, it's an error
      if (card.views > 0 && databaseData.actualViews === 0) {
        result.errors.push({
          cardId: card.cardId,
          cardTitle: card.title,
          errorType: "false_views",
          expected: 0,
          actual: card.views,
          severity: "high",
        });

        // Queue correction
        result.corrections.push({
          cardId: card.cardId,
          field: "views",
          oldValue: card.views,
          newValue: databaseData.actualViews,
          corrected: false,
        });
      }
    }
  }

  /**
   * Validate item counts
   */
  private async validateItemCounts(
    card: CardValidationData,
    databaseData: any,
    result: PageValidationResult,
  ): Promise<void> {
    if (card.itemCount !== databaseData.actualItemCount) {
      result.databaseMismatches.push({
        productId: card.cardId,
        field: "itemCount",
        pageValue: card.itemCount,
        databaseValue: databaseData.actualItemCount,
      });

      result.errors.push({
        cardId: card.cardId,
        cardTitle: card.title,
        errorType: "incorrect_item_count",
        expected: databaseData.actualItemCount,
        actual: card.itemCount,
        severity: "medium",
      });

      // Queue correction
      result.corrections.push({
        cardId: card.cardId,
        field: "itemCount",
        oldValue: card.itemCount,
        newValue: databaseData.actualItemCount,
        corrected: false,
      });
    }
  }

  /**
   * Validate category data
   */
  private async validateCategoryData(
    card: CardValidationData,
    databaseData: any,
    result: PageValidationResult,
  ): Promise<void> {
    // Check if category matches products
    if (databaseData.products.length === 0 && card.itemCount > 0) {
      result.errors.push({
        cardId: card.cardId,
        cardTitle: card.title,
        errorType: "category_mismatch",
        expected: "products_in_category",
        actual: "no_products_found",
        severity: "high",
      });
    }
  }

  /**
   * Validate required features
   */
  private async validateRequiredFeatures(
    card: CardValidationData,
    databaseData: any,
    result: PageValidationResult,
  ): Promise<void> {
    if (!databaseData.hasRequiredFeatures) {
      result.errors.push({
        cardId: card.cardId,
        cardTitle: card.title,
        errorType: "missing_required_features",
        expected: "required_features_present",
        actual: "missing_features",
        severity: "medium",
      });
    }
  }

  /**
   * Apply corrections to the page
   */
  private async applyCorrections(result: PageValidationResult): Promise<void> {
    for (const correction of result.corrections) {
      try {
        await this.applySingleCorrection(correction);
        correction.corrected = true;
      } catch (error) {
        console.error(
          `Error applying correction for ${correction.cardId}:`,
          error,
        );
        correction.corrected = false;
      }
    }
  }

  /**
   * Apply a single correction to the DOM
   */
  private async applySingleCorrection(correction: any): Promise<void> {
    try {
      // Find the card element
      const cardElement =
        document.getElementById(correction.cardId) ||
        document.querySelector(`[data-card-id="${correction.cardId}"]`);

      if (!cardElement) {
        console.warn(
          `Card element not found for correction: ${correction.cardId}`,
        );
        return;
      }

      // Apply correction based on field
      switch (correction.field) {
        case "likes":
          await this.updateLikesDisplay(cardElement, correction.newValue);
          break;
        case "views":
          await this.updateViewsDisplay(cardElement, correction.newValue);
          break;
        case "itemCount":
          await this.updateItemCountDisplay(cardElement, correction.newValue);
          break;
      }

      console.log(
        `✅ Corrected ${correction.field} for ${correction.cardId}: ${correction.oldValue} → ${correction.newValue}`,
      );
    } catch (error) {
      console.error("Error applying single correction:", error);
    }
  }

  /**
   * Update likes display in DOM
   */
  private async updateLikesDisplay(
    cardElement: HTMLElement,
    newValue: number,
  ): Promise<void> {
    const likesElements = cardElement.querySelectorAll(
      "[data-likes], .likes-count, .likes",
    );
    likesElements.forEach((element) => {
      if (element.textContent) {
        element.textContent = newValue.toString();
      }
    });

    // Also update data attributes
    cardElement.setAttribute("data-likes", newValue.toString());
  }

  /**
   * Update views display in DOM
   */
  private async updateViewsDisplay(
    cardElement: HTMLElement,
    newValue: number,
  ): Promise<void> {
    const viewsElements = cardElement.querySelectorAll(
      "[data-views], .views-count, .views",
    );
    viewsElements.forEach((element) => {
      if (element.textContent) {
        element.textContent = newValue.toString();
      }
    });

    // Also update data attributes
    cardElement.setAttribute("data-views", newValue.toString());
  }

  /**
   * Update item count display in DOM
   */
  private async updateItemCountDisplay(
    cardElement: HTMLElement,
    newValue: number,
  ): Promise<void> {
    const countElements = cardElement.querySelectorAll(
      "[data-count], .item-count, .items",
    );
    countElements.forEach((element) => {
      if (element.textContent) {
        const text = element.textContent;
        // Replace number while preserving "items" text
        element.textContent = text.replace(/\d+/, newValue.toString());
      }
    });

    // Also update data attributes
    cardElement.setAttribute("data-count", newValue.toString());
  }

  /**
   * Report validation results to central AI
   */
  private async reportValidationResults(
    result: PageValidationResult,
  ): Promise<void> {
    try {
      await AICentralCommand.processCommand({
        type: "PAGE_VALIDATION_COMPLETE",
        payload: {
          result,
          correctionsMade: result.corrections.filter((c) => c.corrected).length,
          errorsFound: result.errors.length,
        },
        priority: result.errors.length > 0 ? "high" : "medium",
        source: "live_page_validation_ai",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error reporting validation results:", error);
    }
  }

  /**
   * Helper methods
   */
  private extractNumber(text: string): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private inferCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("beauty")) return "beauty";
    if (lowerTitle.includes("jewelry")) return "jewelry";
    if (lowerTitle.includes("clothing")) return "clothing";
    if (lowerTitle.includes("accessories")) return "accessories";
    if (lowerTitle.includes("home")) return "home";
    return "general";
  }

  private checkRequiredFeatures(products: any[]): boolean {
    // Check if products have required features
    return products.every(
      (product) =>
        product.name &&
        product.price !== undefined &&
        product.category &&
        product.images &&
        product.images.length > 0,
    );
  }

  private createEmptyResult(): PageValidationResult {
    return {
      pageUrl: window.location.pathname,
      totalCards: 0,
      validCards: 0,
      invalidCards: 0,
      errors: [],
      corrections: [],
      databaseMismatches: [],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Public API methods
   */
  async forceValidation(): Promise<PageValidationResult> {
    return await this.validateCurrentPage();
  }

  getLastValidationResult(): PageValidationResult | null {
    return this.validationResults.get(window.location.pathname) || null;
  }

  getValidationStatus(): {
    isValidating: boolean;
    lastValidation: string | null;
    totalErrors: number;
    totalCorrections: number;
  } {
    const lastResult = this.getLastValidationResult();
    return {
      isValidating: this.isValidating,
      lastValidation: lastResult?.timestamp || null,
      totalErrors: lastResult?.errors.length || 0,
      totalCorrections: lastResult?.corrections.length || 0,
    };
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.validationInterval) {
      clearInterval(this.validationInterval);
    }
    if (this.pageObserver) {
      this.pageObserver.disconnect();
    }
  }
}

// Export singleton instance
export const LivePageValidationAI = new LivePageValidationAIService();
export default LivePageValidationAI;
