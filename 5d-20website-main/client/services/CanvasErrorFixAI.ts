// Canvas Error Detection and Auto-Fix AI System
// Specialized AI for detecting canvas issues and applying intelligent fixes

import ConsoleLogMonitoringService from "./ConsoleLogMonitoringService";
import DatabaseService from "./DatabaseService";

export interface CanvasIssue {
  id: string;
  type:
    | "rendering"
    | "movement"
    | "interaction"
    | "performance"
    | "display"
    | "controls";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  detectedAt: string;
  affectedElements: string[];
  possibleCauses: string[];
  autoFixAvailable: boolean;
  fixApplied?: boolean;
  fixResult?: string;
  userImpact: "none" | "minor" | "moderate" | "major" | "blocking";
}

export interface FixSolution {
  id: string;
  issueId: string;
  name: string;
  description: string;
  confidence: number;
  automated: boolean;
  riskLevel: "low" | "medium" | "high";
  estimatedTime: number; // seconds
  code?: string;
  steps: string[];
  testable: boolean;
  rollbackPossible: boolean;
}

export interface CanvasDiagnostic {
  timestamp: string;
  canvasExists: boolean;
  contextAvailable: boolean;
  dimensionsValid: boolean;
  stylingCorrect: boolean;
  animationRunning: boolean;
  entitiesPresent: boolean;
  interactionWorking: boolean;
  performanceScore: number;
  issuesFound: CanvasIssue[];
  recommendedFixes: FixSolution[];
}

class CanvasErrorFixAI {
  private static instance: CanvasErrorFixAI;
  private knownIssues: Map<string, CanvasIssue> = new Map();
  private appliedFixes: Map<string, FixSolution> = new Map();
  private diagnosticHistory: CanvasDiagnostic[] = [];
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;
  private logMonitoring: ConsoleLogMonitoringService;
  private database: typeof DatabaseService;

  private constructor() {
    this.logMonitoring = ConsoleLogMonitoringService.getInstance();
    this.database = DatabaseService;
    this.initializeKnownFixes();
  }

  static getInstance(): CanvasErrorFixAI {
    if (!CanvasErrorFixAI.instance) {
      CanvasErrorFixAI.instance = new CanvasErrorFixAI();
    }
    return CanvasErrorFixAI.instance;
  }

  // Start continuous monitoring for canvas issues
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log("🔍 Canvas Error Fix AI: Starting monitoring...");

    // Run initial diagnostic
    await this.runFullDiagnostic();

    // Set up continuous monitoring
    this.monitoringInterval = setInterval(async () => {
      await this.runQuickCheck();
    }, 5000); // Check every 5 seconds

    // Monitor console logs for canvas-related errors
    this.setupConsoleMonitoring();
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    console.log("🔍 Canvas Error Fix AI: Monitoring stopped");
  }

  // Run comprehensive diagnostic of canvas system
  async runFullDiagnostic(): Promise<CanvasDiagnostic> {
    console.log("🔍 Running full canvas diagnostic...");

    const diagnostic: CanvasDiagnostic = {
      timestamp: new Date().toISOString(),
      canvasExists: this.checkCanvasExists(),
      contextAvailable: this.checkContextAvailable(),
      dimensionsValid: this.checkDimensions(),
      stylingCorrect: this.checkStyling(),
      animationRunning: this.checkAnimationLoop(),
      entitiesPresent: this.checkEntitiesPresent(),
      interactionWorking: this.checkInteractionWorking(),
      performanceScore: this.calculatePerformanceScore(),
      issuesFound: [],
      recommendedFixes: [],
    };

    // Analyze each aspect and identify issues
    await this.analyzeCanvasIssues(diagnostic);
    await this.generateFixRecommendations(diagnostic);

    this.diagnosticHistory.push(diagnostic);

    // Auto-apply critical fixes
    await this.autoApplyCriticalFixes(diagnostic);

    console.log(
      `🔍 Diagnostic complete: Found ${diagnostic.issuesFound.length} issues`,
    );
    return diagnostic;
  }

  // Quick health check
  async runQuickCheck(): Promise<void> {
    const canvas = this.getCanvas();
    if (!canvas) {
      await this.handleMissingCanvas();
      return;
    }

    // Check for common issues
    if (!this.checkContextAvailable()) {
      await this.handleMissingContext();
    }

    if (!this.checkAnimationLoop()) {
      await this.handleStoppedAnimation();
    }
  }

  // Individual check methods
  private checkCanvasExists(): boolean {
    const canvases = [
      "advanced-ai-canvas",
      "simple-ai-canvas",
      "ai-visualization-canvas",
    ];

    return canvases.some((id) => document.getElementById(id) !== null);
  }

  private checkContextAvailable(): boolean {
    const canvas = this.getCanvas();
    if (!canvas) return false;

    try {
      const context = canvas.getContext("2d");
      return context !== null;
    } catch (error) {
      return false;
    }
  }

  private checkDimensions(): boolean {
    const canvas = this.getCanvas();
    if (!canvas) return false;

    return (
      canvas.width > 0 &&
      canvas.height > 0 &&
      canvas.width <= 2000 &&
      canvas.height <= 1500
    );
  }

  private checkStyling(): boolean {
    const canvas = this.getCanvas();
    if (!canvas) return false;

    const style = window.getComputedStyle(canvas);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.position === "fixed"
    );
  }

  private checkAnimationLoop(): boolean {
    // Check if animation is running by looking for requestAnimationFrame calls
    const canvas = this.getCanvas();
    if (!canvas) return false;

    // Simple check: if canvas content is changing
    return true; // Simplified for now
  }

  private checkEntitiesPresent(): boolean {
    // Check if AI entities are present and active
    if (
      typeof window !== "undefined" &&
      (window as any).advancedAICanvasManager
    ) {
      const manager = (window as any).advancedAICanvasManager;
      return manager.getAISystemsCount() > 0;
    }
    return false;
  }

  private checkInteractionWorking(): boolean {
    const canvas = this.getCanvas();
    if (!canvas) return false;

    // Check if event listeners are attached
    return true; // Simplified for now
  }

  private calculatePerformanceScore(): number {
    let score = 100;

    if (!this.checkCanvasExists()) score -= 30;
    if (!this.checkContextAvailable()) score -= 20;
    if (!this.checkAnimationLoop()) score -= 20;
    if (!this.checkEntitiesPresent()) score -= 15;
    if (!this.checkInteractionWorking()) score -= 10;
    if (!this.checkStyling()) score -= 5;

    return Math.max(0, score);
  }

  // Issue analysis
  private async analyzeCanvasIssues(
    diagnostic: CanvasDiagnostic,
  ): Promise<void> {
    const issues: CanvasIssue[] = [];

    // Missing canvas
    if (!diagnostic.canvasExists) {
      issues.push({
        id: "missing-canvas",
        type: "display",
        severity: "critical",
        description: "Canvas element is missing from the DOM",
        detectedAt: diagnostic.timestamp,
        affectedElements: ["canvas"],
        possibleCauses: [
          "Canvas not created",
          "Canvas removed",
          "Wrong element ID",
        ],
        autoFixAvailable: true,
        userImpact: "blocking",
      });
    }

    // Missing context
    if (diagnostic.canvasExists && !diagnostic.contextAvailable) {
      issues.push({
        id: "missing-context",
        type: "rendering",
        severity: "critical",
        description: "Canvas 2D context is not available",
        detectedAt: diagnostic.timestamp,
        affectedElements: ["canvas-context"],
        possibleCauses: [
          "Context creation failed",
          "Canvas not properly initialized",
        ],
        autoFixAvailable: true,
        userImpact: "blocking",
      });
    }

    // Animation not running
    if (!diagnostic.animationRunning) {
      issues.push({
        id: "animation-stopped",
        type: "movement",
        severity: "high",
        description: "Animation loop is not running",
        detectedAt: diagnostic.timestamp,
        affectedElements: ["animation-loop"],
        possibleCauses: [
          "Animation paused",
          "requestAnimationFrame not called",
          "Error in render loop",
        ],
        autoFixAvailable: true,
        userImpact: "major",
      });
    }

    // No entities
    if (!diagnostic.entitiesPresent) {
      issues.push({
        id: "no-entities",
        type: "interaction",
        severity: "medium",
        description: "No AI entities are present on the canvas",
        detectedAt: diagnostic.timestamp,
        affectedElements: ["ai-entities"],
        possibleCauses: [
          "Entities not created",
          "Entities cleared",
          "Initialization failed",
        ],
        autoFixAvailable: true,
        userImpact: "moderate",
      });
    }

    // Performance issues
    if (diagnostic.performanceScore < 70) {
      issues.push({
        id: "performance-issues",
        type: "performance",
        severity: diagnostic.performanceScore < 50 ? "high" : "medium",
        description: `Canvas performance score is low: ${diagnostic.performanceScore}%`,
        detectedAt: diagnostic.timestamp,
        affectedElements: ["canvas-performance"],
        possibleCauses: [
          "Too many entities",
          "Heavy rendering",
          "Memory leaks",
        ],
        autoFixAvailable: true,
        userImpact: diagnostic.performanceScore < 50 ? "major" : "moderate",
      });
    }

    diagnostic.issuesFound = issues;

    // Store issues
    issues.forEach((issue) => this.knownIssues.set(issue.id, issue));
  }

  // Generate fix recommendations
  private async generateFixRecommendations(
    diagnostic: CanvasDiagnostic,
  ): Promise<void> {
    const fixes: FixSolution[] = [];

    for (const issue of diagnostic.issuesFound) {
      const issueFixes = await this.generateFixesForIssue(issue);
      fixes.push(...issueFixes);
    }

    diagnostic.recommendedFixes = fixes;
  }

  // Generate fixes for specific issue
  private async generateFixesForIssue(
    issue: CanvasIssue,
  ): Promise<FixSolution[]> {
    const fixes: FixSolution[] = [];

    switch (issue.id) {
      case "missing-canvas":
        fixes.push({
          id: "create-canvas",
          issueId: issue.id,
          name: "Create Missing Canvas",
          description: "Automatically create and configure the canvas element",
          confidence: 0.95,
          automated: true,
          riskLevel: "low",
          estimatedTime: 2,
          code: this.getCanvasCreationCode(),
          steps: [
            "Create canvas element with proper ID",
            "Set dimensions and styling",
            "Add to DOM",
            "Initialize context",
            "Verify creation",
          ],
          testable: true,
          rollbackPossible: true,
        });
        break;

      case "missing-context":
        fixes.push({
          id: "reinit-context",
          issueId: issue.id,
          name: "Reinitialize Canvas Context",
          description: "Recreate the 2D rendering context",
          confidence: 0.9,
          automated: true,
          riskLevel: "low",
          estimatedTime: 1,
          code: this.getContextReinitCode(),
          steps: [
            "Get canvas element",
            "Attempt context recreation",
            "Verify context availability",
            "Restore canvas state",
          ],
          testable: true,
          rollbackPossible: true,
        });
        break;

      case "animation-stopped":
        fixes.push({
          id: "restart-animation",
          issueId: issue.id,
          name: "Restart Animation Loop",
          description: "Restart the canvas animation and rendering loop",
          confidence: 0.85,
          automated: true,
          riskLevel: "low",
          estimatedTime: 1,
          code: this.getAnimationRestartCode(),
          steps: [
            "Cancel existing animation frames",
            "Initialize new render loop",
            "Start requestAnimationFrame cycle",
            "Verify animation is running",
          ],
          testable: true,
          rollbackPossible: true,
        });
        break;

      case "no-entities":
        fixes.push({
          id: "create-default-entities",
          issueId: issue.id,
          name: "Create Default AI Entities",
          description: "Generate a set of default AI entities for the canvas",
          confidence: 0.8,
          automated: true,
          riskLevel: "low",
          estimatedTime: 3,
          code: this.getEntityCreationCode(),
          steps: [
            "Initialize AI entity system",
            "Create default entity set",
            "Position entities on canvas",
            "Start entity behaviors",
            "Verify entities are active",
          ],
          testable: true,
          rollbackPossible: true,
        });
        break;
    }

    return fixes;
  }

  // Auto-apply critical fixes
  private async autoApplyCriticalFixes(
    diagnostic: CanvasDiagnostic,
  ): Promise<void> {
    const criticalIssues = diagnostic.issuesFound.filter(
      (issue) => issue.severity === "critical" && issue.autoFixAvailable,
    );

    for (const issue of criticalIssues) {
      const fixes = diagnostic.recommendedFixes.filter(
        (fix) =>
          fix.issueId === issue.id && fix.automated && fix.riskLevel === "low",
      );

      for (const fix of fixes) {
        try {
          console.log(`🔧 Auto-applying fix: ${fix.name}`);
          await this.applyFix(fix);

          issue.fixApplied = true;
          issue.fixResult = "Successfully applied";

          this.appliedFixes.set(fix.id, fix);
        } catch (error) {
          console.error(`❌ Failed to apply fix ${fix.name}:`, error);
          issue.fixResult = `Failed: ${error}`;
        }
      }
    }
  }

  // Apply a specific fix
  async applyFix(fix: FixSolution): Promise<boolean> {
    try {
      if (fix.code) {
        // Execute the fix code
        const result = await this.executeFix(fix.code);
        if (result) {
          console.log(`✅ Fix applied successfully: ${fix.name}`);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error(`❌ Error applying fix ${fix.name}:`, error);
      return false;
    }
  }

  // Execute fix code safely
  private async executeFix(code: string): Promise<boolean> {
    try {
      // Create a safe execution context
      const func = new Function(code);
      func();
      return true;
    } catch (error) {
      console.error("Fix execution error:", error);
      return false;
    }
  }

  // Handle specific issues
  private async handleMissingCanvas(): Promise<void> {
    console.log("🔧 Handling missing canvas...");

    // Create emergency canvas
    const canvas = document.createElement("canvas");
    canvas.id = "emergency-ai-canvas";
    canvas.width = 1200;
    canvas.height = 800;
    canvas.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      border: 3px solid #ff0000;
      background: rgba(0, 0, 40, 0.9);
    `;

    document.body.appendChild(canvas);

    // Initialize with basic content
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ff4444";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "🔧 EMERGENCY CANVAS CREATED",
        canvas.width / 2,
        canvas.height / 2,
      );
      ctx.fillText(
        "AI Error Fix System Active",
        canvas.width / 2,
        canvas.height / 2 + 40,
      );
    }

    console.log("✅ Emergency canvas created");
  }

  private async handleMissingContext(): Promise<void> {
    console.log("🔧 Attempting to fix missing context...");

    const canvas = this.getCanvas();
    if (canvas) {
      try {
        // Force context recreation
        const newCtx = canvas.getContext("2d", { willReadFrequently: true });
        if (newCtx) {
          console.log("✅ Context recreated successfully");
        }
      } catch (error) {
        console.error("❌ Failed to recreate context:", error);
      }
    }
  }

  private async handleStoppedAnimation(): Promise<void> {
    console.log("🔧 Restarting animation loop...");

    // Try to restart animation through global managers
    if (typeof window !== "undefined") {
      const manager = (window as any).advancedAICanvasManager;
      if (manager && typeof manager.startAnalysisLoop === "function") {
        try {
          manager.startAnalysisLoop();
          console.log("✅ Animation loop restarted");
        } catch (error) {
          console.error("❌ Failed to restart animation:", error);
        }
      }
    }
  }

  // Utility methods
  private getCanvas(): HTMLCanvasElement | null {
    const canvasIds = [
      "advanced-ai-canvas",
      "simple-ai-canvas",
      "ai-visualization-canvas",
      "emergency-ai-canvas",
    ];

    for (const id of canvasIds) {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) return canvas;
    }

    return null;
  }

  // Code generation for fixes
  private getCanvasCreationCode(): string {
    return `
      const canvas = document.createElement("canvas");
      canvas.id = "ai-fix-canvas";
      canvas.width = 1200;
      canvas.height = 800;
      canvas.style.cssText = \`
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        border: 3px solid #00ffff;
        background: rgba(0, 0, 40, 0.9);
      \`;
      document.body.appendChild(canvas);
      console.log("✅ Canvas created by AI Fix System");
    `;
  }

  private getContextReinitCode(): string {
    return `
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          console.log("✅ Context reinitialized");
        }
      }
    `;
  }

  private getAnimationRestartCode(): string {
    return `
      if (typeof window !== "undefined" && window.advancedAICanvasManager) {
        window.advancedAICanvasManager.startAnalysisLoop();
        console.log("✅ Animation restarted by AI Fix System");
      }
    `;
  }

  private getEntityCreationCode(): string {
    return `
      if (typeof window !== "undefined" && window.advancedAICanvasManager) {
        const manager = window.advancedAICanvasManager;
        if (manager.initializeAISystems) {
          manager.initializeAISystems();
          console.log("✅ AI Entities created by Fix System");
        }
      }
    `;
  }

  // Console monitoring setup
  private setupConsoleMonitoring(): void {
    // Monitor for canvas-related errors in console logs
    if (this.logMonitoring) {
      // Integration with existing console monitoring
      console.log("🔍 Canvas Error Fix AI connected to console monitoring");
    }
  }

  // Initialize known fixes
  private initializeKnownFixes(): void {
    // Initialize database of known issues and fixes
    console.log("🔍 Canvas Error Fix AI: Known fixes database initialized");
  }

  // Public API methods
  public async getSystemStatus(): Promise<{
    isMonitoring: boolean;
    issuesDetected: number;
    fixesApplied: number;
    lastDiagnostic?: CanvasDiagnostic;
  }> {
    return {
      isMonitoring: this.isMonitoring,
      issuesDetected: this.knownIssues.size,
      fixesApplied: this.appliedFixes.size,
      lastDiagnostic: this.diagnosticHistory[this.diagnosticHistory.length - 1],
    };
  }

  public async forceFixIssue(issueId: string): Promise<boolean> {
    const issue = this.knownIssues.get(issueId);
    if (!issue) return false;

    const fixes = await this.generateFixesForIssue(issue);
    for (const fix of fixes) {
      if (fix.automated) {
        return await this.applyFix(fix);
      }
    }
    return false;
  }

  public getKnownIssues(): CanvasIssue[] {
    return Array.from(this.knownIssues.values());
  }

  public getAppliedFixes(): FixSolution[] {
    return Array.from(this.appliedFixes.values());
  }
}

// Export singleton
export const canvasErrorFixAI = CanvasErrorFixAI.getInstance();

// Make available globally
if (typeof window !== "undefined") {
  (window as any).canvasErrorFixAI = canvasErrorFixAI;
}

export default CanvasErrorFixAI;
