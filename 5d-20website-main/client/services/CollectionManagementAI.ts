interface Collection {
  id: string;
  name: string;
  description: string;
  category: string;
  ownerId: string;
  items: string[];
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  aiOptimized: boolean;
  aiSuggestions: string[];
  analytics: {
    views: number;
    likes: number;
    shares: number;
    conversionRate: number;
  };
}

interface AICollectionOptimization {
  suggestedName: string;
  suggestedDescription: string;
  suggestedTags: string[];
  organizationSuggestions: string[];
  crossSellingOpportunities: string[];
  marketingTips: string[];
}

interface CollectionAnalytics {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  averageConversionRate: number;
  topPerformingCollections: Collection[];
  underperformingCollections: Collection[];
  categoryPerformance: { [category: string]: number };
  recommendations: string[];
}

interface CollectionCreationData {
  name: string;
  description: string;
  category: string;
  ownerId: string;
  isPublic: boolean;
  initialItems?: string[];
}

interface CollectionResult {
  success: boolean;
  collection?: Collection;
  error?: string;
  suggestions?: string[];
}

class CollectionManagementAI {
  private static instance: CollectionManagementAI;

  static getInstance(): CollectionManagementAI {
    if (!CollectionManagementAI.instance) {
      CollectionManagementAI.instance = new CollectionManagementAI();
    }
    return CollectionManagementAI.instance;
  }

  /**
   * Create an AI-optimized collection
   */
  async createAIOptimizedCollection(
    data: CollectionCreationData,
  ): Promise<CollectionResult> {
    try {
      // AI optimization for collection
      const optimization = await this.generateAIOptimization(data);

      const collection: Collection = {
        id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: optimization.suggestedName || data.name,
        description: optimization.suggestedDescription || data.description,
        category: data.category,
        ownerId: data.ownerId,
        items: data.initialItems || [],
        isPublic: data.isPublic,
        tags: optimization.suggestedTags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiOptimized: true,
        aiSuggestions: optimization.organizationSuggestions,
        analytics: {
          views: 0,
          likes: 0,
          shares: 0,
          conversionRate: 0,
        },
      };

      // Save collection
      this.saveCollection(collection);

      // Log AI collection creation
      this.logAIActivity("collection_created", collection.id, data.ownerId);

      return {
        success: true,
        collection: collection,
        suggestions: [
          `Collection optimized with AI suggestions`,
          `Added ${optimization.suggestedTags.length} relevant tags`,
          ...optimization.marketingTips.slice(0, 3),
        ],
      };
    } catch (error) {
      console.error("Error creating AI-optimized collection:", error);
      return {
        success: false,
        error: "Failed to create AI-optimized collection",
      };
    }
  }

  /**
   * Auto-organize existing collection with AI
   */
  async autoOrganizeCollection(collectionId: string): Promise<{
    success: boolean;
    changes: string[];
    error?: string;
  }> {
    try {
      const collection = this.getCollection(collectionId);
      if (!collection) {
        return {
          success: false,
          changes: [],
          error: "Collection not found",
        };
      }

      const changes: string[] = [];

      // Get all items in collection
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const collectionItems = products.filter((p: any) =>
        collection.items.includes(p.id),
      );

      // AI-based organization
      const organizedItems = this.organizeItemsWithAI(collectionItems);

      // Update collection order
      collection.items = organizedItems.map((item: any) => item.id);
      changes.push(`Reorganized ${organizedItems.length} items by AI logic`);

      // AI tag suggestions
      const newTags = this.generateTagsFromItems(collectionItems);
      const addedTags = newTags.filter((tag) => !collection.tags.includes(tag));
      if (addedTags.length > 0) {
        collection.tags.push(...addedTags);
        changes.push(
          `Added ${addedTags.length} new tags: ${addedTags.join(", ")}`,
        );
      }

      // AI description optimization
      const optimizedDescription = this.generateOptimizedDescription(
        collection,
        collectionItems,
      );
      if (optimizedDescription !== collection.description) {
        collection.description = optimizedDescription;
        changes.push("Updated description with AI optimization");
      }

      // Update collection
      collection.updatedAt = new Date().toISOString();
      collection.aiOptimized = true;
      this.updateCollection(collection);

      // Log activity
      this.logAIActivity(
        "collection_organized",
        collectionId,
        collection.ownerId,
      );

      return {
        success: true,
        changes: changes,
      };
    } catch (error) {
      console.error("Error auto-organizing collection:", error);
      return {
        success: false,
        changes: [],
        error: "Failed to auto-organize collection",
      };
    }
  }

  /**
   * Get AI suggestions for collection improvement
   */
  async getCollectionSuggestions(collectionId: string): Promise<{
    suggestions: string[];
    crossSellingOpportunities: string[];
    marketingTips: string[];
    performanceInsights: string[];
  }> {
    try {
      const collection = this.getCollection(collectionId);
      if (!collection) {
        return {
          suggestions: ["Collection not found"],
          crossSellingOpportunities: [],
          marketingTips: [],
          performanceInsights: [],
        };
      }

      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const collectionItems = products.filter((p: any) =>
        collection.items.includes(p.id),
      );

      const suggestions = this.generateCollectionSuggestions(
        collection,
        collectionItems,
      );
      const crossSelling = this.findCrossSellingOpportunities(
        collection,
        collectionItems,
      );
      const marketing = this.generateMarketingTips(collection, collectionItems);
      const performance = this.analyzePerformance(collection);

      return {
        suggestions: suggestions,
        crossSellingOpportunities: crossSelling,
        marketingTips: marketing,
        performanceInsights: performance,
      };
    } catch (error) {
      console.error("Error getting collection suggestions:", error);
      return {
        suggestions: ["Error generating suggestions"],
        crossSellingOpportunities: [],
        marketingTips: [],
        performanceInsights: [],
      };
    }
  }

  /**
   * Auto-fix collection issues with AI
   */
  async autoFixCollection(collectionId: string): Promise<{
    success: boolean;
    fixesApplied: string[];
    error?: string;
  }> {
    try {
      const collection = this.getCollection(collectionId);
      if (!collection) {
        return {
          success: false,
          fixesApplied: [],
          error: "Collection not found",
        };
      }

      const fixes: string[] = [];

      // Fix missing description
      if (!collection.description || collection.description.length < 20) {
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        const collectionItems = products.filter((p: any) =>
          collection.items.includes(p.id),
        );
        collection.description = this.generateOptimizedDescription(
          collection,
          collectionItems,
        );
        fixes.push("Generated AI description");
      }

      // Fix missing tags
      if (collection.tags.length < 3) {
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        const collectionItems = products.filter((p: any) =>
          collection.items.includes(p.id),
        );
        const newTags = this.generateTagsFromItems(collectionItems);
        collection.tags = [...new Set([...collection.tags, ...newTags])];
        fixes.push(`Added ${newTags.length} AI-generated tags`);
      }

      // Fix empty collections
      if (collection.items.length === 0) {
        const suggestedItems = this.findSuggestedItems(collection);
        if (suggestedItems.length > 0) {
          fixes.push(
            `Found ${suggestedItems.length} suggested items for empty collection`,
          );
        }
      }

      // Fix duplicate items
      const uniqueItems = [...new Set(collection.items)];
      if (uniqueItems.length !== collection.items.length) {
        collection.items = uniqueItems;
        fixes.push("Removed duplicate items");
      }

      // Remove items that no longer exist
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const existingProductIds = products.map((p: any) => p.id);
      const validItems = collection.items.filter((itemId) =>
        existingProductIds.includes(itemId),
      );
      if (validItems.length !== collection.items.length) {
        const removedCount = collection.items.length - validItems.length;
        collection.items = validItems;
        fixes.push(`Removed ${removedCount} non-existent items`);
      }

      // Update collection
      if (fixes.length > 0) {
        collection.updatedAt = new Date().toISOString();
        collection.aiOptimized = true;
        this.updateCollection(collection);

        // Log activity
        this.logAIActivity(
          "collection_fixed",
          collectionId,
          collection.ownerId,
        );
      }

      return {
        success: true,
        fixesApplied: fixes,
      };
    } catch (error) {
      console.error("Error auto-fixing collection:", error);
      return {
        success: false,
        fixesApplied: [],
        error: "Failed to auto-fix collection",
      };
    }
  }

  /**
   * Get collection analytics and insights
   */
  getCollectionAnalytics(ownerId?: string): CollectionAnalytics {
    try {
      const collections = this.getAllCollections();
      const userCollections = ownerId
        ? collections.filter((c: Collection) => c.ownerId === ownerId)
        : collections;

      const analytics: CollectionAnalytics = {
        totalViews: userCollections.reduce(
          (sum, c) => sum + c.analytics.views,
          0,
        ),
        totalLikes: userCollections.reduce(
          (sum, c) => sum + c.analytics.likes,
          0,
        ),
        totalShares: userCollections.reduce(
          (sum, c) => sum + c.analytics.shares,
          0,
        ),
        averageConversionRate:
          userCollections.length > 0
            ? userCollections.reduce(
                (sum, c) => sum + c.analytics.conversionRate,
                0,
              ) / userCollections.length
            : 0,
        topPerformingCollections: userCollections
          .sort((a, b) => b.analytics.views - a.analytics.views)
          .slice(0, 5),
        underperformingCollections: userCollections
          .filter((c) => c.analytics.views < 10 && c.items.length > 0)
          .slice(0, 5),
        categoryPerformance: this.getCategoryPerformance(userCollections),
        recommendations: this.generateAnalyticsRecommendations(userCollections),
      };

      return analytics;
    } catch (error) {
      console.error("Error getting collection analytics:", error);
      return {
        totalViews: 0,
        totalLikes: 0,
        totalShares: 0,
        averageConversionRate: 0,
        topPerformingCollections: [],
        underperformingCollections: [],
        categoryPerformance: {},
        recommendations: ["Error loading analytics"],
      };
    }
  }

  /**
   * Bulk organize all collections for a user
   */
  async bulkOptimizeCollections(ownerId: string): Promise<{
    success: boolean;
    optimizedCount: number;
    errors: string[];
  }> {
    try {
      const collections = this.getAllCollections();
      const userCollections = collections.filter(
        (c: Collection) => c.ownerId === ownerId,
      );

      let optimizedCount = 0;
      const errors: string[] = [];

      for (const collection of userCollections) {
        try {
          const result = await this.autoOrganizeCollection(collection.id);
          if (result.success) {
            optimizedCount++;
          } else {
            errors.push(
              `Failed to optimize ${collection.name}: ${result.error}`,
            );
          }
        } catch (error) {
          errors.push(`Error optimizing ${collection.name}: ${error}`);
        }
      }

      return {
        success: true,
        optimizedCount: optimizedCount,
        errors: errors,
      };
    } catch (error) {
      console.error("Error bulk optimizing collections:", error);
      return {
        success: false,
        optimizedCount: 0,
        errors: ["Failed to bulk optimize collections"],
      };
    }
  }

  // Private helper methods

  private async generateAIOptimization(
    data: CollectionCreationData,
  ): Promise<AICollectionOptimization> {
    // Simulate AI optimization
    const categoryKeywords: { [key: string]: string[] } = {
      jewelry: ["elegant", "luxury", "handcrafted", "timeless", "precious"],
      clothing: ["fashion", "trendy", "comfortable", "stylish", "seasonal"],
      beauty: ["glowing", "natural", "premium", "skincare", "makeup"],
      accessories: ["functional", "stylish", "matching", "versatile", "chic"],
      vintage: ["retro", "classic", "unique", "antique", "rare"],
      home: ["cozy", "modern", "functional", "decorative", "lifestyle"],
    };

    const keywords =
      categoryKeywords[data.category.toLowerCase()] ||
      categoryKeywords.clothing;

    return {
      suggestedName: this.optimizeName(data.name, keywords),
      suggestedDescription: this.generateDescription(data, keywords),
      suggestedTags: this.generateTags(data.category, keywords),
      organizationSuggestions: [
        "Group items by color scheme",
        "Organize by price range",
        "Create seasonal subcategories",
        "Group complementary items together",
      ],
      crossSellingOpportunities: [
        "Bundle similar items for discounts",
        "Suggest matching accessories",
        "Create complete outfit sets",
        "Recommend seasonal pairings",
      ],
      marketingTips: [
        "Use high-quality images for all items",
        "Add detailed descriptions with keywords",
        "Share on social media regularly",
        "Create seasonal promotions",
        "Engage with customer comments",
      ],
    };
  }

  private optimizeName(originalName: string, keywords: string[]): string {
    if (originalName.length < 3) {
      return `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} Collection`;
    }

    // Add a keyword if not present
    const lowerName = originalName.toLowerCase();
    const hasKeyword = keywords.some((keyword) =>
      lowerName.includes(keyword.toLowerCase()),
    );

    if (!hasKeyword && originalName.length < 30) {
      return `${originalName} - ${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)}`;
    }

    return originalName;
  }

  private generateDescription(
    data: CollectionCreationData,
    keywords: string[],
  ): string {
    if (data.description && data.description.length > 20) {
      return data.description;
    }

    return `Discover our curated ${data.category.toLowerCase()} collection featuring ${keywords.slice(0, 3).join(", ")} pieces. Each item is carefully selected to offer exceptional quality and style. Perfect for those who appreciate ${keywords[0]} designs and ${keywords[1]} craftsmanship.`;
  }

  private generateTags(category: string, keywords: string[]): string[] {
    const baseTags = [category.toLowerCase(), "curated", "quality"];
    const categoryTags = keywords.slice(0, 4);
    const trendingTags = ["trending", "popular", "bestseller", "featured"];

    return [...new Set([...baseTags, ...categoryTags, ...trendingTags])].slice(
      0,
      8,
    );
  }

  private organizeItemsWithAI(items: any[]): any[] {
    // AI logic for organizing items
    return items.sort((a, b) => {
      // Sort by category first
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }

      // Then by price (high to low)
      if (a.price !== b.price) {
        return b.price - a.price;
      }

      // Finally by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  private generateTagsFromItems(items: any[]): string[] {
    const tags = new Set<string>();

    items.forEach((item) => {
      // Add category
      tags.add(item.category.toLowerCase());

      // Add price range
      if (item.price < 25) tags.add("affordable");
      else if (item.price < 100) tags.add("mid-range");
      else tags.add("luxury");

      // Add condition
      if (item.condition) tags.add(item.condition);

      // Add any existing tags
      if (item.tags) {
        item.tags.forEach((tag: string) => tags.add(tag.toLowerCase()));
      }
    });

    return Array.from(tags).slice(0, 10);
  }

  private generateOptimizedDescription(
    collection: Collection,
    items: any[],
  ): string {
    if (items.length === 0) {
      return `${collection.name} - A carefully curated collection coming soon.`;
    }

    const categories = [...new Set(items.map((item) => item.category))];
    const avgPrice =
      items.reduce((sum, item) => sum + item.price, 0) / items.length;
    const priceRange =
      avgPrice < 25 ? "affordable" : avgPrice < 100 ? "mid-range" : "luxury";

    return `${collection.name} features ${items.length} ${priceRange} ${categories.join(" & ").toLowerCase()} items. This collection offers exceptional value with prices ranging from $${Math.min(...items.map((i) => i.price))} to $${Math.max(...items.map((i) => i.price))}. Each piece is carefully selected for quality and style.`;
  }

  private generateCollectionSuggestions(
    collection: Collection,
    items: any[],
  ): string[] {
    const suggestions: string[] = [];

    if (items.length < 5) {
      suggestions.push("Add more items to reach the recommended 5+ items");
    }

    if (collection.tags.length < 5) {
      suggestions.push("Add more tags to improve discoverability");
    }

    if (!collection.isPublic) {
      suggestions.push("Make collection public to increase visibility");
    }

    if (collection.analytics.views < 50) {
      suggestions.push("Share collection on social media to increase views");
    }

    const categories = [...new Set(items.map((item) => item.category))];
    if (categories.length > 3) {
      suggestions.push("Consider splitting into multiple focused collections");
    }

    return suggestions;
  }

  private findCrossSellingOpportunities(
    collection: Collection,
    items: any[],
  ): string[] {
    const opportunities: string[] = [];

    const categories = [...new Set(items.map((item) => item.category))];

    if (
      categories.includes("Clothing") &&
      !categories.includes("Accessories")
    ) {
      opportunities.push("Add accessories to complement clothing items");
    }

    if (categories.includes("Jewelry") && !categories.includes("Beauty")) {
      opportunities.push("Add beauty products for complete styling");
    }

    if (items.length > 3) {
      opportunities.push("Create bundle deals for multiple items");
    }

    const priceRanges = this.categorizeByPrice(items);
    if (priceRanges.luxury > 0 && priceRanges.affordable > 0) {
      opportunities.push("Create tiered pricing options for different budgets");
    }

    return opportunities;
  }

  private generateMarketingTips(
    collection: Collection,
    items: any[],
  ): string[] {
    const tips: string[] = [];

    if (collection.analytics.views < 100) {
      tips.push("Use trending hashtags to increase visibility");
    }

    if (items.length > 0) {
      tips.push("Create lifestyle photos showing items in use");
    }

    if (collection.isPublic) {
      tips.push("Engage with customers in comments to build community");
    }

    tips.push("Update collection regularly with new items");
    tips.push("Create seasonal promotions and limited-time offers");

    return tips;
  }

  private analyzePerformance(collection: Collection): string[] {
    const insights: string[] = [];

    if (collection.analytics.views > 100) {
      insights.push("High view count indicates good visibility");
    } else {
      insights.push("Low view count - consider improving SEO and promotion");
    }

    if (collection.analytics.conversionRate > 5) {
      insights.push("Good conversion rate indicates effective presentation");
    } else {
      insights.push("Low conversion rate - optimize images and descriptions");
    }

    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(collection.createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysSinceCreation > 30 && collection.analytics.views < 50) {
      insights.push("Collection may need refreshing or re-promotion");
    }

    return insights;
  }

  private findSuggestedItems(collection: Collection): any[] {
    // Find items that might fit this collection based on category and tags
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");

    return allProducts
      .filter((item: any) => {
        return (
          item.category.toLowerCase() === collection.category.toLowerCase() &&
          !collection.items.includes(item.id)
        );
      })
      .slice(0, 5);
  }

  private getCategoryPerformance(collections: Collection[]): {
    [category: string]: number;
  } {
    const performance: { [category: string]: number } = {};

    collections.forEach((collection) => {
      if (!performance[collection.category]) {
        performance[collection.category] = 0;
      }
      performance[collection.category] += collection.analytics.views;
    });

    return performance;
  }

  private generateAnalyticsRecommendations(
    collections: Collection[],
  ): string[] {
    const recommendations: string[] = [];

    if (collections.length === 0) {
      recommendations.push("Create your first collection to get started");
      return recommendations;
    }

    const totalViews = collections.reduce(
      (sum, c) => sum + c.analytics.views,
      0,
    );
    const avgViews = totalViews / collections.length;

    if (avgViews < 20) {
      recommendations.push("Focus on promoting collections to increase views");
    }

    const publicCollections = collections.filter((c) => c.isPublic);
    if (publicCollections.length < collections.length * 0.7) {
      recommendations.push(
        "Make more collections public to increase visibility",
      );
    }

    const aiOptimized = collections.filter((c) => c.aiOptimized);
    if (aiOptimized.length < collections.length * 0.5) {
      recommendations.push("Use AI optimization on more collections");
    }

    return recommendations;
  }

  private categorizeByPrice(items: any[]): {
    affordable: number;
    midRange: number;
    luxury: number;
  } {
    const ranges = { affordable: 0, midRange: 0, luxury: 0 };

    items.forEach((item) => {
      if (item.price < 25) ranges.affordable++;
      else if (item.price < 100) ranges.midRange++;
      else ranges.luxury++;
    });

    return ranges;
  }

  private getCollection(collectionId: string): Collection | null {
    try {
      const collections = this.getAllCollections();
      return collections.find((c: Collection) => c.id === collectionId) || null;
    } catch (error) {
      console.error("Error getting collection:", error);
      return null;
    }
  }

  private getAllCollections(): Collection[] {
    try {
      return JSON.parse(localStorage.getItem("collections") || "[]");
    } catch (error) {
      console.error("Error loading collections:", error);
      return [];
    }
  }

  private saveCollection(collection: Collection): void {
    try {
      const collections = this.getAllCollections();
      collections.push(collection);
      localStorage.setItem("collections", JSON.stringify(collections));
    } catch (error) {
      console.error("Error saving collection:", error);
      throw error;
    }
  }

  private updateCollection(collection: Collection): void {
    try {
      const collections = this.getAllCollections();
      const index = collections.findIndex(
        (c: Collection) => c.id === collection.id,
      );

      if (index !== -1) {
        collections[index] = collection;
        localStorage.setItem("collections", JSON.stringify(collections));
      }
    } catch (error) {
      console.error("Error updating collection:", error);
      throw error;
    }
  }

  private logAIActivity(
    activity: string,
    collectionId: string,
    userId: string,
  ): void {
    try {
      const logs = JSON.parse(localStorage.getItem("collectionAILogs") || "[]");

      const log = {
        id: `log_${Date.now()}`,
        activity: activity,
        collectionId: collectionId,
        userId: userId,
        timestamp: new Date().toISOString(),
      };

      logs.push(log);

      // Keep only last 200 logs
      if (logs.length > 200) {
        logs.splice(0, logs.length - 200);
      }

      localStorage.setItem("collectionAILogs", JSON.stringify(logs));
    } catch (error) {
      console.error("Error logging AI activity:", error);
    }
  }
}

export default CollectionManagementAI.getInstance();
