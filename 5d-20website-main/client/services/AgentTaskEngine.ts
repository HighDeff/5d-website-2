import QuantumPassAIService from "@/services/QuantumPassAIService";

export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "queued" | "running" | "completed" | "failed" | "skipped";

export interface AgentTask {
  id: string;
  agentId: string;
  description: string;
  priority: TaskPriority;
  createdAt: number;
  updatedAt: number;
  status: TaskStatus;
  result?: string;
  error?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  deadline?: number;
  completedAt?: number;
  taskIds: string[];
}

interface EngineState {
  queue: AgentTask[];
  running: boolean;
  offlineMode: boolean;
  goals: Goal[];
  lastRunAt: number;
}

class AgentTaskEngine {
  private static instance: AgentTaskEngine;
  private state: EngineState;
  private tickHandle: number | null = null;
  private readonly STORAGE_KEY = "agent_task_engine_state_v1";
  private readonly TICK_MS = 2500;
  private readonly ai = QuantumPassAIService.getInstance();

  private constructor() {
    this.state = this.load() || {
      queue: [],
      running: false,
      offlineMode: false,
      goals: [],
      lastRunAt: 0,
    };
  }

  static getInstance(): AgentTaskEngine {
    if (!AgentTaskEngine.instance) AgentTaskEngine.instance = new AgentTaskEngine();
    return AgentTaskEngine.instance;
    }

  // Persistence
  private save() {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state)); } catch {}
  }
  private load(): EngineState | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as EngineState : null;
    } catch { return null; }
  }

  // Public API
  public setOfflineMode(enabled: boolean) {
    this.state.offlineMode = enabled;
    this.save();
  }
  public getOfflineMode(): boolean { return this.state.offlineMode; }

  public enqueue(task: Omit<AgentTask, "id" | "createdAt" | "updatedAt" | "status">): AgentTask {
    const t: AgentTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "queued",
      ...task,
    };
    this.state.queue.push(t);
    this.save();
    return t;
  }

  public listQueue(): AgentTask[] { return [...this.state.queue]; }

  public async start() {
    if (this.state.running) return;
    this.state.running = true;
    this.tickHandle = window.setInterval(() => this.tick().catch(() => {}), this.TICK_MS);
    this.save();
  }

  public stop() {
    this.state.running = false;
    if (this.tickHandle) { clearInterval(this.tickHandle); this.tickHandle = null; }
    this.save();
  }

  public isRunning(): boolean { return this.state.running; }

  public clearCompleted() {
    this.state.queue = this.state.queue.filter(t => t.status !== "completed" && t.status !== "failed" && t.status !== "skipped");
    this.save();
  }

  // Goals
  public createGoal(title: string, description: string, deadline?: number): Goal {
    const goal: Goal = { id: `goal_${Date.now()}`, title, description, createdAt: Date.now(), deadline, taskIds: [] };
    this.state.goals.push(goal);
    this.save();
    return goal;
  }

  public assignTaskToGoal(goalId: string, taskId: string) {
    const goal = this.state.goals.find(g => g.id === goalId);
    if (!goal) return;
    if (!goal.taskIds.includes(taskId)) goal.taskIds.push(taskId);
    this.save();
  }

  public listGoals(): Goal[] { return [...this.state.goals]; }

  public getGoalProgress(goalId: string): { total: number; completed: number; percent: number } {
    const goal = this.state.goals.find(g => g.id === goalId);
    if (!goal) return { total: 0, completed: 0, percent: 0 };
    const total = goal.taskIds.length;
    const completed = goal.taskIds.map(id => this.state.queue.find(t => t.id === id)).filter(t => t && t.status === "completed").length;
    return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
  }

  // Core runner
  private async tick(): Promise<void> {
    if (!this.state.running) return;
    this.state.lastRunAt = Date.now();

    // If offlineMode, prefer GPT-2 fallback path. If online, still fine.
    const online = navigator.onLine;
    if (!online && !this.state.offlineMode) {
      // No internet and offline mode disabled: skip
      return;
    }

    const next = this.state.queue.find(t => t.status === "queued");
    if (!next) return;

    try {
      next.status = "running";
      next.updatedAt = Date.now();
      this.save();

      const prompt = `You are an autonomous agent. Complete this task step-by-step and return a concise result. Task: ${next.description}`;

      // Use confident message; ai service already auto-falls back to GPT-2
      const { response } = await this.ai.sendConfidentMessage(prompt, undefined, 0.5);

      next.result = response || "";
      next.status = "completed";
      next.updatedAt = Date.now();
      this.save();
    } catch (e: any) {
      next.status = "failed";
      next.error = e?.message || String(e);
      next.updatedAt = Date.now();
      this.save();
    }
  }
}

export default AgentTaskEngine;
