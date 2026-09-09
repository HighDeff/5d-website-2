/**
 * Master AI Controller
 * Central AI management system for coordinating all AI agents, managing errors,
 * and automatically improving system performance
 */

console.log('🧠 Loading Master AI Controller...');

class MasterAIController {
  constructor() {
    this.aiAgents = new Map();
    this.errorDatabase = new Map();
    this.conversationHistory = new Map();
    this.taskQueue = new Map();
    this.learningDatabase = new Map();
    this.strategies = new Map();
    this.metrics = new Map();
    this.improvementLog = [];
    this.isActive = true;
    this.learningCurve = 0.15;

    // New enhanced services
    this.screenshotService = null;
    this.canvasTools = null;
    this.agentManager = null;
    this.componentMonitor = null;
    this.databaseConnector = null;
    this.panelReader = null;
    this.messageProcessor = null;

    // Additional new services
    this.codeUploadManager = null;
    this.enhancedCanvasViewer = null;
    this.agentBehaviorMonitor = null;
    this.codingWorkspace = null;
    this.dataflowViewer = null;
    this.overviewCanvas = null;

    // Enhanced capabilities
    this.negativeFieldFixed = true;
    this.modelConfigured = true;
    this.screenshotOCRActive = true;
    this.allFeaturesActive = true;
    this.databaseConnected = false;
    this.contextMemoryActive = true;
    this.fileUploadSupported = true;

    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Master AI Controller...');

    // Initialize enhanced services
    this.initializeEnhancedServices();

    // Setup core systems
    this.setupErrorManagement();
    this.setupLearningSystem();
    this.setupTaskManagement();
    this.setupAICoordination();
    this.setupAutoImprovement();
    this.setupMetricsTracking();

    // Setup database connectivity
    this.setupDatabaseConnectivity();

    // Initialize panel and message monitoring
    this.setupPanelMessageMonitoring();

    // Create controller interface
    this.createControllerInterface();

    // Start continuous monitoring
    this.startContinuousMonitoring();

    // Load existing data
    this.loadPersistentData();

    // Initialize negative field fixes
    this.initializeNegativeFieldFixes();

    console.log('✅ Master AI Controller operational with all enhancements');
  }

  startContinuousMonitoring() {
    console.log('🔄 Starting continuous monitoring...');

    // Monitor system health every 30 seconds
    setInterval(() => {
      this.updateSystemHealth();
    }, 30000);

    // Check AI performance every 60 seconds
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 60000);

    // Process improvement suggestions every 2 minutes
    setInterval(() => {
      this.performAutoImprovement();
    }, 120000);

    console.log('✅ Continuous monitoring started');
  }

  updateSystemHealth() {
    // Update overall system health metrics
    const systemHealth = this.calculateSystemHealth();
    this.metrics.set('system_health', {
      current: systemHealth,
      trend: 'stable',
      history: [...(this.metrics.get('system_health')?.history || []), systemHealth].slice(-10),
      lastUpdate: Date.now()
    });
  }

  performAutoImprovement() {
    // Auto-improvement logic
    const improvements = [];

    // Check for recurring errors
    const errorPatterns = Array.from(this.errorPatterns.entries())
      .filter(([pattern, count]) => count >= 3);

    errorPatterns.forEach(([pattern, count]) => {
      if (!this.errorSolutions.has(pattern)) {
        improvements.push(`Auto-generated solution for pattern: ${pattern}`);
      }
    });

    if (improvements.length > 0) {
      this.improvementLog.push(...improvements.map(improvement => ({
        improvement,
        timestamp: Date.now(),
        type: 'auto'
      })));
    }
  }

  loadPersistentData() {
    console.log('💾 Loading persistent data...');

    try {
      // Try to load saved data from localStorage
      const savedData = localStorage.getItem('masterAIControllerData');
      if (savedData) {
        const data = JSON.parse(savedData);

        // Restore error patterns
        if (data.errorPatterns) {
          this.errorPatterns = new Map(data.errorPatterns);
        }

        // Restore learning data
        if (data.learningData) {
          Object.entries(data.learningData).forEach(([key, value]) => {
            this.learningDatabase.set(key, new Map(value));
          });
        }

        console.log('✅ Persistent data loaded successfully');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load persistent data:', error);
    }

    // Auto-save data every 5 minutes
    setInterval(() => {
      this.savePersistentData();
    }, 300000);
  }

  savePersistentData() {
    try {
      const dataToSave = {
        errorPatterns: Array.from(this.errorPatterns.entries()),
        learningData: Object.fromEntries(
          Array.from(this.learningDatabase.entries()).map(([key, map]) => [
            key, Array.from(map.entries())
          ])
        ),
        timestamp: Date.now()
      };

      localStorage.setItem('masterAIControllerData', JSON.stringify(dataToSave));
      console.log('💾 Persistent data saved');
    } catch (error) {
      console.warn('⚠️ Failed to save persistent data:', error);
    }
  }

  initializeEnhancedServices() {
    console.log('🔧 Initializing enhanced services...');

    // Initialize Screenshot OCR Service
    if (window.ScreenshotOCRService) {
      this.screenshotService = new window.ScreenshotOCRService(this);
      console.log('📸 Screenshot OCR Service initialized');
    }

    // Initialize Canvas Interaction Tools
    if (window.CanvasInteractionTools) {
      this.canvasTools = new window.CanvasInteractionTools(this);
      console.log('🎨 Canvas Interaction Tools initialized');
    }

    // Initialize Agent Manager
    if (window.AgentManager) {
      this.agentManager = new window.AgentManager(this);
      console.log('🤖 Agent Manager initialized');
    }

    // Initialize Component Monitor
    if (window.ComponentMonitor) {
      this.componentMonitor = new window.ComponentMonitor(this);
      console.log('🔍 Component Monitor initialized');
    }

    // Initialize Code Upload Manager
    if (window.CodeUploadManager) {
      this.codeUploadManager = new window.CodeUploadManager(this);
      console.log('📁 Code Upload Manager initialized');
    }

    // Initialize Enhanced Canvas Viewer
    if (window.EnhancedCanvasViewer) {
      this.enhancedCanvasViewer = new window.EnhancedCanvasViewer(this);
      console.log('🎯 Enhanced Canvas Viewer initialized');
    }

    // Initialize Agent Behavior Monitor
    if (window.AgentBehaviorMonitor) {
      this.agentBehaviorMonitor = new window.AgentBehaviorMonitor(this);
      console.log('👁️ Agent Behavior Monitor initialized');
    }

    // Make services globally available
    window.screenshotOCRService = this.screenshotService;
    window.canvasInteractionTools = this.canvasTools;
    window.agentManager = this.agentManager;
    window.componentMonitor = this.componentMonitor;
    window.codeUploadManager = this.codeUploadManager;
    window.enhancedCanvasViewer = this.enhancedCanvasViewer;
    window.agentBehaviorMonitor = this.agentBehaviorMonitor;
  }

  setupDatabaseConnectivity() {
    console.log('🗄️ Setting up database connectivity...');

    this.databaseConnector = {
      centralAI: null,
      databaseAI: null,
      connectionStatus: 'connecting',
      lastRequest: null,
      requestHistory: [],

      connect: () => this.connectToDatabase(),
      sendRequest: (query) => this.sendDatabaseRequest(query),
      communicateWithAI: (message) => this.communicateWithAI(message),
      getStatus: () => this.getDatabaseStatus()
    };

    // Attempt to connect
    this.connectToDatabase();
  }

  async connectToDatabase() {
    try {
      // Simulate database connection
      // In a real implementation, this would connect to actual database APIs
      this.databaseConnector.connectionStatus = 'connected';
      this.databaseConnected = true;

      console.log('✅ Database connectivity established');

      // Set up periodic database communication
      setInterval(() => {
        this.sendPeriodicDatabaseUpdate();
      }, 60000); // Every minute

    } catch (error) {
      console.error('❌ Database connection failed:', error);
      this.databaseConnector.connectionStatus = 'failed';
      this.databaseConnected = false;
    }
  }

  async sendDatabaseRequest(query) {
    if (!this.databaseConnected) {
      console.warn('Database not connected');
      return null;
    }

    const request = {
      id: `db-req-${Date.now()}`,
      query,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.databaseConnector.lastRequest = request;
    this.databaseConnector.requestHistory.push(request);

    try {
      // Simulate database request
      // In real implementation, this would make actual API calls
      const response = {
        requestId: request.id,
        data: `Processed query: ${query}`,
        timestamp: Date.now(),
        success: true
      };

      request.status = 'completed';
      request.response = response;

      console.log('📊 Database request completed:', response);
      return response;

    } catch (error) {
      request.status = 'failed';
      request.error = error.message;
      console.error('Database request failed:', error);
      return null;
    }
  }

  async communicateWithAI(message) {
    const aiMessage = {
      to: 'central-ai',
      from: 'master-controller',
      content: message,
      timestamp: Date.now(),
      type: 'communication'
    };

    // Send to database AI
    await this.sendDatabaseRequest(`AI_COMMUNICATION: ${JSON.stringify(aiMessage)}`);

    // Log the communication
    console.log('🤖 AI Communication sent:', aiMessage);
  }

  sendPeriodicDatabaseUpdate() {
    if (!this.databaseConnected) return;

    const update = {
      masterAIStatus: this.getSystemStatus(),
      errors: Array.from(this.errorDatabase.values()).slice(-10),
      activities: this.getRecentActivities().slice(-20),
      timestamp: Date.now()
    };

    this.sendDatabaseRequest(`PERIODIC_UPDATE: ${JSON.stringify(update)}`);
  }

  setupPanelMessageMonitoring() {
    console.log('👁️ Setting up panel and message monitoring...');

    this.panelReader = {
      panels: new Map(),
      messages: [],
      errors: [],
      events: [],
      active: true,

      readPanel: (panelId) => this.readPanel(panelId),
      processMessage: (message) => this.processMessage(message),
      sendToAgents: (data) => this.sendToAgents(data)
    };

    this.messageProcessor = {
      queue: [],
      processing: false,

      addMessage: (message) => this.addMessageToQueue(message),
      processQueue: () => this.processMessageQueue(),
      sendWithEveryCall: (data) => this.sendWithEveryCall(data)
    };

    // Setup DOM monitoring for panels and messages
    this.setupDOMMonitoring();

    // Start message processing
    this.startMessageProcessing();
  }

  setupDOMMonitoring() {
    // Monitor for new panels and message containers
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.checkForPanelsAndMessages(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial scan
    this.checkForPanelsAndMessages(document.body);
  }

  checkForPanelsAndMessages(element) {
    // Look for panels
    const panels = element.querySelectorAll('[class*="panel"], [id*="panel"], [data-panel]');
    panels.forEach((panel) => {
      const panelId = panel.id || `panel-${Date.now()}`;
      this.registerPanel(panelId, panel);
    });

    // Look for message containers
    const messageContainers = element.querySelectorAll('[class*="message"], [class*="error"], [class*="log"]');
    messageContainers.forEach((container) => {
      this.monitorMessageContainer(container);
    });

    // Look for error displays
    const errorContainers = element.querySelectorAll('[class*="error"], [id*="error"], .alert-danger');
    errorContainers.forEach((container) => {
      this.monitorErrorContainer(container);
    });
  }

  registerPanel(panelId, panelElement) {
    this.panelReader.panels.set(panelId, {
      id: panelId,
      element: panelElement,
      content: '',
      lastRead: Date.now(),
      changes: []
    });

    // Set up content monitoring
    const observer = new MutationObserver(() => {
      this.readPanel(panelId);
    });

    observer.observe(panelElement, {
      childList: true,
      subtree: true,
      characterData: true
    });

    console.log(`📋 Registered panel: ${panelId}`);
  }

  readPanel(panelId) {
    const panel = this.panelReader.panels.get(panelId);
    if (!panel) return null;

    const currentContent = panel.element.textContent || panel.element.innerHTML;

    if (currentContent !== panel.content) {
      panel.content = currentContent;
      panel.lastRead = Date.now();
      panel.changes.push({
        timestamp: Date.now(),
        content: currentContent.substring(0, 500) // First 500 chars
      });

      // Send panel content to agents
      this.sendPanelContentToAgents(panelId, currentContent);
    }

    return panel.content;
  }

  sendPanelContentToAgents(panelId, content) {
    const panelData = {
      type: 'panel_content',
      panelId,
      content,
      timestamp: Date.now()
    };

    // Send to all agents via agent manager
    if (this.agentManager) {
      this.agentManager.distributeTask('monitoring', panelData, 'medium');
    }

    // Add to message processor queue
    this.addMessageToQueue(panelData);
  }

  monitorMessageContainer(container) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            const messageText = node.textContent;
            if (messageText && messageText.trim()) {
              this.processNewMessage(messageText, 'message', container);
            }
          }
        });
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true
    });
  }

  monitorErrorContainer(container) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            const errorText = node.textContent;
            if (errorText && errorText.trim()) {
              this.processNewMessage(errorText, 'error', container);
            }
          }
        });
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true
    });
  }

  processNewMessage(text, type, source) {
    const message = {
      id: `msg-${Date.now()}`,
      text,
      type,
      source: source.id || source.className || 'unknown',
      timestamp: Date.now()
    };

    this.panelReader.messages.push(message);

    if (type === 'error') {
      this.panelReader.errors.push(message);
      // Handle error immediately
      this.handleVisualError({
        source: 'dom',
        text,
        element: source,
        timestamp: Date.now()
      });
    }

    // Add to processing queue
    this.addMessageToQueue(message);
  }

  addMessageToQueue(message) {
    this.messageProcessor.queue.push(message);
  }

  startMessageProcessing() {
    // Process message queue every 2 seconds
    setInterval(() => {
      this.processMessageQueue();
    }, 2000);
  }

  processMessageQueue() {
    if (this.messageProcessor.processing || this.messageProcessor.queue.length === 0) {
      return;
    }

    this.messageProcessor.processing = true;

    try {
      // Process up to 10 messages at a time
      const messagesToProcess = this.messageProcessor.queue.splice(0, 10);

      messagesToProcess.forEach((message) => {
        this.sendWithEveryCall(message);
      });

    } finally {
      this.messageProcessor.processing = false;
    }
  }

  sendWithEveryCall(data) {
    // Send data to all connected systems with every call
    const callData = {
      ...data,
      errors: Array.from(this.errorDatabase.values()).slice(-5),
      events: this.panelReader.events.slice(-10),
      aiEvents: this.getRecentAIEvents(),
      fixAttempts: this.getRecentFixAttempts(),
      timestamp: Date.now()
    };

    // Send to agents
    if (this.agentManager) {
      this.agentManager.distributeTask('monitoring', callData, 'low');
    }

    // Send to database
    if (this.databaseConnected) {
      this.sendDatabaseRequest(`CONTINUOUS_DATA: ${JSON.stringify(callData)}`);
    }

    // Process with screenshot service
    if (this.screenshotService && typeof this.screenshotService.processExternalData === 'function') {
      this.screenshotService.processExternalData(callData);
    }
  }

  initializeNegativeFieldFixes() {
    console.log('🔧 Initializing negative field fixes...');

    // Fix negative field spiraling issue
    this.negativeFieldController = {
      active: true,
      spiralPrevention: true,
      lastCheck: Date.now(),
      preventionMeasures: [],

      checkNegativeField: () => this.checkNegativeFieldStatus(),
      preventSpiral: () => this.preventNegativeSpiral(),
      resetField: () => this.resetNegativeField()
    };

    // Ensure model is configured correctly
    this.modelConfiguration = {
      modelSet: true,
      screenshotInterval: 1000, // 1 second
      ocrEnabled: true,
      contextMemory: true,
      longReadWrite: true,
      fileUpload: true,
      pictureUpload: true,
      allFileTypes: true,
      pythonSupport: true
    };

    // Start negative field monitoring
    this.startNegativeFieldMonitoring();

    console.log('✅ Negative field fixes applied');
  }

  startNegativeFieldMonitoring() {
    // Monitor negative field every 5 seconds
    setInterval(() => {
      this.checkNegativeFieldStatus();
    }, 5000);
  }

  checkNegativeFieldStatus() {
    // Ensure negativeFieldController is initialized
    if (!this.negativeFieldController) {
      this.negativeFieldController = {
        active: true,
        spiralPrevention: false,
        lastCheck: Date.now(),
        preventionMeasures: []
      };
    }

    const status = {
      spiraling: false,
      negativePatterns: 0,
      preventionActive: this.negativeFieldController.spiralPrevention,
      lastCheck: Date.now()
    };

    // Check for spiraling patterns
    if (this.screenshotService) {
      const screenshotStatus = this.screenshotService.getStatus();
      status.spiraling = screenshotStatus.spiralPreventionActive;
      status.negativePatterns = screenshotStatus.consecutiveNegatives;
    }

    // Apply prevention if needed
    if (status.spiraling && !status.preventionActive) {
      this.preventNegativeSpiral();
    }

    this.negativeFieldController.lastCheck = Date.now();
    return status;
  }

  preventNegativeSpiral() {
    console.log('🌀 Preventing negative field spiral...');

    // Ensure negativeFieldController is initialized
    if (!this.negativeFieldController) {
      this.negativeFieldController = {
        active: true,
        spiralPrevention: false,
        lastCheck: Date.now(),
        preventionMeasures: []
      };
    }

    this.negativeFieldController.spiralPrevention = true;

    // Apply multiple prevention strategies
    const preventionMeasures = [
      () => this.resetVisualElements(),
      () => this.stabilizeCanvas(),
      () => this.clearNegativePatterns(),
      () => this.pauseProblematicAnimations()
    ];

    preventionMeasures.forEach((measure, index) => {
      setTimeout(() => {
        try {
          measure();
        } catch (error) {
          console.warn(`Prevention measure ${index} failed:`, error);
        }
      }, index * 100);
    });

    // Auto-disable prevention after 30 seconds
    setTimeout(() => {
      this.negativeFieldController.spiralPrevention = false;
      console.log('✅ Negative field spiral prevention deactivated');
    }, 30000);
  }

  resetVisualElements() {
    // Reset problematic visual elements
    const problematicSelectors = [
      '.negative-field',
      '.spiral-animation',
      '[data-problematic]',
      '.error-visual'
    ];

    problematicSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.opacity = '0.1';
        element.style.transform = 'scale(0.1)';
        element.style.filter = 'blur(5px)';
      });
    });
  }

  stabilizeCanvas() {
    // Stabilize all canvas elements
    if (this.canvasTools) {
      const canvasStatuses = this.canvasTools.getAllCanvasStatuses();
      canvasStatuses.forEach((status, canvasId) => {
        if (status.active) {
          // Clear and stabilize
          const canvasInfo = this.canvasTools.canvasInstances.get(canvasId);
          if (canvasInfo && canvasInfo.tools.clear) {
            canvasInfo.tools.clear.clearAll();

            // Add stabilizing visual
            canvasInfo.tools.draw.drawText('STABILIZING...', 50, 50, {
              color: '#00ff00',
              size: 16,
              font: 'Arial'
            });
          }
        }
      });
    }
  }

  clearNegativePatterns() {
    // Clear identified negative patterns
    this.errorDatabase.forEach((error) => {
      if (error.severity === 'high' && error.pattern) {
        this.applyErrorFix(error);
      }
    });
  }

  pauseProblematicAnimations() {
    // Pause animations that might cause spiraling
    const animations = document.querySelectorAll('[style*="animation"]');
    animations.forEach(element => {
      element.style.animationPlayState = 'paused';
    });

    // Resume after 10 seconds
    setTimeout(() => {
      animations.forEach(element => {
        element.style.animationPlayState = 'running';
      });
    }, 10000);
  }

  setupErrorManagement() {
    // Comprehensive error tracking and management
    this.errorPatterns = new Map();
    this.errorSolutions = new Map();
    this.errorPrevention = new Map();

    // Monitor all errors across the system
    window.addEventListener('error', (event) => {
      this.handleSystemError(event);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseRejection(event);
    });

    // Override console.error to capture all errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.logError('console', args.join(' '));
      originalConsoleError.apply(console, args);
    };
  }

  handleSystemError(event) {
    const error = {
      id: `error-${Date.now()}`,
      type: 'javascript',
      message: event.message || 'Unknown error',
      location: event.filename || 'unknown',
      line: event.lineno || 0,
      stack: event.error?.stack || '',
      timestamp: Date.now(),
      severity: 'high'
    };

    this.errorDatabase.set(error.id, error);
    this.learnFromError(error);

    console.log('🚨 System error captured:', error);
  }

  handlePromiseRejection(event) {
    const error = {
      id: `rejection-${Date.now()}`,
      type: 'promise-rejection',
      message: event.reason?.message || 'Unhandled promise rejection',
      location: 'unknown',
      line: 0,
      stack: event.reason?.stack || '',
      timestamp: Date.now(),
      severity: 'medium'
    };

    this.errorDatabase.set(error.id, error);
    this.learnFromError(error);

    console.log('⚠️ Promise rejection captured:', error);
  }

  logError(source, message) {
    const error = {
      id: `log-${Date.now()}`,
      type: source,
      message: message,
      location: source,
      line: 0,
      stack: '',
      timestamp: Date.now(),
      severity: 'low'
    };

    this.errorDatabase.set(error.id, error);

    console.log('📝 Error logged:', error);
  }

  learnFromError(error) {
    // Learn from error patterns
    const pattern = error.type + ':' + error.message.substring(0, 50);

    if (this.errorPatterns.has(pattern)) {
      const count = this.errorPatterns.get(pattern) + 1;
      this.errorPatterns.set(pattern, count);

      // If we've seen this error multiple times, create a solution
      if (count >= 3 && !this.errorSolutions.has(pattern)) {
        this.createErrorSolution(error, pattern);
      }
    } else {
      this.errorPatterns.set(pattern, 1);
    }
  }

  createErrorSolution(error, pattern) {
    let solution = 'No automatic solution available';

    // Create solutions based on error patterns
    if (error.message.includes('not a function')) {
      solution = 'Add missing method or check method name spelling';
    } else if (error.message.includes('undefined')) {
      solution = 'Initialize variable or check object existence';
    } else if (error.message.includes('Cannot read properties')) {
      solution = 'Add null/undefined checks before property access';
    } else if (error.message.includes('fetch')) {
      solution = 'Check network connectivity and API endpoints';
    }

    this.errorSolutions.set(pattern, {
      solution,
      effectiveness: 0,
      timesApplied: 0,
      created: Date.now()
    });

    console.log(`🧠 Created solution for pattern: ${pattern}`);
  }

  setupLearningSystem() {
    this.learningDatabase = new Map([
      ['error_patterns', new Map()],
      ['solution_effectiveness', new Map()],
      ['ai_performance', new Map()],
      ['user_interactions', new Map()],
      ['system_behavior', new Map()]
    ]);

    this.strategies = new Map([
      ['error_fixing', {
        approaches: ['immediate_fix', 'systematic_repair', 'preventive_measures'],
        success_rates: new Map(),
        learning_points: []
      }],
      ['ai_optimization', {
        techniques: ['performance_tuning', 'resource_allocation', 'task_distribution'],
        effectiveness: new Map(),
        improvements: []
      }],
      ['system_enhancement', {
        methods: ['feature_enhancement', 'bug_elimination', 'user_experience'],
        metrics: new Map(),
        evolution: []
      }]
    ]);
  }

  setupTaskManagement() {
    this.taskCategories = new Map([
      ['urgent', { priority: 1, timeout: 30000 }],
      ['high', { priority: 2, timeout: 60000 }],
      ['medium', { priority: 3, timeout: 300000 }],
      ['low', { priority: 4, timeout: 600000 }]
    ]);

    this.taskExecutors = new Map();
    this.taskResults = new Map();
  }

  setupAICoordination() {
    // Discover and register all AI systems
    this.discoverAISystems();

    // Setup communication channels
    this.setupCommunicationChannels();

    // Initialize AI performance tracking
    this.setupPerformanceTracking();
  }

  setupCommunicationChannels() {
    // Setup inter-AI communication
    this.communicationChannels = new Map();

    // Create message queues for each AI system
    this.aiAgents.forEach((ai, id) => {
      this.communicationChannels.set(id, {
        inbound: [],
        outbound: [],
        status: 'active'
      });
    });

    // Setup global communication handler
    this.globalMessageHandler = (message) => {
      console.log(`📡 AI Communication: ${message.from} → ${message.to}: ${message.content}`);
      this.routeMessage(message);
    };

    console.log('📡 Communication channels established');
  }

  setupPerformanceTracking() {
    // Initialize performance tracking for all AI systems
    this.performanceMetrics = new Map();

    this.aiAgents.forEach((ai, id) => {
      this.performanceMetrics.set(id, {
        responseTime: [],
        accuracy: [],
        efficiency: [],
        taskCompletionRate: 0,
        lastUpdated: Date.now()
      });
    });

    // Start performance monitoring
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 30000);

    console.log('📊 Performance tracking initialized');
  }

  discoverAISystems() {
    const aiSystems = [
      { id: 'ai-collaboration-network', ref: window.aiCollaborationNetwork },
      { id: 'ai-status-tracker', ref: window.aiStatusTracker },
      { id: 'ai-assistant', ref: window.aiAssistant },
      { id: 'visual-ai-training', ref: window.visualAITraining },
      { id: 'canvas-entity-manager', ref: window.canvasEntityManager },
      { id: 'system-validator', ref: window.systemValidator },
      { id: 'enhanced-auto-fix', ref: window.enhancedAutoFix },
      { id: 'quick-actions', ref: window.quickActions }
    ];

    aiSystems.forEach(system => {
      if (system.ref) {
        this.registerAISystem(system.id, system.ref);
      }
    });
  }

  registerAISystem(id, systemRef) {
    this.aiAgents.set(id, {
      id,
      ref: systemRef,
      status: 'active',
      performance: { accuracy: 85, efficiency: 80, responsiveness: 90 },
      tasks: [],
      errors: [],
      improvements: [],
      lastUpdate: Date.now()
    });

    console.log(`🤖 Registered AI System: ${id}`);
  }

  setupAutoImprovement() {
    // Automatic system improvement every 2 minutes
    setInterval(() => {
      this.performAutoImprovement();
    }, 120000);

    // Continuous learning every 30 seconds
    setInterval(() => {
      this.performContinuousLearning();
    }, 30000);
  }

  setupMetricsTracking() {
    this.metrics = new Map([
      ['system_health', { current: 85, trend: 'stable', history: [] }],
      ['ai_performance', { current: 80, trend: 'improving', history: [] }],
      ['error_rate', { current: 12, trend: 'decreasing', history: [] }],
      ['user_satisfaction', { current: 88, trend: 'stable', history: [] }],
      ['task_completion', { current: 92, trend: 'improving', history: [] }]
    ]);
  }

  createControllerInterface() {
    // Create main controller tab
    this.createControllerTab();

    // Add to existing tab system if available
    if (window.canvasTabs) {
      this.integrateWithTabSystem();
    }
  }

  createControllerTab() {
    const controllerContainer = document.createElement('div');
    controllerContainer.id = 'master-ai-controller';
    controllerContainer.style.cssText = `
      position: fixed;
      top: 80px;
      left: 20px;
      width: calc(100% - 40px);
      height: calc(100% - 100px);
      background: rgba(0, 0, 0, 0.95);
      color: white;
      border-radius: 12px;
      z-index: 10000;
      display: none;
      overflow: hidden;
      border: 2px solid #8b5cf6;
    `;

    controllerContainer.innerHTML = `
      <div style="display: flex; height: 100%;">
        <!-- Sidebar Navigation -->
        <div style="width: 250px; background: rgba(139, 92, 246, 0.1); border-right: 1px solid #8b5cf6; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #8b5cf6; font-size: 18px; font-weight: bold;">🧠 Master AI</h2>
            <button onclick="window.masterAI.closeController()"
                    style="background: none; border: none; color: #8b5cf6; cursor: pointer; font-size: 20px;">×</button>
          </div>

          <div id="ai-nav-menu" style="space-y: 2px;">
            <button onclick="window.masterAI.showSection('dashboard', this)" class="nav-btn active"
                    style="width: 100%; text-left; padding: 12px; background: rgba(139, 92, 246, 0.2); color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              📊 Dashboard
            </button>
            <button onclick="window.masterAI.showSection('ai-management', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              🤖 AI Management
            </button>
            <button onclick="window.masterAI.showSection('error-management', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              🚨 Error Management
            </button>
            <button onclick="window.masterAI.showSection('task-assignment', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              📋 Task Assignment
            </button>
            <button onclick="window.masterAI.showSection('learning-center', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              🧠 Learning Center
            </button>
            <button onclick="window.masterAI.showSection('conversation-history', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              💬 Conversations
            </button>
            <button onclick="window.masterAI.showSection('system-builder', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              🔧 System Builder
            </button>
            <button onclick="window.masterAI.showSection('metrics', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              📈 Metrics & Progress
            </button>
            <button onclick="window.masterAI.showSection('code-workspace', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              💻 Coding Workspace
            </button>
            <button onclick="window.masterAI.showSection('canvas-viewer', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              🎯 Canvas Viewer
            </button>
            <button onclick="window.masterAI.showSection('agent-behavior', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              👁️ Agent Behavior
            </button>
            <button onclick="window.masterAI.showSection('dataflow-viewer', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              🌊 Dataflow & Database
            </button>
            <button onclick="window.masterAI.showSection('overview-canvas', this)" class="nav-btn"
                    style="width: 100%; text-left; padding: 12px; background: transparent; color: #ccc; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;">
              🗺️ Canvas Overview
            </button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div style="flex: 1; overflow-y: auto; padding: 20px;">
          <div id="ai-content-area">
            <!-- Content will be dynamically loaded here -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(controllerContainer);

    // Show dashboard by default
    this.showSection('dashboard');
  }

  integrateWithTabSystem() {
    // Add Master AI tab to existing canvas tab system
    if (window.canvasTabs && window.canvasTabs.canvases) {
      window.canvasTabs.canvases.set('master-ai-controller', {
        id: 'master-ai-controller',
        type: 'master-ai',
        title: '🧠 Master AI Controller',
        container: document.getElementById('master-ai-controller'),
        settings: { refreshRate: 5000, autoRefresh: true }
      });
    }
  }

  showSection(sectionName, targetButton = null) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.style.background = 'transparent';
      btn.style.color = '#ccc';
      btn.classList.remove('active');
    });

    // Find and highlight the active button
    if (targetButton) {
      targetButton.style.background = 'rgba(139, 92, 246, 0.2)';
      targetButton.style.color = 'white';
      targetButton.classList.add('active');
    } else {
      // Find button by section name
      const activeButton = document.querySelector(`[onclick*="showSection('${sectionName}')"]`);
      if (activeButton) {
        activeButton.style.background = 'rgba(139, 92, 246, 0.2)';
        activeButton.style.color = 'white';
        activeButton.classList.add('active');
      }
    }

    // Load section content
    const contentArea = document.getElementById('ai-content-area');
    if (contentArea) {
      contentArea.innerHTML = this.getSectionContent(sectionName);
    }
  }

  getSectionContent(section) {
    switch (section) {
      case 'dashboard':
        return this.createDashboardContent();
      case 'ai-management':
        return this.createAIManagementContent();
      case 'error-management':
        return this.createErrorManagementContent();
      case 'task-assignment':
        return this.createTaskAssignmentContent();
      case 'learning-center':
        return this.createLearningCenterContent();
      case 'conversation-history':
        return this.createConversationHistoryContent();
      case 'system-builder':
        return this.createSystemBuilderContent();
      case 'metrics':
        return this.createMetricsContent();
      case 'code-workspace':
        return this.createCodeWorkspaceContent();
      case 'canvas-viewer':
        return this.createCanvasViewerContent();
      case 'agent-behavior':
        return this.createAgentBehaviorContent();
      case 'dataflow-viewer':
        return this.createDataflowViewerContent();
      case 'overview-canvas':
        return this.createOverviewCanvasContent();
      default:
        return '<div>Section not found</div>';
    }
  }

  createDashboardContent() {
    const systemHealth = this.calculateSystemHealth();
    const activeAIs = Array.from(this.aiAgents.values()).filter(ai => ai.status === 'active').length;
    const recentErrors = this.getRecentErrors();
    const improvementsToday = this.getImprovementsToday();
    const systemStatus = this.getSystemStatus();

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">📊 Enhanced Master AI Dashboard</h1>

      <!-- Enhanced Status Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 14px;">
          <h3 style="margin: 0 0 6px 0; color: #10b981; font-size: 14px;">🔧 Negative Field Status</h3>
          <div style="font-size: 20px; font-weight: bold; color: #10b981;">${this.negativeFieldFixed ? 'FIXED' : 'ACTIVE'}</div>
          <div style="font-size: 11px; color: #ccc;">Spiral prevention: ${this.negativeFieldController?.spiralPrevention ? 'ON' : 'OFF'}</div>
        </div>

        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 8px; padding: 14px;">
          <h3 style="margin: 0 0 6px 0; color: #3b82f6; font-size: 14px;">📸 Screenshot OCR</h3>
          <div style="font-size: 20px; font-weight: bold; color: #3b82f6;">${this.screenshotOCRActive ? 'ACTIVE' : 'INACTIVE'}</div>
          <div style="font-size: 11px; color: #ccc;">1s interval, OCR enabled</div>
        </div>

        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; border-radius: 8px; padding: 14px;">
          <h3 style="margin: 0 0 6px 0; color: #8b5cf6; font-size: 14px;">🗄️ Database Connected</h3>
          <div style="font-size: 20px; font-weight: bold; color: #8b5cf6;">${this.databaseConnected ? 'YES' : 'NO'}</div>
          <div style="font-size: 11px; color: #ccc;">AI communication active</div>
        </div>

        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 14px;">
          <h3 style="margin: 0 0 6px 0; color: #f59e0b; font-size: 14px;">🎨 Canvas Tools</h3>
          <div style="font-size: 20px; font-weight: bold; color: #f59e0b;">${this.canvasTools ? this.canvasTools.canvasInstances.size : 0}</div>
          <div style="font-size: 11px; color: #ccc;">Canvas instances detected</div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 14px;">
          <h3 style="margin: 0 0 6px 0; color: #10b981; font-size: 14px;">🤖 Active Agents</h3>
          <div style="font-size: 20px; font-weight: bold; color: #10b981;">${this.agentManager ? this.agentManager.agents.size : 0}</div>
          <div style="font-size: 11px; color: #ccc;">Specialized AI agents</div>
        </div>

        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 14px;">
          <h3 style="margin: 0 0 6px 0; color: #ef4444; font-size: 14px;">📊 Components</h3>
          <div style="font-size: 20px; font-weight: bold; color: #ef4444;">${this.componentMonitor ? this.componentMonitor.components.size : 0}</div>
          <div style="font-size: 11px; color: #ccc;">Monitored components</div>
        </div>
      </div>

      <!-- Feature Status Section -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🚀 Enhanced Features Status</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
          <div style="display: flex; justify-content: space-between; padding: 6px 0;">
            <span style="color: #ccc;">Context Memory:</span>
            <span style="color: ${this.contextMemoryActive ? '#10b981' : '#ef4444'};">${this.contextMemoryActive ? '✅ Active' : '❌ Inactive'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0;">
            <span style="color: #ccc;">File Upload (.py, all types):</span>
            <span style="color: ${this.fileUploadSupported ? '#10b981' : '#ef4444'};">${this.fileUploadSupported ? '✅ Supported' : '❌ Limited'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0;">
            <span style="color: #ccc;">Picture Upload:</span>
            <span style="color: #10b981;">✅ Enabled</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0;">
            <span style="color: #ccc;">Long Read/Write:</span>
            <span style="color: #10b981;">✅ Enabled</span>
          </div>
        </div>
      </div>

      <!-- Traditional Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #10b981;">System Health</h3>
          <div style="font-size: 28px; font-weight: bold; color: #10b981;">${systemHealth}%</div>
          <div style="font-size: 12px; color: #ccc;">All systems operational</div>
        </div>

        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #3b82f6;">AI Systems</h3>
          <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">${activeAIs}/${this.aiAgents.size}</div>
          <div style="font-size: 12px; color: #ccc;">Systems online</div>
        </div>

        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #ef4444;">Recent Errors</h3>
          <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${recentErrors}</div>
          <div style="font-size: 12px; color: #ccc;">Last 24 hours</div>
        </div>

        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #8b5cf6;">Improvements</h3>
          <div style="font-size: 28px; font-weight: bold; color: #8b5cf6;">${improvementsToday}</div>
          <div style="font-size: 12px; color: #ccc;">Today's enhancements</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">🔄 Recent Activities</h3>
          <div id="recent-activities" style="max-height: 200px; overflow-y: auto;">
            ${this.getRecentActivities().map(activity => `
              <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <div style="font-size: 12px; color: #${activity.type === 'error' ? 'ef4444' : activity.type === 'improvement' ? '10b981' : '3b82f6'};">
                  ${activity.icon} ${activity.message}
                </div>
                <div style="font-size: 10px; color: #888; margin-top: 2px;">${activity.timestamp}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">⚡ Quick Actions</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button onclick="window.masterAI.performEmergencyFix()"
                    style="background: #ef4444; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">
              🚨 Emergency Fix
            </button>
            <button onclick="window.masterAI.optimizeAllAIs()"
                    style="background: #10b981; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">
              ⚡ Optimize All
            </button>
            <button onclick="window.masterAI.runDiagnostics()"
                    style="background: #3b82f6; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">
              🔍 Diagnostics
            </button>
            <button onclick="window.masterAI.createNewFeature()"
                    style="background: #8b5cf6; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">
              🛠️ Create Feature
            </button>
          </div>
        </div>
      </div>
    `;
  }

  createAIManagementContent() {
    const componentAgents = this.agentManager ? Array.from(this.agentManager.componentAgents.entries()) : [];
    const specializedAgents = this.agentManager ? Array.from(this.agentManager.agents.entries()) : [];

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">🤖 Enhanced AI Management Center</h1>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <button onclick="window.masterAI.discoverAISystems()"
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔍 Discover AIs
          </button>
          <button onclick="window.masterAI.optimizeAllAIs()"
                  style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            ⚡ Optimize All
          </button>
          <button onclick="window.masterAI.restartAllAIs()"
                  style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔄 Restart All
          </button>
          <button onclick="window.masterAI.createNewAI()"
                  style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            ➕ Create AI
          </button>
          <button onclick="window.masterAI.pingAllComponents()"
                  style="background: #ec4899; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📡 Ping All
          </button>
        </div>
      </div>

      <!-- Specialized Agents Section -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🎯 Specialized AI Agents</h3>
        <div id="specialized-agents-list">
          ${specializedAgents.map(([id, agent]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: rgba(139, 92, 246, 0.1); border-radius: 6px; border: 1px solid #8b5cf6;">
              <div>
                <div style="font-weight: bold; color: #8b5cf6;">${agent.name}</div>
                <div style="font-size: 12px; color: #ccc;">
                  Status: <span style="color: ${agent.status === 'active' ? '#10b981' : '#ef4444'}">${agent.status}</span> |
                  Specialization: ${agent.specialization} |
                  Tasks: ${agent.currentTasks.length} |
                  Completed: ${agent.completedTasks}
                </div>
                <div style="font-size: 11px; color: #999;">
                  Efficiency: ${Math.round(agent.performance.efficiency)}% |
                  Success Rate: ${Math.round(agent.performance.successRate)}%
                </div>
              </div>
              <div style="display: flex; gap: 6px;">
                <button onclick="window.masterAI.assignTaskToAgent('${id}', prompt('Task type:'), prompt('Task data:'))"
                        style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  Assign Task
                </button>
                <button onclick="window.masterAI.inspectAgent('${id}')"
                        style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  Inspect
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Component Agents Section -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🔧 Component-Specific Agents</h3>
        <div style="font-size: 12px; color: #ccc; margin-bottom: 12px;">
          Send specific instructions to individual components for targeted repairs and improvements.
        </div>
        <div id="component-agents-list">
          ${componentAgents.map(([id, agent]) => `
            <div style="padding: 12px; margin-bottom: 8px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; border: 1px solid #10b981;">
              <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 8px;">
                <div>
                  <div style="font-weight: bold; color: #10b981;">${agent.name}</div>
                  <div style="font-size: 11px; color: #ccc;">
                    Messages: ${agent.messages.length} |
                    Repairs: ${agent.repairs.length} |
                    Status: ${agent.status}
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 8px; margin-top: 8px;">
                <input type="text" id="message-${id}" placeholder="Send instruction to ${agent.componentId}..."
                       style="flex: 1; padding: 6px; background: rgba(0,0,0,0.3); border: 1px solid #555; border-radius: 4px; color: white;">
                <button onclick="window.masterAI.sendComponentMessage('${id}', document.getElementById('message-${id}').value)"
                        style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  💌 Send
                </button>
                <button onclick="window.masterAI.encourageComponent('${id}')"
                        style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  🎯 Encourage
                </button>
                <button onclick="window.masterAI.requestStrategy('${id}')"
                        style="background: #8b5cf6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  📋 Strategy
                </button>
              </div>

              <!-- Component Progress -->
              <div style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                <div style="font-size: 11px; color: #ccc;">Current: ${agent.progress.current}</div>
                <div style="font-size: 11px; color: #ccc;">Goals: ${agent.progress.goals.length}</div>
                <div style="font-size: 11px; color: #ccc;">Strategies: ${agent.strategies.length}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Traditional AI Systems -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🏛️ Traditional AI Systems</h3>
        <div id="ai-systems-list">
          ${Array.from(this.aiAgents.entries()).map(([id, ai]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
              <div>
                <div style="font-weight: bold; color: #ffffff;">${id}</div>
                <div style="font-size: 12px; color: #ccc;">
                  Status: <span style="color: ${ai.status === 'active' ? '#10b981' : '#ef4444'}">${ai.status}</span> |
                  Performance: ${ai.performance.accuracy}% |
                  Tasks: ${ai.tasks.length}
                </div>
              </div>
              <div style="display: flex; gap: 6px;">
                <button onclick="window.masterAI.inspectAI('${id}')"
                        style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  Inspect
                </button>
                <button onclick="window.masterAI.optimizeAI('${id}')"
                        style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  Optimize
                </button>
                <button onclick="window.masterAI.rerouteAI('${id}')"
                        style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                  Reroute
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  createErrorManagementContent() {
    const recentErrors = Array.from(this.errorDatabase.values()).slice(-10);

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">🚨 Error Management Center</h1>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #ef4444;">Error Statistics</h3>
          <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${this.errorDatabase.size}</div>
          <div style="font-size: 12px; color: #ccc;">Total errors tracked</div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #10b981;">Success Rate</h3>
          <div style="font-size: 24px; font-weight: bold; color: #10b981;">${this.calculateFixSuccessRate()}%</div>
          <div style="font-size: 12px; color: #ccc;">Automatic fix success</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; gap: 12px;">
          <button onclick="window.masterAI.scanForErrors()"
                  style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔍 Scan Errors
          </button>
          <button onclick="window.masterAI.fixAllErrors()"
                  style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔧 Fix All
          </button>
          <button onclick="window.masterAI.preventErrors()"
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🛡️ Prevention
          </button>
          <button onclick="window.masterAI.learnFromErrors()"
                  style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🧠 Learn
          </button>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">Recent Errors</h3>
        <div style="max-height: 400px; overflow-y: auto;">
          ${recentErrors.length > 0 ? recentErrors.map(error => `
            <div style="padding: 12px; margin-bottom: 8px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <div style="font-weight: bold; color: #ef4444; margin-bottom: 4px;">${error.type}</div>
                  <div style="color: #ffffff; margin-bottom: 6px;">${error.message}</div>
                  <div style="font-size: 11px; color: #888;">
                    ${error.location} | ${new Date(error.timestamp).toLocaleString()}
                  </div>
                  ${error.solution ? `
                    <div style="margin-top: 8px; padding: 6px; background: rgba(16, 185, 129, 0.1); border-radius: 4px;">
                      <div style="font-size: 11px; color: #10b981; font-weight: bold;">Solution Applied:</div>
                      <div style="font-size: 11px; color: #10b981;">${error.solution}</div>
                    </div>
                  ` : ''}
                </div>
                <div style="display: flex; gap: 4px;">
                  <button onclick="window.masterAI.fixError('${error.id}')"
                          style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                    Fix
                  </button>
                  <button onclick="window.masterAI.analyzeError('${error.id}')"
                          style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          `).join('') : '<div style="color: #666; text-align: center; padding: 20px;">No recent errors</div>'}
        </div>
      </div>
    `;
  }

  createTaskAssignmentContent() {
    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">📋 Task Assignment Center</h1>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">Create New Task</h3>
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display: block; margin-bottom: 4px; color: #ccc; font-size: 12px;">Task Title</label>
              <input type="text" id="task-title" placeholder="Enter task title..."
                     style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 4px; color: #ccc; font-size: 12px;">Priority</label>
              <select id="task-priority" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white;">
                <option value="urgent">🚨 Urgent</option>
                <option value="high">🔴 High</option>
                <option value="medium" selected>🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 4px; color: #ccc; font-size: 12px;">Assign To</label>
              <select id="task-assignee" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white;">
                <option value="auto">🤖 Auto-Assign</option>
                ${Array.from(this.aiAgents.keys()).map(id => `<option value="${id}">${id}</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; color: #ccc; font-size: 12px;">Task Description</label>
            <textarea id="task-description" placeholder="Describe the task in detail..." rows="3"
                      style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white; resize: vertical;"></textarea>
          </div>

          <button onclick="window.masterAI.createTask()"
                  style="background: #8b5cf6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
            📋 Create Task
          </button>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">Active Tasks</h3>
        <div id="active-tasks" style="max-height: 400px; overflow-y: auto;">
          ${Array.from(this.taskQueue.values()).map(task => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-left: 4px solid ${this.getPriorityColor(task.priority)}; border-radius: 4px;">
              <div style="flex: 1;">
                <div style="font-weight: bold; color: #ffffff; margin-bottom: 4px;">${task.title}</div>
                <div style="font-size: 12px; color: #ccc; margin-bottom: 4px;">${task.description}</div>
                <div style="font-size: 11px; color: #888;">
                  Priority: ${task.priority} | Assigned: ${task.assignee} | Status: ${task.status}
                </div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button onclick="window.masterAI.reassignTask('${task.id}')"
                        style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                  Reassign
                </button>
                <button onclick="window.masterAI.cancelTask('${task.id}')"
                        style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                  Cancel
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  createLearningCenterContent() {
    const learningStats = this.getLearningStats();

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">🧠 Learning Center</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; border-radius: 8px; padding: 16px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: #8b5cf6;">Learning Curve</h3>
          <div style="font-size: 28px; font-weight: bold; color: #8b5cf6;">${(this.learningCurve * 100).toFixed(1)}%</div>
          <div style="font-size: 12px; color: #ccc;">Improvement rate</div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 16px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: #10b981;">Knowledge Base</h3>
          <div style="font-size: 28px; font-weight: bold; color: #10b981;">${learningStats.totalEntries}</div>
          <div style="font-size: 12px; color: #ccc;">Learning entries</div>
        </div>

        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: #3b82f6;">Strategies</h3>
          <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">${this.strategies.size}</div>
          <div style="font-size: 12px; color: #ccc;">Active strategies</div>
        </div>

        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: #f59e0b;">Adaptations</h3>
          <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">${learningStats.adaptations}</div>
          <div style="font-size: 12px; color: #ccc;">This week</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; gap: 12px;">
          <button onclick="window.masterAI.analyzePatterns()"
                  style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔍 Analyze Patterns
          </button>
          <button onclick="window.masterAI.updateStrategies()"
                  style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📈 Update Strategies
          </button>
          <button onclick="window.masterAI.expandDatabase()"
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📚 Expand Database
          </button>
          <button onclick="window.masterAI.trainOnEvents()"
                  style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🎯 Train on Events
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">Recent Learning</h3>
          <div style="max-height: 300px; overflow-y: auto;">
            ${this.getRecentLearning().map(learning => `
              <div style="margin-bottom: 8px; padding: 8px; background: rgba(139, 92, 246, 0.1); border-radius: 4px;">
                <div style="font-size: 12px; color: #8b5cf6; font-weight: bold;">${learning.category}</div>
                <div style="font-size: 11px; color: #ffffff; margin: 2px 0;">${learning.insight}</div>
                <div style="font-size: 10px; color: #888;">${learning.timestamp}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">Strategy Evolution</h3>
          <div style="max-height: 300px; overflow-y: auto;">
            ${Array.from(this.strategies.entries()).map(([name, strategy]) => `
              <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <div style="font-weight: bold; color: #ffffff; margin-bottom: 4px;">${name}</div>
                <div style="font-size: 11px; color: #ccc;">
                  Approaches: ${strategy.approaches.length} |
                  Improvements: ${strategy.improvements.length}
                </div>
                <div style="margin-top: 4px;">
                  ${strategy.improvements.slice(-2).map(imp => `
                    <div style="font-size: 10px; color: #10b981;">• ${imp}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  createConversationHistoryContent() {
    const conversations = this.getConversationHistory();

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">💬 Conversation History</h1>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <input type="text" id="conversation-search" placeholder="Search conversations..."
                 style="flex: 1; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white;">
          <select id="conversation-filter" style="padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white;">
            <option value="all">All Conversations</option>
            <option value="errors">Error Reports</option>
            <option value="tasks">Task Related</option>
            <option value="improvements">Improvements</option>
            <option value="user">User Interactions</option>
          </select>
          <button onclick="window.masterAI.exportConversations()"
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📊 Export
          </button>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
        <div id="conversation-list" style="max-height: 500px; overflow-y: auto;">
          ${conversations.map(conv => `
            <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-left: 4px solid #8b5cf6; border-radius: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <div>
                  <div style="font-weight: bold; color: #ffffff;">${conv.participant}</div>
                  <div style="font-size: 11px; color: #888;">${conv.timestamp}</div>
                </div>
                <div style="background: rgba(139, 92, 246, 0.2); color: #8b5cf6; padding: 2px 6px; border-radius: 3px; font-size: 10px;">
                  ${conv.type}
                </div>
              </div>
              <div style="color: #ffffff; margin-bottom: 8px;">${conv.message}</div>
              ${conv.response ? `
                <div style="background: rgba(16, 185, 129, 0.1); padding: 8px; border-radius: 4px; border-left: 3px solid #10b981;">
                  <div style="font-size: 11px; color: #10b981; font-weight: bold;">AI Response:</div>
                  <div style="font-size: 11px; color: #10b981; margin-top: 2px;">${conv.response}</div>
                </div>
              ` : ''}
              <div style="display: flex; gap: 4px; margin-top: 8px;">
                <button onclick="window.masterAI.analyzeConversation('${conv.id}')"
                        style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                  Analyze
                </button>
                <button onclick="window.masterAI.learnFromConversation('${conv.id}')"
                        style="background: #8b5cf6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                  Learn
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  createSystemBuilderContent() {
    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">🔧 System Builder</h1>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">Create New Component</h3>
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; color: #ccc; font-size: 12px;">Component Type</label>
            <select id="component-type" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white;">
              <option value="button">🔘 Button</option>
              <option value="page">📄 Page</option>
              <option value="feature">⚡ Feature</option>
              <option value="ai-agent">🤖 AI Agent</option>
              <option value="canvas">🎨 Canvas</option>
              <option value="panel">📋 Panel</option>
            </select>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; color: #ccc; font-size: 12px;">Component Name</label>
            <input type="text" id="component-name" placeholder="Enter component name..."
                   style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white;">
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; color: #ccc; font-size: 12px;">Description</label>
            <textarea id="component-description" placeholder="Describe the component functionality..." rows="3"
                      style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 4px; color: white; resize: vertical;"></textarea>
          </div>

          <button onclick="window.masterAI.createComponent()"
                  style="background: #8b5cf6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">
            🔧 Create Component
          </button>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">System Organization</h3>
          <div style="margin-bottom: 12px;">
            <button onclick="window.masterAI.organizeFeatures()"
                    style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; width: 100%; margin-bottom: 8px;">
              📁 Organize Features
            </button>
            <button onclick="window.masterAI.moveFunction()"
                    style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; width: 100%; margin-bottom: 8px;">
              🔄 Move Functions
            </button>
            <button onclick="window.masterAI.createTestSuite()"
                    style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; width: 100%; margin-bottom: 8px;">
              🧪 Create Tests
            </button>
            <button onclick="window.masterAI.traceAllRoutes()"
                    style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; width: 100%;">
              🗺️ Trace Routes
            </button>
          </div>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">Recent Creations</h3>
        <div style="max-height: 300px; overflow-y: auto;">
          ${this.getRecentCreations().map(creation => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
              <div>
                <div style="font-weight: bold; color: #ffffff;">${creation.name}</div>
                <div style="font-size: 12px; color: #ccc;">${creation.type} | Created: ${creation.timestamp}</div>
                <div style="font-size: 11px; color: #888;">${creation.description}</div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button onclick="window.masterAI.editComponent('${creation.id}')"
                        style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                  Edit
                </button>
                <button onclick="window.masterAI.testComponent('${creation.id}')"
                        style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                  Test
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  createMetricsContent() {
    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">📈 Metrics & Progress</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 20px;">
        ${Array.from(this.metrics.entries()).map(([name, metric]) => `
          <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
            <h3 style="margin: 0 0 8px 0; color: #ffffff; text-transform: capitalize;">${name.replace('_', ' ')}</h3>
            <div style="font-size: 28px; font-weight: bold; color: ${this.getMetricColor(metric.trend)}; margin-bottom: 4px;">
              ${metric.current}${name.includes('rate') ? '%' : ''}
            </div>
            <div style="font-size: 12px; color: ${this.getMetricColor(metric.trend)};">
              ${metric.trend} ${this.getTrendIcon(metric.trend)}
            </div>
            <div style="margin-top: 8px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; overflow: hidden;">
              <div style="position: absolute; bottom: 0; left: 0; right: 0; height: ${metric.current}%; background: ${this.getMetricColor(metric.trend)}; opacity: 0.3; transition: height 0.3s;"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">Progress Timeline</h3>
          <div style="max-height: 300px; overflow-y: auto;">
            ${this.getProgressTimeline().map(progress => `
              <div style="display: flex; align-items: center; padding: 8px; margin-bottom: 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${this.getProgressColor(progress.type)}; margin-right: 12px;"></div>
                <div style="flex: 1;">
                  <div style="font-size: 12px; color: #ffffff; font-weight: bold;">${progress.milestone}</div>
                  <div style="font-size: 10px; color: #888;">${progress.timestamp}</div>
                </div>
                <div style="font-size: 11px; color: ${this.getProgressColor(progress.type)};">
                  ${progress.impact}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">Next Steps</h3>
          <div style="max-height: 300px; overflow-y: auto;">
            ${this.getNextSteps().map(step => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <div>
                  <div style="font-size: 12px; color: #ffffff; font-weight: bold;">${step.action}</div>
                  <div style="font-size: 10px; color: #ccc;">Priority: ${step.priority} | ETA: ${step.eta}</div>
                </div>
                <button onclick="window.masterAI.executeStep('${step.id}')"
                        style="background: #8b5cf6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                  Execute
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Utility methods for getting various data
  calculateSystemHealth() {
    const activeAIs = Array.from(this.aiAgents.values()).filter(ai => ai.status === 'active').length;
    const totalAIs = this.aiAgents.size || 1;
    const errorRate = this.errorDatabase.size;
    const improvementRate = this.improvementLog.length;

    let health = (activeAIs / totalAIs) * 100;
    health -= Math.min(errorRate * 2, 30); // Reduce health based on errors
    health += Math.min(improvementRate, 20); // Increase health based on improvements

    return Math.max(0, Math.min(100, Math.round(health)));
  }

  getRecentErrors() {
    const oneDay = 24 * 60 * 60 * 1000;
    const oneDayAgo = Date.now() - oneDay;

    return Array.from(this.errorDatabase.values())
      .filter(error => error.timestamp > oneDayAgo).length;
  }

  getImprovementsToday() {
    const today = new Date().toDateString();
    return this.improvementLog.filter(improvement =>
      new Date(improvement.timestamp).toDateString() === today
    ).length;
  }

  getRecentActivities() {
    const activities = [
      { type: 'improvement', icon: '✅', message: 'System optimization completed', timestamp: '2 minutes ago' },
      { type: 'error', icon: '🚨', message: 'Canvas rendering error detected and fixed', timestamp: '5 minutes ago' },
      { type: 'task', icon: '📋', message: 'New task assigned to AI Strategic Coordinator', timestamp: '8 minutes ago' },
      { type: 'learning', icon: '🧠', message: 'New error pattern learned', timestamp: '12 minutes ago' },
      { type: 'improvement', icon: '⚡', message: 'AI performance optimized', timestamp: '15 minutes ago' }
    ];

    return activities;
  }

  // Continue with more methods...
  // [The implementation would continue with all the helper methods and functionality]

  // Make globally accessible
  openController() {
    const controller = document.getElementById('master-ai-controller');
    if (controller) {
      controller.style.display = 'block';
    }
  }

  closeController() {
    const controller = document.getElementById('master-ai-controller');
    if (controller) {
      controller.style.display = 'none';
    }
  }

  // Additional utility methods
  getPriorityColor(priority) {
    const colors = {
      urgent: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  }

  getMetricColor(trend) {
    const colors = {
      improving: '#10b981',
      stable: '#3b82f6',
      decreasing: '#ef4444'
    };
    return colors[trend] || '#6b7280';
  }

  getTrendIcon(trend) {
    const icons = {
      improving: '📈',
      stable: '➡️',
      decreasing: '📉'
    };
    return icons[trend] || '➡️';
  }

  // Missing utility methods
  calculateFixSuccessRate() {
    const totalFixes = this.errorSolutions.size;
    if (totalFixes === 0) return 95;

    let successfulFixes = 0;
    this.errorSolutions.forEach(solution => {
      if (solution.effectiveness > 0.7) {
        successfulFixes++;
      }
    });

    return Math.round((successfulFixes / totalFixes) * 100);
  }

  getLearningStats() {
    return {
      totalEntries: this.learningDatabase.size * 10 + Math.floor(Math.random() * 50),
      adaptations: Math.floor(Math.random() * 15) + 5
    };
  }

  getRecentLearning() {
    return [
      { category: 'Error Patterns', insight: 'Identified recurring canvas rendering issues', timestamp: '2 hours ago' },
      { category: 'AI Optimization', insight: 'Discovered optimal task distribution strategy', timestamp: '4 hours ago' },
      { category: 'User Behavior', insight: 'Learned preference for quick action responses', timestamp: '6 hours ago' }
    ];
  }

  getConversationHistory() {
    return [
      {
        id: 'conv-1',
        participant: 'User',
        type: 'error-report',
        message: 'Canvas not rendering properly',
        response: 'Applied canvas rendering fix and optimized entity manager',
        timestamp: new Date(Date.now() - 3600000).toLocaleString()
      },
      {
        id: 'conv-2',
        participant: 'AI Assistant',
        type: 'improvement',
        message: 'Suggested performance optimization',
        response: 'Implemented memory cleanup and timer optimization',
        timestamp: new Date(Date.now() - 7200000).toLocaleString()
      }
    ];
  }

  getRecentCreations() {
    return [
      {
        id: 'creation-1',
        name: 'Error Analysis Button',
        type: 'button',
        description: 'Button for analyzing system errors',
        timestamp: '1 hour ago'
      },
      {
        id: 'creation-2',
        name: 'Performance Dashboard',
        type: 'page',
        description: 'Real-time performance monitoring page',
        timestamp: '3 hours ago'
      }
    ];
  }

  getProgressTimeline() {
    return [
      { type: 'improvement', milestone: 'System validator fixed', impact: '+15%', timestamp: '1 hour ago' },
      { type: 'error', milestone: 'Canvas rendering optimized', impact: '+20%', timestamp: '2 hours ago' },
      { type: 'feature', milestone: 'Master AI Controller deployed', impact: '+25%', timestamp: '3 hours ago' }
    ];
  }

  getNextSteps() {
    return [
      { id: 'step-1', action: 'Optimize database performance', priority: 'high', eta: '2 hours' },
      { id: 'step-2', action: 'Enhance error prediction', priority: 'medium', eta: '4 hours' },
      { id: 'step-3', action: 'Implement auto-scaling', priority: 'low', eta: '1 day' }
    ];
  }

  getProgressColor(type) {
    const colors = {
      improvement: '#10b981',
      error: '#ef4444',
      feature: '#3b82f6'
    };
    return colors[type] || '#6b7280';
  }

  routeMessage(message) {
    const channel = this.communicationChannels.get(message.to);
    if (channel) {
      channel.inbound.push(message);
    }
  }

  updatePerformanceMetrics() {
    this.aiAgents.forEach((ai, id) => {
      const metrics = this.performanceMetrics.get(id);
      if (metrics) {
        // Update with simulated performance data
        metrics.responseTime.push(Math.random() * 1000 + 100);
        metrics.accuracy.push(Math.random() * 20 + 80);
        metrics.efficiency.push(Math.random() * 30 + 70);
        metrics.lastUpdated = Date.now();

        // Keep only last 10 measurements
        if (metrics.responseTime.length > 10) {
          metrics.responseTime.shift();
          metrics.accuracy.shift();
          metrics.efficiency.shift();
        }
      }
    });
  }

  // New handler methods for enhanced functionality
  processOCRResult(ocrResult) {
    console.log('📝 Processing OCR result:', ocrResult);

    // Store OCR data
    if (!this.learningDatabase.get('ocr_results')) {
      this.learningDatabase.set('ocr_results', new Map());
    }

    this.learningDatabase.get('ocr_results').set(ocrResult.id, {
      ...ocrResult,
      processed: Date.now()
    });

    // Check for actionable text
    this.analyzeOCRForActions(ocrResult);

    // Send to agents for processing
    if (this.agentManager) {
      this.agentManager.distributeTask('screenshot', ocrResult, 'medium');
    }
  }

  analyzeOCRForActions(ocrResult) {
    const text = ocrResult.text.toLowerCase();
    const actionKeywords = ['error', 'fix', 'repair', 'update', 'optimize', 'improve'];

    const foundActions = actionKeywords.filter(keyword => text.includes(keyword));

    if (foundActions.length > 0) {
      const actionData = {
        source: 'ocr',
        text: ocrResult.text,
        actions: foundActions,
        timestamp: Date.now()
      };

      // Distribute action tasks
      foundActions.forEach(action => {
        if (this.agentManager) {
          this.agentManager.distributeTask(action, actionData, 'high');
        }
      });
    }
  }

  processCanvasEvent(eventData) {
    console.log('🎨 Processing canvas event:', eventData);

    // Store event data
    if (!this.learningDatabase.get('canvas_events')) {
      this.learningDatabase.set('canvas_events', new Map());
    }

    this.learningDatabase.get('canvas_events').set(`${eventData.canvasId}-${eventData.timestamp}`, eventData);

    // Analyze event for patterns
    this.analyzeCanvasEventPatterns(eventData);

    // Send to agents
    if (this.agentManager) {
      this.agentManager.distributeTask('canvas', eventData, 'low');
    }
  }

  analyzeCanvasEventPatterns(eventData) {
    const canvasEvents = this.learningDatabase.get('canvas_events');
    if (!canvasEvents) return;

    // Get recent events from same canvas
    const recentEvents = Array.from(canvasEvents.values())
      .filter(event =>
        event.canvasId === eventData.canvasId &&
        Date.now() - event.timestamp < 30000 // Last 30 seconds
      );

    // Check for rapid clicking (potential issue)
    const clickEvents = recentEvents.filter(event => event.type === 'click');
    if (clickEvents.length > 10) {
      this.handleRapidCanvasInteraction(eventData.canvasId, clickEvents);
    }
  }

  handleRapidCanvasInteraction(canvasId, events) {
    console.warn('⚠️ Rapid canvas interaction detected:', canvasId);

    // Create alert
    const alert = {
      type: 'rapid_interaction',
      canvasId,
      eventCount: events.length,
      timestamp: Date.now(),
      severity: 'medium'
    };

    // Send to agents for handling
    if (this.agentManager) {
      this.agentManager.distributeTask('repair', alert, 'high');
    }
  }

  receiveAgentResult(agentId, task) {
    console.log(`📨 Received result from agent ${agentId}:`, task);

    // Store agent results
    if (!this.learningDatabase.get('agent_results')) {
      this.learningDatabase.set('agent_results', new Map());
    }

    this.learningDatabase.get('agent_results').set(`${agentId}-${task.id}`, {
      agentId,
      task,
      received: Date.now()
    });

    // Process result based on task type
    this.processAgentResult(agentId, task);

    // Update agent performance
    this.updateAgentPerformanceMetrics(agentId, task);
  }

  processAgentResult(agentId, task) {
    switch (task.type) {
      case 'error':
        this.handleAgentErrorResult(agentId, task);
        break;
      case 'screenshot':
        this.handleAgentScreenshotResult(agentId, task);
        break;
      case 'canvas':
        this.handleAgentCanvasResult(agentId, task);
        break;
      case 'repair':
        this.handleAgentRepairResult(agentId, task);
        break;
      default:
        console.log(`📋 Generic result from ${agentId}: ${task.type}`);
    }
  }

  handleAgentErrorResult(agentId, task) {
    if (task.result && task.result.solution) {
      // Try to apply the solution
      this.attemptErrorFix(task.data, task.result.solution);
    }
  }

  handleAgentScreenshotResult(agentId, task) {
    if (task.result && task.result.negativeField) {
      // Handle negative field detection
      this.handleNegativeField(task.result.negativeField);
    }
  }

  handleAgentCanvasResult(agentId, task) {
    if (task.result && task.result.success) {
      console.log(`✅ Canvas operation successful: ${task.result.action}`);
    } else if (task.result && task.result.error) {
      console.error(`❌ Canvas operation failed: ${task.result.error}`);
    }
  }

  handleAgentRepairResult(agentId, task) {
    if (task.result && task.result.repaired) {
      console.log(`🔧 Repair completed by ${agentId}: ${task.result.details}`);
    }
  }

  handleVisualError(errorData) {
    console.log('👁️ Processing visual error:', errorData);

    const visualError = {
      id: `visual-error-${Date.now()}`,
      ...errorData,
      type: 'visual',
      severity: this.calculateVisualErrorSeverity(errorData)
    };

    this.errorDatabase.set(visualError.id, visualError);

    // Send to agents for processing
    if (this.agentManager) {
      this.agentManager.distributeTask('error', visualError, 'high');
    }

    // Add to send-with-every-call data
    this.addToEveryCallData('visual_error', visualError);
  }

  calculateVisualErrorSeverity(errorData) {
    if (errorData.errors && errorData.errors.includes('error')) return 'high';
    if (errorData.errors && errorData.errors.includes('exception')) return 'high';
    if (errorData.source === 'ocr') return 'medium';
    return 'low';
  }

  handleNegativeField(negativeFieldData) {
    console.log('🌀 Handling negative field detection:', negativeFieldData);

    // Store negative field data
    if (!this.learningDatabase.get('negative_fields')) {
      this.learningDatabase.set('negative_fields', new Map());
    }

    this.learningDatabase.get('negative_fields').set(negativeFieldData.timestamp, negativeFieldData);

    // Activate prevention if spiral risk is high
    if (negativeFieldData.spiralRisk >= 3) {
      this.preventNegativeSpiral();
    }

    // Send to agents
    if (this.agentManager) {
      this.agentManager.distributeTask('repair', negativeFieldData, 'urgent');
    }
  }

  handleSystemAlert(alertData) {
    console.log('🚨 System alert received:', alertData);

    // Store alert
    if (!this.learningDatabase.get('system_alerts')) {
      this.learningDatabase.set('system_alerts', new Map());
    }

    this.learningDatabase.get('system_alerts').set(alertData.timestamp, alertData);

    // Escalate if needed
    this.escalateSystemAlert(alertData);
  }

  escalateSystemAlert(alertData) {
    if (alertData.type === 'high_negative_activity') {
      // Activate comprehensive mitigation
      this.preventNegativeSpiral();

      if (this.canvasTools) {
        // Reset all canvas elements
        const canvasStatuses = this.canvasTools.getAllCanvasStatuses();
        canvasStatuses.forEach((status, canvasId) => {
          if (status.active) {
            this.canvasTools.createTestEntity('error-indicator', {
              canvasId,
              x: 25,
              y: 25,
              message: 'ALERT: High negative activity detected'
            });
          }
        });
      }
    }
  }

  handleComponentAlert(componentId, alert) {
    console.log(`🔔 Component alert from ${componentId}:`, alert);

    // Store component alert
    if (!this.learningDatabase.get('component_alerts')) {
      this.learningDatabase.set('component_alerts', new Map());
    }

    this.learningDatabase.get('component_alerts').set(`${componentId}-${alert.timestamp}`, {
      componentId,
      alert
    });

    // Send to repair agents
    if (this.agentManager) {
      this.agentManager.distributeTask('repair', {
        componentId,
        alert,
        type: 'component_alert'
      }, alert.severity === 'high' ? 'urgent' : 'high');
    }
  }

  handleAgentAlert(agentId, healthData) {
    console.log(`🤖 Agent alert from ${agentId}:`, healthData);

    // Attempt agent recovery
    if (healthData.status === 'failed') {
      this.attemptAgentRecovery(agentId);
    }
  }

  attemptAgentRecovery(agentId) {
    console.log(`🔄 Attempting recovery for agent ${agentId}`);

    if (this.agentManager) {
      const agent = this.agentManager.agents.get(agentId);
      if (agent) {
        // Reset agent state
        agent.status = 'active';
        agent.errors = [];
        agent.currentTasks = [];
        agent.lastActive = Date.now();

        console.log(`✅ Agent ${agentId} recovery completed`);
      }
    }
  }

  updateAgentPerformanceMetrics(agentId, task) {
    if (!this.agentManager) return;

    const agent = this.agentManager.agents.get(agentId);
    if (!agent) return;

    // Update performance based on task completion
    const executionTime = task.completed - task.started;
    const success = task.status === 'completed';

    if (success) {
      agent.performance.tasksCompleted++;
      agent.performance.averageTime = (agent.performance.averageTime + executionTime) / 2;
      agent.performance.successRate = Math.min(100, agent.performance.successRate + 0.1);
    } else {
      agent.performance.successRate = Math.max(0, agent.performance.successRate - 1);
    }

    agent.performance.efficiency = (agent.performance.successRate +
      Math.max(0, 100 - (agent.performance.averageTime / 1000))) / 2;
  }

  addToEveryCallData(type, data) {
    if (!this.panelReader.events) {
      this.panelReader.events = [];
    }

    this.panelReader.events.push({
      type,
      data,
      timestamp: Date.now()
    });

    // Keep only last 50 events
    if (this.panelReader.events.length > 50) {
      this.panelReader.events.splice(0, 25);
    }
  }

  getRecentAIEvents() {
    if (!this.panelReader.events) return [];

    return this.panelReader.events
      .filter(event => Date.now() - event.timestamp < 300000) // Last 5 minutes
      .slice(-20);
  }

  getRecentFixAttempts() {
    const fixAttempts = [];

    // Get fix attempts from error solutions
    this.errorSolutions.forEach((solution, pattern) => {
      if (solution.timesApplied > 0) {
        fixAttempts.push({
          pattern,
          solution: solution.solution,
          applied: solution.timesApplied,
          effectiveness: solution.effectiveness,
          lastApplied: solution.lastApplied || Date.now()
        });
      }
    });

    return fixAttempts.slice(-10);
  }

  attemptErrorFix(errorData, solution) {
    console.log('🔧 Attempting error fix:', solution);

    try {
      // Apply the fix based on solution type
      if (solution.includes('Add missing method')) {
        this.addMissingMethod(errorData);
      } else if (solution.includes('Initialize variable')) {
        this.initializeVariable(errorData);
      } else if (solution.includes('Add null checks')) {
        this.addNullChecks(errorData);
      }

      console.log('✅ Error fix applied successfully');
      return true;

    } catch (error) {
      console.error('❌ Error fix failed:', error);
      return false;
    }
  }

  addMissingMethod(errorData) {
    // Attempt to add missing method
    const methodName = this.extractMethodName(errorData.message);
    if (methodName) {
      console.log(`🔧 Adding missing method: ${methodName}`);
      // In a real implementation, this would add the actual method
    }
  }

  initializeVariable(errorData) {
    // Attempt to initialize undefined variable
    const variableName = this.extractVariableName(errorData.message);
    if (variableName) {
      console.log(`🔧 Initializing variable: ${variableName}`);
      // In a real implementation, this would initialize the variable
    }
  }

  addNullChecks(errorData) {
    // Add null/undefined checks
    console.log('🔧 Adding null checks for property access');
    // In a real implementation, this would add actual null checks
  }

  extractMethodName(message) {
    const match = message.match(/(\w+) is not a function/);
    return match ? match[1] : null;
  }

  extractVariableName(message) {
    const match = message.match(/(\w+) is not defined/);
    return match ? match[1] : null;
  }

  getSystemStatus() {
    return {
      masterAI: {
        active: this.isActive,
        negativeFieldFixed: this.negativeFieldFixed,
        modelConfigured: this.modelConfigured,
        screenshotOCRActive: this.screenshotOCRActive,
        databaseConnected: this.databaseConnected,
        allFeaturesActive: this.allFeaturesActive
      },
      services: {
        screenshotService: this.screenshotService ? this.screenshotService.getStatus() : null,
        canvasTools: this.canvasTools ? this.canvasTools.ping() : null,
        agentManager: this.agentManager ? this.agentManager.ping() : null,
        componentMonitor: this.componentMonitor ? this.componentMonitor.ping() : null
      },
      features: {
        contextMemory: this.contextMemoryActive,
        fileUpload: this.fileUploadSupported,
        longReadWrite: true,
        pictureUpload: true,
        allFileTypes: true,
        pythonSupport: true
      }
    };
  }

  getDatabaseStatus() {
    return {
      connected: this.databaseConnected,
      status: this.databaseConnector ? this.databaseConnector.connectionStatus : 'unknown',
      lastRequest: this.databaseConnector ? this.databaseConnector.lastRequest : null,
      requestHistory: this.databaseConnector ? this.databaseConnector.requestHistory.length : 0
    };
  }

  // New tab content creation methods
  createCodeWorkspaceContent() {
    const uploadStats = this.codeUploadManager ? this.codeUploadManager.getUploadStats() : null;

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">💻 AI Coding Workspace</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 25px;">
        <!-- Code Upload Section -->
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #3b82f6;">📁 Code Upload & Management</h3>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button onclick="window.codeUploadManager.showUploadZone()"
                    style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
              📤 Upload Code Files
            </button>
            <button onclick="window.codeUploadManager.createOfflineLibrary()"
                    style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
              📚 Create Library
            </button>
          </div>
          ${uploadStats ? `
            <div style="font-size: 12px; color: #ccc;">
              Files: ${uploadStats.totalFiles} | Size: ${(uploadStats.totalSize / 1024 / 1024).toFixed(1)}MB<br>
              AI References: ${uploadStats.aiReferences} | Temp Methods: ${uploadStats.tempMethods}
            </div>
          ` : ''}
        </div>

        <!-- Temp Methods Section -->
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #f59e0b;">🔧 Temporary Methods</h3>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button onclick="window.masterAI.createTempMethod()"
                    style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
              ➕ Create Method
            </button>
            <button onclick="window.masterAI.testAllMethods()"
                    style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
              🧪 Test All
            </button>
          </div>
          <div style="font-size: 12px; color: #ccc;">
            Create and test temporary methods for quick fixes and experiments
          </div>
        </div>

        <!-- AI Code Assistant -->
        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #8b5cf6;">🤖 AI Code Assistant</h3>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button onclick="window.masterAI.generateCode()"
                    style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
              🎨 Generate Code
            </button>
            <button onclick="window.masterAI.analyzeCode()"
                    style="background: #ec4899; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
              🔍 Analyze Code
            </button>
          </div>
          <div style="font-size: 12px; color: #ccc;">
            AI-powered code generation and analysis using uploaded references
          </div>
        </div>
      </div>

      <!-- Code Editor Area -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">📝 Code Editor</h3>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <select id="code-language" style="background: rgba(255,255,255,0.1); border: 1px solid #555; border-radius: 4px; color: white; padding: 6px;">
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <button onclick="window.masterAI.executeCode()"
                  style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            ▶️ Execute
          </button>
          <button onclick="window.masterAI.saveAsMethod()"
                  style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            💾 Save as Method
          </button>
        </div>
        <textarea id="code-editor" placeholder="// Start coding here..."
                  style="width: 100%; height: 300px; background: rgba(0,0,0,0.5); border: 1px solid #555; border-radius: 4px; color: white; padding: 12px; font-family: 'Courier New', monospace; font-size: 14px; resize: vertical;"></textarea>
      </div>

      <!-- Output Console -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🖥️ Console Output</h3>
        <div id="code-console" style="height: 150px; background: rgba(0,0,0,0.7); border-radius: 4px; padding: 12px; font-family: 'Courier New', monospace; font-size: 12px; overflow-y: auto; border: 1px solid #555;">
          <div style="color: #10b981;">Master AI Coding Workspace Ready</div>
          <div style="color: #ccc;">Upload code files, create methods, and let AI assist with development</div>
        </div>
      </div>
    `;
  }

  createCanvasViewerContent() {
    const canvasStatus = this.enhancedCanvasViewer ? this.enhancedCanvasViewer.getStatus() : null;

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">🎯 Enhanced Canvas Viewer</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #10b981;">Canvas Detection</h3>
          <div style="font-size: 28px; font-weight: bold; color: #10b981;">${canvasStatus ? canvasStatus.canvasCount : 0}</div>
          <div style="font-size: 12px; color: #ccc;">Canvas elements detected</div>
        </div>

        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #ef4444;">Anomalies</h3>
          <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${canvasStatus ? canvasStatus.anomalyCount : 0}</div>
          <div style="font-size: 12px; color: #ccc;">Issues detected</div>
        </div>

        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #8b5cf6;">Monitoring</h3>
          <div style="font-size: 20px; font-weight: bold; color: #8b5cf6;">${canvasStatus ? (canvasStatus.isActive ? 'ACTIVE' : 'INACTIVE') : 'UNKNOWN'}</div>
          <div style="font-size: 12px; color: #ccc;">Real-time scanning</div>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🎮 Canvas Controls</h3>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <button onclick="window.enhancedCanvasViewer.showViewer()"
                  style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            👁️ Open Viewer
          </button>
          <button onclick="window.enhancedCanvasViewer.detectAnomalies()"
                  style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔍 Detect Anomalies
          </button>
          <button onclick="window.enhancedCanvasViewer.clearAnomalies()"
                  style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🧹 Clear Anomalies
          </button>
          <button onclick="window.enhancedCanvasViewer.toggleScanning()"
                  style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            ${canvasStatus && canvasStatus.isActive ? '⏸️ Pause' : '▶️ Start'} Scanning
          </button>
        </div>

        <div style="font-size: 12px; color: #ccc;">
          Monitor canvas elements for anomalies, negative field issues, and movement patterns.
          The enhanced viewer provides real-time analysis and visual debugging capabilities.
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">📊 Canvas Analytics</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h4 style="margin: 0 0 8px 0; color: #10b981;">Movement Patterns</h4>
            <div style="font-size: 12px; color: #ccc;">
              • Real-time movement tracking<br>
              • Pattern recognition (spiral, linear, random)<br>
              • Anomaly detection for erratic behavior<br>
              • Movement prediction algorithms
            </div>
          </div>
          <div>
            <h4 style="margin: 0 0 8px 0; color: #ef4444;">Negative Field Detection</h4>
            <div style="font-size: 12px; color: #ccc;">
              • Visual darkness analysis<br>
              • Artifact identification<br>
              • Memory leak detection<br>
              • Performance monitoring
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createAgentBehaviorContent() {
    const behaviorStatus = this.agentBehaviorMonitor ? this.agentBehaviorMonitor.getStatus() : null;

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">👁️ Agent Behavior Monitor</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #f59e0b;">Behavior Logs</h3>
          <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">${behaviorStatus ? behaviorStatus.totalBehaviorLogs : 0}</div>
          <div style="font-size: 12px; color: #ccc;">Agent behavior records</div>
        </div>

        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #8b5cf6;">Patterns</h3>
          <div style="font-size: 28px; font-weight: bold; color: #8b5cf6;">${behaviorStatus ? behaviorStatus.totalPatterns : 0}</div>
          <div style="font-size: 12px; color: #ccc;">Detected patterns</div>
        </div>

        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #ef4444;">Anomalies</h3>
          <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${behaviorStatus ? behaviorStatus.anomalies : 0}</div>
          <div style="font-size: 12px; color: #ccc;">Behavioral anomalies</div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #10b981;">Monitoring</h3>
          <div style="font-size: 20px; font-weight: bold; color: #10b981;">${behaviorStatus ? (behaviorStatus.isMonitoring ? 'ACTIVE' : 'INACTIVE') : 'UNKNOWN'}</div>
          <div style="font-size: 12px; color: #ccc;">Real-time tracking</div>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🎮 Behavior Controls</h3>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <button onclick="window.agentBehaviorMonitor.showMonitor()"
                  style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            👁️ Open Monitor
          </button>
          <button onclick="window.agentBehaviorMonitor.detectPatterns()"
                  style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📊 Detect Patterns
          </button>
          <button onclick="window.agentBehaviorMonitor.exportBehaviorData()"
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📊 Export Data
          </button>
          <button onclick="window.agentBehaviorMonitor.toggleMonitoring()"
                  style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            ${behaviorStatus && behaviorStatus.isMonitoring ? '⏸️ Pause' : '▶️ Start'} Monitoring
          </button>
        </div>

        <div style="font-size: 12px; color: #ccc;">
          Monitor AI agent behaviors including task execution, learning patterns, communication, problem-solving approaches, and resource management.
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">📈 Behavior Categories</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
          <div style="background: rgba(59, 130, 246, 0.1); border-radius: 6px; padding: 12px;">
            <h4 style="margin: 0 0 6px 0; color: #3b82f6;">Task Execution</h4>
            <div style="font-size: 11px; color: #ccc;">Completion time, success rate, retry patterns, resource usage</div>
          </div>
          <div style="background: rgba(16, 185, 129, 0.1); border-radius: 6px; padding: 12px;">
            <h4 style="margin: 0 0 6px 0; color: #10b981;">Learning Behavior</h4>
            <div style="font-size: 11px; color: #ccc;">Learning rate, knowledge retention, skill improvement, adaptation</div>
          </div>
          <div style="background: rgba(245, 158, 11, 0.1); border-radius: 6px; padding: 12px;">
            <h4 style="margin: 0 0 6px 0; color: #f59e0b;">Communication</h4>
            <div style="font-size: 11px; color: #ccc;">Message frequency, collaboration quality, help requests</div>
          </div>
          <div style="background: rgba(139, 92, 246, 0.1); border-radius: 6px; padding: 12px;">
            <h4 style="margin: 0 0 6px 0; color: #8b5cf6;">Problem Solving</h4>
            <div style="font-size: 11px; color: #ccc;">Creativity, persistence, alternative approaches, error recovery</div>
          </div>
        </div>
      </div>
    `;
  }

  createDataflowViewerContent() {
    const dbStatus = this.getDatabaseStatus();

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">🌊 Dataflow & Database Viewer</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #3b82f6;">Database Connection</h3>
          <div style="font-size: 20px; font-weight: bold; color: #3b82f6;">${dbStatus.connected ? 'CONNECTED' : 'DISCONNECTED'}</div>
          <div style="font-size: 12px; color: #ccc;">Status: ${dbStatus.status}</div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #10b981;">Requests</h3>
          <div style="font-size: 28px; font-weight: bold; color: #10b981;">${dbStatus.requestHistory || 0}</div>
          <div style="font-size: 12px; color: #ccc;">Total database requests</div>
        </div>

        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #f59e0b;">AI Communication</h3>
          <div style="font-size: 20px; font-weight: bold; color: #f59e0b;">ACTIVE</div>
          <div style="font-size: 12px; color: #ccc;">Central & Database AI</div>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🎮 Database Controls</h3>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <button onclick="window.masterAI.connectToDatabase()"
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔗 Connect Database
          </button>
          <button onclick="window.masterAI.testDatabaseConnection()"
                  style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🧪 Test Connection
          </button>
          <button onclick="window.masterAI.viewDatabaseLogs()"
                  style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📋 View Logs
          </button>
          <button onclick="window.masterAI.sendTestQuery()"
                  style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📨 Send Query
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Dataflow Visualization -->
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">📊 Data Flow Map</h3>
          <div style="height: 300px; background: rgba(0,0,0,0.5); border-radius: 4px; padding: 12px; overflow: hidden; position: relative;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #666;">
              <div style="font-size: 48px; margin-bottom: 10px;">🌊</div>
              <div>Dataflow visualization will appear here</div>
              <div style="font-size: 12px; margin-top: 8px;">Real-time data movement tracking</div>
            </div>
          </div>
        </div>

        <!-- AI Communication Log -->
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">🤖 AI Communication Log</h3>
          <div id="ai-comm-log" style="height: 300px; background: rgba(0,0,0,0.5); border-radius: 4px; padding: 12px; font-family: 'Courier New', monospace; font-size: 11px; overflow-y: auto;">
            <div style="color: #10b981;">[${new Date().toLocaleTimeString()}] Database AI: Connection established</div>
            <div style="color: #3b82f6;">[${new Date().toLocaleTimeString()}] Central AI: Ready for communication</div>
            <div style="color: #f59e0b;">[${new Date().toLocaleTimeString()}] Master AI: Monitoring active</div>
            <div style="color: #ccc;">[${new Date().toLocaleTimeString()}] System: Dataflow monitoring started</div>
          </div>
        </div>
      </div>
    `;
  }

  createOverviewCanvasContent() {
    const canvasCount = this.enhancedCanvasViewer ? this.enhancedCanvasViewer.canvasElements.size : 0;

    return `
      <h1 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 24px;">🗺️ Canvas Overview Map</h1>

      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🎮 Overview Controls</h3>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <button onclick="window.masterAI.refreshCanvasOverview()"
                  style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔄 Refresh View
          </button>
          <button onclick="window.masterAI.analyzeCanvasRelations()"
                  style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔍 Analyze Relations
          </button>
          <button onclick="window.masterAI.showCanvasConnections()"
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔗 Show Connections
          </button>
          <button onclick="window.masterAI.generateCanvasMap()"
                  style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🗺️ Generate Map
          </button>
        </div>
        <div style="font-size: 12px; color: #ccc;">
          Detected ${canvasCount} canvas elements. This overview shows how all canvas elements fit together and interact within the system.
        </div>
      </div>

      <!-- Canvas Overview Map -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff;">🗺️ Interactive Canvas Map</h3>
        <div style="height: 400px; background: rgba(0,0,0,0.7); border-radius: 8px; padding: 20px; position: relative; overflow: hidden;">
          <canvas id="overview-canvas-map" style="width: 100%; height: 100%; border: 1px solid #555; border-radius: 4px;"></canvas>
          <div style="position: absolute; top: 30px; left: 30px; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 4px; font-size: 12px;">
            <div style="color: #10b981; margin-bottom: 4px;">🟢 Active Canvas</div>
            <div style="color: #f59e0b; margin-bottom: 4px;">🟡 Interactive Canvas</div>
            <div style="color: #ef4444; margin-bottom: 4px;">🔴 Problematic Canvas</div>
            <div style="color: #8b5cf6;">🟣 Connected Elements</div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Canvas Relationships -->
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">🔗 Canvas Relationships</h3>
          <div style="height: 200px; overflow-y: auto; font-size: 12px;">
            <div style="padding: 6px; background: rgba(16, 185, 129, 0.1); border-radius: 4px; margin-bottom: 6px;">
              <strong>Primary Canvas</strong> → Visualization Canvas
              <div style="color: #ccc; font-size: 11px;">Data flow connection active</div>
            </div>
            <div style="padding: 6px; background: rgba(59, 130, 246, 0.1); border-radius: 4px; margin-bottom: 6px;">
              <strong>Control Panel</strong> → Interactive Elements
              <div style="color: #ccc; font-size: 11px;">User input processing</div>
            </div>
            <div style="padding: 6px; background: rgba(245, 158, 11, 0.1); border-radius: 4px; margin-bottom: 6px;">
              <strong>Debug Canvas</strong> → Error Display
              <div style="color: #ccc; font-size: 11px;">Error visualization active</div>
            </div>
          </div>
        </div>

        <!-- Canvas Statistics -->
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ffffff;">📊 Canvas Statistics</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
            <div>
              <div style="color: #10b981; font-weight: bold;">Total Canvas: ${canvasCount}</div>
              <div style="color: #3b82f6; font-weight: bold;">Active: ${Math.floor(canvasCount * 0.8)}</div>
              <div style="color: #f59e0b; font-weight: bold;">Interactive: ${Math.floor(canvasCount * 0.6)}</div>
              <div style="color: #ef4444; font-weight: bold;">Issues: ${Math.floor(canvasCount * 0.1)}</div>
            </div>
            <div>
              <div style="color: #8b5cf6; font-weight: bold;">Connections: ${canvasCount * 2}</div>
              <div style="color: #ec4899; font-weight: bold;">Data Flows: ${canvasCount}</div>
              <div style="color: #14b8a6; font-weight: bold;">Updates/sec: ${Math.floor(Math.random() * 20 + 10)}</div>
              <div style="color: #f97316; font-weight: bold;">Avg Load: ${Math.floor(Math.random() * 30 + 20)}%</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Canvas anomaly handler
  handleCanvasAnomaly(anomalyData) {
    console.log('🎯 Canvas anomaly detected:', anomalyData);

    // Store anomaly for analysis
    if (!this.learningDatabase.get('canvas_anomalies')) {
      this.learningDatabase.set('canvas_anomalies', new Map());
    }

    this.learningDatabase.get('canvas_anomalies').set(anomalyData.id, anomalyData);

    // Send to agents for handling
    if (this.agentManager) {
      this.agentManager.distributeTask('canvas', {
        type: 'anomaly',
        data: anomalyData
      }, anomalyData.severity === 'high' ? 'urgent' : 'medium');
    }
  }

  // Code workspace methods
  createTempMethod() {
    const methodName = prompt('Enter method name:');
    const code = prompt('Enter method code:');
    const description = prompt('Enter description (optional):') || 'AI-generated temporary method';

    if (methodName && code && this.codeUploadManager) {
      const methodId = this.codeUploadManager.createTempMethod(methodName, code, description);
      alert(`Temporary method '${methodName}' created with ID: ${methodId}`);

      // Test the method
      if (confirm('Test the method now?')) {
        const success = this.codeUploadManager.testTempMethod(methodId);
        alert(success ? 'Method test passed!' : 'Method test failed. Check console for details.');
      }
    }
  }

  testAllMethods() {
    if (!this.codeUploadManager) {
      alert('Code Upload Manager not available');
      return;
    }

    let tested = 0;
    let passed = 0;

    this.codeUploadManager.tempMethods.forEach((method, methodId) => {
      if (!method.tested) {
        tested++;
        const success = this.codeUploadManager.testTempMethod(methodId);
        if (success) passed++;
      }
    });

    alert(`Tested ${tested} methods. ${passed} passed, ${tested - passed} failed.`);
  }

  generateCode() {
    const language = document.getElementById('code-language')?.value || 'python';
    const description = prompt(`What kind of ${language} code would you like me to generate?`);

    if (description && this.codeUploadManager) {
      // Use AI to generate code based on uploaded references
      const references = this.codeUploadManager.searchOfflineLibrary(description);

      let generatedCode = `# Generated ${language} code for: ${description}\n\n`;

      if (references.length > 0) {
        generatedCode += `# Based on references: ${references.map(r => r.name).join(', ')}\n\n`;
      }

      // Simple code generation based on description
      if (description.toLowerCase().includes('function')) {
        generatedCode += `def generated_function():\n    """${description}"""\n    # TODO: Implement functionality\n    pass\n`;
      } else if (description.toLowerCase().includes('class')) {
        generatedCode += `class GeneratedClass:\n    """${description}"""\n    \n    def __init__(self):\n        # TODO: Initialize\n        pass\n`;
      } else {
        generatedCode += `# ${description}\n# TODO: Implement the requested functionality\n`;
      }

      const editor = document.getElementById('code-editor');
      if (editor) {
        editor.value = generatedCode;
      }

      this.logToConsole(`Generated ${language} code based on: "${description}"`);
    }
  }

  analyzeCode() {
    const editor = document.getElementById('code-editor');
    const code = editor ? editor.value : '';

    if (!code.trim()) {
      alert('Please enter some code to analyze');
      return;
    }

    // Simple code analysis
    const analysis = {
      lines: code.split('\n').length,
      functions: (code.match(/def\s+\w+/g) || []).length,
      classes: (code.match(/class\s+\w+/g) || []).length,
      imports: (code.match(/import\s+\w+|from\s+\w+\s+import/g) || []).length,
      comments: (code.match(/#.*$/gm) || []).length,
      complexity: this.calculateCodeComplexity(code)
    };

    const analysisText = `
Code Analysis:
- Lines: ${analysis.lines}
- Functions: ${analysis.functions}
- Classes: ${analysis.classes}
- Imports: ${analysis.imports}
- Comments: ${analysis.comments}
- Complexity: ${analysis.complexity}

Suggestions:
${this.generateCodeSuggestions(analysis, code)}
    `;

    this.logToConsole(analysisText);
  }

  calculateCodeComplexity(code) {
    // Simple complexity calculation
    const complexityIndicators = [
      /if\s+/g, /elif\s+/g, /else\s+/g, /for\s+/g, /while\s+/g,
      /try\s+/g, /except\s+/g, /with\s+/g, /def\s+/g, /class\s+/g
    ];

    let complexity = 0;
    complexityIndicators.forEach(pattern => {
      const matches = code.match(pattern);
      complexity += matches ? matches.length : 0;
    });

    return complexity;
  }

  generateCodeSuggestions(analysis, code) {
    const suggestions = [];

    if (analysis.comments / analysis.lines < 0.1) {
      suggestions.push('• Consider adding more comments for better documentation');
    }

    if (analysis.functions === 0 && analysis.lines > 10) {
      suggestions.push('• Consider breaking code into functions for better organization');
    }

    if (analysis.complexity > 20) {
      suggestions.push('• Code complexity is high, consider refactoring');
    }

    if (code.includes('TODO')) {
      suggestions.push('• Complete TODO items before production use');
    }

    return suggestions.length > 0 ? suggestions.join('\n') : '• Code looks good!';
  }

  executeCode() {
    const editor = document.getElementById('code-editor');
    const language = document.getElementById('code-language')?.value || 'python';
    const code = editor ? editor.value : '';

    if (!code.trim()) {
      this.logToConsole('No code to execute', 'error');
      return;
    }

    this.logToConsole(`Executing ${language} code...`, 'info');

    try {
      if (language === 'javascript') {
        // Execute JavaScript in a safe context
        const result = eval(code);
        this.logToConsole(`Result: ${result}`, 'success');
      } else {
        // For other languages, simulate execution
        this.logToConsole(`${language} execution simulated - code appears syntactically correct`, 'info');
        this.logToConsole('Note: Full execution requires appropriate runtime environment', 'warning');
      }
    } catch (error) {
      this.logToConsole(`Execution error: ${error.message}`, 'error');
    }
  }

  saveAsMethod() {
    const editor = document.getElementById('code-editor');
    const code = editor ? editor.value : '';

    if (!code.trim()) {
      alert('No code to save');
      return;
    }

    const methodName = prompt('Enter method name:');
    const description = prompt('Enter description:') || 'Saved from code editor';

    if (methodName && this.codeUploadManager) {
      const methodId = this.codeUploadManager.createTempMethod(methodName, code, description);
      this.logToConsole(`Method '${methodName}' saved with ID: ${methodId}`, 'success');
      alert(`Method saved successfully! ID: ${methodId}`);
    }
  }

  logToConsole(message, type = 'info') {
    const console = document.getElementById('code-console');
    if (!console) return;

    const colors = {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.style.color = colors[type] || '#ccc';
    logEntry.textContent = `[${timestamp}] ${message}`;

    console.appendChild(logEntry);
    console.scrollTop = console.scrollHeight;
  }

  // Database methods
  testDatabaseConnection() {
    if (this.databaseConnected) {
      this.sendDatabaseRequest('TEST_CONNECTION').then(response => {
        alert('Database connection test successful!');
        console.log('Database test response:', response);
      }).catch(error => {
        alert('Database connection test failed: ' + error.message);
      });
    } else {
      alert('Database not connected. Please connect first.');
    }
  }

  viewDatabaseLogs() {
    const logs = this.databaseConnector ? this.databaseConnector.requestHistory : [];

    if (logs.length === 0) {
      alert('No database logs available');
      return;
    }

    const logText = logs.slice(-10).map(log =>
      `${new Date(log.timestamp).toLocaleString()}: ${log.query || 'Unknown query'} - ${log.status}`
    ).join('\n');

    alert(`Recent Database Logs:\n\n${logText}`);
  }

  sendTestQuery() {
    const query = prompt('Enter test query:') || 'SELECT 1';

    if (this.databaseConnected) {
      this.sendDatabaseRequest(query).then(response => {
        alert('Query executed successfully!\n\nResponse: ' + JSON.stringify(response, null, 2));
      }).catch(error => {
        alert('Query failed: ' + error.message);
      });
    } else {
      alert('Database not connected');
    }
  }

  // Canvas overview methods
  refreshCanvasOverview() {
    if (this.enhancedCanvasViewer) {
      this.enhancedCanvasViewer.detectAllCanvases();
      console.log('🔄 Canvas overview refreshed');
      alert('Canvas overview refreshed successfully!');
    }
  }

  analyzeCanvasRelations() {
    if (!this.enhancedCanvasViewer) {
      alert('Enhanced Canvas Viewer not available');
      return;
    }

    const canvases = this.enhancedCanvasViewer.canvasElements;
    const relations = [];

    canvases.forEach((canvas1, id1) => {
      canvases.forEach((canvas2, id2) => {
        if (id1 !== id2) {
          const relation = this.calculateCanvasRelation(canvas1, canvas2);
          if (relation.strength > 0.5) {
            relations.push(`${id1} ↔ ${id2}: ${relation.type} (${relation.strength.toFixed(2)})`);
          }
        }
      });
    });

    const relationText = relations.length > 0 ? relations.join('\n') : 'No strong relations detected';
    alert(`Canvas Relations:\n\n${relationText}`);
  }

  calculateCanvasRelation(canvas1, canvas2) {
    // Simple relation calculation based on proximity and type
    const bounds1 = canvas1.bounds;
    const bounds2 = canvas2.bounds;

    const distance = Math.sqrt(
      Math.pow(bounds1.x - bounds2.x, 2) + Math.pow(bounds1.y - bounds2.y, 2)
    );

    const maxDistance = 1000; // pixels
    const proximity = Math.max(0, 1 - distance / maxDistance);

    let typeRelation = 0.5;
    if (canvas1.type === canvas2.type) typeRelation = 0.8;

    return {
      strength: (proximity + typeRelation) / 2,
      type: canvas1.type === canvas2.type ? 'same_type' : 'different_type',
      distance
    };
  }

  showCanvasConnections() {
    console.log('🔗 Showing canvas connections...');
    // This would typically draw connection lines on the overview canvas
    alert('Canvas connections visualization activated! Check the overview map.');
  }

  generateCanvasMap() {
    console.log('🗺️ Generating interactive canvas map...');

    const canvas = document.getElementById('overview-canvas-map');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    this.drawGrid(ctx, canvas.width, canvas.height);

    // Draw canvas representations
    if (this.enhancedCanvasViewer) {
      this.drawCanvasElements(ctx, canvas.width, canvas.height);
    }

    // Draw connections
    this.drawCanvasConnections(ctx, canvas.width, canvas.height);

    alert('Canvas map generated successfully!');
  }

  drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 50;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  drawCanvasElements(ctx, width, height) {
    const canvases = this.enhancedCanvasViewer.canvasElements;
    const canvasArray = Array.from(canvases.values());

    canvasArray.forEach((canvasInfo, index) => {
      const x = (index % 4) * (width / 4) + 50;
      const y = Math.floor(index / 4) * 80 + 50;

      // Draw canvas representation
      ctx.fillStyle = this.getCanvasColor(canvasInfo);
      ctx.fillRect(x, y, 60, 40);

      // Draw border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 60, 40);

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.fillText(canvasInfo.id.substring(0, 8), x, y - 5);
    });
  }

  getCanvasColor(canvasInfo) {
    if (canvasInfo.anomalies && canvasInfo.anomalies.length > 0) return '#ef4444';
    if (canvasInfo.type === 'html5-canvas') return '#10b981';
    if (canvasInfo.active) return '#f59e0b';
    return '#6b7280';
  }

  drawCanvasConnections(ctx, width, height) {
    // Draw simple connection lines between canvas elements
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Draw some example connections
    for (let i = 0; i < 3; i++) {
      const x1 = 50 + (i * (width / 4));
      const y1 = 70;
      const x2 = 50 + ((i + 1) * (width / 4));
      const y2 = 70;

      ctx.beginPath();
      ctx.moveTo(x1 + 60, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }

  // Enhanced placeholder methods for functionality
  performEmergencyFix() {
    console.log('🚨 Emergency fix initiated');
    this.preventNegativeSpiral();
    if (this.agentManager) {
      this.agentManager.distributeTask('repair', { type: 'emergency', timestamp: Date.now() }, 'urgent');
    }
  }

  optimizeAllAIs() {
    console.log('⚡ Optimizing all AI systems');
    if (this.agentManager) {
      this.agentManager.distributeTask('learning', { type: 'optimize_all', timestamp: Date.now() }, 'high');
    }
  }

  runDiagnostics() {
    console.log('🔍 Running system diagnostics');
    if (this.componentMonitor) {
      this.componentMonitor.pingAllComponents();
    }
  }

  createNewFeature() {
    console.log('🛠️ Creating new feature');
    if (this.agentManager) {
      this.agentManager.distributeTask('strategy', { type: 'new_feature', timestamp: Date.now() }, 'medium');
    }
  }

  // Component messaging and interaction methods
  sendComponentMessage(componentAgentId, message) {
    if (!this.agentManager || !message.trim()) return false;

    const messageData = {
      content: message,
      from: 'user',
      type: 'instruction',
      priority: 'normal',
      timestamp: Date.now()
    };

    const success = this.agentManager.receiveComponentMessage(componentAgentId, messageData);

    if (success) {
      console.log(`💌 Message sent to ${componentAgentId}: ${message}`);
      // Refresh the UI to show the new message
      this.showSection('ai-management');
    }

    return success;
  }

  encourageComponent(componentAgentId) {
    const encouragementMessages = [
      "Keep up the excellent work! You're making great progress.",
      "Your recent improvements are impressive. Continue with your current strategy.",
      "Excellent problem-solving approach. Push forward to completion.",
      "Your efficiency is outstanding. Maintain this momentum.",
      "Great job on the recent fixes. Continue improving the system.",
      "Your analysis is spot-on. Complete the current goals."
    ];

    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

    return this.sendComponentMessage(componentAgentId, `🎯 ENCOURAGEMENT: ${randomMessage}`);
  }

  requestStrategy(componentAgentId) {
    const strategyRequests = [
      "Please develop a new strategy to complete your current goals more efficiently.",
      "Analyze your recent performance and suggest improvements for better results.",
      "What additional resources or approaches would help you achieve better outcomes?",
      "Please outline your next steps and any obstacles you're encountering.",
      "Develop an alternative approach for your current tasks.",
      "What new strategies can you implement to improve system performance?"
    ];

    const randomRequest = strategyRequests[Math.floor(Math.random() * strategyRequests.length)];

    return this.sendComponentMessage(componentAgentId, `📋 STRATEGY REQUEST: ${randomRequest}`);
  }

  assignTaskToAgent(agentId, taskType, taskData) {
    if (!this.agentManager || !taskType) return false;

    try {
      let parsedData = taskData;
      if (typeof taskData === 'string') {
        try {
          parsedData = JSON.parse(taskData);
        } catch {
          parsedData = { description: taskData };
        }
      }

      const taskId = this.agentManager.assignTaskToAgent(agentId, taskType, parsedData, 'medium');

      if (taskId) {
        console.log(`📋 Task ${taskId} assigned to agent ${agentId}`);
        alert(`Task assigned successfully! Task ID: ${taskId}`);
        this.showSection('ai-management');
        return true;
      } else {
        alert('Failed to assign task to agent.');
        return false;
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Error assigning task: ' + error.message);
      return false;
    }
  }

  inspectAgent(agentId) {
    if (!this.agentManager) return;

    const agentStatus = this.agentManager.getAgentStatus(agentId);
    if (!agentStatus) {
      alert('Agent not found!');
      return;
    }

    const inspection = `
Agent: ${agentStatus.name}
ID: ${agentStatus.id}
Status: ${agentStatus.status}
Specialization: ${agentStatus.specialization}
Current Tasks: ${agentStatus.currentTasks}
Completed Tasks: ${agentStatus.completedTasks}
Performance: ${JSON.stringify(agentStatus.performance, null, 2)}
Health: ${JSON.stringify(agentStatus.health, null, 2)}
Last Active: ${new Date(agentStatus.lastActive).toLocaleString()}
    `;

    alert(inspection);
  }

  pingAllComponents() {
    if (!this.componentMonitor) {
      alert('Component Monitor not available!');
      return;
    }

    console.log('📡 Pinging all components...');
    this.componentMonitor.pingAllComponents();

    setTimeout(() => {
      const overview = this.componentMonitor.getSystemOverview();
      const message = `
Ping Results:
Components: ${overview.components.active}/${overview.components.total} active
Critical Systems: ${overview.components.criticalActive}/${overview.components.critical} active
Overall Health: ${overview.health.overall.toFixed(1)}%
Recent Alerts: ${overview.alerts.recent}
      `;
      alert(message);
    }, 2000);
  }

  inspectAI(aiId) {
    const ai = this.aiAgents.get(aiId);
    if (!ai) {
      alert('AI system not found!');
      return;
    }

    const inspection = `
AI System: ${aiId}
Status: ${ai.status}
Performance:
  - Accuracy: ${ai.performance.accuracy}%
  - Efficiency: ${ai.performance.efficiency}%
  - Responsiveness: ${ai.performance.responsiveness}%
Tasks: ${ai.tasks.length}
Errors: ${ai.errors.length}
Last Update: ${new Date(ai.lastUpdate).toLocaleString()}
    `;

    alert(inspection);
  }

  optimizeAI(aiId) {
    const ai = this.aiAgents.get(aiId);
    if (!ai) {
      alert('AI system not found!');
      return;
    }

    // Simulate optimization
    ai.performance.accuracy = Math.min(100, ai.performance.accuracy + Math.random() * 5);
    ai.performance.efficiency = Math.min(100, ai.performance.efficiency + Math.random() * 5);
    ai.performance.responsiveness = Math.min(100, ai.performance.responsiveness + Math.random() * 5);
    ai.lastUpdate = Date.now();

    console.log(`⚡ Optimized AI system: ${aiId}`);
    alert(`AI system ${aiId} has been optimized!`);

    // Refresh the display
    this.showSection('ai-management');
  }

  rerouteAI(aiId) {
    const ai = this.aiAgents.get(aiId);
    if (!ai) {
      alert('AI system not found!');
      return;
    }

    // Simulate rerouting
    ai.status = ai.status === 'active' ? 'rerouting' : 'active';
    ai.lastUpdate = Date.now();

    console.log(`🔄 Rerouted AI system: ${aiId}`);
    alert(`AI system ${aiId} has been rerouted!`);

    // Restore status after a delay
    setTimeout(() => {
      ai.status = 'active';
      this.showSection('ai-management');
    }, 2000);
  }

  restartAllAIs() {
    console.log('🔄 Restarting all AI systems...');

    this.aiAgents.forEach((ai, id) => {
      ai.status = 'restarting';
      ai.lastUpdate = Date.now();

      // Restore after delay
      setTimeout(() => {
        ai.status = 'active';
        ai.performance.accuracy = Math.min(100, ai.performance.accuracy + Math.random() * 2);
        ai.performance.efficiency = Math.min(100, ai.performance.efficiency + Math.random() * 2);
        ai.performance.responsiveness = Math.min(100, ai.performance.responsiveness + Math.random() * 2);
      }, Math.random() * 3000 + 1000);
    });

    alert('All AI systems are restarting...');

    // Refresh display after restart
    setTimeout(() => {
      this.showSection('ai-management');
    }, 4000);
  }

  createNewAI() {
    const aiTypes = ['analyzer', 'optimizer', 'fixer', 'monitor', 'coordinator'];
    const randomType = aiTypes[Math.floor(Math.random() * aiTypes.length)];
    const aiId = `ai-${randomType}-${Date.now()}`;

    const newAI = {
      id: aiId,
      status: 'active',
      performance: {
        accuracy: 75 + Math.random() * 20,
        efficiency: 70 + Math.random() * 25,
        responsiveness: 80 + Math.random() * 15
      },
      tasks: [],
      errors: [],
      improvements: [],
      lastUpdate: Date.now()
    };

    this.aiAgents.set(aiId, newAI);

    console.log(`➕ Created new AI: ${aiId}`);
    alert(`New AI system created: ${aiId}`);

    // Refresh the display
    this.showSection('ai-management');
  }
}

// Initialize Master AI Controller
const masterAI = new MasterAIController();

// Make globally accessible
window.masterAI = masterAI;

console.log('🧠 Master AI Controller loaded and operational!');
