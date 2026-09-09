import React, { useState, useEffect, useRef } from "react";

interface AIInteraction {
  id: string;
  timestamp: string;
  type: "detection" | "fix" | "question" | "analysis" | "learning";
  title: string;
  description: string;
  userInput?: string;
  aiResponse?: string;
  confidence: number;
  status: "active" | "resolved" | "pending" | "failed";
  category: "movement" | "element" | "conversation" | "error" | "general";
}

interface MovableAIPanelProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

const MovableAIPanel: React.FC<MovableAIPanelProps> = ({
  isVisible = true,
  onToggle,
}) => {
  const [interactions, setInteractions] = useState<AIInteraction[]>([]);
  const [selectedInteraction, setSelectedInteraction] =
    useState<AIInteraction | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [filter, setFilter] = useState<AIInteraction["category"] | "all">(
    "all",
  );
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with recent AI interactions
    loadRecentInteractions();

    // Set up real-time monitoring
    const interval = setInterval(loadRecentInteractions, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const loadRecentInteractions = () => {
    // Get data from AI systems
    const newInteractions: AIInteraction[] = [];

    // Check self-learning AI system
    if ((window as any).selfLearningAISystem) {
      const aiSystem = (window as any).selfLearningAISystem;

      // Get movement analysis
      const movementAnalysis = aiSystem.getMovementAnalysis();
      movementAnalysis.forEach((analysis: any, entityId: string) => {
        if (!analysis.isActuallyMoving && analysis.stuckDuration > 5000) {
          newInteractions.push({
            id: `movement_${entityId}_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "detection",
            title: `Static Movement Detected`,
            description: `Entity ${entityId} has been stuck for ${Math.round(analysis.stuckDuration / 1000)}s`,
            confidence: 0.9,
            status: "active",
            category: "movement",
          });
        }
      });

      // Get element states
      const elementStates = aiSystem.getElementStates();
      elementStates.forEach((state: any, elementId: string) => {
        if (
          state.currentState !== "present" &&
          state.currentState !== "rendering"
        ) {
          newInteractions.push({
            id: `element_${elementId}_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "detection",
            title: `Element Issue Detected`,
            description: `${elementId} is ${state.currentState} but should be ${state.expectedState}`,
            confidence: 0.8,
            status: "pending",
            category: "element",
          });
        }
      });

      // Get generated fixes
      const generatedFixes = aiSystem.getGeneratedFixes();
      generatedFixes.forEach((fix: any, fixId: string) => {
        if (fix.testResult === "untested") {
          newInteractions.push({
            id: `fix_${fixId}`,
            timestamp: fix.createdAt,
            type: "fix",
            title: `AI Generated Fix Available`,
            description: fix.issueDescription,
            confidence: fix.confidence,
            status: "pending",
            category: "error",
          });
        }
      });
    }

    // Check console monitoring
    if ((window as any).consoleMonitor) {
      const stats = (window as any).consoleMonitor.stats();
      if (stats.errorCount > 0) {
        newInteractions.push({
          id: `console_errors_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "detection",
          title: `Console Errors Detected`,
          description: `${stats.errorCount} errors detected, ${stats.fixedCount} auto-fixed`,
          confidence: 1.0,
          status: stats.fixedCount === stats.errorCount ? "resolved" : "active",
          category: "error",
        });
      }
    }

    // Update interactions (keep only last 10)
    setInteractions((prev) => {
      const combined = [...prev, ...newInteractions];
      const unique = combined.filter(
        (item, index, arr) => arr.findIndex((t) => t.id === item.id) === index,
      );
      return unique
        .slice(-10)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleUserQuestion = async () => {
    if (!userInput.trim()) return;

    const newInteraction: AIInteraction = {
      id: `question_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "question",
      title: "User Question",
      description: userInput,
      userInput,
      confidence: 1.0,
      status: "pending",
      category: "conversation",
    };

    setInteractions((prev) => [newInteraction, ...prev.slice(0, 9)]);

    // Get AI response
    let aiResponse = "";
    if ((window as any).selfLearningAISystem) {
      aiResponse = (window as any).selfLearningAISystem.answerQuestion(
        userInput,
      );
    } else if ((window as any).askAI) {
      aiResponse = (window as any).askAI(userInput);
    } else {
      aiResponse = "AI systems are initializing. Please try again in a moment.";
    }

    // Update with response
    setInteractions((prev) =>
      prev.map((interaction) =>
        interaction.id === newInteraction.id
          ? {
              ...interaction,
              aiResponse,
              status: "resolved" as const,
            }
          : interaction,
      ),
    );

    setUserInput("");
  };

  const applyFix = (interaction: AIInteraction) => {
    if (interaction.type === "fix" && (window as any).selfLearningAISystem) {
      const fixId = interaction.id.replace("fix_", "");
      (window as any).selfLearningAISystem
        .applyGeneratedFix(fixId)
        .then((success: boolean) => {
          setInteractions((prev) =>
            prev.map((item) =>
              item.id === interaction.id
                ? {
                    ...item,
                    status: success
                      ? ("resolved" as const)
                      : ("failed" as const),
                  }
                : item,
            ),
          );
        });
    }
  };

  const getCategoryColor = (category: AIInteraction["category"]) => {
    const colors = {
      movement: "#ff4444",
      element: "#44ff44",
      conversation: "#4444ff",
      error: "#ff8800",
      general: "#8844ff",
    };
    return colors[category] || "#ffffff";
  };

  const getStatusIcon = (status: AIInteraction["status"]) => {
    const icons = {
      active: "🔄",
      resolved: "✅",
      pending: "⏳",
      failed: "❌",
    };
    return icons[status] || "❓";
  };

  const filteredInteractions = interactions.filter(
    (interaction) => filter === "all" || interaction.category === filter,
  );

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-20 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 z-50"
        title="Open AI Panel"
      >
        🤖
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`fixed bg-gradient-to-br from-purple-900 to-blue-900 border-2 border-purple-500 rounded-lg shadow-2xl z-50 ${
        isMinimized ? "w-80 h-12" : "w-96 h-96"
      }`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      {/* Header */}
      <div
        className="bg-purple-600 text-white p-3 rounded-t-lg flex justify-between items-center cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h3 className="font-bold">AI Monitoring Panel</h3>
          <span className="text-xs bg-purple-800 px-2 py-1 rounded">
            {filteredInteractions.length} items
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:text-gray-200"
          >
            {isMinimized ? "□" : "_"}
          </button>
          {onToggle && (
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Filters */}
          <div className="p-2 bg-purple-800 border-b border-purple-600">
            <div className="flex gap-1 text-xs">
              {["all", "movement", "element", "conversation", "error"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setFilter(cat as AIInteraction["category"] | "all")
                    }
                    className={`px-2 py-1 rounded ${
                      filter === cat
                        ? "bg-purple-600 text-white"
                        : "bg-purple-700 text-purple-200 hover:bg-purple-600"
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Interactions List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-64">
            {filteredInteractions.length === 0 ? (
              <div className="text-center py-4 text-purple-300">
                <p>No recent AI interactions</p>
                <p className="text-xs">AI systems are monitoring...</p>
              </div>
            ) : (
              filteredInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  onClick={() => setSelectedInteraction(interaction)}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    selectedInteraction?.id === interaction.id
                      ? "bg-purple-700 border-purple-400"
                      : "bg-purple-800 border-purple-600 hover:bg-purple-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getStatusIcon(interaction.status)}</span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getCategoryColor(interaction.category),
                      }}
                    ></span>
                    <span className="text-sm font-semibold text-white">
                      {interaction.title}
                    </span>
                    <span className="text-xs text-purple-300 ml-auto">
                      {new Date(interaction.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs text-purple-200">
                    {interaction.description.length > 60
                      ? `${interaction.description.slice(0, 60)}...`
                      : interaction.description}
                  </div>
                  {interaction.confidence && (
                    <div className="text-xs text-purple-400 mt-1">
                      Confidence: {Math.round(interaction.confidence * 100)}%
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* User Input */}
          <div className="border-t border-purple-600 p-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask AI about detected issues..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUserQuestion()}
                className="flex-1 px-2 py-1 text-xs bg-purple-800 text-white border border-purple-600 rounded"
              />
              <button
                onClick={handleUserQuestion}
                className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-500"
              >
                Ask
              </button>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedInteraction && !isMinimized && (
        <div className="absolute top-0 left-full ml-2 w-80 bg-gray-900 border-2 border-purple-500 rounded-lg shadow-xl p-4 text-white z-60">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-purple-300">
              {selectedInteraction.title}
            </h4>
            <button
              onClick={() => setSelectedInteraction(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <strong>Description:</strong>
              <p className="text-gray-300 mt-1">
                {selectedInteraction.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Type:</strong> {selectedInteraction.type}
              </div>
              <div>
                <strong>Status:</strong> {selectedInteraction.status}
              </div>
              <div>
                <strong>Category:</strong> {selectedInteraction.category}
              </div>
              <div>
                <strong>Confidence:</strong>{" "}
                {Math.round(selectedInteraction.confidence * 100)}%
              </div>
            </div>

            {selectedInteraction.userInput && (
              <div>
                <strong>User Input:</strong>
                <p className="text-blue-300 mt-1 italic">
                  "{selectedInteraction.userInput}"
                </p>
              </div>
            )}

            {selectedInteraction.aiResponse && (
              <div>
                <strong>AI Response:</strong>
                <p className="text-green-300 mt-1">
                  {selectedInteraction.aiResponse}
                </p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {selectedInteraction.type === "fix" &&
                selectedInteraction.status === "pending" && (
                  <button
                    onClick={() => applyFix(selectedInteraction)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-500"
                  >
                    Apply Fix
                  </button>
                )}

              <button
                onClick={() => {
                  setUserInput(
                    `Tell me more about: ${selectedInteraction.title}`,
                  );
                  setSelectedInteraction(null);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-500"
              >
                Ask More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovableAIPanel;
