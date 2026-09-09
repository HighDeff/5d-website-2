// Multi-User Chat Component with AI Moderation
// Enables multiple users to chat with AI facilitation, turn-taking, and item discussions

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  MessageSquare,
  Bot,
  Send,
  Plus,
  Settings,
  Star,
  DollarSign,
  Package,
  Heart,
  Share,
  Zap,
  Crown,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedAIService, {
  MultiUserConversation,
  ConversationMessage,
  ItemRecommendation,
} from "../services/EnhancedAIService";
import { useUserAuth } from "../hooks/useUserAuth";
import MemberIcon from "./MemberIcon";

interface MultiUserChatProps {
  conversationId?: string;
  purpose?: "sale_discussion" | "item_inquiry" | "general_chat";
  itemId?: string;
  participants?: string[];
  className?: string;
}

const MultiUserChat: React.FC<MultiUserChatProps> = ({
  conversationId,
  purpose = "general_chat",
  itemId,
  participants = [],
  className = "",
}) => {
  const { user } = useUserAuth();
  const [conversation, setConversation] =
    useState<MultiUserConversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showItemRecommendations, setShowItemRecommendations] = useState(false);
  const [itemRecommendations, setItemRecommendations] = useState<
    ItemRecommendation[]
  >([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const enhancedAI = EnhancedAIService.getInstance();

  useEffect(() => {
    initializeConversation();
  }, [conversationId, participants]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = async () => {
    try {
      if (conversationId) {
        const conv = await enhancedAI.getConversation(conversationId);
        if (conv) {
          setConversation(conv);
          setMessages(conv.messages);
        }
      } else if (participants.length > 0 && user) {
        const allParticipants = [user.id, ...participants];
        const conv = await enhancedAI.createConversation(
          allParticipants,
          purpose,
          { itemDiscussed: itemId },
        );
        setConversation(conv);
        setMessages(conv.messages);
      }
    } catch (error) {
      console.error("Failed to initialize conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversation || !user || isLoading) return;

    setIsLoading(true);
    try {
      const message = await enhancedAI.addMessageToConversation(
        conversation.id,
        user.id,
        inputMessage,
      );

      // Update local messages
      const updatedConv = await enhancedAI.getConversation(conversation.id);
      if (updatedConv) {
        setMessages(updatedConv.messages);
        setConversation(updatedConv);
      }

      setInputMessage("");

      // Check for item recommendations
      if (
        inputMessage.toLowerCase().includes("recommend") ||
        inputMessage.toLowerCase().includes("similar") ||
        inputMessage.toLowerCase().includes("like this")
      ) {
        await loadItemRecommendations(inputMessage);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
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
      setShowItemRecommendations(true);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  };

  const handleItemClick = async (item: ItemRecommendation) => {
    if (!conversation || !user) return;

    const itemMessage = `🛍️ Check out this item: ${item.itemName} - $${item.price} by ${item.sellerName}. ${item.matchReason}`;
    await enhancedAI.addMessageToConversation(
      conversation.id,
      user.id,
      itemMessage,
    );

    // Refresh messages
    const updatedConv = await enhancedAI.getConversation(conversation.id);
    if (updatedConv) {
      setMessages(updatedConv.messages);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInputMessage(suggestion);
    await sendMessage();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getUserName = (userId: string) => {
    if (userId === "ai") return "AI Assistant";
    if (userId === user?.id) return "You";
    return `User ${userId.slice(-4)}`;
  };

  const getUserInitials = (userId: string) => {
    if (userId === "ai") return "AI";
    if (userId === user?.id) return user.firstName?.[0] || "Y";
    return "U";
  };

  const getMessageTypeIcon = (type: ConversationMessage["type"]) => {
    switch (type) {
      case "offer":
        return <DollarSign className="w-3 h-3 text-green-600" />;
      case "discount":
        return <Gift className="w-3 h-3 text-purple-600" />;
      case "item_share":
        return <Package className="w-3 h-3 text-blue-600" />;
      case "ai_suggestion":
        return <Bot className="w-3 h-3 text-purple-600" />;
      default:
        return null;
    }
  };

  const renderMessage = (message: ConversationMessage, index: number) => {
    const isFromUser = message.senderId === user?.id;
    const isFromAI = message.senderId === "ai";
    const typeIcon = getMessageTypeIcon(message.type);

    return (
      <div
        key={`${message.id}-${index}`}
        className={`flex ${isFromUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-[70%] ${
            isFromAI
              ? "bg-gradient-to-r from-purple-100 to-blue-100"
              : isFromUser
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
          } rounded-lg p-3`}
        >
          {/* Message Header */}
          <div className="flex items-center space-x-2 mb-1">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">
                {getUserInitials(message.senderId)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium opacity-75">
              {getUserName(message.senderId)}
            </span>
            {typeIcon}
            {message.aiEnhanced && (
              <Zap className="w-3 h-3 text-yellow-500" title="AI Enhanced" />
            )}
            <span className="text-xs opacity-50">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Message Content */}
          <div className="text-sm">{message.content}</div>

          {/* AI Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.suggestions.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-auto py-1 px-2 mr-1"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          {/* Metadata for special message types */}
          {message.type === "discount" && message.metadata && (
            <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
              <Gift className="w-3 h-3 inline mr-1" />
              {message.metadata.discountPercent}% discount available!
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!conversation) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Setting up conversation...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} flex flex-col h-96`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>
              {purpose.replace("_", " ").charAt(0).toUpperCase() +
                purpose.replace("_", " ").slice(1)}
            </span>
            <Badge variant="outline">{conversation.participants.length}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                conversation.status === "active"
                  ? "default"
                  : conversation.status === "completed"
                    ? "secondary"
                    : "destructive"
              }
            >
              {conversation.status}
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>

        {/* Participants */}
        <div className="flex items-center space-x-2">
          {conversation.participants.slice(0, 4).map((participantId) => (
            <div key={participantId} className="flex items-center space-x-1">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {getUserInitials(participantId)}
                </AvatarFallback>
              </Avatar>
              <MemberIcon membershipLevel="member" size="sm" />
            </div>
          ))}
          {conversation.participants.length > 4 && (
            <span className="text-xs text-gray-500">
              +{conversation.participants.length - 4} more
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 mx-4 mb-2">
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="items">
              <Package className="w-4 h-4 mr-1" />
              Items
            </TabsTrigger>
            <TabsTrigger value="info">
              <Eye className="w-4 h-4 mr-1" />
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 mx-4">
            {/* Messages Area */}
            <ScrollArea className="flex-1 h-64 pr-4">
              <div className="space-y-2">
                {messages.map((message, index) =>
                  renderMessage(message, index),
                )}
                {typingUsers.length > 0 && (
                  <div className="text-xs text-gray-500 italic">
                    {typingUsers.join(", ")}{" "}
                    {typingUsers.length === 1 ? "is" : "are"} typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="mt-4 space-y-2">
              {/* Quick Actions */}
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadItemRecommendations("similar items")}
                  className="text-xs"
                >
                  <Search className="w-3 h-3 mr-1" />
                  Find Similar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage("What's the best price you can offer?")
                  }
                  className="text-xs"
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  Make Offer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage("Can you tell me more about the condition?")
                  }
                  className="text-xs"
                >
                  <Package className="w-3 h-3 mr-1" />
                  Ask Details
                </Button>
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="flex-1 mx-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {itemRecommendations.length > 0 ? (
                itemRecommendations.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleItemClick(item)}
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No items to show</p>
                  <p className="text-xs">
                    Ask about items or use "Find Similar" to see recommendations
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="flex-1 mx-4">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-2">
                  Conversation Info
                </h4>
                <div className="space-y-1 text-xs">
                  <div>Purpose: {purpose.replace("_", " ")}</div>
                  <div>
                    Created: {new Date(conversation.createdAt).toLocaleString()}
                  </div>
                  <div>Messages: {messages.length}</div>
                  <div>Status: {conversation.status}</div>
                </div>
              </div>

              {conversation.metadata.itemDiscussed && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Item Discussion
                  </h4>
                  <div className="text-xs">
                    Item ID: {conversation.metadata.itemDiscussed}
                  </div>
                </div>
              )}

              {conversation.metadata.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {conversation.metadata.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiUserChat;
