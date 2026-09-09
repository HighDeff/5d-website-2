import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Download,
  Eye,
  MousePointer,
  Navigation,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import AINavigationWatcher, {
  NavigationEvent,
  NavigationPattern,
  SystemHealth,
} from "../../services/AINavigationWatcher";

const NavigationAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<SystemHealth | null>(null);
  const [recentEvents, setRecentEvents] = useState<NavigationEvent[]>([]);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    updateData();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      if (autoRefresh) {
        updateData();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const updateData = async () => {
    setLoading(true);
    try {
      setAnalytics(AINavigationWatcher.getAnalytics());
      setRecentEvents(AINavigationWatcher.getRecentEvents(100));
      setSessionSummary(AINavigationWatcher.getSessionSummary());
    } catch (error) {
      console.error("Failed to load navigation analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFullReport = () => {
    const report = AINavigationWatcher.generateReport();
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `navigation-analytics-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportEventsCSV = () => {
    if (!recentEvents.length) return;

    const headers = [
      "Timestamp",
      "Type",
      "Path",
      "Element",
      "Text",
      "Duration",
      "User Agent",
    ];
    const csvContent = [
      headers.join(","),
      ...recentEvents.map((event) =>
        [
          event.timestamp,
          event.type,
          event.path,
          event.element || "",
          `"${(event.text || "").replace(/"/g, '""')}"`,
          event.duration || "",
          `"${event.userAgent}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `navigation-events-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEventsByHour = () => {
    const hourCounts: Record<string, number> = {};
    recentEvents.forEach((event) => {
      const hour = new Date(event.timestamp).getHours();
      const hourKey = `${hour.toString().padStart(2, "0")}:00`;
      hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
    });
    return Object.entries(hourCounts).sort();
  };

  const getTopUserFlows = () => {
    const flows: Record<string, number> = {};
    for (let i = 1; i < recentEvents.length; i++) {
      const prev = recentEvents[i - 1];
      const curr = recentEvents[i];
      if (prev.type === "navigation" && curr.type === "navigation") {
        const flow = `${prev.path} → ${curr.path}`;
        flows[flow] = (flows[flow] || 0) + 1;
      }
    }
    return Object.entries(flows)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading navigation analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/ai-management">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to AI Management
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Eye className="h-8 w-8 text-purple-600" />
                Navigation Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive user navigation and behavior analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={autoRefresh ? "default" : "secondary"}>
              <div
                className={`w-2 h-2 rounded-full mr-2 ${autoRefresh ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              />
              {autoRefresh ? "Auto-refresh" : "Manual"}
            </Badge>
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant="outline"
              size="sm"
            >
              {autoRefresh ? "Pause" : "Resume"}
            </Button>
            <Button onClick={updateData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={downloadFullReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Report
            </Button>
          </div>
        </div>

        {analytics && sessionSummary ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Event Stream</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="flows">User Flows</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Events
                        </p>
                        <p className="text-3xl font-bold">
                          {analytics.totalEvents}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Session: {Math.round(sessionSummary.duration / 1000)}s
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Error Rate
                        </p>
                        <p className="text-3xl font-bold text-red-600">
                          {analytics.errorRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {analytics.commonErrors.reduce(
                            (sum, e) => sum + e.count,
                            0,
                          )}{" "}
                          total errors
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Avg Load Time
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {analytics.averageLoadTime}ms
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Performance metric
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Bounce Rate
                        </p>
                        <p className="text-3xl font-bold text-orange-600">
                          {analytics.bounceRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Navigation efficiency:{" "}
                          {analytics.navigationEfficiency}%
                        </p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Pages and Errors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Popular Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.popularPaths
                        .slice(0, 10)
                        .map((page, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium truncate flex-1 mr-3">
                              {page.path || "/"}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${(page.visits / analytics.popularPaths[0].visits) * 100}%`,
                                  }}
                                />
                              </div>
                              <Badge
                                variant="secondary"
                                className="min-w-[3rem]"
                              >
                                {page.visits}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Error Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.commonErrors.length > 0 ? (
                      <div className="space-y-3">
                        {analytics.commonErrors.map((error, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium truncate flex-1 mr-3">
                                {error.error}
                              </span>
                              <Badge variant="destructive">
                                {error.count}x
                              </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-red-600 h-1 rounded-full"
                                style={{
                                  width: `${(error.count / analytics.commonErrors[0].count) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-green-600 mb-2">
                          <Activity className="h-8 w-8 mx-auto" />
                        </div>
                        <p className="text-sm text-gray-500">
                          No errors detected
                        </p>
                        <p className="text-xs text-gray-400">
                          System running smoothly!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Activity Timeline (Last 24 Hours)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-12 gap-2">
                    {getEventsByHour().map(([hour, count]) => (
                      <div key={hour} className="text-center">
                        <div
                          className="bg-blue-500 rounded-sm mx-auto mb-1"
                          style={{
                            height: `${Math.max(4, (count / Math.max(...getEventsByHour().map(([, c]) => c))) * 40)}px`,
                            width: "12px",
                          }}
                          title={`${hour}: ${count} events`}
                        />
                        <span className="text-xs text-gray-500">{hour}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Event Stream Tab */}
            <TabsContent value="events" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Event Stream</h3>
                <Button onClick={exportEventsCSV} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">
                            Time
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Type
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Path
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Element
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEvents
                          .slice()
                          .reverse()
                          .slice(0, 100)
                          .map((event, index) => (
                            <tr
                              key={event.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3 text-xs text-gray-500">
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant={
                                    event.type === "error"
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {event.type}
                                </Badge>
                              </td>
                              <td className="p-3 text-sm font-mono">
                                {event.path}
                              </td>
                              <td className="p-3 text-sm">
                                {event.element || "-"}
                              </td>
                              <td className="p-3 text-sm truncate max-w-xs">
                                {event.text || "-"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
                  {analytics.userFlowIssues.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.userFlowIssues.map((pattern) => (
                        <Alert key={pattern.id}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">
                                  {pattern.category.toUpperCase()}
                                </Badge>
                                <Badge variant="secondary">
                                  Frequency: {pattern.frequency}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Last seen:{" "}
                                  {new Date(
                                    pattern.lastOccurred,
                                  ).toLocaleString()}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm mb-1">
                                  Pattern:
                                </h4>
                                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                                  {pattern.pattern}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm mb-1">
                                  Description:
                                </h4>
                                <p className="text-sm">{pattern.description}</p>
                              </div>

                              {pattern.suggestions.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">
                                    Recommendations:
                                  </h4>
                                  <ul className="space-y-1">
                                    {pattern.suggestions.map(
                                      (suggestion, idx) => (
                                        <li
                                          key={idx}
                                          className="text-sm flex items-start gap-2"
                                        >
                                          <span className="text-blue-600">
                                            •
                                          </span>
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
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No patterns detected yet</p>
                      <p className="text-sm text-gray-400">
                        Continue navigating to generate pattern insights
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Flows Tab */}
            <TabsContent value="flows" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Top User Flows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopUserFlows().map(([flow, count], index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="text-sm font-mono flex-1">{flow}</span>
                        <Badge variant="secondary">{count} times</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Load Time</span>
                      <Badge variant="secondary">
                        {analytics.averageLoadTime}ms
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Navigation Efficiency</span>
                      <Badge variant="secondary">
                        {analytics.navigationEfficiency}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Error Rate</span>
                      <Badge
                        variant={
                          analytics.errorRate > 5 ? "destructive" : "secondary"
                        }
                      >
                        {analytics.errorRate.toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bounce Rate</span>
                      <Badge
                        variant={
                          analytics.bounceRate > 50
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {analytics.bounceRate.toFixed(2)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Session Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Session Duration</span>
                      <Badge variant="outline">
                        {Math.floor(sessionSummary.duration / 60000)}m{" "}
                        {Math.floor((sessionSummary.duration % 60000) / 1000)}s
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pages Visited</span>
                      <Badge variant="outline">
                        {sessionSummary.uniquePages}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Events</span>
                      <Badge variant="outline">
                        {sessionSummary.totalEvents}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Session ID</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {sessionSummary.sessionId.slice(-12)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No navigation data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationAnalytics;
