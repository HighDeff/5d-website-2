// Tax Management Service - Handles tax calculations, collection, and reporting
export interface TaxRecord {
  id: string;
  userId: string;
  year: number;
  quarter: number;
  salesTax: number;
  stateTax: number;
  totalTaxOwed: number;
  totalTaxPaid: number;
  status: "pending" | "paid" | "overdue" | "exempt";
  autoPayEnabled: boolean;
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  transactions: TaxTransaction[];
}

export interface TaxTransaction {
  id: string;
  saleId: string;
  amount: number;
  taxRate: number;
  taxAmount: number;
  state: string;
  city?: string;
  date: string;
}

export interface TaxSettings {
  userId: string;
  autoPayEnabled: boolean;
  taxCollectionAccount: string;
  preferredPaymentMethod: "auto-deduct" | "manual" | "quarterly";
  exemptions: string[];
  businessLicense?: string;
  taxIdNumber?: string;
  isBusinessAccount: boolean;
}

export interface TaxForm {
  id: string;
  userId: string;
  year: number;
  formType: "1099" | "W9" | "quarterly" | "annual";
  generatedAt: string;
  downloadUrl: string;
  emailSent: boolean;
}

class TaxManagementService {
  private taxRecords: TaxRecord[] = [];
  private taxSettings: TaxSettings[] = [];
  private taxForms: TaxForm[] = [];
  private readonly TAX_COLLECTION_ACCOUNT = "tax_collection_lilly_fashion";

  // Standard tax rates by state (simplified)
  private readonly STATE_TAX_RATES: { [state: string]: number } = {
    CA: 0.07, // California 7%
    NY: 0.08, // New York 8%
    TX: 0.0625, // Texas 6.25%
    FL: 0.06, // Florida 6%
    WA: 0.065, // Washington 6.5%
    // Add more states as needed
    DEFAULT: 0.06, // Default 6%
  };

  constructor() {
    this.loadData();
  }

  // ===== TAX SETTINGS =====
  setUserTaxSettings(settings: TaxSettings): boolean {
    try {
      // Remove existing settings for user
      this.taxSettings = this.taxSettings.filter(
        (s) => s.userId !== settings.userId,
      );

      // Add new settings
      this.taxSettings.push(settings);
      this.saveTaxSettings();

      console.log(`✅ Tax settings updated for user ${settings.userId}`);
      return true;
    } catch (error) {
      console.error("Error setting tax settings:", error);
      return false;
    }
  }

  getUserTaxSettings(userId: string): TaxSettings | null {
    return this.taxSettings.find((s) => s.userId === userId) || null;
  }

  // ===== TAX CALCULATION =====
  calculateTaxForSale(
    userId: string,
    saleAmount: number,
    buyerState: string,
    buyerCity?: string,
  ): {
    salesTax: number;
    stateTax: number;
    totalTax: number;
    taxRate: number;
  } {
    const userSettings = this.getUserTaxSettings(userId);

    // Check if user is exempt
    if (
      userSettings?.exemptions.includes("all") ||
      userSettings?.exemptions.includes(buyerState)
    ) {
      return { salesTax: 0, stateTax: 0, totalTax: 0, taxRate: 0 };
    }

    // Get tax rate for state
    const taxRate =
      this.STATE_TAX_RATES[buyerState] || this.STATE_TAX_RATES.DEFAULT;

    // Calculate tax amounts
    const totalTax = saleAmount * taxRate;
    const stateTax = totalTax * 0.7; // 70% goes to state
    const salesTax = totalTax * 0.3; // 30% federal sales tax

    return {
      salesTax,
      stateTax,
      totalTax,
      taxRate,
    };
  }

  // ===== TAX RECORDING =====
  recordSaleTax(
    userId: string,
    saleId: string,
    saleAmount: number,
    buyerState: string,
    buyerCity?: string,
  ): boolean {
    try {
      const taxCalc = this.calculateTaxForSale(
        userId,
        saleAmount,
        buyerState,
        buyerCity,
      );

      if (taxCalc.totalTax === 0) {
        return true; // No tax to record
      }

      // Create tax transaction
      const transaction: TaxTransaction = {
        id: `tax_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        saleId,
        amount: saleAmount,
        taxRate: taxCalc.taxRate,
        taxAmount: taxCalc.totalTax,
        state: buyerState,
        city: buyerCity,
        date: new Date().toISOString(),
      };

      // Find or create current quarter record
      const now = new Date();
      const year = now.getFullYear();
      const quarter = Math.ceil((now.getMonth() + 1) / 3);

      let taxRecord = this.taxRecords.find(
        (r) => r.userId === userId && r.year === year && r.quarter === quarter,
      );

      if (!taxRecord) {
        // Create new quarterly record
        taxRecord = {
          id: `tax_record_${userId}_${year}_Q${quarter}`,
          userId,
          year,
          quarter,
          salesTax: 0,
          stateTax: 0,
          totalTaxOwed: 0,
          totalTaxPaid: 0,
          status: "pending",
          autoPayEnabled:
            this.getUserTaxSettings(userId)?.autoPayEnabled || false,
          dueDate: this.getQuarterDueDate(year, quarter),
          createdAt: new Date().toISOString(),
          transactions: [],
        };
        this.taxRecords.push(taxRecord);
      }

      // Add transaction to record
      taxRecord.transactions.push(transaction);
      taxRecord.salesTax += taxCalc.salesTax;
      taxRecord.stateTax += taxCalc.stateTax;
      taxRecord.totalTaxOwed += taxCalc.totalTax;

      // Auto-pay if enabled
      if (taxRecord.autoPayEnabled) {
        this.processAutoPayment(taxRecord);
      }

      this.saveTaxRecords();
      console.log(`📊 Tax recorded for sale ${saleId}: $${taxCalc.totalTax}`);
      return true;
    } catch (error) {
      console.error("Error recording sale tax:", error);
      return false;
    }
  }

  // ===== TAX PAYMENTS =====
  payTaxes(userId: string, taxRecordId: string, amount: number): boolean {
    try {
      const taxRecord = this.taxRecords.find((r) => r.id === taxRecordId);
      if (!taxRecord || taxRecord.userId !== userId) {
        return false;
      }

      // Process payment
      taxRecord.totalTaxPaid += amount;

      if (taxRecord.totalTaxPaid >= taxRecord.totalTaxOwed) {
        taxRecord.status = "paid";
        taxRecord.paidDate = new Date().toISOString();
      }

      // Send to tax collection account
      this.sendToTaxCollectionAccount(amount, taxRecord);

      this.saveTaxRecords();
      console.log(`💰 Tax payment processed: $${amount} for user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error processing tax payment:", error);
      return false;
    }
  }

  private processAutoPayment(taxRecord: TaxRecord): boolean {
    try {
      // Simulate auto-payment
      const paymentAmount = taxRecord.totalTaxOwed - taxRecord.totalTaxPaid;

      if (paymentAmount > 0) {
        taxRecord.totalTaxPaid += paymentAmount;
        taxRecord.status = "paid";
        taxRecord.paidDate = new Date().toISOString();

        // Send to tax collection account
        this.sendToTaxCollectionAccount(paymentAmount, taxRecord);

        console.log(
          `🤖 Auto-payment processed: $${paymentAmount} for user ${taxRecord.userId}`,
        );
      }

      return true;
    } catch (error) {
      console.error("Error processing auto-payment:", error);
      return false;
    }
  }

  private sendToTaxCollectionAccount(
    amount: number,
    taxRecord: TaxRecord,
  ): void {
    // Record the tax collection transaction
    const taxCollection = {
      id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      account: this.TAX_COLLECTION_ACCOUNT,
      amount,
      userId: taxRecord.userId,
      taxRecordId: taxRecord.id,
      type: "tax_collection",
      date: new Date().toISOString(),
    };

    // Save to tax collection records
    const collections = JSON.parse(
      localStorage.getItem("taxCollections") || "[]",
    );
    collections.push(taxCollection);
    localStorage.setItem("taxCollections", JSON.stringify(collections));

    console.log(`🏛️ $${amount} sent to tax collection account`);
  }

  // ===== TAX FORMS =====
  generateTaxForm(
    userId: string,
    year: number,
    formType: "1099" | "W9" | "quarterly" | "annual",
  ): string {
    try {
      const userRecords = this.getUserTaxRecords(userId, year);
      const userSettings = this.getUserTaxSettings(userId);

      const form: TaxForm = {
        id: `form_${userId}_${year}_${formType}_${Date.now()}`,
        userId,
        year,
        formType,
        generatedAt: new Date().toISOString(),
        downloadUrl: this.generateFormData(userRecords, userSettings, formType),
        emailSent: false,
      };

      this.taxForms.push(form);
      this.saveTaxForms();

      // Auto-email form to user
      this.emailTaxForm(form);

      return form.id;
    } catch (error) {
      console.error("Error generating tax form:", error);
      return "";
    }
  }

  private generateFormData(
    records: TaxRecord[],
    settings: TaxSettings | null,
    formType: string,
  ): string {
    // Generate form data (in real implementation, this would create PDF/document)
    const formData = {
      formType,
      totalSales: records.reduce(
        (sum, r) =>
          sum + r.transactions.reduce((tSum, t) => tSum + t.amount, 0),
        0,
      ),
      totalTaxOwed: records.reduce((sum, r) => sum + r.totalTaxOwed, 0),
      totalTaxPaid: records.reduce((sum, r) => sum + r.totalTaxPaid, 0),
      quarters: records.map((r) => ({
        quarter: r.quarter,
        salesTax: r.salesTax,
        stateTax: r.stateTax,
        totalOwed: r.totalTaxOwed,
        totalPaid: r.totalTaxPaid,
        status: r.status,
      })),
      userInfo: settings,
      generatedAt: new Date().toISOString(),
    };

    // Return download URL (in real implementation, this would be actual file URL)
    return `data:application/json;base64,${btoa(JSON.stringify(formData, null, 2))}`;
  }

  private emailTaxForm(form: TaxForm): void {
    // Simulate email sending
    console.log(`📧 Tax form ${form.formType} emailed to user ${form.userId}`);
    form.emailSent = true;
  }

  // ===== REPORTING =====
  getUserTaxRecords(userId: string, year?: number): TaxRecord[] {
    let records = this.taxRecords.filter((r) => r.userId === userId);

    if (year) {
      records = records.filter((r) => r.year === year);
    }

    return records.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.quarter - a.quarter;
    });
  }

  getUserTaxSummary(userId: string): {
    currentYearOwed: number;
    currentYearPaid: number;
    outstandingBalance: number;
    nextDueDate: string | null;
    taxStatus: "current" | "overdue" | "exempt";
  } {
    const currentYear = new Date().getFullYear();
    const currentRecords = this.getUserTaxRecords(userId, currentYear);

    const currentYearOwed = currentRecords.reduce(
      (sum, r) => sum + r.totalTaxOwed,
      0,
    );
    const currentYearPaid = currentRecords.reduce(
      (sum, r) => sum + r.totalTaxPaid,
      0,
    );
    const outstandingBalance = currentYearOwed - currentYearPaid;

    // Find next due date
    const unpaidRecords = currentRecords.filter((r) => r.status === "pending");
    const nextDueDate =
      unpaidRecords.length > 0
        ? unpaidRecords.sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
          )[0].dueDate
        : null;

    // Determine tax status
    let taxStatus: "current" | "overdue" | "exempt" = "current";

    if (unpaidRecords.some((r) => new Date(r.dueDate) < new Date())) {
      taxStatus = "overdue";
    } else if (currentRecords.length === 0 && currentYearOwed === 0) {
      const userSettings = this.getUserTaxSettings(userId);
      if (userSettings?.exemptions.includes("all")) {
        taxStatus = "exempt";
      }
    }

    return {
      currentYearOwed,
      currentYearPaid,
      outstandingBalance,
      nextDueDate,
      taxStatus,
    };
  }

  // ===== ADMIN FUNCTIONS =====
  getAllTaxCollections(): any[] {
    try {
      return JSON.parse(localStorage.getItem("taxCollections") || "[]");
    } catch {
      return [];
    }
  }

  getTotalTaxCollected(): number {
    const collections = this.getAllTaxCollections();
    return collections.reduce(
      (sum: number, c: any) => sum + (c.amount || 0),
      0,
    );
  }

  // ===== UTILITY METHODS =====
  private getQuarterDueDate(year: number, quarter: number): string {
    const dueDates = {
      1: `${year}-04-15`, // Q1 due April 15
      2: `${year}-07-15`, // Q2 due July 15
      3: `${year}-10-15`, // Q3 due October 15
      4: `${year + 1}-01-31`, // Q4 due January 31 next year
    };

    return dueDates[quarter as keyof typeof dueDates] || `${year}-12-31`;
  }

  // ===== DATA PERSISTENCE =====
  private loadData(): void {
    try {
      const savedRecords = localStorage.getItem("taxRecords");
      if (savedRecords) this.taxRecords = JSON.parse(savedRecords);

      const savedSettings = localStorage.getItem("taxSettings");
      if (savedSettings) this.taxSettings = JSON.parse(savedSettings);

      const savedForms = localStorage.getItem("taxForms");
      if (savedForms) this.taxForms = JSON.parse(savedForms);
    } catch (error) {
      console.error("Error loading tax data:", error);
    }
  }

  private saveTaxRecords(): void {
    localStorage.setItem("taxRecords", JSON.stringify(this.taxRecords));
  }

  private saveTaxSettings(): void {
    localStorage.setItem("taxSettings", JSON.stringify(this.taxSettings));
  }

  private saveTaxForms(): void {
    localStorage.setItem("taxForms", JSON.stringify(this.taxForms));
  }
}

// Export singleton instance
export default new TaxManagementService();
