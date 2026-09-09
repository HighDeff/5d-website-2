// AI Suggestions Component - Display and manage AI content suggestions
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BellRing,
  CheckCircle,
  XCircle,
  Eye,
  Zap,
  Brain,
  Folder,
  Copy,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";
import UserNotificationService, {
  UserNotification,
  NotificationAction,
} from "@/services/UserNotificationService";
import AIContentAnalyzer from "@/services/AIContentAnalyzer";

interface AISuggestionsProps {
  userId?: string;
  showInline?: boolean;
  maxItems?: number;
  className?: string;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({
  userId,
  showInline = false,
  maxItems = 10,
  className = "",
}) => {
  const { user } = useUserAuth();
  const currentUserId = userId || user?.id;

  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotification, setExpandedNotification] = useState<
    string | null
  >(null);
  const [processingActions, setProcessingActions] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (!currentUserId) return;

    // Load initial notifications
    loadNotifications();

    // Subscribe to notification updates
    const unsubscribe = UserNotificationService.subscribe(
      (allNotifications) => {
        const userNotifications = allNotifications.filter(
          (n) => n.userId === currentUserId,
        );
        setNotifications(userNotifications.slice(0, maxItems));
      },
    );

    return unsubscribe;
  }, [currentUserId, maxItems]);

  const loadNotifications = () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const userNotifications =
        UserNotificationService.getUserNotifications(currentUserId);
      setNotifications(userNotifications.slice(0, maxItems));
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (notificationId: string, actionId: string) => {
    const actionKey = `${notificationId}-${actionId}`;
    setProcessingActions((prev) => new Set(prev).add(actionKey));

    try {
      const success = await UserNotificationService.handleAction(
        notificationId,
        actionId,
      );

      if (success) {
        // Remove notification from local state
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Error handling action:", error);
    } finally {
      setProcessingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    UserNotificationService.markAsRead(notificationId);
  };

  const triggerAIAnalysis = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      await AIContentAnalyzer.analyzeUserContent(currentUserId, true);
      setTimeout(() => {
        loadNotifications();
      }, 2000); // Give time for notifications to be created
    } catch (error) {
      console.error("Error triggering AI analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (notification: UserNotification) => {
    if (!notification.read) {
      switch (notification.priority) {
        case "urgent":
          return <AlertTriangle className="w-5 h-5 text-red-500" />;
        case "high":
          return <BellRing className="w-5 h-5 text-orange-500" />;
        case "medium":
          return <Bell className="w-5 h-5 text-blue-500" />;
        default:
          return <Info className="w-5 h-5 text-gray-500" />;
      }
    }

    switch (notification.type) {
      case "ai-suggestion":
        return <Brain className="w-5 h-5 text-purple-500" />;
      case "system":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationBadgeColor = (notification: UserNotification) => {
    if (!notification.read) {
      switch (notification.priority) {
        case "urgent":
          return "bg-red-100 text-red-800";
        case "high":
          return "bg-orange-100 text-orange-800";
        case "medium":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
    return "bg-gray-50 text-gray-600";
  };

  const getActionButtonStyle = (action: NotificationAction) => {
    const baseClasses = "text-sm";
    switch (action.style) {
      case "primary":
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`;
      case "success":
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white`;
      case "danger":
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white`;
      case "secondary":
      default:
        return `${baseClasses} bg-gray-200 hover:bg-gray-300 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mr-2" />
              <span className="text-gray-600">Loading AI suggestions...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600 mb-4">
                No AI suggestions at the moment. Our AI continuously analyzes
                your content for improvements.
              </p>
              <Button onClick={triggerAIAnalysis} variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Run AI Analysis Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!showInline && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span>AI Suggestions</span>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              {notifications.filter((n) => !n.read).length} new
            </Badge>
          </h2>
          <Button onClick={triggerAIAnalysis} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all duration-200 ${
              !notification.read
                ? "border-purple-200 bg-purple-50/50"
                : "border-gray-200"
            } ${expandedNotification === notification.id ? "shadow-md" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {notification.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={getNotificationBadgeColor(notification)}
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setExpandedNotification(
                            expandedNotification === notification.id
                              ? null
                              : notification.id,
                          );
                          if (!notification.read) {
                            markAsRead(notification.id);
                          }
                        }}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            expandedNotification === notification.id
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-3">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    {notification.expiresAt && (
                      <span>
                        Expires:{" "}
                        {new Date(notification.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedNotification === notification.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {notification.data && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">
                            Details:
                          </h4>
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(notification.data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {notification.actions &&
                        notification.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {notification.actions.map((action) => {
                              const actionKey = `${notification.id}-${action.id}`;
                              const isProcessing =
                                processingActions.has(actionKey);

                              return (
                                <Button
                                  key={action.id}
                                  onClick={() =>
                                    handleAction(notification.id, action.id)
                                  }
                                  disabled={isProcessing}
                                  className={getActionButtonStyle(action)}
                                  size="sm"
                                >
                                  {isProcessing ? (
                                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                  ) : action.type === "approve" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : action.type === "reject" ? (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Eye className="w-3 h-3 mr-1" />
                                  )}
                                  {action.label}
                                </Button>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showInline && notifications.length >= maxItems && (
        <div className="text-center pt-4">
          <Button variant="outline" size="sm">
            View All Suggestions
          </Button>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
