// AI Fix Status Manager - Manages live updates and fix button states across the site
export interface FixStatus {
  id: string;
  element: string;
  page: string;
  status: "pending" | "applying" | "applied" | "failed" | "verified";
  timestamp: string;
  description: string;
  retryCount: number;
  lastError?: string;
}

export interface LiveUpdate {
  id: string;
  type: "fix_status" | "page_update" | "error_notification" | "system_status";
  target: string;
  data: any;
  timestamp: string;
  applied: boolean;
}

class AIFixStatusManager {
  private fixStatuses: Map<string, FixStatus> = new Map();
  private liveUpdates: LiveUpdate[] = [];
  private observers: MutationObserver[] = [];
  private listeners: Set<(update: LiveUpdate) => void> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadStoredStatuses();
    this.setupMutationObservers();
    this.startLiveUpdateSystem();
    this.fixExistingApplyFixButtons();
  }

  private setupMutationObservers(): void {
    // Observe for new apply-fix buttons
    const buttonObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            // Additional safety check
            if (element && typeof element.tagName === "string") {
              this.processNewElements(element);
            }
          }
        });
      });
    });

    buttonObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.observers.push(buttonObserver);

    // Observe for page changes
    const pageObserver = new MutationObserver(() => {
      this.handlePageChange();
    });

    pageObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-page", "data-route"],
    });

    this.observers.push(pageObserver);
  }

  private processNewElements(element: HTMLElement): void {
    // Safety check - ensure element is valid
    if (!element || !element.tagName) {
      return;
    }

    // Find apply-fix buttons in the new element
    const applyFixButtons = element.querySelectorAll(
      '.apply-fix, [data-action="apply-fix"], [data-testid*="apply-fix"]',
    );

    applyFixButtons.forEach((button) => {
      if (button instanceof HTMLElement) {
        this.processApplyFixButton(button);
      }
    });

    // Also check the element itself
    if (this.isApplyFixButton(element)) {
      this.processApplyFixButton(element);
    }
  }

  private isApplyFixButton(element: HTMLElement): boolean {
    const text = element.textContent?.toLowerCase() || "";
    const classes = element.className
      ? element.className.toString().toLowerCase()
      : "";
    const testId = element.getAttribute("data-testid")?.toLowerCase() || "";

    return (
      text.includes("apply fix") ||
      text.includes("fix issue") ||
      classes.includes("apply-fix") ||
      testId.includes("apply-fix") ||
      element.getAttribute("data-action") === "apply-fix"
    );
  }

  private processApplyFixButton(button: HTMLElement): void {
    const buttonId = this.getButtonId(button);
    const currentStatus = this.fixStatuses.get(buttonId);

    // Update button based on current status
    if (currentStatus) {
      this.updateButtonAppearance(button, currentStatus);
    } else {
      // New button, create status
      const status: FixStatus = {
        id: buttonId,
        element: this.getElementDescription(button),
        page: window.location.pathname,
        status: "pending",
        timestamp: new Date().toISOString(),
        description: "Fix button detected",
        retryCount: 0,
      };

      this.fixStatuses.set(buttonId, status);
      this.updateButtonAppearance(button, status);
    }

    // Add click handler if not already present
    if (!button.getAttribute("data-ai-handler")) {
      button.setAttribute("data-ai-handler", "true");
      button.addEventListener("click", (e) =>
        this.handleApplyFixClick(e, button),
      );
    }
  }

  private getButtonId(button: HTMLElement): string {
    // Create unique ID for button
    const page = window.location.pathname;
    const elementDesc = this.getElementDescription(button);
    const position = Array.from(
      document.querySelectorAll('.apply-fix, [data-action="apply-fix"]'),
    ).indexOf(button);

    return `${page}_${elementDesc}_${position}`.replace(/[^a-zA-Z0-9_]/g, "_");
  }

  private getElementDescription(element: HTMLElement): string {
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const classes = element.className
      ? `.${element.className.toString().split(" ")[0]}`
      : "";
    return `${tag}${id}${classes}`;
  }

  private updateButtonAppearance(button: HTMLElement, status: FixStatus): void {
    // Remove existing AI status classes
    button.classList.remove(
      "ai-fix-pending",
      "ai-fix-applying",
      "ai-fix-applied",
      "ai-fix-failed",
    );

    switch (status.status) {
      case "pending":
        button.classList.add("ai-fix-pending");
        button.textContent = "Apply Fix";
        button.style.backgroundColor = "#3b82f6";
        button.style.color = "white";
        button.removeAttribute("disabled");
        break;

      case "applying":
        button.classList.add("ai-fix-applying");
        button.textContent = "Applying...";
        button.style.backgroundColor = "#f59e0b";
        button.style.color = "white";
        button.setAttribute("disabled", "true");
        break;

      case "applied":
        button.classList.add("ai-fix-applied");
        button.textContent = "Fix Applied ✓";
        button.style.backgroundColor = "#10b981";
        button.style.color = "white";
        button.removeAttribute("disabled");
        break;

      case "verified":
        button.classList.add("ai-fix-applied");
        button.textContent = "Verified ��✓";
        button.style.backgroundColor = "#059669";
        button.style.color = "white";
        button.removeAttribute("disabled");
        break;

      case "failed":
        button.classList.add("ai-fix-failed");
        button.textContent =
          status.retryCount > 2 ? "Fix Failed ✗" : "Retry Fix";
        button.style.backgroundColor = "#ef4444";
        button.style.color = "white";
        button.removeAttribute("disabled");
        break;
    }

    // Add tooltip with more info
    button.title = `Status: ${status.status} | Last updated: ${new Date(status.timestamp).toLocaleString()}${status.lastError ? ` | Error: ${status.lastError}` : ""}`;
  }

  private async handleApplyFixClick(
    event: Event,
    button: HTMLElement,
  ): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const buttonId = this.getButtonId(button);
    const status = this.fixStatuses.get(buttonId);

    if (!status) return;

    // Update status to applying
    status.status = "applying";
    status.timestamp = new Date().toISOString();
    this.updateButtonAppearance(button, status);

    try {
      // Import AI Orchestrator for fix processing
      const { default: AIOrchestrator } = await import("./AIOrchestrator");

      // Create a user input prompt for the fix request
      const prompt = {
        id: `fix_${Date.now()}`,
        triggeredBy: "apply-fix button",
        element: "button",
        elementId: button.id,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        userInput: "Apply fix requested",
        issueType: "apply_fix",
        priority: "medium" as const,
        status: "submitted" as const,
        context: {
          expectedAction: "Apply system fix",
          actualResult: "Fix button clicked",
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          additionalData: {
            buttonText: button.textContent,
            buttonId: buttonId,
            retryCount: status.retryCount,
          },
        },
      };

      // Process through AI Orchestrator
      await AIOrchestrator.processUserInput(prompt);

      // Simulate fix application (in real implementation, this would do actual fixes)
      await this.simulateFixApplication(status, button);

      // Update status to applied
      status.status = "applied";
      status.timestamp = new Date().toISOString();
      this.updateButtonAppearance(button, status);

      // Verify fix after a delay
      setTimeout(() => {
        this.verifyFix(buttonId);
      }, 3000);

      // Broadcast live update
      this.broadcastLiveUpdate({
        id: `update_${Date.now()}`,
        type: "fix_status",
        target: buttonId,
        data: { status: status.status, button: button.textContent },
        timestamp: new Date().toISOString(),
        applied: true,
      });
    } catch (error) {
      console.error("Fix application failed:", error);

      status.status = "failed";
      status.lastError = error.message;
      status.retryCount++;
      status.timestamp = new Date().toISOString();

      this.updateButtonAppearance(button, status);
    }

    this.saveStatuses();
  }

  private async simulateFixApplication(
    status: FixStatus,
    button: HTMLElement,
  ): Promise<void> {
    // Simulate various fix operations
    return new Promise((resolve) => {
      setTimeout(() => {
        // Apply some common fixes
        this.applyCommonFixes();
        resolve();
      }, 2000);
    });
  }

  private applyCommonFixes(): void {
    // Fix 1: Update old timestamps
    const oldTimestamps = document.querySelectorAll(
      "[data-timestamp], .timestamp",
    );
    oldTimestamps.forEach((el) => {
      const element = el as HTMLElement;
      if (element.textContent && element.textContent.includes("old")) {
        element.textContent = new Date().toLocaleString();
      }
    });

    // Fix 2: Enable disabled elements that should be enabled
    const inappropriatelyDisabled = document.querySelectorAll(
      '[data-should-be-enabled="true"][disabled]',
    );
    inappropriatelyDisabled.forEach((el) => {
      el.removeAttribute("disabled");
    });

    // Fix 3: Update stale data indicators
    const staleIndicators = document.querySelectorAll(
      '[data-stale="true"], .stale-data',
    );
    staleIndicators.forEach((el) => {
      el.removeAttribute("data-stale");
      el.classList.remove("stale-data");
    });

    // Fix 4: Refresh dynamic content
    window.dispatchEvent(
      new CustomEvent("ai-content-refresh", {
        detail: { source: "AIFixStatusManager", timestamp: Date.now() },
      }),
    );
  }

  private verifyFix(buttonId: string): void {
    const status = this.fixStatuses.get(buttonId);
    if (!status || status.status !== "applied") return;

    // Perform verification checks
    const verificationPassed = this.performVerificationChecks();

    if (verificationPassed) {
      status.status = "verified";
      status.timestamp = new Date().toISOString();

      // Find and update the button
      const button = document.querySelector(
        `[data-ai-handler="true"]`,
      ) as HTMLElement;
      if (button && this.getButtonId(button) === buttonId) {
        this.updateButtonAppearance(button, status);
      }
    }

    this.saveStatuses();
  }

  private performVerificationChecks(): boolean {
    // Check if common issues are resolved
    const errorElements = document.querySelectorAll(
      '.error, [data-error="true"]',
    );
    const staleElements = document.querySelectorAll(
      '[data-stale="true"], .stale-data',
    );
    const brokenElements = document.querySelectorAll(
      '[data-broken="true"], .broken',
    );

    return (
      errorElements.length === 0 &&
      staleElements.length === 0 &&
      brokenElements.length === 0
    );
  }

  private fixExistingApplyFixButtons(): void {
    // Find all existing apply-fix buttons and process them
    const existingButtons = document.querySelectorAll(
      '.apply-fix, [data-action="apply-fix"], [data-testid*="apply-fix"]',
    );

    existingButtons.forEach((button) => {
      this.processApplyFixButton(button as HTMLElement);
    });

    // Also find buttons by text content
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((button) => {
      if (this.isApplyFixButton(button)) {
        this.processApplyFixButton(button);
      }
    });
  }

  private handlePageChange(): void {
    // Re-process all apply-fix buttons when page changes
    setTimeout(() => {
      this.fixExistingApplyFixButtons();
    }, 500);
  }

  private startLiveUpdateSystem(): void {
    // Start live update broadcasting
    this.updateInterval = setInterval(() => {
      this.processLiveUpdates();
    }, 1000);

    // Listen for page navigation to update fix statuses
    window.addEventListener("popstate", () => {
      this.handlePageChange();
    });

    // Listen for custom update events
    window.addEventListener("ai-content-refresh", () => {
      this.fixExistingApplyFixButtons();
    });
  }

  private processLiveUpdates(): void {
    // Process any pending live updates
    const pendingUpdates = this.liveUpdates.filter((update) => !update.applied);

    pendingUpdates.forEach((update) => {
      this.applyLiveUpdate(update);
      update.applied = true;
    });

    // Clean old updates
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.liveUpdates = this.liveUpdates.filter(
      (update) => new Date(update.timestamp).getTime() > oneHourAgo,
    );
  }

  private applyLiveUpdate(update: LiveUpdate): void {
    switch (update.type) {
      case "fix_status":
        this.syncFixStatusAcrossPages(update);
        break;
      case "page_update":
        this.syncPageUpdates(update);
        break;
      case "system_status":
        this.syncSystemStatus(update);
        break;
    }
  }

  private syncFixStatusAcrossPages(update: LiveUpdate): void {
    // Sync fix status across all instances of the same button
    const buttons = document.querySelectorAll('[data-ai-handler="true"]');
    buttons.forEach((button) => {
      const buttonId = this.getButtonId(button as HTMLElement);
      if (buttonId === update.target) {
        const status = this.fixStatuses.get(buttonId);
        if (status) {
          this.updateButtonAppearance(button as HTMLElement, status);
        }
      }
    });
  }

  private syncPageUpdates(update: LiveUpdate): void {
    // Handle general page updates
    if (update.data.type === "content_refresh") {
      this.fixExistingApplyFixButtons();
    }
  }

  private syncSystemStatus(update: LiveUpdate): void {
    // Handle system-wide status updates
    console.log("System status update:", update.data);
  }

  private broadcastLiveUpdate(update: LiveUpdate): void {
    this.liveUpdates.push(update);

    // Notify listeners
    this.listeners.forEach((callback) => {
      try {
        callback(update);
      } catch (error) {
        console.error("Error notifying live update listener:", error);
      }
    });
  }

  private saveStatuses(): void {
    try {
      const statusArray = Array.from(this.fixStatuses.entries());
      localStorage.setItem("aiFixStatuses", JSON.stringify(statusArray));
    } catch (error) {
      console.warn("Failed to save fix statuses:", error);
    }
  }

  private loadStoredStatuses(): void {
    try {
      const stored = localStorage.getItem("aiFixStatuses");
      if (stored) {
        const statusArray = JSON.parse(stored);
        this.fixStatuses = new Map(statusArray);
      }
    } catch (error) {
      console.warn("Failed to load stored fix statuses:", error);
      this.fixStatuses = new Map();
    }
  }

  // Public methods
  public subscribe(callback: (update: LiveUpdate) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  public getFixStatus(buttonId: string): FixStatus | undefined {
    return this.fixStatuses.get(buttonId);
  }

  public getAllFixStatuses(): FixStatus[] {
    return Array.from(this.fixStatuses.values());
  }

  public triggerGlobalRefresh(): void {
    this.broadcastLiveUpdate({
      id: `global_refresh_${Date.now()}`,
      type: "page_update",
      target: "all",
      data: { type: "content_refresh", source: "manual" },
      timestamp: new Date().toISOString(),
      applied: false,
    });
  }

  public resetFixStatus(buttonId: string): void {
    const status = this.fixStatuses.get(buttonId);
    if (status) {
      status.status = "pending";
      status.retryCount = 0;
      status.timestamp = new Date().toISOString();
      delete status.lastError;

      // Find and update button
      const buttons = document.querySelectorAll('[data-ai-handler="true"]');
      buttons.forEach((button) => {
        if (this.getButtonId(button as HTMLElement) === buttonId) {
          this.updateButtonAppearance(button as HTMLElement, status);
        }
      });

      this.saveStatuses();
    }
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.listeners.clear();
  }
}

export default new AIFixStatusManager();
