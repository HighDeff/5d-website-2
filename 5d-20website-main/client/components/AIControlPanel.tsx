import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Bell,
  Brain,
  Activity,
  BarChart3,
  Settings,
  ChevronRight,
  Zap,
  Shield,
  Eye,
  Layers,
  Bot,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import QuantumPassAIService from "@/services/QuantumPassAIService";
import AIConfidenceScoring from "@/services/AIConfidenceScoring";
import AISelfFixingSystem from "@/services/AISelfFixingSystem";

const AIControlPanel = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiService] = useState(() => QuantumPassAIService.getInstance());
  const [confidenceScoring] = useState(() => AIConfidenceScoring.getInstance());
  const [selfFixingSystem] = useState(() => AISelfFixingSystem.getInstance());
  const [aiStatus, setAiStatus] = useState({ isOnline: false, status: 'connecting', lastPing: 0 });
  const [confidenceAverage, setConfidenceAverage] = useState(0);
  const [selfFixingActive, setSelfFixingActive] = useState(false);
  const [systemHealth, setSystemHealth] = useState({ successRate: 0, totalErrors: 0 });

  useEffect(() => {
    // Monitor AI status
    const updateStatus = () => {
      try {
        const status = aiService.getOnlineStatus();
        setAiStatus(status);

        const confidence = confidenceScoring.getAverageConfidence(1);
        setConfidenceAverage(confidence);

        setSelfFixingActive(selfFixingSystem.isLoopModeRunning());

        const health = selfFixingSystem.getSystemHealth();
        setSystemHealth(health);
      } catch (error) {
        console.warn('Error updating AI status in control panel:', error);
        // Set safe defaults on error
        setAiStatus({ isOnline: false, status: 'error', lastPing: -1 });
        setConfidenceAverage(0);
        setSelfFixingActive(false);
        setSystemHealth({ successRate: 0, totalErrors: 0 });
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, [aiService, confidenceScoring, selfFixingSystem]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-16' : 'w-80'
    }`}>
      <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              {!isMinimized && "AI Control"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-slate-400 hover:text-white"
            >
              {isMinimized ? <ChevronRight className="h-4 w-4" /> : '−'}
            </Button>
          </div>
          {!isMinimized && (
            <CardDescription className="text-slate-300">
              Quick access to AI systems
            </CardDescription>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-3">
            {/* Canvas Control */}
            <Link to="/canvas-control">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
                <Palette className="h-4 w-4 mr-2 text-blue-400" />
                Canvas Control
                <Badge variant="outline" className="ml-auto bg-green-900 text-green-300 border-green-600">
                  Active
                </Badge>
              </Button>
            </Link>

            {/* AI Notifications */}
            <Link to="/ai-notifications">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
                <Bell className="h-4 w-4 mr-2 text-purple-400" />
                AI Notifications
                <Badge variant="outline" className="ml-auto bg-red-900 text-red-300 border-red-600">
                  3
                </Badge>
              </Button>
            </Link>

            {/* Popups & Modals */}
            <Link to="/popups-modals">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
                <Layers className="h-4 w-4 mr-2 text-indigo-400" />
                Popups & Modals
                <Badge variant="outline" className="ml-auto bg-blue-900 text-blue-300 border-blue-600">
                  6
                </Badge>
              </Button>
            </Link>

            {/* QuantumPass Model */}
            <Link to="/quantumpass-model">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
                <Bot className="h-4 w-4 mr-2 text-yellow-400" />
                QuantumPass AI
                <Badge variant="outline" className="ml-auto bg-yellow-900 text-yellow-300 border-yellow-600">
                  New
                </Badge>
              </Button>
            </Link>

            {/* System Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {aiStatus.isOnline ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-sm text-white">AI Status</span>
                </div>
                <Badge
                  variant="outline"
                  className={aiStatus.isOnline
                    ? "bg-green-900 text-green-300 border-green-600"
                    : "bg-red-900 text-red-300 border-red-600"
                  }
                >
                  {aiStatus.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">Confidence</span>
                </div>
                <Badge
                  variant="outline"
                  className={confidenceAverage > 0.7
                    ? "bg-green-900 text-green-300 border-green-600"
                    : confidenceAverage > 0.4
                    ? "bg-yellow-900 text-yellow-300 border-yellow-600"
                    : "bg-red-900 text-red-300 border-red-600"
                  }
                >
                  {(confidenceAverage * 100).toFixed(0)}%
                </Badge>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white">Self-Fixing</span>
                </div>
                <Badge
                  variant="outline"
                  className={selfFixingActive
                    ? "bg-green-900 text-green-300 border-green-600"
                    : "bg-gray-900 text-gray-300 border-gray-600"
                  }
                >
                  {selfFixingActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Health</span>
                </div>
                <Badge
                  variant="outline"
                  className={systemHealth.successRate > 0.8
                    ? "bg-green-900 text-green-300 border-green-600"
                    : systemHealth.successRate > 0.6
                    ? "bg-yellow-900 text-yellow-300 border-yellow-600"
                    : "bg-red-900 text-red-300 border-red-600"
                  }
                >
                  {(systemHealth.successRate * 100).toFixed(0)}%
                </Badge>
              </div>

              {systemHealth.totalErrors > 0 && (
                <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-white">Errors</span>
                  </div>
                  <Badge variant="outline" className="bg-orange-900 text-orange-300 border-orange-600">
                    {systemHealth.totalErrors}
                  </Badge>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                  onClick={() => {
                    if (selfFixingActive) {
                      selfFixingSystem.stopLoopMode();
                    } else {
                      selfFixingSystem.startLoopMode();
                    }
                  }}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {selfFixingActive ? 'Stop Fix' : 'Auto Fix'}
                </Button>
                <Link to="/AIManagementHub">
                  <Button variant="outline" size="sm" className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                    <Settings className="h-3 w-3 mr-1" />
                    AI Hub
                  </Button>
                </Link>
              </div>

              {/* Confidence Score Display */}
              {aiStatus.lastPing > 0 && (
                <div className="mt-2 text-xs text-slate-400 text-center">
                  Ping: {aiStatus.lastPing}ms • Confidence: {(confidenceAverage * 100).toFixed(0)}%
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIControlPanel;
