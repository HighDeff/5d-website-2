interface FavoriteClick {
  userId: string;
  productId: string;
  timestamp: Date;
  action: "add" | "remove";
  pageLocation: string;
  sessionId: string;
}

interface UserFavorites {
  userId: string;
  favorites: string[];
  clickHistory: FavoriteClick[];
  lastUpdated: Date;
  syncWithBackend: boolean;
}

class FavoritesTrackingAI {
  private userFavorites: Map<string, UserFavorites> = new Map();
  private clickQueue: FavoriteClick[] = [];
  private sessionId: string = this.generateSessionId();

  constructor() {
    this.loadUserFavorites();
    this.startBackgroundSync();
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track favorite click and update user favorites
   */
  trackFavoriteClick(
    userId: string,
    productId: string,
    action: "add" | "remove",
  ): boolean {
    try {
      // Get or create user favorites
      let userFavs = this.userFavorites.get(userId);
      if (!userFavs) {
        userFavs = {
          userId,
          favorites: [],
          clickHistory: [],
          lastUpdated: new Date(),
          syncWithBackend: false,
        };
        this.userFavorites.set(userId, userFavs);
      }

      // Create click record
      const click: FavoriteClick = {
        userId,
        productId,
        timestamp: new Date(),
        action,
        pageLocation: window.location.pathname,
        sessionId: this.sessionId,
      };

      // Update favorites list
      if (action === "add") {
        if (!userFavs.favorites.includes(productId)) {
          userFavs.favorites.push(productId);
        }
      } else {
        userFavs.favorites = userFavs.favorites.filter(
          (id) => id !== productId,
        );
      }

      // Add to click history
      userFavs.clickHistory.push(click);
      userFavs.lastUpdated = new Date();

      // Add to queue for processing
      this.clickQueue.push(click);

      // Save to localStorage immediately
      this.saveUserFavorites();

      // Trigger real-time updates
      this.notifyFavoritesChanged(userId, productId, action);

      console.log(`✅ Favorites AI: ${action} ${productId} for user ${userId}`);
      return action === "add";
    } catch (error) {
      console.error("❌ Favorites AI Error:", error);
      return false;
    }
  }

  /**
   * Get user favorites with AI insights
   */
  getUserFavorites(userId: string): {
    favorites: string[];
    insights: {
      totalFavorites: number;
      recentActivity: FavoriteClick[];
      mostActiveDay: string;
      favoriteCategories: string[];
    };
  } {
    const userFavs = this.userFavorites.get(userId);
    if (!userFavs) {
      return {
        favorites: [],
        insights: {
          totalFavorites: 0,
          recentActivity: [],
          mostActiveDay: "No activity",
          favoriteCategories: [],
        },
      };
    }

    // Generate AI insights
    const recentActivity = userFavs.clickHistory
      .slice(-10)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const dayActivity = userFavs.clickHistory.reduce(
      (acc, click) => {
        const day = click.timestamp.toDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostActiveDay =
      Object.keys(dayActivity).length > 0
        ? Object.entries(dayActivity).sort(([, a], [, b]) => b - a)[0][0]
        : "No activity";

    return {
      favorites: [...userFavs.favorites],
      insights: {
        totalFavorites: userFavs.favorites.length,
        recentActivity,
        mostActiveDay,
        favoriteCategories: this.analyzeFavoriteCategories(userFavs.favorites),
      },
    };
  }

  /**
   * Check if product is favorited by user
   */
  isFavorited(userId: string, productId: string): boolean {
    const userFavs = this.userFavorites.get(userId);
    return userFavs ? userFavs.favorites.includes(productId) : false;
  }

  /**
   * Get all user favorites for favorites page
   */
  getAllUserFavorites(userId: string): string[] {
    const userFavs = this.userFavorites.get(userId);
    return userFavs ? [...userFavs.favorites] : [];
  }

  /**
   * Sync with existing FavoritesService
   */
  syncWithFavoritesService(userId: string): void {
    try {
      // Import existing favorites from FavoritesService
      const { default: FavoritesService } = require("./FavoritesService");
      const existingFavorites = FavoritesService.getFavorites(userId);

      if (existingFavorites.length > 0) {
        const userFavs = this.userFavorites.get(userId) || {
          userId,
          favorites: [],
          clickHistory: [],
          lastUpdated: new Date(),
          syncWithBackend: false,
        };

        // Merge favorites
        const allFavorites = [
          ...new Set([...userFavs.favorites, ...existingFavorites]),
        ];
        userFavs.favorites = allFavorites;
        userFavs.lastUpdated = new Date();

        this.userFavorites.set(userId, userFavs);
        this.saveUserFavorites();

        console.log(
          `🔄 Synced ${allFavorites.length} favorites for user ${userId}`,
        );
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
  }

  private analyzeFavoriteCategories(favoriteIds: string[]): string[] {
    // This would typically fetch product data to analyze categories
    // For now, return placeholder categories
    return ["Fashion", "Electronics", "Home & Garden"];
  }

  private notifyFavoritesChanged(
    userId: string,
    productId: string,
    action: "add" | "remove",
  ): void {
    // Dispatch custom event for real-time UI updates
    window.dispatchEvent(
      new CustomEvent("favoritesChanged", {
        detail: { userId, productId, action },
      }),
    );

    // Update DOM elements immediately
    this.updateFavoriteButtonsInDOM(productId, action === "add");
  }

  private updateFavoriteButtonsInDOM(
    productId: string,
    isFavorited: boolean,
  ): void {
    // Update all favorite buttons for this product
    const buttons = document.querySelectorAll(
      `[data-product-id="${productId}"] .favorite-btn, [data-favorite-product="${productId}"]`,
    );

    buttons.forEach((button) => {
      const heartIcon = button.querySelector(
        '.heart-icon, [data-icon="heart"]',
      );
      if (heartIcon) {
        if (isFavorited) {
          heartIcon.classList.add("text-red-500", "fill-current");
          heartIcon.classList.remove("text-gray-400");
        } else {
          heartIcon.classList.remove("text-red-500", "fill-current");
          heartIcon.classList.add("text-gray-400");
        }
      }
    });

    // Update favorites count if displayed
    const countElements = document.querySelectorAll(
      `[data-favorite-count="${productId}"]`,
    );
    countElements.forEach((element) => {
      const currentCount = parseInt(element.textContent || "0");
      element.textContent = (currentCount + (isFavorited ? 1 : -1)).toString();
    });
  }

  private loadUserFavorites(): void {
    try {
      const saved = localStorage.getItem("userFavoritesAI");
      if (saved) {
        const data = JSON.parse(saved);

        // Reconstruct Map with proper Date objects
        for (const [userId, userData] of Object.entries(data as any)) {
          const userFavs: UserFavorites = {
            ...userData,
            lastUpdated: new Date(userData.lastUpdated),
            clickHistory: userData.clickHistory.map((click: any) => ({
              ...click,
              timestamp: new Date(click.timestamp),
            })),
          };
          this.userFavorites.set(userId, userFavs);
        }

        console.log(`📱 Loaded favorites for ${this.userFavorites.size} users`);
      }
    } catch (error) {
      console.error("Error loading user favorites:", error);
    }
  }

  private saveUserFavorites(): void {
    try {
      // Convert Map to object for JSON storage
      const data = Object.fromEntries(this.userFavorites);
      localStorage.setItem("userFavoritesAI", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving user favorites:", error);
    }
  }

  private startBackgroundSync(): void {
    // Process click queue every 5 seconds
    setInterval(() => {
      this.processClickQueue();
    }, 5000);

    // Save favorites every 30 seconds
    setInterval(() => {
      this.saveUserFavorites();
    }, 30000);
  }

  private processClickQueue(): void {
    if (this.clickQueue.length === 0) return;

    // Process clicks for analytics
    this.clickQueue.forEach((click) => {
      // Send to analytics service
      this.sendToAnalytics(click);
    });

    // Clear processed clicks
    this.clickQueue = [];
  }

  private sendToAnalytics(click: FavoriteClick): void {
    // Send click data to analytics service
    console.log(
      `📊 Analytics: ${click.action} favorite ${click.productId} by ${click.userId}`,
    );
  }

  /**
   * Export favorites data for user
   */
  exportUserData(userId: string): any {
    const userFavs = this.userFavorites.get(userId);
    if (!userFavs) return null;

    return {
      userId,
      favorites: userFavs.favorites,
      totalClicks: userFavs.clickHistory.length,
      firstActivity: userFavs.clickHistory[0]?.timestamp,
      lastActivity: userFavs.lastUpdated,
      sessionStats: this.getSessionStats(userId),
    };
  }

  private getSessionStats(userId: string): any {
    const userFavs = this.userFavorites.get(userId);
    if (!userFavs) return {};

    const sessions = userFavs.clickHistory.reduce(
      (acc, click) => {
        acc[click.sessionId] = (acc[click.sessionId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalSessions: Object.keys(sessions).length,
      avgClicksPerSession:
        Object.values(sessions).reduce((a, b) => a + b, 0) /
          Object.keys(sessions).length || 0,
    };
  }

  /**
   * Get real-time favorites stats for admin dashboard
   */
  getSystemStats(): any {
    const totalUsers = this.userFavorites.size;
    const totalFavorites = Array.from(this.userFavorites.values()).reduce(
      (sum, user) => sum + user.favorites.length,
      0,
    );
    const totalClicks = Array.from(this.userFavorites.values()).reduce(
      (sum, user) => sum + user.clickHistory.length,
      0,
    );

    return {
      totalUsers,
      totalFavorites,
      totalClicks,
      avgFavoritesPerUser: totalUsers > 0 ? totalFavorites / totalUsers : 0,
      recentActivity: this.clickQueue.length,
    };
  }
}

export const favoritesTrackingAI = new FavoritesTrackingAI();
export type { FavoriteClick, UserFavorites };
