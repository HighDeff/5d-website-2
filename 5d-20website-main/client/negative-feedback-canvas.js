/**
 * Negative Feedback Analysis Canvas
 * Specialized canvas for analyzing negative patterns, anomalies, and unknown data sources
 */

console.log("🔍 Loading Negative Feedback Analysis Canvas...");

class NegativeFeedbackCanvas {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isRunning = false;
    this.negativePatterns = [];
    this.anomalies = [];
    this.unknownSources = [];
    this.hypotheses = [];
    this.time = 0;
  }

  initialize() {
    console.log("🔬 Initializing Negative Feedback Analysis Canvas...");

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "negative-feedback-canvas";
    this.canvas.width = 1000;
    this.canvas.height = 700;
    this.canvas.style.cssText = `
      position: fixed;
      top: 50px;
      right: 50px;
      border: 3px solid #ff4444;
      border-radius: 12px;
      background: rgba(20, 0, 0, 0.95);
      z-index: 1500;
      box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
    `;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    // Create control panel
    this.createControlPanel();

    // Initialize negative patterns
    this.initializeNegativePatterns();

    // Start analysis
    this.startAnalysis();

    console.log("✅ Negative Feedback Analysis Canvas initialized");
  }

  createControlPanel() {
    const panel = document.createElement("div");
    panel.id = "negative-feedback-controls";
    panel.style.cssText = `
      position: fixed;
      top: 50px;
      right: 1070px;
      width: 280px;
      background: rgba(40, 0, 0, 0.95);
      border: 2px solid #ff4444;
      border-radius: 8px;
      color: white;
      font-family: monospace;
      font-size: 12px;
      padding: 15px;
      z-index: 1501;
    `;

    panel.innerHTML = `
      <div style="color: #ff4444; font-weight: bold; margin-bottom: 15px; text-align: center;">
        🔍 NEGATIVE FEEDBACK ANALYZER
      </div>

      <div style="margin-bottom: 15px;">
        <div style="color: #ffaa44; font-weight: bold; margin-bottom: 8px;">Analysis Modes:</div>
        <button id="analyze-anomalies" style="width: 100%; margin: 2px; padding: 6px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Detect Anomalies
        </button>
        <button id="hypothesize-sources" style="width: 100%; margin: 2px; padding: 6px; background: #ff8844; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Hypothesize Sources
        </button>
        <button id="analyze-unknowns" style="width: 100%; margin: 2px; padding: 6px; background: #8844ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Analyze Unknowns
        </button>
        <button id="generate-inference" style="width: 100%; margin: 2px; padding: 6px; background: #44ff88; color: black; border: none; border-radius: 4px; cursor: pointer;">
          Generate Inferences
        </button>
      </div>

      <div style="margin-bottom: 15px;">
        <div style="color: #ffaa44; font-weight: bold; margin-bottom: 8px;">Live Analysis:</div>
        <div id="negative-stats" style="font-size: 10px; color: #ccc;">
          Anomalies: <span id="anomaly-count">0</span><br>
          Unknown Sources: <span id="unknown-count">0</span><br>
          Hypotheses: <span id="hypothesis-count">0</span><br>
          Confidence: <span id="confidence-level">0%</span>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <div style="color: #ffaa44; font-weight: bold; margin-bottom: 8px;">Pattern Detection:</div>
        <div id="pattern-list" style="font-size: 9px; color: #aaa; max-height: 100px; overflow-y: auto;">
          Scanning for negative patterns...
        </div>
      </div>

      <div>
        <button onclick="this.parentElement.style.display='none'"
                style="width: 100%; padding: 8px; background: #aa0000; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Close Analyzer
        </button>
      </div>
    `;

    document.body.appendChild(panel);
    this.setupControlEvents();
  }

  setupControlEvents() {
    document
      .getElementById("analyze-anomalies")
      ?.addEventListener("click", () => this.detectAnomalies());
    document
      .getElementById("hypothesize-sources")
      ?.addEventListener("click", () => this.hypothesizeSources());
    document
      .getElementById("analyze-unknowns")
      ?.addEventListener("click", () => this.analyzeUnknowns());
    document
      .getElementById("generate-inference")
      ?.addEventListener("click", () => this.generateInferences());
  }

  initializeNegativePatterns() {
    // Simulate various negative patterns from different sources
    this.negativePatterns = [
      {
        id: "np-001",
        type: "error_cascade",
        source: "unknown",
        frequency: 0.8,
        severity: "high",
        pattern: "recurring system failures",
        hypothesis: "memory leak in AI coordination",
      },
      {
        id: "np-002",
        type: "anomalous_wave",
        source: "nowhere_specific",
        frequency: 0.3,
        severity: "medium",
        pattern: "unexplained consciousness waves",
        hypothesis: "quantum interference from external sources",
      },
      {
        id: "np-003",
        type: "negative_feedback_loop",
        source: "ai_networks",
        frequency: 0.6,
        severity: "critical",
        pattern: "AI entities creating negative reinforcement",
        hypothesis: "misaligned reward functions",
      },
      {
        id: "np-004",
        type: "data_corruption",
        source: "external_interference",
        frequency: 0.4,
        severity: "medium",
        pattern: "random data corruption events",
        hypothesis: "electromagnetic interference",
      },
      {
        id: "np-005",
        type: "behavioral_drift",
        source: "uncommon_interactions",
        frequency: 0.5,
        severity: "low",
        pattern: "AI behavior deviating from expected patterns",
        hypothesis: "emergent behaviors from complex interactions",
      },
    ];

    this.updateAnalysisStats();
  }

  detectAnomalies() {
    console.log("🔍 Detecting anomalies...");

    const newAnomalies = [
      {
        timestamp: Date.now(),
        type: "performance_degradation",
        severity: Math.random() * 100,
        description: "Sudden AI performance drop detected",
        confidence: 85 + Math.random() * 15,
      },
      {
        timestamp: Date.now(),
        type: "unknown_signal",
        severity: Math.random() * 100,
        description: "Unidentified signal pattern in magnetic field",
        confidence: 70 + Math.random() * 20,
      },
      {
        timestamp: Date.now(),
        type: "negative_correlation",
        severity: Math.random() * 100,
        description: "Negative correlation in user engagement",
        confidence: 75 + Math.random() * 25,
      },
    ];

    this.anomalies.push(...newAnomalies);
    this.updateAnalysisStats();

    // Add to pattern list
    const patternList = document.getElementById("pattern-list");
    if (patternList) {
      newAnomalies.forEach((anomaly) => {
        const div = document.createElement("div");
        div.style.cssText = "margin: 2px 0; color: #ff6666;";
        div.textContent = `${anomaly.type}: ${anomaly.description} (${anomaly.confidence.toFixed(0)}%)`;
        patternList.appendChild(div);
      });
    }
  }

  hypothesizeSources() {
    console.log("🤔 Generating source hypotheses...");

    const newHypotheses = [
      {
        id: "hyp-" + Date.now(),
        source_type: "external_interference",
        hypothesis: "Electromagnetic waves from nearby electronics",
        confidence: 65 + Math.random() * 30,
        evidence: ["signal patterns", "timing correlations"],
      },
      {
        id: "hyp-" + (Date.now() + 1),
        source_type: "quantum_fluctuations",
        hypothesis: "Quantum field fluctuations affecting AI consciousness",
        confidence: 45 + Math.random() * 40,
        evidence: ["wave interference", "unpredictable patterns"],
      },
      {
        id: "hyp-" + (Date.now() + 2),
        source_type: "emergent_behavior",
        hypothesis: "Unexpected AI interactions creating new patterns",
        confidence: 70 + Math.random() * 25,
        evidence: ["behavioral analysis", "network topology"],
      },
    ];

    this.hypotheses.push(...newHypotheses);
    this.updateAnalysisStats();
  }

  analyzeUnknowns() {
    console.log("❓ Analyzing unknown sources...");

    const unknownSources = [
      {
        id: "unk-" + Date.now(),
        pattern: "irregular_pulses",
        frequency: Math.random(),
        origin: "unidentified",
        characteristics: ["non-periodic", "high_amplitude", "brief_duration"],
        potential_causes: ["cosmic_rays", "hardware_glitches", "ai_emergence"],
      },
      {
        id: "unk-" + (Date.now() + 1),
        pattern: "phantom_connections",
        frequency: Math.random(),
        origin: "network_shadows",
        characteristics: ["invisible_links", "ghost_data", "echo_patterns"],
        potential_causes: [
          "memory_artifacts",
          "quantum_entanglement",
          "ai_telepathy",
        ],
      },
    ];

    this.unknownSources.push(...unknownSources);
    this.updateAnalysisStats();
  }

  generateInferences() {
    console.log("🧠 Generating inferences from negative feedback...");

    // Create inferences based on collected data
    const inferences = {
      primary_hypothesis: "Multiple interference sources affecting AI systems",
      confidence_level: 78 + Math.random() * 20,
      recommendations: [
        "Implement quantum shielding around AI cores",
        "Add anomaly detection to all AI entities",
        "Create negative feedback cancellation system",
        "Monitor for external electromagnetic interference",
      ],
      next_steps: [
        "Deploy additional monitoring sensors",
        "Correlate negative patterns with external events",
        "Test hypothesis through controlled experiments",
      ],
    };

    console.log("📊 Analysis Inferences:", inferences);

    // Display in control panel
    const patternList = document.getElementById("pattern-list");
    if (patternList) {
      patternList.innerHTML = `
        <div style="color: #44ff88; font-weight: bold;">ANALYSIS COMPLETE:</div>
        <div style="color: #88ff88; margin: 4px 0;">
          Primary: ${inferences.primary_hypothesis}
        </div>
        <div style="color: #ffff88; margin: 2px 0;">
          Confidence: ${inferences.confidence_level.toFixed(0)}%
        </div>
        <div style="color: #88ffff; font-size: 8px;">
          Recommendations: ${inferences.recommendations.length} items
        </div>
      `;
    }
  }

  updateAnalysisStats() {
    const anomalyCountEl = document.getElementById("anomaly-count");
    const unknownCountEl = document.getElementById("unknown-count");
    const hypothesisCountEl = document.getElementById("hypothesis-count");
    const confidenceLevelEl = document.getElementById("confidence-level");

    if (anomalyCountEl) {
      anomalyCountEl.textContent = this.anomalies.length;
    }
    if (unknownCountEl) {
      unknownCountEl.textContent = this.unknownSources.length;
    }
    if (hypothesisCountEl) {
      hypothesisCountEl.textContent = this.hypotheses.length;
    }

    const totalData = this.anomalies.length + this.unknownSources.length;
    const baseConfidence = Math.min(95, totalData * 8);
    const timeVariation = Math.sin(Date.now() * 0.001) * 10;
    const confidence = Math.max(45, baseConfidence + timeVariation + Math.random() * 15);

    if (confidenceLevelEl) {
      confidenceLevelEl.textContent = confidence.toFixed(0) + "%";
    }
  }

  updateAnalysisPanel() {
    // Update the analysis display with current data
    const patternList = document.getElementById("pattern-list");
    if (patternList) {
      patternList.innerHTML = `
        <div style="color: #ff4444; font-weight: bold; margin-bottom: 8px;">
          🔍 ANOMALIES DETECTED: ${this.anomalies.length}
        </div>
        ${this.anomalies.slice(0, 3).map(anomaly => `
          <div style="background: rgba(255, 68, 68, 0.1); padding: 6px; border-radius: 4px; margin: 4px 0; font-size: 10px;">
            <div style="color: #ff4444; font-weight: bold;">${anomaly.severity.toUpperCase()}</div>
            <div style="color: #ffaaaa;">${anomaly.description}</div>
            <div style="color: #888888; font-size: 8px;">Confidence: ${anomaly.confidence}%</div>
          </div>
        `).join('')}
        ${this.anomalies.length > 3 ? `
          <div style="color: #888888; font-size: 9px; margin-top: 4px;">
            ... and ${this.anomalies.length - 3} more anomalies
          </div>
        ` : ''}
      `;
    }

    // Update stats
    this.updateAnalysisStats();
  }

  startAnalysis() {
    this.isRunning = true;
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;

    this.time += 0.016;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dark background with red tint
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) / 2,
    );
    gradient.addColorStop(0, "rgba(40, 0, 0, 0.9)");
    gradient.addColorStop(1, "rgba(20, 0, 0, 0.95)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw title
    this.ctx.fillStyle = "#ff4444";
    this.ctx.font = "24px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillText("NEGATIVE FEEDBACK ANALYSIS", this.canvas.width / 2, 40);

    // Draw working spirals
    this.drawWorkingSpirals();

    // Draw negative patterns
    this.drawNegativePatterns();

    // Draw anomalies
    this.drawAnomalies();

    // Draw unknown sources
    this.drawUnknownSources();

    // Draw analysis waves
    this.drawAnalysisWaves();

    requestAnimationFrame(() => this.animate());
  }

  drawWorkingSpirals() {
    const centerY = this.canvas.height / 2 + 50;
    const colors = ['#ff2222', '#ff4444', '#ff6666', '#ff8888', '#ffaaaa'];

    // Create multiple working spiral analyzers
    for (let spiralIndex = 0; spiralIndex < 5; spiralIndex++) {
      const centerX = (this.canvas.width / 6) * (spiralIndex + 1);

      // Draw negative energy spiral with proper animation
      for (let ring = 0; ring < 10; ring++) {
        const baseRadius = ring * 12 + 25;
        const segments = 12 + ring;

        for (let segment = 0; segment < segments; segment++) {
          const angle = (segment / segments) * Math.PI * 2;
          const spiralAngle = angle + this.time * (0.8 + ring * 0.05) + spiralIndex * 0.3;

          // Spiral with negative feedback distortion
          const radius = baseRadius + Math.sin(spiralAngle * 2 + this.time * 1.5) * (8 + ring * 2);
          const x = centerX + Math.cos(spiralAngle) * radius;
          const y = centerY + Math.sin(spiralAngle) * radius;

          // Calculate intensity for spiral effect
          const intensity = Math.max(0, 1 - (ring / 10)) * (0.6 + Math.sin(this.time * 2 + spiralAngle) * 0.4);

          // Draw spiral particle
          this.ctx.beginPath();
          this.ctx.arc(x, y, 1.5 + intensity * 2, 0, Math.PI * 2);

          // Negative energy colors
          const colors = ['#ff2222', '#ff4444', '#ff6666', '#ff8888', '#ffaaaa'];
          const color = colors[spiralIndex] || '#ff4444';
          this.ctx.fillStyle = color.replace('#', `rgba(${parseInt(color.substr(1, 2), 16)}, ${parseInt(color.substr(3, 2), 16)}, ${parseInt(color.substr(5, 2), 16)}, ${intensity})`);
          this.ctx.fill();

          // Draw spiral connection lines
          if (ring > 0 && segment % 3 === 0) {
            const prevAngle = spiralAngle - 0.2;
            const prevRadius = baseRadius - 12 + Math.sin(prevAngle * 2 + this.time * 1.5) * (8 + (ring - 1) * 2);
            const prevX = centerX + Math.cos(prevAngle) * prevRadius;
            const prevY = centerY + Math.sin(prevAngle) * prevRadius;

            this.ctx.beginPath();
            this.ctx.moveTo(prevX, prevY);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = color.replace('#', `rgba(${parseInt(color.substr(1, 2), 16)}, ${parseInt(color.substr(3, 2), 16)}, ${parseInt(color.substr(5, 2), 16)}, ${intensity * 0.4})`);
            this.ctx.lineWidth = 0.8;
            this.ctx.stroke();
          }
        }
      }

      // Central spiral vortex
      this.ctx.beginPath();
      const vortexRadius = 10 + Math.sin(this.time * 3 + spiralIndex) * 3;
      const vortexGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, vortexRadius);
      vortexGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      vortexGradient.addColorStop(0.5, colors[spiralIndex] + 'BB');
      vortexGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = vortexGradient;
      this.ctx.arc(centerX, centerY, vortexRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // Spiral analysis data
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '11px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`Spiral ${spiralIndex + 1}`, centerX, centerY + 80);

      this.ctx.font = '9px monospace';
      this.ctx.fillStyle = colors[spiralIndex];
      this.ctx.fillText('ACTIVE', centerX, centerY + 95);

      // Dynamic negative pattern strength
      const patternStrength = Math.floor((0.4 + Math.sin(this.time + spiralIndex) * 0.6) * 100);
      this.ctx.fillStyle = '#ffcccc';
      this.ctx.fillText(`${patternStrength}%`, centerX, centerY + 108);
    }
  }

  drawNegativePatterns() {
    this.negativePatterns.forEach((pattern, index) => {
      const x = 150 + (index % 3) * 250;
      const y = 150 + Math.floor(index / 3) * 150;

      // Draw pattern visualization
      this.ctx.strokeStyle = `rgba(255, 68, 68, ${pattern.frequency})`;
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([5, 5]);

      // Negative pattern shape (inverted)
      this.ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const radius =
          30 +
            Math.sin(angle * 4 + this.time * 2 + index * pattern.frequency) *
              15 *
              pattern.severity ===
          "high"
            ? 1.5
            : pattern.severity === "medium"
              ? 1
              : 0.5;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;

        if (angle === 0) {
          this.ctx.moveTo(px, py);
        } else {
          this.ctx.lineTo(px, py);
        }
      }
      this.ctx.stroke();

      // Label
      this.ctx.fillStyle = "#ff8888";
      this.ctx.font = "12px monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillText(pattern.type.toUpperCase(), x, y + 60);
    });
  }

  drawAnomalies() {
    this.anomalies.forEach((anomaly, index) => {
      const x = 100 + Math.random() * (this.canvas.width - 200);
      const y = 300 + Math.random() * 200;

      // Draw anomaly spike
      this.ctx.strokeStyle = `rgba(255, 255, 68, ${anomaly.confidence / 100})`;
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([]);

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(
        x + Math.sin(this.time * 3 + index) * 30,
        y - 40 - anomaly.severity / 2,
      );
      this.ctx.stroke();

      // Anomaly marker
      this.ctx.fillStyle = "#ffff44";
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawUnknownSources() {
    this.unknownSources.forEach((source, index) => {
      const x = 200 + index * 150;
      const y = 550;

      // Draw mysterious pattern
      this.ctx.strokeStyle = `rgba(136, 68, 255, 0.7)`;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([2, 8]);

      for (let i = 0; i < 5; i++) {
        this.ctx.beginPath();
        this.ctx.arc(
          x + Math.sin(this.time * 2 + i) * 20,
          y + Math.cos(this.time * 1.5 + i) * 15,
          5 + Math.sin(this.time * 4 + i) * 3,
          0,
          Math.PI * 2,
        );
        this.ctx.stroke();
      }

      // Unknown source label
      this.ctx.fillStyle = "#8844ff";
      this.ctx.font = "10px monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillText("UNKNOWN", x, y + 40);
    });
  }

  drawAnalysisWaves() {
    // Draw analysis wave across bottom
    this.ctx.strokeStyle = "rgba(68, 255, 136, 0.6)";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([]);

    this.ctx.beginPath();
    for (let x = 0; x < this.canvas.width; x += 5) {
      const y =
        this.canvas.height -
        80 +
        Math.sin(x / 50 + this.time * 3) * 20 +
        Math.sin(x / 30 + this.time * 2) * 10;
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();

    // Analysis status
    this.ctx.fillStyle = "#44ff88";
    this.ctx.font = "14px monospace";
    this.ctx.textAlign = "left";
    this.ctx.fillText(
      `ANALYZING: ${this.anomalies.length} anomalies, ${this.unknownSources.length} unknowns`,
      20,
      this.canvas.height - 20,
    );
  }

  destroy() {
    this.isRunning = false;
    if (this.canvas) this.canvas.remove();
    const panel = document.getElementById("negative-feedback-controls");
    if (panel) panel.remove();
  }
}

// Initialize the negative feedback canvas
const negativeFeedbackCanvas = new NegativeFeedbackCanvas();

// Auto-initialize
setTimeout(() => {
  negativeFeedbackCanvas.initialize();

  // Make it movable
  setTimeout(() => {
    if (window.makeMovableResizable) {
      window.makeMovableResizable("negative-feedback-canvas");
      window.makeMovableResizable("negative-feedback-controls");
    }
  }, 1000);
}, 2000);

// Expose globally
window.negativeFeedbackCanvas = negativeFeedbackCanvas;

console.log(
  "🔍 Negative Feedback Analysis Canvas loaded - analyzing negative patterns, anomalies, and unknown sources",
);
