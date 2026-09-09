import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Smartphone,
  Heart,
  ShoppingCart,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface UpdateItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "failed";
  category: "mobile" | "favorites" | "cart" | "ai" | "general";
  details?: string[];
}

const UpdateSummaryNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const updates: UpdateItem[] = [
    {
      id: "mobile-preview",
      title: "Mobile Preview Controls",
      description: "Added exit button and device switching for mobile preview",
      status: "completed",
      category: "mobile",
      details: [
        "Mobile/Tablet/Desktop view switcher",
        "Exit mobile preview functionality",
        "Mobile simulator window controls",
        "Responsive preview frames",
      ],
    },
    {
      id: "home-cart-fix",
      title: "Home Page Cart & Buy Now",
      description: "Fixed add to cart and buy now functionality on home page",
      status: "completed",
      category: "cart",
      details: [
        "Enhanced cart service integration",
        "Buy now redirect to checkout",
        "Improved error handling",
        "Real-time cart notifications",
      ],
    },
    {
      id: "beauty-favorites",
      title: "Beauty Page Favorites",
      description: "Fixed favorites functionality on Beauty subcollection page",
      status: "completed",
      category: "favorites",
      details: [
        "Enhanced favorites manager integration",
        "Visual feedback for favorite state",
        "Database synchronization",
        "Error handling and notifications",
      ],
    },
    {
      id: "favorites-page",
      title: "Comprehensive Favorites Page",
      description:
        "Enhanced favorites page with per-item management and database integration",
      status: "completed",
      category: "favorites",
      details: [
        "Search and filter favorites",
        "Category-based organization",
        "Quick view and cart actions",
        "Status tracking (active/removed)",
        "Enhanced database integration",
      ],
    },
    {
      id: "ai-backup-system",
      title: "AI Auto-Fix Backup & Retry System",
      description:
        "Enhanced AI auto-fix with backup, retry logic, and AI collaboration",
      status: "completed",
      category: "ai",
      details: [
        "Comprehensive backup before fixes",
        "Multi-attempt retry with different methods",
        "AI collaboration and suggestions",
        "Human escalation when AI attempts fail",
        "Enhanced error detection and recovery",
      ],
    },
    {
      id: "ai-collaboration",
      title: "AI Inter-Communication",
      description:
        "AIs now communicate, share backups, and collaborate on fixes",
      status: "completed",
      category: "ai",
      details: [
        "Real-time AI messaging system",
        "Collaborative problem solving",
        "Backup sharing between AIs",
        "Alternative method suggestions",
        "Coordinated retry attempts",
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "favorites":
        return <Heart className="w-4 h-4" />;
      case "cart":
        return <ShoppingCart className="w-4 h-4" />;
      case "ai":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mobile":
        return "bg-blue-100 text-blue-800";
      case "favorites":
        return "bg-red-100 text-red-800";
      case "cart":
        return "bg-green-100 text-green-800";
      case "ai":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedCount = updates.filter((u) => u.status === "completed").length;
  const totalCount = updates.length;

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-50 max-w-md">
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              System Updates Complete
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {completedCount}/{totalCount} updates successfully applied
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">
            {updates.slice(0, isExpanded ? updates.length : 3).map((update) => (
              <div
                key={update.id}
                className="flex items-start gap-3 p-2 rounded-lg bg-gray-50"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(update.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getCategoryColor(update.category)}`}
                    >
                      {getCategoryIcon(update.category)}
                      <span className="ml-1">{update.category}</span>
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm text-gray-900">
                    {update.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {update.description}
                  </p>
                  {isExpanded && update.details && (
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                      {update.details.map((detail, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {updates.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-3 text-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Show All ({updates.length - 3} more)
                </>
              )}
            </Button>
          )}

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>All systems operational</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                Ready for use
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateSummaryNotification;
