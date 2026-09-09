// Data Recovery Center Component
// Visual interface for managing data recovery operations and monitoring fix processes

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Database,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Network,
  Zap,
  Eye,
  Download,
  Upload,
  Settings,
  Activity,
  BarChart3,
  MessageSquare,
  Users,
  Target,
  Shield,
} from "lucide-react";

interface DataRecoveryRecord {
  id: string;
  originalItemId: string;
  recoveryType:
    | "backup"
    | "reconstruction"
    | "cross_reference"
    | "ai_generated";
  recoveredData: any;
  recoveryTimestamp: string;
  recoveryAI: string;
  verificationStatus: "pending" | "verified" | "failed";
  backupSources: string[];
}

interface FixOperation {
  id: string;
  type: "visual_fix" | "hard_fix" | "data_recovery" | "reference_repair";
  targetItemId: string;
  description: string;
  status: "pending" | "in_progress" | "testing" | "completed" | "failed";
  assignedAIs: string[];
  progress: number;
}

interface ItemReference {
  id: string;
  type: string;
  status: "found" | "missing" | "corrupted" | "recovered" | "fixing";
  lastVerified: string;
  recoveryAttempts: number;
}

export const DataRecoveryCenter: React.FC = () => {
  const [recoveryRecords, setRecoveryRecords] = useState<DataRecoveryRecord[]>(
    [],
  );
  const [activeOperations, setActiveOperations] = useState<FixOperation[]>([]);
  const [itemReferences, setItemReferences] = useState<ItemReference[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<
    "records" | "operations" | "references" | "analytics"
  >("records");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRecoveryData();
    startRealTimeUpdates();
  }, []);

  const loadRecoveryData = async () => {
    setIsLoading(true);
    try {
      // Load data from the comprehensive AI fix system
      if ((window as any).getRecoveryCenter) {
        const recoveryCenter = (window as any).getRecoveryCenter();
        const records = Array.from(recoveryCenter.values());
        setRecoveryRecords(records);
      }

      // Load active operations
      if ((window as any).comprehensiveAIFixSystem) {
        const operations = Array.from(
          (window as any).comprehensiveAIFixSystem
            .getActiveOperations()
            .values(),
        );
        setActiveOperations(
          operations.map((op) => ({
            ...op,
            progress: calculateProgress(op),
          })),
        );
      }

      // Load item references
      if ((window as any).comprehensiveAIFixSystem) {
        const refs = Array.from(
          (window as any).comprehensiveAIFixSystem.itemReferences?.values() ||
            [],
        );
        setItemReferences(refs);
      }
    } catch (error) {
      console.error("Failed to load recovery data:", error);
    }
    setIsLoading(false);
  };

  const startRealTimeUpdates = () => {
    const interval = setInterval(() => {
      loadRecoveryData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  };

  const calculateProgress = (operation: any): number => {
    if (!operation.steps) return 0;
    const completedSteps = operation.steps.filter(
      (step: any) => step.status === "completed",
    ).length;
    return Math.round((completedSteps / operation.steps.length) * 100);
  };

  const handleManualRecovery = async (itemId: string) => {
    setIsLoading(true);
    try {
      if ((window as any).forceRecovery) {
        const result = await (window as any).forceRecovery(itemId);
        if (result) {
          await loadRecoveryData();
          alert(`Recovery initiated for item: ${itemId}`);
        }
      }
    } catch (error) {
      alert(`Recovery failed: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleCheckItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      if ((window as any).checkItem) {
        const result = await (window as any).checkItem(itemId);
        await loadRecoveryData();
        alert(`Item check completed: ${result.status}`);
      }
    } catch (error) {
      alert(`Item check failed: ${error.message}`);
    }
    setIsLoading(false);
  };

  const filteredRecords = recoveryRecords.filter(
    (record) =>
      record.originalItemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recoveryType.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredOperations = activeOperations.filter(
    (operation) =>
      operation.targetItemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredReferences = itemReferences.filter(
    (ref) =>
      ref.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "completed":
      case "found":
        return "bg-green-100 text-green-800";
      case "pending":
      case "in_progress":
      case "fixing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "missing":
      case "corrupted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRecoveryTypeIcon = (type: string) => {
    switch (type) {
      case "backup":
        return <HardDrive className="w-4 h-4" />;
      case "reconstruction":
        return <RefreshCw className="w-4 h-4" />;
      case "cross_reference":
        return <Network className="w-4 h-4" />;
      case "ai_generated":
        return <Zap className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Data Recovery Center
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage data recovery operations, fix processes, and item
            references
          </p>
        </div>
        <Button onClick={loadRecoveryData} disabled={isLoading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recovery Records</p>
                <p className="text-2xl font-bold">{recoveryRecords.length}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Operations</p>
                <p className="text-2xl font-bold">{activeOperations.length}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Item References</p>
                <p className="text-2xl font-bold">{itemReferences.length}</p>
              </div>
              <Network className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">
                  {recoveryRecords.length > 0
                    ? Math.round(
                        (recoveryRecords.filter(
                          (r) => r.verificationStatus === "verified",
                        ).length /
                          recoveryRecords.length) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Manual Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Manual Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Search / Item ID
              </label>
              <Input
                type="text"
                placeholder="Enter item ID or search term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => searchTerm && handleCheckItem(searchTerm)}
              disabled={!searchTerm || isLoading}
            >
              <Eye className="w-4 h-4 mr-2" />
              Check Item
            </Button>
            <Button
              onClick={() => searchTerm && handleManualRecovery(searchTerm)}
              disabled={!searchTerm || isLoading}
              variant="secondary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Force Recovery
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "records", label: "Recovery Records", icon: Database },
            { id: "operations", label: "Active Operations", icon: Activity },
            { id: "references", label: "Item References", icon: Network },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === "records" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Recovery Records ({filteredRecords.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {getRecoveryTypeIcon(record.recoveryType)}
                      <div>
                        <h4 className="font-medium">{record.originalItemId}</h4>
                        <p className="text-sm text-gray-600">
                          Recovery Type: {record.recoveryType}
                        </p>
                        <p className="text-sm text-gray-600">
                          Recovered by: {record.recoveryAI}
                        </p>
                        <p className="text-sm text-gray-600">
                          Sources: {record.backupSources.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={getStatusColor(record.verificationStatus)}
                      >
                        {record.verificationStatus}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(record.recoveryTimestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {record.recoveredData && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <details>
                        <summary className="cursor-pointer text-sm font-medium">
                          View Recovered Data
                        </summary>
                        <pre className="mt-2 text-xs overflow-auto">
                          {JSON.stringify(record.recoveredData, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === "operations" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Active Operations ({filteredOperations.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {filteredOperations.map((operation) => (
              <Card key={operation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{operation.targetItemId}</h4>
                      <p className="text-sm text-gray-600">
                        {operation.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Type: {operation.type} | Assigned AIs:{" "}
                        {operation.assignedAIs.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">
                          Progress: {operation.progress}%
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${operation.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === "references" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Item References ({filteredReferences.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReferences.map((ref) => (
              <Card key={ref.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{ref.id}</h4>
                      <p className="text-sm text-gray-600">Type: {ref.type}</p>
                      <p className="text-sm text-gray-600">
                        Attempts: {ref.recoveryAttempts}
                      </p>
                    </div>
                    <Badge className={getStatusColor(ref.status)}>
                      {ref.status}
                    </Badge>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      Last verified:{" "}
                      {new Date(ref.lastVerified).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckItem(ref.id)}
                        disabled={isLoading}
                      >
                        Check
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManualRecovery(ref.id)}
                        disabled={isLoading}
                      >
                        Recover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === "analytics" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Analytics & Insights</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recovery Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "backup",
                    "reconstruction",
                    "cross_reference",
                    "ai_generated",
                  ].map((type) => {
                    const typeRecords = recoveryRecords.filter(
                      (r) => r.recoveryType === type,
                    );
                    const successRate =
                      typeRecords.length > 0
                        ? (typeRecords.filter(
                            (r) => r.verificationStatus === "verified",
                          ).length /
                            typeRecords.length) *
                          100
                        : 0;

                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">
                            {type.replace("_", " ")}
                          </span>
                          <span>{successRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${successRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Item Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["found", "missing", "corrupted", "recovered", "fixing"].map(
                    (status) => {
                      const count = itemReferences.filter(
                        (r) => r.status === status,
                      ).length;
                      const percentage =
                        itemReferences.length > 0
                          ? (count / itemReferences.length) * 100
                          : 0;

                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{status}</span>
                            <span>
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...recoveryRecords]
                  .sort(
                    (a, b) =>
                      new Date(b.recoveryTimestamp).getTime() -
                      new Date(a.recoveryTimestamp).getTime(),
                  )
                  .slice(0, 10)
                  .map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between py-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {getRecoveryTypeIcon(record.recoveryType)}
                        <div>
                          <p className="text-sm font-medium">
                            {record.originalItemId}
                          </p>
                          <p className="text-xs text-gray-600">
                            {record.recoveryType} recovery by{" "}
                            {record.recoveryAI}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          size="sm"
                          className={getStatusColor(record.verificationStatus)}
                        >
                          {record.verificationStatus}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            record.recoveryTimestamp,
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataRecoveryCenter;
