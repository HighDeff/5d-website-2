import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Eye, Activity, AlertTriangle } from "lucide-react";
import AINavigationDashboard from "./AINavigationDashboard";
import AINavigationWatcher from "../services/AINavigationWatcher";

const AINavigationToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    // Update counts every 3 seconds
    const updateCounts = () => {
      const analytics = AINavigationWatcher.getAnalytics();
      const newEventCount = analytics.totalEvents;
      const newErrorCount = analytics.commonErrors.reduce(
        (sum, error) => sum + error.count,
        0,
      );

      // Blink if new events detected
      if (newEventCount > eventCount || newErrorCount > errorCount) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 1000);
      }

      setEventCount(newEventCount);
      setErrorCount(newErrorCount);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 3000);

    return () => clearInterval(interval);
  }, [eventCount, errorCount]);

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
            isBlinking ? "animate-pulse" : ""
          } ${
            errorCount > 0
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          title="Open AI Navigation Watcher"
        >
          <Eye className="h-6 w-6" />
        </Button>

        {/* Event Counter Badge */}
        {eventCount > 0 && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 min-w-[24px] h-6 flex items-center justify-center text-xs font-bold"
          >
            {eventCount > 999 ? "999+" : eventCount}
          </Badge>
        )}

        {/* Error Indicator */}
        {errorCount > 0 && (
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Dashboard Modal */}
      <AINavigationDashboard isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AINavigationToggle;
