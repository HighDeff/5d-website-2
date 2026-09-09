// Social Features Service - Handles likes, votes, discounts, and social interactions
export interface ProductLike {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface ProductVote {
  id: string;
  userId: string;
  productId: string;
  voteType: "up" | "down" | "favorite";
  weight: number; // For weighted voting
  createdAt: string;
}

export interface FriendDiscount {
  id: string;
  sellerId: string;
  productId?: string; // If null, applies to all products
  discountPercentage: number;
  friendIds: string[]; // Specific friends who get the discount
  validUntil: string;
  maxUses?: number;
  usedCount: number;
  createdAt: string;
  isActive: boolean;
}

export interface ProductFavorite {
  id: string;
  userId: string;
  productId: string;
  sellerId: string;
  createdAt: string;
}

export interface BiddingPreference {
  userId: string;
  allowBidding: boolean;
  minimumBidIncrement: number;
  autoAcceptThreshold?: number; // Auto-accept bids above this amount
  biddingCategories: string[]; // Categories they allow bidding on
}

class SocialFeaturesService {
  private likes: ProductLike[] = [];
  private votes: ProductVote[] = [];
  private friendDiscounts: FriendDiscount[] = [];
  private favorites: ProductFavorite[] = [];
  private biddingPreferences: BiddingPreference[] = [];

  constructor() {
    this.loadData();
  }

  // ===== LIKES SYSTEM =====
  toggleProductLike(userId: string, productId: string): boolean {
    const existingLike = this.likes.find(
      (like) => like.userId === userId && like.productId === productId,
    );

    if (existingLike) {
      // Remove like
      this.likes = this.likes.filter((like) => like.id !== existingLike.id);
    } else {
      // Add like
      const newLike: ProductLike = {
        id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        productId,
        createdAt: new Date().toISOString(),
      };
      this.likes.push(newLike);
    }

    this.saveLikes();
    return !existingLike; // Return true if liked, false if unliked
  }

  getProductLikes(productId: string): ProductLike[] {
    return this.likes.filter((like) => like.productId === productId);
  }

  getUserLikes(userId: string): ProductLike[] {
    return this.likes.filter((like) => like.userId === userId);
  }

  // ===== VOTING SYSTEM =====
  voteOnProduct(
    userId: string,
    productId: string,
    voteType: "up" | "down" | "favorite",
    weight: number = 1,
  ): boolean {
    try {
      // Remove existing vote from same user on same product
      this.votes = this.votes.filter(
        (vote) => !(vote.userId === userId && vote.productId === productId),
      );

      // Add new vote
      const newVote: ProductVote = {
        id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        productId,
        voteType,
        weight,
        createdAt: new Date().toISOString(),
      };

      this.votes.push(newVote);
      this.saveVotes();
      return true;
    } catch (error) {
      console.error("Error voting on product:", error);
      return false;
    }
  }

  getProductVotes(productId: string): {
    upVotes: number;
    downVotes: number;
    favoriteVotes: number;
    totalScore: number;
  } {
    const productVotes = this.votes.filter(
      (vote) => vote.productId === productId,
    );

    const upVotes = productVotes
      .filter((v) => v.voteType === "up")
      .reduce((sum, v) => sum + v.weight, 0);
    const downVotes = productVotes
      .filter((v) => v.voteType === "down")
      .reduce((sum, v) => sum + v.weight, 0);
    const favoriteVotes = productVotes
      .filter((v) => v.voteType === "favorite")
      .reduce((sum, v) => sum + v.weight, 0);

    return {
      upVotes,
      downVotes,
      favoriteVotes,
      totalScore: upVotes - downVotes + favoriteVotes * 2,
    };
  }

  // ===== FRIEND DISCOUNTS =====
  createFriendDiscount(
    sellerId: string,
    discountData: {
      productId?: string;
      discountPercentage: number;
      friendIds: string[];
      validUntil: string;
      maxUses?: number;
    },
  ): string {
    const discount: FriendDiscount = {
      id: `discount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sellerId,
      productId: discountData.productId,
      discountPercentage: discountData.discountPercentage,
      friendIds: discountData.friendIds,
      validUntil: discountData.validUntil,
      maxUses: discountData.maxUses,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    this.friendDiscounts.push(discount);
    this.saveFriendDiscounts();
    return discount.id;
  }

  getFriendDiscount(
    userId: string,
    productId: string,
    sellerId: string,
  ): FriendDiscount | null {
    return (
      this.friendDiscounts.find(
        (discount) =>
          discount.isActive &&
          discount.friendIds.includes(userId) &&
          (discount.productId === productId || !discount.productId) &&
          discount.sellerId === sellerId &&
          new Date(discount.validUntil) > new Date() &&
          (!discount.maxUses || discount.usedCount < discount.maxUses),
      ) || null
    );
  }

  useFriendDiscount(discountId: string): boolean {
    const discount = this.friendDiscounts.find((d) => d.id === discountId);
    if (discount) {
      discount.usedCount++;
      this.saveFriendDiscounts();
      return true;
    }
    return false;
  }

  getSellerDiscounts(sellerId: string): FriendDiscount[] {
    return this.friendDiscounts.filter(
      (discount) => discount.sellerId === sellerId,
    );
  }

  // ===== FAVORITES SYSTEM =====
  toggleProductFavorite(
    userId: string,
    productId: string,
    sellerId: string,
  ): boolean {
    const existingFavorite = this.favorites.find(
      (fav) => fav.userId === userId && fav.productId === productId,
    );

    if (existingFavorite) {
      // Remove favorite
      this.favorites = this.favorites.filter(
        (fav) => fav.id !== existingFavorite.id,
      );
    } else {
      // Add favorite
      const newFavorite: ProductFavorite = {
        id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        productId,
        sellerId,
        createdAt: new Date().toISOString(),
      };
      this.favorites.push(newFavorite);
    }

    this.saveFavorites();
    return !existingFavorite;
  }

  getUserFavorites(userId: string): ProductFavorite[] {
    return this.favorites.filter((fav) => fav.userId === userId);
  }

  getProductFavorites(productId: string): ProductFavorite[] {
    return this.favorites.filter((fav) => fav.productId === productId);
  }

  // ===== BIDDING PREFERENCES =====
  setBiddingPreferences(preferences: BiddingPreference): boolean {
    try {
      // Remove existing preferences for user
      this.biddingPreferences = this.biddingPreferences.filter(
        (pref) => pref.userId !== preferences.userId,
      );

      // Add new preferences
      this.biddingPreferences.push(preferences);
      this.saveBiddingPreferences();
      return true;
    } catch (error) {
      console.error("Error setting bidding preferences:", error);
      return false;
    }
  }

  getBiddingPreferences(userId: string): BiddingPreference | null {
    return (
      this.biddingPreferences.find((pref) => pref.userId === userId) || null
    );
  }

  // ===== ANALYTICS =====
  getTopRatedProducts(limit: number = 20): any[] {
    // Get all products and their votes
    const productScores = new Map<string, number>();

    this.votes.forEach((vote) => {
      const currentScore = productScores.get(vote.productId) || 0;
      let scoreChange = 0;

      switch (vote.voteType) {
        case "up":
          scoreChange = vote.weight;
          break;
        case "down":
          scoreChange = -vote.weight;
          break;
        case "favorite":
          scoreChange = vote.weight * 2;
          break;
      }

      productScores.set(vote.productId, currentScore + scoreChange);
    });

    // Sort by score and return top products
    return Array.from(productScores.entries())
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, limit)
      .map(([productId, score]) => ({ productId, score }));
  }

  getMostLikedProducts(limit: number = 20): any[] {
    const likeCounts = new Map<string, number>();

    this.likes.forEach((like) => {
      const currentCount = likeCounts.get(like.productId) || 0;
      likeCounts.set(like.productId, currentCount + 1);
    });

    return Array.from(likeCounts.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, limit)
      .map(([productId, likeCount]) => ({ productId, likeCount }));
  }

  // ===== DATA PERSISTENCE =====
  private loadData(): void {
    try {
      const savedLikes = localStorage.getItem("socialFeatures_likes");
      if (savedLikes) this.likes = JSON.parse(savedLikes);

      const savedVotes = localStorage.getItem("socialFeatures_votes");
      if (savedVotes) this.votes = JSON.parse(savedVotes);

      const savedDiscounts = localStorage.getItem("socialFeatures_discounts");
      if (savedDiscounts) this.friendDiscounts = JSON.parse(savedDiscounts);

      const savedFavorites = localStorage.getItem("socialFeatures_favorites");
      if (savedFavorites) this.favorites = JSON.parse(savedFavorites);

      const savedBidding = localStorage.getItem(
        "socialFeatures_biddingPreferences",
      );
      if (savedBidding) this.biddingPreferences = JSON.parse(savedBidding);
    } catch (error) {
      console.error("Error loading social features data:", error);
    }
  }

  private saveLikes(): void {
    localStorage.setItem("socialFeatures_likes", JSON.stringify(this.likes));
  }

  private saveVotes(): void {
    localStorage.setItem("socialFeatures_votes", JSON.stringify(this.votes));
  }

  private saveFriendDiscounts(): void {
    localStorage.setItem(
      "socialFeatures_discounts",
      JSON.stringify(this.friendDiscounts),
    );
  }

  private saveFavorites(): void {
    localStorage.setItem(
      "socialFeatures_favorites",
      JSON.stringify(this.favorites),
    );
  }

  private saveBiddingPreferences(): void {
    localStorage.setItem(
      "socialFeatures_biddingPreferences",
      JSON.stringify(this.biddingPreferences),
    );
  }
}

// Export singleton instance
export default new SocialFeaturesService();
