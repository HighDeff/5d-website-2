/**
 * Canvas Interaction Tools for Master AI Controller
 * Provides direct canvas manipulation and interaction capabilities for AI
 */

console.log('🎨 Loading Canvas Interaction Tools...');

class CanvasInteractionTools {
  constructor(masterController) {
    this.masterController = masterController;
    this.canvasInstances = new Map();
    this.interactionHistory = [];
    this.entityManager = null;
    this.activeInteractions = new Set();
    this.tools = new Map();
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Canvas Interaction Tools...');
    
    // Discover all canvas instances
    this.discoverCanvasInstances();
    
    // Setup interaction tools
    this.setupInteractionTools();
    
    // Initialize entity creation capabilities
    this.initializeEntityManager();
    
    // Setup canvas event monitoring
    this.setupCanvasEventMonitoring();
    
    console.log('✅ Canvas Interaction Tools operational');
  }

  discoverCanvasInstances() {
    // Find all canvas elements and visualization systems
    const canvases = document.querySelectorAll('canvas');
    const visualContainers = document.querySelectorAll('[id*="canvas"], [class*="visual"], [data-canvas]');
    
    canvases.forEach((canvas, index) => {
      const canvasId = canvas.id || `canvas-${index}`;
      this.registerCanvas(canvasId, canvas, 'html5-canvas');
    });
    
    // Register known visualization systems
    this.registerKnownSystems();
    
    console.log(`🎨 Discovered ${this.canvasInstances.size} canvas instances`);
  }

  registerKnownSystems() {
    // Register specific visualization systems if they exist
    const knownSystems = [
      { id: 'three-canvas', selector: '[id*="three"]', type: 'three.js' },
      { id: 'p5-canvas', selector: '[id*="p5"], [id*="sketch"]', type: 'p5.js' },
      { id: 'd3-visualization', selector: '[id*="d3"], svg', type: 'd3.js' },
      { id: 'chart-canvas', selector: '[id*="chart"]', type: 'chart' },
      { id: 'webgl-canvas', selector: '[id*="webgl"], [id*="gl"]', type: 'webgl' }
    ];
    
    knownSystems.forEach(system => {
      const elements = document.querySelectorAll(system.selector);
      elements.forEach((element, index) => {
        const id = element.id || `${system.id}-${index}`;
        this.registerCanvas(id, element, system.type);
      });
    });
  }

  registerCanvas(id, element, type) {
    const canvasInfo = {
      id,
      element,
      type,
      bounds: element.getBoundingClientRect(),
      context: this.getCanvasContext(element, type),
      tools: this.createCanvasTools(element, type),
      entities: new Map(),
      interactions: [],
      lastUpdate: Date.now()
    };
    
    this.canvasInstances.set(id, canvasInfo);
    console.log(`📍 Registered canvas: ${id} (${type})`);
  }

  getCanvasContext(element, type) {
    try {
      switch (type) {
        case 'html5-canvas':
          return element.getContext('2d') || element.getContext('webgl');
        case 'three.js':
          // Try to find Three.js renderer
          return window.THREE ? { type: 'three', element } : null;
        case 'webgl':
          return element.getContext('webgl') || element.getContext('experimental-webgl');
        case 'd3.js':
          return window.d3 ? { type: 'd3', element } : null;
        default:
          return { type: 'unknown', element };
      }
    } catch (error) {
      console.warn(`Failed to get context for ${type}:`, error);
      return null;
    }
  }

  createCanvasTools(element, type) {
    const tools = {
      draw: this.createDrawTool(element, type),
      clear: this.createClearTool(element, type),
      interact: this.createInteractionTool(element, type),
      analyze: this.createAnalysisTool(element, type),
      entity: this.createEntityTool(element, type)
    };
    
    return tools;
  }

  createDrawTool(element, type) {
    return {
      drawPoint: (x, y, options = {}) => this.drawPoint(element, x, y, options),
      drawLine: (x1, y1, x2, y2, options = {}) => this.drawLine(element, x1, y1, x2, y2, options),
      drawShape: (shape, options = {}) => this.drawShape(element, shape, options),
      drawText: (text, x, y, options = {}) => this.drawText(element, text, x, y, options),
      drawImage: (imageData, x, y, options = {}) => this.drawImage(element, imageData, x, y, options)
    };
  }

  createClearTool(element, type) {
    return {
      clearAll: () => this.clearCanvas(element, type),
      clearArea: (x, y, width, height) => this.clearArea(element, x, y, width, height),
      clearEntity: (entityId) => this.clearEntity(element, entityId)
    };
  }

  createInteractionTool(element, type) {
    return {
      click: (x, y) => this.simulateClick(element, x, y),
      hover: (x, y) => this.simulateHover(element, x, y),
      drag: (x1, y1, x2, y2) => this.simulateDrag(element, x1, y1, x2, y2),
      scroll: (deltaX, deltaY) => this.simulateScroll(element, deltaX, deltaY),
      zoom: (factor, centerX, centerY) => this.simulateZoom(element, factor, centerX, centerY)
    };
  }

  createAnalysisTool(element, type) {
    return {
      getPixelData: (x, y) => this.getPixelData(element, x, y),
      analyzeArea: (x, y, width, height) => this.analyzeArea(element, x, y, width, height),
      detectEdges: () => this.detectEdges(element),
      findPatterns: () => this.findPatterns(element),
      measureDistance: (x1, y1, x2, y2) => this.measureDistance(x1, y1, x2, y2)
    };
  }

  createEntityTool(element, type) {
    return {
      createEntity: (entityData) => this.createEntity(element, entityData),
      updateEntity: (entityId, updates) => this.updateEntity(element, entityId, updates),
      deleteEntity: (entityId) => this.deleteEntity(element, entityId),
      getEntities: () => this.getEntities(element),
      testEntity: (entityId) => this.testEntity(element, entityId)
    };
  }

  setupInteractionTools() {
    this.tools.set('drawing', {
      name: 'Drawing Tools',
      methods: ['drawPoint', 'drawLine', 'drawShape', 'drawText', 'drawImage'],
      usage: 'Create visual elements on canvas'
    });
    
    this.tools.set('manipulation', {
      name: 'Canvas Manipulation',
      methods: ['clearAll', 'clearArea', 'transform', 'resize'],
      usage: 'Modify canvas content and properties'
    });
    
    this.tools.set('interaction', {
      name: 'User Interaction Simulation',
      methods: ['click', 'hover', 'drag', 'scroll', 'zoom'],
      usage: 'Simulate user interactions for testing'
    });
    
    this.tools.set('analysis', {
      name: 'Canvas Analysis',
      methods: ['getPixelData', 'analyzeArea', 'detectEdges', 'findPatterns'],
      usage: 'Analyze canvas content and extract data'
    });
    
    this.tools.set('entity', {
      name: 'Entity Management',
      methods: ['createEntity', 'updateEntity', 'deleteEntity', 'testEntity'],
      usage: 'Create and manage interactive entities'
    });
  }

  initializeEntityManager() {
    this.entityManager = {
      entities: new Map(),
      templates: new Map(),
      behaviors: new Map(),
      create: (type, data) => this.createTestEntity(type, data),
      test: (entityId) => this.runEntityTest(entityId),
      verify: (entityId) => this.verifyEntity(entityId)
    };
    
    // Setup default entity templates
    this.setupEntityTemplates();
  }

  setupEntityTemplates() {
    const templates = {
      'test-marker': {
        type: 'marker',
        visual: { shape: 'circle', color: '#ff0000', size: 10 },
        behavior: { blink: true, duration: 5000 },
        purpose: 'Mark test points or areas of interest'
      },
      'data-collector': {
        type: 'collector',
        visual: { shape: 'square', color: '#00ff00', size: 15 },
        behavior: { collect: true, interval: 1000 },
        purpose: 'Collect data from canvas interactions'
      },
      'error-indicator': {
        type: 'indicator',
        visual: { shape: 'triangle', color: '#ff0000', size: 12 },
        behavior: { alert: true, urgent: true },
        purpose: 'Highlight errors or problematic areas'
      },
      'performance-monitor': {
        type: 'monitor',
        visual: { shape: 'diamond', color: '#0066ff', size: 8 },
        behavior: { monitor: true, report: true },
        purpose: 'Monitor performance metrics'
      }
    };
    
    Object.entries(templates).forEach(([id, template]) => {
      this.entityManager.templates.set(id, template);
    });
  }

  setupCanvasEventMonitoring() {
    // Monitor all canvas events for AI learning
    this.canvasInstances.forEach((canvasInfo, id) => {
      const element = canvasInfo.element;
      
      // Setup event listeners
      const eventTypes = ['click', 'mouseover', 'mouseout', 'mousemove', 'mousedown', 'mouseup'];
      
      eventTypes.forEach(eventType => {
        element.addEventListener(eventType, (event) => {
          this.recordCanvasEvent(id, eventType, event);
        });
      });
    });
  }

  recordCanvasEvent(canvasId, eventType, event) {
    const eventData = {
      canvasId,
      type: eventType,
      timestamp: Date.now(),
      position: { x: event.offsetX || 0, y: event.offsetY || 0 },
      target: event.target.tagName,
      details: {
        button: event.button,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey
      }
    };
    
    this.interactionHistory.push(eventData);
    
    // Send to master controller for analysis
    this.masterController.processCanvasEvent(eventData);
    
    // Trim history if too large
    if (this.interactionHistory.length > 1000) {
      this.interactionHistory.splice(0, 500);
    }
  }

  // Drawing methods
  drawPoint(element, x, y, options = {}) {
    const ctx = element.getContext('2d');
    if (!ctx) return false;
    
    ctx.save();
    ctx.fillStyle = options.color || '#000000';
    ctx.beginPath();
    ctx.arc(x, y, options.size || 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    
    return true;
  }

  drawLine(element, x1, y1, x2, y2, options = {}) {
    const ctx = element.getContext('2d');
    if (!ctx) return false;
    
    ctx.save();
    ctx.strokeStyle = options.color || '#000000';
    ctx.lineWidth = options.width || 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
    
    return true;
  }

  drawShape(element, shape, options = {}) {
    const ctx = element.getContext('2d');
    if (!ctx) return false;
    
    ctx.save();
    ctx.fillStyle = options.fillColor || '#000000';
    ctx.strokeStyle = options.strokeColor || '#000000';
    ctx.lineWidth = options.lineWidth || 1;
    
    switch (shape.type) {
      case 'rectangle':
        if (options.fill) ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        if (options.stroke) ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        if (options.fill) ctx.fill();
        if (options.stroke) ctx.stroke();
        break;
      case 'polygon':
        if (shape.points && shape.points.length > 2) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          shape.points.slice(1).forEach(point => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.closePath();
          if (options.fill) ctx.fill();
          if (options.stroke) ctx.stroke();
        }
        break;
    }
    
    ctx.restore();
    return true;
  }

  drawText(element, text, x, y, options = {}) {
    const ctx = element.getContext('2d');
    if (!ctx) return false;
    
    ctx.save();
    ctx.fillStyle = options.color || '#000000';
    ctx.font = `${options.size || 12}px ${options.font || 'Arial'}`;
    ctx.textAlign = options.align || 'left';
    ctx.fillText(text, x, y);
    ctx.restore();
    
    return true;
  }

  // Interaction simulation methods
  simulateClick(element, x, y) {
    const event = new MouseEvent('click', {
      bubbles: true,
      clientX: x + element.getBoundingClientRect().left,
      clientY: y + element.getBoundingClientRect().top
    });
    
    element.dispatchEvent(event);
    this.recordAIInteraction('click', { element: element.id, x, y });
  }

  simulateHover(element, x, y) {
    const event = new MouseEvent('mouseover', {
      bubbles: true,
      clientX: x + element.getBoundingClientRect().left,
      clientY: y + element.getBoundingClientRect().top
    });
    
    element.dispatchEvent(event);
    this.recordAIInteraction('hover', { element: element.id, x, y });
  }

  simulateDrag(element, x1, y1, x2, y2) {
    const rect = element.getBoundingClientRect();
    
    // Mouse down
    element.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: x1 + rect.left,
      clientY: y1 + rect.top
    }));
    
    // Mouse move
    element.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      clientX: x2 + rect.left,
      clientY: y2 + rect.top
    }));
    
    // Mouse up
    element.dispatchEvent(new MouseEvent('mouseup', {
      bubbles: true,
      clientX: x2 + rect.left,
      clientY: y2 + rect.top
    }));
    
    this.recordAIInteraction('drag', { element: element.id, x1, y1, x2, y2 });
  }

  // Entity management methods
  createTestEntity(type, data) {
    const entityId = `entity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const template = this.entityManager.templates.get(type) || {};
    
    const entity = {
      id: entityId,
      type,
      ...template,
      ...data,
      created: Date.now(),
      status: 'active',
      interactions: [],
      data: {}
    };
    
    this.entityManager.entities.set(entityId, entity);
    
    // Render entity if it has visual properties
    if (entity.visual && data.canvasId) {
      this.renderEntity(data.canvasId, entity);
    }
    
    console.log(`🎯 Created test entity: ${entityId} (${type})`);
    return entityId;
  }

  renderEntity(canvasId, entity) {
    const canvasInfo = this.canvasInstances.get(canvasId);
    if (!canvasInfo || !entity.visual) return;
    
    const element = canvasInfo.element;
    const { shape, color, size } = entity.visual;
    const { x = 50, y = 50 } = entity;
    
    switch (shape) {
      case 'circle':
        this.drawShape(element, { type: 'circle', x, y, radius: size }, 
          { fill: true, fillColor: color });
        break;
      case 'square':
        this.drawShape(element, { type: 'rectangle', x: x - size/2, y: y - size/2, width: size, height: size }, 
          { fill: true, fillColor: color });
        break;
      case 'triangle':
        this.drawShape(element, { type: 'polygon', points: [
          { x, y: y - size },
          { x: x - size, y: y + size },
          { x: x + size, y: y + size }
        ]}, { fill: true, fillColor: color });
        break;
    }
    
    // Add entity to canvas tracking
    canvasInfo.entities.set(entity.id, entity);
  }

  runEntityTest(entityId) {
    const entity = this.entityManager.entities.get(entityId);
    if (!entity) return null;
    
    const testResult = {
      entityId,
      timestamp: Date.now(),
      tests: {},
      passed: 0,
      failed: 0,
      status: 'unknown'
    };
    
    // Run basic tests
    testResult.tests.existence = entity ? 'pass' : 'fail';
    testResult.tests.type = entity.type ? 'pass' : 'fail';
    testResult.tests.visual = entity.visual ? 'pass' : 'fail';
    
    // Count results
    Object.values(testResult.tests).forEach(result => {
      if (result === 'pass') testResult.passed++;
      else testResult.failed++;
    });
    
    testResult.status = testResult.failed === 0 ? 'healthy' : 'degraded';
    
    // Store test results
    entity.testResults = testResult;
    
    console.log(`🧪 Entity test completed: ${entityId} - ${testResult.status}`);
    return testResult;
  }

  verifyEntity(entityId) {
    const entity = this.entityManager.entities.get(entityId);
    if (!entity) return false;
    
    // Verify entity integrity
    const verification = {
      hasId: !!entity.id,
      hasType: !!entity.type,
      hasTimestamp: !!entity.created,
      isActive: entity.status === 'active',
      hasVisual: !!entity.visual
    };
    
    const verified = Object.values(verification).every(check => check);
    entity.verified = verified;
    entity.lastVerification = Date.now();
    
    return verified;
  }

  recordAIInteraction(action, details) {
    this.activeInteractions.add({
      action,
      details,
      timestamp: Date.now(),
      source: 'ai'
    });
  }

  // Analysis methods
  getPixelData(element, x, y) {
    const ctx = element.getContext('2d');
    if (!ctx) return null;
    
    try {
      const imageData = ctx.getImageData(x, y, 1, 1);
      return {
        r: imageData.data[0],
        g: imageData.data[1],
        b: imageData.data[2],
        a: imageData.data[3]
      };
    } catch (error) {
      console.warn('Failed to get pixel data:', error);
      return null;
    }
  }

  analyzeArea(element, x, y, width, height) {
    const ctx = element.getContext('2d');
    if (!ctx) return null;
    
    try {
      const imageData = ctx.getImageData(x, y, width, height);
      const pixels = imageData.data;
      
      let totalR = 0, totalG = 0, totalB = 0;
      let brightest = 0, darkest = 255;
      const pixelCount = pixels.length / 4;
      
      for (let i = 0; i < pixels.length; i += 4) {
        totalR += pixels[i];
        totalG += pixels[i + 1];
        totalB += pixels[i + 2];
        
        const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        brightest = Math.max(brightest, brightness);
        darkest = Math.min(darkest, brightness);
      }
      
      return {
        averageColor: {
          r: Math.round(totalR / pixelCount),
          g: Math.round(totalG / pixelCount),
          b: Math.round(totalB / pixelCount)
        },
        brightness: { average: (totalR + totalG + totalB) / (3 * pixelCount), min: darkest, max: brightest },
        pixelCount,
        area: width * height
      };
    } catch (error) {
      console.warn('Failed to analyze area:', error);
      return null;
    }
  }

  getCanvasStatus(canvasId) {
    const canvasInfo = this.canvasInstances.get(canvasId);
    if (!canvasInfo) return null;
    
    return {
      id: canvasId,
      type: canvasInfo.type,
      active: !!canvasInfo.element,
      bounds: canvasInfo.bounds,
      entities: canvasInfo.entities.size,
      lastUpdate: canvasInfo.lastUpdate,
      tools: Object.keys(canvasInfo.tools)
    };
  }

  getAllCanvasStatuses() {
    const statuses = new Map();
    this.canvasInstances.forEach((info, id) => {
      statuses.set(id, this.getCanvasStatus(id));
    });
    return statuses;
  }

  getInteractionHistory(limit = 100) {
    return this.interactionHistory.slice(-limit);
  }

  ping() {
    return {
      service: 'CanvasInteractionTools',
      status: 'active',
      canvasInstances: this.canvasInstances.size,
      activeEntities: this.entityManager.entities.size,
      tools: Array.from(this.tools.keys()),
      health: this.canvasInstances.size > 0 ? 'healthy' : 'degraded'
    };
  }
}

// Export for use by Master AI Controller
window.CanvasInteractionTools = CanvasInteractionTools;

console.log('✅ Canvas Interaction Tools loaded');
