// AI Content Analyzer - Intelligent content management and categorization
import { CATEGORY_STRUCTURE } from "../data/productDatabase";
import UserDataService from "./UserDataService";

export interface ContentAnalysis {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  currentCategory: string;
  suggestedCategory: string;
  confidence: number;
  reasoning: string;
  suggestedChanges: {
    name?: string;
    description?: string;
    tags?: string[];
    price?: number;
  };
  duplicates: DuplicateItem[];
  status: "pending" | "approved" | "rejected" | "auto-applied";
  createdAt: string;
  reviewedAt?: string;
}

export interface DuplicateItem {
  id: string;
  name: string;
  image: string;
  userId: string;
  similarity: number;
  suggestedAction: "merge" | "remove" | "differentiate";
}

export interface AISuggestion {
  id: string;
  type: "category" | "duplicate" | "enhancement" | "collection-move";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  autoApplicable: boolean;
  data: any;
  userId: string;
  createdAt: string;
}

class AIContentAnalyzer {
  private analysisHistory: ContentAnalysis[] = [];
  private suggestions: AISuggestion[] = [];
  private isRunning = false;
  private analysisInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadAnalysisHistory();
    this.startPeriodicAnalysis();
  }

  // Main analysis function for user uploads
  async analyzeUserContent(
    userId: string,
    forceReanalyze = false,
  ): Promise<ContentAnalysis[]> {
    console.log(`🤖 AI: Starting content analysis for user ${userId}`);

    try {
      const userCollections = await UserDataService.getUserCollections(userId);
      const userUploads = this.getUserUploads(userId);
      const allItems = [
        ...userCollections.flatMap((c) => c.items || []),
        ...userUploads,
      ];

      const analyses: ContentAnalysis[] = [];

      for (const item of allItems) {
        if (!forceReanalyze && this.hasRecentAnalysis(item.id)) {
          continue;
        }

        const analysis = await this.analyzeItem(userId, item);
        if (analysis) {
          analyses.push(analysis);
        }
      }

      // Update analysis history
      this.analysisHistory.push(...analyses);
      this.saveAnalysisHistory();

      // Generate suggestions
      await this.generateSuggestions(userId, analyses);

      console.log(
        `🤖 AI: Completed analysis. Found ${analyses.length} items to review`,
      );
      return analyses;
    } catch (error) {
      console.error("AI Content Analysis Error:", error);
      return [];
    }
  }

  // Analyze individual item
  private async analyzeItem(
    userId: string,
    item: any,
  ): Promise<ContentAnalysis | null> {
    try {
      // Category analysis
      const categoryAnalysis = this.analyzeCategoryMatch(item);

      // Duplicate detection
      const duplicates = await this.findDuplicates(item, userId);

      // Enhancement suggestions
      const enhancements = this.suggestEnhancements(item);

      if (
        categoryAnalysis.confidence < 0.8 ||
        duplicates.length > 0 ||
        enhancements.suggestedChanges
      ) {
        return {
          id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          itemId: item.id,
          itemName: item.name,
          currentCategory: item.category || "uncategorized",
          suggestedCategory: categoryAnalysis.suggestedCategory,
          confidence: categoryAnalysis.confidence,
          reasoning: categoryAnalysis.reasoning,
          suggestedChanges: enhancements.suggestedChanges || {},
          duplicates,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error("Error analyzing item:", error);
      return null;
    }
  }

  // Analyze category matching using AI-like logic
  private analyzeCategoryMatch(item: any): {
    suggestedCategory: string;
    confidence: number;
    reasoning: string;
  } {
    const itemName = item.name?.toLowerCase() || "";
    const itemDescription = item.description?.toLowerCase() || "";
    const itemTags = (item.tags || []).join(" ").toLowerCase();
    const searchText = `${itemName} ${itemDescription} ${itemTags}`;

    // Category matching keywords
    const categoryKeywords = {
      Beauty: [
        "makeup",
        "beauty",
        "cosmetic",
        "skincare",
        "lipstick",
        "foundation",
        "mascara",
        "cologne",
        "perfume",
        "body wash",
        "lotion",
        "cream",
      ],
      "Clothing, Shoes & Accessories": [
        "dress",
        "shirt",
        "pants",
        "shoes",
        "jacket",
        "top",
        "skirt",
        "jeans",
        "shorts",
        "clothing",
        "fashion",
        "wear",
        "outfit",
      ],
      "Home & Kitchen": [
        "kitchen",
        "home",
        "cooking",
        "utensil",
        "appliance",
        "furniture",
        "decor",
        "cleaning",
        "storage",
      ],
      Jewelry: [
        "jewelry",
        "ring",
        "necklace",
        "bracelet",
        "earring",
        "gold",
        "silver",
        "diamond",
        "pendant",
      ],
    };

    let bestMatch = item.category || "Beauty";
    let highestScore = 0;
    let reasoning = "Current category seems appropriate";

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (searchText.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = category;
        reasoning = `Item contains keywords suggesting ${category}: ${keywords.filter((k) => searchText.includes(k)).join(", ")}`;
      }
    });

    // Calculate confidence based on keyword matches and current category
    const confidence = Math.min(
      0.95,
      0.3 + highestScore * 0.15 + (bestMatch === item.category ? 0.2 : 0),
    );

    return {
      suggestedCategory: bestMatch,
      confidence,
      reasoning,
    };
  }

  // Find potential duplicates
  private async findDuplicates(
    item: any,
    userId: string,
  ): Promise<DuplicateItem[]> {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const allUploads = JSON.parse(localStorage.getItem("guestUploads") || "[]");
    const duplicates: DuplicateItem[] = [];

    // Simple duplicate detection based on name similarity and price
    const itemName = item.name?.toLowerCase() || "";
    const itemPrice = parseFloat(item.price?.toString() || "0");

    // Check against other users' items
    for (const user of allUsers) {
      if (user.id === userId) continue;

      const userCollections = await UserDataService.getUserCollections(user.id);
      const userItems = userCollections.flatMap((c) => c.items || []);

      for (const otherItem of userItems) {
        const similarity = this.calculateSimilarity(item, otherItem);

        if (similarity > 0.7) {
          duplicates.push({
            id: otherItem.id,
            name: otherItem.name,
            image: otherItem.image,
            userId: user.id,
            similarity,
            suggestedAction: similarity > 0.9 ? "merge" : "differentiate",
          });
        }
      }
    }

    // Check against guest uploads
    for (const upload of allUploads) {
      const similarity = this.calculateSimilarity(item, upload);

      if (similarity > 0.7) {
        duplicates.push({
          id: upload.id,
          name: upload.productName || upload.name,
          image: upload.images?.[0] || upload.image,
          userId: "guest",
          similarity,
          suggestedAction: similarity > 0.9 ? "remove" : "differentiate",
        });
      }
    }

    return duplicates.slice(0, 5); // Limit to top 5 duplicates
  }

  // Calculate item similarity
  private calculateSimilarity(item1: any, item2: any): number {
    const name1 = item1.name?.toLowerCase() || "";
    const name2 = (item2.name || item2.productName || "")?.toLowerCase() || "";

    // Simple name similarity (Jaccard similarity)
    const words1 = new Set(name1.split(/\s+/));
    const words2 = new Set(name2.split(/\s+/));
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    const nameSimilarity = intersection.size / union.size;

    // Price similarity
    const price1 = parseFloat(item1.price?.toString() || "0");
    const price2 = parseFloat(item2.price?.toString() || "0");
    const priceDiff = Math.abs(price1 - price2);
    const avgPrice = (price1 + price2) / 2;
    const priceSimilarity =
      avgPrice > 0 ? Math.max(0, 1 - priceDiff / avgPrice) : 0;

    // Combined similarity
    return nameSimilarity * 0.7 + priceSimilarity * 0.3;
  }

  // Suggest enhancements
  private suggestEnhancements(item: any): { suggestedChanges?: any } {
    const suggestions: any = {};

    // Name enhancement
    if (!item.name || item.name.length < 10) {
      suggestions.name = this.enhanceName(item);
    }

    // Description enhancement
    if (!item.description || item.description.length < 20) {
      suggestions.description = this.enhanceDescription(item);
    }

    // Tag suggestions
    const suggestedTags = this.suggestTags(item);
    if (suggestedTags.length > 0) {
      suggestions.tags = suggestedTags;
    }

    // Price analysis
    const priceAnalysis = this.analyzePricing(item);
    if (priceAnalysis.suggestedPrice !== item.price) {
      suggestions.price = priceAnalysis.suggestedPrice;
    }

    return Object.keys(suggestions).length > 0
      ? { suggestedChanges: suggestions }
      : {};
  }

  // Enhancement helper methods
  private enhanceName(item: any): string {
    const category = item.category || "Item";
    const brand = item.brand || "Premium";
    const baseNames = [
      `${brand} ${category}`,
      `High-Quality ${category}`,
      `Professional ${category}`,
      `Luxury ${category}`,
    ];
    return baseNames[Math.floor(Math.random() * baseNames.length)];
  }

  private enhanceDescription(item: any): string {
    const category = item.category || "item";
    const templates = [
      `Professional-grade ${category} perfect for everyday use. High quality construction and modern design.`,
      `Premium ${category} featuring excellent craftsmanship and attention to detail. Ideal for discerning customers.`,
      `High-performance ${category} designed for durability and style. Perfect addition to your collection.`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private suggestTags(item: any): string[] {
    const categoryTags = {
      Beauty: ["beauty", "skincare", "cosmetics", "self-care"],
      "Clothing, Shoes & Accessories": [
        "fashion",
        "style",
        "trendy",
        "wardrobe",
      ],
      "Home & Kitchen": ["home", "kitchen", "functional", "modern"],
      Jewelry: ["jewelry", "accessories", "elegant", "precious"],
    };

    const baseTags = categoryTags[
      item.category as keyof typeof categoryTags
    ] || ["quality", "premium"];
    return baseTags.slice(0, 3);
  }

  private analyzePricing(item: any): {
    suggestedPrice: number;
    reasoning: string;
  } {
    const currentPrice = parseFloat(item.price?.toString() || "0");
    const category = item.category || "Beauty";

    // Price ranges by category
    const priceRanges = {
      Beauty: { min: 2.99, max: 25.0, average: 8.99 },
      "Clothing, Shoes & Accessories": { min: 5.0, max: 50.0, average: 15.99 },
      "Home & Kitchen": { min: 2.99, max: 30.0, average: 12.99 },
      Jewelry: { min: 2.0, max: 15.0, average: 7.99 },
    };

    const range =
      priceRanges[category as keyof typeof priceRanges] ||
      priceRanges["Beauty"];

    if (currentPrice < range.min) {
      return {
        suggestedPrice: range.min,
        reasoning: `Price below category minimum`,
      };
    } else if (currentPrice > range.max) {
      return {
        suggestedPrice: range.max,
        reasoning: `Price above category maximum`,
      };
    } else if (Math.abs(currentPrice - range.average) > range.average * 0.5) {
      return {
        suggestedPrice: range.average,
        reasoning: `Price significantly different from category average`,
      };
    }

    return { suggestedPrice: currentPrice, reasoning: "Price is appropriate" };
  }

  // Generate suggestions for users
  private async generateSuggestions(
    userId: string,
    analyses: ContentAnalysis[],
  ): Promise<void> {
    const userSuggestions: AISuggestion[] = [];

    for (const analysis of analyses) {
      // Category suggestion
      if (analysis.confidence < 0.8) {
        userSuggestions.push({
          id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "category",
          title: "Category Update Suggested",
          description: `"${analysis.itemName}" might be better categorized as "${analysis.suggestedCategory}". ${analysis.reasoning}`,
          impact: analysis.confidence < 0.5 ? "high" : "medium",
          autoApplicable: analysis.confidence > 0.9,
          data: {
            analysisId: analysis.id,
            newCategory: analysis.suggestedCategory,
          },
          userId,
          createdAt: new Date().toISOString(),
        });
      }

      // Duplicate suggestions
      if (analysis.duplicates.length > 0) {
        userSuggestions.push({
          id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "duplicate",
          title: "Potential Duplicates Found",
          description: `Found ${analysis.duplicates.length} similar items for "${analysis.itemName}". Consider reviewing for duplicates.`,
          impact: "medium",
          autoApplicable: false,
          data: { analysisId: analysis.id, duplicates: analysis.duplicates },
          userId,
          createdAt: new Date().toISOString(),
        });
      }

      // Enhancement suggestions
      if (Object.keys(analysis.suggestedChanges).length > 0) {
        userSuggestions.push({
          id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "enhancement",
          title: "Item Enhancement Available",
          description: `We can improve "${analysis.itemName}" with better descriptions, tags, and pricing.`,
          impact: "low",
          autoApplicable: true,
          data: {
            analysisId: analysis.id,
            enhancements: analysis.suggestedChanges,
          },
          userId,
          createdAt: new Date().toISOString(),
        });
      }
    }

    this.suggestions.push(...userSuggestions);
    this.saveSuggestions();
  }

  // Periodic analysis
  private startPeriodicAnalysis(): void {
    // Run analysis every 30 minutes
    this.analysisInterval = setInterval(
      async () => {
        if (this.isRunning) return;

        this.isRunning = true;
        try {
          console.log("🤖 AI: Starting periodic content analysis...");
          const users = JSON.parse(localStorage.getItem("users") || "[]");

          for (const user of users.slice(0, 3)) {
            // Limit to 3 users per cycle
            await this.analyzeUserContent(user.id);
          }

          console.log("🤖 AI: Periodic analysis completed");
        } catch (error) {
          console.error("Periodic analysis error:", error);
        } finally {
          this.isRunning = false;
        }
      },
      30 * 60 * 1000,
    ); // 30 minutes
  }

  // User methods
  getUserSuggestions(userId: string): AISuggestion[] {
    return this.suggestions.filter((s) => s.userId === userId);
  }

  async applySuggestion(
    suggestionId: string,
    approved: boolean,
  ): Promise<boolean> {
    const suggestion = this.suggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return false;

    try {
      if (approved) {
        await this.applySuggestionChanges(suggestion);
      }

      // Remove suggestion
      this.suggestions = this.suggestions.filter((s) => s.id !== suggestionId);
      this.saveSuggestions();

      return true;
    } catch (error) {
      console.error("Error applying suggestion:", error);
      return false;
    }
  }

  private async applySuggestionChanges(
    suggestion: AISuggestion,
  ): Promise<void> {
    switch (suggestion.type) {
      case "category":
        await this.applyCategoryChange(suggestion);
        break;
      case "enhancement":
        await this.applyEnhancement(suggestion);
        break;
      case "duplicate":
        await this.handleDuplicate(suggestion);
        break;
    }
  }

  private async applyCategoryChange(suggestion: AISuggestion): Promise<void> {
    // Update item category
    const { analysisId, newCategory } = suggestion.data;
    const analysis = this.analysisHistory.find((a) => a.id === analysisId);

    if (analysis) {
      // Update in user collections
      const userCollections = await UserDataService.getUserCollections(
        suggestion.userId,
      );

      for (const collection of userCollections) {
        const item = collection.items?.find((i) => i.id === analysis.itemId);
        if (item) {
          item.category = newCategory;
          await UserDataService.saveCollection(suggestion.userId, collection);
          break;
        }
      }
    }
  }

  private async applyEnhancement(suggestion: AISuggestion): Promise<void> {
    const { analysisId, enhancements } = suggestion.data;
    const analysis = this.analysisHistory.find((a) => a.id === analysisId);

    if (analysis) {
      const userCollections = await UserDataService.getUserCollections(
        suggestion.userId,
      );

      for (const collection of userCollections) {
        const item = collection.items?.find((i) => i.id === analysis.itemId);
        if (item) {
          Object.assign(item, enhancements);
          await UserDataService.saveCollection(suggestion.userId, collection);
          break;
        }
      }
    }
  }

  private async handleDuplicate(suggestion: AISuggestion): Promise<void> {
    // For now, just mark as reviewed
    console.log("Duplicate handling not yet implemented:", suggestion.data);
  }

  // Utility methods
  private getUserUploads(userId: string): any[] {
    const guestUploads = JSON.parse(
      localStorage.getItem("guestUploads") || "[]",
    );
    return guestUploads.filter((upload: any) => upload.userId === userId);
  }

  private hasRecentAnalysis(itemId: string): boolean {
    const recentAnalysis = this.analysisHistory.find(
      (a) =>
        a.itemId === itemId &&
        new Date(a.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days
    );
    return !!recentAnalysis;
  }

  private loadAnalysisHistory(): void {
    try {
      const saved = localStorage.getItem("aiAnalysisHistory");
      if (saved) {
        this.analysisHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading analysis history:", error);
      this.analysisHistory = [];
    }
  }

  private saveAnalysisHistory(): void {
    try {
      localStorage.setItem(
        "aiAnalysisHistory",
        JSON.stringify(this.analysisHistory),
      );
    } catch (error) {
      console.error("Error saving analysis history:", error);
    }
  }

  private saveSuggestions(): void {
    try {
      localStorage.setItem("aiSuggestions", JSON.stringify(this.suggestions));
    } catch (error) {
      console.error("Error saving suggestions:", error);
    }
  }

  // Get all suggestions across all users
  getAllSuggestions(): AISuggestion[] {
    return [...this.suggestions];
  }

  // Get analysis history
  getAnalysisHistory(): ContentAnalysis[] {
    return [...this.analysisHistory];
  }

  // Cleanup
  destroy(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
  }

  // Static methods for backward compatibility
  static async analyzeUserContent(
    userId: string,
    forceReanalysis: boolean = false,
  ): Promise<ContentAnalysis[]> {
    return aiContentAnalyzerInstance.analyzeUserContent(
      userId,
      forceReanalysis,
    );
  }

  static getUserSuggestions(userId: string): AISuggestion[] {
    return aiContentAnalyzerInstance.getUserSuggestions(userId);
  }

  static async applySuggestion(
    suggestionId: string,
    approved: boolean,
  ): Promise<boolean> {
    return aiContentAnalyzerInstance.applySuggestion(suggestionId, approved);
  }

  static getAnalysisHistory(): ContentAnalysis[] {
    return aiContentAnalyzerInstance.getAnalysisHistory();
  }

  static getAllSuggestions(): AISuggestion[] {
    return aiContentAnalyzerInstance.getAllSuggestions();
  }
}

// Create singleton instance
const aiContentAnalyzerInstance = new AIContentAnalyzer();

// Export singleton instance
export default aiContentAnalyzerInstance;
