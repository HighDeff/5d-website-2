/**
 * Interactive AI Control System
 * Clickable AI entities, chat, task management, and enhanced controls
 */

console.log("🤖 Loading Interactive AI Control System...");

// AI Entity Interaction Manager
class AIEntityInteractionManager {
  constructor() {
    this.selectedEntity = null;
    this.chatSessions = new Map();
    this.taskQueue = new Map();
    this.activeDialogs = new Map();
    this.entityStats = new Map();
  }

  initialize() {
    console.log("🎯 Initializing AI Entity Interaction Manager...");
    
    // Setup entity stats
    this.initializeEntityStats();
    
    // Setup task system
    this.initializeTaskSystem();
    
    // Setup chat system
    this.initializeChatSystem();
    
    console.log("✅ AI Entity Interaction Manager initialized");
  }

  initializeEntityStats() {
    const entities = window.getActiveAIEntities ? window.getActiveAIEntities() : [];
    
    entities.forEach(entity => {
      this.entityStats.set(entity.id, {
        ...entity,
        detailedStats: {
          uptime: Math.random() * 24,
          processedTasks: Math.floor(Math.random() * 500),
          successRate: 0.85 + Math.random() * 0.15,
          errorCount: Math.floor(Math.random() * 10),
          warningCount: Math.floor(Math.random() * 25),
          memoryUsage: Math.random() * 80 + 10,
          cpuUsage: Math.random() * 60 + 20,
          networkLatency: Math.random() * 50 + 5,
          lastActivity: Date.now() - Math.random() * 3600000,
          capabilities: [
            'Data Processing',
            'Pattern Recognition', 
            'Task Automation',
            'Error Detection',
            'Performance Optimization'
          ],
          currentTasks: this.generateRandomTasks(),
          recentErrors: this.generateRecentErrors(),
          recentWarnings: this.generateRecentWarnings()
        }
      });
    });
  }

  generateRandomTasks() {
    const taskTypes = [
      'Processing user data batch #347',
      'Analyzing pattern correlations',
      'Optimizing memory allocation',
      'Scanning for anomalies in sector 12',
      'Coordinating with AI network nodes',
      'Updating behavioral models',
      'Performing system health check',
      'Processing visual content queue'
    ];
    
    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      description: taskTypes[Math.floor(Math.random() * taskTypes.length)],
      progress: Math.random() * 100,
      priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      estimatedCompletion: Date.now() + Math.random() * 3600000,
      status: ['running', 'paused', 'queued'][Math.floor(Math.random() * 3)]
    }));
  }

  generateRecentErrors() {
    const errorTypes = [
      'Memory allocation failed in pattern recognition module',
      'Network timeout during data synchronization', 
      'Invalid data format in processing queue',
      'Resource exhaustion in analysis engine',
      'Connection lost to database cluster'
    ];
    
    return Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      message: errorTypes[Math.floor(Math.random() * errorTypes.length)],
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      timestamp: Date.now() - Math.random() * 86400000,
      resolved: Math.random() > 0.3,
      component: ['ProcessingEngine', 'NetworkManager', 'DataAnalyzer', 'MemoryManager'][Math.floor(Math.random() * 4)]
    }));
  }

  generateRecentWarnings() {
    const warningTypes = [
      'High memory usage detected (87%)',
      'Processing queue approaching capacity',
      'Network latency increasing (45ms)',
      'Unusual pattern detected in user behavior',
      'Performance degradation in visual processing'
    ];
    
    return Array.from({ length: Math.floor(Math.random() * 5) + 2 }, () => ({
      id: `warning_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      message: warningTypes[Math.floor(Math.random() * warningTypes.length)],
      severity: ['info', 'warning', 'attention'][Math.floor(Math.random() * 3)],
      timestamp: Date.now() - Math.random() * 43200000,
      acknowledged: Math.random() > 0.5,
      component: ['SystemMonitor', 'PerformanceTracker', 'ResourceManager'][Math.floor(Math.random() * 3)]
    }));
  }

  initializeTaskSystem() {
    this.taskQueue.set('global', [
      {
        id: 'task_001',
        title: 'Optimize Pattern Recognition',
        description: 'Improve pattern recognition accuracy by 15%',
        assignedTo: null,
        priority: 'high',
        progress: 0,
        status: 'pending'
      },
      {
        id: 'task_002', 
        title: 'Reduce Memory Usage',
        description: 'Optimize memory allocation to reduce usage by 20%',
        assignedTo: null,
        priority: 'medium',
        progress: 0,
        status: 'pending'
      },
      {
        id: 'task_003',
        title: 'Enhance Error Detection',
        description: 'Implement advanced error detection algorithms',
        assignedTo: null,
        priority: 'critical',
        progress: 0,
        status: 'pending'
      }
    ]);
  }

  initializeChatSystem() {
    const entities = window.getActiveAIEntities ? window.getActiveAIEntities() : [];
    
    entities.forEach(entity => {
      this.chatSessions.set(entity.id, {
        messages: [
          {
            id: 'msg_001',
            from: 'system',
            message: `Hello! I'm ${entity.name}. How can I assist you today?`,
            timestamp: Date.now() - 300000,
            type: 'greeting'
          }
        ],
        isActive: false,
        unreadCount: 0
      });
    });
  }

  makeEntityClickable(entityElement, entityData) {
    if (!entityElement || !entityData) return;

    entityElement.style.cursor = 'pointer';
    entityElement.style.transition = 'all 0.2s';
    
    entityElement.addEventListener('mouseenter', () => {
      entityElement.style.transform = 'scale(1.05)';
      entityElement.style.boxShadow = `0 0 15px ${entityData.color || '#00ff00'}`;
    });
    
    entityElement.addEventListener('mouseleave', () => {
      entityElement.style.transform = 'scale(1)';
      entityElement.style.boxShadow = 'none';
    });
    
    entityElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.openEntityDialog(entityData);
    });
  }

  openEntityDialog(entityData) {
    const entityStats = this.entityStats.get(entityData.id);
    
    // Close any existing dialog
    this.closeEntityDialog();

    // Create dialog overlay
    const overlay = document.createElement('div');
    overlay.id = 'entity-dialog-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create dialog
    const dialog = document.createElement('div');
    dialog.id = 'entity-dialog';
    dialog.style.cssText = `
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 2px solid ${entityData.color || '#00ff00'};
      border-radius: 16px;
      width: 900px;
      height: 700px;
      color: white;
      overflow: hidden;
      box-shadow: 0 0 30px ${entityData.color || '#00ff00'}50;
      position: relative;
    `;

    dialog.innerHTML = this.createEntityDialogContent(entityData, entityStats);
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Setup dialog interactions
    this.setupDialogInteractions(entityData);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeEntityDialog();
      }
    });

    this.selectedEntity = entityData;
    console.log(`🎯 Opened dialog for ${entityData.name}`);
  }

  createEntityDialogContent(entityData, entityStats) {
    return `
      <div style="display: flex; height: 100%;">
        <!-- Left Panel: Navigation -->
        <div style="width: 200px; background: rgba(0,0,0,0.3); padding: 20px; border-right: 1px solid ${entityData.color || '#00ff00'};">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: ${entityData.color || '#00ff00'}; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
              🤖
            </div>
            <h3 style="margin: 0; font-size: 14px; color: ${entityData.color || '#00ff00'};">${entityData.name}</h3>
            <div style="font-size: 10px; color: #aaa; margin-top: 4px;">${entityData.type || 'AI Entity'}</div>
          </div>
          
          <div class="dialog-nav" style="space-y: 8px;">
            <button class="nav-btn active" data-tab="overview" style="width: 100%; padding: 8px; background: ${entityData.color || '#00ff00'}20; color: ${entityData.color || '#00ff00'}; border: 1px solid ${entityData.color || '#00ff00'}; border-radius: 4px; cursor: pointer; font-size: 11px;">
              📊 Overview
            </button>
            <button class="nav-btn" data-tab="tasks" style="width: 100%; padding: 8px; background: transparent; color: #aaa; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-size: 11px; margin-top: 4px;">
              📋 Tasks
            </button>
            <button class="nav-btn" data-tab="chat" style="width: 100%; padding: 8px; background: transparent; color: #aaa; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-size: 11px; margin-top: 4px;">
              💬 Chat
            </button>
            <button class="nav-btn" data-tab="errors" style="width: 100%; padding: 8px; background: transparent; color: #aaa; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-size: 11px; margin-top: 4px;">
              ⚠️ Errors
            </button>
            <button class="nav-btn" data-tab="settings" style="width: 100%; padding: 8px; background: transparent; color: #aaa; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-size: 11px; margin-top: 4px;">
              ⚙️ Settings
            </button>
          </div>
        </div>

        <!-- Right Panel: Content -->
        <div style="flex: 1; padding: 20px; overflow-y: auto;">
          <!-- Close Button -->
          <button onclick="window.aiEntityInteractionManager.closeEntityDialog()" style="position: absolute; top: 15px; right: 15px; background: #ff4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 16px;">
            ✕
          </button>

          <!-- Tab Content -->
          <div id="dialog-content">
            ${this.createOverviewContent(entityData, entityStats)}
          </div>
        </div>
      </div>
    `;
  }

  createOverviewContent(entityData, entityStats) {
    if (!entityStats) return '<div>No stats available</div>';

    return `
      <div>
        <h2 style="color: ${entityData.color || '#00ff00'}; margin-bottom: 20px;">📊 ${entityData.name} Overview</h2>
        
        <!-- Performance Metrics -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border-left: 3px solid #00ff00;">
            <div style="font-size: 12px; color: #aaa;">Performance</div>
            <div style="font-size: 20px; color: #00ff00; font-weight: bold;">${(entityStats.detailedStats.successRate * 100).toFixed(1)}%</div>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border-left: 3px solid #00aaff;">
            <div style="font-size: 12px; color: #aaa;">Tasks Processed</div>
            <div style="font-size: 20px; color: #00aaff; font-weight: bold;">${entityStats.detailedStats.processedTasks}</div>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border-left: 3px solid #ffaa00;">
            <div style="font-size: 12px; color: #aaa;">Uptime</div>
            <div style="font-size: 20px; color: #ffaa00; font-weight: bold;">${entityStats.detailedStats.uptime.toFixed(1)}h</div>
          </div>
        </div>

        <!-- System Resources -->
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #00aaff; margin-bottom: 10px; font-size: 14px;">System Resources</h3>
          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span>CPU Usage</span>
              <span>${entityStats.detailedStats.cpuUsage.toFixed(1)}%</span>
            </div>
            <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;">
              <div style="width: ${entityStats.detailedStats.cpuUsage}%; height: 100%; background: ${entityStats.detailedStats.cpuUsage > 80 ? '#ff4444' : entityStats.detailedStats.cpuUsage > 60 ? '#ffaa00' : '#00ff00'}; border-radius: 2px;"></div>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span>Memory Usage</span>
              <span>${entityStats.detailedStats.memoryUsage.toFixed(1)}%</span>
            </div>
            <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;">
              <div style="width: ${entityStats.detailedStats.memoryUsage}%; height: 100%; background: ${entityStats.detailedStats.memoryUsage > 80 ? '#ff4444' : entityStats.detailedStats.memoryUsage > 60 ? '#ffaa00' : '#00ff00'}; border-radius: 2px;"></div>
            </div>
          </div>
          <div style="font-size: 11px; color: #aaa;">
            Network Latency: <span style="color: #00aaff;">${entityStats.detailedStats.networkLatency.toFixed(1)}ms</span>
          </div>
        </div>

        <!-- Current Activity -->
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #00aaff; margin-bottom: 10px; font-size: 14px;">Current Activity</h3>
          <div style="font-size: 12px; color: #ccc; margin-bottom: 10px;">${entityData.activity || 'Processing data'}</div>
          <div style="font-size: 11px; color: #aaa;">
            Last Activity: ${new Date(entityStats.detailedStats.lastActivity).toLocaleString()}
          </div>
        </div>

        <!-- Quick Actions -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <button onclick="window.aiEntityInteractionManager.sendCommand('${entityData.id}', 'optimize')" style="padding: 10px; background: #00ff00; color: black; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">
            🚀 Optimize Performance
          </button>
          <button onclick="window.aiEntityInteractionManager.sendCommand('${entityData.id}', 'restart')" style="padding: 10px; background: #ffaa00; color: black; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">
            🔄 Restart Services
          </button>
          <button onclick="window.aiEntityInteractionManager.sendCommand('${entityData.id}', 'analyze')" style="padding: 10px; background: #00aaff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">
            🔍 Run Analysis
          </button>
          <button onclick="window.aiEntityInteractionManager.sendCommand('${entityData.id}', 'report')" style="padding: 10px; background: #8844ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">
            📋 Generate Report
          </button>
        </div>
      </div>
    `;
  }

  createTasksContent(entityData, entityStats) {
    const tasks = entityStats?.detailedStats.currentTasks || [];
    const availableTasks = this.taskQueue.get('global') || [];

    return `
      <div>
        <h2 style="color: ${entityData.color || '#00ff00'}; margin-bottom: 20px;">📋 Task Management</h2>
        
        <!-- Current Tasks -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #00aaff; margin-bottom: 10px; font-size: 14px;">Current Tasks (${tasks.length})</h3>
          <div style="max-height: 200px; overflow-y: auto;">
            ${tasks.map(task => `
              <div style="background: rgba(0,0,0,0.2); padding: 10px; margin: 6px 0; border-radius: 6px; border-left: 3px solid ${this.getTaskPriorityColor(task.priority)};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 12px; color: #fff; font-weight: bold;">${task.description}</span>
                  <span style="font-size: 10px; color: ${this.getTaskStatusColor(task.status)}; background: ${this.getTaskStatusColor(task.status)}20; padding: 2px 6px; border-radius: 10px;">${task.status.toUpperCase()}</span>
                </div>
                <div style="margin-bottom: 6px;">
                  <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                    <span>Progress: ${task.progress.toFixed(0)}%</span>
                    <span>Priority: ${task.priority}</span>
                  </div>
                  <div style="width: 100%; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px;">
                    <div style="width: ${task.progress}%; height: 100%; background: ${this.getTaskPriorityColor(task.priority)}; border-radius: 2px;"></div>
                  </div>
                </div>
                <div style="display: flex; gap: 5px;">
                  <button onclick="window.aiEntityInteractionManager.pauseTask('${task.id}')" style="font-size: 9px; padding: 3px 6px; background: #ffaa00; color: black; border: none; border-radius: 3px; cursor: pointer;">⏸️ Pause</button>
                  <button onclick="window.aiEntityInteractionManager.prioritizeTask('${task.id}')" style="font-size: 9px; padding: 3px 6px; background: #ff4444; color: white; border: none; border-radius: 3px; cursor: pointer;">⬆️ Priority</button>
                  <button onclick="window.aiEntityInteractionManager.cancelTask('${task.id}')" style="font-size: 9px; padding: 3px 6px; background: #666; color: white; border: none; border-radius: 3px; cursor: pointer;">✕ Cancel</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Available Tasks -->
        <div>
          <h3 style="color: #00aaff; margin-bottom: 10px; font-size: 14px;">Available Tasks</h3>
          <div style="max-height: 250px; overflow-y: auto;">
            ${availableTasks.map(task => `
              <div style="background: rgba(0,0,0,0.2); padding: 10px; margin: 6px 0; border-radius: 6px; border-left: 3px solid ${this.getTaskPriorityColor(task.priority)};">
                <div style="margin-bottom: 6px;">
                  <span style="font-size: 12px; color: #fff; font-weight: bold;">${task.title}</span>
                  <div style="font-size: 10px; color: #aaa; margin-top: 2px;">${task.description}</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 10px; color: ${this.getTaskPriorityColor(task.priority)};">Priority: ${task.priority}</span>
                  <button onclick="window.aiEntityInteractionManager.assignTask('${entityData.id}', '${task.id}')" style="font-size: 10px; padding: 4px 8px; background: #00ff00; color: black; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                    📥 Assign Task
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  createChatContent(entityData) {
    const chatSession = this.chatSessions.get(entityData.id);
    if (!chatSession) return '<div>Chat not available</div>';

    return `
      <div style="height: 100%; display: flex; flex-direction: column;">
        <h2 style="color: ${entityData.color || '#00ff00'}; margin-bottom: 20px;">💬 Chat with ${entityData.name}</h2>
        
        <!-- Chat Messages -->
        <div id="chat-messages" style="flex: 1; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px; margin-bottom: 15px; overflow-y: auto; max-height: 400px;">
          ${chatSession.messages.map(msg => `
            <div style="margin-bottom: 12px; ${msg.from === 'user' ? 'text-align: right;' : ''}">
              <div style="display: inline-block; max-width: 70%; background: ${msg.from === 'user' ? '#00aaff' : 'rgba(255,255,255,0.1)'}; padding: 8px 12px; border-radius: 12px; font-size: 12px;">
                <div style="font-weight: bold; margin-bottom: 4px; color: ${msg.from === 'user' ? '#fff' : entityData.color || '#00ff00'};">
                  ${msg.from === 'user' ? 'You' : entityData.name}
                </div>
                <div style="color: ${msg.from === 'user' ? '#fff' : '#ccc'};">${msg.message}</div>
                <div style="font-size: 9px; color: ${msg.from === 'user' ? '#ddd' : '#888'}; margin-top: 4px;">
                  ${new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Chat Input -->
        <div style="display: flex; gap: 8px;">
          <input type="text" id="chat-input" placeholder="Type your message..." style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid ${entityData.color || '#00ff00'}; border-radius: 6px; color: white; font-size: 12px;" onkeypress="if(event.key==='Enter') window.aiEntityInteractionManager.sendChatMessage('${entityData.id}')">
          <button onclick="window.aiEntityInteractionManager.sendChatMessage('${entityData.id}')" style="padding: 10px 15px; background: ${entityData.color || '#00ff00'}; color: black; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Send
          </button>
        </div>

        <!-- Quick Commands -->
        <div style="margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap;">
          <button onclick="window.aiEntityInteractionManager.sendQuickCommand('${entityData.id}', 'status')" style="font-size: 10px; padding: 4px 8px; background: rgba(255,255,255,0.1); color: #ccc; border: 1px solid #444; border-radius: 4px; cursor: pointer;">📊 Status</button>
          <button onclick="window.aiEntityInteractionManager.sendQuickCommand('${entityData.id}', 'help')" style="font-size: 10px; padding: 4px 8px; background: rgba(255,255,255,0.1); color: #ccc; border: 1px solid #444; border-radius: 4px; cursor: pointer;">❓ Help</button>
          <button onclick="window.aiEntityInteractionManager.sendQuickCommand('${entityData.id}', 'optimize')" style="font-size: 10px; padding: 4px 8px; background: rgba(255,255,255,0.1); color: #ccc; border: 1px solid #444; border-radius: 4px; cursor: pointer;">🚀 Optimize</button>
          <button onclick="window.aiEntityInteractionManager.sendQuickCommand('${entityData.id}', 'report')" style="font-size: 10px; padding: 4px 8px; background: rgba(255,255,255,0.1); color: #ccc; border: 1px solid #444; border-radius: 4px; cursor: pointer;">📋 Report</button>
        </div>
      </div>
    `;
  }

  createErrorsContent(entityData, entityStats) {
    const errors = entityStats?.detailedStats.recentErrors || [];
    const warnings = entityStats?.detailedStats.recentWarnings || [];

    return `
      <div>
        <h2 style="color: ${entityData.color || '#00ff00'}; margin-bottom: 20px;">⚠️ Errors & Warnings</h2>
        
        <!-- Errors Section -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #ff4444; margin-bottom: 10px; font-size: 14px;">🔴 Recent Errors (${errors.length})</h3>
          <div style="max-height: 200px; overflow-y: auto;">
            ${errors.map(error => `
              <div class="clickable-error" data-error-id="${error.id}" style="background: rgba(255,68,68,0.1); padding: 10px; margin: 6px 0; border-radius: 6px; border-left: 3px solid #ff4444; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,68,68,0.2)'" onmouseout="this.style.background='rgba(255,68,68,0.1)'">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 12px; color: #ff4444; font-weight: bold;">${error.component}</span>
                  <span style="font-size: 10px; color: ${error.resolved ? '#00ff00' : '#ff4444'}; background: ${error.resolved ? '#00ff0020' : '#ff444420'}; padding: 2px 6px; border-radius: 10px;">
                    ${error.resolved ? '✅ RESOLVED' : '❌ ACTIVE'}
                  </span>
                </div>
                <div style="font-size: 11px; color: #fff; margin-bottom: 4px;">${error.message}</div>
                <div style="font-size: 9px; color: #aaa;">
                  ${new Date(error.timestamp).toLocaleString()} | Severity: ${error.severity}
                </div>
                <div style="margin-top: 6px; font-size: 9px; color: #888;">
                  Click for details and resolution options
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Warnings Section -->
        <div>
          <h3 style="color: #ffaa00; margin-bottom: 10px; font-size: 14px;">🟡 Recent Warnings (${warnings.length})</h3>
          <div style="max-height: 200px; overflow-y: auto;">
            ${warnings.map(warning => `
              <div class="clickable-warning" data-warning-id="${warning.id}" style="background: rgba(255,170,0,0.1); padding: 10px; margin: 6px 0; border-radius: 6px; border-left: 3px solid #ffaa00; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,170,0,0.2)'" onmouseout="this.style.background='rgba(255,170,0,0.1)'">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 12px; color: #ffaa00; font-weight: bold;">${warning.component}</span>
                  <span style="font-size: 10px; color: ${warning.acknowledged ? '#00ff00' : '#ffaa00'}; background: ${warning.acknowledged ? '#00ff0020' : '#ffaa0020'}; padding: 2px 6px; border-radius: 10px;">
                    ${warning.acknowledged ? '👍 ACK' : '⏳ PENDING'}
                  </span>
                </div>
                <div style="font-size: 11px; color: #fff; margin-bottom: 4px;">${warning.message}</div>
                <div style="font-size: 9px; color: #aaa;">
                  ${new Date(warning.timestamp).toLocaleString()} | Level: ${warning.severity}
                </div>
                <div style="margin-top: 6px; font-size: 9px; color: #888;">
                  Click for details and action options
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  setupDialogInteractions(entityData) {
    // Setup tab navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchDialogTab(entityData, tab);
        
        // Update button styles
        document.querySelectorAll('.nav-btn').forEach(b => {
          b.style.background = 'transparent';
          b.style.color = '#aaa';
          b.style.borderColor = '#444';
        });
        btn.style.background = `${entityData.color || '#00ff00'}20`;
        btn.style.color = entityData.color || '#00ff00';
        btn.style.borderColor = entityData.color || '#00ff00';
      });
    });

    // Setup error/warning click handlers
    setTimeout(() => {
      document.querySelectorAll('.clickable-error').forEach(errorElement => {
        errorElement.addEventListener('click', () => {
          const errorId = errorElement.dataset.errorId;
          this.openErrorDetailDialog(entityData, errorId, 'error');
        });
      });

      document.querySelectorAll('.clickable-warning').forEach(warningElement => {
        warningElement.addEventListener('click', () => {
          const warningId = warningElement.dataset.warningId;
          this.openErrorDetailDialog(entityData, warningId, 'warning');
        });
      });
    }, 100);
  }

  switchDialogTab(entityData, tab) {
    const contentDiv = document.getElementById('dialog-content');
    if (!contentDiv) return;

    const entityStats = this.entityStats.get(entityData.id);

    switch (tab) {
      case 'overview':
        contentDiv.innerHTML = this.createOverviewContent(entityData, entityStats);
        break;
      case 'tasks':
        contentDiv.innerHTML = this.createTasksContent(entityData, entityStats);
        break;
      case 'chat':
        contentDiv.innerHTML = this.createChatContent(entityData);
        break;
      case 'errors':
        contentDiv.innerHTML = this.createErrorsContent(entityData, entityStats);
        this.setupDialogInteractions(entityData); // Re-setup click handlers
        break;
      case 'settings':
        contentDiv.innerHTML = this.createSettingsContent(entityData);
        break;
    }
  }

  openErrorDetailDialog(entityData, errorId, type) {
    const entityStats = this.entityStats.get(entityData.id);
    const items = type === 'error' ? entityStats.detailedStats.recentErrors : entityStats.detailedStats.recentWarnings;
    const item = items.find(i => i.id === errorId);
    
    if (!item) return;

    // Create error detail overlay
    const overlay = document.createElement('div');
    overlay.id = 'error-detail-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: linear-gradient(135deg, #2a1a1a, #1a2a2a);
      border: 2px solid ${type === 'error' ? '#ff4444' : '#ffaa00'};
      border-radius: 12px;
      width: 600px;
      height: 500px;
      color: white;
      padding: 20px;
      overflow-y: auto;
    `;

    dialog.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="color: ${type === 'error' ? '#ff4444' : '#ffaa00'}; margin-bottom: 10px;">
          ${type === 'error' ? '🔴 Error Details' : '🟡 Warning Details'}
        </h2>
        <button onclick="document.getElementById('error-detail-overlay').remove()" style="position: absolute; top: 15px; right: 15px; background: #ff4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">✕</button>
      </div>

      <!-- Error/Warning Information -->
      <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="margin-bottom: 10px;">
          <strong style="color: ${type === 'error' ? '#ff4444' : '#ffaa00'};">Component:</strong> ${item.component}
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: #00aaff;">Message:</strong><br>
          <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; margin-top: 5px; font-family: monospace; font-size: 11px;">
            ${item.message}
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div><strong>Severity:</strong> <span style="color: ${this.getSeverityColor(item.severity)};">${item.severity}</span></div>
          <div><strong>Status:</strong> <span style="color: ${item.resolved || item.acknowledged ? '#00ff00' : '#ff4444'};">${item.resolved ? 'Resolved' : item.acknowledged ? 'Acknowledged' : 'Active'}</span></div>
        </div>
        <div><strong>Timestamp:</strong> ${new Date(item.timestamp).toLocaleString()}</div>
      </div>

      <!-- Action Buttons -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
        <button onclick="window.aiEntityInteractionManager.assignTaskFromError('${entityData.id}', '${errorId}', '${type}')" style="padding: 10px; background: #00ff00; color: black; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          📋 Create Task
        </button>
        <button onclick="window.aiEntityInteractionManager.chatAboutError('${entityData.id}', '${errorId}', '${type}')" style="padding: 10px; background: #00aaff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          💬 Discuss with AI
        </button>
        <button onclick="window.aiEntityInteractionManager.acknowledgeError('${entityData.id}', '${errorId}', '${type}')" style="padding: 10px; background: #ffaa00; color: black; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          ✅ Acknowledge
        </button>
        <button onclick="window.aiEntityInteractionManager.resolveError('${entityData.id}', '${errorId}', '${type}')" style="padding: 10px; background: #8844ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          🔧 Mark Resolved
        </button>
      </div>

      <!-- Suggested Actions -->
      <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
        <h3 style="color: #00aaff; margin-bottom: 10px;">Suggested Actions:</h3>
        <ul style="font-size: 12px; color: #ccc; margin: 0; padding-left: 20px;">
          <li>Analyze system logs for related patterns</li>
          <li>Check resource usage and allocation</li>
          <li>Review recent configuration changes</li>
          <li>Monitor for recurring instances</li>
          <li>Update component dependencies if needed</li>
        </ul>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  // Helper methods
  getTaskPriorityColor(priority) {
    const colors = {
      low: '#00aaff',
      medium: '#ffaa00', 
      high: '#ff8800',
      critical: '#ff4444'
    };
    return colors[priority] || '#00aaff';
  }

  getTaskStatusColor(status) {
    const colors = {
      running: '#00ff00',
      paused: '#ffaa00',
      queued: '#00aaff',
      completed: '#8844ff'
    };
    return colors[status] || '#00aaff';
  }

  getSeverityColor(severity) {
    const colors = {
      low: '#00aaff',
      info: '#00aaff',
      warning: '#ffaa00',
      medium: '#ff8800',
      high: '#ff4444',
      critical: '#ff0000',
      attention: '#ff8800'
    };
    return colors[severity] || '#00aaff';
  }

  closeEntityDialog() {
    const overlay = document.getElementById('entity-dialog-overlay');
    if (overlay) {
      overlay.remove();
    }
    this.selectedEntity = null;
  }

  // Action methods
  sendCommand(entityId, command) {
    console.log(`🎯 Sending command "${command}" to entity ${entityId}`);
    
    const entity = this.entityStats.get(entityId);
    if (!entity) return;

    // Simulate command execution
    const responses = {
      optimize: `Optimization initiated for ${entity.name}. Expected completion in 2-3 minutes.`,
      restart: `Services restarting for ${entity.name}. System will be back online shortly.`,
      analyze: `Analysis started for ${entity.name}. Results will be available in the diagnostics panel.`,
      report: `Generating comprehensive report for ${entity.name}. Report will be saved to your dashboard.`
    };

    const response = responses[command] || `Command "${command}" executed successfully.`;
    
    if (window.showNotification) {
      window.showNotification(response, 'success', 5000);
    }

    // Add to chat if chat is open
    const chatSession = this.chatSessions.get(entityId);
    if (chatSession) {
      chatSession.messages.push({
        id: `msg_${Date.now()}`,
        from: 'system',
        message: `Command executed: ${command}. ${response}`,
        timestamp: Date.now(),
        type: 'command_result'
      });
    }
  }

  sendChatMessage(entityId) {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;

    const message = input.value.trim();
    const chatSession = this.chatSessions.get(entityId);
    
    if (!chatSession) return;

    // Add user message
    chatSession.messages.push({
      id: `msg_${Date.now()}`,
      from: 'user',
      message: message,
      timestamp: Date.now(),
      type: 'user_message'
    });

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your request. Let me process that for you.",
        "That's an interesting point. I'll analyze the data and get back to you.",
        "I'm currently working on optimizing that process. Would you like a status update?",
        "Based on my analysis, I recommend the following approach...",
        "I've noted your feedback and will incorporate it into my learning algorithms."
      ];

      chatSession.messages.push({
        id: `msg_${Date.now() + 1}`,
        from: 'ai',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        type: 'ai_response'
      });

      // Update chat display if dialog is open
      if (this.selectedEntity && this.selectedEntity.id === entityId) {
        const messagesDiv = document.getElementById('chat-messages');
        if (messagesDiv) {
          messagesDiv.innerHTML = this.createChatContent(this.selectedEntity).match(/<div id="chat-messages"[^>]*>(.*?)<\/div>/s)[1];
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
      }
    }, 1000 + Math.random() * 2000);

    // Clear input and update display
    input.value = '';
    
    // Update chat display
    if (this.selectedEntity && this.selectedEntity.id === entityId) {
      const messagesDiv = document.getElementById('chat-messages');
      if (messagesDiv) {
        messagesDiv.innerHTML = this.createChatContent(this.selectedEntity).match(/<div id="chat-messages"[^>]*>(.*?)<\/div>/s)[1];
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }
  }

  assignTaskFromError(entityId, errorId, type) {
    console.log(`📋 Creating task from ${type} ${errorId} for entity ${entityId}`);
    
    const entityStats = this.entityStats.get(entityId);
    const items = type === 'error' ? entityStats.detailedStats.recentErrors : entityStats.detailedStats.recentWarnings;
    const item = items.find(i => i.id === errorId);
    
    if (!item) return;

    const newTask = {
      id: `task_${Date.now()}`,
      description: `Resolve ${type}: ${item.message}`,
      progress: 0,
      priority: type === 'error' ? 'high' : 'medium',
      estimatedCompletion: Date.now() + 3600000,
      status: 'queued',
      sourceError: errorId,
      sourceType: type
    };

    // Add to entity's tasks
    entityStats.detailedStats.currentTasks.push(newTask);

    if (window.showNotification) {
      window.showNotification(`Task created for ${type} resolution`, 'success', 5000);
    }

    // Close error detail dialog
    const errorOverlay = document.getElementById('error-detail-overlay');
    if (errorOverlay) errorOverlay.remove();

    // Switch to tasks tab
    this.switchDialogTab(this.selectedEntity, 'tasks');
    document.querySelector('[data-tab="tasks"]').click();
  }

  acknowledgeError(entityId, errorId, type) {
    const entityStats = this.entityStats.get(entityId);
    const items = type === 'error' ? entityStats.detailedStats.recentErrors : entityStats.detailedStats.recentWarnings;
    const item = items.find(i => i.id === errorId);
    
    if (!item) return;

    if (type === 'warning') {
      item.acknowledged = true;
    } else {
      item.resolved = true;
    }

    if (window.showNotification) {
      window.showNotification(`${type} acknowledged`, 'success', 3000);
    }

    // Close error detail dialog
    const errorOverlay = document.getElementById('error-detail-overlay');
    if (errorOverlay) errorOverlay.remove();
  }
}

// Initialize the system
window.aiEntityInteractionManager = new AIEntityInteractionManager();

// Auto-initialize
setTimeout(() => {
  window.aiEntityInteractionManager.initialize();
  
  if (window.showNotification) {
    window.showNotification(
      "Interactive AI Control System loaded - AI entities are now clickable!",
      "success",
      5000
    );
  }
}, 3000);

console.log("🤖 Interactive AI Control System loaded - AI entities are now fully interactive");
