import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, Facebook, Heart, Gift, X } from "lucide-react";

interface SocialMediaPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialMediaPopup({
  isOpen,
  onClose,
}: SocialMediaPopupProps) {
  const [followedAccounts, setFollowedAccounts] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [showDiscount, setShowDiscount] = useState(false);

  const socialAccounts = [
    {
      id: "instagram",
      name: "Instagram",
      handle: "@lillysfashioncouture",
      followers: "127K",
      icon: Instagram,
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      url: "/social-accounts?platform=instagram",
    },
    {
      id: "youtube",
      name: "YouTube",
      handle: "Lilly's Fashion Couture",
      followers: "89K",
      icon: Youtube,
      color: "bg-red-500",
      url: "/social-accounts?platform=youtube",
    },
    {
      id: "facebook",
      name: "Facebook",
      handle: "Lilly's Fashion Couture",
      followers: "156K",
      icon: Facebook,
      color: "bg-blue-600",
      url: "/social-accounts?platform=facebook",
    },
  ];

  const handleFollow = (accountId: string) => {
    if (!followedAccounts.includes(accountId)) {
      setFollowedAccounts([...followedAccounts, accountId]);
    }
  };

  const handleLike = (postId: string) => {
    if (!likedPosts.includes(postId)) {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const checkForDiscount = () => {
    if (followedAccounts.length >= 2 && likedPosts.length >= 3) {
      setShowDiscount(true);
    }
  };

  // Check for discount whenever follows or likes change
  useEffect(() => {
    checkForDiscount();
  }, [followedAccounts, likedPosts]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Follow Lilly's Fashion Couture
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-600">
            Stay connected with our latest collections, behind-the-scenes
            content, and exclusive offers!
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Social Media Accounts */}
          <div className="grid gap-4">
            {socialAccounts.map((account) => {
              const IconComponent = account.icon;
              const isFollowed = followedAccounts.includes(account.id);

              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full ${account.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{account.name}</h3>
                      <p className="text-sm text-gray-600">{account.handle}</p>
                      <Badge variant="secondary" className="text-xs">
                        {account.followers} followers
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isFollowed && (
                      <Badge className="bg-green-100 text-green-800">
                        Following
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant={isFollowed ? "outline" : "default"}
                      onClick={() => {
                        handleFollow(account.id);
                        window.open(account.url, "_blank");
                      }}
                      className={
                        isFollowed ? "border-green-500 text-green-600" : ""
                      }
                    >
                      {isFollowed ? "✓ Following" : "Follow"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sample Posts to Like */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 text-lg">
              Latest Posts - Show Some Love!
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  id: "post1",
                  image:
                    "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933",
                  caption: "New Black Elegance Collection ✨",
                },
                {
                  id: "post2",
                  image:
                    "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3",
                  caption: "Ocean Dreams - Behind the Scenes 🌊",
                },
                {
                  id: "post3",
                  image:
                    "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145",
                  caption: "Rainbow Burst Scarf Tutorial 🌈",
                },
                {
                  id: "post4",
                  image:
                    "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c",
                  caption: "Azure Pattern Styling Tips 💙",
                },
              ].map((post) => {
                const isLiked = likedPosts.includes(post.id);

                return (
                  <div
                    key={post.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm mb-2">{post.caption}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLike(post.id)}
                        className={`${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
                      >
                        <Heart
                          className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`}
                        />
                        {isLiked ? "Liked" : "Like"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discount Reward */}
          {showDiscount && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <Gift className="w-8 h-8 text-pink-600" />
                <div>
                  <h3 className="font-bold text-lg text-pink-800">
                    Congratulations! 🎉
                  </h3>
                  <p className="text-pink-700">
                    You've unlocked a <strong>15% discount</strong> on your next
                    purchase!
                  </p>
                  <Badge className="mt-2 bg-pink-600 text-white">
                    Code: SOCIAL15
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Unlock Your Discount:</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Follow 2+ accounts:</span>
                <Badge
                  variant={
                    followedAccounts.length >= 2 ? "default" : "secondary"
                  }
                >
                  {followedAccounts.length}/2
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Like 3+ posts:</span>
                <Badge
                  variant={likedPosts.length >= 3 ? "default" : "secondary"}
                >
                  {likedPosts.length}/3
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
