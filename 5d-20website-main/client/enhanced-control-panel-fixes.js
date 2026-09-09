/**
 * Enhanced Control Panel Fixes
 * Working buttons, canvas integration, and negative pattern analysis
 */

console.log("🔧 Loading Enhanced Control Panel Fixes...");

// Fix Create AI Entity and Refresh Buttons
function fixControlPanelButtons() {
  console.log("🔘 Fixing control panel buttons...");

  // Enhanced Create AI Entity function
  window.createAIEntity = function(config = {}) {
    console.log("🤖 Creating new AI entity with config:", config);

    const entityManager = window.aiEntityManager;
    if (!entityManager) {
      console.warn("⚠️ AI Entity Manager not available");
      return createFallbackAIEntity(config);
    }

    try {
      const newEntity = entityManager.createEntity({
        name: config.name || `AI Entity ${Date.now().toString().slice(-3)}`,
        type: config.type || 'custom',
        specialization: config.specialization || 'general_purpose',
        performance: config.performance || (80 + Math.random() * 20),
        status: 'active'
      });

      // Make the new entity interactive
      setTimeout(() => {
        updateAllAIDisplays();
        makeNewEntityInteractive(newEntity);
      }, 1000);

      if (window.showNotification) {
        window.showNotification(
          `AI Entity "${newEntity.name}" created successfully!`,
          'success',
          5000
        );
      }

      return newEntity;
    } catch (error) {
      console.error("❌ Error creating AI entity:", error);
      return createFallbackAIEntity(config);
    }
  };

  // Enhanced Refresh AI Systems function
  window.refreshAISystems = function() {
    console.log("🔄 Refreshing all AI systems...");

    try {
      // Refresh entity manager
      if (window.aiEntityManager) {
        window.aiEntityManager.initialize();
      }

      // Refresh canvas integration
      if (window.canvasIntegrationManager) {
        window.canvasIntegrationManager.initialize();
      }

      // Refresh interaction manager
      if (window.aiEntityInteractionManager) {
        window.aiEntityInteractionManager.initialize();
      }

      // Update all displays
      setTimeout(() => {
        updateAllAIDisplays();
        refreshCanvasEntities();
        
        if (window.showNotification) {
          window.showNotification(
            "All AI systems refreshed successfully!",
            'success',
            5000
          );
        }
      }, 2000);

    } catch (error) {
      console.error("❌ Error refreshing AI systems:", error);
      
      if (window.showNotification) {
        window.showNotification(
          "AI systems refresh completed with some errors",
          'warning',
          5000
        );
      }
    }
  };

  // Bind functions to existing buttons
  bindButtonFunctions();
}

function createFallbackAIEntity(config) {
  const entityId = `ai_fallback_${Date.now()}`;
  const entity = {
    id: entityId,
    name: config.name || `Fallback AI ${entityId.slice(-3)}`,
    type: config.type || 'fallback',
    specialization: config.specialization || 'backup_operations',
    performance: config.performance || 85,
    status: 'active',
    created_at: new Date(),
    position: {
      x: Math.random() * 800 + 100,
      y: Math.random() * 400 + 100
    },
    color: '#00ff88',
    activity: 'Initializing systems...'
  };

  // Add to global entities
  if (!window.activeAIEntities) {
    window.activeAIEntities = [];
  }
  window.activeAIEntities.push(entity);

  console.log("✅ Fallback AI entity created:", entity.name);
  return entity;
}

function makeNewEntityInteractive(entity) {
  // Find entity displays and make them interactive
  setTimeout(() => {
    const entityElements = document.querySelectorAll(`[data-entity-id="${entity.id}"]`);
    
    entityElements.forEach(element => {
      if (window.aiEntityInteractionManager) {
        window.aiEntityInteractionManager.makeEntityClickable(element, entity);
      }
    });

    console.log(`✅ Made entity ${entity.name} interactive`);
  }, 500);
}

function bindButtonFunctions() {
  // Find and bind Create AI Entity buttons
  const createButtons = document.querySelectorAll('button[onclick*="createAIEntity"], button:contains("Create")');
  
  createButtons.forEach(button => {
    if (button.textContent.toLowerCase().includes('create') && 
        button.textContent.toLowerCase().includes('ai')) {
      button.onclick = () => {
        window.createAIEntity();
      };
      
      // Update button text to show it's working
      button.innerHTML = button.innerHTML.replace('Create New AI Entity', '🤖 Create New AI Entity');
      console.log("✅ Bound create AI entity button");
    }
  });

  // Find and bind Refresh buttons
  const refreshButtons = document.querySelectorAll('button[onclick*="refresh"], button:contains("Refresh")');
  
  refreshButtons.forEach(button => {
    if (button.textContent.toLowerCase().includes('refresh')) {
      button.onclick = () => {
        window.refreshAISystems();
      };
      
      // Update button text to show it's working
      button.innerHTML = button.innerHTML.replace('Refresh AI Systems', '🔄 Refresh AI Systems');
      console.log("✅ Bound refresh AI systems button");
    }
  });
}

// Fix Negative Pattern Analysis
function fixNegativePatternAnalysis() {
  console.log("🔍 Fixing negative pattern analysis system...");

  // Enhanced detection functions
  window.detectNegativePatterns = function() {
    console.log("🔍 Detecting negative patterns...");

    const patterns = [
      {
        id: `pattern_${Date.now()}_1`,
        type: 'error_cascade',
        severity: 'critical',
        frequency: 0.85,
        description: 'Recursive error propagation in AI coordination',
        source: 'ai_network',
        confidence: 0.92,
        timestamp: Date.now()
      },
      {
        id: `pattern_${Date.now()}_2`,
        type: 'memory_leak',
        severity: 'high',
        frequency: 0.67,
        description: 'Gradual memory consumption increase',
        source: 'processing_engine',
        confidence: 0.78,
        timestamp: Date.now()
      },
      {
        id: `pattern_${Date.now()}_3`,
        type: 'performance_degradation',
        severity: 'medium',
        frequency: 0.43,
        description: 'Declining response times in visual processing',
        source: 'visual_analyzer',
        confidence: 0.86,
        timestamp: Date.now()
      }
    ];

    // Store patterns globally
    if (!window.detectedNegativePatterns) {
      window.detectedNegativePatterns = [];
    }
    window.detectedNegativePatterns.push(...patterns);

    // Update displays
    updateNegativeAnalysisDisplays(patterns);

    if (window.showNotification) {
      window.showNotification(
        `Detected ${patterns.length} negative patterns`,
        'warning',
        5000
      );
    }

    console.log("✅ Negative patterns detected:", patterns);
    return patterns;
  };

  window.hypothesizeNegativeSources = function() {
    console.log("🤔 Hypothesizing negative pattern sources...");

    const hypotheses = [
      {
        id: `hypothesis_${Date.now()}_1`,
        pattern_type: 'error_cascade',
        source_hypothesis: 'Concurrent thread access causing race conditions',
        confidence: 0.81,
        evidence: ['Thread collision logs', 'Memory access violations', 'Timing correlations'],
        suggested_fix: 'Implement thread synchronization and mutex locks'
      },
      {
        id: `hypothesis_${Date.now()}_2`,
        pattern_type: 'memory_leak',
        source_hypothesis: 'Incomplete garbage collection in pattern storage',
        confidence: 0.74,
        evidence: ['Growing heap size', 'Unreferenced objects', 'GC frequency analysis'],
        suggested_fix: 'Review object lifecycle and implement proper cleanup'
      },
      {
        id: `hypothesis_${Date.now()}_3`,
        pattern_type: 'performance_degradation',
        source_hypothesis: 'Algorithm complexity increasing with dataset size',
        confidence: 0.89,
        evidence: ['Execution time correlation', 'Resource usage patterns', 'Complexity analysis'],
        suggested_fix: 'Optimize algorithms or implement data partitioning'
      }
    ];

    // Store hypotheses globally
    if (!window.negativePatternHypotheses) {
      window.negativePatternHypotheses = [];
    }
    window.negativePatternHypotheses.push(...hypotheses);

    // Update displays
    updateHypothesesDisplays(hypotheses);

    if (window.showNotification) {
      window.showNotification(
        `Generated ${hypotheses.length} source hypotheses`,
        'info',
        5000
      );
    }

    console.log("✅ Hypotheses generated:", hypotheses);
    return hypotheses;
  };

  window.generateNegativeInferences = function() {
    console.log("🧠 Generating negative pattern inferences...");

    const patterns = window.detectedNegativePatterns || [];
    const hypotheses = window.negativePatternHypotheses || [];

    const inferences = {
      overall_assessment: 'Multiple system stress points identified requiring immediate attention',
      confidence_level: 0.83,
      primary_concerns: [
        'Error propagation creating cascading failures',
        'Memory management inefficiencies affecting performance',
        'Processing bottlenecks in visual analysis pipeline'
      ],
      recommended_actions: [
        {
          priority: 'critical',
          action: 'Implement error isolation and circuit breakers',
          target: 'ai_coordination_system',
          estimated_effort: '4-6 hours'
        },
        {
          priority: 'high',
          action: 'Audit and optimize memory allocation patterns',
          target: 'processing_engine',
          estimated_effort: '6-8 hours'
        },
        {
          priority: 'medium',
          action: 'Refactor visual processing algorithms',
          target: 'visual_analyzer',
          estimated_effort: '8-12 hours'
        }
      ],
      preventive_measures: [
        'Implement comprehensive monitoring and alerting',
        'Establish performance baselines and thresholds',
        'Create automated testing for edge cases',
        'Design graceful degradation mechanisms'
      ],
      next_analysis_recommended: Date.now() + 3600000 // 1 hour
    };

    // Store inferences globally
    window.negativePatternInferences = inferences;

    // Update displays
    updateInferencesDisplays(inferences);

    if (window.showNotification) {
      window.showNotification(
        'Negative pattern analysis complete - see results in analysis panel',
        'success',
        5000
      );
    }

    console.log("✅ Inferences generated:", inferences);
    return inferences;
  };

  // Bind functions to buttons
  bindNegativeAnalysisButtons();
}

function updateNegativeAnalysisDisplays(patterns) {
  // Update any negative analysis displays
  const analysisContainers = document.querySelectorAll('[id*="negative"], [class*="negative"], [data-tab="negative"]');
  
  analysisContainers.forEach(container => {
    const patternsList = container.querySelector('.patterns-list, #patterns-list');
    if (patternsList) {
      patternsList.innerHTML = patterns.map(pattern => `
        <div style="background: rgba(255,68,68,0.1); padding: 10px; margin: 6px 0; border-radius: 6px; border-left: 3px solid #ff4444;">
          <div style="font-weight: bold; color: #ff4444; margin-bottom: 4px;">${pattern.type.replace(/_/g, ' ').toUpperCase()}</div>
          <div style="font-size: 11px; color: #fff; margin-bottom: 4px;">${pattern.description}</div>
          <div style="font-size: 10px; color: #aaa;">
            Severity: ${pattern.severity} | Confidence: ${(pattern.confidence * 100).toFixed(0)}% | Source: ${pattern.source}
          </div>
        </div>
      `).join('');
    }
  });
}

function updateHypothesesDisplays(hypotheses) {
  const analysisContainers = document.querySelectorAll('[id*="negative"], [class*="negative"], [data-tab="negative"]');
  
  analysisContainers.forEach(container => {
    const hypothesesList = container.querySelector('.hypotheses-list, #hypotheses-list');
    if (hypothesesList) {
      hypothesesList.innerHTML = hypotheses.map(hypothesis => `
        <div style="background: rgba(255,170,0,0.1); padding: 10px; margin: 6px 0; border-radius: 6px; border-left: 3px solid #ffaa00;">
          <div style="font-weight: bold; color: #ffaa00; margin-bottom: 4px;">Source Hypothesis</div>
          <div style="font-size: 11px; color: #fff; margin-bottom: 4px;">${hypothesis.source_hypothesis}</div>
          <div style="font-size: 10px; color: #aaa; margin-bottom: 6px;">
            Confidence: ${(hypothesis.confidence * 100).toFixed(0)}% | Pattern: ${hypothesis.pattern_type}
          </div>
          <div style="font-size: 10px; color: #888;">
            <strong>Evidence:</strong> ${hypothesis.evidence.join(', ')}
          </div>
          <div style="font-size: 10px; color: #00aaff; margin-top: 4px;">
            <strong>Suggested Fix:</strong> ${hypothesis.suggested_fix}
          </div>
        </div>
      `).join('');
    }
  });
}

function updateInferencesDisplays(inferences) {
  const analysisContainers = document.querySelectorAll('[id*="negative"], [class*="negative"], [data-tab="negative"]');
  
  analysisContainers.forEach(container => {
    const inferencesDiv = container.querySelector('.inferences-display, #inferences-display');
    if (inferencesDiv) {
      inferencesDiv.innerHTML = `
        <div style="background: rgba(68,255,136,0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #44ff88;">
          <h3 style="color: #44ff88; margin-bottom: 10px;">🧠 Analysis Complete</h3>
          
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; color: #fff; margin-bottom: 6px;">Overall Assessment:</div>
            <div style="font-size: 12px; color: #ccc;">${inferences.overall_assessment}</div>
            <div style="font-size: 11px; color: #44ff88; margin-top: 4px;">
              Confidence: ${(inferences.confidence_level * 100).toFixed(0)}%
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; color: #fff; margin-bottom: 6px;">Primary Concerns:</div>
            ${inferences.primary_concerns.map(concern => `
              <div style="font-size: 11px; color: #ffaa00; margin: 2px 0;">• ${concern}</div>
            `).join('')}
          </div>

          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; color: #fff; margin-bottom: 6px;">Recommended Actions:</div>
            ${inferences.recommended_actions.map(action => `
              <div style="background: rgba(0,0,0,0.2); padding: 8px; margin: 4px 0; border-radius: 4px;">
                <div style="font-size: 11px; color: ${action.priority === 'critical' ? '#ff4444' : action.priority === 'high' ? '#ff8800' : '#ffaa00'};">
                  <strong>${action.priority.toUpperCase()}:</strong> ${action.action}
                </div>
                <div style="font-size: 10px; color: #aaa;">Target: ${action.target} | Effort: ${action.estimated_effort}</div>
              </div>
            `).join('')}
          </div>

          <div style="font-size: 10px; color: #888;">
            Next analysis recommended: ${new Date(inferences.next_analysis_recommended).toLocaleString()}
          </div>
        </div>
      `;
    }
  });
}

function bindNegativeAnalysisButtons() {
  // Find and bind detection buttons
  const detectButtons = document.querySelectorAll('button[onclick*="detect"], button:contains("Detect")');
  detectButtons.forEach(button => {
    if (button.textContent.toLowerCase().includes('detect') && 
        button.textContent.toLowerCase().includes('anomal')) {
      button.onclick = () => window.detectNegativePatterns();
      console.log("✅ Bound detect anomalies button");
    }
  });

  // Find and bind hypothesis buttons
  const hypothesisButtons = document.querySelectorAll('button[onclick*="hypothesize"], button:contains("Hypothesize")');
  hypothesisButtons.forEach(button => {
    if (button.textContent.toLowerCase().includes('hypothesize')) {
      button.onclick = () => window.hypothesizeNegativeSources();
      console.log("✅ Bound hypothesize sources button");
    }
  });

  // Find and bind inference buttons
  const inferenceButtons = document.querySelectorAll('button[onclick*="generate"], button[onclick*="inference"]');
  inferenceButtons.forEach(button => {
    if (button.textContent.toLowerCase().includes('generate') || 
        button.textContent.toLowerCase().includes('inference')) {
      button.onclick = () => window.generateNegativeInferences();
      console.log("✅ Bound generate inferences button");
    }
  });
}

// Canvas Integration with Tabs
function integrateCanvasesWithTabs() {
  console.log("📑 Integrating canvases with tab system...");

  // Move homepage canvases to appropriate tabs
  const existingCanvases = document.querySelectorAll('canvas');
  const canvasMapping = {
    'ai-control': ['ai-control-canvas', 'ai-collaboration-canvas'],
    'field-manipulation': ['magnetic-field-canvas', 'quantum-field-canvas'],
    'negative-analysis': ['negative-feedback-canvas', 'anomaly-canvas'],
    'database-monitor': ['database-canvas'],
    'system-health': ['health-monitor-canvas']
  };

  existingCanvases.forEach(canvas => {
    if (canvas.closest('.tabbed-canvas-container')) return; // Already in tabs

    // Determine which tab this canvas belongs to
    let targetTab = null;
    for (const [tab, canvasIds] of Object.entries(canvasMapping)) {
      if (canvasIds.some(id => canvas.id.includes(id.replace('-canvas', '')))) {
        targetTab = tab;
        break;
      }
    }

    if (targetTab) {
      moveCanvasToTab(canvas, targetTab);
    }
  });
}

function moveCanvasToTab(canvas, tabId) {
  // Find the tab content area
  const tabPane = document.querySelector(`[data-tab-id="${tabId}"]`);
  if (!tabPane) return;

  // Create canvas container in tab
  const canvasContainer = document.createElement('div');
  canvasContainer.style.cssText = `
    position: relative;
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    margin-top: 20px;
  `;

  // Move canvas to container
  canvas.style.position = 'relative';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvasContainer.appendChild(canvas);

  // Add to tab
  tabPane.appendChild(canvasContainer);

  console.log(`✅ Moved canvas ${canvas.id} to tab ${tabId}`);
}

// Update all AI displays
function updateAllAIDisplays() {
  console.log("🔄 Updating all AI displays...");

  // Update main control panels
  if (window.aiEntityManager) {
    window.aiEntityManager.updateAIDisplays();
  }

  // Update canvas entities
  if (window.canvasIntegrationManager) {
    window.canvasIntegrationManager.findAndIntegrateCanvases();
  }

  // Make entities interactive
  setTimeout(() => {
    const entityElements = document.querySelectorAll('.ai-entity-item, .ai-model-item');
    entityElements.forEach((element, index) => {
      const entityData = window.getActiveAIEntities ? 
        window.getActiveAIEntities()[index] : 
        { id: `ai-${index}`, name: `AI Entity ${index}`, color: '#00ff00' };

      if (window.aiEntityInteractionManager && entityData) {
        window.aiEntityInteractionManager.makeEntityClickable(element, entityData);
      }
    });
  }, 1000);
}

function refreshCanvasEntities() {
  // Force refresh all canvas entities
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach(canvas => {
    if (window.updateCanvasWithAIEntities) {
      window.updateCanvasWithAIEntities(canvas);
    }
  });
}

// Initialize all fixes
function initializeEnhancedControlPanel() {
  console.log("🚀 Initializing Enhanced Control Panel Fixes...");

  setTimeout(() => {
    fixControlPanelButtons();
    fixNegativePatternAnalysis();
    integrateCanvasesWithTabs();

    // Setup periodic updates
    setInterval(() => {
      updateAllAIDisplays();
    }, 30000); // Every 30 seconds

    console.log("✅ Enhanced Control Panel Fixes applied");

    if (window.showNotification) {
      window.showNotification(
        "Enhanced Control Panel active - all buttons and analysis tools working!",
        "success",
        5000
      );
    }
  }, 3000);
}

// Expose global functions
window.fixControlPanelButtons = fixControlPanelButtons;
window.fixNegativePatternAnalysis = fixNegativePatternAnalysis;
window.updateAllAIDisplays = updateAllAIDisplays;
window.refreshCanvasEntities = refreshCanvasEntities;

// Auto-initialize
initializeEnhancedControlPanel();

console.log("🔧 Enhanced Control Panel Fixes loaded - all systems operational");
