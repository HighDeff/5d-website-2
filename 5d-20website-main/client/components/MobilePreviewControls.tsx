import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  X,
  Smartphone,
  Monitor,
  Tablet,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

interface MobilePreviewControlsProps {
  onExit?: () => void;
  onToggleView?: (view: "mobile" | "desktop" | "tablet") => void;
}

const MobilePreviewControls: React.FC<MobilePreviewControlsProps> = ({
  onExit,
  onToggleView,
}) => {
  const [currentView, setCurrentView] = useState<
    "mobile" | "desktop" | "tablet"
  >("desktop");
  const [isVisible, setIsVisible] = useState(true);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  useEffect(() => {
    // Check if we're in mobile preview mode
    const checkMobilePreview = () => {
      const isMobile = window.innerWidth <= 768;
      const isInIframe = window !== window.parent;
      const urlParams = new URLSearchParams(window.location.search);
      const hasMobileParam = urlParams.has("mobile");
      const hasSimulationParam = urlParams.has("simulation");
      const deviceParam = urlParams.get("device");

      setIsMobilePreview(
        isMobile || isInIframe || hasMobileParam || hasSimulationParam,
      );

      // Auto-set view based on URL parameters
      if (deviceParam === "mobile") {
        setCurrentView("mobile");
        handleViewChange("mobile");
      } else if (deviceParam === "tablet") {
        setCurrentView("tablet");
        handleViewChange("tablet");
      } else if (hasMobileParam && !deviceParam) {
        setCurrentView("mobile");
        handleViewChange("mobile");
      }
    };

    checkMobilePreview();
    window.addEventListener("resize", checkMobilePreview);

    return () => window.removeEventListener("resize", checkMobilePreview);
  }, []);

  const handleViewChange = (view: "mobile" | "desktop" | "tablet") => {
    setCurrentView(view);

    // Apply view styles to body
    const body = document.body;
    body.classList.remove("mobile-view", "tablet-view", "desktop-view");
    body.classList.add(`${view}-view`);

    // Update viewport meta tag for mobile
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      document.head.appendChild(viewport);
    }

    switch (view) {
      case "mobile":
        viewport.setAttribute(
          "content",
          "width=375, initial-scale=1, user-scalable=no",
        );
        break;
      case "tablet":
        viewport.setAttribute(
          "content",
          "width=768, initial-scale=1, user-scalable=yes",
        );
        break;
      case "desktop":
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1, user-scalable=yes",
        );
        break;
    }

    onToggleView?.(view);
  };

  const handleExit = () => {
    // Remove mobile preview classes
    document.body.classList.remove(
      "mobile-view",
      "tablet-view",
      "desktop-view",
    );

    // Reset viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, user-scalable=yes",
      );
    }

    // If in iframe, try to close or redirect parent
    if (window !== window.parent) {
      try {
        window.parent.postMessage({ type: "CLOSE_MOBILE_PREVIEW" }, "*");
        window.close();
      } catch (error) {
        // Fallback: redirect to main site
        window.location.href = window.location.origin;
      }
    } else {
      onExit?.();
    }
  };

  if (!isVisible) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm"
        onClick={() => setIsVisible(true)}
      >
        <Eye className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 z-50 bg-white/95 backdrop-blur-sm border shadow-lg">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Preview Controls
          </h3>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => setIsVisible(false)}
            >
              <EyeOff className="w-3 h-3" />
            </Button>
            {isMobilePreview && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                onClick={handleExit}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant={currentView === "mobile" ? "default" : "outline"}
            className="h-8 px-2"
            onClick={() => {
              handleViewChange("mobile");
              // Update URL to reflect mobile view
              const url = new URL(window.location.href);
              url.searchParams.set("device", "mobile");
              window.history.replaceState({}, "", url.toString());
            }}
          >
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile
          </Button>

          <Button
            size="sm"
            variant={currentView === "tablet" ? "default" : "outline"}
            className="h-8 px-2"
            onClick={() => {
              handleViewChange("tablet");
              // Update URL to reflect tablet view
              const url = new URL(window.location.href);
              url.searchParams.set("device", "tablet");
              window.history.replaceState({}, "", url.toString());
            }}
          >
            <Tablet className="w-3 h-3 mr-1" />
            Tablet
          </Button>

          <Button
            size="sm"
            variant={currentView === "desktop" ? "default" : "outline"}
            className="h-8 px-2"
            onClick={() => {
              handleViewChange("desktop");
              // Update URL to reflect desktop view
              const url = new URL(window.location.href);
              url.searchParams.delete("device");
              url.searchParams.delete("mobile");
              url.searchParams.delete("simulation");
              window.history.replaceState({}, "", url.toString());
            }}
          >
            <Monitor className="w-3 h-3 mr-1" />
            Desktop
          </Button>
        </div>

        {isMobilePreview && (
          <div className="mt-2 pt-2 border-t">
            <Button
              size="sm"
              variant="destructive"
              className="w-full h-8 text-xs"
              onClick={handleExit}
            >
              <X className="w-3 h-3 mr-1" />
              Exit Mobile Preview
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MobilePreviewControls;
