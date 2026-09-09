// Initialize Movable Resizable System
// Makes all canvas toolboxes, widgets and tabs draggable and resizable

console.log("🎨 Initializing Movable Resizable System...");

async function initializeMovableResizableSystem() {
  try {
    // Import the system
    const { movableResizableSystem } = await import(
      "./services/MovableResizableSystem.js"
    );

    // Make globally available
    window.movableResizableSystem = movableResizableSystem;

    // Wait a moment for all elements to be loaded
    setTimeout(() => {
      console.log("🔍 Scanning for canvas elements to make movable...");

      // Manually make specific elements movable if they exist
      const specificElements = [
        "fixed-ai-controls",
        "enhanced-magnetic-canvas",
        "ai-diagnostic-container",
        "simple-diagnostic-panel",
        "canvas-measurement-tools",
        "emergency-ai-controls",
        "forced-ai-controls",
        "emergency-fixed-canvas",
        "backup-enhanced-canvas",
        "system-health-notification",
      ];

      let madeMovable = 0;
      specificElements.forEach((elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
          const success = movableResizableSystem.makeElementMovableResizable(
            elementId,
            {
              minWidth: 300,
              minHeight: 200,
            },
          );
          if (success) madeMovable++;
        }
      });

      // Also scan for React components and other dynamic elements
      const reactComponents = document.querySelectorAll(
        [
          '[class*="ai-control"]',
          '[class*="diagnostic"]',
          '[class*="recovery"]',
          '[class*="canvas"]',
          '[class*="control-panel"]',
          '[class*="widget"]',
          '[class*="toolbox"]',
        ].join(", "),
      );

      reactComponents.forEach((element, index) => {
        if (element.offsetParent !== null) {
          // Only visible elements
          const elementId = element.id || `react-component-${index}`;
          if (!element.id) element.id = elementId;

          const success = movableResizableSystem.makeElementMovableResizable(
            elementId,
            {
              minWidth: 250,
              minHeight: 150,
            },
          );
          if (success) madeMovable++;
        }
      });

      console.log(`✅ Made ${madeMovable} elements movable and resizable`);

      // Show notification
      showMovableSystemNotification(madeMovable);
    }, 2000);

    // Create control panel for managing movable elements
    setTimeout(() => {
      createMovableControlPanel();
    }, 3000);

    console.log("✅ Movable Resizable System initialized");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize Movable Resizable System:", error);
    return false;
  }
}

function showMovableSystemNotification(count) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 10001;
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-family: monospace;
    font-weight: bold;
    max-width: 350px;
  `;

  notification.innerHTML = `
    ✨ MOVABLE SYSTEM ACTIVE
    <div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">
      ${count} elements are now draggable & resizable<br>
      Look for ⋮⋮ (drag) and ⟲ (resize) handles
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function createMovableControlPanel() {
  const controlPanel = document.createElement("div");
  controlPanel.id = "movable-control-panel";
  controlPanel.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #444;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
  `;

  controlPanel.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 10px; color: #8b5cf6;">🎨 Movable Controls</div>
    
    <div style="margin-bottom: 10px;">
      <input type="text" id="element-id-input" placeholder="Element ID" 
             style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 3px; margin-bottom: 5px;">
      <div style="display: flex; gap: 5px;">
        <button onclick="makeElementMovable()" 
                style="flex: 1; background: #3b82f6; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer; font-size: 11px;">
          Make Movable
        </button>
        <button onclick="removeMovable()" 
                style="flex: 1; background: #ef4444; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer; font-size: 11px;">
          Remove
        </button>
      </div>
    </div>

    <div style="margin-bottom: 10px;">
      <button onclick="showMovableElements()" 
              style="width: 100%; background: #8b5cf6; color: white; border: none; padding: 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
        List All Movable
      </button>
    </div>

    <div style="margin-bottom: 10px;">
      <button onclick="resetAllPositions()" 
              style="width: 100%; background: #f59e0b; color: white; border: none; padding: 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
        Reset All Positions
      </button>
    </div>

    <div style="font-size: 10px; opacity: 0.7; line-height: 1.3;">
      Drag: ⋮⋮ handle<br>
      Resize: ⟲ handle<br>
      Double-click to minimize
    </div>
  `;

  document.body.appendChild(controlPanel);

  // Add functionality
  window.makeElementMovable = function () {
    const elementId = document.getElementById("element-id-input").value.trim();
    if (elementId) {
      const success = window.makeMovableResizable(elementId);
      alert(
        success
          ? `✅ Made ${elementId} movable`
          : `❌ Failed to make ${elementId} movable`,
      );
    }
  };

  window.removeMovable = function () {
    const elementId = document.getElementById("element-id-input").value.trim();
    if (elementId) {
      const success = window.removeMovableResizable(elementId);
      alert(
        success
          ? `✅ Removed movable from ${elementId}`
          : `❌ Element ${elementId} not found`,
      );
    }
  };

  window.showMovableElements = function () {
    const elements = window.getMovableElements();
    const list = elements.map((el) => `• ${el.id}`).join("\n");
    alert(`Movable Elements (${elements.length}):\n\n${list}`);
  };

  window.resetAllPositions = function () {
    const elements = window.getMovableElements();
    elements.forEach((el) => {
      window.resetElementPosition(el.id);
    });
    alert(`✅ Reset ${elements.length} element positions`);
  };

  // Make the control panel itself movable
  setTimeout(() => {
    window.makeMovableResizable("movable-control-panel", {
      minWidth: 280,
      minHeight: 200,
    });
  }, 500);
}

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeMovableResizableSystem,
  );
} else {
  setTimeout(initializeMovableResizableSystem, 500);
}

console.log("🎨 Movable Resizable System initialization script loaded");
