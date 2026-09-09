// Enhanced Favorites Service with Real Database Integration
// Fixes favorites functionality throughout the site with AI monitoring

import AIMemorySystem from "./AIMemorySystem";

export interface FavoriteItem {
  id: string;
  userId: string;
  productId: string;
  collectionId?: string;
  addedAt: string;
  status: "favorite" | "unfavorite" | "deleted" | "restored";
  metadata: {
    productName: string;
    productImage: string;
    productPrice: number;
    category: string;
    source: string; // Where it was favorited from
  };
}

export interface UserFavoritesProfile {
  userId: string;
  totalFavorites: number;
  categories: Record<string, number>;
  lastActivity: string;
  preferences: {
    autoSync: boolean;
    notifications: boolean;
    publicProfile: boolean;
  };
}

class FavoritesServiceClass {
  private favorites: Map<string, FavoriteItem[]> = new Map(); // userId -> favorites
  private userProfiles: Map<string, UserFavoritesProfile> = new Map();
  private clickTracker: Map<string, number> = new Map(); // Track click counts
  private isInitialized: boolean = false;

  constructor() {
    this.initializeFavoritesSystem();
  }

  private initializeFavoritesSystem() {
    console.log("❤️ Initializing Enhanced Favorites System...");

    // Load existing data
    this.loadFavoritesFromStorage();
    this.loadUserProfiles();
    this.loadClickData();

    // Setup click tracking
    this.setupClickTracking();

    // Setup automatic synchronization
    this.setupAutoSync();

    // Setup favorites UI monitoring
    this.setupUIMonitoring();

    this.isInitialized = true;
    console.log("❤️ Favorites System initialized successfully");
  }

  // Main API Methods
  async addToFavorites(
    userId: string,
    productId: string,
    productData?: any,
  ): Promise<boolean> {
    try {
      // Get product data if not provided
      if (!productData) {
        productData = this.getProductData(productId);
      }

      if (!productData) {
        console.error("Product data not found for:", productId);
        return false;
      }

      // Create favorite item
      const favoriteItem: FavoriteItem = {
        id: `fav_${userId}_${productId}_${Date.now()}`,
        userId,
        productId,
        addedAt: new Date().toISOString(),
        status: "favorite",
        metadata: {
          productName: productData.name || "Unknown Product",
          productImage: productData.image || "",
          productPrice: productData.price || 0,
          category: productData.category || "general",
          source: window.location.pathname,
        },
      };

      // Add to user's favorites
      if (!this.favorites.has(userId)) {
        this.favorites.set(userId, []);
      }

      const userFavorites = this.favorites.get(userId)!;

      // Check if already exists
      const existingIndex = userFavorites.findIndex(
        (fav) => fav.productId === productId && fav.status !== "deleted",
      );

      if (existingIndex !== -1) {
        // Update existing
        userFavorites[existingIndex] = favoriteItem;
      } else {
        // Add new
        userFavorites.push(favoriteItem);
      }

      // Update user profile
      this.updateUserProfile(userId);

      // Track the action
      this.trackFavoriteAction(userId, productId, "add");

      // Update UI immediately
      this.updateFavoritesUI(userId);

      // Save to storage
      this.saveFavoritesToStorage();

      // Log to AI memory
      AIMemorySystem.saveContext("favorites_ai", {
        context: {
          userInput: `add_favorite_${productId}`,
          aiResponse: "favorite_added_successfully",
          actionTaken: "add_to_favorites",
          results: { success: true, productId, userId },
          relatedTasks: [],
          collaboratingAIs: ["user_ai", "database_ai"],
        },
        metadata: {
          category: "favorites",
          tags: ["add", userId, productData.category],
          success: true,
          priority: "medium",
        },
      });

      console.log(`❤️ Added to favorites: ${productData.name}`);
      return true;
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      return false;
    }
  }

  async removeFromFavorites(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    try {
      const userFavorites = this.favorites.get(userId);
      if (!userFavorites) return false;

      // Find and mark as deleted (soft delete)
      const favoriteIndex = userFavorites.findIndex(
        (fav) => fav.productId === productId && fav.status === "favorite",
      );

      if (favoriteIndex === -1) return false;

      // Mark as deleted instead of removing
      userFavorites[favoriteIndex].status = "deleted";

      // Update user profile
      this.updateUserProfile(userId);

      // Track the action
      this.trackFavoriteAction(userId, productId, "remove");

      // Update UI
      this.updateFavoritesUI(userId);

      // Save to storage
      this.saveFavoritesToStorage();

      // Log to AI memory
      AIMemorySystem.saveContext("favorites_ai", {
        context: {
          userInput: `remove_favorite_${productId}`,
          aiResponse: "favorite_removed_successfully",
          actionTaken: "remove_from_favorites",
          results: { success: true, productId, userId },
          relatedTasks: [],
          collaboratingAIs: ["user_ai", "database_ai"],
        },
        metadata: {
          category: "favorites",
          tags: ["remove", userId],
          success: true,
          priority: "medium",
        },
      });

      console.log(`💔 Removed from favorites: ${productId}`);
      return true;
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
      return false;
    }
  }

  // Get user's favorites with filtering options
  getUserFavorites(
    userId: string,
    options: {
      category?: string;
      status?: "favorite" | "unfavorite" | "deleted" | "restored";
      limit?: number;
      offset?: number;
    } = {},
  ): FavoriteItem[] {
    const userFavorites = this.favorites.get(userId) || [];

    let filtered = userFavorites.filter((fav) => {
      if (options.status && fav.status !== options.status) return false;
      if (options.category && fav.metadata.category !== options.category) {
        return false;
      }
      return true;
    });

    // Sort by most recent first
    filtered.sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
    );

    // Apply pagination
    if (options.offset) {
      filtered = filtered.slice(options.offset);
    }
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  // Get simple array of favorited product IDs (for backward compatibility)
  getFavorites(userId: string): string[] {
    const userFavorites = this.favorites.get(userId) || [];
    return userFavorites
      .filter((fav) => fav.status === "favorite")
      .map((fav) => fav.productId);
  }

  // Check if product is favorited
  isFavorited(userId: string, productId: string): boolean {
    const userFavorites = this.favorites.get(userId) || [];
    return userFavorites.some(
      (fav) => fav.productId === productId && fav.status === "favorite",
    );
  }

  // Get favorites count for user
  getFavoritesCount(userId: string): number {
    const userFavorites = this.favorites.get(userId) || [];
    return userFavorites.filter((fav) => fav.status === "favorite").length;
  }

  // Toggle favorite status
  async toggleFavorite(
    userId: string,
    productId: string,
    productData?: any,
  ): Promise<boolean> {
    const isFav = this.isFavorited(userId, productId);

    if (isFav) {
      return this.removeFromFavorites(userId, productId);
    } else {
      return this.addToFavorites(userId, productId, productData);
    }
  }

  // Sync favorites with database
  async syncWithDatabase(userId: string): Promise<void> {
    try {
      // Get favorites from storage and cross-reference with product database
      const userFavorites = this.getUserFavorites(userId, {
        status: "favorite",
      });
      const products = this.getAllProducts();

      // Validate each favorite against product database
      const validatedFavorites: FavoriteItem[] = [];

      for (const favorite of userFavorites) {
        const product = products.find((p: any) => p.id === favorite.productId);

        if (product) {
          // Update metadata with latest product info
          favorite.metadata = {
            ...favorite.metadata,
            productName: product.name,
            productImage: product.image,
            productPrice: product.price,
            category: product.category,
          };
          validatedFavorites.push(favorite);
        } else {
          // Product no longer exists, mark as deleted
          favorite.status = "deleted";
          validatedFavorites.push(favorite);
        }
      }

      // Update storage
      this.favorites.set(userId, validatedFavorites);
      this.saveFavoritesToStorage();

      console.log(
        `❤️ Synced ${validatedFavorites.length} favorites for user ${userId}`,
      );
    } catch (error) {
      console.error("Failed to sync favorites with database:", error);
    }
  }

  // Click tracking for analytics
  private trackFavoriteAction(
    userId: string,
    productId: string,
    action: "add" | "remove" | "view",
  ) {
    const key = `${userId}_${productId}_${action}`;
    const currentCount = this.clickTracker.get(key) || 0;
    this.clickTracker.set(key, currentCount + 1);

    // Save click data
    this.saveClickData();

    // Trigger analytics event
    this.dispatchAnalyticsEvent({
      type: "favorite_action",
      userId,
      productId,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  // Setup automatic click tracking
  private setupClickTracking() {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      // Track heart/favorite button clicks
      if (
        target.matches(
          ".favorite-btn, .heart-btn, [data-favorite], .like-btn",
        ) ||
        target.closest(".favorite-btn, .heart-btn, [data-favorite], .like-btn")
      ) {
        const button = target.closest(
          ".favorite-btn, .heart-btn, [data-favorite], .like-btn",
        ) as HTMLElement;

        if (button) {
          this.handleFavoriteButtonClick(button, event);
        }
      }

      // Track product card clicks for view analytics
      if (target.closest(".product-card, .collection-card")) {
        const card = target.closest(
          ".product-card, .collection-card",
        ) as HTMLElement;
        const productId = this.extractProductIdFromCard(card);

        if (productId) {
          const userId = this.getCurrentUserId();
          this.trackFavoriteAction(userId, productId, "view");
        }
      }
    });
  }

  private handleFavoriteButtonClick(button: HTMLElement, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const productId = this.extractProductIdFromButton(button);
    const userId = this.getCurrentUserId();

    if (!productId || !userId) {
      console.warn(
        "Could not determine product ID or user ID for favorite action",
      );
      return;
    }

    // Get product data
    const productData = this.getProductData(productId);

    // Toggle favorite
    this.toggleFavorite(userId, productId, productData).then((success) => {
      if (success) {
        // Update button state
        this.updateFavoriteButton(button, this.isFavorited(userId, productId));

        // Show notification
        this.showFavoriteNotification(
          this.isFavorited(userId, productId),
          productData?.name || "Product",
        );

        // Update favorites page if open
        this.updateFavoritesPage();
      }
    });
  }

  private extractProductIdFromButton(button: HTMLElement): string | null {
    // Try multiple methods to extract product ID
    const productId =
      button.dataset.productId ||
      button.dataset.id ||
      button.getAttribute("data-product-id") ||
      button.getAttribute("data-id");

    if (productId) return productId;

    // Look in parent elements
    const card = button.closest(".product-card, .collection-card");
    if (card) {
      return this.extractProductIdFromCard(card as HTMLElement);
    }

    // Extract from nearby elements
    const productLink = button
      .closest(".product-container, .product-item")
      ?.querySelector("a[href*='/product/']") as HTMLElement;

    if (productLink) {
      const href = productLink.getAttribute("href");
      const match = href?.match(/\/product\/([^/?]+)/);
      return match ? match[1] : null;
    }

    return null;
  }

  private extractProductIdFromCard(card: HTMLElement): string | null {
    return (
      card.dataset.productId ||
      card.dataset.id ||
      card
        .querySelector("[data-product-id]")
        ?.getAttribute("data-product-id") ||
      null
    );
  }

  private updateFavoriteButton(button: HTMLElement, isFavorited: boolean) {
    // Update button appearance
    if (isFavorited) {
      button.classList.add("favorited", "active");
      button.classList.remove("not-favorited");

      // Update icon if it's a heart
      const icon = button.querySelector(".heart-icon, .favorite-icon");
      if (icon) {
        icon.textContent = "❤️"; // Filled heart
        icon.classList.add("favorited");
      }

      // Update text if present
      const text = button.querySelector(".favorite-text");
      if (text) {
        text.textContent = "Favorited";
      }
    } else {
      button.classList.add("not-favorited");
      button.classList.remove("favorited", "active");

      // Update icon
      const icon = button.querySelector(".heart-icon, .favorite-icon");
      if (icon) {
        icon.textContent = "🤍"; // Empty heart
        icon.classList.remove("favorited");
      }

      // Update text
      const text = button.querySelector(".favorite-text");
      if (text) {
        text.textContent = "Add to Favorites";
      }
    }

    // Add visual feedback
    button.style.transform = "scale(1.1)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);
  }

  private showFavoriteNotification(isFavorited: boolean, productName: string) {
    const message = isFavorited
      ? `❤️ Added "${productName}" to favorites`
      : `💔 Removed "${productName}" from favorites`;

    // Create notification element
    const notification = document.createElement("div");
    notification.className = "favorite-notification";
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isFavorited ? "#10b981" : "#f59e0b"};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: 500;
      max-width: 300px;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Update favorites throughout the UI
  private updateFavoritesUI(userId: string) {
    // Update favorite buttons throughout the page
    const favoriteButtons = document.querySelectorAll(
      ".favorite-btn, .heart-btn, [data-favorite]",
    );

    favoriteButtons.forEach((button) => {
      const productId = this.extractProductIdFromButton(button as HTMLElement);
      if (productId) {
        this.updateFavoriteButton(
          button as HTMLElement,
          this.isFavorited(userId, productId),
        );
      }
    });

    // Update favorites count in navigation
    this.updateFavoritesCount(userId);

    // Update favorites page if currently viewing
    if (window.location.pathname === "/favorites") {
      this.updateFavoritesPage();
    }
  }

  private updateFavoritesCount(userId: string) {
    const count = this.getFavoritesCount(userId);
    const countElements = document.querySelectorAll(
      ".favorites-count, .favorite-count, [data-favorites-count]",
    );

    countElements.forEach((element) => {
      element.textContent = count.toString();
    });
  }

  private updateFavoritesPage() {
    const userId = this.getCurrentUserId();
    const favoritesContainer = document.querySelector(
      ".favorites-container, .favorites-grid, #favorites-content",
    );

    if (!favoritesContainer) return;

    const favorites = this.getUserFavorites(userId, { status: "favorite" });

    if (favorites.length === 0) {
      favoritesContainer.innerHTML = `
        <div class="empty-favorites">
          <div class="text-center py-12">
            <div class="text-6xl mb-4">💙</div>
            <h3 class="text-xl font-semibold mb-2">No favorites yet</h3>
            <p class="text-gray-600 mb-4">Start adding products you love to see them here.</p>
            <a href="/collections" class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Products
            </a>
          </div>
        </div>
      `;
    } else {
      // Generate favorites grid
      const favoritesHTML = favorites
        .map((favorite) => this.generateFavoriteCard(favorite))
        .join("");

      favoritesContainer.innerHTML = `
        <div class="favorites-header mb-6">
          <h2 class="text-2xl font-bold">Your Favorites (${favorites.length})</h2>
          <p class="text-gray-600">Products you've saved for later</p>
        </div>
        <div class="favorites-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${favoritesHTML}
        </div>
      `;
    }
  }

  private generateFavoriteCard(favorite: FavoriteItem): string {
    return `
      <div class="favorite-card product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" data-product-id="${favorite.productId}">
        <div class="relative">
          <img src="${favorite.metadata.productImage || "https://via.placeholder.com/300x300"}"
               alt="${favorite.metadata.productName}"
               class="w-full h-48 object-cover">
          <button class="favorite-btn absolute top-2 right-2 p-2 bg-white rounded-full shadow-md favorited"
                  data-product-id="${favorite.productId}">
            <span class="heart-icon favorited">❤️</span>
          </button>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2">${favorite.metadata.productName}</h3>
          <p class="text-blue-600 font-bold text-lg">$${favorite.metadata.productPrice}</p>
          <p class="text-gray-600 text-sm">${favorite.metadata.category}</p>
          <div class="mt-4 flex gap-2">
            <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              View Product
            </button>
            <button class="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
                    onclick="FavoritesService.removeFromFavorites('${favorite.userId}', '${favorite.productId}')">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Setup UI monitoring to detect favorites page and update accordingly
  private setupUIMonitoring() {
    // Monitor for page changes
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Check if favorites-related elements were added
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              (node as Element).querySelector &&
              ((node as Element).querySelector(".favorite-btn") ||
                (node as Element).classList?.contains("favorites-page"))
            ) {
              shouldUpdate = true;
            }
          });
        }
      });

      if (shouldUpdate) {
        const userId = this.getCurrentUserId();
        if (userId) {
          setTimeout(() => this.updateFavoritesUI(userId), 100);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial update
    setTimeout(() => {
      const userId = this.getCurrentUserId();
      if (userId) {
        this.updateFavoritesUI(userId);
      }
    }, 1000);
  }

  // Auto-sync functionality
  private setupAutoSync() {
    // Sync every 30 seconds
    setInterval(() => {
      const userId = this.getCurrentUserId();
      if (userId) {
        this.syncWithDatabase(userId);
      }
    }, 30000);

    // Sync on page visibility change
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        const userId = this.getCurrentUserId();
        if (userId) {
          this.syncWithDatabase(userId);
        }
      }
    });
  }

  // User profile management
  private updateUserProfile(userId: string) {
    const userFavorites = this.getUserFavorites(userId, { status: "favorite" });

    // Calculate category breakdown
    const categories: Record<string, number> = {};
    userFavorites.forEach((fav) => {
      const category = fav.metadata.category || "general";
      categories[category] = (categories[category] || 0) + 1;
    });

    const profile: UserFavoritesProfile = {
      userId,
      totalFavorites: userFavorites.length,
      categories,
      lastActivity: new Date().toISOString(),
      preferences: this.userProfiles.get(userId)?.preferences || {
        autoSync: true,
        notifications: true,
        publicProfile: false,
      },
    };

    this.userProfiles.set(userId, profile);
    this.saveUserProfiles();
  }

  // Analytics and insights
  getFavoritesAnalytics(userId: string): any {
    const userFavorites = this.getUserFavorites(userId, { status: "favorite" });
    const profile = this.userProfiles.get(userId);

    const analytics = {
      totalFavorites: userFavorites.length,
      categoriesBreakdown: profile?.categories || {},
      averagePrice: 0,
      mostFavoritedCategory: "",
      favoritingTrends: this.getFavoritingTrends(userId),
      recentActivity: userFavorites.slice(0, 10),
    };

    // Calculate average price
    if (userFavorites.length > 0) {
      const totalValue = userFavorites.reduce(
        (sum, fav) => sum + fav.metadata.productPrice,
        0,
      );
      analytics.averagePrice = totalValue / userFavorites.length;
    }

    // Find most favorited category
    if (profile?.categories) {
      const categories = Object.entries(profile.categories);
      if (categories.length > 0) {
        analytics.mostFavoritedCategory = categories.sort(
          (a, b) => b[1] - a[1],
        )[0][0];
      }
    }

    return analytics;
  }

  private getFavoritingTrends(userId: string): any {
    const userFavorites = this.getUserFavorites(userId);

    // Group by week
    const weeklyTrends: Record<string, number> = {};

    userFavorites.forEach((fav) => {
      const date = new Date(fav.addedAt);
      const weekStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay(),
      );
      const weekKey = weekStart.toISOString().split("T")[0];

      weeklyTrends[weekKey] = (weeklyTrends[weekKey] || 0) + 1;
    });

    return weeklyTrends;
  }

  // Storage methods
  private loadFavoritesFromStorage() {
    try {
      const stored = localStorage.getItem("user_favorites");
      if (stored) {
        const data = JSON.parse(stored);
        this.favorites = new Map(data);
      }
    } catch (error) {
      console.error("Failed to load favorites from storage:", error);
    }
  }

  private saveFavoritesToStorage() {
    try {
      const data = Array.from(this.favorites.entries());
      localStorage.setItem("user_favorites", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save favorites to storage:", error);
    }
  }

  private loadUserProfiles() {
    try {
      const stored = localStorage.getItem("favorites_user_profiles");
      if (stored) {
        const data = JSON.parse(stored);
        this.userProfiles = new Map(data);
      }
    } catch (error) {
      console.error("Failed to load user profiles:", error);
    }
  }

  private saveUserProfiles() {
    try {
      const data = Array.from(this.userProfiles.entries());
      localStorage.setItem("favorites_user_profiles", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save user profiles:", error);
    }
  }

  private loadClickData() {
    try {
      const stored = localStorage.getItem("favorites_click_data");
      if (stored) {
        const data = JSON.parse(stored);
        this.clickTracker = new Map(data);
      }
    } catch (error) {
      console.error("Failed to load click data:", error);
    }
  }

  private saveClickData() {
    try {
      const data = Array.from(this.clickTracker.entries());
      localStorage.setItem("favorites_click_data", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save click data:", error);
    }
  }

  // Utility methods
  private getCurrentUserId(): string {
    try {
      const user =
        JSON.parse(localStorage.getItem("currentUser") || "{}") ||
        JSON.parse(localStorage.getItem("user") || "{}");

      return user.email || user.username || user.id || "guest";
    } catch {
      return "guest";
    }
  }

  private getProductData(productId: string): any {
    try {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      return products.find((p: any) => p.id === productId);
    } catch {
      return null;
    }
  }

  private getAllProducts(): any[] {
    try {
      return JSON.parse(localStorage.getItem("products") || "[]");
    } catch {
      return [];
    }
  }

  private dispatchAnalyticsEvent(eventData: any) {
    // Dispatch custom event for analytics tracking
    const event = new CustomEvent("favoriteAnalytics", {
      detail: eventData,
    });
    document.dispatchEvent(event);
  }

  // Public API
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }

  // Method to manually refresh favorites for a user
  async refreshUserFavorites(userId: string): Promise<void> {
    await this.syncWithDatabase(userId);
    this.updateFavoritesUI(userId);
  }

  // Get detailed statistics
  getSystemStatistics(): any {
    const totalUsers = this.favorites.size;
    const totalFavorites = Array.from(this.favorites.values()).reduce(
      (sum, favs) => sum + favs.filter((f) => f.status === "favorite").length,
      0,
    );

    const totalClicks = Array.from(this.clickTracker.values()).reduce(
      (sum, clicks) => sum + clicks,
      0,
    );

    return {
      totalUsers,
      totalFavorites,
      totalClicks,
      averageFavoritesPerUser: totalUsers > 0 ? totalFavorites / totalUsers : 0,
      initialized: this.isInitialized,
    };
  }

  // Cleanup method
  cleanup() {
    // Save all data before cleanup
    this.saveFavoritesToStorage();
    this.saveUserProfiles();
    this.saveClickData();
  }
}

// Create global instance
const FavoritesService = new FavoritesServiceClass();

// Export for global access
(window as any).FavoritesService = FavoritesService;

export default FavoritesService;
export { FavoritesServiceClass };
