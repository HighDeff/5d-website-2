// Account Activation Component
// Allows users to activate their accounts and clear example data

import React, { useState, useEffect } from "react";
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  User,
  DollarSign,
  ShoppingBag,
  MessageSquare,
  Shield,
  Settings,
  Camera,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RealTimeSyncService from "../services/RealTimeSync";
import { useUserAuth } from "../hooks/useUserAuth";

interface ActivationStatus {
  isActivated: boolean;
  hasExampleData: boolean;
  profilePictureUploaded: boolean;
  paymentMethodsAdded: boolean;
  readyToSell: boolean;
}

const AccountActivation: React.FC = () => {
  const { user, refreshUser } = useUserAuth();
  const [activationStatus, setActivationStatus] = useState<ActivationStatus>({
    isActivated: false,
    hasExampleData: true,
    profilePictureUploaded: false,
    paymentMethodsAdded: false,
    readyToSell: false,
  });
  const [isActivating, setIsActivating] = useState(false);
  const [syncStats, setSyncStats] = useState<any>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (user) {
      updateActivationStatus();
      loadSyncStats();
    }
  }, [user]);

  const updateActivationStatus = () => {
    if (!user) return;

    const hasExampleData = user.portfolio.sales.some(
      (sale) => sale.id.includes("example") || sale.id.includes("demo"),
    );

    const status: ActivationStatus = {
      isActivated: user.status === "active" && !hasExampleData,
      hasExampleData,
      profilePictureUploaded: !!user.files.profilePicture,
      paymentMethodsAdded: user.portfolio.payoutMethods.length > 0,
      readyToSell:
        user.status === "active" &&
        !hasExampleData &&
        user.portfolio.payoutMethods.length > 0,
    };

    setActivationStatus(status);
  };

  const loadSyncStats = async () => {
    try {
      const syncService = RealTimeSyncService.getInstance();
      const stats = await syncService.getSystemStats();
      setSyncStats(stats);
    } catch (error) {
      console.error("Error loading sync stats:", error);
    }
  };

  const handleActivateAccount = async () => {
    if (!user) return;

    setIsActivating(true);
    try {
      const syncService = RealTimeSyncService.getInstance();
      const result = await syncService.activateAccount(user.id);

      if (result.success) {
        alert(result.message);
        await refreshUser(); // Refresh user data
        updateActivationStatus();

        // Start real-time sync if not already active
        syncService.startSync();
      } else {
        alert(`Activation failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Activation error:", error);
      alert("Activation failed. Please try again.");
    } finally {
      setIsActivating(false);
    }
  };

  const startRealTimeSync = () => {
    const syncService = RealTimeSyncService.getInstance();
    syncService.startSync();
    loadSyncStats();
    alert("Real-time synchronization started!");
  };

  const stopRealTimeSync = () => {
    const syncService = RealTimeSyncService.getInstance();
    syncService.stopSync();
    loadSyncStats();
    alert("Real-time synchronization stopped.");
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please sign in to manage your account</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Account Activation Status
            </span>
            <Badge
              variant={activationStatus.isActivated ? "default" : "secondary"}
            >
              {activationStatus.isActivated
                ? "Activated"
                : "Pending Activation"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                {activationStatus.isActivated ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <span className="text-sm">
                  Account{" "}
                  {activationStatus.isActivated ? "Activated" : "Not Activated"}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {!activationStatus.hasExampleData ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <span className="text-sm">
                  {activationStatus.hasExampleData
                    ? "Has Example Data"
                    : "Clean Data"}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {activationStatus.profilePictureUploaded ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm">
                  Profile Picture{" "}
                  {activationStatus.profilePictureUploaded
                    ? "Uploaded"
                    : "Not Uploaded"}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {activationStatus.paymentMethodsAdded ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm">
                  Payment Methods{" "}
                  {activationStatus.paymentMethodsAdded ? "Added" : "Not Added"}
                </span>
              </div>
            </div>

            {/* Current Data Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Current Account Data:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-600" />
                  <div className="font-semibold">
                    ${user.portfolio.totalEarnings.toFixed(2)}
                  </div>
                  <div className="text-gray-600">Earnings</div>
                </div>
                <div className="text-center">
                  <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <div className="font-semibold">
                    {user.portfolio.salesCount}
                  </div>
                  <div className="text-gray-600">Sales</div>
                </div>
                <div className="text-center">
                  <MessageSquare className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  <div className="font-semibold">
                    {user.portfolio.offersMade.length}
                  </div>
                  <div className="text-gray-600">Offers</div>
                </div>
                <div className="text-center">
                  <Upload className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                  <div className="font-semibold">
                    {user.files.documents.length}
                  </div>
                  <div className="text-gray-600">Files</div>
                </div>
              </div>
            </div>

            {/* Activation Warning */}
            {activationStatus.hasExampleData && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your account contains example data. Activating will clear all
                  sample sales, purchases, and reset your earnings to $0. This
                  action cannot be undone.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {!activationStatus.isActivated && (
                <Button
                  onClick={handleActivateAccount}
                  disabled={isActivating}
                  className="flex items-center"
                >
                  {isActivating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  {isActivating ? "Activating..." : "Activate Account"}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => setShowStats(!showStats)}
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showStats ? "Hide" : "Show"} Sync Stats
              </Button>

              {activationStatus.isActivated && (
                <Badge
                  variant="default"
                  className="flex items-center px-3 py-2"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ready to Sell!
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Sync Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Real-Time Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Real-time sync keeps your account data updated every second,
              cross-validates with other users, and filters messages
              automatically.
            </p>

            <div className="flex gap-3">
              <Button onClick={startRealTimeSync} variant="default">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Sync
              </Button>
              <Button onClick={stopRealTimeSync} variant="outline">
                Stop Sync
              </Button>
              <Button onClick={loadSyncStats} variant="ghost">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Stats
              </Button>
            </div>

            {/* Sync Statistics */}
            {showStats && syncStats && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-3">Sync Statistics:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {syncStats.activePulses}
                    </div>
                    <div className="text-gray-600">Active Pulses</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">
                      {syncStats.pendingUpdates}
                    </div>
                    <div className="text-gray-600">Pending Updates</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">
                      {syncStats.messagesFiltered}
                    </div>
                    <div className="text-gray-600">Messages Filtered</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">
                      {syncStats.securityIncidents}
                    </div>
                    <div className="text-gray-600">Security Incidents</div>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant={
                        syncStats.syncStatus === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {syncStats.syncStatus}
                    </Badge>
                    <div className="text-gray-600 mt-1">Sync Status</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {activationStatus.isActivated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Your account is activated! Here's what you can do next:
              </p>

              <div className="space-y-2">
                {!activationStatus.profilePictureUploaded && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">
                        Upload Profile Picture
                      </div>
                      <div className="text-xs text-gray-600">
                        Add a photo to build trust with buyers
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Upload
                    </Button>
                  </div>
                )}

                {!activationStatus.paymentMethodsAdded && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">
                        Add Payment Methods
                      </div>
                      <div className="text-xs text-gray-600">
                        Set up PayPal, CashApp, or bank account
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Add
                    </Button>
                  </div>
                )}

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-sm">Start Selling</div>
                    <div className="text-xs text-gray-600">
                      Upload your first item for sale
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Add Item
                  </Button>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-sm">
                      Browse & Make Offers
                    </div>
                    <div className="text-xs text-gray-600">
                      Find items you want to buy
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Browse
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountActivation;
