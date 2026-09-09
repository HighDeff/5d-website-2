// Strategy Execution Monitor AI - Oversees task completion and reports to other AIs
import AITaskDatabase, { AITask, AIAgent } from "./AITaskDatabase";
import AICoordinationEngine from "./AICoordinationEngine";
import AICentralCommand from "./AICentralCommand";

export interface ExecutionMonitorReport {
  id: string;
  taskId: string;
  agentId: string;
  status: "monitoring" | "incomplete" | "stalled" | "failed" | "completed";
  issuesDetected: string[];
  recommendations: string[];
  timeMonitored: number; // minutes
  expectedCompletion: string;
  actualProgress: number; // 0-100%
  strategiesAttempted: number;
  lastActivity: string;
  aiNotifications: AINotification[];
}

export interface AINotification {
  targetAI: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  actionRequired: string;
  timestamp: string;
}

class StrategyExecutionMonitor {
  private static instance: StrategyExecutionMonitor;
  private taskDatabase = AITaskDatabase;
  private coordinationEngine = AICoordinationEngine;
  private centralCommand = AICentralCommand;
  private monitoringReports: Map<string, ExecutionMonitorReport> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  static getInstance(): StrategyExecutionMonitor {
    if (!StrategyExecutionMonitor.instance) {
      StrategyExecutionMonitor.instance = new StrategyExecutionMonitor();
    }
    return StrategyExecutionMonitor.instance;
  }

  constructor() {
    this.startMonitoring();
    this.registerAsAgent();
    console.log("👁️ Strategy Execution Monitor AI: Initialized");
  }

  private async registerAsAgent(): Promise<void> {
    try {
      await this.centralCommand.registerAgent({
        id: "strategy-execution-monitor",
        name: "Strategy Execution Monitor AI",
        type: "monitor",
        specialties: [
          "execution-oversight",
          "task-validation",
          "ai-coordination",
        ],
        capabilities: [
          "task-progress-tracking",
          "execution-validation",
          "ai-notification",
          "strategy-analysis",
          "completion-verification",
        ],
        configuration: {
          monitorInterval: 15000, // 15 seconds
          timeoutThreshold: 300000, // 5 minutes
          stalledThreshold: 600000, // 10 minutes
        },
      });
    } catch (error) {
      console.error("Failed to register Strategy Execution Monitor:", error);
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    this.checkInterval = setInterval(() => {
      this.checkAllExecutions();
    }, 15000); // Check every 15 seconds

    console.log(
      "🔍 Strategy Execution Monitor: Started monitoring task executions",
    );
  }

  private async checkAllExecutions(): Promise<void> {
    try {
      const activeTasks = this.taskDatabase.getTasksByStatus("in_progress");
      const assignedTasks = this.taskDatabase.getTasksByStatus("assigned");
      const allMonitoredTasks = [...activeTasks, ...assignedTasks];

      for (const task of allMonitoredTasks) {
        await this.monitorTaskExecution(task);
      }

      // Check for stalled agents
      await this.checkAgentHealth();

      // Review completed tasks for quality
      await this.reviewCompletedTasks();
    } catch (error) {
      console.error("Error in execution monitoring:", error);
    }
  }

  private async monitorTaskExecution(task: AITask): Promise<void> {
    const report = this.getOrCreateReport(task);
    const now = Date.now();
    const taskAge = now - new Date(task.createdAt).getTime();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    // Calculate expected progress
    const expectedProgress = Math.min((taskAge / maxAge) * 100, 100);
    const actualProgress = this.calculateActualProgress(task);

    report.actualProgress = actualProgress;
    report.timeMonitored = taskAge / (60 * 1000); // in minutes

    // Detect issues
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check if task is stalled
    if (taskAge > maxAge && actualProgress < 50) {
      issues.push("Task execution time exceeded expected duration");
      recommendations.push("Reassign task to different agent");
      report.status = "stalled";
    }

    // Check if progress is too slow
    if (actualProgress < expectedProgress - 30) {
      issues.push("Task progress is significantly behind schedule");
      recommendations.push("Check agent availability and capabilities");
      report.status = "incomplete";
    }

    // Check if no recent activity
    const lastActivityTime =
      task.logs.length > 0
        ? new Date(task.logs[task.logs.length - 1].timestamp).getTime()
        : new Date(task.createdAt).getTime();

    if (now - lastActivityTime > 5 * 60 * 1000) {
      // 5 minutes no activity
      issues.push("No recent activity detected on task");
      recommendations.push("Send status request to assigned agents");
      report.status = "stalled";
    }

    // Check strategy execution
    if (task.strategies.length === 0) {
      issues.push("No strategies have been developed for this task");
      recommendations.push("Trigger strategy development phase");
    }

    if (task.executionPlan.length === 0 && task.status === "in_progress") {
      issues.push("Task marked in progress but no execution plan exists");
      recommendations.push("Force planning phase restart");
    }

    report.issuesDetected = issues;
    report.recommendations = recommendations;

    // Notify other AIs if issues found
    if (issues.length > 0) {
      await this.notifyAIsAboutIssues(task, report);
    }

    this.monitoringReports.set(task.id, report);
  }

  private calculateActualProgress(task: AITask): number {
    let progress = 0;

    // Progress based on task status
    switch (task.status) {
      case "pending":
        progress += 10;
        break;
      case "assigned":
        progress += 25;
        break;
      case "in_progress":
        progress += 50;
        break;
      case "completed":
        progress = 100;
        break;
      case "failed":
        progress = 0;
        break;
    }

    // Progress based on strategies developed
    if (task.strategies.length > 0) progress += 15;

    // Progress based on execution plan
    if (task.executionPlan.length > 0) {
      const completedSteps = task.executionPlan.filter(
        (step) => step.status === "completed",
      ).length;
      const totalSteps = task.executionPlan.length;
      if (totalSteps > 0) {
        progress += (completedSteps / totalSteps) * 25;
      }
    }

    return Math.min(progress, 100);
  }

  private getOrCreateReport(task: AITask): ExecutionMonitorReport {
    const existing = this.monitoringReports.get(task.id);
    if (existing) return existing;

    const report: ExecutionMonitorReport = {
      id: `monitor_${task.id}_${Date.now()}`,
      taskId: task.id,
      agentId: task.assignedTo[0] || "unassigned",
      status: "monitoring",
      issuesDetected: [],
      recommendations: [],
      timeMonitored: 0,
      expectedCompletion: new Date(
        Date.now() + task.estimatedTime * 60 * 1000,
      ).toISOString(),
      actualProgress: 0,
      strategiesAttempted: task.strategies.length,
      lastActivity: new Date().toISOString(),
      aiNotifications: [],
    };

    return report;
  }

  private async notifyAIsAboutIssues(
    task: AITask,
    report: ExecutionMonitorReport,
  ): Promise<void> {
    const notifications: AINotification[] = [];

    // Notify assigned agents
    for (const agentId of task.assignedTo) {
      notifications.push({
        targetAI: agentId,
        message: `Task ${task.title} requires attention: ${report.issuesDetected.join(", ")}`,
        priority: report.status === "stalled" ? "high" : "medium",
        actionRequired: report.recommendations[0] || "Review task status",
        timestamp: new Date().toISOString(),
      });
    }

    // Notify coordination engine
    notifications.push({
      targetAI: "ai-coordination-engine",
      message: `Task execution issues detected: ${task.title}`,
      priority: "medium",
      actionRequired: "Review task assignment and strategy",
      timestamp: new Date().toISOString(),
    });

    // Notify central command
    notifications.push({
      targetAI: "central-command",
      message: `Execution monitoring alert for task: ${task.title}`,
      priority: report.status === "stalled" ? "high" : "medium",
      actionRequired: "Coordinate resolution with other AIs",
      timestamp: new Date().toISOString(),
    });

    report.aiNotifications.push(...notifications);

    // Send notifications through central command
    for (const notification of notifications) {
      try {
        await this.centralCommand.broadcast({
          from: "strategy-execution-monitor",
          to: notification.targetAI,
          content: notification.message,
          priority: notification.priority,
          actionRequired: notification.actionRequired,
          taskId: task.id,
          reportId: report.id,
        });
      } catch (error) {
        console.error(`Failed to notify ${notification.targetAI}:`, error);
      }
    }

    console.log(
      `📢 Sent ${notifications.length} notifications about task ${task.id} issues`,
    );
  }

  private async checkAgentHealth(): Promise<void> {
    const agents = this.taskDatabase.getAgents();

    for (const agent of agents) {
      const lastActiveTime = new Date(agent.lastActive).getTime();
      const now = Date.now();
      const inactiveTime = now - lastActiveTime;

      // Agent inactive for more than 15 minutes
      if (inactiveTime > 15 * 60 * 1000 && agent.availability === "busy") {
        console.warn(
          `⚠️ Agent ${agent.name} appears stalled - inactive for ${Math.round(inactiveTime / 60000)} minutes`,
        );

        // Reset agent availability
        agent.availability = "available";
        agent.currentTasks = [];

        // Create alert
        await this.centralCommand.createTask({
          title: `Agent Health Alert: ${agent.name}`,
          description: `Agent ${agent.name} has been inactive for ${Math.round(inactiveTime / 60000)} minutes`,
          severity: "medium",
          data: {
            issue: {
              type: "agent_health",
              severity: "medium",
              description: `Agent appears stalled or unresponsive`,
              proposedFix: `Reset agent status and redistribute tasks`,
              successProbability: 85,
            },
          },
        });
      }
    }
  }

  private async reviewCompletedTasks(): Promise<void> {
    const recentCompleted = this.taskDatabase
      .getTasks()
      .filter((task) => task.status === "completed")
      .filter((task) => {
        const completedTime = new Date(
          task.completedAt || task.createdAt,
        ).getTime();
        return Date.now() - completedTime < 5 * 60 * 1000; // Last 5 minutes
      });

    for (const task of recentCompleted) {
      await this.validateTaskCompletion(task);
    }
  }

  private async validateTaskCompletion(task: AITask): Promise<void> {
    const issues: string[] = [];

    // Check if success criteria were met
    if (task.successCriteria.length > 0) {
      // Simple validation - check if target element exists and is functional
      if (task.targetElement) {
        try {
          const elements = document.querySelectorAll(task.targetElement);
          if (elements.length === 0) {
            issues.push("Target element not found after completion");
          } else {
            const element = elements[0] as HTMLElement;
            const style = window.getComputedStyle(element);
            if (style.display === "none" || style.visibility === "hidden") {
              issues.push("Target element is not visible after completion");
            }
          }
        } catch (error) {
          issues.push("Unable to validate target element");
        }
      }
    }

    // Check if completion time was reasonable
    const expectedTime = task.estimatedTime * 60 * 1000; // in ms
    const actualTime = task.actualTime * 60 * 1000; // in ms
    if (actualTime > expectedTime * 2) {
      issues.push("Task took significantly longer than estimated");
    }

    if (issues.length > 0) {
      console.warn(
        `⚠️ Task completion validation failed for ${task.title}:`,
        issues,
      );

      // Create follow-up task
      await this.centralCommand.createTask({
        title: `Validation Issue: ${task.title}`,
        description: `Completed task may have issues: ${issues.join(", ")}`,
        severity: "medium",
        data: {
          issue: {
            type: "validation_failure",
            severity: "medium",
            description: `Task marked complete but validation failed`,
            proposedFix: `Re-verify task completion and fix any remaining issues`,
            successProbability: 75,
          },
        },
      });
    }
  }

  // Public interface
  getMonitoringReports(): ExecutionMonitorReport[] {
    return Array.from(this.monitoringReports.values());
  }

  getReportForTask(taskId: string): ExecutionMonitorReport | null {
    return this.monitoringReports.get(taskId) || null;
  }

  async forceTaskReview(
    taskId: string,
  ): Promise<ExecutionMonitorReport | null> {
    const task = this.taskDatabase.getTask(taskId);
    if (!task) return null;

    await this.monitorTaskExecution(task);
    return this.monitoringReports.get(taskId) || null;
  }

  async requestAgentStatus(agentId: string): Promise<void> {
    await this.centralCommand.broadcast({
      from: "strategy-execution-monitor",
      to: agentId,
      content: "Status check requested - please report current task progress",
      priority: "medium",
      actionRequired: "Provide status update",
    });
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log("🔍 Strategy Execution Monitor: Stopped monitoring");
  }

  getSystemHealth(): {
    totalTasksMonitored: number;
    stalledTasks: number;
    incompleteTasks: number;
    avgCompletionTime: number;
    agentUtilization: number;
  } {
    const reports = Array.from(this.monitoringReports.values());
    const tasks = this.taskDatabase.getTasks();
    const agents = this.taskDatabase.getAgents();

    return {
      totalTasksMonitored: reports.length,
      stalledTasks: reports.filter((r) => r.status === "stalled").length,
      incompleteTasks: reports.filter((r) => r.status === "incomplete").length,
      avgCompletionTime:
        tasks
          .filter((t) => t.status === "completed")
          .reduce((avg, t) => avg + t.actualTime, 0) /
        Math.max(tasks.filter((t) => t.status === "completed").length, 1),
      agentUtilization:
        (agents.filter((a) => a.availability === "busy").length /
          Math.max(agents.length, 1)) *
        100,
    };
  }
}

export default StrategyExecutionMonitor.getInstance();
