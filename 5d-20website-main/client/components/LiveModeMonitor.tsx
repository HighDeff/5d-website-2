// Live Mode Monitor Component
// Real-time monitoring interface for AI tracking, diagnostics, and admin controls

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  Bug,
  CheckCircle,
  Clock,
  Code,
  Database,
  Eye,
  Filter,
  Gauge,
  Goal,
  Heart,
  Info,
  Lightning,
  Monitor,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Shield,
  Target,
  Users,
  Zap,
  X,
  Plus,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import LiveAIMonitoringService from "../services/LiveAIMonitoringService";

interface LiveModeMonitorProps {
  isVisible: boolean;
  onToggle: () => void;
  userRole?: "user" | "admin" | "developer";
}

const LiveModeMonitor: React.FC<LiveModeMonitorProps> = ({
  isVisible,
  onToggle,
  userRole = "user",
}) => {
  const [isLiveModeActive, setIsLiveModeActive] = useState(false);
  const [metrics, setMetrics] = useState<any>({});
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "goals" | "diagnostics" | "settings"
  >("overview");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [adminReports, setAdminReports] = useState<any[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    trigger: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isVisible) {
      updateData();
      loadAdminReports();

      if (autoRefresh) {
        const interval = setInterval(updateData, 2000);
        return () => clearInterval(interval);
      }
    }
  }, [isVisible, autoRefresh]);

  const updateData = () => {
    setIsLiveModeActive(LiveAIMonitoringService.isActive());
    setMetrics(LiveAIMonitoringService.getMetrics());
    setRecentEvents(LiveAIMonitoringService.getRecentEvents(20));
    setGoals(LiveAIMonitoringService.getGoals());
  };

  const loadAdminReports = () => {
    try {
      const reports = JSON.parse(localStorage.getItem("adminReports") || "[]");
      setAdminReports(reports.slice(0, 50)); // Show last 50 reports
    } catch {
      setAdminReports([]);
    }
  };

  const handleToggleLiveMode = async () => {
    try {
      if (isLiveModeActive) {
        await LiveAIMonitoringService.stopLiveMode();
      } else {
        await LiveAIMonitoringService.startLiveMode();
      }
      updateData();
    } catch (error) {
      console.error("Error toggling live mode:", error);
    }
  };

  const handleRunTest = async () => {
    try {
      const testResults =
        await LiveAIMonitoringService.runAutomatedTest("manual_test");
      console.log("Test results:", testResults);
      updateData();
    } catch (error) {
      console.error("Error running test:", error);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.trigger) return;

    try {
      const goalId = LiveAIMonitoringService.addGoal({
        name: newGoal.name,
        description: newGoal.description,
        trigger: newGoal.trigger,
        conditions: [],
        actions: ["capture_state", "send_alert"],
        isActive: true,
        priority: newGoal.priority,
      });

      setNewGoal({
        name: "",
        description: "",
        trigger: "",
        priority: "medium",
      });

      updateData();
      console.log("Goal added:", goalId);
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleRemoveGoal = (goalId: string) => {
    LiveAIMonitoringService.removeGoal(goalId);
    updateData();
  };

  const filteredEvents = recentEvents.filter((event) => {
    if (selectedSeverity === "all") return true;
    return event.severity === selectedSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportData = () => {
    const data = {
      metrics,
      events: recentEvents,
      goals,
      adminReports,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `live-monitoring-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              {isLiveModeActive ? (
                <Activity className="w-5 h-5 animate-pulse" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">Live AI Monitoring</h2>
              <p className="text-sm opacity-90">
                {isLiveModeActive ? "🔴 ACTIVE" : "⏸️ PAUSED"} •{" "}
                {recentEvents.length} events • {metrics.errorsCount || 0} errors
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleLiveMode}
              className="text-white border-white hover:bg-white hover:text-purple-600"
            >
              {isLiveModeActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white hover:text-purple-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: "overview", label: "Overview", icon: Dashboard },
              { id: "events", label: "Events", icon: Activity },
              { id: "goals", label: "Goals", icon: Target },
              { id: "diagnostics", label: "Diagnostics", icon: Bug },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-green-500" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {metrics.performanceScore || 0}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Performance Score
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                      Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {metrics.errorsCount || 0}
                    </div>
                    <div className="text-xs text-gray-500">Total Errors</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-blue-500" />
                      Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {metrics.goalCompletions || 0}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-purple-500" />
                      Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {recentEvents.length}
                    </div>
                    <div className="text-xs text-gray-500">Recent Events</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {recentEvents.slice(0, 10).map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded border"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={`text-xs ${getSeverityColor(
                              event.severity,
                            )}`}
                          >
                            {event.severity}
                          </Badge>
                          <span className="font-medium">{event.type}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select
                    value={selectedSeverity}
                    onValueChange={setSelectedSeverity}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline">
                    {filteredEvents.length} events
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        autoRefresh ? "animate-spin" : ""
                      }`}
                    />
                    Auto Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {filteredEvents.map((event, index) => (
                      <div
                        key={index}
                        className="border-b last:border-b-0 p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                className={`text-xs ${getSeverityColor(
                                  event.severity,
                                )}`}
                              >
                                {event.severity}
                              </Badge>
                              <span className="font-semibold">
                                {event.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {event.category}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {event.pageUrl}
                            </div>
                            {event.data && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-blue-600">
                                  View Details
                                </summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                                  {JSON.stringify(event.data, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="space-y-6">
              {/* Add New Goal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goalName">Goal Name</Label>
                      <Input
                        id="goalName"
                        value={newGoal.name}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, name: e.target.value })
                        }
                        placeholder="e.g., Button Click Detection"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goalTrigger">Trigger Event</Label>
                      <Input
                        id="goalTrigger"
                        value={newGoal.trigger}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, trigger: e.target.value })
                        }
                        placeholder="e.g., click, navigation, error"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="goalDescription">Description</Label>
                    <Textarea
                      id="goalDescription"
                      value={newGoal.description}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, description: e.target.value })
                      }
                      placeholder="Describe what this goal tracks..."
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Select
                      value={newGoal.priority}
                      onValueChange={(value: any) =>
                        setNewGoal({ ...newGoal, priority: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddGoal}>
                      <Target className="w-4 h-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Goals ({goals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{goal.name}</span>
                            <Badge
                              variant={goal.isActive ? "default" : "secondary"}
                            >
                              {goal.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">{goal.priority}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {goal.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Trigger: {goal.trigger}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveGoal(goal.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Diagnostics Tab */}
          {activeTab === "diagnostics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Diagnostics</h3>
                <Button onClick={handleRunTest}>
                  <Zap className="w-4 h-4 mr-2" />
                  Run Tests
                </Button>
              </div>

              {/* Admin Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Admin Reports ({adminReports.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {adminReports.map((report, index) => (
                      <details
                        key={index}
                        className="border rounded p-2 hover:bg-gray-50"
                      >
                        <summary className="cursor-pointer flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{report.type}</Badge>
                            <span className="font-medium">
                              {report.type.replace(/_/g, " ")}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(report.timestamp).toLocaleString()}
                          </span>
                        </summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(report.data, null, 2)}
                          </pre>
                        </div>
                      </details>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monitor Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Refresh</Label>
                      <p className="text-sm text-gray-600">
                        Automatically refresh data every 2 seconds
                      </p>
                    </div>
                    <Button
                      variant={autoRefresh ? "default" : "outline"}
                      onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                      {autoRefresh ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>User Role</Label>
                      <p className="text-sm text-gray-600">
                        Current role: {userRole}
                      </p>
                    </div>
                    <Badge variant="outline">{userRole}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={exportData} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("adminReports");
                      setAdminReports([]);
                    }}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Admin Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard icon component (missing from imports)
const Dashboard: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export default LiveModeMonitor;
