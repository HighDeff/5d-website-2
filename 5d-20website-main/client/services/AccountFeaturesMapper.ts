// Account Features Mapper - Maps features, functions, and access by user tier
import { useUserAuth } from "../hooks/useUserAuth";

export interface FeatureMapping {
  id: string;
  name: string;
  description: string;
  category: "navigation" | "commerce" | "ai" | "social" | "admin" | "premium";
  tier: "guest" | "standard" | "premium" | "admin";
  page: string;
  element: string;
  function: string;
  purpose: string;
  accessLevel: number; // 1-10, 10 being highest access
  dependencies?: string[]; // Required features for this to work
  alternatives?: string[]; // Alternative features for lower tiers
}

export interface UserTierAccess {
  tier: "guest" | "standard" | "premium" | "admin";
  accessLevel: number;
  features: FeatureMapping[];
  restrictions: string[];
  recommendations: string[];
}

class AccountFeaturesMapper {
  private static instance: AccountFeaturesMapper;
  private featureMap: Map<string, FeatureMapping[]> = new Map();
  private tierDefinitions: Map<string, UserTierAccess> = new Map();

  static getInstance(): AccountFeaturesMapper {
    if (!AccountFeaturesMapper.instance) {
      AccountFeaturesMapper.instance = new AccountFeaturesMapper();
    }
    return AccountFeaturesMapper.instance;
  }

  constructor() {
    this.initializeFeatureMappings();
    this.initializeTierDefinitions();
    console.log("🗺️ Account Features Mapper: Initialized");
  }

  private initializeFeatureMappings(): void {
    // Home Page Features
    const homeFeatures: FeatureMapping[] = [
      {
        id: "home-header",
        name: "Main Header",
        description: "Primary navigation header with logo and main menu",
        category: "navigation",
        tier: "guest",
        page: "/",
        element: "header",
        function: "Site navigation and branding",
        purpose: "Provide consistent navigation across the site",
        accessLevel: 1,
      },
      {
        id: "home-auth-buttons",
        name: "Authentication Buttons",
        description: "Sign in/Sign up buttons for account access",
        category: "navigation",
        tier: "guest",
        page: "/",
        element: ".auth-button, button:contains('Sign')",
        function: "User authentication",
        purpose: "Allow users to sign in or create accounts",
        accessLevel: 1,
      },
      {
        id: "home-cart",
        name: "Shopping Cart",
        description: "Shopping cart access for purchases",
        category: "commerce",
        tier: "guest",
        page: "/",
        element: ".cart-button, [data-testid='cart']",
        function: "Access shopping cart",
        purpose: "View and manage items for purchase",
        accessLevel: 2,
      },
      {
        id: "home-search",
        name: "Search Functionality",
        description: "Search products and collections",
        category: "navigation",
        tier: "guest",
        page: "/",
        element: "input[type='search'], .search-input",
        function: "Search site content",
        purpose: "Find specific products or collections",
        accessLevel: 2,
      },
    ];

    // Collections Page Features
    const collectionFeatures: FeatureMapping[] = [
      {
        id: "collections-header",
        name: "Collections Header",
        description: "Page header with title and breadcrumbs",
        category: "navigation",
        tier: "guest",
        page: "/collections",
        element: "header, .page-header",
        function: "Page navigation and context",
        purpose: "Show current page and navigation options",
        accessLevel: 1,
      },
      {
        id: "collections-grid",
        name: "Collection Cards",
        description: "Grid of available collections",
        category: "commerce",
        tier: "guest",
        page: "/collections",
        element: ".collection-card, [data-collection-id]",
        function: "Display and access collections",
        purpose: "Browse available product collections",
        accessLevel: 1,
      },
      {
        id: "collections-favorites",
        name: "Favorites Buttons",
        description: "Add/remove items from favorites",
        category: "social",
        tier: "standard",
        page: "/collections",
        element: ".favorites-button, [data-item-id] .heart",
        function: "Manage user favorites",
        purpose: "Save preferred items for later",
        accessLevel: 4,
        dependencies: ["user-account"],
      },
      {
        id: "collections-settings",
        name: "Settings Access",
        description: "User settings and account management",
        category: "navigation",
        tier: "standard",
        page: "/collections",
        element: "button:contains('Settings'), .settings-button",
        function: "Access user settings",
        purpose: "Manage account preferences and settings",
        accessLevel: 5,
        dependencies: ["user-account"],
      },
      {
        id: "collections-upload",
        name: "Upload Items",
        description: "Upload new products or collections",
        category: "commerce",
        tier: "standard",
        page: "/collections",
        element: "button:contains('Upload'), .upload-button",
        function: "Upload new content",
        purpose: "Add products to sell or share",
        accessLevel: 6,
        dependencies: ["user-account", "verified-seller"],
      },
    ];

    // Dashboard Features (Authenticated Users)
    const dashboardFeatures: FeatureMapping[] = [
      {
        id: "dashboard-profile",
        name: "User Profile",
        description: "User profile information and stats",
        category: "social",
        tier: "standard",
        page: "/dashboard",
        element: ".user-profile, .profile-section",
        function: "Display user information",
        purpose: "Show user details and account status",
        accessLevel: 5,
        dependencies: ["user-account"],
      },
      {
        id: "dashboard-analytics",
        name: "Analytics Dashboard",
        description: "Sales and performance analytics",
        category: "premium",
        tier: "premium",
        page: "/dashboard",
        element: ".analytics-section, .stats-grid",
        function: "Show performance metrics",
        purpose: "Track sales and engagement",
        accessLevel: 7,
        dependencies: ["user-account", "seller-account"],
      },
      {
        id: "dashboard-ai-tools",
        name: "AI Tools",
        description: "Advanced AI features and automation",
        category: "ai",
        tier: "premium",
        page: "/dashboard",
        element: ".ai-section, .ai-tools",
        function: "AI-powered features",
        purpose: "Automate tasks and get AI insights",
        accessLevel: 8,
        dependencies: ["user-account", "premium-subscription"],
      },
    ];

    // Admin Features
    const adminFeatures: FeatureMapping[] = [
      {
        id: "admin-panel",
        name: "Admin Panel",
        description: "Full administrative access",
        category: "admin",
        tier: "admin",
        page: "/admin",
        element: ".admin-panel, .admin-dashboard",
        function: "Site administration",
        purpose: "Manage site operations and users",
        accessLevel: 10,
        dependencies: ["admin-account"],
      },
      {
        id: "admin-user-management",
        name: "User Management",
        description: "Manage user accounts and permissions",
        category: "admin",
        tier: "admin",
        page: "/admin/users",
        element: ".user-management, .user-table",
        function: "User administration",
        purpose: "Manage user accounts and access",
        accessLevel: 10,
        dependencies: ["admin-account"],
      },
      {
        id: "admin-ai-control",
        name: "AI System Control",
        description: "Control and monitor AI systems",
        category: "ai",
        tier: "admin",
        page: "*",
        element: ".ai-control, .ai-dashboard",
        function: "AI system management",
        purpose: "Monitor and control AI operations",
        accessLevel: 10,
        dependencies: ["admin-account"],
      },
    ];

    // Store in map by page
    this.featureMap.set("/", homeFeatures);
    this.featureMap.set("/collections", collectionFeatures);
    this.featureMap.set("/dashboard", dashboardFeatures);
    this.featureMap.set("/admin", adminFeatures);

    console.log(`🗺️ Initialized ${this.featureMap.size} page feature mappings`);
  }

  private initializeTierDefinitions(): void {
    // Guest Tier
    this.tierDefinitions.set("guest", {
      tier: "guest",
      accessLevel: 2,
      features: this.getAllFeaturesByTier("guest"),
      restrictions: [
        "Cannot save favorites",
        "Cannot upload content",
        "Limited to browsing only",
        "No personalization",
      ],
      recommendations: [
        "Sign up for an account to save favorites",
        "Create account to upload and sell items",
        "Join to access personalized features",
      ],
    });

    // Standard Tier
    this.tierDefinitions.set("standard", {
      tier: "standard",
      accessLevel: 5,
      features: this.getAllFeaturesByTier("standard"),
      restrictions: [
        "Limited analytics access",
        "Basic AI features only",
        "Standard upload limits",
      ],
      recommendations: [
        "Upgrade to Premium for advanced analytics",
        "Get Premium for AI-powered tools",
        "Premium unlocks unlimited uploads",
      ],
    });

    // Premium Tier
    this.tierDefinitions.set("premium", {
      tier: "premium",
      accessLevel: 8,
      features: this.getAllFeaturesByTier("premium"),
      restrictions: ["No administrative access"],
      recommendations: ["Contact support for business features"],
    });

    // Admin Tier
    this.tierDefinitions.set("admin", {
      tier: "admin",
      accessLevel: 10,
      features: this.getAllFeaturesByTier("admin"),
      restrictions: [],
      recommendations: [],
    });

    console.log(`🎖️ Initialized ${this.tierDefinitions.size} user tiers`);
  }

  private getAllFeaturesByTier(
    tier: "guest" | "standard" | "premium" | "admin",
  ): FeatureMapping[] {
    const allFeatures: FeatureMapping[] = [];
    const tierLevels = { guest: 2, standard: 5, premium: 8, admin: 10 };
    const userLevel = tierLevels[tier];

    this.featureMap.forEach((features) => {
      features.forEach((feature) => {
        const featureTierLevel = tierLevels[feature.tier];
        if (featureTierLevel <= userLevel) {
          allFeatures.push(feature);
        }
      });
    });

    return allFeatures;
  }

  // Public Methods
  getFeaturesForPage(page: string): FeatureMapping[] {
    return this.featureMap.get(page) || [];
  }

  getFeaturesForUser(
    page: string,
    userTier: "guest" | "standard" | "premium" | "admin",
  ): FeatureMapping[] {
    const pageFeatures = this.getFeaturesForPage(page);
    const tierLevels = { guest: 2, standard: 5, premium: 8, admin: 10 };
    const userLevel = tierLevels[userTier];

    return pageFeatures.filter((feature) => {
      const featureTierLevel = tierLevels[feature.tier];
      return featureTierLevel <= userLevel;
    });
  }

  getMissingFeaturesForUser(
    page: string,
    userTier: "guest" | "standard" | "premium" | "admin",
  ): FeatureMapping[] {
    const pageFeatures = this.getFeaturesForPage(page);
    const userFeatures = this.getFeaturesForUser(page, userTier);

    return pageFeatures.filter(
      (feature) =>
        !userFeatures.some((userFeature) => userFeature.id === feature.id),
    );
  }

  getUserTierAccess(
    tier: "guest" | "standard" | "premium" | "admin",
  ): UserTierAccess | null {
    return this.tierDefinitions.get(tier) || null;
  }

  getCurrentUserTier(): "guest" | "standard" | "premium" | "admin" {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return "guest";

      const user = JSON.parse(userString);
      if (user.isAdmin || user.email === "haynes.d1993@yahoo.com")
        return "admin";
      if (user.isPremium) return "premium";
      if (user.name) return "standard";
      return "guest";
    } catch {
      return "guest";
    }
  }

  validateUserAccess(
    page: string,
    featureId: string,
  ): {
    hasAccess: boolean;
    reason?: string;
    recommendations?: string[];
  } {
    const userTier = this.getCurrentUserTier();
    const userFeatures = this.getFeaturesForUser(page, userTier);
    const hasFeature = userFeatures.some((feature) => feature.id === featureId);

    if (hasFeature) {
      return { hasAccess: true };
    }

    const tierAccess = this.getUserTierAccess(userTier);
    return {
      hasAccess: false,
      reason: `Feature requires higher tier access`,
      recommendations: tierAccess?.recommendations || [],
    };
  }

  checkPageElementsForUser(page: string): {
    availableFeatures: FeatureMapping[];
    missingFeatures: FeatureMapping[];
    recommendations: string[];
  } {
    const userTier = this.getCurrentUserTier();
    const availableFeatures = this.getFeaturesForUser(page, userTier);
    const missingFeatures = this.getMissingFeaturesForUser(page, userTier);
    const tierAccess = this.getUserTierAccess(userTier);

    return {
      availableFeatures,
      missingFeatures,
      recommendations: tierAccess?.recommendations || [],
    };
  }

  // Feature validation methods
  async validatePageFeatures(page: string): Promise<{
    validFeatures: FeatureMapping[];
    invalidFeatures: FeatureMapping[];
    missingElements: FeatureMapping[];
  }> {
    const userTier = this.getCurrentUserTier();
    const features = this.getFeaturesForUser(page, userTier);

    const validFeatures: FeatureMapping[] = [];
    const invalidFeatures: FeatureMapping[] = [];
    const missingElements: FeatureMapping[] = [];

    for (const feature of features) {
      try {
        const elements = document.querySelectorAll(feature.element);

        if (elements.length === 0) {
          missingElements.push(feature);
        } else {
          // Check if element is functional
          const element = elements[0] as HTMLElement;
          const isVisible = window.getComputedStyle(element).display !== "none";
          const isEnabled = !element.disabled;

          if (isVisible && isEnabled) {
            validFeatures.push(feature);
          } else {
            invalidFeatures.push(feature);
          }
        }
      } catch (error) {
        console.warn(`Error checking feature ${feature.id}:`, error);
        invalidFeatures.push(feature);
      }
    }

    return { validFeatures, invalidFeatures, missingElements };
  }

  // Get feature mapping for specific element
  getFeatureForElement(
    page: string,
    element: HTMLElement,
  ): FeatureMapping | null {
    const features = this.getFeaturesForPage(page);

    for (const feature of features) {
      try {
        if (element.matches(feature.element)) {
          return feature;
        }
      } catch (error) {
        // Invalid selector, continue
      }
    }

    return null;
  }

  // Generate feature report
  generateFeatureReport(page: string): {
    userTier: string;
    totalFeatures: number;
    availableFeatures: number;
    missingFeatures: number;
    accessLevel: number;
    recommendations: string[];
  } {
    const userTier = this.getCurrentUserTier();
    const pageFeatures = this.getFeaturesForPage(page);
    const userFeatures = this.getFeaturesForUser(page, userTier);
    const tierAccess = this.getUserTierAccess(userTier);

    return {
      userTier,
      totalFeatures: pageFeatures.length,
      availableFeatures: userFeatures.length,
      missingFeatures: pageFeatures.length - userFeatures.length,
      accessLevel: tierAccess?.accessLevel || 0,
      recommendations: tierAccess?.recommendations || [],
    };
  }
}

export default AccountFeaturesMapper.getInstance();
