import React, { useState, useEffect, useRef } from "react";
import ConsoleLogMonitoringService, {
  ConsoleLogEntry,
  FixSuggestion,
} from "../services/ConsoleLogMonitoringService";

interface LiveConsoleMonitorProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

const LiveConsoleMonitor: React.FC<LiveConsoleMonitorProps> = ({
  isVisible = false,
  onToggle,
}) => {
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ConsoleLogEntry[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [selectedLog, setSelectedLog] = useState<ConsoleLogEntry | null>(null);
  const [suggestions, setSuggestions] = useState<FixSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    level: "",
    severity: "",
    category: "",
    showFixed: false,
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const monitoringService = ConsoleLogMonitoringService.getInstance();

  useEffect(() => {
    initializeMonitoring();
    return () => {
      monitoringService.stopMonitoring();
    };
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(refreshData, 1000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs, autoScroll]);

  useEffect(() => {
    applyFilters();
  }, [logs, searchQuery, filters]);

  const initializeMonitoring = async () => {
    await monitoringService.startMonitoring();
    setIsMonitoring(true);
    refreshData();
  };

  const refreshData = () => {
    const recentLogs = monitoringService.getRecentLogs(200);
    setLogs(recentLogs);
    const stats = monitoringService.getErrorStatistics();
    setStatistics(stats);
  };

  const applyFilters = () => {
    let filtered = logs;

    if (searchQuery) {
      filtered = monitoringService.searchLogs(searchQuery);
    }

    if (filters.level) {
      filtered = filtered.filter((log) => log.level === filters.level);
    }

    if (filters.severity) {
      filtered = filtered.filter((log) => log.severity === filters.severity);
    }

    if (filters.category) {
      filtered = filtered.filter((log) => log.category === filters.category);
    }

    if (!filters.showFixed) {
      filtered = filtered.filter((log) => !log.isFixed);
    }

    setFilteredLogs(filtered);
  };

  const handleLogClick = async (log: ConsoleLogEntry) => {
    setSelectedLog(log);
    if (log.level === "error" && !log.isFixed) {
      const fixSuggestions = await monitoringService.analyzeAndSuggestFix(log);
      setSuggestions(fixSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleApplyFix = async (suggestion: FixSuggestion) => {
    try {
      const success = await monitoringService.applyAutomatedFix(suggestion);
      if (success) {
        alert(`✅ Fix applied: ${suggestion.title}`);
        refreshData();
      } else {
        alert(`❌ Could not apply automated fix: ${suggestion.title}`);
      }
    } catch (error) {
      alert(`❌ Error applying fix: ${error}`);
    }
  };

  const handleUserPromptFix = () => {
    if (!selectedLog) return;

    const userPrompt = prompt(
      `🤖 Describe the issue you're experiencing with this error:\n\n"${selectedLog.message}"\n\nThe AI will help analyze and fix it:`,
    );

    if (userPrompt) {
      // This would integrate with your AI chat system
      console.log(`🤖 User requested help: ${userPrompt}`);
      alert(
        `🤖 AI analysis requested for: "${userPrompt}"\n\nThe AI will process this and provide a solution shortly.`,
      );
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
      case "debug":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-red-400";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 z-50"
        title="Open Console Monitor"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="fixed top-16 right-4 w-96 h-3/4 bg-white border-2 border-cyan-500 rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-cyan-500 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">🔍 Live Console Monitor</h3>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-400" : "bg-red-400"}`}
          ></span>
          <button onClick={onToggle} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-2 bg-gray-50 border-b">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="font-bold text-gray-700">
              {statistics.totalLogs || 0}
            </div>
            <div className="text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-500">
              {statistics.errorCount || 0}
            </div>
            <div className="text-gray-500">Errors</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-500">
              {statistics.warningCount || 0}
            </div>
            <div className="text-gray-500">Warnings</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-500">
              {statistics.fixedCount || 0}
            </div>
            <div className="text-gray-500">Fixed</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-2 bg-gray-50 border-b space-y-2">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-1 text-xs border rounded"
        />

        <div className="flex gap-1 text-xs">
          <select
            value={filters.level}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, level: e.target.value }))
            }
            className="flex-1 p-1 border rounded"
          >
            <option value="">All Levels</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Info</option>
            <option value="log">Logs</option>
          </select>

          <select
            value={filters.severity}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, severity: e.target.value }))
            }
            className="flex-1 p-1 border rounded"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={filters.showFixed}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, showFixed: e.target.checked }))
              }
            />
            Show Fixed
          </label>

          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            Auto Scroll
          </label>
        </div>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredLogs.map((log, index) => (
          <div
            key={log.id}
            onClick={() => handleLogClick(log)}
            className={`p-2 rounded text-xs border cursor-pointer hover:bg-gray-100 ${
              log.isFixed
                ? "bg-green-50 border-green-200"
                : "bg-white border-gray-200"
            } ${selectedLog?.id === log.id ? "ring-2 ring-cyan-500" : ""}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity)}`}
              ></span>
              <span className={`font-mono ${getLevelColor(log.level)}`}>
                {log.level.toUpperCase()}
              </span>
              <span className="text-gray-500">
                {formatTimestamp(log.timestamp)}
              </span>
              {log.isFixed && <span className="text-green-600">✅</span>}
            </div>
            <div className="text-gray-700 break-words">
              {log.message.length > 100
                ? `${log.message.slice(0, 100)}...`
                : log.message}
            </div>
            <div className="text-gray-500 mt-1">
              {log.category} • {log.url.split("/").pop()}
            </div>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Selected Log Details */}
      {selectedLog && (
        <div className="border-t bg-gray-50 p-2 max-h-48 overflow-y-auto">
          <div className="text-xs space-y-2">
            <div className="font-bold">Log Details:</div>
            <div>
              <strong>Message:</strong> {selectedLog.message}
            </div>
            <div>
              <strong>Category:</strong> {selectedLog.category}
            </div>
            <div>
              <strong>Severity:</strong> {selectedLog.severity}
            </div>
            {selectedLog.stack && (
              <div>
                <strong>Stack:</strong>{" "}
                <pre className="text-xs bg-gray-200 p-1 rounded mt-1">
                  {selectedLog.stack.slice(0, 200)}...
                </pre>
              </div>
            )}

            {/* Fix Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-3">
                <div className="font-bold mb-2">🔧 Fix Suggestions:</div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className="bg-white p-2 rounded border mb-2"
                  >
                    <div className="font-semibold">{suggestion.title}</div>
                    <div className="text-gray-600 mb-2">
                      {suggestion.description}
                    </div>
                    <div className="mb-2">{suggestion.solution}</div>
                    {suggestion.code && (
                      <pre className="bg-gray-100 p-1 rounded text-xs mb-2">
                        {suggestion.code}
                      </pre>
                    )}
                    <div className="flex gap-2">
                      {suggestion.automated && (
                        <button
                          onClick={() => handleApplyFix(suggestion)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Apply Fix
                        </button>
                      )}
                      <button
                        onClick={handleUserPromptFix}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Ask AI Help
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="border-t p-2 bg-gray-50">
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => {
              if (isMonitoring) {
                monitoringService.stopMonitoring();
                setIsMonitoring(false);
              } else {
                initializeMonitoring();
              }
            }}
            className={`px-2 py-1 rounded ${
              isMonitoring ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {isMonitoring ? "Stop" : "Start"} Monitoring
          </button>

          <button
            onClick={() => {
              setLogs([]);
              setFilteredLogs([]);
              setSelectedLog(null);
              setSuggestions([]);
            }}
            className="bg-gray-500 text-white px-2 py-1 rounded"
          >
            Clear
          </button>

          <button
            onClick={refreshData}
            className="bg-cyan-500 text-white px-2 py-1 rounded"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveConsoleMonitor;
