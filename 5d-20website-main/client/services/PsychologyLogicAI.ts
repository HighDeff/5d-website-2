// Psychology Logic AI - Forms new maps of fixes for potential, probable, and hazardous errors
import AITaskDatabase, { AITask, AIAgent } from "./AITaskDatabase";
import AICentralCommand from "./AICentralCommand";
import AICoordinationEngine from "./AICoordinationEngine";

export interface ErrorPattern {
  id: string;
  type: string;
  frequency: number;
  userBehaviorTriggers: string[];
  commonElements: string[];
  timePatterns: string[];
  severity: "low" | "medium" | "high" | "critical";
  predictiveFactors: PredictiveFactor[];
  preventionStrategies: PreventionStrategy[];
  riskScore: number; // 0-1
  lastOccurrence: string;
  userTypes: string[]; // Types of users who trigger this error
}

export interface PredictiveFactor {
  factor: string;
  weight: number; // 0-1
  confidence: number; // 0-1
  description: string;
  examples: string[];
}

export interface PreventionStrategy {
  id: string;
  strategy: string;
  implementation: string;
  effectiveness: number; // 0-1
  cost: "low" | "medium" | "high";
  timeToImplement: number; // hours
  dependencies: string[];
  testing: string[];
}

export interface UserBehaviorMap {
  userId: string;
  userType: "admin" | "premium" | "standard" | "guest";
  behaviorPatterns: BehaviorPattern[];
  errorProneness: number; // 0-1
  commonMistakes: string[];
  helpfulInterventions: string[];
  learningRate: number; // How quickly they adapt to fixes
  frustrationTriggers: string[];
  successPatterns: string[];
}

export interface BehaviorPattern {
  action: string;
  frequency: number;
  timeOfDay: string[];
  followUpActions: string[];
  errorRate: number;
  contextualFactors: string[];
}

class PsychologyLogicAI {
  private static instance: PsychologyLogicAI;
  private taskDatabase = AITaskDatabase;
  private centralCommand = AICentralCommand;
  private coordinationEngine = AICoordinationEngine;
  private errorPatterns: Map<string, ErrorPattern> = new Map();
  private userBehaviorMaps: Map<string, UserBehaviorMap> = new Map();
  private analysisInterval: NodeJS.Timeout | null = null;
  private isAnalyzing = false;

  static getInstance(): PsychologyLogicAI {
    if (!PsychologyLogicAI.instance) {
      PsychologyLogicAI.instance = new PsychologyLogicAI();
    }
    return PsychologyLogicAI.instance;
  }

  constructor() {
    this.initializePatternAnalysis();
    this.startContinuousAnalysis();
    console.log("🧠 Psychology Logic AI: Initialized pattern analysis system");
  }

  private initializePatternAnalysis(): void {
    // Load existing patterns from storage
    this.loadErrorPatterns();
    this.loadUserBehaviorMaps();

    // Set up behavior tracking
    this.setupBehaviorTracking();

    console.log("🧠 Psychology Logic AI: Pattern analysis initialized");
  }

  private loadErrorPatterns(): void {
    try {
      const stored = localStorage.getItem("psychology_error_patterns");
      if (stored) {
        const patterns = JSON.parse(stored);
        patterns.forEach((pattern: ErrorPattern) => {
          this.errorPatterns.set(pattern.id, pattern);
        });
        console.log(`🧠 Loaded ${this.errorPatterns.size} error patterns`);
      }
    } catch (error) {
      console.warn("Failed to load error patterns:", error);
    }
  }

  private loadUserBehaviorMaps(): void {
    try {
      const stored = localStorage.getItem("psychology_user_behaviors");
      if (stored) {
        const behaviors = JSON.parse(stored);
        behaviors.forEach((behavior: UserBehaviorMap) => {
          this.userBehaviorMaps.set(behavior.userId, behavior);
        });
        console.log(
          `🧠 Loaded ${this.userBehaviorMaps.size} user behavior maps`,
        );
      }
    } catch (error) {
      console.warn("Failed to load user behavior maps:", error);
    }
  }

  private setupBehaviorTracking(): void {
    // Track clicks for error prediction
    document.addEventListener("click", (event) => {
      this.analyzeClickBehavior(event);
    });

    // Track scroll patterns
    let scrollTimer: NodeJS.Timeout;
    document.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.analyzeScrollBehavior();
      }, 500);
    });

    // Track form interactions
    document.addEventListener("input", (event) => {
      this.analyzeFormBehavior(event);
    });

    console.log("🧠 Behavior tracking setup complete");
  }

  private analyzeClickBehavior(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const currentUser = this.getCurrentUser();

    // Analyze potential issues with this click
    this.predictClickIssues(target, currentUser);

    // Log behavior pattern
    this.logBehaviorPattern({
      action: "click",
      element: this.generateElementSelector(target),
      userType: currentUser?.type || "guest",
      timestamp: new Date().toISOString(),
      context: this.getPageContext(),
    });
  }

  private predictClickIssues(element: HTMLElement, user: any): void {
    const issues: string[] = [];

    // Check for disabled elements that user tried to click
    if (
      element.hasAttribute("disabled") ||
      element.classList.contains("disabled")
    ) {
      issues.push(
        "User clicked disabled element - potential frustration point",
      );
    }

    // Check for broken links
    if (element.tagName === "A" && !(element as HTMLAnchorElement).href) {
      issues.push("User clicked broken link - navigation failure");
    }

    // Check for form submission without validation
    if (element.type === "submit") {
      const form = element.closest("form");
      if (form && !this.validateFormCompleteness(form)) {
        issues.push("Form submission attempted with incomplete data");
      }
    }

    // Check for premium features accessed by non-premium users
    if (
      user?.type !== "premium" &&
      element.classList.contains("premium-feature")
    ) {
      issues.push(
        "Non-premium user accessing premium feature - conversion opportunity",
      );
    }

    // Log issues for pattern analysis
    issues.forEach((issue) => {
      this.recordPotentialIssue({
        type: "behavioral",
        description: issue,
        element: this.generateElementSelector(element),
        userType: user?.type || "guest",
        severity: this.calculateIssueSeverity(issue),
        timestamp: new Date().toISOString(),
      });
    });
  }

  private analyzeScrollBehavior(): void {
    const currentUser = this.getCurrentUser();
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercentage = scrollPosition / (documentHeight - windowHeight);

    // Detect rapid scrolling (potential frustration)
    if (this.isRapidScrolling()) {
      this.recordPotentialIssue({
        type: "navigation",
        description:
          "User exhibiting rapid scrolling - potential confusion or frustration",
        element: "page",
        userType: currentUser?.type || "guest",
        severity: "medium",
        timestamp: new Date().toISOString(),
      });
    }

    // Detect if user is stuck in one area
    if (this.isUserStuckInArea(scrollPosition)) {
      this.recordPotentialIssue({
        type: "navigation",
        description:
          "User spending excessive time in one area - potential content or UX issue",
        element: "page",
        userType: currentUser?.type || "guest",
        severity: "low",
        timestamp: new Date().toISOString(),
      });
    }
  }

  private analyzeFormBehavior(event: Event): void {
    const target = event.target as HTMLInputElement;
    const currentUser = this.getCurrentUser();

    // Check for validation errors
    if (target.validity && !target.validity.valid) {
      this.recordPotentialIssue({
        type: "form-validation",
        description: `Form validation error on ${target.type} field`,
        element: this.generateElementSelector(target),
        userType: currentUser?.type || "guest",
        severity: "medium",
        timestamp: new Date().toISOString(),
      });
    }

    // Check for repeated attempts at same field
    if (this.isRepeatedFieldError(target)) {
      this.recordPotentialIssue({
        type: "form-usability",
        description:
          "User struggling with form field - potential UX improvement needed",
        element: this.generateElementSelector(target),
        userType: currentUser?.type || "guest",
        severity: "high",
        timestamp: new Date().toISOString(),
      });
    }
  }

  private startContinuousAnalysis(): void {
    if (this.analysisInterval) return;

    this.analysisInterval = setInterval(() => {
      if (!this.isAnalyzing) {
        this.performPatternAnalysis();
      }
    }, 30000); // Analyze every 30 seconds

    console.log("🧠 Continuous pattern analysis started");
  }

  private async performPatternAnalysis(): Promise<void> {
    this.isAnalyzing = true;

    try {
      await this.analyzeErrorPatterns();
      await this.updateUserBehaviorMaps();
      await this.createPredictiveTasks();

      // Save patterns to storage
      this.savePatterns();

      console.log("🧠 Pattern analysis cycle completed");
    } catch (error) {
      console.error("Pattern analysis failed:", error);
    } finally {
      this.isAnalyzing = false;
    }
  }

  private async analyzeErrorPatterns(): Promise<void> {
    // Analyze recent tasks and screenshots for patterns
    const recentTasks = this.taskDatabase
      .getTasks({
        status: ["completed", "failed"] as any,
      })
      .slice(-50);

    const recentScreenshots = JSON.parse(
      localStorage.getItem("ai_screenshots") || "[]",
    ).slice(-20);

    // Group errors by type and frequency
    const errorGroups = new Map<string, any[]>();

    recentTasks.forEach((task) => {
      if (task.status === "failed") {
        const errorType = this.categorizeError(task);
        if (!errorGroups.has(errorType)) {
          errorGroups.set(errorType, []);
        }
        errorGroups.get(errorType)!.push(task);
      }
    });

    recentScreenshots.forEach((screenshot) => {
      screenshot.detectedIssues?.forEach((issue: any) => {
        const errorType = issue.type;
        if (!errorGroups.has(errorType)) {
          errorGroups.set(errorType, []);
        }
        errorGroups.get(errorType)!.push(issue);
      });
    });

    // Update error patterns
    errorGroups.forEach((errors, type) => {
      this.updateErrorPattern(type, errors);
    });
  }

  private updateErrorPattern(type: string, errors: any[]): void {
    const existingPattern = this.errorPatterns.get(type);
    const frequency = errors.length;

    const pattern: ErrorPattern = {
      id: existingPattern?.id || `pattern_${type}_${Date.now()}`,
      type: type,
      frequency: existingPattern
        ? existingPattern.frequency + frequency
        : frequency,
      userBehaviorTriggers: this.extractBehaviorTriggers(errors),
      commonElements: this.extractCommonElements(errors),
      timePatterns: this.extractTimePatterns(errors),
      severity: this.calculatePatternSeverity(errors),
      predictiveFactors: this.generatePredictiveFactors(errors),
      preventionStrategies: this.generatePreventionStrategies(type, errors),
      riskScore: this.calculateRiskScore(errors),
      lastOccurrence: new Date().toISOString(),
      userTypes: this.extractUserTypes(errors),
    };

    this.errorPatterns.set(type, pattern);
    console.log(
      `🧠 Updated error pattern: ${type} (frequency: ${pattern.frequency})`,
    );
  }

  private generatePredictiveFactors(errors: any[]): PredictiveFactor[] {
    const factors: PredictiveFactor[] = [];

    // Time-based factors
    const timeHours = errors.map((e) =>
      new Date(e.timestamp || e.createdAt).getHours(),
    );
    const commonHours = this.findMostCommon(timeHours);
    if (commonHours.length > 0) {
      factors.push({
        factor: "time_of_day",
        weight: 0.3,
        confidence: 0.7,
        description: `Errors commonly occur during hours: ${commonHours.join(", ")}`,
        examples: [`${commonHours[0]}:00 - ${(commonHours[0] + 2) % 24}:00`],
      });
    }

    // User type factors
    const userTypes = errors.map((e) => e.userType || "unknown");
    const commonUserTypes = this.findMostCommon(userTypes);
    if (commonUserTypes.length > 0) {
      factors.push({
        factor: "user_type",
        weight: 0.5,
        confidence: 0.8,
        description: `Most common in user types: ${commonUserTypes.join(", ")}`,
        examples: commonUserTypes,
      });
    }

    // Element-based factors
    const elements = errors
      .map((e) => e.element || e.targetElement)
      .filter(Boolean);
    const commonElements = this.findMostCommon(elements);
    if (commonElements.length > 0) {
      factors.push({
        factor: "element_type",
        weight: 0.7,
        confidence: 0.9,
        description: `Commonly affects elements: ${commonElements.join(", ")}`,
        examples: commonElements,
      });
    }

    return factors;
  }

  private generatePreventionStrategies(
    type: string,
    errors: any[],
  ): PreventionStrategy[] {
    const strategies: PreventionStrategy[] = [];

    // Based on error type, generate appropriate strategies
    switch (type) {
      case "broken-link":
        strategies.push({
          id: `prevent_${type}_${Date.now()}`,
          strategy: "Automated Link Validation",
          implementation: "Add periodic link checking and validation",
          effectiveness: 0.9,
          cost: "low",
          timeToImplement: 2,
          dependencies: ["link-checker-service"],
          testing: ["automated-link-tests", "user-journey-tests"],
        });
        break;

      case "form-validation":
        strategies.push({
          id: `prevent_${type}_${Date.now()}`,
          strategy: "Enhanced Form UX",
          implementation: "Add real-time validation and better error messaging",
          effectiveness: 0.8,
          cost: "medium",
          timeToImplement: 4,
          dependencies: ["form-validation-library"],
          testing: ["form-usability-tests", "accessibility-tests"],
        });
        break;

      case "missing-element":
        strategies.push({
          id: `prevent_${type}_${Date.now()}`,
          strategy: "Conditional Element Loading",
          implementation: "Add fallback elements and loading states",
          effectiveness: 0.7,
          cost: "medium",
          timeToImplement: 3,
          dependencies: ["loading-state-components"],
          testing: ["loading-state-tests", "fallback-tests"],
        });
        break;

      default:
        strategies.push({
          id: `prevent_${type}_${Date.now()}`,
          strategy: "General Error Prevention",
          implementation: "Enhanced error handling and user feedback",
          effectiveness: 0.6,
          cost: "low",
          timeToImplement: 1,
          dependencies: [],
          testing: ["error-handling-tests"],
        });
    }

    return strategies;
  }

  private async createPredictiveTasks(): Promise<void> {
    // Create tasks for high-risk patterns
    const highRiskPatterns = Array.from(this.errorPatterns.values()).filter(
      (pattern) => pattern.riskScore > 0.7 && pattern.frequency > 2,
    );

    for (const pattern of highRiskPatterns) {
      // Check if we already created a task for this pattern recently
      const recentTasks = this.taskDatabase.getTasks().filter(
        (task) =>
          task.title.includes(pattern.type) &&
          new Date(task.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
      );

      if (recentTasks.length === 0) {
        await this.coordinationEngine.submitTask({
          title: `Predictive Fix: ${pattern.type}`,
          description: `Psychology AI detected high-risk pattern requiring attention`,
          type: "major",
          category: "enhancement",
          priority: pattern.severity === "critical" ? "critical" : "high",
          targetPage: window.location.pathname,
          targetElement: pattern.commonElements[0],
          requirements: [
            `Address ${pattern.type} pattern`,
            `Implement prevention strategy`,
            `Monitor user behavior improvements`,
          ],
          successCriteria: [
            `Reduce ${pattern.type} frequency by 50%`,
            "Improve user satisfaction metrics",
            "Implement monitoring for pattern recurrence",
          ],
          requesterId: "psychology-ai",
        });

        console.log(`🧠 Created predictive task for pattern: ${pattern.type}`);
      }
    }
  }

  // Utility methods
  private getCurrentUser(): any {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return null;
    }
  }

  private generateElementSelector(element: HTMLElement): string {
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

  private getPageContext(): any {
    return {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  private calculateIssueSeverity(
    issue: string,
  ): "low" | "medium" | "high" | "critical" {
    if (issue.includes("broken") || issue.includes("error")) return "high";
    if (issue.includes("frustration") || issue.includes("confusion"))
      return "medium";
    return "low";
  }

  private logBehaviorPattern(pattern: any): void {
    try {
      // Store behavior pattern for analysis
      const patterns = JSON.parse(
        localStorage.getItem("psychology_behavior_patterns") || "[]",
      );
      patterns.push(pattern);

      // Keep only last 200 patterns
      if (patterns.length > 200) {
        patterns.splice(0, patterns.length - 200);
      }

      localStorage.setItem(
        "psychology_behavior_patterns",
        JSON.stringify(patterns),
      );
      console.log(
        `🧠 Behavior pattern logged: ${pattern.action} on ${pattern.element}`,
      );
    } catch (error) {
      console.warn("Failed to log behavior pattern:", error);
    }
  }

  private recordPotentialIssue(issue: any): void {
    // Store in a queue for pattern analysis
    const issues = JSON.parse(
      localStorage.getItem("psychology_potential_issues") || "[]",
    );
    issues.push(issue);

    // Keep only last 100 issues
    if (issues.length > 100) {
      issues.splice(0, issues.length - 100);
    }

    localStorage.setItem("psychology_potential_issues", JSON.stringify(issues));
  }

  private savePatterns(): void {
    try {
      localStorage.setItem(
        "psychology_error_patterns",
        JSON.stringify(Array.from(this.errorPatterns.values())),
      );
      localStorage.setItem(
        "psychology_user_behaviors",
        JSON.stringify(Array.from(this.userBehaviorMaps.values())),
      );
    } catch (error) {
      console.warn("Failed to save psychology patterns:", error);
    }
  }

  // Helper methods for analysis
  private isRapidScrolling(): boolean {
    // Implementation for detecting rapid scrolling
    return false; // Placeholder
  }

  private isUserStuckInArea(scrollPosition: number): boolean {
    // Implementation for detecting if user is stuck
    return false; // Placeholder
  }

  private validateFormCompleteness(form: HTMLFormElement): boolean {
    const requiredFields = form.querySelectorAll("[required]");
    return Array.from(requiredFields).every(
      (field) => (field as HTMLInputElement).value.trim() !== "",
    );
  }

  private isRepeatedFieldError(field: HTMLInputElement): boolean {
    // Implementation for detecting repeated errors on same field
    return false; // Placeholder
  }

  private categorizeError(task: any): string {
    if (task.title.includes("link")) return "broken-link";
    if (task.title.includes("form")) return "form-validation";
    if (task.title.includes("missing")) return "missing-element";
    if (task.title.includes("color")) return "color-issue";
    return "general-error";
  }

  private extractBehaviorTriggers(errors: any[]): string[] {
    return ["click", "scroll", "form-input"]; // Simplified
  }

  private extractCommonElements(errors: any[]): string[] {
    const elements = errors
      .map((e) => e.element || e.targetElement)
      .filter(Boolean);
    return this.findMostCommon(elements);
  }

  private extractTimePatterns(errors: any[]): string[] {
    return ["morning", "afternoon", "evening"]; // Simplified
  }

  private calculatePatternSeverity(
    errors: any[],
  ): "low" | "medium" | "high" | "critical" {
    if (errors.length > 10) return "critical";
    if (errors.length > 5) return "high";
    if (errors.length > 2) return "medium";
    return "low";
  }

  private calculateRiskScore(errors: any[]): number {
    return Math.min(errors.length / 10, 1); // Simplified risk calculation
  }

  private extractUserTypes(errors: any[]): string[] {
    const types = errors.map((e) => e.userType || "unknown");
    return [...new Set(types)];
  }

  private findMostCommon<T>(array: T[]): T[] {
    const counts = new Map<T, number>();
    array.forEach((item) => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });

    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 3).map(([item]) => item);
  }

  private async updateUserBehaviorMaps(): Promise<void> {
    // Update user behavior analysis
    const currentUser = this.getCurrentUser();
    if (currentUser?.email) {
      // Update behavior map for current user
      // Implementation would analyze their recent actions
      console.log("🧠 Updated user behavior map");
    }
  }

  // Public interface
  getErrorPatterns(): ErrorPattern[] {
    return Array.from(this.errorPatterns.values());
  }

  getUserBehaviorMaps(): UserBehaviorMap[] {
    return Array.from(this.userBehaviorMaps.values());
  }

  getPredictions(): any {
    return {
      highRiskPatterns: this.getErrorPatterns().filter(
        (p) => p.riskScore > 0.7,
      ),
      userRiskLevels: this.getUserBehaviorMaps().map((u) => ({
        userId: u.userId,
        riskLevel: u.errorProneness,
      })),
      recommendedActions: this.getRecommendedActions(),
    };
  }

  private getRecommendedActions(): string[] {
    const actions: string[] = [];
    const highRiskPatterns = this.getErrorPatterns().filter(
      (p) => p.riskScore > 0.7,
    );

    highRiskPatterns.forEach((pattern) => {
      pattern.preventionStrategies.forEach((strategy) => {
        if (strategy.effectiveness > 0.8) {
          actions.push(`Implement ${strategy.strategy} for ${pattern.type}`);
        }
      });
    });

    return actions;
  }
}

export default PsychologyLogicAI.getInstance();
