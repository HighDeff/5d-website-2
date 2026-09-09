interface GuestUpload {
  id: string;
  productName: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  sellerInfo: {
    name: string;
    email: string;
    phone?: string;
    paymentMethod: "paypal" | "cashapp";
    paymentHandle: string; // PayPal email or CashApp $tag
  };
  dateCreated: string;
  status: "active" | "sold" | "expired";
  views: number;
  platformFee: number; // 15% for guests, 10% for members
  sellerAmount: number; // Amount seller receives after fee
}

interface QuickSale {
  id: string;
  guestUploadId: string;
  buyerInfo: {
    name: string;
    email: string;
    paymentMethod: "paypal" | "cashapp";
    paymentHandle: string;
  };
  sellerInfo: {
    name: string;
    paymentMethod: "paypal" | "cashapp";
    paymentHandle: string;
  };
  amount: number;
  platformFee: number;
  sellerAmount: number;
  platformInfo: {
    name: string;
    paypal: string;
    cashapp: string;
  };
  status: "pending" | "completed" | "cancelled";
  dateCreated: string;
}

class GuestUploadService {
  private static readonly GUEST_UPLOADS_KEY = "guestUploads";
  private static readonly QUICK_SALES_KEY = "quickSales";

  // Platform information for payments
  private static readonly PLATFORM_INFO = {
    name: "Lilly's Marketplace",
    paypal: "payments@lillysmarketplace.com",
    cashapp: "$LillysMarketplace",
  };

  static createGuestUpload(uploadData: {
    productName: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    condition: string;
    sellerInfo: {
      name: string;
      email: string;
      phone?: string;
      paymentMethod: "paypal" | "cashapp";
      paymentHandle: string;
    };
  }): { success: boolean; upload?: GuestUpload; error?: string } {
    try {
      const platformFee = uploadData.price * 0.15; // 15% fee for guests
      const sellerAmount = uploadData.price - platformFee;

      const newUpload: GuestUpload = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productName: uploadData.productName,
        description: uploadData.description,
        price: uploadData.price,
        images: uploadData.images,
        category: uploadData.category,
        condition: uploadData.condition,
        sellerInfo: uploadData.sellerInfo,
        dateCreated: new Date().toISOString(),
        status: "active",
        views: 0,
        platformFee,
        sellerAmount,
      };

      const existingUploads = this.getGuestUploads();
      const updatedUploads = [...existingUploads, newUpload];
      localStorage.setItem(
        this.GUEST_UPLOADS_KEY,
        JSON.stringify(updatedUploads),
      );

      return { success: true, upload: newUpload };
    } catch (error) {
      console.error("Failed to create guest upload:", error);
      return { success: false, error: "Failed to create upload" };
    }
  }

  static getGuestUploads(): GuestUpload[] {
    try {
      const uploads = localStorage.getItem(this.GUEST_UPLOADS_KEY);
      return uploads ? JSON.parse(uploads) : [];
    } catch {
      return [];
    }
  }

  static createQuickSale(
    guestUploadId: string,
    buyerInfo: {
      name: string;
      email: string;
      paymentMethod: "paypal" | "cashapp";
      paymentHandle: string;
    },
  ): {
    success: boolean;
    sale?: QuickSale;
    instructions?: string;
    error?: string;
  } {
    try {
      const guestUploads = this.getGuestUploads();
      const upload = guestUploads.find((u) => u.id === guestUploadId);

      if (!upload || upload.status !== "active") {
        return {
          success: false,
          error: "Upload not found or no longer available",
        };
      }

      const newSale: QuickSale = {
        id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        guestUploadId,
        buyerInfo,
        sellerInfo: {
          name: upload.sellerInfo.name,
          paymentMethod: upload.sellerInfo.paymentMethod,
          paymentHandle: upload.sellerInfo.paymentHandle,
        },
        amount: upload.price,
        platformFee: upload.platformFee,
        sellerAmount: upload.sellerAmount,
        platformInfo: this.PLATFORM_INFO,
        status: "pending",
        dateCreated: new Date().toISOString(),
      };

      // Save sale
      const existingSales = this.getQuickSales();
      const updatedSales = [...existingSales, newSale];
      localStorage.setItem(this.QUICK_SALES_KEY, JSON.stringify(updatedSales));

      // Mark upload as sold
      const updatedUploads = guestUploads.map((u) =>
        u.id === guestUploadId ? { ...u, status: "sold" as const } : u,
      );
      localStorage.setItem(
        this.GUEST_UPLOADS_KEY,
        JSON.stringify(updatedUploads),
      );

      // Generate payment instructions
      const instructions = this.generatePaymentInstructions(newSale);

      return { success: true, sale: newSale, instructions };
    } catch (error) {
      console.error("Failed to create quick sale:", error);
      return { success: false, error: "Failed to process sale" };
    }
  }

  static getQuickSales(): QuickSale[] {
    try {
      const sales = localStorage.getItem(this.QUICK_SALES_KEY);
      return sales ? JSON.parse(sales) : [];
    } catch {
      return [];
    }
  }

  private static generatePaymentInstructions(sale: QuickSale): string {
    const platformPayment =
      sale.buyerInfo.paymentMethod === "paypal"
        ? this.PLATFORM_INFO.paypal
        : this.PLATFORM_INFO.cashapp;

    const sellerPayment =
      sale.sellerInfo.paymentMethod === "paypal"
        ? sale.sellerInfo.paymentHandle
        : sale.sellerInfo.paymentHandle;

    return `
🛒 Purchase Confirmation - Sale #${sale.id.slice(-8)}

💰 PAYMENT INSTRUCTIONS:
1. Send $${sale.amount} via ${sale.buyerInfo.paymentMethod.toUpperCase()} to: ${platformPayment}
2. Include note: "Sale ${sale.id.slice(-8)}"

📦 WHAT HAPPENS NEXT:
• We collect payment and deduct $${sale.platformFee.toFixed(2)} platform fee
• Seller receives $${sale.sellerAmount.toFixed(2)} via ${sale.sellerInfo.paymentMethod.toUpperCase()}: ${sellerPayment}
• Seller will contact you to arrange pickup/delivery

⚡ COMPLETE YOUR PURCHASE:
Send payment now to secure this item!

Questions? Contact: ${this.PLATFORM_INFO.paypal}
    `.trim();
  }

  static incrementViews(uploadId: string): void {
    try {
      const uploads = this.getGuestUploads();
      const updatedUploads = uploads.map((upload) =>
        upload.id === uploadId
          ? { ...upload, views: upload.views + 1 }
          : upload,
      );
      localStorage.setItem(
        this.GUEST_UPLOADS_KEY,
        JSON.stringify(updatedUploads),
      );
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  }

  static getActiveGuestUploads(): GuestUpload[] {
    return this.getGuestUploads().filter(
      (upload) => upload.status === "active",
    );
  }

  static createTempAccount(
    email: string,
    name?: string,
  ): {
    success: boolean;
    tempUser?: any;
    error?: string;
  } {
    try {
      const tempUser = {
        id: `temp_${Date.now()}`,
        name: name || email.split("@")[0],
        email,
        membershipLevel: "guest",
        memberSince: new Date().toISOString(),
        totalSales: 0,
        totalPurchases: 0,
        salesCount: 0,
        purchaseCount: 0,
        rating: 5.0,
        favoriteProducts: [],
        favoriteUsers: [],
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: "active",
        verified: false,
        isTemp: true,
      };

      // Store temp user
      localStorage.setItem("tempUser", JSON.stringify(tempUser));

      return { success: true, tempUser };
    } catch (error) {
      console.error("Failed to create temp account:", error);
      return { success: false, error: "Failed to create temporary account" };
    }
  }
}

export default GuestUploadService;
export type { GuestUpload, QuickSale };
