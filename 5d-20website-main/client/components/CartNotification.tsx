import { useState, useEffect } from "react";
import { Check, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnhancedShoppingCartService, {
  CartNotification as CartNotificationType,
} from "@/services/EnhancedShoppingCartService";

interface CartNotificationProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  showCartSummary?: boolean;
  autoHideDelay?: number;
}

function CartNotification({
  position = "top-right",
  showCartSummary = false,
  autoHideDelay = 3000,
}: CartNotificationProps) {
  const [notifications, setNotifications] = useState<CartNotificationType[]>(
    [],
  );
  const [cartSummary, setCartSummary] = useState(
    EnhancedShoppingCartService.getCartSummary(),
  );

  useEffect(() => {
    // Subscribe to cart notifications
    const unsubscribe = EnhancedShoppingCartService.onNotification(
      (notification) => {
        setNotifications((prev) => [...prev, notification]);
        setCartSummary(EnhancedShoppingCartService.getCartSummary());

        // Auto-hide notification
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notification.id),
          );
        }, autoHideDelay);
      },
    );

    // Load initial cart summary
    setCartSummary(EnhancedShoppingCartService.getCartSummary());

    return unsubscribe;
  }, [autoHideDelay]);

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-right":
      default:
        return "top-4 right-4";
    }
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: CartNotificationType["type"]) => {
    switch (type) {
      case "add":
        return <Check className="w-4 h-4 text-green-600" />;
      case "remove":
        return <X className="w-4 h-4 text-red-600" />;
      case "update":
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case "clear":
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <ShoppingCart className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: CartNotificationType["type"]) => {
    switch (type) {
      case "add":
        return "bg-green-500 border-green-600";
      case "remove":
        return "bg-red-500 border-red-600";
      case "update":
        return "bg-blue-500 border-blue-600";
      case "clear":
        return "bg-red-500 border-red-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  if (notifications.length === 0 && !showCartSummary) {
    return null;
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-2 max-w-sm`}>
      {/* Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationColor(notification.type)} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 animate-in slide-in-from-right`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                {notification.items.length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs opacity-90">
                      Total: {notification.totalItems} items ($
                      {notification.totalValue.toFixed(2)})
                    </p>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
              onClick={() => dismissNotification(notification.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Show first item if available */}
          {notification.items.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <div className="flex items-center space-x-2">
                <img
                  src={notification.items[0].image}
                  alt={notification.items[0].name}
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {notification.items[0].name}
                  </p>
                  <p className="text-xs opacity-75">
                    ${notification.items[0].price} x{" "}
                    {notification.items[0].quantity}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Cart Summary (if enabled) */}
      {showCartSummary && !cartSummary.isEmpty && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart Summary
            </h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items:</span>
              <span className="font-medium">{cartSummary.totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-green-600">
                ${cartSummary.totalValue.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <Button size="sm" className="flex-1 text-xs">
              View Cart
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartNotification;
