// Enhanced AI Chat with Item Recommendations, User Matching, and Advanced Features
// Integrates with EnhancedAIService for comprehensive AI assistance

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Bot,
  Send,
  Star,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Search,
  Heart,
  Zap,
  Gift,
  Crown,
  Shield,
  Eye,
  Settings,
  Filter,
  Sparkles,
  Target,
  Network,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserAuth } from "../hooks/useUserAuth";
import EnhancedAIService, {
  ItemRecommendation,
  UserMatch,
  FriendModeSettings,
} from "../services/EnhancedAIService";
import AIChatService from "../services/AIChatService";
import DatabaseService from "../services/DatabaseService";

interface EnhancedAIChatProps {
  position?: "bottom-right" | "bottom-left" | "fullscreen";
  defaultOpen?: boolean;
}

const EnhancedAIChat: React.FC<EnhancedAIChatProps> = ({
  position = "bottom-right",
  defaultOpen = false,
}) => {
  const { user, isSignedIn } = useUserAuth();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [itemRecommendations, setItemRecommendations] = useState<
    ItemRecommendation[]
  >([]);
  const [userMatches, setUserMatches] = useState<UserMatch[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [friendMode, setFriendMode] = useState<FriendModeSettings>({
    enabled: false,
    aggressiveness: "moderate",
    autoSuggestItems: true,
    autoOfferDiscounts: false,
    maxDiscountPercent: 10,
    notifyOnSimilarItems: true,
  });
  const [currentSession, setCurrentSession] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const enhancedAI = EnhancedAIService.getInstance();
  const chatService = AIChatService.getInstance();

  const getUserRole = (): "guest" | "member" | "admin" => {
    if (!isSignedIn || !user) return "guest";
    if (user.email?.includes("admin@lillysthrift.com")) return "admin";
    return "member";
  };

  useEffect(() => {
    if (isOpen && !currentSession) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadUserMatches();
      loadTopItems();
    }
  }, [user]);

  const initializeChat = async () => {
    try {
      const userId = user?.id || `guest_${Date.now()}`;
      const session = await chatService.startChatSession(userId, getUserRole());
      setCurrentSession(session);
      setMessages(session.messages);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession || isLoading) return;

    setIsLoading(true);
    try {
      const userId = user?.id || currentSession.userId;
      const message = await chatService.sendMessage(
        currentSession.id,
        userId,
        inputMessage,
      );

      setMessages((prev) => {
        const existingMessage = prev.find((m) => m.id === message.id);
        if (existingMessage) return prev;
        return [...prev, message];
      });

      // Handle special AI features
      await handleSpecialQueries(inputMessage);

      setInputMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecialQueries = async (query: string) => {
    const lowerQuery = query.toLowerCase();

    // Item recommendations
    if (
      lowerQuery.includes("recommend") ||
      lowerQuery.includes("similar") ||
      lowerQuery.includes("like") ||
      lowerQuery.includes("find")
    ) {
      await loadItemRecommendations(query);
    }

    // Top items queries
    if (
      lowerQuery.includes("highest selling") ||
      lowerQuery.includes("popular") ||
      lowerQuery.includes("top") ||
      lowerQuery.includes("best")
    ) {
      await loadTopItems();
      setActiveTab("items");
    }

    // User matching
    if (
      lowerQuery.includes("user") ||
      lowerQuery.includes("seller") ||
      lowerQuery.includes("buyer") ||
      lowerQuery.includes("connect")
    ) {
      await loadUserMatches();
      setActiveTab("users");
    }

    // Friend mode activation
    if (lowerQuery.includes("friend mode") || lowerQuery.includes("network")) {
      setActiveTab("network");
    }
  };

  const loadItemRecommendations = async (query: string) => {
    if (!user) return;

    try {
      const recommendations = await enhancedAI.getItemRecommendations(
        user.id,
        query,
      );
      setItemRecommendations(recommendations);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  };

  const loadUserMatches = async () => {
    if (!user) return;

    try {
      const matches = await enhancedAI.findUserMatches(user.id);
      setUserMatches(matches);
    } catch (error) {
      console.error("Failed to load user matches:", error);
    }
  };

  const loadTopItems = async () => {
    try {
      const db = DatabaseService.getInstance();
      const allUsers = await db.getAllUsers();

      // Get all items and sort by popularity/sales
      const allItems: any[] = [];
      allUsers.forEach((user) => {
        if (user.portfolio.itemsActive) {
          user.portfolio.itemsActive.forEach((item) => {
            allItems.push({
              ...item,
              sellerName: user.fullName,
              sellerId: user.id,
              sales: Math.floor(Math.random() * 50), // Mock sales data
            });
          });
        }
      });

      // Sort by sales and take top 10
      const topItems = allItems.sort((a, b) => b.sales - a.sales).slice(0, 10);
      setTopItems(topItems);
    } catch (error) {
      console.error("Failed to load top items:", error);
    }
  };

  const toggleFriendMode = async (enabled: boolean) => {
    if (!user) return;

    const newSettings = { ...friendMode, enabled };
    setFriendMode(newSettings);
    await enhancedAI.enableFriendMode(user.id, newSettings);

    // Add AI message about friend mode
    const aiMessage = {
      id: `ai_${Date.now()}`,
      userId: "ai",
      content: enabled
        ? "🤝 Friend Mode activated! I'll now help you connect with other users and suggest items based on your interests."
        : "Friend Mode deactivated. You'll receive fewer automated suggestions.",
      aiResponse: "",
      timestamp: new Date().toISOString(),
      category: "general",
      flagged: false,
      resolved: true,
      priority: "low",
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const startConversation = async (targetUserId: string, purpose: string) => {
    if (!user) return;

    try {
      const conversation = await enhancedAI.createConversation(
        [user.id, targetUserId],
        purpose as any,
      );

      // Add AI message about starting conversation
      const aiMessage = {
        id: `ai_${Date.now()}`,
        userId: "ai",
        content: `🗣️ Started a conversation with another user about ${purpose.replace("_", " ")}. You can continue chatting in the Multi-User Chat section.`,
        aiResponse: "",
        timestamp: new Date().toISOString(),
        category: "general",
        flagged: false,
        resolved: true,
        priority: "low",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isOpen) {
    return (
      <div
        className={`fixed ${
          position === "bottom-right"
            ? "bottom-6 right-6"
            : position === "bottom-left"
              ? "bottom-6 left-6"
              : ""
        } z-50`}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        {/* Enhanced indicator */}
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    );
  }

  const chatContent = (
    <Card
      className={`${
        position === "fullscreen" ? "w-full h-full" : "w-96 h-[500px]"
      } flex flex-col shadow-2xl border-2`}
    >
      <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <div>
              <CardTitle className="text-sm font-semibold">
                Enhanced AI Assistant
              </CardTitle>
              <div className="flex items-center space-x-1 text-xs opacity-90">
                <Sparkles className="w-3 h-3" />
                <span>
                  {getUserRole() === "guest"
                    ? "Guest Mode"
                    : getUserRole() === "admin"
                      ? "Admin Access"
                      : "Member Features"}
                </span>
                {friendMode.enabled && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    Friend Mode
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col flex-1 p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1"
          >
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4 mb-2">
              <TabsTrigger value="chat">
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="items">
                <Package className="w-4 h-4 mr-1" />
                Items
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-1" />
                Users
              </TabsTrigger>
              <TabsTrigger value="network">
                <Network className="w-4 h-4 mr-1" />
                Network
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 mx-4">
              {/* Messages Area */}
              <ScrollArea className="flex-1 h-64 pr-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.id}-${index}`}
                      className={`flex ${
                        message.userId === "ai"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.userId === "ai"
                            ? "bg-gradient-to-r from-purple-100 to-blue-100"
                            : "bg-blue-600 text-white"
                        } rounded-lg p-3 text-sm`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.userId === "ai" && (
                            <Bot className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            {message.content || message.aiResponse}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="mt-4 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask about items, users, recommendations..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="items" className="flex-1 mx-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {itemRecommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Recommended for You
                    </h4>
                    {itemRecommendations.slice(0, 3).map((item) => (
                      <div
                        key={item.itemId}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {item.itemName}
                          </div>
                          <div className="text-xs text-gray-600">
                            by {item.sellerName}
                          </div>
                          <div className="text-xs text-blue-600">
                            {item.matchReason}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            ${item.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(item.confidence * 100)}% match
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {topItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Highest Selling Items
                    </h4>
                    {topItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Star className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            by {item.sellerName}
                          </div>
                          <div className="text-xs text-green-600">
                            {item.sales} sales
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            ${item.price}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {itemRecommendations.length === 0 && topItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Ask about items to see recommendations!</p>
                    <p className="text-xs">
                      Try: "Show me popular items" or "Find similar to..."
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="users" className="flex-1 mx-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {userMatches.length > 0 ? (
                  userMatches.map((match) => (
                    <div
                      key={match.userId}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {match.userName}
                        </div>
                        <div className="text-xs text-gray-600">
                          {match.matchType.replace("_", " ")}
                        </div>
                        <div className="text-xs text-blue-600">
                          {match.matchReason}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          startConversation(match.userId, "general_chat")
                        }
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No user matches yet</p>
                    <p className="text-xs">
                      Enable Friend Mode to find users with similar interests!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="network" className="flex-1 mx-4">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3 flex items-center">
                    <Network className="w-4 h-4 mr-1" />
                    Friend Mode Settings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable Friend Mode</span>
                      <Button
                        size="sm"
                        onClick={() => toggleFriendMode(!friendMode.enabled)}
                        variant={friendMode.enabled ? "default" : "outline"}
                      >
                        {friendMode.enabled ? "ON" : "OFF"}
                      </Button>
                    </div>

                    {friendMode.enabled && (
                      <>
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center space-x-2 mb-1">
                            <Zap className="w-3 h-3" />
                            <span>
                              Aggressiveness: {friendMode.aggressiveness}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Gift className="w-3 h-3" />
                            <span>
                              Auto Discounts:{" "}
                              {friendMode.autoOfferDiscounts ? "Yes" : "No"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Bell className="w-3 h-3" />
                            <span>
                              Item Notifications:{" "}
                              {friendMode.notifyOnSimilarItems ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">
                    Network Features
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• Connect with users looking for similar items</div>
                    <div>• Get notified when someone wants your items</div>
                    <div>• Auto-suggest items to interested buyers</div>
                    <div>• Receive discount offers for popular items</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );

  if (position === "fullscreen") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {chatContent}
      </div>
    );
  }

  return (
    <div
      className={`fixed ${
        position === "bottom-right"
          ? "bottom-6 right-6"
          : position === "bottom-left"
            ? "bottom-6 left-6"
            : ""
      } z-50`}
    >
      {chatContent}
    </div>
  );
};

export default EnhancedAIChat;
