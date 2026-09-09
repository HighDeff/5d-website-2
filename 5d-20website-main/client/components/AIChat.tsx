// AI Chat Component with Role-Based Access
// Different interfaces for guests, members, and admin

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  X,
  Bot,
  User,
  Crown,
  Shield,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  HelpCircle,
  Settings,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserAuth } from "../hooks/useUserAuth";
import AIChatService, {
  ChatMessage,
  ChatSession,
} from "../services/AIChatService";

interface AIChatProps {
  position?: "bottom-right" | "bottom-left" | "fullscreen";
  defaultOpen?: boolean;
}

const AIChat: React.FC<AIChatProps> = ({
  position = "bottom-right",
  defaultOpen = false,
}) => {
  const { user, isSignedIn } = useUserAuth();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = AIChatService.getInstance();

  // Determine user role
  const getUserRole = (): "guest" | "member" | "admin" => {
    if (!isSignedIn || !user) return "guest";
    if (user.email?.includes("admin@lillysthrift.com")) return "admin";
    if (user.membershipLevel && user.membershipLevel !== "free")
      return "member";
    return "member"; // Signed in users are at least members
  };

  const userRole = getUserRole();

  useEffect(() => {
    if (isOpen && !currentSession) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const userId = user?.id || `guest_${Date.now()}`;
      const session = await chatService.startChatSession(userId, userRole);
      setCurrentSession(session);
      setMessages(session.messages);

      // Set initial suggestions
      if (session.messages.length > 0) {
        const welcomeMessage = session.messages[0];
        if (welcomeMessage.aiResponse) {
          // Extract suggestions from welcome message
          setSuggestions(getDefaultSuggestions(userRole));
        }
      }
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

      // Check if message already exists to prevent duplicates
      setMessages((prev) => {
        const existingMessage = prev.find((m) => m.id === message.id);
        if (existingMessage) {
          return prev; // Don't add duplicate
        }
        return [...prev, message];
      });

      setInputMessage("");

      // Update suggestions based on response
      if (message.aiResponse) {
        setSuggestions(getContextualSuggestions(message.category, userRole));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getDefaultSuggestions = (
    role: "guest" | "member" | "admin",
  ): string[] => {
    switch (role) {
      case "guest":
        return [
          "How does Lilly's work?",
          "What can I buy here?",
          "How to create an account?",
        ];
      case "member":
        return ["Check my earnings", "Shipping help", "Boost my sales"];
      case "admin":
        return ["System stats", "Review disputes", "User analytics"];
      default:
        return [];
    }
  };

  const getContextualSuggestions = (
    category: string,
    role: "guest" | "member" | "admin",
  ): string[] => {
    const baseSuggestions = {
      general: [
        "Tell me more",
        "How do I get started?",
        "What are the benefits?",
      ],
      sales: ["How to price items", "Photography tips", "Shipping guidelines"],
      dispute: [
        "What's the return policy?",
        "How to contact support",
        "Refund process",
      ],
      business: ["Membership options", "Commission rates", "Contact us"],
    };

    const roleSuggestions = {
      member: ["My account details", "Withdraw earnings", "List new item"],
      admin: ["User management", "System health", "Revenue reports"],
    };

    const contextSuggestions =
      baseSuggestions[category] || baseSuggestions.general;
    const roleSpecific = role !== "guest" ? roleSuggestions[role] || [] : [];

    return [...contextSuggestions, ...roleSpecific].slice(0, 3);
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-600" />;
      case "member":
        return <Crown className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin":
        return "Admin AI";
      case "member":
        return "Member AI";
      default:
        return "Guest AI";
    }
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "member":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
        {/* Role indicator */}
        <div className="absolute -top-2 -right-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${getRoleBadgeColor()}`}
          >
            {getRoleIcon()}
          </div>
        </div>
      </div>
    );
  }

  const chatContent = (
    <Card
      className={`${
        position === "fullscreen" ? "w-full h-full" : "w-80 h-96"
      } flex flex-col shadow-2xl border-2`}
    >
      <CardHeader className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <div>
              <CardTitle className="text-sm font-semibold">
                {getRoleLabel()}
              </CardTitle>
              <div className="flex items-center space-x-1 text-xs opacity-90">
                {getRoleIcon()}
                <span>
                  {userRole === "guest"
                    ? "General Help"
                    : userRole === "member"
                      ? `${user?.membershipLevel} Member`
                      : "Full Access"}
                </span>
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
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={`${message.id}-${index}`} className="space-y-2">
                  {/* User message */}
                  {message.userId !== "ai" && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-purple-600 text-white rounded-lg p-3 text-sm">
                        {message.content}
                      </div>
                    </div>
                  )}

                  {/* AI response */}
                  {message.aiResponse && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-gray-100 rounded-lg p-3 text-sm">
                        <div className="flex items-start space-x-2">
                          <Bot className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            {message.aiResponse}

                            {/* Priority indicator */}
                            {message.priority !== "low" && (
                              <div className="mt-2">
                                <Badge
                                  variant={
                                    message.priority === "urgent"
                                      ? "destructive"
                                      : message.priority === "high"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {message.priority === "urgent" && (
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                  )}
                                  {message.priority === "high" && (
                                    <Clock className="w-3 h-3 mr-1" />
                                  )}
                                  {message.priority} priority
                                </Badge>
                              </div>
                            )}

                            {/* Flagged indicator */}
                            {message.flagged && (
                              <div className="mt-2 text-xs text-orange-600 flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Escalated to admin
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <div className="text-xs text-gray-600 mb-2">Suggestions:</div>
              <div className="flex flex-wrap gap-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-auto py-1 px-2"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder={
                  userRole === "admin"
                    ? "Ask me anything..."
                    : userRole === "member"
                      ? "Ask about sales, earnings, etc..."
                      : "Ask about Lilly's Thrift..."
                }
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Role-specific features indicator */}
            <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
              <span>
                {userRole === "guest" && "Sign in for personalized help"}
                {userRole === "member" && "Access to sales & account help"}
                {userRole === "admin" && "Full system access"}
              </span>
              <div className="flex items-center space-x-1">
                {getRoleIcon()}
                {userRole === "member" && user?.membershipLevel && (
                  <Star className="w-3 h-3 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
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

export default AIChat;
