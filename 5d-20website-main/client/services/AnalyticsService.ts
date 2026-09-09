// Analytics Service - Comprehensive analytics for users, products, and site profits
export interface SiteAnalytics {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  siteProfit: number;
  commission: number;
  topSellers: any[];
  topProducts: any[];
  memberAnalytics: {
    members: number;
    guests: number;
    premiumMembers: number;
  };
  profitBreakdown: {
    memberSales: number;
    guestSales: number;
    commissionEarned: number;
    taxesCollected: number;
    returnsLoss: number;
    netProfit: number;
  };
}

export interface UserAnalytics {
  userId: string;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  commission: number;
  topSellingProducts: any[];
  salesTrend: any[];
  categoryBreakdown: any[];
  profits: number;
  returns: number;
  taxesOwed: number;
  taxesPaid: number;
  sourcingItems: any[];
  resellingForOthers: any[];
}

export interface SearchAnalytics {
  topSearchTerms: string[];
  popularCategories: string[];
  userSearchBehavior: any[];
  conversionRates: any[];
}

class AnalyticsService {
  private isAdminProfitHidden: boolean = false;
  private searchHistory: any[] = [];

  constructor() {
    this.loadSettings();
  }

  // ===== SITE-WIDE ANALYTICS =====
  getSiteAnalytics(): SiteAnalytics {
    try {
      const users = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const products = JSON.parse(localStorage.getItem("allProducts") || "[]");
      const sales = JSON.parse(localStorage.getItem("allSales") || "[]");
      const returns = JSON.parse(localStorage.getItem("returns") || "[]");
      const taxes = JSON.parse(localStorage.getItem("taxRecords") || "[]");

      // Basic counts
      const totalUsers = users.length;
      const totalProducts = products.length;
      const totalSales = sales.length;

      // Member breakdown
      const members = users.filter((u: any) => u.membershipLevel !== "free");
      const guests = users.filter((u: any) => u.membershipLevel === "free");
      const premiumMembers = users.filter(
        (u: any) => u.membershipLevel === "premium",
      );

      // Revenue calculations
      const totalRevenue = sales.reduce(
        (sum: number, sale: any) => sum + (sale.amount || 0),
        0,
      );

      // Commission calculation (varies by membership level)
      const commissionEarned = sales.reduce((sum: number, sale: any) => {
        const seller = users.find((u: any) => u.id === sale.sellerId);
        const rate = this.getCommissionRate(seller?.membershipLevel || "free");
        return sum + (sale.amount || 0) * rate;
      }, 0);

      // Returns loss
      const returnsLoss = returns.reduce(
        (sum: number, ret: any) => sum + (ret.amount || 0),
        0,
      );

      // Taxes collected
      const taxesCollected = taxes.reduce(
        (sum: number, tax: any) => sum + (tax.amount || 0),
        0,
      );

      // Net profit
      const netProfit = commissionEarned + taxesCollected - returnsLoss;

      // Top sellers and products
      const topSellers = this.getTopSellers(users, sales, 10);
      const topProducts = this.getTopProducts(products, sales, 10);

      return {
        totalUsers,
        totalProducts,
        totalSales,
        totalRevenue,
        siteProfit: this.isAdminProfitHidden ? 0 : netProfit,
        commission: this.isAdminProfitHidden ? 0 : commissionEarned,
        topSellers,
        topProducts,
        memberAnalytics: {
          members: members.length,
          guests: guests.length,
          premiumMembers: premiumMembers.length,
        },
        profitBreakdown: {
          memberSales: this.getMemberSales(sales, users),
          guestSales: this.getGuestSales(sales, users),
          commissionEarned: this.isAdminProfitHidden ? 0 : commissionEarned,
          taxesCollected: this.isAdminProfitHidden ? 0 : taxesCollected,
          returnsLoss,
          netProfit: this.isAdminProfitHidden ? 0 : netProfit,
        },
      };
    } catch (error) {
      console.error("Error calculating site analytics:", error);
      return this.getEmptyAnalytics();
    }
  }

  // ===== USER ANALYTICS =====
  getUserAnalytics(userId: string): UserAnalytics {
    try {
      const products = JSON.parse(localStorage.getItem("allProducts") || "[]");
      const sales = JSON.parse(localStorage.getItem("allSales") || "[]");
      const returns = JSON.parse(localStorage.getItem("returns") || "[]");
      const taxes = JSON.parse(localStorage.getItem("taxRecords") || "[]");
      const sourcing = JSON.parse(
        localStorage.getItem("sourcingItems") || "[]",
      );
      const users = JSON.parse(localStorage.getItem("allUsers") || "[]");

      const user = users.find((u: any) => u.id === userId);
      const userProducts = products.filter((p: any) => p.sellerId === userId);
      const userSales = sales.filter((s: any) => s.sellerId === userId);
      const userReturns = returns.filter((r: any) => r.sellerId === userId);
      const userTaxes = taxes.filter((t: any) => t.userId === userId);
      const userSourcing = sourcing.filter((s: any) => s.userId === userId);

      // Calculate totals
      const totalRevenue = userSales.reduce(
        (sum: number, sale: any) => sum + (sale.amount || 0),
        0,
      );
      const commissionRate = this.getCommissionRate(
        user?.membershipLevel || "free",
      );
      const commission = totalRevenue * commissionRate;
      const profits = totalRevenue - commission;

      const returnsLoss = userReturns.reduce(
        (sum: number, ret: any) => sum + (ret.amount || 0),
        0,
      );

      const taxesOwed = userTaxes.reduce(
        (sum: number, tax: any) => sum + (tax.amountOwed || 0),
        0,
      );
      const taxesPaid = userTaxes.reduce(
        (sum: number, tax: any) => sum + (tax.amountPaid || 0),
        0,
      );

      return {
        userId,
        totalProducts: userProducts.length,
        totalSales: userSales.length,
        totalRevenue,
        commission,
        topSellingProducts: this.getUserTopProducts(userProducts, userSales),
        salesTrend: this.getUserSalesTrend(userSales),
        categoryBreakdown: this.getUserCategoryBreakdown(userProducts),
        profits: profits - returnsLoss,
        returns: returnsLoss,
        taxesOwed,
        taxesPaid,
        sourcingItems: userSourcing.filter((s: any) => s.type === "sourcing"),
        resellingForOthers: userSourcing.filter(
          (s: any) => s.type === "reselling",
        ),
      };
    } catch (error) {
      console.error("Error calculating user analytics:", error);
      return this.getEmptyUserAnalytics(userId);
    }
  }

  // ===== SEARCH ANALYTICS =====
  trackSearch(
    userId: string,
    searchTerm: string,
    category?: string,
    results?: number,
  ): void {
    const searchRecord = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      searchTerm: searchTerm.toLowerCase(),
      category,
      resultsCount: results || 0,
      timestamp: new Date().toISOString(),
    };

    this.searchHistory.push(searchRecord);

    // Keep only last 10000 searches
    if (this.searchHistory.length > 10000) {
      this.searchHistory = this.searchHistory.slice(-10000);
    }

    this.saveSearchHistory();
  }

  getSearchAnalytics(): SearchAnalytics {
    const termCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();

    this.searchHistory.forEach((search) => {
      // Count search terms
      const currentCount = termCounts.get(search.searchTerm) || 0;
      termCounts.set(search.searchTerm, currentCount + 1);

      // Count categories
      if (search.category) {
        const categoryCount = categoryCounts.get(search.category) || 0;
        categoryCounts.set(search.category, categoryCount + 1);
      }
    });

    const topSearchTerms = Array.from(termCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([term]) => term);

    const popularCategories = Array.from(categoryCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([category]) => category);

    return {
      topSearchTerms,
      popularCategories,
      userSearchBehavior: this.getUserSearchBehavior(),
      conversionRates: this.getSearchConversionRates(),
    };
  }

  // ===== BEST SELLERS =====
  getBestSellers(
    memberType: "all" | "members" | "guests" = "all",
    limit: number = 20,
  ): any[] {
    try {
      const sales = JSON.parse(localStorage.getItem("allSales") || "[]");
      const products = JSON.parse(localStorage.getItem("allProducts") || "[]");
      const users = JSON.parse(localStorage.getItem("allUsers") || "[]");

      // Filter sales by member type
      let filteredSales = sales;
      if (memberType !== "all") {
        filteredSales = sales.filter((sale: any) => {
          const seller = users.find((u: any) => u.id === sale.sellerId);
          if (memberType === "guests") {
            return !seller || seller.membershipLevel === "free" || sale.isGuest;
          } else {
            return seller && seller.membershipLevel !== "free";
          }
        });
      }

      // Count sales by product
      const productSales = new Map<string, number>();
      filteredSales.forEach((sale: any) => {
        const currentCount = productSales.get(sale.productId) || 0;
        productSales.set(sale.productId, currentCount + 1);
      });

      // Get top selling products with details
      return Array.from(productSales.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([productId, salesCount]) => {
          const product = products.find((p: any) => p.id === productId);
          const seller = users.find((u: any) => u.id === product?.sellerId);
          return {
            productId,
            product,
            seller,
            salesCount,
            revenue: filteredSales
              .filter((s: any) => s.productId === productId)
              .reduce((sum: number, s: any) => sum + (s.amount || 0), 0),
          };
        });
    } catch (error) {
      console.error("Error getting best sellers:", error);
      return [];
    }
  }

  // ===== ADMIN CONTROLS =====
  toggleProfitVisibility(hide: boolean): void {
    this.isAdminProfitHidden = hide;
    this.saveSettings();
  }

  isProfitHidden(): boolean {
    return this.isAdminProfitHidden;
  }

  // ===== PRIVATE HELPER METHODS =====
  private getCommissionRate(membershipLevel: string): number {
    switch (membershipLevel) {
      case "premium":
        return 0.05; // 5%
      case "member":
        return 0.1; // 10%
      case "free":
      default:
        return 0.15; // 15%
    }
  }

  private getTopSellers(users: any[], sales: any[], limit: number): any[] {
    const sellerSales = new Map<string, { count: number; revenue: number }>();

    sales.forEach((sale: any) => {
      const current = sellerSales.get(sale.sellerId) || {
        count: 0,
        revenue: 0,
      };
      sellerSales.set(sale.sellerId, {
        count: current.count + 1,
        revenue: current.revenue + (sale.amount || 0),
      });
    });

    return Array.from(sellerSales.entries())
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, limit)
      .map(([sellerId, stats]) => {
        const seller = users.find((u: any) => u.id === sellerId);
        return { seller, ...stats };
      });
  }

  private getTopProducts(products: any[], sales: any[], limit: number): any[] {
    const productSales = new Map<string, number>();

    sales.forEach((sale: any) => {
      const current = productSales.get(sale.productId) || 0;
      productSales.set(sale.productId, current + (sale.amount || 0));
    });

    return Array.from(productSales.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([productId, revenue]) => {
        const product = products.find((p: any) => p.id === productId);
        return { product, revenue };
      });
  }

  private getMemberSales(sales: any[], users: any[]): number {
    return sales
      .filter((sale: any) => {
        const seller = users.find((u: any) => u.id === sale.sellerId);
        return seller && seller.membershipLevel !== "free";
      })
      .reduce((sum: number, sale: any) => sum + (sale.amount || 0), 0);
  }

  private getGuestSales(sales: any[], users: any[]): number {
    return sales
      .filter((sale: any) => {
        const seller = users.find((u: any) => u.id === sale.sellerId);
        return !seller || seller.membershipLevel === "free" || sale.isGuest;
      })
      .reduce((sum: number, sale: any) => sum + (sale.amount || 0), 0);
  }

  private getUserTopProducts(products: any[], sales: any[]): any[] {
    const productSales = new Map<string, number>();

    sales.forEach((sale: any) => {
      const current = productSales.get(sale.productId) || 0;
      productSales.set(sale.productId, current + 1);
    });

    return Array.from(productSales.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, count]) => {
        const product = products.find((p: any) => p.id === productId);
        return { product, salesCount: count };
      });
  }

  private getUserSalesTrend(sales: any[]): any[] {
    // Group sales by month for trend analysis
    const monthlyData = new Map<string, number>();

    sales.forEach((sale: any) => {
      const date = new Date(sale.date || sale.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const current = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, current + (sale.amount || 0));
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));
  }

  private getUserCategoryBreakdown(products: any[]): any[] {
    const categoryData = new Map<string, number>();

    products.forEach((product: any) => {
      const category = product.category || "Other";
      const current = categoryData.get(category) || 0;
      categoryData.set(category, current + 1);
    });

    return Array.from(categoryData.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }

  private getUserSearchBehavior(): any[] {
    // Analyze user search patterns
    const userSearches = new Map<string, number>();

    this.searchHistory.forEach((search) => {
      const current = userSearches.get(search.userId) || 0;
      userSearches.set(search.userId, current + 1);
    });

    return Array.from(userSearches.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([userId, searches]) => ({ userId, searches }));
  }

  private getSearchConversionRates(): any[] {
    // Calculate conversion rates for search terms
    // This would require purchase tracking after searches
    return [];
  }

  private getEmptyAnalytics(): SiteAnalytics {
    return {
      totalUsers: 0,
      totalProducts: 0,
      totalSales: 0,
      totalRevenue: 0,
      siteProfit: 0,
      commission: 0,
      topSellers: [],
      topProducts: [],
      memberAnalytics: { members: 0, guests: 0, premiumMembers: 0 },
      profitBreakdown: {
        memberSales: 0,
        guestSales: 0,
        commissionEarned: 0,
        taxesCollected: 0,
        returnsLoss: 0,
        netProfit: 0,
      },
    };
  }

  private getEmptyUserAnalytics(userId: string): UserAnalytics {
    return {
      userId,
      totalProducts: 0,
      totalSales: 0,
      totalRevenue: 0,
      commission: 0,
      topSellingProducts: [],
      salesTrend: [],
      categoryBreakdown: [],
      profits: 0,
      returns: 0,
      taxesOwed: 0,
      taxesPaid: 0,
      sourcingItems: [],
      resellingForOthers: [],
    };
  }

  private loadSettings(): void {
    try {
      const settings = localStorage.getItem("analyticsSettings");
      if (settings) {
        const parsed = JSON.parse(settings);
        this.isAdminProfitHidden = parsed.hideProfit || false;
      }

      const searchHistory = localStorage.getItem("searchHistory");
      if (searchHistory) {
        this.searchHistory = JSON.parse(searchHistory);
      }
    } catch (error) {
      console.error("Error loading analytics settings:", error);
    }
  }

  private saveSettings(): void {
    try {
      const settings = {
        hideProfit: this.isAdminProfitHidden,
      };
      localStorage.setItem("analyticsSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving analytics settings:", error);
    }
  }

  private saveSearchHistory(): void {
    try {
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  }
}

// Export singleton instance
export default new AnalyticsService();
