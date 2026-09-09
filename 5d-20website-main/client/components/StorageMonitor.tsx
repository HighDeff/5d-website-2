import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  HardDrive,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface StorageStats {
  used: number;
  available: number;
  percentage: number;
  items: number;
  largestItems: { key: string; size: number }[];
}

interface StorageMonitorProps {
  className?: string;
}

const StorageMonitor: React.FC<StorageMonitorProps> = ({ className = "" }) => {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<Date | null>(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const { default: LocalStorageManager } = await import(
        "../services/LocalStorageManager"
      );
      const manager = LocalStorageManager.getInstance();
      const currentStats = manager.getStorageStats();
      setStats(currentStats);
    } catch (error) {
      console.error("Error loading storage stats:", error);
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      const { default: LocalStorageManager } = await import(
        "../services/LocalStorageManager"
      );
      const manager = LocalStorageManager.getInstance();
      manager.performMaintenance();
      setLastCleanup(new Date());

      // Reload stats after cleanup
      setTimeout(() => {
        loadStats();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error performing cleanup:", error);
      setIsLoading(false);
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage > 90) return "text-red-600";
    if (percentage > 80) return "text-yellow-600";
    return "text-green-600";
  };

  const getUsageIcon = (percentage: number) => {
    if (percentage > 90) return <AlertTriangle className="w-4 h-4" />;
    if (percentage > 80) return <Info className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!stats) {
    return (
      <div className={`${className}`}>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <HardDrive className="w-4 h-4" />
              <span className="text-sm">Loading storage stats...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <span className="text-lg text-blue-800">Storage Monitor</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadStats}
              className="text-blue-600 border-blue-300"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Usage Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Storage Usage
              </span>
              <div className="flex items-center space-x-2">
                <div className={getUsageColor(stats.percentage)}>
                  {getUsageIcon(stats.percentage)}
                </div>
                <span
                  className={`text-sm font-bold ${getUsageColor(stats.percentage)}`}
                >
                  {stats.percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <Progress
              value={stats.percentage}
              className="h-2"
              style={{
                backgroundColor:
                  stats.percentage > 90
                    ? "#fef2f2"
                    : stats.percentage > 80
                      ? "#fffbeb"
                      : "#f0fdf4",
              }}
            />

            <div className="flex justify-between text-xs text-gray-600">
              <span>{formatBytes(stats.used)} used</span>
              <span>{formatBytes(stats.available)} available</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-800">
                  {stats.items}
                </div>
                <div className="text-xs text-blue-600">Total Items</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-800">
                  {formatBytes(stats.used)}
                </div>
                <div className="text-xs text-blue-600">Used Space</div>
              </div>
            </div>
          </div>

          {/* Largest Items */}
          <div>
            <div className="text-sm font-medium text-blue-800 mb-2">
              Largest Items:
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {stats.largestItems.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white rounded p-2 border border-blue-100"
                >
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {item.key}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {formatBytes(item.size)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleCleanup}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Cleaning..." : "Perform Cleanup"}
            </Button>

            {lastCleanup && (
              <div className="text-xs text-center text-gray-500">
                Last cleanup: {lastCleanup.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Warning Messages */}
          {stats.percentage > 90 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Critical: Storage almost full!
                </span>
              </div>
              <div className="text-xs text-red-500 mt-1">
                Automatic cleanup will run to prevent quota exceeded errors.
              </div>
            </div>
          )}

          {stats.percentage > 80 && stats.percentage <= 90 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-yellow-600">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Warning: High storage usage
                </span>
              </div>
              <div className="text-xs text-yellow-500 mt-1">
                Consider performing cleanup to free up space.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageMonitor;
