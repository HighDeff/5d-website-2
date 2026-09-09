/**
 * Screenshot and OCR Service for Master AI Controller
 * Handles negative field monitoring, screenshots every 1s, and OCR processing
 */

console.log('📸 Loading Screenshot OCR Service...');

class ScreenshotOCRService {
  constructor(masterController) {
    this.masterController = masterController;
    this.isActive = false;
    this.screenshotInterval = null;
    this.ocrQueue = [];
    this.canvasElements = new Map();
    this.negativeFieldActive = true;
    this.spiralPreventionActive = false;
    this.screenshotHistory = [];
    this.maxHistorySize = 3600; // 1 hour at 1fps
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Screenshot OCR Service...');

    // Setup canvas detection
    this.detectCanvasElements();

    // Start continuous monitoring
    this.startScreenshotMonitoring();

    // Setup OCR processing
    this.initializeOCR();

    // Setup negative field monitoring
    this.setupNegativeFieldMonitoring();

    console.log('✅ Screenshot OCR Service operational');
  }

  detectCanvasElements() {
    // Find all canvas elements and visualization containers
    const canvases = document.querySelectorAll('canvas');
    const visualContainers = document.querySelectorAll('[id*="canvas"], [class*="visual"], [id*="field"], [class*="field"]');

    canvases.forEach((canvas, index) => {
      this.canvasElements.set(`canvas-${index}`, {
        element: canvas,
        type: 'canvas',
        bounds: canvas.getBoundingClientRect(),
        lastScreenshot: null,
        changes: []
      });
    });

    visualContainers.forEach((container, index) => {
      this.canvasElements.set(`container-${index}`, {
        element: container,
        type: 'container',
        bounds: container.getBoundingClientRect(),
        lastScreenshot: null,
        changes: []
      });
    });

    console.log(`📍 Detected ${this.canvasElements.size} canvas/visual elements`);
  }

  startScreenshotMonitoring() {
    if (this.screenshotInterval) {
      clearInterval(this.screenshotInterval);
    }

    this.isActive = true;
    this.screenshotInterval = setInterval(() => {
      this.captureScreenshots();
    }, 1000); // Every 1 second

    console.log('📸 Screenshot monitoring started (1s interval)');
  }

  stopScreenshotMonitoring() {
    if (this.screenshotInterval) {
      clearInterval(this.screenshotInterval);
      this.screenshotInterval = null;
    }

    this.isActive = false;
    console.log('⏹️ Screenshot monitoring stopped');
  }

  async captureScreenshots() {
    if (!this.isActive) return;

    try {
      const timestamp = Date.now();
      const screenshots = new Map();

      // Capture full screen
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' }
          });

          const video = document.createElement('video');
          video.srcObject = stream;
          await video.play();

          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);

          const fullScreenshot = canvas.toDataURL('image/png');
          screenshots.set('fullscreen', {
            data: fullScreenshot,
            timestamp,
            type: 'fullscreen'
          });

          // Stop the stream
          stream.getTracks().forEach(track => track.stop());

        } catch (error) {
          console.warn('Screen capture not available, falling back to canvas capture');
        }
      }

      // Capture individual canvas elements
      for (const [id, canvasInfo] of this.canvasElements) {
        try {
          const screenshot = await this.captureElement(canvasInfo.element);
          if (screenshot) {
            screenshots.set(id, {
              data: screenshot,
              timestamp,
              type: 'element',
              elementId: id,
              bounds: canvasInfo.bounds
            });

            // Update canvas info
            canvasInfo.lastScreenshot = screenshot;
          }
        } catch (error) {
          console.warn(`Failed to capture ${id}:`, error);
        }
      }

      // Store screenshots
      this.storeScreenshots(screenshots);

      // Process with OCR
      await this.processScreenshotsWithOCR(screenshots);

      // Check for negative field issues
      this.checkNegativeField(screenshots);

    } catch (error) {
      console.error('Screenshot capture error:', error);
      this.masterController.logError('screenshot-service', `Screenshot capture failed: ${error.message}`);
    }
  }

  async captureElement(element) {
    try {
      if (element.tagName === 'CANVAS') {
        return element.toDataURL('image/png');
      } else {
        // Use html2canvas for non-canvas elements
        if (window.html2canvas) {
          const canvas = await html2canvas(element, {
            allowTaint: true,
            useCORS: true,
            scale: 0.5 // Reduce size for performance
          });
          return canvas.toDataURL('image/png');
        } else {
          // Fallback: create a simple representation
          const rect = element.getBoundingClientRect();
          const canvas = document.createElement('canvas');
          canvas.width = rect.width;
          canvas.height = rect.height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#333';
          ctx.font = '12px Arial';
          ctx.fillText(`Element: ${element.tagName}`, 10, 20);
          ctx.fillText(`ID: ${element.id || 'none'}`, 10, 40);
          return canvas.toDataURL('image/png');
        }
      }
    } catch (error) {
      console.warn('Element capture failed:', error);
      return null;
    }
  }

  storeScreenshots(screenshots) {
    const screenshotData = {
      timestamp: Date.now(),
      screenshots: Array.from(screenshots.entries()),
      negativeFieldStatus: this.negativeFieldActive,
      spiralPreventionStatus: this.spiralPreventionActive
    };

    this.screenshotHistory.push(screenshotData);

    // Trim history if too large
    if (this.screenshotHistory.length > this.maxHistorySize) {
      this.screenshotHistory.splice(0, this.screenshotHistory.length - this.maxHistorySize);
    }
  }

  initializeOCR() {
    // Initialize Tesseract.js for OCR processing
    this.ocrWorker = null;

    // Try to load Tesseract.js if available
    if (window.Tesseract) {
      this.ocrWorker = Tesseract.createWorker();
      this.ocrWorker.load();
      this.ocrWorker.loadLanguage('eng');
      this.ocrWorker.initialize('eng');
      console.log('📝 OCR worker initialized');
    } else {
      console.warn('Tesseract.js not available, OCR disabled');
    }
  }

  async processScreenshotsWithOCR(screenshots) {
    if (!this.ocrWorker) return;

    for (const [id, screenshot] of screenshots) {
      try {
        this.ocrQueue.push({
          id,
          data: screenshot.data,
          timestamp: screenshot.timestamp,
          processingStarted: Date.now()
        });

        // Process OCR queue (limit concurrent processing)
        if (this.ocrQueue.length >= 3) {
          await this.processOCRQueue();
        }

      } catch (error) {
        console.warn(`OCR queueing failed for ${id}:`, error);
      }
    }
  }

  async processOCRQueue() {
    if (!this.ocrWorker || this.ocrQueue.length === 0) return;

    const batch = this.ocrQueue.splice(0, 3); // Process in batches of 3

    for (const item of batch) {
      try {
        const { data: { text } } = await this.ocrWorker.recognize(item.data);

        const ocrResult = {
          id: item.id,
          text: text.trim(),
          timestamp: item.timestamp,
          processingTime: Date.now() - item.processingStarted
        };

        // Send OCR results to master controller
        this.masterController.processOCRResult(ocrResult);

        // Check for error messages in OCR text
        this.checkForErrors(ocrResult);

      } catch (error) {
        console.warn(`OCR processing failed for ${item.id}:`, error);
      }
    }
  }

  checkForErrors(ocrResult) {
    const errorKeywords = [
      'error', 'exception', 'failed', 'undefined', 'null',
      'cannot read', 'not a function', 'unexpected token',
      'syntax error', 'reference error', 'type error'
    ];

    const text = ocrResult.text.toLowerCase();
    const foundErrors = errorKeywords.filter(keyword => text.includes(keyword));

    if (foundErrors.length > 0) {
      this.masterController.handleVisualError({
        source: 'ocr',
        elementId: ocrResult.id,
        text: ocrResult.text,
        errors: foundErrors,
        timestamp: ocrResult.timestamp
      });
    }
  }

  setupNegativeFieldMonitoring() {
    // Monitor for negative field patterns and spiraling behavior
    this.negativeFieldPatterns = new Map();
    this.spiralDetection = {
      consecutiveNegatives: 0,
      threshold: 5,
      preventionActive: false
    };

    // Monitor system behavior every 5 seconds
    setInterval(() => {
      this.checkSystemBehavior();
    }, 5000);
  }

  checkNegativeField(screenshots) {
    try {
      // Analyze screenshots for negative field indicators
      for (const [id, screenshot] of screenshots) {
        if (screenshot.type === 'element' && screenshot.data) {
          this.analyzeScreenshotForNegativeField(id, screenshot);
        }
      }

      // Check spiral prevention
      this.checkSpiralPrevention();

    } catch (error) {
      console.error('Negative field check error:', error);
    }
  }

  analyzeScreenshotForNegativeField(elementId, screenshot) {
    // Simple analysis - look for visual patterns that indicate negative behavior
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Analyze pixel patterns
      let darkPixels = 0;
      let totalPixels = pixels.length / 4;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;

        if (brightness < 50) darkPixels++;
      }

      const darkRatio = darkPixels / totalPixels;

      // Check for negative field patterns
      if (darkRatio > 0.8) {
        this.detectNegativeField(elementId, 'high_darkness', darkRatio);
      }

      // Store pattern for trend analysis
      this.negativeFieldPatterns.set(elementId, {
        darkRatio,
        timestamp: Date.now(),
        screenshot: screenshot.data
      });
    };

    img.src = screenshot.data;
  }

  detectNegativeField(elementId, type, severity) {
    console.warn(`🚨 Negative field detected in ${elementId}: ${type} (severity: ${severity})`);

    this.spiralDetection.consecutiveNegatives++;

    if (this.spiralDetection.consecutiveNegatives >= this.spiralDetection.threshold) {
      this.activateSpiralPrevention();
    }

    // Report to master controller
    this.masterController.handleNegativeField({
      elementId,
      type,
      severity,
      timestamp: Date.now(),
      spiralRisk: this.spiralDetection.consecutiveNegatives
    });
  }

  activateSpiralPrevention() {
    if (this.spiralDetection.preventionActive) return;

    console.warn('🌀 Activating spiral prevention measures...');

    this.spiralDetection.preventionActive = true;
    this.spiralPreventionActive = true;

    // Implement spiral prevention strategies
    this.implementSpiralPrevention();

    // Auto-deactivate after 30 seconds
    setTimeout(() => {
      this.deactivateSpiralPrevention();
    }, 30000);
  }

  implementSpiralPrevention() {
    // Strategy 1: Reset visual elements
    this.canvasElements.forEach((canvasInfo, id) => {
      const element = canvasInfo.element;
      if (element.tagName === 'CANVAS') {
        const ctx = element.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, element.width, element.height);
          // Fill with neutral color
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(0, 0, element.width, element.height);
        }
      }
    });

    // Strategy 2: Pause animations
    const animations = document.querySelectorAll('[style*="animation"]');
    animations.forEach(el => {
      el.style.animationPlayState = 'paused';
    });

    // Strategy 3: Reduce visual complexity
    this.reduceVisualComplexity();
  }

  reduceVisualComplexity() {
    // Temporarily simplify visuals to prevent spiraling
    const complexElements = document.querySelectorAll('.particle, .effect, .animation');
    complexElements.forEach(el => {
      el.style.opacity = '0.3';
      el.style.filter = 'blur(2px)';
    });
  }

  deactivateSpiralPrevention() {
    console.log('✅ Deactivating spiral prevention measures...');

    this.spiralDetection.preventionActive = false;
    this.spiralPreventionActive = false;
    this.spiralDetection.consecutiveNegatives = 0;

    // Restore normal visuals
    this.restoreNormalVisuals();
  }

  restoreNormalVisuals() {
    // Resume animations
    const animations = document.querySelectorAll('[style*="animation"]');
    animations.forEach(el => {
      el.style.animationPlayState = 'running';
    });

    // Restore complexity
    const complexElements = document.querySelectorAll('.particle, .effect, .animation');
    complexElements.forEach(el => {
      el.style.opacity = '';
      el.style.filter = '';
    });
  }

  checkSystemBehavior() {
    // Monitor overall system behavior for negative patterns
    const now = Date.now();
    const recentPatterns = Array.from(this.negativeFieldPatterns.values())
      .filter(pattern => now - pattern.timestamp < 30000); // Last 30 seconds

    if (recentPatterns.length > 10) {
      console.warn('⚠️ High frequency negative field activity detected');
      this.masterController.handleSystemAlert({
        type: 'high_negative_activity',
        patterns: recentPatterns.length,
        timestamp: now
      });
    }
  }

  getStatus() {
    return {
      active: this.isActive,
      screenshotsToday: this.screenshotHistory.length,
      negativeFieldActive: this.negativeFieldActive,
      spiralPreventionActive: this.spiralPreventionActive,
      canvasElements: this.canvasElements.size,
      ocrQueueSize: this.ocrQueue.length,
      consecutiveNegatives: this.spiralDetection.consecutiveNegatives
    };
  }

  getSettings() {
    return {
      screenshotInterval: 1000,
      maxHistorySize: this.maxHistorySize,
      spiralThreshold: this.spiralDetection.threshold,
      negativeFieldActive: this.negativeFieldActive
    };
  }

  updateSettings(settings) {
    if (settings.maxHistorySize) {
      this.maxHistorySize = settings.maxHistorySize;
    }

    if (settings.spiralThreshold) {
      this.spiralDetection.threshold = settings.spiralThreshold;
    }

    if (typeof settings.negativeFieldActive === 'boolean') {
      this.negativeFieldActive = settings.negativeFieldActive;
    }

    console.log('⚙️ Screenshot OCR settings updated');
  }

  processExternalData(data) {
    // Process external data sent from other components
    try {
      console.log('📊 Processing external data in Screenshot OCR Service:', data);

      // Store external data for analysis
      if (!this.externalDataLog) {
        this.externalDataLog = [];
      }

      this.externalDataLog.push({
        ...data,
        processed: Date.now()
      });

      // Keep only last 100 entries
      if (this.externalDataLog.length > 100) {
        this.externalDataLog.splice(0, 50);
      }

      // Check if data contains error information
      if (data.errors && data.errors.length > 0) {
        this.processExternalErrors(data.errors);
      }

      // Check for visual anomalies in data
      if (data.type === 'visual_error' || data.type === 'panel_content') {
        this.analyzeExternalVisualData(data);
      }

    } catch (error) {
      console.warn('Error processing external data:', error);
    }
  }

  processExternalErrors(errors) {
    // Process errors from external sources
    errors.forEach(error => {
      if (error.text && typeof error.text === 'string') {
        const ocrResult = {
          id: `external-${Date.now()}`,
          text: error.text,
          timestamp: error.timestamp || Date.now(),
          source: 'external'
        };

        this.masterController.processOCRResult(ocrResult);
      }
    });
  }

  analyzeExternalVisualData(data) {
    // Analyze visual data from external sources
    if (data.content && typeof data.content === 'string') {
      // Check for visual error indicators in content
      const errorIndicators = ['error', 'exception', 'failed', 'undefined', 'null'];
      const foundIndicators = errorIndicators.filter(indicator =>
        data.content.toLowerCase().includes(indicator)
      );

      if (foundIndicators.length > 0) {
        this.masterController.handleVisualError({
          source: 'external_visual',
          text: data.content,
          indicators: foundIndicators,
          timestamp: Date.now()
        });
      }
    }
  }

  ping() {
    return {
      service: 'ScreenshotOCRService',
      status: this.isActive ? 'active' : 'inactive',
      lastCapture: this.screenshotHistory.length > 0 ?
        this.screenshotHistory[this.screenshotHistory.length - 1].timestamp : null,
      health: this.isActive && this.canvasElements.size > 0 ? 'healthy' : 'degraded',
      metrics: this.getStatus()
    };
  }
}

// Export for use by Master AI Controller
window.ScreenshotOCRService = ScreenshotOCRService;

console.log('✅ Screenshot OCR Service loaded');
