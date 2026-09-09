/**
 * Enhanced Favorites Manager with AI Oversight
 * Comprehensive favorites system with database sync, AI detection, and real-time updates
 */

interface FavoriteRecord {
  id: string;
  userId: string;
  productId: string;
  status: "favorite" | "unfavorite" | "deleted" | "restored";
  timestamp: string;
  source: "user_click" | "ai_detection" | "system_sync" | "migration";
  confidence: number; // AI confidence in the action
  metadata: {
    page: string;
    buttonState: boolean;
    clickCoordinates?: { x: number; y: number };
    sessionId: string;
  };
}

interface DatabaseSyncStatus {
  lastSync: string;
  pendingUpdates: number;
  syncInProgress: boolean;
  retryCount: number;
  nextRetry?: string;
}

interface AIFavoritesResponse {
  success: boolean;
  updated: boolean;
  newState: boolean;
  confidence: number;
  requiresSync: boolean;
  message: string;
}

class EnhancedFavoritesManagerClass {
  private favoriteRecords: Map<string, FavoriteRecord[]> = new Map();
  private syncStatus: Map<string, DatabaseSyncStatus> = new Map();
  private aiQueue: Array<{
    userId: string;
    productId: string;
    action: string;
    timestamp: string;
    retries: number;
  }> = [];
  private updateListeners: Set<(update: any) => void> = new Set();

  constructor() {
    this.loadFromStorage();
    this.startAIProcessing();
    this.startDatabaseSync();
    this.setupClickDetection();
  }

  /**
   * Main favorites toggle with AI oversight
   */
  async toggleFavorite(
    userId: string,
    productId: string,
    clickEvent?: {
      x: number;
      y: number;
      buttonElement: HTMLElement;
      page: string;
    },
  ): Promise<{
    success: boolean;
    newState: boolean;
    confidence: number;
    requiresPageUpdate: boolean;
  }> {
    console.log(`🤖 AI Favorites: Processing toggle for ${productId}`);

    try {
      // Get current state
      const currentState = this.getCurrentFavoriteState(userId, productId);

      // Create favorite record
      const record: FavoriteRecord = {
        id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        productId,
        status: currentState ? "unfavorite" : "favorite",
        timestamp: new Date().toISOString(),
        source: clickEvent ? "user_click" : "ai_detection",
        confidence: 0.95,
        metadata: {
          page: clickEvent?.page || window.location.pathname,
          buttonState: !currentState,
          clickCoordinates: clickEvent
            ? { x: clickEvent.x, y: clickEvent.y }
            : undefined,
          sessionId: this.getSessionId(),
        },
      };

      // Add to records
      if (!this.favoriteRecords.has(userId)) {
        this.favoriteRecords.set(userId, []);
      }
      this.favoriteRecords.get(userId)!.push(record);

      // Save to storage immediately
      this.saveToStorage();

      // Update button state immediately
      this.updateButtonStates(productId, !currentState);

      // Queue for AI processing
      this.queueForAI(userId, productId, record.status);

      // Update all systems
      await this.updateAllSystems(userId, productId, !currentState);

      // Notify listeners
      this.notifyUpdateListeners({
        userId,
        productId,
        newState: !currentState,
        source: "favorites_toggle",
        timestamp: new Date().toISOString(),
      });

      console.log(
        `✅ AI Favorites: ${record.status} ${productId} for ${userId}`,
      );

      return {
        success: true,
        newState: !currentState,
        confidence: record.confidence,
        requiresPageUpdate: true,
      };
    } catch (error) {
      console.error("Error in AI favorites toggle:", error);
      return {
        success: false,
        newState: currentState,
        confidence: 0,
        requiresPageUpdate: false,
      };
    }
  }

  /**
   * Get current favorite state from records
   */
  getCurrentFavoriteState(userId: string, productId: string): boolean {
    const userRecords = this.favoriteRecords.get(userId) || [];

    // Get the most recent record for this product
    const productRecords = userRecords
      .filter((r) => r.productId === productId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    if (productRecords.length === 0) {
      return false;
    }

    const latestRecord = productRecords[0];
    return (
      latestRecord.status === "favorite" || latestRecord.status === "restored"
    );
  }

  /**
   * Get all favorites for user grouped by status
   */
  getUserFavorites(userId: string): {
    favorite: string[];
    unfavorite: string[];
    deleted: string[];
    restored: string[];
  } {
    const userRecords = this.favoriteRecords.get(userId) || [];
    const grouped = {
      favorite: [] as string[],
      unfavorite: [] as string[],
      deleted: [] as string[],
      restored: [] as string[],
    };

    // Group products by their latest status
    const productStates = new Map<string, string>();

    userRecords
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
      .forEach((record) => {
        productStates.set(record.productId, record.status);
      });

    productStates.forEach((status, productId) => {
      if (status in grouped) {
        grouped[status as keyof typeof grouped].push(productId);
      }
    });

    return grouped;
  }

  /**
   * Get favorites for display (only active favorites)
   */
  getActiveFavorites(userId: string): string[] {
    const favorites = this.getUserFavorites(userId);
    return [...favorites.favorite, ...favorites.restored];
  }

  /**
   * Update button states across all pages
   */
  private updateButtonStates(productId: string, newState: boolean): void {
    // Update all favorite buttons for this product
    const buttons = document.querySelectorAll(
      `[data-product-id="${productId}"][data-favorite-button]`,
    );

    buttons.forEach((button) => {
      const heartIcon = button.querySelector('.heart-icon, [class*="heart"]');

      if (heartIcon) {
        if (newState) {
          heartIcon.classList.add("text-red-500", "fill-current");
          heartIcon.classList.remove("text-gray-400");
        } else {
          heartIcon.classList.remove("text-red-500", "fill-current");
          heartIcon.classList.add("text-gray-400");
        }
      }

      // Update button attributes
      button.setAttribute("data-favorited", newState.toString());
      button.setAttribute(
        "aria-label",
        newState ? "Remove from favorites" : "Add to favorites",
      );
    });

    // Update any text indicators
    const indicators = document.querySelectorAll(
      `[data-product-id="${productId}"][data-favorite-indicator]`,
    );
    indicators.forEach((indicator) => {
      indicator.textContent = newState ? "Favorited" : "Add to Favorites";
    });
  }

  /**
   * Update all related systems
   */
  private async updateAllSystems(
    userId: string,
    productId: string,
    newState: boolean,
  ): Promise<void> {
    const updatePromises = [];

    // Update legacy favorites service
    try {
      const { default: FavoritesService } = await import("./FavoritesService");
      updatePromises.push(
        Promise.resolve(FavoritesService.toggleFavorite(productId, userId)),
      );
    } catch (error) {
      console.warn("Legacy FavoritesService not available:", error);
    }

    // Update social features service
    try {
      const { default: SocialFeaturesService } = await import(
        "./SocialFeaturesService"
      );
      updatePromises.push(
        Promise.resolve(
          SocialFeaturesService.toggleProductFavorite(userId, productId, ""),
        ),
      );
    } catch (error) {
      console.warn("SocialFeaturesService not available:", error);
    }

    // Update advanced engagement calculator
    try {
      const { AdvancedEngagementCalculator } = await import(
        "./AdvancedEngagementCalculator"
      );
      updatePromises.push(
        AdvancedEngagementCalculator.trackUserInteraction(
          userId,
          productId,
          newState ? "like" : "unlike",
          "favorites_system",
        ),
      );
    } catch (error) {
      console.warn("AdvancedEngagementCalculator not available:", error);
    }

    // Update favorites tracking AI
    try {
      const { favoritesTrackingAI } = await import("./FavoritesTrackingAI");
      updatePromises.push(
        Promise.resolve(
          favoritesTrackingAI.trackFavoriteClick(
            userId,
            productId,
            newState ? "add" : "remove",
          ),
        ),
      );
    } catch (error) {
      console.warn("FavoritesTrackingAI not available:", error);
    }

    // Execute all updates
    await Promise.allSettled(updatePromises);

    // Mark for database sync
    this.markForDatabaseSync(userId);
  }

  /**
   * Queue action for AI processing
   */
  private queueForAI(userId: string, productId: string, action: string): void {
    this.aiQueue.push({
      userId,
      productId,
      action,
      timestamp: new Date().toISOString(),
      retries: 0,
    });
  }

  /**
   * Start AI processing loop
   */
  private startAIProcessing(): void {
    setInterval(async () => {
      if (this.aiQueue.length > 0) {
        const batch = this.aiQueue.splice(0, 5); // Process 5 at a time

        for (const item of batch) {
          try {
            await this.processAIRequest(item);
          } catch (error) {
            console.error("AI processing error:", error);

            // Retry up to 3 times
            if (item.retries < 3) {
              item.retries++;
              this.aiQueue.push(item);
            }
          }
        }
      }
    }, 2000); // Process every 2 seconds
  }

  /**
   * Process individual AI request
   */
  private async processAIRequest(item: any): Promise<void> {
    // Simulate AI processing with intelligent response
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response: AIFavoritesResponse = {
      success: true,
      updated: true,
      newState: item.action === "favorite",
      confidence: 0.95,
      requiresSync: true,
      message: `AI processed ${item.action} for ${item.productId}`,
    };

    console.log(`🤖 AI Response: ${response.message}`);

    // If AI suggests different state, update accordingly
    if (response.updated && response.confidence > 0.8) {
      this.markForDatabaseSync(item.userId);
    }
  }

  /**
   * Mark user for database synchronization
   */
  private markForDatabaseSync(userId: string): void {
    const currentStatus = this.syncStatus.get(userId) || {
      lastSync: new Date(0).toISOString(),
      pendingUpdates: 0,
      syncInProgress: false,
      retryCount: 0,
    };

    currentStatus.pendingUpdates++;
    this.syncStatus.set(userId, currentStatus);
  }

  /**
   * Start database synchronization loop
   */
  private startDatabaseSync(): void {
    setInterval(async () => {
      for (const [userId, status] of this.syncStatus.entries()) {
        if (status.pendingUpdates > 0 && !status.syncInProgress) {
          await this.syncUserToDatabase(userId);
        }
      }
    }, 5000); // Sync every 5 seconds
  }

  /**
   * Sync user favorites to database
   */
  private async syncUserToDatabase(userId: string): Promise<void> {
    const status = this.syncStatus.get(userId);
    if (!status) return;

    status.syncInProgress = true;
    this.syncStatus.set(userId, status);

    try {
      console.log(`📊 Syncing favorites to database for user ${userId}`);

      // Get user's current favorites
      const favorites = this.getUserFavorites(userId);
      const activeFavorites = this.getActiveFavorites(userId);

      // Save to localStorage database
      localStorage.setItem(
        `userFavorites_${userId}`,
        JSON.stringify(favorites),
      );
      localStorage.setItem(
        `activeFavorites_${userId}`,
        JSON.stringify(activeFavorites),
      );

      // Update user data
      const userData = localStorage.getItem(`userData_${userId}`);
      if (userData) {
        const user = JSON.parse(userData);
        user.favoriteProducts = activeFavorites;
        user.favoritesLastUpdated = new Date().toISOString();
        localStorage.setItem(`userData_${userId}`, JSON.stringify(user));
      }

      // Reset sync status
      status.pendingUpdates = 0;
      status.lastSync = new Date().toISOString();
      status.syncInProgress = false;
      status.retryCount = 0;
      this.syncStatus.set(userId, status);

      console.log(`✅ Database sync completed for user ${userId}`);

      // Trigger page updates
      this.triggerPageUpdates(userId);
    } catch (error) {
      console.error(`Database sync failed for user ${userId}:`, error);

      status.syncInProgress = false;
      status.retryCount++;
      status.nextRetry = new Date(
        Date.now() + Math.pow(2, status.retryCount) * 1000,
      ).toISOString();
      this.syncStatus.set(userId, status);
    }
  }

  /**
   * Trigger updates across all relevant pages
   */
  private triggerPageUpdates(userId: string): void {
    // Dispatch custom events for page updates
    window.dispatchEvent(
      new CustomEvent("favoritesUpdated", {
        detail: {
          userId,
          favorites: this.getActiveFavorites(userId),
          timestamp: new Date().toISOString(),
        },
      }),
    );

    window.dispatchEvent(
      new CustomEvent("dashboardUpdate", {
        detail: {
          type: "favorites",
          userId,
          data: this.getUserFavorites(userId),
        },
      }),
    );

    window.dispatchEvent(
      new CustomEvent("statusUpdate", {
        detail: {
          type: "favorites_sync",
          userId,
          status: "completed",
        },
      }),
    );
  }

  /**
   * Setup click detection for favorite buttons
   */
  private setupClickDetection(): void {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const favoriteButton = target.closest("[data-favorite-button]");

      if (favoriteButton) {
        const productId = favoriteButton.getAttribute("data-product-id");
        const userId = this.getCurrentUserId();

        if (productId && userId) {
          console.log(
            `🔍 AI Click Detection: Favorite button clicked for ${productId}`,
          );

          // Prevent default behavior
          event.preventDefault();
          event.stopPropagation();

          // Process with AI
          this.toggleFavorite(userId, productId, {
            x: event.clientX,
            y: event.clientY,
            buttonElement: favoriteButton as HTMLElement,
            page: window.location.pathname,
          });
        }
      }
    });
  }

  /**
   * Add update listener
   */
  addUpdateListener(callback: (update: any) => void): void {
    this.updateListeners.add(callback);
  }

  /**
   * Remove update listener
   */
  removeUpdateListener(callback: (update: any) => void): void {
    this.updateListeners.delete(callback);
  }

  /**
   * Notify all update listeners
   */
  private notifyUpdateListeners(update: any): void {
    this.updateListeners.forEach((callback) => {
      try {
        callback(update);
      } catch (error) {
        console.error("Error in update listener:", error);
      }
    });
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string | null {
    try {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch (error) {
      console.error("Error getting current user ID:", error);
    }
    return null;
  }

  /**
   * Get session ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("favoritesSessionId");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("favoritesSessionId", sessionId);
    }
    return sessionId;
  }

  /**
   * Save to storage
   */
  private saveToStorage(): void {
    try {
      const data = {
        records: Array.from(this.favoriteRecords.entries()),
        syncStatus: Array.from(this.syncStatus.entries()),
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("enhancedFavoritesData", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving favorites data:", error);
    }
  }

  /**
   * Load from storage
   */
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem("enhancedFavoritesData");
      if (saved) {
        const data = JSON.parse(saved);
        this.favoriteRecords = new Map(data.records || []);
        this.syncStatus = new Map(data.syncStatus || []);
      }
    } catch (error) {
      console.error("Error loading favorites data:", error);
    }
  }

  /**
   * Get sync status for admin dashboard
   */
  getSyncStatus(): Array<{
    userId: string;
    lastSync: string;
    pendingUpdates: number;
    syncInProgress: boolean;
  }> {
    return Array.from(this.syncStatus.entries()).map(([userId, status]) => ({
      userId,
      ...status,
    }));
  }

  /**
   * Get AI queue status
   */
  getAIQueueStatus(): {
    queueLength: number;
    processing: boolean;
    recentItems: any[];
  } {
    return {
      queueLength: this.aiQueue.length,
      processing: this.aiQueue.length > 0,
      recentItems: this.aiQueue.slice(-5),
    };
  }

  /**
   * Force sync for user (admin function)
   */
  async forceSyncUser(userId: string): Promise<boolean> {
    try {
      await this.syncUserToDatabase(userId);
      return true;
    } catch (error) {
      console.error(`Force sync failed for ${userId}:`, error);
      return false;
    }
  }

  /**
   * Restore deleted favorite
   */
  async restoreFavorite(userId: string, productId: string): Promise<boolean> {
    const record: FavoriteRecord = {
      id: `restore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      productId,
      status: "restored",
      timestamp: new Date().toISOString(),
      source: "system_sync",
      confidence: 1.0,
      metadata: {
        page: window.location.pathname,
        buttonState: true,
        sessionId: this.getSessionId(),
      },
    };

    if (!this.favoriteRecords.has(userId)) {
      this.favoriteRecords.set(userId, []);
    }
    this.favoriteRecords.get(userId)!.push(record);

    this.saveToStorage();
    await this.updateAllSystems(userId, productId, true);
    this.updateButtonStates(productId, true);

    return true;
  }
}

// Export singleton instance
export const EnhancedFavoritesManager = new EnhancedFavoritesManagerClass();
export default EnhancedFavoritesManager;
