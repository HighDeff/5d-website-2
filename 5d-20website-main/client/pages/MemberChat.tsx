import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  User,
  Package,
  Star,
  Heart,
  Clock,
  CheckCircle,
  X,
  Plus,
  Users,
  Crown,
  Sparkles,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";

interface CollectionRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  toUser: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  item: {
    id: string;
    name: string;
    image: string;
    price: number;
    category: string;
  };
  collectionName: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  responseMessage?: string;
}

const MemberChat: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isSignedIn, allUsers } = useUserAuth();

  const [currentRequest, setCurrentRequest] =
    useState<CollectionRequest | null>(null);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [memberRequests, setMemberRequests] = useState<CollectionRequest[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [requestForm, setRequestForm] = useState({
    collectionName: "",
    message: "",
    itemId: "",
    toUserId: "",
  });

  useEffect(() => {
    // Load parameters from URL if coming from a specific request
    const memberId = searchParams.get("member");
    const itemId = searchParams.get("item");
    const collectionName = searchParams.get("collection");

    if (memberId && itemId) {
      // Find the member and item
      const member = allUsers.find((u) => u.id === memberId);
      if (member) {
        setSelectedMember(member);
        setRequestForm((prev) => ({
          ...prev,
          toUserId: memberId,
          itemId: itemId,
          collectionName: collectionName || "",
        }));
        setIsCreatingRequest(true);
      }
    }

    // Load existing requests
    loadMemberRequests();
  }, [searchParams, allUsers]);

  const loadMemberRequests = () => {
    try {
      const requests = JSON.parse(
        localStorage.getItem("memberRequests") || "[]",
      );
      setMemberRequests(requests);
    } catch (error) {
      console.error("Error loading member requests:", error);
    }
  };

  const sendCollectionRequest = async () => {
    if (
      !user ||
      !selectedMember ||
      !requestForm.message ||
      !requestForm.collectionName
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newRequest: CollectionRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUser: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || "",
        verified: user.verified || false,
      },
      toUser: {
        id: selectedMember.id,
        name: selectedMember.name,
        avatar: selectedMember.avatar || "",
        verified: selectedMember.verified || false,
      },
      item: {
        id: requestForm.itemId,
        name: selectedItem?.name || "Product",
        image: selectedItem?.image || "",
        price: selectedItem?.price || 0,
        category: selectedItem?.category || "General",
      },
      collectionName: requestForm.collectionName,
      message: requestForm.message,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const requests = JSON.parse(
        localStorage.getItem("memberRequests") || "[]",
      );
      requests.push(newRequest);
      localStorage.setItem("memberRequests", JSON.stringify(requests));

      // Simulate notification to member (in real app, this would be a push notification)
      alert(
        `Request sent to ${selectedMember.name}! They will be notified via email and app notification.`,
      );

      setMemberRequests(requests);
      setIsCreatingRequest(false);
      setRequestForm({
        collectionName: "",
        message: "",
        itemId: "",
        toUserId: "",
      });
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  const respondToRequest = (
    requestId: string,
    status: "accepted" | "declined",
    responseMessage: string = "",
  ) => {
    try {
      const requests = JSON.parse(
        localStorage.getItem("memberRequests") || "[]",
      );
      const requestIndex = requests.findIndex(
        (r: CollectionRequest) => r.id === requestId,
      );

      if (requestIndex !== -1) {
        requests[requestIndex].status = status;
        requests[requestIndex].responseMessage = responseMessage;
        localStorage.setItem("memberRequests", JSON.stringify(requests));

        setMemberRequests(requests);
        alert(`Request ${status}!`);
      }
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  const myRequests = memberRequests.filter(
    (req) => req.fromUser.id === user?.id,
  );
  const requestsToMe = memberRequests.filter(
    (req) => req.toUser.id === user?.id,
  );

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Member Chat Access
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be a member to access collection requests and chat
              features.
            </p>
            <div className="space-y-3">
              <Link to="/auth">
                <Button className="w-full bg-purple-600 text-white">
                  Sign In / Sign Up
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/collections"
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Collections
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Member Chat & Collection Requests
            </h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-700">
                ✅ {user.name}
              </Badge>
              {user.verified && (
                <Badge className="bg-blue-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Member Chat Features Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 mb-2">
                  🤝 Member Collection Requests
                </h3>
                <p className="text-purple-700 text-sm mb-3">
                  Connect with other verified members to add their items to your
                  collections. Send requests, negotiate, and build amazing
                  curated collections together!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-purple-600">
                      ✅ Send collection requests
                    </p>
                    <p className="text-purple-600">
                      ✅ Direct member messaging
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-purple-600">🎯 Curated collections</p>
                    <p className="text-purple-600">💬 Real-time chat</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-purple-600">⭐ Member verification</p>
                    <p className="text-purple-600">🔒 Secure messaging</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create New Request */}
        {isCreatingRequest && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Send Collection Request</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedMember && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Requesting from:
                  </h4>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedMember.avatar} />
                      <AvatarFallback>
                        {selectedMember.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {selectedMember.name}
                        </span>
                        {selectedMember.verified && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedMember.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="collectionName">Collection Name</Label>
                  <Input
                    id="collectionName"
                    placeholder="e.g., Summer Fashion 2024"
                    value={requestForm.collectionName}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        collectionName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message to Member</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Hi! I'd love to add your item to my collection. Would you be interested in collaborating?"
                    value={requestForm.message}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        message: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex space-x-4">
                  <Button onClick={sendCollectionRequest} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingRequest(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requests Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Sent Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>My Requests ({myRequests.length})</span>
                </span>
                <Button
                  size="sm"
                  onClick={() => setIsCreatingRequest(true)}
                  className="bg-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No requests sent
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start building collections by requesting items from other
                    members
                  </p>
                  <Button onClick={() => setIsCreatingRequest(true)}>
                    Send First Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">
                              To: {request.toUser.name}
                            </span>
                            <Badge
                              variant={
                                request.status === "pending"
                                  ? "secondary"
                                  : request.status === "accepted"
                                    ? "default"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Collection: {request.collectionName}
                          </p>
                          <p className="text-sm text-gray-700">
                            {request.message}
                          </p>
                          {request.responseMessage && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Response:</strong>{" "}
                                {request.responseMessage}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          {request.status === "pending" && (
                            <div className="flex items-center mt-2">
                              <Clock className="w-4 h-4 text-yellow-500" />
                              <span className="text-xs text-yellow-600 ml-1">
                                Pending
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requests to Me */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Requests to Me ({requestsToMe.length})</span>
                {requestsToMe.filter((r) => r.status === "pending").length >
                  0 && (
                  <Badge variant="destructive" className="text-xs">
                    {requestsToMe.filter((r) => r.status === "pending").length}{" "}
                    pending
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requestsToMe.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No requests received
                  </h3>
                  <p className="text-gray-500">
                    Other members haven't sent you any collection requests yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requestsToMe.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">
                              From: {request.fromUser.name}
                            </span>
                            {request.fromUser.verified && (
                              <Badge className="bg-blue-500 text-white text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Collection: {request.collectionName}
                          </p>
                          <p className="text-sm text-gray-700 mb-3">
                            {request.message}
                          </p>

                          {request.status === "pending" && (
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor={`response-${request.id}`}>
                                  Your response:
                                </Label>
                                <Textarea
                                  id={`response-${request.id}`}
                                  rows={2}
                                  placeholder="Optional response message..."
                                  onChange={(e) => {
                                    // Store response temporarily
                                    (e.target as any).responseMessage =
                                      e.target.value;
                                  }}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const textarea = document.getElementById(
                                      `response-${request.id}`,
                                    ) as HTMLTextAreaElement;
                                    const responseMessage =
                                      textarea?.value || "";
                                    respondToRequest(
                                      request.id,
                                      "accepted",
                                      responseMessage,
                                    );
                                  }}
                                  className="bg-green-600 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const textarea = document.getElementById(
                                      `response-${request.id}`,
                                    ) as HTMLTextAreaElement;
                                    const responseMessage =
                                      textarea?.value || "";
                                    respondToRequest(
                                      request.id,
                                      "declined",
                                      responseMessage,
                                    );
                                  }}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Decline
                                </Button>
                              </div>
                            </div>
                          )}

                          {request.status !== "pending" && (
                            <div className="mt-3">
                              <Badge
                                variant={
                                  request.status === "accepted"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {request.status === "accepted"
                                  ? "✅ Accepted"
                                  : "❌ Declined"}
                              </Badge>
                              {request.responseMessage && (
                                <p className="text-sm text-gray-600 mt-2">
                                  <strong>Your response:</strong>{" "}
                                  {request.responseMessage}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Member Features CTA */}
        <Card className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Unlock More Member Features
            </h2>
            <p className="text-purple-100 mb-6">
              Upgrade to Premium for advanced chat features, priority requests,
              and exclusive member benefits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/membership">
                <Button variant="secondary" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Membership
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white hover:text-purple-600"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Member Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberChat;
