import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Activity,
  Eye,
  Settings,
  BarChart3,
  Zap,
  Brain,
  Target,
  Layers,
  Code,
  Sparkles,
  Users
} from "lucide-react";
import EnhancedCanvasMinimizer from "@/components/EnhancedCanvasMinimizer";
import AIAssistantCommands from "@/components/AIAssistantCommands";
import CustomFeatureCreator from "@/components/CustomFeatureCreator";
import { EnhancedTaskDashboard } from "@/components/EnhancedTaskDashboard";
import { ReverseThinkingControls } from "@/components/ReverseThinkingControls";
import ComprehensiveAIControlCenter from "@/components/ComprehensiveAIControlCenter";
import EnhancedAICanvasViewer from "@/components/EnhancedAICanvasViewer";
import AIStatusDisplay from "@/components/AIStatusDisplay";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdvancedCanvasSettings from "@/components/AdvancedCanvasSettings";
import InteractiveCanvasPlayground from "@/components/InteractiveCanvasPlayground";
import CanvasMetricsDashboard from "@/components/CanvasMetricsDashboard";
import AICanvasCollaborationHub from "@/components/AICanvasCollaborationHub";
import AIAPIConfigurationSettings from "@/components/AIAPIConfigurationSettings";

const CanvasControlCenter = () => {
  const [activeCanvas, setActiveCanvas] = useState("main");
  const [isMonitoring, setIsMonitoring] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Palette className="h-10 w-10 text-blue-400" />
            Canvas Control Center
          </h1>
          <p className="text-slate-300">Monitor and control all AI canvas operations</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-13 bg-slate-800 text-xs">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="canvas-viewer" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              <span className="hidden sm:inline">Viewer</span>
            </TabsTrigger>
            <TabsTrigger value="playground" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Playground</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Collab</span>
            </TabsTrigger>
            <TabsTrigger value="minimizer" className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              <span className="hidden sm:inline">Minimizer</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="anomaly-detection" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span className="hidden sm:inline">Anomaly</span>
            </TabsTrigger>
            <TabsTrigger value="movement-tracking" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span className="hidden sm:inline">Movement</span>
            </TabsTrigger>
            <TabsTrigger value="commands" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              <span className="hidden sm:inline">Commands</span>
            </TabsTrigger>
            <TabsTrigger value="creator" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Creator</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="control-center" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">Control</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Status Display */}
              <div className="lg:col-span-1">
                <AIStatusDisplay showDetails={false} />
              </div>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Zap className="h-5 w-5" />
                    Canvas Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                      Active
                    </Badge>
                    <p className="text-sm text-slate-300">Enhanced canvas running</p>
                    <p className="text-sm text-slate-300">Real-time monitoring active</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Layers className="h-5 w-5" />
                    Movement Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-purple-900 text-purple-300 border-purple-600">
                      Tracking
                    </Badge>
                    <p className="text-sm text-slate-300">Entity patterns detected</p>
                    <p className="text-sm text-slate-300">Auto-fix enabled</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Canvas Interaction Tools</CardTitle>
                <CardDescription>Direct canvas manipulation and testing tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                    onClick={() => setIsMonitoring(!isMonitoring)}
                  >
                    {isMonitoring ? "Stop" : "Start"} Monitoring
                  </Button>
                  <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                    Clear Canvas
                  </Button>
                  <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                    Reset Entities
                  </Button>
                  <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="canvas-viewer" className="space-y-6">
            <ErrorBoundary>
              <EnhancedAICanvasViewer />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="playground" className="space-y-6">
            <ErrorBoundary>
              <InteractiveCanvasPlayground />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <ErrorBoundary>
              <CanvasMetricsDashboard />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <ErrorBoundary>
              <AICanvasCollaborationHub />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="anomaly-detection" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-400" />
                  Advanced Anomaly Detection System
                </CardTitle>
                <CardDescription>AI-powered detection of unusual patterns and behaviors with real-time monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4 items-center">
                    <Button
                      onClick={() => setIsMonitoring(!isMonitoring)}
                      className={`flex items-center gap-2 ${isMonitoring ? 'bg-green-600' : 'bg-red-600'}`}
                    >
                      <Activity className="h-4 w-4" />
                      {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Configure Thresholds
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Manual Scan
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-400" />
                        Critical Anomalies
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 bg-red-900/30 rounded">
                          <span>Spiral collapse detected</span>
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-900/30 rounded">
                          <span>Entity boundary breach</span>
                          <Badge variant="outline" className="text-xs bg-orange-900 text-orange-300 border-orange-600">High</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-900/30 rounded">
                          <span>Velocity spike anomaly</span>
                          <Badge variant="outline" className="text-xs bg-yellow-900 text-yellow-300 border-yellow-600">Medium</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-900/30 rounded">
                          <span>Pattern deviation</span>
                          <Badge variant="outline" className="text-xs bg-blue-900 text-blue-300 border-blue-600">Low</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-blue-400" />
                        Detection Configuration
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span>Sensitivity Level</span>
                          <Badge className="bg-blue-600">High (85%)</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Spiral Prevention</span>
                          <Badge className="bg-green-600">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Auto-fix Mode</span>
                          <Badge className="bg-green-600">Enabled</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Learning Mode</span>
                          <Badge className="bg-purple-600">Adaptive</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Scan Frequency</span>
                          <span className="text-blue-400">Real-time</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-green-400" />
                        Detection Statistics
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Total Scans Today</span>
                          <span className="font-mono text-green-400">8,432</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Anomalies Found</span>
                          <span className="font-mono text-red-400">23</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto-fixes Applied</span>
                          <span className="font-mono text-blue-400">19</span>
                        </div>
                        <div className="flex justify-between">
                          <span>False Positives</span>
                          <span className="font-mono text-yellow-400">2</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Detection Accuracy</span>
                          <span className="font-mono text-green-400">94.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-900 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-lg">Pattern Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Linear Patterns</span>
                            <div className="w-24 bg-slate-700 rounded-full h-2">
                              <div className="bg-green-400 h-2 rounded-full" style={{width: '78%'}}></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Circular Patterns</span>
                            <div className="w-24 bg-slate-700 rounded-full h-2">
                              <div className="bg-blue-400 h-2 rounded-full" style={{width: '45%'}}></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Spiral Patterns</span>
                            <div className="w-24 bg-slate-700 rounded-full h-2">
                              <div className="bg-red-400 h-2 rounded-full" style={{width: '12%'}}></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Random Movement</span>
                            <div className="w-24 bg-slate-700 rounded-full h-2">
                              <div className="bg-purple-400 h-2 rounded-full" style={{width: '23%'}}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-lg">Threat Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 border border-green-600 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-green-400">System Stability</span>
                              <span className="text-xs text-green-400">96.8%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className="bg-green-400 h-2 rounded-full" style={{width: '96.8%'}}></div>
                            </div>
                          </div>
                          <div className="p-3 border border-blue-600 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-blue-400">Prediction Confidence</span>
                              <span className="text-xs text-blue-400">89.2%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className="bg-blue-400 h-2 rounded-full" style={{width: '89.2%'}}></div>
                            </div>
                          </div>
                          <div className="p-3 border border-yellow-600 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-yellow-400">Risk Level</span>
                              <span className="text-xs text-yellow-400">Low</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className="bg-yellow-400 h-2 rounded-full" style={{width: '15%'}}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movement-tracking" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Movement Tracking Analysis</CardTitle>
                <CardDescription>Track and analyze movement patterns in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold mb-4">Movement Patterns</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Linear Movement</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Circular Movement</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Random Movement</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-400 h-2 rounded-full" style={{width: '10%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <h4 className="font-semibold mb-4">Real-time Data</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Active Entities:</span>
                        <span className="text-blue-400">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Movement Speed:</span>
                        <span className="text-green-400">Normal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pattern Complexity:</span>
                        <span className="text-yellow-400">Medium</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Anomaly Score:</span>
                        <span className="text-red-400">0.23</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>



            <TabsContent value="minimizer" className="space-y-6">
            <EnhancedCanvasMinimizer />
          </TabsContent>

          <TabsContent value="commands" className="space-y-6">
            <AIAssistantCommands />
          </TabsContent>

          <TabsContent value="creator" className="space-y-6">
            <CustomFeatureCreator />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Enhanced Task Dashboard
                </CardTitle>
                <CardDescription>Advanced task management and reverse thinking controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <EnhancedTaskDashboard />
                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Reverse Thinking Controls</h3>
                    <ReverseThinkingControls />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="control-center" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Comprehensive AI Control Center
                </CardTitle>
                <CardDescription>
                  Full system control • Collections fix • 5D consciousness • Map visualization • Concurrency modulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[80vh] overflow-y-auto">
                  <ComprehensiveAIControlCenter />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Tabs defaultValue="canvas" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="canvas">Canvas Settings</TabsTrigger>
                <TabsTrigger value="api">AI API Configuration</TabsTrigger>
              </TabsList>

              <TabsContent value="canvas">
                <ErrorBoundary>
                  <AdvancedCanvasSettings />
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="api">
                <ErrorBoundary>
                  <AIAPIConfigurationSettings />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CanvasControlCenter;
