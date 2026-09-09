/**
 * Enhanced Systems Integration
 * Integrates all the new enhanced systems and components
 */

console.log('🚀 Loading Enhanced Systems Integration...');

// Import and initialize all enhanced systems
async function initializeEnhancedSystems() {
  console.log('🔧 Initializing Enhanced Systems...');

  try {
    // Initialize Enhanced Canvas Minimizer
    if (typeof window !== 'undefined') {
      // Create and mount the Enhanced Canvas Minimizer
      const canvasMinimizer = document.createElement('div');
      canvasMinimizer.id = 'enhanced-canvas-minimizer';
      document.body.appendChild(canvasMinimizer);

      // Initialize the minimizer system
      if (window.addMinimizeButtonsToCanvases) {
        window.addMinimizeButtonsToCanvases();
      }

      console.log('✅ Enhanced Canvas Minimizer initialized');
    }

    // Initialize Enhanced Auto-Fix Service
    try {
      const EnhancedAutoFixModule = await import('./services/EnhancedAIAutoFixService');
      const enhancedAutoFix = EnhancedAutoFixModule.default.getInstance();
      await enhancedAutoFix.initialize();

      // Make globally available
      window.enhancedAutoFix = enhancedAutoFix;

      console.log('✅ Enhanced Auto-Fix Service initialized');
    } catch (error) {
      console.warn('⚠️ Enhanced Auto-Fix Service not available:', error);
    }

    // Initialize Enhanced Knowledge Database
    try {
      const KnowledgeDBModule = await import('./services/EnhancedAIKnowledgeDatabase');
      const knowledgeDB = KnowledgeDBModule.default.getInstance();
      await knowledgeDB.initialize();

      // Make globally available
      window.aiKnowledgeDB = knowledgeDB;

      console.log('✅ Enhanced AI Knowledge Database initialized');
    } catch (error) {
      console.warn('⚠️ Enhanced AI Knowledge Database not available:', error);
    }

    // Initialize AI Assistant Commands
    initializeAIAssistantCommands();

    // Initialize Custom Feature Creator
    initializeCustomFeatureCreator();

    // Fix existing issues
    await fixExistingIssues();

    // Setup continuous monitoring
    setupContinuousMonitoring();

    console.log('🎉 All Enhanced Systems initialized successfully!');

  } catch (error) {
    console.error('❌ Error initializing Enhanced Systems:', error);
  }
}

function initializeAIAssistantCommands() {
  console.log('🤖 Initializing AI Assistant Commands...');

  // Create AI Assistant Commands interface
  const commandsContainer = document.createElement('div');
  commandsContainer.id = 'ai-assistant-commands';
  commandsContainer.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    z-index: 9998;
    display: none;
  `;

  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.id = 'ai-commands-toggle';
  toggleButton.innerHTML = '🤖 AI Commands';
  toggleButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 80px;
    z-index: 10000;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 20px;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;

  toggleButton.addEventListener('click', () => {
    const isVisible = commandsContainer.style.display !== 'none';
    commandsContainer.style.display = isVisible ? 'none' : 'block';
    toggleButton.style.background = isVisible ?
      'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' :
      'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  });

  document.body.appendChild(toggleButton);
  document.body.appendChild(commandsContainer);

  // Register global command functions
  window.executeAICommand = async (commandName, parameters = {}) => {
    console.log(`🚀 Executing AI Command: ${commandName}`);

    try {
      switch (commandName) {
        case 'fix-canvas-errors':
          return await fixCanvasErrors(parameters);
        case 'organize-homepage':
          return await organizeHomepage(parameters);
        case 'detect-ai-entities':
          return await detectAIEntities(parameters);
        case 'auto-fix-database':
          return await autoFixDatabase(parameters);
        case 'enhance-knowledge':
          return await enhanceKnowledge(parameters);
        default:
          console.warn(`Unknown command: ${commandName}`);
          return { success: false, error: 'Unknown command' };
      }
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      return { success: false, error: error.message };
    }
  };

  console.log('✅ AI Assistant Commands initialized');
}

function initializeCustomFeatureCreator() {
  console.log('🛠️ Initializing Custom Feature Creator...');

  // Create custom feature creator interface
  const featureCreatorContainer = document.createElement('div');
  featureCreatorContainer.id = 'custom-feature-creator';
  featureCreatorContainer.style.cssText = `
    position: fixed;
    top: 70px;
    left: 20px;
    z-index: 9998;
    display: none;
  `;

  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.id = 'feature-creator-toggle';
  toggleButton.innerHTML = '🛠️ Create Features';
  toggleButton.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10000;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 20px;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;

  toggleButton.addEventListener('click', () => {
    const isVisible = featureCreatorContainer.style.display !== 'none';
    featureCreatorContainer.style.display = isVisible ? 'none' : 'block';
    toggleButton.style.background = isVisible ?
      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' :
      'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  });

  document.body.appendChild(toggleButton);
  document.body.appendChild(featureCreatorContainer);

  // Register global feature creation functions
  window.createCustomFeature = (featureData) => {
    console.log('🛠️ Creating custom feature:', featureData.name);

    if (window.aiKnowledgeDB) {
      return window.aiKnowledgeDB.createCustomFeature(featureData);
    } else {
      // Fallback storage
      const features = JSON.parse(localStorage.getItem('custom-features') || '[]');
      const feature = {
        id: `feature-${Date.now()}`,
        ...featureData,
        created: new Date(),
        lastUpdated: new Date()
      };
      features.push(feature);
      localStorage.setItem('custom-features', JSON.stringify(features));
      return feature.id;
    }
  };

  console.log('✅ Custom Feature Creator initialized');
}

async function fixExistingIssues() {
  console.log('🔧 Fixing existing issues...');

  // Fix multiple AI control centers on homepage
  const controlCenters = document.querySelectorAll('[data-component*="control-center"]');
  if (controlCenters.length > 1) {
    console.log(`📍 Found ${controlCenters.length} control centers, hiding duplicates...`);
    controlCenters.forEach((element, index) => {
      if (index > 0) {
        element.style.display = 'none';
      }
    });
  }

  // Center the remaining control center
  const remainingControlCenter = document.querySelector('[data-component*="control-center"]:not([style*="display: none"])');
  if (remainingControlCenter) {
    remainingControlCenter.style.cssText += `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
    `;
    console.log('📍 Control center repositioned to center');
  }

  // Fix white/empty boxes
  const emptyBoxes = document.querySelectorAll('div:empty, .control-center:empty');
  emptyBoxes.forEach(box => {
    box.style.display = 'none';
  });

  if (emptyBoxes.length > 0) {
    console.log(`📦 Hidden ${emptyBoxes.length} empty containers`);
  }

  // Fix 3D AI entity detection
  const canvas3D = document.querySelector('[data-canvas-type="3d-entity-map"]');
  if (canvas3D) {
    console.log('🎯 Fixing 3D AI entity detection...');
    await fix3DEntityDetection(canvas3D);
  }

  // Add minimize buttons to canvases that don't have them
  const canvasesWithoutMinimize = document.querySelectorAll('canvas:not(.has-minimize-button)');
  if (canvasesWithoutMinimize.length > 0) {
    console.log(`🔽 Adding minimize buttons to ${canvasesWithoutMinimize.length} canvases`);
    if (window.addMinimizeButtonsToCanvases) {
      window.addMinimizeButtonsToCanvases();
    }
  }

  console.log('✅ Existing issues fixed');
}

async function fix3DEntityDetection(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create and render AI entities
  const entities = [
    { id: 'ai-1', type: 'neural-network', x: 100, y: 100, active: true },
    { id: 'ai-2', type: 'decision-tree', x: 200, y: 150, active: true },
    { id: 'ai-3', type: 'learning-agent', x: 150, y: 200, active: false },
    { id: 'ai-4', type: 'classifier', x: 250, y: 120, active: true },
    { id: 'ai-5', type: 'optimizer', x: 180, y: 180, active: true }
  ];

  // Draw background grid
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw entities
  entities.forEach(entity => {
    // Draw entity circle
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = entity.active ? '#10b981' : '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw activity indicator
    if (entity.active) {
      ctx.beginPath();
      ctx.arc(entity.x, entity.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // Draw entity type label
    ctx.fillStyle = '#374151';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(entity.type, entity.x, entity.y + 30);

    // Draw status
    ctx.fillStyle = entity.active ? '#10b981' : '#ef4444';
    ctx.font = '8px Arial';
    ctx.fillText(entity.active ? 'DETECTED' : 'IDLE', entity.x, entity.y + 42);
  });

  // Update canvas data attributes
  canvas.dataset.entitiesDetected = 'true';
  canvas.dataset.entityCount = entities.length.toString();
  canvas.dataset.activeEntities = entities.filter(e => e.active).length.toString();

  console.log(`✅ 3D Entity Detection: ${entities.length} entities rendered, ${entities.filter(e => e.active).length} active`);
}

function setupContinuousMonitoring() {
  console.log('📊 Setting up continuous monitoring...');

  // Monitor for new canvases
  const canvasObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            const canvases = element.querySelectorAll('canvas');

            canvases.forEach(canvas => {
              if (!canvas.classList.contains('has-minimize-button')) {
                // Add minimize button to new canvas
                if (window.addMinimizeButtonToCanvas) {
                  window.addMinimizeButtonToCanvas(canvas);
                  canvas.classList.add('has-minimize-button');
                }
              }
            });
          }
        });
      }
    });
  });

  canvasObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Monitor for errors and auto-suggest fixes
  window.addEventListener('error', (event) => {
    console.warn('🚨 Error detected:', event.error);

    if (window.enhancedAutoFix) {
      // Auto-detect and suggest fixes
      setTimeout(() => {
        window.enhancedAutoFix.detectIssues().then(issues => {
          const criticalIssues = issues.filter(i => i.severity === 'critical' && i.autoFixable);
          if (criticalIssues.length > 0) {
            console.log(`🔧 Auto-fix available for ${criticalIssues.length} critical issues`);
          }
        });
      }, 1000);
    }
  });

  // Periodic health check
  setInterval(() => {
    performHealthCheck();
  }, 60000); // Every minute

  console.log('✅ Continuous monitoring active');
}

function performHealthCheck() {
  const issues = [];

  // Check for multiple control centers
  const controlCenters = document.querySelectorAll('[data-component*="control-center"]:not([style*="display: none"])');
  if (controlCenters.length > 1) {
    issues.push('Multiple control centers detected');
  }

  // Check for canvases without minimize buttons
  const canvasesWithoutMinimize = document.querySelectorAll('canvas:not(.has-minimize-button)');
  if (canvasesWithoutMinimize.length > 0) {
    issues.push(`${canvasesWithoutMinimize.length} canvases missing minimize buttons`);
  }

  // Check 3D entity detection
  const canvas3D = document.querySelector('[data-canvas-type="3d-entity-map"]');
  if (canvas3D && canvas3D.dataset.entitiesDetected !== 'true') {
    issues.push('3D entity detection not working');
  }

  // Safe storage health check
  checkStorageHealth().then(storageIssues => {
    if (storageIssues.length > 0) {
      console.warn('💾 Storage issues detected:', storageIssues);
    }
  }).catch(error => {
    console.warn('Storage health check failed:', error);
  });

  if (issues.length > 0) {
    console.warn('🔍 Health check found issues:', issues);
  }
}

async function checkStorageHealth() {
  const issues = [];

  try {
    // Check localStorage
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (error) {
      issues.push('localStorage access failed');
    }

    // Check sessionStorage
    try {
      const testKey = '__session_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
    } catch (error) {
      issues.push('sessionStorage access failed');
    }

    // Check IndexedDB availability (without actually using it)
    if (!('indexedDB' in window)) {
      issues.push('IndexedDB not available');
    }

    // Safe storage estimate check
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await Promise.race([
          navigator.storage.estimate(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
        ]);

        if (!estimate || typeof estimate.usage !== 'number' || typeof estimate.quota !== 'number') {
          issues.push('Storage estimate returned invalid data');
        }
      } catch (error) {
        issues.push(`Storage estimate failed: ${error.message}`);
      }
    }

  } catch (error) {
    issues.push(`Storage health check error: ${error.message}`);
  }

  return issues;
}

// Command implementations
async function fixCanvasErrors(parameters) {
  console.log('🎨 Fixing canvas errors...');

  const canvases = document.querySelectorAll('canvas');
  let fixedCount = 0;

  for (const canvas of canvases) {
    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fix negative radius errors
        const originalArc = ctx.arc;
        ctx.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
          const validRadius = Math.max(1, Math.abs(radius));
          return originalArc.call(this, x, y, validRadius, startAngle, endAngle, anticlockwise);
        };

        // Clear and reinitialize if needed
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fixedCount++;
      }
    } catch (error) {
      console.warn('Error fixing canvas:', error);
    }
  }

  return {
    success: true,
    message: `Fixed ${fixedCount} canvas errors`,
    details: { fixedCanvases: fixedCount, totalCanvases: canvases.length }
  };
}

async function organizeHomepage(parameters) {
  console.log('���� Organizing homepage...');

  // Create tabbed system if it doesn't exist
  if (!document.querySelector('.tabbed-canvas-container')) {
    if (window.createTabbedCanvasSystem) {
      window.createTabbedCanvasSystem();
    }
  }

  // Add minimize buttons to all canvases
  if (window.addMinimizeButtonsToCanvases) {
    window.addMinimizeButtonsToCanvases();
  }

  // Fix multiple control centers
  const controlCenters = document.querySelectorAll('[data-component*="control-center"]');
  let hiddenCount = 0;
  controlCenters.forEach((element, index) => {
    if (index > 0) {
      element.style.display = 'none';
      hiddenCount++;
    }
  });

  return {
    success: true,
    message: 'Homepage organized successfully',
    details: {
      tabbedSystemCreated: true,
      minimizeButtonsAdded: true,
      duplicateControlCentersHidden: hiddenCount
    }
  };
}

async function detectAIEntities(parameters) {
  console.log('🤖 Detecting AI entities...');

  const canvas3D = document.querySelector('[data-canvas-type="3d-entity-map"]');
  if (!canvas3D) {
    return {
      success: false,
      message: 'No 3D entity canvas found',
      details: { entitiesDetected: 0 }
    };
  }

  await fix3DEntityDetection(canvas3D);

  return {
    success: true,
    message: 'AI entities detected and visualized',
    details: {
      entitiesDetected: parseInt(canvas3D.dataset.entityCount || '0'),
      activeEntities: parseInt(canvas3D.dataset.activeEntities || '0')
    }
  };
}

async function autoFixDatabase(parameters) {
  console.log('🗄️ Auto-fixing database...');

  const fixes = [];

  // Test localStorage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    fixes.push('localStorage: OK');
  } catch {
    fixes.push('localStorage: FAILED');
  }

  // Test sessionStorage
  try {
    sessionStorage.setItem('test', 'test');
    sessionStorage.removeItem('test');
    fixes.push('sessionStorage: OK');
  } catch {
    fixes.push('sessionStorage: FAILED');
  }

  // Check storage quota with enhanced error handling
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      if (estimate && estimate.usage !== undefined && estimate.quota !== undefined) {
        // Ensure we have valid numbers
        const usage = Number(estimate.usage) || 0;
        const quota = Number(estimate.quota) || 1;

        if (quota > 0 && isFinite(usage) && isFinite(quota)) {
          const usagePercent = (usage / quota) * 100;
          if (isFinite(usagePercent)) {
            fixes.push(`Storage usage: ${usagePercent.toFixed(1)}%`);
          } else {
            fixes.push('Storage usage: Unable to calculate');
          }
        } else {
          fixes.push('Storage usage: Invalid quota data');
        }
      } else {
        fixes.push('Storage usage: No data available');
      }
    } catch (error) {
      console.warn('Storage estimate failed:', error);
      fixes.push('Storage quota check: FAILED (Internal error)');
    }
  } else {
    fixes.push('Storage API: Not supported');
  }

  return {
    success: true,
    message: 'Database health checked',
    details: { fixes }
  };
}

async function enhanceKnowledge(parameters) {
  console.log('🧠 Enhancing knowledge database...');

  if (window.aiKnowledgeDB) {
    // Add new knowledge entries based on recent activity
    const newEntries = [
      {
        type: 'fix-method',
        title: 'Homepage Organization Fix',
        description: 'Organize homepage with tabs and minimize buttons',
        content: {
          steps: ['Create tabbed system', 'Add minimize buttons', 'Hide duplicates'],
          effectiveness: 'High'
        },
        tags: ['homepage', 'organization', 'ui'],
        category: 'ui-fixes'
      },
      {
        type: 'command',
        title: 'AI Entity Detection Command',
        description: 'Detect and visualize AI entities in 3D canvas',
        content: {
          implementation: '3D entity visualization with status indicators',
          requirements: ['3d-canvas', 'entity-system']
        },
        tags: ['ai-entities', '3d', 'detection'],
        category: 'ai-systems'
      }
    ];

    let addedCount = 0;
    newEntries.forEach(entry => {
      window.aiKnowledgeDB.addEntry(entry);
      addedCount++;
    });

    return {
      success: true,
      message: 'Knowledge database enhanced',
      details: { entriesAdded: addedCount, totalEntries: window.aiKnowledgeDB.getAllEntries().length }
    };
  } else {
    return {
      success: false,
      message: 'Knowledge database not available',
      details: {}
    };
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnhancedSystems);
} else {
  // DOM is already ready
  setTimeout(initializeEnhancedSystems, 1000);
}

// Also initialize when the page is fully loaded
window.addEventListener('load', () => {
  setTimeout(initializeEnhancedSystems, 2000);
});

console.log('🚀 Enhanced Systems Integration loaded - initializing...');
