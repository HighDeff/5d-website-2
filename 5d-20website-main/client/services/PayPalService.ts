interface PayPalPayment {
  id: string;
  amount: number;
  currency: string;
  description: string;
  sellerId: string;
  buyerId: string;
  productId: string;
  platformFee: number;
  sellerAmount: number;
  status: "pending" | "approved" | "completed" | "failed" | "cancelled";
  paypalOrderId?: string;
  approvalUrl?: string;
  createdAt: string;
  completedAt?: string;
}

interface PayPalCheckoutOptions {
  amount: number;
  description: string;
  sellerId: string;
  buyerId: string;
  productId: string;
  platformFeePercent?: number;
}

class PayPalService {
  private static readonly PAYPAL_CLIENT_ID =
    import.meta.env.VITE_PAYPAL_CLIENT_ID ||
    "AYGb7zMgMbFP8kgVRw0uKQz5QbFkNHYhEJz4A0DpNwO8QV2z3KlJZKWDT8yU9vBF"; // Production client ID
  private static readonly PAYPAL_BASE_URL = "https://api.paypal.com"; // Production URL
  private static readonly PAYMENTS_KEY = "paypalPayments";
  private static readonly DEMO_MODE = !import.meta.env.VITE_PAYPAL_CLIENT_ID; // Auto-detect: demo if no client ID provided

  static initializePayPal(): Promise<any> {
    return new Promise((resolve, reject) => {
      // In demo mode, don't load real PayPal SDK
      if (this.DEMO_MODE) {
        console.log("🧪 PayPal Demo Mode - Not loading real PayPal SDK");
        resolve({
          demo: true,
          Buttons: () => ({
            render: () => console.log("Demo PayPal buttons rendered"),
          }),
        });
        return;
      }

      // Check if PayPal SDK is already loaded
      if (window.paypal) {
        resolve(window.paypal);
        return;
      }

      // Load PayPal SDK (only in production)
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.PAYPAL_CLIENT_ID}&currency=USD`;
      script.onload = () => {
        if (window.paypal) {
          resolve(window.paypal);
        } else {
          reject(new Error("PayPal SDK failed to load"));
        }
      };
      script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
      document.head.appendChild(script);
    });
  }

  static async createPayment(options: PayPalCheckoutOptions): Promise<{
    success: boolean;
    payment?: PayPalPayment;
    error?: string;
  }> {
    try {
      const platformFeePercent = options.platformFeePercent || 0.1; // 10% default
      const platformFee = options.amount * platformFeePercent;
      const sellerAmount = options.amount - platformFee;

      const payment: PayPalPayment = {
        id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: options.amount,
        currency: "USD",
        description: options.description,
        sellerId: options.sellerId,
        buyerId: options.buyerId,
        productId: options.productId,
        platformFee,
        sellerAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Save payment to localStorage
      const existingPayments = this.getPayments();
      const updatedPayments = [...existingPayments, payment];
      localStorage.setItem(this.PAYMENTS_KEY, JSON.stringify(updatedPayments));

      console.log("Created PayPal payment:", payment);

      return { success: true, payment };
    } catch (error) {
      console.error("Failed to create PayPal payment:", error);
      return { success: false, error: "Failed to create payment" };
    }
  }

  static async renderPayPalButtons(
    containerId: string,
    payment: PayPalPayment,
    onSuccess: (details: any) => void,
    onError: (error: any) => void,
  ): Promise<void> {
    try {
      // In demo mode, don't render real PayPal buttons
      if (this.DEMO_MODE) {
        console.log(
          "🧪 Demo mode - PayPal buttons not rendered. Use demo button instead.",
        );
        return;
      }

      const paypal = await this.initializePayPal();

      paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: payment.amount.toFixed(2),
                    currency_code: payment.currency,
                  },
                  description: payment.description,
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture();
              console.log("PayPal payment approved:", details);

              // Update payment status
              this.updatePaymentStatus(payment.id, "approved", {
                paypalOrderId: data.orderID,
                approvalDetails: details,
              });

              onSuccess(details);
            } catch (error) {
              console.error("PayPal approval error:", error);
              this.updatePaymentStatus(payment.id, "failed");
              onError(error);
            }
          },
          onError: (error: any) => {
            console.error("PayPal button error:", error);
            this.updatePaymentStatus(payment.id, "failed");
            onError(error);
          },
          onCancel: (data: any) => {
            console.log("PayPal payment cancelled:", data);
            this.updatePaymentStatus(payment.id, "cancelled");
          },
        })
        .render(`#${containerId}`);

      console.log("PayPal buttons rendered in container:", containerId);
    } catch (error) {
      console.error("Failed to render PayPal buttons:", error);
      throw error;
    }
  }

  static updatePaymentStatus(
    paymentId: string,
    status: PayPalPayment["status"],
    additionalData?: any,
  ): void {
    try {
      const payments = this.getPayments();
      const updatedPayments = payments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status,
              ...(additionalData || {}),
              ...(status === "completed" && {
                completedAt: new Date().toISOString(),
              }),
            }
          : payment,
      );

      localStorage.setItem(this.PAYMENTS_KEY, JSON.stringify(updatedPayments));

      console.log(`Payment ${paymentId} status updated to: ${status}`);

      // Trigger AI processing for completed payments
      if (status === "completed") {
        this.triggerAIProcessing(paymentId);
      }
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  }

  private static triggerAIProcessing(paymentId: string): void {
    // This will trigger the AI system to handle post-purchase processing
    import("./AIManagementService").then(({ default: AIManagementService }) => {
      AIManagementService.processPaymentCompletion(paymentId);
    });
  }

  static getPayments(): PayPalPayment[] {
    try {
      const payments = localStorage.getItem(this.PAYMENTS_KEY);
      return payments ? JSON.parse(payments) : [];
    } catch {
      return [];
    }
  }

  static getPaymentById(paymentId: string): PayPalPayment | null {
    const payments = this.getPayments();
    return payments.find((p) => p.id === paymentId) || null;
  }

  static getPaymentsByUser(userId: string): PayPalPayment[] {
    const payments = this.getPayments();
    return payments.filter(
      (p) => p.buyerId === userId || p.sellerId === userId,
    );
  }

  // Demo function for testing - simulates successful payment
  static simulateSuccessfulPayment(paymentId: string): void {
    console.log("🧪 Simulating successful PayPal payment...");

    setTimeout(() => {
      this.updatePaymentStatus(paymentId, "approved", {
        paypalOrderId: `SIMULATED_${Date.now()}`,
        approvalDetails: {
          id: `SIMULATED_${Date.now()}`,
          status: "COMPLETED",
          purchase_units: [
            {
              payments: {
                captures: [
                  {
                    id: `CAPTURE_${Date.now()}`,
                    status: "COMPLETED",
                    amount: {
                      currency_code: "USD",
                      value: this.getPaymentById(paymentId)?.amount.toFixed(2),
                    },
                  },
                ],
              },
            },
          ],
        },
      });

      // Mark as completed after approval
      setTimeout(() => {
        this.updatePaymentStatus(paymentId, "completed");
      }, 1000);
    }, 2000);
  }
}

// Extend window object for PayPal SDK
declare global {
  interface Window {
    paypal: any;
  }
}

export default PayPalService;
export type { PayPalPayment, PayPalCheckoutOptions };
