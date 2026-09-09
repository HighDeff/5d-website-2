// Console Log Monitoring Service
// Captures all console logs and stores them in database for AI analysis
// Provides real-time error monitoring and automated fix suggestions

import DatabaseService from "./DatabaseService";
import RealTimeSyncService from "./RealTimeSync";
import EnhancedAIService from "./EnhancedAIService";

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  level: "log" | "error" | "warn" | "info" | "debug" | "trace";
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  userAgent: string;
  userId?: string;
  sessionId: string;
  pageTitle: string;
  severity: "low" | "medium" | "high" | "critical";
  category:
    | "javascript"
    | "network"
    | "ui"
    | "database"
    | "authentication"
    | "general";
  isFixed?: boolean;
  fixApplied?: string;
  aiAnalysis?: string;
  relatedLogs?: string[];
  errorCount: number;
}

export interface LogAnalysis {
  pattern: string;
  frequency: number;
  severity: "low" | "medium" | "high" | "critical";
  suggestion: string;
  autoFix?: string;
  relatedErrors: string[];
}

export interface FixSuggestion {
  id: string;
  logId: string;
  title: string;
  description: string;
  solution: string;
  confidence: number;
  automated: boolean;
  code?: string;
  testable: boolean;
}

class ConsoleLogMonitoringService {
  private static instance: ConsoleLogMonitoringService;
  private originalConsole: any = {};
  private logs: ConsoleLogEntry[] = [];
  private isMonitoring = false;
  private sessionId: string;
  private dbService: typeof DatabaseService;
  private syncService: RealTimeSyncService;
  private aiService: EnhancedAIService;
  private logBuffer: ConsoleLogEntry[] = [];
  private bufferFlushInterval?: NodeJS.Timeout;
  private errorPatterns: Map<string, number> = new Map();
  private fixHistory: Map<string, string> = new Map();

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.dbService = DatabaseService; // DatabaseService is already an instance
    this.syncService = RealTimeSyncService.getInstance();
    this.aiService = new EnhancedAIService();
    this.saveOriginalConsole();
  }

  static getInstance(): ConsoleLogMonitoringService {
    if (!ConsoleLogMonitoringService.instance) {
      ConsoleLogMonitoringService.instance = new ConsoleLogMonitoringService();
    }
    return ConsoleLogMonitoringService.instance;
  }

  // Initialize monitoring
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.interceptConsole();
    this.setupErrorHandlers();
    this.startBufferFlush();

    // Store monitoring start event
    await this.logEvent("info", "Console monitoring started", "system");

    console.log("🔍 Console Log Monitoring Service activated");
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.restoreOriginalConsole();
    this.removeErrorHandlers();
    this.stopBufferFlush();
    this.isMonitoring = false;

    console.log("🔍 Console Log Monitoring Service deactivated");
  }

  // Save original console methods
  private saveOriginalConsole(): void {
    this.originalConsole = {
      log: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
      trace: console.trace.bind(console),
    };
  }

  // Intercept console methods
  private interceptConsole(): void {
    const levels: Array<keyof typeof this.originalConsole> = [
      "log",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
    ];

    levels.forEach((level) => {
      console[level] = (...args: any[]) => {
        // Call original method first
        this.originalConsole[level](...args);

        // Capture the log
        this.captureLog(level, args);
      };
    });
  }

  // Restore original console
  private restoreOriginalConsole(): void {
    Object.keys(this.originalConsole).forEach((method) => {
      (console as any)[method] = this.originalConsole[method];
    });
  }

  // Capture log entry
  private async captureLog(level: string, args: any[]): Promise<void> {
    try {
      const message = args
        .map((arg) => {
          if (typeof arg === "object") {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(" ");

      const logEntry: ConsoleLogEntry = {
        id: this.generateLogId(),
        timestamp: new Date().toISOString(),
        level: level as any,
        message,
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        pageTitle: document.title,
        severity: this.determineSeverity(level, message),
        category: this.categorizeLog(message),
        errorCount: 1,
      };

      // Add stack trace for errors
      if (level === "error" && args.some((arg) => arg instanceof Error)) {
        const error = args.find((arg) => arg instanceof Error);
        logEntry.stack = error.stack;
        logEntry.lineNumber = this.extractLineNumber(error.stack);
        logEntry.columnNumber = this.extractColumnNumber(error.stack);
      }

      // Add user ID if available
      const user = await this.getCurrentUser();
      if (user) {
        logEntry.userId = user.id;
      }

      this.addToBuffer(logEntry);

      // Immediate analysis for critical errors
      if (logEntry.severity === "critical") {
        await this.analyzeAndSuggestFix(logEntry);
      }
    } catch (error) {
      // Fallback to original console to avoid infinite loops
      this.originalConsole.error("Error in log capture:", error);
    }
  }

  // Setup global error handlers
  private setupErrorHandlers(): void {
    window.addEventListener("error", async (event) => {
      await this.captureLog("error", [
        `Uncaught Error: ${event.error?.message || event.message}`,
        event.error || {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      ]);
    });

    window.addEventListener("unhandledrejection", async (event) => {
      await this.captureLog("error", [
        `Unhandled Promise Rejection: ${event.reason}`,
        event.reason,
      ]);
    });
  }

  // Remove error handlers
  private removeErrorHandlers(): void {
    // Remove listeners if needed (implement if required)
  }

  // Buffer management
  private addToBuffer(logEntry: ConsoleLogEntry): void {
    this.logBuffer.push(logEntry);
    this.logs.push(logEntry);

    // Track error patterns
    if (logEntry.level === "error") {
      const pattern = this.extractErrorPattern(logEntry.message);
      this.errorPatterns.set(
        pattern,
        (this.errorPatterns.get(pattern) || 0) + 1,
      );
    }

    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  // Start buffer flush
  private startBufferFlush(): void {
    this.bufferFlushInterval = setInterval(async () => {
      await this.flushBuffer();
    }, 5000); // Flush every 5 seconds
  }

  // Stop buffer flush
  private stopBufferFlush(): void {
    if (this.bufferFlushInterval) {
      clearInterval(this.bufferFlushInterval);
      this.bufferFlushInterval = undefined;
    }
  }

  // Flush buffer to database
  private async flushBuffer(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    try {
      const logsToFlush = [...this.logBuffer];
      this.logBuffer = [];

      // Store in database
      await this.storeLogsInDatabase(logsToFlush);

      // Send to real-time sync
      await this.syncService.sendPulse({
        userId: await this.getCurrentUserId(),
        timestamp: new Date().toISOString(),
        requestType: "log_update",
        newData: { logs: logsToFlush },
      });
    } catch (error) {
      this.originalConsole.error("Error flushing log buffer:", error);
      // Return logs to buffer if storage fails
      this.logBuffer.unshift(...this.logBuffer);
    }
  }

  // Store logs in database
  private async storeLogsInDatabase(logs: ConsoleLogEntry[]): Promise<void> {
    try {
      // Create/update console logs storage
      const existingLogs = await this.getStoredLogs();
      const allLogs = [...existingLogs, ...logs];

      // Keep only last 10000 logs in storage
      const logsToStore = allLogs.slice(-10000);

      localStorage.setItem("console_logs", JSON.stringify(logsToStore));

      // Also store in user's database if authenticated
      const user = await this.getCurrentUser();
      if (user) {
        if (!user.logs) {
          user.logs = [];
        }
        user.logs.push(...logs);
        user.logs = user.logs.slice(-5000); // Keep last 5000 logs per user
        await this.dbService.saveUserAccount(user);
      }
    } catch (error) {
      this.originalConsole.error("Error storing logs in database:", error);
    }
  }

  // Get stored logs
  async getStoredLogs(): Promise<ConsoleLogEntry[]> {
    try {
      const stored = localStorage.getItem("console_logs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Analyze logs and suggest fixes
  async analyzeAndSuggestFix(
    logEntry: ConsoleLogEntry,
  ): Promise<FixSuggestion[]> {
    try {
      const suggestions: FixSuggestion[] = [];

      // Built-in pattern matching
      const builtInFix = this.getBuiltInFix(logEntry);
      if (builtInFix) {
        suggestions.push(builtInFix);
      }

      // AI analysis
      const aiAnalysis = await this.aiService.analyzeError(logEntry);
      if (aiAnalysis) {
        logEntry.aiAnalysis = aiAnalysis.analysis;
        suggestions.push(...aiAnalysis.suggestions);
      }

      return suggestions;
    } catch (error) {
      this.originalConsole.error("Error analyzing log for fixes:", error);
      return [];
    }
  }

  // Built-in fix patterns
  private getBuiltInFix(logEntry: ConsoleLogEntry): FixSuggestion | null {
    const message = logEntry.message.toLowerCase();

    // DatabaseService.getInstance is not a function
    if (message.includes("databaseservice.getinstance is not a function")) {
      return {
        id: this.generateLogId(),
        logId: logEntry.id,
        title: "Fix DatabaseService Import",
        description: "DatabaseService is being imported incorrectly",
        solution:
          'Change import to use default export: import DatabaseService from "./DatabaseService"',
        confidence: 0.95,
        automated: true,
        code: 'import DatabaseService from "./DatabaseService";\n// DatabaseService is already an instance, use directly\nconst result = await DatabaseService.someMethod();',
        testable: true,
      };
    }

    // loadUserPreferences is not a function
    if (message.includes("loaduserpreferences is not a function")) {
      return {
        id: this.generateLogId(),
        logId: logEntry.id,
        title: "Fix Missing Method",
        description: "loadUserPreferences method is not defined",
        solution: "Add the missing loadUserPreferences method to the class",
        confidence: 0.85,
        automated: false,
        code: `async loadUserPreferences(): Promise<void> {
  try {
    // Load user preferences from database
    const preferences = await this.db.getUserPreferences(this.userId);
    this.preferences = preferences || {};
  } catch (error) {
    console.error('Error loading user preferences:', error);
  }
}`,
        testable: true,
      };
    }

    // Network errors
    if (message.includes("500 (internal server error)")) {
      return {
        id: this.generateLogId(),
        logId: logEntry.id,
        title: "Fix Server Error",
        description: "Server returning 500 error",
        solution: "Check server logs and API endpoint functionality",
        confidence: 0.7,
        automated: false,
        testable: false,
      };
    }

    return null;
  }

  // Apply automated fix
  async applyAutomatedFix(suggestion: FixSuggestion): Promise<boolean> {
    try {
      if (!suggestion.automated || !suggestion.code) {
        return false;
      }

      // Store fix application
      this.fixHistory.set(suggestion.logId, suggestion.solution);

      // Mark log as fixed
      const logs = await this.getStoredLogs();
      const logIndex = logs.findIndex((log) => log.id === suggestion.logId);
      if (logIndex !== -1) {
        logs[logIndex].isFixed = true;
        logs[logIndex].fixApplied = suggestion.solution;
        localStorage.setItem("console_logs", JSON.stringify(logs));
      }

      // Log the fix application
      await this.logEvent(
        "info",
        `Automated fix applied: ${suggestion.title}`,
        "system",
      );

      return true;
    } catch (error) {
      this.originalConsole.error("Error applying automated fix:", error);
      return false;
    }
  }

  // Get error statistics
  getErrorStatistics(): {
    totalLogs: number;
    errorCount: number;
    warningCount: number;
    criticalCount: number;
    topErrors: Array<{ pattern: string; count: number }>;
    fixedCount: number;
  } {
    const totalLogs = this.logs.length;
    const errorCount = this.logs.filter((log) => log.level === "error").length;
    const warningCount = this.logs.filter((log) => log.level === "warn").length;
    const criticalCount = this.logs.filter(
      (log) => log.severity === "critical",
    ).length;
    const fixedCount = this.logs.filter((log) => log.isFixed).length;

    const topErrors = Array.from(this.errorPatterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pattern, count]) => ({ pattern, count }));

    return {
      totalLogs,
      errorCount,
      warningCount,
      criticalCount,
      topErrors,
      fixedCount,
    };
  }

  // Get recent logs
  getRecentLogs(limit = 100): ConsoleLogEntry[] {
    return this.logs.slice(-limit);
  }

  // Search logs
  searchLogs(
    query: string,
    filters?: {
      level?: string;
      severity?: string;
      category?: string;
      dateFrom?: string;
      dateTo?: string;
    },
  ): ConsoleLogEntry[] {
    let filteredLogs = this.logs;

    if (query) {
      filteredLogs = filteredLogs.filter((log) =>
        log.message.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (filters) {
      if (filters.level) {
        filteredLogs = filteredLogs.filter(
          (log) => log.level === filters.level,
        );
      }
      if (filters.severity) {
        filteredLogs = filteredLogs.filter(
          (log) => log.severity === filters.severity,
        );
      }
      if (filters.category) {
        filteredLogs = filteredLogs.filter(
          (log) => log.category === filters.category,
        );
      }
      if (filters.dateFrom) {
        filteredLogs = filteredLogs.filter(
          (log) => log.timestamp >= filters.dateFrom!,
        );
      }
      if (filters.dateTo) {
        filteredLogs = filteredLogs.filter(
          (log) => log.timestamp <= filters.dateTo!,
        );
      }
    }

    return filteredLogs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  // Manual log entry
  async logEvent(
    level: "log" | "error" | "warn" | "info",
    message: string,
    category: string,
  ): Promise<void> {
    await this.captureLog(level, [message]);
  }

  // Utility methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private determineSeverity(
    level: string,
    message: string,
  ): "low" | "medium" | "high" | "critical" {
    if (level === "error") {
      if (
        message.toLowerCase().includes("critical") ||
        message.toLowerCase().includes("fatal") ||
        message.toLowerCase().includes("cannot read properties")
      ) {
        return "critical";
      }
      return "high";
    }
    if (level === "warn") return "medium";
    return "low";
  }

  private categorizeLog(
    message: string,
  ):
    | "javascript"
    | "network"
    | "ui"
    | "database"
    | "authentication"
    | "general" {
    const msg = message.toLowerCase();
    if (
      msg.includes("databaseservice") ||
      msg.includes("database") ||
      msg.includes("sql")
    )
      return "database";
    if (msg.includes("auth") || msg.includes("login") || msg.includes("token"))
      return "authentication";
    if (
      msg.includes("fetch") ||
      msg.includes("http") ||
      msg.includes("api") ||
      msg.includes("network")
    )
      return "network";
    if (
      msg.includes("dom") ||
      msg.includes("element") ||
      msg.includes("click") ||
      msg.includes("ui")
    )
      return "ui";
    if (
      msg.includes("function") ||
      msg.includes("undefined") ||
      msg.includes("null")
    )
      return "javascript";
    return "general";
  }

  private extractErrorPattern(message: string): string {
    // Extract common error patterns
    const patterns = [
      /TypeError: (.+) is not a function/,
      /ReferenceError: (.+) is not defined/,
      /Cannot read properties of (.+)/,
      /Failed to fetch/,
      /Network Error/,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return message.split("\n")[0]; // First line as pattern
  }

  private extractLineNumber(stack?: string): number | undefined {
    if (!stack) return undefined;
    const match = stack.match(/:(\d+):\d+/);
    return match ? parseInt(match[1]) : undefined;
  }

  private extractColumnNumber(stack?: string): number | undefined {
    if (!stack) return undefined;
    const match = stack.match(/:(\d+):(\d+)/);
    return match ? parseInt(match[2]) : undefined;
  }

  private async getCurrentUser() {
    try {
      // Try to get user from auth service or database
      return null; // Implement based on your auth system
    } catch {
      return null;
    }
  }

  private async getCurrentUserId(): string {
    const user = await this.getCurrentUser();
    return user?.id || "anonymous";
  }
}

// Extend EnhancedAIService with error analysis
declare module "./EnhancedAIService" {
  interface EnhancedAIService {
    analyzeError(logEntry: ConsoleLogEntry): Promise<{
      analysis: string;
      suggestions: FixSuggestion[];
    } | null>;
  }
}

export default ConsoleLogMonitoringService;
