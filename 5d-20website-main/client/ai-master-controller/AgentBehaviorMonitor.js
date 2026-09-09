/**
 * Agent Behavior Monitor for Master AI Controller
 * Tracks and analyzes AI agent behaviors, patterns, and performance
 */

console.log('👁️ Loading Agent Behavior Monitor...');

class AgentBehaviorMonitor {
  constructor(masterController) {
    this.masterController = masterController;
    this.behaviorLogs = new Map();
    this.patterns = new Map();
    this.anomalies = new Map();
    this.performance = new Map();
    this.interactions = new Map();
    this.learningData = new Map();
    this.isMonitoring = false;
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Agent Behavior Monitor...');
    
    // Setup behavior tracking categories
    this.setupBehaviorCategories();
    
    // Initialize monitoring systems
    this.setupMonitoringSystems();
    
    // Setup pattern recognition
    this.setupPatternRecognition();
    
    // Create monitoring interface
    this.createMonitoringInterface();
    
    // Start behavior monitoring
    this.startMonitoring();
    
    console.log('✅ Agent Behavior Monitor operational');
  }

  setupBehaviorCategories() {
    this.behaviorTypes = new Map([
      ['task_execution', {
        description: 'How agents execute assigned tasks',
        metrics: ['completion_time', 'success_rate', 'retry_count', 'resource_usage'],
        patterns: ['efficient', 'struggling', 'adaptive', 'consistent']
      }],
      ['learning', {
        description: 'Agent learning and adaptation behaviors',
        metrics: ['learning_rate', 'knowledge_retention', 'skill_improvement', 'strategy_evolution'],
        patterns: ['rapid_learner', 'slow_learner', 'knowledge_hoarder', 'skill_specializer']
      }],
      ['communication', {
        description: 'Inter-agent and user communication patterns',
        metrics: ['message_frequency', 'response_time', 'collaboration_quality', 'help_requests'],
        patterns: ['collaborative', 'independent', 'help_seeking', 'knowledge_sharing']
      }],
      ['problem_solving', {
        description: 'Approach to problem solving and error handling',
        metrics: ['solution_creativity', 'persistence', 'alternative_approaches', 'error_recovery'],
        patterns: ['systematic', 'creative', 'persistent', 'adaptive']
      }],
      ['resource_management', {
        description: 'How agents manage computational resources',
        metrics: ['memory_usage', 'cpu_utilization', 'cache_efficiency', 'cleanup_behavior'],
        patterns: ['efficient', 'wasteful', 'conservative', 'aggressive']
      }],
      ['goal_pursuit', {
        description: 'Behavior towards achieving assigned goals',
        metrics: ['goal_focus', 'sub_goal_creation', 'priority_management', 'goal_completion'],
        patterns: ['focused', 'distracted', 'strategic', 'tactical']
      }]
    ]);
  }

  setupMonitoringSystems() {
    // Behavior tracking hooks
    this.trackers = new Map([
      ['task_tracker', this.trackTaskBehavior.bind(this)],
      ['learning_tracker', this.trackLearningBehavior.bind(this)],
      ['communication_tracker', this.trackCommunicationBehavior.bind(this)],
      ['problem_solving_tracker', this.trackProblemSolvingBehavior.bind(this)],
      ['resource_tracker', this.trackResourceBehavior.bind(this)],
      ['goal_tracker', this.trackGoalBehavior.bind(this)]
    ]);
    
    // Performance baselines
    this.baselines = new Map([
      ['response_time', 2000], // 2 seconds
      ['success_rate', 0.85], // 85%
      ['learning_rate', 0.1], // 10% improvement per session
      ['collaboration_score', 0.7] // 70% positive interactions
    ]);
  }

  setupPatternRecognition() {
    this.patternAnalyzers = new Map([
      ['sequence_analyzer', this.analyzeSequencePatterns.bind(this)],
      ['frequency_analyzer', this.analyzeFrequencyPatterns.bind(this)],
      ['correlation_analyzer', this.analyzeCorrelationPatterns.bind(this)],
      ['trend_analyzer', this.analyzeTrendPatterns.bind(this)],
      ['anomaly_detector', this.detectBehaviorAnomalies.bind(this)]
    ]);
  }

  createMonitoringInterface() {
    this.monitorInterface = document.createElement('div');
    this.monitorInterface.id = 'agent-behavior-monitor';
    this.monitorInterface.style.display = 'none';
    this.monitorInterface.innerHTML = this.getMonitoringHTML();
    
    document.body.appendChild(this.monitorInterface);
  }

  getMonitoringHTML() {
    return `
      <div style="
        position: fixed;
        top: 60px;
        left: 60px;
        width: 85%;
        height: 85%;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #f59e0b;
        border-radius: 12px;
        z-index: 10002;
        color: white;
        display: flex;
        flex-direction: column;
      ">
        <div style="padding: 15px; border-bottom: 1px solid #f59e0b; display: flex; justify-content: between; align-items: center;">
          <h3 style="margin: 0; color: #f59e0b; font-size: 18px;">👁️ Agent Behavior Monitor</h3>
          <div>
            <button onclick="window.agentBehaviorMonitor.toggleMonitoring()" id="monitoring-toggle"
                    style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
              ⏸️ Pause Monitoring
            </button>
            <button onclick="window.agentBehaviorMonitor.exportBehaviorData()"
                    style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
              📊 Export Data
            </button>
            <button onclick="window.agentBehaviorMonitor.closeMonitor()"
                    style="background: none; border: none; color: #f59e0b; cursor: pointer; font-size: 20px;">×</button>
          </div>
        </div>
        
        <div style="display: flex; flex: 1; overflow: hidden;">
          <!-- Agent List Sidebar -->
          <div style="width: 250px; border-right: 1px solid #f59e0b; padding: 15px; overflow-y: auto;">
            <h4 style="margin: 0 0 10px 0; color: #ffffff;">🤖 Monitored Agents</h4>
            <div id="agent-behavior-list"></div>
            
            <h4 style="margin: 20px 0 10px 0; color: #ef4444;">⚠️ Behavior Anomalies</h4>
            <div id="behavior-anomalies"></div>
            
            <h4 style="margin: 20px 0 10px 0; color: #8b5cf6;">📈 Patterns</h4>
            <div id="behavior-patterns"></div>
          </div>
          
          <!-- Main Analysis Area -->
          <div style="flex: 1; padding: 15px; display: flex; flex-direction: column;">
            <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center;">
              <select id="agent-selector" onchange="window.agentBehaviorMonitor.selectAgent(this.value)"
                      style="background: rgba(255,255,255,0.1); border: 1px solid #555; border-radius: 4px; color: white; padding: 6px;">
                <option value="">Select Agent...</option>
              </select>
              <select id="behavior-type-selector" onchange="window.agentBehaviorMonitor.selectBehaviorType(this.value)"
                      style="background: rgba(255,255,255,0.1); border: 1px solid #555; border-radius: 4px; color: white; padding: 6px;">
                <option value="">Select Behavior Type...</option>
              </select>
              <button onclick="window.agentBehaviorMonitor.analyzeBehavior()"
                      style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                🔍 Analyze Behavior
              </button>
              <button onclick="window.agentBehaviorMonitor.detectPatterns()"
                      style="background: #8b5cf6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                📊 Detect Patterns
              </button>
            </div>
            
            <div style="display: flex; gap: 15px; flex: 1;">
              <!-- Behavior Timeline -->
              <div style="flex: 1; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #ffffff;">📅 Behavior Timeline</h4>
                <div id="behavior-timeline" style="height: 200px; overflow-y: auto; border: 1px solid #555; border-radius: 4px; padding: 8px;"></div>
              </div>
              
              <!-- Performance Metrics -->
              <div style="flex: 1; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #ffffff;">📊 Performance Metrics</h4>
                <div id="performance-metrics" style="height: 200px; overflow-y: auto;"></div>
              </div>
            </div>
            
            <!-- Detailed Analysis -->
            <div style="margin-top: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px;">
              <h4 style="margin: 0 0 10px 0; color: #ffffff;">🧠 Behavior Analysis</h4>
              <div id="behavior-analysis" style="height: 150px; overflow-y: auto; font-family: monospace; font-size: 12px;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.performBehaviorMonitoring();
    }, 5000); // Monitor every 5 seconds
    
    console.log('👁️ Agent behavior monitoring started');
  }

  stopMonitoring() {
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    console.log('⏹️ Agent behavior monitoring stopped');
  }

  performBehaviorMonitoring() {
    if (!this.isMonitoring) return;
    
    // Get current agents from master controller
    if (this.masterController.agentManager) {
      const agents = this.masterController.agentManager.agents;
      
      agents.forEach((agent, agentId) => {
        this.monitorAgentBehavior(agentId, agent);
      });
    }
    
    // Analyze patterns
    this.analyzeAllPatterns();
    
    // Update interface if visible
    this.updateMonitoringInterface();
  }

  monitorAgentBehavior(agentId, agent) {
    const currentBehavior = this.captureBehaviorSnapshot(agentId, agent);
    
    // Store behavior log
    if (!this.behaviorLogs.has(agentId)) {
      this.behaviorLogs.set(agentId, []);
    }
    
    const behaviorLog = this.behaviorLogs.get(agentId);
    behaviorLog.push(currentBehavior);
    
    // Limit log size
    if (behaviorLog.length > 1000) {
      behaviorLog.splice(0, 500);
    }
    
    // Track specific behavior types
    this.trackers.forEach((tracker, type) => {
      tracker(agentId, agent, currentBehavior);
    });
    
    // Update performance metrics
    this.updatePerformanceMetrics(agentId, currentBehavior);
  }

  captureBehaviorSnapshot(agentId, agent) {
    return {
      timestamp: Date.now(),
      agentId,
      status: agent.status,
      currentTasks: agent.currentTasks.length,
      completedTasks: agent.completedTasks,
      errors: agent.errors.length,
      performance: { ...agent.performance },
      lastActive: agent.lastActive,
      capabilities: agent.capabilities || [],
      specialization: agent.specialization,
      learningData: this.getLearningSnapshot(agentId),
      resourceUsage: this.getResourceSnapshot(agentId),
      interactions: this.getInteractionSnapshot(agentId)
    };
  }

  getLearningSnapshot(agentId) {
    return {
      knowledgeBase: this.learningData.get(agentId)?.knowledgeBase?.size || 0,
      skillLevel: this.learningData.get(agentId)?.skillLevel || 0,
      adaptations: this.learningData.get(agentId)?.adaptations || 0
    };
  }

  getResourceSnapshot(agentId) {
    // Simplified resource tracking
    return {
      memoryUsage: Math.random() * 100, // Simulated
      cpuUsage: Math.random() * 100, // Simulated
      taskQueueSize: this.masterController.agentManager?.taskQueues?.get(agentId)?.length || 0
    };
  }

  getInteractionSnapshot(agentId) {
    const interactions = this.interactions.get(agentId) || [];
    const recentInteractions = interactions.filter(i => 
      Date.now() - i.timestamp < 300000 // Last 5 minutes
    );
    
    return {
      totalInteractions: interactions.length,
      recentInteractions: recentInteractions.length,
      collaborations: recentInteractions.filter(i => i.type === 'collaboration').length,
      helpRequests: recentInteractions.filter(i => i.type === 'help_request').length
    };
  }

  trackTaskBehavior(agentId, agent, snapshot) {
    const taskBehavior = {
      timestamp: Date.now(),
      agentId,
      type: 'task_execution',
      metrics: {
        tasksInProgress: snapshot.currentTasks,
        completionRate: snapshot.completedTasks,
        errorRate: snapshot.errors,
        efficiency: agent.performance?.efficiency || 0
      }
    };
    
    this.storeBehaviorData(agentId, 'task_execution', taskBehavior);
  }

  trackLearningBehavior(agentId, agent, snapshot) {
    const learningBehavior = {
      timestamp: Date.now(),
      agentId,
      type: 'learning',
      metrics: {
        skillImprovement: this.calculateSkillImprovement(agentId),
        knowledgeGrowth: this.calculateKnowledgeGrowth(agentId),
        adaptationRate: this.calculateAdaptationRate(agentId)
      }
    };
    
    this.storeBehaviorData(agentId, 'learning', learningBehavior);
  }

  trackCommunicationBehavior(agentId, agent, snapshot) {
    const commBehavior = {
      timestamp: Date.now(),
      agentId,
      type: 'communication',
      metrics: {
        messageFrequency: snapshot.interactions.recentInteractions,
        collaborationScore: this.calculateCollaborationScore(agentId),
        responsiveness: this.calculateResponsiveness(agentId)
      }
    };
    
    this.storeBehaviorData(agentId, 'communication', commBehavior);
  }

  trackProblemSolvingBehavior(agentId, agent, snapshot) {
    const problemSolvingBehavior = {
      timestamp: Date.now(),
      agentId,
      type: 'problem_solving',
      metrics: {
        solutionCreativity: this.calculateCreativity(agentId),
        persistence: this.calculatePersistence(agentId),
        errorRecovery: this.calculateErrorRecovery(agentId)
      }
    };
    
    this.storeBehaviorData(agentId, 'problem_solving', problemSolvingBehavior);
  }

  trackResourceBehavior(agentId, agent, snapshot) {
    const resourceBehavior = {
      timestamp: Date.now(),
      agentId,
      type: 'resource_management',
      metrics: {
        memoryEfficiency: 100 - snapshot.resourceUsage.memoryUsage,
        cpuEfficiency: 100 - snapshot.resourceUsage.cpuUsage,
        queueManagement: this.calculateQueueEfficiency(agentId)
      }
    };
    
    this.storeBehaviorData(agentId, 'resource_management', resourceBehavior);
  }

  trackGoalBehavior(agentId, agent, snapshot) {
    const goalBehavior = {
      timestamp: Date.now(),
      agentId,
      type: 'goal_pursuit',
      metrics: {
        goalFocus: this.calculateGoalFocus(agentId),
        priorityManagement: this.calculatePriorityManagement(agentId),
        goalCompletion: agent.performance?.successRate || 0
      }
    };
    
    this.storeBehaviorData(agentId, 'goal_pursuit', goalBehavior);
  }

  storeBehaviorData(agentId, behaviorType, data) {
    const key = `${agentId}_${behaviorType}`;
    
    if (!this.behaviorLogs.has(key)) {
      this.behaviorLogs.set(key, []);
    }
    
    const log = this.behaviorLogs.get(key);
    log.push(data);
    
    // Limit log size
    if (log.length > 500) {
      log.splice(0, 250);
    }
  }

  // Calculation methods
  calculateSkillImprovement(agentId) {
    const behaviorLog = this.behaviorLogs.get(agentId) || [];
    if (behaviorLog.length < 2) return 0;
    
    const recent = behaviorLog.slice(-10);
    const old = behaviorLog.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, b) => sum + (b.performance?.efficiency || 0), 0) / recent.length;
    const oldAvg = old.reduce((sum, b) => sum + (b.performance?.efficiency || 0), 0) / old.length;
    
    return ((recentAvg - oldAvg) / oldAvg) * 100;
  }

  calculateKnowledgeGrowth(agentId) {
    // Simplified knowledge growth calculation
    const learningData = this.learningData.get(agentId);
    return learningData ? learningData.knowledgeBase * 0.1 : 0;
  }

  calculateAdaptationRate(agentId) {
    // Simplified adaptation rate calculation
    const behaviorLog = this.behaviorLogs.get(agentId) || [];
    const recentAdaptations = behaviorLog.filter(b => 
      Date.now() - b.timestamp < 3600000 // Last hour
    ).length;
    
    return recentAdaptations * 0.1;
  }

  calculateCollaborationScore(agentId) {
    const interactions = this.interactions.get(agentId) || [];
    const positive = interactions.filter(i => i.outcome === 'positive').length;
    const total = interactions.length;
    
    return total > 0 ? (positive / total) * 100 : 50;
  }

  calculateResponsiveness(agentId) {
    const behaviorLog = this.behaviorLogs.get(agentId) || [];
    const recentBehaviors = behaviorLog.slice(-10);
    
    const avgResponseTime = recentBehaviors.reduce((sum, b) => {
      return sum + (Date.now() - b.lastActive);
    }, 0) / recentBehaviors.length;
    
    return Math.max(0, 100 - (avgResponseTime / 1000)); // Lower is better
  }

  calculateCreativity(agentId) {
    // Simplified creativity measure based on solution diversity
    return Math.random() * 100; // Placeholder
  }

  calculatePersistence(agentId) {
    const behaviorLog = this.behaviorLogs.get(agentId) || [];
    const retryAttempts = behaviorLog.reduce((sum, b) => sum + (b.errors || 0), 0);
    
    return Math.min(100, retryAttempts * 10);
  }

  calculateErrorRecovery(agentId) {
    const behaviorLog = this.behaviorLogs.get(agentId) || [];
    const errors = behaviorLog.reduce((sum, b) => sum + (b.errors || 0), 0);
    const recoveries = behaviorLog.filter(b => b.errors === 0).length;
    
    return errors > 0 ? (recoveries / errors) * 100 : 100;
  }

  calculateQueueEfficiency(agentId) {
    const queueSize = this.masterController.agentManager?.taskQueues?.get(agentId)?.length || 0;
    return Math.max(0, 100 - queueSize * 10);
  }

  calculateGoalFocus(agentId) {
    // Measure how consistently agent works on goals
    return Math.random() * 100; // Placeholder
  }

  calculatePriorityManagement(agentId) {
    // Measure how well agent handles task priorities
    return Math.random() * 100; // Placeholder
  }

  updatePerformanceMetrics(agentId, snapshot) {
    if (!this.performance.has(agentId)) {
      this.performance.set(agentId, {
        history: [],
        current: {},
        trends: {}
      });
    }
    
    const perfData = this.performance.get(agentId);
    
    perfData.current = {
      efficiency: snapshot.performance.efficiency,
      successRate: snapshot.performance.successRate,
      responseTime: Date.now() - snapshot.lastActive,
      timestamp: Date.now()
    };
    
    perfData.history.push({ ...perfData.current });
    
    // Limit history
    if (perfData.history.length > 100) {
      perfData.history.splice(0, 50);
    }
    
    // Calculate trends
    this.calculateTrends(agentId, perfData);
  }

  calculateTrends(agentId, perfData) {
    const history = perfData.history;
    if (history.length < 5) return;
    
    const recent = history.slice(-5);
    const older = history.slice(-10, -5);
    
    perfData.trends = {
      efficiency: this.calculateTrend(older, recent, 'efficiency'),
      successRate: this.calculateTrend(older, recent, 'successRate'),
      responseTime: this.calculateTrend(older, recent, 'responseTime')
    };
  }

  calculateTrend(older, recent, metric) {
    const oldAvg = older.reduce((sum, item) => sum + item[metric], 0) / older.length;
    const recentAvg = recent.reduce((sum, item) => sum + item[metric], 0) / recent.length;
    
    const change = ((recentAvg - oldAvg) / oldAvg) * 100;
    
    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'improving' : 'declining';
  }

  analyzeAllPatterns() {
    this.behaviorLogs.forEach((log, key) => {
      this.patternAnalyzers.forEach((analyzer, type) => {
        try {
          const pattern = analyzer(key, log);
          if (pattern) {
            this.storePattern(key, type, pattern);
          }
        } catch (error) {
          console.warn(`Pattern analyzer ${type} failed for ${key}:`, error);
        }
      });
    });
  }

  analyzeSequencePatterns(key, log) {
    if (log.length < 10) return null;
    
    // Look for repeating sequences in behavior
    const sequences = [];
    const sequenceLength = 3;
    
    for (let i = 0; i <= log.length - sequenceLength * 2; i++) {
      const seq1 = log.slice(i, i + sequenceLength);
      const seq2 = log.slice(i + sequenceLength, i + sequenceLength * 2);
      
      if (this.sequencesEqual(seq1, seq2)) {
        sequences.push({
          pattern: seq1.map(item => item.type || 'unknown'),
          startIndex: i,
          confidence: 0.8
        });
      }
    }
    
    return sequences.length > 0 ? {
      type: 'sequence',
      patterns: sequences,
      count: sequences.length
    } : null;
  }

  sequencesEqual(seq1, seq2) {
    if (seq1.length !== seq2.length) return false;
    
    return seq1.every((item, index) => {
      const item2 = seq2[index];
      return item.type === item2.type && 
             Math.abs(item.timestamp - item2.timestamp) < 10000; // Within 10 seconds
    });
  }

  analyzeFrequencyPatterns(key, log) {
    const frequencies = new Map();
    
    log.forEach(item => {
      const type = item.type || 'unknown';
      frequencies.set(type, (frequencies.get(type) || 0) + 1);
    });
    
    const totalItems = log.length;
    const patterns = Array.from(frequencies.entries()).map(([type, count]) => ({
      type,
      frequency: count / totalItems,
      count
    })).filter(p => p.frequency > 0.1); // Only patterns that occur >10% of the time
    
    return patterns.length > 0 ? {
      type: 'frequency',
      patterns,
      dominantPattern: patterns.reduce((max, p) => p.frequency > max.frequency ? p : max)
    } : null;
  }

  analyzeCorrelationPatterns(key, log) {
    // Simplified correlation analysis
    if (log.length < 20) return null;
    
    const correlations = [];
    const metrics = ['efficiency', 'successRate', 'responseTime'];
    
    for (let i = 0; i < metrics.length; i++) {
      for (let j = i + 1; j < metrics.length; j++) {
        const correlation = this.calculateCorrelation(log, metrics[i], metrics[j]);
        if (Math.abs(correlation) > 0.5) {
          correlations.push({
            metric1: metrics[i],
            metric2: metrics[j],
            correlation,
            strength: Math.abs(correlation) > 0.8 ? 'strong' : 'moderate'
          });
        }
      }
    }
    
    return correlations.length > 0 ? {
      type: 'correlation',
      correlations
    } : null;
  }

  calculateCorrelation(log, metric1, metric2) {
    const values1 = log.map(item => item.metrics?.[metric1] || item.performance?.[metric1] || 0);
    const values2 = log.map(item => item.metrics?.[metric2] || item.performance?.[metric2] || 0);
    
    if (values1.length !== values2.length) return 0;
    
    const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
    const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;
    
    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;
    
    for (let i = 0; i < values1.length; i++) {
      const diff1 = values1[i] - mean1;
      const diff2 = values2[i] - mean2;
      
      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    }
    
    const denominator = Math.sqrt(denominator1 * denominator2);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  analyzeTrendPatterns(key, log) {
    if (log.length < 10) return null;
    
    const trends = {};
    const metrics = ['efficiency', 'successRate', 'taskCompletion'];
    
    metrics.forEach(metric => {
      const values = log.map(item => 
        item.metrics?.[metric] || item.performance?.[metric] || 0
      );
      
      const trend = this.calculateLinearTrend(values);
      if (Math.abs(trend.slope) > 0.1) {
        trends[metric] = {
          direction: trend.slope > 0 ? 'increasing' : 'decreasing',
          slope: trend.slope,
          confidence: trend.rSquared
        };
      }
    });
    
    return Object.keys(trends).length > 0 ? {
      type: 'trend',
      trends
    } : null;
  }

  calculateLinearTrend(values) {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * values[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const meanY = sumY / n;
    const totalSumSquares = values.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
    const residualSumSquares = values.reduce((sum, val, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(val - predicted, 2);
    }, 0);
    
    const rSquared = 1 - (residualSumSquares / totalSumSquares);
    
    return { slope, intercept, rSquared };
  }

  detectBehaviorAnomalies(key, log) {
    if (log.length < 5) return null;
    
    const anomalies = [];
    const recent = log.slice(-10);
    
    // Check for sudden performance drops
    const performanceDrop = this.detectPerformanceDrop(recent);
    if (performanceDrop) anomalies.push(performanceDrop);
    
    // Check for unusual activity patterns
    const activityAnomaly = this.detectActivityAnomaly(recent);
    if (activityAnomaly) anomalies.push(activityAnomaly);
    
    // Check for communication anomalies
    const communicationAnomaly = this.detectCommunicationAnomaly(recent);
    if (communicationAnomaly) anomalies.push(communicationAnomaly);
    
    return anomalies.length > 0 ? {
      type: 'anomaly',
      anomalies,
      severity: this.calculateAnomalySeverity(anomalies)
    } : null;
  }

  detectPerformanceDrop(recent) {
    const efficiencyValues = recent.map(item => 
      item.performance?.efficiency || item.metrics?.efficiency || 0
    );
    
    const avgEfficiency = efficiencyValues.reduce((sum, val) => sum + val, 0) / efficiencyValues.length;
    const baseline = this.baselines.get('efficiency') || 80;
    
    if (avgEfficiency < baseline * 0.7) { // 30% below baseline
      return {
        type: 'performance_drop',
        metric: 'efficiency',
        current: avgEfficiency,
        baseline,
        severity: 'high'
      };
    }
    
    return null;
  }

  detectActivityAnomaly(recent) {
    const activityLevels = recent.map(item => item.currentTasks || 0);
    const avgActivity = activityLevels.reduce((sum, val) => sum + val, 0) / activityLevels.length;
    
    // Check for sudden inactivity
    if (avgActivity === 0 && recent.length > 3) {
      return {
        type: 'inactivity',
        duration: recent.length,
        severity: 'medium'
      };
    }
    
    // Check for excessive activity
    if (avgActivity > 10) {
      return {
        type: 'overactivity',
        level: avgActivity,
        severity: 'low'
      };
    }
    
    return null;
  }

  detectCommunicationAnomaly(recent) {
    const commLevels = recent.map(item => 
      item.interactions?.recentInteractions || 0
    );
    
    const avgComm = commLevels.reduce((sum, val) => sum + val, 0) / commLevels.length;
    
    if (avgComm === 0 && recent.length > 5) {
      return {
        type: 'communication_silence',
        duration: recent.length,
        severity: 'low'
      };
    }
    
    return null;
  }

  calculateAnomalySeverity(anomalies) {
    const severityScores = { low: 1, medium: 2, high: 3 };
    const totalScore = anomalies.reduce((sum, anomaly) => 
      sum + (severityScores[anomaly.severity] || 1), 0
    );
    
    if (totalScore >= 6) return 'high';
    if (totalScore >= 3) return 'medium';
    return 'low';
  }

  storePattern(key, type, pattern) {
    if (!this.patterns.has(key)) {
      this.patterns.set(key, new Map());
    }
    
    const agentPatterns = this.patterns.get(key);
    agentPatterns.set(type, {
      ...pattern,
      detected: Date.now(),
      key
    });
  }

  showMonitor() {
    this.monitorInterface.style.display = 'block';
    this.updateMonitoringInterface();
  }

  closeMonitor() {
    this.monitorInterface.style.display = 'none';
  }

  toggleMonitoring() {
    const button = document.getElementById('monitoring-toggle');
    
    if (this.isMonitoring) {
      this.stopMonitoring();
      button.textContent = '▶️ Start Monitoring';
      button.style.background = '#10b981';
    } else {
      this.startMonitoring();
      button.textContent = '⏸️ Pause Monitoring';
      button.style.background = '#ef4444';
    }
  }

  updateMonitoringInterface() {
    if (this.monitorInterface.style.display === 'none') return;
    
    this.updateAgentList();
    this.updateAnomalyList();
    this.updatePatternList();
    this.updateSelectors();
  }

  updateAgentList() {
    const listElement = document.getElementById('agent-behavior-list');
    if (!listElement) return;
    
    const agents = this.masterController.agentManager?.agents || new Map();
    
    const agentHTML = Array.from(agents.entries()).map(([id, agent]) => {
      const behaviorLog = this.behaviorLogs.get(id) || [];
      const patterns = this.patterns.get(id) || new Map();
      
      return `
        <div style="padding: 6px; margin: 2px 0; background: rgba(245, 158, 11, 0.1); border-radius: 4px; cursor: pointer;"
             onclick="window.agentBehaviorMonitor.selectAgent('${id}')">
          <div style="font-weight: bold; font-size: 11px; color: #f59e0b;">${agent.name || id}</div>
          <div style="font-size: 10px; color: #ccc;">
            Behaviors: ${behaviorLog.length} | Patterns: ${patterns.size}
          </div>
          <div style="font-size: 9px; color: #888;">
            Status: ${agent.status} | Tasks: ${agent.currentTasks?.length || 0}
          </div>
        </div>
      `;
    }).join('');
    
    listElement.innerHTML = agentHTML;
  }

  updateAnomalyList() {
    const listElement = document.getElementById('behavior-anomalies');
    if (!listElement) return;
    
    const anomalies = [];
    this.patterns.forEach((patternMap, agentKey) => {
      const anomalyPattern = patternMap.get('anomaly_detector');
      if (anomalyPattern) {
        anomalies.push({ agentKey, ...anomalyPattern });
      }
    });
    
    const anomalyHTML = anomalies.map(anomaly => `
      <div style="padding: 6px; margin: 2px 0; background: rgba(239, 68, 68, 0.2); border-radius: 4px; border-left: 3px solid #ef4444;">
        <div style="font-weight: bold; font-size: 11px; color: #ef4444;">
          ${anomaly.agentKey.split('_')[0]}
        </div>
        <div style="font-size: 10px; color: #ccc;">
          ${anomaly.anomalies?.length || 0} anomalies | Severity: ${anomaly.severity}
        </div>
      </div>
    `).join('');
    
    listElement.innerHTML = anomalyHTML || '<div style="color: #666; font-size: 11px;">No anomalies detected</div>';
  }

  updatePatternList() {
    const listElement = document.getElementById('behavior-patterns');
    if (!listElement) return;
    
    const allPatterns = [];
    this.patterns.forEach((patternMap, agentKey) => {
      patternMap.forEach((pattern, type) => {
        if (type !== 'anomaly_detector') {
          allPatterns.push({ agentKey, type, ...pattern });
        }
      });
    });
    
    const patternHTML = allPatterns.slice(-10).map(pattern => `
      <div style="padding: 6px; margin: 2px 0; background: rgba(139, 92, 246, 0.1); border-radius: 4px;">
        <div style="font-weight: bold; font-size: 11px; color: #8b5cf6;">
          ${pattern.type.replace('_', ' ')}
        </div>
        <div style="font-size: 10px; color: #ccc;">
          Agent: ${pattern.agentKey.split('_')[0]}
        </div>
      </div>
    `).join('');
    
    listElement.innerHTML = patternHTML || '<div style="color: #666; font-size: 11px;">No patterns detected</div>';
  }

  updateSelectors() {
    const agentSelector = document.getElementById('agent-selector');
    const behaviorSelector = document.getElementById('behavior-type-selector');
    
    if (agentSelector) {
      const agents = this.masterController.agentManager?.agents || new Map();
      const agentOptions = Array.from(agents.entries()).map(([id, agent]) => 
        `<option value="${id}">${agent.name || id}</option>`
      ).join('');
      
      agentSelector.innerHTML = '<option value="">Select Agent...</option>' + agentOptions;
    }
    
    if (behaviorSelector) {
      const behaviorOptions = Array.from(this.behaviorTypes.keys()).map(type => 
        `<option value="${type}">${type.replace('_', ' ')}</option>`
      ).join('');
      
      behaviorSelector.innerHTML = '<option value="">Select Behavior Type...</option>' + behaviorOptions;
    }
  }

  selectAgent(agentId) {
    this.selectedAgent = agentId;
    this.updateBehaviorTimeline();
    this.updatePerformanceDisplay();
  }

  selectBehaviorType(behaviorType) {
    this.selectedBehaviorType = behaviorType;
    this.updateBehaviorTimeline();
  }

  updateBehaviorTimeline() {
    const timelineElement = document.getElementById('behavior-timeline');
    if (!timelineElement || !this.selectedAgent) return;
    
    const behaviorLog = this.behaviorLogs.get(this.selectedAgent) || [];
    const filteredLog = this.selectedBehaviorType 
      ? behaviorLog.filter(b => b.type === this.selectedBehaviorType)
      : behaviorLog;
    
    const timelineHTML = filteredLog.slice(-20).map(behavior => `
      <div style="padding: 4px; margin: 2px 0; background: rgba(255,255,255,0.1); border-radius: 4px;">
        <div style="font-size: 11px; font-weight: bold;">
          ${new Date(behavior.timestamp).toLocaleTimeString()}
        </div>
        <div style="font-size: 10px; color: #ccc;">
          ${behavior.type || 'general'} | Status: ${behavior.status}
        </div>
        <div style="font-size: 9px; color: #888;">
          Tasks: ${behavior.currentTasks} | Errors: ${behavior.errors}
        </div>
      </div>
    `).join('');
    
    timelineElement.innerHTML = timelineHTML;
  }

  updatePerformanceDisplay() {
    const metricsElement = document.getElementById('performance-metrics');
    if (!metricsElement || !this.selectedAgent) return;
    
    const perfData = this.performance.get(this.selectedAgent);
    if (!perfData) return;
    
    const metricsHTML = `
      <div style="margin-bottom: 10px;">
        <h5 style="margin: 0; color: #10b981;">Current Performance</h5>
        <div style="font-size: 11px; margin: 4px 0;">
          Efficiency: ${perfData.current.efficiency?.toFixed(1) || 'N/A'}%
        </div>
        <div style="font-size: 11px; margin: 4px 0;">
          Success Rate: ${perfData.current.successRate?.toFixed(1) || 'N/A'}%
        </div>
        <div style="font-size: 11px; margin: 4px 0;">
          Response Time: ${perfData.current.responseTime || 'N/A'}ms
        </div>
      </div>
      
      <div>
        <h5 style="margin: 0; color: #8b5cf6;">Trends</h5>
        ${Object.entries(perfData.trends || {}).map(([metric, trend]) => `
          <div style="font-size: 11px; margin: 4px 0;">
            ${metric}: <span style="color: ${trend === 'improving' ? '#10b981' : trend === 'declining' ? '#ef4444' : '#6b7280'};">
              ${trend}
            </span>
          </div>
        `).join('')}
      </div>
    `;
    
    metricsElement.innerHTML = metricsHTML;
  }

  analyzeBehavior() {
    if (!this.selectedAgent) {
      alert('Please select an agent first');
      return;
    }
    
    const analysis = this.performDetailedAnalysis(this.selectedAgent);
    this.displayBehaviorAnalysis(analysis);
  }

  performDetailedAnalysis(agentId) {
    const behaviorLog = this.behaviorLogs.get(agentId) || [];
    const patterns = this.patterns.get(agentId) || new Map();
    const perfData = this.performance.get(agentId);
    
    return {
      agentId,
      behaviorCount: behaviorLog.length,
      patternCount: patterns.size,
      performance: perfData?.current || {},
      trends: perfData?.trends || {},
      anomalies: patterns.get('anomaly_detector')?.anomalies || [],
      recommendations: this.generateRecommendations(agentId, behaviorLog, patterns)
    };
  }

  generateRecommendations(agentId, behaviorLog, patterns) {
    const recommendations = [];
    
    // Performance recommendations
    const recentBehaviors = behaviorLog.slice(-10);
    const avgEfficiency = recentBehaviors.reduce((sum, b) => 
      sum + (b.performance?.efficiency || 0), 0) / recentBehaviors.length;
    
    if (avgEfficiency < 70) {
      recommendations.push('Consider optimizing agent efficiency - current performance below expectations');
    }
    
    // Pattern recommendations
    if (patterns.has('frequency') && patterns.get('frequency').dominantPattern) {
      const dominant = patterns.get('frequency').dominantPattern;
      if (dominant.frequency > 0.8) {
        recommendations.push(`Agent shows strong ${dominant.type} behavior pattern - consider diversifying tasks`);
      }
    }
    
    // Anomaly recommendations
    if (patterns.has('anomaly_detector')) {
      const anomalies = patterns.get('anomaly_detector').anomalies;
      if (anomalies.length > 0) {
        recommendations.push(`${anomalies.length} behavioral anomalies detected - investigate potential issues`);
      }
    }
    
    return recommendations.length > 0 ? recommendations : ['Agent behavior appears normal'];
  }

  displayBehaviorAnalysis(analysis) {
    const analysisElement = document.getElementById('behavior-analysis');
    if (!analysisElement) return;
    
    const analysisHTML = `
<strong>Agent Analysis: ${analysis.agentId}</strong>

Behavior Records: ${analysis.behaviorCount}
Detected Patterns: ${analysis.patternCount}

Current Performance:
  Efficiency: ${analysis.performance.efficiency?.toFixed(1) || 'N/A'}%
  Success Rate: ${analysis.performance.successRate?.toFixed(1) || 'N/A'}%
  Response Time: ${analysis.performance.responseTime || 'N/A'}ms

Performance Trends:
${Object.entries(analysis.trends).map(([metric, trend]) => 
  `  ${metric}: ${trend}`
).join('\n')}

Anomalies Detected: ${analysis.anomalies.length}
${analysis.anomalies.map(a => `  - ${a.type}: ${a.severity}`).join('\n')}

Recommendations:
${analysis.recommendations.map(r => `  • ${r}`).join('\n')}
    `;
    
    analysisElement.textContent = analysisHTML;
  }

  detectPatterns() {
    console.log('🔍 Running pattern detection...');
    this.analyzeAllPatterns();
    this.updatePatternList();
    
    const totalPatterns = Array.from(this.patterns.values())
      .reduce((sum, patternMap) => sum + patternMap.size, 0);
    
    alert(`Pattern detection complete. Found ${totalPatterns} behavior patterns across all agents.`);
  }

  exportBehaviorData() {
    const exportData = {
      behaviorLogs: Object.fromEntries(this.behaviorLogs),
      patterns: Object.fromEntries(Array.from(this.patterns.entries()).map(([key, map]) => 
        [key, Object.fromEntries(map)]
      )),
      performance: Object.fromEntries(this.performance),
      exported: Date.now(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-behavior-data-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    console.log('📊 Behavior data exported');
  }

  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      totalBehaviorLogs: this.behaviorLogs.size,
      totalPatterns: Array.from(this.patterns.values()).reduce((sum, map) => sum + map.size, 0),
      anomalies: Array.from(this.patterns.values()).reduce((sum, map) => 
        sum + (map.get('anomaly_detector')?.anomalies?.length || 0), 0
      )
    };
  }

  ping() {
    return {
      service: 'AgentBehaviorMonitor',
      status: this.isMonitoring ? 'active' : 'inactive',
      behaviorLogs: this.behaviorLogs.size,
      patterns: Array.from(this.patterns.values()).reduce((sum, map) => sum + map.size, 0),
      health: 'healthy'
    };
  }
}

// Export for use by Master AI Controller
window.AgentBehaviorMonitor = AgentBehaviorMonitor;

console.log('✅ Agent Behavior Monitor loaded');
