import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Brain,
  Shield,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";

interface FavoritesStatusDisplayProps {
  userId?: string;
  showGlobalStats?: boolean;
}

const FavoritesStatusDisplay: React.FC<FavoritesStatusDisplayProps> = ({
  userId,
  showGlobalStats = false,
}) => {
  const [aiStatus, setAIStatus] = useState<any>({});
  const [syncStatus, setSyncStatus] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavoritesStatus();
  }, [userId]);

  const loadFavoritesStatus = async () => {
    try {
      setLoading(true);

      const { default: EnhancedFavoritesManager } = await import(
        "../services/EnhancedFavoritesManager"
      );

      // Get AI queue status
      const aiQueueStatus = EnhancedFavoritesManager.getAIQueueStatus();
      setAIStatus(aiQueueStatus);

      // Get sync status
      const syncStatusData = EnhancedFavoritesManager.getSyncStatus();
      setSyncStatus(syncStatusData);

      // Get user favorites if userId provided
      if (userId) {
        const groupedFavorites =
          EnhancedFavoritesManager.getUserFavorites(userId);
        setUserFavorites(groupedFavorites);
      }
    } catch (error) {
      console.error("Error loading favorites status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async (targetUserId: string) => {
    try {
      const { default: EnhancedFavoritesManager } = await import(
        "../services/EnhancedFavoritesManager"
      );

      const success =
        await EnhancedFavoritesManager.forceSyncUser(targetUserId);
      if (success) {
        alert(`Force sync completed for user ${targetUserId}`);
        loadFavoritesStatus();
      } else {
        alert(`Force sync failed for user ${targetUserId}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading favorites status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <Brain className="w-4 h-4 mr-2 text-purple-600" />
            AI Favorites System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {aiStatus.queueLength || 0}
              </div>
              <div className="text-gray-600">Queue Items</div>
            </div>
            <div className="text-center">
              <Badge
                className={
                  aiStatus.processing
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }
              >
                {aiStatus.processing ? "Processing" : "Ready"}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {aiStatus.recentItems?.length || 0}
              </div>
              <div className="text-gray-600">Recent Items</div>
            </div>
            <div className="text-center">
              <Button
                onClick={loadFavoritesStatus}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Favorites */}
      {userId && Object.keys(userFavorites).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              User Favorites Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(userFavorites).map(
                ([status, items]: [string, any[]]) => (
                  <div key={status} className="text-center">
                    <div className="text-lg font-bold text-gray-800">
                      {items.length}
                    </div>
                    <div className="text-gray-600 capitalize">{status}</div>
                    <Badge
                      variant="outline"
                      className={
                        status === "favorite"
                          ? "text-red-600"
                          : status === "restored"
                            ? "text-green-600"
                            : status === "deleted"
                              ? "text-gray-600"
                              : "text-yellow-600"
                      }
                    >
                      {status}
                    </Badge>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Status */}
      {showGlobalStats && syncStatus.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              Database Sync Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {syncStatus.slice(0, 5).map((status, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">
                        User {status.userId.substring(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-600">
                        Last sync:{" "}
                        {status.lastSync
                          ? new Date(status.lastSync).toLocaleString()
                          : "Never"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {status.pendingUpdates > 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        {status.pendingUpdates} pending
                      </Badge>
                    )}
                    <Badge
                      className={
                        status.syncInProgress
                          ? "bg-blue-100 text-blue-800"
                          : status.pendingUpdates === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {status.syncInProgress
                        ? "Syncing"
                        : status.pendingUpdates === 0
                          ? "Synced"
                          : "Pending"}
                    </Badge>
                    <Button
                      onClick={() => handleForceSync(status.userId)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Force Sync
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <Activity className="w-4 h-4 mr-2 text-blue-600" />
            Real-time Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Enhanced Favorites System</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Processing</span>
              <Badge
                className={
                  aiStatus.processing
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }
              >
                {aiStatus.processing ? "Running" : "Idle"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Database Sync</span>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Click Detection</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesStatusDisplay;
