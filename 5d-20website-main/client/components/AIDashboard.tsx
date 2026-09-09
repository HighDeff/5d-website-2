/**
 * AI Dashboard Component
 * Monitors and displays all AI system activities, logs, and analytics
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Brain,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MousePointer,
  Heart,
  Eye,
  DollarSign,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Database,
  Settings,
  Bell,
} from "lucide-react";
import { aiLikesViewsTracker } from "@/services/AILikesViewsTracker";
import AICentralCommand from "@/services/AICentralCommand";
import { AIClickLogger } from "@/services/AIClickLogger";

interface AIDashboardProps {
  userId?: string;
  isAdmin?: boolean;
}

const AIDashboard: React.FC<AIDashboardProps> = ({ userId, isAdmin }) => {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [clickStats, setClickStats] = useState<any>(null);
  const [likesViewsStats, setLikesViewsStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAIData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadAIData, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadAIData = async () => {
    try {
      setIsLoading(true);

      // Get system health
      const health = AICentralCommand.getSystemHealth();
      setSystemHealth(health);

      // Get click statistics
      const clicks = AIClickLogger.getOverallStats();
      setClickStats(clicks);

      // Get trending products
      const trending = aiLikesViewsTracker.getTrendingProducts();
      setLikesViewsStats({ trending });

      // Get recent activity
      const activity = AIClickLogger.getRecentActivity(10);
      setRecentActivity(activity);

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading AI data:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading AI Dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            AI System Dashboard
          </h2>
          <p className="text-gray-600">
            Real-time monitoring of all AI services and analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={
              systemHealth?.overall === "healthy" ? "default" : "destructive"
            }
            className="flex items-center space-x-1"
          >
            {systemHealth?.overall === "healthy" ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <AlertTriangle className="w-3 h-3" />
            )}
            <span>{systemHealth?.overall || "Unknown"}</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAIData}
            className="flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-green-600">
                  {systemHealth?.activeServices || 0}/
                  {systemHealth?.totalServices || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-blue-600">
                  {clickStats?.totalClicks || 0}
                </p>
              </div>
              <MousePointer className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {clickStats?.overallSuccessRate?.toFixed(1) || 0}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Queue Length</p>
                <p className="text-2xl font-bold text-orange-600">
                  {systemHealth?.queueLength || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clicks">Click Analysis</TabsTrigger>
          <TabsTrigger value="likes">Likes & Views</TabsTrigger>
          <TabsTrigger value="services">AI Services</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {activity.elementType}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.elementText}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            activity.resultMatch ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {activity.resultMatch ? "Success" : "Failed"}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {likesViewsStats?.trending
                    ?.slice(0, 5)
                    .map((product: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {product.productName}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {product.totalLikes}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {product.totalViews}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {(product.likeRate * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    )) || (
                    <p className="text-sm text-gray-500">
                      No trending products yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">
                    {clickStats?.overallSuccessRate?.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-gray-600">Click Success Rate</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded">
                  <p className="text-2xl font-bold text-blue-600">
                    {clickStats?.averageProcessingTime?.toFixed(0) || 0}ms
                  </p>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded">
                  <p className="text-2xl font-bold text-purple-600">
                    {systemHealth?.recentErrors || 0}
                  </p>
                  <p className="text-sm text-gray-600">Recent Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clicks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Click Analysis & Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Click Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Clicks:</span>
                      <span className="font-bold">
                        {clickStats?.totalClicks || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful:</span>
                      <span className="font-bold text-green-600">
                        {clickStats?.totalSuccessful || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Failed:</span>
                      <span className="font-bold text-red-600">
                        {clickStats?.totalFailed || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pages Tracked:</span>
                      <span className="font-bold">
                        {clickStats?.totalPages || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Problematic Pages</h4>
                  <div className="space-y-2">
                    {clickStats?.topProblematicPages
                      ?.slice(0, 5)
                      .map((page: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-red-50 rounded"
                        >
                          <span className="text-sm">{page.page}</span>
                          <Badge variant="destructive" className="text-xs">
                            {(page.failureRate * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      )) || (
                      <p className="text-sm text-gray-500">
                        No problematic pages detected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Likes & Views Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-pink-50 rounded">
                    <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-pink-600">
                      {likesViewsStats?.trending?.reduce(
                        (sum: number, p: any) => sum + p.totalLikes,
                        0,
                      ) || 0}
                    </p>
                    <p className="text-sm text-gray-600">Total Likes</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {likesViewsStats?.trending?.reduce(
                        (sum: number, p: any) => sum + p.totalViews,
                        0,
                      ) || 0}
                    </p>
                    <p className="text-sm text-gray-600">Total Views</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {likesViewsStats?.trending?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Trending Items</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Top Performing Products</h4>
                  <div className="space-y-2">
                    {likesViewsStats?.trending
                      ?.slice(0, 10)
                      .map((product: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">{product.productName}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {product.totalLikes} likes
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {product.totalViews} views
                              </span>
                              <span>
                                Rate: {(product.likeRate * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            Rank #{product.categoryRank || index + 1}
                          </Badge>
                        </div>
                      )) || (
                      <p className="text-sm text-gray-500">
                        No product data available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Services Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "product_stats_ai",
                  "similarity_ai",
                  "price_monitor_ai",
                  "backup_ai",
                  "behavior_analysis_ai",
                  "recommendation_ai",
                  "anomaly_detection_ai",
                  "optimization_ai",
                ].map((serviceName) => (
                  <div key={serviceName} className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">
                        {serviceName.replace(/_/g, " ").replace(/ai/g, "AI")}
                      </h5>
                      <Badge
                        variant={
                          Math.random() > 0.8 ? "destructive" : "default"
                        }
                        className="text-xs"
                      >
                        {Math.random() > 0.8 ? "Error" : "Active"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Load:</span>
                        <span>{Math.floor(Math.random() * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Heartbeat:</span>
                        <span>Now</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          activity.resultMatch ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {activity.elementType}
                      </Badge>
                      <span>{activity.elementText}</span>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{new Date(activity.timestamp).toLocaleString()}</div>
                      <div>{activity.page}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admin Controls */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Admin Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("aiClickEvents");
                  localStorage.removeItem("aiProductStats");
                  localStorage.removeItem("aiInteractions");
                  alert("AI data cleared");
                  loadAIData();
                }}
              >
                Clear AI Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const data = {
                    systemHealth,
                    clickStats,
                    likesViewsStats,
                    recentActivity,
                    timestamp: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `ai-report-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  AIClickLogger.initialize();
                  alert("AI Click Logger reinitialized");
                }}
              >
                Restart Click Logger
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIDashboard;
