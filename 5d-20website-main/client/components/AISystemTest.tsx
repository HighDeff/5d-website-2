import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader, Play } from "lucide-react";

interface AISystemTestProps {
  className?: string;
}

const AISystemTest: React.FC<AISystemTestProps> = ({ className = "" }) => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  const runSystemTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      {
        name: "AI Central Command",
        test: async () => {
          try {
            const AICentralCommandModule = await import(
              "../services/AICentralCommand"
            );
            const AICentralCommand = AICentralCommandModule.default;
            const central = AICentralCommand.getInstance();
            await central.initialize();
            return { success: true, message: "Central Command initialized" };
          } catch (error) {
            return { success: false, message: error.message };
          }
        },
      },
      {
        name: "AI Auto-Fix Service",
        test: async () => {
          try {
            const AIAutoFixService = (
              await import("../services/AIAutoFixService")
            ).default;
            const autoFix = AIAutoFixService.getInstance();
            await autoFix.initialize();
            return { success: true, message: "Auto-Fix Service initialized" };
          } catch (error) {
            return { success: false, message: error.message };
          }
        },
      },
      {
        name: "Inter-AI Communication",
        test: async () => {
          try {
            const AICentralCommandModule = await import(
              "../services/AICentralCommand"
            );
            const AICentralCommand = AICentralCommandModule.default;
            const central = AICentralCommand.getInstance();

            // Test message sending
            await central.sendMessage({
              from: "test-agent",
              to: "central",
              type: "request",
              content: { action: "test-communication" },
              priority: 1,
              requiresResponse: false,
            });

            return { success: true, message: "Communication test passed" };
          } catch (error) {
            return { success: false, message: error.message };
          }
        },
      },
      {
        name: "Database Logging",
        test: async () => {
          try {
            const AICentralCommandModule = await import(
              "../services/AICentralCommand"
            );
            const AICentralCommand = AICentralCommandModule.default;
            const central = AICentralCommand.getInstance();

            await central.logToDatabase({
              type: "communication",
              agentId: "test-agent",
              data: { action: "test-log" },
              metadata: { page: "test" },
            });

            return { success: true, message: "Database logging works" };
          } catch (error) {
            return { success: false, message: error.message };
          }
        },
      },
      {
        name: "Fix Detection",
        test: async () => {
          try {
            const AIAutoFixService = (
              await import("../services/AIAutoFixService")
            ).default;
            const autoFix = AIAutoFixService.getInstance();

            // Test issue detection
            const issues = autoFix.getDetectedIssues();

            return { success: true, message: `Found ${issues.length} issues` };
          } catch (error) {
            return { success: false, message: error.message };
          }
        },
      },
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            ...result,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            success: false,
            message: error.message,
            timestamp: new Date().toISOString(),
          },
        ]);
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Get system status
    try {
      const AICentralCommandModule = await import(
        "../services/AICentralCommand"
      );
      const AICentralCommand = AICentralCommandModule.default;
      const central = AICentralCommand.getInstance();
      const status = await central.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error("Error getting system status:", error);
    }

    setIsRunning(false);
  };

  const getStatusColor = (success: boolean) => {
    return success ? "text-green-600" : "text-red-600";
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  return (
    <div className={className}>
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg text-blue-800">🧪 AI System Test</span>
            <Button
              onClick={runSystemTest}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isRunning ? "Running..." : "Run Tests"}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {testResults.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-blue-800">Test Results:</h4>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded p-2 border"
                >
                  <div className="flex items-center space-x-2">
                    <div className={getStatusColor(result.success)}>
                      {getStatusIcon(result.success)}
                    </div>
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">{result.message}</div>
                </div>
              ))}
            </div>
          )}

          {systemStatus && (
            <div className="mt-4 p-3 bg-white rounded border">
              <h4 className="font-semibold text-blue-800 mb-2">
                System Status:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  Active Agents:{" "}
                  <Badge variant="outline">{systemStatus.activeAgents}</Badge>
                </div>
                <div>
                  Pending Tasks:{" "}
                  <Badge variant="outline">{systemStatus.pendingTasks}</Badge>
                </div>
                <div>
                  System Health:{" "}
                  <Badge variant="outline">{systemStatus.systemHealth}%</Badge>
                </div>
                <div>
                  Recent Errors:{" "}
                  <Badge variant="outline">
                    {systemStatus.recentErrors?.length || 0}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {testResults.length === 0 && !isRunning && (
            <div className="text-center text-gray-500 py-4">
              Click "Run Tests" to verify AI system functionality
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISystemTest;
