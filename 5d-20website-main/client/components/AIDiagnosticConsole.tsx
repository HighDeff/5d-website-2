// AI Diagnostic Console - Comprehensive AI system monitoring and auto-fixing
// Real-time AI health, progress tracking, and intelligent problem resolution

import React, { useState, useEffect, useRef } from "react";

interface AISystem {
  id: string;
  name: string;
  status: "active" | "idle" | "error" | "fixing" | "learning" | "offline";
  health: number; // 0-100
  current_task: string;
  errors: string[];
  fixes_applied: number;
  last_activity: string;
  performance_metrics: {
    response_time: number;
    success_rate: number;
    learning_rate: number;
    error_detection_accuracy: number;
  };
  assigned_problems: DiagnosticProblem[];
  user_interaction_score: number;
}

interface DiagnosticProblem {
  id: string;
  type:
    | "canvas_movement"
    | "data_flow"
    | "user_intent"
    | "error_fix"
    | "learning"
    | "performance";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  assigned_ai: string;
  status:
    | "detected"
    | "assigned"
    | "in_progress"
    | "testing_fix"
    | "resolved"
    | "failed";
  auto_fix_attempts: number;
  fix_suggestions: string[];
  user_input_needed: boolean;
  progress: number; // 0-100
  estimated_completion: string;
  actual_completion?: string;
}

interface UserProfile {
  communication_style:
    | "technical"
    | "casual"
    | "analytical"
    | "impatient"
    | "detail_oriented";
  preferred_fix_approach: "automatic" | "collaborative" | "manual_approval";
  trust_level: number; // 0-100
  interaction_history: UserInteraction[];
  problem_areas: string[];
  success_patterns: string[];
}

interface UserInteraction {
  timestamp: string;
  type: "question" | "complaint" | "suggestion" | "approval" | "rejection";
  content: string;
  ai_response: string;
  satisfaction_score: number;
  follow_up_needed: boolean;
}

export const AIDiagnosticConsole: React.FC = () => {
  const [aiSystems, setAiSystems] = useState<Map<string, AISystem>>(new Map());
  const [problems, setProblems] = useState<DiagnosticProblem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedProblem, setSelectedProblem] =
    useState<DiagnosticProblem | null>(null);
  const [userInput, setUserInput] = useState("");
  const [consoleMessages, setConsoleMessages] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeDiagnosticSystems();
    startRealTimeMonitoring();

    return () => {
      setIsMonitoring(false);
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleMessages]);

  const initializeDiagnosticSystems = () => {
    addConsoleMessage("🚀 Initializing AI Diagnostic Console...");

    // Initialize AI systems tracking
    const systems: [string, AISystem][] = [
      [
        "canvas-manager",
        {
          id: "canvas-manager",
          name: "Canvas Movement Manager",
          status: "active",
          health: 85,
          current_task:
            "Monitoring AI entity movement and magnetic field visualization",
          errors: [],
          fixes_applied: 3,
          last_activity: new Date().toISOString(),
          performance_metrics: {
            response_time: 45,
            success_rate: 87,
            learning_rate: 92,
            error_detection_accuracy: 95,
          },
          assigned_problems: [],
          user_interaction_score: 78,
        },
      ],
      [
        "error-handler",
        {
          id: "error-handler",
          name: "Error Handler AI",
          status: "active",
          health: 92,
          current_task: "Scanning for console errors and generating auto-fixes",
          errors: [],
          fixes_applied: 7,
          last_activity: new Date().toISOString(),
          performance_metrics: {
            response_time: 12,
            success_rate: 94,
            learning_rate: 88,
            error_detection_accuracy: 97,
          },
          assigned_problems: [],
          user_interaction_score: 85,
        },
      ],
      [
        "user-profiler",
        {
          id: "user-profiler",
          name: "User Intent Analyzer",
          status: "learning",
          health: 76,
          current_task:
            "Building user communication profile and preference patterns",
          errors: ["Limited interaction data"],
          fixes_applied: 2,
          last_activity: new Date().toISOString(),
          performance_metrics: {
            response_time: 67,
            success_rate: 73,
            learning_rate: 96,
            error_detection_accuracy: 82,
          },
          assigned_problems: [],
          user_interaction_score: 67,
        },
      ],
      [
        "learning-system",
        {
          id: "learning-system",
          name: "Self-Learning AI",
          status: "active",
          health: 88,
          current_task:
            "Analyzing patterns and generating improved fix methodologies",
          errors: [],
          fixes_applied: 12,
          last_activity: new Date().toISOString(),
          performance_metrics: {
            response_time: 123,
            success_rate: 91,
            learning_rate: 98,
            error_detection_accuracy: 89,
          },
          assigned_problems: [],
          user_interaction_score: 82,
        },
      ],
      [
        "data-flow",
        {
          id: "data-flow",
          name: "Data Flow Visualizer",
          status: "idle",
          health: 65,
          current_task:
            "Waiting for magnetic field data to visualize communication paths",
          errors: [
            "Missing data flow connections",
            "Limited AI communication visibility",
          ],
          fixes_applied: 1,
          last_activity: new Date().toISOString(),
          performance_metrics: {
            response_time: 234,
            success_rate: 65,
            learning_rate: 74,
            error_detection_accuracy: 78,
          },
          assigned_problems: [],
          user_interaction_score: 45,
        },
      ],
    ];

    setAiSystems(new Map(systems));

    // Initialize user profile
    const profile: UserProfile = {
      communication_style: "technical",
      preferred_fix_approach: "collaborative",
      trust_level: 70,
      interaction_history: [],
      problem_areas: ["canvas_movement", "data_flow"],
      success_patterns: ["error_fix", "learning"],
    };
    setUserProfile(profile);

    addConsoleMessage("✅ AI systems initialized and ready for diagnostics");
    detectInitialProblems();
  };

  const detectInitialProblems = () => {
    addConsoleMessage("🔍 Running initial diagnostic scan...");

    const initialProblems: DiagnosticProblem[] = [
      {
        id: "canvas-movement-issue",
        type: "canvas_movement",
        severity: "high",
        description:
          "AI entities not showing visible movement in top-left canvas",
        assigned_ai: "canvas-manager",
        status: "detected",
        auto_fix_attempts: 0,
        fix_suggestions: [
          "Force enable canvas animation loop",
          "Reset AI entity physics simulation",
          "Recalibrate magnetic field interactions",
          "Emergency fallback to guaranteed movement system",
        ],
        user_input_needed: false,
        progress: 0,
        estimated_completion: "2 minutes",
      },
      {
        id: "data-flow-visualization",
        type: "data_flow",
        severity: "medium",
        description:
          "Magnetic field data paths not visible between AI entities",
        assigned_ai: "data-flow",
        status: "detected",
        auto_fix_attempts: 0,
        fix_suggestions: [
          "Enable enhanced magnetic field rendering",
          "Add data packet visualization",
          "Implement consciousness bridge effects",
          "Create gateway communication paths",
        ],
        user_input_needed: false,
        progress: 0,
        estimated_completion: "3 minutes",
      },
      {
        id: "user-intent-tracking",
        type: "user_intent",
        severity: "low",
        description: "Limited user interaction profiling data available",
        assigned_ai: "user-profiler",
        status: "detected",
        auto_fix_attempts: 0,
        fix_suggestions: [
          "Implement real-time behavior tracking",
          "Add conversation pattern analysis",
          "Create preference learning system",
          "Build trust level assessment",
        ],
        user_input_needed: true,
        progress: 15,
        estimated_completion: "5 minutes",
      },
    ];

    setProblems(initialProblems);

    // Auto-assign problems to AIs
    initialProblems.forEach((problem) => {
      assignProblemToAI(problem.id, problem.assigned_ai);
    });

    addConsoleMessage(
      `⚠️ Detected ${initialProblems.length} issues requiring attention`,
    );
  };

  const startRealTimeMonitoring = () => {
    const monitoringInterval = setInterval(() => {
      if (!isMonitoring) {
        clearInterval(monitoringInterval);
        return;
      }

      updateAISystemHealth();
      checkForNewProblems();
      updateProblemProgress();
      analyzeUserInteractions();
    }, 2000);
  };

  const updateAISystemHealth = () => {
    setAiSystems((prev) => {
      const updated = new Map(prev);

      updated.forEach((system, id) => {
        // Simulate health fluctuations based on activity
        const base_health = system.health;
        const activity_bonus = system.status === "active" ? 2 : -1;
        const error_penalty = system.errors.length * -5;
        const fix_bonus = Math.min(system.fixes_applied * 0.5, 10);

        const new_health = Math.max(
          0,
          Math.min(
            100,
            base_health +
              activity_bonus +
              error_penalty +
              fix_bonus +
              (Math.random() - 0.5) * 3,
          ),
        );

        system.health = new_health;
        system.last_activity = new Date().toISOString();

        // Update performance metrics
        system.performance_metrics.response_time *= 0.95 + Math.random() * 0.1;
        system.performance_metrics.success_rate = Math.min(
          100,
          system.performance_metrics.success_rate + (Math.random() - 0.3),
        );
      });

      return updated;
    });
  };

  const checkForNewProblems = () => {
    // Simulate periodic problem detection
    if (Math.random() < 0.1) {
      // 10% chance every 2 seconds
      const problemTypes: DiagnosticProblem["type"][] = [
        "canvas_movement",
        "data_flow",
        "user_intent",
        "error_fix",
        "learning",
        "performance",
      ];

      const severities: DiagnosticProblem["severity"][] = [
        "low",
        "medium",
        "high",
      ];

      const newProblem: DiagnosticProblem = {
        id: `problem-${Date.now()}`,
        type: problemTypes[Math.floor(Math.random() * problemTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: generateProblemDescription(),
        assigned_ai: "",
        status: "detected",
        auto_fix_attempts: 0,
        fix_suggestions: [],
        user_input_needed: Math.random() > 0.7,
        progress: 0,
        estimated_completion: `${1 + Math.floor(Math.random() * 5)} minutes`,
      };

      setProblems((prev) => [...prev, newProblem]);
      addConsoleMessage(`🔥 New issue detected: ${newProblem.description}`);

      // Auto-assign to best AI
      autoAssignProblem(newProblem);
    }
  };

  const generateProblemDescription = (): string => {
    const descriptions = [
      "Canvas rendering performance degradation detected",
      "AI entity communication timeout",
      "Magnetic field visualization artifacts",
      "User interaction pattern anomaly",
      "Data flow bottleneck identified",
      "Consciousness field coherence disruption",
      "Gateway synchronization drift",
      "Learning algorithm convergence issue",
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const autoAssignProblem = (problem: DiagnosticProblem) => {
    // Find best AI for this problem type
    const aiArray = Array.from(aiSystems.values());
    const candidate_ais = aiArray
      .filter(
        (ai) =>
          ai.status === "active" &&
          ai.health > 60 &&
          ai.assigned_problems.length < 3,
      )
      .sort(
        (a, b) =>
          b.performance_metrics.success_rate -
          a.performance_metrics.success_rate,
      );

    if (candidate_ais.length > 0) {
      const assigned_ai = candidate_ais[0];
      assignProblemToAI(problem.id, assigned_ai.id);
      addConsoleMessage(`🤖 Auto-assigned problem to ${assigned_ai.name}`);
    }
  };

  const assignProblemToAI = (problem_id: string, ai_id: string) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === problem_id
          ? { ...p, assigned_ai: ai_id, status: "assigned" }
          : p,
      ),
    );

    setAiSystems((prev) => {
      const updated = new Map(prev);
      const ai = updated.get(ai_id);
      if (ai) {
        const problem = problems.find((p) => p.id === problem_id);
        if (problem) {
          ai.assigned_problems.push(problem);
          ai.current_task = `Working on: ${problem.description}`;
          ai.status = "fixing";
        }
      }
      return updated;
    });
  };

  const updateProblemProgress = () => {
    setProblems((prev) =>
      prev.map((problem) => {
        if (problem.status === "assigned" || problem.status === "in_progress") {
          const progress_increment = 5 + Math.random() * 15;
          const new_progress = Math.min(
            100,
            problem.progress + progress_increment,
          );

          let new_status = problem.status;
          if (new_progress >= 100) {
            new_status = Math.random() > 0.1 ? "resolved" : "testing_fix";
            if (new_status === "resolved") {
              addConsoleMessage(`✅ Problem resolved: ${problem.description}`);
              incrementAIFixCount(problem.assigned_ai);
            }
          } else if (problem.status === "assigned") {
            new_status = "in_progress";
            addConsoleMessage(`🔧 Starting work on: ${problem.description}`);
          }

          return {
            ...problem,
            progress: new_progress,
            status: new_status,
          };
        }
        return problem;
      }),
    );
  };

  const incrementAIFixCount = (ai_id: string) => {
    setAiSystems((prev) => {
      const updated = new Map(prev);
      const ai = updated.get(ai_id);
      if (ai) {
        ai.fixes_applied += 1;
        ai.status = "active";
        ai.current_task = "Monitoring for new issues";
      }
      return updated;
    });
  };

  const analyzeUserInteractions = () => {
    // Simulate user behavior analysis
    if (userProfile && Math.random() < 0.05) {
      const interaction: UserInteraction = {
        timestamp: new Date().toISOString(),
        type: "question",
        content: "How is the canvas performance?",
        ai_response:
          "Canvas systems are operating at 85% efficiency with active improvements ongoing.",
        satisfaction_score: 75 + Math.random() * 20,
        follow_up_needed: false,
      };

      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              interaction_history: [
                ...prev.interaction_history,
                interaction,
              ].slice(-10),
              trust_level: Math.min(100, prev.trust_level + 1),
            }
          : null,
      );
    }
  };

  const handleUserMessage = () => {
    if (!userInput.trim()) return;

    addConsoleMessage(`👤 User: ${userInput}`);

    // Simulate AI response
    const responses = [
      "Analyzing your request and optimizing accordingly...",
      "Understanding. I'll prioritize that issue and provide updates.",
      "Implementing fixes based on your feedback. Please monitor progress.",
      "Your input helps improve my learning patterns. Thank you.",
      "I've noted your preferences and will adjust my approach.",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    setTimeout(() => {
      addConsoleMessage(`🤖 AI: ${response}`);
    }, 1000);

    // Update user profile
    if (userProfile) {
      const interaction: UserInteraction = {
        timestamp: new Date().toISOString(),
        type: "question",
        content: userInput,
        ai_response: response,
        satisfaction_score: 80 + Math.random() * 15,
        follow_up_needed: false,
      };

      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              interaction_history: [
                ...prev.interaction_history,
                interaction,
              ].slice(-10),
              trust_level: Math.min(100, prev.trust_level + 2),
            }
          : null,
      );
    }

    setUserInput("");
  };

  const addConsoleMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleMessages((prev) =>
      [...prev, `[${timestamp}] ${message}`].slice(-50),
    );
  };

  const forceFixProblem = (problem_id: string) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === problem_id
          ? {
              ...p,
              status: "resolved",
              progress: 100,
              actual_completion: new Date().toISOString(),
            }
          : p,
      ),
    );

    addConsoleMessage(`⚡ Force-fixed problem: ${problem_id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#00ff00";
      case "fixing":
        return "#ffaa00";
      case "learning":
        return "#0088ff";
      case "error":
        return "#ff0000";
      case "idle":
        return "#888888";
      default:
        return "#ffffff";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ff0000";
      case "high":
        return "#ff6600";
      case "medium":
        return "#ffaa00";
      case "low":
        return "#00aa00";
      default:
        return "#888888";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "500px",
        height: "900px",
        background:
          "linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(20, 0, 40, 0.95))",
        border: "2px solid #00ffff",
        borderRadius: "12px",
        color: "#ffffff",
        fontFamily: "monospace",
        fontSize: "11px",
        overflow: "hidden",
        boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
        zIndex: 10000,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #00ffff",
          background: "rgba(0, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, color: "#00ffff" }}>
            🔧 AI DIAGNOSTIC CONSOLE
          </h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: "#0088ff",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px",
            }}
          >
            {showAdvanced ? "Simple" : "Advanced"}
          </button>
        </div>
        <div style={{ marginTop: "8px", fontSize: "10px", opacity: 0.8 }}>
          Real-time AI monitoring • Auto-fix • Progress tracking
        </div>
      </div>

      {/* AI Systems Status */}
      <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#ffaa00" }}>
          🤖 AI Systems Status
        </h4>
        <div style={{ maxHeight: "120px", overflowY: "auto" }}>
          {Array.from(aiSystems.values()).map((ai) => (
            <div
              key={ai.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 0",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div>
                <span style={{ color: getStatusColor(ai.status) }}>●</span>
                <span style={{ marginLeft: "5px" }}>{ai.name}</span>
              </div>
              <div style={{ display: "flex", gap: "10px", fontSize: "10px" }}>
                <span
                  style={{
                    color:
                      ai.health > 80
                        ? "#00ff00"
                        : ai.health > 60
                          ? "#ffaa00"
                          : "#ff0000",
                  }}
                >
                  {ai.health.toFixed(0)}%
                </span>
                <span style={{ color: "#aaaaaa" }}>
                  Fixes: {ai.fixes_applied}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Problems */}
      <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#ff6600" }}>
          ⚠️ Active Problems
        </h4>
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>
          {problems
            .filter((p) => p.status !== "resolved")
            .map((problem) => (
              <div
                key={problem.id}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "8px",
                  marginBottom: "5px",
                  borderRadius: "4px",
                  borderLeft: `3px solid ${getSeverityColor(problem.severity)}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "10px", fontWeight: "bold" }}>
                    {problem.description.slice(0, 35)}...
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      color: getSeverityColor(problem.severity),
                    }}
                  >
                    {problem.severity.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "9px", color: "#aaaaaa" }}>
                    {problem.assigned_ai
                      ? `Assigned to: ${problem.assigned_ai}`
                      : "Unassigned"}
                  </span>
                  <span style={{ fontSize: "9px", color: "#aaaaaa" }}>
                    {problem.progress.toFixed(0)}%
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "3px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "2px",
                    marginTop: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${problem.progress}%`,
                      height: "100%",
                      background:
                        problem.progress === 100 ? "#00ff00" : "#00aaff",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>

                {showAdvanced && (
                  <div
                    style={{ marginTop: "5px", display: "flex", gap: "5px" }}
                  >
                    <button
                      onClick={() => forceFixProblem(problem.id)}
                      style={{
                        background: "#ff6600",
                        color: "white",
                        border: "none",
                        padding: "3px 6px",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "9px",
                      }}
                    >
                      Force Fix
                    </button>
                    <button
                      onClick={() => setSelectedProblem(problem)}
                      style={{
                        background: "#0088ff",
                        color: "white",
                        border: "none",
                        padding: "3px 6px",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "9px",
                      }}
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* User Profile */}
      {userProfile && (
        <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#00ff88" }}>
            👤 User Profile
          </h4>
          <div style={{ fontSize: "10px" }}>
            <div>Style: {userProfile.communication_style}</div>
            <div>Trust Level: {userProfile.trust_level.toFixed(0)}%</div>
            <div>Interactions: {userProfile.interaction_history.length}</div>
            <div>Problem Areas: {userProfile.problem_areas.join(", ")}</div>
          </div>
        </div>
      )}

      {/* User Communication */}
      <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#ffff00" }}>
          💬 AI Communication
        </h4>
        <div style={{ display: "flex", gap: "5px" }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleUserMessage()}
            placeholder="Ask AI about problems, request fixes, or provide feedback..."
            style={{
              flex: 1,
              padding: "5px",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid #00ffff",
              borderRadius: "3px",
              color: "#ffffff",
              fontSize: "10px",
            }}
          />
          <button
            onClick={handleUserMessage}
            style={{
              background: "#00ff88",
              color: "black",
              border: "none",
              padding: "5px 10px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "10px",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Console Output */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>
          📟 Console Output
        </h4>
        <div
          ref={consoleRef}
          style={{
            flex: 1,
            background: "rgba(0, 0, 0, 0.7)",
            padding: "8px",
            borderRadius: "4px",
            overflowY: "auto",
            fontSize: "9px",
            lineHeight: "1.2",
          }}
        >
          {consoleMessages.map((message, index) => (
            <div key={index} style={{ marginBottom: "2px", color: "#00ff00" }}>
              {message}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Problem Details Modal */}
      {selectedProblem && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "10px",
            right: "10px",
            background: "rgba(0, 0, 0, 0.95)",
            border: "1px solid #ffaa00",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 10001,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <h4 style={{ margin: 0, color: "#ffaa00" }}>Problem Details</h4>
            <button
              onClick={() => setSelectedProblem(null)}
              style={{
                background: "transparent",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ fontSize: "11px" }}>
            <div>
              <strong>Type:</strong> {selectedProblem.type}
            </div>
            <div>
              <strong>Severity:</strong> {selectedProblem.severity}
            </div>
            <div>
              <strong>Description:</strong> {selectedProblem.description}
            </div>
            <div>
              <strong>Status:</strong> {selectedProblem.status}
            </div>
            <div>
              <strong>Progress:</strong> {selectedProblem.progress.toFixed(0)}%
            </div>
            <div>
              <strong>Auto-fix attempts:</strong>{" "}
              {selectedProblem.auto_fix_attempts}
            </div>

            {selectedProblem.fix_suggestions.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <strong>Fix Suggestions:</strong>
                <ul style={{ margin: "5px 0", paddingLeft: "15px" }}>
                  {selectedProblem.fix_suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: "3px" }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDiagnosticConsole;
