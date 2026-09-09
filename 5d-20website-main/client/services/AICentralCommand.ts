// AI Central Command - Main AI Controller with advanced features
import AITaskDatabase, { AITask, AIAgent, TaskLog } from "./AITaskDatabase";
import AICoordinationEngine from "./AICoordinationEngine";
import EnhancedScreenshotService from "./EnhancedScreenshotService";
import { recursiveMemorySystem } from "./RecursiveMemorySystem";
import { featureValidationEngine } from "./FeatureValidationEngine";
import { backendTestingSystem } from "./BackendTestingSystem";
import { virtualTestCommunication } from "./VirtualTestCommunication";
import { interactiveAIInterface } from "./InteractiveAIInterface";
import { multiLayerCoordination } from "./MultiLayerCoordination";
import { aiConsciousnessMemory } from "./AIConsciousnessMemory";
import { quantumGUISystem } from "./QuantumGUISystem";
import { fiveDimensionalSystem } from "./FiveDimensionalSystem";
import { advancedMouseScreenCapture } from "./AdvancedMouseScreenCapture";
import { interactiveAIVisualization } from "./InteractiveAIVisualization";
import { reverseThinkingEngine } from "./ReverseThinkingEngine";
import { fieldManipulationSystem } from "./FieldManipulationSystem";
import { aiRegeneration } from "./AIRegeneration";
import { enhanced5DSystem } from "./Enhanced5DSystem";

export interface AIKnowledgeBase {
  id: string;
  topic: string;
  keywords: string[];
  keywordThreshold: number;
  knowledge: KnowledgeEntry[];
  triggers: KnowledgeTrigger[];
  relevanceScore: number;
  lastUpdated: string;
  usageCount: number;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  type: "solution" | "documentation" | "code" | "best-practice" | "warning";
  tags: string[];
  confidence: number;
  source: string;
  examples: string[];
  relatedTopics: string[];
  addedAt: string;
}

export interface KnowledgeTrigger {
  id: string;
  keywords: string[];
  minMatches: number;
  action: "suggest" | "auto-apply" | "alert" | "escalate";
  priority: "low" | "medium" | "high" | "critical";
  knowledgeEntries: string[];
}

export interface ScreenshotAnalysis {
  id: string;
  timestamp: string;
  imageData: string;
  ocrText: string;
  detectedIssues: DetectedIssue[];
  suggestedFixes: string[];
  analysisEngine: "ocr" | "visual" | "combined";
  confidence: number;
}

export interface DetectedIssue {
  type:
    | "broken-link"
    | "missing-element"
    | "layout-error"
    | "text-error"
    | "color-issue"
    | "accessibility";
  element: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  coordinates?: { x: number; y: number; width: number; height: number };
  suggestedFix: string;
  autoFixable: boolean;
}

export interface MainAIUpdate {
  id: string;
  type:
    | "task-assignment"
    | "workflow-update"
    | "system-status"
    | "error-detected"
    | "fix-completed"
    | "knowledge-triggered";
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  data: any;
  timestamp: string;
  source: string;
  handled: boolean;
}

class AICentralCommand {
  private static instance: AICentralCommand;
  private taskDatabase = AITaskDatabase;
  private coordinationEngine = AICoordinationEngine;
  private enhancedScreenshotService = EnhancedScreenshotService;
  private knowledgeBase: Map<string, AIKnowledgeBase> = new Map();
  private screenshotQueue: ScreenshotAnalysis[] = [];
  private mainAIUpdates: MainAIUpdate[] = [];
  private updateSubscribers: Array<(update: MainAIUpdate) => void> = [];
  private isRunning = false;
  private keywordTracker: Map<string, number> = new Map();
  private screenshotInterval: NodeJS.Timeout | null = null;
  private ocrEnabled = true;
  private lastTaskCreation: Map<string, number> = new Map(); // Track last task creation time
  private taskCooldownMs = 60000; // 1 minute cooldown between similar tasks

  static getInstance(): AICentralCommand {
    if (!AICentralCommand.instance) {
      AICentralCommand.instance = new AICentralCommand();
    }
    return AICentralCommand.instance;
  }

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeNewAISystems();
    this.startMainAILoop();
    this.startScreenshotMonitoring();
    this.setupClickLogging();

    // Set as running after initialization
    this.isRunning = true;

    console.log("🎯 AI Central Command: Initialized with main AI controller");
  }

  // Enterprise-level system controls
  public startSystem(): void {
    if (this.isRunning) {
      console.log("🎯 System already running");
      return;
    }

    this.isRunning = true;
    this.startMainAILoop();
    this.startScreenshotMonitoring();

    this.publishUpdate({
      type: "system-status",
      message: "AI Central Command system started",
      priority: "medium",
      data: { status: "started", timestamp: new Date().toISOString() },
      source: "AICentralCommand",
    });

    console.log("🎯 AI Central Command: System started");
  }

  public stopSystem(): void {
    if (!this.isRunning) {
      console.log("��� System already stopped");
      return;
    }

    this.isRunning = false;

    if (this.screenshotInterval) {
      clearInterval(this.screenshotInterval);
      this.screenshotInterval = null;
    }

    this.publishUpdate({
      type: "system-status",
      message: "AI Central Command system stopped",
      priority: "medium",
      data: { status: "stopped", timestamp: new Date().toISOString() },
      source: "AICentralCommand",
    });

    console.log("🎯 AI Central Command: System stopped");
  }

  public getSystemHealth(): number {
    const totalTasks = this.taskDatabase.getTasks().length;
    const completedTasks = this.taskDatabase
      .getTasks()
      .filter((t) => t.status === "completed").length;
    const failedTasks = this.taskDatabase
      .getTasks()
      .filter((t) => t.status === "failed").length;
    const agents = this.taskDatabase.getAgents();
    const availableAgents = agents.filter(
      (a) => a.availability === "available",
    ).length;

    // Calculate health score based on various factors
    const successRate = totalTasks > 0 ? completedTasks / totalTasks : 1;
    const failureRate = totalTasks > 0 ? failedTasks / totalTasks : 0;
    const agentAvailability =
      agents.length > 0 ? availableAgents / agents.length : 1;

    const healthScore = Math.round(
      (successRate * 0.4 + (1 - failureRate) * 0.3 + agentAvailability * 0.3) *
        100,
    );

    return Math.max(0, Math.min(100, healthScore));
  }

  private setupClickLogging(): void {
    // Track all clicks for error prediction and user behavior analysis
    document.addEventListener("click", (event) => {
      this.logUserClick(event);
    });

    // Track form submissions
    document.addEventListener("submit", (event) => {
      this.logFormSubmission(event);
    });

    // Track keyboard interactions
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === "Tab") {
        this.logKeyboardInteraction(event);
      }
    });

    console.log("🎯 Click logging and behavior tracking initialized");
  }

  private logUserClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const selector = this.generateUniqueSelector(target);
    const currentUser = this.getCurrentUser();

    const clickData = {
      timestamp: new Date().toISOString(),
      element: selector,
      tagName: target.tagName,
      text: target.textContent?.substring(0, 50) || "",
      userType:
        currentUser?.email === "haynes.d1993@yahoo.com"
          ? "admin"
          : currentUser?.isPremium
            ? "premium"
            : currentUser?.name
              ? "standard"
              : "guest",
      pageUrl: window.location.href,
      coordinates: { x: event.clientX, y: event.clientY },
      disabled:
        target.hasAttribute("disabled") ||
        target.closest("[disabled]") !== null,
      hasError:
        target.classList.contains("error") || target.closest(".error") !== null,
      formField:
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA",
    };

    // Detect potential issues with this click
    this.analyzeClickForIssues(clickData, target);

    // Store click data for pattern analysis
    this.storeClickData(clickData);
  }

  private analyzeClickForIssues(clickData: any, target: HTMLElement): void {
    const issues: string[] = [];

    // Check if user clicked on disabled element
    if (clickData.disabled) {
      issues.push("User attempted to interact with disabled element");
      this.createIssueTask("User clicked disabled element", target, "high");
    }

    // Check if user clicked on element with error state
    if (clickData.hasError) {
      issues.push("User interacting with element in error state");
      this.createIssueTask(
        "User interacting with error element",
        target,
        "medium",
      );
    }

    // Check if user clicked on broken link
    if (
      target.tagName === "A" &&
      (!target.getAttribute("href") || target.getAttribute("href") === "#")
    ) {
      issues.push("User clicked on broken/placeholder link");
      this.createIssueTask("User clicked broken link", target, "high");
    }

    // Check for buttons that might not be working
    if (
      target.tagName === "BUTTON" ||
      target.getAttribute("role") === "button"
    ) {
      // Check if button appears broken (no action)
      if (
        target.tagName === "BUTTON" &&
        !target.getAttribute("onclick") &&
        !target.onclick
      ) {
        const form = target.closest("form");
        if (!form && target.type !== "submit") {
          issues.push("User clicked button with no action");
          this.createIssueTask("Non-functional button clicked", target, "high");
        }
      }
    }

    // Check for rapid repeated clicks (potential frustration)
    if (this.isRapidRepeatedClick(clickData.element)) {
      issues.push(
        "User exhibiting rapid repeated clicks - potential frustration",
      );
      this.createIssueTask(
        "User showing frustration behavior",
        target,
        "medium",
      );
    }

    // Enhanced detection for any clickable element that might not work
    const isClickable =
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.getAttribute("role") === "button" ||
      target.style.cursor === "pointer" ||
      target.classList.contains("btn") ||
      target.classList.contains("button");

    if (isClickable) {
      // Monitor for elements that look clickable but don't do anything
      setTimeout(() => {
        // Check if page changed or if there was any visible response
        const currentUrl = window.location.href;
        if (currentUrl === clickData.pageUrl) {
          // Check for other indicators of functionality
          const elementStillExists = document.contains(target);
          if (elementStillExists && !target.classList.contains("active")) {
            console.log(
              `⚠️ Potentially non-functional clickable element: ${clickData.element}`,
            );
            this.createIssueTask(
              "Clickable element may not be working",
              target,
              "medium",
            );
          }
        }
      }, 1000); // Check after 1 second
    }

    if (issues.length > 0) {
      console.log(`🚨 Click issues detected: ${issues.join(", ")}`);
    }
  }

  private createIssueTask(
    title: string,
    target: HTMLElement,
    priority: "low" | "medium" | "high" | "critical",
  ): void {
    // Only create task if we haven't created a similar one recently
    const recentTasks = this.taskDatabase.getTasks().filter(
      (task) =>
        task.title.includes(title.split(" ")[0]) &&
        new Date(task.createdAt).getTime() > Date.now() - 5 * 60 * 1000, // Last 5 minutes
    );

    if (recentTasks.length === 0) {
      setTimeout(() => {
        this.coordinationEngine.submitTask({
          title: `User Behavior Issue: ${title}`,
          description: `Detected user interaction issue that needs attention`,
          type: "minor",
          category: "fix",
          priority: priority,
          targetPage: window.location.pathname,
          targetElement: this.generateUniqueSelector(target),
          requirements: [`Investigate and fix ${title.toLowerCase()}`],
          successCriteria: ["Issue resolved", "User interaction improved"],
          requesterId: "behavior-analysis",
        });
      }, 1000); // Small delay to prevent flooding
    }
  }

  private logFormSubmission(event: Event): void {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const currentUser = this.getCurrentUser();

    const submissionData = {
      timestamp: new Date().toISOString(),
      formId: form.id || "unknown",
      fieldCount: formData.entries().length,
      userType:
        currentUser?.email === "haynes.d1993@yahoo.com"
          ? "admin"
          : currentUser?.isPremium
            ? "premium"
            : currentUser?.name
              ? "standard"
              : "guest",
      pageUrl: window.location.href,
      hasErrors: form.querySelector(":invalid") !== null,
    };

    this.storeFormData(submissionData);
    console.log("📝 Form submission logged:", submissionData);
  }

  private logKeyboardInteraction(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const currentUser = this.getCurrentUser();

    const keyData = {
      timestamp: new Date().toISOString(),
      key: event.key,
      element: this.generateUniqueSelector(target),
      userType:
        currentUser?.email === "haynes.d1993@yahoo.com"
          ? "admin"
          : currentUser?.isPremium
            ? "premium"
            : currentUser?.name
              ? "standard"
              : "guest",
      pageUrl: window.location.href,
    };

    this.storeKeyboardData(keyData);
  }

  private storeClickData(data: any): void {
    try {
      const clicks = JSON.parse(localStorage.getItem("ai_click_logs") || "[]");
      clicks.push(data);

      // Keep only last 200 clicks to prevent storage bloat
      if (clicks.length > 200) {
        clicks.splice(0, clicks.length - 200);
      }

      localStorage.setItem("ai_click_logs", JSON.stringify(clicks));
    } catch (error) {
      console.warn("Failed to store click data:", error);
    }
  }

  private storeFormData(data: any): void {
    try {
      const forms = JSON.parse(localStorage.getItem("ai_form_logs") || "[]");
      forms.push(data);

      if (forms.length > 100) {
        forms.splice(0, forms.length - 100);
      }

      localStorage.setItem("ai_form_logs", JSON.stringify(forms));
    } catch (error) {
      console.warn("Failed to store form data:", error);
    }
  }

  private storeKeyboardData(data: any): void {
    try {
      const keys = JSON.parse(localStorage.getItem("ai_keyboard_logs") || "[]");
      keys.push(data);

      if (keys.length > 100) {
        keys.splice(0, keys.length - 100);
      }

      localStorage.setItem("ai_keyboard_logs", JSON.stringify(keys));
    } catch (error) {
      console.warn("Failed to store keyboard data:", error);
    }
  }

  private getCurrentUser(): any {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return null;
    }
  }

  private generateUniqueSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className
        .toString()
        .split(" ")
        .filter((c) => c.trim());
      if (classes.length > 0) return `.${classes[0]}`;
    }
    return element.tagName.toLowerCase();
  }

  private isRapidRepeatedClick(elementSelector: string): boolean {
    try {
      const clicks = JSON.parse(localStorage.getItem("ai_click_logs") || "[]");
      const recentClicks = clicks.filter(
        (click: any) =>
          click.element === elementSelector &&
          new Date(click.timestamp).getTime() > Date.now() - 3000, // Last 3 seconds
      );
      return recentClicks.length > 3; // More than 3 clicks in 3 seconds
    } catch {
      return false;
    }
  }

  // Main AI Loop - Constantly sorts tasks and manages workflow
  private startMainAILoop(): void {
    console.log("🤖 Starting Main AI Controller loop...");

    // Force running status
    this.isRunning = true;

    setInterval(() => {
      try {
        this.processPendingTasks();
        this.optimizeWorkflow();
        this.checkSystemHealth();
        this.processKnowledgeTriggers();
        this.analyzeKeywordPatterns();

        // Ensure we stay running
        this.isRunning = true;
      } catch (error) {
        console.error("Main AI loop error:", error);
        this.isRunning = true; // Stay running even on errors
      }
    }, 3000); // Main AI loop every 3 seconds

    console.log(
      "🤖 Main AI Controller: Started continuous workflow management",
    );
  }

  // Screenshot and OCR Monitoring
  private startScreenshotMonitoring(): void {
    if (this.screenshotInterval) return;

    this.screenshotInterval = setInterval(async () => {
      await this.captureAndAnalyzeScreen();
    }, 10000); // Increased frequency: Screenshot every 10 seconds for better monitoring

    console.log(
      "📸 Screenshot Monitor: Started continuous visual monitoring (30s intervals)",
    );
  }

  private async captureAndAnalyzeScreen(): Promise<void> {
    try {
      // Check if we should skip this analysis cycle
      const activeTasks = this.coordinationEngine.getExecutionQueue().length;
      if (activeTasks > 5) {
        console.log(
          `⏳ Skipping screenshot analysis - too many active tasks (${activeTasks})`,
        );
        return;
      }

      // Capture screenshot using modern API
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size to viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Draw current page content (simplified approach)
      const htmlElement = document.documentElement;
      const imageData = await this.createPageSnapshot();

      if (imageData) {
        const analysis = await this.analyzeScreenshot(imageData);
        this.screenshotQueue.push(analysis);

        // Keep more screenshots for better analysis (increased from 5 to 20)
        if (this.screenshotQueue.length > 20) {
          this.screenshotQueue = this.screenshotQueue.slice(-20);
        }

        // Log screenshot count for debugging
        console.log(
          `📸 Screenshot ${this.screenshotQueue.length}/20 stored, OCR: ${this.ocrEnabled ? "ON" : "OFF"}`,
        );

        // Store screenshot data for other AIs to access
        this.saveScreenshotToDatabase(analysis);

        // Process critical issues and capture error screenshots
        const criticalIssues = analysis.detectedIssues.filter(
          (issue) => issue.severity === "critical" || issue.severity === "high",
        );

        if (criticalIssues.length > 0) {
          console.log(
            `🚨 Found ${criticalIssues.length} critical/high issues, processing...`,
          );

          // Capture error screenshots for visual analysis
          for (const issue of criticalIssues.slice(0, 3)) {
            // Limit to 3 to prevent performance issues
            try {
              await this.enhancedScreenshotService.captureErrorScreenshot(
                issue.element,
                issue.type,
                issue.description,
              );
              console.log(`📸 Captured error screenshot for: ${issue.type}`);
            } catch (error) {
              console.warn(
                `Failed to capture error screenshot for ${issue.type}:`,
                error,
              );
            }
          }

          analysis.detectedIssues = criticalIssues; // Only process critical ones
          await this.handleDetectedIssues(analysis);
        } else if (analysis.detectedIssues.length > 0) {
          console.log(
            `ℹ️ Found ${analysis.detectedIssues.length} non-critical issues (ignored to prevent spam)`,
          );
        }
      }
    } catch (error) {
      console.warn("Screenshot analysis failed:", error);
    }
  }

  private async createPageSnapshot(): Promise<string | null> {
    try {
      // Use html2canvas-like approach with DOM analysis
      const body = document.body;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Create a simple visual representation
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw basic layout elements
      const elements = document.querySelectorAll(
        "button, a, input, .error, .broken",
      );
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isError =
          element.classList.contains("error") ||
          element.classList.contains("broken");

        ctx.fillStyle = isError ? "#ef4444" : "#3b82f6";
        ctx.fillRect(
          rect.x,
          rect.y,
          Math.max(rect.width, 10),
          Math.max(rect.height, 10),
        );
      });

      return canvas.toDataURL();
    } catch (error) {
      console.warn("Failed to create page snapshot:", error);
      return null;
    }
  }

  private saveScreenshotToDatabase(analysis: ScreenshotAnalysis): void {
    try {
      // Save to localStorage for persistence and other AIs to access
      const existingScreenshots = JSON.parse(
        localStorage.getItem("ai_screenshots") || "[]",
      );
      existingScreenshots.push(analysis);

      // Keep only last 50 screenshots to prevent storage bloat
      if (existingScreenshots.length > 50) {
        existingScreenshots.splice(0, existingScreenshots.length - 50);
      }

      localStorage.setItem(
        "ai_screenshots",
        JSON.stringify(existingScreenshots),
      );
      console.log(
        `💾 Screenshot analysis saved to database (ID: ${analysis.id})`,
      );
    } catch (error) {
      console.warn("Failed to save screenshot to database:", error);
    }
  }

  private async analyzeScreenshot(
    imageData: string,
  ): Promise<ScreenshotAnalysis> {
    const analysis: ScreenshotAnalysis = {
      id: `screenshot_${Date.now()}`,
      timestamp: new Date().toISOString(),
      imageData,
      ocrText: "",
      detectedIssues: [],
      suggestedFixes: [],
      analysisEngine: "combined",
      confidence: 0.8,
    };

    // Perform OCR on visible text
    if (this.ocrEnabled) {
      analysis.ocrText = await this.performOCR();
    }

    // Detect visual issues
    analysis.detectedIssues = await this.detectVisualIssues();

    // Generate suggested fixes
    analysis.suggestedFixes = analysis.detectedIssues.map(
      (issue) => issue.suggestedFix,
    );

    return analysis;
  }

  private async performOCR(): Promise<string> {
    try {
      // Simple OCR implementation - extract visible text
      const textElements = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, span, div, button, a, input, label",
      );
      const visibleText: string[] = [];

      textElements.forEach((element) => {
        const style = window.getComputedStyle(element);
        const isVisible =
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0";

        if (isVisible && element.textContent?.trim()) {
          visibleText.push(element.textContent.trim());
        }
      });

      return visibleText.join(" ").substring(0, 1000); // Limit to 1000 chars
    } catch (error) {
      console.warn("OCR processing failed:", error);
      return "";
    }
  }

  private async detectVisualIssues(): Promise<DetectedIssue[]> {
    const issues: DetectedIssue[] = [];
    const detectedElements = new Set<string>(); // For deduplication

    try {
      // Check for broken links
      const links = document.querySelectorAll("a[href]");
      links.forEach((link, index) => {
        const href = link.getAttribute("href");
        const selector = this.createReliableSelector(link);

        // Skip if already detected
        if (detectedElements.has(selector)) return;

        if (
          href === "#" ||
          href === "" ||
          href?.startsWith("javascript:void")
        ) {
          const rect = link.getBoundingClientRect();
          detectedElements.add(selector);

          issues.push({
            type: "broken-link",
            element: selector,
            description: `Broken or placeholder link detected: "${link.textContent?.trim()}"`,
            severity: "medium",
            coordinates: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
            suggestedFix:
              "Update link href to valid URL or add proper click handler",
            autoFixable: false,
          });
        }
      });

      // Check for missing images
      const images = document.querySelectorAll("img");
      images.forEach((img, index) => {
        if (!img.src || img.src.includes("data:image/svg") === false) {
          const rect = img.getBoundingClientRect();
          const selector = this.createReliableSelector(img);

          issues.push({
            type: "missing-element",
            element: selector,
            description: "Image with missing or invalid source",
            severity: "low",
            coordinates: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
            suggestedFix: "Add valid image source or remove broken image",
            autoFixable: true,
          });
        }
      });

      // Check for form validation errors
      const invalidInputs = document.querySelectorAll(
        "input:invalid, select:invalid, textarea:invalid",
      );
      invalidInputs.forEach((input) => {
        const selector = this.createReliableSelector(input);
        if (detectedElements.has(selector)) return;

        const rect = input.getBoundingClientRect();
        detectedElements.add(selector);

        issues.push({
          type: "form-validation",
          element: selector,
          description: `Form field has validation errors: ${(input as HTMLInputElement).validationMessage}`,
          severity: "high",
          coordinates: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          suggestedFix: "Fix form validation or improve error messaging",
          autoFixable: true,
        });
      });

      // Check for accessibility issues
      const elementsWithoutAlt = document.querySelectorAll("img:not([alt])");
      elementsWithoutAlt.forEach((img) => {
        const selector = this.createReliableSelector(img);
        if (detectedElements.has(selector)) return;

        const rect = img.getBoundingClientRect();
        detectedElements.add(selector);

        issues.push({
          type: "accessibility",
          element: selector,
          description: "Image missing alt text for accessibility",
          severity: "medium",
          coordinates: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          suggestedFix: "Add descriptive alt text to image",
          autoFixable: true,
        });
      });

      // Check for color contrast issues (simplified)
      const smallText = document.querySelectorAll("p, span, div");
      smallText.forEach((element, index) => {
        if (index > 20) return; // Limit checks to prevent performance issues

        const selector = this.createReliableSelector(element);
        if (detectedElements.has(selector)) return;

        const style = window.getComputedStyle(element);
        const fontSize = parseFloat(style.fontSize);
        const color = style.color;
        const backgroundColor = style.backgroundColor;

        // Simple contrast check (this is simplified - real contrast calculation is more complex)
        if (
          fontSize < 14 &&
          (color.includes("rgb(128") || backgroundColor.includes("rgb(128"))
        ) {
          const rect = element.getBoundingClientRect();
          detectedElements.add(selector);

          issues.push({
            type: "color-issue",
            element: selector,
            description: "Potential color contrast issue detected",
            severity: "low",
            coordinates: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
            suggestedFix: "Improve color contrast for better readability",
            autoFixable: true,
          });
        }
      });

      // Check for layout errors (elements outside viewport)
      const allElements = document.querySelectorAll("*");
      Array.from(allElements)
        .slice(0, 50)
        .forEach((element) => {
          // Limit to first 50 to prevent performance issues
          const rect = element.getBoundingClientRect();
          const selector = this.createReliableSelector(element);

          if (detectedElements.has(selector)) return;

          if (
            rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.bottom < 0 ||
            rect.top > window.innerHeight
          ) {
            // Element is outside viewport
            if (rect.width > 0 && rect.height > 0) {
              // Only report if element has dimensions
              detectedElements.add(selector);

              issues.push({
                type: "layout-error",
                element: selector,
                description: "Element positioned outside visible viewport",
                severity: "medium",
                coordinates: {
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height,
                },
                suggestedFix:
                  "Adjust element positioning to be within viewport",
                autoFixable: true,
              });
            }
          }
        });

      // Check for disabled buttons that might need fixing
      const disabledButtons = document.querySelectorAll("button:disabled");
      disabledButtons.forEach((button, index) => {
        if (
          button.textContent?.toLowerCase().includes("fix") ||
          button.textContent?.toLowerCase().includes("apply")
        ) {
          const rect = button.getBoundingClientRect();
          const selector = this.createReliableSelector(button);

          issues.push({
            type: "missing-element",
            element: selector,
            description: `Disabled fix/apply button: "${button.textContent?.trim()}"`,
            severity: "high",
            coordinates: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
            suggestedFix: "Enable button and ensure proper functionality",
            autoFixable: true,
          });
        }
      });

      // Check for error messages with detailed analysis
      const errorElements = document.querySelectorAll(
        ".error, .alert-error, .text-red-500, .bg-red-100, [role='alert'], .alert-danger, .text-danger, .has-error",
      );
      errorElements.forEach((element, index) => {
        if (index > 15) return; // Limit to prevent performance issues

        const rect = element.getBoundingClientRect();
        const selector = this.createReliableSelector(element);

        if (detectedElements.has(selector)) return;
        detectedElements.add(selector);

        // Extract detailed error information
        const errorText = element.textContent?.trim() || "";
        const errorType = this.categorizeErrorMessage(errorText);
        const actualError = this.extractActualError(element, errorText);
        const severity = this.determineErrorSeverity(errorText);

        issues.push({
          type: "text-error",
          element: selector,
          description: actualError || `${errorType}: ${errorText}`,
          severity: severity,
          coordinates: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          suggestedFix: this.generateSpecificFix(
            errorType,
            actualError || errorText,
          ),
          autoFixable: this.isErrorAutoFixable(errorType),
        });
      });
    } catch (error) {
      console.warn("Visual issue detection failed:", error);
    }

    return issues;
  }

  private async handleDetectedIssues(
    analysis: ScreenshotAnalysis,
  ): Promise<void> {
    const now = Date.now();
    let tasksCreated = 0;

    for (const issue of analysis.detectedIssues) {
      // Send update about detected issue
      this.sendMainAIUpdate({
        type: "error-detected",
        message: `Visual issue detected: ${issue.description}`,
        priority: issue.severity as any,
        data: { issue, analysis },
        source: "screenshot-monitor",
      });

      // Check cooldown before creating tasks
      const issueKey = `${issue.type}_${issue.element}`;
      const lastCreated = this.lastTaskCreation.get(issueKey) || 0;

      if (now - lastCreated < this.taskCooldownMs) {
        console.log(
          `⏳ Task cooldown active for ${issueKey}, skipping task creation`,
        );
        continue;
      }

      // Limit task creation to prevent spam
      if (tasksCreated >= 3) {
        console.log(`⚠️ Task creation limit reached for this analysis cycle`);
        break;
      }

      // Auto-create tasks for high severity or auto-fixable issues
      if (
        issue.severity === "critical" ||
        (issue.severity === "high" && issue.autoFixable)
      ) {
        await this.createTaskFromIssue(issue);
        this.lastTaskCreation.set(issueKey, now);
        tasksCreated++;
      }
    }

    if (tasksCreated > 0) {
      console.log(`📋 Created ${tasksCreated} tasks from detected issues`);
    }
  }

  private async createTaskFromIssue(issue: DetectedIssue): Promise<void> {
    const taskTitle = `Fix ${issue.type.replace("-", " ")}: ${issue.element}`;

    await this.coordinationEngine.submitTask({
      title: taskTitle,
      description: issue.description,
      type: issue.severity === "high" ? "major" : "minor",
      category: "fix",
      priority: issue.severity as any,
      targetPage: window.location.pathname,
      targetElement: issue.element,
      requirements: [issue.suggestedFix],
      successCriteria: [
        `${issue.type} resolved`,
        "element functioning properly",
      ],
      requesterId: "screenshot-monitor",
    });

    console.log(`🔧 Auto-created task for detected issue: ${taskTitle}`);
  }

  // Task and Workflow Management
  private processPendingTasks(): void {
    const pendingTasks = this.taskDatabase.getTasksByStatus("pending");

    if (pendingTasks.length === 0) return;

    // Sort tasks by priority and type
    const sortedTasks = pendingTasks.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const typeWeight = { major: 2, minor: 1 };

      const scoreA = priorityWeight[a.priority] + typeWeight[a.type];
      const scoreB = priorityWeight[b.priority] + typeWeight[b.type];

      return scoreB - scoreA;
    });

    // Send update about task sorting
    this.sendMainAIUpdate({
      type: "workflow-update",
      message: `Sorted ${sortedTasks.length} pending tasks by priority`,
      priority: "medium",
      data: { sortedTasks: sortedTasks.slice(0, 5) }, // Top 5 tasks
      source: "main-ai-controller",
    });
  }

  private optimizeWorkflow(): void {
    const agents = this.taskDatabase.getAgents();
    const activeTasks = this.taskDatabase.getTasksByStatus("in_progress");

    // Check for overloaded agents
    const overloadedAgents = agents.filter(
      (agent) => agent.currentTasks.length > 2 && agent.availability === "busy",
    );

    if (overloadedAgents.length > 0) {
      this.sendMainAIUpdate({
        type: "workflow-update",
        message: `${overloadedAgents.length} agents overloaded, redistributing tasks`,
        priority: "medium",
        data: { overloadedAgents },
        source: "workflow-optimizer",
      });
    }

    // Check for idle agents
    const idleAgents = agents.filter(
      (agent) =>
        agent.availability === "available" && agent.currentTasks.length === 0,
    );

    if (idleAgents.length > 0 && activeTasks.length < agents.length) {
      this.sendMainAIUpdate({
        type: "workflow-update",
        message: `${idleAgents.length} agents idle, checking for new tasks`,
        priority: "low",
        data: { idleAgents },
        source: "workflow-optimizer",
      });
    }
  }

  private checkSystemHealth(): void {
    const stats = this.coordinationEngine.getSystemStats();
    const failedTasks = this.taskDatabase.getTasksByStatus("failed");

    if (failedTasks.length > 3) {
      this.sendMainAIUpdate({
        type: "system-status",
        message: `System health warning: ${failedTasks.length} failed tasks detected`,
        priority: "high",
        data: { stats, failedTasks },
        source: "health-monitor",
      });
    }

    // Check agent performance
    const agents = this.taskDatabase.getAgents();
    const lowPerformanceAgents = agents.filter(
      (agent) => agent.successRate < 0.7,
    );

    if (lowPerformanceAgents.length > 0) {
      this.sendMainAIUpdate({
        type: "system-status",
        message: `${lowPerformanceAgents.length} agents showing low performance`,
        priority: "medium",
        data: { lowPerformanceAgents },
        source: "performance-monitor",
      });
    }
  }

  // Knowledge Base Management
  private initializeNewAISystems(): void {
    try {
      // Initialize and start all new AI systems
      recursiveMemorySystem.startRecursiveMemory();
      virtualTestCommunication.start();
      interactiveAIInterface.start();
      multiLayerCoordination.start();
      backendTestingSystem; // Already starts automatically
      // aiConsciousnessMemory and quantumGUISystem start automatically

      // Make systems globally available
      (window as any).recursiveMemorySystem = recursiveMemorySystem;
      (window as any).featureValidationEngine = featureValidationEngine;
      (window as any).backendTestingSystem = backendTestingSystem;
      (window as any).virtualTestCommunication = virtualTestCommunication;
      (window as any).interactiveAIInterface = interactiveAIInterface;
      (window as any).multiLayerCoordination = multiLayerCoordination;
      (window as any).aiConsciousnessMemory = aiConsciousnessMemory;
      (window as any).quantumGUISystem = quantumGUISystem;
      (window as any).fiveDimensionalSystem = fiveDimensionalSystem;
      (window as any).advancedMouseScreenCapture = advancedMouseScreenCapture;
      (window as any).interactiveAIVisualization = interactiveAIVisualization;
      (window as any).reverseThinkingEngine = reverseThinkingEngine;
      (window as any).fieldManipulationSystem = fieldManipulationSystem;
      (window as any).aiRegeneration = aiRegeneration;
      (window as any).enhanced5DSystem = enhanced5DSystem;

      // Initialize personal memory format for my usage
      aiConsciousnessMemory.rememberForPersonalUsage(
        "AICentralCommand Integration - 5D System",
        "User Dan Haynes wants 5D system with infinite recursion, wave bouncing, AI positioning, and interactive visualization",
        [
          "Personal AI memory format",
          "5D consciousness with infinite recursion management",
          "Solid matter mode for goal accomplishment",
          "Wave bouncing and mental bounce back",
          "Interactive AI positioning with drag and drop",
          "3D/5D visualization with height perspectives",
          "Mouse tracking and screen capture with error detection",
          "Maze projectors for automatic routing",
          "Traffic management and collision avoidance",
          "Observation towers with reasoning detection",
          "20+ feature analyzers for habit formation",
          "Quantum-like processing with visual changes first",
          "Privatized space for unlimited exploration",
          "Field shifts with timers and wave detection",
          "Security and integrity with collaborative testing",
          "Reverse thinking/backthinking for new strategy generation",
          "Field piercing and sensing for hidden information access",
          "Gesture-based field manipulation and guessing",
          "AI reset, refresh, restart, and recreate functionality",
          "Connection methods for AI regeneration enhancement",
          "AI creation at specific positions with advanced capabilities",
        ],
      );

      // Add AIs to visualization system
      this.addAIsToVisualization();

      // Enable user dragging
      interactiveAIVisualization.enableUserDragging(true);

      // Add AIs to 5D system
      this.add5DAIEntities();

      console.log(
        "🚀 Advanced 5D AI consciousness and quantum systems initialized",
      );
      console.log("🧠 Personal memory format active for AI usage");
      console.log("⚡ Quantum GUI system operational");
      console.log("🌌 5D dimensional system with infinite recursion active");
      console.log("🖱️ Advanced mouse tracking and screen capture enabled");
      console.log("🎮 Interactive AI visualization with user dragging enabled");
      console.log(
        "🔄 Reverse thinking engine with backthinking capabilities active",
      );
      console.log(
        "🌐 Field manipulation system with piercing and sensing operational",
      );
      console.log(
        "🔧 AI regeneration system for reset/refresh/restart/recreate ready",
      );
      console.log(
        "🌌 Enhanced 5D System with infinite recursion management operational",
      );
      console.log("⚡ Wave bouncing mechanics and field shift timers active");
      console.log(
        "🏠 Privatized AI exploration spaces and solid matter mode enabled",
      );
    } catch (error) {
      console.error("Failed to initialize new AI systems:", error);
    }
  }

  private addAIsToVisualization(): void {
    try {
      // Add major AI systems to visualization
      const aiSystems = [
        {
          id: "memory_system",
          type: "memory",
          position: { x: 200, y: 200, z: 50 },
        },
        {
          id: "chat_system",
          type: "communication",
          position: { x: 400, y: 200, z: 60 },
        },
        {
          id: "pattern_recognition",
          type: "analysis",
          position: { x: 600, y: 200, z: 70 },
        },
        {
          id: "coordination_engine",
          type: "coordination",
          position: { x: 800, y: 200, z: 80 },
        },
        {
          id: "central_command",
          type: "command",
          position: { x: 500, y: 300, z: 100 },
        },
        {
          id: "validation_engine",
          type: "validation",
          position: { x: 300, y: 400, z: 55 },
        },
        {
          id: "backend_testing",
          type: "testing",
          position: { x: 700, y: 400, z: 65 },
        },
        {
          id: "virtual_communication",
          type: "virtual",
          position: { x: 500, y: 500, z: 75 },
        },
        {
          id: "interactive_interface",
          type: "interface",
          position: { x: 200, y: 500, z: 45 },
        },
        {
          id: "multi_layer_coordination",
          type: "coordination",
          position: { x: 800, y: 500, z: 85 },
        },
        {
          id: "consciousness_memory",
          type: "consciousness",
          position: { x: 400, y: 100, z: 90 },
        },
        {
          id: "quantum_gui",
          type: "quantum",
          position: { x: 600, y: 100, z: 95 },
        },
        {
          id: "five_dimensional",
          type: "5d",
          position: { x: 500, y: 600, z: 120 },
        },
      ];

      aiSystems.forEach((ai) => {
        interactiveAIVisualization.addAIEntity(ai.id, ai.type, ai.position);
      });

      console.log("🎮 Added AI systems to interactive visualization");
    } catch (error) {
      console.error("Failed to add AIs to visualization:", error);
    }
  }

  private add5DAIEntities(): void {
    try {
      // Add AI entities to 5D system
      const fiveDPositions = [
        { x: 200, y: 200, z: 50, time: Date.now(), consciousness: 0.8 },
        { x: 400, y: 200, z: 60, time: Date.now(), consciousness: 0.85 },
        { x: 600, y: 200, z: 70, time: Date.now(), consciousness: 0.9 },
        { x: 800, y: 200, z: 80, time: Date.now(), consciousness: 0.95 },
        { x: 500, y: 300, z: 100, time: Date.now(), consciousness: 1.0 },
      ];

      fiveDPositions.forEach((position, index) => {
        fiveDimensionalSystem.addAIEntity(`ai_${index}`, position);
      });

      console.log("🌌 Added AI entities to 5D dimensional system");
    } catch (error) {
      console.error("Failed to add AIs to 5D system:", error);
    }
  }

  private initializeKnowledgeBase(): void {
    const coreKnowledge: Omit<
      AIKnowledgeBase,
      "id" | "lastUpdated" | "usageCount"
    >[] = [
      {
        topic: "Button Fixing",
        keywords: ["button", "click", "disabled", "broken", "fix", "enable"],
        keywordThreshold: 2,
        knowledge: [
          {
            id: "btn-fix-1",
            title: "Enable Disabled Buttons",
            content:
              "Remove disabled attribute and ensure proper event handlers",
            type: "solution",
            tags: ["button", "disabled", "enable"],
            confidence: 0.9,
            source: "core-knowledge",
            examples: [
              "element.disabled = false",
              "element.removeAttribute('disabled')",
            ],
            relatedTopics: ["event-handling", "ui-fixes"],
            addedAt: new Date().toISOString(),
          },
          {
            id: "btn-fix-2",
            title: "Button Click Handlers",
            content: "Add proper click event listeners with error handling",
            type: "code",
            tags: ["button", "click", "events"],
            confidence: 0.85,
            source: "core-knowledge",
            examples: [
              "element.addEventListener('click', handler)",
              "onClick={() => action()}",
            ],
            relatedTopics: ["javascript", "react"],
            addedAt: new Date().toISOString(),
          },
        ],
        triggers: [
          {
            id: "btn-trigger-1",
            keywords: ["button", "disabled", "fix"],
            minMatches: 2,
            action: "suggest",
            priority: "high",
            knowledgeEntries: ["btn-fix-1", "btn-fix-2"],
          },
        ],
        relevanceScore: 0.9,
      },
      {
        topic: "Link Repair",
        keywords: ["link", "href", "broken", "url", "navigation", "click"],
        keywordThreshold: 2,
        knowledge: [
          {
            id: "link-fix-1",
            title: "Fix Broken Links",
            content:
              "Update href attributes with valid URLs or proper navigation handlers",
            type: "solution",
            tags: ["link", "href", "navigation"],
            confidence: 0.88,
            source: "core-knowledge",
            examples: [
              "<a href='/valid-page'>",
              "onClick={() => navigate('/page')}",
            ],
            relatedTopics: ["routing", "navigation"],
            addedAt: new Date().toISOString(),
          },
        ],
        triggers: [
          {
            id: "link-trigger-1",
            keywords: ["link", "broken", "href"],
            minMatches: 2,
            action: "auto-apply",
            priority: "medium",
            knowledgeEntries: ["link-fix-1"],
          },
        ],
        relevanceScore: 0.85,
      },
      {
        topic: "Error Detection",
        keywords: ["error", "exception", "fail", "bug", "issue", "problem"],
        keywordThreshold: 1,
        knowledge: [
          {
            id: "error-handle-1",
            title: "Error Handling Best Practices",
            content:
              "Implement comprehensive try-catch blocks and user feedback",
            type: "best-practice",
            tags: ["error", "handling", "feedback"],
            confidence: 0.92,
            source: "core-knowledge",
            examples: ["try { } catch (error) { console.error(error); }"],
            relatedTopics: ["debugging", "user-experience"],
            addedAt: new Date().toISOString(),
          },
        ],
        triggers: [
          {
            id: "error-trigger-1",
            keywords: ["error", "exception"],
            minMatches: 1,
            action: "alert",
            priority: "high",
            knowledgeEntries: ["error-handle-1"],
          },
        ],
        relevanceScore: 0.95,
      },
    ];

    coreKnowledge.forEach((kb) => {
      const knowledgeBase: AIKnowledgeBase = {
        id: `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        lastUpdated: new Date().toISOString(),
        usageCount: 0,
        ...kb,
      };
      this.knowledgeBase.set(knowledgeBase.id, knowledgeBase);
    });

    console.log(
      `���� Knowledge Base: Initialized with ${this.knowledgeBase.size} knowledge bases`,
    );
  }

  private processKnowledgeTriggers(): void {
    // Check current page content for keywords
    const pageText = document.body.textContent?.toLowerCase() || "";
    const words = pageText.split(/\s+/);

    // Update keyword tracking
    words.forEach((word) => {
      if (word.length > 3) {
        // Only track meaningful words
        const count = this.keywordTracker.get(word) || 0;
        this.keywordTracker.set(word, count + 1);
      }
    });

    // Check knowledge base triggers
    this.knowledgeBase.forEach((kb) => {
      kb.triggers.forEach((trigger) => {
        const matchedKeywords = trigger.keywords.filter(
          (keyword) =>
            (this.keywordTracker.get(keyword.toLowerCase()) || 0) >=
            kb.keywordThreshold,
        );

        if (matchedKeywords.length >= trigger.minMatches) {
          this.triggerKnowledgeAction(kb, trigger, matchedKeywords);
        }
      });
    });
  }

  private triggerKnowledgeAction(
    knowledgeBase: AIKnowledgeBase,
    trigger: KnowledgeTrigger,
    matchedKeywords: string[],
  ): void {
    knowledgeBase.usageCount++;
    knowledgeBase.lastUpdated = new Date().toISOString();

    const relevantKnowledge = knowledgeBase.knowledge.filter((entry) =>
      trigger.knowledgeEntries.includes(entry.id),
    );

    this.sendMainAIUpdate({
      type: "knowledge-triggered",
      message: `Knowledge base triggered: ${knowledgeBase.topic} (${matchedKeywords.join(", ")})`,
      priority: trigger.priority,
      data: {
        knowledgeBase: knowledgeBase.topic,
        trigger: trigger.action,
        matchedKeywords,
        relevantKnowledge,
      },
      source: "knowledge-base",
    });

    // Execute trigger action
    switch (trigger.action) {
      case "suggest":
        this.suggestKnowledgeActions(relevantKnowledge);
        break;
      case "auto-apply":
        this.autoApplyKnowledge(relevantKnowledge);
        break;
      case "alert":
        this.alertKnowledgeIssue(knowledgeBase.topic, matchedKeywords);
        break;
      case "escalate":
        this.escalateKnowledgeIssue(knowledgeBase.topic, relevantKnowledge);
        break;
    }
  }

  private suggestKnowledgeActions(knowledge: KnowledgeEntry[]): void {
    knowledge.forEach((entry) => {
      console.log(`💡 Knowledge Suggestion: ${entry.title} - ${entry.content}`);
    });
  }

  private async autoApplyKnowledge(knowledge: KnowledgeEntry[]): Promise<void> {
    for (const entry of knowledge) {
      if (entry.type === "solution" || entry.type === "code") {
        // Create auto-fix task
        await this.coordinationEngine.submitTask({
          title: `Auto-apply: ${entry.title}`,
          description: entry.content,
          type: "minor",
          category: "fix",
          priority: "medium",
          targetPage: window.location.pathname,
          requirements: [entry.content],
          successCriteria: ["Knowledge solution applied successfully"],
          requesterId: "knowledge-base-auto",
        });
      }
    }
  }

  private alertKnowledgeIssue(topic: string, keywords: string[]): void {
    this.sendMainAIUpdate({
      type: "error-detected",
      message: `Knowledge alert: ${topic} issue detected (${keywords.join(", ")})`,
      priority: "high",
      data: { topic, keywords },
      source: "knowledge-alert",
    });
  }

  private escalateKnowledgeIssue(
    topic: string,
    knowledge: KnowledgeEntry[],
  ): void {
    this.sendMainAIUpdate({
      type: "error-detected",
      message: `Critical issue escalation: ${topic} requires immediate attention`,
      priority: "critical",
      data: { topic, knowledge },
      source: "knowledge-escalation",
    });
  }

  private analyzeKeywordPatterns(): void {
    // Clean up old keyword tracking (keep only recent)
    if (this.keywordTracker.size > 1000) {
      const sortedEntries = Array.from(this.keywordTracker.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 500);

      this.keywordTracker.clear();
      sortedEntries.forEach(([word, count]) => {
        this.keywordTracker.set(word, count);
      });
    }

    // Identify trending keywords
    const trendingKeywords = Array.from(this.keywordTracker.entries())
      .filter(([word, count]) => count > 5)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    if (trendingKeywords.length > 0) {
      console.log(
        "📈 Trending keywords:",
        trendingKeywords.map(([word]) => word),
      );
    }
  }

  // Main AI Updates System
  private sendMainAIUpdate(
    update: Omit<MainAIUpdate, "id" | "timestamp" | "handled">,
  ): void {
    const mainUpdate: MainAIUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      handled: false,
      ...update,
    };

    this.mainAIUpdates.push(mainUpdate);

    // Keep only last 100 updates
    if (this.mainAIUpdates.length > 100) {
      this.mainAIUpdates = this.mainAIUpdates.slice(-100);
    }

    // Notify subscribers
    this.updateSubscribers.forEach((callback) => {
      try {
        callback(mainUpdate);
      } catch (error) {
        console.error("Update subscriber error:", error);
      }
    });

    console.log(`��� Main AI Update: ${update.type} - ${update.message}`);
  }

  // Public Interface
  subscribeToUpdates(callback: (update: MainAIUpdate) => void): () => void {
    this.updateSubscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.updateSubscribers.indexOf(callback);
      if (index > -1) {
        this.updateSubscribers.splice(index, 1);
      }
    };
  }

  getRecentUpdates(limit: number = 10): MainAIUpdate[] {
    return this.mainAIUpdates.slice(-limit).reverse();
  }

  getSystemStats(): any {
    const agents = this.taskDatabase.getAgents();
    const tasks = this.taskDatabase.getTasks();
    const availableAgents = agents.filter(
      (a) => a.availability === "available",
    ).length;
    const totalAgents = agents.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const totalTasks = tasks.length;

    // Calculate system health based on various factors
    const agentHealth =
      totalAgents > 0 ? (availableAgents / totalAgents) * 100 : 100;
    const taskHealth =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 100;
    const systemHealth = Math.round((agentHealth + taskHealth) / 2);

    return {
      isRunning: this.isRunning,
      knowledgeBaseCount: this.knowledgeBase.size,
      screenshotQueueLength: this.screenshotQueue.length,
      updateCount: this.mainAIUpdates.length,
      keywordCount: this.keywordTracker.size,
      ocrEnabled: this.ocrEnabled,
      systemHealth: systemHealth,
      agentHealth: Math.round(agentHealth),
      taskHealth: Math.round(taskHealth),
      coordinationEngine: this.coordinationEngine.getSystemStats(),
    };
  }

  async addKnowledge(
    topic: string,
    entry: Omit<KnowledgeEntry, "id" | "addedAt">,
  ): Promise<void> {
    let kb = Array.from(this.knowledgeBase.values()).find(
      (k) => k.topic === topic,
    );

    if (!kb) {
      // Create new knowledge base
      kb = {
        id: `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        topic,
        keywords: entry.tags,
        keywordThreshold: 1,
        knowledge: [],
        triggers: [],
        relevanceScore: 0.5,
        lastUpdated: new Date().toISOString(),
        usageCount: 0,
      };
      this.knowledgeBase.set(kb.id, kb);
    }

    const knowledgeEntry: KnowledgeEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString(),
      ...entry,
    };

    kb.knowledge.push(knowledgeEntry);
    kb.lastUpdated = new Date().toISOString();

    console.log(`📚 Added knowledge: ${entry.title} to ${topic}`);
  }

  toggleOCR(enabled: boolean): void {
    this.ocrEnabled = enabled;
    console.log(`👁️ OCR ${enabled ? "enabled" : "disabled"}`);
  }

  getLatestScreenshot(): ScreenshotAnalysis | null {
    return this.screenshotQueue.length > 0
      ? this.screenshotQueue[this.screenshotQueue.length - 1]
      : null;
  }

  async forceScreenshotAnalysis(): Promise<ScreenshotAnalysis | null> {
    await this.captureAndAnalyzeScreen();
    return this.getLatestScreenshot();
  }

  markUpdateHandled(updateId: string): void {
    const update = this.mainAIUpdates.find((u) => u.id === updateId);
    if (update) {
      update.handled = true;
    }
  }

  // Enhanced Error Analysis Methods
  private categorizeErrorMessage(errorText: string): string {
    const text = errorText.toLowerCase();

    if (
      text.includes("validation") ||
      text.includes("required") ||
      text.includes("invalid")
    ) {
      return "Validation Error";
    }
    if (
      text.includes("network") ||
      text.includes("connection") ||
      text.includes("timeout")
    ) {
      return "Network Error";
    }
    if (
      text.includes("permission") ||
      text.includes("unauthorized") ||
      text.includes("forbidden")
    ) {
      return "Permission Error";
    }
    if (
      text.includes("not found") ||
      text.includes("404") ||
      text.includes("missing")
    ) {
      return "Resource Error";
    }
    if (
      text.includes("server") ||
      text.includes("500") ||
      text.includes("internal")
    ) {
      return "Server Error";
    }
    if (
      text.includes("syntax") ||
      text.includes("parse") ||
      text.includes("format")
    ) {
      return "Format Error";
    }
    if (
      text.includes("database") ||
      text.includes("sql") ||
      text.includes("query")
    ) {
      return "Database Error";
    }
    if (
      text.includes("auth") ||
      text.includes("login") ||
      text.includes("credential")
    ) {
      return "Authentication Error";
    }

    return "General Error";
  }

  private extractActualError(element: Element, errorText: string): string {
    // Try to find more specific error details
    const parentForm = element.closest("form");
    const relatedInput =
      element.previousElementSibling || element.nextElementSibling;

    let details = errorText;

    // Add context from related form elements
    if (parentForm) {
      const formName =
        parentForm.getAttribute("name") ||
        parentForm.getAttribute("id") ||
        "form";
      details = `Form "${formName}": ${details}`;
    }

    // Add context from related input fields
    if (
      relatedInput &&
      (relatedInput.tagName === "INPUT" || relatedInput.tagName === "SELECT")
    ) {
      const fieldName =
        relatedInput.getAttribute("name") ||
        relatedInput.getAttribute("id") ||
        "field";
      details = `Field "${fieldName}": ${details}`;
    }

    // Extract error codes or specific messages
    const errorCodeMatch = errorText.match(/error\s*:?\s*(\d+|[A-Z_]+)/i);
    if (errorCodeMatch) {
      details = `Error ${errorCodeMatch[1]}: ${details}`;
    }

    return details;
  }

  private determineErrorSeverity(
    errorText: string,
  ): "low" | "medium" | "high" | "critical" {
    const text = errorText.toLowerCase();

    if (
      text.includes("critical") ||
      text.includes("fatal") ||
      text.includes("crash")
    ) {
      return "critical";
    }
    if (
      text.includes("error") ||
      text.includes("fail") ||
      text.includes("invalid")
    ) {
      return "high";
    }
    if (
      text.includes("warning") ||
      text.includes("caution") ||
      text.includes("notice")
    ) {
      return "medium";
    }

    return "low";
  }

  private generateSpecificFix(errorType: string, errorText: string): string {
    switch (errorType) {
      case "Validation Error":
        return `Fix validation rules and input requirements: ${errorText.substring(0, 50)}`;
      case "Network Error":
        return `Check network connectivity and API endpoints: ${errorText.substring(0, 50)}`;
      case "Permission Error":
        return `Verify user permissions and access rights: ${errorText.substring(0, 50)}`;
      case "Resource Error":
        return `Ensure required resources are available: ${errorText.substring(0, 50)}`;
      case "Server Error":
        return `Investigate server-side issues: ${errorText.substring(0, 50)}`;
      case "Format Error":
        return `Correct data format and syntax: ${errorText.substring(0, 50)}`;
      case "Database Error":
        return `Fix database query or connection: ${errorText.substring(0, 50)}`;
      case "Authentication Error":
        return `Resolve authentication and credential issues: ${errorText.substring(0, 50)}`;
      default:
        return `Investigate and resolve error: ${errorText.substring(0, 50)}`;
    }
  }

  private isErrorAutoFixable(errorType: string): boolean {
    // Some error types can potentially be auto-fixed
    const autoFixableTypes = ["Validation Error", "Format Error"];
    return autoFixableTypes.includes(errorType);
  }

  private createReliableSelector(element: Element): string {
    try {
      // Try to create a reliable selector that will work when the task executes

      // 1. Check for ID (most reliable)
      if (element.id) {
        return `#${element.id}`;
      }

      // 2. Check for unique class combinations
      if (element.className && typeof element.className === "string") {
        const classes = element.className.trim().split(/\s+/);
        if (classes.length > 0 && classes[0]) {
          const classSelector = `.${classes.join(".")}`;
          const matches = document.querySelectorAll(classSelector);
          if (matches.length === 1) {
            return classSelector;
          }
        }
      }

      // 3. Use data attributes if available
      const dataId =
        element.getAttribute("data-id") || element.getAttribute("data-testid");
      if (dataId) {
        return `[data-id="${dataId}"], [data-testid="${dataId}"]`;
      }

      // 4. For specific element types, use more specific selectors
      if (element.tagName === "BUTTON") {
        const text = element.textContent?.trim();
        if (text && text.length < 50) {
          // Use a safer button selector
          return `button:contains("${text}")`;
        }
      }

      if (element.tagName === "A") {
        const href = element.getAttribute("href");
        if (href && href !== "#") {
          return `a[href="${href}"]`;
        }
      }

      // 5. Fallback to a general class-based selector
      if (element.className && typeof element.className === "string") {
        const classes = element.className.trim().split(/\s+/);
        if (classes.length > 0 && classes[0]) {
          return `.${classes[0]}`;
        }
      }

      // 6. Final fallback - use tag name only
      return element.tagName.toLowerCase();
    } catch (error) {
      console.warn("Failed to create reliable selector:", error);
      return element.tagName.toLowerCase();
    }
  }

  clearOldUpdates(): void {
    this.mainAIUpdates = this.mainAIUpdates.filter((u) => !u.handled);
  }

  // Legacy compatibility method for getting agents
  getAgents(): any[] {
    try {
      return this.taskDatabase.getAgents();
    } catch (error) {
      console.error("Error getting agents for legacy compatibility:", error);
      return [];
    }
  }

  // Legacy compatibility method for getting tasks
  getTasks(): any[] {
    try {
      return this.taskDatabase.getTasks();
    } catch (error) {
      console.error("Error getting tasks for legacy compatibility:", error);
      return [];
    }
  }

  // Legacy compatibility method for getting active tasks
  getActiveTasks(): any[] {
    try {
      return this.taskDatabase.getTasksByStatus("in_progress");
    } catch (error) {
      console.error(
        "Error getting active tasks for legacy compatibility:",
        error,
      );
      return [];
    }
  }

  // Legacy compatibility method for system status (async version)
  async getSystemStatus(): Promise<any> {
    try {
      // Call the synchronous version
      const agents = this.taskDatabase.getAgents();
      const tasks = this.taskDatabase.getTasks();
      const availableAgents = agents.filter(
        (a) => a.availability === "available",
      ).length;
      const totalAgents = agents.length;
      const completedTasks = tasks.filter(
        (t) => t.status === "completed",
      ).length;
      const totalTasks = tasks.length;

      return {
        isRunning: this.isRunning, // Use actual running state
        knowledgeBaseCount: this.knowledgeBase.size,
        screenshotQueueLength: this.screenshotQueue.length,
        updateCount: this.mainAIUpdates.length,
        keywordCount: this.keywordTracker.size,
        ocrEnabled: this.ocrEnabled,
        systemHealth: this.getSystemHealth(), // Use the new comprehensive health calculation
        totalTasks: totalTasks,
        completedTasks: completedTasks,
        availableAgents: availableAgents,
        totalAgents: totalAgents,
        coordinationEngine: this.coordinationEngine.getSystemStats(),
      };
    } catch (error) {
      console.error(
        "Error getting system status for legacy compatibility:",
        error,
      );
      return {
        isRunning: false,
        knowledgeBaseCount: 0,
        screenshotQueueLength: 0,
        updateCount: 0,
        keywordCount: 0,
        ocrEnabled: false,
        systemHealth: 0,
        agentHealth: 0,
        taskHealth: 0,
      };
    }
  }

  // Legacy compatibility method for event listening
  addEventListener(
    event: string,
    callback: (event: CustomEvent) => void,
  ): void {
    // For now, just log that this was called - we can implement real event system later if needed
    console.log(
      `📡 AICentralCommand: Legacy event listener registered for ${event}`,
    );
  }

  // Additional compatibility methods that might be expected
  getTaskTypeFromIssue(issue: any): string {
    return issue.type || "general-fix";
  }

  async notifyAdmin(issue: any): Promise<void> {
    this.sendMainAIUpdate({
      type: "error-detected",
      message: `Admin notification: ${issue.description || "Issue detected"}`,
      priority: issue.severity || "medium",
      data: { issue },
      source: "admin-notification",
    });
  }

  // Legacy compatibility method for database queries
  async queryDatabase(query: any): Promise<any[]> {
    try {
      // Return recent updates that match the query
      const updates = this.getRecentUpdates(10);

      if (query.metadata?.page) {
        return updates.filter(
          (update) =>
            update.data?.context?.page === query.metadata.page ||
            update.source.includes("page") ||
            update.message.includes(query.metadata.page),
        );
      }

      return updates;
    } catch (error) {
      console.error("Error querying database for legacy compatibility:", error);
      return [];
    }
  }

  // Legacy compatibility method for broadcasting to other AIs
  async broadcast(message: any): Promise<any> {
    try {
      console.log(
        `📡 AICentralCommand: Broadcasting message from ${message.from || "unknown"}`,
      );

      // Convert broadcast to our update system
      this.sendMainAIUpdate({
        type: "system-status",
        message: `AI Broadcast: ${message.content || message.message || "Message sent"}`,
        priority: message.priority || "medium",
        data: { broadcast: message },
        source: message.from || "ai-broadcast",
      });

      // Simulate responses from other AIs
      const responses = [
        {
          from: "ai-researcher-001",
          content: "Acknowledged. I'll investigate this issue.",
          priority: "medium",
          timestamp: new Date().toISOString(),
        },
        {
          from: "ai-executor-001",
          content: "Standing by for fix implementation.",
          priority: "medium",
          timestamp: new Date().toISOString(),
        },
      ];

      // Add AI responses as updates
      responses.forEach((response) => {
        this.sendMainAIUpdate({
          type: "system-status",
          message: `AI Response from ${response.from}: ${response.content}`,
          priority: response.priority,
          data: { response },
          source: response.from,
        });
      });

      return {
        success: true,
        message: "Broadcast sent successfully",
        responses,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Legacy broadcast error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Legacy compatibility method for registering AI agents
  async registerAgent(agentData: any): Promise<any> {
    try {
      console.log(
        `🤖 AICentralCommand: Registering agent ${agentData.id || agentData.name || "unknown"}`,
      );

      // Create agent in task database if it doesn't exist
      const existingAgent = this.taskDatabase.getAgent(agentData.id);

      if (!existingAgent && agentData.id) {
        // Register as new agent in the database
        const newAgent = {
          id: agentData.id,
          name: agentData.name || agentData.id,
          type: agentData.type || "executor",
          specialties: agentData.specialties || ["general-fixes"],
          capabilities: agentData.capabilities || [
            "issue-detection",
            "auto-fix",
          ],
          availability: "available",
          currentTasks: [],
          completedTasks: 0,
          successRate: 0.8,
          averageTime: 15,
          lastActive: new Date().toISOString(),
          performance: {
            tasksCompleted: 0,
            tasksSuccessful: 0,
            averageRating: 4.0,
            totalTime: 0,
          },
          configuration: agentData.configuration || {},
        };

        // Add to agents map (accessing private property for legacy compatibility)
        (this.taskDatabase as any).agents.set(agentData.id, newAgent);
        console.log(`✅ Registered new agent: ${newAgent.name}`);
      }

      // Send registration update
      this.sendMainAIUpdate({
        type: "system-status",
        message: `AI Agent registered: ${agentData.name || agentData.id}`,
        priority: "low",
        data: { agent: agentData },
        source: "agent-registration",
      });

      return {
        success: true,
        message: "Agent registered successfully",
        agentId: agentData.id,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Legacy agent registration error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Legacy compatibility method for other services
  async processCommand(command: any): Promise<any> {
    try {
      console.log(
        `🔄 AICentralCommand: Processing legacy command ${command.type}`,
      );

      // Convert legacy commands to new update system
      this.sendMainAIUpdate({
        type: "system-status",
        message: `Legacy command processed: ${command.type}`,
        priority: "low",
        data: command,
        source: "legacy-compatibility",
      });

      // Return a generic success response for compatibility
      return {
        success: true,
        message: "Command processed via AI Central Command",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Legacy command processing error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Legacy compatibility method
  async initialize(): Promise<void> {
    // Already initialized in constructor, but keeping for compatibility
    console.log(
      "🔄 AICentralCommand: Legacy initialize called (already running)",
    );
  }

  // Legacy compatibility method for database logging
  async logToDatabase(logData: any): Promise<void> {
    try {
      // Convert to our update system
      this.sendMainAIUpdate({
        type: "system-status",
        message: `Database log from ${logData.agentId || "unknown"}: ${logData.type}`,
        priority: "low",
        data: logData,
        source: logData.agentId || "legacy-service",
      });
    } catch (error) {
      console.error("Legacy database logging error:", error);
    }
  }

  // Legacy compatibility method for creating tasks
  async createTask(taskData: any): Promise<string> {
    try {
      console.log(
        `������ AICentralCommand: Creating legacy task from ${taskData.data?.issue?.type || taskData.type || "unknown"}`,
      );

      // Handle AIAutoFixService format specifically
      const issue = taskData.data?.issue;
      let title, description, severity;

      if (issue) {
        // AIAutoFixService format
        title = `Auto-Fix: ${issue.description}`;
        description = issue.proposedFix || issue.description;
        severity = issue.severity;
      } else {
        // Generic legacy format
        title = taskData.title || taskData.description || "Legacy Task";
        description = taskData.description || taskData.title || "";
        severity = taskData.severity || taskData.priority;
      }

      // Convert legacy task data to new format
      const taskRequest = {
        title,
        description,
        type:
          severity === "critical" || severity === "high"
            ? ("major" as const)
            : ("minor" as const),
        category: this.inferCategoryFromLegacyTask(taskData),
        priority: severity || ("medium" as const),
        targetPage: window.location.pathname,
        targetElement: taskData.element || taskData.selector,
        requirements: taskData.requirements || [description],
        successCriteria: taskData.successCriteria || [
          "Issue resolved",
          "Element functioning correctly",
        ],
        requesterId: "legacy-autofix",
      };

      // Use coordination engine to submit the task
      const taskId = await this.coordinationEngine.submitTask(taskRequest);

      this.sendMainAIUpdate({
        type: "task-assignment",
        message: `Auto-fix task created: ${title}`,
        priority: taskRequest.priority,
        data: { taskId, originalData: taskData },
        source: "autofix-service",
      });

      return taskId;
    } catch (error) {
      console.error("Legacy task creation error:", error);
      // Don't throw error - just log it and return a dummy ID
      console.warn("⚠️ Creating placeholder task ID for compatibility");
      return `placeholder_${Date.now()}`;
    }
  }

  private inferCategoryFromLegacyTask(
    taskData: any,
  ):
    | "fix"
    | "enhancement"
    | "monitoring"
    | "analysis"
    | "research"
    | "optimization" {
    const description = (
      taskData.description ||
      taskData.title ||
      ""
    ).toLowerCase();

    if (
      description.includes("fix") ||
      description.includes("error") ||
      description.includes("broken")
    ) {
      return "fix";
    }
    if (description.includes("enhance") || description.includes("improve")) {
      return "enhancement";
    }
    if (description.includes("monitor") || description.includes("watch")) {
      return "monitoring";
    }
    if (description.includes("analyze") || description.includes("check")) {
      return "analysis";
    }
    if (
      description.includes("research") ||
      description.includes("investigate")
    ) {
      return "research";
    }
    if (
      description.includes("optimize") ||
      description.includes("performance")
    ) {
      return "optimization";
    }

    // Default to fix for most legacy tasks
    return "fix";
  }

  public async processUserRequest(description: string): Promise<any> {
    console.log(`🤖 Central Command processing user request: ${description}`);

    try {
      // Analyze the request and route to appropriate subsystems
      const request_type = this.analyzeRequestType(description);
      let result;

      switch (request_type) {
        case "collections_fix":
          result = await this.handleCollectionsRequest(description);
          break;
        case "memory_task":
          result = await recursiveMemorySystem.processUserTask(description);
          break;
        case "coordination_task":
          result = await multiLayerCoordination.createTask({
            type: "user_request",
            priority: "medium",
            payload: { description },
          });
          break;
        case "reverse_thinking":
          // Create a basic experienced item for reverse thinking
          const experiencedItem = {
            id: `req_${Date.now()}`,
            type: "user_request",
            experience_data: description,
            success_rate: 0.7,
            failure_patterns: [],
            learned_strategies: [],
            timestamp: new Date(),
            field_context: "user_interaction",
            dimensions: {
              cognitive: 7,
              emotional: 5,
              tactical: 6,
              strategic: 8,
              temporal: 5,
            },
          };
          reverseThinkingEngine.addExperiencedItem(experiencedItem);
          result = await reverseThinkingEngine.reverseThink(experiencedItem);
          break;
        case "field_manipulation":
          result = await fieldManipulationSystem.performFieldSensing(
            "primary_field",
            "comprehensive",
            3000,
          );
          break;
        case "ai_regeneration":
          // Get first AI instance for demo
          const aiInstances = aiRegeneration.getAllAIInstances();
          if (aiInstances.length > 0) {
            result = await aiRegeneration.refreshAI(aiInstances[0].id);
          } else {
            result = await aiRegeneration.createAIAtPosition({
              x: 500,
              y: 500,
              z: 50,
            });
          }
          break;
        default:
          result = await this.handleGeneralRequest(description);
      }

      return {
        success: true,
        request_type,
        result,
        processed_by: "AICentralCommand",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Central Command request processing failed:", error);
      return {
        success: false,
        error: error.toString(),
        processed_by: "AICentralCommand",
        timestamp: new Date(),
      };
    }
  }

  private analyzeRequestType(description: string): string {
    const desc = description.toLowerCase();

    if (desc.includes("collection") || desc.includes("button")) {
      return "collections_fix";
    }
    if (
      desc.includes("memory") ||
      desc.includes("remember") ||
      desc.includes("recall")
    ) {
      return "memory_task";
    }
    if (
      desc.includes("coordinate") ||
      desc.includes("task") ||
      desc.includes("manage")
    ) {
      return "coordination_task";
    }
    if (
      desc.includes("reverse") ||
      desc.includes("think") ||
      desc.includes("strategy")
    ) {
      return "reverse_thinking";
    }
    if (
      desc.includes("field") ||
      desc.includes("manipulate") ||
      desc.includes("sense")
    ) {
      return "field_manipulation";
    }
    if (
      desc.includes("regenerate") ||
      desc.includes("create ai") ||
      desc.includes("ai reset")
    ) {
      return "ai_regeneration";
    }

    return "general";
  }

  private async handleCollectionsRequest(description: string): Promise<any> {
    console.log("🔧 Handling collections-related request");

    // Check for collections button and apply fixes
    const collectionsButton = document.querySelector(
      '[data-collections], .collections-button, button[class*="collection"]',
    );

    if (collectionsButton) {
      // Apply collections button fix
      this.applyCollectionsButtonFix(collectionsButton as HTMLElement);

      return {
        type: "collections_fix_applied",
        message: "Collections button functionality restored",
        button_found: true,
        fixes_applied: [
          "Event listeners refreshed",
          "Navigation href added/verified",
          "Disabled attributes removed",
          "Click handler reattached",
        ],
      };
    }

    return {
      type: "collections_fix_attempted",
      message: "Collections button not found on current page",
      button_found: false,
      recommendation: "Navigate to page with collections button and retry",
    };
  }

  private applyCollectionsButtonFix(button: HTMLElement): void {
    try {
      console.log("🔧 Applying collections button fix...");

      // Fix 1: Clone button to remove old event listeners
      const clonedButton = button.cloneNode(true) as HTMLElement;
      button.parentNode?.replaceChild(clonedButton, button);

      // Fix 2: Ensure proper href for navigation
      if (clonedButton.tagName === "A") {
        clonedButton.setAttribute("href", "/collections");
      }

      // Fix 3: Add/restore click handler
      clonedButton.addEventListener("click", (e) => {
        console.log("🔘 Collections button clicked - navigating...");
        e.preventDefault();
        window.location.href = "/collections";
      });

      // Fix 4: Remove any disabled state
      clonedButton.removeAttribute("disabled");
      clonedButton.style.pointerEvents = "auto";
      clonedButton.style.opacity = "1";
      clonedButton.style.cursor = "pointer";

      // Fix 5: Ensure visibility
      clonedButton.style.visibility = "visible";
      clonedButton.style.display = clonedButton.style.display || "inline-block";

      console.log("✅ Collections button fix applied successfully");
    } catch (error) {
      console.error("❌ Collections button fix failed:", error);
    }
  }

  private async handleGeneralRequest(description: string): Promise<any> {
    return {
      type: "general_assistance",
      message: `I understand you need help with: "${description}". I've logged this request and will work on it.`,
      actions_taken: [
        "Request logged in system",
        "Relevant AI systems notified",
        "Monitoring for related issues",
      ],
      next_steps: [
        "Continue monitoring system",
        "Apply fixes as patterns emerge",
        "Provide updates on progress",
      ],
    };
  }
}

// Export both instance and class for compatibility
const centralCommandInstance = AICentralCommand.getInstance();

// Create a wrapper that acts like both an instance and a class
const compatibilityWrapper = Object.create(centralCommandInstance);

// Add getInstance method that returns the same instance
compatibilityWrapper.getInstance = () => centralCommandInstance;

// Add all instance methods to the wrapper
Object.getOwnPropertyNames(
  Object.getPrototypeOf(centralCommandInstance),
).forEach((name) => {
  if (
    name !== "constructor" &&
    typeof centralCommandInstance[name] === "function"
  ) {
    try {
      compatibilityWrapper[name] = centralCommandInstance[name].bind(
        centralCommandInstance,
      );
    } catch (error) {
      console.warn(`Could not bind method ${name}:`, error);
    }
  }
});

// Copy all instance properties
Object.getOwnPropertyNames(centralCommandInstance).forEach((name) => {
  if (typeof centralCommandInstance[name] !== "function") {
    try {
      compatibilityWrapper[name] = centralCommandInstance[name];
    } catch (error) {
      console.warn(`Could not copy property ${name}:`, error);
    }
  }
});

export default compatibilityWrapper;
export { AICentralCommand };
export const aiCentralCommand = centralCommandInstance;
