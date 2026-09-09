interface KnowledgeEntry {
  id: string;
  type: 'command' | 'solution' | 'pattern' | 'feature' | 'error' | 'insight' | 'strategy';
  title: string;
  description: string;
  content: any;
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  effectiveness: number; // 0-100
  usageCount: number;
  lastUsed: Date | null;
  createdAt: Date;
  updatedAt: Date;
  source: 'user' | 'ai' | 'system' | 'learning';
  confidence: number; // 0-100
  relatedEntries: string[];
}

interface LearningPattern {
  id: string;
  pattern: string;
  frequency: number;
  success_rate: number;
  context: string[];
  triggers: string[];
  outcomes: string[];
  lastSeen: Date;
}

interface UserInteraction {
  id: string;
  action: string;
  context: Record<string, any>;
  timestamp: Date;
  result: 'success' | 'failure' | 'partial';
  learnings: string[];
}

class EnhancedAIKnowledgeDatabase {
  private static instance: EnhancedAIKnowledgeDatabase;
  private knowledgeBase: Map<string, KnowledgeEntry> = new Map();
  private learningPatterns: Map<string, LearningPattern> = new Map();
  private userInteractions: UserInteraction[] = [];
  private searchIndex: Map<string, Set<string>> = new Map();
  private isLearning = false;

  constructor() {
    this.initializeKnowledgeBase();
    this.buildSearchIndex();
  }

  static getInstance(): EnhancedAIKnowledgeDatabase {
    if (!EnhancedAIKnowledgeDatabase.instance) {
      EnhancedAIKnowledgeDatabase.instance = new EnhancedAIKnowledgeDatabase();
    }
    return EnhancedAIKnowledgeDatabase.instance;
  }

  private initializeKnowledgeBase() {
    const initialEntries: KnowledgeEntry[] = [
      {
        id: 'canvas-spiral-fix',
        type: 'solution',
        title: 'Canvas Spiral Pattern Fix',
        description: 'Solution for detecting and fixing spiral movement patterns in canvas',
        content: {
          steps: [
            'Detect circular movement patterns',
            'Calculate movement velocity',
            'Apply counter-spiral algorithm',
            'Reset entity positions if needed'
          ],
          code: 'function fixSpiralPattern(entity) { /* implementation */ }',
          parameters: ['sensitivity', 'reset_threshold']
        },
        tags: ['canvas', 'movement', 'spiral', 'fix'],
        category: 'canvas',
        difficulty: 'intermediate',
        effectiveness: 87,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'system',
        confidence: 85,
        relatedEntries: ['canvas-entity-reset', 'movement-tracking']
      },
      {
        id: 'database-cleanup',
        type: 'command',
        title: 'Database Storage Cleanup',
        description: 'Command to clean up storage and free space',
        content: {
          command: 'cleanup_storage',
          description: 'Removes temporary files and clears cache',
          parameters: ['aggressive', 'backup_first'],
          execution_time: '2-5 seconds'
        },
        tags: ['database', 'storage', 'cleanup', 'maintenance'],
        category: 'database',
        difficulty: 'beginner',
        effectiveness: 92,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'system',
        confidence: 95,
        relatedEntries: ['storage-monitoring']
      },
      {
        id: 'ui-responsive-fix',
        type: 'pattern',
        title: 'Responsive UI Fix Pattern',
        description: 'Pattern for fixing responsive layout issues',
        content: {
          pattern_type: 'responsive_fix',
          conditions: ['screen_size_change', 'layout_break'],
          actions: ['recalculate_layout', 'apply_media_queries', 'refresh_components'],
          success_indicators: ['proper_layout', 'no_overflow', 'functional_navigation']
        },
        tags: ['ui', 'responsive', 'layout', 'mobile'],
        category: 'ui',
        difficulty: 'intermediate',
        effectiveness: 78,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'system',
        confidence: 80,
        relatedEntries: ['layout-optimization']
      },
      {
        id: 'ai-consciousness-enhancement',
        type: 'feature',
        title: 'AI Consciousness Enhancement',
        description: 'Feature for enhancing AI awareness and learning',
        content: {
          components: ['mouse_tracker', 'ocr_monitor', 'context_analyzer'],
          capabilities: ['real_time_learning', 'pattern_recognition', 'predictive_assistance'],
          implementation: 'consciousness_system.js',
          dependencies: ['mouse_events', 'screen_capture', 'ml_models']
        },
        tags: ['ai', 'consciousness', 'learning', 'enhancement'],
        category: 'ai',
        difficulty: 'expert',
        effectiveness: 73,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'system',
        confidence: 75,
        relatedEntries: ['learning-patterns', 'user-interaction-tracking']
      },
      {
        id: 'performance-optimization',
        type: 'strategy',
        title: 'Performance Optimization Strategy',
        description: 'Comprehensive strategy for optimizing system performance',
        content: {
          phases: ['analysis', 'identification', 'optimization', 'validation'],
          techniques: ['memory_cleanup', 'cpu_optimization', 'network_caching'],
          metrics: ['load_time', 'memory_usage', 'cpu_usage', 'user_satisfaction'],
          tools: ['performance_monitor', 'profiler', 'analytics']
        },
        tags: ['performance', 'optimization', 'strategy', 'monitoring'],
        category: 'performance',
        difficulty: 'advanced',
        effectiveness: 85,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'system',
        confidence: 88,
        relatedEntries: ['memory-management', 'cpu-optimization']
      },
      {
        id: 'error-handling-best-practices',
        type: 'insight',
        title: 'Error Handling Best Practices',
        description: 'Best practices for handling and recovering from errors',
        content: {
          principles: ['graceful_degradation', 'user_feedback', 'automatic_recovery'],
          techniques: ['try_catch_blocks', 'error_boundaries', 'fallback_mechanisms'],
          monitoring: ['error_tracking', 'performance_impact', 'user_experience'],
          recovery: ['rollback_mechanisms', 'alternative_paths', 'manual_intervention']
        },
        tags: ['error', 'handling', 'best-practices', 'recovery'],
        category: 'system',
        difficulty: 'advanced',
        effectiveness: 90,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'system',
        confidence: 92,
        relatedEntries: ['error-recovery', 'system-reliability']
      },
      {
        id: 'custom-feature-creation',
        type: 'feature',
        title: 'Custom Feature Creation Framework',
        description: 'Framework for creating and managing custom features',
        content: {
          workflow: ['design', 'implement', 'test', 'deploy', 'monitor'],
          components: ['feature_builder', 'code_generator', 'test_runner', 'deployment_manager'],
          templates: ['canvas_tools', 'ui_components', 'data_processors', 'ai_assistants'],
          validation: ['syntax_check', 'functionality_test', 'performance_test', 'security_scan']
        },
        tags: ['custom', 'feature', 'creation', 'framework'],
        category: 'development',
        difficulty: 'expert',
        effectiveness: 82,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'system',
        confidence: 85,
        relatedEntries: ['feature-templates', 'code-generation']
      }
    ];

    initialEntries.forEach(entry => {
      this.knowledgeBase.set(entry.id, entry);
    });
  }

  private buildSearchIndex() {
    this.searchIndex.clear();
    
    this.knowledgeBase.forEach((entry, id) => {
      const searchTerms = [
        ...entry.tags,
        entry.title.toLowerCase().split(' '),
        entry.description.toLowerCase().split(' '),
        entry.category,
        entry.type
      ].flat().filter(term => term.length > 2);

      searchTerms.forEach(term => {
        if (!this.searchIndex.has(term)) {
          this.searchIndex.set(term, new Set());
        }
        this.searchIndex.get(term)!.add(id);
      });
    });
  }

  public addKnowledge(entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `${entry.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullEntry: KnowledgeEntry = {
      ...entry,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.knowledgeBase.set(id, fullEntry);
    this.updateSearchIndex(fullEntry);
    
    console.log(`📚 Knowledge added: ${entry.title}`);
    return id;
  }

  public updateKnowledge(id: string, updates: Partial<KnowledgeEntry>): boolean {
    const existing = this.knowledgeBase.get(id);
    if (!existing) return false;

    const updated: KnowledgeEntry = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.knowledgeBase.set(id, updated);
    this.updateSearchIndex(updated);
    
    console.log(`📚 Knowledge updated: ${updated.title}`);
    return true;
  }

  public getKnowledge(id: string): KnowledgeEntry | null {
    const entry = this.knowledgeBase.get(id);
    if (entry) {
      // Update usage statistics
      entry.usageCount++;
      entry.lastUsed = new Date();
      this.knowledgeBase.set(id, entry);
    }
    return entry || null;
  }

  public searchKnowledge(query: string, filters?: {
    type?: string;
    category?: string;
    difficulty?: string;
    minEffectiveness?: number;
  }): KnowledgeEntry[] {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    const candidateIds = new Set<string>();

    // Find entries matching search terms
    searchTerms.forEach(term => {
      const matches = this.searchIndex.get(term);
      if (matches) {
        matches.forEach(id => candidateIds.add(id));
      }
    });

    // Get candidate entries and apply filters
    let results = Array.from(candidateIds)
      .map(id => this.knowledgeBase.get(id))
      .filter(entry => entry !== undefined) as KnowledgeEntry[];

    if (filters) {
      if (filters.type) {
        results = results.filter(entry => entry.type === filters.type);
      }
      if (filters.category) {
        results = results.filter(entry => entry.category === filters.category);
      }
      if (filters.difficulty) {
        results = results.filter(entry => entry.difficulty === filters.difficulty);
      }
      if (filters.minEffectiveness) {
        results = results.filter(entry => entry.effectiveness >= filters.minEffectiveness);
      }
    }

    // Sort by relevance and effectiveness
    return results.sort((a, b) => {
      const relevanceA = this.calculateRelevance(a, searchTerms);
      const relevanceB = this.calculateRelevance(b, searchTerms);
      
      if (relevanceA !== relevanceB) {
        return relevanceB - relevanceA;
      }
      
      return b.effectiveness - a.effectiveness;
    });
  }

  private calculateRelevance(entry: KnowledgeEntry, searchTerms: string[]): number {
    let score = 0;
    const entryText = `${entry.title} ${entry.description} ${entry.tags.join(' ')}`.toLowerCase();

    searchTerms.forEach(term => {
      if (entry.title.toLowerCase().includes(term)) score += 10;
      if (entry.description.toLowerCase().includes(term)) score += 5;
      if (entry.tags.some(tag => tag.includes(term))) score += 3;
      if (entryText.includes(term)) score += 1;
    });

    return score;
  }

  public getRecommendations(context: string[], limit: number = 5): KnowledgeEntry[] {
    const scored = Array.from(this.knowledgeBase.values()).map(entry => {
      let score = 0;
      
      // Context matching
      context.forEach(contextItem => {
        if (entry.tags.includes(contextItem.toLowerCase())) score += 5;
        if (entry.category === contextItem.toLowerCase()) score += 3;
        if (entry.title.toLowerCase().includes(contextItem.toLowerCase())) score += 2;
      });

      // Boost based on effectiveness and usage
      score += entry.effectiveness * 0.1;
      score += Math.min(entry.usageCount * 0.5, 10);

      return { entry, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.entry);
  }

  public learnFromInteraction(interaction: UserInteraction): void {
    this.userInteractions.push(interaction);

    // Extract patterns from interaction
    const pattern = this.extractPattern(interaction);
    if (pattern) {
      this.updateLearningPattern(pattern);
    }

    // Generate insights if we have enough data
    if (this.userInteractions.length % 10 === 0) {
      this.generateInsights();
    }
  }

  private extractPattern(interaction: UserInteraction): LearningPattern | null {
    // Simple pattern extraction - can be enhanced with ML
    const patternId = `${interaction.action}_${interaction.result}`;
    
    return {
      id: patternId,
      pattern: interaction.action,
      frequency: 1,
      success_rate: interaction.result === 'success' ? 100 : 0,
      context: Object.keys(interaction.context),
      triggers: [interaction.action],
      outcomes: [interaction.result],
      lastSeen: interaction.timestamp
    };
  }

  private updateLearningPattern(newPattern: LearningPattern): void {
    const existing = this.learningPatterns.get(newPattern.id);
    
    if (existing) {
      existing.frequency++;
      existing.lastSeen = newPattern.lastSeen;
      
      // Update success rate
      const total = existing.frequency;
      const successes = newPattern.outcomes[0] === 'success' ? 1 : 0;
      existing.success_rate = ((existing.success_rate * (total - 1)) + (successes * 100)) / total;
      
      // Merge context and triggers
      existing.context = [...new Set([...existing.context, ...newPattern.context])];
      existing.triggers = [...new Set([...existing.triggers, ...newPattern.triggers])];
      existing.outcomes = [...new Set([...existing.outcomes, ...newPattern.outcomes])];
    } else {
      this.learningPatterns.set(newPattern.id, newPattern);
    }
  }

  private generateInsights(): void {
    console.log('📊 Generating insights from user interactions...');

    // Analyze patterns for insights
    const patterns = Array.from(this.learningPatterns.values());
    
    patterns.forEach(pattern => {
      if (pattern.frequency >= 5 && pattern.success_rate < 50) {
        // Low success rate pattern - create improvement insight
        this.addKnowledge({
          type: 'insight',
          title: `Improvement Needed: ${pattern.pattern}`,
          description: `Pattern "${pattern.pattern}" has low success rate (${pattern.success_rate}%). Consider optimization.`,
          content: {
            pattern_analysis: pattern,
            suggestions: ['Review implementation', 'Add error handling', 'Improve user guidance'],
            priority: 'high'
          },
          tags: ['improvement', 'low-success', pattern.pattern],
          category: 'optimization',
          difficulty: 'intermediate',
          effectiveness: 0,
          usageCount: 0,
          lastUsed: null,
          source: 'learning',
          confidence: 75,
          relatedEntries: []
        });
      }
    });
  }

  private updateSearchIndex(entry: KnowledgeEntry): void {
    // Remove old references
    this.searchIndex.forEach((ids, term) => {
      ids.delete(entry.id);
    });

    // Add new references
    const searchTerms = [
      ...entry.tags,
      entry.title.toLowerCase().split(' '),
      entry.description.toLowerCase().split(' '),
      entry.category,
      entry.type
    ].flat().filter(term => term.length > 2);

    searchTerms.forEach(term => {
      if (!this.searchIndex.has(term)) {
        this.searchIndex.set(term, new Set());
      }
      this.searchIndex.get(term)!.add(entry.id);
    });
  }

  public exportKnowledge(): string {
    const exportData = {
      knowledgeBase: Array.from(this.knowledgeBase.entries()),
      learningPatterns: Array.from(this.learningPatterns.entries()),
      userInteractions: this.userInteractions,
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }

  public importKnowledge(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.knowledgeBase) {
        parsed.knowledgeBase.forEach(([id, entry]: [string, KnowledgeEntry]) => {
          this.knowledgeBase.set(id, entry);
        });
      }

      if (parsed.learningPatterns) {
        parsed.learningPatterns.forEach(([id, pattern]: [string, LearningPattern]) => {
          this.learningPatterns.set(id, pattern);
        });
      }

      if (parsed.userInteractions) {
        this.userInteractions.push(...parsed.userInteractions);
      }

      this.buildSearchIndex();
      console.log('📚 Knowledge import completed');
      return true;
    } catch (error) {
      console.error('❌ Knowledge import failed:', error);
      return false;
    }
  }

  public getStatistics() {
    const categories = new Map<string, number>();
    const types = new Map<string, number>();
    let totalEffectiveness = 0;
    let totalUsage = 0;

    this.knowledgeBase.forEach(entry => {
      categories.set(entry.category, (categories.get(entry.category) || 0) + 1);
      types.set(entry.type, (types.get(entry.type) || 0) + 1);
      totalEffectiveness += entry.effectiveness;
      totalUsage += entry.usageCount;
    });

    return {
      totalEntries: this.knowledgeBase.size,
      categoriesBreakdown: Object.fromEntries(categories),
      typesBreakdown: Object.fromEntries(types),
      averageEffectiveness: this.knowledgeBase.size > 0 ? totalEffectiveness / this.knowledgeBase.size : 0,
      totalUsage,
      learningPatterns: this.learningPatterns.size,
      userInteractions: this.userInteractions.length,
      searchTerms: this.searchIndex.size
    };
  }
}

export default EnhancedAIKnowledgeDatabase;
export type { KnowledgeEntry, LearningPattern, UserInteraction };
