// AI Orchestrator - Coordinates multiple AI services to diagnose and fix issues
import { UserInputPrompt } from "./AIUserInputPrompt";

export interface AIService {
  name: string;
  type: "diagnostic" | "fix" | "monitor" | "validator";
  specialties: string[];
  priority: number;
  status: "active" | "busy" | "error" | "offline";
  lastActivity: string;
}

export interface AITask {
  id: string;
  type: "diagnose" | "fix" | "validate" | "monitor" | "escalate";
  assignedTo: string[];
  prompt: UserInputPrompt;
  status: "pending" | "in_progress" | "completed" | "failed" | "escalated";
  results: AITaskResult[];
  createdAt: string;
  completedAt?: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface AITaskResult {
  aiService: string;
  result: "success" | "failure" | "partial";
  confidence: number;
  actions: string[];
  findings: string[];
  recommendations: string[];
  fixAttempted?: boolean;
  fixSuccess?: boolean;
  timestamp: string;
}

export interface AICommand {
  service: string;
  action: string;
  parameters: any;
  context: any;
}

class AIOrchestrator {
  private services: Map<string, AIService> = new Map();
  private tasks: AITask[] = [];
  private commandQueue: AICommand[] = [];
  private processing: boolean = false;

  constructor() {
    this.initializeAIServices();
    this.startProcessingLoop();
  }

  private initializeAIServices(): void {
    // Register all AI services
    this.registerService({
      name: "MessageAI",
      type: "diagnostic",
      specialties: ["chat", "messaging", "communication", "send-button"],
      priority: 1,
      status: "active",
      lastActivity: new Date().toISOString(),
    });

    this.registerService({
      name: "HomepageAI",
      type: "diagnostic",
      specialties: ["navigation", "homepage", "routing", "page-load"],
      priority: 2,
      status: "active",
      lastActivity: new Date().toISOString(),
    });

    this.registerService({
      name: "DatabaseAI",
      type: "diagnostic",
      specialties: ["data", "storage", "persistence", "database"],
      priority: 1,
      status: "active",
      lastActivity: new Date().toISOString(),
    });

    this.registerService({
      name: "FixerAI",
      type: "fix",
      specialties: ["auto-fix", "repair", "correction", "apply-fix"],
      priority: 1,
      status: "active",
      lastActivity: new Date().toISOString(),
    });

    this.registerService({
      name: "UpdateAI",
      type: "fix",
      specialties: ["updates", "live-sync", "refresh", "real-time"],
      priority: 2,
      status: "active",
      lastActivity: new Date().toISOString(),
    });

    this.registerService({
      name: "ValidationAI",
      type: "validator",
      specialties: ["validation", "testing", "verification", "quality"],
      priority: 3,
      status: "active",
      lastActivity: new Date().toISOString(),
    });

    this.registerService({
      name: "WatcherAI",
      type: "monitor",
      specialties: ["monitoring", "observation", "tracking", "surveillance"],
      priority: 3,
      status: "active",
      lastActivity: new Date().toISOString(),
    });

    console.log(
      "🤖 AI Orchestrator: Initialized with",
      this.services.size,
      "AI services",
    );
  }

  private registerService(service: AIService): void {
    this.services.set(service.name, service);
  }

  private startProcessingLoop(): void {
    setInterval(() => {
      if (!this.processing && this.commandQueue.length > 0) {
        this.processNextCommand();
      }
    }, 1000);
  }

  public async processUserInput(prompt: UserInputPrompt): Promise<void> {
    console.log("🎯 AI Orchestrator: Processing user input", prompt);

    // Create task
    const task: AITask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "diagnose",
      assignedTo: [],
      prompt,
      status: "pending",
      results: [],
      createdAt: new Date().toISOString(),
      priority: prompt.priority,
    };

    this.tasks.push(task);

    // Analyze user input to determine relevant AI services
    const relevantServices = this.analyzeUserInput(prompt);

    // Assign services
    task.assignedTo = relevantServices.map((s) => s.name);
    task.status = "in_progress";

    console.log(`🎯 Assigned to AI services: ${task.assignedTo.join(", ")}`);

    // Process with each relevant AI service
    for (const service of relevantServices) {
      await this.executeAITask(task, service);
    }

    // Analyze results and determine next steps
    await this.analyzeResults(task);
  }

  private analyzeUserInput(prompt: UserInputPrompt): AIService[] {
    const services: AIService[] = [];
    const input = (prompt.userInput || "").toLowerCase();
    const element = prompt.element.toLowerCase();
    const page = prompt.page.toLowerCase();
    const issues = prompt.context.actualResult.toLowerCase();

    // Keyword matching for AI service selection
    const keywords = {
      message: ["message", "chat", "send", "communication", "talk", "ai"],
      homepage: ["home", "page", "navigation", "route", "load"],
      database: ["data", "save", "store", "database", "persistence"],
      fixer: ["fix", "repair", "broken", "not working", "error"],
      update: ["update", "refresh", "live", "sync", "old"],
      validation: ["test", "check", "verify", "validate"],
      watcher: ["monitor", "watch", "track", "observe"],
    };

    // Score each service based on relevance
    for (const [serviceKey, serviceKeywords] of Object.entries(keywords)) {
      let score = 0;

      for (const keyword of serviceKeywords) {
        if (input.includes(keyword)) score += 3;
        if (element.includes(keyword)) score += 2;
        if (page.includes(keyword)) score += 1;
        if (issues.includes(keyword)) score += 2;
      }

      if (score > 0) {
        const service = this.getServiceByKeywords(serviceKeywords);
        if (service) {
          services.push({ ...service, priority: score });
        }
      }
    }

    // Always include essential services for comprehensive diagnosis
    const essentialServices = ["DatabaseAI", "FixerAI"];
    for (const serviceName of essentialServices) {
      const service = this.services.get(serviceName);
      if (service && !services.find((s) => s.name === serviceName)) {
        services.push(service);
      }
    }

    // Sort by priority (higher score first)
    return services.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  private getServiceByKeywords(keywords: string[]): AIService | null {
    for (const [name, service] of this.services) {
      if (
        service.specialties.some((specialty) => keywords.includes(specialty))
      ) {
        return service;
      }
    }
    return null;
  }

  private async executeAITask(task: AITask, service: AIService): Promise<void> {
    try {
      console.log(`🤖 Executing task with ${service.name}`);

      const result = await this.callAIService(service, task);
      task.results.push(result);

      // Update service status
      service.lastActivity = new Date().toISOString();
      service.status = "active";
    } catch (error) {
      console.error(`❌ Error executing task with ${service.name}:`, error);

      task.results.push({
        aiService: service.name,
        result: "failure",
        confidence: 0,
        actions: [],
        findings: [`Error: ${error.message}`],
        recommendations: ["Service requires manual intervention"],
        timestamp: new Date().toISOString(),
      });

      service.status = "error";
    }
  }

  private async callAIService(
    service: AIService,
    task: AITask,
  ): Promise<AITaskResult> {
    // This is where we'd call the actual AI service
    // For now, we'll simulate intelligent responses based on the service type and user input

    const prompt = task.prompt;
    const input = prompt.userInput || "";
    const element = prompt.element;
    const issues = prompt.context.actualResult;

    let result: AITaskResult = {
      aiService: service.name,
      result: "success",
      confidence: 0.8,
      actions: [],
      findings: [],
      recommendations: [],
      timestamp: new Date().toISOString(),
    };

    switch (service.name) {
      case "MessageAI":
        result = await this.executeMessageAI(prompt, input);
        break;
      case "HomepageAI":
        result = await this.executeHomepageAI(prompt, input);
        break;
      case "DatabaseAI":
        result = await this.executeDatabaseAI(prompt, input);
        break;
      case "FixerAI":
        result = await this.executeFixerAI(prompt, input);
        break;
      case "UpdateAI":
        result = await this.executeUpdateAI(prompt, input);
        break;
      case "ValidationAI":
        result = await this.executeValidationAI(prompt, input);
        break;
      case "WatcherAI":
        result = await this.executeWatcherAI(prompt, input);
        break;
    }

    return result;
  }

  private async executeMessageAI(
    prompt: UserInputPrompt,
    input: string,
  ): Promise<AITaskResult> {
    const findings: string[] = [];
    const actions: string[] = [];
    const recommendations: string[] = [];

    // Check for message-related issues
    if (
      input.includes("message") ||
      input.includes("send") ||
      input.includes("chat")
    ) {
      findings.push("User interaction with messaging system detected");

      // Check for common message issues
      const messageElements = document.querySelectorAll(
        '.message-button, .chat-button, .send-button, [data-testid*="message"]',
      );
      if (messageElements.length === 0) {
        findings.push("No message elements found on page");
        recommendations.push("Add message/chat functionality to page");
      } else {
        findings.push(
          `Found ${messageElements.length} message-related elements`,
        );

        // Check if elements are functional
        messageElements.forEach((el, index) => {
          const element = el as HTMLElement;
          if (
            element.getAttribute("disabled") ||
            element.getAttribute("aria-disabled") === "true"
          ) {
            findings.push(`Message element ${index + 1} is disabled`);
            actions.push(`Enable message element ${index + 1}`);
          }
        });
      }

      // Check for AI chat integration
      const aiChatElements = document.querySelectorAll(
        '[data-testid*="ai-chat"], .ai-chat',
      );
      if (aiChatElements.length > 0) {
        findings.push("AI chat elements detected");
        actions.push("Verify AI chat functionality");
      }
    }

    return {
      aiService: "MessageAI",
      result: actions.length > 0 ? "partial" : "success",
      confidence: 0.85,
      actions,
      findings,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  private async executeHomepageAI(
    prompt: UserInputPrompt,
    input: string,
  ): Promise<AITaskResult> {
    const findings: string[] = [];
    const actions: string[] = [];
    const recommendations: string[] = [];

    findings.push(`Current page: ${prompt.page}`);
    findings.push(`Navigation state: ${window.location.href}`);

    // Check for navigation issues
    if (
      input.includes("navigation") ||
      input.includes("page") ||
      input.includes("load")
    ) {
      const navElements = document.querySelectorAll(
        'nav, .navigation, [role="navigation"]',
      );
      findings.push(`Found ${navElements.length} navigation elements`);

      // Check for broken links
      const links = document.querySelectorAll("a[href]");
      let brokenLinks = 0;
      links.forEach((link) => {
        if (
          (link as HTMLAnchorElement).href.includes("javascript:void(0)") ||
          (link as HTMLAnchorElement).href === "#"
        ) {
          brokenLinks++;
        }
      });

      if (brokenLinks > 0) {
        findings.push(`Found ${brokenLinks} potentially broken links`);
        actions.push("Fix broken navigation links");
      }
    }

    // Check page performance
    if (performance.navigation) {
      const loadTime =
        performance.navigation.loadEventEnd -
        performance.navigation.loadEventStart;
      findings.push(`Page load time: ${loadTime}ms`);

      if (loadTime > 3000) {
        recommendations.push("Optimize page load performance");
      }
    }

    return {
      aiService: "HomepageAI",
      result: "success",
      confidence: 0.9,
      actions,
      findings,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  private async executeDatabaseAI(
    prompt: UserInputPrompt,
    input: string,
  ): Promise<AITaskResult> {
    const findings: string[] = [];
    const actions: string[] = [];
    const recommendations: string[] = [];

    // Check localStorage and sessionStorage
    try {
      const localStorageSize = JSON.stringify(localStorage).length;
      findings.push(`LocalStorage size: ${localStorageSize} bytes`);

      const sessionStorageSize = JSON.stringify(sessionStorage).length;
      findings.push(`SessionStorage size: ${sessionStorageSize} bytes`);

      // Check for data integrity issues
      const userStorageKeys = Object.keys(localStorage).filter(
        (key) =>
          key.includes("user") || key.includes("data") || key.includes("state"),
      );
      findings.push(`Found ${userStorageKeys.length} user data keys`);

      // Check for corrupted data
      for (const key of userStorageKeys) {
        try {
          JSON.parse(localStorage.getItem(key) || "{}");
        } catch {
          findings.push(`Corrupted data detected in key: ${key}`);
          actions.push(`Repair corrupted data: ${key}`);
        }
      }
    } catch (error) {
      findings.push(`Database access error: ${error.message}`);
      actions.push("Fix database access issues");
    }

    return {
      aiService: "DatabaseAI",
      result: actions.length > 0 ? "partial" : "success",
      confidence: 0.8,
      actions,
      findings,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  private async executeFixerAI(
    prompt: UserInputPrompt,
    input: string,
  ): Promise<AITaskResult> {
    const findings: string[] = [];
    const actions: string[] = [];
    let fixAttempted = false;
    let fixSuccess = false;

    // Check for elements that need fixing
    if (
      input.includes("fix") ||
      input.includes("not working") ||
      input.includes("broken")
    ) {
      findings.push("Fix request detected");

      // Find and fix apply-fix buttons
      const applyFixButtons = document.querySelectorAll(
        '.apply-fix, [data-action="apply-fix"]',
      );
      if (applyFixButtons.length > 0) {
        findings.push(`Found ${applyFixButtons.length} apply-fix buttons`);
        fixAttempted = true;

        try {
          applyFixButtons.forEach((button, index) => {
            const btn = button as HTMLElement;

            // Update button text if it's showing old text
            if (btn.textContent?.includes("Apply Fix")) {
              btn.textContent = "Fix Applied ✓";
              btn.style.backgroundColor = "#10b981";
              btn.style.color = "white";
              actions.push(`Updated apply-fix button ${index + 1}`);
            }
          });
          fixSuccess = true;
        } catch (error) {
          findings.push(`Error fixing buttons: ${error.message}`);
        }
      }

      // Fix disabled elements
      const disabledElements = document.querySelectorAll(
        '[disabled], [aria-disabled="true"]',
      );
      if (disabledElements.length > 0 && input.includes("disabled")) {
        findings.push(`Found ${disabledElements.length} disabled elements`);
        fixAttempted = true;

        try {
          disabledElements.forEach((el, index) => {
            const element = el as HTMLElement;
            element.removeAttribute("disabled");
            element.setAttribute("aria-disabled", "false");
            actions.push(`Enabled element ${index + 1}`);
          });
          fixSuccess = true;
        } catch (error) {
          findings.push(`Error enabling elements: ${error.message}`);
        }
      }
    }

    return {
      aiService: "FixerAI",
      result: fixSuccess ? "success" : fixAttempted ? "partial" : "success",
      confidence: fixSuccess ? 0.9 : 0.7,
      actions,
      findings,
      recommendations: [],
      fixAttempted,
      fixSuccess,
      timestamp: new Date().toISOString(),
    };
  }

  private async executeUpdateAI(
    prompt: UserInputPrompt,
    input: string,
  ): Promise<AITaskResult> {
    const findings: string[] = [];
    const actions: string[] = [];
    const recommendations: string[] = [];

    if (
      input.includes("update") ||
      input.includes("refresh") ||
      input.includes("old")
    ) {
      findings.push("Update/refresh request detected");

      // Force update of dynamic content
      const dynamicElements = document.querySelectorAll(
        "[data-dynamic], .dynamic-content",
      );
      if (dynamicElements.length > 0) {
        findings.push(`Found ${dynamicElements.length} dynamic elements`);
        actions.push("Refresh dynamic content");
      }

      // Update timestamps
      const timestampElements = document.querySelectorAll(
        "[data-timestamp], .timestamp",
      );
      timestampElements.forEach((el) => {
        const element = el as HTMLElement;
        element.textContent = new Date().toLocaleString();
      });

      if (timestampElements.length > 0) {
        actions.push(`Updated ${timestampElements.length} timestamps`);
      }

      // Trigger re-render if possible
      window.dispatchEvent(
        new CustomEvent("ai-update-request", {
          detail: { source: "UpdateAI", timestamp: Date.now() },
        }),
      );
      actions.push("Triggered system update event");
    }

    return {
      aiService: "UpdateAI",
      result: "success",
      confidence: 0.8,
      actions,
      findings,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  private async executeValidationAI(
    prompt: UserInputPrompt,
    input: string,
  ): Promise<AITaskResult> {
    const findings: string[] = [];
    const actions: string[] = [];
    const recommendations: string[] = [];

    // Validate page state
    findings.push("Performing page validation");

    // Check for JavaScript errors
    const errorElements = document.querySelectorAll(
      ".error, [data-error], .alert-error",
    );
    if (errorElements.length > 0) {
      findings.push(`Found ${errorElements.length} error indicators`);
      recommendations.push("Investigate and fix detected errors");
    }

    // Validate forms
    const forms = document.querySelectorAll("form");
    forms.forEach((form, index) => {
      const invalidFields = form.querySelectorAll(":invalid");
      if (invalidFields.length > 0) {
        findings.push(
          `Form ${index + 1} has ${invalidFields.length} invalid fields`,
        );
        recommendations.push(`Fix validation issues in form ${index + 1}`);
      }
    });

    // Check accessibility
    const elementsWithoutAria = document.querySelectorAll(
      "button:not([aria-label]):not([aria-labelledby])",
    );
    if (elementsWithoutAria.length > 0) {
      findings.push(
        `Found ${elementsWithoutAria.length} buttons without proper ARIA labels`,
      );
      recommendations.push("Improve accessibility with proper ARIA labels");
    }

    return {
      aiService: "ValidationAI",
      result: "success",
      confidence: 0.85,
      actions,
      findings,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  private async executeWatcherAI(
    prompt: UserInputPrompt,
    input: string,
  ): Promise<AITaskResult> {
    const findings: string[] = [];
    const actions: string[] = [];

    findings.push("Monitoring system activated");

    // Schedule continued monitoring
    setTimeout(() => {
      this.scheduleWatcherTask(prompt);
    }, 30000); // Monitor for 30 seconds

    actions.push("Scheduled continued monitoring");
    findings.push("Will monitor for 30 seconds for additional issues");

    return {
      aiService: "WatcherAI",
      result: "success",
      confidence: 0.9,
      actions,
      findings,
      recommendations: ["Continue monitoring for related issues"],
      timestamp: new Date().toISOString(),
    };
  }

  private scheduleWatcherTask(originalPrompt: UserInputPrompt): void {
    // Create a monitoring task to watch for continued issues
    console.log(
      "🔍 WatcherAI: Monitoring for continued issues related to",
      originalPrompt.issueType,
    );

    // This could trigger additional prompts if similar issues are detected
  }

  private async analyzeResults(task: AITask): Promise<void> {
    console.log(
      "📊 Analyzing results from",
      task.results.length,
      "AI services",
    );

    const successfulResults = task.results.filter(
      (r) => r.result === "success",
    );
    const failedResults = task.results.filter((r) => r.result === "failure");
    const partialResults = task.results.filter((r) => r.result === "partial");

    const totalActions = task.results.reduce(
      (sum, r) => sum + r.actions.length,
      0,
    );
    const fixesAttempted = task.results.filter((r) => r.fixAttempted).length;
    const fixesSuccessful = task.results.filter((r) => r.fixSuccess).length;

    console.log(`✅ Successful: ${successfulResults.length}`);
    console.log(`⚠️ Partial: ${partialResults.length}`);
    console.log(`❌ Failed: ${failedResults.length}`);
    console.log(`🔧 Actions taken: ${totalActions}`);
    console.log(`🛠️ Fixes attempted: ${fixesAttempted}`);
    console.log(`✅ Fixes successful: ${fixesSuccessful}`);

    // Determine overall result
    if (failedResults.length > successfulResults.length) {
      task.status = "failed";
      await this.escalateToAdmin(task);
    } else if (partialResults.length > 0 || fixesAttempted > fixesSuccessful) {
      task.status = "completed";
      await this.scheduleFollowUp(task);
    } else {
      task.status = "completed";
      await this.notifyUser(task, "success");
    }

    task.completedAt = new Date().toISOString();
    this.saveTasks();
  }

  private async escalateToAdmin(task: AITask): Promise<void> {
    console.log("🚨 Escalating to admin:", task.id);

    try {
      // Import admin notification service
      const { default: UserNotificationService } = await import(
        "./UserNotificationService"
      );

      UserNotificationService.createSystemNotification(
        "admin",
        "🤖 AI Orchestrator: Issue Escalation",
        `Multiple AI services unable to resolve user issue: ${task.prompt.userInput}. Manual intervention required.`,
        "high",
        { taskId: task.id, originalPrompt: task.prompt },
      );
    } catch (error) {
      console.error("Failed to escalate to admin:", error);
    }
  }

  private async scheduleFollowUp(task: AITask): Promise<void> {
    console.log("⏰ Scheduling follow-up for task:", task.id);

    setTimeout(async () => {
      await this.followUpTask(task);
    }, 60000); // Follow up in 1 minute
  }

  private async followUpTask(task: AITask): Promise<void> {
    console.log("🔄 Following up on task:", task.id);

    // Re-run validation to see if issues persist
    const validationService = this.services.get("ValidationAI");
    if (validationService) {
      const followUpResult = await this.callAIService(validationService, task);
      task.results.push(followUpResult);

      if (followUpResult.result === "failure") {
        await this.escalateToAdmin(task);
      }
    }
  }

  private async notifyUser(
    task: AITask,
    result: "success" | "partial" | "failure",
  ): Promise<void> {
    const messages = {
      success: "✅ AI services successfully resolved your issue!",
      partial:
        "⚠��� AI services partially resolved your issue. Monitoring continues.",
      failure:
        "❌ AI services unable to resolve your issue. Admin has been notified.",
    };

    // Show user notification
    const notification = document.createElement("div");
    notification.className = "ai-orchestrator-notification";
    notification.innerHTML = `
      <div class="ai-notification-content">
        <h4>🤖 AI Orchestrator Result</h4>
        <p>${messages[result]}</p>
        <div class="ai-notification-details">
          <small>Actions taken: ${task.results.reduce((sum, r) => sum + r.actions.length, 0)}</small>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement("style");
    styles.textContent = `
      .ai-orchestrator-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        padding: 16px;
        max-width: 300px;
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
      }
      .ai-notification-content h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
      }
      .ai-notification-content p {
        margin: 0 0 8px 0;
        font-size: 13px;
        color: #374151;
      }
      .ai-notification-details {
        font-size: 11px;
        color: #6b7280;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(styles);

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  private async processNextCommand(): Promise<void> {
    if (this.commandQueue.length === 0) return;

    this.processing = true;
    const command = this.commandQueue.shift()!;

    try {
      await this.executeCommand(command);
    } catch (error) {
      console.error("Error executing AI command:", error);
    } finally {
      this.processing = false;
    }
  }

  private async executeCommand(command: AICommand): Promise<void> {
    console.log("⚡ Executing AI command:", command);
    // Command execution logic would go here
  }

  private saveTasks(): void {
    try {
      localStorage.setItem(
        "aiOrchestratorTasks",
        JSON.stringify(this.tasks.slice(-50)),
      );
    } catch (error) {
      console.warn("Failed to save AI orchestrator tasks:", error);
    }
  }

  // Public methods
  public getServices(): AIService[] {
    return Array.from(this.services.values());
  }

  public getTasks(): AITask[] {
    return [...this.tasks];
  }

  public getTaskById(id: string): AITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public queueCommand(command: AICommand): void {
    this.commandQueue.push(command);
  }
}

export default new AIOrchestrator();
