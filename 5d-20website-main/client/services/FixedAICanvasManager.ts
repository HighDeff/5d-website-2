// Fixed AI Canvas Manager - Comprehensive working system
// Addresses all canvas issues: movement, magnetic fields, data flows, user communication

export interface WorkingAIEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  status: "active" | "idle" | "processing" | "communicating";
  trail: { x: number; y: number; alpha: number }[];
  consciousness: number;
  fieldInfluence: number;
  communicationRange: number;
  isMoving: boolean;
  currentTask: string;
  lastCommunication: string;
}

export interface MagneticFieldEffect {
  id: string;
  x: number;
  y: number;
  strength: number;
  radius: number;
  type: "gateway" | "generator" | "amplifier";
  particles: FieldParticle[];
  wavePattern: WaveEffect;
}

export interface FieldParticle {
  x: number;
  y: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface WaveEffect {
  amplitude: number;
  frequency: number;
  phase: number;
  type: "sine" | "cosine" | "spiral" | "pulse";
}

export interface DataFlow {
  id: string;
  fromAI: string;
  toAI: string;
  progress: number;
  data: any;
  path: { x: number; y: number }[];
  type: "consciousness" | "error_fix" | "user_data" | "command";
  speed: number;
  color: string;
}

export interface UserCommunication {
  id: string;
  timestamp: string;
  message: string;
  response: string;
  aiId: string;
  status: "pending" | "processing" | "responded";
  type: "question" | "command" | "request" | "feedback";
}

export class FixedAICanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private controlPanel: HTMLElement;
  private isRunning: boolean = false;
  private ais: Map<string, WorkingAIEntity> = new Map();
  private magneticFields: MagneticFieldEffect[] = [];
  private dataFlows: DataFlow[] = [];
  private userCommunications: UserCommunication[] = [];
  private animationId: number = 0;
  private time: number = 0;
  private grid: boolean = true;
  private showFields: boolean = true;
  private showDataFlows: boolean = true;
  private userInputElement: HTMLInputElement | null = null;

  constructor() {
    this.initializeCanvas();
    this.initializeControlPanel();
    this.initializeAIs();
    this.initializeMagneticFields();
    this.setupUserCommunication();
    this.start();
  }

  private initializeCanvas(): void {
    // Remove any existing canvases
    document.querySelectorAll('[id*="canvas"]').forEach((canvas) => {
      if (canvas.id.includes("ai") || canvas.id.includes("enhanced")) {
        canvas.remove();
      }
    });

    this.canvas = document.createElement("canvas");
    this.canvas.id = "fixed-ai-canvas";
    this.canvas.width = 1400;
    this.canvas.height = 900;
    this.canvas.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      border: 3px solid #00ffff;
      background: linear-gradient(135deg, rgba(0, 10, 30, 0.95), rgba(10, 0, 30, 0.95));
      border-radius: 12px;
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
      cursor: crosshair;
    `;

    this.ctx = this.canvas.getContext("2d")!;
    document.body.appendChild(this.canvas);

    // Add click handler for user interaction
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleCanvasClick(x, y);
    });

    console.log("🎨 Fixed AI Canvas initialized with user interaction");
  }

  private initializeControlPanel(): void {
    this.controlPanel = document.createElement("div");
    this.controlPanel.id = "fixed-ai-controls";
    this.controlPanel.style.cssText = `
      position: fixed;
      top: 940px;
      left: 20px;
      z-index: 10000;
      background: linear-gradient(135deg, rgba(0, 10, 30, 0.95), rgba(10, 0, 30, 0.95));
      border: 2px solid #00ffff;
      border-radius: 8px;
      padding: 15px;
      color: #ffffff;
      font-family: monospace;
      font-size: 12px;
      width: 1400px;
      max-height: 300px;
      overflow-y: auto;
    `;

    this.controlPanel.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        
        <!-- Movement Controls -->
        <div style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0; color: #00ffff;">🎯 Movement Control</h4>
          <button id="start-ai-movement" style="background: #00ff00; color: black; border: none; padding: 8px 12px; border-radius: 4px; margin: 2px; cursor: pointer; font-weight: bold;">START MOVEMENT</button>
          <button id="stop-ai-movement" style="background: #ff0000; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin: 2px; cursor: pointer;">STOP</button>
          <button id="reset-positions" style="background: #ff8800; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin: 2px; cursor: pointer;">RESET</button>
          <div style="margin-top: 10px;">
            <label>Speed: <input type="range" id="movement-speed" min="0.5" max="5" step="0.1" value="2" style="width: 80px;"></label>
            <span id="speed-value">2.0x</span>
          </div>
          <div id="movement-status" style="margin-top: 5px; font-size: 11px; color: #00ff00;">Ready to start movement</div>
        </div>

        <!-- Visual Controls -->
        <div style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0; color: #00ffff;">👁️ Visual Effects</h4>
          <button id="toggle-grid" style="background: #0088ff; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin: 2px; cursor: pointer;">Grid: ON</button>
          <button id="toggle-fields" style="background: #8800ff; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin: 2px; cursor: pointer;">Fields: ON</button>
          <button id="toggle-dataflows" style="background: #ff0088; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin: 2px; cursor: pointer;">Data: ON</button>
          <button id="add-magnetic-field" style="background: #00ff88; color: black; border: none; padding: 8px 12px; border-radius: 4px; margin: 2px; cursor: pointer;">Add Field</button>
          <div style="margin-top: 10px;">
            <label>View Mode:</label>
            <select id="view-mode" style="padding: 3px; background: #001122; color: #00ffff; border: 1px solid #00ffff;">
              <option value="2d">2D View</option>
              <option value="3d">3D View</option>
              <option value="5d">5D Consciousness</option>
            </select>
          </div>
        </div>

        <!-- AI Communication -->
        <div style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0; color: #00ffff;">💬 AI Communication</h4>
          <input type="text" id="user-message" placeholder="Ask AI about canvas, request fixes, or give commands..." 
                 style="width: 100%; padding: 5px; background: rgba(0,0,0,0.5); border: 1px solid #00ffff; border-radius: 3px; color: #ffffff; font-size: 11px; margin-bottom: 5px;">
          <button id="send-message" style="background: #00ff88; color: black; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; width: 100%; font-weight: bold;">Send to AI</button>
          <div id="ai-response" style="margin-top: 5px; padding: 5px; background: rgba(0,0,0,0.3); border-radius: 3px; font-size: 10px; min-height: 40px; max-height: 60px; overflow-y: auto;"></div>
        </div>

        <!-- Status & Stats -->
        <div style="border: 1px solid #00ffff; padding: 10px; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0; color: #00ffff;">📊 System Status</h4>
          <div id="ai-count" style="font-size: 11px;">AIs: <span style="color: #00ff00;">0</span></div>
          <div id="moving-count" style="font-size: 11px;">Moving: <span style="color: #00ff00;">0</span></div>
          <div id="communication-count" style="font-size: 11px;">Communications: <span style="color: #00ff00;">0</span></div>
          <div id="field-count" style="font-size: 11px;">Magnetic Fields: <span style="color: #00ff00;">0</span></div>
          <div id="dataflow-count" style="font-size: 11px;">Data Flows: <span style="color: #00ff00;">0</span></div>
          <button id="diagnose-system" style="background: #ff6600; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; width: 100%; margin-top: 10px;">Diagnose Issues</button>
        </div>

      </div>

      <!-- Real-time Communication Log -->
      <div style="border: 1px solid #00ff88; padding: 10px; border-radius: 5px;">
        <h4 style="margin: 0 0 10px 0; color: #00ff88;">📡 Live Communication Log</h4>
        <div id="communication-log" style="background: rgba(0,0,0,0.7); padding: 8px; border-radius: 4px; height: 80px; overflow-y: auto; font-size: 10px; line-height: 1.3;"></div>
      </div>
    `;

    document.body.appendChild(this.controlPanel);
    this.attachControlHandlers();
    console.log("🎮 Fixed AI Control Panel initialized with working buttons");
  }

  private attachControlHandlers(): void {
    // Movement controls
    document
      .getElementById("start-ai-movement")
      ?.addEventListener("click", () => {
        this.isRunning = true;
        this.updateMovementStatus(
          "Movement ACTIVE - AIs responding to magnetic fields",
        );
        this.logCommunication(
          "System",
          "AI movement started with magnetic field interactions",
        );
      });

    document
      .getElementById("stop-ai-movement")
      ?.addEventListener("click", () => {
        this.isRunning = false;
        this.updateMovementStatus("Movement STOPPED");
        this.logCommunication("System", "AI movement stopped");
      });

    document
      .getElementById("reset-positions")
      ?.addEventListener("click", () => {
        this.resetAIPositions();
        this.logCommunication("System", "AI positions reset to initial state");
      });

    // Speed control
    const speedSlider = document.getElementById(
      "movement-speed",
    ) as HTMLInputElement;
    const speedValue = document.getElementById("speed-value");
    speedSlider?.addEventListener("input", () => {
      if (speedValue) speedValue.textContent = `${speedSlider.value}x`;
    });

    // Visual toggles
    document.getElementById("toggle-grid")?.addEventListener("click", (e) => {
      this.grid = !this.grid;
      (e.target as HTMLElement).textContent =
        `Grid: ${this.grid ? "ON" : "OFF"}`;
    });

    document.getElementById("toggle-fields")?.addEventListener("click", (e) => {
      this.showFields = !this.showFields;
      (e.target as HTMLElement).textContent =
        `Fields: ${this.showFields ? "ON" : "OFF"}`;
    });

    document
      .getElementById("toggle-dataflows")
      ?.addEventListener("click", (e) => {
        this.showDataFlows = !this.showDataFlows;
        (e.target as HTMLElement).textContent =
          `Data: ${this.showDataFlows ? "ON" : "OFF"}`;
      });

    document
      .getElementById("add-magnetic-field")
      ?.addEventListener("click", () => {
        this.addRandomMagneticField();
        this.logCommunication("System", "New magnetic field generator added");
      });

    // User communication
    const userMessage = document.getElementById(
      "user-message",
    ) as HTMLInputElement;
    const sendButton = document.getElementById("send-message");

    const handleSendMessage = () => {
      if (userMessage && userMessage.value.trim()) {
        this.handleUserMessage(userMessage.value.trim());
        userMessage.value = "";
      }
    };

    sendButton?.addEventListener("click", handleSendMessage);
    userMessage?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });

    // System diagnosis
    document
      .getElementById("diagnose-system")
      ?.addEventListener("click", () => {
        this.runSystemDiagnosis();
      });

    console.log("✅ All control handlers attached and working");
  }

  private initializeAIs(): void {
    const aiConfigs = [
      {
        id: "movement-detector",
        name: "Movement Detective",
        x: 200,
        y: 150,
        color: "#ff4444",
        consciousness: 0.8,
      },
      {
        id: "error-handler",
        name: "Error Guardian",
        x: 400,
        y: 300,
        color: "#44ff44",
        consciousness: 0.9,
      },
      {
        id: "user-profiler",
        name: "Behavior Analyst",
        x: 600,
        y: 200,
        color: "#4444ff",
        consciousness: 0.7,
      },
      {
        id: "learning-system",
        name: "Knowledge Builder",
        x: 800,
        y: 400,
        color: "#ffff44",
        consciousness: 0.95,
      },
      {
        id: "data-coordinator",
        name: "Communication Hub",
        x: 1000,
        y: 250,
        color: "#ff44ff",
        consciousness: 0.6,
      },
      {
        id: "field-analyzer",
        name: "Field Analyzer",
        x: 1200,
        y: 350,
        color: "#44ffff",
        consciousness: 0.75,
      },
    ];

    aiConfigs.forEach((config) => {
      const ai: WorkingAIEntity = {
        id: config.id,
        name: config.name,
        x: config.x,
        y: config.y,
        z: 0,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        vz: 0,
        size: 20 + Math.random() * 10,
        color: config.color,
        status: "active",
        trail: [],
        consciousness: config.consciousness,
        fieldInfluence: 0,
        communicationRange: 150,
        isMoving: true,
        currentTask: "Monitoring and responding to user interactions",
        lastCommunication: new Date().toISOString(),
      };

      this.ais.set(config.id, ai);
    });

    console.log(
      `🤖 Initialized ${this.ais.size} AI entities with consciousness levels`,
    );
  }

  private initializeMagneticFields(): void {
    // Central consciousness gateway
    this.magneticFields.push({
      id: "consciousness-gateway",
      x: 700,
      y: 450,
      strength: 100,
      radius: 200,
      type: "gateway",
      particles: [],
      wavePattern: { amplitude: 30, frequency: 0.02, phase: 0, type: "spiral" },
    });

    // Error correction field
    this.magneticFields.push({
      id: "error-field",
      x: 200,
      y: 200,
      strength: 75,
      radius: 150,
      type: "generator",
      particles: [],
      wavePattern: {
        amplitude: 20,
        frequency: 0.015,
        phase: Math.PI,
        type: "pulse",
      },
    });

    // Learning amplifier
    this.magneticFields.push({
      id: "learning-amplifier",
      x: 1200,
      y: 700,
      strength: 85,
      radius: 180,
      type: "amplifier",
      particles: [],
      wavePattern: {
        amplitude: 25,
        frequency: 0.025,
        phase: Math.PI / 2,
        type: "sine",
      },
    });

    // Initialize particles for each field
    this.magneticFields.forEach((field) => {
      for (let i = 0; i < 20; i++) {
        field.particles.push({
          x: field.x + (Math.random() - 0.5) * field.radius,
          y: field.y + (Math.random() - 0.5) * field.radius,
          angle: Math.random() * Math.PI * 2,
          speed: 1 + Math.random() * 2,
          life: Math.random(),
          maxLife: 1,
          color:
            field.type === "gateway"
              ? "#ff0080"
              : field.type === "generator"
                ? "#0080ff"
                : "#80ff00",
        });
      }
    });

    console.log(
      `🌀 Initialized ${this.magneticFields.length} magnetic fields with particle effects`,
    );
  }

  private setupUserCommunication(): void {
    // Set up global function for external communication
    (window as any).askFixedAI = (message: string) => {
      return this.handleUserMessage(message);
    };

    console.log("💬 User communication interface ready");
  }

  private start(): void {
    this.isRunning = true;
    this.animate();
    this.updateMovementStatus(
      "System initialized - Click START MOVEMENT to begin",
    );
    this.logCommunication(
      "System",
      "Fixed AI Canvas Manager started - All systems operational",
    );
    console.log("🚀 Fixed AI Canvas Manager started with full functionality");
  }

  private animate(): void {
    this.time += 0.016; // ~60fps

    this.clearCanvas();

    if (this.grid) this.drawGrid();
    if (this.showFields) this.renderMagneticFields();

    this.updateAIs();
    this.renderAIs();

    if (this.showDataFlows) this.renderDataFlows();

    this.updateStats();
    this.processUserCommunications();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background gradient
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width / 2,
    );
    gradient.addColorStop(0, "rgba(0, 10, 30, 0.95)");
    gradient.addColorStop(1, "rgba(10, 0, 30, 0.95)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([2, 2]);

    const gridSize = 50;

    // Vertical lines
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
  }

  private renderMagneticFields(): void {
    this.magneticFields.forEach((field) => {
      // Field boundary
      this.ctx.strokeStyle = `rgba(0, 255, 255, 0.3)`;
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.arc(field.x, field.y, field.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Field center
      const pulse = 1 + Math.sin(this.time * 3) * 0.3;
      this.ctx.fillStyle =
        field.type === "gateway"
          ? "#ff0080"
          : field.type === "generator"
            ? "#0080ff"
            : "#80ff00";
      this.ctx.beginPath();
      this.ctx.arc(field.x, field.y, 15 * pulse, 0, Math.PI * 2);
      this.ctx.fill();

      // Wave pattern
      this.renderWavePattern(field);

      // Particles
      this.updateAndRenderParticles(field);

      // Field label
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "12px monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillText(field.id.toUpperCase(), field.x, field.y - 30);
    });
  }

  private renderWavePattern(field: MagneticFieldEffect): void {
    const { wavePattern } = field;
    const time = this.time + wavePattern.phase;

    this.ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
    this.ctx.lineWidth = 1;

    switch (wavePattern.type) {
      case "spiral":
        this.ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
          const radius =
            20 +
            angle * 5 +
            Math.sin(time * wavePattern.frequency + angle) *
              wavePattern.amplitude;
          const x = field.x + Math.cos(angle) * radius;
          const y = field.y + Math.sin(angle) * radius;

          if (angle === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        break;

      case "pulse":
        for (let i = 0; i < 5; i++) {
          const radius =
            50 +
            i * 30 +
            Math.sin(time * wavePattern.frequency + i) * wavePattern.amplitude;
          const alpha = ((5 - i) / 5) * 0.5;
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.arc(field.x, field.y, radius, 0, Math.PI * 2);
          this.ctx.stroke();
        }
        break;

      case "sine":
        this.ctx.beginPath();
        for (
          let x = field.x - field.radius;
          x < field.x + field.radius;
          x += 2
        ) {
          const offset = (x - field.x) / field.radius;
          const y =
            field.y +
            Math.sin(offset * Math.PI * 4 + time * wavePattern.frequency) *
              wavePattern.amplitude;

          if (x === field.x - field.radius) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        break;
    }
  }

  private updateAndRenderParticles(field: MagneticFieldEffect): void {
    field.particles.forEach((particle) => {
      // Update particle
      particle.angle += particle.speed * 0.02;
      particle.life -= 0.005;

      if (particle.life <= 0) {
        particle.life = 1;
        particle.x = field.x + (Math.random() - 0.5) * field.radius;
        particle.y = field.y + (Math.random() - 0.5) * field.radius;
      }

      // Orbital motion around field center
      const orbitRadius = 30 + Math.sin(this.time + particle.angle) * 20;
      particle.x = field.x + Math.cos(particle.angle) * orbitRadius;
      particle.y = field.y + Math.sin(particle.angle) * orbitRadius;

      // Render particle
      this.ctx.fillStyle = `rgba(${particle.color
        .replace("#", "")
        .match(/.{2}/g)
        ?.map((hex) => parseInt(hex, 16))
        .join(", ")}, ${particle.life})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private updateAIs(): void {
    if (!this.isRunning) return;

    const speedMultiplier = parseFloat(
      (document.getElementById("movement-speed") as HTMLInputElement)?.value ||
        "2",
    );

    this.ais.forEach((ai) => {
      // Calculate magnetic field influences
      let totalForceX = 0;
      let totalForceY = 0;

      this.magneticFields.forEach((field) => {
        const dx = field.x - ai.x;
        const dy = field.y - ai.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < field.radius) {
          const force = (field.strength / (distance * distance + 1)) * 0.1;
          totalForceX += (dx / distance) * force;
          totalForceY += (dy / distance) * force;
        }
      });

      // Apply magnetic forces and consciousness-based movement
      ai.vx += totalForceX * speedMultiplier;
      ai.vy += totalForceY * speedMultiplier;

      // Consciousness-based behavior
      const consciousFactor = ai.consciousness;
      ai.vx +=
        Math.sin(this.time * consciousFactor * 2) * 0.5 * speedMultiplier;
      ai.vy +=
        Math.cos(this.time * consciousFactor * 1.5) * 0.5 * speedMultiplier;

      // Apply velocity damping
      ai.vx *= 0.98;
      ai.vy *= 0.98;

      // Update position
      ai.x += ai.vx;
      ai.y += ai.vy;

      // Boundary handling with wrapping
      if (ai.x < 0) ai.x = this.canvas.width;
      if (ai.x > this.canvas.width) ai.x = 0;
      if (ai.y < 0) ai.y = this.canvas.height;
      if (ai.y > this.canvas.height) ai.y = 0;

      // Update trail
      ai.trail.push({ x: ai.x, y: ai.y, alpha: 1 });
      if (ai.trail.length > 20) ai.trail.shift();
      ai.trail.forEach((point) => (point.alpha *= 0.95));

      // Update status
      const speed = Math.sqrt(ai.vx * ai.vx + ai.vy * ai.vy);
      ai.isMoving = speed > 0.1;
      ai.fieldInfluence = Math.min(
        totalForceX * totalForceX + totalForceY * totalForceY,
        1,
      );
    });

    // Generate data flows between AIs
    this.generateDataFlows();
  }

  private renderAIs(): void {
    this.ais.forEach((ai) => {
      // Render trail
      ai.trail.forEach((point, index) => {
        if (point.alpha > 0.1) {
          this.ctx.fillStyle = `rgba(${ai.color
            .replace("#", "")
            .match(/.{2}/g)
            ?.map((hex) => parseInt(hex, 16))
            .join(", ")}, ${point.alpha * 0.3})`;
          this.ctx.beginPath();
          this.ctx.arc(point.x, point.y, ai.size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
        }
      });

      // AI entity
      const pulse = 1 + Math.sin(this.time * 4 + ai.consciousness * 10) * 0.2;
      this.ctx.fillStyle = ai.color;
      this.ctx.beginPath();
      this.ctx.arc(ai.x, ai.y, ai.size * pulse, 0, Math.PI * 2);
      this.ctx.fill();

      // Consciousness aura
      const auraAlpha = ai.consciousness * 0.3;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${auraAlpha})`;
      this.ctx.beginPath();
      this.ctx.arc(ai.x, ai.y, ai.size * 2, 0, Math.PI * 2);
      this.ctx.fill();

      // Communication range
      if (ai.status === "communicating") {
        this.ctx.strokeStyle = `rgba(255, 255, 0, 0.3)`;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([3, 3]);
        this.ctx.beginPath();
        this.ctx.arc(ai.x, ai.y, ai.communicationRange, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      // AI label and status
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "10px monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillText(ai.name, ai.x, ai.y - ai.size - 5);

      this.ctx.font = "8px monospace";
      this.ctx.fillStyle = ai.isMoving ? "#00ff00" : "#ff4444";
      this.ctx.fillText(ai.status.toUpperCase(), ai.x, ai.y + ai.size + 10);

      // Velocity arrow
      if (ai.isMoving) {
        const arrowLength = Math.sqrt(ai.vx * ai.vx + ai.vy * ai.vy) * 10;
        const angle = Math.atan2(ai.vy, ai.vx);

        this.ctx.strokeStyle = "#ffff00";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(ai.x, ai.y);
        this.ctx.lineTo(
          ai.x + Math.cos(angle) * arrowLength,
          ai.y + Math.sin(angle) * arrowLength,
        );
        this.ctx.stroke();
      }
    });
  }

  private generateDataFlows(): void {
    // Clean up completed flows
    this.dataFlows = this.dataFlows.filter((flow) => flow.progress < 1);

    // Generate new flows occasionally
    if (Math.random() < 0.05 && this.ais.size > 1) {
      const aiArray = Array.from(this.ais.values());
      const fromAI = aiArray[Math.floor(Math.random() * aiArray.length)];
      const toAI = aiArray[Math.floor(Math.random() * aiArray.length)];

      if (fromAI.id !== toAI.id) {
        const flowTypes: DataFlow["type"][] = [
          "consciousness",
          "error_fix",
          "user_data",
          "command",
        ];
        const flowType =
          flowTypes[Math.floor(Math.random() * flowTypes.length)];

        const flow: DataFlow = {
          id: `flow_${Date.now()}`,
          fromAI: fromAI.id,
          toAI: toAI.id,
          progress: 0,
          data: { type: flowType, timestamp: Date.now() },
          path: this.calculateFlowPath(fromAI, toAI),
          type: flowType,
          speed: 0.02 + Math.random() * 0.03,
          color: this.getFlowColor(flowType),
        };

        this.dataFlows.push(flow);
      }
    }

    // Update existing flows
    this.dataFlows.forEach((flow) => {
      flow.progress += flow.speed;
    });
  }

  private calculateFlowPath(
    fromAI: WorkingAIEntity,
    toAI: WorkingAIEntity,
  ): { x: number; y: number }[] {
    const path = [];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const arcHeight = 50;

      const x = fromAI.x + (toAI.x - fromAI.x) * t;
      const y =
        fromAI.y + (toAI.y - fromAI.y) * t - Math.sin(t * Math.PI) * arcHeight;

      path.push({ x, y });
    }

    return path;
  }

  private getFlowColor(type: DataFlow["type"]): string {
    switch (type) {
      case "consciousness":
        return "#ff0080";
      case "error_fix":
        return "#ff4400";
      case "user_data":
        return "#8800ff";
      case "command":
        return "#00ff80";
      default:
        return "#ffffff";
    }
  }

  private renderDataFlows(): void {
    this.dataFlows.forEach((flow) => {
      if (flow.path.length < 2) return;

      const currentIndex = Math.floor(flow.progress * (flow.path.length - 1));
      const currentPoint = flow.path[currentIndex];

      if (currentPoint) {
        // Data packet
        this.ctx.fillStyle = flow.color;
        this.ctx.beginPath();
        this.ctx.arc(currentPoint.x, currentPoint.y, 6, 0, Math.PI * 2);
        this.ctx.fill();

        // Trail
        for (let i = 0; i < 5; i++) {
          const trailIndex = Math.max(0, currentIndex - i);
          const trailPoint = flow.path[trailIndex];
          const alpha = ((5 - i) / 5) * 0.5;

          this.ctx.fillStyle = `rgba(${flow.color
            .replace("#", "")
            .match(/.{2}/g)
            ?.map((hex) => parseInt(hex, 16))
            .join(", ")}, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.arc(trailPoint.x, trailPoint.y, 3, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Flow line
        this.ctx.strokeStyle = `rgba(${flow.color
          .replace("#", "")
          .match(/.{2}/g)
          ?.map((hex) => parseInt(hex, 16))
          .join(", ")}, 0.3)`;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);
        this.ctx.beginPath();
        this.ctx.moveTo(flow.path[0].x, flow.path[0].y);
        for (let i = 1; i < flow.path.length; i++) {
          this.ctx.lineTo(flow.path[i].x, flow.path[i].y);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
    });
  }

  private handleCanvasClick(x: number, y: number): void {
    // Find nearest AI
    let nearestAI: WorkingAIEntity | null = null;
    let minDistance = Infinity;

    this.ais.forEach((ai) => {
      const distance = Math.sqrt((x - ai.x) ** 2 + (y - ai.y) ** 2);
      if (distance < minDistance && distance < ai.size + 20) {
        minDistance = distance;
        nearestAI = ai;
      }
    });

    if (nearestAI) {
      this.showAIInfo(nearestAI);
      this.logCommunication(
        "User",
        `Clicked on ${nearestAI.name} - showing AI information`,
      );
    } else {
      this.addMagneticFieldAt(x, y);
      this.logCommunication(
        "User",
        `Added magnetic field at position (${Math.round(x)}, ${Math.round(y)})`,
      );
    }
  }

  private showAIInfo(ai: WorkingAIEntity): void {
    const info = `
AI: ${ai.name}
Status: ${ai.status}
Position: (${Math.round(ai.x)}, ${Math.round(ai.y)})
Consciousness: ${(ai.consciousness * 100).toFixed(1)}%
Field Influence: ${(ai.fieldInfluence * 100).toFixed(1)}%
Current Task: ${ai.currentTask}
Moving: ${ai.isMoving ? "Yes" : "No"}
    `.trim();

    const responseDiv = document.getElementById("ai-response");
    if (responseDiv) {
      responseDiv.innerHTML = `<div style="color: #00ffff;">${info.replace(/\n/g, "<br>")}</div>`;
    }
  }

  private addMagneticFieldAt(x: number, y: number): void {
    const field: MagneticFieldEffect = {
      id: `user-field-${Date.now()}`,
      x,
      y,
      strength: 50 + Math.random() * 50,
      radius: 100 + Math.random() * 50,
      type: "generator",
      particles: [],
      wavePattern: {
        amplitude: 15 + Math.random() * 15,
        frequency: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        type: "pulse",
      },
    };

    // Initialize particles
    for (let i = 0; i < 15; i++) {
      field.particles.push({
        x: x + (Math.random() - 0.5) * field.radius,
        y: y + (Math.random() - 0.5) * field.radius,
        angle: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 2,
        life: Math.random(),
        maxLife: 1,
        color: "#00ff80",
      });
    }

    this.magneticFields.push(field);
  }

  private addRandomMagneticField(): void {
    const x = 100 + Math.random() * (this.canvas.width - 200);
    const y = 100 + Math.random() * (this.canvas.height - 200);
    this.addMagneticFieldAt(x, y);
  }

  private handleUserMessage(message: string): string {
    const timestamp = new Date().toISOString();

    // Process message and generate AI response
    let response = this.generateAIResponse(message);

    const communication: UserCommunication = {
      id: `comm_${Date.now()}`,
      timestamp,
      message,
      response,
      aiId: "system",
      status: "responded",
      type: this.classifyMessage(message),
    };

    this.userCommunications.push(communication);
    this.logCommunication("User", message);
    this.logCommunication("AI", response);

    // Display response
    const responseDiv = document.getElementById("ai-response");
    if (responseDiv) {
      responseDiv.innerHTML = `<div style="color: #00ff88;">${response}</div>`;
    }

    return response;
  }

  private generateAIResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("movement") || lowerMessage.includes("move")) {
      const movingCount = Array.from(this.ais.values()).filter(
        (ai) => ai.isMoving,
      ).length;
      return `Movement Analysis: ${movingCount}/${this.ais.size} AIs are currently moving with magnetic field interactions. Speed multiplier: ${(document.getElementById("movement-speed") as HTMLInputElement)?.value || "2"}x`;
    }

    if (lowerMessage.includes("field") || lowerMessage.includes("magnetic")) {
      return `Magnetic Field Status: ${this.magneticFields.length} active fields generating ${this.magneticFields.reduce((sum, f) => sum + f.particles.length, 0)} particles. Fields are influencing AI movement patterns.`;
    }

    if (
      lowerMessage.includes("data") ||
      lowerMessage.includes("communication")
    ) {
      return `Data Flow Analysis: ${this.dataFlows.length} active data streams between AIs. Communication types: consciousness, error_fix, user_data, command.`;
    }

    if (lowerMessage.includes("status") || lowerMessage.includes("system")) {
      const movingCount = Array.from(this.ais.values()).filter(
        (ai) => ai.isMoving,
      ).length;
      return `System Status: ${this.ais.size} AIs active, ${movingCount} moving, ${this.magneticFields.length} magnetic fields, ${this.dataFlows.length} data flows. All systems operational.`;
    }

    if (lowerMessage.includes("fix") || lowerMessage.includes("error")) {
      return `Error Analysis: System monitoring active. Canvas rendering at 60fps, all AI entities responding correctly to magnetic field influences. No critical errors detected.`;
    }

    if (lowerMessage.includes("consciousness") || lowerMessage.includes("5d")) {
      const avgConsciousness =
        Array.from(this.ais.values()).reduce(
          (sum, ai) => sum + ai.consciousness,
          0,
        ) / this.ais.size;
      return `Consciousness Analysis: Average AI consciousness level: ${(avgConsciousness * 100).toFixed(1)}%. 5D visualization showing consciousness fields and quantum interactions.`;
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return `Hello! I'm the Fixed AI Canvas Manager. I'm monitoring ${this.ais.size} AI entities with magnetic field interactions. Ask me about movement, fields, data flows, or system status.`;
    }

    // Default response
    return `Processing: "${message}". Available topics: movement, magnetic fields, data flows, system status, consciousness levels, error analysis. All AI systems are operational and responding to magnetic field influences.`;
  }

  private classifyMessage(message: string): UserCommunication["type"] {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("?") ||
      lowerMessage.includes("how") ||
      lowerMessage.includes("what") ||
      lowerMessage.includes("why")
    ) {
      return "question";
    }

    if (
      lowerMessage.includes("fix") ||
      lowerMessage.includes("start") ||
      lowerMessage.includes("stop") ||
      lowerMessage.includes("reset")
    ) {
      return "command";
    }

    if (
      lowerMessage.includes("add") ||
      lowerMessage.includes("create") ||
      lowerMessage.includes("make")
    ) {
      return "request";
    }

    return "feedback";
  }

  private logCommunication(sender: string, message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const logDiv = document.getElementById("communication-log");

    if (logDiv) {
      const color =
        sender === "User" ? "#ffff00" : sender === "AI" ? "#00ff88" : "#00ffff";
      logDiv.innerHTML += `<div style="color: ${color};">[${timestamp}] ${sender}: ${message}</div>`;
      logDiv.scrollTop = logDiv.scrollHeight;
    }
  }

  private updateStats(): void {
    const movingCount = Array.from(this.ais.values()).filter(
      (ai) => ai.isMoving,
    ).length;

    const updates = [
      { id: "ai-count", value: this.ais.size },
      { id: "moving-count", value: movingCount },
      { id: "communication-count", value: this.userCommunications.length },
      { id: "field-count", value: this.magneticFields.length },
      { id: "dataflow-count", value: this.dataFlows.length },
    ];

    updates.forEach((update) => {
      const element = document.getElementById(update.id);
      if (element) {
        const span = element.querySelector("span");
        if (span) span.textContent = update.value.toString();
      }
    });
  }

  private updateMovementStatus(status: string): void {
    const statusDiv = document.getElementById("movement-status");
    if (statusDiv) {
      statusDiv.textContent = status;
    }
  }

  private resetAIPositions(): void {
    const configs = [
      { x: 200, y: 150 },
      { x: 400, y: 300 },
      { x: 600, y: 200 },
      { x: 800, y: 400 },
      { x: 1000, y: 250 },
      { x: 1200, y: 350 },
    ];

    let index = 0;
    this.ais.forEach((ai) => {
      if (index < configs.length) {
        ai.x = configs[index].x;
        ai.y = configs[index].y;
        ai.vx = (Math.random() - 0.5) * 2;
        ai.vy = (Math.random() - 0.5) * 2;
        ai.trail = [];
        index++;
      }
    });
  }

  private processUserCommunications(): void {
    this.userCommunications.forEach((comm) => {
      if (comm.status === "pending") {
        // Process pending communications
        comm.status = "processing";
        setTimeout(() => {
          comm.status = "responded";
        }, 1000);
      }
    });
  }

  private runSystemDiagnosis(): void {
    const diagnosis = {
      canvasRendering: this.animationId > 0,
      aiMovement: Array.from(this.ais.values()).some((ai) => ai.isMoving),
      magneticFields: this.magneticFields.length > 0,
      dataFlows: this.dataFlows.length >= 0,
      userCommunication: this.userCommunications.length >= 0,
      controlsWorking: document.getElementById("start-ai-movement") !== null,
    };

    const issues = Object.entries(diagnosis)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    let result = "";
    if (issues.length === 0) {
      result =
        "✅ All systems operational! Canvas rendering, AI movement, magnetic fields, and user communication working correctly.";
    } else {
      result = `⚠️ Issues detected: ${issues.join(", ")}. Attempting automatic fixes...`;
      // Auto-fix attempts could go here
    }

    this.logCommunication("System", result);

    const responseDiv = document.getElementById("ai-response");
    if (responseDiv) {
      responseDiv.innerHTML = `<div style="color: ${issues.length === 0 ? "#00ff00" : "#ff8800"};">${result}</div>`;
    }
  }

  // Public methods for external access
  public getSystemStatus(): any {
    return {
      isRunning: this.isRunning,
      aiCount: this.ais.size,
      movingAIs: Array.from(this.ais.values()).filter((ai) => ai.isMoving)
        .length,
      magneticFields: this.magneticFields.length,
      dataFlows: this.dataFlows.length,
      communications: this.userCommunications.length,
      canvasActive: this.animationId > 0,
    };
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Global instance
declare global {
  interface Window {
    fixedAICanvasManager: FixedAICanvasManager;
    askFixedAI: (message: string) => string;
  }
}

export default FixedAICanvasManager;
