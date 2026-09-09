interface ButtonMapping {
  id: string;
  element: HTMLElement;
  expectedDestination: string;
  actualDestination: string | null;
  isWorking: boolean;
  lastTested: Date;
  testResults: TestResult[];
  usageCount: number;
  userInteractions: UserInteraction[];
}

interface TestResult {
  timestamp: Date;
  success: boolean;
  responseTime: number;
  errorMessage?: string;
  networkStatus: number;
  redirectChain: string[];
}

interface UserInteraction {
  timestamp: Date;
  userId: string | null;
  action: "click" | "hover" | "focus";
  successful: boolean;
  sessionId: string;
}

interface NavigationTest {
  startPage: string;
  endPage: string;
  path: string[];
  success: boolean;
  duration: number;
  errors: string[];
}

export class BackendTestingSystem {
  private buttonMappings: Map<string, ButtonMapping> = new Map();
  private navigationTests: NavigationTest[] = [];
  private isRunning: boolean = false;
  private testInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeButtonMappings();
    this.startBackgroundTesting();
  }

  private initializeButtonMappings(): void {
    this.scanForButtons();
    this.setupEventListeners();
  }

  private scanForButtons(): void {
    // Scan for all interactive elements
    const selectors = [
      "button",
      "a[href]",
      "[role='button']",
      "[onclick]",
      "input[type='submit']",
      "input[type='button']",
      "[data-testid*='button']",
      "[data-testid*='link']",
      ".btn",
      ".button",
      ".link",
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const button = element as HTMLElement;
        const id = this.generateButtonId(button);

        if (!this.buttonMappings.has(id)) {
          const mapping: ButtonMapping = {
            id,
            element: button,
            expectedDestination: this.getExpectedDestination(button),
            actualDestination: null,
            isWorking: false,
            lastTested: new Date(0),
            testResults: [],
            usageCount: 0,
            userInteractions: [],
          };

          this.buttonMappings.set(id, mapping);
        }
      });
    });

    console.log(`🔍 Scanned ${this.buttonMappings.size} interactive elements`);
  }

  private generateButtonId(element: HTMLElement): string {
    const id = element.id;
    const className = element.className;
    const textContent = element.textContent?.trim();
    const href = element.getAttribute("href");
    const testId = element.getAttribute("data-testid");

    return (
      testId ||
      id ||
      `${element.tagName}-${href || className || textContent || "unknown"}`.replace(
        /\s+/g,
        "-",
      )
    );
  }

  private getExpectedDestination(element: HTMLElement): string {
    // Determine expected destination based on element type and attributes
    const href = element.getAttribute("href");
    const onClick = element.getAttribute("onclick");
    const dataNavigation = element.getAttribute("data-navigation");
    const textContent = element.textContent?.trim().toLowerCase();

    if (href) {
      return href;
    }

    if (dataNavigation) {
      return dataNavigation;
    }

    if (onClick && onClick.includes("location")) {
      const match = onClick.match(/location[.\s]*=\s*['"`]([^'"`]+)['"`]/);
      if (match) {
        return match[1];
      }
    }

    // Infer from button text
    if (textContent) {
      const inferredDestinations: Record<string, string> = {
        "add to cart": "/cart",
        "buy now": "/checkout",
        checkout: "/checkout",
        "view cart": "/cart",
        "shopping cart": "/cart",
        login: "/login",
        "sign in": "/login",
        "sign up": "/register",
        register: "/register",
        contact: "/contact",
        about: "/about",
        home: "/",
        shop: "/shop",
        products: "/products",
        collections: "/collections",
        favorites: "/favorites",
        wishlist: "/favorites",
        account: "/account",
        profile: "/profile",
        settings: "/settings",
        logout: "/logout",
        "sign out": "/logout",
      };

      for (const [keyword, destination] of Object.entries(
        inferredDestinations,
      )) {
        if (textContent.includes(keyword)) {
          return destination;
        }
      }
    }

    return "unknown";
  }

  private setupEventListeners(): void {
    // Listen for all clicks to track usage
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const buttonId = this.generateButtonId(target);
      const mapping = this.buttonMappings.get(buttonId);

      if (mapping) {
        mapping.usageCount++;
        mapping.userInteractions.push({
          timestamp: new Date(),
          userId: this.getCurrentUserId(),
          action: "click",
          successful: true,
          sessionId: this.getSessionId(),
        });

        // Test the button immediately after click
        setTimeout(() => {
          this.testButton(buttonId);
        }, 100);
      }
    });

    // Listen for form submissions
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      const submitButton = form.querySelector(
        "input[type='submit'], button[type='submit']",
      );

      if (submitButton) {
        const buttonId = this.generateButtonId(submitButton as HTMLElement);
        const mapping = this.buttonMappings.get(buttonId);

        if (mapping) {
          mapping.usageCount++;
          setTimeout(() => {
            this.testButton(buttonId);
          }, 100);
        }
      }
    });
  }

  public async testButton(buttonId: string): Promise<TestResult> {
    const mapping = this.buttonMappings.get(buttonId);
    if (!mapping) {
      throw new Error(`Button mapping not found: ${buttonId}`);
    }

    const startTime = performance.now();
    const testResult: TestResult = {
      timestamp: new Date(),
      success: false,
      responseTime: 0,
      networkStatus: 0,
      redirectChain: [],
    };

    try {
      // Get the current URL before testing
      const originalUrl = window.location.href;

      // Simulate button click or test destination
      const destination = await this.simulateButtonAction(mapping);

      if (destination) {
        // Test if the destination is reachable
        const response = await this.testDestination(destination);

        testResult.success = response.ok;
        testResult.networkStatus = response.status;
        testResult.responseTime = performance.now() - startTime;

        mapping.actualDestination = destination;
        mapping.isWorking = testResult.success;

        // Check for redirects
        if (response.url !== destination) {
          testResult.redirectChain = [destination, response.url];
        }
      } else {
        testResult.errorMessage = "Could not determine destination";
      }
    } catch (error) {
      testResult.success = false;
      testResult.errorMessage = `Test failed: ${error}`;
    }

    testResult.responseTime = performance.now() - startTime;
    mapping.lastTested = new Date();
    mapping.testResults.push(testResult);

    // Keep only last 10 test results per button
    if (mapping.testResults.length > 10) {
      mapping.testResults.shift();
    }

    return testResult;
  }

  private async simulateButtonAction(
    mapping: ButtonMapping,
  ): Promise<string | null> {
    const element = mapping.element;

    // For links, return the href
    if (element.tagName === "A") {
      return element.getAttribute("href");
    }

    // For buttons with onclick handlers
    const onClick = element.getAttribute("onclick");
    if (onClick) {
      // Extract URL from common patterns
      const patterns = [
        /location\.href\s*=\s*['"`]([^'"`]+)['"`]/,
        /window\.location\s*=\s*['"`]([^'"`]+)['"`]/,
        /navigate\(['"`]([^'"`]+)['"`]\)/,
        /router\.push\(['"`]([^'"`]+)['"`]\)/,
      ];

      for (const pattern of patterns) {
        const match = onClick.match(pattern);
        if (match) {
          return match[1];
        }
      }
    }

    // For form buttons, get form action
    if (
      element.type === "submit" ||
      element.getAttribute("type") === "submit"
    ) {
      const form = element.closest("form");
      if (form) {
        return form.getAttribute("action") || window.location.pathname;
      }
    }

    // Use expected destination as fallback
    return mapping.expectedDestination !== "unknown"
      ? mapping.expectedDestination
      : null;
  }

  private async testDestination(url: string): Promise<Response> {
    // Handle relative URLs
    const fullUrl = url.startsWith("http")
      ? url
      : new URL(url, window.location.origin).href;

    try {
      const response = await fetch(fullUrl, {
        method: "HEAD", // Use HEAD to avoid downloading content
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      return response;
    } catch (error) {
      // If HEAD fails, try GET with small timeout
      try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);

        const response = await fetch(fullUrl, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        });

        return response;
      } catch (getError) {
        // Return a mock failed response
        return new Response(null, { status: 0, statusText: "Network Error" });
      }
    }
  }

  public async performNavigationTest(
    startPage: string,
    endPage: string,
  ): Promise<NavigationTest> {
    const startTime = performance.now();
    const test: NavigationTest = {
      startPage,
      endPage,
      path: [startPage],
      success: false,
      duration: 0,
      errors: [],
    };

    try {
      // Find navigation path from start to end
      const path = await this.findNavigationPath(startPage, endPage);

      if (path.length > 0) {
        test.path = path;
        test.success = await this.validateNavigationPath(path);
      } else {
        test.errors.push("No navigation path found");
      }
    } catch (error) {
      test.errors.push(`Navigation test failed: ${error}`);
    }

    test.duration = performance.now() - startTime;
    this.navigationTests.push(test);

    // Keep only last 100 navigation tests
    if (this.navigationTests.length > 100) {
      this.navigationTests.shift();
    }

    return test;
  }

  private async findNavigationPath(
    startPage: string,
    endPage: string,
  ): Promise<string[]> {
    // Simple breadth-first search for navigation path
    const visited = new Set<string>();
    const queue: Array<{ page: string; path: string[] }> = [
      { page: startPage, path: [startPage] },
    ];
    const maxDepth = 5; // Prevent infinite loops

    while (queue.length > 0) {
      const { page, path } = queue.shift()!;

      if (path.length > maxDepth) continue;
      if (visited.has(page)) continue;
      visited.add(page);

      if (page === endPage) {
        return path;
      }

      // Find buttons that lead from current page
      const buttonsFromPage = Array.from(this.buttonMappings.values()).filter(
        (mapping) => {
          return (
            this.isButtonOnPage(mapping, page) &&
            mapping.actualDestination &&
            mapping.isWorking
          );
        },
      );

      for (const button of buttonsFromPage) {
        const destination = button.actualDestination!;
        if (!visited.has(destination)) {
          queue.push({
            page: destination,
            path: [...path, destination],
          });
        }
      }
    }

    return []; // No path found
  }

  private isButtonOnPage(mapping: ButtonMapping, page: string): boolean {
    // This would need to be enhanced to actually check if button exists on specific page
    // For now, assume all buttons are on current page
    return window.location.pathname === page;
  }

  private async validateNavigationPath(path: string[]): Promise<boolean> {
    for (let i = 0; i < path.length - 1; i++) {
      const currentPage = path[i];
      const nextPage = path[i + 1];

      // Find button that should navigate from current to next page
      const navigationButton = Array.from(this.buttonMappings.values()).find(
        (mapping) =>
          this.isButtonOnPage(mapping, currentPage) &&
          mapping.actualDestination === nextPage,
      );

      if (!navigationButton) {
        return false;
      }

      // Test the button
      const testResult = await this.testButton(navigationButton.id);
      if (!testResult.success) {
        return false;
      }
    }

    return true;
  }

  public async performBackwardsNavigation(): Promise<NavigationTest[]> {
    // Start from success/checkout page and work backwards
    const endPages = ["/success", "/checkout/success", "/order-complete"];
    const startPages = ["/", "/products", "/collections"];
    const tests: NavigationTest[] = [];

    for (const endPage of endPages) {
      for (const startPage of startPages) {
        const test = await this.performNavigationTest(startPage, endPage);
        tests.push(test);
      }
    }

    return tests;
  }

  private getCurrentUserId(): string | null {
    return localStorage.getItem("currentUser") || null;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }

  private startBackgroundTesting(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log("🧪 Starting background button testing");

    // Test buttons periodically
    this.testInterval = setInterval(async () => {
      await this.runBatchTests();
    }, 30000); // Every 30 seconds

    // Initial scan and test
    this.runBatchTests();
  }

  private async runBatchTests(): Promise<void> {
    const buttonsToTest = Array.from(this.buttonMappings.values())
      .filter((mapping) => {
        const timeSinceLastTest = Date.now() - mapping.lastTested.getTime();
        return timeSinceLastTest > 60000; // Test if not tested in last minute
      })
      .slice(0, 5); // Test max 5 buttons at a time

    for (const mapping of buttonsToTest) {
      try {
        await this.testButton(mapping.id);
      } catch (error) {
        console.warn(`Button test failed for ${mapping.id}:`, error);
      }
    }
  }

  public getButtonMappings(): ButtonMapping[] {
    return Array.from(this.buttonMappings.values());
  }

  public getBrokenButtons(): ButtonMapping[] {
    return Array.from(this.buttonMappings.values()).filter(
      (mapping) => !mapping.isWorking,
    );
  }

  public getButtonUsageStats(): Array<{
    id: string;
    usageCount: number;
    successRate: number;
    averageResponseTime: number;
  }> {
    return Array.from(this.buttonMappings.values()).map((mapping) => {
      const successfulTests = mapping.testResults.filter(
        (r) => r.success,
      ).length;
      const successRate =
        mapping.testResults.length > 0
          ? successfulTests / mapping.testResults.length
          : 0;

      const averageResponseTime =
        mapping.testResults.length > 0
          ? mapping.testResults.reduce((sum, r) => sum + r.responseTime, 0) /
            mapping.testResults.length
          : 0;

      return {
        id: mapping.id,
        usageCount: mapping.usageCount,
        successRate,
        averageResponseTime,
      };
    });
  }

  public getNavigationTests(): NavigationTest[] {
    return [...this.navigationTests];
  }

  public async fixBrokenButton(buttonId: string): Promise<boolean> {
    const mapping = this.buttonMappings.get(buttonId);
    if (!mapping) return false;

    try {
      // Attempt to fix common issues
      const element = mapping.element;

      // Fix missing href for links
      if (element.tagName === "A" && !element.getAttribute("href")) {
        element.setAttribute("href", mapping.expectedDestination);
      }

      // Fix disabled buttons
      if (element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
      }

      // Fix missing event handlers
      if (!element.onclick && mapping.expectedDestination !== "unknown") {
        element.onclick = () => {
          window.location.href = mapping.expectedDestination;
        };
      }

      // Re-test the button
      const testResult = await this.testButton(buttonId);
      return testResult.success;
    } catch (error) {
      console.error(`Failed to fix button ${buttonId}:`, error);
      return false;
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = null;
    }
    console.log("🛑 Backend testing system stopped");
  }

  public rescan(): void {
    console.log("🔄 Rescanning for new buttons...");
    this.scanForButtons();
  }
}

export const backendTestingSystem = new BackendTestingSystem();
