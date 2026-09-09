/**
 * AI Click Logger System
 * Tracks all button clicks and interactions across the site for AI analysis
 */

import AICentralCommand from "./AICentralCommand";

export interface ClickEvent {
  id: string;
  elementType: string;
  elementText: string;
  elementId?: string;
  elementClass?: string;
  page: string;
  section: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  coordinates: {
    x: number;
    y: number;
  };
  expectedResult: string;
  actualResult: string;
  resultMatch: boolean;
  processingTime: number;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  scrollPosition: number;
}

export interface InteractionAnalysis {
  clickId: string;
  element: string;
  intended: string;
  actual: string;
  success: boolean;
  suggestions?: string[];
  aiConfidence: number;
  timestamp: string;
}

export interface PageClickStats {
  page: string;
  totalClicks: number;
  successfulClicks: number;
  failedClicks: number;
  averageProcessingTime: number;
  mostClickedElements: Array<{
    element: string;
    count: number;
    successRate: number;
  }>;
  problemAreas: Array<{
    element: string;
    issue: string;
    failureRate: number;
  }>;
}

class AIClickLoggerService {
  private clickEvents: ClickEvent[] = [];
  private pageStats: Map<string, PageClickStats> = new Map();
  private analysisInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor() {
    this.loadClickData();
    this.startAnalysis();
  }

  /**
   * Initialize click tracking
   */
  initialize(): void {
    if (this.isInitialized) return;

    this.setupGlobalClickListener();
    this.setupFormSubmissionTracking();
    this.setupNavigationTracking();
    this.setupScrollTracking();

    this.isInitialized = true;
    console.log("AI Click Logger initialized");
  }

  /**
   * Log a specific interaction
   */
  logInteraction(
    elementType: string,
    details: {
      elementText?: string;
      elementId?: string;
      userId?: string;
      expected: string;
      actual: string;
      coordinates?: { x: number; y: number };
    },
  ): string {
    const clickId = this.generateClickId();

    const clickEvent: ClickEvent = {
      id: clickId,
      elementType,
      elementText: details.elementText || "",
      elementId: details.elementId,
      elementClass: "",
      page: window.location.pathname,
      section: document.title,
      userId: details.userId,
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
      coordinates: details.coordinates || { x: 0, y: 0 },
      expectedResult: details.expected,
      actualResult: details.actual,
      resultMatch: details.expected === details.actual,
      processingTime: 0,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      scrollPosition: window.scrollY,
    };

    this.clickEvents.push(clickEvent);
    this.updatePageStats(clickEvent);
    this.saveClickData();

    // Send to AI for analysis
    this.analyzeInteraction(clickEvent);

    return clickId;
  }

  /**
   * Update the result of a logged interaction
   */
  updateInteractionResult(
    clickId: string,
    actualResult: string,
    processingTime: number = 0,
  ): void {
    const clickEvent = this.clickEvents.find((c) => c.id === clickId);
    if (clickEvent) {
      clickEvent.actualResult = actualResult;
      clickEvent.resultMatch = clickEvent.expectedResult === actualResult;
      clickEvent.processingTime = processingTime;

      this.updatePageStats(clickEvent);
      this.saveClickData();

      // Re-analyze with updated result
      this.analyzeInteraction(clickEvent);
    }
  }

  /**
   * Get click statistics for a page
   */
  getPageStats(page: string): PageClickStats | null {
    return this.pageStats.get(page) || null;
  }

  /**
   * Get overall system statistics
   */
  getOverallStats(): any {
    const allStats = Array.from(this.pageStats.values());

    const totalClicks = allStats.reduce(
      (sum, stats) => sum + stats.totalClicks,
      0,
    );
    const totalSuccessful = allStats.reduce(
      (sum, stats) => sum + stats.successfulClicks,
      0,
    );
    const totalFailed = allStats.reduce(
      (sum, stats) => sum + stats.failedClicks,
      0,
    );

    const overallSuccessRate =
      totalClicks > 0 ? (totalSuccessful / totalClicks) * 100 : 0;

    return {
      totalClicks,
      totalSuccessful,
      totalFailed,
      overallSuccessRate,
      totalPages: allStats.length,
      averageProcessingTime: this.calculateAverageProcessingTime(),
      topProblematicPages: this.getProblematicPages(),
      recentActivity: this.getRecentActivity(),
    };
  }

  /**
   * Get recent click activity
   */
  getRecentActivity(limit: number = 20): ClickEvent[] {
    return this.clickEvents.slice(-limit).reverse();
  }

  /**
   * Setup global click listener
   */
  private setupGlobalClickListener(): void {
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement;
        if (!target) return;

        const elementType = this.getElementType(target);
        const elementText = this.getElementText(target);
        const elementId = target.id;
        const elementClass = target.className;

        // Determine expected result based on element
        const expectedResult = this.predictExpectedResult(target);

        const clickId = this.logInteraction(elementType, {
          elementText,
          elementId,
          expected: expectedResult,
          actual: "pending",
          coordinates: {
            x: event.clientX,
            y: event.clientY,
          },
        });

        // Set up delayed check for actual result
        setTimeout(() => {
          const actualResult = this.detectActualResult(target, expectedResult);
          this.updateInteractionResult(clickId, actualResult);
        }, 1000);
      },
      true,
    );
  }

  /**
   * Setup form submission tracking
   */
  private setupFormSubmissionTracking(): void {
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      if (!form) return;

      this.logInteraction("form_submit", {
        elementText: "Form submission",
        elementId: form.id,
        expected: "form_submitted",
        actual: "pending",
      });
    });
  }

  /**
   * Setup navigation tracking
   */
  private setupNavigationTracking(): void {
    // Track page changes
    let currentPage = window.location.pathname;

    const checkForNavigation = () => {
      if (window.location.pathname !== currentPage) {
        this.logInteraction("navigation", {
          elementText: `Navigation to ${window.location.pathname}`,
          expected: "page_changed",
          actual: "page_changed",
        });
        currentPage = window.location.pathname;
      }
    };

    // Check every 500ms for navigation changes
    setInterval(checkForNavigation, 500);
  }

  /**
   * Setup scroll tracking
   */
  private setupScrollTracking(): void {
    let scrollTimeout: NodeJS.Timeout;

    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.logInteraction("scroll", {
          elementText: `Scroll to position ${window.scrollY}`,
          expected: "content_scrolled",
          actual: "content_scrolled",
        });
      }, 250);
    });
  }

  /**
   * Analyze interaction with AI
   */
  private async analyzeInteraction(clickEvent: ClickEvent): Promise<void> {
    try {
      const analysis: InteractionAnalysis = {
        clickId: clickEvent.id,
        element: clickEvent.elementType,
        intended: clickEvent.expectedResult,
        actual: clickEvent.actualResult,
        success: clickEvent.resultMatch,
        suggestions: [],
        aiConfidence: 0,
        timestamp: new Date().toISOString(),
      };

      // Perform AI analysis
      if (!clickEvent.resultMatch && clickEvent.actualResult !== "pending") {
        // Generate suggestions for failed interactions
        analysis.suggestions = await this.generateSuggestions(clickEvent);
        analysis.aiConfidence = this.calculateConfidence(clickEvent);

        // Send to central AI for further processing
        const central = AICentralCommand.getInstance();
        await central.initialize();

        await central.logToDatabase({
          type: "analysis",
          agentId: "click_logger",
          data: {
            action: "analyze_click_failure",
            clickEvent,
            analysis,
            priority: "medium",
          },
          metadata: {
            page: window.location.pathname,
          },
        });
      }

      // Store analysis
      this.storeAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing interaction:", error);
    }
  }

  /**
   * Generate suggestions for failed interactions
   */
  private async generateSuggestions(clickEvent: ClickEvent): Promise<string[]> {
    const suggestions: string[] = [];

    // Common failure patterns and suggestions
    if (
      clickEvent.elementType === "button" &&
      clickEvent.actualResult === "no_response"
    ) {
      suggestions.push("Check if button has proper click handler");
      suggestions.push("Verify button is not disabled");
      suggestions.push("Check for JavaScript errors");
    }

    if (
      clickEvent.elementType === "link" &&
      clickEvent.actualResult === "navigation_failed"
    ) {
      suggestions.push("Verify link href is correct");
      suggestions.push("Check if route exists");
      suggestions.push("Look for navigation guards or redirects");
    }

    if (clickEvent.processingTime > 3000) {
      suggestions.push("Optimize for faster response time");
      suggestions.push("Consider adding loading indicators");
      suggestions.push("Check for performance bottlenecks");
    }

    return suggestions;
  }

  /**
   * Calculate AI confidence in analysis
   */
  private calculateConfidence(clickEvent: ClickEvent): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on data quality
    if (clickEvent.elementId) confidence += 0.1;
    if (clickEvent.elementText.length > 0) confidence += 0.1;
    if (clickEvent.processingTime > 0) confidence += 0.1;

    // Adjust based on element type
    if (["button", "link", "form_submit"].includes(clickEvent.elementType)) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Store analysis results
   */
  private storeAnalysis(analysis: InteractionAnalysis): void {
    const analyses = JSON.parse(localStorage.getItem("clickAnalyses") || "[]");
    analyses.push(analysis);

    // Keep only last 500 analyses
    if (analyses.length > 500) {
      analyses.splice(0, analyses.length - 500);
    }

    localStorage.setItem("clickAnalyses", JSON.stringify(analyses));
  }

  /**
   * Update page statistics
   */
  private updatePageStats(clickEvent: ClickEvent): void {
    let stats = this.pageStats.get(clickEvent.page);

    if (!stats) {
      stats = {
        page: clickEvent.page,
        totalClicks: 0,
        successfulClicks: 0,
        failedClicks: 0,
        averageProcessingTime: 0,
        mostClickedElements: [],
        problemAreas: [],
      };
    }

    stats.totalClicks++;

    if (clickEvent.resultMatch) {
      stats.successfulClicks++;
    } else if (clickEvent.actualResult !== "pending") {
      stats.failedClicks++;
    }

    // Update most clicked elements
    this.updateMostClickedElements(stats, clickEvent);

    // Update problem areas
    if (!clickEvent.resultMatch && clickEvent.actualResult !== "pending") {
      this.updateProblemAreas(stats, clickEvent);
    }

    // Update average processing time
    if (clickEvent.processingTime > 0) {
      const currentAvg = stats.averageProcessingTime;
      const totalWithTime = this.clickEvents.filter(
        (c) => c.page === clickEvent.page && c.processingTime > 0,
      ).length;

      stats.averageProcessingTime =
        (currentAvg * (totalWithTime - 1) + clickEvent.processingTime) /
        totalWithTime;
    }

    this.pageStats.set(clickEvent.page, stats);
  }

  /**
   * Helper methods
   */
  private getElementType(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();

    if (tagName === "button") return "button";
    if (tagName === "a") return "link";
    if (tagName === "input") {
      const type = element.getAttribute("type") || "text";
      return `input_${type}`;
    }
    if (tagName === "select") return "select";
    if (tagName === "textarea") return "textarea";
    if (element.onclick || element.getAttribute("onclick")) return "clickable";

    return tagName;
  }

  private getElementText(element: HTMLElement): string {
    return (
      element.textContent?.trim().substring(0, 100) ||
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      element.getAttribute("placeholder") ||
      ""
    );
  }

  private predictExpectedResult(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();

    if (tagName === "button") {
      const text = element.textContent?.toLowerCase() || "";
      if (text.includes("submit")) return "form_submitted";
      if (text.includes("save")) return "data_saved";
      if (text.includes("delete")) return "item_deleted";
      if (text.includes("cancel")) return "action_cancelled";
      return "button_clicked";
    }

    if (tagName === "a") {
      const href = element.getAttribute("href");
      if (href) {
        if (href.startsWith("#")) return "scroll_to_section";
        if (href.startsWith("mailto:")) return "email_opened";
        if (href.startsWith("tel:")) return "phone_dialed";
        return "navigation_occurred";
      }
      return "link_clicked";
    }

    return "element_interacted";
  }

  private detectActualResult(
    element: HTMLElement,
    expectedResult: string,
  ): string {
    // Simple heuristics to detect what actually happened
    // This would be more sophisticated in a real implementation

    const tagName = element.tagName.toLowerCase();

    if (tagName === "button") {
      // Check if form was submitted
      const form = element.closest("form");
      if (form && expectedResult === "form_submitted") {
        return "form_submitted"; // Assume success for now
      }
      return "button_clicked";
    }

    if (tagName === "a") {
      const href = element.getAttribute("href");
      if (href && !href.startsWith("#")) {
        // Check if navigation occurred
        setTimeout(() => {
          if (window.location.href.includes(href)) {
            return "navigation_occurred";
          }
        }, 100);
      }
      return "link_clicked";
    }

    return "interaction_completed";
  }

  private updateMostClickedElements(
    stats: PageClickStats,
    clickEvent: ClickEvent,
  ): void {
    const elementKey = `${clickEvent.elementType}_${clickEvent.elementText}`;
    let elementStats = stats.mostClickedElements.find(
      (e) => e.element === elementKey,
    );

    if (!elementStats) {
      elementStats = {
        element: elementKey,
        count: 0,
        successRate: 0,
      };
      stats.mostClickedElements.push(elementStats);
    }

    elementStats.count++;

    // Recalculate success rate
    const elementClicks = this.clickEvents.filter(
      (c) =>
        c.page === clickEvent.page &&
        `${c.elementType}_${c.elementText}` === elementKey,
    );

    const successfulClicks = elementClicks.filter((c) => c.resultMatch).length;
    elementStats.successRate = successfulClicks / elementClicks.length;

    // Sort by count
    stats.mostClickedElements.sort((a, b) => b.count - a.count);

    // Keep only top 10
    if (stats.mostClickedElements.length > 10) {
      stats.mostClickedElements = stats.mostClickedElements.slice(0, 10);
    }
  }

  private updateProblemAreas(
    stats: PageClickStats,
    clickEvent: ClickEvent,
  ): void {
    const elementKey = `${clickEvent.elementType}_${clickEvent.elementText}`;
    let problemArea = stats.problemAreas.find((p) => p.element === elementKey);

    if (!problemArea) {
      problemArea = {
        element: elementKey,
        issue: clickEvent.actualResult,
        failureRate: 0,
      };
      stats.problemAreas.push(problemArea);
    }

    // Recalculate failure rate
    const elementClicks = this.clickEvents.filter(
      (c) =>
        c.page === clickEvent.page &&
        `${c.elementType}_${c.elementText}` === elementKey,
    );

    const failedClicks = elementClicks.filter(
      (c) => !c.resultMatch && c.actualResult !== "pending",
    ).length;
    problemArea.failureRate = failedClicks / elementClicks.length;

    // Sort by failure rate
    stats.problemAreas.sort((a, b) => b.failureRate - a.failureRate);

    // Keep only top 5
    if (stats.problemAreas.length > 5) {
      stats.problemAreas = stats.problemAreas.slice(0, 5);
    }
  }

  private generateClickId(): string {
    return (
      "click_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId =
        "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }

  private calculateAverageProcessingTime(): number {
    const clicksWithTime = this.clickEvents.filter((c) => c.processingTime > 0);
    if (clicksWithTime.length === 0) return 0;

    const totalTime = clicksWithTime.reduce(
      (sum, c) => sum + c.processingTime,
      0,
    );
    return totalTime / clicksWithTime.length;
  }

  private getProblematicPages(): Array<{ page: string; failureRate: number }> {
    return Array.from(this.pageStats.values())
      .map((stats) => ({
        page: stats.page,
        failureRate:
          stats.totalClicks > 0 ? stats.failedClicks / stats.totalClicks : 0,
      }))
      .filter((p) => p.failureRate > 0.1) // Only pages with >10% failure rate
      .sort((a, b) => b.failureRate - a.failureRate);
  }

  private startAnalysis(): void {
    this.analysisInterval = setInterval(async () => {
      await this.performPeriodicAnalysis();
    }, 60000); // Every minute
  }

  private async performPeriodicAnalysis(): Promise<void> {
    try {
      const stats = this.getOverallStats();

      // Send periodic report to AI system
      const central = AICentralCommand.getInstance();
      await central.initialize();

      await central.logToDatabase({
        type: "communication",
        agentId: "click_logger",
        data: {
          action: "periodic_click_analysis",
          stats,
          priority: "low",
        },
        metadata: {
          page: window.location.pathname,
        },
      });
    } catch (error) {
      console.error("Error in periodic analysis:", error);
    }
  }

  private loadClickData(): void {
    try {
      const savedClicks = localStorage.getItem("aiClickEvents");
      if (savedClicks) {
        this.clickEvents = JSON.parse(savedClicks);
      }

      const savedStats = localStorage.getItem("aiPageStats");
      if (savedStats) {
        const statsArray = JSON.parse(savedStats);
        this.pageStats = new Map(statsArray);
      }
    } catch (error) {
      console.error("Error loading click data:", error);
    }
  }

  private saveClickData(): void {
    try {
      // Keep only last 1000 click events
      const recentClicks = this.clickEvents.slice(-1000);
      localStorage.setItem("aiClickEvents", JSON.stringify(recentClicks));
      this.clickEvents = recentClicks;

      // Save page stats
      const statsArray = Array.from(this.pageStats.entries());
      localStorage.setItem("aiPageStats", JSON.stringify(statsArray));
    } catch (error) {
      console.error("Error saving click data:", error);
    }
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
    this.saveClickData();
  }
}

// Export singleton instance
export const AIClickLogger = new AIClickLoggerService();
export default AIClickLogger;
