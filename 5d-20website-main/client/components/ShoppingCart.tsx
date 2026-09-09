import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
} from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (method: "paypal" | "cashapp") => void;
}

export default function ShoppingCart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleQuantityChange = (id: string, change: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === 0) {
        onRemoveItem(id);
      } else {
        onUpdateQuantity(id, newQuantity);
      }
    }
  };

  const handleCheckout = (method: "paypal" | "cashapp") => {
    onCheckout(method);
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Shopping Cart
            </SheetTitle>
            <SheetDescription>
              {cartItems.length === 0
                ? "Your cart is empty"
                : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your cart`}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8 flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm">
                  Add some beautiful items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain bg-gray-50 rounded-lg"
                          style={{
                            filter: "brightness(1) contrast(1) saturate(1)",
                            objectFit: "contain",
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                          <p className="font-bold text-primary">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 ml-2"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setShowCheckoutModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  <CreditCard className="mr-2 w-5 h-5" />
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartItems={cartItems}
        onCheckout={onCheckout}
      />
    </>
  );
}
