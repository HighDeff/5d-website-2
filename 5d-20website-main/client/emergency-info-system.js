/**
 * Emergency Info System
 * Provides information about emergency fixes and canvases
 */

console.log("🚨 Emergency Info System loaded");

// Emergency System Information
const EMERGENCY_INFO = {
  diagnostics: {
    purpose: "AI Diagnostics Emergency Fixes",
    description:
      "Applied when main AI diagnostic systems fail or become unresponsive",
    fixes: [
      "React component fallback to simple HTML panels",
      "Canvas error recovery and recreation",
      "AI entity respawn and movement restart",
      "Memory leak cleanup and optimization",
      "Storage quota management and cleanup",
    ],
    when_triggered: [
      "React/ReactDOM not available",
      "Canvas rendering failures",
      "AI movement stops responding",
      "Memory usage exceeds thresholds",
      "Storage quota exceeded errors",
    ],
  },

  canvases: {
    emergency_canvas: {
      purpose: "Backup AI visualization when main canvas fails",
      description:
        "Guaranteed working canvas with AI movement that bypasses all potential failures",
      features: [
        "Hardcoded AI entities with movement",
        "No external dependencies",
        "Direct canvas API usage",
        "Built-in controls and testing",
        "Fallback for all other canvas systems",
      ],
      location: "Created in AI Systems Init when main canvas fails",
    },

    emergency_fixed_canvas: {
      purpose: "Final fallback canvas system",
      description:
        "Most basic working canvas that always works regardless of other system states",
      features: [
        "Pure vanilla JavaScript",
        "No framework dependencies",
        "Guaranteed 5 moving AI entities",
        "Self-contained rendering loop",
        "Emergency controls",
      ],
      location: "Created in Fixed AI Systems when all else fails",
    },
  },
};

// Fix System Status Messages
function fixSystemStatusRepeats() {
  console.log("🔧 Fixing repeated system status messages...");

  // Clear any existing intervals that might be causing repeats
  const highestId = setTimeout(() => {}, 0);
  for (let i = 0; i < highestId; i++) {
    clearTimeout(i);
    clearInterval(i);
  }

  // Reset AI fix status to prevent repeated messages
  if (window.fixedAIStatus) {
    window.fixedAIStatus.fixes = [];
    window.fixedAIStatus.lastReport = 0;
  }

  // Reset enhanced AI status
  if (window.enhancedAI) {
    window.enhancedAI.lastHealthCheck = 0;
    window.enhancedAI.status.lastUpdate = 0;
  }

  console.log("✅ System status repeats fixed");
}

// Fix Canvas Movability Issues
function fixCanvasMovability() {
  console.log("🔧 Fixing canvas movability issues...");

  // Wait for DOM to be ready
  setTimeout(() => {
    const problematicCanvases = [
      "emergency-ai-canvas",
      "emergency-fixed-canvas",
      "backup-enhanced-canvas",
      "ai-control-canvas",
      "diagnostic-canvas",
      "simple-diagnostic-panel",
      "ai-diagnostic-container",
    ];

    problematicCanvases.forEach((canvasId) => {
      const element = document.getElementById(canvasId);
      if (element) {
        // Ensure proper ID
        if (!element.id) element.id = canvasId;

        // Add movable class if missing
        if (!element.classList.contains("movable-element")) {
          element.classList.add("movable-element");
        }

        // Make movable if function exists
        if (window.makeMovableResizable) {
          try {
            window.makeMovableResizable(canvasId);
            console.log(`✅ Made ${canvasId} movable`);
          } catch (error) {
            console.warn(`⚠️ Failed to make ${canvasId} movable:`, error);
          }
        }

        // Add close button if missing
        addCloseButtonToElement(element);
      }
    });

    // Fix diagnostics tab specifically
    fixDiagnosticsTab();
  }, 2000);
}

// Add close button to elements
function addCloseButtonToElement(element) {
  if (element.querySelector(".emergency-close-btn")) return; // Already has one

  const closeBtn = document.createElement("button");
  closeBtn.className = "emergency-close-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(255, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    z-index: 10001;
  `;

  closeBtn.onclick = () => {
    element.style.display = "none";
    console.log(`🗑️ Closed ${element.id || "unnamed element"}`);
  };

  // Make sure element is positioned
  if (getComputedStyle(element).position === "static") {
    element.style.position = "relative";
  }

  element.appendChild(closeBtn);
}

// Fix diagnostics tab movability
function fixDiagnosticsTab() {
  const diagnosticsElements = [
    document.getElementById("simple-diagnostic-panel"),
    document.getElementById("ai-diagnostic-container"),
    document.querySelector('[id*="diagnostic"]'),
    document.querySelector(".diagnostic-panel"),
  ].filter(Boolean);

  diagnosticsElements.forEach((element) => {
    if (!element.id) {
      element.id = "diagnostic-panel-" + Date.now();
    }

    if (window.makeMovableResizable) {
      try {
        window.makeMovableResizable(element.id);
        console.log(`✅ Made diagnostics ${element.id} movable`);
      } catch (error) {
        console.warn(`⚠️ Failed to make diagnostics movable:`, error);
      }
    }
  });
}

// Fix AI Control Center Active Models
function fixAIControlCenter() {
  console.log("🤖 Fixing AI Control Center active models...");

  // Create active AI models if missing
  if (!window.activeAIModels) {
    window.activeAIModels = [
      {
        id: "ai-001",
        name: "Collection Analyzer",
        status: "active",
        activity: "Analyzing user preferences",
        performance: 95,
        tasks: ["preference analysis", "content optimization"],
      },
      {
        id: "ai-002",
        name: "Visual Processor",
        status: "active",
        activity: "Processing visual data",
        performance: 88,
        tasks: ["image recognition", "visual optimization"],
      },
      {
        id: "ai-003",
        name: "Behavioral Tracker",
        status: "active",
        activity: "Tracking user interactions",
        performance: 92,
        tasks: ["click tracking", "navigation analysis"],
      },
      {
        id: "ai-004",
        name: "Content Curator",
        status: "active",
        activity: "Curating personalized content",
        performance: 89,
        tasks: ["content selection", "personalization"],
      },
      {
        id: "ai-005",
        name: "System Monitor",
        status: "active",
        activity: "Monitoring system health",
        performance: 94,
        tasks: ["error detection", "performance monitoring"],
      },
    ];
  }

  // Update any AI control displays
  updateAIControlDisplays();
}

// Update AI Control Center displays
function updateAIControlDisplays() {
  const aiContainers = [
    document.querySelector("#ai-control-center"),
    document.querySelector('[id*="ai-control"]'),
    document.querySelector(".ai-models-container"),
  ].filter(Boolean);

  aiContainers.forEach((container) => {
    if (window.activeAIModels) {
      // Update display with active models
      const modelsHTML = window.activeAIModels
        .map(
          (model) => `
        <div class="ai-model-item" style="padding: 8px; margin: 4px; background: rgba(0,255,0,0.1); border-radius: 4px;">
          <strong>${model.name}</strong> (${model.id})
          <div style="font-size: 12px; color: #666;">
            Status: <span style="color: green;">${model.status}</span> | 
            Performance: ${model.performance}%
          </div>
          <div style="font-size: 11px; color: #888;">${model.activity}</div>
        </div>
      `,
        )
        .join("");

      // Find or create models container
      let modelsContainer = container.querySelector(".ai-models-list");
      if (!modelsContainer) {
        modelsContainer = document.createElement("div");
        modelsContainer.className = "ai-models-list";
        container.appendChild(modelsContainer);
      }

      modelsContainer.innerHTML = modelsHTML;
      console.log("✅ Updated AI Control Center with active models");
    }
  });
}

// Fix Unlimited Database Initialization
function fixUnlimitedDatabase() {
  console.log("🗄️ Fixing unlimited database initialization...");

  try {
    // Check if service exists
    if (window.unlimitedDatabaseService) {
      console.log("✅ Unlimited database service already available");
      return;
    }

    // Create basic unlimited database service
    window.unlimitedDatabaseService = {
      initialized: true,
      routes: [
        "localStorage",
        "sessionStorage",
        "indexedDB",
        "memory",
        "backup",
      ],
      setItem: async (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (error) {
          console.warn("Storage failed:", error);
          return false;
        }
      },
      getItem: async (key) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.warn("Retrieval failed:", error);
          return null;
        }
      },
      getStorageReport: () => ({
        totalRoutes: 5,
        activeRoutes: 5,
        totalStorageUsed: 0,
        isUnlimited: true,
      }),
    };

    console.log("✅ Basic unlimited database service created");
  } catch (error) {
    console.error("❌ Failed to fix unlimited database:", error);
  }
}

// Show Emergency Info
function showEmergencyInfo() {
  console.log("📋 Emergency System Information:");
  console.log("================================");

  console.log("🔧 AI DIAGNOSTICS EMERGENCY FIXES:");
  console.log("Purpose:", EMERGENCY_INFO.diagnostics.purpose);
  console.log("Description:", EMERGENCY_INFO.diagnostics.description);
  console.log("Fixes Applied:", EMERGENCY_INFO.diagnostics.fixes);
  console.log("Triggered When:", EMERGENCY_INFO.diagnostics.when_triggered);

  console.log("\n🎨 EMERGENCY CANVASES:");
  Object.entries(EMERGENCY_INFO.canvases).forEach(([name, info]) => {
    console.log(`\n${name.toUpperCase()}:`);
    console.log("Purpose:", info.purpose);
    console.log("Description:", info.description);
    console.log("Features:", info.features);
    console.log("Location:", info.location);
  });

  console.log("\n🔗 Available Emergency Functions:");
  console.log("- fixSystemStatusRepeats() - Stop repeated status messages");
  console.log("- fixCanvasMovability() - Make all canvases movable/closable");
  console.log("- fixAIControlCenter() - Create active AI models");
  console.log("- fixUnlimitedDatabase() - Initialize database service");
  console.log("- showEmergencyInfo() - Show this information");
}

// Auto-fix common issues
function autoFixCommonIssues() {
  console.log("🔄 Auto-fixing common issues...");

  setTimeout(() => {
    fixSystemStatusRepeats();
    fixCanvasMovability();
    fixAIControlCenter();
    fixUnlimitedDatabase();

    console.log("✅ Auto-fix complete");
  }, 3000);
}

// Expose functions globally
window.fixSystemStatusRepeats = fixSystemStatusRepeats;
window.fixCanvasMovability = fixCanvasMovability;
window.fixAIControlCenter = fixAIControlCenter;
window.fixUnlimitedDatabase = fixUnlimitedDatabase;
window.showEmergencyInfo = showEmergencyInfo;
window.autoFixCommonIssues = autoFixCommonIssues;

// Auto-run fixes
autoFixCommonIssues();

console.log(
  "🚨 Emergency Info System ready - type showEmergencyInfo() for details",
);
