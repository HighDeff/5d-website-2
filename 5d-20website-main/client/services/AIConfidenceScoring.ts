interface ConfidenceMetrics {
  responseAccuracy: number;
  contextRelevance: number;
  taskCompletion: number;
  errorRate: number;
  responseTime: number;
  userSatisfaction: number;
}

interface ConfidenceScore {
  id: string;
  timestamp: Date;
  inputQuery: string;
  response: string;
  metrics: ConfidenceMetrics;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  autoFixSuggestions: string[];
}

interface AICallResult {
  success: boolean;
  response: string;
  confidenceScore: ConfidenceScore;
  shouldRetry: boolean;
  alternativeApproaches?: string[];
}

class AIConfidenceScoring {
  private static instance: AIConfidenceScoring;
  private confidenceHistory: ConfidenceScore[] = [];
  private errorPatterns: Map<string, number> = new Map();
  private successPatterns: Map<string, number> = new Map();
  private activeMonitoring = true;

  constructor() {
    this.loadHistoricalData();
    this.startContinuousMonitoring();
  }

  static getInstance(): AIConfidenceScoring {
    if (!AIConfidenceScoring.instance) {
      AIConfidenceScoring.instance = new AIConfidenceScoring();
    }
    return AIConfidenceScoring.instance;
  }

  private loadHistoricalData() {
    try {
      const saved = localStorage.getItem('ai_confidence_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all timestamps are Date objects
        this.confidenceHistory = parsed.map((score: any) => ({
          ...score,
          timestamp: score.timestamp instanceof Date ? score.timestamp : new Date(score.timestamp)
        }));
      }

      const patterns = localStorage.getItem('ai_error_patterns');
      if (patterns) {
        this.errorPatterns = new Map(JSON.parse(patterns));
      }

      const successData = localStorage.getItem('ai_success_patterns');
      if (successData) {
        this.successPatterns = new Map(JSON.parse(successData));
      }
    } catch (error) {
      console.warn('Failed to load AI confidence historical data:', error);
    }
  }

  private saveData() {
    try {
      // Ensure all timestamps are properly serialized
      const historyToSave = this.confidenceHistory.map(score => ({
        ...score,
        timestamp: score.timestamp instanceof Date ? score.timestamp.toISOString() : score.timestamp
      }));

      localStorage.setItem('ai_confidence_history', JSON.stringify(historyToSave));
      localStorage.setItem('ai_error_patterns', JSON.stringify([...this.errorPatterns.entries()]));
      localStorage.setItem('ai_success_patterns', JSON.stringify([...this.successPatterns.entries()]));
    } catch (error) {
      console.warn('Failed to save AI confidence data:', error);
    }
  }

  private startContinuousMonitoring() {
    setInterval(() => {
      if (this.activeMonitoring) {
        this.analyzeRecentPerformance();
        this.updateErrorPatterns();
        this.generatePreventiveRecommendations();
      }
    }, 30000); // Every 30 seconds
  }

  public async evaluateAICall(
    inputQuery: string,
    aiResponse: string,
    executionTime: number,
    context?: any
  ): Promise<ConfidenceScore> {
    const metrics = await this.calculateMetrics(inputQuery, aiResponse, executionTime, context);
    const overallScore = this.calculateOverallScore(metrics);
    const riskLevel = this.determineRiskLevel(overallScore, metrics);
    const recommendations = this.generateRecommendations(metrics, inputQuery, aiResponse);
    const autoFixSuggestions = this.generateAutoFixSuggestions(metrics, inputQuery);

    const confidenceScore: ConfidenceScore = {
      id: `conf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      inputQuery,
      response: aiResponse,
      metrics,
      overallScore,
      riskLevel,
      recommendations,
      autoFixSuggestions
    };

    this.confidenceHistory.push(confidenceScore);
    this.updatePatterns(inputQuery, aiResponse, overallScore);
    this.saveData();

    return confidenceScore;
  }

  private async calculateMetrics(
    inputQuery: string,
    aiResponse: string,
    executionTime: number,
    context?: any
  ): Promise<ConfidenceMetrics> {
    // Response accuracy (based on response length, relevance keywords, etc.)
    const responseAccuracy = this.calculateResponseAccuracy(inputQuery, aiResponse);

    // Context relevance (how well the response matches the context)
    const contextRelevance = this.calculateContextRelevance(inputQuery, aiResponse, context);

    // Task completion assessment
    const taskCompletion = this.assessTaskCompletion(inputQuery, aiResponse);

    // Error rate (based on historical patterns)
    const errorRate = this.calculateErrorRate(inputQuery);

    // Response time score (faster is better, within reason)
    const responseTime = this.scoreResponseTime(executionTime);

    // User satisfaction (simulated based on patterns)
    const userSatisfaction = this.estimateUserSatisfaction(inputQuery, aiResponse);

    return {
      responseAccuracy,
      contextRelevance,
      taskCompletion,
      errorRate,
      responseTime,
      userSatisfaction
    };
  }

  private calculateResponseAccuracy(inputQuery: string, aiResponse: string): number {
    // Analyze response quality
    let score = 0.5; // Base score

    // Check for meaningful response length
    if (aiResponse.length > 50) score += 0.2;
    if (aiResponse.length > 200) score += 0.1;

    // Check for relevant keywords from input
    const inputWords = inputQuery.toLowerCase().split(/\s+/);
    const responseWords = aiResponse.toLowerCase().split(/\s+/);

    const relevantWords = inputWords.filter(word =>
      word.length > 3 && responseWords.some(rWord => rWord.includes(word))
    );

    score += Math.min(0.3, relevantWords.length * 0.05);

    // Check for error indicators
    if (aiResponse.toLowerCase().includes('error') ||
        aiResponse.toLowerCase().includes('sorry') ||
        aiResponse.toLowerCase().includes('cannot')) {
      score -= 0.2;
    }

    // Check for helpful structure
    if (aiResponse.includes('\n') || aiResponse.includes('•') || aiResponse.includes('-')) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateContextRelevance(inputQuery: string, aiResponse: string, context?: any): number {
    let score = 0.6; // Base score

    if (context) {
      // Check if response uses context information
      if (context.currentPage && aiResponse.toLowerCase().includes(context.currentPage.toLowerCase())) {
        score += 0.2;
      }

      if (context.userRole && aiResponse.toLowerCase().includes(context.userRole.toLowerCase())) {
        score += 0.1;
      }

      if (context.recentActions && context.recentActions.some((action: string) =>
        aiResponse.toLowerCase().includes(action.toLowerCase()))) {
        score += 0.1;
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  private assessTaskCompletion(inputQuery: string, aiResponse: string): number {
    let score = 0.5;

    // Check if query is a question and response provides answer
    if (inputQuery.includes('?')) {
      if (aiResponse.length > 20 && !aiResponse.toLowerCase().includes("i don't know")) {
        score += 0.3;
      }
    }

    // Check if query is a request and response indicates action
    if (inputQuery.toLowerCase().includes('create') ||
        inputQuery.toLowerCase().includes('fix') ||
        inputQuery.toLowerCase().includes('help')) {

      if (aiResponse.toLowerCase().includes('will') ||
          aiResponse.toLowerCase().includes('can') ||
          aiResponse.toLowerCase().includes('here')) {
        score += 0.3;
      }
    }

    // Check for completeness indicators
    if (aiResponse.toLowerCase().includes('complete') ||
        aiResponse.toLowerCase().includes('done') ||
        aiResponse.toLowerCase().includes('finished')) {
      score += 0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateErrorRate(inputQuery: string): number {
    const similarQueries = this.findSimilarQueries(inputQuery);
    const totalQueries = similarQueries.length;

    if (totalQueries === 0) return 0.5; // No historical data

    const errorQueries = similarQueries.filter(score => score.overallScore < 0.3).length;
    const errorRate = errorQueries / totalQueries;

    return 1 - errorRate; // Convert to success rate
  }

  private scoreResponseTime(executionTime: number): number {
    // Optimal response time is 1-3 seconds
    if (executionTime < 1000) return 0.8; // Too fast, might be cached/simple
    if (executionTime < 3000) return 1.0; // Optimal
    if (executionTime < 10000) return 0.8; // Acceptable
    if (executionTime < 30000) return 0.5; // Slow
    return 0.2; // Very slow
  }

  private estimateUserSatisfaction(inputQuery: string, aiResponse: string): number {
    let score = 0.6;

    // Positive indicators
    if (aiResponse.toLowerCase().includes('help') ||
        aiResponse.toLowerCase().includes('assist') ||
        aiResponse.toLowerCase().includes('solution')) {
      score += 0.2;
    }

    // Comprehensive response
    if (aiResponse.length > 100) {
      score += 0.1;
    }

    // Structured response
    if (aiResponse.includes('\n\n') || aiResponse.match(/\d+\./)) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateOverallScore(metrics: ConfidenceMetrics): number {
    // Weighted average of all metrics
    const weights = {
      responseAccuracy: 0.25,
      contextRelevance: 0.20,
      taskCompletion: 0.25,
      errorRate: 0.15,
      responseTime: 0.10,
      userSatisfaction: 0.05
    };

    return Object.entries(weights).reduce((total, [metric, weight]) => {
      return total + (metrics[metric as keyof ConfidenceMetrics] * weight);
    }, 0);
  }

  private determineRiskLevel(overallScore: number, metrics: ConfidenceMetrics): 'low' | 'medium' | 'high' {
    if (overallScore >= 0.8 && metrics.errorRate > 0.7) return 'low';
    if (overallScore >= 0.6 && metrics.errorRate > 0.5) return 'medium';
    return 'high';
  }

  private generateRecommendations(
    metrics: ConfidenceMetrics,
    inputQuery: string,
    aiResponse: string
  ): string[] {
    const recommendations: string[] = [];

    if (metrics.responseAccuracy < 0.6) {
      recommendations.push('Consider rephrasing the query for better accuracy');
      recommendations.push('Add more context to improve response quality');
    }

    if (metrics.contextRelevance < 0.5) {
      recommendations.push('Provide more specific context about current task');
      recommendations.push('Reference recent actions or current page state');
    }

    if (metrics.taskCompletion < 0.5) {
      recommendations.push('Break down complex requests into smaller steps');
      recommendations.push('Specify expected output format or deliverables');
    }

    if (metrics.errorRate < 0.5) {
      recommendations.push('Review similar previous queries that succeeded');
      recommendations.push('Consider alternative AI models or approaches');
    }

    if (metrics.responseTime < 0.6) {
      recommendations.push('Optimize query complexity for faster responses');
      recommendations.push('Consider caching for frequently asked questions');
    }

    return recommendations;
  }

  private generateAutoFixSuggestions(metrics: ConfidenceMetrics, inputQuery: string): string[] {
    const suggestions: string[] = [];

    if (metrics.responseAccuracy < 0.4) {
      suggestions.push('Auto-retry with enhanced prompting');
      suggestions.push('Switch to backup AI model');
      suggestions.push('Apply response post-processing');
    }

    if (metrics.errorRate < 0.3) {
      suggestions.push('Implement automatic query refinement');
      suggestions.push('Add error detection and recovery');
      suggestions.push('Enable fallback response generation');
    }

    if (metrics.taskCompletion < 0.4) {
      suggestions.push('Break query into sub-tasks automatically');
      suggestions.push('Add step-by-step execution guidance');
      suggestions.push('Implement progress tracking');
    }

    return suggestions;
  }

  private findSimilarQueries(inputQuery: string): ConfidenceScore[] {
    const queryWords = inputQuery.toLowerCase().split(/\s+/);

    return this.confidenceHistory.filter(score => {
      const scoreWords = score.inputQuery.toLowerCase().split(/\s+/);
      const commonWords = queryWords.filter(word => scoreWords.includes(word));
      return commonWords.length >= Math.min(3, queryWords.length * 0.5);
    });
  }

  private updatePatterns(inputQuery: string, aiResponse: string, score: number) {
    const queryPattern = this.extractPattern(inputQuery);

    if (score < 0.3) {
      this.errorPatterns.set(queryPattern, (this.errorPatterns.get(queryPattern) || 0) + 1);
    } else if (score > 0.7) {
      this.successPatterns.set(queryPattern, (this.successPatterns.get(queryPattern) || 0) + 1);
    }
  }

  private extractPattern(query: string): string {
    // Extract pattern from query (keywords, structure, etc.)
    const words = query.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    return words.slice(0, 3).join('_');
  }

  private analyzeRecentPerformance() {
    const recent = this.confidenceHistory.slice(-10);
    if (recent.length === 0) return;

    const avgScore = recent.reduce((sum, score) => sum + score.overallScore, 0) / recent.length;

    if (avgScore < 0.5) {
      console.warn('🚨 AI Performance Alert: Recent performance below threshold');
      this.triggerPerformanceAlert(avgScore);
    }
  }

  private updateErrorPatterns() {
    // Clean old patterns and identify trending issues
    const now = Date.now();
    this.confidenceHistory = this.confidenceHistory.filter(score => {
      try {
        // Handle both Date objects and string timestamps
        const timestamp = score.timestamp instanceof Date
          ? score.timestamp.getTime()
          : new Date(score.timestamp).getTime();

        // Keep scores from last 7 days, but skip invalid timestamps
        return !isNaN(timestamp) && (now - timestamp < 7 * 24 * 60 * 60 * 1000);
      } catch (error) {
        console.warn('Error processing timestamp during cleanup:', error);
        return false; // Remove entries with invalid timestamps
      }
    });
  }

  private generatePreventiveRecommendations() {
    const recentErrors = this.confidenceHistory
      .filter(score => score.overallScore < 0.4)
      .slice(-5);

    if (recentErrors.length >= 3) {
      console.warn('🔧 Preventive Action Recommended: Multiple low-confidence responses detected');
    }
  }

  private triggerPerformanceAlert(avgScore: number) {
    // Trigger alert in UI or external monitoring system
    const alertEvent = new CustomEvent('ai-performance-alert', {
      detail: { averageScore: avgScore, timestamp: new Date() }
    });
    window.dispatchEvent(alertEvent);
  }

  // Public methods for monitoring and control
  public async makeConfidentAICall(
    query: string,
    context?: any,
    maxRetries: number = 3
  ): Promise<AICallResult> {
    let bestResult: AICallResult | null = null;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const startTime = Date.now();

        // Make the actual AI call (this would integrate with your AI service)
        const response = await this.simulateAICall(query, context);

        const executionTime = Date.now() - startTime;
        const confidenceScore = await this.evaluateAICall(query, response, executionTime, context);

        const result: AICallResult = {
          success: true,
          response,
          confidenceScore,
          shouldRetry: confidenceScore.overallScore < 0.5,
          alternativeApproaches: confidenceScore.autoFixSuggestions
        };

        if (confidenceScore.overallScore >= 0.6 || attempt === maxRetries - 1) {
          return result;
        }

        bestResult = result;
        attempt++;

        // Apply auto-fix suggestions for next attempt
        query = this.refineQueryForRetry(query, confidenceScore);

      } catch (error) {
        attempt++;
        console.error(`AI call attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          return {
            success: false,
            response: `Failed after ${maxRetries} attempts: ${error}`,
            confidenceScore: await this.evaluateAICall(query, '', 0, context),
            shouldRetry: false
          };
        }
      }
    }

    return bestResult || {
      success: false,
      response: 'No successful attempts',
      confidenceScore: await this.evaluateAICall(query, '', 0, context),
      shouldRetry: false
    };
  }

  private async simulateAICall(query: string, context?: any): Promise<string> {
    // This would be replaced with actual AI service call
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = [
      `I understand your query about "${query}". Here's a comprehensive response based on the context provided.`,
      `Based on your request "${query}", I can help you with several approaches and solutions.`,
      `Analyzing your query "${query}", I've identified the following steps and recommendations.`,
      `Thank you for your question about "${query}". Let me provide you with detailed assistance.`
    ];

    return responses[Math.floor(Math.random() * responses.length)] +
           (context ? ` Context: ${JSON.stringify(context).substring(0, 100)}...` : '');
  }

  private refineQueryForRetry(originalQuery: string, confidenceScore: ConfidenceScore): string {
    // Apply refinements based on confidence score analysis
    let refinedQuery = originalQuery;

    if (confidenceScore.metrics.contextRelevance < 0.5) {
      refinedQuery += " (Please consider current context and provide specific guidance)";
    }

    if (confidenceScore.metrics.taskCompletion < 0.5) {
      refinedQuery += " (Please provide step-by-step instructions)";
    }

    return refinedQuery;
  }

  // Getters and utility methods
  public getConfidenceHistory(): ConfidenceScore[] {
    try {
      return [...this.confidenceHistory];
    } catch (error) {
      console.warn('Error getting confidence history:', error);
      return [];
    }
  }

  public getRecentPerformance(days: number = 7): ConfidenceScore[] {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.confidenceHistory.filter(score => {
      try {
        // Handle both Date objects and string timestamps
        const timestamp = score.timestamp instanceof Date
          ? score.timestamp.getTime()
          : new Date(score.timestamp).getTime();

        // Check if timestamp is valid
        if (isNaN(timestamp)) {
          console.warn('Invalid timestamp in confidence score:', score.timestamp);
          return false;
        }

        return timestamp > cutoff;
      } catch (error) {
        console.warn('Error processing timestamp in confidence score:', error);
        return false;
      }
    });
  }

  public getAverageConfidence(days: number = 7): number {
    try {
      const recent = this.getRecentPerformance(days);
      if (recent.length === 0) return 0;

      const total = recent.reduce((sum, score) => {
        const scoreValue = typeof score.overallScore === 'number' ? score.overallScore : 0;
        return sum + scoreValue;
      }, 0);

      return total / recent.length;
    } catch (error) {
      console.warn('Error calculating average confidence:', error);
      return 0;
    }
  }

  public getErrorPatterns(): Map<string, number> {
    return new Map(this.errorPatterns);
  }

  public getSuccessPatterns(): Map<string, number> {
    return new Map(this.successPatterns);
  }

  public setMonitoring(active: boolean): void {
    this.activeMonitoring = active;
  }

  public clearHistory(): void {
    try {
      this.confidenceHistory = [];
      this.errorPatterns.clear();
      this.successPatterns.clear();
      this.saveData();
      console.log('AI confidence history cleared');
    } catch (error) {
      console.error('Error clearing confidence history:', error);
    }
  }
}

export default AIConfidenceScoring;
export type { ConfidenceScore, ConfidenceMetrics, AICallResult };
