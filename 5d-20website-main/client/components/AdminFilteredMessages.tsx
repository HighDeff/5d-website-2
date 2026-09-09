// Admin Filtered Messages Dashboard
// Shows important messages filtered by AI for admin attention

import React, { useState, useEffect } from "react";
import {
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  MessageSquare,
  DollarSign,
  Package,
  Settings,
  Eye,
  X,
  ExternalLink,
  Flag,
  TrendingUp,
  Users,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AIChatService, { FilteredMessage } from "../services/AIChatService";

const AdminFilteredMessages: React.FC = () => {
  const [filteredMessages, setFilteredMessages] = useState<FilteredMessage[]>(
    [],
  );
  const [selectedMessage, setSelectedMessage] =
    useState<FilteredMessage | null>(null);
  const [filterByImportance, setFilterByImportance] = useState<string>("all");
  const [filterByCategory, setFilterByCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const chatService = AIChatService.getInstance();

  useEffect(() => {
    loadFilteredMessages();

    // Refresh every 30 seconds
    const interval = setInterval(loadFilteredMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadFilteredMessages = async () => {
    try {
      const messages = await chatService.getFilteredMessages();
      setFilteredMessages(messages);
    } catch (error) {
      console.error("Failed to load filtered messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (messageId: string) => {
    try {
      await chatService.markMessageResolved(messageId);
      setFilteredMessages((prev) =>
        prev.filter((m) => m.originalMessage.id !== messageId),
      );
      setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to mark message as resolved:", error);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "dispute":
        return <AlertTriangle className="w-4 h-4" />;
      case "sales":
        return <DollarSign className="w-4 h-4" />;
      case "technical":
        return <Settings className="w-4 h-4" />;
      case "business":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const filteredByImportance = filteredMessages.filter(
    (m) => filterByImportance === "all" || m.importance === filterByImportance,
  );

  const filteredByCategory = filteredByImportance.filter(
    (m) =>
      filterByCategory === "all" || m.categories.includes(filterByCategory),
  );

  const criticalCount = filteredMessages.filter(
    (m) => m.importance === "critical",
  ).length;
  const highCount = filteredMessages.filter(
    (m) => m.importance === "high",
  ).length;
  const disputeCount = filteredMessages.filter((m) =>
    m.categories.includes("dispute"),
  ).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading filtered messages...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {criticalCount}
            </div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {highCount}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Flag className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {disputeCount}
            </div>
            <div className="text-sm text-gray-600">Disputes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Filter className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {filteredMessages.length}
            </div>
            <div className="text-sm text-gray-600">Total Filtered</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtered Messages ({filteredByCategory.length})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadFilteredMessages}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>

              {/* Filters */}
              <div className="flex space-x-2">
                <select
                  value={filterByImportance}
                  onChange={(e) => setFilterByImportance(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">All Importance</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>

                <select
                  value={filterByCategory}
                  onChange={(e) => setFilterByCategory(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="dispute">Disputes</option>
                  <option value="sales">Sales</option>
                  <option value="technical">Technical</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </CardHeader>

            <CardContent>
              {filteredByCategory.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">No messages need attention!</p>
                  <p className="text-sm text-gray-500">
                    AI is monitoring everything smoothly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredByCategory.map((message) => (
                    <div
                      key={message.originalMessage.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.originalMessage.id ===
                        message.originalMessage.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(message.categories[0])}
                          <Badge
                            className={getImportanceColor(message.importance)}
                          >
                            {message.importance}
                          </Badge>
                          <Badge variant="outline">
                            {message.categories[0]}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            message.originalMessage.timestamp,
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {message.userInfo.name} (
                        {message.userInfo.membershipLevel})
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        {message.originalMessage.content.substring(0, 100)}
                        {message.originalMessage.content.length > 100 && "..."}
                      </div>

                      <div className="text-xs text-gray-500">
                        {message.adminSummary.substring(0, 80)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Details */}
        <div>
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>Message Details</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMessage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Priority Alert */}
                {selectedMessage.importance === "critical" && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      Critical issue requiring immediate attention
                    </AlertDescription>
                  </Alert>
                )}

                {/* User Information */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    User Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedMessage.userInfo.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedMessage.userInfo.email}
                    </div>
                    <div>
                      <strong>Level:</strong>{" "}
                      {selectedMessage.userInfo.membershipLevel}
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <Badge variant="outline" className="ml-2">
                        {selectedMessage.userInfo.accountStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Original Message */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Original Message
                  </h4>
                  <p className="text-sm text-gray-700">
                    {selectedMessage.originalMessage.content}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(
                      selectedMessage.originalMessage.timestamp,
                    ).toLocaleString()}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">AI Analysis</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {selectedMessage.adminSummary}
                  </p>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <strong>Categories:</strong>{" "}
                      {selectedMessage.categories.join(", ")}
                    </div>
                    <div className="text-xs">
                      <strong>Importance:</strong>
                      <Badge
                        className={`ml-2 ${getImportanceColor(selectedMessage.importance)}`}
                      >
                        {selectedMessage.importance}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Suggested Actions */}
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">
                    Suggested Actions
                  </h4>
                  <div className="space-y-2">
                    {selectedMessage.suggestedActions.map((action, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">
                    Recent Activity
                  </h4>
                  <div className="space-y-1">
                    {selectedMessage.userInfo.recentActivity.map(
                      (activity, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          • {activity}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() =>
                      markAsResolved(selectedMessage.originalMessage.id)
                    }
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(
                        `/admin/database?user=${selectedMessage.userInfo.userId}`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View User Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Select a message to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFilteredMessages;
