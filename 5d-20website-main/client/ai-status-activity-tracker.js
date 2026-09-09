/**
 * AI Status and Activity Tracker
 * Real-time monitoring of AI agents with dynamic status updates
 */

console.log('📊 Loading AI Status and Activity Tracker...');

class AIStatusActivityTracker {
  constructor() {
    this.aiAgents = new Map();
    this.activityLog = [];
    this.statusHistory = new Map();
    this.isActive = true;
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing AI Status and Activity Tracker...');
    
    // Create AI agents with varying statuses
    this.createAIAgents();
    
    // Setup real-time monitoring
    this.setupRealTimeMonitoring();
    
    // Create status display
    this.createStatusDisplay();
    
    // Start activity simulation
    this.startActivitySimulation();
    
    console.log('✅ AI Status and Activity Tracker operational');
  }

  createAIAgents() {
    const agents = [
      {
        id: 'ai-strategic-coordinator',
        name: 'Strategic Coordinator',
        type: 'neural-network',
        baseActivity: 75,
        specialization: ['planning', 'optimization', 'coordination'],
        status: 'active'
      },
      {
        id: 'ai-system-analyst',
        name: 'System Analyst',
        type: 'decision-tree',
        baseActivity: 82,
        specialization: ['analysis', 'diagnostics', 'reporting'],
        status: 'processing'
      },
      {
        id: 'ai-data-processor',
        name: 'Data Processor',
        type: 'ml-engine',
        baseActivity: 68,
        specialization: ['data-processing', 'machine-learning', 'pattern-recognition'],
        status: 'learning'
      },
      {
        id: 'ai-network-guardian',
        name: 'Network Guardian',
        type: 'security-ai',
        baseActivity: 91,
        specialization: ['security', 'monitoring', 'threat-detection'],
        status: 'monitoring'
      },
      {
        id: 'ai-creative-engine',
        name: 'Creative Engine',
        type: 'generative-ai',
        baseActivity: 45,
        specialization: ['content-generation', 'creativity', 'design'],
        status: 'idle'
      },
      {
        id: 'ai-communication-hub',
        name: 'Communication Hub',
        type: 'nlp-processor',
        baseActivity: 87,
        specialization: ['natural-language', 'communication', 'translation'],
        status: 'communicating'
      }
    ];

    agents.forEach(agentConfig => {
      const agent = {
        ...agentConfig,
        currentActivity: agentConfig.baseActivity,
        lastUpdate: Date.now(),
        tasks: [],
        performance: {
          accuracy: Math.floor(Math.random() * 20) + 80, // 80-100%
          efficiency: Math.floor(Math.random() * 25) + 75, // 75-100%
          responseTime: Math.floor(Math.random() * 200) + 50 // 50-250ms
        },
        metrics: {
          tasksCompleted: Math.floor(Math.random() * 50),
          errorsHandled: Math.floor(Math.random() * 10),
          uptimeHours: Math.floor(Math.random() * 100) + 50
        }
      };
      
      this.aiAgents.set(agentConfig.id, agent);
      this.statusHistory.set(agentConfig.id, []);
    });

    console.log(`🤖 Created ${agents.length} AI agents for tracking`);
  }

  setupRealTimeMonitoring() {
    // Update agent statuses every 2 seconds
    setInterval(() => {
      this.updateAgentStatuses();
    }, 2000);

    // Log activities every 5 seconds
    setInterval(() => {
      this.logAgentActivities();
    }, 5000);

    // Update display every 3 seconds
    setInterval(() => {
      this.updateStatusDisplay();
    }, 3000);
  }

  updateAgentStatuses() {
    this.aiAgents.forEach((agent, agentId) => {
      // Simulate realistic activity fluctuations
      const timeVariation = Math.sin(Date.now() * 0.001 + Math.random()) * 15;
      const randomVariation = (Math.random() - 0.5) * 10;
      const activityChange = timeVariation + randomVariation;
      
      // Update activity level
      const newActivity = Math.max(10, Math.min(100, agent.baseActivity + activityChange));
      agent.currentActivity = newActivity;
      
      // Update status based on activity
      agent.status = this.determineStatusFromActivity(newActivity, agent.type);
      
      // Update performance metrics
      agent.performance.accuracy = Math.max(70, Math.min(100, 
        agent.performance.accuracy + (Math.random() - 0.5) * 2
      ));
      
      agent.performance.efficiency = Math.max(60, Math.min(100,
        agent.performance.efficiency + (Math.random() - 0.5) * 3
      ));
      
      agent.performance.responseTime = Math.max(30, Math.min(500,
        agent.performance.responseTime + (Math.random() - 0.5) * 20
      ));
      
      agent.lastUpdate = Date.now();
      
      // Record status history
      const history = this.statusHistory.get(agentId);
      history.push({
        timestamp: Date.now(),
        activity: newActivity,
        status: agent.status,
        performance: { ...agent.performance }
      });
      
      // Keep only last 50 entries
      if (history.length > 50) {
        history.shift();
      }
    });
  }

  determineStatusFromActivity(activity, type) {
    if (activity < 20) return 'idle';
    if (activity < 40) return 'standby';
    if (activity < 60) return 'processing';
    if (activity < 80) return 'active';
    if (activity < 90) return 'busy';
    return 'overloaded';
  }

  logAgentActivities() {
    this.aiAgents.forEach((agent, agentId) => {
      const activities = [
        'Processing data streams',
        'Analyzing system patterns',
        'Optimizing performance metrics',
        'Coordinating with other agents',
        'Learning from new data',
        'Monitoring system health',
        'Executing assigned tasks',
        'Responding to user queries',
        'Updating knowledge base',
        'Performing diagnostics'
      ];
      
      if (agent.status !== 'idle' && Math.random() < 0.7) {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        this.activityLog.push({
          agentId,
          agentName: agent.name,
          activity,
          timestamp: Date.now(),
          activityLevel: agent.currentActivity,
          status: agent.status
        });
        
        // Keep only last 100 activities
        if (this.activityLog.length > 100) {
          this.activityLog.shift();
        }
      }
    });
  }

  createStatusDisplay() {
    const display = document.createElement('div');
    display.id = 'ai-status-tracker';
    display.style.cssText = `
      position: fixed;
      top: 200px;
      left: 20px;
      width: 350px;
      max-height: 500px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 12px;
      padding: 16px;
      z-index: 1003;
      font-family: Arial, sans-serif;
      font-size: 12px;
      overflow-y: auto;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    display.innerHTML = `
      <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 12px;">
        <h3 style="margin: 0; color: #4ecdc4; font-size: 16px;">📊 AI Status & Activity</h3>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; color: #9ca3af; cursor: pointer;">×</button>
      </div>
      
      <div id="ai-agents-status"></div>
      
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #333;">
        <h4 style="margin: 0 0 8px 0; color: #feca57; font-size: 14px;">📋 Recent Activities</h4>
        <div id="recent-activities" style="max-height: 150px; overflow-y: auto;"></div>
      </div>
      
      <div style="margin-top: 12px; text-align: center;">
        <button onclick="window.aiStatusTracker.refreshDisplay()" 
                style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
          🔄 Refresh
        </button>
        <button onclick="window.aiStatusTracker.exportData()" 
                style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          📊 Export
        </button>
      </div>
    `;
    
    document.body.appendChild(display);
    this.updateStatusDisplay();
  }

  updateStatusDisplay() {
    const agentsContainer = document.getElementById('ai-agents-status');
    const activitiesContainer = document.getElementById('recent-activities');
    
    if (agentsContainer) {
      agentsContainer.innerHTML = Array.from(this.aiAgents.values()).map(agent => {
        const statusColor = this.getStatusColor(agent.status);
        const activityBarWidth = agent.currentActivity;
        
        return `
          <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-weight: bold; color: #ffffff;">${agent.name}</span>
              <span style="color: ${statusColor}; font-size: 10px; text-transform: uppercase;">${agent.status}</span>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; margin-bottom: 6px;">
              <div style="background: ${statusColor}; height: 100%; width: ${activityBarWidth}%; border-radius: 3px; transition: width 0.3s;"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cccccc;">
              <span>Activity: ${agent.currentActivity.toFixed(0)}%</span>
              <span>Accuracy: ${agent.performance.accuracy.toFixed(0)}%</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 9px; color: #999999; margin-top: 2px;">
              <span>${agent.type}</span>
              <span>${agent.performance.responseTime.toFixed(0)}ms</span>
            </div>
          </div>
        `;
      }).join('');
    }
    
    if (activitiesContainer) {
      const recentActivities = this.activityLog.slice(-8).reverse();
      activitiesContainer.innerHTML = recentActivities.map(activity => `
        <div style="margin-bottom: 6px; padding: 4px; background: rgba(255,255,255,0.05); border-radius: 4px;">
          <div style="font-size: 10px; color: #4ecdc4; font-weight: bold;">${activity.agentName}</div>
          <div style="font-size: 9px; color: #ffffff; margin: 2px 0;">${activity.activity}</div>
          <div style="font-size: 8px; color: #888888;">
            ${new Date(activity.timestamp).toLocaleTimeString()} | ${activity.activityLevel.toFixed(0)}%
          </div>
        </div>
      `).join('') || '<div style="color: #666; font-size: 10px;">No recent activities</div>';
    }
  }

  getStatusColor(status) {
    const colors = {
      'idle': '#6b7280',
      'standby': '#f59e0b', 
      'processing': '#3b82f6',
      'active': '#10b981',
      'busy': '#8b5cf6',
      'overloaded': '#ef4444',
      'learning': '#06d6a0',
      'monitoring': '#ff6b6b',
      'communicating': '#4ecdc4'
    };
    return colors[status] || '#6b7280';
  }

  startActivitySimulation() {
    // Create realistic activity patterns
    setInterval(() => {
      this.simulateAgentTasks();
    }, 8000);
  }

  simulateAgentTasks() {
    this.aiAgents.forEach((agent, agentId) => {
      if (Math.random() < 0.4) { // 40% chance to get a new task
        const tasks = [
          'Data analysis task',
          'System optimization',
          'Error resolution',
          'Performance monitoring',
          'Security scan',
          'Knowledge update',
          'User query processing',
          'Pattern recognition'
        ];
        
        const task = {
          id: `task-${Date.now()}`,
          description: tasks[Math.floor(Math.random() * tasks.length)],
          startTime: Date.now(),
          estimatedDuration: Math.random() * 30000 + 10000, // 10-40 seconds
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        };
        
        agent.tasks.push(task);
        
        // Complete task after duration
        setTimeout(() => {
          agent.tasks = agent.tasks.filter(t => t.id !== task.id);
          agent.metrics.tasksCompleted++;
        }, task.estimatedDuration);
      }
    });
  }

  refreshDisplay() {
    this.updateStatusDisplay();
    console.log('🔄 AI Status display refreshed');
  }

  exportData() {
    const exportData = {
      timestamp: new Date().toISOString(),
      agents: Object.fromEntries(this.aiAgents),
      recentActivities: this.activityLog.slice(-50),
      statusHistory: Object.fromEntries(this.statusHistory)
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-status-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📊 AI Status data exported');
  }

  getStatusReport() {
    return {
      totalAgents: this.aiAgents.size,
      activeAgents: Array.from(this.aiAgents.values()).filter(a => a.status !== 'idle').length,
      averageActivity: Array.from(this.aiAgents.values()).reduce((sum, a) => sum + a.currentActivity, 0) / this.aiAgents.size,
      totalTasks: Array.from(this.aiAgents.values()).reduce((sum, a) => sum + a.tasks.length, 0),
      recentActivities: this.activityLog.length
    };
  }
}

// Initialize the tracker
const aiStatusTracker = new AIStatusActivityTracker();

// Make globally accessible
window.aiStatusTracker = aiStatusTracker;

console.log('📊 AI Status and Activity Tracker loaded and operational!');
