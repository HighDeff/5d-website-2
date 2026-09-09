/**
 * Enhanced AI Canvas Integration
 * Ensures AI entities are properly displayed and interactive in all canvases
 */

console.log("🎨 Loading Enhanced AI Canvas Integration...");

// Canvas Integration Manager
class CanvasIntegrationManager {
  constructor() {
    this.canvases = new Map();
    this.isRunning = false;
  }

  initialize() {
    console.log("🎨 Initializing Canvas Integration Manager...");

    // Find and integrate all AI canvases
    this.findAndIntegrateCanvases();

    // Start rendering loop
    this.startRenderingLoop();

    // Setup canvas event listeners
    this.setupCanvasEvents();

    console.log("✅ Canvas Integration Manager initialized");
  }

  findAndIntegrateCanvases() {
    // Find all canvas elements that should display AI entities
    const canvasSelectors = [
      'canvas[id*="ai"]',
      'canvas[id*="control"]',
      'canvas[id*="collaboration"]',
      'canvas[id*="visualization"]',
      "#emergency-ai-canvas",
      "#emergency-fixed-canvas",
      "#negative-feedback-canvas",
    ];

    canvasSelectors.forEach((selector) => {
      const canvases = document.querySelectorAll(selector);
      canvases.forEach((canvas) => {
        if (!this.canvases.has(canvas.id)) {
          this.integrateCanvas(canvas);
        }
      });
    });

    // Also check for canvases that might be created dynamically
    this.setupCanvasObserver();
  }

  integrateCanvas(canvas) {
    if (!canvas || !canvas.getContext) return;

    console.log(`🎨 Integrating canvas: ${canvas.id}`);

    const ctx = canvas.getContext("2d");
    const canvasData = {
      element: canvas,
      ctx: ctx,
      id: canvas.id,
      lastUpdate: 0,
      entities: [],
      renderMode: "standard",
    };

    this.canvases.set(canvas.id, canvasData);

    // Add canvas-specific controls if missing
    this.addCanvasControls(canvas);

    // Make canvas movable if not already
    setTimeout(() => {
      if (window.makeMovableResizable && canvas.id) {
        try {
          window.makeMovableResizable(canvas.id);
        } catch (error) {
          console.warn(`⚠️ Could not make canvas ${canvas.id} movable:`, error);
        }
      }
    }, 1000);
  }

  addCanvasControls(canvas) {
    // Check if controls already exist
    const existingControls = document.getElementById(`${canvas.id}-controls`);
    if (existingControls) return;

    const controls = document.createElement("div");
    controls.id = `${canvas.id}-controls`;
    controls.style.cssText = `
      position: fixed;
      top: ${canvas.offsetTop + canvas.height + 10}px;
      left: ${canvas.offsetLeft}px;
      background: rgba(0, 0, 20, 0.9);
      border: 1px solid #00ffff;
      border-radius: 6px;
      padding: 8px;
      color: white;
      font-family: monospace;
      font-size: 11px;
      z-index: 9998;
      display: flex;
      gap: 4px;
    `;

    controls.innerHTML = `
      <button onclick="window.canvasIntegrationManager.createAIInCanvas('${canvas.id}')" 
              style="background: #00ff00; color: black; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">
        🤖 Add AI
      </button>
      <button onclick="window.canvasIntegrationManager.clearCanvas('${canvas.id}')" 
              style="background: #ffff00; color: black; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">
        🧹 Clear
      </button>
      <button onclick="window.canvasIntegrationManager.toggleRenderMode('${canvas.id}')" 
              style="background: #ff8800; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">
        🎨 Mode
      </button>
    `;

    document.body.appendChild(controls);

    // Make controls movable too
    setTimeout(() => {
      if (window.makeMovableResizable) {
        try {
          window.makeMovableResizable(controls.id);
        } catch (error) {
          console.warn(`⚠️ Could not make controls movable:`, error);
        }
      }
    }, 1500);
  }

  setupCanvasObserver() {
    // Watch for new canvases being added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "CANVAS" && node.id) {
            setTimeout(() => {
              this.integrateCanvas(node);
            }, 500);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  startRenderingLoop() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.renderLoop();
  }

  renderLoop() {
    if (!this.isRunning) return;

    // Update all canvas entities
    this.canvases.forEach((canvasData) => {
      this.updateCanvasEntities(canvasData);
      this.renderCanvas(canvasData);
    });

    requestAnimationFrame(() => this.renderLoop());
  }

  updateCanvasEntities(canvasData) {
    // Get current AI entities from global state
    const globalEntities = window.getActiveAIEntities
      ? window.getActiveAIEntities()
      : [];

    // Update canvas entities based on global entities
    canvasData.entities = globalEntities.map((entity, index) => ({
      ...entity,
      canvasPosition: {
        x:
          entity.position?.x ||
          (index * 100 + 50) % (canvasData.element.width - 100),
        y:
          entity.position?.y ||
          (index * 80 + 50) % (canvasData.element.height - 100),
      },
      canvasVelocity: entity.velocity || {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
    }));

    // Update positions
    canvasData.entities.forEach((entity) => {
      if (!entity.canvasPosition) return;

      entity.canvasPosition.x += entity.canvasVelocity.x;
      entity.canvasPosition.y += entity.canvasVelocity.y;

      // Bounce off walls
      if (
        entity.canvasPosition.x <= 25 ||
        entity.canvasPosition.x >= canvasData.element.width - 25
      ) {
        entity.canvasVelocity.x *= -1;
      }
      if (
        entity.canvasPosition.y <= 25 ||
        entity.canvasPosition.y >= canvasData.element.height - 25
      ) {
        entity.canvasVelocity.y *= -1;
      }

      // Keep within bounds
      entity.canvasPosition.x = Math.max(
        25,
        Math.min(canvasData.element.width - 25, entity.canvasPosition.x),
      );
      entity.canvasPosition.y = Math.max(
        25,
        Math.min(canvasData.element.height - 25, entity.canvasPosition.y),
      );
    });
  }

  renderCanvas(canvasData) {
    const { ctx, element, entities, renderMode } = canvasData;

    // Clear canvas
    ctx.clearRect(0, 0, element.width, element.height);

    // Draw background
    this.drawBackground(ctx, element, renderMode);

    // Draw entities
    entities.forEach((entity, index) => {
      this.drawEntity(ctx, entity, index, renderMode);
    });

    // Draw UI overlay
    this.drawUIOverlay(ctx, element, entities);
  }

  drawBackground(ctx, canvas, renderMode) {
    switch (renderMode) {
      case "neural":
        this.drawNeuralBackground(ctx, canvas);
        break;
      case "quantum":
        this.drawQuantumBackground(ctx, canvas);
        break;
      case "matrix":
        this.drawMatrixBackground(ctx, canvas);
        break;
      default:
        this.drawStandardBackground(ctx, canvas);
    }
  }

  drawStandardBackground(ctx, canvas) {
    // Dark gradient background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) / 2,
    );
    gradient.addColorStop(0, "rgba(0, 20, 40, 0.9)");
    gradient.addColorStop(1, "rgba(0, 0, 20, 0.95)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid pattern
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  drawNeuralBackground(ctx, canvas) {
    ctx.fillStyle = "rgba(20, 0, 40, 0.95)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Neural network pattern
    ctx.strokeStyle = "rgba(255, 0, 255, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const x1 = Math.random() * canvas.width;
      const y1 = Math.random() * canvas.height;
      const x2 = Math.random() * canvas.width;
      const y2 = Math.random() * canvas.height;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  drawQuantumBackground(ctx, canvas) {
    ctx.fillStyle = "rgba(0, 40, 20, 0.95)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quantum field visualization
    const time = Date.now() * 0.001;
    for (let x = 0; x < canvas.width; x += 30) {
      for (let y = 0; y < canvas.height; y += 30) {
        const intensity = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time);
        ctx.fillStyle = `rgba(0, 255, 100, ${Math.abs(intensity) * 0.3})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  drawMatrixBackground(ctx, canvas) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Matrix code rain effect
    ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
    ctx.font = "12px monospace";
    for (let x = 0; x < canvas.width; x += 20) {
      const char = String.fromCharCode(0x30a0 + Math.random() * 96);
      const y = (Date.now() * 0.1 + x * 10) % canvas.height;
      ctx.fillText(char, x, y);
    }
  }

  drawEntity(ctx, entity, index, renderMode) {
    if (!entity.canvasPosition) return;

    const { x, y } = entity.canvasPosition;

    // Draw entity based on render mode
    switch (renderMode) {
      case "neural":
        this.drawNeuralEntity(ctx, entity, x, y);
        break;
      case "quantum":
        this.drawQuantumEntity(ctx, entity, x, y);
        break;
      case "matrix":
        this.drawMatrixEntity(ctx, entity, x, y);
        break;
      default:
        this.drawStandardEntity(ctx, entity, x, y);
    }

    // Draw connections to other entities
    this.drawEntityConnections(ctx, entity, index);
  }

  drawStandardEntity(ctx, entity, x, y) {
    const radius = 15 + (entity.performance || 80) / 10;

    // Outer glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
    gradient.addColorStop(0, entity.color || "#00ff00");
    gradient.addColorStop(0.5, `${entity.color || "#00ff00"}88`);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Main entity
    ctx.fillStyle = entity.color || "#00ff00";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner core
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Status indicator
    const statusColor = entity.status === "active" ? "#00ff00" : "#ff4444";
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(x - radius * 0.7, y - radius * 0.7, 4, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      entity.name?.split(" ")[0] || `AI${entity.id?.slice(-1)}`,
      x,
      y + radius + 15,
    );

    // Performance indicator
    ctx.fillStyle =
      entity.performance > 90
        ? "#00ff00"
        : entity.performance > 75
          ? "#ffff00"
          : "#ff8800";
    ctx.font = "8px monospace";
    ctx.fillText(
      `${(entity.performance || 80).toFixed(0)}%`,
      x,
      y + radius + 25,
    );
  }

  drawNeuralEntity(ctx, entity, x, y) {
    // Neural node visualization
    const radius = 12;

    ctx.strokeStyle = entity.color || "#ff00ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Synaptic activity
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const synapseX = x + Math.cos(angle) * radius * 1.5;
      const synapseY = y + Math.sin(angle) * radius * 1.5;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(synapseX, synapseY);
      ctx.strokeStyle = `${entity.color || "#ff00ff"}66`;
      ctx.stroke();
    }
  }

  drawQuantumEntity(ctx, entity, x, y) {
    // Quantum state visualization
    const time = Date.now() * 0.005;

    for (let i = 0; i < 3; i++) {
      const radius = 10 + i * 5;
      const alpha = Math.sin(time + i) * 0.5 + 0.5;

      ctx.strokeStyle = `${entity.color || "#00ff88"}${Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawMatrixEntity(ctx, entity, x, y) {
    // Matrix-style entity
    ctx.fillStyle = entity.color || "#00ff00";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("█", x, y + 7);

    // Trailing characters
    for (let i = 1; i <= 5; i++) {
      ctx.fillStyle = `${entity.color || "#00ff00"}${Math.floor(
        (1 - i / 5) * 255,
      )
        .toString(16)
        .padStart(2, "0")}`;
      ctx.fillText("▓", x, y + 7 + i * 15);
    }
  }

  drawEntityConnections(ctx, entity, index) {
    if (!entity.connections || !window.getActiveAIEntities) return;

    const allEntities = window.getActiveAIEntities();

    entity.connections.forEach((connectionId) => {
      const connectedEntity = allEntities.find((e) => e.id === connectionId);
      if (connectedEntity && connectedEntity.canvasPosition) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        ctx.beginPath();
        ctx.moveTo(entity.canvasPosition.x, entity.canvasPosition.y);
        ctx.lineTo(
          connectedEntity.canvasPosition.x,
          connectedEntity.canvasPosition.y,
        );
        ctx.stroke();

        ctx.setLineDash([]);
      }
    });
  }

  drawUIOverlay(ctx, canvas, entities) {
    // Draw title
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`AI ENTITIES: ${entities.length} ACTIVE`, 20, 30);

    // Draw entity count by type
    const entityTypes = {};
    entities.forEach((entity) => {
      entityTypes[entity.type] = (entityTypes[entity.type] || 0) + 1;
    });

    let yOffset = 50;
    Object.entries(entityTypes).forEach(([type, count]) => {
      ctx.fillStyle = "#88ffff";
      ctx.font = "12px monospace";
      ctx.fillText(`${type.toUpperCase()}: ${count}`, 20, yOffset);
      yOffset += 15;
    });

    // Draw performance indicator
    const avgPerformance =
      entities.length > 0
        ? entities.reduce((sum, e) => sum + (e.performance || 80), 0) /
          entities.length
        : 0;

    ctx.fillStyle =
      avgPerformance > 90
        ? "#00ff00"
        : avgPerformance > 75
          ? "#ffff00"
          : "#ff8800";
    ctx.font = "14px monospace";
    ctx.textAlign = "right";
    ctx.fillText(
      `SYSTEM: ${avgPerformance.toFixed(1)}%`,
      canvas.width - 20,
      30,
    );
  }

  // Public methods for controls
  createAIInCanvas(canvasId) {
    console.log(`🤖 Creating AI entity in canvas: ${canvasId}`);

    if (window.createAIEntity) {
      const newEntity = window.createAIEntity({
        name: `Canvas AI ${Date.now().toString().slice(-3)}`,
        type: "canvas_generated",
        specialization: "visualization",
      });

      window.showNotification &&
        window.showNotification(`AI entity created in ${canvasId}`, "success");
    } else {
      console.warn("⚠️ createAIEntity function not available");
    }
  }

  clearCanvas(canvasId) {
    const canvasData = this.canvases.get(canvasId);
    if (canvasData) {
      canvasData.entities = [];
      canvasData.ctx.clearRect(
        0,
        0,
        canvasData.element.width,
        canvasData.element.height,
      );
      console.log(`🧹 Cleared canvas: ${canvasId}`);
    }
  }

  toggleRenderMode(canvasId) {
    const canvasData = this.canvases.get(canvasId);
    if (canvasData) {
      const modes = ["standard", "neural", "quantum", "matrix"];
      const currentIndex = modes.indexOf(canvasData.renderMode);
      canvasData.renderMode = modes[(currentIndex + 1) % modes.length];

      console.log(
        `🎨 Changed render mode for ${canvasId} to: ${canvasData.renderMode}`,
      );

      window.showNotification &&
        window.showNotification(
          `Render mode: ${canvasData.renderMode}`,
          "info",
          3000,
        );
    }
  }

  getCanvasInfo() {
    return {
      canvasCount: this.canvases.size,
      canvases: Array.from(this.canvases.keys()),
    };
  }
}

// Initialize Canvas Integration Manager
window.canvasIntegrationManager = new CanvasIntegrationManager();

// Auto-initialize
setTimeout(() => {
  window.canvasIntegrationManager.initialize();

  // Show initialization notification
  window.showNotification &&
    window.showNotification(
      `Canvas integration active: ${window.canvasIntegrationManager.getCanvasInfo().canvasCount} canvases`,
      "success",
      5000,
    );
}, 3000);

console.log(
  "🎨 Enhanced AI Canvas Integration loaded - all canvases will display AI entities",
);
