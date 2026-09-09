import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  Settings,
  MessageSquare,
  Gavel,
  CheckSquare,
  Vote,
  Users,
  Bot,
  Shield,
  Bell,
  Eye,
  Save,
  Trash2,
  Plus,
  Search,
  Filter,
  Crown,
  Star,
  DollarSign,
  Clock,
  Activity,
  Zap,
  Brain,
  Target,
  Award,
  Gift,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import AIAPIConfigurationSettings from "@/components/AIAPIConfigurationSettings";

interface ChatSettings {
  allowDirectMessages: boolean;
  autoAcceptFriends: boolean;
  showOnlineStatus: boolean;
  messageNotifications: boolean;
  blockedUsers: string[];
}

interface BidSettings {
  allowBids: boolean;
  minBidAmount: number;
  bidNotifications: boolean;
  autoDeclineLowBids: boolean;
  bidTimeLimit: number; // hours
}

interface TaskSettings {
  allowTaskAssignment: boolean;
  taskNotifications: boolean;
  autoAcceptFromFriends: boolean;
  taskCategories: string[];
  hourlyRate: number;
}

interface VoteSettings {
  allowVoting: boolean;
  voteNotifications: boolean;
  anonymousVoting: boolean;
  voteHistory: boolean;
}

interface AISettings {
  enableAIChat: boolean;
  aiPersonality: string;
  aiResponseSpeed: string;
  aiTopics: string[];
  aiPrivacyMode: boolean;
}

const Settings: React.FC = () => {
  const { user, updateUser } = useUserAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);

  // User-to-User Settings
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    allowDirectMessages: true,
    autoAcceptFriends: false,
    showOnlineStatus: true,
    messageNotifications: true,
    blockedUsers: [],
  });

  const [bidSettings, setBidSettings] = useState<BidSettings>({
    allowBids: true,
    minBidAmount: 10,
    bidNotifications: true,
    autoDeclineLowBids: false,
    bidTimeLimit: 24,
  });

  const [taskSettings, setTaskSettings] = useState<TaskSettings>({
    allowTaskAssignment: true,
    taskNotifications: true,
    autoAcceptFromFriends: false,
    taskCategories: ["Research", "Sourcing", "Photography", "Writing"],
    hourlyRate: 25,
  });

  const [voteSettings, setVoteSettings] = useState<VoteSettings>({
    allowVoting: true,
    voteNotifications: true,
    anonymousVoting: false,
    voteHistory: true,
  });

  // AI-to-User Settings
  const [aiSettings, setAISettings] = useState<AISettings>({
    enableAIChat: true,
    aiPersonality: "professional",
    aiResponseSpeed: "normal",
    aiTopics: ["product_help", "selling_tips", "market_analysis"],
    aiPrivacyMode: false,
  });

  const [newBlockedUser, setNewBlockedUser] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [activeBids, setActiveBids] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [recentVotes, setRecentVotes] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadUserSettings();
      loadUserConnections();
    }
  }, [user]);

  const loadUserSettings = () => {
    // Load settings from localStorage or user profile
    const savedChatSettings = localStorage.getItem(`chatSettings_${user?.id}`);
    if (savedChatSettings) {
      setChatSettings(JSON.parse(savedChatSettings));
    }

    const savedBidSettings = localStorage.getItem(`bidSettings_${user?.id}`);
    if (savedBidSettings) {
      setBidSettings(JSON.parse(savedBidSettings));
    }

    const savedTaskSettings = localStorage.getItem(`taskSettings_${user?.id}`);
    if (savedTaskSettings) {
      setTaskSettings(JSON.parse(savedTaskSettings));
    }

    const savedVoteSettings = localStorage.getItem(`voteSettings_${user?.id}`);
    if (savedVoteSettings) {
      setVoteSettings(JSON.parse(savedVoteSettings));
    }

    const savedAISettings = localStorage.getItem(`aiSettings_${user?.id}`);
    if (savedAISettings) {
      setAISettings(JSON.parse(savedAISettings));
    }
  };

  const loadUserConnections = () => {
    // Mock data - in real app, this would come from API
    setConnectedUsers([
      {
        id: "1",
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/40?img=1",
        status: "online",
        relationship: "friend",
      },
      {
        id: "2",
        name: "Mike Chen",
        avatar: "https://i.pravatar.cc/40?img=2",
        status: "offline",
        relationship: "colleague",
      },
      {
        id: "3",
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/40?img=3",
        status: "online",
        relationship: "friend",
      },
    ]);

    setActiveBids([
      {
        id: "1",
        item: "Vintage Leather Jacket",
        amount: 85,
        bidder: "Sarah Johnson",
        expires: "2h 15m",
      },
      {
        id: "2",
        item: "Designer Handbag",
        amount: 120,
        bidder: "Mike Chen",
        expires: "1d 8h",
      },
    ]);

    setActiveTasks([
      {
        id: "1",
        title: "Product Photography",
        assignee: "Emma Wilson",
        rate: 30,
        deadline: "Tomorrow",
      },
      {
        id: "2",
        title: "Market Research",
        assignee: "You",
        rate: 25,
        deadline: "3 days",
      },
    ]);

    setRecentVotes([
      {
        id: "1",
        question: "Best category for vintage items?",
        yourVote: "Clothing",
        status: "active",
      },
      {
        id: "2",
        question: "Favorite selling platform?",
        yourVote: "Internal",
        status: "completed",
      },
    ]);
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Save all settings to localStorage and user profile
      localStorage.setItem(
        `chatSettings_${user.id}`,
        JSON.stringify(chatSettings),
      );
      localStorage.setItem(
        `bidSettings_${user.id}`,
        JSON.stringify(bidSettings),
      );
      localStorage.setItem(
        `taskSettings_${user.id}`,
        JSON.stringify(taskSettings),
      );
      localStorage.setItem(
        `voteSettings_${user.id}`,
        JSON.stringify(voteSettings),
      );
      localStorage.setItem(`aiSettings_${user.id}`, JSON.stringify(aiSettings));

      // Update user profile with settings
      await updateUser({
        ...user,
        settings: {
          chat: chatSettings,
          bids: bidSettings,
          tasks: taskSettings,
          votes: voteSettings,
          ai: aiSettings,
        },
      });

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlockUser = () => {
    if (
      newBlockedUser.trim() &&
      !chatSettings.blockedUsers.includes(newBlockedUser.trim())
    ) {
      setChatSettings({
        ...chatSettings,
        blockedUsers: [...chatSettings.blockedUsers, newBlockedUser.trim()],
      });
      setNewBlockedUser("");
    }
  };

  const handleUnblockUser = (username: string) => {
    setChatSettings({
      ...chatSettings,
      blockedUsers: chatSettings.blockedUsers.filter((u) => u !== username),
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-4">
              You need to be signed in to access settings.
            </p>
            <Button asChild className="w-full">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-blue-600" />
                  Communication & AI Settings
                </h1>
                <p className="text-sm text-gray-600">
                  Manage user interactions, AI preferences, and collaboration
                  settings
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                {user.membershipLevel || "free"}
              </Badge>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save All Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-7 bg-white rounded-xl p-1 shadow-sm">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="bids" className="flex items-center space-x-2">
              <Gavel className="w-4 h-4" />
              <span>Bids</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="votes" className="flex items-center space-x-2">
              <Vote className="w-4 h-4" />
              <span>Votes</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>AI</span>
            </TabsTrigger>
            <TabsTrigger value="ai-api" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>AI API</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Account Analytics */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Eye className="w-5 h-5 mr-2" />
                  Who Viewed Your Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "Sarah Johnson",
                      avatar: "https://i.pravatar.cc/40?img=1",
                      time: "2 hours ago",
                      action: "Viewed your profile",
                    },
                    {
                      name: "Mike Chen",
                      avatar: "https://i.pravatar.cc/40?img=2",
                      time: "5 hours ago",
                      action: "Viewed your products",
                    },
                    {
                      name: "Emma Wilson",
                      avatar: "https://i.pravatar.cc/40?img=3",
                      time: "1 day ago",
                      action: "Viewed your profile",
                    },
                  ].map((viewer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={viewer.avatar}
                          alt={viewer.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{viewer.name}</p>
                          <p className="text-sm text-gray-600">
                            {viewer.action}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{viewer.time}</p>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Profile Visitors
                </Button>
              </CardContent>
            </Card>

            {/* Favorites Analytics */}
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Star className="w-5 h-5 mr-2" />
                  Favorites Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">47</p>
                    <p className="text-sm text-gray-600">Items Favorited</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">23</p>
                    <p className="text-sm text-gray-600">Favorites Received</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">15</p>
                    <p className="text-sm text-gray-600">Mutual Favorites</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Star className="w-4 h-4 mr-2" />
                    View Favorites
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Fix Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Connected Users</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {connectedUsers.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Gavel className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Active Bids</p>
                      <p className="text-2xl font-bold text-green-600">
                        {activeBids.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Active Tasks</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {activeTasks.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Vote className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Recent Votes</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {recentVotes.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {connectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">
                              {user.relationship}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={
                            user.status === "online"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Bids & Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeBids.map((bid) => (
                      <div
                        key={bid.id}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{bid.item}</p>
                          <p className="text-sm text-gray-600">
                            Bid by {bid.bidder}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            ${bid.amount}
                          </p>
                          <p className="text-xs text-gray-500">{bid.expires}</p>
                        </div>
                      </div>
                    ))}
                    {activeTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">
                            Assigned to {task.assignee}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">
                            ${task.rate}/hr
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.deadline}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat Settings Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat & Messaging Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-gray-600">
                      Let other users send you direct messages
                    </p>
                  </div>
                  <Switch
                    checked={chatSettings.allowDirectMessages}
                    onCheckedChange={(checked) =>
                      setChatSettings({
                        ...chatSettings,
                        allowDirectMessages: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Accept Friend Requests</Label>
                    <p className="text-sm text-gray-600">
                      Automatically accept friend requests
                    </p>
                  </div>
                  <Switch
                    checked={chatSettings.autoAcceptFriends}
                    onCheckedChange={(checked) =>
                      setChatSettings({
                        ...chatSettings,
                        autoAcceptFriends: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-gray-600">
                      Let others see when you're online
                    </p>
                  </div>
                  <Switch
                    checked={chatSettings.showOnlineStatus}
                    onCheckedChange={(checked) =>
                      setChatSettings({
                        ...chatSettings,
                        showOnlineStatus: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Message Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Get notifications for new messages
                    </p>
                  </div>
                  <Switch
                    checked={chatSettings.messageNotifications}
                    onCheckedChange={(checked) =>
                      setChatSettings({
                        ...chatSettings,
                        messageNotifications: checked,
                      })
                    }
                  />
                </div>

                {/* Blocked Users */}
                <div>
                  <Label className="text-base font-medium">Blocked Users</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter username to block"
                        value={newBlockedUser}
                        onChange={(e) => setNewBlockedUser(e.target.value)}
                      />
                      <Button onClick={handleBlockUser}>
                        <Plus className="w-4 h-4 mr-2" />
                        Block
                      </Button>
                    </div>
                    {chatSettings.blockedUsers.length > 0 && (
                      <div className="space-y-2">
                        {chatSettings.blockedUsers.map((username) => (
                          <div
                            key={username}
                            className="flex items-center justify-between p-2 bg-red-50 rounded"
                          >
                            <span>{username}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnblockUser(username)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Unblock
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bids Settings Tab */}
          <TabsContent value="bids" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bidding Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Bids on My Items</Label>
                    <p className="text-sm text-gray-600">
                      Let users bid on your products
                    </p>
                  </div>
                  <Switch
                    checked={bidSettings.allowBids}
                    onCheckedChange={(checked) =>
                      setBidSettings({ ...bidSettings, allowBids: checked })
                    }
                  />
                </div>

                <div>
                  <Label>Minimum Bid Amount ($)</Label>
                  <Input
                    type="number"
                    value={bidSettings.minBidAmount}
                    onChange={(e) =>
                      setBidSettings({
                        ...bidSettings,
                        minBidAmount: Number(e.target.value),
                      })
                    }
                    placeholder="10"
                  />
                </div>

                <div>
                  <Label>Bid Time Limit (hours)</Label>
                  <Select
                    value={bidSettings.bidTimeLimit.toString()}
                    onValueChange={(value) =>
                      setBidSettings({
                        ...bidSettings,
                        bidTimeLimit: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bid Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Get notified of new bids
                    </p>
                  </div>
                  <Switch
                    checked={bidSettings.bidNotifications}
                    onCheckedChange={(checked) =>
                      setBidSettings({
                        ...bidSettings,
                        bidNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Decline Low Bids</Label>
                    <p className="text-sm text-gray-600">
                      Automatically decline bids below minimum
                    </p>
                  </div>
                  <Switch
                    checked={bidSettings.autoDeclineLowBids}
                    onCheckedChange={(checked) =>
                      setBidSettings({
                        ...bidSettings,
                        autoDeclineLowBids: checked,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Settings Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Management Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Task Assignment</Label>
                    <p className="text-sm text-gray-600">
                      Let others assign tasks to you
                    </p>
                  </div>
                  <Switch
                    checked={taskSettings.allowTaskAssignment}
                    onCheckedChange={(checked) =>
                      setTaskSettings({
                        ...taskSettings,
                        allowTaskAssignment: checked,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Hourly Rate ($)</Label>
                  <Input
                    type="number"
                    value={taskSettings.hourlyRate}
                    onChange={(e) =>
                      setTaskSettings({
                        ...taskSettings,
                        hourlyRate: Number(e.target.value),
                      })
                    }
                    placeholder="25"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Task Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Get notified of new task assignments
                    </p>
                  </div>
                  <Switch
                    checked={taskSettings.taskNotifications}
                    onCheckedChange={(checked) =>
                      setTaskSettings({
                        ...taskSettings,
                        taskNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Accept from Friends</Label>
                    <p className="text-sm text-gray-600">
                      Auto accept tasks from friends
                    </p>
                  </div>
                  <Switch
                    checked={taskSettings.autoAcceptFromFriends}
                    onCheckedChange={(checked) =>
                      setTaskSettings({
                        ...taskSettings,
                        autoAcceptFromFriends: checked,
                      })
                    }
                  />
                </div>

                {/* Task Categories */}
                <div>
                  <Label className="text-base font-medium">
                    Available Task Categories
                  </Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      "Research",
                      "Sourcing",
                      "Photography",
                      "Writing",
                      "Marketing",
                      "Design",
                    ].map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={taskSettings.taskCategories.includes(
                            category,
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTaskSettings({
                                ...taskSettings,
                                taskCategories: [
                                  ...taskSettings.taskCategories,
                                  category,
                                ],
                              });
                            } else {
                              setTaskSettings({
                                ...taskSettings,
                                taskCategories:
                                  taskSettings.taskCategories.filter(
                                    (c) => c !== category,
                                  ),
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <Label>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Votes Settings Tab */}
          <TabsContent value="votes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voting & Polls Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Voting</Label>
                    <p className="text-sm text-gray-600">
                      Participate in community votes and polls
                    </p>
                  </div>
                  <Switch
                    checked={voteSettings.allowVoting}
                    onCheckedChange={(checked) =>
                      setVoteSettings({ ...voteSettings, allowVoting: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Vote Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Get notified of new polls and votes
                    </p>
                  </div>
                  <Switch
                    checked={voteSettings.voteNotifications}
                    onCheckedChange={(checked) =>
                      setVoteSettings({
                        ...voteSettings,
                        voteNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anonymous Voting</Label>
                    <p className="text-sm text-gray-600">
                      Hide your identity in votes when possible
                    </p>
                  </div>
                  <Switch
                    checked={voteSettings.anonymousVoting}
                    onCheckedChange={(checked) =>
                      setVoteSettings({
                        ...voteSettings,
                        anonymousVoting: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Keep Vote History</Label>
                    <p className="text-sm text-gray-600">
                      Save your voting history for reference
                    </p>
                  </div>
                  <Switch
                    checked={voteSettings.voteHistory}
                    onCheckedChange={(checked) =>
                      setVoteSettings({ ...voteSettings, voteHistory: checked })
                    }
                  />
                </div>

                {/* Recent Votes */}
                <div>
                  <Label className="text-base font-medium">Recent Votes</Label>
                  <div className="mt-2 space-y-2">
                    {recentVotes.map((vote) => (
                      <div
                        key={vote.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{vote.question}</p>
                          <p className="text-sm text-gray-600">
                            Your vote: {vote.yourVote}
                          </p>
                        </div>
                        <Badge
                          className={
                            vote.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {vote.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Settings Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable AI Chat</Label>
                    <p className="text-sm text-gray-600">
                      Allow AI to chat and assist you
                    </p>
                  </div>
                  <Switch
                    checked={aiSettings.enableAIChat}
                    onCheckedChange={(checked) =>
                      setAISettings({ ...aiSettings, enableAIChat: checked })
                    }
                  />
                </div>

                <div>
                  <Label>AI Personality</Label>
                  <Select
                    value={aiSettings.aiPersonality}
                    onValueChange={(value) =>
                      setAISettings({ ...aiSettings, aiPersonality: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Response Speed</Label>
                  <Select
                    value={aiSettings.aiResponseSpeed}
                    onValueChange={(value) =>
                      setAISettings({ ...aiSettings, aiResponseSpeed: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast (1-2 seconds)</SelectItem>
                      <SelectItem value="normal">
                        Normal (3-5 seconds)
                      </SelectItem>
                      <SelectItem value="thoughtful">
                        Thoughtful (5-10 seconds)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Privacy Mode</Label>
                    <p className="text-sm text-gray-600">
                      Limit AI data collection for privacy
                    </p>
                  </div>
                  <Switch
                    checked={aiSettings.aiPrivacyMode}
                    onCheckedChange={(checked) =>
                      setAISettings({ ...aiSettings, aiPrivacyMode: checked })
                    }
                  />
                </div>

                {/* AI Topics */}
                <div>
                  <Label className="text-base font-medium">
                    AI Help Topics
                  </Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      "product_help",
                      "selling_tips",
                      "market_analysis",
                      "pricing_advice",
                      "photography_tips",
                      "customer_service",
                    ].map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={aiSettings.aiTopics.includes(topic)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAISettings({
                                ...aiSettings,
                                aiTopics: [...aiSettings.aiTopics, topic],
                              });
                            } else {
                              setAISettings({
                                ...aiSettings,
                                aiTopics: aiSettings.aiTopics.filter(
                                  (t) => t !== topic,
                                ),
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <Label>
                          {topic
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI API Config Tab (with inline chat) */}
          <TabsContent value="ai-api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI API Configuration & Inline Chat Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded bg-blue-50 text-blue-900">
                  Configure endpoints and test directly here. For database-backed persistence of methods/strategies, please Open MCP popover and Connect to Neon or Supabase.
                </div>
                <div className="bg-slate-900 rounded border border-slate-700">
                  {/* Render the shared AI API settings component including inline chat */}
                  {/* @ts-ignore - TSX import at runtime from alias path */}
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  <div className="p-4">
                    {/* Imported lazily to avoid circular deps in some bundlers */}
                    {/* We directly render component via dynamic import pattern would be overkill here */}
                    {/* Using require is not available; we rely on build to resolve alias */}
                    {/* So we import at top normally in this file? Simpler: inline import component. */}
                    <AIAPIConfigurationSettings />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
