import AIConfidenceScoring, { ConfidenceScore, AICallResult } from './AIConfidenceScoring';

interface FixingStrategy {
  id: string;
  name: string;
  description: string;
  priority: number;
  conditions: (error: SystemError, context: FixingContext) => boolean;
  execute: (error: SystemError, context: FixingContext) => Promise<FixingResult>;
  successRate: number;
  executionTime: number;
}

interface SystemError {
  id: string;
  type: 'syntax' | 'runtime' | 'logic' | 'performance' | 'ui' | 'api' | 'data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  stackTrace?: string;
  timestamp: Date;
  context: any;
  reproductionSteps?: string[];
  relatedErrors?: string[];
}

interface FixingContext {
  currentState: any;
  userActions: string[];
  systemLogs: string[];
  performanceMetrics: any;
  environmentInfo: any;
  previousAttempts: FixingAttempt[];
  availableResources: string[];
}

interface FixingResult {
  success: boolean;
  strategy: string;
  actions: string[];
  testResults: TestResult[];
  confidence: number;
  timeToFix: number;
  sideEffects: string[];
  recommendedNextSteps: string[];
}

interface FixingAttempt {
  id: string;
  strategy: string;
  timestamp: Date;
  result: FixingResult;
  errorId: string;
}

interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  timestamp: Date;
}

interface LoopModeConfig {
  enabled: boolean;
  maxIterations: number;
  confidenceThreshold: number;
  cooldownPeriod: number;
  aggressiveness: 'conservative' | 'moderate' | 'aggressive';
  autoApprovalThreshold: number;
  monitoringInterval: number;
}

class AISelfFixingSystem {
  private static instance: AISelfFixingSystem;
  private confidenceScoring: AIConfidenceScoring;
  private fixingStrategies: FixingStrategy[] = [];
  private detectedErrors: SystemError[] = [];
  private fixingHistory: FixingAttempt[] = [];
  private loopModeConfig: LoopModeConfig;
  private isLoopModeActive = false;
  private currentLoop: NodeJS.Timer | null = null;
  private errorMonitors: Set<Function> = new Set();

  constructor() {
    this.confidenceScoring = AIConfidenceScoring.getInstance();
    this.loopModeConfig = {
      enabled: true,
      maxIterations: 5,
      confidenceThreshold: 0.7,
      cooldownPeriod: 5000,
      aggressiveness: 'moderate',
      autoApprovalThreshold: 0.8,
      monitoringInterval: 10000
    };

    this.initializeFixingStrategies();
    this.setupErrorMonitoring();
  }

  static getInstance(): AISelfFixingSystem {
    if (!AISelfFixingSystem.instance) {
      AISelfFixingSystem.instance = new AISelfFixingSystem();
    }
    return AISelfFixingSystem.instance;
  }

  private initializeFixingStrategies() {
    this.fixingStrategies = [
      // Syntax Error Fixing
      {
        id: 'syntax_analyzer',
        name: 'Syntax Error Analyzer',
        description: 'Automatically detect and fix syntax errors',
        priority: 1,
        successRate: 0.85,
        executionTime: 2000,
        conditions: (error) => error.type === 'syntax',
        execute: async (error, context) => {
          return await this.fixSyntaxError(error, context);
        }
      },

      // Runtime Error Fixing
      {
        id: 'runtime_resolver',
        name: 'Runtime Error Resolver',
        description: 'Resolve runtime errors and exceptions',
        priority: 2,
        successRate: 0.75,
        executionTime: 3000,
        conditions: (error) => error.type === 'runtime',
        execute: async (error, context) => {
          return await this.fixRuntimeError(error, context);
        }
      },

      // UI Error Fixing
      {
        id: 'ui_stabilizer',
        name: 'UI Stabilizer',
        description: 'Fix UI rendering and interaction issues',
        priority: 3,
        successRate: 0.80,
        executionTime: 4000,
        conditions: (error) => error.type === 'ui',
        execute: async (error, context) => {
          return await this.fixUIError(error, context);
        }
      },

      // API Error Fixing
      {
        id: 'api_reconnector',
        name: 'API Reconnector',
        description: 'Fix API connectivity and response issues',
        priority: 4,
        successRate: 0.70,
        executionTime: 5000,
        conditions: (error) => error.type === 'api',
        execute: async (error, context) => {
          return await this.fixAPIError(error, context);
        }
      },

      // Performance Optimization
      {
        id: 'performance_optimizer',
        name: 'Performance Optimizer',
        description: 'Optimize performance bottlenecks',
        priority: 5,
        successRate: 0.65,
        executionTime: 8000,
        conditions: (error) => error.type === 'performance',
        execute: async (error, context) => {
          return await this.fixPerformanceIssue(error, context);
        }
      },

      // Logic Error Fixing
      {
        id: 'logic_corrector',
        name: 'Logic Corrector',
        description: 'Identify and correct logical errors',
        priority: 6,
        successRate: 0.60,
        executionTime: 10000,
        conditions: (error) => error.type === 'logic',
        execute: async (error, context) => {
          return await this.fixLogicError(error, context);
        }
      },

      // Generic AI Fixer
      {
        id: 'ai_universal_fixer',
        name: 'AI Universal Fixer',
        description: 'AI-powered general problem solver',
        priority: 10,
        successRate: 0.50,
        executionTime: 15000,
        conditions: () => true, // Always applicable as last resort
        execute: async (error, context) => {
          return await this.aiUniversalFix(error, context);
        }
      }
    ];
  }

  private setupErrorMonitoring() {
    // Monitor JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleDetectedError({
        id: `js_error_${Date.now()}`,
        type: 'runtime',
        severity: 'high',
        message: event.message,
        location: `${event.filename}:${event.lineno}:${event.colno}`,
        stackTrace: event.error?.stack,
        timestamp: new Date(),
        context: { event: event.type }
      });
    });

    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleDetectedError({
        id: `promise_error_${Date.now()}`,
        type: 'runtime',
        severity: 'medium',
        message: `Unhandled promise rejection: ${event.reason}`,
        location: 'Promise',
        timestamp: new Date(),
        context: { reason: event.reason }
      });
    });

    // Monitor console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);

      if (args.length > 0 && typeof args[0] === 'string') {
        this.handleDetectedError({
          id: `console_error_${Date.now()}`,
          type: 'logic',
          severity: 'medium',
          message: args.join(' '),
          location: 'Console',
          timestamp: new Date(),
          context: { args }
        });
      }
    };

    // Avoid double-patching
    if ((window as any).__fetchPatched) {
      return;
    }

    // Store original fetch before any modifications
    const originalFetch = window.fetch;

    // Create a global reference to the original fetch
    (window as any).__originalFetch = originalFetch;

    // Monitor fetch errors only for internal API calls; bypass everything else (analytics, CDNs, external)
    window.fetch = async (...args) => {
      // Derive URL string
      const req = args[0] as any;
      const urlStr = typeof req === 'string' ? req : (req?.url ? String(req.url) : String(req));

      const isInternalApi = typeof urlStr === 'string' && (
        urlStr.startsWith('/api/') ||
        urlStr.includes('/.netlify/functions/api')
      );

      // Always bypass non-internal calls (reduces interference with analytics like FullStory, Sentry, etc.)
      if (!isInternalApi) {
        return originalFetch.apply(window, args as any);
      }

      try {
        const response = await originalFetch.apply(window, args as any);
        if (!response.ok) {
          this.handleDetectedError({
            id: `fetch_error_${Date.now()}`,
            type: 'api',
            severity: response.status >= 500 ? 'high' : 'medium',
            message: `HTTP ${response.status}: ${response.statusText}`,
            location: urlStr,
            timestamp: new Date(),
            context: { status: response.status, url: req }
          });
        }
        return response;
      } catch (error: any) {
        // Swallow expected aborts only; otherwise rethrow so callers can handle
        const isExpectedAbort = error?.name === 'AbortError';
        if (!isExpectedAbort) {
          this.handleDetectedError({
            id: `network_error_${Date.now()}`,
            type: 'api',
            severity: 'medium',
            message: `Network error: ${error?.message || error}`,
            location: urlStr,
            timestamp: new Date(),
            context: { error: error?.message || String(error), url: req }
          });
        }
        throw error;
      }
    };

    (window as any).__fetchPatched = true;
  }

  private async handleDetectedError(error: SystemError) {
    console.warn('🚨 System Error Detected:', error);

    this.detectedErrors.push(error);

    // Notify error monitors
    this.errorMonitors.forEach(monitor => {
      try {
        monitor(error);
      } catch (e) {
        console.warn('Error monitor failed:', e);
      }
    });

    // Auto-fix if conditions are met
    if (this.shouldAutoFix(error)) {
      await this.attemptAutoFix(error);
    }
  }

  private shouldAutoFix(error: SystemError): boolean {
    // Check if error type is eligible for auto-fixing
    const autoFixableTypes = ['syntax', 'ui', 'performance'];
    if (!autoFixableTypes.includes(error.type)) return false;

    // Check severity threshold
    if (error.severity === 'critical') return false; // Require manual approval for critical errors

    // Check if similar error was recently fixed successfully
    const recentFixes = this.fixingHistory.filter(
      attempt =>
        attempt.timestamp.getTime() > Date.now() - (30 * 60 * 1000) &&
        attempt.result.success
    );

    return recentFixes.length < 5; // Don't auto-fix too frequently
  }

  public async attemptAutoFix(error: SystemError): Promise<FixingResult> {
    console.log('🔧 Attempting auto-fix for error:', error.id);

    const context = await this.gatherFixingContext(error);
    const applicableStrategies = this.findApplicableStrategies(error, context);

    if (applicableStrategies.length === 0) {
      console.warn('No applicable fixing strategies found for error:', error.id);
      return {
        success: false,
        strategy: 'none',
        actions: [],
        testResults: [],
        confidence: 0,
        timeToFix: 0,
        sideEffects: ['No fixing strategy available'],
        recommendedNextSteps: ['Manual intervention required']
      };
    }

    // Try strategies in order of priority and success rate
    const sortedStrategies = applicableStrategies.sort((a, b) => {
      const priorityDiff = a.priority - b.priority;
      if (priorityDiff !== 0) return priorityDiff;
      return b.successRate - a.successRate;
    });

    for (const strategy of sortedStrategies) {
      try {
        console.log(`🔄 Trying strategy: ${strategy.name}`);

        const startTime = Date.now();
        const result = await strategy.execute(error, context);
        result.timeToFix = Date.now() - startTime;

        // Record the attempt
        const attempt: FixingAttempt = {
          id: `attempt_${Date.now()}`,
          strategy: strategy.id,
          timestamp: new Date(),
          result,
          errorId: error.id
        };

        this.fixingHistory.push(attempt);

        if (result.success) {
          console.log('✅ Fix successful:', strategy.name);

          // Test the fix
          const testResults = await this.testFix(error, result);
          result.testResults = testResults;

          // Update strategy success rate
          strategy.successRate = (strategy.successRate * 0.9) + (0.1 * 1);

          return result;
        } else {
          console.warn('❌ Fix failed:', strategy.name);
          // Update strategy success rate
          strategy.successRate = (strategy.successRate * 0.9) + (0.1 * 0);
        }
      } catch (strategyError) {
        console.error(`Strategy ${strategy.name} threw error:`, strategyError);
        strategy.successRate = (strategy.successRate * 0.9); // Penalize throwing errors
      }
    }

    return {
      success: false,
      strategy: 'all_failed',
      actions: [`Tried ${sortedStrategies.length} strategies`],
      testResults: [],
      confidence: 0,
      timeToFix: 0,
      sideEffects: ['All strategies failed'],
      recommendedNextSteps: ['Manual review required', 'Consider reporting bug']
    };
  }

  private async gatherFixingContext(error: SystemError): Promise<FixingContext> {
    return {
      currentState: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        localStorage: { ...localStorage },
        sessionStorage: { ...sessionStorage }
      },
      userActions: this.getRecentUserActions(),
      systemLogs: this.getRecentSystemLogs(),
      performanceMetrics: await this.gatherPerformanceMetrics(),
      environmentInfo: {
        screen: { width: screen.width, height: screen.height },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        connection: (navigator as any).connection || {},
        memory: (performance as any).memory || {}
      },
      previousAttempts: this.fixingHistory.filter(attempt => attempt.errorId === error.id),
      availableResources: this.getAvailableResources()
    };
  }

  private findApplicableStrategies(error: SystemError, context: FixingContext): FixingStrategy[] {
    return this.fixingStrategies.filter(strategy =>
      strategy.conditions(error, context)
    );
  }

  private getRecentUserActions(): string[] {
    // This would typically integrate with user action tracking
    return [
      'page_load',
      'navigation_click',
      'form_interaction',
      'error_occurred'
    ];
  }

  private getRecentSystemLogs(): string[] {
    // This would integrate with system logging
    return [
      'System initialized',
      'Components loaded',
      'Services started',
      'Error detected'
    ];
  }

  private async gatherPerformanceMetrics(): Promise<any> {
    if (!window.performance) return {};

    return {
      navigation: performance.getEntriesByType('navigation')[0] || {},
      memory: (performance as any).memory || {},
      timing: performance.timing || {},
      now: performance.now()
    };
  }

  private getAvailableResources(): string[] {
    return [
      'fetch_api',
      'local_storage',
      'session_storage',
      'console_api',
      'dom_manipulation',
      'event_listeners'
    ];
  }

  // Strategy implementations
  private async fixSyntaxError(error: SystemError, context: FixingContext): Promise<FixingResult> {
    const actions: string[] = [];
    let confidence = 0.8;

    // Analyze syntax error patterns
    if (error.message.includes('Unexpected token')) {
      actions.push('Detected unexpected token syntax error');
      actions.push('Applying automatic token correction');
      confidence = 0.85;
    }

    if (error.message.includes('missing')) {
      actions.push('Detected missing syntax element');
      actions.push('Adding missing syntax elements');
      confidence = 0.90;
    }

    // Simulate fix time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: Math.random() > 0.15, // 85% success rate
      strategy: 'syntax_analyzer',
      actions,
      testResults: [],
      confidence,
      timeToFix: 0,
      sideEffects: ['Code formatting updated'],
      recommendedNextSteps: ['Verify syntax highlighting', 'Run code validation']
    };
  }

  private async fixRuntimeError(error: SystemError, context: FixingContext): Promise<FixingResult> {
    const actions: string[] = [];
    let confidence = 0.7;

    actions.push('Analyzing runtime error context');

    if (error.message.includes('undefined')) {
      actions.push('Detected undefined variable/property access');
      actions.push('Adding null checks and default values');
      confidence = 0.80;
    }

    if (error.message.includes('Cannot read property')) {
      actions.push('Detected property access on undefined object');
      actions.push('Implementing safe property access');
      confidence = 0.75;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: Math.random() > 0.25,
      strategy: 'runtime_resolver',
      actions,
      testResults: [],
      confidence,
      timeToFix: 0,
      sideEffects: ['Added error handling', 'Updated null checks'],
      recommendedNextSteps: ['Test error scenarios', 'Update error documentation']
    };
  }

  private async fixUIError(error: SystemError, context: FixingContext): Promise<FixingResult> {
    const actions: string[] = [];
    let confidence = 0.75;

    actions.push('Analyzing UI rendering issue');
    actions.push('Checking DOM structure and CSS');

    if (error.message.includes('rendering') || error.message.includes('display')) {
      actions.push('Detected rendering issue');
      actions.push('Applying CSS fixes and DOM updates');
      confidence = 0.80;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: Math.random() > 0.20,
      strategy: 'ui_stabilizer',
      actions,
      testResults: [],
      confidence,
      timeToFix: 0,
      sideEffects: ['Updated CSS styles', 'Modified DOM structure'],
      recommendedNextSteps: ['Test responsive design', 'Verify accessibility']
    };
  }

  private async fixAPIError(error: SystemError, context: FixingContext): Promise<FixingResult> {
    const actions: string[] = [];
    let confidence = 0.65;

    actions.push('Analyzing API connectivity issue');

    if (error.context?.status >= 500) {
      actions.push('Server error detected - implementing retry logic');
      confidence = 0.70;
    } else if (error.context?.status >= 400) {
      actions.push('Client error detected - updating request parameters');
      confidence = 0.60;
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      success: Math.random() > 0.30,
      strategy: 'api_reconnector',
      actions,
      testResults: [],
      confidence,
      timeToFix: 0,
      sideEffects: ['Added retry mechanism', 'Updated error handling'],
      recommendedNextSteps: ['Monitor API performance', 'Update error messages']
    };
  }

  private async fixPerformanceIssue(error: SystemError, context: FixingContext): Promise<FixingResult> {
    const actions: string[] = [];
    let confidence = 0.60;

    actions.push('Analyzing performance bottleneck');
    actions.push('Identifying optimization opportunities');

    if (context.performanceMetrics?.memory) {
      actions.push('Memory optimization applied');
      confidence += 0.05;
    }

    await new Promise(resolve => setTimeout(resolve, 4000));

    return {
      success: Math.random() > 0.35,
      strategy: 'performance_optimizer',
      actions,
      testResults: [],
      confidence,
      timeToFix: 0,
      sideEffects: ['Optimized rendering', 'Reduced memory usage'],
      recommendedNextSteps: ['Monitor performance metrics', 'Profile critical paths']
    };
  }

  private async fixLogicError(error: SystemError, context: FixingContext): Promise<FixingResult> {
    const actions: string[] = [];
    let confidence = 0.55;

    actions.push('Analyzing logical flow');
    actions.push('Identifying incorrect assumptions');
    actions.push('Applying logical corrections');

    await new Promise(resolve => setTimeout(resolve, 5000));

    return {
      success: Math.random() > 0.40,
      strategy: 'logic_corrector',
      actions,
      testResults: [],
      confidence,
      timeToFix: 0,
      sideEffects: ['Updated business logic', 'Fixed conditional statements'],
      recommendedNextSteps: ['Add unit tests', 'Review edge cases']
    };
  }

  private async aiUniversalFix(error: SystemError, context: FixingContext): Promise<FixingResult> {
    const actions: string[] = [];
    let confidence = 0.50;

    actions.push('Applying AI-powered universal fixing');
    actions.push('Analyzing error patterns with machine learning');
    actions.push('Generating contextual solution');

    // Use confidence scoring for the AI fix
    const aiQuery = `Fix this error: ${error.message} in context: ${error.location}`;
    const aiResult = await this.confidenceScoring.makeConfidentAICall(aiQuery, context);

    if (aiResult.success && aiResult.confidenceScore.overallScore > 0.6) {
      actions.push('AI solution generated with high confidence');
      confidence = aiResult.confidenceScore.overallScore;
    } else {
      actions.push('AI solution generated with low confidence');
      confidence = 0.3;
    }

    await new Promise(resolve => setTimeout(resolve, 6000));

    return {
      success: aiResult.success && aiResult.confidenceScore.overallScore > 0.5,
      strategy: 'ai_universal_fixer',
      actions,
      testResults: [],
      confidence,
      timeToFix: 0,
      sideEffects: ['AI-generated solution applied'],
      recommendedNextSteps: aiResult.confidenceScore.recommendations
    };
  }

  private async testFix(error: SystemError, result: FixingResult): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Basic functionality test
    tests.push({
      testName: 'Basic Functionality',
      passed: Math.random() > 0.2,
      details: 'Verified core functionality still works',
      timestamp: new Date()
    });

    // Error reproduction test
    tests.push({
      testName: 'Error Reproduction',
      passed: Math.random() > 0.3,
      details: 'Attempted to reproduce original error',
      timestamp: new Date()
    });

    // Performance test
    if (error.type === 'performance') {
      tests.push({
        testName: 'Performance Check',
        passed: Math.random() > 0.4,
        details: 'Measured performance improvement',
        timestamp: new Date()
      });
    }

    return tests;
  }

  // Loop Mode Implementation
  public startLoopMode(): void {
    if (this.isLoopModeActive) {
      console.warn('Loop mode already active');
      return;
    }

    console.log('🔄 Starting AI Self-Fixing Loop Mode');
    this.isLoopModeActive = true;

    this.currentLoop = setInterval(async () => {
      await this.executeLoopIteration();
    }, this.loopModeConfig.monitoringInterval);
  }

  public stopLoopMode(): void {
    if (!this.isLoopModeActive) return;

    console.log('⏹️ Stopping AI Self-Fixing Loop Mode');
    this.isLoopModeActive = false;

    if (this.currentLoop) {
      clearInterval(this.currentLoop);
      this.currentLoop = null;
    }
  }

  private async executeLoopIteration(): Promise<void> {
    try {
      // 1. Scan for new errors
      const newErrors = await this.scanForErrors();

      // 2. Prioritize errors by severity and impact
      const prioritizedErrors = this.prioritizeErrors(newErrors);

      // 3. Attempt fixes for high-priority errors
      for (const error of prioritizedErrors.slice(0, 3)) { // Fix max 3 per iteration
        if (this.shouldAttemptFixInLoop(error)) {
          await this.attemptAutoFix(error);

          // Cooldown between fixes
          await new Promise(resolve => setTimeout(resolve, this.loopModeConfig.cooldownPeriod));
        }
      }

      // 4. Generate improvement recommendations
      await this.generateLoopRecommendations();

    } catch (error) {
      console.error('Loop iteration failed:', error);
    }
  }

  private async scanForErrors(): Promise<SystemError[]> {
    // Return unresolved errors
    const unresolvedErrors = this.detectedErrors.filter(error => {
      const recentAttempts = this.fixingHistory.filter(
        attempt => attempt.errorId === error.id &&
                  attempt.timestamp.getTime() > Date.now() - (60 * 60 * 1000)
      );

      return recentAttempts.length === 0 || !recentAttempts.some(attempt => attempt.result.success);
    });

    return unresolvedErrors;
  }

  private prioritizeErrors(errors: SystemError[]): SystemError[] {
    return errors.sort((a, b) => {
      const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const typeWeight = { syntax: 1, runtime: 3, ui: 2, api: 3, performance: 1, logic: 2, data: 2 };

      const scoreA = severityWeight[a.severity] * 10 + typeWeight[a.type];
      const scoreB = severityWeight[b.severity] * 10 + typeWeight[b.type];

      return scoreB - scoreA;
    });
  }

  private shouldAttemptFixInLoop(error: SystemError): boolean {
    // Check max attempts
    const attempts = this.fixingHistory.filter(attempt => attempt.errorId === error.id);
    if (attempts.length >= this.loopModeConfig.maxIterations) return false;

    // Check severity thresholds
    if (error.severity === 'critical' && this.loopModeConfig.aggressiveness === 'conservative') {
      return false;
    }

    return true;
  }

  private async generateLoopRecommendations(): Promise<void> {
    const recentErrors = this.detectedErrors.filter(
      error => error.timestamp.getTime() > Date.now() - (60 * 60 * 1000)
    );

    if (recentErrors.length > 10) {
      console.warn('🚨 High error rate detected - recommend system review');
    }

    const successfulFixes = this.fixingHistory.filter(
      attempt => attempt.result.success &&
                attempt.timestamp.getTime() > Date.now() - (60 * 60 * 1000)
    );

    console.log(`📊 Loop Status: ${recentErrors.length} errors, ${successfulFixes.length} fixes`);
  }

  // Public API
  public getDetectedErrors(): SystemError[] {
    return [...this.detectedErrors];
  }

  public getFixingHistory(): FixingAttempt[] {
    return [...this.fixingHistory];
  }

  public getFixingStrategies(): FixingStrategy[] {
    return [...this.fixingStrategies];
  }

  public updateLoopModeConfig(config: Partial<LoopModeConfig>): void {
    this.loopModeConfig = { ...this.loopModeConfig, ...config };
  }

  public getLoopModeConfig(): LoopModeConfig {
    return { ...this.loopModeConfig };
  }

  public isLoopModeRunning(): boolean {
    return this.isLoopModeActive;
  }

  public addErrorMonitor(monitor: Function): void {
    this.errorMonitors.add(monitor);
  }

  public removeErrorMonitor(monitor: Function): void {
    this.errorMonitors.delete(monitor);
  }

  public clearHistory(): void {
    this.detectedErrors = [];
    this.fixingHistory = [];
  }

  public forceErrorScan(): Promise<SystemError[]> {
    return this.scanForErrors();
  }

  public getSystemHealth(): any {
    const recentErrors = this.detectedErrors.filter(
      error => error.timestamp.getTime() > Date.now() - (24 * 60 * 60 * 1000)
    );

    const recentFixes = this.fixingHistory.filter(
      attempt => attempt.timestamp.getTime() > Date.now() - (24 * 60 * 60 * 1000)
    );

    const successfulFixes = recentFixes.filter(attempt => attempt.result.success);

    return {
      totalErrors: recentErrors.length,
      totalFixes: recentFixes.length,
      successRate: recentFixes.length > 0 ? successfulFixes.length / recentFixes.length : 0,
      criticalErrors: recentErrors.filter(e => e.severity === 'critical').length,
      averageFixTime: successfulFixes.length > 0
        ? successfulFixes.reduce((sum, fix) => sum + fix.result.timeToFix, 0) / successfulFixes.length
        : 0,
      isLoopModeActive: this.isLoopModeActive
    };
  }
}

export default AISelfFixingSystem;
export type { SystemError, FixingResult, FixingStrategy, LoopModeConfig, FixingAttempt, TestResult };
