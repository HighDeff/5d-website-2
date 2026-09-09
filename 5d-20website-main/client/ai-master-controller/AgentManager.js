/**
 * Agent Manager for Master AI Controller
 * Handles agent-based task distribution and component-specific messaging
 */

console.log('🤖 Loading Agent Manager...');

class AgentManager {
  constructor(masterController) {
    this.masterController = masterController;
    this.agents = new Map();
    this.componentAgents = new Map();
    this.taskQueues = new Map();
    this.messageQueues = new Map();
    this.agentStrategies = new Map();
    this.performanceMetrics = new Map();
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Agent Manager...');
    
    // Create specialized agents
    this.createSpecializedAgents();
    
    // Setup component-specific agents
    this.setupComponentAgents();
    
    // Initialize task distribution system
    this.initializeTaskDistribution();
    
    // Setup agent communication
    this.setupAgentCommunication();
    
    // Start agent monitoring
    this.startAgentMonitoring();
    
    console.log('✅ Agent Manager operational');
  }

  createSpecializedAgents() {
    const agentConfigs = [
      {
        id: 'error-handler',
        name: 'Error Handler Agent',
        specialization: 'error_handling',
        responsibilities: ['error_detection', 'error_analysis', 'fix_generation', 'prevention'],
        priority: 'high',
        autonomy: 0.8
      },
      {
        id: 'screenshot-analyzer',
        name: 'Screenshot Analysis Agent',
        specialization: 'visual_analysis',
        responsibilities: ['ocr_processing', 'pattern_recognition', 'negative_field_detection'],
        priority: 'medium',
        autonomy: 0.6
      },
      {
        id: 'canvas-controller',
        name: 'Canvas Control Agent',
        specialization: 'canvas_interaction',
        responsibilities: ['canvas_manipulation', 'entity_creation', 'interaction_simulation'],
        priority: 'medium',
        autonomy: 0.7
      },
      {
        id: 'database-communicator',
        name: 'Database Communication Agent',
        specialization: 'database_operations',
        responsibilities: ['data_queries', 'ai_communication', 'result_processing'],
        priority: 'high',
        autonomy: 0.5
      },
      {
        id: 'learning-coordinator',
        name: 'Learning Coordination Agent',
        specialization: 'machine_learning',
        responsibilities: ['pattern_learning', 'strategy_development', 'improvement_tracking'],
        priority: 'low',
        autonomy: 0.9
      },
      {
        id: 'system-monitor',
        name: 'System Monitoring Agent',
        specialization: 'system_health',
        responsibilities: ['health_monitoring', 'performance_tracking', 'alert_generation'],
        priority: 'medium',
        autonomy: 0.4
      },
      {
        id: 'repair-specialist',
        name: 'Repair Specialist Agent',
        specialization: 'system_repair',
        responsibilities: ['component_repair', 'followup_actions', 'verification'],
        priority: 'high',
        autonomy: 0.6
      },
      {
        id: 'strategy-advisor',
        name: 'Strategy Advisory Agent',
        specialization: 'strategic_planning',
        responsibilities: ['goal_setting', 'strategy_development', 'completion_planning'],
        priority: 'low',
        autonomy: 0.8
      }
    ];
    
    agentConfigs.forEach(config => {
      this.createAgent(config);
    });
  }

  createAgent(config) {
    const agent = {
      ...config,
      status: 'active',
      currentTasks: [],
      completedTasks: 0,
      errors: [],
      performance: {
        tasksCompleted: 0,
        averageTime: 0,
        successRate: 100,
        efficiency: 85
      },
      capabilities: this.getAgentCapabilities(config.specialization),
      messageQueue: [],
      strategies: new Map(),
      learningData: new Map(),
      created: Date.now(),
      lastActive: Date.now()
    };
    
    // Initialize agent-specific methods
    this.initializeAgentMethods(agent);
    
    this.agents.set(config.id, agent);
    this.taskQueues.set(config.id, []);
    this.messageQueues.set(config.id, []);
    
    console.log(`🤖 Created agent: ${config.name} (${config.id})`);
  }

  getAgentCapabilities(specialization) {
    const capabilityMap = {
      'error_handling': [
        'analyzeError', 'generateFix', 'applyFix', 'preventError', 'learnFromError'
      ],
      'visual_analysis': [
        'processOCR', 'detectPatterns', 'analyzeVisuals', 'extractData', 'identifyAnomalies'
      ],
      'canvas_interaction': [
        'manipulateCanvas', 'createEntities', 'simulateInteractions', 'testElements', 'verifyChanges'
      ],
      'database_operations': [
        'queryDatabase', 'sendRequests', 'processResults', 'communicateWithAI', 'manageConnections'
      ],
      'machine_learning': [
        'learnPatterns', 'developStrategies', 'trackImprovements', 'optimizePerformance', 'adaptBehavior'
      ],
      'system_health': [
        'monitorHealth', 'trackPerformance', 'generateAlerts', 'analyzeTrends', 'reportStatus'
      ],
      'system_repair': [
        'repairComponents', 'executeFollowups', 'verifyRepairs', 'documentFixes', 'preventRegression'
      ],
      'strategic_planning': [
        'setGoals', 'developStrategies', 'planCompletion', 'adviseActions', 'evaluateProgress'
      ]
    };
    
    return capabilityMap[specialization] || [];
  }

  initializeAgentMethods(agent) {
    // Add common methods to all agents
    agent.processTask = (task) => this.processAgentTask(agent.id, task);
    agent.sendMessage = (targetId, message) => this.sendAgentMessage(agent.id, targetId, message);
    agent.requestHelp = (issue) => this.requestAgentHelp(agent.id, issue);
    agent.reportProgress = (progress) => this.reportAgentProgress(agent.id, progress);
    agent.learnFromExperience = (experience) => this.agentLearnFromExperience(agent.id, experience);
    
    // Add specialization-specific methods
    this.addSpecializationMethods(agent);
  }

  addSpecializationMethods(agent) {
    switch (agent.specialization) {
      case 'error_handling':
        agent.handleError = (error) => this.handleErrorWithAgent(agent.id, error);
        agent.generateSolution = (error) => this.generateErrorSolution(agent.id, error);
        break;
      case 'visual_analysis':
        agent.analyzeScreenshot = (screenshot) => this.analyzeScreenshotWithAgent(agent.id, screenshot);
        agent.processOCRResult = (ocrData) => this.processOCRWithAgent(agent.id, ocrData);
        break;
      case 'canvas_interaction':
        agent.controlCanvas = (canvasId, action) => this.controlCanvasWithAgent(agent.id, canvasId, action);
        agent.createTestEntity = (entityData) => this.createEntityWithAgent(agent.id, entityData);
        break;
      case 'database_operations':
        agent.queryAI = (query) => this.queryAIWithAgent(agent.id, query);
        agent.sendToCentralAI = (data) => this.sendToCentralAIWithAgent(agent.id, data);
        break;
      // Add more specialization methods as needed
    }
  }

  setupComponentAgents() {
    // Create agents for each major component
    const components = [
      'screenshot-service', 'canvas-interaction', 'error-management',
      'learning-system', 'task-manager', 'metrics-tracker',
      'conversation-history', 'system-builder'
    ];
    
    components.forEach(componentId => {
      this.createComponentAgent(componentId);
    });
  }

  createComponentAgent(componentId) {
    const componentAgent = {
      id: `${componentId}-agent`,
      componentId,
      name: `${componentId} Component Agent`,
      type: 'component',
      status: 'active',
      messages: [],
      repairs: [],
      settings: new Map(),
      pingResults: [],
      userInstructions: [],
      strategies: [],
      progress: {
        current: 'monitoring',
        completed: [],
        pending: [],
        goals: []
      },
      created: Date.now()
    };
    
    // Add component-specific methods
    componentAgent.receiveUserMessage = (message) => this.receiveComponentMessage(componentAgent.id, message);
    componentAgent.executeRepair = (repairData) => this.executeComponentRepair(componentAgent.id, repairData);
    componentAgent.ping = () => this.pingComponent(componentAgent.id);
    componentAgent.updateSettings = (settings) => this.updateComponentSettings(componentAgent.id, settings);
    componentAgent.reportProgress = (progressData) => this.reportComponentProgress(componentAgent.id, progressData);
    
    this.componentAgents.set(componentAgent.id, componentAgent);
    
    console.log(`🔧 Created component agent: ${componentAgent.name}`);
  }

  initializeTaskDistribution() {
    // Setup task routing based on agent specializations
    this.taskRoutes = new Map([
      ['error', ['error-handler', 'repair-specialist']],
      ['screenshot', ['screenshot-analyzer', 'visual_analysis']],
      ['canvas', ['canvas-controller', 'repair-specialist']],
      ['database', ['database-communicator']],
      ['learning', ['learning-coordinator', 'strategy-advisor']],
      ['monitoring', ['system-monitor']],
      ['repair', ['repair-specialist', 'error-handler']],
      ['strategy', ['strategy-advisor', 'learning-coordinator']]
    ]);
    
    // Start task processing
    this.startTaskProcessing();
  }

  startTaskProcessing() {
    // Process tasks for each agent every 2 seconds
    setInterval(() => {
      this.agents.forEach((agent, agentId) => {
        this.processAgentTasks(agentId);
      });
    }, 2000);
  }

  setupAgentCommunication() {
    // Setup inter-agent communication system
    this.communicationProtocol = {
      messageTypes: ['request', 'response', 'notification', 'alert', 'data'],
      priorities: ['urgent', 'high', 'medium', 'low'],
      channels: new Map()
    };
    
    // Create communication channels between agents
    this.agents.forEach((agent, agentId) => {
      this.communicationProtocol.channels.set(agentId, {
        incoming: [],
        outgoing: [],
        subscriptions: []
      });
    });
  }

  startAgentMonitoring() {
    // Monitor agent performance every 30 seconds
    setInterval(() => {
      this.monitorAgentPerformance();
    }, 30000);
    
    // Check agent health every 10 seconds
    setInterval(() => {
      this.checkAgentHealth();
    }, 10000);
  }

  // Task distribution methods
  distributeTask(taskType, taskData, priority = 'medium') {
    const suitableAgents = this.taskRoutes.get(taskType) || [];
    
    if (suitableAgents.length === 0) {
      console.warn(`No agents available for task type: ${taskType}`);
      return false;
    }
    
    // Select best agent based on availability and performance
    const selectedAgent = this.selectBestAgent(suitableAgents, taskType);
    
    if (!selectedAgent) {
      console.warn(`No suitable agent found for task: ${taskType}`);
      return false;
    }
    
    return this.assignTaskToAgent(selectedAgent, taskType, taskData, priority);
  }

  selectBestAgent(candidates, taskType) {
    let bestAgent = null;
    let bestScore = -1;
    
    candidates.forEach(agentId => {
      const agent = this.agents.get(agentId);
      if (!agent || agent.status !== 'active') return;
      
      // Calculate agent score based on multiple factors
      const score = this.calculateAgentScore(agent, taskType);
      
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agentId;
      }
    });
    
    return bestAgent;
  }

  calculateAgentScore(agent, taskType) {
    // Factors: availability, performance, specialization match, current load
    const availability = agent.currentTasks.length < 3 ? 1 : 0.5;
    const performance = agent.performance.efficiency / 100;
    const specialization = agent.responsibilities.includes(taskType.replace('-', '_')) ? 1 : 0.7;
    const load = Math.max(0, 1 - (agent.currentTasks.length / 5));
    
    return (availability * 0.3 + performance * 0.25 + specialization * 0.3 + load * 0.15);
  }

  assignTaskToAgent(agentId, taskType, taskData, priority) {
    const agent = this.agents.get(agentId);
    if (!agent) return false;
    
    const task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: taskType,
      data: taskData,
      priority,
      assignedTo: agentId,
      status: 'pending',
      created: Date.now(),
      started: null,
      completed: null,
      result: null
    };
    
    // Add to agent's task queue
    const taskQueue = this.taskQueues.get(agentId);
    taskQueue.push(task);
    
    // Sort by priority
    taskQueue.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    agent.currentTasks.push(task.id);
    agent.lastActive = Date.now();
    
    console.log(`📋 Assigned task ${task.id} (${taskType}) to agent ${agentId}`);
    return task.id;
  }

  processAgentTasks(agentId) {
    const agent = this.agents.get(agentId);
    const taskQueue = this.taskQueues.get(agentId);
    
    if (!agent || !taskQueue || taskQueue.length === 0) return;
    
    // Process up to 2 tasks at a time per agent
    const tasksToProcess = taskQueue.splice(0, 2);
    
    tasksToProcess.forEach(task => {
      this.executeTask(agent, task);
    });
  }

  executeTask(agent, task) {
    task.status = 'in_progress';
    task.started = Date.now();
    
    console.log(`▶️ Agent ${agent.id} starting task ${task.id} (${task.type})`);
    
    try {
      // Execute task based on type and agent capabilities
      const result = this.executeTaskByType(agent, task);
      
      task.status = 'completed';
      task.completed = Date.now();
      task.result = result;
      
      // Update agent performance
      this.updateAgentPerformance(agent, task);
      
      // Remove from current tasks
      const taskIndex = agent.currentTasks.indexOf(task.id);
      if (taskIndex > -1) {
        agent.currentTasks.splice(taskIndex, 1);
      }
      
      agent.completedTasks++;
      
      console.log(`✅ Agent ${agent.id} completed task ${task.id}`);
      
      // Send result to master controller
      this.masterController.receiveAgentResult(agent.id, task);
      
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      agent.errors.push({ task: task.id, error: error.message, timestamp: Date.now() });
      
      console.error(`❌ Agent ${agent.id} failed task ${task.id}:`, error);
    }
  }

  executeTaskByType(agent, task) {
    switch (task.type) {
      case 'error':
        return this.executeErrorTask(agent, task);
      case 'screenshot':
        return this.executeScreenshotTask(agent, task);
      case 'canvas':
        return this.executeCanvasTask(agent, task);
      case 'database':
        return this.executeDatabaseTask(agent, task);
      case 'learning':
        return this.executeLearningTask(agent, task);
      case 'monitoring':
        return this.executeMonitoringTask(agent, task);
      case 'repair':
        return this.executeRepairTask(agent, task);
      case 'strategy':
        return this.executeStrategyTask(agent, task);
      default:
        return { success: false, message: 'Unknown task type' };
    }
  }

  executeErrorTask(agent, task) {
    const errorData = task.data;
    
    // Analyze error
    const analysis = {
      type: errorData.type || 'unknown',
      severity: this.calculateErrorSeverity(errorData),
      pattern: this.identifyErrorPattern(errorData),
      solution: this.generateErrorSolution(errorData)
    };
    
    // Apply fix if agent has high autonomy
    if (agent.autonomy > 0.7 && analysis.solution) {
      const fixResult = this.applyErrorFix(analysis.solution);
      analysis.fixApplied = fixResult;
    }
    
    return analysis;
  }

  executeScreenshotTask(agent, task) {
    const screenshotData = task.data;
    
    const analysis = {
      ocrText: screenshotData.ocrText || '',
      patterns: this.detectVisualPatterns(screenshotData),
      anomalies: this.detectVisualAnomalies(screenshotData),
      negativeField: this.checkNegativeFieldInScreenshot(screenshotData)
    };
    
    return analysis;
  }

  executeCanvasTask(agent, task) {
    const canvasData = task.data;
    
    const result = {
      action: canvasData.action,
      canvasId: canvasData.canvasId,
      success: false,
      details: {}
    };
    
    // Use canvas interaction tools
    if (this.masterController.canvasTools) {
      try {
        const tools = this.masterController.canvasTools;
        
        switch (canvasData.action) {
          case 'create_entity':
            result.entityId = tools.createTestEntity(canvasData.entityType, canvasData);
            result.success = !!result.entityId;
            break;
          case 'interact':
            tools.simulateClick(canvasData.element, canvasData.x, canvasData.y);
            result.success = true;
            break;
          case 'analyze':
            result.analysis = tools.analyzeArea(canvasData.element, canvasData.x, canvasData.y, canvasData.width, canvasData.height);
            result.success = !!result.analysis;
            break;
        }
      } catch (error) {
        result.error = error.message;
      }
    }
    
    return result;
  }

  executeDatabaseTask(agent, task) {
    const dbData = task.data;
    
    // Simulate database operations
    const result = {
      query: dbData.query,
      type: dbData.type || 'search',
      success: false,
      data: null
    };
    
    // Here you would integrate with actual database
    // For now, simulate the operation
    result.data = { 
      message: `Database operation simulated: ${dbData.type}`,
      query: dbData.query,
      timestamp: Date.now()
    };
    result.success = true;
    
    return result;
  }

  // Component messaging methods
  receiveComponentMessage(componentAgentId, message) {
    const agent = this.componentAgents.get(componentAgentId);
    if (!agent) return false;
    
    const messageData = {
      id: `msg-${Date.now()}`,
      content: message.content,
      from: message.from || 'user',
      timestamp: Date.now(),
      type: message.type || 'instruction',
      processed: false
    };
    
    agent.messages.push(messageData);
    agent.userInstructions.push(messageData);
    
    // Process message immediately if it's urgent
    if (message.priority === 'urgent') {
      this.processComponentMessage(componentAgentId, messageData);
    }
    
    console.log(`💌 Component agent ${componentAgentId} received message: ${message.content}`);
    return messageData.id;
  }

  processComponentMessage(componentAgentId, messageData) {
    const agent = this.componentAgents.get(componentAgentId);
    if (!agent) return;
    
    // Parse message for actions
    const content = messageData.content.toLowerCase();
    
    if (content.includes('repair') || content.includes('fix')) {
      this.scheduleComponentRepair(componentAgentId, messageData);
    } else if (content.includes('strategy') || content.includes('complete')) {
      this.updateComponentStrategy(componentAgentId, messageData);
    } else if (content.includes('settings') || content.includes('config')) {
      this.processComponentSettings(componentAgentId, messageData);
    }
    
    messageData.processed = true;
    messageData.processedAt = Date.now();
  }

  scheduleComponentRepair(componentAgentId, messageData) {
    const repairTask = {
      id: `repair-${Date.now()}`,
      componentId: componentAgentId,
      instruction: messageData.content,
      priority: 'high',
      status: 'scheduled',
      created: Date.now()
    };
    
    // Distribute repair task to repair specialist
    this.distributeTask('repair', repairTask, 'high');
  }

  updateComponentStrategy(componentAgentId, messageData) {
    const agent = this.componentAgents.get(componentAgentId);
    if (!agent) return;
    
    // Extract strategy from message
    const strategy = {
      id: `strategy-${Date.now()}`,
      instruction: messageData.content,
      goal: this.extractGoalFromMessage(messageData.content),
      approach: this.extractApproachFromMessage(messageData.content),
      created: Date.now()
    };
    
    agent.strategies.push(strategy);
    
    // Update progress
    if (strategy.goal) {
      agent.progress.goals.push(strategy.goal);
    }
  }

  // Utility methods
  calculateErrorSeverity(errorData) {
    // Simple severity calculation
    if (errorData.message && errorData.message.includes('fatal')) return 'critical';
    if (errorData.type === 'TypeError' || errorData.type === 'ReferenceError') return 'high';
    if (errorData.type === 'warning') return 'low';
    return 'medium';
  }

  identifyErrorPattern(errorData) {
    // Simple pattern identification
    const message = errorData.message || '';
    if (message.includes('not a function')) return 'missing_method';
    if (message.includes('undefined')) return 'undefined_reference';
    if (message.includes('null')) return 'null_reference';
    return 'unknown';
  }

  generateErrorSolution(errorData) {
    const pattern = this.identifyErrorPattern(errorData);
    
    const solutions = {
      'missing_method': 'Add the missing method or check method name',
      'undefined_reference': 'Initialize variable before use',
      'null_reference': 'Add null checks before property access'
    };
    
    return solutions[pattern] || 'Manual investigation required';
  }

  extractGoalFromMessage(content) {
    // Simple goal extraction
    const goalKeywords = ['complete', 'finish', 'achieve', 'implement', 'fix'];
    const words = content.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      if (goalKeywords.includes(words[i].toLowerCase()) && words[i + 1]) {
        return words.slice(i, i + 3).join(' ');
      }
    }
    
    return content.substring(0, 50);
  }

  extractApproachFromMessage(content) {
    // Simple approach extraction
    if (content.includes('strategy')) return 'strategic';
    if (content.includes('quick') || content.includes('fast')) return 'rapid';
    if (content.includes('careful') || content.includes('thorough')) return 'methodical';
    return 'standard';
  }

  monitorAgentPerformance() {
    this.agents.forEach((agent, agentId) => {
      // Calculate performance metrics
      const timeSinceActive = Date.now() - agent.lastActive;
      const isActive = timeSinceActive < 120000; // Active if used within 2 minutes
      
      // Update performance tracking
      if (!this.performanceMetrics.has(agentId)) {
        this.performanceMetrics.set(agentId, {
          history: [],
          averages: {},
          trends: {}
        });
      }
      
      const metrics = this.performanceMetrics.get(agentId);
      metrics.history.push({
        timestamp: Date.now(),
        active: isActive,
        tasksCompleted: agent.completedTasks,
        currentLoad: agent.currentTasks.length,
        errorCount: agent.errors.length
      });
      
      // Keep only last 100 entries
      if (metrics.history.length > 100) {
        metrics.history.splice(0, 50);
      }
    });
  }

  checkAgentHealth() {
    this.agents.forEach((agent, agentId) => {
      const health = this.calculateAgentHealth(agent);
      
      if (health.status === 'degraded' || health.status === 'failed') {
        console.warn(`🚨 Agent ${agentId} health: ${health.status} - ${health.issues.join(', ')}`);
        this.masterController.handleAgentAlert(agentId, health);
      }
    });
  }

  calculateAgentHealth(agent) {
    const issues = [];
    let status = 'healthy';
    
    // Check if agent is responding
    const timeSinceActive = Date.now() - agent.lastActive;
    if (timeSinceActive > 300000) { // 5 minutes
      issues.push('inactive');
      status = 'degraded';
    }
    
    // Check error rate
    const recentErrors = agent.errors.filter(e => Date.now() - e.timestamp < 600000); // 10 minutes
    if (recentErrors.length > 5) {
      issues.push('high_error_rate');
      status = 'degraded';
    }
    
    // Check task queue backup
    const taskQueue = this.taskQueues.get(agent.id) || [];
    if (taskQueue.length > 10) {
      issues.push('task_backup');
      status = 'degraded';
    }
    
    // Check if completely failed
    if (issues.length > 2) {
      status = 'failed';
    }
    
    return { status, issues, lastCheck: Date.now() };
  }

  getAgentStatus(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return null;
    
    return {
      id: agentId,
      name: agent.name,
      status: agent.status,
      specialization: agent.specialization,
      currentTasks: agent.currentTasks.length,
      completedTasks: agent.completedTasks,
      performance: agent.performance,
      health: this.calculateAgentHealth(agent),
      lastActive: agent.lastActive
    };
  }

  getAllAgentStatuses() {
    const statuses = new Map();
    this.agents.forEach((agent, id) => {
      statuses.set(id, this.getAgentStatus(id));
    });
    return statuses;
  }

  getComponentAgentStatus(componentAgentId) {
    const agent = this.componentAgents.get(componentAgentId);
    if (!agent) return null;
    
    return {
      id: componentAgentId,
      componentId: agent.componentId,
      name: agent.name,
      status: agent.status,
      messages: agent.messages.length,
      repairs: agent.repairs.length,
      progress: agent.progress,
      lastPing: agent.pingResults.length > 0 ? agent.pingResults[agent.pingResults.length - 1] : null
    };
  }

  ping() {
    return {
      service: 'AgentManager',
      status: 'active',
      totalAgents: this.agents.size,
      activeAgents: Array.from(this.agents.values()).filter(a => a.status === 'active').length,
      componentAgents: this.componentAgents.size,
      totalTasks: Array.from(this.taskQueues.values()).reduce((total, queue) => total + queue.length, 0),
      health: 'healthy'
    };
  }
}

// Export for use by Master AI Controller
window.AgentManager = AgentManager;

console.log('✅ Agent Manager loaded');
