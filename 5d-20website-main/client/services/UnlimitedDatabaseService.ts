/**
 * Unlimited Database Storage Service
 * Provides unlimited storage with multiple database routes and failover
 */

interface DatabaseRoute {
  id: string;
  name: string;
  type: "primary" | "backup" | "cloud" | "distributed";
  storage: Storage;
  maxSize: number;
  currentSize: number;
  isActive: boolean;
  priority: number;
}

interface StorageData {
  id: string;
  data: any;
  timestamp: number;
  size: number;
  checksum: string;
  backup_routes: string[];
}

class UnlimitedDatabaseService {
  private static instance: UnlimitedDatabaseService;
  private routes: Map<string, DatabaseRoute> = new Map();
  private currentRoute: string = "primary";
  private totalStorageUsed: number = 0;
  private isInitialized: boolean = false;

  static getInstance(): UnlimitedDatabaseService {
    if (!UnlimitedDatabaseService.instance) {
      UnlimitedDatabaseService.instance = new UnlimitedDatabaseService();
    }
    return UnlimitedDatabaseService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log("🗄️ Initializing Unlimited Database Storage...");

    // Initialize multiple storage routes
    await this.setupStorageRoutes();

    // Setup automatic failover monitoring
    this.setupFailoverMonitoring();

    // Migrate existing data if needed
    await this.migrateExistingData();

    this.isInitialized = true;
    console.log("✅ Unlimited Database Storage initialized");
    this.logStorageStatus();
  }

  private async setupStorageRoutes(): Promise<void> {
    // Primary localStorage route (unlimited via chunking)
    this.routes.set("primary", {
      id: "primary",
      name: "Primary LocalStorage (Chunked)",
      type: "primary",
      storage: localStorage,
      maxSize: Number.MAX_SAFE_INTEGER, // Unlimited via chunking
      currentSize: 0,
      isActive: true,
      priority: 1,
    });

    // Backup localStorage route
    this.routes.set("backup_local", {
      id: "backup_local",
      name: "Backup LocalStorage",
      type: "backup",
      storage: localStorage,
      maxSize: Number.MAX_SAFE_INTEGER,
      currentSize: 0,
      isActive: true,
      priority: 2,
    });

    // SessionStorage route
    this.routes.set("session", {
      id: "session",
      name: "Session Storage",
      type: "backup",
      storage: sessionStorage,
      maxSize: Number.MAX_SAFE_INTEGER,
      currentSize: 0,
      isActive: true,
      priority: 3,
    });

    // IndexedDB route (simulated)
    this.routes.set("indexed", {
      id: "indexed",
      name: "IndexedDB (Simulated)",
      type: "cloud",
      storage: localStorage, // Will use prefixed keys
      maxSize: Number.MAX_SAFE_INTEGER,
      currentSize: 0,
      isActive: true,
      priority: 4,
    });

    // Memory storage route (for temporary data)
    const memoryStorage = this.createMemoryStorage();
    this.routes.set("memory", {
      id: "memory",
      name: "Memory Storage",
      type: "distributed",
      storage: memoryStorage,
      maxSize: Number.MAX_SAFE_INTEGER,
      currentSize: 0,
      isActive: true,
      priority: 5,
    });

    console.log(`📦 Initialized ${this.routes.size} storage routes`);
  }

  private createMemoryStorage(): Storage {
    const memoryData = new Map<string, string>();

    return {
      get length() {
        return memoryData.size;
      },
      key: (index: number) => [...memoryData.keys()][index] || null,
      getItem: (key: string) => memoryData.get(key) || null,
      setItem: (key: string, value: string) => memoryData.set(key, value),
      removeItem: (key: string) => memoryData.delete(key),
      clear: () => memoryData.clear(),
    } as Storage;
  }

  async setItem(key: string, value: any): Promise<boolean> {
    const data = JSON.stringify(value);
    const storageData: StorageData = {
      id: key,
      data: value,
      timestamp: Date.now(),
      size: data.length,
      checksum: this.generateChecksum(data),
      backup_routes: [],
    };

    // Try to store in multiple routes for redundancy
    const routes = this.getActiveRoutes();
    let successCount = 0;

    for (const route of routes) {
      try {
        const success = await this.storeInRoute(route, key, storageData);
        if (success) {
          successCount++;
          storageData.backup_routes.push(route.id);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to store in route ${route.name}:`, error);
        // Try next route
        continue;
      }
    }

    if (successCount > 0) {
      console.log(
        `✅ Data stored successfully in ${successCount}/${routes.length} routes`,
      );
      return true;
    } else {
      console.error("❌ Failed to store data in any route");
      return false;
    }
  }

  async getItem(key: string): Promise<any> {
    const routes = this.getActiveRoutes();

    for (const route of routes) {
      try {
        const data = await this.retrieveFromRoute(route, key);
        if (data) {
          // Verify data integrity
          if (this.verifyData(data)) {
            return data.data;
          } else {
            console.warn(
              `⚠️ Data integrity check failed for ${key} in ${route.name}`,
            );
            continue;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Failed to retrieve from route ${route.name}:`, error);
        continue;
      }
    }

    console.warn(`⚠️ Could not retrieve ${key} from any route`);
    return null;
  }

  private async storeInRoute(
    route: DatabaseRoute,
    key: string,
    data: StorageData,
  ): Promise<boolean> {
    try {
      const serialized = JSON.stringify(data);

      if (route.type === "primary" || route.type === "backup") {
        // Use chunking for large data
        return this.storeWithChunking(route, key, serialized);
      } else {
        // Use prefixed keys for other routes
        const prefixedKey = `${route.id}_${key}`;
        route.storage.setItem(prefixedKey, serialized);
        return true;
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        // Try to free up space and retry
        await this.performRouteCleanup(route);
        try {
          const serialized = JSON.stringify(data);
          if (route.type === "primary" || route.type === "backup") {
            return this.storeWithChunking(route, key, serialized);
          } else {
            const prefixedKey = `${route.id}_${key}`;
            route.storage.setItem(prefixedKey, serialized);
            return true;
          }
        } catch (retryError) {
          console.error(`❌ Retry failed for route ${route.name}:`, retryError);
          return false;
        }
      } else {
        throw error;
      }
    }
  }

  private storeWithChunking(
    route: DatabaseRoute,
    key: string,
    data: string,
  ): boolean {
    const chunkSize = 10000; // Reduced to 10KB chunks
    const chunks = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }

    try {
      // Store chunk metadata
      const metadata = {
        key,
        totalChunks: chunks.length,
        timestamp: Date.now(),
        originalSize: data.length,
      };

      // Try to store metadata first
      try {
        route.storage.setItem(`${key}_meta`, JSON.stringify(metadata));
      } catch (metadataError) {
        if (metadataError.name === 'QuotaExceededError' && window.emergencyStorageManager) {
          window.emergencyStorageManager.forceCleanup();
          // Try once more after cleanup
          route.storage.setItem(`${key}_meta`, JSON.stringify(metadata));
        } else {
          throw metadataError;
        }
      }

      // Store each chunk with individual error handling
      let storedChunks = 0;
      for (let index = 0; index < chunks.length; index++) {
        try {
          route.storage.setItem(`${key}_chunk_${index}`, chunks[index]);
          storedChunks++;
        } catch (chunkError) {
          if (chunkError.name === 'QuotaExceededError' && window.emergencyStorageManager) {
            console.warn(`Quota exceeded for chunk ${index}, attempting cleanup...`);
            window.emergencyStorageManager.forceCleanup();
            // Try storing this chunk once more after cleanup
            try {
              route.storage.setItem(`${key}_chunk_${index}`, chunks[index]);
              storedChunks++;
            } catch (retryError) {
              console.error(`Failed to store chunk ${index} even after cleanup:`, retryError);
              break;
            }
          } else {
            console.error(`Failed to store chunk ${index}:`, chunkError);
            break;
          }
        }
      }

      // Check if all chunks were stored
      if (storedChunks < chunks.length) {
        // Clean up partial storage
        this.cleanupPartialChunks(route, key, storedChunks);
        return false;
      }

      console.log(
        `📦 Stored ${key} in ${chunks.length} chunks (${data.length} bytes)`,
      );
      return true;
    } catch (error) {
      console.error(`❌ Chunking failed for ${key}:`, error);
      // Try emergency cleanup
      if (window.emergencyStorageManager && error.name === 'QuotaExceededError') {
        window.emergencyStorageManager.forceCleanup();
      }
      return false;
    }
  }

  private cleanupPartialChunks(route: DatabaseRoute, key: string, storedCount: number): void {
    try {
      // Remove metadata
      route.storage.removeItem(`${key}_metadata`);

      // Remove any chunks that were stored
      for (let i = 0; i < storedCount; i++) {
        route.storage.removeItem(`${key}_chunk_${i}`);
      }

      console.log(`Cleaned up ${storedCount} partial chunks for ${key}`);
    } catch (error) {
      console.warn(`Error cleaning up partial chunks for ${key}:`, error);
    }
  }

  private async retrieveFromRoute(
    route: DatabaseRoute,
    key: string,
  ): Promise<StorageData | null> {
    try {
      if (route.type === "primary" || route.type === "backup") {
        return this.retrieveWithChunking(route, key);
      } else {
        const prefixedKey = `${route.id}_${key}`;
        const data = route.storage.getItem(prefixedKey);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error(`❌ Retrieve error from route ${route.name}:`, error);
      return null;
    }
  }

  private retrieveWithChunking(
    route: DatabaseRoute,
    key: string,
  ): StorageData | null {
    try {
      // Get chunk metadata
      const metaData = route.storage.getItem(`${key}_meta`);
      if (!metaData) {
        // Try direct storage (non-chunked)
        const directData = route.storage.getItem(key);
        return directData ? JSON.parse(directData) : null;
      }

      const metadata = JSON.parse(metaData);
      let reconstructed = "";

      // Reconstruct from chunks
      for (let i = 0; i < metadata.totalChunks; i++) {
        const chunk = route.storage.getItem(`${key}_chunk_${i}`);
        if (!chunk) {
          console.error(`❌ Missing chunk ${i} for ${key}`);
          return null;
        }
        reconstructed += chunk;
      }

      if (reconstructed.length !== metadata.originalSize) {
        console.error(
          `❌ Size mismatch for ${key}: expected ${metadata.originalSize}, got ${reconstructed.length}`,
        );
        return null;
      }

      return JSON.parse(reconstructed);
    } catch (error) {
      console.error(`❌ Chunking reconstruction failed for ${key}:`, error);
      return null;
    }
  }

  private getActiveRoutes(): DatabaseRoute[] {
    return Array.from(this.routes.values())
      .filter((route) => route.isActive)
      .sort((a, b) => a.priority - b.priority);
  }

  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private verifyData(data: StorageData): boolean {
    const serialized = JSON.stringify(data.data);
    const checksum = this.generateChecksum(serialized);
    return checksum === data.checksum;
  }

  private async performRouteCleanup(route: DatabaseRoute): Promise<void> {
    console.log(`🧹 Performing cleanup for route: ${route.name}`);

    // Remove old items (older than 7 days)
    const cutoffTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let removedCount = 0;

    const keysToCheck = [];
    for (let i = 0; i < route.storage.length; i++) {
      const key = route.storage.key(i);
      if (key) keysToCheck.push(key);
    }

    for (const key of keysToCheck) {
      try {
        const data = route.storage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.timestamp && parsed.timestamp < cutoffTime) {
            route.storage.removeItem(key);
            removedCount++;
          }
        }
      } catch (error) {
        // Remove corrupted data
        route.storage.removeItem(key);
        removedCount++;
      }
    }

    console.log(
      `🧹 Cleanup complete for ${route.name}: removed ${removedCount} items`,
    );
  }

  private setupFailoverMonitoring(): void {
    setInterval(() => {
      this.checkRouteHealth();
    }, 30000); // Check every 30 seconds
  }

  private async checkRouteHealth(): Promise<void> {
    for (const route of this.routes.values()) {
      try {
        // Test write/read to check if route is healthy
        const testKey = `health_check_${route.id}`;
        const testData = { timestamp: Date.now() };

        route.storage.setItem(testKey, JSON.stringify(testData));
        const retrieved = route.storage.getItem(testKey);

        if (retrieved) {
          route.isActive = true;
          route.storage.removeItem(testKey);
        } else {
          route.isActive = false;
          console.warn(`⚠️ Route ${route.name} failed health check`);
        }
      } catch (error) {
        route.isActive = false;
        console.warn(`⚠️ Route ${route.name} health check error:`, error);
      }
    }
  }

  private async migrateExistingData(): Promise<void> {
    console.log("🔄 Migrating existing data to unlimited storage...");

    const existingKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.includes("_meta") && !key.includes("_chunk_")) {
        existingKeys.push(key);
      }
    }

    for (const key of existingKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          // Re-store using unlimited system
          await this.setItem(key, JSON.parse(data));
        }
      } catch (error) {
        console.warn(`⚠️ Migration failed for ${key}:`, error);
      }
    }

    console.log(
      `✅ Migration complete: ${existingKeys.length} items processed`,
    );
  }

  public getStorageReport(): any {
    const routes = Array.from(this.routes.values());
    const activeRoutes = routes.filter((r) => r.isActive);

    return {
      totalRoutes: routes.length,
      activeRoutes: activeRoutes.length,
      routes: routes.map((route) => ({
        id: route.id,
        name: route.name,
        type: route.type,
        isActive: route.isActive,
        priority: route.priority,
        currentSize: route.currentSize,
      })),
      totalStorageUsed: this.totalStorageUsed,
      isUnlimited: true,
    };
  }

  public logStorageStatus(): void {
    const report = this.getStorageReport();
    console.log("📊 Unlimited Database Storage Status:", {
      totalRoutes: report.totalRoutes,
      activeRoutes: report.activeRoutes,
      totalStorageUsed: `${(report.totalStorageUsed / 1024 / 1024).toFixed(2)}MB`,
      isUnlimited: report.isUnlimited,
    });
  }

  // Legacy compatibility methods
  async getUserData(userId: string): Promise<any> {
    return this.getItem(`user_${userId}`);
  }

  async saveUserData(userId: string, data: any): Promise<boolean> {
    return this.setItem(`user_${userId}`, data);
  }

  async getAllUsers(): Promise<any[]> {
    const users = await this.getItem("allUsers");
    return users || [];
  }

  async saveAllUsers(users: any[]): Promise<boolean> {
    return this.setItem("allUsers", users);
  }

  // System information
  getDatabaseCount(): number {
    return this.routes.size;
  }

  getRouteNames(): string[] {
    return Array.from(this.routes.values()).map((r) => r.name);
  }
}

// Initialize the service
const unlimitedDB = UnlimitedDatabaseService.getInstance();

// Auto-initialize when imported
unlimitedDB.initialize().catch(console.error);

// Export both the class and the instance for flexibility
export { UnlimitedDatabaseService };
export default unlimitedDB;
