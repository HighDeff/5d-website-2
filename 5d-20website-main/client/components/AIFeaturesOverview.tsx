// AI Features Overview - Showcase AI capabilities to users
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Zap,
  Copy,
  AlertTriangle,
  Sparkles,
  Target,
  TrendingUp,
  Bell,
  CheckCircle,
  Eye,
  Folder,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AIFeaturesOverviewProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const AIFeaturesOverview: React.FC<AIFeaturesOverviewProps> = ({
  className = "",
  showTitle = true,
  compact = false,
}) => {
  const features = [
    {
      icon: <Target className="w-5 h-5 text-purple-600" />,
      title: "Smart Categorization",
      description:
        "AI automatically suggests better categories for your products based on titles, descriptions, and images.",
      benefits: [
        "Improved discoverability",
        "Better search results",
        "Proper organization",
      ],
      status: "Active",
      color: "purple",
    },
    {
      icon: <Copy className="w-5 h-5 text-blue-600" />,
      title: "Duplicate Detection",
      description:
        "Identifies similar or duplicate products across your account and other users to prevent conflicts.",
      benefits: [
        "Avoid duplicate listings",
        "Identify similar items",
        "Merge suggestions",
      ],
      status: "Active",
      color: "blue",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-green-600" />,
      title: "Content Enhancement",
      description:
        "Suggests improvements for product names, descriptions, tags, and pricing based on market analysis.",
      benefits: [
        "Better product titles",
        "SEO-optimized descriptions",
        "Competitive pricing",
      ],
      status: "Active",
      color: "green",
    },
    {
      icon: <Folder className="w-5 h-5 text-orange-600" />,
      title: "Collection Organization",
      description:
        "Recommends moving items between collections and suggests new collection structures.",
      benefits: [
        "Better organization",
        "Improved browsing",
        "Logical grouping",
      ],
      status: "Active",
      color: "orange",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-pink-600" />,
      title: "Market Insights",
      description:
        "Analyzes trends, pricing, and performance to provide actionable recommendations.",
      benefits: [
        "Price optimization",
        "Trend analysis",
        "Performance insights",
      ],
      status: "Coming Soon",
      color: "pink",
    },
    {
      icon: <Bell className="w-5 h-5 text-indigo-600" />,
      title: "Smart Notifications",
      description:
        "Receives intelligent alerts about optimization opportunities and required actions.",
      benefits: [
        "Timely alerts",
        "Action required notifications",
        "Priority management",
      ],
      status: "Active",
      color: "indigo",
    },
  ];

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        {showTitle && (
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">AI Features</h3>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              Smart
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features
            .filter((f) => f.status === "Active")
            .slice(0, 4)
            .map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex-shrink-0">{feature.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {feature.description}
                  </p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              AI-Powered Features
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI continuously analyzes your content to provide intelligent
            suggestions, detect issues, and optimize your listings for better
            performance.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 ${
              feature.status === "Coming Soon" ? "opacity-75" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <Badge
                  variant={
                    feature.status === "Active" ? "default" : "secondary"
                  }
                  className={
                    feature.status === "Active"
                      ? `bg-${feature.color}-600 text-white`
                      : "bg-gray-200 text-gray-600"
                  }
                >
                  {feature.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">{feature.description}</p>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 text-sm">Benefits:</h4>
                <ul className="space-y-1">
                  {feature.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-2 text-xs text-gray-600"
                    >
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {feature.status === "Active" && (
                <div className="pt-2">
                  <div className="flex items-center space-x-2 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Running automatically</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-2">
            Ready to optimize your listings?
          </h3>
          <p className="text-purple-100 mb-4">
            Upload your products and let our AI help you improve
            discoverability, organization, and sales performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/upload">
              <Button
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                <Zap className="w-4 h-4 mr-2" />
                Upload Products
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">24/7</div>
          <div className="text-sm text-gray-600">AI Monitoring</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">Smart</div>
          <div className="text-sm text-gray-600">Categorization</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">Auto</div>
          <div className="text-sm text-gray-600">Optimization</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">Real-time</div>
          <div className="text-sm text-gray-600">Suggestions</div>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesOverview;
