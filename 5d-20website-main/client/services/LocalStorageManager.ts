/**
 * LocalStorage Management Service
 * Monitors and manages localStorage usage to prevent quota exceeded errors
 */

interface StorageStats {
  used: number;
  available: number;
  percentage: number;
  items: number;
  largestItems: { key: string; size: number }[];
}

class LocalStorageManager {
  private static instance: LocalStorageManager;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private readonly QUOTA_WARNING_THRESHOLD = 80; // 80% usage warning
  private readonly QUOTA_CLEANUP_THRESHOLD = 90; // 90% usage triggers cleanup

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  /**
   * Initialize monitoring
   */
  public initialize(): void {
    console.log("📊 Initializing localStorage monitoring...");

    // Initial cleanup and stats
    this.performMaintenance();

    // Start periodic monitoring (every 30 seconds)
    this.startMonitoring();

    // Log initial stats
    const stats = this.getStorageStats();
    console.log("📊 Initial localStorage stats:", {
      used: `${(stats.used / 1024 / 1024).toFixed(2)}MB`,
      percentage: `${stats.percentage.toFixed(1)}%`,
      items: stats.items,
    });
  }

  /**
   * Start periodic monitoring
   */
  private startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      const stats = this.getStorageStats();

      if (stats.percentage > this.QUOTA_CLEANUP_THRESHOLD) {
        console.warn(
          `⚠️ localStorage usage at ${stats.percentage.toFixed(1)}% - performing cleanup`,
        );
        this.performEmergencyCleanup();
      } else if (stats.percentage > this.QUOTA_WARNING_THRESHOLD) {
        console.warn(
          `⚠️ localStorage usage at ${stats.percentage.toFixed(1)}% - consider cleanup`,
        );
        this.performMaintenanceCleanup();
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Get detailed storage statistics
   */
  public getStorageStats(): StorageStats {
    let totalSize = 0;
    let itemCount = 0;
    const itemSizes: { key: string; size: number }[] = [];

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const itemSize = localStorage[key].length + key.length;
        totalSize += itemSize;
        itemCount++;
        itemSizes.push({ key, size: itemSize });
      }
    }

    // Sort by size to find largest items
    const largestItems = itemSizes.sort((a, b) => b.size - a.size).slice(0, 10);

    // Rough estimate of localStorage limit (5MB in most browsers)
    const limit = 5 * 1024 * 1024;

    return {
      used: totalSize,
      available: limit - totalSize,
      percentage: (totalSize / limit) * 100,
      items: itemCount,
      largestItems,
    };
  }

  /**
   * Perform regular maintenance
   */
  public performMaintenance(): void {
    console.log("🔧 Performing localStorage maintenance...");

    let cleanedItems = 0;

    // Clean up old AI data
    cleanedItems += this.cleanupAIData();

    // Clean up old interaction data
    cleanedItems += this.cleanupInteractionData();

    // Clean up old cache data
    cleanedItems += this.cleanupCacheData();

    // Compress large datasets
    cleanedItems += this.compressLargeDatasets();

    if (cleanedItems > 0) {
      console.log(`✅ Maintenance complete: cleaned ${cleanedItems} items`);
    }
  }

  /**
   * Emergency cleanup when quota is nearly exceeded
   */
  private performEmergencyCleanup(): void {
    console.log("🚨 Emergency localStorage cleanup initiated!");

    const stats = this.getStorageStats();

    // Remove largest non-essential items first
    let removedSize = 0;
    const targetReduction = stats.used * 0.3; // Remove 30% of current usage

    const essentialKeys = ["user", "allUsers", "isSignedIn", "authToken"];

    stats.largestItems.forEach((item) => {
      if (removedSize < targetReduction && !essentialKeys.includes(item.key)) {
        localStorage.removeItem(item.key);
        removedSize += item.size;
        console.log(
          `🗑️ Removed ${item.key} (${(item.size / 1024).toFixed(1)}KB)`,
        );
      }
    });

    console.log(
      `🚨 Emergency cleanup complete: freed ${(removedSize / 1024 / 1024).toFixed(2)}MB`,
    );
  }

  /**
   * Maintenance cleanup for regular upkeep
   */
  private performMaintenanceCleanup(): void {
    console.log("🧹 Performing maintenance cleanup...");

    // Clean items older than 7 days
    const cutoffDate = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let removedCount = 0;

    const keysToCheck = Object.keys(localStorage);

    keysToCheck.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);

          // Check for timestamp fields
          let itemDate = null;
          if (parsed.timestamp) {
            itemDate = new Date(parsed.timestamp).getTime();
          } else if (parsed.createdAt) {
            itemDate = new Date(parsed.createdAt).getTime();
          } else if (parsed.updatedAt) {
            itemDate = new Date(parsed.updatedAt).getTime();
          }

          if (itemDate && itemDate < cutoffDate) {
            localStorage.removeItem(key);
            removedCount++;
          }
        }
      } catch (error) {
        // Remove corrupted data
        localStorage.removeItem(key);
        removedCount++;
      }
    });

    if (removedCount > 0) {
      console.log(`🧹 Maintenance cleanup: removed ${removedCount} old items`);
    }
  }

  /**
   * Clean up AI-related data
   */
  private cleanupAIData(): number {
    const aiKeys = [
      "ai-central-database",
      "ai-autofix-notifications",
      "aiClickEvents",
      "clickEvents",
    ];

    let cleanedCount = 0;

    aiKeys.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 100) {
            // Keep only last 50 items
            const reduced = parsed.slice(-50);
            localStorage.setItem(key, JSON.stringify(reduced));
            cleanedCount += parsed.length - reduced.length;
          }
        }
      } catch (error) {
        localStorage.removeItem(key);
        cleanedCount++;
      }
    });

    return cleanedCount;
  }

  /**
   * Clean up interaction data
   */
  private cleanupInteractionData(): number {
    const interactionKeys = [
      "interactions",
      "productStats",
      "userInteractions",
    ];

    let cleanedCount = 0;

    interactionKeys.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 200) {
            // Keep only last 100 items
            const reduced = parsed.slice(-100);
            localStorage.setItem(key, JSON.stringify(reduced));
            cleanedCount += parsed.length - reduced.length;
          }
        }
      } catch (error) {
        localStorage.removeItem(key);
        cleanedCount++;
      }
    });

    return cleanedCount;
  }

  /**
   * Clean up cache data
   */
  private cleanupCacheData(): number {
    let cleanedCount = 0;

    // Remove any keys that look like cache keys
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (
        key.includes("cache") ||
        key.includes("temp") ||
        key.startsWith("_")
      ) {
        localStorage.removeItem(key);
        cleanedCount++;
      }
    });

    return cleanedCount;
  }

  /**
   * Compress large datasets
   */
  private compressLargeDatasets(): number {
    let compressedCount = 0;

    const keysToCompress = ["allUsers", "products", "guestUploads"];

    keysToCompress.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data && data.length > 100000) {
          // > 100KB
          const parsed = JSON.parse(data);

          if (Array.isArray(parsed)) {
            // Remove non-essential fields from each item
            const compressed = parsed.map((item) => this.compressItem(item));
            localStorage.setItem(key, JSON.stringify(compressed));
            compressedCount++;
          }
        }
      } catch (error) {
        console.warn(`Error compressing ${key}:`, error);
      }
    });

    return compressedCount;
  }

  /**
   * Compress individual item by removing non-essential fields
   */
  private compressItem(item: any): any {
    if (!item || typeof item !== "object") return item;

    // Keep only essential fields
    const essential = {
      id: item.id,
      name: item.name,
      email: item.email,
      price: item.price,
      category: item.category,
      status: item.status,
      isAdmin: item.isAdmin,
      verified: item.verified,
      joinDate: item.joinDate,
      updatedAt: item.updatedAt,
    };

    // Remove undefined fields
    Object.keys(essential).forEach((key) => {
      if (essential[key] === undefined) {
        delete essential[key];
      }
    });

    return essential;
  }

  /**
   * Safe localStorage setItem with automatic cleanup
   */
  public safeSetItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.warn(
          `📦 Quota exceeded when setting ${key}, performing cleanup...`,
        );

        // Perform emergency cleanup
        this.performEmergencyCleanup();

        try {
          localStorage.setItem(key, value);
          return true;
        } catch (secondError) {
          console.error(
            `❌ Still unable to set ${key} after cleanup:`,
            secondError,
          );
          return false;
        }
      } else {
        console.error(`Error setting ${key}:`, error);
        return false;
      }
    }
  }

  /**
   * Get storage usage report
   */
  public getUsageReport(): string {
    const stats = this.getStorageStats();

    return `
📊 LocalStorage Usage Report:
- Used: ${(stats.used / 1024 / 1024).toFixed(2)}MB (${stats.percentage.toFixed(1)}%)
- Available: ${(stats.available / 1024 / 1024).toFixed(2)}MB
- Items: ${stats.items}
- Largest items:
${stats.largestItems
  .slice(0, 5)
  .map((item) => `  • ${item.key}: ${(item.size / 1024).toFixed(1)}KB`)
  .join("\n")}
    `;
  }

  /**
   * Destroy monitoring
   */
  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

export default LocalStorageManager;
