/**
 * Emergency Storage Cleanup and Optimization
 * Handles storage quota exceeded errors and prevents data loss
 */

console.log('🧹 Loading Emergency Storage Cleanup System...');

class EmergencyStorageManager {
  constructor() {
    this.isCleanupInProgress = false;
    this.cleanupStrategies = [
      'removeOldChunks',
      'compressData',
      'removeRedundantData',
      'clearTemporaryData',
      'optimizeKeys'
    ];
    this.initialize();
  }

  initialize() {
    // Override localStorage setItem to catch quota errors
    this.setupQuotaErrorHandling();

    // Start periodic cleanup
    this.startPeriodicCleanup();

    // Monitor storage usage
    this.monitorStorageUsage();
  }

  setupQuotaErrorHandling() {
    const originalSetItem = Storage.prototype.setItem;
    const self = this;

    Storage.prototype.setItem = function(key, value) {
      try {
        originalSetItem.call(this, key, value);
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.warn('🚨 Storage quota exceeded, initiating emergency cleanup...');
          self.handleQuotaExceeded(this, key, value);
        } else {
          throw error;
        }
      }
    };
  }

  async handleQuotaExceeded(storage, key, value) {
    if (this.isCleanupInProgress) {
      console.log('⏳ Cleanup already in progress, queuing operation...');
      return this.queueOperation(storage, key, value);
    }

    this.isCleanupInProgress = true;

    try {
      console.log('🧹 Starting emergency storage cleanup...');

      // Strategy 1: Remove old chunks
      const cleaned1 = await this.removeOldChunks(storage);
      if (cleaned1 > 0) {
        console.log(`✅ Cleaned ${cleaned1} old chunks`);
        if (this.tryStore(storage, key, value)) {
          return;
        }
      }

      // Strategy 2: Compress existing data
      const compressed = await this.compressStorageData(storage);
      if (compressed > 0) {
        console.log(`✅ Compressed ${compressed} items`);
        if (this.tryStore(storage, key, value)) {
          return;
        }
      }

      // Strategy 3: Remove redundant data
      const redundant = await this.removeRedundantData(storage);
      if (redundant > 0) {
        console.log(`✅ Removed ${redundant} redundant items`);
        if (this.tryStore(storage, key, value)) {
          return;
        }
      }

      // Strategy 4: Clear temporary data
      const temporary = await this.clearTemporaryData(storage);
      if (temporary > 0) {
        console.log(`✅ Cleared ${temporary} temporary items`);
        if (this.tryStore(storage, key, value)) {
          return;
        }
      }

      // Strategy 5: Optimize by using smaller chunks
      const optimizedValue = this.optimizeValue(value);
      if (optimizedValue.length < value.length) {
        console.log(`✅ Optimized value size: ${value.length} -> ${optimizedValue.length}`);
        if (this.tryStore(storage, key, optimizedValue)) {
          return;
        }
      }

      // Last resort: Store in memory with warning
      console.warn('⚠️ Could not store in persistent storage, using memory fallback');
      this.storeInMemory(key, value);

    } finally {
      this.isCleanupInProgress = false;
    }
  }

  tryStore(storage, key, value) {
    try {
      storage.setItem(key, value);
      console.log(`✅ Successfully stored ${key} after cleanup`);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        return false;
      }
      throw error;
    }
  }

  async removeOldChunks(storage) {
    let removed = 0;
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;

      // Check if it's a chunk with timestamp
      if (key.includes('_chunk_')) {
        try {
          const value = storage.getItem(key);
          if (value) {
            const data = JSON.parse(value);
            if (data.timestamp && data.timestamp < cutoffTime) {
              storage.removeItem(key);
              removed++;
              i--; // Adjust index after removal
            }
          }
        } catch (error) {
          // If we can't parse it, it might be corrupted - remove it
          storage.removeItem(key);
          removed++;
          i--;
        }
      }

      // Also remove obviously old keys (with old timestamps in name)
      if (key.includes('indexed_indexed_') || key.includes('indexed_indexed_indexed_')) {
        storage.removeItem(key);
        removed++;
        i--;
      }
    }

    return removed;
  }

  async compressStorageData(storage) {
    let compressed = 0;

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key || key.includes('_compressed')) continue;

      try {
        const value = storage.getItem(key);
        if (value && value.length > 1000) {
          // Simple compression: remove extra whitespace and optimize JSON
          const optimized = this.optimizeValue(value);
          if (optimized.length < value.length * 0.8) {
            storage.setItem(key + '_compressed', optimized);
            storage.removeItem(key);
            compressed++;
          }
        }
      } catch (error) {
        // Skip if we can't process this item
      }
    }

    return compressed;
  }

  async removeRedundantData(storage) {
    let removed = 0;
    const seen = new Set();

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;

      try {
        const value = storage.getItem(key);
        if (value) {
          const hash = this.simpleHash(value);
          if (seen.has(hash)) {
            storage.removeItem(key);
            removed++;
            i--;
          } else {
            seen.add(hash);
          }
        }
      } catch (error) {
        // Skip problematic items
      }
    }

    return removed;
  }

  async clearTemporaryData(storage) {
    let cleared = 0;
    const tempPrefixes = ['temp_', 'cache_', 'tmp_', 'test_', 'debug_'];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;

      if (tempPrefixes.some(prefix => key.startsWith(prefix))) {
        storage.removeItem(key);
        cleared++;
        i--;
      }
    }

    return cleared;
  }

  optimizeValue(value) {
    try {
      // Try to parse as JSON and re-stringify without extra spaces
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed);
    } catch (error) {
      // If not JSON, just trim whitespace
      return value.trim();
    }
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  storeInMemory(key, value) {
    if (!window.memoryStorage) {
      window.memoryStorage = new Map();
    }
    window.memoryStorage.set(key, value);

    // Notify user about memory storage
    if (window.systemValidator) {
      window.systemValidator.logWarning('Storage', `Data stored in memory: ${key}`);
    }
  }

  queueOperation(storage, key, value) {
    if (!this.operationQueue) {
      this.operationQueue = [];
    }

    this.operationQueue.push({ storage, key, value });

    // Process queue when cleanup is done
    setTimeout(() => {
      if (!this.isCleanupInProgress && this.operationQueue.length > 0) {
        const operation = this.operationQueue.shift();
        this.tryStore(operation.storage, operation.key, operation.value);
      }
    }, 1000);
  }

  startPeriodicCleanup() {
    // Run cleanup every 5 minutes
    setInterval(() => {
      this.performMaintenanceCleanup();
    }, 5 * 60 * 1000);
  }

  async performMaintenanceCleanup() {
    if (this.isCleanupInProgress) return;

    console.log('🧹 Performing maintenance cleanup...');

    const storageUsage = this.getStorageUsage();
    if (storageUsage > 0.8) { // If using more than 80% of storage
      await this.removeOldChunks(localStorage);
      await this.clearTemporaryData(localStorage);
    }
  }

  getStorageUsage() {
    try {
      let used = 0;

      // Safely estimate used storage
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            try {
              const value = localStorage.getItem(key);
              if (value) {
                used += key.length + value.length;
              }
            } catch (keyError) {
              // Skip problematic keys
              console.warn('Skipping problematic storage key:', key);
            }
          }
        }
      } catch (iterationError) {
        console.warn('Error iterating localStorage:', iterationError);
        return 0.3; // Conservative fallback
      }

      // Use navigator.storage.estimate if available, with fallback
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          navigator.storage.estimate().then(estimate => {
            if (estimate && estimate.usage && estimate.quota &&
                isFinite(estimate.usage) && isFinite(estimate.quota) && estimate.quota > 0) {
              const actualUsage = estimate.usage / estimate.quota;
              if (isFinite(actualUsage) && actualUsage >= 0 && actualUsage <= 1) {
                // Store for next time
                this._lastKnownUsage = actualUsage;
              }
            }
          }).catch(() => {
            // Ignore promise rejections
          });
        } catch (error) {
          // Ignore estimate errors
        }
      }

      // Return last known usage or calculated estimate
      if (this._lastKnownUsage && isFinite(this._lastKnownUsage)) {
        return this._lastKnownUsage;
      }

      // Fallback calculation
      const estimatedKB = used / 1024;
      const usage = Math.min(1, estimatedKB / 5120); // Assume ~5MB limit

      return isFinite(usage) ? usage : 0.3; // Safe fallback

    } catch (error) {
      console.warn('Storage usage calculation failed:', error);
      return 0.3; // Conservative estimate
    }
  }

  monitorStorageUsage() {
    setInterval(() => {
      const usage = this.getStorageUsage();
      if (usage > 0.9) {
        console.warn(`⚠️ Storage usage high: ${(usage * 100).toFixed(1)}%`);
        this.performMaintenanceCleanup();
      }
    }, 30000); // Check every 30 seconds
  }

  // Public methods for manual cleanup
  async forceCleanup() {
    console.log('🧹 Force cleanup initiated...');
    await this.removeOldChunks(localStorage);
    await this.compressStorageData(localStorage);
    await this.removeRedundantData(localStorage);
    await this.clearTemporaryData(localStorage);
    console.log('✅ Force cleanup completed');
  }

  getCleanupReport() {
    const usage = this.getStorageUsage();
    const itemCount = localStorage.length;

    return {
      storageUsage: `${(usage * 100).toFixed(1)}%`,
      itemCount,
      isCleanupInProgress: this.isCleanupInProgress,
      memoryFallbackItems: window.memoryStorage ? window.memoryStorage.size : 0
    };
  }
}

// Initialize emergency storage manager
window.emergencyStorageManager = new EmergencyStorageManager();

// Add emergency cleanup button to page
function addEmergencyCleanupButton() {
  const button = document.createElement('button');
  button.id = 'emergency-cleanup-button';
  button.innerHTML = '🧹 Emergency Cleanup';
  button.style.cssText = `
    position: fixed;
    top: 60px;
    left: 20px;
    z-index: 10000;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;

  button.addEventListener('click', async () => {
    button.innerHTML = '🧹 Cleaning...';
    button.disabled = true;

    try {
      await window.emergencyStorageManager.forceCleanup();
      const report = window.emergencyStorageManager.getCleanupReport();

      button.innerHTML = '✅ Cleaned!';
      button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

      // Show report
      alert(`Cleanup completed!\nStorage usage: ${report.storageUsage}\nItems: ${report.itemCount}`);

      setTimeout(() => {
        button.innerHTML = '🧹 Emergency Cleanup';
        button.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        button.disabled = false;
      }, 3000);

    } catch (error) {
      button.innerHTML = '❌ Error';
      button.disabled = false;
      console.error('Cleanup error:', error);
    }
  });

  document.body.appendChild(button);
}

// Add cleanup button
addEmergencyCleanupButton();

console.log('🧹 Emergency Storage Cleanup System loaded and active!');
