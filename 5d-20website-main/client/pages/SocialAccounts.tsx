import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Instagram,
  Youtube,
  Facebook,
  Heart,
  MessageCircle,
  Share,
  Play,
} from "lucide-react";

export default function SocialAccounts() {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "instagram";

  const platformData = {
    instagram: {
      name: "Instagram",
      handle: "@lillysfashioncouture",
      followers: "127K",
      following: "1,205",
      posts: "892",
      icon: Instagram,
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      recentPosts: [
        {
          id: 1,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933",
          caption:
            "New Black Elegance Collection drops tomorrow! ✨ Who's ready to elevate their wardrobe? #LillysStyle #BlackElegance",
          likes: "2,847",
          comments: "156",
        },
        {
          id: 2,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fa1c557bde8fe4b8bbd85882c9aaa8df3",
          caption:
            "Behind the scenes of our Ocean Dreams photoshoot 🌊 The magic happens when creativity flows like water #BehindTheScenes",
          likes: "3,121",
          comments: "203",
        },
        {
          id: 3,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F1856dd4a29f54d25aab2a1f95437b145",
          caption:
            "Rainbow Burst Scarf - because life is too short for boring accessories! 🌈 Shop now (link in bio)",
          likes: "1,924",
          comments: "87",
        },
        {
          id: 4,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F96d971342d9f489a899785b4254dba6c",
          caption:
            "Azure Pattern styling tip: Pair with neutral accessories to let the pattern shine ✨ #StylingTips",
          likes: "2,456",
          comments: "124",
        },
      ],
    },
    youtube: {
      name: "YouTube",
      handle: "Lilly's Fashion Couture",
      followers: "89K",
      following: "342",
      posts: "127",
      icon: Youtube,
      color: "bg-red-500",
      recentPosts: [
        {
          id: 1,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F43bf2e35e44b458fb944c73fb35a5605",
          caption: "How to Style a Classic Plaid Robe for Any Occasion",
          likes: "3,847",
          comments: "189",
          duration: "8:24",
        },
        {
          id: 2,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fc15060186fc94e5586b70291e8647e98",
          caption: "Blue Daisy Dress Unboxing & First Impressions",
          likes: "2,156",
          comments: "95",
          duration: "12:15",
        },
        {
          id: 3,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Ff8c285ee3c4c4d97ac1282d61ad30f7d",
          caption: "Silver Metallic Dress - Evening Look Tutorial",
          likes: "4,322",
          comments: "267",
          duration: "15:33",
        },
        {
          id: 4,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb48aaef84c5d4e5fa9960bc14ba3849e",
          caption: "Men's Grooming Essentials ft. AXE Ice Chill",
          likes: "1,876",
          comments: "78",
          duration: "6:42",
        },
      ],
    },
    facebook: {
      name: "Facebook",
      handle: "Lilly's Fashion Couture",
      followers: "156K",
      following: "892",
      posts: "1,456",
      icon: Facebook,
      color: "bg-blue-600",
      recentPosts: [
        {
          id: 1,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fec6faad76e0a4127a1b1793b6e79281f",
          caption:
            "Elevate your professional wardrobe with our Blue Geometric Tie collection. Perfect for boardroom meetings and special occasions. What's your go-to professional look?",
          likes: "892",
          comments: "45",
        },
        {
          id: 2,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2Fb63f0de2c2464a0d8288e436d1dcbc11",
          caption:
            "Self-care Sunday with our Premium Hand Soap collection 🧼 Because beautiful hands deserve beautiful care. Tag someone who needs this reminder!",
          likes: "1,234",
          comments: "67",
        },
        {
          id: 3,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F3369878a736a4948877a7c9df2752887",
          caption:
            "Navy Floral Shorts are back in stock! Perfect for summer adventures and weekend getaways. Limited quantities available.",
          likes: "756",
          comments: "23",
        },
        {
          id: 4,
          image:
            "https://cdn.builder.io/api/v1/image/assets%2F05b041be32d34efbb1e61aac38222b43%2F0822c9a99e90454e90fb2668b0c76933",
          caption:
            "Black never goes out of style. Our Black Elegance Collection embodies timeless sophistication. Which piece speaks to you?",
          likes: "2,134",
          comments: "89",
        },
      ],
    },
  };

  const currentPlatform = platformData[platform as keyof typeof platformData];
  const IconComponent = currentPlatform.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full ${currentPlatform.color} flex items-center justify-center`}
              >
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">{currentPlatform.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Platform Tabs */}
        <div className="flex space-x-4 mb-8">
          {Object.entries(platformData).map(([key, data]) => {
            const TabIcon = data.icon;
            return (
              <Link
                key={key}
                to={`/social-accounts?platform=${key}`}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  platform === key
                    ? `${data.color} text-white`
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span className="font-medium">{data.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div
                className={`w-24 h-24 rounded-full ${currentPlatform.color} flex items-center justify-center`}
              >
                <IconComponent className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {currentPlatform.name}
                </h2>
                <p className="text-gray-600 mb-4">{currentPlatform.handle}</p>
                <div className="flex space-x-6 text-sm">
                  <div>
                    <span className="font-bold">{currentPlatform.posts}</span>
                    <span className="text-gray-600 ml-1">posts</span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {currentPlatform.followers}
                    </span>
                    <span className="text-gray-600 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {currentPlatform.following}
                    </span>
                    <span className="text-gray-600 ml-1">following</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button className={currentPlatform.color}>Follow</Button>
                <Button variant="outline">Message</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <div>
          <h3 className="text-xl font-bold mb-6">Recent Posts</h3>
          <div className="grid gap-6">
            {currentPlatform.recentPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative w-64 h-64 flex-shrink-0">
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                      {post.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs flex items-center">
                          <Play className="w-3 h-3 mr-1" />
                          {post.duration}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <p className="text-gray-800 mb-4 leading-relaxed">
                        {post.caption}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share className="w-4 h-4" />
                          <span>Share</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(
                            Date.now() -
                              Math.random() * 7 * 24 * 60 * 60 * 1000,
                          ).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
