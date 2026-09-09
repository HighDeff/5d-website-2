// User Notification Service - Manages AI suggestions and user communications
import AIContentAnalyzer, { AISuggestion } from "./AIContentAnalyzer";

export interface UserNotification {
  id: string;
  userId: string;
  type: "ai-suggestion" | "system" | "warning" | "info";
  title: string;
  message: string;
  data?: any;
  read: boolean;
  actionRequired: boolean;
  actions?: NotificationAction[];
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: "approve" | "reject" | "view" | "custom";
  style: "primary" | "secondary" | "danger" | "success";
  data?: any;
}

class UserNotificationService {
  private notifications: UserNotification[] = [];
  private listeners: Set<(notifications: UserNotification[]) => void> =
    new Set();

  constructor() {
    this.loadNotifications();
    this.startAISuggestionMonitoring();
  }

  // Create notification from AI suggestion
  createAISuggestionNotification(suggestion: AISuggestion): UserNotification {
    const baseNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: suggestion.userId,
      type: "ai-suggestion" as const,
      data: { suggestionId: suggestion.id, suggestionData: suggestion.data },
      read: false,
      actionRequired: true,
      priority: this.mapImpactToPriority(suggestion.impact),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    switch (suggestion.type) {
      case "category":
        return {
          ...baseNotification,
          title: "🤖 Category Update Suggested",
          message: suggestion.description,
          actions: [
            {
              id: "approve-category",
              label: "Apply Change",
              type: "approve",
              style: "primary",
              data: { suggestionId: suggestion.id },
            },
            {
              id: "reject-category",
              label: "Keep Current",
              type: "reject",
              style: "secondary",
              data: { suggestionId: suggestion.id },
            },
            {
              id: "view-details",
              label: "View Details",
              type: "view",
              style: "secondary",
              data: { suggestionId: suggestion.id },
            },
          ],
        };

      case "duplicate":
        return {
          ...baseNotification,
          title: "🔍 Duplicate Items Detected",
          message: suggestion.description,
          priority: "medium",
          actions: [
            {
              id: "review-duplicates",
              label: "Review Duplicates",
              type: "view",
              style: "primary",
              data: { suggestionId: suggestion.id },
            },
            {
              id: "ignore-duplicates",
              label: "Ignore",
              type: "reject",
              style: "secondary",
              data: { suggestionId: suggestion.id },
            },
          ],
        };

      case "enhancement":
        return {
          ...baseNotification,
          title: "✨ Enhancement Available",
          message: suggestion.description,
          actions: suggestion.autoApplicable
            ? [
                {
                  id: "auto-apply",
                  label: "Apply Improvements",
                  type: "approve",
                  style: "success",
                  data: { suggestionId: suggestion.id },
                },
                {
                  id: "review-first",
                  label: "Review First",
                  type: "view",
                  style: "secondary",
                  data: { suggestionId: suggestion.id },
                },
              ]
            : [
                {
                  id: "review-enhancement",
                  label: "Review Changes",
                  type: "view",
                  style: "primary",
                  data: { suggestionId: suggestion.id },
                },
                {
                  id: "reject-enhancement",
                  label: "No Thanks",
                  type: "reject",
                  style: "secondary",
                  data: { suggestionId: suggestion.id },
                },
              ],
        };

      case "collection-move":
        return {
          ...baseNotification,
          title: "📁 Collection Organization Suggested",
          message: suggestion.description,
          actions: [
            {
              id: "approve-move",
              label: "Move Items",
              type: "approve",
              style: "primary",
              data: { suggestionId: suggestion.id },
            },
            {
              id: "reject-move",
              label: "Keep Current",
              type: "reject",
              style: "secondary",
              data: { suggestionId: suggestion.id },
            },
          ],
        };

      default:
        return {
          ...baseNotification,
          title: "🤖 AI Suggestion",
          message: suggestion.description,
          actions: [
            {
              id: "review-suggestion",
              label: "Review",
              type: "view",
              style: "primary",
              data: { suggestionId: suggestion.id },
            },
          ],
        };
    }
  }

  // Create system notifications
  createSystemNotification(
    userId: string,
    title: string,
    message: string,
    priority: "low" | "medium" | "high" | "urgent" = "medium",
    data?: any,
  ): UserNotification {
    const notification: UserNotification = {
      id: `system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: "system",
      title,
      message,
      data,
      read: false,
      actionRequired: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    this.addNotification(notification);
    return notification;
  }

  // Add notification and notify listeners
  addNotification(notification: UserNotification): void {
    this.notifications.unshift(notification); // Add to beginning
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get notifications for user
  getUserNotifications(userId: string): UserNotification[] {
    return this.notifications
      .filter((n) => n.userId === userId && !this.isExpired(n))
      .sort((a, b) => {
        // Sort by priority then by date
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority];
        const bPriority = priorityOrder[b.priority];

        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }

  // Get unread count
  getUnreadCount(userId: string): number {
    return this.getUserNotifications(userId).filter((n) => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read for user
  markAllAsRead(userId: string): void {
    this.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    this.saveNotifications();
    this.notifyListeners();
  }

  // Handle notification action
  async handleAction(
    notificationId: string,
    actionId: string,
  ): Promise<boolean> {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (!notification) return false;

    const action = notification.actions?.find((a) => a.id === actionId);
    if (!action) return false;

    try {
      switch (action.type) {
        case "approve":
          if (
            notification.type === "ai-suggestion" &&
            notification.data?.suggestionId
          ) {
            await AIContentAnalyzer.applySuggestion(
              notification.data.suggestionId,
              true,
            );
            this.createSystemNotification(
              notification.userId,
              "✅ Change Applied",
              "AI suggestion has been successfully applied to your items.",
              "low",
            );
          }
          break;

        case "reject":
          if (
            notification.type === "ai-suggestion" &&
            notification.data?.suggestionId
          ) {
            await AIContentAnalyzer.applySuggestion(
              notification.data.suggestionId,
              false,
            );
          }
          break;

        case "view":
          // Handle view actions (usually handled by UI)
          this.markAsRead(notificationId);
          return true;

        case "custom":
          // Handle custom actions based on action data
          break;
      }

      // Remove the notification after handling
      this.removeNotification(notificationId);
      return true;
    } catch (error) {
      console.error("Error handling notification action:", error);
      this.createSystemNotification(
        notification.userId,
        "❌ Action Failed",
        "Failed to process your request. Please try again.",
        "high",
      );
      return false;
    }
  }

  // Remove notification
  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId,
    );
    this.saveNotifications();
    this.notifyListeners();
  }

  // Subscribe to notification updates
  subscribe(callback: (notifications: UserNotification[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Monitor AI suggestions and create notifications
  private startAISuggestionMonitoring(): void {
    // Check for new AI suggestions every 5 minutes
    setInterval(
      () => {
        this.checkForNewAISuggestions();
      },
      5 * 60 * 1000,
    );

    // Initial check
    setTimeout(() => this.checkForNewAISuggestions(), 5000);
  }

  private checkForNewAISuggestions(): void {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      users.forEach((user: any) => {
        const userSuggestions = AIContentAnalyzer.getUserSuggestions(user.id);
        const existingNotificationSuggestions = this.notifications
          .filter(
            (n) =>
              n.userId === user.id &&
              n.type === "ai-suggestion" &&
              n.data?.suggestionId,
          )
          .map((n) => n.data.suggestionId);

        userSuggestions.forEach((suggestion) => {
          if (!existingNotificationSuggestions.includes(suggestion.id)) {
            const notification =
              this.createAISuggestionNotification(suggestion);
            this.addNotification(notification);
          }
        });
      });
    } catch (error) {
      console.error("Error checking for AI suggestions:", error);
    }
  }

  // Utility methods
  private mapImpactToPriority(
    impact: "low" | "medium" | "high",
  ): "low" | "medium" | "high" | "urgent" {
    const mapping = {
      low: "low" as const,
      medium: "medium" as const,
      high: "high" as const,
    };
    return mapping[impact];
  }

  private isExpired(notification: UserNotification): boolean {
    if (!notification.expiresAt) return false;
    return new Date(notification.expiresAt).getTime() < Date.now();
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback([...this.notifications]);
      } catch (error) {
        console.error("Error notifying notification listener:", error);
      }
    });
  }

  private loadNotifications(): void {
    try {
      const saved = localStorage.getItem("userNotifications");
      if (saved) {
        this.notifications = JSON.parse(saved);
        // Clean up expired notifications
        this.notifications = this.notifications.filter(
          (n) => !this.isExpired(n),
        );
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      this.notifications = [];
    }
  }

  private saveNotifications(): void {
    try {
      // Keep only last 100 notifications
      const toSave = this.notifications.slice(0, 100);
      localStorage.setItem("userNotifications", JSON.stringify(toSave));
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  }

  // Cleanup expired notifications
  cleanup(): void {
    const originalLength = this.notifications.length;
    this.notifications = this.notifications.filter((n) => !this.isExpired(n));

    if (this.notifications.length !== originalLength) {
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Static methods for backward compatibility
  static createSystemNotification(
    userId: string,
    title: string,
    message: string,
    priority: "low" | "medium" | "high" | "urgent" = "medium",
    data?: any,
    expiresAt?: string,
  ): void {
    userNotificationServiceInstance.createSystemNotification(
      userId,
      title,
      message,
      priority,
      data,
      expiresAt,
    );
  }

  static getUserNotifications(userId: string): UserNotification[] {
    return userNotificationServiceInstance.getUserNotifications(userId);
  }

  static handleNotificationAction(
    notificationId: string,
    actionId: string,
  ): Promise<boolean> {
    return userNotificationServiceInstance.handleNotificationAction(
      notificationId,
      actionId,
    );
  }

  static markAsRead(notificationId: string): void {
    userNotificationServiceInstance.markAsRead(notificationId);
  }

  static subscribe(
    callback: (notifications: UserNotification[]) => void,
  ): () => void {
    return userNotificationServiceInstance.subscribe(callback);
  }
}

// Create singleton instance
const userNotificationServiceInstance = new UserNotificationService();

// Export singleton instance
export default userNotificationServiceInstance;
