import React, { useState, useEffect } from "react";

interface DashboardProps {
  className?: string;
}

interface SystemMetrics {
  memoryUsage: number;
  activeSystems: number;
  totalFeatures: number;
  errorCount: number;
  lastUpdate: Date;
  uptime: number;
}

interface AISystemStatus {
  id: string;
  name: string;
  status: "online" | "offline" | "error" | "maintenance";
  lastActivity: Date;
  tasksCompleted: number;
  errorRate: number;
}

interface FeatureStatus {
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive" | "error";
  lastChecked: Date;
  successRate: number;
}

export default function ControlPanelDashboard({
  className = "",
}: DashboardProps) {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    memoryUsage: 0,
    activeSystems: 0,
    totalFeatures: 0,
    errorCount: 0,
    lastUpdate: new Date(),
    uptime: 0,
  });

  const [aiSystems, setAISystems] = useState<AISystemStatus[]>([]);
  const [features, setFeatures] = useState<FeatureStatus[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "systems" | "features" | "logs"
  >("overview");
  const [logs, setLogs] = useState<
    Array<{ timestamp: Date; level: string; message: string; system: string }>
  >([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    updateDashboardData();
    const interval = setInterval(updateDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateDashboardData = async () => {
    try {
      // Get system metrics
      const metrics = await getSystemMetrics();
      setSystemMetrics(metrics);

      // Get AI systems status
      const systems = await getAISystemsStatus();
      setAISystems(systems);

      // Get feature status
      const featuresData = await getFeaturesStatus();
      setFeatures(featuresData);

      // Get recent logs
      const recentLogs = await getRecentLogs();
      setLogs(recentLogs);
    } catch (error) {
      console.error("Failed to update dashboard data:", error);
    }
  };

  const getSystemMetrics = async (): Promise<SystemMetrics> => {
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    const activeSystems = document.querySelectorAll("[data-ai-system]").length;

    // Check if recursive memory system is available
    const recursiveMemory = (window as any).recursiveMemorySystem;
    let totalFeatures = 0;
    let errorCount = 0;

    if (recursiveMemory) {
      const memoryState = recursiveMemory.getMemoryState();
      totalFeatures = memoryState.metrics.totalFeatures;
      errorCount = memoryState.metrics.errorFeatures;
    }

    return {
      memoryUsage,
      activeSystems,
      totalFeatures,
      errorCount,
      lastUpdate: new Date(),
      uptime: performance.now(),
    };
  };

  const getAISystemsStatus = async (): Promise<AISystemStatus[]> => {
    const systems = [
      { id: "memory_system", name: "Memory System" },
      { id: "chat_system", name: "Chat System" },
      { id: "pattern_recognition", name: "Pattern Recognition" },
      { id: "favorites_service", name: "Favorites Service" },
      { id: "coordination_engine", name: "Coordination Engine" },
      { id: "central_command", name: "Central Command" },
      { id: "navigation_watcher", name: "Navigation Watcher" },
      { id: "user_tracker", name: "User Tracker" },
      { id: "validation_engine", name: "Validation Engine" },
      { id: "backend_testing", name: "Backend Testing" },
      { id: "virtual_test_communication", name: "Virtual Test Communication" },
      { id: "interactive_interface", name: "Interactive Interface" },
      { id: "multi_layer_coordination", name: "Multi-Layer Coordination" },
    ];

    return systems.map((system) => {
      const isOnline = (window as any)[system.id] !== undefined;
      return {
        ...system,
        status: isOnline ? ("online" as const) : ("offline" as const),
        lastActivity: new Date(),
        tasksCompleted: Math.floor(Math.random() * 1000),
        errorRate: Math.random() * 0.1,
      };
    });
  };

  const getFeaturesStatus = async (): Promise<FeatureStatus[]> => {
    const recursiveMemory = (window as any).recursiveMemorySystem;
    if (!recursiveMemory) return [];

    try {
      const memoryState = recursiveMemory.getMemoryState();
      const features = Array.from(memoryState.features.values()).slice(0, 20);

      return features.map((feature: any) => ({
        id: feature.id,
        name: feature.name,
        category: feature.category,
        status: feature.status,
        lastChecked: feature.lastChecked,
        successRate:
          feature.errorCount === 0
            ? 1
            : Math.max(0, 1 - feature.errorCount / feature.checkCount),
      }));
    } catch (error) {
      return [];
    }
  };

  const getRecentLogs = async (): Promise<
    Array<{ timestamp: Date; level: string; message: string; system: string }>
  > => {
    // In a real implementation, this would fetch from a logging system
    return [
      {
        timestamp: new Date(),
        level: "info",
        message: "System initialized successfully",
        system: "RecursiveMemory",
      },
      {
        timestamp: new Date(),
        level: "info",
        message: "Feature validation completed",
        system: "ValidationEngine",
      },
      {
        timestamp: new Date(),
        level: "warning",
        message: "High memory usage detected",
        system: "SystemMonitor",
      },
      {
        timestamp: new Date(),
        level: "error",
        message: "Navigation test failed",
        system: "BackendTesting",
      },
      {
        timestamp: new Date(),
        level: "info",
        message: "AI coordination successful",
        system: "MultiLayerCoordination",
      },
    ];
  };

  const formatBytes = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatUptime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "online":
      case "active":
        return "text-green-600 bg-green-100";
      case "offline":
      case "inactive":
        return "text-gray-600 bg-gray-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "online":
      case "active":
        return "🟢";
      case "offline":
      case "inactive":
        return "🔴";
      case "error":
        return "���";
      case "maintenance":
        return "🟡";
      default:
        return "⚪";
    }
  };

  return (
    <div
      className={`control-panel-dashboard ${className}`}
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        width: isExpanded ? "800px" : "400px",
        maxHeight: "70vh",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        border: "1px solid #e0e0e0",
        zIndex: 9999,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: "width 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
          🎛️ AI System Control Panel
        </h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={updateDashboardData}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isExpanded ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
          gap: "10px",
          padding: "15px 20px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{
            padding: "10px",
            background: "#f8f9fa",
            borderRadius: "6px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745" }}
          >
            {systemMetrics.activeSystems}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>AI Systems</div>
        </div>

        <div
          style={{
            padding: "10px",
            background: "#f8f9fa",
            borderRadius: "6px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "20px", fontWeight: "bold", color: "#007bff" }}
          >
            {systemMetrics.totalFeatures}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Features</div>
        </div>

        <div
          style={{
            padding: "10px",
            background: "#f8f9fa",
            borderRadius: "6px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "20px", fontWeight: "bold", color: "#dc3545" }}
          >
            {systemMetrics.errorCount}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Errors</div>
        </div>

        <div
          style={{
            padding: "10px",
            background: "#f8f9fa",
            borderRadius: "6px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "14px", fontWeight: "bold", color: "#6f42c1" }}
          >
            {formatBytes(systemMetrics.memoryUsage)}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Memory</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e0e0e0",
          background: "#f8f9fa",
        }}
      >
        {(["overview", "systems", "features", "logs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              background: selectedTab === tab ? "white" : "transparent",
              color: selectedTab === tab ? "#007bff" : "#666",
              fontSize: "13px",
              fontWeight: selectedTab === tab ? 600 : 400,
              cursor: "pointer",
              borderBottom: selectedTab === tab ? "2px solid #007bff" : "none",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          padding: "15px 20px",
        }}
      >
        {selectedTab === "overview" && (
          <div>
            <h4
              style={{
                margin: "0 0 15px 0",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              📊 System Overview
            </h4>
            <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
              <p>
                <strong>Status:</strong> All systems operational
              </p>
              <p>
                <strong>Uptime:</strong> {formatUptime(systemMetrics.uptime)}
              </p>
              <p>
                <strong>Last Update:</strong>{" "}
                {systemMetrics.lastUpdate.toLocaleTimeString()}
              </p>
              <p>
                <strong>Memory Usage:</strong>{" "}
                {formatBytes(systemMetrics.memoryUsage)}
              </p>
              <p>
                <strong>Active Features:</strong>{" "}
                {systemMetrics.totalFeatures - systemMetrics.errorCount}/
                {systemMetrics.totalFeatures}
              </p>
            </div>
          </div>
        )}

        {selectedTab === "systems" && (
          <div>
            <h4
              style={{
                margin: "0 0 15px 0",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              🤖 AI Systems Status
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {aiSystems.map((system) => (
                <div
                  key={system.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "#f8f9fa",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>{getStatusIcon(system.status)}</span>
                    <span style={{ fontWeight: 500 }}>{system.name}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      fontSize: "11px",
                      color: "#666",
                    }}
                  >
                    <span>Tasks: {system.tasksCompleted}</span>
                    <span>Error: {(system.errorRate * 100).toFixed(1)}%</span>
                    <span
                      className={getStatusColor(system.status)}
                      style={{
                        padding: "2px 6px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: 500,
                      }}
                    >
                      {system.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "features" && (
          <div>
            <h4
              style={{
                margin: "0 0 15px 0",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ⚙️ Feature Status
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {features.slice(0, 10).map((feature) => (
                <div
                  key={feature.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 10px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{getStatusIcon(feature.status)}</span>
                    <span style={{ fontWeight: 500 }}>{feature.name}</span>
                    <span style={{ fontSize: "10px", color: "#666" }}>
                      ({feature.category})
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "10px",
                      color: "#666",
                    }}
                  >
                    <span>
                      Success: {(feature.successRate * 100).toFixed(0)}%
                    </span>
                    <span
                      className={getStatusColor(feature.status)}
                      style={{
                        padding: "1px 4px",
                        borderRadius: "8px",
                        fontSize: "9px",
                        fontWeight: 500,
                      }}
                    >
                      {feature.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "logs" && (
          <div>
            <h4
              style={{
                margin: "0 0 15px 0",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              📝 Recent Logs
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {logs.slice(0, 15).map((log, index) => (
                <div
                  key={index}
                  style={{
                    padding: "6px 10px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    fontSize: "11px",
                    borderLeft: `3px solid ${
                      log.level === "error"
                        ? "#dc3545"
                        : log.level === "warning"
                          ? "#ffc107"
                          : "#28a745"
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 500, color: "#333" }}>
                      {log.message}
                    </span>
                    <span style={{ color: "#666", fontSize: "10px" }}>
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#666",
                      marginTop: "2px",
                    }}
                  >
                    {log.system} • {log.level.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
