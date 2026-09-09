// AI User Input Prompt Service - Collects user feedback when issues are detected
export interface UserInputPrompt {
  id: string;
  triggeredBy: string; // Element that triggered the prompt
  element: string;
  elementId?: string;
  page: string;
  timestamp: string;
  userInput?: string;
  issueType?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "collecting" | "submitted" | "processing" | "resolved";
  context: {
    expectedAction: string;
    actualResult: string;
    userAgent: string;
    viewport: { width: number; height: number };
    additionalData?: any;
  };
}

export interface PromptConfig {
  show: boolean;
  element: HTMLElement;
  prompt: UserInputPrompt;
  onSubmit: (input: string) => void;
  onSkip: () => void;
}

class AIUserInputPromptService {
  private prompts: UserInputPrompt[] = [];
  private currentPrompt: PromptConfig | null = null;
  private promptElement: HTMLElement | null = null;
  private listeners: Set<(config: PromptConfig | null) => void> = new Set();

  constructor() {
    this.loadStoredPrompts();
    this.setupGlobalClickListener();
  }

  // Setup global click listener to detect potential issues
  private setupGlobalClickListener(): void {
    document.addEventListener("click", this.handleGlobalClick.bind(this), true);
  }

  private handleGlobalClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedElement = this.getElementInfo(target);

    // Detect problematic elements that might need user input
    const problematicSelectors = [
      "button[disabled]",
      ".message-button",
      ".chat-button",
      ".send-button",
      ".submit-button",
      ".apply-fix",
      ".ai-chat",
      'form button[type="submit"]',
      '[data-testid*="message"]',
      '[data-testid*="chat"]',
      '[data-testid*="send"]',
    ];

    const isProblematicElement = problematicSelectors.some((selector) => {
      try {
        return target.matches(selector) || target.closest(selector);
      } catch {
        return false;
      }
    });

    if (isProblematicElement) {
      // Wait a moment to see if the expected action occurs
      setTimeout(() => {
        this.checkForExpectedOutcome(target, clickedElement);
      }, 2000);
    }
  }

  private checkForExpectedOutcome(target: HTMLElement, elementInfo: any): void {
    const outcomes = this.detectOutcomes(target, elementInfo);

    if (outcomes.length > 0) {
      // Something went wrong, prompt user
      this.createPrompt(target, elementInfo, outcomes);
    }
  }

  private detectOutcomes(target: HTMLElement, elementInfo: any): string[] {
    const issues: string[] = [];

    // Check for common issues
    if (this.isMessageButton(target)) {
      if (!this.detectMessageSent()) {
        issues.push("Message not sending");
      }
    }

    if (this.isFormSubmitButton(target)) {
      if (!this.detectFormSubmission()) {
        issues.push("Form not submitting");
      }
    }

    if (this.isNavigationButton(target)) {
      if (!this.detectNavigation()) {
        issues.push("Navigation not working");
      }
    }

    if (this.isApplyFixButton(target)) {
      if (!this.detectFixApplied()) {
        issues.push("Fix not applied");
      }
    }

    // Check for JavaScript errors in the last 3 seconds
    const recentErrors = this.getRecentJSErrors();
    if (recentErrors.length > 0) {
      issues.push("JavaScript errors detected");
    }

    // Check for disabled state
    if (target.disabled || target.getAttribute("aria-disabled") === "true") {
      issues.push("Button is disabled");
    }

    return issues;
  }

  private isMessageButton(element: HTMLElement): boolean {
    const messageSelectors = [
      ".message-button",
      ".chat-button",
      ".send-button",
      '[data-testid*="message"]',
      '[data-testid*="chat"]',
      '[data-testid*="send"]',
    ];
    return messageSelectors.some((selector) => {
      try {
        return element.matches(selector) || element.closest(selector);
      } catch {
        return false;
      }
    });
  }

  private isFormSubmitButton(element: HTMLElement): boolean {
    return element.type === "submit" || element.closest("form") !== null;
  }

  private isNavigationButton(element: HTMLElement): boolean {
    return (
      element.tagName === "A" ||
      element.closest("a") !== null ||
      element.getAttribute("role") === "button"
    );
  }

  private isApplyFixButton(element: HTMLElement): boolean {
    const text = element.textContent?.toLowerCase() || "";
    return (
      text.includes("apply fix") ||
      text.includes("fix") ||
      element.classList.contains("apply-fix")
    );
  }

  private detectMessageSent(): boolean {
    // Check for common message sent indicators
    const indicators = [
      ".message-sent",
      ".chat-sent",
      ".message-success",
      '[data-status="sent"]',
      '[data-state="sent"]',
    ];
    return indicators.some(
      (selector) => document.querySelector(selector) !== null,
    );
  }

  private detectFormSubmission(): boolean {
    // Check for form submission indicators
    const indicators = [
      ".form-success",
      ".submission-success",
      ".thank-you",
      '[data-submitted="true"]',
      ".loading",
      ".spinner",
    ];
    return indicators.some(
      (selector) => document.querySelector(selector) !== null,
    );
  }

  private detectNavigation(): boolean {
    // Check if URL changed or loading indicator appeared
    const currentPath = window.location.pathname;
    const loadingIndicators = [".loading", ".spinner", '[data-loading="true"]'];
    return loadingIndicators.some(
      (selector) => document.querySelector(selector) !== null,
    );
  }

  private detectFixApplied(): boolean {
    // Check for fix application indicators
    const indicators = [
      ".fix-applied",
      ".success",
      ".updated",
      '[data-fixed="true"]',
    ];
    return indicators.some(
      (selector) => document.querySelector(selector) !== null,
    );
  }

  private getRecentJSErrors(): any[] {
    // This would integrate with the error tracking system
    try {
      const errorLog = localStorage.getItem("jsErrors");
      if (errorLog) {
        const errors = JSON.parse(errorLog);
        const threeSecondsAgo = Date.now() - 3000;
        return errors.filter((error: any) => error.timestamp > threeSecondsAgo);
      }
    } catch {}
    return [];
  }

  private createPrompt(
    target: HTMLElement,
    elementInfo: any,
    detectedIssues: string[],
  ): void {
    const prompt: UserInputPrompt = {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggeredBy: elementInfo.description,
      element: elementInfo.tagName,
      elementId: elementInfo.id,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      issueType: detectedIssues[0],
      priority: this.calculatePriority(detectedIssues),
      status: "pending",
      context: {
        expectedAction: this.getExpectedAction(target),
        actualResult: detectedIssues.join(", "),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        additionalData: {
          detectedIssues,
          elementText: target.textContent?.trim(),
          elementClasses: Array.from(target.classList),
          elementAttributes: this.getElementAttributes(target),
        },
      },
    };

    this.prompts.push(prompt);
    this.showPrompt(prompt, target);
  }

  private calculatePriority(
    issues: string[],
  ): "low" | "medium" | "high" | "critical" {
    if (
      issues.some((issue) => issue.includes("error") || issue.includes("crash"))
    ) {
      return "critical";
    }
    if (
      issues.some(
        (issue) =>
          issue.includes("not sending") || issue.includes("not working"),
      )
    ) {
      return "high";
    }
    if (
      issues.some(
        (issue) => issue.includes("disabled") || issue.includes("slow"),
      )
    ) {
      return "medium";
    }
    return "low";
  }

  private getExpectedAction(element: HTMLElement): string {
    if (this.isMessageButton(element)) return "Send message";
    if (this.isFormSubmitButton(element)) return "Submit form";
    if (this.isNavigationButton(element)) return "Navigate to page";
    if (this.isApplyFixButton(element)) return "Apply fix";
    return "Perform action";
  }

  private showPrompt(
    prompt: UserInputPrompt,
    targetElement: HTMLElement,
  ): void {
    // Create prompt UI
    this.createPromptUI(prompt, targetElement);
  }

  private createPromptUI(
    prompt: UserInputPrompt,
    targetElement: HTMLElement,
  ): void {
    // Remove any existing prompt
    this.hideCurrentPrompt();

    // Create prompt container
    const promptContainer = document.createElement("div");
    promptContainer.className = "ai-user-prompt-overlay";
    promptContainer.innerHTML = `
      <div class="ai-user-prompt-modal">
        <div class="ai-user-prompt-header">
          <h3>🤖 AI Assistant: Help Us Understand</h3>
          <button class="ai-user-prompt-close">×</button>
        </div>
        <div class="ai-user-prompt-content">
          <p><strong>We detected:</strong> ${prompt.context.actualResult}</p>
          <p><strong>Expected:</strong> ${prompt.context.expectedAction}</p>
          <p><strong>What happened when you clicked this?</strong></p>
          <textarea
            class="ai-user-prompt-input"
            placeholder="Describe what happened or what you expected to happen...
Examples:
• 'Nothing happened when I clicked Send'
• 'The message didn't go through'
• 'Button stayed disabled'
• 'Page didn't load'
• 'Got an error message'"
            rows="4"
          ></textarea>
          <div class="ai-user-prompt-actions">
            <button class="ai-user-prompt-submit">Submit & Fix</button>
            <button class="ai-user-prompt-skip">Skip</button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement("style");
    styles.textContent = `
      .ai-user-prompt-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .ai-user-prompt-modal {
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
      }
      .ai-user-prompt-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px 0;
        border-bottom: 1px solid #e5e7eb;
        margin-bottom: 20px;
      }
      .ai-user-prompt-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
      }
      .ai-user-prompt-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ai-user-prompt-content {
        padding: 0 24px 24px;
      }
      .ai-user-prompt-content p {
        margin: 0 0 12px;
        color: #374151;
        font-size: 14px;
      }
      .ai-user-prompt-input {
        width: 100%;
        padding: 12px;
        border: 2px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        margin: 16px 0;
      }
      .ai-user-prompt-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .ai-user-prompt-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      .ai-user-prompt-submit, .ai-user-prompt-skip {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .ai-user-prompt-submit {
        background: #3b82f6;
        color: white;
      }
      .ai-user-prompt-submit:hover {
        background: #2563eb;
      }
      .ai-user-prompt-skip {
        background: #f3f4f6;
        color: #374151;
      }
      .ai-user-prompt-skip:hover {
        background: #e5e7eb;
      }
    `;
    document.head.appendChild(styles);

    // Add event listeners
    const input = promptContainer.querySelector(
      ".ai-user-prompt-input",
    ) as HTMLTextAreaElement;
    const submitBtn = promptContainer.querySelector(
      ".ai-user-prompt-submit",
    ) as HTMLButtonElement;
    const skipBtn = promptContainer.querySelector(
      ".ai-user-prompt-skip",
    ) as HTMLButtonElement;
    const closeBtn = promptContainer.querySelector(
      ".ai-user-prompt-close",
    ) as HTMLButtonElement;

    const handleSubmit = () => {
      const userInput = input.value.trim();
      if (userInput) {
        prompt.userInput = userInput;
        prompt.status = "submitted";
        this.submitPrompt(prompt);
      }
      this.hideCurrentPrompt();
    };

    const handleSkip = () => {
      prompt.status = "pending";
      this.hideCurrentPrompt();
    };

    submitBtn.addEventListener("click", handleSubmit);
    skipBtn.addEventListener("click", handleSkip);
    closeBtn.addEventListener("click", handleSkip);

    // Submit on Enter (with Ctrl/Cmd)
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
    });

    // Add to DOM
    document.body.appendChild(promptContainer);
    this.promptElement = promptContainer;

    // Focus input
    setTimeout(() => input.focus(), 100);

    // Store current prompt config
    this.currentPrompt = {
      show: true,
      element: targetElement,
      prompt,
      onSubmit: handleSubmit,
      onSkip: handleSkip,
    };

    // Notify listeners
    this.notifyListeners();
  }

  private hideCurrentPrompt(): void {
    if (this.promptElement) {
      this.promptElement.remove();
      this.promptElement = null;
    }
    this.currentPrompt = null;
    this.notifyListeners();
  }

  private submitPrompt(prompt: UserInputPrompt): void {
    console.log("🤖 AI User Input Submitted:", prompt);

    // Send to AI orchestration system
    this.sendToAIOrchestrator(prompt);

    // Save prompt
    this.savePrompts();
  }

  private async sendToAIOrchestrator(prompt: UserInputPrompt): Promise<void> {
    try {
      // Import and use AI Orchestrator
      const { default: AIOrchestrator } = await import("./AIOrchestrator");
      await AIOrchestrator.processUserInput(prompt);
    } catch (error) {
      console.error("Failed to send to AI Orchestrator:", error);
    }
  }

  private getElementInfo(element: HTMLElement): any {
    return {
      tagName: element.tagName.toLowerCase(),
      id: element.id || "",
      classes: Array.from(element.classList),
      text: element.textContent?.trim() || "",
      description: this.getElementDescription(element),
    };
  }

  private getElementDescription(element: HTMLElement): string {
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const classes = element.className
      ? `.${element.className.toString().split(" ").join(".")}`
      : "";
    const text = element.textContent?.trim()?.slice(0, 30) || "";
    return `${tag}${id}${classes} "${text}"`;
  }

  private getElementAttributes(element: HTMLElement): Record<string, string> {
    const attrs: Record<string, string> = {};
    for (const attr of element.attributes) {
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  private savePrompts(): void {
    try {
      localStorage.setItem(
        "aiUserPrompts",
        JSON.stringify(this.prompts.slice(-100)),
      );
    } catch (error) {
      console.warn("Failed to save user prompts:", error);
    }
  }

  private loadStoredPrompts(): void {
    try {
      const stored = localStorage.getItem("aiUserPrompts");
      if (stored) {
        this.prompts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load stored prompts:", error);
      this.prompts = [];
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this.currentPrompt);
      } catch (error) {
        console.error("Error notifying prompt listener:", error);
      }
    });
  }

  // Public methods
  public subscribe(
    callback: (config: PromptConfig | null) => void,
  ): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  public getPrompts(): UserInputPrompt[] {
    return [...this.prompts];
  }

  public getCurrentPrompt(): PromptConfig | null {
    return this.currentPrompt;
  }

  public triggerPrompt(element: HTMLElement, issueDescription: string): void {
    const elementInfo = this.getElementInfo(element);
    this.createPrompt(element, elementInfo, [issueDescription]);
  }

  public dismiss(): void {
    this.hideCurrentPrompt();
  }
}

export default new AIUserInputPromptService();
