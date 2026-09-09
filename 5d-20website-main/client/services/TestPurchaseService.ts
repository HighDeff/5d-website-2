// Test Purchase Service - Handles test purchases with fake money for admin testing
import { CartItem } from "./EnhancedShoppingCartService";
import { User, Sale } from "@/hooks/useUserAuth";
import GuestSalesService from "./GuestSalesService";

export interface TestPurchaseResult {
  success: boolean;
  orderId: string;
  transactionId: string;
  items: CartItem[];
  totalAmount: number;
  testMode: boolean;
  paymentMethod: "test_card" | "test_paypal" | "test_cashapp";
  errors: string[];
  processingTime: number;
}

export interface TestPaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

class TestPurchaseService {
  private testTransactions: TestPurchaseResult[] = [];
  private adminEmails = ["haynes.d1993@yahoo.com"];

  /**
   * Process test purchase using fake money
   */
  async processTestPurchase(
    cartItems: CartItem[],
    buyerInfo: {
      userId?: string;
      email: string;
      name: string;
      isGuest: boolean;
      isAdmin: boolean;
    },
    paymentInfo: TestPaymentInfo,
    paymentMethod: TestPurchaseResult["paymentMethod"] = "test_card",
  ): Promise<TestPurchaseResult> {
    const startTime = Date.now();

    const result: TestPurchaseResult = {
      success: false,
      orderId: this.generateOrderId(),
      transactionId: this.generateTransactionId(),
      items: [...cartItems],
      totalAmount: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      testMode: true,
      paymentMethod,
      errors: [],
      processingTime: 0,
    };

    try {
      // Validate cart items
      const cartValidation = this.validateCartForPurchase(cartItems);
      if (!cartValidation.isValid) {
        result.errors = cartValidation.errors;
        return result;
      }

      // Validate payment info (mock validation)
      const paymentValidation = this.validateTestPayment(
        paymentInfo,
        paymentMethod,
      );
      if (!paymentValidation.isValid) {
        result.errors = paymentValidation.errors;
        return result;
      }

      // Process payment (simulate network delay)
      await this.simulatePaymentProcessing();

      // Create sales records for each seller
      const salesCreated = await this.createTestSalesRecords(
        cartItems,
        buyerInfo,
        result.orderId,
      );

      if (!salesCreated.success) {
        result.errors = salesCreated.errors;
        return result;
      }

      // Send test funds to backup passthrough for admin testing
      if (buyerInfo.isAdmin) {
        await this.sendToBackupPassthrough(result);
      }

      result.success = true;
      result.processingTime = Date.now() - startTime;

      // Log transaction
      this.testTransactions.push(result);
      this.saveTestTransactions();

      return result;
    } catch (error) {
      result.errors.push(`Purchase processing failed: ${error.message}`);
      result.processingTime = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Create test upload and purchase for different user types
   */
  async createTestScenarios(): Promise<{
    newUser: TestPurchaseResult;
    guest: TestPurchaseResult;
    admin: TestPurchaseResult;
  }> {
    // Test items
    const testItems: CartItem[] = [
      {
        id: "test-item-1",
        name: "Test Product - Designer Bag",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        category: "Accessories",
        sellerId: "test-seller-1",
        sellerName: "Test Seller",
        quantity: 1,
        addedAt: new Date().toISOString(),
      },
    ];

    const testPayment: TestPaymentInfo = {
      cardNumber: "4111111111111111", // Test Visa card
      expiryDate: "12/25",
      cvv: "123",
      cardholderName: "Test User",
      billingAddress: {
        street: "123 Test Street",
        city: "Test City",
        state: "CA",
        zipCode: "90210",
        country: "US",
      },
    };

    // Test new user purchase
    const newUserResult = await this.processTestPurchase(
      testItems,
      {
        userId: "test-new-user",
        email: "newuser@test.com",
        name: "New Test User",
        isGuest: false,
        isAdmin: false,
      },
      testPayment,
    );

    // Test guest purchase
    const guestResult = await this.processTestPurchase(
      testItems,
      {
        email: "guest@test.com",
        name: "Guest User",
        isGuest: true,
        isAdmin: false,
      },
      testPayment,
    );

    // Test admin purchase
    const adminResult = await this.processTestPurchase(
      testItems,
      {
        userId: "admin-test",
        email: "haynes.d1993@yahoo.com",
        name: "Admin User",
        isGuest: false,
        isAdmin: true,
      },
      testPayment,
    );

    return {
      newUser: newUserResult,
      guest: guestResult,
      admin: adminResult,
    };
  }

  /**
   * Validate cart for purchase
   */
  private validateCartForPurchase(cartItems: CartItem[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (cartItems.length === 0) {
      errors.push("Cart is empty");
    }

    cartItems.forEach((item, index) => {
      if (!item.name || item.name.trim() === "") {
        errors.push(`Item ${index + 1} is missing name`);
      }
      if (item.price <= 0) {
        errors.push(`Item ${index + 1} has invalid price`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1} has invalid quantity`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate test payment information
   */
  private validateTestPayment(
    paymentInfo: TestPaymentInfo,
    method: TestPurchaseResult["paymentMethod"],
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate card number for test cards
    const validTestCards = [
      "4111111111111111", // Visa
      "5555555555554444", // Mastercard
      "378282246310005", // Amex
    ];

    if (method === "test_card") {
      if (!validTestCards.includes(paymentInfo.cardNumber)) {
        errors.push(
          "Invalid test card number. Use 4111111111111111 for testing",
        );
      }

      if (
        !paymentInfo.expiryDate ||
        !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)
      ) {
        errors.push("Invalid expiry date format. Use MM/YY");
      }

      if (!paymentInfo.cvv || !/^\d{3,4}$/.test(paymentInfo.cvv)) {
        errors.push("Invalid CVV. Use 3-4 digits");
      }
    }

    if (
      !paymentInfo.cardholderName ||
      paymentInfo.cardholderName.trim() === ""
    ) {
      errors.push("Cardholder name is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Simulate payment processing delay
   */
  private async simulatePaymentProcessing(): Promise<void> {
    // Simulate 1-3 second processing time
    const delay = Math.random() * 2000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Simulate occasional failures for testing
    if (Math.random() < 0.05) {
      // 5% failure rate
      throw new Error("Simulated payment failure");
    }
  }

  /**
   * Create sales records for test purchase
   */
  private async createTestSalesRecords(
    cartItems: CartItem[],
    buyerInfo: any,
    orderId: string,
  ): Promise<{
    success: boolean;
    errors: string[];
    salesIds: string[];
  }> {
    const errors: string[] = [];
    const salesIds: string[] = [];

    try {
      for (const item of cartItems) {
        const saleData = {
          id: `test_sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: item.id,
          productName: item.name,
          sellerId: item.sellerId || "unknown",
          buyerId: buyerInfo.userId || "guest",
          buyerName: buyerInfo.name,
          amount: item.price * item.quantity,
          commission: item.price * item.quantity * 0.1, // 10% commission
          date: new Date().toISOString(),
          status: "completed" as const,
          paymentMethod: "test_payment" as const,
          contactInfo: {
            email: buyerInfo.email,
            orderId: orderId,
          },
        };

        if (buyerInfo.isGuest) {
          // Record guest sale
          GuestSalesService.recordGuestSale({
            productId: item.id,
            productName: item.name,
            productImage: item.image,
            sellerEmail: "test@seller.com",
            buyerEmail: buyerInfo.email,
            buyerName: buyerInfo.name,
            amount: item.price * item.quantity,
            paymentMethod: "test_card",
          });
        } else {
          // Record regular user sale
          const existingSales = JSON.parse(
            localStorage.getItem("allSales") || "[]",
          );
          existingSales.push(saleData);
          localStorage.setItem("allSales", JSON.stringify(existingSales));
        }

        salesIds.push(saleData.id);
      }

      return {
        success: true,
        errors: [],
        salesIds,
      };
    } catch (error) {
      errors.push(`Failed to create sales records: ${error.message}`);
      return {
        success: false,
        errors,
        salesIds: [],
      };
    }
  }

  /**
   * Send test funds to backup passthrough for admin
   */
  private async sendToBackupPassthrough(
    result: TestPurchaseResult,
  ): Promise<void> {
    // Simulate sending funds to backup account
    const passthroughData = {
      transactionId: result.transactionId,
      orderId: result.orderId,
      amount: result.totalAmount,
      timestamp: new Date().toISOString(),
      testMode: true,
      purpose: "admin_testing",
    };

    // Save to test passthrough log
    const existingPassthrough = JSON.parse(
      localStorage.getItem("testPassthroughLog") || "[]",
    );
    existingPassthrough.push(passthroughData);
    localStorage.setItem(
      "testPassthroughLog",
      JSON.stringify(existingPassthrough),
    );

    console.log("Test funds sent to backup passthrough:", passthroughData);
  }

  /**
   * Generate order ID
   */
  private generateOrderId(): string {
    return `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  /**
   * Generate transaction ID
   */
  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Get test transaction history
   */
  getTestTransactions(): TestPurchaseResult[] {
    return [...this.testTransactions];
  }

  /**
   * Get test purchase analytics
   */
  getTestAnalytics() {
    const totalTransactions = this.testTransactions.length;
    const successfulTransactions = this.testTransactions.filter(
      (t) => t.success,
    ).length;
    const totalAmount = this.testTransactions
      .filter((t) => t.success)
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      totalTransactions,
      successfulTransactions,
      failureRate:
        ((totalTransactions - successfulTransactions) / totalTransactions) *
        100,
      totalAmount,
      averageOrderValue:
        successfulTransactions > 0 ? totalAmount / successfulTransactions : 0,
      averageProcessingTime:
        this.testTransactions.reduce((sum, t) => sum + t.processingTime, 0) /
        totalTransactions,
    };
  }

  /**
   * Save test transactions to localStorage
   */
  private saveTestTransactions(): void {
    try {
      localStorage.setItem(
        "testTransactions",
        JSON.stringify(this.testTransactions),
      );
    } catch (error) {
      console.error("Error saving test transactions:", error);
    }
  }

  /**
   * Load test transactions from localStorage
   */
  private loadTestTransactions(): void {
    try {
      const saved = localStorage.getItem("testTransactions");
      if (saved) {
        this.testTransactions = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading test transactions:", error);
      this.testTransactions = [];
    }
  }
}

export default new TestPurchaseService();
