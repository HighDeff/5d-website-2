interface ProductInfo {
  name: string;
  description: string;
  category: string;
  price: string;
}

interface AIAccountData {
  productInfo: ProductInfo;
  images: string[];
}

interface GeneratedAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  collections: string[];
  aiGenerated: boolean;
  productSuggestions: string[];
  collectionSuggestions: string[];
}

interface AccountCreationResult {
  success: boolean;
  account?: GeneratedAccount;
  error?: string;
  suggestions?: string[];
}

class AIAccountCreationService {
  private static instance: AIAccountCreationService;

  static getInstance(): AIAccountCreationService {
    if (!AIAccountCreationService.instance) {
      AIAccountCreationService.instance = new AIAccountCreationService();
    }
    return AIAccountCreationService.instance;
  }

  /**
   * Create an account automatically based on product upload information
   */
  async createAccountFromUpload(
    aiAccountData: AIAccountData,
  ): Promise<AccountCreationResult> {
    try {
      const { productInfo, images } = aiAccountData;

      // AI-generated name based on product category and style
      const generatedName = this.generateNameFromProduct(productInfo);

      // AI-generated username
      const username = this.generateUsername(
        generatedName,
        productInfo.category,
      );

      // AI-generated email
      const email = this.generateEmail(username);

      // AI-generated password
      const password = this.generateSecurePassword();

      // AI-generated collections based on products
      const collections = this.generateCollections(productInfo);

      // AI product suggestions
      const productSuggestions = this.generateProductSuggestions(productInfo);

      // AI collection suggestions
      const collectionSuggestions =
        this.generateCollectionSuggestions(productInfo);

      const account: GeneratedAccount = {
        id: `ai_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: generatedName,
        email: email,
        password: password,
        username: username,
        collections: collections,
        aiGenerated: true,
        productSuggestions: productSuggestions,
        collectionSuggestions: collectionSuggestions,
      };

      // Create the user account in the system
      const userCreationResult = await this.createUserAccount(
        account,
        productInfo,
      );

      if (userCreationResult.success) {
        // Log AI account creation
        this.logAIAccountCreation(account, productInfo);

        return {
          success: true,
          account: account,
          suggestions: [
            `Welcome ${generatedName}! Your account was created by AI.`,
            `Your collections: ${collections.join(", ")}`,
            `Suggested products to add: ${productSuggestions.slice(0, 3).join(", ")}`,
            `Login with email: ${email} and password: ${password}`,
          ],
        };
      } else {
        return {
          success: false,
          error: "Failed to create user account in system",
        };
      }
    } catch (error) {
      console.error("AI Account Creation Error:", error);
      return {
        success: false,
        error: "AI account creation failed",
      };
    }
  }

  /**
   * Generate a realistic name based on product information
   */
  private generateNameFromProduct(productInfo: ProductInfo): string {
    const categoryNameMaps: { [key: string]: string[] } = {
      jewelry: [
        "Sophia Sterling",
        "Emma Goldsmith",
        "Luna Pearl",
        "Aria Diamond",
        "Nova Gemstone",
        "Stella Luxury",
        "Grace Elegance",
        "Ruby Designer",
      ],
      clothing: [
        "Chloe Fashion",
        "Maya Style",
        "Zara Boutique",
        "Iris Couture",
        "Luna Threads",
        "Aria Apparel",
        "Nova Trends",
        "Stella Chic",
      ],
      beauty: [
        "Bella Cosmetics",
        "Rose Skincare",
        "Luna Beauty",
        "Aria Glow",
        "Nova Radiance",
        "Stella Makeup",
        "Grace Beauty",
        "Iris Luxe",
      ],
      accessories: [
        "Ava Accessories",
        "Luna Luxe",
        "Aria Style",
        "Nova Chic",
        "Stella Bags",
        "Grace Designs",
        "Iris Fashion",
        "Ruby Accessories",
      ],
      vintage: [
        "Clara Vintage",
        "Ivy Antique",
        "Luna Retro",
        "Aria Classic",
        "Nova Vintage",
        "Stella Timeless",
        "Grace Heritage",
        "Ruby Nostalgia",
      ],
      home: [
        "Lily Home",
        "Rose Decor",
        "Luna Living",
        "Aria Spaces",
        "Nova Interior",
        "Stella Design",
        "Grace Home",
        "Iris Lifestyle",
      ],
    };

    const categoryKey = productInfo.category.toLowerCase();
    const names = categoryNameMaps[categoryKey] || categoryNameMaps.clothing;

    return names[Math.floor(Math.random() * names.length)];
  }

  /**
   * Generate username from name and category
   */
  private generateUsername(name: string, category: string): string {
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
    const categoryShort = category.toLowerCase().substring(0, 3);
    const randomNum = Math.floor(Math.random() * 999) + 1;

    return `${cleanName}${categoryShort}${randomNum}`;
  }

  /**
   * Generate email address
   */
  private generateEmail(username: string): string {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    return `${username}@${domain}`;
  }

  /**
   * Generate secure password
   */
  private generateSecurePassword(): string {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  /**
   * Generate collections based on product category
   */
  private generateCollections(productInfo: ProductInfo): string[] {
    const category = productInfo.category.toLowerCase();
    const baseCollections = ["My Favorites", "Featured Items"];

    const categoryCollections: { [key: string]: string[] } = {
      jewelry: [
        "Fine Jewelry",
        "Statement Pieces",
        "Daily Wear",
        "Special Occasions",
      ],
      clothing: [
        "Casual Wear",
        "Formal Attire",
        "Seasonal Fashion",
        "Designer Pieces",
      ],
      beauty: [
        "Skincare Essentials",
        "Makeup Collection",
        "Luxury Beauty",
        "Daily Routine",
      ],
      accessories: [
        "Handbags & Purses",
        "Scarves & Wraps",
        "Belts & More",
        "Statement Accessories",
      ],
      vintage: [
        "Vintage Finds",
        "Retro Style",
        "Classic Pieces",
        "Antique Collection",
      ],
      home: [
        "Home Decor",
        "Living Room",
        "Kitchen Essentials",
        "Bedroom Decor",
      ],
    };

    const specificCollections =
      categoryCollections[category] || categoryCollections.clothing;

    return [...baseCollections, ...specificCollections.slice(0, 3)];
  }

  /**
   * Generate product suggestions
   */
  private generateProductSuggestions(productInfo: ProductInfo): string[] {
    const category = productInfo.category.toLowerCase();

    const suggestions: { [key: string]: string[] } = {
      jewelry: [
        "Add matching earrings to complement necklaces",
        "Include bracelet sets for complete looks",
        "Add rings in various sizes",
        "Consider vintage pieces for uniqueness",
        "Add gemstone collections",
      ],
      clothing: [
        "Add seasonal clothing items",
        "Include different size options",
        "Add complementary accessories",
        "Consider trending styles",
        "Add formal and casual options",
      ],
      beauty: [
        "Add skincare routine products",
        "Include makeup tutorials with products",
        "Add seasonal beauty items",
        "Consider eco-friendly options",
        "Add luxury beauty sets",
      ],
      accessories: [
        "Add matching handbag sets",
        "Include seasonal accessories",
        "Add different color options",
        "Consider functional accessories",
        "Add statement pieces",
      ],
    };

    return suggestions[category] || suggestions.clothing;
  }

  /**
   * Generate collection suggestions
   */
  private generateCollectionSuggestions(productInfo: ProductInfo): string[] {
    return [
      "Organize items by color scheme",
      "Create seasonal collections",
      "Group items by price range",
      "Create occasion-based collections",
      "Add trending item collections",
      "Create bundle collections for deals",
      "Organize by brand or designer",
      "Create style-specific collections",
    ];
  }

  /**
   * Create the actual user account in the system
   */
  private async createUserAccount(
    account: GeneratedAccount,
    productInfo: ProductInfo,
  ): Promise<{ success: boolean }> {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // Create user object compatible with the system
      const newUser = {
        id: account.id,
        name: account.name,
        email: account.email,
        password: account.password, // In real app, this would be hashed
        username: account.username,
        avatar: "",
        verified: false,
        membershipLevel: "free",
        joinDate: new Date().toISOString(),
        aiGenerated: true,
        collections: account.collections,
        productSuggestions: account.productSuggestions,
        collectionSuggestions: account.collectionSuggestions,
        totalEarnings: 0,
        salesCount: 0,
        products: [],
        initialProduct: {
          name: productInfo.name,
          category: productInfo.category,
          price: productInfo.price,
        },
      };

      // Add to users array
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Create collections for the user
      this.createUserCollections(account.id, account.collections);

      return { success: true };
    } catch (error) {
      console.error("Error creating user account:", error);
      return { success: false };
    }
  }

  /**
   * Create collections for the new user
   */
  private createUserCollections(
    userId: string,
    collectionNames: string[],
  ): void {
    try {
      const existingCollections = JSON.parse(
        localStorage.getItem("userCollections") || "{}",
      );

      if (!existingCollections[userId]) {
        existingCollections[userId] = [];
      }

      collectionNames.forEach((name, index) => {
        const collection = {
          id: `collection_${userId}_${index}_${Date.now()}`,
          name: name,
          description: `AI-generated ${name} collection`,
          items: [],
          isPublic: true,
          createdAt: new Date().toISOString(),
          aiGenerated: true,
        };

        existingCollections[userId].push(collection);
      });

      localStorage.setItem(
        "userCollections",
        JSON.stringify(existingCollections),
      );
    } catch (error) {
      console.error("Error creating user collections:", error);
    }
  }

  /**
   * Log AI account creation for analytics
   */
  private logAIAccountCreation(
    account: GeneratedAccount,
    productInfo: ProductInfo,
  ): void {
    try {
      const logs = JSON.parse(
        localStorage.getItem("aiAccountCreationLogs") || "[]",
      );

      const log = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        accountId: account.id,
        accountName: account.name,
        productCategory: productInfo.category,
        productName: productInfo.name,
        collectionsCreated: account.collections.length,
        suggestionsGenerated: account.productSuggestions.length,
        success: true,
      };

      logs.push(log);

      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem("aiAccountCreationLogs", JSON.stringify(logs));
    } catch (error) {
      console.error("Error logging AI account creation:", error);
    }
  }

  /**
   * Get AI account creation statistics
   */
  getAIAccountStats(): any {
    try {
      const logs = JSON.parse(
        localStorage.getItem("aiAccountCreationLogs") || "[]",
      );
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const aiUsers = users.filter((user: any) => user.aiGenerated);

      return {
        totalAIAccounts: aiUsers.length,
        recentCreations: logs.length,
        categoriesBreakdown: this.getCategoryBreakdown(logs),
        successRate:
          logs.length > 0
            ? (logs.filter((log: any) => log.success).length / logs.length) *
              100
            : 0,
        averageCollectionsPerAccount:
          aiUsers.length > 0
            ? aiUsers.reduce(
                (acc: number, user: any) =>
                  acc + (user.collections?.length || 0),
                0,
              ) / aiUsers.length
            : 0,
      };
    } catch (error) {
      console.error("Error getting AI account stats:", error);
      return {
        totalAIAccounts: 0,
        recentCreations: 0,
        categoriesBreakdown: {},
        successRate: 0,
        averageCollectionsPerAccount: 0,
      };
    }
  }

  /**
   * Get category breakdown for analytics
   */
  private getCategoryBreakdown(logs: any[]): { [key: string]: number } {
    const breakdown: { [key: string]: number } = {};

    logs.forEach((log) => {
      const category = log.productCategory;
      breakdown[category] = (breakdown[category] || 0) + 1;
    });

    return breakdown;
  }

  /**
   * Validate if AI account creation is possible
   */
  validateAccountCreation(productInfo: ProductInfo): {
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (!productInfo.name || productInfo.name.length < 3) {
      issues.push("Product name too short (minimum 3 characters)");
    }

    if (!productInfo.category) {
      issues.push("Product category is required");
    }

    if (!productInfo.price || parseFloat(productInfo.price) <= 0) {
      issues.push("Valid product price is required");
    }

    return {
      valid: issues.length === 0,
      issues: issues,
    };
  }
}

export default AIAccountCreationService.getInstance();
