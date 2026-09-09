// Monitoring Dashboard for AI-Powered Validation and System Monitoring
// Displays real-time system health, validation results, and monitoring reports

import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Mail,
  Package,
  TrendingUp,
  RefreshCw,
  Eye,
  Settings,
} from "lucide-react";
import AuthService from "../services/AuthService";
import MonitoringService from "../services/MonitoringService";

interface SystemStatus {
  databaseOnline: boolean;
  storageAvailable: boolean;
  userCount: number;
  lastBackup?: string;
  monitoringActive?: boolean;
  systemHealth?: string;
}

interface MonitoringReport {
  timestamp: string;
  overdueShipments: any[];
  pendingEmails: any[];
  balanceDiscrepancies: any[];
  systemHealth: "healthy" | "warning" | "critical";
  recommendations: string[];
}

const MonitoringDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [monitoringReport, setMonitoringReport] =
    useState<MonitoringReport | null>(null);
  const [monitoringHistory, setMonitoringHistory] = useState<
    MonitoringReport[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get system status
      const statusResult = await AuthService.getSystemStatus();
      setSystemStatus(statusResult);

      // Get latest monitoring report
      const reportResult = await AuthService.getMonitoringReport();
      if (reportResult.success && reportResult.report) {
        setMonitoringReport(reportResult.report);
      }

      // Get monitoring history
      const historyResult = await AuthService.getMonitoringHistory(5);
      if (historyResult.success && historyResult.history) {
        setMonitoringHistory(historyResult.history);
      }
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleValidateUser = async () => {
    if (!selectedUserId) return;

    try {
      const result = await AuthService.validateUserAccount(selectedUserId);
      setValidationResult(result.validationResult);
    } catch (error) {
      console.error("❌ Error validating user:", error);
    }
  };

  const handleAutoRestore = async () => {
    if (!selectedUserId) return;

    try {
      const result = await AuthService.autoRestoreUserData(selectedUserId);
      if (result.success) {
        alert(
          result.restored
            ? "User data restored successfully!"
            : "No restoration needed",
        );
        await handleValidateUser(); // Re-validate after restore
      }
    } catch (error) {
      console.error("❌ Error during auto-restore:", error);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getValidationScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-blue-600" />
                AI Monitoring Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time system monitoring, validation, and data integrity
                checks
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Database Status
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStatus?.databaseOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStatus?.userCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  System Health
                </p>
                <p
                  className={`text-2xl font-bold capitalize ${getHealthColor(systemStatus?.systemHealth || "unknown").split(" ")[0]}`}
                >
                  {systemStatus?.systemHealth || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monitoring</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStatus?.monitoringActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Monitoring Report */}
        {monitoringReport && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Current System Report
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(monitoringReport.systemHealth)}`}
                >
                  {monitoringReport.systemHealth}
                </span>
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Generated:{" "}
                {new Date(monitoringReport.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {monitoringReport.overdueShipments.length}
                  </p>
                  <p className="text-sm text-gray-600">Overdue Shipments</p>
                </div>

                <div className="text-center">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {monitoringReport.pendingEmails.length}
                  </p>
                  <p className="text-sm text-gray-600">Pending Emails</p>
                </div>

                <div className="text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {monitoringReport.balanceDiscrepancies.length}
                  </p>
                  <p className="text-sm text-gray-600">Balance Issues</p>
                </div>
              </div>

              {monitoringReport.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Recommendations
                  </h3>
                  <ul className="space-y-1">
                    {monitoringReport.recommendations.map((rec, index) => (
                      <li key={index} className="text-yellow-700 text-sm">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Validation Tool */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              AI User Validation Tool
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Validate user accounts and restore data if needed
            </p>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter User ID to validate..."
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleValidateUser}
                disabled={!selectedUserId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Validate
              </button>
              <button
                onClick={handleAutoRestore}
                disabled={!selectedUserId}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Auto-Restore
              </button>
            </div>

            {validationResult && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    Validation Results
                  </h3>
                  <span
                    className={`text-2xl font-bold ${getValidationScoreColor(validationResult.score)}`}
                  >
                    {validationResult.score}/100
                  </span>
                </div>

                <div className="flex items-center mb-3">
                  <span className="text-sm text-gray-600 mr-4">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      validationResult.isValid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {validationResult.isValid ? "Valid" : "Issues Found"}
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm font-medium ${getHealthColor(validationResult.riskLevel)}`}
                  >
                    {validationResult.riskLevel} risk
                  </span>
                </div>

                {validationResult.issues &&
                  validationResult.issues.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Issues Found:
                      </h4>
                      <div className="space-y-2">
                        {validationResult.issues.map(
                          (issue: any, index: number) => (
                            <div
                              key={index}
                              className={`p-2 rounded text-sm ${
                                issue.type === "error"
                                  ? "bg-red-50 text-red-700"
                                  : issue.type === "warning"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              <div className="font-medium">
                                {issue.field}: {issue.message}
                              </div>
                              {issue.fixSuggestion && (
                                <div className="text-xs mt-1 opacity-75">
                                  Suggestion: {issue.fixSuggestion}
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {validationResult.suggestions &&
                  validationResult.suggestions.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900 mb-2">
                        AI Suggestions:
                      </h4>
                      <ul className="space-y-1">
                        {validationResult.suggestions.map(
                          (suggestion: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600">
                              • {suggestion}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Monitoring History */}
        {monitoringHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Monitoring History
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {monitoringHistory.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span
                        className={`w-3 h-3 rounded-full mr-3 ${getHealthColor(report.systemHealth).split(" ")[1]}`}
                      ></span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(report.timestamp).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {report.overdueShipments.length} shipments,{" "}
                          {report.pendingEmails.length} emails,{" "}
                          {report.balanceDiscrepancies.length} balance issues
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getHealthColor(report.systemHealth)}`}
                    >
                      {report.systemHealth}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
