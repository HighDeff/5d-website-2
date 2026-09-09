import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Search, Smartphone } from "lucide-react";
import ShoppingCart from "@/components/ShoppingCart";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import AIConnectionStatus from "@/components/AIConnectionStatus";

interface NavigationProps {
  onShowMobileMenu: () => void;
  onShowMobileApp: () => void;
}

export default function Navigation({
  onShowMobileMenu,
  onShowMobileApp,
}: NavigationProps) {
  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  return (
    <nav className="border-b border-border/10 bg-white/20 backdrop-blur-md supports-[backdrop-filter]:bg-white/15 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              LILLY'S
            </h1>
            <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
              <Link
                to="/collections"
                className="hover:text-primary transition-colors"
              >
                COLLECTIONS
              </Link>
              <Link
                to="/canvas-control"
                className="hover:text-primary transition-colors"
              >
                CANVAS
              </Link>
              <Link
                to="/ai-notifications"
                className="hover:text-primary transition-colors"
              >
                AI ALERTS
              </Link>
              <Link
                to="/popups-modals"
                className="hover:text-primary transition-colors"
              >
                POPUPS
              </Link>
              <Link
                to="/quantumpass-model"
                className="hover:text-primary transition-colors"
              >
                QUANTUM AI
              </Link>
              <Link
                to="/AIManagementHub"
                className="hover:text-primary transition-colors"
              >
                AI HUB
              </Link>
              <Link
                to="/about"
                className="hover:text-primary transition-colors"
              >
                ABOUT
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary transition-colors"
              >
                CONTACT
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <AIConnectionStatus className="hidden lg:flex" />
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <ShoppingCart
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={handleCheckout}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowMobileMenu}
              title="Open Menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowMobileApp}
              title="Open Mobile App"
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-xs ml-1">Mobile</span>
            </Button>
            <Button size="sm" className="hidden lg:inline-flex">
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
