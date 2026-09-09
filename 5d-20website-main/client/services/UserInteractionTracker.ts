// User Interaction Tracking Service - Monitors user behavior and validates page elements
import AICoordinationEngine from "./AICoordinationEngine";
import AICentralCommand from "./AICentralCommand";
import { useUserAuth } from "../hooks/useUserAuth";

export interface UserAccountType {
  type: "admin" | "premium" | "standard" | "guest";
  tier: number;
  features: string[];
}

export interface PageElement {
  selector: string;
  name: string;
  purpose: string;
  function: string;
  required: boolean;
  accountTypes: UserAccountType["type"][];
  expectedAttributes?: Record<string, string>;
  validation?: {
    visible: boolean;
    enabled: boolean;
    clickable: boolean;
    hasCorrectStyling: boolean;
  };
}

export interface ScrollEvent {
  timestamp: string;
  position: { x: number; y: number };
  direction: "up" | "down" | "left" | "right";
  speed: number;
  elementsInView: string[];
  missingElements: string[];
  expectedElements: string[];
}

export interface ClickEvent {
  timestamp: string;
  element: string;
  expectedFunction: string;
  actualFunction: string;
  successful: boolean;
  position: { x: number; y: number };
  accountType: string;
}

export interface InteractionLog {
  id: string;
  userId?: string;
  accountType: UserAccountType["type"];
  page: string;
  startTime: string;
  endTime?: string;
  scrollEvents: ScrollEvent[];
  clickEvents: ClickEvent[];
  validationResults: ElementValidationResult[];
  performance: {
    pageLoadTime: number;
    elementCount: number;
    errorCount: number;
    missingElementCount: number;
  };
  aiNotes: string[];
  issuesDetected: string[];
}

export interface ElementValidationResult {
  element: PageElement;
  found: boolean;
  valid: boolean;
  issues: string[];
  recommendations: string[];
}

class UserInteractionTracker {
  private static instance: UserInteractionTracker;
  private currentLog: InteractionLog | null = null;
  private lastScrollPosition = { x: 0, y: 0 };
  private lastScrollTime = 0;
  private pageElements: Map<string, PageElement[]> = new Map();
  private isTracking = false;
  private screenshotInterval: NodeJS.Timeout | null = null;

  static getInstance(): UserInteractionTracker {
    if (!UserInteractionTracker.instance) {
      UserInteractionTracker.instance = new UserInteractionTracker();
    }
    return UserInteractionTracker.instance;
  }

  constructor() {
    this.initializePageElementMap();
    this.startTracking();
    console.log("👁️ User Interaction Tracker: Initialized");
  }

  private initializePageElementMap(): void {
    // Define page elements for different pages and account types

    // Home page elements
    this.pageElements.set("/", [
      {
        selector: "header",
        name: "Main Header",
        purpose: "Navigation and branding",
        function: "Provide site navigation and identity",
        required: true,
        accountTypes: ["admin", "premium", "standard", "guest"],
        validation: {
          visible: true,
          enabled: true,
          clickable: false,
          hasCorrectStyling: true,
        },
      },
      {
        selector: "nav",
        name: "Navigation Menu",
        purpose: "Site navigation",
        function: "Allow users to navigate between pages",
        required: true,
        accountTypes: ["admin", "premium", "standard", "guest"],
        validation: {
          visible: true,
          enabled: true,
          clickable: false,
          hasCorrectStyling: true,
        },
      },
      {
        selector:
          "[data-testid='cart-button'], .cart-button, button[aria-label*='Cart'], button[title*='Cart']",
        name: "Shopping Cart Button",
        purpose: "Access shopping cart",
        function: "Open cart modal or navigate to cart page",
        required: true,
        accountTypes: ["premium", "standard", "guest"],
        validation: {
          visible: true,
          enabled: true,
          clickable: true,
          hasCorrectStyling: true,
        },
      },
    ]);

    // Collections page elements
    this.pageElements.set("/collections", [
      {
        selector: "header",
        name: "Collections Header",
        purpose: "Page title and navigation",
        function: "Show page context and navigation options",
        required: true,
        accountTypes: ["admin", "premium", "standard", "guest"],
        validation: {
          visible: true,
          enabled: true,
          clickable: false,
          hasCorrectStyling: true,
        },
      },
      {
        selector: ".collection-card, [data-collection-id]",
        name: "Collection Cards",
        purpose: "Display collections",
        function: "Show available collections for browsing",
        required: true,
        accountTypes: ["admin", "premium", "standard", "guest"],
        validation: {
          visible: true,
          enabled: true,
          clickable: true,
          hasCorrectStyling: true,
        },
      },
      {
        selector:
          "button:contains('Settings'), [data-testid='settings-button']",
        name: "Settings Button",
        purpose: "Access user settings",
        function: "Navigate to settings page",
        required: true,
        accountTypes: ["admin", "premium", "standard"],
        validation: {
          visible: true,
          enabled: true,
          clickable: true,
          hasCorrectStyling: true,
        },
      },
      {
        selector: ".favorites-button, [data-item-id] button:contains('♥')",
        name: "Favorites Buttons",
        purpose: "Add/remove favorites",
        function: "Toggle favorite status for items",
        required: true,
        accountTypes: ["premium", "standard"],
        validation: {
          visible: true,
          enabled: true,
          clickable: true,
          hasCorrectStyling: true,
        },
      },
    ]);

    // Dashboard page elements (for signed-in users)
    this.pageElements.set("/dashboard", [
      {
        selector: ".user-profile, .profile-section",
        name: "User Profile Section",
        purpose: "Display user information",
        function: "Show user profile and account details",
        required: true,
        accountTypes: ["admin", "premium", "standard"],
        validation: {
          visible: true,
          enabled: true,
          clickable: false,
          hasCorrectStyling: true,
        },
      },
      {
        selector: "button:contains('Upload'), .upload-button",
        name: "Upload Button",
        purpose: "Upload new items",
        function: "Navigate to upload page or open upload modal",
        required: true,
        accountTypes: ["admin", "premium", "standard"],
        validation: {
          visible: true,
          enabled: true,
          clickable: true,
          hasCorrectStyling: true,
        },
      },
    ]);

    console.log(
      `🗺️ Initialized page element map for ${this.pageElements.size} pages`,
    );
  }

  startTracking(): void {
    if (this.isTracking) return;
    this.isTracking = true;

    // Start new interaction log
    this.startNewInteractionLog();

    // Add event listeners
    window.addEventListener("scroll", this.handleScroll.bind(this), {
      passive: true,
    });
    window.addEventListener("click", this.handleClick.bind(this), true);
    window.addEventListener("beforeunload", this.endInteractionLog.bind(this));

    // Validate page elements periodically
    setInterval(() => {
      this.validateCurrentPageElements();
    }, 10000); // Every 10 seconds

    // Take screenshots periodically
    this.startPeriodicScreenshots();

    console.log("📊 User interaction tracking started");
  }

  private startNewInteractionLog(): void {
    const accountType = this.getCurrentAccountType();

    this.currentLog = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountType,
      page: window.location.pathname,
      startTime: new Date().toISOString(),
      scrollEvents: [],
      clickEvents: [],
      validationResults: [],
      performance: {
        pageLoadTime: performance.now(),
        elementCount: document.querySelectorAll("*").length,
        errorCount: 0,
        missingElementCount: 0,
      },
      aiNotes: [],
      issuesDetected: [],
    };

    console.log(`📝 Started new interaction log for ${accountType} user`);
  }

  private getCurrentAccountType(): UserAccountType["type"] {
    // This would normally get from user context, but for now we'll determine based on page
    const userString = localStorage.getItem("user");
    if (!userString) return "guest";

    try {
      const user = JSON.parse(userString);
      if (user.isAdmin || user.email === "haynes.d1993@yahoo.com")
        return "admin";
      if (user.isPremium) return "premium";
      return "standard";
    } catch {
      return "guest";
    }
  }

  private handleScroll(): void {
    const now = Date.now();
    const currentPosition = { x: window.scrollX, y: window.scrollY };

    if (now - this.lastScrollTime < 100) return; // Throttle to every 100ms

    const deltaX = currentPosition.x - this.lastScrollPosition.x;
    const deltaY = currentPosition.y - this.lastScrollPosition.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const timeDelta = (now - this.lastScrollTime) / 1000;
    const speed = distance / timeDelta;

    let direction: ScrollEvent["direction"] = "down";
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? "right" : "left";
    } else {
      direction = deltaY > 0 ? "down" : "up";
    }

    // Get elements currently in view
    const elementsInView = this.getElementsInViewport();
    const expectedElements = this.getExpectedElementsForCurrentPage();
    const missingElements = expectedElements.filter(
      (expected) => !elementsInView.some((inView) => inView.includes(expected)),
    );

    const scrollEvent: ScrollEvent = {
      timestamp: new Date().toISOString(),
      position: currentPosition,
      direction,
      speed,
      elementsInView,
      missingElements,
      expectedElements,
    };

    if (this.currentLog) {
      this.currentLog.scrollEvents.push(scrollEvent);

      // Check for missing elements and create AI tasks
      if (missingElements.length > 0) {
        this.reportMissingElements(missingElements, currentPosition);
      }
    }

    this.lastScrollPosition = currentPosition;
    this.lastScrollTime = now;
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target) return;

    const element = this.getElementDescription(target);
    const expectedFunction = this.getExpectedFunction(target);
    const position = { x: event.clientX, y: event.clientY };

    const clickEvent: ClickEvent = {
      timestamp: new Date().toISOString(),
      element,
      expectedFunction,
      actualFunction: this.getActualFunction(target),
      successful: this.isClickSuccessful(target),
      position,
      accountType: this.getCurrentAccountType(),
    };

    if (this.currentLog) {
      this.currentLog.clickEvents.push(clickEvent);

      // Analyze click and report issues
      this.analyzeClick(clickEvent, target);
    }
  }

  private getElementsInViewport(): string[] {
    const elements: string[] = [];
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check key elements
    const selectors = [
      "header",
      "nav",
      "main",
      "footer",
      "button",
      "a",
      ".collection-card",
      ".product-card",
      "[data-testid]",
      "[data-collection-id]",
      "[data-item-id]",
    ];

    selectors.forEach((selector) => {
      const elementsList = document.querySelectorAll(selector);
      elementsList.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          rect.top < viewportHeight &&
          rect.bottom > 0 &&
          rect.left < viewportWidth &&
          rect.right > 0
        ) {
          elements.push(
            `${selector}:${element.textContent?.substring(0, 20) || "unnamed"}`,
          );
        }
      });
    });

    return elements;
  }

  private getExpectedElementsForCurrentPage(): string[] {
    const currentPage = window.location.pathname;
    const pageElements = this.pageElements.get(currentPage) || [];
    const accountType = this.getCurrentAccountType();

    return pageElements
      .filter((element) => element.accountTypes.includes(accountType))
      .map((element) => element.name);
  }

  private getElementDescription(element: HTMLElement): string {
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const classes = element.className
      ? `.${element.className.toString().split(" ").join(".")}`
      : "";
    const text = element.textContent?.substring(0, 30) || "";

    return `${tag}${id}${classes} "${text}"`;
  }

  private getExpectedFunction(element: HTMLElement): string {
    const currentPage = window.location.pathname;
    const pageElements = this.pageElements.get(currentPage) || [];

    for (const pageElement of pageElements) {
      try {
        if (element.matches(pageElement.selector)) {
          return pageElement.function;
        }
      } catch (error) {
        // Invalid selector, skip
      }
    }

    // Default function based on element type
    if (element.tagName === "BUTTON") return "Perform button action";
    if (element.tagName === "A") return "Navigate to link destination";
    if (element.onclick) return "Execute click handler";

    return "Unknown function";
  }

  private getActualFunction(element: HTMLElement): string {
    if (element.onclick) return "Has click handler";
    if (element.tagName === "A" && element.getAttribute("href"))
      return "Link navigation";
    if (element.tagName === "BUTTON") return "Button interaction";
    return "No defined function";
  }

  private isClickSuccessful(element: HTMLElement): boolean {
    return (
      !element.disabled &&
      window.getComputedStyle(element).pointerEvents !== "none" &&
      window.getComputedStyle(element).display !== "none"
    );
  }

  private async reportMissingElements(
    missingElements: string[],
    position: { x: number; y: number },
  ): Promise<void> {
    for (const missing of missingElements) {
      const issue = `User scrolling past expected ${missing} element that should be visible`;

      console.log(
        `⚠️ Missing element detected: ${missing} at position ${position.x}, ${position.y}`,
      );

      if (this.currentLog) {
        this.currentLog.issuesDetected.push(issue);
        this.currentLog.aiNotes.push(
          `AI Note: ${missing} missing during scroll at ${new Date().toLocaleTimeString()}`,
        );
      }

      // Create AI task for missing element
      try {
        await AICentralCommand.createTask({
          title: `Missing Element: ${missing}`,
          description: issue,
          severity: "medium",
          data: {
            issue: {
              type: "missing_element",
              severity: "medium",
              description: issue,
              proposedFix: `Ensure ${missing} is present and visible on page`,
              successProbability: 80,
            },
          },
        });
      } catch (error) {
        console.error("Failed to create task for missing element:", error);
      }
    }
  }

  private async analyzeClick(
    clickEvent: ClickEvent,
    target: HTMLElement,
  ): Promise<void> {
    const issues: string[] = [];

    // Check if click should have worked but didn't
    if (!clickEvent.successful) {
      issues.push(
        `Click failed on ${clickEvent.element} - element may be disabled or not interactive`,
      );
    }

    // Check if function matches expected
    if (
      clickEvent.expectedFunction !== clickEvent.actualFunction &&
      clickEvent.expectedFunction !== "Unknown function"
    ) {
      issues.push(
        `Function mismatch: Expected "${clickEvent.expectedFunction}" but got "${clickEvent.actualFunction}"`,
      );
    }

    // Report issues to AI
    for (const issue of issues) {
      console.log(`🔍 Click analysis issue: ${issue}`);

      if (this.currentLog) {
        this.currentLog.issuesDetected.push(issue);
        this.currentLog.aiNotes.push(
          `AI Note: Click issue detected at ${new Date().toLocaleTimeString()}: ${issue}`,
        );
      }

      // Create AI task for click issue
      try {
        await AICentralCommand.createTask({
          title: `Click Issue: ${target.tagName}`,
          description: issue,
          severity: "high",
          data: {
            issue: {
              type: "broken_functionality",
              severity: "high",
              description: issue,
              proposedFix: `Fix click functionality for ${clickEvent.element}`,
              successProbability: 75,
            },
          },
        });
      } catch (error) {
        console.error("Failed to create task for click issue:", error);
      }
    }
  }

  private async validateCurrentPageElements(): Promise<void> {
    const currentPage = window.location.pathname;
    const pageElements = this.pageElements.get(currentPage) || [];
    const accountType = this.getCurrentAccountType();

    const validationResults: ElementValidationResult[] = [];

    for (const pageElement of pageElements) {
      if (!pageElement.accountTypes.includes(accountType)) continue;

      try {
        const elements = document.querySelectorAll(pageElement.selector);
        const found = elements.length > 0;
        const issues: string[] = [];
        const recommendations: string[] = [];

        let valid = found;

        if (found && pageElement.validation) {
          const element = elements[0] as HTMLElement;
          const style = window.getComputedStyle(element);

          // Check visibility
          if (
            pageElement.validation.visible &&
            (style.display === "none" || style.visibility === "hidden")
          ) {
            valid = false;
            issues.push("Element is not visible");
            recommendations.push("Make element visible");
          }

          // Check if enabled
          if (pageElement.validation.enabled && element.disabled) {
            valid = false;
            issues.push("Element is disabled");
            recommendations.push("Enable element");
          }

          // Check styling
          if (pageElement.validation.hasCorrectStyling) {
            if (!style.color || !style.fontSize) {
              issues.push("Element may have styling issues");
              recommendations.push("Check element styling");
            }
          }
        }

        if (!found) {
          issues.push(`Required ${pageElement.name} not found`);
          recommendations.push(`Add ${pageElement.name} to the page`);
        }

        const result: ElementValidationResult = {
          element: pageElement,
          found,
          valid,
          issues,
          recommendations,
        };

        validationResults.push(result);

        // Report critical issues
        if (!valid && pageElement.required) {
          console.log(
            `❌ Critical element validation failed: ${pageElement.name}`,
          );

          if (this.currentLog) {
            this.currentLog.performance.errorCount++;
            if (!found) this.currentLog.performance.missingElementCount++;
            this.currentLog.aiNotes.push(
              `AI Note: Critical validation failure for ${pageElement.name}`,
            );
          }
        }
      } catch (error) {
        console.error(`Error validating element ${pageElement.name}:`, error);
      }
    }

    if (this.currentLog) {
      this.currentLog.validationResults = validationResults;
    }

    // Send validation results to AI
    await this.sendValidationToAI(validationResults);
  }

  private async sendValidationToAI(
    results: ElementValidationResult[],
  ): Promise<void> {
    const issues = results.filter((r) => !r.valid);

    if (issues.length > 0) {
      const summary = `Page validation found ${issues.length} issues: ${issues.map((i) => i.element.name).join(", ")}`;

      console.log(`📊 Validation summary: ${summary}`);

      // Send to AI Central Command
      try {
        await AICentralCommand.sendMainAIUpdate({
          type: "error-detected",
          message: summary,
          priority: "medium",
          data: { validationResults: results },
          source: "interaction-tracker",
        });
      } catch (error) {
        console.error("Failed to send validation to AI:", error);
      }
    }
  }

  private startPeriodicScreenshots(): void {
    if (this.screenshotInterval) return;

    this.screenshotInterval = setInterval(async () => {
      try {
        await AICentralCommand.forceScreenshotAnalysis();

        if (this.currentLog) {
          this.currentLog.aiNotes.push(
            `AI Note: Screenshot taken at ${new Date().toLocaleTimeString()}`,
          );
        }
      } catch (error) {
        console.error("Screenshot capture failed:", error);
      }
    }, 30000); // Every 30 seconds

    console.log("📸 Periodic screenshots started");
  }

  endInteractionLog(): void {
    if (this.currentLog) {
      this.currentLog.endTime = new Date().toISOString();
      this.currentLog.performance.pageLoadTime =
        performance.now() - this.currentLog.performance.pageLoadTime;

      // Save to localStorage and send to AI
      try {
        const logs = JSON.parse(
          localStorage.getItem("interactionLogs") || "[]",
        );
        logs.push(this.currentLog);
        // Keep only last 10 logs
        if (logs.length > 10) logs.splice(0, logs.length - 10);
        localStorage.setItem("interactionLogs", JSON.stringify(logs));

        console.log(
          `📋 Interaction log completed: ${this.currentLog.scrollEvents.length} scroll events, ${this.currentLog.clickEvents.length} click events`,
        );
      } catch (error) {
        console.error("Failed to save interaction log:", error);
      }

      this.currentLog = null;
    }
  }

  // Public interface
  getCurrentLog(): InteractionLog | null {
    return this.currentLog;
  }

  getInteractionHistory(): InteractionLog[] {
    try {
      return JSON.parse(localStorage.getItem("interactionLogs") || "[]");
    } catch {
      return [];
    }
  }

  createManualTask(
    description: string,
    priority: "low" | "medium" | "high" = "medium",
  ): void {
    AICentralCommand.createTask({
      title: "Manual User Report",
      description,
      severity: priority,
      data: {
        issue: {
          type: "user_report",
          severity: priority,
          description,
          proposedFix: "Investigate user-reported issue",
          successProbability: 60,
        },
      },
    });
  }

  stopTracking(): void {
    this.isTracking = false;
    this.endInteractionLog();

    window.removeEventListener("scroll", this.handleScroll.bind(this));
    window.removeEventListener("click", this.handleClick.bind(this));
    window.removeEventListener(
      "beforeunload",
      this.endInteractionLog.bind(this),
    );

    if (this.screenshotInterval) {
      clearInterval(this.screenshotInterval);
      this.screenshotInterval = null;
    }

    console.log("📊 User interaction tracking stopped");
  }
}

export default UserInteractionTracker.getInstance();
