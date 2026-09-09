// Notification Bell Component - Shows unread notification count and dropdown
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  BellRing,
  Brain,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";
import UserNotificationService, {
  UserNotification,
} from "@/services/UserNotificationService";

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const { user } = useUserAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Load initial notifications
    loadNotifications();

    // Subscribe to notification updates
    const unsubscribe = UserNotificationService.subscribe(() => {
      loadNotifications();
    });

    return unsubscribe;
  }, [user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = () => {
    if (!user?.id) return;

    const userNotifications = UserNotificationService.getUserNotifications(
      user.id,
    );
    const recentNotifications = userNotifications.slice(0, 5); // Show only 5 in dropdown
    const unread = UserNotificationService.getUnreadCount(user.id);

    setNotifications(recentNotifications);
    setUnreadCount(unread);
  };

  const handleNotificationClick = (notification: UserNotification) => {
    if (!notification.read) {
      UserNotificationService.markAsRead(notification.id);
    }
  };

  const handleAction = async (notificationId: string, actionId: string) => {
    await UserNotificationService.handleAction(notificationId, actionId);
    setIsOpen(false); // Close dropdown after action
  };

  const markAllAsRead = () => {
    if (user?.id) {
      UserNotificationService.markAllAsRead(user.id);
    }
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 text-purple-600" />
        ) : (
          <Bell className="w-5 h-5 text-gray-600" />
        )}

        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 px-1 py-0 text-xs min-w-[18px] h-[18px] flex items-center justify-center bg-red-500"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] z-50">
          <Card className="shadow-lg border border-gray-200">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? "bg-purple-50/50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {notification.type === "ai-suggestion" ? (
                            <Brain className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Bell className="w-4 h-4 text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-800 truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full ml-2 flex-shrink-0"></div>
                            )}
                          </div>

                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleDateString()}
                            </span>

                            {notification.actions &&
                              notification.actions.length > 0 && (
                                <div className="flex space-x-1">
                                  {notification.actions
                                    .slice(0, 2)
                                    .map((action) => (
                                      <Button
                                        key={action.id}
                                        size="sm"
                                        variant={
                                          action.style === "primary"
                                            ? "default"
                                            : "outline"
                                        }
                                        className="text-xs px-2 py-1 h-6"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAction(
                                            notification.id,
                                            action.id,
                                          );
                                        }}
                                      >
                                        {action.type === "approve" ? (
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                        ) : action.type === "reject" ? (
                                          <XCircle className="w-3 h-3 mr-1" />
                                        ) : (
                                          <Eye className="w-3 h-3 mr-1" />
                                        )}
                                        {action.label}
                                      </Button>
                                    ))}
                                  {notification.actions.length > 2 && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-xs px-1 py-1 h-6"
                                    >
                                      <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-purple-600 hover:text-purple-800"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page
                    window.location.href = "/notifications";
                  }}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
