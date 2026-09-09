// Console Log AI Analyzer
// Extends AI services with console log analysis and fix generation

import { ConsoleLogEntry, FixSuggestion } from "./ConsoleLogMonitoringService";

export interface ErrorAnalysisResult {
  analysis: string;
  suggestions: FixSuggestion[];
  confidence: number;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  patterns: string[];
  relatedIssues: string[];
}

export class ConsoleLogAIAnalyzer {
  private knowledgeBase: Map<string, ErrorAnalysisResult> = new Map();
  private errorPatterns: RegExp[] = [];
  private fixTemplates: Map<string, FixSuggestion> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeErrorPatterns();
    this.initializeFixTemplates();
  }

  // Analyze error log and provide AI-powered insights
  async analyzeError(
    logEntry: ConsoleLogEntry,
  ): Promise<ErrorAnalysisResult | null> {
    try {
      // Check if we have a cached analysis for this error pattern
      const errorSignature = this.generateErrorSignature(logEntry);
      const cachedAnalysis = this.knowledgeBase.get(errorSignature);

      if (cachedAnalysis) {
        return cachedAnalysis;
      }

      // Perform new analysis
      const analysis = await this.performErrorAnalysis(logEntry);

      // Cache the analysis
      if (analysis) {
        this.knowledgeBase.set(errorSignature, analysis);
      }

      return analysis;
    } catch (error) {
      console.error("Error in AI analysis:", error);
      return null;
    }
  }

  // Perform detailed error analysis
  private async performErrorAnalysis(
    logEntry: ConsoleLogEntry,
  ): Promise<ErrorAnalysisResult | null> {
    const message = logEntry.message.toLowerCase();
    const stack = logEntry.stack || "";

    // DatabaseService errors
    if (message.includes("databaseservice.getinstance is not a function")) {
      return {
        analysis: `This error occurs when DatabaseService is imported incorrectly. The service exports a singleton instance as default, but the code is trying to call getInstance() as if it were a static method.`,
        suggestions: [
          {
            id: `fix_${Date.now()}_1`,
            logId: logEntry.id,
            title: "Fix DatabaseService Import",
            description: "Update import statement to use default export",
            solution:
              'Change import to: import DatabaseService from "./DatabaseService"',
            confidence: 0.95,
            automated: true,
            code: 'import DatabaseService from "./DatabaseService";\n// Now use: const result = await DatabaseService.someMethod();',
            testable: true,
          },
          {
            id: `fix_${Date.now()}_2`,
            logId: logEntry.id,
            title: "Alternative: Use getInstance Pattern",
            description:
              "If you need the getInstance pattern, update the service",
            solution:
              "Modify DatabaseService to export the class and use getInstance()",
            confidence: 0.8,
            automated: false,
            code: "export class DatabaseService {\n  private static instance: DatabaseService;\n  static getInstance() {\n    if (!this.instance) this.instance = new DatabaseService();\n    return this.instance;\n  }\n}\nexport default DatabaseService;",
            testable: true,
          },
        ],
        confidence: 0.95,
        category: "import_error",
        severity: "high",
        patterns: ["import statement", "singleton pattern", "module exports"],
        relatedIssues: ["Module resolution", "TypeScript imports"],
      };
    }

    // Missing method errors
    if (
      message.includes("is not a function") &&
      !message.includes("getinstance")
    ) {
      const methodMatch = message.match(/this\.(\w+) is not a function/);
      const methodName = methodMatch ? methodMatch[1] : "unknown";

      return {
        analysis: `The method "${methodName}" is being called but is not defined in the class. This could be due to a missing method implementation, incorrect method name, or binding issues.`,
        suggestions: [
          {
            id: `fix_${Date.now()}_1`,
            logId: logEntry.id,
            title: `Add Missing Method: ${methodName}`,
            description: `Implement the missing ${methodName} method`,
            solution: `Add the ${methodName} method to the class`,
            confidence: 0.8,
            automated: false,
            code: `async ${methodName}(): Promise<void> {\n  try {\n    // Implement ${methodName} logic here\n    console.log('${methodName} executed');\n  } catch (error) {\n    console.error('Error in ${methodName}:', error);\n  }\n}`,
            testable: true,
          },
          {
            id: `fix_${Date.now()}_2`,
            logId: logEntry.id,
            title: "Check Method Binding",
            description:
              "Ensure methods are properly bound to the class instance",
            solution: "Use arrow functions or explicit binding",
            confidence: 0.7,
            automated: true,
            code: `// Option 1: Arrow function\n${methodName} = async (): Promise<void> => {\n  // method implementation\n}\n\n// Option 2: Explicit binding\nconstructor() {\n  this.${methodName} = this.${methodName}.bind(this);\n}`,
            testable: true,
          },
        ],
        confidence: 0.8,
        category: "method_error",
        severity: "medium",
        patterns: [
          "missing method",
          "undefined function",
          "class implementation",
        ],
        relatedIssues: [
          "Method binding",
          "Class inheritance",
          "Async patterns",
        ],
      };
    }

    // Network errors
    if (message.includes("500") && message.includes("internal server error")) {
      const urlMatch = logEntry.url || stack.match(/https?:\/\/[^\s)]+/);

      return {
        analysis: `A 500 Internal Server Error indicates a problem on the server side. This could be due to server configuration issues, database problems, or unhandled exceptions in the backend code.`,
        suggestions: [
          {
            id: `fix_${Date.now()}_1`,
            logId: logEntry.id,
            title: "Add Error Handling",
            description: "Implement proper error handling for API calls",
            solution: "Add try-catch blocks and error fallbacks",
            confidence: 0.9,
            automated: true,
            code: `try {\n  const response = await fetch(url);\n  if (!response.ok) {\n    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);\n  }\n  return await response.json();\n} catch (error) {\n  console.error('API Error:', error);\n  // Implement fallback logic\n  return { error: 'Service temporarily unavailable' };\n}`,
            testable: true,
          },
          {
            id: `fix_${Date.now()}_2`,
            logId: logEntry.id,
            title: "Implement Retry Logic",
            description: "Add automatic retry mechanism for failed requests",
            solution: "Implement exponential backoff retry pattern",
            confidence: 0.8,
            automated: false,
            code: `async function fetchWithRetry(url: string, options: any, retries = 3): Promise<any> {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const response = await fetch(url, options);\n      if (response.ok) return await response.json();\n      if (response.status < 500) throw new Error('Client error');\n    } catch (error) {\n      if (i === retries - 1) throw error;\n      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));\n    }\n  }\n}`,
            testable: true,
          },
        ],
        confidence: 0.85,
        category: "network_error",
        severity: "high",
        patterns: ["server error", "api failure", "network request"],
        relatedIssues: [
          "Server configuration",
          "Database connectivity",
          "API endpoints",
        ],
      };
    }

    // Promise rejection errors
    if (message.includes("uncaught") && message.includes("promise")) {
      return {
        analysis: `Unhandled promise rejection detected. This occurs when a Promise is rejected but no .catch() handler or try-catch block is present to handle the error.`,
        suggestions: [
          {
            id: `fix_${Date.now()}_1`,
            logEntry: logEntry.id,
            title: "Add Promise Error Handling",
            description: "Wrap async calls in try-catch blocks",
            solution: "Add proper error handling to async functions",
            confidence: 0.9,
            automated: true,
            code: `// Before: someAsyncFunction();\n// After:\ntry {\n  await someAsyncFunction();\n} catch (error) {\n  console.error('Error in async operation:', error);\n  // Handle error appropriately\n}`,
            testable: true,
          },
        ],
        confidence: 0.9,
        category: "promise_error",
        severity: "medium",
        patterns: ["unhandled promise", "async error", "promise rejection"],
        relatedIssues: ["Async/await patterns", "Error propagation"],
      };
    }

    // Generic error analysis
    return {
      analysis: `Error detected: ${logEntry.message}. This appears to be a ${logEntry.category} error with ${logEntry.severity} severity. Review the stack trace and error context for more specific debugging information.`,
      suggestions: [
        {
          id: `fix_${Date.now()}_1`,
          logId: logEntry.id,
          title: "General Debug Steps",
          description: "Follow standard debugging procedures",
          solution:
            "Check console logs, verify function calls, and test with simplified inputs",
          confidence: 0.5,
          automated: false,
          testable: false,
        },
      ],
      confidence: 0.5,
      category: "general",
      severity: logEntry.severity,
      patterns: ["general error"],
      relatedIssues: ["Code review needed"],
    };
  }

  // Generate unique error signature for caching
  private generateErrorSignature(logEntry: ConsoleLogEntry): string {
    const message = logEntry.message
      .replace(/\d+/g, "NUM")
      .replace(/['"]/g, "");
    const category = logEntry.category;
    const level = logEntry.level;
    return `${level}_${category}_${message.slice(0, 100)}`;
  }

  // Initialize knowledge base with common error patterns
  private initializeKnowledgeBase(): void {
    // Pre-populate with common React/TypeScript errors
    this.knowledgeBase.set(
      "error_javascript_cannot read properties of undefined",
      {
        analysis: "Attempting to access properties of undefined object",
        suggestions: [],
        confidence: 0.8,
        category: "null_reference",
        severity: "high",
        patterns: ["null check", "optional chaining"],
        relatedIssues: ["Object validation", "Type guards"],
      },
    );
  }

  // Initialize error patterns for pattern matching
  private initializeErrorPatterns(): void {
    this.errorPatterns = [
      /TypeError: .+ is not a function/,
      /ReferenceError: .+ is not defined/,
      /Cannot read properties of .+/,
      /Uncaught \(in promise\)/,
      /Network Error/,
      /Failed to fetch/,
      /\d+ \(Internal Server Error\)/,
    ];
  }

  // Initialize fix templates
  private initializeFixTemplates(): void {
    this.fixTemplates.set("import_fix", {
      id: "template_import",
      logId: "",
      title: "Fix Import Statement",
      description: "Correct module import syntax",
      solution: "Update import statement",
      confidence: 0.9,
      automated: true,
      testable: true,
    });
  }

  // Learn from user feedback
  async learnFromFeedback(
    logEntry: ConsoleLogEntry,
    appliedFix: FixSuggestion,
    wasSuccessful: boolean,
  ): Promise<void> {
    const signature = this.generateErrorSignature(logEntry);
    const analysis = this.knowledgeBase.get(signature);

    if (analysis) {
      // Update confidence based on feedback
      if (wasSuccessful) {
        analysis.confidence = Math.min(1.0, analysis.confidence + 0.1);
      } else {
        analysis.confidence = Math.max(0.1, analysis.confidence - 0.1);
      }

      this.knowledgeBase.set(signature, analysis);
    }
  }

  // Get error statistics
  getAnalysisStatistics(): {
    totalAnalyzed: number;
    categoriesCount: Record<string, number>;
    averageConfidence: number;
    topPatterns: string[];
  } {
    const analyses = Array.from(this.knowledgeBase.values());
    const totalAnalyzed = analyses.length;

    const categoriesCount: Record<string, number> = {};
    let totalConfidence = 0;
    const patterns: string[] = [];

    analyses.forEach((analysis) => {
      categoriesCount[analysis.category] =
        (categoriesCount[analysis.category] || 0) + 1;
      totalConfidence += analysis.confidence;
      patterns.push(...analysis.patterns);
    });

    const averageConfidence =
      totalAnalyzed > 0 ? totalConfidence / totalAnalyzed : 0;
    const topPatterns = Array.from(new Set(patterns)).slice(0, 10);

    return {
      totalAnalyzed,
      categoriesCount,
      averageConfidence,
      topPatterns,
    };
  }
}

export default ConsoleLogAIAnalyzer;
