// Global Console Monitor Functions
// Makes console monitoring accessible from browser console for debugging

// Get monitoring service instance
const getMonitoringService = () => {
  if (window.ConsoleLogMonitoringService) {
    return window.ConsoleLogMonitoringService.getInstance();
  }
  console.warn("ConsoleLogMonitoringService not available");
  return null;
};

// Global functions for console access
window.consoleMonitor = {
  // Start/stop monitoring
  start: () => {
    const service = getMonitoringService();
    if (service) {
      service.startMonitoring();
      console.log("🔍 Console monitoring started");
    }
  },

  stop: () => {
    const service = getMonitoringService();
    if (service) {
      service.stopMonitoring();
      console.log("🔍 Console monitoring stopped");
    }
  },

  // Get logs
  getLogs: (limit = 50) => {
    const service = getMonitoringService();
    if (!service) return [];

    const logs = service.getRecentLogs(limit);
    console.table(
      logs.map((log) => ({
        time: new Date(log.timestamp).toLocaleTimeString(),
        level: log.level,
        message: log.message.slice(0, 100),
        category: log.category,
        severity: log.severity,
        fixed: log.isFixed ? "✅" : "❌",
      })),
    );
    return logs;
  },

  // Search logs
  search: (query, filters = {}) => {
    const service = getMonitoringService();
    if (!service) return [];

    const results = service.searchLogs(query, filters);
    console.log(`🔍 Found ${results.length} logs matching "${query}"`);
    console.table(
      results.slice(0, 20).map((log) => ({
        time: new Date(log.timestamp).toLocaleTimeString(),
        level: log.level,
        message: log.message.slice(0, 80),
        severity: log.severity,
      })),
    );
    return results;
  },

  // Get statistics
  stats: () => {
    const service = getMonitoringService();
    if (!service) return {};

    const stats = service.getErrorStatistics();
    console.log("📊 Console Monitor Statistics:");
    console.log(`   Total Logs: ${stats.totalLogs}`);
    console.log(`   Errors: ${stats.errorCount}`);
    console.log(`   Warnings: ${stats.warningCount}`);
    console.log(`   Critical: ${stats.criticalCount}`);
    console.log(`   Fixed: ${stats.fixedCount}`);
    console.log("   Top Error Patterns:");
    stats.topErrors.slice(0, 5).forEach((error, i) => {
      console.log(`     ${i + 1}. ${error.pattern} (${error.count} times)`);
    });
    return stats;
  },

  // Generate test logs
  test: () => {
    console.log("🧪 Generating test logs...");
    console.log("📝 This is a test info log");
    console.warn("⚠️ This is a test warning");
    console.error("❌ This is a test error");

    // Simulate some common errors
    setTimeout(() => {
      try {
        // Simulate undefined function error
        window.nonExistentFunction();
      } catch (error) {
        console.error("Test error - undefined function:", error);
      }
    }, 100);

    setTimeout(() => {
      // Simulate network error
      console.error(
        "Test error - network: Failed to fetch https://example.com/api",
      );
    }, 200);

    console.log("✅ Test logs generated. Check console monitor!");
  },

  // Clear all logs
  clear: () => {
    localStorage.removeItem("console_logs");
    console.log("🗑️ Console logs cleared");
  },

  // Help
  help: () => {
    console.log(`
🔍 Console Monitor Commands:

Basic Commands:
  consoleMonitor.start()           - Start monitoring
  consoleMonitor.stop()            - Stop monitoring
  consoleMonitor.getLogs(50)       - Get recent logs (default 50)
  consoleMonitor.stats()           - Show statistics
  consoleMonitor.clear()           - Clear all logs
  consoleMonitor.test()            - Generate test logs

Search & Filter:
  consoleMonitor.search("error")   - Search logs
  consoleMonitor.search("fetch", { 
    level: "error", 
    severity: "high" 
  })                               - Search with filters

Available Filters:
  - level: "log", "error", "warn", "info", "debug"
  - severity: "low", "medium", "high", "critical"
  - category: "javascript", "network", "ui", "database", "authentication"
  - dateFrom: "2024-01-01T00:00:00Z"
  - dateTo: "2024-01-02T00:00:00Z"

Examples:
  consoleMonitor.search("DatabaseService")
  consoleMonitor.search("", { level: "error", severity: "critical" })
  consoleMonitor.getLogs(100)
  consoleMonitor.stats()
    `);
  },
};

// Initialize monitoring when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "🔍 Console Monitor globals loaded. Type 'consoleMonitor.help()' for commands.",
  );

  // Try to start monitoring automatically
  setTimeout(() => {
    try {
      if (window.consoleMonitor) {
        window.consoleMonitor.start();
      }
    } catch (error) {
      console.error("Failed to auto-start console monitoring:", error);
    }
  }, 1000);
});

export default typeof window !== "undefined" ? window.consoleMonitor : {};
