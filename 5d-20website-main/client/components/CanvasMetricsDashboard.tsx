import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Target,
  Clock,
  Gauge,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Download,
  Pause,
  Play
} from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  cpuUsage: number;
  entityCount: number;
  renderCalls: number;
  drawCalls: number;
  textureMemory: number;
  gpuMemory: number;
  networkLatency: number;
}

interface AIMetrics {
  confidence: number;
  processingTime: number;
  taskCompletion: number;
  anomaliesDetected: number;
  fixesApplied: number;
  learningRate: number;
  predictionAccuracy: number;
  responseTime: number;
}

interface CanvasAnalytics {
  totalInteractions: number;
  averageSessionTime: number;
  mostUsedTools: { name: string; usage: number }[];
  performanceHistory: number[];
  errorRate: number;
  userEngagement: number;
  featureUsage: { [key: string]: number };
}

const CanvasMetricsDashboard: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 45,
    cpuUsage: 35,
    entityCount: 127,
    renderCalls: 89,
    drawCalls: 156,
    textureMemory: 78,
    gpuMemory: 42,
    networkLatency: 23
  });

  const [aiMetrics, setAIMetrics] = useState<AIMetrics>({
    confidence: 87,
    processingTime: 45,
    taskCompletion: 94,
    anomaliesDetected: 3,
    fixesApplied: 8,
    learningRate: 76,
    predictionAccuracy: 91,
    responseTime: 120
  });

  const [analytics, setAnalytics] = useState<CanvasAnalytics>({
    totalInteractions: 1247,
    averageSessionTime: 287,
    mostUsedTools: [
      { name: 'Particle Brush', usage: 45 },
      { name: 'Wave Generator', usage: 28 },
      { name: 'Force Field', usage: 18 },
      { name: 'Vortex Creator', usage: 9 }
    ],
    performanceHistory: [58, 61, 59, 62, 60, 58, 61, 63, 59, 60],
    errorRate: 0.12,
    userEngagement: 82,
    featureUsage: {
      'Anomaly Detection': 89,
      'Auto-fix': 76,
      'Real-time Physics': 94,
      'Multi-dimensional': 23,
      'Quantum Mode': 12
    }
  });

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(() => {
        // Simulate real-time metrics updates
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: Math.max(30, prev.fps + (Math.random() - 0.5) * 5),
          frameTime: 1000 / Math.max(30, prev.fps + (Math.random() - 0.5) * 5),
          memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 10)),
          cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 15)),
          entityCount: Math.max(0, prev.entityCount + Math.floor((Math.random() - 0.5) * 20)),
          networkLatency: Math.max(5, prev.networkLatency + (Math.random() - 0.5) * 10)
        }));

        setAIMetrics(prev => ({
          ...prev,
          confidence: Math.max(0, Math.min(100, prev.confidence + (Math.random() - 0.5) * 8)),
          processingTime: Math.max(10, prev.processingTime + (Math.random() - 0.5) * 20),
          taskCompletion: Math.max(0, Math.min(100, prev.taskCompletion + (Math.random() - 0.5) * 5)),
          responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 30)
        }));

        setAnalytics(prev => ({
          ...prev,
          totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 3),
          userEngagement: Math.max(0, Math.min(100, prev.userEngagement + (Math.random() - 0.5) * 5)),
          performanceHistory: [
            ...prev.performanceHistory.slice(1),
            Math.max(30, 60 + (Math.random() - 0.5) * 10)
          ]
        }));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring]);

  const getStatusColor = (value: number, threshold: { good: number; warning: number }) => {
    if (value >= threshold.good) return 'text-green-400';
    if (value >= threshold.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBadge = (value: number, threshold: { good: number; warning: number }) => {
    if (value >= threshold.good) return <Badge className="bg-green-600">Excellent</Badge>;
    if (value >= threshold.warning) return <Badge className="bg-yellow-600">Good</Badge>;
    return <Badge className="bg-red-600">Poor</Badge>;
  };

  const exportMetrics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      performance: performanceMetrics,
      ai: aiMetrics,
      analytics: analytics
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `canvas-metrics-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Canvas Metrics Dashboard
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isMonitoring ? "default" : "outline"}
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="flex items-center gap-2"
              >
                {isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isMonitoring ? 'Pause' : 'Start'}
              </Button>
              <Button size="sm" variant="outline" onClick={exportMetrics} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Real-time performance monitoring and analytics for canvas operations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="ai">AI Metrics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-slate-300">FPS</span>
                  </div>
                  {getStatusBadge(performanceMetrics.fps, { good: 55, warning: 45 })}
                </div>
                <div className={`text-2xl font-bold mt-2 ${getStatusColor(performanceMetrics.fps, { good: 55, warning: 45 })}`}>
                  {performanceMetrics.fps.toFixed(1)}
                </div>
                <Progress value={Math.min(100, (performanceMetrics.fps / 60) * 100)} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-slate-300">Frame Time</span>
                  </div>
                  {getStatusBadge(60 - performanceMetrics.frameTime, { good: 40, warning: 30 })}
                </div>
                <div className="text-2xl font-bold mt-2 text-green-400">
                  {performanceMetrics.frameTime.toFixed(1)}ms
                </div>
                <Progress value={Math.max(0, 100 - performanceMetrics.frameTime * 3)} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-slate-300">Memory</span>
                  </div>
                  {getStatusBadge(100 - performanceMetrics.memoryUsage, { good: 40, warning: 20 })}
                </div>
                <div className="text-2xl font-bold mt-2 text-purple-400">
                  {performanceMetrics.memoryUsage.toFixed(1)}%
                </div>
                <Progress value={performanceMetrics.memoryUsage} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-orange-400" />
                    <span className="text-sm text-slate-300">CPU Usage</span>
                  </div>
                  {getStatusBadge(100 - performanceMetrics.cpuUsage, { good: 40, warning: 20 })}
                </div>
                <div className="text-2xl font-bold mt-2 text-orange-400">
                  {performanceMetrics.cpuUsage.toFixed(1)}%
                </div>
                <Progress value={performanceMetrics.cpuUsage} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Render Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Entities</span>
                  <span className="font-mono text-blue-400">{performanceMetrics.entityCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Render Calls</span>
                  <span className="font-mono text-green-400">{performanceMetrics.renderCalls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Draw Calls</span>
                  <span className="font-mono text-purple-400">{performanceMetrics.drawCalls}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Texture Memory</span>
                  <span className="font-mono text-blue-400">{performanceMetrics.textureMemory} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">GPU Memory</span>
                  <span className="font-mono text-green-400">{performanceMetrics.gpuMemory} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">System RAM</span>
                  <span className="font-mono text-purple-400">{(performanceMetrics.memoryUsage * 8).toFixed(0)} MB</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Latency</span>
                  <span className="font-mono text-yellow-400">{performanceMetrics.networkLatency.toFixed(0)} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Connection</span>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Stable</span>
                  </div>
                </div>
                <Progress value={Math.max(0, 100 - performanceMetrics.networkLatency)} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-slate-300">Confidence</span>
                  </div>
                  {getStatusBadge(aiMetrics.confidence, { good: 80, warning: 60 })}
                </div>
                <div className="text-2xl font-bold mt-2 text-blue-400">
                  {aiMetrics.confidence.toFixed(1)}%
                </div>
                <Progress value={aiMetrics.confidence} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-slate-300">Processing</span>
                  </div>
                  {getStatusBadge(200 - aiMetrics.processingTime, { good: 120, warning: 80 })}
                </div>
                <div className="text-2xl font-bold mt-2 text-yellow-400">
                  {aiMetrics.processingTime.toFixed(0)}ms
                </div>
                <Progress value={Math.max(0, 100 - aiMetrics.processingTime / 2)} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-slate-300">Accuracy</span>
                  </div>
                  {getStatusBadge(aiMetrics.predictionAccuracy, { good: 85, warning: 70 })}
                </div>
                <div className="text-2xl font-bold mt-2 text-green-400">
                  {aiMetrics.predictionAccuracy.toFixed(1)}%
                </div>
                <Progress value={aiMetrics.predictionAccuracy} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-slate-300">Tasks</span>
                  </div>
                  {getStatusBadge(aiMetrics.taskCompletion, { good: 90, warning: 75 })}
                </div>
                <div className="text-2xl font-bold mt-2 text-purple-400">
                  {aiMetrics.taskCompletion.toFixed(1)}%
                </div>
                <Progress value={aiMetrics.taskCompletion} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">AI Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Anomalies Detected</span>
                  <Badge variant="destructive">{aiMetrics.anomaliesDetected}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Auto-fixes Applied</span>
                  <Badge className="bg-green-600">{aiMetrics.fixesApplied}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Learning Rate</span>
                  <span className="font-mono text-blue-400">{aiMetrics.learningRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Response Time</span>
                  <span className="font-mono text-yellow-400">{aiMetrics.responseTime}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Overall Health</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Auto-fix System</span>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Learning Mode</span>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-400">Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Interactions</span>
                  <span className="font-mono text-blue-400">{analytics.totalInteractions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Avg Session Time</span>
                  <span className="font-mono text-green-400">{Math.floor(analytics.averageSessionTime / 60)}m {analytics.averageSessionTime % 60}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Error Rate</span>
                  <span className="font-mono text-red-400">{analytics.errorRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">User Engagement</span>
                  <span className="font-mono text-purple-400">{analytics.userEngagement}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Popular Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.mostUsedTools.map((tool, index) => (
                  <div key={tool.name} className="flex items-center justify-between">
                    <span className="text-slate-300">{tool.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={tool.usage} className="w-16" />
                      <span className="text-xs text-slate-400 w-8">{tool.usage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Feature Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(analytics.featureUsage).map(([feature, usage]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">{feature}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={usage} className="w-16" />
                      <span className="text-xs text-slate-400 w-8">{usage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 gap-1">
                {analytics.performanceHistory.map((value, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${(value / 70) * 100}%`,
                      width: '8%'
                    }}
                    title={`${value.toFixed(1)} FPS`}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-400 text-center">
                Last 10 minutes - Average FPS
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Live Performance Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="text-xs text-green-400 flex justify-between">
                    <span>[{new Date().toLocaleTimeString()}] FPS: {performanceMetrics.fps.toFixed(1)}</span>
                    <TrendingUp className="h-3 w-3" />
                  </div>
                  <div className="text-xs text-blue-400 flex justify-between">
                    <span>[{new Date().toLocaleTimeString()}] Memory: {performanceMetrics.memoryUsage.toFixed(1)}%</span>
                    {performanceMetrics.memoryUsage > 70 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  </div>
                  <div className="text-xs text-purple-400 flex justify-between">
                    <span>[{new Date().toLocaleTimeString()}] Entities: {performanceMetrics.entityCount}</span>
                    <Activity className="h-3 w-3" />
                  </div>
                  <div className="text-xs text-yellow-400 flex justify-between">
                    <span>[{new Date().toLocaleTimeString()}] AI Confidence: {aiMetrics.confidence.toFixed(1)}%</span>
                    <Brain className="h-3 w-3" />
                  </div>
                  <div className="text-xs text-red-400 flex justify-between">
                    <span>[{new Date().toLocaleTimeString()}] Network: {performanceMetrics.networkLatency.toFixed(0)}ms</span>
                    <Wifi className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {performanceMetrics.memoryUsage > 80 && (
                    <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                      High memory usage detected: {performanceMetrics.memoryUsage.toFixed(1)}%
                    </div>
                  )}
                  {performanceMetrics.fps < 45 && (
                    <div className="text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded">
                      Low FPS detected: {performanceMetrics.fps.toFixed(1)}
                    </div>
                  )}
                  {aiMetrics.confidence < 60 && (
                    <div className="text-xs text-orange-400 bg-orange-900/20 p-2 rounded">
                      AI confidence below threshold: {aiMetrics.confidence.toFixed(1)}%
                    </div>
                  )}
                  {aiMetrics.anomaliesDetected > 5 && (
                    <div className="text-xs text-purple-400 bg-purple-900/20 p-2 rounded">
                      Multiple anomalies detected: {aiMetrics.anomaliesDetected}
                    </div>
                  )}
                  <div className="text-xs text-green-400 bg-green-900/20 p-2 rounded">
                    All systems operational
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CanvasMetricsDashboard;
