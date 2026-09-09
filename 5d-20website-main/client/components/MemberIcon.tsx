// Member Icon Component
// Shows different icons and badges based on membership level

import React from "react";
import {
  Crown,
  Star,
  Shield,
  Zap,
  Award,
  Gift,
  Users,
  Diamond,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MemberIconProps {
  membershipLevel: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const MemberIcon: React.FC<MemberIconProps> = ({
  membershipLevel,
  size = "md",
  showLabel = false,
  className = "",
}) => {
  const getMembershipDetails = (level: string) => {
    switch (level?.toLowerCase()) {
      case "premium":
        return {
          icon: Crown,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          label: "Premium",
          badgeColor: "bg-purple-600 text-white",
          description: "5% Commission",
          priority: 3,
        };
      case "member":
        return {
          icon: Star,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          label: "Member",
          badgeColor: "bg-blue-600 text-white",
          description: "10% Commission",
          priority: 2,
        };
      case "free":
        return {
          icon: Users,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          label: "Free",
          badgeColor: "bg-gray-600 text-white",
          description: "15% Commission",
          priority: 1,
        };
      case "admin":
        return {
          icon: Shield,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Admin",
          badgeColor: "bg-red-600 text-white",
          description: "Full Access",
          priority: 4,
        };
      case "vip":
        return {
          icon: Diamond,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          label: "VIP",
          badgeColor: "bg-yellow-600 text-white",
          description: "0% Commission",
          priority: 5,
        };
      default:
        return {
          icon: Users,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          label: "User",
          badgeColor: "bg-gray-600 text-white",
          description: "Basic Access",
          priority: 0,
        };
    }
  };

  const details = getMembershipDetails(membershipLevel);
  const Icon = details.icon;

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-4 h-4";
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case "sm":
        return "text-xs px-1 py-0.5";
      case "lg":
        return "text-sm px-3 py-1";
      default:
        return "text-xs px-2 py-1";
    }
  };

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div
          className={`${details.bgColor} rounded-full p-1 flex items-center justify-center`}
        >
          <Icon className={`${getIconSize()} ${details.color}`} />
        </div>
        <Badge className={`${details.badgeColor} ${getBadgeSize()}`}>
          {details.label}
        </Badge>
        {size === "lg" && (
          <span className="text-xs text-gray-500">{details.description}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${details.bgColor} rounded-full p-1 flex items-center justify-center ${className}`}
      title={`${details.label} - ${details.description}`}
    >
      <Icon className={`${getIconSize()} ${details.color}`} />
    </div>
  );
};

// Member Benefits Component
export const MemberBenefits: React.FC<{
  membershipLevel: string;
  showUpgrade?: boolean;
}> = ({ membershipLevel, showUpgrade = false }) => {
  const benefits = {
    free: [
      "15% commission rate",
      "Basic listing features",
      "Standard support",
      "Basic analytics",
    ],
    member: [
      "10% commission rate",
      "Priority listings",
      "Enhanced support",
      "Detailed analytics",
      "Early access features",
    ],
    premium: [
      "5% commission rate",
      "Featured listings",
      "Priority support",
      "Advanced analytics",
      "Exclusive features",
      "Custom branding",
    ],
    admin: [
      "Full platform access",
      "User management",
      "System analytics",
      "Dispute resolution",
      "Revenue reports",
    ],
  };

  const currentBenefits = benefits[membershipLevel] || benefits.free;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <MemberIcon membershipLevel={membershipLevel} showLabel size="lg" />
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Your Benefits:</h4>
        <ul className="space-y-1">
          {currentBenefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-sm">
              <Star className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {showUpgrade &&
        membershipLevel !== "premium" &&
        membershipLevel !== "admin" && (
          <div className="pt-3 border-t">
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              Upgrade Membership →
            </button>
          </div>
        )}
    </div>
  );
};

// Member Status Indicator
export const MemberStatusIndicator: React.FC<{
  membershipLevel: string;
  verified?: boolean;
  className?: string;
}> = ({ membershipLevel, verified = false, className = "" }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <MemberIcon membershipLevel={membershipLevel} size="sm" />
      {verified && (
        <div className="bg-green-100 rounded-full p-0.5">
          <Shield className="w-2 h-2 text-green-600" />
        </div>
      )}
    </div>
  );
};

export default MemberIcon;
