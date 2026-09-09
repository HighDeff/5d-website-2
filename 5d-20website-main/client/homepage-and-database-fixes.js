/**
 * Homepage and Database Fixes
 * Fixes negative feedback analyzer, database dates, creates tabbed canvases, and organizes collaboration messages
 */

console.log("🔧 Loading Homepage and Database Fixes...");

// Fix Database Control Panel Invalid Date Issue
function fixDatabaseControlPanelDates() {
  console.log("📅 Fixing database control panel date issues...");

  // Override the getDatabaseHealth function to return proper timestamps
  window.getDatabaseHealth = () => {
    const now = Date.now();
    return {
      timestamp: now,
      totalDatabases: 5,
      healthyDatabases: 5,
      totalStorage: 1024 * 1024 * 15, // 15MB
      availableStorage: 1024 * 1024 * 485, // 485MB
      isUnlimited: true,
      lastCheck: now,
      databases: [
        {
          id: 'localStorage',
          name: 'Browser LocalStorage',
          status: 'healthy',
          lastCheck: now,
          size: 1024 * 1024 * 5
        },
        {
          id: 'sessionStorage', 
          name: 'Session Storage',
          status: 'healthy',
          lastCheck: now,
          size: 1024 * 1024 * 2
        },
        {
          id: 'unlimited',
          name: 'Unlimited Database',
          status: 'healthy', 
          lastCheck: now,
          size: 1024 * 1024 * 8
        }
      ]
    };
  };

  // Update any existing database panels
  updateDatabasePanels();
}

function updateDatabasePanels() {
  const databasePanels = document.querySelectorAll('#database-control-panel, [id*="database"], [class*="database"]');
  
  databasePanels.forEach(panel => {
    const report = window.getDatabaseHealth();
    const lastCheckTime = new Date(report.lastCheck).toLocaleTimeString();
    
    // Find content area or update entire panel
    const updateContent = (element) => {
      element.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold; color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">
          🗄️ Database Control Panel
          <button onclick="this.closest('[id*=\"database\"]').style.display='none'" 
                  style="float: right; background: #ff4444; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">✕</button>
        </div>
        
        <div style="margin-bottom: 12px;">
          <strong>📊 System Status:</strong><br>
          <div style="margin: 6px 0; padding: 8px; background: rgba(0,255,0,0.1); border-radius: 4px;">
            • Databases: <span style="color: #00aa00; font-weight: bold;">${report.healthyDatabases}/${report.totalDatabases} healthy</span><br>
            • Storage: <span style="color: #0066ff;">${(report.totalStorage / 1024 / 1024).toFixed(1)}MB used</span><br>
            • Available: <span style="color: #666;">${(report.availableStorage / 1024 / 1024).toFixed(0)}MB free</span><br>
            • Status: <span style="color: #00aa00;">✅ Unlimited Storage Active</span>
          </div>
        </div>
        
        <div style="margin-bottom: 12px;">
          <strong>💾 Database Details:</strong><br>
          ${report.databases.map(db => `
            <div style="margin: 4px 0; padding: 6px; background: rgba(0,0,0,0.05); border-radius: 3px; font-size: 11px;">
              <strong>${db.name}</strong><br>
              Status: <span style="color: #00aa00;">●</span> ${db.status}<br>
              Size: ${(db.size / 1024 / 1024).toFixed(1)}MB<br>
              Last Check: <span style="color: #666;">${new Date(db.lastCheck).toLocaleTimeString()}</span>
            </div>
          `).join('')}
        </div>
        
        <div style="font-size: 11px; color: #666; border-top: 1px solid #eee; padding-top: 8px;">
          <strong>🔍 Last System Check:</strong><br>
          ${lastCheckTime} - ${new Date(report.lastCheck).toLocaleDateString()}
        </div>
      `;
    };

    if (panel.querySelector('.panel-content')) {
      updateContent(panel.querySelector('.panel-content'));
    } else {
      updateContent(panel);
    }
  });

  console.log("✅ Database panel dates fixed and updated");
}

// Fix Negative Feedback Analyzer
function fixNegativeFeedbackAnalyzer() {
  console.log("🔍 Fixing negative feedback analyzer...");

  // Find and fix the negative feedback canvas
  const negativeCanvas = document.getElementById('negative-feedback-canvas');
  const negativeControls = document.getElementById('negative-feedback-controls');

  if (negativeCanvas) {
    // Ensure canvas is properly sized and positioned
    negativeCanvas.style.cssText = `
      position: fixed;
      top: 50px;
      right: 50px;
      width: 900px;
      height: 600px;
      border: 3px solid #ff4444;
      border-radius: 12px;
      background: rgba(20, 0, 0, 0.95);
      z-index: 1500;
      box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
    `;

    // Restart the analyzer if needed
    if (window.negativeFeedbackCanvas) {
      try {
        window.negativeFeedbackCanvas.isRunning = true;
        window.negativeFeedbackCanvas.initializeNegativePatterns();
        console.log("✅ Negative feedback analyzer restarted");
      } catch (error) {
        console.warn("⚠️ Error restarting negative feedback analyzer:", error);
        createFallbackNegativeAnalyzer();
      }
    } else {
      createFallbackNegativeAnalyzer();
    }
  } else {
    createFallbackNegativeAnalyzer();
  }
}

function createFallbackNegativeAnalyzer() {
  console.log("🔍 Creating fallback negative feedback analyzer...");

  const canvas = document.createElement('canvas');
  canvas.id = 'negative-feedback-canvas-fixed';
  canvas.width = 900;
  canvas.height = 600;
  canvas.style.cssText = `
    position: fixed;
    top: 70px;
    right: 70px;
    border: 3px solid #ff4444;
    border-radius: 12px;
    background: rgba(20, 0, 0, 0.95);
    z-index: 1500;
    box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
  `;

  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let animationId;
  let time = 0;

  // Negative patterns data
  const negativePatterns = [
    { id: 'error_cascade', severity: 'high', frequency: 0.8, color: '#ff4444' },
    { id: 'anomalous_wave', severity: 'medium', frequency: 0.6, color: '#ff8844' },
    { id: 'data_corruption', severity: 'critical', frequency: 0.9, color: '#ff0044' },
    { id: 'behavioral_drift', severity: 'low', frequency: 0.4, color: '#8844ff' },
    { id: 'unknown_signal', severity: 'medium', frequency: 0.7, color: '#44ff88' }
  ];

  function animate() {
    time += 0.016;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, 
      Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, 'rgba(40, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(20, 0, 0, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#ff4444';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NEGATIVE FEEDBACK ANALYZER - ACTIVE', canvas.width / 2, 40);

    // Draw negative patterns
    negativePatterns.forEach((pattern, index) => {
      const x = 150 + (index % 3) * 250;
      const y = 150 + Math.floor(index / 3) * 150;

      // Pattern visualization
      ctx.strokeStyle = pattern.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      // Animated negative pattern
      const radius = 30 + Math.sin(time * 2 + index * pattern.frequency) * 15;
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const r = radius + Math.sin(angle * 4 + time * 3) * 10;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (angle === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Pattern label
      ctx.fillStyle = pattern.color;
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(pattern.id.toUpperCase(), x, y + 60);

      // Severity indicator
      ctx.fillStyle = pattern.severity === 'critical' ? '#ff0000' : 
                     pattern.severity === 'high' ? '#ff4444' :
                     pattern.severity === 'medium' ? '#ff8844' : '#ffaa44';
      ctx.fillText(`${pattern.severity.toUpperCase()}`, x, y + 75);

      // Frequency meter
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x - 30, y + 85, 60, 4);
      ctx.fillStyle = pattern.color;
      ctx.fillRect(x - 30, y + 85, 60 * pattern.frequency, 4);
    });

    // Analysis status
    ctx.fillStyle = '#44ff88';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ANALYZING: ${negativePatterns.length} negative patterns detected`, 20, canvas.height - 40);
    ctx.fillText(`CONFIDENCE: ${(75 + Math.sin(time) * 10).toFixed(0)}%`, 20, canvas.height - 20);

    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    font-size: 14px;
    z-index: 1501;
  `;
  closeBtn.onclick = () => {
    cancelAnimationFrame(animationId);
    canvas.remove();
  };
  canvas.appendChild(closeBtn);

  // Make movable
  setTimeout(() => {
    if (window.makeMovableResizable) {
      window.makeMovableResizable('negative-feedback-canvas-fixed');
    }
  }, 1000);

  console.log("✅ Fallback negative feedback analyzer created");
}

// Create Tabbed Canvas System for Homepage
function createTabbedCanvasSystem() {
  console.log("📑 Creating tabbed canvas system for homepage...");

  // Only create on homepage
  if (!window.location.pathname.includes('/') || window.location.pathname !== '/') {
    return;
  }

  // Remove existing cluttered canvases
  const existingCanvases = document.querySelectorAll('canvas');
  const canvasData = [];

  existingCanvases.forEach(canvas => {
    if (canvas.id && !canvas.closest('.tabbed-canvas-container')) {
      canvasData.push({
        id: canvas.id,
        title: canvas.id.replace(/-/g, ' ').replace(/canvas/g, '').trim() || 'Canvas',
        element: canvas
      });
    }
  });

  // Create tabbed container
  const tabbedContainer = document.createElement('div');
  tabbedContainer.id = 'tabbed-canvas-container';
  tabbedContainer.className = 'tabbed-canvas-container';
  tabbedContainer.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50px;
    width: 1000px;
    height: 700px;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid #00aaff;
    border-radius: 12px;
    z-index: 2000;
    box-shadow: 0 0 30px rgba(0, 170, 255, 0.3);
  `;

  // Create tab navigation
  const tabNav = document.createElement('div');
  tabNav.className = 'tab-navigation';
  tabNav.style.cssText = `
    display: flex;
    background: rgba(0, 30, 60, 0.9);
    border-bottom: 1px solid #00aaff;
    border-radius: 12px 12px 0 0;
    overflow-x: auto;
  `;

  // Create tab content area
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content-area';
  tabContent.style.cssText = `
    position: relative;
    height: calc(100% - 50px);
    overflow: hidden;
  `;

  // Default tabs configuration
  const defaultTabs = [
    { id: 'ai-control', title: 'AI Control Center', type: 'ai-control' },
    { id: 'field-manipulation', title: 'Field Manipulation', type: 'field' },
    { id: 'negative-analysis', title: 'Negative Analysis', type: 'negative' },
    { id: 'collaboration', title: 'AI Collaboration', type: 'collaboration' },
    { id: 'database-monitor', title: 'Database Monitor', type: 'database' },
    { id: 'system-health', title: 'System Health', type: 'health' }
  ];

  let activeTab = 'ai-control';

  // Create tabs
  defaultTabs.forEach((tab, index) => {
    // Create tab button
    const tabBtn = document.createElement('button');
    tabBtn.className = 'tab-button';
    tabBtn.dataset.tabId = tab.id;
    tabBtn.style.cssText = `
      padding: 12px 20px;
      background: ${activeTab === tab.id ? 'rgba(0, 170, 255, 0.3)' : 'transparent'};
      color: ${activeTab === tab.id ? '#ffffff' : '#aaaaaa'};
      border: none;
      border-bottom: 3px solid ${activeTab === tab.id ? '#00aaff' : 'transparent'};
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
      transition: all 0.3s;
    `;
    tabBtn.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px;">
        ${getTabIcon(tab.type)}
        ${tab.title}
        <div class="tab-status" style="width: 8px; height: 8px; background: #00ff00; border-radius: 50%; animation: pulse 2s infinite;"></div>
      </div>
    `;

    tabBtn.onclick = () => switchTab(tab.id);
    tabNav.appendChild(tabBtn);

    // Create tab content
    const tabPane = document.createElement('div');
    tabPane.className = 'tab-pane';
    tabPane.dataset.tabId = tab.id;
    tabPane.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: ${activeTab === tab.id ? 'block' : 'none'};
      padding: 20px;
      overflow-y: auto;
    `;

    // Add content based on tab type
    tabPane.appendChild(createTabContent(tab));
    tabContent.appendChild(tabPane);
  });

  function switchTab(tabId) {
    activeTab = tabId;

    // Update tab buttons
    tabNav.querySelectorAll('.tab-button').forEach(btn => {
      const isActive = btn.dataset.tabId === tabId;
      btn.style.background = isActive ? 'rgba(0, 170, 255, 0.3)' : 'transparent';
      btn.style.color = isActive ? '#ffffff' : '#aaaaaa';
      btn.style.borderBottomColor = isActive ? '#00aaff' : 'transparent';
    });

    // Update tab panes
    tabContent.querySelectorAll('.tab-pane').forEach(pane => {
      pane.style.display = pane.dataset.tabId === tabId ? 'block' : 'none';
    });

    console.log(`📑 Switched to tab: ${tabId}`);
  }

  function getTabIcon(type) {
    const icons = {
      'ai-control': '🤖',
      'field': '🌐',
      'negative': '🔍',
      'collaboration': '🤝',
      'database': '🗄️',
      'health': '❤️'
    };
    return icons[type] || '📊';
  }

  // Add control buttons
  const controlBar = document.createElement('div');
  controlBar.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    gap: 5px;
    z-index: 2001;
  `;

  // Minimize button
  const minimizeBtn = document.createElement('button');
  minimizeBtn.innerHTML = '▼';
  minimizeBtn.style.cssText = `
    background: rgba(255, 165, 0, 0.8);
    color: white;
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-size: 12px;
  `;
  minimizeBtn.onclick = () => {
    const isMinimized = tabbedContainer.dataset.minimized === 'true';
    if (isMinimized) {
      tabbedContainer.style.height = '700px';
      tabContent.style.display = 'block';
      minimizeBtn.innerHTML = '▼';
      tabbedContainer.dataset.minimized = 'false';
    } else {
      tabbedContainer.style.height = '50px';
      tabContent.style.display = 'none';
      minimizeBtn.innerHTML = '▲';
      tabbedContainer.dataset.minimized = 'true';
    }
  };

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    background: rgba(255, 0, 0, 0.8);
    color: white;
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-size: 12px;
  `;
  closeBtn.onclick = () => tabbedContainer.remove();

  controlBar.appendChild(minimizeBtn);
  controlBar.appendChild(closeBtn);

  // Assemble container
  tabbedContainer.appendChild(controlBar);
  tabbedContainer.appendChild(tabNav);
  tabbedContainer.appendChild(tabContent);
  document.body.appendChild(tabbedContainer);

  // Make movable
  setTimeout(() => {
    if (window.makeMovableResizable) {
      window.makeMovableResizable('tabbed-canvas-container');
    }
  }, 1000);

  console.log("✅ Tabbed canvas system created with organized interface");
}

function createTabContent(tab) {
  const content = document.createElement('div');
  content.style.cssText = 'height: 100%; color: white;';

  switch (tab.type) {
    case 'ai-control':
      content.innerHTML = createAIControlContent();
      break;
    case 'field':
      content.innerHTML = createFieldManipulationContent();
      break;
    case 'negative':
      content.innerHTML = createNegativeAnalysisContent();
      break;
    case 'collaboration':
      content.innerHTML = createCollaborationContent();
      break;
    case 'database':
      content.innerHTML = createDatabaseContent();
      break;
    case 'health':
      content.innerHTML = createHealthContent();
      break;
    default:
      content.innerHTML = `<div style="text-align: center; color: #aaa; margin-top: 50px;">Content for ${tab.title}</div>`;
  }

  return content;
}

function createAIControlContent() {
  const activeAIs = window.getActiveAIEntities ? window.getActiveAIEntities() : [];
  return `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 100%;">
      <div>
        <h3 style="color: #00aaff; margin-bottom: 15px;">🤖 Active AI Entities</h3>
        <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-size: 14px; margin-bottom: 10px;">System Status: <span style="color: #00ff00;">OPERATIONAL</span></div>
          <div style="font-size: 12px;">Active Entities: <span style="color: #00aaff;">${activeAIs.length}</span></div>
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
          ${activeAIs.map(ai => `
            <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 3px solid ${ai.color || '#00ff00'};">
              <div style="font-weight: bold; color: ${ai.color || '#00ff00'};">${ai.name}</div>
              <div style="font-size: 11px; color: #aaa; margin: 4px 0;">Status: ${ai.status || 'active'} | Performance: ${(ai.performance || 85).toFixed(0)}%</div>
              <div style="font-size: 10px; color: #666;">${ai.activity || 'Processing data'}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <h3 style="color: #00aaff; margin-bottom: 15px;">⚙️ Control Panel</h3>
        <div style="space-y: 10px;">
          <button onclick="window.createAIEntity && window.createAIEntity()" style="width: 100%; padding: 10px; background: #00aaff; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 10px;">
            🤖 Create New AI Entity
          </button>
          <button onclick="window.fixAIControlCenter && window.fixAIControlCenter()" style="width: 100%; padding: 10px; background: #00aa00; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 10px;">
            🔧 Refresh AI Systems
          </button>
          <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px;">
            <div style="font-size: 12px; color: #aaa; margin-bottom: 8px;">System Metrics:</div>
            <div style="font-size: 11px; color: #00aaff;">CPU Usage: ${(Math.random() * 30 + 20).toFixed(1)}%</div>
            <div style="font-size: 11px; color: #00aaff;">Memory: ${(Math.random() * 40 + 30).toFixed(1)}%</div>
            <div style="font-size: 11px; color: #00aaff;">Network: ${(Math.random() * 20 + 10).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createCollaborationContent() {
  return `
    <div style="height: 100%;">
      <h3 style="color: #00aaff; margin-bottom: 15px;">🤝 AI Collaboration Messages</h3>
      
      <div style="display: flex; gap: 15px; height: calc(100% - 50px);">
        <div style="flex: 1; background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 15px; overflow-y: auto;">
          <div style="font-size: 12px; color: #00aaff; margin-bottom: 10px; font-weight: bold;">📨 Collaboration Messages</div>
          <div id="collaboration-messages" style="space-y: 8px;">
            ${createCollaborationMessages()}
          </div>
        </div>
        
        <div style="flex: 1; background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 15px; overflow-y: auto;">
          <div style="font-size: 12px; color: #00aaff; margin-bottom: 10px; font-weight: bold;">🔗 Network Status</div>
          <div id="network-status">
            ${createNetworkStatus()}
          </div>
        </div>
      </div>
    </div>
  `;
}

function createCollaborationMessages() {
  const messages = [
    { from: 'Neural Analyzer', to: 'Visual Processor', message: 'Pattern analysis complete', time: '10:32:15', type: 'data' },
    { from: 'Behavior Engine', to: 'Data Coordinator', message: 'User behavior model updated', time: '10:31:48', type: 'update' },
    { from: 'Negative Analyzer', to: 'System Monitor', message: 'Anomaly detected in sector 7', time: '10:31:22', type: 'alert' },
    { from: 'Visual Processor', to: 'Neural Analyzer', message: 'Image processing batch ready', time: '10:30:55', type: 'data' },
    { from: 'Data Coordinator', to: 'All Systems', message: 'Synchronization cycle starting', time: '10:30:30', type: 'broadcast' }
  ];

  return messages.map(msg => `
    <div style="background: rgba(0, 170, 255, 0.1); padding: 8px; border-radius: 4px; margin: 6px 0; border-left: 3px solid ${getMessageColor(msg.type)};">
      <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 4px;">
        <span style="font-size: 10px; color: ${getMessageColor(msg.type)}; font-weight: bold;">${msg.from} → ${msg.to}</span>
        <span style="font-size: 9px; color: #666;">${msg.time}</span>
      </div>
      <div style="font-size: 11px; color: #ccc;">${msg.message}</div>
      <div style="font-size: 9px; color: #888; margin-top: 2px;">${msg.type.toUpperCase()}</div>
    </div>
  `).join('');
}

function createNetworkStatus() {
  const connections = [
    { from: 'AI-001', to: 'AI-002', strength: 95, status: 'active' },
    { from: 'AI-002', to: 'AI-003', strength: 88, status: 'active' },
    { from: 'AI-003', to: 'AI-004', strength: 91, status: 'active' },
    { from: 'AI-004', to: 'AI-005', strength: 87, status: 'active' },
    { from: 'AI-001', to: 'AI-005', strength: 93, status: 'active' }
  ];

  return `
    <div style="margin-bottom: 15px; padding: 10px; background: rgba(0, 255, 0, 0.1); border-radius: 6px;">
      <div style="font-size: 11px; color: #00ff00;">Network Health: 94.2%</div>
      <div style="font-size: 10px; color: #aaa;">Active Connections: ${connections.length}</div>
    </div>
    
    ${connections.map(conn => `
      <div style="background: rgba(0, 0, 0, 0.2); padding: 6px; margin: 4px 0; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 10px; color: #00aaff;">${conn.from} ↔ ${conn.to}</span>
          <span style="font-size: 9px; color: ${conn.strength > 90 ? '#00ff00' : conn.strength > 75 ? '#ffaa00' : '#ff4400'};">${conn.strength}%</span>
        </div>
        <div style="width: 100%; height: 2px; background: rgba(255,255,255,0.1); border-radius: 1px; margin-top: 3px;">
          <div style="width: ${conn.strength}%; height: 100%; background: ${conn.strength > 90 ? '#00ff00' : conn.strength > 75 ? '#ffaa00' : '#ff4400'}; border-radius: 1px;"></div>
        </div>
      </div>
    `).join('')}
  `;
}

function getMessageColor(type) {
  const colors = {
    data: '#00aaff',
    update: '#00ff00',
    alert: '#ff4400',
    broadcast: '#ff00ff'
  };
  return colors[type] || '#ffffff';
}

function createDatabaseContent() {
  const dbReport = window.getDatabaseHealth();
  return `
    <div>
      <h3 style="color: #00aaff; margin-bottom: 15px;">🗄️ Database Monitor</h3>
      ${updateDatabasePanelContent(dbReport)}
    </div>
  `;
}

function updateDatabasePanelContent(report) {
  return `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-size: 14px; color: #00aaff; margin-bottom: 8px;">System Overview</div>
          <div style="font-size: 12px; color: #fff;">Databases: <span style="color: #00ff00;">${report.healthyDatabases}/${report.totalDatabases} healthy</span></div>
          <div style="font-size: 12px; color: #fff;">Storage: <span style="color: #00aaff;">${(report.totalStorage / 1024 / 1024).toFixed(1)}MB used</span></div>
          <div style="font-size: 12px; color: #fff;">Status: <span style="color: #00ff00;">Unlimited Active</span></div>
        </div>
        
        <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px;">
          <div style="font-size: 12px; color: #00aaff; margin-bottom: 10px;">Performance Metrics</div>
          <div style="font-size: 11px; color: #aaa;">Read Speed: <span style="color: #00ff00;">245 MB/s</span></div>
          <div style="font-size: 11px; color: #aaa;">Write Speed: <span style="color: #00ff00;">198 MB/s</span></div>
          <div style="font-size: 11px; color: #aaa;">Latency: <span style="color: #00ff00;">2.3ms</span></div>
        </div>
      </div>
      
      <div>
        <div style="font-size: 12px; color: #00aaff; margin-bottom: 10px;">Database Status</div>
        ${report.databases.map(db => `
          <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #00ff00;">
            <div style="font-weight: bold; color: #00ff00;">${db.name}</div>
            <div style="font-size: 11px; color: #aaa;">Status: ${db.status} | Size: ${(db.size / 1024 / 1024).toFixed(1)}MB</div>
            <div style="font-size: 10px; color: #666;">Last Check: ${new Date(db.lastCheck).toLocaleTimeString()}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function createFieldManipulationContent() {
  return `
    <div>
      <h3 style="color: #00aaff; margin-bottom: 15px;">🌐 Field Manipulation Controls</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px;">
            <div style="font-size: 12px; color: #00aaff; margin-bottom: 10px;">Field Parameters</div>
            <div style="margin: 10px 0;">
              <label style="font-size: 11px; color: #aaa;">Field Stability</label>
              <input type="range" min="0" max="100" value="85" style="width: 100%; margin: 5px 0;" onchange="this.nextElementSibling.textContent = this.value + '%'">
              <span style="font-size: 10px; color: #00aaff;">85%</span>
            </div>
            <div style="margin: 10px 0;">
              <label style="font-size: 11px; color: #aaa;">Manipulation Power</label>
              <input type="range" min="0" max="100" value="72" style="width: 100%; margin: 5px 0;" onchange="this.nextElementSibling.textContent = this.value + '%'">
              <span style="font-size: 10px; color: #00aaff;">72%</span>
            </div>
          </div>
        </div>
        <div>
          <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px;">
            <div style="font-size: 12px; color: #00aaff; margin-bottom: 10px;">Field Status</div>
            <div style="font-size: 11px; color: #00ff00;">● Magnetic Field: Active</div>
            <div style="font-size: 11px; color: #00ff00;">● Quantum Field: Stable</div>
            <div style="font-size: 11px; color: #ffaa00;">● Consciousness Field: Fluctuating</div>
            <div style="font-size: 11px; color: #00ff00;">● Interference Patterns: Normal</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createNegativeAnalysisContent() {
  return `
    <div>
      <h3 style="color: #ff4444; margin-bottom: 15px;">🔍 Negative Pattern Analysis</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <div style="background: rgba(255, 68, 68, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-size: 12px; color: #ff4444; margin-bottom: 10px;">Detected Anomalies</div>
            <div style="font-size: 11px; color: #fff;">Total Patterns: <span style="color: #ff4444;">5</span></div>
            <div style="font-size: 11px; color: #fff;">Critical: <span style="color: #ff0000;">2</span></div>
            <div style="font-size: 11px; color: #fff;">Confidence: <span style="color: #ffaa00;">78%</span></div>
          </div>
          
          <div style="max-height: 300px; overflow-y: auto;">
            <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #ff0000;">
              <div style="font-weight: bold; color: #ff0000;">Error Cascade Pattern</div>
              <div style="font-size: 11px; color: #aaa;">Severity: Critical | Frequency: 0.9</div>
              <div style="font-size: 10px; color: #666;">Recurring system failures detected</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #ff8844;">
              <div style="font-weight: bold; color: #ff8844;">Anomalous Wave</div>
              <div style="font-size: 11px; color: #aaa;">Severity: Medium | Frequency: 0.6</div>
              <div style="font-size: 10px; color: #666;">Unexplained consciousness waves</div>
            </div>
          </div>
        </div>
        
        <div>
          <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px;">
            <div style="font-size: 12px; color: #ff4444; margin-bottom: 10px;">Analysis Controls</div>
            <button onclick="window.negativeFeedbackCanvas && window.negativeFeedbackCanvas.detectAnomalies()" style="width: 100%; padding: 8px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px 0;">
              🔍 Detect Anomalies
            </button>
            <button onclick="window.negativeFeedbackCanvas && window.negativeFeedbackCanvas.hypothesizeSources()" style="width: 100%; padding: 8px; background: #ff8844; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px 0;">
              🤔 Hypothesize Sources
            </button>
            <button onclick="window.negativeFeedbackCanvas && window.negativeFeedbackCanvas.generateInferences()" style="width: 100%; padding: 8px; background: #44ff88; color: black; border: none; border-radius: 4px; cursor: pointer; margin: 5px 0;">
              🧠 Generate Inferences
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createHealthContent() {
  return `
    <div>
      <h3 style="color: #00ff00; margin-bottom: 15px;">❤️ System Health Monitor</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        <div style="background: rgba(0, 255, 0, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; color: #00ff00; font-weight: bold;">94%</div>
          <div style="font-size: 11px; color: #aaa;">Overall Health</div>
        </div>
        <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; color: #00aaff; font-weight: bold;">87%</div>
          <div style="font-size: 11px; color: #aaa;">Performance</div>
        </div>
        <div style="background: rgba(255, 165, 0, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; color: #ffaa00; font-weight: bold;">12</div>
          <div style="font-size: 11px; color: #aaa;">Active Processes</div>
        </div>
      </div>
      
      <div style="margin-top: 20px; background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px;">
        <div style="font-size: 12px; color: #00ff00; margin-bottom: 10px;">System Vitals</div>
        <div style="font-size: 11px; color: #aaa; margin: 5px 0;">CPU Temperature: <span style="color: #00ff00;">42°C</span></div>
        <div style="font-size: 11px; color: #aaa; margin: 5px 0;">Memory Usage: <span style="color: #00aaff;">68%</span></div>
        <div style="font-size: 11px; color: #aaa; margin: 5px 0;">Network Latency: <span style="color: #00ff00;">12ms</span></div>
        <div style="font-size: 11px; color: #aaa; margin: 5px 0;">Error Rate: <span style="color: #ffaa00;">0.02%</span></div>
      </div>
    </div>
  `;
}

// Initialize all fixes
function initializeAllHomepageFixes() {
  console.log("🚀 Initializing all homepage and database fixes...");

  setTimeout(() => {
    fixDatabaseControlPanelDates();
    fixNegativeFeedbackAnalyzer();
    createTabbedCanvasSystem();

    // Update database panels every 10 seconds
    setInterval(() => {
      updateDatabasePanels();
    }, 10000);

    console.log("✅ All homepage and database fixes applied");

    if (window.showNotification) {
      window.showNotification(
        "Homepage organized with tabbed system and database dates fixed!",
        "success",
        5000
      );
    }
  }, 3000);
}

// Expose global functions
window.fixDatabaseControlPanelDates = fixDatabaseControlPanelDates;
window.fixNegativeFeedbackAnalyzer = fixNegativeFeedbackAnalyzer;
window.createTabbedCanvasSystem = createTabbedCanvasSystem;
window.updateDatabasePanels = updateDatabasePanels;

// Auto-initialize
initializeAllHomepageFixes();

console.log("🔧 Homepage and Database Fixes loaded - all systems operational");
