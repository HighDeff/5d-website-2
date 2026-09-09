import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Zap,
  Brain,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Activity,
  Network,
} from "lucide-react";

interface AIAgent {
  id: string;
  name: string;
  type: string;
  status: "active" | "idle" | "busy" | "error";
  currentTask?: string;
  lastActivity: Date;
}

interface AICollaborationStatusProps {
  className?: string;
  showDetails?: boolean;
}

const AICollaborationStatus: React.FC<AICollaborationStatusProps> = ({
  className = "",
  showDetails = false,
}) => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initializeConnection();
    const interval = setInterval(updateStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const initializeConnection = async () => {
    try {
      const AICentralCommandModule = await import(
        "../services/AICentralCommand"
      );
      const AICentralCommand = AICentralCommandModule.default;
      const central = AICentralCommand.getInstance();

      // Listen for real-time updates
      central.addEventListener("ai-message", (event: CustomEvent) => {
        handleAIMessage(event.detail);
      });

      setIsConnected(true);
      await updateStatus();
    } catch (error) {
      console.error("Error connecting to AI Central Command:", error);
      setIsConnected(false);
    }
  };

  const updateStatus = async () => {
    try {
      const AICentralCommandModule = await import(
        "../services/AICentralCommand"
      );
      const AICentralCommand = AICentralCommandModule.default;
      const central = AICentralCommand.getInstance();

      const status = await central.getSystemStatus();
      const agentList = central.getAgents() || [];
      const tasks = central.getActiveTasks() || [];

      // Ensure status has safe defaults
      const safeStatus = {
        isRunning: false,
        systemHealth: 0,
        agentHealth: 0,
        taskHealth: 0,
        knowledgeBaseCount: 0,
        screenshotQueueLength: 0,
        updateCount: 0,
        keywordCount: 0,
        ocrEnabled: false,
        ...status,
      };

      setSystemStatus(safeStatus);
      setAgents(agentList);

      // Get recent activity from database
      try {
        const recentEntries = await central.queryDatabase({
          metadata: { page: window.location.pathname },
        });
        if (recentEntries && recentEntries.length > 0) {
          setRecentActivity(recentEntries.slice(-5));
        } else {
          // Fallback to recent updates if query returns nothing
          const updates = central.getRecentUpdates
            ? central.getRecentUpdates(5)
            : [];
          setRecentActivity(updates);
        }
      } catch (error) {
        // Fallback for activity
        console.warn("Could not load recent activity, using fallback");
        const fallbackActivity = [
          {
            id: "activity1",
            type: "task-assignment",
            timestamp: new Date().toISOString(),
            data: { action: "System monitoring active" },
          },
          {
            id: "activity2",
            type: "agent-status",
            timestamp: new Date(Date.now() - 60000).toISOString(),
            data: { action: "Agents initialized" },
          },
        ];
        setRecentActivity(fallbackActivity);
      }
    } catch (error) {
      console.error("Error updating AI status:", error);
    }
  };

  const handleAIMessage = (message: any) => {
    // Update recent activity with new messages
    setRecentActivity((prev) => [
      ...prev.slice(-4),
      {
        id: message.id,
        type: "communication",
        data: message,
        timestamp: new Date(),
      },
    ]);

    // Update agent status if it's a status update
    if (message.content?.agentStatus) {
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === message.from
            ? { ...agent, ...message.content.agentStatus }
            : agent,
        ),
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "idle":
        return "bg-gray-400";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "detection":
        return <AlertTriangle className="w-3 h-3" />;
      case "fix-attempt":
        return <Zap className="w-3 h-3" />;
      case "communication":
        return <MessageCircle className="w-3 h-3" />;
      case "result":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  if (!isConnected) {
    return (
      <div className={`${className}`}>
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 text-gray-500">
              <Network className="w-4 h-4" />
              <span className="text-sm">AI System Offline</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">
                  AI Collaboration Network
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            </div>
            {systemStatus && systemStatus.systemHealth !== undefined && (
              <Badge
                variant="outline"
                className="text-xs bg-white border-blue-300"
              >
                {(systemStatus.systemHealth || 0).toFixed(0)}% Health
              </Badge>
            )}
          </div>

          {/* Agents Status */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
            {agents.slice(0, 4).map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-lg p-2 border border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}
                    ></div>
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {agent.name.split(" ")[0]}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {agent.type}
                  </Badge>
                </div>
                {agent.currentTask && (
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {agent.currentTask}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">
                {systemStatus?.activeAgents || 0}
              </div>
              <div className="text-xs text-blue-600">Active AIs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-800">
                {systemStatus?.pendingTasks || 0}
              </div>
              <div className="text-xs text-green-600">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-800">
                {recentActivity.length}
              </div>
              <div className="text-xs text-purple-600">Recent</div>
            </div>
          </div>

          {/* Recent Activity */}
          {showDetails && recentActivity.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-blue-800 mb-2 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Recent AI Activity
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {recentActivity.slice(-3).map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="flex items-center space-x-2 text-xs bg-white rounded p-2 border border-blue-100"
                  >
                    <div className="text-blue-600">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 truncate">
                      <span className="font-medium">
                        {activity.data?.action || activity.type}
                      </span>
                      {activity.data?.issue?.description && (
                        <div className="text-gray-500 truncate">
                          {activity.data.issue.description}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collaboration Indicator */}
          {agents.filter((a) => a.status === "busy").length > 1 && (
            <div className="mt-2 p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">
                  🤝 AIs are collaborating on issue resolution
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AICollaborationStatus;
