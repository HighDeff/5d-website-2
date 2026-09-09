// Guest Sales Service - Handles guest purchases and sales
export interface GuestSale {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sellerEmail: string;
  buyerEmail: string;
  buyerName: string;
  amount: number;
  commission: number;
  platformFee: number;
  netAmount: number;
  date: string;
  status: "pending" | "processing" | "completed" | "shipped";
  paymentMethod: "paypal" | "cashapp" | "stripe";
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
}

export interface GuestPurchase {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  date: string;
  status: "pending" | "processing" | "completed" | "shipped" | "delivered";
  orderNumber: string;
  paymentMethod: string;
}

class GuestSalesService {
  private guestSales: GuestSale[] = [];
  private guestPurchases: GuestPurchase[] = [];

  constructor() {
    this.loadGuestData();
  }

  /**
   * Record a guest sale
   */
  recordGuestSale(saleData: {
    productId: string;
    productName: string;
    productImage: string;
    sellerEmail: string;
    buyerEmail: string;
    buyerName: string;
    amount: number;
    paymentMethod: "paypal" | "cashapp" | "stripe";
    shippingAddress?: any;
  }): GuestSale {
    const commission = this.calculateCommission(saleData.amount);
    const platformFee = this.calculatePlatformFee(saleData.amount);
    const netAmount = saleData.amount - commission - platformFee;

    const guestSale: GuestSale = {
      id: `guest_sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...saleData,
      commission,
      platformFee,
      netAmount,
      date: new Date().toISOString(),
      status: "pending",
    };

    this.guestSales.push(guestSale);
    this.saveGuestSales();

    return guestSale;
  }

  /**
   * Record a guest purchase
   */
  recordGuestPurchase(purchaseData: {
    productId: string;
    productName: string;
    productImage: string;
    sellerId: string;
    sellerName: string;
    amount: number;
    paymentMethod: string;
  }): GuestPurchase {
    const guestPurchase: GuestPurchase = {
      id: `guest_purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...purchaseData,
      date: new Date().toISOString(),
      status: "pending",
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
    };

    this.guestPurchases.push(guestPurchase);
    this.saveGuestPurchases();

    return guestPurchase;
  }

  /**
   * Get all guest sales
   */
  getGuestSales(): GuestSale[] {
    return [...this.guestSales];
  }

  /**
   * Get all guest purchases
   */
  getGuestPurchases(): GuestPurchase[] {
    return [...this.guestPurchases];
  }

  /**
   * Get guest sales by email
   */
  getGuestSalesByEmail(email: string): GuestSale[] {
    return this.guestSales.filter(
      (sale) => sale.sellerEmail === email || sale.buyerEmail === email,
    );
  }

  /**
   * Update guest sale status
   */
  updateGuestSaleStatus(
    saleId: string,
    status: GuestSale["status"],
    trackingNumber?: string,
  ): boolean {
    const sale = this.guestSales.find((s) => s.id === saleId);
    if (sale) {
      sale.status = status;
      if (trackingNumber) {
        sale.trackingNumber = trackingNumber;
      }
      this.saveGuestSales();
      return true;
    }
    return false;
  }

  /**
   * Update guest purchase status
   */
  updateGuestPurchaseStatus(
    purchaseId: string,
    status: GuestPurchase["status"],
  ): boolean {
    const purchase = this.guestPurchases.find((p) => p.id === purchaseId);
    if (purchase) {
      purchase.status = status;
      this.saveGuestPurchases();
      return true;
    }
    return false;
  }

  /**
   * Calculate commission based on amount
   */
  private calculateCommission(amount: number): number {
    // Standard 10% commission
    return amount * 0.1;
  }

  /**
   * Calculate platform fee
   */
  private calculatePlatformFee(amount: number): number {
    // Standard 3% platform fee
    return amount * 0.03;
  }

  /**
   * Load guest data from localStorage
   */
  private loadGuestData(): void {
    try {
      const savedSales = localStorage.getItem("guestSales");
      if (savedSales) {
        this.guestSales = JSON.parse(savedSales);
      }

      const savedPurchases = localStorage.getItem("guestPurchases");
      if (savedPurchases) {
        this.guestPurchases = JSON.parse(savedPurchases);
      }
    } catch (error) {
      console.error("Error loading guest data:", error);
      this.guestSales = [];
      this.guestPurchases = [];
    }
  }

  /**
   * Save guest sales to localStorage
   */
  private saveGuestSales(): void {
    try {
      localStorage.setItem("guestSales", JSON.stringify(this.guestSales));
    } catch (error) {
      console.error("Error saving guest sales:", error);
    }
  }

  /**
   * Save guest purchases to localStorage
   */
  private saveGuestPurchases(): void {
    try {
      localStorage.setItem(
        "guestPurchases",
        JSON.stringify(this.guestPurchases),
      );
    } catch (error) {
      console.error("Error saving guest purchases:", error);
    }
  }

  /**
   * Clear all guest data (called when user signs up)
   */
  clearGuestData(): void {
    this.guestSales = [];
    this.guestPurchases = [];
    localStorage.removeItem("guestSales");
    localStorage.removeItem("guestPurchases");
  }

  /**
   * Migrate guest sales to a new user account
   */
  migrateGuestSales(newUser: any, allSales: any[] = []): any[] {
    try {
      const guestSales = this.getGuestSales();

      if (guestSales.length === 0) {
        return allSales; // No guest sales to migrate
      }

      console.log(`🔄 Migrating ${guestSales.length} guest sales to user account`);

      // Convert guest sales to user sales format
      const migratedSales = guestSales.map(guestSale => ({
        id: guestSale.id,
        userId: newUser.id,
        userEmail: newUser.email,
        userName: newUser.name || newUser.username,
        productId: guestSale.productId,
        productName: guestSale.productName,
        productImage: guestSale.productImage,
        amount: guestSale.amount,
        commission: guestSale.commission,
        platformFee: guestSale.platformFee,
        netAmount: guestSale.netAmount,
        date: guestSale.date,
        status: guestSale.status,
        paymentMethod: guestSale.paymentMethod,
        buyerEmail: guestSale.buyerEmail,
        buyerName: guestSale.buyerName,
        shippingAddress: guestSale.shippingAddress,
        trackingNumber: guestSale.trackingNumber,
        migratedFromGuest: true
      }));

      // Combine with existing sales
      const updatedSales = [...allSales, ...migratedSales];

      // Clear guest data after successful migration
      this.clearGuestData();

      console.log(`✅ Successfully migrated ${migratedSales.length} guest sales`);
      return updatedSales;

    } catch (error) {
      console.error('❌ Error migrating guest sales:', error);
      return allSales; // Return original sales array on error
    }
  }

  /**
   * Get guest analytics
   */
  getGuestAnalytics() {
    const totalSales = this.guestSales.reduce(
      (sum, sale) => sum + sale.netAmount,
      0,
    );
    const totalPurchases = this.guestPurchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0,
    );
    const totalCommissions = this.guestSales.reduce(
      (sum, sale) => sum + sale.commission,
      0,
    );

    return {
      salesCount: this.guestSales.length,
      purchaseCount: this.guestPurchases.length,
      totalSales,
      totalPurchases,
      totalCommissions,
      recentSales: this.guestSales.slice(-5),
      recentPurchases: this.guestPurchases.slice(-5),
    };
  }
}

export default new GuestSalesService();
