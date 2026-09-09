// Live AI Monitoring Service
// Real-time tracking, error monitoring, automated testing, and admin reporting

import AIService from "./AIService";
import UserDataService from "./UserDataService";

interface MonitoringEvent {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  severity: "low" | "medium" | "high" | "critical";
  category:
    | "user_action"
    | "error"
    | "performance"
    | "state_change"
    | "goal_trigger";
  userId?: string;
  sessionId?: string;
  pageUrl: string;
  userAgent: string;
}

interface Goal {
  id: string;
  name: string;
  description: string;
  trigger: string; // CSS selector or event type
  conditions: any[];
  actions: string[];
  isActive: boolean;
  priority: "low" | "medium" | "high";
}

interface LiveMetrics {
  activeUsers: number;
  errorsCount: number;
  performanceScore: number;
  goalCompletions: number;
  lastUpdate: number;
}

class LiveAIMonitoringService {
  private aiService: AIService;
  private isLiveModeActive: boolean = false;
  private eventBuffer: MonitoringEvent[] = [];
  private goals: Goal[] = [];
  private metrics: LiveMetrics;
  private adminWebSocket: WebSocket | null = null;
  private eventListeners: Map<string, EventListener> = new Map();
  private stateSnapshot: any = {};
  private performanceObserver: PerformanceObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private errorCount: number = 0;
  private lastHeartbeat: number = Date.now();

  constructor() {
    this.aiService = new AIService();
    this.metrics = {
      activeUsers: 0,
      errorsCount: 0,
      performanceScore: 100,
      goalCompletions: 0,
      lastUpdate: Date.now(),
    };

    this.initializeDefaultGoals();
    this.setupGlobalErrorHandling();
    this.startHeartbeat();
  }

  // Start Live Monitoring Mode
  async startLiveMode(): Promise<void> {
    if (this.isLiveModeActive) return;

    console.log("🔴 Starting Live AI Monitoring Mode");
    this.isLiveModeActive = true;

    // Initialize all monitoring systems
    await this.initializeMonitoring();
    await this.connectToAdminSocket();
    this.startEventTracking();
    this.startPerformanceMonitoring();
    this.startDOMChangeTracking();
    this.startGoalTracking();

    // Take initial state snapshot
    this.captureStateSnapshot();

    // Send activation report to admin
    await this.sendAdminReport("live_mode_activated", {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      initialMetrics: this.metrics,
    });

    // Start AI analysis loop
    this.startAIAnalysisLoop();
  }

  // Stop Live Monitoring Mode
  async stopLiveMode(): Promise<void> {
    if (!this.isLiveModeActive) return;

    console.log("⏹️ Stopping Live AI Monitoring Mode");
    this.isLiveModeActive = false;

    // Clean up all listeners and observers
    this.removeAllEventListeners();
    this.stopPerformanceMonitoring();
    this.stopDOMChangeTracking();

    // Send final report
    await this.sendAdminReport("live_mode_deactivated", {
      timestamp: new Date().toISOString(),
      finalMetrics: this.metrics,
      totalEvents: this.eventBuffer.length,
      errorCount: this.errorCount,
    });

    // Close admin connection
    if (this.adminWebSocket) {
      this.adminWebSocket.close();
      this.adminWebSocket = null;
    }
  }

  // Initialize monitoring systems
  private async initializeMonitoring(): Promise<void> {
    try {
      // Setup comprehensive event tracking
      this.setupUserInteractionTracking();
      this.setupNavigationTracking();
      this.setupFormTracking();
      this.setupClickTracking();
      this.setupScrollTracking();
      this.setupKeyboardTracking();

      console.log("✅ Live monitoring systems initialized");
    } catch (error) {
      console.error("❌ Error initializing monitoring:", error);
      await this.logError("monitoring_init_failed", error);
    }
  }

  // User Interaction Tracking
  private setupUserInteractionTracking(): void {
    // Track all user interactions
    const interactionEvents = [
      "click",
      "dblclick",
      "input",
      "change",
      "focus",
      "blur",
    ];

    interactionEvents.forEach((eventType) => {
      const listener = this.createEventListener(eventType, "user_action");
      document.addEventListener(eventType, listener, true);
      this.eventListeners.set(eventType, listener);
    });
  }

  // Navigation Tracking
  private setupNavigationTracking(): void {
    // Track page navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      this.logEvent(
        "navigation",
        { type: "pushState", url: args[2] },
        "medium",
      );
      return originalPushState.apply(history, args);
    };

    history.replaceState = (...args) => {
      this.logEvent(
        "navigation",
        { type: "replaceState", url: args[2] },
        "medium",
      );
      return originalReplaceState.apply(history, args);
    };

    window.addEventListener("popstate", (event) => {
      this.logEvent(
        "navigation",
        { type: "popstate", url: window.location.href },
        "medium",
      );
    });
  }

  // Form Tracking
  private setupFormTracking(): void {
    const listener = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (form.tagName === "FORM") {
        this.logEvent(
          "form_submission",
          {
            action: form.action,
            method: form.method,
            fieldCount: form.elements.length,
          },
          "medium",
        );
      }
    };

    document.addEventListener("submit", listener, true);
    this.eventListeners.set("form_submit", listener);
  }

  // Click Tracking with AI Analysis
  private setupClickTracking(): void {
    const listener = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementInfo = this.getElementInfo(target);

      // Check if click matches any goals
      await this.checkGoalTriggers("click", elementInfo);

      this.logEvent(
        "click",
        {
          element: elementInfo,
          coordinates: { x: event.clientX, y: event.clientY },
          isRightClick: event.button === 2,
        },
        "low",
      );
    };

    document.addEventListener("click", listener, true);
    this.eventListeners.set("click_detailed", listener);
  }

  // Scroll Tracking
  private setupScrollTracking(): void {
    let scrollTimeout: NodeJS.Timeout;

    const listener = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.logEvent(
          "scroll",
          {
            scrollY: window.scrollY,
            scrollX: window.scrollX,
            documentHeight: document.documentElement.scrollHeight,
            viewportHeight: window.innerHeight,
            scrollPercentage: Math.round(
              (window.scrollY /
                (document.documentElement.scrollHeight - window.innerHeight)) *
                100,
            ),
          },
          "low",
        );
      }, 100);
    };

    window.addEventListener("scroll", listener, { passive: true });
    this.eventListeners.set("scroll", listener);
  }

  // Keyboard Tracking
  private setupKeyboardTracking(): void {
    const listener = (event: KeyboardEvent) => {
      // Track important key combinations
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.key === "F12"
      ) {
        this.logEvent(
          "keyboard_shortcut",
          {
            key: event.key,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            altKey: event.altKey,
            shiftKey: event.shiftKey,
          },
          "medium",
        );
      }
    };

    document.addEventListener("keydown", listener, true);
    this.eventListeners.set("keyboard", listener);
  }

  // Performance Monitoring
  private startPerformanceMonitoring(): void {
    if ("PerformanceObserver" in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === "navigation") {
            this.logEvent(
              "performance_navigation",
              {
                loadTime: entry.loadEventEnd - entry.loadEventStart,
                domContentLoaded:
                  entry.domContentLoadedEventEnd -
                  entry.domContentLoadedEventStart,
                timeToFirstByte: entry.responseStart - entry.requestStart,
              },
              "medium",
            );
          } else if (entry.entryType === "paint") {
            this.logEvent(
              "performance_paint",
              {
                name: entry.name,
                startTime: entry.startTime,
              },
              "low",
            );
          }
        });
      });

      this.performanceObserver.observe({
        entryTypes: ["navigation", "paint", "largest-contentful-paint"],
      });
    }

    // Monitor frame rate
    let frameCount = 0;
    let lastFrameTime = performance.now();

    const checkFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastFrameTime >= 1000) {
        const fps = Math.round(
          (frameCount * 1000) / (currentTime - lastFrameTime),
        );

        if (fps < 30) {
          this.logEvent(
            "performance_warning",
            {
              fps: fps,
              type: "low_frame_rate",
            },
            "high",
          );
        }

        frameCount = 0;
        lastFrameTime = currentTime;
      }

      if (this.isLiveModeActive) {
        requestAnimationFrame(checkFrameRate);
      }
    };

    requestAnimationFrame(checkFrameRate);
  }

  // DOM Change Tracking
  private startDOMChangeTracking(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      const significantChanges = mutations.filter(
        (mutation) =>
          mutation.type === "childList" && mutation.addedNodes.length > 0,
      );

      if (significantChanges.length > 0) {
        this.logEvent(
          "dom_change",
          {
            changesCount: significantChanges.length,
            addedNodes: significantChanges.reduce(
              (acc, mut) => acc + mut.addedNodes.length,
              0,
            ),
          },
          "low",
        );
      }
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });
  }

  // Goal Tracking System
  private async checkGoalTriggers(eventType: string, data: any): Promise<void> {
    const activeGoals = this.goals.filter((goal) => goal.isActive);

    for (const goal of activeGoals) {
      if (await this.evaluateGoal(goal, eventType, data)) {
        await this.triggerGoal(goal, data);
      }
    }
  }

  private async evaluateGoal(
    goal: Goal,
    eventType: string,
    data: any,
  ): Promise<boolean> {
    try {
      // Simple goal evaluation logic
      if (goal.trigger === eventType) {
        return goal.conditions.every((condition) => {
          return this.evaluateCondition(condition, data);
        });
      }
      return false;
    } catch (error) {
      await this.logError("goal_evaluation_failed", error);
      return false;
    }
  }

  private evaluateCondition(condition: any, data: any): boolean {
    // Simple condition evaluation
    const { field, operator, value } = condition;
    const fieldValue = this.getNestedValue(data, field);

    switch (operator) {
      case "equals":
        return fieldValue === value;
      case "contains":
        return String(fieldValue).includes(value);
      case "exists":
        return fieldValue !== undefined;
      default:
        return false;
    }
  }

  private async triggerGoal(goal: Goal, data: any): Promise<void> {
    console.log(`🎯 Goal triggered: ${goal.name}`);

    this.metrics.goalCompletions++;

    this.logEvent(
      "goal_triggered",
      {
        goalId: goal.id,
        goalName: goal.name,
        triggerData: data,
      },
      "medium",
    );

    // Execute goal actions
    for (const action of goal.actions) {
      await this.executeGoalAction(action, goal, data);
    }

    // Send to admin
    await this.sendAdminReport("goal_triggered", {
      goal: goal,
      data: data,
      timestamp: new Date().toISOString(),
    });
  }

  private async executeGoalAction(
    action: string,
    goal: Goal,
    data: any,
  ): Promise<void> {
    switch (action) {
      case "capture_screenshot":
        await this.captureScreenshot(goal.id);
        break;
      case "capture_state":
        this.captureStateSnapshot();
        break;
      case "send_alert":
        await this.sendAdminAlert(`Goal "${goal.name}" triggered`, data);
        break;
      case "run_test":
        await this.runAutomatedTest(goal.id);
        break;
      default:
        console.log(`Unknown goal action: ${action}`);
    }
  }

  // Error Handling and Reporting
  private setupGlobalErrorHandling(): void {
    // Capture JavaScript errors
    window.addEventListener("error", (event) => {
      this.errorCount++;
      this.logEvent(
        "javascript_error",
        {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        },
        "critical",
      );
    });

    // Capture unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.errorCount++;
      this.logEvent(
        "unhandled_promise_rejection",
        {
          reason: event.reason,
          promise: event.promise,
        },
        "high",
      );
    });

    // Capture console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.logEvent(
        "console_error",
        {
          arguments: args.map((arg) => String(arg)),
        },
        "high",
      );
      originalConsoleError.apply(console, args);
    };
  }

  // AI Analysis Loop
  private startAIAnalysisLoop(): void {
    const analyzeEvents = async () => {
      if (!this.isLiveModeActive) return;

      try {
        // Process event buffer
        if (this.eventBuffer.length > 0) {
          const eventsToAnalyze = this.eventBuffer.splice(0, 50); // Process in batches
          await this.aiService.processUserEvent("live_monitoring_batch", {
            events: eventsToAnalyze,
            metrics: this.metrics,
            timestamp: new Date().toISOString(),
          });
        }

        // Update metrics
        this.updateMetrics();

        // Schedule next analysis
        setTimeout(analyzeEvents, 5000); // Every 5 seconds
      } catch (error) {
        console.error("AI analysis error:", error);
        setTimeout(analyzeEvents, 10000); // Retry after 10 seconds
      }
    };

    analyzeEvents();
  }

  // Automated Testing
  async runAutomatedTest(testId: string): Promise<any> {
    console.log(`🧪 Running automated test: ${testId}`);

    const testResults = {
      testId,
      startTime: Date.now(),
      tests: [],
      passed: 0,
      failed: 0,
    };

    try {
      // Test navigation
      const navTest = await this.testNavigation();
      testResults.tests.push(navTest);
      if (navTest.passed) testResults.passed++;
      else testResults.failed++;

      // Test user interactions
      const interactionTest = await this.testUserInteractions();
      testResults.tests.push(interactionTest);
      if (interactionTest.passed) testResults.passed++;
      else testResults.failed++;

      // Test performance
      const perfTest = await this.testPerformance();
      testResults.tests.push(perfTest);
      if (perfTest.passed) testResults.passed++;
      else testResults.failed++;

      testResults.endTime = Date.now();
      testResults.duration = testResults.endTime - testResults.startTime;

      await this.sendAdminReport("automated_test_results", testResults);

      return testResults;
    } catch (error) {
      await this.logError("automated_test_failed", error);
      return { error: error.message };
    }
  }

  private async testNavigation(): Promise<any> {
    try {
      // Test if navigation elements exist
      const navElements = document.querySelectorAll('nav, [role="navigation"]');
      const hasNavigation = navElements.length > 0;

      // Test if links are working
      const links = document.querySelectorAll("a[href]");
      const workingLinks = Array.from(links).filter((link) => {
        const href = (link as HTMLAnchorElement).href;
        return href && !href.includes("javascript:void");
      });

      return {
        name: "Navigation Test",
        passed: hasNavigation && workingLinks.length > 0,
        details: {
          navigationElements: navElements.length,
          totalLinks: links.length,
          workingLinks: workingLinks.length,
        },
      };
    } catch (error) {
      return {
        name: "Navigation Test",
        passed: false,
        error: error.message,
      };
    }
  }

  private async testUserInteractions(): Promise<any> {
    try {
      // Test if interactive elements exist
      const buttons = document.querySelectorAll("button");
      const inputs = document.querySelectorAll("input, textarea, select");
      const forms = document.querySelectorAll("form");

      return {
        name: "User Interaction Test",
        passed: buttons.length > 0 || inputs.length > 0,
        details: {
          buttons: buttons.length,
          inputs: inputs.length,
          forms: forms.length,
        },
      };
    } catch (error) {
      return {
        name: "User Interaction Test",
        passed: false,
        error: error.message,
      };
    }
  }

  private async testPerformance(): Promise<any> {
    try {
      const navigationTiming = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const loadTime =
        navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
      const domContentLoaded =
        navigationTiming.domContentLoadedEventEnd -
        navigationTiming.domContentLoadedEventStart;

      const passed = loadTime < 3000 && domContentLoaded < 2000; // Thresholds

      return {
        name: "Performance Test",
        passed,
        details: {
          loadTime,
          domContentLoaded,
          thresholds: {
            maxLoadTime: 3000,
            maxDomContentLoaded: 2000,
          },
        },
      };
    } catch (error) {
      return {
        name: "Performance Test",
        passed: false,
        error: error.message,
      };
    }
  }

  // Utility Methods
  private createEventListener(
    eventType: string,
    category: string,
  ): EventListener {
    return (event: Event) => {
      if (!this.isLiveModeActive) return;

      const target = event.target as HTMLElement;
      const eventData = {
        type: eventType,
        element: this.getElementInfo(target),
        timestamp: Date.now(),
      };

      this.logEvent(eventType, eventData, "low", category as any);
    };
  }

  private getElementInfo(element: HTMLElement): any {
    return {
      tagName: element.tagName?.toLowerCase(),
      id: element.id,
      className: element.className,
      textContent: element.textContent?.slice(0, 100),
      attributes: Array.from(element.attributes || []).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as any),
    };
  }

  private captureStateSnapshot(): void {
    this.stateSnapshot = {
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      documentTitle: document.title,
      elementCount: document.querySelectorAll("*").length,
      formData: this.captureFormData(),
    };
  }

  private captureFormData(): any[] {
    const forms = document.querySelectorAll("form");
    return Array.from(forms).map((form) => {
      const formData = new FormData(form as HTMLFormElement);
      const data: any = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      return data;
    });
  }

  private async captureScreenshot(goalId: string): Promise<void> {
    // This would require a browser extension or server-side service
    console.log(`📸 Screenshot captured for goal: ${goalId}`);
  }

  private updateMetrics(): void {
    this.metrics = {
      ...this.metrics,
      errorsCount: this.errorCount,
      lastUpdate: Date.now(),
      performanceScore: Math.max(0, 100 - this.errorCount * 10),
    };
  }

  private startHeartbeat(): void {
    setInterval(() => {
      this.lastHeartbeat = Date.now();
      if (this.isLiveModeActive) {
        this.sendHeartbeat();
      }
    }, 30000); // Every 30 seconds
  }

  private async sendHeartbeat(): Promise<void> {
    await this.sendAdminReport("heartbeat", {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      isActive: this.isLiveModeActive,
    });
  }

  // Communication Methods
  private async connectToAdminSocket(): Promise<void> {
    try {
      // This would connect to your WebSocket server
      console.log("🔌 Connecting to admin WebSocket...");
      // this.adminWebSocket = new WebSocket('ws://your-admin-server.com/live-monitoring');
    } catch (error) {
      console.error("Failed to connect to admin socket:", error);
    }
  }

  private async sendAdminReport(type: string, data: any): Promise<void> {
    const report = {
      type,
      timestamp: new Date().toISOString(),
      data,
      metrics: this.metrics,
      url: window.location.href,
    };

    console.log(`📊 Admin Report [${type}]:`, report);

    // Store in localStorage for admin dashboard
    const adminReports = JSON.parse(
      localStorage.getItem("adminReports") || "[]",
    );
    adminReports.unshift(report);
    adminReports.splice(100); // Keep only last 100 reports
    localStorage.setItem("adminReports", JSON.stringify(adminReports));

    // Send via WebSocket if available
    if (
      this.adminWebSocket &&
      this.adminWebSocket.readyState === WebSocket.OPEN
    ) {
      this.adminWebSocket.send(JSON.stringify(report));
    }
  }

  private async sendAdminAlert(message: string, data: any): Promise<void> {
    await this.sendAdminReport("alert", { message, data });
  }

  // Event Logging
  private logEvent(
    type: string,
    data: any,
    severity: MonitoringEvent["severity"],
    category: MonitoringEvent["category"] = "user_action",
  ): void {
    const event: MonitoringEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      data,
      severity,
      category,
      userId: UserDataService.getSession()?.userId,
      sessionId: UserDataService.getSession()?.sessionId,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.eventBuffer.push(event);

    // Immediate alert for critical events
    if (severity === "critical") {
      this.sendAdminAlert(`Critical event: ${type}`, data);
    }

    // Keep buffer size manageable
    if (this.eventBuffer.length > 1000) {
      this.eventBuffer.splice(0, 500); // Remove oldest 500 events
    }
  }

  private async logError(type: string, error: any): Promise<void> {
    this.errorCount++;
    this.logEvent(
      type,
      {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      "high",
      "error",
    );
  }

  // Goal Management
  private initializeDefaultGoals(): void {
    this.goals = [
      {
        id: "error_detection",
        name: "Error Detection",
        description: "Detect when errors occur",
        trigger: "javascript_error",
        conditions: [],
        actions: ["capture_state", "send_alert"],
        isActive: true,
        priority: "high",
      },
      {
        id: "form_abandonment",
        name: "Form Abandonment",
        description: "Detect when users abandon forms",
        trigger: "navigation",
        conditions: [{ field: "type", operator: "equals", value: "pushState" }],
        actions: ["capture_state"],
        isActive: true,
        priority: "medium",
      },
      {
        id: "performance_issue",
        name: "Performance Issue",
        description: "Detect performance problems",
        trigger: "performance_warning",
        conditions: [],
        actions: ["capture_state", "send_alert", "run_test"],
        isActive: true,
        priority: "high",
      },
    ];
  }

  // Helper Methods
  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  private removeAllEventListeners(): void {
    this.eventListeners.forEach((listener, eventType) => {
      document.removeEventListener(eventType, listener, true);
    });
    this.eventListeners.clear();
  }

  private stopPerformanceMonitoring(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }

  private stopDOMChangeTracking(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }

  // Public API
  public isActive(): boolean {
    return this.isLiveModeActive;
  }

  public getMetrics(): LiveMetrics {
    return { ...this.metrics };
  }

  public getRecentEvents(count: number = 10): MonitoringEvent[] {
    return this.eventBuffer.slice(-count);
  }

  public addGoal(goal: Omit<Goal, "id">): string {
    const id = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.goals.push({ ...goal, id });
    return id;
  }

  public removeGoal(goalId: string): boolean {
    const index = this.goals.findIndex((goal) => goal.id === goalId);
    if (index >= 0) {
      this.goals.splice(index, 1);
      return true;
    }
    return false;
  }

  public getGoals(): Goal[] {
    return [...this.goals];
  }

  public async runCustomTest(
    testName: string,
    testFunction: () => Promise<any>,
  ): Promise<any> {
    try {
      console.log(`🧪 Running custom test: ${testName}`);
      const result = await testFunction();

      await this.sendAdminReport("custom_test_result", {
        testName,
        result,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      await this.logError("custom_test_failed", error);
      throw error;
    }
  }
}

export default new LiveAIMonitoringService();
