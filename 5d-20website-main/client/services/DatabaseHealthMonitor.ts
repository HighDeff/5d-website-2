/**
 * Database Health Monitor
 * Monitors all database systems and provides health reports
 */

import LocalStorageManager from "./LocalStorageManager";

interface DatabaseInstance {
  id: string;
  name: string;
  type:
    | "localStorage"
    | "sessionStorage"
    | "indexedDB"
    | "memory"
    | "unlimited";
  status: "healthy" | "warning" | "error" | "offline";
  size: number;
  maxSize: number;
  usage: number; // percentage
  lastCheck: number;
  operations: {
    reads: number;
    writes: number;
    deletes: number;
    errors: number;
  };
}

interface HealthReport {
  timestamp: number;
  totalDatabases: number;
  healthyDatabases: number;
  totalStorage: number;
  availableStorage: number;
  storageUsage: number;
  databases: DatabaseInstance[];
  recommendations: string[];
  isUnlimited: boolean;
}

class DatabaseHealthMonitor {
  private static instance: DatabaseHealthMonitor;
  private databases: Map<string, DatabaseInstance> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;

  static getInstance(): DatabaseHealthMonitor {
    if (!DatabaseHealthMonitor.instance) {
      DatabaseHealthMonitor.instance = new DatabaseHealthMonitor();
    }
    return DatabaseHealthMonitor.instance;
  }

  async initialize(): Promise<void> {
    console.log("🔍 Initializing Database Health Monitor...");

    await this.discoverDatabases();
    this.startMonitoring();

    console.log(
      `✅ Database Health Monitor initialized - tracking ${this.databases.size} databases`,
    );
  }

  private async discoverDatabases(): Promise<void> {
    // LocalStorage
    this.databases.set("localStorage", {
      id: "localStorage",
      name: "Browser LocalStorage",
      type: "localStorage",
      status: "healthy",
      size: this.getStorageSize(localStorage),
      maxSize: 5 * 1024 * 1024, // 5MB typical limit
      usage: 0,
      lastCheck: Date.now(),
      operations: { reads: 0, writes: 0, deletes: 0, errors: 0 },
    });

    // SessionStorage
    this.databases.set("sessionStorage", {
      id: "sessionStorage",
      name: "Browser SessionStorage",
      type: "sessionStorage",
      status: "healthy",
      size: this.getStorageSize(sessionStorage),
      maxSize: 5 * 1024 * 1024, // 5MB typical limit
      usage: 0,
      lastCheck: Date.now(),
      operations: { reads: 0, writes: 0, deletes: 0, errors: 0 },
    });

    // Unlimited Database Service
    this.databases.set("unlimited", {
      id: "unlimited",
      name: "Unlimited Database Service",
      type: "unlimited",
      status: "healthy",
      size: 0,
      maxSize: Number.MAX_SAFE_INTEGER,
      usage: 0,
      lastCheck: Date.now(),
      operations: { reads: 0, writes: 0, deletes: 0, errors: 0 },
    });

    // Memory databases (simulated)
    this.databases.set("memory", {
      id: "memory",
      name: "Memory Database",
      type: "memory",
      status: "healthy",
      size: 0,
      maxSize: 100 * 1024 * 1024, // 100MB
      usage: 0,
      lastCheck: Date.now(),
      operations: { reads: 0, writes: 0, deletes: 0, errors: 0 },
    });

    // IndexedDB (if available)
    if (typeof indexedDB !== "undefined") {
      this.databases.set("indexedDB", {
        id: "indexedDB",
        name: "Browser IndexedDB",
        type: "indexedDB",
        status: "healthy",
        size: 0,
        maxSize: 1024 * 1024 * 1024, // 1GB typical
        usage: 0,
        lastCheck: Date.now(),
        operations: { reads: 0, writes: 0, deletes: 0, errors: 0 },
      });
    }

    console.log(`📊 Discovered ${this.databases.size} database instances`);
  }

  private getStorageSize(storage: Storage): number {
    try {
      if (!storage) {
        return 0;
      }

      let totalSize = 0;
      const keys = Object.keys(storage);

      for (const key of keys) {
        try {
          const value = storage.getItem(key);
          if (value !== null) {
            totalSize += value.length + key.length;
          }
        } catch (itemError) {
          // Skip individual items that can't be read
          console.warn(`Failed to read storage item "${key}":`, itemError);
          continue;
        }
      }

      return totalSize;
    } catch (error) {
      console.warn("Failed to calculate storage size:", error);
      return 0;
    }
  }

  private startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, 10000); // Check every 10 seconds

    console.log("🔄 Database health monitoring started");
  }

  private async performHealthCheck(): Promise<void> {
    for (const [id, db] of this.databases) {
      try {
        await this.checkDatabaseHealth(db);
      } catch (error) {
        console.error(`❌ Health check failed for ${db.name}:`, error);
        db.status = "error";
        db.operations.errors++;
      }
    }
  }

  private async checkDatabaseHealth(db: DatabaseInstance): Promise<void> {
    const now = Date.now();

    try {
      switch (db.type) {
        case "localStorage":
          await this.checkWebStorage(db, localStorage);
          break;
        case "sessionStorage":
          await this.checkWebStorage(db, sessionStorage);
          break;
        case "unlimited":
          await this.checkUnlimitedDatabase(db);
          break;
        case "memory":
          await this.checkMemoryDatabase(db);
          break;
        case "indexedDB":
          await this.checkIndexedDB(db);
          break;
      }

      db.lastCheck = now;
      db.usage = (db.size / db.maxSize) * 100;

      // Determine status based on usage
      if (db.usage > 90) {
        db.status = "error";
      } else if (db.usage > 75) {
        db.status = "warning";
      } else {
        db.status = "healthy";
      }
    } catch (error) {
      db.status = "error";
      db.operations.errors++;
      throw error;
    }
  }

  private async checkWebStorage(
    db: DatabaseInstance,
    storage: Storage,
  ): Promise<void> {
    // Test read/write capability
    const testKey = `health_check_${db.id}`;
    const testValue = { timestamp: Date.now() };

    try {
      // Check if storage is available first
      if (!storage) {
        throw new Error("Storage not available");
      }

      // Write test with quota handling
      try {
        storage.setItem(testKey, JSON.stringify(testValue));
        db.operations.writes++;
      } catch (writeError) {
        // Handle quota exceeded or storage disabled
        if (writeError.name === 'QuotaExceededError' || writeError.code === 22) {
          db.status = "warning";
          console.warn(`Storage quota exceeded for ${db.id}`);
          return;
        }
        throw writeError;
      }

      // Read test with enhanced validation
      const retrieved = storage.getItem(testKey);
      db.operations.reads++;

      if (retrieved === null || retrieved === undefined) {
        // Try to clean up before failing
        try {
          storage.removeItem(testKey);
        } catch (cleanupError) {
          console.warn("Failed to cleanup test key:", cleanupError);
        }
        throw new Error("Read test failed - value not found");
      }

      // Validate retrieved data
      try {
        const parsed = JSON.parse(retrieved);
        if (!parsed.timestamp || typeof parsed.timestamp !== 'number') {
          throw new Error("Read test failed - invalid data format");
        }
      } catch (parseError) {
        throw new Error("Read test failed - corrupted data");
      }

      // Clean up
      storage.removeItem(testKey);
      db.operations.deletes++;

      // Update size safely
      try {
        db.size = this.getStorageSize(storage);
      } catch (sizeError) {
        console.warn("Failed to get storage size:", sizeError);
        db.size = 0;
      }
    } catch (error) {
      db.operations.errors++;

      // Handle specific storage errors gracefully
      if (error.message.includes("quota") || error.message.includes("storage")) {
        db.status = "warning";
        console.warn(`Storage issue for ${db.id}:`, error.message);
        return;
      }

      throw error;
    }
  }

  private async checkUnlimitedDatabase(db: DatabaseInstance): Promise<void> {
    try {
      // Check if unlimited DB is available via global window object
      const unlimitedDB = (window as any).unlimitedDatabaseService;

      if (!unlimitedDB) {
        // Mark as offline but don't fail the health check
        db.status = "offline";
        db.operations.reads++;
        console.warn(
          "⚠️ UnlimitedDatabaseService not available via global object",
        );
        return;
      }

      // Test basic operations
      const testKey = "health_check_unlimited";
      const testData = { timestamp: Date.now() };

      try {
        // Simple read/write test using localStorage as fallback
        localStorage.setItem(testKey, JSON.stringify(testData));
        db.operations.writes++;

        const retrieved = localStorage.getItem(testKey);
        if (retrieved) {
          db.operations.reads++;
          localStorage.removeItem(testKey);
          db.operations.deletes++;
        }

        // Estimate size from localStorage usage
        let totalSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length + key.length;
          }
        }
        db.size = totalSize;

        // Mark as healthy
        db.status = "healthy";
      } catch (storageError) {
        db.status = "warning";
        db.operations.errors++;
        console.warn("⚠️ Unlimited DB storage test failed:", storageError);
      }
    } catch (error) {
      db.status = "error";
      db.operations.errors++;
      console.warn("⚠️ Unlimited DB health check failed:", error);
    }
  }

  private async checkMemoryDatabase(db: DatabaseInstance): Promise<void> {
    // Simulate memory database check
    try {
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      db.size = memoryUsage;
      db.operations.reads++;
    } catch (error) {
      db.operations.errors++;
      throw error;
    }
  }

  private async checkIndexedDB(db: DatabaseInstance): Promise<void> {
    try {
      // Estimate IndexedDB usage (simplified)
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        db.size = estimate.usage || 0;
        db.maxSize = estimate.quota || db.maxSize;
      }
      db.operations.reads++;
    } catch (error) {
      db.operations.errors++;
      throw error;
    }
  }

  public getHealthReport(): HealthReport {
    const databases = Array.from(this.databases.values());
    const healthyDatabases = databases.filter(
      (db) => db.status === "healthy",
    ).length;
    const totalStorage = databases.reduce((sum, db) => sum + db.size, 0);
    const availableStorage = databases.reduce(
      (sum, db) => sum + (db.maxSize - db.size),
      0,
    );

    const recommendations: string[] = [];

    // Generate recommendations
    databases.forEach((db) => {
      if (db.status === "error") {
        recommendations.push(`🔴 ${db.name} is offline or experiencing errors`);
      } else if (db.status === "warning") {
        recommendations.push(
          `🟡 ${db.name} is running low on storage (${db.usage.toFixed(1)}% used)`,
        );
      }

      if (db.operations.errors > 10) {
        recommendations.push(
          `⚠��� ${db.name} has high error rate (${db.operations.errors} errors)`,
        );
      }
    });

    // Check if unlimited storage is properly configured
    const unlimitedDB = databases.find((db) => db.type === "unlimited");
    const isUnlimited = unlimitedDB?.status === "healthy";

    if (!isUnlimited) {
      recommendations.push(
        "💾 Configure unlimited storage to prevent quota issues",
      );
    }

    return {
      timestamp: Date.now(),
      totalDatabases: databases.length,
      healthyDatabases,
      totalStorage,
      availableStorage,
      storageUsage: (totalStorage / (totalStorage + availableStorage)) * 100,
      databases,
      recommendations,
      isUnlimited,
    };
  }

  public getDatabaseCount(): number {
    return this.databases.size;
  }

  public getDatabaseNames(): string[] {
    return Array.from(this.databases.values()).map((db) => db.name);
  }

  public logHealthStatus(): void {
    const report = this.getHealthReport();

    console.log("📊 Database Health Report:", {
      timestamp: new Date(report.timestamp).toLocaleTimeString(),
      totalDatabases: report.totalDatabases,
      healthyDatabases: report.healthyDatabases,
      storageUsage: `${report.storageUsage.toFixed(1)}%`,
      totalStorage: `${(report.totalStorage / 1024 / 1024).toFixed(2)}MB`,
      isUnlimited: report.isUnlimited,
    });

    if (report.recommendations.length > 0) {
      console.log("📋 Recommendations:", report.recommendations);
    }
  }

  public getDetailedReport(): string {
    const report = this.getHealthReport();

    let output = `
📊 DATABASE HEALTH REPORT
Generated: ${new Date(report.timestamp).toLocaleString()}

📈 OVERVIEW:
- Total Databases: ${report.totalDatabases}
- Healthy Databases: ${report.healthyDatabases}/${report.totalDatabases}
- Total Storage Used: ${(report.totalStorage / 1024 / 1024).toFixed(2)}MB
- Storage Usage: ${report.storageUsage.toFixed(1)}%
- Unlimited Storage: ${report.isUnlimited ? "✅ Enabled" : "❌ Disabled"}

📦 DATABASE DETAILS:
`;

    report.databases.forEach((db) => {
      const statusIcon =
        db.status === "healthy" ? "✅" : db.status === "warning" ? "⚠️" : "❌";
      output += `
${statusIcon} ${db.name} (${db.type})
   - Status: ${db.status.toUpperCase()}
   - Size: ${(db.size / 1024 / 1024).toFixed(2)}MB / ${(db.maxSize / 1024 / 1024).toFixed(2)}MB
   - Usage: ${db.usage.toFixed(1)}%
   - Operations: R:${db.operations.reads} W:${db.operations.writes} D:${db.operations.deletes} E:${db.operations.errors}
   - Last Check: ${new Date(db.lastCheck).toLocaleTimeString()}`;
    });

    if (report.recommendations.length > 0) {
      output += `

📋 RECOMMENDATIONS:
${report.recommendations.map((rec) => `- ${rec}`).join("\n")}`;
    }

    return output;
  }

  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log("⏹️ Database health monitoring stopped");
  }
}

// Initialize and expose globally
const healthMonitor = DatabaseHealthMonitor.getInstance();

// Auto-initialize
healthMonitor.initialize().catch(console.error);

// Expose global functions
declare global {
  interface Window {
    getDatabaseHealth: () => any;
    getDatabaseCount: () => number;
    getDatabaseReport: () => string;
    logDatabaseHealth: () => void;
  }
}

if (typeof window !== "undefined") {
  window.getDatabaseHealth = () => healthMonitor.getHealthReport();
  window.getDatabaseCount = () => healthMonitor.getDatabaseCount();
  window.getDatabaseReport = () => healthMonitor.getDetailedReport();
  window.logDatabaseHealth = () => healthMonitor.logHealthStatus();
}

export default healthMonitor;
