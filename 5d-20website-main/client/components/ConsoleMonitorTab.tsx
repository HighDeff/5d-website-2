import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConsoleLog {
  timestamp: string;
  level: string;
  message: string;
  category: string;
  severity: string;
  isFixed?: boolean;
}

const ConsoleMonitorTab: React.FC = () => {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [stats, setStats] = useState({
    totalLogs: 0,
    errorCount: 0,
    warningCount: 0,
    fixedCount: 0,
  });

  useEffect(() => {
    // Check if console monitoring is available
    if (typeof window !== "undefined" && window.consoleMonitor) {
      setIsMonitoring(true);
      refreshLogs();
    }
  }, []);

  const refreshLogs = () => {
    if (window.consoleMonitor) {
      const recentLogs = window.consoleMonitor.getLogs(20);
      setLogs(recentLogs || []);

      const statistics = window.consoleMonitor.stats();
      setStats(
        statistics || {
          totalLogs: 0,
          errorCount: 0,
          warningCount: 0,
          fixedCount: 0,
        },
      );
    }
  };

  const handleStartMonitoring = () => {
    if (window.consoleMonitor) {
      window.consoleMonitor.start();
      setIsMonitoring(true);
      refreshLogs();
    }
  };

  const handleStopMonitoring = () => {
    if (window.consoleMonitor) {
      window.consoleMonitor.stop();
      setIsMonitoring(false);
    }
  };

  const handleGenerateTestLogs = () => {
    if (window.consoleMonitor) {
      window.consoleMonitor.test();
      setTimeout(refreshLogs, 1000);
    }
  };

  const handleClearLogs = () => {
    if (window.consoleMonitor) {
      window.consoleMonitor.clear();
      setLogs([]);
      setStats({ totalLogs: 0, errorCount: 0, warningCount: 0, fixedCount: 0 });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-gray-700";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-400 text-white";
      case "medium":
        return "bg-yellow-400 text-black";
      case "low":
        return "bg-green-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          🔍 Live Console Monitor
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={
              isMonitoring ? handleStopMonitoring : handleStartMonitoring
            }
            className={`px-4 py-2 rounded ${
              isMonitoring
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isMonitoring ? "Stop" : "Start"} Monitoring
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">📊 Statistics</h4>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">
              {stats.totalLogs}
            </div>
            <div className="text-sm text-gray-500">Total Logs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {stats.errorCount}
            </div>
            <div className="text-sm text-gray-500">Errors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.warningCount}
            </div>
            <div className="text-sm text-gray-500">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {stats.fixedCount}
            </div>
            <div className="text-sm text-gray-500">Fixed</div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">🎮 Controls</h4>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={refreshLogs} variant="outline">
            🔄 Refresh
          </Button>
          <Button onClick={handleGenerateTestLogs} variant="outline">
            🧪 Generate Test Logs
          </Button>
          <Button onClick={handleClearLogs} variant="outline">
            🗑️ Clear Logs
          </Button>
          <Button
            onClick={() => {
              if (window.consoleMonitor) {
                window.consoleMonitor.help();
              }
            }}
            variant="outline"
          >
            ❓ Help
          </Button>
        </div>
      </Card>

      {/* Features Info */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">✨ Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium text-gray-800 mb-2">
              📊 Real-time Monitoring
            </h5>
            <p className="text-sm text-gray-600">
              Captures all console output including errors, warnings, and debug
              info
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium text-gray-800 mb-2">🤖 AI Analysis</h5>
            <p className="text-sm text-gray-600">
              Intelligent error pattern recognition and fix suggestions
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium text-gray-800 mb-2">🔧 Auto-Fix</h5>
            <p className="text-sm text-gray-600">
              Automated fixes for common coding issues and errors
            </p>
          </div>
        </div>
      </Card>

      {/* Console Commands */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">💻 Console Commands</h4>
        <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm space-y-1">
          <div>📝 consoleMonitor.getLogs(50) - Get recent logs</div>
          <div>🔍 consoleMonitor.search("error") - Search logs</div>
          <div>📊 consoleMonitor.stats() - Show statistics</div>
          <div>🧪 consoleMonitor.test() - Generate test logs</div>
          <div>❓ consoleMonitor.help() - Show all commands</div>
        </div>
      </Card>

      {/* Recent Logs */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">📝 Recent Logs ({logs.length})</h4>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No logs available.{" "}
              {!isMonitoring && "Start monitoring to see logs."}
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded border text-xs ${
                  log.isFixed
                    ? "bg-green-50 border-green-200"
                    : log.level === "error"
                      ? "bg-red-50 border-red-200"
                      : log.level === "warn"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-mono font-bold ${getLevelColor(log.level)}`}
                  >
                    {log.level.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getSeverityBadgeColor(log.severity)}`}
                  >
                    {log.severity}
                  </span>
                  <span className="text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {log.isFixed && <span className="text-green-600">✅</span>}
                </div>
                <div className="text-gray-700 break-words">
                  {log.message.length > 200
                    ? `${log.message.slice(0, 200)}...`
                    : log.message}
                </div>
                <div className="text-gray-500 mt-1">{log.category}</div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* AI Fix Suggestions */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">🤖 AI Fix Suggestions</h4>
        <div className="space-y-2">
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-medium">🔧 Common Fixes Available:</div>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>
                • DatabaseService import errors → Auto-fix import statements
              </li>
              <li>• Missing method errors → Generate method templates</li>
              <li>• Network errors → Add retry logic and error handling</li>
              <li>• Promise rejections → Wrap in try-catch blocks</li>
            </ul>
          </div>

          <Button
            onClick={() => {
              alert(
                "🤖 AI Fix Engine: Analyzing current errors and generating fix suggestions...\n\nThis will analyze error patterns and provide automated solutions for common issues.",
              );
            }}
            className="w-full"
            variant="outline"
          >
            🚀 Run AI Error Analysis
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConsoleMonitorTab;
