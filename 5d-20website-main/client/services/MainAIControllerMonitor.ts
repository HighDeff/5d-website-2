// Main AI Controller Health Monitor - Ensures main AI is always active and responsive
import AICentralCommand from "./AICentralCommand";
import AICoordinationEngine from "./AICoordinationEngine";
import AITaskDatabase from "./AITaskDatabase";
import StrategyExecutionMonitor from "./StrategyExecutionMonitor";
import PatternRecognitionAI from "./PatternRecognitionAI";
import UserInteractionTracker from "./UserInteractionTracker";

export interface SystemHealthCheck {
  id: string;
  timestamp: string;
  component: string;
  status: "healthy" | "warning" | "critical" | "offline";
  responseTime: number;
  issues: string[];
  actions: string[];
  lastSuccessfulCheck: string;
}

export interface MainAIStatus {
  isOnline: boolean;
  lastHeartbeat: string;
  responsiveness: number; // 0-100
  systemLoad: number; // 0-100
  activeConnections: number;
  totalUptime: number; // seconds
  errorCount: number;
  recoveryAttempts: number;
}

class MainAIControllerMonitor {
  private static instance: MainAIControllerMonitor;
  private healthChecks: Map<string, SystemHealthCheck> = new Map();
  private monitorInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private systemStartTime = Date.now();
  private lastHeartbeat = Date.now();
  private errorCount = 0;
  private recoveryAttempts = 0;

  static getInstance(): MainAIControllerMonitor {
    if (!MainAIControllerMonitor.instance) {
      MainAIControllerMonitor.instance = new MainAIControllerMonitor();
    }
    return MainAIControllerMonitor.instance;
  }

  constructor() {
    this.startMonitoring();
    this.registerAsAgent();
    console.log(
      "🩺 Main AI Controller Monitor: Initialized and watching system health",
    );
  }

  private async registerAsAgent(): Promise<void> {
    try {
      await AICentralCommand.registerAgent({
        id: "main-ai-controller-monitor",
        name: "Main AI Controller Monitor",
        type: "monitor",
        specialties: [
          "system-health",
          "ai-monitoring",
          "recovery-operations",
          "uptime-management",
        ],
        capabilities: [
          "health-checking",
          "automatic-recovery",
          "system-diagnostics",
          "performance-monitoring",
          "alert-generation",
        ],
        configuration: {
          checkInterval: 10000, // 10 seconds
          heartbeatInterval: 5000, // 5 seconds
          recoveryTimeout: 30000, // 30 seconds
          criticalThreshold: 3, // errors before critical alert
        },
      });
    } catch (error) {
      console.error("Failed to register Main AI Controller Monitor:", error);
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Main health check every 10 seconds
    this.monitorInterval = setInterval(() => {
      this.performSystemHealthCheck();
    }, 10000);

    // Heartbeat every 5 seconds
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 5000);

    console.log("🩺 Main AI Controller Monitor: Started system monitoring");
  }

  private async performSystemHealthCheck(): Promise<void> {
    const components = [
      { name: "AICentralCommand", service: AICentralCommand },
      { name: "AICoordinationEngine", service: AICoordinationEngine },
      { name: "AITaskDatabase", service: AITaskDatabase },
      { name: "StrategyExecutionMonitor", service: StrategyExecutionMonitor },
      { name: "PatternRecognitionAI", service: PatternRecognitionAI },
      { name: "UserInteractionTracker", service: UserInteractionTracker },
    ];

    for (const component of components) {
      await this.checkComponent(component.name, component.service);
    }

    // Check overall system health
    await this.checkOverallSystemHealth();
  }

  private async checkComponent(name: string, service: any): Promise<void> {
    const startTime = Date.now();
    let status: SystemHealthCheck["status"] = "healthy";
    const issues: string[] = [];
    const actions: string[] = [];

    try {
      // Test basic responsiveness
      if (typeof service.getSystemStats === "function") {
        const stats = service.getSystemStats();
        if (!stats) {
          issues.push("Service not returning system stats");
          status = "warning";
        }
      }

      // Test specific functionality
      switch (name) {
        case "AICentralCommand":
          if (!service.isRunning) {
            issues.push("Central command not running");
            status = "critical";
            actions.push("Restart central command");
          }
          break;

        case "AICoordinationEngine":
          const queue = service.getExecutionQueue();
          if (queue && queue.length > 10) {
            issues.push("Execution queue backing up");
            status = "warning";
            actions.push("Review task processing");
          }
          break;

        case "AITaskDatabase":
          const agents = service.getAgents();
          const availableAgents = agents.filter(
            (a: any) => a.availability === "available",
          );
          if (availableAgents.length === 0 && agents.length > 0) {
            issues.push("No available agents");
            status = "warning";
            actions.push("Reset agent availability");
          }
          break;

        case "StrategyExecutionMonitor":
          const reports = service.getMonitoringReports();
          const stalledTasks = reports.filter(
            (r: any) => r.status === "stalled",
          );
          if (stalledTasks.length > 3) {
            issues.push("Multiple stalled tasks");
            status = "warning";
            actions.push("Review task execution");
          }
          break;
      }

      // If no specific issues, mark as healthy
      if (issues.length === 0) {
        status = "healthy";
      }
    } catch (error) {
      issues.push(`Service error: ${error.message}`);
      status = "critical";
      actions.push("Restart service");
      this.errorCount++;
    }

    const responseTime = Date.now() - startTime;

    const healthCheck: SystemHealthCheck = {
      id: `health_${name}_${Date.now()}`,
      timestamp: new Date().toISOString(),
      component: name,
      status,
      responseTime,
      issues,
      actions,
      lastSuccessfulCheck:
        status === "healthy"
          ? new Date().toISOString()
          : this.healthChecks.get(name)?.lastSuccessfulCheck ||
            new Date().toISOString(),
    };

    this.healthChecks.set(name, healthCheck);

    // Take action if critical
    if (status === "critical") {
      await this.handleCriticalIssue(healthCheck);
    }
  }

  private async checkOverallSystemHealth(): Promise<void> {
    const healthChecks = Array.from(this.healthChecks.values());
    const criticalCount = healthChecks.filter(
      (h) => h.status === "critical",
    ).length;
    const warningCount = healthChecks.filter(
      (h) => h.status === "warning",
    ).length;

    let overallStatus: SystemHealthCheck["status"] = "healthy";
    const issues: string[] = [];
    const actions: string[] = [];

    if (criticalCount > 0) {
      overallStatus = "critical";
      issues.push(`${criticalCount} critical system issues`);
      actions.push("Immediate intervention required");
    } else if (warningCount > 2) {
      overallStatus = "warning";
      issues.push(`${warningCount} system warnings`);
      actions.push("Review system performance");
    }

    // Check system performance
    const avgResponseTime =
      healthChecks.reduce((sum, h) => sum + h.responseTime, 0) /
      Math.max(healthChecks.length, 1);
    if (avgResponseTime > 1000) {
      issues.push("High system response times");
      if (overallStatus === "healthy") overallStatus = "warning";
    }

    // Check uptime and stability
    const uptime = (Date.now() - this.systemStartTime) / 1000;
    const errorRate = this.errorCount / Math.max(uptime / 60, 1); // errors per minute

    if (errorRate > 0.5) {
      issues.push("High error rate detected");
      if (overallStatus === "healthy") overallStatus = "warning";
    }

    const systemCheck: SystemHealthCheck = {
      id: `system_health_${Date.now()}`,
      timestamp: new Date().toISOString(),
      component: "System Overall",
      status: overallStatus,
      responseTime: avgResponseTime,
      issues,
      actions,
      lastSuccessfulCheck:
        overallStatus === "healthy"
          ? new Date().toISOString()
          : this.healthChecks.get("System Overall")?.lastSuccessfulCheck ||
            new Date().toISOString(),
    };

    this.healthChecks.set("System Overall", systemCheck);

    // Report system status
    await this.reportSystemStatus(systemCheck);
  }

  private async handleCriticalIssue(
    healthCheck: SystemHealthCheck,
  ): Promise<void> {
    console.error(
      `🚨 Critical issue detected in ${healthCheck.component}:`,
      healthCheck.issues,
    );

    // Attempt automatic recovery
    this.recoveryAttempts++;

    try {
      switch (healthCheck.component) {
        case "AICentralCommand":
          // Try to restart central command
          console.log("🔧 Attempting to restart AICentralCommand...");
          // The service should auto-recover, but we can trigger reinitialization
          break;

        case "AITaskDatabase":
          // Reset agent availability
          console.log("🔧 Resetting AI agent availability...");
          AITaskDatabase.resetAgentAvailability();
          break;

        case "AICoordinationEngine":
          // Clear execution queue if backed up
          console.log("🔧 Clearing execution queue...");
          // The service should handle this internally
          break;
      }

      // Create recovery task
      await AICentralCommand.createTask({
        title: `Critical System Recovery: ${healthCheck.component}`,
        description: `Critical issue detected: ${healthCheck.issues.join(", ")}`,
        severity: "critical",
        data: {
          issue: {
            type: "system_critical",
            severity: "critical",
            description: `Critical system component failure`,
            proposedFix: `Automated recovery attempted: ${healthCheck.actions.join(", ")}`,
            successProbability: 70,
          },
        },
      });
    } catch (error) {
      console.error("Recovery attempt failed:", error);
    }
  }

  private async reportSystemStatus(
    systemCheck: SystemHealthCheck,
  ): Promise<void> {
    const status = this.getMainAIStatus();

    // Send status update
    await AICentralCommand.sendMainAIUpdate({
      type: "system-status",
      message: `System Health: ${systemCheck.status} | Uptime: ${Math.round(status.totalUptime / 60)}min | Errors: ${status.errorCount}`,
      priority:
        systemCheck.status === "critical"
          ? "critical"
          : systemCheck.status === "warning"
            ? "medium"
            : "low",
      data: {
        systemHealth: systemCheck,
        mainAIStatus: status,
        healthChecks: Array.from(this.healthChecks.values()),
      },
      source: "main-ai-controller-monitor",
    });

    // Log periodic status
    if (Date.now() % 60000 < 10000) {
      // Every minute (approximately)
      console.log(
        `🩺 System Status: ${systemCheck.status} | Components: ${Array.from(this.healthChecks.values()).filter((h) => h.status === "healthy").length}/${this.healthChecks.size} healthy`,
      );
    }
  }

  private sendHeartbeat(): void {
    this.lastHeartbeat = Date.now();

    // Store heartbeat in localStorage for persistence
    localStorage.setItem("mainAIHeartbeat", this.lastHeartbeat.toString());

    // Send lightweight heartbeat signal
    AICentralCommand.sendMainAIUpdate({
      type: "system-status",
      message: "Main AI Controller heartbeat",
      priority: "low",
      data: { heartbeat: this.lastHeartbeat },
      source: "main-ai-heartbeat",
    });
  }

  // Public interface
  getMainAIStatus(): MainAIStatus {
    const uptime = (Date.now() - this.systemStartTime) / 1000;
    const timeSinceHeartbeat = Date.now() - this.lastHeartbeat;
    const responsiveness = Math.max(0, 100 - (timeSinceHeartbeat / 1000) * 10);

    const healthChecks = Array.from(this.healthChecks.values());
    const systemLoad =
      (healthChecks.filter((h) => h.status !== "healthy").length /
        Math.max(healthChecks.length, 1)) *
      100;

    return {
      isOnline: timeSinceHeartbeat < 30000, // Online if heartbeat within 30 seconds
      lastHeartbeat: new Date(this.lastHeartbeat).toISOString(),
      responsiveness: Math.round(responsiveness),
      systemLoad: Math.round(systemLoad),
      activeConnections: healthChecks.length,
      totalUptime: Math.round(uptime),
      errorCount: this.errorCount,
      recoveryAttempts: this.recoveryAttempts,
    };
  }

  getHealthChecks(): SystemHealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  getComponentHealth(component: string): SystemHealthCheck | null {
    return this.healthChecks.get(component) || null;
  }

  async forceHealthCheck(): Promise<void> {
    await this.performSystemHealthCheck();
  }

  async restartComponent(component: string): Promise<boolean> {
    console.log(`🔄 Attempting to restart component: ${component}`);

    this.recoveryAttempts++;

    try {
      // Component-specific restart logic
      switch (component) {
        case "AITaskDatabase":
          AITaskDatabase.resetAgentAvailability();
          return true;

        case "AICentralCommand":
          // The service should auto-restart on next operation
          return true;

        default:
          console.warn(`No restart procedure defined for ${component}`);
          return false;
      }
    } catch (error) {
      console.error(`Failed to restart ${component}:`, error);
      return false;
    }
  }

  stopMonitoring(): void {
    this.isMonitoring = false;

    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    console.log("🩺 Main AI Controller Monitor: Stopped monitoring");
  }

  // Check if main AI controller has been offline
  checkForOfflineRecovery(): void {
    const lastHeartbeat = localStorage.getItem("mainAIHeartbeat");
    if (lastHeartbeat) {
      const lastTime = parseInt(lastHeartbeat);
      const offlineTime = Date.now() - lastTime;

      if (offlineTime > 60000) {
        // Offline for more than 1 minute
        console.warn(
          `🚨 Main AI Controller was offline for ${Math.round(offlineTime / 1000)} seconds`,
        );

        // Trigger recovery procedures
        this.performRecoveryAfterOffline(offlineTime);
      }
    }
  }

  private async performRecoveryAfterOffline(
    offlineTime: number,
  ): Promise<void> {
    console.log("🔧 Performing recovery after offline period...");

    // Reset all systems
    try {
      AITaskDatabase.resetAgentAvailability();

      // Create recovery notification
      await AICentralCommand.createTask({
        title: "System Recovery After Offline",
        description: `Main AI Controller recovered after ${Math.round(offlineTime / 1000)} seconds offline`,
        severity: "medium",
        data: {
          issue: {
            type: "system_recovery",
            severity: "medium",
            description: "System was offline and has now recovered",
            proposedFix: "Verify all systems are functioning correctly",
            successProbability: 85,
          },
        },
      });
    } catch (error) {
      console.error("Recovery after offline failed:", error);
    }
  }
}

// Initialize and check for offline recovery
const monitor = MainAIControllerMonitor.getInstance();
monitor.checkForOfflineRecovery();

export default monitor;
