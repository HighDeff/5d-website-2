// Product Update Messaging Service - Notify friends and customers about new products
import UserNotificationService from "./UserNotificationService";

export interface ProductUpdateMessage {
  id: string;
  senderId: string;
  senderName: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  messageType: "new_product" | "discount" | "restock" | "price_drop";
  message: string;
  discount?: {
    percentage: number;
    friendsOnly: boolean;
    validUntil: string;
  };
  recipients: string[]; // User IDs
  createdAt: string;
}

export interface UserConnection {
  userId: string;
  friendId: string;
  status: "pending" | "accepted" | "following";
  createdAt: string;
}

class ProductUpdateMessagingService {
  private messages: ProductUpdateMessage[] = [];
  private connections: UserConnection[] = [];

  constructor() {
    this.loadData();
  }

  // Send product update to friends and followers
  async sendProductUpdate(
    senderId: string,
    productId: string,
    productData: any,
    updateType: "new_product" | "discount" | "restock" | "price_drop",
    customMessage?: string,
    discount?: { percentage: number; friendsOnly: boolean; validUntil: string },
  ): Promise<boolean> {
    try {
      const senderInfo = this.getUserInfo(senderId);
      if (!senderInfo) return false;

      // Get recipient list (friends and followers)
      const recipients = this.getRecipients(
        senderId,
        discount?.friendsOnly || false,
      );

      // Create message
      const message: ProductUpdateMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId,
        senderName: senderInfo.name,
        productId,
        productName: productData.name,
        productPrice: productData.price,
        productImage: Array.isArray(productData.images)
          ? productData.images[0]
          : productData.images,
        messageType: updateType,
        message:
          customMessage ||
          this.generateDefaultMessage(updateType, productData, discount),
        discount,
        recipients,
        createdAt: new Date().toISOString(),
      };

      // Save message
      this.messages.push(message);
      this.saveMessages();

      // Send notifications to recipients
      await this.notifyRecipients(message);

      console.log(`📢 Product update sent to ${recipients.length} recipients`);
      return true;
    } catch (error) {
      console.error("Error sending product update:", error);
      return false;
    }
  }

  // Send bulk product updates (for CSV imports)
  async sendBulkProductUpdate(
    senderId: string,
    products: any[],
    customMessage?: string,
  ): Promise<boolean> {
    try {
      const senderInfo = this.getUserInfo(senderId);
      if (!senderInfo || products.length === 0) return false;

      const recipients = this.getRecipients(senderId, false);

      // Create bulk message
      const message: ProductUpdateMessage = {
        id: `bulk_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId,
        senderName: senderInfo.name,
        productId: "bulk",
        productName: `${products.length} New Products`,
        productPrice: 0,
        productImage: products[0]?.images?.[0] || "",
        messageType: "new_product",
        message:
          customMessage ||
          `${senderInfo.name} just added ${products.length} new products to their shop! Check them out now.`,
        recipients,
        createdAt: new Date().toISOString(),
      };

      this.messages.push(message);
      this.saveMessages();

      // Create notification for bulk update
      await this.notifyBulkUpdate(message, products);

      return true;
    } catch (error) {
      console.error("Error sending bulk product update:", error);
      return false;
    }
  }

  // Add friend/follow connection
  addConnection(
    userId: string,
    friendId: string,
    status: "pending" | "accepted" | "following" = "following",
  ): boolean {
    try {
      // Check if connection already exists
      const existingConnection = this.connections.find(
        (c) =>
          (c.userId === userId && c.friendId === friendId) ||
          (c.userId === friendId && c.friendId === userId),
      );

      if (existingConnection) {
        // Update status if needed
        existingConnection.status = status;
      } else {
        // Create new connection
        const connection: UserConnection = {
          userId,
          friendId,
          status,
          createdAt: new Date().toISOString(),
        };
        this.connections.push(connection);
      }

      this.saveConnections();
      return true;
    } catch (error) {
      console.error("Error adding connection:", error);
      return false;
    }
  }

  // Get user's friends and followers
  getUserConnections(userId: string): {
    friends: string[];
    followers: string[];
  } {
    const friends = this.connections
      .filter((c) => c.userId === userId && c.status === "accepted")
      .map((c) => c.friendId);

    const followers = this.connections
      .filter(
        (c) =>
          c.friendId === userId &&
          (c.status === "following" || c.status === "accepted"),
      )
      .map((c) => c.userId);

    return { friends, followers };
  }

  // Get messages for user
  getUserMessages(userId: string): ProductUpdateMessage[] {
    return this.messages
      .filter((m) => m.recipients.includes(userId))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 50); // Last 50 messages
  }

  // Get sent messages
  getSentMessages(userId: string): ProductUpdateMessage[] {
    return this.messages
      .filter((m) => m.senderId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  // Private helper methods
  private getUserInfo(userId: string): any {
    try {
      const users = JSON.parse(localStorage.getItem("allUsers") || "[]");
      return users.find((u: any) => u.id === userId);
    } catch {
      return null;
    }
  }

  private getRecipients(senderId: string, friendsOnly: boolean): string[] {
    const connections = this.getUserConnections(senderId);

    if (friendsOnly) {
      return connections.friends;
    } else {
      // Include both friends and followers
      return [...new Set([...connections.friends, ...connections.followers])];
    }
  }

  private generateDefaultMessage(
    updateType: string,
    productData: any,
    discount?: { percentage: number; friendsOnly: boolean; validUntil: string },
  ): string {
    switch (updateType) {
      case "new_product":
        return `Check out my new ${productData.category}: "${productData.name}" for $${productData.price}!`;
      case "discount":
        const discountText = discount ? ` ${discount.percentage}% off` : "";
        const audienceText = discount?.friendsOnly ? " for friends only" : "";
        return `Special${discountText} discount on "${productData.name}"${audienceText}! Get it now for $${productData.price}.`;
      case "restock":
        return `"${productData.name}" is back in stock! Don't miss out this time.`;
      case "price_drop":
        return `Price drop alert! "${productData.name}" is now only $${productData.price}!`;
      default:
        return `Check out "${productData.name}" in my shop!`;
    }
  }

  private async notifyRecipients(message: ProductUpdateMessage): Promise<void> {
    for (const recipientId of message.recipients) {
      let notificationTitle = "";
      let notificationMessage = "";

      switch (message.messageType) {
        case "new_product":
          notificationTitle = "🆕 New Product from Friend";
          notificationMessage = `${message.senderName} added: ${message.productName}`;
          break;
        case "discount":
          notificationTitle = "💰 Special Discount Available";
          notificationMessage = `${message.senderName} has a discount on ${message.productName}`;
          break;
        case "restock":
          notificationTitle = "📦 Product Restocked";
          notificationMessage = `${message.productName} is back in stock at ${message.senderName}'s shop`;
          break;
        case "price_drop":
          notificationTitle = "🔥 Price Drop Alert";
          notificationMessage = `${message.productName} price dropped at ${message.senderName}'s shop`;
          break;
      }

      UserNotificationService.createSystemNotification(
        recipientId,
        notificationTitle,
        notificationMessage,
        "medium",
        {
          type: "product_update",
          messageId: message.id,
          productId: message.productId,
          senderId: message.senderId,
          shopUrl: `/shop/${this.getUserInfo(message.senderId)?.username}`,
        },
      );
    }
  }

  private async notifyBulkUpdate(
    message: ProductUpdateMessage,
    products: any[],
  ): Promise<void> {
    for (const recipientId of message.recipients) {
      UserNotificationService.createSystemNotification(
        recipientId,
        "🛍️ Friend Added New Products",
        `${message.senderName} just added ${products.length} new items to their shop!`,
        "medium",
        {
          type: "bulk_product_update",
          messageId: message.id,
          senderId: message.senderId,
          productCount: products.length,
          shopUrl: `/shop/${this.getUserInfo(message.senderId)?.username}`,
        },
      );
    }
  }

  private loadData(): void {
    try {
      const savedMessages = localStorage.getItem("productUpdateMessages");
      if (savedMessages) {
        this.messages = JSON.parse(savedMessages);
      }

      const savedConnections = localStorage.getItem("userConnections");
      if (savedConnections) {
        this.connections = JSON.parse(savedConnections);
      }
    } catch (error) {
      console.error("Error loading messaging data:", error);
    }
  }

  private saveMessages(): void {
    try {
      // Keep only last 1000 messages to prevent storage overflow
      const messagesToSave = this.messages.slice(-1000);
      localStorage.setItem(
        "productUpdateMessages",
        JSON.stringify(messagesToSave),
      );
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  }

  private saveConnections(): void {
    try {
      localStorage.setItem("userConnections", JSON.stringify(this.connections));
    } catch (error) {
      console.error("Error saving connections:", error);
    }
  }
}

// Export singleton instance
export default new ProductUpdateMessagingService();
