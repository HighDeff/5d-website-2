// AI Knowledge Database - Stores learning patterns, user profiles, and generated solutions
// Backend integration for AI system knowledge persistence and sharing

import DatabaseService from "./DatabaseService";

export interface KnowledgeEntry {
  id: string;
  type:
    | "user_pattern"
    | "error_solution"
    | "conversation_memory"
    | "element_behavior"
    | "movement_pattern"
    | "fix_template"
    | "user_preference";
  content: any;
  confidence: number;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  successRate: number;
  tags: string[];
  relatedEntries: string[];
  userFeedback: Array<{
    rating: number;
    comment: string;
    timestamp: string;
  }>;
}

export interface UserSessionData {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  interactions: UserInteraction[];
  learnedPatterns: string[];
  aiInsights: AIInsight[];
  behaviorProfile: BehaviorProfile;
  conversationMilestones: ConversationMilestone[];
}

export interface UserInteraction {
  id: string;
  timestamp: string;
  type: "click" | "type" | "navigation" | "error" | "question" | "fix_request";
  element?: string;
  context: string;
  userInput?: string;
  aiResponse?: string;
  outcome: "success" | "failure" | "partial" | "abandoned";
  learningValue: number; // How much this interaction contributed to learning
}

export interface AIInsight {
  id: string;
  insight: string;
  category: "behavior" | "preference" | "frustration" | "success" | "pattern";
  confidence: number;
  basedOn: string[]; // IDs of interactions that led to this insight
  timestamp: string;
  actionable: boolean;
  implemented?: boolean;
}

export interface BehaviorProfile {
  communicationStyle: "technical" | "casual" | "analytical" | "directive";
  problemSolvingApproach:
    | "methodical"
    | "experimental"
    | "guided"
    | "independent";
  frustrationTriggers: string[];
  successPatterns: string[];
  preferredFeedbackStyle: "detailed" | "concise" | "visual" | "step_by_step";
  attentionSpan: "short" | "medium" | "long";
  expertiseLevel: "beginner" | "intermediate" | "advanced" | "expert";
  learningStyle: "visual" | "auditory" | "kinesthetic" | "analytical";
}

export interface ConversationMilestone {
  milestone: string;
  achieved: boolean;
  timestamp?: string;
  context?: string;
}

export interface ReverseMappingData {
  pageElements: Map<string, ElementMapping>;
  userIntentFlow: IntentFlowNode[];
  navigationGraph: NavigationNode[];
  elementRelationships: ElementRelationship[];
  currentContext: PageContext;
}

export interface ElementMapping {
  elementId: string;
  elementType: string;
  currentState: string;
  expectedFunction: string;
  userExpectation: string;
  actualBehavior: string;
  contextualPurpose: string;
  relatedElements: string[];
  interactionHistory: Array<{
    action: string;
    timestamp: string;
    success: boolean;
    userIntention: string;
  }>;
}

export interface IntentFlowNode {
  nodeId: string;
  userAction: string;
  detectedIntent: string;
  confidence: number;
  nextProbableActions: Array<{
    action: string;
    probability: number;
    reasoning: string;
  }>;
  contextClues: string[];
  timestamp: string;
}

export interface NavigationNode {
  url: string;
  title: string;
  userPurpose: string;
  arrivalMethod: string;
  timeSpent: number;
  interactionQuality: number;
  exitMethod?: string;
  satisfactionScore?: number;
  connectedPages: string[];
}

export interface ElementRelationship {
  primaryElement: string;
  relatedElement: string;
  relationshipType: "sequential" | "conditional" | "dependent" | "alternative";
  strength: number;
  userPattern: string;
}

export interface PageContext {
  url: string;
  title: string;
  pageType: "main" | "form" | "canvas" | "dashboard" | "error" | "unknown";
  validatedContent: string[];
  missingContent: string[];
  userTask: string;
  completionStatus: "not_started" | "in_progress" | "completed" | "blocked";
  blockers: string[];
  suggestedActions: string[];
}

class AIKnowledgeDatabase {
  private static instance: AIKnowledgeDatabase;
  private database: typeof DatabaseService;
  private knowledgeStore: Map<string, KnowledgeEntry> = new Map();
  private currentSession: UserSessionData | null = null;
  private reverseMappingData: ReverseMappingData;
  private syncInterval?: NodeJS.Timeout;

  private constructor() {
    this.database = DatabaseService;
    this.initializeReverseMappingData();
    this.loadKnowledgeFromStorage();
    this.startAutoSync();
  }

  static getInstance(): AIKnowledgeDatabase {
    if (!AIKnowledgeDatabase.instance) {
      AIKnowledgeDatabase.instance = new AIKnowledgeDatabase();
    }
    return AIKnowledgeDatabase.instance;
  }

  // Initialize reverse mapping data structure
  private initializeReverseMappingData(): void {
    this.reverseMappingData = {
      pageElements: new Map(),
      userIntentFlow: [],
      navigationGraph: [],
      elementRelationships: [],
      currentContext: {
        url: window.location.href,
        title: document.title,
        pageType: this.detectPageType(),
        validatedContent: [],
        missingContent: [],
        userTask: "unknown",
        completionStatus: "not_started",
        blockers: [],
        suggestedActions: [],
      },
    };
  }

  // Start new user session
  async startSession(userId: string): Promise<void> {
    this.currentSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      startTime: new Date().toISOString(),
      interactions: [],
      learnedPatterns: [],
      aiInsights: [],
      behaviorProfile: await this.loadOrCreateBehaviorProfile(userId),
      conversationMilestones: this.initializeConversationMilestones(),
    };

    console.log(
      `🧠 Started AI learning session: ${this.currentSession.sessionId}`,
    );
  }

  // Record user interaction with learning analysis
  async recordInteraction(
    interaction: Omit<UserInteraction, "id">,
  ): Promise<void> {
    if (!this.currentSession) {
      await this.startSession("anonymous");
    }

    const fullInteraction: UserInteraction = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...interaction,
    };

    this.currentSession!.interactions.push(fullInteraction);

    // Analyze for learning patterns
    await this.analyzeInteractionForLearning(fullInteraction);

    // Update reverse mapping
    await this.updateReverseMapping(fullInteraction);

    // Generate insights
    await this.generateInsights(fullInteraction);
  }

  // Analyze interaction for learning opportunities
  private async analyzeInteractionForLearning(
    interaction: UserInteraction,
  ): Promise<void> {
    // Pattern detection
    const patterns = await this.detectInteractionPatterns(interaction);

    for (const pattern of patterns) {
      await this.storeKnowledge({
        type: "user_pattern",
        content: pattern,
        confidence: pattern.confidence,
        tags: ["interaction", "pattern", interaction.type],
        relatedEntries: [],
        userFeedback: [],
      });
    }

    // Update behavior profile
    await this.updateBehaviorProfile(interaction);
  }

  // Update reverse mapping with new interaction data
  private async updateReverseMapping(
    interaction: UserInteraction,
  ): Promise<void> {
    // Update element mapping
    if (interaction.element) {
      const elementMapping = this.reverseMappingData.pageElements.get(
        interaction.element,
      ) || {
        elementId: interaction.element,
        elementType: this.detectElementType(interaction.element),
        currentState: "unknown",
        expectedFunction: await this.inferExpectedFunction(interaction.element),
        userExpectation: await this.inferUserExpectation(interaction),
        actualBehavior: await this.analyzeActualBehavior(interaction.element),
        contextualPurpose: await this.determineContextualPurpose(
          interaction.element,
        ),
        relatedElements: [],
        interactionHistory: [],
      };

      elementMapping.interactionHistory.push({
        action: interaction.type,
        timestamp: interaction.timestamp,
        success: interaction.outcome === "success",
        userIntention: interaction.userInput || "unknown",
      });

      this.reverseMappingData.pageElements.set(
        interaction.element,
        elementMapping,
      );
    }

    // Add to intent flow
    const intentNode: IntentFlowNode = {
      nodeId: `intent_${Date.now()}`,
      userAction: interaction.type,
      detectedIntent: await this.detectUserIntent(interaction),
      confidence: this.calculateIntentConfidence(interaction),
      nextProbableActions: await this.predictNextActions(interaction),
      contextClues: await this.extractContextClues(interaction),
      timestamp: interaction.timestamp,
    };

    this.reverseMappingData.userIntentFlow.push(intentNode);

    // Update page context
    await this.updatePageContext(interaction);
  }

  // Generate AI insights from interaction
  private async generateInsights(interaction: UserInteraction): Promise<void> {
    const insights: AIInsight[] = [];

    // Frustration detection
    if (interaction.outcome === "failure") {
      const recentFailures = this.currentSession!.interactions.filter(
        (i) => i.outcome === "failure",
      ).filter((i) => Date.now() - new Date(i.timestamp).getTime() < 30000);

      if (recentFailures.length >= 3) {
        insights.push({
          id: `insight_frustration_${Date.now()}`,
          insight: "User showing signs of frustration with repeated failures",
          category: "frustration",
          confidence: 0.9,
          basedOn: recentFailures.map((i) => i.id),
          timestamp: new Date().toISOString(),
          actionable: true,
        });
      }
    }

    // Success pattern detection
    if (interaction.outcome === "success") {
      const similarSuccesses = this.currentSession!.interactions.filter(
        (i) => i.type === interaction.type && i.outcome === "success",
      );

      if (similarSuccesses.length >= 3) {
        insights.push({
          id: `insight_success_${Date.now()}`,
          insight: `User consistently successful with ${interaction.type} actions`,
          category: "success",
          confidence: 0.8,
          basedOn: similarSuccesses.map((i) => i.id),
          timestamp: new Date().toISOString(),
          actionable: true,
        });
      }
    }

    // Store insights
    for (const insight of insights) {
      this.currentSession!.aiInsights.push(insight);

      await this.storeKnowledge({
        type: "user_pattern",
        content: insight,
        confidence: insight.confidence,
        tags: ["insight", insight.category],
        relatedEntries: insight.basedOn,
        userFeedback: [],
      });
    }
  }

  // Store knowledge entry
  async storeKnowledge(
    entry: Omit<
      KnowledgeEntry,
      "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate"
    >,
  ): Promise<string> {
    const knowledgeEntry: KnowledgeEntry = {
      id: `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      successRate: 0,
      ...entry,
    };

    this.knowledgeStore.set(knowledgeEntry.id, knowledgeEntry);
    await this.saveKnowledgeToStorage();

    return knowledgeEntry.id;
  }

  // Query knowledge base
  async queryKnowledge(query: {
    type?: KnowledgeEntry["type"];
    tags?: string[];
    minConfidence?: number;
    limit?: number;
  }): Promise<KnowledgeEntry[]> {
    let results = Array.from(this.knowledgeStore.values());

    if (query.type) {
      results = results.filter((entry) => entry.type === query.type);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter((entry) =>
        query.tags!.some((tag) => entry.tags.includes(tag)),
      );
    }

    if (query.minConfidence) {
      results = results.filter(
        (entry) => entry.confidence >= query.minConfidence!,
      );
    }

    // Sort by relevance (confidence + usage + success rate)
    results.sort((a, b) => {
      const scoreA =
        a.confidence * 0.4 + (a.usageCount / 100) * 0.3 + a.successRate * 0.3;
      const scoreB =
        b.confidence * 0.4 + (b.usageCount / 100) * 0.3 + b.successRate * 0.3;
      return scoreB - scoreA;
    });

    return query.limit ? results.slice(0, query.limit) : results;
  }

  // Get element analysis for specific element
  async getElementAnalysis(elementId: string): Promise<ElementMapping | null> {
    return this.reverseMappingData.pageElements.get(elementId) || null;
  }

  // Get user intent flow
  getUserIntentFlow(): IntentFlowNode[] {
    return this.reverseMappingData.userIntentFlow.slice(-20); // Last 20 intent nodes
  }

  // Get current page context
  getCurrentPageContext(): PageContext {
    return this.reverseMappingData.currentContext;
  }

  // Answer questions based on knowledge
  async answerQuestion(question: string): Promise<string> {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes("element") && lowerQ.includes("supposed")) {
      const elementMentioned = this.extractElementFromQuestion(question);
      if (elementMentioned) {
        const analysis = await this.getElementAnalysis(elementMentioned);
        if (analysis) {
          return `Based on my analysis, ${elementMentioned} is supposed to ${analysis.expectedFunction}. Currently it ${analysis.actualBehavior}. User expectation: ${analysis.userExpectation}. I've tracked ${analysis.interactionHistory.length} interactions with this element.`;
        }
      }
    }

    if (
      lowerQ.includes("user") &&
      (lowerQ.includes("trying") || lowerQ.includes("want"))
    ) {
      const intentFlow = this.getUserIntentFlow();
      if (intentFlow.length > 0) {
        const latest = intentFlow[intentFlow.length - 1];
        return `Based on recent behavior analysis, the user appears to be ${latest.detectedIntent} (${Math.round(latest.confidence * 100)}% confidence). Next probable actions: ${latest.nextProbableActions.map((a) => a.action).join(", ")}. Context clues: ${latest.contextClues.join(", ")}.`;
      }
    }

    if (lowerQ.includes("pattern") || lowerQ.includes("learn")) {
      const patterns = await this.queryKnowledge({
        type: "user_pattern",
        limit: 5,
      });
      return `I've learned ${patterns.length} user patterns. Most confident: ${patterns[0]?.content.pattern || "Still learning"}. Total knowledge entries: ${this.knowledgeStore.size}. Current session interactions: ${this.currentSession?.interactions.length || 0}.`;
    }

    // Search knowledge base for relevant entries
    const relevantKnowledge = await this.queryKnowledge({
      tags: this.extractTagsFromQuestion(question),
      minConfidence: 0.6,
      limit: 3,
    });

    if (relevantKnowledge.length > 0) {
      const topResult = relevantKnowledge[0];
      return `Based on learned knowledge: ${JSON.stringify(topResult.content).slice(0, 200)}... (Confidence: ${Math.round(topResult.confidence * 100)}%, Used: ${topResult.usageCount} times)`;
    }

    return `I'm continuously learning about user behavior and system patterns. Current knowledge base contains ${this.knowledgeStore.size} entries across user patterns, error solutions, and behavioral insights. Ask me about specific elements, user intentions, or learned patterns.`;
  }

  // Private helper methods
  private async loadOrCreateBehaviorProfile(
    userId: string,
  ): Promise<BehaviorProfile> {
    // Try to load existing profile
    const existingProfile = await this.queryKnowledge({
      type: "user_preference",
      tags: ["behavior_profile", userId],
      limit: 1,
    });

    if (existingProfile.length > 0) {
      return existingProfile[0].content as BehaviorProfile;
    }

    // Create new profile with initial assessment
    return {
      communicationStyle: "technical", // Based on user's detailed requests
      problemSolvingApproach: "methodical", // Based on systematic approach
      frustrationTriggers: ["non_working_features", "static_elements"],
      successPatterns: ["detailed_explanations", "working_examples"],
      preferredFeedbackStyle: "detailed",
      attentionSpan: "long",
      expertiseLevel: "advanced",
      learningStyle: "analytical",
    };
  }

  private initializeConversationMilestones(): ConversationMilestone[] {
    return [
      { milestone: "First interaction", achieved: false },
      { milestone: "Asked first question", achieved: false },
      { milestone: "Received helpful response", achieved: false },
      { milestone: "Applied AI suggestion", achieved: false },
      { milestone: "Provided feedback", achieved: false },
      { milestone: "Built trust relationship", achieved: false },
    ];
  }

  private detectPageType(): PageContext["pageType"] {
    if (document.querySelector("canvas")) return "canvas";
    if (document.querySelector("form")) return "form";
    if (document.querySelector("[class*='dashboard']")) return "dashboard";
    if (document.title.includes("404") || document.title.includes("Error"))
      return "error";
    return "main";
  }

  private async detectInteractionPatterns(
    interaction: UserInteraction,
  ): Promise<any[]> {
    // Implement pattern detection logic
    return [];
  }

  private async updateBehaviorProfile(
    interaction: UserInteraction,
  ): Promise<void> {
    // Implement behavior profile updates
  }

  private detectElementType(elementId: string): string {
    const element = document.getElementById(elementId);
    return element?.tagName.toLowerCase() || "unknown";
  }

  private async inferExpectedFunction(elementId: string): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) return "unknown";

    if (element.tagName === "BUTTON")
      return "respond to clicks and execute actions";
    if (element.tagName === "INPUT")
      return "accept user input and provide feedback";
    if (element.tagName === "CANVAS")
      return "display interactive visual content";
    return "provide interactive functionality";
  }

  private async inferUserExpectation(
    interaction: UserInteraction,
  ): Promise<string> {
    if (interaction.type === "click")
      return "element should respond immediately";
    if (interaction.type === "type")
      return "should accept input and show feedback";
    return "should work as designed";
  }

  private async analyzeActualBehavior(elementId: string): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) return "element not found";

    const style = window.getComputedStyle(element);
    if (style.display === "none") return "element is hidden";
    if (element instanceof HTMLButtonElement && element.disabled)
      return "button is disabled";
    return "element appears functional";
  }

  private async determineContextualPurpose(elementId: string): Promise<string> {
    // Analyze element's purpose in current context
    return "provides user interface functionality";
  }

  private async detectUserIntent(
    interaction: UserInteraction,
  ): Promise<string> {
    // Implement intent detection logic
    return "exploring interface";
  }

  private calculateIntentConfidence(interaction: UserInteraction): number {
    // Calculate confidence based on interaction patterns
    return 0.7;
  }

  private async predictNextActions(
    interaction: UserInteraction,
  ): Promise<
    Array<{ action: string; probability: number; reasoning: string }>
  > {
    // Implement next action prediction
    return [
      {
        action: "continue_exploration",
        probability: 0.6,
        reasoning: "based on current pattern",
      },
    ];
  }

  private async extractContextClues(
    interaction: UserInteraction,
  ): Promise<string[]> {
    return [interaction.context];
  }

  private async updatePageContext(interaction: UserInteraction): Promise<void> {
    // Update current page context based on interaction
  }

  private extractElementFromQuestion(question: string): string | null {
    // Extract element ID or name from question
    const words = question.toLowerCase().split(" ");
    const possibleElements = ["canvas", "button", "textbox", "input"];
    return possibleElements.find((element) => words.includes(element)) || null;
  }

  private extractTagsFromQuestion(question: string): string[] {
    const words = question.toLowerCase().split(" ");
    const relevantTags = words.filter((word) =>
      [
        "element",
        "button",
        "canvas",
        "user",
        "pattern",
        "behavior",
        "error",
        "fix",
      ].includes(word),
    );
    return relevantTags;
  }

  private loadKnowledgeFromStorage(): void {
    try {
      const stored = localStorage.getItem("ai_knowledge_database");
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((entry: KnowledgeEntry) => {
          this.knowledgeStore.set(entry.id, entry);
        });
        console.log(
          `📚 Loaded ${this.knowledgeStore.size} knowledge entries from storage`,
        );
      }
    } catch (error) {
      console.error("Error loading knowledge from storage:", error);
    }
  }

  private async saveKnowledgeToStorage(): Promise<void> {
    try {
      const data = Array.from(this.knowledgeStore.values());
      localStorage.setItem("ai_knowledge_database", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving knowledge to storage:", error);
    }
  }

  private startAutoSync(): void {
    this.syncInterval = setInterval(async () => {
      await this.saveKnowledgeToStorage();

      if (this.currentSession) {
        // Save session data
        localStorage.setItem(
          "current_ai_session",
          JSON.stringify(this.currentSession),
        );
      }
    }, 30000); // Save every 30 seconds
  }

  // Public API methods
  public getKnowledgeStats(): {
    totalEntries: number;
    byType: Record<string, number>;
    avgConfidence: number;
    sessionInteractions: number;
  } {
    const entries = Array.from(this.knowledgeStore.values());
    const byType: Record<string, number> = {};

    entries.forEach((entry) => {
      byType[entry.type] = (byType[entry.type] || 0) + 1;
    });

    const avgConfidence =
      entries.length > 0
        ? entries.reduce((sum, entry) => sum + entry.confidence, 0) /
          entries.length
        : 0;

    return {
      totalEntries: entries.length,
      byType,
      avgConfidence,
      sessionInteractions: this.currentSession?.interactions.length || 0,
    };
  }

  public getCurrentSession(): UserSessionData | null {
    return this.currentSession;
  }

  public getReverseMappingData(): ReverseMappingData {
    return this.reverseMappingData;
  }
}

// Export singleton
export const aiKnowledgeDatabase = AIKnowledgeDatabase.getInstance();

// Make available globally
if (typeof window !== "undefined") {
  (window as any).aiKnowledgeDatabase = aiKnowledgeDatabase;
}

export default AIKnowledgeDatabase;
