// Tag Along Manager - UI for creating and managing tag along requests
// Handles request creation, approval, tracking, and AI automation

import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Zap,
  Upload,
  Eye,
  Percent,
  Gift,
  Loader,
  Bot,
  TrendingUp,
  AlertCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useUserAuth } from "../hooks/useUserAuth";
import TagAlongService, {
  TagAlongRequest,
  TagAlongStats,
} from "../services/TagAlongService";
import FileSharing from "./FileSharing";

const TagAlongManager: React.FC = () => {
  const { user } = useUserAuth();
  const [requests, setRequests] = useState<TagAlongRequest[]>([]);
  const [stats, setStats] = useState<TagAlongStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create");
  const [selectedRequest, setSelectedRequest] =
    useState<TagAlongRequest | null>(null);

  // Create request form
  const [createForm, setCreateForm] = useState({
    friendId: "",
    guestId: "",
    itemRequested: "",
    description: "",
    maxPrice: "",
    promotionType: "discount" as "discount" | "free" | "commission_share",
    files: [] as File[],
  });

  const tagAlongService = TagAlongService.getInstance();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [userRequests, userStats] = await Promise.all([
        tagAlongService.getRequestsByUser(user.id),
        tagAlongService.getUserStats(user.id),
      ]);

      setRequests(userRequests);
      setStats(userStats);
    } catch (error) {
      console.error("Failed to load tag along data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!user || !createForm.friendId || !createForm.itemRequested) return;

    try {
      const requestData = {
        requesterId: user.id,
        friendId: createForm.friendId,
        guestId: createForm.guestId || `guest_${Date.now()}`,
        itemRequested: createForm.itemRequested,
        description: createForm.description,
        maxPrice: createForm.maxPrice
          ? parseFloat(createForm.maxPrice)
          : undefined,
        promotionType: createForm.promotionType,
        files: createForm.files,
      };

      await tagAlongService.createTagAlongRequest(requestData);
      await loadData();

      // Reset form
      setCreateForm({
        friendId: "",
        guestId: "",
        itemRequested: "",
        description: "",
        maxPrice: "",
        promotionType: "discount",
        files: [],
      });

      setActiveTab("requests");
    } catch (error) {
      console.error("Failed to create tag along request:", error);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!user) return;

    try {
      await tagAlongService.approveRequest(requestId, user.id);
      await loadData();
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleDeclineRequest = async (requestId: string, reason: string) => {
    try {
      await tagAlongService.declineRequest(requestId, reason);
      await loadData();
    } catch (error) {
      console.error("Failed to decline request:", error);
    }
  };

  const getStatusIcon = (status: TagAlongRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "sent":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "declined":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case "ai_processing":
        return <Bot className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TagAlongRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-900";
      case "declined":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "ai_processing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold">{stats.activeRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Commission Earned</p>
                  <p className="text-2xl font-bold">
                    ${stats.totalCommissionEarned.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {(stats.successRate * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Tag Along Requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create Request</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="details">Request Details</TabsTrigger>
            </TabsList>

            {/* Create Request Tab */}
            <TabsContent value="create" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="friendId">Friend ID *</Label>
                  <Input
                    id="friendId"
                    placeholder="Enter friend's user ID"
                    value={createForm.friendId}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, friendId: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestId">Guest ID (optional)</Label>
                  <Input
                    id="guestId"
                    placeholder="Enter guest's user ID"
                    value={createForm.guestId}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, guestId: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemRequested">Item Requested *</Label>
                  <Input
                    id="itemRequested"
                    placeholder="What item do you want to tag along?"
                    value={createForm.itemRequested}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        itemRequested: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max Price</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Maximum price willing to pay"
                    value={createForm.maxPrice}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, maxPrice: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the item details, preferences, or special requests..."
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Promotion Type</Label>
                  <Select
                    value={createForm.promotionType}
                    onValueChange={(value: any) =>
                      setCreateForm({ ...createForm, promotionType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">
                        <div className="flex items-center space-x-2">
                          <Percent className="h-4 w-4" />
                          <span>Discount Offer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="free">
                        <div className="flex items-center space-x-2">
                          <Gift className="h-4 w-4" />
                          <span>Free Item</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="commission_share">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Commission Share</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <Label>Attach Files (Images, Specs, References)</Label>
                <FileSharing
                  onFilesSelected={(files) =>
                    setCreateForm({ ...createForm, files })
                  }
                  maxFiles={5}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </div>

              <Button
                onClick={handleCreateRequest}
                disabled={!createForm.friendId || !createForm.itemRequested}
                className="w-full"
              >
                Create Tag Along Request
              </Button>
            </TabsContent>

            {/* Requests List Tab */}
            <TabsContent value="requests" className="space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tag along requests yet</p>
                  <p className="text-sm">
                    Create your first request to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <Card
                      key={request.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedRequest(request);
                        setActiveTab("details");
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(request.status)}
                            <div>
                              <h4 className="font-medium">
                                {request.itemRequested}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Created{" "}
                                {new Date(
                                  request.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {request.aiDecision && (
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700"
                              >
                                <Bot className="h-3 w-3 mr-1" />
                                AI:{" "}
                                {Math.round(
                                  request.aiDecision.confidence * 100,
                                )}
                                %
                              </Badge>
                            )}
                            <Badge className={getStatusColor(request.status)}>
                              {request.status.replace("_", " ")}
                            </Badge>
                            {request.maxPrice && (
                              <Badge variant="outline">
                                ${request.maxPrice}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {request.description && (
                          <p className="text-sm text-gray-600 mt-2 truncate">
                            {request.description}
                          </p>
                        )}

                        {request.aiDecision?.modifiedOffer && (
                          <div className="mt-3 p-2 bg-green-50 rounded flex items-center justify-between">
                            <span className="text-sm text-green-800">
                              AI Offer: $
                              {request.aiDecision.modifiedOffer.offeredPrice}(
                              {request.aiDecision.modifiedOffer.discountPercent}
                              % off)
                            </span>
                            <span className="text-xs text-green-600">
                              {request.aiDecision.modifiedOffer.commissionSplit}
                              % commission
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Request Details Tab */}
            <TabsContent value="details">
              {selectedRequest ? (
                <div className="space-y-6">
                  {/* Request Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedRequest.itemRequested}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Request ID: {selectedRequest.id}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedRequest.status)}
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Request Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Friend ID:
                          </span>
                          <span className="text-sm">
                            {selectedRequest.friendId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Guest ID:
                          </span>
                          <span className="text-sm">
                            {selectedRequest.guestId}
                          </span>
                        </div>
                        {selectedRequest.maxPrice && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Max Price:
                            </span>
                            <span className="text-sm">
                              ${selectedRequest.maxPrice}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Promotion:
                          </span>
                          <span className="text-sm capitalize">
                            {selectedRequest.promotionType.replace("_", " ")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Decision */}
                    {selectedRequest.aiDecision && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center space-x-1">
                            <Bot className="h-4 w-4" />
                            <span>AI Analysis</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Action:
                            </span>
                            <Badge
                              variant={
                                selectedRequest.aiDecision.action === "approve"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {selectedRequest.aiDecision.action}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Confidence:
                            </span>
                            <span className="text-sm">
                              {Math.round(
                                selectedRequest.aiDecision.confidence * 100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Reasoning:</span>
                            <p className="text-xs mt-1">
                              {selectedRequest.aiDecision.reasoning}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Description */}
                  {selectedRequest.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedRequest.description}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Files */}
                  {selectedRequest.files.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Attached Files
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedRequest.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{file.name}</span>
                                {file.aiAnalysis && (
                                  <Badge variant="outline" className="text-xs">
                                    {file.aiAnalysis.contentType}
                                  </Badge>
                                )}
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedRequest.timeline.map((event, index) => (
                          <div
                            key={event.id}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">
                                  {event.description}
                                </span>
                                {event.automated && (
                                  <Badge variant="outline" className="text-xs">
                                    <Bot className="h-3 w-3 mr-1" />
                                    Auto
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  {user?.id === selectedRequest.friendId &&
                    selectedRequest.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() =>
                            handleApproveRequest(selectedRequest.id)
                          }
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve Request
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleDeclineRequest(
                              selectedRequest.id,
                              "Declined by user",
                            )
                          }
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline Request
                        </Button>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a request to view details</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagAlongManager;
