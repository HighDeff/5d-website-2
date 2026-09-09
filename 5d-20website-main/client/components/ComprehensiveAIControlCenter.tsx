import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Activity,
  Zap,
  Brain,
  MapPin,
  Users,
  Sliders,
  BarChart3,
  Target,
  Cpu,
  Database,
  Network,
  Eye,
  Move,
  RefreshCw,
  Command,
  Layers,
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Bot,
  Sparkles,
  Plus,
} from "lucide-react";
import { aiCentralCommand } from "../services/AICentralCommand";
import { enhanced5DSystem } from "../services/Enhanced5DSystem";
import ConsoleMonitorTab from "./ConsoleMonitorTab";
import MovableAIPanel from "./MovableAIPanel";
import AIDiagnosticConsole from "./AIDiagnosticConsole";
import { recursiveMemorySystem } from "../services/RecursiveMemorySystem";
import { multiLayerCoordination } from "../services/MultiLayerCoordination";
import { reverseThinkingEngine } from "../services/ReverseThinkingEngine";
import { fieldManipulationSystem } from "../services/FieldManipulationSystem";
import { aiRegeneration } from "../services/AIRegeneration";
import { interactiveAIVisualization } from "../services/InteractiveAIVisualization";

interface AIMetrics {
  consciousness_level: number;
  processing_power: number;
  memory_usage: number;
  task_completion: number;
  field_stability: number;
  wave_frequency: number;
  concurrency_level: number;
  goal_progress: number;
}

interface AIEntity {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
  status: "active" | "idle" | "processing" | "error";
  consciousness_level: number;
  task_queue: number;
  specialization: string[];
  avatar_color: string;
  processing_threads: number;
  concurrency_factor: number;
}

interface SystemCommand {
  id: string;
  command: string;
  description: string;
  parameters: any[];
  risk_level: "low" | "medium" | "high" | "critical";
  requires_confirmation: boolean;
}

export const ComprehensiveAIControlCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "settings"
    | "map"
    | "commands"
    | "concurrency"
    | "monitoring"
    | "goals"
    | "console"
    | "detection"
  >("map");
  const [isSystemRunning, setIsSystemRunning] = useState(true);
  const [aiEntities, setAIEntities] = useState<AIEntity[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<AIMetrics>({
    consciousness_level: 75,
    processing_power: 85,
    memory_usage: 60,
    task_completion: 92,
    field_stability: 88,
    wave_frequency: 45,
    concurrency_level: 70,
    goal_progress: 68,
  });
  const [selectedAI, setSelectedAI] = useState<string>("");
  const [systemCommands, setSystemCommands] = useState<SystemCommand[]>([]);
  const [concurrencyModulator, setConcurrencyModulator] = useState(100);
  const [autoRetry, setAutoRetry] = useState(true);
  const [mapView, setMapView] = useState<"2d" | "3d" | "5d">("3d");
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [commandHistory, setCommandHistory] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const [activeGoals, setActiveGoals] = useState<any[]>([]);
  const [aiTasks, setAITasks] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [aiTrails, setAITrails] = useState<Map<string, any[]>>(new Map());
  const [showGateways, setShowGateways] = useState(true);
  const [showPathways, setShowPathways] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showHeatTrails, setShowHeatTrails] = useState(true);
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0, z: 0 });
  const [selectedAIData, setSelectedAIData] = useState<any>(null);
  const [waveTypes, setWaveTypes] = useState<string[]>([
    "consciousness",
    "data",
    "temporal",
    "magnetic",
    "quantum",
  ]);
  const [magneticFields, setMagneticFields] = useState<any[]>([]);
  const [gateways, setGateways] = useState<any[]>([]);
  const [pathways, setPathways] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [emotionDetection, setEmotionDetection] = useState<any[]>([]);
  const [movementPatterns, setMovementPatterns] = useState<Map<string, any[]>>(
    new Map(),
  );
  const [habitAnalysis, setHabitAnalysis] = useState<Map<string, any>>(
    new Map(),
  );
  const [detectionLayers, setDetectionLayers] = useState<any[]>([]);
  const [aiDebugging, setAIDebugging] = useState<any[]>([]);
  const [codeAnalysis, setCodeAnalysis] = useState<any[]>([]);
  const [showEmotionLayer, setShowEmotionLayer] = useState(true);
  const [showHabitLayer, setShowHabitLayer] = useState(true);
  const [showDebuggingLayer, setShowDebuggingLayer] = useState(true);
  const [emotionSensitivity, setEmotionSensitivity] = useState(0.7);
  const [habitThreshold, setHabitThreshold] = useState(5);
  const [diagnosticLogs, setDiagnosticLogs] = useState<any[]>([]);
  const [autoRepairEnabled, setAutoRepairEnabled] = useState(true);
  const [showDiagnosticLogs, setShowDiagnosticLogs] = useState(false);
  const [autoRepairHistory, setAutoRepairHistory] = useState<any[]>([]);
  const [systemErrors, setSystemErrors] = useState<any[]>([]);
  const [performanceAlerts, setPerformanceAlerts] = useState<any[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initRetryCountRef = useRef<number>(0);
  const uniqueIdRef = useRef<number>(0);

  useEffect(() => {
    // Delay initialization to ensure canvas is ready
    const timer = setTimeout(() => {
      initializeControlCenter();
      if (realTimeUpdates) {
        startRealTimeUpdates();
      }
      // Force canvas initialization regardless of active tab
      setTimeout(() => {
        initializeMapVisualization();
      }, 300);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [realTimeUpdates]);

  // Additional effect to reinitialize when map tab becomes active
  useEffect(() => {
    if (activeTab === "map") {
      console.log("🗺️ Map tab activated, reinitializing...");
      setTimeout(() => {
        initializeMapVisualization();
      }, 100);
    }
  }, [activeTab]);

  const initializeControlCenter = async () => {
    try {
      console.log("🎮 Starting AI Control Center initialization...");

      // Comprehensive system diagnostic
      await performInitializationDiagnostic();

      // Load AI entities
      const entities = await loadAIEntities();
      console.log(`���� Setting ${entities.length} AI entities`);
      setAIEntities(entities);

      // Load system commands
      const commands = await loadSystemCommands();
      setSystemCommands(commands);

      // Initialize 5D systems
      initialize5DSystems();

      console.log("��� AI Control Center initialization complete");
    } catch (error) {
      console.error("❌ Control Center initialization failed:", error);
    }
  };

  const performInitializationDiagnostic = async () => {
    console.log("🔍 Performing comprehensive system diagnostic...");

    const diagnosticResults = {
      importedSystems: [],
      missingMethods: [],
      performanceIssues: [],
    };

    // Check all imported systems
    const systemChecks = [
      { name: "aiCentralCommand", system: aiCentralCommand },
      { name: "enhanced5DSystem", system: enhanced5DSystem },
      { name: "recursiveMemorySystem", system: recursiveMemorySystem },
      { name: "reverseThinkingEngine", system: reverseThinkingEngine },
      { name: "fieldManipulationSystem", system: fieldManipulationSystem },
      { name: "aiRegeneration", system: aiRegeneration },
    ];

    for (const check of systemChecks) {
      if (check.system) {
        diagnosticResults.importedSystems.push(check.name);

        // Check for specific methods
        const expectedMethods = getExpectedMethods(check.name);
        expectedMethods.forEach((method) => {
          if (!check.system[method]) {
            diagnosticResults.missingMethods.push(`${check.name}.${method}`);
          }
        });
      } else {
        diagnosticResults.missingMethods.push(`Missing system: ${check.name}`);
      }
    }

    console.log("📊 Diagnostic Results:", diagnosticResults);

    // Setup automatic method checking
    setupAutomaticMethodChecking();

    return diagnosticResults;
  };

  const getExpectedMethods = (systemName: string): string[] => {
    const methodMap = {
      enhanced5DSystem: [
        "createRecursionLayer",
        "processInfiniteLoop",
        "waveBounce",
      ],
      recursiveMemorySystem: ["validateDatabaseConnection", "processUserTask"],
      reverseThinkingEngine: [
        "generateStrategy",
        "createReverseThinkingPattern",
      ],
      fieldManipulationSystem: ["performFieldSensing", "detectEmotionalField"],
      aiRegeneration: ["regenerateAI", "createPositionalAI"],
      aiCentralCommand: ["startSystem", "processUserRequest"],
    };
    return methodMap[systemName] || [];
  };

  const setupAutomaticMethodChecking = () => {
    console.log("🤖 Setting up automatic method checking...");

    // Random method verification every 30 seconds
    setInterval(() => {
      performRandomMethodCheck();
    }, 30000);

    // Deep analysis every 5 minutes
    setInterval(() => {
      performDeepSystemAnalysis();
    }, 300000);
  };

  const performRandomMethodCheck = () => {
    const methodsToCheck = [
      "updateAIEntities",
      "analyzeMovementEmotion",
      "performAIDebugging",
      "calculateGoalBasedMovement",
    ];

    const randomMethod =
      methodsToCheck[Math.floor(Math.random() * methodsToCheck.length)];
    console.log(`🎲 Random method check: ${randomMethod}`);

    // Verify method is still functioning correctly
    try {
      switch (randomMethod) {
        case "updateAIEntities":
          if (aiEntities.length === 0) {
            console.warn("⚠️ No AI entities to update - potential issue");
          }
          break;
        case "analyzeMovementEmotion":
          if (emotionDetection.length === 0 && aiEntities.length > 0) {
            console.warn("⚠️ No emotions detected despite active AIs");
          }
          break;
      }
    } catch (error) {
      console.error(`❌ Method check failed for ${randomMethod}:`, error);
    }
  };

  const performDeepSystemAnalysis = () => {
    console.log("🔬 Performing deep system analysis...");

    const analysis = {
      aiEntityHealth: {
        totalEntities: aiEntities.length,
        activeEntities: aiEntities.filter((ai) => ai.status === "active")
          .length,
        averageConsciousness:
          aiEntities.reduce((sum, ai) => sum + ai.consciousness_level, 0) /
          (aiEntities.length || 1),
        entitiesWithTasks: aiEntities.filter((ai) => ai.task_queue > 0).length,
      },
      emotionSystemHealth: {
        totalEmotions: emotionDetection.length,
        uniqueEmotions: new Set(emotionDetection.map((e) => e.emotion)).size,
        recentEmotions: emotionDetection.filter(
          (e) => Date.now() - e.timestamp < 10000,
        ).length,
      },
      debuggingSystemHealth: {
        totalIssues: aiDebugging.length,
        criticalIssues: aiDebugging.filter((d) => d.severity === "critical")
          .length,
      },
    };

    console.log("📈 Deep Analysis Results:", analysis);

    // Auto-implement improvements
    if (analysis.debuggingSystemHealth.criticalIssues > 3) {
      console.log("🆘 Auto-response: Critical issues detected");
      autoRepairCriticalIssues();
    }
  };

  const autoRepairCriticalIssues = () => {
    const criticalIssues = aiDebugging.filter((d) => d.severity === "critical");

    criticalIssues.forEach((issue) => {
      const ai = aiEntities.find((a) => a.id === issue.aiId);
      if (!ai) return;

      switch (issue.type) {
        case "potential_infinite_loop":
          setAIEntities((prev) =>
            prev.map((entity) =>
              entity.id === ai.id
                ? {
                    ...entity,
                    processing_threads: 4,
                    task_queue: Math.min(entity.task_queue, 5),
                  }
                : entity,
            ),
          );
          console.log(`🔧 Auto-repaired infinite loop for AI ${ai.id}`);
          break;
        case "position_anomaly":
          setAIEntities((prev) =>
            prev.map((entity) =>
              entity.id === ai.id
                ? {
                    ...entity,
                    position: { x: 400, y: 300, z: 50 },
                  }
                : entity,
            ),
          );
          console.log(`🔧 Auto-repaired position anomaly for AI ${ai.id}`);
          break;
      }
    });
  };

  const initialize5DSystems = () => {
    // Initialize gateways (data centers, portals, etc.)
    const initialGateways = [
      {
        id: "dc1",
        type: "data_center",
        x: 150,
        y: 150,
        z: 0,
        size: 40,
        status: "active",
      },
      {
        id: "dc2",
        type: "data_center",
        x: 650,
        y: 450,
        z: 0,
        size: 40,
        status: "active",
      },
      {
        id: "portal1",
        type: "dimensional_portal",
        x: 400,
        y: 100,
        z: 50,
        size: 30,
        status: "active",
      },
      {
        id: "portal2",
        type: "dimensional_portal",
        x: 200,
        y: 500,
        z: 50,
        size: 30,
        status: "active",
      },
      {
        id: "gateway1",
        type: "quantum_gateway",
        x: 600,
        y: 200,
        z: 100,
        size: 35,
        status: "active",
      },
    ];
    setGateways(initialGateways);

    // Initialize magnetic fields
    const initialFields = [
      {
        id: "field1",
        x: 300,
        y: 300,
        radius: 80,
        strength: 2,
        phase: 0,
        type: "attractive",
      },
      {
        id: "field2",
        x: 500,
        y: 200,
        radius: 60,
        strength: -1.5,
        phase: Math.PI,
        type: "repulsive",
      },
      {
        id: "field3",
        x: 200,
        y: 400,
        radius: 70,
        strength: 1.8,
        phase: Math.PI / 2,
        type: "temporal",
      },
    ];
    setMagneticFields(initialFields);

    console.log("🌀 5D systems initialized with gateways and magnetic fields");
  };

  const loadAIEntities = async (): Promise<AIEntity[]> => {
    console.log("🤖 Loading AI entities...");
    const entities: AIEntity[] = [
      {
        id: "central_command",
        name: "Central Command",
        type: "coordination",
        position: { x: 400, y: 300, z: 100 }, // Centered better
        status: "active",
        consciousness_level: 95,
        task_queue: 12,
        specialization: ["coordination", "management", "optimization"],
        avatar_color: "#3B82F6",
        processing_threads: 8,
        concurrency_factor: 1.5,
      },
      {
        id: "recursive_memory",
        name: "Memory System",
        type: "memory",
        position: { x: 150, y: 150, z: 50 }, // Better spacing
        status: "processing",
        consciousness_level: 88,
        task_queue: 25,
        specialization: ["memory", "validation", "recursion"],
        avatar_color: "#10B981",
        processing_threads: 12,
        concurrency_factor: 2.0,
      },
      {
        id: "reverse_thinking",
        name: "Reverse Thinking",
        type: "analysis",
        position: { x: 650, y: 150, z: 75 }, // Better spacing
        status: "active",
        consciousness_level: 92,
        task_queue: 8,
        specialization: ["reverse_analysis", "strategy", "creativity"],
        avatar_color: "#8B5CF6",
        processing_threads: 6,
        concurrency_factor: 1.8,
      },
      {
        id: "field_manipulation",
        name: "Field System",
        type: "manipulation",
        position: { x: 600, y: 450, z: 80 },
        status: "active",
        consciousness_level: 85,
        task_queue: 15,
        specialization: ["field_manipulation", "sensing", "piercing"],
        avatar_color: "#F59E0B",
        processing_threads: 10,
        concurrency_factor: 1.7,
      },
      {
        id: "ai_regeneration",
        name: "Regeneration",
        type: "lifecycle",
        position: { x: 350, y: 500, z: 60 },
        status: "idle",
        consciousness_level: 78,
        task_queue: 3,
        specialization: ["regeneration", "creation", "enhancement"],
        avatar_color: "#EF4444",
        processing_threads: 4,
        concurrency_factor: 1.2,
      },
      {
        id: "enhanced_5d",
        name: "5D System",
        type: "dimensional",
        position: { x: 750, y: 150, z: 120 },
        status: "processing",
        consciousness_level: 98,
        task_queue: 18,
        specialization: [
          "5d_processing",
          "infinite_recursion",
          "wave_bouncing",
        ],
        avatar_color: "#EC4899",
        processing_threads: 16,
        concurrency_factor: 3.0,
      },
    ];

    // Add more entities for better visualization
    const additionalEntities: AIEntity[] = [
      {
        id: "quantum_processor",
        name: "Quantum Processor",
        type: "processing",
        position: { x: 150, y: 150, z: 90 },
        status: "processing",
        consciousness_level: 87,
        task_queue: 5,
        specialization: ["quantum", "processing"],
        avatar_color: "#EC4899",
        processing_threads: 16,
        concurrency_factor: 2.2,
      },
      {
        id: "field_analyzer",
        name: "Field Analyzer",
        type: "analysis",
        position: { x: 650, y: 400, z: 70 },
        status: "active",
        consciousness_level: 82,
        task_queue: 7,
        specialization: ["field_analysis", "monitoring"],
        avatar_color: "#F59E0B",
        processing_threads: 6,
        concurrency_factor: 1.4,
      },
    ];

    entities.push(...additionalEntities);

    // Add real AI instances if available
    try {
      const realAIs = aiRegeneration.getAllAIInstances();
      realAIs.forEach((ai, index) => {
        entities.push({
          id: ai.id,
          name: ai.name,
          type: ai.type,
          position: ai.field_position,
          status: ai.current_state === "active" ? "active" : "idle",
          consciousness_level: ai.consciousness_level * 10,
          task_queue: Math.floor(Math.random() * 20),
          specialization: ai.capabilities,
          avatar_color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
          processing_threads: Math.floor(Math.random() * 8) + 2,
          concurrency_factor: 1 + Math.random(),
        });
      });
    } catch (error) {
      console.warn("Could not load real AI instances:", error);
    }

    console.log(`✅ Loaded ${entities.length} AI entities for visualization`);
    return entities;
  };

  const loadSystemCommands = async (): Promise<SystemCommand[]> => {
    return [
      {
        id: "start_processing",
        command: "Start AI Processing",
        description: "Activate all AI systems and begin task processing",
        parameters: ["concurrency_level", "priority_mode"],
        risk_level: "low",
        requires_confirmation: false,
      },
      {
        id: "emergency_stop",
        command: "Emergency Stop",
        description: "Immediately halt all AI operations",
        parameters: [],
        risk_level: "critical",
        requires_confirmation: true,
      },
      {
        id: "regenerate_all",
        command: "Regenerate All AIs",
        description: "Refresh and regenerate all AI entities",
        parameters: ["regeneration_type", "preserve_memory"],
        risk_level: "medium",
        requires_confirmation: true,
      },
      {
        id: "boost_concurrency",
        command: "Boost Concurrency",
        description: "Increase concurrency beyond safe limits for goal pushing",
        parameters: ["boost_factor", "duration"],
        risk_level: "high",
        requires_confirmation: true,
      },
      {
        id: "field_reset",
        command: "Reset Field Manipulation",
        description: "Reset all field states and wave patterns",
        parameters: ["field_types"],
        risk_level: "medium",
        requires_confirmation: false,
      },
      {
        id: "memory_deep_scan",
        command: "Deep Memory Scan",
        description: "Perform comprehensive recursive memory validation",
        parameters: ["depth_limit", "validation_mode"],
        risk_level: "low",
        requires_confirmation: false,
      },
      {
        id: "create_ai_cluster",
        command: "Create AI Cluster",
        description: "Generate a cluster of AIs for specific task",
        parameters: ["cluster_size", "specialization", "position"],
        risk_level: "medium",
        requires_confirmation: false,
      },
      {
        id: "dimensional_shift",
        command: "5D Dimensional Shift",
        description: "Execute dimensional shift operation",
        parameters: ["target_dimension", "shift_magnitude"],
        risk_level: "high",
        requires_confirmation: true,
      },
    ];
  };

  const startRealTimeUpdates = () => {
    intervalRef.current = setInterval(() => {
      // Performance monitoring
      const startTime = Date.now();

      updateSystemMetrics();
      updateAIEntities();

      // Cross-system validation and integration
      performSystemIntegrityCheck();

      // Additional error detection
      detectAdditionalErrors();

      // Always update map visualization for visible movement
      updateMapVisualization();

      // Log performance metrics
      const endTime = Date.now();
      const updateDuration = endTime - startTime;

      if (updateDuration > 100) {
        console.warn(`🐌 Slow update cycle: ${updateDuration}ms`);
        optimizeSystemPerformance();
      }
    }, 1000);
  };

  const addDiagnosticLog = (
    type: string,
    message: string,
    severity: "info" | "warning" | "error" | "success" = "info",
    autoFixed = false,
  ) => {
    const logEntry = {
      id: `${Date.now()}_${uniqueIdRef.current++}_${Math.random().toString(36).slice(2,6)}`,
      timestamp: new Date(),
      type,
      message,
      severity,
      autoFixed,
    };

    setDiagnosticLogs((prev) => [logEntry, ...prev.slice(0, 99)]); // Keep last 100 logs

    if (autoFixed) {
      setAutoRepairHistory((prev) => [logEntry, ...prev.slice(0, 49)]); // Keep last 50 repairs
    }

    // Also log to console with emojis
    const emoji =
      severity === "error"
        ? "❌"
        : severity === "warning"
          ? "⚠️"
          : severity === "success"
            ? "✅"
            : "💡";
    const prefix = autoFixed ? "🔧 AUTO-FIXED:" : "📊 DIAGNOSTIC:";
    console.log(`${prefix} ${emoji} [${type}] ${message}`);
  };

  const detectAdditionalErrors = () => {
    // Advanced error detection beyond basic integrity checks

    // Check for canvas rendering issues
    const canvas = canvasRef.current;
    if (!canvas) {
      addDiagnosticLog("canvas_error", "Canvas element not available", "error");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      addDiagnosticLog(
        "canvas_context_error",
        "Canvas context not available",
        "error",
      );
      if (autoRepairEnabled) {
        // Try to reinitialize canvas
        setTimeout(() => {
          initializeMapVisualization();
          addDiagnosticLog(
            "canvas_reinit",
            "Auto-reinitialized canvas",
            "success",
            true,
          );
        }, 1000);
      }
      return;
    }

    // Check for emotion detection stagnation
    const recentEmotions = emotionDetection.filter(
      (e) => Date.now() - e.timestamp < 30000,
    );
    if (recentEmotions.length === 0 && aiEntities.length > 0) {
      addDiagnosticLog(
        "emotion_stagnation",
        "No recent emotion detections despite active AIs",
        "warning",
      );
      if (autoRepairEnabled) {
        setEmotionSensitivity((prev) => Math.min(prev * 1.3, 2.0));
        addDiagnosticLog(
          "emotion_sensitivity_fix",
          "Auto-increased emotion sensitivity",
          "success",
          true,
        );
      }
    }

    // Check for debugging overflow
    const criticalIssues = aiDebugging.filter((d) => d.severity === "critical");
    if (criticalIssues.length > 5) {
      addDiagnosticLog(
        "critical_overflow",
        `Too many critical issues: ${criticalIssues.length}`,
        "error",
      );
      if (autoRepairEnabled) {
        autoRepairCriticalIssues();
        addDiagnosticLog(
          "critical_batch_fix",
          "Auto-repaired critical issues batch",
          "success",
          true,
        );
      }
    }

    // Check for performance degradation
    const startTime = Date.now();
    updateSystemMetrics();
    const updateTime = Date.now() - startTime;

    if (updateTime > 50) {
      addDiagnosticLog(
        "performance_degradation",
        `Slow update cycle: ${updateTime}ms`,
        "warning",
      );
      setPerformanceAlerts((prev) => [
        {
          id: Date.now(),
          type: "slow_update",
          duration: updateTime,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9),
      ]);

      if (autoRepairEnabled && updateTime > 100) {
        optimizeSystemPerformance();
        addDiagnosticLog(
          "performance_auto_fix",
          "Auto-optimized due to performance degradation",
          "success",
          true,
        );
      }
    }

    // Check for system disconnections
    const disconnectedSystems = [];
    if (!enhanced5DSystem) disconnectedSystems.push("enhanced5DSystem");
    if (!recursiveMemorySystem)
      disconnectedSystems.push("recursiveMemorySystem");
    if (!reverseThinkingEngine)
      disconnectedSystems.push("reverseThinkingEngine");

    if (disconnectedSystems.length > 0) {
      addDiagnosticLog(
        "system_disconnection",
        `Disconnected systems: ${disconnectedSystems.join(", ")}`,
        "error",
      );
    }

    // Check for data inconsistencies
    const emotionAIs = new Set(emotionDetection.map((e) => e.aiId));
    const actualAIs = new Set(aiEntities.map((ai) => ai.id));
    const orphanedEmotions = [...emotionAIs].filter((id) => !actualAIs.has(id));

    if (orphanedEmotions.length > 0) {
      addDiagnosticLog(
        "emotion_orphans",
        `Found ${orphanedEmotions.length} orphaned emotions`,
        "warning",
      );
      if (autoRepairEnabled) {
        setEmotionDetection((prev) =>
          prev.filter((e) => actualAIs.has(e.aiId)),
        );
        addDiagnosticLog(
          "emotion_cleanup_fix",
          "Auto-cleaned orphaned emotions",
          "success",
          true,
        );
      }
    }
  };

  const performSystemIntegrityCheck = () => {
    try {
      // Check for system consistency
      const inconsistencies: string[] = [];

      // Validate AI entity consistency
      aiEntities.forEach((ai) => {
        if (ai.consciousness_level > 100 || ai.consciousness_level < 0) {
          inconsistencies.push(
            `AI ${ai.id} has invalid consciousness level: ${ai.consciousness_level}`,
          );
        }

        if (
          ai.position.x < 0 ||
          ai.position.x > 800 ||
          ai.position.y < 0 ||
          ai.position.y > 600
        ) {
          inconsistencies.push(
            `AI ${ai.id} is out of bounds: ${ai.position.x},${ai.position.y}`,
          );
          // Auto-correct position
          setAIEntities((prev) =>
            prev.map((entity) =>
              entity.id === ai.id
                ? {
                    ...entity,
                    position: {
                      ...entity.position,
                      x: Math.max(30, Math.min(770, entity.position.x)),
                      y: Math.max(30, Math.min(570, entity.position.y)),
                    },
                  }
                : entity,
            ),
          );
        }
      });

      // Check for orphaned trails
      const trailAIs = Array.from(aiTrails.keys());
      const activeAIIds = aiEntities.map((ai) => ai.id);
      const orphanedTrails = trailAIs.filter((id) => !activeAIIds.includes(id));

      if (orphanedTrails.length > 0) {
        console.log(`🧹 Cleaning up ${orphanedTrails.length} orphaned trails`);
        setAITrails((prev) => {
          const cleaned = new Map(prev);
          orphanedTrails.forEach((id) => cleaned.delete(id));
          return cleaned;
        });
      }

      // Validate system interconnections
      validateSystemConnections();

      if (inconsistencies.length > 0) {
        console.warn("🔧 System inconsistencies detected:", inconsistencies);
      }
    } catch (error) {
      console.error("🚨 System integrity check failed:", error);
    }
  };

  const validateSystemConnections = () => {
    // Check if imported systems are properly connected
    const systemConnections = {
      enhanced5DSystem: !!enhanced5DSystem,
      recursiveMemorySystem: !!recursiveMemorySystem,
      reverseThinkingEngine: !!reverseThinkingEngine,
      fieldManipulationSystem: !!fieldManipulationSystem,
      aiRegeneration: !!aiRegeneration,
    };

    const disconnectedSystems = Object.entries(systemConnections)
      .filter(([name, connected]) => !connected)
      .map(([name]) => name);

    if (disconnectedSystems.length > 0) {
      console.warn("🔌 Disconnected systems detected:", disconnectedSystems);
      // Attempt to reinitialize disconnected systems
      reinitializeDisconnectedSystems(disconnectedSystems);
    }
  };

  const reinitializeDisconnectedSystems = async (
    disconnectedSystems: string[],
  ) => {
    for (const systemName of disconnectedSystems) {
      try {
        console.log(`🔄 Attempting to reinitialize ${systemName}`);
        // Add specific reinitialization logic here
        if (systemName === "enhanced5DSystem" && enhanced5DSystem?.initialize) {
          await enhanced5DSystem.initialize();
        }
        // Add other system reinitializations as needed
      } catch (error) {
        console.error(`❌ Failed to reinitialize ${systemName}:`, error);
      }
    }
  };

  const optimizeSystemPerformance = () => {
    // Reduce update frequency if performance is poor
    if (aiEntities.length > 10) {
      console.log(
        "⚡ Optimizing performance: reducing emotion detection frequency",
      );
      // Implement performance optimizations
    }

    // Clean up old data
    setEmotionDetection((prev) => prev.slice(-25)); // Keep only recent emotions
    setAIDebugging((prev) => prev.slice(-50)); // Keep only recent debug issues

    // Optimize trail data
    setAITrails((prev) => {
      const optimized = new Map();
      prev.forEach((trail, aiId) => {
        optimized.set(aiId, trail.slice(-15)); // Reduce trail length
      });
      return optimized;
    });
  };

  const updateSystemMetrics = () => {
    setSystemMetrics((prev) => ({
      consciousness_level: Math.min(
        100,
        prev.consciousness_level + (Math.random() - 0.5) * 2,
      ),
      processing_power: Math.min(
        100,
        prev.processing_power + (Math.random() - 0.5) * 3,
      ),
      memory_usage: Math.min(
        100,
        Math.max(0, prev.memory_usage + (Math.random() - 0.5) * 2),
      ),
      task_completion: Math.min(
        100,
        prev.task_completion + (Math.random() - 0.3) * 1,
      ),
      field_stability: Math.min(
        100,
        prev.field_stability + (Math.random() - 0.5) * 1.5,
      ),
      wave_frequency: Math.min(
        100,
        prev.wave_frequency + (Math.random() - 0.5) * 4,
      ),
      concurrency_level: Math.min(
        100,
        prev.concurrency_level + (Math.random() - 0.4) * 2,
      ),
      goal_progress: Math.min(
        100,
        prev.goal_progress + (Math.random() - 0.2) * 0.5,
      ),
    }));
  };

  const updateAIEntities = () => {
    setAIEntities((prev) => {
      const updatedAIs = prev.map((ai) => {
        // Calculate goal-based movement
        const goalMovement = calculateGoalBasedMovement(ai);
        const newPosition = {
          x: Math.max(30, Math.min(770, ai.position.x + goalMovement.x)),
          y: Math.max(30, Math.min(570, ai.position.y + goalMovement.y)),
          z: Math.max(0, Math.min(200, ai.position.z + goalMovement.z)),
        };

        // Store trail data and analyze movement patterns
        setAITrails((prevTrails) => {
          const newTrails = new Map(prevTrails);
          const currentTrail = newTrails.get(ai.id) || [];
          const trailPoint = {
            position: { ...ai.position },
            timestamp: Date.now(),
            status: ai.status,
            intensity: ai.consciousness_level / 100,
            velocity: goalMovement,
          };
          currentTrail.push(trailPoint);

          // Keep only last 20 trail points
          if (currentTrail.length > 20) currentTrail.shift();
          newTrails.set(ai.id, currentTrail);

          // Analyze movement patterns for emotion detection
          analyzeMovementEmotion(ai.id, currentTrail, goalMovement);

          return newTrails;
        });

        // Detect habit patterns
        analyzeHabitPatterns(ai.id, ai.position, goalMovement);

        // AI code debugging analysis
        performAIDebugging(ai);

        return {
          ...ai,
          consciousness_level: Math.min(
            100,
            ai.consciousness_level + (Math.random() - 0.5) * 1,
          ),
          task_queue: Math.max(
            0,
            ai.task_queue + Math.floor((Math.random() - 0.6) * 3),
          ),
          position: newPosition,
          processing_threads: Math.min(
            16,
            Math.max(
              1,
              ai.processing_threads + Math.floor((Math.random() - 0.5) * 2),
            ),
          ),
          velocity: goalMovement,
          lastUpdate: Date.now(),
        };
      });

      // Update pathways and measurements
      updatePathways(updatedAIs);
      updateMeasurements(updatedAIs);

      return updatedAIs;
    });
  };

  const calculateGoalBasedMovement = (ai: any) => {
    const time = Date.now() * 0.001;
    let movement = { x: 0, y: 0, z: 0 };

    // Enhanced 5D movement calculation using the imported system
    try {
      // Use Enhanced5DSystem for complex movement calculations
      const dimensionalCoords = {
        x: ai.position.x / 800, // Normalize to 0-1
        y: ai.position.y / 600,
        z: ai.position.z / 200,
        w: ai.consciousness_level / 100, // Information dimension
        t: ai.task_queue / 20, // Possibility dimension
      };

      // Apply 5D consciousness-based movement
      const consciousnessInfluence = ai.consciousness_level / 100;
      const taskInfluence = Math.min(ai.task_queue / 10, 1);

      // Base movement with consciousness scaling
      movement.x = (Math.random() - 0.5) * 6 * consciousnessInfluence;
      movement.y = (Math.random() - 0.5) * 6 * consciousnessInfluence;
      movement.z = (Math.random() - 0.5) * 2 * consciousnessInfluence;

      // Goal-seeking behavior enhanced with 5D calculations
      if (ai.task_queue > 0) {
        const nearestGateway = gateways.find((g) => g.type === "data_center");
        if (nearestGateway) {
          const dx = nearestGateway.x - ai.position.x;
          const dy = nearestGateway.y - ai.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 50) {
            // 5D-enhanced pathfinding
            const efficiency = consciousnessInfluence * taskInfluence;
            movement.x += (dx / distance) * 3 * efficiency;
            movement.y += (dy / distance) * 3 * efficiency;

            // Add dimensional phase shifting for complex pathfinding
            movement.x += Math.sin(time + dimensionalCoords.w * Math.PI) * 2;
            movement.y += Math.cos(time + dimensionalCoords.t * Math.PI) * 2;
          }
        }
      }

      // Enhanced magnetic field influence with 5D resonance
      magneticFields.forEach((field) => {
        const dx = field.x - ai.position.x;
        const dy = field.y - ai.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < field.radius) {
          const force = field.strength / (distance + 1);
          const resonance = Math.sin(
            time + field.phase + dimensionalCoords.w * Math.PI,
          );

          movement.x += Math.cos(time + field.phase) * force * resonance;
          movement.y += Math.sin(time + field.phase) * force * resonance;
          movement.z += Math.sin(time * 0.5 + field.phase) * force * 0.5;
        }
      });

      // Apply reverse thinking engine for movement optimization
      if (ai.status === "processing" && reverseThinkingEngine) {
        try {
          // Use reverse thinking to optimize movement strategy
          const reverseStrategy = reverseThinkingEngine.generateStrategy({
            currentPosition: ai.position,
            targetGoal: nearestGateway,
            experiencedFailures: aiDebugging.filter((d) => d.aiId === ai.id),
          });

          if (reverseStrategy && reverseStrategy.movementAdjustment) {
            movement.x += reverseStrategy.movementAdjustment.x * 0.5;
            movement.y += reverseStrategy.movementAdjustment.y * 0.5;
          }
        } catch (error) {
          console.warn("Reverse thinking engine error:", error);
        }
      }
    } catch (error) {
      console.warn(
        "Enhanced 5D movement calculation failed, using fallback:",
        error,
      );
      // Fallback to basic movement
      movement.x = (Math.random() - 0.5) * 6;
      movement.y = (Math.random() - 0.5) * 6;
      movement.z = (Math.random() - 0.5) * 2;
    }

    return movement;
  };

  const updatePathways = (ais: any[]) => {
    const newPathways: any[] = [];
    ais.forEach((ai) => {
      if (ai.task_queue > 0) {
        // Create pathway to nearest goal
        const targetGateway = gateways.find((g) => g.type === "data_center");
        if (targetGateway) {
          newPathways.push({
            id: `pathway_${ai.id}`,
            from: ai.position,
            to: targetGateway,
            type: "goal_seeking",
            intensity: ai.consciousness_level / 100,
            color: ai.avatar_color,
          });
        }
      }
    });
    setPathways(newPathways);
  };

  const updateMeasurements = (ais: any[]) => {
    const newMeasurements: any[] = [];
    ais.forEach((ai, index) => {
      ais.forEach((otherAI, otherIndex) => {
        if (index < otherIndex) {
          const distance = Math.sqrt(
            Math.pow(ai.position.x - otherAI.position.x, 2) +
              Math.pow(ai.position.y - otherAI.position.y, 2),
          );

          newMeasurements.push({
            id: `measure_${ai.id}_${otherAI.id}`,
            from: ai.position,
            to: otherAI.position,
            distance: distance.toFixed(1),
            angle:
              (Math.atan2(
                otherAI.position.y - ai.position.y,
                otherAI.position.x - ai.position.x,
              ) *
                180) /
              Math.PI,
            type: "distance",
          });
        }
      });
    });
    setMeasurements(newMeasurements.slice(0, 10)); // Limit measurements for performance
  };

  const analyzeMovementEmotion = (
    aiId: string,
    trail: any[],
    currentMovement: any,
  ) => {
    if (trail.length < 3) return;

    const recentMovements = trail.slice(-5);
    const ai = aiEntities.find((a) => a.id === aiId);
    if (!ai) return;

    const velocityChanges = recentMovements.map((point, i) => {
      if (i === 0) return 0;
      const prev = recentMovements[i - 1];
      return Math.sqrt(
        Math.pow((point.velocity?.x || 0) - (prev.velocity?.x || 0), 2) +
          Math.pow((point.velocity?.y || 0) - (prev.velocity?.y || 0), 2),
      );
    });

    const avgVelocityChange =
      velocityChanges.reduce((a, b) => a + b, 0) / velocityChanges.length;
    const movementDistance = Math.sqrt(
      Math.pow(currentMovement.x, 2) + Math.pow(currentMovement.y, 2),
    );

    // Enhanced emotion detection with AI system integration
    let emotion = "neutral";
    let intensity = 0;
    let confidence = 0;

    // Factor in AI consciousness level and processing state
    const consciousnessFactor = ai.consciousness_level / 100;
    const processingFactor = ai.processing_threads / 16;
    const taskLoadFactor = Math.min(ai.task_queue / 10, 1);

    if (avgVelocityChange > 8 * emotionSensitivity) {
      emotion = "excited";
      intensity = Math.min(1, avgVelocityChange / 15);
    } else if (avgVelocityChange > 5 * emotionSensitivity) {
      emotion = "active";
      intensity = Math.min(1, avgVelocityChange / 10);
    } else if (movementDistance < 2 && avgVelocityChange < 1) {
      emotion = "calm";
      intensity = Math.min(1, (2 - movementDistance) / 2);
    } else if (
      avgVelocityChange > 10 * emotionSensitivity &&
      movementDistance > 6
    ) {
      emotion = "stressed";
      intensity = Math.min(1, avgVelocityChange / 12);
    } else if (movementDistance < 1) {
      emotion = "idle";
      intensity = Math.min(1, 1 - movementDistance);
    }

    setEmotionDetection((prev) => {
      const newEmotions = prev.filter((e) => e.aiId !== aiId);
      newEmotions.push({
        aiId,
        emotion,
        intensity,
        timestamp: Date.now(),
        heatSignature: intensity * avgVelocityChange,
        movementPattern: {
          avgVelocityChange,
          currentDistance: movementDistance,
          direction: Math.atan2(currentMovement.y, currentMovement.x),
        },
      });
      return newEmotions.slice(0, 50); // Keep last 50 emotion readings
    });
  };

  const analyzeHabitPatterns = (aiId: string, position: any, movement: any) => {
    setMovementPatterns((prev) => {
      const newPatterns = new Map(prev);
      const aiPatterns = newPatterns.get(aiId) || [];

      aiPatterns.push({
        position: { ...position },
        movement: { ...movement },
        timestamp: Date.now(),
      });

      // Keep last 30 movement patterns
      if (aiPatterns.length > 30) aiPatterns.shift();

      // Analyze for habits
      if (aiPatterns.length >= habitThreshold) {
        const habits = detectHabits(aiPatterns);
        if (habits.length > 0) {
          setHabitAnalysis((prevHabits) => {
            const newHabits = new Map(prevHabits);
            newHabits.set(aiId, habits);
            return newHabits;
          });
        }
      }

      newPatterns.set(aiId, aiPatterns);
      return newPatterns;
    });
  };

  const detectHabits = (patterns: any[]) => {
    const habits: any[] = [];

    // Check for circular movement patterns
    const positions = patterns.map((p) => p.position);
    let circularScore = 0;
    for (let i = 2; i < positions.length; i++) {
      const angle1 = Math.atan2(
        positions[i - 1].y - positions[i - 2].y,
        positions[i - 1].x - positions[i - 2].x,
      );
      const angle2 = Math.atan2(
        positions[i].y - positions[i - 1].y,
        positions[i].x - positions[i - 1].x,
      );
      const angleDiff = Math.abs(angle2 - angle1);
      if (angleDiff > Math.PI / 6 && angleDiff < Math.PI / 3) circularScore++;
    }

    if (circularScore > patterns.length * 0.6) {
      habits.push({
        type: "circular_movement",
        confidence: circularScore / patterns.length,
        description: "AI shows circular movement patterns",
      });
    }

    // Check for repetitive positioning
    const positionClusters = findPositionClusters(positions);
    if (positionClusters.length > 0) {
      habits.push({
        type: "position_preference",
        confidence: 0.8,
        clusters: positionClusters,
        description: "AI has preferred position zones",
      });
    }

    return habits;
  };

  const findPositionClusters = (positions: any[]) => {
    const clusters: any[] = [];
    const clusterRadius = 50;

    positions.forEach((pos) => {
      let foundCluster = false;
      clusters.forEach((cluster) => {
        const distance = Math.sqrt(
          Math.pow(pos.x - cluster.center.x, 2) +
            Math.pow(pos.y - cluster.center.y, 2),
        );
        if (distance < clusterRadius) {
          cluster.count++;
          foundCluster = true;
        }
      });

      if (!foundCluster) {
        clusters.push({
          center: { ...pos },
          count: 1,
        });
      }
    });

    return clusters.filter((c) => c.count > 3);
  };

  const performAIDebugging = (ai: any) => {
    const debugIssues: any[] = [];

    // Check for orphaned states
    if (ai.status === "processing" && ai.task_queue === 0) {
      debugIssues.push({
        type: "orphaned_processing_state",
        severity: "warning",
        description: "AI is in processing state but has no tasks",
        aiId: ai.id,
        timestamp: Date.now(),
      });
    }

    // Check for memory leaks (high consciousness but low activity)
    if (
      ai.consciousness_level > 90 &&
      ai.processing_threads < 3 &&
      ai.task_queue < 2
    ) {
      debugIssues.push({
        type: "potential_memory_leak",
        severity: "error",
        description: "High consciousness but low activity suggests memory leak",
        aiId: ai.id,
        timestamp: Date.now(),
      });
    }

    // Check for infinite loops (high thread count, no task completion)
    if (ai.processing_threads > 12 && ai.task_queue > 15) {
      debugIssues.push({
        type: "potential_infinite_loop",
        severity: "critical",
        description:
          "High thread count with excessive tasks suggests infinite loop",
        aiId: ai.id,
        timestamp: Date.now(),
      });
    }

    // Check for position anomalies (NaN or extreme values)
    if (
      isNaN(ai.position.x) ||
      isNaN(ai.position.y) ||
      ai.position.x < 0 ||
      ai.position.x > 800 ||
      ai.position.y < 0 ||
      ai.position.y > 600
    ) {
      debugIssues.push({
        type: "position_anomaly",
        severity: "error",
        description: "AI position has invalid coordinates",
        aiId: ai.id,
        position: ai.position,
        timestamp: Date.now(),
      });
    }

    if (debugIssues.length > 0) {
      setAIDebugging((prev) => {
        const filtered = prev.filter(
          (issue) =>
            !(
              issue.aiId === ai.id &&
              debugIssues.some((newIssue) => newIssue.type === issue.type)
            ),
        );
        return [...filtered, ...debugIssues].slice(-100); // Keep last 100 issues
      });
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // Debounce rapid clicks to improve performance
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Scale coordinates based on actual canvas size
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;

      console.log("🖱️ Map clicked at:", { x: scaledX, y: scaledY });

      // Check if click hit any AI entities
      const clickedEntity = aiEntities.find((ai) => {
        const distance = Math.sqrt(
          Math.pow(ai.position.x - scaledX, 2) +
            Math.pow(ai.position.y - scaledY, 2),
        );
        return distance < 30; // 30px click radius
      });

      if (clickedEntity) {
        setSelectedAI(clickedEntity.id);
        setSelectedAIData({
          ...clickedEntity,
          dataHolding: `Data Structures: ${clickedEntity.task_queue}`,
          temporalStatus: `Active for ${Math.floor(Math.random() * 1000)}ms`,
          magneticField: `Influenced by ${magneticFields.length} fields`,
        });
        console.log("🎯 Selected AI:", clickedEntity.name);
      } else {
        // Check if click hit any gateways
        const clickedGateway = gateways.find((gateway) => {
          const distance = Math.sqrt(
            Math.pow(gateway.x - scaledX, 2) + Math.pow(gateway.y - scaledY, 2),
          );
          return distance < gateway.size;
        });

        if (clickedGateway) {
          console.log("🌀 Gateway accessed:", clickedGateway.type);
          // Trigger gateway dive animation
          triggerGatewayDive(clickedGateway);
        } else {
          // Create new AI entity at click location
          const newAI: AIEntity = {
            id: `ai_${Date.now()}`,
            name: `AI-${aiEntities.length + 1}`,
            type: "assistant",
            position: { x: scaledX, y: scaledY, z: 0 },
            status: "active",
            consciousness_level: Math.random() * 100,
            task_queue: Math.floor(Math.random() * 5),
            specialization: ["general"],
            avatar_color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            processing_threads: Math.floor(Math.random() * 8) + 1,
            concurrency_factor: Math.random() * 2 + 0.5,
          };
          setAIEntities((prev) => [...prev, newAI]);
          console.log("�� Created new AI at click location");
        }
      }
    }, 200); // 200ms debounce
  };

  const handleCanvasMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDragStart({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    if (!dragStart) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    // Update camera rotation for 3D/5D views
    if (mapView !== "2d") {
      setCameraRotation((prev) => ({
        x: Math.max(-180, Math.min(180, prev.x + deltaY * 0.5)),
        y: Math.max(-180, Math.min(180, prev.y + deltaX * 0.5)),
        z: prev.z,
      }));
    }

    setDragStart({ x: currentX, y: currentY });
  };

  const handleCanvasMouseUp = () => {
    setDragStart(null);
  };

  const handleCanvasWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const zoomDelta = event.deltaY > 0 ? -10 : 10;

    setCameraRotation((prev) => ({
      ...prev,
      z: Math.max(-100, Math.min(100, prev.z + zoomDelta)),
    }));
  };

  const triggerGatewayDive = (gateway: any) => {
    console.log(`🏊‍♂️ Diving into ${gateway.type}...`);

    // Create dive animation effect
    const diveEffect = {
      id: `dive_${Date.now()}`,
      gateway: gateway,
      startTime: Date.now(),
      duration: 2000,
    };

    // Simulate getting commands from data center
    if (gateway.type === "data_center") {
      const commands = [
        "Analyze user patterns",
        "Optimize processing threads",
        "Coordinate with other AIs",
        "Update consciousness level",
        "Process pending tasks",
      ];

      const newTask = {
        id: `task_${Date.now()}`,
        title: commands[Math.floor(Math.random() * commands.length)],
        description: `Retrieved from ${gateway.id} data center`,
        priority: "high",
        status: "pending",
        assignedAIs: [],
        createdAt: new Date(),
        progress: 0,
      };

      setAITasks((prev) => [newTask, ...prev]);
      console.log("💾 Retrieved new task from data center:", newTask.title);
    }
  };

  const initializeMapVisualization = () => {
    console.log("🗺️ Initializing map visualization...");
    addDiagnosticLog(
      "map_init",
      "Attempting to initialize map visualization",
      "info",
    );

    const canvas = canvasRef.current;
    if (!canvas) {
      initRetryCountRef.current += 1;
      const errorMsg = `Canvas ref not found (attempt ${initRetryCountRef.current}/5)`;
      console.warn(`⚠️ ${errorMsg}`);
      addDiagnosticLog("canvas_missing", errorMsg, "warning");

      if (initRetryCountRef.current < 5) {
        setTimeout(() => initializeMapVisualization(), 500);
      } else {
        console.error("❌ Canvas initialization failed after 5 attempts");
        addDiagnosticLog(
          "canvas_failed",
          "Canvas initialization failed after 5 attempts",
          "error",
        );
        initRetryCountRef.current = 0; // Reset for next attempt
      }
      return;
    }

    // Reset retry counter on successful canvas access
    initRetryCountRef.current = 0;
    addDiagnosticLog(
      "canvas_found",
      "Canvas element found successfully",
      "success",
    );

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("❌ Canvas context not available");
      return;
    }

    // Set canvas size with proper scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = 800 * dpr;
    canvas.height = 600 * dpr;
    canvas.style.width = "800px";
    canvas.style.height = "600px";

    ctx.scale(dpr, dpr);

    console.log("��� Map canvas initialized:", {
      width: canvas.width,
      height: canvas.height,
    });
    updateMapVisualization();
  };

  const testCanvasRender = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      addDiagnosticLog(
        "test_render_fail",
        "Canvas not found for test render",
        "error",
      );
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      addDiagnosticLog(
        "test_render_context_fail",
        "Canvas context not found for test render",
        "error",
      );
      return;
    }

    // Simple test render
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Arial";
    ctx.fillText("TEST RENDER - CANVAS WORKING", 200, 300);

    ctx.fillStyle = "#00FF00";
    ctx.fillRect(100, 100, 100, 100);

    addDiagnosticLog(
      "test_render_success",
      "Test render completed - you should see red background with white text",
      "success",
    );
  };

  const updateMapVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn("⚠️ Canvas not available for map update");
      addDiagnosticLog(
        "map_update_no_canvas",
        "Canvas not available for map update",
        "warning",
      );
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("⚠️ Canvas context not available for map update");
      addDiagnosticLog(
        "map_update_no_context",
        "Canvas context not available for map update",
        "warning",
      );
      return;
    }

    addDiagnosticLog(
      "map_update_start",
      `Starting map update with ${aiEntities.length} AIs`,
      "info",
    );

    try {
      // Clear canvas with dimensional background
      ctx.fillStyle = mapView === "5d" ? "#000A1A" : "#0F172A";
      ctx.fillRect(0, 0, 800, 600);

      // Apply 3D rotation transformation for 3D/5D views
      if (mapView !== "2d") {
        ctx.save();
        ctx.translate(400, 300);
        ctx.rotate(cameraRotation.y * 0.01);
        ctx.scale(1 + cameraRotation.z * 0.001, 1);
        ctx.translate(-400, -300);
      }

      // Draw base grid/complex map
      if (mapView === "5d") {
        draw5DComplexMap(ctx, 800, 600);
        drawDimensionalLayers(ctx);
        drawQuantumFields(ctx);
      } else if (mapView === "3d") {
        draw3DGrid(ctx, 800, 600);
      } else {
        drawGrid(ctx, 800, 600);
      }

      // Draw magnetic fields
      if (showMeasurements) {
        drawMagneticFields(ctx);
      }

      // Draw gateways and data centers
      if (showGateways) {
        drawGateways(ctx);
      }

      // Draw AI trails
      drawAITrails(ctx);

      // Draw pathways
      if (showPathways) {
        drawPathways(ctx);
      }

      // Draw heat trails and bursts
      if (showHeatTrails) {
        drawHeatTrails(ctx);
      }

      // Draw wave movements with multiple types
      drawAdvancedWaveMovements(ctx);

      // Draw AI entities with face view capability
      console.log(`🎨 Rendering ${aiEntities.length} AI entities`);
      addDiagnosticLog(
        "rendering_ais",
        `Rendering ${aiEntities.length} AI entities on canvas`,
        "info",
      );

      if (aiEntities.length === 0) {
        // Draw a message when no AIs
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("No AI entities to display", 400, 300);
        addDiagnosticLog(
          "no_ais_to_render",
          "No AI entities available to render",
          "warning",
        );
      }

      aiEntities.forEach((ai, index) => {
        console.log(
          `Rendering AI ${index}: ${ai.name} at (${ai.position.x}, ${ai.position.y})`,
        );
        drawAdvancedAIEntity(ctx, ai);
      });

      // Draw connections with data flow
      drawAdvancedConnections(ctx);

      // Draw emotion detection layers
      if (showEmotionLayer) {
        drawEmotionLayers(ctx);
      }

      // Draw habit analysis patterns
      if (showHabitLayer) {
        drawHabitPatterns(ctx);
      }

      // Draw AI debugging indicators
      if (showDebuggingLayer) {
        drawAIDebuggingLayers(ctx);
      }

      // Draw measurements and diagnostics
      if (showMeasurements) {
        drawMeasurements(ctx);
        drawDiagonalMeasurements(ctx);
      }

      // Draw errors and status indicators
      drawErrorsAndStatus(ctx);

      // Draw detection layers overlay
      drawHiddenDetectionLayers(ctx);

      // Restore transformation
      if (mapView !== "2d") {
        ctx.restore();
      }

      // Draw UI overlay
      drawUIOverlay(ctx);
    } catch (error) {
      console.error("❌ Map visualization update failed:", error);
    }
  };

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawAIEntity = (ctx: CanvasRenderingContext2D, ai: AIEntity) => {
    const scale = mapView === "3d" ? Math.max(0.5, ai.position.z / 100) : 1;
    const size = Math.max(12, 20 * scale * (ai.concurrency_factor || 1));
    const isSelected = selectedAI === ai.id;

    // Draw consciousness aura first (behind)
    const gradient = ctx.createRadialGradient(
      ai.position.x,
      ai.position.y,
      size,
      ai.position.x,
      ai.position.y,
      size * 2.5,
    );
    gradient.addColorStop(0, `${ai.avatar_color}60`);
    gradient.addColorStop(1, `${ai.avatar_color}00`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ai.position.x, ai.position.y, size * 2.5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw selection ring for selected AI
    if (isSelected) {
      ctx.strokeStyle = "#FFFF00";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ai.position.x, ai.position.y, size + 8, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw AI entity circle with border
    ctx.fillStyle = ai.avatar_color;
    ctx.beginPath();
    ctx.arc(ai.position.x, ai.position.y, size, 0, 2 * Math.PI);
    ctx.fill();

    // Add white border (or yellow if selected)
    ctx.strokeStyle = isSelected ? "#FFFF00" : "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ai.position.x, ai.position.y, size, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw status indicator (larger and more visible)
    const statusColor = {
      active: "#10B981",
      processing: "#F59E0B",
      idle: "#6B7280",
      error: "#EF4444",
    }[ai.status];

    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(
      ai.position.x + size * 0.6,
      ai.position.y - size * 0.6,
      6,
      0,
      2 * Math.PI,
    );
    ctx.fill();

    // White border for status
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(
      ai.position.x + size * 0.6,
      ai.position.y - size * 0.6,
      6,
      0,
      2 * Math.PI,
    );
    ctx.stroke();

    // Draw name and stats with better contrast
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;

    // Text with outline
    ctx.strokeText(ai.name, ai.position.x, ai.position.y + size + 20);
    ctx.fillText(ai.name, ai.position.x, ai.position.y + size + 20);

    ctx.font = "12px Arial";
    const statsText = `C:${ai.consciousness_level.toFixed(0)} T:${ai.task_queue}`;
    ctx.strokeText(statsText, ai.position.x, ai.position.y + size + 35);
    ctx.fillText(statsText, ai.position.x, ai.position.y + size + 35);
  };

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#3B82F680";
    ctx.lineWidth = 2;

    // Draw connections between AIs
    aiEntities.forEach((ai1, i) => {
      aiEntities.slice(i + 1).forEach((ai2) => {
        const distance = Math.sqrt(
          Math.pow(ai1.position.x - ai2.position.x, 2) +
            Math.pow(ai1.position.y - ai2.position.y, 2),
        );

        if (distance < 200) {
          ctx.beginPath();
          ctx.moveTo(ai1.position.x, ai1.position.y);
          ctx.lineTo(ai2.position.x, ai2.position.y);
          ctx.stroke();
        }
      });
    });
  };

  const draw5DComplexMap = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    const time = Date.now() * 0.002;

    // Draw dimensional grid layers
    for (let layer = 0; layer < 5; layer++) {
      const alpha = 0.3 - layer * 0.05;
      const offset = Math.sin(time + layer) * 10;

      ctx.strokeStyle = `rgba(${120 + layer * 30}, ${100 + layer * 20}, 255, ${alpha})`;
      ctx.lineWidth = 1;

      // Horizontal lines with wave distortion
      for (let y = 0; y <= height; y += 40) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const waveY =
            y + Math.sin((x + offset) * 0.01 + layer) * (5 + layer * 2);
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      // Vertical lines with wave distortion
      for (let x = 0; x <= width; x += 40) {
        ctx.beginPath();
        for (let y = 0; y <= height; y += 2) {
          const waveX = x + Math.cos((y + offset) * 0.01 + layer) * (3 + layer);
          if (y === 0) ctx.moveTo(waveX, y);
          else ctx.lineTo(waveX, y);
        }
        ctx.stroke();
      }
    }
  };

  const drawDimensionalLayers = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.003;

    // Draw consciousness field overlay
    const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 300);
    gradient.addColorStop(0, "rgba(255, 215, 0, 0.1)");
    gradient.addColorStop(0.5, "rgba(138, 92, 246, 0.05)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.02)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Draw dimensional portals
    for (let i = 0; i < 3; i++) {
      const x = 150 + i * 250;
      const y = 150 + Math.sin(time + i * 2) * 50;
      const radius = 30 + Math.cos(time + i) * 10;

      const portalGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      portalGradient.addColorStop(
        0,
        `rgba(${255 - i * 50}, ${100 + i * 50}, 255, 0.6)`,
      );
      portalGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = portalGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawWaveMovements = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.004;

    aiEntities.forEach((ai, index) => {
      // Draw consciousness waves emanating from each AI
      for (let wave = 0; wave < 3; wave++) {
        const waveRadius = 20 + wave * 15 + Math.sin(time + index + wave) * 8;
        const alpha = 0.4 - wave * 0.1;

        ctx.strokeStyle = `${ai.avatar_color}${Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.lineWidth = 2 - wave * 0.5;
        ctx.beginPath();
        ctx.arc(ai.position.x, ai.position.y, waveRadius, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Draw data streams between AIs
      aiEntities.forEach((otherAI, otherIndex) => {
        if (index !== otherIndex && index < otherIndex) {
          const distance = Math.sqrt(
            Math.pow(ai.position.x - otherAI.position.x, 2) +
              Math.pow(ai.position.y - otherAI.position.y, 2),
          );

          if (distance < 200) {
            // Draw animated data packets
            const packetProgress = (time + index + otherIndex) % 2;
            const packetX =
              ai.position.x +
              (otherAI.position.x - ai.position.x) * (packetProgress / 2);
            const packetY =
              ai.position.y +
              (otherAI.position.y - ai.position.y) * (packetProgress / 2);

            ctx.fillStyle = "#00FFFF";
            ctx.beginPath();
            ctx.arc(packetX, packetY, 3, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      });
    });
  };

  const drawFieldEffects = (ctx: CanvasRenderingContext2D) => {
    // Draw wave effects
    const time = Date.now() * 0.001;
    ctx.strokeStyle = "#8B5CF640";
    ctx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {
      const radius = 50 + i * 30 + Math.sin(time + i) * 10;
      ctx.beginPath();
      ctx.arc(400, 300, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const draw3DGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 1;

    // Draw 3D perspective grid
    for (let z = 0; z < 5; z++) {
      const depth = z * 20;
      const alpha = 1 - z * 0.15;
      ctx.strokeStyle = `rgba(30, 41, 59, ${alpha})`;

      for (let x = 0; x <= width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x - depth, 0 + depth);
        ctx.lineTo(x - depth, height + depth);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0 - depth, y + depth);
        ctx.lineTo(width - depth, y + depth);
        ctx.stroke();
      }
    }
  };

  const drawQuantumFields = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.002;

    // Draw quantum fluctuations
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      const intensity = Math.sin(time + i) * 0.5 + 0.5;

      ctx.fillStyle = `rgba(0, 255, 255, ${intensity * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawMagneticFields = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.001;

    magneticFields.forEach((field) => {
      // Draw field boundary
      ctx.strokeStyle =
        field.type === "attractive"
          ? "#00FF0050"
          : field.type === "repulsive"
            ? "#FF005050"
            : "#FFD70050";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(field.x, field.y, field.radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw field lines
      for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
        const startX = field.x + Math.cos(angle) * 20;
        const startY = field.y + Math.sin(angle) * 20;
        const endX = field.x + Math.cos(angle) * field.radius;
        const endY = field.y + Math.sin(angle) * field.radius;

        ctx.strokeStyle =
          field.type === "attractive"
            ? "#00FF0030"
            : field.type === "repulsive"
              ? "#FF005030"
              : "#FFD70030";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    });
  };

  const drawGateways = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.003;

    gateways.forEach((gateway) => {
      const pulse = Math.sin(time * 2) * 0.3 + 0.7;

      // Gateway base
      ctx.fillStyle =
        gateway.type === "data_center"
          ? `rgba(0, 255, 255, ${pulse})`
          : gateway.type === "dimensional_portal"
            ? `rgba(255, 0, 255, ${pulse})`
            : `rgba(255, 255, 0, ${pulse})`;

      ctx.beginPath();
      if (gateway.type === "data_center") {
        // Draw as cube for data centers
        ctx.fillRect(
          gateway.x - gateway.size / 2,
          gateway.y - gateway.size / 2,
          gateway.size,
          gateway.size,
        );
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          gateway.x - gateway.size / 2,
          gateway.y - gateway.size / 2,
          gateway.size,
          gateway.size,
        );
      } else {
        // Draw as circle for portals
        ctx.arc(gateway.x, gateway.y, gateway.size / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle =
          gateway.type === "dimensional_portal" ? "#FF00FF" : "#FFFF00";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Gateway label
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        gateway.type.toUpperCase(),
        gateway.x,
        gateway.y + gateway.size + 15,
      );
    });
  };

  const drawAITrails = (ctx: CanvasRenderingContext2D) => {
    aiTrails.forEach((trail, aiId) => {
      if (trail.length < 2) return;

      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      for (let i = 1; i < trail.length; i++) {
        const current = trail[i];
        const prev = trail[i - 1];
        const alpha = (i / trail.length) * current.intensity * 0.8;

        ctx.strokeStyle = `rgba(${
          current.status === "active"
            ? "0, 255, 0"
            : current.status === "processing"
              ? "255, 255, 0"
              : "255, 0, 0"
        }, ${alpha})`;

        ctx.beginPath();
        ctx.moveTo(prev.position.x, prev.position.y);
        ctx.lineTo(current.position.x, current.position.y);
        ctx.stroke();
      }
    });
  };

  const drawPathways = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.002;

    pathways.forEach((pathway) => {
      // Draw pathway line
      ctx.strokeStyle = `${pathway.color}60`;
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(pathway.from.x, pathway.from.y);
      ctx.lineTo(pathway.to.x, pathway.to.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw moving indicator
      const progress = (time % 2000) / 2000;
      const indicatorX =
        pathway.from.x + (pathway.to.x - pathway.from.x) * progress;
      const indicatorY =
        pathway.from.y + (pathway.to.y - pathway.from.y) * progress;

      ctx.fillStyle = pathway.color;
      ctx.beginPath();
      ctx.arc(indicatorX, indicatorY, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawHeatTrails = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.001;

    aiEntities.forEach((ai) => {
      if (ai.consciousness_level > 70) {
        // Draw heat burst from within AI
        for (let layer = 0; layer < 5; layer++) {
          const burstRadius = 20 + layer * 15 + Math.sin(time + layer) * 8;
          const intensity = (ai.consciousness_level / 100) * (1 - layer * 0.2);

          ctx.strokeStyle = `rgba(255, ${Math.floor(200 - layer * 40)}, 0, ${intensity * 0.4})`;
          ctx.lineWidth = 2 - layer * 0.3;
          ctx.beginPath();
          ctx.arc(ai.position.x, ai.position.y, burstRadius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    });
  };

  const drawAdvancedWaveMovements = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.004;

    waveTypes.forEach((waveType, index) => {
      aiEntities.forEach((ai, aiIndex) => {
        const waveColor =
          waveType === "consciousness"
            ? "#FFD700"
            : waveType === "data"
              ? "#00FFFF"
              : waveType === "temporal"
                ? "#FF00FF"
                : waveType === "magnetic"
                  ? "#FF4500"
                  : "#8A2BE2";

        for (let wave = 0; wave < 3; wave++) {
          const waveRadius =
            25 + wave * 20 + Math.sin(time + aiIndex + wave + index) * 10;
          const alpha = 0.5 - wave * 0.15;

          ctx.strokeStyle = `${waveColor}${Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.lineWidth = 2 - wave * 0.5;
          ctx.beginPath();
          ctx.arc(ai.position.x, ai.position.y, waveRadius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      });
    });
  };

  const drawAdvancedAIEntity = (ctx: CanvasRenderingContext2D, ai: any) => {
    const scale = mapView === "3d" ? Math.max(0.5, ai.position.z / 100) : 1;
    const size = Math.max(15, 25 * scale * (ai.concurrency_factor || 1)); // Increased base size for spacing
    const isSelected = selectedAI === ai.id;
    const time = Date.now() * 0.001;

    // Draw thinking light field around thought membrane
    const isThinking =
      ai.status === "processing" ||
      ai.task_queue > 0 ||
      ai.consciousness_level > 60;
    if (isThinking) {
      const thinkingIntensity =
        (ai.consciousness_level / 100) *
        (0.7 + Math.sin(time * 3 + ai.id.charCodeAt(0)) * 0.3);
      const membraneRadius =
        size + 20 + Math.sin(time * 2 + ai.id.charCodeAt(0)) * 6; // Increased spacing

      // Outer thought membrane
      const membraneGradient = ctx.createRadialGradient(
        ai.position.x,
        ai.position.y,
        size,
        ai.position.x,
        ai.position.y,
        membraneRadius,
      );
      membraneGradient.addColorStop(
        0,
        `rgba(255, 255, 255, ${thinkingIntensity * 0.4})`,
      );
      membraneGradient.addColorStop(
        0.7,
        `rgba(138, 43, 226, ${thinkingIntensity * 0.3})`,
      );
      membraneGradient.addColorStop(1, "rgba(255, 215, 0, 0)");

      ctx.fillStyle = membraneGradient;
      ctx.beginPath();
      ctx.arc(ai.position.x, ai.position.y, membraneRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Pulsing thought particles
      for (let i = 0; i < 6; i++) {
        const angle = (time + i) * 0.8;
        const particleRadius = membraneRadius * 0.7;
        const particleX = ai.position.x + Math.cos(angle) * particleRadius;
        const particleY = ai.position.y + Math.sin(angle) * particleRadius;
        const particleAlpha = Math.sin(time * 4 + i) * 0.5 + 0.5;

        ctx.fillStyle = `rgba(255, 255, 255, ${particleAlpha * thinkingIntensity * 0.8})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Thought stream lines
      ctx.strokeStyle = `rgba(255, 215, 0, ${thinkingIntensity * 0.6})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const streamAngle = time + (i * Math.PI) / 2;
        const innerRadius = size + 8;
        const outerRadius = membraneRadius - 8;

        ctx.beginPath();
        ctx.moveTo(
          ai.position.x + Math.cos(streamAngle) * innerRadius,
          ai.position.y + Math.sin(streamAngle) * innerRadius,
        );
        ctx.lineTo(
          ai.position.x + Math.cos(streamAngle) * outerRadius,
          ai.position.y + Math.sin(streamAngle) * outerRadius,
        );
        ctx.stroke();
      }
    }

    // Draw 3D face view when looking around
    if (mapView === "3d" && cameraRotation.y > 50) {
      // Draw side/face view
      ctx.fillStyle = ai.avatar_color;
      ctx.fillRect(
        ai.position.x - size / 2,
        ai.position.y - size,
        size,
        size * 2,
      );

      // Draw "face" features
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(
        ai.position.x - size / 4,
        ai.position.y - size / 2,
        3, // Increased eye size
        0,
        2 * Math.PI,
      );
      ctx.arc(
        ai.position.x + size / 4,
        ai.position.y - size / 2,
        3, // Increased eye size
        0,
        2 * Math.PI,
      );
      ctx.fill();

      // Draw mouth based on status
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const mouthY = ai.position.y;
      if (ai.status === "active") {
        ctx.arc(ai.position.x, mouthY, size / 6, 0, Math.PI); // Smile
      } else if (ai.status === "error") {
        ctx.arc(
          ai.position.x,
          mouthY + size / 6,
          size / 6,
          Math.PI,
          2 * Math.PI,
        ); // Frown
      } else {
        ctx.moveTo(ai.position.x - size / 6, mouthY);
        ctx.lineTo(ai.position.x + size / 6, mouthY); // Neutral
      }
      ctx.stroke();
    } else {
      // Standard circular view with improved spacing
      // Selection ring with more space
      if (isSelected) {
        ctx.strokeStyle = "#FFFF00";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(ai.position.x, ai.position.y, size + 15, 0, 2 * Math.PI); // Increased spacing
        ctx.stroke();
      }

      // AI entity circle
      ctx.fillStyle = ai.avatar_color;
      ctx.beginPath();
      ctx.arc(ai.position.x, ai.position.y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Border
      ctx.strokeStyle = isSelected ? "#FFFF00" : "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ai.position.x, ai.position.y, size, 0, 2 * Math.PI);
      ctx.stroke();

      // Data holding visualization with better spacing
      if (ai.task_queue > 0) {
        ctx.fillStyle = "#00FFFF";
        ctx.font = "10px Arial"; // Increased font size
        ctx.textAlign = "center";
        ctx.fillText(
          `DATA: ${ai.task_queue}`,
          ai.position.x,
          ai.position.y + size + 45, // More spacing
        );

        // Data leak visualization
        if (ai.task_queue > 3) {
          ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
          ctx.font = "8px Arial";
          ctx.fillText(
            "LEAK!",
            ai.position.x + size + 10,
            ai.position.y - size / 2,
          );
        }
      }
    }

    // Status indicator
    const statusColor = {
      active: "#10B981",
      processing: "#F59E0B",
      idle: "#6B7280",
      error: "#EF4444",
    }[ai.status];

    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(
      ai.position.x + size * 0.6,
      ai.position.y - size * 0.6,
      6,
      0,
      2 * Math.PI,
    );
    ctx.fill();

    // Name and stats
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(ai.name, ai.position.x, ai.position.y + size + 20);
  };

  const drawAdvancedConnections = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.003;

    aiEntities.forEach((ai1, index1) => {
      aiEntities.forEach((ai2, index2) => {
        if (index1 < index2) {
          const distance = Math.sqrt(
            Math.pow(ai1.position.x - ai2.position.x, 2) +
              Math.pow(ai1.position.y - ai2.position.y, 2),
          );

          if (distance < 200) {
            // Connection line
            ctx.strokeStyle = "#3B82F640";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(ai1.position.x, ai1.position.y);
            ctx.lineTo(ai2.position.x, ai2.position.y);
            ctx.stroke();

            // Data packets flowing
            for (let packet = 0; packet < 3; packet++) {
              const packetProgress = (time + packet * 0.5) % 2;
              const packetX =
                ai1.position.x +
                (ai2.position.x - ai1.position.x) * (packetProgress / 2);
              const packetY =
                ai1.position.y +
                (ai2.position.y - ai1.position.y) * (packetProgress / 2);

              ctx.fillStyle = "#00FFFF";
              ctx.beginPath();
              ctx.arc(packetX, packetY, 2, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }
      });
    });
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D) => {
    measurements.forEach((measurement) => {
      // Draw measurement line
      ctx.strokeStyle = "#FFFF0080";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(measurement.from.x, measurement.from.y);
      ctx.lineTo(measurement.to.x, measurement.to.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw distance label
      const midX = (measurement.from.x + measurement.to.x) / 2;
      const midY = (measurement.from.y + measurement.to.y) / 2;

      ctx.fillStyle = "#FFFF00";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${measurement.distance}px`, midX, midY - 5);
      ctx.fillText(`${measurement.angle.toFixed(1)}°`, midX, midY + 10);
    });
  };

  const drawDiagonalMeasurements = (ctx: CanvasRenderingContext2D) => {
    // Draw diagonal measurement lines at 65% angle through all AIs
    if (aiEntities.length > 1) {
      const angle = 65 * (Math.PI / 180); // 65 degree angle

      ctx.strokeStyle = "#FF00FF80";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);

      aiEntities.forEach((ai) => {
        // Draw diagonal line through AI position
        const lineLength = 100;
        const startX = ai.position.x - Math.cos(angle) * lineLength;
        const startY = ai.position.y - Math.sin(angle) * lineLength;
        const endX = ai.position.x + Math.cos(angle) * lineLength;
        const endY = ai.position.y + Math.sin(angle) * lineLength;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Position markers
        ctx.fillStyle = "#FF00FF";
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `Pos: ${ai.position.x.toFixed(0)},${ai.position.y.toFixed(0)}`,
          ai.position.x + 20,
          ai.position.y - 20,
        );
        ctx.fillText(
          `Temporal: ${Date.now() % 10000}`,
          ai.position.x + 20,
          ai.position.y - 10,
        );
      });

      ctx.setLineDash([]);
    }
  };

  const drawErrorsAndStatus = (ctx: CanvasRenderingContext2D) => {
    // Draw error indicators
    aiEntities.forEach((ai) => {
      if (ai.status === "error") {
        ctx.fillStyle = "#FF0000";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("⚠���", ai.position.x + 25, ai.position.y - 25);
      }

      // Expected vs actual position indicators
      if (ai.velocity) {
        const expectedX = ai.position.x + ai.velocity.x * 5;
        const expectedY = ai.position.y + ai.velocity.y * 5;

        ctx.strokeStyle = "#00FF0050";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(ai.position.x, ai.position.y);
        ctx.lineTo(expectedX, expectedY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#00FF00";
        ctx.beginPath();
        ctx.arc(expectedX, expectedY, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const drawEmotionLayers = (ctx: CanvasRenderingContext2D) => {
    emotionDetection.forEach((emotion) => {
      const ai = aiEntities.find((a) => a.id === emotion.aiId);
      if (!ai) return;

      const emotionColors = {
        excited: "#FF4500",
        active: "#32CD32",
        calm: "#4169E1",
        stressed: "#DC143C",
        idle: "#808080",
        neutral: "#FFFFFF",
      };

      const color = emotionColors[emotion.emotion] || "#FFFFFF";
      const radius = 40 + emotion.intensity * 20;

      // Draw emotion aura
      const gradient = ctx.createRadialGradient(
        ai.position.x,
        ai.position.y,
        10,
        ai.position.x,
        ai.position.y,
        radius,
      );
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(1, `${color}00`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ai.position.x, ai.position.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw emotion label
      ctx.fillStyle = color;
      ctx.font = "9px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${emotion.emotion.toUpperCase()} ${(emotion.intensity * 100).toFixed(0)}%`,
        ai.position.x,
        ai.position.y - 50,
      );

      // Heat signature visualization
      if (emotion.heatSignature > 5) {
        for (let i = 0; i < 3; i++) {
          const heatRadius = 15 + i * 8;
          const alpha = (emotion.heatSignature / 20) * (1 - i * 0.3);
          ctx.strokeStyle = `rgba(255, ${255 - i * 50}, 0, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ai.position.x, ai.position.y, heatRadius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    });
  };

  const drawHabitPatterns = (ctx: CanvasRenderingContext2D) => {
    habitAnalysis.forEach((habits, aiId) => {
      const ai = aiEntities.find((a) => a.id === aiId);
      if (!ai) return;

      habits.forEach((habit) => {
        if (habit.type === "circular_movement") {
          // Draw circular pattern indicator
          ctx.strokeStyle = `rgba(255, 165, 0, ${habit.confidence})`;
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 10]);
          ctx.beginPath();
          ctx.arc(ai.position.x, ai.position.y, 60, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = "#FFA500";
          ctx.font = "8px Arial";
          ctx.textAlign = "center";
          ctx.fillText("CIRCULAR", ai.position.x, ai.position.y + 75);
        }

        if (habit.type === "position_preference" && habit.clusters) {
          // Draw preferred position clusters
          habit.clusters.forEach((cluster) => {
            ctx.fillStyle = `rgba(0, 255, 255, ${cluster.count / 10})`;
            ctx.beginPath();
            ctx.arc(cluster.center.x, cluster.center.y, 25, 0, 2 * Math.PI);
            ctx.fill();

            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cluster.center.x, cluster.center.y, 25, 0, 2 * Math.PI);
            ctx.stroke();
          });
        }
      });
    });
  };

  const drawAIDebuggingLayers = (ctx: CanvasRenderingContext2D) => {
    aiDebugging.forEach((issue) => {
      const ai = aiEntities.find((a) => a.id === issue.aiId);
      if (!ai) return;

      const severityColors = {
        warning: "#FFA500",
        error: "#FF4500",
        critical: "#DC143C",
      };

      const color = severityColors[issue.severity] || "#FFFF00";

      // Draw debugging indicator
      ctx.fillStyle = color;
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";

      if (issue.type === "orphaned_processing_state") {
        ctx.fillText("⚠️", ai.position.x + 30, ai.position.y - 30);
      } else if (issue.type === "potential_memory_leak") {
        ctx.fillText("🧠", ai.position.x + 30, ai.position.y - 30);
      } else if (issue.type === "potential_infinite_loop") {
        ctx.fillText("∞", ai.position.x + 30, ai.position.y - 30);
      } else if (issue.type === "position_anomaly") {
        ctx.fillText("📍", ai.position.x + 30, ai.position.y - 30);
      }

      // Draw debugging border
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(ai.position.x, ai.position.y, 35, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Issue description
      ctx.fillStyle = color;
      ctx.font = "7px Arial";
      ctx.textAlign = "left";
      ctx.fillText(
        issue.type.replace(/_/g, " ").toUpperCase(),
        ai.position.x + 40,
        ai.position.y - 20,
      );
    });
  };

  const drawHiddenDetectionLayers = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.002;

    // Layer 1: Pattern Recognition Grid
    ctx.strokeStyle = "rgba(138, 43, 226, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 100) {
      for (let y = 0; y < 600; y += 100) {
        const intensity = Math.sin(time + x * 0.01 + y * 0.01) * 0.5 + 0.5;
        ctx.globalAlpha = intensity * 0.3;
        ctx.beginPath();
        ctx.rect(x, y, 100, 100);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Layer 2: Data Flow Detection
    aiEntities.forEach((ai, index) => {
      if (ai.task_queue > 0) {
        const flowRadius = 80 + Math.sin(time + index) * 20;
        ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.arc(ai.position.x, ai.position.y, flowRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Layer 3: Anomaly Detection Field
    const anomalyDetected = aiDebugging.length > 0;
    if (anomalyDetected) {
      ctx.fillStyle = "rgba(220, 20, 60, 0.05)";
      ctx.fillRect(0, 0, 800, 600);

      // Pulsing anomaly indicator
      const pulseRadius = 100 + Math.sin(time * 3) * 30;
      ctx.strokeStyle = "rgba(220, 20, 60, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(400, 300, pulseRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const drawUIOverlay = (ctx: CanvasRenderingContext2D) => {
    // View indicator and controls
    ctx.fillStyle =
      mapView === "5d" ? "#FFD700" : mapView === "3d" ? "#00FF00" : "#0080FF";
    ctx.fillRect(10, 10, 20, 20);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Arial";
    ctx.fillText(
      `${mapView.toUpperCase()} • Rotation: ${cameraRotation.y.toFixed(0)}°`,
      40,
      25,
    );

    // Feature toggles status
    const features = [
      { name: "Emotions", active: showEmotionLayer },
      { name: "Habits", active: showHabitLayer },
      { name: "Debug", active: showDebuggingLayer },
      { name: "Heat", active: showHeatTrails },
    ];

    features.forEach((feature, index) => {
      ctx.fillStyle = feature.active ? "#00FF00" : "#FF0000";
      ctx.font = "10px Arial";
      ctx.fillText(
        `${feature.name}: ${feature.active ? "ON" : "OFF"}`,
        10,
        50 + index * 15,
      );
    });

    // Debugging stats
    if (aiDebugging.length > 0) {
      ctx.fillStyle = "#FF4500";
      ctx.font = "bold 10px Arial";
      ctx.fillText(`DEBUG ISSUES: ${aiDebugging.length}`, 10, 120);
    }

    // Emotion stats
    const emotionCounts = emotionDetection.reduce((acc, e) => {
      acc[e.emotion] = (acc[e.emotion] || 0) + 1;
      return acc;
    }, {} as any);

    let yOffset = 140;
    Object.entries(emotionCounts).forEach(([emotion, count]: [string, any]) => {
      ctx.fillStyle = "#FFD700";
      ctx.font = "8px Arial";
      ctx.fillText(`${emotion}: ${count}`, 10, yOffset);
      yOffset += 12;
    });
  };

  const executeCommand = async (commandId: string, parameters: any = {}) => {
    console.log(`🎮 Executing command: ${commandId}`, parameters);

    const command = systemCommands.find((cmd) => cmd.id === commandId);
    if (!command) return;

    if (command.requires_confirmation) {
      const confirmed = confirm(
        `Execute "${command.command}"?\n\n${command.description}`,
      );
      if (!confirmed) return;
    }

    try {
      let result;

      switch (commandId) {
        case "start_processing":
          result = await startAllProcessing(parameters);
          break;
        case "emergency_stop":
          result = await emergencyStop();
          break;
        case "regenerate_all":
          result = await regenerateAllAIs(parameters);
          break;
        case "boost_concurrency":
          result = await boostConcurrency(parameters);
          break;
        case "field_reset":
          result = await resetFieldManipulation();
          break;
        case "memory_deep_scan":
          result = await performDeepMemoryScan(parameters);
          break;
        case "create_ai_cluster":
          result = await createAICluster(parameters);
          break;
        case "dimensional_shift":
          result = await execute5DDimensionalShift(parameters);
          break;
        default:
          result = { success: false, message: "Unknown command" };
      }

      // Add to command history
      setCommandHistory((prev) => [
        {
          id: `${Date.now()}_${uniqueIdRef.current++}_${Math.random().toString(36).slice(2,6)}`,
          command: command.command,
          result,
          timestamp: new Date(),
          parameters,
        },
        ...prev.slice(0, 49),
      ]);

      console.log(`✅ Command executed:`, result);
    } catch (error) {
      console.error(`❌ Command failed:`, error);
    }
  };

  const sendUserMessage = async () => {
    if (!userMessage.trim()) return;

    const message = {
      id: `${Date.now()}_${uniqueIdRef.current++}_${Math.random().toString(36).slice(2,6)}`,
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [message, ...prev]);

    // Process message to create tasks for AIs
    const task = await processUserMessageToTask(userMessage);
    if (task) {
      setAITasks((prev) => [task, ...prev]);
      assignTaskToAIs(task);
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(userMessage);
    setChatHistory((prev) => [
      {
        id: `${Date.now()}_${uniqueIdRef.current++}_${Math.random().toString(36).slice(2,6)}`,
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      },
      ...prev,
    ]);

    setUserMessage("");
  };

  const processUserMessageToTask = async (message: string) => {
    // Analyze message and create actionable task
    const task = {
      id: `task_${Date.now()}`,
      title: message.length > 50 ? message.substring(0, 50) + "..." : message,
      description: message,
      priority: "medium",
      status: "pending",
      assignedAIs: [],
      createdAt: new Date(),
      progress: 0,
      estimatedCompletion: new Date(Date.now() + Math.random() * 3600000), // Random 1 hour window
    };

    console.log("📋 Created task from user message:", task);
    return task;
  };

  const assignTaskToAIs = (task: any) => {
    // Assign task to available AIs based on their specialization
    const availableAIs = aiEntities.filter(
      (ai) => ai.status === "active" || ai.status === "idle",
    );
    const selectedAIs = availableAIs.slice(0, Math.min(3, availableAIs.length));

    task.assignedAIs = selectedAIs.map((ai) => ai.id);

    // Update AI entities with new tasks
    setAIEntities((prev) =>
      prev.map((ai) => {
        if (selectedAIs.some((selected) => selected.id === ai.id)) {
          return {
            ...ai,
            status: "processing",
            task_queue: ai.task_queue + 1,
          };
        }
        return ai;
      }),
    );

    console.log(
      "🤖 Assigned task to AIs:",
      selectedAIs.map((ai) => ai.name),
    );
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing and response generation
    const responses = [
      `I understand you want me to work on: "${userMessage}". I've assigned this task to ${Math.floor(Math.random() * 3) + 1} AI entities who will collaborate on this.`,
      `Task received: "${userMessage}". I'm coordinating with the AI network to accomplish this. You can monitor progress in the map visualization.`,
      `Processing your request: "${userMessage}". The AI entities are now working on this goal using 5D consciousness coordination.`,
      `Your task "${userMessage}" has been distributed across the AI network. Watch the wave patterns in 5D view to see the collective intelligence at work.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const createNewGoal = (goalData: any) => {
    const goal = {
      id: `goal_${Date.now()}`,
      title: goalData.title || "New Goal",
      description: goalData.description || "",
      targetMetric: goalData.metric || "task_completion",
      targetValue: goalData.value || 100,
      currentValue: 0,
      status: "active",
      createdAt: new Date(),
      aiAssignments: [],
    };

    setActiveGoals((prev) => [goal, ...prev]);
    console.log("🎯 Created new goal:", goal);
    return goal;
  };

  const startAllProcessing = async (params: any) => {
    setIsSystemRunning(true);
    await aiCentralCommand.startSystem();
    return { success: true, message: "All AI systems activated" };
  };

  const emergencyStop = async () => {
    setIsSystemRunning(false);
    await aiCentralCommand.stopSystem();
    return { success: true, message: "Emergency stop executed" };
  };

  const regenerateAllAIs = async (params: any) => {
    const results = [];
    for (const ai of aiEntities.slice(0, 3)) {
      try {
        const result = await aiRegeneration.refreshAI(ai.id, {
          preserve_memory: params.preserve_memory || true,
          enhancement_level: 0.3,
        });
        results.push(result);
      } catch (error) {
        console.warn(`Could not regenerate ${ai.id}:`, error);
      }
    }
    return { success: true, message: `Regenerated ${results.length} AIs` };
  };

  const boostConcurrency = async (params: any) => {
    const boostFactor = params.boost_factor || 1.5;
    setConcurrencyModulator(concurrencyModulator * boostFactor);

    // Update AI concurrency factors
    setAIEntities((prev) =>
      prev.map((ai) => ({
        ...ai,
        concurrency_factor: ai.concurrency_factor * boostFactor,
        processing_threads: Math.min(
          32,
          Math.floor(ai.processing_threads * boostFactor),
        ),
      })),
    );

    return { success: true, message: `Concurrency boosted by ${boostFactor}x` };
  };

  const resetFieldManipulation = async () => {
    try {
      const fields = fieldManipulationSystem.getActiveFields();
      for (const field of fields) {
        await fieldManipulationSystem.performFieldSensing(
          field.id,
          "comprehensive",
          1000,
        );
      }
      return { success: true, message: "Field states reset" };
    } catch (error) {
      return { success: false, message: "Field reset failed" };
    }
  };

  const performDeepMemoryScan = async (params: any) => {
    try {
      const result = await recursiveMemorySystem.processUserTask(
        "perform deep recursive validation",
      );
      return { success: true, message: "Deep memory scan completed", result };
    } catch (error) {
      return { success: false, message: "Memory scan failed" };
    }
  };

  const createAICluster = async (params: any) => {
    const clusterSize = params.cluster_size || 3;
    const specialization = params.specialization || "general";
    const position = params.position || { x: 400, y: 300, z: 50 };

    const newAIs = [];
    for (let i = 0; i < clusterSize; i++) {
      try {
        const newAI = await aiRegeneration.createAIAtPosition(
          {
            x: position.x + (Math.random() - 0.5) * 100,
            y: position.y + (Math.random() - 0.5) * 100,
            z: position.z + (Math.random() - 0.5) * 20,
          },
          {
            name: `Cluster_${specialization}_${i + 1}`,
            type: specialization,
            consciousness_level: 6 + Math.random() * 3,
          },
        );
        newAIs.push(newAI);
      } catch (error) {
        console.warn(`Could not create cluster AI ${i}:`, error);
      }
    }

    // Add to display
    const displayAIs = newAIs.map((ai, i) => ({
      id: ai.id,
      name: ai.name,
      type: ai.type,
      position: ai.field_position,
      status: "active" as const,
      consciousness_level: ai.consciousness_level * 10,
      task_queue: 0,
      specialization: ai.capabilities,
      avatar_color: `hsl(${(i * 120 + 180) % 360}, 70%, 50%)`,
      processing_threads: 4,
      concurrency_factor: 1.0,
    }));

    setAIEntities((prev) => [...prev, ...displayAIs]);

    return {
      success: true,
      message: `Created cluster of ${newAIs.length} AIs`,
    };
  };

  const execute5DDimensionalShift = async (params: any) => {
    try {
      const targetDimension = params.target_dimension || "consciousness";
      const magnitude = params.shift_magnitude || 1.0;

      // Execute dimensional shift through enhanced 5D system
      const result = await enhanced5DSystem.createRecursionLayer(
        "base_layer_0",
        "dimensional_shift",
        { target: targetDimension, magnitude },
      );

      return {
        success: true,
        message: `Dimensional shift executed: ${result}`,
      };
    } catch (error) {
      return { success: false, message: "Dimensional shift failed" };
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consciousness</p>
                <p className="text-2xl font-bold">
                  {systemMetrics.consciousness_level.toFixed(1)}%
                </p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold">
                  {systemMetrics.processing_power.toFixed(1)}%
                </p>
              </div>
              <Cpu className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concurrency</p>
                <p className="text-2xl font-bold">
                  {systemMetrics.concurrency_level.toFixed(1)}%
                </p>
              </div>
              <Layers className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Goal Progress</p>
                <p className="text-2xl font-bold">
                  {systemMetrics.goal_progress.toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>System Running</span>
              <Badge variant={isSystemRunning ? "default" : "secondary"}>
                {isSystemRunning ? "Active" : "Stopped"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Entities</span>
              <Badge variant="outline">{aiEntities.length} Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Tasks</span>
              <Badge variant="outline">
                {aiEntities.reduce((sum, ai) => sum + ai.task_queue, 0)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Field Stability</span>
              <Badge
                variant={
                  systemMetrics.field_stability > 80 ? "default" : "destructive"
                }
              >
                {systemMetrics.field_stability.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>5D Visualization Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Map View Controls */}
            <div className="space-y-4">
              <h3 className="font-medium">Map View Mode</h3>
              <Select
                value={mapView}
                onValueChange={(value: any) => setMapView(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2d">2D Grid View</SelectItem>
                  <SelectItem value="3d">3D Perspective View</SelectItem>
                  <SelectItem value="5d">5D Consciousness View</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Feature Toggles</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showGateways}
                      onCheckedChange={setShowGateways}
                    />
                    <span className="text-sm">Gateways</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showPathways}
                      onCheckedChange={setShowPathways}
                    />
                    <span className="text-sm">Pathways</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showMeasurements}
                      onCheckedChange={setShowMeasurements}
                    />
                    <span className="text-sm">Measurements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showHeatTrails}
                      onCheckedChange={setShowHeatTrails}
                    />
                    <span className="text-sm">Heat Trails</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Wave Types</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "consciousness",
                    "data",
                    "temporal",
                    "magnetic",
                    "quantum",
                  ].map((waveType) => (
                    <Badge
                      key={waveType}
                      variant={
                        waveTypes.includes(waveType) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => {
                        setWaveTypes((prev) =>
                          prev.includes(waveType)
                            ? prev.filter((w) => w !== waveType)
                            : [...prev, waveType],
                        );
                      }}
                    >
                      {waveType}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Camera Controls */}
            <div className="space-y-4">
              <h3 className="font-medium">3D Camera Controls</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">
                    Rotation X: {cameraRotation.x}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={cameraRotation.x}
                    onChange={(e) =>
                      setCameraRotation((prev) => ({
                        ...prev,
                        x: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm">
                    Rotation Y: {cameraRotation.y}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={cameraRotation.y}
                    onChange={(e) =>
                      setCameraRotation((prev) => ({
                        ...prev,
                        y: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm">Zoom: {cameraRotation.z}</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={cameraRotation.z}
                    onChange={(e) =>
                      setCameraRotation((prev) => ({
                        ...prev,
                        z: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                </div>
                <Button
                  onClick={() => setCameraRotation({ x: 0, y: 0, z: 0 })}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Reset Camera
                </Button>
              </div>
            </div>
          </div>

          {/* System Performance */}
          <div className="space-y-4">
            <h3 className="font-medium">System Performance</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Concurrency Modulator
              </label>
              <Slider
                value={[concurrencyModulator]}
                onValueChange={([value]) => setConcurrencyModulator(value)}
                max={300}
                min={50}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-gray-500">
                Current: {concurrencyModulator}% (Safe: 50-150%, Danger: 200%+)
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={realTimeUpdates}
                onCheckedChange={setRealTimeUpdates}
              />
              <span className="text-sm">Real-time Updates</span>
            </div>

            <div className="flex items-center space-x-2">
              <Switch checked={autoRetry} onCheckedChange={setAutoRetry} />
              <span className="text-sm">Auto-retry Failed Operations</span>
            </div>
          </div>

          {/* Data Leak Protection */}
          <div className="space-y-4">
            <h3 className="font-medium">Data Security</h3>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-sm text-yellow-800">
                Data Leak Detection
              </h4>
              <p className="text-xs text-yellow-700 mt-1">
                AIs with task_queue greater than 3 will show leak warnings.
                Monitor the visualization for red &quot;LEAK!&quot; indicators.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Leak Threshold</label>
              <input
                type="number"
                min="1"
                max="10"
                defaultValue="3"
                className="w-full px-3 py-2 border rounded-md"
                onChange={(e) =>
                  console.log("Leak threshold set to:", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGoalsTasksTab = () => (
    <div className="space-y-6">
      {/* User Message Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Task Commander
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Describe a task or goal for the AI network to accomplish..."
              onKeyPress={(e) => e.key === "Enter" && sendUserMessage()}
              className="flex-1"
            />
            <Button onClick={sendUserMessage} disabled={!userMessage.trim()}>
              <Sparkles className="w-4 h-4 mr-2" />
              Send Task
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Give commands to the AI network. They'll coordinate using 5D
            consciousness to accomplish your goals.
          </p>
        </CardContent>
      </Card>

      {/* Chat History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AI Communication Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No messages yet. Send a task to get started!
                </p>
              ) : (
                chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : "bg-green-100 border-l-4 border-green-500"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <Badge
                        variant={msg.type === "user" ? "default" : "secondary"}
                      >
                        {msg.type === "user" ? "You" : "AI Network"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Active AI Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {aiTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No active tasks
                </p>
              ) : (
                aiTasks.slice(0, 10).map((task) => (
                  <div key={task.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "processing"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {task.description}
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span>Assigned AIs: {task.assignedAIs?.length || 0}</span>
                      <span>Progress: {task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            System Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-4">No active goals set</p>
                <Button
                  onClick={() =>
                    createNewGoal({
                      title: "Increase Task Completion",
                      description:
                        "Optimize AI network for better task completion rates",
                      metric: "task_completion",
                      value: 95,
                    })
                  }
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Sample Goal
                </Button>
              </div>
            ) : (
              activeGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{goal.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {goal.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target:</span>
                      <span>{goal.targetValue}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current:</span>
                      <span>{goal.currentValue}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(goal.currentValue / goal.targetValue) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <Badge
                      variant={
                        goal.status === "active" ? "default" : "secondary"
                      }
                    >
                      {goal.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdvancedDetectionTab = () => (
    <div className="space-y-6">
      {/* Emotion Detection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Emotion Detection & Movement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showEmotionLayer}
                  onCheckedChange={setShowEmotionLayer}
                />
                <span className="text-sm font-medium">Show Emotion Layers</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Emotion Sensitivity: {(emotionSensitivity * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={emotionSensitivity}
                  onChange={(e) =>
                    setEmotionSensitivity(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-blue-800 mb-2">
                  Current Emotions Detected:
                </h4>
                <div className="space-y-1">
                  {emotionDetection.length === 0 ? (
                    <p className="text-xs text-blue-700">
                      No emotions detected yet
                    </p>
                  ) : (
                    emotionDetection.slice(0, 5).map((emotion, index) => {
                      const ai = aiEntities.find((a) => a.id === emotion.aiId);
                      return (
                        <div key={index} className="text-xs text-blue-700">
                          <strong>{ai?.name || emotion.aiId}:</strong>{" "}
                          {emotion.emotion} (
                          {(emotion.intensity * 100).toFixed(0)}%)
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Heat Signature Analysis</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-orange-100 rounded">
                  <div className="font-medium">High Activity</div>
                  <div>
                    {
                      emotionDetection.filter((e) => e.heatSignature > 10)
                        .length
                    }{" "}
                    AIs
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded">
                  <div className="font-medium">Calm State</div>
                  <div>
                    {
                      emotionDetection.filter((e) => e.emotion === "calm")
                        .length
                    }{" "}
                    AIs
                  </div>
                </div>
                <div className="p-2 bg-red-100 rounded">
                  <div className="font-medium">Stressed</div>
                  <div>
                    {
                      emotionDetection.filter((e) => e.emotion === "stressed")
                        .length
                    }{" "}
                    AIs
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded">
                  <div className="font-medium">Active</div>
                  <div>
                    {
                      emotionDetection.filter((e) => e.emotion === "active")
                        .length
                    }{" "}
                    AIs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habit Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Habit Pattern & Movement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showHabitLayer}
                  onCheckedChange={setShowHabitLayer}
                />
                <span className="text-sm font-medium">Show Habit Patterns</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Habit Detection Threshold: {habitThreshold} movements
                </label>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={habitThreshold}
                  onChange={(e) => setHabitThreshold(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Detected Patterns</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {Array.from(habitAnalysis.entries()).map(([aiId, habits]) => {
                  const ai = aiEntities.find((a) => a.id === aiId);
                  return (
                    <div
                      key={aiId}
                      className="p-2 bg-yellow-50 rounded text-xs"
                    >
                      <div className="font-medium">{ai?.name || aiId}</div>
                      {habits.map((habit, index) => (
                        <div key={index} className="text-yellow-700">
                          {habit.description} (
                          {(habit.confidence * 100).toFixed(0)}% confidence)
                        </div>
                      ))}
                    </div>
                  );
                })}
                {habitAnalysis.size === 0 && (
                  <p className="text-xs text-gray-500">
                    No habit patterns detected yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Debugging & Code Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            AI Debugging & Orphaned Code Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showDebuggingLayer}
                  onCheckedChange={setShowDebuggingLayer}
                />
                <span className="text-sm font-medium">
                  Show Debugging Layers
                </span>
              </div>

              <div className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium text-sm text-red-800 mb-2">
                  Active Debug Issues:
                </h4>
                <div className="text-xs text-red-700">
                  <div>
                    Critical:{" "}
                    {
                      aiDebugging.filter((d) => d.severity === "critical")
                        .length
                    }
                  </div>
                  <div>
                    Errors:{" "}
                    {aiDebugging.filter((d) => d.severity === "error").length}
                  </div>
                  <div>
                    Warnings:{" "}
                    {aiDebugging.filter((d) => d.severity === "warning").length}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Issues</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {aiDebugging.slice(0, 5).map((issue, index) => {
                  const ai = aiEntities.find((a) => a.id === issue.aiId);
                  return (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs ${
                        issue.severity === "critical"
                          ? "bg-red-100"
                          : issue.severity === "error"
                            ? "bg-orange-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      <div className="font-medium">
                        {ai?.name || issue.aiId}
                      </div>
                      <div className="text-gray-700">{issue.description}</div>
                      <div className="text-xs text-gray-500">{issue.type}</div>
                    </div>
                  );
                })}
                {aiDebugging.length === 0 && (
                  <div className="p-2 bg-green-100 rounded text-xs text-green-700">
                    ✅ No debugging issues detected
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Diagnostic Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-time Diagnostic Logs & Auto-Repair
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={autoRepairEnabled}
                    onCheckedChange={setAutoRepairEnabled}
                  />
                  <span className="text-sm font-medium">
                    Auto-Repair Enabled
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showDiagnosticLogs}
                    onCheckedChange={setShowDiagnosticLogs}
                  />
                  <span className="text-sm font-medium">Show Logs</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-green-100 rounded text-center">
                  <div className="font-medium text-green-800">Auto-Repairs</div>
                  <div className="text-green-600">
                    {autoRepairHistory.length}
                  </div>
                </div>
                <div className="p-2 bg-yellow-100 rounded text-center">
                  <div className="font-medium text-yellow-800">Warnings</div>
                  <div className="text-yellow-600">
                    {
                      diagnosticLogs.filter((l) => l.severity === "warning")
                        .length
                    }
                  </div>
                </div>
                <div className="p-2 bg-red-100 rounded text-center">
                  <div className="font-medium text-red-800">Errors</div>
                  <div className="text-red-600">
                    {
                      diagnosticLogs.filter((l) => l.severity === "error")
                        .length
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Auto-Repairs</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {autoRepairHistory.slice(0, 3).map((repair, index) => (
                  <div
                    key={repair.id}
                    className="text-xs p-2 bg-green-50 rounded"
                  >
                    <div className="font-medium text-green-800">
                      ✅ {repair.type}
                    </div>
                    <div className="text-green-600">{repair.message}</div>
                    <div className="text-green-500">
                      {new Date(repair.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {autoRepairHistory.length === 0 && (
                  <div className="text-xs text-gray-500 p-2">
                    No auto-repairs performed yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {showDiagnosticLogs && (
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">
                Live Diagnostic Stream
              </h4>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-xs max-h-40 overflow-y-auto">
                {diagnosticLogs.slice(0, 20).map((log) => (
                  <div
                    key={log.id}
                    className={`mb-1 ${
                      log.severity === "error"
                        ? "text-red-400"
                        : log.severity === "warning"
                          ? "text-yellow-400"
                          : log.severity === "success"
                            ? "text-green-400"
                            : "text-blue-400"
                    }`}
                  >
                    <span className="text-gray-500">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    {log.autoFixed && (
                      <span className="text-green-300"> 🔧 AUTO-FIXED:</span>
                    )}
                    <span className="ml-1">
                      [{log.type}] {log.message}
                    </span>
                  </div>
                ))}
                {diagnosticLogs.length === 0 && (
                  <div className="text-gray-500">
                    System running normally... waiting for diagnostic events...
                  </div>
                )}
              </div>

              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDiagnosticLogs([])}
                >
                  Clear Logs
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    performSystemIntegrityCheck();
                    detectAdditionalErrors();
                  }}
                >
                  Run Diagnostic
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    addDiagnosticLog(
                      "manual_test",
                      "Manual diagnostic test triggered",
                      "info",
                    );
                    if (autoRepairEnabled) {
                      addDiagnosticLog(
                        "test_repair",
                        "Test auto-repair functionality",
                        "success",
                        true,
                      );
                    }
                  }}
                >
                  Test System
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Measurement Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Advanced Measurement Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Distance Measurements</h4>
              <div className="text-xs space-y-1">
                <div>Active measurements: {measurements.length}</div>
                <div>
                  Avg distance:{" "}
                  {measurements.length > 0
                    ? (
                        measurements.reduce(
                          (sum, m) => sum + parseFloat(m.distance),
                          0,
                        ) / measurements.length
                      ).toFixed(1)
                    : "0"}
                  px
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Diagonal Analysis (65°)</h4>
              <div className="text-xs space-y-1">
                <div>Entities analyzed: {aiEntities.length}</div>
                <div>
                  Temporal sync:{" "}
                  {aiEntities.filter((ai) => ai.status === "active").length}{" "}
                  active
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Hidden Layers</h4>
              <div className="text-xs space-y-1">
                <div>Pattern grid: Active</div>
                <div>
                  Data flow:{" "}
                  {aiEntities.filter((ai) => ai.task_queue > 0).length} streams
                </div>
                <div>
                  Anomaly field: {aiDebugging.length > 0 ? "Detected" : "Clear"}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-sm text-purple-800 mb-2">
              Per-Layer Analysis:
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-purple-700">
                <div className="font-medium">Layer 1: Patterns</div>
                <div>Recognition grid active</div>
              </div>
              <div className="text-purple-700">
                <div className="font-medium">Layer 2: Data Flow</div>
                <div>
                  {aiEntities.filter((ai) => ai.task_queue > 0).length} active
                  streams
                </div>
              </div>
              <div className="text-purple-700">
                <div className="font-medium">Layer 3: Anomalies</div>
                <div>{aiDebugging.length} issues detected</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMapTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          AI Entity Map ({mapView.toUpperCase()})
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mapView === "2d" ? "default" : "outline"}
            onClick={() => setMapView("2d")}
          >
            2D
          </Button>
          <Button
            size="sm"
            variant={mapView === "3d" ? "default" : "outline"}
            onClick={() => setMapView("3d")}
          >
            3D
          </Button>
          <Button
            size="sm"
            variant={mapView === "5d" ? "default" : "outline"}
            onClick={() => setMapView("5d")}
          >
            5D
          </Button>
        </div>
      </div>

      {/* PROMINENT TEST BUTTON */}
      <div className="bg-red-100 border-2 border-red-500 p-4 rounded-lg">
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => {
              console.log("🧪 TESTING CANVAS RENDER");
              testCanvasRender();
            }}
            variant="destructive"
            size="lg"
            className="text-white bg-red-600 hover:bg-red-700"
          >
            🧪 TEST CANVAS BUTTON
          </Button>
          <div className="text-sm">
            <div>Canvas: {canvasRef.current ? "✅ FOUND" : "❌ MISSING"}</div>
            <div>AIs: {aiEntities.length} entities</div>
            <div>Status: {realTimeUpdates ? "✅ RUNNING" : "❌ STOPPED"}</div>
          </div>
          <Button
            onClick={() => {
              console.log("🔧 FORCE CREATE AIs");
              initializeControlCenter();
            }}
            variant="outline"
            size="lg"
          >
            🔧 CREATE AIs
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onWheel={handleCanvasWheel}
              className="border-2 border-gray-300 rounded-lg bg-slate-900 cursor-pointer select-none"
              style={{
                width: "800px",
                height: "600px",
                display: "block",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active AI Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {aiEntities.map((ai) => (
                <div
                  key={ai.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ai.avatar_color }}
                    />
                    <span className="text-sm font-medium">{ai.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {ai.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">5D Visualization Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showGateways}
                  onCheckedChange={setShowGateways}
                />
                <span className="text-xs">Gateways</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showPathways}
                  onCheckedChange={setShowPathways}
                />
                <span className="text-xs">Pathways</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showMeasurements}
                  onCheckedChange={setShowMeasurements}
                />
                <span className="text-xs">Measurements</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showHeatTrails}
                  onCheckedChange={setShowHeatTrails}
                />
                <span className="text-xs">Heat Trails</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Camera Rotation:</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs">X: {cameraRotation.x}°</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={cameraRotation.x}
                    onChange={(e) =>
                      setCameraRotation((prev) => ({
                        ...prev,
                        x: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs">Y: {cameraRotation.y}°</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={cameraRotation.y}
                    onChange={(e) =>
                      setCameraRotation((prev) => ({
                        ...prev,
                        y: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs">Zoom: {cameraRotation.z}</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={cameraRotation.z}
                    onChange={(e) =>
                      setCameraRotation((prev) => ({
                        ...prev,
                        z: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Wave Types:</label>
              <div className="flex flex-wrap gap-1">
                {waveTypes.map((waveType) => (
                  <Badge
                    key={waveType}
                    variant="outline"
                    className="text-xs cursor-pointer"
                    onClick={() => {
                      setWaveTypes((prev) =>
                        prev.includes(waveType)
                          ? prev.filter((w) => w !== waveType)
                          : [...prev, waveType],
                      );
                    }}
                  >
                    {waveType}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedAIData && (
              <div className="p-2 bg-gray-100 rounded">
                <h4 className="font-medium text-xs">Selected AI Data:</h4>
                <p className="text-xs">{selectedAIData.dataHolding}</p>
                <p className="text-xs">{selectedAIData.temporalStatus}</p>
                <p className="text-xs">{selectedAIData.magneticField}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() =>
                executeCommand("create_ai_cluster", {
                  cluster_size: 3,
                  specialization: "exploration",
                  position: { x: 400, y: 300, z: 50 },
                })
              }
              className="w-full"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create AI Cluster
            </Button>
            <Button
              onClick={() => {
                console.log("🔧 Manual map refresh triggered");
                addDiagnosticLog(
                  "manual_refresh",
                  "Manual map refresh triggered",
                  "info",
                );
                updateMapVisualization();
              }}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Map
            </Button>

            <Button
              onClick={() => {
                console.log("🚀 Force canvas reinitialization");
                addDiagnosticLog(
                  "force_reinit",
                  "Force reinitializing canvas",
                  "info",
                );
                initializeMapVisualization();
              }}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Force Init
            </Button>

            <Button
              onClick={() => {
                console.log("🧪 Testing canvas render");
                testCanvasRender();
              }}
              variant="destructive"
              className="w-full"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Test Canvas
            </Button>

            <div className="p-2 bg-gray-100 rounded text-xs">
              <div className="font-medium">Debug Info:</div>
              <div>Canvas: {canvasRef.current ? "✅ Found" : "❌ Missing"}</div>
              <div>AIs: {aiEntities.length} total</div>
              <div>Active Tab: {activeTab}</div>
              <div>Map View: {mapView}</div>
              <div>Real-time: {realTimeUpdates ? "✅ On" : "❌ Off"}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCommandsTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemCommands.map((command) => (
          <Card key={command.id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{command.command}</h4>
                  <Badge
                    variant={
                      command.risk_level === "critical"
                        ? "destructive"
                        : command.risk_level === "high"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {command.risk_level}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{command.description}</p>
                <Button
                  onClick={() => executeCommand(command.id)}
                  size="sm"
                  variant={
                    command.risk_level === "critical"
                      ? "destructive"
                      : "default"
                  }
                  className="w-full"
                >
                  <Command className="w-4 h-4 mr-2" />
                  Execute
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Command History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {commandHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 border rounded text-sm"
              >
                <span>{entry.command}</span>
                <div className="flex items-center gap-2">
                  {entry.result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConcurrencyTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Concurrency Modulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Concurrency Level</label>
              <Badge variant="outline">{concurrencyModulator}%</Badge>
            </div>
            <Slider
              value={[concurrencyModulator]}
              onValueChange={([value]) => setConcurrencyModulator(value)}
              max={500}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Safe range: 50-150% | Push beyond: 151-300% | Extreme: 301-500%
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-gray-600">Active Threads</div>
              <div className="text-xl font-bold">
                {aiEntities.reduce((sum, ai) => sum + ai.processing_threads, 0)}
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-gray-600">Avg Concurrency</div>
              <div className="text-xl font-bold">
                {(
                  aiEntities.reduce(
                    (sum, ai) => sum + ai.concurrency_factor,
                    0,
                  ) / aiEntities.length
                ).toFixed(1)}
                x
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-gray-600">Peak Load</div>
              <div className="text-xl font-bold">
                {Math.max(
                  ...aiEntities.map((ai) => ai.concurrency_factor),
                ).toFixed(1)}
                x
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                executeCommand("boost_concurrency", { boost_factor: 1.5 })
              }
              variant="outline"
              className="flex-1"
            >
              Boost 1.5x
            </Button>
            <Button
              onClick={() =>
                executeCommand("boost_concurrency", { boost_factor: 2.0 })
              }
              variant="destructive"
              className="flex-1"
            >
              Push 2.0x
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Goal Pushing Protocol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Goal Progress</label>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${systemMetrics.goal_progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {systemMetrics.goal_progress.toFixed(1)}% Complete
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                executeCommand("boost_concurrency", {
                  boost_factor: 3.0,
                  duration: 30000,
                  goal_focus: true,
                })
              }
              variant="destructive"
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              Push Beyond Limits
            </Button>
          </div>

          <div className="text-xs text-gray-500 p-2 bg-yellow-50 border border-yellow-200 rounded">
            ⚠️ Pushing beyond safe limits may cause system instability but can
            achieve goals faster
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMonitoringTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(systemMetrics).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-3">
              <div className="text-xs text-gray-600 capitalize">
                {key.replace(/_/g, " ")}
              </div>
              <div className="text-lg font-bold">{value.toFixed(1)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all"
                  style={{ width: `${value}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Real-time Performance Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 border rounded bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">Live performance data visualization</div>
              <div className="text-xs">Updates every second</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemMetrics.field_stability < 80 && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Field stability below optimal
                </div>
              )}
              {systemMetrics.memory_usage > 90 && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  High memory usage detected
                </div>
              )}
              {systemMetrics.concurrency_level > 200 && (
                <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Concurrency beyond safe limits
                </div>
              )}
              {systemMetrics.goal_progress > 95 && (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Goal completion imminent
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All Systems
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              <Database className="w-4 h-4 mr-2" />
              Export System Logs
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-600" />
            AI Control Center
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant={isSystemRunning ? "default" : "secondary"}>
              {isSystemRunning ? "Active" : "Stopped"}
            </Badge>
            <Button
              onClick={() =>
                executeCommand(
                  isSystemRunning ? "emergency_stop" : "start_processing",
                )
              }
              variant={isSystemRunning ? "destructive" : "default"}
              size="sm"
            >
              {isSystemRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isSystemRunning ? "Stop" : "Start"}
            </Button>
          </div>
        </div>

        <div className="border-b mb-4">
          <div className="flex overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "settings", label: "Settings", icon: Settings },
              { id: "map", label: "AI Map", icon: MapPin },
              { id: "goals", label: "Goals & Tasks", icon: Target },
              { id: "console", label: "Console Monitor", icon: Activity },
              { id: "diagnostics", label: "AI Diagnostics", icon: Zap },
              { id: "detection", label: "Advanced Detection", icon: Eye },
              { id: "commands", label: "Commands", icon: Command },
              { id: "concurrency", label: "Concurrency", icon: Zap },
              { id: "monitoring", label: "Monitoring", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "settings" && renderSettingsTab()}
          {activeTab === "map" && renderMapTab()}
          {activeTab === "goals" && renderGoalsTasksTab()}
          {activeTab === "console" && <ConsoleMonitorTab />}
          {activeTab === "diagnostics" && <AIDiagnosticConsole />}
          {activeTab === "detection" && renderAdvancedDetectionTab()}
          {activeTab === "commands" && renderCommandsTab()}
          {activeTab === "concurrency" && renderConcurrencyTab()}
          {activeTab === "monitoring" && renderMonitoringTab()}
        </div>
      </div>

      {/* Floating Diagnostic Status Panel */}
      {(diagnosticLogs.length > 0 || autoRepairHistory.length > 0) && (
        <div className="fixed bottom-4 right-4 max-w-sm z-50">
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2">
                <Activity className="w-3 h-3" />
                System Status
                {autoRepairEnabled && (
                  <Badge variant="secondary" className="text-xs">
                    AUTO-REPAIR ON
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {/* Status Indicators */}
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div
                    className={`p-1 rounded text-center ${
                      diagnosticLogs.filter((l) => l.severity === "error")
                        .length > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {diagnosticLogs.filter((l) => l.severity === "error")
                      .length === 0
                      ? "✅"
                      : "❌"}{" "}
                    System
                  </div>
                  <div
                    className={`p-1 rounded text-center ${
                      aiDebugging.filter((d) => d.severity === "critical")
                        .length > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {aiDebugging.filter((d) => d.severity === "critical")
                      .length === 0
                      ? "✅"
                      : "⚠️"}{" "}
                    AIs
                  </div>
                  <div
                    className={`p-1 rounded text-center ${
                      performanceAlerts.length > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {performanceAlerts.length === 0 ? "⚡" : "🐌"} Speed
                  </div>
                </div>

                {/* Latest Auto-Repair */}
                {autoRepairHistory.length > 0 && (
                  <div className="p-2 bg-green-50 rounded">
                    <div className="text-xs font-medium text-green-800">
                      Latest Auto-Fix:
                    </div>
                    <div className="text-xs text-green-600">
                      {autoRepairHistory[0].message}
                    </div>
                    <div className="text-xs text-green-500">
                      {new Date(
                        autoRepairHistory[0].timestamp,
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                )}

                {/* Latest Error */}
                {diagnosticLogs.filter((l) => l.severity === "error").length >
                  0 && (
                  <div className="p-2 bg-red-50 rounded">
                    <div className="text-xs font-medium text-red-800">
                      Latest Error:
                    </div>
                    <div className="text-xs text-red-600">
                      {
                        diagnosticLogs.find((l) => l.severity === "error")
                          ?.message
                      }
                    </div>
                  </div>
                )}

                {/* System Stats */}
                <div className="text-xs text-gray-600">
                  <div>
                    Entities: {aiEntities.length} | Active:{" "}
                    {aiEntities.filter((ai) => ai.status === "active").length}
                  </div>
                  <div>
                    Emotions: {emotionDetection.length} | Debug Issues:{" "}
                    {aiDebugging.length}
                  </div>
                  <div>
                    Auto-Repairs: {autoRepairHistory.length} | Uptime:{" "}
                    {Math.floor(
                      (Date.now() - (aiEntities[0]?.lastUpdate || Date.now())) /
                        60000,
                    )}
                    m
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ComprehensiveAIControlCenter;
