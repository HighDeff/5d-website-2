import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  Bot,
  Shield,
  Database,
  X,
  Settings,
  Move,
} from "lucide-react";
import { useUserAuth } from "../hooks/useUserAuth";
import AIConnectionStatus from "./AIConnectionStatus";

const SystemStatusNotification: React.FC = () => {
  const { user, allUsers } = useUserAuth();
  const [showStatus, setShowStatus] = useState(false);
  const [statusData, setStatusData] = useState({
    adminAccountExists: false,
    totalUsers: 0,
    offersActive: false,
    aiMonitoring: false,
    databaseConnected: false,
  });

  // Make component movable on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof window !== "undefined" &&
        (window as any).makeMovableResizable
      ) {
        (window as any).makeMovableResizable("system-status-notification");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check system status
    const checkStatus = () => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const adminExists = users.find(
        (u: any) => u.email === "haynes.d1993@yahoo.com",
      );
      const offers = JSON.parse(localStorage.getItem("offers") || "[]");

      setStatusData({
        adminAccountExists: !!adminExists,
        totalUsers: users.length,
        offersActive: offers.length > 0,
        aiMonitoring: true, // AI monitoring is always active
        databaseConnected: true, // localStorage is always available
      });
    };

    checkStatus();

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-show for admin users or if there are issues
  useEffect(() => {
    if (user?.isAdmin || user?.email === "haynes.d1993@yahoo.com") {
      setShowStatus(true);
    } else if (!statusData.adminAccountExists) {
      setShowStatus(true);
    }
  }, [user, statusData.adminAccountExists]);

  if (!showStatus) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowStatus(true)}
          className="bg-white/90 backdrop-blur-sm border-gray-300 hover:border-purple-400"
        >
          <Bot className="w-4 h-4 mr-2" />
          System Status
        </Button>
      </div>
    );
  }

  return (
    <div
      id="system-status-notification"
      className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
      style={{ minWidth: "320px", minHeight: "200px" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          System Status
          <Move
            className="w-3 h-3 ml-2 text-gray-400 cursor-move drag-handle"
            title="Drag to move"
          />
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowStatus(false)}
          className="h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        {/* Admin Account Status */}
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Shield className="w-3 h-3 mr-2 text-red-500" />
            Admin Account
          </span>
          {statusData.adminAccountExists ? (
            <Badge className="bg-green-100 text-green-800 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Missing
            </Badge>
          )}
        </div>

        {/* Database Status */}
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Database className="w-3 h-3 mr-2 text-blue-500" />
            Database ({statusData.totalUsers} users,{" "}
            {typeof window !== "undefined" && window.getDatabaseCount
              ? window.getDatabaseCount()
              : "Multiple"}{" "}
            DBs)
          </span>
          <Badge className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Unlimited
          </Badge>
        </div>

        {/* AI Monitoring */}
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Bot className="w-3 h-3 mr-2 text-purple-500" />
            AI Monitoring
          </span>
          <AIConnectionStatus showPopover={false} />
        </div>

        {/* Offers System */}
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Bot className="w-3 h-3 mr-2 text-orange-500" />
            Offers System
          </span>
          {statusData.offersActive ? (
            <Badge className="bg-green-100 text-green-800 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              Ready
            </Badge>
          )}
        </div>

        {/* Current User */}
        {user && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Current User:</span>
              <div className="text-right">
                <div className="text-xs font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {user.isAdmin ? "Admin" : user.membershipLevel}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Debug Info */}
        {(user?.isAdmin || user?.email === "haynes.d1993@yahoo.com") && (
          <div className="pt-2 border-t border-gray-200 bg-red-50 -m-4 mt-2 p-3 rounded-b-lg">
            <div className="text-xs text-red-800">
              <div className="font-medium mb-1">🔧 Admin Debug:</div>
              <div>Users: {allUsers.length}</div>
              <div>
                Admin Email:{" "}
                {allUsers.find((u) => u.email === "haynes.d1993@yahoo.com")
                  ? "✅ Found"
                  : "❌ Missing"}
              </div>
              <div>Current User Admin: {user?.isAdmin ? "✅" : "❌"}</div>
            </div>
          </div>
        )}

        {/* Fix Button for Missing Admin */}
        {!statusData.adminAccountExists && (
          <div className="pt-2">
            <Button
              size="sm"
              onClick={() => {
                // Force admin account creation
                const users = JSON.parse(localStorage.getItem("users") || "[]");
                const adminUser = {
                  id: "admin_haynes_d1993",
                  name: "Daniel Haynes",
                  email: "haynes.d1993@yahoo.com",
                  username: "dan_haynes_admin",
                  membershipLevel: "premium",
                  isAdmin: true,
                  adminLevel: "super_admin",
                  verified: true,
                  joinDate: new Date().toISOString(),
                  // ... other required fields
                };
                users.push(adminUser);
                localStorage.setItem("users", JSON.stringify(users));
                window.location.reload();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs"
            >
              Fix Admin Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatusNotification;
