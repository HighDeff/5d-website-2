// AI Product Validation Service - Handles duplicate checking, suggestions, and collection organization
import { Product } from "@/hooks/useUserAuth";

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
  similarProducts: Product[];
  recommendedChanges: {
    suggestedName?: string;
    suggestedCategory?: string;
    suggestedPrice?: number;
    suggestedDescription?: string;
  };
  autoAcceptable: boolean;
}

export interface CollectionValidationResult {
  success: boolean;
  retryAttempts: number;
  finalData: any;
  suggestions: string[];
  errors: string[];
  autoFixed: boolean;
}

class AIProductValidationService {
  private validationHistory: Array<{
    productId: string;
    userId: string;
    timestamp: string;
    action: string;
    result: ValidationResult;
  }> = [];

  /**
   * Validate product before adding to prevent duplicates and issues
   */
  async validateProduct(
    productData: {
      name: string;
      description: string;
      category: string;
      price: number;
      sellerId: string;
    },
    existingProducts: Product[],
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      warnings: [],
      suggestions: [],
      similarProducts: [],
      recommendedChanges: {},
      autoAcceptable: false,
    };

    // Check for similar names
    const similarNames = this.findSimilarNames(
      productData.name,
      existingProducts,
    );

    if (similarNames.length > 0) {
      result.warnings.push(
        `Found ${similarNames.length} products with similar names`,
      );
      result.similarProducts = similarNames;

      // Generate suggested alternative name
      result.recommendedChanges.suggestedName = this.generateUniqueName(
        productData.name,
        existingProducts,
      );

      // Check if it's the same seller
      const sameSellerDuplicates = similarNames.filter(
        (p) => p.sellerId === productData.sellerId,
      );

      if (sameSellerDuplicates.length > 0) {
        result.isValid = false;
        result.warnings.push(
          "You already have products with very similar names. Please choose a more unique name.",
        );
      }
    }

    // Validate price range
    const categoryPrices = existingProducts
      .filter((p) => p.category === productData.category)
      .map((p) => p.price);

    if (categoryPrices.length > 0) {
      const avgPrice =
        categoryPrices.reduce((sum, price) => sum + price, 0) /
        categoryPrices.length;
      const maxPrice = Math.max(...categoryPrices);
      const minPrice = Math.min(...categoryPrices);

      if (productData.price > maxPrice * 2) {
        result.warnings.push(
          `Price seems high for ${productData.category}. Average price is $${avgPrice.toFixed(2)}`,
        );
        result.recommendedChanges.suggestedPrice = Math.round(avgPrice * 1.5);
      }

      if (productData.price < minPrice * 0.5) {
        result.warnings.push(
          `Price seems low for ${productData.category}. Average price is $${avgPrice.toFixed(2)}`,
        );
        result.recommendedChanges.suggestedPrice = Math.round(avgPrice * 0.8);
      }
    }

    // Validate description length and quality
    if (productData.description.length < 20) {
      result.warnings.push(
        "Description is too short. Consider adding more details.",
      );
      result.suggestions.push(
        "Add details about condition, materials, size, or unique features",
      );
    }

    // Check for common spam words
    const spamWords = ["guaranteed", "make money", "click here", "free money"];
    const hasSpamWords = spamWords.some((word) =>
      productData.description.toLowerCase().includes(word.toLowerCase()),
    );

    if (hasSpamWords) {
      result.isValid = false;
      result.warnings.push(
        "Description contains words that may be flagged as spam",
      );
    }

    // Determine if auto-acceptable
    result.autoAcceptable =
      result.warnings.length <= 2 &&
      result.similarProducts.length === 0 &&
      result.isValid;

    // Log validation
    this.logValidation(productData.sellerId, "validate", result);

    return result;
  }

  /**
   * Validate and organize collection after adding product
   */
  async validateCollection(
    collectionData: any,
    maxRetries: number = 3,
  ): Promise<CollectionValidationResult> {
    let retryCount = 0;
    let currentData = { ...collectionData };
    const suggestions: string[] = [];
    const errors: string[] = [];
    let autoFixed = false;

    while (retryCount < maxRetries) {
      try {
        // Validate collection structure
        const structureValid =
          await this.validateCollectionStructure(currentData);

        if (structureValid.isValid) {
          return {
            success: true,
            retryAttempts: retryCount,
            finalData: currentData,
            suggestions: structureValid.suggestions,
            errors: [],
            autoFixed,
          };
        }

        // Try to auto-fix issues
        const fixedData = await this.autoFixCollection(
          currentData,
          structureValid.issues,
        );

        if (fixedData.fixed) {
          currentData = fixedData.data;
          autoFixed = true;
          suggestions.push(...fixedData.suggestions);
        } else {
          errors.push(...structureValid.issues);
          break;
        }

        retryCount++;
      } catch (error) {
        errors.push(`Validation error: ${error.message}`);
        break;
      }
    }

    return {
      success: false,
      retryAttempts: retryCount,
      finalData: currentData,
      suggestions,
      errors,
      autoFixed,
    };
  }

  /**
   * Reorganize collections using AI logic
   */
  async reorganizeCollections(products: Product[]): Promise<{
    reorganized: boolean;
    newStructure: any;
    suggestions: string[];
  }> {
    const suggestions: string[] = [];

    // Group products by category and analyze patterns
    const categoryGroups = this.groupProductsByCategory(products);
    const newStructure = await this.optimizeCollectionStructure(categoryGroups);

    // Generate suggestions for better organization
    Object.keys(categoryGroups).forEach((category) => {
      const products = categoryGroups[category];
      if (products.length > 10) {
        suggestions.push(
          `Consider creating subcategories for ${category} (${products.length} items)`,
        );
      }
    });

    return {
      reorganized: true,
      newStructure,
      suggestions,
    };
  }

  /**
   * Find products with similar names
   */
  private findSimilarNames(
    productName: string,
    existingProducts: Product[],
  ): Product[] {
    const normalizedName = this.normalizeProductName(productName);
    const similar: Product[] = [];

    existingProducts.forEach((product) => {
      const existingNormalized = this.normalizeProductName(product.name);
      const similarity = this.calculateSimilarity(
        normalizedName,
        existingNormalized,
      );

      if (similarity > 0.7) {
        // 70% similarity threshold
        similar.push(product);
      }
    });

    return similar;
  }

  /**
   * Generate unique name suggestion
   */
  private generateUniqueName(
    originalName: string,
    existingProducts: Product[],
  ): string {
    let counter = 1;
    let newName = originalName;

    while (
      existingProducts.some(
        (p) =>
          this.normalizeProductName(p.name) ===
          this.normalizeProductName(newName),
      )
    ) {
      newName = `${originalName} (${counter})`;
      counter++;
    }

    return newName;
  }

  /**
   * Normalize product name for comparison
   */
  private normalizeProductName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Calculate string similarity (Levenshtein distance based)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator,
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Validate collection structure
   */
  private async validateCollectionStructure(data: any): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check required fields
    if (!data.name || data.name.trim().length === 0) {
      issues.push("Collection name is required");
    }

    if (!data.items || !Array.isArray(data.items)) {
      issues.push("Collection must have items array");
    }

    // Check item structure
    if (data.items) {
      data.items.forEach((item: any, index: number) => {
        if (!item.name) {
          issues.push(`Item ${index + 1} is missing name`);
        }
        if (!item.price || item.price <= 0) {
          issues.push(`Item ${index + 1} has invalid price`);
        }
      });
    }

    // Generate suggestions
    if (data.items && data.items.length > 20) {
      suggestions.push(
        "Consider splitting large collection into subcategories",
      );
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
    };
  }

  /**
   * Auto-fix collection issues
   */
  private async autoFixCollection(
    data: any,
    issues: string[],
  ): Promise<{
    fixed: boolean;
    data: any;
    suggestions: string[];
  }> {
    const fixedData = { ...data };
    const suggestions: string[] = [];
    let hasChanges = false;

    // Auto-fix missing collection name
    if (!fixedData.name) {
      fixedData.name = `Collection ${Date.now()}`;
      suggestions.push("Auto-generated collection name");
      hasChanges = true;
    }

    // Auto-fix missing items array
    if (!fixedData.items) {
      fixedData.items = [];
      suggestions.push("Created empty items array");
      hasChanges = true;
    }

    // Auto-fix item issues
    if (fixedData.items) {
      fixedData.items.forEach((item: any, index: number) => {
        if (!item.name) {
          item.name = `Item ${index + 1}`;
          suggestions.push(`Auto-generated name for item ${index + 1}`);
          hasChanges = true;
        }
        if (!item.price || item.price <= 0) {
          item.price = 10; // Default price
          suggestions.push(`Set default price for item ${index + 1}`);
          hasChanges = true;
        }
      });
    }

    return {
      fixed: hasChanges,
      data: fixedData,
      suggestions,
    };
  }

  /**
   * Group products by category
   */
  private groupProductsByCategory(
    products: Product[],
  ): Record<string, Product[]> {
    return products.reduce(
      (groups, product) => {
        const category = product.category || "Uncategorized";
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(product);
        return groups;
      },
      {} as Record<string, Product[]>,
    );
  }

  /**
   * Optimize collection structure
   */
  private async optimizeCollectionStructure(
    categoryGroups: Record<string, Product[]>,
  ): Promise<any> {
    const optimized: any = {
      categories: {},
      recommendations: [],
    };

    Object.keys(categoryGroups).forEach((category) => {
      const products = categoryGroups[category];

      // Create subcategories for large categories
      if (products.length > 10) {
        optimized.categories[category] = this.createSubcategories(products);
      } else {
        optimized.categories[category] = {
          items: products,
          count: products.length,
        };
      }
    });

    return optimized;
  }

  /**
   * Create subcategories for large product groups
   */
  private createSubcategories(products: Product[]): any {
    // Group by price ranges
    const lowPrice = products.filter((p) => p.price < 50);
    const midPrice = products.filter((p) => p.price >= 50 && p.price < 200);
    const highPrice = products.filter((p) => p.price >= 200);

    const subcategories: any = {};

    if (lowPrice.length > 0) {
      subcategories["Under $50"] = {
        items: lowPrice,
        count: lowPrice.length,
      };
    }

    if (midPrice.length > 0) {
      subcategories["$50 - $200"] = {
        items: midPrice,
        count: midPrice.length,
      };
    }

    if (highPrice.length > 0) {
      subcategories["$200+"] = {
        items: highPrice,
        count: highPrice.length,
      };
    }

    return {
      subcategories,
      totalCount: products.length,
    };
  }

  /**
   * Log validation results
   */
  private logValidation(
    userId: string,
    action: string,
    result: ValidationResult,
  ): void {
    this.validationHistory.push({
      productId: `temp_${Date.now()}`,
      userId,
      timestamp: new Date().toISOString(),
      action,
      result,
    });

    // Keep only last 100 entries
    if (this.validationHistory.length > 100) {
      this.validationHistory = this.validationHistory.slice(-100);
    }
  }

  /**
   * Get validation analytics
   */
  getValidationAnalytics() {
    const last24Hours = this.validationHistory.filter((entry) => {
      const entryTime = new Date(entry.timestamp);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return entryTime > dayAgo;
    });

    return {
      totalValidations: this.validationHistory.length,
      last24Hours: last24Hours.length,
      rejectionRate:
        (this.validationHistory.filter((v) => !v.result.isValid).length /
          this.validationHistory.length) *
        100,
      autoAcceptRate:
        (this.validationHistory.filter((v) => v.result.autoAcceptable).length /
          this.validationHistory.length) *
        100,
      commonWarnings: this.getCommonWarnings(),
    };
  }

  /**
   * Get common validation warnings
   */
  private getCommonWarnings(): Array<{ warning: string; count: number }> {
    const warningCounts = new Map<string, number>();

    this.validationHistory.forEach((entry) => {
      entry.result.warnings.forEach((warning) => {
        warningCounts.set(warning, (warningCounts.get(warning) || 0) + 1);
      });
    });

    return Array.from(warningCounts.entries())
      .map(([warning, count]) => ({ warning, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export default new AIProductValidationService();
