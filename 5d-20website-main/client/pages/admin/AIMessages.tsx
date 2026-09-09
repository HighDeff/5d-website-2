// AI Messages Admin Page
// Dedicated page for viewing and managing AI-filtered messages

import React from "react";
import { Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AdminFilteredMessages from "../../components/AdminFilteredMessages";
import AIChat from "../../components/AIChat";

const AIMessages: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/database"
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                  LILLY'S
                </h1>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-purple-600 mx-2">/</span>
                <span className="text-purple-800 font-bold">AI Messages</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin/database">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
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
                  <Brain className="w-8 h-8 mr-3 text-blue-600" />
                  AI Filtered Messages
                </h1>
                <p className="text-gray-600 mt-2">
                  Important messages and disputes filtered by AI for admin
                  attention
                </p>
              </div>
            </div>
          </div>

          {/* Filtered Messages Component */}
          <AdminFilteredMessages />
        </div>
      </main>

      {/* Admin AI Chat */}
      <AIChat position="bottom-right" />
    </div>
  );
};

export default AIMessages;
