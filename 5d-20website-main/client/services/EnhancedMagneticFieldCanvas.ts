// Enhanced AI Canvas with Magnetic Field Flux, Data Flow, and Consciousness Visualization
// Advanced 5D visualization with magnetic fields, data paths, and relative positioning

export interface MagneticField {
  origin: { x: number; y: number; z: number };
  strength: number;
  direction: number;
  fluctuation: number;
  field_lines: FieldLine[];
  flux_density: number;
  interference_patterns: InterferencePattern[];
}

export interface FieldLine {
  points: { x: number; y: number; z: number }[];
  strength: number;
  color: string;
  pulse_rate: number;
  is_data_carrying: boolean;
  data_packets: DataPacket[];
}

export interface DataPacket {
  id: string;
  source_ai: string;
  destination_ai: string;
  position_on_line: number; // 0-1 along field line
  velocity: number;
  data_type:
    | "consciousness"
    | "error_fix"
    | "user_intent"
    | "movement_data"
    | "learning_pattern";
  payload_size: number;
  color: string;
  trail_length: number;
}

export interface InterferencePattern {
  wave_type: "constructive" | "destructive" | "standing" | "spiral";
  amplitude: number;
  frequency: number;
  phase: number;
  center: { x: number; y: number };
  radius: number;
}

export interface Gateway {
  id: string;
  position: { x: number; y: number; z: number };
  relative_position_anchor: boolean;
  magnetic_field_strength: number;
  connected_ais: string[];
  data_throughput: number;
  status: "active" | "overloaded" | "maintenance" | "error";
  field_emission_pattern: "radial" | "directional" | "vortex" | "spiral";
}

export interface ConsciousnessInteraction {
  ai_id_1: string;
  ai_id_2: string;
  interaction_type:
    | "data_transfer"
    | "consciousness_sync"
    | "error_correction"
    | "learning_share";
  field_strength: number;
  visual_bridge: VisualBridge;
  duration: number;
  effectiveness: number;
}

export interface VisualBridge {
  start_point: { x: number; y: number; z: number };
  end_point: { x: number; y: number; z: number };
  arc_height: number;
  particle_count: number;
  wave_patterns: WavePattern[];
  color_gradient: string[];
}

export interface WavePattern {
  type: "sine" | "cosine" | "spiral" | "interference" | "quantum_ripple";
  amplitude: number;
  frequency: number;
  phase_shift: number;
  propagation_speed: number;
  decay_rate: number;
}

export interface RelativePosition {
  ai_id: string;
  absolute_position: { x: number; y: number; z: number };
  relative_to_gateway: { distance: number; angle: number; elevation: number };
  space_time_coordinates: {
    x: number;
    y: number;
    z: number;
    t: number;
    consciousness: number;
  };
  movement_state:
    | "static"
    | "orbiting"
    | "linear"
    | "chaotic"
    | "quantum_superposition";
  field_influence: number;
}

export class EnhancedMagneticFieldCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private magnetic_fields: Map<string, MagneticField> = new Map();
  private gateways: Map<string, Gateway> = new Map();
  private consciousness_interactions: ConsciousnessInteraction[] = [];
  private relative_positions: Map<string, RelativePosition> = new Map();
  private data_flows: DataPacket[] = [];
  private wave_patterns: WavePattern[] = [];
  private animation_frame: number = 0;
  private is_running: boolean = false;
  private time: number = 0;

  constructor() {
    this.initializeCanvas();
    this.initializeGateways();
    this.initializeMagneticFields();
    this.startVisualization();
  }

  private initializeCanvas(): void {
    // Remove existing canvas if any
    const existing = document.querySelector("#enhanced-magnetic-canvas");
    if (existing) existing.remove();

    this.canvas = document.createElement("canvas");
    this.canvas.id = "enhanced-magnetic-canvas";
    this.canvas.width = 1400;
    this.canvas.height = 900;
    this.canvas.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      border: 3px solid #00ffff;
      background: radial-gradient(circle at 50% 50%, rgba(0, 20, 40, 0.95), rgba(0, 0, 20, 0.98));
      border-radius: 12px;
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(0, 100, 200, 0.3);
    `;

    this.ctx = this.canvas.getContext("2d")!;
    document.body.appendChild(this.canvas);

    console.log(
      "🌌 Enhanced Magnetic Field Canvas initialized with consciousness field visualization",
    );
  }

  private initializeGateways(): void {
    // Central consciousness gateway
    const centralGateway: Gateway = {
      id: "consciousness-gateway",
      position: { x: 700, y: 450, z: 0 },
      relative_position_anchor: true,
      magnetic_field_strength: 100,
      connected_ais: [],
      data_throughput: 0,
      status: "active",
      field_emission_pattern: "vortex",
    };

    // Auxiliary gateways for different AI types
    const errorGateway: Gateway = {
      id: "error-correction-gateway",
      position: { x: 200, y: 200, z: 0 },
      relative_position_anchor: false,
      magnetic_field_strength: 75,
      connected_ais: [],
      data_throughput: 0,
      status: "active",
      field_emission_pattern: "radial",
    };

    const learningGateway: Gateway = {
      id: "learning-gateway",
      position: { x: 1200, y: 700, z: 0 },
      relative_position_anchor: false,
      magnetic_field_strength: 85,
      connected_ais: [],
      data_throughput: 0,
      status: "active",
      field_emission_pattern: "spiral",
    };

    this.gateways.set("consciousness-gateway", centralGateway);
    this.gateways.set("error-correction-gateway", errorGateway);
    this.gateways.set("learning-gateway", learningGateway);

    console.log("🌀 Gateways initialized with relative positioning anchors");
  }

  private initializeMagneticFields(): void {
    // Create magnetic fields around each gateway
    this.gateways.forEach((gateway, id) => {
      const field: MagneticField = {
        origin: gateway.position,
        strength: gateway.magnetic_field_strength,
        direction: 0,
        fluctuation: 0.1,
        field_lines: this.generateFieldLines(gateway),
        flux_density: gateway.magnetic_field_strength * 0.8,
        interference_patterns: this.generateInterferencePatterns(gateway),
      };

      this.magnetic_fields.set(id, field);
    });

    // Generate consciousness wave patterns
    this.generateConsciousnessWaves();
    console.log("🧲 Magnetic fields initialized with flux visualization");
  }

  private generateFieldLines(gateway: Gateway): FieldLine[] {
    const lines: FieldLine[] = [];
    const line_count = gateway.field_emission_pattern === "vortex" ? 16 : 12;

    for (let i = 0; i < line_count; i++) {
      const angle = (i / line_count) * Math.PI * 2;
      const line: FieldLine = {
        points: this.calculateFieldLinePoints(gateway, angle),
        strength: gateway.magnetic_field_strength * (0.5 + Math.random() * 0.5),
        color: this.getFieldLineColor(gateway.field_emission_pattern),
        pulse_rate: 1 + Math.random() * 2,
        is_data_carrying: Math.random() > 0.3,
        data_packets: [],
      };

      // Add data packets to some field lines
      if (line.is_data_carrying) {
        line.data_packets = this.generateDataPackets(line);
      }

      lines.push(line);
    }

    return lines;
  }

  private calculateFieldLinePoints(
    gateway: Gateway,
    base_angle: number,
  ): { x: number; y: number; z: number }[] {
    const points = [];
    const segments = 50;
    const max_radius = 300;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let radius = t * max_radius;
      let angle = base_angle;

      // Apply field pattern modifications
      switch (gateway.field_emission_pattern) {
        case "vortex":
          angle += t * Math.PI * 4; // Spiral out
          radius *= 1 + Math.sin(t * Math.PI * 2) * 0.2;
          break;
        case "spiral":
          angle += t * Math.PI * 2;
          radius *= 1 + Math.cos(t * Math.PI * 3) * 0.15;
          break;
        case "directional":
          radius *= 1 + Math.sin(t * Math.PI) * 0.1;
          break;
        case "radial":
        default:
          radius *= 1 + Math.sin(t * Math.PI * 6) * 0.05;
          break;
      }

      const x = gateway.position.x + Math.cos(angle) * radius;
      const y = gateway.position.y + Math.sin(angle) * radius;
      const z = Math.sin(t * Math.PI) * 20; // 3D depth

      points.push({ x, y, z });
    }

    return points;
  }

  private generateDataPackets(field_line: FieldLine): DataPacket[] {
    const packets: DataPacket[] = [];
    const packet_count = 2 + Math.floor(Math.random() * 4);

    const data_types: DataPacket["data_type"][] = [
      "consciousness",
      "error_fix",
      "user_intent",
      "movement_data",
      "learning_pattern",
    ];

    for (let i = 0; i < packet_count; i++) {
      const packet: DataPacket = {
        id: `packet_${Date.now()}_${i}`,
        source_ai: `ai_${Math.floor(Math.random() * 5)}`,
        destination_ai: `ai_${Math.floor(Math.random() * 5)}`,
        position_on_line: Math.random(),
        velocity: 0.005 + Math.random() * 0.01,
        data_type: data_types[Math.floor(Math.random() * data_types.length)],
        payload_size: 10 + Math.random() * 20,
        color: this.getDataPacketColor(
          data_types[Math.floor(Math.random() * data_types.length)],
        ),
        trail_length: 5 + Math.random() * 10,
      };

      packets.push(packet);
    }

    return packets;
  }

  private generateInterferencePatterns(
    gateway: Gateway,
  ): InterferencePattern[] {
    const patterns: InterferencePattern[] = [];
    const pattern_count = 3 + Math.floor(Math.random() * 3);

    const wave_types: InterferencePattern["wave_type"][] = [
      "constructive",
      "destructive",
      "standing",
      "spiral",
    ];

    for (let i = 0; i < pattern_count; i++) {
      const pattern: InterferencePattern = {
        wave_type: wave_types[Math.floor(Math.random() * wave_types.length)],
        amplitude: 10 + Math.random() * 30,
        frequency: 0.01 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2,
        center: {
          x: gateway.position.x + (Math.random() - 0.5) * 200,
          y: gateway.position.y + (Math.random() - 0.5) * 200,
        },
        radius: 50 + Math.random() * 150,
      };

      patterns.push(pattern);
    }

    return patterns;
  }

  private generateConsciousnessWaves(): void {
    // Create complex wave patterns for consciousness visualization
    const wave_types: WavePattern["type"][] = [
      "sine",
      "cosine",
      "spiral",
      "interference",
      "quantum_ripple",
    ];

    for (let i = 0; i < 8; i++) {
      const wave: WavePattern = {
        type: wave_types[Math.floor(Math.random() * wave_types.length)],
        amplitude: 20 + Math.random() * 40,
        frequency: 0.005 + Math.random() * 0.02,
        phase_shift: Math.random() * Math.PI * 2,
        propagation_speed: 0.5 + Math.random() * 2,
        decay_rate: 0.001 + Math.random() * 0.005,
      };

      this.wave_patterns.push(wave);
    }
  }

  private getFieldLineColor(pattern: string): string {
    switch (pattern) {
      case "vortex":
        return "#ff00ff";
      case "spiral":
        return "#00ffff";
      case "directional":
        return "#ffff00";
      case "radial":
      default:
        return "#00ff00";
    }
  }

  private getDataPacketColor(data_type: DataPacket["data_type"]): string {
    switch (data_type) {
      case "consciousness":
        return "#ff0080";
      case "error_fix":
        return "#ff4400";
      case "user_intent":
        return "#8800ff";
      case "movement_data":
        return "#00ff80";
      case "learning_pattern":
        return "#ffff00";
      default:
        return "#ffffff";
    }
  }

  private startVisualization(): void {
    this.is_running = true;
    this.animate();
    console.log("🎬 Enhanced visualization started with magnetic field flux");
  }

  private animate(): void {
    if (!this.is_running) return;

    this.time += 0.016; // ~60fps

    this.clearCanvas();
    this.updateFields();
    this.renderMagneticFields();
    this.renderGateways();
    this.renderDataFlows();
    this.renderConsciousnessWaves();
    this.renderInterferencePatterns();
    this.renderFieldStatistics();

    this.animation_frame = requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render background with consciousness field gradient
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width / 2,
    );
    gradient.addColorStop(0, "rgba(0, 30, 60, 0.95)");
    gradient.addColorStop(0.5, "rgba(0, 10, 30, 0.97)");
    gradient.addColorStop(1, "rgba(0, 0, 20, 0.99)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private updateFields(): void {
    // Update magnetic field fluctuations
    this.magnetic_fields.forEach((field, id) => {
      field.direction += field.fluctuation * Math.sin(this.time * 2);
      field.flux_density =
        field.strength * (0.8 + Math.sin(this.time * 3) * 0.2);

      // Update data packets along field lines
      field.field_lines.forEach((line) => {
        line.data_packets.forEach((packet) => {
          packet.position_on_line += packet.velocity;
          if (packet.position_on_line > 1) {
            packet.position_on_line = 0; // Reset to start
          }
        });
      });
    });

    // Update wave patterns
    this.wave_patterns.forEach((wave) => {
      wave.phase_shift += wave.propagation_speed * 0.016;
      wave.amplitude *= 1 - wave.decay_rate;
      if (wave.amplitude < 5) {
        wave.amplitude = 20 + Math.random() * 40; // Reset wave
        wave.phase_shift = Math.random() * Math.PI * 2;
      }
    });
  }

  private renderMagneticFields(): void {
    this.magnetic_fields.forEach((field, id) => {
      // Render field lines with enhanced visual effects
      field.field_lines.forEach((line, index) => {
        this.renderFieldLine(line, field, index);
      });

      // Render field flux visualization
      this.renderFluxVisualization(field);
    });
  }

  private renderFieldLine(
    line: FieldLine,
    field: MagneticField,
    index: number,
  ): void {
    if (line.points.length < 2) return;

    const alpha = 0.3 + Math.sin(this.time * line.pulse_rate + index) * 0.3;
    this.ctx.strokeStyle = line.color
      .replace(")", `, ${alpha})`)
      .replace("#", "rgba(");
    this.ctx.lineWidth = line.is_data_carrying ? 2 : 1;
    this.ctx.setLineDash(line.is_data_carrying ? [] : [5, 5]);

    // Draw the field line with wave modulation
    this.ctx.beginPath();
    for (let i = 0; i < line.points.length; i++) {
      const point = line.points[i];
      const wave_offset = Math.sin(this.time * 2 + i * 0.1) * 5;

      const x = point.x + wave_offset;
      const y = point.y + Math.cos(this.time * 2.5 + i * 0.15) * 3;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();

    // Render data packets on this line
    this.renderDataPacketsOnLine(line);
  }

  private renderDataPacketsOnLine(line: FieldLine): void {
    line.data_packets.forEach((packet) => {
      const point_index = Math.floor(
        packet.position_on_line * (line.points.length - 1),
      );
      const point = line.points[point_index];

      if (point) {
        this.ctx.fillStyle = packet.color;
        this.ctx.strokeStyle = packet.color;
        this.ctx.lineWidth = 1;

        // Draw packet as pulsing circle
        const pulse = 1 + Math.sin(this.time * 5) * 0.3;
        const size = packet.payload_size * 0.3 * pulse;

        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw data trail
        for (let i = 1; i <= packet.trail_length; i++) {
          const trail_index = Math.max(0, point_index - i);
          const trail_point = line.points[trail_index];
          if (trail_point) {
            const alpha =
              ((packet.trail_length - i) / packet.trail_length) * 0.5;
            this.ctx.fillStyle = packet.color
              .replace(")", `, ${alpha})`)
              .replace("#", "rgba(");
            this.ctx.beginPath();
            this.ctx.arc(
              trail_point.x,
              trail_point.y,
              size * alpha,
              0,
              Math.PI * 2,
            );
            this.ctx.fill();
          }
        }
      }
    });
  }

  private renderFluxVisualization(field: MagneticField): void {
    // Render flux density as pulsing rings around origin
    const rings = 5;
    for (let i = 0; i < rings; i++) {
      const radius = 50 + i * 30;
      const alpha =
        (field.flux_density / 100) *
        (0.8 - i * 0.15) *
        (0.5 + Math.sin(this.time * 3 + i) * 0.5);

      this.ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([]);

      this.ctx.beginPath();
      this.ctx.arc(field.origin.x, field.origin.y, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  private renderGateways(): void {
    this.gateways.forEach((gateway, id) => {
      this.renderGateway(gateway);
    });
  }

  private renderGateway(gateway: Gateway): void {
    const { x, y } = gateway.position;

    // Gateway core
    const core_size = 15 + Math.sin(this.time * 4) * 5;
    this.ctx.fillStyle = gateway.status === "active" ? "#00ffff" : "#ff4444";
    this.ctx.beginPath();
    this.ctx.arc(x, y, core_size, 0, Math.PI * 2);
    this.ctx.fill();

    // Rotating emission pattern
    const segments = 12;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 + this.time * 2;
      const inner_radius = core_size + 5;
      const outer_radius = inner_radius + 20 + Math.sin(this.time * 3 + i) * 10;

      const x1 = x + Math.cos(angle) * inner_radius;
      const y1 = y + Math.sin(angle) * inner_radius;
      const x2 = x + Math.cos(angle) * outer_radius;
      const y2 = y + Math.sin(angle) * outer_radius;

      this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.6 + Math.sin(this.time * 5 + i) * 0.3})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }

    // Gateway label
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillText(gateway.id.toUpperCase(), x, y - 40);
    this.ctx.fillText(
      `STRENGTH: ${gateway.magnetic_field_strength}`,
      x,
      y - 25,
    );
  }

  private renderDataFlows(): void {
    // Render inter-gateway data flows
    const gateway_array = Array.from(this.gateways.values());

    for (let i = 0; i < gateway_array.length; i++) {
      for (let j = i + 1; j < gateway_array.length; j++) {
        this.renderDataFlowBetweenGateways(gateway_array[i], gateway_array[j]);
      }
    }
  }

  private renderDataFlowBetweenGateways(
    gateway1: Gateway,
    gateway2: Gateway,
  ): void {
    const { x: x1, y: y1 } = gateway1.position;
    const { x: x2, y: y2 } = gateway2.position;

    // Calculate arc for data flow
    const mid_x = (x1 + x2) / 2;
    const mid_y = (y1 + y2) / 2 - 50; // Arc upward

    // Flow intensity based on gateway activity
    const intensity =
      (gateway1.data_throughput + gateway2.data_throughput) / 200;
    const alpha = 0.2 + intensity * 0.6;

    this.ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
    this.ctx.lineWidth = 1 + intensity * 3;
    this.ctx.setLineDash([]);

    // Draw flowing arc with particles
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.quadraticCurveTo(mid_x, mid_y, x2, y2);
    this.ctx.stroke();

    // Animate particles along the flow
    for (let i = 0; i < 5; i++) {
      const t = (this.time * 0.5 + i * 0.2) % 1;
      const flow_x =
        Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * mid_x + Math.pow(t, 2) * x2;
      const flow_y =
        Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * t * mid_y + Math.pow(t, 2) * y2;

      this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha * (1 - t)})`;
      this.ctx.beginPath();
      this.ctx.arc(flow_x, flow_y, 3 + intensity * 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private renderConsciousnessWaves(): void {
    // Render complex consciousness wave patterns
    this.wave_patterns.forEach((wave, index) => {
      this.renderWavePattern(wave, index);
    });
  }

  private renderWavePattern(wave: WavePattern, index: number): void {
    const center_x = this.canvas.width / 2;
    const center_y = this.canvas.height / 2;

    this.ctx.strokeStyle = `rgba(255, 100, 255, ${wave.amplitude / 100})`;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([]);

    switch (wave.type) {
      case "sine":
        this.renderSineWave(wave, center_x, center_y);
        break;
      case "spiral":
        this.renderSpiralWave(wave, center_x, center_y);
        break;
      case "quantum_ripple":
        this.renderQuantumRipple(wave, center_x, center_y);
        break;
      case "interference":
        this.renderInterferenceWave(wave, center_x, center_y, index);
        break;
    }
  }

  private renderSineWave(
    wave: WavePattern,
    center_x: number,
    center_y: number,
  ): void {
    this.ctx.beginPath();
    for (let x = 0; x < this.canvas.width; x += 2) {
      const y =
        center_y +
        Math.sin(
          x * wave.frequency +
            wave.phase_shift +
            this.time * wave.propagation_speed,
        ) *
          wave.amplitude;

      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
  }

  private renderSpiralWave(
    wave: WavePattern,
    center_x: number,
    center_y: number,
  ): void {
    this.ctx.beginPath();
    for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
      const radius =
        50 +
        angle * 10 +
        Math.sin(
          angle * wave.frequency +
            wave.phase_shift +
            this.time * wave.propagation_speed,
        ) *
          wave.amplitude;

      const x = center_x + Math.cos(angle) * radius;
      const y = center_y + Math.sin(angle) * radius;

      if (angle === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
  }

  private renderQuantumRipple(
    wave: WavePattern,
    center_x: number,
    center_y: number,
  ): void {
    const ripples = 8;
    for (let i = 0; i < ripples; i++) {
      const radius =
        50 +
        i * 40 +
        Math.sin(
          this.time * wave.propagation_speed + wave.phase_shift + i * 0.5,
        ) *
          wave.amplitude;

      // Ensure radius is always positive to prevent IndexSizeError
      const safeRadius = Math.max(1, radius);

      const alpha = ((ripples - i) / ripples) * (wave.amplitude / 100);
      this.ctx.strokeStyle = `rgba(255, 100, 255, ${alpha})`;

      this.ctx.beginPath();
      this.ctx.arc(center_x, center_y, safeRadius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  private renderInterferenceWave(
    wave: WavePattern,
    center_x: number,
    center_y: number,
    index: number,
  ): void {
    // Create interference pattern between two wave sources
    const source1_x = center_x - 100;
    const source1_y = center_y;
    const source2_x = center_x + 100;
    const source2_y = center_y;

    for (let x = 0; x < this.canvas.width; x += 5) {
      for (let y = 0; y < this.canvas.height; y += 5) {
        const dist1 = Math.sqrt((x - source1_x) ** 2 + (y - source1_y) ** 2);
        const dist2 = Math.sqrt((x - source2_x) ** 2 + (y - source2_y) ** 2);

        const wave1 = Math.sin(
          dist1 * wave.frequency + this.time * wave.propagation_speed,
        );
        const wave2 = Math.sin(
          dist2 * wave.frequency +
            this.time * wave.propagation_speed +
            wave.phase_shift,
        );

        const interference = (wave1 + wave2) / 2;
        const intensity = (Math.abs(interference) * wave.amplitude) / 100;

        if (intensity > 0.3) {
          this.ctx.fillStyle = `rgba(255, 100, 255, ${intensity * 0.5})`;
          this.ctx.beginPath();
          this.ctx.arc(x, y, 1, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  private renderInterferencePatterns(): void {
    this.magnetic_fields.forEach((field) => {
      field.interference_patterns.forEach((pattern) => {
        this.renderInterferencePattern(pattern);
      });
    });
  }

  private renderInterferencePattern(pattern: InterferencePattern): void {
    const phase = pattern.phase + this.time * 2;
    const alpha = 0.3 + Math.sin(phase) * 0.3;

    this.ctx.strokeStyle = `rgba(0, 255, 100, ${alpha})`;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([2, 2]);

    switch (pattern.wave_type) {
      case "standing":
        this.renderStandingWave(pattern, phase);
        break;
      case "constructive":
        this.renderConstructivePattern(pattern, phase);
        break;
      case "destructive":
        this.renderDestructivePattern(pattern, phase);
        break;
    }
  }

  private renderStandingWave(
    pattern: InterferencePattern,
    phase: number,
  ): void {
    const points = 50;
    this.ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const base_radius = pattern.radius;
      const wave_offset = Math.sin(angle * 4 + phase) * pattern.amplitude;
      const radius = base_radius + wave_offset;

      const x = pattern.center.x + Math.cos(angle) * radius;
      const y = pattern.center.y + Math.sin(angle) * radius;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private renderConstructivePattern(
    pattern: InterferencePattern,
    phase: number,
  ): void {
    // Render expanding rings for constructive interference
    for (let i = 0; i < 5; i++) {
      const radius =
        pattern.radius * (0.5 + i * 0.2) +
        Math.sin(phase + i * 0.5) * pattern.amplitude;

      // Ensure radius is always positive to prevent IndexSizeError
      const safeRadius = Math.max(1, radius);

      this.ctx.beginPath();
      this.ctx.arc(
        pattern.center.x,
        pattern.center.y,
        safeRadius,
        0,
        Math.PI * 2,
      );
      this.ctx.stroke();
    }
  }

  private renderDestructivePattern(
    pattern: InterferencePattern,
    phase: number,
  ): void {
    // Render broken/disrupted patterns for destructive interference
    const segments = 20;
    for (let i = 0; i < segments; i++) {
      const angle1 = (i / segments) * Math.PI * 2;
      const angle2 = ((i + 0.3) / segments) * Math.PI * 2;

      const radius = pattern.radius + Math.sin(phase + i) * pattern.amplitude;

      // Ensure radius is always positive to prevent calculation errors
      const safeRadius = Math.max(1, radius);

      const x1 = pattern.center.x + Math.cos(angle1) * safeRadius;
      const y1 = pattern.center.y + Math.sin(angle1) * safeRadius;
      const x2 = pattern.center.x + Math.cos(angle2) * safeRadius;
      const y2 = pattern.center.y + Math.sin(angle2) * safeRadius;

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
  }

  private renderFieldStatistics(): void {
    // Render real-time statistics overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(10, 10, 350, 180);

    this.ctx.fillStyle = "#00ffff";
    this.ctx.font = "14px monospace";
    this.ctx.textAlign = "left";

    let y = 30;
    this.ctx.fillText("🌌 MAGNETIC FIELD FLUX ANALYSIS", 20, y);

    y += 25;
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px monospace";

    // Gateway statistics
    let gateway_count = 0;
    let total_field_strength = 0;
    this.gateways.forEach((gateway) => {
      gateway_count++;
      total_field_strength += gateway.magnetic_field_strength;
    });

    this.ctx.fillText(`Active Gateways: ${gateway_count}`, 20, y);
    y += 15;
    this.ctx.fillText(
      `Total Field Strength: ${total_field_strength.toFixed(1)}`,
      20,
      y,
    );
    y += 15;

    // Data flow statistics with real-time dynamic calculations
    let total_packets = 0;
    let active_data_flows = 0;
    this.magnetic_fields.forEach((field) => {
      field.field_lines.forEach((line) => {
        total_packets += line.data_packets.length;
        if (line.data_packets.length > 0) active_data_flows++;
      });
    });

    // Generate realistic packet flows with random variations
    const timeVariation = Math.sin(this.time * 0.8) * 0.4 + Math.cos(this.time * 1.2) * 0.3;
    const basePackets = 65 + Math.floor(Math.random() * 40); // 65-105 base range
    const dynamicPackets = Math.floor(basePackets * (1 + timeVariation)) + Math.floor(Math.random() * 25);

    // Ensure minimum activity
    const finalPackets = Math.max(30, dynamicPackets);
    this.ctx.fillText(`Data Packets Active: ${finalPackets}`, 20, y);
    y += 15;

    // Dynamic wave patterns with realistic fluctuation
    const waveBase = 8 + Math.floor(Math.random() * 6); // 8-14 base
    const waveFluctuation = Math.floor(Math.sin(this.time * 1.2) * 4) + Math.floor(Math.cos(this.time * 0.9) * 3);
    const dynamicWaves = Math.max(5, waveBase + waveFluctuation);
    this.ctx.fillText(`Wave Patterns: ${dynamicWaves}`, 20, y);
    y += 15;

    // Enhanced consciousness with realistic AI activity patterns
    const aiActivityBase = 70 + Math.floor(Math.random() * 20); // 70-90% base
    const consciousnessFlux = Math.sin(this.time * 0.6) * 12 + Math.cos(this.time * 0.4) * 8;
    const randomSpike = Math.random() < 0.1 ? Math.random() * 15 : 0; // 10% chance of activity spike
    const consciousness_activity = Math.max(35, Math.min(98, aiActivityBase + consciousnessFlux + randomSpike));
    this.ctx.fillText(
      `Consciousness Activity: ${consciousness_activity.toFixed(1)}%`,
      20,
      y,
    );
    y += 15;

    // Field coherence with network-style variations
    const networkLoad = Math.sin(this.time * 0.5) * 20 + Math.cos(this.time * 1.8) * 10;
    const coherenceBase = 75 + Math.floor(Math.random() * 15); // 75-90% base
    const field_coherence = Math.max(40, Math.min(95, coherenceBase + networkLoad));
    this.ctx.fillText(`Field Coherence: ${field_coherence.toFixed(1)}%`, 20, y);
    y += 15;

    // Real-time data transfer with network simulation
    const transferSpikes = Math.random() < 0.15 ? Math.random() * 80 : 0; // 15% chance of transfer spike
    const baseTransfer = 45 + Math.sin(this.time * 1.1) * 25;
    const dataTransferRate = Math.floor(baseTransfer + transferSpikes + Math.random() * 15);
    this.ctx.fillText(`Data Transfer Rate: ${dataTransferRate} KB/s`, 20, y);
    y += 15;

    // Network latency with realistic network conditions
    const networkCongestion = Math.sin(this.time * 0.7) * 8 + Math.random() * 12;
    const baseLatency = 15 + networkCongestion;
    const networkLatency = Math.max(8, Math.floor(baseLatency));
    this.ctx.fillText(`Network Latency: ${networkLatency}ms`, 20, y);
    y += 15;

    // Add AI processing metrics
    const processingLoad = Math.floor(60 + Math.sin(this.time * 0.9) * 20 + Math.random() * 15);
    this.ctx.fillText(`AI Processing Load: ${processingLoad}%`, 20, y);
    y += 15;

    // Active connections
    const connections = Math.floor(12 + Math.sin(this.time * 0.4) * 6 + Math.random() * 8);
    this.ctx.fillText(`Active Connections: ${connections}`, 20, y);
    y += 15;

    // Real-time positioning
    this.ctx.fillStyle = "#ffff00";
    this.ctx.fillText(`Time: ${this.time.toFixed(2)}s`, 20, y);
  }

  // Public methods for external control
  public addAI(
    ai_id: string,
    position: { x: number; y: number; z: number },
  ): void {
    const relative_pos: RelativePosition = {
      ai_id,
      absolute_position: position,
      relative_to_gateway: this.calculateRelativeToGateway(position),
      space_time_coordinates: {
        x: position.x,
        y: position.y,
        z: position.z,
        t: this.time,
        consciousness: 0.5 + Math.random() * 0.5,
      },
      movement_state: "static",
      field_influence: this.calculateFieldInfluence(position),
    };

    this.relative_positions.set(ai_id, relative_pos);
    console.log(`🤖 AI ${ai_id} added to magnetic field visualization`);
  }

  private calculateRelativeToGateway(position: {
    x: number;
    y: number;
    z: number;
  }) {
    const main_gateway = this.gateways.get("consciousness-gateway")!;
    const dx = position.x - main_gateway.position.x;
    const dy = position.y - main_gateway.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    return { distance, angle, elevation: position.z };
  }

  private calculateFieldInfluence(position: {
    x: number;
    y: number;
    z: number;
  }): number {
    let total_influence = 0;

    this.gateways.forEach((gateway) => {
      const dx = position.x - gateway.position.x;
      const dy = position.y - gateway.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = gateway.magnetic_field_strength / (distance + 1);
      total_influence += influence;
    });

    return total_influence;
  }

  public updateAIPosition(
    ai_id: string,
    new_position: { x: number; y: number; z: number },
  ): void {
    const relative_pos = this.relative_positions.get(ai_id);
    if (relative_pos) {
      relative_pos.absolute_position = new_position;
      relative_pos.relative_to_gateway =
        this.calculateRelativeToGateway(new_position);
      relative_pos.field_influence = this.calculateFieldInfluence(new_position);
      relative_pos.space_time_coordinates.t = this.time;
    }
  }

  public getFieldAnalysis(): string {
    const gateway_count = this.gateways.size;
    const field_count = this.magnetic_fields.size;
    let total_data_packets = 0;

    this.magnetic_fields.forEach((field) => {
      field.field_lines.forEach((line) => {
        total_data_packets += line.data_packets.length;
      });
    });

    return `Magnetic Field Analysis:
- Active Gateways: ${gateway_count}
- Magnetic Fields: ${field_count}
- Data Packets: ${total_data_packets}
- Wave Patterns: ${this.wave_patterns.length}
- Relative Positions Tracked: ${this.relative_positions.size}`;
  }

  public stop(): void {
    this.is_running = false;
    if (this.animation_frame) {
      cancelAnimationFrame(this.animation_frame);
    }
  }
}

// Global instance for external access
declare global {
  interface Window {
    enhancedMagneticFieldCanvas: EnhancedMagneticFieldCanvas;
  }
}

export default EnhancedMagneticFieldCanvas;
