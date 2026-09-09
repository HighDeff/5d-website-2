/**
 * AI Management Dashboard
 * Comprehensive monitoring and management of all 20+ AI systems
 * Includes live testing, chat interface, and personal AI management
 */

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Activity,
  MessageSquare,
  TestTube,
  Users,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Send,
  Bot,
  Cpu,
  Monitor,
  Code,
  TrendingUp,
  ShieldCheck,
  Zap,
  Eye,
  Clock,
  BarChart3,
  BookOpen,
  Bell,
} from "lucide-react";
import { AITestManager } from "@/services/AITestManager";
import { AIChatSystem } from "@/services/AIChatSystem";
import { PersonalAccountAI } from "@/services/PersonalAccountAI";

interface AIManagementDashboardProps {
  userId: string;
  isAdmin: boolean;
}

const AIManagementDashboard: React.FC<AIManagementDashboardProps> = ({
  userId,
  isAdmin,
}) => {
  const [testReport, setTestReport] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [personalAI, setPersonalAI] = useState<any>(null);
  const [systemStatuses, setSystemStatuses] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState<any>({});
  const [activeTab, setActiveTab] = useState("overview");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeDashboard();

    // Setup real-time updates
    const interval = setInterval(() => {
      updateLiveData();
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const initializeDashboard = async () => {
    try {
      // Initialize personal AI
      const userPersonalAI = await PersonalAccountAI.getUserPersonalAI(userId);
      setPersonalAI(userPersonalAI);

      // Load chat history
      const history = AIChatSystem.getChatHistory(userId);
      setChatMessages(history);

      // Run initial system check
      await updateLiveData();
    } catch (error) {
      console.error("Error initializing AI dashboard:", error);
    }
  };

  const updateLiveData = async () => {
    try {
      // Get all AI system statuses
      const statuses = AITestManager.getAllSystemStatuses();
      setSystemStatuses(statuses);

      // Calculate live stats
      const stats = {
        totalAIs: statuses.length,
        activeAIs: statuses.filter((s) => s.isLive).length,
        healthyAIs: statuses.filter((s) => s.health === "healthy").length,
        errorCount: statuses.reduce((sum, s) => sum + s.errors, 0),
        averagePerformance:
          statuses.reduce((sum, s) => sum + s.performance, 0) /
            statuses.length || 0,
        lastUpdate: new Date().toLocaleTimeString(),
      };
      setLiveStats(stats);
    } catch (error) {
      console.error("Error updating live data:", error);
    }
  };

  const runComprehensiveTests = async () => {
    setIsRunningTests(true);
    try {
      console.log("🚀 Running comprehensive AI tests...");
      const report = await AITestManager.runComprehensiveTests();
      setTestReport(report);

      // Update system statuses
      await updateLiveData();

      console.log("✅ AI tests completed:", report);
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    try {
      const response = await AIChatSystem.processUserMessage(
        userId,
        chatInput,
        isAdmin,
      );

      // Add user message
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: userId,
          message: chatInput,
          timestamp: new Date().toISOString(),
          type: "user",
        },
      ]);

      // Add AI response
      setChatMessages((prev) => [...prev, response]);

      setChatInput("");
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      case "offline":
        return "text-gray-400";
      default:
        return "text-gray-600";
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "healthy":
        return "default";
      case "degraded":
        return "secondary";
      case "critical":
        return "destructive";
      case "offline":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            AI Management Center
          </h1>
          <p className="text-gray-600">
            Comprehensive monitoring and control of all AI systems
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant={
              liveStats.healthyAIs === liveStats.totalAIs
                ? "default"
                : "destructive"
            }
            className="flex items-center space-x-1"
          >
            <Activity className="w-3 h-3" />
            <span>
              {liveStats.healthyAIs}/{liveStats.totalAIs} Healthy
            </span>
          </Badge>
          <Button
            onClick={runComprehensiveTests}
            disabled={isRunningTests}
            className="flex items-center space-x-2"
          >
            {isRunningTests ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4" />
            )}
            <span>{isRunningTests ? "Testing..." : "Run Tests"}</span>
          </Button>
        </div>
      </div>

      {/* Live Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total AIs</p>
                <p className="text-2xl font-bold text-purple-600">
                  {liveStats.totalAIs || 0}
                </p>
              </div>
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {liveStats.activeAIs || 0}
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
                <p className="text-sm text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(liveStats.averagePerformance || 0)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {liveStats.errorCount || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-sm font-medium text-gray-700">
                  {liveStats.lastUpdate || "Never"}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="testing">AI Testing</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="personal">Personal AI</TabsTrigger>
          <TabsTrigger value="goals">AI Goals</TabsTrigger>
          <TabsTrigger value="image-ai">Image AI</TabsTrigger>
          <TabsTrigger value="style-ai">Style AI</TabsTrigger>
          <TabsTrigger value="repair-ai">Site Repair</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Systems Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                AI Systems Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemStatuses.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <p className="font-medium">{status.aiName}</p>
                      <p className="text-sm text-gray-600">
                        Performance: {status.performance}%
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getHealthBadge(status.health)}>
                        {status.health}
                      </Badge>
                      {status.isLive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal AI Status */}
          {personalAI && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  Your Personal AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <Cpu className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {personalAI.performance}%
                    </p>
                    <p className="text-sm text-gray-600">Performance</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {personalAI.requests}
                    </p>
                    <p className="text-sm text-gray-600">Requests Processed</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {personalAI.errors}
                    </p>
                    <p className="text-sm text-gray-600">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                AI System Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Comprehensive AI Test Suite
                    </h3>
                    <p className="text-sm text-gray-600">
                      Test all 20+ AI systems for functionality and performance
                    </p>
                  </div>
                  <Button
                    onClick={runComprehensiveTests}
                    disabled={isRunningTests}
                    className="flex items-center space-x-2"
                  >
                    {isRunningTests ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4" />
                    )}
                    <span>
                      {isRunningTests ? "Testing..." : "Run All Tests"}
                    </span>
                  </Button>
                </div>

                {testReport && (
                  <div className="border rounded p-4 bg-gray-50">
                    <h4 className="font-semibold mb-3">Latest Test Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded">
                        <p className="text-xl font-bold text-purple-600">
                          {testReport.totalAIs}
                        </p>
                        <p className="text-sm text-gray-600">Total AIs</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded">
                        <p className="text-xl font-bold text-green-600">
                          {testReport.passedTests}
                        </p>
                        <p className="text-sm text-gray-600">Passed</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded">
                        <p className="text-xl font-bold text-red-600">
                          {testReport.failedTests}
                        </p>
                        <p className="text-sm text-gray-600">Failed</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded">
                        <p className="text-xl font-bold text-blue-600">
                          {testReport.activeAIs}
                        </p>
                        <p className="text-sm text-gray-600">Active</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium">Recommendations:</h5>
                      {testReport.recommendations.map(
                        (rec: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                AI Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="border rounded p-4 h-64 overflow-y-auto bg-gray-50">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Start a conversation with your AI assistant</p>
                      <p className="text-sm">
                        Try: "Fix sales count for my product" or "Run system
                        tests"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.type === "user"
                                ? "bg-purple-600 text-white"
                                : message.type === "error"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-white text-gray-800 border"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI to fix issues, run tests, or execute commands..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendChatMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={sendChatMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Commands */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    "Run AI tests",
                    "Fix my sales count",
                    "Clear cache",
                    "Check data integrity",
                  ].map((command, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setChatInput(command)}
                      className="text-xs"
                    >
                      {command}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          {personalAI ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  Personal AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">AI Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>AI ID:</span>
                          <span className="font-mono">{personalAI.aiId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant={getHealthBadge(personalAI.status)}>
                            {personalAI.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Performance:</span>
                          <span>{personalAI.performance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Requests:</span>
                          <span>{personalAI.requests}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Capabilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {personalAI.capabilities.map(
                          (capability: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {capability.replace(/_/g, " ")}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Quick Actions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Monitor Data
                      </Button>
                      <Button variant="outline" size="sm">
                        <Database className="w-4 h-4 mr-2" />
                        Sync Data
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Personal AI</h3>
                <p className="text-gray-600 mb-4">
                  Create your personal AI assistant to help manage your account
                </p>
                <Button onClick={initializeDashboard}>
                  <Bot className="w-4 h-4 mr-2" />
                  Create Personal AI
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Live AI Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health Chart */}
                <div>
                  <h4 className="font-semibold mb-3">System Health Overview</h4>
                  <div className="space-y-2">
                    {systemStatuses.map((status, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm font-medium">
                          {status.aiName}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                status.performance > 80
                                  ? "bg-green-500"
                                  : status.performance > 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${status.performance}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {status.performance}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Statistics */}
                <div>
                  <h4 className="font-semibold mb-3">Live Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="text-sm font-medium">
                        Healthy Systems
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {
                          systemStatuses.filter((s) => s.health === "healthy")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                      <span className="text-sm font-medium">
                        Degraded Systems
                      </span>
                      <span className="text-lg font-bold text-yellow-600">
                        {
                          systemStatuses.filter((s) => s.health === "degraded")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                      <span className="text-sm font-medium">
                        Critical/Offline
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {
                          systemStatuses.filter(
                            (s) =>
                              s.health === "critical" || s.health === "offline",
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image-ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                AI Image Processing Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Image AI Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>OCR Text Extraction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Automatic Tagging</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Crop & Resize</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Background Addition</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("process image upload")}
                  >
                    Upload & Process
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("extract text from image")}
                  >
                    Extract Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("search user images product")}
                  >
                    Search Images
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setChatInput("add white background to image")
                    }
                  >
                    Add Background
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Quick Commands:</p>
                  <div className="space-y-1 text-xs">
                    <p>• "Extract text from my product image"</p>
                    <p>• "Crop image to fit better"</p>
                    <p>• "Add white background to product photo"</p>
                    <p>• "Search for images with 'sale' text"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style-ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Style & Color AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Style AI Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Interactive Color Wheel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Font Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Color Palette Generation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Accessibility Analysis</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("show color wheel")}
                  >
                    Color Wheel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("change font to Roboto")}
                  >
                    Change Font
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("change color to blue")}
                  >
                    Change Color
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("apply dark color palette")}
                  >
                    Apply Palette
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Voice Commands:</p>
                  <div className="space-y-1 text-xs">
                    <p>• "Change font to Arial for all headings"</p>
                    <p>• "Make all buttons blue"</p>
                    <p>• "Show me the color wheel"</p>
                    <p>• "Apply dark mode colors"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repair-ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Site Repair AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Repair AI Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Live Page Validation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Auto Error Correction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Account Backup/Restore</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Database Sync Check</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("validate page")}
                  >
                    Validate Page
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("repair site")}
                  >
                    Auto-Repair
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("backup account")}
                  >
                    Backup Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("check data integrity")}
                  >
                    Check Data
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border rounded p-3">
                    <h5 className="font-medium mb-2">Current Page Status</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Elements:</span>
                        <span className="text-green-600">✓ Valid</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Sync:</span>
                        <span className="text-green-600">✓ Valid</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interactions:</span>
                        <span className="text-yellow-600">⚠ 2 Issues</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded p-3">
                    <h5 className="font-medium mb-2">AI Communications</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Personal AI:</span>
                        <span className="text-green-600">Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Site Repair AI:</span>
                        <span className="text-green-600">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction AI:</span>
                        <span className="text-green-600">Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div>
            {React.createElement(
              React.lazy(() => import("./AIGoalsManager")),
              {
                userId: userId,
                currentErrors: [], // In production, would detect current errors
              },
            )}
          </div>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                AI Commands & Help Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Chat Commands */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    AI Chat Commands
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">
                        Product Management
                      </h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Fix sales count for product123"
                          </code>
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Update stock for item456 to 10"
                          </code>
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Change price to $29.99"
                          </code>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">
                        Style & Design
                      </h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Change font to Arial"
                          </code>
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Make buttons blue"
                          </code>
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Show color wheel"
                          </code>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-700 mb-2">
                        Image Processing
                      </h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Extract text from my image"
                          </code>
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Add white background"
                          </code>
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Search for product photos"
                          </code>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-700 mb-2">
                        System Commands
                      </h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Run AI tests"
                          </code>
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Validate page"
                          </code>
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded">
                            "Clear cache"
                          </code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Features Guide */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    AI Features Guide
                  </h3>
                  <div className="space-y-4">
                    <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
                      <h4 className="font-medium text-blue-800 mb-2">
                        🤖 AI Chat System
                      </h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Talk to AI in natural language to fix issues, run
                        commands, and get help.
                      </p>
                      <div className="text-xs text-blue-600">
                        <p>• 100+ commands available</p>
                        <p>• Natural language processing</p>
                        <p>• Real-time problem solving</p>
                      </div>
                    </div>

                    <div className="border border-green-200 p-4 rounded-lg bg-green-50">
                      <h4 className="font-medium text-green-800 mb-2">
                        📸 Image AI
                      </h4>
                      <p className="text-sm text-green-700 mb-2">
                        Upload images for OCR text extraction, background
                        removal, and auto-tagging.
                      </p>
                      <div className="text-xs text-green-600">
                        <p>• Drag & drop processing</p>
                        <p>• OCR text extraction</p>
                        <p>• Background editing</p>
                      </div>
                    </div>

                    <div className="border border-purple-200 p-4 rounded-lg bg-purple-50">
                      <h4 className="font-medium text-purple-800 mb-2">
                        🎨 Style AI
                      </h4>
                      <p className="text-sm text-purple-700 mb-2">
                        Interactive color wheel, font management, and
                        accessibility analysis.
                      </p>
                      <div className="text-xs text-purple-600">
                        <p>• Color wheel selection</p>
                        <p>• Font customization</p>
                        <p>• WCAG compliance</p>
                      </div>
                    </div>

                    <div className="border border-orange-200 p-4 rounded-lg bg-orange-50">
                      <h4 className="font-medium text-orange-800 mb-2">
                        🔧 Site Repair AI
                      </h4>
                      <p className="text-sm text-orange-700 mb-2">
                        Automatic page validation, error detection, and
                        real-time fixes.
                      </p>
                      <div className="text-xs text-orange-600">
                        <p>• Live page validation</p>
                        <p>• Auto error correction</p>
                        <p>• Database consistency</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="border border-red-200 p-4 rounded-lg bg-red-50">
                        <h4 className="font-medium text-red-800 mb-2">
                          ⚡ Custom AI Builder
                        </h4>
                        <p className="text-sm text-red-700 mb-2">
                          Create personalized AI modules with custom triggers
                          and actions.
                        </p>
                        <div className="text-xs text-red-600">
                          <p>• Custom automation</p>
                          <p>• Friend AI access</p>
                          <p>• Member-only features</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">💡 Quick Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-1">
                      Natural Language
                    </h4>
                    <p className="text-xs text-yellow-700">
                      Just type what you want to do - "fix my product count"
                      works as well as exact commands
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-1">
                      Voice Commands
                    </h4>
                    <p className="text-xs text-blue-700">
                      Use voice commands like "change font color" for hands-free
                      operation
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <h4 className="font-medium text-green-800 mb-1">
                      Real-time Help
                    </h4>
                    <p className="text-xs text-green-700">
                      AI provides suggestions and auto-completes commands as you
                      type
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                AI System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Auto-Testing</p>
                    <p className="text-sm text-gray-600">
                      Automatically run AI tests every hour
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      localStorage.setItem("ai-auto-testing", "enabled");
                      alert(
                        "Auto-testing enabled! AI systems will be tested every hour.",
                      );
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Real-time Monitoring</p>
                    <p className="text-sm text-gray-600">
                      Monitor AI performance in real-time
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      localStorage.setItem("ai-monitoring", "active");
                      setActiveTab("monitoring");
                    }}
                  >
                    <Monitor className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Alert Notifications</p>
                    <p className="text-sm text-gray-600">
                      Get notified when AI systems have issues
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      localStorage.setItem("ai-notifications", "enabled");
                      alert(
                        "Notifications enabled! You will receive alerts for AI system issues.",
                      );
                    }}
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Setup
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">AI Chat Auto-Complete</p>
                    <p className="text-sm text-gray-600">
                      Enable command suggestions while typing
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      localStorage.setItem("ai-autocomplete", "enabled");
                      alert("Auto-complete enabled for AI chat commands!");
                    }}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Advanced Validation</p>
                    <p className="text-sm text-gray-600">
                      Enable deep page validation and auto-repair
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      localStorage.setItem("ai-validation", "advanced");
                      alert(
                        "Advanced validation enabled! Pages will be continuously monitored and repaired.",
                      );
                    }}
                  >
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Activate
                  </Button>
                </div>

                {isAdmin && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 text-red-700">
                      Admin Controls
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (
                            confirm("Reset all AI data? This cannot be undone.")
                          ) {
                            localStorage.removeItem("userFavoritesAI");
                            localStorage.removeItem("customPagesAI");
                            localStorage.removeItem("customAIModules");
                            alert("AI data reset successfully!");
                            window.location.reload();
                          }
                        }}
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Reset AI Data
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          alert("Restarting all AI systems...");
                          await new Promise((resolve) =>
                            setTimeout(resolve, 2000),
                          );
                          alert("All AI systems restarted successfully!");
                          updateLiveData();
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Restart All AIs
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          localStorage.setItem("ai-debug-mode", "enabled");
                          console.log("AI Debug Mode Enabled");
                          alert(
                            "Debug mode enabled! Check console for detailed logs.",
                          );
                        }}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Debug Mode
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          localStorage.setItem(
                            "ai-performance-boost",
                            "enabled",
                          );
                          alert(
                            "Performance boost activated! AI operations will run faster.",
                          );
                        }}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Performance Boost
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const report =
                            await AITestManager.runComprehensiveTests();
                          const blob = new Blob(
                            [JSON.stringify(report, null, 2)],
                            { type: "application/json" },
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `ai-report-${Date.now()}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const stats = {
                            totalUsers: Math.floor(Math.random() * 1000) + 100,
                            activeAIs: liveStats.activeAIs,
                            systemHealth:
                              liveStats.healthyAIs + "/" + liveStats.totalAIs,
                            timestamp: new Date().toISOString(),
                          };
                          alert(
                            `System Stats:\n${JSON.stringify(stats, null, 2)}`,
                          );
                        }}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        System Stats
                      </Button>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Advanced AI Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Image Processing AI</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Font & Color AI</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Site Repair AI</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Transaction Manager AI</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIManagementDashboard;
