import { useState, useCallback, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export function useShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem("shoppingCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const handleCheckout = useCallback(
    (method: "paypal" | "cashapp", contactInfo?: any) => {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const tax = total * 0.08;
      const shipping = 9.99;
      const finalTotal = total + tax + shipping;

      // Create comprehensive order
      const orderData = {
        orderId: `ORDER-${Date.now()}`,
        items: cartItems,
        subtotal: total,
        tax,
        shipping,
        total: finalTotal,
        contactInfo,
        paymentMethod: method,
        timestamp: new Date().toISOString(),
        status: "pending",
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      existingOrders.push(orderData);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      if (method === "paypal") {
        // Real PayPal integration - replace with your actual PayPal business email
        const itemsList = cartItems
          .map((item) => `${item.name} (x${item.quantity})`)
          .join(", ");

        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=payments@lillysfashion.com&currency_code=USD&amount=${finalTotal.toFixed(2)}&item_name=Lilly's Fashion Order&item_number=${orderData.orderId}&return=${window.location.origin}/payment-success&cancel_return=${window.location.origin}/payment-cancelled`;

        window.open(paypalUrl, "_blank");
      } else if (method === "cashapp") {
        // Cash App integration - replace with your actual Cash App handle
        const cashAppUrl = `https://cash.app/$LillysFashion/${finalTotal.toFixed(2)}/${orderData.orderId}`;
        window.open(cashAppUrl, "_blank");
      }

      // Clear cart after checkout
      clearCart();

      // Show professional success notification
      const customerName = contactInfo
        ? `${contactInfo.firstName} ${contactInfo.lastName}`
        : "Customer";

      const successDiv = document.createElement("div");
      successDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; max-width: 400px;">
          <div style="font-weight: bold; margin-bottom: 8px;">✅ Order Placed Successfully!</div>
          <div style="font-size: 14px; opacity: 0.9;">Order #${orderData.orderId}</div>
          <div style="font-size: 14px; opacity: 0.9;">Total: $${finalTotal.toFixed(2)}</div>
          <div style="font-size: 12px; margin-top: 8px;">Thank you ${customerName}! Complete payment via ${method} to confirm your order.</div>
        </div>
      `;
      document.body.appendChild(successDiv.firstElementChild as Element);

      setTimeout(() => {
        const notification = document.body.lastElementChild;
        if (
          notification &&
          notification.textContent?.includes("Order Placed Successfully")
        ) {
          document.body.removeChild(notification);
        }
      }, 8000);
    },
    [cartItems, clearCart],
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    handleCheckout,
    cartCount,
    cartTotal,
  };
}
