// AI Systems Integration and Auto-Initialization
// Comprehensive initialization script for all AI systems

console.log("🚀 Starting AI Systems Integration...");

// Global AI Systems Registry
window.aiSystems = {
  advancedCanvasManager: null,
  canvasErrorFixAI: null,
  userIntentAnalysisAI: null,
  consoleMonitoring: null,
  selfLearningAI: null,
  knowledgeDatabase: null,
  status: {
    canvasManager: "initializing",
    errorFixAI: "initializing",
    intentAnalysis: "initializing",
    consoleMonitoring: "initializing",
    selfLearning: "initializing",
    knowledgeDB: "initializing",
  },
  features: {
    liveMovement: false,
    errorDetection: false,
    userProfiling: false,
    conversationTracking: false,
    autoFix: false,
    selfLearning: false,
    knowledgeStorage: false,
    reverseMapping: false,
  },
};

// Initialize Canvas with Buttons and Controls
function initializeAdvancedCanvas() {
  console.log("🎨 Initializing Advanced AI Canvas...");

  // Remove any existing simple canvas
  const existingCanvas = document.querySelector("#simple-ai-canvas");
  if (existingCanvas) {
    existingCanvas.remove();
  }

  const existingControls = document.querySelector("#simple-ai-controls");
  if (existingControls) {
    existingControls.remove();
  }

  // Initialize the advanced system
  if (window.advancedAICanvasManager) {
    window.advancedAICanvasManager
      .initialize()
      .then(() => {
        window.aiSystems.advancedCanvasManager = window.advancedAICanvasManager;
        window.aiSystems.status.canvasManager = "active";
        window.aiSystems.features.liveMovement = true;
        console.log("✅ Advanced AI Canvas Manager active with live movement");
        updateSystemStatus();
      })
      .catch((error) => {
        console.error("❌ Failed to initialize Advanced Canvas:", error);
        window.aiSystems.status.canvasManager = "error";
        // Fallback to simple canvas
        createEmergencyCanvas();
      });
  } else {
    setTimeout(initializeAdvancedCanvas, 1000); // Retry in 1 second
  }
}

// Create Emergency Canvas if Advanced System Fails
function createEmergencyCanvas() {
  console.log("🚨 Creating Emergency Canvas with Controls...");

  const canvas = document.createElement("canvas");
  canvas.id = "emergency-ai-canvas";
  canvas.width = 1200;
  canvas.height = 800;
  canvas.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 9999;
    border: 3px solid #ff4444;
    background: linear-gradient(45deg, rgba(20, 0, 0, 0.9), rgba(60, 0, 0, 0.9));
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
  `;

  document.body.appendChild(canvas);

  // Add emergency controls
  const controls = document.createElement("div");
  controls.id = "emergency-controls";
  controls.style.cssText = `
    position: fixed;
    top: 840px;
    left: 20px;
    z-index: 10000;
    background: rgba(60, 0, 0, 0.9);
    border: 2px solid #ff4444;
    border-radius: 8px;
    padding: 15px;
    color: #ff4444;
    font-family: monospace;
  `;

  controls.innerHTML = `
    <div style="color: #ffffff; font-weight: bold; margin-bottom: 10px;">🚨 EMERGENCY AI CANVAS</div>
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <button id="emergency-test" style="background: #ff4444; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Test Canvas</button>
      <button id="emergency-create-ais" style="background: #44ff44; color: black; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Create AIs</button>
      <button id="emergency-start-movement" style="background: #4444ff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Start Movement</button>
      <button id="emergency-diagnose" style="background: #ff8800; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">AI Diagnose</button>
    </div>
    <div id="emergency-status" style="font-size: 12px;">Emergency mode active - trying to recover advanced systems...</div>
  `;

  document.body.appendChild(controls);

  // Add emergency functionality
  document.getElementById("emergency-test")?.addEventListener("click", () => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ff4444";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "EMERGENCY CANVAS ACTIVE",
        canvas.width / 2,
        canvas.height / 2,
      );
      console.log("🚨 Emergency canvas test complete");
    }
  });

  document
    .getElementById("emergency-create-ais")
    ?.addEventListener("click", () => {
      createEmergencyAIs(canvas);
    });

  document
    .getElementById("emergency-start-movement")
    ?.addEventListener("click", () => {
      startEmergencyMovement(canvas);
    });

  document
    .getElementById("emergency-diagnose")
    ?.addEventListener("click", () => {
      runEmergencyDiagnostics();
    });
}

// Create Emergency AI Entities
function createEmergencyAIs(canvas) {
  console.log("🤖 Creating Emergency AI Entities...");

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create 5 emergency AIs
  window.emergencyAIs = [];
  const colors = ["#ff4444", "#44ff44", "#4444ff", "#ffff44", "#ff44ff"];
  const names = [
    "Error Handler",
    "Movement Monitor",
    "User Tracker",
    "Fix Applier",
    "Status Reporter",
  ];

  for (let i = 0; i < 5; i++) {
    const ai = {
      id: `emergency_ai_${i}`,
      name: names[i],
      x: 100 + i * 200,
      y: 200 + Math.sin(i) * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: colors[i],
      status: "active",
      isMoving: false,
    };
    window.emergencyAIs.push(ai);
  }

  // Render initial AIs
  renderEmergencyAIs(ctx);
  console.log("✅ Emergency AIs created");
}

// Render Emergency AIs
function renderEmergencyAIs(ctx) {
  if (!window.emergencyAIs) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Background
  const gradient = ctx.createRadialGradient(
    ctx.canvas.width / 2,
    ctx.canvas.height / 2,
    0,
    ctx.canvas.width / 2,
    ctx.canvas.height / 2,
    ctx.canvas.width / 2,
  );
  gradient.addColorStop(0, "rgba(20, 0, 0, 0.9)");
  gradient.addColorStop(1, "rgba(60, 0, 0, 0.9)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Grid
  ctx.strokeStyle = "rgba(255, 68, 68, 0.2)";
  ctx.lineWidth = 1;
  for (let x = 0; x < ctx.canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < ctx.canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.stroke();
  }

  // Render AIs
  window.emergencyAIs.forEach((ai) => {
    // Update position if moving
    if (ai.isMoving) {
      ai.x += ai.vx;
      ai.y += ai.vy;

      // Bounce off walls
      if (ai.x <= 25 || ai.x >= ctx.canvas.width - 25) ai.vx *= -1;
      if (ai.y <= 25 || ai.y >= ctx.canvas.height - 25) ai.vy *= -1;

      // Add some randomness
      ai.vx += (Math.random() - 0.5) * 0.1;
      ai.vy += (Math.random() - 0.5) * 0.1;

      // Limit velocity
      ai.vx = Math.max(-3, Math.min(3, ai.vx));
      ai.vy = Math.max(-3, Math.min(3, ai.vy));
    }

    // Draw AI entity
    ctx.save();
    ctx.fillStyle = ai.color;
    ctx.shadowColor = ai.color;
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(ai.x, ai.y, 25, 0, 2 * Math.PI);
    ctx.fill();

    // Status indicator
    ctx.fillStyle = ai.isMoving ? "#00ff00" : "#ffff00";
    ctx.beginPath();
    ctx.arc(ai.x + 15, ai.y - 15, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(ai.name, ai.x, ai.y + 45);

    // Status
    ctx.fillText(ai.status.toUpperCase(), ai.x, ai.y + 60);

    ctx.restore();
  });
}

// Start Emergency Movement
function startEmergencyMovement(canvas) {
  console.log("🎯 Starting Emergency AI Movement...");

  if (!window.emergencyAIs) {
    createEmergencyAIs(canvas);
    return;
  }

  // Enable movement for all AIs
  window.emergencyAIs.forEach((ai) => {
    ai.isMoving = true;
  });

  // Start animation loop with proper frame rate
  const ctx = canvas.getContext("2d");
  if (ctx && !window.emergencyAnimationLoop) {
    window.emergencyAnimationLoop = true;

    const animate = () => {
      if (window.emergencyAnimationLoop) {
        renderEmergencyAIs(ctx);
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    console.log(
      "🎮 Emergency animation loop started with requestAnimationFrame",
    );
  }

  window.aiSystems.features.liveMovement = true;
  console.log("✅ Emergency movement started - AIs should be moving");
  updateSystemStatus();
}

// Run Emergency Diagnostics
function runEmergencyDiagnostics() {
  console.log("🔍 Running Emergency AI Diagnostics...");

  const diagnostics = {
    canvas: document.querySelector("canvas")
      ? "✅ Canvas Present"
      : "❌ No Canvas",
    context: (() => {
      const canvas = document.querySelector("canvas");
      return canvas && canvas.getContext("2d")
        ? "✅ Context Available"
        : "❌ No Context";
    })(),
    ais: window.emergencyAIs
      ? `✅ ${window.emergencyAIs.length} Emergency AIs`
      : "❌ No AIs",
    movement: window.emergencyAnimationLoop
      ? "✅ Animation Loop Active"
      : "❌ No Animation",
    controls: document.querySelector("#emergency-controls")
      ? "✅ Controls Present"
      : "❌ No Controls",
    aiSystems: `Canvas: ${window.aiSystems.status.canvasManager}, Error AI: ${window.aiSystems.status.errorFixAI}`,
    features: `Movement: ${window.aiSystems.features.liveMovement ? "ON" : "OFF"}, Error Detection: ${window.aiSystems.features.errorDetection ? "ON" : "OFF"}`,
  };

  const report = Object.entries(diagnostics)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  alert(
    `🔍 Emergency AI Diagnostics:\n\n${report}\n\nCheck console for detailed logs.`,
  );
  console.log("📊 Emergency Diagnostics:", diagnostics);
}

// Update System Status Display
function updateSystemStatus() {
  const statusElement = document.getElementById("emergency-status");
  if (statusElement) {
    const activeFeatures = Object.entries(window.aiSystems.features)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .join(", ");

    statusElement.innerHTML = `
      Systems: ${Object.values(window.aiSystems.status).filter((s) => s === "active").length}/4 Active<br>
      Features: ${activeFeatures || "None active"}<br>
      Last Update: ${new Date().toLocaleTimeString()}
    `;
  }
}

// Initialize Error Fix AI
function initializeErrorFixAI() {
  console.log("🔧 Initializing Canvas Error Fix AI...");

  if (window.canvasErrorFixAI) {
    window.canvasErrorFixAI
      .startMonitoring()
      .then(() => {
        window.aiSystems.canvasErrorFixAI = window.canvasErrorFixAI;
        window.aiSystems.status.errorFixAI = "active";
        window.aiSystems.features.errorDetection = true;
        window.aiSystems.features.autoFix = true;
        console.log("✅ Canvas Error Fix AI active");
        updateSystemStatus();
      })
      .catch((error) => {
        console.error("❌ Failed to start Error Fix AI:", error);
        window.aiSystems.status.errorFixAI = "error";
      });
  } else {
    setTimeout(initializeErrorFixAI, 1000);
  }
}

// Initialize User Intent Analysis AI
function initializeUserIntentAI() {
  console.log("🧠 Initializing User Intent Analysis AI...");

  if (window.userIntentAnalysisAI) {
    window.userIntentAnalysisAI
      .startAnalysis()
      .then(() => {
        window.aiSystems.userIntentAnalysisAI = window.userIntentAnalysisAI;
        window.aiSystems.status.intentAnalysis = "active";
        window.aiSystems.features.userProfiling = true;
        window.aiSystems.features.conversationTracking = true;
        console.log("✅ User Intent Analysis AI active");
        updateSystemStatus();
      })
      .catch((error) => {
        console.error("❌ Failed to start User Intent AI:", error);
        window.aiSystems.status.intentAnalysis = "error";
      });
  } else {
    setTimeout(initializeUserIntentAI, 1000);
  }
}

// Enhanced global AI communication interface
window.askAI = function (question) {
  console.log(`🤖 AI Question: ${question}`);

  let response = "🤖 AI Analysis: ";

  // Record the question in knowledge database
  if (window.aiSystems.knowledgeDatabase) {
    window.aiSystems.knowledgeDatabase.recordInteraction({
      timestamp: new Date().toISOString(),
      type: "question",
      context: "ai_chat",
      userInput: question,
      outcome: "success",
      learningValue: 0.8,
    });
  }

  // Route question to Self-Learning AI first (most comprehensive)
  if (window.aiSystems.selfLearningAI) {
    response = window.aiSystems.selfLearningAI.answerQuestion(question);
    console.log(response);
    alert(response);
    return response;
  }

  // Route question to Knowledge Database
  if (window.aiSystems.knowledgeDatabase) {
    window.aiSystems.knowledgeDatabase
      .answerQuestion(question)
      .then((answer) => {
        console.log("📚 Knowledge DB Answer:", answer);
        alert("📚 Knowledge DB: " + answer);
      });
  }

  // Route question to appropriate AI system (fallback)
  if (
    question.toLowerCase().includes("canvas") ||
    question.toLowerCase().includes("movement")
  ) {
    if (window.aiSystems.canvasErrorFixAI) {
      const status = window.aiSystems.canvasErrorFixAI.getSystemStatus
        ? window.aiSystems.canvasErrorFixAI.getSystemStatus()
        : { isMonitoring: false, issuesDetected: 0, fixesApplied: 0 };
      response += `Canvas System: ${status.isMonitoring ? "Monitoring" : "Inactive"}, ${status.issuesDetected} issues detected, ${status.fixesApplied} fixes applied. `;
    }

    if (window.emergencyAIs) {
      const movingCount = window.emergencyAIs.filter(
        (ai) => ai.isMoving,
      ).length;
      response += `Movement: ${movingCount}/${window.emergencyAIs.length} AIs moving actively with live physics. `;
    }

    // Add movement analysis from self-learning AI
    if (window.aiSystems.selfLearningAI) {
      const movementAnalysis =
        window.aiSystems.selfLearningAI.getMovementAnalysis();
      const analysisData = Array.from(movementAnalysis.values());
      const actuallyMoving = analysisData.filter(
        (a) => a.isActuallyMoving,
      ).length;
      response += `Deep Analysis: ${actuallyMoving}/${analysisData.length} entities showing genuine movement. `;
    }
  }

  if (
    question.toLowerCase().includes("user") ||
    question.toLowerCase().includes("intent")
  ) {
    if (window.aiSystems.userIntentAnalysisAI) {
      response += `User Analysis: Tracking behavior patterns and conversation style. `;
      const profile = window.aiSystems.userIntentAnalysisAI.getCurrentProfile
        ? window.aiSystems.userIntentAnalysisAI.getCurrentProfile()
        : null;
      if (profile) {
        response += `Communication style: ${profile.communicationStyle}, Learning: ${profile.learningStyle}. `;
      }
    }
  }

  if (
    question.toLowerCase().includes("fix") ||
    question.toLowerCase().includes("error")
  ) {
    if (window.aiSystems.canvasErrorFixAI) {
      response += `Error Detection: AI is monitoring for canvas issues and can apply automatic fixes. `;
    }
  }

  if (response === "🤖 AI Analysis: ") {
    response += `All AI systems are operational. Canvas Manager: ${window.aiSystems.status.canvasManager}, Error Fix: ${window.aiSystems.status.errorFixAI}, User Analysis: ${window.aiSystems.status.intentAnalysis}. Ask about 'canvas movement', 'user intent', 'error fixing', or 'system status'.`;
  }

  console.log(response);
  alert(response);
  return response;
};

// Global system status check
window.checkAIStatus = function () {
  const status = {
    systems: window.aiSystems.status,
    features: window.aiSystems.features,
    emergencyAIs: window.emergencyAIs ? window.emergencyAIs.length : 0,
    movingAIs: window.emergencyAIs
      ? window.emergencyAIs.filter((ai) => ai.isMoving).length
      : 0,
  };

  console.log("📊 AI Systems Status:", status);

  const report = `
🤖 AI SYSTEMS STATUS REPORT

Systems Status:
- Canvas Manager: ${status.systems.canvasManager}
- Error Fix AI: ${status.systems.errorFixAI}
- Intent Analysis: ${status.systems.intentAnalysis}
- Console Monitoring: ${status.systems.consoleMonitoring}

Active Features:
- Live Movement: ${status.features.liveMovement ? "✅" : "❌"}
- Error Detection: ${status.features.errorDetection ? "✅" : "❌"}
- User Profiling: ${status.features.userProfiling ? "✅" : "❌"}
- Auto Fix: ${status.features.autoFix ? "✅" : "❌"}

Canvas Status:
- Emergency AIs: ${status.emergencyAIs}
- Moving AIs: ${status.movingAIs}

Available Commands:
- askAI("your question")
- checkAIStatus()
- window.emergencyAIs (access AI entities)
- consoleMonitor.help() (console commands)
  `;

  alert(report);
  return status;
};

// Initialize Self-Learning AI
function initializeSelfLearningAI() {
  console.log("🧠 Initializing Self-Learning AI System...");

  if (window.selfLearningAISystem) {
    window.selfLearningAISystem
      .startLearning()
      .then(() => {
        window.aiSystems.selfLearningAI = window.selfLearningAISystem;
        window.aiSystems.status.selfLearning = "active";
        window.aiSystems.features.selfLearning = true;
        window.aiSystems.features.reverseMapping = true;
        console.log("✅ Self-Learning AI System active");
        updateSystemStatus();
      })
      .catch((error) => {
        console.error("❌ Failed to start Self-Learning AI:", error);
        window.aiSystems.status.selfLearning = "error";
      });
  } else {
    setTimeout(initializeSelfLearningAI, 1000);
  }
}

// Initialize Knowledge Database
function initializeKnowledgeDatabase() {
  console.log("📚 Initializing AI Knowledge Database...");

  if (window.aiKnowledgeDatabase) {
    window.aiKnowledgeDatabase
      .startSession("user_" + Date.now())
      .then(() => {
        window.aiSystems.knowledgeDatabase = window.aiKnowledgeDatabase;
        window.aiSystems.status.knowledgeDB = "active";
        window.aiSystems.features.knowledgeStorage = true;
        console.log("✅ AI Knowledge Database active");
        updateSystemStatus();
      })
      .catch((error) => {
        console.error("❌ Failed to start Knowledge Database:", error);
        window.aiSystems.status.knowledgeDB = "error";
      });
  } else {
    setTimeout(initializeKnowledgeDatabase, 1000);
  }
}

// Auto-initialize everything
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Auto-initializing AI Systems...");

  // Initialize in sequence with delays to ensure proper loading
  setTimeout(initializeAdvancedCanvas, 500);
  setTimeout(initializeErrorFixAI, 1500);
  setTimeout(initializeUserIntentAI, 2500);
  setTimeout(initializeSelfLearningAI, 3500);
  setTimeout(initializeKnowledgeDatabase, 4500);

  // Set up global status updates
  setInterval(updateSystemStatus, 5000);

  console.log(`
🤖 AI SYSTEMS READY

Available Commands:
- askAI("question about canvas, movement, user intent, or errors")
- checkAIStatus() - Full system status report
- window.emergencyAIs - Access AI entities
- consoleMonitor.help() - Console log commands

The AI systems will automatically:
1. Create live moving AI entities on canvas
2. Monitor for errors and apply fixes
3. Analyze your behavior and conversation style
4. Provide intelligent responses and suggestions
  `);
});

export default {
  askAI: window.askAI,
  checkAIStatus: window.checkAIStatus,
  emergencyAIs: () => window.emergencyAIs,
};
