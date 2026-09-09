// AI Navigation Watcher - Comprehensive event tracking and analysis system
// Monitors all user interactions, navigation patterns, and system events

export interface NavigationEvent {
  id: string;
  type:
    | "page_load"
    | "navigation"
    | "back_button"
    | "forward_button"
    | "refresh"
    | "error"
    | "click"
    | "form_submit"
    | "search"
    | "external_link"
    | "modal_open"
    | "modal_close"
    | "tab_change"
    | "scroll"
    | "hover"
    | "focus"
    | "blur";
  timestamp: string;
  path: string;
  previousPath?: string;
  targetPath?: string;
  element?: string;
  elementId?: string;
  className?: string;
  text?: string;
  userAgent: string;
  viewport: { width: number; height: number };
  scroll: { x: number; y: number };
  duration?: number;
  errorType?: string;
  errorMessage?: string;
  metadata: {
    sessionId: string;
    userId?: string;
    isAuthenticated: boolean;
    loadTime?: number;
    referrer: string;
    origin: string;
    protocol: string;
    domain: string;
  };
}

export interface NavigationPattern {
  id: string;
  pattern: string;
  frequency: number;
  lastOccurred: string;
  category:
    | "normal"
    | "error"
    | "loop"
    | "bounce"
    | "deep_navigation"
    | "search_pattern"
    | "abandonment";
  description: string;
  suggestions: string[];
}

export interface SystemHealth {
  totalEvents: number;
  errorRate: number;
  averageLoadTime: number;
  bounceRate: number;
  navigationEfficiency: number;
  commonErrors: Array<{ error: string; count: number }>;
  popularPaths: Array<{ path: string; visits: number }>;
  userFlowIssues: NavigationPattern[];
}

class AINavigationWatcher {
  private events: NavigationEvent[] = [];
  private patterns: NavigationPattern[] = [];
  private sessionId: string;
  private startTime: number;
  private lastPath: string = "";
  private isTracking: boolean = false;
  private observers: Array<{ disconnect(): void }> = [];
  private listeners: Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
  }> = [];

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = Date.now();
    this.loadStoredEvents();
    this.setupPerformanceObserver();
    this.startTracking();
  }

  // Initialize comprehensive tracking
  startTracking(): void {
    if (this.isTracking) return;
    this.isTracking = true;

    console.log("🔍 AI Navigation Watcher: Starting comprehensive tracking");

    // Track initial page load
    this.trackEvent({
      type: "page_load",
      path: window.location.pathname,
      element: "window",
      text: document.title,
      duration: performance.now(),
      metadata: {
        loadTime: performance.now(),
        referrer: document.referrer,
        origin: window.location.origin,
        protocol: window.location.protocol,
        domain: window.location.hostname,
      },
    });

    // Navigation tracking
    this.setupNavigationTracking();

    // Click tracking
    this.setupClickTracking();

    // Form tracking
    this.setupFormTracking();

    // Scroll tracking
    this.setupScrollTracking();

    // Error tracking
    this.setupErrorTracking();

    // Focus/Blur tracking
    this.setupFocusTracking();

    // Modal tracking
    this.setupModalTracking();

    // External link tracking
    this.setupExternalLinkTracking();

    // Performance tracking
    this.setupPerformanceTracking();

    // Periodic analysis
    this.startPeriodicAnalysis();

    this.lastPath = window.location.pathname;
  }

  // Track navigation events
  private setupNavigationTracking(): void {
    // History API tracking
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      this.trackNavigation("navigation", args[2] as string);
      return originalPushState.apply(history, args);
    };

    history.replaceState = (...args) => {
      this.trackNavigation("navigation", args[2] as string);
      return originalReplaceState.apply(history, args);
    };

    // Back/Forward button tracking
    const popstateHandler = (event: PopStateEvent) => {
      const newPath = window.location.pathname;
      const isBack = this.events.some(
        (e) =>
          e.path === newPath &&
          e.timestamp < this.events[this.events.length - 1]?.timestamp,
      );

      this.trackEvent({
        type: isBack ? "back_button" : "forward_button",
        path: newPath,
        previousPath: this.lastPath,
        element: "browser",
        text: `${isBack ? "Back" : "Forward"} to ${newPath}`,
      });

      this.lastPath = newPath;
    };

    window.addEventListener("popstate", popstateHandler);
    this.listeners.push({
      element: window,
      event: "popstate",
      handler: popstateHandler,
    });

    // Page refresh tracking
    const beforeUnloadHandler = () => {
      this.trackEvent({
        type: "refresh",
        path: window.location.pathname,
        element: "window",
        text: "Page refresh/close",
      });
      this.saveEvents();
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);
    this.listeners.push({
      element: window,
      event: "beforeunload",
      handler: beforeUnloadHandler,
    });
  }

  // Setup comprehensive click tracking
  private setupClickTracking(): void {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const id = target.id || "";
      const className = target.className || "";
      const text = target.textContent?.slice(0, 100) || "";

      // Get meaningful element descriptor
      let elementDesc = tagName;
      if (id) elementDesc += `#${id}`;
      if (className) elementDesc += `.${className.toString().split(" ")[0]}`;

      this.trackEvent({
        type: "click",
        path: window.location.pathname,
        element: elementDesc,
        elementId: id,
        className: className,
        text: text,
        metadata: {
          clickX: event.clientX,
          clickY: event.clientY,
          button: event.button,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
        },
      });

      // Check if this is a potentially problematic click
      this.checkForProblematicClick(target);
    };

    document.addEventListener("click", clickHandler, true);
    this.listeners.push({
      element: document,
      event: "click",
      handler: clickHandler,
    });
  }

  // Check for clicks that might need user input
  private async checkForProblematicClick(target: HTMLElement): Promise<void> {
    const problematicSelectors = [
      "button[disabled]",
      ".message-button",
      ".chat-button",
      ".send-button",
      ".apply-fix",
      ".ai-chat",
      'form button[type="submit"]',
      '[data-action="apply-fix"]',
    ];

    const isProblematic = problematicSelectors.some((selector) => {
      try {
        return target.matches(selector) || target.closest(selector);
      } catch {
        return false;
      }
    });

    if (isProblematic) {
      // Import AI User Input Prompt service dynamically
      try {
        const { default: AIUserInputPrompt } = await import(
          "./AIUserInputPrompt"
        );

        // Wait a moment to see if the expected action occurs
        setTimeout(() => {
          // The AI User Input Prompt service will handle the detection and prompting
        }, 1500);
      } catch (error) {
        console.warn("Failed to load AI User Input Prompt service:", error);
      }
    }
  }

  // Track form submissions
  private setupFormTracking(): void {
    const submitHandler = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const fields = Array.from(formData.keys());

      this.trackEvent({
        type: "form_submit",
        path: window.location.pathname,
        element: `form#${form.id || "unnamed"}`,
        elementId: form.id,
        text: `Form submission with fields: ${fields.join(", ")}`,
        metadata: {
          formFields: fields,
          formMethod: form.method,
          formAction: form.action,
        },
      });
    };

    document.addEventListener("submit", submitHandler);
    this.listeners.push({
      element: document,
      event: "submit",
      handler: submitHandler,
    });
  }

  // Track scroll behavior
  private setupScrollTracking(): void {
    let scrollTimeout: NodeJS.Timeout;

    const scrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackEvent({
          type: "scroll",
          path: window.location.pathname,
          element: "window",
          text: `Scrolled to ${window.scrollY}px`,
          metadata: {
            scrollTop: window.scrollY,
            scrollLeft: window.scrollX,
            documentHeight: document.documentElement.scrollHeight,
            viewportHeight: window.innerHeight,
            scrollPercentage: Math.round(
              (window.scrollY /
                (document.documentElement.scrollHeight - window.innerHeight)) *
                100,
            ),
          },
        });
      }, 250);
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    this.listeners.push({
      element: window,
      event: "scroll",
      handler: scrollHandler,
    });
  }

  // Track JavaScript errors
  private setupErrorTracking(): void {
    const errorHandler = (event: ErrorEvent) => {
      this.trackEvent({
        type: "error",
        path: window.location.pathname,
        element: "javascript",
        text: event.message,
        errorType: "javascript_error",
        errorMessage: event.message,
        metadata: {
          filename: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno,
          stack: event.error?.stack,
        },
      });
    };

    window.addEventListener("error", errorHandler);
    this.listeners.push({
      element: window,
      event: "error",
      handler: errorHandler,
    });

    // Promise rejection tracking
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      this.trackEvent({
        type: "error",
        path: window.location.pathname,
        element: "promise",
        text: `Unhandled promise rejection: ${event.reason}`,
        errorType: "promise_rejection",
        errorMessage: String(event.reason),
      });
    };

    window.addEventListener("unhandledrejection", rejectionHandler);
    this.listeners.push({
      element: window,
      event: "unhandledrejection",
      handler: rejectionHandler,
    });
  }

  // Track focus/blur events for form interactions
  private setupFocusTracking(): void {
    const focusHandler = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        this.trackEvent({
          type: "focus",
          path: window.location.pathname,
          element: target.tagName.toLowerCase(),
          elementId: target.id,
          text: `Focused on ${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ""}`,
        });
      }
    };

    document.addEventListener("focusin", focusHandler);
    this.listeners.push({
      element: document,
      event: "focusin",
      handler: focusHandler,
    });
  }

  // Track modal opens/closes
  private setupModalTracking(): void {
    // Monitor for modal/dialog elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (
              element.matches('[role="dialog"], .modal, .popup, [data-modal]')
            ) {
              this.trackEvent({
                type: "modal_open",
                path: window.location.pathname,
                element: element.tagName.toLowerCase(),
                elementId: element.id,
                text: `Modal opened: ${element.id || element.className}`,
              });
            }
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (
              element.matches('[role="dialog"], .modal, .popup, [data-modal]')
            ) {
              this.trackEvent({
                type: "modal_close",
                path: window.location.pathname,
                element: element.tagName.toLowerCase(),
                elementId: element.id,
                text: `Modal closed: ${element.id || element.className}`,
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    this.observers.push(observer);
  }

  // Track external link clicks
  private setupExternalLinkTracking(): void {
    const linkHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a") as HTMLAnchorElement;

      if (link && link.href && !link.href.startsWith(window.location.origin)) {
        this.trackEvent({
          type: "external_link",
          path: window.location.pathname,
          targetPath: link.href,
          element: "a",
          text: `External link: ${link.href}`,
          metadata: {
            linkText: link.textContent?.trim(),
            targetBlank: link.target === "_blank",
          },
        });
      }
    };

    document.addEventListener("click", linkHandler);
    this.listeners.push({
      element: document,
      event: "click",
      handler: linkHandler,
    });
  }

  // Performance tracking
  private setupPerformanceTracking(): void {
    // Track navigation timing
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.trackEvent({
            type: "page_load",
            path: window.location.pathname,
            element: "performance",
            text: `Page load completed in ${navigation.loadEventEnd - navigation.loadEventStart}ms`,
            duration: navigation.loadEventEnd - navigation.loadEventStart,
            metadata: {
              domContentLoaded:
                navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart,
              domInteractive:
                navigation.domInteractive - navigation.navigationStart,
              firstPaint:
                performance.getEntriesByName("first-paint")[0]?.startTime || 0,
              firstContentfulPaint:
                performance.getEntriesByName("first-contentful-paint")[0]
                  ?.startTime || 0,
            },
          });
        }
      }, 0);
    });
  }

  // Performance observer for Core Web Vitals
  private setupPerformanceObserver(): void {
    if ("PerformanceObserver" in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.trackEvent({
          type: "page_load",
          path: window.location.pathname,
          element: "lcp",
          text: `LCP: ${lastEntry.startTime.toFixed(1)}ms`,
          duration: lastEntry.startTime,
          metadata: {
            metric: "largest-contentful-paint",
            value: lastEntry.startTime,
          },
        });
      });

      try {
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn("LCP observer not supported");
      }

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }

        if (clsValue > 0) {
          this.trackEvent({
            type: "page_load",
            path: window.location.pathname,
            element: "cls",
            text: `CLS: ${clsValue.toFixed(4)}`,
            metadata: {
              metric: "cumulative-layout-shift",
              value: clsValue,
            },
          });
        }
      });

      try {
        clsObserver.observe({ entryTypes: ["layout-shift"] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn("CLS observer not supported");
      }
    }
  }

  // Track navigation with path information
  private trackNavigation(
    type: "navigation" | "back_button" | "forward_button",
    path?: string,
  ): void {
    const newPath = path || window.location.pathname;

    this.trackEvent({
      type,
      path: newPath,
      previousPath: this.lastPath,
      element: "router",
      text: `${type} from ${this.lastPath} to ${newPath}`,
    });

    this.lastPath = newPath;
  }

  // Main event tracking method
  private trackEvent(eventData: Partial<NavigationEvent>): void {
    const event: NavigationEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
      metadata: {
        sessionId: this.sessionId,
        userId: this.getCurrentUserId(),
        isAuthenticated: this.isUserAuthenticated(),
        referrer: document.referrer,
        origin: window.location.origin,
        protocol: window.location.protocol,
        domain: window.location.hostname,
        ...eventData.metadata,
      },
      ...eventData,
    } as NavigationEvent;

    this.events.push(event);

    // Log significant events to console
    if (
      ["page_load", "navigation", "error", "back_button"].includes(event.type)
    ) {
      console.log(`🔍 Navigation Event:`, {
        type: event.type,
        path: event.path,
        element: event.element,
        text: event.text,
        timestamp: event.timestamp,
      });
    }

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Save to localStorage periodically
    if (this.events.length % 10 === 0) {
      this.saveEvents();
    }

    // Analyze patterns periodically
    if (this.events.length % 25 === 0) {
      this.analyzePatterns();
    }
  }

  // Periodic analysis
  private startPeriodicAnalysis(): void {
    // Analyze every 30 seconds
    setInterval(() => {
      this.analyzePatterns();
      this.checkForAnomalies();
    }, 30000);

    // Save events every 60 seconds
    setInterval(() => {
      this.saveEvents();
    }, 60000);
  }

  // Analyze navigation patterns
  private analyzePatterns(): void {
    const recentEvents = this.events.slice(-50); // Last 50 events

    // Detect loops (same page visited multiple times)
    this.detectLoops(recentEvents);

    // Detect error patterns
    this.detectErrorPatterns(recentEvents);

    // Detect bounce behavior
    this.detectBouncePatterns(recentEvents);

    // Detect abandonment patterns
    this.detectAbandonmentPatterns(recentEvents);
  }

  // Detect navigation loops
  private detectLoops(events: NavigationEvent[]): void {
    const pathSequence = events
      .filter((e) => ["navigation", "page_load"].includes(e.type))
      .map((e) => e.path);

    for (let i = 2; i < pathSequence.length; i++) {
      const current = pathSequence[i];
      const previous = pathSequence[i - 1];
      const beforePrevious = pathSequence[i - 2];

      if (current === beforePrevious && current !== previous) {
        this.addPattern({
          pattern: `${beforePrevious} -> ${previous} -> ${current}`,
          category: "loop",
          description: `User is looping between ${current} and ${previous}`,
          suggestions: [
            "Check navigation UX between these pages",
            "Consider adding breadcrumbs",
            "Review page content clarity",
          ],
        });
      }
    }
  }

  // Detect error patterns
  private detectErrorPatterns(events: NavigationEvent[]): void {
    const errors = events.filter((e) => e.type === "error");
    if (errors.length > 3) {
      this.addPattern({
        pattern: `Multiple errors: ${errors.map((e) => e.errorType).join(", ")}`,
        category: "error",
        description: `High error rate detected: ${errors.length} errors in recent activity`,
        suggestions: [
          "Investigate JavaScript errors",
          "Check for broken functionality",
          "Review error handling",
        ],
      });
    }
  }

  // Detect bounce patterns
  private detectBouncePatterns(events: NavigationEvent[]): void {
    const navigationEvents = events.filter((e) =>
      ["page_load", "navigation", "back_button", "refresh"].includes(e.type),
    );

    // Quick bounce: less than 5 seconds on page
    for (let i = 1; i < navigationEvents.length; i++) {
      const current = navigationEvents[i];
      const previous = navigationEvents[i - 1];

      const timeOnPage =
        new Date(current.timestamp).getTime() -
        new Date(previous.timestamp).getTime();

      if (timeOnPage < 5000 && current.type === "back_button") {
        this.addPattern({
          pattern: `Quick bounce from ${previous.path}`,
          category: "bounce",
          description: `User left ${previous.path} after only ${Math.round(timeOnPage / 1000)}s`,
          suggestions: [
            "Review page loading speed",
            "Check page content relevance",
            "Improve initial user experience",
          ],
        });
      }
    }
  }

  // Detect abandonment patterns
  private detectAbandonmentPatterns(events: NavigationEvent[]): void {
    const formEvents = events.filter((e) => e.type === "form_submit");
    const focusEvents = events.filter((e) => e.type === "focus");

    if (focusEvents.length > 3 && formEvents.length === 0) {
      this.addPattern({
        pattern: "Form abandonment",
        category: "abandonment",
        description: "User interacted with forms but did not submit",
        suggestions: [
          "Simplify form fields",
          "Add form validation feedback",
          "Consider progressive disclosure",
        ],
      });
    }
  }

  // Check for anomalies
  private checkForAnomalies(): void {
    const last10Events = this.events.slice(-10);

    // Too many clicks in short time (possible bot or frustrated user)
    const clicks = last10Events.filter((e) => e.type === "click");
    if (clicks.length > 8) {
      console.warn("🚨 Navigation Anomaly: High click rate detected");
    }

    // Too many errors
    const errors = last10Events.filter((e) => e.type === "error");
    if (errors.length > 3) {
      console.warn("🚨 Navigation Anomaly: High error rate detected");
    }

    // Rapid navigation (possible confusion)
    const navigations = last10Events.filter((e) =>
      ["navigation", "back_button"].includes(e.type),
    );
    if (navigations.length > 5) {
      console.warn("🚨 Navigation Anomaly: Rapid navigation pattern detected");
    }
  }

  // Add pattern to analysis
  private addPattern(
    patternData: Omit<NavigationPattern, "id" | "frequency" | "lastOccurred">,
  ): void {
    const existingPattern = this.patterns.find(
      (p) => p.pattern === patternData.pattern,
    );

    if (existingPattern) {
      existingPattern.frequency++;
      existingPattern.lastOccurred = new Date().toISOString();
    } else {
      this.patterns.push({
        id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        frequency: 1,
        lastOccurred: new Date().toISOString(),
        ...patternData,
      });
    }

    // Keep only last 50 patterns
    if (this.patterns.length > 50) {
      this.patterns = this.patterns.slice(-50);
    }
  }

  // Get current user ID (integrate with your auth system)
  private getCurrentUserId(): string | undefined {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const currentUser = users.find((u: any) => u.isLoggedIn);
      return currentUser?.id;
    } catch {
      return undefined;
    }
  }

  // Check if user is authenticated
  private isUserAuthenticated(): boolean {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      return users.some((u: any) => u.isLoggedIn);
    } catch {
      return false;
    }
  }

  // Get comprehensive analytics
  getAnalytics(): SystemHealth {
    const totalEvents = this.events.length;
    const errors = this.events.filter((e) => e.type === "error");
    const navigations = this.events.filter((e) =>
      ["navigation", "page_load"].includes(e.type),
    );
    const backButtons = this.events.filter((e) => e.type === "back_button");

    // Calculate load times
    const loadEvents = this.events.filter(
      (e) => e.type === "page_load" && e.duration,
    );
    const avgLoadTime =
      loadEvents.reduce((sum, e) => sum + (e.duration || 0), 0) /
        loadEvents.length || 0;

    // Calculate bounce rate (back button usage vs total navigations)
    const bounceRate =
      navigations.length > 0
        ? (backButtons.length / navigations.length) * 100
        : 0;

    // Popular paths
    const pathCounts: Record<string, number> = {};
    this.events.forEach((e) => {
      if (e.path) {
        pathCounts[e.path] = (pathCounts[e.path] || 0) + 1;
      }
    });

    const popularPaths = Object.entries(pathCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, visits]) => ({ path, visits }));

    // Common errors
    const errorCounts: Record<string, number> = {};
    errors.forEach((e) => {
      const errorKey = e.errorType || "unknown";
      errorCounts[errorKey] = (errorCounts[errorKey] || 0) + 1;
    });

    const commonErrors = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([error, count]) => ({ error, count }));

    return {
      totalEvents,
      errorRate: totalEvents > 0 ? (errors.length / totalEvents) * 100 : 0,
      averageLoadTime: Math.round(avgLoadTime),
      bounceRate: Math.round(bounceRate),
      navigationEfficiency: Math.round(100 - bounceRate), // Inverse of bounce rate
      commonErrors,
      popularPaths,
      userFlowIssues: this.patterns.filter((p) => p.frequency > 1),
    };
  }

  // Get recent events
  getRecentEvents(limit: number = 50): NavigationEvent[] {
    return this.events.slice(-limit);
  }

  // Get events by type
  getEventsByType(type: NavigationEvent["type"]): NavigationEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  // Get session summary
  getSessionSummary(): {
    sessionId: string;
    duration: number;
    totalEvents: number;
    uniquePages: number;
    errors: number;
    patterns: NavigationPattern[];
  } {
    const uniquePages = new Set(this.events.map((e) => e.path)).size;
    const duration = Date.now() - this.startTime;

    return {
      sessionId: this.sessionId,
      duration,
      totalEvents: this.events.length,
      uniquePages,
      errors: this.events.filter((e) => e.type === "error").length,
      patterns: this.patterns,
    };
  }

  // Save events to localStorage
  private saveEvents(): void {
    try {
      const data = {
        events: this.events.slice(-500), // Keep last 500 events
        patterns: this.patterns,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("aiNavigationWatcher", JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save navigation events:", error);
    }
  }

  // Load stored events
  private loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem("aiNavigationWatcher");
      if (stored) {
        const data = JSON.parse(stored);
        // Only load events from the last 24 hours
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        this.events = (data.events || []).filter(
          (e: NavigationEvent) => new Date(e.timestamp).getTime() > oneDayAgo,
        );
        this.patterns = data.patterns || [];
      }
    } catch (error) {
      console.warn("Failed to load stored navigation events:", error);
      this.events = [];
      this.patterns = [];
    }
  }

  // Clean up event listeners and observers
  destroy(): void {
    this.isTracking = false;

    // Remove event listeners
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];

    // Disconnect observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];

    // Save final state
    this.saveEvents();

    console.log("🔍 AI Navigation Watcher: Tracking stopped");
  }

  // Generate comprehensive report
  generateReport(): string {
    const analytics = this.getAnalytics();
    const sessionSummary = this.getSessionSummary();
    const recentEvents = this.getRecentEvents(20);

    return `
=== AI NAVIGATION WATCHER REPORT ===
Generated: ${new Date().toISOString()}
Session: ${sessionSummary.sessionId}
Duration: ${Math.round(sessionSummary.duration / 1000)}s

📊 SYSTEM HEALTH:
- Total Events: ${analytics.totalEvents}
- Error Rate: ${analytics.errorRate.toFixed(2)}%
- Average Load Time: ${analytics.averageLoadTime}ms
- Bounce Rate: ${analytics.bounceRate.toFixed(2)}%
- Navigation Efficiency: ${analytics.navigationEfficiency}%

🔥 POPULAR PAGES:
${analytics.popularPaths.map((p) => `  ${p.path}: ${p.visits} visits`).join("\n")}

❌ COMMON ERRORS:
${analytics.commonErrors.map((e) => `  ${e.error}: ${e.count} occurrences`).join("\n")}

🔄 USER FLOW ISSUES:
${analytics.userFlowIssues.map((p) => `  ${p.pattern} (${p.frequency}x) - ${p.description}`).join("\n")}

📝 RECENT EVENTS (Last 20):
${recentEvents
  .reverse()
  .map(
    (e) =>
      `  ${new Date(e.timestamp).toLocaleTimeString()} | ${e.type.toUpperCase()} | ${e.path} | ${e.text?.slice(0, 50) || "N/A"}`,
  )
  .join("\n")}

🎯 RECOMMENDATIONS:
${analytics.userFlowIssues
  .flatMap((p) => p.suggestions)
  .slice(0, 5)
  .map((s) => `  • ${s}`)
  .join("\n")}

=== END REPORT ===
    `.trim();
  }
}

// Export singleton instance
export default new AINavigationWatcher();
