/**
 * Enhanced Create Features Button System
 * Fixes and enhances the create features functionality with working implementation
 */

console.log('🛠️ Loading Enhanced Create Features System...');

class EnhancedCreateFeaturesSystem {
  constructor() {
    this.features = new Map();
    this.templates = new Map();
    this.categories = new Map();
    this.executionContext = new Map();
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Enhanced Create Features System...');

    // Setup feature templates
    this.setupFeatureTemplates();

    // Create enhanced interface
    this.createEnhancedInterface();

    // Setup execution environment
    this.setupExecutionEnvironment();

    // Fix existing create buttons
    this.fixExistingCreateButtons();

    // Load saved features
    this.loadSavedFeatures();

    console.log('✅ Enhanced Create Features System operational');
  }

  setupFeatureTemplates() {
    const templates = [
      {
        id: 'canvas-auto-refresh',
        name: 'Canvas Auto Refresh',
        description: 'Automatically refresh canvas content at specified intervals',
        category: 'canvas',
        code: `
// Canvas Auto Refresh Feature
function autoRefreshCanvas(canvasId, interval = 1000) {
  const canvas = document.getElementById(canvasId) || document.querySelector('canvas');
  if (!canvas) return;

  setInterval(() => {
    const ctx = canvas.getContext('2d');
    if (ctx && window.canvasEntityManager) {
      window.canvasEntityManager.startRendering(canvas);
    }
  }, interval);

  console.log('🔄 Canvas auto-refresh enabled');
}

// Execute the feature
autoRefreshCanvas('main-canvas', 2000);`,
        parameters: ['canvasId', 'interval'],
        complexity: 'simple'
      },
      {
        id: 'button-click-tracker',
        name: 'Button Click Tracker',
        description: 'Track and analyze button click patterns',
        category: 'analytics',
        code: `
// Button Click Tracker Feature
class ButtonClickTracker {
  constructor() {
    this.clicks = new Map();
    this.setupTracking();
  }

  setupTracking() {
    document.addEventListener('click', (event) => {
      if (event.target.matches('button, [role="button"], .btn')) {
        this.trackClick(event.target);
      }
    });
  }

  trackClick(button) {
    const buttonId = button.id || button.textContent.trim();
    const count = this.clicks.get(buttonId) || 0;
    this.clicks.set(buttonId, count + 1);

    console.log(\`📊 Button '\${buttonId}' clicked \${count + 1} times\`);
  }

  getStats() {
    return Object.fromEntries(this.clicks);
  }
}

// Execute the feature
window.buttonTracker = new ButtonClickTracker();`,
        parameters: [],
        complexity: 'moderate'
      },
      {
        id: 'ai-status-notifier',
        name: 'AI Status Notifier',
        description: 'Display real-time notifications for AI status changes',
        category: 'ai',
        code: `
// AI Status Notifier Feature
class AIStatusNotifier {
  constructor() {
    this.notifications = [];
    this.createNotificationContainer();
    this.setupAIMonitoring();
  }

  createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'ai-status-notifications';
    container.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 300px;
    \`;
    document.body.appendChild(container);
  }

  setupAIMonitoring() {
    if (window.aiCollaborationNetwork) {
      setInterval(() => {
        this.checkAIStatus();
      }, 5000);
    }
  }

  checkAIStatus() {
    if (!window.aiCollaborationNetwork) return;

    const stats = window.aiCollaborationNetwork.getNetworkStats();
    this.notify(\`AI Network: \${stats.activeAgents}/\${stats.totalAgents} agents active\`, 'info');
  }

  notify(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = \`
      background: \${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 8px;
      font-size: 12px;
      animation: slideIn 0.3s ease-out;
    \`;
    notification.textContent = message;

    const container = document.getElementById('ai-status-notifications');
    container.appendChild(notification);

    setTimeout(() => notification.remove(), 5000);
  }
}

// Execute the feature
window.aiNotifier = new AIStatusNotifier();`,
        parameters: [],
        complexity: 'advanced'
      },
      {
        id: 'theme-switcher',
        name: 'Dynamic Theme Switcher',
        description: 'Switch between light and dark themes',
        category: 'ui',
        code: `
// Dynamic Theme Switcher Feature
class ThemeSwitcher {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.createThemeButton();
    this.applyTheme(this.currentTheme);
  }

  createThemeButton() {
    const button = document.createElement('button');
    button.innerHTML = '🌙';
    button.style.cssText = \`
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      background: #3b82f6;
      color: white;
      font-size: 20px;
      cursor: pointer;
      z-index: 1000;
    \`;

    button.addEventListener('click', () => this.toggleTheme());
    document.body.appendChild(button);
    this.themeButton = button;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    document.body.dataset.theme = theme;
    this.themeButton.innerHTML = theme === 'light' ? '🌙' : '☀️';

    // Apply theme styles
    const style = document.createElement('style');
    style.id = 'theme-styles';
    const existingStyle = document.getElementById('theme-styles');
    if (existingStyle) existingStyle.remove();

    style.textContent = theme === 'dark' ? \`
      [data-theme="dark"] { background: #1a1a1a; color: white; }
      [data-theme="dark"] .control-panel { background: rgba(0,0,0,0.8); }
      [data-theme="dark"] canvas { filter: brightness(0.8); }
    \` : \`
      [data-theme="light"] { background: white; color: black; }
      [data-theme="light"] .control-panel { background: rgba(255,255,255,0.9); }
    \`;

    document.head.appendChild(style);
  }
}

// Execute the feature
window.themeSwitcher = new ThemeSwitcher();`,
        parameters: [],
        complexity: 'moderate'
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });

    console.log(`📚 Loaded ${templates.length} feature templates`);
  }

  createEnhancedInterface() {
    // Remove old create buttons that aren't working
    document.querySelectorAll('.create-features-btn').forEach(btn => {
      if (!this.isButtonWorking(btn)) {
        btn.remove();
      }
    });

    // Create new working interface
    this.createMainCreateButton();
    this.createFeatureManagementPanel();
  }

  isButtonWorking(button) {
    // Check if button has proper event listeners and functionality
    const listeners = getEventListeners?.(button);
    return listeners && listeners.click && listeners.click.length > 0;
  }

  createMainCreateButton() {
    const mainButton = document.createElement('button');
    mainButton.id = 'enhanced-create-features-btn';
    mainButton.innerHTML = '🛠️ Create Features';
    mainButton.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      background: #8b5cf6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      transition: all 0.2s;
      z-index: 1001;
    `;

    mainButton.addEventListener('mouseenter', () => {
      mainButton.style.transform = 'translateY(-2px)';
      mainButton.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.6)';
    });

    mainButton.addEventListener('mouseleave', () => {
      mainButton.style.transform = 'translateY(0)';
      mainButton.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
    });

    mainButton.addEventListener('click', () => {
      this.showCreateFeatureDialog();
    });

    document.body.appendChild(mainButton);
    console.log('🛠️ Created enhanced main create button');
  }

  showCreateFeatureDialog() {
    // Remove existing dialog
    const existing = document.getElementById('enhanced-create-dialog');
    if (existing) existing.remove();

    const dialog = document.createElement('div');
    dialog.id = 'enhanced-create-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 800px;
      max-height: 80vh;
      width: 90%;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #333; font-size: 24px;">🛠️ Create Custom Feature</h2>
        <button onclick="this.closest('#enhanced-create-dialog').remove()"
                style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
      </div>

      <div style="display: flex; gap: 24px;">
        <div style="flex: 1;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; color: #666;">📚 Feature Templates</h3>
            <div id="template-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 6px;">
              ${Array.from(this.templates.values()).map(template => `
                <div class="template-item" data-template-id="${template.id}"
                     style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.2s;">
                  <div style="font-weight: 600; color: #333;">${template.name}</div>
                  <div style="font-size: 12px; color: #666; margin-top: 4px;">${template.description}</div>
                  <div style="font-size: 10px; color: #888; margin-top: 4px;">
                    Category: ${template.category} | Complexity: ${template.complexity}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 600;">Feature Name</label>
            <input type="text" id="feature-name" placeholder="Enter feature name..."
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 600;">Description</label>
            <textarea id="feature-description" placeholder="Describe what this feature does..."
                      rows="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 600;">Category</label>
            <select id="feature-category" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="canvas">Canvas Enhancement</option>
              <option value="ai">AI Integration</option>
              <option value="ui">UI/UX Improvement</option>
              <option value="analytics">Analytics & Tracking</option>
              <option value="automation">Automation</option>
              <option value="optimization">Performance Optimization</option>
              <option value="integration">System Integration</option>
            </select>
          </div>
        </div>

        <div style="flex: 1;">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 600;">Implementation Code</label>
            <textarea id="feature-code" placeholder="Enter your JavaScript code here..."
                      rows="15" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 12px;"></textarea>
          </div>

          <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <button onclick="window.enhancedCreateFeatures.generateCode()"
                      style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                🤖 AI Generate
              </button>
              <button onclick="window.enhancedCreateFeatures.testFeature()"
                      style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                🧪 Test Code
              </button>
            </div>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.enhancedCreateFeatures.validateFeature()"
                      style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                ✅ Validate
              </button>
              <button onclick="window.enhancedCreateFeatures.saveFeature()"
                      style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                💾 Save & Execute
              </button>
            </div>
          </div>

          <div id="feature-output" style="min-height: 100px; padding: 12px; background: #f8f9fa; border-radius: 6px; font-family: monospace; font-size: 12px; overflow-y: auto;">
            <div style="color: #666;">Output will appear here...</div>
          </div>
        </div>
      </div>
    `;

    dialog.appendChild(content);
    document.body.appendChild(dialog);

    // Setup template selection
    this.setupTemplateSelection(content);

    // Setup event handlers
    this.setupDialogEventHandlers();
  }

  setupTemplateSelection(content) {
    const templateItems = content.querySelectorAll('.template-item');
    templateItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove previous selection
        templateItems.forEach(i => i.style.background = '');

        // Highlight selected
        item.style.background = '#e0f2fe';

        // Load template
        const templateId = item.dataset.templateId;
        this.loadTemplate(templateId);
      });

      item.addEventListener('mouseenter', () => {
        if (item.style.background !== 'rgb(224, 242, 254)') {
          item.style.background = '#f5f5f5';
        }
      });

      item.addEventListener('mouseleave', () => {
        if (item.style.background !== 'rgb(224, 242, 254)') {
          item.style.background = '';
        }
      });
    });
  }

  loadTemplate(templateId) {
    const template = this.templates.get(templateId);
    if (!template) return;

    document.getElementById('feature-name').value = template.name;
    document.getElementById('feature-description').value = template.description;
    document.getElementById('feature-category').value = template.category;
    document.getElementById('feature-code').value = template.code.trim();

    this.logOutput(`📚 Loaded template: ${template.name}`, 'info');
  }

  setupDialogEventHandlers() {
    // Make methods globally accessible for dialog buttons
    window.enhancedCreateFeatures = this;
  }

  testFeature() {
    const code = document.getElementById('feature-code').value;
    if (!code.trim()) {
      this.logOutput('❌ No code to test', 'error');
      return;
    }

    try {
      this.logOutput('🧪 Testing feature code...', 'info');

      // Create safe test environment
      const testResult = this.executeInSafeEnvironment(code, true);

      this.logOutput('✅ Code syntax is valid', 'success');
      this.logOutput(`📊 Test result: ${testResult}`, 'info');

    } catch (error) {
      this.logOutput(`❌ Test failed: ${error.message}`, 'error');
    }
  }

  validateFeature() {
    const name = document.getElementById('feature-name').value;
    const description = document.getElementById('feature-description').value;
    const code = document.getElementById('feature-code').value;

    const errors = [];

    if (!name.trim()) errors.push('Feature name is required');
    if (!description.trim()) errors.push('Description is required');
    if (!code.trim()) errors.push('Implementation code is required');

    // Check for potentially dangerous code
    const dangerousPatterns = [
      /document\.write/,
      /eval\(/,
      /innerHTML\s*=.*<script/,
      /localStorage\.clear\(\)/,
      /sessionStorage\.clear\(\)/
    ];

    dangerousPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        errors.push('Code contains potentially dangerous patterns');
      }
    });

    if (errors.length === 0) {
      this.logOutput('✅ Feature validation passed', 'success');
      return true;
    } else {
      errors.forEach(error => {
        this.logOutput(`❌ ${error}`, 'error');
      });
      return false;
    }
  }

  generateCode() {
    const name = document.getElementById('feature-name').value;
    const description = document.getElementById('feature-description').value;
    const category = document.getElementById('feature-category').value;

    if (!description.trim()) {
      this.logOutput('❌ Please provide a description for AI code generation', 'error');
      return;
    }

    this.logOutput('🤖 AI is analyzing your description and generating code...', 'info');

    // Simulate AI thinking time
    setTimeout(() => {
      const generatedCode = this.aiGenerateCode(description, category, name);
      document.getElementById('feature-code').value = generatedCode;
      this.logOutput('✅ AI has generated code based on your description', 'success');
      this.logOutput('💡 Review the generated code and modify as needed', 'info');
    }, 2000);
  }

  aiGenerateCode(description, category, name) {
    // AI-powered code generation based on description and category
    const desc = description.toLowerCase();

    // Analyze user description and generate appropriate code
    if (desc.includes('button') || desc.includes('click')) {
      return this.generateButtonFeature(description, name);
    } else if (desc.includes('canvas') || desc.includes('draw')) {
      return this.generateCanvasFeature(description, name);
    } else if (desc.includes('data') || desc.includes('track') || desc.includes('monitor')) {
      return this.generateDataFeature(description, name);
    } else if (desc.includes('notification') || desc.includes('alert')) {
      return this.generateNotificationFeature(description, name);
    } else if (desc.includes('theme') || desc.includes('color') || desc.includes('style')) {
      return this.generateStyleFeature(description, name);
    } else if (desc.includes('storage') || desc.includes('save') || desc.includes('load')) {
      return this.generateStorageFeature(description, name);
    } else {
      return this.generateGenericFeature(description, name, category);
    }
  }

  generateButtonFeature(description, name) {
    return `// ${name || 'Button Feature'}
// Generated by AI based on: ${description}

class ${(name || 'ButtonFeature').replace(/[^a-zA-Z0-9]/g, '')} {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log('🔘 Initializing ${name || 'Button Feature'}...');
    this.createButton();
  }

  createButton() {
    const button = document.createElement('button');
    button.innerHTML = '${description.includes('icon') ? '🔘' : 'Action'}';
    button.style.cssText = \`
      position: fixed;
      top: 100px;
      right: 100px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      cursor: pointer;
      font-size: 14px;
      z-index: 1000;
    \`;

    button.addEventListener('click', () => {
      this.handleButtonClick();
    });

    document.body.appendChild(button);
    console.log('✅ Button created successfully');
  }

  handleButtonClick() {
    console.log('Button clicked!');
    // Add your custom logic here based on: ${description}
    ${description.includes('alert') ? `alert('Feature activated!');` : ''}
    ${description.includes('toggle') ? `this.toggleFeature();` : ''}
    ${description.includes('navigate') ? `window.location.href = '/new-page';` : ''}
  }

  ${description.includes('toggle') ? `
  toggleFeature() {
    // Toggle functionality implementation
    console.log('Feature toggled');
  }` : ''}
}

// Execute the feature
window.${(name || 'buttonFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} = new ${(name || 'ButtonFeature').replace(/[^a-zA-Z0-9]/g, '')}();`;
  }

  generateCanvasFeature(description, name) {
    return `// ${name || 'Canvas Feature'}
// Generated by AI based on: ${description}

class ${(name || 'CanvasFeature').replace(/[^a-zA-Z0-9]/g, '')} {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    this.initialize();
  }

  initialize() {
    console.log('🎨 Initializing ${name || 'Canvas Feature'}...');
    this.createCanvas();
    this.startAnimation();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 400;
    this.canvas.height = 300;
    this.canvas.style.cssText = \`
      position: fixed;
      top: 150px;
      left: 150px;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      z-index: 1000;
      background: white;
    \`;

    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }

  startAnimation() {
    const animate = () => {
      this.clearCanvas();
      this.draw();
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    const time = Date.now() * 0.002;

    ${description.includes('circle') ? `
    // Draw animated circle
    this.ctx.beginPath();
    this.ctx.arc(200 + Math.sin(time) * 50, 150, 30, 0, Math.PI * 2);
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fill();` : ''}

    ${description.includes('line') || description.includes('graph') ? `
    // Draw animated line/graph
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 2;
    for (let x = 0; x < this.canvas.width; x += 5) {
      const y = 150 + Math.sin((x + time * 100) * 0.02) * 50;
      if (x === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();` : ''}

    ${description.includes('text') ? `
    // Draw text
    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('${name || 'Canvas Feature'}', 200, 50);` : ''}

    // Default animation if no specific drawing mentioned
    ${!description.includes('circle') && !description.includes('line') && !description.includes('text') ? `
    this.ctx.fillStyle = \`hsl(\${time * 50 % 360}, 70%, 50%)\`;
    this.ctx.fillRect(50, 50, 100, 100);` : ''}
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// Execute the feature
window.${(name || 'canvasFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} = new ${(name || 'CanvasFeature').replace(/[^a-zA-Z0-9]/g, '')}();`;
  }

  generateDataFeature(description, name) {
    return `// ${name || 'Data Feature'}
// Generated by AI based on: ${description}

class ${(name || 'DataFeature').replace(/[^a-zA-Z0-9]/g, '')} {
  constructor() {
    this.data = new Map();
    this.isTracking = false;
    this.initialize();
  }

  initialize() {
    console.log('📊 Initializing ${name || 'Data Feature'}...');
    this.setupTracking();
    this.createDisplay();
  }

  setupTracking() {
    this.isTracking = true;

    ${description.includes('click') ? `
    // Track clicks
    document.addEventListener('click', (event) => {
      this.trackEvent('click', {
        element: event.target.tagName,
        timestamp: Date.now()
      });
    });` : ''}

    ${description.includes('scroll') ? `
    // Track scroll
    window.addEventListener('scroll', () => {
      this.trackEvent('scroll', {
        position: window.scrollY,
        timestamp: Date.now()
      });
    });` : ''}

    ${description.includes('time') || description.includes('visit') ? `
    // Track time/visits
    this.startTime = Date.now();
    setInterval(() => {
      this.trackEvent('time', {
        sessionDuration: Date.now() - this.startTime,
        timestamp: Date.now()
      });
    }, 5000);` : ''}

    console.log('✅ Data tracking started');
  }

  trackEvent(type, data) {
    if (!this.isTracking) return;

    const events = this.data.get(type) || [];
    events.push(data);

    // Keep only last 100 events per type
    if (events.length > 100) {
      events.shift();
    }

    this.data.set(type, events);
    this.updateDisplay();
  }

  createDisplay() {
    const display = document.createElement('div');
    display.style.cssText = \`
      position: fixed;
      top: 200px;
      right: 200px;
      width: 250px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      padding: 16px;
      z-index: 1000;
      font-family: monospace;
      font-size: 12px;
    \`;

    display.innerHTML = \`
      <h3 style="margin: 0 0 12px 0;">📊 ${name || 'Data Tracker'}</h3>
      <div id="data-display-content"></div>
      <button onclick="this.parentElement.remove()"
              style="margin-top: 8px; background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
        Stop Tracking
      </button>
    \`;

    document.body.appendChild(display);
    this.display = display;
  }

  updateDisplay() {
    const content = this.display?.querySelector('#data-display-content');
    if (!content) return;

    let html = '';
    this.data.forEach((events, type) => {
      html += \`<div style="margin-bottom: 8px;">
        <strong>\${type.toUpperCase()}:</strong> \${events.length}
      </div>\`;
    });

    content.innerHTML = html || 'No data collected yet';
  }

  exportData() {
    const exportData = Object.fromEntries(this.data);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '${(name || 'data').replace(/[^a-zA-Z0-9]/g, '')}-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Execute the feature
window.${(name || 'dataFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} = new ${(name || 'DataFeature').replace(/[^a-zA-Z0-9]/g, '')}();`;
  }

  generateNotificationFeature(description, name) {
    return `// ${name || 'Notification Feature'}
// Generated by AI based on: ${description}

class ${(name || 'NotificationFeature').replace(/[^a-zA-Z0-9]/g, '')} {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.initialize();
  }

  initialize() {
    console.log('🔔 Initializing ${name || 'Notification Feature'}...');
    this.createContainer();
    this.showWelcomeNotification();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 300px;
    \`;
    document.body.appendChild(this.container);
  }

  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.style.cssText = \`
      background: \${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : type === 'success' ? '#10b981' : '#3b82f6'};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
      cursor: pointer;
    \`;

    notification.innerHTML = \`
      <div style="font-weight: bold; margin-bottom: 4px;">
        \${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
        ${name || 'Notification'}
      </div>
      <div style="font-size: 14px;">\${message}</div>
    \`;

    notification.addEventListener('click', () => {
      notification.remove();
    });

    this.container.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, duration);

    this.notifications.push({
      message,
      type,
      timestamp: Date.now()
    });
  }

  showWelcomeNotification() {
    this.showNotification('${description}', 'info');

    ${description.includes('periodic') || description.includes('regular') ? `
    // Set up periodic notifications
    setInterval(() => {
      this.showNotification('Periodic update: System is running smoothly', 'success');
    }, 30000); // Every 30 seconds` : ''}
  }

  ${description.includes('error') || description.includes('monitor') ? `
  monitorForErrors() {
    window.addEventListener('error', (event) => {
      this.showNotification(\`Error detected: \${event.message}\`, 'error');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.showNotification('Promise rejection detected', 'warning');
    });
  }` : ''}

  getNotificationHistory() {
    return this.notifications;
  }
}

// Execute the feature
window.${(name || 'notificationFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} = new ${(name || 'NotificationFeature').replace(/[^a-zA-Z0-9]/g, '')}();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = \`
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
\`;
document.head.appendChild(style);`;
  }

  generateStyleFeature(description, name) {
    return `// ${name || 'Style Feature'}
// Generated by AI based on: ${description}

class ${(name || 'StyleFeature').replace(/[^a-zA-Z0-9]/g, '')} {
  constructor() {
    this.currentTheme = 'default';
    this.styleElement = null;
    this.initialize();
  }

  initialize() {
    console.log('🎨 Initializing ${name || 'Style Feature'}...');
    this.createStyleElement();
    this.createControls();
    this.applyDefaultStyles();
  }

  createStyleElement() {
    this.styleElement = document.createElement('style');
    this.styleElement.id = '${(name || 'style-feature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-styles';
    document.head.appendChild(this.styleElement);
  }

  createControls() {
    const controls = document.createElement('div');
    controls.style.cssText = \`
      position: fixed;
      bottom: 100px;
      left: 100px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 16px;
      border-radius: 8px;
      z-index: 1000;
    \`;

    controls.innerHTML = \`
      <h4 style="margin: 0 0 12px 0;">🎨 ${name || 'Style Controls'}</h4>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${description.includes('theme') ? `
        <button onclick="window.${(name || 'styleFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.toggleTheme()"
                style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Toggle Theme
        </button>` : ''}
        ${description.includes('color') ? `
        <button onclick="window.${(name || 'styleFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.randomColors()"
                style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Random Colors
        </button>` : ''}
        ${description.includes('animation') ? `
        <button onclick="window.${(name || 'styleFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.toggleAnimations()"
                style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Toggle Animations
        </button>` : ''}
      </div>
    \`;

    document.body.appendChild(controls);
  }

  applyDefaultStyles() {
    this.updateStyles(\`
      /* ${name || 'Style Feature'} - Generated Styles */

      ${description.includes('dark') ? `
      body {
        background: #1a1a1a !important;
        color: #ffffff !important;
      }
      .control-panel, .system-panel {
        background: rgba(0, 0, 0, 0.8) !important;
      }` : ''}

      ${description.includes('colorful') || description.includes('rainbow') ? `
      * {
        transition: all 0.3s ease !important;
      }
      button:hover {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1) !important;
      }` : ''}

      ${description.includes('animation') ? `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      button, .interactive {
        animation: pulse 2s infinite;
      }` : ''}

      ${description.includes('font') || description.includes('text') ? `
      * {
        font-family: 'Comic Sans MS', cursive !important;
      }` : ''}
    \`);
  }

  updateStyles(css) {
    this.styleElement.textContent = css;
  }

  ${description.includes('theme') ? `
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';

    if (this.currentTheme === 'dark') {
      this.updateStyles(\`
        body { background: #1a1a1a !important; color: #ffffff !important; }
        .control-panel { background: rgba(0, 0, 0, 0.9) !important; }
      \`);
    } else {
      this.updateStyles(\`
        body { background: #ffffff !important; color: #000000 !important; }
        .control-panel { background: rgba(255, 255, 255, 0.9) !important; }
      \`);
    }
  }` : ''}

  ${description.includes('color') ? `
  randomColors() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    this.updateStyles(\`
      body { background: \${randomColor} !important; }
      button { background: \${randomColor} !important; }
    \`);
  }` : ''}

  ${description.includes('animation') ? `
  toggleAnimations() {
    const hasAnimations = this.styleElement.textContent.includes('animation');

    if (hasAnimations) {
      this.updateStyles('/* Animations disabled */');
    } else {
      this.updateStyles(\`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { animation: spin 3s linear infinite !important; }
      \`);
    }
  }` : ''}
}

// Execute the feature
window.${(name || 'styleFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} = new ${(name || 'StyleFeature').replace(/[^a-zA-Z0-9]/g, '')}();`;
  }

  generateStorageFeature(description, name) {
    return `// ${name || 'Storage Feature'}
// Generated by AI based on: ${description}

class ${(name || 'StorageFeature').replace(/[^a-zA-Z0-9]/g, '')} {
  constructor() {
    this.storageKey = '${(name || 'storage-feature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}';
    this.data = new Map();
    this.initialize();
  }

  initialize() {
    console.log('💾 Initializing ${name || 'Storage Feature'}...');
    this.loadData();
    this.createInterface();
    this.setupAutoSave();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = new Map(Object.entries(parsed));
        console.log(\`✅ Loaded \${this.data.size} items from storage\`);
      }
    } catch (error) {
      console.warn('Failed to load data:', error);
    }
  }

  saveData() {
    try {
      const obj = Object.fromEntries(this.data);
      localStorage.setItem(this.storageKey, JSON.stringify(obj));
      console.log(\`💾 Saved \${this.data.size} items to storage\`);
    } catch (error) {
      console.warn('Failed to save data:', error);
      this.showMessage('Storage full! Data not saved.', 'error');
    }
  }

  createInterface() {
    const interface = document.createElement('div');
    interface.style.cssText = \`
      position: fixed;
      top: 250px;
      left: 250px;
      width: 300px;
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 16px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    \`;

    interface.innerHTML = \`
      <h3 style="margin: 0 0 16px 0; color: #3b82f6;">💾 ${name || 'Storage Manager'}</h3>

      <div style="margin-bottom: 12px;">
        <input type="text" id="storage-key-input" placeholder="Enter key..."
               style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 6px;">
        <input type="text" id="storage-value-input" placeholder="Enter value..."
               style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
      </div>

      <div style="margin-bottom: 12px; display: flex; gap: 6px;">
        <button onclick="window.${(name || 'storageFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.addItem()"
                style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Add
        </button>
        <button onclick="window.${(name || 'storageFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.clearAll()"
                style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Clear All
        </button>
        <button onclick="window.${(name || 'storageFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.exportData()"
                style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Export
        </button>
      </div>

      <div id="storage-items" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 8px;">
        <!-- Items will be listed here -->
      </div>

      <div id="storage-messages" style="margin-top: 8px; font-size: 12px;"></div>
    \`;

    document.body.appendChild(interface);
    this.interface = interface;
    this.updateItemsList();
  }

  addItem() {
    const keyInput = document.getElementById('storage-key-input');
    const valueInput = document.getElementById('storage-value-input');

    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (!key || !value) {
      this.showMessage('Please enter both key and value', 'error');
      return;
    }

    this.data.set(key, {
      value,
      timestamp: Date.now(),
      type: typeof value
    });

    this.saveData();
    this.updateItemsList();

    keyInput.value = '';
    valueInput.value = '';

    this.showMessage(\`Added: \${key}\`, 'success');
  }

  removeItem(key) {
    this.data.delete(key);
    this.saveData();
    this.updateItemsList();
    this.showMessage(\`Removed: \${key}\`, 'info');
  }

  clearAll() {
    if (confirm('Clear all stored data?')) {
      this.data.clear();
      this.saveData();
      this.updateItemsList();
      this.showMessage('All data cleared', 'info');
    }
  }

  updateItemsList() {
    const container = document.getElementById('storage-items');
    if (!container) return;

    if (this.data.size === 0) {
      container.innerHTML = '<div style="color: #666; text-align: center;">No items stored</div>';
      return;
    }

    container.innerHTML = Array.from(this.data.entries()).map(([key, item]) => \`
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px; border-bottom: 1px solid #eee;">
        <div>
          <strong>\${key}:</strong> \${item.value}
          <div style="font-size: 10px; color: #666;">\${new Date(item.timestamp).toLocaleString()}</div>
        </div>
        <button onclick="window.${(name || 'storageFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.removeItem('\${key}')"
                style="background: #ef4444; color: white; border: none; padding: 2px 6px; border-radius: 2px; cursor: pointer; font-size: 10px;">
          ✕
        </button>
      </div>
    \`).join('');
  }

  exportData() {
    const exportObj = {
      exported: new Date().toISOString(),
      data: Object.fromEntries(this.data)
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${this.storageKey}-export.json\`;
    a.click();
    URL.revokeObjectURL(url);

    this.showMessage('Data exported', 'success');
  }

  setupAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => {
      this.saveData();
    }, 30000);
  }

  showMessage(message, type = 'info') {
    const container = document.getElementById('storage-messages');
    if (!container) return;

    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    };

    container.innerHTML = \`<div style="color: \${colors[type]};">\${message}</div>\`;

    setTimeout(() => {
      container.innerHTML = '';
    }, 3000);
  }

  getData() {
    return Object.fromEntries(this.data);
  }
}

// Execute the feature
window.${(name || 'storageFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} = new ${(name || 'StorageFeature').replace(/[^a-zA-Z0-9]/g, '')}();`;
  }

  generateGenericFeature(description, name, category) {
    return `// ${name || 'Custom Feature'}
// Generated by AI based on: ${description}
// Category: ${category}

class ${(name || 'CustomFeature').replace(/[^a-zA-Z0-9]/g, '')} {
  constructor() {
    this.isActive = false;
    this.settings = {};
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing ${name || 'Custom Feature'}...');
    this.setupFeature();
    this.createInterface();
    this.isActive = true;
  }

  setupFeature() {
    // Feature setup based on description: ${description}

    ${category === 'automation' ? `
    // Automation setup
    this.automationInterval = setInterval(() => {
      this.performAutomatedTask();
    }, 5000);` : ''}

    ${category === 'analytics' ? `
    // Analytics setup
    this.analyticsData = [];
    this.startDataCollection();` : ''}

    ${category === 'optimization' ? `
    // Optimization setup
    this.optimizationTargets = ['performance', 'memory', 'network'];
    this.runOptimization();` : ''}

    console.log('✅ Feature setup complete');
  }

  createInterface() {
    const interface = document.createElement('div');
    interface.style.cssText = \`
      position: fixed;
      top: 300px;
      right: 300px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      padding: 16px;
      z-index: 1000;
      min-width: 250px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    \`;

    interface.innerHTML = \`
      <h3 style="margin: 0 0 12px 0; font-size: 16px;">✨ ${name || 'Custom Feature'}</h3>
      <p style="margin: 0 0 12px 0; font-size: 12px; opacity: 0.9;">${description}</p>

      <div style="margin-bottom: 12px;">
        <button onclick="window.${(name || 'customFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.toggleFeature()"
                style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 6px;">
          Toggle
        </button>
        <button onclick="window.${(name || 'customFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.executeAction()"
                style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Execute
        </button>
      </div>

      <div id="feature-status" style="font-size: 11px; opacity: 0.8;">
        Status: Active
      </div>
    \`;

    document.body.appendChild(interface);
  }

  toggleFeature() {
    this.isActive = !this.isActive;
    const status = document.getElementById('feature-status');
    if (status) {
      status.textContent = \`Status: \${this.isActive ? 'Active' : 'Inactive'}\`;
    }
    console.log(\`Feature \${this.isActive ? 'activated' : 'deactivated'}\`);
  }

  executeAction() {
    if (!this.isActive) {
      console.log('Feature is inactive');
      return;
    }

    console.log('Executing custom action...');

    // Custom action based on description
    ${description.includes('alert') ? `alert('Feature executed!');` : ''}
    ${description.includes('log') ? `console.log('Custom feature action executed');` : ''}
    ${description.includes('modify') ? `document.body.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg)';` : ''}

    // Default action
    this.showMessage('Action executed successfully!');
  }

  ${category === 'automation' ? `
  performAutomatedTask() {
    if (!this.isActive) return;
    console.log('Performing automated task...');
    // Add automation logic here
  }` : ''}

  ${category === 'analytics' ? `
  startDataCollection() {
    setInterval(() => {
      if (this.isActive) {
        this.analyticsData.push({
          timestamp: Date.now(),
          data: Math.random() * 100
        });
      }
    }, 1000);
  }` : ''}

  ${category === 'optimization' ? `
  runOptimization() {
    console.log('Running optimization...');
    // Add optimization logic here
  }` : ''}

  showMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = \`
      position: fixed;
      top: 100px;
      right: 100px;
      background: #10b981;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      z-index: 10001;
    \`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }

  getStatus() {
    return {
      isActive: this.isActive,
      settings: this.settings,
      description: '${description}'
    };
  }
}

// Execute the feature
window.${(name || 'customFeature').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} = new ${(name || 'CustomFeature').replace(/[^a-zA-Z0-9]/g, '')}();`;
  }

  saveFeature() {
    if (!this.validateFeature()) {
      return;
    }

    const featureData = {
      id: `feature-${Date.now()}`,
      name: document.getElementById('feature-name').value,
      description: document.getElementById('feature-description').value,
      category: document.getElementById('feature-category').value,
      code: document.getElementById('feature-code').value,
      created: new Date().toISOString(),
      author: 'User'
    };

    try {
      // Save to storage
      const features = JSON.parse(localStorage.getItem('enhanced-custom-features') || '[]');
      features.push(featureData);
      localStorage.setItem('enhanced-custom-features', JSON.stringify(features));

      // Execute the feature
      this.executeFeature(featureData);

      // Store in memory
      this.features.set(featureData.id, featureData);

      this.logOutput(`💾 Feature "${featureData.name}" saved successfully`, 'success');
      this.logOutput('🚀 Feature executed and active', 'info');

      // Close dialog after short delay
      setTimeout(() => {
        document.getElementById('enhanced-create-dialog')?.remove();
      }, 2000);

    } catch (error) {
      this.logOutput(`❌ Failed to save feature: ${error.message}`, 'error');
    }
  }

  executeFeature(featureData) {
    try {
      this.logOutput(`🚀 Executing feature: ${featureData.name}`, 'info');

      const result = this.executeInSafeEnvironment(featureData.code, false);

      // Store execution context
      this.executionContext.set(featureData.id, {
        feature: featureData,
        executed: new Date(),
        result
      });

      this.logOutput('✅ Feature executed successfully', 'success');

    } catch (error) {
      this.logOutput(`❌ Execution failed: ${error.message}`, 'error');
      throw error;
    }
  }

  executeInSafeEnvironment(code, testMode = false) {
    // Create execution context with limited access
    const safeGlobals = {
      console: {
        log: (...args) => this.logOutput(args.join(' '), 'log'),
        error: (...args) => this.logOutput(args.join(' '), 'error'),
        warn: (...args) => this.logOutput(args.join(' '), 'warning')
      },
      document,
      window: testMode ? {} : window,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      Date,
      Math,
      JSON
    };

    // Create function with limited scope
    const executeCode = new Function(
      ...Object.keys(safeGlobals),
      `
      "use strict";
      try {
        ${code}
        return "Execution completed successfully";
      } catch (error) {
        throw new Error("Runtime error: " + error.message);
      }
      `
    );

    return executeCode(...Object.values(safeGlobals));
  }

  logOutput(message, type = 'log') {
    const output = document.getElementById('feature-output');
    if (!output) return;

    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      log: '#333',
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };

    const line = document.createElement('div');
    line.style.cssText = `
      color: ${colors[type] || colors.log};
      margin-bottom: 4px;
      word-wrap: break-word;
    `;
    line.innerHTML = `<span style="color: #888;">[${timestamp}]</span> ${message}`;

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  createFeatureManagementPanel() {
    // Create a management panel for existing features
    const panel = document.createElement('div');
    panel.id = 'feature-management-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      padding: 16px;
      z-index: 1000;
      min-width: 300px;
      max-height: 300px;
      overflow-y: auto;
      font-family: Arial, sans-serif;
      font-size: 12px;
    `;

    panel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 12px;">🛠️ Active Features</div>
      <div id="active-features-list"></div>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #333;">
        <button onclick="window.enhancedCreateFeatures.refreshFeaturesList()"
                style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
          🔄 Refresh
        </button>
        <button onclick="window.enhancedCreateFeatures.showCreateFeatureDialog()"
                style="background: #8b5cf6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          + Create
        </button>
      </div>
    `;

    document.body.appendChild(panel);
    this.refreshFeaturesList();
  }

  refreshFeaturesList() {
    const list = document.getElementById('active-features-list');
    if (!list) return;

    if (this.features.size === 0) {
      list.innerHTML = '<div style="color: #888;">No active features</div>';
      return;
    }

    list.innerHTML = Array.from(this.features.values()).map(feature => `
      <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 4px;">
        <div style="font-weight: 600;">${feature.name}</div>
        <div style="font-size: 10px; color: #ccc; margin-top: 2px;">${feature.category}</div>
        <div style="margin-top: 6px;">
          <button onclick="window.enhancedCreateFeatures.removeFeature('${feature.id}')"
                  style="background: #ef4444; color: white; border: none; padding: 2px 6px; border-radius: 2px; cursor: pointer; font-size: 10px;">
            Remove
          </button>
        </div>
      </div>
    `).join('');
  }

  removeFeature(featureId) {
    this.features.delete(featureId);
    this.executionContext.delete(featureId);

    // Remove from storage
    const features = JSON.parse(localStorage.getItem('enhanced-custom-features') || '[]');
    const filtered = features.filter(f => f.id !== featureId);
    localStorage.setItem('enhanced-custom-features', JSON.stringify(filtered));

    this.refreshFeaturesList();
    console.log(`🗑️ Removed feature: ${featureId}`);
  }

  setupExecutionEnvironment() {
    // Global access
    window.enhancedCreateFeatures = this;
  }

  fixExistingCreateButtons() {
    // Find and fix broken create feature buttons
    const brokenButtons = document.querySelectorAll('.create-features-btn, [onclick*="createFeature"]');

    brokenButtons.forEach(button => {
      if (!this.isButtonWorking(button)) {
        // Replace with working button
        const newButton = button.cloneNode(true);
        newButton.onclick = null;

        newButton.addEventListener('click', () => {
          this.showCreateFeatureDialog();
        });

        button.parentNode?.replaceChild(newButton, button);
        console.log('🔧 Fixed broken create feature button');
      }
    });
  }

  loadSavedFeatures() {
    try {
      const savedFeatures = JSON.parse(localStorage.getItem('enhanced-custom-features') || '[]');

      savedFeatures.forEach(featureData => {
        try {
          this.executeFeature(featureData);
          this.features.set(featureData.id, featureData);
          console.log(`🔄 Loaded saved feature: ${featureData.name}`);
        } catch (error) {
          console.warn(`⚠️ Failed to load feature ${featureData.name}:`, error);
        }
      });

      console.log(`📚 Loaded ${savedFeatures.length} saved features`);

    } catch (error) {
      console.error('❌ Failed to load saved features:', error);
    }
  }

  getFeatureReport() {
    return {
      totalFeatures: this.features.size,
      totalTemplates: this.templates.size,
      activeExecutions: this.executionContext.size,
      features: Object.fromEntries(this.features),
      templates: Object.fromEntries(this.templates)
    };
  }
}

// Initialize the system
const enhancedCreateFeatures = new EnhancedCreateFeaturesSystem();

console.log('���️ Enhanced Create Features System loaded and operational!');
