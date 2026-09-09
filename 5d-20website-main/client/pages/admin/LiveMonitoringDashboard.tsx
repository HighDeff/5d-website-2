// Admin Live Monitoring Dashboard
// Comprehensive admin interface for AI monitoring, analytics, and system control

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
  AlertCircle,
  BarChart3,
  Bot,
  Brain,
  Bug,
  CheckCircle,
  Clock,
  Database,
  Download,
  Eye,
  Filter,
  Goal,
  Heart,
  LineChart,
  Monitor,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
  ArrowLeft,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import LiveAIMonitoringService from "../../services/LiveAIMonitoringService";
import { useUserAuth } from "../../hooks/useUserAuth";

const LiveMonitoringDashboard: React.FC = () => {
  const { user } = useUserAuth();
  const [isLiveModeActive, setIsLiveModeActive] = useState(false);
  const [metrics, setMetrics] = useState<any>({});
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [adminReports, setAdminReports] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [analytics, setAnalytics] = useState<any>({});
  const [systemHealth, setSystemHealth] = useState<any>({});

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = () => {
    // Load live monitoring data
    setIsLiveModeActive(LiveAIMonitoringService.isActive());
    setMetrics(LiveAIMonitoringService.getMetrics());
    setRecentEvents(LiveAIMonitoringService.getRecentEvents(50));
    setGoals(LiveAIMonitoringService.getGoals());

    // Load admin reports
    try {
      const reports = JSON.parse(localStorage.getItem("adminReports") || "[]");
      setAdminReports(reports);
    } catch {
      setAdminReports([]);
    }

    // Generate analytics
    generateAnalytics();
    checkSystemHealth();
  };

  const generateAnalytics = () => {
    const events = LiveAIMonitoringService.getRecentEvents(100);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Event counts by type
    const eventCounts = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as any);

    // Events by severity
    const severityCounts = events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as any);

    // Recent activity (last hour)
    const recentActivity = events.filter(
      (event) => now - event.timestamp < oneHour,
    );

    // Error rate trend
    const errorEvents = events.filter((event) =>
      ["critical", "high"].includes(event.severity),
    );

    setAnalytics({
      totalEvents: events.length,
      eventTypes: eventCounts,
      severityDistribution: severityCounts,
      recentActivity: recentActivity.length,
      errorRate: (errorEvents.length / events.length) * 100 || 0,
      topEvents: Object.entries(eventCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5),
    });
  };

  const checkSystemHealth = () => {
    const metrics = LiveAIMonitoringService.getMetrics();
    const events = LiveAIMonitoringService.getRecentEvents(20);

    // Calculate health scores
    const errorScore = Math.max(0, 100 - (metrics.errorsCount || 0) * 10);
    const performanceScore = metrics.performanceScore || 100;
    const activityScore = isLiveModeActive ? 100 : 0;

    // Check for critical issues
    const criticalEvents = events.filter(
      (event) => event.severity === "critical",
    );
    const hasIssues = criticalEvents.length > 0;

    setSystemHealth({
      overall: Math.round((errorScore + performanceScore + activityScore) / 3),
      errorScore,
      performanceScore,
      activityScore,
      hasIssues,
      criticalEvents: criticalEvents.length,
      lastCheck: new Date().toISOString(),
    });
  };

  const handleToggleLiveMode = async () => {
    try {
      if (isLiveModeActive) {
        await LiveAIMonitoringService.stopLiveMode();
      } else {
        await LiveAIMonitoringService.startLiveMode();
      }
      loadDashboardData();
    } catch (error) {
      console.error("Error toggling live mode:", error);
    }
  };

  const handleRunSystemTest = async () => {
    try {
      const testResults =
        await LiveAIMonitoringService.runAutomatedTest("admin_test");
      console.log("System test results:", testResults);
      loadDashboardData();
    } catch (error) {
      console.error("Error running system test:", error);
    }
  };

  const exportAllData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics,
      events: recentEvents,
      goals,
      adminReports,
      analytics,
      systemHealth,
      user: user?.name || "Anonymous",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `live-monitoring-admin-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEvents = recentEvents.filter((event) => {
    if (selectedEventType === "all") return true;
    return (
      event.type === selectedEventType || event.category === selectedEventType
    );
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin/monitoring">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Monitoring
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bot className="w-6 h-6 mr-2 text-purple-600" />
                  Live AI Monitoring Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Real-time system monitoring, analytics, and AI insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                className={
                  isLiveModeActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {isLiveModeActive ? "🔴 LIVE" : "⏸️ PAUSED"}
              </Badge>
              <Button onClick={handleToggleLiveMode}>
                {isLiveModeActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Monitoring
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Monitoring
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* System Health Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${getHealthColor(systemHealth.overall)}`}
              >
                {systemHealth.overall || 0}%
              </div>
              <Badge className={getHealthBadgeColor(systemHealth.overall)}>
                {systemHealth.overall >= 80
                  ? "Excellent"
                  : systemHealth.overall >= 60
                    ? "Good"
                    : "Needs Attention"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-blue-500" />
                Live Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {analytics.recentActivity || 0}
              </div>
              <div className="text-xs text-gray-500">Last hour</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                Error Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {Math.round(analytics.errorRate || 0)}%
              </div>
              <div className="text-xs text-gray-500">
                {metrics.errorsCount || 0} total errors
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target className="w-4 h-4 mr-2 text-green-500" />
                Goals Met
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {metrics.goalCompletions || 0}
              </div>
              <div className="text-xs text-gray-500">
                {goals.length} active goals
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Event Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topEvents?.map(([type, count]: [string, number]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(count / analytics.totalEvents) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Severity Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.severityDistribution || {}).map(
                  ([severity, count]: [string, any]) => (
                    <div
                      key={severity}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            severity === "critical"
                              ? "bg-red-500"
                              : severity === "high"
                                ? "bg-orange-500"
                                : severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                          }`}
                        />
                        <span className="text-sm font-medium capitalize">
                          {severity}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Events and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Events Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Live Events Feed
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedEventType}
                      onValueChange={setSelectedEventType}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="user_action">
                          User Actions
                        </SelectItem>
                        <SelectItem value="error">Errors</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="goal_trigger">
                          Goal Triggers
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadDashboardData}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredEvents.map((event, index) => (
                    <div
                      key={index}
                      className="border-b last:border-b-0 p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              className={`text-xs ${
                                event.severity === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : event.severity === "high"
                                    ? "bg-orange-100 text-orange-800"
                                    : event.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                              }`}
                            >
                              {event.severity}
                            </Badge>
                            <span className="font-medium">{event.type}</span>
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {event.pageUrl}
                          </div>
                          {event.userId && (
                            <div className="text-xs text-blue-600">
                              User: {event.userId}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleRunSystemTest} className="w-full">
                  <Bug className="w-4 h-4 mr-2" />
                  Run System Test
                </Button>
                <Button
                  onClick={exportAllData}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Live Mode:</span>
                  <Badge
                    className={
                      isLiveModeActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {isLiveModeActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance:</span>
                  <span
                    className={`text-sm font-medium ${getHealthColor(systemHealth.performanceScore)}`}
                  >
                    {systemHealth.performanceScore || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Errors:</span>
                  <span className="text-sm font-medium text-red-600">
                    {metrics.errorsCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Update:</span>
                  <span className="text-xs text-gray-500">
                    {systemHealth.lastCheck
                      ? new Date(systemHealth.lastCheck).toLocaleTimeString()
                      : "Never"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Admin Reports Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {adminReports.slice(0, 5).map((report, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(report.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoringDashboard;
