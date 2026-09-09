// Advanced Admin Database Settings with AI-Powered Account Management
// Comprehensive user account control, message management, and financial operations

import React, { useState, useEffect } from "react";
import {
  Database,
  Users,
  Settings,
  Search,
  Edit,
  Trash2,
  Ban,
  Shield,
  DollarSign,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CreditCard,
  Mail,
  Phone,
  UserX,
  Filter,
  Download,
  Upload,
  Brain,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatabaseService from "../../services/DatabaseService";
import ValidationService from "../../services/ValidationService";
import MonitoringService from "../../services/MonitoringService";
import AdminFilteredMessages from "../../components/AdminFilteredMessages";

interface UserData {
  id: string;
  username: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: "active" | "suspended" | "banned" | "pending_verification";
  verified: boolean;
  passwordHash: string;
  portfolio: {
    totalSales: number;
    totalEarnings: number;
    salesCount: number;
    membershipLevel: string;
    payoutMethods: any[];
  };
  files: {
    profilePicture?: string;
    documents: any[];
  };
  createdAt: string;
  lastLoginAt?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "offer" | "message" | "refund_request" | "complaint";
  timestamp: string;
  status: "active" | "deleted" | "flagged";
  flagged: boolean;
  flagReason?: string;
}

interface RefundRequest {
  id: string;
  requesterId: string;
  sellerId: string;
  itemId: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "denied";
  timestamp: string;
  adminNotes?: string;
}

const DatabaseSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [users, setUsers] = useState<UserData[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  // Form data for editing users
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
    status: "active",
    membershipLevel: "free",
    paypalEmail: "",
    cashAppTag: "",
    bankAccount: "",
    creditCard: "",
  });

  useEffect(() => {
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    try {
      setLoading(true);

      // Load all users
      const allUsers = await DatabaseService.getAllUsersForAdmin();
      setUsers(allUsers);

      // Generate mock messages and refund requests
      const mockMessages = generateMockMessages(allUsers);
      const mockRefunds = generateMockRefundRequests(allUsers);

      setMessages(mockMessages);
      setRefundRequests(mockRefunds);
    } catch (error) {
      console.error("❌ Error loading database data:", error);
    } finally {
      setLoading(false);
    }
  };

  // AI-powered account analysis
  const runAIAccountAnalysis = async (userId: string) => {
    setIsAnalyzing(true);
    try {
      const validationService = ValidationService.getInstance();

      // Run comprehensive AI analysis
      const accountValidation = await validationService.restoreUserInfo(userId);
      const purchaseValidation =
        await validationService.validatePurchaseConsistency(userId);

      const analysis = {
        userId,
        timestamp: new Date().toISOString(),
        accountHealth: {
          score: accountValidation.score,
          status: accountValidation.isValid ? "healthy" : "issues_found",
          riskLevel: accountValidation.riskLevel,
          issues: accountValidation.issues,
        },
        financialHealth: {
          score: purchaseValidation.score,
          status: purchaseValidation.isValid ? "healthy" : "discrepancies",
          issues: purchaseValidation.issues,
        },
        suspiciousActivity: detectSuspiciousActivity(userId),
        recommendations: [
          ...accountValidation.suggestions,
          ...purchaseValidation.suggestions,
        ],
      };

      setAiAnalysis(analysis);
      console.log("🤖 AI Analysis Complete:", analysis);
    } catch (error) {
      console.error("❌ AI Analysis Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const detectSuspiciousActivity = (userId: string) => {
    // Simulate AI detection of suspicious patterns
    const suspiciousPatterns = [
      "Multiple account creation attempts",
      "Unusual purchase patterns",
      "High refund request frequency",
      "Suspicious message content",
      "Banking information mismatches",
    ];

    return Math.random() > 0.7
      ? suspiciousPatterns.slice(0, Math.floor(Math.random() * 3) + 1)
      : [];
  };

  const generateMockMessages = (users: UserData[]): Message[] => {
    if (users.length < 2) return [];

    const mockMessages: Message[] = [];
    const messageTypes = [
      "offer",
      "message",
      "refund_request",
      "complaint",
    ] as const;
    const contents = [
      "Hi! I'm interested in your vintage jacket. Would you accept $25?",
      "Is this item still available?",
      "I received the wrong item, can I get a refund?",
      "The item was damaged when it arrived",
      "Great seller, fast shipping!",
      "This seller is unresponsive",
      "Item not as described, requesting refund",
      "Thank you for the quick sale!",
    ];

    for (let i = 0; i < 15; i++) {
      const sender = users[Math.floor(Math.random() * users.length)];
      const receiver = users[Math.floor(Math.random() * users.length)];

      if (sender.id !== receiver.id) {
        const isFlagged = Math.random() > 0.8;
        mockMessages.push({
          id: `msg_${Date.now()}_${i}`,
          senderId: sender.id,
          receiverId: receiver.id,
          content: contents[Math.floor(Math.random() * contents.length)],
          type: messageTypes[Math.floor(Math.random() * messageTypes.length)],
          timestamp: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          status: "active",
          flagged: isFlagged,
          flagReason: isFlagged ? "Inappropriate content detected" : undefined,
        });
      }
    }

    return mockMessages.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  };

  const generateMockRefundRequests = (users: UserData[]): RefundRequest[] => {
    if (users.length < 2) return [];

    const mockRefunds: RefundRequest[] = [];
    const reasons = [
      "Item not as described",
      "Damaged during shipping",
      "Wrong item received",
      "Item never arrived",
      "Changed my mind",
      "Seller not responsive",
    ];

    for (let i = 0; i < 8; i++) {
      const requester = users[Math.floor(Math.random() * users.length)];
      const seller = users[Math.floor(Math.random() * users.length)];

      if (requester.id !== seller.id) {
        mockRefunds.push({
          id: `refund_${Date.now()}_${i}`,
          requesterId: requester.id,
          sellerId: seller.id,
          itemId: `item_${Math.random().toString(36).substr(2, 8)}`,
          amount: Math.floor(Math.random() * 50) + 10,
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          status: ["pending", "approved", "denied"][
            Math.floor(Math.random() * 3)
          ] as any,
          timestamp: new Date(
            Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });
      }
    }

    return mockRefunds.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      firstName: user.firstName,
      lastName: user.lastName,
      password: "", // Never pre-fill password
      status: user.status,
      membershipLevel: user.portfolio.membershipLevel,
      paypalEmail:
        user.portfolio.payoutMethods.find((p) => p.type === "paypal")?.email ||
        "",
      cashAppTag:
        user.portfolio.payoutMethods.find((p) => p.type === "cashapp")?.tag ||
        "",
      bankAccount:
        user.portfolio.payoutMethods.find((p) => p.type === "bank")?.account ||
        "",
      creditCard:
        user.portfolio.payoutMethods.find((p) => p.type === "card")?.number ||
        "",
    });
  };

  const saveUserChanges = async () => {
    if (!editingUser) return;

    try {
      const updatedUser = {
        ...editingUser,
        username: editForm.username,
        email: editForm.email,
        phone: editForm.phone,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        fullName: `${editForm.firstName} ${editForm.lastName}`,
        status: editForm.status as any,
        portfolio: {
          ...editingUser.portfolio,
          membershipLevel: editForm.membershipLevel,
          payoutMethods: [
            ...(editForm.paypalEmail
              ? [{ type: "paypal", email: editForm.paypalEmail }]
              : []),
            ...(editForm.cashAppTag
              ? [{ type: "cashapp", tag: editForm.cashAppTag }]
              : []),
            ...(editForm.bankAccount
              ? [{ type: "bank", account: editForm.bankAccount }]
              : []),
            ...(editForm.creditCard
              ? [{ type: "card", number: editForm.creditCard }]
              : []),
          ],
        },
        updatedAt: new Date().toISOString(),
      };

      // Update password if provided
      if (editForm.password) {
        updatedUser.passwordHash = btoa(editForm.password + "salt_key_demo"); // Simple hash for demo
      }

      await DatabaseService.saveUserAccount(updatedUser);

      // Update local state
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      setEditingUser(null);

      console.log("✅ User updated successfully:", updatedUser.fullName);
      alert("User account updated successfully!");
    } catch (error) {
      console.error("❌ Error updating user:", error);
      alert("Error updating user account");
    }
  };

  const deleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this user account? This action cannot be undone.",
      )
    )
      return;

    try {
      // Remove from database
      const updatedUsers = users.filter((u) => u.id !== userId);
      for (const user of updatedUsers) {
        await DatabaseService.saveUserAccount(user);
      }

      setUsers(updatedUsers);
      setSelectedUser(null);

      console.log("🗑️ User deleted:", userId);
      alert("User account deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      alert("Error deleting user account");
    }
  };

  const blockUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newStatus = user.status === "banned" ? "active" : "banned";
    const updatedUser = {
      ...user,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    try {
      await DatabaseService.saveUserAccount(updatedUser);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));

      console.log(`🚫 User ${newStatus}:`, user.fullName);
      alert(
        `User ${newStatus === "banned" ? "blocked" : "unblocked"} successfully`,
      );
    } catch (error) {
      console.error("❌ Error updating user status:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    setMessages(
      messages.map((m) =>
        m.id === messageId ? { ...m, status: "deleted" as const } : m,
      ),
    );

    console.log("🗑️ Message deleted:", messageId);
  };

  const flagMessage = async (messageId: string, reason: string) => {
    setMessages(
      messages.map((m) =>
        m.id === messageId ? { ...m, flagged: true, flagReason: reason } : m,
      ),
    );

    console.log("🚩 Message flagged:", messageId, reason);
  };

  const processRefund = async (
    refundId: string,
    approved: boolean,
    adminNotes?: string,
  ) => {
    const refund = refundRequests.find((r) => r.id === refundId);
    if (!refund) return;

    try {
      if (approved) {
        // Process the actual refund
        const requester = users.find((u) => u.id === refund.requesterId);
        const seller = users.find((u) => u.id === refund.sellerId);

        if (requester && seller) {
          // Update balances
          const updatedRequester = {
            ...requester,
            portfolio: {
              ...requester.portfolio,
              totalEarnings: requester.portfolio.totalEarnings + refund.amount,
            },
          };

          const updatedSeller = {
            ...seller,
            portfolio: {
              ...seller.portfolio,
              totalEarnings: Math.max(
                0,
                seller.portfolio.totalEarnings - refund.amount,
              ),
            },
          };

          await DatabaseService.saveUserAccount(updatedRequester);
          await DatabaseService.saveUserAccount(updatedSeller);

          setUsers(
            users.map((u) =>
              u.id === requester.id
                ? updatedRequester
                : u.id === seller.id
                  ? updatedSeller
                  : u,
            ),
          );
        }
      }

      // Update refund status
      setRefundRequests(
        refundRequests.map((r) =>
          r.id === refundId
            ? {
                ...r,
                status: approved ? "approved" : "denied",
                adminNotes: adminNotes || "",
              }
            : r,
        ),
      );

      console.log(`💰 Refund ${approved ? "approved" : "denied"}:`, refundId);
      alert(`Refund ${approved ? "approved" : "denied"} successfully`);
    } catch (error) {
      console.error("❌ Error processing refund:", error);
      alert("Error processing refund");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));

    const matchesFilter =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading database settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Database className="w-8 h-8 mr-3 text-blue-600" />
                Database Settings
              </h1>
              <p className="text-gray-600 mt-2">
                AI-powered account management, message monitoring, and financial
                operations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={loadDatabaseData}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => setShowPasswords(!showPasswords)}
                variant="outline"
                className="flex items-center"
              >
                {showPasswords ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {showPasswords ? "Hide" : "Show"} Passwords
              </Button>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="accounts" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              User Accounts
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages & Offers
            </TabsTrigger>
            <TabsTrigger value="ai-messages" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Filtered
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Refund Requests
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          {/* User Accounts Tab */}
          <TabsContent value="accounts">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>User Accounts ({users.length})</span>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={filterStatus}
                          onValueChange={setFilterStatus}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                            <SelectItem value="pending_verification">
                              Pending
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users by name, email, username, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedUser?.id === user.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">
                                  {user.fullName}
                                </h3>
                                <Badge
                                  variant={
                                    user.status === "active"
                                      ? "default"
                                      : user.status === "suspended"
                                        ? "secondary"
                                        : user.status === "banned"
                                          ? "destructive"
                                          : "outline"
                                  }
                                >
                                  {user.status}
                                </Badge>
                                {user.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                @{user.username}
                              </p>
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                              {user.phone && (
                                <p className="text-sm text-gray-600">
                                  {user.phone}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>
                                  ${user.portfolio.totalEarnings.toFixed(2)}{" "}
                                  earned
                                </span>
                                <span>{user.portfolio.salesCount} sales</span>
                                <span>{user.portfolio.membershipLevel}</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditUser(user);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  user.status === "banned"
                                    ? "default"
                                    : "destructive"
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  blockUser(user.id);
                                }}
                              >
                                {user.status === "banned" ? (
                                  <Unlock className="w-3 h-3" />
                                ) : (
                                  <Ban className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Details Panel */}
              <div>
                {selectedUser ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>User Details</span>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            onClick={() =>
                              runAIAccountAnalysis(selectedUser.id)
                            }
                            disabled={isAnalyzing}
                          >
                            <Brain className="w-3 h-3 mr-1" />
                            AI Scan
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteUser(selectedUser.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <Label className="font-semibold">Personal Info</Label>
                          <div className="mt-1 space-y-1">
                            <div>Name: {selectedUser.fullName}</div>
                            <div>Username: @{selectedUser.username}</div>
                            <div>Email: {selectedUser.email}</div>
                            {selectedUser.phone && (
                              <div>Phone: {selectedUser.phone}</div>
                            )}
                            {showPasswords && (
                              <div className="text-red-600">
                                Password Hash:{" "}
                                {selectedUser.passwordHash.substring(0, 20)}...
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="font-semibold">
                            Account Status
                          </Label>
                          <div className="mt-1 space-y-1">
                            <div>
                              Status:{" "}
                              <Badge
                                variant={
                                  selectedUser.status === "active"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {selectedUser.status}
                              </Badge>
                            </div>
                            <div>
                              Verified: {selectedUser.verified ? "✅" : "❌"}
                            </div>
                            <div>
                              Member Since:{" "}
                              {new Date(
                                selectedUser.createdAt,
                              ).toLocaleDateString()}
                            </div>
                            {selectedUser.lastLoginAt && (
                              <div>
                                Last Login:{" "}
                                {new Date(
                                  selectedUser.lastLoginAt,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="font-semibold">
                            Financial Info
                          </Label>
                          <div className="mt-1 space-y-1">
                            <div>
                              Total Earnings: $
                              {selectedUser.portfolio.totalEarnings.toFixed(2)}
                            </div>
                            <div>
                              Sales Count: {selectedUser.portfolio.salesCount}
                            </div>
                            <div>
                              Membership:{" "}
                              {selectedUser.portfolio.membershipLevel}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="font-semibold">
                            Payment Methods
                          </Label>
                          <div className="mt-1 space-y-1">
                            {selectedUser.portfolio.payoutMethods.length > 0 ? (
                              selectedUser.portfolio.payoutMethods.map(
                                (method, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <CreditCard className="w-4 h-4" />
                                    <span>
                                      {method.type}:{" "}
                                      {method.email ||
                                        method.tag ||
                                        method.account ||
                                        method.number}
                                    </span>
                                  </div>
                                ),
                              )
                            ) : (
                              <div className="text-gray-500">
                                No payment methods
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="font-semibold">Files</Label>
                          <div className="mt-1 space-y-1">
                            {selectedUser.files.profilePicture && (
                              <div>Profile Picture: ✅</div>
                            )}
                            <div>
                              Documents: {selectedUser.files.documents.length}{" "}
                              files
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Select a user to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* AI Filtered Messages Tab */}
          <TabsContent value="ai-messages">
            <AdminFilteredMessages />
          </TabsContent>

          {/* Messages & Offers Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages & Offers ({messages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg ${
                        message.flagged
                          ? "border-red-300 bg-red-50"
                          : message.status === "deleted"
                            ? "border-gray-300 bg-gray-50 opacity-50"
                            : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              variant={
                                message.type === "offer"
                                  ? "default"
                                  : message.type === "refund_request"
                                    ? "destructive"
                                    : message.type === "complaint"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {message.type}
                            </Badge>
                            {message.flagged && (
                              <Badge variant="destructive">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                            {message.status === "deleted" && (
                              <Badge variant="outline">Deleted</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            From: {getUserName(message.senderId)} → To:{" "}
                            {getUserName(message.receiverId)}
                          </div>
                          <div className="text-sm mb-2">{message.content}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                          {message.flagReason && (
                            <div className="text-xs text-red-600 mt-1">
                              Flag Reason: {message.flagReason}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-1 ml-4">
                          {message.status !== "deleted" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  flagMessage(
                                    message.id,
                                    "Inappropriate content",
                                  )
                                }
                              >
                                <AlertTriangle className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteMessage(message.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refund Requests Tab */}
          <TabsContent value="refunds">
            <Card>
              <CardHeader>
                <CardTitle>Refund Requests ({refundRequests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {refundRequests.map((refund) => (
                    <div
                      key={refund.id}
                      className="p-4 border rounded-lg border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              variant={
                                refund.status === "approved"
                                  ? "default"
                                  : refund.status === "denied"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {refund.status}
                            </Badge>
                            <span className="text-lg font-semibold">
                              ${refund.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Requester: {getUserName(refund.requesterId)} |
                            Seller: {getUserName(refund.sellerId)}
                          </div>
                          <div className="text-sm mb-2">
                            <strong>Reason:</strong> {refund.reason}
                          </div>
                          <div className="text-sm mb-2">
                            <strong>Item ID:</strong> {refund.itemId}
                          </div>
                          <div className="text-xs text-gray-500">
                            Requested:{" "}
                            {new Date(refund.timestamp).toLocaleString()}
                          </div>
                          {refund.adminNotes && (
                            <div className="text-xs text-blue-600 mt-1">
                              Admin Notes: {refund.adminNotes}
                            </div>
                          )}
                        </div>
                        {refund.status === "pending" && (
                          <div className="flex space-x-1 ml-4">
                            <Button
                              size="sm"
                              onClick={() => {
                                const notes = prompt("Admin notes (optional):");
                                processRefund(
                                  refund.id,
                                  true,
                                  notes || undefined,
                                );
                              }}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const notes = prompt("Denial reason:");
                                processRefund(
                                  refund.id,
                                  false,
                                  notes || undefined,
                                );
                              }}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Deny
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="ai-analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Account Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Select User for AI Analysis</Label>
                      <Select
                        onValueChange={(userId) => {
                          const user = users.find((u) => u.id === userId);
                          setSelectedUser(user || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user..." />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.fullName} (@{user.username})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() =>
                        selectedUser && runAIAccountAnalysis(selectedUser.id)
                      }
                      disabled={!selectedUser || isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Running AI Analysis...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Run Comprehensive AI Scan
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {aiAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">
                          Account Health
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={
                              aiAnalysis.accountHealth.status === "healthy"
                                ? "default"
                                : "destructive"
                            }
                          >
                            Score: {aiAnalysis.accountHealth.score}/100
                          </Badge>
                          <Badge variant="outline">
                            {aiAnalysis.accountHealth.riskLevel} risk
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">
                          Financial Health
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={
                              aiAnalysis.financialHealth.status === "healthy"
                                ? "default"
                                : "destructive"
                            }
                          >
                            Score: {aiAnalysis.financialHealth.score}/100
                          </Badge>
                        </div>
                      </div>

                      {aiAnalysis.suspiciousActivity.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold text-red-600">
                            Suspicious Activity
                          </Label>
                          <div className="mt-1 space-y-1">
                            {aiAnalysis.suspiciousActivity.map(
                              (activity: string, index: number) => (
                                <div
                                  key={index}
                                  className="text-sm text-red-600 flex items-center"
                                >
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {activity}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {aiAnalysis.recommendations.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold">
                            AI Recommendations
                          </Label>
                          <div className="mt-1 space-y-1">
                            {aiAnalysis.recommendations.map(
                              (rec: string, index: number) => (
                                <div
                                  key={index}
                                  className="text-sm text-blue-600"
                                >
                                  • {rec}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Analysis completed:{" "}
                        {new Date(aiAnalysis.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Edit User Account</h2>
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>New Password (leave blank to keep current)</Label>
                  <Input
                    type="password"
                    value={editForm.password}
                    onChange={(e) =>
                      setEditForm({ ...editForm, password: e.target.value })
                    }
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label>Account Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                      <SelectItem value="pending_verification">
                        Pending Verification
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Membership Level</Label>
                  <Select
                    value={editForm.membershipLevel}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, membershipLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>PayPal Email</Label>
                  <Input
                    type="email"
                    value={editForm.paypalEmail}
                    onChange={(e) =>
                      setEditForm({ ...editForm, paypalEmail: e.target.value })
                    }
                    placeholder="paypal@email.com"
                  />
                </div>
                <div>
                  <Label>CashApp Tag</Label>
                  <Input
                    value={editForm.cashAppTag}
                    onChange={(e) =>
                      setEditForm({ ...editForm, cashAppTag: e.target.value })
                    }
                    placeholder="$CashTag"
                  />
                </div>
                <div>
                  <Label>Bank Account</Label>
                  <Input
                    value={editForm.bankAccount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bankAccount: e.target.value })
                    }
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label>Credit Card</Label>
                  <Input
                    value={editForm.creditCard}
                    onChange={(e) =>
                      setEditForm({ ...editForm, creditCard: e.target.value })
                    }
                    placeholder="Card number"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button onClick={saveUserChanges}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSettings;
