// Sale Progress Tracker Component
// Displays real-time sale progress with timeline and automated actions

import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  DollarSign,
  X,
  ArrowRight,
  Settings,
  Eye,
  MapPin,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EnhancedAIService, {
  SaleProgress,
  SaleProgressEvent,
} from "../services/EnhancedAIService";

interface SaleProgressTrackerProps {
  progressId?: string;
  buyerId?: string;
  sellerId?: string;
  compact?: boolean;
}

const SaleProgressTracker: React.FC<SaleProgressTrackerProps> = ({
  progressId,
  buyerId,
  sellerId,
  compact = false,
}) => {
  const [progresses, setProgresses] = useState<SaleProgress[]>([]);
  const [selectedProgress, setSelectedProgress] = useState<SaleProgress | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const enhancedAI = EnhancedAIService.getInstance();

  useEffect(() => {
    loadProgresses();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadProgresses, 30000);
    return () => clearInterval(interval);
  }, [progressId, buyerId, sellerId]);

  const loadProgresses = async () => {
    try {
      if (progressId) {
        const progress = await enhancedAI.getSaleProgress(progressId);
        if (progress) {
          setProgresses([progress]);
          setSelectedProgress(progress);
        }
      } else {
        const allProgresses = await enhancedAI.getAllSaleProgresses();
        let filtered = allProgresses;

        if (buyerId) {
          filtered = allProgresses.filter((p) => p.buyerId === buyerId);
        } else if (sellerId) {
          filtered = allProgresses.filter((p) => p.sellerId === sellerId);
        }

        setProgresses(filtered);
        if (filtered.length > 0 && !selectedProgress) {
          setSelectedProgress(filtered[0]);
        }
      }
    } catch (error) {
      console.error("Failed to load sale progresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: SaleProgress["status"]) => {
    switch (status) {
      case "auto_shipped":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: Truck,
          progress: 60,
          message: "Package automatically processed and shipped",
        };
      case "please_ship":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: Package,
          progress: 20,
          message: "Please ship your item within 7 days",
        };
      case "shipping_in_progress":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: Truck,
          progress: 70,
          message: "Package is on its way to the buyer",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          progress: 100,
          message: "Order completed successfully",
        };
      case "waiting_for_refund":
        return {
          color: "bg-orange-100 text-orange-800",
          icon: DollarSign,
          progress: 30,
          message: "Refund request being processed",
        };
      case "canceled":
        return {
          color: "bg-red-100 text-red-800",
          icon: X,
          progress: 0,
          message: "Order has been canceled",
        };
      case "settled":
        return {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          progress: 100,
          message: "Payment settled successfully",
        };
      case "reversed":
        return {
          color: "bg-red-100 text-red-800",
          icon: RefreshCw,
          progress: 0,
          message: "Payment reversed",
        };
      case "dismissed":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: X,
          progress: 0,
          message: "Case dismissed",
        };
      case "illegal":
        return {
          color: "bg-red-100 text-red-800",
          icon: AlertTriangle,
          progress: 0,
          message: "Flagged for illegal activity",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          progress: 0,
          message: "Status unknown",
        };
    }
  };

  const formatTimelineEvent = (event: SaleProgressEvent) => {
    return {
      ...event,
      timeAgo: getTimeAgo(event.timestamp),
      icon: event.automated ? Settings : User,
    };
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - eventTime.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Card className={compact ? "w-full" : ""}>
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading sale progress...</p>
        </CardContent>
      </Card>
    );
  }

  if (compact && selectedProgress) {
    const statusInfo = getStatusInfo(selectedProgress.status);
    const Icon = statusInfo.icon;

    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-sm">
                  {selectedProgress.itemName}
                </div>
                <div className="text-xs text-gray-600">
                  ${selectedProgress.amount.toFixed(2)}
                </div>
              </div>
            </div>
            <Badge className={statusInfo.color}>
              {selectedProgress.status.replace("_", " ")}
            </Badge>
          </div>
          <Progress value={statusInfo.progress} className="mt-3" />
          <div className="text-xs text-gray-600 mt-2">{statusInfo.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sale Progress ({progresses.length})</span>
              <Button variant="outline" size="sm" onClick={loadProgresses}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {progresses.map((progress) => {
                const statusInfo = getStatusInfo(progress.status);
                const Icon = statusInfo.icon;

                return (
                  <div
                    key={progress.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProgress?.id === progress.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedProgress(progress)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm">
                          {progress.itemName}
                        </span>
                      </div>
                      <Badge className={statusInfo.color}>
                        {progress.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      ${progress.amount.toFixed(2)} • Order #
                      {progress.orderId.slice(-8)}
                    </div>

                    <Progress value={statusInfo.progress} className="mb-2" />

                    <div className="text-xs text-gray-500">
                      {statusInfo.message}
                    </div>

                    {progress.estimatedDelivery && (
                      <div className="text-xs text-blue-600 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Est. delivery:{" "}
                        {new Date(
                          progress.estimatedDelivery,
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}

              {progresses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No sale progress to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Details */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProgress ? (
              <div className="space-y-4">
                {/* Header Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      {selectedProgress.itemName}
                    </h3>
                    <span className="text-lg font-bold text-green-600">
                      ${selectedProgress.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Order: #{selectedProgress.orderId}</div>
                    <div>
                      Created:{" "}
                      {new Date(selectedProgress.createdAt).toLocaleString()}
                    </div>
                    {selectedProgress.trackingNumber && (
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Tracking: {selectedProgress.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Progress */}
                <div>
                  <h4 className="font-semibold mb-2">Current Status</h4>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      {React.createElement(
                        getStatusInfo(selectedProgress.status).icon,
                        {
                          className: "w-5 h-5 text-blue-600",
                        },
                      )}
                      <Badge
                        className={getStatusInfo(selectedProgress.status).color}
                      >
                        {selectedProgress.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <Progress
                      value={getStatusInfo(selectedProgress.status).progress}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-700">
                      {getStatusInfo(selectedProgress.status).message}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedProgress.timeline
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime(),
                      )
                      .map((event) => {
                        const formattedEvent = formatTimelineEvent(event);
                        const EventIcon = formattedEvent.icon;

                        return (
                          <div
                            key={event.id}
                            className="flex items-start space-x-3 p-2 bg-gray-50 rounded"
                          >
                            <EventIcon className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {event.message}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center space-x-2">
                                <span>{formattedEvent.timeAgo}</span>
                                {event.automated && (
                                  <Badge variant="outline" className="text-xs">
                                    Automated
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Automated Actions */}
                {selectedProgress.autoActions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Scheduled Actions</h4>
                    <div className="space-y-2">
                      {selectedProgress.autoActions.map((action, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${action.executed ? "bg-green-500" : "bg-yellow-500"}`}
                            />
                            <span className="capitalize">
                              {action.type.replace("_", " ")}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {action.executed
                              ? "Executed"
                              : new Date(action.scheduledAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Track Package
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Select a sale progress to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaleProgressTracker;
