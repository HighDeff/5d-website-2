// AI Marketplace Demo Page
// Showcases all enhanced AI features: sale progress, multi-user chat, item recommendations, and networking

import React, { useState, useEffect } from "react";
import {
  Bot,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Network,
  Zap,
  Star,
  Crown,
  Shield,
  Gift,
  Target,
  Activity,
  RefreshCw,
  Eye,
  Settings,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import EnhancedAIChat from "../components/EnhancedAIChat";
import MultiUserChat from "../components/MultiUserChat";
import SaleProgressTracker from "../components/SaleProgressTracker";
import TagAlongManager from "../components/TagAlongManager";
import OffersManager from "../components/OffersManager";
import EnhancedAIService from "../services/EnhancedAIService";
import DatabaseService from "../services/DatabaseService";
import TagAlongService from "../services/TagAlongService";
import OffersService from "../services/OffersService";

const AIMarketplace: React.FC = () => {
  const { user, isSignedIn } = useUserAuth();
  const [activeDemo, setActiveDemo] = useState("overview");
  const [demoData, setDemoData] = useState({
    sales: 0,
    conversations: 0,
    recommendations: 0,
    matches: 0,
    tagAlongRequests: 0,
    sharedFiles: 0,
  });
  const [loading, setLoading] = useState(true);

  const enhancedAI = EnhancedAIService.getInstance();

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    try {
      if (user) {
        const progresses = await enhancedAI.getAllSaleProgresses();
        const conversations = await enhancedAI.getActiveConversations(user.id);
        const recommendations = await enhancedAI.getItemRecommendations(
          user.id,
          "popular items",
        );
        const matches = await enhancedAI.findUserMatches(user.id);

        // Tag along data
        const tagAlongService = TagAlongService.getInstance();
        const tagAlongRequests = await tagAlongService.getRequestsByUser(
          user.id,
        );
        const sharedFiles =
          (await enhancedAI.getUserSharedFiles?.(user.id)) || [];

        setDemoData({
          sales: progresses.length,
          conversations: conversations.length,
          recommendations: recommendations.length,
          matches: matches.length,
          tagAlongRequests: tagAlongRequests.length,
          sharedFiles: sharedFiles.length,
        });
      }
    } catch (error) {
      console.error("Failed to load demo data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDemoSale = async () => {
    if (!user) return;

    try {
      const demoSaleData = {
        orderId: `demo_order_${Date.now()}`,
        buyerId: user.id,
        sellerId: `demo_seller_${Date.now()}`,
        itemId: `demo_item_${Date.now()}`,
        itemName: "Vintage Designer Jacket",
        amount: 89.99,
      };

      await enhancedAI.createSaleProgress(demoSaleData);
      await loadDemoData();
      alert("Demo sale created! Check the Sale Progress tab.");
    } catch (error) {
      console.error("Failed to create demo sale:", error);
    }
  };

  const createDemoTagAlong = async () => {
    if (!user) return;

    try {
      const demoTagAlongData = {
        requesterId: user.id,
        friendId: `friend_${Date.now()}`,
        guestId: `guest_${Date.now()}`,
        itemRequested: "Premium Wireless Headphones",
        description:
          "Looking for high-quality noise-canceling headphones similar to what you showed me last week",
        maxPrice: 299.99,
        promotionType: "discount" as const,
      };

      await enhancedAI.createTagAlongRequest(demoTagAlongData);
      await loadDemoData();
      alert("Demo tag along request created! Check the Tag Along tab.");
    } catch (error) {
      console.error("Failed to create demo tag along request:", error);
    }
  };

  const createDemoConversation = async () => {
    if (!user) return;

    try {
      const participants = [user.id, `demo_user_${Date.now()}`];
      await enhancedAI.createConversation(participants, "item_inquiry", {
        itemDiscussed: "demo_item_vintage_bag",
      });
      await loadDemoData();
      alert("Demo conversation created! Check the Multi-User Chat tab.");
    } catch (error) {
      console.error("Failed to create demo conversation:", error);
    }
  };

  const enableDemoFriendMode = async () => {
    if (!user) return;

    try {
      await enhancedAI.enableFriendMode(user.id, {
        enabled: true,
        aggressiveness: "moderate",
        autoSuggestItems: true,
        autoOfferDiscounts: true,
        maxDiscountPercent: 15,
        notifyOnSimilarItems: true,
      });
      alert("Friend Mode enabled! You'll now receive smart recommendations.");
    } catch (error) {
      console.error("Failed to enable friend mode:", error);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Bot className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">AI Marketplace Demo</h2>
            <p className="text-gray-600 mb-4">
              Sign in to explore the enhanced AI features
            </p>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Sign In / Sign Up
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                  LILLY'S
                </h1>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-purple-600 mx-2">/</span>
                <span className="text-purple-800 font-bold">
                  AI Marketplace
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Enhanced AI
              </Badge>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Bot className="w-8 h-8 mr-3 text-purple-600" />
                  AI-Powered Marketplace
                </h1>
                <p className="text-gray-600 mt-2">
                  Experience the future of e-commerce with AI-assisted buying,
                  selling, and networking
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button onClick={loadDemoData} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {demoData.sales}
                </div>
                <div className="text-sm text-gray-600">Active Sales</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {demoData.conversations}
                </div>
                <div className="text-sm text-gray-600">Conversations</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {demoData.recommendations}
                </div>
                <div className="text-sm text-gray-600">Recommendations</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Network className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {demoData.matches}
                </div>
                <div className="text-sm text-gray-600">User Matches</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-pink-600">
                  {demoData.tagAlongRequests}
                </div>
                <div className="text-sm text-gray-600">Tag Along</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-indigo-600">
                  {demoData.sharedFiles}
                </div>
                <div className="text-sm text-gray-600">Shared Files</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Demo Tabs */}
          <Tabs value={activeDemo} onValueChange={setActiveDemo}>
            <TabsList className="grid w-full grid-cols-7 mb-8">
              <TabsTrigger value="overview">
                <Eye className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="sales">
                <Package className="w-4 h-4 mr-2" />
                Sale Progress
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Multi-User Chat
              </TabsTrigger>
              <TabsTrigger value="tagalong">
                <Users className="w-4 h-4 mr-2" />
                Tag Along
              </TabsTrigger>
              <TabsTrigger value="offers">
                <Target className="w-4 h-4 mr-2" />
                Live Offers
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="network">
                <Network className="w-4 h-4 mr-2" />
                Networking
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>🚀 Enhanced AI Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Package className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">
                            Smart Sale Management
                          </h4>
                          <p className="text-sm text-gray-600">
                            AI handles shipping reminders, automatic refunds,
                            and progress tracking
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Users className="w-5 h-5 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">
                            Multi-User Conversations
                          </h4>
                          <p className="text-sm text-gray-600">
                            AI moderates discussions between buyers and sellers
                            with turn-taking
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">
                            Item Recommendations
                          </h4>
                          <p className="text-sm text-gray-600">
                            AI suggests items based on search history and
                            preferences
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Network className="w-5 h-5 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">Friend Mode</h4>
                          <p className="text-sm text-gray-600">
                            Connect users with similar interests and
                            auto-suggest deals
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🎮 Try Demo Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        onClick={createDemoSale}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Create Demo Sale Progress
                      </Button>

                      <Button
                        onClick={createDemoConversation}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start Multi-User Chat
                      </Button>

                      <Button
                        onClick={enableDemoFriendMode}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Network className="w-4 h-4 mr-2" />
                        Enable Friend Mode
                      </Button>

                      <Button
                        onClick={createDemoTagAlong}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Create Tag Along Request
                      </Button>

                      <Button
                        onClick={() => setActiveDemo("ai")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Open AI Assistant
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">
                        💡 AI Capabilities
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Automatic sale processing and forwarding</li>
                        <li>• 10+ sale status tracking with timelines</li>
                        <li>• Turn-based conversation management</li>
                        <li>• Tag along requests with AI automation</li>
                        <li>• Secure file sharing with content validation</li>
                        <li>• Auto commission splits and refund processing</li>
                        <li>• Item similarity matching and recommendations</li>
                        <li>• User interest analysis and networking</li>
                        <li>• Automatic discount offers and negotiations</li>
                        <li>• Real-time item availability notifications</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sale Progress Tab */}
            <TabsContent value="sales">
              <SaleProgressTracker buyerId={user?.id} />
            </TabsContent>

            {/* Multi-User Chat Tab */}
            <TabsContent value="chat">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MultiUserChat
                  purpose="item_inquiry"
                  participants={[]}
                  className="h-96"
                />
                <Card>
                  <CardHeader>
                    <CardTitle>💬 Conversation Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-green-50 p-3 rounded">
                        <h4 className="font-semibold text-sm mb-1">
                          AI Moderation
                        </h4>
                        <p className="text-xs text-gray-600">
                          AI ensures fair turn-taking and facilitates productive
                          discussions
                        </p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded">
                        <h4 className="font-semibold text-sm mb-1">
                          Smart Suggestions
                        </h4>
                        <p className="text-xs text-gray-600">
                          AI provides context-aware suggestions for pricing,
                          shipping, and negotiations
                        </p>
                      </div>

                      <div className="bg-purple-50 p-3 rounded">
                        <h4 className="font-semibold text-sm mb-1">
                          Item Sharing
                        </h4>
                        <p className="text-xs text-gray-600">
                          Easily share and discuss items with integrated
                          recommendations
                        </p>
                      </div>

                      <div className="bg-orange-50 p-3 rounded">
                        <h4 className="font-semibold text-sm mb-1">
                          Auto Discounts
                        </h4>
                        <p className="text-xs text-gray-600">
                          AI automatically offers discounts to interested buyers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tag Along Tab */}
            <TabsContent value="tagalong">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
                    <Users className="w-8 h-8 mr-3 text-pink-600" />
                    Tag Along Requests
                  </h2>
                  <p className="text-gray-600">
                    Request items from friends' stores with AI automation for
                    the entire process
                  </p>
                </div>

                <TagAlongManager />

                <Card>
                  <CardHeader>
                    <CardTitle>🤖 AI-Powered Tag Along Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <Bot className="w-4 h-4 mr-1 text-purple-600" />
                          Automatic Decision Making
                        </h4>
                        <p className="text-xs text-gray-600">
                          AI analyzes requests and automatically
                          approves/declines based on market data, relationship
                          strength, and demand patterns
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          Smart Commission Split
                        </h4>
                        <p className="text-xs text-gray-600">
                          AI calculates optimal commission splits and handles
                          automatic payments to requesters when sales complete
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <Upload className="w-4 h-4 mr-1 text-blue-600" />
                          File Sharing & Analysis
                        </h4>
                        <p className="text-xs text-gray-600">
                          Share product images, specs, and references with AI
                          content validation and automatic item recommendations
                        </p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <RefreshCw className="w-4 h-4 mr-1 text-orange-600" />
                          Automatic Issue Resolution
                        </h4>
                        <p className="text-xs text-gray-600">
                          AI monitors for no-response situations, price changes,
                          overcharges and automatically processes refunds or
                          escalations
                        </p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <Network className="w-4 h-4 mr-1 text-pink-600" />
                          Friend Mode Integration
                        </h4>
                        <p className="text-xs text-gray-600">
                          Automatically suggests tag along requests to your
                          network based on aggressiveness level and successful
                          patterns
                        </p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <Activity className="w-4 h-4 mr-1 text-yellow-600" />
                          Real-time Processing
                        </h4>
                        <p className="text-xs text-gray-600">
                          All requests, approvals, file sharing, and commission
                          payments are processed in real-time with AI monitoring
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Live Offers Tab */}
            <TabsContent value="offers">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
                    <Target className="w-8 h-8 mr-3 text-orange-600" />
                    Live Offers System
                  </h2>
                  <p className="text-gray-600">
                    AI-powered offer management with automatic price analysis
                    and bidding
                  </p>
                </div>

                <OffersManager />

                <Card>
                  <CardHeader>
                    <CardTitle>🎯 AI-Powered Offer Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <Bot className="w-4 h-4 mr-1 text-blue-600" />
                          Price Analysis
                        </h4>
                        <p className="text-xs text-gray-600">
                          AI analyzes every offer for market reasonableness,
                          user reliability, and success probability with 0-100
                          scoring
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <Zap className="w-4 h-4 mr-1 text-green-600" />
                          Auto-Processing
                        </h4>
                        <p className="text-xs text-gray-600">
                          High-confidence offers (&gt;90%) are automatically
                          accepted or countered based on AI recommendations
                        </p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1 text-purple-600" />
                          Smart Bidding
                        </h4>
                        <p className="text-xs text-gray-600">
                          Counter-offer suggestions with AI-calculated optimal
                          pricing and bid sequence management
                        </p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <Shield className="w-4 h-4 mr-1 text-orange-600" />
                          Risk Assessment
                        </h4>
                        <p className="text-xs text-gray-600">
                          Real-time fraud detection, price validation, and user
                          reliability scoring with automatic flagging
                        </p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-pink-600" />
                          Transaction Integration
                        </h4>
                        <p className="text-xs text-gray-600">
                          Seamless escrow processing, commission calculation,
                          and automated payment handling
                        </p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center">
                          <Activity className="w-4 h-4 mr-1 text-yellow-600" />
                          Timeline Tracking
                        </h4>
                        <p className="text-xs text-gray-600">
                          Complete offer lifecycle tracking with automated
                          expiration, escalation, and resolution
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="ai">
              <div className="text-center py-8">
                <Bot className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">
                  Enhanced AI Assistant
                </h2>
                <p className="text-gray-600 mb-4">
                  The AI assistant is available in the bottom-right corner with
                  enhanced features:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Item Discovery</h3>
                    <p className="text-xs text-gray-600">
                      Ask about "highest selling items" or "recommend similar"
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">User Matching</h3>
                    <p className="text-xs text-gray-600">
                      Find users with similar interests and start conversations
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Network className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Friend Mode</h3>
                    <p className="text-xs text-gray-600">
                      Enable networking features for automatic recommendations
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Smart Analytics</h3>
                    <p className="text-xs text-gray-600">
                      Get insights about your sales, earnings, and market trends
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Networking Tab */}
            <TabsContent value="network">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>🤝 Friend Mode Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-semibold text-sm">
                            Auto Item Suggestions
                          </h4>
                          <p className="text-xs text-gray-600">
                            AI suggests your items to interested users
                          </p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-semibold text-sm">
                            Similar Item Alerts
                          </h4>
                          <p className="text-xs text-gray-600">
                            Get notified when someone wants items like yours
                          </p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-semibold text-sm">
                            Auto Discounts
                          </h4>
                          <p className="text-xs text-gray-600">
                            Automatically offer discounts to attract buyers
                          </p>
                        </div>
                        <Badge variant="outline">Configurable</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-semibold text-sm">
                            User Compatibility
                          </h4>
                          <p className="text-xs text-gray-600">
                            Find users with similar buying/selling patterns
                          </p>
                        </div>
                        <Badge variant="secondary">AI-Powered</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>⚙️ Aggressiveness Levels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h4 className="font-semibold text-sm">
                            Passive Mode
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600">
                          Minimal notifications, manual approval for suggestions
                        </p>
                      </div>

                      <div className="p-3 border-2 border-blue-500 rounded bg-blue-50">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <h4 className="font-semibold text-sm">
                            Moderate Mode (Active)
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600">
                          Balanced approach with smart suggestions and
                          reasonable automation
                        </p>
                      </div>

                      <div className="p-3 border rounded">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <h4 className="font-semibold text-sm">
                            Aggressive Mode
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600">
                          Maximum automation, frequent suggestions,
                          auto-discounts up to 20%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Enhanced AI Chat */}
      <EnhancedAIChat position="bottom-right" />
    </div>
  );
};

export default AIMarketplace;
