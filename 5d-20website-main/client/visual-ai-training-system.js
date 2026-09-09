/**
 * Visual AI Training System
 * Teaches visual AIs about button states, navigation patterns, and feature monitoring
 */

console.log('👁️ Loading Visual AI Training System...');

class VisualAITrainingSystem {
  constructor() {
    this.visualAIs = new Map();
    this.buttonStates = new Map();
    this.navigationPatterns = new Map();
    this.featureMonitoring = new Map();
    this.trainingData = new Map();
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Visual AI Training System...');
    
    // Create visual AI agents
    this.createVisualAIs();
    
    // Setup button state recognition training
    this.setupButtonStateTraining();
    
    // Setup navigation pattern recognition
    this.setupNavigationPatternTraining();
    
    // Setup feature monitoring system
    this.setupFeatureMonitoring();
    
    // Start continuous learning
    this.startContinuousLearning();
    
    console.log('✅ Visual AI Training System operational');
  }

  createVisualAIs() {
    const aiConfigs = [
      {
        id: 'visual-ai-button-specialist',
        name: 'Button State Specialist',
        specialization: ['button-recognition', 'state-detection', 'click-tracking'],
        learningRate: 0.15,
        accuracy: 85,
        trainingLevel: 'intermediate'
      },
      {
        id: 'visual-ai-navigation-tracker',
        name: 'Navigation Tracker',
        specialization: ['navigation-detection', 'page-transitions', 'route-analysis'],
        learningRate: 0.12,
        accuracy: 78,
        trainingLevel: 'beginner'
      },
      {
        id: 'visual-ai-feature-monitor',
        name: 'Feature Monitor',
        specialization: ['feature-detection', 'element-tracking', 'overlap-detection'],
        learningRate: 0.18,
        accuracy: 92,
        trainingLevel: 'advanced'
      },
      {
        id: 'visual-ai-ui-analyst',
        name: 'UI State Analyst',
        specialization: ['ui-analysis', 'state-changes', 'element-lifecycle'],
        learningRate: 0.14,
        accuracy: 88,
        trainingLevel: 'intermediate'
      }
    ];

    aiConfigs.forEach(config => {
      const ai = new VisualAI(config);
      this.visualAIs.set(config.id, ai);
      console.log(`👁️ Created Visual AI: ${config.name}`);
    });
  }

  setupButtonStateTraining() {
    // Define button states and their visual characteristics
    const buttonStates = {
      'initial': {
        description: 'Button in default/resting state',
        visualCues: ['default-color', 'no-hover-effects', 'static-appearance'],
        timing: 'persistent',
        triggers: ['page-load', 'element-creation']
      },
      'highlight': {
        description: 'Button highlighted on hover',
        visualCues: ['color-change', 'shadow-effects', 'cursor-pointer', 'brightness-increase'],
        timing: '100-300ms after hover',
        triggers: ['mouse-enter', 'focus-event']
      },
      'press': {
        description: 'Button pressed/clicked state',
        visualCues: ['pressed-appearance', 'shadow-inset', 'scale-change', 'color-darken'],
        timing: '50-150ms during click',
        triggers: ['mouse-down', 'key-press']
      },
      'loading': {
        description: 'Button in loading state after action',
        visualCues: ['spinner-animation', 'disabled-appearance', 'opacity-change'],
        timing: '200ms-5000ms after action',
        triggers: ['form-submit', 'async-action']
      },
      'disappear': {
        description: 'Button disappears for navigation/action',
        visualCues: ['opacity-fade', 'display-none', 'visibility-hidden'],
        timing: '100-500ms after click',
        triggers: ['navigation-start', 'page-transition']
      },
      'reappear': {
        description: 'Button reappears if navigation failed',
        visualCues: ['opacity-restore', 'display-block', 'visibility-visible'],
        timing: '1000-3000ms after disappear',
        triggers: ['navigation-failure', 'error-recovery']
      },
      'rehighlight': {
        description: 'Button re-highlighted after failed action',
        visualCues: ['color-restoration', 'hover-effects-return', 'interactive-state'],
        timing: 'immediate after reappear',
        triggers: ['failed-navigation', 'action-retry']
      }
    };

    // Train all visual AIs on button states
    this.visualAIs.forEach(ai => {
      ai.learnButtonStates(buttonStates);
    });

    // Setup real-time button monitoring
    this.setupButtonMonitoring();
  }

  setupButtonMonitoring() {
    // Monitor all buttons on the page
    const buttons = document.querySelectorAll('button, [role="button"], .btn, input[type="button"], input[type="submit"]');
    
    buttons.forEach(button => {
      this.attachButtonStateMonitoring(button);
    });

    // Monitor for new buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newButtons = node.querySelectorAll('button, [role="button"], .btn');
            newButtons.forEach(button => {
              this.attachButtonStateMonitoring(button);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  attachButtonStateMonitoring(button) {
    const buttonId = button.id || `btn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    button.dataset.visualAiId = buttonId;

    const buttonMonitor = {
      element: button,
      currentState: 'initial',
      stateHistory: [],
      timings: new Map(),
      visualChanges: []
    };

    this.buttonStates.set(buttonId, buttonMonitor);

    // Attach event listeners
    this.attachButtonEventListeners(button, buttonMonitor);
  }

  attachButtonEventListeners(button, monitor) {
    const recordStateChange = (newState, trigger) => {
      const timestamp = Date.now();
      const oldState = monitor.currentState;
      
      monitor.stateHistory.push({
        from: oldState,
        to: newState,
        timestamp,
        trigger,
        duration: monitor.timings.get(oldState) ? timestamp - monitor.timings.get(oldState) : 0
      });

      monitor.currentState = newState;
      monitor.timings.set(newState, timestamp);

      // Notify visual AIs
      this.notifyVisualAIs('button-state-change', {
        buttonId: button.dataset.visualAiId,
        oldState,
        newState,
        trigger,
        element: button,
        visualSnapshot: this.captureVisualSnapshot(button)
      });

      console.log(`👁️ Button ${button.dataset.visualAiId}: ${oldState} → ${newState} (${trigger})`);
    };

    // Mouse events
    button.addEventListener('mouseenter', () => recordStateChange('highlight', 'mouse-enter'));
    button.addEventListener('mouseleave', () => recordStateChange('initial', 'mouse-leave'));
    button.addEventListener('mousedown', () => recordStateChange('press', 'mouse-down'));
    button.addEventListener('mouseup', () => recordStateChange('highlight', 'mouse-up'));

    // Click events
    button.addEventListener('click', (event) => {
      recordStateChange('press', 'click');
      
      // Monitor for navigation or disappear
      setTimeout(() => {
        this.checkForNavigation(button, monitor);
      }, 100);
    });

    // Focus events
    button.addEventListener('focus', () => recordStateChange('highlight', 'focus'));
    button.addEventListener('blur', () => recordStateChange('initial', 'blur'));

    // Form submission (if applicable)
    const form = button.closest('form');
    if (form) {
      form.addEventListener('submit', () => recordStateChange('loading', 'form-submit'));
    }
  }

  checkForNavigation(button, monitor) {
    const checkInterval = 100;
    const maxChecks = 50; // 5 seconds max
    let checks = 0;

    const checkNavigation = () => {
      checks++;

      // Check if button is still visible and in DOM
      const isVisible = button.offsetParent !== null && 
                       getComputedStyle(button).visibility !== 'hidden' &&
                       getComputedStyle(button).opacity !== '0';

      if (!isVisible) {
        // Button disappeared - likely navigation
        monitor.currentState = 'disappear';
        monitor.timings.set('disappear', Date.now());

        this.notifyVisualAIs('button-disappeared', {
          buttonId: button.dataset.visualAiId,
          element: button,
          disappearTime: Date.now()
        });

        // Check for reappear
        setTimeout(() => {
          this.checkForReappear(button, monitor);
        }, 1000);

        return;
      }

      // Check if we've navigated to a new page
      if (window.location.href !== monitor.lastUrl) {
        this.notifyVisualAIs('navigation-detected', {
          buttonId: button.dataset.visualAiId,
          oldUrl: monitor.lastUrl,
          newUrl: window.location.href,
          navigationTime: Date.now()
        });
        return;
      }

      // Continue checking
      if (checks < maxChecks) {
        setTimeout(checkNavigation, checkInterval);
      } else {
        // No navigation detected - action likely failed
        this.notifyVisualAIs('action-failed', {
          buttonId: button.dataset.visualAiId,
          element: button,
          reason: 'no-navigation-detected'
        });
      }
    };

    monitor.lastUrl = window.location.href;
    setTimeout(checkNavigation, checkInterval);
  }

  checkForReappear(button, monitor) {
    const checkInterval = 200;
    const maxChecks = 15; // 3 seconds
    let checks = 0;

    const checkReappear = () => {
      checks++;

      const isVisible = button.offsetParent !== null && 
                       getComputedStyle(button).visibility !== 'hidden' &&
                       getComputedStyle(button).opacity !== '0';

      if (isVisible) {
        // Button reappeared - navigation failed
        monitor.currentState = 'reappear';
        monitor.timings.set('reappear', Date.now());

        this.notifyVisualAIs('button-reappeared', {
          buttonId: button.dataset.visualAiId,
          element: button,
          reappearTime: Date.now(),
          reason: 'navigation-failed'
        });

        // Check for rehighlight
        setTimeout(() => {
          if (button.matches(':hover')) {
            monitor.currentState = 'rehighlight';
            this.notifyVisualAIs('button-rehighlighted', {
              buttonId: button.dataset.visualAiId,
              element: button
            });
          }
        }, 100);

        return;
      }

      if (checks < maxChecks) {
        setTimeout(checkReappear, checkInterval);
      }
    };

    setTimeout(checkReappear, checkInterval);
  }

  captureVisualSnapshot(element) {
    const styles = getComputedStyle(element);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      boxShadow: styles.boxShadow,
      opacity: styles.opacity,
      transform: styles.transform,
      border: styles.border,
      cursor: styles.cursor,
      display: styles.display,
      visibility: styles.visibility,
      position: element.getBoundingClientRect(),
      timestamp: Date.now()
    };
  }

  setupNavigationPatternTraining() {
    // Define navigation patterns
    const navigationPatterns = {
      'successful-navigation': {
        sequence: ['button-click', 'page-start-unload', 'new-page-load'],
        timing: [0, 100, 500],
        indicators: ['url-change', 'dom-replacement', 'loading-events']
      },
      'failed-navigation': {
        sequence: ['button-click', 'no-navigation', 'button-reappear'],
        timing: [0, 2000, 2100],
        indicators: ['no-url-change', 'error-messages', 'button-reactivation']
      },
      'spa-navigation': {
        sequence: ['button-click', 'content-change', 'url-update'],
        timing: [0, 200, 300],
        indicators: ['partial-dom-update', 'history-api-call', 'route-change']
      },
      'loading-navigation': {
        sequence: ['button-click', 'loading-state', 'eventual-navigation'],
        timing: [0, 100, 2000],
        indicators: ['loading-spinner', 'disabled-state', 'async-completion']
      }
    };

    // Train AIs on navigation patterns
    this.visualAIs.forEach(ai => {
      ai.learnNavigationPatterns(navigationPatterns);
    });
  }

  setupFeatureMonitoring() {
    // Monitor features for action completion and overlap detection
    this.startFeatureWatcher();
  }

  startFeatureWatcher() {
    setInterval(() => {
      this.checkAllFeatures();
    }, 500); // Check every 500ms
  }

  checkAllFeatures() {
    // Monitor all interactive elements
    const interactiveElements = document.querySelectorAll('button, [role="button"], .btn, a[href], input');
    
    interactiveElements.forEach(element => {
      this.analyzeFeatureState(element);
    });
  }

  analyzeFeatureState(element) {
    const elementId = element.dataset.visualAiId || this.generateElementId(element);
    const currentState = this.captureElementState(element);
    
    const featureData = this.featureMonitoring.get(elementId) || {
      element,
      states: [],
      overlaps: [],
      actions: []
    };

    // Check for overlaps
    const overlaps = this.detectOverlaps(element);
    if (overlaps.length > 0) {
      featureData.overlaps.push({
        timestamp: Date.now(),
        overlappingElements: overlaps
      });

      this.notifyVisualAIs('element-overlap-detected', {
        elementId,
        element,
        overlaps
      });
    }

    // Check for state changes
    const lastState = featureData.states[featureData.states.length - 1];
    if (!lastState || !this.statesEqual(currentState, lastState.state)) {
      featureData.states.push({
        state: currentState,
        timestamp: Date.now()
      });

      this.notifyVisualAIs('element-state-changed', {
        elementId,
        element,
        oldState: lastState?.state,
        newState: currentState
      });
    }

    this.featureMonitoring.set(elementId, featureData);
  }

  detectOverlaps(element) {
    const rect = element.getBoundingClientRect();
    const overlaps = [];

    const allElements = document.querySelectorAll('*');
    allElements.forEach(otherElement => {
      if (otherElement === element) return;

      const otherRect = otherElement.getBoundingClientRect();
      
      // Check for overlap
      if (this.rectanglesOverlap(rect, otherRect)) {
        const zIndex1 = parseInt(getComputedStyle(element).zIndex) || 0;
        const zIndex2 = parseInt(getComputedStyle(otherElement).zIndex) || 0;

        if (zIndex2 > zIndex1) {
          overlaps.push({
            element: otherElement,
            overlapArea: this.calculateOverlapArea(rect, otherRect),
            zIndexDifference: zIndex2 - zIndex1
          });
        }
      }
    });

    return overlaps;
  }

  rectanglesOverlap(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect2.right < rect1.left || 
             rect1.bottom < rect2.top || 
             rect2.bottom < rect1.top);
  }

  calculateOverlapArea(rect1, rect2) {
    const left = Math.max(rect1.left, rect2.left);
    const right = Math.min(rect1.right, rect2.right);
    const top = Math.max(rect1.top, rect2.top);
    const bottom = Math.min(rect1.bottom, rect2.bottom);

    return (right - left) * (bottom - top);
  }

  captureElementState(element) {
    const rect = element.getBoundingClientRect();
    const styles = getComputedStyle(element);
    
    return {
      position: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
      visibility: styles.visibility,
      opacity: parseFloat(styles.opacity),
      display: styles.display,
      zIndex: parseInt(styles.zIndex) || 0,
      isInteractable: !element.disabled && styles.pointerEvents !== 'none',
      timestamp: Date.now()
    };
  }

  statesEqual(state1, state2) {
    if (!state1 || !state2) return false;
    
    return state1.position.x === state2.position.x &&
           state1.position.y === state2.position.y &&
           state1.visibility === state2.visibility &&
           state1.opacity === state2.opacity &&
           state1.display === state2.display;
  }

  generateElementId(element) {
    return element.id || `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  notifyVisualAIs(event, data) {
    this.visualAIs.forEach(ai => {
      ai.processEvent(event, data);
    });
  }

  startContinuousLearning() {
    // Update AI accuracy and learning every 30 seconds
    setInterval(() => {
      this.updateAILearning();
    }, 30000);
  }

  updateAILearning() {
    this.visualAIs.forEach(ai => {
      ai.updateLearning();
    });
  }

  getTrainingReport() {
    const report = {
      visualAIs: this.visualAIs.size,
      buttonStates: this.buttonStates.size,
      featuresMonitored: this.featureMonitoring.size,
      trainingData: Object.fromEntries(this.trainingData),
      aiAccuracies: {}
    };

    this.visualAIs.forEach((ai, id) => {
      report.aiAccuracies[id] = ai.accuracy;
    });

    return report;
  }
}

class VisualAI {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.specialization = config.specialization;
    this.learningRate = config.learningRate;
    this.accuracy = config.accuracy;
    this.trainingLevel = config.trainingLevel;
    this.knowledge = new Map();
    this.experiences = [];
    this.currentLearning = null;
  }

  learnButtonStates(buttonStates) {
    this.knowledge.set('button-states', buttonStates);
    console.log(`🧠 ${this.name} learned ${Object.keys(buttonStates).length} button states`);
  }

  learnNavigationPatterns(patterns) {
    this.knowledge.set('navigation-patterns', patterns);
    console.log(`🧠 ${this.name} learned ${Object.keys(patterns).length} navigation patterns`);
  }

  processEvent(event, data) {
    this.experiences.push({
      event,
      data,
      timestamp: Date.now(),
      confidence: this.calculateConfidence(event, data)
    });

    // Analyze and learn from event
    this.analyzeEvent(event, data);

    // Keep only recent experiences
    if (this.experiences.length > 1000) {
      this.experiences = this.experiences.slice(-500);
    }
  }

  calculateConfidence(event, data) {
    let confidence = this.accuracy / 100;

    // Adjust based on specialization
    if (event.includes('button') && this.specialization.includes('button-recognition')) {
      confidence += 0.1;
    }
    if (event.includes('navigation') && this.specialization.includes('navigation-detection')) {
      confidence += 0.1;
    }
    if (event.includes('overlap') && this.specialization.includes('overlap-detection')) {
      confidence += 0.1;
    }

    return Math.min(1, confidence);
  }

  analyzeEvent(event, data) {
    switch (event) {
      case 'button-state-change':
        this.analyzeButtonStateChange(data);
        break;
      case 'navigation-detected':
        this.analyzeNavigation(data);
        break;
      case 'element-overlap-detected':
        this.analyzeOverlap(data);
        break;
      case 'action-failed':
        this.analyzeFailedAction(data);
        break;
    }
  }

  analyzeButtonStateChange(data) {
    const { oldState, newState, trigger } = data;
    
    // Learn timing patterns
    const pattern = `${oldState}->${newState}`;
    const learningData = this.knowledge.get('timing-patterns') || new Map();
    
    if (!learningData.has(pattern)) {
      learningData.set(pattern, []);
    }
    
    learningData.get(pattern).push({
      trigger,
      timestamp: Date.now()
    });
    
    this.knowledge.set('timing-patterns', learningData);
  }

  analyzeNavigation(data) {
    const { oldUrl, newUrl, navigationTime } = data;
    
    // Learn navigation success patterns
    const navigationData = this.knowledge.get('navigation-success') || [];
    navigationData.push({
      successful: true,
      timing: navigationTime,
      urlChange: oldUrl !== newUrl
    });
    
    this.knowledge.set('navigation-success', navigationData);
  }

  analyzeOverlap(data) {
    const { overlaps } = data;
    
    // Learn overlap patterns
    const overlapData = this.knowledge.get('overlap-patterns') || [];
    overlapData.push({
      count: overlaps.length,
      severity: overlaps.reduce((max, overlap) => Math.max(max, overlap.zIndexDifference), 0),
      timestamp: Date.now()
    });
    
    this.knowledge.set('overlap-patterns', overlapData);
  }

  analyzeFailedAction(data) {
    const { reason } = data;
    
    // Learn failure patterns
    const failureData = this.knowledge.get('failure-patterns') || new Map();
    
    if (!failureData.has(reason)) {
      failureData.set(reason, 0);
    }
    
    failureData.set(reason, failureData.get(reason) + 1);
    this.knowledge.set('failure-patterns', failureData);
  }

  updateLearning() {
    // Improve accuracy based on recent experiences
    const recentExperiences = this.experiences.filter(exp => 
      Date.now() - exp.timestamp < 60000 // Last minute
    );

    if (recentExperiences.length > 0) {
      const avgConfidence = recentExperiences.reduce((sum, exp) => sum + exp.confidence, 0) / recentExperiences.length;
      
      // Adjust accuracy based on performance
      if (avgConfidence > 0.8) {
        this.accuracy = Math.min(100, this.accuracy + this.learningRate);
      } else if (avgConfidence < 0.5) {
        this.accuracy = Math.max(50, this.accuracy - this.learningRate / 2);
      }
      
      console.log(`🧠 ${this.name} accuracy updated to ${this.accuracy.toFixed(1)}%`);
    }
  }

  getKnowledgeReport() {
    return {
      name: this.name,
      accuracy: this.accuracy,
      experiences: this.experiences.length,
      knowledge: Object.fromEntries(this.knowledge),
      recentActivity: this.experiences.slice(-10)
    };
  }
}

// Initialize the system
const visualAITraining = new VisualAITrainingSystem();

// Make globally accessible
window.visualAITraining = visualAITraining;

console.log('👁️ Visual AI Training System loaded and operational!');
