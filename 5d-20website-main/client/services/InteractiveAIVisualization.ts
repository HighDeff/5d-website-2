interface AIVisualizationState {
  id: string;
  timestamp: Date;
  view_mode: "3d" | "5d" | "overlay" | "height_perspective";
  ai_entities: Map<string, VisualAIEntity>;
  user_interactions: UserInteraction[];
  drag_operations: DragOperation[];
  observation_points: ObservationPoint[];
  maze_visualizations: MazeVisualization[];
  traffic_flows: TrafficFlow[];
  positioning_grid: PositioningGrid;
  interactive_controls: InteractiveControl[];
}

interface VisualAIEntity {
  id: string;
  ai_type: string;
  visual_representation: VisualRepresentation;
  position_3d: Position3D;
  position_5d: Position5D;
  movement_trail: MovementTrail;
  interaction_radius: number;
  drag_handle: DragHandle;
  status_indicators: StatusIndicator[];
  connection_lines: ConnectionLine[];
  task_visualization: TaskVisualization;
  reasoning_indicators: ReasoningIndicator[];
}

interface VisualRepresentation {
  shape: "sphere" | "cube" | "pyramid" | "custom";
  size: { width: number; height: number; depth: number };
  color: { r: number; g: number; b: number; a: number };
  texture: string;
  animation: AnimationState;
  glow_effect: GlowEffect;
  particle_system: ParticleSystem;
  holographic_display: HolographicDisplay;
}

interface Position3D {
  x: number;
  y: number;
  z: number;
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

interface Position5D {
  x: number;
  y: number;
  z: number;
  time: number;
  consciousness: number;
  temporal_velocity: number;
  consciousness_gradient: number;
}

interface MovementTrail {
  enabled: boolean;
  trail_points: TrailPoint[];
  max_points: number;
  fade_duration: number;
  color_gradient: ColorGradient;
  particle_trail: boolean;
}

interface TrailPoint {
  position: Position3D;
  timestamp: Date;
  velocity: { x: number; y: number; z: number };
  opacity: number;
  size: number;
}

interface DragHandle {
  visible: boolean;
  position: Position3D;
  size: number;
  color: { r: number; g: number; b: number; a: number };
  hover_state: boolean;
  drag_state: boolean;
  constraints: DragConstraint[];
}

interface DragConstraint {
  type: "boundary" | "axis" | "distance" | "collision";
  parameters: any;
  enforcement_level: "strict" | "soft" | "advisory";
}

interface UserInteraction {
  id: string;
  type: "drag" | "click" | "hover" | "gesture" | "voice";
  timestamp: Date;
  ai_target: string;
  interaction_data: any;
  success: boolean;
  response_data: any;
}

interface DragOperation {
  id: string;
  ai_id: string;
  start_position: Position3D;
  current_position: Position3D;
  target_position: Position3D;
  drag_vector: { x: number; y: number; z: number };
  drag_speed: number;
  constraints_applied: DragConstraint[];
  collision_detection: CollisionDetection;
  snap_targets: SnapTarget[];
  automatic_routing: AutomaticRouting;
}

interface ObservationPoint {
  id: string;
  type: "central_tower" | "observer_ai" | "watcher_ai" | "user_camera";
  position: Position3D;
  height: number;
  field_of_view: FieldOfView;
  observation_range: number;
  observed_entities: string[];
  analysis_data: ObservationAnalysis;
  viewing_perspective: ViewingPerspective;
}

interface FieldOfView {
  horizontal_angle: number;
  vertical_angle: number;
  near_distance: number;
  far_distance: number;
  focus_point: Position3D;
}

interface ViewingPerspective {
  camera_type: "fixed" | "follow" | "orbit" | "free";
  target: string | null;
  zoom_level: number;
  rotation_speed: number;
  smooth_transitions: boolean;
}

interface MazeVisualization {
  id: string;
  ai_id: string;
  maze_projection: MazeProjection;
  obstacle_visualization: ObstacleVisualization[];
  path_options: PathVisualization[];
  traffic_indicators: TrafficIndicator[];
  route_optimization: RouteOptimization;
}

interface MazeProjection {
  projection_area: { width: number; height: number; depth: number };
  grid_resolution: number;
  obstacle_map: ObstacleMap3D;
  path_grid: PathGrid3D;
  visual_effects: VisualEffect[];
}

interface ObstacleVisualization {
  obstacle_id: string;
  position: Position3D;
  shape: ObstacleShape;
  danger_level: "low" | "medium" | "high" | "critical";
  avoidance_radius: number;
  visual_representation: VisualRepresentation;
  temporal_state: "static" | "moving" | "appearing" | "disappearing";
}

interface PathVisualization {
  path_id: string;
  waypoints: Position3D[];
  path_type: "optimal" | "alternative" | "emergency" | "scenic";
  difficulty_rating: number;
  visual_style: PathVisualStyle;
  animation: PathAnimation;
  traffic_density: number;
}

interface TrafficIndicator {
  id: string;
  position: Position3D;
  traffic_type: "incoming" | "outgoing" | "crossing" | "congestion";
  intensity: number;
  direction: { x: number; y: number; z: number };
  prediction: TrafficPrediction;
  avoidance_suggestion: AvoidanceSuggestion;
}

interface InteractiveControl {
  id: string;
  type: "button" | "slider" | "joystick" | "gesture_zone" | "voice_command";
  position: Position3D;
  size: { width: number; height: number };
  function: string;
  parameters: any;
  visual_state: ControlVisualState;
  interaction_feedback: InteractionFeedback;
}

interface PositioningGrid {
  enabled: boolean;
  grid_size: { x: number; y: number; z: number };
  snap_to_grid: boolean;
  grid_visual: GridVisual;
  coordinate_display: boolean;
  measurement_tools: MeasurementTool[];
}

export class InteractiveAIVisualization {
  private state: AIVisualizationState;
  private canvas3D: HTMLCanvasElement;
  private context3D: CanvasRenderingContext2D | null;
  private isRunning: boolean = false;
  private isRenderingActive: boolean = false;
  private renderLoop: NodeJS.Timeout | null = null;
  private dragState: DragState = { active: false, target: null };
  private cameraControls: CameraControls;
  private interactionHandler: InteractionHandler;

  constructor() {
    this.state = this.initializeVisualizationState();
    this.canvas3D = this.create3DCanvas();
    this.context3D = this.canvas3D.getContext("2d");
    this.cameraControls = new CameraControls();
    this.interactionHandler = new InteractionHandler();

    this.initializeVisualization();
    this.setupUserInteractions();
    this.startRenderLoop();
  }

  private initializeVisualizationState(): AIVisualizationState {
    return {
      id: `ai_viz_${Date.now()}`,
      timestamp: new Date(),
      view_mode: "3d",
      ai_entities: new Map(),
      user_interactions: [],
      drag_operations: [],
      observation_points: [],
      maze_visualizations: [],
      traffic_flows: [],
      positioning_grid: {
        enabled: true,
        grid_size: { x: 50, y: 50, z: 50 },
        snap_to_grid: true,
        grid_visual: {
          line_color: { r: 100, g: 100, b: 100, a: 0.3 },
          line_width: 1,
          major_grid_interval: 5,
          axis_colors: {
            x: { r: 255, g: 0, b: 0, a: 0.7 },
            y: { r: 0, g: 255, b: 0, a: 0.7 },
            z: { r: 0, g: 0, b: 255, a: 0.7 },
          },
        },
        coordinate_display: true,
        measurement_tools: [],
      },
      interactive_controls: [],
    };
  }

  private create3DCanvas(): HTMLCanvasElement {
    console.log("🎨 Creating AI Visualization Canvas...");

    const canvas = document.createElement("canvas");
    canvas.id = "ai-visualization-canvas";
    canvas.width = 1200;
    canvas.height = 800;
    canvas.style.position = "fixed";
    canvas.style.top = "20px";
    canvas.style.left = "20px";
    canvas.style.zIndex = "9999";
    canvas.style.border = "3px solid #00ffff";
    canvas.style.borderRadius = "12px";
    canvas.style.background = "rgba(0, 0, 20, 0.95)";
    canvas.style.backdropFilter = "blur(10px)";
    canvas.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.5)";
    canvas.style.display = "block";

    document.body.appendChild(canvas);
    console.log("✅ Canvas added to DOM");

    // Create test control panel
    this.createTestControlPanel();

    // Draw immediate test pattern to show canvas is working
    this.drawInitialTestPattern(canvas);

    return canvas;
  }

  private drawInitialTestPattern(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log("🎨 Drawing initial test pattern...");

    // Clear with dark background
    ctx.fillStyle = "rgba(0, 0, 40, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Draw center text
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "AI VISUALIZATION SYSTEM",
      canvas.width / 2,
      canvas.height / 2,
    );

    // Draw subtitle
    ctx.font = "18px Arial";
    ctx.fillStyle = "#00ffff";
    ctx.fillText(
      "Click 'CREATE AIs' button to start",
      canvas.width / 2,
      canvas.height / 2 + 50,
    );

    console.log("✅ Initial test pattern drawn");
  }

  private createTestControlPanel(): void {
    const controlPanel = document.createElement("div");
    controlPanel.id = "ai-viz-test-controls";
    controlPanel.style.position = "fixed";
    controlPanel.style.top = "830px";
    controlPanel.style.left = "20px";
    controlPanel.style.zIndex = "10000";
    controlPanel.style.background = "rgba(0, 0, 20, 0.95)";
    controlPanel.style.border = "2px solid #00ffff";
    controlPanel.style.borderRadius = "8px";
    controlPanel.style.padding = "10px";
    controlPanel.style.fontFamily = "monospace";
    controlPanel.style.color = "#00ffff";
    controlPanel.style.fontSize = "12px";

    controlPanel.innerHTML = `
      <div style="margin-bottom: 8px; font-weight: bold; color: #00ffff;">🎮 LIVE AI VISUALIZATION SYSTEM</div>

      <!-- Test Controls -->
      <div style="display: flex; gap: 4px; margin-bottom: 6px;">
        <button id="test-canvas-viz" style="background: #ff0000; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">🧪 TEST</button>
        <button id="create-test-ais" style="background: #00ff00; color: black; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">🤖 CREATE AIs</button>
        <button id="clear-canvas-viz" style="background: #ffff00; color: black; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">🧹 CLEAR</button>
        <button id="start-movement" style="background: #ff8800; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">▶️ MOVE</button>
      </div>

      <!-- View Mode Controls -->
      <div style="margin-bottom: 4px; font-size: 10px; color: #88ffff;">🎥 View Mode:</div>
      <div style="display: flex; gap: 3px; margin-bottom: 6px;">
        <button id="view-3d" style="background: #4444ff; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">3D</button>
        <button id="view-5d" style="background: #ff4444; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">5D</button>
        <button id="view-overlay" style="background: #44ff44; color: black; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">OVERLAY</button>
        <button id="view-height" style="background: #ff44ff; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">HEIGHT</button>
      </div>

      <!-- Live Sliders -->
      <div style="margin-bottom: 4px; font-size: 10px; color: #88ffff;">🎚️ Live Controls:</div>
      <div style="margin-bottom: 6px; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 4px;">
        <div style="margin-bottom: 3px;">
          <label style="font-size: 9px; color: #aaffff;">Zoom: <span id="zoom-value">1.0</span></label>
          <input type="range" id="zoom-slider" min="0.1" max="5.0" step="0.1" value="1.0" style="width: 100%; height: 15px;">
        </div>
        <div style="margin-bottom: 3px;">
          <label style="font-size: 9px; color: #aaffff;">Speed: <span id="speed-value">1.0</span></label>
          <input type="range" id="speed-slider" min="0.1" max="5.0" step="0.1" value="1.0" style="width: 100%; height: 15px;">
        </div>
        <div style="margin-bottom: 3px;">
          <label style="font-size: 9px; color: #aaffff;">Rotate-X: <span id="rotx-value">0</span></label>
          <input type="range" id="rotation-x" min="-180" max="180" step="5" value="0" style="width: 100%; height: 15px;">
        </div>
        <div>
          <label style="font-size: 9px; color: #aaffff;">Rotate-Y: <span id="roty-value">0</span></label>
          <input type="range" id="rotation-y" min="-180" max="180" step="5" value="0" style="width: 100%; height: 15px;">
        </div>
      </div>

      <!-- Camera Controls -->
      <div style="margin-bottom: 4px; font-size: 10px; color: #88ffff;">📷 Camera:</div>
      <div style="display: flex; gap: 3px; margin-bottom: 6px;">
        <button id="camera-orbit" style="background: #8844ff; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 9px;">ORBIT</button>
        <button id="camera-follow" style="background: #ff8844; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 9px;">FOLLOW</button>
        <button id="camera-free" style="background: #44ff88; color: black; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 9px;">FREE</button>
        <button id="camera-reset" style="background: #888888; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 9px;">RESET</button>
      </div>

      <!-- Toggle Features -->
      <div style="margin-bottom: 4px; font-size: 10px; color: #88ffff;">⚡ Features:</div>
      <div style="display: flex; gap: 2px; margin-bottom: 6px; flex-wrap: wrap;">
        <button id="toggle-grid" style="background: #00ff00; color: black; border: none; padding: 2px 4px; border-radius: 3px; cursor: pointer; font-size: 8px;">GRID</button>
        <button id="toggle-trails" style="background: #00ff00; color: black; border: none; padding: 2px 4px; border-radius: 3px; cursor: pointer; font-size: 8px;">TRAILS</button>
        <button id="toggle-glow" style="background: #00ff00; color: black; border: none; padding: 2px 4px; border-radius: 3px; cursor: pointer; font-size: 8px;">GLOW</button>
        <button id="toggle-connections" style="background: #00ff00; color: black; border: none; padding: 2px 4px; border-radius: 3px; cursor: pointer; font-size: 8px;">CONNECT</button>
        <button id="toggle-labels" style="background: #00ff00; color: black; border: none; padding: 2px 4px; border-radius: 3px; cursor: pointer; font-size: 8px;">LABELS</button>
        <button id="toggle-physics" style="background: #00ff00; color: black; border: none; padding: 2px 4px; border-radius: 3px; cursor: pointer; font-size: 8px;">PHYSICS</button>
      </div>

      <!-- Live Status -->
      <div id="viz-debug-info" style="font-size: 9px; color: #88ffff; border-top: 1px solid #004444; padding-top: 4px; background: rgba(0,0,0,0.5); border-radius: 3px; padding: 4px;">
        <div>🎯 Canvas: <span id="canvas-status">❌</span> | AIs: <span id="ai-count">0</span> | Render: <span id="render-status">❌</span></div>
        <div>🎥 View: <span id="current-view">3D</span> | 📷 Camera: <span id="camera-mode">FREE</span> | 🔥 FPS: <span id="fps-counter">0</span></div>
        <div>���� Mouse: <span id="mouse-pos">0,0</span> | 🎮 Zoom: <span id="current-zoom">1.0x</span></div>
      </div>
    `;

    document.body.appendChild(controlPanel);

    // Add event listeners with delay to ensure DOM is ready
    // Attach event listeners after DOM is ready
    setTimeout(() => {
      this.attachEventListeners();
    }, 100);

    // Update debug info
    this.updateDebugInfo();
  }

  private attachEventListeners(): void {
    try {
      console.log("🎮 Attaching event listeners to control panel...");

      // Add event listeners for test controls
      const testButton = document.getElementById("test-canvas-viz");
      const createButton = document.getElementById("create-test-ais");
      const clearButton = document.getElementById("clear-canvas-viz");

      if (testButton) {
        testButton.addEventListener("click", () => this.testCanvasRender());
        console.log("✅ Test button listener attached");
      } else {
        console.warn("❌ Test button not found");
      }

      if (createButton) {
        createButton.addEventListener("click", () => {
          console.log("���� CREATE AIs BUTTON CLICKED!");
          alert("🤖 CREATE AIs BUTTON CLICKED! Creating test AI entities...");

          // Flash the button
          createButton.style.background = "#ffffff";
          createButton.style.color = "#000000";
          setTimeout(() => {
            createButton.style.background = "#00ff00";
            createButton.style.color = "#000000";
          }, 200);

          this.createTestAIEntities();
        });
        console.log("✅ Create button listener attached");
      } else {
        console.warn("❌ Create button not found");
      }

      if (clearButton) {
        clearButton.addEventListener("click", () => this.clearCanvas());
        console.log("✅ Clear button listener attached");
      } else {
        console.warn("❌ Clear button not found");
      }

      // Add movement control
      const startMovementBtn = document.getElementById("start-movement");
      if (startMovementBtn) {
        startMovementBtn.addEventListener("click", () =>
          this.startAIMovement(),
        );
        console.log("✅ Movement button listener attached");
      }

      // Add live slider controls
      const zoomSlider = document.getElementById("zoom-slider");
      if (zoomSlider) {
        zoomSlider.addEventListener("input", (e) =>
          this.handleZoomChange((e.target as HTMLInputElement).value),
        );
        console.log("✅ Zoom slider listener attached");
      }

      const speedSlider = document.getElementById("speed-slider");
      if (speedSlider) {
        speedSlider.addEventListener("input", (e) =>
          this.handleSpeedChange((e.target as HTMLInputElement).value),
        );
        console.log("✅ Speed slider listener attached");
      }

      const rotationXSlider = document.getElementById("rotation-x");
      if (rotationXSlider) {
        rotationXSlider.addEventListener("input", (e) =>
          this.handleRotationX((e.target as HTMLInputElement).value),
        );
        console.log("✅ Rotation-X slider listener attached");
      }

      const rotationYSlider = document.getElementById("rotation-y");
      if (rotationYSlider) {
        rotationYSlider.addEventListener("input", (e) =>
          this.handleRotationY((e.target as HTMLInputElement).value),
        );
        console.log("✅ Rotation-Y slider listener attached");
      }

      // Add view mode controls
      const view3DBtn = document.getElementById("view-3d");
      if (view3DBtn) {
        view3DBtn.addEventListener("click", () => this.setViewMode("3d"));
        console.log("✅ 3D view button listener attached");
      }

      const view5DBtn = document.getElementById("view-5d");
      if (view5DBtn) {
        view5DBtn.addEventListener("click", () => this.setViewMode("5d"));
        console.log("✅ 5D view button listener attached");
      }

      const viewOverlayBtn = document.getElementById("view-overlay");
      if (viewOverlayBtn) {
        viewOverlayBtn.addEventListener("click", () =>
          this.setViewMode("overlay"),
        );
        console.log("✅ Overlay view button listener attached");
      }

      const viewHeightBtn = document.getElementById("view-height");
      if (viewHeightBtn) {
        viewHeightBtn.addEventListener("click", () =>
          this.setViewMode("height_perspective"),
        );
        console.log("✅ Height view button listener attached");
      }

      // Add camera controls
      const cameraOrbitBtn = document.getElementById("camera-orbit");
      if (cameraOrbitBtn) {
        cameraOrbitBtn.addEventListener("click", () =>
          this.setCameraMode("orbit"),
        );
        console.log("✅ Camera orbit button listener attached");
      }

      const cameraFollowBtn = document.getElementById("camera-follow");
      if (cameraFollowBtn) {
        cameraFollowBtn.addEventListener("click", () =>
          this.setCameraMode("follow"),
        );
        console.log("✅ Camera follow button listener attached");
      }

      const cameraFreeBtn = document.getElementById("camera-free");
      if (cameraFreeBtn) {
        cameraFreeBtn.addEventListener("click", () =>
          this.setCameraMode("free"),
        );
        console.log("✅ Camera free button listener attached");
      }

      const cameraResetBtn = document.getElementById("camera-reset");
      if (cameraResetBtn) {
        cameraResetBtn.addEventListener("click", () => this.resetCamera());
        console.log("✅ Camera reset button listener attached");
      }

      // Add toggle controls
      const toggleGridBtn = document.getElementById("toggle-grid");
      if (toggleGridBtn) {
        toggleGridBtn.addEventListener("click", () => this.toggleGrid());
        console.log("✅ Grid toggle button listener attached");
      }

      const toggleTrailsBtn = document.getElementById("toggle-trails");
      if (toggleTrailsBtn) {
        toggleTrailsBtn.addEventListener("click", () => this.toggleTrails());
        console.log("✅ Trails toggle button listener attached");
      }

      const toggleGlowBtn = document.getElementById("toggle-glow");
      if (toggleGlowBtn) {
        toggleGlowBtn.addEventListener("click", () => this.toggleGlow());
        console.log("✅ Glow toggle button listener attached");
      }

      const toggleConnectionsBtn =
        document.getElementById("toggle-connections");
      if (toggleConnectionsBtn) {
        toggleConnectionsBtn.addEventListener("click", () =>
          this.toggleConnections(),
        );
        console.log("✅ Connections toggle button listener attached");
      }

      const toggleLabelsBtn = document.getElementById("toggle-labels");
      if (toggleLabelsBtn) {
        toggleLabelsBtn.addEventListener("click", () => this.toggleLabels());
        console.log("✅ Labels toggle button listener attached");
      }

      const togglePhysicsBtn = document.getElementById("toggle-physics");
      if (togglePhysicsBtn) {
        togglePhysicsBtn.addEventListener("click", () => this.togglePhysics());
        console.log("��� Physics toggle button listener attached");
      }

      // Add mouse tracking for canvas
      if (this.canvas3D) {
        this.canvas3D.addEventListener("mousemove", (e) =>
          this.updateMousePosition(e),
        );
        this.canvas3D.addEventListener("wheel", (e) =>
          this.handleMouseWheel(e),
        );
        console.log("✅ Canvas mouse listeners attached");
      }

      console.log("✅ All event listeners attached successfully");
    } catch (error) {
      console.error("❌ Error attaching event listeners:", error);
    }
  }

  // View Mode Controls
  public setViewMode(
    mode: "3d" | "5d" | "overlay" | "height_perspective",
  ): void {
    this.state.view_mode = mode;
    console.log(`🎥 View mode changed to: ${mode.toUpperCase()}`);

    // Update visual indicators
    const buttons = ["view-3d", "view-5d", "view-overlay", "view-height"];
    buttons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.style.opacity = "0.5";
    });

    const activeBtn = document.getElementById(
      `view-${mode === "height_perspective" ? "height" : mode}`,
    );
    if (activeBtn) activeBtn.style.opacity = "1.0";

    // Initialize 5D specific features
    if (mode === "5d") {
      this.init5DVisualization();
      console.log("🌌 5D Consciousness visualization activated");
    }

    this.updateDebugInfo();
    this.renderFrame();
  }

  // Camera Controls
  public setCameraMode(mode: "orbit" | "follow" | "free"): void {
    console.log(`📷 Camera mode changed to: ${mode.toUpperCase()}`);

    // Update visual indicators
    const buttons = ["camera-orbit", "camera-follow", "camera-free"];
    buttons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.style.opacity = "0.5";
    });

    const activeBtn = document.getElementById(`camera-${mode}`);
    if (activeBtn) activeBtn.style.opacity = "1.0";

    this.updateDebugInfo();
  }

  public resetCamera(): void {
    console.log("📷 Camera reset to default position");
    this.setCameraMode("free");
    this.renderFrame();
  }

  // Toggle Features
  public toggleGrid(): void {
    this.state.positioning_grid.enabled = !this.state.positioning_grid.enabled;
    const btn = document.getElementById("toggle-grid");
    if (btn) {
      btn.style.background = this.state.positioning_grid.enabled
        ? "#00ff00"
        : "#666666";
      btn.style.color = this.state.positioning_grid.enabled ? "black" : "white";
    }
    console.log(
      `📐 Grid ${this.state.positioning_grid.enabled ? "enabled" : "disabled"}`,
    );
    this.renderFrame();
  }

  private trailsEnabled = true;
  public toggleTrails(): void {
    this.trailsEnabled = !this.trailsEnabled;
    const btn = document.getElementById("toggle-trails");
    if (btn) {
      btn.style.background = this.trailsEnabled ? "#00ff00" : "#666666";
      btn.style.color = this.trailsEnabled ? "black" : "white";
    }
    console.log(`✨ Trails ${this.trailsEnabled ? "enabled" : "disabled"}`);
    this.renderFrame();
  }

  private glowEnabled = true;
  public toggleGlow(): void {
    this.glowEnabled = !this.glowEnabled;
    const btn = document.getElementById("toggle-glow");
    if (btn) {
      btn.style.background = this.glowEnabled ? "#00ff00" : "#666666";
      btn.style.color = this.glowEnabled ? "black" : "white";
    }
    console.log(`💫 Glow effects ${this.glowEnabled ? "enabled" : "disabled"}`);
    this.renderFrame();
  }

  private connectionsEnabled = true;
  public toggleConnections(): void {
    this.connectionsEnabled = !this.connectionsEnabled;
    const btn = document.getElementById("toggle-connections");
    if (btn) {
      btn.style.background = this.connectionsEnabled ? "#00ff00" : "#666666";
      btn.style.color = this.connectionsEnabled ? "black" : "white";
    }
    console.log(
      `🔗 Connections ${this.connectionsEnabled ? "enabled" : "disabled"}`,
    );
    this.renderFrame();
  }

  private labelsEnabled = true;
  public toggleLabels(): void {
    this.labelsEnabled = !this.labelsEnabled;
    const btn = document.getElementById("toggle-labels");
    if (btn) {
      btn.style.background = this.labelsEnabled ? "#00ff00" : "#666666";
      btn.style.color = this.labelsEnabled ? "black" : "white";
    }
    console.log(`🏷️ Labels ${this.labelsEnabled ? "enabled" : "disabled"}`);
    this.renderFrame();
  }

  private physicsEnabled = true;
  public togglePhysics(): void {
    this.physicsEnabled = !this.physicsEnabled;
    const btn = document.getElementById("toggle-physics");
    if (btn) {
      btn.style.background = this.physicsEnabled ? "#00ff00" : "#666666";
      btn.style.color = this.physicsEnabled ? "black" : "white";
    }
    console.log(`⚡ Physics ${this.physicsEnabled ? "enabled" : "disabled"}`);
  }

  // Live Controls
  private currentZoom = 1.0;
  private animationSpeed = 1.0;
  private rotationX = 0;
  private rotationY = 0;
  private isMovementActive = false;

  public handleZoomChange(value: string): void {
    this.currentZoom = parseFloat(value);
    const zoomDisplay = document.getElementById("zoom-value");
    const currentZoomDisplay = document.getElementById("current-zoom");
    if (zoomDisplay) zoomDisplay.textContent = value;
    if (currentZoomDisplay) currentZoomDisplay.textContent = value + "x";
    this.renderFrame();
  }

  public handleSpeedChange(value: string): void {
    this.animationSpeed = parseFloat(value);
    const speedDisplay = document.getElementById("speed-value");
    if (speedDisplay) speedDisplay.textContent = value;
    console.log(`🚀 Animation speed set to: ${value}x`);
  }

  public handleRotationX(value: string): void {
    this.rotationX = parseInt(value);
    const rotDisplay = document.getElementById("rotx-value");
    if (rotDisplay) rotDisplay.textContent = value + "°";
    this.renderFrame();
  }

  public handleRotationY(value: string): void {
    this.rotationY = parseInt(value);
    const rotDisplay = document.getElementById("roty-value");
    if (rotDisplay) rotDisplay.textContent = value + "°";
    this.renderFrame();
  }

  public updateMousePosition(event: MouseEvent): void {
    const rect = this.canvas3D.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const mousePosDisplay = document.getElementById("mouse-pos");
    if (mousePosDisplay)
      mousePosDisplay.textContent = `${x.toFixed(0)},${y.toFixed(0)}`;
  }

  public handleMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
    this.currentZoom = Math.max(
      0.1,
      Math.min(5.0, this.currentZoom + zoomDelta),
    );

    const zoomSlider = document.getElementById(
      "zoom-slider",
    ) as HTMLInputElement;
    const zoomDisplay = document.getElementById("zoom-value");
    const currentZoomDisplay = document.getElementById("current-zoom");

    if (zoomSlider) zoomSlider.value = this.currentZoom.toString();
    if (zoomDisplay) zoomDisplay.textContent = this.currentZoom.toFixed(1);
    if (currentZoomDisplay)
      currentZoomDisplay.textContent = this.currentZoom.toFixed(1) + "x";

    this.renderFrame();
  }

  public startAIMovement(): void {
    this.isMovementActive = !this.isMovementActive;
    const btn = document.getElementById("start-movement");
    if (btn) {
      btn.textContent = this.isMovementActive ? "⏸️ PAUSE" : "▶️ MOVE";
      btn.style.background = this.isMovementActive ? "#ff4444" : "#ff8800";
    }
    console.log(
      `🎮 AI Movement ${this.isMovementActive ? "started" : "paused"}`,
    );

    if (this.isMovementActive) {
      this.startAIAnimationLoop();
    }
  }

  private animationFrame = 0;
  private fpsCounter = 0;
  private lastFPSUpdate = Date.now();

  private startAIAnimationLoop(): void {
    if (!this.isMovementActive) return;

    this.animationFrame++;

    // Update FPS counter
    const now = Date.now();
    if (now - this.lastFPSUpdate > 1000) {
      this.fpsCounter = this.animationFrame;
      this.animationFrame = 0;
      this.lastFPSUpdate = now;

      const fpsDisplay = document.getElementById("fps-counter");
      if (fpsDisplay) fpsDisplay.textContent = this.fpsCounter.toString();
    }

    // Move AIs with physics
    if (this.physicsEnabled) {
      this.updateAIPositions();
    }

    this.renderFrame();

    if (this.isMovementActive) {
      requestAnimationFrame(() => this.startAIAnimationLoop());
    }
  }

  private updateAIPositions(): void {
    const time = Date.now() * 0.001 * this.animationSpeed;

    this.state.ai_entities.forEach((entity, index) => {
      if (this.state.view_mode === "5d") {
        // 5D movement with consciousness-based patterns
        this.update5DPosition(entity, time, index);
      } else {
        // Standard 3D circular movement
        const radius = 100 + index * 30;
        const speed = 0.5 + index * 0.2;
        const centerX = 600;
        const centerY = 400;

        entity.position_3d.x =
          centerX + Math.cos(time * speed + index) * radius;
        entity.position_3d.y =
          centerY + Math.sin(time * speed + index) * radius;
        entity.position_3d.z = 50 + Math.sin(time * speed * 2 + index) * 20;
      }

      // Update movement trail
      if (entity.movement_trail.enabled) {
        entity.movement_trail.current_points.push({
          x: entity.position_3d.x,
          y: entity.position_3d.y,
          z: entity.position_3d.z,
          timestamp: Date.now(),
        });

        // Keep only last 20 points
        if (entity.movement_trail.current_points.length > 20) {
          entity.movement_trail.current_points.shift();
        }
      }
    });
  }

  // 5D Visualization System
  private init5DVisualization(): void {
    console.log("🌌 Initializing 5D Consciousness Visualization");

    // Add 5D dimensions to existing AI entities
    this.state.ai_entities.forEach((entity) => {
      if (!entity.position_5d || !entity.position_5d.consciousness) {
        // Initialize with proper Position5D interface properties
        entity.position_5d = {
          x: entity.position_3d.x || 0,
          y: entity.position_3d.y || 0,
          z: entity.position_3d.z || 0,
          time: Date.now() * 0.001,
          consciousness: Math.random() * 0.8 + 0.2, // Consciousness level
          temporal_velocity: (Math.random() - 0.5) * 0.1, // Temporal movement speed
          consciousness_gradient: Math.random() * 0.7 + 0.3, // Consciousness gradient
        };
      }
    });
  }

  private update5DPosition(
    entity: VisualAIEntity,
    time: number,
    index: number,
  ): void {
    const pos5d = entity.position_5d;

    // Update 5D dimensions
    pos5d.temporal_state = (Math.sin(time * 0.5 + index) + 1) / 2;
    pos5d.consciousness_level = Math.max(
      0.1,
      Math.min(
        1.0,
        pos5d.consciousness_level + Math.sin(time * 0.3 + index) * 0.1,
      ),
    );
    pos5d.quantum_coherence = Math.max(
      0.1,
      Math.min(
        1.0,
        pos5d.quantum_coherence + Math.cos(time * 0.4 + index) * 0.05,
      ),
    );

    // Transform 5D consciousness into 3D position
    const consciousnessRadius = pos5d.consciousness_level * 150;
    const informationOffset = pos5d.information_dimension * 200;
    const possibilityAngle = pos5d.possibility_dimension * Math.PI * 2;
    const temporalSpeed = pos5d.temporal_state * 0.8 + 0.2;

    const centerX = 600;
    const centerY = 400;

    // Consciousness-based spiral movement
    const spiralTime = time * temporalSpeed + index;
    const spiralRadius = consciousnessRadius + Math.sin(spiralTime * 0.5) * 50;

    entity.position_3d.x =
      centerX + Math.cos(spiralTime + possibilityAngle) * spiralRadius;
    entity.position_3d.y =
      centerY + Math.sin(spiralTime + possibilityAngle) * spiralRadius;
    entity.position_3d.z =
      30 +
      pos5d.information_dimension * 100 +
      Math.sin(time * 2 + index) * pos5d.quantum_coherence * 40;

    // Update consciousness visualization properties
    entity.visual_representation.glow_effect.intensity =
      pos5d.consciousness_level;
    entity.visual_representation.color.a = 0.6 + pos5d.quantum_coherence * 0.4;
  }

  private testCanvasRender(): void {
    console.log("🧪 TESTING AI VISUALIZATION CANVAS!");
    alert("🧪 TEST BUTTON CLICKED! Check canvas for red background...");

    if (!this.context3D) {
      console.error("❌ No canvas context available");
      alert("❌ ERROR: No canvas context available!");
      return;
    }

    // Flash the button to show it was clicked
    const testBtn = document.getElementById("test-canvas-viz");
    if (testBtn) {
      testBtn.style.background = "#ffffff";
      testBtn.style.color = "#000000";
      setTimeout(() => {
        testBtn.style.background = "#ff0000";
        testBtn.style.color = "#ffffff";
      }, 200);
    }

    // Clear canvas with bright red
    this.context3D.fillStyle = "#ff0000";
    this.context3D.fillRect(0, 0, this.canvas3D.width, this.canvas3D.height);

    // Draw large test text
    this.context3D.fillStyle = "#ffffff";
    this.context3D.font = "48px Arial";
    this.context3D.textAlign = "center";
    this.context3D.fillText(
      "🧪 TEST RENDER SUCCESS",
      this.canvas3D.width / 2,
      this.canvas3D.height / 2,
    );

    this.context3D.font = "24px Arial";
    this.context3D.fillText(
      "Canvas is working properly!",
      this.canvas3D.width / 2,
      this.canvas3D.height / 2 + 60,
    );

    // Draw test shapes
    this.context3D.fillStyle = "#00ff00";
    this.context3D.fillRect(100, 100, 100, 100);
    this.context3D.fillStyle = "#0000ff";
    this.context3D.beginPath();
    this.context3D.arc(400, 300, 50, 0, 2 * Math.PI);
    this.context3D.fill();
    this.context3D.fillStyle = "#ffff00";
    this.context3D.beginPath();
    this.context3D.arc(800, 300, 50, 0, 2 * Math.PI);
    this.context3D.fill();

    console.log(
      "✅ TEST RENDER COMPLETE - Red background with white text should be visible",
    );
    this.updateDebugInfo();
  }

  private createTestAIEntities(): void {
    console.log("🤖 Creating test AI entities");

    // Clear existing entities
    this.state.ai_entities.clear();

    // Create test AI entities
    const testAIs = [
      {
        id: "test-ai-1",
        name: "Central Command",
        x: 600,
        y: 400,
        color: "#ff0000",
      },
      {
        id: "test-ai-2",
        name: "Memory System",
        x: 300,
        y: 200,
        color: "#00ff00",
      },
      {
        id: "test-ai-3",
        name: "Logic Engine",
        x: 900,
        y: 200,
        color: "#0000ff",
      },
      {
        id: "test-ai-4",
        name: "Pattern Recognition",
        x: 300,
        y: 600,
        color: "#ffff00",
      },
      {
        id: "test-ai-5",
        name: "Decision Maker",
        x: 900,
        y: 600,
        color: "#ff00ff",
      },
    ];

    testAIs.forEach((ai, index) => {
      const entity: VisualAIEntity = {
        id: ai.id,
        ai_type: "test_ai",
        visual_representation: {
          shape: "sphere",
          size: { width: 40, height: 40, depth: 40 },
          color: this.hexToRgba(ai.color),
          texture: "metallic",
          animation: {
            current_frame: 0,
            total_frames: 60,
            speed: 1,
            loop: true,
          },
          glow_effect: {
            enabled: true,
            intensity: 0.7,
            color: this.hexToRgba(ai.color),
            radius: 60,
          },
          particle_system: {
            enabled: true,
            particle_count: 20,
            emission_rate: 5,
            particle_life: 2000,
          },
          holographic_display: {
            enabled: true,
            text: ai.name,
            font_size: 12,
            color: this.hexToRgba("#ffffff"),
          },
        },
        position_3d: {
          x: ai.x,
          y: ai.y,
          z: 50 + index * 20,
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
        position_5d: {
          x: 100 + index * 120,
          y: 100 + Math.sin(index * 0.5) * 60,
          z: 50 + index * 20,
          time: Date.now() * 0.001,
          consciousness: 0.9,
          temporal_velocity: (Math.random() - 0.5) * 0.1,
          consciousness_gradient: 0.7,
        },
        movement_trail: {
          enabled: true,
          max_points: 50,
          trail_points: [],
          current_points: [],
          fade_duration: 2000,
          color_gradient: { start: this.hexToRgba(ai.color) },
          trail_color: this.hexToRgba(ai.color),
          particle_trail: false,
        },
        interaction_radius: 80,
        drag_handle: {
          enabled: true,
          visible: true,
          size: 10,
          color: this.hexToRgba("#ffffff"),
        },
        status_indicators: [
          {
            type: "health",
            value: 1.0,
            color: this.hexToRgba("#00ff00"),
            position: "top",
          },
          {
            type: "activity",
            value: 0.8,
            color: this.hexToRgba("#ffff00"),
            position: "right",
          },
        ],
        connection_lines: [],
        task_visualization: {
          current_task: `Processing task ${index + 1}`,
          progress: 0.6,
          task_queue: 3,
          visual_elements: [],
        },
        reasoning_indicators: [
          { type: "logic", strength: 0.9, visual_cue: "pulsing_glow" },
          { type: "creativity", strength: 0.7, visual_cue: "particle_burst" },
        ],
      };

      this.state.ai_entities.set(ai.id, entity);
    });

    console.log(`✅ Created ${testAIs.length} test AI entities`);
    console.log("AI entities in map:", this.state.ai_entities.size);
    console.log("AI entities:", Array.from(this.state.ai_entities.keys()));

    // Force rendering active
    this.isRenderingActive = true;

    // Update debug info
    this.updateDebugInfo();

    // Force immediate render
    this.renderFrame();

    // Also ensure the render loop is running
    if (!this.renderLoop) {
      console.log("🎮 Starting render loop...");
      this.startRenderLoop();
    }
  }

  private hexToRgba(hex: string): {
    r: number;
    g: number;
    b: number;
    a: number;
  } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1.0,
        }
      : { r: 0, g: 0, b: 0, a: 1.0 };
  }

  private clearCanvas(): void {
    if (!this.context3D) return;
    this.context3D.fillStyle = "rgba(0, 0, 20, 0.9)";
    this.context3D.fillRect(0, 0, this.canvas3D.width, this.canvas3D.height);
    this.state.ai_entities.clear();
    this.updateDebugInfo();
    console.log("🧹 Canvas cleared");
  }

  private updateDebugInfo(): void {
    const canvasStatus = document.getElementById("canvas-status");
    const aiCount = document.getElementById("ai-count");
    const renderStatus = document.getElementById("render-status");
    const currentView = document.getElementById("current-view");
    const cameraMode = document.getElementById("camera-mode");

    if (canvasStatus) {
      canvasStatus.textContent = this.context3D ? "✅" : "❌";
    }
    if (aiCount) {
      aiCount.textContent = this.state.ai_entities.size.toString();
    }
    if (renderStatus) {
      renderStatus.textContent = this.isRenderingActive ? "✅" : "❌";
    }
    if (currentView) {
      currentView.textContent = this.state.view_mode.toUpperCase();
    }
    if (cameraMode) {
      // Get current camera mode from button opacity
      const orbitBtn = document.getElementById("camera-orbit");
      const followBtn = document.getElementById("camera-follow");
      const freeBtn = document.getElementById("camera-free");

      let mode = "FREE";
      if (orbitBtn?.style.opacity === "1") mode = "ORBIT";
      else if (followBtn?.style.opacity === "1") mode = "FOLLOW";

      cameraMode.textContent = mode;
    }
  }

  private initializeVisualization(): void {
    console.log("🎮 Initializing Interactive AI Visualization System");

    // Create central observation tower
    this.createCentralObservationTower();

    // Create observer cameras at different heights
    this.createObserverCameras();

    // Initialize interactive controls
    this.createInteractiveControls();

    // Setup 5D view capabilities
    this.setup5DVisualization();
  }

  private createCentralObservationTower(): void {
    const centralTower: ObservationPoint = {
      id: "central_command_tower",
      type: "central_tower",
      position: { x: 600, y: 400, z: 200 },
      height: 200,
      field_of_view: {
        horizontal_angle: 360,
        vertical_angle: 180,
        near_distance: 10,
        far_distance: 2000,
        focus_point: { x: 600, y: 400, z: 0 },
      },
      observation_range: 1500,
      observed_entities: [],
      analysis_data: {
        total_ais_observed: 0,
        coordination_efficiency: 0.85,
        traffic_congestion: 0.2,
        reasoning_quality_average: 0.88,
        detected_issues: [],
      },
      viewing_perspective: {
        camera_type: "orbit",
        target: null,
        zoom_level: 1.0,
        rotation_speed: 0.01,
        smooth_transitions: true,
      },
    };

    this.state.observation_points.push(centralTower);
  }

  private createObserverCameras(): void {
    const heights = [50, 100, 150, 250];
    const positions = [
      { x: 200, y: 200 },
      { x: 1000, y: 200 },
      { x: 1000, y: 600 },
      { x: 200, y: 600 },
    ];

    heights.forEach((height, index) => {
      const position = positions[index] || { x: 600, y: 400 };

      const observer: ObservationPoint = {
        id: `observer_${index}`,
        type: "observer_ai",
        position: { x: position.x, y: position.y, z: height },
        height,
        field_of_view: {
          horizontal_angle: 120,
          vertical_angle: 90,
          near_distance: 5,
          far_distance: 800,
          focus_point: { x: 600, y: 400, z: 0 },
        },
        observation_range: 500,
        observed_entities: [],
        analysis_data: {
          specialized_analysis: `height_${height}_perspective`,
          focus_areas: this.getHeightSpecificFocus(height),
        },
        viewing_perspective: {
          camera_type: "fixed",
          target: null,
          zoom_level: 0.8,
          rotation_speed: 0,
          smooth_transitions: true,
        },
      };

      this.state.observation_points.push(observer);
    });
  }

  private getHeightSpecificFocus(height: number): string[] {
    if (height < 100) return ["ground_level_interactions", "detail_analysis"];
    if (height < 200) return ["mid_level_coordination", "traffic_management"];
    return ["strategic_overview", "pattern_recognition"];
  }

  private createInteractiveControls(): void {
    // View mode selector
    this.createViewModeControl();

    // Zoom controls
    this.createZoomControls();

    // AI speed controls
    this.createSpeedControls();

    // Visualization options
    this.createVisualizationOptions();

    // Emergency controls
    this.createEmergencyControls();
  }

  private createViewModeControl(): void {
    const control: InteractiveControl = {
      id: "view_mode_selector",
      type: "button",
      position: { x: 20, y: 20, z: 0 },
      size: { width: 120, height: 40 },
      function: "switch_view_mode",
      parameters: { modes: ["3d", "5d", "overlay", "height_perspective"] },
      visual_state: {
        background: { r: 0, g: 100, b: 200, a: 0.8 },
        border: { r: 0, g: 150, b: 255, a: 1.0 },
        text: "3D View",
        font_size: 14,
        hover_effect: true,
      },
      interaction_feedback: {
        hover_color: { r: 0, g: 150, b: 255, a: 1.0 },
        click_animation: "pulse",
        sound_feedback: false,
      },
    };

    this.state.interactive_controls.push(control);
  }

  private createZoomControls(): void {
    const zoomIn: InteractiveControl = {
      id: "zoom_in",
      type: "button",
      position: { x: 20, y: 70, z: 0 },
      size: { width: 40, height: 40 },
      function: "zoom_in",
      parameters: { zoom_factor: 1.2 },
      visual_state: {
        background: { r: 0, g: 150, b: 0, a: 0.8 },
        text: "+",
        font_size: 20,
        hover_effect: true,
      },
      interaction_feedback: {
        hover_color: { r: 0, g: 200, b: 0, a: 1.0 },
        click_animation: "scale",
        sound_feedback: false,
      },
    };

    const zoomOut: InteractiveControl = {
      id: "zoom_out",
      type: "button",
      position: { x: 70, y: 70, z: 0 },
      size: { width: 40, height: 40 },
      function: "zoom_out",
      parameters: { zoom_factor: 0.8 },
      visual_state: {
        background: { r: 150, g: 0, b: 0, a: 0.8 },
        text: "-",
        font_size: 20,
        hover_effect: true,
      },
      interaction_feedback: {
        hover_color: { r: 200, g: 0, b: 0, a: 1.0 },
        click_animation: "scale",
        sound_feedback: false,
      },
    };

    this.state.interactive_controls.push(zoomIn, zoomOut);
  }

  private createSpeedControls(): void {
    const speedControl: InteractiveControl = {
      id: "ai_speed_slider",
      type: "slider",
      position: { x: 20, y: 120, z: 0 },
      size: { width: 150, height: 20 },
      function: "adjust_ai_speed",
      parameters: { min: 0.1, max: 5.0, current: 1.0 },
      visual_state: {
        background: { r: 50, g: 50, b: 50, a: 0.8 },
        slider_color: { r: 0, g: 200, b: 200, a: 1.0 },
        handle_color: { r: 255, g: 255, b: 255, a: 1.0 },
      },
      interaction_feedback: {
        value_display: true,
        real_time_update: true,
      },
    };

    this.state.interactive_controls.push(speedControl);
  }

  private createVisualizationOptions(): void {
    const options = [
      { id: "show_trails", text: "Show Trails", enabled: true },
      { id: "show_connections", text: "Show Connections", enabled: true },
      { id: "show_reasoning", text: "Show Reasoning", enabled: false },
      { id: "show_tasks", text: "Show Tasks", enabled: true },
      { id: "show_maze", text: "Show Maze", enabled: false },
    ];

    options.forEach((option, index) => {
      const control: InteractiveControl = {
        id: option.id,
        type: "button",
        position: { x: 20, y: 160 + index * 30, z: 0 },
        size: { width: 120, height: 25 },
        function: "toggle_visualization_option",
        parameters: { option: option.id, enabled: option.enabled },
        visual_state: {
          background: option.enabled
            ? { r: 0, g: 150, b: 0, a: 0.8 }
            : { r: 100, g: 100, b: 100, a: 0.8 },
          text: option.text,
          font_size: 12,
          hover_effect: true,
        },
        interaction_feedback: {
          toggle_animation: "fade",
          state_change_duration: 300,
        },
      };

      this.state.interactive_controls.push(control);
    });
  }

  private createEmergencyControls(): void {
    const emergencyStop: InteractiveControl = {
      id: "emergency_stop",
      type: "button",
      position: { x: 20, y: 350, z: 0 },
      size: { width: 100, height: 40 },
      function: "emergency_stop_all_ais",
      parameters: {},
      visual_state: {
        background: { r: 200, g: 0, b: 0, a: 0.9 },
        border: { r: 255, g: 0, b: 0, a: 1.0 },
        text: "STOP ALL",
        font_size: 12,
        hover_effect: true,
        pulse_animation: true,
      },
      interaction_feedback: {
        confirmation_required: true,
        hover_color: { r: 255, g: 50, b: 50, a: 1.0 },
        click_animation: "flash",
        sound_feedback: true,
      },
    };

    this.state.interactive_controls.push(emergencyStop);
  }

  private setup5DVisualization(): void {
    console.log("🌌 Setting up 5D Visualization capabilities");

    // Add temporal dimension visualization
    this.add5DTemporalLayer();

    // Add consciousness dimension visualization
    this.add5DConsciousnessLayer();

    // Setup multi-dimensional navigation
    this.setup5DNavigation();
  }

  private add5DTemporalLayer(): void {
    // Create temporal visualization layer
    const temporalLayer = {
      id: "temporal_dimension",
      visualization_type: "time_stream",
      display_mode: "overlay",
      temporal_range: 60000, // 1 minute
      time_markers: [],
      future_predictions: [],
      past_trail_length: 10,
    };

    // Add temporal indicators to canvas
    this.renderTemporalDimension(temporalLayer);
  }

  private add5DConsciousnessLayer(): void {
    // Create consciousness visualization layer
    const consciousnessLayer = {
      id: "consciousness_dimension",
      visualization_type: "consciousness_field",
      display_mode: "color_gradient",
      consciousness_range: [0, 1],
      consciousness_indicators: [],
      thought_bubbles: [],
      insight_visualization: [],
    };

    // Add consciousness indicators
    this.renderConsciousnessDimension(consciousnessLayer);
  }

  private setup5DNavigation(): void {
    // Setup navigation through 5D space
    const navigation5D = {
      temporal_navigation: {
        enabled: true,
        time_scrubbing: true,
        future_projection: true,
        temporal_zoom: true,
      },
      consciousness_navigation: {
        enabled: true,
        consciousness_levels: true,
        thought_diving: true,
        insight_exploration: true,
      },
      spatial_3d_navigation: {
        enabled: true,
        free_camera: true,
        orbit_mode: true,
        follow_mode: true,
      },
    };

    this.apply5DNavigationControls(navigation5D);
  }

  private setupUserInteractions(): void {
    console.log("🖱️ Setting up User Interaction System");

    // Mouse interactions
    this.canvas3D.addEventListener("mousedown", (event) => {
      this.handleMouseDown(event);
    });

    this.canvas3D.addEventListener("mousemove", (event) => {
      this.handleMouseMove(event);
    });

    this.canvas3D.addEventListener("mouseup", (event) => {
      this.handleMouseUp(event);
    });

    this.canvas3D.addEventListener("wheel", (event) => {
      this.handleMouseWheel(event);
    });

    // Touch interactions for mobile
    this.canvas3D.addEventListener("touchstart", (event) => {
      this.handleTouchStart(event);
    });

    this.canvas3D.addEventListener("touchmove", (event) => {
      this.handleTouchMove(event);
    });

    this.canvas3D.addEventListener("touchend", (event) => {
      this.handleTouchEnd(event);
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (event) => {
      this.handleKeyDown(event);
    });
  }

  private handleMouseDown(event: MouseEvent): void {
    const clickPosition = this.getCanvasPosition(event);
    const hitEntity = this.detectEntityHit(clickPosition);

    if (hitEntity) {
      // Start drag operation
      this.startDragOperation(hitEntity, clickPosition);
    } else {
      // Check control interactions
      const hitControl = this.detectControlHit(clickPosition);
      if (hitControl) {
        this.executeControlFunction(hitControl);
      }
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    const currentPosition = this.getCanvasPosition(event);

    if (this.dragState.active && this.dragState.target) {
      this.updateDragOperation(currentPosition);
    } else {
      // Update hover states
      this.updateHoverStates(currentPosition);
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    if (this.dragState.active) {
      this.completeDragOperation();
    }
  }

  private startDragOperation(
    entityId: string,
    startPosition: Position3D,
  ): void {
    const entity = this.state.ai_entities.get(entityId);
    if (!entity || !entity.drag_handle.visible) return;

    const dragOperation: DragOperation = {
      id: `drag_${Date.now()}`,
      ai_id: entityId,
      start_position: { ...entity.position_3d },
      current_position: { ...entity.position_3d },
      target_position: startPosition,
      drag_vector: { x: 0, y: 0, z: 0 },
      drag_speed: 1.0,
      constraints_applied: entity.drag_handle.constraints,
      collision_detection: {
        enabled: true,
        check_radius: 50,
        avoidance_strength: 0.8,
      },
      snap_targets: this.findSnapTargets(entityId),
      automatic_routing: {
        enabled: false,
        maze_avoidance: true,
        traffic_awareness: true,
      },
    };

    this.state.drag_operations.push(dragOperation);
    this.dragState = { active: true, target: entityId };

    // Visual feedback
    if (entity.drag_handle) {
      entity.drag_handle.drag_state = true;
    }

    console.log(`🎮 Started dragging AI: ${entityId}`);
  }

  private findSnapTargets(entityId: string): Position3D[] {
    const snapTargets: Position3D[] = [];
    const currentEntity = this.state.ai_entities.get(entityId);

    if (!currentEntity) return snapTargets;

    // Add snap targets for other AI entities within range
    this.state.ai_entities.forEach((entity, id) => {
      if (id !== entityId && entity.drag_handle?.snap_enabled) {
        const distance = Math.sqrt(
          Math.pow(entity.position_3d.x - currentEntity.position_3d.x, 2) +
          Math.pow(entity.position_3d.y - currentEntity.position_3d.y, 2)
        );

        // Only include entities within snap range (100 pixels)
        if (distance <= 100) {
          snapTargets.push(entity.position_3d);
        }
      }
    });

    // Add grid snap points if enabled
    if (currentEntity.drag_handle?.grid_snap) {
      const gridSize = 50;
      const nearX = Math.round(currentEntity.position_3d.x / gridSize) * gridSize;
      const nearY = Math.round(currentEntity.position_3d.y / gridSize) * gridSize;
      snapTargets.push({ x: nearX, y: nearY, z: currentEntity.position_3d.z });
    }

    return snapTargets;
  }

  private updateDragOperation(currentPosition: Position3D): void {
    if (!this.dragState.target) return;

    const entity = this.state.ai_entities.get(this.dragState.target);
    const dragOp = this.state.drag_operations.find(
      (op) => op.ai_id === this.dragState.target,
    );

    if (!entity || !dragOp) return;

    // Apply constraints
    const constrainedPosition = this.applyDragConstraints(
      currentPosition,
      dragOp.constraints_applied,
    );

    // Check collisions
    const collisionFreePosition = this.avoidCollisions(
      constrainedPosition,
      dragOp.collision_detection,
    );

    // Apply snap targets
    const snappedPosition = this.applySnapTargets(
      collisionFreePosition,
      dragOp.snap_targets,
    );

    // Update entity position
    entity.position_3d = snappedPosition;
    dragOp.current_position = snappedPosition;
    dragOp.target_position = snappedPosition;

    // Update 5D position
    entity.position_5d.x = snappedPosition.x;
    entity.position_5d.y = snappedPosition.y;
    entity.position_5d.z = snappedPosition.z;

    // Add to movement trail
    this.addToMovementTrail(entity, snappedPosition);

    // Trigger automatic route recalculation
    this.recalculateAutomaticRoutes(this.dragState.target);
  }

  private completeDragOperation(): void {
    if (!this.dragState.target) return;

    const entity = this.state.ai_entities.get(this.dragState.target);
    if (entity && entity.drag_handle) {
      entity.drag_handle.drag_state = false;
    }

    // Log user interaction
    const interaction: UserInteraction = {
      id: `interaction_${Date.now()}`,
      type: "drag",
      timestamp: new Date(),
      ai_target: this.dragState.target,
      interaction_data: {
        final_position: entity?.position_3d,
        drag_duration: Date.now() - Date.now(), // Would calculate actual duration
      },
      success: true,
      response_data: {
        position_accepted: true,
        route_updated: true,
      },
    };

    this.state.user_interactions.push(interaction);

    this.dragState = { active: false, target: null };

    console.log(`🎮 Completed dragging AI: ${this.dragState.target}`);
  }

  private startRenderLoop(): void {
    this.isRunning = true;
    this.isRenderingActive = true;

    this.renderLoop = setInterval(() => {
      this.render3DScene();
      this.render5DOverlays();
      this.renderInteractiveControls();
      this.updateAnimations();
      this.updateDebugInfo();
    }, 16); // 60 FPS rendering

    console.log("🎮 AI Visualization render loop started at 60 FPS");
  }

  public renderFrame(): void {
    if (!this.context3D) return;
    this.isRenderingActive = true;
    this.render3DScene();
    this.render5DOverlays();
    this.renderInteractiveControls();
    this.updateDebugInfo();
  }

  private render3DScene(): void {
    if (!this.context3D) return;

    // Clear canvas with view-mode specific background
    if (this.state.view_mode === "5d") {
      this.render5DBackground();
    } else {
      this.context3D.clearRect(0, 0, this.canvas3D.width, this.canvas3D.height);
    }

    // Render background grid
    if (this.state.positioning_grid.enabled) {
      this.renderPositioningGrid();
    }

    // Render 5D dimensional grid if in 5D mode
    if (this.state.view_mode === "5d") {
      this.render5DDimensionalGrid();
    }

    // Render observation towers
    this.renderObservationPoints();

    // Render AI entities
    console.log(`🎨 Rendering ${this.state.ai_entities.size} AI entities`);
    this.state.ai_entities.forEach((entity) => {
      this.renderAIEntity(entity);
    });

    // Render connections between AIs
    this.renderAIConnections();

    // Render maze visualizations
    this.state.maze_visualizations.forEach((maze) => {
      this.renderMazeVisualization(maze);
    });

    // Render traffic flows
    this.state.traffic_flows.forEach((traffic) => {
      this.renderTrafficFlow(traffic);
    });
  }

  private renderPositioningGrid(): void {
    if (!this.context3D) return;

    const grid = this.state.positioning_grid;
    const ctx = this.context3D;

    // Set grid line style
    ctx.strokeStyle = `rgba(${grid.grid_visual.line_color.r}, ${grid.grid_visual.line_color.g}, ${grid.grid_visual.line_color.b}, ${grid.grid_visual.line_color.a})`;
    ctx.lineWidth = grid.grid_visual.line_width;

    // Draw vertical lines
    for (let x = 0; x <= this.canvas3D.width; x += grid.grid_size.x) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas3D.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.canvas3D.height; y += grid.grid_size.y) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas3D.width, y);
      ctx.stroke();
    }

    // Draw coordinate axes
    this.renderCoordinateAxes();
  }

  private renderCoordinateAxes(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;
    const grid = this.state.positioning_grid.grid_visual;

    // X-axis (red)
    ctx.strokeStyle = `rgba(${grid.axis_colors.x.r}, ${grid.axis_colors.x.g}, ${grid.axis_colors.x.b}, ${grid.axis_colors.x.a})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.canvas3D.height / 2);
    ctx.lineTo(this.canvas3D.width, this.canvas3D.height / 2);
    ctx.stroke();

    // Y-axis (green)
    ctx.strokeStyle = `rgba(${grid.axis_colors.y.r}, ${grid.axis_colors.y.g}, ${grid.axis_colors.y.b}, ${grid.axis_colors.y.a})`;
    ctx.beginPath();
    ctx.moveTo(this.canvas3D.width / 2, 0);
    ctx.lineTo(this.canvas3D.width / 2, this.canvas3D.height);
    ctx.stroke();
  }

  private renderObservationPoints(): void {
    this.state.observation_points.forEach((point) => {
      this.renderObservationPoint(point);
    });
  }

  private renderObservationPoint(point: ObservationPoint): void {
    if (!this.context3D) return;

    const ctx = this.context3D;
    const screenPos = this.worldToScreen(point.position);

    // Render tower base
    ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
    ctx.fillRect(screenPos.x - 10, screenPos.y - 5, 20, 10);

    // Render tower height indicator
    ctx.strokeStyle = "rgba(150, 150, 150, 1.0)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenPos.x, screenPos.y);
    ctx.lineTo(screenPos.x, screenPos.y - point.height / 2);
    ctx.stroke();

    // Render observation range
    ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(
      screenPos.x,
      screenPos.y,
      point.observation_range / 4,
      0,
      2 * Math.PI,
    );
    ctx.stroke();

    // Render tower label
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "12px monospace";
    ctx.fillText(point.id, screenPos.x + 15, screenPos.y - 5);
  }

  private renderAIEntity(entity: VisualAIEntity): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Validate position to prevent non-finite values
    const validPosition = this.validatePosition(entity.position_3d);
    const screenPos = this.worldToScreen(validPosition);
    const validScreenPos = this.validatePosition(screenPos);

    console.log(
      `🎨 Rendering AI ${entity.id} at world(${validPosition.x}, ${validPosition.y}) -> screen(${validScreenPos.x}, ${validScreenPos.y})`,
    );

    // Render AI shape
    this.renderAIShape(entity, validScreenPos);

    // Render drag handle if visible
    if (entity.drag_handle.visible) {
      this.renderDragHandle(entity.drag_handle, validScreenPos);
    }

    // Render movement trail (if enabled)
    if (entity.movement_trail.enabled && this.trailsEnabled) {
      this.renderMovementTrail(entity.movement_trail);
    }

    // Render status indicators
    this.renderStatusIndicators(entity.status_indicators, screenPos);

    // Render task visualization
    if (entity.task_visualization) {
      this.renderTaskVisualization(entity.task_visualization, screenPos);
    }

    // Render reasoning indicators
    if (entity.reasoning_indicators.length > 0) {
      this.renderReasoningIndicators(entity.reasoning_indicators, screenPos);
    }

    // Render 5D specific elements
    if (this.state.view_mode === "5d") {
      this.safeCanvasOperation(
        () => this.render5DConsciousnessField(entity, validScreenPos),
        `5D Consciousness Field rendering for AI ${entity.id}`,
      );
      this.safeCanvasOperation(
        () => this.render5DDimensionalRings(entity, validScreenPos),
        `5D Dimensional Rings rendering for AI ${entity.id}`,
      );
    }
  }

  private renderAIShape(entity: VisualAIEntity, screenPos: Position3D): void {
    if (!this.context3D) return;

    const ctx = this.context3D;
    const visual = entity.visual_representation;
    const size = visual.size;

    // Set colors
    ctx.fillStyle = `rgba(${visual.color.r}, ${visual.color.g}, ${visual.color.b}, ${visual.color.a})`;
    ctx.strokeStyle = `rgba(${Math.min(255, visual.color.r + 50)}, ${Math.min(255, visual.color.g + 50)}, ${Math.min(255, visual.color.b + 50)}, 1.0)`;
    ctx.lineWidth = 2;

    // Render shape based on type
    switch (visual.shape) {
      case "sphere":
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, size.width / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;

      case "cube":
        ctx.fillRect(
          screenPos.x - size.width / 2,
          screenPos.y - size.height / 2,
          size.width,
          size.height,
        );
        ctx.strokeRect(
          screenPos.x - size.width / 2,
          screenPos.y - size.height / 2,
          size.width,
          size.height,
        );
        break;

      case "pyramid":
        ctx.beginPath();
        ctx.moveTo(screenPos.x, screenPos.y - size.height / 2);
        ctx.lineTo(screenPos.x - size.width / 2, screenPos.y + size.height / 2);
        ctx.lineTo(screenPos.x + size.width / 2, screenPos.y + size.height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }

    // Render glow effect (if enabled)
    if (visual.glow_effect && visual.glow_effect.enabled && this.glowEnabled) {
      this.renderGlowEffect(visual.glow_effect, screenPos, size);
    }

    // Render AI ID label (if enabled)
    if (this.labelsEnabled) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(entity.id, screenPos.x, screenPos.y + size.height / 2 + 15);
    }
  }

  private renderTemporalDimension(layer: any): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Render temporal visualization overlay
    ctx.save();

    // Draw temporal grid
    ctx.strokeStyle = "rgba(255, 255, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Vertical time lines
    for (let i = 0; i < 10; i++) {
      const x = (this.canvas3D.width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas3D.height);
      ctx.stroke();
    }

    // Add temporal markers
    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    ctx.font = "12px monospace";
    ctx.fillText("TIME →", 10, 20);

    // Draw time indicators
    const currentTime = Date.now();
    for (let i = 0; i < 5; i++) {
      const x = 50 + i * 100;
      const timeOffset = (i * layer.temporal_range) / 5;
      const timeValue = new Date(currentTime - timeOffset);

      ctx.fillStyle = "rgba(255, 255, 0, 0.6)";
      ctx.fillRect(x - 2, 30, 4, 10);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "10px monospace";
      ctx.fillText(timeValue.toLocaleTimeString().substring(0, 8), x - 20, 55);
    }

    ctx.restore();
  }

  private renderConsciousnessDimension(layer: any): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Render consciousness field visualization
    ctx.save();

    // Create consciousness gradient background
    const gradient = ctx.createLinearGradient(0, 0, this.canvas3D.width, 0);
    gradient.addColorStop(0, "rgba(128, 0, 255, 0.1)");
    gradient.addColorStop(0.5, "rgba(255, 0, 128, 0.1)");
    gradient.addColorStop(1, "rgba(0, 255, 255, 0.1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas3D.width, this.canvas3D.height);

    // Draw consciousness level indicators
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "12px monospace";
    ctx.fillText("CONSCIOUSNESS →", 10, this.canvas3D.height - 30);

    // Draw consciousness bars
    for (let i = 0; i < 10; i++) {
      const x = 20 + i * 80;
      const consciousnessLevel = (i + 1) / 10;
      const barHeight = consciousnessLevel * 50;

      // Consciousness level bar
      const barGradient = ctx.createLinearGradient(
        0,
        this.canvas3D.height - 60,
        0,
        this.canvas3D.height - 60 - barHeight,
      );
      barGradient.addColorStop(0, `rgba(128, 0, 255, ${consciousnessLevel})`);
      barGradient.addColorStop(
        1,
        `rgba(255, 0, 255, ${consciousnessLevel * 0.5})`,
      );

      ctx.fillStyle = barGradient;
      ctx.fillRect(x, this.canvas3D.height - 60 - barHeight, 15, barHeight);

      // Level label
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "10px monospace";
      ctx.fillText(
        `${consciousnessLevel.toFixed(1)}`,
        x - 2,
        this.canvas3D.height - 5,
      );
    }

    ctx.restore();
  }

  private apply5DNavigationControls(navigation: any): void {
    // Setup 5D navigation controls
    if (navigation.temporal_navigation.enabled) {
      this.setupTemporalNavigation(navigation.temporal_navigation);
    }

    if (navigation.consciousness_navigation.enabled) {
      this.setupConsciousnessNavigation(navigation.consciousness_navigation);
    }

    if (navigation.spatial_3d_navigation.enabled) {
      this.setupSpatialNavigation(navigation.spatial_3d_navigation);
    }

    console.log("🌌 Applied 5D navigation controls");
  }

  private setupTemporalNavigation(config: any): void {
    // Add temporal navigation controls
    if (config.time_scrubbing) {
      // Add time scrubber control
      const timeControl: InteractiveControl = {
        id: "temporal_scrubber",
        type: "slider",
        position: { x: 200, y: 20, z: 0 },
        size: { width: 200, height: 20 },
        function: "scrub_time",
        parameters: { range: 60000, current: 0 },
        visual_state: {
          background: { r: 255, g: 255, b: 0, a: 0.7 },
          slider_color: { r: 255, g: 200, b: 0, a: 1.0 },
          handle_color: { r: 255, g: 255, b: 255, a: 1.0 },
        },
        interaction_feedback: {
          real_time_update: true,
          value_display: true,
        },
      };

      this.state.interactive_controls.push(timeControl);
    }
  }

  private setupConsciousnessNavigation(config: any): void {
    // Add consciousness navigation controls
    if (config.consciousness_levels) {
      const consciousnessControl: InteractiveControl = {
        id: "consciousness_levels",
        type: "slider",
        position: { x: 200, y: 50, z: 0 },
        size: { width: 200, height: 20 },
        function: "adjust_consciousness_view",
        parameters: { min: 0, max: 1, current: 0.8 },
        visual_state: {
          background: { r: 128, g: 0, b: 255, a: 0.7 },
          slider_color: { r: 255, g: 0, b: 255, a: 1.0 },
          handle_color: { r: 255, g: 255, b: 255, a: 1.0 },
        },
        interaction_feedback: {
          real_time_update: true,
          value_display: true,
        },
      };

      this.state.interactive_controls.push(consciousnessControl);
    }
  }

  private setupSpatialNavigation(config: any): void {
    // Add spatial 3D navigation controls
    if (config.free_camera) {
      // Camera movement controls would be added here
      console.log("🎥 Free camera navigation enabled");
    }

    if (config.orbit_mode) {
      // Orbit controls would be added here
      console.log("🔄 Orbit camera mode enabled");
    }
  }

  private renderGlowEffect(
    glowEffect: any,
    screenPos: Position3D,
    size: any,
  ): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Create glow effect
    ctx.save();
    ctx.shadowColor = `rgba(${glowEffect.color.r}, ${glowEffect.color.g}, ${glowEffect.color.b}, ${glowEffect.color.a})`;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw glow circle
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, size.width / 2 + 5, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${glowEffect.color.r}, ${glowEffect.color.g}, ${glowEffect.color.b}, 0.1)`;
    ctx.fill();

    ctx.restore();
  }

  private renderDragHandle(dragHandle: any, screenPos: Position3D): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Render drag handle
    ctx.save();

    if (dragHandle.hover_state) {
      ctx.shadowColor = "rgba(255, 255, 0, 0.8)";
      ctx.shadowBlur = 10;
    }

    if (dragHandle.drag_state) {
      ctx.shadowColor = "rgba(0, 255, 255, 1.0)";
      ctx.shadowBlur = 15;
    }

    ctx.fillStyle = `rgba(${dragHandle.color.r}, ${dragHandle.color.g}, ${dragHandle.color.b}, ${dragHandle.color.a})`;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, dragHandle.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw drag indicator
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(screenPos.x - 4, screenPos.y);
    ctx.lineTo(screenPos.x + 4, screenPos.y);
    ctx.moveTo(screenPos.x, screenPos.y - 4);
    ctx.lineTo(screenPos.x, screenPos.y + 4);
    ctx.stroke();

    ctx.restore();
  }

  private renderMovementTrail(movementTrail: any): void {
    if (!this.context3D || !movementTrail.enabled) return;

    const ctx = this.context3D;

    // Render movement trail
    ctx.save();

    const trailPoints =
      movementTrail.current_points || movementTrail.trail_points || [];
    if (trailPoints.length < 2) return;

    const baseColor = (movementTrail?.color_gradient?.start) || movementTrail?.trail_color || { r: 0, g: 255, b: 255, a: 1 };
    ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.8)`;
    ctx.lineWidth = 2;

    ctx.beginPath();
    const firstPoint = this.worldToScreen(
      trailPoints[0].position || trailPoints[0],
    );
    ctx.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i < trailPoints.length; i++) {
      const point = this.worldToScreen(
        trailPoints[i].position || trailPoints[i],
      );
      const opacity = (i / trailPoints.length) * 0.8;

      ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity})`;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      if (i < trailPoints.length - 1) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
      }
    }

    ctx.restore();
  }

  private renderStatusIndicators(
    statusIndicators: any[],
    screenPos: Position3D,
  ): void {
    if (!this.context3D || !statusIndicators.length) return;

    const ctx = this.context3D;

    // Render status indicators above the AI
    statusIndicators.forEach((indicator, index) => {
      const indicatorY = screenPos.y - 40 - index * 15;

      ctx.fillStyle = indicator.color || "rgba(255, 255, 255, 0.8)";
      ctx.font = "10px monospace";
      ctx.fillText(
        indicator.text || indicator.status,
        screenPos.x + 20,
        indicatorY,
      );

      // Status icon
      ctx.fillStyle = indicator.icon_color || "rgba(0, 255, 0, 0.8)";
      ctx.fillRect(screenPos.x + 15, indicatorY - 8, 3, 8);
    });
  }

  private renderTaskVisualization(
    taskVisualization: any,
    screenPos: Position3D,
  ): void {
    if (!this.context3D || !taskVisualization.enabled) return;

    const ctx = this.context3D;

    // Render task progress bar
    const barWidth = 60;
    const barHeight = 6;
    const barX = screenPos.x - barWidth / 2;
    const barY = screenPos.y + 25;

    // Background bar
    ctx.fillStyle = "rgba(100, 100, 100, 0.6)";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Progress bar
    const progressWidth = barWidth * (taskVisualization.progress || 0);
    ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
    ctx.fillRect(barX, barY, progressWidth, barHeight);

    // Task name
    if (taskVisualization.current_task) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "9px monospace";
      ctx.fillText(
        taskVisualization.current_task.substring(0, 12),
        barX,
        barY - 5,
      );
    }
  }

  private renderReasoningIndicators(
    reasoningIndicators: any[],
    screenPos: Position3D,
  ): void {
    if (!this.context3D || !reasoningIndicators.length) return;

    const ctx = this.context3D;

    // Render reasoning quality indicators
    reasoningIndicators.forEach((indicator, index) => {
      const angle = (index / reasoningIndicators.length) * 2 * Math.PI;
      const radius = 35;
      const indicatorX = screenPos.x + Math.cos(angle) * radius;
      const indicatorY = screenPos.y + Math.sin(angle) * radius;

      // Reasoning dot
      const quality = indicator.quality || 0.5;
      const color =
        quality > 0.7
          ? "rgba(0, 255, 0, 0.8)"
          : quality > 0.4
            ? "rgba(255, 255, 0, 0.8)"
            : "rgba(255, 0, 0, 0.8)";

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(indicatorX, indicatorY, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  // Additional rendering methods would continue here...

  // Public API methods
  public addAIEntity(
    aiId: string,
    aiType: string,
    initialPosition: Position3D,
  ): void {
    const entity: VisualAIEntity = {
      id: aiId,
      ai_type: aiType,
      visual_representation: {
        shape: "sphere",
        size: { width: 30, height: 30, depth: 30 },
        color: { r: 100, g: 150, b: 255, a: 0.8 },
        texture: "default",
        animation: { enabled: false, type: "none", speed: 1.0 },
        glow_effect: { enabled: true, color: { r: 0, g: 150, b: 255, a: 0.5 } },
        particle_system: { enabled: false, particles: [] },
        holographic_display: { enabled: false, content: "" },
      },
      position_3d: initialPosition,
      position_5d: {
        x: initialPosition.x,
        y: initialPosition.y,
        z: initialPosition.z,
        time: Date.now() * 0.001,
        consciousness: 0.8,
        temporal_velocity: 0,
        consciousness_gradient: 0.6,
      },
      movement_trail: {
        enabled: true,
        trail_points: [],
        max_points: 20,
        fade_duration: 2000,
        color_gradient: { start: { r: 0, g: 255, b: 255, a: 1.0 } },
        particle_trail: false,
      },
      interaction_radius: 50,
      drag_handle: {
        visible: true,
        position: initialPosition,
        size: 8,
        color: { r: 255, g: 255, b: 0, a: 0.8 },
        hover_state: false,
        drag_state: false,
        constraints: [],
      },
      status_indicators: [],
      connection_lines: [],
      task_visualization: {
        enabled: true,
        current_task: "",
        progress: 0,
        visual_style: "progress_bar",
      },
      reasoning_indicators: [],
    };

    this.state.ai_entities.set(aiId, entity);
    console.log(`🤖 Added AI entity to visualization: ${aiId}`);
  }

  public updateAIPosition(aiId: string, newPosition: Position3D): void {
    const entity = this.state.ai_entities.get(aiId);
    if (entity) {
      entity.position_3d = newPosition;
      entity.position_5d.x = newPosition.x;
      entity.position_5d.y = newPosition.y;
      entity.position_5d.z = newPosition.z;

      this.addToMovementTrail(entity, newPosition);
    }
  }


  public enableUserDragging(enabled: boolean): void {
    this.state.ai_entities.forEach((entity) => {
      entity.drag_handle.visible = enabled;
    });
    console.log(`🎮 User dragging ${enabled ? "enabled" : "disabled"}`);
  }

  public getVisualizationState(): AIVisualizationState {
    return { ...this.state };
  }

  public stop(): void {
    this.isRunning = false;

    if (this.renderLoop) {
      clearInterval(this.renderLoop);
      this.renderLoop = null;
    }

    // Remove canvas
    if (this.canvas3D.parentNode) {
      this.canvas3D.parentNode.removeChild(this.canvas3D);
    }

    console.log("🎮 Interactive AI Visualization stopped");
  }

  // Helper methods (simplified implementations)

  // 5D Background Rendering
  private render5DBackground(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;
    const time = Date.now() * 0.001;

    // Create 5D consciousness background gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      this.canvas3D.width,
      this.canvas3D.height,
    );
    gradient.addColorStop(0, `rgba(0, 5, 20, 0.95)`); // Deep consciousness blue
    gradient.addColorStop(0.3, `rgba(5, 0, 25, 0.9)`); // Information purple
    gradient.addColorStop(0.6, `rgba(10, 5, 15, 0.9)`); // Quantum state
    gradient.addColorStop(1, `rgba(0, 10, 30, 0.95)`); // Possibility space

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas3D.width, this.canvas3D.height);

    // Add consciousness particles
    for (let i = 0; i < 50; i++) {
      const x =
        ((Math.sin(time * 0.5 + i * 0.1) + 1) / 2) * this.canvas3D.width;
      const y =
        ((Math.cos(time * 0.3 + i * 0.15) + 1) / 2) * this.canvas3D.height;
      const alpha = ((Math.sin(time * 2 + i) + 1) / 2) * 0.3;

      ctx.fillStyle = `rgba(100, 200, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 1 + alpha * 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  private render5DDimensionalGrid(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;
    const time = Date.now() * 0.002;

    // Information dimension grid (vertical)
    ctx.strokeStyle = `rgba(0, 255, 255, 0.2)`;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);

    for (let x = 0; x < this.canvas3D.width; x += 100) {
      const wave = Math.sin(time + x * 0.01) * 20;
      ctx.beginPath();
      ctx.moveTo(x + wave, 0);
      ctx.lineTo(x + wave, this.canvas3D.height);
      ctx.stroke();
    }

    // Consciousness dimension grid (horizontal)
    ctx.strokeStyle = `rgba(255, 0, 255, 0.2)`;
    for (let y = 0; y < this.canvas3D.height; y += 80) {
      const wave = Math.cos(time + y * 0.01) * 15;
      ctx.beginPath();
      ctx.moveTo(0, y + wave);
      ctx.lineTo(this.canvas3D.width, y + wave);
      ctx.stroke();
    }

    // Quantum coherence circles
    ctx.strokeStyle = `rgba(0, 255, 0, 0.15)`;
    ctx.setLineDash([]);
    const centerX = this.canvas3D.width / 2;
    const centerY = this.canvas3D.height / 2;

    for (let r = 50; r < 300; r += 50) {
      const radius = r + Math.sin(time * 2 + r * 0.01) * 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Temporal flow lines
    ctx.strokeStyle = `rgba(255, 255, 0, 0.1)`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = ((i + 1) * this.canvas3D.height) / 6;
      const amplitude = 30 + i * 10;
      const frequency = 0.01 + i * 0.005;

      ctx.beginPath();
      for (let x = 0; x < this.canvas3D.width; x += 5) {
        const waveY = y + Math.sin(time + x * frequency) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }
  }

  // 5D Rendering Methods
  private render5DConsciousnessField(
    entity: VisualAIEntity,
    screenPos: Position3D,
  ): void {
    if (!this.context3D) return;

    const ctx = this.context3D;
    const pos5d = entity.position_5d;

    // Validate and sanitize values to prevent non-finite errors
    const consciousness = isFinite(pos5d.consciousness)
      ? pos5d.consciousness
      : 0.5;
    const consciousnessGradient = isFinite(pos5d.consciousness_gradient)
      ? pos5d.consciousness_gradient
      : 0.3;

    // Ensure screen position is valid
    const validScreenX = isFinite(screenPos.x) ? screenPos.x : 0;
    const validScreenY = isFinite(screenPos.y) ? screenPos.y : 0;

    // Consciousness field visualization with safe values
    const consciousnessRadius = Math.max(1, Math.min(consciousness * 80, 200)); // Clamp between 1-200
    const fieldAlpha = Math.max(0, Math.min(consciousnessGradient * 0.3, 1)); // Clamp between 0-1

    // Create radial gradient for consciousness field with validated values
    const gradient = ctx.createRadialGradient(
      validScreenX,
      validScreenY,
      0,
      validScreenX,
      validScreenY,
      consciousnessRadius,
    );

    const baseColor = entity.visual_representation.color;

    // Validate color values
    const safeR = isFinite(baseColor.r)
      ? Math.max(0, Math.min(255, baseColor.r))
      : 100;
    const safeG = isFinite(baseColor.g)
      ? Math.max(0, Math.min(255, baseColor.g))
      : 100;
    const safeB = isFinite(baseColor.b)
      ? Math.max(0, Math.min(255, baseColor.b))
      : 255;

    gradient.addColorStop(
      0,
      `rgba(${safeR}, ${safeG}, ${safeB}, ${fieldAlpha})`,
    );
    gradient.addColorStop(
      0.7,
      `rgba(${safeR}, ${safeG}, ${safeB}, ${fieldAlpha * 0.5})`,
    );
    gradient.addColorStop(
      1,
      `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`,
    );

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, consciousnessRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Information dimension visualization (vertical lines) - using consciousness_gradient as fallback
    const infoHeight = Math.max(5, Math.min(consciousnessGradient * 60, 100));
    ctx.strokeStyle = `rgba(0, 255, 255, ${Math.max(0, Math.min(consciousnessGradient * 0.7, 1))})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(validScreenX, validScreenY - infoHeight);
    ctx.lineTo(validScreenX, validScreenY + infoHeight);
    ctx.stroke();

    // Temporal state visualization (pulsing effect) - using temporal_velocity as fallback
    const temporalVelocity = isFinite(pos5d.temporal_velocity)
      ? Math.abs(pos5d.temporal_velocity)
      : 0.5;
    const pulseRadius = Math.max(5, Math.min(15 + temporalVelocity * 10, 50));
    ctx.strokeStyle = `rgba(255, 255, 0, ${Math.max(0, Math.min(temporalVelocity * 0.8, 1))})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(validScreenX, validScreenY, pulseRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  private render5DDimensionalRings(
    entity: VisualAIEntity,
    screenPos: Position3D,
  ): void {
    if (!this.context3D) return;

    const ctx = this.context3D;
    const pos5d = entity.position_5d;
    const time = isFinite(Date.now() * 0.002) ? Date.now() * 0.002 : 0;

    // Validate screen position
    const validScreenX = isFinite(screenPos.x) ? screenPos.x : 0;
    const validScreenY = isFinite(screenPos.y) ? screenPos.y : 0;

    // Use available properties with fallbacks
    const consciousness = isFinite(pos5d.consciousness)
      ? pos5d.consciousness
      : 0.5;
    const consciousnessGradient = isFinite(pos5d.consciousness_gradient)
      ? pos5d.consciousness_gradient
      : 0.3;

    // Possibility dimension ring (using consciousness as fallback)
    const possibilityRadius = Math.max(
      10,
      Math.min(40 + consciousness * 30, 150),
    );
    const possibilityAlpha = Math.max(
      0,
      Math.min(consciousnessGradient * 0.6, 1),
    );

    ctx.strokeStyle = `rgba(255, 0, 255, ${possibilityAlpha})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(validScreenX, validScreenY, possibilityRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Quantum coherence ring (rotating)
    const quantumRadius = 25 + pos5d.quantum_coherence * 20;
    const segments = 8;
    ctx.strokeStyle = `rgba(0, 255, 0, ${pos5d.quantum_coherence * 0.8})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    for (let i = 0; i < segments; i++) {
      const angle =
        (i / segments) * Math.PI * 2 + time * pos5d.quantum_coherence;
      const x1 = screenPos.x + Math.cos(angle) * quantumRadius;
      const y1 = screenPos.y + Math.sin(angle) * quantumRadius;
      const x2 = screenPos.x + Math.cos(angle) * (quantumRadius + 8);
      const y2 = screenPos.y + Math.sin(angle) * (quantumRadius + 8);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 5D dimension labels
    if (this.labelsEnabled) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";

      const labelY = screenPos.y + 70;
      ctx.fillText(
        `C:${pos5d.consciousness_level.toFixed(2)}`,
        screenPos.x - 30,
        labelY,
      );
      ctx.fillText(
        `I:${pos5d.information_dimension.toFixed(2)}`,
        screenPos.x,
        labelY,
      );
      ctx.fillText(
        `Q:${pos5d.quantum_coherence.toFixed(2)}`,
        screenPos.x + 30,
        labelY,
      );
      ctx.fillText(
        `T:${pos5d.temporal_state.toFixed(2)}`,
        screenPos.x,
        labelY + 10,
      );
    }
  }

  private worldToScreen(worldPos: Position3D): Position3D {
    // Simplified version for debugging - just apply zoom for now
    let x = worldPos.x;
    let y = worldPos.y;
    let z = worldPos.z;

    // Apply simple zoom around center
    const centerX = this.canvas3D.width / 2;
    const centerY = this.canvas3D.height / 2;

    x = centerX + (x - centerX) * this.currentZoom;
    y = centerY + (y - centerY) * this.currentZoom;

    console.log(
      `worldToScreen: (${worldPos.x}, ${worldPos.y}) -> (${x}, ${y}) zoom: ${this.currentZoom}`,
    );

    return {
      x: x,
      y: y,
      z: z,
    };
  }

  private getCanvasPosition(event: MouseEvent): Position3D {
    const rect = this.canvas3D.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      z: 0,
    };
  }

  private detectEntityHit(position: Position3D): string | null {
    // Simplified hit detection
    for (const [id, entity] of this.state.ai_entities) {
      const screenPos = this.worldToScreen(entity.position_3d);
      const distance = Math.sqrt(
        Math.pow(position.x - screenPos.x, 2) +
          Math.pow(position.y - screenPos.y, 2),
      );

      if (distance < entity.visual_representation.size.width / 2) {
        return id;
      }
    }
    return null;
  }

  private applyDragConstraints(
    position: Position3D,
    constraints: DragConstraint[],
  ): Position3D {
    let constrainedPosition = { ...position };

    constraints.forEach((constraint) => {
      switch (constraint.type) {
        case "boundary":
          // Keep within canvas boundaries
          constrainedPosition.x = Math.max(
            0,
            Math.min(this.canvas3D.width, constrainedPosition.x),
          );
          constrainedPosition.y = Math.max(
            0,
            Math.min(this.canvas3D.height, constrainedPosition.y),
          );
          break;
        case "axis":
          // Lock to specific axis if needed
          if (constraint.parameters?.lock_x) constrainedPosition.x = position.x;
          if (constraint.parameters?.lock_y) constrainedPosition.y = position.y;
          break;
      }
    });

    return constrainedPosition;
  }

  private avoidCollisions(
    position: Position3D,
    collisionDetection: any,
  ): Position3D {
    if (!collisionDetection.enabled) return position;

    let safePosition = { ...position };
    const checkRadius = collisionDetection.check_radius || 50;

    // Check collision with other AIs
    for (const [otherId, otherEntity] of this.state.ai_entities) {
      const otherPos = this.worldToScreen(otherEntity.position_3d);
      const distance = Math.sqrt(
        Math.pow(safePosition.x - otherPos.x, 2) +
          Math.pow(safePosition.y - otherPos.y, 2),
      );

      if (distance < checkRadius) {
        // Move away from collision
        const dx = safePosition.x - otherPos.x;
        const dy = safePosition.y - otherPos.y;
        const pushDistance = checkRadius - distance;

        if (distance > 0) {
          safePosition.x += (dx / distance) * pushDistance;
          safePosition.y += (dy / distance) * pushDistance;
        }
      }
    }

    return safePosition;
  }

  private applySnapTargets(
    position: Position3D,
    snapTargets: SnapTarget[],
  ): Position3D {
    let snappedPosition = { ...position };

    snapTargets.forEach((target) => {
      const distance = Math.sqrt(
        Math.pow(position.x - target.position.x, 2) +
          Math.pow(position.y - target.position.y, 2),
      );

      if (distance < target.snap_distance) {
        // Apply snap with strength
        const snapStrength = target.snap_strength;
        snappedPosition.x =
          position.x + (target.position.x - position.x) * snapStrength;
        snappedPosition.y =
          position.y + (target.position.y - position.y) * snapStrength;
      }
    });

    return snappedPosition;
  }

  private addToMovementTrail(
    entity: VisualAIEntity,
    position: Position3D,
  ): void {
    if (!entity.movement_trail.enabled) return;

    const trailPoint: TrailPoint = {
      position: { ...position },
      timestamp: new Date(),
      velocity: { x: 0, y: 0, z: 0 }, // Would calculate from previous positions
      opacity: 1.0,
      size: 1.0,
    };

    entity.movement_trail.trail_points.push(trailPoint);

    // Keep only max points
    if (
      entity.movement_trail.trail_points.length >
      entity.movement_trail.max_points
    ) {
      entity.movement_trail.trail_points.shift();
    }
  }

  private detectControlHit(position: Position3D): InteractiveControl | null {
    return (
      this.state.interactive_controls.find((control) => {
        return (
          position.x >= control.position.x &&
          position.x <= control.position.x + control.size.width &&
          position.y >= control.position.y &&
          position.y <= control.position.y + control.size.height
        );
      }) || null
    );
  }

  private executeControlFunction(control: InteractiveControl): void {
    console.log(`🎮 Executing control function: ${control.function}`);

    switch (control.function) {
      case "switch_view_mode":
        this.switchViewMode();
        break;
      case "zoom_in":
        this.adjustZoom(1.2);
        break;
      case "zoom_out":
        this.adjustZoom(0.8);
        break;
      case "adjust_ai_speed":
        this.adjustAISpeed(control.parameters.current);
        break;
      case "toggle_visualization_option":
        this.toggleVisualizationOption(control.parameters.option);
        break;
      case "emergency_stop_all_ais":
        this.emergencyStopAllAIs();
        break;
    }
  }

  private switchViewMode(): void {
    const modes: ("3d" | "5d" | "overlay" | "height_perspective")[] = [
      "3d",
      "5d",
      "overlay",
      "height_perspective",
    ];
    const currentIndex = modes.indexOf(this.state.view_mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.state.view_mode = modes[nextIndex];

    // Update control text
    const control = this.state.interactive_controls.find(
      (c) => c.id === "view_mode_selector",
    );
    if (control) {
      control.visual_state.text = `${this.state.view_mode.toUpperCase()} View`;
    }

    console.log(`🎮 Switched to ${this.state.view_mode} view mode`);
  }

  private adjustZoom(factor: number): void {
    // Zoom adjustment implementation
    console.log(`🔍 Zoom adjusted by factor: ${factor}`);
  }

  private adjustAISpeed(speed: number): void {
    // AI speed adjustment implementation
    console.log(`⚡ AI speed adjusted to: ${speed}`);
  }

  private toggleVisualizationOption(option: string): void {
    const control = this.state.interactive_controls.find(
      (c) => c.id === option,
    );
    if (control) {
      const enabled = !control.parameters.enabled;
      control.parameters.enabled = enabled;
      control.visual_state.background = enabled
        ? { r: 0, g: 150, b: 0, a: 0.8 }
        : { r: 100, g: 100, b: 100, a: 0.8 };

      console.log(`🔧 ${option} ${enabled ? "enabled" : "disabled"}`);
    }
  }

  private emergencyStopAllAIs(): void {
    if (confirm("Are you sure you want to stop all AIs?")) {
      this.state.ai_entities.forEach((entity) => {
        entity.status_indicators.push({
          status: "STOPPED",
          color: "rgba(255, 0, 0, 1.0)",
          icon_color: "rgba(255, 0, 0, 1.0)",
        });
      });
      console.log("🚨 Emergency stop activated for all AIs");
    }
  }

  private updateHoverStates(position: Position3D): void {
    // Update hover states for entities and controls
    this.state.ai_entities.forEach((entity) => {
      const screenPos = this.worldToScreen(entity.position_3d);
      const distance = Math.sqrt(
        Math.pow(position.x - screenPos.x, 2) +
          Math.pow(position.y - screenPos.y, 2),
      );

      entity.drag_handle.hover_state = distance < entity.interaction_radius;
    });

    // Update control hover states
    this.state.interactive_controls.forEach((control) => {
      const isHovered =
        position.x >= control.position.x &&
        position.x <= control.position.x + control.size.width &&
        position.y >= control.position.y &&
        position.y <= control.position.y + control.size.height;

      // Update hover visual state if needed
      if (isHovered && control.visual_state.hover_effect) {
        // Apply hover effect
      }
    });
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      this.handleMouseDown(mouseEvent);
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      this.handleMouseMove(mouseEvent);
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {
      clientX: 0,
      clientY: 0,
    });
    this.handleMouseUp(mouseEvent);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "Escape":
        if (this.dragState.active) {
          this.dragState = { active: false, target: null };
        }
        break;
      case "1":
        this.setViewMode("3d");
        break;
      case "2":
        this.setViewMode("5d");
        break;
      case "3":
        this.setViewMode("overlay");
        break;
      case "4":
        this.setViewMode("height_perspective");
        break;
    }
  }


  private renderAIConnections(): void {
    if (!this.context3D || !this.connectionsEnabled) return;

    const ctx = this.context3D;

    // Render connections between AIs
    this.state.ai_entities.forEach((entity) => {
      entity.connection_lines.forEach((connection) => {
        const targetEntity = this.state.ai_entities.get(connection.target_id);
        if (targetEntity) {
          const startPos = this.worldToScreen(entity.position_3d);
          const endPos = this.worldToScreen(targetEntity.position_3d);

          ctx.strokeStyle = `rgba(${connection.color.r}, ${connection.color.g}, ${connection.color.b}, ${connection.opacity})`;
          ctx.lineWidth = connection.width || 2;

          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(endPos.x, endPos.y);
          ctx.stroke();
        }
      });
    });
  }

  private renderMazeVisualization(maze: MazeVisualization): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Render maze projection for AI
    const entity = this.state.ai_entities.get(maze.ai_id);
    if (!entity) return;

    const centerPos = this.worldToScreen(entity.position_3d);

    // Draw projection area
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      centerPos.x - maze.maze_projection.projection_area.width / 2,
      centerPos.y - maze.maze_projection.projection_area.height / 2,
      maze.maze_projection.projection_area.width,
      maze.maze_projection.projection_area.height,
    );

    // Render obstacles
    maze.obstacle_visualization.forEach((obstacle) => {
      const obstaclePos = this.worldToScreen(obstacle.position);
      const dangerColor =
        obstacle.danger_level === "critical"
          ? "rgba(255, 0, 0, 0.8)"
          : obstacle.danger_level === "high"
            ? "rgba(255, 100, 0, 0.6)"
            : obstacle.danger_level === "medium"
              ? "rgba(255, 255, 0, 0.4)"
              : "rgba(100, 255, 100, 0.3)";

      ctx.fillStyle = dangerColor;
      ctx.fillRect(obstaclePos.x - 5, obstaclePos.y - 5, 10, 10);
    });

    // Render path options
    maze.path_options.forEach((path) => {
      ctx.strokeStyle =
        path.path_type === "optimal"
          ? "rgba(0, 255, 0, 0.8)"
          : path.path_type === "alternative"
            ? "rgba(0, 0, 255, 0.6)"
            : "rgba(255, 255, 0, 0.4)";
      ctx.lineWidth = 2;

      if (path.waypoints.length > 1) {
        ctx.beginPath();
        const firstWaypoint = this.worldToScreen(path.waypoints[0]);
        ctx.moveTo(firstWaypoint.x, firstWaypoint.y);

        for (let i = 1; i < path.waypoints.length; i++) {
          const waypoint = this.worldToScreen(path.waypoints[i]);
          ctx.lineTo(waypoint.x, waypoint.y);
        }
        ctx.stroke();
      }
    });
  }

  private renderTrafficFlow(traffic: TrafficFlow): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Render traffic flow visualization
    const entity = this.state.ai_entities.get(traffic.ai_id);
    if (!entity) return;

    const startPos = this.worldToScreen(entity.position_3d);

    // Draw traffic flow indicator
    const flowLength = 50 * traffic.intensity;
    const endX = startPos.x + traffic.direction.x * flowLength;
    const endY = startPos.y + traffic.direction.y * flowLength;

    const flowColor =
      traffic.flow_type === "incoming"
        ? "rgba(255, 0, 0, 0.6)"
        : traffic.flow_type === "outgoing"
          ? "rgba(0, 255, 0, 0.6)"
          : "rgba(0, 0, 255, 0.6)";

    ctx.strokeStyle = flowColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw arrow head
    const angle = Math.atan2(traffic.direction.y, traffic.direction.x);
    const arrowLength = 10;

    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - Math.PI / 6),
      endY - arrowLength * Math.sin(angle - Math.PI / 6),
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + Math.PI / 6),
      endY - arrowLength * Math.sin(angle + Math.PI / 6),
    );
    ctx.stroke();
  }

  private updateAnimations(): void {
    // Update any running animations
    this.state.ai_entities.forEach((entity) => {
      if (entity.visual_representation.animation.enabled) {
        // Update animation state
        const animation = entity.visual_representation.animation;
        // Animation logic would be implemented here
      }
    });
  }

  private render5DOverlays(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Only render 5D overlays if in 5D mode
    if (this.state.view_mode !== "5d") return;

    ctx.save();

    // Render temporal dimension overlay
    this.renderTemporalOverlay();

    // Render consciousness dimension overlay
    this.renderConsciousnessOverlay();

    // Render 5D coordinate system
    this.render5DCoordinateSystem();

    // Render 5D AI positions with temporal/consciousness indicators
    this.render5DAIPositions();

    ctx.restore();
  }

  private renderTemporalOverlay(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Draw temporal grid overlay
    ctx.strokeStyle = "rgba(255, 255, 0, 0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    // Vertical time lines
    for (let i = 0; i < 8; i++) {
      const x = (this.canvas3D.width / 8) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas3D.height);
      ctx.stroke();
    }

    // Temporal flow indicators
    const currentTime = Date.now();
    for (let i = 0; i < 6; i++) {
      const x = 100 + i * 150;
      const y = 40;

      // Time flow arrow
      ctx.strokeStyle = "rgba(255, 255, 0, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20, y);
      ctx.lineTo(x + 15, y - 5);
      ctx.moveTo(x + 20, y);
      ctx.lineTo(x + 15, y + 5);
      ctx.stroke();

      // Time label
      ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
      ctx.font = "10px monospace";
      const timeLabel = `T${i}`;
      ctx.fillText(timeLabel, x, y - 10);
    }
  }

  private renderConsciousnessOverlay(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Draw consciousness field overlay with validated values
    const centerX = this.validateNumber(this.canvas3D.width / 2, 400);
    const centerY = this.validateNumber(this.canvas3D.height / 2, 300);
    const radius = this.validateNumber(this.canvas3D.width / 2, 200, 1, 1000);

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius,
    );
    gradient.addColorStop(0, "rgba(255, 0, 255, 0.1)");
    gradient.addColorStop(0.5, "rgba(128, 0, 255, 0.05)");
    gradient.addColorStop(1, "rgba(0, 0, 255, 0.02)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas3D.width, this.canvas3D.height);

    // Consciousness level rings
    for (let i = 1; i <= 5; i++) {
      const radius = (this.canvas3D.width / 10) * i;
      const consciousnessLevel = i / 5;

      ctx.strokeStyle = `rgba(255, 0, 255, ${consciousnessLevel * 0.3})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.arc(
        this.canvas3D.width / 2,
        this.canvas3D.height / 2,
        radius,
        0,
        2 * Math.PI,
      );
      ctx.stroke();

      // Level label
      ctx.fillStyle = `rgba(255, 0, 255, ${consciousnessLevel * 0.8})`;
      ctx.font = "12px monospace";
      ctx.fillText(
        `C${consciousnessLevel.toFixed(1)}`,
        this.canvas3D.width / 2 + radius - 20,
        this.canvas3D.height / 2 - 5,
      );
    }
  }

  private render5DCoordinateSystem(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    const centerX = this.canvas3D.width / 2;
    const centerY = this.canvas3D.height / 2;

    // Draw 5D axes
    const axisLength = 100;

    // X axis (red)
    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - axisLength, centerY);
    ctx.lineTo(centerX + axisLength, centerY);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
    ctx.font = "14px monospace";
    ctx.fillText("X", centerX + axisLength + 5, centerY + 5);

    // Y axis (green)
    ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - axisLength);
    ctx.lineTo(centerX, centerY + axisLength);
    ctx.stroke();
    ctx.fillStyle = "rgba(0, 255, 0, 0.9)";
    ctx.fillText("Y", centerX + 5, centerY - axisLength - 5);

    // Z axis (blue) - diagonal to show depth
    ctx.strokeStyle = "rgba(0, 0, 255, 0.8)";
    ctx.beginPath();
    ctx.moveTo(centerX - axisLength * 0.7, centerY + axisLength * 0.7);
    ctx.lineTo(centerX + axisLength * 0.7, centerY - axisLength * 0.7);
    ctx.stroke();
    ctx.fillStyle = "rgba(0, 0, 255, 0.9)";
    ctx.fillText(
      "Z",
      centerX + axisLength * 0.7 + 5,
      centerY - axisLength * 0.7 - 5,
    );

    // Time axis (yellow) - curved to show temporal dimension
    ctx.strokeStyle = "rgba(255, 255, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, axisLength * 0.8, 0, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 0, 0.9)";
    ctx.fillText("T", centerX + axisLength * 0.6, centerY + axisLength * 0.6);

    // Consciousness axis (magenta) - spiral to show consciousness dimension
    ctx.strokeStyle = "rgba(255, 0, 255, 0.8)";
    ctx.beginPath();
    for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
      const radius = (angle / (Math.PI * 4)) * axisLength * 0.5;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 0, 255, 0.9)";
    ctx.fillText("C", centerX + 5, centerY + 5);
  }

  private render5DAIPositions(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Render AIs with 5D position indicators
    this.state.ai_entities.forEach((entity) => {
      const screenPos = this.worldToScreen(entity.position_3d);

      // Enhanced 5D visualization for each AI
      this.render5DAIEntity(entity, screenPos);
    });
  }

  private render5DAIEntity(
    entity: VisualAIEntity,
    screenPos: Position3D,
  ): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Render main AI entity (from parent method)
    this.renderAIShape(entity, screenPos);

    // Add 5D specific overlays

    // Temporal trail
    if (entity.position_5d.temporal_velocity !== 0) {
      const trailLength = Math.abs(entity.position_5d.temporal_velocity) * 50;
      ctx.strokeStyle = "rgba(255, 255, 0, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);

      ctx.beginPath();
      ctx.moveTo(screenPos.x, screenPos.y);
      ctx.lineTo(screenPos.x + trailLength, screenPos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Consciousness glow with validation
    const consciousnessLevel = this.validateNumber(
      entity.position_5d.consciousness,
      0.5,
      0,
      1,
    );
    const glowRadius = this.validateNumber(consciousnessLevel * 30, 15, 1, 100);
    const validScreenX = this.validateNumber(screenPos.x, 0);
    const validScreenY = this.validateNumber(screenPos.y, 0);

    const gradient = ctx.createRadialGradient(
      validScreenX,
      validScreenY,
      0,
      validScreenX,
      validScreenY,
      glowRadius,
    );
    gradient.addColorStop(0, `rgba(255, 0, 255, ${consciousnessLevel * 0.3})`);
    gradient.addColorStop(1, `rgba(255, 0, 255, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, glowRadius, 0, 2 * Math.PI);
    ctx.fill();

    // 5D coordinates display
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "9px monospace";
    const coords5D = `(${entity.position_5d.x.toFixed(0)}, ${entity.position_5d.y.toFixed(0)}, ${entity.position_5d.z.toFixed(0)}, ${entity.position_5d.time}, ${entity.position_5d.consciousness.toFixed(2)})`;
    ctx.fillText(coords5D, screenPos.x - 40, screenPos.y + 40);
  }

  private renderInteractiveControls(): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    // Render all interactive controls
    this.state.interactive_controls.forEach((control) => {
      this.renderControl(control);
    });
  }

  private renderControl(control: InteractiveControl): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    ctx.save();

    // Set control styles
    const bg = control.visual_state.background;
    ctx.fillStyle = `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})`;

    if (control.visual_state.border) {
      const border = control.visual_state.border;
      ctx.strokeStyle = `rgba(${border.r}, ${border.g}, ${border.b}, ${border.a})`;
      ctx.lineWidth = 2;
    }

    // Render based on control type
    switch (control.type) {
      case "button":
        this.renderButtonControl(control);
        break;
      case "slider":
        this.renderSliderControl(control);
        break;
      case "joystick":
        this.renderJoystickControl(control);
        break;
      default:
        this.renderButtonControl(control); // Default to button
    }

    ctx.restore();
  }

  private renderButtonControl(control: InteractiveControl): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    const x = control.position.x;
    const y = control.position.y;
    const width = control.size.width;
    const height = control.size.height;

    // Button background
    ctx.fillRect(x, y, width, height);

    // Button border
    if (control.visual_state.border) {
      ctx.strokeRect(x, y, width, height);
    }

    // Button text
    if (control.visual_state.text) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = `${control.visual_state.font_size || 12}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(control.visual_state.text, x + width / 2, y + height / 2);
    }

    // Pulse animation for special buttons
    if (control.visual_state.pulse_animation) {
      const pulseAlpha = ((Math.sin(Date.now() / 200) + 1) / 2) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
      ctx.fillRect(x, y, width, height);
    }
  }

  private renderSliderControl(control: InteractiveControl): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    const x = control.position.x;
    const y = control.position.y;
    const width = control.size.width;
    const height = control.size.height;

    // Slider track
    ctx.fillRect(x, y, width, height);

    // Slider handle
    const params = control.parameters;
    const progress = (params.current - params.min) / (params.max - params.min);
    const handleX = x + progress * (width - 10);

    if (control.visual_state.handle_color) {
      const handle = control.visual_state.handle_color;
      ctx.fillStyle = `rgba(${handle.r}, ${handle.g}, ${handle.b}, ${handle.a})`;
    }
    ctx.fillRect(handleX, y - 2, 10, height + 4);

    // Value display
    if (control.interaction_feedback?.value_display) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "10px monospace";
      ctx.fillText(params.current.toFixed(2), x + width + 5, y + height / 2);
    }
  }

  private renderJoystickControl(control: InteractiveControl): void {
    if (!this.context3D) return;

    const ctx = this.context3D;

    const centerX = control.position.x + control.size.width / 2;
    const centerY = control.position.y + control.size.height / 2;
    const radius = Math.min(control.size.width, control.size.height) / 2;

    // Joystick base
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Joystick stick (center for now)
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Public method to ensure canvas and controls are visible
  public showCanvas(): void {
    if (this.canvas3D) {
      this.canvas3D.style.display = "block";
      console.log("✅ AI Visualization Canvas is now visible");
    }

    const controlPanel = document.getElementById("ai-viz-test-controls");
    if (controlPanel) {
      controlPanel.style.display = "block";
      console.log("✅ Test controls are now visible");
    } else {
      this.createTestControlPanel();
    }

    this.updateDebugInfo();
  }

  public hideCanvas(): void {
    if (this.canvas3D) {
      this.canvas3D.style.display = "none";
    }

    const controlPanel = document.getElementById("ai-viz-test-controls");
    if (controlPanel) {
      controlPanel.style.display = "none";
    }
  }

  // Additional helper methods would be implemented here...

  // Validation utility to prevent non-finite values in canvas operations
  private validatePosition(pos: any): Position3D {
    return {
      x: isFinite(pos.x) ? pos.x : 0,
      y: isFinite(pos.y) ? pos.y : 0,
      z: isFinite(pos.z) ? pos.z : 0,
    };
  }

  private validateNumber(
    value: number,
    fallback: number = 0,
    min?: number,
    max?: number,
  ): number {
    let result = isFinite(value) ? value : fallback;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    return result;
  }

  // Safe canvas operation wrapper to catch non-finite value errors
  private safeCanvasOperation(
    operation: () => void,
    errorMessage: string = "Canvas operation failed",
  ): void {
    try {
      operation();
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      // Log the error to our console monitoring system
      if (typeof window !== "undefined" && window.consoleMonitor) {
        setTimeout(() => {
          console.error(`AI Visualization Error: ${errorMessage}`, error);
        }, 10);
      }
    }
  }
}

// Supporting classes
class CameraControls {
  // Camera control implementation
}

class InteractionHandler {
  // Interaction handling implementation
}

// Initialize immediately
console.log("🎮 Initializing Interactive AI Visualization...");

// Global instance
export const interactiveAIVisualization = new InteractiveAIVisualization();

// Make available globally with immediate setup
(window as any).interactiveAIVisualization = interactiveAIVisualization;

// Simple global functions that definitely work
(window as any).testCanvas = function () {
  console.log("🧪 TEST CANVAS FUNCTION CALLED");
  alert("🧪 Testing canvas...");

  const canvas = document.getElementById(
    "ai-visualization-canvas",
  ) as HTMLCanvasElement;
  if (!canvas) {
    alert("❌ Canvas not found! Creating new one...");
    // Force create a new canvas
    const newCanvas = document.createElement("canvas");
    newCanvas.id = "ai-visualization-canvas";
    newCanvas.width = 1200;
    newCanvas.height = 800;
    newCanvas.style.position = "fixed";
    newCanvas.style.top = "20px";
    newCanvas.style.left = "20px";
    newCanvas.style.zIndex = "9999";
    newCanvas.style.border = "5px solid #ff0000";
    newCanvas.style.background = "rgba(0, 0, 40, 1)";
    document.body.appendChild(newCanvas);

    const ctx = newCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "EMERGENCY CANVAS",
        newCanvas.width / 2,
        newCanvas.height / 2,
      );
    }
    alert("✅ Emergency canvas created and should be visible!");
    return;
  }

  // Test existing canvas
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("CANVAS TEST SUCCESS", canvas.width / 2, canvas.height / 2);
    alert("✅ Canvas test complete! Should show red background.");
  }
};

(window as any).makeAIs = function () {
  console.log("🤖 MAKE AIs FUNCTION CALLED");
  alert("🤖 Creating AIs...");

  const canvas = document.getElementById(
    "ai-visualization-canvas",
  ) as HTMLCanvasElement;
  if (!canvas) {
    alert("❌ No canvas found! Run testCanvas() first!");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.fillStyle = "rgba(0, 0, 40, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw simple AI entities
  const ais = [
    { x: 300, y: 200, color: "#ff0000", name: "AI-1" },
    { x: 600, y: 200, color: "#00ff00", name: "AI-2" },
    { x: 900, y: 200, color: "#0000ff", name: "AI-3" },
    { x: 450, y: 400, color: "#ffff00", name: "AI-4" },
    { x: 750, y: 400, color: "#ff00ff", name: "AI-5" },
  ];

  ais.forEach((ai) => {
    // Draw AI circle
    ctx.fillStyle = ai.color;
    ctx.beginPath();
    ctx.arc(ai.x, ai.y, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Draw AI label
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(ai.name, ai.x, ai.y + 50);
  });

  alert("✅ 5 AI entities created and should be visible on canvas!");
};

// Initialize everything immediately
console.log("✅ Interactive AI Visualization initialized");
console.log("🎮 Available console commands:");
console.log("   testCanvas() - Test the canvas");
console.log("   makeAIs() - Create AI entities");

// Auto-show canvas info
setTimeout(() => {
  const canvas = document.getElementById("ai-visualization-canvas");
  if (canvas) {
    console.log("✅ AI Visualization Canvas is visible in DOM");
  } else {
    console.warn("⚠️ AI Visualization Canvas not found in DOM");
  }
}, 2000);
