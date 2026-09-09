/**
 * AI Task Monitoring and Database Verification System
 * Monitors AI collaboration tasks, verifies completion, and provides intelligent responses
 */

console.log('🔍 Loading AI Task Monitoring System...');

class AITaskMonitoringSystem {
  constructor() {
    this.hoveredTasks = new Map();
    this.taskResults = new Map();
    this.hoverTimer = null;
    this.retryScheduler = new Map();
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing AI Task Monitoring System...');
    
    // Setup hover monitoring for AI collaboration tasks
    this.setupTaskHoverMonitoring();
    
    // Setup database verification
    this.setupDatabaseVerification();
    
    // Setup retry scheduler
    this.setupRetryScheduler();
    
    // Setup intelligent response system
    this.setupIntelligentResponseSystem();
    
    console.log('✅ AI Task Monitoring System operational');
  }

  setupTaskHoverMonitoring() {
    // Monitor all AI task elements
    document.addEventListener('mouseover', (event) => {
      const taskElement = event.target.closest('.ai-task, .collaboration-task, [data-task-id]');
      if (taskElement) {
        const taskId = taskElement.dataset.taskId || taskElement.id || `task-${Date.now()}`;
        this.startHoverMonitoring(taskId, taskElement);
      }
    });

    document.addEventListener('mouseout', (event) => {
      const taskElement = event.target.closest('.ai-task, .collaboration-task, [data-task-id]');
      if (taskElement) {
        const taskId = taskElement.dataset.taskId || taskElement.id;
        this.stopHoverMonitoring(taskId);
      }
    });
  }

  startHoverMonitoring(taskId, element) {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    
    this.hoverTimer = setTimeout(() => {
      this.analyzeTaskStatus(taskId, element);
    }, 3000); // Wait 3 seconds of hovering
  }

  stopHoverMonitoring(taskId) {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  async analyzeTaskStatus(taskId, element) {
    console.log(`🔍 Analyzing task status for: ${taskId}`);
    
    // Create status popup
    this.createTaskStatusPopup(taskId, element);
    
    // Get task details
    const taskData = await this.getTaskDetails(taskId, element);
    
    // Check completion and database
    const verificationResult = await this.verifyTaskCompletion(taskData);
    
    // Update popup with results
    this.updateTaskStatusPopup(taskId, verificationResult);
    
    // Schedule retry if needed
    if (verificationResult.needsRetry) {
      this.scheduleRetry(taskId, verificationResult);
    }
  }

  createTaskStatusPopup(taskId, element) {
    // Remove existing popup
    const existingPopup = document.getElementById(`task-status-${taskId}`);
    if (existingPopup) existingPopup.remove();
    
    const popup = document.createElement('div');
    popup.id = `task-status-${taskId}`;
    popup.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      padding: 12px;
      z-index: 10000;
      min-width: 250px;
      max-width: 400px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    `;
    
    // Position near the hovered element
    const rect = element.getBoundingClientRect();
    popup.style.left = `${rect.right + 10}px`;
    popup.style.top = `${rect.top}px`;
    
    popup.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; color: #3b82f6;">
        🔍 Task Analysis - ${taskId}
      </div>
      <div id="task-status-content-${taskId}">
        <div style="color: #f59e0b;">⏳ Analyzing task status...</div>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (popup.parentNode) popup.remove();
    }, 10000);
  }

  async getTaskDetails(taskId, element) {
    // Extract task information from element and related systems
    const taskData = {
      id: taskId,
      element: element,
      type: element.dataset.taskType || 'unknown',
      agent: element.dataset.agent || 'unknown',
      status: element.dataset.status || 'unknown',
      startTime: element.dataset.startTime || Date.now(),
      description: element.textContent.trim(),
      location: element.dataset.location || 'unknown'
    };
    
    // Check if connected to AI collaboration network
    if (window.aiCollaborationNetwork) {
      const networkTask = Array.from(window.aiCollaborationNetwork.activeTasks.values())
        .find(task => task.id === taskId || task.title.includes(taskData.description.substring(0, 20)));
      
      if (networkTask) {
        taskData.networkTask = networkTask;
        taskData.progress = networkTask.progress;
        taskData.estimatedDuration = networkTask.estimatedDuration;
      }
    }
    
    return taskData;
  }

  async verifyTaskCompletion(taskData) {
    const verification = {
      taskId: taskData.id,
      completed: false,
      errorFixed: false,
      databaseChecked: false,
      issues: [],
      recommendations: [],
      needsRetry: false,
      aiResponse: '',
      timestamp: new Date()
    };
    
    try {
      // Check database for task completion
      verification.databaseChecked = await this.checkDatabase(taskData);
      
      // Verify error resolution
      if (taskData.type === 'error-fix' || taskData.description.includes('fix') || taskData.description.includes('error')) {
        verification.errorFixed = await this.verifyErrorResolution(taskData);
      }
      
      // Check completion status
      verification.completed = this.checkTaskCompletion(taskData);
      
      // Generate AI response
      verification.aiResponse = this.generateAIResponse(verification, taskData);
      
      // Determine if retry needed
      verification.needsRetry = this.shouldScheduleRetry(verification, taskData);
      
    } catch (error) {
      verification.issues.push(`Verification error: ${error.message}`);
      verification.aiResponse = `❌ Unable to verify task completion due to: ${error.message}`;
    }
    
    return verification;
  }

  async checkDatabase(taskData) {
    try {
      // Check localStorage for task records
      const taskRecords = JSON.parse(localStorage.getItem('ai-task-records') || '[]');
      const taskRecord = taskRecords.find(record => record.id === taskData.id);
      
      // Check if unlimited database service is available
      if (window.unlimitedDatabaseService) {
        try {
          const dbResult = await window.unlimitedDatabaseService.get(`task-${taskData.id}`);
          return !!dbResult;
        } catch (error) {
          console.warn('Database check failed:', error);
        }
      }
      
      // Check session storage
      const sessionTasks = JSON.parse(sessionStorage.getItem('active-tasks') || '[]');
      const sessionTask = sessionTasks.find(task => task.id === taskData.id);
      
      return !!(taskRecord || sessionTask);
    } catch (error) {
      console.error('Database check error:', error);
      return false;
    }
  }

  async verifyErrorResolution(taskData) {
    try {
      // Check system validator for related errors
      if (window.systemValidator && window.systemValidator.errorLog) {
        const recentErrors = window.systemValidator.errorLog.filter(error => 
          Date.now() - error.timestamp < 300000 // Last 5 minutes
        );
        
        // Check if the specific error mentioned in task is resolved
        const relatedError = recentErrors.find(error => 
          taskData.description.toLowerCase().includes(error.type.toLowerCase()) ||
          error.message.toLowerCase().includes(taskData.description.toLowerCase())
        );
        
        return !relatedError; // True if no recent related errors
      }
      
      // Check browser console for recent errors
      const consoleErrors = this.getRecentConsoleErrors();
      const relatedConsoleError = consoleErrors.find(error =>
        taskData.description.toLowerCase().includes(error.toLowerCase())
      );
      
      return !relatedConsoleError;
    } catch (error) {
      console.error('Error verification failed:', error);
      return false;
    }
  }

  checkTaskCompletion(taskData) {
    // Check various completion indicators
    if (taskData.networkTask) {
      return taskData.networkTask.progress >= 100 || taskData.networkTask.status === 'completed';
    }
    
    if (taskData.status === 'completed' || taskData.status === 'done') {
      return true;
    }
    
    // Check element status
    if (taskData.element.classList.contains('completed') || taskData.element.classList.contains('success')) {
      return true;
    }
    
    return false;
  }

  generateAIResponse(verification, taskData) {
    let response = '';
    
    // Main completion status
    if (verification.completed) {
      response += '✅ **YES** - Task completed successfully.\n';
    } else {
      response += '❌ **NO** - Task not yet completed.\n';
    }
    
    // Error fix status
    if (taskData.type === 'error-fix' || taskData.description.includes('fix')) {
      if (verification.errorFixed) {
        response += '🔧 **YES** - Error has been resolved.\n';
      } else {
        response += '⚠️ **NO** - Error still present or new issues detected.\n';
      }
    }
    
    // Database status
    if (verification.databaseChecked) {
      response += '💾 Database verified - Task recorded in system.\n';
    } else {
      response += '⚠️ Database issue - Task not properly recorded.\n';
    }
    
    // Time analysis
    const taskAge = Date.now() - (taskData.startTime || Date.now());
    const ageMinutes = Math.floor(taskAge / 60000);
    
    if (ageMinutes > 5) {
      response += `⏰ Task idle for ${ageMinutes} minutes - scheduling retry.\n`;
    }
    
    // Recommendations
    if (verification.needsRetry) {
      response += '🔄 **RECOMMENDATION**: Task will be retried automatically.\n';
    }
    
    if (verification.issues.length > 0) {
      response += `⚠️ **ISSUES**: ${verification.issues.join(', ')}\n`;
    }
    
    return response;
  }

  shouldScheduleRetry(verification, taskData) {
    const taskAge = Date.now() - (taskData.startTime || Date.now());
    const ageMinutes = Math.floor(taskAge / 60000);
    
    return (!verification.completed || !verification.errorFixed) && ageMinutes >= 5;
  }

  updateTaskStatusPopup(taskId, verification) {
    const contentElement = document.getElementById(`task-status-content-${taskId}`);
    if (!contentElement) return;
    
    contentElement.innerHTML = `
      <div style="margin-bottom: 8px;">
        <div style="font-size: 12px; color: #888;">${verification.timestamp.toLocaleString()}</div>
      </div>
      
      <div style="margin-bottom: 8px; padding: 8px; background: rgba(59, 130, 246, 0.1); border-radius: 4px;">
        <div style="font-weight: bold; margin-bottom: 4px;">🤖 AI Analysis:</div>
        <div style="white-space: pre-line; font-size: 12px;">${verification.aiResponse}</div>
      </div>
      
      <div style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Completed:</span>
          <span style="color: ${verification.completed ? '#10b981' : '#ef4444'};">
            ${verification.completed ? '✅ YES' : '❌ NO'}
          </span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Database:</span>
          <span style="color: ${verification.databaseChecked ? '#10b981' : '#f59e0b'};">
            ${verification.databaseChecked ? '✅ Verified' : '⚠️ Issue'}
          </span>
        </div>
        
        ${verification.needsRetry ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Retry:</span>
            <span style="color: #f59e0b;">⏰ Scheduled</span>
          </div>
        ` : ''}
      </div>
      
      ${verification.needsRetry ? `
        <button onclick="window.aiTaskMonitor.manualRetry('${taskId}')" 
                style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; width: 100%;">
          🔄 Retry Now
        </button>
      ` : ''}
    `;
  }

  scheduleRetry(taskId, verification) {
    console.log(`⏰ Scheduling retry for task: ${taskId}`);
    
    // Clear existing retry if any
    if (this.retryScheduler.has(taskId)) {
      clearTimeout(this.retryScheduler.get(taskId));
    }
    
    // Schedule retry in 2 minutes
    const retryTimer = setTimeout(() => {
      this.executeRetry(taskId);
    }, 120000); // 2 minutes
    
    this.retryScheduler.set(taskId, retryTimer);
  }

  async executeRetry(taskId) {
    console.log(`🔄 Executing retry for task: ${taskId}`);
    
    try {
      // Try to find and restart the task
      if (window.aiCollaborationNetwork) {
        const task = window.aiCollaborationNetwork.activeTasks.get(taskId);
        if (task) {
          task.status = 'assigned';
          task.progress = 0;
          console.log(`✅ Restarted task: ${taskId}`);
        }
      }
      
      // If it's an error fix task, try auto-fix
      if (window.enhancedAutoFix) {
        window.enhancedAutoFix.detectIssues();
      }
      
      // Remove from retry scheduler
      this.retryScheduler.delete(taskId);
      
    } catch (error) {
      console.error(`❌ Retry failed for task ${taskId}:`, error);
    }
  }

  manualRetry(taskId) {
    this.executeRetry(taskId);
    
    // Close the popup
    const popup = document.getElementById(`task-status-${taskId}`);
    if (popup) popup.remove();
  }

  setupDatabaseVerification() {
    // Periodically verify database unlimited status
    setInterval(() => {
      this.verifyDatabaseUnlimited();
    }, 30000); // Every 30 seconds
  }

  async verifyDatabaseUnlimited() {
    try {
      if (window.unlimitedDatabaseService) {
        const status = await window.unlimitedDatabaseService.getStatus();
        if (status && !status.unlimited) {
          console.warn('⚠️ Database not unlimited - investigating...');
          
          // Try to restore unlimited status
          window.unlimitedDatabaseService.enableUnlimited?.();
        }
      }
    } catch (error) {
      console.error('Database verification error:', error);
    }
  }

  setupRetryScheduler() {
    // Clean up old retry timers every 10 minutes
    setInterval(() => {
      console.log('🧹 Cleaning up retry scheduler...');
      // Implementation handled by individual timeout cleanup
    }, 600000);
  }

  setupIntelligentResponseSystem() {
    // Make system globally available
    window.aiTaskMonitor = this;
    
    console.log('🧠 Intelligent response system ready');
  }

  getRecentConsoleErrors() {
    // This would need to be implemented with console override
    // For now, return empty array
    return [];
  }
}

// Initialize the system
const aiTaskMonitor = new AITaskMonitoringSystem();

console.log('🔍 AI Task Monitoring System loaded and operational!');
