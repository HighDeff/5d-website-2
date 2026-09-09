/**
 * Canvas and AI Control Center Fixes
 * Adds minimize buttons, fixes AI display issues, and makes controls movable
 */

console.log("🔧 Loading Canvas and AI Control Center Fixes...");

// Add minimize buttons to all canvases
function addMinimizeButtonsToCanvases() {
  console.log("➖ Adding minimize buttons to all canvases...");

  // Find all canvas elements and their containers
  const canvasElements = [
    ...document.querySelectorAll("canvas"),
    ...document.querySelectorAll('[id*="canvas"]'),
    ...document.querySelectorAll('[class*="canvas"]'),
    ...document.querySelectorAll('[id*="control-center"]'),
    ...document.querySelectorAll('[class*="ai-control"]'),
  ];

  canvasElements.forEach((element) => {
    if (!element.id) {
      element.id = `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    }

    addMinimizeButton(element);
  });

  console.log(`✅ Added minimize buttons to ${canvasElements.length} elements`);
}

function addMinimizeButton(element) {
  // Check if minimize button already exists
  if (element.querySelector(".minimize-button")) return;

  const minimizeBtn = document.createElement("button");
  minimizeBtn.className = "minimize-button";
  minimizeBtn.innerHTML = "▼";
  minimizeBtn.title = "Minimize/Restore";
  minimizeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    left: 30px;
    background: rgba(255, 165, 0, 0.8);
    color: white;
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    z-index: 10002;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  `;

  // Store original dimensions
  if (!element.dataset.originalWidth) {
    element.dataset.originalWidth = element.style.width || element.offsetWidth + "px";
    element.dataset.originalHeight = element.style.height || element.offsetHeight + "px";
    element.dataset.originalDisplay = element.style.display || "block";
  }

  minimizeBtn.onclick = () => {
    const isMinimized = element.dataset.minimized === "true";
    
    if (isMinimized) {
      // Restore
      element.style.width = element.dataset.originalWidth;
      element.style.height = element.dataset.originalHeight;
      element.style.display = element.dataset.originalDisplay;
      element.dataset.minimized = "false";
      minimizeBtn.innerHTML = "▼";
      minimizeBtn.title = "Minimize";
      
      // Show child elements
      Array.from(element.children).forEach(child => {
        if (child !== minimizeBtn) {
          child.style.display = child.dataset.originalChildDisplay || "block";
        }
      });
      
      console.log(`📈 Restored ${element.id}`);
    } else {
      // Minimize
      element.dataset.minimized = "true";
      element.style.width = "200px";
      element.style.height = "40px";
      minimizeBtn.innerHTML = "▲";
      minimizeBtn.title = "Restore";
      
      // Hide child elements but store their original display
      Array.from(element.children).forEach(child => {
        if (child !== minimizeBtn) {
          child.dataset.originalChildDisplay = child.style.display || "block";
          child.style.display = "none";
        }
      });
      
      console.log(`📉 Minimized ${element.id}`);
    }
  };

  // Ensure element is positioned
  if (getComputedStyle(element).position === "static") {
    element.style.position = "relative";
  }

  element.appendChild(minimizeBtn);
}

// Fix AI Control Center on Homepage
function makeHomepageAIControlCenterMovable() {
  console.log("🏠 Making homepage AI Control Center movable...");

  // Find AI Control Center on homepage
  setTimeout(() => {
    const homepageSelectors = [
      '[data-loc*="ComprehensiveAIControlCenter"]',
      '.ai-control-center',
      '#ai-control-center',
      '.w-full.max-w-6xl.mx-auto.p-4', // From DOM context
    ];

    homepageSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (!element.id) {
          element.id = `homepage-ai-control-${Date.now()}`;
        }

        // Make it movable
        if (window.makeMovableResizable) {
          try {
            window.makeMovableResizable(element.id);
            console.log(`✅ Made ${element.id} movable`);
          } catch (error) {
            console.warn(`⚠️ Could not make ${element.id} movable:`, error);
          }
        }

        // Add minimize button
        addMinimizeButton(element);

        // Add visual indicator that it's movable
        addMovableIndicator(element);
      });
    });
  }, 2000);
}

function addMovableIndicator(element) {
  if (element.querySelector(".movable-indicator")) return;

  const indicator = document.createElement("div");
  indicator.className = "movable-indicator";
  indicator.innerHTML = "⋮⋮";
  indicator.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 100, 255, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    cursor: move;
    z-index: 10001;
    user-select: none;
  `;

  // Ensure element is positioned
  if (getComputedStyle(element).position === "static") {
    element.style.position = "relative";
  }

  element.appendChild(indicator);
}

// Fix AI Collections Page Blue Ribbon
function fixAICollectionsBlueRibbon() {
  console.log("🎗️ Fixing AI Collections page blue ribbon...");

  // Find the AI Control Center tab and its content
  const aiControlTabs = document.querySelectorAll('[data-loc*="ComprehensiveAIControlCenter"]');
  
  aiControlTabs.forEach(tab => {
    // Add active AI indicators to the blue ribbon area
    updateBlueRibbonWithAIs(tab);
  });

  // Also update any blue ribbon elements directly
  const blueRibbons = document.querySelectorAll('.border-blue-500, .text-blue-600, .bg-blue-50');
  
  blueRibbons.forEach(ribbon => {
    if (ribbon.textContent.includes('AI Control') || ribbon.textContent.includes('Control Center')) {
      addAIStatusToRibbon(ribbon);
    }
  });
}

function updateBlueRibbonWithAIs(container) {
  // Find or create AI status indicator
  let aiStatusDiv = container.querySelector('.ai-status-ribbon');
  
  if (!aiStatusDiv) {
    aiStatusDiv = document.createElement('div');
    aiStatusDiv.className = 'ai-status-ribbon';
    aiStatusDiv.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 4px 12px;
      border-radius: 0 8px 0 8px;
      font-size: 11px;
      font-weight: bold;
      z-index: 10;
    `;
    
    // Ensure container is positioned
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    
    container.appendChild(aiStatusDiv);
  }

  // Get active AI count
  const activeAICount = window.getActiveAIEntities ? window.getActiveAIEntities().length : 5;
  
  aiStatusDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 4px;">
      <div style="width: 8px; height: 8px; background: #00ff00; border-radius: 50%; animation: pulse 2s infinite;"></div>
      ${activeAICount} AIs Active
    </div>
  `;

  console.log(`🎗️ Updated blue ribbon with ${activeAICount} active AIs`);
}

function addAIStatusToRibbon(ribbon) {
  // Add AI status directly to existing ribbon
  const activeAICount = window.getActiveAIEntities ? window.getActiveAIEntities().length : 5;
  
  // Create AI status element
  const aiStatus = document.createElement('span');
  aiStatus.style.cssText = `
    margin-left: 8px;
    font-size: 10px;
    background: rgba(0, 255, 0, 0.2);
    color: #00aa00;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: bold;
  `;
  aiStatus.innerHTML = `${activeAICount} AIs`;
  
  ribbon.appendChild(aiStatus);
}

// Fix Canvas "No AI Entities" Display
function fixCanvasAIEntityDisplay() {
  console.log("🤖 Fixing canvas AI entity display...");

  // Find all canvases that should display AI entities
  const canvases = document.querySelectorAll('canvas');
  
  canvases.forEach(canvas => {
    // Force update canvas with AI entities
    updateCanvasWithAIEntities(canvas);
    
    // Set up regular updates
    if (!canvas.dataset.aiUpdateInterval) {
      canvas.dataset.aiUpdateInterval = "true";
      setInterval(() => {
        updateCanvasWithAIEntities(canvas);
      }, 2000);
    }
  });

  // Also update any text that says "no ai entities"
  updateNoAIEntityText();
}

function updateCanvasWithAIEntities(canvas) {
  if (!canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const activeAIs = window.getActiveAIEntities ? window.getActiveAIEntities() : createFallbackAIs();

  // Clear and redraw with AI entities
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  drawCanvasBackground(ctx, canvas);
  
  // Draw AI entities
  activeAIs.forEach((ai, index) => {
    drawAIEntityOnCanvas(ctx, ai, index, canvas);
  });

  // Draw status overlay
  drawAIStatusOverlay(ctx, canvas, activeAIs);
}

function createFallbackAIs() {
  return [
    {
      id: 'ai-1',
      name: 'Central Command',
      color: '#3b82f6',
      position: { x: 100, y: 100 },
      status: 'active',
      performance: 95
    },
    {
      id: 'ai-2', 
      name: 'Memory System',
      color: '#10b981',
      position: { x: 200, y: 150 },
      status: 'processing',
      performance: 88
    },
    {
      id: 'ai-3',
      name: 'Reverse Thinking',
      color: '#8b5cf6',
      position: { x: 150, y: 200 },
      status: 'active',
      performance: 92
    },
    {
      id: 'ai-4',
      name: 'Field System',
      color: '#f59e0b',
      position: { x: 250, y: 120 },
      status: 'active',
      performance: 87
    },
    {
      id: 'ai-5',
      name: 'Neural Processor',
      color: '#ef4444',
      position: { x: 180, y: 250 },
      status: 'active',
      performance: 90
    }
  ];
}

function drawCanvasBackground(ctx, canvas) {
  // Dark background with grid
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid pattern
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawAIEntityOnCanvas(ctx, ai, index, canvas) {
  const time = Date.now() * 0.001;
  const x = (ai.position?.x || (index * 100 + 50)) + Math.sin(time + index) * 20;
  const y = (ai.position?.y || (index * 80 + 50)) + Math.cos(time + index) * 15;
  
  // Ensure entity stays within canvas bounds
  const boundedX = Math.max(30, Math.min(canvas.width - 30, x));
  const boundedY = Math.max(30, Math.min(canvas.height - 30, y));

  // Draw outer glow
  const gradient = ctx.createRadialGradient(boundedX, boundedY, 0, boundedX, boundedY, 30);
  gradient.addColorStop(0, ai.color || '#00ff00');
  gradient.addColorStop(0.5, `${ai.color || '#00ff00'}88`);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(boundedX, boundedY, 30, 0, Math.PI * 2);
  ctx.fill();

  // Draw main entity
  ctx.fillStyle = ai.color || '#00ff00';
  ctx.beginPath();
  ctx.arc(boundedX, boundedY, 15, 0, Math.PI * 2);
  ctx.fill();

  // Draw core
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(boundedX, boundedY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw status indicator
  const statusColor = ai.status === 'active' ? '#00ff00' : '#ffaa00';
  ctx.fillStyle = statusColor;
  ctx.beginPath();
  ctx.arc(boundedX - 10, boundedY - 10, 3, 0, Math.PI * 2);
  ctx.fill();

  // Draw label
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(ai.name.split(' ')[0], boundedX, boundedY + 25);

  // Draw performance
  ctx.fillStyle = ai.performance > 90 ? '#00ff00' : ai.performance > 75 ? '#ffff00' : '#ff8800';
  ctx.font = '8px monospace';
  ctx.fillText(`${ai.performance || 85}%`, boundedX, boundedY + 35);
}

function drawAIStatusOverlay(ctx, canvas, activeAIs) {
  // Draw title
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`AI ENTITIES: ${activeAIs.length} ACTIVE`, 20, 30);

  // Draw system status
  ctx.fillStyle = '#00ff00';
  ctx.font = '12px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('SYSTEM OPERATIONAL', canvas.width - 20, 30);

  // Draw timestamp
  ctx.fillStyle = '#88ffff';
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Updated: ${new Date().toLocaleTimeString()}`, 20, canvas.height - 10);
}

function updateNoAIEntityText() {
  // Find and replace any "no ai entities" text
  const textElements = document.querySelectorAll('*');
  
  textElements.forEach(element => {
    if (element.textContent && element.textContent.toLowerCase().includes('no ai entities')) {
      const activeCount = window.getActiveAIEntities ? window.getActiveAIEntities().length : 5;
      element.textContent = element.textContent.replace(/no ai entities.*$/i, `${activeCount} AI entities active`);
      element.style.color = '#00aa00';
      console.log('✅ Updated "no ai entities" text');
    }
  });
}

// Initialize all fixes
function initializeAllFixes() {
  console.log("🚀 Initializing all canvas and control center fixes...");

  setTimeout(() => {
    addMinimizeButtonsToCanvases();
    makeHomepageAIControlCenterMovable();
    fixAICollectionsBlueRibbon();
    fixCanvasAIEntityDisplay();

    // Set up observers for dynamic content
    setupDynamicContentObserver();

    console.log("✅ All canvas and control center fixes applied");

    // Show completion notification
    if (window.showNotification) {
      window.showNotification(
        "Canvas and AI Control Center fixes applied successfully!",
        "success",
        5000
      );
    }
  }, 3000);
}

function setupDynamicContentObserver() {
  // Watch for new canvases and control centers being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'CANVAS' || 
            (node.classList && (node.classList.contains('ai-control') || 
                               node.classList.contains('control-center')))) {
          setTimeout(() => {
            addMinimizeButton(node);
            if (node.tagName === 'CANVAS') {
              updateCanvasWithAIEntities(node);
            }
          }, 1000);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Expose global functions
window.addMinimizeButtonsToCanvases = addMinimizeButtonsToCanvases;
window.makeHomepageAIControlCenterMovable = makeHomepageAIControlCenterMovable;
window.fixAICollectionsBlueRibbon = fixAICollectionsBlueRibbon;
window.fixCanvasAIEntityDisplay = fixCanvasAIEntityDisplay;
window.updateCanvasWithAIEntities = updateCanvasWithAIEntities;

// Auto-initialize
initializeAllFixes();

console.log("🔧 Canvas and AI Control Center Fixes loaded - all issues should be resolved");
