/**
 * Enhanced Canvas Viewer with Negative Field Detection and Movement
 * Detects anomalies and provides interactive canvas visualization
 */

console.log('🎯 Loading Enhanced Canvas Viewer...');

class EnhancedCanvasViewer {
  constructor(masterController) {
    this.masterController = masterController;
    this.canvasElements = new Map();
    this.anomalies = new Map();
    this.fieldData = new Map();
    this.movementTracking = new Map();
    this.viewerCanvas = null;
    this.isActive = false;
    this.animationFrame = null;
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Enhanced Canvas Viewer...');

    try {
      // Setup canvas detection
      this.detectAllCanvases();

      // Create viewer interface
      this.createViewerInterface();

      // Setup anomaly detection
      this.setupAnomalyDetection();

      // Setup movement tracking
      this.setupMovementTracking();

      // Setup storage with error handling
      this.setupStorage();

      // Start monitoring
      this.startMonitoring();

      console.log('✅ Enhanced Canvas Viewer operational');
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced Canvas Viewer:', error);
      // Continue with basic functionality
      this.isActive = true;
    }
  }

  setupStorage() {
    // Setup storage for patterns and anomalies with fallback
    try {
      // Try to use localStorage as fallback for IndexedDB
      this.storageAvailable = true;
      this.storageType = 'localStorage';
      console.log('📦 Using localStorage for pattern storage');
    } catch (error) {
      console.warn('⚠️ Storage not available, using memory only:', error);
      this.storageAvailable = false;
      this.storageType = 'memory';
    }
  }

  savePatternData(key, data) {
    if (!this.storageAvailable) return;

    try {
      if (this.storageType === 'localStorage') {
        localStorage.setItem(`canvasViewer_${key}`, JSON.stringify(data));
      }
    } catch (error) {
      console.warn('Failed to save pattern data:', error);
    }
  }

  loadPatternData(key) {
    if (!this.storageAvailable) return null;

    try {
      if (this.storageType === 'localStorage') {
        const data = localStorage.getItem(`canvasViewer_${key}`);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.warn('Failed to load pattern data:', error);
    }

    return null;
  }

  detectAllCanvases() {
    // Find all canvas elements in the DOM
    const canvases = document.querySelectorAll('canvas');
    const containers = document.querySelectorAll('[id*="canvas"], [class*="canvas"], [data-canvas]');

    canvases.forEach((canvas, index) => {
      this.registerCanvas(canvas, `canvas-${index}`, 'html5-canvas');
    });

    containers.forEach((container, index) => {
      this.registerCanvas(container, `container-${index}`, 'container');
    });

    console.log(`🎯 Detected ${this.canvasElements.size} canvas elements`);
  }

  registerCanvas(element, id, type) {
    const bounds = element.getBoundingClientRect();

    const canvasData = {
      id,
      element,
      type,
      bounds,
      context: this.getCanvasContext(element, type),
      anomalies: [],
      movements: [],
      fieldData: new Map(),
      lastScan: Date.now(),
      active: true
    };

    this.canvasElements.set(id, canvasData);
    this.setupCanvasMonitoring(canvasData);
  }

  getCanvasContext(element, type) {
    if (type === 'html5-canvas') {
      try {
        return element.getContext('2d') || element.getContext('webgl');
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  setupCanvasMonitoring(canvasData) {
    // Monitor for changes in the canvas
    if (canvasData.type === 'html5-canvas') {
      // Store original drawing methods to detect changes
      this.wrapCanvasContext(canvasData);
    }

    // Monitor DOM changes
    const observer = new MutationObserver(() => {
      this.onCanvasChange(canvasData.id);
    });

    observer.observe(canvasData.element, {
      attributes: true,
      childList: true,
      subtree: true
    });

    canvasData.observer = observer;
  }

  wrapCanvasContext(canvasData) {
    try {
      const ctx = canvasData.context;
      if (!ctx) return;

      // Wrap drawing methods to detect activity
      const originalMethods = ['fillRect', 'strokeRect', 'drawImage', 'fillText', 'strokeText'];

      originalMethods.forEach(method => {
        if (ctx[method] && typeof ctx[method] === 'function') {
          try {
            const original = ctx[method].bind(ctx);
            ctx[method] = (...args) => {
              try {
                this.onDrawingActivity(canvasData.id, method, args);
              } catch (error) {
                console.warn(`Error tracking ${method} activity:`, error);
              }
              return original(...args);
            };
          } catch (error) {
            console.warn(`Failed to wrap ${method} method:`, error);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to wrap canvas context:', error);
    }
  }

  onDrawingActivity(canvasId, method, args) {
    const canvasData = this.canvasElements.get(canvasId);
    if (!canvasData) return;

    const activity = {
      method,
      args,
      timestamp: Date.now()
    };

    canvasData.movements.push(activity);

    // Check for anomalous patterns
    this.checkDrawingAnomalies(canvasId, activity);

    // Limit movement history
    if (canvasData.movements.length > 100) {
      canvasData.movements.splice(0, 50);
    }
  }

  checkDrawingAnomalies(canvasId, activity) {
    const canvasData = this.canvasElements.get(canvasId);
    if (!canvasData) return;

    const recentActivities = canvasData.movements.slice(-10);
    const currentTime = Date.now();

    // Check for rapid drawing (too many operations in short time)
    const rapidActivities = recentActivities.filter(a =>
      currentTime - a.timestamp < 1000 // Last second
    );

    if (rapidActivities.length > 20) {
      this.addAnomaly(canvasId, 'rapid_drawing', {
        type: 'rapid_drawing',
        count: rapidActivities.length,
        method: activity.method,
        severity: 'medium',
        description: `Rapid drawing detected: ${rapidActivities.length} operations in 1 second`
      });
    }

    // Check for repetitive patterns
    const methodCounts = {};
    recentActivities.forEach(a => {
      methodCounts[a.method] = (methodCounts[a.method] || 0) + 1;
    });

    Object.entries(methodCounts).forEach(([method, count]) => {
      if (count > 15) { // Same method called too many times
        this.addAnomaly(canvasId, 'repetitive_drawing', {
          type: 'repetitive_drawing',
          method,
          count,
          severity: 'low',
          description: `Repetitive ${method} calls: ${count} times`
        });
      }
    });

    // Check for suspicious argument patterns
    if (activity.args && activity.args.length > 0) {
      const suspiciousArgs = this.checkSuspiciousArgs(activity.args);
      if (suspiciousArgs) {
        this.addAnomaly(canvasId, 'suspicious_args', {
          type: 'suspicious_args',
          method: activity.method,
          args: activity.args,
          severity: 'low',
          description: `Suspicious arguments in ${activity.method}`
        });
      }
    }
  }

  checkSuspiciousArgs(args) {
    // Check for extremely large values or NaN/Infinity
    return args.some(arg => {
      if (typeof arg === 'number') {
        return !isFinite(arg) || Math.abs(arg) > 10000;
      }
      return false;
    });
  }

  onCanvasChange(canvasId) {
    const canvasData = this.canvasElements.get(canvasId);
    if (!canvasData) return;

    // Trigger anomaly detection
    this.detectAnomalies(canvasId);

    // Update movement tracking
    this.updateMovementTracking(canvasId);
  }

  updateMovementTracking(canvasId) {
    const canvasData = this.canvasElements.get(canvasId);
    if (!canvasData) return;

    const currentTime = Date.now();

    // Update movement tracking data
    if (!this.movementTracking.has(canvasId)) {
      this.movementTracking.set(canvasId, {
        lastUpdate: currentTime,
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        pattern: 'unknown',
        history: []
      });
    }

    const tracking = this.movementTracking.get(canvasId);

    // Add current state to history
    tracking.history.push({
      timestamp: currentTime,
      movements: canvasData.movements.length,
      anomalies: canvasData.anomalies.length
    });

    // Limit history size
    if (tracking.history.length > 50) {
      tracking.history.splice(0, 25);
    }

    // Analyze movement pattern
    if (tracking.history.length >= 3) {
      tracking.pattern = this.analyzeMovementPattern(tracking.history);
    }

    tracking.lastUpdate = currentTime;
  }

  createViewerInterface() {
    this.viewerContainer = document.createElement('div');
    this.viewerContainer.id = 'enhanced-canvas-viewer';
    this.viewerContainer.style.display = 'none';
    this.viewerContainer.innerHTML = this.getViewerHTML();

    document.body.appendChild(this.viewerContainer);

    // Create the main viewer canvas
    this.createViewerCanvas();
  }

  getViewerHTML() {
    return `
      <div style="
        position: fixed;
        top: 50px;
        left: 50px;
        width: 80%;
        height: 80%;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #10b981;
        border-radius: 12px;
        z-index: 10001;
        color: white;
        display: flex;
        flex-direction: column;
      ">
        <div style="padding: 15px; border-bottom: 1px solid #10b981; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: #10b981; font-size: 18px;">🎯 Enhanced Canvas Viewer</h3>
          <div>
            <button onclick="window.enhancedCanvasViewer.toggleScanning()" id="scan-toggle"
                    style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
              🔍 Start Scanning
            </button>
            <button onclick="window.enhancedCanvasViewer.clearAnomalies()"
                    style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
              🧹 Clear Anomalies
            </button>
            <button onclick="window.enhancedCanvasViewer.closeViewer()"
                    style="background: none; border: none; color: #10b981; cursor: pointer; font-size: 20px;">×</button>
          </div>
        </div>

        <div style="display: flex; flex: 1; overflow: hidden;">
          <!-- Canvas List Sidebar -->
          <div style="width: 250px; border-right: 1px solid #10b981; padding: 15px; overflow-y: auto;">
            <h4 style="margin: 0 0 10px 0; color: #ffffff;">📋 Canvas Elements</h4>
            <div id="canvas-list"></div>

            <h4 style="margin: 20px 0 10px 0; color: #ef4444;">🚨 Anomalies</h4>
            <div id="anomaly-list"></div>

            <h4 style="margin: 20px 0 10px 0; color: #8b5cf6;">📊 Field Data</h4>
            <div id="field-data-list"></div>
          </div>

          <!-- Main Viewer Area -->
          <div style="flex: 1; padding: 15px; display: flex; flex-direction: column;">
            <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center;">
              <select id="canvas-selector" onchange="window.enhancedCanvasViewer.selectCanvas(this.value)"
                      style="background: rgba(255,255,255,0.1); border: 1px solid #555; border-radius: 4px; color: white; padding: 6px;">
                <option value="">Select Canvas...</option>
              </select>
              <button onclick="window.enhancedCanvasViewer.detectAnomalies()"
                      style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                🔍 Detect Anomalies
              </button>
              <button onclick="window.enhancedCanvasViewer.showMovement()"
                      style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                🏃 Show Movement
              </button>
              <button onclick="window.enhancedCanvasViewer.analyzeField()"
                      style="background: #8b5cf6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                📊 Analyze Field
              </button>
            </div>

            <div style="flex: 1; background: rgba(255,255,255,0.05); border-radius: 8px; position: relative; overflow: hidden;">
              <canvas id="viewer-canvas" style="width: 100%; height: 100%;"></canvas>
              <div id="viewer-overlay" style="position: absolute; top: 10px; left: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 4px; font-size: 12px; color: white;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createViewerCanvas() {
    this.viewerCanvas = document.getElementById('viewer-canvas');
    this.viewerCtx = this.viewerCanvas.getContext('2d');

    // Set canvas size
    this.resizeViewerCanvas();

    // Handle resize
    window.addEventListener('resize', () => this.resizeViewerCanvas());
  }

  resizeViewerCanvas() {
    if (!this.viewerCanvas) return;

    const container = this.viewerCanvas.parentElement;
    const rect = container.getBoundingClientRect();

    this.viewerCanvas.width = rect.width;
    this.viewerCanvas.height = rect.height;
  }

  setupAnomalyDetection() {
    this.anomalyDetectors = new Map([
      ['rapid_changes', this.detectRapidChanges.bind(this)],
      ['negative_field', this.detectNegativeField.bind(this)],
      ['infinite_loops', this.detectInfiniteLoops.bind(this)],
      ['memory_leaks', this.detectMemoryLeaks.bind(this)],
      ['visual_artifacts', this.detectVisualArtifacts.bind(this)],
      ['movement_anomalies', this.detectMovementAnomalies.bind(this)]
    ]);

    this.anomalyThresholds = {
      rapidChanges: 10, // changes per second
      negativeField: 0.8, // darkness ratio
      loopDetection: 50, // iterations
      memoryGrowth: 10, // MB growth
      artifactDensity: 0.3 // artifact ratio
    };
  }

  setupMovementTracking() {
    this.movementTypes = [
      'linear', 'circular', 'spiral', 'random', 'oscillating', 'static'
    ];

    this.movementAnalyzer = {
      analyzePattern: (movements) => this.analyzeMovementPattern(movements),
      detectSpiral: (movements) => this.detectSpiralMovement(movements),
      predictNext: (movements) => this.predictNextMovement(movements)
    };
  }

  startMonitoring() {
    if (this.isActive) return;

    this.isActive = true;
    this.monitoringLoop();

    console.log('🔄 Canvas monitoring started');
  }

  stopMonitoring() {
    this.isActive = false;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    console.log('⏹️ Canvas monitoring stopped');
  }

  monitoringLoop() {
    if (!this.isActive) return;

    // Scan all canvases for anomalies
    this.canvasElements.forEach((canvasData, id) => {
      if (canvasData.active) {
        this.scanCanvas(id);
      }
    });

    // Update viewer display
    this.updateViewerDisplay();

    this.animationFrame = requestAnimationFrame(() => this.monitoringLoop());
  }

  scanCanvas(canvasId) {
    const canvasData = this.canvasElements.get(canvasId);
    if (!canvasData) return;

    // Run all anomaly detectors
    this.anomalyDetectors.forEach((detector, type) => {
      try {
        const anomaly = detector(canvasData);
        if (anomaly) {
          this.addAnomaly(canvasId, type, anomaly);
        }
      } catch (error) {
        console.warn(`Anomaly detector ${type} failed:`, error);
      }
    });

    canvasData.lastScan = Date.now();
  }

  detectRapidChanges(canvasData) {
    const recentMovements = canvasData.movements.filter(m =>
      Date.now() - m.timestamp < 1000 // Last second
    );

    if (recentMovements.length > this.anomalyThresholds.rapidChanges) {
      return {
        type: 'rapid_changes',
        count: recentMovements.length,
        threshold: this.anomalyThresholds.rapidChanges,
        severity: 'medium',
        description: `${recentMovements.length} changes in 1 second`
      };
    }

    return null;
  }

  detectNegativeField(canvasData) {
    if (canvasData.type !== 'html5-canvas' || !canvasData.context) return null;

    try {
      const canvas = canvasData.element;
      const ctx = canvasData.context;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let darkPixels = 0;
      const totalPixels = pixels.length / 4;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;

        if (brightness < 50) darkPixels++;
      }

      const darkRatio = darkPixels / totalPixels;

      if (darkRatio > this.anomalyThresholds.negativeField) {
        return {
          type: 'negative_field',
          darkRatio,
          threshold: this.anomalyThresholds.negativeField,
          severity: 'high',
          description: `${(darkRatio * 100).toFixed(1)}% dark pixels detected`
        };
      }
    } catch (error) {
      // Canvas might be tainted or inaccessible
      return null;
    }

    return null;
  }

  detectInfiniteLoops(canvasData) {
    // Look for repetitive patterns in movements
    const recentMovements = canvasData.movements.slice(-this.anomalyThresholds.loopDetection);

    if (recentMovements.length < 10) return null;

    // Check for repeating sequences
    const sequences = this.findRepeatingSequences(recentMovements);

    if (sequences.length > 0) {
      return {
        type: 'infinite_loops',
        sequences: sequences.length,
        severity: 'high',
        description: `${sequences.length} repeating sequences detected`
      };
    }

    return null;
  }

  findRepeatingSequences(movements) {
    const sequences = [];
    const sequenceLength = 5;

    for (let i = 0; i <= movements.length - sequenceLength * 2; i++) {
      const sequence1 = movements.slice(i, i + sequenceLength);
      const sequence2 = movements.slice(i + sequenceLength, i + sequenceLength * 2);

      if (this.arraysEqual(sequence1, sequence2)) {
        sequences.push({ start: i, length: sequenceLength });
      }
    }

    return sequences;
  }

  arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  detectMemoryLeaks(canvasData) {
    // Monitor canvas memory usage (approximation)
    const canvas = canvasData.element;
    if (!canvas) return null;

    const currentMemory = canvas.width * canvas.height * 4; // RGBA
    const previousMemory = canvasData.lastMemory || currentMemory;

    canvasData.lastMemory = currentMemory;

    const memoryGrowth = (currentMemory - previousMemory) / (1024 * 1024); // MB

    if (memoryGrowth > this.anomalyThresholds.memoryGrowth) {
      return {
        type: 'memory_leaks',
        growth: memoryGrowth,
        threshold: this.anomalyThresholds.memoryGrowth,
        severity: 'medium',
        description: `${memoryGrowth.toFixed(1)}MB memory growth detected`
      };
    }

    return null;
  }

  detectVisualArtifacts(canvasData) {
    if (canvasData.type !== 'html5-canvas' || !canvasData.context) return null;

    try {
      const canvas = canvasData.element;
      const ctx = canvasData.context;

      // Sample pixels to detect artifacts
      const samplePoints = this.generateSamplePoints(canvas.width, canvas.height, 100);
      const artifacts = [];

      samplePoints.forEach(point => {
        const imageData = ctx.getImageData(point.x, point.y, 1, 1);
        const pixel = imageData.data;

        // Check for unusual color patterns
        if (this.isArtifactPixel(pixel)) {
          artifacts.push(point);
        }
      });

      const artifactRatio = artifacts.length / samplePoints.length;

      if (artifactRatio > this.anomalyThresholds.artifactDensity) {
        return {
          type: 'visual_artifacts',
          ratio: artifactRatio,
          threshold: this.anomalyThresholds.artifactDensity,
          severity: 'low',
          description: `${(artifactRatio * 100).toFixed(1)}% visual artifacts detected`
        };
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  generateSamplePoints(width, height, count) {
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      });
    }
    return points;
  }

  isArtifactPixel(pixel) {
    const [r, g, b, a] = pixel;

    // Check for extreme values or unusual patterns
    const extreme = r === 0 && g === 0 && b === 0 && a === 255; // Pure black
    const unusual = Math.abs(r - g) > 200 || Math.abs(g - b) > 200 || Math.abs(r - b) > 200;

    return extreme || unusual;
  }

  detectMovementAnomalies(canvasData) {
    if (canvasData.movements.length < 10) return null;

    const pattern = this.analyzeMovementPattern(canvasData.movements);

    if (pattern.anomaly) {
      return {
        type: 'movement_anomalies',
        pattern: pattern.type,
        severity: pattern.severity,
        description: pattern.description
      };
    }

    return null;
  }

  analyzeMovementPattern(movements) {
    const recentMovements = movements.slice(-20);

    // Analyze movement characteristics
    const characteristics = {
      speed: this.calculateMovementSpeed(recentMovements),
      direction: this.calculateMovementDirection(recentMovements),
      consistency: this.calculateMovementConsistency(recentMovements)
    };

    // Detect anomalous patterns
    if (characteristics.speed > 1000) { // Very fast movement
      return {
        type: 'rapid',
        anomaly: true,
        severity: 'high',
        description: 'Extremely rapid movement detected'
      };
    }

    if (characteristics.consistency < 0.1) { // Very erratic
      return {
        type: 'erratic',
        anomaly: true,
        severity: 'medium',
        description: 'Erratic movement pattern detected'
      };
    }

    return {
      type: 'normal',
      anomaly: false,
      characteristics
    };
  }

  calculateMovementSpeed(movements) {
    if (movements.length < 2) return 0;

    let totalDistance = 0;
    let totalTime = 0;

    for (let i = 1; i < movements.length; i++) {
      const prev = movements[i - 1];
      const curr = movements[i];

      const timeDiff = curr.timestamp - prev.timestamp;
      if (timeDiff > 0) {
        totalTime += timeDiff;
        totalDistance += 1; // Simplified distance
      }
    }

    return totalTime > 0 ? totalDistance / totalTime * 1000 : 0; // movements per second
  }

  calculateMovementDirection(movements) {
    // Simplified direction calculation
    return movements.length > 0 ? 'variable' : 'none';
  }

  calculateMovementConsistency(movements) {
    if (movements.length < 3) return 1;

    // Calculate consistency based on time intervals
    const intervals = [];
    for (let i = 1; i < movements.length; i++) {
      intervals.push(movements[i].timestamp - movements[i - 1].timestamp);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) =>
      sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;

    return 1 / (1 + variance / 1000); // Normalized consistency score
  }

  addAnomaly(canvasId, type, anomaly) {
    try {
      const anomalyData = {
        id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        canvasId,
        type,
        ...anomaly,
        timestamp: Date.now(),
        resolved: false
      };

      this.anomalies.set(anomalyData.id, anomalyData);

      // Save anomaly data if storage is available
      this.savePatternData(`anomaly_${anomalyData.id}`, anomalyData);

      // Notify master controller with error handling
      try {
        if (this.masterController && typeof this.masterController.handleCanvasAnomaly === 'function') {
          this.masterController.handleCanvasAnomaly(anomalyData);
        }
      } catch (error) {
        console.warn('Failed to notify master controller of anomaly:', error);
      }

      console.log(`🚨 Anomaly detected: ${type} in ${canvasId}`, anomaly);
    } catch (error) {
      console.error('Failed to add anomaly:', error);
    }
  }

  showViewer() {
    this.viewerContainer.style.display = 'block';
    this.updateCanvasList();
    this.updateAnomalyList();
    this.resizeViewerCanvas();
  }

  closeViewer() {
    this.viewerContainer.style.display = 'none';
  }

  toggleScanning() {
    const button = document.getElementById('scan-toggle');

    if (this.isActive) {
      this.stopMonitoring();
      button.textContent = '🔍 Start Scanning';
      button.style.background = '#3b82f6';
    } else {
      this.startMonitoring();
      button.textContent = '⏹️ Stop Scanning';
      button.style.background = '#ef4444';
    }
  }

  clearAnomalies() {
    this.anomalies.clear();
    this.updateAnomalyList();
    console.log('🧹 All anomalies cleared');
  }

  updateCanvasList() {
    const listElement = document.getElementById('canvas-list');
    const selectorElement = document.getElementById('canvas-selector');

    if (!listElement || !selectorElement) return;

    const canvasHTML = Array.from(this.canvasElements.entries()).map(([id, data]) => `
      <div style="padding: 6px; margin: 2px 0; background: rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer;"
           onclick="window.enhancedCanvasViewer.selectCanvas('${id}')">
        <div style="font-weight: bold; font-size: 11px;">${id}</div>
        <div style="font-size: 10px; color: #ccc;">${data.type} | ${data.anomalies.length} anomalies</div>
      </div>
    `).join('');

    const selectorHTML = Array.from(this.canvasElements.entries()).map(([id, data]) =>
      `<option value="${id}">${id} (${data.type})</option>`
    ).join('');

    listElement.innerHTML = canvasHTML;
    selectorElement.innerHTML = '<option value="">Select Canvas...</option>' + selectorHTML;
  }

  updateAnomalyList() {
    const listElement = document.getElementById('anomaly-list');
    if (!listElement) return;

    const anomalyHTML = Array.from(this.anomalies.values()).map(anomaly => `
      <div style="padding: 6px; margin: 2px 0; background: rgba(239, 68, 68, 0.2); border-radius: 4px; border-left: 3px solid #ef4444;">
        <div style="font-weight: bold; font-size: 11px; color: #ef4444;">${anomaly.type}</div>
        <div style="font-size: 10px; color: #ccc;">${anomaly.description}</div>
        <div style="font-size: 9px; color: #888;">${new Date(anomaly.timestamp).toLocaleTimeString()}</div>
      </div>
    `).join('');

    listElement.innerHTML = anomalyHTML || '<div style="color: #666; font-size: 11px;">No anomalies detected</div>';
  }

  selectCanvas(canvasId) {
    if (!canvasId) return;

    const canvasData = this.canvasElements.get(canvasId);
    if (!canvasData) return;

    this.currentCanvas = canvasId;
    this.renderCanvasView(canvasData);
  }

  renderCanvasView(canvasData) {
    if (!this.viewerCtx) return;

    // Clear viewer canvas
    this.viewerCtx.clearRect(0, 0, this.viewerCanvas.width, this.viewerCanvas.height);

    // Draw canvas representation
    this.drawCanvasRepresentation(canvasData);

    // Draw anomalies
    this.drawAnomalies(canvasData);

    // Update overlay info
    this.updateViewerOverlay(canvasData);
  }

  drawCanvasRepresentation(canvasData) {
    const ctx = this.viewerCtx;
    const canvas = this.viewerCanvas;

    // Draw canvas outline
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Draw canvas content if available
    if (canvasData.type === 'html5-canvas' && canvasData.element) {
      try {
        ctx.drawImage(canvasData.element, 50, 50, canvas.width - 100, canvas.height - 100);
      } catch (error) {
        // Canvas might be tainted, draw placeholder
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Canvas Content Protected', canvas.width / 2, canvas.height / 2);
      }
    }
  }

  drawAnomalies(canvasData) {
    const ctx = this.viewerCtx;

    // Draw anomaly indicators
    this.anomalies.forEach(anomaly => {
      if (anomaly.canvasId === canvasData.id) {
        this.drawAnomalyIndicator(ctx, anomaly);
      }
    });
  }

  drawAnomalyIndicator(ctx, anomaly) {
    const x = 100 + Math.random() * (this.viewerCanvas.width - 200);
    const y = 100 + Math.random() * (this.viewerCanvas.height - 200);

    // Draw anomaly marker
    ctx.fillStyle = this.getAnomalySeverityColor(anomaly.severity);
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw pulse effect
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 12 + Math.sin(Date.now() / 200) * 4, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw label
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(anomaly.type.replace('_', ' ').toUpperCase(), x, y - 20);
  }

  getAnomalySeverityColor(severity) {
    const colors = {
      'low': '#f59e0b',
      'medium': '#ef4444',
      'high': '#dc2626'
    };
    return colors[severity] || '#6b7280';
  }

  updateViewerOverlay(canvasData) {
    const overlayElement = document.getElementById('viewer-overlay');
    if (!overlayElement) return;

    const anomalyCount = Array.from(this.anomalies.values())
      .filter(a => a.canvasId === canvasData.id).length;

    overlayElement.innerHTML = `
      <strong>${canvasData.id}</strong> | Type: ${canvasData.type} |
      Anomalies: ${anomalyCount} |
      Movements: ${canvasData.movements.length} |
      Last Scan: ${new Date(canvasData.lastScan).toLocaleTimeString()}
    `;
  }

  detectAnomalies(canvasId = null) {
    if (canvasId) {
      this.scanCanvas(canvasId);
    } else {
      this.canvasElements.forEach((_, id) => this.scanCanvas(id));
    }

    this.updateAnomalyList();
    console.log('🔍 Anomaly detection completed');
  }

  showMovement() {
    if (!this.currentCanvas) return;

    const canvasData = this.canvasElements.get(this.currentCanvas);
    if (!canvasData) return;

    this.renderMovementVisualization(canvasData);
  }

  renderMovementVisualization(canvasData) {
    const ctx = this.viewerCtx;

    // Clear and redraw base
    this.renderCanvasView(canvasData);

    // Draw movement trails
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const movements = canvasData.movements.slice(-50); // Last 50 movements

    for (let i = 1; i < movements.length; i++) {
      const prev = movements[i - 1];
      const curr = movements[i];

      // Simplified movement visualization
      const x1 = 100 + (i - 1) * 10;
      const y1 = 200 + Math.sin(prev.timestamp / 1000) * 50;
      const x2 = 100 + i * 10;
      const y2 = 200 + Math.sin(curr.timestamp / 1000) * 50;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }

  analyzeField() {
    if (!this.currentCanvas) return;

    const canvasData = this.canvasElements.get(this.currentCanvas);
    if (!canvasData) return;

    const analysis = this.performFieldAnalysis(canvasData);
    this.displayFieldAnalysis(analysis);
  }

  performFieldAnalysis(canvasData) {
    return {
      canvasId: canvasData.id,
      type: canvasData.type,
      anomalyCount: this.anomalies.size,
      movementPattern: this.analyzeMovementPattern(canvasData.movements),
      fieldStrength: this.calculateFieldStrength(canvasData),
      recommendations: this.generateRecommendations(canvasData)
    };
  }

  calculateFieldStrength(canvasData) {
    // Simplified field strength calculation
    const anomalyFactor = this.anomalies.size * 0.1;
    const movementFactor = canvasData.movements.length * 0.01;

    return Math.min(1, anomalyFactor + movementFactor);
  }

  generateRecommendations(canvasData) {
    const recommendations = [];

    if (this.anomalies.size > 5) {
      recommendations.push('High anomaly count - consider system reset');
    }

    if (canvasData.movements.length > 100) {
      recommendations.push('High activity - monitor for performance issues');
    }

    if (recommendations.length === 0) {
      recommendations.push('Canvas operating normally');
    }

    return recommendations;
  }

  displayFieldAnalysis(analysis) {
    const message = `
Field Analysis: ${analysis.canvasId}

Type: ${analysis.type}
Anomalies: ${analysis.anomalyCount}
Movement Pattern: ${analysis.movementPattern.type}
Field Strength: ${(analysis.fieldStrength * 100).toFixed(1)}%

Recommendations:
${analysis.recommendations.map(r => `• ${r}`).join('\n')}
    `;

    alert(message);
  }

  updateViewerDisplay() {
    if (this.viewerContainer.style.display === 'none') return;

    this.updateCanvasList();
    this.updateAnomalyList();

    if (this.currentCanvas) {
      const canvasData = this.canvasElements.get(this.currentCanvas);
      if (canvasData) {
        this.updateViewerOverlay(canvasData);
      }
    }
  }

  getStatus() {
    return {
      canvasCount: this.canvasElements.size,
      anomalyCount: this.anomalies.size,
      isActive: this.isActive,
      currentCanvas: this.currentCanvas,
      lastScan: Math.max(...Array.from(this.canvasElements.values()).map(c => c.lastScan))
    };
  }

  ping() {
    return {
      service: 'EnhancedCanvasViewer',
      status: this.isActive ? 'active' : 'inactive',
      canvases: this.canvasElements.size,
      anomalies: this.anomalies.size,
      health: this.canvasElements.size > 0 ? 'healthy' : 'no_canvases'
    };
  }
}

// Export for use by Master AI Controller
window.EnhancedCanvasViewer = EnhancedCanvasViewer;

console.log('✅ Enhanced Canvas Viewer loaded');
