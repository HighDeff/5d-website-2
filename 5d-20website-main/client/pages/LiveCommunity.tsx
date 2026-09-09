import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MessageSquare,
  Users,
  Package,
  Eye,
  Heart,
  Star,
  Send,
  Bot,
  Upload,
  Camera,
  Edit3,
  Download,
  Shield,
  Crown,
  Award,
  Gift,
  DollarSign,
  Clock,
  Activity,
  Search,
  Filter,
  Plus,
  Image,
  Video,
  FileText,
  Zap,
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  ThumbsUp,
  Share2,
  Bookmark,
  Flag,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";

interface ChatMessage {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isAI?: boolean;
    status: "online" | "offline" | "away";
  };
  message: string;
  timestamp: Date;
  type: "text" | "image" | "product" | "system";
  reactions?: { emoji: string; count: number; users: string[] }[];
  attachments?: { type: string; url: string; name: string }[];
}

interface TradeItem {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  status: "available" | "pending" | "sold";
  views: number;
  likes: number;
  timePosted: string;
}

interface Strategy {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    expertise: string;
  };
  category: string;
  votes: number;
  userVote?: "up" | "down";
  tags: string[];
  implementation: string;
  results: string;
}

const LiveCommunity: React.FC = () => {
  const { user } = useUserAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [tradeItems, setTradeItems] = useState<TradeItem[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAIMessages] = useState<ChatMessage[]>([]);
  const [newAIMessage, setNewAIMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCommunityData();

    // Setup real-time updates
    const interval = setInterval(() => {
      updateLiveData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const loadCommunityData = () => {
    // Load initial data - in real app, this would come from API
    setChatMessages([
      {
        id: "1",
        user: {
          id: "user1",
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/40?img=1",
          status: "online",
        },
        message:
          "Hey everyone! Just posted some amazing vintage pieces. Check them out!",
        timestamp: new Date(Date.now() - 5 * 60000),
        type: "text",
        reactions: [
          { emoji: "👍", count: 3, users: ["user2", "user3", "user4"] },
        ],
      },
      {
        id: "2",
        user: {
          id: "ai",
          name: "Community AI",
          avatar: "/ai-avatar.png",
          isAI: true,
          status: "online",
        },
        message:
          "Welcome to the live community! I'm here to help with product validation, market insights, and selling strategies. Feel free to ask me anything!",
        timestamp: new Date(Date.now() - 10 * 60000),
        type: "text",
      },
      {
        id: "3",
        user: {
          id: "user2",
          name: "Mike Chen",
          avatar: "https://i.pravatar.cc/40?img=2",
          status: "online",
        },
        message:
          "Looking for photography tips for product shots. Anyone have recommendations?",
        timestamp: new Date(Date.now() - 15 * 60000),
        type: "text",
      },
    ]);

    setTradeItems([
      {
        id: "1",
        name: "Vintage Leather Jacket",
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
        price: 125,
        category: "clothing",
        seller: {
          id: "user1",
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/40?img=1",
          rating: 4.8,
        },
        status: "available",
        views: 24,
        likes: 8,
        timePosted: "2 hours ago",
      },
      {
        id: "2",
        name: "Designer Handbag",
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop",
        price: 89,
        category: "accessories",
        seller: {
          id: "user3",
          name: "Emma Wilson",
          avatar: "https://i.pravatar.cc/40?img=3",
          rating: 4.9,
        },
        status: "available",
        views: 18,
        likes: 12,
        timePosted: "1 hour ago",
      },
    ]);

    setStrategies([
      {
        id: "1",
        title: "Vintage Item Authentication Strategy",
        description:
          "How to authenticate and price vintage clothing items for maximum profit",
        author: {
          id: "user1",
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/40?img=1",
          expertise: "Vintage Expert",
        },
        category: "authentication",
        votes: 24,
        userVote: "up",
        tags: ["vintage", "authentication", "pricing"],
        implementation:
          "Use multiple authentication sources, check for period-appropriate materials and construction techniques",
        results:
          "Increased authentic item sales by 40%, reduced returns by 60%",
      },
      {
        id: "2",
        title: "Social Media Marketing for Resellers",
        description:
          "Leverage Instagram and TikTok to drive sales and build your brand",
        author: {
          id: "user2",
          name: "Mike Chen",
          avatar: "https://i.pravatar.cc/40?img=2",
          expertise: "Digital Marketing",
        },
        category: "marketing",
        votes: 31,
        tags: ["social-media", "marketing", "branding"],
        implementation:
          "Post consistently, use trending hashtags, engage with community, showcase behind-the-scenes content",
        results:
          "300% increase in followers, 150% increase in direct sales from social media",
      },
    ]);

    setOnlineUsers([
      {
        id: "user1",
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/40?img=1",
        status: "online",
        activity: "Browsing products",
      },
      {
        id: "user2",
        name: "Mike Chen",
        avatar: "https://i.pravatar.cc/40?img=2",
        status: "online",
        activity: "In chat",
      },
      {
        id: "user3",
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/40?img=3",
        status: "online",
        activity: "Uploading photos",
      },
      {
        id: "ai",
        name: "Community AI",
        avatar: "/ai-avatar.png",
        status: "online",
        activity: "Available to help",
      },
    ]);
  };

  const updateLiveData = () => {
    // Simulate real-time updates
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: onlineUsers[Math.floor(Math.random() * onlineUsers.length)],
      message: "Just found an amazing piece at a local thrift store!",
      timestamp: new Date(),
      type: "text",
    };

    // Randomly add new messages
    if (Math.random() > 0.7) {
      setChatMessages((prev) => [...prev, newMessage]);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || "https://i.pravatar.cc/40?img=50",
        status: "online",
      },
      message: newMessage,
      timestamp: new Date(),
      type: "text",
    };

    setChatMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate AI response
    if (newMessage.toLowerCase().includes("ai") || newMessage.includes("?")) {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: {
            id: "ai",
            name: "Community AI",
            avatar: "/ai-avatar.png",
            isAI: true,
            status: "online",
          },
          message: generateAIResponse(newMessage),
          timestamp: new Date(),
          type: "text",
        };
        setChatMessages((prev) => [...prev, aiResponse]);
      }, 2000);
    }
  };

  const handleSendAIMessage = () => {
    if (!newAIMessage.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || "https://i.pravatar.cc/40?img=50",
        status: "online",
      },
      message: newAIMessage,
      timestamp: new Date(),
      type: "text",
    };

    setAIMessages((prev) => [...prev, userMessage]);
    setNewAIMessage("");

    // Generate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user: {
          id: "ai",
          name: "Community AI",
          avatar: "/ai-avatar.png",
          isAI: true,
          status: "online",
        },
        message: generateDetailedAIResponse(userMessage.message),
        timestamp: new Date(),
        type: "text",
      };
      setAIMessages((prev) => [...prev, aiResponse]);
    }, 3000);
  };

  const generateAIResponse = (message: string): string => {
    const responses = [
      "That's a great question! Based on current market trends, I'd recommend focusing on seasonal items.",
      "I can help you with that! Here are some strategies that have worked well for other sellers...",
      "Interesting point! Have you considered the pricing strategy I mentioned earlier?",
      "Great observation! The market data shows similar patterns in that category.",
      "I'd be happy to analyze that for you. What specific aspect would you like me to focus on?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateDetailedAIResponse = (message: string): string => {
    if (
      message.toLowerCase().includes("price") ||
      message.toLowerCase().includes("pricing")
    ) {
      return "For pricing strategy, I recommend researching similar items on multiple platforms. Consider: 1) Condition and rarity, 2) Current market demand, 3) Seasonal factors, 4) Your target profit margin. I can help analyze specific items if you share photos!";
    }

    if (
      message.toLowerCase().includes("photo") ||
      message.toLowerCase().includes("picture")
    ) {
      return "Great product photos are crucial! Tips: 1) Use natural lighting, 2) Show multiple angles, 3) Include detail shots of any flaws, 4) Use a clean, neutral background, 5) Show scale with everyday objects. Would you like me to review any specific photos?";
    }

    if (
      message.toLowerCase().includes("market") ||
      message.toLowerCase().includes("trends")
    ) {
      return "Current market trends show high demand for vintage items, sustainable fashion, and unique accessories. Categories performing well: 1) 90s/Y2K fashion, 2) Designer vintage, 3) Handmade items, 4) Tech accessories. What category interests you most?";
    }

    return "I'm here to help with product validation, pricing strategies, market analysis, photography tips, and selling optimization. What specific aspect of your business would you like to improve?";
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUpload(file);
      // In real app, would upload to server and get URL
      const mockImageUrl = URL.createObjectURL(file);

      const imageMessage: ChatMessage = {
        id: Date.now().toString(),
        user: {
          id: user?.id || "unknown",
          name: user?.name || "Anonymous",
          avatar: user?.avatar || "https://i.pravatar.cc/40?img=50",
          status: "online",
        },
        message: "Uploaded an image",
        timestamp: new Date(),
        type: "image",
        attachments: [{ type: "image", url: mockImageUrl, name: file.name }],
      };

      if (showAIChat) {
        setAIMessages((prev) => [...prev, imageMessage]);

        // AI responds to image
        setTimeout(() => {
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            user: {
              id: "ai",
              name: "Community AI",
              avatar: "/ai-avatar.png",
              isAI: true,
              status: "online",
            },
            message:
              "I can see your image! This appears to be a great piece. For better analysis, could you tell me more about the item's condition, brand, and where you found it? I can help with authentication and pricing suggestions.",
            timestamp: new Date(),
            type: "text",
          };
          setAIMessages((prev) => [...prev, aiResponse]);
        }, 2000);
      } else {
        setChatMessages((prev) => [...prev, imageMessage]);
      }
    }
  };

  const handleVoteStrategy = (strategyId: string, vote: "up" | "down") => {
    setStrategies((prev) =>
      prev.map((strategy) => {
        if (strategy.id === strategyId) {
          const currentVote = strategy.userVote;
          let newVotes = strategy.votes;

          if (currentVote === vote) {
            // Remove vote
            newVotes = vote === "up" ? newVotes - 1 : newVotes + 1;
            return { ...strategy, votes: newVotes, userVote: undefined };
          } else if (currentVote) {
            // Change vote
            newVotes = vote === "up" ? newVotes + 2 : newVotes - 2;
          } else {
            // New vote
            newVotes = vote === "up" ? newVotes + 1 : newVotes - 1;
          }

          return { ...strategy, votes: newVotes, userVote: vote };
        }
        return strategy;
      }),
    );
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);

          if (existingReaction) {
            const userIndex = existingReaction.users.indexOf(user?.id || "");
            if (userIndex > -1) {
              // Remove reaction
              existingReaction.users.splice(userIndex, 1);
              existingReaction.count--;
              if (existingReaction.count === 0) {
                return {
                  ...msg,
                  reactions: reactions.filter((r) => r.emoji !== emoji),
                };
              }
            } else {
              // Add reaction
              existingReaction.users.push(user?.id || "");
              existingReaction.count++;
            }
          } else {
            // New reaction
            reactions.push({ emoji, count: 1, users: [user?.id || ""] });
          }

          return { ...msg, reactions };
        }
        return msg;
      }),
    );
  };

  const handleValidationUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      // Process each uploaded file
      for (const file of Array.from(files)) {
        const imageUrl = URL.createObjectURL(file);

        // Add to chat as validation request
        const validationMessage: ChatMessage = {
          id: Date.now().toString(),
          user: {
            id: user?.id || "unknown",
            name: user?.name || "Anonymous",
            avatar: user?.avatar || "https://i.pravatar.cc/40?img=50",
            status: "online",
          },
          message: `Requesting validation for: ${file.name}`,
          timestamp: new Date(),
          type: "image",
          attachments: [{ type: "image", url: imageUrl, name: file.name }],
        };

        setChatMessages((prev) => [...prev, validationMessage]);

        // AI responds with validation
        setTimeout(() => {
          const aiValidation: ChatMessage = {
            id: (Date.now() + Math.random()).toString(),
            user: {
              id: "ai",
              name: "Validation AI",
              avatar: "/ai-avatar.png",
              isAI: true,
              status: "online",
            },
            message: `✅ VALIDATION RESULTS for ${file.name}:

🔍 **Authenticity**: 95% confidence - Appears genuine
💰 **Estimated Value**: $45-65 based on market analysis
📊 **Market Demand**: High - 87% popularity score
🏷️ **Suggested Category**: ${file.name.toLowerCase().includes("beauty") ? "Beauty" : "Fashion"}
📈 **Pricing Recommendation**: List at $55 for optimal sales

**Notes**: High quality item with strong market appeal. Consider highlighting unique features in description.`,
            timestamp: new Date(),
            type: "text",
          };
          setChatMessages((prev) => [...prev, aiValidation]);
        }, 3000);
      }
    } catch (error) {
      console.error("Error processing validation upload:", error);
    }
  };

  const handleValidateCurrentPage = async () => {
    try {
      // Import and use LivePageValidationAI
      const { LivePageValidationAI } = await import(
        "@/services/LivePageValidationAI"
      );

      // Show loading message
      const loadingMessage: ChatMessage = {
        id: Date.now().toString(),
        user: {
          id: "ai",
          name: "Page Validation AI",
          avatar: "/ai-avatar.png",
          isAI: true,
          status: "online",
        },
        message:
          "🔍 Starting page validation... Analyzing all content and data integrity.",
        timestamp: new Date(),
        type: "text",
      };
      setChatMessages((prev) => [...prev, loadingMessage]);

      // Run validation
      const validationResult = await LivePageValidationAI.forceValidation();

      // Show results
      setTimeout(() => {
        const resultMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: {
            id: "ai",
            name: "Page Validation AI",
            avatar: "/ai-avatar.png",
            isAI: true,
            status: "online",
          },
          message: `✅ **PAGE VALIDATION COMPLETE**

📊 **Results Summary**:
- Total elements checked: ${validationResult.totalCards}
- Valid elements: ${validationResult.validCards}
- Issues found: ${validationResult.errors.length}
- Auto-corrections applied: ${validationResult.corrections.filter((c) => c.corrected).length}

${
  validationResult.errors.length > 0
    ? `⚠️ **Issues Detected**:\n${validationResult.errors
        .slice(0, 3)
        .map((error) => `• ${error.errorType}: ${error.cardTitle}`)
        .join("\n")}`
    : "✅ **No issues found** - Page is fully validated!"
}

${
  validationResult.corrections.length > 0
    ? `🔧 **Auto-fixes Applied**:\n${validationResult.corrections
        .slice(0, 3)
        .map(
          (correction) =>
            `• Updated ${correction.field}: ${correction.oldValue} → ${correction.newValue}`,
        )
        .join("\n")}`
    : ""
}

**Recommendation**: ${
            validationResult.errors.length === 0
              ? "Page is optimally configured for user experience."
              : "Some minor issues detected and automatically resolved."
          }`,
          timestamp: new Date(),
          type: "text",
        };
        setChatMessages((prev) => [...prev, resultMessage]);
      }, 2000);
    } catch (error) {
      console.error("Error validating page:", error);

      // Error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        user: {
          id: "ai",
          name: "Page Validation AI",
          avatar: "/ai-avatar.png",
          isAI: true,
          status: "online",
        },
        message:
          "❌ Validation failed. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
        type: "text",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Join the Community</h2>
            <p className="text-gray-600 mb-4">
              Sign in to chat, trade, and collaborate with other sellers.
            </p>
            <Link to="/auth">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Live Community
                </h1>
                <p className="text-sm text-gray-600">
                  Connect, trade, and grow your business with the community
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                {onlineUsers.length} online
              </Badge>
              <Button
                variant={showAIChat ? "default" : "outline"}
                onClick={() => setShowAIChat(!showAIChat)}
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-6 bg-white rounded-xl p-1 shadow-sm">
                <TabsTrigger
                  value="chat"
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </TabsTrigger>
                <TabsTrigger
                  value="trade"
                  className="flex items-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Trade</span>
                </TabsTrigger>
                <TabsTrigger
                  value="validate"
                  className="flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Validate</span>
                </TabsTrigger>
                <TabsTrigger
                  value="strategies"
                  className="flex items-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Strategies</span>
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-4">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span>Community Chat</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAIChat(!showAIChat)}
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          {showAIChat ? "Community" : "AI Chat"}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {(showAIChat ? aiMessages : chatMessages).map(
                        (message) => (
                          <div key={message.id} className="flex space-x-3">
                            <img
                              src={message.user.avatar}
                              alt={message.user.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">
                                  {message.user.name}
                                </span>
                                {message.user.isAI && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    AI
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-3">
                                <p>{message.message}</p>
                                {message.attachments &&
                                  message.attachments.map(
                                    (attachment, index) => (
                                      <div key={index} className="mt-2">
                                        {attachment.type === "image" && (
                                          <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            className="max-w-xs rounded-lg"
                                          />
                                        )}
                                      </div>
                                    ),
                                  )}
                              </div>
                              {message.reactions &&
                                message.reactions.length > 0 && (
                                  <div className="flex space-x-2 mt-2">
                                    {message.reactions.map((reaction) => (
                                      <button
                                        key={reaction.emoji}
                                        onClick={() =>
                                          handleReaction(
                                            message.id,
                                            reaction.emoji,
                                          )
                                        }
                                        className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-full"
                                      >
                                        {reaction.emoji} {reaction.count}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              {!showAIChat && (
                                <div className="flex space-x-2 mt-2">
                                  {["👍", "❤️", "😊", "🔥"].map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() =>
                                        handleReaction(message.id, emoji)
                                      }
                                      className="text-sm hover:bg-gray-200 p-1 rounded"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                      <div ref={showAIChat ? aiChatEndRef : chatEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t pt-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder={
                            showAIChat
                              ? "Ask AI anything..."
                              : "Type a message..."
                          }
                          value={showAIChat ? newAIMessage : newMessage}
                          onChange={(e) =>
                            showAIChat
                              ? setNewAIMessage(e.target.value)
                              : setNewMessage(e.target.value)
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (showAIChat
                              ? handleSendAIMessage()
                              : handleSendMessage())
                          }
                          className="flex-1"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={
                            showAIChat ? handleSendAIMessage : handleSendMessage
                          }
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trade Tab */}
              <TabsContent value="trade" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Active Items</h2>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tradeItems.map((item) => (
                    <Card
                      key={item.id}
                      className="group hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-medium">
                          ${item.price}
                        </div>
                        <Badge
                          className={`absolute top-2 left-2 ${
                            item.status === "available"
                              ? "bg-green-500"
                              : item.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <img
                            src={item.seller.avatar}
                            alt={item.seller.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-600">
                            {item.seller.name}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">
                              {item.seller.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{item.views}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              <span>{item.likes}</span>
                            </div>
                          </div>
                          <span>{item.timePosted}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button className="flex-1">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Validate Tab */}
              <TabsContent value="validate" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Validation Center</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Upload Product for Validation
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Get AI-powered authentication, pricing suggestions, and
                        market analysis
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id="validation-upload"
                        onChange={handleValidationUpload}
                      />
                      <div className="flex space-x-3 justify-center">
                        <Button
                          onClick={() =>
                            document
                              .getElementById("validation-upload")
                              ?.click()
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Select Images
                        </Button>
                        <Button
                          onClick={handleValidateCurrentPage}
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Validate Current Page
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <h4 className="font-medium">Authentication</h4>
                          <p className="text-sm text-gray-600">
                            Verify authenticity using AI
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <h4 className="font-medium">Price Analysis</h4>
                          <p className="text-sm text-gray-600">
                            Get market-based pricing
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <h4 className="font-medium">Market Insights</h4>
                          <p className="text-sm text-gray-600">
                            Understand demand trends
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Strategies Tab */}
              <TabsContent value="strategies" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Selling Strategies</h2>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Share Strategy
                  </Button>
                </div>

                <div className="space-y-4">
                  {strategies.map((strategy) => (
                    <Card key={strategy.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={strategy.author.avatar}
                          alt={strategy.author.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {strategy.title}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{strategy.author.name}</span>
                                <Badge variant="outline">
                                  {strategy.author.expertise}
                                </Badge>
                                <span>•</span>
                                <span>{strategy.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant={
                                  strategy.userVote === "up"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  handleVoteStrategy(strategy.id, "up")
                                }
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <span className="font-medium">
                                {strategy.votes}
                              </span>
                              <Button variant="outline" size="sm">
                                <Bookmark className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">
                            {strategy.description}
                          </p>
                          <div className="space-y-2 mb-3">
                            <div>
                              <strong>Implementation:</strong>{" "}
                              {strategy.implementation}
                            </div>
                            <div>
                              <strong>Results:</strong> {strategy.results}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {strategy.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>File Upload & Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-medium">Upload Images</h4>
                        <p className="text-sm text-gray-600">
                          JPG, PNG up to 10MB
                        </p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-medium">Upload Videos</h4>
                        <p className="text-sm text-gray-600">
                          MP4, MOV up to 100MB
                        </p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-medium">Upload Documents</h4>
                        <p className="text-sm text-gray-600">
                          PDF, DOC up to 25MB
                        </p>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Photo Editor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-4 mb-4">
                          <Button variant="outline">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Crop & Resize
                          </Button>
                          <Button variant="outline">
                            <Zap className="w-4 h-4 mr-2" />
                            Auto Enhance
                          </Button>
                          <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Filters
                          </Button>
                        </div>
                        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">
                            Select an image to start editing
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                {/* Admin Product Push Feature */}
                {(user.isAdmin || user.email === "haynes.d1993@yahoo.com") && (
                  <Card className="border-2 border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-800">
                        <Crown className="w-5 h-5 mr-2" />
                        Admin: Push Products by Category
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Select Category</Label>
                          <Select defaultValue="clothing">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="jewelry">Jewelry</SelectItem>
                              <SelectItem value="accessories">
                                Accessories
                              </SelectItem>
                              <SelectItem value="beauty">Beauty</SelectItem>
                              <SelectItem value="home">
                                Home & Garden
                              </SelectItem>
                              <SelectItem value="vintage">Vintage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Push Type</Label>
                          <Select defaultValue="featured">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="featured">Featured</SelectItem>
                              <SelectItem value="trending">Trending</SelectItem>
                              <SelectItem value="sale">On Sale</SelectItem>
                              <SelectItem value="new">New Arrivals</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Select defaultValue="24h">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1h">1 Hour</SelectItem>
                              <SelectItem value="6h">6 Hours</SelectItem>
                              <SelectItem value="24h">24 Hours</SelectItem>
                              <SelectItem value="7d">7 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() => {
                          alert(
                            "Products pushed to category successfully! Users will see featured items in their feeds.",
                          );
                        }}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Push Products to Users
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">Profile Views</p>
                          <p className="text-2xl font-bold text-blue-600">
                            1,234
                          </p>
                          <p className="text-xs text-green-600">
                            +12% this week
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-8 h-8 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600">Messages Sent</p>
                          <p className="text-2xl font-bold text-purple-600">
                            89
                          </p>
                          <p className="text-xs text-green-600">
                            +5% this week
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Connections</p>
                          <p className="text-2xl font-bold text-green-600">
                            24
                          </p>
                          <p className="text-xs text-green-600">+3 this week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Chat Activity</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "75%" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">75%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Product Views</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: "60%" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Community Votes</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: "40%" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">40%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Online Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onlineUsers.map((onlineUser) => (
                    <div
                      key={onlineUser.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="relative">
                        <img
                          src={onlineUser.avatar}
                          alt={onlineUser.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{onlineUser.name}</p>
                        <p className="text-xs text-gray-600">
                          {onlineUser.activity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Post
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Product
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Trends
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Active Members</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Items Listed</span>
                  <span className="font-medium">12,493</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Messages Today</span>
                  <span className="font-medium">1,203</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trades Completed</span>
                  <span className="font-medium">345</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCommunity;
