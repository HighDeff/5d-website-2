// Advanced AI Memory and Context Management System
// Based on extending AIs conversation - implementing LLM-like memory persistence

export interface AIMemoryContext {
  id: string;
  aiId: string;
  conversationId: string;
  timestamp: string;
  context: {
    userInput: string;
    aiResponse: string;
    actionTaken: string;
    results: any;
    relatedTasks: string[];
    collaboratingAIs: string[];
  };
  metadata: {
    priority: "critical" | "high" | "medium" | "low";
    category: string;
    tags: string[];
    success: boolean;
    errorDetails?: string;
  };
}

export interface AIConversationHistory {
  id: string;
  participantAIs: string[];
  startTime: string;
  lastActivity: string;
  totalInteractions: number;
  context: AIMemoryContext[];
  summary: string;
  outcomes: string[];
}

class AIMemorySystemService {
  private memoryStorage: Map<string, AIMemoryContext[]> = new Map();
  private conversationHistory: Map<string, AIConversationHistory> = new Map();
  private contextCache: Map<string, any> = new Map();

  constructor() {
    this.initializeMemorySystem();
    this.startMemoryPersistence();
  }

  private initializeMemorySystem() {
    // Load existing memory from localStorage
    this.loadMemoryFromStorage();

    // Initialize AI conversation tracking
    this.setupConversationTracking();

    console.log("🧠 AI Memory System initialized with persistent context");
  }

  // Save context memory like an LLM
  saveContext(aiId: string, context: Partial<AIMemoryContext>): string {
    // Check if we should save this context (to prevent overflow)
    if (!this.shouldSaveContext(aiId, context)) {
      return ""; // Skip saving non-essential contexts
    }

    const contextId = `context_${aiId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullContext: AIMemoryContext = {
      id: contextId,
      aiId,
      conversationId:
        context.conversationId || this.getCurrentConversationId(aiId),
      timestamp: new Date().toISOString(),
      context: {
        userInput: this.truncateText(context.context?.userInput || "", 500),
        aiResponse: this.truncateText(context.context?.aiResponse || "", 500),
        actionTaken: context.context?.actionTaken || "",
        results: this.compressResults(context.context?.results || {}),
        relatedTasks: (context.context?.relatedTasks || []).slice(0, 5), // Max 5 related tasks
        collaboratingAIs: (context.context?.collaboratingAIs || []).slice(0, 3), // Max 3 collaborating AIs
      },
      metadata: {
        priority: context.metadata?.priority || "medium",
        category: context.metadata?.category || "general",
        tags: (context.metadata?.tags || []).slice(0, 5), // Max 5 tags
        success: context.metadata?.success ?? true,
        errorDetails: this.truncateText(
          context.metadata?.errorDetails || "",
          200,
        ),
      },
    };

    // Store in memory
    if (!this.memoryStorage.has(aiId)) {
      this.memoryStorage.set(aiId, []);
    }

    const contexts = this.memoryStorage.get(aiId)!;
    contexts.push(fullContext);

    // Immediate cleanup if too many contexts
    if (contexts.length > 100) {
      const sorted = contexts.sort((a, b) => {
        const scoreA =
          this.getPriorityScore(a.metadata.priority) +
          (a.metadata.success ? 1 : 0);
        const scoreB =
          this.getPriorityScore(b.metadata.priority) +
          (b.metadata.success ? 1 : 0);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
      this.memoryStorage.set(aiId, sorted.slice(0, 80)); // Keep top 80
    }

    // Cache for quick access
    this.contextCache.set(contextId, fullContext);

    // Persist to storage (throttled)
    this.throttledPersist();

    console.log(`🧠 Context saved for AI ${aiId}:`, contextId);
    return contextId;
  }

  private shouldSaveContext(
    aiId: string,
    context: Partial<AIMemoryContext>,
  ): boolean {
    // Always save critical contexts
    if (context.metadata?.priority === "critical") return true;

    // Always save errors
    if (context.metadata?.errorDetails) return true;

    // Always save successful important actions
    if (
      context.metadata?.success &&
      [
        "add_to_favorites",
        "remove_from_favorites",
        "command_execution",
      ].includes(context.context?.actionTaken || "")
    )
      return true;

    // Check current memory usage
    const currentContexts = this.memoryStorage.get(aiId)?.length || 0;
    if (currentContexts > 50) {
      // Be more selective when memory is getting full
      return context.metadata?.priority === "high" || Math.random() < 0.3; // 30% sampling
    }

    // For routine operations, use sampling
    if (
      ["screenshot_analysis", "pattern_analysis"].includes(
        context.context?.actionTaken || "",
      )
    ) {
      return Math.random() < 0.2; // 20% sampling for routine operations
    }

    return true; // Save by default
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  }

  private compressResults(results: any): any {
    if (!results || typeof results !== "object") return results;

    // Keep only essential result properties
    const compressed: any = {};

    // Always keep these if they exist
    [
      "success",
      "error",
      "message",
      "count",
      "total",
      "modified",
      "created",
    ].forEach((key) => {
      if (results[key] !== undefined) {
        compressed[key] = results[key];
      }
    });

    // Truncate long strings
    Object.keys(compressed).forEach((key) => {
      if (typeof compressed[key] === "string" && compressed[key].length > 100) {
        compressed[key] = compressed[key].substring(0, 97) + "...";
      }
    });

    return compressed;
  }

  private throttledPersist = (() => {
    let timeout: NodeJS.Timeout | null = null;
    return () => {
      if (timeout) return; // Already scheduled

      timeout = setTimeout(() => {
        try {
          this.persistMemoryToStorage();
        } catch (error) {
          console.error("Throttled persist failed:", error);
        } finally {
          timeout = null;
        }
      }, 5000); // Persist at most every 5 seconds
    };
  })();

  // Retrieve context with full history
  getContext(aiId: string, limit: number = 50): AIMemoryContext[] {
    const contexts = this.memoryStorage.get(aiId) || [];
    return contexts
      .slice(-limit)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  }

  // Get related context by tags or keywords
  getRelatedContext(
    aiId: string,
    keywords: string[],
    category?: string,
  ): AIMemoryContext[] {
    const contexts = this.memoryStorage.get(aiId) || [];

    return contexts.filter((context) => {
      const matchesKeywords = keywords.some(
        (keyword) =>
          context.context.userInput
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||
          context.context.aiResponse
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||
          context.metadata.tags.some((tag) =>
            tag.toLowerCase().includes(keyword.toLowerCase()),
          ),
      );

      const matchesCategory = category
        ? context.metadata.category === category
        : true;

      return matchesKeywords && matchesCategory;
    });
  }

  // Save conversation history for multi-AI interactions
  saveConversationHistory(
    conversation: Partial<AIConversationHistory>,
  ): string {
    const conversationId =
      conversation.id ||
      `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullConversation: AIConversationHistory = {
      id: conversationId,
      participantAIs: conversation.participantAIs || [],
      startTime: conversation.startTime || new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      totalInteractions: conversation.totalInteractions || 0,
      context: conversation.context || [],
      summary: conversation.summary || "",
      outcomes: conversation.outcomes || [],
    };

    this.conversationHistory.set(conversationId, fullConversation);
    this.persistConversationHistory();

    console.log(`💬 Conversation history saved:`, conversationId);
    return conversationId;
  }

  // Get conversation history
  getConversationHistory(conversationId: string): AIConversationHistory | null {
    return this.conversationHistory.get(conversationId) || null;
  }

  // Get all conversations for an AI
  getAIConversations(aiId: string): AIConversationHistory[] {
    return Array.from(this.conversationHistory.values()).filter((conv) =>
      conv.participantAIs.includes(aiId),
    );
  }

  // Smart context retrieval - like LLM context window
  getSmartContext(aiId: string, query: string, maxTokens: number = 4000): any {
    const contexts = this.getContext(aiId);
    const relatedContexts = this.getRelatedContext(aiId, query.split(" "));

    // Combine and prioritize contexts
    const combinedContexts = [...contexts, ...relatedContexts]
      .filter(
        (context, index, self) =>
          index === self.findIndex((c) => c.id === context.id), // Remove duplicates
      )
      .sort((a, b) => {
        // Prioritize by relevance and recency
        const aScore = this.calculateContextRelevance(a, query);
        const bScore = this.calculateContextRelevance(b, query);
        return bScore - aScore;
      });

    // Truncate to fit token limit (approximate)
    let totalTokens = 0;
    const selectedContexts = [];

    for (const context of combinedContexts) {
      const contextTokens = this.estimateTokens(context);
      if (totalTokens + contextTokens <= maxTokens) {
        selectedContexts.push(context);
        totalTokens += contextTokens;
      } else {
        break;
      }
    }

    return {
      contexts: selectedContexts,
      totalTokens,
      relevanceScore:
        selectedContexts.length > 0
          ? selectedContexts.reduce(
              (sum, ctx) => sum + this.calculateContextRelevance(ctx, query),
              0,
            ) / selectedContexts.length
          : 0,
    };
  }

  private calculateContextRelevance(
    context: AIMemoryContext,
    query: string,
  ): number {
    const queryWords = query.toLowerCase().split(" ");
    const contextText =
      `${context.context.userInput} ${context.context.aiResponse} ${context.metadata.tags.join(" ")}`.toLowerCase();

    let relevanceScore = 0;

    // Keyword matching
    queryWords.forEach((word) => {
      if (contextText.includes(word)) {
        relevanceScore += 1;
      }
    });

    // Recency bonus
    const ageInHours =
      (Date.now() - new Date(context.timestamp).getTime()) / (1000 * 60 * 60);
    relevanceScore += Math.max(0, 1 - ageInHours / 24); // Decay over 24 hours

    // Success bonus
    if (context.metadata.success) {
      relevanceScore += 0.5;
    }

    // Priority bonus
    const priorityBonus =
      {
        critical: 2,
        high: 1.5,
        medium: 1,
        low: 0.5,
      }[context.metadata.priority] || 1;

    relevanceScore *= priorityBonus;

    return relevanceScore;
  }

  private estimateTokens(context: AIMemoryContext): number {
    const text = JSON.stringify(context);
    return Math.ceil(text.length / 4); // Rough approximation: 4 chars per token
  }

  private getCurrentConversationId(aiId: string): string {
    // Get or create current conversation for this AI
    const activeConversations = Array.from(
      this.conversationHistory.values(),
    ).filter(
      (conv) =>
        conv.participantAIs.includes(aiId) &&
        Date.now() - new Date(conv.lastActivity).getTime() < 30 * 60 * 1000, // Active within 30 minutes
    );

    if (activeConversations.length > 0) {
      return activeConversations[0].id;
    }

    // Create new conversation
    return this.saveConversationHistory({
      participantAIs: [aiId],
      summary: `Active conversation for ${aiId}`,
    });
  }

  private loadMemoryFromStorage() {
    try {
      const savedMemory = localStorage.getItem("ai_memory_contexts");
      if (savedMemory) {
        const parsed = JSON.parse(savedMemory);
        this.memoryStorage = new Map(parsed);
      }

      const savedConversations = localStorage.getItem(
        "ai_conversation_history",
      );
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        this.conversationHistory = new Map(parsed);
      }

      console.log(
        `🧠 Loaded ${this.memoryStorage.size} AI memory banks and ${this.conversationHistory.size} conversations`,
      );
    } catch (error) {
      console.error("Failed to load AI memory from storage:", error);
    }
  }

  private persistMemoryToStorage() {
    try {
      // Primary storage: IndexedDB (can handle large amounts of data)
      const memoryArray = Array.from(this.memoryStorage.entries());
      this.saveToIndexedDB("ai_memory_contexts", memoryArray);

      // Secondary storage: localStorage (only essential data with quota management)
      this.saveEssentialToLocalStorage(memoryArray);
    } catch (error) {
      console.error("Failed to persist AI memory:", error);
      // Try emergency cleanup if quota exceeded
      this.handleStorageQuotaExceeded();
    }
  }

  private saveEssentialToLocalStorage(memoryArray: any[]) {
    try {
      // Only save recent, high-priority contexts to localStorage
      const essentialMemory = this.filterEssentialMemory(memoryArray);
      const compressedData = this.compressMemoryData(essentialMemory);

      // Check storage size before saving
      const estimatedSize = JSON.stringify(compressedData).length;
      const maxSize = 2 * 1024 * 1024; // 2MB limit for safety

      if (estimatedSize > maxSize) {
        console.warn(
          `Memory data too large (${estimatedSize} bytes), using emergency compression`,
        );
        const emergencyData = this.emergencyCompress(essentialMemory);
        localStorage.setItem(
          "ai_memory_contexts",
          JSON.stringify(emergencyData),
        );
      } else {
        localStorage.setItem(
          "ai_memory_contexts",
          JSON.stringify(compressedData),
        );
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.warn("localStorage quota exceeded, using IndexedDB only");
        this.clearLocalStorageMemory();
      } else {
        throw error;
      }
    }
  }

  private filterEssentialMemory(memoryArray: any[]): any[] {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;

    const essential = [];

    memoryArray.forEach(([aiId, contexts]) => {
      const filteredContexts = contexts.filter((context: any) => {
        const contextTime = new Date(context.timestamp).getTime();

        // Keep all contexts from last hour
        if (contextTime > oneHourAgo) return true;

        // Keep high-priority contexts from last day
        if (
          contextTime > oneDayAgo &&
          (context.metadata.priority === "critical" ||
            context.metadata.priority === "high")
        )
          return true;

        // Keep successful contexts that might be useful for learning
        if (context.metadata.success && Math.random() < 0.1) return true; // 10% sampling

        return false;
      });

      if (filteredContexts.length > 0) {
        essential.push([aiId, filteredContexts.slice(-50)]); // Max 50 per AI
      }
    });

    return essential;
  }

  private compressMemoryData(data: any[]): any[] {
    // Compress memory data by removing non-essential fields
    return data.map(([aiId, contexts]) => [
      aiId,
      contexts.map((context: any) => ({
        id: context.id,
        timestamp: context.timestamp,
        context: {
          userInput: context.context.userInput?.substring(0, 200) || "", // Truncate
          aiResponse: context.context.aiResponse?.substring(0, 200) || "",
          actionTaken: context.context.actionTaken,
          results: this.summarizeResults(context.context.results),
        },
        metadata: {
          category: context.metadata.category,
          priority: context.metadata.priority,
          success: context.metadata.success,
          tags: context.metadata.tags?.slice(0, 3) || [], // Max 3 tags
        },
      })),
    ]);
  }

  private emergencyCompress(data: any[]): any[] {
    // Ultra-aggressive compression for emergency situations
    const now = Date.now();
    const thirtyMinutesAgo = now - 30 * 60 * 1000;

    return data
      .map(([aiId, contexts]) => [
        aiId,
        contexts
          .filter(
            (context: any) =>
              new Date(context.timestamp).getTime() > thirtyMinutesAgo ||
              context.metadata.priority === "critical",
          )
          .slice(-10) // Only last 10 contexts per AI
          .map((context: any) => ({
            id: context.id,
            timestamp: context.timestamp,
            actionTaken: context.context.actionTaken,
            category: context.metadata.category,
            success: context.metadata.success,
          })),
      ])
      .filter(([, contexts]) => contexts.length > 0);
  }

  private summarizeResults(results: any): any {
    if (!results || typeof results !== "object") return results;

    // Keep only essential result data
    return {
      success: results.success,
      error: results.error?.substring(0, 100),
      count: results.count || results.length || results.total,
      type: results.type || typeof results,
    };
  }

  private handleStorageQuotaExceeded() {
    console.warn("Storage quota exceeded, performing emergency cleanup");

    try {
      // Clear old localStorage data
      this.clearLocalStorageMemory();

      // Aggressive memory cleanup
      this.aggressiveMemoryCleanup();

      // Try to save minimal data
      setTimeout(() => {
        this.persistMemoryToStorage();
      }, 1000);
    } catch (error) {
      console.error("Emergency cleanup failed:", error);
    }
  }

  private clearLocalStorageMemory() {
    try {
      localStorage.removeItem("ai_memory_contexts");
      localStorage.removeItem("ai_conversation_history");

      // Clear other AI-related storage that might be taking space
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key?.startsWith("ai_") ||
          key?.startsWith("pattern_") ||
          key?.startsWith("chat_")
        ) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log(
        `Cleared ${keysToRemove.length} AI storage keys from localStorage`,
      );
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }

  private aggressiveMemoryCleanup() {
    const originalSize = this.memoryStorage.size;

    // Keep only last 10 contexts per AI
    this.memoryStorage.forEach((contexts, aiId) => {
      const recentContexts = contexts
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 10);

      this.memoryStorage.set(aiId, recentContexts);
    });

    // Remove AIs with no contexts
    for (const [aiId, contexts] of this.memoryStorage.entries()) {
      if (contexts.length === 0) {
        this.memoryStorage.delete(aiId);
      }
    }

    console.log(
      `Aggressive cleanup: reduced from ${originalSize} AIs to ${this.memoryStorage.size} AIs`,
    );
  }

  private persistConversationHistory() {
    try {
      const conversationArray = Array.from(this.conversationHistory.entries());

      // Primary storage: IndexedDB
      this.saveToIndexedDB("ai_conversation_history", conversationArray);

      // Secondary storage: localStorage (compressed)
      this.saveConversationToLocalStorage(conversationArray);
    } catch (error) {
      console.error("Failed to persist conversation history:", error);
      this.handleStorageQuotaExceeded();
    }
  }

  private saveConversationToLocalStorage(conversationArray: any[]) {
    try {
      // Keep only recent, active conversations
      const recentConversations = conversationArray
        .filter(([, conv]) => {
          const lastActivity = new Date(conv.lastActivity).getTime();
          const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000;
          return lastActivity > twelveHoursAgo || conv.totalInteractions > 5;
        })
        .slice(-20) // Max 20 conversations
        .map(([id, conv]) => [
          id,
          {
            id: conv.id,
            participantAIs: conv.participantAIs,
            lastActivity: conv.lastActivity,
            totalInteractions: conv.totalInteractions,
            summary: conv.summary?.substring(0, 200) || "",
            context: conv.context?.slice(-5) || [], // Last 5 contexts only
          },
        ]);

      const conversationData = JSON.stringify(recentConversations);

      if (conversationData.length > 1024 * 1024) {
        // 1MB limit
        console.warn(
          "Conversation data too large, using emergency compression",
        );
        const emergency = recentConversations.slice(-10).map(([id, conv]) => [
          id,
          {
            id: conv.id,
            lastActivity: conv.lastActivity,
            totalInteractions: conv.totalInteractions,
          },
        ]);
        localStorage.setItem(
          "ai_conversation_history",
          JSON.stringify(emergency),
        );
      } else {
        localStorage.setItem("ai_conversation_history", conversationData);
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.warn("Conversation history localStorage quota exceeded");
        localStorage.removeItem("ai_conversation_history");
      } else {
        throw error;
      }
    }
  }

  private async saveToIndexedDB(storeName: string, data: any) {
    try {
      const request = indexedDB.open("AIMemoryDB", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        // Create both object stores during upgrade
        if (!db.objectStoreNames.contains("ai_memory_contexts")) {
          db.createObjectStore("ai_memory_contexts");
        }
        if (!db.objectStoreNames.contains("ai_conversation_history")) {
          db.createObjectStore("ai_conversation_history");
        }
      };

      request.onsuccess = () => {
        const db = request.result;

        // Check if the store exists before creating transaction
        if (!db.objectStoreNames.contains(storeName)) {
          console.warn(`Object store ${storeName} does not exist`);
          return;
        }

        try {
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);
          store.put(data, "data");
        } catch (transactionError) {
          console.error(
            `Failed to create transaction for ${storeName}:`,
            transactionError,
          );
        }
      };

      request.onerror = () => {
        console.error("Failed to open IndexedDB:", request.error);
      };
    } catch (error) {
      console.error("IndexedDB save failed:", error);
    }
  }

  private setupConversationTracking() {
    // Track AI interactions across the site
    document.addEventListener("aiInteraction", (event: any) => {
      const { aiId, action, data } = event.detail;

      this.saveContext(aiId, {
        context: {
          userInput: data.input || "",
          aiResponse: data.response || "",
          actionTaken: action,
          results: data.results || {},
          relatedTasks: data.relatedTasks || [],
          collaboratingAIs: data.collaboratingAIs || [],
        },
        metadata: {
          category: data.category || "interaction",
          tags: data.tags || [action],
          success: data.success ?? true,
          priority: data.priority || "medium",
        },
      });
    });
  }

  private startMemoryPersistence() {
    // Auto-save every 30 seconds (but check storage size first)
    setInterval(() => {
      this.checkStorageAndPersist();
    }, 30000);

    // More frequent cleanup to prevent overflow
    setInterval(
      () => {
        this.cleanupOldContexts();
      },
      2 * 60 * 1000,
    ); // Every 2 minutes

    // Aggressive cleanup every 15 minutes
    setInterval(
      () => {
        this.performMaintenanceCleanup();
      },
      15 * 60 * 1000,
    );
  }

  private checkStorageAndPersist() {
    try {
      // Check if we're approaching storage limits
      const memorySize = this.calculateMemoryUsage();
      const maxSize = 5 * 1024 * 1024; // 5MB threshold

      if (memorySize > maxSize) {
        console.warn(
          `Memory usage (${memorySize} bytes) approaching limit, performing cleanup`,
        );
        this.aggressiveMemoryCleanup();
      }

      this.persistMemoryToStorage();
      this.persistConversationHistory();
    } catch (error) {
      console.error("Storage persistence failed:", error);
      this.handleStorageQuotaExceeded();
    }
  }

  private performMaintenanceCleanup() {
    const beforeContexts = Array.from(this.memoryStorage.values()).reduce(
      (sum, contexts) => sum + contexts.length,
      0,
    );

    // Remove contexts older than 1 hour for non-critical AIs
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    this.memoryStorage.forEach((contexts, aiId) => {
      const importantAIs = [
        "chat_ai",
        "favorites_ai",
        "pattern_ai",
        "central_ai",
      ];
      const isImportant = importantAIs.includes(aiId);

      const filtered = contexts.filter((context) => {
        const contextTime = new Date(context.timestamp).getTime();

        if (isImportant) {
          // Keep more data for important AIs
          return (
            contextTime > oneHourAgo ||
            context.metadata.priority === "critical" ||
            context.metadata.success
          );
        } else {
          // More aggressive cleanup for less important AIs
          return (
            contextTime > oneHourAgo &&
            (context.metadata.priority === "critical" ||
              context.metadata.priority === "high")
          );
        }
      });

      this.memoryStorage.set(aiId, filtered);
    });

    const afterContexts = Array.from(this.memoryStorage.values()).reduce(
      (sum, contexts) => sum + contexts.length,
      0,
    );

    console.log(
      `Maintenance cleanup: ${beforeContexts} → ${afterContexts} contexts`,
    );
  }

  private cleanupOldContexts() {
    const totalContextsBefore = Array.from(this.memoryStorage.values()).reduce(
      (sum, contexts) => sum + contexts.length,
      0,
    );

    this.memoryStorage.forEach((contexts, aiId) => {
      let maxContexts = 200; // Default limit

      // Adjust limits based on AI importance
      const importantAIs = ["chat_ai", "favorites_ai", "pattern_ai"];
      if (importantAIs.includes(aiId)) {
        maxContexts = 500; // More contexts for important AIs
      }

      if (contexts.length > maxContexts) {
        // Sort by priority and recency
        const sorted = contexts.sort((a, b) => {
          const priorityScore = this.getPriorityScore(a.metadata.priority);
          const priorityScoreB = this.getPriorityScore(b.metadata.priority);

          if (priorityScore !== priorityScoreB) {
            return priorityScoreB - priorityScore; // Higher priority first
          }

          // Then by recency
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });

        // Keep the most important and recent contexts
        const keep = sorted.slice(0, maxContexts);
        const archive = sorted.slice(maxContexts);

        this.memoryStorage.set(aiId, keep);

        // Try to archive if storage permits, otherwise just discard
        if (archive.length > 0) {
          try {
            this.archiveContexts(aiId, archive);
          } catch (error) {
            console.warn(
              `Failed to archive ${archive.length} contexts for ${aiId}, discarding`,
            );
          }
        }
      }
    });

    const totalContextsAfter = Array.from(this.memoryStorage.values()).reduce(
      (sum, contexts) => sum + contexts.length,
      0,
    );

    if (totalContextsBefore !== totalContextsAfter) {
      console.log(
        `Context cleanup: ${totalContextsBefore} → ${totalContextsAfter}`,
      );
    }
  }

  private getPriorityScore(priority: string): number {
    const scores = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };
    return scores[priority as keyof typeof scores] || 1;
  }

  private archiveContexts(aiId: string, contexts: AIMemoryContext[]) {
    // Save to a separate archive storage
    const archiveKey = `ai_memory_archive_${aiId}`;
    const existingArchive = JSON.parse(
      localStorage.getItem(archiveKey) || "[]",
    );
    const newArchive = [...existingArchive, ...contexts];

    try {
      localStorage.setItem(archiveKey, JSON.stringify(newArchive));
    } catch (error) {
      console.warn("Failed to archive old contexts:", error);
    }
  }

  // Public API methods
  clearMemory(aiId: string) {
    this.memoryStorage.delete(aiId);
    this.persistMemoryToStorage();
  }

  exportMemory(aiId: string): string {
    const contexts = this.memoryStorage.get(aiId) || [];
    return JSON.stringify(contexts, null, 2);
  }

  importMemory(aiId: string, memoryData: string) {
    try {
      const contexts = JSON.parse(memoryData);
      this.memoryStorage.set(aiId, contexts);
      this.persistMemoryToStorage();
    } catch (error) {
      console.error("Failed to import memory:", error);
    }
  }

  getMemoryStats(): any {
    const stats = {
      totalAIs: this.memoryStorage.size,
      totalContexts: Array.from(this.memoryStorage.values()).reduce(
        (sum, contexts) => sum + contexts.length,
        0,
      ),
      totalConversations: this.conversationHistory.size,
      memoryUsage: this.calculateMemoryUsage(),
      oldestContext: this.getOldestContext(),
      newestContext: this.getNewestContext(),
    };

    return stats;
  }

  private calculateMemoryUsage(): number {
    const memoryString = JSON.stringify(
      Array.from(this.memoryStorage.entries()),
    );
    return memoryString.length;
  }

  private getOldestContext(): string | null {
    let oldest: AIMemoryContext | null = null;

    this.memoryStorage.forEach((contexts) => {
      contexts.forEach((context) => {
        if (
          !oldest ||
          new Date(context.timestamp) < new Date(oldest.timestamp)
        ) {
          oldest = context;
        }
      });
    });

    return oldest?.timestamp || null;
  }

  private getNewestContext(): string | null {
    let newest: AIMemoryContext | null = null;

    this.memoryStorage.forEach((contexts) => {
      contexts.forEach((context) => {
        if (
          !newest ||
          new Date(context.timestamp) > new Date(newest.timestamp)
        ) {
          newest = context;
        }
      });
    });

    return newest?.timestamp || null;
  }
}

// Global instance
const AIMemorySystem = new AIMemorySystemService();

// Export for use throughout the application
export default AIMemorySystem;
export { AIMemorySystemService };
