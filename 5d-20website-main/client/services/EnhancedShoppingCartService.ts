// Enhanced Shopping Cart Service - Handles cart operations with notifications and validation
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sellerId?: string;
  sellerName?: string;
  quantity: number;
  addedAt: string;
}

export interface CartNotification {
  id: string;
  type: "add" | "remove" | "update" | "clear";
  message: string;
  timestamp: string;
  items: CartItem[];
  totalItems: number;
  totalValue: number;
}

class EnhancedShoppingCartService {
  private cartItems: CartItem[] = [];
  private notifications: CartNotification[] = [];
  private notificationCallbacks: Array<
    (notification: CartNotification) => void
  > = [];

  constructor() {
    this.loadCart();
  }

  /**
   * Add item to cart with notification
   */
  addToCart(item: Omit<CartItem, "quantity" | "addedAt">): CartNotification {
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem.id === item.id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem: CartItem = {
        ...item,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };
      this.cartItems.push(newItem);
    }

    this.saveCart();

    const notification = this.createNotification(
      "add",
      `${item.name} added to cart`,
      [existingItem || this.cartItems[this.cartItems.length - 1]],
    );

    this.triggerNotification(notification);
    return notification;
  }

  /**
   * Remove item from cart
   */
  removeFromCart(itemId: string): CartNotification {
    const itemIndex = this.cartItems.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    const removedItem = this.cartItems[itemIndex];
    this.cartItems.splice(itemIndex, 1);
    this.saveCart();

    const notification = this.createNotification(
      "remove",
      `${removedItem.name} removed from cart`,
      [removedItem],
    );

    this.triggerNotification(notification);
    return notification;
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: string, quantity: number): CartNotification {
    const item = this.cartItems.find((cartItem) => cartItem.id === itemId);

    if (!item) {
      throw new Error("Item not found in cart");
    }

    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    const oldQuantity = item.quantity;
    item.quantity = quantity;
    this.saveCart();

    const notification = this.createNotification(
      "update",
      `${item.name} quantity updated from ${oldQuantity} to ${quantity}`,
      [item],
    );

    this.triggerNotification(notification);
    return notification;
  }

  /**
   * Clear entire cart
   */
  clearCart(): CartNotification {
    const clearedItems = [...this.cartItems];
    this.cartItems = [];
    this.saveCart();

    const notification = this.createNotification(
      "clear",
      "Cart cleared",
      clearedItems,
    );

    this.triggerNotification(notification);
    return notification;
  }

  /**
   * Get cart items
   */
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  /**
   * Get cart summary
   */
  getCartSummary() {
    const totalItems = this.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalValue = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const uniqueItems = this.cartItems.length;

    return {
      totalItems,
      totalValue,
      uniqueItems,
      isEmpty: this.cartItems.length === 0,
    };
  }

  /**
   * Validate cart before checkout
   */
  validateCart(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (this.cartItems.length === 0) {
      errors.push("Cart is empty");
      return { isValid: false, errors, warnings };
    }

    // Check for invalid items
    this.cartItems.forEach((item) => {
      if (item.price <= 0) {
        errors.push(`${item.name} has invalid price`);
      }
      if (item.quantity <= 0) {
        errors.push(`${item.name} has invalid quantity`);
      }
      if (!item.name || item.name.trim() === "") {
        errors.push("Cart contains item with missing name");
      }
    });

    // Check for potential issues
    const totalValue = this.getCartSummary().totalValue;
    if (totalValue > 10000) {
      warnings.push("Large order value - please verify items");
    }

    if (this.cartItems.length > 20) {
      warnings.push("Large number of items - consider splitting order");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get cart by seller
   */
  getCartBySeller(): Record<string, CartItem[]> {
    return this.cartItems.reduce(
      (groups, item) => {
        const sellerId = item.sellerId || "unknown";
        if (!groups[sellerId]) {
          groups[sellerId] = [];
        }
        groups[sellerId].push(item);
        return groups;
      },
      {} as Record<string, CartItem[]>,
    );
  }

  /**
   * Subscribe to cart notifications
   */
  onNotification(
    callback: (notification: CartNotification) => void,
  ): () => void {
    this.notificationCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.notificationCallbacks.indexOf(callback);
      if (index > -1) {
        this.notificationCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get recent notifications
   */
  getRecentNotifications(limit: number = 10): CartNotification[] {
    return this.notifications.slice(-limit);
  }

  /**
   * Create notification object
   */
  private createNotification(
    type: CartNotification["type"],
    message: string,
    items: CartItem[],
  ): CartNotification {
    const summary = this.getCartSummary();

    const notification: CartNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      items: [...items],
      totalItems: summary.totalItems,
      totalValue: summary.totalValue,
    };

    this.notifications.push(notification);

    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(-50);
    }

    return notification;
  }

  /**
   * Trigger notification to all subscribers
   */
  private triggerNotification(notification: CartNotification): void {
    this.notificationCallbacks.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error("Error in cart notification callback:", error);
      }
    });
  }

  /**
   * Load cart from localStorage
   */
  private loadCart(): void {
    try {
      const saved = localStorage.getItem("enhancedShoppingCart");
      if (saved) {
        this.cartItems = JSON.parse(saved);
      }

      const savedNotifications = localStorage.getItem("cartNotifications");
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      this.cartItems = [];
      this.notifications = [];
    }
  }

  /**
   * Save cart to localStorage
   */
  private saveCart(): void {
    try {
      localStorage.setItem(
        "enhancedShoppingCart",
        JSON.stringify(this.cartItems),
      );
      localStorage.setItem(
        "cartNotifications",
        JSON.stringify(this.notifications),
      );
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }

  /**
   * Get cart analytics
   */
  getCartAnalytics() {
    const categoryBreakdown = this.cartItems.reduce(
      (breakdown, item) => {
        const category = item.category || "Unknown";
        if (!breakdown[category]) {
          breakdown[category] = { items: 0, value: 0 };
        }
        breakdown[category].items += item.quantity;
        breakdown[category].value += item.price * item.quantity;
        return breakdown;
      },
      {} as Record<string, { items: number; value: number }>,
    );

    const sellerBreakdown = this.cartItems.reduce(
      (breakdown, item) => {
        const seller = item.sellerName || "Unknown Seller";
        if (!breakdown[seller]) {
          breakdown[seller] = { items: 0, value: 0 };
        }
        breakdown[seller].items += item.quantity;
        breakdown[seller].value += item.price * item.quantity;
        return breakdown;
      },
      {} as Record<string, { items: number; value: number }>,
    );

    return {
      summary: this.getCartSummary(),
      categoryBreakdown,
      sellerBreakdown,
      averageItemPrice:
        this.cartItems.length > 0
          ? this.getCartSummary().totalValue / this.getCartSummary().totalItems
          : 0,
      oldestItem:
        this.cartItems.length > 0
          ? this.cartItems.reduce((oldest, item) =>
              new Date(item.addedAt) < new Date(oldest.addedAt) ? item : oldest,
            )
          : null,
    };
  }
}

export default new EnhancedShoppingCartService();
