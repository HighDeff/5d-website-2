// User Intent Detection and Conversation Profiling AI
// Advanced AI system for understanding user behavior, communication patterns, and predicting intentions

import DatabaseService from "./DatabaseService";
import ConsoleLogMonitoringService from "./ConsoleLogMonitoringService";

export interface UserIntent {
  id: string;
  type:
    | "navigation"
    | "interaction"
    | "troubleshooting"
    | "exploration"
    | "task_completion"
    | "question_asking";
  confidence: number;
  description: string;
  detectedAt: string;
  contextClues: string[];
  predictedNextActions: string[];
  logicPath: LogicStep[];
  userMessage?: string;
  completion:
    | "not_started"
    | "in_progress"
    | "completed"
    | "abandoned"
    | "blocked";
  blockers?: string[];
  alternativePaths?: AlternativePath[];
}

export interface LogicStep {
  step: number;
  description: string;
  reasoning: string;
  confidence: number;
  dataPoints: string[];
  assumptions: string[];
}

export interface AlternativePath {
  pathId: string;
  description: string;
  likelihood: number;
  steps: string[];
  estimatedTime: number;
  userBenefit: string;
}

export interface ConversationProfile {
  userId: string;
  communicationStyle:
    | "technical"
    | "casual"
    | "analytical"
    | "directive"
    | "exploratory"
    | "frustrated";
  vocabularyLevel: "basic" | "intermediate" | "advanced" | "expert";
  preferredDetailLevel: "brief" | "moderate" | "detailed" | "comprehensive";
  questioningPattern: "direct" | "exploratory" | "systematic" | "reactive";
  frustrationTriggers: string[];
  successPatterns: string[];
  learningStyle: "visual" | "hands_on" | "analytical" | "experimental";
  taskApproach: "methodical" | "trial_error" | "guided" | "independent";
  attentionSpan: "short" | "medium" | "long" | "variable";
  responsePreferences: {
    wantsExplanations: boolean;
    prefersExamples: boolean;
    needsStepByStep: boolean;
    wantsAlternatives: boolean;
  };
}

export interface PageElement {
  id: string;
  type:
    | "textbox"
    | "button"
    | "canvas"
    | "form"
    | "link"
    | "image"
    | "video"
    | "menu";
  currentState:
    | "loading"
    | "present"
    | "hidden"
    | "error"
    | "glitch"
    | "static"
    | "rendering";
  expectedBehavior: string;
  actualBehavior: string;
  userInteractions: UserInteraction[];
  isWorkingCorrectly: boolean;
  issuesDetected: string[];
  supposedToBe: string;
  userExpectation: string;
}

export interface UserInteraction {
  type: "click" | "hover" | "type" | "scroll" | "focus" | "blur" | "drag";
  timestamp: string;
  elementId: string;
  success: boolean;
  duration: number;
  intention: string;
  context: string;
  frustrationIndicators: string[];
}

export interface NavigationAnalysis {
  currentPage: string;
  pageTitle: string;
  isExpectedPage: boolean;
  is404: boolean;
  hasValidContent: boolean;
  contentMismatch: number; // 0-100 score
  userExpectedContent: string[];
  actualContent: string[];
  navigationPath: string[];
  timeOnPage: number;
  bounceRisk: number; // 0-100 probability of user leaving
  redirectNeeded: boolean;
  suggestedActions: string[];
}

class UserIntentAnalysisAI {
  private static instance: UserIntentAnalysisAI;
  private currentProfile: ConversationProfile | null = null;
  private detectedIntents: Map<string, UserIntent> = new Map();
  private pageElements: Map<string, PageElement> = new Map();
  private interactionHistory: UserInteraction[] = [];
  private navigationAnalysis: NavigationAnalysis | null = null;
  private isAnalyzing = false;
  private analysisInterval?: NodeJS.Timeout;
  private logMonitoring: ConsoleLogMonitoringService;
  private database: typeof DatabaseService;

  // Learning and pattern recognition
  private behaviorPatterns: Map<string, number> = new Map();
  private intentTemplates: Map<string, UserIntent> = new Map();
  private conversationMemory: string[] = [];
  private contextClues: string[] = [];

  // Helper function to safely check if elementId contains a substring
  private safeElementIdIncludes(elementId: any, searchString: string): boolean {
    return typeof elementId === "string" && elementId.includes(searchString);
  }

  // Helper function to safely get elementId as string
  private safeGetElementId(elementId: any): string {
    return typeof elementId === "string" ? elementId : String(elementId || "");
  }

  // Helper function to normalize interaction data to prevent type errors
  private normalizeUserInteraction(interaction: any): UserInteraction {
    return {
      type: interaction.type || "click",
      timestamp: interaction.timestamp || new Date().toISOString(),
      elementId: this.safeGetElementId(interaction.elementId),
      success: Boolean(interaction.success),
      duration: Number(interaction.duration) || 0,
      intention: String(interaction.intention || ""),
      context: String(interaction.context || ""),
      frustrationIndicators: Array.isArray(interaction.frustrationIndicators)
        ? interaction.frustrationIndicators.map(String)
        : [],
    };
  }

  private constructor() {
    this.logMonitoring = ConsoleLogMonitoringService.getInstance();
    this.database = DatabaseService;
    this.initializeTemplates();
    this.startBehaviorTracking();
  }

  static getInstance(): UserIntentAnalysisAI {
    if (!UserIntentAnalysisAI.instance) {
      UserIntentAnalysisAI.instance = new UserIntentAnalysisAI();
    }
    return UserIntentAnalysisAI.instance;
  }

  // Start analyzing user behavior and building profile
  async startAnalysis(): Promise<void> {
    if (this.isAnalyzing) return;

    this.isAnalyzing = true;
    console.log("🧠 User Intent Analysis AI: Starting behavioral analysis...");

    // Initialize profile
    await this.initializeUserProfile();

    // Start continuous analysis
    this.analysisInterval = setInterval(async () => {
      await this.runAnalysisCycle();
    }, 2000);

    // Set up real-time event tracking
    this.setupRealTimeTracking();

    console.log("✅ User Intent Analysis AI: Analysis started");
  }

  // Stop analysis
  stopAnalysis(): void {
    if (!this.isAnalyzing) return;

    this.isAnalyzing = false;
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
    }

    this.saveUserProfile();
    console.log("🧠 User Intent Analysis AI: Analysis stopped");
  }

  // Initialize user profile based on initial observations
  private async initializeUserProfile(): Promise<void> {
    // Try to load existing profile
    const saved = localStorage.getItem("user_conversation_profile");
    if (saved) {
      try {
        this.currentProfile = JSON.parse(saved);
        console.log("📋 Loaded existing user profile");
        return;
      } catch (error) {
        console.log("📋 Creating new user profile");
      }
    }

    // Create new profile with initial assessment
    this.currentProfile = {
      userId: `user_${Date.now()}`,
      communicationStyle: "analytical", // Based on user's detailed technical request
      vocabularyLevel: "expert", // Complex technical language used
      preferredDetailLevel: "comprehensive", // Long detailed requests
      questioningPattern: "systematic", // Structured approach to problems
      frustrationTriggers: [
        "missing_features",
        "non_working_buttons",
        "static_elements",
      ],
      successPatterns: [
        "detailed_explanations",
        "working_examples",
        "comprehensive_solutions",
      ],
      learningStyle: "analytical", // Technical approach
      taskApproach: "methodical", // Systematic problem-solving
      attentionSpan: "long", // Long detailed requests indicate sustained attention
      responsePreferences: {
        wantsExplanations: true,
        prefersExamples: true,
        needsStepByStep: true,
        wantsAlternatives: true,
      },
    };

    console.log("📋 Initialized user profile with initial assessment");
  }

  // Main analysis cycle
  private async runAnalysisCycle(): Promise<void> {
    if (!this.isAnalyzing) return;

    try {
      await this.analyzeCurrentContext();
      await this.detectUserIntent();
      await this.analyzePageElements();
      await this.updateNavigationAnalysis();
      await this.updateConversationProfile();
      await this.generateInsights();
    } catch (error) {
      console.error("Error in analysis cycle:", error);
    }
  }

  // Analyze current context and environment
  private async analyzeCurrentContext(): Promise<void> {
    // Collect context clues
    this.contextClues = [
      `Current page: ${window.location.pathname}`,
      `Page title: ${document.title}`,
      `Time on page: ${this.getTimeOnPage()}ms`,
      `Screen resolution: ${window.innerWidth}x${window.innerHeight}`,
      `User agent info: ${navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop"}`,
    ];

    // Analyze page state
    const canvasElements = document.querySelectorAll("canvas");
    const buttons = document.querySelectorAll("button");
    const inputs = document.querySelectorAll("input");

    this.contextClues.push(`Canvas elements: ${canvasElements.length}`);
    this.contextClues.push(`Interactive buttons: ${buttons.length}`);
    this.contextClues.push(`Input fields: ${inputs.length}`);

    // Check for error states
    const errorElements = document.querySelectorAll(
      '[class*="error"], [id*="error"]',
    );
    if (errorElements.length > 0) {
      this.contextClues.push(
        `Error indicators present: ${errorElements.length}`,
      );
    }
  }

  // Detect user intent based on behavior patterns
  private async detectUserIntent(): Promise<void> {
    const recentInteractions = this.interactionHistory.slice(-10);

    // Analyze interaction patterns
    if (recentInteractions.length === 0) {
      // User is observing/reading
      await this.recordIntent(
        "exploration",
        0.7,
        "User appears to be exploring and observing the interface",
      );
      return;
    }

    const clickCount = recentInteractions.filter(
      (i) => i.type === "click",
    ).length;
    const typeCount = recentInteractions.filter(
      (i) => i.type === "type",
    ).length;
    const unsuccessfulInteractions = recentInteractions.filter(
      (i) => !i.success,
    ).length;

    // Pattern analysis
    if (unsuccessfulInteractions > clickCount * 0.5) {
      await this.recordIntent(
        "troubleshooting",
        0.9,
        "Multiple unsuccessful interactions detected - user appears to be troubleshooting",
      );
    } else if (typeCount > 0) {
      await this.recordIntent(
        "task_completion",
        0.8,
        "User is actively typing - appears to be completing a task",
      );
    } else if (clickCount > 3) {
      await this.recordIntent(
        "interaction",
        0.7,
        "Active clicking pattern - user is interacting with interface elements",
      );
    }

    // Analyze specific context
    if (this.contextClues.some((clue) => clue.includes("Canvas elements"))) {
      const canvasClicks = recentInteractions.filter(
        (i) =>
          this.safeElementIdIncludes(i.elementId, "canvas") ||
          this.safeElementIdIncludes(i.elementId, "ai"),
      );

      if (canvasClicks.length > 0) {
        await this.recordIntent(
          "interaction",
          0.85,
          "User is interacting with AI canvas - seeking visual feedback or control",
        );
      }
    }
  }

  // Record detected intent with logic path
  private async recordIntent(
    type: UserIntent["type"],
    confidence: number,
    description: string,
  ): Promise<void> {
    const intent: UserIntent = {
      id: `intent_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      confidence,
      description,
      detectedAt: new Date().toISOString(),
      contextClues: [...this.contextClues],
      predictedNextActions: this.predictNextActions(type),
      logicPath: this.buildLogicPath(type, description),
      completion: "in_progress",
    };

    this.detectedIntents.set(intent.id, intent);

    // Trigger UI update
    this.updateIntentDisplay(intent);
  }

  // Build logic path for intent detection
  private buildLogicPath(
    type: UserIntent["type"],
    description: string,
  ): LogicStep[] {
    const steps: LogicStep[] = [];

    steps.push({
      step: 1,
      description: "Observed user behavior",
      reasoning: "Analyzing recent interaction patterns and context",
      confidence: 0.9,
      dataPoints: this.contextClues.slice(0, 3),
      assumptions: [
        "User is actively engaged",
        "Interactions have clear intent",
      ],
    });

    steps.push({
      step: 2,
      description: "Pattern recognition",
      reasoning: "Matching behavior against known intent patterns",
      confidence: 0.8,
      dataPoints: [`Intent type: ${type}`, `Pattern confidence: high`],
      assumptions: ["Historical patterns apply", "Context is consistent"],
    });

    steps.push({
      step: 3,
      description: "Intent classification",
      reasoning: description,
      confidence: 0.85,
      dataPoints: this.contextClues,
      assumptions: ["Intent is actionable", "User needs can be predicted"],
    });

    return steps;
  }

  // Predict next user actions
  private predictNextActions(intentType: UserIntent["type"]): string[] {
    const predictions: Record<string, string[]> = {
      exploration: [
        "Look for interactive elements",
        "Read documentation or tooltips",
        "Try clicking on various controls",
        "Seek visual feedback",
      ],
      interaction: [
        "Continue clicking elements",
        "Look for immediate feedback",
        "Try different controls if current ones don't work",
        "Ask for help if frustrated",
      ],
      troubleshooting: [
        "Try different approaches",
        "Look for error messages",
        "Refresh page or reset",
        "Seek assistance or documentation",
      ],
      task_completion: [
        "Complete current input",
        "Submit form or execute action",
        "Verify results",
        "Move to next step",
      ],
      question_asking: [
        "Formulate specific question",
        "Look for help or chat interface",
        "Describe problem in detail",
        "Seek clarification on functionality",
      ],
      navigation: [
        "Move to different page section",
        "Use navigation menu",
        "Follow suggested links",
        "Return to previous state",
      ],
    };

    return (
      predictions[intentType] || ["Continue current behavior", "Seek guidance"]
    );
  }

  // Analyze page elements for functionality
  private async analyzePageElements(): Promise<void> {
    // Analyze canvas elements
    const canvases = document.querySelectorAll("canvas");
    canvases.forEach((canvas, index) => {
      this.analyzeCanvasElement(canvas, index);
    });

    // Analyze buttons
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button, index) => {
      this.analyzeButtonElement(button, index);
    });

    // Analyze text inputs
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    inputs.forEach((input, index) => {
      this.analyzeInputElement(input as HTMLInputElement, index);
    });
  }

  // Analyze specific canvas element
  private analyzeCanvasElement(canvas: HTMLCanvasElement, index: number): void {
    const elementId = canvas.id || `canvas_${index}`;

    const currentState = this.determineCanvasState(canvas);
    const isWorking =
      currentState === "rendering" || currentState === "present";

    const element: PageElement = {
      id: elementId,
      type: "canvas",
      currentState,
      expectedBehavior:
        "Display animated AI entities with interactive controls",
      actualBehavior: this.getCanvasBehavior(canvas),
      userInteractions: this.getUserInteractionsForElement(elementId),
      isWorkingCorrectly: isWorking,
      issuesDetected: this.detectCanvasIssues(canvas),
      supposedToBe:
        "Interactive AI visualization with live movement and controls",
      userExpectation:
        "See moving AI entities, working buttons, and responsive interface",
    };

    this.pageElements.set(elementId, element);
  }

  // Determine canvas state
  private determineCanvasState(
    canvas: HTMLCanvasElement,
  ): PageElement["currentState"] {
    if (!canvas) return "error";

    const style = window.getComputedStyle(canvas);
    if (style.display === "none") return "hidden";
    if (style.visibility === "hidden") return "hidden";

    const ctx = canvas.getContext("2d");
    if (!ctx) return "error";

    // Check if canvas has content
    const imageData = ctx.getImageData(
      0,
      0,
      Math.min(canvas.width, 100),
      Math.min(canvas.height, 100),
    );
    const hasContent = imageData.data.some((pixel) => pixel !== 0);

    if (hasContent) {
      return "rendering";
    } else {
      return "static";
    }
  }

  // Get canvas behavior description
  private getCanvasBehavior(canvas: HTMLCanvasElement): string {
    const state = this.determineCanvasState(canvas);
    const behaviors: Record<string, string> = {
      rendering: "Canvas is displaying content and appears to be rendering",
      static: "Canvas exists but appears static with no visible content",
      hidden: "Canvas is hidden from view",
      error: "Canvas has rendering context issues",
      loading: "Canvas appears to be initializing",
      glitch: "Canvas showing intermittent rendering issues",
    };

    return behaviors[state] || "Unknown behavior";
  }

  // Detect canvas issues
  private detectCanvasIssues(canvas: HTMLCanvasElement): string[] {
    const issues: string[] = [];

    if (!canvas.getContext("2d")) {
      issues.push("No 2D rendering context available");
    }

    if (canvas.width === 0 || canvas.height === 0) {
      issues.push("Canvas has invalid dimensions");
    }

    const style = window.getComputedStyle(canvas);
    if (style.display === "none") {
      issues.push("Canvas is hidden");
    }

    // Check for missing controls
    const controlPanel = document.querySelector(
      '[id*="control"], [id*="panel"]',
    );
    if (!controlPanel) {
      issues.push("No control panel found");
    }

    return issues;
  }

  // Analyze button element
  private analyzeButtonElement(button: HTMLButtonElement, index: number): void {
    const elementId = button.id || `button_${index}`;

    const element: PageElement = {
      id: elementId,
      type: "button",
      currentState: button.disabled ? "static" : "present",
      expectedBehavior: "Respond to clicks with immediate feedback or action",
      actualBehavior: this.getButtonBehavior(button),
      userInteractions: this.getUserInteractionsForElement(elementId),
      isWorkingCorrectly: !button.disabled && button.onclick !== null,
      issuesDetected: this.detectButtonIssues(button),
      supposedToBe: "Interactive control element",
      userExpectation: "Button should respond when clicked",
    };

    this.pageElements.set(elementId, element);
  }

  // Get button behavior
  private getButtonBehavior(button: HTMLButtonElement): string {
    if (button.disabled) return "Button is disabled and non-interactive";
    if (!button.onclick && !button.addEventListener)
      return "Button has no click handler";
    return "Button appears interactive and should respond to clicks";
  }

  // Detect button issues
  private detectButtonIssues(button: HTMLButtonElement): string[] {
    const issues: string[] = [];

    if (button.disabled) {
      issues.push("Button is disabled");
    }

    if (!button.onclick) {
      issues.push("No click handler detected");
    }

    if (window.getComputedStyle(button).display === "none") {
      issues.push("Button is hidden");
    }

    return issues;
  }

  // Analyze input element
  private analyzeInputElement(input: HTMLInputElement, index: number): void {
    const elementId = input.id || `input_${index}`;

    const element: PageElement = {
      id: elementId,
      type: "textbox",
      currentState: this.determineInputState(input),
      expectedBehavior: "Accept text input and provide visual feedback",
      actualBehavior: this.getInputBehavior(input),
      userInteractions: this.getUserInteractionsForElement(elementId),
      isWorkingCorrectly: !input.disabled && !input.readOnly,
      issuesDetected: this.detectInputIssues(input),
      supposedToBe: "Text input field for user communication",
      userExpectation: "Should accept typing and show cursor focus",
    };

    this.pageElements.set(elementId, element);
  }

  // Determine input state
  private determineInputState(
    input: HTMLInputElement,
  ): PageElement["currentState"] {
    if (input.disabled) return "static";
    if (input.readOnly) return "static";
    if (document.activeElement === input) return "present";
    return "present";
  }

  // Get input behavior
  private getInputBehavior(input: HTMLInputElement): string {
    if (input.disabled) return "Input is disabled";
    if (input.readOnly) return "Input is read-only";
    return "Input accepts text and shows focus state";
  }

  // Detect input issues
  private detectInputIssues(input: HTMLInputElement): string[] {
    const issues: string[] = [];

    if (input.disabled) issues.push("Input is disabled");
    if (input.readOnly) issues.push("Input is read-only");

    return issues;
  }

  // Get user interactions for specific element
  private getUserInteractionsForElement(elementId: string): UserInteraction[] {
    return this.interactionHistory.filter(
      (interaction) =>
        interaction.elementId === elementId ||
        this.safeElementIdIncludes(interaction.elementId, elementId),
    );
  }

  // Update navigation analysis
  private async updateNavigationAnalysis(): Promise<void> {
    const currentUrl = window.location.href;
    const pageTitle = document.title;

    // Check if this is a 404 or error page
    const is404 = this.detect404Page();

    // Analyze content validity
    const contentAnalysis = this.analyzePageContent();

    this.navigationAnalysis = {
      currentPage: currentUrl,
      pageTitle,
      isExpectedPage: !is404 && contentAnalysis.isValid,
      is404,
      hasValidContent: contentAnalysis.isValid,
      contentMismatch: contentAnalysis.mismatchScore,
      userExpectedContent: contentAnalysis.expectedContent,
      actualContent: contentAnalysis.actualContent,
      navigationPath: this.getNavigationPath(),
      timeOnPage: this.getTimeOnPage(),
      bounceRisk: this.calculateBounceRisk(),
      redirectNeeded: is404 || contentAnalysis.mismatchScore > 70,
      suggestedActions: this.generateNavigationSuggestions(),
    };
  }

  // Detect 404 page
  private detect404Page(): boolean {
    const indicators = [
      document.title.includes("404"),
      document.title.includes("Not Found"),
      document.body.textContent?.includes("404") || false,
      document.body.textContent?.includes("Page not found") || false,
      window.location.pathname.includes("404"),
    ];

    return indicators.some((indicator) => indicator);
  }

  // Analyze page content
  private analyzePageContent(): {
    isValid: boolean;
    mismatchScore: number;
    expectedContent: string[];
    actualContent: string[];
  } {
    const expectedContent = [
      "canvas",
      "AI",
      "visualization",
      "controls",
      "buttons",
      "movement",
      "entities",
      "interactive",
      "monitoring",
    ];

    const actualContent = Array.from(document.querySelectorAll("*"))
      .map((el) => el.textContent?.toLowerCase() || "")
      .join(" ")
      .split(" ")
      .filter((word) => word.length > 3);

    const matches = expectedContent.filter((expected) =>
      actualContent.some((actual) => actual.includes(expected)),
    );

    const mismatchScore = Math.max(
      0,
      100 - (matches.length / expectedContent.length) * 100,
    );

    return {
      isValid: matches.length > expectedContent.length * 0.3,
      mismatchScore,
      expectedContent,
      actualContent: [...new Set(actualContent)].slice(0, 20),
    };
  }

  // Update conversation profile based on analysis
  private async updateConversationProfile(): Promise<void> {
    if (!this.currentProfile) return;

    // Update based on recent behavior
    const recentIntents = Array.from(this.detectedIntents.values()).slice(-5);

    // Adjust communication style based on intents
    if (recentIntents.filter((i) => i.type === "troubleshooting").length > 2) {
      this.currentProfile.communicationStyle = "frustrated";
      this.currentProfile.frustrationTriggers.push("repeated_failures");
    }

    // Update learning style based on interaction patterns
    const visualInteractions = this.interactionHistory.filter(
      (i) =>
        this.safeElementIdIncludes(i.elementId, "canvas") ||
        this.safeElementIdIncludes(i.elementId, "visual"),
    );

    if (visualInteractions.length > this.interactionHistory.length * 0.3) {
      this.currentProfile.learningStyle = "visual";
    }
  }

  // Set up real-time tracking
  private setupRealTimeTracking(): void {
    // Track clicks
    document.addEventListener("click", (e) => {
      this.recordInteraction("click", e.target as Element);
    });

    // Track typing
    document.addEventListener("keydown", (e) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        this.recordInteraction("type", e.target);
      }
    });

    // Track hover
    document.addEventListener("mouseover", (e) => {
      this.recordInteraction("hover", e.target as Element);
    });

    // Track focus
    document.addEventListener(
      "focus",
      (e) => {
        this.recordInteraction("focus", e.target as Element);
      },
      true,
    );
  }

  // Record user interaction
  private recordInteraction(
    type: UserInteraction["type"],
    target: Element,
  ): void {
    const elementId =
      target.id || target.className || target.tagName.toLowerCase();

    const interaction: UserInteraction = {
      type,
      timestamp: new Date().toISOString(),
      elementId,
      success: this.determineInteractionSuccess(type, target),
      duration: 0, // Would be calculated for longer interactions
      intention: this.inferIntention(type, target),
      context: this.getInteractionContext(target),
      frustrationIndicators: this.detectFrustrationIndicators(type, target),
    };

    this.interactionHistory.push(interaction);

    // Keep only recent interactions
    if (this.interactionHistory.length > 100) {
      this.interactionHistory = this.interactionHistory.slice(-100);
    }
  }

  // Determine if interaction was successful
  private determineInteractionSuccess(
    type: UserInteraction["type"],
    target: Element,
  ): boolean {
    if (type === "click") {
      const button = target as HTMLButtonElement;
      return (
        !button.disabled &&
        (button.onclick !== null || button.addEventListener !== undefined)
      );
    }
    return true; // Default to successful for other interactions
  }

  // Infer user intention from interaction
  private inferIntention(
    type: UserInteraction["type"],
    target: Element,
  ): string {
    const elementText = target.textContent?.toLowerCase() || "";
    const elementId = target.id.toLowerCase();

    if (elementText.includes("start") || elementText.includes("play")) {
      return "start_action";
    } else if (elementText.includes("stop") || elementText.includes("pause")) {
      return "stop_action";
    } else if (
      this.safeElementIdIncludes(elementId, "canvas") ||
      target.tagName === "CANVAS"
    ) {
      return "interact_with_visualization";
    } else if (target.tagName === "INPUT") {
      return "provide_input";
    } else if (target.tagName === "BUTTON") {
      return "execute_command";
    }

    return "explore_interface";
  }

  // Get interaction context
  private getInteractionContext(target: Element): string {
    const parent = target.parentElement;
    const siblings = parent ? Array.from(parent.children) : [];

    return `Element: ${target.tagName}, Parent: ${parent?.tagName || "none"}, Siblings: ${siblings.length}`;
  }

  // Detect frustration indicators
  private detectFrustrationIndicators(
    type: UserInteraction["type"],
    target: Element,
  ): string[] {
    const indicators: string[] = [];

    // Check for rapid repeated clicks
    const recentClicks = this.interactionHistory
      .filter((i) => i.type === "click" && i.elementId === target.id)
      .filter((i) => Date.now() - new Date(i.timestamp).getTime() < 5000);

    if (recentClicks.length > 3) {
      indicators.push("rapid_repeated_clicks");
    }

    // Check for unsuccessful interactions
    const recentFailed = this.interactionHistory
      .filter((i) => !i.success)
      .filter((i) => Date.now() - new Date(i.timestamp).getTime() < 10000);

    if (recentFailed.length > 2) {
      indicators.push("multiple_failed_interactions");
    }

    return indicators;
  }

  // Generate insights and conclusions
  private async generateInsights(): Promise<void> {
    // Update UI with current analysis
    this.updateAnalysisDisplay();
  }

  // Update UI displays
  private updateIntentDisplay(intent: UserIntent): void {
    const intentElement = document.getElementById("user-intent-analysis");
    if (intentElement) {
      intentElement.innerHTML = `
        <strong>${intent.type}:</strong> ${intent.description}
        <br><small>Confidence: ${Math.round(intent.confidence * 100)}%</small>
      `;
    }

    const confidenceElement = document.getElementById("intent-confidence");
    if (confidenceElement) {
      confidenceElement.textContent = `${Math.round(intent.confidence * 100)}%`;
    }
  }

  private updateAnalysisDisplay(): void {
    // Update conversation style
    const styleElement = document.getElementById("conv-style");
    if (styleElement && this.currentProfile) {
      styleElement.textContent = this.currentProfile.communicationStyle;
    }

    // Update navigation pattern
    const navElement = document.getElementById("nav-pattern");
    if (navElement && this.navigationAnalysis) {
      navElement.textContent = this.navigationAnalysis.isExpectedPage
        ? "On Track"
        : "May Need Help";
    }

    // Update feature status
    const featureElement = document.getElementById("feature-status-analysis");
    if (featureElement) {
      const workingElements = Array.from(this.pageElements.values()).filter(
        (e) => e.isWorkingCorrectly,
      );
      const totalElements = this.pageElements.size;
      featureElement.textContent = `${workingElements.length}/${totalElements} elements working correctly`;
    }
  }

  // Utility methods
  private getTimeOnPage(): number {
    return Date.now() - (performance.timing?.navigationStart || Date.now());
  }

  private getNavigationPath(): string[] {
    // Simplified - would track actual navigation in real implementation
    return [window.location.pathname];
  }

  private calculateBounceRisk(): number {
    const timeOnPage = this.getTimeOnPage();
    const interactionCount = this.interactionHistory.length;
    const frustrationIndicators = this.interactionHistory.filter(
      (i) => i.frustrationIndicators.length > 0,
    ).length;

    let risk = 50; // Base risk

    if (timeOnPage < 30000) risk += 20; // Less than 30 seconds
    if (interactionCount < 3) risk += 15; // Few interactions
    if (frustrationIndicators > 2) risk += 25; // Frustration detected

    return Math.min(100, risk);
  }

  private generateNavigationSuggestions(): string[] {
    const suggestions: string[] = [];

    if (this.navigationAnalysis?.is404) {
      suggestions.push("Redirect to main page");
      suggestions.push("Show relevant content suggestions");
    }

    if (
      this.navigationAnalysis?.contentMismatch &&
      this.navigationAnalysis.contentMismatch > 50
    ) {
      suggestions.push("Verify user reached intended page");
      suggestions.push("Provide navigation assistance");
    }

    const frustrationLevel = this.calculateBounceRisk();
    if (frustrationLevel > 70) {
      suggestions.push("Offer immediate assistance");
      suggestions.push("Provide alternative paths");
    }

    return suggestions;
  }

  // Initialize templates and patterns
  private initializeTemplates(): void {
    // Initialize with common intent patterns
    console.log("🧠 User Intent Analysis AI: Templates initialized");
  }

  // Start behavior tracking
  private startBehaviorTracking(): void {
    console.log("🧠 User Intent Analysis AI: Behavior tracking started");
  }

  // Save user profile
  private saveUserProfile(): void {
    if (this.currentProfile) {
      localStorage.setItem(
        "user_conversation_profile",
        JSON.stringify(this.currentProfile),
      );
    }
  }

  // Public API methods
  public getCurrentProfile(): ConversationProfile | null {
    return this.currentProfile;
  }

  public getDetectedIntents(): UserIntent[] {
    return Array.from(this.detectedIntents.values());
  }

  public getPageElementsAnalysis(): PageElement[] {
    return Array.from(this.pageElements.values());
  }

  public getNavigationAnalysis(): NavigationAnalysis | null {
    return this.navigationAnalysis;
  }

  public askQuestion(question: string): string {
    // AI-powered question answering
    const lowercaseQ = question.toLowerCase();

    if (lowercaseQ.includes("supposed to") || lowercaseQ.includes("should")) {
      const elements = Array.from(this.pageElements.values());
      const issues = elements.filter((e) => !e.isWorkingCorrectly);

      if (issues.length > 0) {
        return `Based on my analysis, ${issues.length} elements may not be working as expected: ${issues.map((i) => i.id).join(", ")}. ${issues[0]?.supposedToBe || "They should be interactive and responsive."} User expectations: ${issues[0]?.userExpectation || "Elements should provide immediate feedback."}`;
      } else {
        return "All analyzed elements appear to be working as expected based on their intended behavior.";
      }
    }

    if (
      lowercaseQ.includes("user") &&
      (lowercaseQ.includes("trying") || lowercaseQ.includes("want"))
    ) {
      const recentIntent = Array.from(this.detectedIntents.values()).pop();
      if (recentIntent) {
        return `Based on behavior analysis, the user appears to be ${recentIntent.description}. Predicted next actions: ${recentIntent.predictedNextActions.join(", ")}.`;
      }
    }

    return "I'm analyzing the user's behavior and can provide insights about their intentions, element functionality, and navigation patterns. Please ask specific questions about user intent or element behavior.";
  }
}

// Export singleton
export const userIntentAnalysisAI = UserIntentAnalysisAI.getInstance();

// Make available globally
if (typeof window !== "undefined") {
  (window as any).userIntentAnalysisAI = userIntentAnalysisAI;
}

export default UserIntentAnalysisAI;
