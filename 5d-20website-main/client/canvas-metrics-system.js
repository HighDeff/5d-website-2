/**
 * Enhanced Canvas Metrics and Data Packet System
 * Adds detailed metrics, packet names, sizes, timestamps to behavior analyst and navigation inspector canvases
 */

console.log('📊 Loading Canvas Metrics System...');

class CanvasMetricsSystem {
  constructor() {
    this.metrics = new Map();
    this.dataPackets = new Map();
    this.behaviorData = new Map();
    this.navigationData = new Map();
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Canvas Metrics System...');

    // Setup metrics for different canvas types
    this.setupBehaviorAnalystMetrics();
    this.setupNavigationInspectorMetrics();
    this.setupDataPacketSystem();
    this.setupMetricsDisplay();

    console.log('✅ Canvas Metrics System operational');
  }

  setupBehaviorAnalystMetrics() {
    const behaviorCanvas = document.querySelector('[data-canvas-type="behavior-analyst"], #behavior-analyst-canvas') ||
                          document.querySelector('canvas[id*="behavior"]');

    if (behaviorCanvas) {
      console.log('📊 Setting up Behavior Analyst metrics...');

      const metrics = {
        canvasId: behaviorCanvas.id || 'behavior-analyst',
        type: 'behavior-analyst',
        packets: [
          { name: 'USER_CLICK_EVENT', size: '2.4KB', frequency: 'High', timestamp: new Date(), color: '#ff6b6b' },
          { name: 'MOUSE_MOVEMENT', size: '1.2KB', frequency: 'Very High', timestamp: new Date(), color: '#4ecdc4' },
          { name: 'SCROLL_BEHAVIOR', size: '1.8KB', frequency: 'Medium', timestamp: new Date(), color: '#45b7d1' },
          { name: 'KEY_PRESS_PATTERN', size: '3.1KB', frequency: 'Medium', timestamp: new Date(), color: '#96ceb4' },
          { name: 'FOCUS_CHANGE', size: '1.5KB', frequency: 'Low', timestamp: new Date(), color: '#feca57' },
          { name: 'FORM_INTERACTION', size: '4.2KB', frequency: 'Low', timestamp: new Date(), color: '#ff9ff3' },
          { name: 'NAVIGATION_INTENT', size: '2.8KB', frequency: 'Medium', timestamp: new Date(), color: '#54a0ff' }
        ],
        analytics: {
          totalEvents: 0,
          averageResponseTime: 0,
          userEngagement: 0,
          behaviorPatterns: []
        }
      };

      this.metrics.set('behavior-analyst', metrics);
      this.startBehaviorTracking(behaviorCanvas, metrics);
    }
  }

  setupNavigationInspectorMetrics() {
    const navCanvas = document.querySelector('[data-canvas-type="navigation-inspector"], #navigation-inspector-canvas') ||
                     document.querySelector('canvas[id*="navigation"]');

    if (navCanvas) {
      console.log('🧭 Setting up Navigation Inspector metrics...');

      const metrics = {
        canvasId: navCanvas.id || 'navigation-inspector',
        type: 'navigation-inspector',
        packets: [
          { name: 'ROUTE_CHANGE', size: '3.7KB', frequency: 'Medium', timestamp: new Date(), color: '#ff6b6b' },
          { name: 'PAGE_LOAD_EVENT', size: '5.2KB', frequency: 'Low', timestamp: new Date(), color: '#4ecdc4' },
          { name: 'LINK_HOVER', size: '1.1KB', frequency: 'High', timestamp: new Date(), color: '#45b7d1' },
          { name: 'BACK_FORWARD', size: '2.3KB', frequency: 'Low', timestamp: new Date(), color: '#96ceb4' },
          { name: 'BOOKMARK_ACTION', size: '1.9KB', frequency: 'Very Low', timestamp: new Date(), color: '#feca57' },
          { name: 'SEARCH_QUERY', size: '4.8KB', frequency: 'Medium', timestamp: new Date(), color: '#ff9ff3' },
          { name: 'TAB_SWITCH', size: '2.1KB', frequency: 'High', timestamp: new Date(), color: '#54a0ff' },
          { name: 'BREADCRUMB_CLICK', size: '1.6KB', frequency: 'Low', timestamp: new Date(), color: '#5f27cd' }
        ],
        analytics: {
          totalNavigations: 0,
          averageLoadTime: 0,
          bounceRate: 0,
          navigationPatterns: []
        }
      };

      this.metrics.set('navigation-inspector', metrics);
      this.startNavigationTracking(navCanvas, metrics);
    }
  }

  setupDataPacketSystem() {
    // Create data packet generators for various activities
    this.packetGenerators = {
      behavior: this.generateBehaviorPackets.bind(this),
      navigation: this.generateNavigationPackets.bind(this),
      interaction: this.generateInteractionPackets.bind(this),
      performance: this.generatePerformancePackets.bind(this)
    };

    // Start packet generation
    setInterval(() => {
      this.generateAllPackets();
    }, 2000); // Generate new packets every 2 seconds
  }

  generateInteractionPackets() {
    // Generate interaction-based packets
    const interactionEvents = [
      'FORM_SUBMIT', 'DROPDOWN_SELECT', 'CHECKBOX_TOGGLE',
      'RADIO_SELECT', 'INPUT_FOCUS', 'TEXTAREA_EDIT'
    ];

    const event = interactionEvents[Math.floor(Math.random() * interactionEvents.length)];

    // Simulate interaction packet data
    const packet = {
      name: event,
      size: this.generateRealisticSize('2.5KB'),
      frequency: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      timestamp: new Date(),
      color: '#ff9ff3'
    };

    console.log(`🖱️ Generated interaction packet: ${packet.name}`);
  }

  generatePerformancePackets() {
    // Generate performance monitoring packets
    const performanceEvents = [
      'CPU_USAGE_SAMPLE', 'MEMORY_ALLOCATION', 'RENDER_TIME_MEASURE',
      'NETWORK_LATENCY', 'CACHE_HIT_RATE', 'FPS_MEASUREMENT'
    ];

    const event = performanceEvents[Math.floor(Math.random() * performanceEvents.length)];

    // Simulate performance packet data
    const packet = {
      name: event,
      size: this.generateRealisticSize('1.8KB'),
      frequency: ['Medium', 'High', 'Very High'][Math.floor(Math.random() * 3)],
      timestamp: new Date(),
      color: '#54a0ff'
    };

    console.log(`⚡ Generated performance packet: ${packet.name}`);
  }

  generateBehaviorPackets() {
    const behaviorMetrics = this.metrics.get('behavior-analyst');
    if (!behaviorMetrics) return;

    // Simulate real user behavior events
    const events = [
      'USER_CLICK_EVENT', 'MOUSE_MOVEMENT', 'SCROLL_BEHAVIOR',
      'KEY_PRESS_PATTERN', 'FOCUS_CHANGE', 'FORM_INTERACTION'
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    const packet = behaviorMetrics.packets.find(p => p.name === event);

    if (packet) {
      // Update packet timestamp and simulate size variation
      packet.timestamp = new Date();
      packet.size = this.generateRealisticSize(packet.size);

      // Update analytics
      behaviorMetrics.analytics.totalEvents++;
      behaviorMetrics.analytics.averageResponseTime = Math.floor(Math.random() * 500) + 100;
      behaviorMetrics.analytics.userEngagement = Math.min(100, behaviorMetrics.analytics.userEngagement + Math.random() * 5);
    }
  }

  generateNavigationPackets() {
    const navMetrics = this.metrics.get('navigation-inspector');
    if (!navMetrics) return;

    const events = [
      'ROUTE_CHANGE', 'PAGE_LOAD_EVENT', 'LINK_HOVER',
      'SEARCH_QUERY', 'TAB_SWITCH', 'BREADCRUMB_CLICK'
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    const packet = navMetrics.packets.find(p => p.name === event);

    if (packet) {
      packet.timestamp = new Date();
      packet.size = this.generateRealisticSize(packet.size);

      // Update analytics
      navMetrics.analytics.totalNavigations++;
      navMetrics.analytics.averageLoadTime = Math.floor(Math.random() * 2000) + 500;
      navMetrics.analytics.bounceRate = Math.max(0, Math.min(100, navMetrics.analytics.bounceRate + (Math.random() - 0.5) * 10));
    }
  }

  generateRealisticSize(baseSize) {
    // Extract numeric value and unit
    const match = baseSize.match(/^(\d+\.?\d*)(\w+)$/);
    if (!match) return baseSize;

    const [, value, unit] = match;
    const numValue = parseFloat(value);

    // Add ±20% variation
    const variation = 1 + (Math.random() - 0.5) * 0.4;
    const newValue = (numValue * variation).toFixed(1);

    return `${newValue}${unit}`;
  }

  generateAllPackets() {
    Object.values(this.packetGenerators).forEach(generator => {
      if (Math.random() < 0.7) { // 70% chance to generate
        generator();
      }
    });
  }

  startBehaviorTracking(canvas, metrics) {
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    const renderBehaviorMetrics = () => {
      // Don't clear the entire canvas, just update metrics area
      this.renderMetricsOverlay(ctx, metrics, originalWidth, originalHeight);
    };

    // Render metrics every 1.5 seconds
    setInterval(renderBehaviorMetrics, 1500);
  }

  startNavigationTracking(canvas, metrics) {
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    const renderNavigationMetrics = () => {
      this.renderMetricsOverlay(ctx, metrics, originalWidth, originalHeight);
    };

    // Render metrics every 1.5 seconds
    setInterval(renderNavigationMetrics, 1500);
  }

  renderMetricsOverlay(ctx, metrics, width, height) {
    // Save context state
    ctx.save();

    try {
      // Create metrics overlay area
      const overlayHeight = 150;
      const overlayY = height - overlayHeight;

      // Clear metrics area
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, overlayY, width, overlayHeight);

      // Render header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`📊 ${metrics.type.toUpperCase()} METRICS`, 10, overlayY + 20);

      // Render timestamp
      ctx.font = '10px Arial';
      ctx.fillStyle = '#cccccc';
      ctx.fillText(`Last Update: ${new Date().toLocaleTimeString()}`, 10, overlayY + 35);

      // Render data packets
      let x = 10;
      let y = overlayY + 55;

      ctx.font = '9px Arial';
      metrics.packets.slice(0, 4).forEach((packet, index) => {
        // Packet indicator
        ctx.fillStyle = packet.color;
        ctx.fillRect(x, y, 8, 8);

        // Packet info
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${packet.name}`, x + 12, y + 7);

        ctx.fillStyle = '#aaaaaa';
        ctx.fillText(`${packet.size} | ${packet.frequency}`, x + 12, y + 18);

        ctx.fillStyle = '#888888';
        ctx.fillText(`${packet.timestamp.toLocaleTimeString()}`, x + 12, y + 29);

        x += 180;
        if (x > width - 180) {
          x = 10;
          y += 40;
        }
      });

      // Render analytics summary
      if (metrics.analytics) {
        ctx.fillStyle = '#ffff88';
        ctx.font = '10px Arial';
        const analyticsY = overlayY + 115;

        if (metrics.type === 'behavior-analyst') {
          ctx.fillText(`Events: ${metrics.analytics.totalEvents} | Engagement: ${metrics.analytics.userEngagement.toFixed(1)}% | Response: ${metrics.analytics.averageResponseTime}ms`, 10, analyticsY);
        } else if (metrics.type === 'navigation-inspector') {
          ctx.fillText(`Navigations: ${metrics.analytics.totalNavigations} | Load Time: ${metrics.analytics.averageLoadTime}ms | Bounce: ${metrics.analytics.bounceRate.toFixed(1)}%`, 10, analyticsY);
        }
      }

    } catch (error) {
      console.warn('Error rendering metrics overlay:', error);
    } finally {
      // Restore context state
      ctx.restore();
    }
  }

  setupMetricsDisplay() {
    // Create floating metrics display
    this.createFloatingMetricsDisplay();

    // Setup capture and manipulation features
    this.setupDataCaptureFeatures();
    this.setupManipulationSettings();
  }

  createFloatingMetricsDisplay() {
    const display = document.createElement('div');
    display.id = 'canvas-metrics-display';
    display.style.cssText = `
      position: fixed;
      top: 150px;
      right: 20px;
      width: 300px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      padding: 12px;
      z-index: 1002;
      font-family: monospace;
      font-size: 11px;
      max-height: 400px;
      overflow-y: auto;
      backdrop-filter: blur(10px);
    `;

    display.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">📊 Live Canvas Metrics</div>
      <div id="metrics-content"></div>
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #333;">
        <button onclick="window.canvasMetrics.toggleCapture()"
                style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
          📸 Capture
        </button>
        <button onclick="window.canvasMetrics.toggleSettings()"
                style="background: #8b5cf6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
          ⚙️ Settings
        </button>
      </div>
    `;

    document.body.appendChild(display);

    // Update content every 2 seconds
    setInterval(() => {
      this.updateMetricsDisplay();
    }, 2000);
  }

  updateMetricsDisplay() {
    const content = document.getElementById('metrics-content');
    if (!content) return;

    let html = '';

    this.metrics.forEach((metrics, key) => {
      html += `
        <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 4px;">
          <div style="font-weight: bold; color: #4ecdc4;">${metrics.type.toUpperCase()}</div>
          <div style="margin-top: 4px;">
            Active Packets: ${metrics.packets.filter(p => Date.now() - p.timestamp < 30000).length}
          </div>
          <div>
            Total Size: ${metrics.packets.reduce((sum, p) => sum + parseFloat(p.size), 0).toFixed(1)}KB
          </div>
          ${metrics.analytics ? `
            <div style="margin-top: 4px; font-size: 10px; color: #aaa;">
              ${metrics.type === 'behavior-analyst' ?
                `Events: ${metrics.analytics.totalEvents} | Engagement: ${metrics.analytics.userEngagement.toFixed(1)}%` :
                `Navigations: ${metrics.analytics.totalNavigations} | Load: ${metrics.analytics.averageLoadTime}ms`
              }
            </div>
          ` : ''}
        </div>
      `;
    });

    content.innerHTML = html || '<div style="color: #888;">No metrics available</div>';
  }

  setupDataCaptureFeatures() {
    this.captureSettings = {
      enabled: false,
      format: 'json',
      interval: 5000,
      includeTimestamps: true,
      includeAnalytics: true
    };
  }

  setupManipulationSettings() {
    this.manipulationSettings = {
      packetFrequency: 1.0,
      sizeVariation: 0.2,
      colorScheme: 'default',
      animationSpeed: 1.0,
      showLabels: true,
      showTimestamps: true
    };
  }

  toggleCapture() {
    this.captureSettings.enabled = !this.captureSettings.enabled;

    if (this.captureSettings.enabled) {
      console.log('📸 Started metrics capture');
      this.startCapture();
    } else {
      console.log('⏹️ Stopped metrics capture');
      this.stopCapture();
    }
  }

  startCapture() {
    this.captureInterval = setInterval(() => {
      const captureData = {
        timestamp: new Date().toISOString(),
        metrics: Object.fromEntries(this.metrics),
        settings: this.manipulationSettings
      };

      // Store capture data
      const captures = JSON.parse(localStorage.getItem('canvas-metrics-captures') || '[]');
      captures.push(captureData);

      // Keep only last 50 captures
      if (captures.length > 50) {
        captures.shift();
      }

      localStorage.setItem('canvas-metrics-captures', JSON.stringify(captures));

    }, this.captureSettings.interval);
  }

  stopCapture() {
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }
  }

  toggleSettings() {
    // Create settings modal
    this.createSettingsModal();
  }

  createSettingsModal() {
    // Remove existing modal
    const existing = document.getElementById('canvas-metrics-settings');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'canvas-metrics-settings';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    modal.innerHTML = `
      <div style="background: white; border-radius: 12px; padding: 24px; max-width: 500px; width: 90%;">
        <h2 style="margin: 0 0 20px 0;">⚙️ Canvas Metrics Settings</h2>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px;">Packet Frequency</label>
          <input type="range" min="0.1" max="3" step="0.1" value="${this.manipulationSettings.packetFrequency}"
                 onchange="window.canvasMetrics.updateSetting('packetFrequency', this.value)" style="width: 100%;">
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px;">Size Variation</label>
          <input type="range" min="0" max="1" step="0.05" value="${this.manipulationSettings.sizeVariation}"
                 onchange="window.canvasMetrics.updateSetting('sizeVariation', this.value)" style="width: 100%;">
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px;">Animation Speed</label>
          <input type="range" min="0.1" max="3" step="0.1" value="${this.manipulationSettings.animationSpeed}"
                 onchange="window.canvasMetrics.updateSetting('animationSpeed', this.value)" style="width: 100%;">
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center;">
            <input type="checkbox" ${this.manipulationSettings.showLabels ? 'checked' : ''}
                   onchange="window.canvasMetrics.updateSetting('showLabels', this.checked)">
            <span style="margin-left: 8px;">Show Labels</span>
          </label>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center;">
            <input type="checkbox" ${this.manipulationSettings.showTimestamps ? 'checked' : ''}
                   onchange="window.canvasMetrics.updateSetting('showTimestamps', this.checked)">
            <span style="margin-left: 8px;">Show Timestamps</span>
          </label>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <button onclick="this.closest('#canvas-metrics-settings').remove()"
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
            Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  updateSetting(setting, value) {
    this.manipulationSettings[setting] = value;
    console.log(`⚙️ Updated ${setting} to ${value}`);

    // Apply setting changes
    this.applySettingChange(setting, value);
  }

  applySettingChange(setting, value) {
    switch (setting) {
      case 'packetFrequency':
        // Adjust packet generation frequency
        break;
      case 'animationSpeed':
        // Update animation speeds
        break;
      case 'showLabels':
      case 'showTimestamps':
        // Update display settings
        break;
    }
  }
}

// Initialize the system
const canvasMetrics = new CanvasMetricsSystem();

// Make globally accessible
window.canvasMetrics = canvasMetrics;

console.log('📊 Canvas Metrics System loaded and operational!');
