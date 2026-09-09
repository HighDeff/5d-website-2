import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Play,
  Clock,
  TrendingUp,
} from "lucide-react";
import AIAutoFixService from "../services/AIAutoFixService";

interface AIAutoFixNotificationsProps {
  isAdmin?: boolean;
  className?: string;
}

const AIAutoFixNotifications: React.FC<AIAutoFixNotificationsProps> = ({
  isAdmin = false,
  className = "",
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [autoFixService, setAutoFixService] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      initializeAutoFix();
      loadNotifications();
    }
  }, [isAdmin]);

  const initializeAutoFix = async () => {
    try {
      const service = AIAutoFixService.getInstance();
      setAutoFixService(service);
    } catch (error) {
      console.error("Error initializing AI Auto-Fix service:", error);
    }
  };

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem("ai-autofix-notifications");
      if (stored) {
        const notifications = JSON.parse(stored);
        setNotifications(notifications.slice(-10)); // Show last 10
      }
    } catch (error) {
      console.error("Error loading AI notifications:", error);
    }
  };

  const handleApproveIssue = async (issueId: string) => {
    if (!autoFixService) return;

    try {
      console.log(`🎯 Admin approving fix for issue: ${issueId}`);

      // Approve the issue
      autoFixService.approveIssue(issueId);

      // Show immediate feedback
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.issue.id === issueId
            ? { ...notif, status: "applying", progress: "Applying fix..." }
            : notif,
        ),
      );

      // Apply the fix
      const success = await autoFixService.applyFix(issueId);

      if (success) {
        // Update notification status
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.issue.id === issueId
              ? {
                  ...notif,
                  status: "applied",
                  progress: "✅ Fix applied successfully!",
                  appliedAt: new Date().toISOString(),
                }
              : notif,
          ),
        );

        // Show success message
        showTemporaryMessage("✅ Fix applied successfully!", "success");

        // Reload notifications after a delay to show updated data
        setTimeout(() => {
          loadNotifications();
        }, 2000);
      } else {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.issue.id === issueId
              ? {
                  ...notif,
                  status: "failed",
                  progress: "❌ Fix application failed",
                }
              : notif,
          ),
        );

        showTemporaryMessage("❌ Fix application failed", "error");
      }
    } catch (error) {
      console.error("Error applying fix:", error);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.issue.id === issueId
            ? {
                ...notif,
                status: "error",
                progress: "🚨 Error applying fix",
              }
            : notif,
        ),
      );

      showTemporaryMessage("🚨 Error applying fix", "error");
    }
  };

  const showTemporaryMessage = (message: string, type: "success" | "error") => {
    // Create temporary notification
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  if (!isAdmin || notifications.length === 0) {
    return null;
  }

  const pendingIssues = notifications.filter(
    (n) => !n.status || n.status === "pending",
  );
  const appliedIssues = notifications.filter((n) => n.status === "applied");

  return (
    <div className={`${className}`}>
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Settings className="w-5 h-5 text-orange-600" />
              <span>AI Auto-Fix Alerts</span>
              {pendingIssues.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingIssues.length} pending
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm">
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Pending Issues */}
            {pendingIssues.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Pending Issues ({pendingIssues.length})
                </h4>
                <div className="space-y-2">
                  {pendingIssues.map((notification, index) => (
                    <div
                      key={notification.id || index}
                      className="bg-white rounded-lg p-3 border border-orange-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              variant={
                                notification.issue.severity === "critical"
                                  ? "destructive"
                                  : notification.issue.severity === "high"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {notification.issue.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {notification.issue.type.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {notification.issue.description}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            Location: {notification.issue.location}
                          </p>
                          <div className="bg-blue-50 p-2 rounded text-xs">
                            <strong>Proposed Fix:</strong>{" "}
                            {notification.issue.proposedFix}
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Success: {notification.issue.successProbability}%
                            </div>
                            {notification.issue.testResults && (
                              <div className="flex items-center text-xs">
                                {notification.issue.testResults.passed ? (
                                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                ) : (
                                  <XCircle className="w-3 h-3 mr-1 text-red-500" />
                                )}
                                Tests{" "}
                                {notification.issue.testResults.passed
                                  ? "Passed"
                                  : "Failed"}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1 ml-3">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApproveIssue(notification.issue.id)
                            }
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={
                              !notification.issue.testResults?.passed &&
                              notification.issue.successProbability < 80
                            }
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Apply Fix
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Dismiss issue
                              setNotifications((prev) =>
                                prev.filter((n) => n.id !== notification.id),
                              );
                            }}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applied Issues */}
            {appliedIssues.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Recently Applied ({appliedIssues.length})
                </h4>
                <div className="space-y-2">
                  {appliedIssues.slice(0, 3).map((notification, index) => (
                    <div
                      key={notification.id || index}
                      className="bg-green-50 rounded-lg p-2 border border-green-200"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          Fixed: {notification.issue.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={loadNotifications}
                className="w-full"
              >
                <Clock className="w-4 h-4 mr-2" />
                Refresh Notifications
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIAutoFixNotifications;
