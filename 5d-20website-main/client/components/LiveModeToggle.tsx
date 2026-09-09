// Live Mode Toggle Button
// Floating button to activate/deactivate live AI monitoring

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Bot,
  Eye,
  Monitor,
  Pause,
  Play,
  Settings,
  Zap,
} from "lucide-react";
import LiveAIMonitoringService from "../services/LiveAIMonitoringService";
import LiveModeMonitor from "./LiveModeMonitor";
import { useUserAuth } from "../hooks/useUserAuth";

interface LiveModeToggleProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showForRoles?: ("user" | "admin" | "developer")[];
}

const LiveModeToggle: React.FC<LiveModeToggleProps> = ({
  position = "bottom-right",
  showForRoles = ["admin", "developer"],
}) => {
  const { user } = useUserAuth();
  const [isLiveModeActive, setIsLiveModeActive] = useState(false);
  const [showMonitor, setShowMonitor] = useState(false);
  const [metrics, setMetrics] = useState<any>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Determine user role
  const userRole = user?.role || "user";
  const canUseLiveMode = showForRoles.includes(userRole);

  useEffect(() => {
    if (!canUseLiveMode) return;

    // Update status periodically
    const updateStatus = () => {
      setIsLiveModeActive(LiveAIMonitoringService.isActive());
      setMetrics(LiveAIMonitoringService.getMetrics());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 3000);

    // Listen for admin reports for notifications
    const checkForNotifications = () => {
      try {
        const reports = JSON.parse(
          localStorage.getItem("adminReports") || "[]",
        );
        const recentReport = reports[0];

        if (
          recentReport &&
          Date.now() - new Date(recentReport.timestamp).getTime() < 10000
        ) {
          // Show notification for reports from last 10 seconds
          if (
            recentReport.type === "goal_triggered" ||
            recentReport.type === "alert"
          ) {
            setNotification(recentReport.type);
            setTimeout(() => setNotification(null), 5000);
          }
        }
      } catch {
        // Ignore parsing errors
      }
    };

    const notificationInterval = setInterval(checkForNotifications, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(notificationInterval);
    };
  }, [canUseLiveMode]);

  const handleToggleLiveMode = async () => {
    try {
      if (isLiveModeActive) {
        await LiveAIMonitoringService.stopLiveMode();
        setNotification("Live mode stopped");
      } else {
        await LiveAIMonitoringService.startLiveMode();
        setNotification("Live mode started");
      }

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error toggling live mode:", error);
      setNotification("Error occurred");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "top-right":
        return "top-6 right-6";
      case "top-left":
        return "top-6 left-6";
      default:
        return "bottom-6 right-6";
    }
  };

  if (!canUseLiveMode) return null;

  return (
    <>
      {/* Main Toggle Button */}
      <div className={`fixed ${getPositionClasses()} z-40`}>
        <div className="relative">
          {/* Notification Badge */}
          {notification && (
            <div className="absolute -top-12 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              {notification.replace(/_/g, " ")}
            </div>
          )}

          {/* Main Button */}
          <div
            className={`bg-white rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 ${
              isExpanded ? "p-4 min-w-64" : "p-3"
            }`}
          >
            {/* Collapsed View */}
            {!isExpanded && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsExpanded(true)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isLiveModeActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isLiveModeActive ? (
                    <Activity className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Monitor className="w-5 h-5" />
                  )}
                </button>

                {/* Status Indicator */}
                {isLiveModeActive && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">
                      LIVE
                    </span>
                  </div>
                )}

                {/* Error Count Badge */}
                {metrics.errorsCount > 0 && (
                  <Badge className="bg-red-100 text-red-600 text-xs">
                    {metrics.errorsCount}
                  </Badge>
                )}
              </div>
            )}

            {/* Expanded View */}
            {isExpanded && (
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-800">
                      Live AI Monitor
                    </span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge
                    className={
                      isLiveModeActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {isLiveModeActive ? "🔴 Active" : "⏸️ Inactive"}
                  </Badge>
                </div>

                {/* Metrics */}
                {isLiveModeActive && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Errors:</span>
                      <span
                        className={
                          metrics.errorsCount > 0
                            ? "text-red-600 font-semibold"
                            : "text-green-600"
                        }
                      >
                        {metrics.errorsCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Health:</span>
                      <span className="text-green-600">
                        {metrics.performanceScore || 100}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Goals:</span>
                      <span className="text-blue-600">
                        {metrics.goalCompletions || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Updated:</span>
                      <span className="text-gray-500">
                        {metrics.lastUpdate
                          ? new Date(metrics.lastUpdate).toLocaleTimeString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={handleToggleLiveMode}
                    className={
                      isLiveModeActive
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }
                  >
                    {isLiveModeActive ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowMonitor(true)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Monitor
                  </Button>

                  {/* Quick Test Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await LiveAIMonitoringService.runAutomatedTest(
                          "quick_test",
                        );
                        setNotification("Test completed");
                        setTimeout(() => setNotification(null), 3000);
                      } catch (error) {
                        setNotification("Test failed");
                        setTimeout(() => setNotification(null), 3000);
                      }
                    }}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Test
                  </Button>
                </div>

                {/* User Role Indicator */}
                <div className="text-xs text-gray-500 text-center">
                  Role: {userRole} • AI Monitoring {canUseLiveMode ? "✓" : "✗"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monitor Interface */}
      <LiveModeMonitor
        isVisible={showMonitor}
        onToggle={() => setShowMonitor(false)}
        userRole={userRole as "user" | "admin" | "developer"}
      />
    </>
  );
};

export default LiveModeToggle;
