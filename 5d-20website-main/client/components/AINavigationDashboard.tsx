import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Eye,
  MousePointer,
  Navigation,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  ArrowLeft,
  Download,
  Settings,
} from "lucide-react";
import AINavigationWatcher, {
  NavigationEvent,
  NavigationPattern,
  SystemHealth,
} from "../services/AINavigationWatcher";

interface AINavigationDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AINavigationDashboard: React.FC<AINavigationDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  const [analytics, setAnalytics] = useState<SystemHealth | null>(null);
  const [recentEvents, setRecentEvents] = useState<NavigationEvent[]>([]);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (isOpen) {
      updateData();

      // Auto-refresh every 5 seconds when live
      const interval = setInterval(() => {
        if (isLive) {
          updateData();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOpen, isLive]);

  const updateData = () => {
    setAnalytics(AINavigationWatcher.getAnalytics());
    setRecentEvents(AINavigationWatcher.getRecentEvents(50));
    setSessionSummary(AINavigationWatcher.getSessionSummary());
    setLastUpdate(new Date());
  };

  const downloadReport = () => {
    const report = AINavigationWatcher.generateReport();
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `navigation-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "page_load":
        return <Zap className="h-4 w-4" />;
      case "navigation":
        return <Navigation className="h-4 w-4" />;
      case "click":
        return <MousePointer className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      case "back_button":
        return <ArrowLeft className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-600";
      case "page_load":
        return "text-green-600";
      case "navigation":
        return "text-blue-600";
      case "back_button":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getPatternSeverity = (category: string) => {
    switch (category) {
      case "error":
        return "destructive";
      case "loop":
        return "destructive";
      case "bounce":
        return "default";
      case "abandonment":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6 text-purple-600" />
              AI Navigation Watcher
            </h2>
            <p className="text-gray-600 text-sm">
              Real-time user navigation and behavior analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isLive ? "default" : "secondary"}>
              <div
                className={`w-2 h-2 rounded-full mr-2 ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              />
              {isLive ? "Live" : "Paused"}
            </Badge>
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button
              onClick={() => setIsLive(!isLive)}
              variant="outline"
              size="sm"
            >
              {isLive ? "Pause" : "Resume"}
            </Button>
            <Button onClick={updateData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={downloadReport} variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm">
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {analytics && sessionSummary ? (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="events">Live Events</TabsTrigger>
                <TabsTrigger value="patterns">Patterns</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Events</p>
                          <p className="text-2xl font-bold">
                            {analytics.totalEvents}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Error Rate</p>
                          <p className="text-2xl font-bold text-red-600">
                            {analytics.errorRate.toFixed(1)}%
                          </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Load Time</p>
                          <p className="text-2xl font-bold text-green-600">
                            {analytics.averageLoadTime}ms
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Bounce Rate</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {analytics.bounceRate.toFixed(1)}%
                          </p>
                        </div>
                        <TrendingDown className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Session Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Current Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-lg font-semibold">
                          {Math.round(sessionSummary.duration / 1000)}s
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pages Visited</p>
                        <p className="text-lg font-semibold">
                          {sessionSummary.uniquePages}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Events</p>
                        <p className="text-lg font-semibold">
                          {sessionSummary.totalEvents}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Errors</p>
                        <p className="text-lg font-semibold text-red-600">
                          {sessionSummary.errors}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Pages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Popular Pages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analytics.popularPaths
                          .slice(0, 8)
                          .map((page, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium truncate flex-1">
                                {page.path || "/"}
                              </span>
                              <Badge variant="secondary">
                                {page.visits} visits
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Common Errors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analytics.commonErrors.length > 0 ? (
                          analytics.commonErrors.map((error, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium truncate flex-1">
                                {error.error}
                              </span>
                              <Badge variant="destructive">
                                {error.count}x
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No errors detected
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Live Events Tab */}
              <TabsContent value="events" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Live Event Stream
                      <Badge variant={isLive ? "default" : "secondary"}>
                        {isLive ? "Live" : "Paused"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {recentEvents
                        .slice()
                        .reverse()
                        .map((event, index) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className={`${getEventColor(event.type)}`}>
                              {getEventIcon(event.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {event.type.toUpperCase()}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {event.path}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    event.timestamp,
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              {event.text && (
                                <p className="text-sm text-gray-600 truncate">
                                  {event.text}
                                </p>
                              )}
                            </div>
                            {event.duration && (
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(event.duration)}ms
                              </Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Patterns Tab */}
              <TabsContent value="patterns" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Detected Navigation Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.userFlowIssues.length > 0 ? (
                        analytics.userFlowIssues.map((pattern, index) => (
                          <Alert
                            key={pattern.id}
                            variant={
                              getPatternSeverity(pattern.category) as any
                            }
                          >
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {pattern.category.toUpperCase()}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {pattern.frequency}x
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {pattern.pattern}
                                  </span>
                                </div>
                                <p className="text-sm">{pattern.description}</p>
                                {pattern.suggestions.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium mb-1">
                                      Suggestions:
                                    </p>
                                    <ul className="text-xs space-y-1">
                                      {pattern.suggestions.map(
                                        (suggestion, idx) => (
                                          <li
                                            key={idx}
                                            className="flex items-start gap-1"
                                          >
                                            <span>•</span>
                                            <span>{suggestion}</span>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">
                          No patterns detected yet. Keep navigating to generate
                          insights.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Load Time</span>
                          <Badge variant="secondary">
                            {analytics.averageLoadTime}ms
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Navigation Efficiency</span>
                          <Badge variant="secondary">
                            {analytics.navigationEfficiency}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Error Rate</span>
                          <Badge
                            variant={
                              analytics.errorRate > 5
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {analytics.errorRate.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Tracking Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Session ID</span>
                          <Badge
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {sessionSummary.sessionId.slice(-8)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Events Tracked</span>
                          <Badge variant="secondary">
                            {analytics.totalEvents}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Patterns Detected</span>
                          <Badge variant="secondary">
                            {analytics.userFlowIssues.length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading navigation data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AINavigationDashboard;
