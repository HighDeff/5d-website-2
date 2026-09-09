// AI Task Management Database - Central database for all AI operations, tasks, and strategies
export interface AITask {
  id: string;
  title: string;
  description: string;
  type: "major" | "minor";
  category:
    | "fix"
    | "enhancement"
    | "monitoring"
    | "analysis"
    | "research"
    | "optimization";
  priority: "critical" | "high" | "medium" | "low";
  status:
    | "pending"
    | "assigned"
    | "in_progress"
    | "researching"
    | "strategizing"
    | "executing"
    | "completed"
    | "failed"
    | "cancelled";
  assignedTo: string[];
  createdBy: string;
  requesterId?: string;
  targetPage: string;
  targetElement?: string;
  requirements: string[];
  constraints: string[];
  dependencies: string[];
  researchFindings: ResearchFinding[];
  strategies: TaskStrategy[];
  executionPlan: ExecutionStep[];
  codeSnippets: CodeSnippet[];
  attempts: TaskAttempt[];
  logs: TaskLog[];
  estimatedTime: number; // minutes
  actualTime: number; // minutes
  successCriteria: string[];
  rollbackPlan: RollbackStep[];
  createdAt: string;
  assignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  deadline?: string;
  tags: string[];
  metadata: Record<string, any>;
}

export interface ResearchFinding {
  id: string;
  source: string;
  finding: string;
  relevance: number; // 0-1
  codeExample?: string;
  implementation: string;
  pros: string[];
  cons: string[];
  complexity: "low" | "medium" | "high";
  discoveredAt: string;
  discoveredBy: string;
}

export interface TaskStrategy {
  id: string;
  name: string;
  description: string;
  approach: string;
  methods: string[];
  riskLevel: "low" | "medium" | "high";
  successProbability: number; // 0-1
  estimatedTime: number;
  requiredAIs: string[];
  codeComponents: string[];
  testingStrategy: string;
  rollbackStrategy: string;
  createdBy: string;
  votes: StrategyVote[];
  score: number;
}

export interface StrategyVote {
  aiId: string;
  vote: "approve" | "reject" | "needs_work";
  reasoning: string;
  suggestions?: string[];
  timestamp: string;
}

export interface ExecutionStep {
  id: string;
  order: number;
  description: string;
  action: string;
  target: string;
  parameters: Record<string, any>;
  expectedResult: string;
  validationMethod: string;
  rollbackAction: string;
  assignedTo: string;
  status: "pending" | "executing" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
  result?: string;
  logs: string[];
}

export interface CodeSnippet {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  usage: string;
  context: string;
  tested: boolean;
  testResults?: string;
  source: string;
  tags: string[];
  addedBy: string;
  addedAt: string;
  votes: number;
  usageCount: number;
}

export interface TaskAttempt {
  id: string;
  strategy: string;
  executor: string;
  startedAt: string;
  completedAt?: string;
  status: "in_progress" | "completed" | "failed" | "cancelled";
  steps: ExecutionStep[];
  result?: string;
  error?: string;
  metrics: {
    duration: number;
    stepsCompleted: number;
    stepsTotal: number;
    successRate: number;
  };
  logs: TaskLog[];
}

export interface TaskLog {
  id: string;
  timestamp: string;
  level: "debug" | "info" | "warn" | "error" | "success";
  source: string;
  action: string;
  message: string;
  details?: Record<string, any>;
  context: {
    page: string;
    element?: string;
    userId?: string;
  };
}

export interface RollbackStep {
  id: string;
  order: number;
  description: string;
  action: string;
  target: string;
  parameters: Record<string, any>;
  condition: string;
}

export interface AIAgent {
  id: string;
  name: string;
  type: "executor" | "researcher" | "strategist" | "monitor" | "validator";
  specialties: string[];
  capabilities: string[];
  availability: "available" | "busy" | "offline" | "maintenance";
  currentTasks: string[];
  completedTasks: number;
  successRate: number;
  averageTime: number; // minutes
  lastActive: string;
  performance: {
    tasksCompleted: number;
    tasksSuccessful: number;
    averageRating: number;
    totalTime: number;
  };
  configuration: Record<string, any>;
}

export interface MethodLibrary {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  code: string;
  language: string;
  parameters: MethodParameter[];
  returns: string;
  examples: MethodExample[];
  useCases: string[];
  complexity: "low" | "medium" | "high";
  reliability: number; // 0-1
  performance: number; // 0-1
  compatibility: string[];
  dependencies: string[];
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  successRate: number;
  tags: string[];
}

export interface MethodParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: string;
}

export interface MethodExample {
  id: string;
  title: string;
  description: string;
  input: any;
  output: any;
  context: string;
}

class AITaskDatabase {
  private static instance: AITaskDatabase;
  private tasks: Map<string, AITask> = new Map();
  private agents: Map<string, AIAgent> = new Map();
  private methods: Map<string, MethodLibrary> = new Map();
  private codeSnippets: Map<string, CodeSnippet> = new Map();
  private strategies: Map<string, TaskStrategy> = new Map();
  private dbKey = "aiTaskDatabase";
  private methodsKey = "aiMethodLibrary";
  private agentsKey = "aiAgents";
  private saveTimer: NodeJS.Timeout | null = null;
  private needsSave = false;

  static getInstance(): AITaskDatabase {
    if (!AITaskDatabase.instance) {
      AITaskDatabase.instance = new AITaskDatabase();
    }
    return AITaskDatabase.instance;
  }

  constructor() {
    this.loadDatabase();
    this.initializeAgents();
    this.initializeMethodLibrary();
    this.startPeriodicSave();
  }

  // Task Management
  async createTask(taskData: Partial<AITask>): Promise<AITask> {
    const task: AITask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskData.title || "Untitled Task",
      description: taskData.description || "",
      type: taskData.type || "minor",
      category: taskData.category || "fix",
      priority: taskData.priority || "medium",
      status: "pending",
      assignedTo: [],
      createdBy: taskData.createdBy || "system",
      requesterId: taskData.requesterId,
      targetPage: taskData.targetPage || window.location.pathname,
      targetElement: taskData.targetElement,
      requirements: taskData.requirements || [],
      constraints: taskData.constraints || [],
      dependencies: taskData.dependencies || [],
      researchFindings: [],
      strategies: [],
      executionPlan: [],
      codeSnippets: [],
      attempts: [],
      logs: [],
      estimatedTime: taskData.estimatedTime || 15,
      actualTime: 0,
      successCriteria: taskData.successCriteria || [],
      rollbackPlan: [],
      createdAt: new Date().toISOString(),
      tags: taskData.tags || [],
      metadata: taskData.metadata || {},
      ...taskData,
    };

    this.tasks.set(task.id, task);
    this.logTaskAction(task.id, "created", "Task created successfully", {
      task,
    });
    this.scheduleSave();

    console.log(`📋 AITaskDB: Created task ${task.id} - ${task.title}`);
    return task;
  }

  async assignTask(taskId: string, agentIds: string[]): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    // Check agent availability
    const availableAgents = agentIds.filter((id) => {
      const agent = this.agents.get(id);
      return agent && agent.availability === "available";
    });

    if (availableAgents.length === 0) {
      this.logTaskAction(taskId, "assignment_failed", "No available agents", {
        requestedAgents: agentIds,
      });
      return false;
    }

    task.assignedTo = availableAgents;
    task.status = "assigned";
    task.assignedAt = new Date().toISOString();

    // Update agent status
    availableAgents.forEach((agentId) => {
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.currentTasks.push(taskId);
        agent.availability = "busy";
      }
    });

    this.logTaskAction(taskId, "assigned", "Task assigned to agents", {
      agents: availableAgents,
    });
    this.scheduleSave();

    console.log(
      `🎯 AITaskDB: Assigned task ${taskId} to agents: ${availableAgents.join(", ")}`,
    );
    return true;
  }

  async startTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== "assigned") return false;

    task.status = "in_progress";
    task.startedAt = new Date().toISOString();

    this.logTaskAction(taskId, "started", "Task execution started");
    this.scheduleSave();

    console.log(`��� AITaskDB: Started task ${taskId}`);
    return true;
  }

  async completeTask(
    taskId: string,
    result: string,
    metrics?: any,
  ): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    task.status = "completed";
    task.completedAt = new Date().toISOString();
    task.actualTime = task.startedAt
      ? Math.round((Date.now() - new Date(task.startedAt).getTime()) / 60000)
      : 0;

    // Update agent performance
    task.assignedTo.forEach((agentId) => {
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.currentTasks = agent.currentTasks.filter((id) => id !== taskId);
        agent.availability = "available";
        agent.completedTasks++;
        agent.performance.tasksCompleted++;
        agent.performance.tasksSuccessful++;
        agent.performance.totalTime += task.actualTime;
        agent.lastActive = new Date().toISOString();
      }
    });

    this.logTaskAction(taskId, "completed", "Task completed successfully", {
      result,
      metrics,
    });
    this.scheduleSave();

    console.log(
      `✅ AITaskDB: Completed task ${taskId} in ${task.actualTime} minutes`,
    );
    return true;
  }

  // Research Management
  async addResearchFinding(
    taskId: string,
    finding: Omit<ResearchFinding, "id" | "discoveredAt">,
  ): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    const researchFinding: ResearchFinding = {
      id: `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      discoveredAt: new Date().toISOString(),
      ...finding,
    };

    task.researchFindings.push(researchFinding);
    this.logTaskAction(taskId, "research_added", "Research finding added", {
      finding: researchFinding,
    });
    this.scheduleSave();

    return true;
  }

  // Strategy Management
  async addStrategy(
    taskId: string,
    strategy: Omit<TaskStrategy, "id" | "votes" | "score">,
  ): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    const taskStrategy: TaskStrategy = {
      id: `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      votes: [],
      score: 0,
      ...strategy,
    };

    task.strategies.push(taskStrategy);
    this.strategies.set(taskStrategy.id, taskStrategy);
    this.logTaskAction(taskId, "strategy_added", "Strategy proposed", {
      strategy: taskStrategy,
    });
    this.scheduleSave();

    return true;
  }

  async voteOnStrategy(
    strategyId: string,
    vote: StrategyVote,
  ): Promise<boolean> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) return false;

    // Remove existing vote from same AI
    strategy.votes = strategy.votes.filter((v) => v.aiId !== vote.aiId);
    strategy.votes.push({
      ...vote,
      timestamp: new Date().toISOString(),
    });

    // Calculate score
    const approvals = strategy.votes.filter((v) => v.vote === "approve").length;
    const rejections = strategy.votes.filter((v) => v.vote === "reject").length;
    strategy.score =
      (approvals - rejections) / Math.max(strategy.votes.length, 1);

    this.scheduleSave();
    return true;
  }

  // Method Library Management
  async addMethod(
    method: Omit<
      MethodLibrary,
      "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate"
    >,
  ): Promise<string> {
    const methodId = `method_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const methodData: MethodLibrary = {
      id: methodId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      successRate: 1,
      ...method,
    };

    this.methods.set(methodId, methodData);
    this.scheduleSave();

    console.log(`📚 AITaskDB: Added method ${methodData.name} to library`);
    return methodId;
  }

  async findMethods(
    category: string,
    keywords: string[],
  ): Promise<MethodLibrary[]> {
    const methods = Array.from(this.methods.values());
    return methods
      .filter((method) => {
        const categoryMatch =
          method.category === category || method.subcategory === category;
        const keywordMatch = keywords.some(
          (keyword) =>
            method.name.toLowerCase().includes(keyword.toLowerCase()) ||
            method.description.toLowerCase().includes(keyword.toLowerCase()) ||
            method.tags.some((tag) =>
              tag.toLowerCase().includes(keyword.toLowerCase()),
            ),
        );
        return categoryMatch || keywordMatch;
      })
      .sort((a, b) => {
        // Sort by relevance (usage count * success rate)
        const scoreA = a.usageCount * a.successRate;
        const scoreB = b.usageCount * b.successRate;
        return scoreB - scoreA;
      });
  }

  async useMethod(methodId: string, success: boolean): Promise<void> {
    const method = this.methods.get(methodId);
    if (!method) return;

    method.usageCount++;
    const totalSuccesses =
      method.successRate * (method.usageCount - 1) + (success ? 1 : 0);
    method.successRate = totalSuccesses / method.usageCount;
    method.updatedAt = new Date().toISOString();

    this.scheduleSave();
  }

  // Code Snippets Management
  async addCodeSnippet(
    snippet: Omit<CodeSnippet, "id" | "addedAt" | "votes" | "usageCount">,
  ): Promise<string> {
    const snippetId = `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const codeSnippet: CodeSnippet = {
      id: snippetId,
      addedAt: new Date().toISOString(),
      votes: 0,
      usageCount: 0,
      ...snippet,
    };

    this.codeSnippets.set(snippetId, codeSnippet);
    this.scheduleSave();

    return snippetId;
  }

  // Logging
  private logTaskAction(
    taskId: string,
    action: string,
    message: string,
    details?: any,
  ): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    // Create safe details without circular references
    const safeDetails = details ? this.createSafeDetails(details) : undefined;

    const log: TaskLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level: "info",
      source: "AITaskDatabase",
      action,
      message,
      details: safeDetails,
      context: {
        page: window.location.pathname,
        element: task.targetElement,
      },
    };

    task.logs.push(log);

    // Keep only last 100 logs per task
    if (task.logs.length > 100) {
      task.logs = task.logs.slice(-100);
    }
  }

  private scheduleSave(): void {
    this.needsSave = true;

    if (this.saveTimer) {
      return; // Already scheduled
    }

    this.saveTimer = setTimeout(() => {
      if (this.needsSave) {
        this.saveDatabase();
        this.needsSave = false;
      }
      this.saveTimer = null;
    }, 3000); // Batch saves every 3 seconds instead of immediate
  }

  private createSafeDetails(details: any): any {
    if (!details) return details;

    try {
      // Create a safe copy without circular references
      if (typeof details === "object") {
        const safe: any = {};

        for (const [key, value] of Object.entries(details)) {
          if (key === "task") {
            // Replace task object with just the ID to break circular reference
            safe[key] = {
              id: (value as any)?.id,
              title: (value as any)?.title,
            };
          } else if (typeof value === "object" && value !== null) {
            // For other objects, create a shallow safe copy
            if (Array.isArray(value)) {
              safe[key] = value.slice(0, 5); // Limit arrays to first 5 items
            } else {
              safe[key] = { ...value };
              // Remove potential circular references
              delete safe[key].task;
              delete safe[key].logs;
              delete safe[key].parent;
            }
          } else {
            safe[key] = value;
          }
        }

        return safe;
      }

      return details;
    } catch (error) {
      // If we can't safely serialize, return a string representation
      return `[Object: ${typeof details}]`;
    }
  }

  // Query Methods
  getTask(taskId: string): AITask | undefined {
    return this.tasks.get(taskId);
  }

  getTasks(filter?: Partial<AITask>): AITask[] {
    const tasks = Array.from(this.tasks.values());
    if (!filter) return tasks;

    return tasks.filter((task) => {
      return Object.entries(filter).every(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            Array.isArray(task[key as keyof AITask]) &&
            value.every((v) => (task[key as keyof AITask] as any[]).includes(v))
          );
        }
        return task[key as keyof AITask] === value;
      });
    });
  }

  getTasksByStatus(status: AITask["status"]): AITask[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.status === status,
    );
  }

  getTasksByAgent(agentId: string): AITask[] {
    return Array.from(this.tasks.values()).filter((task) =>
      task.assignedTo.includes(agentId),
    );
  }

  getAgent(agentId: string): AIAgent | undefined {
    return this.agents.get(agentId);
  }

  getAgents(filter?: Partial<AIAgent>): AIAgent[] {
    const agents = Array.from(this.agents.values());
    if (!filter) return agents;

    return agents.filter((agent) => {
      return Object.entries(filter).every(([key, value]) => {
        return agent[key as keyof AIAgent] === value;
      });
    });
  }

  getAvailableAgents(specialties?: string[]): AIAgent[] {
    return Array.from(this.agents.values()).filter((agent) => {
      const isAvailable = agent.availability === "available";
      const hasSpecialty =
        !specialties || specialties.some((s) => agent.specialties.includes(s));
      return isAvailable && hasSpecialty;
    });
  }

  // Database Management
  private loadDatabase(): void {
    try {
      // Load tasks
      const tasksData = localStorage.getItem(this.dbKey);
      if (tasksData) {
        try {
          const tasksArray = JSON.parse(tasksData);
          this.tasks = new Map(tasksArray);
          console.log(`📊 Loaded ${this.tasks.size} tasks from database`);
        } catch (parseError) {
          console.warn("Tasks data corrupted, starting fresh:", parseError);
          localStorage.removeItem(this.dbKey);
        }
      }

      // Load agents
      const agentsData = localStorage.getItem(this.agentsKey);
      if (agentsData) {
        try {
          const agentsArray = JSON.parse(agentsData);
          this.agents = new Map(agentsArray);
          console.log(`🤖 Loaded ${this.agents.size} agents from database`);
        } catch (parseError) {
          console.warn("Agents data corrupted, starting fresh:", parseError);
          localStorage.removeItem(this.agentsKey);
        }
      }

      // Load methods
      const methodsData = localStorage.getItem(this.methodsKey);
      if (methodsData) {
        try {
          const methodsArray = JSON.parse(methodsData);
          this.methods = new Map(methodsArray);
          console.log(`📚 Loaded ${this.methods.size} methods from database`);
        } catch (parseError) {
          console.warn("Methods data corrupted, starting fresh:", parseError);
          localStorage.removeItem(this.methodsKey);
        }
      }

      // Clean up any stuck tasks from previous sessions
      this.cleanupStuckTasks();
    } catch (error) {
      console.error("Failed to load AI Task Database:", error);
      // Clear all corrupted data and start fresh
      this.clearCorruptedData();
    }
  }

  private cleanupStuckTasks(): void {
    let cleanedCount = 0;

    this.tasks.forEach((task) => {
      // Reset any stuck "in_progress" tasks to "pending"
      if (task.status === "in_progress" && !task.startedAt) {
        task.status = "pending";
        cleanedCount++;
      }

      // Clean up task logs to prevent future circular references
      if (task.logs && task.logs.length > 0) {
        task.logs = task.logs.map((log) => ({
          ...log,
          details: this.createSafeDetails(log.details),
        }));
      }
    });

    // Reset agent availability
    this.agents.forEach((agent) => {
      if (agent.availability === "busy") {
        agent.availability = "available";
        agent.currentTasks = [];
      }
    });

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} stuck tasks`);
    }
  }

  private clearCorruptedData(): void {
    console.warn("🚨 Clearing all corrupted AI database data");
    localStorage.removeItem(this.dbKey);
    localStorage.removeItem(this.agentsKey);
    localStorage.removeItem(this.methodsKey);
    this.tasks.clear();
    this.agents.clear();
    this.methods.clear();
  }

  private saveDatabase(): void {
    try {
      // Clean up old data before saving
      this.cleanupOldData();

      // Create safe copies without circular references before saving
      const safeTasks = Array.from(this.tasks.entries()).map(([key, task]) => {
        const safeTask = { ...task };
        // Clean logs to prevent circular references
        safeTask.logs = task.logs.slice(-5).map((log) => ({
          ...log,
          details: this.createSafeDetails(log.details),
        }));
        return [key, safeTask];
      });

      const safeAgents = Array.from(this.agents.entries());
      const safeMethods = Array.from(this.methods.entries()).slice(0, 30); // Limit methods

      // Test serialization and check size
      const testTasks = JSON.stringify(safeTasks);
      const testAgents = JSON.stringify(safeAgents);
      const testMethods = JSON.stringify(safeMethods);

      const totalSize =
        testTasks.length + testAgents.length + testMethods.length;

      // If data is too large, perform aggressive cleanup
      if (totalSize > 3 * 1024 * 1024) {
        // 3MB limit
        console.warn("💾 Data too large, performing cleanup");
        this.aggressiveCleanup();
        return; // Retry save after cleanup
      }

      // If we get here, serialization worked and size is acceptable
      localStorage.setItem(this.dbKey, testTasks);
      localStorage.setItem(this.agentsKey, testAgents);
      localStorage.setItem(this.methodsKey, testMethods);

      console.log(`💾 Database saved (${Math.round(totalSize / 1024)}KB)`);
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.warn("💾 Storage quota exceeded, performing emergency cleanup");
        this.emergencyCleanup();
      } else {
        console.error("Failed to save AI Task Database:", error);
      }

      // Try to save a minimal version as fallback
      try {
        const minimalData = {
          tasksCount: this.tasks.size,
          agentsCount: this.agents.size,
          methodsCount: this.methods.size,
          lastSave: new Date().toISOString(),
        };
        localStorage.setItem(
          this.dbKey + "_minimal",
          JSON.stringify(minimalData),
        );
      } catch (fallbackError) {
        console.error("Even minimal save failed:", fallbackError);
        this.clearOldStorageData();
      }
    }
  }

  private cleanupOldData(): void {
    try {
      // Enterprise-level data management - only cleanup if absolutely necessary
      // Keep up to 1000 tasks for AI learning and strategy formation
      if (this.tasks.size > 1000) {
        const taskArray = Array.from(this.tasks.entries());
        const sortedTasks = taskArray.sort(
          ([, a], [, b]) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        this.tasks.clear();
        sortedTasks.slice(0, 1000).forEach(([key, task]) => {
          // Keep all data for AI learning - no cleanup
          this.tasks.set(key, task);
        });
      }

      // Keep up to 500 methods for comprehensive AI knowledge base
      if (this.methods.size > 500) {
        const methodArray = Array.from(this.methods.entries());
        this.methods.clear();
        methodArray.slice(0, 500).forEach(([key, method]) => {
          this.methods.set(key, method);
        });
      }
    } catch (error) {
      console.warn("Cleanup failed:", error);
    }
  }

  private aggressiveCleanup(): void {
    try {
      // Enterprise mode: Keep last 100 tasks with reduced data
      const taskArray = Array.from(this.tasks.entries());
      const sortedTasks = taskArray.sort(
        ([, a], [, b]) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      this.tasks.clear();
      sortedTasks.slice(0, 100).forEach(([key, task]) => {
        // Keep essential data for AI learning
        task.researchFindings = task.researchFindings.slice(0, 10);
        task.strategies = task.strategies.slice(0, 5);
        task.logs = task.logs.slice(-20);
        task.executionPlan = task.executionPlan.slice(0, 10);
        task.codeSnippets = task.codeSnippets.slice(0, 5);
        task.attempts = task.attempts.slice(-5);

        this.tasks.set(key, task);
      });

      // Keep 100 most used methods
      const methodArray = Array.from(this.methods.values()).sort(
        (a, b) => b.usageCount - a.usageCount,
      );
      this.methods.clear();
      methodArray.slice(0, 100).forEach((method) => {
        this.methods.set(method.id, method);
      });

      console.log("🧹 Aggressive cleanup completed - Enterprise mode");

      // Try to save again
      setTimeout(() => this.saveDatabase(), 1000);
    } catch (error) {
      console.warn("Aggressive cleanup failed:", error);
    }
  }

  private emergencyCleanup(): void {
    try {
      // Keep last 50 tasks with core data for enterprise continuity
      const taskArray = Array.from(this.tasks.entries());
      const sortedTasks = taskArray.sort(
        ([, a], [, b]) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      this.tasks.clear();
      sortedTasks.slice(0, 50).forEach(([key, task]) => {
        const enterpriseTask = {
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          category: task.category,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          // Keep essential data for AI learning
          researchFindings: task.researchFindings.slice(0, 3),
          strategies: task.strategies.slice(0, 2),
          logs: task.logs.slice(-10),
          executionPlan: task.executionPlan.slice(0, 5),
          codeSnippets: task.codeSnippets.slice(0, 2),
          attempts: task.attempts.slice(-3),
          metadata: task.metadata,
          // Keep full essential fields
          description: task.description,
          requirements: task.requirements,
          successCriteria: task.successCriteria,
          assignedTo: task.assignedTo,
          type: task.type,
          targetPage: task.targetPage,
          targetElement: task.targetElement,
          createdBy: task.createdBy,
          estimatedTime: task.estimatedTime,
          actualTime: task.actualTime,
          constraints: [],
          dependencies: [],
          rollbackPlan: [],
          tags: [],
        };

        this.tasks.set(key, enterpriseTask as any);
      });

      // Keep only 5 essential methods
      const methodArray = Array.from(this.methods.entries());
      this.methods.clear();
      methodArray.slice(0, 5).forEach(([key, method]) => {
        this.methods.set(key, method);
      });

      console.log("🚨 Emergency cleanup completed");

      // Clear other storage items to free space
      this.clearOldStorageData();

      // Try to save minimal version
      setTimeout(() => this.saveDatabase(), 2000);
    } catch (error) {
      console.error("Emergency cleanup failed:", error);
    }
  }

  private clearOldStorageData(): void {
    try {
      const keysToCheck = [
        "ai_screenshots",
        "ai_click_logs",
        "ai_form_logs",
        "ai_keyboard_logs",
        "psychology_error_patterns",
        "psychology_user_behaviors",
        "psychology_potential_issues",
        "psychology_behavior_patterns",
        "enhanced_error_screenshots",
        "enhanced_solution_previews",
      ];

      keysToCheck.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🧹 Cleared ${key} from storage`);
        }
      });
    } catch (error) {
      console.warn("Failed to clear old storage data:", error);
    }
  }

  private startPeriodicSave(): void {
    // Save every 2 minutes (reduced frequency)
    setInterval(() => {
      this.scheduleSave();
    }, 120000);

    // Also save on page visibility change and beforeunload
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.saveDatabase();
      }
    });

    window.addEventListener("beforeunload", () => {
      this.saveDatabase();
    });

    // Save immediately when tasks/agents are modified
    window.addEventListener("focus", () => {
      this.loadDatabase(); // Reload on focus to get any external changes
    });
  }

  private initializeAgents(): void {
    // Always reinitialize to ensure agents are available
    this.agents.clear();

    const defaultAgents: Omit<AIAgent, "lastActive" | "performance">[] = [
      {
        id: "ai-executor-001",
        name: "TaskExecutor AI",
        type: "executor",
        specialties: ["dom-manipulation", "ui-fixes", "user-interaction"],
        capabilities: [
          "element-creation",
          "event-handling",
          "style-modification",
        ],
        availability: "available",
        currentTasks: [],
        completedTasks: 0,
        successRate: 0.85,
        averageTime: 12,
        configuration: { maxConcurrentTasks: 3 },
      },
      {
        id: "ai-researcher-001",
        name: "Research AI",
        type: "researcher",
        specialties: ["code-analysis", "method-discovery", "best-practices"],
        capabilities: [
          "pattern-recognition",
          "library-search",
          "documentation-analysis",
        ],
        availability: "available",
        currentTasks: [],
        completedTasks: 0,
        successRate: 0.92,
        averageTime: 8,
        configuration: { researchDepth: "comprehensive" },
      },
      {
        id: "ai-strategist-001",
        name: "Strategy AI",
        type: "strategist",
        specialties: ["planning", "optimization", "risk-assessment"],
        capabilities: [
          "strategy-creation",
          "plan-optimization",
          "resource-allocation",
        ],
        availability: "available",
        currentTasks: [],
        completedTasks: 0,
        successRate: 0.88,
        averageTime: 15,
        configuration: { planningHorizon: "comprehensive" },
      },
      {
        id: "ai-monitor-001",
        name: "Monitor AI",
        type: "monitor",
        specialties: [
          "system-health",
          "performance-tracking",
          "anomaly-detection",
        ],
        capabilities: [
          "real-time-monitoring",
          "metric-collection",
          "alert-generation",
        ],
        availability: "available",
        currentTasks: [],
        completedTasks: 0,
        successRate: 0.94,
        averageTime: 5,
        configuration: { monitoringInterval: 1000 },
      },
      {
        id: "ai-validator-001",
        name: "Validator AI",
        type: "validator",
        specialties: ["testing", "verification", "quality-assurance"],
        capabilities: [
          "automated-testing",
          "validation-scripts",
          "quality-metrics",
        ],
        availability: "available",
        currentTasks: [],
        completedTasks: 0,
        successRate: 0.96,
        averageTime: 7,
        configuration: { testingDepth: "thorough" },
      },
    ];

    defaultAgents.forEach((agentData) => {
      const agent: AIAgent = {
        ...agentData,
        lastActive: new Date().toISOString(),
        performance: {
          tasksCompleted: 0,
          tasksSuccessful: 0,
          averageRating: 4.2,
          totalTime: 0,
        },
      };
      this.agents.set(agent.id, agent);
    });

    console.log(`🤖 AITaskDB: Initialized ${this.agents.size} AI agents`);

    // Ensure at least one agent is available
    this.ensureAgentAvailability();
  }

  private ensureAgentAvailability(): void {
    const availableAgents = this.getAvailableAgents();

    if (availableAgents.length === 0) {
      console.log(
        "⚠️ No available agents found, resetting all agents to available",
      );
      this.agents.forEach((agent) => {
        agent.availability = "available";
        agent.currentTasks = [];
      });
    }
  }

  // Public method to reset agent availability if needed
  resetAgentAvailability(): void {
    this.ensureAgentAvailability();
    console.log(
      `✅ Reset agent availability: ${this.getAvailableAgents().length} agents now available`,
    );
  }

  private initializeMethodLibrary(): void {
    if (this.methods.size > 0) return; // Already initialized

    const coreMethods = [
      {
        name: "createElement",
        description:
          "Create and configure DOM elements with attributes and styles",
        category: "dom",
        subcategory: "creation",
        code: `function createElement(tag, attributes = {}, styles = {}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  Object.entries(styles).forEach(([key, value]) => {
    element.style[key] = value;
  });
  return element;
}`,
        language: "javascript",
        parameters: [
          {
            name: "tag",
            type: "string",
            required: true,
            description: "HTML tag name",
          },
          {
            name: "attributes",
            type: "object",
            required: false,
            description: "Element attributes",
          },
          {
            name: "styles",
            type: "object",
            required: false,
            description: "CSS styles",
          },
        ],
        returns: "HTMLElement",
        examples: [
          {
            id: "example1",
            title: "Create button",
            description: "Create a styled button element",
            input: {
              tag: "button",
              attributes: { class: "btn" },
              styles: { color: "white" },
            },
            output: "HTMLButtonElement with class and style",
            context: "UI element creation",
          },
        ],
        useCases: ["Creating UI components", "Dynamic element generation"],
        complexity: "low",
        reliability: 0.95,
        performance: 0.9,
        compatibility: ["modern browsers"],
        dependencies: [],
        version: "1.0.0",
        author: "AI System",
        tags: ["dom", "creation", "utility"],
      },
      {
        name: "addEventHandler",
        description:
          "Add event listeners with proper cleanup and error handling",
        category: "events",
        subcategory: "handling",
        code: `function addEventHandler(element, event, handler, options = {}) {
  const wrappedHandler = (e) => {
    try {
      handler(e);
    } catch (error) {
      console.error('Event handler error:', error);
    }
  };
  element.addEventListener(event, wrappedHandler, options);
  return () => element.removeEventListener(event, wrappedHandler, options);
}`,
        language: "javascript",
        parameters: [
          {
            name: "element",
            type: "HTMLElement",
            required: true,
            description: "Target element",
          },
          {
            name: "event",
            type: "string",
            required: true,
            description: "Event name",
          },
          {
            name: "handler",
            type: "function",
            required: true,
            description: "Event handler function",
          },
          {
            name: "options",
            type: "object",
            required: false,
            description: "Event options",
          },
        ],
        returns: "function (cleanup function)",
        examples: [],
        useCases: ["User interaction handling", "Event management"],
        complexity: "medium",
        reliability: 0.92,
        performance: 0.88,
        compatibility: ["modern browsers"],
        dependencies: [],
        version: "1.0.0",
        author: "AI System",
        tags: ["events", "interaction", "cleanup"],
      },
      {
        name: "updateElementStyles",
        description: "Safely update element styles with fallbacks",
        category: "styling",
        subcategory: "updates",
        code: `function updateElementStyles(element, styles, animate = false) {
  if (!element) return false;
  try {
    if (animate) {
      element.style.transition = 'all 0.3s ease';
    }
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });
    return true;
  } catch (error) {
    console.error('Style update error:', error);
    return false;
  }
}`,
        language: "javascript",
        parameters: [
          {
            name: "element",
            type: "HTMLElement",
            required: true,
            description: "Target element",
          },
          {
            name: "styles",
            type: "object",
            required: true,
            description: "Style properties",
          },
          {
            name: "animate",
            type: "boolean",
            required: false,
            description: "Enable transitions",
          },
        ],
        returns: "boolean (success status)",
        examples: [],
        useCases: ["Visual updates", "State changes", "Animations"],
        complexity: "low",
        reliability: 0.94,
        performance: 0.91,
        compatibility: ["all browsers"],
        dependencies: [],
        version: "1.0.0",
        author: "AI System",
        tags: ["styling", "animation", "visual"],
      },
    ];

    coreMethods.forEach((method) => {
      this.addMethod(method);
    });

    console.log(
      `📚 AITaskDB: Initialized method library with ${this.methods.size} methods`,
    );
  }

  // Statistics
  getStatistics(): any {
    const tasks = Array.from(this.tasks.values());
    const agents = Array.from(this.agents.values());

    return {
      tasks: {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "pending").length,
        inProgress: tasks.filter((t) => t.status === "in_progress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
        failed: tasks.filter((t) => t.status === "failed").length,
      },
      agents: {
        total: agents.length,
        available: agents.filter((a) => a.availability === "available").length,
        busy: agents.filter((a) => a.availability === "busy").length,
        offline: agents.filter((a) => a.availability === "offline").length,
      },
      methods: {
        total: this.methods.size,
      },
      snippets: {
        total: this.codeSnippets.size,
      },
    };
  }
}

export default AITaskDatabase.getInstance();
