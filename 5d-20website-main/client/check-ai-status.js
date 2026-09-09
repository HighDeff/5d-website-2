// AI System Status Checker
// Quick status verification for all enhanced AI systems

console.log("🔍 AI System Status Checker Starting...");

function checkEnhancedAISystemStatus() {
  const status = {
    timestamp: new Date().toISOString(),
    systems: {},
    canvas: {},
    diagnostics: {},
    global_functions: {},
    issues: [],
    recommendations: [],
  };

  // Check Enhanced AI Systems
  if (window.enhancedAI) {
    status.systems.enhancedAI = {
      loaded: true,
      status: window.enhancedAI.status,
      features: window.enhancedAI.features,
      ai_count: window.enhancedAI.ais.size,
      problems_count: window.enhancedAI.problems.length,
    };

    // Check Magnetic Field Canvas
    if (window.enhancedAI.magneticFieldCanvas) {
      status.canvas.magneticField = {
        active: true,
        analysis: window.enhancedAI.magneticFieldCanvas.getFieldAnalysis(),
      };
    } else {
      status.canvas.magneticField = { active: false };
      status.issues.push("Magnetic Field Canvas not initialized");
    }
  } else {
    status.systems.enhancedAI = { loaded: false };
    status.issues.push("Enhanced AI system not loaded");
  }

  // Check Original AI Systems
  if (window.aiSystems) {
    status.systems.originalAI = {
      loaded: true,
      status: window.aiSystems.status,
      features: window.aiSystems.features,
    };
  } else {
    status.systems.originalAI = { loaded: false };
    status.issues.push("Original AI system not loaded");
  }

  // Check Canvas Elements
  const canvases = {
    enhancedMagnetic: document.querySelector("#enhanced-magnetic-canvas"),
    forcedAI: document.querySelector("#forced-ai-canvas"),
    emergencyAI: document.querySelector("#emergency-ai-canvas"),
    backupEnhanced: document.querySelector("#backup-enhanced-canvas"),
    simpleAI: document.querySelector("#simple-ai-canvas"),
  };

  status.canvas.elements = {};
  Object.entries(canvases).forEach(([name, element]) => {
    status.canvas.elements[name] = {
      exists: !!element,
      visible: element
        ? element.style.display !== "none" &&
          element.style.visibility !== "hidden"
        : false,
      zIndex: element ? element.style.zIndex : null,
    };
  });

  const visibleCanvases = Object.entries(status.canvas.elements).filter(
    ([name, info]) => info.exists && info.visible,
  ).length;

  if (visibleCanvases === 0) {
    status.issues.push("No visible AI canvas found");
    status.recommendations.push(
      "Run fixCanvasNow() to create emergency canvas",
    );
  }

  // Check Global Functions
  const expectedFunctions = [
    "askEnhancedAI",
    "checkEnhancedAIStatus",
    "askAI",
    "checkAIStatus",
    "fixCanvasNow",
  ];

  expectedFunctions.forEach((funcName) => {
    status.global_functions[funcName] = typeof window[funcName] === "function";
    if (typeof window[funcName] !== "function") {
      status.issues.push(`Global function ${funcName} not available`);
    }
  });

  // Check Diagnostic Console
  const diagnosticPanel = document.querySelector("#simple-diagnostic-panel");
  const diagnosticContainer = document.querySelector(
    "#ai-diagnostic-container",
  );

  status.diagnostics = {
    simplePanelExists: !!diagnosticPanel,
    reactContainerExists: !!diagnosticContainer,
    anyDiagnosticsActive: !!(diagnosticPanel || diagnosticContainer),
  };

  if (!status.diagnostics.anyDiagnosticsActive) {
    status.issues.push("No diagnostic interface found");
    status.recommendations.push(
      "AI diagnostic console should be visible in top-right",
    );
  }

  // Performance Checks
  const performanceChecks = {
    memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : null,
    timingOrigin: performance.timeOrigin,
    navigationEntries: performance.getEntriesByType("navigation").length,
  };

  status.performance = performanceChecks;

  // Generate Recommendations
  if (status.issues.length === 0) {
    status.recommendations.push("All systems operational ✅");
  } else {
    if (status.issues.includes("No visible AI canvas found")) {
      status.recommendations.push(
        "Try: fixCanvasNow() or window.initializeEnhancedAISystems()",
      );
    }
    if (status.issues.includes("Enhanced AI system not loaded")) {
      status.recommendations.push("Try: window.initializeEnhancedAISystems()");
    }
    if (status.issues.includes("No diagnostic interface found")) {
      status.recommendations.push(
        "Check if React is loaded and diagnostic console initialized",
      );
    }
  }

  return status;
}

function displayStatusReport() {
  const status = checkEnhancedAISystemStatus();

  console.log("📊 AI SYSTEM STATUS REPORT");
  console.log("=" * 50);
  console.log(`Timestamp: ${status.timestamp}`);
  console.log("");

  // Systems Status
  console.log("🤖 AI SYSTEMS:");
  console.log(
    `  Enhanced AI: ${status.systems.enhancedAI?.loaded ? "✅" : "❌"}`,
  );
  console.log(
    `  Original AI: ${status.systems.originalAI?.loaded ? "✅" : "❌"}`,
  );
  console.log("");

  // Canvas Status
  console.log("🎨 CANVAS STATUS:");
  Object.entries(status.canvas.elements).forEach(([name, info]) => {
    const statusIcon =
      info.exists && info.visible ? "✅" : info.exists ? "⚠️" : "❌";
    console.log(`  ${name}: ${statusIcon}`);
  });
  console.log("");

  // Global Functions
  console.log("🔧 GLOBAL FUNCTIONS:");
  Object.entries(status.global_functions).forEach(([name, available]) => {
    console.log(`  ${name}: ${available ? "✅" : "❌"}`);
  });
  console.log("");

  // Diagnostics
  console.log("🔍 DIAGNOSTICS:");
  console.log(
    `  Simple Panel: ${status.diagnostics.simplePanelExists ? "✅" : "❌"}`,
  );
  console.log(
    `  React Container: ${status.diagnostics.reactContainerExists ? "✅" : "❌"}`,
  );
  console.log("");

  // Issues
  if (status.issues.length > 0) {
    console.log("⚠️ ISSUES DETECTED:");
    status.issues.forEach((issue) => {
      console.log(`  - ${issue}`);
    });
    console.log("");
  }

  // Recommendations
  if (status.recommendations.length > 0) {
    console.log("💡 RECOMMENDATIONS:");
    status.recommendations.forEach((rec) => {
      console.log(`  - ${rec}`);
    });
    console.log("");
  }

  // Overall Health
  const totalChecks =
    Object.keys(status.global_functions).length +
    Object.keys(status.canvas.elements).length +
    2; // +2 for AI systems
  const passedChecks =
    Object.values(status.global_functions).filter(Boolean).length +
    Object.values(status.canvas.elements).filter(
      (info) => info.exists && info.visible,
    ).length +
    (status.systems.enhancedAI?.loaded ? 1 : 0) +
    (status.systems.originalAI?.loaded ? 1 : 0);

  const healthPercentage = Math.round((passedChecks / totalChecks) * 100);
  const healthIcon =
    healthPercentage >= 90 ? "🟢" : healthPercentage >= 70 ? "🟡" : "🔴";

  console.log(`${healthIcon} OVERALL SYSTEM HEALTH: ${healthPercentage}%`);
  console.log("=" * 50);

  return status;
}

// Quick fix functions
function quickFixAttempt() {
  console.log("🔧 Attempting quick fixes...");

  // Try to initialize systems if missing
  if (!window.enhancedAI && window.initializeEnhancedAISystems) {
    console.log("🚀 Initializing Enhanced AI Systems...");
    window.initializeEnhancedAISystems();
  }

  // Try to create emergency canvas if none visible
  const canvases = document.querySelectorAll("canvas");
  const visibleCanvases = Array.from(canvases).filter(
    (canvas) =>
      canvas.style.display !== "none" && canvas.style.visibility !== "hidden",
  );

  if (visibleCanvases.length === 0) {
    console.log("🚨 Creating emergency canvas...");
    if (window.fixCanvasNow) {
      window.fixCanvasNow();
    } else if (window.forceWorkingCanvas) {
      window.forceWorkingCanvas();
    }
  }

  // Re-check status after fixes
  setTimeout(() => {
    console.log("🔍 Re-checking status after fixes...");
    displayStatusReport();
  }, 3000);
}

// Auto-run status check
function autoStatusCheck() {
  displayStatusReport();

  const status = checkEnhancedAISystemStatus();
  if (status.issues.length > 0) {
    console.log(
      "⚠️ Issues detected. Would you like to attempt automatic fixes?",
    );
    console.log("Run quickFixAttempt() to try automatic repairs.");
  }
}

// Make functions globally available
window.checkEnhancedAISystemStatus = checkEnhancedAISystemStatus;
window.displayStatusReport = displayStatusReport;
window.quickFixAttempt = quickFixAttempt;
window.autoStatusCheck = autoStatusCheck;

// Auto-run status check after a delay
setTimeout(() => {
  console.log("🔍 Running automatic AI system status check...");
  autoStatusCheck();
}, 5000);

console.log("✅ AI System Status Checker loaded");
console.log("Available commands:");
console.log("  - checkEnhancedAISystemStatus() - Get detailed status object");
console.log("  - displayStatusReport() - Show formatted status report");
console.log("  - quickFixAttempt() - Try automatic fixes");
console.log(
  "  - autoStatusCheck() - Run full status check with recommendations",
);
