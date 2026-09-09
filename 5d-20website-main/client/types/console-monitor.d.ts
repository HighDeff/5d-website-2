// Type definitions for Console Monitor global functions

interface ConsoleMonitorLogs {
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

interface ConsoleMonitorStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  criticalCount: number;
  topErrors: Array<{ pattern: string; count: number }>;
  fixedCount: number;
}

interface ConsoleMonitorFilters {
  level?: string;
  severity?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ConsoleMonitor {
  start(): void;
  stop(): void;
  getLogs(limit?: number): ConsoleMonitorLogs[];
  search(query: string, filters?: ConsoleMonitorFilters): ConsoleMonitorLogs[];
  stats(): ConsoleMonitorStats;
  test(): void;
  clear(): void;
  help(): void;
}

declare global {
  interface Window {
    consoleMonitor: ConsoleMonitor;
    ConsoleLogMonitoringService: any;
  }
}

export {};
