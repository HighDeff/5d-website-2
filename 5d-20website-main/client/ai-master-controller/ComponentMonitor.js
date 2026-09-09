/**
 * Component Monitor for Master AI Controller
 * Provides settings management and ping/health check methods for all components
 */

console.log('🔍 Loading Component Monitor...');

class ComponentMonitor {
  constructor(masterController) {
    this.masterController = masterController;
    this.components = new Map();
    this.healthChecks = new Map();
    this.settings = new Map();
    this.alerts = new Map();
    this.pingHistory = new Map();
    this.monitoringActive = false;
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Component Monitor...');
    
    // Discover all components
    this.discoverComponents();
    
    // Setup default settings
    this.setupDefaultSettings();
    
    // Initialize health monitoring
    this.initializeHealthMonitoring();
    
    // Setup monitoring intervals
    this.startContinuousMonitoring();
    
    console.log('✅ Component Monitor operational');
  }

  discoverComponents() {
    // Discover all system components
    const componentConfigs = [
      {
        id: 'screenshot-ocr-service',
        name: 'Screenshot OCR Service',
        type: 'service',
        ref: window.screenshotOCRService,
        critical: true,
        pingMethod: 'ping',
        settingsKey: 'screenshotOCR'
      },
      {
        id: 'canvas-interaction-tools',
        name: 'Canvas Interaction Tools',
        type: 'service',
        ref: window.canvasInteractionTools,
        critical: true,
        pingMethod: 'ping',
        settingsKey: 'canvasInteraction'
      },
      {
        id: 'agent-manager',
        name: 'Agent Manager',
        type: 'service',
        ref: window.agentManager,
        critical: true,
        pingMethod: 'ping',
        settingsKey: 'agentManager'
      },
      {
        id: 'ai-collaboration-network',
        name: 'AI Collaboration Network',
        type: 'ai_system',
        ref: window.aiCollaborationNetwork,
        critical: false,
        pingMethod: 'getStatus',
        settingsKey: 'aiCollaboration'
      },
      {
        id: 'ai-status-tracker',
        name: 'AI Status Tracker',
        type: 'ai_system',
        ref: window.aiStatusTracker,
        critical: false,
        pingMethod: 'ping',
        settingsKey: 'aiStatusTracker'
      },
      {
        id: 'canvas-entity-manager',
        name: 'Canvas Entity Manager',
        type: 'ai_system',
        ref: window.canvasEntityManager,
        critical: false,
        pingMethod: 'getStatus',
        settingsKey: 'canvasEntities'
      },
      {
        id: 'system-validator',
        name: 'System Validator',
        type: 'ai_system',
        ref: window.systemValidator,
        critical: false,
        pingMethod: 'validate',
        settingsKey: 'systemValidator'
      },
      {
        id: 'enhanced-auto-fix',
        name: 'Enhanced Auto Fix',
        type: 'ai_system',
        ref: window.enhancedAutoFix,
        critical: false,
        pingMethod: 'getStatus',
        settingsKey: 'autoFix'
      },
      {
        id: 'visual-ai-training',
        name: 'Visual AI Training',
        type: 'ai_system',
        ref: window.visualAITraining,
        critical: false,
        pingMethod: 'getStatus',
        settingsKey: 'visualTraining'
      }
    ];
    
    componentConfigs.forEach(config => {
      this.registerComponent(config);
    });
    
    // Discover canvas elements
    this.discoverCanvasComponents();
    
    // Discover DOM components
    this.discoverDOMComponents();
  }

  registerComponent(config) {
    const component = {
      ...config,
      status: 'unknown',
      lastPing: null,
      lastResponse: null,
      errorCount: 0,
      responseTime: 0,
      uptime: 0,
      settings: new Map(),
      alerts: [],
      history: [],
      registered: Date.now()
    };
    
    // Check if component is available
    if (config.ref) {
      component.status = 'available';
      component.available = true;
    } else {
      component.status = 'missing';
      component.available = false;
    }
    
    this.components.set(config.id, component);
    this.pingHistory.set(config.id, []);
    
    console.log(`📋 Registered component: ${config.name} (${component.status})`);
  }

  discoverCanvasComponents() {
    // Find all canvas elements
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((canvas, index) => {
      const canvasId = canvas.id || `canvas-${index}`;
      this.registerComponent({
        id: `canvas-${canvasId}`,
        name: `Canvas: ${canvasId}`,
        type: 'canvas',
        ref: canvas,
        critical: false,
        pingMethod: 'checkCanvas',
        settingsKey: `canvas-${canvasId}`
      });
    });
  }

  discoverDOMComponents() {
    // Find important DOM components
    const importantSelectors = [
      '#master-ai-controller',
      '[data-ai-component]',
      '.ai-system',
      '.visualization',
      '.canvas-container'
    ];
    
    importantSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        const elementId = element.id || `${selector.replace(/[#\.\[\]]/g, '')}-${index}`;
        this.registerComponent({
          id: `dom-${elementId}`,
          name: `DOM: ${elementId}`,
          type: 'dom',
          ref: element,
          critical: false,
          pingMethod: 'checkElement',
          settingsKey: `dom-${elementId}`
        });
      });
    });
  }

  setupDefaultSettings() {
    // Default settings for each component type
    const defaultSettings = {
      'screenshotOCR': {
        enabled: true,
        interval: 1000,
        maxHistory: 3600,
        negativeFieldDetection: true,
        spiralPrevention: true,
        ocrEnabled: true
      },
      'canvasInteraction': {
        enabled: true,
        entityCreation: true,
        interactionSimulation: true,
        analysisEnabled: true,
        toolsActive: true
      },
      'agentManager': {
        enabled: true,
        maxAgents: 20,
        taskQueueSize: 100,
        autoDistribution: true,
        performanceMonitoring: true
      },
      'aiCollaboration': {
        enabled: true,
        autoCoordination: true,
        messageRouting: true,
        performanceTracking: true
      },
      'monitoring': {
        pingInterval: 30000,
        healthCheckInterval: 60000,
        alertThreshold: 3,
        historySize: 1000
      }
    };
    
    Object.entries(defaultSettings).forEach(([key, settings]) => {
      this.settings.set(key, settings);
    });
  }

  initializeHealthMonitoring() {
    // Setup health check configurations
    this.healthCheckConfigs = new Map([
      ['critical', { interval: 10000, timeout: 5000, retries: 3 }],
      ['important', { interval: 30000, timeout: 10000, retries: 2 }],
      ['normal', { interval: 60000, timeout: 15000, retries: 1 }]
    ]);
    
    // Initialize health status for all components
    this.components.forEach((component, id) => {
      this.healthChecks.set(id, {
        status: 'unknown',
        lastCheck: Date.now(),
        consecutiveFailures: 0,
        averageResponseTime: 0,
        availability: 100
      });
    });
  }

  startContinuousMonitoring() {
    if (this.monitoringActive) return;
    
    this.monitoringActive = true;
    
    // Ping all components every 30 seconds
    this.pingInterval = setInterval(() => {
      this.pingAllComponents();
    }, 30000);
    
    // Health checks every minute
    this.healthInterval = setInterval(() => {
      this.performHealthChecks();
    }, 60000);
    
    // Settings validation every 5 minutes
    this.settingsInterval = setInterval(() => {
      this.validateAllSettings();
    }, 300000);
    
    console.log('🔄 Continuous monitoring started');
  }

  stopContinuousMonitoring() {
    this.monitoringActive = false;
    
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.healthInterval) clearInterval(this.healthInterval);
    if (this.settingsInterval) clearInterval(this.settingsInterval);
    
    console.log('⏹️ Continuous monitoring stopped');
  }

  async pingAllComponents() {
    const pingPromises = Array.from(this.components.keys()).map(id => 
      this.pingComponent(id)
    );
    
    try {
      await Promise.allSettled(pingPromises);
    } catch (error) {
      console.error('Error in mass ping operation:', error);
    }
  }

  async pingComponent(componentId) {
    const component = this.components.get(componentId);
    if (!component) return null;
    
    const startTime = Date.now();
    let pingResult = null;
    
    try {
      // Perform ping based on component type
      switch (component.type) {
        case 'service':
          pingResult = await this.pingService(component);
          break;
        case 'ai_system':
          pingResult = await this.pingAISystem(component);
          break;
        case 'canvas':
          pingResult = await this.pingCanvas(component);
          break;
        case 'dom':
          pingResult = await this.pingDOMElement(component);
          break;
        default:
          pingResult = await this.pingGeneric(component);
      }
      
      const responseTime = Date.now() - startTime;
      
      // Update component status
      component.lastPing = Date.now();
      component.lastResponse = pingResult;
      component.responseTime = responseTime;
      component.status = pingResult ? 'active' : 'inactive';
      
      // Update health check
      const healthCheck = this.healthChecks.get(componentId);
      if (healthCheck) {
        healthCheck.lastCheck = Date.now();
        healthCheck.status = pingResult ? 'healthy' : 'unhealthy';
        healthCheck.consecutiveFailures = pingResult ? 0 : healthCheck.consecutiveFailures + 1;
        
        // Update average response time
        if (pingResult) {
          healthCheck.averageResponseTime = (healthCheck.averageResponseTime + responseTime) / 2;
        }
      }
      
      // Store ping history
      const history = this.pingHistory.get(componentId);
      history.push({
        timestamp: Date.now(),
        responseTime,
        success: !!pingResult,
        result: pingResult
      });
      
      // Trim history
      if (history.length > 100) {
        history.splice(0, 50);
      }
      
      return pingResult;
      
    } catch (error) {
      console.warn(`Ping failed for ${componentId}:`, error);
      
      // Update error status
      component.errorCount++;
      component.status = 'error';
      
      const healthCheck = this.healthChecks.get(componentId);
      if (healthCheck) {
        healthCheck.consecutiveFailures++;
        healthCheck.status = 'error';
      }
      
      return null;
    }
  }

  async pingService(component) {
    if (!component.ref || !component.ref.ping) {
      return { status: 'no_ping_method', available: !!component.ref };
    }
    
    try {
      const result = component.ref.ping();
      return result || { status: 'ping_responded', timestamp: Date.now() };
    } catch (error) {
      return { status: 'ping_error', error: error.message };
    }
  }

  async pingAISystem(component) {
    if (!component.ref) {
      return { status: 'not_available' };
    }
    
    // Try multiple methods to get status
    const methods = [component.pingMethod, 'ping', 'getStatus', 'status'];
    
    for (const method of methods) {
      if (component.ref[method]) {
        try {
          const result = component.ref[method]();
          return result || { status: 'responded', method };
        } catch (error) {
          continue;
        }
      }
    }
    
    return { status: 'available_no_ping', timestamp: Date.now() };
  }

  async pingCanvas(component) {
    const canvas = component.ref;
    if (!canvas || !canvas.getContext) {
      return { status: 'not_canvas' };
    }
    
    try {
      const ctx = canvas.getContext('2d');
      const bounds = canvas.getBoundingClientRect();
      
      return {
        status: 'active',
        width: canvas.width,
        height: canvas.height,
        visible: bounds.width > 0 && bounds.height > 0,
        context: !!ctx,
        timestamp: Date.now()
      };
    } catch (error) {
      return { status: 'canvas_error', error: error.message };
    }
  }

  async pingDOMElement(component) {
    const element = component.ref;
    if (!element || !element.isConnected) {
      return { status: 'not_connected' };
    }
    
    const bounds = element.getBoundingClientRect();
    
    return {
      status: 'active',
      visible: bounds.width > 0 && bounds.height > 0,
      tagName: element.tagName,
      id: element.id,
      classes: Array.from(element.classList),
      timestamp: Date.now()
    };
  }

  async pingGeneric(component) {
    if (!component.ref) {
      return { status: 'not_available' };
    }
    
    return {
      status: 'available',
      type: typeof component.ref,
      timestamp: Date.now()
    };
  }

  performHealthChecks() {
    this.components.forEach((component, id) => {
      const healthCheck = this.healthChecks.get(id);
      if (!healthCheck) return;
      
      // Calculate availability percentage
      const history = this.pingHistory.get(id) || [];
      const recentHistory = history.slice(-20); // Last 20 pings
      
      if (recentHistory.length > 0) {
        const successCount = recentHistory.filter(h => h.success).length;
        healthCheck.availability = (successCount / recentHistory.length) * 100;
      }
      
      // Check for alerts
      this.checkComponentAlerts(id, component, healthCheck);
    });
  }

  checkComponentAlerts(componentId, component, healthCheck) {
    const alerts = [];
    
    // Check consecutive failures
    if (healthCheck.consecutiveFailures >= 3) {
      alerts.push({
        type: 'consecutive_failures',
        severity: 'high',
        message: `${healthCheck.consecutiveFailures} consecutive ping failures`,
        timestamp: Date.now()
      });
    }
    
    // Check availability
    if (healthCheck.availability < 80) {
      alerts.push({
        type: 'low_availability',
        severity: 'medium',
        message: `Availability dropped to ${healthCheck.availability.toFixed(1)}%`,
        timestamp: Date.now()
      });
    }
    
    // Check response time
    if (healthCheck.averageResponseTime > 5000) {
      alerts.push({
        type: 'slow_response',
        severity: 'low',
        message: `Average response time: ${healthCheck.averageResponseTime.toFixed(0)}ms`,
        timestamp: Date.now()
      });
    }
    
    // Store alerts
    if (alerts.length > 0) {
      const existingAlerts = this.alerts.get(componentId) || [];
      this.alerts.set(componentId, [...existingAlerts, ...alerts]);
      
      // Trim old alerts
      const allAlerts = this.alerts.get(componentId);
      if (allAlerts.length > 50) {
        allAlerts.splice(0, 25);
      }
      
      // Notify master controller
      alerts.forEach(alert => {
        this.masterController.handleComponentAlert(componentId, alert);
      });
    }
  }

  validateAllSettings() {
    this.settings.forEach((settingGroup, key) => {
      this.validateSettings(key, settingGroup);
    });
  }

  validateSettings(settingsKey, settings) {
    const validation = {
      key: settingsKey,
      valid: true,
      issues: [],
      timestamp: Date.now()
    };
    
    // Validate common settings
    Object.entries(settings).forEach(([key, value]) => {
      switch (key) {
        case 'interval':
          if (typeof value !== 'number' || value < 100) {
            validation.valid = false;
            validation.issues.push(`Invalid interval: ${value}`);
          }
          break;
        case 'enabled':
          if (typeof value !== 'boolean') {
            validation.valid = false;
            validation.issues.push(`Invalid enabled flag: ${value}`);
          }
          break;
        case 'maxHistory':
          if (typeof value !== 'number' || value < 1) {
            validation.valid = false;
            validation.issues.push(`Invalid maxHistory: ${value}`);
          }
          break;
      }
    });
    
    if (!validation.valid) {
      console.warn(`⚠️ Settings validation failed for ${settingsKey}:`, validation.issues);
    }
    
    return validation;
  }

  // Settings management
  updateComponentSettings(componentId, newSettings) {
    const component = this.components.get(componentId);
    if (!component) return false;
    
    const settingsKey = component.settingsKey;
    const currentSettings = this.settings.get(settingsKey) || {};
    
    // Merge settings
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    // Validate new settings
    const validation = this.validateSettings(settingsKey, updatedSettings);
    
    if (validation.valid) {
      this.settings.set(settingsKey, updatedSettings);
      
      // Apply settings to component if it has an updateSettings method
      if (component.ref && component.ref.updateSettings) {
        try {
          component.ref.updateSettings(updatedSettings);
        } catch (error) {
          console.error(`Failed to update settings for ${componentId}:`, error);
          return false;
        }
      }
      
      console.log(`⚙️ Updated settings for ${componentId}`);
      return true;
    } else {
      console.error(`❌ Invalid settings for ${componentId}:`, validation.issues);
      return false;
    }
  }

  getComponentSettings(componentId) {
    const component = this.components.get(componentId);
    if (!component) return null;
    
    return this.settings.get(component.settingsKey) || {};
  }

  getAllSettings() {
    return Object.fromEntries(this.settings);
  }

  resetComponentSettings(componentId) {
    const component = this.components.get(componentId);
    if (!component) return false;
    
    // Reset to default settings
    this.setupDefaultSettings();
    const defaultSettings = this.settings.get(component.settingsKey);
    
    if (defaultSettings) {
      return this.updateComponentSettings(componentId, defaultSettings);
    }
    
    return false;
  }

  // Status and reporting
  getComponentStatus(componentId) {
    const component = this.components.get(componentId);
    const healthCheck = this.healthChecks.get(componentId);
    const pingHistory = this.pingHistory.get(componentId) || [];
    const alerts = this.alerts.get(componentId) || [];
    
    if (!component) return null;
    
    return {
      id: componentId,
      name: component.name,
      type: component.type,
      status: component.status,
      available: component.available,
      critical: component.critical,
      lastPing: component.lastPing,
      responseTime: component.responseTime,
      errorCount: component.errorCount,
      health: healthCheck ? {
        status: healthCheck.status,
        availability: healthCheck.availability,
        consecutiveFailures: healthCheck.consecutiveFailures,
        averageResponseTime: healthCheck.averageResponseTime
      } : null,
      settings: this.getComponentSettings(componentId),
      alerts: alerts.slice(-5), // Last 5 alerts
      pingHistory: pingHistory.slice(-10) // Last 10 pings
    };
  }

  getAllComponentStatuses() {
    const statuses = new Map();
    this.components.forEach((component, id) => {
      statuses.set(id, this.getComponentStatus(id));
    });
    return statuses;
  }

  getSystemOverview() {
    const totalComponents = this.components.size;
    const activeComponents = Array.from(this.components.values()).filter(c => c.status === 'active').length;
    const criticalComponents = Array.from(this.components.values()).filter(c => c.critical).length;
    const criticalActive = Array.from(this.components.values()).filter(c => c.critical && c.status === 'active').length;
    
    const totalAlerts = Array.from(this.alerts.values()).reduce((total, alerts) => total + alerts.length, 0);
    const recentAlerts = Array.from(this.alerts.values())
      .flat()
      .filter(alert => Date.now() - alert.timestamp < 3600000) // Last hour
      .length;
    
    return {
      components: {
        total: totalComponents,
        active: activeComponents,
        inactive: totalComponents - activeComponents,
        critical: criticalComponents,
        criticalActive: criticalActive
      },
      health: {
        overall: (activeComponents / totalComponents) * 100,
        critical: criticalComponents > 0 ? (criticalActive / criticalComponents) * 100 : 100
      },
      alerts: {
        total: totalAlerts,
        recent: recentAlerts
      },
      monitoring: {
        active: this.monitoringActive,
        lastUpdate: Date.now()
      }
    };
  }

  // Manual operations
  manualPing(componentId) {
    return this.pingComponent(componentId);
  }

  manualHealthCheck(componentId) {
    const component = this.components.get(componentId);
    if (!component) return null;
    
    const healthCheck = this.healthChecks.get(componentId);
    this.checkComponentAlerts(componentId, component, healthCheck);
    
    return this.getComponentStatus(componentId);
  }

  forceComponentRestart(componentId) {
    const component = this.components.get(componentId);
    if (!component || !component.ref) return false;
    
    try {
      // Try to restart component if it has a restart method
      if (component.ref.restart) {
        component.ref.restart();
      } else if (component.ref.initialize) {
        component.ref.initialize();
      }
      
      // Reset error count and status
      component.errorCount = 0;
      component.status = 'active';
      
      const healthCheck = this.healthChecks.get(componentId);
      if (healthCheck) {
        healthCheck.consecutiveFailures = 0;
        healthCheck.status = 'healthy';
      }
      
      console.log(`🔄 Forced restart for ${componentId}`);
      return true;
      
    } catch (error) {
      console.error(`Failed to restart ${componentId}:`, error);
      return false;
    }
  }

  ping() {
    return {
      service: 'ComponentMonitor',
      status: this.monitoringActive ? 'active' : 'inactive',
      components: this.components.size,
      healthChecks: this.healthChecks.size,
      monitoring: this.monitoringActive,
      overview: this.getSystemOverview(),
      health: 'healthy'
    };
  }
}

// Export for use by Master AI Controller
window.ComponentMonitor = ComponentMonitor;

console.log('✅ Component Monitor loaded');
